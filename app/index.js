'use strict';

const normalizeUrl = require('normalize-url');
const humanizeUrl = require('humanize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');
const utils = require('./utils');

module.exports = class extends Generator {
  constructor(a, b) {
    super(a, b);

    this.option('org', {
      type: 'string',
      desc: 'Publish to a GitHub organization account',
    });

    this.option('coverage', {
      type: 'boolean',
      desc: 'Add code coverage with nyc',
    });

    this.option('codecov', {
      type: 'boolean',
      desc: 'Upload coverage to codecov.io (implies coverage)',
    });
  }

  init() {
    return this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: _s.slugify(this.appname),
        filter: x => utils.slugifyPackageName(x),
      },
      {
        name: 'moduleDescription',
        message: 'What is your module description?',
        default: 'A mediocre module.',
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        store: true,
        validate: x => (x.length > 0 ? true : 'You have to provide a username'),
        when: () => !this.options.org,
      },
      {
        name: 'website',
        message: 'What is the URL of your website?',
        store: true,
        validate: x =>
          x.length > 0 ? true : 'You have to provide a website URL',
        filter: x => normalizeUrl(x),
      },
      {
        name: 'nyc',
        message: 'Do you need code coverage?',
        type: 'confirm',
        default: Boolean(this.options.codecov || this.options.coverage),
        when: () =>
          this.options.coverage === undefined &&
          this.options.codecov === undefined,
      },
      {
        name: 'codecov',
        message: 'Upload coverage to codecov.io?',
        type: 'confirm',
        default: false,
        when: x =>
          (x.nyc || this.options.coverage) &&
          this.options.codecov === undefined,
      },
    ])
      .then(props => {
        const or = (option, prop) =>
          this.options[option] === undefined
            ? props[prop || option]
            : this.options[option];

        const codecov = or('codecov');
        const nyc = codecov || or('coverage', 'nyc');
        const repoName = utils.repoName(props.moduleName);
        const camelComponentName = _s.capitalize(
          _s.camelize(repoName.replace(/^react/, ''))
        );

        const tpl = {
          moduleName: props.moduleName,
          moduleDescription: props.moduleDescription,
          camelComponentName,
          githubUsername: this.options.org || props.githubUsername,
          repoName,
          name: this.user.git.name(),
          email: this.user.git.email(),
          website: props.website,
          humanizedWebsite: humanizeUrl(props.website),
          nyc,
          codecov,
        };
        return tpl;
      })
      .then(tpl => {
        // import generator-license
        this.composeWith(require.resolve('generator-license'), {
          name: tpl.name,
          email: tpl.email,
          website: tpl.website,
          defaultLicense: 'MIT',
        });
        return tpl;
      })
      .then(tpl => {
        const mv = (from, to) => {
          this.fs.move(this.destinationPath(from), this.destinationPath(to));
        };

        this.fs.copyTpl(
          [`${this.templatePath()}/**`],
          this.destinationPath(),
          tpl
        );

        mv('_package.json', 'package.json');
        mv('babelrc', '.babelrc');
        mv('editorconfig', '.editorconfig');
        mv('eslintrc.yml', '.eslintrc.yml');
        mv('gitattributes', '.gitattributes');
        mv('gitignore', '.gitignore');
        mv('npmrc', '.npmrc');
        mv('prettierrc.yml', '.prettierrc.yml');
        mv('travis.yml', '.travis.yml');
      });
  }

  git() {
    this.spawnCommandSync('git', ['init']);
  }
};

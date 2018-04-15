import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import utils from '../app/utils';

let generator;

test.beforeEach(async () => {
  await pify(helpers.testDirectory)(path.join(__dirname, 'temp'));
  generator = helpers.createGenerator(
    'react-component:app',
    ['../../app'],
    null,
    {
      skipInstall: true,
    }
  );
});

test.serial('generates expected files', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
  });

  await pify(generator.run.bind(generator))();

  assert.file([
    '.editorconfig',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.eslintrc.yml',
    '.prettierrc.yml',
    '.travis.yml',
    'src/index.jsx',
    'test/index.js',
    'package.json',
    'README.md',
    'LICENSE',
    '.npmrc',
  ]);
});

test.serial('nyc option', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: false,
  });

  await pify(generator.run.bind(generator))();

  assert.fileContent('package.json', /"lint": "/);
  assert.fileContent('.gitignore', /\.nyc_output/);
  assert.fileContent('.gitignore', /coverage/);
  assert.fileContent('package.json', /"test": "/);
  assert.fileContent('package.json', /"nyc": "/);
  assert.noFileContent('package.json', /"codecov":/);
  assert.noFileContent('package.json', /"lcov"/);
  assert.noFileContent('.travis.yml', /codecov/);
});

test.serial('codecov option', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  });

  await pify(generator.run.bind(generator))();

  assert.fileContent('package.json', /"lint": "/);
  assert.fileContent('.gitignore', /\.nyc_output/);
  assert.fileContent('.gitignore', /coverage/);
  assert.fileContent('package.json', /"test": "/);
  assert.fileContent('package.json', /"nyc": "/);
  assert.fileContent('package.json', /"codecov":/);
  assert.fileContent('package.json', /"lcov"/g);
  assert.fileContent('.travis.yml', /codecov/);
});

test('parse scoped package names', t => {
  t.is(
    utils.slugifyPackageName('author/thing'),
    'author-thing',
    'slugify non-scoped packages'
  );
  t.is(
    utils.slugifyPackageName('@author/thing'),
    '@author/thing',
    'accept scoped packages'
  );
  t.is(
    utils.slugifyPackageName('@author/hi/there'),
    'author-hi-there',
    'fall back to regular slugify if invalid scoped name'
  );
});

test.serial('prompts for description', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    moduleDescription: 'foo',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  });

  await pify(generator.run.bind(generator))();

  assert.fileContent('package.json', /"description": "foo",/);
  assert.fileContent('README.md', /> foo/);
});

test.serial('defaults to superb description', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  });

  await pify(generator.run.bind(generator))();

  assert.fileContent('package.json', /"description": "A mediocre module.",/);
  assert.fileContent('README.md', /> A mediocre module./);
});

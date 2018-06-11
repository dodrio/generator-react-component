# generator-react-component

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dependency Status](https://img.shields.io/david/m31271n/generator-react-component.svg)](#)
[![DevDependency Status](https://img.shields.io/david/m31271n/generator-react-component.svg)](#)
[![Travis Build Status](https://img.shields.io/travis/m31271n/generator-react-component/master.svg)](#)
[![NPM Downloads](https://img.shields.io/npm/dm/@m31271n/generator-react-component.svg)](#)

> Scaffold out a react component.

Features:

* Formatter
  * [Prettier](https://prettier.io/)
* Linter:
  * [ESLint](https://eslint.org/) with `eslint-config-react-app`
* Git Hooks
  * pre commit
* Preview
  * [Storybook](https://github.com/storybooks/storybook) integrated with \* [Jest](https://facebook.github.io/jest/)

## Install

```
$ npm install -g yo @m31271n/generator-react-component
```

## Usage

With [yo](https://github.com/yeoman/yo):

```
$ yo @m31271n/react-component
```

There are multiple command-line options available:

```
$ yo @m31271n/react-component --help

Usage:
  yo react-component [options]

Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers                      Default: false
        --skip-install  # Do not automatically install dependencies           Default: false
        --org           # Publish to a GitHub organization account
        --coverage      # Add code coverage with nyc
        --codecov       # Upload coverage to codecov.io (implies coverage)
```

The `--org` option takes a string value (i.e. `--org=2players`). All others are boolean flags and can be negated with the `no` prefix (i.e. `--no-codecov`). You will be prompted for any options not passed on the command-line.

## Tip

Use [chalk](https://github.com/sindresorhus/chalk) if you want colors in your CLI.

## License

[MIT](https://stack.m31271n.com/licenses/MIT.txt) © [m31271n](https://stack.m31271n.com)

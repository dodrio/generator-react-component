/* eslint-env jest */

const os = require('os')
const path = require('path')
const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const pify = require('pify')
const utils = require('../utils')

let generator

beforeEach(async () => {
  await pify(helpers.testDirectory)(path.join(os.tmpdir(), 'temp'))
  generator = helpers.createGenerator(
    'react-component:app',
    [path.join(__dirname, '..')],
    null,
    {
      skipInstall: true,
    }
  )
})

test('generates expected files', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
  })

  await pify(generator.run.bind(generator))()

  assert.file([
    'src/index.jsx',
    'README.md',
    'package.json',
    '.babelrc',
    '.browserslistrc',
    '.editorconfig',
    '.eslintrc.yml',
    '.gitattributes',
    '.gitignore',
    '.git',
    '.npmrc',
    '.prettierrc.yml',
    '.travis.yml',
    'stories/',
    '.storybook/config.js',
    'LICENSE',
  ])
})

test('nyc option', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: false,
  })

  await pify(generator.run.bind(generator))()

  assert.fileContent('package.json', /"lint": "/)
  assert.fileContent('.gitignore', /\.nyc_output/)
  assert.fileContent('.gitignore', /coverage/)
  assert.fileContent('package.json', /"test": "/)
  assert.fileContent('package.json', /"nyc": "/)
  assert.noFileContent('package.json', /"codecov":/)
  assert.noFileContent('package.json', /"lcov"/)
  assert.noFileContent('.travis.yml', /codecov/)
})

test('codecov option', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  })

  await pify(generator.run.bind(generator))()

  assert.fileContent('package.json', /"lint": "/)
  assert.fileContent('.gitignore', /\.nyc_output/)
  assert.fileContent('.gitignore', /coverage/)
  assert.fileContent('package.json', /"test": "/)
  assert.fileContent('package.json', /"nyc": "/)
  assert.fileContent('package.json', /"codecov":/)
  assert.fileContent('package.json', /"lcov"/g)
  assert.fileContent('.travis.yml', /codecov/)
})

test('parse scoped package names', () => {
  // slugify non-scoped packages
  expect(utils.slugifyPackageName('author/thing')).toBe('author-thing')
  // accept scoped packages
  expect(utils.slugifyPackageName('@author/thing')).toBe('@author/thing')
  // fall back to regular slugify if invalid scoped name
  expect(utils.slugifyPackageName('@author/hi/there')).toBe('author-hi-there')
})

test('prompts for description', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    moduleDescription: 'foo',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  })

  await pify(generator.run.bind(generator))()

  assert.fileContent('package.json', /"description": "foo",/)
  assert.fileContent('README.md', /> foo/)
})

test('default description', async () => {
  helpers.mockPrompt(generator, {
    moduleName: 'test',
    githubUsername: 'test',
    website: 'test.com',
    nyc: true,
    codecov: true,
  })

  await pify(generator.run.bind(generator))()

  assert.fileContent('package.json', /"description": "A mediocre module.",/)
  assert.fileContent('README.md', /> A mediocre module./)
})

module.exports = {
  require: ['./test/test-helper.js', './test/setup.js'],
  timeout: 10000,
  exit: true,
  recursive: true,
  extension: ['js'],
  spec: ['test/**/*.test.js'],
  ignore: ['node_modules/**'],
  color: true,
  diff: true,
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  watch: false,
  'watch-files': ['test/**/*.test.js'],
  'watch-ignore': ['node_modules', '.git']
};

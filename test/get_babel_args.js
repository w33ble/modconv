const assert = require('assert');
const getBabelArgs = require('../src/get_babel_args');

const defaultOptions = {};

module.exports = [
  function checkCjsArgs() {
    const output = getBabelArgs(defaultOptions);
    assert.deepEqual(output, [
      '--plugins',
      '@babel/plugin-transform-modules-commonjs,babel-plugin-add-module-exports',
    ]);
  },

  function checkUmdArgs() {
    const output = getBabelArgs({ ...defaultOptions, format: 'umd' });
    assert.deepEqual(output, ['--plugins', '@babel/plugin-transform-modules-umd']);
  },

  function checkAmdArgs() {
    const output = getBabelArgs({ ...defaultOptions, format: 'amd' });
    assert.deepEqual(output, ['--plugins', '@babel/plugin-transform-modules-amd']);
  },

  function checkSystemArgs() {
    const output = getBabelArgs({ ...defaultOptions, format: 'systemjs' });
    assert.deepEqual(output, ['--plugins', '@babel/plugin-transform-modules-systemjs']);
  },

  function checkOutputFile() {
    const output = getBabelArgs({ ...defaultOptions, outFile: 'filename.js' });
    assert.deepEqual(output, [
      '-o',
      'filename.js',
      '--plugins',
      '@babel/plugin-transform-modules-commonjs,babel-plugin-add-module-exports',
    ]);
  },

  function checkOutputDir() {
    const output = getBabelArgs({ ...defaultOptions, outDir: 'build' });
    assert.deepEqual(output, [
      '-d',
      'build',
      '--plugins',
      '@babel/plugin-transform-modules-commonjs,babel-plugin-add-module-exports',
    ]);
  },

  function checkInvalidFormat() {
    const fn = () => getBabelArgs({ ...defaultOptions, format: 'invalid' });
    assert.throws(fn, /Invalid format/);
  },
];

const assert = require('assert');
const getOptions = require('../src/get_options');
const logger = require('../src/logger');

let originalConsole;
const mockLogs = [];

function mockConsole() {
  originalConsole = console;
  logger.setConsole({
    log: (...args) => {
      mockLogs.push(args);
    },
    info: () => {},
    error: (...args) => {
      mockLogs.push(args);
    },
  });
}

function restoreConsole() {
  logger.setConsole(originalConsole);
}

module.exports = [
  mockConsole,

  function validFormats() {
    // check default value
    assert.equal(getOptions([]).format, 'cjs', 'default should be cjs');

    // check passed in formats
    assert.equal(getOptions(['-f', 'cjs']).format, 'cjs');
    assert.equal(getOptions(['--format', 'cjs']).format, 'cjs');
    assert.equal(getOptions(['-f', 'umd']).format, 'umd');
    assert.equal(getOptions(['--format', 'umd']).format, 'umd');
    assert.equal(getOptions(['-f', 'amd']).format, 'amd');
    assert.equal(getOptions(['--format', 'amd']).format, 'amd');
    assert.equal(getOptions(['-f', 'systemjs']).format, 'systemjs');
    assert.equal(getOptions(['--format', 'systemjs']).format, 'systemjs');
  },

  function invalidFormat() {
    // check invalid format handling
    assert.equal(getOptions(['-f', 'cats']).exit, 1);

    assert.ok(/Invalid format 'cats'/.test(mockLogs[0]), 'should show invalid format error');
  },

  function outDir() {
    assert.equal(getOptions([]).outDir, '', 'outDir should be empty');
    assert.equal(getOptions(['--out-dir', 'build']).outDir, 'build');
    assert.equal(getOptions(['-d', 'build']).outDir, 'build');
  },

  function outDir() {
    assert.equal(getOptions([]).outFile, '', 'outFile should be empty');
    assert.equal(getOptions(['--out-file', 'file.js']).outFile, 'file.js');
    assert.equal(getOptions(['-o', 'file.js']).outFile, 'file.js');
  },

  function helpOutout() {
    assert.equal(getOptions(['--help']).exit, 0, 'should exit on help');

    assert.ok(/Usage: modconv \[options\] files/.test(mockLogs[1]), 'help output should be logged');
  },

  function invalidOutput() {
    assert.equal(
      getOptions(['-o', 'outfile.js', '-d', 'build']).exit,
      1,
      'should exit on both output options'
    );

    assert.ok(
      new RegExp('Error: --out-file and --out-dir cannot be used together').test(mockLogs[2])
    );
  },

  function silentOutput() {
    assert.equal(getOptions(['--silent']).silent, true, 'should set silent option');
  },

  restoreConsole,
];

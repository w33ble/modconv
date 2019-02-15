#!/usr/bin/env node
/* eslint no-console: 0 */
const path = require('path');
const getopts = require('getopts');
const spawn = require('cross-spawn');

const transformMap = {
  cjs: '@babel/plugin-transform-modules-commonjs',
  umd: '@babel/plugin-transform-modules-umd',
  amd: '@babel/plugin-transform-modules-amd',
  systemjs: '@babel/plugin-transform-modules-systemjs',
};
const binPath = path.resolve(__dirname, '../node_modules/.bin');
const availableFormats = Object.keys(transformMap);

const options = getopts(process.argv.slice(2), {
  alias: {
    f: 'format',
    o: 'out-file',
    d: 'out-dir',
  },
  string: ['format', 'out-file', 'out-dir'],
  boolean: ['help'],
  unknown: opt => opt === 'help',
});

function showHelp() {
  console.log(`
Usage: modconv [options] files

  Converts module syntax to some desired output module type.

  -f, --format            Select the output module format, should be one of: ${availableFormats.join(
    ', '
  )}
  -o, --out-file [out]    Compile all input files into a single file
  -d, --out-dir [out]     Compile an input directory of modules into an output directory
`);
  process.exit(0);
}

function normalizeOptions(opts) {
  const format = opts.format || 'cjs';
  const { 'out-dir': outDir, 'out-file': outFile } = opts;

  if (!availableFormats.includes(format)) {
    console.error(`Invalid format '${format}', must be one of: ${availableFormats.join(', ')}`);
    process.exit(1);
  }

  if (outDir.length && outFile.length) {
    console.error('Error: --out-file and --out-dir cannot be used together');
    process.exit(1);
  }

  // return { format, outFile: path.join(cwd, outFile), outDir: path.join(cwd, outDir) };
  return { format, outFile, outDir };
}

if (options.help) showHelp();
const { format, outDir, outFile } = normalizeOptions(options);

console.info(`Converting modules to format: ${format} ${process.cwd()}`);

const babelPlugins = [transformMap[format]];

// handle module name goofyness in commonjs modules
if (format === 'cjs') babelPlugins.push('babel-plugin-add-module-exports');

const args = outDir ? ['-d', outDir] : ['-o', outFile];
const babelArgs = [...args, '--plugins', babelPlugins.join(','), ...options._];

const proc = spawn(path.join(binPath, 'babel'), babelArgs, {
  stdio: 'pipe',
});

proc.stderr.on('data', data => {
  console.log(`stderr: ${typeof data}`);
});

proc.on('close', code => {
  if (code !== 0) console.log(`modconv exited with code ${code}`);
});

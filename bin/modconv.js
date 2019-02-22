#!/usr/bin/env node
/* eslint no-console: 0 */
const path = require('path');
const spawn = require('cross-spawn');
const getOptions = require('../src/get_options');
const getBabelArgs = require('../src/get_babel_args');

const options = getOptions(process.argv.slice(2));
const babelArgs = getBabelArgs(options);

const binPath = path.resolve(__dirname, '../node_modules/.bin');
const proc = spawn(path.join(binPath, 'babel'), babelArgs, {
  stdio: 'pipe',
});

if (options.outputResult) {
  // show output from stdout
  proc.stdout.on('data', data => {
    console.log(data.toString());
  });
} else if (!options.silent) {
  // inform user about what's going on
  console.info(`Converting modules to format: ${options.format}`);
  if (options.outDir) console.info(`Writing output to directory: ${options.outDir}`);
  else console.info(`Writing output to file: ${options.outFile}`);
}

proc.stderr.on('data', data => {
  console.error(data.toString());
});

proc.on('close', code => {
  if (code !== 0) console.log(`modconv exited with code ${code}`);
});

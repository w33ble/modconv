#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');
const logger = require('../src/logger');
const getOptions = require('../src/get_options');
const getBabelArgs = require('../src/get_babel_args');

const options = getOptions(process.argv.slice(2));

if (options.exit != null) {
  process.exit(options.exit);
}

const babelArgs = getBabelArgs(options);

const binPath = path.resolve(__dirname, '../node_modules/.bin');
const proc = spawn(path.join(binPath, 'babel'), babelArgs, {
  stdio: 'pipe',
});

if (options.outputResult) {
  // show output from stdout
  proc.stdout.on('data', data => {
    logger.log(data.toString());
  });
} else if (!options.silent) {
  // inform user about what's going on
  logger.info(`Converting modules to format: ${options.format}`);
  if (options.outDir) logger.info(`Writing output to directory: ${options.outDir}`);
  else logger.info(`Writing output to file: ${options.outFile}`);
}

proc.stderr.on('data', data => {
  logger.error(data.toString());
});

proc.on('close', code => {
  if (code !== 0) logger.log(`modconv exited with code ${code}`);
});

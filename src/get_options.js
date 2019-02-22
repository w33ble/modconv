const getopts = require('getopts');
const { availableFormats } = require('../src/transforms');
const logger = require('./logger');

function showHelp() {
  const validFormat = availableFormats.join(', ');
  logger.log(`
Usage: modconv [options] files

  Converts module syntax to some desired output module type.

  -f, --format            Select the output module format, should be one of: ${validFormat}
  -o, --out-file [out]    Compile all input files into a single file
  -d, --out-dir [out]     Compile an input directory of modules into an output directory
  --silent                Don't output anything (other than module output if using stdout)
`);
}

function normalizeOptions(opts) {
  let exit = null;
  const format = opts.format || 'cjs';
  const { 'out-dir': outDir, 'out-file': outFile, help, silent, _: unknown } = opts;

  if (help) {
    showHelp(availableFormats);
    exit = 0;
  }

  if (!availableFormats.includes(format)) {
    logger.error(`Invalid format '${format}', must be one of: ${availableFormats.join(', ')}`);
    exit = 1;
  }

  if (outDir.length && outFile.length) {
    logger.error('Error: --out-file and --out-dir cannot be used together');
    exit = 1;
  }

  const outputResult = !outFile && !outDir;

  return { format, outFile, outDir, outputResult, help, silent, unknown, exit };
}

module.exports = function getOptions(args) {
  const options = getopts(args, {
    alias: {
      f: 'format',
      o: 'out-file',
      d: 'out-dir',
    },
    string: ['format', 'out-file', 'out-dir'],
    boolean: ['help', 'silent'],
    // unknown: opt => opt === 'help',
  });

  return normalizeOptions(options);
};

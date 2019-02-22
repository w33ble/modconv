/* eslint no-console: 0 */
const getopts = require('getopts');
const { availableFormats } = require('../src/transforms');

function showHelp() {
  const validFormat = availableFormats.join(', ');
  console.log(`
Usage: modconv [options] files

  Converts module syntax to some desired output module type.

  -f, --format            Select the output module format, should be one of: ${validFormat}
  -o, --out-file [out]    Compile all input files into a single file
  -d, --out-dir [out]     Compile an input directory of modules into an output directory
`);
  process.exit(0);
}

function normalizeOptions(opts) {
  const format = opts.format || 'cjs';
  const { 'out-dir': outDir, 'out-file': outFile, help, _: unknown } = opts;

  if (help) showHelp(availableFormats);

  if (!availableFormats.includes(format)) {
    console.error(`Invalid format '${format}', must be one of: ${availableFormats.join(', ')}`);
    process.exit(1);
  }

  if (outDir.length && outFile.length) {
    console.error('Error: --out-file and --out-dir cannot be used together');
    process.exit(1);
  }

  const outputResult = !outFile && !outDir;

  return { format, outFile, outDir, outputResult, help, unknown };
}

module.exports = function getOptions(args) {
  const options = getopts(args, {
    alias: {
      f: 'format',
      o: 'out-file',
      d: 'out-dir',
    },
    string: ['format', 'out-file', 'out-dir'],
    boolean: ['help'],
    // unknown: opt => opt === 'help',
  });

  return normalizeOptions(options);
};

const { transformMap } = require('./transforms');

module.exports = function getBabelArgs({
  format = 'cjs',
  outFile = '',
  outDir = '',
  unknown = [],
} = {}) {
  const babelPlugins = [transformMap[format]];

  if (babelPlugins[0] == null) throw new Error(`Invalid format: ${format}`);

  // handle module name goofyness in commonjs modules
  if (format === 'cjs') babelPlugins.push('babel-plugin-add-module-exports');

  const args = (() => {
    if (outDir) return ['-d', outDir];
    if (outFile) return ['-o', outFile];
    return [];
  })();

  return [...args, '--plugins', babelPlugins.join(','), ...unknown];
};

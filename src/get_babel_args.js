const { transformMap } = require('./transforms');

module.exports = function getBabelArgs({ format, outFile, outDir, unknown } = {}) {
  const babelPlugins = [transformMap[format]];

  // handle module name goofyness in commonjs modules
  if (format === 'cjs') babelPlugins.push('babel-plugin-add-module-exports');

  const args = outDir ? ['-d', outDir] : ['-o', outFile];
  return [...args, '--plugins', babelPlugins.join(','), ...unknown];
};

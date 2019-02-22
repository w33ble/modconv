const transformMap = {
  cjs: '@babel/plugin-transform-modules-commonjs',
  umd: '@babel/plugin-transform-modules-umd',
  amd: '@babel/plugin-transform-modules-amd',
  systemjs: '@babel/plugin-transform-modules-systemjs',
};

exports.availableFormats = Object.keys(transformMap);

exports.transformMap = transformMap;

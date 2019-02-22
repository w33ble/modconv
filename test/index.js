/* eslint no-console: 0 */
const babelTests = require('./get_babel_args');

[...babelTests].forEach(fn => fn());
console.log('All tests passed!');

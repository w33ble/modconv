/* eslint no-console: 0 */
const optionTests = require('./get_options');
const babelTests = require('./get_babel_args');

[...optionTests, ...babelTests].forEach(fn => fn());
console.log('All tests passed!');

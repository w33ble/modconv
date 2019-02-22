let con = console;

exports.setConsole = c => {
  con = c;
};

exports.log = (...args) => con.log(...args);
exports.info = (...args) => con.info(...args);
exports.error = (...args) => con.error(...args);

# modconv

Module conversion tool for node.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/modconv/master/LICENSE)
[![Build Status](https://img.shields.io/travis/w33ble/modconv.svg?branch=master)](https://travis-ci.org/w33ble/modconv)
[![npm](https://img.shields.io/npm/v/modconv.svg)](https://www.npmjs.com/package/modconv)
[![Project Status](https://img.shields.io/badge/status-deprecated-red.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

## Usage

```
modconv -d dist src
```

`modconv` does one thing, convert from one js module syntax to another. It uses Babel behind the scenes and has a very small set of flags you can use.

### Why use this?

The main thing this tool does that many other module conversion tools do not is handle default exports from ECMAScript 6 module (esm) format when producing CommonJS (cjs) output. Normally you end up doing something like this from your converted modules:

```js
const myModule = require('my-module').default;
```

This still works, but leaving off the `.default` part *also* works. That means you can simply require converted modules like this, and they will work as expected:

```js
const myModule = require('my-module');
```

It's very useful for published modules that are written in esm, since using the cjs version in node feels very natural. (Note that other target module formats do not work this way, only cjs).

This is all thanks to [babel-plugin-add-module-exports](https://www.npmjs.com/package/babel-plugin-add-module-exports).

### Options

Flag | Description
---- | -----------
--help | Show help information
-f, --format | Desired output format, see --help for available formats
-d, --out-dir | Target directory for all converted code to be written
-o, --out-file | Target file for all converted code to be written
--silent | Prevent status output, converted module will still be sent to stdout if -d or -o are not used

#### License

MIT © [w33ble](https://github.com/w33ble)

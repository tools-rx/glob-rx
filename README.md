# glob-rx

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![npm](https://img.shields.io/npm/v/glob-rx.svg?maxAge=2592000)](https://www.npmjs.com/package/glob-rx)
[![bitHound Dependencies](https://www.bithound.io/github/tools-rx/glob-rx/badges/dependencies.svg)](https://www.bithound.io/github/tools-rx/glob-rx/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/tools-rx/glob-rx/badges/devDependencies.svg)](https://www.bithound.io/github/tools-rx/glob-rx/master/dependencies/npm)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

| Linux/OSX | Windows |
| --- | --- |
| [![Build Status](https://travis-ci.org/tools-rx/glob-rx.svg?branch=master)](https://travis-ci.org/tools-rx/glob-rx) | [![Build status](https://ci.appveyor.com/api/projects/status/6902yvygolnskmm9?svg=true)](https://ci.appveyor.com/project/dfbaskin/glob-rx) |

RxJS Wrapper around the [glob](https://github.com/isaacs/node-glob) function.

## Usage

Install from NPM

```
npm install --save glob-rx
```

Use it as an observable.

```javascript
var globRx = require('glob-rx');

globRx(pattern, options)
    .subscribe(
        function(file) {
            // .. do something with file
            console.log(file.fullname);
        },
        function(err) {
            // ... error handling
        },
        function() {
            // ... end of files
        });
```

This module wraps the `glob` function in an observable, so the `pattern` and `options` parameters
are the same.

## Output

The observable returns an object with two properties:

- `basedir` - the base directory the pattern is relative to (corresponds to the `cwd` property
in the options passed to the glob function).

- `name` - the file name relative to the `basedir` property.

The object also supports a number of calculated properties to get additional information about the file.

- `fullname` - returns the full name of the file (the `basedir` plus the `name`).

- `basename` - returns the base filename without any path.

- `dirname` - return the full path, without the file name.

- `extname` - returns the file extension.

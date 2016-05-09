# glob-rx

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

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

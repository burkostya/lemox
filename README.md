# lemox
[![Build Status](https://travis-ci.org/burkostya/lemox.png?branch=master)](https://travis-ci.org/burkostya/lemox) [![Dependency Status](https://gemnasium.com/burkostya/lemox.png)](https://gemnasium.com/burkostya/lemox) [![NPM version](https://badge.fury.io/js/lemox.png)](http://badge.fury.io/js/lemox)

Simple wrapper around sax.js, based on stream2, created for one purpose only - 
 parsing huge files and extracting nodes with specified name.

## Instalation
```
npm install lemox
```

## Example

```js
var fs       = require('fs');
var Writable = require('stream').Writable;

var Lemox = require('./lib/lemox');

var parser = new Lemox({ selector: 'House' });

var file = fs.createReadStream('/path/to/huge/xml/file');

var slowStream = new Writable({ objectMode: true });
slowStream._write = function (obj, enc, done) {
  console.log(obj);
  setTimeout(function () {
    done();
  }, 300);
};

file
  .pipe(parser)
  .pipe(slowStream);
```

## Tests

```
npm test
```

## License
Copyright (c) 2013 Konstantin Burykin  
Licensed under the MIT license.

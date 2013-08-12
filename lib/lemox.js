/*
 * lemox
 * https://github.com/burkostya/lemox
 *
 * Copyright (c) 2013 Konstantin Burykin
 * Licensed under the MIT license.
 */

var Transform = require('stream').Transform;
var util      = require('util');

var Sax = require('sax');

var Lemox = function (options) {
  var self = this;

  options = options || {};
  options.selector = options.selector.toLowerCase();
  Transform.call(self, options);
  self._readableState.objectMode = true;
  self._writableState.objectMode = false;

  self._rootNode  = null;
  self._openNodes = [];

  var parser = Sax.parser(false, { lowercase: true });
  parser.onopentag = function (node) {
    if (!self._rootNode) {
      self._rootNode = node.name;
    }
    if (node.name === options.selector) {
      self._openNodes.push(node);
    }
  };
  parser.ontext = function (text) {
    var nodes = self._openNodes;
    var node = nodes[nodes.length - 1];
    if (node) { node.text = text; }
  };
  parser.onclosetag = function (nodename) {
    if (self._rootNode === nodename) {
      self.push(null);
      parser.close();
    }
    if (nodename === options.selector) {
      self.push(self._openNodes.pop());
    }
  };
  self._parser = parser;
};

util.inherits(Lemox, Transform);

Lemox.prototype._transform = function(chunk, enc, done) {
  var self = this;
  var parser = self._parser;
  var str = chunk.toString();
  // var stringChunks = [];
  // var sizeLimit = 64 * 1024;
  // if (str.length <= sizeLimit) {
  //   stringChunks.push(str);
  // } else {
  //   stringChunks = splitBy(str, sizeLimit);
  // }
  // stringChunks.forEach(function (chnk) {
    // parser.write(chnk);
    parser.write(str);
  // });
  done();
};

// function splitBy (str, size) {
//   var chunks = [];
//   for (var i = 0; i < str.length; i += (size)) {
//     chunks.push(str.substring(i, i + size));
//   }
//   return chunks;
// }

module.exports = Lemox;
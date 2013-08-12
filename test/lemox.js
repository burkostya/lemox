var expect = require('chai').expect;

var Lemox = require('../lib/lemox.js');

describe("parser", function(){
  var lemox;
  beforeEach(function () {
    lemox = new Lemox({ selector: 'element' });
  });
  it("should emit correct number of nodes", function(done){
    var nodes = [];
    lemox.on('readable', function () {
      var node = lemox.read();
      nodes.push(node);
    });
    lemox.on('end', function () {
      expect(nodes).to.have.length(4);
      done();
    });

    var xml = [
      '<rootElement>',
        '<element id=first>one</element>',
        '<element id=second>',
          'two',
          '<element id=nested />',
        '</element>',
        '<element id=third>three</element>',
      '</rootElement>'
    ].join('');
    lemox.write(xml);
    lemox.end();
  });
  it("should expose name for node", function(done){
    var node;
    lemox.on('readable', function () {
      node = lemox.read();
      expect(node).to.have.property('name');
      expect(node.name).to.equal('element');
    });
    lemox.on('end', function () {
      done();
    });
    lemox.write([
      '<rootElement>',
        '<element attr=some anotherAttr=not-some></element>',
      '</rootElement>'
    ].join(''));
    lemox.end();
  });
  it("should expose attributes for node", function(done){
    var node;
    lemox.on('readable', function () {
      node = lemox.read();
      expect(node).to.have.property('attributes');
      expect(node.attributes).to.have.property('attr');
      expect(node.attributes.attr).to.equal('some');
      expect(node.attributes).to.have.property('anotherattr');
      expect(node.attributes.anotherattr).to.equal('not-some');
    });
    lemox.on('end', function () {
      done();
    });
    lemox.write([
      '<rootElement>',
        '<element attr=some anotherAttr=not-some></element>',
      '</rootElement>'
    ].join(''));
    lemox.end();
  });
  it("should expose text of node", function(done){
    var node;
    lemox.on('readable', function () {
      node = lemox.read();
      expect(node).to.have.property('text');
      expect(node.text).to.equal('some text');
    });
    lemox.on('end', function () {
      done();
    });
    lemox.write([
      '<rootElement>',
        '<element>some text</element>',
      '</rootElement>'
    ].join(''));
    lemox.end();
  });
});

'use strict';

var assert = require('chai').assert;

describe('.log()', function () {

    var modjs;
    var def;
    var req;
    var log;

    beforeEach(function () {
        modjs = this.modulejs.create();
        def = modjs.define;
        req = modjs.require;
        log = modjs.log;
    });

    it('no definitions', function () {
        assert.strictEqual(log(), '\n');
        assert.strictEqual(log(true), '\n');
    });

    it('one definition', function () {
        def('a', {});
        assert.strictEqual(log(), '\n  a -> [  ]\n');
        assert.strictEqual(log(true), '\n  a -> [  ]\n');
    });

    it('two definitions with deps', function () {
        def('a', {});
        def('b', ['a'], {});
        assert.strictEqual(log(), '\n  a -> [  ]\n  b -> [ a ]\n');
        assert.strictEqual(log(true), '\n  a -> [ b ]\n  b -> [  ]\n');
    });

    it('two definitions with deps and instance', function () {
        def('a', {});
        def('b', ['a'], {});
        req('a');
        assert.strictEqual(log(), '\n* a -> [  ]\n  b -> [ a ]\n');
        assert.strictEqual(log(true), '\n* a -> [ b ]\n  b -> [  ]\n');
    });

    it('in order of definition', function () {
        def('c', {});
        def('a', {});
        def('d', ['c', 'b'], {});
        def('b', ['a'], {});
        assert.strictEqual(log(), '\n  c -> [  ]\n  a -> [  ]\n  d -> [ c, a, b ]\n  b -> [ a ]\n');
        assert.strictEqual(log(true), '\n  c -> [ d ]\n  a -> [ d, b ]\n  d -> [  ]\n  b -> [ d ]\n');
    });
});

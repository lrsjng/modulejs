'use strict';

var insp = require('util').inspect;
var assert = require('chai').assert;
var _ = require('lodash');

describe('.define()', function () {

    var modjs;
    var def;
    var defs;

    beforeEach(function () {
        modjs = this.modulejs.create();
        def = modjs.define;
        defs = modjs._private.definitions;
    });

    it('is function', function () {
        assert.isFunction(def);
    });

    it('throws if no arguments', function () {
        assert.throws(function () { def(); }, /id must be string/);
    });

    it('throws if non-string id', function () {
        assert.throws(function () { def(true, [], {}); }, /id must be string/);
    });

    it('throws if non-array dependencies', function () {
        assert.throws(function () { def('a', true, {}); }, /deps must be array/);
    });

    it('returns undefined', function () {
        assert.strictEqual(def('a'), undefined);
    });

    it('throws if id already defined', function () {
        assert.strictEqual(def('a'), undefined);
        assert.throws(function () { def('a'); }, /id already defined/);
    });

    it('.define(id)  ->  .define(id, [], function () { return undefined; })', function () {
        var id = 'a';
        assert.strictEqual(def(id), undefined);

        assert.isTrue(_.isPlainObject(defs[id]));
        assert.strictEqual(defs[id].id, id);
        assert.deepEqual(defs[id].deps, []);
        assert.isFunction(defs[id].fn);
        assert.strictEqual(defs[id].fn(), undefined);
    });

    it('.define(id, fn)  ->  .define(id, [], fn)', function () {
        var id = 'a';
        var fn = function () {};
        assert.strictEqual(def(id, fn), undefined);

        assert.isTrue(_.isPlainObject(defs[id]));
        assert.strictEqual(defs[id].id, id);
        assert.deepEqual(defs[id].deps, []);
        assert.strictEqual(defs[id].fn, fn);
    });

    it('.define(id, arr, fn)  ->  .define(id, arr, fn)', function () {
        var id = 'a';
        var arr = [];
        var fn = function () {};
        assert.strictEqual(def(id, fn), undefined);

        assert.isTrue(_.isPlainObject(defs[id]));
        assert.strictEqual(defs[id].id, id);
        assert.deepEqual(defs[id].deps, arr);
        assert.strictEqual(defs[id].fn, fn);
    });

    _.each([
        undefined,
        null,
        true,
        false,
        0,
        1,
        [],
        {},
        ''
    ], function (x) {
        it('.define(id, ' + insp(x) + ')  ->  .define(id, [], function () { return ' + insp(x) + '; })', function () {
            var id = 'a';
            assert.strictEqual(def(id, x), undefined);

            assert.isTrue(_.isPlainObject(defs[id]));
            assert.strictEqual(defs[id].id, id);
            assert.deepEqual(defs[id].deps, []);
            assert.notStrictEqual(defs[id].deps, x);
            assert.isFunction(defs[id].fn);
            assert.strictEqual(defs[id].fn(), x);
        });

        it('.define(id, arr, ' + insp(x) + ')  ->  .define(id, arr, function () { return ' + insp(x) + '; })', function () {
            var id = 'a';
            var arr = [];
            assert.strictEqual(def(id, x), undefined);

            assert.isTrue(_.isPlainObject(defs[id]));
            assert.strictEqual(defs[id].id, id);
            assert.deepEqual(defs[id].deps, arr);
            assert.isFunction(defs[id].fn);
            assert.strictEqual(defs[id].fn(), x);
        });
    });
});

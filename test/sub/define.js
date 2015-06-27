'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.define()', function () {

    var def;

    beforeEach(function () {
        def = this.modulejs.create().define;
    });

    it('is function', function () {
        assert.ok(_.isFunction(def));
    });

    it('error when no arguments', function () {
        assert.throws(function () { def(); }, /id must be string/);
    });

    it('error when non-string id', function () {
        assert.throws(function () { def(true, [], function () {}); }, /id must be string/);
    });

    it('error when non-array dependencies', function () {
        assert.throws(function () { def('a', true, function () {}); }, /deps must be array/);
    });

    it('accepts id and undefined', function () {
        assert.strictEqual(def('a', undefined), undefined);
    });

    it('accepts id and constructor', function () {
        assert.strictEqual(def('a', function () {}), undefined);
    });

    it('accepts id and array as def', function () {
        assert.strictEqual(def('a', []), undefined);
    });

    it('accepts id, dependencies and constructor', function () {
        assert.strictEqual(def('a', [], function () {}), undefined);
    });

    it('accepts id and object', function () {
        assert.strictEqual(def('a', {}), undefined);
    });

    it('accepts id, dependencies and object', function () {
        assert.strictEqual(def('a', [], {}), undefined);
    });

    it('error when id already defined', function () {
        assert.strictEqual(def('a', {}), undefined);
        assert.throws(function () { def('a', {}); }, /id already defined/);
    });

    it('accepts id and array, handles array as object with no dependencies', function () {
        assert.strictEqual(def('a', []), undefined);
    });

    it('accepts id and two arrays', function () {
        assert.strictEqual(def('a', [], []), undefined);
    });
});

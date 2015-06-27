'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.create()', function () {

    it('is function', function () {
        assert.ok(_.isFunction(this.modulejs.create));
    });

    it('returns plain object', function () {
        assert.ok(_.isPlainObject(this.modulejs.create()));
    });

    it('instances work independently', function () {
        var modjs1 = this.modulejs.create();
        var modjs2 = this.modulejs.create();

        assert.deepEqual(_.keys(modjs1.state()), []);
        assert.deepEqual(_.keys(modjs2.state()), []);

        modjs1.define('a', {});

        assert.deepEqual(_.keys(modjs1.state()), ['a']);
        assert.deepEqual(_.keys(modjs2.state()), []);

        modjs2.define('b', {});

        assert.deepEqual(_.keys(modjs1.state()), ['a']);
        assert.deepEqual(_.keys(modjs2.state()), ['b']);

        modjs1.require('a');
        assert.throws(function () { modjs1.require('b'); }, /id not defined/);
        modjs2.require('b');
        assert.throws(function () { modjs2.require('a'); }, /id not defined/);
    });
});

'use strict';

var assert = require('assert');
var _ = require('lodash');

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

    it('is function', function () {
        assert.ok(_.isFunction(log));
    });

    it('returns string', function () {
        assert.ok(_.isString(log()));
        assert.ok(_.isString(log(true)));
    });

    it('returns string', function () {
        def('a', {});
        def('b', ['a'], {});
        assert.ok(_.isString(log()));
        assert.ok(_.isString(log(true)));
    });

    it('returns string', function () {
        def('a', {});
        def('b', ['a'], {});
        req('a');
        assert.ok(_.isString(log()));
        assert.ok(_.isString(log(true)));
    });
});

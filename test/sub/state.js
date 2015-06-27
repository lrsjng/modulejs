'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.state()', function () {

    var modjs;
    var def;
    var req;
    var state;

    beforeEach(function () {
        modjs = this.modulejs.create();
        def = modjs.define;
        req = modjs.require;
        state = modjs.state;
    });

    it('is function', function () {
        assert.ok(_.isFunction(state));
    });

    it('returns plain object', function () {
        assert.ok(_.isPlainObject(state()));
    });

    it('returns plain object', function () {
        def('a', {});
        def('b', ['a'], {});
        assert.ok(_.isPlainObject(state()));
    });

    it('returns plain object', function () {
        def('a', {});
        def('b', ['a'], {});
        req('a');
        assert.ok(_.isPlainObject(state()));
    });
});

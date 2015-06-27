'use strict';

var assert = require('chai').assert;
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
        assert.isFunction(state);
    });

    it('no definitions', function () {
        assert.isTrue(_.isPlainObject(state()));
        assert.deepEqual(state(), {});
    });

    it('one definition', function () {
        def('a', {});
        assert.isTrue(_.isPlainObject(state()));
        assert.deepEqual(state(), {
            a: {
                deps: [],
                init: false,
                reqd: [],
                reqs: []
            }
        });
    });

    it('two definitions with deps', function () {
        def('a', {});
        def('b', ['a'], {});
        assert.isTrue(_.isPlainObject(state()));
        assert.deepEqual(state(), {
            a: {
                deps: [],
                init: false,
                reqd: ['b'],
                reqs: []
            },
            b: {
                deps: ['a'],
                init: false,
                reqd: [],
                reqs: ['a']
            }
        });
    });

    it('two definitions with deps and instance', function () {
        def('a', {});
        def('b', ['a'], {});
        req('a');
        assert.isTrue(_.isPlainObject(state()));
        assert.deepEqual(state(), {
            a: {
                deps: [],
                init: true,
                reqd: ['b'],
                reqs: []
            },
            b: {
                deps: ['a'],
                init: false,
                reqd: [],
                reqs: ['a']
            }
        });
    });
});

'use strict';

var assert = require('assert');
var _ = require('lodash');
var insp = require('util').inspect;
var getRoot = require('./getroot');

var root = getRoot();
var priv;

describe('modulejs._private', function () {

    beforeEach(function () {
        priv = root.modulejs.create()._private;
    });

    it('is plain object', function () {
        assert.ok(_.isPlainObject(priv));
    });

    it('has the right properties', function () {
        assert.deepEqual(_.keys(priv).sort(), [
            'assert',
            'contains',
            'definitions',
            'each',
            'has',
            'instances',
            'isArray',
            'isFunction',
            'isObject',
            'isString',
            'resolve',
            'uniq'
        ].sort());
    });


    describe('.isString()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.isString));
        });

        _.each([
            ['', true],
            ['test', true],

            [[], false],
            [{}, false],
            [function () {}, false],
            [new RegExp(), false],
            [undefined, false],
            [true, false],
            [false, false],
            [null, false],
            [0, false],
            [1, false],
            [0.0, false],
            [1.0, false]
        ], function (x) {
            var arg = x[0];
            var exp = x[1];

            it('.isString(' + insp(arg) + ')  ->  ' + insp(exp), function () {
                assert.strictEqual(priv.isString(arg), exp);
            });
        });
    });


    describe('.isFunction()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.isFunction));
        });

        _.each([
            [function () {}, true],

            [[], false],
            [{}, false],
            [new RegExp(), false],
            [undefined, false],
            [true, false],
            [false, false],
            [null, false],
            [0, false],
            [1, false],
            [0.0, false],
            [1.0, false],
            ['', false],
            ['test', false]
        ], function (x) {
            var arg = x[0];
            var exp = x[1];

            it('.isFunction(' + insp(arg) + ')  ->  ' + insp(exp), function () {
                assert.strictEqual(priv.isFunction(arg), exp);
            });
        });
    });


    describe('.isArray()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.isArray));
        });

        _.each([
            [[], true],

            [{}, false],
            [function () {}, false],
            [new RegExp(), false],
            [undefined, false],
            [true, false],
            [false, false],
            [null, false],
            [0, false],
            [1, false],
            [0.0, false],
            [1.0, false],
            ['', false],
            ['test', false]
        ], function (x) {
            var arg = x[0];
            var exp = x[1];

            it('.isArray(' + insp(arg) + ')  ->  ' + insp(exp), function () {
                assert.strictEqual(priv.isArray(arg), exp);
            });
        });
    });


    describe('.isObject()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.isObject));
        });

        _.each([
            [{}, true],

            [[], false],
            [function () {}, false],
            [new RegExp(), false],
            [undefined, false],
            [true, false],
            [false, false],
            [null, false],
            [0, false],
            [1, false],
            [0.0, false],
            [1.0, false],
            ['', false],
            ['test', false]
        ], function (x) {
            var arg = x[0];
            var exp = x[1];

            it('.isObject(' + insp(arg) + ')  ->  ' + insp(exp), function () {
                assert.strictEqual(priv.isObject(arg), exp);
            });
        });
    });


    describe('.has()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.has));
        });

        _.each([
            [{a: 1}, 'a', true],

            [{a: 1}, undefined, false],
            [{a: 1}, 'b', false],
            [{a: 1}, 'toString', false],
            [undefined, undefined, false],
            [null, 1, false],
            [undefined, 1, false],
            [{}, undefined, false],
            [{}, null, false],
            [{}, 1, false]
        ], function (x) {
            var arg1 = x[0];
            var arg2 = x[1];
            var exp = x[2];

            it('.has(' + insp(arg1) + ', ' + insp(arg2) + ')  ->  ' + insp(exp), function () {
                assert.strictEqual(priv.has(arg1, arg2), exp);
            });
        });
    });


    describe('.each()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.each));
        });
    });


    describe('.contains()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.contains));
        });

        _.each([
            [[undefined], undefined, true],
            [[1], 1, true],
            [[1, 2], 1, true],
            [[1, 2, 3], 1, true],

            [undefined, undefined, false],
            [null, 1, false],
            [undefined, 1, false],
            [[], undefined, false],
            [[], null, false],
            [[], 1, false],
            [[1, 2, 3], 4, false]
        ], function (x) {
            var arg1 = x[0];
            var arg2 = x[1];
            var exp = x[2];

            it('.contains(' + insp(arg1) + ', ' + insp(arg2) + ')  ->  ' + insp(exp), function () {
                assert.deepEqual(priv.contains(arg1, arg2), exp);
            });
        });
    });


    describe('.uniq()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.uniq));
        });

        _.each([
            [null, []],
            [undefined, []],
            [[], []],
            [[1], [1]],
            [[1, 2], [1, 2]],
            [[1, 2, 1], [1, 2]],
            [[1, 1, 2], [1, 2]],
            [[1, 2, 2], [1, 2]],
            [[1, 2, 3, 4], [1, 2, 3, 4]],
            [[1, 2, 3, 2, 1, 4, 3], [1, 2, 3, 4]],
            ['ababc', ['a', 'b', 'c']]
        ], function (x) {
            var arg = x[0];
            var exp = x[1];

            it('.uniq(' + insp(arg) + ')  ->  ' + insp(exp), function () {
                assert.deepEqual(priv.uniq(arg), exp);
            });
        });
    });


    describe('.assert()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.assert));
        });

        it('throws when no arguments', function () {
            assert.throws(function () { priv.assert(); });
        });

        it('throws no error when expression is true', function () {
            assert.strictEqual(priv.assert(true), undefined);
        });

        it('throws error when expression is false', function () {
            assert.throws(function () { priv.assert(false); });
        });

        it('message is set correct', function () {
            var message = 'test';

            assert.throws(function () {
                priv.assert(false, message);
            }, /\[modulejs\] test/);
        });
    });


    describe('.definitions', function () {

        it('is plain object', function () {
            assert.ok(_.isPlainObject(priv.definitions));
        });

        it('is empty', function () {
            assert.strictEqual(_.size(priv.definitions), 0);
        });
    });


    describe('.instances', function () {

        it('is plain object', function () {
            assert.ok(_.isPlainObject(priv.instances));
        });

        it('is empty', function () {
            assert.strictEqual(_.size(priv.instances), 0);
        });
    });


    describe('.resolve()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(priv.resolve));
        });
    });
});

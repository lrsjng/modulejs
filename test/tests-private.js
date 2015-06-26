'use strict';

var insp = require('util').inspect;
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var _ = require('lodash');

// get source
var modulejs_content = fs.readFileSync(path.join(__dirname, '../src/modulejs.js'), 'utf-8');


describe('modulejs._private', function () {

    var sandbox;
    var _private;

    beforeEach(function () {

        sandbox = {};
        vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');
        _private = sandbox.modulejs._private;
    });

    it('is plain object', function () {

        assert.ok(_.isPlainObject(_private));
    });

    it('has the right properties', function () {

        assert.deepEqual(_.keys(_private).sort(), [
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
        ]);
    });


    describe('.isString()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isString));
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
                assert.strictEqual(_private.isString(arg), exp);
            });
        });
    });


    describe('.isFunction()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isFunction));
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
                assert.strictEqual(_private.isFunction(arg), exp);
            });
        });
    });


    describe('.isArray()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isArray));
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
                assert.strictEqual(_private.isArray(arg), exp);
            });
        });
    });


    describe('.isObject()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isObject));
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
                assert.strictEqual(_private.isObject(arg), exp);
            });
        });
    });


    describe('.has()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(_private.has));
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
                assert.strictEqual(_private.has(arg1, arg2), exp);
            });
        });
    });


    describe('.each()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(_private.each));
        });
    });


    describe('.contains()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(_private.contains));
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
                assert.deepEqual(_private.contains(arg1, arg2), exp);
            });
        });
    });


    describe('.uniq()', function () {

        it('is function', function () {
            assert.ok(_.isFunction(_private.uniq));
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
                assert.deepEqual(_private.uniq(arg), exp);
            });
        });
    });


    describe('.assert()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.assert));
        });

        it('throws when no arguments', function () {

            assert.throws(function () { _private.assert(); });
        });

        it('throws no error when expression is true', function () {

            assert.strictEqual(_private.assert(true), undefined);
        });

        it('throws error when expression is false', function () {

            assert.throws(function () { _private.assert(false); });
        });

        it('message is set correct', function () {

            var message = 'test';

            assert.throws(function () { _private.assert(false, message); }, function (e) {

                return e.message === '[modulejs] test';
            });
        });
    });


    describe('.definitions', function () {

        it('is plain object', function () {

            assert.ok(_.isPlainObject(_private.definitions));
        });

        it('starts empty', function () {

            assert.strictEqual(_.size(_private.definitions), 0);
        });
    });


    describe('.instances', function () {

        it('is plain object', function () {

            assert.ok(_.isPlainObject(_private.instances));
        });

        it('starts empty', function () {

            assert.strictEqual(_.size(_private.instances), 0);
        });
    });


    describe('.resolve()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.resolve));
        });
    });
});

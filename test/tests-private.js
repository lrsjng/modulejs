'use strict';

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

        it('returns true for string argument only', function () {

            assert.strictEqual(_private.isString(''), true);
            assert.strictEqual(_private.isString('test'), true);

            assert.strictEqual(_private.isString(), false);
            assert.strictEqual(_private.isString(true), false);
            assert.strictEqual(_private.isString(false), false);
            assert.strictEqual(_private.isString(null), false);
            assert.strictEqual(_private.isString(0), false);
            assert.strictEqual(_private.isString(1), false);
            assert.strictEqual(_private.isString(0.0), false);
            assert.strictEqual(_private.isString(1.0), false);
            assert.strictEqual(_private.isString({}), false);
            assert.strictEqual(_private.isString([]), false);
            assert.strictEqual(_private.isString(function () {}), false);
            assert.strictEqual(_private.isString(new RegExp()), false);
        });
    });


    describe('.isFunction()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isFunction));
        });

        it('returns true for function argument only', function () {

            assert.strictEqual(_private.isFunction(function () {}), true);

            assert.strictEqual(_private.isFunction(), false);
            assert.strictEqual(_private.isFunction(true), false);
            assert.strictEqual(_private.isFunction(false), false);
            assert.strictEqual(_private.isFunction(null), false);
            assert.strictEqual(_private.isFunction(0), false);
            assert.strictEqual(_private.isFunction(1), false);
            assert.strictEqual(_private.isFunction(0.0), false);
            assert.strictEqual(_private.isFunction(1.0), false);
            assert.strictEqual(_private.isFunction(''), false);
            assert.strictEqual(_private.isFunction('test'), false);
            assert.strictEqual(_private.isFunction({}), false);
            assert.strictEqual(_private.isFunction([]), false);
            assert.strictEqual(_private.isFunction(new RegExp()), false);
        });
    });


    describe('.isArray()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isArray));
        });

        it('returns true for array argument only', function () {

            assert.strictEqual(_private.isArray([]), true);

            assert.strictEqual(_private.isArray(), false);
            assert.strictEqual(_private.isArray(true), false);
            assert.strictEqual(_private.isArray(false), false);
            assert.strictEqual(_private.isArray(null), false);
            assert.strictEqual(_private.isArray(0), false);
            assert.strictEqual(_private.isArray(1), false);
            assert.strictEqual(_private.isArray(0.0), false);
            assert.strictEqual(_private.isArray(1.0), false);
            assert.strictEqual(_private.isArray(''), false);
            assert.strictEqual(_private.isArray('test'), false);
            assert.strictEqual(_private.isArray({}), false);
            assert.strictEqual(_private.isArray(function () {}), false);
            assert.strictEqual(_private.isArray(new RegExp()), false);
        });
    });


    describe('.isObject()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.isObject));
        });

        it('returns true for object argument only', function () {

            assert.strictEqual(_private.isObject({}), true);
            assert.strictEqual(_private.isObject([]), true);
            assert.strictEqual(_private.isObject(function () {}), true);
            assert.strictEqual(_private.isObject(new RegExp()), true);

            assert.strictEqual(_private.isObject(), false);
            assert.strictEqual(_private.isObject(true), false);
            assert.strictEqual(_private.isObject(false), false);
            assert.strictEqual(_private.isObject(null), false);
            assert.strictEqual(_private.isObject(0), false);
            assert.strictEqual(_private.isObject(1), false);
            assert.strictEqual(_private.isObject(0.0), false);
            assert.strictEqual(_private.isObject(1.0), false);
            assert.strictEqual(_private.isObject(''), false);
            assert.strictEqual(_private.isObject('test'), false);
        });
    });


    describe('.has()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.has));
        });

        it('returns true if object has own property only', function () {

            var obj = {a: 1};

            assert.strictEqual(_private.has(obj, 'a'), true);

            assert.strictEqual(_private.has(obj), false);
            assert.strictEqual(_private.has(obj, 'b'), false);
            assert.strictEqual(_private.has(obj, 'toString'), false);

            assert.throws(function () { _private.has(); });
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

        it('throws error when no arguments', function () {

            assert.throws(function () { _private.contains(); });
        });

        it('returns false, if no element argument', function () {

            assert.strictEqual(_private.contains([]), false);
        });

        it('returns false, if element argument is "undefined', function () {

            assert.strictEqual(_private.contains([], undefined), false);
        });

        it('returns true, if no element argument but "undefined" in array', function () {

            assert.strictEqual(_private.contains([undefined]), true);
        });

        it('returns true, if element in array', function () {

            assert.strictEqual(_private.contains([1, 2, 3], 3), true);
        });

        it('returns false, if element not in array', function () {

            assert.strictEqual(_private.contains([1, 2, 3], 4), false);
        });
    });


    describe('.uniq()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(_private.uniq));
        });

        it('throws error when no arguments', function () {

            assert.throws(function () { _private.uniq(); });
        });

        it('returns empty array when empty array', function () {

            assert.deepEqual(_private.uniq([]), []);
        });

        it('exact copy when already unique array', function () {

            assert.deepEqual(_private.uniq([6, 2, 3]), [6, 2, 3]);
        });

        it('preserves only first occurence of duplicate elements', function () {

            assert.deepEqual(_private.uniq([1, 2, 3, 2, 1, 4, 3]), [1, 2, 3, 4]);
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

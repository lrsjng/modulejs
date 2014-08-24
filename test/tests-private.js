/*jshint node: true */
/*global describe, before, beforeEach, it */


var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

// get source
var modulejs_content = fs.readFileSync(path.join(__dirname, '../src/modulejs.js'), 'utf-8');


describe('modulejs._private', function () {


    var sandbox, _private;

    beforeEach( function () {

        sandbox = {};
        vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');

        _private = sandbox.modulejs._private;
    });


    it('is object', function () {

        assert.ok(_.isObject(_private));
    });

    it('has 12 own properties', function () {

        assert.strictEqual(_.size(_private), 12);
    });

    it('#isString is function', function () {

        assert.ok(_.isFunction(_private.isString));
    });

    it('#isFunction is function', function () {

        assert.ok(_.isFunction(_private.isFunction));
    });

    it('#isArray is function', function () {

        assert.ok(_.isFunction(_private.isArray));
    });

    it('#isObject is function', function () {

        assert.ok(_.isFunction(_private.isObject));
    });

    it('#has is function', function () {

        assert.ok(_.isFunction(_private.has));
    });

    it('#each is function', function () {

        assert.ok(_.isFunction(_private.each));
    });

    it('#contains is function', function () {

        assert.ok(_.isFunction(_private.contains));
    });

    it('#uniq is function', function () {

        assert.ok(_.isFunction(_private.uniq));
    });

    it('#err is function', function () {

        assert.ok(_.isFunction(_private.err));
    });

    it('#definitions is object', function () {

        assert.ok(_.isObject(_private.definitions));
    });

    it('#instances is object', function () {

        assert.ok(_.isObject(_private.instances));
    });

    it('#resolve is function', function () {

        assert.ok(_.isFunction(_private.resolve));
    });


    describe('#isString', function () {

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


    describe('#isFunction', function () {

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


    describe('#isArray', function () {

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


    describe('#isObject', function () {

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


    describe('#has', function () {

        it('returns true if object has own property only', function () {

            var obj = { a: 1 };

            assert.strictEqual(_private.has(obj, 'a'), true);

            assert.strictEqual(_private.has(obj), false);
            assert.strictEqual(_private.has(obj, 'b'), false);
            assert.strictEqual(_private.has(obj, 'toString'), false);

            assert.throws(function () { _private.has(); });
        });
    });


    describe('#each', function () {

    });


    describe('#contains', function () {

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


    describe('#uniq', function () {

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


    describe('#err', function () {

        it('throws no error when no arguments', function () {

            assert.strictEqual(_private.err(), undefined);
        });

        it('throws no error when condition is false', function () {

            assert.strictEqual(_private.err(false), undefined);
        });

        it('throws error when condition is true', function () {

            assert.throws(function () { _private.err(true); });
        });

        it('error and message are set correct', function () {

            var code = 123;
            var message = 'test';

            assert.throws(function () { _private.err(true, code, message); }, function (e) {

                var toStr = e.toString();

                return _.size(e) === 3 &&
                            e.code === code &&
                            e.msg === message &&
                            _.isString(toStr) &&
                            / error 123: test$/.test(toStr);
            });
        });
    });


    describe('#definitions', function () {

        it('starts empty', function () {

            assert.strictEqual(_.size(_private.definitions), 0);
        });
    });


    describe('#instances', function () {

        it('starts empty', function () {

            assert.strictEqual(_.size(_private.instances), 0);
        });
    });


    describe('#resolve', function () {

    });
});

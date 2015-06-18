'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var _ = require('lodash');

// get source
var modulejs_content = fs.readFileSync(path.join(__dirname, '../src/modulejs.js'), 'utf-8');

// helper to check for right error
function throws(msg, fn) {

    assert.throws(fn, function (e) {

        if (_.isObject(e) && _.isString(e.message) && e.message.indexOf(msg) >= 0) {
            return true;
        }
        console.log(e);
        throw e;
    });
}


describe('modulejs', function () {

    var sandbox;
    var modjs;

    beforeEach(function () {

        sandbox = {};
        vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');
        modjs = sandbox.modulejs;
    });

    it('is the only published global', function () {

        assert.strictEqual(_.size(sandbox), 1);
        assert.ok(_.has(sandbox, 'modulejs'));
    });

    it('is plain object', function () {

        assert.ok(_.isPlainObject(modjs));
    });

    it('has 5 own properties (inc ._private)', function () {

        assert.strictEqual(_.size(modjs), 5);
    });


    describe('.define()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.define));
        });

        it('error when no arguments', function () {

            throws('id must be string', function () { modjs.define(); });
        });

        it('error when only id', function () {

            throws('def must be object or function', function () { modjs.define('a'); });
        });

        it('error when non-string id', function () {

            throws('id must be string', function () { modjs.define(true, [], function () {}); });
        });

        it('error when non-array dependencies', function () {

            throws('deps must be array', function () { modjs.define('a', true, function () {}); });
        });

        it('error when non-function and non-object argument', function () {

            throws('def must be object or function', function () { modjs.define('a', [], true); });
        });

        it('accepts id and constructor', function () {

            assert.strictEqual(modjs.define('a', function () {}), undefined);
        });

        it('accepts id, dependencies and constructor', function () {

            assert.strictEqual(modjs.define('a', [], function () {}), undefined);
        });

        it('accepts id and object', function () {

            assert.strictEqual(modjs.define('a', {}), undefined);
        });

        it('accepts id, dependencies and object', function () {

            assert.strictEqual(modjs.define('a', [], {}), undefined);
        });

        it('error when id already defined', function () {

            assert.strictEqual(modjs.define('a', {}), undefined);
            throws('id already defined', function () { modjs.define('a', {}); });
        });

        it('accepts id and array, handles array as object with no dependencies', function () {

            assert.strictEqual(modjs.define('a', []), undefined);
        });

        it('accepts id and two arrays', function () {

            assert.strictEqual(modjs.define('a', [], []), undefined);
        });
    });


    describe('.require()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.require));
        });

        it('error when no id', function () {

            throws('id must be string', function () { modjs.require(); });
        });

        it('error when non-string id', function () {

            throws('id must be string', function () { modjs.require({}); });
        });

        it('error when unknown id', function () {

            throws('id not defined', function () { modjs.require('a'); });
        });

        it('error when cyclic dependencies', function () {

            modjs.define('a', ['b'], {});
            modjs.define('b', ['a'], {});
            throws('circular dependencies', function () { modjs.require('a'); });
        });

        it('returns instance for known id', function () {

            modjs.define('a', function () { return 'val-a'; });
            assert.strictEqual(modjs.require('a'), 'val-a');
        });

        it('calls constructor exactly once per id', function () {

            var counter = 0;

            modjs.define('a', function () {

                counter += 1;
                return {};
            });

            assert.strictEqual(counter, 0);
            modjs.require('a');
            assert.strictEqual(counter, 1);
            modjs.require('a');
            assert.strictEqual(counter, 1);
        });

        it('returns always the same instance per id', function () {

            modjs.define('a', function () { return {}; });

            assert.notEqual({}, {});
            assert.notEqual(modjs.require('a'), {});
            assert.strictEqual(modjs.require('a'), modjs.require('a'));
        });

        it('resolves long dependency chains', function () {

            modjs.define('a', function () { return 'val-a'; });
            modjs.define('b', ['a'], function (x) { return x; });
            modjs.define('c', ['b'], function (x) { return x; });
            modjs.define('d', ['c'], function (x) { return x; });
            modjs.define('e', ['d'], function (x) { return x; });
            modjs.define('f', ['e'], function (x) { return x; });
            modjs.define('g', ['f'], function (x) { return x; });

            assert.strictEqual(modjs.require('g'), 'val-a');
        });

        it('error when long cyclic dependencies', function () {

            modjs.define('a', ['g'], {});
            modjs.define('b', ['a'], {});
            modjs.define('c', ['b'], {});
            modjs.define('d', ['c'], {});
            modjs.define('e', ['d'], {});
            modjs.define('f', ['e'], {});
            modjs.define('g', ['f'], {});

            throws('circular dependencies', function () { modjs.require('g'); });
        });
    });


    describe('.state()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.state));
        });

        it('returns plain object', function () {

            assert.ok(_.isPlainObject(modjs.state()));
        });
    });


    describe('.log()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.log));
        });

        it('returns string', function () {

            assert.ok(_.isString(modjs.log()));
        });
    });
});

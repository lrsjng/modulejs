/*jshint node: true, mocha: true */
'use strict';

var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

// get source
var modulejs_content = fs.readFileSync(path.join(__dirname, '../src/modulejs.js'), 'utf-8');

// helper to check for right error
var throws = function (msg, fn) {

    assert.throws(fn, function (e) {

        if (_.isObject(e) && _.isString(e.message) && e.message.indexOf(msg) >= 0) {
            return true;
        }
        console.log(e);
        throw e;
    });
};


describe('modulejs', function () {

    var sandbox;
    var modjs;
    var def;
    var req;
    var state;
    var log;

    beforeEach(function () {

        sandbox = {};
        vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');

        modjs = sandbox.modulejs;
        def = modjs.define;
        req = modjs.require;
        state = modjs.state;
        log = modjs.log;
    });

    it('is the only published global in normal mode', function () {

        assert.strictEqual(_.size(sandbox), 1);
        assert.ok(_.isObject(sandbox.modulejs));
    });

    it('has 5 own properties', function () {

        assert.strictEqual(_.size(modjs), 5);
    });

    it('.define() is function', function () {

        assert.ok(_.isFunction(modjs.define));
    });

    it('.require() is function', function () {

        assert.ok(_.isFunction(modjs.require));
    });

    it('.state() is function', function () {

        assert.ok(_.isFunction(modjs.state));
    });

    it('.log() is function', function () {

        assert.ok(_.isFunction(modjs.log));
    });

    it('._private is object', function () {

        assert.ok(_.isObject(modjs._private));
    });


    describe('.define()', function () {

        it('error when no arguments', function () {

            throws('id must be string', function () { def(); });
        });

        it('error when only id', function () {

            throws('def must be object or function', function () { def('a'); });
        });

        it('error when non-string id', function () {

            throws('id must be string', function () { def(true, [], function () {}); });
        });

        it('error when non-array dependencies', function () {

            throws('deps must be array', function () { def('a', true, function () {}); });
        });

        it('error when non-function and non-object argument', function () {

            throws('def must be object or function', function () { def('a', [], true); });
        });

        it('accepts id and constructor', function () {

            assert.strictEqual(def('a', function () {}), undefined);
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
            throws('id already defined', function () { def('a', {}); });
        });

        it('accepts id and array, handles array as object with no dependencies', function () {

            assert.strictEqual(def('a', []), undefined);
        });

        it('accepts id and two arrays', function () {

            assert.strictEqual(def('a', [], []), undefined);
        });
    });


    describe('.require()', function () {

        it('error when no id', function () {

            throws('id must be string', function () { req(); });
        });

        it('error when non-string id', function () {

            throws('id must be string', function () { req({}); });
        });

        it('error when unknown id', function () {

            throws('id not defined', function () { req('a'); });
        });

        it('error when cyclic dependencies', function () {

            def('a', ['b'], {});
            def('b', ['a'], {});
            throws('circular dependencies', function () { req('a'); });
        });

        it('returns instance for known id', function () {

            def('a', function () { return 'val-a'; });
            assert.strictEqual(req('a'), 'val-a');
        });

        it('calls constructors exactly once per id', function () {

            var counter = 0;

            def('a', function () {

                counter += 1;
                return {};
            });

            assert.strictEqual(counter, 0);
            req('a');
            assert.strictEqual(counter, 1);
            req('a');
            assert.strictEqual(counter, 1);
        });

        it('returns always the same instance per id', function () {

            def('a', function () { return {}; });

            assert.notEqual({}, {});
            assert.notEqual(req('a'), {});
            assert.strictEqual(req('a'), req('a'));
        });
    });


    describe('.state()', function () {

        it('returns object', function () {

            assert.ok(_.isObject(state()));
        });
    });


    describe('.log()', function () {

        it('returns string', function () {

            assert.ok(_.isString(log()));
        });
    });


    describe('.require()', function () {

        it('resolves long dependency chains', function () {

            def('a', function () { return 'val-a'; });
            def('b', ['a'], function (x) { return x; });
            def('c', ['b'], function (x) { return x; });
            def('d', ['c'], function (x) { return x; });
            def('e', ['d'], function (x) { return x; });
            def('f', ['e'], function (x) { return x; });
            def('g', ['f'], function (x) { return x; });

            assert.strictEqual(req('g'), 'val-a');
        });

        it('error when long cyclic dependencies', function () {

            def('a', ['g'], {});
            def('b', ['a'], {});
            def('c', ['b'], {});
            def('d', ['c'], {});
            def('e', ['d'], {});
            def('f', ['e'], {});
            def('g', ['f'], {});

            throws('circular dependencies', function () { req('g'); });
        });

        it('resolves fake dependencies, when provided with the optional argument', function () {

            def('a', function () { return 'val-a'; });
            def('b', ['a'], function (x) { return x; });
            def('c', ['b'], function (x) { return x; });

            // Resolves fake dependency directly
            assert.strictEqual(req('a', {a: 'fake-a1'}), 'fake-a1');
            // Resolves fake dependency recursively
            assert.strictEqual(req('b', {a: 'fake-a2'}), 'fake-a2');
            // Does not memorize value of b resolved before
            assert.strictEqual(req('c', {a: 'fake-a3'}), 'fake-a3');
            // Resolves to the first fake dependency in the chain
            assert.strictEqual(req('c', {a: 'fake-a', b: 'fake-b'}), 'fake-b');
        });

        it('resolves fake dependencies, even when actual dependency had been resolved before', function () {

            def('a', function () { return 'val-a'; });
            def('b', ['a'], function (x) { return x; });
            def('c', ['b'], function (x) { return x; });

            // This call memorizes values in instances
            assert.strictEqual(req('c'), 'val-a');

            assert.strictEqual(req('a', {a: 'fake-a1'}), 'fake-a1');
            assert.strictEqual(req('b', {a: 'fake-a2'}), 'fake-a2');
            assert.strictEqual(req('c', {a: 'fake-a3'}), 'fake-a3');
        });

        it('throws error for cyclic dependencies when fake dependencies don\'t break the cycle', function () {

            def('a', ['b'], {});
            def('b', ['a'], {});

            throws('circular dependencies', function () { req('b', {z: 'val-z'}); });
        });

        it('allows to resolve cyclic dependencies when fake dependencies break the cycle', function () {

            def('a', ['b'], {});
            def('b', ['a'], function (a) { return a });

            assert.strictEqual(req('b', {a: 'fake-a'}), 'fake-a');
        });
    });
});

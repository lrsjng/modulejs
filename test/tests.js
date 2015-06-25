'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var _ = require('lodash');

// get source
var modulejs_content = fs.readFileSync(path.join(__dirname, '../src/modulejs.js'), 'utf-8');


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

    it('has the right properties', function () {

        assert.deepEqual(_.keys(modjs).sort(), [
            '_private',
            'create',
            'define',
            'log',
            'require',
            'state'
        ]);
    });


    describe('.define()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.define));
        });

        it('error when no arguments', function () {

            assert.throws(function () { modjs.define(); }, /id must be string/);
        });

        it('error when only id', function () {

            assert.throws(function () { modjs.define('a'); }, /def must be object or function/);
        });

        it('error when non-string id', function () {

            assert.throws(function () { modjs.define(true, [], function () {}); }, /id must be string/);
        });

        it('error when non-array dependencies', function () {

            assert.throws(function () { modjs.define('a', true, function () {}); }, /deps must be array/);
        });

        it('error when non-function and non-object argument', function () {

            assert.throws(function () { modjs.define('a', [], true); }, /def must be object or function/);
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
            assert.throws(function () { modjs.define('a', {}); }, /id already defined/);
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

            assert.throws(function () { modjs.require(); }, /id must be string/);
        });

        it('error when non-string id', function () {

            assert.throws(function () { modjs.require({}); }, /id must be string/);
        });

        it('error when unknown id', function () {

            assert.throws(function () { modjs.require('a'); }, /id not defined/);
        });

        it('error when cyclic dependencies', function () {

            modjs.define('a', ['b'], {});
            modjs.define('b', ['a'], {});
            assert.throws(function () { modjs.require('a'); }, /circular dependencies/);
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

            assert.throws(function () { modjs.require('g'); }, /circular dependencies/);
        });

        it('resolves fake dependencies, when provided with the optional argument', function () {

            modjs.define('a', function () { return 'val-a'; });
            modjs.define('b', ['a'], function (x) { return x; });
            modjs.define('c', ['b'], function (x) { return x; });

            // Resolves fake dependency directly
            assert.strictEqual(modjs.require('a', {a: 'fake-a1'}), 'fake-a1');
            // Resolves fake dependency recursively
            assert.strictEqual(modjs.require('b', {a: 'fake-a2'}), 'fake-a2');
            // Does not memorize value of b resolved before
            assert.strictEqual(modjs.require('c', {a: 'fake-a3'}), 'fake-a3');
            // Resolves to the first fake dependency in the chain
            assert.strictEqual(modjs.require('c', {a: 'fake-a', b: 'fake-b'}), 'fake-b');
        });

        it('resolves fake dependencies, even when actual dependency had been resolved before', function () {

            modjs.define('a', function () { return 'val-a'; });
            modjs.define('b', ['a'], function (x) { return x; });
            modjs.define('c', ['b'], function (x) { return x; });

            // This call memorizes values in instances
            assert.strictEqual(modjs.require('c'), 'val-a');

            assert.strictEqual(modjs.require('a', {a: 'fake-a1'}), 'fake-a1');
            assert.strictEqual(modjs.require('b', {a: 'fake-a2'}), 'fake-a2');
            assert.strictEqual(modjs.require('c', {a: 'fake-a3'}), 'fake-a3');
        });

        it('throws error for cyclic dependencies when fake dependencies don\'t break the cycle', function () {

            modjs.define('a', ['b'], {});
            modjs.define('b', ['a'], {});

            assert.throws(function () { modjs.require('b', {z: 'val-z'}); }, /circular dependencies/);
        });

        it('allows to resolve cyclic dependencies when fake dependencies break the cycle', function () {

            modjs.define('a', ['b'], {});
            modjs.define('b', ['a'], function (a) { return a; });

            assert.strictEqual(modjs.require('b', {a: 'fake-a'}), 'fake-a');
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


    describe('.create()', function () {

        it('is function', function () {

            assert.ok(_.isFunction(modjs.create));
        });

        it('returns plain object', function () {

            assert.ok(_.isPlainObject(modjs.create()));
        });

        it('instances work independently', function () {

            var modjs2 = modjs.create();

            assert.deepEqual(_.keys(modjs.state()), []);
            assert.deepEqual(_.keys(modjs2.state()), []);

            modjs.define('a', {});

            assert.deepEqual(_.keys(modjs.state()), ['a']);
            assert.deepEqual(_.keys(modjs2.state()), []);

            modjs2.define('b', {});

            assert.deepEqual(_.keys(modjs.state()), ['a']);
            assert.deepEqual(_.keys(modjs2.state()), ['b']);

            modjs.require('a');
            assert.throws(function () { modjs.require('b'); }, /id not defined/);
            modjs2.require('b');
            assert.throws(function () { modjs2.require('a'); }, /id not defined/);
        });
    });
});

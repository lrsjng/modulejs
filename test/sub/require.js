'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.require()', function () {

    var modjs;
    var def;
    var req;

    beforeEach(function () {
        modjs = this.modulejs.create();
        def = modjs.define;
        req = modjs.require;
    });

    it('is function', function () {
        assert.ok(_.isFunction(req));
    });

    it('error when no id', function () {
        assert.throws(function () { req(); }, /id must be string/);
    });

    it('error when non-string id', function () {
        assert.throws(function () { req({}); }, /id must be string/);
    });

    it('error when unknown id', function () {
        assert.throws(function () { req('a'); }, /id not defined/);
    });

    it('error when cyclic dependencies', function () {
        def('a', ['b'], {});
        def('b', ['a'], {});
        assert.throws(function () { req('a'); }, /circular dependencies/);
    });

    it('returns instance for known id', function () {
        def('a', function () { return 'val-a'; });
        assert.strictEqual(req('a'), 'val-a');
    });

    it('calls constructor exactly once per id', function () {
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

        assert.throws(function () { req('g'); }, /circular dependencies/);
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

        assert.throws(function () { req('b', {z: 'val-z'}); }, /circular dependencies/);
    });

    it('allows to resolve cyclic dependencies when fake dependencies break the cycle', function () {
        def('a', ['b'], {});
        def('b', ['a'], function (a) { return a; });

        assert.strictEqual(req('b', {a: 'fake-a'}), 'fake-a');
    });
});

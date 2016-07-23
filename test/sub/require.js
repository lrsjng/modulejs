const {test, assert, spy} = require('scar');
const {modulejs} = require('../loader');

test('modulejs.require is function', () => {
    const modjs = modulejs.create();
    assert.equal(typeof modjs.require, 'function');
});

test('modulejs.require() throws if no id', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.require(), /id must be string/);
});

test('modulejs.require() throws if non-string id', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.require({}), /id must be string/);
});

test('modulejs.require() throws if id is not defined', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.require('a'), /id not defined/);
});

test('modulejs.require() throws on cyclic dependencies', () => {
    const modjs = modulejs.create();
    modjs.define('a', ['b'], {});
    modjs.define('b', ['a'], {});
    assert.throws(() => modjs.require('a'), /circular dependencies/);
});

test('modulejs.require() returns instance for known id', () => {
    const modjs = modulejs.create();
    modjs.define('a', 'val-a');
    assert.equal(modjs.require('a'), 'val-a');
});

test('modulejs.require() calls constructor exactly once per id', () => {
    const modjs = modulejs.create();
    const fn = spy();
    modjs.define('a', fn);

    assert.equal(fn.calls.length, 0);
    modjs.require('a');
    assert.equal(fn.calls.length, 1);
    modjs.require('a');
    assert.equal(fn.calls.length, 1);
});

test('modulejs.require() returns always the same instance per id', () => {
    const modjs = modulejs.create();
    modjs.define('a', () => ({}));

    assert.notEqual({}, {});
    assert.notEqual(modjs.require('a'), {});
    assert.equal(modjs.require('a'), modjs.require('a'));
});

test('modulejs.require() resolves long dependency chains', () => {
    const modjs = modulejs.create();
    modjs.define('a', () => 'val-a');
    modjs.define('b', ['a'], x => x);
    modjs.define('c', ['b'], x => x);
    modjs.define('d', ['c'], x => x);
    modjs.define('e', ['d'], x => x);
    modjs.define('f', ['e'], x => x);
    modjs.define('g', ['f'], x => x);

    assert.equal(modjs.require('g'), 'val-a');
});

test('modulejs.require() throws if long cyclic dependencies', () => {
    const modjs = modulejs.create();
    modjs.define('a', ['g'], {});
    modjs.define('b', ['a'], {});
    modjs.define('c', ['b'], {});
    modjs.define('d', ['c'], {});
    modjs.define('e', ['d'], {});
    modjs.define('f', ['e'], {});
    modjs.define('g', ['f'], {});

    assert.throws(() => { modjs.require('g'); }, /circular dependencies/);
});

test('modulejs.require() resolves fake dependencies, when provided with the optional argument', () => {
    const modjs = modulejs.create();
    modjs.define('a', () => 'val-a');
    modjs.define('b', ['a'], x => x);
    modjs.define('c', ['b'], x => x);

    // Resolves fake dependency directly
    assert.equal(modjs.require('a', {a: 'fake-a1'}), 'fake-a1');
    // Resolves fake dependency recursively
    assert.equal(modjs.require('b', {a: 'fake-a2'}), 'fake-a2');
    // Does not memorize value of b resolved before
    assert.equal(modjs.require('c', {a: 'fake-a3'}), 'fake-a3');
    // Resolves to the first fake dependency in the chain
    assert.equal(modjs.require('c', {a: 'fake-a', b: 'fake-b'}), 'fake-b');
});

test('modulejs.require() resolves fake dependencies, even when actual dependency had been resolved before', () => {
    const modjs = modulejs.create();
    modjs.define('a', () => 'val-a');
    modjs.define('b', ['a'], x => x);
    modjs.define('c', ['b'], x => x);

    // This call memorizes values in instances
    assert.equal(modjs.require('c'), 'val-a');

    assert.equal(modjs.require('a', {a: 'fake-a1'}), 'fake-a1');
    assert.equal(modjs.require('b', {a: 'fake-a2'}), 'fake-a2');
    assert.equal(modjs.require('c', {a: 'fake-a3'}), 'fake-a3');
});

test('modulejs.require() throws for cyclic dependencies when fake dependencies don\'t break the cycle', () => {
    const modjs = modulejs.create();
    modjs.define('a', ['b'], {});
    modjs.define('b', ['a'], {});

    assert.throws(() => { modjs.require('b', {z: 'val-z'}); }, /circular dependencies/);
});

test('modulejs.require() allows to resolve cyclic dependencies when fake dependencies break the cycle', () => {
    const modjs = modulejs.create();
    modjs.define('a', ['b'], {});
    modjs.define('b', ['a'], a => a);

    assert.equal(modjs.require('b', {a: 'fake-a'}), 'fake-a');
});

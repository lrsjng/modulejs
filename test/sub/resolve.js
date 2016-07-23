const {test, assert, spy} = require('scar');
const {util} = require('../loader');

const addDef = (defs, id, deps, fn) => {
    defs[id] = {
        id,
        deps,
        fn: typeof fn === 'function' ? fn : () => fn
    };
};

test('util.resolve is function', () => {
    assert.equal(typeof util.resolve, 'function');
});

test('util.resolve() throws on cyclic dependencies', () => {
    const defs = {};
    const insts = {};
    addDef(defs, 'a', ['b'], {});
    addDef(defs, 'b', ['a'], {});
    assert.throws(() => util.resolve(defs, insts, 'a'), /circular dependencies/);
});

test('util.resolve() returns instance for known id', () => {
    const defs = {};
    const insts = {};
    addDef(defs, 'a', [], 'val-a');
    assert.equal(util.resolve(defs, insts, 'a'), 'val-a');
});

test('util.resolve() adds new instances', () => {
    const defs = {};
    const insts = {};
    addDef(defs, 'a', [], 'val-a');
    assert.deepEqual(insts, {});
    assert.equal(util.resolve(defs, insts, 'a'), 'val-a');
    assert.deepEqual(insts, {a: 'val-a'});
});

test('util.resolve() calls constructor exactly once per id', () => {
    const defs = {};
    const insts = {};
    const fn = spy('val-a');
    addDef(defs, 'a', [], fn);
    assert.equal(fn.calls.length, 0);
    assert.equal(util.resolve(defs, insts, 'a'), 'val-a');
    assert.equal(fn.calls.length, 1);
    assert.equal(util.resolve(defs, insts, 'a'), 'val-a');
    assert.equal(fn.calls.length, 1);
});

test('util.resolve() returns always the same instance per id', () => {
    const defs = {};
    const insts = {};
    const objA = {};
    const objB = {};
    addDef(defs, 'a', [], objA);
    addDef(defs, 'b', [], () => objB);

    assert.notEqual({}, {});
    assert.notEqual(objA, objB);
    assert.equal(objA, objA);
    assert.equal(objB, objB);

    assert.equal(util.resolve(defs, insts, 'a'), objA);
    assert.equal(util.resolve(defs, insts, 'a'), objA);
    assert.equal(util.resolve(defs, insts, 'a'), util.resolve(defs, insts, 'a'));
    assert.equal(util.resolve(defs, insts, 'b'), objB);
    assert.equal(util.resolve(defs, insts, 'b'), objB);
    assert.equal(util.resolve(defs, insts, 'b'), util.resolve(defs, insts, 'b'));
});

test('util.resolve() resolves long dependency chains', () => {
    const defs = {};
    const insts = {};
    addDef(defs, 'a', [], () => 'val-a');
    addDef(defs, 'b', ['a'], x => x);
    addDef(defs, 'c', ['b'], x => x);
    addDef(defs, 'd', ['c'], x => x);
    addDef(defs, 'e', ['d'], x => x);
    addDef(defs, 'f', ['e'], x => x);
    addDef(defs, 'g', ['f'], x => x);

    assert.equal(util.resolve(defs, insts, 'g'), 'val-a');
});

test('util.resolve() throws if long cyclic dependencies', () => {
    const defs = {};
    const insts = {};
    addDef(defs, 'a', ['b'], {});
    addDef(defs, 'b', ['a'], {});
    addDef(defs, 'c', ['b'], {});
    addDef(defs, 'd', ['c'], {});
    addDef(defs, 'e', ['d'], {});
    addDef(defs, 'f', ['e'], {});
    addDef(defs, 'g', ['f'], {});

    assert.throws(() => {util.resolve(defs, insts, 'g');}, /circular dependencies/);
});

test('util.resolve() prefers instances to definitions', () => {
    const defs = {};
    addDef(defs, 'a', [], () => 'val-a');
    addDef(defs, 'b', ['a'], x => x);
    addDef(defs, 'c', ['b'], x => x);

    const insts1 = {a: 'alt-a'};
    assert.equal(util.resolve(defs, insts1, 'a'), 'alt-a');
    assert.equal(util.resolve(defs, insts1, 'b'), 'alt-a');
    assert.equal(util.resolve(defs, insts1, 'c'), 'alt-a');

    const insts2 = {b: 'alt-b'};
    assert.equal(util.resolve(defs, insts2, 'a'), 'val-a');
    assert.equal(util.resolve(defs, insts2, 'b'), 'alt-b');
    assert.equal(util.resolve(defs, insts2, 'c'), 'alt-b');

    const insts3 = {c: 'alt-c'};
    assert.equal(util.resolve(defs, insts3, 'a'), 'val-a');
    assert.equal(util.resolve(defs, insts3, 'b'), 'val-a');
    assert.equal(util.resolve(defs, insts3, 'c'), 'alt-c');
});

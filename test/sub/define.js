const {test, assert, insp} = require('scar');
const {modulejs} = require('../loader');

test('modulejs.define is function', () => {
    assert.equal(typeof modulejs.define, 'function');
});

test('modulejs.define() throws', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.define(), /id must be string/);
});

test('modulejs.define() throws if non-string id', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.define(true, [], {}), /id must be string/);
});

test('modulejs.define() throws if non-array dependencies', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.define('a', true, {}), /deps must be array/);
});

test('modulejs.define() returns undefined', () => {
    const modjs = modulejs.create();
    assert.equal(modjs.define('a'), undefined);
});

test('modulejs.define() throws if id already defined', () => {
    const modjs = modulejs.create();
    assert.equal(modjs.define('a'), undefined);
    assert.throws(() => modjs.define('a'), /id already defined/);
});

test('modulejs.define(id)  ->  .define(id, [], function () { return undefined; })', () => {
    const modjs = modulejs.create();
    const defs = modjs._d;
    const id = 'a';
    assert.equal(modjs.define(id), undefined);

    assert.equal(typeof defs[id], 'object');
    assert.equal(defs[id].id, id);
    assert.deepEqual(defs[id].deps, []);
    assert.equal(typeof defs[id].fn, 'function');
    assert.equal(defs[id].fn(), undefined);
});

test('modulejs.define(id, fn)  ->  .define(id, [], fn)', () => {
    const modjs = modulejs.create();
    const defs = modjs._d;
    const id = 'a';
    const fn = () => {};
    assert.equal(modjs.define(id, fn), undefined);

    assert.equal(typeof defs[id], 'object');
    assert.equal(defs[id].id, id);
    assert.deepEqual(defs[id].deps, []);
    assert.equal(defs[id].fn, fn);
});

test('modulejs.define(id, arr, fn)  ->  .define(id, arr, fn)', () => {
    const modjs = modulejs.create();
    const defs = modjs._d;
    const id = 'a';
    const arr = [];
    const fn = () => {};
    assert.equal(modjs.define(id, fn), undefined);

    assert.equal(typeof defs[id], 'object');
    assert.equal(defs[id].id, id);
    assert.deepEqual(defs[id].deps, arr);
    assert.equal(defs[id].fn, fn);
});

[
    undefined,
    null,
    true,
    false,
    0,
    1,
    [],
    {},
    ''
].forEach(x => {
    test(`modulejs.define(id, ${insp(x)})  ->  .define(id, [], function () { return ${insp(x)}; })`, () => {
        const modjs = modulejs.create();
        const defs = modjs._d;
        const id = 'a';
        assert.equal(modjs.define(id, x), undefined);

        assert.equal(typeof defs[id], 'object');
        assert.equal(defs[id].id, id);
        assert.deepEqual(defs[id].deps, []);
        assert.notEqual(defs[id].deps, x);
        assert.equal(typeof defs[id].fn, 'function');
        assert.equal(defs[id].fn(), x);
    });

    test(`modulejs.define(id, arr, ${insp(x)})  ->  .define(id, arr, function () { return ${insp(x)}; })`, () => {
        const modjs = modulejs.create();
        const defs = modjs._d;
        const id = 'a';
        const arr = [];
        assert.equal(modjs.define(id, x), undefined);

        assert.equal(typeof defs[id], 'object');
        assert.equal(defs[id].id, id);
        assert.deepEqual(defs[id].deps, arr);
        assert.equal(typeof defs[id].fn, 'function');
        assert.equal(defs[id].fn(), x);
    });
});

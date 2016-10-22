const {test, assert, insp} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs.unregister is function', () => {
    assert.equal(typeof modulejs.unregister, 'function');
});

test('modulejs.unregister() throws', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.unregister(), /id must be string/);
});

test('modulejs.unregister() throws if non-string id', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.unregister(true), /id must be string/);
});

test('modulejs.unregister() throws if undefined module', () => {
    const modjs = modulejs.create();
    assert.throws(() => modjs.unregister('a'), /id not defined/);
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
    test(`modulejs.unregister(id)  ->  .define(id, arr, function () { return ${insp(x)}; })`, () => {
        const modjs = modulejs.create();
        const defs = modjs._d;
        const id = 'a';
        assert.equal(modjs.define(id, x), undefined);

        modjs.unregister(id);
        assert.equal(typeof defs[id], 'undefined');
        assert.throws(() => modjs.require(id), /id not defined/);
    });
});

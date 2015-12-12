const {test, assert, insp} = require('scar');
const loader = require('../loader');

const PROPS = [
    'create',
    'define',
    'log',
    'require',
    'state',
    '_private'
];

test('run tests with sandboxed minified version (loader.modulejs === loader.min_root)', () => {
    assert.equal(loader.modulejs, loader.min_root);
});

Object.keys(loader).forEach(key => {
    const modjs = loader[key];

    test(`modulejs (${key}) is object`, () => {
        assert.equal(typeof modjs, 'object');
    });

    test(`modulejs (${key}) has the right props: ${insp(PROPS)}`, () => {
        assert.deepEqual(Object.keys(modjs).sort(), PROPS.sort());
    });
});

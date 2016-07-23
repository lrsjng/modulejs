const {test, assert} = require('scar');
const {modulejs} = require('../loader');

test('modulejs.create is function', () => {
    assert.equal(typeof modulejs.create, 'function');
});

test('modulejs.create() returns plain object', () => {
    assert.equal(typeof modulejs.create(), 'object');
});

test('modulejs.create instances work independently', () => {
    const modjs1 = modulejs.create();
    const modjs2 = modulejs.create();

    assert.deepEqual(Object.keys(modjs1.state()), []);
    assert.deepEqual(Object.keys(modjs2.state()), []);

    modjs1.define('a', {});

    assert.deepEqual(Object.keys(modjs1.state()), ['a']);
    assert.deepEqual(Object.keys(modjs2.state()), []);

    modjs2.define('b', {});

    assert.deepEqual(Object.keys(modjs1.state()), ['a']);
    assert.deepEqual(Object.keys(modjs2.state()), ['b']);

    modjs1.require('a');
    assert.throws(() => modjs1.require('b'), /id not defined/);
    modjs2.require('b');
    assert.throws(() => modjs2.require('a'), /id not defined/);
});

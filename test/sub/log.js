const {test, assert} = require('scar');
const {modulejs} = require('../loader');

test('modulejs.log() no definitions', () => {
    const modjs = modulejs.create();
    assert.equal(modjs.log(), '\n');
    assert.equal(modjs.log(true), '\n');
});

test('modulejs.log() one definition', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    assert.equal(modjs.log(), '\n  a -> [  ]\n');
    assert.equal(modjs.log(true), '\n  a -> [  ]\n');
});

test('modulejs.log() two definitions with deps', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    modjs.define('b', ['a'], {});
    assert.equal(modjs.log(), '\n  a -> [  ]\n  b -> [ a ]\n');
    assert.equal(modjs.log(true), '\n  a -> [ b ]\n  b -> [  ]\n');
});

test('modulejs.log() two definitions with deps and instance', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    modjs.define('b', ['a'], {});
    modjs.require('a');
    assert.equal(modjs.log(), '\n* a -> [  ]\n  b -> [ a ]\n');
    assert.equal(modjs.log(true), '\n* a -> [ b ]\n  b -> [  ]\n');
});

test('modulejs.log() in order of definition', () => {
    const modjs = modulejs.create();
    modjs.define('c', {});
    modjs.define('a', {});
    modjs.define('d', ['c', 'b'], {});
    modjs.define('b', ['a'], {});
    assert.equal(modjs.log(), '\n  c -> [  ]\n  a -> [  ]\n  d -> [ c, a, b ]\n  b -> [ a ]\n');
    assert.equal(modjs.log(true), '\n  c -> [ d ]\n  a -> [ d, b ]\n  d -> [  ]\n  b -> [ d ]\n');
});

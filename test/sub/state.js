const {test, assert} = require('scar');
const {modulejs} = require('../loader');

test('modulejs.state is function', () => {
    const modjs = modulejs.create();
    assert.equal(typeof modjs.state, 'function');
});

test('modulejs.state() no definitions', () => {
    const modjs = modulejs.create();
    assert.equal(typeof modjs.state(), 'object');
    assert.deepEqual(modjs.state(), {});
});

test('modulejs.state() one definition', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    assert.equal(typeof modjs.state(), 'object');
    assert.deepEqual(modjs.state(), {
        a: {
            deps: [],
            init: false,
            reqd: [],
            reqs: []
        }
    });
});

test('modulejs.state() two definitions with deps', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    modjs.define('b', ['a'], {});
    assert.equal(typeof modjs.state(), 'object');
    assert.deepEqual(modjs.state(), {
        a: {
            deps: [],
            init: false,
            reqd: ['b'],
            reqs: []
        },
        b: {
            deps: ['a'],
            init: false,
            reqd: [],
            reqs: ['a']
        }
    });
});

test('modulejs.state() two definitions with deps and instance', () => {
    const modjs = modulejs.create();
    modjs.define('a', {});
    modjs.define('b', ['a'], {});
    modjs.require('a');
    assert.equal(typeof modjs.state(), 'object');
    assert.deepEqual(modjs.state(), {
        a: {
            deps: [],
            init: true,
            reqd: ['b'],
            reqs: []
        },
        b: {
            deps: ['a'],
            init: false,
            reqd: [],
            reqs: ['a']
        }
    });
});

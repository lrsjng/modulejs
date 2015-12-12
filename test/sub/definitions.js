const {test, assert} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs._private.definitions is plain object', () => {
    assert.equal(typeof modulejs._private.definitions, 'object');
});

test('modulejs._private.definitions is empty', () => {
    assert.equal(Object.keys(modulejs._private.definitions).length, 0);
});

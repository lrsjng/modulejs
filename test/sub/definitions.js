const {test, assert} = require('scar');
const {modulejs} = require('../loader');

test('modulejs._d is plain object', () => {
    assert.equal(typeof modulejs._d, 'object');
});

test('modulejs._d is empty', () => {
    assert.equal(Object.keys(modulejs._d).length, 0);
});

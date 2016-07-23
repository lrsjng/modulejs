const {test, assert} = require('scar');
const {modulejs} = require('../loader');

test('modulejs._i is plain object', () => {
    assert.equal(typeof modulejs._i, 'object');
});

test('modulejs._i is empty', () => {
    assert.equal(Object.keys(modulejs._i).length, 0);
});

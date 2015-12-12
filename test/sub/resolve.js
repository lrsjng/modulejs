const {test, assert} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs._private.resolve is function', () => {
    assert.equal(typeof modulejs._private.resolve, 'function');
});

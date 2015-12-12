const {test, assert} = require('scar');
const modulejs = require('../../lib/modulejs');

test('modulejs._private.resolve is function', () => {
    assert.equal(typeof modulejs._private.resolve, 'function');
});

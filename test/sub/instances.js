const {test, assert} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs._private.instances is plain object', () => {
    assert.equal(typeof modulejs._private.instances, 'object');
});

test('modulejs._private.instances is empty', () => {
    assert.equal(Object.keys(modulejs._private.instances).length, 0);
});

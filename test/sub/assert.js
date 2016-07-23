const {test, assert} = require('scar');
const {util} = require('../loader');

test('util.assert is function', () => {
    assert.equal(typeof util.assert, 'function');
});

test('util.assert() throws', () => {
    assert.throws(() => util.assert());
});

test('util.assert(true) does not throw', () => {
    assert.equal(util.assert(true), undefined);
});

test('util.assert(false) throws', () => {
    assert.throws(() => util.assert(false));
});

test('util.assert(false, msg) throws correct message', () => {
    assert.throws(() => {
        util.assert(false, 'test');
    }, /\[modulejs\] test/);
});

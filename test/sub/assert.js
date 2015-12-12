const {test, assert} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs._private.assert is function', () => {
    const ass = modulejs.create()._private.assert;
    assert.equal(typeof ass, 'function');
});

test('modulejs._private.assert() throws', () => {
    const ass = modulejs.create()._private.assert;
    assert.throws(() => ass());
});

test('modulejs._private.assert(true) does not throw', () => {
    const ass = modulejs.create()._private.assert;
    assert.equal(ass(true), undefined);
});

test('modulejs._private.assert(false) throws', () => {
    const ass = modulejs.create()._private.assert;
    assert.throws(() => ass(false));
});

test('modulejs._private.assert(false, msg) throws correct message', () => {
    const message = 'test';
    const ass = modulejs.create()._private.assert;

    assert.throws(() => {
        ass(false, message);
    }, /\[modulejs\] test/);
});

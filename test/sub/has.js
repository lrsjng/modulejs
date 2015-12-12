const {test, assert, insp} = require('scar');
const modulejs = require('../loader').modulejs;
const has = modulejs._private.has;

test('modulejs._private.has is function', () => {
    assert.equal(typeof has, 'function');
});

[
    [{a: 1}, 'a', true],

    [{a: 1}, undefined, false],
    [{a: 1}, 'b', false],
    [{a: 1}, 'toString', false],
    [undefined, undefined, false],
    [null, 1, false],
    [undefined, 1, false],
    [{}, undefined, false],
    [{}, null, false],
    [{}, 1, false]
].forEach(x => {
    const [arg1, arg2, exp] = x;

    test(`modulejs._private.has(${insp(arg1)}, ${insp(arg2)}) === ${insp(exp)}`, () => {
        assert.equal(has(arg1, arg2), exp);
    });
});

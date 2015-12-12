const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');
const isString = modulejs._private.isString;

test('modulejs._private.isString is function', () => {
    assert.equal(typeof isString, 'function');
});

[
    ['', true],
    ['test', true],

    [[], false],
    [{}, false],
    [() => {}, false],
    [new RegExp(), false],
    [undefined, false],
    [true, false],
    [false, false],
    [null, false],
    [0, false],
    [1, false],
    [0.0, false],
    [1.0, false]
].forEach(x => {
    const [arg, exp] = x;

    test(`modulejs._private.isString(${insp(arg)}) === ${insp(exp)}`, () => {
        assert.equal(isString(arg), exp);
    });
});

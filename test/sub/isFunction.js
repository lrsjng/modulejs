const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');
const isFunction = modulejs._private.isFunction;

test('modulejs._private.isFunction is function', () => {
    assert.equal(typeof isFunction, 'function');
});

[
    [() => {}, true],

    [[], false],
    [{}, false],
    [new RegExp(), false],
    [undefined, false],
    [true, false],
    [false, false],
    [null, false],
    [0, false],
    [1, false],
    [0.0, false],
    [1.0, false],
    ['', false],
    ['test', false]
].forEach(x => {
    const [arg, exp] = x;

    test(`modulejs._private.isFunction(${insp(arg)}) === ${insp(exp)}`, () => {
        assert.equal(isFunction(arg), exp);
    });
});

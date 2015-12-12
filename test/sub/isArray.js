const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');
const isArray = modulejs._private.isArray;

test('modulejs._private.isArray is function', () => {
    assert.equal(typeof isArray, 'function');
});

[
    [[], true],

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
    [1.0, false],
    ['', false],
    ['test', false]
].forEach(x => {
    const [arg, exp] = x;

    test('modulejs._private.isArray(' + insp(arg) + ') === ' + insp(exp), () => {
        assert.equal(isArray(arg), exp);
    });
});

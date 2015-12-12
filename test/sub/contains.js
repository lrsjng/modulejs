const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');

test('modulejs._private.contains is function', () => {
    const contains = modulejs._private.contains;
    assert.equal(typeof contains, 'function');
});

[
    [[undefined], undefined, true],
    [[1], 1, true],
    [[1, 2], 1, true],
    [[1, 2, 3], 1, true],
    ['abc', 'a', true],

    [undefined, undefined, false],
    [null, 1, false],
    [undefined, 1, false],
    [[], undefined, false],
    [[], null, false],
    [[], 1, false],
    [[1, 2, 3], 4, false],
    ['abc', 'x', false]
].forEach(x => {
    const [arg1, arg2, exp] = x;

    test(`modulejs._private.contains(${insp(arg1)}, ${insp(arg2)}) === ${insp(exp)}`, () => {
        const contains = modulejs._private.contains;
        assert.deepEqual(contains(arg1, arg2), exp);
    });
});

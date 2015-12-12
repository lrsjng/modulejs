const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');

test('modulejs._private.uniq is function', () => {
    assert.equal(typeof modulejs._private.uniq, 'function');
});

[
    [null, []],
    [undefined, []],
    [[], []],
    [[1], [1]],
    [[1, 2], [1, 2]],
    [[1, 2, 1], [1, 2]],
    [[1, 1, 2], [1, 2]],
    [[1, 2, 2], [1, 2]],
    [[1, 2, 3, 4], [1, 2, 3, 4]],
    [[1, 2, 3, 2, 1, 4, 3], [1, 2, 3, 4]],
    ['ababc', ['a', 'b', 'c']]
].forEach(x => {
    const [arg, exp] = x;

    test(`modulejs._private.uniq(${insp(arg)}) === ${insp(exp)}`, () => {
        assert.deepEqual(modulejs._private.uniq(arg), exp);
    });
});

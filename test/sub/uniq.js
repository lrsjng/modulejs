const {test, assert, insp} = require('scar');
const {util} = require('../loader');

test('util.uniq is function', () => {
    assert.equal(typeof util.uniq, 'function');
});

[
    [[], []],
    [[1], [1]],
    [[1, 2], [1, 2]],
    [[1, 2, 1], [1, 2]],
    [[1, 1, 2], [1, 2]],
    [[1, 2, 2], [1, 2]],
    [[1, 2, 3, 4], [1, 2, 3, 4]],
    [[1, 2, 3, 2, 1, 4, 3], [1, 2, 3, 4]]
].forEach(x => {
    const [arg, exp] = x;

    test(`util.uniq(${insp(arg)}) === ${insp(exp)}`, () => {
        assert.deepEqual(util.uniq(arg), exp);
    });
});

[
    undefined,
    null,
    0,
    1,
    'a',
    /a/
].forEach(x => {
    test(`util.uniq(${insp(x)}) throws`, () => {
        assert.throws(() => util.uniq(x), /TypeError/);
    });
});

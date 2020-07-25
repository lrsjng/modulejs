const {test, assert, insp, spy} = require('scar');
const {util} = require('../loader');

test('util.for_own is function', () => {
    assert.equal(typeof util.for_own, 'function');
});

[
    [],
    [undefined],
    [null],
    [undefined, null],
    [1],
    [1, 2, 3],
    {},
    {a: 1},
    {a: undefined},
    {a: null},
    {a: undefined, b: null},
    {a: 1, b: 2},
    {a: 1, b: 2, c: 3},
    Object.create({a: 1, b: 2}),
    'abc'
].forEach(x => {
    test(`util.for_own(${insp(x)}, fn)`, () => {
        const keys = Object.keys(x);
        const fn = spy();
        assert.equal(util.for_own(x, fn), undefined);
        assert.equal(fn.calls.length, keys.length);
        fn.calls.forEach((call, idx) => {
            assert.equal(call.args[1], keys[idx]);
            assert.equal(call.args[0], x[keys[idx]]);
        });
    });
});

[
    undefined,
    null
].forEach(x => {
    test(`util.for_own(${insp(x)}, fn) throws`, () => {
        const fn = spy();
        assert.throws(() => util.for_own(x, fn));
    });
});

const {test, assert, insp} = require('scar');
const sinon = require('sinon');
const modulejs = require('../loader').modulejs;
const each = modulejs._private.each;

test('modulejs._private.each is function', () => {
    assert.equal(typeof each, 'function');
});

test('modulejs._private.each() returns undefined', () => {
    assert.equal(each(), undefined);
});

[
    undefined,
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
    test(`modulejs._private.each(${insp(x)}, fn)`, () => {
        const spy = sinon.spy();
        assert.equal(each(x, spy), undefined);
        assert.equal(spy.callCount, !x ? 0 : Object.keys(x).length);

        spy.args.forEach(args => {
            assert.equal(args[0], x[args[1]]);
            assert.equal(args[2], x);
        });
    });
});

[
    undefined,
    null,
    true,
    false,
    0,
    1
].forEach(x => {
    test(`modulejs._private.each(${insp(x)}, fn) does not iterate`, () => {
        const spy = sinon.spy();
        assert.equal(each(x, spy), undefined);
        assert.equal(spy.callCount, 0);
    });
});

const {test, assert, insp} = require('scar');
const {util} = require('../loader');

test('util.has is function', () => {
    assert.equal(typeof util.has, 'function');
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

    test(`util.has(${insp(arg1)}, ${insp(arg2)}) === ${insp(exp)}`, () => {
        assert.equal(util.has(arg1, arg2), exp);
    });
});

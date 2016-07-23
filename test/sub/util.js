const {test, assert, insp} = require('scar');
const {util} = require('../loader');

test('util is object', () => {
    assert.equal(typeof util, 'object');
});

const PROPS = [
    'assert',
    'forOwn',
    'has',
    'resolve',
    'uniq'
];

test(`util has the right props: ${insp(PROPS)}`, () => {
    assert.deepEqual(Object.keys(util).sort(), PROPS.sort());
});

const {test, assert, insp} = require('scar');
const {modulejs} = require('../loader');

const PROPS = [
    'create',
    'define',
    'log',
    'require',
    'state',
    '_d',
    '_i'
];

test('modulejs is object', () => {
    assert.equal(typeof modulejs, 'object');
});

test(`modulejs has the right props: ${insp(PROPS)}`, () => {
    assert.deepEqual(Object.keys(modulejs).sort(), PROPS.sort());
});

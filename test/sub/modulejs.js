const {test, assert, insp} = require('scar');
const modulejs = require('../../lib/modulejs');

test('modulejs is object', () => {
    assert.equal(typeof modulejs, 'object');
});

const PROPS = [
    'create',
    'define',
    'log',
    'require',
    'state',
    '_private'
];

test(`modulejs has the right props: ${insp(PROPS)}`, () => {
    assert.deepEqual(Object.keys(modulejs).sort(), PROPS.sort());
});

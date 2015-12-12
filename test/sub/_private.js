const {test, assert, insp} = require('scar');
const modulejs = require('../loader').modulejs;

test('modulejs._private is object', () => {
    assert.equal(typeof modulejs._private, 'object');
});

const PROPS = [
    'assert',
    'contains',
    'definitions',
    'each',
    'has',
    'instances',
    'isArray',
    'isFunction',
    'isString',
    'resolve',
    'uniq'
];

test(`modulejs._private has the right props: ${insp(PROPS)}`, () => {
    assert.deepEqual(Object.keys(modulejs._private).sort(), PROPS.sort());
});

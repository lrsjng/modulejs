'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.contains()', function () {

    var contains;

    before(function () {
        contains = this.modulejs._private.contains;
    });

    it('is function', function () {
        assert.ok(_.isFunction(contains));
    });

    _.each([
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
    ], function (x) {
        var arg1 = x[0];
        var arg2 = x[1];
        var exp = x[2];

        it('.contains(' + insp(arg1) + ', ' + insp(arg2) + ')  ->  ' + insp(exp), function () {
            assert.deepEqual(contains(arg1, arg2), exp);
        });
    });
});

'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.uniq()', function () {

    var uniq;

    before(function () {
        uniq = this.modulejs._private.uniq;
    });

    it('is function', function () {
        assert.ok(_.isFunction(uniq));
    });

    _.each([
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
    ], function (x) {
        var arg = x[0];
        var exp = x[1];

        it('.uniq(' + insp(arg) + ')  ->  ' + insp(exp), function () {
            assert.deepEqual(uniq(arg), exp);
        });
    });
});

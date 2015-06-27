'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.has()', function () {

    var has;

    before(function () {
        has = this.modulejs._private.has;
    });

    it('is function', function () {
        assert.ok(_.isFunction(has));
    });

    _.each([
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
    ], function (x) {
        var arg1 = x[0];
        var arg2 = x[1];
        var exp = x[2];

        it('.has(' + insp(arg1) + ', ' + insp(arg2) + ')  ->  ' + insp(exp), function () {
            assert.strictEqual(has(arg1, arg2), exp);
        });
    });
});

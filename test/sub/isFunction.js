'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.isFunction()', function () {

    var isFunction;

    before(function () {
        isFunction = this.modulejs._private.isFunction;
    });

    it('is function', function () {
        assert.ok(_.isFunction(isFunction));
    });

    _.each([
        [function () {}, true],

        [[], false],
        [{}, false],
        [new RegExp(), false],
        [undefined, false],
        [true, false],
        [false, false],
        [null, false],
        [0, false],
        [1, false],
        [0.0, false],
        [1.0, false],
        ['', false],
        ['test', false]
    ], function (x) {
        var arg = x[0];
        var exp = x[1];

        it('.isFunction(' + insp(arg) + ')  ->  ' + insp(exp), function () {
            assert.strictEqual(isFunction(arg), exp);
        });
    });
});

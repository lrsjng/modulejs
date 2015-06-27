'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.isString()', function () {

    var isString;

    before(function () {
        isString = this.modulejs._private.isString;
    });

    it('is function', function () {
        assert.ok(_.isFunction(isString));
    });

    _.each([
        ['', true],
        ['test', true],

        [[], false],
        [{}, false],
        [function () {}, false],
        [new RegExp(), false],
        [undefined, false],
        [true, false],
        [false, false],
        [null, false],
        [0, false],
        [1, false],
        [0.0, false],
        [1.0, false]
    ], function (x) {
        var arg = x[0];
        var exp = x[1];

        it('.isString(' + insp(arg) + ')  ->  ' + insp(exp), function () {
            assert.strictEqual(isString(arg), exp);
        });
    });
});

'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.isArray()', function () {

    var isArray;

    before(function () {
        isArray = this.modulejs._private.isArray;
    });

    it('is function', function () {
        assert.ok(_.isFunction(isArray));
    });

    _.each([
        [[], true],

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
        [1.0, false],
        ['', false],
        ['test', false]
    ], function (x) {
        var arg = x[0];
        var exp = x[1];

        it('.isArray(' + insp(arg) + ')  ->  ' + insp(exp), function () {
            assert.strictEqual(isArray(arg), exp);
        });
    });
});

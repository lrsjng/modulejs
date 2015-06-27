'use strict';

var assert = require('assert');
var insp = require('util').inspect;
var _ = require('lodash');

describe('.isObject()', function () {

    var isObject;

    before(function () {
        isObject = this.modulejs._private.isObject;
    });

    it('is function', function () {
        assert.ok(_.isFunction(isObject));
    });

    _.each([
        [{}, true],

        [[], false],
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

        it('.isObject(' + insp(arg) + ')  ->  ' + insp(exp), function () {
            assert.strictEqual(isObject(arg), exp);
        });
    });
});

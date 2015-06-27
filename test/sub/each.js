'use strict';

var assert = require('chai').assert;
var insp = require('util').inspect;
var _ = require('lodash');
var sinon = require('sinon');

describe('.each()', function () {

    var each;

    before(function () {
        each = this.modulejs._private.each;
    });

    it('is function', function () {
        assert.ok(_.isFunction(each));
    });

    it('.each() returns undefined', function () {
        assert.isUndefined(each());
    });

    _.each([
        undefined,
        [],
        [undefined],
        [null],
        [undefined, null],
        [1],
        [1, 2, 3],
        {},
        {a: 1},
        {a: undefined},
        {a: null},
        {a: undefined, b: null},
        {a: 1, b: 2},
        {a: 1, b: 2, c: 3},
        Object.create({a: 1, b: 2}),
        'abc'
    ], function (x) {
        it('.each(' + insp(x) + ', fn)', function () {
            var spy = sinon.spy();
            assert.isUndefined(each(x, spy));
            assert.strictEqual(spy.callCount, _.size(x));

            _.each(spy.args, function (args) {
                assert.strictEqual(args[0], x[args[1]]);
                assert.strictEqual(args[2], x);
            });
        });
    });

    _.each([
        undefined,
        null,
        true,
        false,
        0,
        1
    ], function (x) {
        it('.each(' + insp(x) + ', fn) does not iterate', function () {
            var spy = sinon.spy();
            assert.isUndefined(each(x, spy));
            assert.strictEqual(spy.callCount, 0);
        });
    });
});

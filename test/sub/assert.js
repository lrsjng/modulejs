'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.assert()', function () {

    var ass;

    beforeEach(function () {
        ass = this.modulejs.create()._private.assert;
    });

    it('is function', function () {
        assert.ok(_.isFunction(ass));
    });

    it('throws when no arguments', function () {
        assert.throws(function () { ass(); });
    });

    it('throws no error when expression is true', function () {
        assert.strictEqual(ass(true), undefined);
    });

    it('throws error when expression is false', function () {
        assert.throws(function () { ass(false); });
    });

    it('message is set correct', function () {
        var message = 'test';

        assert.throws(function () {
            ass(false, message);
        }, /\[modulejs\] test/);
    });
});

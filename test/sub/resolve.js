'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.resolve()', function () {

    var resolve;

    before(function () {
        resolve = this.modulejs._private.resolve;
    });

    it('is function', function () {
        assert.ok(_.isFunction(resolve));
    });
});

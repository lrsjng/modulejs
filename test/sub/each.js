'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.each()', function () {

    it('is function', function () {
        assert.ok(_.isFunction(this.modulejs._private.each));
    });
});

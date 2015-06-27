'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('.definitions', function () {

    it('is plain object', function () {
        assert.ok(_.isPlainObject(this.modulejs._private.definitions));
    });

    it('is empty', function () {
        assert.strictEqual(_.size(this.modulejs._private.definitions), 0);
    });
});

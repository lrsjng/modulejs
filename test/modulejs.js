'use strict';

var assert = require('assert');
var _ = require('lodash');

describe('modulejs', function () {

    before(function () {
        this.modulejs = require('../src/modulejs');
    });

    it('is plain object', function () {
        assert.ok(_.isPlainObject(this.modulejs));
    });

    it('has the right properties', function () {
        assert.deepEqual(_.keys(this.modulejs).sort(), [
            '_private',
            'create',
            'define',
            'log',
            'require',
            'state'
        ].sort());
    });

    require('./sub/create');
    require('./sub/define');
    require('./sub/log');
    require('./sub/require');
    require('./sub/state');

    describe('_private', function () {

        it('is plain object', function () {
            assert.ok(_.isPlainObject(this.modulejs._private));
        });

        it('has the right properties', function () {
            assert.deepEqual(_.keys(this.modulejs._private).sort(), [
                'assert',
                'contains',
                'definitions',
                'each',
                'has',
                'instances',
                'isArray',
                'isFunction',
                'isString',
                'resolve',
                'uniq'
            ].sort());
        });

        require('./sub/assert');
        require('./sub/contains');
        require('./sub/definitions');
        require('./sub/each');
        require('./sub/has');
        require('./sub/instances');
        require('./sub/isArray');
        require('./sub/isFunction');
        require('./sub/isString');
        require('./sub/resolve');
        require('./sub/uniq');
    });
});

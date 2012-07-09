/*global __dirname, require, describe, it */


var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	assert = require('assert'),
	_ = require('underscore'),

	sandbox = {},
	content;


content = fs.readFileSync(path.join(__dirname, '../modulejs-debug.js'), 'utf-8');
vm.runInNewContext(content, sandbox, 'modulejs-debug.js');

content = fs.readFileSync(path.join(__dirname, '../modulejs.js'), 'utf-8');
vm.runInNewContext(content, sandbox, 'modulejs.js');


describe('sandbox (debug)', function () {

	it('scripts publish only two globals: "MODULEJS_DEBUG" and "modulejs"', function () {

		assert.strictEqual(_.size(sandbox), 2);
		assert.ok(_.isObject(sandbox.MODULEJS_DEBUG));
		assert.ok(_.isObject(sandbox.modulejs));
	});
});


describe('modulesjs (debug)', function () {

	var modjs = sandbox.modulejs;

	it('is global object', function () {

		assert.ok(_.isObject(modjs));
	});

	it('has right number of members', function () {

		assert.strictEqual(_.size(modjs), 10);
	});

	it('#definitions is object', function () {

		assert.ok(_.isObject(modjs.definitions));
	});

	it('#instances is object', function () {

		assert.ok(_.isObject(modjs.instances));
	});

	it('#define is function', function () {

		assert.ok(_.isFunction(modjs.define));
	});

	it('#_require is function', function () {

		assert.ok(_.isFunction(modjs._require));
	});

	it('#require is function', function () {

		assert.ok(_.isFunction(modjs.require));
	});

	it('#clear is function', function () {

		assert.ok(_.isFunction(modjs.clear));
	});

	it('#isDefined is function', function () {

		assert.ok(_.isFunction(modjs.isDefined));
	});

	it('#ids is function', function () {

		assert.ok(_.isFunction(modjs.ids));
	});

	it('#deps is function', function () {

		assert.ok(_.isFunction(modjs.deps));
	});

	it('#log is function', function () {

		assert.ok(_.isFunction(modjs.log));
	});


	describe('#isDefined', function () {

		var isDef = modjs.isDefined;

		modjs.define('isdef-a', function () {});


		it('returns false when no arguments', function () {

			assert.strictEqual(isDef(), false);
		});

		it('returns false when argument is undefined', function () {

			assert.strictEqual(isDef(undefined), false);
		});

		it('returns false when argument is null', function () {

			assert.strictEqual(isDef(null), false);
		});

		it('returns false when argument is object', function () {

			assert.strictEqual(isDef({}), false);
		});

		it('returns false when argument is array', function () {

			assert.strictEqual(isDef([]), false);
		});

		it('returns false when id not defined', function () {

			assert.strictEqual(isDef('isdef-none'), false);
		});

		it('returns true when id is defined', function () {

			assert.strictEqual(isDef('isdef-a'), true);
		});
	});


	describe('#log', function () {

		var log = modjs.log;

		it('returns string', function () {

			assert.ok(_.isString(log()));
		});
	});
});

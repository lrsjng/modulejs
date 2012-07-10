/*global __dirname, require, describe, before, beforeEach, it, console */


var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	assert = require('assert'),
	_ = require('underscore'),

	// get source
	modulejs_content = fs.readFileSync(path.join(__dirname, '../modulejs.js'), 'utf-8'),

	// helper to check for right error
	throws = function (code, fn) {

		assert.throws(fn, function (e) {

			return _.isObject(e) && _.size(e) === 3 && e.code === code && _.isString(e.msg) && _.isFunction(e.toString);
		});
	};



describe('modulejs', function () {


	var sandbox, modjs, def, req, state, log;

	beforeEach( function () {

		sandbox = {};
		vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');

		modjs = sandbox.modulejs;
		def = modjs.define;
		req = modjs.require;
		state = modjs.state;
		log = modjs.log;
	});


	it('is the only published global in normal mode', function () {

		assert.strictEqual(_.size(sandbox), 1);
		assert.ok(_.isObject(sandbox.modulejs));
	});

	it('has 4 own properties', function () {

		assert.strictEqual(_.size(modjs), 4);
	});

	it('#define is function', function () {

		assert.ok(_.isFunction(modjs.define));
	});

	it('#require is function', function () {

		assert.ok(_.isFunction(modjs.require));
	});

	it('#state is function', function () {

		assert.ok(_.isFunction(modjs.state));
	});

	it('#log is function', function () {

		assert.ok(_.isFunction(modjs.log));
	});


	describe('#define', function () {


		it('error when no arguments', function () {

			throws(11, function () { def(); });
		});

		it('error when only id', function () {

			throws(14, function () { def('a'); });
		});

		it('error when non-string id', function () {

			throws(11, function () { def(true, [], function () {}); });
		});

		it('error when non-array dependencies', function () {

			throws(13, function () { def('a', true, function () {}); });
		});

		it('error when non-function and non-object argument', function () {

			throws(14, function () { def('a', [], true); });
		});


		it('accepts id and constructor', function () {

			assert.strictEqual(def('a', function () {}), undefined);
		});

		it('accepts id, dependencies and constructor', function () {

			assert.strictEqual(def('a', [], function () {}), undefined);
		});

		it('accepts id and object', function () {

			assert.strictEqual(def('a', {}), undefined);
		});

		it('accepts id, dependencies and object', function () {

			assert.strictEqual(def('a', [], {}), undefined);
		});


		it('error when id already defined', function () {

			assert.strictEqual(def('a', {}), undefined);
			throws(12, function () { def('a', {}); });
		});


		it('accepts id and array, handles array as object with no dependencies', function () {

			assert.strictEqual(def('a', []), undefined);
		});

		it('accepts id and two arrays', function () {

			assert.strictEqual(def('a', [], []), undefined);
		});
	});


	describe('#require', function () {

		it('error when no id', function () {

			throws(31, function () { req(); });
		});

		it('error when non-string id', function () {

			throws(31, function () { req({}); });
		});

		it('error when unknown id', function () {

			throws(32, function () { req('a'); });
		});

		it('error when cyclic dependencies', function () {

			def('a', ['b'], {});
			def('b', ['a'], {});
			throws(33, function () { req('a'); });
		});


		it('returns instance for known id', function () {

			def('a', function () { return 'val-a'; });
			assert.strictEqual(req('a'), 'val-a');
		});


		it('calls constructors exactly once per id', function () {

			var counter = 0;

			def('a', function () {

				counter += 1;
				return {};
			});

			assert.strictEqual(counter, 0);
			req('a');
			assert.strictEqual(counter, 1);
			req('a');
			assert.strictEqual(counter, 1);
		});

		it('returns always the same instance per id', function () {

			def('a', function () { return {}; });

			assert.notEqual({}, {});
			assert.notEqual(req('a'), {});
			assert.strictEqual(req('a'), req('a'));
		});
	});


	describe('#state', function () {

		it('returns object', function () {

			assert.ok(_.isObject(state()));
		});
	});


	describe('#log', function () {

		it('returns string', function () {

			assert.ok(_.isString(log()));
		});
	});


	describe('#require', function () {

		it('resolves long dependency chains', function () {

			def('a', function () { return 'val-a'; });
			def('b', ['a'], function (x) { return x; });
			def('c', ['b'], function (x) { return x; });
			def('d', ['c'], function (x) { return x; });
			def('e', ['d'], function (x) { return x; });
			def('f', ['e'], function (x) { return x; });
			def('g', ['f'], function (x) { return x; });

			assert.strictEqual(req('g'), 'val-a');
		});

		it('error when long cyclic dependencies', function () {

			def('a', ['g'], {});
			def('b', ['a'], {});
			def('c', ['b'], {});
			def('d', ['c'], {});
			def('e', ['d'], {});
			def('f', ['e'], {});
			def('g', ['f'], {});

			throws(33, function () { req('g'); });
		});
	});
});

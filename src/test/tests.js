/*global __dirname, require, describe, it */


var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	assert = require('assert'),
	_ = require('underscore'),

	sandbox = {},
	content;


content = fs.readFileSync(path.join(__dirname, '../modulejs.js'), 'utf-8');
vm.runInNewContext(content, sandbox, 'modulejs.js');


var throws = function (fn, code, msg) {

	assert.throws(fn, function (e) {

		return _.isObject(e) && _.size(e) === 3 && e.code === code && _.isString(e.msg) && _.isFunction(e.toString);
	}, msg);
};


describe('sandbox', function () {

	it('script publishes only one global: "modulejs"', function () {

		assert.strictEqual(_.size(sandbox), 1);
		assert.ok(_.isObject(sandbox.modulejs));
	});
});


describe('modulejs', function () {

	var modjs = sandbox.modulejs;

	it('has right number of members', function () {

		assert.strictEqual(_.size(modjs), 2);
	});

	it('#define is function', function () {

		assert.ok(_.isFunction(modjs.define));
	});

	it('#require is function', function () {

		assert.ok(_.isFunction(modjs.require));
	});


	describe('#define', function () {

		var def = sandbox.modulejs.define;

		it('error when no arguments', function () {

			throws(function () { def(); }, 11);
		});

		it('error when only id', function () {

			throws(function () { def('def-a'); }, 14);
		});

		it('error when non-string id', function () {

			throws(function () { def(true, [], function () {}); }, 11);
		});

		it('error when non-array dependencies', function () {

			throws(function () { def('def-b', true, function () {}); }, 13);
		});

		it('error when non-function and non-object argument', function () {

			throws(function () { def('def-c', [], true); }, 14);
		});


		it('accepts id and constructor', function () {

			assert.strictEqual(def('def-d', function () {}), undefined);
		});

		it('accepts id, dependencies and constructor', function () {

			assert.strictEqual(def('def-e', [], function () {}), undefined);
		});

		it('accepts id and object', function () {

			assert.strictEqual(def('def-f', {}), undefined);
		});

		it('accepts id, dependencies and object', function () {

			assert.strictEqual(def('def-g', [], {}), undefined);
		});


		it('error when id already defined', function () {

			throws(function () { def('def-g', {}); }, 12);
		});


		it('accepts id and array, handles array as object with no dependencies', function () {

			assert.strictEqual(def('def-h', []), undefined);
		});

		it('accepts id and two arrays', function () {

			assert.strictEqual(def('def-i', [], []), undefined);
		});
	});


	describe('#require', function () {

		var def = sandbox.modulejs.define,
			req = sandbox.modulejs.require,
			constructorCalls = 0,
			constructor = function () {

				constructorCalls += 1;
				return {
					test: 123
				};
			},
			testObjA = constructor(),
			testObjB = constructor();

		def('req-a', function () { return 'ret-a'; });
		def('req-b', ['req-a'], function () { return 'ret-b'; });
		def('req-c', ['req-d'], function () { return 'ret-c'; });
		def('req-d', ['req-c'], function () { return 'ret-d'; });
		def('req-e', constructor);


		it('error when no arguments', function () {

			throws(function () { req(); }, 31);
		});

		it('error when non-string id', function () {

			throws(function () { req(testObjA); }, 31);
		});

		it('error when unknown id', function () {

			throws(function () { req('req-none'); }, 32);
		});

		it('error when cyclic dependencies', function () {

			throws(function () { req('req-d'); }, 33);
		});


		it('returns instance for id', function () {

			assert.strictEqual(req('req-a'), 'ret-a');
		});

		it('returns array of instances for array of ids', function () {

			assert.deepEqual(req(['req-a', 'req-b']), ['ret-a', 'ret-b']);
		});

		it('returns hash of matchted instances (id->instance) for regular expression', function () {

			assert.deepEqual(req(/req-[abx]/), {'req-a': 'ret-a', 'req-b': 'ret-b'});
		});


		it('calls constructors exactly once per id', function () {

			constructorCalls = 0;
			req('req-e');
			var cc1 = constructorCalls;
			req('req-e');
			var cc2 = constructorCalls;

			assert.ok(cc1 === 1 && cc2 === 1);
		});

		it('returns always the same instance per id', function () {

			assert.notEqual(testObjA, testObjB);
			assert.strictEqual(req('req-e'), req('req-e'));
		});
	});



	describe('#require', function () {

		var def = sandbox.modulejs.define,
			req = sandbox.modulejs.require;

		it('resolves long dependency chains', function () {

			def('mod-ldc-a', function () { return 'val-a'; });
			def('mod-ldc-b', ['mod-ldc-a'], function () { return 'val-b'; });
			def('mod-ldc-c', ['mod-ldc-b'], function () { return 'val-c'; });
			def('mod-ldc-d', ['mod-ldc-c'], function () { return 'val-d'; });
			def('mod-ldc-e', ['mod-ldc-d'], function () { return 'val-e'; });
			def('mod-ldc-f', ['mod-ldc-e'], function () { return 'val-f'; });
			def('mod-ldc-g', ['mod-ldc-f'], function () { return 'val-g'; });

			assert.strictEqual(req('mod-ldc-g'), 'val-g');
		});

		it('error when long cyclic dependencies', function () {

			def('mod-ldci-a', ['mod-ldci-g'], function () { return 'val-a'; });
			def('mod-ldci-b', ['mod-ldci-a'], function () { return 'val-b'; });
			def('mod-ldci-c', ['mod-ldci-b'], function () { return 'val-c'; });
			def('mod-ldci-d', ['mod-ldci-c'], function () { return 'val-d'; });
			def('mod-ldci-e', ['mod-ldci-d'], function () { return 'val-e'; });
			def('mod-ldci-f', ['mod-ldci-e'], function () { return 'val-f'; });
			def('mod-ldci-g', ['mod-ldci-f'], function () { return 'val-g'; });

			throws(function () { req('mod-ldci-g'); }, 33, 'require with long chained dependency circle throws exception');
		});
	});
});


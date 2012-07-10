/*global __dirname, require, describe, before, beforeEach, it, console */


var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	assert = require('assert'),
	_ = require('underscore'),

	// get source
	modulejs_content = fs.readFileSync(path.join(__dirname, '../modulejs.js'), 'utf-8');



describe('MODULEJS', function () {


	var sandbox = { MODULEJS: true };
	vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');
	var MODJS = sandbox.MODULEJS;

	if (!_.isObject(MODJS)) {
		console.log('ONLY PUBLIC API GETS TESTED!');
		return;
	}


	it('is the only published global besides "modulejs" in debug mode', function () {

		assert.strictEqual(_.size(sandbox), 2);
		assert.ok(_.isObject(sandbox.modulejs));
		assert.ok(_.isObject(sandbox.MODULEJS));
	});

	it('has 12 own properties', function () {

		assert.strictEqual(_.size(MODJS), 12);
	});

	it('#isString is function', function () {

		assert.ok(_.isFunction(MODJS.isString));
	});

	it('#isFunction is function', function () {

		assert.ok(_.isFunction(MODJS.isFunction));
	});

	it('#isArray is function', function () {

		assert.ok(_.isFunction(MODJS.isArray));
	});

	it('#isObject is function', function () {

		assert.ok(_.isFunction(MODJS.isObject));
	});

	it('#has is function', function () {

		assert.ok(_.isFunction(MODJS.has));
	});

	it('#each is function', function () {

		assert.ok(_.isFunction(MODJS.each));
	});

	it('#contains is function', function () {

		assert.ok(_.isFunction(MODJS.contains));
	});

	it('#uniq is function', function () {

		assert.ok(_.isFunction(MODJS.uniq));
	});

	it('#err is function', function () {

		assert.ok(_.isFunction(MODJS.err));
	});

	it('#definitions is object', function () {

		assert.ok(_.isObject(MODJS.definitions));
	});

	it('#instances is object', function () {

		assert.ok(_.isObject(MODJS.instances));
	});

	it('#resolve is function', function () {

		assert.ok(_.isFunction(MODJS.resolve));
	});


	describe('#isString', function () {

		it('returns true for string argument only', function () {

			assert.strictEqual(MODJS.isString(''), true);
			assert.strictEqual(MODJS.isString('test'), true);

			assert.strictEqual(MODJS.isString(), false);
			assert.strictEqual(MODJS.isString(true), false);
			assert.strictEqual(MODJS.isString(false), false);
			assert.strictEqual(MODJS.isString(null), false);
			assert.strictEqual(MODJS.isString(0), false);
			assert.strictEqual(MODJS.isString(1), false);
			assert.strictEqual(MODJS.isString(0.0), false);
			assert.strictEqual(MODJS.isString(1.0), false);
			assert.strictEqual(MODJS.isString({}), false);
			assert.strictEqual(MODJS.isString([]), false);
			assert.strictEqual(MODJS.isString(function () {}), false);
			assert.strictEqual(MODJS.isString(new RegExp()), false);
		});
	});


	describe('#isFunction', function () {

		it('returns true for function argument only', function () {

			assert.strictEqual(MODJS.isFunction(function () {}), true);

			assert.strictEqual(MODJS.isFunction(), false);
			assert.strictEqual(MODJS.isFunction(true), false);
			assert.strictEqual(MODJS.isFunction(false), false);
			assert.strictEqual(MODJS.isFunction(null), false);
			assert.strictEqual(MODJS.isFunction(0), false);
			assert.strictEqual(MODJS.isFunction(1), false);
			assert.strictEqual(MODJS.isFunction(0.0), false);
			assert.strictEqual(MODJS.isFunction(1.0), false);
			assert.strictEqual(MODJS.isFunction(''), false);
			assert.strictEqual(MODJS.isFunction('test'), false);
			assert.strictEqual(MODJS.isFunction({}), false);
			assert.strictEqual(MODJS.isFunction([]), false);
			assert.strictEqual(MODJS.isFunction(new RegExp()), false);
		});
	});


	describe('#isArray', function () {

		it('returns true for array argument only', function () {

			assert.strictEqual(MODJS.isArray([]), true);

			assert.strictEqual(MODJS.isArray(), false);
			assert.strictEqual(MODJS.isArray(true), false);
			assert.strictEqual(MODJS.isArray(false), false);
			assert.strictEqual(MODJS.isArray(null), false);
			assert.strictEqual(MODJS.isArray(0), false);
			assert.strictEqual(MODJS.isArray(1), false);
			assert.strictEqual(MODJS.isArray(0.0), false);
			assert.strictEqual(MODJS.isArray(1.0), false);
			assert.strictEqual(MODJS.isArray(''), false);
			assert.strictEqual(MODJS.isArray('test'), false);
			assert.strictEqual(MODJS.isArray({}), false);
			assert.strictEqual(MODJS.isArray(function () {}), false);
			assert.strictEqual(MODJS.isArray(new RegExp()), false);
		});
	});


	describe('#isObject', function () {

		it('returns true for object argument only', function () {

			assert.strictEqual(MODJS.isObject({}), true);
			assert.strictEqual(MODJS.isObject([]), true);
			assert.strictEqual(MODJS.isObject(function () {}), true);
			assert.strictEqual(MODJS.isObject(new RegExp()), true);

			assert.strictEqual(MODJS.isObject(), false);
			assert.strictEqual(MODJS.isObject(true), false);
			assert.strictEqual(MODJS.isObject(false), false);
			assert.strictEqual(MODJS.isObject(null), false);
			assert.strictEqual(MODJS.isObject(0), false);
			assert.strictEqual(MODJS.isObject(1), false);
			assert.strictEqual(MODJS.isObject(0.0), false);
			assert.strictEqual(MODJS.isObject(1.0), false);
			assert.strictEqual(MODJS.isObject(''), false);
			assert.strictEqual(MODJS.isObject('test'), false);
		});
	});


	describe('#has', function () {

		it('returns true if object has own property only', function () {

			var obj = { a: 1 };

			assert.strictEqual(MODJS.has(obj, 'a'), true);

			assert.strictEqual(MODJS.has(obj), false);
			assert.strictEqual(MODJS.has(obj, 'b'), false);
			assert.strictEqual(MODJS.has(obj, 'toString'), false);

			assert.throws(function () { MODJS.has(); });
		});
	});


	describe('#each', function () {

	});


	describe('#contains', function () {

		it('throws error when no arguments', function () {

			assert.throws(function () { MODJS.contains(); });
		});

		it('returns false, if no element argument', function () {

			assert.strictEqual(MODJS.contains([]), false);
		});

		it('returns false, if element argument is "undefined', function () {

			assert.strictEqual(MODJS.contains([], undefined), false);
		});

		it('returns true, if no element argument but "undefined" in array', function () {

			assert.strictEqual(MODJS.contains([undefined]), true);
		});

		it('returns true, if element in array', function () {

			assert.strictEqual(MODJS.contains([1, 2, 3], 3), true);
		});

		it('returns false, if element not in array', function () {

			assert.strictEqual(MODJS.contains([1, 2, 3], 4), false);
		});
	});


	describe('#uniq', function () {

		it('throws error when no arguments', function () {

			assert.throws(function () { MODJS.uniq(); });
		});

		it('returns empty array when empty array', function () {

			assert.deepEqual(MODJS.uniq([]), []);
		});

		it('exact copy when already unique array', function () {

			assert.deepEqual(MODJS.uniq([6, 2, 3]), [6, 2, 3]);
		});

		it('preserves only first occurence of duplicate elements', function () {

			assert.deepEqual(MODJS.uniq([1, 2, 3, 2, 1, 4, 3]), [1, 2, 3, 4]);
		});
	});


	describe('#err', function () {

		it('throws no error when no arguments', function () {

			assert.strictEqual(MODJS.err(), undefined);
		});

		it('throws no error when condition is false', function () {

			assert.strictEqual(MODJS.err(false), undefined);
		});

		it('throws error when condition is true', function () {

			assert.throws(function () { MODJS.err(true); });
		});

		it('error and message are set correct', function () {

			var code = 123,
				message = 'test';

			assert.throws(function () { MODJS.err(true, code, message); }, function (e) {

				var toStr = e.toString();

				return _.size(e) === 3 &&
						e.code === code &&
						e.msg === message &&
						_.isString(toStr) &&
						/ error 123: test$/.test(toStr);
			});
		});
	});


	describe('#definitions', function () {

		it('starts empty', function () {

			assert.strictEqual(_.size(MODJS.definitions), 0);
		});
	});


	describe('#instances', function () {

		it('starts empty', function () {

			assert.strictEqual(_.size(MODJS.instances), 0);
		});
	});


	describe('#resolve', function () {

	});
});

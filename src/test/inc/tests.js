
(function (global, _, name, $$) {
	'use strict';

	var api = global[name],
		debugName = name.toUpperCase(),
		debugApi = global[debugName];

	$$.module('MODE');
	$$.test((debugApi ? 'DEBUG' : 'NORMAL'), function () { $$.ok(true); });




	var $$error = function (fn, code, msg) {

		$$.raises(fn, function (e) {

			return _.isObject(e) && _.size(e) === 3 && e.code === code && _.isString(e.msg) && _.isFunction(e.toString);
		}, msg);
	};




	$$.module('global');


	$$.test(name, 5, function () {

		var ref = api,
			refName = name;

		$$.strictEqual(_.isObject(api), true, name + ' is global object');
		$$.strictEqual(_.size(api), 2 + 1, name + ' has right number of members');

		$$.strictEqual(_.isFunction(api.define), true, name + '.define is function');
		$$.strictEqual(_.isFunction(api.require), true, name + '.require is function');

		$$.strictEqual(_.isFunction(api.noConflict), true, name + '.noConflict is function');
	});




	$$.module(name);


	$$.test('define', 12, function () {

		$$error(function () { api.define(); }, 11, 'define with no arguments throws exception');
		$$error(function () { api.define('def-a'); }, 14, 'define with no constructor or object argument throws exception');
		$$error(function () { api.define(true, [], function () {}); }, 11, 'define with non-string id throws exception');
		$$error(function () { api.define('def-b', true, function () {}); }, 13, 'define with non-array dependencies throws exception');
		$$error(function () { api.define('def-c', [], true); }, 14, 'define with non-function and non-object argument throws exception');

		$$.strictEqual(api.define('def-d', function () {}), undefined, 'define with no dependencies and function');
		$$.strictEqual(api.define('def-e', [], function () {}), undefined, 'define with dependencies and function');

		$$.strictEqual(api.define('def-f', {}), undefined, 'define with no dependencies and function');
		$$.strictEqual(api.define('def-g', [], {}), undefined, 'define with dependencies and function');

		$$error(function () { api.define('def-g', {}); }, 12, 'define with already defined id throws exception');

		$$.strictEqual(api.define('def-h', []), undefined, 'define with id and array handles array as object with no dependencies');
		$$.strictEqual(api.define('def-i', [], []), undefined, 'define with id and two arrays');
	});


	$$.test('require', 10, function () {

		var constructorCalls = 0,
			constructor = function () {

				constructorCalls += 1;
				return {
					test: 123
				};
			},
			testObjA = constructor(),
			testObjB = constructor();

		api.define('req-a', function () { return 'ret-a'; });
		api.define('req-b', ['req-a'], function () { return 'ret-b'; });
		api.define('req-c', ['req-d'], function () { return 'ret-c'; });
		api.define('req-d', ['req-c'], function () { return 'ret-d'; });
		api.define('req-e', constructor);

		$$error(function () { api.require(); }, 31, 'require with no id throws exception');
		$$error(function () { api.require(testObjA); }, 31, 'require with non-string id throws exception');
		$$error(function () { api.require('req-none'); }, 32, 'require of unknown id throws exception');
		$$error(function () { api.require('req-d'); }, 33, 'require with cyclic dependencies throws exception');

		$$.strictEqual(api.require('req-a'), 'ret-a', 'require with string argument returns constructed instance');
		$$.deepEqual(api.require(['req-a', 'req-b']), ['ret-a', 'ret-b'], 'require with array argument returns array of constructed instances');
		$$.deepEqual(api.require(/req-[abx]/), {'req-a': 'ret-a', 'req-b': 'ret-b'}, 'require with regexp argument returns hash: id -> constructed instance');

		constructorCalls = 0;
		api.require('req-e');
		var cc1 = constructorCalls;
		api.require('req-e');
		var cc2 = constructorCalls;
		$$.strictEqual(cc1 === 1 && cc2 === 1, true, 'constructor called exactly once per id');

		$$.notEqual(testObjA, testObjB, 'test objects are not equal');
		$$.strictEqual(api.require('req-e'), api.require('req-e'), 'require returns always the same instance per id');
	});


	$$.test('noConflict', 2, function () {

		var res = api.noConflict();

		$$.strictEqual(res, api, 'noConflict returns api instance');
		$$.strictEqual(global[name], previousReference, 'noConflict resets previous reference');

		// rereset api to keep it available in the console
		global[name] = api;
	});




	$$.module('use cases');


	$$.test('long dependency chain', 1, function () {

		api.define('mod-ldc-a', function () { return 'val-a'; });
		api.define('mod-ldc-b', ['mod-ldc-a'], function () { return 'val-b'; });
		api.define('mod-ldc-c', ['mod-ldc-b'], function () { return 'val-c'; });
		api.define('mod-ldc-d', ['mod-ldc-c'], function () { return 'val-d'; });
		api.define('mod-ldc-e', ['mod-ldc-d'], function () { return 'val-e'; });
		api.define('mod-ldc-f', ['mod-ldc-e'], function () { return 'val-f'; });
		api.define('mod-ldc-g', ['mod-ldc-f'], function () { return 'val-g'; });

		$$.strictEqual(api.require('mod-ldc-g'), 'val-g', 'long dependency chain');
	});


	$$.test('long dependency circle', 1, function () {

		api.define('mod-ldci-a', ['mod-ldci-g'], function () { return 'val-a'; });
		api.define('mod-ldci-b', ['mod-ldci-a'], function () { return 'val-b'; });
		api.define('mod-ldci-c', ['mod-ldci-b'], function () { return 'val-c'; });
		api.define('mod-ldci-d', ['mod-ldci-c'], function () { return 'val-d'; });
		api.define('mod-ldci-e', ['mod-ldci-d'], function () { return 'val-e'; });
		api.define('mod-ldci-f', ['mod-ldci-e'], function () { return 'val-f'; });
		api.define('mod-ldci-g', ['mod-ldci-f'], function () { return 'val-g'; });

		$$error(function () { api.require('mod-ldci-g'); }, 33, 'require with long chained dependency circle throws exception');
	});

}(this, _, '%BUILD_NAME%', QUnit));

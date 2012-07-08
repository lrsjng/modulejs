
// setup for noConflict test
var previousReference = {prev: 'reference'};
this['%BUILD_NAME%'] = previousReference;


// @include "inc/qunit-1.9.0pre.js"
// @include "inc/underscore-1.3.3.js"
// @include "../modulejs-debug-%BUILD_VERSION%.js"
// @include "../modulejs-%BUILD_VERSION%.js"


(function (global, _, name, $$) {
	'use strict';

	var api = global[name],
		debugName = name.toUpperCase(),
		debugApi = global[debugName];




	var $$error = function (fn, code, msg) {

		$$.raises(fn, function (e) {

			return _.isObject(e) && _.size(e) === 3 && e.code === code && _.isString(e.msg) && _.isFunction(e.toString);
		}, msg);
	};




	$$.module('global');


	$$.test(debugName, 8, function () {

		var ref = debugApi,
			refName = debugName;

		$$.strictEqual(_.isObject(debugApi), true, refName + ' is global object -> in debug mode');
		$$.strictEqual(_.size(debugApi), 6, refName + ' has right number of members');

		$$.strictEqual(_.isObject(ref.modulejs), true, refName + '.modulejs is object');

		$$.strictEqual(_.isFunction(ref.clear), true, refName + '.clear is function');
		$$.strictEqual(_.isFunction(ref.isDefined), true, refName + '.isDefined is function');
		$$.strictEqual(_.isFunction(ref.ids), true, refName + '.ids is function');
		$$.strictEqual(_.isFunction(ref.deps), true, refName + '.deps is function');
		$$.strictEqual(_.isFunction(ref.log), true, refName + '.log is function');
	});


	$$.test(name, 6, function () {

		var ref = api,
			refName = name;

		$$.strictEqual(_.isObject(api), true, name + ' is global object');
		$$.strictEqual(_.size(api), 3 + 1, name + ' has right number of members');

		$$.strictEqual(_.isFunction(api.define), true, name + '.define is function');
		$$.strictEqual(_.isFunction(api.predefined), true, name + '.predefined is function');
		$$.strictEqual(_.isFunction(api.require), true, name + '.require is function');

		$$.strictEqual(_.isFunction(api.noConflict), true, name + '.noConflict is function');
	});




	$$.module(debugName);


	$$.test('modulejs', 10, function () {

		var ref = debugApi.modulejs,
			refName = 'modulejs';

		$$.strictEqual(_.size(ref), 7, refName + ' has right number of members');

		$$.strictEqual(_.isObject(ref.definitions), true, refName + '.definitions is object');
		$$.strictEqual(_.size(ref.definitions), 0, refName + '.definitions starts empty');
		$$.strictEqual(_.isObject(ref.instances), true, refName + '.instances is object');
		$$.strictEqual(_.size(ref.instances), 0, refName + '.instances starts empty');

		$$.strictEqual(_.isFunction(ref.define), true, refName + '.define is function');
		$$.strictEqual(_.isFunction(ref.predefined), true, refName + '.predefined is function');
		$$.strictEqual(_.isFunction(ref._require), true, refName + '._require is function');
		$$.strictEqual(_.isFunction(ref.require), true, refName + '.require is function');

		$$.strictEqual(_.isFunction(ref.register), true, refName + '.register is function');
	});


	$$.test('isDefined', 6, function () {

		var ref = debugApi.isDefined,
			refName = 'isDefined';

		api.define('isdef-a', function () {});

		$$.strictEqual(ref(), false, refName + ' with no argument returns false');
		$$.strictEqual(ref(undefined), false, refName + ' with undefined argument returns false');
		$$.strictEqual(ref(null), false, refName + ' with null argument returns false');
		$$.strictEqual(ref({}), false, refName + ' with instance argument returns false');
		$$.strictEqual(ref('isdef-none'), false, refName + ' with undefined id returns false');
		$$.strictEqual(ref('isdef-a'), true, refName + ' with defined id returns true');
	});


	$$.test('log', 1, function () {

		var ref = debugApi.log,
			refName = 'log';

		$$.strictEqual(_.isString(ref()), true, refName + ' returns a String');
	});




	$$.module(name);


	$$.test('define', 9, function () {

		$$error(function () { api.define(); }, 11, 'define with no arguments throws exception');
		$$error(function () { api.define('def-a'); }, 13, 'define with no constructor argument throws exception');
		$$error(function () { api.define('def-b', []); }, 13, 'define with no constructor argument throws exception');
		$$error(function () { api.define(true, [], function () {}); }, 11, 'define with non-string id throws exception');
		$$error(function () { api.define('def-c', true, function () {}); }, 14, 'define with non-array dependencies throws exception');
		$$error(function () { api.define('def-d', [], true); }, 13, 'define with non-function constructor throws exception');

		$$.strictEqual(api.define('def-e', function () {}), undefined, 'define with no dependencies');
		$$error(function () { api.define('def-e', function () {}); }, 12, 'define with already defined id throws exception');

		$$.strictEqual(api.define('def-f', [], function () {}), undefined, 'define with dependencies');
	});


	$$.test('predefined', 10, function () {

		$$error(function () { api.predefined(); }, 21, 'predefined with no arguments throws exception');
		$$error(function () { api.predefined('predef-a'); }, 21, 'predefined with no instance argument throws exception');
		$$error(function () { api.predefined(true, {}); }, 11, 'predefined with non-string id throws exception');

		$$.strictEqual(api.predefined('predef-b', {}), undefined, 'predefined with no check');
		$$error(function () { api.predefined('predef-b', {}); }, 12, 'predefined with already defined id throws exception');
		$$error(function () { api.predefined('predef-c', undefined); }, 21, 'predefined with undefined instance argument throws exception');

		$$.strictEqual(api.predefined('predef-d', {}, true), undefined, 'predefined with true boolean check');
		$$error(function () { api.predefined('predef-e', {}, false); }, 21, 'predefined with false boolean check throws exception');

		$$.strictEqual(api.predefined('predef-f', {}, function () { return true; }), undefined, 'predefined with true functional check');
		$$error(function () { api.predefined('predef-g', {}, function () { return false; }); }, 21, 'predefined with false functional check throws exception');
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

		debugApi.clear();

		api.define('mod-a', function () { return 'val-a'; });
		api.define('mod-b', ['mod-a'], function () { return 'val-b'; });
		api.define('mod-c', ['mod-b'], function () { return 'val-c'; });
		api.define('mod-d', ['mod-c'], function () { return 'val-d'; });
		api.define('mod-e', ['mod-d'], function () { return 'val-e'; });
		api.define('mod-f', ['mod-e'], function () { return 'val-f'; });
		api.define('mod-g', ['mod-f'], function () { return 'val-g'; });

		$$.strictEqual(api.require('mod-g'), 'val-g', 'long dependency chain');
	});


	$$.test('long dependency circle', 1, function () {

		debugApi.clear();

		api.define('mod-a', ['mod-g'], function () { return 'val-a'; });
		api.define('mod-b', ['mod-a'], function () { return 'val-b'; });
		api.define('mod-c', ['mod-b'], function () { return 'val-c'; });
		api.define('mod-d', ['mod-c'], function () { return 'val-d'; });
		api.define('mod-e', ['mod-d'], function () { return 'val-e'; });
		api.define('mod-f', ['mod-e'], function () { return 'val-f'; });
		api.define('mod-g', ['mod-f'], function () { return 'val-g'; });

		$$error(function () { api.require('mod-g'); }, 33, 'require with long chained dependency circle throws exception');
	});

}(this, _, '%BUILD_NAME%', QUnit));

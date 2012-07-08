
(function (global, _, name, $$) {
	'use strict';

	var api = global[name],
		debugName = name.toUpperCase(),
		debugApi = global[debugName];

	if (!debugApi) {
		return;
	}




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




	$$.module(debugName);


	$$.test('modulejs', 8, function () {

		var ref = debugApi.modulejs,
			refName = 'modulejs';

		$$.strictEqual(_.size(ref), 7, refName + ' has right number of members');

		$$.strictEqual(_.isObject(ref.definitions), true, refName + '.definitions is object');
		$$.strictEqual(_.isObject(ref.instances), true, refName + '.instances is object');

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

}(this, _, '%BUILD_NAME%', QUnit));

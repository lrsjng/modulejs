/*! modulejs-debug %BUILD_VERSION% - //larsjung.de/modulejs - MIT License */

(function (global, name) {
	'use strict';


		// throws error
	var	err = function (condition, code, message) {

			if (condition) {
				throw {
					code: code,
					msg: message,
					toString: function () {
						return name + ' error ' + code + ': ' + message;
					}
				};
			}
		},
		isType = function (arg, type) {

			return Object.prototype.toString.call(arg) === '[object ' + type + ']';
		},
		isString = function (arg) {

			return isType(arg, 'String');
		},
		isFunction = function (arg) {

			return isType(arg, 'Function');
		},
		isRegExp = function (arg) {

			return isType(arg, 'RegExp');
		},
		isArray = Array.isArray || function (arg) {

			return isType(arg, 'Array');
		},
		isObject = function (arg) {

			return arg === new Object(arg);
		},
		has = function (arg, id) {

			return Object.prototype.hasOwnProperty.call(arg, id);
		},
		contains = function (array, item) {

			for (var i = 0, l = array.length; i < l; i += 1) {
				if (array[i] === item) {
					return true;
				}
			}
			return false;
		},
		uniq = function (array) {

			var elements = {},
				result = [];

			for (var i = 0, l = array.length; i < l; i += 1) {
				var el = array[i];
				if (!has(elements, el)) {
					result.push(el);
					elements[el] = 1;
				}
			}

			return result;
		},
		each = function (obj, iterator, context) {

			if (!obj) {
				return;
			}
			if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i += 1) {
					iterator.call(context, obj[i], i, obj);
				}
			} else {
				for (var key in obj) {
					if (has(obj, key)) {
						iterator.call(context, obj[key], key, obj);
					}
				}
			}
		};



	// Debug
	// =====
	var Debug = function (modulejs) {


		var self = modulejs;


		self.clear = function () {

			self.definitions = {};
			self.instances = {};
		};


		self.isDefined = function (id) {

			return isString(id) && !!self.definitions[id];
		};


		self.ids = function (regexp) {

			var ids = [];

			for (var id in self.definitions) {
				if (has(self.definitions, id) && (!isRegExp(regexp) || regexp.test(id))) {
					id.push(id);
				}
			}

			return ids;
		};


		var _deps = function (id, stack) {

			var deps = [];

			var def = self.definitions[id];
			if (def) {
				stack = (stack || []).slice(0);
				stack.push(id);
				each(def.deps, function (depId) {

					if (contains(stack, depId)) {
						deps = deps.concat([false, def.id]);
						return deps;
					}

					deps = deps.concat(_deps(depId, stack));
					deps.push(depId);
				});
			}

			return uniq(deps);
		};


		self.deps = function (ids) {

			if (isString(ids)) {

				return _deps(ids);
			} else if (isArray(ids)) {

				var deps = [];
				each(ids, function (id) {

					deps = deps.concat(_deps(id));
				});
				return uniq(deps);
			}

			var res = {};
			each(self.definitions, function (def, id) {

				res[id] = _deps(id);
			});
			return res;
		};


		self.log = function (showInvDeps) {

			var allDeps = self.deps(),
				allInvDeps = {},
				out = '\n';

			if (!showInvDeps) {
				each(allDeps, function (deps, id) {

					out += (has(self.instances, id) ? '* ' : '  ') + id + ' -> [ ' + deps.join(', ') + ' ]\n';
				});
			} else {
				each(self.definitions, function (def) {

					var invDeps = [];
					each(allDeps, function (depIds, id) {

						if (contains(depIds, def.id)) {
							invDeps.push(id);
						}
					});
					allInvDeps[def.id] = invDeps;
				});

				each(allInvDeps, function (invDeps, id) {

					out += (has(self.instances, id) ? '* ' : '  ') + id + ' <- [ ' + invDeps.join(', ') + ' ]\n';
				});
			}

			return out;
		};


		return self;
	};


	global[(name + '_DEBUG').toUpperCase()] = Debug;


}(this, 'modulejs'));

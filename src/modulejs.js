/*! modulejs %BUILD_VERSION% - //larsjung.de/modulejs - MIT License */

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
		contains = function(array, item) {

			for (var i = 0, l = array.length; i < l; i += 1) {
				if (array[i] === item) {
					return true;
				}
			}
			return false;
		};


	// ModuleJs
	// ========
	var ModuleJs = function () {

		var self = this;

		// module definitions
		self.definitions = {};

		// module instances
		self.instances = {};

		// define
		// ------
		// Defines a module.
		self.define = function (id, deps, arg) {

			// sort arguments
			if (arg === undefined) {
				arg = deps;
				deps = [];
			}
			// check arguments
			err(!isString(id), 11, 'id must be a string "' + id + '"');
			err(self.definitions[id], 12, 'id already defined "' + id + '"');
			err(!isArray(deps), 13, 'dependencies for "' + id + '" must be an array "' + deps + '"');
			err(!isObject(arg) && !isFunction(arg), 14, 'arg for "' + id + '" must be object or function "' + arg + '"');

			// map definition
			self.definitions[id] = {
				id: id,
				deps: deps,
				fn: isFunction(arg) ? arg : function () { return arg; }
			};
		};

		// Returns an instance for `id`, checked against require-`stack` for
		// cyclic dependencies.
		self._require = function (id, stack) {

			err(!isString(id), 31, 'id must be a string "' + id + '"');

			if (has(self.instances, id)) {
				return self.instances[id];
			}

			var def = self.definitions[id];
			err(!def, 32, 'id not defined "' + id + '"');

			stack = (stack || []).slice(0);
			stack.push(id);

			var deps = [];
			for (var idx in def.deps) {
				if (has(def.deps, idx)) {
					var depId = def.deps[idx];
					err(contains(stack, depId), 33, 'cyclic dependencies: ' + stack + ' & ' + depId);
					deps[idx] = self._require(depId, stack);
				}
			}

			var obj = def.fn.apply(global, deps);
			self.instances[id] = obj;
			return obj;
		};

		// require
		// -------
		// Returns an instance for `id`.
		self.require = function (arg) {

			var res;

			if (isArray(arg)) {

				res = [];
				for (var idx in arg) {
					if (has(arg, idx)) {
						res[idx] = self._require(arg[idx]);
					}
				}
				return res;
			}

			if (isRegExp(arg)) {

				res = {};
				for (var id in self.definitions) {
					if (has(self.definitions, id) && arg.test(id)) {
						res[id] = self._require(id);
					}
				}
				return res;
			}

			return self._require(arg);
		};
	};


	var modulejs = new ModuleJs();

	// public api
	// ----------
	global[name] = {
		define: modulejs.define,
		require: modulejs.require
	};

	// debug api
	// ---------
	var debug = global[(name + '_DEBUG').toUpperCase()];
	if (isFunction(debug)) {
		global[name] = debug(modulejs);
	}


}(this, 'modulejs'));

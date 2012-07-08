/*! %BUILD_NAME% %BUILD_VERSION% - //larsjung.de/qrcode - MIT License */

(function (global, _, name) {
	'use strict';


	// throws error
	var	err = function (condition, code, message) {

		if (condition) {
			throw {
				code: code,
				msg: message,
				toString: function () {
					return name + ' error: ' + message;
				}
			};
		}
	};

	// make sure underscore is loaded
	err(!_, 1, name + ' requires underscore');


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
			err(!_.isString(id), 11, 'id must be a string "' + id + '"');
			err(self.definitions[id], 12, 'id already defined "' + id + '"');
			err(!_.isArray(deps), 13, 'dependencies for "' + id + '" must be an array "' + deps + '"');
			err(!_.isObject(arg) && !_.isFunction(arg), 14, 'arg for "' + id + '" must be object or function "' + arg + '"');

			// map definition
			self.definitions[id] = {
				id: id,
				deps: deps,
				fn: _.isFunction(arg) ? arg : function () { return arg; }
			};
		};

		// Returns an instance for `id`, checked against require-`stack` for
		// cyclic dependencies.
		self._require = function (id, stack) {

			err(!_.isString(id), 31, 'id must be a string "' + id + '"');

			if (_.has(self.instances, id)) {
				return self.instances[id];
			}

			var def = self.definitions[id];
			err(!def, 32, 'id not defined "' + id + '"');

			stack = (stack || []).slice(0);
			stack.push(id);
			var deps = _.map(def.deps, function (depId) {

				err(_.indexOf(stack, depId) >= 0, 33, 'cyclic dependencies: ' + stack + ' & ' + depId);

				return self._require(depId, stack);
			});

			var obj = def.fn.apply(global, deps);
			self.instances[id] = obj;
			return obj;
		};

		// require
		// -------
		// Returns an instance for `id`.
		self.require = function (arg) {

			if (_.isArray(arg)) {

				return _.map(arg, function (id) {

					return self._require(id);
				});
			}

			if (_.isRegExp(arg)) {

				var res = {};
				_.each(_.keys(self.definitions), function (id) {

					if (arg.test(id)) {
						res[id] = self._require(id);
					}
				});
				return res;
			}

			return self._require(arg);
		};

		// Registers public API on the global object.
		self.register = function (name) {

			var	previous = global[name],
				api = {
					define: self.define,
					require: self.require,
					noConflict: function () {

						if (global[name] === api) {
							global[name] = previous;
						}
						return api;
					}
				};

			global[name] = api;
		};
	};


	var modulejs = new ModuleJs();
	modulejs.register(name);


	// debugger
	// --------
	var debugName = name.toUpperCase();
	if (_.isFunction(global[debugName])) {
		global[debugName] = new global[debugName](modulejs);
	}

}(this, _, '%BUILD_NAME%'));

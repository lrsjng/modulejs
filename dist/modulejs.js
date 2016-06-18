/*! modulejs v1.15.0 - https://larsjung.de/modulejs/ */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["modulejs"] = factory();
	else
		root["modulejs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var OBJ_PROTO = Object.prototype;

	// Returns a function that returns `true` if `x` is of the correct
	// `type`, otherwise `false`.
	var _create_is_x_fn = function _create_is_x_fn(type) {
	    return function (x) {
	        return OBJ_PROTO.toString.call(x) === '[object ' + type + ']';
	    };
	};

	// Type checking functions.
	var isArray = _create_is_x_fn('Array');
	var isFunction = _create_is_x_fn('Function');
	var isString = _create_is_x_fn('String');

	// Short cut for `hasOwnProperty`.
	var has = function has(x, id) {
	    return x !== undefined && x !== null && OBJ_PROTO.hasOwnProperty.call(x, id);
	};

	// Iterates over all elements af an array or all own keys of an object.
	var each = function each(x, fn) {
	    if (x && x.length) {
	        for (var i = 0, l = x.length; i < l; i += 1) {
	            fn(x[i], i, x);
	        }
	    } else {
	        for (var k in x) {
	            if (has(x, k)) {
	                fn(x[k], k, x);
	            }
	        }
	    }
	};

	// Returns `true` if `x` contains `val`, otherwise `false`.
	var contains = function contains(x, val) {
	    if (x && x.length) {
	        for (var i = 0, l = x.length; i < l; i += 1) {
	            if (x[i] === val) {
	                return true;
	            }
	        }
	    }
	    return false;
	};

	// Returns an new array containing no duplicates. Preserves first
	// occurence and order.
	var uniq = function uniq(x) {
	    var result = [];
	    each(x, function (val) {
	        if (!contains(result, val)) {
	            result.push(val);
	        }
	    });
	    return result;
	};

	// Throws an error if `expression` is falsy.
	var assert = function assert(expression, message) {
	    if (!expression) {
	        throw new Error('[modulejs] ' + message);
	    }
	};

	var create = function create() {
	    // Module definitions.
	    var definitions = {};

	    // Module instances.
	    var instances = {};

	    // Resolves `id` to an object. If `mixed` is `true` only returns
	    // dependency-IDs. If `mixed` is an object it is used instead of the
	    // already memorized `instances` to allow mock-dependencies. `stack`
	    // is used internal to check for circular dependencies.
	    var resolve = function resolve(id, mixed, stack) {
	        // check arguments
	        assert(isString(id), 'id must be string: ' + id);
	        var onlyDepIds = mixed === true;
	        var resolvedInstances = (onlyDepIds ? undefined : mixed) || instances;

	        // if a module is required that was already created return that
	        // object
	        if (!onlyDepIds && has(resolvedInstances, id)) {
	            return resolvedInstances[id];
	        }

	        // check if `id` is defined
	        var def = definitions[id];
	        assert(def, 'id not defined: ' + id);

	        // copy resolve stack and add this `id`
	        stack = (stack || []).slice();
	        stack.push(id);

	        // if `onlyDepIds` this will hold the dependency-IDs, otherwise it
	        // will hold the dependency-objects
	        var deps = [];

	        each(def.deps, function (depId) {
	            // check for circular dependencies
	            assert(!contains(stack, depId), 'circular dependencies: ' + depId + ' in ' + stack);

	            if (onlyDepIds) {
	                deps = deps.concat(resolve(depId, mixed, stack));
	                deps.push(depId);
	            } else {
	                deps.push(resolve(depId, mixed, stack));
	            }
	        });

	        // if `onlyDepIds` return only dependency-ids in right order
	        if (onlyDepIds) {
	            return uniq(deps);
	        }

	        // create, memorize and return object
	        // const obj = def.fn(...deps);
	        var obj = def.fn.apply(undefined, deps);
	        resolvedInstances[id] = obj;
	        return obj;
	    };

	    // Defines a module for `id: String`, optional `deps: Array[String]`,
	    // `def: mixed`.
	    var define = function define(id, deps, def) {
	        // sort arguments
	        if (def === undefined) {
	            var _ref = [[], deps];
	            deps = _ref[0];
	            def = _ref[1];
	        }
	        // check arguments
	        assert(isString(id), 'id must be string: ' + id);
	        assert(!has(definitions, id), 'id already defined: ' + id);
	        assert(isArray(deps), 'deps must be array: ' + id);

	        // accept definition
	        definitions[id] = {
	            id: id,
	            deps: deps,
	            fn: isFunction(def) ? def : function () {
	                return def;
	            }
	        };
	    };

	    // Returns an instance for `id`. If a `mocks` object is given, it is
	    // used to resolve the dependencies.
	    var require = function require(id, mocks) {
	        return resolve(id, mocks);
	    };

	    // Returns an object that holds infos about the current definitions
	    // and dependencies.
	    var state = function state() {
	        var res = {};

	        each(definitions, function (def, id) {
	            res[id] = {

	                // direct dependencies
	                deps: def.deps.slice(),

	                // transitive dependencies
	                reqs: resolve(id, true),

	                // already initiated/required
	                init: has(instances, id)
	            };
	        });

	        each(definitions, function (def, id) {
	            var inv = [];

	            each(definitions, function (def2, id2) {
	                if (contains(res[id2].reqs, id)) {
	                    inv.push(id2);
	                }
	            });

	            // all inverse dependencies
	            res[id].reqd = inv;
	        });

	        return res;
	    };

	    // Returns a string that displays module dependencies.
	    var log = function log(inv) {
	        var out = '\n';

	        each(state(), function (st, id) {
	            var list = inv ? st.reqd : st.reqs;
	            out += (st.init ? '* ' : '  ') + id + ' -> [ ' + list.join(', ') + ' ]\n';
	        });

	        return out;
	    };

	    return {
	        create: create,
	        define: define,
	        log: log,
	        require: require,
	        state: state,
	        _private: {
	            assert: assert,
	            contains: contains,
	            definitions: definitions,
	            each: each,
	            has: has,
	            instances: instances,
	            isArray: isArray,
	            isFunction: isFunction,
	            isString: isString,
	            resolve: resolve,
	            uniq: uniq
	        }
	    };
	};

	module.exports = create();

/***/ }
/******/ ])
});
;
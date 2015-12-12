/*! modulejs v1.10.0 - https://larsjung.de/modulejs/ */
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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var OBJ_PROTO = Object.prototype;
	
	// Returns a function that returns `true` if `x` is of the correct
	// `type`, otherwise `false`.
	var _create_is_x_fn = function _create_is_x_fn(type) {
	    return function (x) {
	        return OBJ_PROTO.toString.call(x) === '[object ' + type + ']';
	    }; // eslint-disable-line prefer-reflect
	};
	
	// Type checking functions.
	var isArray = _create_is_x_fn('Array');
	var isFunction = _create_is_x_fn('Function');
	var isString = _create_is_x_fn('String');
	
	// Short cut for `hasOwnProperty`.
	var has = function has(x, id) {
	    return x !== undefined && x !== null && OBJ_PROTO.hasOwnProperty.call(x, id); // eslint-disable-line prefer-reflect
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
	        var obj = def.fn.apply(def, _toConsumableArray(deps));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyZDk0OTVhNDM0NTI3ZjI3MzY1NSIsIndlYnBhY2s6Ly8vLi9fX1RNUF9XRUJQQUNLX0lOX19tb2R1bGVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdENBLEtBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTOzs7O0FBSWxDLEtBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBRyxJQUFJLEVBQUk7QUFDNUIsWUFBTyxXQUFDO2dCQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsR0FBRyxJQUFJLEdBQUcsR0FBRztNQUFBO0FBQUMsRUFDdEU7OztBQUdELEtBQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QyxLQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDL0MsS0FBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQzs7O0FBRzFDLEtBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLENBQUMsRUFBRSxFQUFFLEVBQUs7QUFDbkIsWUFBTyxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVB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LEVBQUosSUFBSTtVQUNQO01BQ0osQ0FBQztFQUNMLENBQUM7O0FBRUYsT0FBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsQyIsImZpbGUiOiJfX1RNUF9XRUJQQUNLX09VVF9fbW9kdWxlanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJtb2R1bGVqc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJtb2R1bGVqc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMmQ5NDk1YTQzNDUyN2YyNzM2NTVcbiAqKi8iLCJjb25zdCBPQkpfUFJPVE8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB0cnVlYCBpZiBgeGAgaXMgb2YgdGhlIGNvcnJlY3Rcbi8vIGB0eXBlYCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG5jb25zdCBfY3JlYXRlX2lzX3hfZm4gPSB0eXBlID0+IHtcbiAgICByZXR1cm4geCA9PiBPQkpfUFJPVE8udG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgJyArIHR5cGUgKyAnXSc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXJlZmxlY3Rcbn07XG5cbi8vIFR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zLlxuY29uc3QgaXNBcnJheSA9IF9jcmVhdGVfaXNfeF9mbignQXJyYXknKTtcbmNvbnN0IGlzRnVuY3Rpb24gPSBfY3JlYXRlX2lzX3hfZm4oJ0Z1bmN0aW9uJyk7XG5jb25zdCBpc1N0cmluZyA9IF9jcmVhdGVfaXNfeF9mbignU3RyaW5nJyk7XG5cbi8vIFNob3J0IGN1dCBmb3IgYGhhc093blByb3BlcnR5YC5cbmNvbnN0IGhhcyA9ICh4LCBpZCkgPT4ge1xuICAgIHJldHVybiB4ICE9PSB1bmRlZmluZWQgJiYgeCAhPT0gbnVsbCAmJiBPQkpfUFJPVE8uaGFzT3duUHJvcGVydHkuY2FsbCh4LCBpZCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgcHJlZmVyLXJlZmxlY3Rcbn07XG5cbi8vIEl0ZXJhdGVzIG92ZXIgYWxsIGVsZW1lbnRzIGFmIGFuIGFycmF5IG9yIGFsbCBvd24ga2V5cyBvZiBhbiBvYmplY3QuXG5jb25zdCBlYWNoID0gKHgsIGZuKSA9PiB7XG4gICAgaWYgKHggJiYgeC5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB4Lmxlbmd0aDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICAgICAgZm4oeFtpXSwgaSwgeCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4geCkge1xuICAgICAgICAgICAgaWYgKGhhcyh4LCBrKSkge1xuICAgICAgICAgICAgICAgIGZuKHhba10sIGssIHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgYHhgIGNvbnRhaW5zIGB2YWxgLCBvdGhlcndpc2UgYGZhbHNlYC5cbmNvbnN0IGNvbnRhaW5zID0gKHgsIHZhbCkgPT4ge1xuICAgIGlmICh4ICYmIHgubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0geC5sZW5ndGg7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmICh4W2ldID09PSB2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBSZXR1cm5zIGFuIG5ldyBhcnJheSBjb250YWluaW5nIG5vIGR1cGxpY2F0ZXMuIFByZXNlcnZlcyBmaXJzdFxuLy8gb2NjdXJlbmNlIGFuZCBvcmRlci5cbmNvbnN0IHVuaXEgPSB4ID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBlYWNoKHgsIHZhbCA9PiB7XG4gICAgICAgIGlmICghY29udGFpbnMocmVzdWx0LCB2YWwpKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFRocm93cyBhbiBlcnJvciBpZiBgZXhwcmVzc2lvbmAgaXMgZmFsc3kuXG5jb25zdCBhc3NlcnQgPSAoZXhwcmVzc2lvbiwgbWVzc2FnZSkgPT4ge1xuICAgIGlmICghZXhwcmVzc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ttb2R1bGVqc10gJyArIG1lc3NhZ2UpO1xuICAgIH1cbn07XG5cbmNvbnN0IGNyZWF0ZSA9ICgpID0+IHtcbiAgICAvLyBNb2R1bGUgZGVmaW5pdGlvbnMuXG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSB7fTtcblxuICAgIC8vIE1vZHVsZSBpbnN0YW5jZXMuXG4gICAgY29uc3QgaW5zdGFuY2VzID0ge307XG5cbiAgICAvLyBSZXNvbHZlcyBgaWRgIHRvIGFuIG9iamVjdC4gSWYgYG1peGVkYCBpcyBgdHJ1ZWAgb25seSByZXR1cm5zXG4gICAgLy8gZGVwZW5kZW5jeS1JRHMuIElmIGBtaXhlZGAgaXMgYW4gb2JqZWN0IGl0IGlzIHVzZWQgaW5zdGVhZCBvZiB0aGVcbiAgICAvLyBhbHJlYWR5IG1lbW9yaXplZCBgaW5zdGFuY2VzYCB0byBhbGxvdyBtb2NrLWRlcGVuZGVuY2llcy4gYHN0YWNrYFxuICAgIC8vIGlzIHVzZWQgaW50ZXJuYWwgdG8gY2hlY2sgZm9yIGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAgICBjb25zdCByZXNvbHZlID0gKGlkLCBtaXhlZCwgc3RhY2spID0+IHtcbiAgICAgICAgLy8gY2hlY2sgYXJndW1lbnRzXG4gICAgICAgIGFzc2VydChpc1N0cmluZyhpZCksICdpZCBtdXN0IGJlIHN0cmluZzogJyArIGlkKTtcbiAgICAgICAgY29uc3Qgb25seURlcElkcyA9IG1peGVkID09PSB0cnVlO1xuICAgICAgICBjb25zdCByZXNvbHZlZEluc3RhbmNlcyA9IChvbmx5RGVwSWRzID8gdW5kZWZpbmVkIDogbWl4ZWQpIHx8IGluc3RhbmNlcztcblxuICAgICAgICAvLyBpZiBhIG1vZHVsZSBpcyByZXF1aXJlZCB0aGF0IHdhcyBhbHJlYWR5IGNyZWF0ZWQgcmV0dXJuIHRoYXRcbiAgICAgICAgLy8gb2JqZWN0XG4gICAgICAgIGlmICghb25seURlcElkcyAmJiBoYXMocmVzb2x2ZWRJbnN0YW5jZXMsIGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkSW5zdGFuY2VzW2lkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGlmIGBpZGAgaXMgZGVmaW5lZFxuICAgICAgICBjb25zdCBkZWYgPSBkZWZpbml0aW9uc1tpZF07XG4gICAgICAgIGFzc2VydChkZWYsICdpZCBub3QgZGVmaW5lZDogJyArIGlkKTtcblxuICAgICAgICAvLyBjb3B5IHJlc29sdmUgc3RhY2sgYW5kIGFkZCB0aGlzIGBpZGBcbiAgICAgICAgc3RhY2sgPSAoc3RhY2sgfHwgW10pLnNsaWNlKCk7XG4gICAgICAgIHN0YWNrLnB1c2goaWQpO1xuXG4gICAgICAgIC8vIGlmIGBvbmx5RGVwSWRzYCB0aGlzIHdpbGwgaG9sZCB0aGUgZGVwZW5kZW5jeS1JRHMsIG90aGVyd2lzZSBpdFxuICAgICAgICAvLyB3aWxsIGhvbGQgdGhlIGRlcGVuZGVuY3ktb2JqZWN0c1xuICAgICAgICBsZXQgZGVwcyA9IFtdO1xuXG4gICAgICAgIGVhY2goZGVmLmRlcHMsIGRlcElkID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGZvciBjaXJjdWxhciBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIGFzc2VydCghY29udGFpbnMoc3RhY2ssIGRlcElkKSwgJ2NpcmN1bGFyIGRlcGVuZGVuY2llczogJyArIGRlcElkICsgJyBpbiAnICsgc3RhY2spO1xuXG4gICAgICAgICAgICBpZiAob25seURlcElkcykge1xuICAgICAgICAgICAgICAgIGRlcHMgPSBkZXBzLmNvbmNhdChyZXNvbHZlKGRlcElkLCBtaXhlZCwgc3RhY2spKTtcbiAgICAgICAgICAgICAgICBkZXBzLnB1c2goZGVwSWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBzLnB1c2gocmVzb2x2ZShkZXBJZCwgbWl4ZWQsIHN0YWNrKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIGBvbmx5RGVwSWRzYCByZXR1cm4gb25seSBkZXBlbmRlbmN5LWlkcyBpbiByaWdodCBvcmRlclxuICAgICAgICBpZiAob25seURlcElkcykge1xuICAgICAgICAgICAgcmV0dXJuIHVuaXEoZGVwcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjcmVhdGUsIG1lbW9yaXplIGFuZCByZXR1cm4gb2JqZWN0XG4gICAgICAgIGNvbnN0IG9iaiA9IGRlZi5mbiguLi5kZXBzKTtcbiAgICAgICAgcmVzb2x2ZWRJbnN0YW5jZXNbaWRdID0gb2JqO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICAvLyBEZWZpbmVzIGEgbW9kdWxlIGZvciBgaWQ6IFN0cmluZ2AsIG9wdGlvbmFsIGBkZXBzOiBBcnJheVtTdHJpbmddYCxcbiAgICAvLyBgZGVmOiBtaXhlZGAuXG4gICAgY29uc3QgZGVmaW5lID0gKGlkLCBkZXBzLCBkZWYpID0+IHtcbiAgICAgICAgLy8gc29ydCBhcmd1bWVudHNcbiAgICAgICAgaWYgKGRlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBbZGVwcywgZGVmXSA9IFtbXSwgZGVwc107XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgYXJndW1lbnRzXG4gICAgICAgIGFzc2VydChpc1N0cmluZyhpZCksICdpZCBtdXN0IGJlIHN0cmluZzogJyArIGlkKTtcbiAgICAgICAgYXNzZXJ0KCFoYXMoZGVmaW5pdGlvbnMsIGlkKSwgJ2lkIGFscmVhZHkgZGVmaW5lZDogJyArIGlkKTtcbiAgICAgICAgYXNzZXJ0KGlzQXJyYXkoZGVwcyksICdkZXBzIG11c3QgYmUgYXJyYXk6ICcgKyBpZCk7XG5cbiAgICAgICAgLy8gYWNjZXB0IGRlZmluaXRpb25cbiAgICAgICAgZGVmaW5pdGlvbnNbaWRdID0ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBkZXBzLFxuICAgICAgICAgICAgZm46IGlzRnVuY3Rpb24oZGVmKSA/IGRlZiA6ICgpID0+IGRlZlxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIGFuIGluc3RhbmNlIGZvciBgaWRgLiBJZiBhIGBtb2Nrc2Agb2JqZWN0IGlzIGdpdmVuLCBpdCBpc1xuICAgIC8vIHVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVwZW5kZW5jaWVzLlxuICAgIGNvbnN0IHJlcXVpcmUgPSAoaWQsIG1vY2tzKSA9PiByZXNvbHZlKGlkLCBtb2Nrcyk7XG5cbiAgICAvLyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGhvbGRzIGluZm9zIGFib3V0IHRoZSBjdXJyZW50IGRlZmluaXRpb25zXG4gICAgLy8gYW5kIGRlcGVuZGVuY2llcy5cbiAgICBjb25zdCBzdGF0ZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0ge307XG5cbiAgICAgICAgZWFjaChkZWZpbml0aW9ucywgKGRlZiwgaWQpID0+IHtcbiAgICAgICAgICAgIHJlc1tpZF0gPSB7XG5cbiAgICAgICAgICAgICAgICAvLyBkaXJlY3QgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgZGVwczogZGVmLmRlcHMuc2xpY2UoKSxcblxuICAgICAgICAgICAgICAgIC8vIHRyYW5zaXRpdmUgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgcmVxczogcmVzb2x2ZShpZCwgdHJ1ZSksXG5cbiAgICAgICAgICAgICAgICAvLyBhbHJlYWR5IGluaXRpYXRlZC9yZXF1aXJlZFxuICAgICAgICAgICAgICAgIGluaXQ6IGhhcyhpbnN0YW5jZXMsIGlkKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWFjaChkZWZpbml0aW9ucywgKGRlZiwgaWQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGludiA9IFtdO1xuXG4gICAgICAgICAgICBlYWNoKGRlZmluaXRpb25zLCAoZGVmMiwgaWQyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKHJlc1tpZDJdLnJlcXMsIGlkKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnYucHVzaChpZDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhbGwgaW52ZXJzZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIHJlc1tpZF0ucmVxZCA9IGludjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGRpc3BsYXlzIG1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gICAgY29uc3QgbG9nID0gaW52ID0+IHtcbiAgICAgICAgbGV0IG91dCA9ICdcXG4nO1xuXG4gICAgICAgIGVhY2goc3RhdGUoKSwgKHN0LCBpZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlzdCA9IGludiA/IHN0LnJlcWQgOiBzdC5yZXFzO1xuICAgICAgICAgICAgb3V0ICs9IChzdC5pbml0ID8gJyogJyA6ICcgICcpICsgaWQgKyAnIC0+IFsgJyArIGxpc3Quam9pbignLCAnKSArICcgXVxcbic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgZGVmaW5lLFxuICAgICAgICBsb2csXG4gICAgICAgIHJlcXVpcmUsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBfcHJpdmF0ZToge1xuICAgICAgICAgICAgYXNzZXJ0LFxuICAgICAgICAgICAgY29udGFpbnMsXG4gICAgICAgICAgICBkZWZpbml0aW9ucyxcbiAgICAgICAgICAgIGVhY2gsXG4gICAgICAgICAgICBoYXMsXG4gICAgICAgICAgICBpbnN0YW5jZXMsXG4gICAgICAgICAgICBpc0FycmF5LFxuICAgICAgICAgICAgaXNGdW5jdGlvbixcbiAgICAgICAgICAgIGlzU3RyaW5nLFxuICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgIHVuaXFcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSgpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9fX1RNUF9XRUJQQUNLX0lOX19tb2R1bGVqcy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=
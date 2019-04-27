/*! modulejs v2.7.0 - https://larsjung.de/modulejs/ */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("modulejs", [], factory);
	else if(typeof exports === 'object')
		exports["modulejs"] = factory();
	else
		root["modulejs"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(1),
    assert = _require.assert,
    forOwn = _require.forOwn,
    has = _require.has,
    resolve = _require.resolve;

var create = function create() {
  // Module definitions.
  var definitions = {}; // Module instances.

  var instances = {}; // Defines a module for `id: String`, optional `deps: Array[String]`,
  // `def: mixed`.

  var define = function define(id, deps, def) {
    // sort arguments
    if (def === undefined) {
      var _ref = [[], deps];
      deps = _ref[0];
      def = _ref[1];
    } // check arguments


    assert(typeof id === 'string', "id must be string: ".concat(id));
    assert(!has(definitions, id), "id already defined: ".concat(id));
    assert(Array.isArray(deps), "deps must be array: ".concat(id)); // accept definition

    definitions[id] = {
      id: id,
      deps: deps,
      fn: typeof def === 'function' ? def : function () {
        return def;
      }
    };
  }; // Returns an instance for `id`. If a `mocks` object is given, it is
  // used to resolve the dependencies.


  var require = function require(id, mocks) {
    assert(typeof id === 'string', "id must be string: ".concat(id));
    return resolve(definitions, mocks || instances, id);
  }; // Returns an object that holds infos about the current definitions
  // and dependencies.


  var state = function state() {
    var res = {};
    forOwn(definitions, function (def, id) {
      res[id] = {
        // direct dependencies
        deps: def.deps.slice(),
        // transitive dependencies
        reqs: resolve(definitions, null, id),
        // already initiated/required
        init: has(instances, id)
      };
    });
    forOwn(definitions, function (def, id) {
      var inv = [];
      forOwn(definitions, function (def2, id2) {
        if (res[id2].reqs.indexOf(id) >= 0) {
          inv.push(id2);
        }
      }); // all inverse dependencies

      res[id].reqd = inv;
    });
    return res;
  }; // Returns a string that displays module dependencies.


  var log = function log(inv) {
    var out = '\n';
    forOwn(state(), function (st, id) {
      var list = inv ? st.reqd : st.reqs;
      out += "".concat(st.init ? '*' : ' ', " ").concat(id, " -> [ ").concat(list.join(', '), " ]\n");
    });
    return out;
  };

  return {
    create: create,
    define: define,
    log: log,
    require: require,
    state: state,
    _d: definitions,
    _i: instances
  };
};

module.exports = create();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Throws an error if `expr` is falsy.
var assert = function assert(expr, msg) {
  if (!expr) {
    throw new Error("[modulejs] ".concat(msg));
  }
}; // Iterates over all own props of an object.


var forOwn = function forOwn(x, fn) {
  Object.keys(x).forEach(function (k) {
    return fn(x[k], k);
  });
}; // Short cut for `hasOwnProperty`.


var has = function has(x, id) {
  return (x || {}).hasOwnProperty(id);
}; // Returns an new array containing no duplicates. Preserves first occurence and
// order.


var uniq = function uniq(x) {
  var cache = {};
  return x.filter(function (val) {
    var res = !cache[val];
    cache[val] = 1;
    return res;
  });
}; // Resolves `id` to an object for the given definitions `defs` and already
// instantiated objects `insts`. Adds any new instances to `insts`. If `insts`
// is null it only resolves dependency IDs.
// `stack` is used internal to check for circular dependencies.


var resolve = function resolve(defs, insts, id, stack) {
  var onlyDepIds = !insts; // if a module is required that was already created return that object

  if (!onlyDepIds && has(insts, id)) {
    return insts[id];
  } // check if `id` is defined


  var def = defs[id];
  assert(def, "id not defined: ".concat(id)); // copy resolve stack and add this `id`

  stack = (stack || []).slice();
  stack.push(id); // if `onlyDepIds` this will hold the dependency-IDs, otherwise it
  // will hold the dependency-objects

  var deps = [];
  def.deps.forEach(function (depId) {
    // check for circular dependencies
    assert(stack.indexOf(depId) < 0, "circular dependencies: ".concat(depId, " in ").concat(stack));
    var depDeps = resolve(defs, insts, depId, stack);

    if (onlyDepIds) {
      deps = deps.concat(depDeps);
      deps.push(depId);
    } else {
      deps.push(depDeps);
    }
  });

  if (onlyDepIds) {
    // return only dependency-ids in correct order
    return uniq(deps);
  } // create, memorize and return object
  // using def.fn(...deps) instead would cost ~120B uglified


  var obj = def.fn.apply(undefined, deps);
  insts[id] = obj;
  return obj;
};

module.exports = {
  assert: assert,
  forOwn: forOwn,
  has: has,
  resolve: resolve,
  uniq: uniq
};

/***/ })
/******/ ]);
});
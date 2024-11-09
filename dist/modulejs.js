/*! modulejs v2.10.0 - undefined */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("modulejs", [], factory);
	else if(typeof exports === 'object')
		exports["modulejs"] = factory();
	else
		root["modulejs"] = factory();
})((typeof self !== 'undefined' ? self : this), () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _require = __webpack_require__(1),
  assert = _require.assert,
  for_own = _require.for_own,
  has = _require.has,
  resolve = _require.resolve;
var _create = function create() {
  // Module definitions.
  var definitions = {};

  // Module instances.
  var instances = {};

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
    assert(typeof id === 'string', "id must be string: ".concat(id));
    assert(!has(definitions, id), "id already defined: ".concat(id));
    assert(Array.isArray(deps), "deps must be array: ".concat(id));

    // accept definition
    definitions[id] = {
      id: id,
      deps: deps,
      fn: typeof def === 'function' ? def : function () {
        return def;
      }
    };
  };

  // Returns an instance for `id`. If a `mocks` object is given, it is
  // used to resolve the dependencies.
  var require = function require(id, mocks) {
    assert(typeof id === 'string', "id must be string: ".concat(id));
    return resolve(definitions, mocks || instances, id);
  };

  // Returns an object that holds infos about the current definitions
  // and dependencies.
  var state = function state() {
    var res = {};
    for_own(definitions, function (def, id) {
      res[id] = {
        // direct dependencies
        deps: def.deps.slice(),
        // transitive dependencies
        reqs: resolve(definitions, null, id),
        // already initiated/required
        init: has(instances, id)
      };
    });
    for_own(definitions, function (def, id) {
      var inv = [];
      for_own(definitions, function (def2, id2) {
        if (res[id2].reqs.indexOf(id) >= 0) {
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
    for_own(state(), function (st, id) {
      var list = inv ? st.reqd : st.reqs;
      out += "".concat(st.init ? '*' : ' ', " ").concat(id, " -> [ ").concat(list.join(', '), " ]\n");
    });
    return out;
  };
  return {
    create: _create,
    define: define,
    log: log,
    require: require,
    state: state,
    _d: definitions,
    _i: instances
  };
};
module.exports = _create();

/***/ }),
/* 1 */
/***/ ((module) => {

// Throws an error if `expr` is falsy.
var assert = function assert(expr, msg) {
  if (!expr) {
    throw new Error("[modulejs] ".concat(msg));
  }
};

// Iterates over all own props of an object.
var for_own = function for_own(x, fn) {
  Object.keys(x).forEach(function (k) {
    return fn(x[k], k);
  });
};

// Short cut for `hasOwnProperty`.
var has = function has(x, id) {
  return (x || {}).hasOwnProperty(id);
};

// Returns an new array containing no duplicates. Preserves first occurence and
// order.
var uniq = function uniq(x) {
  var cache = {};
  return x.filter(function (val) {
    var res = !cache[val];
    cache[val] = 1;
    return res;
  });
};

// Resolves `id` to an object for the given definitions `defs` and already
// instantiated objects `insts`. Adds any new instances to `insts`. If `insts`
// is null it only resolves dependency IDs.
// `stack` is used internal to check for circular dependencies.
var _resolve = function resolve(defs, insts, id, stack) {
  var onlyDepIds = !insts;

  // if a module is required that was already created return that object
  if (!onlyDepIds && has(insts, id)) {
    return insts[id];
  }

  // check if `id` is defined
  var def = defs[id];
  assert(def, "id not defined: ".concat(id));

  // copy resolve stack and add this `id`
  stack = (stack || []).slice();
  stack.push(id);

  // if `onlyDepIds` this will hold the dependency-IDs, otherwise it
  // will hold the dependency-objects
  var deps = [];
  def.deps.forEach(function (depId) {
    // check for circular dependencies
    assert(stack.indexOf(depId) < 0, "circular dependencies: ".concat(depId, " in ").concat(stack));
    var depDeps = _resolve(defs, insts, depId, stack);
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
  }

  // create, memorize and return object
  // using def.fn(...deps) instead would cost ~120B uglified
  var obj = def.fn.apply(undefined, deps);
  insts[id] = obj;
  return obj;
};
module.exports = {
  assert: assert,
  for_own: for_own,
  has: has,
  resolve: _resolve,
  uniq: uniq
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
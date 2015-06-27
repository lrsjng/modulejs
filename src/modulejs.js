(function (root, factory) {
'use strict';

/*istanbul ignore else */
if (typeof exports === 'object') {
    module.exports = factory();
} else {
    root.modulejs = factory();
}

}(this, function () {
    'use strict';

    var OBJ_PROTO = Object.prototype;

    // Returns a function that returns `true` if `x` is of the correct
    // `type`, otherwise `false`.
    function _create_is_x_fn(type) {
        return function (x) {
            return OBJ_PROTO.toString.call(x) === '[object ' + type + ']';
        };
    }

    // Type checking functions.
    var isArray = _create_is_x_fn('Array');
    var isFunction = _create_is_x_fn('Function');
    var isString = _create_is_x_fn('String');

    // Short cut for `hasOwnProperty`.
    function has(x, id) {
        return x !== undefined && x !== null && OBJ_PROTO.hasOwnProperty.call(x, id);
    }

    // Iterates over all elements af an array or all own keys of an object.
    function each(x, fn) {
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
    }

    // Returns `true` if `x` contains `val`, otherwise `false`.
    function contains(x, val) {
        if (x && x.length) {
            for (var i = 0, l = x.length; i < l; i += 1) {
                if (x[i] === val) {
                    return true;
                }
            }
        }
        return false;
    }

    // Returns an new array containing no duplicates. Preserves first
    // occurence and order.
    function uniq(x) {
        var result = [];
        each(x, function (val) {
            if (!contains(result, val)) {
                result.push(val);
            }
        });
        return result;
    }

    // Throws an error if `expression` is falsy.
    function assert(expression, message) {
        if (!expression) {
            throw new Error('[modulejs] ' + message);
        }
    }

    function create() {
        // Module definitions.
        var definitions = {};

        // Module instances.
        var instances = {};

        // Resolves `id` to an object. If `mixed` is `true` only returns
        // dependency-IDs. If `mixed` is an object it is used instead of the
        // already memorized `instances` to allow mock-dependencies. `stack`
        // is used internal to check for circular dependencies.
        function resolve(id, mixed, stack) {

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
            var obj = def.fn.apply(undefined, deps);
            resolvedInstances[id] = obj;
            return obj;
        }

        // Defines a module for `id: String`, optional `deps: Array[String]`,
        // `def: mixed`.
        function define(id, deps, def) {

            // sort arguments
            if (arguments.length < 3) {
                def = deps;
                deps = [];
            }
            // check arguments
            assert(isString(id), 'id must be string: ' + id);
            assert(!has(definitions, id), 'id already defined: ' + id);
            assert(isArray(deps), 'deps must be array: ' + id);

            // accept definition
            definitions[id] = {
                id: id,
                deps: deps,
                fn: isFunction(def) ? def : function () { return def; }
            };
        }

        // Returns an instance for `id`. If a `mocks` object is given, it is
        // used to resolve the dependencies.
        function require(id, mocks) {

            return resolve(id, mocks);
        }

        // Returns an object that holds infos about the current definitions
        // and dependencies.
        function state() {

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
        }

        // Returns a string that displays module dependencies.
        function log(inv) {

            var out = '\n';

            each(state(), function (st, id) {

                var list = inv ? st.reqd : st.reqs;
                out += (st.init ? '* ' : '  ') + id + ' -> [ ' + list.join(', ') + ' ]\n';
            });

            return out;
        }

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
    }

    return create();
}));

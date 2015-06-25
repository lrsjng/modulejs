(function (root, factory) {
    'use strict';

    root.modulejs = factory();

}(this, function () {
    'use strict';

    var objectPrototype = Object.prototype;
    var arrayForEach = Array.prototype.forEach;

    // Returns a function that returns `true` if `arg` is of the correct
    // `type`, otherwise `false`.
    function createIsTypeFn(type) {

        return function (arg) {

            return objectPrototype.toString.call(arg) === '[object ' + type + ']';
        };
    }

    // Type checking functions.
    var isString = createIsTypeFn('String');
    var isFunction = createIsTypeFn('Function');
    var isArray = Array.isArray || createIsTypeFn('Array');
    function isObject(arg) { return arg === new Object(arg); }

    // Short cut for `hasOwnProperty`.
    function has(arg, id) {

        return objectPrototype.hasOwnProperty.call(arg, id);
    }

    // Iterates over all elements af an array or all own keys of an object.
    function each(obj, iterator, context) {

        if (arrayForEach && obj.forEach === arrayForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === Number(obj.length)) {
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
    }

    // Returns `true` if array contains `element`, otherwise `false`.
    function contains(array, element) {

        for (var i = 0, l = array.length; i < l; i += 1) {
            if (array[i] === element) {
                return true;
            }
        }
        return false;
    }

    // Returns an new array containing no duplicates. Preserves first
    // occurence and order.
    function uniq(array) {

        var elements = {};
        var result = [];

        each(array, function (el) {

            if (!has(elements, el)) {
                result.push(el);
                elements[el] = 1;
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

        // Resolves an `id` to an object, or if `onlyDepIds` is `true` only
        // returns dependency-ids. `stack` is used internal to check for
        // circular dependencies.
        // If defined, `resolvedInstances` is used instead of the already
        // memorized `instances` to allow faking dependencies.
        function resolve(id, onlyDepIds, stack, resolvedInstances) {

            // check arguments
            assert(isString(id), 'id must be string: ' + id);

            // Use `resolvedInstances` if defined
            resolvedInstances = resolvedInstances || instances;

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
                    deps = deps.concat(resolve(depId, onlyDepIds, stack));
                    deps.push(depId);
                } else {
                    deps.push(resolve(depId, onlyDepIds, stack, resolvedInstances));
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
        // `def: Object/function`.
        function define(id, deps, def) {

            // sort arguments
            if (def === undefined) {
                def = deps;
                deps = [];
            }
            // check arguments
            assert(isString(id), 'id must be string: ' + id);
            assert(!definitions[id], 'id already defined: ' + id);
            assert(isArray(deps), 'deps must be array: ' + id);
            assert(isObject(def) || isFunction(def), 'def must be object or function: ' + id);

            // accept definition
            definitions[id] = {
                id: id,
                deps: deps,
                fn: isFunction(def) ? def : function () { return def; }
            };
        }

        // Returns an instance for `id`. If a `fakeInstances` object is given,
        // it is used to resolve the dependencies.
        function require(id, fakeInstances) {

            return resolve(id, false, [], fakeInstances);
        }

        // Returns an object that holds infos about the current definitions
        // and dependencies.
        function state() {

            var res = {};

            each(definitions, function (def, id) {

                res[id] = {

                    // direct dependencies
                    deps: def.deps.slice(0),

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
                isObject: isObject,
                isString: isString,
                resolve: resolve,
                uniq: uniq
            }
        };
    }

    return create();
}));

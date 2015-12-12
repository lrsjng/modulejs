(factory => {
    // istanbul ignore else
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof window === 'object') {
        window.modulejs = factory(); // eslint-disable-line no-undef
    }
})(() => {
    const OBJ_PROTO = Object.prototype;

    // Returns a function that returns `true` if `x` is of the correct
    // `type`, otherwise `false`.
    const _create_is_x_fn = type => {
        return x => OBJ_PROTO.toString.call(x) === '[object ' + type + ']'; // eslint-disable-line prefer-reflect
    };

    // Type checking functions.
    const isArray = _create_is_x_fn('Array');
    const isFunction = _create_is_x_fn('Function');
    const isString = _create_is_x_fn('String');

    // Short cut for `hasOwnProperty`.
    const has = (x, id) => {
        return x !== undefined && x !== null && OBJ_PROTO.hasOwnProperty.call(x, id); // eslint-disable-line prefer-reflect
    };

    // Iterates over all elements af an array or all own keys of an object.
    const each = (x, fn) => {
        if (x && x.length) {
            for (let i = 0, l = x.length; i < l; i += 1) {
                fn(x[i], i, x);
            }
        } else {
            for (const k in x) {
                if (has(x, k)) {
                    fn(x[k], k, x);
                }
            }
        }
    };

    // Returns `true` if `x` contains `val`, otherwise `false`.
    const contains = (x, val) => {
        if (x && x.length) {
            for (let i = 0, l = x.length; i < l; i += 1) {
                if (x[i] === val) {
                    return true;
                }
            }
        }
        return false;
    };

    // Returns an new array containing no duplicates. Preserves first
    // occurence and order.
    const uniq = x => {
        const result = [];
        each(x, val => {
            if (!contains(result, val)) {
                result.push(val);
            }
        });
        return result;
    };

    // Throws an error if `expression` is falsy.
    const assert = (expression, message) => {
        if (!expression) {
            throw new Error('[modulejs] ' + message);
        }
    };

    const create = () => {
        // Module definitions.
        const definitions = {};

        // Module instances.
        const instances = {};

        // Resolves `id` to an object. If `mixed` is `true` only returns
        // dependency-IDs. If `mixed` is an object it is used instead of the
        // already memorized `instances` to allow mock-dependencies. `stack`
        // is used internal to check for circular dependencies.
        const resolve = (id, mixed, stack) => {
            // check arguments
            assert(isString(id), 'id must be string: ' + id);
            const onlyDepIds = mixed === true;
            const resolvedInstances = (onlyDepIds ? undefined : mixed) || instances;

            // if a module is required that was already created return that
            // object
            if (!onlyDepIds && has(resolvedInstances, id)) {
                return resolvedInstances[id];
            }

            // check if `id` is defined
            const def = definitions[id];
            assert(def, 'id not defined: ' + id);

            // copy resolve stack and add this `id`
            stack = (stack || []).slice();
            stack.push(id);

            // if `onlyDepIds` this will hold the dependency-IDs, otherwise it
            // will hold the dependency-objects
            let deps = [];

            each(def.deps, depId => {
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
            const obj = def.fn.apply(undefined, deps);
            resolvedInstances[id] = obj;
            return obj;
        };

        // Defines a module for `id: String`, optional `deps: Array[String]`,
        // `def: mixed`.
        const define = (id, deps, def) => {
            // sort arguments
            if (def === undefined) {
                [deps, def] = [[], deps];
            }
            // check arguments
            assert(isString(id), 'id must be string: ' + id);
            assert(!has(definitions, id), 'id already defined: ' + id);
            assert(isArray(deps), 'deps must be array: ' + id);

            // accept definition
            definitions[id] = {
                id,
                deps,
                fn: isFunction(def) ? def : () => def
            };
        };

        // Returns an instance for `id`. If a `mocks` object is given, it is
        // used to resolve the dependencies.
        const require = (id, mocks) => resolve(id, mocks);

        // Returns an object that holds infos about the current definitions
        // and dependencies.
        const state = () => {
            const res = {};

            each(definitions, (def, id) => {
                res[id] = {

                    // direct dependencies
                    deps: def.deps.slice(),

                    // transitive dependencies
                    reqs: resolve(id, true),

                    // already initiated/required
                    init: has(instances, id)
                };
            });

            each(definitions, (def, id) => {
                const inv = [];

                each(definitions, (def2, id2) => {
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
        const log = inv => {
            let out = '\n';

            each(state(), (st, id) => {
                const list = inv ? st.reqd : st.reqs;
                out += (st.init ? '* ' : '  ') + id + ' -> [ ' + list.join(', ') + ' ]\n';
            });

            return out;
        };

        return {
            create,
            define,
            log,
            require,
            state,
            _private: {
                assert,
                contains,
                definitions,
                each,
                has,
                instances,
                isArray,
                isFunction,
                isString,
                resolve,
                uniq
            }
        };
    };

    return create();
});

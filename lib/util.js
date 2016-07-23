// Throws an error if `expr` is falsy.
const assert = (expr, msg) => {
    if (!expr) {
        throw new Error(`[modulejs] ${msg}`);
    }
};

// Iterates over all own props of an object.
const forOwn = (x, fn) => {
    Object.keys(x).forEach(k => fn(x[k], k));
};

// Short cut for `hasOwnProperty`.
const has = (x, id) => {
    return (x || {}).hasOwnProperty(id);
};

// Returns an new array containing no duplicates. Preserves first occurence and
// order.
const uniq = x => {
    const cache = {};
    return x.filter(val => {
        const res = !cache[val];
        cache[val] = 1;
        return res;
    });
};

// Resolves `id` to an object for the given definitions `defs` and already
// instantiated objects `insts`. Adds any new instances to `insts`. If `insts`
// is null it only resolves dependency IDs.
// `stack` is used internal to check for circular dependencies.
const resolve = (defs, insts, id, stack) => {
    const onlyDepIds = !insts;

    // if a module is required that was already created return that object
    if (!onlyDepIds && has(insts, id)) {
        return insts[id];
    }

    // check if `id` is defined
    const def = defs[id];
    assert(def, `id not defined: ${id}`);

    // copy resolve stack and add this `id`
    stack = (stack || []).slice();
    stack.push(id);

    // if `onlyDepIds` this will hold the dependency-IDs, otherwise it
    // will hold the dependency-objects
    let deps = [];

    def.deps.forEach(depId => {
        // check for circular dependencies
        assert(stack.indexOf(depId) < 0, `circular dependencies: ${depId} in ${stack}`);

        const depDeps = resolve(defs, insts, depId, stack);
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
    const obj = def.fn.apply(undefined, deps);
    insts[id] = obj;
    return obj;
};

module.exports = {
    assert,
    forOwn,
    has,
    resolve,
    uniq
};

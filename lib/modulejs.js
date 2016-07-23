const {assert, forOwn, has, resolve} = require('./util');

const create = () => {
    // Module definitions.
    const definitions = {};

    // Module instances.
    const instances = {};

    // Defines a module for `id: String`, optional `deps: Array[String]`,
    // `def: mixed`.
    const define = (id, deps, def) => {
        // sort arguments
        if (def === undefined) {
            [deps, def] = [[], deps];
        }
        // check arguments
        assert(typeof id === 'string', `id must be string: ${id}`);
        assert(!has(definitions, id), `id already defined: ${id}`);
        assert(Array.isArray(deps), `deps must be array: ${id}`);

        // accept definition
        definitions[id] = {
            id,
            deps,
            fn: typeof def === 'function' ? def : () => def
        };
    };

    // Returns an instance for `id`. If a `mocks` object is given, it is
    // used to resolve the dependencies.
    const require = (id, mocks) => {
        assert(typeof id === 'string', `id must be string: ${id}`);
        return resolve(definitions, mocks || instances, id);
    };

    // Returns an object that holds infos about the current definitions
    // and dependencies.
    const state = () => {
        const res = {};

        forOwn(definitions, (def, id) => {
            res[id] = {

                // direct dependencies
                deps: def.deps.slice(),

                // transitive dependencies
                reqs: resolve(definitions, null, id),

                // already initiated/required
                init: has(instances, id)
            };
        });

        forOwn(definitions, (def, id) => {
            const inv = [];

            forOwn(definitions, (def2, id2) => {
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
    const log = inv => {
        let out = '\n';

        forOwn(state(), (st, id) => {
            const list = inv ? st.reqd : st.reqs;
            out += `${st.init ? '*' : ' '} ${id} -> [ ${list.join(', ')} ]\n`;
        });

        return out;
    };

    return {
        create,
        define,
        log,
        require,
        state,
        _d: definitions,
        _i: instances
    };
};

module.exports = create();

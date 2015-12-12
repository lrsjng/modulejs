const {join} = require('path');
const {readFileSync} = require('fs');
const {createContext, runInContext} = require('vm');

const lib = require('../lib/modulejs');
const dist = require('../dist/modulejs');
const min = require('../dist/modulejs.min');

const DIST_PATH = join(__dirname, '../dist/modulejs.js');
const MIN_PATH = join(__dirname, '../dist/modulejs.min.js');

const load = path => {
    const content = readFileSync(path, {encoding: 'utf-8'});
    const sandbox = {};
    createContext(sandbox);
    runInContext(content, sandbox);
    return sandbox;
};

const dist_root = load(DIST_PATH).modulejs;
const min_root = load(MIN_PATH).modulejs;

module.exports = {
    lib,
    dist,
    min,
    dist_root,
    min_root,
    modulejs: min_root
};

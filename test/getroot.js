'use strict';

function getRoot() {
    if (typeof window === 'object') {
        return window; // jshint ignore: line
    } else {
        var fs = require('fs');
        var path = require('path');
        var vm = require('vm');

        var srcpath = path.join(__dirname, '../src/modulejs.js');
        var modulejs_content = fs.readFileSync(srcpath, 'utf-8');
        var sandbox = {};
        vm.runInNewContext(modulejs_content, sandbox, 'modulejs.js');

        return sandbox;
    }
}

module.exports = getRoot;

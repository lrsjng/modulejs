'use strict';

module.exports = function (suite) {

    var path = require('path');
    var root = path.resolve(__dirname);
    var src = path.join(root, 'src');
    var dist = path.join(root, 'dist');
    var build = path.join(root, 'build');

    var $ = require('fquery');
    $.plugin('fquery-jshint');
    $.plugin('fquery-jszip');
    $.plugin('fquery-uglifyjs');

    suite.defaults('release');

    suite.target('clean', [], 'delete build folder').task(function () {

        $([dist, build], {dirs: true}).delete();
    });

    suite.target('lint', [], 'lint all JavaScript files with JSHint').task(function () {

        $(src + ': *.js')
            .jshint();
    });

    suite.target('release', ['clean', 'lint'], 'build all files and create a zipball').task(function () {

        var pkg = require('./package.json');
        var header = '/* ' + pkg.displayName + ' ' + pkg.version + ' - ' + pkg.homepage + ' */\n';
        var target = path.join(build, pkg.name + '-' + pkg.version + '.zip');

        $(src + ': *.js')
            .wrap(header)
            .write($.map.p(src, dist), true)
            .write($.map.p(src, build).s('.js', '-' + pkg.version + '.js'), true)
            .uglifyjs()
            .wrap(header)
            .write($.map.p(src, dist).s('.js', '.min.js'), true)
            .write($.map.p(src, build).s('.js', '-' + pkg.version + '.min.js'), true);

        $(root + ': *.md')
            .write($.map.p(root, build), true);

        $(build + ': **')
            .jszip({dir: build, level: 9})
            .write(target, true);
    });
};

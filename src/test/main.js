
// setup for noConflict test
var previousReference = {prev: 'reference'};
this['%BUILD_NAME%'] = previousReference;

// @include "inc/qunit-1.9.0pre.js"
// @include "inc/underscore-1.3.3.js"
// @include "../modulejs-debug-%BUILD_VERSION%.js"
// @include "../modulejs-%BUILD_VERSION%.js"

// @include "inc/tests.js"
// @include "inc/tests-debug.js"

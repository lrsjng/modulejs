const {test} = require('scar');

require('./sub/util');
require('./sub/assert');
require('./sub/forOwn');
require('./sub/has');
require('./sub/resolve');
require('./sub/uniq');

require('./sub/modulejs');
require('./sub/create');
require('./sub/define');
require('./sub/definitions');
require('./sub/instances');
require('./sub/log');
require('./sub/require');
require('./sub/state');

test.cli({sync: true});

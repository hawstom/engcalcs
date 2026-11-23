// THE USER MANUAL, GROUP A: its machinery, the Find chapter, and the boxes.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/user-guide-a-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('user-guide-a-group-harness', 'EC_UGGA_LOCKED', [
	'user-guide-find-harness.js',
	'user-guide-harness.js',
	'user-guide-column-harness.js',
	'guide-style-harness.js',
	'user-guide-boxes-harness.js',
	'user-guide-search-hit-harness.js',
	'user-guide-tables-harness.js',
	'user-guide-toolbar-harness.js',
]);

// THE USER MANUAL, GROUP B: map, library, hierarchy, point, settings, using.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/user-guide-b-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('user-guide-b-group-harness', 'EC_UGGB_LOCKED', [
	'user-guide-map-harness.js',
	'user-guide-library-harness.js',
	'user-guide-hierarchy-harness.js',
	'user-guide-point-harness.js',
	'user-guide-settings-harness.js',
	'user-guide-using-harness.js',
]);

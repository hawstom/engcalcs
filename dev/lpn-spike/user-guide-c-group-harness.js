// THE USER MANUAL, GROUP C: scenarios, reports, notes, energy, fire flow.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/user-guide-c-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('user-guide-c-group-harness', 'EC_UGGC_LOCKED', [
	'user-guide-scenarios-harness.js',
	'user-guide-reports-harness.js',
	'user-guide-notes-harness.js',
	'user-guide-energy-harness.js',
	'user-guide-fireflow-harness.js',
]);

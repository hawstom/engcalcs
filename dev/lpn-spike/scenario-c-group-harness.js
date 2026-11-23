// SCENARIOS, GROUP C: the Scenario manager, its flyout and tree, delete, and the file names.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/scenario-c-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('scenario-c-group-harness', 'EC_SCGC_LOCKED', [
	'scenario-manager-browser-harness.js',
	'scenario-manager-basic-browser-harness.js',
	'scenario-flyout-browser-harness.js',
	'scenario-only-delete-browser-harness.js',
	'scenario-tree-browser-harness.js',
	'scenario-io-names-browser-harness.js',
]);

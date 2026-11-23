// SCENARIOS, GROUP A: Tom's passes of 2026-10-12 and 2026-10-13, the name truncation, the basemap.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/scenario-a-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('scenario-a-group-harness', 'EC_SCGA_LOCKED', [
	'scenario-pass-1012-browser-harness.js',
	'scenario-pass-1013-browser-harness.js',
	'scenario-name-truncate-browser-harness.js',
	'scenario-basemap-browser-harness.js',
]);

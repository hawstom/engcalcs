// THE USER MANUAL, GROUP D: properties, rail, contour, criticality, demand scale, menus, calibration, own entry.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/user-guide-d-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('user-guide-d-group-harness', 'EC_UGGD_LOCKED', [
	'user-guide-properties-harness.js',
	'user-guide-rail-harness.js',
	'user-guide-contour-harness.js',
	'user-guide-criticality-harness.js',
	'user-guide-demandscale-harness.js',
	'user-guide-menus-harness.js',
	'user-guide-calibration-harness.js',
	'user-guide-own-harness.js',
]);

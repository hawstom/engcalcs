// SCENARIOS, GROUP B: the 2026-10-14 pass, receipts, the report mix, results by asset.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/scenario-b-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('scenario-b-group-harness', 'EC_SCGB_LOCKED', [
	'scenario-pass-1014-browser-harness.js',
	'scenario-receipt-browser-harness.js',
	'scenario-report-mix-browser-harness.js',
	'scenario-results-by-asset-browser-harness.js',
]);

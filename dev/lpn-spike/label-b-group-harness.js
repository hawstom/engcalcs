// LABELS, GROUP B: leader bounds, stable export, drag fit, short labels, the Settings label rows.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-b-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-b-group-harness', 'EC_LBGB_LOCKED', [
	'label-leader-bound-browser-harness.js',
	'label-export-stable-browser-harness.js',
	'label-drag-fit-harness.js',
	'short-labels-browser-harness.js',
	'settings-labels-wrap-browser-harness.js',
]);

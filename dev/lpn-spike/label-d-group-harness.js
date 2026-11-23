// LABELS, GROUP D: the pipe label level and the open side. (label-pipe-fields-browser-harness.js runs alone: it needs most of a 300 s budget.)
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-d-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-d-group-harness', 'EC_LBGD_LOCKED', [
	'pipe-label-level-browser-harness.js',
	'pipe-label-level-wheel-browser-harness.js',
	'label-open-side-browser-harness.js',
]);

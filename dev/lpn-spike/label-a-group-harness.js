// LABELS, GROUP A: leader shapes and keeping, the hit box, the demand snapshot.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-a-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-a-group-harness', 'EC_LBGA_LOCKED', [
	'label-leader-shapes-browser-harness.js',
	'label-leader-keep-harness.js',
	'label-hit-box-browser-harness.js',
	'label-snapshot-demand-browser-harness.js',
]);

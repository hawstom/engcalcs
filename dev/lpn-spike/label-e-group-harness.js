// LABELS, GROUP E: drag tracking, the final crossing.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-e-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-e-group-harness', 'EC_LBGE_LOCKED', [
	'label-drag-track-harness.js',
	'label-crossing-final-browser-harness.js',
]);

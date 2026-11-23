// LABELS, GROUP F: pass economy, box label wrap, undo and redo of labels, the Settings label rows.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-f-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-f-group-harness', 'EC_LBGF_LOCKED', [
	'label-pass-economy-browser-harness.js',
	'box-label-wrap-browser-harness.js',
	'undo-redo-label-harness.js',
	'settings-labels-rows-browser-harness.js',
]);

// LABELS, GROUP C: the label form (wheel and the 600-junction half), the renamed-label zombie.
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/label-c-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('label-c-group-harness', 'EC_LBGC_LOCKED', [
	'label-form-wheel-browser-harness.js',
	'label-form-n600-browser-harness.js',
	'rename-label-zombie-harness.js',
]);

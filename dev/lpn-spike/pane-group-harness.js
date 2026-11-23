// PANES: the Tables and bottom panes in a real browser (boxes, headings, description, print, frequency, toggle growth, option colour).
// One process, one PHP server, one Chromium for the members below (browser-group-lib.js); each member
// is an ordinary harness and runs exactly as it does alone: `node dev/lpn-spike/<member>`.
//   node dev/lpn-spike/pane-group-harness.js   (takes the browser lock itself)
// Why grouped: dev/test-trim-2.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
require('./browser-group-lib.js').runGroup('pane-group-harness', 'EC_PANG_LOCKED', [
	'pane-boxes-browser-harness.js',
	'pane-clear-override-speed-browser-harness.js',
	'pane-description-heading-width-browser-harness.js',
	'pane-description-phone-browser-harness.js',
	'pane-heading-rule-harness.js',
	'pane-heading-rule-ab-harness.js',
	'pane-heading-rule-examples-harness.js',
	'pane-heading-wrap-harness.js',
	'pane-print-cell-wrap-harness.js',
	'pane-select-option-colour-browser-harness.js',
	'frequency-pane-height-harness.js',
	'bottom-pane-toggle-growth-harness.js',
]);

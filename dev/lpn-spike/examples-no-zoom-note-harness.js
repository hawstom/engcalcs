// NO EXAMPLE CARRIES A "Zoom in to see labels" NOTE -- Tom, 2026-09-28 ("Preparing to make videos"):
// *"Zoom in to see labels: I guess we can remove those."* Run with:
//   node dev/lpn-spike/examples-no-zoom-note-harness.js
//
// Reads every shipped example from the manifest (so a new one is covered the day it ships) and its
// source in dev/water-network-examples/, and asserts no Text object says it. Also asserts Net3 kept
// its other two Text objects, so the removal took the one note and nothing else.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
let fails = 0;
function ok(name, cond) { console.log((cond ? '  ok   ' : '  FAIL ') + name); if (!cond) { fails++; } }

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'manifest.json'), 'utf8'));
manifest.examples.forEach(function (ex) {
	[path.join(ROOT, 'examples', ex.file), path.join(ROOT, 'dev', 'water-network-examples', ex.file)].forEach(function (f) {
		if (!fs.existsSync(f)) { return; }
		const doc = JSON.parse(fs.readFileSync(f, 'utf8'));
		const notes = (doc.labels || []).filter(function (lb) {
			return /zoom in to see labels/i.test(String(lb.text || lb._text || ''));
		});
		ok(path.relative(ROOT, f) + ': no "Zoom in to see labels" Text', notes.length === 0);
	});
});
['Net3.lwn', 'Net3-Novato-CA-World.lwn'].forEach(function (file) {
	const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', file), 'utf8'));
	const ids = (doc.labels || []).map(function (lb) { return lb.id; }).join(',');
	ok(file + ': its other Text objects are still there (X1,X2)', ids === 'X1,X2');
});
if (fails) { console.log('\n' + fails + ' example note check(s) FAILED'); process.exit(1); }
console.log('\nExamples no-zoom-note harness: all checks passed.');

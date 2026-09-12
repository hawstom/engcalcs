// AN EXAMPLE OPENS ON THE VIEW IT WAS SAVED WITH. Run with:
//   node dev/lpn-spike/example-view-harness.js
//
// Tom, 2026-09-12, opening the gallery on librewaternet.org/app: *"Net3 xy, Elm Street Center,
// examples open away from their center to a blank screen. The others are okay."*
//
// **THE OTHERS WERE NOT OKAY. THEY WERE THE ONES WHOSE FIT HAPPENED TO LOOK RIGHT.** All seven
// shipped examples were opening on a zoom-to-fit instead of their stored view, and the two he
// named are the two where a fit and the saved view differ enough to notice: their bounding box is
// dominated by things that are not the network, so the fit lands the pipes off to one side.
//
// THE CAUSE, and it is an ORDERING bug rather than an arithmetic one. Task 629 (2026-09-11, one day
// before the report) made a pending view belong to a PROJECT -- `pendingViewFor` -- so that a
// camera could not leak from the project being left to the project arriving, in the wrong
// coordinate frame. Correct, and the guard reads `library.openId` at the moment applySaved()
// installs the document. But importProject() -- the gallery's route, and every file import's --
// called applySaved() BEFORE switching `library.openId` to the new project, so the view was bound
// to the project being left and restoreViewOrFit() then rightly refused it as somebody else's.
// openProject(), the other switch path, had always set openId first. The fix is to make the two
// agree; section 2 asserts that they still do.
//
// **WHY NO HARNESS CAUGHT IT**: the ones that open an example call acceptImportedText() +
// applySaved() directly (dev/lpn-spike/example-fixture.js), which is the INSTALL seam and not the
// gallery's path. importProject() is the door a visitor actually comes through, and nothing drove
// it. This file drives that door, with the real shipped files.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// One page per example: importProject() switches projects inside a live library, and reusing a
// loaded module would leave the previous example's project open beside the next one's.
function freshPage() {
	const L = loadLoopedNetwork(
		"\t\tacceptImportedText: acceptImportedText, importProject: importProject,\n" +
		"\t\tviewNow: currentView, docNow: function () { return doc; },\n" +
		"\t\tbboxNow: function () { return bbox(); },\n" +
		"\t\tlibraryNow: function () { return library; },\n" +
		"\t\tsetSized: function () { mapSized = true; },\n" +
		"\t\tlayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tsvg.clientWidth = 1200; svg.clientHeight = 800;\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
	);
	L.layers();
	L.setSized();
	return L;
}

// ================================================================================================
// 1. EVERY SHIPPED EXAMPLE, THROUGH THE GALLERY'S OWN DOOR
// ================================================================================================
// The list is DERIVED from the folder, never typed: an eighth example must be covered by being
// added, not by somebody remembering this file.
const files = fs.readdirSync(path.join(ROOT, 'examples'))
	.filter(f => f.endsWith('.lwn')).sort();
ok('there are examples to check, and the list came from the folder', files.length >= 7,
	files.length + ' file(s)');

console.log('\n--- each example lands on the view its own file states ---');
files.forEach(function (f) {
	const L = freshPage();
	const text = fs.readFileSync(path.join(ROOT, 'examples', f), 'utf8');
	const saved = L.acceptImportedText(text);
	if (!saved) { ok(f + ' opens at all', false); return; }
	// Captured before the open path consumes it: prepareDocument() rebases a survey document's
	// coordinates AND its view, so the number in the file is not the number that should land.
	const want = JSON.parse(JSON.stringify(saved.view));
	const id = L.importProject(saved);
	if (!id) { ok(f + ' is accepted by importProject()', false); return; }
	const got = L.viewNow();
	// **THE SCALE IS THE ASSERTION.** A fit and a restore can share a centre by luck -- both aim at
	// the drawing -- but a fit computes its own scale from the bounding box and will not reproduce a
	// stored one to nine figures. On these seven files the fit came out 20 to 40 per cent wider.
	ok(f.padEnd(30) + ' opens on its saved scale',
		!!got && Math.abs(got.s - want.s) / want.s < 1e-9,
		'saved ' + want.s.toFixed(4) + ', landed ' + (got ? got.s.toFixed(4) : 'none'));
	// **AND IT IS LOOKING AT THE DRAWING**, which is Tom's symptom stated as a property: *"open away
	// from their center to a blank screen."*
	//
	// Deliberately NOT an exact comparison against the file's own cx/cy. A stored view is in the
	// FILE's frame and the landed one is in the drawing frame -- y negated, local to doc.origin, and
	// for a geographic document the stored cy is ALREADY Mercator while its nodes are latitudes, so
	// there is no single conversion to compare through. Reproducing those rules here would be a
	// second copy of the one boundary four other places already own, and it would be asserting the
	// arithmetic rather than the outcome. The centre being inside the drawing's own bounding box is
	// what a reader actually needs, it holds in either frame, and with the exact-scale assertion
	// above it pins a restore apart from a fit completely.
	const b = L.bboxNow();
	ok('...and is looking at the drawing, not past it',
		!!got && !!b && got.cx >= b.minx && got.cx <= b.maxx &&
			got.cy >= b.miny && got.cy <= b.maxy,
		got && b ? 'centre ' + got.cx.toFixed(2) + ',' + got.cy.toFixed(2) +
			' in x[' + b.minx.toFixed(2) + ',' + b.maxx.toFixed(2) +
			'] y[' + b.miny.toFixed(2) + ',' + b.maxy.toFixed(2) + ']' : 'none');
	// The switch really happened: a view restored into the wrong project is the defect one level up.
	const lib = L.libraryNow();
	ok('...with the new project open and in the index',
		lib.openId === id && lib.projects.some(p => p.id === id), String(lib.openId));
});

// ================================================================================================
// 2. THE TWO SWITCH PATHS AGREE ABOUT THE ORDER
// ================================================================================================
// This is the whole of the bug: one path set library.openId before applySaved() and the other
// after, and applySaved() reads it. A source assertion rather than a behavioural one, because the
// behavioural half above passes for either order the moment somebody re-adds a fit.
console.log('\n--- open first, then apply, in both paths ---');
{
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('importProject() switches before it applies',
		/library\.openId = id;\s*\n\s*applySaved\(saved\);/.test(js));
	ok('openProject() still does too',
		/library\.openId = id;\s*\n\s*saveIndex\(\);\s*\n\s*applySaved\(doc2\);/.test(js));
	// applySaved() binding the view to whatever is open is what makes the order matter. If this
	// line ever takes the id as an argument instead, the two assertions above stop being the rule
	// and this one will say so by failing.
	ok('and applySaved() still binds the pending view to library.openId',
		/pendingViewFor = pendingView \? library\.openId : null;/.test(js));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);

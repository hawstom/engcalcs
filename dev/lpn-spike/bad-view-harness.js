// **A GEOGRAPHIC PROJECT OPENED ON THE XY DEFAULT VIEW, IN PIXELS** (ROADMAP Task 629).
//
//   node dev/lpn-spike/bad-view-harness.js
//
// Tom, 2026-09-10, on a reload: "the map is blank again". Nothing was lost -- the document was
// whole and 677 symbols were in the DOM, drawn at 1 x 0 px some 26,000 px off screen. The fault
// was the camera, and his saved file is the fixture: dev/lpn-spike/net3-world-bad-view.lwn.
//
// THE MECHANISM, proved by three exact identities on a 1916 px canvas:
//
//   stored s   5.322222222222222  ==  1916/360  ==  minScale(), the "whole world fits" floor
//   cx local     958.000000       ==  w/2   -- half the canvas width, IN PIXELS
//   cy local    4999.000000       ==  h/2   for a 9998 px tall unsized SVG, IN PIXELS
//
// `defaultViewForCoords()` answers `{cx: w/2, cy: h/2, s: 1}` whenever `isGeoProject()` is false.
// That is right for an XY grid and meaningless in degrees, and `project` still describes the
// OUTGOING project while a geographic one arrives -- so a lat/lon document took the grid branch.
// applyView()'s clamp then raised s:1 to minScale(). The comment above the call site fixes the
// OPPOSITE direction only ("a blank XY tab made after a lat/lon one"), which is why this stayed
// open. It is also Task 624's original report -- "the geographic Net3 example beside an existing
// project" -- so the all-blue map and the blank map are one bug wearing two faces.
//
// WHAT IS GUARDED HERE: applyView() refuses a geographic view from which not one pixel of the
// Earth is visible, and `false` already means "nothing usable", so the caller fits instead. The
// test carries no magic bound -- it asks whether any of the 360-unit Mercator world is on screen.
//
// Section 3 is the part that matters most: a damaged file HEALS, because the fit is what the next
// save records.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const ROOT = stub.ROOT;

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

stub.setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// **THE CANVAS MUST HAVE A REAL SIZE, or applyView() returns false for the wrong reason** and
// every assertion below would pass on a page that never draws. 1916 x 365 is Tom's own window.
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1916; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return 365; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: 1916, bottom: 365, width: 1916, height: 365 };
};

const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, refreshAllFromDocument: refreshAllFromDocument,\n" +
	"\t\tserializeProject: serializeProject, applyView: applyView,\n" +
	"\t\tcurrentView: currentView, isGeoProject: isGeoProject,\n" +
	"\t\tdocOrigin: docOrigin, minScale: minScale, noteMapSized: noteMapSized,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
if (L.noteMapSized) { L.noteMapSized(); }

const BAD = JSON.parse(fs.readFileSync(path.join(__dirname, 'net3-world-bad-view.lwn'), 'utf8'));

// ---- 1. THE FIXTURE IS THE BUG, not a file somebody typed -----------------------------------
console.log('--- 1. Tom\'s saved file still carries the camera that blanked his map ---');
{
	check(BAD.project.coords === 'geo', 'it is a geographic project', BAD.project.coords);
	check(BAD.nodes.length === 97 && BAD.links.length === 119,
		'with the whole of Net3 in it', BAD.nodes.length + ' nodes, ' + BAD.links.length + ' links');
	check(Math.abs(BAD.view.s - 1916 / 360) < 1e-12,
		'and a scale that is EXACTLY the whole-world floor, 1916/360', String(BAD.view.s));
}

// ---- 2. THE GUARD REFUSES IT ----------------------------------------------------------------
console.log('--- 2. applyView() refuses a camera with no part of the Earth on screen ---');
L.applySaved(JSON.parse(JSON.stringify(BAD)));
{
	check(L.isGeoProject(), 'the document installed as geographic');
	const org = L.docOrigin();
	// The file's view is ABSOLUTE; applyView() takes the LOCAL frame, which is what the page hands
	// it. Reproduce that conversion here rather than trusting a number typed into this file.
	const local = { cx: BAD.view.cx - org.x, cy: -(BAD.view.cy - org.y), s: BAD.view.s };
	check(Math.abs(local.cx - 958) < 1e-6,
		'its centre x in the local frame is 958, exactly half the canvas width IN PIXELS',
		String(local.cx));
	check(L.applyView(local) === false,
		'THE GUARD REFUSES IT: applyView() returns false, so the caller fits instead');
}

// ---- 3. AND A GOOD VIEW OF THE SAME NETWORK IS STILL ACCEPTED -------------------------------
// A guard that refused everything would also make this harness green, which is the trap.
console.log('--- 3. a legitimate camera over the same network is still applied ---');
{
	const org = L.docOrigin();
	const good = { cx: -122.56 - org.x, cy: -(41.24 - org.y), s: 6478.75 };
	check(L.applyView(good) === true, 'a view centred on Novato at the example scale is accepted');
	const now = L.currentView();
	check(!!now && Math.abs(now.s - 6478.75) < 1e-6,
		'...and the scale it asked for is the scale in force', now && String(now.s));
}

// ---- 4. THE FILE HEALS: the whole open path, then what the next save would write -------------
console.log('--- 4. the damaged file opens onto its own network, and the next save keeps that ---');
{
	L.applySaved(JSON.parse(JSON.stringify(BAD)));
	L.refreshAllFromDocument();

	const v = L.currentView();
	check(!!v, 'the page settled on a view at all');
	const org = L.docOrigin();
	const lon = v.cx + org.x, merc = -v.cy + org.y;
	check(Math.abs(lon) <= 180 && Math.abs(merc) <= 180,
		'THE CAMERA IS ON EARTH', 'lon ' + lon.toFixed(4) + '  mercY ' + merc.toFixed(4));
	check(lon > -123 && lon < -122,
		'...and it is over Novato, where the network is', 'lon ' + lon.toFixed(4));
	check(v.s > 100, '...at a scale that can actually show a 0.1 degree network',
		's ' + v.s.toFixed(2));

	// The whole point: the bad number does not survive a save, so the file stops being damaged.
	const saved = L.serializeProject();
	check(Math.abs(saved.view.s - BAD.view.s) > 1,
		'AND THE NEXT SAVE WRITES THE GOOD CAMERA, so the file heals',
		'was ' + BAD.view.s.toFixed(4) + ', now ' + saved.view.s.toFixed(2));
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);

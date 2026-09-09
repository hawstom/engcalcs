// GOING SOMEWHERE DOES NOT SPEND THE ZOOM. Run with:
//   node dev/lpn-spike/goto-keeps-zoom-harness.js
//
// Tom, 2026-09-08: *"Goto should preserve the zoom factor. Otherwise good."*
//
// goToPoint() used to zoom IN to a site-sized span -- about a kilometre across -- whenever the view
// was wider than that, and KEEP the scale whenever it was already closer. Half of that rule was
// already conceded on the argument that somebody lined up on a street corner wants to travel rather
// than be zoomed out; Tom has now settled the other half the same way. A scale is a decision the
// user made before they pressed this.
//
// **IT IS THE ONE DOOR** (Task 437), so this is also the promise the place-name search in
// js/lpn-search.js makes: type a name, keep your scale, arrive. Section 3 asserts that the door is
// still one door, because a second traveller with its own opinion about zoom is how this comes
// back.
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

const L = loadLoopedNetwork(
	"\t\tgoToPoint: goToPoint, applyView: applyView, viewNow: currentView,\n" +
	"\t\tstateNow: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	"\t\tmaxScale: maxScale, isGeo: isGeoProject,\n" +
	"\t\tinwardX: inwardX, inwardY: inwardY, outwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base', coords: LPN_COORDS_GEO };\n" +
	"\t\t\tscenarios = defaultScenarios(); settings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tsvg.clientWidth = 1000; svg.clientHeight = 700;\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.reset();
ok('the fixture is a geographic project, which is the only place Go to exists', !!L.isGeo());

// ================================================================================================
// 1. THE SCALE IS UNTOUCHED, FROM EVERY STARTING SCALE
// ================================================================================================
// Both directions, because the OLD rule was asymmetric: it kept a scale closer than a site and
// changed one wider than it. A test at one starting zoom would have passed before this change.
console.log('\n--- the scale comes out of a trip exactly as it went in ---');
const HERE = { lat: 38.5, lon: -122.5 }, THERE = { lat: 51.5, lon: -0.12 };
[0.01, 5, 500, 20000, 200000].forEach(function (s) {
	L.applyView({ cx: L.inwardX(HERE.lon), cy: L.inwardY(HERE.lat), s: Math.min(s, L.maxScale()) });
	const before = L.stateNow().s;
	L.goToPoint(THERE);
	const after = L.stateNow().s;
	ok('a trip from scale ' + before + ' arrives at the same scale',
		Math.abs(after - before) < 1e-12, before + ' -> ' + after);
});

// ================================================================================================
// 2. IT STILL TRAVELS
// ================================================================================================
// "Preserve the zoom" is only correct if the view actually moved -- a no-op preserves it too.
console.log('\n--- and it really goes there ---');
{
	L.applyView({ cx: L.inwardX(HERE.lon), cy: L.inwardY(HERE.lat), s: 1000 });
	L.goToPoint(THERE);
	const v = L.viewNow();
	ok('the view centre is the point that was asked for, in longitude',
		Math.abs(L.outwardX(v.cx) - THERE.lon) < 1e-6, String(L.outwardX(v.cx)));
	ok('...and in latitude', Math.abs(L.outwardY(v.cy) - THERE.lat) < 1e-6, String(L.outwardY(v.cy)));
}

// ================================================================================================
// 3. ONE DOOR, AND THE SPAN CONSTANT IS GONE WITH THE RULE IT SERVED
// ================================================================================================
console.log('\n--- one door, no leftovers ---');
{
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('GOTO_SPAN_DEG is gone -- a constant nothing reads is a rule waiting to be re-applied',
		js.indexOf('GOTO_SPAN_DEG') < 0);
	ok('goToPoint() hands applyView() the scale it already had',
		/applyView\(\{ cx: inwardX\(ll\.lon\), cy: inwardY\(ll\.lat\), s: state\.s \}\)/.test(js));
	// The typed-coordinate row and the place-name search both arrive here, and nothing else does.
	const callers = (js.match(/goToPoint\(/g) || []).length;
	ok('goToPoint is called from the typed row and defined once, with no rival traveller',
		callers >= 2, callers + ' mention(s)');
	const search = fs.readFileSync(path.join(ROOT, 'js/lpn-search.js'), 'utf8');
	ok('js/lpn-search.js travels through the host rather than writing a view of its own',
		search.indexOf('applyView') < 0 && /goTo/.test(search));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);

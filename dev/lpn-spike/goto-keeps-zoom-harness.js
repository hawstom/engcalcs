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
// **IT IS THE ONE DOOR** (Task 437), and section 3 asserts that the door is still one door,
// because a second traveller with its own opinion about zoom is how this comes back.
//
// **WHAT TRAVELS THROUGH IT IS NO LONGER ONE RULE BUT TWO, AND SECTION 4 IS THE SECOND** (Tom,
// 2026-09-12: *"I requested that place name search zoom if OSM provides a zoom level with its
// results ... Goto, however, should not zoom."*). A typed lat/lon says WHERE and nothing about how
// big; a searched name comes back with the extent of the thing found. So the discriminator is not
// which caller it is -- it is whether the caller holds a size. Nominatim sends no zoom level; it
// sends a `boundingbox`, which is what section 4 frames.
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
	"\t\tfitScaleForBox: fitScaleForBox, inwardBox: inwardBox,\n" +
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
	ok('goToPoint() hands applyView() the scale it already had unless it holds an extent',
		/var box = extent \? inwardBox\(extent\) : null;/.test(js) &&
		/var fit = box \? fitScaleForBox\(box\) : 0;/.test(js) &&
		/s: fit > 0 \? fit : state\.s/.test(js));
	// The typed-coordinate row and the place-name search both arrive here, and nothing else does.
	const callers = (js.match(/goToPoint\(/g) || []).length;
	ok('goToPoint is called from the typed row and defined once, with no rival traveller',
		callers >= 2, callers + ' mention(s)');
	const search = fs.readFileSync(path.join(ROOT, 'js/lpn-search.js'), 'utf8');
	ok('js/lpn-search.js travels through the host rather than writing a view of its own',
		search.indexOf('applyView') < 0 && /goTo/.test(search));
	// The scale arithmetic stays on the side that owns the viewport. A geocoder module that learned
	// what a pixel is would be the rival traveller this section exists to prevent -- so it hands
	// over an extent in degrees and nothing else.
	ok('js/lpn-search.js hands over an extent and computes no scale',
		/seam\.goTo\(\{ lat: hit\.lat, lon: hit\.lon \}, hit\.extent\)/.test(search) &&
		search.indexOf('clientWidth') < 0);
}

// ================================================================================================
// 4. AN EXTENT SPENDS THE ZOOM, AND NOTHING ELSE DOES
// ================================================================================================
console.log('\n--- a searched place is framed; a typed coordinate is not ---');
{
	const W = 1000, H = 700, M_PER_DEG = 111132;
	const CITY = { lat: 51.5, lon: -0.12 };
	// Greater London, near enough: 0.84 deg of longitude by 0.41 of latitude.
	const LONDON = { south: 51.28, north: 51.69, west: -0.51, east: 0.33 };

	L.applyView({ cx: L.inwardX(HERE.lon), cy: L.inwardY(HERE.lat), s: 20000 });
	const before = L.stateNow().s;
	L.goToPoint(CITY, LONDON);
	const after = L.stateNow().s;
	ok('an extent changes the scale -- the whole point of the request',
		Math.abs(after - before) > 1e-9, before + ' -> ' + after);

	// A fit means the WHOLE box is on screen. Assert the drawn span against the box on both axes,
	// which is the assertion a one-axis fit would pass and should not.
	const v = L.viewNow();
	const boxX = Math.abs(L.inwardX(LONDON.east) - L.inwardX(LONDON.west));
	const boxY = Math.abs(L.inwardY(LONDON.north) - L.inwardY(LONDON.south));
	ok('the box fits across the view, with room around it',
		W / v.s >= boxX, (W / v.s).toFixed(4) + ' deg of view vs ' + boxX.toFixed(4) + ' of box');
	ok('...and down it', H / v.s >= boxY,
		(H / v.s).toFixed(4) + ' vs ' + boxY.toFixed(4));
	ok('...and is not zoomed out far beyond it either -- a fit, not a retreat',
		W / v.s < boxX * 2, (W / v.s).toFixed(4));

	// Nominatim's lat/lon is a representative point, not the centre of its own box. Framing the box
	// and then centring on the point would push part of the thing just fitted back off screen.
	ok('the centre of a fit is the box, not the representative point',
		Math.abs(L.outwardX(v.cx) - (LONDON.west + LONDON.east) / 2) < 1e-9,
		String(L.outwardX(v.cx)));

	// applyView()'s ceiling is 500 px per METRE, and Nominatim pads a lone node to a few tens of
	// metres, so without the floor a post box arrives as a doorway with no street on screen.
	const POSTBOX = { south: 51.4999, north: 51.5001, west: -0.1201, east: -0.1199 };
	L.goToPoint(CITY, POSTBOX);
	const poiSpanM = (W / L.stateNow().s) * M_PER_DEG;
	ok('a point-sized result stops at the 1 km site floor rather than in a doorway',
		poiSpanM > 900 && poiSpanM < 1200, poiSpanM.toFixed(0) + ' m across');

	// A country still arrives showing a country: the floor bounds the CLOSE end alone.
	const KENYA = { south: -4.9, north: 5.1, west: 33.9, east: 41.9 };
	L.goToPoint({ lat: 0.5, lon: 37.9 }, KENYA);
	ok('a country-sized result is not dragged in to a site',
		(W / L.stateNow().s) * M_PER_DEG > 500000,
		((W / L.stateNow().s) * M_PER_DEG / 1000).toFixed(0) + ' km across');

	// Every refusal must land on the Go to rule rather than on a NaN scale -- and must still travel,
	// which is the half a refusal can quietly break.
	console.log('\n--- and every unusable extent falls back to the Go to rule ---');
	[['no extent at all', undefined],
		['an extent crossing the antimeridian (east < west)',
			{ south: -18, north: -12, west: 177, east: -178 }],
		['a box with no size in either axis',
			{ south: 51.5, north: 51.5, west: -0.12, east: -0.12 }]
	].forEach(function (pair) {
		L.applyView({ cx: L.inwardX(HERE.lon), cy: L.inwardY(HERE.lat), s: 12345 });
		const was = L.stateNow().s;
		L.goToPoint(CITY, pair[1]);
		ok(pair[0] + ' keeps the scale', Math.abs(L.stateNow().s - was) < 1e-12,
			was + ' -> ' + L.stateNow().s);
		ok('...and still arrives', Math.abs(L.outwardX(L.viewNow().cx) - CITY.lon) < 1e-6);
	});

	// The seam itself: a box it cannot use becomes null, and a null box has no opinion about scale.
	ok('inwardBox() refuses a wrapped or inverted box rather than converting it',
		L.inwardBox({ south: -18, north: -12, west: 177, east: -178 }) === null &&
		L.inwardBox({ south: 51.69, north: 51.28, west: -0.51, east: 0.33 }) === null &&
		L.inwardBox(null) === null);
	ok('...and a usable one comes back in drawing units, both edges of both axes',
		(function () {
			const b = L.inwardBox(LONDON);
			return b && Math.abs(L.outwardX(b.x1) - LONDON.west) < 1e-9 &&
				Math.abs(L.outwardX(b.x2) - LONDON.east) < 1e-9;
		}()));
	ok('fitScaleForBox() says 0 -- "no opinion" -- rather than NaN or Infinity',
		L.fitScaleForBox({ x1: 1, x2: 1, y1: 2, y2: 2 }) === 0 && L.fitScaleForBox(null) === 0);
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);

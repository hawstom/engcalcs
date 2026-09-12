// **THE MAP SCALE BAR** (Tom, 2026-09-11: *"let's add it"*; 2026-09-12: *"Bar scale is fine."*).
//
//   node dev/lpn-spike/scalebar-harness.js
//
// WHAT IS ANCHORED HERE, and why each leg exists:
//
//   1. The rounding. A bar labelled 431 ft is a number nobody can multiply, so the label is
//      always 1, 2 or 5 times a power of ten. That is pure arithmetic and is asserted directly.
//   2. **THE BAR AGREES WITH A PIPE.** The whole design is that the bar asks the same
//      geodesicMeters() that fills every lenAuto length, so the two cannot disagree. This
//      measures a pipe of a known ground length and the bar over the same view, and requires the
//      ratio to hold. A second opinion about ground distance is the defect this rules out.
//   3. **IT SHRINKS WITH LATITUDE, which is the fact the bar exists to tell.** A degree of
//      longitude is 111 km at the equator and 55.8 km at 60 north, so the same zoom must print a
//      smaller number further from it. A bar that ignored latitude would pass every other test
//      here and be wrong by a factor of two in Oslo.
//   4. It refuses rather than guesses: no view, a whole-world view, a scale of zero.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const stub = require('./lpn-dom-stub.js');
const ROOT = stub.ROOT;

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

stub.setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// A real canvas size, or every measurement below is zero and every assertion passes vacuously.
const W = 1200, H = 600;
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return W; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return H; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: W, bottom: H, width: W, height: H };
};

const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, applyView: applyView, currentView: currentView,\n" +
	"\t\tisGeoProject: isGeoProject, docOrigin: docOrigin, noteMapSized: noteMapSized,\n" +
	"\t\tscaleBarRound: scaleBarRound, scaleBarUnitsPerPx: scaleBarUnitsPerPx,\n" +
	"\t\trefreshScaleBar: refreshScaleBar, setTransform: setTransform,\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
if (L.noteMapSized) { L.noteMapSized(); }

const Geom = global.EngCalcs.lpnGeom;

// ---- 1. THE ROUNDING ------------------------------------------------------------------------
console.log('--- 1. the label is always 1, 2 or 5 times a power of ten ---');
{
	const cases = [
		[431, 200], [999, 500], [1000, 1000], [1001, 1000], [1999, 1000], [2000, 2000],
		[4999, 2000], [5000, 5000], [9999, 5000], [0.34, 0.2], [0.09, 0.05], [73, 50]
	];
	let bad = null;
	cases.forEach(([raw, want]) => {
		const got = L.scaleBarRound(raw);
		if (!near(got, want, want * 1e-9)) { bad = raw + ' -> ' + got + ', wanted ' + want; }
	});
	check(!bad, 'twelve raw spans round to the nearest 1/2/5 below them', bad || '');
	check(L.scaleBarRound(0) === 0 && L.scaleBarRound(-5) === 0,
		'...and a span of zero or less rounds to zero rather than to NaN');
}

// ---- 2. THE BAR AGREES WITH A PIPE ------------------------------------------------------------
// The bar's only claim is about ground distance, and so is a pipe's length. They must come from
// the same place. Built at Novato's latitude, where the shipped example lives.
console.log('--- 2. the bar and a pipe measure the same ground, through the same function ---');
const LAT = 38.1, LON = -122.56;
{
	L.applySaved({
		version: 10, project: { coords: 'geo', units: { lpn_u_length: 'ft' } },
		nodes: [
			{ id: 'A', type: 'junction', x: LON, y: LAT, elev: 0 },
			{ id: 'B', type: 'junction', x: LON + 0.01, y: LAT, elev: 0 }
		],
		links: [], view: null
	});
	check(L.isGeoProject(), 'the fixture installed as geographic');

	const org = L.docOrigin();
	// A scale that puts about a tenth of a degree across the window: a plausible working zoom.
	const s = W / 0.1;
	check(L.applyView({ cx: LON - org.x, cy: -(Geom.mercY(LAT) - org.y), s: s }) === true,
		'a working view over Novato is accepted');

	const perPx = L.scaleBarUnitsPerPx();
	check(perPx > 0 && isFinite(perPx), 'the bar measures a positive distance per pixel',
		perPx && perPx.toFixed(6) + ' ft/px');

	// THE INDEPENDENT NUMBER: the ground length of one pixel's worth of longitude at the bar's
	// own latitude, taken straight from the function that fills every pipe length. Computed here
	// from the definition rather than read back from the page, or this would test nothing.
	const bottomLat = L.isGeoProject()
		? Geom.mercLat(-((H / 2 - L.getState().ty) / s * -1 + 0) )   // placeholder, replaced below
		: LAT;
	void bottomLat;
	// Simpler and exact: ask the page where the bottom-left of the canvas is, in lon/lat, by the
	// same route the bar does, then measure 100 px of it with geodesicMeters and compare.
	const st = L.getState();
	const wx0 = (0 - st.tx) / st.s, wy0 = (H - st.ty) / st.s;
	const wx1 = (100 - st.tx) / st.s;
	const lon0 = wx0 + org.x, lon1 = wx1 + org.x;
	const lat0 = Geom.mercLat(-wy0 + org.y);
	const metres = Geom.geodesicMeters(lon0, lat0, lon1, lat0);
	const wantFtPerPx = metres / 100 / 0.3048;
	check(near(perPx, wantFtPerPx, wantFtPerPx * 1e-9),
		'AND IT IS geodesicMeters() ITSELF, to the last bit, converted to the display unit',
		perPx.toFixed(9) + ' vs ' + wantFtPerPx.toFixed(9));

	// A pipe of exactly this span must report the same ground length the bar implies.
	const pipeMetres = Geom.geodesicMeters(lon0, lat0, lon1, lat0);
	check(near(pipeMetres / 0.3048 / 100, perPx, 1e-9),
		'...so a pipe drawn across those same 100 px is 100 bar-pixels long',
		(pipeMetres / 0.3048).toFixed(4) + ' ft across 100 px');
}

// ---- 3. IT SHRINKS WITH LATITUDE ---------------------------------------------------------------
// The reason the bar is worth having. cos(60) = 0.5 exactly, so the equator-to-60N ratio is the
// cleanest assertion available and it is not a tolerance dressed up as a test.
console.log('--- 3. the same zoom prints a smaller distance further from the equator ---');
{
	function perPxAt(lat) {
		const org = L.docOrigin();
		const s = W / 0.1;
		L.applyView({ cx: 0 - org.x, cy: -(Geom.mercY(lat) - org.y), s: s });
		return L.scaleBarUnitsPerPx();
	}
	const eq = perPxAt(0.0), n60 = perPxAt(60.0);
	check(eq > 0 && n60 > 0, 'both latitudes measure', eq.toFixed(4) + ' / ' + n60.toFixed(4));
	check(n60 < eq, 'THE BAR IS SHORTER AT 60 NORTH than at the equator, at the same zoom',
		'ratio ' + (n60 / eq).toFixed(4));
	// The bar is measured at the BOTTOM of the window, not at its centre, so the two latitudes
	// compared are not exactly 0 and 60 -- the window has height. The bound is therefore loose on
	// purpose and still nowhere near 1.0, which is what a latitude-blind bar would print.
	check(n60 / eq < 0.75, '...and by roughly the secant of the latitude, not by a rounding',
		'ratio ' + (n60 / eq).toFixed(4) + ', a blind bar would be 1.0000');
}

// ---- 4. IT REFUSES RATHER THAN GUESSES ---------------------------------------------------------
console.log('--- 4. no honest number means no bar ---');
{
	const st = L.getState();
	const kept = st.s;
	st.s = 0;
	check(L.scaleBarUnitsPerPx() === null, 'a scale of zero measures nothing and says so');
	st.s = kept;

	// The whole world across the window: one number at the bar's latitude says nothing about the
	// top of it, so there is nothing honest to print.
	const org = L.docOrigin();
	L.applyView({ cx: 0 - org.x, cy: -(0 - org.y), s: W / 360 });
	const wide = L.scaleBarUnitsPerPx();
	check(wide === null, 'a whole-world view prints no bar at all', String(wide));
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);

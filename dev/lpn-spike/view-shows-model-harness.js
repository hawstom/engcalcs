// **A RESTORED VIEW IS CHECKED AGAINST THE MODEL IT MUST SHOW** (ROADMAP Task 628).
//
//   node dev/lpn-spike/view-shows-model-harness.js
//
// Tom, 2026-09-10, after a machine restart on a geographic Net3: "Zoom to fit restores it all.
// It's a zoom mistake!" His document was whole -- 97 nodes, 119 links, 677 symbols in the DOM --
// and the camera was the specimen every assertion below is anchored on:
//
//   {cx: 835.390625, cy: -4957.78125, s: 5.322222222222222}
//
// THE SCALE ALONE MADE IT INVISIBLE. `s` is pixels per degree, and that network spans 0.0965
// degrees of longitude by 0.082 of Mercator y, so it drew 0.51 px by 0.43 px. Invisible perfectly
// centred. The centre was outside the world in BOTH axes as well: a Mercator y of -4957.78 is 27
// worlds south of a map that runs to +-180, and mercLat() pinned his status bar at exactly -90.
//
// WHAT THIS GUARDS: applySaved() declines such a view, so restoreViewOrFit() fits the network --
// the recovery Tom performed by hand. Task 629's applyView() guard already refused an off-world
// LONGITUDE; sections 2b and 2c below are the two failures it cannot see, and section 2a is the
// one that matters most, a scale fault with the centre dead on target.
//
// AND SECTION 3 IS THE HALF THAT DECIDES WHETHER THIS WAS WORTH BUILDING: a healthy view is
// applied untouched, to the last bit. A validator that repairs good cameras is worse than the bug.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');

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

// Tom's own window. The canvas MUST have a real size or the third leg is skipped and half of
// what is asserted here would pass on a page that never draws.
const CANVAS_W = 1916, CANVAS_H = 365;
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return CANVAS_W; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return CANVAS_H; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: CANVAS_W, bottom: CANVAS_H, width: CANVAS_W, height: CANVAS_H };
};

const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, refreshAllFromDocument: refreshAllFromDocument,\n" +
	"\t\tserializeProject: serializeProject, applyView: applyView,\n" +
	"\t\tcurrentView: currentView, isLatLonProject: isLatLonProject,\n" +
	"\t\tviewShowsModel: viewShowsModel, modelExtent: modelExtent,\n" +
	"\t\tdocOrigin: docOrigin, minScale: minScale, maxScale: maxScale,\n" +
	"\t\tnoteMapSized: noteMapSized,\n" +
	"\t\tgetPendingView: function () { return pendingView; },\n" +
	// The open path believes a pending view only for the project it was read for (Task 629's
	// stamp), and a harness that never names a project would never exercise the ACCEPT path.
	"\t\tsetOpenId: function (id) { library.openId = id; },\n" +
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

const TOM_VIEW = { cx: 835.390625, cy: -4957.78125, s: 5.322222222222222 };
const BAD = JSON.parse(fs.readFileSync(path.join(__dirname, 'net3-world-bad-view.lwn'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
// The file states an ABSOLUTE camera in the Cartesian frame; the page works in the LOCAL,
// origin-shifted, Y-down one. Reproduce that conversion rather than typing numbers in.
const toLocal = (v, org) => ({ cx: v.cx - org.x, cy: -(v.cy - org.y), s: v.s });
const toStored = (v, org) => ({ cx: v.cx + org.x, cy: -v.cy + org.y, s: v.s });

// ---- 1. THE SPECIMEN, AND THE ARITHMETIC THAT CONDEMNS IT -----------------------------------
console.log('--- 1. Tom\'s measured camera, against the network it had to show ---');
{
	check(BAD.view.cx === TOM_VIEW.cx && BAD.view.cy === TOM_VIEW.cy && BAD.view.s === TOM_VIEW.s,
		'the fixture still carries the exact camera that was measured on the live specimen',
		JSON.stringify(BAD.view));

	const xs = BAD.nodes.map(n => n.x), ys = BAD.nodes.map(n => n.y);
	const lonSpan = Math.max(...xs) - Math.min(...xs);
	check(Math.abs(lonSpan - 0.0965) < 0.0005, 'a geographic Net3 spanning 0.0965 degrees of longitude',
		lonSpan.toFixed(6));

	L.applySaved(clone(BAD));
	check(L.isLatLonProject(), 'it installs as a geographic project');
	const ext = L.modelExtent();
	check(Math.abs(ext.h - 0.082) < 0.001,
		'...and 0.082 in the drawing frame north to south, which is Mercator y', ext.h.toFixed(6));
	const px = Math.max(ext.w, ext.h) * TOM_VIEW.s;
	check(px < 1, 'AT THAT SCALE THE WHOLE NETWORK IS UNDER ONE PIXEL',
		(ext.w * TOM_VIEW.s).toFixed(2) + ' px by ' + (ext.h * TOM_VIEW.s).toFixed(2) + ' px');

	check(L.getPendingView() === null,
		'SO applySaved() DECLINES IT: no view is pending, and the document is fitted instead');
}

// ---- 2. EACH FAILURE ON ITS OWN, AND WHICH ONE WAS INVISIBLE BEFORE -------------------------
//
// The specimen is two faults at once. A validator that only ever meets both together is a
// validator nobody knows the shape of, so each is put to it alone, on the same installed
// document, against a centre that is otherwise perfect.
console.log('--- 2. the three faults, one at a time ---');
{
	const org = L.docOrigin();
	const ext = L.modelExtent();
	const mid = { cx: (ext.minx + ext.maxx) / 2, cy: (ext.miny + ext.maxy) / 2 };
	const GOOD_S = 6478.75;   // the shipped geographic Net3 example's own scale

	// (a) THE SCALE, WITH THE CENTRE DEAD ON THE NETWORK. This is the leg Task 629's guard cannot
	// see: there is nothing wrong with where the camera points.
	const scaleOnly = { cx: mid.cx, cy: mid.cy, s: TOM_VIEW.s };
	check(L.applyView(scaleOnly) === true,
		'a camera on target at the fatal scale passes the older reachability guard');
	check(L.viewShowsModel(scaleOnly) === false,
		'2a THE SCALE ALONE IS REFUSED: the model would draw under four pixels');

	// (b) THE LATITUDE, ALONE. outwardY() saturates, so the older guard tests longitude only and
	// says so; this is the axis that pinned Tom's status readout at -90.
	const latOnly = toLocal({ cx: toStored(mid, org).cx, cy: 4000, s: GOOD_S }, org);
	check(L.applyView(latOnly) === true, 'an off-world LATITUDE passes the older guard, which tests longitude');
	check(L.viewShowsModel(latOnly) === false, '2b THE LATITUDE ALONE IS REFUSED: 4000 is 22 worlds north');

	// (c) THE LONGITUDE, ALONE. Both agree here, which is the one overlap and is deliberate.
	const lonOnly = toLocal({ cx: 700, cy: toStored(mid, org).cy, s: GOOD_S }, org);
	check(L.viewShowsModel(lonOnly) === false, '2c the longitude alone is refused as well', '700 degrees east');

	// (d) ON EARTH, AT A USABLE SCALE, AND POINTED SOMEWHERE ELSE. Nothing saturates and nothing
	// is sub-pixel; the window simply cannot reach the network.
	const away = { cx: mid.cx + 5, cy: mid.cy, s: GOOD_S };
	const halfDeg = (CANVAS_W / 2) / GOOD_S;
	check(halfDeg < 5, 'the canvas at that scale is a fifth of a degree wide', halfDeg.toFixed(4) + ' degrees');
	check(L.viewShowsModel(away) === false,
		'2d A CAMERA FIVE DEGREES OFF IS REFUSED: the window cannot intersect the model');
}

// ---- 3. AND A HEALTHY VIEW IS LEFT COMPLETELY ALONE -----------------------------------------
//
// The half that matters. Three good cameras over the same network -- centred, zoomed in, and
// off-centre but still overlapping -- and the first is carried through the whole open path and
// compared bit for bit with what the file asked for.
console.log('--- 3. a healthy camera survives the door untouched ---');
{
	const org = L.docOrigin();
	const ext = L.modelExtent();
	const mid = { cx: (ext.minx + ext.maxx) / 2, cy: (ext.miny + ext.maxy) / 2, s: 6478.75 };

	const healthy = clone(BAD);
	healthy.view = toStored(mid, org);
	L.setOpenId('healthy-net3');
	L.applySaved(healthy);
	const pend = L.getPendingView();
	check(!!pend, 'the view is pending rather than declined');
	check(pend === healthy.view,
		'...and it is the FILE\'S OWN view object: the check rewrote nothing on its way past');
	check(pend && Math.abs(pend.cx - mid.cx) < 1e-12 && Math.abs(pend.cy - mid.cy) < 1e-12
		&& pend.s === mid.s,
		'...carrying the numbers the file stated', pend && JSON.stringify(pend));

	L.refreshAllFromDocument();
	const now = L.currentView();
	check(!!now && Math.abs(now.cx - mid.cx) < 1e-9 && Math.abs(now.cy - mid.cy) < 1e-9,
		'THE OPEN PATH INSTALLS THAT CAMERA: no fit happened behind the user\'s back',
		now && (now.cx.toFixed(9) + ', ' + now.cy.toFixed(9)));
	check(!!now && now.s === mid.s, '...at the scale the file stated, exactly', now && String(now.s));

	check(L.viewShowsModel({ cx: mid.cx, cy: mid.cy, s: 40000 }) === true,
		'a camera zoomed in on one corner of the network is accepted', 's 40000');
	const edge = { cx: ext.maxx + 0.1, cy: mid.cy, s: 6478.75 };
	check(L.viewShowsModel(edge) === true,
		'...and so is one off to the side while the network is still in frame', '0.1 degrees past the east edge');
}

// ---- 4. THE XY GRID, WHICH HAS NO WORLD TO BE OUTSIDE OF ------------------------------------
//
// Two of the three legs are geographic. The other two must still hold for a plain grid project,
// and no grid view may be refused for being off a world it does not have.
console.log('--- 4. an XY grid project ---');
{
	function gridDoc(span, view) {
		return {
			v: BAD.v, project: { name: 'grid' }, nodes: [
				{ id: 'J1', type: 'junction', x: 0, y: 0 },
				{ id: 'J2', type: 'junction', x: span, y: span }
			], links: [], labels: [], view: view
		};
	}
	L.applySaved(gridDoc(100, { cx: 50, cy: 50, s: 5 }));
	check(!L.isLatLonProject(), 'the project installed as a grid');
	check(!!L.getPendingView(), 'a sane grid camera is accepted', '100 units at 5 px per unit');

	L.applySaved(gridDoc(100, { cx: 50, cy: 50, s: 0.02 }));
	check(!!L.getPendingView(),
		'a scale applyView() would RAISE is judged at the raised scale, not the stated one',
		'0.02 clamped to minScale ' + L.minScale());

	L.applySaved(gridDoc(0.5, { cx: 0.25, cy: 0.25, s: 1 }));
	check(L.getPendingView() === null,
		'a grid model that would draw half a pixel is refused exactly as the geographic one is');

	L.applySaved(gridDoc(100, { cx: 5000, cy: 50, s: 5 }));
	check(L.getPendingView() === null, 'and so is a grid camera 5,000 units away from the drawing');

	// Nothing to show is nothing to be wrong about: an empty document's camera is its own business.
	L.applySaved({ v: BAD.v, project: { name: 'empty' }, nodes: [], links: [], labels: [],
		view: { cx: 958, cy: 4999, s: 1 } });
	check(!!L.getPendingView(), 'an empty document keeps whatever camera it states');
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);

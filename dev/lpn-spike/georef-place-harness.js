// Converting an XY project to a GeoMap one, through the PAGE -- ROADMAP Task 145.
//
//   node dev/lpn-spike/georef-place-harness.js
//
// dev/lpn-spike/georef-harness.js checks the arithmetic in js/lpn-georef.js. This one checks the
// three things only the integration can get wrong, and each of them is silent in a browser:
//
//   1. **CANCEL IS EXACT.** The tool holds the source coordinates aside and re-derives every point
//      from them, so a hundred drags must compound no error at all. `===`, not a tolerance -- the
//      same standard CLAUDE.md's number rule sets for an imported file, and for the same reason:
//      anything looser cannot tell "put back" from "put back nearly".
//   2. **NOTHING BUT THE COORDINATES MOVES.** Lengths, diameters, elevations and demands are the
//      user's numbers. Scaling the picture must not redesign the network, which is exactly what a
//      derived length would do.
//   3. **THE SIZE THE USER GAVE IS THE SIZE ON THE GROUND.** A schematic drawing declares no scale
//      at all (Tom, 2026-08-18), so the tool has to FIND one: Go to… asks how wide the site is, and
//      the model must come out that wide. Measured with the real geodesic, not with the transform's
//      own arithmetic -- a check that used the transform to grade itself would agree with itself no
//      matter what the scale was.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, FT } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

let confirmAnswer = true;
global.confirm = global.window.confirm = function () { return confirmAnswer; };
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgeorefStart: georefStart, georefAttach: georefAttach, georefDetach: georefDetach,\n" +
	"\t\tgeorefGoTo: georefGoTo, georefBounds: georefSrcBounds,\n" +
	"\t\tgeorefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	"\t\tgeorefSetTransform: georefSetTransform,\n" +
	"\t\tgeorefCentre: georefSrcCentre, georefCorners: georefCornersSrc,\n" +
	"\t\tparseLatLon: parseLatLon,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	// The drawing's own group, exactly as init() builds it: holding the model still while the map
	// moves is a transform on THIS, and a stub without it cannot see step 1 at all.
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
// currentView() measures the CANVAS, and the shared stub's elements carry no layout box. Without
// this the tool correctly refuses to drop (there is no view to drop into) and the whole flow is
// untestable -- the stub failure CLAUDE.md names, where the quantity the real thing varies is held
// at zero. 1000x500 matches the stub's own getBoundingClientRect().
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A small grid network in US units, so one drawing unit is one FOOT by declaration.
setUnitSet('us');
const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1000, 0);
const B = L.addNode('junction', 1000, -800);   // internal y is DOWN, so this is 800 ft NORTH
// addNode() defaults an elevation but never a demand, and a map label for a field that is on with
// no value behind it is an undefined reaching toFixed(). Seeding them is what a user typing into the
// popup would do.
A._demand = 120; B._demand = 80; R._head = 250;
const P1 = L.addLink('pipe', R.id, A.id);
const P2 = L.addLink('pipe', A.id, B.id);
const doc = L.getDoc();

// The state the whole test is about putting back.
const before = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
const lengthsBefore = JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto]));
const elevBefore = JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand]));

// ---------------------------------------------------------------------------
// 1. Start, carry, drop.
// ---------------------------------------------------------------------------
console.log('\n--- the model is detached on the screen, then attached to the ground ---');
L.georefStart();
{
	const g = L.georefState();
	ok('the tool opens in step 1, detached', !!g && g.step === 1, g && g.step);
	ok('the project now says it is on the world map', L.getProject().coords === 'geo');
	// The model is drawn as ITSELF from the first frame, so its coordinates are already lon/lat --
	// the old ghost-box stage, where the document still held grid numbers, is gone.
	ok('...and every coordinate is already a plausible longitude and latitude',
		doc.nodes.every(n => Math.abs(L.outwardX(n.x)) <= 180 && Math.abs(L.outwardY(n.y)) <= 90),
		doc.nodes.map(n => L.outwardX(n.x).toFixed(4) + ',' + L.outwardY(n.y).toFixed(4)).join(' '));
	ok('the model is held still on the screen, which it needs a frozen view to do',
		!!g.frozen && isFinite(g.frozen.s), JSON.stringify(g && g.frozen));
}

// **THE SCALE IS ASKED FOR, NOT READ.** Go to… takes a coordinate and a rough width, and that width
// is what the model must measure on the ground afterwards. 3000 ft across a drawing 1000 units wide
// is 3 ft per unit, and nothing in the drawing said so.
const SITE = { lat: 38.106067, lon: -122.5686103 };
L.georefGoTo(SITE, 3000 * FT);
{
	const g = L.georefState();
	ok('Go to… sets the scale from the width the user gave',
		Math.abs(g.t.metersPerUnit - 3 * FT) < 1e-9, g.t.metersPerUnit + ' m per unit');
}

L.georefAttach();
{
	const g = L.georefState();
	ok('Drop it here moves to step 2, attached', !!g && g.step === 2, g && g.step);
}

// ---------------------------------------------------------------------------
// 2. The model is the right size on the ground, and its north is north.
// ---------------------------------------------------------------------------
console.log('\n--- and it is the size the user said it was ---');
{
	// js/lpn-geom.js publishes through module.exports, so the geodesic comes off the required
	// module rather than off the page's global EngCalcs.
	const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;
	function ground(a, b) {
		return Geom.geodesicMeters(L.outwardX(a.x), L.outwardY(a.y),
			L.outwardX(b.x), L.outwardY(b.y));
	}
	const r = doc.nodes.find(n => n.id === R.id), a = doc.nodes.find(n => n.id === A.id),
		b = doc.nodes.find(n => n.id === B.id);
	// 1000 drawing units east, at the 3 ft per unit the user's own 3000 ft answer implies.
	const east = ground(r, a) / FT;
	ok('1000 units across the drawing is the 3000 ft the user said it was',
		Math.abs(east - 3000) < 0.6, east.toFixed(3) + ' ft');
	const north = ground(a, b) / FT;
	ok('800 units up the drawing is 2400 ft on the ground, at the same scale',
		Math.abs(north - 2400) < 0.6, north.toFixed(3) + ' ft');
	// **UP THE DRAWING IS NORTH.** The document stores y DOWN, so a tool that forgot the flip
	// mirrors the whole network -- and a symmetric test network would never show it.
	ok('up the drawing is NORTH, not south', L.outwardY(b.y) > L.outwardY(a.y),
		L.outwardY(a.y).toFixed(6) + ' -> ' + L.outwardY(b.y).toFixed(6));
}

// ---------------------------------------------------------------------------
// 3. Nothing but the coordinates moved.
// ---------------------------------------------------------------------------
console.log('\n--- and nothing else about the network changed ---');
ok('pipe lengths, diameters and the Auto flag are untouched',
	JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto])) === lengthsBefore);
ok('elevations and demands are untouched',
	JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand])) === elevBefore);

// ---------------------------------------------------------------------------
// 4. Scale, turn, and move -- then cancel, exactly.
// ---------------------------------------------------------------------------
console.log('\n--- a hundred adjustments, then Cancel puts back the exact numbers ---');
{
	const g = L.georefState();
	const c = L.georefCentre();
	let t = g.t;
	for (let i = 0; i < 100; i++) {
		const ll = EngCalcs.lpnGeorefToLonLat(t, c.x, c.y);
		t = EngCalcs.lpnGeorefWithScale(t, 1.03, ll);
		t = EngCalcs.lpnGeorefWithRotation(t, 7, ll);
		t = EngCalcs.lpnGeorefWithTranslation(t, 0.0001, -0.0002);
		L.georefSetTransform(t);
	}
	ok('a hundred adjustments left the tool armed and consistent',
		!!L.georefState() && L.georefState().step === 2);
	ok('the scale really did change', Math.abs(L.georefState().t.metersPerUnit - FT) > FT,
		L.georefState().t.metersPerUnit + ' m per unit');
}

L.georefCancel();
ok('the tool is gone', L.georefState() === null);
ok('the project is an XY grid again', L.getProject().coords !== 'geo', L.getProject().coords);
// **`===`, NOT A TOLERANCE.** See the header.
ok('every coordinate is the EXACT number it was before',
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === before,
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])));
ok('and every other number too',
	JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto])) === lengthsBefore);

// ---------------------------------------------------------------------------
// 5. Finish commits, and the tool refuses the cases it cannot serve.
// ---------------------------------------------------------------------------
console.log('\n--- Finish commits, and the refusals are refusals ---');
L.georefStart();
L.georefAttach();
const placed = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
L.georefFinish();
ok('Finish leaves no tool armed', L.georefState() === null);
ok('...the project stays on the world map', L.getProject().coords === 'geo');
ok('...and the placed coordinates are the ones that survive',
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === placed);

L.georefStart();
ok('a project already on the GeoMap is refused, not re-placed', L.georefState() === null);

// ---------------------------------------------------------------------------
// 6. The command stays FINDABLE, and the coordinate box takes what people paste.
// ---------------------------------------------------------------------------
// Tom, 2026-08-18: *"XY to World: I can't find it."* It had been HIDDEN on a project already on the
// map, which says "there is no such command" rather than "not for this project". Both properties are
// read out of the source, because neither is reachable from a headless document.
console.log('\n--- the command is findable, and a coordinate is what a map gives you ---');
{
	const lnSrc = require('fs').readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('the File-menu row is disabled, never hidden',
		/label: pc\.lpn_georef_menu[\s\S]{0,200}?disabled: isGeoProject\(\) \|\| georefActive\(\)/.test(lnSrc) &&
		!/hidden: isGeoProject\(\)[^\n]*lpn_georef_menu/.test(lnSrc));
	ok('...and it sits beside Import EPANET file, the other conversion',
		lnSrc.indexOf('pc.lpn_georef_menu') > lnSrc.indexOf('pc.lpn_file_import_inp') &&
		lnSrc.indexOf('pc.lpn_georef_menu') < lnSrc.indexOf('pc.lpn_file_export_inp'));
	// A GeoMap has to zoom out far enough to FIND a site, not just to look at one.
	ok('a GeoMap zooms out to the whole Earth', /return Math\.max\(MIN_SCALE_GRID, w \/ 360\);/.test(lnSrc));
}
{
	// LATITUDE FIRST, because that is the order every map on Earth hands you.
	const p = L.parseLatLon('38.106067, -122.5686103');
	ok('a pasted coordinate reads latitude first', !!p && p.lat === 38.106067 && p.lon === -122.5686103,
		JSON.stringify(p));
	ok('a space alone separates them too', !!L.parseLatLon('38.106 -122.569'));
	ok('an out-of-range pair is refused', L.parseLatLon('938, -122') === null);
	ok('prose is refused rather than half-read', L.parseLatLon('Petaluma') === null);
	// **THE DECIMAL COMMA, which was a SILENT wrong answer.** Most of our 26 languages write 38,106
	// for English's 38.106. A European paste separated by a space is unambiguous and must work; the
	// same paste separated by a comma yields four numbers, could be read two ways, and must be
	// REFUSED rather than guessed -- the first version travelled to 38 N 106 E with no message.
	var eu = L.parseLatLon('38,106 -122,569');
	ok('a decimal-comma coordinate separated by a space is read correctly',
		!!eu && Math.abs(eu.lat - 38.106) < 1e-9 && Math.abs(eu.lon + 122.569) < 1e-9, JSON.stringify(eu));
	// The exact string a decimal-comma locale produces from the tip's own example. It reads as the
	// European coordinate, which is what it means -- a comma inside a number binds tighter than a
	// comma between two, and no latitude has a thousands separator.
	var eu2 = L.parseLatLon('38,106, -122,569');
	ok('...and so is the tip\'s own example rendered in a decimal-comma locale',
		!!eu2 && Math.abs(eu2.lat - 38.106) < 1e-9 && Math.abs(eu2.lon + 122.569) < 1e-9,
		JSON.stringify(eu2));
	ok('three numbers is refused', L.parseLatLon('38.1 -122.5 17') === null);
	// A THOUSANDS separator makes three numbers and is refused rather than half-read.
	ok('a thousands separator is refused', L.parseLatLon('1,234.5 -122.5') === null,
		JSON.stringify(L.parseLatLon('1,234.5 -122.5')));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

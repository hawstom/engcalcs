// Putting an XY-grid project on the world map, through the PAGE -- ROADMAP Task 145.
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
//   3. **THE MODEL LANDS AT ITS TRUE GROUND SIZE**, because a grid project already declares that
//      one drawing unit is one Length/Map unit. Measured with the real geodesic, not with the
//      transform's own arithmetic -- a check that used the transform to grade itself would agree
//      with itself no matter what the scale was.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, FT } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

let confirmAnswer = true;
global.confirm = global.window.confirm = function () { return confirmAnswer; };
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgeorefStart: georefStart, georefDrop: georefDrop,\n" +
	"\t\tgeorefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	"\t\tgeorefSetTransform: georefSetTransform,\n" +
	"\t\tgeorefCentre: georefSrcCentre, georefCorners: georefCornersSrc,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
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
console.log('\n--- the model is carried onto the map and dropped ---');
L.georefStart();
{
	const g = L.georefState();
	ok('the tool is armed and carrying', !!g && g.stage === 'carry', g && g.stage);
	ok('the project now says it is on the world map', L.getProject().coords === 'geo');
	ok('...and the grid coordinates have NOT been touched yet',
		JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === before);
	// The scale is a DECLARATION being read: one drawing unit is one foot.
	ok('the scale is the grid\'s own declaration, not a guess',
		Math.abs(g.mpu - FT) < 1e-12, g.mpu + ' m per unit (1 ft = ' + FT + ')');
}

L.georefDrop();
{
	const g = L.georefState();
	ok('it is now placed and adjustable', !!g && g.stage === 'place', g && g.stage);
	ok('every coordinate is now a plausible longitude and latitude',
		doc.nodes.every(n => Math.abs(L.outwardX(n.x)) <= 180 && Math.abs(L.outwardY(n.y)) <= 90),
		doc.nodes.map(n => L.outwardX(n.x).toFixed(4) + ',' + L.outwardY(n.y).toFixed(4)).join(' '));
}

// ---------------------------------------------------------------------------
// 2. The model is the right size on the ground, and its north is north.
// ---------------------------------------------------------------------------
console.log('\n--- and it is the size it says it is ---');
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
	// 1000 drawing units east, declared as feet.
	const east = ground(r, a) / FT;
	ok('1000 units across the drawing is 1000 ft on the ground',
		Math.abs(east - 1000) < 0.2, east.toFixed(3) + ' ft');
	const north = ground(a, b) / FT;
	ok('800 units up the drawing is 800 ft on the ground',
		Math.abs(north - 800) < 0.2, north.toFixed(3) + ' ft');
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
		!!L.georefState() && L.georefState().stage === 'place');
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
L.georefDrop();
const placed = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
L.georefFinish();
ok('Finish leaves no tool armed', L.georefState() === null);
ok('...the project stays on the world map', L.getProject().coords === 'geo');
ok('...and the placed coordinates are the ones that survive',
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === placed);

L.georefStart();
ok('a project already on the world map is refused, not re-placed', L.georefState() === null);

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

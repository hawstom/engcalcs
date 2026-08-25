// What the georeferencing wizard CARRIES, and what it can give back -- ROADMAP Task 436.
//
//   node dev/lpn-spike/georef-carry-harness.js
//
// georef-place-harness.js checks that the network lands in the right place at the right size. This
// one checks the two things that were left out of it, and both are silent in a browser:
//
//   1. **THE BACKGROUND IMAGE COMES ALONG.** Tom, 2026-08-24: *"it didn't occur to me that anybody
//      would use a backdrop for a geographic project. They could."* A site plan is part of the
//      picture being placed. It is not in `doc` -- it is a module variable, kept out of the undo
//      snapshots because its data URI is megabytes -- so eachStoredPoint() cannot reach the live
//      one, and every pass that walks the document had to be told about it separately. TWO of them:
//      the wizard, and Task 439's rebaseLiveGeoDoc().
//   2. **FINISH IS UNDOABLE.** The snapshot is taken at georefStart(), before one number moves, so
//      Ctrl+Z gives back the drawing the user opened rather than a round trip through the transform
//      -- `===`, the same standard Cancel is held to.
//
// **THE IMAGE IS CHECKED AGAINST THE MODEL, NOT AGAINST A GROUND DISTANCE.** A backdrop's transform
// is translate + uniform scale, and the drawing frame is spherical Mercator at a geodetic latitude,
// so a doc unit north and a doc unit east are not exactly the same number of frame units (the ratio
// is M / N, the two WGS84 radii). The model carries that stretch and a uniformly-scaled picture
// cannot. What the user aligned the picture with is the DRAWING, so the drawing is what it is graded
// against: exact east-west, and the north-south residual is measured and printed rather than
// asserted away.

const { ROOT, byId, setUnitSet, loadLoopedNetwork, FT } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

let confirmAnswer = true;
global.confirm = global.window.confirm = function () { return confirmAnswer; };
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgeorefStart: georefStart, georefAttach: georefAttach,\n" +
	"\t\tgeorefGoTo: georefGoTo, georefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot,\n" +
	// applySaved() assigns the whole object exactly like this; there is no other way in that does
	// not need an image decoder.
	"\t\tsetBackdrop: function (b) { backdrop = b; }, getBackdrop: function () { return backdrop; },\n" +
	"\t\tviewNow: currentView, applyView: applyView,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, docOrigin: docOrigin,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;

setUnitSet('us');
const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1000, 0);
const B = L.addNode('junction', 1000, -800);   // internal y is DOWN, so 800 units NORTH of A
A._demand = 120; B._demand = 80; R._head = 250;
L.addLink('pipe', R.id, A.id);
L.addLink('pipe', A.id, B.id);
const doc = L.getDoc();

// **THE IMAGE IS PINNED TO THE MODEL, WHICH IS WHAT MAKES THIS MEASURABLE.** Its centre sits
// exactly on node A and its half-height is exactly the 800 units from A to B, so "did it come
// along" is a comparison against two nodes and not against a remembered number.
const IMG = { iw: 100, ih: 100, x: 0, y: 0, width: 1600, height: 1600 };
function freshBackdrop() {
	return {
		href: 'data:image/png;base64,AAAA', iw: IMG.iw, ih: IMG.ih,
		x: IMG.x, y: IMG.y, width: IMG.width, height: IMG.height,
		// centre on node A (internal 1000, 0)
		tx: 1000 - IMG.width / 2, ty: 0 - IMG.height / 2, s: 1
	};
}
L.setBackdrop(freshBackdrop());

// Where the image's centre and its top edge are, in the frame the page draws in.
function imgCentre() {
	const b = L.getBackdrop();
	return { x: b.tx + b.s * (b.x + b.width / 2), y: b.ty + b.s * (b.y + b.height / 2) };
}
function imgHalf() { const b = L.getBackdrop(); return b.s * b.width / 2; }

const nodesBefore = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
const bdBefore = JSON.stringify(L.getBackdrop());

// ---------------------------------------------------------------------------
// 1. The picture is carried onto the map with the drawing.
// ---------------------------------------------------------------------------
console.log('\n--- the background image is carried onto the map ---');
const SITE = { lat: 38.106067, lon: -122.5686103 };
L.georefStart();
ok('the wizard captured the image', !!L.georefState().bd, JSON.stringify(L.georefState().bd));
L.georefGoTo(SITE, 3000 * FT);   // 1000 units across is 3000 ft, so 3 ft per drawing unit
L.georefAttach();
{
	const a = doc.nodes.find(n => n.id === A.id), b = doc.nodes.find(n => n.id === B.id);
	const c = imgCentre();
	// **POSITION: the centre is still on node A**, in lon/lat now rather than in grid units.
	const dLon = Math.abs(L.outwardX(c.x) - L.outwardX(a.x)),
		dLat = Math.abs(L.outwardY(c.y) - L.outwardY(a.y));
	ok('the image centre is still exactly on the node it was centred on',
		dLon < 1e-9 && dLat < 1e-9, dLon.toExponential(2) + ' lon, ' + dLat.toExponential(2) + ' lat');
	// **SIZE, EAST-WEST: exact.** The model's R-to-A leg is 1000 units and the image's half-width is
	// 800, so the ratio is a number this test knows without asking the transform.
	const modelEast = Math.abs(a.x - doc.nodes.find(n => n.id === R.id).x);
	const relE = Math.abs(imgHalf() / modelEast - 800 / 1000);
	ok('...and 800 drawing units of picture is 800 drawing units of model, east-west',
		relE < 1e-12, relE.toExponential(2) + ' relative');
	// **SIZE, NORTH-SOUTH: the M / N residual, measured.** See the header.
	const modelNorth = Math.abs(b.y - a.y), imgNorth = imgHalf();
	const resid = imgNorth / modelNorth - 1;
	ok('...and north-south it is short by the M / N residual and no more',
		Math.abs(resid) < 0.006, (resid * 100).toFixed(3) + '% at latitude 38');
	// It is a REAL carry, not a coincidence of a picture that never moved.
	ok('the image really was rescaled -- it is not sitting at its grid numbers',
		Math.abs(L.getBackdrop().s - 1) > 0.99, L.getBackdrop().s);
	// And the ground size is the one the scale implies: 1600 units at 3 ft per unit is 4800 ft.
	// Measured with the real geodesic, so the transform is not grading itself.
	const w = Geom.geodesicMeters(
		L.outwardX(c.x - imgHalf()), L.outwardY(c.y), L.outwardX(c.x + imgHalf()), L.outwardY(c.y)) / FT;
	ok('...and on the ground the picture is the width the drawing scale says',
		Math.abs(w - 4800) < 5, w.toFixed(1) + ' ft');
}

// ---------------------------------------------------------------------------
// 2. Cancel puts the picture back, exactly.
// ---------------------------------------------------------------------------
console.log('\n--- Cancel puts the picture back exactly, like every other number ---');
L.georefCancel();
ok('the project is an XY grid again', L.getProject().coords !== 'geo', L.getProject().coords);
ok('every coordinate is the EXACT number it was', JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === nodesBefore);
ok('and the image is the EXACT placement it was',
	JSON.stringify(L.getBackdrop()) === bdBefore, JSON.stringify(L.getBackdrop()));
ok('Cancel leaves nothing on the undo stack', L.undoDepth() === 0, L.undoDepth());

// ---------------------------------------------------------------------------
// 3. Finish carries it through the rebase, which is a second pass that must know about it.
// ---------------------------------------------------------------------------
console.log('\n--- and through Task 439\'s rebase, which walks `doc` and cannot see the image ---');
const gridView = L.viewNow();
L.georefStart();
L.georefGoTo(SITE, 3000 * FT);
L.georefAttach();
L.georefFinish();
{
	const a = doc.nodes.find(n => n.id === A.id);
	const c = imgCentre();
	ok('the origin really was rebased, so this is the pass that could lose the picture',
		L.docOrigin().x !== 0 || L.docOrigin().y !== 0, JSON.stringify(L.docOrigin()));
	const dLon = Math.abs(L.outwardX(c.x) - L.outwardX(a.x)),
		dLat = Math.abs(L.outwardY(c.y) - L.outwardY(a.y));
	ok('the image centre is still on its node after Finish',
		dLon < 1e-9 && dLat < 1e-9, dLon.toExponential(2) + ' lon, ' + dLat.toExponential(2) + ' lat');
}

// ---------------------------------------------------------------------------
// 4. Ctrl+Z after Finish gives the drawing back.
// ---------------------------------------------------------------------------
console.log('\n--- and Ctrl+Z after Finish gives the whole drawing back ---');
ok('Finish left exactly one snapshot on the stack', L.undoDepth() === 1, L.undoDepth());
L.undo();
ok('the project is an XY grid again', L.getProject().coords !== 'geo', L.getProject().coords);
{
	// A NEW `doc` object comes back out of the snapshot, so read it fresh.
	const d2 = L.getDoc();
	ok('every coordinate is the EXACT number it was before the wizard ran',
		JSON.stringify(d2.nodes.map(n => [n.id, n.x, n.y])) === nodesBefore,
		JSON.stringify(d2.nodes.map(n => [n.id, n.x, n.y])));
	ok('the origin is back to the grid document\'s own',
		L.docOrigin().x === 0 && L.docOrigin().y === 0, JSON.stringify(L.docOrigin()));
	ok('and the image is back at the EXACT placement it had',
		JSON.stringify(L.getBackdrop()) === bdBefore, JSON.stringify(L.getBackdrop()));
	// **THE CAMERA COMES BACK TOO, AND ONLY HERE.** A view is a point in one frame and nonsense in
	// the other: without this the restored grid drawing sits off screen under a lat/lon view.
	const v = L.viewNow();
	ok('the camera is back in the frame the drawing is in',
		!!v && !!gridView && Math.abs(v.cx - gridView.cx) < 1e-6 && Math.abs(v.cy - gridView.cy) < 1e-6
		&& Math.abs(v.s - gridView.s) < 1e-9,
		JSON.stringify(v) + ' vs ' + JSON.stringify(gridView));
}

// ---------------------------------------------------------------------------
// 5. An ordinary undo must NOT move the map.
// ---------------------------------------------------------------------------
// The view rides in every snapshot and is restored in almost none of them. Undoing a diameter that
// panned the map would be its own defect, and a harness that only tested the frame change would
// never see it.
console.log('\n--- but an ordinary undo leaves the camera alone ---');
{
	L.applyView({ cx: 500, cy: -400, s: 0.2 });
	const parked = L.viewNow();
	L.saveUndoSnapshot();
	const j = L.getDoc().nodes.find(n => n.id === A.id);
	j.elev = 1234;
	L.applyView({ cx: 900, cy: -100, s: 0.4 });
	L.undo();
	ok('the elevation came back', L.getDoc().nodes.find(n => n.id === A.id).elev !== 1234);
	const v = L.viewNow();
	ok('...and the map did not move to do it',
		Math.abs(v.cx - 900) < 1e-6 && Math.abs(v.cy + 100) < 1e-6,
		JSON.stringify(v) + ' (parked at ' + JSON.stringify(parked) + ')');
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

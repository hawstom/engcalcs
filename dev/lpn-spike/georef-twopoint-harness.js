// The TWO KNOWN POINTS door onto EngCalcs.lpnGeorefFromTwoPoints() -- ROADMAP Task 436.
//
//   node dev/lpn-spike/georef-twopoint-harness.js
//
// dev/lpn-spike/georef-harness.js already proves the arithmetic of fromTwoPoints(). That function
// had no interface at all until this task, so what is new -- and what only an integration test can
// see -- is the DOOR:
//
//   1. **THE BUTTON IS REAL AND ITS LISTENER IS THE SHIPPED ONE.** The bar is built in
//      Looped-Network.php and wired in georefWireBar(), so this harness creates the bar's ids in the
//      shared stub, calls the real georefWireBar(), and then fires the button's own registered click
//      handler. Nothing here calls georefTwoPointStart() directly -- a test that reached past the
//      button would pass with no button on the page, which is exactly the defect this task closed.
//   2. **A PICK IS A POINTERDOWN ON THE CANVAS, THROUGH georefPointerDown().** That is the function
//      the page's own pointerdown listener calls while the wizard is armed, and it is where the pick
//      has to win the press away from the body polygon that covers the whole model.
//   3. **THE TRANSFORM PUTS THE TWO NODES EXACTLY WHERE THE USER SAID THEY WERE.** Graded by asking
//      the document, in the OUTWARD frame -- the longitude and latitude the page reports and stores
//      -- and not by re-running the transform, which would agree with itself whatever it did.
//   4. **EVERY REFUSAL parseLatLon() ALREADY KNOWS.** Prose, one number, three numbers, a latitude
//      past the pole; plus the two this door owns: the same node twice, and a cancelled prompt.
//   5. **IT IS NOT A SECOND COMMIT PATH.** After a two-point placement the wizard is still in step 2
//      with nothing else about the network touched, Cancel is still `===`, and Finish still commits.

const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

// **THE BAR'S IDS ARE CREATED HERE, NOT IN THE SHARED STUB.** georefRefreshBar() and georefWireBar()
// both return at their first line when #lpn_georef_bar is missing, which is why no existing harness
// has ever exercised a control on this bar. They are ensured locally so that this harness gets the
// real wiring without changing what every other harness sees.
[
	'lpn_georef_bar', 'lpn_georef_step', 'lpn_georef_hint', 'lpn_georef_numbers',
	'lpn_georef_scale_in', 'lpn_georef_rot_in', 'lpn_georef_unit', 'lpn_georef_goto',
	'lpn_georef_asdeg', 'lpn_georef_twopt', 'lpn_georef_drop', 'lpn_georef_detach',
	'lpn_georef_finish', 'lpn_georef_cancel'
].forEach(ensure);

let promptQueue = [];
let promptSeen = [];
global.window.prompt = global.prompt = function (text) {
	promptSeen.push(String(text));
	return promptQueue.length ? promptQueue.shift() : null;
};
global.window.confirm = global.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgeorefStart: georefStart, georefAttach: georefAttach, georefDetach: georefDetach,\n" +
	"\t\tgeorefGoTo: georefGoTo, georefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	"\t\tgeorefWireBar: georefWireBar, georefRefreshBar: georefRefreshBar,\n" +
	"\t\tgeorefPointerDown: georefPointerDown,\n" +
	"\t\tviewState: function () { return state; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
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
function notice() { return byId.lpn_map_notice.textContent; }
function clickTwoPt() {
	(byId.lpn_georef_twopt._listeners.click || []).forEach(function (fn) { fn({ target: byId.lpn_georef_twopt }); });
}
// Where a node is being DRAWN, in client pixels. The stub's canvas rect starts at (0, 0), so this is
// the page's own `world * scale + translate` and nothing else -- the exact inverse of
// screenToWorld(), which is what georefPointerSrc() will run on the way back.
function screenOfNode(i) {
	const st = L.viewState(), n = L.getDoc().nodes[i];
	return { clientX: n.x * st.s + st.tx, clientY: n.y * st.s + st.ty, pointerId: 1 };
}
function pressNode(i) { return L.georefPointerDown(screenOfNode(i)); }

// A small L-shaped grid network -- L-shaped so a missing north-south flip cannot hide behind
// symmetry, the same reason dev/lpn-spike/georef-place-harness.js uses one.
setUnitSet('us');
const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1000, 0);
const B = L.addNode('junction', 1000, -800);   // internal y is DOWN, so this is 800 units NORTH
A._demand = 120; B._demand = 80; R._head = 250;
L.addLink('pipe', R.id, A.id);
L.addLink('pipe', A.id, B.id);
const doc = L.getDoc();

const before = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
const lengthsBefore = JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto]));
const elevBefore = JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand]));

// ---------------------------------------------------------------------------
// 1. The button exists, is wired, and belongs to step 2.
// ---------------------------------------------------------------------------
console.log('\n--- the door is a real button on the placement bar ---');
{
	const php = require('fs').readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	ok('Looped-Network.php carries #lpn_georef_twopt inside #lpn_georef_bar',
		php.indexOf('id="lpn_georef_bar"') >= 0 &&
		php.indexOf('id="lpn_georef_twopt"') > php.indexOf('id="lpn_georef_bar"') &&
		php.indexOf('id="lpn_georef_twopt"') < php.indexOf('id="lpn_georef_cancel"'));
}
L.georefWireBar();
ok('...and georefWireBar() registered a listener on it',
	(byId.lpn_georef_twopt._listeners.click || []).length === 1);

L.georefStart();
ok('the wizard opens in step 1', L.georefState() && L.georefState().step === 1);
ok('...where the two-point button is HIDDEN, because a pick cannot be read while the model is held still',
	byId.lpn_georef_twopt.style.display === 'none', byId.lpn_georef_twopt.style.display);
clickTwoPt();
ok('...and pressing it there arms nothing', !L.georefState().pick);

const SITE = { lat: 38.106067, lon: -122.5686103 };
L.georefGoTo(SITE, 3000 * 0.3048);
L.georefAttach();
ok('step 2 shows the button', byId.lpn_georef_twopt.style.display === '',
	JSON.stringify(byId.lpn_georef_twopt.style.display));

// ---------------------------------------------------------------------------
// 2. The refusals, before the success -- so a pass cannot be an accident of ordering.
// ---------------------------------------------------------------------------
console.log('\n--- what it refuses ---');
clickTwoPt();
ok('the button arms the pick', !!L.georefState().pick);
ok('...and says what to click', notice().indexOf('Click a point') === 0, notice());

const beforeRefusals = JSON.stringify(L.georefState().t);

// parseLatLon()'s own refusals, each reaching this door through the same prompt.
[
	['prose', 'somewhere near the tank'],
	['one number', '38.106'],
	['three numbers, which is what a thousands separator makes', '1,234.5 -122.5'],
	['a latitude past the pole', '138 -122'],
	['a longitude past the antimeridian', '38 -222']
].forEach(function (c) {
	promptQueue = [c[1]];
	pressNode(1);
	ok('refused: ' + c[0], L.georefState().pick.pts.length === 0 &&
		notice().indexOf('not one latitude and one longitude') > 0, notice());
});
ok('...and every refusal left the pick armed on the same point, so a typo costs one click',
	!!L.georefState().pick && L.georefState().pick.pts.length === 0);
ok('...and moved nothing', JSON.stringify(L.georefState().t) === beforeRefusals);

// The two this door owns. First: the same node twice.
promptQueue = ['38.106067 -122.5686103'];
pressNode(1);
ok('a good first point is taken', L.georefState().pick.pts.length === 1);
ok('...and the prompt named the node it snapped to',
	promptSeen[promptSeen.length - 1].indexOf('(' + A.id + ')') > 0, promptSeen[promptSeen.length - 1]);
ok('...and asks for the second one', notice().indexOf('second known point') > 0, notice());
promptQueue = ['38.2 -122.4'];
pressNode(1);
ok('the same point twice is refused by name',
	L.georefState().pick.pts.length === 1 && notice().indexOf('picked first') > 0, notice());
ok('...without even asking for a coordinate',
	promptSeen[promptSeen.length - 1].indexOf('(' + A.id + ')') > 0);

// Second: a cancelled prompt puts the tool down and says what you are back to.
promptQueue = [];   // the stub prompt answers null when the queue is empty
pressNode(2);
ok('cancelling the prompt disarms the pick', !L.georefState().pick);
ok('...and the notice is step 2\'s own instructions again',
	notice().indexOf('on the ground now') > 0, notice());

// ---------------------------------------------------------------------------
// 3. The placement itself.
// ---------------------------------------------------------------------------
console.log('\n--- two known points place the model exactly ---');
// Two real coordinates a surveyor might hand over: the reservoir at the corner of the site, and the
// far junction 1000 units east and 800 units north of it. They are NOT the placement the wizard
// currently holds -- Go to… put the model somewhere plausible and this moves it to the truth.
const P0 = { lat: 38.100000, lon: -122.560000 };
const P1 = { lat: 38.106500, lon: -122.548000 };
clickTwoPt();
promptQueue = ['38.1, -122.56'];              // a comma between them, which is what a map hands you
pressNode(0);
promptQueue = ['38,1065 -122,548'];           // and a decimal COMMA, which most of our languages write
pressNode(2);
ok('two points finish the pick', !L.georefState().pick);
ok('...and say so', notice().indexOf('two points you gave') > 0, notice());

{
	const n = doc.nodes;
	const dLat0 = Math.abs(L.outwardY(n[0].y) - P0.lat), dLon0 = Math.abs(L.outwardX(n[0].x) - P0.lon);
	const dLat1 = Math.abs(L.outwardY(n[2].y) - P1.lat), dLon1 = Math.abs(L.outwardX(n[2].x) - P1.lon);
	// 1e-9 degrees is about 0.1 mm. The residual is the mercY/mercLat round trip the drawing frame
	// costs, not the transform, which is exact at both control points by construction.
	ok('the first control point landed on the coordinate the user gave',
		dLat0 < 1e-9 && dLon0 < 1e-9, dLat0.toExponential(2) + ' / ' + dLon0.toExponential(2));
	ok('the second control point landed on the coordinate the user gave',
		dLat1 < 1e-9 && dLon1 < 1e-9, dLat1.toExponential(2) + ' / ' + dLon1.toExponential(2));
	// The third node was never named, and the whole claim of a similarity transform is that it comes
	// along rigidly. R->A is 1000 units east in the drawing and R->B is 1000 east and 800 north, so
	// B must sit north-east of A by exactly the drawing's own proportion.
	ok('the node nobody named came along rigidly, north of the one east of the origin',
		L.outwardY(n[2].y) > L.outwardY(n[1].y) && L.outwardX(n[1].x) > L.outwardX(n[0].x));
	// **AND THE SCALE IS THE ONE THE TWO POINTS IMPLY, not the one Go to… guessed.** The reservoir
	// and the far junction are 1281 drawing units apart; the ground distance between the two
	// coordinates given divided by that is what metersPerUnit must be, measured with js/lpn-geom.js's
	// own geodesic rather than with the transform's arithmetic.
	const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;
	const ground = Geom.geodesicMeters(P0.lon, P0.lat, P1.lon, P1.lat);
	const units = Math.hypot(1000 - 0, -800 - 0);
	const mpu = L.georefState().t.metersPerUnit;
	ok('the scale is the one the two points imply',
		Math.abs(mpu - ground / units) / (ground / units) < 2e-4,
		mpu.toFixed(6) + ' vs ' + (ground / units).toFixed(6) + ' m per unit');
	ok('...and it is NOT the scale Go to… had guessed',
		Math.abs(mpu - 3 * 0.3048) > 0.05, mpu.toFixed(6));
}

// ---------------------------------------------------------------------------
// 4. It is the same wizard, not a second one.
// ---------------------------------------------------------------------------
console.log('\n--- and it is not a second commit path ---');
ok('the wizard is still armed, still in step 2', L.georefState() && L.georefState().step === 2);
ok('nothing but the coordinates moved -- lengths, diameters, the Auto flag',
	JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto])) === lengthsBefore);
ok('...nor elevations and demands',
	JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand])) === elevBefore);

// Pick it up again puts the tool down with it, or a step-1 press would be read through a transform
// that no longer says where anything is drawn.
L.georefDetach();
ok('Pick it up again disarms any pick', !L.georefState().pick);
L.georefAttach();

L.georefCancel();
ok('Cancel after a two-point placement is still EXACT',
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === before,
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])));
ok('...and the project is an XY grid again', L.getProject().coords !== 'geo');

// And Finish still commits a two-point placement, through the one path it always used.
L.georefStart();
L.georefAttach();
clickTwoPt();
promptQueue = ['38.1 -122.56'];
pressNode(0);
promptQueue = ['38.1065 -122.548'];
pressNode(2);
const placed = JSON.stringify(doc.nodes.map(n => [n.id, L.outwardX(n.x), L.outwardY(n.y)]));
L.georefFinish();
ok('Finish commits a two-point placement and leaves no tool armed', L.georefState() === null);
ok('...on the world map', L.getProject().coords === 'geo');
ok('...with the two-point coordinates the ones that survive',
	JSON.stringify(doc.nodes.map(n => [n.id, L.outwardX(n.x), L.outwardY(n.y)])) === placed);

// ---------------------------------------------------------------------------
// 5. Every string it reads is a real key.
// ---------------------------------------------------------------------------
console.log('\n--- and every sentence it says is a language key ---');
{
	const fs = require('fs');
	const lang = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const keys = ['lpn_georef_twopt', 'lpn_georef_twopt_tip', 'lpn_georef_twopt_pick1',
		'lpn_georef_twopt_pick2', 'lpn_georef_twopt_same', 'lpn_georef_twopt_done'];
	keys.forEach(function (k) {
		ok(k + ' exists in lang.ec.en.php', lang.indexOf("$ec_lang['" + k + "']='") >= 0);
	});
	// The two the PHP renders and the four the JS reads are disjoint, and each set has to reach its
	// own consumer: a pageConfig entry for a key only PHP renders would be dead weight, and a missing
	// one for a key the JS reads is the "undefined" a visitor sees.
	['lpn_georef_twopt', 'lpn_georef_twopt_tip'].forEach(function (k) {
		ok(k + ' is rendered by Looped-Network.php', php.indexOf("$ec_lang['" + k + "']") >= 0);
	});
	['lpn_georef_twopt_pick1', 'lpn_georef_twopt_pick2', 'lpn_georef_twopt_same',
		'lpn_georef_twopt_done'].forEach(function (k) {
		ok(k + ' is read from pageConfig and emitted into it',
			js.indexOf('pc.' + k) >= 0 && php.indexOf('\t' + k + ':') >= 0);
	});
	// **parseLatLon() IS THE ONLY READER.** A second one here would be a second chance to get a
	// decimal comma wrong; the door is asserted to go through the one that is already guarded.
	const door = js.slice(js.indexOf('function georefTwoPointClick'));
	ok('the door reads its coordinate with parseLatLon() and reuses the Go to… prompt',
		/parseLatLon\(typed\)/.test(door.slice(0, 3000)) &&
		/pc\.lpn_goto_prompt/.test(door.slice(0, 3000)));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

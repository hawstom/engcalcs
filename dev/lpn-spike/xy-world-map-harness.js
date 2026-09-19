// THE CUSTOM GEOREFERENCE WIZARD, AND THE ONE THING IT MAY NOT DO -- ROADMAP Task 646.
//
//   node dev/lpn-spike/xy-world-map-harness.js
//
// Tom, 2026-09-18, in three steps: *"(1) Show the world map with our project in the middle of the
// Atlantic Ocean or near Nigeria (0,0)... Let the user Zoom and Pan, Search by name, or use Goto to
// find the location of their project on the world map. When they are happy, they 'Place
// approximately'. (2) We show a drag, scale rotate rectangle/square that controls the world map,
// not their project... Then they click 'Georeference here'. (3) We show 'unnamed' in the map status
// bar."*
//
// **THE ACCEPTANCE CRITERION IS BYTE IDENTITY, NOT A TOLERANCE**, exactly as it is for an `.inp`
// round trip in inp-export-harness.js. CLAUDE.md's absolute rule is that only the user touches a
// file's numbers; the placement wizard beside this one (georefStart) rewrites every coordinate in
// the document, and this door is safe only while it writes nothing at all. So what is compared here
// is the WHOLE SERIALIZED PROJECT -- the bytes that would be saved -- before the wizard, at every
// step of it, after Georeference here and after Remove, with only the `project.georef` declaration
// itself allowed to differ.
//
// **AND THE PLACEMENT HAS TO BE WORTH SOMETHING, or a no-op would pass every assertion above.** So
// the transform is graded too: the middle of the drawing lands where Go to was told, a corner drag
// scales the map about the OPPOSITE corner and leaves that corner's ground point exactly where it
// was, and a turn of the handle turns the map and nothing else. Those are read through
// js/lpn-georef.js, which is the same arithmetic the tiles are placed with.
//
// **THE MUTATION LEG IS A SECOND RUN, NOT AN ASSERTION.** `XY_WORLD_MAP_MUTATE=1` patches the page
// source so that every frame of the wizard moves one node by a hair, and the run must go RED. A
// harness whose invariant is "nothing changed" passes trivially if it is comparing the wrong thing,
// which is the failure mode this exists to rule out.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };
global.prompt = global.window.prompt = function () { return null; };

const MUTATE = process.env.XY_WORLD_MAP_MUTATE === '1';

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\tremoveMapAttach: removeMapAttach, crsDisplayName: crsDisplayName,\n" +
	"\t\txyGeoref: xyGeoref, xyGeorefOk: xyGeorefOk, xyMapAttachable: xyMapAttachable,\n" +
	"\t\tbasemapOn: basemapOn, basemapChoosable: basemapChoosable,\n" +
	"\t\tmapMenuRows: mapMenuRows,\n" +
	"\t\tmapgeoStart: mapgeoStart, mapgeoPlace: mapgeoPlaceApproximately,\n" +
	"\t\tmapgeoFinish: mapgeoFinish, mapgeoCancel: mapgeoCancel,\n" +
	"\t\tmapgeoActive: mapgeoActive, mapgeoGoTo: mapgeoGoTo, mapgeoZoom: mapgeoZoomAbout,\n" +
	"\t\tmapgeoApplyDrag: mapgeoApplyDrag, mapgeoRectSrc: mapgeoRectSrc,\n" +
	"\t\tmapgeoStep: function () { return mapgeo && mapgeo.step; },\n" +
	"\t\tsetDrag: function (d) { drag = d; },\n" +
	// The REAL gesture path, so the pan Tom asked about is driven the way a hand drives it rather
	// than by handing mapgeoApplyDrag() a drag record this file built. Every assertion about the
	// rectangle below goes past mapgeoPointerDown(); nothing did until step 1's pan needed it.
	"\t\tgetDrag: function () { return drag; },\n" +
	"\t\twirePointerEvents: wirePointerEvents,\n" +
	"\t\twheelZoom: wheelZoom,\n" +
	"\t\tmapgeoAdjust: mapgeoAdjust, mapgeoScaleFrom: mapgeoScaleFromCurrent,\n" +
	"\t\tmapgeoRows: mapgeoRows, backdropRows: backdropRows,\n" +
	// One frame of the drag loop. tick() is a requestAnimationFrame chain in the page; here the
	// frame is asked for explicitly so a harness assertion is about the gesture and not about
	// whether an animation frame happened to land.
	"\t\tpumpDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; return true; } return false; },\n" +
	// Screen point of a point in the drawing's own OUTWARD coordinates, which is the inverse of
	// screenToWorld() at the stub's canvas origin. A gesture is aimed in ground terms here, so the
	// assertions can say where the pointer went rather than which pixel it was.
	"\t\tscreenOf: function (ox, oy) {\n" +
	"\t\t\treturn { x: inwardX(ox) * state.s + state.tx, y: inwardY(oy) * state.s + state.ty }; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, ",
	null,
	MUTATE ? function (src) {
		// ONE NODE, ONE ULP-ISH NUDGE, ON EVERY FRAME OF THE WIZARD -- the smallest thing this
		// harness must still catch, and the shape the defect would really take: a coordinate
		// rewritten by a placement that is not quite the identity.
		//
		// **NOT nodes[0]**: the first node of this fixture sits at the origin, and a multiplicative
		// nudge of zero is zero. A mutation that cannot change anything proves nothing about the
		// harness, and the first run of this leg said exactly that.
		return src.replace(
			'\t\tproject.georef = t;\n\t\trefreshBasemap();',
			'\t\tif (doc.nodes[1]) { doc.nodes[1].x = doc.nodes[1].x * (1 + 1e-12); }\n' +
			'\t\tproject.georef = t;\n\t\trefreshBasemap();');
	} : null
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');

// An ordinary grid drawing: numbers somebody typed, in feet, meaning nothing geographic. Internal
// y is DOWN, so -800 is 800 units NORTH.
const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1234.5, -200.25);
const B = L.addNode('junction', 2000, -800);
R._head = 250; A._demand = 120; B._demand = 80;
L.addLink('pipe', R.id, A.id);
const P2 = L.addLink('pipe', A.id, B.id);
// A vertex and a free text label, so the comparison covers more than doc.nodes.
P2.vs = [{ x: 1600, y: -500.125 }];
const doc = L.getDoc();
doc.labels.push({ id: 'T1', x: 900, y: -100, text: 'Elm Street' });

// **WHAT IS COMPARED: the saved bytes, minus the declaration this feature is allowed to add.**
// Reading the coordinates out node by node would be a second opinion about which numbers the file
// holds; the serializer is the only one that counts, because it is what a colleague opens.
function snapshot() {
	const s = JSON.parse(JSON.stringify(L.serialize()));
	delete s.project.georef;
	delete s.project.basemap;
	return JSON.stringify(s);
}

const G = global.EngCalcs;
const before = snapshot();
const bMinX = 0, bMaxX = 2000, bMinY = 0, bMaxY = 800;   // outward, y-up
const midX = (bMinX + bMaxX) / 2, midY = (bMinY + bMaxY) / 2;

ok('an xy grid project is offered the wizard', L.xyMapAttachable() === true);
ok('and has no georeferencing to start with', L.xyGeorefOk() === false);

// ---- STEP 1: the whole world, and the drawing in the Gulf of Guinea ---------------------------
L.mapgeoStart();
ok('the wizard is running', L.mapgeoActive() === true);
ok('and it opens at step 1', L.mapgeoStep() === 1);
ok('the tiles are switched on', L.basemapOn() === true);
ok('the street map and satellite rows now appear', L.basemapChoosable() === true);

let t = L.xyGeoref();
let mid = G.lpnGeorefToLonLat(t, midX, midY);
ok('the drawing starts at zero latitude and zero longitude',
	Math.abs(mid.lat) < 1e-9 && Math.abs(mid.lon) < 1e-9, mid.lat + ', ' + mid.lon);
ok('and it starts the whole world wide',
	Math.abs(t.metersPerUnit * Math.max(bMaxX - bMinX, bMaxY - bMinY) - 40075017) < 1,
	(t.metersPerUnit * 2000).toFixed(0) + ' m');
ok('STEP 1 CHANGES NOT ONE STORED BYTE', snapshot() === before);

// Go to, which in this wizard moves the GROUND and not the camera. Petaluma, California.
const LAT = 38.2324, LON = -122.6367;
L.mapgeoGoTo({ lat: LAT, lon: LON });
t = L.xyGeoref();
mid = G.lpnGeorefToLonLat(t, midX, midY);
ok('Go to puts the middle of the drawing on the typed latitude',
	Math.abs(mid.lat - LAT) < 1e-9, mid.lat);
ok('...and on the typed longitude', Math.abs(mid.lon - LON) < 1e-9, mid.lon);

// The wheel, spent on the map. Zooming the map IN by two halves the ground a drawing unit covers.
const mpuBeforeZoom = t.metersPerUnit;
const midScreen = L.screenOf(midX, midY);
L.mapgeoZoom(midScreen.x, midScreen.y, 2);
t = L.xyGeoref();
ok('a wheel zoom halves the ground under one drawing unit',
	Math.abs(t.metersPerUnit - mpuBeforeZoom / 2) < 1e-9 * mpuBeforeZoom, t.metersPerUnit);
mid = G.lpnGeorefToLonLat(t, midX, midY);
ok('...about the point under the pointer, which does not move',
	Math.abs(mid.lat - LAT) < 1e-9 && Math.abs(mid.lon - LON) < 1e-9);
ok('STEP 1 STILL CHANGES NOT ONE STORED BYTE', snapshot() === before);

// ---- STEP 2: the rectangle that controls the map -----------------------------------------------
L.mapgeoPlace();
ok('Place approximately moves to step 2', L.mapgeoStep() === 2);
let rect = L.mapgeoRectSrc();
ok('and the rectangle starts on the drawing itself',
	rect && Math.abs(rect[0].x - bMinX) < 1e-6 && Math.abs(rect[2].y - bMaxY) < 1e-6);

// A CORNER DRAG scales the map about the opposite corner. Grab the north-east corner (index 2) and
// pull it to twice its distance from the south-west one (index 0).
t = L.xyGeoref();
const pivot = rect[0], grab = rect[2];
const far = { x: pivot.x + (grab.x - pivot.x) * 2, y: pivot.y + (grab.y - pivot.y) * 2 };
const pivotGround = G.lpnGeorefToLonLat(t, pivot.x, pivot.y);
const mpuBeforeDrag = t.metersPerUnit;
L.setDrag({ type: 'mapgeo', kind: 'scale', corner: 2, t0: t, rect: rect,
	start: { x: grab.x, y: grab.y } });
L.mapgeoApplyDrag(L.screenOf(far.x, far.y));
t = L.xyGeoref();
ok('a corner drag of two halves the ground under one drawing unit',
	Math.abs(t.metersPerUnit - mpuBeforeDrag / 2) < 1e-9 * mpuBeforeDrag, t.metersPerUnit);
let back = G.lpnGeorefFromLonLat(t, pivotGround.lon, pivotGround.lat);
ok('...and the opposite corner of the ground stays exactly where it was',
	Math.abs(back.x - pivot.x) < 1e-6 && Math.abs(back.y - pivot.y) < 1e-6,
	back.x.toFixed(6) + ', ' + back.y.toFixed(6));

// THE TURN HANDLE. A quarter turn counterclockwise about the middle of the rectangle.
rect = L.mapgeoRectSrc();
t = L.xyGeoref();
const centre = { x: (rect[0].x + rect[2].x) / 2, y: (rect[0].y + rect[2].y) / 2 };
const centreGround = G.lpnGeorefToLonLat(t, centre.x, centre.y);
const rotBefore = t.rotDeg, armLen = 500;
L.setDrag({ type: 'mapgeo', kind: 'rotate', corner: -1, t0: t, rect: rect,
	start: { x: centre.x + armLen, y: centre.y } });
L.mapgeoApplyDrag(L.screenOf(centre.x, centre.y + armLen));
t = L.xyGeoref();
ok('turning the handle a quarter turn turns the map a quarter turn',
	Math.abs(t.rotDeg - (rotBefore - 90)) < 1e-6, t.rotDeg);
back = G.lpnGeorefFromLonLat(t, centreGround.lon, centreGround.lat);
ok('...about the middle of the rectangle, which does not move',
	Math.abs(back.x - centre.x) < 1e-6 && Math.abs(back.y - centre.y) < 1e-6);
ok('STEP 2 CHANGES NOT ONE STORED BYTE', snapshot() === before);

// ---- Georeference here -------------------------------------------------------------------------
const placed = JSON.parse(JSON.stringify(L.xyGeoref()));
L.mapgeoFinish();
ok('the wizard is finished', L.mapgeoActive() === false);
ok('and the georeferencing is on the project', L.xyGeorefOk() === true);
ok('GEOREFERENCE HERE CHANGES NOT ONE STORED BYTE', snapshot() === before,
	snapshot() === before ? '' : 'the saved project differs');
ok('the placement it keeps is the one on the screen',
	JSON.stringify(L.xyGeoref()) === JSON.stringify(placed));

// **(3) THE STATUS BAR SAYS `unnamed`** -- Tom's own third step, and the middle of three values.
const PC0 = global.EngCalcs.pageConfig || {};
ok('the map status reads unnamed once the world map is attached',
	L.crsDisplayName() === PC0.lpn_crs_unnamed, L.crsDisplayName());

// ---- and a cancelled second run puts the first one back ----------------------------------------
L.mapgeoStart();
L.mapgeoGoTo({ lat: -33.8688, lon: 151.2093 });
ok('the wizard moved the map away', JSON.stringify(L.xyGeoref()) !== JSON.stringify(placed));
L.mapgeoCancel();
ok('CANCEL PUTS THE EARLIER GEOREFERENCING BACK EXACTLY',
	JSON.stringify(L.xyGeoref()) === JSON.stringify(placed));
ok('and it changed not one stored byte either', snapshot() === before);

// ---- and it is reversible ----------------------------------------------------------------------
L.removeMapAttach();
ok('the georeferencing is gone', L.xyGeorefOk() === false);
ok('REMOVING LEAVES THE PROJECT EXACTLY AS IT WAS', snapshot() === before,
	snapshot() === before ? '' : 'the saved project differs');
ok('...and the map status goes back to saying it is not georeferenced',
	L.crsDisplayName() === PC0.lpn_crs_none, L.crsDisplayName());

// ---- THE MENU, AND IT IS THE BACKGROUND IMAGE SUBMENU'S SHAPE ---------------------------------
//
// Tom, 2026-09-18: *"Change Map, Custom georeference to Map, World map... (to be parallel with
// Background image). And can it have a submenu with Attach (at top), Move, Scale by picking, Scale
// from the current size..., Detach, similar to the Background map submenu."* PARALLELISM is the
// instruction, so the assertion is a comparison against the row it is meant to be parallel with --
// not a list of five literals, which would pass while the two submenus drifted apart.
{
	const top = L.mapMenuRows().filter(function (r) { return !r.hidden; });
	const world = top.find(function (r) { return r.label === PC0.lpn_map_attach_menu; });
	ok('the Map menu carries ONE world map row, and it opens a submenu',
		!!world && typeof world.submenu === 'function' && !world.fn,
		top.map(function (r) { return r.label; }).join(' | '));
	const image = top.find(function (r) { return r.label === PC0.lpn_backdrop_menu; });
	ok('...sitting beside the background image row, which is the row it is parallel with',
		!!image && Math.abs(top.indexOf(world) - top.indexOf(image)) === 1,
		top.map(function (r) { return r.label; }).join(' | '));
	ok('...and no top-level row is left over from the two it replaced',
		!top.some(function (r) { return r.label === PC0.lpn_map_attach_remove; }));
	const rows = world.submenu();
	ok('the submenu reads Attach, Move, Scale by picking, Scale from the current size, Detach',
		rows.map(function (r) { return r.label; }).join(' | ') ===
			[PC0.lpn_map_attach_add, PC0.lpn_map_attach_move, PC0.lpn_map_attach_scale,
				PC0.lpn_map_attach_scale_from, PC0.lpn_map_attach_remove].join(' | '),
		rows.map(function (r) { return r.label; }).join(' | '));
	// Every row but Attach is dead while nothing is attached -- GREYED, not gone, which is the
	// backdrop submenu's own rule: a row that comes and goes teaches nobody what the feature can do.
	ok('with nothing attached, Attach is live and every other row is greyed',
		rows[0].disabled !== true && rows.slice(1).every(function (r) { return r.disabled === true; }),
		rows.map(function (r) { return r.label + '=' + !!r.disabled; }).join(' | '));
	// **THE RULE IS WHAT IS PARALLEL, NOT THE ROW COUNT.** The background image submenu carries six
	// rows because a picture can be scaled from a world file as well as by picking, and a world map
	// has no such file; Tom named five and five is what this has. What both must share is the shape
	// a reader learns: the row that makes the thing is first and always live, and every row that
	// acts on the thing is greyed until there is one.
	const img = L.backdropRows();
	ok('...under the same rule the background image submenu follows, which is the parallel asked for',
		img[0].disabled !== true && img.slice(1).every(function (r) { return r.disabled === true; })
			&& rows[rows.length - 1].label === PC0.lpn_map_attach_remove
			&& img[img.length - 1].label === PC0.lpn_backdrop_remove,
		img.map(function (r) { return r.label + '=' + !!r.disabled; }).join(' | '));
}

// ---- AND THE FOUR NEW ROWS CHANGE NOT ONE STORED BYTE EITHER -----------------------------------
//
// The byte-identity criterion at the top of this file is the whole acceptance test for this
// feature, and the submenu added four more doors into the transform. Each is driven here, and the
// saved project is compared after every one.
L.mapgeoStart();
L.mapgeoGoTo({ lat: 44.0, lon: 7.0 });
L.mapgeoPlace();
L.mapgeoFinish();
const attached = JSON.stringify(L.xyGeoref());
ok('a map is attached again, so the fine adjustments have something to adjust',
	L.xyGeorefOk() === true);
ok('ATTACHING AGAIN CHANGED NOT ONE STORED BYTE', snapshot() === before);
{
	// MOVE: step 2 on the placement already on file, never a fresh one. The old transform has to
	// still be there -- a Move that threw the map back to 0 N 0 E would be a new placement wearing
	// the word Move.
	L.mapgeoAdjust('move');
	ok('Move opens the wizard at step 2', L.mapgeoActive() === true && L.mapgeoStep() === 2);
	ok('...on the placement that was already on file, not a fresh one',
		JSON.stringify(L.xyGeoref()) === attached, L.xyGeoref() && JSON.stringify(L.xyGeoref()));
	ok('...with the rectangle already round the drawing', !!L.mapgeoRectSrc());
	L.mapgeoCancel();
	ok('...and Cancel puts it back exactly', JSON.stringify(L.xyGeoref()) === attached);
	L.mapgeoAdjust('scale');
	ok('Scale by picking opens the same step 2, which is the same rectangle',
		L.mapgeoStep() === 2 && JSON.stringify(L.xyGeoref()) === attached);
	L.mapgeoCancel();
	ok('MOVE AND SCALE BY PICKING CHANGED NOT ONE STORED BYTE', snapshot() === before);
}
{
	// SCALE FROM THE CURRENT SIZE: a typed factor, applied at once, about the middle of the drawing.
	// No wizard, so no Cancel -- the way back is the same number the other way, or Detach.
	const t0 = L.xyGeoref(), mpu0 = t0.metersPerUnit;
	const mid0 = G.lpnGeorefToLonLat(t0, midX, midY);
	global.prompt = global.window.prompt = function () { return '2'; };
	L.mapgeoScaleFrom();
	let t2 = L.xyGeoref();
	ok('Scale from the current size halves the ground under one drawing unit at a factor of two',
		Math.abs(t2.metersPerUnit - mpu0 / 2) < 1e-9 * mpu0, t2.metersPerUnit);
	const mid2 = G.lpnGeorefToLonLat(t2, midX, midY);
	ok('...about the middle of the drawing, which does not move',
		Math.abs(mid2.lat - mid0.lat) < 1e-9 && Math.abs(mid2.lon - mid0.lon) < 1e-9,
		mid2.lat + ', ' + mid2.lon);
	ok('...and it opens no wizard at all', L.mapgeoActive() === false);
	ok('SCALE FROM THE CURRENT SIZE CHANGED NOT ONE STORED BYTE', snapshot() === before);
	// A refusal is a refusal: nothing typed, nothing zero, nothing negative reaches the transform.
	const kept = JSON.stringify(L.xyGeoref());
	const notice = () => (byId.lpn_map_notice || {}).textContent;
	let refused = 0;
	['0', '-1', 'abc', ''].forEach(function (bad) {
		global.prompt = global.window.prompt = function () { return bad; };
		byId.lpn_map_notice.textContent = '';
		L.mapgeoScaleFrom();
		if (notice() === PC0.lpn_map_attach_scale_from_bad) { refused++; }
	});
	global.prompt = global.window.prompt = function () { return null; };
	byId.lpn_map_notice.textContent = '';
	L.mapgeoScaleFrom();
	ok('...and a number it cannot use moves nothing, cancelling included',
		JSON.stringify(L.xyGeoref()) === kept);
	// **AND IT SAYS SO.** Asserting only that nothing moved would pass on a build that accepted the
	// number and let mapgeoScaled() quietly hand the old transform back -- the reader would have
	// typed an answer, watched nothing happen and been told nothing. Four bad answers, four
	// refusals; and cancelling is not one of them, because nothing was asked.
	ok('...each bad answer is refused out loud, and cancelling is not an error',
		refused === 4 && notice() !== PC0.lpn_map_attach_scale_from_bad,
		refused + ' refused, after cancel: ' + JSON.stringify(notice()));
	global.prompt = global.window.prompt = function () { return '0.5'; };
	L.mapgeoScaleFrom();
	ok('...while the same factor the other way puts the size back',
		Math.abs(L.xyGeoref().metersPerUnit - mpu0) < 1e-9 * mpu0);
}
// DETACH is the old Remove row under Tom's word, so the reversibility claim above still holds.
L.removeMapAttach();
ok('Detach takes the world map away', L.xyGeorefOk() === false);
ok('DETACHING CHANGED NOT ONE STORED BYTE', snapshot() === before);

if (MUTATE) {
	console.log('');
	console.log(fails > 0
		? 'MUTATION LEG OK: the coordinate nudge was caught.'
		: 'MUTATION LEG FAILED: a moved coordinate went unnoticed.');
	process.exit(fails > 0 ? 0 : 1);
}
console.log('');
console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

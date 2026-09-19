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
	"\t\tmapgeoApplyDrag: mapgeoApplyDrag,\n" +
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
	// The tiles, so the one thing a reader actually looks at during step 2 can be asserted about.
	// `mapSized` is the page's "the canvas has a height now" latch and nothing here can raise it by
	// laying anything out, so it is set directly; paintBasemapTiles() draws nothing without it.
	"\t\trefreshBasemap: refreshBasemap, setMapSized: function (on) { mapSized = on !== false; },\n" +
	"\t\ttileEls: function () { return basemapEls; },\n" +
	"\t\tdialFactor: mapgeoDialFactor, dialTurn: mapgeoDialSetTurn,\n" +
	"\t\tdialPosFor: mapgeoDialPosFor, dialDrop: mapgeoDialDrop,\n" +
	// The camera, so "the wheel moved the camera and not the transform" can be said as a
	// number rather than inferred from a screen position the stub may hold constant.
	"\t\tcamera: function () { return { s: state.s, tx: state.tx, ty: state.ty }; },\n" +
	"\t\tdialPos: mapgeoDialSetPos, dialState: function () { return mapgeo && mapgeo.dial; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world);\n" +
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

// ---- STEP 1 PANS, AND IT IS DRIVEN THROUGH THE PAGE'S OWN PRESS -------------------------------
//
// Tom, 2026-09-18: *"On step 1 of 2, pan and zoom must be enabled. I only have zoom. I need pan."*
//
// **EVERYTHING ABOVE AND BELOW THIS BLOCK HANDS mapgeoApplyDrag() A DRAG RECORD THIS FILE BUILT**,
// which tests the arithmetic of a gesture and says nothing at all about whether a press ever
// reaches it. The whole of step 1's pan is that path: there is no rectangle at step 1, so the press
// lands on bare canvas and the only thing that can turn it into a map move is
// mapgeoPointerDown()'s fallback. Nothing in this repository had ever driven it. So this block
// fires the page's own pointerdown, pointermove and pointerup, and pumps the frame loop that
// applies them -- the same three things a hand does -- and asserts the ground moved.
//
// **THE FRAME LOOP IS PART OF THE PATH AND IS WHY IT IS PUMPED HERE.** looped-network.js records a
// press, sets `dragDirty`, and does the work in a requestAnimationFrame chain; panning is the one
// gesture that depends on that loop and on nothing else, which is why "I can edit and zoom but I
// cannot pan" is the exact signature of the loop having stopped (ROADMAP Task 650). Asserting
// through the loop is what makes this block able to see that.
{
	const { setHitTarget } = require('./lpn-dom-stub.js');
	const canvas = byId.lpn_canvas;
	canvas._listeners = {};
	L.wirePointerEvents();
	const fire = (type, ev) => (canvas._listeners[type] || []).forEach(f => f(ev));
	// A press on BARE CANVAS -- null is the stub's way of saying the pointer is over nothing.
	const pan = (dx, dy, id) => {
		const a = L.screenOf(midX, midY), b = { x: a.x + dx, y: a.y + dy };
		setHitTarget(null);
		fire('pointerdown', { pointerId: id, clientX: a.x, clientY: a.y, pointerType: 'mouse', button: 0 });
		const armed = L.getDrag();
		fire('pointermove', { pointerId: id, clientX: b.x, clientY: b.y, pointerType: 'mouse', buttons: 1 });
		const applied = L.pumpDrag();
		fire('pointerup', { pointerId: id, clientX: b.x, clientY: b.y, pointerType: 'mouse' });
		return { armed: armed, applied: applied };
	};
	let was = G.lpnGeorefToLonLat(L.xyGeoref(), midX, midY);
	let r = pan(120, 0, 41);
	ok('a press on bare canvas at step 1 arms a map drag, not a camera pan',
		!!r.armed && r.armed.type === 'mapgeo' && r.armed.kind === 'move',
		JSON.stringify(r.armed && { type: r.armed.type, kind: r.armed.kind }));
	ok('...and the frame loop applies it', r.applied === true);
	let now = G.lpnGeorefToLonLat(L.xyGeoref(), midX, midY);
	// Dragging RIGHT must carry the ground right, which on a map means the drawing ends up further
	// WEST on it. The sign is the assertion: a pan that moved the map the wrong way would still
	// change the number.
	ok('dragging right slides the map right, so the drawing sits further west on it',
		now.lon < was.lon && Math.abs(now.lat - was.lat) < 1e-9,
		was.lon.toFixed(4) + ' -> ' + now.lon.toFixed(4));
	was = now;
	r = pan(0, 130, 42);
	now = G.lpnGeorefToLonLat(L.xyGeoref(), midX, midY);
	ok('...and dragging down slides it down, so the drawing sits further north on it',
		now.lat > was.lat && Math.abs(now.lon - was.lon) < 1e-9,
		was.lat.toFixed(4) + ' -> ' + now.lat.toFixed(4));
	// A second and a third press must work too: the drag record is rebuilt from the transform of
	// the moment, so a pan that only ever worked once would be a stale `t0`.
	was = now;
	pan(-90, 0, 43); pan(0, -70, 44);
	now = G.lpnGeorefToLonLat(L.xyGeoref(), midX, midY);
	ok('...and it keeps working press after press, never only the first time',
		now.lon !== was.lon && now.lat !== was.lat);
	// The press that did not travel slides nothing -- the slop every other gesture on this page
	// obeys.
	was = now;
	pan(1, 1, 45);
	now = G.lpnGeorefToLonLat(L.xyGeoref(), midX, midY);
	ok('...while a press that barely moved slides nothing',
		now.lon === was.lon && now.lat === was.lat);
	// **AND IT IS NOT A TAP ON THE DRAWING EITHER, which it was.** The tap listener beside the drag
	// one exempted the OTHER placement wizard by name and said nothing about this one, so a nudge
	// too small to pan went on to the ordinary select machinery and opened the popup of whatever
	// was under the pointer -- on a canvas where the drawing fills the screen. The map not moving
	// AND something else happening is what "I have no pan" looks like from the outside.
	{
		const node = { dataset: { node: L.getDoc().nodes[1].id } };
		setHitTarget(node);
		fire('pointerdown', { pointerId: 46, clientX: 400, clientY: 300, pointerType: 'mouse', button: 0 });
		fire('pointerup', { pointerId: 46, clientX: 401, clientY: 300, pointerType: 'mouse' });
		// Asserted as NOT SHOWN rather than as "not block": this popup is laid out with `flex`, and
		// a test written against the wrong keyword is a test that passes on the defect. It did.
		const popup = byId.lpn_popup;
		const shown = !!popup && !!popup.style.display && popup.style.display !== 'none';
		ok('...and a press too small to pan opens nothing, because the wizard owns every press',
			!shown, popup && JSON.stringify(popup.style.display));
		setHitTarget(null);
	}
	// THE WHEEL, through the one door the page sends every zoom request to.
	const mpuWas = L.xyGeoref().metersPerUnit;
	L.wheelZoom(L.screenOf(midX, midY).x, L.screenOf(midX, midY).y, 2);
	ok('and the wheel still zooms the map at step 1, which is the half he already had',
		Math.abs(L.xyGeoref().metersPerUnit - mpuWas / 2) < 1e-9 * mpuWas);
	ok('STEP 1 PANNED AND ZOOMED AND CHANGED NOT ONE STORED BYTE', snapshot() === before);
}

// ---- STEP 2: A DRAG SLIDES THE MAP, AND THE RECTANGLE IS GONE --------------------------------
//
// Tom, 2026-09-19, after using the first build: *"(b) Pan (normal gestures) works on the map only...
// (e) The rectangle control is gone."* So what step 2 offers is one gesture and two sliders, and
// what is asserted here is the gesture; the sliders have their own block below.
//
// **THE CORNER AND TURN-HANDLE ASSERTIONS THAT STOOD HERE WENT WITH THE CONTROL THEY GRADED.** They
// were correct and they passed; what they graded was a rectangle whose handles a hand could not
// reach at a fitted zoom, measured in a real browser (dev/lpn-spike/mapgeo-browser-drive.js, where
// elementFromPoint at the rotate handle returned `lpn_toolbar`). Scaling and turning are now the two
// sliders, graded below against the same two properties: the ground moves, the drawing does not.
L.mapgeoPlace();
ok('Place approximately moves to step 2', L.mapgeoStep() === 2);

// A DRAG ANYWHERE slides the map, and the ground the pointer grabbed follows the pointer.
t = L.xyGeoref();
const slideFrom = { x: midX, y: midY }, slideBy = 300;
const grabbedGround = G.lpnGeorefToLonLat(t, slideFrom.x, slideFrom.y);
const mpuBeforeSlide = t.metersPerUnit, rotBeforeSlide = t.rotDeg;
L.setDrag({ type: 'mapgeo', kind: 'move', t0: t, start: { x: slideFrom.x, y: slideFrom.y } });
L.mapgeoApplyDrag(L.screenOf(slideFrom.x + slideBy, slideFrom.y));
t = L.xyGeoref();
let back = G.lpnGeorefFromLonLat(t, grabbedGround.lon, grabbedGround.lat);
ok('a drag slides the map, and the ground under the pointer goes with it',
	Math.abs(back.x - (slideFrom.x + slideBy)) < 1e-6 && Math.abs(back.y - slideFrom.y) < 1e-6,
	back.x.toFixed(6) + ', ' + back.y.toFixed(6));
ok('...and it changes neither the size of the map nor its bearing, which the sliders own',
	t.metersPerUnit === mpuBeforeSlide && t.rotDeg === rotBeforeSlide);
ok('STEP 2 CHANGES NOT ONE STORED BYTE', snapshot() === before);

// ---- AND THE GROUND IS THE THING THAT MOVES ----------------------------------------------------
//
// **THE DEFECT TOM PHOTOGRAPHED, STATED AS A PROPERTY** (2026-09-18: *"Ida is wrong. See images.
// The project is moved and rotated, not the map."*). In his two frames the STREETS held the same
// screen positions while his network appeared to swing, which is the exact opposite of what step 2
// promises. The arithmetic above was right the whole time -- a turn of the handle does turn the
// transform and leaves the drawing alone -- and the picture was still wrong, because
// paintBasemapTiles() keeps a tile element by key and never touches it again. That cache is correct
// for a pan or a zoom, where the CAMERA moves and the whole drawing frame goes with it; it is wrong
// the moment the GROUND moves under a still drawing, which is the only thing this wizard does. So
// every visible tile went on showing where that patch of ground used to be.
//
// **WHY THE PROJECT IS THE ONE THAT HOLDS STILL**, which is the part that keeps this from being
// rewritten (Tom, on the phrase "eyes-on alignment against the streets"): *"We are not interested
// in aligning the project with the streets. We want to align the streets with the project."* The
// project is the survey and the thing of value; the map is decoration being fitted to it.
//
// Measured in a real headless Chrome as well, through dev/lpn-spike/browser-drive.js: before the
// repair a node sat at (423.8, 1013.2) and tile 4/4/0 at (896.3, 288.5), and after a 30 degree turn
// of the handle the node was at (423.8, 1013.2) and the tile was STILL at (896.3, 288.5) -- 112 of
// 112 shared tiles unmoved. After it, the node is at (423.8, 1013.2) still and the tile has moved to
// (1140.3, 156.8), with all 112 moved.
{
	// `mapSized` is put back as well, and that is not tidiness: currentView() answers null until the
	// canvas has a height, so raising the latch adds a `view` to the saved bytes and the identity
	// check below would fail on a field this block invented.
	L.setMapSized(true);
	const project = L.getProject();
	// `basemap` is part of the saved bytes, so it is put back before the identity check below runs.
	const basemapWas = project.basemap;
	project.basemap = 'osm';
	L.refreshBasemap();
	// Where each tile is DRAWN, which is what a reader sees: the affine each image carries. Nothing
	// here re-derives it -- it is read back off the elements the page made.
	const placedNow = () => {
		const out = {}, els = L.tileEls();
		Object.keys(els).forEach(function (k) { out[k] = els[k].getAttribute('transform') || ''; });
		return out;
	};
	const tilesBefore = placedNow();
	ok('the basemap draws tiles at all, or nothing below means anything',
		Object.keys(tilesBefore).length > 0, Object.keys(tilesBefore).length);
	// The drawing's own fixed point, in the frame the camera maps to the screen. The camera is not
	// touched by any of this, so an unchanged drawing coordinate IS an unchanged screen position.
	const pinBefore = L.screenOf(midX, midY);

	// A SMALL turn, and that is not timidity: a quarter turn swings a different patch of the Earth
	// onto the screen, so the two tile sets share no key and "every shared tile moved" is vacuously
	// true. A few degrees is the gesture somebody actually makes at the end of a fit, and it leaves
	// most of the ground on screen to be compared.
	// Through the TURN SLIDER, which is the only way to turn the map since the rectangle went.
	L.dialTurn(5);
	L.refreshBasemap();
	// **AND THE BASELINE IS DROPPED AFTERWARDS, which is what the page itself does the moment any
	// other gesture writes.** Left standing, the record made here is still the base the NEXT block's
	// slider reads from, so its `tWas` and its base are five degrees apart and every assertion in it
	// is off by five -- measured, not guessed: that is how this line came to be written.
	L.dialDrop();

	const tilesAfter = placedNow();
	const pinAfter = L.screenOf(midX, midY);
	ok('THE DRAWING DOES NOT MOVE ON SCREEN when the map is turned',
		pinBefore.x === pinAfter.x && pinBefore.y === pinAfter.y,
		pinBefore.x + ',' + pinBefore.y + ' -> ' + pinAfter.x + ',' + pinAfter.y);
	const shared = Object.keys(tilesBefore).filter(function (k) { return tilesAfter[k] !== undefined; });
	const stale = shared.filter(function (k) { return tilesAfter[k] === tilesBefore[k]; });
	ok('...AND EVERY TILE OF GROUND STILL ON SCREEN HAS MOVED',
		shared.length > 0 && stale.length === 0,
		shared.length + ' shared, ' + stale.length + ' left where they were');
	project.basemap = basemapWas;
	L.setMapSized(false);
	ok('turning the map still changes not one stored byte', snapshot() === before);
}

// ---- THE SIZE AND TURN DIAL (Tom, 2026-09-18) --------------------------------------------------
//
// His design, and his own refutation of the objection that a slider gives up direct manipulation:
// *"There is no direct manipulation to give up. The map is practically infinite. There is no way to
// visually enlarge it or reduce it. The rectangle is a poor metaphor (and isn't working anyway).
// And the scroll wheel is discrete, not continuous."* So what is graded here is the three promises
// the control makes: the middle of the bar is the size step 1 left, the ends are the band he named,
// and moving either half moves the GROUND and not the drawing.
{
	L.setMapSized(true);
	const project = L.getProject();
	const basemapWas = project.basemap;
	project.basemap = 'osm';
	L.refreshBasemap();
	const placedNow = () => {
		const out = {}, els = L.tileEls();
		Object.keys(els).forEach(function (k) { out[k] = els[k].getAttribute('transform') || ''; });
		return out;
	};

	ok('the middle of the bar is exactly the size it already is', L.dialFactor(0) === 1, L.dialFactor(0));
	ok('...the bottom is his lower end', Math.abs(L.dialFactor(-1) - 0.75) < 1e-12, L.dialFactor(-1));
	ok('...and the top is his upper end', Math.abs(L.dialFactor(1) - 1.5) < 1e-12, L.dialFactor(1));

	// **THE ROUND TRIP IS THE ASSERTION WORTH HAVING.** A dial read against the LIVE transform would
	// compound every move, so sliding out and back would not come home; read against a base taken
	// once, it comes home exactly, and "1 in the middle" means something a person can rely on.
	const tWas = JSON.stringify(L.xyGeoref());
	const pinWas = L.screenOf(midX, midY);
	const tilesWas = placedNow();
	L.dialPos(1);
	const tBig = L.xyGeoref();
	ok('the top of the bar makes the ground half again as wide per drawing unit',
		Math.abs(tBig.metersPerUnit - JSON.parse(tWas).metersPerUnit / 1.5) < 1e-9 * tBig.metersPerUnit,
		tBig.metersPerUnit);
	const pinBig = L.screenOf(midX, midY);
	ok('...and the drawing has not moved on screen',
		pinWas.x === pinBig.x && pinWas.y === pinBig.y);
	// A SMALL move for the tile comparison, for the reason the turn above states: a big one swings
	// a different patch of the Earth onto the screen and the two sets share no key at all.
	L.dialPos(0.1);
	const tilesBig = placedNow();
	const sharedBig = Object.keys(tilesWas).filter(function (k) { return tilesBig[k] !== undefined; });
	ok('...while every tile of ground still on screen has moved',
		sharedBig.length > 0 && !sharedBig.some(function (k) { return tilesBig[k] === tilesWas[k]; }),
		sharedBig.length + ' shared');
	L.dialPos(0);
	ok('BACK TO THE MIDDLE IS THE SIZE IT STARTED AT, exactly', JSON.stringify(L.xyGeoref()) === tWas);

	// The knob. Same pivot as the bar, which is what lets the two be applied in one expression.
	// **HIS BAND IS TEN DEGREES EITHER WAY** (2026-09-19: *"up is counter-clockwise with a limit of
	// about 10 degrees (since most convergence angles are less than 1 degree)"*), so the knob's old
	// 30 is now off the end of the travel and the assertion is the CLAMP as well as the sign.
	L.dialTurn(6);
	const tTurn = L.xyGeoref();
	ok('the turn slider turns the map counterclockwise by the degrees it reads',
		Math.abs(tTurn.rotDeg - (JSON.parse(tWas).rotDeg + 6)) < 1e-9, tTurn.rotDeg);
	L.dialTurn(30);
	ok('...and it stops at ten degrees rather than carrying on round, which a knob did',
		Math.abs(L.xyGeoref().rotDeg - (JSON.parse(tWas).rotDeg + 10)) < 1e-9, L.xyGeoref().rotDeg);
	L.dialTurn(-30);
	ok('...at both ends', Math.abs(L.xyGeoref().rotDeg - (JSON.parse(tWas).rotDeg - 10)) < 1e-9);
	// **THE NUMBER BOXES ARE THE SAME TWO SEAMS REACHED BY TYPING** (his point 5). A typed factor
	// lands where the slider would put it, which is what makes the two halves of each pair one
	// control rather than two.
	ok('a typed factor of 1 is the middle of the size bar', L.dialPosFor(1) === 0, L.dialPosFor(1));
	ok('...1.5 is the top end', Math.abs(L.dialPosFor(1.5) - 1) < 1e-12, L.dialPosFor(1.5));
	ok('...0.75 is the bottom end', Math.abs(L.dialPosFor(0.75) + 1) < 1e-12, L.dialPosFor(0.75));
	ok('...and a typed factor round-trips through the travel it names',
		Math.abs(L.dialFactor(L.dialPosFor(1.2)) - 1.2) < 1e-12, L.dialFactor(L.dialPosFor(1.2)));
	const pinTurn = L.screenOf(midX, midY);
	ok('...and the drawing has still not moved on screen',
		pinWas.x === pinTurn.x && pinWas.y === pinTurn.y);
	L.dialTurn(0);
	ok('...and zero degrees is where it started, exactly', JSON.stringify(L.xyGeoref()) === tWas);

	// **ANY OTHER GESTURE RE-BASELINES IT**, so the middle never comes to mean a size nobody chose.
	L.dialPos(1);
	L.mapgeoGoTo({ lon: 12.5, lat: 41.9 }, null);
	ok('a move that is not the dial drops the base, so the dial reads as it stands',
		!L.dialState());

	project.basemap = basemapWas;
	L.setMapSized(false);
	ok('THE DIAL CHANGES NOT ONE STORED BYTE', snapshot() === before);
}

// ---- AND IN STEP 2 THE TWO GESTURES HAVE TWO DIFFERENT SUBJECTS ------------------------------
//
// Tom, 2026-09-19: *"(a) Zoom (normal gestures) works on everything (both) together, and we state
// this in the wizard. (b) Pan (normal gestures) works on the map only, and we state this in the
// wizard."*
//
// **THIS REVERSES HIS 2026-09-18 RULING THAT THE WHEEL DOES NOTHING AT STEP 2**, and the reversal is
// his own after using it. What he was refusing then was the map moving UNDER a still drawing on a
// gesture nobody aimed; a camera zoom moves the two TOGETHER, which is what judging a fit needs.
// The assertion below is the one that tells those two apart: a camera zoom leaves `project.georef`
// byte-identical, because the camera is not the transform.
{
	const { setHitTarget } = require('./lpn-dom-stub.js');
	const canvas = byId.lpn_canvas;
	const fire = (type, ev) => (canvas._listeners[type] || []).forEach(f => f(ev));
	const frozen = JSON.stringify(L.xyGeoref());
	const camWas = L.camera().s;
	L.wheelZoom(L.screenOf(midX, midY).x, L.screenOf(midX, midY).y, 2);
	ok('THE WHEEL AT STEP 2 MOVES THE CAMERA, so it changes the placement not at all',
		JSON.stringify(L.xyGeoref()) === frozen, JSON.stringify(L.xyGeoref()));
	// ...and it really did zoom, or the line above is satisfied by a wheel that does NOTHING --
	// which is exactly what it did until today, so this is the leg that tells the fix from the
	// defect. Read off the camera rather than off a screen position: the drawing and the tiles are
	// in one world group, so one scale is what moves them together.
	ok('...and it really zoomed, which the old "do nothing" branch also passed the line above',
		L.camera().s !== camWas, camWas + ' -> ' + L.camera().s);
	L.wheelZoom(L.screenOf(midX, midY).x, L.screenOf(midX, midY).y, 0.5);

	// A press on BARE CANVAS at step 2 now slides the MAP. There is no rectangle to press instead.
	setHitTarget(null);
	const a = L.screenOf(midX, midY);
	const beforeDrag = JSON.stringify(L.xyGeoref());
	const pinBeforeDrag = L.screenOf(midX, midY);
	fire('pointerdown', { pointerId: 51, clientX: a.x, clientY: a.y, pointerType: 'mouse', button: 0 });
	const armed = L.getDrag();
	ok('a press on bare canvas at step 2 arms the map drag', !!armed && armed.kind === 'move',
		JSON.stringify(armed));
	fire('pointermove', { pointerId: 51, clientX: a.x + 150, clientY: a.y, pointerType: 'mouse', buttons: 1 });
	L.pumpDrag();
	fire('pointerup', { pointerId: 51, clientX: a.x + 150, clientY: a.y, pointerType: 'mouse' });
	ok('...and dragging it slides the MAP', JSON.stringify(L.xyGeoref()) !== beforeDrag);
	ok('...while the drawing does not move on screen, which is the whole ruling',
		L.screenOf(midX, midY).x === pinBeforeDrag.x && L.screenOf(midX, midY).y === pinBeforeDrag.y);
	ok('STEP 2 ZOOMING AND PANNING CHANGED NOT ONE STORED BYTE', snapshot() === before);
}

// ---- Georeference here -------------------------------------------------------------------------
const placed = JSON.parse(JSON.stringify(L.xyGeoref()));
L.mapgeoFinish();
ok('the wizard is finished', L.mapgeoActive() === false);
ok('and the georeferencing is on the project', L.xyGeorefOk() === true);
ok('GEOREFERENCE HERE CHANGES NOT ONE STORED BYTE', snapshot() === before,
	snapshot() === before ? '' : 'the saved project differs');
ok('the placement it keeps is the one on the screen',
	JSON.stringify(L.xyGeoref()) === JSON.stringify(placed));

// ---- AND IT IS OFFERED SATELLITE, WHICH IS TASK 692's QUESTION ASKED A FOURTH TIME ------------
//
// Tom, 2026-09-18: *"Satellite unreliable: I am specifically not getting satellite view on local
// testing of feat/xy-world-map."* Task 692 renamed the narrow predicate isLatLonProject() because
// four capabilities were gated on "are these coordinates a latitude and a longitude" when what they
// meant was "can this project be put on the Earth at all". **A georeferenced XY project is the case
// that could not exist when that audit ran** -- emphatically not lat/lon, and locatable all the
// same -- so its own basemap rows were gated on the narrow question and the satellite row was
// simply absent. basemapChoosable() is the wide question, and the STREET and SATELLITE rows and the
// corner teaser are the three readers of it.
//
// **Go to, the place-name search and the DEM elevations are deliberately NOT here**, and that is the
// other half of the same ruling: each of those needs more than a transform, and a row that is
// offered and does nothing is the defect 692 closed. Asserted in both directions, so widening the
// wrong three fails here rather than reaching Tom.
{
	// **A TOKEN IS SUPPLIED HERE, because the question under test is the PREDICATE and not the
	// account.** satelliteAvailable() reads `pc.lpn_mapbox_token`, which lib/config.inc.php fills on
	// the served page and which no harness has; without it the satellite row is correctly absent for
	// a reason that has nothing to do with this branch, and the assertion would pass or fail by
	// accident. Put back afterwards, so nothing below inherits it.
	const PCS = global.EngCalcs.pageConfig || {};
	const tokenWas = PCS.lpn_mapbox_token;
	PCS.lpn_mapbox_token = 'pk.harness';
	const rows = L.mapMenuRows().filter(function (r) { return !r.hidden; })
		.map(function (r) { return r.label; });
	ok('a georeferenced XY project can say where on the Earth it is', L.basemapChoosable() === true);
	ok('...so the STREET MAP row is offered', rows.indexOf(PCS.lpn_basemap_show) >= 0 ||
		rows.indexOf(PCS.lpn_basemap_hide) >= 0, rows.join(' | '));
	ok('...AND THE SATELLITE ROW IS OFFERED', rows.indexOf(PCS.lpn_basemap_satellite_show) >= 0 ||
		rows.indexOf(PCS.lpn_basemap_satellite_hide) >= 0, rows.join(' | '));
	ok('...while Go to stays on the narrow question, being more than a transform',
		rows.indexOf(PCS.lpn_goto_menu) < 0, rows.join(' | '));
	if (tokenWas === undefined) { delete PCS.lpn_mapbox_token; } else { PCS.lpn_mapbox_token = tokenWas; }
	ok('...and with no account there is no satellite row to offer, which is the other half',
		L.mapMenuRows().filter(function (r) { return !r.hidden; })
			.every(function (r) { return r.label !== PCS.lpn_basemap_satellite_show &&
				r.label !== PCS.lpn_basemap_satellite_hide; }));
}

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
	L.mapgeoCancel();
	ok('...and Cancel puts it back exactly', JSON.stringify(L.xyGeoref()) === attached);
	L.mapgeoAdjust('scale');
	ok('Scale by picking opens the same step 2, which is the same two sliders',
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

// THE WORLD MAP BEHIND AN XY DRAWING, AND THE ONE THING IT MAY NOT DO -- ROADMAP Task 646.
//
//   node dev/lpn-spike/xy-world-map-harness.js
//
// Tom, 2026-09-13: *"Even an arbitrary XY project can have a world map background with a good
// wizard... Attach the world map to this project without changing it any other way."*
//
// **THE ACCEPTANCE CRITERION IS BYTE IDENTITY, NOT A TOLERANCE**, exactly as it is for an `.inp`
// round trip in inp-export-harness.js. CLAUDE.md's absolute rule is that only the user touches a
// file's numbers; the placement wizard beside this one (georefStart) rewrites every coordinate in
// the document and is fenced off from a project that declares a coordinate system for that reason,
// and this door is safe only while it writes nothing at all. So what is compared here is the WHOLE
// SERIALIZED PROJECT -- the bytes that would be saved -- before attaching, after attaching and
// after removing, with only the `project.georef` declaration itself allowed to differ.
//
// **AND THE ATTACHMENT HAS TO BE WORTH SOMETHING, or a no-op would pass every assertion above.**
// So the transform is also graded: the middle of the drawing lands on the latitude and longitude
// the user typed, the site comes out the ground width they gave, and a turn turns. Those are read
// through js/lpn-georef.js, which is the same arithmetic the tiles are placed with.
//
// **THE MUTATION LEG IS A SECOND RUN, NOT AN ASSERTION.** `XY_WORLD_MAP_MUTATE=1` patches the page
// source so that attaching moves one node by a hair, and the run must go RED. A harness whose
// invariant is "nothing changed" passes trivially if it is comparing the wrong thing, which is the
// failure mode this exists to rule out.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };

// The three answers the wizard asks for, in order: where the middle is, how wide the site is, and
// which way it is turned. Queued rather than matched on the prompt text, because the text is a
// language string and harness_wording_check.php is right that pinning one here is a tax on
// rewording it.
let answers = [];
global.prompt = global.window.prompt = function () {
	return answers.length ? answers.shift() : null;
};

const MUTATE = process.env.XY_WORLD_MAP_MUTATE === '1';

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\tstartMapAttach: startMapAttach, removeMapAttach: removeMapAttach,\n" +
	"\t\txyGeoref: xyGeoref, xyGeorefOk: xyGeorefOk, xyMapAttachable: xyMapAttachable,\n" +
	"\t\tbasemapOn: basemapOn, basemapChoosable: basemapChoosable,\n" +
	"\t\tmapMenuRows: mapMenuRows, mapAttachRows: mapAttachRows,\n" +
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
		// ONE NODE, ONE ULP-ISH NUDGE -- the smallest thing this harness must still catch, and the
		// shape the defect would really take: a coordinate rewritten by a conversion that is not
		// quite the identity.
		return src.replace(
			'\t\tif (!project.basemap || project.basemap === \'off\') { project.basemap = \'osm\'; }',
			// **NOT nodes[0]**: the first node of this fixture sits at the origin, and a
			// multiplicative nudge of zero is zero. A mutation that cannot change anything proves
			// nothing about the harness, and the first run of this leg said exactly that.
			'\t\tif (doc.nodes[1]) { doc.nodes[1].x = doc.nodes[1].x * (1 + 1e-12); }\n' +
			'\t\tif (!project.basemap || project.basemap === \'off\') { project.basemap = \'osm\'; }');
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

const before = snapshot();

ok('an xy grid project is offered the attachment', L.xyMapAttachable() === true);
ok('and has none to start with', L.xyGeorefOk() === false);

// Petaluma, and a 3,000 ft site turned 30 degrees counterclockwise.
const LAT = 38.2324, LON = -122.6367, SPAN_FT = 3000, TURN = 30;
answers = [LAT + ', ' + LON, String(SPAN_FT), String(TURN)];
L.startMapAttach();

ok('the world map is attached', L.xyGeorefOk() === true);
ok('and the tiles are switched on', L.basemapOn() === true);
ok('the street map and satellite rows now appear', L.basemapChoosable() === true);

const after = snapshot();
ok('ATTACHING CHANGES NOT ONE STORED BYTE', after === before,
	after === before ? '' : 'the saved project differs');

// ---- the attachment is worth something ------------------------------------------------------
const t = L.xyGeoref();
const G = global.EngCalcs;
const bMinX = 0, bMaxX = 2000, bMinY = 0, bMaxY = 800;   // outward, y-up
const midX = (bMinX + bMaxX) / 2, midY = (bMinY + bMaxY) / 2;
const mid = G.lpnGeorefToLonLat(t, midX, midY);
ok('the middle of the drawing lands on the typed latitude',
	Math.abs(mid.lat - LAT) < 1e-9, mid.lat);
ok('...and on the typed longitude', Math.abs(mid.lon - LON) < 1e-9, mid.lon);

const FT_M = 0.3048;
const spanUnits = Math.max(bMaxX - bMinX, bMaxY - bMinY);
ok('the site is the ground width the user gave',
	Math.abs(t.metersPerUnit * spanUnits - SPAN_FT * FT_M) < 1e-6,
	(t.metersPerUnit * spanUnits).toFixed(6) + ' m');
ok('the turn is the one the user gave', t.rotDeg === TURN);

// A point due +y of the middle in the drawing is, at 30 degrees counterclockwise, WEST of north on
// the ground -- the sense lpnGeorefWithRotation() documents. Checked as a bearing so the assertion
// survives any change to the projection's internals.
const up = G.lpnGeorefToLonLat(t, midX, midY + 400);
const mpd = G.lpnGeorefMetersPerDegree(t.origin.lat);
const east = (up.lon - mid.lon) * mpd.lon, north = (up.lat - mid.lat) * mpd.lat;
const bearing = Math.atan2(east, north) * 180 / Math.PI;
ok('a turn of 30 degrees counterclockwise swings the drawing 30 degrees west of north',
	Math.abs(bearing + TURN) < 1e-6, bearing.toFixed(9));

// The inverse is exact algebra, which is what places every tile.
const back = G.lpnGeorefFromLonLat(t, mid.lon, mid.lat);
ok('the transform inverts at the anchor',
	Math.abs(back.x - midX) < 1e-9 && Math.abs(back.y - midY) < 1e-9);

// ---- and it is reversible ---------------------------------------------------------------------
L.removeMapAttach();
ok('the attachment is gone', L.xyGeorefOk() === false);
const removed = snapshot();
ok('REMOVING LEAVES THE PROJECT EXACTLY AS IT WAS', removed === before,
	removed === before ? '' : 'the saved project differs');

// ---- the menu says what Tom asked it to say ---------------------------------------------------
const rows = L.mapMenuRows().filter(function (r) { return !r.hidden && r.submenu; });
ok('the Map menu carries the background map row',
	rows.some(function (r) { return /georeference/i.test(String(r.label)); }),
	rows.map(function (r) { return r.label; }).join(' | '));
const sub = L.mapAttachRows();
ok('its submenu attaches and removes', sub.length === 2 && sub[1].disabled === true);

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

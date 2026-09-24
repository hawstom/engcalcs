// Local map coordinates -- ROADMAP Task 354. Run with:
//   node dev/lpn-spike/local-origin-harness.js
//
// THE BUG THIS GUARDS IS INVISIBLE IN CODE AND ALMOST INVISIBLE ON SCREEN. Tom imported a real
// client model in state plane coordinates (x ~ 579,350, y ~ 1,304,070), zoomed in, and one pipe
// simply was not drawn -- while its five repeated labels were still laid out along exactly where
// it should have been. Nothing threw, nothing was NaN, and the network solved correctly. An SVG
// path coordinate is a float32, whose spacing at 1.3e6 is 0.125 world units, and a pipe's stroke
// is linkWidth / scale world units: at the scale he was looking at, the stroke was thinner than
// the numbers could express.
//
// So the assertions here are mostly about a quantity nobody looks at -- the MAGNITUDE of the
// numbers the renderer receives -- plus the thing that makes the fix safe, which is that every
// coordinate a USER is shown is unchanged. Those two together are the whole task: small numbers
// downstream, identical numbers outward.
//
// WHAT A HARNESS CANNOT SEE HERE, said plainly: the stub's SVG is an object with attributes, so
// nothing in this file rasterises anything and no assertion below would fail if float32 were
// float64 or a fixed-point decimal. Section 4 asserts the ARITHMETIC that predicts the failure --
// it is a calculation about the renderer, not a measurement of it. Only a browser can confirm the
// pipe comes back, and that is Tom's one-gesture test: open Elm Street, zoom past 47x, look.

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const fs = require('fs');
// The .inp reader is a separate file and is not part of the page's own closure -- section 6 needs
// it to build the import the way File > Import EPANET file does.
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\tmigrateSaved: migrateSaved, serializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\trebaseDocument: rebaseDocument, chooseOrigin: chooseOrigin,\n" +
	"\t\toriginThreshold: function () { return LPN_ORIGIN_THRESHOLD; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, inwardX: inwardX, inwardY: inwardY,\n" +
	"\t\tdocOrigin: docOrigin, docFromInp: docFromInp,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tfieldsEl: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 }; }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// Elm Street's own neighbourhood, which is the model the defect was found on.
const SURVEY_X = 579350, SURVEY_Y = 1304070;

// A stored document, in the FILE's frame: Cartesian Y, absolute coordinates.
function surveyDoc(v) {
	return {
		v: v === undefined ? 6 : v,
		project: { name: 'survey', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: [
			{ id: 'J1', type: 'junction', x: SURVEY_X, y: SURVEY_Y, elev: 100 },
			{ id: 'J2', type: 'junction', x: SURVEY_X + 300, y: SURVEY_Y + 120, elev: 101, ly: -4 }
		],
		links: [{ id: 'P1', type: 'pipe', from: 'J1', to: 'J2',
			verts: [{ x: SURVEY_X + 150, y: SURVEY_Y + 40 }] }],
		labels: [
			{ id: 'X1', text: 'free', x: SURVEY_X + 20, y: SURVEY_Y + 20, anchorNode: null },
			{ id: 'X2', text: 'tied', x: 5, y: -7, anchorNode: 'J1' }
		],
		backdrop: { tx: SURVEY_X - 50, ty: SURVEY_Y - 50, s: 1, x: 0, y: 0, width: 100, height: 100, iw: 100 },
		view: { cx: SURVEY_X + 150, cy: SURVEY_Y + 60, extent: 500 },
		nextId: { J: 3, R: 1, L: 2, P: 1, T: 1, X: 3 },
		units: {}
	};
}

// ---- 1. The rebase moves nothing that a person can see ---------------------------------------
console.log('--- an absolute coordinate is the same number afterwards ---');
{
	const before = surveyDoc(), after = L.rebaseDocument(surveyDoc());
	const org = after.origin;
	ok('a survey document gets an origin', org.x !== 0 || org.y !== 0, JSON.stringify(org));
	ok('...rounded to something a person could have typed',
		org.x % 1000 === 0 && org.y % 1000 === 0, JSON.stringify(org));
	// The invariant the whole design rests on. Every outward site computes origin + local, so if
	// this holds for every stored point, no user-visible number changed.
	const pairs = [
		['J1', after.nodes[0], before.nodes[0]],
		['J2', after.nodes[1], before.nodes[1]],
		['P1 vertex', after.links[0].verts[0], before.links[0].verts[0]],
		['free label', after.labels[0], before.labels[0]],
		['backdrop', after.backdrop, before.backdrop, 'tx', 'ty'],
		['view centre', after.view, before.view, 'cx', 'cy']
	];
	pairs.forEach(([name, a, b, kx = 'x', ky = 'y']) => {
		ok(name + ': origin + local is the original coordinate',
			near(org.x + a[kx], b[kx]) && near(org.y + a[ky], b[ky]),
			org.x + ' + ' + a[kx] + ' = ' + (org.x + a[kx]) + ' (was ' + b[kx] + ')');
	});
	// An OFFSET is not a position. Getting this wrong moves a label or a leader endpoint half a
	// million units from the thing it belongs to, and only these two say so.
	ok('a label ANCHORED to a node keeps its offset untouched',
		after.labels[1].x === before.labels[1].x && after.labels[1].y === before.labels[1].y,
		JSON.stringify(after.labels[1]));
	ok('...and so does a label-drag offset (ly)', after.nodes[1].ly === before.nodes[1].ly);
	ok('a size is not a position either -- the view extent is unchanged',
		after.view.extent === before.view.extent);
	// Run it again: a document that already has an origin is finished. Without this, opening a
	// rebased document through any path that rebases would subtract the origin a second time.
	const twice = L.rebaseDocument(JSON.parse(JSON.stringify(after)));
	ok('rebasing an already-rebased document changes nothing',
		JSON.stringify(twice) === JSON.stringify(after));
}

// ---- 2. A document near the origin is left completely alone ----------------------------------
console.log('\n--- a drawing near zero pays nothing ---');
{
	const small = {
		v: 6, nodes: [{ id: 'J1', type: 'junction', x: 0, y: 0 }, { id: 'J2', type: 'junction', x: 5000, y: 4000 }],
		links: [], labels: [], units: {}
	};
	const out = L.rebaseDocument(JSON.parse(JSON.stringify(small)));
	ok('gets an origin of 0,0', out.origin.x === 0 && out.origin.y === 0, JSON.stringify(out.origin));
	ok('...and every coordinate is byte-identical',
		JSON.stringify(out.nodes) === JSON.stringify(small.nodes));
	// The examples this repo ships are the case being protected here: 0 to ~5,000 for ours,
	// 0 to 100 for Net1/2/3. None of them may move by so much as a unit.
	ok('the threshold is above everything we ship', L.originThreshold() >= 5000,
		L.originThreshold());
	ok('chooseOrigin declines below the threshold', L.chooseOrigin(small) === null);
}

// ---- 3. The version step, and the round trip through storage ---------------------------------
console.log('\n--- opening and saving a survey document ---');
{
	// NOT PINNED TO A LITERAL. v7 is where local origins arrived, and the document must come out at
	// whatever the page's CURRENT version is -- a migration that stops early is the defect here, and
	// a hardcoded number would report every later version bump (v8, Task 407) as this task breaking.
	ok('the storage version is at least v7, where local origins arrived', L.storageVersion() >= 7,
		L.storageVersion());
	const migrated = L.migrateSaved(surveyDoc(6));
	ok('a v6 document migrates all the way to the current version',
		migrated.v === L.storageVersion(), migrated.v + ' vs ' + L.storageVersion());
	ok('...by being rebased on open', migrated.origin.x === 579000 && migrated.origin.y === 1304000,
		JSON.stringify(migrated.origin));

	L.applySaved(JSON.parse(JSON.stringify(migrated)));
	const d = L.getDoc();
	ok('the origin survives into memory', d.origin.x === 579000 && d.origin.y === 1304000,
		JSON.stringify(d.origin));
	// THE ORIGIN IS NOT FLIPPED. It is stated in the file's Cartesian frame, and outwardY() applies
	// the flip to the LOCAL part only. A flip applied here as well would put a survey model about
	// 2.6 million units from where it belongs, in the one direction nobody thinks to check.
	ok('...unflipped, in the file\'s own Cartesian frame', d.origin.y === 1304000, d.origin.y);
	// Memory is Y-down, so the local y is negated; the outward pair must still name the survey point.
	ok('the node is at a small local coordinate', Math.abs(d.nodes[0].x) < 1e4 && Math.abs(d.nodes[0].y) < 1e4,
		d.nodes[0].x + ', ' + d.nodes[0].y);
	ok('...and reports its survey coordinate outward',
		near(L.outwardX(d.nodes[0].x), SURVEY_X) && near(L.outwardY(d.nodes[0].y), SURVEY_Y),
		L.outwardX(d.nodes[0].x) + ', ' + L.outwardY(d.nodes[0].y));
	// The two directions must compose back to where they started, or a typed coordinate lands
	// somewhere other than where the readout says it is.
	ok('inward undoes outward, both axes',
		near(L.inwardX(L.outwardX(d.nodes[0].x)), d.nodes[0].x) &&
		near(L.inwardY(L.outwardY(d.nodes[0].y)), d.nodes[0].y));
	ok('...and outward undoes inward, from a typed survey point',
		near(L.outwardX(L.inwardX(SURVEY_X)), SURVEY_X) &&
		near(L.outwardY(L.inwardY(SURVEY_Y)), SURVEY_Y));

	const written = L.serializeProject();
	ok('a save writes the origin', written.origin && written.origin.x === 579000,
		JSON.stringify(written.origin));
	ok('...and writes LOCAL coordinates beside it', Math.abs(written.nodes[0].x) < 1e4,
		written.nodes[0].x);
	ok('...which add back up to the survey point', near(written.origin.x + written.nodes[0].x, SURVEY_X) &&
		near(written.origin.y + written.nodes[0].y, SURVEY_Y),
		(written.origin.x + written.nodes[0].x) + ', ' + (written.origin.y + written.nodes[0].y));
	// Save, reopen, save again -- the document must be a fixed point. This is the cheap strong
	// assertion CLAUDE.md asks for on anything that rewrites a whole document.
	L.applySaved(JSON.parse(JSON.stringify(written)));
	const again = L.serializeProject();
	ok('save -> open -> save is a fixed point',
		JSON.stringify(again.nodes) === JSON.stringify(written.nodes) &&
		JSON.stringify(again.origin) === JSON.stringify(written.origin));
}

// ---- 4. The arithmetic that predicted the failure --------------------------------------------
console.log('\n--- the numbers the rasteriser gets are now expressible ---');
{
	// float32 has a 24-bit significand, so the spacing at magnitude m is about m / 2^23. A pipe is
	// drawn with a stroke of linkWidth / scale WORLD units, so it disappears when that falls below
	// the spacing -- which is the whole bug, stated as one inequality.
	const quantum = m => Math.pow(2, Math.ceil(Math.log2(Math.abs(m) || 1)) - 23);
	const workingScale = (m, strokePx) => strokePx / quantum(m);
	const MAX_SCALE = 500, STROKE = 3;

	ok('before: a survey model failed below the zoom Tom was using',
		workingScale(SURVEY_Y, STROKE) < 47,
		'quantum ' + quantum(SURVEY_Y) + ', working to ' + workingScale(SURVEY_Y, STROKE).toFixed(0) + 'x');
	// Local coordinates are bounded by the extent of the drawing plus the rounding, so a model a
	// mile across is under 1e4 whatever grid it was surveyed on.
	const d = L.getDoc(), localMax = Math.max(...d.nodes.map(n => Math.max(Math.abs(n.x), Math.abs(n.y))));
	ok('after: the same model is drawn from numbers under the threshold', localMax < L.originThreshold(),
		localMax);
	ok('...and survives past MAX_SCALE with room to spare',
		workingScale(L.originThreshold(), STROKE) > MAX_SCALE * 2,
		'working to ' + workingScale(L.originThreshold(), STROKE).toFixed(0) + 'x, MAX_SCALE ' + MAX_SCALE);
	// **WHY non-scaling-stroke IS NOT ALSO BEING DONE.** It was the rejected cheap fix, and the
	// experiment Tom ran settled it: a 20 px stroke survived one zoom step further and then the
	// LABELS went too, which no stroke property touches. With the coordinates small, the stroke
	// term is comfortable at every zoom the page allows, so there is nothing left for it to buy.
	ok('an 11 px glyph is expressible too, which a stroke property could never have fixed',
		workingScale(L.originThreshold(), 11) > MAX_SCALE * 2,
		'working to ' + workingScale(L.originThreshold(), 11).toFixed(0) + 'x');
}

// ---- 5. Every boundary goes through the four converters --------------------------------------
console.log('\n--- one home for the concept ---');
{
	// COMMENTS STRIPPED FIRST. This file explains its own boundary rule at length, and a count that
	// includes the prose goes up whenever someone edits a paragraph -- a check that fails for a
	// reason unrelated to the thing it guards teaches people to raise the number without looking.
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8')
		.replace(/^\s*\/\/.*$/gm, '');
	// Definitions plus call sites. The boundaries are: the coordinate readout, a node popup's X and
	// Y, a Text label popup's X and Y, the backdrop's typed target coordinate, the backdrop world
	// file, and -- since Task 145 -- linkGeomLength(), where a geographic project's drawn length is
	// measured on the Earth. Raising these counts is fine when the new site is a REAL boundary; what
	// the check is for is one more that reads n.x straight out of the document and reports a number
	// half a million units wrong, which looks perfectly ordinary in a diff.
	//
	// **THE GEODESIC ONE IS THE SHARPEST CASE THIS GUARD HAS.** A local-origin document stores small
	// numbers; a geodesic computed from them would be a distance between two points off the coast of
	// Africa, at the wrong latitude, and would come back as a plausible pipe length.
	const count = re => (js.match(re) || []).length;
	// The outward pair gained one site each per AXIS with the basemap (Task 145): refreshBasemap()
	// asks what lon/lat window is on screen, and the two screen corners are two calls per axis.
	//
	// **TASK 145's PLACEMENT TOOL IS THE LARGEST SINGLE ADDITION and it is the guard working, not
	// the guard being worked around.** Every one of its sites is a real boundary: georefCapture()
	// reads the document outward, georefWrite() and georefCancel() write it back inward,
	// georefWorldOf() turns a mapped lon/lat into a world point, and georefCarryTransform(),
	// georefPointerDown(), georefPointerSrc() and the move branch of georefApplyDrag() each convert a
	// pointer or a view centre. A tool that skipped the shift at any one of them would place a State
	// Plane model half a million units off the coast of Africa and draw it without complaint.
	// The two-step placement (detached/attached) added one more site to each pair: the settle that
	// re-derives the document reads the model's anchor OUTWARD and plants it INWARD, which is the
	// same boundary as every other one here.
	// **TASK 497 ADDED TWO SITES TO EACH PAIR, and they are the same boundary again.** Reading the
	// land surface under a node needs where the node is ON THE EARTH, not where it is in the
	// document's local frame -- once for the nodes with no elevation and once for the nodes still on
	// the starting elevation. A terrain lookup that skipped the shift would read the hillside half a
	// million units away and write a perfectly plausible elevation into the document.
	// **TASK 439 ADDED ONE SITE TO EACH, and it is the one place the guard has caught something.**
	// rebaseLiveGeoDoc() reads the model's extent to choose a geographic document's origin, and its
	// first draft called cartesianY() directly -- a fifth frame boundary, which is exactly the
	// failure the cartesianY() count below exists to report. It does, immediately. Routed through
	// the outward pair instead, so the boundary stays four functions wide.
	// **TASK 436 ADDED ONE SITE TO EACH PAIR: THE BACKGROUND IMAGE.** The wizard now carries a
	// backdrop onto the map with the drawing, and the picture's own position is a document
	// coordinate like any other -- georefCaptureBackdrop() reads its centre OUTWARD and
	// georefWriteBackdrop() plants it INWARD. It is the one such point eachStoredPoint() cannot
	// reach on the LIVE document, so it is also the one that had to be spelled out here.
	// **TASK 542 ADDED ONE SITE TO EACH PAIR AND IT IS A CONSOLIDATION, NOT A SPREAD.**
	// terrainPointsForIds() turns a list of node IDS into places on the Earth, for the two doors
	// that arrive holding ids and nothing else -- a node born on a geographic project, and Find and
	// replace reading the DEM. It states the outward-x-is-longitude boundary ONCE for both, which is
	// the alternative to each door stating it again. Task 497's own two sites are unchanged: those
	// functions decide their own lists from the document.
	// **TASK 629 ADDED ONE SITE, AND IT IS A GUARD RATHER THAN A CONVERSION.** viewIsReachable()
	// asks whether any of the Mercator world is on screen before applyView() accepts a camera, and
	// it reaches for LONGITUDE because Mercator x IS longitude, so outwardX() is exact where
	// outwardY() saturates at the cut-off. It was first written calling cartesianY() directly and
	// THIS FILE CAUGHT IT -- which is the whole argument for counting these.
	// **THE SCALE BAR ADDED TWO SITES TO EACH PAIR, and they are a MEASUREMENT rather than a
	// conversion of anything the document holds.** scaleBarUnitsPerPx() turns the two ends of the
	// bar's own span on the screen into places on the Earth, so it can ask geodesicMeters() how
	// far apart they are -- the same function that fills every lenAuto length, which is the whole
	// point: the bar and the pipe labels beside it cannot come to different answers about ground
	// distance. It touches no stored coordinate and writes nothing back.
	// **TASK 628 ADDED ONE SITE TO EACH PAIR, AND IT IS THE SECOND GUARD OF THAT SHAPE.**
	// viewShowsModel() asks whether a camera a document states is on the Earth at all before
	// applySaved() accepts it, and it needs BOTH axes where Task 629's guard needed only
	// longitude: mercLat() is strictly monotonic, so a saturating latitude still answers the
	// yes-or-no question even though it cannot answer how far. Through the pair, like everything
	// else, rather than reaching for cartesianY() -- which is what this count is for.
	// **TASK 641 PHASE 2 ADDED ONE SITE TO EACH PAIR, AND IT IS A READING RATHER THAN A
	// CONVERSION.** openCrsBox() asks where the map is looking so the Geographic projection box can
	// filter the catalogue to the projections that cover it, and "where on the Earth" is exactly
	// what the outward pair answers. It reads the CAMERA, never a stored coordinate, and writes
	// nothing anywhere -- and it takes the branch only for a geographic project, because a
	// projected or local view is not a place the outward pair could name.
	// **TASK 641 PHASE 5 ADDED TWO SITES TO EACH PAIR, AND THEY ARE THE PROJECTED BASEMAP.**
	// paintBasemapTiles() asks which patch of the Earth the view covers so it knows which tiles to
	// fetch, and in a PROJECTED project that question can only be answered by handing the plane's
	// own eastings and northings to the transform -- so the two screen corners go out through this
	// pair exactly as the geographic branch beside them already did. Reading the camera, writing
	// nothing.
	// **AND THEN THE DEM WORK TOOK ONE BACK OFF EACH, WHICH IS THE DIRECTION THIS COUNT WANTS TO
	// MOVE.** terrainPointsForIds() and terrainNodesNeedingElevation() each converted a node's
	// coordinates themselves; both now go through nodeLonLat(), which is the ONE place a node
	// becomes a place on the Earth whichever kind of project holds it. Two readers of the same
	// question became one, so the census fell from 26 to 25.
	// **AND ONE MORE OFF EACH when the THIRD terrain list joined the other two behind
	// nodeLonLat().** terrainNodesAtDefaultElevation() still converted for itself, and on a
	// projected project it therefore answered "no nodes are on the starting elevation" -- the
	// list that matters most there, because every node just drawn is on it. Tom saw the result
	// as the DEM having no data for Novato. Three readers of one question are now one: 25 -> 24.
	// **AND TWO MORE ON EACH OUTWARD CONVERTER FOR THE LABEL OFFSETS** (Task 668). A label offset
	// is a VECTOR, so the origin shift must not apply to it -- which is exactly why
	// eachStoredPoint() does not visit one and why this census would otherwise never see it. But a
	// REPROJECTION changes the unit the vector is written in, and nothing re-derived them: Elm
	// Street Center's stored `lx = -57` became 57 DEGREES and its label landed in China (Tom,
	// 2026-09-15). georefCaptureOffsets() converts a BASE and a TIP -- two points, not a vector --
	// so the shift and the flip apply exactly once to each and cancel in the difference. Two points
	// is why it is +2 and not +1: converting the vector directly is the mistake this task exists to
	// catch, and it would have been +1.
	// **AND ONE MORE ON EACH CONVERTER FOR THE WORLD MAP BEHIND AN XY DRAWING** (Task 646). The
	// attachment places tiles THROUGH a stored transform instead of rewriting the drawing, so
	// paintBasemapTiles() asks which patch of Earth is on screen by reading the two screen corners
	// OUTWARD (one call per axis, both corners in one expression) and places each tile by turning
	// its own longitude and latitude INWARD (one call per axis). Same boundary as every other one
	// here: a grid model on State Plane coordinates would otherwise draw its map half a million
	// units away from its own pipes.
	// **AND ONE MORE ON EACH FOR THE METER'S REAL-WORLD SIZE** (Task 247). A meter is drawn about
	// 2 m across while the site is small enough for that to be legible, and how many metres one
	// drawing unit is depends on WHERE you are once the drawing unit is a degree -- so
	// metresPerWorldUnit() measures it with geodesicMeters(), which needs the point as a longitude
	// and a latitude. Reading the drawing, writing nothing. One crossing per axis and not two: the
	// function holds `lon` and `lat` in locals rather than converting the same point twice, which
	// is this census asking for the honest minimum exactly as inwardBox() was made to.
	// **AND ONE MORE ON EACH OF THE FOUR FOR A METER'S TYPED LOCATION** (Task 247; Tom, 2026-09-17:
	// *"Pick location, pick pipe, repeat"*, and a table row per customer carrying both). A meter's
	// position is read out for the two location columns and written back from them, so it is a
	// boundary of exactly the kind this census counts: customerCoordAxis() crosses outward once per
	// axis and setCustomerCoordAxis() crosses inward once per axis, and each is the ONLY reader of
	// its own question -- the setter takes the axis it was given and leaves the other alone rather
	// than converting a whole point twice.
	// **TASK 674 MOVED A SITE RATHER THAN ADDING ONE, ON EACH OUTWARD AXIS, AND THE NET ZERO IS
	// WORTH SAYING OUT LOUD.** The node property popup used to convert both axes at its own call to
	// coordFields(); it now reads them through nodeCoordAxis(), which is the one place a read SLOT
	// becomes a document axis, so the popup's two sites became that function's two. A future reader
	// seeing this total unchanged across a coordinate-entry feature should know it was checked.
	// **AND THEN THE SCENARIO OVERRIDE ADDED TWO TO EACH, NET, WHICH IS FOUR NEW SITES AND TWO
	// RETIRED ONES** (Task 674's second half, Tom: *"Give the people their overrides!"*). A
	// coordinate override stores the PUBLIC pair, so the frame boundary is exactly where it is
	// crossed. The four: writeNodeCoord() -- the one writer -- converts whichever half its caller
	// did not hand it; effective() and baseValue() answer the popup, the tables and the marker's
	// "Base scenario:" line in outward terms for the two bare-stored properties; and
	// georefCaptureCoordOverrides() completes an override's missing axis from the node's own
	// position, because the wizard's transform needs a point and an override may hold one axis. The
	// two retired: nodeCoordAxis() and nodeLonLat() now ask effective(), which is the SAME
	// consolidation the DEM lists made twice above -- one reader of "where is this node" rather than
	// three.
	// **THE CUSTOM GEOREFERENCE WIZARD ADDED ONE SITE TO EACH PAIR, AND THEY ARE ONE ROUND TRIP.**
	// mapgeoPointerSrc() reads where the pointer is in the drawing's own outward terms, because a
	// gesture there is measured against the ground rather than against the screen; mapgeoInward()
	// puts the rectangle back into the drawing frame to be drawn. The wizard writes no coordinate
	// at all -- it edits the transform -- so these two are the whole of its boundary, and having
	// them here is what stops a third one reaching for cartesianY() on its own.
	// **AND ONE MORE EACH FOR viewLonLat()** (Task 692), which is where on the Earth the middle of
	// the camera is. It is nodeLonLat() asked of the view rather than of an element, and it crosses
	// the boundary the same way: outwardX/outwardY on the view centre, then the projection's own
	// inverse. It exists because the audit of every isLatLonProject() reader turned up one -- the New
	// project box's place pre-fill -- that asked "are these numbers a longitude and a latitude"
	// where it meant "can this project say where on the Earth it is". Both call sites are inside
	// the one function, which is the point: the question is asked once. **NET ONE EACH, NOT TWO**:
	// the pre-fill's own inline pair was the site that moved into it.
	// **AND TWO MORE EACH FOR A CUSTOMER'S OFFSET** (Task 247, Tom 2026-09-18: *"add Offset in
	// properties and tables"*). An offset is a DISTANCE ACROSS THE GROUND in the length unit, and
	// the drawing frame of a geographic project is degrees, where a degree is worth a different
	// distance at every latitude and on each axis. So customerOffsetUnitsPerDrawn() measures the
	// scale on the very direction the offset runs, which is two points crossing outward per axis --
	// the same door, and the same geodesic, linkGeomLength() takes a pipe's Auto length through.
	// **THE INWARD PAIR GAINS NOTHING**, and that asymmetry is the design rather than an oversight:
	// a typed offset is converted to drawing units by DIVIDING by that same measured scale, so it
	// never states a longitude or a latitude of its own for anything to convert.
	ok('outwardX has one definition and 34 call sites', count(/outwardX\(/g) === 35, count(/outwardX\(/g));
	ok('outwardY has one definition and 34 call sites', count(/outwardY\(/g) === 35, count(/outwardY\(/g));
	// The inward pair gained one site each with Task 145's geographic home view: a longitude and a
	// latitude the code states in WORLD terms have to be converted into the document's local frame
	// like any other outside number, or a project with a local origin opens on the wrong continent.
	// A TILE'S CORNERS ARE THE SAME KIND OF NUMBER and go through the same door -- a tile is placed
	// from its own longitude and latitude, so basemapTileList() adds one x site and two y sites (a
	// box needs its north edge and its south). Skipping the shift there would draw the street map
	// half a million units away from the network it is supposed to be under.
	// Go to latitude, longitude (Task 145) adds one site to each: a coordinate the USER pasted is an
	// outside number like any other and has to be brought into the document's local frame, or typing
	// a real coordinate into a State Plane project would travel half a million units.
	// ...and the placement tool's own whole-Earth opening view states a longitude and a latitude in
	// WORLD terms, which is one more inward site on each axis.
	// Task 447's REINTERPRET path adds one site to each pair, in the same shape georefCancel() has:
	// when a file's coordinates can be read as degrees, the wizard writes them back exactly as they
	// came in -- captured OUTWARD, written INWARD -- so the numbers are the file's own bytes and a
	// document with a local origin still lands where it belongs.
	// ...and Task 436's backdrop is the other half of the same boundary, written INWARD.
	// **THE PLACE-NAME SEARCH'S EXTENT ADDED TWO SITES TO EACH AXIS AND NOT EIGHT** (2026-09-12).
	// A geocoder result now arrives with the bounding box OSM sent, and framing it needs the box's
	// width, its height and its centre -- which, computed from the geographic numbers where each is
	// needed, crosses this boundary eight times for one box. `inwardBox()` converts the two edges of
	// each axis ONCE and everything after it is drawing units, so the cost is the honest minimum:
	// two x edges and two y edges. That refactor was made because THIS COUNT went red, which is the
	// assertion doing the job it was written for rather than an inconvenience to be re-baselined.
	// **AND TASK 641 PHASE 5 ADDS FOUR INWARD SITES: THREE TILE CORNERS AND THE ARRIVAL.**
	// A projected tile is placed from three corners transformed into the plane, and every one of
	// them is an outside number that has to come through this door -- skipping it would draw the
	// street map half a million units from the network, which is the defect this whole census
	// exists to make impossible. The fourth is createProjectFrom(): a new projected project now
	// opens ON the place the wizard searched for, and that point arrives as an easting and a
	// northing like any other. **THE y SIDE IS THE ONE THAT BITES** -- inwardY negates, so a
	// northing that skipped it would draw the world upside down and still look like a map.
	// **AND ONE MORE EACH FOR TRAVELLING INTO A PLANE.** goToPoint() is the single door for "take
	// me to this latitude and longitude", and a projected project answers it by projecting the
	// point and then bringing it into the local frame like any other outside number. Widening
	// that door is what put Map > Go to and Map > Search place name back on a projected project
	// (Tom, 2026-09-14: *"I don't think it's necessary or intentional"* -- it was not; the rows
	// were written `isLatLonProject()` before there was a transform).
	// **AND ONE MORE EACH COMING BACK** (Task 668): georefWriteOffsets() maps the captured base and
	// tip through the transform and differences them, and both halves come home through the one
	// door, exactly as georefWrite() itself does for a position.
	// The other half of the meter-location pair above: one inward crossing per axis, in the setter.
	// **AND ONE MORE EACH FOR A TYPED COORDINATE** (Task 674). setNodeCoordAxis() is the one seam a
	// number a person types into a northing or a latitude comes through -- the property popup's two
	// boxes and the three node tables' two columns all go through it -- and it is an outside number
	// in exactly the sense every other site here is. **THE y SIDE IS THE ONE THAT BITES**: inwardY
	// both negates and, in a geographic project, projects, so a latitude written straight into the
	// document would land upside down and half a world away and still look like a coordinate.
	// **THE INWARD PAIR GAINED TWO EACH FOR THE SCENARIO OVERRIDE, AND THEY ARE THE HOT ONE AND THE
	// COLD ONE** (Task 674). nodeDrawX/nodeDrawY convert an override into the drawing's frame, which
	// is the site the whole renderer, the label pass and the bounding box come through -- and where
	// there is no override they return the field untouched, so a Base drawing still pays nothing at
	// all. writeNodeCoord() is the other: a typed box hands it the public number and it converts
	// once, which is what keeps a typed 38.5 stored as 38.5.
	// **AND ONE MORE EACH FOR A SURVEYED POINT LIST** (Task 592). Every junction made from a
	// surveyed file arrives as a pair of numbers out of somebody's file, which is the definition of
	// an outside number: it comes through this door once, in createSurveyJunctions(), and the file's
	// own value rides beside the drawn one so the save hands it back unchanged.
	// **AND ONE SITE EACH CAME OFF WHEN THE WORLD-MAP WIZARD'S RECTANGLE WAS DELETED** (2026-09-19,
	// Tom: *"The rectangle control is gone."*). mapgeoInward() was its own one-line crossing, used
	// only to draw that overlay; the two sliders that replace it edit the transform and draw
	// nothing in the drawing frame at all, so the boundary got SMALLER. Worth saying out loud
	// because every other movement of these numbers in this file has been upward.
	// **AND ONE MORE EACH FOR PROJECT1's OWN HOME VIEW** (R-208). `firstVisitHomeView()` states
	// Downtown Novato Center in WORLD terms, exactly as `geoHomeView()` already does for
	// LPN_GEO_HOME -- a longitude and a latitude the code writes have to come through this door
	// like any other outside number, or a first visit with a local origin would open over the
	// wrong continent.
	ok('inwardX has one definition and 31 call sites', count(/inwardX\(/g) === 32, count(/inwardX\(/g));
	ok('inwardY has one definition and 32 call sites', count(/inwardY\(/g) === 33, count(/inwardY\(/g));
	// And nothing else may take the flip on its own: a site that flips without shifting is exactly
	// the mistake this task exists to prevent.
	ok('cartesianY is called only by the two converters', count(/cartesianY\(/g) === 3,
		count(/cartesianY\(/g) + ' (1 definition + outwardY + inwardY)');
}

// ---- 6. An .inp import is rebased on the way in ----------------------------------------------
console.log('\n--- the door real survey coordinates actually come through ---');
{
	// An import is stamped at the CURRENT version, so it walks no migration steps -- which makes
	// this the one entry point the version chain could never have covered.
	const inp = [
		'[JUNCTIONS]', ' J1 100 10', ' J2 101 12',
		'[RESERVOIRS]', ' R1 200',
		'[PIPES]', ' P1 R1 J1 300 200 100 0 Open', ' P2 J1 J2 400 200 100 0 Open',
		'[COORDINATES]',
		' J1 ' + SURVEY_X + ' ' + SURVEY_Y,
		' J2 ' + (SURVEY_X + 300) + ' ' + (SURVEY_Y + 120),
		' R1 ' + (SURVEY_X - 200) + ' ' + (SURVEY_Y - 100),
		'[END]'
	].join('\n');
	const parsed = global.EngCalcs.lpnInpParse(inp);
	const saved = L.docFromInp(parsed, 'survey.inp');
	ok('the import carries an origin', saved.origin && saved.origin.x !== 0, JSON.stringify(saved.origin));
	const j1 = saved.nodes.find(n => n.id === 'J1');
	ok('...its nodes are local', Math.abs(j1.x) < 1e4 && Math.abs(j1.y) < 1e4, j1.x + ', ' + j1.y);
	ok('...and they add back up to what the file said',
		near(saved.origin.x + j1.x, SURVEY_X) && near(saved.origin.y + j1.y, SURVEY_Y),
		(saved.origin.x + j1.x) + ', ' + (saved.origin.y + j1.y));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

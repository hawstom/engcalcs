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
	ok('outwardX has one definition and twelve call sites', count(/outwardX\(/g) === 13, count(/outwardX\(/g));
	ok('outwardY has one definition and twelve call sites', count(/outwardY\(/g) === 13, count(/outwardY\(/g));
	// The inward pair gained one site each with Task 145's geographic home view: a longitude and a
	// latitude the code states in WORLD terms have to be converted into the document's local frame
	// like any other outside number, or a project with a local origin opens on the wrong continent.
	// A TILE'S CORNERS ARE THE SAME KIND OF NUMBER and go through the same door -- a tile is placed
	// from its own longitude and latitude, so basemapTileList() adds one x site and two y sites (a
	// box needs its north edge and its south). Skipping the shift there would draw the street map
	// half a million units away from the network it is supposed to be under.
	ok('inwardX has one definition and nine call sites', count(/inwardX\(/g) === 10, count(/inwardX\(/g));
	ok('inwardY has one definition and ten call sites', count(/inwardY\(/g) === 11, count(/inwardY\(/g));
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

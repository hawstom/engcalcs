// A GEOGRAPHIC document's derived origin -- ROADMAP Task 439. Run with:
//   node dev/lpn-spike/geo-origin-harness.js
//
// WHAT THIS GUARDS. Task 354 gave a survey document a local origin and the drawing came back.
// A geographic document never got one: LPN_ORIGIN_THRESHOLD is 1e4, a longitude is 122, so
// chooseOrigin() returned null for every lat/lon file that has ever existed -- while maxScale()
// for one is 5.56e7 px/degree. dev/lpn-spike/geo-precision-harness.js measures what that costs
// (half a pixel lost at 64,000 px/degree; 575 px at the deepest permitted zoom) and proves the
// arithmetic of the fix. THIS file checks the PAGE does it, and does it without touching one of
// the user's numbers.
//
// THE TWO THINGS THAT MATTER, and they pull against each other:
//   1. the numbers handed to the renderer must be SMALL -- that is the whole point;
//   2. the numbers written back to the file must be BIT-IDENTICAL to the ones read out of it --
//      CLAUDE.md's "only the user touches a file's numbers", and not "within tolerance".
// (2) is why the origin is a power-of-two fraction of a degree. Section 3 is the assertion that
// would fail on a decimal grid, and it is the one to keep if any of this is ever rewritten.
//
// WHAT THIS CANNOT SEE, said plainly: nothing here rasterises anything, so no assertion below
// would change if float32 were float64. The float32 story is geo-precision-harness.js's; this
// file's job is that the page derives, applies and reverses the origin correctly.

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tprepareDocument: prepareDocument,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\tgeoGrid: function () { return LPN_GEO_ORIGIN_GRID; },\n" +
	"\t\tchooseGeoOrigin: chooseGeoOrigin, rebaseGeoDocument: rebaseGeoDocument,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, inwardX: inwardX, inwardY: inwardY,\n" +
	"\t\tdocOrigin: docOrigin,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// Novato, California -- the site geo-precision-harness.js measures, so the two files talk about
// the same place. Longitude ~ -122.57 is the number that breaks a float32; the latitudes are a
// few hundred metres apart, which is an ordinary site rather than a contrived one.
const LON = -122.5694, LAT = 38.1074, D = 0.0025;

// A stored geographic document, in the FILE's frame: Cartesian Y, ABSOLUTE longitude and latitude,
// and `view`/`backdrop` absolute in the DRAWING frame -- which is what Option B means. Written at
// the current storage version, because the whole point of Option B is that the format does not
// move: this is byte-for-byte the shape a v10 geographic file already had.
function geoDoc() {
	return {
		v: L.storageVersion(),
		project: { name: 'novato', activeScenario: 'base', coords: 'geo' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: [
			{ id: 'J1', type: 'junction', x: LON, y: LAT, elev: 100 },
			{ id: 'J2', type: 'junction', x: LON + D, y: LAT + D, elev: 101, ly: -4 }
		],
		links: [{ id: 'P1', type: 'pipe', from: 'J1', to: 'J2',
			verts: [{ x: LON + D / 2, y: LAT + D / 3 }] }],
		labels: [
			{ id: 'X1', _text: 'free', x: LON + D / 4, y: LAT + D / 4, anchorNode: null },
			{ id: 'X2', _text: 'tied', x: 5, y: -7, anchorNode: 'J1' }
		],
		nextId: { J: 3, R: 1, L: 2, P: 1, T: 1, X: 3 },
		units: {}
	};
}

console.log('--- 1. the origin is DERIVED, and it is on the power-of-two grid ---');
{
	const org = L.chooseGeoOrigin(geoDoc());
	const grid = L.geoGrid();
	ok('a geographic document gets a non-zero origin', org.x !== 0 || org.y !== 0, JSON.stringify(org));
	ok('...and it is an exact multiple of the grid',
		org.x / grid === Math.round(org.x / grid) && org.y / grid === Math.round(org.y / grid),
		org.x + ' / ' + grid + ' = ' + (org.x / grid));
	// Floored, so local coordinates come out small and positive -- the same reason chooseOrigin()
	// floors for a survey grid.
	ok('...at or below the westernmost longitude, never past it', org.x <= LON, org.x + ' <= ' + LON);
	ok('...and the local coordinates it produces are SMALL, which is the whole point',
		Math.abs(LON - org.x) < 1 && Math.abs(LON - org.x) >= 0, 'local x = ' + (LON - org.x));

	// **AN ANCHORED LABEL IS AN OFFSET AND MUST NOT VOTE.** X2 sits at (5, -7) relative to its
	// node; counted as a position it would drag the origin to (0, -8) and every real coordinate
	// would stay enormous -- the fix silently doing nothing, which is the worst outcome here.
	ok('an anchored label does not drag the origin to zero', org.x < -100, JSON.stringify(org));
}

console.log('\n--- 2. the shift is invisible: every outward coordinate is unchanged ---');
{
	const before = geoDoc();
	L.applySaved(L.prepareDocument(geoDoc()));
	const doc = L.getDoc();
	ok('the open document really did get an origin',
		L.docOrigin().x !== 0 || L.docOrigin().y !== 0, JSON.stringify(L.docOrigin()));
	// outwardX/outwardY are what every user-facing readout, every export and every terrain lookup
	// go through, so if these are the file's numbers, nothing a person can see has moved.
	const pairs = [
		['J1', doc.nodes[0], before.nodes[0]],
		['J2', doc.nodes[1], before.nodes[1]],
		['P1 vertex', doc.links[0].verts[0], before.links[0].verts[0]],
		['free label', doc.labels[0], before.labels[0]]
	];
	pairs.forEach(function (row) {
		const a = row[1], b = row[2];
		ok(row[0] + ': outward is the longitude and latitude the file stated',
			Math.abs(L.outwardX(a.x) - b.x) < 1e-12 && Math.abs(L.outwardY(a.y) - b.y) < 1e-12,
			L.outwardX(a.x).toFixed(7) + ', ' + L.outwardY(a.y).toFixed(7) +
			'  (file ' + b.x + ', ' + b.y + ')');
	});
	ok('...and the drawn numbers really are small', Math.abs(doc.nodes[1].x) < 1,
		'drawn x = ' + doc.nodes[1].x);
}

console.log('\n--- 3. THE RULE: open and save is BIT-IDENTICAL, not merely close ---');
{
	// CLAUDE.md, absolute: a number that came from a file is the user's, and comes back out
	// unchanged. Not "within tolerance" -- identical. This is the assertion a decimal origin grid
	// fails and a power-of-two one passes, and it is why the grid is 1/128.
	const before = geoDoc();
	L.applySaved(L.prepareDocument(geoDoc()));
	const out = L.serializeProject();
	const cmp = [
		['J1 x', out.nodes[0].x, before.nodes[0].x], ['J1 y', out.nodes[0].y, before.nodes[0].y],
		['J2 x', out.nodes[1].x, before.nodes[1].x], ['J2 y', out.nodes[1].y, before.nodes[1].y],
		['vertex x', out.links[0].verts[0].x, before.links[0].verts[0].x],
		['vertex y', out.links[0].verts[0].y, before.links[0].verts[0].y],
		['label x', out.labels[0].x, before.labels[0].x],
		['label y', out.labels[0].y, before.labels[0].y]
	];
	cmp.forEach(function (row) {
		ok(row[0] + ' comes back as the identical double', row[1] === row[2],
			String(row[1]) + ' vs ' + String(row[2]));
	});
	// Option B's other half: the file states the identity, so a page that predates this change
	// still reads the file correctly.
	ok('the file states origin {0, 0}, so the format did not move',
		out.origin && out.origin.x === 0 && out.origin.y === 0, JSON.stringify(out.origin));
	ok('...and the stored coordinates are absolute longitude and latitude',
		Math.abs(out.nodes[0].x - LON) < 1e-12, String(out.nodes[0].x));
}

console.log('\n--- 4. a round trip is stable, so repeated saving cannot drift ---');
{
	L.applySaved(L.prepareDocument(geoDoc()));
	const first = L.serializeProject();
	L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(first))));
	const second = L.serializeProject();
	// The failure this catches is a slow one: an origin derived slightly differently each time, or
	// an add-back that is not the exact inverse, moves a coordinate by a hair per save. Nobody
	// notices until a file has been opened fifty times.
	ok('saving, opening and saving again produces the identical bytes',
		JSON.stringify(first.nodes) === JSON.stringify(second.nodes) &&
		JSON.stringify(first.links) === JSON.stringify(second.links) &&
		JSON.stringify(first.labels) === JSON.stringify(second.labels),
		JSON.stringify(second.nodes[0]));
}

console.log('\n--- 5. an XY document is untouched by any of this ---');
{
	// The geographic path must not reach a grid document: chooseOrigin()/LPN_ORIGIN_THRESHOLD
	// still own that case, and a small XY drawing is supposed to get {0, 0} and be left alone.
	const xy = geoDoc();
	delete xy.project.coords;
	xy.nodes[0].x = 10; xy.nodes[0].y = 20;
	xy.nodes[1].x = 40; xy.nodes[1].y = 50;
	xy.links[0].verts[0] = { x: 25, y: 35 };
	xy.labels[0].x = 15; xy.labels[0].y = 25;
	L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(xy))));
	const org = L.docOrigin();
	ok('a small XY document still gets no origin', org.x === 0 && org.y === 0, JSON.stringify(org));
	const out = L.serializeProject();
	ok('...and its coordinates are the ones it arrived with',
		out.nodes[0].x === 10 && out.nodes[0].y === 20,
		JSON.stringify({ x: out.nodes[0].x, y: out.nodes[0].y }));
}

console.log('\n' + (fails ? fails + ' FAILURES' : 'all geographic-origin assertions passed'));
process.exit(fails ? 1 : 0);

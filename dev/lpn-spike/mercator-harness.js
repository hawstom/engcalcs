// THE PROJECTION SEAM -- ROADMAP Task 145. Run with:
//   node dev/lpn-spike/mercator-harness.js
//
// A GEOGRAPHIC DOCUMENT IS DRAWN IN WEB MERCATOR AND STORED IN LONGITUDE AND LATITUDE. Two frames,
// one boundary: outwardY()/inwardY() in js/looped-network.js, the same pair Task 354 built for the
// origin shift. This file is about the boundary, not about the arithmetic -- the arithmetic is four
// lines in js/lpn-geom.js and section 1 pins it in passing.
//
// THE TWO WAYS THIS GOES WRONG, and both are silent:
//
//   1. **A SITE THAT SHOULD HAVE PROJECTED DID NOT** -- or projected twice. Wrong only in a
//      geographic project and only away from the equator, so it is invisible in a diff, invisible in
//      English, and invisible in every test drawn near latitude zero. Sections 2 and 6 are about
//      that: the boundary is exactly invertible, and it is spelled in a COUNTED number of places.
//   2. **THE PROJECTION REACHED THE FILE.** mercLat(mercY(lat)) is a different double for 70% of
//      latitudes (section 1 measures it), so a document that stored its projection would come back
//      from every open-and-save with every latitude quietly rewritten -- a THIRD conversion site on
//      the user's own numbers, which CLAUDE.md forbids in terms. Sections 3, 4 and 5 are the
//      byte-identity half, and they are the reason the seam is where it is rather than in the file.
//
// WHAT THIS CANNOT SEE: the picture. That the map now has the shape its basemap has is a claim about
// pixels, and section 7 gets as close as arithmetic can -- it measures the anisotropy that WAS there
// -- but only a browser shows a city that looks like its own map.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');
const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\tmigrateSaved: migrateSaved, serializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, inwardX: inwardX, inwardY: inwardY,\n" +
	"\t\tisGeo: isGeoProject, docOrigin: docOrigin, docFromInp: docFromInp,\n" +
	"\t\tdocSignature: docSignature,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetGeo: function (on) { if (on) { project.coords = 'geo'; } else { delete project.coords; } },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 }; }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---- 1. the projection itself -------------------------------------------------------------------
// Written from the definition here rather than read off the page: a harness that calls the code it
// is checking proves only that the code agrees with itself.
console.log('\n--- 1. Web Mercator, from the definition ---');
const refMerc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
let worstDef = 0;
for (let lat = -84; lat <= 84; lat += 0.37) {
	worstDef = Math.max(worstDef, Math.abs(Geom.mercY(lat) - refMerc(lat)));
}
ok('mercY() is ln(tan(PI/4 + lat/2)), to a part in 1e11', worstDef < 1e-11, worstDef.toExponential(2));
ok('the equator is the origin of the drawing frame', Geom.mercY(0) === 0);
ok('...and the cut-off latitude is exactly 180, which is why a world map is SQUARE',
	Math.abs(Geom.mercY(Geom.mercMaxLat) - 180) < 1e-9, Geom.mercY(Geom.mercMaxLat).toFixed(9));
ok('...so x and y share one unit and the view transform stays a UNIFORM scale',
	Math.abs(Geom.mercY(45) - 50.4990) < 1e-3, Geom.mercY(45).toFixed(4) + ' units at 45 N');
let mono = true, prev = -Infinity;
for (let lat = -85; lat <= 85; lat += 0.11) {
	const m = Geom.mercY(lat);
	if (!(m > prev)) { mono = false; }
	prev = m;
}
ok('it is strictly increasing across the drawable world', mono);
// Not `===`: tan() and cos() are not exactly symmetric about zero in doubles, so the two
// hemispheres agree to a part in 1e15 rather than bit for bit. Nothing is drawn at that size.
ok('...and odd, so the two hemispheres are mirror images',
	Math.abs(Geom.mercY(-38.106067) + Geom.mercY(38.106067)) < 1e-13,
	Geom.mercY(-38.106067) + ' vs ' + (-Geom.mercY(38.106067)));
ok('a latitude past the cut-off is CLAMPED, never NaN and never infinite',
	isFinite(Geom.mercY(90)) && Geom.mercY(90) === Geom.mercY(Geom.mercMaxLat) &&
	isFinite(Geom.mercY(-90)));

// **THE MEASUREMENT THAT DECIDES WHERE THE SEAM GOES.** If mercLat(mercY(lat)) were the identity in
// doubles, the document could simply store its projection and everything below would be unnecessary.
// It is not, and the failure rate is not a rounding curiosity -- it is most of the numbers.
let bad = 0, worstRT = 0;
const N = 200000;
for (let i = 0; i < N; i++) {
	const lat = (Math.random() * 2 - 1) * 84;
	const back = Geom.mercLat(Geom.mercY(lat));
	if (back !== lat) { bad++; worstRT = Math.max(worstRT, Math.abs(back - lat)); }
}
ok('mercLat(mercY(lat)) is a DIFFERENT DOUBLE for most latitudes -- which is why the file is not projected',
	bad / N > 0.5, (100 * bad / N).toFixed(1) + '% of ' + N + ' samples, worst ' + worstRT.toExponential(2) + ' deg');
ok('...but it is exact as ARITHMETIC, so nothing is drawn in the wrong place',
	worstRT < 1e-11, worstRT.toExponential(2) + ' degrees');

// ---- 2. the boundary --------------------------------------------------------------------------
// outwardY()/inwardY() are the whole of it. Both directions, both project kinds.
console.log('\n--- 2. inwardY / outwardY, the one boundary ---');
L.reset();
L.setGeo(false);
ok('a GRID project is untouched: inwardY is still the plain flip',
	L.inwardY(1234.5) === -1234.5 && L.outwardY(-1234.5) === 1234.5);
ok('...and its x is untouched in both kinds', L.inwardX(-122.5) === -122.5);

L.setGeo(true);
let worstInv = 0, worstDrawn = 0;
for (let lat = -84; lat <= 84; lat += 0.29) {
	const mem = L.inwardY(lat);
	worstInv = Math.max(worstInv, Math.abs(L.outwardY(mem) - lat));
	// The drawn number is minus the Mercator y: memory is y-DOWN and the file is y-up.
	worstDrawn = Math.max(worstDrawn, Math.abs(mem + Geom.mercY(lat)));
}
ok('a GEOGRAPHIC project draws minus the Mercator y of the latitude', worstDrawn < 1e-12,
	worstDrawn.toExponential(2));
ok('...and outwardY undoes inwardY over the whole drawable world', worstInv < 1e-11,
	worstInv.toExponential(2) + ' degrees');
ok('...while x still needs nothing, because Mercator x IS longitude',
	L.inwardX(-122.5686103) === -122.5686103 && L.outwardX(-122.5686103) === -122.5686103);
// The mistake this catches is the commonest one: projecting twice, or in the wrong direction.
ok('the boundary is not the identity, so a missing call is a real error, not a no-op',
	Math.abs(L.inwardY(38.106067) + 38.106067) > 3, L.inwardY(38.106067).toFixed(6));

// ---- 3. the file keeps its own bytes -----------------------------------------------------------
// The same standard the .inp round trip is held to, applied to our own document: open a geographic
// project, save it, and every coordinate must be the character-for-character number that came in.
console.log('\n--- 3. open then save is byte-identical ---');
const LATS = [38.106067, -33.8688, 51.5072, 0, 60.1699, -0.1, 84.9, 1e-7];
const geoFile = {
	format: 'lwn', app: 'engcalcs', v: 10,
	project: { name: 'World', activeScenario: 'base', coords: 'geo' },
	scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
	origin: { x: 0, y: 0 },
	nodes: LATS.map((lat, i) => ({
		id: 'J' + (i + 1), type: 'junction', x: -122.5686103 + i * 0.01, y: lat, _elev: 10, _demand: 0
	})),
	links: [{ id: 'L1', type: 'pipe', from: 'J1', to: 'J2', _len: 100, _dia: 200, _rough: 130,
		verts: [{ x: -122.56, y: 38.1061 }] }],
	labels: [{ id: 'T1', _text: 'note', x: -122.55, y: 38.11 }],
	nextId: { J: 9, R: 1, L: 2, P: 1, T: 2 },
	view: { cx: -122.5, cy: 41.27, s: 5000 },
	units: {}
};
L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(geoFile))));
const out1 = L.serializeProject();
let sameBytes = true, drawnProjected = true, offenders = [];
out1.nodes.forEach((n, i) => {
	if (n.y !== LATS[i]) { sameBytes = false; offenders.push(n.id + ' ' + n.y + ' != ' + LATS[i]); }
});
ok('every latitude comes back as the exact double the file stated', sameBytes, offenders.join('; '));
ok('...including a vertex and a text label, which are coordinates too',
	out1.links[0].verts[0].y === 38.1061 && out1.labels[0].y === 38.11,
	out1.links[0].verts[0].y + ', ' + out1.labels[0].y);
ok('...and every longitude, untouched',
	out1.nodes.every((n, i) => n.x === geoFile.nodes[i].x));
L.getDoc().nodes.forEach((n, i) => {
	if (Math.abs(n.y + Geom.mercY(LATS[i])) > 1e-12) { drawnProjected = false; }
});
ok('...while the DRAWING really is projected, so this is not passing by doing nothing',
	drawnProjected && Math.abs(L.getDoc().nodes[0].y + 41.2723804) < 1e-6,
	L.getDoc().nodes[0].y.toFixed(7));
// The pass-through is guarded by a VALUE COMPARISON, not by discipline: nothing has to remember to
// clear it. Moving one node must re-derive that one and leave the other seven alone.
L.getDoc().nodes[2].y = L.inwardY(51.6);
const out2 = L.serializeProject();
ok('an EDITED node is re-derived from what is drawn', Math.abs(out2.nodes[2].y - 51.6) < 1e-11 &&
	out2.nodes[2].y !== LATS[2], out2.nodes[2].y);
ok('...and no other node moved by a bit', out2.nodes.every((n, i) => i === 2 || n.y === LATS[i]));
ok('the marker never reaches the file', JSON.stringify(out2).indexOf('_ysrc') === -1);
// A pan changes the view and nothing else; a document nobody touched must not raise the asterisk.
ok('saving twice with nothing touched produces the identical document',
	JSON.stringify(L.serializeProject()) === JSON.stringify(out2));

// A GRID document must be entirely unaffected by all of the above.
const gridFile = JSON.parse(JSON.stringify(geoFile));
delete gridFile.project.coords;
L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(gridFile))));
ok('a grid document round-trips exactly as it always did',
	L.serializeProject().nodes.every((n, i) => n.y === LATS[i] && n.x === gridFile.nodes[i].x));

// ---- 4. the v9 -> v10 step ---------------------------------------------------------------------
// Coordinates are lon/lat at EVERY version and are not migrated. What moves is the pair of
// drawing-frame numbers that are ours: where the reader was looking, and where an image sits.
console.log('\n--- 4. a v9 geographic document opens where it was left ---');
const v9 = JSON.parse(JSON.stringify(geoFile));
v9.v = 9;
v9.view = { cx: -122.5, cy: 38.106067, s: 5000 };
v9.backdrop = { href: 'x', iw: 10, ih: 10, x: 0, y: 0, width: 1, height: 1, tx: -122.5, ty: 38.2, s: 1 };
const m9 = L.migrateSaved(v9);
ok('it is stamped v10', m9.v === 10, m9.v);
ok('...its VIEW centre is converted once, from a latitude to a drawing y',
	Math.abs(m9.view.cy - Geom.mercY(38.106067)) < 1e-12, m9.view.cy);
ok('...and so is the background image\'s anchor',
	Math.abs(m9.backdrop.ty - Geom.mercY(38.2)) < 1e-12, m9.backdrop.ty);
ok('...and NOT one coordinate, which is stored in lon/lat at every version',
	m9.nodes.every((n, i) => n.y === LATS[i]));
const v9grid = JSON.parse(JSON.stringify(geoFile));
v9grid.v = 9; delete v9grid.project.coords;
v9grid.view = { cx: 100, cy: 200, s: 1 };
const m9g = L.migrateSaved(v9grid);
ok('a v9 GRID document is stamped and otherwise untouched',
	m9g.v === 10 && m9g.view.cy === 200 && m9g.nodes.every((n, i) => n.y === LATS[i]));
ok('the page writes v10', L.storageVersion() === 10, L.storageVersion());

// ---- 5. an `.inp` in DEGREES, through the page and back out ------------------------------------
// dev/lpn-spike/inp-export-harness.js reads a document straight out of docFromInp() and never opens
// it, so the projection is not on its path at all. This is the same acceptance criterion -- import
// then export is BYTE-IDENTICAL for every value the user did not edit -- taken through applySaved(),
// which is the route a real import takes and the one the projection sits on.
console.log('\n--- 5. a DEGREES .inp survives the round trip ---');
const INP = [
	'[TITLE]', ' World', '',
	'[JUNCTIONS]', ' J1  32.5  100.0', ' J2  31.0  0', '',
	'[RESERVOIRS]', ' R1  260', '',
	'[PIPES]', ' P1  R1  J1  1200.0  12.0  130  0  Open',
	' P2  J1  J2  850.5  8.0  130  0  Open', '',
	'[COORDINATES]', ' J1  -122.5686103  38.106067', ' J2  -122.5700  38.1070',
	' R1  -122.5800  38.1100', '',
	'[VERTICES]', ' P1  -122.5750  38.1085', '',
	'[BACKDROP]', ' UNITS  DEGREES', '',
	'[OPTIONS]', ' UNITS  GPM', ' HEADLOSS  H-W', '',
	'[END]', ''
].join('\n');
const parsed = EngCalcs.lpnInpParse(INP);
ok('the file declares DEGREES and so opens a lat/lon project', parsed.mapUnits === 'degrees',
	String(parsed.mapUnits));
const savedShape = L.docFromInp(parsed, 'world.inp');
L.applySaved(L.migrateSaved(savedShape));
ok('...and it really is geographic once open', L.isGeo() === true);
const exported = EngCalcs.lpnExportInp(L.serializeProject(), {});
ok('the export succeeds', exported.ok === true, exported.error || '');
// Compared against the ORIGINAL TEXT, token by token, through a reader that knows nothing about the
// page: asking the writer what it wrote is asking the defendant for the verdict.
function coordRows(text) {
	const out = {};
	let section = null;
	text.split(/\r?\n/).forEach(line => {
		const bare = line.replace(/;.*$/, '').trim();
		if (!bare) { return; }
		if (bare[0] === '[') { section = bare.replace(/[\[\]]/g, '').toUpperCase(); return; }
		if (section !== 'COORDINATES' && section !== 'VERTICES') { return; }
		const t = bare.split(/\s+/);
		(out[section] || (out[section] = [])).push(t);
	});
	return out;
}
const before = coordRows(INP), after = coordRows(exported.inp);
let coordSame = true, coordBad = [];
['COORDINATES', 'VERTICES'].forEach(sec => {
	const a = before[sec] || [], b = after[sec] || [];
	if (a.length !== b.length) { coordSame = false; coordBad.push(sec + ' row count ' + a.length + ' vs ' + b.length); return; }
	a.forEach((row, i) => {
		row.forEach((tok, j) => {
			if (tok !== b[i][j]) { coordSame = false; coordBad.push(sec + ' ' + row[0] + ' col ' + j + ': ' + tok + ' -> ' + b[i][j]); }
		});
	});
});
ok('every [COORDINATES] and [VERTICES] token comes back CHARACTER FOR CHARACTER', coordSame,
	coordBad.join('; '));
ok('...and there really were latitudes in there to get wrong',
	(before.COORDINATES || []).length === 3 && (before.VERTICES || []).length === 1);
ok('...and the export still says DEGREES, so the file keeps its own declaration',
	/UNITS\s+DEGREES/i.test(exported.inp));

// ---- 6. ONE OPINION ABOUT MERCATOR, and a counted number of call sites --------------------------
// The same shape as dev/lpn-spike/local-origin-harness.js's count, and for the same reason: a
// coordinate frame changed at one boundary is safe, and a sixth boundary added later without the
// projection is a pipe drawn in the wrong hemisphere that looks perfectly ordinary in a diff.
console.log('\n--- 6. where the projection is spelled ---');
const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const geomSrc = fs.readFileSync(path.join(ROOT, 'js', 'lpn-geom.js'), 'utf8');
const count = (re) => (src.match(re) || []).length;
ok('the logarithm is written ONCE in the whole suite, in js/lpn-geom.js',
	(geomSrc.match(/Math\.log\(Math\.tan\(/g) || []).length === 1 &&
	!/Math\.log\(Math\.tan\(/.test(src));
ok('...and its inverse likewise',
	(geomSrc.match(/Math\.atan\(Math\.sinh\(/g) || []).length === 1 &&
	!/Math\.atan\(Math\.sinh\(/.test(src));
// FIVE in the coordinate seam -- outwardY, inwardY, projectStoredGeo, and unprojectStoredGeo twice
// (it tests the source before it trusts it) -- and TWO in the v9 -> v10 step. Every one is named in
// a comment beside it; an EIGHTH is a site nobody wrote a reason for, and a site that should have
// projected and did not is wrong only in a geographic project and only away from the equator.
ok('mercY/mercLat are called from seven places in js/looped-network.js and no more',
	count(/Geom\.mercY\(|Geom\.mercLat\(/g) === 7, count(/Geom\.mercY\(|Geom\.mercLat\(/g));
ok('...and the tile grid uses the RADIAN form, which is what keeps its numbers unchanged',
	count(/Geom\.mercRadY\(|Geom\.mercLatFromRad\(/g) === 2,
	count(/Geom\.mercRadY\(|Geom\.mercLatFromRad\(/g));
ok('the cut-off latitude is not written a second time either',
	!/85\.0511/.test(src) && (geomSrc.match(/85\.0511287798066/g) || []).length === 1);
// The tile numbers must not have moved by so much as a bit when the second copy was merged away.
const refRad = lat => Math.log(Math.tan(Math.max(-Geom.mercMaxLat, Math.min(Geom.mercMaxLat, lat)) * Math.PI / 180) +
	1 / Math.cos(Math.max(-Geom.mercMaxLat, Math.min(Geom.mercMaxLat, lat)) * Math.PI / 180));
let tileSame = true;
for (let z = 0; z <= 19; z++) {
	for (let lat = -84; lat <= 84; lat += 7.3) {
		const mine = (1 - Geom.mercRadY(lat) / Math.PI) / 2 * Math.pow(2, z);
		const ref = (1 - refRad(lat) / Math.PI) / 2 * Math.pow(2, z);
		if (mine !== ref) { tileSame = false; }
	}
}
ok('latToTileY() is byte-identical to the expression it replaced', tileSame);

// ---- 7. what the projection buys, as a number ---------------------------------------------------
// The honest version of "the map now looks like its own map". A square on the ground is drawn as a
// square: that is conformality, and it is the whole point. Unprojected it was drawn 1/cos(lat) wide.
console.log('\n--- 7. the anisotropy that is gone ---');
[0, 33.4, 38, 50, 60].forEach(lat => {
	const dLat = 0.005;                                   // ~555 m north-south
	const dLon = dLat / Math.cos(lat * Math.PI / 180);    // the SAME ground distance east-west
	const drawnH = Math.abs(L.inwardY(lat + dLat / 2) - L.inwardY(lat - dLat / 2));
	const ratio = dLon / drawnH;
	ok('at latitude ' + lat + ' a square on the ground is drawn square, to 0.2%',
		Math.abs(ratio - 1) < 0.002, 'drawn aspect ' + ratio.toFixed(5) +
		', unprojected it was ' + (1 / Math.cos(lat * Math.PI / 180)).toFixed(3));
});

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'all projection-seam checks pass'));
process.exit(fails ? 1 : 0);

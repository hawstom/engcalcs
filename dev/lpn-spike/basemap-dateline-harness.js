// THE MIRRORED TILE AT WORLD ZOOM -- R-066.
//
//   node dev/lpn-spike/basemap-dateline-harness.js
//   BASEMAP_DATELINE_MUTATE=1 node dev/lpn-spike/basemap-dateline-harness.js    (must go RED)
//
// **WHAT TOM SAW.** At step 1 of the map-attachment wizard -- the whole world, the drawing waiting
// in the Gulf of Guinea -- the basemap was drawn MIRRORED: place names reversed and upside down,
// "Papua Niugini" readable only in a mirror. One tile, stretched backwards across the entire
// screen and painted over every other tile.
//
// **THE CAUSE, MEASURED TWICE AND NOT GUESSED.** A tile is placed by inverting its corners through
// the georeferencing transform, and js/lpn-georef.js's fromLonLat() asks wrapLon() which way round
// the world each corner is nearer. That is the right question for ONE point and the wrong one for
// an EDGE: the two ends of an edge can land on opposite branches. The discontinuity sits at the
// ANTIPODE of the transform's origin, and at step 1 the origin starts at 0, 0 -- so the antipode is
// the date line, and a world-wide view always contains it. The tile holding it had its east edge
// wrapped a whole world away from its west edge, which is a NEGATIVE placement width, which is a
// raster drawn backwards.
//
//   zoom 3, origin 0, 0          width  -1,750.0 where it should be    +250.0
//   zoom 3, origin -17.8, 179.9  width  -1,666.7 where it should be    +238.1
//   zoom 2, origin 45, 120       width  -1,062.4 where it should be    +354.1
//
// **THE ASSERTIONS ARE DELIBERATELY NOT THE FIX RESTATED.** A width read back off the elements the
// page made is compared with a width DERIVED HERE from the transform's own scale and
// lpnGeorefMetersPerDegree() -- 360 degrees over 2^z, converted at the origin's latitude -- which
// is a different route to the same number. And three cheap structural properties are checked
// beside it, any one of which would have caught this on its own: every width positive, every width
// in a row the same, and neighbouring columns abutting -- the last with the one exception a
// world-wide view genuinely earns, which grade() states where it is measured.
//
// **THE MUTATION LEG IS A SECOND RUN, NOT AN ASSERTION.** BASEMAP_DATELINE_MUTATE=1 puts the old
// corner-by-corner inversion back into the page source, and the run must go RED. Tom's reason for
// delegating this was that he will not be the one who notices it come back, so a test that cannot
// fail would be worse than none.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };
global.prompt = global.window.prompt = function () { return null; };

const MUTATE = process.env.BASEMAP_DATELINE_MUTATE === '1';

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink, xyGeoref: xyGeoref,\n" +
	"\t\tmapgeoStart: mapgeoStart, mapgeoGoTo: mapgeoGoTo,\n" +
	"\t\trefreshBasemap: refreshBasemap, setMapSized: function (on) { mapSized = on !== false; },\n" +
	"\t\ttileEls: function () { return basemapEls; },\n" +
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
		// THE DEFECT PUT BACK: all three corners inverted as ABSOLUTE lon/lat, each one free to
		// pick its own branch of longitude. This is the code that shipped, character for
		// character, and every assertion below must notice it.
		const tail = "gbl = inw(ptl.x + dSouth.x, ptl.y + dSouth.y);\n";
		const now = src.slice(src.indexOf('\t\t\t\tvar ptl = EngCalcs.lpnGeorefFromLonLat(xg, t.lonW, t.latN);'),
			src.indexOf(tail) + tail.length);
		if (!now.trim()) { throw new Error('the block to mutate was not found'); }
		return src.replace(now,
			"\t\t\t\tvar g = function (lon, lat) {\n" +
			"\t\t\t\t\tvar p = EngCalcs.lpnGeorefFromLonLat(xg, lon, lat);\n" +
			"\t\t\t\t\treturn { x: inwardX(p.x), y: inwardY(p.y) };\n" +
			"\t\t\t\t};\n" +
			"\t\t\t\tvar gtl = g(t.lonW, t.latN), gtr = g(t.lonE, t.latN), gbl = g(t.lonW, t.latS);\n" +
			"\t\t\t\tif (!isFinite(gtl.x) || !isFinite(gtl.y)) { return; }\n");
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

const G = global.EngCalcs;

// ---- THE DELTA DOOR, AND THE ONE IT DOES NOT REPLACE -------------------------------------------
//
// The repair lives in js/lpn-georef.js, so it is graded there first: a DIFFERENCE never wraps, an
// absolute POINT still does. Losing the second half would put a network straddling the
// antimeridian most of the way round the world, which is what wrapLon() was written for.
{
	const t = { anchor: { x: 0, y: 0 }, origin: { lon: 0, lat: 0 }, metersPerUnit: 1, rotDeg: 0 };
	ok('js/lpn-georef.js offers a difference door at all',
		typeof G.lpnGeorefDeltaFromLonLat === 'function');
	const mpd = G.lpnGeorefMetersPerDegree(0);
	const half = G.lpnGeorefDeltaFromLonLat(t, 180, 0), whole = G.lpnGeorefDeltaFromLonLat(t, 360, 0);
	ok('...and a 180 degree DIFFERENCE stays 180 degrees wide',
		Math.abs(half.x - 180 * mpd.lon) < 1e-6 * Math.abs(180 * mpd.lon), half.x);
	ok('...and a 360 degree DIFFERENCE is a whole world, not nothing',
		Math.abs(whole.x - 360 * mpd.lon) < 1e-6 * Math.abs(360 * mpd.lon), whole.x);
	// The half-open convention is the exact tooth that bit: wrapLon(180) is -180, so the east edge
	// of the world's last tile came back on the west side of it.
	const east = G.lpnGeorefFromLonLat(t, 180, 0), west = G.lpnGeorefFromLonLat(t, -180, 0);
	ok('...while an absolute point 180 degrees away still picks the nearer branch, as it must',
		east.x === west.x, east.x + ' vs ' + west.x);
	const near = G.lpnGeorefFromLonLat({ anchor: { x: 0, y: 0 }, origin: { lon: 179.5, lat: 0 },
		metersPerUnit: 1, rotDeg: 0 }, -179.5, 0);
	ok('...so a point just over the antimeridian is one degree away, not 359',
		Math.abs(near.x - 1 * mpd.lon) < 1e-6 * mpd.lon, near.x);
}

// ---- THE PAGE, AT WORLD ZOOM -------------------------------------------------------------------

const R = L.addNode('reservoir', 0, 0);
const B = L.addNode('junction', 2000, -800);
L.addLink('pipe', R.id, B.id);

L.mapgeoStart();
L.setMapSized(true);
L.getProject().basemap = 'osm';

// Where each tile is DRAWN, read back off the elements the page made. Nothing here re-derives an
// affine: `a` and `d` of matrix(a b c d e f) are the tile's own extents, because the <image> is
// one unit square by construction.
function placed() {
	L.refreshBasemap();
	const els = L.tileEls();
	return Object.keys(els).map(function (k) {
		const part = k.split('/');
		const m = /matrix\(([^)]*)\)/.exec(els[k].getAttribute('transform') || '');
		if (!m) { return { key: k, z: +part[1], x: +part[2], y: +part[3], noMatrix: true }; }
		const n = m[1].trim().split(/\s+/).map(Number);
		return { key: k, z: +part[1], x: +part[2], y: +part[3],
			w: n[0], h: n[3], left: n[4], top: n[5] };
	});
}

// **THE EXPECTED WIDTH, DERIVED A DIFFERENT WAY.** A zoom level cuts 360 degrees into 2^z columns;
// a degree of longitude at the origin's latitude is lpnGeorefMetersPerDegree().lon metres; and one
// drawing unit is metersPerUnit of them. Nothing in this expression goes through the code under
// test. Valid while rotDeg is 0, which it is until the turn bar is touched.
function expectedWidth(z) {
	const t = L.xyGeoref();
	return 360 / Math.pow(2, z) * G.lpnGeorefMetersPerDegree(t.origin.lat).lon / t.metersPerUnit;
}

function grade(label, lat, lon, wantZ) {
	L.mapgeoGoTo({ lat: lat, lon: lon });
	const tiles = placed();
	console.log('');
	console.log('-- ' + label + '  (' + lat + ', ' + lon + ') --');
	ok('there are tiles at all, or nothing below means anything', tiles.length > 0, tiles.length);
	ok('...every one of them carries an affine', tiles.every(function (t) { return !t.noMatrix; }));
	if (!tiles.length || tiles.some(function (t) { return t.noMatrix; })) { return; }
	const z = tiles[0].z;
	ok('...all at one zoom level, and it is the one measured', z === wantZ &&
		tiles.every(function (t) { return t.z === z; }), 'z=' + z);

	const want = expectedWidth(z);
	const worst = tiles.reduce(function (a, t) { return t.w < a ? t.w : a; }, Infinity);
	ok('NO TILE IS DRAWN BACKWARDS', worst > 0,
		'narrowest width ' + worst.toFixed(1) + ', wanted ' + want.toFixed(1));
	ok('...and every tile is exactly one column of the world wide',
		tiles.every(function (t) { return Math.abs(t.w - want) < 1e-9 * want; }),
		tiles.map(function (t) { return t.w.toFixed(1); }).filter(function (v, i, a) {
			return a.indexOf(v) === i; }).join(' '));
	ok('...and none is drawn upside down', tiles.every(function (t) { return t.h > 0; }),
		tiles.reduce(function (a, t) { return t.h < a ? t.h : a; }, Infinity).toFixed(3));

	// **ABUTMENT IS THE PROPERTY A READER ACTUALLY SEES.** A width can be right and a tile still
	// land in the wrong place, so neighbouring columns of the same row must meet exactly.
	//
	// **WITH ONE EXCEPTION THAT IS NOT A DEFECT, AND MEASURING IT IS WHAT SHOWED THAT.** A view
	// this wide spans the whole Earth, and you cannot lay a sphere flat around a point without the
	// far side of it having to go somewhere: the tiles beyond the ANTIPODE of the origin are drawn
	// at the opposite edge of the view, which is what every wrapping world map does. So one pair
	// per row may be exactly ONE WORLD apart instead of one tile -- measured at -1,904.8547 against
	// a world of 1,904.8547 in Fiji and -1,416.5863 against 1,416.5863 at zoom 2, both exact.
	// **More than one such jump in a row would be a genuine tear**, and that is the ratchet here.
	const rows = {};
	tiles.forEach(function (t) { (rows[t.y] = rows[t.y] || []).push(t); });
	const world = want * Math.pow(2, z);
	let breaks = 0, pairs = 0, seams = 0, worstRowSeams = 0;
	Object.keys(rows).forEach(function (y) {
		const row = rows[y].slice().sort(function (a, b) { return a.x - b.x; });
		let rowSeams = 0;
		for (let i = 1; i < row.length; i++) {
			if (row[i].x !== row[i - 1].x + 1) { continue; }
			pairs++;
			const d = (row[i].left - row[i - 1].left) - row[i - 1].w;
			if (Math.abs(d) <= 1e-6 * want) { continue; }
			if (Math.abs(Math.abs(d) - world) <= 1e-6 * world) { rowSeams++; seams++; continue; }
			breaks++;
		}
		worstRowSeams = Math.max(worstRowSeams, rowSeams);
	});
	ok('...and neighbouring columns meet with no gap and no overlap',
		pairs > 0 && breaks === 0,
		pairs + ' neighbouring pairs, ' + breaks + ' broken, ' + seams + ' antipodal wraps');
	ok('...with at most the one antipodal wrap in any row, which is not a tear',
		worstRowSeams <= 1, 'worst row: ' + worstRowSeams);
}

// THREE PLACES AND TWO ZOOM LEVELS, each one measured to fail before the repair. The first is what
// Tom opened the wizard onto; the second is a network beside the date line, where the seam is a
// place somebody really works rather than an artefact of starting at zero; the third is a
// different zoom level and a latitude where a degree of longitude is not a degree of anything else.
grade('the wizard opens here, in the Gulf of Guinea', 0, 0, 3);
grade('a network beside the date line, in Fiji', -17.8, 179.9, 3);
grade('a coarser zoom, and well off the equator', 45, 120, 2);

// ---- AND THE TILES THE CACHE HANDS BACK ARE PLACED THE SAME WAY --------------------------------
//
// 448533f6 added a cache and a retry, and a cached tile keyed on a wrapped coordinate would be
// this defect again by another door. The key carries z/x/y and the style, none of which this
// repair touches -- so what is graded is the consequence: ask for the same ground twice and every
// tile must come back at the same place, from the cache or otherwise.
{
	L.mapgeoGoTo({ lat: 0, lon: 0 });
	const first = placed();
	L.mapgeoGoTo({ lat: 38.2324, lon: -122.6367 });
	placed();
	L.mapgeoGoTo({ lat: 0, lon: 0 });
	const again = placed();
	console.log('');
	const byKey = {};
	first.forEach(function (t) { byKey[t.key] = t; });
	const shared = again.filter(function (t) { return byKey[t.key]; });
	ok('coming back to the same ground asks for the same tiles', shared.length === first.length,
		shared.length + ' of ' + first.length);
	ok('...and every one of them is placed exactly where it was',
		shared.length > 0 && shared.every(function (t) {
			const was = byKey[t.key];
			return t.w === was.w && t.h === was.h && t.left === was.left && t.top === was.top;
		}));
	ok('...and none of them came back backwards',
		shared.every(function (t) { return t.w > 0; }));
}

if (MUTATE) {
	console.log('');
	console.log(fails > 0
		? 'MUTATION LEG OK: the mirrored tile was caught.'
		: 'MUTATION LEG FAILED: a tile drawn backwards went unnoticed.');
	process.exit(fails > 0 ? 0 : 1);
}
console.log('');
console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

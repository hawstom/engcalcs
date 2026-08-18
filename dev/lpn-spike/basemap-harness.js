// THE OPENSTREETMAP BASEMAP -- ROADMAP Task 145, second slice. Run with:
//   node dev/lpn-spike/basemap-harness.js
//
// WHY THIS EXISTS. The tile layer's whole job is REGISTRATION: a street map that is half a block
// out from the pipes drawn on it is worse than no street map, because it looks authoritative. Every
// way it goes wrong is silent and looks plausible on screen:
//
//   1. **A tile is placed as a SQUARE.** A tile is a square in Web Mercator and this document is
//      longitude/latitude drawn straight, so a square box is wrong by 1/cos(latitude) in height --
//      21% at 38 degrees. Nothing throws; the map is just gradually off toward the poles.
//   2. **The inverse Mercator is approximated where it must be exact.** The tile's own north and
//      south edges are exact inverse-Mercator latitudes. Only the raster INSIDE the box is
//      linearised, and this file measures that error rather than asserting it is small.
//   3. **The zoom level is picked off the wrong axis.** Longitude is drawn 1:1 here and latitude is
//      the compressed axis, so matching latitude would magnify every tile past its own pixels.
//   4. **A refresh asks for too many tiles.** The OSM tile usage policy forbids bulk downloading,
//      and a viewport bug is exactly how a well-behaved page starts behaving badly.
//
// The reference implementation of the slippy-tile scheme below is written HERE, from the definition,
// rather than imported from the page -- a harness that calls the code it is checking proves only
// that the code is self-consistent.

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\ttileList: basemapTileList, zoomFor: tileZoomFor,\n" +
	"\t\ttileLon: tileLon, tileLat: tileLat,\n" +
	"\t\tlonToTileX: lonToTileX, latToTileY: latToTileY,\n" +
	"\t\tBUDGET: LPN_TILE_BUDGET, MAXZ: LPN_TILE_MAX_Z,\n" +
	"\t\tbasemapOn: basemapOn, setBasemapOn: setBasemapOn,\n" +
	"\t\trefresh: refreshBasemap, layer: function () { return basemapLayer; },\n" +
	"\t\tsetSized: function () { mapSized = true; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\treset: function (coords) { doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
byId.lpn_toolbar.querySelectorAll = () => [];

// ---- the independent reference -------------------------------------------------------------------
// The slippy-map tile scheme, written straight from its definition: the world is one square, the
// square is cut into 2^z by 2^z tiles, x runs west to east over 360 degrees of longitude and y runs
// north to south over the Mercator ordinate. Nothing here is copied from js/looped-network.js.
const MAXLAT = 85.0511287798066;
function refX(lon, z) { return (lon + 180) / 360 * (1 << z); }
function refY(lat, z) {
	const s = Math.sin(lat * Math.PI / 180);
	return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * (1 << z);
}
function refLon(x, z) { return x / (1 << z) * 360 - 180; }
function refLat(y, z) {
	// Inverse of refY, by the Gudermannian: lat = 2*atan(e^(pi*(1-2y/2^z))) - pi/2.
	const t = Math.PI * (1 - 2 * y / (1 << z));
	return (2 * Math.atan(Math.exp(t)) - Math.PI / 2) * 180 / Math.PI;
}

// ---- 1. the tile scheme, against fixed points anybody can check by hand --------------------------
ok('zoom 0 is one tile spanning the whole world in longitude',
	L.tileLon(0, 0) === -180 && L.tileLon(1, 0) === 180);
ok('...and cut off at the Mercator latitude, north and south',
	near(L.tileLat(0, 0), MAXLAT, 1e-9) && near(L.tileLat(1, 0), -MAXLAT, 1e-9),
	L.tileLat(0, 0).toFixed(9));
ok('the zoom-1 seam is the equator and the prime meridian',
	near(L.tileLat(1, 1), 0, 1e-12) && near(L.tileLon(1, 1), 0, 1e-12));

// Against the independent reference, over a spread of zooms and positions.
let worstLat = 0, worstX = 0;
[0, 1, 5, 12, 17, 19].forEach(z => {
	for (let i = 0; i <= 8; i++) {
		const y = (1 << z) * i / 8, x = (1 << z) * i / 8;
		worstLat = Math.max(worstLat, Math.abs(L.tileLat(y, z) - refLat(y, z)));
		worstX = Math.max(worstX, Math.abs(L.tileLon(x, z) - refLon(x, z)));
	}
});
ok('tileLat/tileLon agree with the reference slippy scheme', worstLat < 1e-9 && worstX < 1e-9,
	'worst lat ' + worstLat.toExponential(2) + ' deg');

// The forward direction, and the round trip that ties the two together.
let worstFwd = 0, worstRound = 0;
[3, 8, 12, 16, 19].forEach(z => {
	[-89, -60, -38.106067, 0, 12.5, 51.5, 80].forEach(lat => {
		const clamped = Math.max(-MAXLAT, Math.min(MAXLAT, lat));
		worstFwd = Math.max(worstFwd, Math.abs(L.latToTileY(lat, z) - refY(clamped, z)));
	});
	[-180, -122.5686103, -0.1, 0, 33.7, 180].forEach(lon => {
		worstFwd = Math.max(worstFwd, Math.abs(L.lonToTileX(lon, z) - refX(lon, z)));
	});
	for (let y = 0; y <= (1 << z); y += Math.max(1, (1 << z) >> 3)) {
		worstRound = Math.max(worstRound, Math.abs(L.latToTileY(L.tileLat(y, z), z) - y));
	}
});
ok('latToTileY/lonToTileX agree with the reference', worstFwd < 1e-9, worstFwd.toExponential(2));
ok('...and are the exact inverse of tileLat', worstRound < 1e-9, worstRound.toExponential(2));

// The pole is not a tile index. Web Mercator has no 90 degrees, and an unclamped latitude produces
// Infinity, which becomes an <image> at y="NaN" and no visible error anywhere.
ok('a latitude past the Mercator cut-off still lands inside the grid',
	near(L.latToTileY(90, 12), 0, 1e-6) && near(L.latToTileY(-90, 12), 1 << 12, 1e-6),
	L.latToTileY(90, 12) + ' .. ' + L.latToTileY(-90, 12));

// ---- 2. the zoom level, chosen off the LONGITUDE axis ---------------------------------------------
// state.s is screen pixels per degree of longitude, and a zoom level spreads 360 degrees over
// 256 * 2^z pixels. At exactly that scale the level is z and the raster is drawn 1:1.
let zoomExact = true;
for (let z = 0; z <= 19; z++) {
	if (L.zoomFor(256 * Math.pow(2, z) / 360) !== z) { zoomExact = false; }
}
ok('the native scale of every zoom level picks that level', zoomExact);
// The property that actually constrains the choice: any scale in between picks the NEAREST level.
// Checking only the exact native scales leaves half a level of slack either way, and a bias smaller
// than that is invisible to them -- which is how a wrong-axis choice hides at low latitude and shows
// up at high.
let nearest = true, worstBias = 0;
for (let i = 0; i < 240; i++) {
	const s = 0.01 * Math.pow(2, i / 6), z = L.zoomFor(s);
	if (z <= 0 || z >= L.MAXZ) { continue; }
	const bias = Math.abs(Math.log(s * 360 / 256) / Math.LN2 - z);
	worstBias = Math.max(worstBias, bias);
	if (bias > 0.5 + 1e-9) { nearest = false; }
}
ok('...and any scale between them picks the nearest level', nearest,
	'worst departure ' + worstBias.toFixed(4) + ' of a level');
ok('...and it never exceeds OSM\'s own maximum', L.zoomFor(1e12) === L.MAXZ, 'z=' + L.zoomFor(1e12));
ok('...nor goes below zero', L.zoomFor(1e-9) === 0 && L.zoomFor(0) === 0);

// ---- 3. REGISTRATION: a tile's box is its own lon/lat rectangle ------------------------------------
// The one property the whole slice rests on. Internal coordinates are the document's, origin-shifted
// (origin is 0 here) and Y-down, so px is the west edge's longitude and py is minus the north edge's
// latitude.
L.reset(L.GEO);
const view = { lonMin: -122.60, lonMax: -122.53, latMin: 38.08, latMax: 38.13 };
const scale = 256 * Math.pow(2, 14) / 360;   // native zoom 14
const list = L.tileList(view.lonMin, view.latMin, view.lonMax, view.latMax, scale);
ok('a viewport produces tiles at all', list.tiles.length > 0, list.tiles.length + ' tiles at z' + list.z);

let boxErr = 0, aspectSquare = 0;
list.tiles.forEach(t => {
	boxErr = Math.max(boxErr,
		Math.abs(t.px - refLon(t.x, t.z)),
		Math.abs(t.px + t.pw - refLon(t.x + 1, t.z)),
		Math.abs(-t.py - refLat(t.y, t.z)),
		Math.abs(-(t.py + t.ph) - refLat(t.y + 1, t.z)));
	if (Math.abs(t.pw - t.ph) < 1e-12) { aspectSquare++; }
});
ok('every tile box is exactly the tile\'s own lon/lat rectangle', boxErr < 1e-9, boxErr.toExponential(2));
// The failure this is really guarding: a tile placed as a square would be right at the equator and
// wrong everywhere else. At 38 degrees the box must be about cos(38) as tall as it is wide.
const t0 = list.tiles[0], midLat = -(t0.py + t0.ph / 2);
ok('a tile box is NOT square away from the equator', aspectSquare === 0,
	'h/w = ' + (t0.ph / t0.pw).toFixed(4));
ok('...it is 1 : cos(latitude), which is what an unprojected frame requires',
	near(t0.ph / t0.pw, Math.cos(midLat * Math.PI / 180), 2e-4),
	(t0.ph / t0.pw).toFixed(6) + ' vs ' + Math.cos(midLat * Math.PI / 180).toFixed(6));

// Tiles tile: consecutive rows and columns share an edge exactly, with no gap and no overlap.
const byXY = {};
list.tiles.forEach(t => { byXY[t.x + ',' + t.y] = t; });
let seamErr = 0, seams = 0;
list.tiles.forEach(t => {
	const east = byXY[(t.x + 1) + ',' + t.y], south = byXY[t.x + ',' + (t.y + 1)];
	if (east) { seamErr = Math.max(seamErr, Math.abs(t.px + t.pw - east.px)); seams++; }
	if (south) { seamErr = Math.max(seamErr, Math.abs(t.py + t.ph - south.py)); seams++; }
});
ok('neighbouring tiles share an edge with no gap and no overlap', seams > 0 && seamErr < 1e-12,
	seams + ' seams, worst ' + seamErr.toExponential(2));

// The URL, which is the whole of the provider contract.
ok('every tile names the OSM tile server over https and nothing else',
	list.tiles.every(t => t.url === 'https://tile.openstreetmap.org/' + t.z + '/' + t.x + '/' + t.y + '.png'),
	list.tiles[0].url);

// ---- 4. the linearisation error INSIDE a tile, measured rather than asserted ----------------------
// The raster is stretched linearly across a box whose edges are exact, so the only error is the
// departure of the inverse Mercator from its own chord across one tile. Measured in screen pixels at
// that zoom's native scale, which is the number that decides whether it is visible.
function chordErrorPx(z, lat) {
	const y0 = Math.floor(refY(lat, z)), pxPerDeg = 256 * Math.pow(2, z) / 360;
	const latT = refLat(y0, z), latB = refLat(y0 + 1, z);
	let worst = 0;
	for (let i = 1; i < 256; i++) {
		const f = i / 256;
		worst = Math.max(worst, Math.abs(refLat(y0 + f, z) - (latT + f * (latB - latT))));
	}
	return worst * pxPerDeg;
}
const e12 = chordErrorPx(12, 45), e16 = chordErrorPx(16, 45), e5 = chordErrorPx(5, 45);
ok('within one tile the linear stretch is far under a pixel at drawing zooms',
	e12 < 0.1 && e16 < 0.01, 'z12 ' + e12.toFixed(4) + ' px, z16 ' + e16.toFixed(6) + ' px');
// Not vacuous: the same measurement is over a pixel at a whole-continent zoom, which is why it is a
// measurement and not a hand-wave. Nothing is drawn at z5, so nothing is claimed about it.
ok('...and the same measurement is NOT small at a continent-wide zoom', e5 > 1,
	'z5 ' + e5.toFixed(2) + ' px');

// ---- 5. the request budget, which is the tile-policy-relevant number -------------------------------
const huge = L.tileList(-179, -80, 179, 80, 256 * Math.pow(2, 12) / 360);
ok('a viewport that would ask for a whole zoom level steps DOWN instead',
	huge.tiles.length <= L.BUDGET && huge.z < 12, huge.tiles.length + ' tiles at z' + huge.z);
ok('...and still covers the ground asked for',
	huge.tiles.some(t => t.px <= -179) && huge.tiles.some(t => t.px + t.pw >= 179));
// The clamp at the other end: a window wider than the world cannot produce a negative tile index.
const world = L.tileList(-400, -95, 400, 95, 1);
ok('a window bigger than the world produces only real tile indices',
	world.tiles.every(t => t.x >= 0 && t.y >= 0 && t.x < (1 << t.z) && t.y < (1 << t.z)),
	world.tiles.length + ' tiles at z' + world.z);

// ---- 6. on in a geographic project, absent from a grid one ------------------------------------------
L.reset(null);
ok('a grid project has no basemap and cannot be given one', L.basemapOn() === false);
L.refresh();
ok('...and nothing is drawn for it', L.layer().children.length === 0);

L.reset(L.GEO);
L.setSized();
L.setCanvas(1000, 500);   // the stub's own getBoundingClientRect box, so the two agree
L.setCanvas(1000, 500);
ok('a geographic project has one without being asked', L.basemapOn() === true);
ok('...and it is not a stored value, so an older geographic file gets one too',
	L.getProject().basemap === undefined);
L.setView(L.geoHome());
L.refresh();
const drawn = L.layer().children;
ok('tiles are drawn into the world layer', drawn.length > 0, drawn.length + ' <image> elements');
ok('...as <image> elements pointing at the tile server',
	drawn.every(e => e._tag === 'image' && /^https:\/\/tile\.openstreetmap\.org\//.test(e.href)),
	drawn[0] && drawn[0].href);
// preserveAspectRatio="none" is what lets a square raster fill a non-square box. Without it the
// browser letterboxes the tile and the map is silently a few percent out in latitude.
ok('...stretched to fill their boxes rather than letterboxed',
	drawn.every(e => e.preserveAspectRatio === 'none'));
ok('...and sending no credentials to the tile server',
	drawn.every(e => e.crossorigin === 'anonymous'));

// ---- 7. the toggle, and what it stores ------------------------------------------------------------
L.setBasemapOn(false);
ok('turning it off empties the layer', L.layer().children.length === 0);
ok('...and records the choice on the PROJECT', L.getProject().basemap === 'off');
const saved = L.serialize();
ok('...which is written to the file', saved.project.basemap === 'off');
// THE SEAM WITH .inp EXPORT. A tile basemap is not an image file and must never be written as a
// [BACKDROP]. It has no href to write, and it does not live on `backdrop`.
ok('a tile basemap is NOT the backdrop image and has no file to name',
	saved.backdrop === null && typeof saved.project.basemap === 'string',
	JSON.stringify(saved.project.basemap));
L.applySaved(JSON.parse(JSON.stringify(saved)));
ok('...and survives a save and an open', L.basemapOn() === false);
L.setBasemapOn(true);
ok('turning it back on says so on the project', L.getProject().basemap === 'osm' && L.basemapOn() === true);

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall basemap checks pass');
process.exit(fails ? 1 : 0);

// ELEVATIONS FROM THE LAND SURFACE -- ROADMAP Task 497. Run with:
//   node dev/lpn-spike/terrain-harness.js
//
// WHY THIS EXISTS. This is the first feature that WRITES NUMBERS INTO THE DOCUMENT from outside it,
// and every way it can go wrong is silent:
//
//   1. **It overwrites something the user typed.** An elevation replaced by a terrain reading looks
//      exactly like an elevation that was always there. Nothing throws, nothing is coloured, and the
//      only person who could notice is the one who typed the original.
//   2. **It sends before it is allowed to.** The consent gate is one `if`, and a request that
//      escapes it discloses where the visitor's whole network stands. There is no error message for
//      "we asked afterwards".
//   3. **The decode or the tile arithmetic is wrong.** A Terrain-RGB pixel is one 24-bit number
//      split across three channels, so a mistake of ONE in the red channel is 6,553.6 m and a
//      mistake in the tile index is a plausible elevation from the wrong hillside. Both produce a
//      number that solves.
//   4. **The undo is per node.** Twenty nodes filled and twenty Ctrl-Z's to get back is the same to
//      the code and quite different to the person pressing it.
//
// **THE NETWORK IS STUBBED, AND WHAT THE STUB PRESERVES IS THE POINT** (dev/testing-notes.md: a stub
// that removes the coupling makes a harness pass for the wrong reason). The stub does NOT return
// elevations. It returns BYTES, and it produces them by taking the tile and pixel indices the real
// code computed, converting them back to a longitude and latitude through an INDEPENDENT inverse
// Mercator, evaluating a synthetic sloping terrain there, and ENCODING that height with Mapbox's own
// formula. So the relationship the real thing has -- height varies with WHERE THE PIXEL IS -- is the
// one the stub varies too. Get the tile index wrong, the pixel wrong, or the decode wrong, and the
// number that lands in the document is wrong by more than the tolerance below. Nothing here ever
// touches the real api.mapbox.com; `window.fetch` is replaced by a spy that FAILS the run if it is
// ever called at all.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}
function section(name) { console.log(`\n--- ${name} ---`); }

// ---- a cookie jar, since lpn-dom-stub.js's document has none ------------------------------------
// Added here rather than there on purpose: the stub is shared by ~90 harnesses and a document
// property that only this one needs belongs with this one.
const jar = { value: '' };
Object.defineProperty(global.document, 'cookie', {
	configurable: true,
	get() { return jar.value; },
	set(v) {
		const name = String(v).split('=')[0];
		const expired = /expires=Thu, 01 Jan 1970/.test(v);
		const others = jar.value.split('; ').filter(c => c && c.split('=')[0] !== name);
		if (!expired) { others.push(String(v).split(';')[0]); }
		jar.value = others.join('; ');
	}
});

// js/lpn-terrain.js binds to `window`, and the stub's window is a plain object that does not carry
// the EngCalcs every other file uses. Without this alias the module would build a SECOND, empty
// EngCalcs and js/looped-network.js would find no lpnTerrainInit at all -- a harness passing because
// the feature was never loaded.
global.window.EngCalcs = global.EngCalcs;
global.window.document = global.document;
global.window.setTimeout = setTimeout;
global.window.clearTimeout = clearTimeout;
global.window.location = { protocol: 'https:' };
global.EngCalcs.pageConfig.lpn_mapbox_token = 'pk.test-token';

require(ROOT + 'js/lpn-terrain.js');
const EC = global.EngCalcs;

// ================================================================================================
// 1. THE DECODE, against Mapbox's published formula and its own edges
// ================================================================================================
section('1. the Terrain-RGB decode');
// height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1). These are hand-computed from that
// formula, not from this code: (1,134,160) is 100000 quanta, which is exactly the -10000 m offset.
ok('(0,0,0) is the bottom of the range, -10000 m', EC.lpnTerrainDecode(0, 0, 0) === -10000);
ok('(1,134,160) is exactly sea level',
	Math.abs(EC.lpnTerrainDecode(1, 134, 160) - 0) < 1e-9, EC.lpnTerrainDecode(1, 134, 160));
ok('one unit of BLUE is 0.1 m',
	Math.abs(EC.lpnTerrainDecode(1, 134, 161) - 0.1) < 1e-9, EC.lpnTerrainDecode(1, 134, 161));
ok('one unit of GREEN is 25.6 m',
	Math.abs(EC.lpnTerrainDecode(1, 135, 160) - 25.6) < 1e-9, EC.lpnTerrainDecode(1, 135, 160));
// **THE REASON `.pngraw` IS NOT NEGOTIABLE.** One unit of chroma noise in the red channel is two
// thirds of the way to the Moon; a lossy re-encode of a terrain tile is not a blurred picture.
ok('one unit of RED is 6553.6 m -- why the tile must be lossless',
	Math.abs(EC.lpnTerrainDecode(2, 134, 160) - 6553.6) < 1e-9, EC.lpnTerrainDecode(2, 134, 160));
// Mount Whitney at 4421 m round-trips: encode by hand, decode by the code.
{
	const q = Math.round((4421 + 10000) / 0.1);
	const r = (q >> 16) & 255, g = (q >> 8) & 255, b = q & 255;
	ok('4421 m encodes and decodes back to itself',
		Math.abs(EC.lpnTerrainDecode(r, g, b) - 4421) < 0.05, EC.lpnTerrainDecode(r, g, b));
}
// A missing or malformed channel must be NOTHING, never a number. A NaN written into a document is
// a node that solves as nothing at all; a 0 is sea level, which reads as a real answer.
ok('a missing channel is undefined, not NaN', EC.lpnTerrainDecode(1, 134, undefined) === undefined);
ok('a non-integer channel is undefined', EC.lpnTerrainDecode(1, 134.5, 160) === undefined);
ok('an out-of-range channel is undefined', EC.lpnTerrainDecode(256, 0, 0) === undefined);
ok('a string channel is undefined', EC.lpnTerrainDecode('1', 134, 160) === undefined);

// ================================================================================================
// 2. THE TILE ARITHMETIC, against the slippy-map scheme stated independently
// ================================================================================================
section('2. which tile, and which pixel');
const P = EC.lpnTerrainPolicy();
// The reference expressions use Math.asinh, which is a DIFFERENT way of writing the same Mercator
// (ln(tan+sec) === asinh(tan)). A harness that re-typed the implementation would agree with any
// mistake in it.
function refTile(lon, lat, z) {
	const n = Math.pow(2, z);
	const fx = (((lon + 180) % 360 + 360) % 360) / 360 * n;
	const fy = (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n;
	return { x: Math.floor(fx), y: Math.floor(fy), px: Math.floor((fx % 1) * 256), py: Math.floor((fy % 1) * 256) };
}
[[-122.6367, 38.2323, 14], [0, 0, 1], [-0.1276, 51.5072, 12], [151.2093, -33.8688, 15], [10, 60, 10]]
	.forEach(([lon, lat, z]) => {
		const got = EC.lpnTerrainTilePixel(lon, lat, z), want = refTile(lon, lat, z);
		ok(`${lat},${lon} at z${z} lands on the slippy tile the scheme says`,
			got && got.x === want.x && got.y === want.y && got.px === want.px && got.py === want.py,
			got ? `${got.z}/${got.x}/${got.y} px ${got.px},${got.py}` : 'null');
	});
ok('longitude 0 latitude 0 at z=1 is the tile at 1,1', (t => t.x === 1 && t.y === 1 && t.px === 0 && t.py === 0)(EC.lpnTerrainTilePixel(0, 0, 1)));
// The antimeridian is a seam, not a journey -- a network drawn across it is still on the Earth.
ok('longitude wraps rather than falling off the world',
	EC.lpnTerrainTilePixel(181, 0, 4).x === EC.lpnTerrainTilePixel(-179, 0, 4).x);
// Past the Mercator limit there IS no tile, and asking for one is a 404 per node.
ok('past the Mercator limit there is no tile', EC.lpnTerrainTilePixel(0, 87, 12) === null);
ok('a non-finite coordinate has no tile', EC.lpnTerrainTilePixel(NaN, 38, 12) === null);
ok('a zoom past the tileset has no tile', EC.lpnTerrainTilePixel(0, 38, 22) === null);
// Web Mercator's own published constant: 156543.03 m per pixel at z=0 on the equator.
ok('ground resolution at z0 on the equator is the Web Mercator constant',
	Math.abs(EC.lpnTerrainGroundResolution(0, 0) - 156543.034) < 0.01,
	EC.lpnTerrainGroundResolution(0, 0).toFixed(3));
// The accuracy sentence in the interface claims about 30 m. The zoom the fill actually uses must
// therefore SAMPLE at least that finely, or the sentence is a claim the request does not support.
ok('the fill zoom samples finer than the accuracy the interface claims',
	EC.lpnTerrainGroundResolution(P.fillZoom, 45) < 30,
	EC.lpnTerrainGroundResolution(P.fillZoom, 45).toFixed(2) + ' m at 45 deg');
ok('...and the fill zoom is about 9.5 m across the ground',
	Math.abs(EC.lpnTerrainGroundResolution(14, 0) - 9.555) < 0.01,
	EC.lpnTerrainGroundResolution(14, 0).toFixed(3));

// ================================================================================================
// 3. THE REQUEST PLAN -- one request per TILE, and the budget met by stepping down
// ================================================================================================
section('3. the request plan');
{
	// Forty nodes on one small site. The whole economy of this feature is that this is one or two
	// requests rather than forty.
	const site = [];
	for (let i = 0; i < 40; i++) { site.push({ id: 'J' + i, lon: -122.6367 + i * 0.0002, lat: 38.2323 + i * 0.0002 }); }
	const plan = EC.lpnTerrainPlan(site);
	ok('forty nodes on one site are a handful of requests, not forty',
		plan.tiles.length <= 4, plan.tiles.length + ' tiles at z' + plan.zoom);
	ok('...and every node is in the plan exactly once',
		plan.tiles.reduce((a, t) => a + t.points.length, 0) === 40);
	ok('...at the native fill zoom', plan.zoom === P.fillZoom, 'z' + plan.zoom);
}
{
	// A network scattered across a continent. The zoom STEPS DOWN to meet the budget rather than the
	// extent being clipped or the command refused -- the basemap's own policy, applied here.
	const wide = [];
	for (let i = 0; i < 60; i++) { wide.push({ id: 'W' + i, lon: -120 + i * 0.7, lat: 35 + (i % 9) * 0.7 }); }
	const plan = EC.lpnTerrainPlan(wide);
	ok('a continent-wide network steps the zoom DOWN rather than being clipped',
		plan.zoom < P.fillZoom, 'z' + plan.zoom);
	// It does NOT fit the budget even at the floor, and that is reported rather than papered over:
	// stepping down further would make the accuracy sentence a lie, so the confirm names the count
	// and the person decides. The zoom floor protects the accuracy claim; the hard cap protects
	// somebody else's server.
	ok('...says so when it still does not fit the budget', plan.overBudget === true,
		plan.tiles.length + ' of ' + P.maxTiles);
	ok('...and stays under the hard cap that refuses outright',
		plan.tiles.length <= P.hardTiles, plan.tiles.length + ' of ' + P.hardTiles);
	ok('...with every node still in it',
		plan.tiles.reduce((a, t) => a + t.points.length, 0) === 60);
}
{
	// A site fits the budget outright, so nothing is flagged.
	const plan = EC.lpnTerrainPlan([{ id: 'A', lon: -122.6, lat: 38.2 }, { id: 'B', lon: -122.61, lat: 38.21 }]);
	ok('a site is not over budget', plan.overBudget === false, plan.tiles.length + ' tiles');
}
{
	const plan = EC.lpnTerrainPlan([{ id: 'N', lon: 0, lat: 88 }, { id: 'S', lon: 0, lat: 38 }]);
	ok('a node past the Mercator limit is reported, not silently dropped',
		plan.unplaced.length === 1 && plan.unplaced[0] === 'N', JSON.stringify(plan.unplaced));
}
{
	const url = EC.lpnTerrainUrl({ z: 14, x: 2626, y: 6335 }, 'pk.tok&en');
	ok('the tile URL is the lossless pngraw on the Mapbox host',
		url === 'https://api.mapbox.com/v4/mapbox.terrain-rgb/14/2626/6335.pngraw?access_token=pk.tok%26en', url);
	ok('a token cannot forge a second parameter', url.indexOf('%26en') > 0);
	// NOTHING ABOUT THE PROJECT RIDES ALONG. The URL is the tile and the token, and that is all.
	ok('no project name, no node id, no count is in the URL',
		!/name|node|count|id=/.test(url.replace('access_token', '')), url);
}

// ================================================================================================
// 4. THE CONSENT RECORD
// ================================================================================================
section('4. the consent record');
jar.value = '';
ok('a visitor who has never been asked has not consented', EC.lpnTerrainConsented() === false);
document.cookie = 'ec_terrain=1.1755000000.1; path=/';
ok('a yes for the current version of the ask is a yes', EC.lpnTerrainConsented() === true);
// **THE VERSION PIN IS THE WHOLE MECHANISM**: change what we send or who we send it to, bump
// EC_TERRAIN_VERSION, and exactly these people are re-asked -- nobody else, and without touching the
// site-wide banner or EC_CONSENT_VERSION.
jar.value = 'ec_terrain=1.1755000000.0';
ok('a yes given for an OLDER version of the ask is not a yes now', EC.lpnTerrainConsented() === false);
jar.value = 'ec_terrain=0.1755000000.1';
ok('there is no stored NO -- a 0 state is not consent either', EC.lpnTerrainConsented() === false);
jar.value = 'ec_terrain=garbage';
ok('a hand-edited cookie is not consent', EC.lpnTerrainConsented() === false);
jar.value = 'lpn_other=keep; ec_terrain=1.1755000000.1';
EC.lpnTerrainForget();
ok('Erase everything removes it', EC.lpnTerrainConsented() === false, jar.value);
ok('...and removes nothing else', jar.value.indexOf('lpn_other=keep') >= 0, jar.value);
// It is separate STORAGE from the geocoder's, not a second reading of one answer.
jar.value = 'ec_geosearch=1.1755000000.1';
ok('saying yes to place-name search is NOT saying yes to sending node positions',
	EC.lpnTerrainConsented() === false);

// ================================================================================================
// 5. THE PAGE. The real js/looped-network.js, a real geographic project, and the document write.
// ================================================================================================
section('5. the fill, through the real page');

// The network spy. **A CALL HERE IS A FAILURE, ALWAYS** -- this feature must never reach a real host
// from a test run, and the assertion is structural rather than remembered.
let realFetches = 0;
global.window.fetch = function () { realFetches++; return Promise.reject(new Error('no network in a harness')); };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, undo: undo, isGeo: isGeoProject,\n" +
	"\t\tsetDefaultElev: function (v) { settings.defaults.nodeElev = v; },\n" +
	"\t\tplace: function (id, lon, lat) { var n = nodeById(id); n.x = inwardX(lon); n.y = inwardY(lat); },\n" +
	"\t\tsetElev: function (id, v) { var n = nodeById(id); if (v === undefined) { delete n.elev; } else { n.elev = v; } },\n" +
	"\t\telev: function (id) { return nodeById(id).elev; },\n" +
	"\t\treset: function (coords) { doc = { nodes: [], links: [], labels: [] };\n" +
	// **A NEW DOCUMENT FORGETS THE READINGS, as the real open path does** (applySaved calls
	// lpnTerrainForget() and clears these two). Without it the stub holds a constant the page does
	// not: node ids restart at J1 on every reset, so section 7's freshly minted J2 inherited the
	// reading section 6b took for a different J2, on a different continent. That is the
	// stub-removes-the-coupling failure dev/testing-notes.md leads with, and it cost an hour here.
	"\t\t\tterrainLastRead = {}; terrainAsked = {};\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	// Task 542's two new doors, and the queue between the first one and the tiles.
	"\t\tsetElevSource: function (v) { settings.defaults.nodeElevSource = v; },\n" +
	"\t\tflushNewNodes: flushTerrainForNewNodes,\n" +
	"\t\tlastRead: function (id) { return terrainLastRead[id]; },\n" +
	"\t\trenderNode: renderNodeFields,\n" +
	"\t\topenPopupFor: function (id) { currentPopup = { kind: 'node', id: id };\n" +
	"\t\t\tdocument.getElementById('lpn_popup').style.display = 'block';\n" +
	"\t\t\trenderNodeFields(id); },\n" +
	"\t\tpopupText: function () { return document.getElementById('lpn_popup_fields').textContent || ''; },\n" +
	"\t\tpopupButtons: function () { var out = []; (function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\tif (c.tagName === 'BUTTON') { out.push(c); } walk(c); }); })(document.getElementById('lpn_popup_fields')); return out; },\n" +
	"\t\tqueueLength: function () { return terrainNewQueue.length; },\n" +
	"\t\tswitchProject: function () { project = { name: 'other', activeScenario: 'base' }; },\n" +
	"\t\tmapMenuRows: mapMenuRows,\n" +
	"\t\treplace: function (prop, source) { findState.scope = 'junction'; findState.prop = 'id';\n" +
	"\t\t\tfindState.op = 'contains'; findState.value = '';\n" +
	"\t\t\treplaceState.prop = prop; replaceState.source = source; replaceState.value = '';\n" +
	"\t\t\trunReplacePreview(); return applyReplace(); }\n"
);
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// ---- the synthetic terrain, and the stub that serves it ----------------------------------------
// A plane tilted in both directions, so a wrong tile or a wrong pixel gives a WRONG HEIGHT rather
// than the same height as the right one. Metres.
function surface(lon, lat) { return 1000 + 1000 * (lat - 38) + 500 * (lon + 122); }
// The independent inverse of the tile scheme: index back to the pixel's own corner on the Earth.
function pixelLonLat(tile, p) {
	const n = Math.pow(2, tile.z);
	const lon = (tile.x + p.px / 256) / n * 360 - 180;
	const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (tile.y + p.py / 256) / n))) * 180 / Math.PI;
	return { lon: lon, lat: lat };
}
let tileRequests = 0, servedTiles = [];
EC.lpnTerrainFetchPixels = function (tile) {
	tileRequests++;
	servedTiles.push(tile.z + '/' + tile.x + '/' + tile.y);
	// **BYTES, NOT HEIGHTS.** The real Mapbox encoding, so the real decode above is what turns this
	// back into metres. A change to either half breaks the round trip.
	return Promise.resolve(tile.points.map(function (p) {
		const ll = pixelLonLat(tile, p);
		const q = Math.round((surface(ll.lon, ll.lat) + 10000) / 0.1);
		return { id: p.id, r: (q >> 16) & 255, g: (q >> 8) & 255, b: q & 255 };
	}));
};

const FT = EC.unitFactor('fth2o');   // the US elevation/head unit the strip is on
function metresOf(displayValue) { return displayValue / FT; }

// Three junctions on a hillside near Petaluma.
const SITE = [
	{ id: 'J1', lon: -122.6367, lat: 38.2323 },
	{ id: 'J2', lon: -122.6300, lat: 38.2360 },
	{ id: 'J3', lon: -122.6250, lat: 38.2400 }
];
function buildSite() {
	L.reset(L.GEO);
	SITE.forEach(function (s) { L.addNode('junction', 0, 0); });
	SITE.forEach(function (s) { L.place(s.id, s.lon, s.lat); });
}

// The status notice is the OTHER half of what this feature says out loud, and until 2026-08-25 no
// assertion here had ever read it. setNotice() writes it into #lpn_map_notice.
function noticeText() { return byId.lpn_map_notice.textContent || ''; }

let confirmAnswers = [], confirmTexts = [];
global.confirm = global.window.confirm = function (m) { confirmTexts.push(m); return confirmAnswers.shift() === true; };
// The fetch stub resolves immediately; two microtask turns settle Promise.all and its .then. Split
// out of runFill() by Task 542, whose two doors start a fill without going through it.
function settle() {
	return new Promise(function (r) { setImmediate(function () { setImmediate(r); }); });
}
function runFill(answers) {
	confirmAnswers = answers.slice();
	confirmTexts = [];
	tileRequests = 0;
	EC.lpnTerrainFill();
	return settle();
}

(async function () {
	// ---- 5a. NOTHING IS SENT BEFORE CONSENT --------------------------------------------------
	jar.value = '';
	buildSite();
	L.setElev('J1', 123.45);          // typed, by a person
	L.setElev('J2', undefined);        // blank
	L.setElev('J3', undefined);        // blank
	await runFill([false]);            // "no" to the consent question
	ok('a refusal sends nothing at all', tileRequests === 0, tileRequests + ' tile requests');
	ok('...and writes no consent cookie', jar.value === '', jar.value);
	ok('...and changes no elevation',
		L.elev('J1') === 123.45 && L.elev('J2') === undefined && L.elev('J3') === undefined);
	ok('the consent question names the host and what is sent',
		/api\.mapbox\.com/.test(confirmTexts[0]) && /latitude and longitude/.test(confirmTexts[0]));
	ok('...and says a refusal costs nothing else on the page',
		/keeps working exactly as it does now/.test(confirmTexts[0]));

	// ---- 5b. CANCELLING THE PLAN SENDS NOTHING EITHER ------------------------------------------
	jar.value = '';
	await runFill([true, false]);      // yes to consent, no to the fill
	ok('cancelling the plan sends nothing', tileRequests === 0, tileRequests + ' tile requests');
	ok('...but the consent answer is remembered, because it was given',
		EC.lpnTerrainConsented() === true, jar.value);
	// **THE ACCURACY IS IN THE INTERFACE, NOT IN A COMMENT.** This is the confirm a person reads
	// immediately before the numbers change.
	// Asserted on the NUMBER and the caveat, not on the sentence. Tom rewrote this wording on
	// 2026-08-25 ("about 30 m horizontal resolution and several meters vertical accuracy") and a
	// check pinned to his old phrasing failed for no reason anybody cared about. What must never
	// go missing is the resolution itself and the sentence that stops a reader trusting it.
	ok('the plan states the ground resolution', /30 m/.test(confirmTexts[1]), confirmTexts[1]);
	ok('...and that it is not a survey', /not a survey/.test(confirmTexts[1]));
	ok('...and promises the one-step undo', /One Undo/.test(confirmTexts[1]));
	ok('...and counts the nodes it will leave alone',
		/1 node\(s\) already have an elevation/.test(confirmTexts[1]), confirmTexts[1]);
	ok('...and counts the requests it is about to make', /request\(s\) to api\.mapbox\.com/.test(confirmTexts[1]));
	// **AND NAMES THEM, IN BOTH DIRECTIONS** (2026-08-25). Tom: *"Elsewhere in lpn we are careful
	// to list what we found. Add a way to indicate which nodes were edited or will be edited or
	// both."* A count is a promise; a list is a promise a person can check against the drawing in
	// front of them before pressing the button.
	ok('...and NAMES the nodes it will fill in',
		/will get an elevation: J2, J3/.test(confirmTexts[1]), confirmTexts[1]);
	ok('...and NAMES the node it will leave alone',
		/Those nodes are: J1/.test(confirmTexts[1]), confirmTexts[1]);
	ok('...and never names a node on the wrong side of the line',
		!/will get an elevation: [^\n]*J1/.test(confirmTexts[1]));

	// ---- 5c. THE FILL ITSELF -------------------------------------------------------------------
	await runFill([true]);             // already consented; one confirm, the plan
	ok('the blank elevations are filled in', typeof L.elev('J2') === 'number' && typeof L.elev('J3') === 'number',
		L.elev('J2') + ', ' + L.elev('J3'));
	// **THE PROMISE THE WHOLE FEATURE RESTS ON.**
	ok('AN ELEVATION SOMEBODY TYPED IS NEVER OVERWRITTEN', L.elev('J1') === 123.45, String(L.elev('J1')));
	// Two, because these three nodes straddle a z14 tile boundary -- which is the point: the count is
	// TILES, not nodes, and it is the tile grid that decides, not us.
	ok('a handful of nodes cost a handful of requests, not one each',
		tileRequests <= 2, tileRequests + ' requests: ' + servedTiles.join(' '));
	// The value is checked against the synthetic surface AT THE NODE, so a wrong tile, a wrong pixel
	// or a wrong decode all fail here. Tolerance is one pixel of terrain slope plus the 0.1 m quantum.
	SITE.slice(1).forEach(function (s) {
		const got = metresOf(L.elev(s.id)), want = surface(s.lon, s.lat);
		ok(`${s.id} reads the land surface at its own position`, Math.abs(got - want) < 1.0,
			got.toFixed(2) + ' m vs ' + want.toFixed(2) + ' m');
	});
	// The number lands in the unit the strip is showing, not in metres.
	ok('the number is in the project\'s own elevation unit, not metres',
		L.elev('J2') > surface(SITE[1].lon, SITE[1].lat) * 3, L.elev('J2') + ' ft');
	ok('...and is rounded to the precision the data has',
		String(L.elev('J2')).split('.')[1] === undefined || String(L.elev('J2')).split('.')[1].length <= 2,
		String(L.elev('J2')));

	// ---- 5c-quater. THE NOTICE AFTERWARDS NAMES WHAT WAS ACTUALLY WRITTEN ------------------------
	// The other direction of the same promise. It is composed from the ids the DOCUMENT handed back,
	// not from the ids that were asked for, which is what makes it survive 5c-bis below.
	ok('the result notice names the nodes that were filled in',
		/got an elevation: J2, J3/.test(noticeText()), noticeText());
	ok('...and does not name the one it left alone', !/J1/.test(noticeText()), noticeText());
	ok('...and still carries the accuracy sentence and the Mapbox credit',
		/30 m/.test(noticeText()) && /Mapbox/.test(noticeText()));

	// ---- 5c-ter. A LONG LIST IS CAPPED, NOT A WALL -----------------------------------------------
	// These sentences go into a native confirm() and a self-clearing status notice, neither of which
	// can scroll -- so the list names the first few and then says how many it did not name. The
	// import report can afford every id because it renders into a dialog with a scrollbar; this
	// cannot. What must never happen is a count that disagrees with the list beside it.
	{
		const N = 40;
		L.reset(L.GEO);
		for (let i = 0; i < N; i++) { L.addNode('junction', 0, 0); }
		for (let i = 0; i < N; i++) {
			L.place('J' + (i + 1), -122.6367 + i * 0.0004, 38.2323 + i * 0.0004);
			L.setElev('J' + (i + 1), undefined);
		}
		await runFill([true]);
		const plan = confirmTexts[0];
		const m = plan.match(/will get an elevation: ([^\n]*)/);
		ok('a 40-node fill does not print 40 names into the confirm',
			!!m && m[1].split(',').length <= 14, m && m[1]);
		ok('...it says how many it did not name, and the two add up',
			!!m && /and (\d+) more/.test(m[1]) &&
			(m[1].match(/J\d+/g).length + Number(m[1].match(/and (\d+) more/)[1]) === N),
			m && m[1]);
		ok('...and the result notice caps the same way',
			/got an elevation: [^\n]*and \d+ more/.test(noticeText()), noticeText());
		// The pure renderer, on its own, at the boundary. Twelve is the cap; twelve prints whole.
		const twelve = [];
		for (let i = 1; i <= 12; i++) { twelve.push('J' + i); }
		ok('exactly at the cap, every name is printed and nothing is elided',
			EC.lpnTerrainNameList(twelve) === twelve.join(', ') &&
			!/more/.test(EC.lpnTerrainNameList(twelve)), EC.lpnTerrainNameList(twelve));
		ok('...one past it, the elision starts and counts the remainder',
			/and 1 more/.test(EC.lpnTerrainNameList(twelve.concat(['J13']))),
			EC.lpnTerrainNameList(twelve.concat(['J13'])));
		ok('an empty list produces no sentence at all', EC.lpnTerrainNameList([]) === '');
	}

	// ---- 5c-bis. TYPED WHILE THE REQUEST WAS IN FLIGHT ------------------------------------------
	// **THE SECOND HALF OF THE PROMISE, AND THE ONLY WAY TO SEE IT.** The plan is built from the
	// nodes that had no elevation, so in the ordinary path a typed node is never even in the list.
	// The guard that matters is the one at the moment of WRITING: between the request going out and
	// the answer coming back, a person may have typed the very number we are about to replace. This
	// makes that happen, by typing from inside the tile stub.
	{
		buildSite();
		SITE.forEach(function (s) { L.setElev(s.id, undefined); });
		const realStub = EC.lpnTerrainFetchPixels;
		EC.lpnTerrainFetchPixels = function (tile) {
			L.setElev('J2', 55.5);          // the user types, while the tile is on the wire
			return realStub(tile);
		};
		await runFill([true]);
		EC.lpnTerrainFetchPixels = realStub;
		ok('an elevation typed WHILE the request was in flight is not overwritten',
			L.elev('J2') === 55.5, String(L.elev('J2')));
		ok('...and the others are still filled', typeof L.elev('J3') === 'number', String(L.elev('J3')));
		// **AND THE NOTICE TELLS THE TRUTH ABOUT IT.** J2 was asked for and not written, so it must
		// be named as still blank and must NOT be named as filled in -- which is only possible
		// because the list comes back from the document rather than from the request.
		ok('a node that was asked for but not written is named as still blank',
			/still have no elevation: [^\n]*J2/.test(noticeText()), noticeText());
		ok('...and is not also named among the ones that were filled in',
			!/got an elevation: [^.]*J2/.test(noticeText()), noticeText());
		L.undo();
	}

	// ---- 5d. ONE UNDO PUTS THE WHOLE FILL BACK -------------------------------------------------
	buildSite();
	L.setElev('J1', 123.45);
	L.setElev('J2', undefined);
	L.setElev('J3', undefined);
	await runFill([true]);
	L.undo();
	ok('ONE Ctrl-Z reverts every node the fill touched',
		L.elev('J2') === undefined && L.elev('J3') === undefined,
		L.elev('J2') + ', ' + L.elev('J3'));
	ok('...and leaves the typed one where it was', L.elev('J1') === 123.45);

	// ---- 5e. NOTHING LEFT TO DO SAYS SO, AND SENDS NOTHING --------------------------------------
	buildSite();
	SITE.forEach(function (s, i) { L.setElev(s.id, 100 + i); });
	await runFill([true]);
	ok('a network whose elevations are all set sends nothing',
		tileRequests === 0, tileRequests + ' tile requests');
	ok('...and none of them moved',
		L.elev('J1') === 100 && L.elev('J2') === 101 && L.elev('J3') === 102);

	// ---- 5f. THE STARTING ELEVATION IS A SEPARATE QUESTION ---------------------------------------
	// A node drawn on the map is born at 0, so a freshly drawn network has no blanks at all -- only
	// a number nobody typed. That is offered, in its own question, with the number named in it.
	buildSite();   // addNode() seeds every node with settings.defaults.nodeElev, which is 0
	ok('a freshly drawn network has no blank elevations at all',
		L.elev('J1') === 0 && L.elev('J2') === 0 && L.elev('J3') === 0);
	await runFill([true]);
	ok('the starting elevation is offered as its own question, naming the number',
		/still at 0/.test(confirmTexts[0]) && /rather than one you typed/.test(confirmTexts[0]),
		confirmTexts[0]);
	ok('...and it fills them once agreed', L.elev('J1') !== 0 && L.elev('J2') !== 0 && L.elev('J3') !== 0,
		[L.elev('J1'), L.elev('J2'), L.elev('J3')].join(', '));
	L.undo();
	ok('...and one undo puts all three back to the starting elevation',
		L.elev('J1') === 0 && L.elev('J2') === 0 && L.elev('J3') === 0);
	// Declining that second question changes nothing, which is the whole reason it is asked.
	await runFill([false]);
	ok('declining the starting-elevation question changes nothing',
		L.elev('J1') === 0 && L.elev('J2') === 0 && L.elev('J3') === 0);
	// And a typed number that HAPPENS to differ from the seed is never in that set.
	buildSite();
	L.setElev('J1', 7);
	await runFill([true]);
	ok('a typed elevation is not swept up by the starting-elevation question',
		L.elev('J1') === 7, String(L.elev('J1')));

	// ---- 5g. A GRID PROJECT HAS NO PLACE ON THE EARTH ---------------------------------------------
	L.reset(null);
	L.addNode('junction', 10, 10);
	L.setElev('J1', undefined);
	await runFill([true, true]);
	ok('a grid project asks nothing and sends nothing',
		tileRequests === 0 && confirmTexts.length === 0, tileRequests + ' requests');

	// ---- 6. TASK 542: TWO ORDINARY CONTROLS, AND THE MENU ROW GONE ------------------------------
	//
	// Tom pressed the menu row and wrote the defect himself: *"To be honest, I did not expect nor
	// necessarily welcome what I got. I was just a dilettante pushing a cool new button that I
	// found."* It filled every blank elevation on the drawing in one press. His replacement, in his
	// words: an option at *"Setting.New assets.Values.Elevation"*, and *"From DEM as an option for
	// New value"* in Find and replace. **And then the row goes.**
	section('Task 542: elevation on creation, and on a found set');

	// ---- 6a. THE ROW IS GONE, WHICH IS THE PART THAT IS EASY TO FORGET --------------------------
	{
		buildSite();
		const rows = L.mapMenuRows();
		const words = rows.map(r => String(r.label || '')).join(' | ');
		ok('the Map menu no longer offers a terrain-elevations row',
			!/[Ee]levation/.test(words), words);
	}

	// ---- 6b. A NODE BORN ON A GEOGRAPHIC PROJECT READS ITS OWN GROUND --------------------------
	{
		jar.value = '';
		L.reset(L.GEO);
		L.setElevSource('dem');
		L.addNode('junction', 0, 0);
		L.place('J1', -122.4, 37.8);
		// **BORN BLANK, NOT BORN AT THE DEFAULT.** The fill refuses to overwrite a number that is
		// already there, so seeding settings.defaults.nodeElev first and reading the DEM second
		// would give every node the default and nothing else. Blank is also the honest interim
		// state: 0 is sea level, which is a claim.
		ok('the new node is born with no elevation at all', L.elev('J1') === undefined,
			String(L.elev('J1')));
		ok('...and is queued rather than fetched on the spot', L.queueLength() === 1,
			L.queueLength());
		// The consent gate applies here exactly as it does to the menu row: what it protects is that
		// a node coordinate says where the user's network IS, which is true however the fill started.
		confirmAnswers = [false];
		confirmTexts = [];
		tileRequests = 0;
		L.flushNewNodes();
		await settle();
		ok('refusing consent leaves it blank and sends nothing',
			L.elev('J1') === undefined && tileRequests === 0, tileRequests + ' requests');
	}
	{
		jar.value = '';
		L.reset(L.GEO);
		L.setElevSource('dem');
		// **A BURST OF DRAWING IS ONE BATCH.** Ten junctions in a few seconds is ten addNode() calls
		// for ten points almost certainly on the same tile; ten requests would be nine spent on
		// nothing, with the consent-gated third-party call on the critical path of the gesture.
		for (let i = 0; i < 6; i++) {
			L.addNode('junction', 0, 0);
			L.place('J' + (i + 1), -122.4 + i * 0.001, 37.8);
		}
		ok('six nodes drawn in a burst are one queue', L.queueLength() === 6, L.queueLength());
		confirmAnswers = [true];   // the consent question, asked once per browser
		confirmTexts = [];
		tileRequests = 0;
		byId.lpn_map_notice.textContent = '';   // the refusal above is not this block's news
		L.flushNewNodes();
		await settle();
		ok('...answered by ONE tile request, not six', tileRequests === 1, tileRequests + ' requests');
		ok('...and every one of them has an elevation now',
			['J1', 'J2', 'J3', 'J4', 'J5', 'J6'].every(id => typeof L.elev(id) === 'number'),
			JSON.stringify(['J1', 'J2', 'J3', 'J4', 'J5', 'J6'].map(id => L.elev(id))));
		// **QUIET.** A node being born must not narrate itself; the elevations simply appear. The
		// menu row's own "Reading the land surface…" and its done-line are what this replaced.
		ok('...and it said nothing, because nothing went wrong', noticeText() === '',
			JSON.stringify(noticeText()));
	}
	{
		// The setting is off by default, and off means exactly the old behaviour.
		jar.value = '';
		L.reset(L.GEO);
		tileRequests = 0;
		L.setElevSource('value');
		L.addNode('junction', 0, 0);
		L.place('J1', -122.4, 37.8);
		ok('with the setting off a node still takes the typed default',
			L.elev('J1') === 0 && L.queueLength() === 0, String(L.elev('J1')));
		// And a GRID project cannot read the Earth however the setting is set.
		L.reset(null);
		L.setElevSource('dem');
		L.addNode('junction', 10, 10);
		ok('a grid project ignores the setting entirely',
			L.elev('J1') === 0 && L.queueLength() === 0, String(L.elev('J1')));
	}

	{
		// **A 600 ms TIMER OUTLIVES A TAB SWITCH.** The queue holds IDS, and an id resolves against
		// whatever document is open when it fires -- so a node drawn as J1 here, and a switch to a
		// project with its own J1, would write an elevation into a network nobody was looking at
		// from a place they never drew. Dropping a MISSING id cannot catch that: the collision is
		// between two ids that both exist.
		jar.value = '';
		L.reset(L.GEO);
		L.setElevSource('dem');
		L.addNode('junction', 0, 0);
		L.place('J1', -122.4, 37.8);
		ok('the node is queued', L.queueLength() === 1, L.queueLength());
		L.switchProject();
		confirmAnswers = [true];
		tileRequests = 0;
		L.flushNewNodes();
		await settle();
		ok('a project switch before the timer fires sends nothing',
			tileRequests === 0, tileRequests + ' requests');
		ok('...and leaves the node it was about untouched', L.elev('J1') === undefined,
			String(L.elev('J1')));
	}

	// ---- 6c. FIND AND REPLACE, WITH ELEVATION SET TO FROM DEM -----------------------------------
	{
		jar.value = '';
		L.reset(L.GEO);
		L.setElevSource('value');
		L.addNode('junction', 0, 0); L.place('J1', -122.4, 37.80);
		L.addNode('junction', 0, 0); L.place('J2', -122.4, 37.81);
		// **NUMBERS A PERSON PUT THERE**, which is the whole difference between this door and the
		// menu row: Replace exists to change what is already there, the user chose the property and
		// the set, and the preview says how many before anything happens.
		L.setElev('J1', 111);
		L.setElev('J2', 222);
		tileRequests = 0;
		confirmAnswers = [true];   // consent; the fill itself asks nothing on this door
		const asked = L.replace('elev', 'dem');
		await settle();
		ok('Replace with From DEM asks for every node the query found', asked === 2, asked);
		ok('...and overwrites the numbers that were there',
			L.elev('J1') !== 111 && L.elev('J2') !== 222 &&
			typeof L.elev('J1') === 'number' && typeof L.elev('J2') === 'number',
			L.elev('J1') + ', ' + L.elev('J2'));
		// **AND IT IS ONE UNDO STEP**, taken inside terrainFillElevations() where the numbers
		// actually arrive -- not one here as well, which would put an empty step on the stack.
		L.undo();
		ok('...and one undo puts both back', L.elev('J1') === 111 && L.elev('J2') === 222,
			L.elev('J1') + ', ' + L.elev('J2'));
	}
	{
		// The source is only ever offered for Elevation, and switching property must not leave it
		// armed -- a Replace marked 'dem' on Diameter would be a write nobody asked for.
		jar.value = '';
		L.reset(L.GEO);
		L.addNode('junction', 0, 0);
		L.place('J1', -122.4, 37.8);
		L.setElev('J1', 55);
		tileRequests = 0;
		confirmAnswers = [true];
		const n = L.replace('demand', 'dem');
		await settle();
		ok('a DEM source on a property that is not Elevation sends nothing',
			tileRequests === 0, tileRequests + ' requests');
		ok('...and leaves the elevation exactly as it was', L.elev('J1') === 55, String(L.elev('J1')));
		void n;
	}

	// ---- 7. SAMPLE FIRST, THEN DECIDE (Task 542, Tom 2026-08-29) --------------------------------
	//
	// *"I want to see the DEM elevation before I destroy the current elevation. Telling me what the
	// Mapbox DEM says after putting it in the input is of no value whatsoever."* And then, of the
	// rebuilt control: *"DEM Sample does nothing."* So this section drives the button the way the
	// popup does and asserts each link of the chain separately -- "does nothing" can break at the
	// request, at the recording, or at the redraw, and a harness that only checked the last one
	// would not say which.
	section('Task 542: sample, see the number, then decide');
	{
		jar.value = '';
		L.reset(L.GEO);
		L.addNode('junction', 0, 0);
		L.place('J1', -122.4, 37.8);
		L.setElev('J1', 500);          // a number a person put there, which must survive a sample
		confirmAnswers = [true];       // the consent question, once per browser
		tileRequests = 0;
		let got = null;
		EC.lpnTerrainSample([{ id: 'J1', lon: -122.4, lat: 37.8 }], function (h) { got = h; });
		await settle();
		ok('Sample sends one tile request', tileRequests === 1, tileRequests + ' requests');
		ok('...and calls back with a reading', !!got && got.length === 1, JSON.stringify(got));
		// **THE READING IS RECORDED WHERE THE POPUP LOOKS FOR IT.** This is the link that "does
		// nothing" would break silently: the fetch succeeds, the callback fires, and the number
		// never reaches terrainLastRead because the `record` seam was not wired.
		ok('...recorded against the node, for the popup to show',
			typeof L.lastRead('J1') === 'number', String(L.lastRead('J1')));
		// **AND IT WROTE NOTHING**, which is the whole point of a sample.
		ok('...while the elevation the person typed is untouched', L.elev('J1') === 500,
			String(L.elev('J1')));
	}
	{
		// The popup, built after a sample, must SHOW the number and offer to use it.
		L.renderNode('J1');
		const text = L.popupText();
		ok('the popup states what the DEM said', /Mapbox DEM says/.test(text),
			JSON.stringify(text.slice(0, 200)));
		const btns = L.popupButtons().map(b => b.textContent);
		ok('...and offers a Use button carrying the number',
			btns.some(t => /^Use /.test(t)), JSON.stringify(btns));
	}
	{
		// **OPENING A NODE SAMPLES NOTHING** (Tom, 2026-08-29, deprecating the automatic read:
		// *"we should instead have buttons under Elevation for Sample DEM and Use DEM"*). Merely
		// LOOKING at a node must not send a consent-gated third-party request, and a control that
		// only appears once some invisible state exists is what made the previous shape unreadable.
		L.setElevSource('value');
		const nid = L.addNode('junction', 0, 0).id;
		L.place(nid, -122.5, 37.9);
		L.setElev(nid, 42);
		confirmAnswers = [true];
		tileRequests = 0;
		L.openPopupFor(nid);
		await settle();
		ok('opening a node editor sends nothing at all', tileRequests === 0,
			tileRequests + ' requests');
		ok('...and leaves the elevation alone', L.elev(nid) === 42, String(L.elev(nid)));
		// **BOTH BUTTONS ARE THERE BEFORE ANYTHING HAS BEEN READ.** That is the whole of what makes
		// a press legible: press Sample, and if nothing you can see changes, the second button is
		// still there to tell you the row exists and the press was heard.
		const b0 = L.popupButtons().map(b => b.textContent);
		ok('...but both buttons are already offered',
			b0.some(t => /Read DEM/.test(t)) && b0.some(t => /Use DEM/.test(t)),
			JSON.stringify(b0));
		// Sample reads and shows, and writes nothing.
		const sampleBtn = L.popupButtons().filter(b => /Read DEM/.test(b.textContent))[0];
		tileRequests = 0;
		sampleBtn._listeners.click[0]();
		await settle();
		ok('pressing Sample DEM sends one request', tileRequests === 1, tileRequests + ' requests');
		// **READ WITHOUT RE-RENDERING BY HAND.** The line must appear because the sample's own
		// callback called refreshPopupIfOpen(), which is the link a "does nothing" report is about.
		ok('...and states the height without touching the elevation',
			/Mapbox DEM says/.test(L.popupText()) && L.elev(nid) === 42,
			L.elev(nid) + ' / ' + JSON.stringify(L.popupText().slice(0, 90)));
		// Use writes it.
		const useBtn = L.popupButtons().filter(b => /Use DEM/.test(b.textContent))[0];
		useBtn._listeners.click[0]();
		await settle();
		ok('...and Use DEM then writes that height into the elevation',
			typeof L.elev(nid) === 'number' && L.elev(nid) !== 42, String(L.elev(nid)));
	}
	{
		// **Use DEM WITH NOTHING SAMPLED READS FIRST, THEN WRITES.** Pressing a button that says
		// "Use DEM" is asking for exactly that, and the number it used is stated underneath after.
		L.setElevSource('value');
		const nid2 = L.addNode('junction', 0, 0).id;
		L.place(nid2, -122.6, 38.0);
		L.setElev(nid2, 77);
		confirmAnswers = [true];
		tileRequests = 0;
		L.openPopupFor(nid2);
		const use2 = L.popupButtons().filter(b => /Use DEM/.test(b.textContent))[0];
		use2._listeners.click[0]();
		await settle();
		ok('Use DEM with nothing sampled reads and then writes', tileRequests === 1 &&
			typeof L.elev(nid2) === 'number' && L.elev(nid2) !== 77,
			tileRequests + ' requests, elev ' + L.elev(nid2));
		ok('...and says which height it used', /Mapbox DEM says/.test(L.popupText()),
			JSON.stringify(L.popupText().slice(0, 90)));
	}

	// ---- 5h. THE ONE STRUCTURAL ASSERTION ABOUT THE NETWORK --------------------------------------
	ok('NOT ONE REAL REQUEST LEFT THIS PROCESS', realFetches === 0, realFetches + ' real fetches');

	console.log(fails ? `\n${fails} FAILURE(S)` : '\nall assertions passed');
	process.exit(fails ? 1 : 0);
}());

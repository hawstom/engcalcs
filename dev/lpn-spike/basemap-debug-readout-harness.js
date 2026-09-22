// THE TILE READOUT COUNTS WHAT IT SAYS IT COUNTS -- ?debug=tiles, ROADMAP Task 703.
//   node dev/lpn-spike/basemap-debug-readout-harness.js
//
// **WHY THIS IS A TEST AND NOT A LOOK.** The readout is an INSTRUMENT: it exists so that Tom, who
// is the only person who can see the blank squares, can report a number instead of a feeling.
// Four rounds of measure-and-fix have each ended with him still seeing white rectangles, and an
// instrument that miscounts would send a fifth round off in the wrong direction -- more expensively
// than no instrument at all, because a number is believed.
//
// So every count is driven here against a known outcome: a screenful of tiles where some arrive,
// some fail, some come back out of the cache, and the answers are worked out by hand.
//
// **WHAT IT CANNOT SEE, said plainly.** It runs on lpn-dom-stub.js, which has no network, so the
// load and error events are fired by hand -- the same method basemap-cache-harness.js uses and for
// the same reason. The failure PROBE (which asks the network why a tile failed) therefore cannot
// run here at all; it needs a real browser and a real refusal.

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\trefresh: refreshBasemap, layer: function () { return basemapLayer; },\n" +
	"\t\ttileEls: function () { return basemapEls; },\n" +
	"\t\tcounts: function () { return tileDebugCounts(); },\n" +
	"\t\tseen: function () { return basemapSeen; },\n" +
	"\t\twantKeys: function () { return basemapWantKeys; },\n" +
	"\t\tcache: function () { return basemapCache; },\n" +
	"\t\tsetSized: function () { mapSized = true; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { applyView(v); },\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, ");

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function fire(img, type) {
	((img._listeners || {})[type] || []).forEach(function (f) { f(); });
}

L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;
const P = L.getProject();
P.coords = L.GEO;
P.basemap = 'osm';
L.setSized();
L.setCanvas(1000, 500);

const VIEW_A = { cx: -122.57, cy: 38.11, s: 2000 };
const VIEW_B = { cx: -121.57, cy: 39.11, s: 2000 };

// =================================================================================================
// 1. A FRESH VIEW: EVERYTHING WANTED IS REQUESTED AND EVERYTHING IS OUTSTANDING
// =================================================================================================
L.setView(VIEW_A);
L.refresh();
const keysA = Object.keys(L.tileEls());
let c = L.counts();
ok('the readout counts the tiles this view wants', c.wanted === keysA.length,
	c.wanted + ' wanted');
ok('...all of them requested, none from cache', c.requested === c.wanted && c.cached === 0,
	c.requested + ' requested, ' + c.cached + ' cached');
ok('...and every one of them outstanding before any answer comes back',
	c.outstanding === c.wanted && c.arrived === 0 && c.drawn === 0 && c.failed === 0,
	c.outstanding + ' outstanding');

// =================================================================================================
// 2. SOME ARRIVE AND SOME FAIL, AND THE READOUT SPLITS THEM
// =================================================================================================
// **THE NUMBER THAT NAMES THE FAILURE IS "outstanding", AND THE ONE THAT NAMES A REFUSAL IS
// "failed".** A view stuck at requested 12, arrived 9 is a network that never answered; a view
// reading failed 3 is a server that said no, and the reason line says which no.
const failKeys = keysA.slice(0, 3), okKeys = keysA.slice(3);
okKeys.forEach(k => fire(L.tileEls()[k], 'load'));
failKeys.forEach(k => fire(L.tileEls()[k], 'error'));
c = L.counts();
ok('arrived counts only the tiles that came back with a picture', c.arrived === okKeys.length,
	c.arrived + ' of ' + keysA.length);
ok('failed counts only the tiles that came back without one', c.failed === failKeys.length,
	c.failed + ' failed');
ok('...drawn agrees with arrived, because a failure draws nothing', c.drawn === okKeys.length,
	c.drawn + ' drawn');
ok('...and nothing is left outstanding once every tile has answered', c.outstanding === 0);
ok('retried counts the repair attempts the page scheduled', c.retried === failKeys.length,
	c.retried + ' retries over ' + failKeys.length + ' failures');
ok('every failure is named in the readout, by tile key', c.fails.length === failKeys.length
	&& c.fails.every(s => failKeys.some(k => s.indexOf(k) === 0)), c.fails.join(' | '));

// **A FAILURE WITH NO ANSWER YET SAYS SO RATHER THAN LOOKING FINE.** The probe cannot run without
// a network, so this is what Tom would see for the fraction of a second before it answers -- and
// what he would see forever if the probe itself were blocked. It must never read as blank.
ok('...and a failure whose reason is not known yet says that', 
	c.fails.every(s => s.indexOf('no answer yet') > 0 || s.indexOf('asking') > 0), c.fails[0]);

// =================================================================================================
// 3. A SECOND VIEW RE-BASES EVERY COUNT -- THE READOUT IS ABOUT THE VIEW ON SCREEN
// =================================================================================================
// This is the leg that keeps the instrument honest over a pan. If the counts accumulated over the
// life of the page instead, "wanted 400, drawn 380" would be a reassuring number about a screen
// with six white rectangles on it.
L.setView(VIEW_B);
L.refresh();
const keysB = Object.keys(L.tileEls()).filter(k => keysA.indexOf(k) < 0);
c = L.counts();
ok('a new view wants a different set and counts only that set',
	c.wanted === L.wantKeys().length && L.wantKeys().every(k => keysA.indexOf(k) < 0),
	c.wanted + ' wanted');
ok('...so the previous view\'s failures are no longer counted', c.failed === 0);
Object.keys(L.tileEls()).forEach(k => fire(L.tileEls()[k], 'load'));

// =================================================================================================
// 4. A TILE SERVED FROM THE CACHE IS COUNTED AS CACHED AND NOT AS REQUESTED
// =================================================================================================
// R-055's cache is the reason a pan away and back costs nothing, and it is also the reason a naive
// reading of "requested" would understate what the map needed. The two are kept apart.
L.setView(VIEW_A);
L.refresh();
c = L.counts();
const cachedBack = L.wantKeys().filter(k => okKeys.indexOf(k) >= 0);
ok('a tile handed back by the cache is counted as cached', c.cached >= cachedBack.length,
	c.cached + ' from cache');
ok('...and is drawn without being requested again',
	c.drawn >= cachedBack.length && c.requested < c.wanted,
	c.drawn + ' drawn, ' + c.requested + ' requested of ' + c.wanted);

// =================================================================================================
// 5. THE BOOKKEEPING IS BOUNDED
// =================================================================================================
// A record per tile key for the life of the page would grow without limit on a long session of
// panning. It is dropped wholesale past a few thousand, which is safe because every number the
// readout prints is derived from the CURRENT want list.
ok('the per-tile record set is bounded', Object.keys(L.seen()).length < 4100,
	Object.keys(L.seen()).length + ' records');

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall passed');
process.exit(fails ? 1 : 0);

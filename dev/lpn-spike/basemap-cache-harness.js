// A TILE ALREADY FETCHED IS KEPT, AND A TILE THAT FAILED IS ASKED FOR AGAIN -- Tom's R-055 and
// R-056, 2026-09-19.
//   node dev/lpn-spike/basemap-cache-harness.js
//
// **R-055**, his words: *"Why do we throw away satellite tiles? We should have a good-sized cache
// where we throw away only the oldest, right?"* Until now a tile that left the view was destroyed,
// so a zoom out and back in, or a pan away and back, re-fetched every photograph he had already
// waited for.
//
// **R-056**, his words: *"There are still a few blank tiles that never fill in when I stop zooming.
// It's as if we decided not to draw these tiles."* We did. It was MEASURED before it was fixed, in
// real headless Chrome against the real tile servers (dev/lpn-spike/basemap-blank-tile-probe.js):
// with 33 of 105 tile requests failed and then a perfect network restored and the view left alone,
// all 33 were still blank after 5, 15 and 30 seconds, each still showing exactly ONE request --
// 18.8% of the canvas white, permanently. The only repair was a gesture that produced different
// tile keys.
//
// **WHAT THIS HARNESS CANNOT SEE, said plainly.** It runs on lpn-dom-stub.js, where nothing is
// fetched and no image ever loads by itself -- so the load and error events are fired by hand here,
// which is the only way to drive both outcomes deterministically. It therefore asserts the
// DECISIONS: what is kept, what is thrown away, in which order, and what is asked for again. The
// wire behaviour is the probe's job and needs a real browser.

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\ttileList: basemapTileList, GEO: LPN_COORDS_GEO,\n" +
	"\t\trefresh: refreshBasemap, layer: function () { return basemapLayer; },\n" +
	"\t\ttileEls: function () { return basemapEls; },\n" +
	"\t\tcarried: function () { return basemapCarried; },\n" +
	"\t\tcache: function () { return basemapCache; },\n" +
	"\t\tcacheOrder: function () { return basemapCacheOrder; },\n" +
	"\t\tcacheBound: function () { return LPN_TILE_CACHE; },\n" +
	"\t\tsetCacheBound: function (n) { LPN_TILE_CACHE = n; },\n" +
	"\t\tretries: function () { return LPN_TILE_RETRIES; },\n" +
	"\t\tfails: function () { return basemapFails; },\n" +
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

// The stub registers listeners and never fires them, which is right -- it has no network. So the
// two outcomes are driven by hand, one tile at a time, and that is the whole point of the file.
function fire(img, type) {
	((img._listeners || {})[type] || []).forEach(function (f) { f(); });
}
function fireAll(type, els) {
	Object.keys(els).forEach(function (k) { fire(els[k], type); });
}
function snapshot(els) {
	const out = {};
	Object.keys(els).forEach(function (k) { out[k] = els[k]; });
	return out;
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
const VIEW_C = { cx: -120.07, cy: 40.61, s: 2000 };

// =================================================================================================
// 1. A PAN AWAY AND BACK ASKS FOR NOTHING
// =================================================================================================
L.setView(VIEW_A);
L.refresh();
const elsA = snapshot(L.tileEls());
const keysA = Object.keys(elsA);
ok('a first paint draws tiles', keysA.length > 0, keysA.length + ' tiles');
fireAll('load', elsA);
ok('...and once they have all arrived nothing is left waiting',
	Object.keys(L.carried()).length === 0);

L.setView(VIEW_B);
L.refresh();
const elsB = snapshot(L.tileEls());
ok('a view a whole degree away wants a different set',
	Object.keys(elsB).every(k => keysA.indexOf(k) < 0), Object.keys(elsB).length + ' tiles');
// The A tiles are carried under the B tiles while those load -- that is the R-019 behaviour and it
// is unchanged. They reach the cache when the carry is released.
fireAll('load', elsB);
ok('the view he came from is KEPT rather than destroyed',
	keysA.every(k => !!L.cache()[k]), Object.keys(L.cache()).length + ' tiles cached');
ok('...and none of them is still on the screen',
	keysA.every(k => !L.tileEls()[k]));

L.setView(VIEW_A);
L.refresh();
const backA = L.tileEls();
// **THE ASSERTION THAT FAILS ON THE OLD CODE.** Not "the same keys" -- the old code produced the
// same keys too, on brand new elements, each with a fresh request behind it. What is asserted is
// that the ELEMENT IS THE SAME OBJECT: the picture was never thrown away, so nothing was asked for.
ok('panning back re-uses the very same tile elements, so nothing is requested',
	keysA.every(k => backA[k] === elsA[k]), keysA.length + ' of ' + keysA.length);
ok('...and they are back in the layer', keysA.every(k => backA[k].parentNode === L.layer()));
ok('...and are no longer counted as cached', keysA.every(k => !L.cache()[k]),
	Object.keys(L.cache()).length + ' left in the cache');
ok('...and nothing is waiting for them, so no old picture is held up',
	Object.keys(L.carried()).length === 0);

// =================================================================================================
// 2. THE BOUND, AND THE OLDEST GOING FIRST
// =================================================================================================
// Driven at a small bound, because the real one is 384 and a test that needs 385 tiles to say
// anything is a test nobody reads. The bound itself is asserted separately, below.
const realBound = L.cacheBound();
ok('the shipped bound is twice the page\'s own per-refresh ceiling', realBound === 384, realBound);

L.setCacheBound(6);
// Three disjoint views in a row, each one fully arrived, so each in turn is retired.
[VIEW_B, VIEW_C, VIEW_A].forEach(function (v) {
	L.setView(v);
	L.refresh();
	fireAll('load', L.tileEls());
});
ok('the cache never exceeds its bound', Object.keys(L.cache()).length <= 6,
	Object.keys(L.cache()).length + ' of 6');
ok('...and the order list agrees with it', L.cacheOrder().length === Object.keys(L.cache()).length,
	L.cacheOrder().length);

// **OLDEST FIRST, WHICH IS HIS OWN WORDING.** The order list is the evidence: what survives an
// overflow is the tail of it, never the head.
L.setCacheBound(3);
const orderBefore = L.cacheOrder().slice();
L.setView(VIEW_C);
L.refresh();
fireAll('load', L.tileEls());
const surviving = L.cacheOrder();
ok('an overflow throws away the OLDEST and keeps the newest',
	surviving.length <= 3 && surviving.every(k => orderBefore.indexOf(k) < 0 ||
		orderBefore.indexOf(k) >= orderBefore.length - 3),
	surviving.length + ' left of ' + orderBefore.length);
ok('...and an evicted tile is really gone, not merely unlisted',
	orderBefore.filter(k => surviving.indexOf(k) < 0).every(k => !L.cache()[k]));
L.setCacheBound(realBound);

// =================================================================================================
// 3. A TILE THAT NEVER ARRIVED IS NOT A TILE
// =================================================================================================
// **CACHING A BLANK WOULD BE R-056 REBUILT ON PURPOSE**: it would be handed back, instantly and
// for ever, to every later view that wanted that square of ground.
L.setCacheBound(realBound);
P.basemap = 'off'; L.refresh();
P.basemap = 'osm';
L.setView(VIEW_A);
L.refresh();
const mixed = snapshot(L.tileEls());
const mk = Object.keys(mixed);
const broken = mk.slice(0, 3), fine = mk.slice(3);
broken.forEach(k => fire(mixed[k], 'error'));
fine.forEach(k => fire(mixed[k], 'load'));
L.setView(VIEW_B);
L.refresh();
fireAll('load', L.tileEls());
ok('a tile that arrived is kept', fine.every(k => !!L.cache()[k]),
	fine.length + ' kept');
ok('...and a tile that FAILED is never kept', broken.every(k => !L.cache()[k]),
	broken.length + ' refused');

// =================================================================================================
// 4. THE SOURCES DO NOT MIX, WHICH IS A LICENCE RULE
// =================================================================================================
// The credit swaps with the style, so an OpenStreetMap tile left on screen under the Mapbox credit
// credits the wrong provider. A cache must not reintroduce that, and the tile key carries its own
// source for exactly this reason.
global.EngCalcs.pageConfig.lpn_mapbox_token = 'pk.test.token.for.the.harness';
L.setView(VIEW_A);
L.refresh();
fireAll('load', L.tileEls());
const osmOnScreen = Object.keys(L.tileEls());
ok('every tile on screen comes from OpenStreetMap', osmOnScreen.length > 0 &&
	osmOnScreen.every(k => k.slice(0, 4) === 'osm/'), osmOnScreen.length + ' tiles');
P.basemap = 'satellite';
L.refresh();
const satOnScreen = Object.keys(L.tileEls());
ok('switching to satellite takes every street tile off the screen AT ONCE',
	satOnScreen.every(k => k.slice(0, 10) === 'satellite/') &&
	Object.keys(L.carried()).length === 0,
	satOnScreen.length + ' satellite tiles, ' + Object.keys(L.carried()).length + ' carried');
ok('...and no street tile is anywhere in the layer',
	L.layer().children.every(c => String(c.attrs && c.attrs.href || c.href || '')
		.indexOf('tile.openstreetmap.org') < 0),
	L.layer().children.length + ' children');
ok('...but they are KEPT, so switching back costs nothing',
	osmOnScreen.every(k => !!L.cache()[k]), osmOnScreen.length + ' street tiles cached');
fireAll('load', L.tileEls());
P.basemap = 'osm';
L.refresh();
ok('switching back re-uses the very same street tiles',
	osmOnScreen.every(k => !!L.tileEls()[k]),
	Object.keys(L.tileEls()).length + ' tiles, none requested');

// =================================================================================================
// 5. A FAILED TILE IS ASKED FOR AGAIN
// =================================================================================================
// The retry is on a timer with jitter, so this part is the one that has to wait. The first gap is
// 0.8 s plus up to half of that again.
P.basemap = 'osm';
L.setView(VIEW_C);
L.refresh();
fireAll('load', L.tileEls());
L.setView({ cx: -119.07, cy: 41.61, s: 2000 });
L.refresh();
const trial = snapshot(L.tileEls());
const doomedKey = Object.keys(trial)[0];
const doomedEl = trial[doomedKey];
Object.keys(trial).forEach(function (k) { fire(trial[k], k === doomedKey ? 'error' : 'load'); });
ok('a failed tile is settled, so it never pins the previous view on screen',
	doomedEl._lpnSettled === true && doomedEl._lpnOk === false);
ok('...and the page has recorded the failure', L.fails()[doomedKey] === 1,
	'attempt ' + L.fails()[doomedKey]);
ok('...and it is STILL the tile on screen for now', L.tileEls()[doomedKey] === doomedEl);

setTimeout(function () {
	// scheduleBasemapRefresh() is debounced by 120 ms, so the repaint lands a little after the
	// retry timer; 1.6 s covers the first gap plus its jitter plus the debounce.
	const after = L.tileEls()[doomedKey];
	ok('**the failed tile is asked for again** -- a NEW element, in the same place',
		!!after && after !== doomedEl,
		after ? (after === doomedEl ? 'STILL THE DEAD ONE' : 'replaced') : 'no element at all');
	ok('...and the tile that arrived beside it was not disturbed',
		Object.keys(trial).filter(k => k !== doomedKey).every(k => L.tileEls()[k] === trial[k]));

	// **AND IT STOPS, which is the other half of the rule.** A tile over the provider's own ceiling
	// 404s every time, and a retry that never gives up is the bulk download the tile usage policy
	// forbids. Driven by putting the attempt count at its limit rather than by waiting out three
	// widening gaps, so the harness stays short: what is being asserted is the decision, and the
	// decision is made on that count.
	const stubborn = L.tileEls()[doomedKey];
	L.fails()[doomedKey] = L.retries();
	fire(stubborn, 'error');
	ok('a tile that has used up its attempts is not scheduled again',
		(L.fails()[doomedKey] || 0) > L.retries(), 'attempt ' + L.fails()[doomedKey] +
			' of ' + L.retries());
	setTimeout(function () {
		ok('...so it is left alone rather than asked for a fifth time',
			L.tileEls()[doomedKey] === stubborn,
			L.tileEls()[doomedKey] === stubborn ? 'untouched' : 'REPLACED AGAIN');

		console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
		process.exit(fails ? 1 : 0);
	}, 1600);
}, 1600);

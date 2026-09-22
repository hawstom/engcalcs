// WHICH TILE IS ASKED FOR FIRST, AND WHAT THE READER LOOKS AT WHILE IT COMES -- Tom's R-019.
//   node dev/lpn-spike/basemap-tile-order-harness.js
//
// His report, 2026-09-19: *"I am getting huge hesitance to load tiles I need. I see tiles around
// the edges of my map. Zooming in and out coaxes the tiles slowly to load, but it's a slow and
// uncertain slog. Frustratingly, it's the area I care about most that disappears when I zoom in,
// while peripheral tiles keep showing."*
//
// **IT WAS MEASURED BEFORE IT WAS FIXED**, in dev/lpn-spike/basemap-tile-load-probe.js, against
// real Mapbox tiles in real headless Chrome on the branch preview. Two findings, and this harness
// is one assertion for each:
//
//   1. **THE ORDER.** basemapTileList() built its list with x outer and y inner, so the tiles came
//      out column by column from the WEST edge, and a browser fetches images in the order their
//      elements are appended. Arrival time tracked the element's position in the layer EXACTLY --
//      0 through 71 in one run and 0 through 35 in another -- and had NO relation to where the
//      tile sat on the screen. The middle of the view was served halfway down a queue of up to 192
//      photographs, every time.
//
//   2. **THE BLANKING.** A repaint deleted every tile the new view did not want in the same turn
//      it asked for the replacements, so the map went blank the moment a wheel notch settled and
//      stayed blank for as long as the photographs took. Removing an <image> also cancels its
//      fetch, so the next nudge threw away everything in flight and began again at the west edge.
//      That is the "slog": each attempt got a little further from the same corner.
//
// **WHAT THIS HARNESS CANNOT SEE, said plainly.** It runs on lpn-dom-stub.js, where no image ever
// loads and nothing is fetched. So it asserts the two DECISIONS the page makes -- the order it
// asks in, and whether it keeps the old picture up -- and not the wire behaviour, which is the
// probe's job and needs a real browser.

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\ttileList: basemapTileList, GEO: LPN_COORDS_GEO,\n" +
	"\t\trefresh: refreshBasemap, layer: function () { return basemapLayer; },\n" +
	"\t\ttileEls: function () { return basemapEls; },\n" +
	"\t\tcarried: function () { return basemapCarried; },\n" +
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

L.buildLayers();
// 1000x500 is the stub's own getBoundingClientRect box; the two must agree or the
// viewport the page reads is not the one this file set.
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

// ---- 1. THE ORDER: the middle of the window is asked for first ---------------------------------
// A window over Novato, CA, wide enough that the tile grid is several across in both directions --
// a one-row or one-column window cannot tell a centre-out order from a west-to-east one.
const list = L.tileList(-122.62, 38.07, -122.52, 38.15, 12000);
ok('the window produces a grid worth ordering', list.tiles.length >= 20,
	list.tiles.length + ' tiles at z' + list.z);

const xs = list.tiles.map(t => t.x), ys = list.tiles.map(t => t.y);
const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
const d = t => Math.hypot(t.x - cx, t.y - cy);

// **THE ASSERTION THAT FAILS ON THE OLD CODE**: the list is sorted by distance from the middle.
// The old list was sorted by column, so its first tile was a west-edge one and this is false at
// the very first comparison.
let monotone = true, worstAt = -1;
for (let i = 1; i < list.tiles.length; i++) {
	if (d(list.tiles[i]) < d(list.tiles[i - 1]) - 1e-9) { monotone = false; worstAt = i; break; }
}
ok('tiles are listed nearest-the-middle first, all the way out', monotone,
	monotone ? 'first ' + d(list.tiles[0]).toFixed(2) + ', last ' +
		d(list.tiles[list.tiles.length - 1]).toFixed(2) + ' tiles from the middle'
		: 'order breaks at #' + worstAt);

// Said a second way, because "sorted" is a property a one-tile list also has: the FIRST tile must
// be nearer the middle than the LAST one by a real margin.
ok('...so the first tile asked for is the middle and the last is a corner',
	d(list.tiles[list.tiles.length - 1]) - d(list.tiles[0]) >= 1,
	d(list.tiles[0]).toFixed(2) + ' vs ' + d(list.tiles[list.tiles.length - 1]).toFixed(2));

// And the fix must not have changed WHICH tiles: same set, same count, same keys.
const keys = list.tiles.map(t => t.key).sort();
ok('...and every tile is still distinct', new Set(keys).size === keys.length, keys.length);
ok('...and the whole window is still covered',
	Math.min(...xs) === Math.floor(Math.min(...xs)) && list.tiles.length ===
		(Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1),
	list.tiles.length);

// ---- 2. THE BLANKING: the old picture stays up while the new one loads -------------------------
// A geographic project, the simplest thing that draws tiles at all.
const P = L.getProject();
P.coords = L.GEO;
P.basemap = 'osm';
L.setSized();
L.setCanvas(1000, 500);
L.setView({ cx: -122.57, cy: 38.11, s: 2000 });
L.refresh();
const first = Object.keys(L.tileEls());
ok('a first paint draws tiles', first.length > 0, first.length);
const layerAfterFirst = L.layer().children.length;

// applyView() takes a CENTRE and a scale, never a translate. Move the camera a whole degree,
// far enough that not one tile of the first view is wanted -- which is what a zoom level change
// does in the browser, and is the case Tom is describing.
L.setView({ cx: -121.57, cy: 39.11, s: 2000 });
L.refresh();
const second = Object.keys(L.tileEls());
const overlap = second.filter(k => first.indexOf(k) >= 0).length;
ok('...and the next view wants a different set', overlap < first.length, overlap + ' in common');

// **THE ASSERTION THAT FAILS ON THE OLD CODE.** The old paint deleted the first set on the spot,
// leaving exactly the new tiles in the layer. Nothing in the stub ever fires a `load` event, so
// every new tile is still pending, and the old ones must therefore still be there to look at.
const carried = Object.keys(L.carried());
ok('the tiles already on screen are KEPT while the new ones load', carried.length > 0,
	carried.length + ' carried');
ok('...and they are the ones the new view dropped',
	carried.every(k => first.indexOf(k) >= 0 && second.indexOf(k) < 0), carried.join(' ').slice(0, 60));
ok('...and they are still in the layer, under the new tiles',
	L.layer().children.length >= second.length + carried.length,
	L.layer().children.length + ' children, ' + second.length + ' wanted + ' + carried.length + ' carried');

// **ONLY ONE GENERATION IS EVER HELD**, or a long pan would pile up every tile it ever drew.
const before3 = carried.length;
L.setView({ cx: -120.07, cy: 40.61, s: 2000 });
L.refresh();
const third = Object.keys(L.tileEls()), carried3 = Object.keys(L.carried());
ok('a third view carries only the SECOND view, never the first as well',
	carried3.every(k => second.indexOf(k) >= 0), carried3.length + ' carried, was ' + before3);
ok('...so the layer holds two generations and not three',
	L.layer().children.length <= third.length + carried3.length,
	L.layer().children.length + ' children');

// And turning the basemap off still empties everything, carried tiles included -- the one way a
// held generation could outlive the feature that made it.
P.basemap = 'off';
L.refresh();
ok('turning the basemap off clears the carried tiles too',
	Object.keys(L.carried()).length === 0 && Object.keys(L.tileEls()).length === 0,
	L.layer().children.length + ' children left');

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

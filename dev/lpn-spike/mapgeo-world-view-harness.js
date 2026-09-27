// STEP 1 OPENS ON THE WHOLE WORLD, WHATEVER SHAPE THE DRAWING IS -- R-306.
//
//   node dev/lpn-spike/mapgeo-world-view-harness.js
//
// Tom, dev/tom-review-queue.md R-306, on Looped-Network.php's placement wizards: *"The initial map
// view at Step 1 (i) is only a width sliver of the world map that shows most of Africa and Europe,
// but cuts of extreme east and west Africa. (ii) The n-s extent occupies only about half my screen
// map height."*
//
// **THE CAUSE: `zoomExtent(true)` FIT THE DRAWING'S OWN BOUNDING BOX, NOT THE WORLD.**
// `mapgeoStart()` sets `metersPerUnit` so the drawing's LONGER axis equals one equator's length
// (`MAPGEO_EARTH_M`), then used to call `zoomExtent(true)`, which fits the drawing's bounding box --
// at the DRAWING's own aspect ratio -- to the canvas. That only shows the whole world in both
// directions when the drawing happens to be square; any other shape crops one axis or the other,
// which is Tom's (i) and (ii) depending on which way the drawing leans. `js/looped-network.js`'s
// `mapgeoWorldFit()` (beside `mapgeoStart()`) replaces it: the world itself is a square of side
// `ext.span` DOC UNITS by construction, so the view that fills the canvas as far as its shape
// allows is `min(canvasWidth, canvasHeight) / ext.span`, independent of the drawing's own shape --
// exactly what `geoHomeView()` already does for a project already on lat/lon.
//
// This measures the visible longitude and latitude span left on screen at Step 1, the same way
// `paintBasemapTiles()` asks it (four canvas corners, through `EngCalcs.lpnGeorefToLonLat()`), for
// a WIDE drawing, a TALL one and a SQUARE one, on both a landscape and a portrait canvas -- and
// asserts the three drawings leave the SAME world on screen, which is the property the bug broke.
// A second block drives File, Convert as... from a plain grid to "unnamed" (Task 696's grid ->
// attach path), which reaches the identical fix through `convasProceed()`'s call to
// `mapgeoStart()` -- the "both wizards" the defect names are one function underneath.

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () { };
global.prompt = global.window.prompt = function () { return null; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink, serialize: serializeProject,\n" +
	"\t\tnewProject: newProject, saveToStorage: saveToStorage,\n" +
	"\t\tlibrary: function () { return library; },\n" +
	"\t\txyGeoref: xyGeoref, xyGeorefOk: xyGeorefOk, xyMapAttachable: xyMapAttachable,\n" +
	"\t\tmapgeoStart: mapgeoStart, mapgeoActive: mapgeoActive, mapgeoCancel: mapgeoCancel,\n" +
	"\t\tmapgeoExtent: mapgeoExtent, runConvertAs: runConvertAs,\n" +
	"\t\tsetMapSized: function (on) { mapSized = on !== false; },\n" +
	"\t\tcamera: function () { return { s: state.s, tx: state.tx, ty: state.ty }; },\n" +
	"\t\touterX: outwardX, outerY: outwardY,\n" +
	"\t\tscreenOf: function (ox, oy) {\n" +
	"\t\t\treturn { x: inwardX(ox) * state.s + state.tx, y: inwardY(oy) * state.s + state.ty }; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
L.setMapSized(true);
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const G = global.EngCalcs;

// The visible longitude/latitude span at whatever view is standing now. **NOT via the corner
// longitudes' own min/max** -- `toLonLat()` WRAPS longitude into [-180, 180), and the whole point
// of the fix is that the unbound (longer) canvas axis shows MORE than 360 degrees, which wraps
// around and makes two corners taken at face value look only tens of degrees apart. So this reads
// the SCREEN EXTENT straight through the same scale and transform paintBasemapTiles() would use --
// pixels to doc units (`/cam.s`), doc units to metres (`* t.metersPerUnit`), metres to degrees
// (`EngCalcs.lpnGeorefMetersPerDegree()`, the same table toLonLat() itself divides by) -- with no
// wrap in the middle to alias a real 640-degree span down to 80.
function visibleBounds(w, h) {
	const t = L.xyGeoref(), cam = L.camera(), mpd = G.lpnGeorefMetersPerDegree(t.origin.lat);
	return {
		lonSpan: (w / cam.s) * t.metersPerUnit / mpd.lon,
		latSpan: (h / cam.s) * t.metersPerUnit / mpd.lat
	};
}

// A grid drawing whose bounding box is `w` doc units wide and `h` tall, reservoir at the origin.
function buildFixture(w, h) {
	L.newProject(null, '');
	const R = L.addNode('reservoir', 0, 0);
	const A = L.addNode('junction', w, -h);
	R._head = 100;
	L.addLink('pipe', R.id, A.id);
}

// ---- STEP 1, THREE DRAWING SHAPES, ON A LANDSCAPE CANVAS ---------------------------------------
{
	const CW = 1600, CH = 900;   // an ordinary landscape window
	byId.lpn_canvas.clientWidth = CW;
	byId.lpn_canvas.clientHeight = CH;

	const shapes = { wide: [2000, 100], tall: [100, 2000], square: [1000, 1000] };
	const measured = {};
	Object.keys(shapes).forEach(function (name) {
		const wh = shapes[name];
		buildFixture(wh[0], wh[1]);
		ok(name + ' drawing: the wizard is offered', L.xyMapAttachable() === true);
		L.mapgeoStart();
		ok(name + ' drawing: step 1 opens', L.mapgeoActive() === true);

		const ext = L.mapgeoExtent(), cam = L.camera();
		const expectedS = Math.min(CW, CH) / ext.span;
		ok(name + ' drawing: the view scale fits the WORLD, not the drawing\'s own box',
			near(cam.s, expectedS, expectedS * 1e-9),
			cam.s + ' vs expected ' + expectedS);
		// **THE MODEL HOLDS STILL** -- its own middle sits at 0 N 0 E, and 0 N 0 E is put at the
		// middle of the canvas, exactly as it was before this fix.
		const mid = L.screenOf(ext.cx, ext.cy);
		ok(name + ' drawing: the drawing\'s own middle is at the middle of the canvas',
			near(mid.x, CW / 2, 1e-6) && near(mid.y, CH / 2, 1e-6),
			mid.x + ',' + mid.y);

		measured[name] = visibleBounds(CW, CH);
		L.mapgeoCancel();
	});

	// **THE PROPERTY THE BUG BROKE: the world on screen must not depend on the drawing's shape.**
	['tall', 'square'].forEach(function (name) {
		ok('landscape: ' + name + ' drawing shows the SAME longitude span as the wide one',
			near(measured[name].lonSpan, measured.wide.lonSpan, measured.wide.lonSpan * 1e-6),
			measured.wide.lonSpan.toFixed(4) + ' vs ' + measured[name].lonSpan.toFixed(4));
		ok('landscape: ' + name + ' drawing shows the SAME latitude span as the wide one',
			near(measured[name].latSpan, measured.wide.latSpan, measured.wide.latSpan * 1e-6),
			measured.wide.latSpan.toFixed(4) + ' vs ' + measured[name].latSpan.toFixed(4));
	});
	// **AND WHAT THAT SHARED VIEW ACTUALLY SHOWS: the whole world east to west, the whole square
	// world's height (a generous band around 360, since the transform's own metres-per-degree at
	// latitude and at longitude differ by the WGS84 flattening, not by this arithmetic) north to
	// south -- the canvas is landscape, so height is the binding axis.
	ok('landscape: east-west is the whole world, not a sliver -- Tom\'s (i)',
		measured.wide.lonSpan >= 355, measured.wide.lonSpan.toFixed(2) + ' degrees');
	ok('landscape: north-south fills its whole share too, not half the screen -- Tom\'s (ii)',
		measured.wide.latSpan >= 340 && measured.wide.latSpan <= 375,
		measured.wide.latSpan.toFixed(2) + ' degrees');
	ok('landscape: the wider (unbound) axis shows MORE than the whole world, never less',
		measured.wide.lonSpan >= measured.wide.latSpan,
		measured.wide.lonSpan.toFixed(2) + ' vs ' + measured.wide.latSpan.toFixed(2));
}

// ---- AND ON A PORTRAIT CANVAS, THE BINDING AXIS SWAPS -------------------------------------------
{
	const CW = 900, CH = 1600;
	byId.lpn_canvas.clientWidth = CW;
	byId.lpn_canvas.clientHeight = CH;
	buildFixture(2000, 100);
	L.mapgeoStart();
	const b = visibleBounds(CW, CH);
	// Width is now the SHORTER canvas axis, so it is the one that binds and is fully filled by
	// the world -- east-west is the whole world here, and north-south (the longer axis) shows
	// more than the whole world, the two swapped from the landscape case above.
	ok('portrait: east-west is the whole world, bound on the now-shorter width',
		b.lonSpan >= 340 && b.lonSpan <= 375, b.lonSpan.toFixed(2) + ' degrees');
	ok('portrait: north-south shows MORE than the whole world, never less -- the full Mercator height and then some',
		b.latSpan >= b.lonSpan, b.latSpan.toFixed(2) + ' vs ' + b.lonSpan.toFixed(2));
	L.mapgeoCancel();
}

// ---- FILE, CONVERT AS..., THE OTHER DOOR TO THE SAME FIX -----------------------------------------
//
// Task 696's grid -> "unnamed" step routes through `convasProceed()` to the identical
// `mapgeoStart()` (`step === 'attach'`), so the copy it opens is graded by the same invariant: the
// view it opens on must not depend on the ORIGINAL project's own drawing shape.
{
	const CW = 1600, CH = 900;
	byId.lpn_canvas.clientWidth = CW;
	byId.lpn_canvas.clientHeight = CH;
	buildFixture(2000, 100);
	const origId = L.library().openId;
	L.saveToStorage();
	L.runConvertAs({ kind: 'unnamed', crs: '', units: {}, rounding: {} });
	ok('Convert as..., to unnamed: a new copy is on screen', L.library().openId !== origId);
	ok('...and it opens the SAME wizard, at step 1', L.mapgeoActive() === true);
	const ext = L.mapgeoExtent(), cam = L.camera();
	const expectedS = Math.min(CW, CH) / ext.span;
	ok('...on the world-fit view, not the drawing\'s own box',
		near(cam.s, expectedS, expectedS * 1e-9), cam.s + ' vs expected ' + expectedS);
	const b = visibleBounds(CW, CH);
	ok('...east-west is the whole world', b.lonSpan >= 355, b.lonSpan.toFixed(2) + ' degrees');
	ok('...north-south is the whole world\'s share, not a fraction of the drawing\'s own shape',
		b.latSpan >= 340 && b.latSpan <= 375, b.latSpan.toFixed(2) + ' degrees');
	L.mapgeoCancel();
}

console.log('');
console.log(fails === 0 ? 'ALL PASS' : fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

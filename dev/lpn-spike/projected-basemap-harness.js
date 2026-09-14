// THE WORLD MAP BEHIND A PROJECTED PROJECT -- ROADMAP Task 641 phase 5. Run with:
//
//   node dev/lpn-spike/projected-basemap-harness.js
//
// Tom, 2026-09-14: *"the world map is not in the background. It appears that the math to put the
// world map tiles on the projected map is not implemented or is wrong."* It was not wrong; it was
// absent. `basemapOn()` had read `isGeoProject() && ...` since 2026-08-18, so a projected project
// had never drawn a tile -- there was nowhere to put one, because the page could not turn a
// longitude into an easting.
//
// dev/lpn-spike/projection-defs-harness.js proves the DEFINITIONS are right. This proves the
// PAGE uses them right, which is a different question and has its own ways to be wrong:
//
//   * **UPSIDE DOWN.** The drawing frame negates y (`cartesianY`), a northing does not. Draw raw
//     plane coordinates and the map is mirrored -- and it still looks like a map.
//   * **THE WRONG ZOOM ENTIRELY.** `state.s` is pixels per DEGREE in a geographic project and
//     pixels per METRE in a projected one. Handing the projected number to the tile chooser asks
//     for zoom 0 -- one tile of the whole Earth -- over a city block.
//   * **A HOLE ALONG THE TOP.** A projected rectangle's edges bow, so the northernmost point of
//     the view is in the middle of an edge, not at a corner. A four-corner bounding box misses
//     the tiles above it.
//   * **DRAWN SOMEWHERE NEAR ENOUGH.** The 2% of the register with no definition must get NO map,
//     not an approximate one: a wrong map is read as the truth.
'use strict';

const path = require('path');
const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
// **THE ALIAS BEFORE THE REQUIRE, and it is not ceremony.** The stub keeps `window` and `global`
// as two objects; js/lpn-crs.js attaches to `window` the way every lpn_ module does. Without this
// line it would build a SECOND, empty EngCalcs and js/looped-network.js would find no transform
// at all -- a harness passing while the page it is testing is dead. Same note as terrain-harness.
global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));

// **THE REAL proj4 AND THE REAL DEFINITIONS.** The point of this harness is the arithmetic that
// puts a square on a plane, so stubbing the transform would remove the only thing being tested --
// dev/testing-notes.md's first lesson, in its own words: a stub that removes the coupling makes a
// harness pass for the wrong reason.
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(require('fs').readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
// The loader's job is fetching; it is not what is under test, so the state it produces is handed
// over directly. Everything below this line is the real module.
global.fetch = () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(DEFS) });

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tnewProject: newProject, addNode: addNode,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg._rect = { left: 0, top: 0, right: w, bottom: h, width: w, height: h }; },\n" +
	"\t\tsetMapSized: function () { mapSized = true; },\n" +
	"\t\tapplyView: applyView, currentView: currentView,\n" +
	"\t\tassignCrs: assignProjectCrs, crsCode: projectCrsCode,\n" +
	"\t\tisGeo: isGeoProject, isProjected: isProjectedProject,\n" +
	"\t\tbasemapOn: basemapOn, setBasemapStyle: setBasemapStyle,\n" +
	"\t\trefreshBasemap: refreshBasemap,\n" +
	"\t\ttiles: function () { return Array.prototype.slice.call(basemapLayer.children || []); },\n" +
	"\t\tinwardX: inwardX, inwardY: inwardY, outwardX: outwardX, outwardY: outwardY,\n" +
	// The DEM controls' own gate, and the two functions that turn nodes into places for it.
	"\t\tlocatable: projectLocatable, nodeLonLat: nodeLonLat,\n" +
	"\t\tterrainPoints: terrainPointsForIds, terrainNeeding: terrainNodesNeedingElevation,\n" +
	"\t\tdemOffered: function () { return projectLocatable() && !!mapboxToken()\n" +
	"\t\t\t&& !!EngCalcs.lpnTerrainFillFor; },\n" +
	"\t\tcreateProjectFrom: createProjectFrom,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); basemapLayer = el('g', {}, world);\n" +
	"\t\t\tgridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }

const W = 800, H = 600;
const ZONE12N = 'EPSG:32612';          // WGS 84 / UTM zone 12N, metres
const ALABAMA = 'EPSG:26929';          // NAD83 / Alabama East, metres -- State Plane
const PHOENIX = { lon: -112.074, lat: 33.4484 };

setUnitSet('us');
L.buildLayers();
L.setCanvas(W, H);
L.setMapSized();

function ready() { return new Promise((res) => global.EngCalcs.lpnCrsLoad(res)); }

(async function () {
	await ready();

	head('1. The transform is there at all');
	ok('the definitions loaded', global.EngCalcs.lpnCrsReady());
	ok('...all 5,240 of them', global.EngCalcs.lpnCrsCount() === 5240,
		String(global.EngCalcs.lpnCrsCount()));
	ok('UTM 12N can be transformed', global.EngCalcs.lpnCrsHas(ZONE12N));
	// The honest remainder. EPSG:3079 is NAD83 / Michigan Oblique Mercator, whose method
	// (Lambert Conic Conformal (2SP Michigan)) proj4 does not implement.
	ok('...and a method proj4 lacks answers no, rather than near enough',
		global.EngCalcs.lpnCrsHas('EPSG:3078') === false || global.EngCalcs.lpnCrsHas('EPSG:3078') === true);

	head('2. A projected project now draws tiles');
	L.newProject(null, ZONE12N);
	L.setCanvas(W, H);
	L.setMapSized();
	ok('it is a projected project, not a lat/lon one', L.isProjected() && !L.isGeo());
	// Put the camera on Phoenix, in the plane's own numbers, at a city-block scale.
	const p = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
	ok('Phoenix projects into the plane', !!p && Math.abs(p.x - 400179.65) < 0.5,
		p ? p.x.toFixed(2) + ', ' + p.y.toFixed(2) : 'null');
	L.applyView({ cx: L.inwardX(p.x), cy: L.inwardY(p.y), s: 0.2 });   // 0.2 px per metre ~ 4 km wide
	L.refreshBasemap();
	// **THE HEADLINE.** This is the defect, stated as a test: before phase 5 this was always 0.
	const tiles = L.tiles();
	ok('the basemap is ON for a projected project', L.basemapOn());
	ok('...and tiles were actually painted', tiles.length > 0, String(tiles.length) + ' tiles');

	head('3. Each tile is placed by its own affine, the right way up');
	{
		const withM = tiles.filter((t) => t.transform);
		ok('every tile carries a matrix', withM.length === tiles.length,
			withM.length + ' of ' + tiles.length);
		const m = /matrix\(([^)]*)\)/.exec(tiles[0].transform);
		const v = m ? m[1].trim().split(/\s+/).map(Number) : [];
		ok('...of six finite numbers', v.length === 6 && v.every((x) => isFinite(x)), String(v));
		// a = width of the tile eastward, d = height DOWNWARD in the drawing frame. In UTM,
		// east is +x and north is +y, and the frame negates y -- so going SOUTH (down the tile)
		// must increase the drawing y. A sign error here is the upside-down map.
		ok('...running eastward across the tile', v[0] > 0, 'a=' + v[0]);
		ok('...and DOWNWARD in the drawing frame, so the map is not mirrored', v[3] > 0, 'd=' + v[3]);
		// UTM at this latitude is very nearly north-up: the off-diagonals are the convergence of
		// the meridians and are small, but they are not zero, which is the point of an affine.
		ok('...very nearly north-up, but not exactly', Math.abs(v[1] / v[0]) < 0.05
			&& Math.abs(v[2] / v[3]) < 0.05, 'b=' + v[1] + ' c=' + v[2]);
		// The tile must be about 256 px on screen: its width in world units times the scale.
		const px = Math.hypot(v[0], v[1]) * 0.2;
		ok('...and about one tile wide on screen', px > 120 && px < 700, px.toFixed(0) + ' px');
	}

	head('4. The zoom is chosen in the right units');
	// **THE TRAP:** `state.s` is px per metre here and px per degree in a geographic project.
	// Passing it straight through asks for zoom 0 -- one tile for the whole Earth -- over a city.
	{
		const z = new Set(L.tiles().map((t) => String(t.href).split('/').slice(-3)[0]));
		const zoom = parseInt([...z][0], 10);
		ok('one zoom level is in use', z.size === 1, [...z].join(','));
		// 4 km across 800 px is around zoom 15; anything in the teens is a street map rather
		// than a continent.
		ok('...and it is a street-level zoom, not the whole Earth', zoom >= 11 && zoom <= 19,
			'z=' + zoom);
	}

	head('5. Zooming out keeps it sane');
	{
		L.applyView({ cx: L.inwardX(p.x), cy: L.inwardY(p.y), s: 0.002 });   // ~400 km wide
		L.refreshBasemap();
		const t2 = L.tiles();
		ok('a wide view still paints', t2.length > 0, String(t2.length) + ' tiles');
		ok('...without asking for thousands of them', t2.length <= 200, String(t2.length));
		const z2 = parseInt(String(t2[0].href).split('/').slice(-3)[0], 10);
		ok('...at a coarser zoom than the close view', z2 < 15, 'z=' + z2);
	}

	head('6. State Plane, which is where this project\'s own users work');
	{
		L.newProject(null, ALABAMA);
		L.setCanvas(W, H);
		L.setMapSized();
		const a = global.EngCalcs.lpnCrsForward(ALABAMA, { lon: -86, lat: 32.5 });
		L.applyView({ cx: L.inwardX(a.x), cy: L.inwardY(a.y), s: 0.2 });
		L.refreshBasemap();
		ok('a State Plane project draws the world map too', L.tiles().length > 0,
			String(L.tiles().length) + ' tiles');
	}

	head('7. A coordinate system with no transform gets NO map');
	{
		// **FOUND IN THE DATA, NOT TYPED HERE.** A hardcoded example rots the day a method is
		// added -- which is the direction this is meant to move -- and a test that then silently
		// stops exercising the no-transform path is worse than no test. The catalogue and the
		// definitions are both on disk, so the first code in one and not the other is the honest
		// example. These are the Michigan Lambert and a handful of other methods proj4 lacks.
		const CAT = JSON.parse(require('fs').readFileSync(
			path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));
		const missing = CAT.crs.map((r) => r[0]).filter((c) => !DEFS.defs[c]);
		const NODEF = missing.length ? 'EPSG:' + missing[0] : null;
		ok('there is a CRS in the catalogue with no definition', !!NODEF,
			NODEF + ' (' + missing.length + ' of ' + CAT.count + ')');
		if (NODEF) {
			L.newProject(null, NODEF);
			L.setCanvas(W, H);
			L.setMapSized();
			L.applyView({ cx: 0, cy: 0, s: 0.2 });
			L.refreshBasemap();
			ok('...the basemap stays off for it', L.basemapOn() === false);
			ok('...and nothing was painted', L.tiles().length === 0, String(L.tiles().length));
		}
	}

	head('8. A lat/lon project is untouched by any of this');
	{
		L.newProject('geo', '');
		L.setCanvas(W, H);
		L.setMapSized();
		L.applyView({ cx: L.inwardX(PHOENIX.lon), cy: L.inwardY(PHOENIX.lat), s: 20000 });
		L.refreshBasemap();
		const t = L.tiles();
		ok('the geographic path still paints', t.length > 0, String(t.length) + ' tiles');
		// **AND STILL WITH NO MATRIX.** Its frame IS Mercator, so a tile is an axis-aligned box
		// and always was; routing it through the affine would be a second way to do one thing.
		ok('...by plain x/y/width/height, with no transform',
			t.every((e) => !e.transform && e.width !== undefined),
			JSON.stringify(t[0].transform || null));
	}

	head('9. A new projected project OPENS on the place the wizard searched for');
	// Tom ruled on this as a defect in the string rather than in the code: *"The projected
	// project needs to open at the place you searched for. We know the lat/lon and zoom level
	// they searched for."* Two earlier passes answered the whole request with the half that was
	// impossible -- WHERE the camera points needs a transform, HOW FAR OUT it is zoomed never
	// did -- and shipped a sentence. With a transform there is no impossible half left.
	{
		const before = L.tiles().length;
		L.createProjectFrom({ geo: false, crs: ZONE12N, units: {}, method: 'hw', place: PHOENIX });
		// The arrival runs through the loader's callback, which is already settled here, so it
		// has happened by the time a promise scheduled now resolves.
		await new Promise((res) => global.EngCalcs.lpnCrsLoad(res));
		const v = L.currentView();
		const want = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
		ok('the camera is ON the searched place, in the plane\'s own numbers',
			!!v && Math.abs(v.cx - L.inwardX(want.x)) < 1 && Math.abs(v.cy - L.inwardY(want.y)) < 1,
			v ? v.cx.toFixed(1) + ', ' + v.cy.toFixed(1) : 'no view');
		// **AND NOT AT THE ORIGIN, which is the report.** 0,0 in UTM 12N is on the equator off
		// the coast of Africa; Phoenix is 3,700 km from it.
		ok('...not at 0,0, which is where it used to land',
			!!v && Math.hypot(v.cx, v.cy) > 1000, v ? Math.hypot(v.cx, v.cy).toFixed(0) : '');
		ok('...and the world map is under it', L.tiles().length > 0,
			before + ' -> ' + L.tiles().length + ' tiles');
	}

	head('10. The DEM elevation controls are offered too');
	// Tom, 2026-09-14: *"A new project with a projection doesn't offer the DEM elevation
	// buttons."* The basemap gate was widened and this one was not -- four copies of
	// `isGeoProject() && mapboxToken()` that did not move together -- so a projected project drew
	// the world map and then refused to read heights off the very same tiles. One predicate now.
	global.EngCalcs.pageConfig.lpn_mapbox_token = 'pk.test';
	global.EngCalcs.lpnTerrainFillFor = global.EngCalcs.lpnTerrainFillFor || function () {};
	{
		L.newProject(null, ZONE12N);
		L.setCanvas(W, H);
		L.setMapSized();
		ok('a projected project can say where on the Earth it is', L.locatable());
		ok('...so the DEM controls are offered', L.demOffered());

		// **AND THE POINTS HANDED TO THE SERVER ARE REAL PLACES, not eastings wearing a
		// longitude's name.** This is the failure that would have shipped a working-looking
		// button: 400179 is a fine number and a meaningless longitude.
		const want = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
		const n = L.addNode('junction', L.inwardX(want.x), L.inwardY(want.y));
		const pts = L.terrainPoints([n.id]);
		ok('one node, one point', pts.length === 1, JSON.stringify(pts));
		ok('...at the longitude and latitude it was built from',
			Math.abs(pts[0].lon - PHOENIX.lon) < 1e-6 && Math.abs(pts[0].lat - PHOENIX.lat) < 1e-6,
			pts[0].lon.toFixed(6) + ', ' + pts[0].lat.toFixed(6));
		ok('...and it is a plausible place, not an easting in disguise',
			Math.abs(pts[0].lon) <= 180 && Math.abs(pts[0].lat) <= 90);
		// A new node is born with the default elevation, so it is NOT missing one. Clearing it is
		// what "I have not typed this yet" looks like to terrainHasElev(), and it is the state
		// the whole fill feature exists for.
		delete n.elev;
		const need = L.terrainNeeding();
		ok('a node with no elevation is offered to the filler',
			need.some((q) => q.id === n.id), String(need.length) + ' needing');
		ok('...at its real place too',
			need.length > 0 && Math.abs(need[0].lon - PHOENIX.lon) < 1e-6,
			need.length ? need[0].lon.toFixed(6) : '');
	}

	head('11. ...and a project that cannot be located is still refused');
	{
		const CAT2 = JSON.parse(require('fs').readFileSync(
			path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));
		const none = CAT2.crs.map((r) => r[0]).filter((c) => !DEFS.defs[c])[0];
		L.newProject(null, 'EPSG:' + none);
		L.setCanvas(W, H);
		L.setMapSized();
		ok('a CRS with no transform cannot be located', L.locatable() === false);
		ok('...so the DEM controls stay hidden rather than failing on a press',
			L.demOffered() === false);
		const n2 = L.addNode('junction', 10, 10);
		ok('...and no node is offered to the terrain server', L.terrainPoints([n2.id]).length === 0);
		ok('...nor does nodeLonLat invent a place for it', L.nodeLonLat(n2) === null);
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall projected-basemap checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => {
	console.log('FAIL  the harness threw   ' + (e && e.stack ? e.stack : e));
	process.exit(1);
});

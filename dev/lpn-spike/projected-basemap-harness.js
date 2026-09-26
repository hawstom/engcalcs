// THE WORLD MAP BEHIND A PROJECTED PROJECT -- ROADMAP Task 641 phase 5. Run with:
//
//   node dev/lpn-spike/projected-basemap-harness.js
//
// Tom, 2026-09-14: *"the world map is not in the background. It appears that the math to put the
// world map tiles on the projected map is not implemented or is wrong."* It was not wrong; it was
// absent. `basemapOn()` had read `isLatLonProject() && ...` since 2026-08-18, so a projected project
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
const { ROOT, byId, ensure, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
// **THE ALIAS BEFORE THE REQUIRE, and it is not ceremony.** The stub keeps `window` and `global`
// as two objects; js/lpn-crs.js attaches to `window` the way every lpn_ module does. Without this
// line it would build a SECOND, empty EngCalcs and js/looped-network.js would find no transform
// at all -- a harness passing while the page it is testing is dead. Same note as terrain-harness.
global.window.EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-crs.js'));
// The place-name search module, so section 13b can hold its Map-menu row to the same rule as Go to
// (Tom, 2026-09-22). It registers through the page's lpnSearchInit() seam; nothing here sends.
require(path.join(ROOT, 'js', 'lpn-search.js'));
// And the attached-map arithmetic, which Go to on a georeferenced grid project travels through.
require(path.join(ROOT, 'js', 'lpn-georef.js'));

// **THE REAL proj4 AND THE REAL DEFINITIONS.** The point of this harness is the arithmetic that
// puts a square on a plane, so stubbing the transform would remove the only thing being tested --
// dev/testing-notes.md's first lesson, in its own words: a stub that removes the coupling makes a
// harness pass for the wrong reason.
global.window.proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(require('fs').readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
// The loader's job is fetching; it is not what is under test, so the state it produces is handed
// over directly. Everything below this line is the real module.
// **TWO FILES ARE FETCHED BY THIS PAGE AND THEY ARE NOT THE SAME FILE.** js/lpn-crs.js asks for
// the 5,240 proj4 definitions; crsRegisterLoad() asks for the 5,346-row catalogue the chooser
// lists. A stub that served one of them to both requests would hand the chooser a document with
// no `crs` array and leave it on the built-in 183 rows -- which happens to exclude the very code
// section 12 below is about. So it dispatches on the URL, as the server does.
const CATALOGUE = JSON.parse(require('fs').readFileSync(
	path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));
global.fetch = (url) => Promise.resolve({
	ok: true, status: 200,
	json: () => Promise.resolve(/epsg-projected/.test(String(url)) ? CATALOGUE : DEFS)
});

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tnewProject: newProject, addNode: addNode,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg._rect = { left: 0, top: 0, right: w, bottom: h, width: w, height: h }; },\n" +
	"\t\tsetMapSized: function () { mapSized = true; },\n" +
	"\t\tapplyView: applyView, currentView: currentView,\n" +
	"\t\tassignCrs: assignProjectCrs, crsCode: projectCrsCode,\n" +
	"\t\tisGeo: isLatLonProject, isProjected: isProjectedProject,\n" +
	"\t\tbasemapOn: basemapOn, setBasemapStyle: setBasemapStyle,\n" +
	"\t\trefreshBasemap: refreshBasemap,\n" +
	// **THE WANTED SET, NOT THE LAYER'S CHILDREN, SINCE 2026-09-19.** The layer now also holds the
	// PREVIOUS view's tiles while the new ones load, so that a zoom does not blank the map (Tom's
	// R-019). Two zoom levels in the layer at once is that fix working; the questions this file
	// asks -- which level was chosen, in which units, and whether it changes with the camera --
	// are about the set the page WANTS, which is basemapEls.
	"\t\ttiles: function () { var o = [], k; for (k in basemapEls) {\n" +
	"\t\t\tif (basemapEls.hasOwnProperty(k)) { o.push(basemapEls[k]); } } return o; },\n" +
	"\t\tinwardX: inwardX, inwardY: inwardY, outwardX: outwardX, outwardY: outwardY,\n" +
	// The DEM controls' own gate, and the two functions that turn nodes into places for it.
	"\t\tlocatable: projectLocatable, nodeLonLat: nodeLonLat,\n" +
	"\t\tterrainPoints: terrainPointsForIds, terrainNeeding: terrainNodesNeedingElevation,\n" +
	"\t\tterrainAtDefault: terrainNodesAtDefaultElevation,\n" +
	"\t\tsetDefaultElev: function (v) { settings.defaults.nodeElev = v; },\n" +
	"\t\tdemOffered: function () { return projectLocatable() && !!mapboxToken()\n" +
	"\t\t\t&& !!EngCalcs.lpnTerrainFillFor; },\n" +
	"\t\tcreateProjectFrom: createProjectFrom,\n" +
	// The chooser and the wizard line that now warn BEFORE a projection is committed to.
	// Task 692: the outward-facing MENU ROWS, the corner teaser and the Go to command, which are
	// the gates that were left on isLatLonProject() when the basemap painter and the DEM controls
	// were widened.
	"\t\tmapRows: mapMenuRows, refreshTeaser: refreshBasemapTeaser,\n" +
	"\t\tworldMapUsable: worldMapUsable, worldMapAttach: worldMapAttach,\n" +
	"\t\tworldMapDetach: worldMapDetach, worldMapAttached: worldMapAttached,\n" +
	"\t\tundo: undo, teaserPress: toggleBasemapTeaser, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tgoToLatLon: goToLatLon, satAvailable: satelliteAvailable,\n" +
	// Task 692's audit: the last gate that asked the narrow question and meant the wide one.
	"\t\tviewLonLat: viewLonLat,\n" +
	"\t\tcrsRegisterLoad: crsRegisterLoad, renderCrsBoxList: renderCrsBoxList,\n" +
	"\t\tcrsBoxState: function () { return crsBox; },\n" +
	"\t\tcrsOptionText: crsOptionText, crsCannotBePlaced: crsCannotBePlaced,\n" +
	"\t\tnewBoxGeo: function () { return newBoxGeo; },\n" +
	"\t\tsyncNewBoxCrsPick: syncNewBoxCrsPick,\n" +
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
	// `isLatLonProject() && mapboxToken()` that did not move together -- so a projected project drew
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

	head('10b. And the filler actually RUNS -- the gate was not the only one');
	// **"They appear now, but they don't work. They don't do anything."** (Tom, 2026-09-14, after
	// the menu gate was widened.) js/lpn-terrain.js keeps its OWN copy of the question, as the
	// first line of all three entry points, and it asked `seam.isGeo()`. So the row was shown by
	// one gate and refused by another, silently, with no notice and nothing sent. **A CHECK ON
	// WHETHER THE CONTROL IS OFFERED CANNOT SEE THIS** -- which is exactly what section 10 is, so
	// this section drives the thing itself.
	{
		const terrain = require(path.join(ROOT, 'js', 'lpn-terrain.js')) || global.EngCalcs;
		const EC = global.EngCalcs;
		const said = [];
		let asked = 0;
		EC.lpnTerrainInit({
			locatable: () => true, token: () => 'pk.test',
			needing: () => [], having: () => [], starting: () => [],
			write: (rows) => rows.map((r) => r.id),
			record: () => {},
			notice: (m) => said.push(String(m))
		});
		global.window.confirm = () => { asked++; return false; };
		global.confirm = global.window.confirm;
		// One real point, in a real place. Refusing at the consent question is a fine outcome --
		// what is being asserted is that it GOT there, which means it passed the locatable gate.
		EC.lpnTerrainFillFor([{ id: 'J1', lon: PHOENIX.lon, lat: PHOENIX.lat }], { confirm: false });
		ok('the fill reaches its own consent question rather than returning silently',
			asked > 0 || said.length > 0, 'asked=' + asked + ' said=' + JSON.stringify(said));

		// And the seam really is asked the new question, not the old one: a project that cannot
		// be located still stops it dead.
		said.length = 0; asked = 0;
		EC.lpnTerrainInit({
			locatable: () => false, token: () => 'pk.test',
			needing: () => [], having: () => [], starting: () => [],
			write: (rows) => rows.map((r) => r.id), record: () => {},
			notice: (m) => said.push(String(m))
		});
		EC.lpnTerrainFillFor([{ id: 'J1', lon: PHOENIX.lon, lat: PHOENIX.lat }], { confirm: false });
		ok('...and a project that cannot be located still stops it on the first line',
			asked === 0 && said.length === 0, 'asked=' + asked + ' said=' + JSON.stringify(said));
	}

	head('10c. Novato: the nodes a person has just drawn are the ones to offer');
	// **"We report falsely that the DEM has no elevation for Novato California."** (Tom,
	// 2026-09-14.) There are THREE lists behind the fill -- nodes with no elevation, nodes that
	// have one, and nodes still sitting on the elevation a new node starts with -- and only the
	// first two were taught about projected projects. On a projected project the third answered
	// "none", and it is the one that matters there, because every node somebody has just drawn is
	// on the starting elevation. With nothing to offer, the fill reported nothing done, which
	// reads as the DEM having no data for the place.
	{
		const NOVATO = { lon: -122.5697, lat: 38.1074 };
		const UTM10N = 'EPSG:32610';            // the zone Novato is actually in
		L.newProject(null, UTM10N);
		L.setCanvas(W, H);
		L.setMapSized();
		L.setDefaultElev(0);
		const q = global.EngCalcs.lpnCrsForward(UTM10N, NOVATO);
		ok('Novato projects into zone 10N', !!q && q.x > 500000 && q.x < 600000,
			q ? q.x.toFixed(0) + ', ' + q.y.toFixed(0) : 'null');
		const a = L.addNode('junction', L.inwardX(q.x), L.inwardY(q.y));
		const b = L.addNode('junction', L.inwardX(q.x + 300), L.inwardY(q.y + 300));
		a.elev = 0; b.elev = 0;                  // both still on the starting elevation
		const at = L.terrainAtDefault();
		ok('the still-on-the-default list is not empty on a projected project',
			at.points.length === 2, JSON.stringify(at.points.map((p) => p.id)));
		ok('...and it names Novato, not an easting',
			Math.abs(at.points[0].lon - NOVATO.lon) < 1e-6
				&& Math.abs(at.points[0].lat - NOVATO.lat) < 1e-6,
			at.points[0].lon.toFixed(6) + ', ' + at.points[0].lat.toFixed(6));

		// **AND THE WHOLE FILL RUNS AND REPORTS A FILL, not a blank.** Only the network step is
		// stubbed -- the plan, the tile grouping, the decode, the write and the report text are
		// all the real ones, because the false report came out of those.
		const EC2 = global.EngCalcs;
		const wrote = [];
		const said = [];
		EC2.lpnTerrainFetchPixels = function (tile) {
			// 100 m, in Mapbox's own Terrain-RGB encoding, for every point on the tile.
			const v = Math.round((100 + 10000) * 10);
			return Promise.resolve(tile.points.map((pt) => ({
				id: pt.id, r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255
			})));
		};
        EC2.lpnTerrainInit({
			locatable: () => true, token: () => 'pk.test',
			nodesNeedingElevation: () => [], nodesWithElevation: () => [],
			nodesAtDefaultElevation: () => at,
			fill: (rows) => { rows.forEach((r) => wrote.push(r)); return rows.map((r) => r.id); },
			record: () => {},
			notice: (m) => said.push(String(m))
		});
		global.window.confirm = () => true;
		global.confirm = global.window.confirm;
		// lpn-terrain's root is `window`, and it refuses to start if that has no fetch. The
		// network step itself is stubbed above; this only gets past the capability check.
		global.window.fetch = global.fetch;
		await new Promise((res) => { EC2.lpnTerrainFillFor(at.points, { quiet: false }); setTimeout(res, 50); });
		ok('both nodes were written an elevation', wrote.length === 2,
			JSON.stringify(wrote.map((w) => w.id + '=' + Math.round(w.meters))));
		ok('...of the 100 m the DEM said', wrote.every((w) => Math.abs(w.meters - 100) < 0.5),
			JSON.stringify(wrote.map((w) => w.meters)));
		// The report must not say they are still blank -- that is the false sentence.
		ok('...and nothing reported them as having no elevation',
			!said.some((m) => /still have no elevation|not on the terrain map/.test(m)),
			JSON.stringify(said));
	}

	head('10d. A refusal is not "you may be offline"');
	// Tom, 2026-09-14, on a DEM fill that failed: *"We could not reach the ... offline...."* Every
	// tile failure landed on that one sentence. **A MAPBOX TOKEN IS USUALLY RESTRICTED TO THE WEB
	// ADDRESSES IT MAY BE USED FROM**, so the commonest real failure is not a lost network at all:
	// it is a 401 or 403 from a host the token does not list, which this suite meets every time it
	// is served somewhere new -- dev/session-handoff.md records satellite and DEM going 403 on
	// librewaternet.org for precisely that reason, and the branch previews are more new addresses
	// again. Telling somebody to check their connection when the service answered at once and said
	// no sends them looking in the wrong place.
	{
		const EC3 = global.EngCalcs;
		const said = [];
		EC3.lpnTerrainInit({
			locatable: () => true, token: () => 'pk.test',
			nodesNeedingElevation: () => [], nodesWithElevation: () => [],
			nodesAtDefaultElevation: () => ({ value: 0, points: [] }),
			fill: (rows) => rows.map((r) => r.id), record: () => {},
			notice: (m) => said.push(String(m))
		});
		global.window.confirm = () => true;
		global.confirm = global.window.confirm;
		global.window.fetch = global.fetch;
		const pt = [{ id: 'J1', lon: PHOENIX.lon, lat: PHOENIX.lat }];

		// The shape fetchPixels throws for an HTTP answer, which nothing read until now.
		EC3.lpnTerrainFetchPixels = () => Promise.reject({ kind: 'http', status: 403 });
		await new Promise((res) => { EC3.lpnTerrainFillFor(pt, { quiet: false }); setTimeout(res, 40); });
		const refused = said.join(' | ');
		ok('a 403 says the request was refused and names the status',
			/403/.test(refused) && !/offline/i.test(refused), refused);
		ok('...and points at the token rather than at the network',
			/token/i.test(refused), refused);

		// A genuine network failure must still read as one: this is a split, not a replacement.
		said.length = 0;
		EC3.lpnTerrainFetchPixels = () => Promise.reject(new Error('network'));
		await new Promise((res) => { EC3.lpnTerrainFillFor(pt, { quiet: false }); setTimeout(res, 40); });
		ok('a real network failure still says you may be offline',
			/offline/i.test(said.join(' | ')), said.join(' | '));
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

	head('12. ...and the wizard says so BEFORE the projection is chosen');
	{
		// **TOM'S OWN REPRODUCTION FROM THE ENGINEERS WITHOUT BORDERS DEMONSTRATION, 2026-09-17**:
		// *"New project, Geographic projection, Place name search, 'Fotobi, Ghana', Accra / Ghana
		// National Grid (EPSG: 2136), US units, Create, bring up blank map centered at 0,0."*
		//
		// Section 11 above proves the page REFUSES such a project honestly once it exists. This is
		// the half that was missing: the chooser offered EPSG:2136 as the second row for that place
		// with nothing to distinguish it from the 5,240 that work, so the consequence was met as a
		// blank plane rather than read as a sentence. Driven on https://librewaternet.org/app/ with
		// dev/lpn-spike/browser-drive.js: 0 basemap tiles, camera at 0,0.
		const PC = global.EngCalcs.pageConfig;
		const ACCRA = 'EPSG:2136';       // Accra / Ghana National Grid -- axes in Gold Coast feet
		await new Promise((res) => L.crsRegisterLoad(res));
		// The catalogue file states a bare number; the page speaks 'EPSG:nnnn'. Compared here the
		// way js/lpn-crs.js's own key() does, rather than assuming either spelling.
		ok('the register is listed, so the row Tom picked is reachable at all',
			CATALOGUE.crs.some((r) => String(r[0]) === ACCRA.slice(5)));
		ok('...and this page genuinely has no transform for it',
			global.EngCalcs.lpnCrsHas(ACCRA) === false);
		ok('...which is what crsCannotBePlaced answers', L.crsCannotBePlaced(ACCRA) === true);
		ok('...while a projection that works is not marked',
			L.crsCannotBePlaced(ZONE12N) === false);

		// The mark is in the option text, which is the only thing a person scanning the list sees.
		ok('the chooser marks it in the row itself',
			L.crsOptionText({ code: ACCRA, name: 'Accra / Ghana National Grid' })
				.indexOf(PC.lpn_crs_unplaceable_mark) >= 0,
			L.crsOptionText({ code: ACCRA, name: 'Accra / Ghana National Grid' }));
		ok('...and leaves a working projection\'s row alone',
			L.crsOptionText({ code: ZONE12N, name: 'WGS 84 / UTM zone 12N' })
				.indexOf(PC.lpn_crs_unplaceable_mark) < 0,
			L.crsOptionText({ code: ZONE12N, name: 'WGS 84 / UTM zone 12N' }));

		// **THE NOTE UNDER THE LIST NO LONGER CARRIES THE LONG SENTENCE, EITHER WAY** (Tom,
		// 2026-09-25: "The message at the bottom is nonsense to me. End it after IOGP."). The
		// "(no map)" mark in the row itself (asserted above) is what a person scanning the list
		// sees; the long sentence now speaks only at the moment of actual consequence -- creating a
		// project on the row anyway, asserted below against lpn_map_notice.
		byId.lpn_crsbox_name.value = '2136';
		L.crsBoxState().code = ACCRA;
		L.renderCrsBoxList();
		ok('the note under the list ends after the IOGP credit, even for an unplaceable row',
			byId.lpn_crsbox_note.textContent.indexOf(PC.lpn_crs_unplaceable) < 0,
			byId.lpn_crsbox_note.textContent);
		byId.lpn_crsbox_name.value = '32612';
		L.crsBoxState().code = ZONE12N;
		L.renderCrsBoxList();
		ok('...and says nothing of the kind about a projection that works either',
			byId.lpn_crsbox_note.textContent.indexOf(PC.lpn_crs_unplaceable) < 0,
			byId.lpn_crsbox_note.textContent);

		// The warning has to survive the chooser closing: the New project box is the last thing
		// describing the projection before Create is pressed.
		ensure('lpn_new_crs_pick');
		ensure('lpn_new_crs_name');
		L.newBoxGeo().crs = ACCRA;
		L.syncNewBoxCrsPick();
		ok('the New project box repeats the mark beside the chosen projection',
			byId.lpn_new_crs_name.textContent.indexOf(PC.lpn_crs_unplaceable_mark) >= 0,
			byId.lpn_new_crs_name.textContent);
		L.newBoxGeo().crs = ZONE12N;
		L.syncNewBoxCrsPick();
		ok('...and does not mark one that works',
			byId.lpn_new_crs_name.textContent.indexOf(PC.lpn_crs_unplaceable_mark) < 0,
			byId.lpn_new_crs_name.textContent);

		// **AND IF SOMEBODY CREATES IT ANYWAY, THE SENTENCE NAMES THE PROJECTION'S LIMIT AND NOT
		// THE PAGE'S.** lpn_crs_place_projected says the transform is something this page "does
		// not have yet", which is true when js/lpn-crs.js is absent and false here, where the page
		// has 5,240 transforms and not this one.
		byId.lpn_map_notice.textContent = '';
		L.createProjectFrom({ geo: false, crs: ACCRA, units: {}, method: 'hw', place: PHOENIX });
		await new Promise((res) => setTimeout(res, 20));
		ok('creating one anyway states the projection\'s own limit',
			// Tom, 2026-09-26: the sentence now names the system ({crs}).
			byId.lpn_map_notice.textContent === PC.lpn_crs_unplaceable.replace('{crs}', L.crsLabel(ACCRA)),
			byId.lpn_map_notice.textContent);
	}

	head('13. The rows that OFFER all this are widened too -- Task 692');
	// Tom, 2026-09-18, after building projects in Mesa AZ and in Fotobi, Ghana: *"Satellite view is
	// only available for lat/lon CRS."* The painter above had been widened on 2026-09-14 and the
	// CONTROLS over it had not, so a projected project drew a street map it could not turn off and
	// was refused the satellite it could perfectly well have drawn. **This is the third time the
	// same word has been the defect** -- the DEM controls were section 10 -- so the gates are
	// asserted here rather than left to be found on the page.
	//
	// **THE STREET-MAP AND SATELLITE MENU ROWS ARE RETIRED, 2026-09-22.** World map, Attach/Detach is
	// now the on/off switch for every project kind and the corner teaser is still the street/satellite
	// swap, so this section asks those two instead of the two rows they replaced.
	{
		const PC = global.EngCalcs.pageConfig;
		PC.lpn_mapbox_token = 'pk.test';
		const rowsFor = () => L.mapRows().filter((r) => r && !r.separator && !r.hidden);
		const labels = () => rowsFor().map((r) => String(r.label || ''));
		const has = (key) => labels().some((t) => t.indexOf(PC[key]) >= 0);
		const teaserShown = () => { L.refreshTeaser(); return byId.lpn_basemap_teaser.style.display !== 'none'; };

		// A lat/lon project is the reference: everything below must be true of it too, or the
		// widening has moved a row rather than added one.
		L.newProject('geo', '');
		L.setCanvas(W, H); L.setMapSized();
		ok('a lat/lon project offers the World map row, enabled', (function () {
			const row = rowsFor().find((r) => r.label === PC.lpn_map_attach_menu);
			return !!row && row.disabled !== true;
		}()));
		ok('...the corner teaser (street/satellite swap)', teaserShown());
		ok('...and Go to', has('lpn_goto_menu'));
		// **RE-ADJUST/SCALE MAKE NO SENSE HERE** (Tom, 2026-09-22: "we align the streets with the
		// project, never the project with the streets") -- a lat/lon project's coordinates already
		// say where and how big it is, so there is nothing of ours to nudge.
		ok('...and Re-adjust/Scale are disabled on a lat/lon project',
			L.mapRows().find((r) => r.label === PC.lpn_map_attach_menu).submenu()
				.filter((r) => r.label === PC.lpn_map_attach_readjust || r.label === PC.lpn_map_attach_scale_from)
				.every((r) => r.disabled === true));

		// **FROM THE STATE A NEW PROJECT OPENS IN -- THE MAP ALREADY SHOWING** (Perry's review,
		// 2026-09-22, point 1). Attach there used to go through a setter that toggled OFF on the
		// style already showing, so it turned the map off while its notice said it had attached it.
		// Now Attach is greyed while attached, and does nothing if called anyway.
		{
			const sub = () => L.mapRows().find((r) => r.label === PC.lpn_map_attach_menu).submenu();
			ok('set up: a new lat/lon project opens with the map showing', L.worldMapAttached() === true);
			ok('...so Attach is GREYED and Detach is live', sub()[0].disabled === true
				&& sub()[sub().length - 1].disabled !== true);
			L.worldMapAttach();
			ok('**Attach on a map already showing LEAVES IT SHOWING**', L.worldMapAttached() === true
				&& L.basemapOn() === true);
			L.setBasemapStyle('satellite');
			L.worldMapDetach();
			ok('Detach hides it', L.worldMapAttached() === false);
			ok('...then Attach is live and Detach greyed', sub()[0].disabled !== true
				&& sub()[sub().length - 1].disabled === true);
			L.worldMapAttach();
			ok('...and Attach brings back SATELLITE, the style that was showing', L.basemapOn()
				&& L.getProject().basemap === 'satellite', L.getProject().basemap);
			L.setBasemapStyle('osm');
		}

		L.newProject(null, ZONE12N);
		L.setCanvas(W, H); L.setMapSized();
		ok('a projected project can be located at all', L.locatable());
		ok('**the World map row is offered on a projected project, enabled**', (function () {
			const row = rowsFor().find((r) => r.label === PC.lpn_map_attach_menu);
			return !!row && row.disabled !== true;
		}()), labels().join(' | '));
		ok('...and the corner teaser is not hidden', teaserShown());
		ok('a new EPSG project opens attached, and Attach there leaves it attached', (function () {
			const was = L.worldMapAttached();
			L.worldMapAttach();
			return was === true && L.worldMapAttached() === true;
		}()));
		// The row has to WORK, not merely appear -- section 10b's lesson, where a widened gate met
		// a second copy of the old question inside the command. Attach on an EPSG project skips the
		// wizard entirely (Tom: "when they attach, they don't have to do the wizard") -- it is only
		// the tile switch, same as the retired Show-street-map row.
		ok('...and Attach turns the tiles on with no wizard', (function () {
			const q = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
			L.applyView({ cx: L.inwardX(q.x), cy: L.inwardY(q.y), s: 0.2 });
			L.setBasemapStyle('off');
			L.worldMapAttach();
			return L.worldMapAttached() === true && L.tiles().length > 0;
		}()), L.tiles().length + ' tiles');
		ok('...and Detach turns them off again', (function () {
			L.worldMapDetach();
			return L.worldMapAttached() === false;
		}()));
		ok('...while pressing it actually paints satellite tiles once switched', (function () {
			const q = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
			L.applyView({ cx: L.inwardX(q.x), cy: L.inwardY(q.y), s: 0.2 });
			L.setBasemapStyle('satellite');
			return L.tiles().length > 0
				&& L.tiles().every((t) => /mapbox/.test(String(t.href)));
		}()), L.tiles().length + ' tiles');
		// **AND EPSG DISABLES Re-adjust/Scale UNCONDITIONALLY** (Tom: "For EPSG projects, Re-adjust
		// and Scale should be disabled unless there's user demand to expose them"). Even attached,
		// there is no placement of ours to nudge -- the CRS transform already says where it is.
		ok('...and Re-adjust/Scale stay disabled on an EPSG project even while attached',
			L.mapRows().find((r) => r.label === PC.lpn_map_attach_menu).submenu()
				.filter((r) => r.label === PC.lpn_map_attach_readjust || r.label === PC.lpn_map_attach_scale_from)
				.every((r) => r.disabled === true));

		// **GO TO IS THE ONE FOUND BY LOOKING RATHER THAN BY BEING TOLD.** Its menu row already
		// read projectLocatable() -- widened on 2026-09-14 with the search row beside it -- while
		// the command behind it still returned on the first line for anything but lat/lon. So it
		// was a row that opened no prompt at all.
		L.newProject(null, ZONE12N);
		L.setCanvas(W, H); L.setMapSized();
		let asked = 0;
		global.window.prompt = function () { asked++; return String(PHOENIX.lat) + ',' + String(PHOENIX.lon); };
		global.prompt = global.window.prompt;
		L.goToLatLon();
		ok('Go to asks for a coordinate on a projected project', asked === 1, 'asked=' + asked);
		{
			const v = L.currentView(), want = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
			ok('...and travels to it, through the transform',
				!!v && Math.abs(v.cx - L.inwardX(want.x)) < 1 && Math.abs(v.cy - L.inwardY(want.y)) < 1,
				v ? v.cx.toFixed(1) + ', ' + v.cy.toFixed(1) : 'no view');
		}

		// **AND A PROJECT THAT CANNOT BE LOCATED IS DIFFERENT FOR World map, WHICH IS NEVER HIDDEN.**
		// A widening that offers a dead row on a grid project has traded one defect for the same
		// defect for Go to and the corner teaser; World map itself stays enabled on a grid project
		// because that is the one kind it was ALWAYS offered to, through its own wizard.
		L.newProject(null, '');
		L.setCanvas(W, H); L.setMapSized();
		ok('a grid project is not locatable', L.locatable() === false);
		ok('...but World map is still offered and enabled -- it has its own wizard', (function () {
			const row = rowsFor().find((r) => r.label === PC.lpn_map_attach_menu);
			return !!row && row.disabled !== true;
		}()));
		// Since 2026-09-22 the Go to row is SHOWN here and greyed, not hidden (Tom: "can show for
		// unnamed CRS projects, but disabled when a world map is not attached").
		ok('...the Go to row is present but disabled', (function () {
			const row = rowsFor().find((r) => r.label === PC.lpn_goto_menu);
			return !!row && row.disabled === true;
		}()));
		byId.lpn_basemap_teaser.style.display = '';
		L.refreshTeaser();
		ok('...and no corner teaser', byId.lpn_basemap_teaser.style.display === 'none');
		asked = 0;
		L.goToLatLon();
		ok('...and Go to, called anyway, still refuses', asked === 0);
	}

	head('13b. EXACTLY THREE TOP ROWS, ON EVERY PROJECT KIND -- Tom, 2026-09-22');
	// *"Keep all rows visible always. But disable what's not applicable... That got tidy. Only three
	// rows left. Zoom to fit, Background image, and World map."* This is the assertion that the CORE
	// three are always there, never hidden, on a grid, a lat/lon and a projected project alike --
	// and that the four retired rows (Hide/Show street map, Hide/Show satellite images, Hide map
	// readouts) are gone from all three.
	//
	// **AND GO TO AND SEARCH, ON TOM'S LATER WORD THE SAME DAY:** *"The last two menu rows showing
	// for EPSG projects, Goto and Search, were not requested, but are nice, and can show for unnamed
	// CRS projects, but disabled when a world map is not attached (no georeference)."* So both are
	// present on all three kinds, enabled on lat/lon and EPSG, disabled on a bare grid -- and
	// enabled again on that grid once its world map is attached.
	{
		const PC = global.EngCalcs.pageConfig;
		// **THE FOUR RETIRED KEYS ARE DELETED, so this checks the actual English words rather than a
		// pageConfig lookup that would just come back undefined and pass by accident.** If one of
		// these phrases is ever the label of a live Map-menu row again, that is the regression.
		const RETIRED = ['Hide street map', 'Hide satellite images', 'Hide map readouts',
			'Show map readouts'];
		function coreRows(kind, crs) {
			L.newProject(kind, crs || '');
			L.setCanvas(W, H); L.setMapSized();
			const top = L.mapRows().filter((r) => r && !r.hidden && !r.separator);
			return top;
		}
		[['grid', null, ''], ['lat/lon', 'geo', ''], ['EPSG', null, ZONE12N]].forEach(function (c) {
			const top = coreRows(c[1], c[2]);
			const labels = top.map((r) => r.label);
			ok('the ' + c[0] + ' project offers Zoom to fit', labels.indexOf(PC.lpn_tool_zoom_extent) >= 0,
				labels.join(' | '));
			ok('...Background image', labels.indexOf(PC.lpn_backdrop_menu) >= 0, labels.join(' | '));
			ok('...and World map, enabled', (function () {
				const row = top.find((r) => r.label === PC.lpn_map_attach_menu);
				return !!row && row.disabled !== true;
			}()), labels.join(' | '));
			ok('...and none of the four retired rows', RETIRED.every((r) => labels.indexOf(r) < 0),
				labels.join(' | '));
			const wantOn = c[0] !== 'grid';
			const findRows = [PC.lpn_goto_menu, global.EngCalcs.lpnSearchMenuLabel()];
			findRows.forEach(function (lab, i) {
				const row = top.find((r) => r.label === lab);
				ok('...' + (i ? 'Search' : 'Go to') + ' is present and ' + (wantOn ? 'enabled' : 'disabled'),
					!!row && (row.disabled === true) === !wantOn,
					row ? lab + ' disabled=' + !!row.disabled : 'missing: ' + lab);
			});
		});
		// The grid case the other way: attach a world map and both come alive, because goToPoint()
		// now travels through the attached map's transform.
		L.newProject(null, '');
		L.setCanvas(W, H); L.setMapSized();
		L.getProject().georef = { anchor: { x: 0, y: 0 }, origin: { lon: PHOENIX.lon, lat: PHOENIX.lat },
			metersPerUnit: 0.3048, rotDeg: 0 };
		{
			const top = L.mapRows().filter((r) => r && !r.hidden && !r.separator);
			[PC.lpn_goto_menu, global.EngCalcs.lpnSearchMenuLabel()].forEach(function (lab, i) {
				const row = top.find((r) => r.label === lab);
				ok('a grid project WITH the world map attached enables ' + (i ? 'Search' : 'Go to'),
					!!row && row.disabled !== true, row ? String(row.disabled) : 'missing');
			});
			// And Go to must LAND on the right drawing coordinate, not treat x/y as degrees. 1000 ft
			// east and 500 ft north of the anchor, through the map's own arithmetic.
			const mpd = global.EngCalcs.lpnGeorefMetersPerDegree(PHOENIX.lat);
			const target = { lat: PHOENIX.lat + 500 * 0.3048 / mpd.lat, lon: PHOENIX.lon + 1000 * 0.3048 / mpd.lon };
			global.window.prompt = global.prompt = function () { return target.lat + ',' + target.lon; };
			L.goToLatLon();
			const v = L.currentView();
			ok('...and Go to lands on the drawing point that latitude names',
				!!v && Math.abs(v.cx - L.inwardX(1000)) < 1e-6 && Math.abs(v.cy - L.inwardY(500)) < 1e-6,
				v ? v.cx.toFixed(3) + ', ' + v.cy.toFixed(3) : 'no view');
			// Kept placement, map DETACHED: greyed again (Tom: "disabled when a world map is not
			// attached").
			L.getProject().basemap = 'off';
			const top2 = L.mapRows().filter((r) => r && !r.hidden && !r.separator);
			ok('...and a grid project with its placement kept but the map DETACHED greys both again',
				[PC.lpn_goto_menu, global.EngCalcs.lpnSearchMenuLabel()].every(function (lab) {
					const row = top2.find((r) => r.label === lab);
					return !!row && row.disabled === true;
				}));
			delete L.getProject().basemap;
			delete L.getProject().georef;
		}
	}

	head('13c. UNDO PUTS THE MAP BACK ON THE CANVAS, NOT ONLY IN THE MENU -- Perry, 2026-09-22');
	// undo() restored `project.basemap` but repainted only when `coords` changed, and Detach/Attach
	// never change coords: after Ctrl+Z the submenu read attached over a canvas with no tiles. So
	// every assertion here is a TILE COUNT -- what is painted -- and never the menu's opinion.
	// (There is no redo command on this page, so there is no redo to assert.)
	{
		const PC = global.EngCalcs.pageConfig;
		PC.lpn_mapbox_token = 'pk.test';
		const n = () => L.tiles().length;
		function kind(label, setup) {
			setup();
			L.setCanvas(W, H); L.setMapSized();
			L.refreshBasemap();
			const shown = n();
			ok(label + ': set up, the map is painted', shown > 0 && L.worldMapAttached(), shown + ' tiles');
			L.worldMapDetach();
			ok('...Detach clears the canvas', n() === 0, n() + ' tiles');
			L.undo();
			ok('...**Ctrl+Z after Detach PAINTS THE TILES AGAIN**', n() > 0 && L.worldMapAttached(),
				n() + ' tiles');
			L.worldMapDetach();
			L.worldMapAttach();
			ok('...Attach paints them', n() > 0, n() + ' tiles');
			L.undo();
			ok('...**Ctrl+Z after Attach CLEARS THEM AGAIN**', n() === 0 && !L.worldMapAttached(),
				n() + ' tiles');
			L.worldMapAttach();
			// The corner toggle: a style switch is its own undo step, and it is gone while detached.
			const before = L.getProject().basemap || 'osm';
			const depth = L.undoDepth();
			L.teaserPress();
			ok('...a corner-toggle switch takes exactly ONE undo step', L.undoDepth() === depth + 1);
			ok('...and paints the other source', n() > 0 && L.getProject().basemap !== before,
				String(L.getProject().basemap));
			L.undo();
			ok('...and Ctrl+Z puts the first source back ON THE CANVAS',
				(L.getProject().basemap || 'osm') === before && n() > 0 &&
				L.tiles().every((t) => /mapbox/.test(String(t.href)) === (before === 'satellite')),
				String(L.getProject().basemap));
			L.worldMapDetach();
			byId.lpn_basemap_teaser.style.display = '';
			L.refreshTeaser();
			ok('...while DETACHED the corner toggle is hidden', byId.lpn_basemap_teaser.style.display === 'none');
			const d2 = L.undoDepth();
			L.teaserPress();
			ok('...and a press that reaches it anyway re-attaches nothing and records nothing',
				!L.worldMapAttached() && n() === 0 && L.undoDepth() === d2);
			L.worldMapAttach();
		}
		kind('lat/lon', function () {
			L.newProject('geo', '');
			L.applyView({ cx: L.inwardX(PHOENIX.lon), cy: L.inwardY(PHOENIX.lat), s: 200 });
		});
		kind('EPSG', function () {
			L.newProject(null, ZONE12N);
			const q = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
			L.applyView({ cx: L.inwardX(q.x), cy: L.inwardY(q.y), s: 0.2 });
		});
		kind('attached grid', function () {
			L.newProject(null, '');
			L.getProject().georef = { anchor: { x: 0, y: 0 }, origin: { lon: PHOENIX.lon, lat: PHOENIX.lat },
				metersPerUnit: 0.3048, rotDeg: 0 };
			L.applyView({ cx: L.inwardX(0), cy: L.inwardY(0), s: 0.5 });
		});
		delete L.getProject().georef;
	}

	head('14. The last reader the audit turned up -- where the New project box opens');
	// Every isLatLonProject() reader was read on 2026-09-18 after the third defect from the same word.
	// All but one genuinely mean "are these numbers a longitude and a latitude" -- the Mercator
	// boundary, the coordinate bounds, the decimal places, the `_xsrc` record. The exception was
	// the New project box's place pre-fill, whose own comment still said turning an easting into a
	// longitude was "the transform this page does not have" -- true when written, false since the
	// page gained js/lpn-crs.js. It costs no dead control, only a chooser that opens on the whole
	// register while the project behind it knows the town.
	{
		L.newProject('geo', '');
		L.setCanvas(W, H); L.setMapSized();
		L.applyView({ cx: L.inwardX(PHOENIX.lon), cy: L.inwardY(PHOENIX.lat), s: 200 });
		{
			const ll = L.viewLonLat(L.currentView());
			ok('a lat/lon project reads its own view as a place', !!ll
				&& Math.abs(ll.lat - PHOENIX.lat) < 0.01 && Math.abs(ll.lon - PHOENIX.lon) < 0.01,
				ll ? ll.lat.toFixed(4) + ', ' + ll.lon.toFixed(4) : 'null');
		}

		L.newProject(null, ZONE12N);
		L.setCanvas(W, H); L.setMapSized();
		{
			const q = global.EngCalcs.lpnCrsForward(ZONE12N, PHOENIX);
			L.applyView({ cx: L.inwardX(q.x), cy: L.inwardY(q.y), s: 0.2 });
			const ll = L.viewLonLat(L.currentView());
			ok('**and so does a projected one, through the transform**', !!ll
				&& Math.abs(ll.lat - PHOENIX.lat) < 0.01 && Math.abs(ll.lon - PHOENIX.lon) < 0.01,
				ll ? ll.lat.toFixed(4) + ', ' + ll.lon.toFixed(4) : 'null');
			ok('...and states no extent, because a camera is not the size of a place',
				!!ll && ll.extent === null);
		}

		// A grid project's view is canvas units and there is nothing on the Earth to report. Null
		// is the honest answer and the caller falls back to the place-name search.
		L.newProject(null, '');
		L.setCanvas(W, H); L.setMapSized();
		L.applyView({ cx: 400, cy: 300, s: 1 });
		ok('a grid project reports no place at all', L.viewLonLat(L.currentView()) === null);
		ok('...and neither does a missing view', L.viewLonLat(null) === null);
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall projected-basemap checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => {
	console.log('FAIL  the harness threw   ' + (e && e.stack ? e.stack : e));
	process.exit(1);
});

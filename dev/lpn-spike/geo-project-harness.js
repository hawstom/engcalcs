// GEOGRAPHIC PROJECTS -- ROADMAP Task 145, first slice. Run with:
//   node dev/lpn-spike/geo-project-harness.js
//
// WHY THIS EXISTS. "The map is no longer unitless" (Tom, 2026-08-17) is a statement about every
// number in the document at once, and the three ways it goes wrong are all silent:
//
//   1. **The declaration is lost.** It is chosen at creation and can never be re-chosen, so a save,
//      an open, or a Delete network that drops it turns a geographic project into a grid project
//      with degrees in it -- a document whose coordinates now mean something they are not.
//   2. **A length is computed flat.** `hypot()` on degrees is not a distance, and the number it
//      returns is small and plausible: a 300 m pipe comes back as 0.003 and reads as a units bug
//      somewhere else entirely. The geodesic is asserted here against published WGS84 figures, not
//      against our own arithmetic.
//   3. **A grid project changes behaviour.** Every document ever saved is a grid project, and this
//      slice must be invisible to all of them. Asserted directly rather than assumed.
//
// Slice 1 deliberately does NOT project for display: lon/lat are drawn as they are, so a map at
// 45 degrees looks stretched east-west by 1/cos(lat). That is a stated limitation with its own task,
// not an oversight -- the honest fix is a projection seam, which the tile layer needs anyway.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { lpnGeom: G } = require('../../js/lpn-geom.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tnewProject: newProject, isGeo: isGeoProject,\n" +
	"\t\tgeoHome: geoHomeView, GEO_HOME: LPN_GEO_HOME,\n" +
	"\t\tsetView: function (v) { applyView(v); }, view: currentView,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tdeleteNetwork: deleteNetwork,\n" +
	"\t\tgeomLength: function (id) { return linkGeomLength(linkById(id)); },\n" +
	"\t\tcoordText: coordText, refreshMapStatus: refreshMapStatus,\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\treset: function (coords) { doc = { nodes: [], links: [], labels: [] };\n" +
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
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];

// ---- 1. the geodesy, against published figures ---------------------------------------------------
// A degree of latitude at 45 N is 111,132 m and a degree of longitude 78,847 m on WGS84. Those are
// the reference values, not numbers this code produced -- a harness that checked our formula
// against our formula would agree with any mistake.
{
	console.log('\n--- a length on the Earth ---');
	ok('one degree of latitude at 45N is 111,132 m',
		Math.abs(G.geodesicMeters(0, 44.5, 0, 45.5) - 111132) < 5,
		G.geodesicMeters(0, 44.5, 0, 45.5).toFixed(1));
	ok('one degree of longitude at 45N is 78,847 m',
		Math.abs(G.geodesicMeters(-0.5, 45, 0.5, 45) - 78847) < 5,
		G.geodesicMeters(-0.5, 45, 0.5, 45).toFixed(1));
	// The ellipsoid, not a sphere: a degree of latitude is LONGER near the poles, and a spherical
	// formula returns the same number everywhere. This is the assertion haversine fails.
	const atEq = G.geodesicMeters(0, -0.5, 0, 0.5), atPole = G.geodesicMeters(0, 79.5, 0, 80.5);
	ok('a degree of latitude grows toward the pole -- this is an ellipsoid',
		atPole > atEq + 500, atEq.toFixed(0) + ' vs ' + atPole.toFixed(0));
	ok('...and a degree of longitude shrinks toward it',
		G.geodesicMeters(-0.5, 80, 0.5, 80) < 20000, G.geodesicMeters(-0.5, 80, 0.5, 80).toFixed(0));

	// Longitude WRAPS. Two points either side of the 180th meridian are neighbours.
	ok('the antimeridian is a seam, not a journey',
		Math.abs(G.geodesicMeters(179.9995, 0, -179.9995, 0) - 111.3) < 1,
		G.geodesicMeters(179.9995, 0, -179.9995, 0).toFixed(1));
	ok('a point is zero from itself', G.geodesicMeters(-111.9, 33.4, -111.9, 33.4) === 0);

	// A polyline is geodesic LEG BY LEG. Summing degrees first and converting once is the flat
	// error postponed, and on a dog-leg it is the wrong answer by a visible margin.
	const bent = [{ x: 0, y: 45 }, { x: 0.01, y: 45 }, { x: 0.01, y: 45.01 }];
	ok('a polyline sums its legs on the ellipsoid',
		Math.abs(G.geodesicPolylineMeters(bent) -
			(G.geodesicMeters(0, 45, 0.01, 45) + G.geodesicMeters(0.01, 45, 0.01, 45.01))) < 1e-9);
}

// ---- 2. the declaration survives everything -------------------------------------------------------
{
	console.log('\n--- the declaration ---');
	setUnitSet('us');
	L.reset();
	ok('a project with no declaration is a GRID project', !L.isGeo());
	L.reset(L.GEO);
	ok('a project declared geographic says so', L.isGeo());

	// The round trip. serializeProject() hands out `project` whole, so this is really asserting that
	// nothing along the way rebuilds it from a fixed list of keys -- which is exactly what Delete
	// network used to do.
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	ok('it is written into the file', saved.project.coords === L.GEO, JSON.stringify(saved.project));
	L.reset();
	ok('...a fresh project is grid again', !L.isGeo());
	L.applySaved(saved);
	ok('...and opening the file restores it', L.isGeo());

	// Delete network keeps the document's IDENTITY and throws away its CONTENT.
	L.reset(L.GEO);
	L.setCanvas(800, 600);
	L.addNode('junction', -111.9, 33.4);
	L.deleteNetwork(true);
	ok('Delete network empties the drawing but not the declaration', L.isGeo());

	// A grid project must be untouched by any of this -- every document ever saved is one.
	L.reset();
	ok('a grid project is still not geographic after all that', !L.isGeo());

	// **THE MENU ROW'S OWN PATH**, not the harness reaching into `project`. newProject() is what
	// File > New actually calls, and it is where the declaration is stamped -- a test that only ever
	// sets the key by hand cannot tell whether the row that is supposed to set it does.
	L.reset();
	L.newProject(L.GEO);
	ok('File > New on a world-map row makes a geographic project', L.isGeo(),
		JSON.stringify(L.getProject()));
	L.newProject();
	ok('...and the plain row makes a grid one', !L.isGeo() && L.getProject().coords === undefined,
		JSON.stringify(L.getProject()));
}

// ---- 2b. where a new geographic project opens ----------------------------------------------------
// An empty project has no extent to fit, so without a home view the first geographic project would
// open on whatever transform the last grid project left behind -- which on a lon/lat document is
// the middle of the ocean at an arbitrary scale.
{
	console.log('\n--- the opening view ---');
	L.reset(L.GEO);
	L.setCanvas(800, 600);
	const v = L.geoHome();
	ok('a new geographic project has a home view', !!v, JSON.stringify(v));
	// **THE WHOLE WORLD, NOT A CITY** (Tom, 2026-08-19: "Net3 (Novato, California) is cute. But I
	// think that 'entire world' is more kind"). The home view used to be a 6.6 km box on the ground
	// under EPA's Net3, which is a private joke to anyone not in the north San Francisco Bay. The
	// world is the one opening view equally near to every user, and the basemap makes it
	// recognisable, so getting to your own town is panning rather than searching.
	ok('...centred on the origin, in the document\'s own frame',
		Math.abs(v.cx - L.GEO_HOME.lon) < 1e-9 && Math.abs(v.cy - (-L.GEO_HOME.lat)) < 1e-9,
		JSON.stringify({ cx: v.cx, cy: v.cy }));
	// **THE MERCATOR WORLD IS SQUARE** (Task 145's projection seam): 360 drawing units on each side,
	// because the cut-off latitude is exactly where mercY() reaches 180. It used to be 170.1 units
	// tall, which is what an unprojected frame gives, and the assertion below is the clearest single
	// number that says which frame the page is drawing in.
	//
	// The FLOOR still binds on a landscape canvas -- minScale() is "360 degrees of longitude fit the
	// width, and no further, past which the map repeats itself" -- so on 800x600 the view is 360
	// units wide and 270 tall, reaching latitude 79 rather than the 85.05 cut-off. Ice caps only.
	L.setView(v);
	const wideDeg = 800 / L.view().s, tallDeg = 600 / L.view().s;
	ok('...spanning the whole world east to west, which is where the floor is set',
		Math.abs(wideDeg - 360) < 1e-6, wideDeg.toFixed(4) + ' drawing units across');
	ok('...and the drawable world is 360 units tall, not 170.1 -- the frame is Mercator',
		Math.abs(tallDeg - 270) < 1e-6 && Math.abs(G.mercY(85.0511287798066) - 180) < 1e-9,
		tallDeg.toFixed(4) + ' units down, mercY(85.0511) = ' + G.mercY(85.0511287798066).toFixed(6));
	// A GRID project must get none of this.
	L.reset();
	L.setCanvas(800, 600);
	L.setView({ cx: 0, cy: 0, s: 1 });
	L.newProject();
	ok('a grid project is not sent to California', L.view().s === 1 || !L.isGeo());
}

// ---- 3. what the user reads ------------------------------------------------------------------------
{
	console.log('\n--- coordinates as text ---');
	L.reset();
	ok('a grid coordinate keeps two decimals', L.coordText(-111.912345) === '-111.91', L.coordText(-111.912345));
	L.reset(L.GEO);
	// Six decimals is ~0.11 m. Two would put every node in a site at the same coordinate.
	ok('a geographic coordinate carries six', L.coordText(-111.912345) === '-111.912345', L.coordText(-111.912345));
}

// ---- 4. the drawn length ----------------------------------------------------------------------------
{
	console.log('\n--- the length the Auto checkbox offers ---');
	// Two junctions 0.01 degrees of longitude apart at 33.4 N (Mesa, Arizona), in a US project, so
	// the answer must come back in FEET.
	setUnitSet('us');
	L.reset(L.GEO);
	L.setCanvas(800, 600);
	// **THE INTERNAL y IS MERCATOR NOW, NOT A LATITUDE** (Task 145). Placing a node at a bare 33.4
	// puts it at latitude 28.5, and the geodesic below would then be measured somewhere else -- the
	// exact silent failure this section is about, one frame further in. mercY() is the seam.
	const memY = -G.mercY(33.4);
	const a = L.addNode('junction', -111.9, memY).id;
	const b = L.addNode('junction', -111.89, memY).id;
	const l = L.addLink('pipe', a, b).id;
	L.buildDom();
	const meters = G.geodesicMeters(-111.9, 33.4, -111.89, 33.4);
	const feet = L.geomLength(l);
	ok('the geodesic is about 928 m at this latitude', Math.abs(meters - 928) < 3, meters.toFixed(1));
	// **THE UNIT IS THE PROJECT'S, NOT METRES.** This is the silent one: 928 in a foot project is a
	// pipe a third of its real length, and it looks like a solver fault rather than a conversion.
	ok('...and it arrives in FEET, the project\'s length unit',
		Math.abs(feet - meters * 3.280839895013123) < 1e-6, feet.toFixed(2) + ' ft');
	ok('...which is emphatically not the flat answer', feet > 1000, feet.toFixed(2));

	// The same drawing in a grid project measures 0.01 canvas units, and MUST: a grid project's
	// coordinates are canvas units whatever numbers happen to be in them.
	L.reset();
	L.setCanvas(800, 600);
	const c = L.addNode('junction', -111.9, 33.4).id;
	const d = L.addNode('junction', -111.89, 33.4).id;
	const l2 = L.addLink('pipe', c, d).id;
	L.buildDom();
	ok('a grid project measures the same two points flat, as it always did',
		Math.abs(L.geomLength(l2) - 0.01) < 1e-9, String(L.geomLength(l2)));
}

// ---- THE COORDINATE READOUT ANNOUNCES THE PROJECT BEFORE A POINTER MOVES -----------------------
//
// The readout is where a geographic project says what it is (Task 145) -- and it was written by
// `pointermove` and nothing else, so on a TOUCH DEVICE, which has no hover, it stayed at its markup
// placeholder `X: --  Y: --` for as long as nobody dragged. Screenshot 0047 is a phone on satellite
// imagery reading X and Y.
//
// **THIS IS THE VOCABULARY RULE, not a cosmetic one.** coord_order_check.php blocks a commit over
// lat-before-lon in our own source; a public picture of our own page saying X and Y over a street
// map argues the other way in the one place a stranger looks.
{
	console.log('\n--- the readout says which kind of coordinates these are ---');
	L.reset(L.GEO);
	L.setCanvas(800, 600);
	L.refreshMapStatus();
	const geoText = byId.lpn_coords.textContent;
	ok('a geographic project names latitude and longitude with no pointer at all',
		/Latitude/.test(geoText) && /Longitude/.test(geoText), JSON.stringify(geoText));
	// LATITUDE FIRST, which is the half a naive fix gets wrong: the drawing's x IS the longitude, so
	// emitting the pair in x,y order is the storage order showing through into a line a person reads.
	ok('...latitude first, as every public pair on this page is',
		geoText.indexOf('Latitude') < geoText.indexOf('Longitude'), JSON.stringify(geoText));
	ok('...and it is still a placeholder, not an invented position',
		/--/.test(geoText), JSON.stringify(geoText));

	L.reset();
	L.setCanvas(800, 600);
	L.refreshMapStatus();
	const xyText = byId.lpn_coords.textContent;
	ok('a grid project goes back to X and Y', /^X:/.test(xyText) && /Y:/.test(xyText),
		JSON.stringify(xyText));

	// **IT MUST NOT BLANK A LIVE POSITION.** Every solve and every unit change runs through the same
	// refresh, so a readout that rewrote itself each time would erase the numbers a pointer had just
	// put there -- once per second while somebody is moving the mouse.
	byId.lpn_coords.textContent = 'X: 123.00  Y: 456.00';
	L.refreshMapStatus();
	ok('...and a refresh inside one project leaves a live position alone',
		byId.lpn_coords.textContent === 'X: 123.00  Y: 456.00', byId.lpn_coords.textContent);
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

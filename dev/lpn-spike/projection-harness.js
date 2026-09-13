// A PROJECT'S DECLARED MAP PROJECTION -- ROADMAP Task 641. Run with:
//   node dev/lpn-spike/projection-harness.js
//
// WHY THIS EXISTS. Tom's own acceptance test for the coordinate readout is a map at 89.99 degrees
// where "longitude lines are still parallel and latitude lines are straight as reported by the
// coordinates tracker, which cannot work ... the readout is lying, and nothing on screen names the
// projection in force." Three things have to be true for that line to stop lying, and every one of
// them fails with a page that renders perfectly:
//
//   1. **The axes are named for the coordinate system.** A northing under a heading that says Y is
//      a number a surveyor will read as a site grid coordinate, and nothing on screen disagrees.
//   2. **The pair is read in PUBLIC order** -- latitude before longitude, northing before easting.
//      Reversed, it is still two plausible numbers, and CLAUDE.md's coordinate-order rule exists
//      because this has already shipped backwards once.
//   3. **The projection cannot be changed after creation** (Tom, ruling P2: "We don't want this to
//      be a dabbler action."). A bare easting of 500,000 names a different place in every zone
//      there is, so a project that could change its mind would silently move its whole network.
//
// It also pins the thing that makes all of this legal under "ONLY THE USER TOUCHES A FILE'S
// NUMBERS": declaring a CRS stores a NAME and converts no coordinate. The numbers a projected
// project holds are the ones that were typed, and this harness asserts that a round trip through
// the file leaves every one of them alone.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never against an English
// literal -- harness_wording_check.php is a ratchet and a reworded key must not redden this file.

const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tnewProject: newProject, isGeo: isGeoProject, isProjected: isProjectedProject,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tdeleteNetwork: deleteNetwork, georefStart: georefStart,\n" +
	"\t\tcrsCatalogue: crsCatalogue, crsLabel: crsLabel, crsName: crsDisplayName,\n" +
	"\t\tassignCrs: assignProjectCrs, crsCode: projectCrsCode,\n" +
	"\t\taxisNames: axisNames, coordKind: coordKind,\n" +
	"\t\treadoutAt: coordReadoutAt, readoutBlank: coordReadoutBlank,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, coordText: coordText,\n" +
	"\t\trefreshMapStatus: refreshMapStatus,\n" +
	"\t\tGEO: LPN_COORDS_GEO,\n" +
	"\t\treset: function (coords, crs) { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tif (crs) { project.crs = crs; }\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

const PC = global.EngCalcs.pageConfig;
const ZONE12N = 'EPSG:32612';
const ZONE13N = 'EPSG:32613';

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];
// The two cells of the status strip this feature writes. The stub builds only what its own
// fixtures need, so a harness asking for a cell asks for it rather than assuming.
const crsEl = ensure('lpn_crs'), coordsEl = ensure('lpn_coords');
setUnitSet('si');

// ---- 1. the catalogue ---------------------------------------------------------------------------
// Generated from the EPSG numbering rather than typed, so what is asserted here is the numbering
// itself: 32601..32660 north and 32701..32760 south, which is the register's own arithmetic.
{
	console.log('\n--- the catalogue ---');
	const list = L.crsCatalogue();
	ok('sixty UTM zones in each hemisphere', list.length === 120, String(list.length));
	const codes = {};
	list.forEach(c => { codes[c.code] = (codes[c.code] || 0) + 1; });
	ok('no code appears twice', Object.keys(codes).length === 120);
	ok('zone 12 north is EPSG:32612', !!codes[ZONE12N]);
	ok('zone 12 south is EPSG:32712', !!codes['EPSG:32712']);
	ok('the name carries the zone and the hemisphere',
		/\b12N\b/.test(L.crsLabel(ZONE12N)) && /\b12S\b/.test(L.crsLabel('EPSG:32712')),
		L.crsLabel(ZONE12N) + ' / ' + L.crsLabel('EPSG:32712'));
	// A code this build does not know is the user's data. A file hand-edited to a State Plane zone
	// must come back saying what it says, never silently corrected to something we recognize.
	ok('a code we do not know is shown as it stands', L.crsLabel('EPSG:2223') === 'EPSG:2223');
}

// ---- 2. the declaration, and that it is FINAL ---------------------------------------------------
{
	console.log('\n--- declared once, at creation ---');
	L.reset();
	ok('a project with no declaration is not projected', !L.isProjected() && L.crsCode() === '');
	ok('...and it is not geographic either', !L.isGeo());

	// The door File > New actually walks through, not the harness reaching into `project`.
	L.reset();
	L.newProject(null, ZONE12N);
	ok('File > New with a projection declares it', L.crsCode() === ZONE12N, L.crsCode());
	ok('...and a projected project is not a geographic one', L.isProjected() && !L.isGeo());

	// **THE WHOLE POINT.** One writer, and it refuses every second call.
	ok('a declared projection cannot be changed', L.assignCrs(ZONE13N) === false);
	ok('...and the project still states the first one', L.crsCode() === ZONE12N, L.crsCode());

	// lat/lon IS a coordinate system; it cannot also state a projected one.
	L.reset();
	L.newProject(L.GEO, ZONE12N);
	ok('a lat/lon project takes no projected CRS', L.isGeo() && L.crsCode() === '');
	ok('...and refuses one afterwards', L.assignCrs(ZONE12N) === false && L.crsCode() === '');

	// An xy project with a drawing in it has numbers on the page whose meaning the answer changes.
	L.reset();
	L.setCanvas(800, 600);
	L.addNode('junction', 500000, 3700000);
	ok('an xy project with a network in it refuses a projection',
		L.assignCrs(ZONE12N) === false && L.crsCode() === '');

	// The georeferencing wizard is the other door that could move a whole document, and it is shut.
	L.reset(null, ZONE12N);
	L.setCanvas(800, 600);
	L.addNode('junction', 500000, 3700000);
	L.georefStart();
	ok('the place-on-the-map wizard refuses a projected project',
		!L.isGeo() && L.crsCode() === ZONE12N, L.getProject().coords + '/' + L.crsCode());
}

// ---- 3. the declaration survives the file, and the NUMBERS do not move --------------------------
// "ONLY THE USER TOUCHES A FILE'S NUMBERS": declaring a CRS stores a name, so a round trip has
// nothing to convert and the eastings and northings must come back bit for bit.
{
	console.log('\n--- the round trip ---');
	L.reset(null, ZONE12N);
	L.setCanvas(800, 600);
	const E = 412345.678, N = 3702345.123;
	L.addNode('junction', E, N);
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	ok('the projection is written into the file', saved.project.crs === ZONE12N,
		JSON.stringify(saved.project));
	L.reset();
	ok('...a fresh project has none again', L.crsCode() === '');
	L.applySaved(saved);
	ok('...and opening the file restores it', L.crsCode() === ZONE12N);
	const back = L.getDoc().nodes[0];
	ok('the easting came back untouched', back.x === E, String(back.x));
	ok('the northing came back untouched', back.y === N, String(back.y));

	// Delete network keeps the document's IDENTITY and throws away its CONTENT -- and the projection
	// is identity, on exactly the argument `coords` is.
	L.reset(null, ZONE12N);
	L.setCanvas(800, 600);
	L.addNode('junction', E, N);
	L.deleteNetwork(true);
	ok('Delete network empties the drawing but not the projection', L.crsCode() === ZONE12N);
}

// ---- 4. the axes are named for the coordinate system --------------------------------------------
// Asserted against pageConfig, never against English: a reworded key must not redden this file.
{
	console.log('\n--- the axis names ---');
	L.reset();
	ok('an unprojected grid reads X and Y',
		L.axisNames().first === 'X' && L.axisNames().second === 'Y');

	L.reset(L.GEO);
	ok('a geographic project reads latitude first',
		L.axisNames().first === PC.lpn_field_lat && L.axisNames().second === PC.lpn_field_lon,
		L.axisNames().first + '/' + L.axisNames().second);

	L.reset(null, ZONE12N);
	ok('a projected project reads northing first',
		L.axisNames().first === PC.lpn_field_northing &&
		L.axisNames().second === PC.lpn_field_easting,
		L.axisNames().first + '/' + L.axisNames().second);
	// The two keys must be DIFFERENT words, or the readout says the same thing twice and the
	// ordering assertion above is vacuous.
	ok('...and they are two different words',
		!!PC.lpn_field_northing && PC.lpn_field_northing !== PC.lpn_field_easting);
}

// ---- 5. PUBLIC coordinate order in the readout --------------------------------------------------
// The label order above is only half of it: the VALUES have to follow. A readout that says
// "Northing" over an easting is the defect this rule exists for, and it looks perfectly fine.
{
	console.log('\n--- public order: the values follow the labels ---');
	L.reset(null, ZONE12N);
	L.setCanvas(800, 600);
	const wx = 40, wy = -25;
	const east = L.coordText(L.outwardX(wx)), north = L.coordText(L.outwardY(wy));
	ok('the two coordinates are distinguishable', east !== north, east + ' / ' + north);
	ok('a projected readout leads with the northing',
		L.readoutAt(wx, wy) ===
			PC.lpn_field_northing + ': ' + north + '  ' + PC.lpn_field_easting + ': ' + east,
		L.readoutAt(wx, wy));

	L.reset(L.GEO);
	L.setCanvas(800, 600);
	const lon = L.coordText(L.outwardX(wx)), lat = L.coordText(L.outwardY(wy));
	ok('a geographic readout leads with the latitude',
		L.readoutAt(wx, wy) ===
			PC.lpn_field_lat + ': ' + lat + '  ' + PC.lpn_field_lon + ': ' + lon,
		L.readoutAt(wx, wy));

	// X really is first on an unprojected grid, so there is nothing to reverse. This is the one
	// exception, and it is asserted so that a future tidy-up does not "fix" it into lat/lon's shape.
	L.reset();
	L.setCanvas(800, 600);
	ok('an unprojected grid leads with X',
		L.readoutAt(wx, wy) === 'X: ' + L.coordText(L.outwardX(wx)) +
			'  Y: ' + L.coordText(L.outwardY(wy)), L.readoutAt(wx, wy));
}

// ---- 6. the status strip names the projection ---------------------------------------------------
{
	console.log('\n--- the status strip ---');
	L.reset();
	ok('an unprojected grid says so in words', L.crsName() === PC.lpn_crs_none, L.crsName());
	L.reset(null, ZONE12N);
	ok('a projected project is named by its zone', L.crsName() === L.crsLabel(ZONE12N), L.crsName());
	L.reset(L.GEO);
	ok('a geographic project names Pseudo-Mercator', /Pseudo-Mercator/.test(L.crsName()), L.crsName());

	// The readout is REWRITTEN when the kind changes, and two zones are two kinds: a northing read
	// under the wrong zone is the silent error this whole feature exists to stop.
	L.reset(null, ZONE12N);
	const k12 = L.coordKind();
	L.reset(null, ZONE13N);
	ok('two different zones are two different kinds', k12 !== L.coordKind(), k12 + ' vs ' + L.coordKind());
	L.reset();
	ok('...and an unprojected grid is a third', L.coordKind() === 'xy');

	// The element the strip actually draws. refreshMapStatus() is the one caller, and it is what
	// runs on boot and on every project switch, so this is the live path rather than a helper.
	L.reset(null, ZONE12N);
	L.refreshMapStatus();
	ok('#lpn_crs carries the name before the pointer has moved',
		crsEl.textContent === L.crsLabel(ZONE12N), crsEl.textContent);
	ok('#lpn_coords is blank but correctly headed',
		coordsEl.textContent === L.readoutBlank(), coordsEl.textContent);
	L.reset();
	L.refreshMapStatus();
	ok('...and an unprojected grid says it is not georeferenced',
		crsEl.textContent === PC.lpn_crs_none, crsEl.textContent);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'ALL PASS'));
process.exit(fails ? 1 : 0);

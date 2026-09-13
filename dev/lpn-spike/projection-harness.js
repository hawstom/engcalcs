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

const { byId, ensure, setUnitSet, loadLoopedNetwork, newCoordsRadios } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tnewProject: newProject, isGeo: isGeoProject, isProjected: isProjectedProject,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tdeleteNetwork: deleteNetwork, georefStart: georefStart,\n" +
	"\t\tcrsCatalogue: crsCatalogue, crsLabel: crsLabel, crsName: crsDisplayName,\n" +
	// Phase 2: the spatial filter, the box that drives it, and the New-project box's own answer.
	"\t\tcrsExtent: crsExtent, crsCovers: crsCoversPoint, crsFiltered: crsFiltered,\n" +
	"\t\tWEBMERC: LPN_CRS_WEBMERC,\n" +
	"\t\topenCrsBox: openCrsBox, renderCrsBoxList: renderCrsBoxList,\n" +
	"\t\tcrsBoxSearch: crsBoxSearch, crsBoxOk: crsBoxOk, closeCrsBox: closeCrsBox,\n" +
	"\t\tcrsBoxState: function () { return crsBox; },\n" +
	"\t\tnewBoxAnswers: newBoxAnswers, newBoxCoords: newBoxCoords,\n" +
	"\t\tnewBoxGeo: function () { return newBoxGeo; },\n" +
	"\t\tsyncNewBoxCrsPick: syncNewBoxCrsPick,\n" +
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
	// 121: sixty UTM zones in each hemisphere, and EPSG:3857 -- which phase 2 added, because
	// lat/lon is not a third kind of project beside "projected", it is a projection with a name.
	ok('sixty UTM zones in each hemisphere, plus the geographic answer',
		list.length === 121, String(list.length));
	const codes = {};
	list.forEach(c => { codes[c.code] = (codes[c.code] || 0) + 1; });
	ok('no code appears twice', Object.keys(codes).length === 121);
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

// ---- 7. phase 2: ONE question with TWO answers, and EPSG:3857 is the geographic one -------------
//
// Tom's interface specification of 2026-09-13 collapses phase 1's three radios into two. What has
// to stay true through that collapse is everything section 2 above asserts: the declaration is
// final, and lat/lon is still a different KIND of document from a projected plane rather than a
// row in the same list that happens to be selected.
{
	console.log('\n--- phase 2: the catalogue carries the geographic answer ---');
	const list = L.crsCatalogue();
	ok('EPSG:3857 is in the catalogue', list.some(e => e.code === L.WEBMERC));
	ok('...one hundred and twenty one rows in all', list.length === 121, String(list.length));
	ok('...and it is first, being the commonest answer', list[0].code === L.WEBMERC, list[0].code);
	ok('...named as the register names it, not described',
		/Pseudo-Mercator/.test(L.crsLabel(L.WEBMERC)), L.crsLabel(L.WEBMERC));
	// A lon/lat document must never store it as a projected plane: its numbers are degrees, and a
	// project.crs of EPSG:3857 would be claiming they are metres.
	L.reset();
	ok('and it is refused as a projected declaration', L.assignCrs(L.WEBMERC) === false);
	ok('...leaving the project with no projection at all', L.crsCode() === '');
	// The status strip's geographic name and the catalogue's are ONE string now.
	L.reset(L.GEO);
	ok('the status strip reads the geographic name out of the catalogue',
		L.crsName() === L.crsLabel(L.WEBMERC), L.crsName());
}

// ---- 8. WHERE ON THE EARTH A PROJECTION APPLIES -------------------------------------------------
//
// **THE FILTER IS DATA, NOT A TRANSFORM, AND THAT IS THE WHOLE REASON IT COULD SHIP.** An EPSG area
// of use is a longitude and latitude box and a place-name result is a longitude and a latitude, so
// the question "does this projection cover where I am looking" is a comparison between two things
// already in the same units. Nothing below converts a coordinate; the transform that would turn a
// longitude into an easting is still not in this repository.
{
	console.log('\n--- the extents, generated from the numbering ---');
	// Petaluma, California -- the page's own worked example, and UTM zone 10N by arithmetic:
	// -122.64 falls in [-126, -120), which is zone 10 of the sixty.
	const PETALUMA = { lon: -122.6367, lat: 38.2324 };
	const z10 = L.crsExtent('EPSG:32610');
	ok('zone 10 north spans six degrees of longitude',
		z10.w === -126 && z10.e === -120, z10.w + '..' + z10.e);
	ok('...and the register\'s northern limits', z10.s === 0 && z10.n === 84, z10.s + '..' + z10.n);
	const z10s = L.crsExtent('EPSG:32710');
	ok('the southern zone of the same number is the same strip, below the equator',
		z10s.w === z10.w && z10s.e === z10.e && z10s.s === -80 && z10s.n === 0);
	ok('zone 1 starts at the antimeridian', L.crsExtent('EPSG:32601').w === -180);
	ok('...and zone 60 ends there', L.crsExtent('EPSG:32660').e === 180);
	ok('the geographic answer covers the whole drawable world',
		L.crsExtent(L.WEBMERC).w === -180 && L.crsExtent(L.WEBMERC).e === 180);
	// **A CODE WE DO NOT KNOW HAS NO EXTENT, AND THAT MUST NOT EXCLUDE IT.** The honest statement
	// about an area of use we cannot state is that we cannot state it -- so a State Plane zone in a
	// hand-edited file is still offered rather than quietly filtered away.
	ok('a code we do not know states no extent', L.crsExtent('EPSG:2223') === null);
	ok('...and is therefore not excluded by the filter', L.crsCovers('EPSG:2223', PETALUMA) === true);

	console.log('\n--- the spatial filter narrows a hundred and twenty one to a handful ---');
	ok('Petaluma is inside zone 10 north', L.crsCovers('EPSG:32610', PETALUMA) === true);
	ok('...and outside zone 12 north', L.crsCovers(ZONE12N, PETALUMA) === false);
	ok('...and outside its own southern twin, being north of the equator',
		L.crsCovers('EPSG:32710', PETALUMA) === false);
	const near = L.crsFiltered(PETALUMA, '');
	ok('a place leaves only the projections that cover it', near.length === 2, String(near.length));
	ok('...the geographic answer and the one zone', near.some(e => e.code === L.WEBMERC) &&
		near.some(e => e.code === 'EPSG:32610'), near.map(e => e.code).join(','));
	ok('no place at all offers the whole catalogue',
		L.crsFiltered(null, '').length === 121, String(L.crsFiltered(null, '').length));

	console.log('\n--- the name filter, which is the other half of Tom\'s box ---');
	ok('a zone number narrows by name', L.crsFiltered(null, 'zone 12N').length === 1,
		String(L.crsFiltered(null, 'zone 12N').length));
	ok('...case does not matter', L.crsFiltered(null, 'zone 12n').length === 1);
	ok('an EPSG code finds its own row',
		L.crsFiltered(null, '32612').length === 1 &&
		L.crsFiltered(null, '32612')[0].code === ZONE12N);
	ok('the two filters compose', L.crsFiltered(PETALUMA, 'UTM').length === 1 &&
		L.crsFiltered(PETALUMA, 'UTM')[0].code === 'EPSG:32610');
	ok('a name that matches nothing leaves nothing, rather than everything',
		L.crsFiltered(null, 'State Plane').length === 0);
}

// ---- 9. THE BOX ITSELF: two filters, one catalogue, and the answer it hands back -----------------
{
	console.log('\n--- the Geographic projection box ---');
	const PETALUMA = { lat: 38.2324, lon: -122.6367, extent: null };
	const listEl = byId.lpn_crsbox_list, viewEl = byId.lpn_crsbox_view,
		nameEl = byId.lpn_crsbox_name, noteEl = byId.lpn_crsbox_note,
		placeEl = byId.lpn_crsbox_place;
	L.reset();
	let picked = null;
	L.openCrsBox(L.WEBMERC, null, function (code, ll) { picked = { code: code, ll: ll }; });
	ok('it opens', byId.lpn_crsbox.style.display === 'block', byId.lpn_crsbox.style.display);
	ok('...on the whole catalogue, because no place has been found yet',
		listEl.children.length === 121, String(listEl.children.length));
	ok('...and says so rather than looking broken', noteEl.textContent === PC.lpn_crs_noview,
		noteEl.textContent);
	ok('...opening on the projection it was handed', L.crsBoxState().code === L.WEBMERC);

	// THE PLACE ARRIVES, and the list collapses. This is the whole feature.
	L.crsBoxState().place = PETALUMA;
	L.renderCrsBoxList();
	ok('a place narrows the list to what covers it', listEl.children.length === 2,
		String(listEl.children.length));
	ok('...and the note counts rather than apologising',
		noteEl.textContent === PC.lpn_crs_count.replace('{n}', '2').replace('{total}', '121'),
		noteEl.textContent);
	ok('...and the choice survived the narrowing, being still on the list',
		L.crsBoxState().code === L.WEBMERC);

	// Turning the filter OFF is the other half of Tom's checkbox.
	viewEl.checked = false;
	L.renderCrsBoxList();
	ok('unchecking the map filter offers the whole list again', listEl.children.length === 121);
	viewEl.checked = true;

	// A filter that excludes the current choice must move it to something real rather than leave
	// the box reporting a projection that is not on its own list.
	nameEl.value = 'zone 10N';
	L.renderCrsBoxList();
	ok('the name filter composes with the place', listEl.children.length === 1);
	ok('...and the choice moved to the only row left', L.crsBoxState().code === 'EPSG:32610',
		L.crsBoxState().code);
	ok('...which is what the selector is showing', listEl.value === 'EPSG:32610', listEl.value);

	// **THE ANSWER GOES TO THE CALLER; THIS BOX DECLARES NOTHING.** assignProjectCrs() stays the
	// one writer, which is what keeps the declaration final.
	L.crsBoxOk();
	ok('Select hands the code back to whoever opened the box',
		picked && picked.code === 'EPSG:32610', picked && picked.code);
	ok('...and the place with it, so one search answers two questions',
		picked && picked.ll && picked.ll.lat === PETALUMA.lat);
	ok('...and the box is shut', byId.lpn_crsbox.style.display !== 'block');
	ok('...and no project declared anything', L.crsCode() === '');

	// **THE PLACE-NAME SEARCH IS THE SUITE'S ONE GEOCODER, THROUGH ITS OWN GATE.** What is asserted
	// here is that the box asks js/lpn-search.js for a POINT and does not move the map: a box
	// choosing a projection for a project that does not exist yet has no map to move.
	console.log('\n--- the place-name search, through js/lpn-search.js ---');
	const realPoint = global.EngCalcs.lpnSearchPoint;
	let asked = [];
	global.EngCalcs.lpnSearchPoint = function (text, onHit) {
		asked.push(text);
		onHit({ lat: PETALUMA.lat, lon: PETALUMA.lon, extent: null, label: 'Petaluma' });
	};
	L.openCrsBox(L.WEBMERC, null, function () {});
	ok('it opens on the whole catalogue again', listEl.children.length === 121);
	placeEl.value = '  Petaluma, California  ';
	L.crsBoxSearch();
	ok('the words typed reach the one geocoder, trimmed',
		asked.length === 1 && asked[0] === 'Petaluma, California', JSON.stringify(asked));
	ok('...and the point it answers with becomes the filter',
		listEl.children.length === 2, String(listEl.children.length));
	asked = [];
	placeEl.value = '   ';
	L.crsBoxSearch();
	ok('an empty field sends nothing at all', asked.length === 0);
	global.EngCalcs.lpnSearchPoint = realPoint;
	L.closeCrsBox();
}

// ---- 10. THE NEW-PROJECT BOX: two radios, and where EPSG:3857 parts from the rest ----------------
//
// The collapse from three answers to two costs exactly one comparison, and it is in newBoxAnswers().
// Getting it wrong makes a document that stores degrees and calls them a projected plane, or one
// that stores eastings with no projection named -- both of which render perfectly.
{
	console.log('\n--- the New-project box, with two radios ---');
	L.reset();
	newCoordsRadios.local.checked = true;
	ok('the box opens on the answer that commits to nothing', L.newBoxCoords() === 'local');
	ok('...which asks for no projection at all',
		L.newBoxAnswers().geo === false && L.newBoxAnswers().crs === '');

	newCoordsRadios.geo.checked = true;
	ok('choosing the geographic radio is read back', L.newBoxCoords() === 'geo');
	L.newBoxGeo().crs = L.WEBMERC;
	L.newBoxGeo().place = null;
	ok('...and EPSG:3857 makes a lat/lon project, not a projected one',
		L.newBoxAnswers().geo === true && L.newBoxAnswers().crs === '');

	L.newBoxGeo().crs = ZONE12N;
	ok('...while any other projection makes a projected one',
		L.newBoxAnswers().geo === false && L.newBoxAnswers().crs === ZONE12N);

	// A projection chosen in the box and then abandoned by unchecking the radio is a declaration
	// nobody made, and this is the one declaration that can never be withdrawn.
	newCoordsRadios.local.checked = true;
	ok('a projection left over from a chooser nobody committed to is not declared',
		L.newBoxAnswers().geo === false && L.newBoxAnswers().crs === '');

	// The chooser button STATES the answer, which is what makes it one control rather than two.
	newCoordsRadios.geo.checked = true;
	L.newBoxGeo().crs = ZONE12N;
	L.syncNewBoxCrsPick();
	ok('the chooser button reads the projection now in force',
		byId.lpn_new_crs_pick.textContent.indexOf(L.crsLabel(ZONE12N)) === 0,
		byId.lpn_new_crs_pick.textContent);
	newCoordsRadios.local.checked = true;
	L.syncNewBoxCrsPick();
	ok('...and is greyed when the question belongs to the other radio',
		byId.lpn_new_crs_pick.disabled === true);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'ALL PASS'));
process.exit(fails ? 1 : 0);

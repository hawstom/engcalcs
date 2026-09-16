// TYPING A NODE'S COORDINATES -- ROADMAP Task 674. Run with:
//   node dev/lpn-spike/node-coord-entry-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-15: *"Add coordinates inputs (N, E, z or X, Y, z or Lat, Lon, z) to
// properties and tables. I may need to be dissuaded from this, but at the moment I can scarcely
// believe that we and epanetjs don't expose this already."* Until this shipped, position was the
// ONLY number on this page that could be entered by gesture alone, and so the only one that could
// not be entered exactly -- a surveyed junction has a northing to two decimals and the page asked
// you to drag until you were close.
//
// Four things have to be true, and every one of them fails with a page that renders perfectly and
// gives an answer:
//
//   1. **The typed number reaches the document, on the axis the label named.** A slot-to-axis fork
//      that got the wrong way round writes an easting into a northing: two plausible numbers, a
//      node that moves, and a network somewhere else entirely. `coord_order_check.php` is blocking
//      because this has already shipped backwards once.
//   2. **The vocabulary follows the PROJECT and comes from ONE place.** Three kinds, three
//      vocabularies -- lat/lon, northing/easting, x/y -- and the status strip already answers this
//      through axisNames(). A second opinion in the popup is a page that calls one axis two things.
//   3. **The origin shift is not skipped.** The document stores coordinates local to an origin
//      (Task 354), so a typed state-plane northing that went in raw would be half a million units
//      out, and a typed latitude that skipped inwardY() would be upside down as well. That census
//      lives in local-origin-harness.js; what is asserted HERE is the round trip a person sees:
//      type 1304070.25, read 1304070.25 back.
//   4. **A SCENARIO GETS ITS OWN POSITION, and everything derived from position follows it.** Tom
//      REVERSED this on 2026-09-15: *"Give the people their overrides! Whether coordinate or any
//      other property, what's gained by denying them an override?"* -- so x and y are in
//      `LPN_OVERRIDABLE` and the assertions that used to demand no override was invented now demand
//      the opposite (section 6). The failures to guard against are the ones an override brings with
//      it: a Base position quietly edited from inside a scenario, a dot that moves while its pipe's
//      length does not, an exact typed number going in and a floating-point one coming back out,
//      and an `.inp` that states one scenario's positions without saying so.
//
// **AND THE POPUP AND THE TABLE ARE ASSERTED THROUGH THEIR OWN SEAMS, NOT THROUGH A SHARED
// HELPER.** Two editors of one property are two chances to disagree about what editing it means
// (dev/scenario-seam-repair.md), so section 4 drives the real `nodeCoordFields()` DOM and section 5
// drives the real column specs out of `paneTables()`. A harness that only called
// setNodeCoordAxis() would pass with either editor unwired.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never against an English
// literal -- harness_wording_check.php is a ratchet and a reworded key must not redden this file.

const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\taxisNames: axisNames, readsNorthFirst: readsNorthFirst,\n" +
	"\t\tcoordSlotIsY: coordSlotIsY, nodeCoordAxis: nodeCoordAxis,\n" +
	"\t\tsetNodeCoordAxis: setNodeCoordAxis, coordValueOk: coordValueOk,\n" +
	"\t\tnodeCoordFields: nodeCoordFields, coordFields: coordFields,\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY, inwardX: inwardX, inwardY: inwardY,\n" +
	"\t\tgeomLength: function (id) { return linkGeomLength(linkById(id)); },\n" +
	"\t\tpaneTables: paneTables, paneCols: paneCols, paneCellText: paneCellText,\n" +
	"\t\tpaneCellIsPlain: paneCellIsPlain, paneHeadingText: paneHeadingText,\n" +
	"\t\tpaneWriteCellText: paneWriteCellText,\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE, ovKey: ovKey,\n" +
	"\t\tsetProp: setProp, effective: effective, baseValue: baseValue,\n" +
	"\t\thasOverride: hasOverride, clearOverride: clearOverride,\n" +
	"\t\tnodeDrawX: nodeDrawX, nodeDrawY: nodeDrawY, nodeAt: nodeAt,\n" +
	"\t\tnodeHasCoordOverride: nodeHasCoordOverride, writeNodeCoord: writeNodeCoord,\n" +
	"\t\tinpExportOptions: inpExportOptions,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveScenario: activeScenario, inBase: inBaseScenario,\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tGEO: LPN_COORDS_GEO, MAXLAT: LPN_MERC_MAX_LAT,\n" +
	"\t\treset: function (coords, crs, origin) { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tif (crs) { project.crs = crs; }\n" +
	"\t\t\tif (origin) { doc.origin = origin; }\n" +
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
const notice = ensure('lpn_map_notice');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('si');

const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol);

// The stub answers querySelectorAll() with [] by declaration, so the popup's rows are walked. Two
// helpers rather than one selector, because what the assertions need is the ORDER the boxes were
// appended in -- which row is the first-read axis is the whole of the public-order rule.
function tagsIn(host, tag) {
	const out = [];
	(function walk(e) {
		(e.children || []).forEach(function (c) { if (c._tag === tag) { out.push(c); } walk(c); });
	}(host));
	return out;
}
function fire(el, type) { ((el && el._listeners && el._listeners[type]) || []).slice().forEach(f => f({})); }

// A fresh project of one kind with one junction on the map. buildDom() is what puts the node in
// nodeEls, which setNodeCoordAxis() requires -- a node that is not drawn cannot be moved, and that
// guard is the reason this helper draws rather than just pushing onto doc.nodes.
function project(kind, crs, origin) {
	L.reset(kind, crs, origin);
	const n = L.addNode('junction', 10, -20);
	L.buildDom();
	return n;
}

// ---- 1. the vocabulary, and that there is only one of it ---------------------------------------
// Section 2 of the four above. The popup's labels and the table's headings are both read out of
// axisNames(), so what is asserted here is that axisNames() is the ONLY answer -- a literal in
// either place would pass an assertion against itself.
{
	console.log('\n--- three kinds, three vocabularies, one source ---');

	project();
	ok('a grid project names its axes X and Y',
		L.axisNames().first === PC.lpn_field_x && L.axisNames().second === PC.lpn_field_y,
		L.axisNames().first + '/' + L.axisNames().second);
	ok('...and reads x first, because there the pair really is x then y', !L.readsNorthFirst());

	project(L.GEO);
	ok('a geographic project names latitude and longitude',
		L.axisNames().first === PC.lpn_field_lat && L.axisNames().second === PC.lpn_field_lon,
		L.axisNames().first + '/' + L.axisNames().second);
	ok('...and reads latitude first, which is PUBLIC order', L.readsNorthFirst());

	project(null, ZONE12N);
	ok('a projected project names northing and easting',
		L.axisNames().first === PC.lpn_field_northing && L.axisNames().second === PC.lpn_field_easting,
		L.axisNames().first + '/' + L.axisNames().second);
	ok('...and reads northing first', L.readsNorthFirst());

	// The fork that decides which document axis the top box holds. Getting it backwards writes an
	// easting into a northing -- two plausible numbers and a network in the wrong place.
	project(null, ZONE12N);
	ok('north-first: slot 1 is the document y', L.coordSlotIsY(1) && !L.coordSlotIsY(2));
	project();
	ok('x-first: slot 1 is the document x', !L.coordSlotIsY(1) && L.coordSlotIsY(2));
}

// ---- 2. the typed number reaches the document, on the right axis --------------------------------
{
	console.log('\n--- a typed coordinate lands where it was typed ---');

	// A GRID project: no origin, no projection, so the arithmetic is bare and any fork error is
	// visible as a swap.
	let n = project();
	ok('the grid project reads its node back as typed', L.setNodeCoordAxis(n, 1, 250) &&
		L.setNodeCoordAxis(n, 2, 175) &&
		near(L.nodeCoordAxis(n, 1), 250) && near(L.nodeCoordAxis(n, 2), 175),
		L.nodeCoordAxis(n, 1) + ', ' + L.nodeCoordAxis(n, 2));
	ok('...and slot 1 really is x on a grid, in the document', near(n.x, 250), String(n.x));

	// A PROJECTED project on a real state-plane-sized origin. This is the case the feature exists
	// for: seven digits and two decimals, which no drag can hit.
	n = project(null, ZONE12N, { x: 579000, y: 1304000 });
	ok('a surveyed northing goes in to the second decimal',
		L.setNodeCoordAxis(n, 1, 1304070.25) && near(L.nodeCoordAxis(n, 1), 1304070.25),
		String(L.nodeCoordAxis(n, 1)));
	ok('...and the document holds a SMALL local number, the origin still subtracted',
		Math.abs(n.y) < 1000, String(n.y));
	ok('...and the easting is the second slot', L.setNodeCoordAxis(n, 2, 579350.5) &&
		near(L.nodeCoordAxis(n, 2), 579350.5) && Math.abs(n.x) < 1000,
		L.nodeCoordAxis(n, 2) + ' local ' + n.x);

	// **THE UNTYPED AXIS IS NOT REWRITTEN**, which is the coordinate-exactness rule and not
	// tidiness: in a geographic project a read-out-and-write-back of the other axis runs the
	// latitude through mercLat(mercY(lat)), which differs in the last bits for most latitudes.
	n = project(L.GEO);
	L.setNodeCoordAxis(n, 1, 38.1234567);
	L.setNodeCoordAxis(n, 2, -122.5678901);
	const xWas = n.x, yWas = n.y;
	L.setNodeCoordAxis(n, 1, 38.1234567);           // the same latitude again
	ok('re-typing one axis leaves the other bit-identical', n.x === xWas, String(n.x));
	ok('...and leaves its own value bit-identical too', n.y === yWas, String(n.y));
	ok('a latitude round-trips through the projection',
		near(L.nodeCoordAxis(n, 1), 38.1234567, 1e-9) && near(L.nodeCoordAxis(n, 2), -122.5678901, 1e-9),
		L.nodeCoordAxis(n, 1) + ', ' + L.nodeCoordAxis(n, 2));

	// A pipe's AUTO length follows the drawing, and a typed coordinate is a change to the drawing.
	// updateNode() is what replays the incident links, so this is the assertion that the seam calls
	// it -- a setter that only wrote n.x would leave every length behind and still move the symbol.
	L.reset();
	const a = L.addNode('junction', 0, 0).id, b = L.addNode('junction', 100, 0).id;
	const p = L.addLink('pipe', a, b).id;
	L.buildDom();
	const len0 = L.linkById(p)._length;
	L.setNodeCoordAxis(L.nodeById(b), 1, 300);
	// **THE STORED length, NOT linkGeomLength()**, and the difference is the whole assertion:
	// linkGeomLength() re-measures the document and would agree with a setter that moved the node
	// and redrew nothing. `_length` is filled by updateLinkGeometry(), which only updateNode()
	// reaches -- so this is what says the seam replays the incident links. A setter that skipped it
	// would move the symbol, leave every automatic length behind, and solve the old network.
	ok('a typed coordinate re-derives the pipe length the drawing owns',
		near(L.linkById(p)._length, 300) && !near(len0, 300),
		len0 + ' -> ' + L.linkById(p)._length);
	ok('...and the drawn node really is where it was typed',
		near(L.geomLength(p), 300), String(L.geomLength(p)));
}

// ---- 3. what is refused, and that it says so ---------------------------------------------------
// Web Mercator has no finite y at the poles, so a latitude past the cut-off is not a slow map --
// it is a node at Infinity, and the whole drawing goes with it.
{
	console.log('\n--- off the world ---');
	const n = project(L.GEO);
	const before = { x: n.x, y: n.y };
	notice.textContent = '';
	ok('a latitude past the Mercator cut-off is refused', L.setNodeCoordAxis(n, 1, 89.9) === false);
	ok('...the node did not move', n.x === before.x && n.y === before.y);
	ok('...and it is refused OUT LOUD', notice.textContent === PC.lpn_coord_off_world,
		JSON.stringify(notice.textContent));
	ok('a longitude past 180 is refused too', L.setNodeCoordAxis(n, 2, 181) === false);
	ok('a value that is not a number is refused', L.setNodeCoordAxis(n, 1, NaN) === false);
	ok('the cut-off itself is accepted', L.setNodeCoordAxis(n, 1, L.MAXLAT) === true);

	// A grid or a projected project has NO range of ours: those numbers are the survey's.
	const g = project();
	ok('a grid project accepts a number no latitude could be',
		L.setNodeCoordAxis(g, 1, 1e6) && near(L.nodeCoordAxis(g, 1), 1e6));
	const pj = project(null, ZONE12N);
	ok('a projected project accepts a full easting', L.coordValueOk(false, 579350.5));
}

// ---- 4. the PROPERTY POPUP's own two boxes -----------------------------------------------------
// The real nodeCoordFields(), building into a real container, so an unwired popup fails here rather
// than passing because setNodeCoordAxis() works when called directly.
{
	console.log('\n--- the property popup ---');
	const n = project(null, ZONE12N, { x: 579000, y: 1304000 });
	L.setNodeCoordAxis(n, 1, 1304070.25);
	L.setNodeCoordAxis(n, 2, 579350.5);

	const host = global.document.createElement('div');
	L.nodeCoordFields(host, n);
	const inputs = tagsIn(host, 'input');
	ok('the popup offers two boxes', inputs.length === 2, String(inputs.length));
	ok('...both typeable, neither read-only',
		inputs.length === 2 && !inputs[0].readOnly && !inputs[1].readOnly);
	// step="any" is not cosmetic: the browser's default step of 1 makes every decimal coordinate
	// fail its own validity test, which is how a six-decimal latitude becomes untypeable.
	ok('...and each accepts a decimal', inputs.length === 2 &&
		inputs[0].step === 'any' && inputs[1].step === 'any');
	ok('the first box holds the northing, unrounded',
		inputs[0].value === '1304070.25', inputs[0].value);
	ok('the second box holds the easting', inputs[1].value === '579350.5', inputs[1].value);
	// The labels are the project's own vocabulary, read from the same axisNames() the status strip
	// reads. Asserted against pageConfig, never against the word "Northing".
	const text = host.textContent || '';
	ok('the rows are labelled for THIS project',
		text.indexOf(PC.lpn_field_northing) >= 0 && text.indexOf(PC.lpn_field_easting) >= 0,
		JSON.stringify(text));

	// Typing into the box moves the node. The change listener is the whole point: a field that
	// showed the coordinate and wrote nothing is exactly the read-only display this task replaced.
	inputs[0].value = '1304999.5';
	fire(inputs[0], 'change');
	ok('typing in the first box moves the node', near(L.nodeCoordAxis(n, 1), 1304999.5),
		String(L.nodeCoordAxis(n, 1)));

	// A REFUSED value puts the document's own number back, rather than leaving a number nothing
	// accepted sitting in the box looking committed.
	const geo = project(L.GEO);
	L.setNodeCoordAxis(geo, 1, 38.5);
	const host2 = global.document.createElement('div');
	L.nodeCoordFields(host2, geo);
	const gi = tagsIn(host2, 'input');
	gi[0].value = '89.9';
	fire(gi[0], 'change');
	ok('a refused entry is put back to what the document holds', gi[0].value === '38.5',
		gi[0].value + ' / node ' + L.nodeCoordAxis(geo, 1));

	// A TEXT object's popup keeps the READ-ONLY pair, and that is a design decision rather than an
	// oversight: an attached Text's stored x/y is an OFFSET from its anchor, not a position on the
	// map, and two different quantities must not share one box.
	const host3 = global.document.createElement('div');
	L.coordFields(host3, 12, -34);
	ok('the read-only pair is still available for a Text object',
		tagsIn(host3, 'input').length === 0 &&
		tagsIn(host3, 'span').length === 2,
		String(tagsIn(host3, 'span').length));
}

// ---- 5. the TABLES' two columns ----------------------------------------------------------------
// Read out of paneTables() rather than out of paneColCoord(), because what can go wrong is the
// WIRING: a column spec nobody added to a table is a column that exists and is on no screen.
{
	console.log('\n--- the node tables ---');
	const n = project(null, ZONE12N, { x: 579000, y: 1304000 });
	L.setNodeCoordAxis(n, 1, 1304070.25);
	L.setNodeCoordAxis(n, 2, 579350.5);

	const nodeSpecs = L.paneTables().filter(s => s.group === 'node');
	ok('all three node tables exist', nodeSpecs.length === 3,
		nodeSpecs.map(s => s.id).join(', '));
	const withCoords = nodeSpecs.filter(s =>
		L.paneCols(s).some(c => c.key === 'axis1') && L.paneCols(s).some(c => c.key === 'axis2'));
	ok('...and every one of them carries both coordinate columns',
		withCoords.length === 3, withCoords.map(s => s.id).join(', '));

	const linkSpecs = L.paneTables().filter(s => s.group !== 'node');
	ok('a link has no coordinates of its own and is given none',
		linkSpecs.every(s => !L.paneCols(s).some(c => c.key === 'axis1' || c.key === 'axis2')));

	const junctions = nodeSpecs.filter(s => s.type === 'junction')[0];
	const c1 = L.paneCols(junctions).filter(c => c.key === 'axis1')[0];
	const c2 = L.paneCols(junctions).filter(c => c.key === 'axis2')[0];

	ok('the column is a BOX, not a plain cell', !L.paneCellIsPlain(c1, n) && !L.paneCellIsPlain(c2, n));
	ok('the cell reads the coordinate', L.paneCellText(c1, n) === '1304070.25', L.paneCellText(c1, n));
	// **THE HEADING IS A FUNCTION, AND THAT IS WHAT MAKES IT FOLLOW THE PROJECT.** paneTables()
	// caches its specs for the life of the tab, so a heading resolved at build time would be
	// whichever kind of project happened to be open first -- for ever.
	ok('the heading is this project vocabulary', L.paneHeadingText(c1) === PC.lpn_field_northing,
		L.paneHeadingText(c1));
	const geoNode = project(L.GEO);
	ok('...and the SAME column heading follows a change of project kind',
		L.paneHeadingText(c1) === PC.lpn_field_lat, L.paneHeadingText(c1));
	project();
	ok('...and again on a grid', L.paneHeadingText(c1) === PC.lpn_field_x, L.paneHeadingText(c1));

	// A written cell -- what a typed cell and a PASTED one both go through.
	const g = project();
	ok('writing a cell moves the node', L.paneWriteCellText(junctions, c1, g, '640') &&
		near(L.nodeCoordAxis(g, 1), 640), String(L.nodeCoordAxis(g, 1)));
	ok('...and a cell that is not a number is refused and counted',
		L.paneWriteCellText(junctions, c1, g, 'north a bit') === false &&
		near(L.nodeCoordAxis(g, 1), 640));
}

// ---- 6. a scenario gets its own position ------------------------------------------------------
// Section 4 of the four at the top. **THIS SECTION USED TO ASSERT THE OPPOSITE** -- that no
// override was invented -- and Tom reversed the rule on 2026-09-15: *"We've completely
// miscommunicated, and I apologize. What I meant to say is, 'Give the people their overrides!'
// Whether coordinate or any other property, what's gained by denying them an override?"* The old
// argument was that a node cannot be in two places at once in one rendered map; a scenario IS one
// rendered map, and switching scenarios rebuilds the drawing, so there was never such a moment.
{
	console.log('\n--- inside a scenario ---');
	ok('x and y are overridable node properties', !!L.OVERRIDABLE.node.x && !!L.OVERRIDABLE.node.y);
	// The declaration is the source of truth for scenario_seam_check.php as well, which is why it is
	// asserted here rather than the behaviour alone being trusted.
	ok('...and so is a demand, so the whitelist is really being read', !!L.OVERRIDABLE.node.demand);

	const n = project();
	L.setNodeCoordAxis(n, 1, 100);
	L.setNodeCoordAxis(n, 2, 200);
	const baseX = L.nodeDrawX(n), baseY = L.nodeDrawY(n);
	const scn = L.createScenario('Max day');
	ok('we are in a scenario', !L.inBase());

	ok('typing a coordinate in a scenario is accepted', L.setNodeCoordAxis(n, 1, 555) === true);
	const ov = scn.overrides[L.ovKey(n)];
	// **THE OVERRIDE HOLDS THE PUBLIC NUMBER THE USER TYPED**, not the drawing-frame one -- see
	// writeNodeCoord(). On a grid project slot 1 is x.
	ok('...and it IS an override, keyed on the axis that was typed',
		!!ov && ov.x === 555 && ov.y === undefined, JSON.stringify(ov || null));
	ok('...which the marker machinery can see', L.hasOverride(n, 'x') === true);
	ok('...and the scenario counts it', Object.keys(scn.overrides).length === 1);
	ok('...the popup and the tables read the scenario back', near(L.nodeCoordAxis(n, 1), 555));
	ok('...the DRAWING follows it', near(L.nodeDrawX(n), 555) && L.nodeAt(n).x === L.nodeDrawX(n),
		String(L.nodeDrawX(n)));
	ok('...and Base is still visible beside it', near(L.baseValue(n, 'x'), 100),
		String(L.baseValue(n, 'x')));

	// **BASE IS NOT EDITED FROM INSIDE THE SCENARIO.** This is the defect the write seam exists for
	// (dev/scenario-seam-repair.md), asked of a position.
	L.switchScenario('base');
	ok('Base keeps its own position', near(L.nodeCoordAxis(n, 1), 100) && near(L.nodeDrawX(n), baseX),
		String(L.nodeCoordAxis(n, 1)));
	ok('...on the untouched axis too', near(L.nodeDrawY(n), baseY));

	// A DRAG AND A TYPED COORDINATE ARE THE SAME ACT (writeNodeCoord is the one door): the drag hands
	// over the drawing-frame number and nothing else, which is what the pointer has.
	L.switchScenario(scn.id);
	L.writeNodeCoord(n, false, 777);
	ok('a drag inside a scenario records the same override a typed box does',
		near(scn.overrides[L.ovKey(n)].x, L.outwardX(777)) && near(L.nodeDrawX(n), 777),
		JSON.stringify(scn.overrides[L.ovKey(n)]));

	// Clearing it returns the node to Base's position, which is the marker's untick.
	L.clearOverride(n, 'x');
	ok('clearing the override puts the node back where Base has it', near(L.nodeDrawX(n), baseX));
	ok('...and the scenario is empty again', Object.keys(scn.overrides).length === 0);
}

// ---- 6b. everything DERIVED from a position follows the override -------------------------------
// **AN OVERRIDE THAT MOVES THE DOT AND NOT THE PIPE IS WORSE THAN NO OVERRIDE.** Every one of these
// is derived from where a node is, and every one of them reads it through a different function --
// linkPointList() for the geometry and the Auto length, nodeLonLat() for the ground, the bbox for
// zoom-to-fit -- so one of them left on Base's position is a network that disagrees with itself.
{
	console.log('\n--- what follows a moved node ---');
	L.reset();
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 100, 0);
	const l = L.addLink('pipe', a.id, b.id);
	L.buildDom();
	const len0 = L.geomLength(l.id);
	ok('the pipe starts 100 units long', near(len0, 100), String(len0));

	const scn = L.createScenario('Relocated');
	L.setNodeCoordAxis(b, 1, L.outwardX(300));
	ok('the moved node is where the scenario puts it', near(L.nodeDrawX(b), 300), String(L.nodeDrawX(b)));
	ok('...and the PIPE LENGTH follows it', near(L.geomLength(l.id), 300), String(L.geomLength(l.id)));

	L.switchScenario('base');
	ok('...while Base still has the pipe it had', near(L.geomLength(l.id), 100), String(L.geomLength(l.id)));
}

// ---- 7. a typed coordinate survives the file ---------------------------------------------------
{
	console.log('\n--- through the file ---');
	const n = project(null, ZONE12N, { x: 579000, y: 1304000 });
	L.setNodeCoordAxis(n, 1, 1304070.25);
	L.setNodeCoordAxis(n, 2, 579350.5);
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.applySaved(saved);
	L.buildDom();
	const back = L.nodeById(n.id);
	ok('a typed survey coordinate comes back exactly',
		L.nodeCoordAxis(back, 1) === 1304070.25 && L.nodeCoordAxis(back, 2) === 579350.5,
		L.nodeCoordAxis(back, 1) + ', ' + L.nodeCoordAxis(back, 2));

	// **A TYPED LATITUDE IS BIT-IDENTICAL IN THE FILE, NOT NEARLY** (CLAUDE.md: only the user
	// touches a file's numbers, and "not within tolerance -- identical"). Measured before
	// setNodeCoordAxis() recorded a source: typing 38.5 saved 38.49999999999999 and 0.1 saved
	// 0.09999999999999677, because Web Mercator is not invertible in doubles -- mercLat(mercY(x))
	// differs in the last bits for 69.8% of latitudes. So === here rather than near(), and a
	// latitude whose decimal representation makes the departure visible: 38.5 and 0.1 are the two
	// that were actually wrong, and a tolerance would have called both of them right.
	[[38.5, -122.5678901], [0.1, 151.2093], [-33.8688, 18.4241], [38.1234567, -122.5678901]]
		.forEach(function (ll) {
			const g = project(L.GEO);
			L.setNodeCoordAxis(g, 1, ll[0]);
			L.setNodeCoordAxis(g, 2, ll[1]);
			const snap = JSON.parse(JSON.stringify(L.serialize()));
			ok('the file states the typed latitude and longitude exactly: ' + ll[0] + ', ' + ll[1],
				snap.nodes[0].y === ll[0] && snap.nodes[0].x === ll[1],
				snap.nodes[0].y + ', ' + snap.nodes[0].x);
			L.applySaved(snap);
			L.buildDom();
			const b2 = L.nodeById(g.id);
			ok('...and it reads back after the round trip',
				near(L.nodeCoordAxis(b2, 1), ll[0], 1e-9) &&
				near(L.nodeCoordAxis(b2, 2), ll[1], 1e-9),
				L.nodeCoordAxis(b2, 1) + ', ' + L.nodeCoordAxis(b2, 2));
		});

	// **AND A DRAG AFTERWARDS INVALIDATES THAT RECORD BY ITSELF**, which is the property that makes
	// the source channel safe to write into: nothing has to remember to clear one. A node moved
	// after a coordinate was typed must save where it now IS, not where it was typed.
	const d = project(L.GEO);
	L.setNodeCoordAxis(d, 1, 38.5);
	L.setNodeCoordAxis(d, 2, -122.5);
	d.y = d.y + 0.25;   // what a drag does, straight onto the document
	const moved = JSON.parse(JSON.stringify(L.serialize()));
	ok('a drag after a typed coordinate drops the stale source record',
		moved.nodes[0].y !== 38.5, String(moved.nodes[0].y));
}

// ---- 8. AN OVERRIDDEN COORDINATE IS EXACT, AND IT IS EXACT FOR A DIFFERENT REASON --------------
//
// A BASE latitude is exact because `_ysrc` records the characters typed and the file's own reader
// hands them back (section 7). An OVERRIDE needs no such record: the override IS the number typed,
// stored in the public frame, so it never meets the projection at all. That is why typing 38.5 in a
// scenario reads back as 38.5 bit-identically while Base's own round trip lands on
// 38.49999999999999 -- the asymmetry is real and is asserted here rather than explained.
{
	console.log('\n--- an overridden coordinate through the file ---');
	const g = project(L.GEO);
	L.setNodeCoordAxis(g, 1, 38.5);
	L.setNodeCoordAxis(g, 2, -122.5);
	const scn = L.createScenario('Relocated');
	L.setNodeCoordAxis(g, 1, 38.6);
	L.setNodeCoordAxis(g, 2, -122.4);
	const snap = JSON.parse(JSON.stringify(L.serialize()));
	const savedOv = (snap.scenarios.filter(x => x.id === scn.id)[0] || {}).overrides[L.ovKey(g)];
	ok('the file states the overridden latitude and longitude exactly',
		savedOv && savedOv.y === 38.6 && savedOv.x === -122.4, JSON.stringify(savedOv || null));
	// **AND BASE'S OWN SOURCE RECORD IS UNTOUCHED BY IT.** Typing inside a scenario must not file a
	// source record for a number the element does not hold, and Base's is still true because Base's
	// coordinate has not moved.
	ok('...while Base still states the latitude IT was given, exactly',
		snap.nodes[0].y === 38.5 && snap.nodes[0].x === -122.5,
		snap.nodes[0].y + ', ' + snap.nodes[0].x);

	L.applySaved(snap);
	L.buildDom();
	const back = L.nodeById(g.id);
	ok('an overridden latitude reads back bit-identically, with no round trip to make',
		L.nodeCoordAxis(back, 1) === 38.6 && L.nodeCoordAxis(back, 2) === -122.4,
		L.nodeCoordAxis(back, 1) + ', ' + L.nodeCoordAxis(back, 2));
	L.switchScenario('base');
	ok('...and Base opens where Base was', near(L.nodeCoordAxis(back, 1), 38.5, 1e-9));
}

// ---- 9. WHAT THE .inp EXPORTER SAYS ABOUT IT ---------------------------------------------------
//
// EPANET has no per-scenario coordinates. The rule this page already follows is that an export
// writes the scenario the user is looking at, so the file states THOSE positions -- and the
// difference is REPORTED, never dropped in silence and never faked. Driven through
// inpExportOptions(), which is the page's own wiring to the writer: a harness passing its own
// options would be asserting about itself.
{
	console.log('\n--- the .inp export ---');
	L.reset();
	const a = L.addNode('junction', 10, -20), b = L.addNode('junction', 100, -20);
	L.addLink('pipe', a.id, b.id);
	L.buildDom();
	const base = EngCalcs.lpnExportInp(L.serialize(), L.inpExportOptions());
	ok('a Base export reports no scenario coordinates',
		base.ok && !base.differences.some(d => d.code === 'node-coords-scenario'));

	const scn = L.createScenario('Relocated');
	L.setNodeCoordAxis(b, 1, L.outwardX(400));
	const out = EngCalcs.lpnExportInp(L.serialize(), L.inpExportOptions());
	const d = (out.differences || []).filter(x => x.code === 'node-coords-scenario')[0];
	ok('...and an export from a scenario that moved a node reports it, naming the node',
		out.ok && !!d && d.ids.length === 1 && d.ids[0] === b.id, JSON.stringify(d || null));
	// The row itself: the file states where THIS scenario puts the node, so nothing is faked and
	// nothing is dropped.
	// **OUT OF THE [COORDINATES] SECTION, not out of the whole file.** `J2\t0\t0` is the junction's
	// own elevation-and-demand row and matches an id-first filter just as well, which is how the
	// first version of this assertion read a coordinate off the wrong section.
	const coordSec = out.inp.split('[COORDINATES]')[1].split('[')[0];
	const rowB = (coordSec.split('\n').filter(t => t.trim().indexOf(b.id + '\t') === 0)[0] || '');
	ok('...and the [COORDINATES] row states the scenario position',
		rowB.indexOf('400') >= 0, rowB.trim());
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nALL PASS');
process.exit(fails ? 1 : 0);

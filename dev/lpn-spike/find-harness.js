// Headless check of FIND -- ROADMAP Task 420 (Map Finder: an ID lookup) and Task 353 (a condition
// on a value), which ship as one panel.
//
//   node dev/lpn-spike/find-harness.js
//
// WHY THIS EXISTS. A query tool has exactly one job -- return the elements that match and no others
// -- and every way of getting it wrong is quiet:
//
//   1. **It answers in the wrong unit.** The search reads colorValueOf(), the accessor the colour
//      ramp and the map labels already use, so "Diameter is greater than 8" means the 8 printed on
//      the drawing. If it ever read the stored SI value instead, a US project would match nothing
//      and an SI one would match everything, with no error either way. Asserted here in BOTH unit
//      sets against the same network.
//   2. **A stale result pans to a ghost.** The panel stays open across edits and undo, so a result
//      row must re-resolve its element BY ID at click time. A row holding an object reference would
//      still "work" -- it would select an id nothing draws and move the map to the coordinates the
//      deleted node used to have.
//   3. **A scope change leaves an impossible query behind.** Pressure is not a property of a pipe.
//      If the property survives the scope change, the panel silently matches nothing forever.
//
// It also asserts the thing Tom will notice first: Find PANS and does not ZOOM. Choosing a scale
// would throw away the zoom he set to read the drawing.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tsetProp: setProp, buildDom: buildDom,\n" +
	"\t\tdeleteElement: deleteElement,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { applyView(v); },\n" +
	"\t\tview: function () { return currentView(); },\n" +
	// The query itself: the state the three pull-downs write, and the two functions the Find
	// button and a result row call.
	"\t\tfind: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tfindState: function () { return findState; },\n" +
	"\t\tnormalize: function (scope, prop, op) { findState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\tfindNormalize(); return findState.prop + '/' + findState.op; },\n" +
	"\t\tpropKeys: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[0]; }); },\n" +
	"\t\topKeys: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[0]; }); },\n" +
	"\t\tgoTo: findGoTo, selectedRef: selectedRef,\n" +
	"\t\tadjacent: function (id) { return incidentLinks[id] || []; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; findState = { scope: 'all', prop: 'id', op: 'contains', value: '' };\n" +
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
function same(a, b) { return JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort()); }

byId.lpn_toolbar.querySelectorAll = () => [];

// Three junctions, a reservoir, two pipes of DIFFERENT diameters, and a Text label. The diameters
// are what the numeric conditions are asked about, and they are set through setProp() -- the one
// write seam -- rather than onto the element, so the search is reading what the map reads.
function build(unitSet) {
	setUnitSet(unitSet);
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	const b = L.addNode('junction', 200, 0).id;
	const ra = L.addLink('pipe', r, a);
	const ab = L.addLink('pipe', a, b);
	L.setProp(ra, 'diameter', 6);
	L.setProp(ab, 'diameter', 12);
	const t = L.addText(50, 50, null);
	L.setProp(t, 'text', 'Pump house');
	L.buildDom();
	return { r: r, a: a, b: b, ra: ra.id, ab: ab.id, t: t.id };
}

// ---- 1. the ID lookup: EPANET's Map Finder -----------------------------------------------------
{
	console.log('\n--- find by ID ---');
	const n = build('us');
	ok('an exact ID finds exactly one element',
		same(L.find('all', 'id', 'equals', n.a), ['node:' + n.a]), JSON.stringify(L.find('all', 'id', 'equals', n.a)));
	ok('...and it is case-insensitive', same(L.find('all', 'id', 'equals', n.a.toLowerCase()), ['node:' + n.a]));
	ok('a partial ID finds every element containing it',
		L.find('all', 'id', 'contains', 'J').length === 2, JSON.stringify(L.find('all', 'id', 'contains', 'J')));
	ok('an ID nobody has finds nothing', L.find('all', 'id', 'equals', 'J999').length === 0);
	ok('an empty box finds nothing rather than everything', L.find('all', 'id', 'contains', '   ').length === 0);
	ok('a scope narrows the search to one kind',
		same(L.find('pipe', 'id', 'contains', ''.concat(n.ra[0])), ['link:' + n.ra, 'link:' + n.ab]) ||
		L.find('pipe', 'id', 'contains', 'L').length === 2,
		JSON.stringify(L.find('pipe', 'id', 'contains', 'L')));
	ok('...and a junction scope never returns the reservoir',
		L.find('junction', 'id', 'contains', '').length === 0 &&
		L.find('junction', 'id', 'contains', 'R').length === 0);
	ok('the adjacent links of a found node are the ones drawn there',
		same(L.adjacent(n.a), [n.ra, n.ab]), JSON.stringify(L.adjacent(n.a)));
}

// ---- 2. the condition: Task 353 ----------------------------------------------------------------
// **THE NUMBER IS THE ONE ON THE DRAWING.** Diameters are typed in the DISPLAY unit (inches under
// us, millimetres under si), so the same query "greater than 8" means different pipes in the two
// unit sets -- and that is the correct behaviour, not a defect: 8 means what the user can read.
{
	console.log('\n--- find by a condition on a value ---');
	const n = build('us');
	ok('greater-than returns only the pipes above the number',
		same(L.find('pipe', 'diameter', 'gt', '8'), ['link:' + n.ab]), JSON.stringify(L.find('pipe', 'diameter', 'gt', '8')));
	ok('less-than returns only the pipes below it',
		same(L.find('pipe', 'diameter', 'lt', '8'), ['link:' + n.ra]));
	ok('equals matches the typed diameter exactly',
		same(L.find('pipe', 'diameter', 'equals', '12'), ['link:' + n.ab]));
	ok('a bound nothing crosses returns nothing', L.find('pipe', 'diameter', 'gt', '99').length === 0);
	// STRICT, both ways: "greater than 12" excludes the 12-inch pipe. An inclusive comparison would
	// pass every test above and be wrong on exactly the number the user typed.
	ok('greater-than excludes the value itself', L.find('pipe', 'diameter', 'gt', '12').length === 0);
	ok('less-than excludes the value itself', L.find('pipe', 'diameter', 'lt', '6').length === 0);
	ok('a non-numeric value in a numeric condition matches nothing rather than throwing',
		L.find('pipe', 'diameter', 'gt', 'wide').length === 0);

	// The unit half of the same assertion, on the same numbers: 6 and 12 MILLIMETRES are both under
	// 8 inches, and both are still read as 6 and 12 because a stored number is what the user typed.
	const m = build('si');
	ok('under SI the same typed diameters answer the same query the same way',
		same(L.find('pipe', 'diameter', 'gt', '8'), ['link:' + m.ab]) &&
		same(L.find('pipe', 'diameter', 'lt', '8'), ['link:' + m.ra]),
		JSON.stringify(L.find('pipe', 'diameter', 'gt', '8')));
}

// ---- 3. text labels ----------------------------------------------------------------------------
{
	console.log('\n--- find a Text label by its words ---');
	const n = build('us');
	ok('a Text label is found by the words in it',
		same(L.find('text', 'text', 'contains', 'pump'), ['label:' + n.t]), JSON.stringify(L.find('text', 'text', 'contains', 'pump')));
	ok('...and not by words it does not contain', L.find('text', 'text', 'contains', 'valve vault').length === 0);
	ok('a Text label is still findable by ID from the all-elements scope',
		same(L.find('all', 'id', 'equals', n.t), ['label:' + n.t]));
}

// ---- 4. the pull-downs cannot leave an impossible query behind ----------------------------------
{
	console.log('\n--- the property and condition lists follow the scope ---');
	build('us');
	ok('a node scope offers the node fields', L.propKeys('junction').indexOf('pressure') > 0);
	ok('...and not the link fields', L.propKeys('junction').indexOf('velocity') < 0);
	ok('a link scope offers the link fields',
		L.propKeys('pipe').indexOf('diameter') > 0 && L.propKeys('pipe').indexOf('pressure') < 0);
	ok('the all-elements scope offers ID alone, the only property every kind has',
		JSON.stringify(L.propKeys('all')) === JSON.stringify(['id']));
	ok('a Text scope offers its words', L.propKeys('text').indexOf('text') > 0);
	ok('a text property gets contains/equals and no number comparisons',
		JSON.stringify(L.opKeys('all', 'id')) === JSON.stringify(['contains', 'equals']));
	ok('a numeric property gets the number comparisons and no "contains"',
		JSON.stringify(L.opKeys('pipe', 'diameter')) === JSON.stringify(['equals', 'gt', 'lt']));

	// The normalization itself, which is what the pull-downs call. A property the new scope does not
	// have, and an operator the new property does not have, both have to go.
	ok('changing scope drops a property the new scope does not have',
		L.normalize('pipe', 'pressure', 'gt') === 'id/contains', L.normalize('pipe', 'pressure', 'gt'));
	ok('changing to a text property drops a number comparison',
		L.normalize('all', 'id', 'lt') === 'id/contains', L.normalize('all', 'id', 'lt'));
	ok('a query the new scope CAN answer is left alone',
		L.normalize('pipe', 'diameter', 'lt') === 'diameter/lt');
}

// ---- 5. going to a result: it selects, it pans, and it does NOT zoom ----------------------------
{
	console.log('\n--- going to a result ---');
	const n = build('us');
	L.setView({ cx: 0, cy: 0, s: 2 });
	const before = L.view();
	L.goTo('node', n.b);
	const after = L.view();
	ok('the found element becomes the selection',
		JSON.stringify(L.selectedRef()) === JSON.stringify({ kind: 'node', id: n.b }), JSON.stringify(L.selectedRef()));
	ok('the map centres on it', Math.abs(after.cx - 200) < 1e-6 && Math.abs(after.cy - 0) < 1e-6,
		after.cx + ',' + after.cy);
	ok('the ZOOM is left exactly as the user set it', after.s === before.s, before.s + ' -> ' + after.s);

	// A link has no point of its own; the midpoint of its ends is what puts it on screen.
	L.goTo('link', n.ab);
	ok('going to a pipe centres between its ends', Math.abs(L.view().cx - 150) < 1e-6, String(L.view().cx));

	// 2 above: a row must re-resolve by ID. Delete the element, then click the row that named it.
	const stale = L.view();
	L.deleteElement('node', n.b);
	L.goTo('node', n.b);
	ok('a result whose element is gone moves nothing and selects nothing',
		L.view().cx === stale.cx && L.view().cy === stale.cy &&
		JSON.stringify(L.selectedRef()) !== JSON.stringify({ kind: 'node', id: n.b }),
		JSON.stringify(L.selectedRef()));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

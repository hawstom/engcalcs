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
	// The words, not the ids -- what a Text result actually shows.
	"\t\tfindText: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return effective(c.el, 'text'); });\n" +
	"\t\t},\n" +
	"\t\tnormalize: function (scope, prop, op) { findState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\tfindNormalize(); return findState.prop + '/' + findState.op; },\n" +
	"\t\tpropKeys: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[0]; }); },\n" +
	"\t\topKeys: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[0]; }); },\n" +
	"\t\tgoTo: findGoTo, selectedRef: selectedRef,\n" +
	"\t\tcontextLength: function (group, id) { var e = group === 'node' ? nodeById(id) : linkById(id);\n" +
	"\t\t\treturn findContextLength(group, e); },\n" +

	"\t\tadjacent: function (id) { return incidentLinks[id] || []; },\n" +
	// THE PANEL ITSELF -- built by the page's own rebuildFindForm() into the real
	// #lpn_find_form, so what is read below is the markup a visitor gets, not a re-implementation
	// of it. Task 540's query line and its report are asserted through these.
	"\t\tbuildPanel: function () { rebuildFindForm(); },\n" +
	"\t\tpressFind: function () { runFind(); },\n" +
	"\t\tformBox: function () { return document.getElementById('lpn_find_form'); },\n" +
	"\t\tresultsBox: function () { return document.getElementById('lpn_find_results'); },\n" +
	// The solver's OWN structural verdict, so the report can be checked against it rather than
	// against itself.
	"\t\tdiagnose: function () { return EngCalcs.lpnDiagnose(assembleModel()); },\n" +
	"\t\tsetState: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\t\tfindState.value = value === undefined ? '' : value; findNormalize(); },\n" +
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
	// **AN EMPTY BOX IS EVERY ELEMENT, NOT NONE** (Tom, 2026-08-18). It is how "what valves are in
	// this network?" is asked: choose the scope and press Find. The old notice answered a question
	// nobody had.
	ok('an empty box with "contains" finds everything that has that property',
		L.find('all', 'id', 'contains', '   ').length === L.find('all', 'id', 'contains', '').length &&
		L.find('all', 'id', 'contains', '').length > 0,
		String(L.find('all', 'id', 'contains', '').length));
	ok('...and a Text label is still left out of an ID search',
		L.find('all', 'id', 'contains', '').every(function (x) { return x.indexOf('label:') !== 0; }),
		JSON.stringify(L.find('all', 'id', 'contains', '')));
	ok('a scope narrows the search to one kind',
		same(L.find('pipe', 'id', 'contains', ''.concat(n.ra[0])), ['link:' + n.ra, 'link:' + n.ab]) ||
		L.find('pipe', 'id', 'contains', 'L').length === 2,
		JSON.stringify(L.find('pipe', 'id', 'contains', 'L')));
	ok('...and a junction scope never returns the reservoir',
		L.find('junction', 'id', 'contains', 'R').length === 0);
	ok('an empty search inside one scope returns that scope, and only it',
		L.find('junction', 'id', 'contains', '').length === 2, JSON.stringify(L.find('junction', 'id', 'contains', '')));
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
	// **AND NOT BY ID, EVER** (Tom, 2026-08-18). A text element's ID is unreachable from every screen
	// in this app, so a search on it can only be operated by guessing -- and a result naming one
	// tells the user something they have no way to look up.
	ok('a Text label is NOT findable by an id nobody can see',
		L.find('all', 'id', 'equals', n.t).length === 0, JSON.stringify(L.find('all', 'id', 'equals', n.t)));
	ok('...and an ID search never turns one up, whatever is typed',
		L.find('all', 'id', 'contains', 'X').length === 0, JSON.stringify(L.find('all', 'id', 'contains', 'X')));
}

// ---- 4. the pull-downs cannot leave an impossible query behind ----------------------------------
{
	console.log('\n--- the property and condition lists follow the scope ---');
	build('us');
	ok('a node scope offers the node fields', L.propKeys('junction').indexOf('pressure') > 0);
	ok('...and not the link fields', L.propKeys('junction').indexOf('velocity') < 0);
	ok('a link scope offers the link fields',
		L.propKeys('pipe').indexOf('diameter') > 0 && L.propKeys('pipe').indexOf('pressure') < 0);
	// LENGTH is searchable although it is not colourable: EPANET's View menu has no length in it
	// because nobody colours a network by one, but "which pipes are longer than 500 ft" is a
	// question people actually ask. Searching and colouring are different questions.
	ok('...including the inputs a colour ramp has no use for',
		L.propKeys('pipe').indexOf('length') > 0 && L.propKeys('pipe').indexOf('km') > 0,
		JSON.stringify(L.propKeys('pipe')));
	// ID plus Connection, and nothing else. ID is the only property a junction, a pipe and a Text
	// label all carry; Connection is the Task 540 exception, and it earns it by matching every NODE
	// and saying so in each row rather than silently matching nothing.
	ok('the all-elements scope offers ID and the connection report, and nothing else',
		JSON.stringify(L.propKeys('all')) === JSON.stringify(['id', 'connection']),
		JSON.stringify(L.propKeys('all')));
	ok('a Text scope offers its words', L.propKeys('text').indexOf('text') > 0);
	ok('a text property gets contains/equals and no number comparisons',
		JSON.stringify(L.opKeys('all', 'id')) === JSON.stringify(['contains', 'equals']));
	ok('a numeric property gets the number comparisons and no "contains"',
		JSON.stringify(L.opKeys('pipe', 'diameter')) === JSON.stringify(['equals', 'gt', 'lt', 'top', 'bottom']),
		JSON.stringify(L.opKeys('pipe', 'diameter')));
	ok('...including Top n and Bottom n, which are conditions and not a second input',
		L.opKeys('pipe', 'diameter').indexOf('top') > 0 && L.opKeys('pipe', 'diameter').indexOf('bottom') > 0);
	ok('a text property has no extremes -- there is no end to a list of words',
		L.opKeys('all', 'id').indexOf('top') < 0, JSON.stringify(L.opKeys('all', 'id')));
	ok('a Text label can be searched by its SIZE as well as its words',
		L.propKeys('text').indexOf('sizeMult') > 0, JSON.stringify(L.propKeys('text')));

	// The normalization itself, which is what the pull-downs call. A property the new scope does not
	// have, and an operator the new property does not have, both have to go.
	ok('changing scope drops a property the new scope does not have',
		L.normalize('pipe', 'pressure', 'gt') === 'id/contains', L.normalize('pipe', 'pressure', 'gt'));
	ok('changing to a text property drops a number comparison',
		L.normalize('all', 'id', 'lt') === 'id/contains', L.normalize('all', 'id', 'lt'));
	ok('a query the new scope CAN answer is left alone',
		L.normalize('pipe', 'diameter', 'lt') === 'diameter/lt');
}

// ---- 4b. the most interesting answer is at the top ----------------------------------------------
// A range query has an interesting end and a dull one, and the CONDITION says which: "greater than"
// is a question about the biggest, "less than" about the smallest. Sorted the other way, the first
// row is the pipe nearest the threshold -- the least remarkable member of the set.
{
	console.log('\n--- the order of the answers ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	let prev = r;
	const sizes = [4, 18, 6, 12, 8];
	const ids = sizes.map((d, i) => {
		const n = L.addNode('junction', 100 * (i + 1), 0).id;
		const l = L.addLink('pipe', prev, n);
		L.setProp(l, 'diameter', d);
		prev = n;
		return l.id;
	});
	L.buildDom();
	const desc = L.find('pipe', 'diameter', 'gt', '0');
	ok('greater-than lists the LARGEST first',
		desc[0] === 'link:' + ids[sizes.indexOf(18)], JSON.stringify(desc));
	ok('...and the smallest last',
		desc[desc.length - 1] === 'link:' + ids[sizes.indexOf(4)], JSON.stringify(desc));
	const asc = L.find('pipe', 'diameter', 'lt', '99');
	ok('less-than lists the SMALLEST first',
		asc[0] === 'link:' + ids[sizes.indexOf(4)], JSON.stringify(asc));
	ok('...and the largest last',
		asc[asc.length - 1] === 'link:' + ids[sizes.indexOf(18)], JSON.stringify(asc));
	// A text query has no range, so it keeps the order a person scans a list in.
	const byId = L.find('pipe', 'id', 'contains', 'L');
	ok('a text search keeps ID order', JSON.stringify(byId) === JSON.stringify(byId.slice().sort()),
		JSON.stringify(byId));
	// Repeating a search must give the same order -- an unstable sort reads as an unreliable tool.
	ok('the same search twice gives the same order',
		JSON.stringify(L.find('pipe', 'diameter', 'gt', '0')) === JSON.stringify(desc));
}

// ---- 4c. Top n and Bottom n -----------------------------------------------------------------------
// The Value box holds HOW MANY, so these need no second control -- and they need no value to match
// against either, because they rank what is there rather than filtering it.
{
	console.log('\n--- the extremes ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	let prev = r;
	const sizes = [4, 18, 6, 12, 8];
	const ids = sizes.map((d, i) => {
		const n = L.addNode('junction', 100 * (i + 1), 0).id;
		const l = L.addLink('pipe', prev, n);
		L.setProp(l, 'diameter', d);
		prev = n;
		return l.id;
	});
	L.buildDom();
	const top2 = L.find('pipe', 'diameter', 'top', '2');
	ok('Top 2 returns two pipes', top2.length === 2, JSON.stringify(top2));
	ok('...the two biggest, biggest first',
		JSON.stringify(top2) === JSON.stringify(['link:' + ids[sizes.indexOf(18)], 'link:' + ids[sizes.indexOf(12)]]),
		JSON.stringify(top2));
	const bot2 = L.find('pipe', 'diameter', 'bottom', '2');
	ok('...and Bottom 2 the two smallest, smallest first',
		JSON.stringify(bot2) === JSON.stringify(['link:' + ids[sizes.indexOf(4)], 'link:' + ids[sizes.indexOf(6)]]),
		JSON.stringify(bot2));
	ok('an empty count means ten, not none', L.find('pipe', 'diameter', 'top', '').length === 5,
		String(L.find('pipe', 'diameter', 'top', '').length));
	ok('...and so does a nonsense one', L.find('pipe', 'diameter', 'top', 'lots').length === 5);
	ok('asking for more than there are returns them all',
		L.find('pipe', 'diameter', 'top', '99').length === 5);
}

// ---- 4d. a text search reads alphabetically --------------------------------------------------------
// Tom, 2026-08-18. For an ID search the string and the id are the same, so this only shows on a Text
// label -- whose id the user cannot see at all, which is why ordering by it looked like no order.
{
	console.log('\n--- alphabetical ---');
	L.reset();
	L.setCanvas(800, 600);
	// Deliberately created in an order that is NOT alphabetical, so an id-ordered list and a
	// text-ordered one differ.
	['Zone valve', 'Air release', 'Meter pit'].forEach(function (w, i) {
		const t = L.addText(10 * (i + 1), 10, null);
		L.setProp(t, 'text', w);
		if (i === 0) { t.sizeMult = 3; } else { t.sizeMult = 1 + i * 0.5; }
	});
	L.buildDom();
	const words = L.findText('text', 'text', 'contains', 'e');
	ok('a text search comes back in alphabetical order of the words',
		JSON.stringify(words) === JSON.stringify(['Air release', 'Meter pit', 'Zone valve']),
		JSON.stringify(words));
	// Size, with the same conditions as any other range value.
	const biggest = L.findText('text', 'sizeMult', 'top', '1');
	ok('Top 1 by size finds the biggest label', JSON.stringify(biggest) === JSON.stringify(['Zone valve']),
		JSON.stringify(biggest));
	// Sizes are 3, 1.5 and 2, so this threshold has to separate them rather than pass everything --
	// and the answer comes back BIGGEST first, because "greater than" is a question about the big end.
	ok('...and a range condition works on size too, biggest first',
		JSON.stringify(L.findText('text', 'sizeMult', 'gt', '1.9')) ===
			JSON.stringify(['Zone valve', 'Meter pit']),
		JSON.stringify(L.findText('text', 'sizeMult', 'gt', '1.9')));
}

// ---- 5. going to a result: it selects, it pans, and it zooms to a MINIMUM ------------------------
{
	console.log('\n--- going to a result ---');
	const n = build('us');
	// FAR OUT: the node's neighbourhood is 200 world units across, so at s = 0.2 it is 40 px on
	// screen -- the dot case.
	L.setView({ cx: 0, cy: 0, s: 0.2 });
	const before = L.view();
	L.goTo('node', n.b);
	const after = L.view();
	ok('the found element becomes the selection',
		JSON.stringify(L.selectedRef()) === JSON.stringify({ kind: 'node', id: n.b }), JSON.stringify(L.selectedRef()));
	ok('the map centres on it', Math.abs(after.cx - 200) < 1e-6 && Math.abs(after.cy - 0) < 1e-6,
		after.cx + ',' + after.cy);
	// **A MINIMUM APPARENT SIZE, NOT A CHOSEN ZOOM** (Tom, 2026-08-18). Arriving at a node from
	// across a large network used to show a dot: the pan was right and the scale was whatever it
	// had been. The floor is twice the average distance to the node's own linked nodes, so the node
	// lands in the middle of its own neighbourhood.
	ok('a far-out view is zoomed IN so the result is not a dot', after.s > before.s,
		before.s + ' -> ' + after.s);
	// **THE EXPECTED NUMBER IS COMPUTED FROM THE GEOMETRY, NOT FROM THE FUNCTION UNDER TEST.** J2's
	// one pipe reaches 100 units to J1, so "twice the average distance to its linked nodes" is 200 --
	// stated here as a constant. Asking findContextLength() for it and then asserting against its own
	// answer is a harness agreeing with any mistake, and it let a dropped factor of 2 pass.
	ok('the neighbourhood is twice the average reach of the node\'s own pipes',
		L.contextLength('node', n.b) === 200, String(L.contextLength('node', n.b)));
	ok('...and it is framed to half the shorter side of the window',
		Math.abs(after.s * 200 - 300) < 1e-6, (after.s * 200).toFixed(1) + ' px of 600');
	// **AND IT NEVER ZOOMS OUT.** Somebody already looking closely has set that zoom deliberately;
	// pulling them back to frame a result they can already see would be the tool overruling them.
	L.setView({ cx: 0, cy: 0, s: 8 });
	L.goTo('node', n.b);
	ok('a close view is left exactly as the user set it', L.view().s === 8, String(L.view().s));
	// A node with no links has no neighbourhood to frame, so there is no floor to apply -- inventing
	// a distance for it would be a made-up number deciding the view.
	const lone = L.addNode('junction', 900, 900).id;
	L.buildDom();
	L.setView({ cx: 0, cy: 0, s: 0.2 });
	L.goTo('node', lone);
	ok('a node with no pipes leaves the zoom alone rather than inventing a distance',
		L.view().s === 0.2, String(L.view().s));

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

// ---- 6. THE DISCONNECTED REPORT: three faults, never one word (ROADMAP Task 540) ---------------
//
// EngCalcs.lpnDiagnose() already walks this network and calls all three 'unreachable', which is the
// right answer to "can this be solved?" and useless as a report. The panel splits that one list in
// three, so the assertions below are (a) each kind on its own and (b) that the three together are
// exactly what the solver refuses -- if they ever stop adding up, the panel has started answering a
// different question from the one the solve asks.
function walk(el, fn) {
	(el.children || []).forEach(function (c) { fn(c); walk(c, fn); });
}
function panelLines(box) {
	var out = [];
	walk(box, function (el) { if (!(el.children || []).length) { out.push(el.textContent); } });
	return out;
}
{
	console.log('\n--- the disconnected report ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	// A fed chain, a branch behind a closed link, an island with no source, and a node nothing
	// meets. One drawing holding all three faults at once, which is also the only way to prove they
	// are told apart rather than merely counted.
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	const b = L.addNode('junction', 200, 0).id;
	const c = L.addNode('junction', 300, 0).id;
	L.addLink('pipe', r, a);
	L.addLink('pipe', a, b);
	const shut = L.addLink('pipe', b, c);
	L.setProp(shut, 'status', 'closed');
	const d = L.addNode('junction', 400, 400).id;
	const e = L.addNode('junction', 500, 400).id;
	L.addLink('pipe', d, e);
	const lone = L.addNode('junction', 600, 600).id;
	L.buildDom();

	ok('a node nothing meets is reported as having no links',
		same(L.find('all', 'connection', 'conn-unlinked', ''), ['node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-unlinked', '')));
	// **THE DISTINCTION IS THE WHOLE POINT.** C is joined to the network by a pipe that exists; it
	// is the CLOSURE that cuts it off. Reporting it as "no links" would send somebody hunting for a
	// missing pipe that is right there on the map.
	ok('a node behind a closed link is reported, and separately',
		same(L.find('all', 'connection', 'conn-closed', ''), ['node:' + c]),
		JSON.stringify(L.find('all', 'connection', 'conn-closed', '')));
	ok('an island with open pipes and no source is its own kind again',
		same(L.find('all', 'connection', 'conn-nosource', ''), ['node:' + d, 'node:' + e]),
		JSON.stringify(L.find('all', 'connection', 'conn-nosource', '')));
	ok('"is broken" is all three at once, and nothing else',
		same(L.find('all', 'connection', 'conn-any', ''),
			['node:' + c, 'node:' + d, 'node:' + e, 'node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-any', '')));
	ok('...and the fed nodes are in none of them',
		L.find('all', 'connection', 'conn-any', '').indexOf('node:' + a) < 0 &&
		L.find('all', 'connection', 'conn-any', '').indexOf('node:' + r) < 0);
	// The union check: the three kinds together ARE lpnDiagnose's one 'unreachable' list. This is
	// what keeps the report honest -- a split that drifted from the solver's own walk would report
	// nodes the solve is happy with, or miss the ones it refuses.
	const unreachable = (L.diagnose().filter(function (i) { return i.code === 'unreachable'; })[0] || { ids: [] }).ids;
	ok('the three kinds together are exactly what the solver calls unreachable',
		same(unreachable, [c, d, e, lone]), JSON.stringify(unreachable));
	// A pipe has no connection state of its own; a link that goes nowhere is lpnDiagnose's
	// dangling-link, a fault of the LINK, and is reported elsewhere.
	ok('the report returns nodes only, whatever the scope says',
		L.find('all', 'connection', 'conn-any', '').every(function (x) { return x.indexOf('node:') === 0; }));
	// The row has to say WHICH fault, or the three kinds are separated in the code and merged again
	// on screen.
	L.setState('all', 'connection', 'conn-any', '');
	L.pressFind();
	const rows = panelLines(L.resultsBox()).join(' | ');
	ok('each row names the fault it found beside the node',
		rows.indexOf('No links') >= 0 && rows.indexOf('Behind closed links') >= 0 &&
		rows.indexOf('No path to a source') >= 0, rows);

	// A whole network, cleanly fed: the answer is none, and "none" is the good news the report was
	// run for.
	L.reset();
	L.setCanvas(800, 600);
	const r2 = L.addNode('reservoir', 0, 0).id;
	const a2 = L.addNode('junction', 100, 0).id;
	const b2 = L.addNode('junction', 200, 0).id;
	L.addLink('pipe', r2, a2); L.addLink('pipe', a2, b2); L.addLink('pipe', b2, r2);
	L.buildDom();
	ok('a fully connected network reports nothing at all',
		L.find('all', 'connection', 'conn-any', '').length === 0,
		JSON.stringify(L.find('all', 'connection', 'conn-any', '')));
	L.setState('all', 'connection', 'conn-any', '');
	L.pressFind();
	ok('...and says so in the panel rather than leaving a blank box',
		panelLines(L.resultsBox()).join(' ').indexOf('Every node is connected.') >= 0,
		JSON.stringify(panelLines(L.resultsBox())));

	// **WITH NO RESERVOIR AND NO TANK, TWO OF THE THREE QUESTIONS HAVE NO ANSWER.** Calling every
	// node source-less would be true and useless: it is one fault of the network, not N faults of
	// the nodes, and lpnDiagnose says it already as 'no-fixed-head'. So they go unjudged, only "no
	// links" is answered, and the panel says why.
	L.reset();
	L.setCanvas(800, 600);
	const p1 = L.addNode('junction', 0, 0).id;
	const p2 = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', p1, p2);
	const p3 = L.addNode('junction', 300, 300).id;
	L.buildDom();
	ok('with no source, only the no-links kind is reported',
		same(L.find('all', 'connection', 'conn-any', ''), ['node:' + p3]),
		JSON.stringify(L.find('all', 'connection', 'conn-any', '')));
	L.setState('all', 'connection', 'conn-any', '');
	L.pressFind();
	ok('...and the panel says which questions it could not ask',
		panelLines(L.resultsBox()).join(' ').indexOf('no reservoir or tank') >= 0,
		JSON.stringify(panelLines(L.resultsBox())));
}

// ---- 7. THE QUERY, WRITTEN OUT AS ONE LINE (ROADMAP Task 540, phase 1) -------------------------
//
// Read out of the REAL panel: rebuildFindForm() builds it into #lpn_find_form, and the line under
// test is the div a visitor sees above the Find button. Phase 1 is read-only on purpose, so there
// is one further assertion at the end -- the panel offers no input to type it into.
{
	console.log('\n--- the query line ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', r, a);
	L.buildDom();
	function line() {
		let out = null;
		walk(L.formBox(), function (el) { if (el.className === 'lpn-find-query') { out = el.textContent; } });
		return out;
	}
	function lineFor(scope, prop, op, value) { L.setState(scope, prop, op, value); L.buildPanel(); return line(); }

	ok('an ID search reads as the scope, the property, the condition and the quoted text',
		lineFor('all', 'id', 'contains', '223') === "Everything.ID contains '223'", JSON.stringify(line()));
	ok('a numeric condition prints the number bare',
		lineFor('pipe', 'diameter', 'gt', '8') === 'Pipe.Diameter greater than 8', JSON.stringify(line()));
	// "Highest n" names a control, not a comparison, so the line says the word and the count the
	// search will ACTUALLY use -- ten, when the box is empty.
	ok('an extremes condition prints the count it will really use',
		lineFor('pipe', 'velocity', 'top', '') === 'Pipe.Velocity highest 10', JSON.stringify(line()));
	ok('...and the typed count when there is one',
		lineFor('pipe', 'velocity', 'bottom', '3') === 'Pipe.Velocity lowest 3', JSON.stringify(line()));
	ok('a connection condition is the whole sentence, with no value',
		lineFor('junction', 'connection', 'conn-unlinked', '') === 'Junction.Connection has no links',
		JSON.stringify(line()));
	// An empty box with "contains" matches everything, and the quotes are what make that readable
	// rather than a sentence that stops in the middle.
	ok('an empty text value reads as the empty string it is matched as',
		lineFor('all', 'id', 'contains', '') === "Everything.ID contains ''", JSON.stringify(line()));

	// **THE PULL-DOWN IS STILL THE WAY IN.** Changing the real select rewrites the line, which is
	// the whole teaching mechanism: a person operates the control and watches the sentence change.
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();
	const selects = [];
	walk(L.formBox(), function (el) { if (el._tag === 'select') { selects.push(el); } });
	ok('the panel still has its three pull-downs', selects.length >= 3, String(selects.length));
	selects[2].value = 'lt';
	(selects[2]._listeners.change || []).forEach(function (f) { f({}); });
	ok('changing the condition pull-down rewrites the line at once',
		line() === 'Pipe.Diameter less than 8', JSON.stringify(line()));

	// **PHASE 1 IS READ-ONLY** and that has to be asserted, not merely intended: the one input on
	// this panel is the Value box the search has always had. A second one would be a grammar and a
	// parser nobody has designed yet.
	let queryEl = null;
	walk(L.formBox(), function (el) { if (el.className === 'lpn-find-query') { queryEl = el; } });
	ok('the query line is printed, not typed into: it is a div and holds no control',
		!!queryEl && queryEl._tag === 'div' && (queryEl.children || []).length === 0 &&
		String(queryEl.textContent).length > 0,
		queryEl ? queryEl._tag + '/' + (queryEl.children || []).length : 'missing');
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

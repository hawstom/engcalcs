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
const fs = require('fs');
const ROOT = require('path').join(__dirname, '../../');

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
	"\t\topLabels: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[1]; }); },\n" +
	"\t\tgoTo: findGoTo, selectedRef: selectedRef,\n" +
	"\t\tcontextLength: function (group, id) { var e = group === 'node' ? nodeById(id) : linkById(id);\n" +
	"\t\t\treturn findContextLength(group, e); },\n" +

	"\t\tadjacent: function (id) { return incidentLinks[id] || []; },\n" +
	// THE PANEL ITSELF -- built by the page's own rebuildFindForm() into the real
	// #lpn_find_form, so what is read below is the markup a visitor gets, not a re-implementation
	// of it. Task 540's query line and its report are asserted through these.
	"\t\tbuildPanel: function () { rebuildFindForm(); },\n" +
	"\t\tpressFind: function () { runFind(); },\n" +
	// Phase 2: the query INPUT. Driven exactly as a person drives it -- the real element, the real
	// `input` event, the real listener -- so nothing here can pass by calling the parser directly
	// while the panel is wired to something else.
	"\t\tqueryEl: function () { return findQueryInput; },\n" +
	"\t\tqueryText: function () { return findQueryInput ? findQueryInput.value : null; },\n" +
	"\t\ttype: function (text) { findQueryInput.value = text;\n" +
	"\t\t\t(findQueryInput._listeners.input || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tcontrolsShown: function () { return findControlsShown(); },\n" +
	// Task 580: the box is a VIEW of the project, so a harness has to be able to OPEN it (the
	// repaint is a no-op while it is closed) and then change the document under it.
	"\t\tsetPopupOpen: function (on) {\n" +
	"\t\t\tdocument.getElementById('lpn_find_popup').style.display = on ? 'block' : 'none'; },\n" +
	"\t\tsetQualityMode: function (m) { settings.quality = { mode: m, traceNode: '' }; },\n" +
	// Task: the box's own corner and size, remembered per browser (Tom, 2026-09-04).
	"\t\tsetLayout: function (pos, size) { findUserPos = pos; findUserSize = size; },\n" +
	"\t\tgetLayout: function () { return { pos: findUserPos, size: findUserSize }; },\n" +
	"\t\tsaveLayout: saveFindLayout, loadLayout: loadFindLayout,\n" +
	"\t\tlayoutKey: function () { return LPN_FINDBOX_KEY; },\n" +
	"\t\trebuildSettings: function () { rebuildSettingsBox(); },\n" +
	// The options of the RENDERED property pull-down, read out of the markup the panel built --
	// not out of findPropDefs(), which would answer correctly whether or not the box was repainted.
	"\t\trenderedProps: function () { var out = null, n = 0;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (c._tag === 'select') { n++; if (n === 2) { out = (c.children || []).map(function (o) { return o.value; }); } }\n" +
	"\t\t\t\twalk(c); }); })(findControlsBox);\n" +
	"\t\t\treturn out; },\n" +
	// The pull-downs of the QUERY, not of the Replace form under it -- which has one of its own and
	// stays put.
	"\t\tcontrolSelects: function () { var n = 0;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) { if (c._tag === 'select') { n++; } walk(c); }); })(findControlsBox);\n" +
	"\t\t\treturn n; },\n" +
	"\t\tqueryState: function () { return { ast: findQueryAst, error: findQueryError }; },\n" +
	"\t\tresults: function () { return findResults.map(function (c) { return c.group + ':' + c.el.id; }); },\n" +
	// One word at a time, so a test can put the panel into another language without a second lang
	// file. Restoring is the caller's job.
	"\t\tsetWord: function (key, value) { EngCalcs.pageConfig[key] = value; },\n" +
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
	// ID, Tag and Connection, and nothing else. ID is the only property a junction, a pipe and a
	// Text label all carry; a Tag is carried by every node and every link (Tom, 2026-09-05), which
	// is the same standing ID has here; Connection is the Task 540 exception, and it earns it by
	// matching every NODE and saying so in each row rather than silently matching nothing.
	// The tag's own coverage is dev/lpn-spike/find-tag-harness.js.
	ok('the all-elements scope offers ID, Tag and the connection report, and nothing else',
		JSON.stringify(L.propKeys('all')) === JSON.stringify(['id', 'tag', 'connection']),
		JSON.stringify(L.propKeys('all')));
	// **AND NO ID, SINCE 2026-08-29.** Tom: *"Text.ID 2 highest finds nothing. And I think maybe
	// Text.ID is not searchable."* It never was — findValueOf() returns undefined for a label's id
	// by design, because a Text's id is unreachable from every screen — but the property list
	// offered it anyway, so the menu carried a condition that could not match in any wording. The
	// assertion here used `indexOf('text') > 0`, which was quietly ASSERTING that something came
	// before it; that something was the id.
	ok('a Text scope offers its words and its size, and no ID it cannot search',
		JSON.stringify(L.propKeys('text')) === JSON.stringify(['text', 'sizeMult']),
		JSON.stringify(L.propKeys('text')));
	ok('a text property gets contains/equals and no number comparisons',
		JSON.stringify(L.opKeys('all', 'id')) === JSON.stringify(['contains', 'equals', 'top', 'bottom']),
		JSON.stringify(L.opKeys('all', 'id')));
	ok('a numeric property gets the number comparisons and no "contains"',
		JSON.stringify(L.opKeys('pipe', 'diameter')) === JSON.stringify(['equals', 'gt', 'lt', 'top', 'bottom']),
		JSON.stringify(L.opKeys('pipe', 'diameter')));
	// **THE EXTREMES ARE A STANDARD CONDITION ON EVERYTHING WITH AN ORDER** (Tom, 2026-08-26:
	// *"it should be a standard condition, but it's not"*). They were numbers-only, which is what
	// made them read as a special mode. On text they rank alphabetically.
	ok('...and the extremes are offered on a NUMBER and on TEXT alike',
		L.opKeys('pipe', 'diameter').indexOf('top') > 0 && L.opKeys('all', 'id').indexOf('top') > 0 &&
		L.opKeys('text', 'text').indexOf('bottom') > 0,
		JSON.stringify(L.opKeys('text', 'text')));
	// Connection is not an exception to that rule: its values are four conditions, not a value
	// with an order, so there is no end of the list to take.
	ok('...but NOT on Connection, whose values are conditions rather than an ordered value',
		L.opKeys('junction', 'connection').indexOf('top') < 0,
		JSON.stringify(L.opKeys('junction', 'connection')));
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
	// **F EXISTS TO EXERCISE THE FOURTH CONDITION AS A NARROWEST LABEL.** Without it nothing in this
	// drawing is cut off ONLY by somebody else's closed valve: c itself has no open link, so it is
	// caught by the narrower "no open links". f hangs off c on an open pipe, so its own links are
	// fine, a pipe route home exists, and the closure is the only thing in the way.
	const f = L.addNode('junction', 350, 60).id;
	L.addLink('pipe', c, f);
	// **AND g EXERCISES "no open links" AS A NARROWEST LABEL**, which c cannot once f hangs off it
	// on an open pipe. g's single link is shut, so its own connection is the fault -- a LOCAL fact,
	// and the one Tom's original question was about.
	const g = L.addNode('junction', 100, 120).id;
	const shut2 = L.addLink('pipe', a, g);
	L.setProp(shut2, 'status', 'closed');
	L.buildDom();

	// **THE FOUR NEST** (Tom, 2026-08-26). Each condition is its own predicate; a node matches
	// every one that is true of it, and the lists below overlap on purpose.
	ok('"no links" is the node nothing meets',
		same(L.find('all', 'connection', 'conn-unlinked', ''), ['node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-unlinked', '')));
	// **THE DISTINCTION IS THE WHOLE POINT.** c is joined to the network by a pipe that exists; it
	// is the CLOSURE that cuts it off. Reporting it as "no links" would send somebody hunting for a
	// missing pipe that is right there on the map. And "no open links" is LOCAL -- it is about c's
	// own pipe, not about anything downstream.
	ok('"no open links" holds the node whose own links are all shut -- and the lone node too',
		same(L.find('all', 'connection', 'conn-noopen', ''), ['node:' + g, 'node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-noopen', '')));
	ok('"no link to a source" is the island and the lone node, and NOT the node behind the valve',
		same(L.find('all', 'connection', 'conn-nolinksource', ''),
			['node:' + d, 'node:' + e, 'node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-nolinksource', '')));
	ok('"no open path to a source" is the umbrella: every one of them',
		same(L.find('all', 'connection', 'conn-noopensource', ''),
			['node:' + c, 'node:' + d, 'node:' + e, 'node:' + f, 'node:' + g, 'node:' + lone]),
		JSON.stringify(L.find('all', 'connection', 'conn-noopensource', '')));
	ok('...and the fed nodes are in none of them',
		L.find('all', 'connection', 'conn-noopensource', '').indexOf('node:' + a) < 0 &&
		L.find('all', 'connection', 'conn-noopensource', '').indexOf('node:' + r) < 0);
	// **THE NESTING, ASSERTED RATHER THAN ASSUMED**: 1 inside 2, and 1, 2 and 3 all inside 4.
	const inside = (small, big) => L.find('all', 'connection', small, '')
		.every(x => L.find('all', 'connection', big, '').indexOf(x) >= 0);
	ok('the conditions nest: no links is inside no open links',
		inside('conn-unlinked', 'conn-noopen'));
	ok('...and all three are inside no open path to a source',
		inside('conn-unlinked', 'conn-noopensource') && inside('conn-noopen', 'conn-noopensource') &&
		inside('conn-nolinksource', 'conn-noopensource'));
	// The union check: the umbrella IS lpnDiagnose's one 'unreachable' list. This is what keeps the
	// report honest -- a condition that drifted from the solver's own walk would report nodes the
	// solve is happy with, or miss the ones it refuses.
	const unreachable = (L.diagnose().filter(function (i) { return i.code === 'unreachable'; })[0] || { ids: [] }).ids;
	ok('the umbrella is exactly what the solver calls unreachable',
		same(unreachable, [c, d, e, f, g, lone]), JSON.stringify(unreachable));
	// A pipe has no connection state of its own; a link that goes nowhere is lpnDiagnose's
	// dangling-link, a fault of the LINK, and is reported elsewhere.
	ok('the report returns nodes only, whatever the scope says',
		L.find('all', 'connection', 'conn-noopensource', '').every(function (x) { return x.indexOf('node:') === 0; }));
	// A row prints the NARROWEST condition true of that node: "No links" says more than "No open
	// path to a source", and both are true of the lone node. All four must be reachable as labels,
	// or the distinctions are made in the code and merged again on screen.
	L.setState('all', 'connection', 'conn-noopensource', '');
	L.pressFind();
	const rows = panelLines(L.resultsBox()).join(' | ');
	ok('each row names the NARROWEST fault true of it',
		rows.indexOf('No links') >= 0 && rows.indexOf('No open links') >= 0 &&
		rows.indexOf('No link path to a source') >= 0 && rows.indexOf('No open path to a source') >= 0,
		rows);

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
		L.find('all', 'connection', 'conn-noopensource', '').length === 0,
		JSON.stringify(L.find('all', 'connection', 'conn-noopensource', '')));
	L.setState('all', 'connection', 'conn-noopensource', '');
	L.pressFind();
	ok('...and says so in the panel rather than leaving a blank box',
		panelLines(L.resultsBox()).join(' ').indexOf('Every node is connected.') >= 0,
		JSON.stringify(panelLines(L.resultsBox())));

	// **WITH NO RESERVOIR AND NO TANK, THE TWO SOURCE QUESTIONS HAVE NO ANSWER.** Calling every node
	// source-less would be true and useless: it is one fault of the network, not N faults of the
	// nodes, and lpnDiagnose says it already as 'no-fixed-head'. So they match NOTHING -- not
	// everything -- and the panel says why. The two LOCAL conditions still answer perfectly well.
	L.reset();
	L.setCanvas(800, 600);
	const p1 = L.addNode('junction', 0, 0).id;
	const p2 = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', p1, p2);
	const p3 = L.addNode('junction', 300, 300).id;
	L.buildDom();
	ok('with no source, the source conditions match NOTHING rather than everything',
		L.find('all', 'connection', 'conn-noopensource', '').length === 0 &&
		L.find('all', 'connection', 'conn-nolinksource', '').length === 0,
		JSON.stringify(L.find('all', 'connection', 'conn-noopensource', '')));
	// The local pair is unaffected -- this is the improvement the split bought, and it is exactly
	// the question Tom originally asked ("nodes with no links (local)").
	ok('...but "no links" still answers, because it needs nowhere to walk',
		same(L.find('all', 'connection', 'conn-unlinked', ''), ['node:' + p3]),
		JSON.stringify(L.find('all', 'connection', 'conn-unlinked', '')));
	L.setState('all', 'connection', 'conn-noopensource', '');
	L.pressFind();
	ok('...and the panel says which questions it could not ask',
		panelLines(L.resultsBox()).join(' ').indexOf('no reservoir or tank') >= 0,
		JSON.stringify(panelLines(L.resultsBox())));
}

// ---- 7. THE QUERY LINE, AND THE INPUT IT BECAME (ROADMAP Task 540) -----------------------------
//
// Read out of the REAL panel: rebuildFindForm() builds it into #lpn_find_form, and the element
// under test is the input a visitor types in above the Find button. Every assertion below drives it
// the way a person does -- set .value, fire the real `input` listener -- so nothing here can pass by
// calling the parser while the panel is wired to something else.
function findQueryLine() {
	let out = null;
	walk(L.formBox(), function (el) { if (el.className === 'lpn-find-query') { out = el; } });
	return out;
}
function selectsIn() {
	const out = [];
	walk(L.formBox(), function (el) { if (el._tag === 'select') { out.push(el); } });
	return out;
}
// The QUERY's own pull-downs, counted inside the controls box -- the Replace form below has a select
// of its own and is not part of what is under test here.
function controlCount() { return L.controlSelects(); }
function fire(el, type) { (el._listeners[type] || []).forEach(function (f) { f({}); }); }
{
	console.log('\n--- the query line, written from the controls ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', r, a);
	L.buildDom();
	function lineFor(scope, prop, op, value) { L.setState(scope, prop, op, value); L.buildPanel(); return L.queryText(); }

	ok('an ID search reads as the scope, the property, the condition and the quoted text',
		lineFor('all', 'id', 'contains', '223') === "Everything.ID contains '223'", JSON.stringify(L.queryText()));
	ok('a numeric condition prints the number bare',
		lineFor('pipe', 'diameter', 'gt', '8') === 'Pipe.Diameter greater than 8', JSON.stringify(L.queryText()));
	// **THE LINE AND THE PULL-DOWN ARE ONE STRING** (Tom, 2026-08-27: *"What needs to match are the
	// selector and the string, both per the lang file."*). `lpn_find_op_top` is `{n} highest`; the
	// menu prints the letter n in the slot because no count has been chosen, and the line prints the
	// count the search will ACTUALLY use -- ten, when the box is empty. There is no second key for
	// the line's wording any more, which is what stopped the two from being able to disagree.
	ok('an extremes condition prints the count it will really use, in the pull-down\'s own wording',
		lineFor('pipe', 'velocity', 'top', '') === 'Pipe.Velocity 10 highest', JSON.stringify(L.queryText()));
	ok('...and the typed count when there is one',
		lineFor('pipe', 'velocity', 'bottom', '3') === 'Pipe.Velocity 3 lowest', JSON.stringify(L.queryText()));
	// The menu's own text, from that same value: the slot holds the letter, not a number.
	ok('...while the condition pull-down still offers it as "n highest"',
		L.opLabels('pipe', 'velocity').indexOf('n highest') >= 0,
		JSON.stringify(L.opLabels('pipe', 'velocity')));
	ok('and neither wording is a separate language key any more',
		!/lpn_find_q_top|lpn_find_q_bottom/.test(fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8')));
	// **THE LOCAL PAIR SAY "AT NODE" SINCE 2026-08-29**, Tom's own edit on the Task 545 pass: the
	// bare "no links" did not say WHOSE links, where its two siblings both name what is missing and
	// from where. The other two are unchanged.
	ok('a connection condition is the whole sentence, with no value',
		lineFor('junction', 'connection', 'conn-unlinked', '') === 'Junction.Connectivity no links at node',
		JSON.stringify(L.queryText()));
	// **ALL FOUR WORDINGS ARE TOM'S OWN** (2026-08-26, the local pair reworded 2026-08-29), and so
	// is the widening order.
	ok('the local pair reads as a fact about this node\'s own links',
		lineFor('junction', 'connection', 'conn-noopen', '') === 'Junction.Connectivity no open links at node',
		JSON.stringify(L.queryText()));
	// **AND THE SHORT SPELLING STILL PARSES.** The third element of findConnOpDefs() is the English
	// ALIAS, deliberately left as "no links" / "no open links": findAlts() offers the localized text
	// and the alias as two spellings of one condition, so a query somebody typed or saved before the
	// rewording still reads back, and longest-wins picks the new form when it is the one typed.
	// Driven through the REAL input, the way section 7 drives everything: type it, fire the real
	// `input` listener, and read the state the panel arrived at.
	L.type('Junction.Connection no links');
	const shortA = JSON.stringify(L.findState());
	L.type('Junction.Connection no open links');
	const shortB = JSON.stringify(L.findState());
	ok('...while the short English spelling still parses to the same two conditions',
		/conn-unlinked/.test(shortA) && /conn-noopen/.test(shortB), shortA + ' / ' + shortB);
	ok('the island condition names the missing LINK',
		lineFor('junction', 'connection', 'conn-nolinksource', '') === 'Junction.Connectivity no link path to a source',
		JSON.stringify(L.queryText()));
	ok('the umbrella condition names the missing OPEN PATH',
		lineFor('junction', 'connection', 'conn-noopensource', '') === 'Junction.Connectivity no open path to a source',
		JSON.stringify(L.queryText()));
	// An empty box with "contains" matches everything, and the quotes are what make that readable
	// rather than a sentence that stops in the middle.
	ok('an empty text value reads as the empty string it is matched as',
		lineFor('all', 'id', 'contains', '') === "Everything.ID contains ''", JSON.stringify(L.queryText()));

	// **THE PULL-DOWN IS STILL A WAY IN.** Changing the real select rewrites the input, which is half
	// the teaching mechanism: operate the control, watch the sentence change.
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();
	const selects = selectsIn();
	ok('the panel still has its three pull-downs', selects.length >= 3, String(selects.length));
	selects[2].value = 'lt';
	fire(selects[2], 'change');
	ok('changing the condition pull-down rewrites the query at once',
		L.queryText() === 'Pipe.Diameter less than 8', JSON.stringify(L.queryText()));

	// **AND IT IS NOW AN INPUT** (phase 2, Tom 2026-08-26). Asserted rather than intended: the
	// element carrying the query has to be something a person can put a caret in.
	const q = findQueryLine();
	ok('the query line is an input, not a printed div',
		!!q && q._tag === 'input' && q.type === 'text', q ? q._tag + '/' + q.type : 'missing');
}

// ---- 8. THE PARSER: what the input does with what is typed into it (Task 540 phase 2) ----------
//
// **EVERY QUERY BELOW IS CHECKED AGAINST A HAND-COMPUTED SET**, not against the parser's own idea of
// itself: the network is two pipes of known diameter, so the answer to each AND, OR and bracket is
// worked out here in the comment and asserted as a literal.
{
	console.log('\n--- typing a query ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	const b = L.addNode('junction', 200, 0).id;
	const ra = L.addLink('pipe', r, a);
	const ab = L.addLink('pipe', a, b);
	L.setProp(ra, 'diameter', 6);
	L.setProp(ab, 'diameter', 12);
	L.buildDom();
	const p6 = 'link:' + ra.id, p12 = 'link:' + ab.id;
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();

	function run(text) { L.type(text); L.pressFind(); return L.results(); }

	// A typed simple query and the same query built from the pull-downs must be ONE search. If these
	// two ever diverge, the input is a second query engine and the panel has two answers.
	ok('a typed simple query runs, and matches what the controls would have found',
		same(run('Pipe.Diameter greater than 8'), L.find('pipe', 'diameter', 'gt', '8')) &&
		same(run('Pipe.Diameter greater than 8'), [p12]), JSON.stringify(run('Pipe.Diameter greater than 8')));
	ok('...and the controls followed it, rather than standing beside it saying something else',
		L.controlsShown() && L.findState().prop === 'diameter' && L.findState().op === 'gt' &&
		L.findState().value === '8', JSON.stringify(L.findState()));
	ok('a quoted text value is read as text', same(run("Everything.ID contains '" + ra.id + "'"), [p6]),
		JSON.stringify(run("Everything.ID contains '" + ra.id + "'")));

	// AND: 6 is over 4 and under 8; 12 is over 4 and NOT under 8. So the answer is the 6 in pipe.
	ok('AND is the intersection, hand-computed',
		same(run('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8'), [p6]),
		JSON.stringify(run('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8')));
	// OR: under 8 is the 6 in; over 10 is the 12 in. Together, both pipes.
	ok('OR is the union, hand-computed',
		same(run('Pipe.Diameter less than 8 OR Pipe.Diameter greater than 10'), [p6, p12]),
		JSON.stringify(run('Pipe.Diameter less than 8 OR Pipe.Diameter greater than 10')));
	ok('an AND that nothing satisfies returns nothing, not everything',
		run('Pipe.Diameter greater than 8 AND Pipe.Diameter less than 8').length === 0);
	// **THE BRACKETS HAVE TO CHANGE THE ANSWER, or they are decoration.** AND binds tighter, so
	//   A OR B AND C   is  {6} u ({12} n {12})       = both pipes
	//   (A OR B) AND C is  ({6} u {12}) n {12}       = the 12 in alone
	const A = 'Pipe.Diameter equal to 6', B = 'Pipe.Diameter equal to 12',
		C = "Pipe.ID contains '" + ab.id + "'";
	ok('AND binds tighter than OR', same(run(A + ' OR ' + B + ' AND ' + C), [p6, p12]),
		JSON.stringify(run(A + ' OR ' + B + ' AND ' + C)));
	ok('...and brackets override that, changing the answer',
		same(run('(' + A + ' OR ' + B + ') AND ' + C), [p12]),
		JSON.stringify(run('(' + A + ' OR ' + B + ') AND ' + C)));
	ok('lower-case operators are the same operators',
		same(run(A + ' or ' + B), [p6, p12]), JSON.stringify(run(A + ' or ' + B)));

	// **THE LINE THE PANEL PRINTS MUST BE A LINE THE PANEL CAN READ.** This is the round trip that
	// the two-key arrangement could not make: the parser was taught `highest`, a word on no control,
	// while the pull-down said `n highest`. One template, `{n} highest`, is now both.
	function lineFor2(scope, prop, op, value) { L.setState(scope, prop, op, value); L.buildPanel(); return L.queryText(); }
	ok('the extremes query the panel writes parses back to the same search',
		same(run('Pipe.Diameter 1 highest'), [p12]) && same(run('Pipe.Diameter 1 lowest'), [p6]),
		JSON.stringify(run('Pipe.Diameter 1 highest')));
	ok('...and the count really is read, not assumed',
		run('Pipe.Diameter 2 highest').length === 2 && run('Pipe.Diameter 1 highest').length === 1);
	// The pull-down shows the letter n, so somebody typing what the menu says gets the ten the line
	// would have printed. Two pipes here, so ten is both of them.
	ok('the letter n, as the pull-down spells it, means the same ten an empty box does',
		run('Pipe.Diameter n highest').length === 2, JSON.stringify(run('Pipe.Diameter n highest')));
	// **A TRANSLATED TEMPLATE PARSES ITSELF**, count in whatever position that language puts it --
	// this is the whole reason the pattern is built from the lang value rather than from a word list.
	// Chinese's is `\u6700\u9ad8 {n} \u4e2a`, with the number in the middle.
	L.setWord('lpn_find_op_top', '\u6700\u9ad8 {n} \u4e2a');
	ok('a template with the count in the MIDDLE prints that way',
		lineFor2('pipe', 'diameter', 'top', '1') === 'Pipe.Diameter \u6700\u9ad8 1 \u4e2a',
		JSON.stringify(L.queryText()));
	ok('...and parses back, so a reader of that language has a working query line',
		same(run('Pipe.Diameter \u6700\u9ad8 1 \u4e2a'), [p12]),
		JSON.stringify(run('Pipe.Diameter \u6700\u9ad8 1 \u4e2a')));
	ok('...and the ENGLISH spelling still answers there too, as every other word of the query does',
		same(run('Pipe.Diameter 1 highest'), [p12]));
	L.setWord('lpn_find_op_top', '{n} highest');
	L.buildPanel();

	// **NO "Connected: 20, 40, 50" ON A RESULT ROW** (Tom, 2026-08-27: *"I don't know what that
	// means... I think we should remove it because it feels out of place."*). It was EPANET's
	// Adjacent Links pane folded into the row, and it answered a question the search did not ask, in
	// the place a reader scans for the thing they searched FOR. Asserted as an ABSENCE, because a
	// present-check cannot see a line come back.
	// Junction `a` carries TWO links, so it is the row that used to grow the list -- searching a
	// junction with none would pass against the old code too.
	run("Junction.ID contains '" + a + "'");
	const nodeRows = [];
	walk(L.resultsBox(), function (el) { if (el._tag === 'button') { nodeRows.push(el.textContent); } });
	ok('a node result row names the node and nothing else, though two pipes meet there',
		nodeRows.length === 1 && nodeRows[0].indexOf(':') < 0 && nodeRows[0].indexOf('\u00b7') < 0,
		JSON.stringify(nodeRows));

	// **A COMPOUND ANSWER PRINTS THE ID ALONE.** Two conditions name two properties, and choosing one
	// to print beside the id would answer a question nobody asked.
	run('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8');
	const rows = [];
	walk(L.resultsBox(), function (el) { if (el._tag === 'button') { rows.push(el.textContent); } });
	ok('a compound result row is the id and nothing invented', rows.length === 1 && rows[0].trim() === ra.id,
		JSON.stringify(rows));
}

// ---- 9. A QUERY THAT CANNOT BE READ SEARCHES NOTHING -------------------------------------------
//
// **THE HARD RULE OF THIS TASK.** Falling back to "search everything" would be a wrong answer
// wearing a confident face, so every failure below is asserted twice: that it is reported, and that
// the result list is EMPTY.
{
	console.log('\n--- a query that cannot be read ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	L.setProp(L.addLink('pipe', r, a), 'diameter', 6);
	L.buildDom();
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();
	function refuses(text, wants) {
		L.type(text); L.pressFind();
		const msg = panelLines(L.resultsBox()).join(' ');
		ok('refused: ' + JSON.stringify(text), L.results().length === 0 && msg.indexOf(wants) >= 0, msg);
	}
	refuses('Pipe.Diamater greater than 8', 'Diamater');
	refuses("Sausage.ID contains 'x'", 'Sausage');
	refuses('Pipe Diameter greater than 8', 'dot');
	refuses('Pipe.Diameter greater than', 'needs a value');
	refuses('Pipe.Diameter contains 8', 'Not a condition');
	refuses('(Pipe.Diameter greater than 8', 'never closed');
	refuses('Pipe.Diameter greater than 8)', 'Nothing was expected');
	refuses('Pipe.Diameter greater than 8 AND', 'There is nothing called');
	refuses("Everything.ID contains 'x", 'no closing quote');
	refuses('Everything.ID contains x', 'quotes');
	refuses('Pipe.Diameter greater than 8 rubbish', 'Nothing was expected');
	refuses(') AND Pipe.Diameter greater than 8', 'closes nothing');
	// **AN EMPTY BOX IS NOT A SEARCH FOR EVERYTHING.** The controls' own empty-value rule ("contains
	// nothing matches everything") is written `contains ''`, which IS a query. A blank box is not.
	refuses('', 'empty');
	refuses('   ', 'empty');
	// The position is part of the report: "where" is half of what a person needs in order to fix it.
	L.type('Pipe.Diamater greater than 8'); L.pressFind();
	ok('...and the message says where', /character 6/.test(panelLines(L.resultsBox()).join(' ')),
		panelLines(L.resultsBox()).join(' '));
	// A good query after a bad one clears the failure rather than leaving the panel stuck.
	L.type('Pipe.Diameter greater than 4'); L.pressFind();
	ok('a readable query after an unreadable one runs normally', L.results().length === 1,
		JSON.stringify(L.results()));
}

// ---- 10. THE CONTROLS ARE HONEST ABOUT A QUERY THEY CANNOT EXPRESS -----------------------------
//
// `A AND B` has no pull-down representation. The three ways to handle that are: show the first
// condition (a lie), grey the controls out still showing stale words (a quieter lie), or take them
// off the panel and say why. Only the third can be misread by nobody -- and it comes with the way
// back.
{
	console.log('\n--- the controls when the query outruns them ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', r, a);
	L.buildDom();
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();
	ok('the controls are there for a query they can express', L.controlsShown() && controlCount() === 3,
		String(controlCount()));

	L.type('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8');
	ok('a compound query takes the pull-downs off the panel',
		!L.controlsShown() && controlCount() === 0, String(controlCount()));
	const aside = panelLines(L.formBox()).join(' ');
	ok('...and says why, where they were', aside.indexOf('hidden') >= 0, aside);
	// The way back. findState still holds the last query the controls DID express, so this is a
	// return to it rather than a guess at one.
	let back = null;
	walk(L.formBox(), function (el) {
		if (el._tag === 'button' && el.textContent === 'Use the controls instead') { back = el; }
	});
	ok('a button offers the way back', !!back);
	if (back) { (back._listeners.click || []).forEach(function (f) { f({}); }); }
	ok('...and pressing it restores both the controls and the query they write',
		L.controlsShown() && controlCount() === 3 && L.queryText() === 'Pipe.Diameter greater than 8',
		L.queryText());

	// An unreadable query gets the same treatment, for the same reason: three pull-downs standing
	// beside a query that will not run is the same lie in a quieter voice.
	L.type('Pipe.Diamater greater than 8');
	ok('an unreadable query also takes the controls off', !L.controlsShown() && controlCount() === 0);
}

// ---- 11. THE OPERATORS ARE TRANSLATED, AND ENGLISH STILL WORKS ---------------------------------
//
// The whole line is localized -- the identifier half is localized whatever we do, so English
// operators would make it half-and-half. The cost is that a query is not portable between
// languages, and the parser pays it back by accepting the ENGLISH spelling in every language: a
// query pasted from a colleague, from a forum or from our own documentation must not fail.
{
	console.log('\n--- another language, and the English aliases ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	const b = L.addNode('junction', 200, 0).id;
	const ra = L.addLink('pipe', r, a);
	const ab = L.addLink('pipe', a, b);
	L.setProp(ra, 'diameter', 6);
	L.setProp(ab, 'diameter', 12);
	L.buildDom();
	const p6 = 'link:' + ra.id, p12 = 'link:' + ab.id;
	// Spanish words, set one at a time rather than by loading a second lang file -- what is under
	// test is that the parser reads the words the INTERFACE is showing, whatever they are.
	const was = {};
	[['lpn_tool_add_pipe', 'Tubería'], ['lpn_find_op_gt', 'mayor que'], ['lpn_find_op_lt', 'menor que'],
		['lpn_find_q_and', 'Y'], ['lpn_find_q_or', 'O']].forEach(function (p) {
		was[p[0]] = EngCalcs.pageConfig[p[0]];
		L.setWord(p[0], p[1]);
	});
	L.setState('pipe', 'diameter', 'gt', '8');
	L.buildPanel();
	ok('the line is written in the interface language', L.queryText() === 'Tubería.Diameter mayor que 8',
		L.queryText());
	function run(text) { L.type(text); L.pressFind(); return L.results(); }
	ok('...and the localized words parse',
		same(run('Tubería.Diameter mayor que 4 Y Tubería.Diameter menor que 8'), [p6]),
		JSON.stringify(run('Tubería.Diameter mayor que 4 Y Tubería.Diameter menor que 8')));
	// **THE PASTED QUERY.** Same network, same answer, English words, Spanish interface.
	ok('the English words still work in another language',
		same(run('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8'), [p6]),
		JSON.stringify(run('Pipe.Diameter greater than 4 AND Pipe.Diameter less than 8')));
	ok('...including a mixture, which is what a half-edited paste looks like',
		same(run('Tubería.Diameter greater than 4 AND Tubería.Diameter menor que 8'), [p6]),
		JSON.stringify(run('Tubería.Diameter greater than 4 AND Tubería.Diameter menor que 8')));
	ok('and the English OR is the union in Spanish too',
		same(run('Pipe.Diameter equal to 6 O Pipe.Diameter equal to 12'), [p6, p12]),
		JSON.stringify(run('Pipe.Diameter equal to 6 O Pipe.Diameter equal to 12')));
	Object.keys(was).forEach(function (k) { L.setWord(k, was[k]); });
	L.buildPanel();
	ok('the words go back', L.queryText() === 'Pipe.Diameter greater than 8', L.queryText());
}

// ---- 12. EVERY LINE THE PANEL WRITES IS A LINE THE PANEL CAN READ ------------------------------
//
// The round trip is what makes this a teaching device rather than two features: whatever the
// pull-downs print must parse back to the same query, or a user who edits one word of it is on
// their own.
{
	console.log('\n--- the round trip ---');
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	L.addLink('pipe', r, a);
	L.addText(50, 50, null);
	L.buildDom();
	[['all', 'id', 'contains', '223'], ['all', 'id', 'equals', 'J1'], ['pipe', 'diameter', 'gt', '8'],
		['pipe', 'diameter', 'lt', '2.5'], ['pipe', 'velocity', 'top', '3'], ['pipe', 'velocity', 'bottom', ''],
		['junction', 'connection', 'conn-unlinked', ''], ['junction', 'connection', 'conn-noopen', ''],
		['junction', 'connection', 'conn-nolinksource', ''], ['junction', 'connection', 'conn-noopensource', ''],
		['junction', 'pressure', 'equals', '-12.5'], ['text', 'text', 'contains', 'pump house'],
		['all', 'id', 'contains', '']].forEach(function (q) {
		L.setState(q[0], q[1], q[2], q[3]);
		L.buildPanel();
		const line = L.queryText();
		L.type(line);
		const st = L.findState();
		ok('round trip: ' + line,
			L.controlsShown() && st.scope === q[0] && st.prop === q[1] && st.op === q[2] &&
			// An extremes count left blank is printed as the ten it will really use, and reads back
			// as that ten -- the line says what the search will do, not what the box holds.
			(String(st.value) === String(q[3]) || (q[3] === '' && String(st.value) === '10')),
			line + ' -> ' + JSON.stringify(st));
	});
}

// **THE QUERY BOX'S TIP IS REACHABLE** (Tom, 2026-09-02: *"Find one-line query tip: Not showing.
// And there is no ? glyph."*). It was a `title` on the text INPUT, which EngCalcs.initTips() never
// looks at -- it wires `.ec-help[title]` and nothing else -- so on a phone the tip did not exist and
// on a pointer it was a native tooltip over the field you were trying to type in.
//
// Asserted on the MARKUP, because that is where the rule lives: `.ec-help` carries the title and
// wraps both the label text and the `.ec-tip` glyph, which is what makes the whole label the tap
// target instead of one character.
console.log('\n--- the Query label carries a real, wired tip ---');
{
	const form = L.formBox();
	function walk(n, out) {
		if (!n) { return out; }
		if (n.classList && n.classList.contains && n.classList.contains('ec-help')) { out.push(n); }
		(n.children || []).forEach(function (c) { walk(c, out); });
		return out;
	}
	const helps = walk(form, []);
	ok('the Find form has at least one .ec-help label', helps.length > 0, helps.length);
	const q = helps.filter(function (h) { return /query|same search/i.test(String(h.title || '')); })[0];
	ok('...and one of them carries the query tip', !!q, q && String(q.title).slice(0, 40));
	if (q) {
		const glyph = (q.children || []).filter(function (c) {
			return c.classList && c.classList.contains('ec-tip');
		})[0];
		ok('...with a "?" glyph inside it', !!glyph, glyph && glyph.textContent);
		ok('...and the label text inside the same .ec-help, so the tap target is the whole label',
			String(q._text || '').trim().length > 0 || (q.children || []).length >= 1);
	}
	// The tip must NOT be left on the input as well: two tips for one thing, and the one on the
	// input is the dead one.
	// And the tip is NOT also left on the input: two tips for one thing, and the one on the input is
	// the dead one. Read from the source, because the stub does not serialise markup.
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('...and the input itself no longer carries a duplicate title',
		!/findQueryInput\.title\s*=/.test(src));
}

// ---- THE PROPERTY LIST IS IN BANDS, AND THE BANDS ARE THE POINT --------------------------------
//
// **THIS ORDER WAS WRONG TWICE AND TOM CAUGHT IT BOTH TIMES.** Every specialised property used to be
// pushed at the top of findPropDefs() as it was written, so the list grew newest-first and a reader
// met two reaction coefficients before Diameter. The first repair only moved those to the end and
// left the middle borrowed from the Labels panel's list, so Head and Pressure still came before
// Elevation -- *"I see results mixed with asset properties."*
//
// The rule, asserted rather than described: identity, then WHAT YOU TYPED, then WHAT THE MODEL
// WORKED OUT, then questions about the drawing. `Demand` is deliberately in the results band even
// though `Base demand` is an input, because it is the base resolved under its pattern at the moment
// on the clock -- it moves when nothing about the junction has.
console.log('\n--- the property list reads in bands ---');
{
	const idx = (list, key) => list.indexOf(key);
	const junction = L.propKeys('junction');
	const jk = junction;
	ok('a junction offers what you typed before what was worked out',
		idx(junction, 'elev') < idx(junction, 'head') &&
		idx(junction, 'demand') < idx(junction, 'pressure'), jk.join(','));
	ok('...with the two demand INPUTS adjacent',
		idx(junction, 'demandCategory') === idx(junction, 'demand') + 1, jk.join(','));
	ok('...and the resolved demand among the results, not beside the typed one',
		idx(junction, 'demandActual') > idx(junction, 'fireFlow'), jk.join(','));
	ok('...and Connection last, because it asks about the drawing',
		idx(junction, 'connection') === junction.length - 1, jk.join(','));

	const pipe = L.propKeys('pipe');
	const pk = pipe;
	ok('a pipe offers Diameter before Flow', idx(pipe, 'diameter') < idx(pipe, 'flow'), pk.join(','));
	ok('...and Length and Roughness before any result',
		idx(pipe, 'length') < idx(pipe, 'velocity') &&
		idx(pipe, 'roughness') < idx(pipe, 'headloss'), pk.join(','));
}


// ---- THE PANEL IS A VIEW OF THE PROJECT, NOT A SNAPSHOT (Task 580) -----------------------------
//
// Tom, 2026-09-04: *"note that Find must be closed and reopened to see this when the project is
// changed."* The form was built once by its opener, so a project switch, or a water-quality mode
// that adds two pipe properties, left it offering the other project's list.
//
// Asserted through rebuildSettingsBox() rather than through refreshFindForm(), because the wiring
// IS the fix: every path that can add or remove a Find property already repaints the settings, and
// a test that called the repaint directly would pass with nothing calling it.
console.log('\n--- Find repaints when the project under it changes ---');
{
	build('us');
	L.setQualityMode('chemical');
	L.setPopupOpen(true);
	L.setState('pipe', 'diameter', 'greater', '1');
	L.buildPanel();
	const withChem = L.renderedProps();
	ok('a pipe offers the two reaction coefficients while a chemical is being analysed',
		withChem.indexOf('bulkCoeff') >= 0 && withChem.indexOf('wallCoeff') >= 0, String(withChem));

	L.setQualityMode('age');
	L.rebuildSettings();
	const withAge = L.renderedProps();
	ok('...and the OPEN box loses them the moment the analysis changes',
		withAge.indexOf('bulkCoeff') < 0 && withAge.indexOf('wallCoeff') < 0, String(withAge));

	// The selection itself was one of the two that just vanished. Left alone, the pull-down renders
	// blank and the search runs on a property nothing answers to.
	L.setQualityMode('chemical');
	L.rebuildSettings();
	L.setState('pipe', 'bulkCoeff', 'greater', '1');
	L.setQualityMode('age');
	L.rebuildSettings();
	ok('...and a selection that stopped existing falls back rather than going blank',
		L.findState().prop !== 'bulkCoeff' &&
		L.renderedProps().indexOf(L.findState().prop) >= 0, L.findState().prop);

	// A typed compound query is the user's text, and nothing about the document changing makes it
	// wrong. rebuildFindForm() alone would overwrite it from the pull-downs.
	L.type('Pipe.Diameter > 6 AND Pipe.Diameter < 24');
	ok('a typed compound query is what is on screen before the change', L.controlsShown() === false);
	L.rebuildSettings();
	ok('...and it is still there afterwards, character for character',
		L.queryText() === 'Pipe.Diameter > 6 AND Pipe.Diameter < 24', String(L.queryText()));
	ok('...still parsed as a compound query, not fallen back to the controls',
		L.controlsShown() === false);

	// The repaint costs nothing while the box is shut, which is nearly always. The controls have to
	// come back first -- renderedProps() reads the property pull-down, and a set-aside panel has
	// none to read.
	L.setQualityMode('age');
	L.setState('pipe', 'diameter', 'greater', '1');
	L.buildPanel();
	L.setPopupOpen(false);
	L.setQualityMode('chemical');
	L.rebuildSettings();
	ok('a closed box is not repainted', L.renderedProps().indexOf('bulkCoeff') < 0,
		String(L.renderedProps()));
	L.setPopupOpen(false);
}

// ---- THE BOX'S OWN CORNER AND SIZE SURVIVE A RELOAD --------------------------------------------
//
// Tom, 2026-09-04, having used the resizeable box: *"I would strongly like it to persist somehow
// across reloads. Whether it saves for the page or by project remains to be decided. But maybe we
// are safe to go with page for now."* Page, meaning PER BROWSER -- the same answer `lpn_pane`,
// `lpn_rpane` and `lpn_setbox` already give, and for a reason rather than for symmetry: where a box
// sits and how big it is is a fact about the SCREEN somebody is sitting at, and a colleague opening
// the project on a laptop must not inherit a 32-inch layout.
//
// **THE KEY IS WHAT IS BEING ASSERTED, not the numbers.** A new localStorage key is a question about
// what is on a visitor's device; this one is exempt because it is the same purpose and category as
// the three it copies. If this ever fails because the layout moved into the PROJECT file, that is a
// change to what a colleague inherits and it needs Tom, not a harness fix.
console.log('\n--- the Find box comes back where it was left ---');
{
	ok('it has a storage key of its own, beside the other panels\'',
		L.layoutKey() === 'lpn_findbox', L.layoutKey());
	L.setLayout({ left: 120, top: 64 }, { w: 480, h: 600 });
	L.saveLayout();
	const raw = JSON.parse(global.localStorage.getItem('lpn_findbox'));
	ok('...and a corner and a size both reach it',
		raw.left === 120 && raw.top === 64 && raw.w === 480 && raw.h === 600, JSON.stringify(raw));

	L.setLayout(null, null);
	L.loadLayout();
	const back = L.getLayout();
	ok('...and both come back on the next page load',
		back.pos.left === 120 && back.pos.top === 64 && back.size.w === 480 && back.size.h === 600,
		JSON.stringify(back));

	// A null is "never chosen", which is what keeps the anchored first-time placement a FIRST-TIME
	// rule. A stored zero size would be a box nobody could see.
	L.setLayout(null, null);
	L.saveLayout();
	L.loadLayout();
	ok('nothing chosen stays nothing chosen', L.getLayout().pos === null && L.getLayout().size === null,
		JSON.stringify(L.getLayout()));
	global.localStorage.setItem('lpn_findbox', JSON.stringify({ left: 1, top: 1, w: 0, h: 0 }));
	L.loadLayout();
	ok('...and a zero size is refused rather than restored', L.getLayout().size === null,
		JSON.stringify(L.getLayout()));
	global.localStorage.setItem('lpn_findbox', 'not json at all');
	L.setLayout(null, null);
	let threw = false;
	try { L.loadLayout(); } catch (e) { threw = true; }
	ok('...and unreadable storage is survived, not thrown on', !threw && L.getLayout().pos === null);
	global.localStorage.removeItem('lpn_findbox');
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

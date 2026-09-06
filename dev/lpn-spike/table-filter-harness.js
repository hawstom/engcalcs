// The TABLE FILTER and DICTIONARY ORDER -- ROADMAP Tasks 597 and 598. Run with:
//   node dev/lpn-spike/table-filter-harness.js
//
// WHY THIS EXISTS. Two things here can regress silently, and only two, so this harness asserts
// those and leaves the rest to pane-harness.js and find-harness.js.
//
//   1. **THE FILTER AND FIND MUST RETURN THE SAME ELEMENT SET FOR THE SAME CONDITION.** That is the
//      one-predicate rule made into an assertion rather than a promise. The filter is Find's query
//      line pointed at a table's row set (findSelectByQuery -> findEvalNode -> findMatches), and
//      the day somebody writes a second comparison for the filter's convenience these tests are
//      what says so. A drifted second predicate does not throw, does not warn, and shows a
//      perfectly plausible table.
//   2. **THE ORDERING MUST BE THE READER'S ALPHABET, NOT UTF-16.** `<` on two strings files every
//      accented letter after `z`, sorts Cyrillic and Arabic by codepoint block, and puts P10 before
//      P2. Each of those is a fixture below, and each of them FAILS under a plain `<` -- which is
//      the only way to know this test is testing anything.
//
// The stub gives `document.documentElement` no `lang`, so the collator is built on the
// environment's own locale. That is deliberate: the failures above are failures of code-unit order
// in every locale, so a fixture that needed a particular one would be asserting the ICU tables
// rather than our code.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tsetProp: setProp, buildDom: buildDom, deleteElement: deleteElement,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	// FIND, driven through its own state exactly as find-harness.js drives it.
	"\t\tfind: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tfindOrder: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.el.id; });\n" +
	"\t\t},\n" +
	// The one-line query the controls write for the state they are in -- the string the filter
	// stores, so the two sides of assertion 1 are provably the same question.
	"\t\tqueryFor: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findQueryString();\n" +
	"\t\t},\n" +
	"\t\topKeys: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[0]; }); },\n" +
	"\t\topLabels: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[1]; }); },\n" +
	"\t\tparse: function (text) { return findParse(text); },\n" +
	"\t\tselectByQuery: function (text) { var r = findSelectByQuery(text);\n" +
	"\t\t\treturn r.ok ? r.list.map(function (c) { return c.group + ':' + c.el.id; }) : null; },\n" +
	"\t\ttextCompare: findTextCompare,\n" +
	// THE FILTER, through the page's own doors.
	"\t\tsetFilter: paneSetFilter,\n" +
	"\t\tfilterQuery: function (id) { return paneFilterQuery(paneTableById(id)); },\n" +
	"\t\tfilteredIds: function (id) { return paneTableElements(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tallIds: function (id) { return paneTableAllElements(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tpanelHTML: function (id) { return document.getElementById(paneTableById(id).panel).innerHTML; },\n" +
	"\t\tpanelText: function (id) { var out = [];\n" +
	"\t\t\t(function walk(e) { if (e.textContent) { out.push(e.textContent); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById(paneTableById(id).panel));\n" +
	"\t\t\treturn out.join(' | '); },\n" +
	"\t\tpanelClasses: function (id) { var out = [];\n" +
	"\t\t\t(function walk(e) { if (e.className) { out.push(e.className); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById(paneTableById(id).panel));\n" +
	"\t\t\treturn out; },\n" +
	"\t\tsignature: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneTableSignature(s, paneTableRowsInOrder(s)); },\n" +
	"\t\ttableForScope: paneTableForScope,\n" +
	"\t\tfilterTarget: function (scope) { findState.scope = scope; return findFilterTarget(); },\n" +
	// THE PANEL, built by the page's own rebuildFindForm() into the real #lpn_find_form.
	"\t\tbuildPanel: function () { rebuildFindForm(); },\n" +
	"\t\ttype: function (text) { findQueryInput.value = text;\n" +
	"\t\t\t(findQueryInput._listeners.input || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tpressFilter: function () { var b = null;\n" +
	"\t\t\t(function walk(e) { if (e.id === 'lpn_find_filter_go') { b = e; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\tif (!b) { throw new Error('no filter button'); }\n" +
	"\t\t\t(b._listeners.click || []).forEach(function (f) { f({}); });\n" +
	"\t\t\treturn true; },\n" +
	"\t\tfilterButton: function () { var b = null;\n" +
	"\t\t\t(function walk(e) { if (e.id === 'lpn_find_filter_go') { b = e; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\treturn b; },\n" +
	"\t\tresultsText: function () { var out = [];\n" +
	"\t\t\t(function walk(e) { if (e.textContent) { out.push(e.textContent); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById('lpn_find_results'));\n" +
	"\t\t\treturn out.join(' | '); },\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; findState = { scope: 'all', prop: 'id', op: 'contains', value: '' };\n" +
	"\t\t\tpaneFilters = {}; findFilterTable = null;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tpaneTables().forEach(function (s) { paneTableReset(s); });\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok  ' : ' FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
function same(a, b) { return JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort()); }

byId.lpn_toolbar.querySelectorAll = () => [];

// A reservoir feeding four junctions through four pipes of different diameters. The diameters go in
// through setProp() -- the one write seam -- so the filter is reading what the map reads.
function build() {
	setUnitSet('us');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0).id;
	const ids = [r];
	let prev = r;
	[4, 6, 10, 14].forEach(function (d, i) {
		const j = L.addNode('junction', 100 * (i + 1), 0).id;
		const p = L.addLink('pipe', prev, j);
		L.setProp(p, 'diameter', d);
		ids.push(j);
		prev = j;
	});
	L.buildDom();
	return ids;
}

// ---- 1. THE FILTER AND FIND ARE ONE PREDICATE ------------------------------------------------
//
// The strongest thing in this file. For each condition: run it through Find, run the very query
// line the controls write for that same condition through the filter, and require the two sets to
// agree ROW FOR ROW on the table.
console.log('\n--- the filter and Find answer the same question ---');
{
	build();
	const cases = [
		['pipe', 'diameter', 'gt', '5'],
		['pipe', 'diameter', 'lt', '11'],
		['pipe', 'diameter', 'equals', '10'],
		['pipe', 'id', 'contains', 'L'],
		['pipe', 'id', 'contains', ''],
		['pipe', 'id', 'equals', 'L2'],
		['pipe', 'diameter', 'top', '2'],
		['pipe', 'diameter', 'bottom', '1'],
		['pipe', 'id', 'gt', 'L2'],
		['pipe', 'id', 'lt', 'L3']
	];
	cases.forEach(function (c) {
		const q = L.queryFor(c[0], c[1], c[2], c[3]);
		const found = L.find(c[0], c[1], c[2], c[3]).map((k) => k.split(':')[1]);
		L.setFilter('pipes', q);
		const filtered = L.filteredIds('pipes');
		ok('Find and the filter agree on   ' + q,
			same(found, filtered), JSON.stringify(found) + ' vs ' + JSON.stringify(filtered));
	});
	L.setFilter('pipes', '');
	ok('...and clearing the filter brings every row back',
		same(L.filteredIds('pipes'), L.allIds('pipes')), JSON.stringify(L.filteredIds('pipes')));
}

// A COMPOUND query goes through the same seam, which is the case a hand-written second predicate
// would never have got right at all.
console.log('\n--- a compound query filters too ---');
{
	build();
	const q = 'Pipe.Diameter above 5 AND Pipe.Diameter below 12';
	ok('the query parses', L.parse(q).ok);
	const found = L.selectByQuery(q).map((k) => k.split(':')[1]);
	L.setFilter('pipes', q);
	ok('AND narrows the table exactly as it narrows the search',
		same(found, L.filteredIds('pipes')),
		JSON.stringify(found) + ' vs ' + JSON.stringify(L.filteredIds('pipes')));
	ok('...and it really is a subset', L.filteredIds('pipes').length === 2 &&
		L.allIds('pipes').length === 4, JSON.stringify(L.filteredIds('pipes')));
	L.setFilter('pipes', '');
}

// ---- 2. THE FILTER FOLLOWS THE DRAWING --------------------------------------------------------
//
// It is stored as TEXT and re-asked on every draw, so an edit moves a row in or out. A snapshot of
// ids would be a report about a network that has moved on.
console.log('\n--- the filter is re-asked, not remembered ---');
{
	build();
	L.setFilter('pipes', 'Pipe.Diameter above 8');
	const before = L.filteredIds('pipes');
	ok('two pipes are over 8 in to begin with', before.length === 2, JSON.stringify(before));
	const doc = L.getDoc();
	L.setProp(doc.links.filter((l) => l.id === before[0])[0], 'diameter', 2);
	ok('...narrowing one takes it straight out of the table',
		L.filteredIds('pipes').length === 1, JSON.stringify(L.filteredIds('pipes')));
	L.setProp(doc.links.filter((l) => l.id === before[0])[0], 'diameter', 20);
	ok('...and widening it brings it back',
		L.filteredIds('pipes').length === 2, JSON.stringify(L.filteredIds('pipes')));
	L.setFilter('pipes', '');
}

// ---- 3. A FILTERED TABLE SAYS SO --------------------------------------------------------------
//
// Hidden rows with no visible cause is the one way this feature can mislead. The banner is not
// decoration and its absence is a defect.
console.log('\n--- a filtered table says what it is filtered by ---');
{
	build();
	L.renderTable('pipes');
	ok('an unfiltered table has no banner',
		L.panelClasses('pipes').indexOf('lpn-pane-filter') < 0,
		JSON.stringify(L.panelClasses('pipes')));
	L.setFilter('pipes', 'Pipe.Diameter above 8');
	ok('a filtered one does', L.panelClasses('pipes').indexOf('lpn-pane-filter') >= 0);
	ok('...and it prints the query in the reader\'s own words',
		L.panelText('pipes').indexOf('Pipe.Diameter above 8') >= 0, L.panelText('pipes').slice(0, 160));
	ok('...and how much of the table is showing', L.panelText('pipes').indexOf('2 of 4') >= 0,
		L.panelText('pipes').slice(0, 160));
	ok('...and offers the way out', L.panelText('pipes').indexOf('Show all') >= 0);
	// **THE EMPTY MESSAGE IS A DIFFERENT SENTENCE UNDER A FILTER.** "This network has none of these
	// yet" is FALSE of a network full of pipes none of which match, and it is the reading that
	// sends somebody looking for a bug in their file.
	L.setFilter('pipes', 'Pipe.Diameter above 900');
	ok('nothing matching is not the same statement as nothing existing',
		L.panelText('pipes').indexOf('Nothing in this table matches the filter.') >= 0 &&
		L.panelText('pipes').indexOf('This network has none of these yet.') < 0,
		L.panelText('pipes').slice(0, 200));
	// The DENOMINATOR moves without any row moving, which is the case a signature made of rows
	// alone cannot see -- it would leave a stale count on screen.
	L.setFilter('pipes', 'Pipe.Diameter above 8');
	const sigBefore = L.signature('pipes');
	const ids = L.getDoc().nodes.map((n) => n.id);
	const extra = L.addLink('pipe', ids[1], ids[3]);
	L.setProp(extra, 'diameter', 1);
	ok('a pipe the filter turns away still changes the signature',
		L.signature('pipes') !== sigBefore);
	L.renderTable('pipes');
	ok('...so the count on screen is the new one', L.panelText('pipes').indexOf('2 of 5') >= 0,
		L.panelText('pipes').slice(0, 160));
	L.setFilter('pipes', '');
}

// ---- 4. THE FILTER IS NOT PROJECT DATA --------------------------------------------------------
//
// A colleague opening the file must not find half his pipes missing with no idea why. CLAUDE.md's
// project/browser rule, and the third answer: this one is neither, and is stored nowhere at all.
console.log('\n--- the filter is stored nowhere ---');
{
	build();
	L.setFilter('pipes', 'Pipe.Diameter above 8');
	const json = JSON.stringify(L.serialize());
	ok('serializeProject() never learns about a filter',
		json.indexOf('paneFilter') < 0 && json.indexOf('Pipe.Diameter above 8') < 0);
	L.setFilter('pipes', '');
}

// ---- 5. WHICH TABLE, DERIVED FROM THE SCOPE ---------------------------------------------------
console.log('\n--- which table the button points at ---');
{
	build();
	ok('a pipe scope points at the Pipes table', L.tableForScope('pipe') === 'pipes');
	ok('a junction scope at Junctions', L.tableForScope('junction') === 'junctions');
	ok('a valve scope at Valves', L.tableForScope('valve') === 'valves');
	// Everything and Text name no single table: Text has no tab at all, because nothing about a
	// text label solves.
	ok('Everything names no one table', L.tableForScope('all') === null);
	ok('...and neither does Text', L.tableForScope('text') === null);
	ok('the button still has somewhere to point under Everything',
		L.filterTarget('all') === 'junctions', L.filterTarget('all'));
	ok('...and follows the scope where there is one', L.filterTarget('pump') === 'pumps');
}

// ---- 6. THE BUTTON, PRESSED THE WAY A PERSON PRESSES IT ---------------------------------------
//
// Through the real panel, the real element and the real listener, so nothing here can pass by
// calling applyTableFilter() while the button is wired to something else.
console.log('\n--- the button in the panel ---');
{
	build();
	L.buildPanel();
	ok('the panel carries a filter button', !!L.filterButton());
	ok('...and its tip is on .ec-help, where initTips() can reach it on a touch screen',
		String(L.filterButton().className).indexOf('ec-help') >= 0 &&
		String(L.filterButton().title).length > 0, L.filterButton().className);
	L.type('Pipe.Diameter above 8');
	L.pressFilter();
	ok('pressing it filters the table the scope names',
		L.filterQuery('pipes') === 'Pipe.Diameter above 8', L.filterQuery('pipes'));
	ok('...and the panel prints the same receipt the table shows',
		L.resultsText().indexOf('2 of 4') >= 0, L.resultsText().slice(0, 160));
	// **AN UNREADABLE LINE FILTERS NOTHING.** Hiding every row on a query we could not read would be
	// a wrong answer wearing a confident face, which is findRunQuery()'s own standing rule.
	L.setFilter('pipes', '');
	L.type('Pipe.Diameter wobbles 8');
	L.pressFilter();
	ok('an unreadable query sets no filter', L.filterQuery('pipes') === '');
	ok('...and says why', L.resultsText().length > 0, L.resultsText().slice(0, 120));
	L.type('');
	L.pressFilter();
	ok('an empty query sets no filter either', L.filterQuery('pipes') === '');
}

// ---- 7. DICTIONARY ORDER (Task 598) -----------------------------------------------------------
//
// Every fixture here FAILS under a plain `<` on two strings, which is the only way to know the
// collator is doing the work.
console.log('\n--- dictionary order, not code-unit order ---');
{
	build();
	// P2 before P10. Without `numeric: true` a text comparison on an id column is technically
	// correct and useless, and gets reported as "the filter is broken".
	ok('P2 sorts before P10', L.textCompare('P2', 'P10') < 0,
		'plain < says ' + (('P2' < 'P10') ? 'yes' : 'NO'));
	ok('...which plain < gets wrong', ('P2' < 'P10') === false);
	// An accented letter belongs in the alphabet, not after z. 'é' is U+00E9 and 'z' is U+007A, so
	// code-unit order files every accented word at the end of the list.
	ok('e-acute sorts before z', L.textCompare('étang', 'zone') < 0,
		'plain < says ' + (('étang' < 'zone') ? 'yes' : 'NO'));
	ok('...which plain < gets wrong', ('étang' < 'zone') === false);
	ok('n-tilde sorts before o', L.textCompare('ña', 'oa') < 0,
		'plain < says ' + (('ña' < 'oa') ? 'yes' : 'NO'));
	ok('...which plain < gets wrong', ('ña' < 'oa') === false);
	// A NON-LATIN SCRIPT, and the same failure INSIDE it: Cyrillic yo (U+0451) is filed after every
	// other Cyrillic letter by code unit and belongs immediately after ye in the alphabet, so a
	// Russian list sorted with `<` puts every yo word at the end.
	ok('Cyrillic sorts within itself', L.textCompare('Акт', 'Бак') < 0);
	ok('...and yo comes before ya, not after it', L.textCompare('ёж', 'яма') < 0,
		'plain < says ' + (('ёж' < 'яма') ? 'yes' : 'NO'));
	ok('...which plain < gets wrong', ('ёж' < 'яма') === false);
	// Case folds together, which is what this page has always done by lowercasing both sides.
	ok('Elm and elm rank together', L.textCompare('Elm', 'elm') === 0);

	// And the ordering the USER sees. Ten junctions, born J1..J10 through the page's own id
	// minting, which is the shape every real network of any size has.
	L.reset();
	L.setCanvas(800, 600);
	for (let i = 0; i < 10; i++) { L.addNode('junction', 10 * i, 0); }
	L.buildDom();
	const order = L.findOrder('junction', 'id', 'contains', 'J');
	ok('a Find over ids counts J1, J2 ... J10 rather than J1, J10, J2',
		JSON.stringify(order) ===
		JSON.stringify(['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10']),
		JSON.stringify(order));
	// The comparison conditions on a TEXT property, which is the whole of Task 598's user-facing
	// half. "above J2" must not mean "above J2 in UTF-16", which files J10 below it.
	ok('ID above J2 is J3 through J10',
		same(L.find('junction', 'id', 'gt', 'J2'),
			['J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'].map((x) => 'node:' + x)),
		JSON.stringify(L.find('junction', 'id', 'gt', 'J2')));
	ok('ID below J2 is J1 alone', same(L.find('junction', 'id', 'lt', 'J2'), ['node:J1']),
		JSON.stringify(L.find('junction', 'id', 'lt', 'J2')));
	// The filter is the same predicate, so it must hand back the same eight rows. The query comes
	// from findQueryString() rather than being typed here, because a TEXT value is QUOTED in this
	// grammar and hand-writing the line is how a harness ends up asserting its own typo.
	L.setFilter('junctions', L.queryFor('junction', 'id', 'gt', 'J2'));
	ok('...and the filtered Junctions table holds exactly those eight',
		same(L.filteredIds('junctions'), ['J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10']),
		JSON.stringify(L.filteredIds('junctions')));
	L.setFilter('junctions', '');
}

// ---- 8. THE VOCABULARY IS EPANET'S ------------------------------------------------------------
console.log('\n--- Below, Equal to, Above ---');
{
	build();
	ok('a numeric property offers above and below',
		same(L.opLabels('pipe', 'diameter').slice(0, 3), ['equal to', 'above', 'below']),
		JSON.stringify(L.opLabels('pipe', 'diameter')));
	ok('...and so does a text one now',
		L.opKeys('pipe', 'id').indexOf('gt') >= 0 && L.opKeys('pipe', 'id').indexOf('lt') >= 0,
		JSON.stringify(L.opKeys('pipe', 'id')));
	ok('...with contains and equal to still first',
		JSON.stringify(L.opKeys('pipe', 'id').slice(0, 4)) === JSON.stringify(['contains', 'equals', 'gt', 'lt']),
		JSON.stringify(L.opKeys('pipe', 'id')));
	// **A QUERY WRITTEN IN THE OLD WORDS STILL READS.** The words moved; a line somebody wrote down
	// or pasted from a colleague did not.
	ok('the query line is written in the new words',
		L.queryFor('pipe', 'diameter', 'gt', '8').indexOf('above') >= 0,
		L.queryFor('pipe', 'diameter', 'gt', '8'));
	ok('...and the old spelling still parses', L.parse('Pipe.Diameter greater than 8').ok);
	ok('...and means the same set',
		same(L.selectByQuery('Pipe.Diameter greater than 8'), L.selectByQuery('Pipe.Diameter above 8')),
		JSON.stringify(L.selectByQuery('Pipe.Diameter greater than 8')));
	ok('...both ways', same(L.selectByQuery('Pipe.Diameter less than 8'),
		L.selectByQuery('Pipe.Diameter below 8')));
}

console.log('\n' + checks + ' checks, ' + fails + ' failed');
process.exit(fails === 0 ? 0 : 1);

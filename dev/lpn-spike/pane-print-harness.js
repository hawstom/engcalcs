// Printing the asset table you are looking at. Run with:
//   node dev/lpn-spike/pane-print-harness.js
//
// Tom, 2026-08-21: *"Make a way to print any table."*
//
// WHY THIS EXISTS. Printing is the one thing on this page that NOBODY CAN SEE FAIL. It goes
// straight from a button to the browser's print dialog, and the sheet that comes out is the last
// place a defect can still be hiding: nothing on screen changes, no exception is thrown, and the
// person holding the paper is the person who finds out. The four ways it can be wrong are the four
// promises the button makes, and every one of them is pure enough to hold here:
//
//   1. **The wrong columns, or the right columns with the wrong headings.** The heading carries the
//      UNIT. A sheet of elevations that does not say feet is not a worse sheet, it is a wrong one.
//   2. **An editable cell printed as its CONTROL.** An <input> prints as a box, and on paper an
//      empty-looking box where a diameter should be is indistinguishable from a diameter nobody
//      entered. This is the specific defect a static copy exists to prevent, so it is asserted on
//      the built sheet rather than trusted to the design.
//   3. **A different order from the screen.** The reader sorted the table to find the fastest pipe;
//      the sheet they print of it has to be the table they were looking at.
//   4. **ONE printer for six tables.** Six print paths would be six places a column list is written
//      down. What holds that is not a comment: it is that all six tables are asserted through the
//      same call, with no per-type branch anywhere in this file.
//
// The sheet is compared cell-for-cell against the LIVE table as well as against known numbers.
// Against the live table because "what prints is what is on screen" is the actual requirement, and
// against known numbers because a comparison between two readings of one function would pass if
// that function were wrong (dev/testing-notes.md, the stub that removes the coupling).

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');

// **THE STUB MUST KNOW THE PANE HEAD CONTAINS THE X**, because the Print button is inserted into
// the page beside it. Without that one containment the button is never built, every assertion about
// it is vacuously skipped, and the harness passes on a page that has no button at all.
byId.lpn_pane_head.appendChild(byId.lpn_pane_close);

// **THE STUB MUST KNOW ONE THING ABOUT PRINTING: window.print() reads the page as it stands at the
// moment it is called.** A stub that only counted calls would let every assertion below be true of
// a page already torn down -- which is precisely the state printPaneTable() leaves behind, and
// therefore precisely the wrong-reason pass. It snapshots instead, and the snapshot is what the
// tests read.
let printed = null, printCalls = 0;
global.window.print = function () {
	printCalls++;
	const area = global.document.body.children.filter((c) => c.id === 'lpn_print_area');
	printed = {
		onBody: area.length,
		flagged: global.document.body.classList.contains('lpn-printing-table'),
		area: area[0] || null
	};
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tsetProp: setProp, wirePane: wirePane, openPane: openPane, setPaneTab: setPaneTab,\n" +
	"\t\tpaneTables: paneTables,\n" +
	// A solve RESULT, planted rather than computed: the sheet's job is to print what the page
	// holds, and running a real solve here would only make the number on the paper harder to state.
	// It goes into lastSolveResult because that is where colorLinkValue() -- the accessor the map
	// label, the colour ramp and the table cell all share -- reads one from.
	"\t\tplantResult: function (r) { lastSolveResult = r; },\n" +
	// The print path through its own doors: build the sheet, and press the button. Reached by table
	// ID rather than by six exports, because ONE printer serving six types is the thing under test.
	"\t\tbuildPrintable: function (id) { return paneBuildPrintable(paneTableById(id)); },\n" +
	"\t\tactiveSpecId: function () { var s = activePaneTableSpec(); return s ? s.id : null; },\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tsortTable: function (id, col) { sortPaneTable(paneTableById(id), col); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\ttableCells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttableHeadings: function (id) { return paneTableById(id).cols.map(paneHeadingText); },\n" +
	"\t\tsetProjectName: function (n) { project.name = n; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
L.wirePane();

const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');
const en = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');

// ---- a network with one of everything in it ---------------------------------------------------
const j1 = L.addNode('junction', 0, 0), j2 = L.addNode('junction', 100, 0),
	j3 = L.addNode('junction', 200, 0),
	r1 = L.addNode('reservoir', 0, 100), t1 = L.addNode('tank', 100, 100);
j1.elev = 30; j2.elev = 10; j3.elev = 20;
L.setProp(j1, 'demand', 5); L.setProp(j2, 'demand', 50); L.setProp(j3, 'demand', 1);
const p1 = L.addLink('pipe', j1.id, j2.id), p2 = L.addLink('pipe', j2.id, j3.id);
L.setProp(p1, 'diameter', 8); L.setProp(p2, 'diameter', 12);
const pu1 = L.addLink('pump', r1.id, j1.id);
const v1 = L.addLink('valve', t1.id, j2.id);
// A result, planted rather than solved: the sheet's job is to print what the page holds, and a
// solve here would only make the number harder to state.
L.plantResult({
	flows: { [p1.id]: 0.01, [p2.id]: 0.01 },
	velocities: { [p1.id]: 1, [p2.id]: 2 },
	headlosses: { [p1.id]: 1, [p2.id]: 1 },
	heads: {}, pressures: {}
});
L.setProjectName('Elm Street Center');

const TABLES = L.paneTables().map((t) => t.id);
const cellsOf = (node) => (node ? node.children : []);
function sheetOf(id) {
	const wrap = L.buildPrintable(id);
	const table = wrap.children.filter((c) => c._tag === 'table')[0] || null;
	const thead = table ? table.children.filter((c) => c._tag === 'thead')[0] : null;
	const tbody = table ? table.children.filter((c) => c._tag === 'tbody')[0] : null;
	return {
		wrap,
		title: (wrap.children.filter((c) => c._tag === 'h1')[0] || {}).textContent,
		name: (wrap.children.filter((c) => c._tag === 'h2')[0] || {}).textContent,
		table,
		headings: thead ? cellsOf(thead.children[0]).map((th) => th.textContent) : [],
		rows: tbody ? tbody.children.map((tr) => cellsOf(tr).map((td) => ({
			text: td.textContent, tag: td._tag, cls: td.className
		}))) : []
	};
}

// ---- 1. every table prints, from the one printer ----------------------------------------------
console.log('\n--- one printer, six tables ---');
{
	report(TABLES.length === 6, 'there are six asset tables to print', TABLES.join(','));
	// No per-type print code. The cheap guard is that the per-type names never appear -- the same
	// guard pane-harness.js keeps over the renderer, for the same reason.
	report(!/function print(Junctions|Reservoirs|Tanks|Pipes|Pumps|Valves)\b/.test(src),
		'no per-type printer exists');
	report(src.split('function paneBuildPrintable(').length === 2,
		'...there is exactly one, and it takes a spec');
	TABLES.forEach((id) => {
		const s = sheetOf(id);
		report(!!s.wrap && s.wrap.id === 'lpn_print_area', `${id} builds a sheet`);
		report(s.headings.length > 0, '...with headings on it', s.headings.join(' | '));
	});
}

// ---- 2. whose network, and which table --------------------------------------------------------
console.log('\n--- the sheet says what it is ---');
{
	const s = sheetOf('pipes');
	report(s.title === 'Elm Street Center', 'the project name is on the sheet', s.title);
	report(s.name === 'Pipes', '...and the table’s own name', s.name);
	// The tab strip is the only place the second one is said on screen, and the tab strip is not on
	// the paper. Read from the SAME key the tab reads, so a rename cannot leave the two disagreeing.
	report(/lpn_pane_tab_pipes'\]='Pipes'/.test(en), '...taken from the tab’s own lang key');
	L.setProjectName('Net3-World');
	report(sheetOf('pipes').title === 'Net3-World', 'renaming the project renames the sheet');
	L.setProjectName('Elm Street Center');
}

// ---- 3. the headings are the screen's headings, units and all ---------------------------------
console.log('\n--- the headings carry the units ---');
{
	TABLES.forEach((id) => {
		L.renderTable(id);
		const want = L.tableHeadings(id), got = sheetOf(id).headings;
		report(want.join('|') === got.join('|'), `${id}: printed headings are the screen’s headings`,
			got.join(' | '));
	});
	// And absolutely, not only relatively: a comparison of two readings of one function would pass
	// with the unit missing from both.
	const jh = sheetOf('junctions').headings;
	report(jh.some((h) => /\(fth2o\)/.test(h)), 'a US junction table prints an elevation in feet', jh.join(' | '));
	report(jh.some((h) => /\(gpm\)/.test(h)), '...and a demand in (gpm)', jh.join(' | '));
	setUnitSet('si');
	L.renderTable('junctions');
	const jm = sheetOf('junctions').headings;
	report(jm.some((h) => /\(mh2o\)/.test(h)) && jm.some((h) => /\(lps\)/.test(h)),
		'and an SI one prints metres and litres per second', jm.join(' | '));
	setUnitSet('us');
	L.renderTable('junctions');
}

// ---- 4. an editable cell prints as its VALUE --------------------------------------------------
// The whole reason the sheet is a static copy. An <input> prints as the control.
console.log('\n--- nothing on the sheet is a control ---');
{
	TABLES.forEach((id) => {
		const s = sheetOf(id);
		const bad = [];
		s.rows.forEach((row) => row.forEach((c) => { if (c.tag !== 'td') { bad.push(c.tag); } }));
		report(bad.length === 0, `${id}: every cell is a plain cell`, bad.join(','));
	});
	report(!/createElement\('input'\)|createElement\('button'\)/.test(
		src.slice(src.indexOf('function paneBuildPrintable('),
			src.indexOf('function paneEndPrint('))),
		'the printer creates no inputs and no buttons at all');
	// The values themselves, stated. j2 was given a demand of 50 and an elevation of 10; both are
	// number INPUTS on screen, and both have to be readable on paper.
	const s = sheetOf('junctions');
	const head = s.headings, order = L.tableOrder('junctions');
	const rowFor = (id) => s.rows[order.indexOf(id)];
	const at = (id, h) => rowFor(id)[head.findIndex((x) => x.indexOf(h) === 0)].text;
	report(at(j2.id, 'Demand') === '50', 'a typed demand prints as its number', at(j2.id, 'Demand'));
	report(at(j2.id, 'Elevation') === '10', '...and a typed elevation as its number', at(j2.id, 'Elevation'));
	report(rowFor(j2.id)[0].text === j2.id, '...and the ID prints as the ID, not as a link',
		rowFor(j2.id)[0].text);
	// A RESULT rounds the way the screen rounds it. 3.14159 is on the document; 3.14 is what both
	// the cell and the sheet must say.
	L.renderTable('pipes');
	const ps = sheetOf('pipes'), pHead = ps.headings;
	const pRow = ps.rows[L.tableOrder('pipes').indexOf(p1.id)];
	const vAt = pHead.findIndex((x) => x.indexOf('Velocity') === 0);
	// 1 m/s solved is 3.28084 ft/s displayed, and 3.28 printed. Stated as a number rather than as
	// "whatever the cell says": the conversion and the rounding are both on trial here.
	report(pRow[vAt].text === '3.28', 'a result prints converted and rounded as the screen has it',
		pRow[vAt].text);
	report(L.tableCells('pipes')[p1.id].velocity.textContent === pRow[vAt].text,
		'...which is the same string the live cell holds');
	// EVERY cell, against the live table. This is the requirement in its general form: what prints
	// is what is on screen.
	TABLES.forEach((id) => {
		L.renderTable(id);
		const sheet = sheetOf(id), rows = L.tableOrder(id), live = L.tableCells(id), mismatch = [];
		const cols = L.paneTables().filter((t) => t.id === id)[0].cols;
		rows.forEach((elId, r) => cols.forEach((c, i) => {
			const cell = live[elId][c.key];
			// The ID column is a go-to-the-map button on screen and plain text on paper; its TEXT
			// is the same either way, which is the claim being made.
			const want = c.key === 'id' ? elId
				: (cell._tag === 'input' ? cell.value : cell.textContent);
			const got = sheet.rows[r][i].text;
			if (String(want) !== String(got)) { mismatch.push(`${elId}.${c.key}: ${want} != ${got}`); }
		}));
		report(mismatch.length === 0, `${id}: every printed cell equals its live cell`,
			mismatch.slice(0, 3).join('; '));
	});
	// One seam decides what a cell says. Two would be two roundings of one number.
	report(src.split('function paneCellText(').length === 2, 'one function decides a cell’s text');
	report(/target\.textContent = paneCellText\(c, el\);/.test(src) &&
		/target\.value = paneCellText\(c, el\);/.test(src),
		'...and the live table fills its cells through it too');
}

// ---- 5. the order on the paper is the order on the screen -------------------------------------
console.log('\n--- the sort you chose is the order that prints ---');
{
	L.renderTable('junctions');
	const order0 = L.tableOrder('junctions');
	const sheet0 = sheetOf('junctions').rows.map((r) => r[0].text);
	report(order0.join(',') === sheet0.join(','), 'the default order prints as it stands', sheet0.join(','));
	L.sortTable('junctions', 'demand');           // ascending
	const asc = L.tableOrder('junctions'), sAsc = sheetOf('junctions').rows.map((r) => r[0].text);
	report(sAsc.join(',') === asc.join(','), 'sorted by demand ascending, the sheet follows', sAsc.join(','));
	report(sAsc[0] === j3.id && sAsc[2] === j2.id, '...smallest demand first', sAsc.join(','));
	L.sortTable('junctions', 'demand');           // descending
	const desc = L.tableOrder('junctions'), sDesc = sheetOf('junctions').rows.map((r) => r[0].text);
	report(sDesc.join(',') === desc.join(','), 'and reversed, the sheet reverses with it', sDesc.join(','));
	report(sDesc.join(',') !== sAsc.join(','), '...so the two sheets really do differ');
	L.sortTable('junctions', 'id');
}

// ---- 6. a table with nothing in it ------------------------------------------------------------
console.log('\n--- an empty table ---');
{
	// The empty case is MADE rather than found: every type has a part in this network. A printer
	// that emitted a headings-only table would put a sheet in somebody's hand that reads as a
	// network with no pumps rather than as a table nobody filled in.
	const doc = L.getDoc();
	const kept = doc.links.slice();
	doc.links.length = 0;
	const s = sheetOf('pumps');
	report(!s.table, 'a table with no rows prints no table');
	report(/none of these/.test(s.wrap.children.map((c) => c.textContent).join(' ')),
		'...it says the network has none of these yet',
		s.wrap.children.map((c) => c.textContent).join(' '));
	report(s.title === 'Elm Street Center' && s.name === 'Pumps',
		'...and still says whose network and which table');
	kept.forEach((l) => doc.links.push(l));
	L.renderTable('pumps');
}

// ---- 7. the button, and what happens when it is pressed ---------------------------------------
console.log('\n--- pressing Print ---');
{
	// Findable by its id once it is in the page, which is what a real DOM does and what this stub's
	// fixed id map cannot do for an element the page built.
	byId.lpn_pane_print = byId.lpn_pane_head.children.filter((c) => c.id === 'lpn_pane_print')[0] || null;
	const btn = byId.lpn_pane_print;
	report(!!btn, 'the pane head carries a Print button');
	report(!!btn && btn.textContent === 'Print table', '...labelled from its own lang key', btn && btn.textContent);
	report(!!btn && /ec-help/.test(btn.className) && !!btn.title,
		'...with a tip a tap can reveal, like every other control on this page');
	report(/lpn_pane_print'\]=/.test(en) && /lpn_pane_print_tip'\]=/.test(en),
		'both strings are English lang keys, translatable');
	// **PROFILE IS NOT A TABLE.** The button is not there, and the printer cannot be reached for it.
	L.openPane('profile');
	report(L.activeSpecId() === null, 'on the Profile tab there is no table to print');
	report(btn.style.display === 'none', '...so the button is not shown');
	L.setPaneTab('valves');
	report(L.activeSpecId() === 'valves', 'on a table tab the active table IS that tab');
	report(btn.style.display !== 'none', '...and the button is back');

	// And the press itself. What the browser sees at the moment it prints is the whole of the
	// contract: the sheet on the body, and the flag that hides everything else.
	printed = null;
	btn._listeners.click[0]();
	report(printCalls === 1, 'the button prints');
	report(!!printed && printed.onBody === 1, '...with exactly one sheet appended to <body>');
	report(!!printed && printed.flagged, '...and the body flagged so the rest of the page is hidden');
	report(!!printed && printed.area.children.some((c) => c.textContent === 'Valves'),
		'...and it is the table that was on screen');
	// **AND IT TAKES ITSELF AWAY AGAIN.** A sheet left behind would print instead of the map on the
	// next Ctrl+P, which is a defect nobody would connect to this button.
	report(!global.document.body.classList.contains('lpn-printing-table'),
		'afterwards the body is unflagged');
	report(global.document.body.children.every((c) => c.id !== 'lpn_print_area'),
		'...and the sheet is gone from the page');
	// Twice in a row leaves one sheet, not two.
	btn._listeners.click[0]();
	btn._listeners.click[0]();
	report(printCalls === 3 && printed.onBody === 1, 'printing twice leaves one sheet, never two',
		String(printed && printed.onBody));
	// No popup. A blocked popup fails silently at the moment the button is pressed, which is the
	// one moment the user is watching.
	report(!/window\.open/.test(src.slice(src.indexOf('function paneBuildPrintable('),
		src.indexOf('function activePaneTableSpec('))),
		'nothing here opens a window — a blocked popup is a silent failure');
}

// ---- 8. the stylesheet, which is the other half of the mechanism ------------------------------
console.log('\n--- what the print stylesheet promises ---');
{
	report(/#lpn_print_area \{ display: none; \}/.test(css),
		'the sheet is invisible on screen — it exists only between the button and the dialog');
	report(/body\.lpn-printing-table > \*:not\(#lpn_print_area\) \{ display: none !important; \}/.test(css),
		'with the flag set, everything else on the page is hidden');
	report(/body\.lpn-printing-table #lpn_print_area \{ display: block !important; \}/.test(css),
		'...and the sheet is shown');
	// **THE MAP'S OWN PRINTING IS UNTOUCHED.** Every rule in the block is qualified by the body flag
	// or by the sheet's own class, so a plain Ctrl+P still prints the drawing exactly as it did
	// before this feature existed.
	const at = css.indexOf('#lpn_print_area { display: none; }');
	const block = css.slice(css.indexOf('@media print {', at), css.indexOf('.lpn-print-table tr', at));
	const rules = block.split('\n').filter((l) => /^\t[.#a-zA-Z]/.test(l));
	const unqualified = rules.filter((l) => !/lpn-printing-table|lpn-print-table|#lpn_print_area/.test(l));
	report(rules.length > 3, 'the print block was found', rules.length + ' rules');
	report(unqualified.length === 0, 'no rule in it reaches a page that is not printing a table',
		unqualified.join(' / '));
	report(/\.lpn-print-table thead \{ display: table-header-group; \}/.test(css),
		'the heading row repeats on every sheet of a long table');
	report(/\.lpn-print-table thead th \{ position: static/.test(css),
		'...and is not the screen’s sticky row, which has no meaning on paper');
	report(/\.lpn-pane-print \{/.test(css), 'the button has a style of its own');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

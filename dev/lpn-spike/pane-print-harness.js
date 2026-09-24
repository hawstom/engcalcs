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
const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
// The name this harness TYPES into the project and then reads back off the printed sheet. It is
// the harness's own text, not the page's -- it happens to read like lpn_ex_elm_street_title, which
// is why dev/scripts/harness_wording_check.php declares this one line an exception.
const PROJECT_NAME = 'Elm Street Center';

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');

// **THE STUB MUST KNOW THE SHAPE OF THE PANE HEAD**, because the Print button is inserted into it.
// Without that containment the button is never built, every assertion about it is vacuously
// skipped, and the harness passes on a page that has no button at all. The head holds the wrapping
// strip and the X; the strip holds the tablist, and the button joins it there (ROADMAP Task 488).
ensure('lpn_pane_strip');
byId.lpn_pane_head.appendChild(byId.lpn_pane_strip);
byId.lpn_pane_strip.appendChild(byId.lpn_pane_tabs);
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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\taddCustomer: addCustomer,\n" +
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
	// paneCols(), never `spec.cols` -- a column may stand down; see pane-harness.js.
	"\t\ttableHeadings: function (id) { return paneCols(paneTableById(id)).map(paneHeadingText); },\n" +
	"\t\tpaneCols: paneCols,\n" +
	"\t\theadCells: function (id) { return paneTableById(id).headCells; },\n" +
	"\t\tsetUserWidth: function (id, key, em) { paneSetColWidth(paneTableById(id), key, em); },\n" +
	"\t\tforgetWidths: function (id) { var s = paneTableById(id); paneCols(s).forEach(function (c) { paneResetColWidth(s, c.key); }); },\n" +
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
L.addText(50, 50);   // the Text table (2026-09-08) prints too, so it needs one row to print
// The Customers table (Task 247) prints on exactly the same terms, so it needs a row too.
// **ON THE FIRST JUNCTION, AND THAT IS DELIBERATE.** A meter is one of its junction's demand ROWS,
// so the junction it lumps at prints a TOTAL rather than the one number somebody typed. Landing it
// on j1 leaves j2, whose printed demand and elevation are the two values section 4 states, saying
// exactly what was typed into it, and leaves the demand ORDER section 6 asserts unchanged.
const m1 = L.addCustomer(10, 20, { link: p1.id, t: 0.1 });
m1.account = '4417-A'; m1.demand = 3; m1.count = 4;
// A result, planted rather than solved: the sheet's job is to print what the page holds, and a
// solve here would only make the number harder to state.
L.plantResult({
	flows: { [p1.id]: 0.01, [p2.id]: 0.01 },
	velocities: { [p1.id]: 1, [p2.id]: 2 },
	headlosses: { [p1.id]: 1, [p2.id]: 1 },
	heads: {}, pressures: {}
});
L.setProjectName(PROJECT_NAME);

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
console.log('\n--- one printer, seven tables ---');
{
	// Eight since 2026-09-15: Customers (Task 247), which prints through the one printer exactly
	// as the seven before it do, and is the assertion that says so.
	report(TABLES.length === 8, 'there are eight asset tables to print', TABLES.join(','));
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
	report(s.title === PROJECT_NAME, 'the project name is on the sheet', s.title);
	report(s.name === 'Pipes', '...and the table’s own name', s.name);
	// The tab strip is the only place the second one is said on screen, and the tab strip is not on
	// the paper. Read from the SAME key the tab reads, so a rename cannot leave the two disagreeing.
	report(/lpn_pane_tab_pipes'\]='Pipes'/.test(en), '...taken from the tab’s own lang key');
	L.setProjectName('Net3-World');
	report(sheetOf('pipes').title === 'Net3-World', 'renaming the project renames the sheet');
	L.setProjectName(PROJECT_NAME);
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
		const cols = L.paneCols(L.paneTables().filter((t) => t.id === id)[0]);
		rows.forEach((elId, r) => cols.forEach((c, i) => {
			const cell = live[elId][c.key];
			// The ID column is a go-to-the-map button on screen and plain text on paper; its TEXT
			// is the same either way, which is the claim being made.
			// A checkbox cell (Active, Bold) holds its answer in `checked`; the sheet prints it as 1 or 0.
			const want = c.key === 'id' ? elId
				: (cell._tag === 'input' ? (cell.type === 'checkbox' ? (cell.checked ? '1' : '0') : cell.value)
					: (cell._tag === 'select' ? cell.value : cell.textContent));
			const got = sheet.rows[r][i].text;
			if (String(want) !== String(got)) { mismatch.push(`${elId}.${c.key}: ${want} != ${got}`); }
		}));
		report(mismatch.length === 0, `${id}: every printed cell equals its live cell`,
			mismatch.slice(0, 3).join('; '));
	});
	// One seam decides what a cell says. Two would be two roundings of one number.
	report(src.split('function paneCellText(').length === 2, 'one function decides a cell’s text');
	// (R-111: the refill now writes a cell only when its text changed, so the value arrives through
	// a local -- still paneCellText()'s, and still the only thing either write is handed.)
	report(/text = paneCellText\(c, el\);\s*if \(target\.textContent !== text\) \{ target\.textContent = text; \}/.test(src) &&
		/text = paneCellText\(c, el\);\s*if \(target\.value !== text\) \{ target\.value = text; \}/.test(src),
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
	report(s.wrap.children.map((c) => c.textContent).join(' ').indexOf(PC.lpn_pane_none) >= 0,
		'...it says the network has none of these yet',
		s.wrap.children.map((c) => c.textContent).join(' '));
	report(s.title === PROJECT_NAME && s.name === 'Pumps',
		'...and still says whose network and which table');
	kept.forEach((l) => doc.links.push(l));
	L.renderTable('pumps');
}

// ---- 7. the button, and what happens when it is pressed ---------------------------------------
console.log('\n--- pressing Print ---');
{
	// Findable by its id once it is in the page, which is what a real DOM does and what this stub's
	// fixed id map cannot do for an element the page built.
	byId.lpn_pane_print = byId.lpn_pane_strip.children.filter((c) => c.id === 'lpn_pane_print')[0] || null;
	const btn = byId.lpn_pane_print;
	report(!!btn, 'the pane head carries a Print button');
	// ---- TASK 488: the button shares the tabs' wrapping flow, it does not own a column ----------
	// Tom, 2026-08-23: "it monopolises a column in the bottom pane's header row, and the table tabs
	// cannot wrap past it." The fix is structural and lives in two places at once, so both are
	// asserted: the button is a CHILD of the wrapping strip, and the tablist inside that strip has
	// no box of its own, which is what puts its tabs in the same flow as the button.
	report(byId.lpn_pane_strip.children.indexOf(btn) === 0,
		'...as the FIRST item of the wrapping strip, at the extreme left edge');
	report(byId.lpn_pane_head.children.every((c) => c.id !== 'lpn_pane_print'),
		'...and NOT a sibling of the strip, which is what gave it a column of its own');
	{
		const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
		report(/id="lpn_pane_strip"[\s\S]{0,200}id="lpn_pane_tabs"/.test(php),
			'...the page nests the tablist inside that strip');
		report(/id="lpn_pane_tabs"[\s\S]{0,120}<\/div>\s*<\/div>\s*<button[^>]*id="lpn_pane_close"/.test(php),
			'...and leaves the X outside it, so it stays pinned to the top-right corner');
		report(/\.lpn-pane-strip \{[^}]*flex-wrap: wrap/.test(css), '...the strip is the wrapping row');
		report(/\.lpn-pane-tabs \{ display: contents; \}/.test(css),
			'...and the tablist has no box, so its tabs wrap beside the button and not inside it');
	}
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

// **THE SHEET USES THE WIDTHS THE READER DRAGGED -- AND, SINCE, THE ONES NOBODY TOUCHED TOO**
// (Tom, 2026-09-21: *"I think that 'Print table' has not been revisited since we added column
// resizing. And I think that it's important to use the column widths adjusted by the user."*
// 2026-09-22: *"Print is not respecting on-screen column widths."* And again: *"Print table does
// not respect column widths. It expands to 100% of printable area."*). The third round is why an
// UNTOUCHED table no longer takes a different path from a dragged one: it used to print at the
// browser's own auto-layout content width, with no budget and no scaling -- exactly what "expands
// to 100%" describes on a many-column table. panePrintWidths() now reads every column's drawn
// width, dragged or not, so the budget/scale step always runs.
console.log('\n--- the sheet uses the column widths the reader dragged -- and now ALSO the ones nobody touched ---');
{
	const cg = (sheetEl) => {
		const t = (sheetEl.children || []).filter((c) => c._tag === 'table')[0];
		return { t, cols: t ? ((t.children || []).filter((c) => c._tag === 'colgroup')[0] || { children: [] }).children : [] };
	};
	L.forgetWidths('junctions');
	L.renderTable('junctions');
	let got = cg(L.buildPrintable('junctions'));
	report(got.cols.length === L.paneCols(L.paneTables().filter((s) => s.id === 'junctions')[0]).length &&
			String(got.t.className).indexOf('lpn-print-fixed') >= 0,
		'a table nobody has resized STILL goes through the fixed-layout/budget path', got.cols.length + ' cols, class=' + got.t.className);
	report(!!got.t.style.fontSize, '...and, drawn at the stub\'s generous default width, its font is already scaled to the page budget',
		got.t.style.fontSize);
	const keys = L.paneCols(L.paneTables().filter((s) => s.id === 'junctions')[0]).map((c) => c.key);
	L.setUserWidth('junctions', keys[1], 20);
	L.renderTable('junctions');
	// The stub draws every box 1000 px wide; a heading is drawn at 2 em here (32 px at the stub's
	// 16 px em) so this scenario's sum stays comfortably under the 60em print budget -- the second
	// scenario below is the one that tests going past it.
	const heads = L.headCells('junctions');
	Object.keys(heads).forEach((k) => { heads[k].getBoundingClientRect = () => ({ left: 0, top: 0, right: 32, bottom: 20, width: 32, height: 20 }); });
	got = cg(L.buildPrintable('junctions'));
	// **LITERAL `em`, NOT A PERCENTAGE OF THE TABLE'S OWN CAPPED WIDTH** (Tom, 2026-09-22: "Print
	// is not respecting on-screen column widths"). A percentage share stayed proportional even
	// when `max-width: 100%` squeezed the table narrower than its declared width, while the 9pt
	// font did not shrink with it — see panePrintWidths()'s own comment for the failure this
	// replaced.
	const ems = got.cols.map((c) => parseFloat(c.style.width));
	const total = ems.reduce((a, b) => a + b, 0);
	report(got.cols.length === keys.length, 'once a column is dragged, every printed column is given a width',
		got.cols.length + ' / ' + keys.length);
	report(got.cols.every((c) => /em$/.test(c.style.width)), '...each one a literal em, not a share of the page');
	report(Math.abs(ems[1] / ems[0] - 10) < 0.02, '...in the screen’s proportions: the column dragged to 20 em is ten times a 2 em one',
		ems[1] + 'em / ' + ems[0] + 'em');
	report(/em$/.test(got.t.style.width) && String(got.t.className).indexOf('lpn-print-fixed') >= 0,
		'the table is the sum of the widths in em, fixed layout, so the widths are obeyed', got.t.style.width);
	report(!got.t.style.fontSize, '...and a table under the page budget keeps the sheet’s own font size',
		JSON.stringify(got.t.style.fontSize));
	report(/\.lpn-print-table\.lpn-print-fixed \{ table-layout: fixed; max-width: 100%; \}/.test(css),
		'...never wider than the sheet, as a safety net for a page narrower than assumed');
	L.forgetWidths('junctions');

	// **A TABLE WIDER THAN THE ASSUMED PAGE SHRINKS ITS OWN FONT, NOT ITS COLUMNS' SHARE OF IT.**
	// Fourteen ordinary columns (Net3's own Junctions table has thirteen) at a generous drawn width
	// is the everyday case this was written for, not an edge case: the fix has to hold with no
	// column dragged to an extreme, just enough of them to add past the budget.
	L.setUserWidth('junctions', keys[1], 20);
	Object.keys(heads).forEach((k) => { heads[k].getBoundingClientRect = () => ({ left: 0, top: 0, right: 80, bottom: 20, width: 80, height: 20 }); });
	L.renderTable('junctions');
	got = cg(L.buildPrintable('junctions'));
	const ems2 = got.cols.map((c) => parseFloat(c.style.width));
	const sum2 = ems2.reduce((a, b) => a + b, 0);
	report(sum2 > 60, 'this scenario really is past the 60em budget', sum2.toFixed(2) + 'em');
	report(Math.abs(ems2[1] / ems2[0] - 4) < 0.02,
		'...the columns keep the screen’s proportions regardless', ems2[1] + 'em / ' + ems2[0] + 'em');
	const wantScale = 60 / sum2, wantPt = Math.round(9 * wantScale * 100) / 100;
	report(got.t.style.fontSize === wantPt + 'pt',
		'...and the SHEET’S FONT shrinks by the same factor a column would have been squeezed by',
		got.t.style.fontSize + ' vs expected ' + wantPt + 'pt');
	report(parseFloat(got.t.style.width) === Math.round(sum2 * 100) / 100,
		'...while every column keeps its true em width, so text and box shrink together');
	L.forgetWidths('junctions');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

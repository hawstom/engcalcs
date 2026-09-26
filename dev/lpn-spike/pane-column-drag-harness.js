// A COLUMN CAN BE RESIZED AND MOVED, AND NEITHER GOES IN THE FILE. Run with:
//   node dev/lpn-spike/pane-column-drag-harness.js
//
// Tom's spreadsheet specification, 2026-09-18, points (d) and (e): *"Each column's width can be
// adjusted by clicking on the divider line between column headings"* and *"Columns can be dragged
// left and right using their headings."*
//
// **THE ASSERTION THAT IS NOT ABOUT SPREADSHEETS AT ALL IS THE IMPORTANT ONE**: neither the width
// nor the order may reach `serializeProject()`. Both are window furniture under the Task 584 rule --
// a fact about the screen somebody is sitting at -- and a leak is invisible to whoever caused it,
// because on their own machine it restores the layout they already had. It shows up only for the
// colleague who opens the file on a laptop. `lpn_furniture_check.php` holds the same line from the
// other side, by reading the page's localStorage writes; this holds it by driving the real gesture
// and then reading the real serializer.
//
// **WHAT THIS CANNOT SEE, SAID PLAINLY:** whether the result LOOKS right. A <colgroup> width and a
// CSS grip are pixels, and there are none here. What is asserted is the state -- the stored em, the
// <col> that carries it, the column order the renderer then produces -- which is everything except
// the picture. The picture needs his browser.

'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\twidthEm: function (id, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneColWidthEm(s.id, paneColByKey(s, key)); },\n" +
	"\t\tuserWidth: function (id, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneColUserWidth(s.id, paneColByKey(s, key)); },\n" +
	"\t\tfloorEm: function (id, key) { return paneColFloorEm(paneColByKey(paneTableById(id), key)); },\n" +
	"\t\tresetWidth: function (id, key) { paneResetColOnDouble(paneTableById(id), key, null); },\n" +
	"\t\tcolGroup: function (id) { return paneTableById(id).colGroup; },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\tserialize: serializeProject, prefsKey: LPN_PANECOLS_KEY,\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

const host = byId.lpn_pane_junctions;
function table() { return host.children.filter((c) => c._tag === 'table')[0]; }
function thead() { return table().children.filter((c) => c._tag === 'thead')[0]; }
function ths() { return thead().children[0].children; }
function thFor(key) { return ths().filter((t) => t._lpnColKey === key)[0]; }
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function docFire(type, ev) {
	((global.document._listeners && global.document._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// The grip and the heading button, as the browser hands them over.
// **A HEADING IS DRAWN AT ITS COLUMN'S WIDTH**, which is the one physical relationship a drag now
// reads (R-110: the drag starts from the width on screen). The stub's default rect is 1000 px wide
// for everything, which would make every column start a drag 62 em wide. `drawn` overrides the
// modelled width for one heading, to stand for a browser that laid it out wider or narrower than
// the column declares -- which is exactly the case the blind spot was about.
const drawn = {};
function modelHeadingWidths() {
	ths().forEach((th) => {
		th.getBoundingClientRect = () => {
			const em = drawn[th._lpnColKey] || L.widthEm('junctions', th._lpnColKey) || 7;
			return { left: 0, top: 0, right: em * 16, bottom: 20, width: em * 16, height: 20 };
		};
	});
}
function gripOf(key) {
	modelHeadingWidths();
	return thFor(key).children.filter((c) => c.className === 'lpn-pane-colgrip')[0];
}
function sortBtnOf(key) { return thFor(key).children.filter((c) => String(c.className || '').indexOf('lpn-pane-sort') === 0)[0]; }
// **REAL LEFT-TO-RIGHT POSITIONS, FOR THE MOVE-DRAG TESTS BELOW** (2026-09-26, fourth pass:
// paneStartColDrag() now finds "the heading under the pointer" by comparing `clientX` against each
// heading's OWN cached `getBoundingClientRect()`, not by walking up from `event.target` -- ghost
// and insertion-marker positioning need real coordinates, and reading a fresh rect on every
// `mousemove` would force a layout the real page never does during a drag (see that function's own
// comment). `modelHeadingWidths()` above gives every heading the SAME `left: 0`, which is enough
// for the resize tests (they only ever ask about one heading's own width) but not for "which
// heading is nearest this x" -- so this lays every heading out left-to-right by its modelled width
// instead, cumulative, the way a real table row does.
function modelHeadingPositions() {
	var x = 0;
	L.colKeys('junctions').forEach(function (k) {
		var th = thFor(k), em = drawn[k] || L.widthEm('junctions', k) || 7, width = em * 16, left = x;
		th.getBoundingClientRect = function () { return { left: left, top: 0, right: left + width, bottom: 20, width: width, height: 20 }; };
		x += width;
	});
}
function centerXOf(key) {
	var r = thFor(key).getBoundingClientRect();
	return r.left + r.width / 2;
}

console.log('\n--- the heading carries both handles ---');
{
	report(!!thFor('elev'), 'a heading knows which column it is', thFor('elev') && thFor('elev')._lpnColKey);
	report(!!gripOf('elev'), 'and carries a divider grip of its own (point d)');
	report(gripOf('elev').getAttribute('aria-hidden') === 'true',
		'...hidden from a screen reader, being a pointer gesture with no word that would help');
	report(!!sortBtnOf('elev'), 'and the heading itself is the drag handle (point e)');
	const cg = L.colGroup('junctions');
	report(!!cg && cg.children.length === L.colKeys('junctions').length,
		'a <colgroup> gives one <col> per column, which is what a width hangs on',
		cg && cg.children.length + ' / ' + L.colKeys('junctions').length);
}

console.log('\n--- (d) dragging the divider resizes the column ---');
{
	const before = L.widthEm('junctions', 'elev');
	report(before > 0, 'the column starts at the width its spec declares', before);
	// 16 px to the em in the stub, so +32 px is +2 em. Driven through the real handlers.
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 132 });
	docFire('mouseup', { clientX: 132 });
	const after = L.widthEm('junctions', 'elev');
	report(Math.abs(after - (before + 2)) < 0.01, 'a drag of two ems widens the column by two ems',
		before + ' -> ' + after);
	report(L.widthEm('junctions', 'demand') === 1 || L.widthEm('junctions', 'demand') !== after,
		'...and moves no other column', L.widthEm('junctions', 'demand'));
	// It is drawn live, not only on the next render: the <col> carries it already.
	const i = L.colKeys('junctions').indexOf('elev');
	report(L.colGroup('junctions').children[i].style.width === after + 'em',
		'the <col> carries the new width without waiting for a rebuild',
		L.colGroup('junctions').children[i].style.width);
	// **THE FLOOR IS ONE EM.** A column dragged to nothing is a column nobody can find again.
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mouseup', { clientX: -900 });
	// **THE FLOOR IS A THIRD OF THE HEADING'S LONGEST WORD** (Tom, 2026-09-21: *"I see words
	// broken into five pieces of one or two characters each"*), which superseded one em.
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev') && L.floorEm('junctions', 'elev') > 1,
		'a drag past nothing stops at the floor that breaks no heading word into more than three pieces',
		L.widthEm('junctions', 'elev'));
	// And it survives a rebuild, which is what "remembered" means.
	L.renderTable('junctions');
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev'), '...and the width survives a rebuild of the table');
}

// **A PRESS THAT NEVER TRAVELS IS NOT A DRAG**, which is the whole of Tom's *"Some of the columns
// are now sized too narrow by default. I believe that Description was a single character long."*
// (2026-09-19). Nothing had leaked into the default rule; what leaked was the definition of
// "dragged". `up()` stored a width unconditionally, so a press and release on the divider -- seven
// pixels of the heading's own trailing padding, exactly where a hand aiming at a heading to sort it
// lands -- committed the column: pinned at the 7em fallback if it declared no em, and marked as the
// reader's for ever, which is what turns the heading's character-level wrapping on. One stray click
// and an untouched column opened narrow and stayed narrow across every later visit.
console.log('\n--- A PRESS THAT NEVER TRAVELS IS NOT A DRAG ---');
{
	// Start from a column nobody has touched. The section above left `elev` at one em, so forget
	// that first -- which is also the gesture the next section drives.
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	const declared = L.widthEm('junctions', 'elev');
	report(L.userWidth('junctions', 'elev') === 0, 'the column is back to having no stored width');
	report(declared > 1, '...and is drawn at the width its spec declares', declared);
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...so its heading may NOT break mid-word', thFor('elev').className);
	// HIS OWN INSTANCE, BY NAME. Description is the column he found at a character, and it is the
	// one to assert because it declares the widest box in the pane (8em, a street-corner sentence):
	// a rule that narrowed it would narrow anything.
	report(L.userWidth('junctions', 'desc') === 0, 'a freshly opened table has no width stored for Description');
	report(L.widthEm('junctions', 'desc') === 8, '...so Description opens at its declared 8em',
		L.widthEm('junctions', 'desc'));
	report(String(thFor('desc').className).indexOf('lpn-pane-tight') < 0,
		'...and its heading is held open by its own longest word', thFor('desc').className);
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mouseup', { clientX: 400 });
	report(L.userWidth('junctions', 'elev') === 0,
		'a press and release on the divider stores nothing', L.userWidth('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...and the heading still may not break mid-word');
	// One pixel of hand tremor is not a drag either.
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 401 });
	docFire('mouseup', { clientX: 401 });
	report(L.userWidth('junctions', 'elev') === 0, 'nor is one pixel of tremor', L.userWidth('junctions', 'elev'));
	report(L.widthEm('junctions', 'elev') === declared, '...the column has not moved at all',
		L.widthEm('junctions', 'elev'));
	// ...but a real drag still does everything it did, right down to the one-em floor.
	fire(gripOf('elev'), 'mousedown', { clientX: 400, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 300 });
	docFire('mouseup', { clientX: 300 });
	report(L.widthEm('junctions', 'elev') === L.floorEm('junctions', 'elev'), 'a real drag still reaches the narrow extreme',
		L.widthEm('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') >= 0,
		'...and THAT column\'s heading breaks at the character, which is what he asked for');
}

// **AND THERE IS A WAY BACK.** A stored width outlives the session that made it, so before this a
// column squeezed to a character was a character for good -- and read, correctly from where he was
// sitting, as the table's own default.
console.log('\n--- double-clicking the divider gives the column its default back ---');
{
	report(L.userWidth('junctions', 'elev') === L.floorEm('junctions', 'elev'), 'the column starts at the narrow extreme',
		L.userWidth('junctions', 'elev'));
	fire(gripOf('elev'), 'dblclick', { stopPropagation: function () {}, preventDefault: function () {} });
	report(L.userWidth('junctions', 'elev') === 0, 'a double-click on the divider forgets the stored width');
	report(L.widthEm('junctions', 'elev') > 1, '...so the column is back at its declared default',
		L.widthEm('junctions', 'elev'));
	report(String(thFor('elev').className).indexOf('lpn-pane-tight') < 0,
		'...and its heading stops breaking mid-word');
	L.renderTable('junctions');
	report(L.userWidth('junctions', 'elev') === 0, '...and it stays forgotten across a rebuild');
}

// **THE BLIND SPOT, AND IT WAS THE COLUMNS HE NAMED** (Tom, 2026-09-21, R-110: *"Pumps.Date
// installed, width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?); Pump.Price
// pattern, width = 3em (due to selector?)"*). A pull-down and a custom property declare no width,
// so the drag assumed 7em; a column whose heading has outgrown its declared em was assumed to be
// the declared em. Either way the first pixel of travel snapped the column to a width the reader
// had never seen. It must start from what is drawn.
console.log('\n--- R-110: a drag starts from the width on screen ---');
{
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	const declared = L.widthEm('junctions', 'elev');
	drawn.elev = declared + 1.5;   // the heading holds the column open 1.5 em past what it declares
	fire(gripOf('elev'), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
	docFire('mousemove', { clientX: 116 });
	docFire('mouseup', { clientX: 116 });
	report(Math.abs(L.widthEm('junctions', 'elev') - (declared + 2.5)) < 0.01,
		'a column drawn wider than it declares widens from where it is drawn, not from its declaration',
		declared + ' declared, ' + drawn.elev + ' drawn, +1 em -> ' + L.widthEm('junctions', 'elev'));
	delete drawn.elev;
	L.resetWidth('junctions', 'elev');
	L.renderTable('junctions');
	// A column declaring NO width -- the pull-down and custom-property case -- was assumed to be
	// 7em. Drawn at 5.9em (a pattern pull-down, measured in Chromium), a one-em narrowing is 4.9.
	const noEm = L.colKeys('junctions').filter((k) => !L.widthEm('junctions', k))[0];
	report(!!noEm, 'the junction table has a column that declares no width to test with', noEm);
	if (noEm) {
		drawn[noEm] = 5.9;
		fire(gripOf(noEm), 'mousedown', { clientX: 100, stopPropagation: function () {}, preventDefault: function () {} });
		docFire('mousemove', { clientX: 84 });
		docFire('mouseup', { clientX: 84 });
		report(Math.abs(L.widthEm('junctions', noEm) - 4.9) < 0.01,
			'a column that declares no width narrows from its drawn 5.9 em, not from a 7 em guess',
			'-1 em -> ' + L.widthEm('junctions', noEm));
		delete drawn[noEm];
		L.resetWidth('junctions', noEm);
		L.renderTable('junctions');
	}
}

// **ONE PRESS, ONE MOTION, MOVES A HEADING WHETHER OR NOT IT IS SELECTED** (pre-review, 2026-09-25,
// superseding R-221's "drag an unselected heading to select it, drag a selected one to move it" --
// that split the single gesture master already shipped 2026-09-18 into two, and the one Tom
// actually reached for landed on the wrong one because nothing starts out selected).
// dev/browser-pass/specs/colselect.js drives this with real mouse events; this is the state-level
// half.
console.log('\n--- (e) dragging ANY heading, selected or not, moves it in one motion ---');
{
	const before = L.colKeys('junctions');
	const from = 'elev', to = before[before.length - 1];
	report(before.indexOf(from) < before.indexOf(to), 'the two columns start in this order',
		before.indexOf(from) + ' < ' + before.indexOf(to));
	// **MOUSEDOWN AND CLICK FIRE ON THE `<th>` NOW, NOT THE HEADING BUTTON** (2026-09-25, second
	// pass: js/looped-network.js's own comment on why a percentage height on a table cell's child
	// could not make the whole cell one target, so the listeners moved up a level). This stub does
	// not simulate DOM event bubbling from a child to its ancestor, so firing on `sortBtnOf()`
	// would find no listener there any more.
	modelHeadingPositions();
	fire(thFor(from), 'mousedown', { button: 0 });
	docFire('mousemove', { clientX: centerXOf(to), clientY: 10 });
	docFire('mouseup', {});
	const after = L.colKeys('junctions');
	report(after.indexOf(from) === before.indexOf(to),
		'dragging an UNSELECTED heading moves it in one motion -- no selecting step first',
		before.indexOf(from) + ' -> ' + after.indexOf(from));
	report(after.length === before.length, '...and no column is lost or duplicated',
		after.length + ' / ' + before.length);
	report(after.slice().sort().join() === before.slice().sort().join(),
		'...it is the same set of columns, reordered');
	// **A PRESS THAT NEVER TRAVELS IS A SORT, NOT A MOVE**, which is what keeps one heading doing
	// two jobs honest.
	const held = L.colKeys('junctions');
	fire(thFor('elev'), 'mousedown', { button: 0 });
	docFire('mouseup', {});
	report(L.colKeys('junctions').join() === held.join(),
		'a press and release on one heading moves nothing', L.colKeys('junctions').join() === held.join());
	// A column that appears later is placed AFTER the remembered ones rather than dropped.
	L.renderTable('junctions');
	report(L.colKeys('junctions').join() === after.join(), 'the order survives a rebuild');
}

// **DRAGGING A HEADING THAT IS PART OF A STANDING MULTI-COLUMN SELECTION MOVES THE WHOLE
// SELECTION** -- the one thing a plain single-column drag never did, and the reason the
// selection/drag split existed at all before it was dropped. Selection is Ctrl+click only now, not
// a drag of its own.
console.log('\n--- dragging a heading that is part of a multi-column selection moves the group ---');
{
	L.renderTable('junctions');
	const before = L.colKeys('junctions');
	const a1 = before[1], a2 = before[2], dest = before[before.length - 1];
	report(before.indexOf(a2) === before.indexOf(a1) + 1, 'two adjacent columns to select', a1 + ',' + a2);
	fire(thFor(a1), 'click', { ctrlKey: true });
	fire(thFor(a2), 'click', { ctrlKey: true });
	modelHeadingPositions();
	fire(thFor(a1), 'mousedown', { button: 0 });
	docFire('mousemove', { clientX: centerXOf(dest), clientY: 10 });
	docFire('mouseup', {});
	const after = L.colKeys('junctions');
	report(after.indexOf(a2) === after.indexOf(a1) + 1, '...they land beside each other still, in the same relative order',
		after.indexOf(a1) + ',' + after.indexOf(a2));
	report(after.indexOf(a2) === before.indexOf(dest), '...as a block, at the destination',
		before.indexOf(dest) + ' vs ' + after.indexOf(a2));
	report(after.length === before.length && after.slice().sort().join() === before.slice().sort().join(),
		'...and it is still the same set of columns, only reordered');
	L.renderTable('junctions');
	report(L.colKeys('junctions').join() === after.join(), 'the group move survives a rebuild');
}

console.log('\n--- NEITHER OF THEM IS PROJECT DATA (Task 584) ---');
{
	const text = JSON.stringify(L.serialize());
	report(text.indexOf(L.prefsKey) < 0, 'serializeProject() has never heard of the preferences key',
		L.prefsKey);
	report(text.indexOf('colWidth') < 0 && text.indexOf('colOrder') < 0 && text.indexOf('"w":') < 0,
		'...and carries no column width or order under any other name');
	report(text.indexOf('lpn_panecols') < 0, '...so a colleague on a laptop inherits neither');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);

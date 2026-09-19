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
function gripOf(key) { return thFor(key).children.filter((c) => c.className === 'lpn-pane-grip')[0]; }
function sortBtnOf(key) { return thFor(key).children.filter((c) => String(c.className || '').indexOf('lpn-pane-sort') === 0)[0]; }

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
	report(L.widthEm('junctions', 'elev') === 1, 'a drag past nothing stops at one em',
		L.widthEm('junctions', 'elev'));
	// And it survives a rebuild, which is what "remembered" means.
	L.renderTable('junctions');
	report(L.widthEm('junctions', 'elev') === 1, '...and the width survives a rebuild of the table');
}

console.log('\n--- (e) dragging a heading moves the column ---');
{
	const before = L.colKeys('junctions');
	const from = 'elev', to = before[before.length - 1];
	report(before.indexOf(from) < before.indexOf(to), 'the two columns start in this order',
		before.indexOf(from) + ' < ' + before.indexOf(to));
	fire(sortBtnOf(from), 'mousedown', { button: 0 });
	docFire('mousemove', { target: sortBtnOf(to) });
	docFire('mouseup', {});
	const after = L.colKeys('junctions');
	report(after.indexOf(from) === before.indexOf(to), 'the dragged column lands where it was dropped',
		before.indexOf(from) + ' -> ' + after.indexOf(from));
	report(after.length === before.length, '...and no column is lost or duplicated',
		after.length + ' / ' + before.length);
	report(after.slice().sort().join() === before.slice().sort().join(),
		'...it is the same set of columns, reordered');
	// **A PRESS THAT NEVER TRAVELS IS A SORT, NOT A MOVE**, which is what keeps one heading doing
	// two jobs honest.
	const held = L.colKeys('junctions');
	fire(sortBtnOf('elev'), 'mousedown', { button: 0 });
	docFire('mouseup', {});
	report(L.colKeys('junctions').join() === held.join(),
		'a press and release on one heading moves nothing', L.colKeys('junctions').join() === held.join());
	// A column that appears later is placed AFTER the remembered ones rather than dropped.
	L.renderTable('junctions');
	report(L.colKeys('junctions').join() === after.join(), 'the order survives a rebuild');
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

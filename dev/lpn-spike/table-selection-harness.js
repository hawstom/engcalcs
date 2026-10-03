// SELECTION ONLY, THE TABLES PANE FILTERED TO THE MAP SELECTION -- ROADMAP Task 757. Run with:
//   node dev/lpn-spike/table-selection-harness.js
//
// Tom, 2026-10-03: "it would be really nice if the tables could filter on the selection."
// Three doors (the header button, a row on the table's right-click menu, Ctrl+Shift+L), one
// snapshot. What this asserts, through the page's own doors:
//   1. each door turns it on for EVERY table, and the banner says "Selection only";
//   2. a snapshot, not live: a later map click changes nothing until a door is pressed again;
//   3. pressed again with a changed selection it re-takes it; unchanged, it turns off;
//   4. an edited row stays; a row pasted in while it is on JOINS the set;
//   5. ANDed with a Find filter, and the banner names both;
//   6. nothing selected: the press refuses with a notice, and the menu row is absent;
//   7. a table with none of the selection says so plainly;
//   8. Show all clears it, and Ctrl+Shift+L does not collide with another binding.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

// The pane head's shape, because the buttons are inserted into the strip.
ensure('lpn_pane_strip');
byId.lpn_pane_head.appendChild(byId.lpn_pane_strip);
byId.lpn_pane_strip.appendChild(byId.lpn_pane_tabs);

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, setProp: setProp,\n" +
	"\t\twirePane: wirePane, openPane: openPane, setPaneTab: setPaneTab,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tselect: function (list) { setSelectionList(list); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcell: function (id, elId, key) { return paneTableById(id).cells[elId][key]; },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\tctxMenu: function (id, elId, key) { var s = paneTableById(id); paneOpenContextMenu(s, 1, 1, s.tds[elId][key]); },\n" +
	"\t\tselectCell: function (id, elId, key) { paneTableById(id).sel = { aId: elId, aKey: key, fId: elId, fKey: key }; },\n" +
	"\t\tselectBox: function (id, key, r0, r1) { var s = paneTableById(id), rows = paneTableRowsInOrder(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: key, fId: rows[r1].id, fKey: key }; },\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
	"\t\tsetFilter: paneSetFilter,\n" +
	"\t\tqueryFor: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findQueryString(); },\n" +
	"\t\tbannerText: function (id) { var s = paneTableById(id), host = document.getElementById(s.panel), t = '';\n" +
	"\t\t\t(function walk(e) { if (/lpn-pane-filter/.test(e.className || '') && !t) { t = e.textContent ||\n" +
	"\t\t\t\t(e.children || []).map(function (c) { return c.textContent || ''; }).join(' '); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(host);\n" +
	"\t\t\treturn t; },\n" +
	"\t\tnoteText: function (id) { var host = document.getElementById(paneTableById(id).panel), t = '';\n" +
	"\t\t\t(function walk(e) { if (/lpn-lib-note/.test(e.className || '')) { t = e.textContent || ''; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(host);\n" +
	"\t\t\treturn t; },\n" +
	"\t\ton: function () { return paneSelFilterOn(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
L.wirePane();
// The stub's getElementById knows only registered ids, so the built button is registered here.
byId.lpn_pane_selonly = byId.lpn_pane_strip.children.filter((c) => c.id === 'lpn_pane_selonly')[0];
byId.lpn_pane_print = byId.lpn_pane_strip.children.filter((c) => c.id === 'lpn_pane_print')[0];

const PC = global.EngCalcs.pageConfig;
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function tableEl(id) { return byId['lpn_pane_' + id].children.filter((c) => c._tag === 'table')[0]; }
function chord(id, key) {
	let prevented = false;
	fire(tableEl(id), 'keydown', { key, shiftKey: true, ctrlKey: true, metaKey: false, altKey: false,
		preventDefault: function () { prevented = true; } });
	return prevented;
}
function button() { return byId.lpn_pane_strip.children.filter((c) => c.id === 'lpn_pane_selonly')[0]; }
function pressButton() { fire(button(), 'click', {}); }
function menuEl() { return global.document.body.children.filter((c) => c.className === 'lpn-pane-ctxmenu').slice(-1)[0]; }
function menuItem() {
	const m = menuEl();
	return m && m.children.filter((b) => (b.textContent || '').indexOf(PC.lpn_pane_sel_only) >= 0)[0];
}
function say(key, vals) {
	let t = String(PC[key]);
	Object.keys(vals || {}).forEach((k) => { t = t.replace('{' + k + '}', String(vals[k])); });
	return t;
}
function order(id) { return L.tableOrder(id).join(','); }
function sel(...refs) { L.select(refs.map((r) => ({ kind: r[0], id: r[1] }))); }

// Five junctions J1..J5, one reservoir, two pipes.
const J = [1, 2, 3, 4, 5].map((i) => L.addNode('junction', 10 * i, 0).id);
const [J1, J2, J3, J4, J5] = J;
J.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
const R1 = L.addNode('reservoir', 0, 10).id;
const P1 = L.addLink('pipe', J1, J2).id;
const P2 = L.addLink('pipe', J2, J3).id;
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- 0. nothing selected: the door refuses ---');
report(!!button(), 'the header has a Selection only button');
report(button().textContent === PC.lpn_pane_sel_only, '...worded from the language file', button().textContent);
pressButton();
report(!L.on() && L.notice() === PC.lpn_pane_sel_only_none, 'pressing it with nothing selected refuses with a notice', L.notice());
report(order('junctions') === [J1, J2, J3, J4, J5].join(','), '...and the table is untouched');
L.selectCell('junctions', J1, 'elev');
L.ctxMenu('junctions', J1, 'elev');
report(!!menuEl() && !menuItem(), 'the right-click menu does not offer it with nothing selected');
chord('junctions', 'L');
report(!L.on(), 'Ctrl+Shift+L with nothing selected refuses too');

console.log('\n--- 1. the button turns it on for every table ---');
sel(['node', J2], ['node', J4], ['link', P1]);
pressButton();
report(L.on(), 'it is on');
report(button().getAttribute('aria-pressed') === 'true', '...and the button is pressed');
report(order('junctions') === [J2, J4].join(','), 'Junctions shows only the two selected', order('junctions'));
L.renderTable('pipes');
report(order('pipes') === P1, 'Pipes shows only the selected pipe', order('pipes'));
report(L.bannerText('junctions').indexOf(say('lpn_pane_filter_sel_note', { n: 2, all: 5 })) === 0,
	'the banner says Selection only, 2 of 5', L.bannerText('junctions'));

console.log('\n--- 2. a snapshot, not live ---');
sel(['node', J1]);
report(order('junctions') === [J2, J4].join(','), 'a later map click changes no table', order('junctions'));

console.log('\n--- 3. pressed again: changed selection re-takes; unchanged turns off ---');
pressButton();
report(L.on() && order('junctions') === J1, 'a changed selection re-applies to the new one', order('junctions'));
pressButton();
report(!L.on() && order('junctions') === J.join(','), 'the selection unchanged: it turns off', order('junctions'));
report(button().getAttribute('aria-pressed') === 'false', '...and the button is released');
report(L.bannerText('junctions') === '', '...and the banner is gone', L.bannerText('junctions'));

console.log('\n--- 4. the right-click row ---');
sel(['node', J3], ['node', J5]);
L.selectCell('junctions', J1, 'elev');
L.ctxMenu('junctions', J1, 'elev');
let it = menuItem();
report(!!it, 'the menu offers Selection only once something is selected', it && it.textContent);
report(it && it.textContent.indexOf('Ctrl+Shift+L') > 0, '...with its shortcut', it && it.textContent);
fire(it, 'click', {});
report(L.on() && order('junctions') === [J3, J5].join(','), 'clicking it applies to the MAP selection, not the clicked row', order('junctions'));
L.selectCell('junctions', J3, 'elev');
L.ctxMenu('junctions', J3, 'elev');
it = menuItem();
report(it && it.textContent.indexOf('✓') === 0, 'with it on, the row carries a check mark', it && it.textContent);
fire(it, 'click', {});
report(!L.on(), 'and clicking it with the selection unchanged turns it off');

console.log('\n--- 5. Ctrl+Shift+L ---');
report(chord('junctions', 'L') === true && L.on() && order('junctions') === [J3, J5].join(','), 'Ctrl+Shift+L turns it on, and the key is claimed', order('junctions'));
chord('junctions', 'l');
report(!L.on(), 'pressed again with the selection unchanged, it turns off');

console.log('\n--- 6. an edited row stays; a pasted row joins ---');
sel(['node', J3], ['node', J5]);
pressButton();
L.setCell('junctions', J3, 'demand', 99);
L.renderTable('junctions');
report(order('junctions') === [J3, J5].join(','), 'an edited row never leaves', order('junctions'));
const r = L.pasteAppend('junctions', 'N1\t70\t0\nN2\t80\t0');
report(r && r.created === 2, 'two rows were pasted in as new', r && JSON.stringify(r));
L.renderTable('junctions');
report(order('junctions') === [J3, J5, 'N1', 'N2'].join(','), 'both JOIN the set rather than vanishing', order('junctions'));
const N3 = L.addNode('junction', 90, 0).id;
L.renderTable('junctions');
report(order('junctions').split(',').indexOf(N3) >= 0, 'a newly drawn element joins too', order('junctions'));
report(order('junctions').split(',').indexOf(J1) < 0, '...and an old unselected one stays out');
pressButton();   // selection unchanged: off
pressButton();   // nothing... selection is J3,J5 still: on again, now includes the new ones? no, the snapshot is of the selection
report(order('junctions') === [J3, J5].join(','), 'a fresh press re-takes the SELECTION only (the joined rows go)', order('junctions'));
pressButton();

console.log('\n--- 7. ANDed with a Find filter ---');
sel(['node', J1], ['node', J2], ['node', J4]);
L.setFilter('junctions', L.queryFor('junction', 'demand', 'gt', '0'));
report(order('junctions') !== J.join(',') && L.bannerText('junctions') !== '', 'a Find filter alone narrows Junctions', order('junctions'));
pressButton();
report(order('junctions') === [J2, J4].join(','), 'with Selection only, a row must pass both (J1 has demand 0)', order('junctions'));
report(L.bannerText('junctions').indexOf(say('lpn_pane_filter_sel_and', { q: L.queryFor('junction', 'demand', 'gt', '0'), n: 2, all: 8 })) === 0,
	'the banner names both', L.bannerText('junctions'));
pressButton();   // off
report(!L.on() && order('junctions') !== J.join(','), 'turning it off leaves the Find filter', order('junctions'));
L.setFilter('junctions', '');

console.log('\n--- 8. a table with none of the selection says so; Show all clears it ---');
sel(['node', J2]);
pressButton();
L.renderTable('reservoirs');
report(order('reservoirs') === '', 'Reservoirs has no row', order('reservoirs'));
report(L.noteText('reservoirs') === PC.lpn_pane_filter_sel_none, 'and says so plainly', L.noteText('reservoirs'));
report(L.bannerText('reservoirs').indexOf(say('lpn_pane_filter_sel_note', { n: 0, all: 1 })) === 0, 'the banner still counts 0 of 1', L.bannerText('reservoirs'));
(function clickShowAll() {
	let b = null;
	(function walk(e) { if (/lpn-pane-filter-clear/.test(e.className || '')) { b = e; } (e.children || []).forEach(walk); })(byId.lpn_pane_reservoirs);
	fire(b, 'click', {});
}());
report(!L.on() && order('junctions').split(',').sort().join(',') === [J1, J2, J3, J4, J5, 'N1', 'N2', N3].sort().join(','), 'Show all turns it off in every table', order('junctions'));

console.log('\n--- 9. the button is only on a table tab ---');
L.setPaneTab('profile');
report(button().style.display === 'none', 'on the Profile tab the button is hidden');
L.setPaneTab('junctions');
report(button().style.display !== 'none', '...and back on a table it shows');

console.log(`\n${checks - failures} of ${checks} passed`);
process.exit(failures ? 1 : 0);

// SHOW SCENARIOS IN THE TABLES (Tom, 2026-10-05). Run with:
//   node dev/lpn-spike/pane-show-scenarios-harness.js
//
// Tom: *"'Show scenarios' would ... show all the scenarios for every asset in the table."*, and on
// 2026-10-06: *"Scenario column only. Maybe a tip on each override can state the name of the
// alternative that holds that override: 'Demand alt.: Max day'"*. and *"every column
// sort preserves strictly the previous order of its rows with ties."* Asserted here:
//
//   1. The cell menu offers Show scenarios; pressing it inserts one column, Scenario, after ID.
//   2. Rows = assets x scenarios, in ID order, Base first within each asset.
//   3. Every property cell shows the value EFFECTIVE in its row's scenario, and a value set in that
//      scenario wears the override wash; Base rows never do.
//   4. An override cell's tip names the alternative holding it, "<Category> alt.: <name>".
//   8. A scenario added while shown puts the table back in natural order; 9. a rename shows at once.
//   5. A typed cell in a scenario row that is NOT the active one writes an override into THAT row's
//      scenario through setProp(), leaves Base and the active scenario alone, and a Base-owned
//      column (elevation) is read-only in a non-Base row.
//   6. Sorting is stable: rows that tie keep the order they had before the click, in the scenario
//      view and in the ordinary table.
//   7. Pressing it again restores the ordinary table.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tscenarioMenuRows: scenarioMenuRows,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\trows: function (id) { return paneTableRowsInOrder(paneTableById(id)); },\n" +
	"\t\ttext: function (id, row, key) { var s = paneTableById(id); return paneCellText(paneColByKey(s, key), row); },\n" +
	"\t\tplain: function (id, row, key) { var s = paneTableById(id); return paneCellIsPlain(paneColByKey(s, key), row); },\n" +
	"\t\tsort: function (id, key) { sortPaneTable(paneTableById(id), key); },\n" +
	"\t\tselectCell: function (id, rowId, key) { paneTableById(id).sel = { aId: rowId, aKey: key, fId: rowId, fKey: key }; },\n" +
	"\t\ttd: function (id, rowId, key) { var s = paneTableById(id); return s.tds[rowId] && s.tds[rowId][key]; },\n" +
	"\t\tcell: function (id, rowId, key) { var s = paneTableById(id); return s.cells[rowId] && s.cells[rowId][key]; },\n" +
	"\t\tsetProp: setProp, effective: effective, baseValue: baseValue,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveId: function () { return activeScenario().id; }, baseId: function () { return baseScenario().id; },\n" +
	"\t\toverrides: function (scnId) { return scenarioById(scnId).overrides; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function tableEl(id) { return global.document.getElementById('lpn_pane_' + id).children.filter((c) => c._tag === 'table')[0]; }
function menuEl() { return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0]; }
function openMenu(id, rowId, key) {
	L.selectCell(id, rowId, key);
	const td = L.td(id, rowId, key);
	fire(tableEl(id), 'contextmenu', { target: td, clientX: 10, clientY: 20, preventDefault: function () {} });
	return menuEl();
}
const PC = () => global.EngCalcs.pageConfig;
function menuItem(menu, word) { return menu ? menu.children.filter((b) => b.textContent.indexOf(word) >= 0)[0] : null; }
const SEP = String.fromCharCode(1);
function hasClass(td, cls) { return !!td && String(td.className || '').split(/\s+/).indexOf(cls) >= 0; }

// Three junctions, two scenarios besides Base.
const J = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)];
J.forEach((n, i) => { L.setProp(n, 'elev', 100); L.setProp(n, 'demand', 10 * (i + 1)); });
const peak = L.createScenario('Peak Hour');          // createScenario() makes it the active one
L.setProp(J[1], 'demand', 99);
const fire1 = L.createScenario('Fire');
L.setProp(J[0], 'fireFlow', 1500);
L.switchScenario(L.baseId());
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- 1. the cell menu offers Show scenarios, and it inserts Scenario after ID ---');
let menu = openMenu('junctions', J[0].id, 'demand');
const showItem = menuItem(menu, PC().lpn_pane_scn_show);
report(!!showItem, 'the cell menu has a Show scenarios row', menu && JSON.stringify(menu.children.map((b) => b.textContent)));
report(showItem && showItem.textContent.indexOf('✓') < 0, '...unticked while it is off');
fire(showItem, 'click', {});
const keys = L.colKeys('junctions');
report(keys.indexOf('id') === 0 &&
	keys[1] === 'scn_name' && keys.filter((k) => /^scn_/.test(k)).length === 1,
	'one column, Scenario, sits right after ID', keys.slice(0, 4).join(','));
menu = openMenu('junctions', J[0].id + SEP + L.baseId(), 'demand');
report(!!menuItem(menu, '\u2713 ' + PC().lpn_pane_scn_show), 'the menu row is ticked while it is on');
report(!menuItem(menu, PC().lpn_pane_paste_append) && !menuItem(menu, PC().lpn_pane_delete_element),
	'no Paste as new rows and no Delete element while scenarios are shown');

console.log('\n--- 2. one row per asset per scenario, ID first and Base first ---');
let rows = L.rows('junctions');
report(rows.length === 9, 'rows = 3 junctions x 3 scenarios', String(rows.length));
const want = [];
J.map((n) => n.id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach((id) => {
	['Base', 'Fire', 'Peak Hour'].forEach((s) => want.push(id + '/' + s));
});
const got = rows.map((r) => L.text('junctions', r, 'id') + '/' + L.text('junctions', r, 'scn_name'));
report(got.join('|') === want.join('|'), 'the natural order is ID, then Scenario with Base first', got.join(' | '));

function rowOf(n, scnId) { return rows.filter((r) => r.id === n.id + SEP + scnId)[0]; }

console.log('\n--- 3. each row shows its own scenario\'s value, and its local values wear the wash ---');
report(L.text('junctions', rowOf(J[1], L.baseId()), 'demand') === '20', 'J2 Base row shows Base\'s demand',
	L.text('junctions', rowOf(J[1], L.baseId()), 'demand'));
report(L.text('junctions', rowOf(J[1], peak.id), 'demand') === '99', 'J2 Peak Hour row shows the Peak Hour demand',
	L.text('junctions', rowOf(J[1], peak.id), 'demand'));
report(L.text('junctions', rowOf(J[1], fire1.id), 'demand') === '20', 'J2 Fire row inherits Base\'s demand',
	L.text('junctions', rowOf(J[1], fire1.id), 'demand'));
report(hasClass(L.td('junctions', J[1].id + SEP + peak.id, 'demand'), 'lpn-pane-ovcell'),
	'the J2 Peak Hour demand cell is marked as set in that scenario');
report(!hasClass(L.td('junctions', J[1].id + SEP + L.baseId(), 'demand'), 'lpn-pane-ovcell'),
	'the J2 Base demand cell is not');
report(!hasClass(L.td('junctions', J[0].id + SEP + peak.id, 'demand'), 'lpn-pane-ovcell'),
	'J1 Peak Hour demand, inherited, is not');

console.log('\n--- 4. an override cell\'s tip names the alternative that holds it ---');
// A wired tip keeps its words in data-bs-original-title, as Bootstrap does.
function tipOf(td) { return td ? (td.getAttribute('data-bs-original-title') || td.title || '') : ''; }
function altTip(cat, name) {
	return PC().lpn_pane_scn_alt_tip.split('{category}').join(PC()['lpn_alt_cat_' + cat]).split('{alternative}').join(name);
}
{
	const td4 = L.td('junctions', J[1].id + SEP + peak.id, 'demand');
	report(!!td4 && tipOf(td4) === altTip('demand', 'Peak Hour') && hasClass(td4, 'ec-help'),
		'J2\'s Peak Hour demand says Demand alt.: Peak Hour', tipOf(td4));
	const td4f = L.td('junctions', J[0].id + SEP + fire1.id, 'fireFlow');
	report(!!td4f && tipOf(td4f) === altTip('fireflow', 'Fire'), 'J1\'s Fire fire flow names the Fire flow alternative',
		tipOf(td4f));
	const td4b = L.td('junctions', J[1].id + SEP + L.baseId(), 'demand'), td4i = L.td('junctions', J[0].id + SEP + peak.id, 'demand');
	report(!tipOf(td4b) && !tipOf(td4i), 'a Base cell and an inherited cell carry no such tip');
}

console.log('\n--- 5. a typed cell writes into ITS row\'s scenario, through setProp() ---');
{
	const key = J[2].id + SEP + fire1.id, input = L.cell('junctions', key, 'demand');
	report(!!input && input._tag === 'input', 'the Fire row\'s demand cell is a box');
	input.value = '77';
	fire(input, 'change', {});
	const ov = L.overrides(fire1.id);
	const k = Object.keys(ov).filter((x) => ov[x].demand === 77)[0];
	report(!!k, 'the Fire scenario now holds an override of 77 for J3', JSON.stringify(ov));
	report(L.baseValue(J[2], 'demand') === 30, 'BASE DOES NOT MOVE', String(L.baseValue(J[2], 'demand')));
	report(JSON.stringify(L.overrides(peak.id)).indexOf('77') < 0, 'Peak Hour is untouched');
	report(L.activeId() === L.baseId(), 'the scenario showing is still Base');
	L.renderTable('junctions');
	rows = L.rows('junctions');
	report(L.text('junctions', rowOf(J[2], fire1.id), 'demand') === '77' &&
		hasClass(L.td('junctions', key, 'demand'), 'lpn-pane-ovcell'),
		'the cell reads 77 and now wears the wash');
	report(L.plain('junctions', rowOf(J[2], fire1.id), 'elev') === true &&
		L.plain('junctions', rowOf(J[2], L.baseId()), 'elev') === false,
		'elevation, which Base owns, is read-only in a scenario row and editable in the Base row');
	report(L.plain('junctions', rowOf(J[2], L.baseId()), 'id') === true, 'ID is read-only while scenarios are shown');
}

console.log('\n--- 6. every sort is stable: ties keep the previous order ---');
{
	L.sort('junctions', 'scn_name');
	rows = L.rows('junctions');
	const byScn = rows.map((r) => L.text('junctions', r, 'scn_name') + '/' + L.text('junctions', r, 'id'));
	const wantScn = [];
	['Base', 'Fire', 'Peak Hour'].forEach((s) => J.forEach((n) => wantScn.push(s + '/' + n.id)));
	report(byScn.join('|') === wantScn.join('|'),
		'sorting by Scenario keeps each scenario\'s rows in the previous ID order', byScn.join(' | '));
	// Elevation ties everywhere (100): the order must not move at all.
	const before = L.rows('junctions').map((r) => r.id).join('|');
	L.sort('junctions', 'elev');
	report(L.rows('junctions').map((r) => r.id).join('|') === before, 'a column where every row ties leaves the order alone');
	L.sort('junctions', 'elev');   // descending: ties still keep their order, not reversed
	report(L.rows('junctions').map((r) => r.id).join('|') === before, '...in descending order too');
	// Demand: Base 10/20/30, Fire 10/20/77, Peak 10/99/30. Ascending, ties in the Scenario order above.
	L.sort('junctions', 'demand');
	const dem = L.rows('junctions').map((r) => L.text('junctions', r, 'demand') + ':' + L.text('junctions', r, 'scn_name'));
	report(dem.slice(0, 3).join('|') === '10:Base|10:Fire|10:Peak Hour',
		'the three tied 10s keep the Scenario order they had', dem.join(' | '));
}

console.log('\n--- 7. pressing it again restores the ordinary table ---');
{
	menu = openMenu('junctions', L.rows('junctions')[0].id, 'demand');
	fire(menuItem(menu, PC().lpn_pane_scn_show), 'click', {});
	const k2 = L.colKeys('junctions');
	report(!k2.some((k) => /^scn_/.test(k)), 'the Scenario column is gone', k2.join(','));
	rows = L.rows('junctions');
	report(rows.length === 3 && rows.every((r) => !r._lpnScn), 'one row per junction again, each the element itself',
		String(rows.length));
	report(rows.map((r) => r.id).join('|') === J.map((n) => n.id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).join('|'),
		'in ID order');
	report(L.plain('junctions', rows[0], 'id') === false, 'ID is editable again');
}

console.log('\n--- the ordinary table sorts stably too ---');
{
	L.sort('junctions', 'id');   // already ascending by id: this flips it to descending
	const desc = L.rows('junctions').map((r) => r.id).join('|');
	L.sort('junctions', 'elev');  // all 100: ties keep the descending-ID order, not ID ascending
	report(L.rows('junctions').map((r) => r.id).join('|') === desc,
		'sorting a tied column keeps the previous (descending ID) order', L.rows('junctions').map((r) => r.id).join('|'));
}

console.log('\n--- 8. a scenario added while shown puts the table back in natural order ---');
{
	menu = openMenu('junctions', J[0].id, 'demand');
	fire(menuItem(menu, PC().lpn_pane_scn_show), 'click', {});
	L.sort('junctions', 'demand');   // a user order: by demand, not by ID
	L.sort('junctions', 'demand');   // descending
	L.createScenario('Average');
	L.switchScenario(L.baseId());
	L.renderTable('junctions');
	rows = L.rows('junctions');
	const got8 = rows.map((r) => L.text('junctions', r, 'id') + '/' + L.text('junctions', r, 'scn_name'));
	const want8 = [];
	J.map((n) => n.id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach((id) => {
		['Base', 'Average', 'Fire', 'Peak Hour'].forEach((sc) => want8.push(id + '/' + sc));
	});
	report(rows.length === 12, 'rows = 3 junctions x 4 scenarios', String(rows.length));
	report(got8.join('|') === want8.join('|'),
		'the new scenario\'s rows sit with their assets, in ID then Scenario order, not at the bottom', got8.join(' | '));
}

console.log('\n--- 9. renaming a scenario while shown renames its rows at once ---');
{
	L.switchScenario(peak.id);
	L.renderTable('junctions');
	const rename = L.scenarioMenuRows().filter((r) => r.icon === 'edit')[0];
	global.window.lpnDialogAnswerer = function (req) { return req.kind === 'prompt' ? 'Max Hour' : true; };
	try { rename.fn(); } finally { delete global.window.lpnDialogAnswerer; }
	const td9 = L.td('junctions', J[0].id + SEP + peak.id, 'scn_name');
	report(!!td9 && td9.textContent === 'Max Hour', 'the Scenario column reads the new name with no switch or solve',
		td9 && td9.textContent);
	const tip9 = L.td('junctions', J[1].id + SEP + peak.id, 'demand');
	report(!!tip9 && tipOf(tip9) === altTip('demand', 'Max Hour'), '...and so does the alternative its overrides name',
		tipOf(tip9));
	L.switchScenario(L.baseId());
}

console.log('\n--- a Base-owned choice reads like its Base pull-down in a scenario row ---');
{
	const a = L.addNode('junction', 0, 50), b = L.addNode('junction', 10, 50), pump = L.addLink('pump', a.id, b.id, []);
	L.openPane('pumps');
	const sp = L.paneTableById('pumps');
	if (!sp.scnRows) {
		L.renderTable('pumps');
		menu = openMenu('pumps', pump.id, 'speedPattern');
		fire(menuItem(menu, PC().lpn_pane_scn_show), 'click', {});
	}
	const baseSel = L.cell('pumps', pump.id + SEP + L.baseId(), 'speedPattern');
	const peakTd = L.td('pumps', pump.id + SEP + peak.id, 'speedPattern');
	const baseWord = baseSel && baseSel.children.filter((o) => o.value === baseSel.value)[0];
	report(!!peakTd && !!baseWord && peakTd.textContent === baseWord.textContent && peakTd.textContent !== '',
		'the read-only Speed pattern in a scenario row says what Base\'s pull-down says',
		JSON.stringify([peakTd && peakTd.textContent, baseWord && baseWord.textContent]));
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);

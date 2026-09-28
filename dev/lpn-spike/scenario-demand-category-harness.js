// A JUNCTION'S DEMAND LIST INSIDE A SCENARIO -- R-369. Run with:
//   node dev/lpn-spike/scenario-demand-category-harness.js
//
// Tom, 2026-09-28: *"Add a demand category in a scenario. It adds to Base. Bad."*
//
// **WHY BOTH EXISTING HARNESSES MISSED IT.** demand-category-harness.js drives every control in the
// demand table, in Base; scenario-harness.js drives scenarios, through ONE field -- row 0's base,
// the one cell that already went through setProp(). The defect lived in the gap between their
// vocabularies, which is dev/scenario-seam-repair.md's finding for the valve popup, repeated: the
// Add button, both kinds of remove, every pattern and description cell and every later row's base
// were plain writes to the Base document, so inside a scenario each one edited Base under every
// scenario at once.
//
// The fix makes the whole list ONE overridable property, `demands`. This drives the REAL popup
// controls inside a scenario and asks, of every one of them, the question that matters: did Base
// move? Then clearing, the Base-side push, undo, save and load, a file written before R-369 that
// overrides only `demand`, the solver, the .inp writer, a pattern rename, and Base itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved, assembleModel: assembleModel,\n" +
	"\t\teffective: effective, setProp: setProp, hasOverride: hasOverride, ovKey: ovKey,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tgetScenarios: function () { return scenarios; }, activeScenario: activeScenario,\n" +
	"\t\tresolvedDemand: resolvedDemand, baseDemandTotal: baseDemandTotal,\n" +
	"\t\trenderNodeFields: renderNodeFields, paneTables: paneTables, pushSpecs: pushSpecList,\n" +
	"\t\tpushBaseToScenarios: pushBaseToScenarios, labelSettings: function () { return labelSettings; },\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\tlibRenamePattern: libRenamePattern, libPatterns: libPatterns,\n" +
	"\t\texportOptions: inpExportOptions,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }

setUnitSet('us');
L.importInp({ name: 'multi-category.inp',
	_text: fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/multi-category.inp'), 'utf8') });
const J = (id) => L.getDoc().nodes.find(n => n.id === id);
// BASE, as the file states it -- the thing no scenario edit may move. The nodes only: a scenario
// edit legitimately changes `scenarios`, and nothing else in the document.
const baseNodes = () => JSON.stringify(L.getDoc().nodes);
const BASE0 = baseNodes();
// Pat1 is 0.6 at t = 0, Pat2 0.2, and the project default is Pat1.
const J1_BASE = 50 * 0.6 + 20 * 0.2 + 12.5 * 0.6;
const J4_BASE = 33 * 0.2;

function popupFor(id) {
	byId.lpn_popup_fields.children.length = 0;
	L.renderNodeFields(id);
	return byId.lpn_popup_fields.children;
}
function findAll(kids, tag) {
	const out = [];
	(function walk(list) {
		list.forEach((c) => {
			if (c.tagName === tag) { out.push(c); }
			if (c.children && c.children.length) { walk(c.children); }
		});
	})(kids);
	return out;
}
function table(id) {
	const kids = popupFor(id);
	const t = kids.filter(c => c.tagName === 'TABLE')[0];
	return {
		kids: kids,
		nums: findAll([t], 'INPUT').filter(i => i.type === 'number'),
		texts: findAll([t], 'INPUT').filter(i => i.type === 'text'),
		sels: findAll([t], 'SELECT'),
		dels: findAll([t], 'BUTTON').filter(b => b.textContent === '×'),
		add: findAll(kids, 'BUTTON').filter(b => b.textContent.indexOf(PC.lpn_demand_add) >= 0)[0],
		// The table's own marker is the first one AFTER it: the identity band above carries the
		// coordinates' markers, and ticking one of those is a different override entirely.
		marker: kids.slice(kids.indexOf(t)).filter(l => l.tagName === 'LABEL' && l.className === 'lpn-ov-marker')[0]
	};
}
function type(input, v) { input.value = v; input._listeners.change[0](); }
function ovOf(id) { return L.activeScenario().overrides[L.ovKey(J(id))] || {}; }

L.createScenario('Growth');
const SCN = L.getScenarios()[L.getScenarios().length - 1];
L.switchScenario(SCN.id);

// ---------------------------------------------------------------------------
// 1. Tom's report, exactly: Add demand category, in a scenario.
// ---------------------------------------------------------------------------
console.log('\n--- Add demand category, inside a scenario ---');
{
	const t = table('J4');
	t.add._listeners.click[0]();
	ok('BASE IS UNCHANGED by Add in a scenario', baseNodes() === BASE0);
	ok('...Base\'s J4 still has no second row', J('J4').extraDemands === undefined,
		JSON.stringify(J('J4').extraDemands));
	ok('the scenario holds J4\'s whole list as ONE override, two rows',
		Array.isArray(ovOf('J4').demands) && ovOf('J4').demands.length === 2, JSON.stringify(ovOf('J4')));
	const t2 = table('J4');
	ok('the popup, redrawn, shows the scenario\'s two rows', t2.nums.length === 2, String(t2.nums.length));
	type(t2.nums[1], '12.5');
	ok('typing the new row\'s base leaves Base alone', baseNodes() === BASE0);
	ok('...and the scenario\'s total demand includes the new row',
		near(L.resolvedDemand(J('J4')), 33 * 0.2 + 12.5 * 0.6), L.resolvedDemand(J('J4')) + ' gpm');
	ok('...as does its Base demand total', L.baseDemandTotal(J('J4')) === 45.5, String(L.baseDemandTotal(J('J4'))));
	L.switchScenario('base');
	ok('switching to Base shows Base\'s one row', near(L.resolvedDemand(J('J4')), J4_BASE),
		L.resolvedDemand(J('J4')) + ' gpm');
	L.switchScenario(SCN.id);
}

// ---------------------------------------------------------------------------
// 2. Every other cell and both removes, in a scenario.
// ---------------------------------------------------------------------------
console.log('\n--- editing the list inside a scenario ---');
{
	let t = table('J1');
	type(t.texts[0], 'Elm Acres Phase 2');
	ok('editing row 0\'s DESCRIPTION leaves Base alone', baseNodes() === BASE0);
	ok('...and the scenario shows it', L.effective(J('J1'), 'demands')[0].category === 'Elm Acres Phase 2');
	t = table('J1');
	type(t.sels[1], 'Pat1');
	ok('editing a later row\'s PATTERN leaves Base alone', baseNodes() === BASE0);
	type(t.nums[2], '25');
	ok('editing a later row\'s BASE leaves Base alone', baseNodes() === BASE0);
	type(t.nums[0], '60');
	ok('editing row 0\'s BASE leaves Base alone', baseNodes() === BASE0);
	ok('...and lands in the list, not in a second override beside it',
		ovOf('J1').demands[0].base === 60 && !Object.prototype.hasOwnProperty.call(ovOf('J1'), 'demand'),
		JSON.stringify(ovOf('J1')));
	ok('the scenario solves its own list',
		near(L.resolvedDemand(J('J1')), 60 * 0.6 + 20 * 0.6 + 25 * 0.6), L.resolvedDemand(J('J1')) + ' gpm');
	t = table('J1');
	t.dels[2]._listeners.click[0]();
	ok('DELETING a row leaves Base alone', baseNodes() === BASE0);
	ok('...and the scenario has two rows', ovOf('J1').demands.length === 2);
	t = table('J1');
	t.dels[0]._listeners.click[0]();
	ok('deleting ROW 0 (the promotion) leaves Base alone', baseNodes() === BASE0);
	ok('...and promotes the scenario\'s row 1', ovOf('J1').demands.length === 1 &&
		ovOf('J1').demands[0].base === 20 && ovOf('J1').demands[0].pattern === 'Pat1',
		JSON.stringify(ovOf('J1').demands));
	L.switchScenario('base');
	ok('Base\'s J1 still draws its three rows', near(L.resolvedDemand(J('J1')), J1_BASE),
		L.resolvedDemand(J('J1')) + ' gpm');
	L.switchScenario(SCN.id);
}

// ---------------------------------------------------------------------------
// 3. Undo is one step per edit.
// ---------------------------------------------------------------------------
console.log('\n--- undo ---');
{
	const before = JSON.stringify(L.activeScenario().overrides);
	table('J3').add._listeners.click[0]();
	ok('Add on J3 made an override', !!ovOf('J3').demands);
	L.undo();
	ok('ONE undo takes it back, exactly', JSON.stringify(L.activeScenario().overrides) === before);
	ok('...and Base never moved', baseNodes() === BASE0);
}

// ---------------------------------------------------------------------------
// 4. The marker: one for the table, and clearing it restores Base's list.
// ---------------------------------------------------------------------------
console.log('\n--- the override marker ---');
{
	let t = table('J4');
	ok('the table carries one ticked marker', !!t.marker &&
		findAll([t.marker], 'INPUT')[0].checked === true);
	ok('...naming Base\'s value', t.marker.textContent.indexOf('33') >= 0, t.marker.textContent);
	const box = findAll([t.marker], 'INPUT')[0];
	box.checked = false;
	box._listeners.change[0]();
	ok('unticking clears the list override', !ovOf('J4').demands && !ovOf('J4').demand,
		JSON.stringify(ovOf('J4')));
	ok('...and J4 is Base\'s one row again', L.effective(J('J4'), 'demands').length === 1 &&
		near(L.resolvedDemand(J('J4')), J4_BASE));
	// Ticking a breakdown junction records the WHOLE list, unchanged.
	L.switchScenario('base');
	L.switchScenario(SCN.id);
	t = table('J5');
	const b5 = findAll([t.marker], 'INPUT')[0];
	b5.checked = true;
	b5._listeners.change[0]();
	ok('ticking a breakdown junction records its whole list', (ovOf('J5').demands || []).length === 2,
		JSON.stringify(ovOf('J5')));
	ok('...changing no number', near(L.baseDemandTotal(J('J5')), 40.75));
	ok('...and the tick kept the file\'s own text for later export',
		ovOf('J5').demands[1].tok && ovOf('J5').demands[1].tok.base === '0.750', JSON.stringify(ovOf('J5').demands[1]));
}

// ---------------------------------------------------------------------------
// 5. A single-demand junction keeps its single `demand` override.
// ---------------------------------------------------------------------------
console.log('\n--- row 0 alone is still `demand` ---');
{
	const t = table('J2');
	type(t.nums[0], '30');
	ok('retyping a one-row junction\'s base writes the old `demand` override',
		ovOf('J2').demand === 30 && !ovOf('J2').demands, JSON.stringify(ovOf('J2')));
	ok('...and Base is untouched', baseNodes() === BASE0);
	// The Tables pane goes through the same seam.
	const col = L.paneTables().filter(x => x.id === 'junctions')[0].cols.filter(c => c.key === 'demand')[0];
	col.set(J('J3'), 9);
	ok('the Tables pane writes a `demand` override too', ovOf('J3').demand === 9 && baseNodes() === BASE0);
	// A breakdown the SCENARIO made is refused by the bulk writers there, and offered in Base.
	table('J3').add._listeners.click[0]();
	const spec = L.pushSpecs().filter(sp => sp.key === 'demand')[0];
	ok('...and a list the scenario split is refused by the bulk writers in the scenario',
		spec.applies(J('J3')) === false && col.plainFor(J('J3')) === true);
	ok('...its row 0 carried the retyped 9 into the list', ovOf('J3').demands[0].base === 9 && !ovOf('J3').demand,
		JSON.stringify(ovOf('J3')));
	L.switchScenario('base');
	ok('...while Base still offers J3 to them', spec.applies(J('J3')) === true && col.plainFor(J('J3')) === false);
	L.switchScenario(SCN.id);
}

// ---------------------------------------------------------------------------
// 6. The solver, the .inp writer and a pattern rename read the scenario's list.
// ---------------------------------------------------------------------------
console.log('\n--- solver, export, pattern rename ---');
{
	const m = L.assembleModel();
	const mj3 = m.nodes.find(n => n.id === 'J3');
	ok('the solve hands EPS the scenario\'s rows', Array.isArray(mj3.demands) && mj3.demands.length === 2,
		JSON.stringify(mj3.demands));
	const out = EngCalcs.lpnExportInp(JSON.parse(JSON.stringify(L.serialize())), L.exportOptions());
	ok('the export succeeds', out.ok === true, JSON.stringify(out.error));
	const dem = out.inp.split('[DEMANDS]')[1].split('[')[0];
	ok('an export from the scenario writes its J1 list, one row',
		(dem.match(/^\s*J1\s/mg) || []).length === 1 && /J1\s+20\s+Pat1/.test(dem), dem.trim().split('\n').join(' | '));
	ok('...and J5\'s untouched rows keep the file\'s own text', /J5\s+0\.750/.test(dem));
	const pat = L.libPatterns().filter(p => p.id === 'Pat1')[0];
	L.libRenamePattern(pat, 'Residential');
	ok('renaming a pattern repoints the scenario\'s rows', ovOf('J1').demands[0].pattern === 'Residential',
		JSON.stringify(ovOf('J1').demands));
	L.libRenamePattern(pat, 'Pat1');
	L.switchScenario('base');
	const bout = EngCalcs.lpnExportInp(JSON.parse(JSON.stringify(L.serialize())), L.exportOptions());
	const bdem = bout.inp.split('[DEMANDS]')[1].split('[')[0];
	ok('an export from Base writes Base\'s three J1 rows', (bdem.match(/^\s*J1\s/mg) || []).length === 3, bdem.trim().split('\n').join(' | '));
	L.switchScenario(SCN.id);
}

// ---------------------------------------------------------------------------
// 7. Save and load.
// ---------------------------------------------------------------------------
console.log('\n--- save and load ---');
{
	const want = JSON.stringify(ovOf('J1'));
	L.applySaved(JSON.parse(JSON.stringify(L.serialize())));
	ok('the list override survives a round trip', JSON.stringify(ovOf('J1')) === want, JSON.stringify(ovOf('J1')));
	ok('...the document reopens in the scenario, solving its list',
		L.activeScenario().id === SCN.id && near(L.resolvedDemand(J('J1')), 20 * 0.6));
	ok('...and Base is still the file', baseNodes() === BASE0);
}

// ---------------------------------------------------------------------------
// 8. A file saved before R-369: a scenario overriding only `demand`.
// ---------------------------------------------------------------------------
console.log('\n--- a scenario saved before R-369 ---');
{
	const file = JSON.parse(JSON.stringify(L.serialize()));
	const sc = file.scenarios.find(s => s.id === SCN.id);
	sc.overrides = {};
	sc.overrides[L.ovKey(J('J1'))] = { demand: 100 };
	L.applySaved(file);
	ok('it loads and means what it meant: row 0 at 100, the other rows Base\'s',
		L.effective(J('J1'), 'demand') === 100 && near(L.resolvedDemand(J('J1')), 100 * 0.6 + 20 * 0.2 + 12.5 * 0.6),
		L.resolvedDemand(J('J1')) + ' gpm');
	ok('...with Base untouched', J('J1')._demand === 50 && baseNodes() === BASE0);
	const t = table('J1');
	type(t.texts[1], 'Park, irrigated');
	ok('the first edit of the rest of its list carries the 100 into the list',
		ovOf('J1').demands.length === 3 && ovOf('J1').demands[0].base === 100 &&
		ovOf('J1').demands[1].category === 'Park, irrigated' && !ovOf('J1').demand, JSON.stringify(ovOf('J1')));
	ok('...and still leaves Base alone', baseNodes() === BASE0);
}

// ---------------------------------------------------------------------------
// 9. The Base-side push clears a scenario's list.
// ---------------------------------------------------------------------------
console.log('\n--- Apply Base values to all scenarios ---');
{
	L.labelSettings().node.demand = true;
	L.switchScenario('base');
	L.pushBaseToScenarios(J('J1'));
	L.switchScenario(SCN.id);
	ok('the push discards the scenario\'s list, and J1 follows Base again',
		!ovOf('J1').demands && near(L.resolvedDemand(J('J1')), J1_BASE), JSON.stringify(ovOf('J1')));
	L.switchScenario('base');
}

// ---------------------------------------------------------------------------
// 10. In Base nothing changed: the edits write the document, and add-then-remove is byte-identical.
// ---------------------------------------------------------------------------
console.log('\n--- Base itself ---');
{
	const before = JSON.stringify(L.serialize());
	let t = table('J4');
	t.add._listeners.click[0]();
	ok('Add in Base writes Base', (J('J4').extraDemands || []).length === 1);
	t = table('J4');
	t.dels[1]._listeners.click[0]();
	ok('...and remove leaves the document byte-identical', JSON.stringify(L.serialize()) === before);
	t = table('J1');
	type(t.sels[0], 'Pat2');
	ok('a pattern edit in Base writes Base\'s own field', J('J1').demandPattern === 'Pat2');
	ok('...and makes no override anywhere', L.getScenarios().every(s => !s.overrides[L.ovKey(J('J1'))] ||
		!s.overrides[L.ovKey(J('J1'))].demands));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

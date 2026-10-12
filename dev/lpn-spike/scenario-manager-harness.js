// Headless check of the SCENARIO MANAGER'S MODEL (stage 6; Tom's calls of 2026-10-09, H01-H08).
// Run with:  node dev/lpn-spike/scenario-manager-harness.js
//
// The tree box and the Scenarios table are clicked in a real Chromium by
// scenario-manager-browser-harness.js; this holds what they call, on Net1:
//   1. New children are named Child_<n>_of_<parent>; "Add Base" names Base2, Base3 (scenarios, and
//      each alternatives category).
//   2. Rename: refused empty, duplicate, and for the Base item.
//   3. Delete is refused while the item is in use, and the refusal names who.
//   4. Drag: re-parent (onto), reorder (between), a cycle is refused; the stored order is shown
//      everywhere scenarios are listed, and a project that never reorders still sorts by name.
//   5. A Scenarios table assignment changes the solve; values a scenario held are kept, not lost.
//   6. Copy asks: its own copies of the alternatives, or shared ones.
//   7. Compare solves the checked set, stored in the project; the default is every scenario.
//   8. The menu row is always there; choosing it with Basic mode ticked turns it off and says so.
//   9. Save and reopen: the tree, the roots, the order and the compare set come back; a file made
//      before any of it opens unchanged and re-saves with none of the new keys; an .inp export of
//      Base is character-exact before and after all of it.
//  10. Used-by counts, and a standing control note in the Libraries box.
//  12. The first override in a category makes an alternative named after the scenario; a second one
//      reuses it; a child with no override uses its parent's; no question or message, Basic or not.
//  13. "Only in this scenario" (master's scenario delete) reads through a shared topology alternative.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-rules.js');
const fs = require('fs');
const path = require('path');
const solver = require(ROOT + 'js/lpn-solver.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const NET1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
const PC = global.EngCalcs.pageConfig;
const INJECT =
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; }, getProject: function () { return project; },\n" +
	"\t\tgetScenarios: function () { return scenarios; }, activeScenario: activeScenario,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tsetScenarioParent: setScenarioParent, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, importProject: importProject,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, assembleModel: assembleModel, importInp: importInpFromFile,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(inpExportDocument(), inpExportOptions()); },\n" +
	"\t\tsmTrees: smTrees, smAdd: smAdd, smRename: smRename, smDelete: smDelete, smMove: smMove, clearOverride: clearOverride,\n" +
	"\t\tsmChildren: smChildren, smRows: smRows, smName: smName, smBaseKey: smBaseKey, smRecords: smRecords,\n" +
	"\t\tsmAssign: smAssign, smCopyScenario: smCopyScenario, smCopyStored: smCopyStored, smChoice: smChoice, smCellText: smCellText,\n" +
	"\t\tsmCellChoices: smCellChoices, smCellValue: smCellValue, smUsedBy: smUsedBy, smUsedByText: smUsedByText,\n" +
	"\t\tsmCompareSet: smCompareSet, smCompareChecked: smCompareChecked, compareScenarios: compareScenarios,\n" +
	"\t\tscenarioCompareModels: scenarioCompareModels, scenariosForDisplay: scenariosForDisplay,\n" +
	"\t\tscenarioMenuRows: scenarioMenuRows, openScenarioManager: openScenarioManager,\n" +
	"\t\tbasicMode: function () { return scenarioBasicMode; }, setBasicMode: setScenarioBasicMode,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; }, promote: promoteImplicitAlternative,\n" +
	"\t\talternativeFor: alternativeFor, libInactiveIds: libInactiveIds, smInUseBy: smInUseBy,\n" +
	"\t\toverrideCount: overrideCount, smSharedText: smSharedText, scenarioTableCols: scenarioTableCols, scenarioTableRows: scenarioTableRows,\n" +
	"\t\tsmImplicitKey: smImplicitKey, onlyInThisScenario: onlyInThisScenario, deleteElement: deleteElement, noticeLog: function () { return noticeLog; },\n" +
	"\t\ttouchTree: touchTree, ovKey: ovKey,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

async function run(mutate, quiet) {
	let fails = 0;
	const say = (t) => { if (!quiet) { console.log(t); } };
	function ok(name, cond, extra) {
		if (!cond) { fails++; }
		if (!quiet) { console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
	}
	function page() {
		const L = loadLoopedNetwork(INJECT, null, mutate);
		setUnitSet('us');
		L.buildLayers();
		L.seedDefaultInputs();
		L.getSettings().engine = 'native';
		return L;
	}
	const L = page();
	L.importInp({ name: 'Net1.inp', _text: NET1 });
	const BASE = L.smBaseKey('scenarios');
	const names = (tree, parent) => L.smChildren(tree, parent).map((k) => L.smName(tree, k));
	const heads = (LL) => { const r = solver.lpnSolve(LL.assembleModel(), { tol: 1e-10 }); return r && r.converged ? r.heads : null; };
	const inpBase0 = L.exportInp().inp;
	const file0 = JSON.stringify(L.serializeProject());

	say('--- 1. names ---');
	const c1 = L.smAdd('scenarios', BASE, false), c2 = L.smAdd('scenarios', BASE, false);
	ok('1.1 first child of Base', c1.name === 'Child_1_of_Base', c1.name);
	ok('1.2 second child of Base', c2.name === 'Child_2_of_Base', c2.name);
	const g1 = L.smAdd('scenarios', c1.id, false);
	ok('1.3 child of a child: Child_<n>_of_<parent>', g1.name === 'Child_1_of_Child_1_of_Base' && g1.parent === c1.id, g1.name);
	const b2 = L.smAdd('scenarios', null, true), b3 = L.smAdd('scenarios', null, true);
	ok('1.4 Add Base names Base2, Base3', b2.name === 'Base2' && b3.name === 'Base3' && b2.root === true && b2.parent === undefined, b2.name + ',' + b3.name);
	ok('1.5 the roots are Base, Base2, Base3', JSON.stringify(L.smRows('scenarios').filter((r) => r.depth === 0).map((r) => r.name)) === JSON.stringify(['Base', 'Base2', 'Base3']));
	const d1 = L.smAdd('demand', L.smBaseKey('demand'), false), d2 = L.smAdd('demand', L.smBaseKey('demand'), false), db2 = L.smAdd('demand', null, true);
	ok('1.6 a category: Child_1_of_Base, Child_2_of_Base, Base2', d1.name === 'Child_1_of_Base' && d2.name === 'Child_2_of_Base' && db2.name === 'Base2' && db2.root === true, [d1.name, d2.name, db2.name].join(','));
	const dd = L.smAdd('demand', d1.id, false);
	ok('1.7 ...and a grandchild', dd.name === 'Child_1_of_Child_1_of_Base' && dd.parent === d1.id, dd.name);
	const cs1 = L.smAdd('calculation', L.smBaseKey('calculation'), false);
	ok('1.8 calculation sets are a tree too', cs1.name === 'Child_1_of_Base' && L.smRecords('calculation').length === 1);
	ok('1.9 the trees are Scenarios and the eleven categories', L.smTrees().length === 12 && L.smTrees()[0] === 'scenarios');

	say('--- 2. rename ---');
	ok('2.1 renamed', L.smRename('demand', d1.id, 'Peak') === true && L.smName('demand', d1.id) === 'Peak');
	ok('2.2 a duplicate name is refused', L.smRename('demand', d2.id, 'peak').refused === 'duplicate');
	ok('2.3 an empty name is refused', L.smRename('demand', d2.id, '  ').refused === 'empty');
	ok('2.4 Base is not renamed', L.smRename('demand', L.smBaseKey('demand'), 'X').refused === 'base' && L.smRename('scenarios', BASE, 'X').refused === 'base');
	ok('2.5 a name the Base item holds is taken', L.smRename('demand', d2.id, 'Base').refused === 'duplicate');

	say('--- 3. delete refused while in use ---');
	const r1 = L.smDelete('scenarios', c1.id);
	ok('3.1 a scenario with a child is refused, naming it', r1.refused === 'in use' && r1.who.join() === g1.name, JSON.stringify(r1));
	const r2 = L.smDelete('demand', d1.id);
	ok('3.2 an alternative with a child is refused, naming it', r2.refused === 'in use' && r2.who.join() === dd.name, JSON.stringify(r2));
	ok('3.3 a leaf goes', L.smDelete('demand', dd.id) === true && L.smRecords('demand').length === 3);
	L.smAssign(c2.id, 'demand', 'Peak');
	const r3 = L.smDelete('demand', d1.id);
	ok('3.4 an alternative a scenario uses is refused, naming the scenario', r3.refused === 'in use' && r3.who.join() === 'Child_2_of_Base', JSON.stringify(r3));
	L.smAssign(c2.id, 'demand', '');
	ok('3.5 once unassigned it goes', L.smDelete('demand', d1.id) === true);
	ok('3.6 Base never goes', L.smDelete('scenarios', BASE).refused === 'base' && L.smDelete('demand', L.smBaseKey('demand')).refused === 'base');

	say('--- 4. drag: re-parent, reorder, cycle ---');
	ok('4.1 into: g1 becomes a child of c2', L.smMove('scenarios', g1.id, c2.id, 'into') === true && g1.parent === c2.id);
	ok('4.2 a cycle is refused (c2 under its own child)', L.smMove('scenarios', c2.id, g1.id, 'into').refused === 'parent' && c2.parent === undefined);
	ok('4.3 ...and a scenario under itself', L.smMove('scenarios', c2.id, c2.id, 'into').refused === 'self');
	ok('4.4 into Base: g1 back under Base, with no parent stored', L.smMove('scenarios', g1.id, BASE, 'into') === true && g1.parent === undefined && g1.root === undefined);
	ok('4.5 a project that never reordered still sorts by name', L.getProject().scenarioOrdered === undefined &&
		L.scenariosForDisplay().map((s) => s.name).join() === ['Base', 'Base2', 'Base3', 'Child_1_of_Base', 'Child_1_of_Child_1_of_Base', 'Child_2_of_Base'].join(), L.scenariosForDisplay().map((s) => s.name).join());
	ok('4.6 between: g1 goes before c1, as c1\'s sibling', L.smMove('scenarios', g1.id, c1.id, 'before') === true && g1.parent === undefined);
	ok('4.7 the first reorder stores the order', L.getProject().scenarioOrdered === true);
	let order = L.scenariosForDisplay().map((s) => s.id);
	ok('4.8 shown order is stored order: Base first, then g1 before c1', order[0] === BASE && order.indexOf(g1.id) < order.indexOf(c1.id), order.join());
	ok('4.9 after: c2 after g1', L.smMove('scenarios', c2.id, g1.id, 'after') === true);
	order = L.scenariosForDisplay().map((s) => s.id);
	ok('4.10 ...it sits right after g1 everywhere scenarios are listed', order.indexOf(c2.id) === order.indexOf(g1.id) + 1, order.join());
	ok('4.11 the scenario menu lists them in that order', (() => {
		const rows = L.scenarioMenuRows().filter((r) => r.scenarioId).map((r) => r.scenarioId);
		return rows.join() === order.join();
	})(), '');
	ok('4.12 a new scenario goes last once the order is stored', (() => { const n = L.smAdd('scenarios', BASE, false); return L.scenariosForDisplay().slice(-1)[0].id === n.id; })());
	ok('4.13 onto a Base of its own: c1 under Base2, parent kept and root dropped', L.smMove('scenarios', c1.id, b2.id, 'into') === true && c1.parent === b2.id && c1.root === undefined);
	ok('4.14 beside a root: c1 becomes a Base of its own', L.smMove('scenarios', c1.id, b3.id, 'after') === true && c1.root === true && c1.parent === undefined);
	ok('4.15 nothing goes before the Base item', L.smMove('scenarios', c2.id, BASE, 'before').refused === 'base');
	const d3 = L.smAdd('demand', L.smBaseKey('demand'), false), d4 = L.smAdd('demand', d3.id, false);
	ok('4.16 an alternative re-parents; a cycle is refused', L.smMove('demand', d3.id, d4.id, 'into').refused === 'parent' && L.smMove('demand', d4.id, L.smBaseKey('demand'), 'into') === true && d4.parent === null);
	ok('4.17 an alternative reorders in the stored list', L.smMove('demand', d4.id, d2.id, 'before') === true &&
		L.smRecords('demand').map((r) => r.id).indexOf(d4.id) < L.smRecords('demand').map((r) => r.id).indexOf(d2.id));

	say('--- 5. the Scenarios table: an assignment changes the solve ---');
	const base0 = heads(L);
	const P = L.createScenario('Peak');
	L.switchScenario(P.id);
	L.setProp(L.nodeById('22'), 'demand', 900);
	const peakH = heads(L);
	ok('5.1 the override moved the answer at 22', Math.abs(peakH['22'] - base0['22']) > 0.1);
	const kept = L.promote(P.id, 'demand', 'PeakDemand');
	ok('5.2 promoted: nothing resolves differently', Math.abs(heads(L)['22'] - peakH['22']) < 1e-9 && kept.name === 'PeakDemand');
	L.switchScenario(BASE);
	const Q = L.createScenario('Q');
	ok('5.3 Q starts as Base', Math.abs(heads(L)['22'] - base0['22']) < 1e-9);
	L.switchScenario(Q.id);
	ok('5.4 the cell offers every demand alternative and "" first', L.smCellChoices(Q, 'demand')[0][0] === '' && L.smCellChoices(Q, 'demand').some((o) => o[0] === 'PeakDemand'));
	ok('5.5 picking PeakDemand in the table', L.smAssign(Q.id, 'demand', 'PeakDemand') === true);
	ok('5.6 ...changes Q\'s solve to Peak\'s, to 1e-9', Math.abs(heads(L)['22'] - peakH['22']) < 1e-9 && L.smCellValue(Q, 'demand') === 'PeakDemand');
	ok('5.7 ...and not Base\'s', (L.switchScenario(BASE), Math.abs(heads(L)['22'] - base0['22']) < 1e-9));
	L.switchScenario(Q.id);
	ok('5.8 picking "" inherits again', L.smAssign(Q.id, 'demand', '') === true && Math.abs(heads(L)['22'] - base0['22']) < 1e-9);
	ok('5.9 an unknown name is refused', L.smAssign(Q.id, 'demand', 'Nope').refused === 'missing');
	// values a scenario holds are kept when it picks another alternative
	const R = L.createScenario('R');
	L.switchScenario(R.id);
	L.setProp(L.nodeById('22'), 'demand', 300);
	const mine = heads(L);
	const res = L.smAssign(R.id, 'demand', 'PeakDemand');
	// R's first override stored its own alternative, named R (Tom, 2026-10-12: a first-class
	// alternative); picking another leaves it in the tree.
	ok('5.10 a scenario holding demand values keeps them as an alternative named for it', res === true && L.smRecords('demand').some((r) => r.name === 'R' && !r.implicit), JSON.stringify(res));
	ok('5.11 ...and picking it back restores its numbers exactly', (L.smAssign(R.id, 'demand', 'R'), Math.abs(heads(L)['22'] - mine['22']) < 1e-9));
	// A file from before 2026-10-12 holds a scenario's values in its own map: its own alternative is
	// then an item of the tree named after it (implicit), and picking another stores it first.
	const R2 = L.createScenario('R2');
	R2.overrides[L.ovKey(L.nodeById('22'))] = { demand: 310 };
	L.touchTree();
	ok('5.11b a file\'s scenario holding its own demand values shows them as an item named for it', L.smRecords('demand').some((r) => r.name === 'R2' && r.implicit));
	const res2 = L.smAssign(R2.id, 'demand', 'PeakDemand');
	ok('5.11c ...and picking another stores them first, under that name', res2.kept === 'R2' && L.smRecords('demand').some((r) => r.name === 'R2' && !r.implicit), JSON.stringify(res2));
	L.switchScenario(R2.id);
	ok('5.11d ...and picking it back restores its number', (L.smAssign(R2.id, 'demand', 'R2'), L.effective(L.nodeById('22'), 'demand') === 310));
	L.switchScenario(R.id);
	ok('5.12 a Base row cannot choose', L.smAssign(BASE, 'demand', 'PeakDemand').refused === 'base');
	ok('5.13 the table has a row per scenario and a column per category', (() => {
		const cols = L.scenarioTableCols(), rows = L.scenarioTableRows();
		return cols.length === 2 + 11 && rows.length === L.scenariosForDisplay().length && rows[0].id === BASE;
	})());
	L.switchScenario(BASE);

	say('--- 6. copy asks: own copies or shared ---');
	const S0 = L.smRecords('demand').map((r) => r.id);
	const src = L.getScenarios().filter((s) => s.id === Q.id)[0];
	L.smAssign(Q.id, 'demand', 'PeakDemand');
	const cOwn = L.smCopyScenario(Q.id, 'own'), cShare = L.smCopyScenario(Q.id, 'share');
	ok('6.1 named Copy_of_<name>', cOwn.name === 'Copy_of_Q' && cShare.name === 'Copy_of_Q_2', cOwn.name + ',' + cShare.name);
	ok('6.2 own: its demand alternative is a new record, a sibling of the original', cOwn.alternatives.demand !== Q.alternatives.demand &&
		L.smRecords('demand').filter((r) => !S0.includes(r.id) && r.id === cOwn.alternatives.demand).length === 1);
	ok('6.3 share: it names the same record', cShare.alternatives.demand === Q.alternatives.demand);
	ok('6.4 both copies solve as Q does', (() => {
		const out = [];
		[Q, cOwn, cShare].forEach((s) => { L.switchScenario(s.id); out.push(heads(L)['22']); });
		L.switchScenario(BASE);
		return Math.abs(out[0] - out[1]) < 1e-9 && Math.abs(out[0] - out[2]) < 1e-9;
	})());
	{
		const orig = L.smRecords('demand').filter((r) => r.id === Q.alternatives.demand)[0];
		const ac = L.smCopyStored('demand', orig.id), recs = L.smRecords('demand');
		ok('6.0 an alternative copy: Copy_of_<name>, same values and parent, a new record right after it', ac.name === 'Copy_of_' + orig.name && ac.id !== orig.id &&
			JSON.stringify(ac.values) === JSON.stringify(orig.values) && ac.parent === orig.parent && ac.category === orig.category &&
			recs.indexOf(ac) === recs.indexOf(orig) + 1 && L.smUsedBy('demand', ac.id).length === 0, JSON.stringify(ac));
	}
	// edit the alternative through the original; the shared copy follows, the own copy does not
	L.switchScenario(Q.id);
	L.setProp(L.nodeById('22'), 'demand', 1200);
	const qh = heads(L)['22'];
	L.switchScenario(cShare.id);
	const sh = heads(L)['22'];
	L.switchScenario(cOwn.id);
	const oh = heads(L)['22'];
	L.switchScenario(BASE);
	ok('6.5 an edit in Q changes the shared copy', Math.abs(qh - sh) < 1e-9);
	ok('6.6 ...and leaves the own copy alone', Math.abs(qh - oh) > 0.01);
	ok('6.7 a copy sits right after the original (the second after the first)', (() => { const o = L.scenariosForDisplay().map((s) => s.id); return o.indexOf(cShare.id) === o.indexOf(Q.id) + 1 && o.indexOf(cOwn.id) === o.indexOf(Q.id) + 2; })());

	say('--- 7. compare: the checked set, stored in the project ---');
	const all = L.scenariosForDisplay().length;
	ok('7.1 the default is every scenario, and nothing is stored', L.compareScenarios().length === all && L.getProject().compareSet === undefined);
	ok('7.2 the comparison builds a model for each', L.scenarioCompareModels().length === all);
	L.smCompareSet(Q.id, false);
	ok('7.3 unchecking one stores the set', Array.isArray(L.getProject().compareSet) && L.getProject().compareSet.length === all - 1 && !L.smCompareChecked(Q.id));
	ok('7.4 the comparison solves only the checked', L.compareScenarios().length === all - 1 && L.scenarioCompareModels().map((m) => m.scn.id).indexOf(Q.id) < 0);
	ok('7.5 the open scenario is put back afterwards', (L.switchScenario(P.id), L.scenarioCompareModels(), L.activeScenario().id === P.id));
	L.switchScenario(BASE);
	L.smCompareSet(Q.id, true);
	ok('7.6 all checked again stores nothing', L.getProject().compareSet === undefined);
	L.smCompareSet(P.id, false);
	L.smDelete('scenarios', P.id);
	ok('7.7 a deleted scenario leaves the set', !L.getProject().compareSet || L.getProject().compareSet.indexOf(P.id) < 0);
	L.smCompareSet(Q.id, true);

	say('--- 8. the menu row, and Basic mode ---');
	L.setBasicMode(true);
	const row = () => L.scenarioMenuRows().filter((r) => r.label === PC.lpn_sm_menu)[0];
	ok('8.1 the Scenario manager row is present with Basic mode ticked', !!row() && L.basicMode() === true);
	row().fn();
	ok('8.2 choosing it turns Basic mode off', L.basicMode() === false);
	ok('8.3 ...and says so in one line', L.lastNotice() === PC.lpn_sm_basic_off && !/\n/.test(L.lastNotice()), L.lastNotice());
	ok('8.4 the row is still there with Basic mode off', !!row());
	L.setBasicMode(false);

	say('--- 9. save and reopen; an old file; .inp ---');
	const fileNew = JSON.stringify(L.serializeProject());
	const M = page();
	M.importProject(JSON.parse(fileNew));
	const fileBack = JSON.stringify(M.serializeProject());
	ok('9.1 save, reopen, save: the same bytes', fileBack === fileNew);
	ok('9.2 the roots, the order and the names came back', M.smRows('scenarios').filter((r) => r.depth === 0).map((r) => r.name).join() === 'Base,Base2,Base3,Child_1_of_Base' &&
		M.getProject().scenarioOrdered === true && M.smRecords('demand').some((r) => r.name === 'PeakDemand'), M.smRows('scenarios').filter((r) => r.depth === 0).map((r) => r.name).join());
	L.smCompareSet(Q.id, false);
	const M2 = page();
	M2.importProject(JSON.parse(JSON.stringify(L.serializeProject())));
	ok('9.3 the compare set came back', Array.isArray(M2.getProject().compareSet) && M2.compareScenarios().length === L.compareScenarios().length && !M2.smCompareChecked(Q.id));
	L.smCompareSet(Q.id, true);
	const O = page();
	O.importProject(JSON.parse(file0));
	const fileOld = JSON.stringify(O.serializeProject());
	ok('9.4 a file from before all of this opens and re-saves unchanged', fileOld === file0);
	ok('9.5 ...with none of the new keys', !/scenarioOrdered|compareSet|"root"/.test(fileOld));
	const oldTree = JSON.parse(file0);
	oldTree.alternatives = [{ id: 'a1', category: 'demand', name: 'Old', parent: null, values: {} }];
	const T = page();
	T.importProject(oldTree);
	ok('9.6 a stage-4 alternative with parent null sits under Base', T.smChildren('demand', 'base').length === 1 && T.smRows('demand')[1].depth === 1);
	ok('9.7 .inp export of Base is character-exact after all of it', L.exportInp().inp === inpBase0);

	say('--- 10. used-by, and the standing control note ---');
	const used = L.smUsedBy('demand', kept.id).map((s) => s.name).sort();
	ok('10.1 PeakDemand is used by Peak (deleted? no) and Q, its copies', used.indexOf('Q') >= 0 && used.indexOf('Copy_of_Q_2') >= 0 && used.indexOf('Copy_of_Q') < 0, used.join());
	ok('10.2 the Base item counts the scenarios on Base', L.smUsedBy('demand', 'base').length > 0);
	ok('10.3 the label and tip', /\d/.test(L.smUsedByText('demand', kept.id).text) && /Q/.test(L.smUsedByText('demand', kept.id).tip));
	ok('10.4 nothing is inactive, so no standing control note', L.libInactiveIds('control').length === 0);
	L.switchScenario(Q.id);
	ok('10.5 an override written into a shared alternative says who else uses it', /Copy_of_Q_2/.test(L.smSharedText(['demand'])) && !/\bQ\b/.test(L.smSharedText(['demand']).replace('Copy_of_Q_2', '')), L.smSharedText(['demand']));
	ok('10.6 ...nothing for a category it does not share, nor in Base', L.smSharedText(['physical']) === '' && (L.switchScenario(BASE), L.smSharedText(['demand']) === ''));
	ok('10.7 ...and nothing for a scenario writing to its own values', (L.switchScenario(R.id), L.smAssign(R.id, 'demand', ''), L.smSharedText(['demand']) === ''));
	L.switchScenario(BASE);

	say('--- 10a. the override count includes what an assigned alternative brings ---');
	{
		const P2 = page();
		P2.importInp({ name: 'Net1.inp', _text: NET1 });
		const Pk = P2.createScenario('Peak');
		P2.switchScenario(Pk.id);
		P2.setProp(P2.nodeById('22'), 'demand', 900);
		P2.setProp(P2.nodeById('12'), 'demand', 300);
		// Peak's first override stored its own alternative, named Peak; it is renamed DryYear.
		P2.smRename('demand', Pk.alternatives.demand, 'DryYear');
		P2.switchScenario(P2.baseScenario().id);
		const Hs = P2.createScenario('Horse');
		ok('10.12 before assigning, Horse counts 0', P2.overrideCount(Hs) === 0);
		P2.smAssign(Hs.id, 'demand', 'DryYear');
		ok('10.13 Horse via DryYear counts the two demands the alternative holds', P2.overrideCount(Hs) === 2, String(P2.overrideCount(Hs)));
		ok('10.14 ...and Peak, which names the same alternative, counts the same', P2.overrideCount(Pk) === 2, String(P2.overrideCount(Pk)));
		const Ch = P2.smAdd('demand', 'base', false);
		P2.smMove('demand', Ch.id, 'base', 'into');
		P2.smMove('demand', P2.smRecords('demand').filter((r) => r.name === 'DryYear')[0].id, Ch.id, 'into');
		ok('10.15 a value the alternative and its parent both state counts once', P2.overrideCount(Hs) === 2, String(P2.overrideCount(Hs)));
		ok('10.16 Base counts 0', P2.overrideCount(P2.baseScenario()) === 0);
		const Rt = P2.smAdd('scenarios', null, true);
		ok('10.17 a Base of its own shows a blank Parent in the Scenarios table', (() => {
			const col = P2.scenarioTableCols().filter((c) => c.key === 'sc_parent')[0];
			return col.get({ scn: Rt }) === '' && col.get({ scn: Hs }) === 'Base';
		})());
	}

	say('--- 10b. controls and rules naming an inactive asset: a standing note, never a message ---');
	{
		const text = NET1.replace(/\[CONTROLS\]\n/, '[CONTROLS]\n LINK 21 CLOSED IF NODE 2 BELOW 100\n')
			.replace(/\[RULES\]\n/, '[RULES]\nRULE R1\nIF NODE 22 PRESSURE BELOW 1\nTHEN LINK 112 STATUS IS CLOSED\n');
		const P = page();
		P.importInp({ name: 'Net1-controls.inp', _text: text });
		ok('10.8 in Base nothing is left out', P.libInactiveIds('control').length === 0 && P.libInactiveIds('rule').length === 0);
		const N = P.createScenario('N');
		P.switchScenario(N.id);
		P.setProp(P.nodeById('22'), 'active', false);
		ok('10.9 in a scenario that switches 22 off, the control and the rule are listed', P.libInactiveIds('control').join() === '21' && P.libInactiveIds('rule').join() === 'R1',
			P.libInactiveIds('control').join() + ' / ' + P.libInactiveIds('rule').join());
		ok('10.10 and the run says nothing of them (no per-run message): the strings are the note\'s', PC.lpn_control_inactive_note.indexOf('{ids}') >= 0 && PC.lpn_rule_inactive_note.indexOf('{ids}') >= 0);
		ok('10.11 the words are "refer to", not "name"', PC.lpn_inp_export_flat_inactive_controls.indexOf('refer to') >= 0);
	}

	return fails;
}

// Sections 12 and 13, on pages of their own: the live mutations aimed at them run only these.
async function runTail(mutate, quiet) {
	let fails = 0;
	const say = (t) => { if (!quiet) { console.log(t); } };
	function ok(name, cond, extra) {
		if (!cond) { fails++; }
		if (!quiet) { console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
	}
	function page() {
		const L = loadLoopedNetwork(INJECT, null, mutate);
		setUnitSet('us');
		L.buildLayers();
		L.seedDefaultInputs();
		L.getSettings().engine = 'native';
		return L;
	}
	// Tom, 2026-10-11: "Creating a new scenario creates no alternatives; it uses its parent's
	// alternatives until new alternatives are needed as overrides are created. ... if the scenario
	// has no such alternative, a new alternative is created using the name of the scenario." And (3):
	// no alert on the creation of an alternative, in Basic mode or out of it.
	say('--- 12. the first override in a category makes an alternative named after the scenario ---');
	for (const basic of [true, false]) {
		const W = basic ? 'Basic: ' : 'Advanced: ';
		const P = page();
		P.importInp({ name: 'Net1.inp', _text: NET1 });
		P.setBasicMode(basic);
		let asked = 0;
		const answerer = global.window.lpnDialogAnswerer;
		global.window.lpnDialogAnswerer = function (req) { asked++; return answerer(req); };
		const FIG = 'Figure 1';
		const F = P.createScenario(FIG);
		const named = (cat, name) => P.smRecords(cat).filter((r) => r.name === name);
		ok('12.1 ' + W + 'a scenario just made has no alternative of its own', P.smRecords('demand').length === 0 && P.smRecords('text').length === 0 &&
			P.smChoice(F, 'demand').base === true && P.smCellText(F, 'demand') === PC.lpn_scenario_base);
		P.switchScenario(F.id);
		const logBefore = P.noticeLog().length, noticeBefore = P.lastNotice();
		P.setProp(P.nodeById('22'), 'demand', 900);
		const own = named('demand', FIG);
		ok('12.2 ' + W + 'its first Demand override makes a Demand alternative named after it, under Base', own.length === 1 && P.smChildren('demand', 'base').indexOf(own[0].id) >= 0, JSON.stringify(P.smRows('demand')));
		ok('12.3 ' + W + '...the scenario uses it, and the Scenarios table names it', P.smUsedBy('demand', own[0].id).indexOf(F) >= 0 && P.smCellText(F, 'demand') === FIG, P.smCellText(F, 'demand'));
		ok('12.4 ' + W + '...and nothing else: no other category has one', P.smRecords('physical').length === 0 && P.smRecords('text').length === 0 && P.smCellText(F, 'physical') === PC.lpn_scenario_base);
		ok('12.5 ' + W + 'no question was asked and no message given', asked === 0 && P.noticeLog().length === logBefore && P.lastNotice() === noticeBefore, asked + ' asked, ' + (P.noticeLog().length - logBefore) + ' messages');
		P.setProp(P.nodeById('12'), 'demand', 300);
		ok('12.6 ' + W + 'a second Demand override reuses it', named('demand', FIG).length === 1 && P.smRecords('demand').length === 1 && Object.keys(own[0].values).length === 2);
		// Tom, 2026-10-12: "It's a first-class alternative, and this is the primary way of creating
		// alternatives." So it is stored, in the file, and the scenario names it.
		ok('12.7 ' + W + 'it is a stored alternative in the file, and the scenario names it', !own[0].implicit && F.alternatives.demand === own[0].id &&
			JSON.parse(JSON.stringify(P.serializeProject())).alternatives.some((a) => a.id === own[0].id && a.name === FIG) && !Object.keys(F.overrides).length);
		// A child of the figure, with no override of its own, uses its parent's alternative.
		P.switchScenario(P.baseScenario().id);
		const C = P.smAdd('scenarios', F.id, false);
		P.switchScenario(C.id);
		ok('12.8 ' + W + 'a child with no override uses its parent\'s alternative', P.smChoice(C, 'demand').id === own[0].id && P.smChoice(C, 'demand').via === F &&
			P.smUsedBy('demand', own[0].id).indexOf(C) >= 0 && P.effective(P.nodeById('22'), 'demand') === 900 && named('demand', C.name).length === 0, P.smCellText(C, 'demand'));
		ok('12.9 ' + W + '...and its Scenarios table cell says so', P.smCellText(C, 'demand') === FIG + ' (' + PC.lpn_sm_inherited + ')', P.smCellText(C, 'demand'));
		P.setProp(P.nodeById('22'), 'demand', 950);
		const kid = named('demand', C.name);
		ok('12.10 ' + W + 'the child\'s first override makes its own, named after it, a child of its parent\'s', kid.length === 1 &&
			P.smChildren('demand', own[0].id).indexOf(kid[0].id) >= 0 && P.effective(P.nodeById('12'), 'demand') === 300, JSON.stringify(P.smRows('demand')));
		ok('12.11 ' + W + 'still no question and no message', asked === 0 && P.noticeLog().length === logBefore, asked + ' asked');
		const del = P.smDelete('demand', own[0].id);
		ok('12.12 ' + W + 'a scenario\'s own alternative is not deleted: it is used, and the refusal names who', del.refused === 'in use' && del.who.indexOf(FIG) >= 0, JSON.stringify(del));
		// Renaming it makes it an alternative of its own; nothing resolves differently.
		ok('12.13 ' + W + 'renamed, it keeps its place and the scenario still names it', P.smRename('demand', own[0].id, 'Figure demands') === true &&
			own[0].name === 'Figure demands' && F.alternatives.demand === own[0].id &&
			named('demand', FIG).length === 0 && P.effective(P.nodeById('12'), 'demand') === 300 && P.effective(P.nodeById('22'), 'demand') === 950);
		ok('12.14 ' + W + '...and the child\'s own alternative still hangs from it', P.smChildren('demand', own[0].id).indexOf(kid[0].id) >= 0);
		// The scenario renamed later does not rename its alternative: it was named at creation.
		P.smRename('scenarios', F.id, 'Figure 1 renamed');
		ok('12.14b ' + W + 'renaming the scenario leaves its alternative\'s name alone', own[0].name === 'Figure demands');
		// Its last override cleared, the alternative stays, empty, and the scenario still names it.
		P.switchScenario(C.id);
		P.clearOverride(P.nodeById('22'), 'demand');
		ok('12.14c ' + W + 'the child\'s alternative, its last override cleared, stays in the tree, still the child\'s',
			named('demand', C.name).length === 1 && C.alternatives.demand === kid[0].id && !Object.keys(kid[0].values || {}).length);
		P.setProp(P.nodeById('22'), 'demand', 950);
		// Another scenario picks the child's own alternative in the Scenarios table: it is stored and shared.
		P.switchScenario(P.baseScenario().id);
		const G = P.createScenario('Gamma');
		const res = P.smAssign(G.id, 'demand', C.name);
		const stored = P.getDoc().alternatives.filter((a) => a.name === C.name)[0];
		ok('12.15 ' + W + 'another scenario choosing it shares it: stored, named after its scenario, used by both', res === true && !!stored &&
			C.alternatives && C.alternatives.demand === stored.id && G.alternatives.demand === stored.id, JSON.stringify(res));
		P.switchScenario(G.id);
		ok('12.16 ' + W + '...and Gamma reads its values', P.effective(P.nodeById('22'), 'demand') === 950 && P.effective(P.nodeById('12'), 'demand') === 300);
		ok('12.17 ' + W + 'no question and no message, all the way', asked === 0, asked + ' asked');
		global.window.lpnDialogAnswerer = answerer;
	}

	// master's fix/scenario-delete: an asset in this scenario only is deleted there. Here `active` may
	// live in a stored Active topology alternative, which another scenario can share.
	say('--- 13. "only in this scenario" reads through a topology alternative ---');
	{
		const P = page();
		P.importInp({ name: 'Net1.inp', _text: NET1 });
		const S1 = P.createScenario('S1'), S2 = P.createScenario('S2');
		const link = P.linkById('10');
		link._active = false;   // as bornInScenario() leaves it: inactive in Base
		P.switchScenario(S1.id);
		P.setProp(link, 'active', true);
		// S1's first override stored its own Asset activation alternative; renamed Topo.
		P.smRename('topology', S1.alternatives.topology, 'Topo');
		ok('13.1 active in S1 through its stored topology alternative: only in S1', P.onlyInThisScenario(link) === true && S1.alternatives.topology !== undefined);
		P.smAssign(S2.id, 'topology', 'Topo');
		ok('13.2 S2 shares that alternative, so it is active in S2 too: not only in S1', P.onlyInThisScenario(link) === false);
		P.smAssign(S2.id, 'topology', '');
		ok('13.3 S2 back on Base\'s: only in S1 again', P.onlyInThisScenario(link) === true);
		let asked = 0;
		const answerer = global.window.lpnDialogAnswerer;
		global.window.lpnDialogAnswerer = function (req) { asked++; return answerer(req); };
		P.deleteElement('link', '10');
		global.window.lpnDialogAnswerer = answerer;
		ok('13.4 deleted in S1, with no question: the overrides lost were S1\'s alone', !P.linkById('10') && asked === 0, asked + ' asked');
	}

	// Tom, 2026-10-12: "Alt selection: I can't select Base as the alternative." A child whose parent
	// uses another alternative chooses Base on purpose, and reads Base's values whatever its parent does.
	say('--- 14. Base is a choice in the Scenarios table ---');
	{
		const P = page();
		P.importInp({ name: 'Net1.inp', _text: NET1 });
		const solve = () => { const r = solver.lpnSolve(P.assembleModel(), { tol: 1e-10 }); return r && r.converged ? r.heads : null; };
		const base0 = solve();
		const BASEW = PC.lpn_scenario_base;
		const Par = P.createScenario('Parent');
		P.switchScenario(Par.id);
		P.setProp(P.nodeById('22'), 'demand', 900);
		const parH = solve();
		P.switchScenario(P.baseScenario().id);
		const Kid = P.smAdd('scenarios', Par.id, false);
		P.switchScenario(Kid.id);
		ok('14.1 the child inherits its parent\'s Demand alternative', Math.abs(solve()['22'] - parH['22']) < 1e-9 && /\(/.test(P.smCellText(Kid, 'demand')), P.smCellText(Kid, 'demand'));
		ok('14.2 its cell offers Base', P.smCellChoices(Kid, 'demand').some((o) => o[0] === BASEW), JSON.stringify(P.smCellChoices(Kid, 'demand')));
		ok('14.3 choosing Base is accepted', P.smAssign(Kid.id, 'demand', BASEW) === true);
		ok('14.4 ...the child solves as Base, to 1e-9, while its parent still holds 900', Math.abs(solve()['22'] - base0['22']) < 1e-9 &&
			(P.switchScenario(Par.id), Math.abs(solve()['22'] - parH['22']) < 1e-9), String(solve()['22']));
		P.switchScenario(Kid.id);
		ok('14.5 ...its cell reads Base, as its own choice, not inherited', P.smCellText(Kid, 'demand') === BASEW && P.smCellValue(Kid, 'demand') === BASEW, P.smCellText(Kid, 'demand'));
		ok('14.6 ...and Base, already chosen, is not offered a second time', !P.smCellChoices(Kid, 'demand').slice(1).some((o) => o[0] === BASEW));
		ok('14.7 ...and the Base item counts it among its users', P.smUsedBy('demand', P.smBaseKey('demand')).indexOf(Kid) >= 0);
		const text = JSON.stringify(P.serializeProject());
		const f = JSON.parse(text);
		ok('14.8 the choice is in the file', f.scenarios.filter((x) => x.id === Kid.id)[0].alternatives.demand === 'base');
		P.setProp(P.nodeById('12'), 'demand', 300);
		const own = (P.getDoc().alternatives || []).filter((a) => a.id === Kid.alternatives.demand)[0];
		ok('14.9 an override in the child then makes its own alternative, a child of Base, not of its parent\'s', !!own && own.name === Kid.name && own.parent === null &&
			P.effective(P.nodeById('22'), 'demand') === P.nodeById('22')._demand, JSON.stringify(own));
		ok('14.10 choosing "" inherits from the parent again', P.smAssign(Kid.id, 'demand', '') === true && Math.abs(solve()['22'] - parH['22']) < 1e-9);
		const Cp = P.smAssign(Kid.id, 'demand', BASEW) === true && P.smCopyScenario(Kid.id, 'own');
		ok('14.11 a copy of a scenario that chose Base chooses Base too', !!Cp && Cp.alternatives && Cp.alternatives.demand === 'base', JSON.stringify(Cp && Cp.alternatives));
		ok('14.12 the Calculation column offers Base as well', P.smCellChoices(Kid, 'calculation').length >= 1 &&
			(P.smCellChoices(Kid, 'calculation').some((o) => o[0] === BASEW) || P.smChoice(Kid, 'calculation').base === true));
	}
	return fails;
}

// **LIVE MUTATIONS: EACH MUST TURN THIS HARNESS RED** (dev/testing-notes.md).
const MUTATIONS = [
	['a delete is not refused while in use', (src) => src.replace("		who = smInUseBy(tree, key);\n		if (who.length) {", "		who = smInUseBy(tree, key);\n		if (false) {")],
	['a cycle is allowed', (src) => src.replace("if (p === s || scenarioParentLoops(s.id, p.id)) { return treeRefuse('parent'); }", "")],
	['a reorder is not stored', (src) => src.replace("		project.scenarioOrdered = true;\n	}", "	}")],
	['the compare set is ignored', (src) => src.replace("return scenariosForDisplay().filter(function (s) { return !Array.isArray(set) || set.indexOf(s.id) >= 0; });", "return scenariosForDisplay();")],
	['a copy always shares', (src) => src.replace("				if (mode === 'own') {", "				if (false) {")],
	['an assignment drops the values the scenario held', (src) => src.replace("			kept = promoteStored(s.id, cat, smUniqueName(cat, scenarioDisplayName(s), smImplicitKey(s, cat)));\n			if (kept.refused) { return kept; }", "			kept = { name: 'x' };\n			takeScenarioLocals(s, cat);")],
	['a new child is not named for its parent', (src) => src.replace("name = 'Child_' + n + '_of_' + parent;", "name = 'Child_' + n;")],
	['only-in-this-scenario reads the scenario\'s own values alone', (src) => src.replace("var ov = (!scn || scn.isBase) ? null : resolvedOverrides(scn)[ovKey(el)];", "var ov = (!scn || scn.isBase) ? null : (scn.overrides || {})[ovKey(el)];"), true],
	['a scenario\'s own alternative is not an item of its tree', (src) => src.replace("		}).map(function (s) { return smImplicitRecord(s, tree); });", "		}).map(function (s) { return smImplicitRecord(s, tree); }).slice(0, 0);")],
	['the first override asks first', (src) => src.replace("		var scn = activeScenario(), key = ovKey(el), t = ownWriteTarget(scn, categoryOf(prop, elGroup(el)));\n", "		if (writeTargetFor(activeScenario(), categoryOf(prop, elGroup(el))).kind === 'scn') { askDialog({ kind: 'alert', text: 'x' }); }\n		var scn = activeScenario(), key = ovKey(el), t = ownWriteTarget(scn, categoryOf(prop, elGroup(el)));\n"), true],
	['Basic mode stays on when the manager is chosen', (src) => src.replace("		if (scenarioBasicMode) {\n			setScenarioBasicMode(false);\n			setNotice(", "		if (false) {\n			setScenarioBasicMode(false);\n			setNotice(")]
];
(async function main() {
	let fails = await run(null, false) + await runTail(null, false);
	console.log('\n--- 11. live mutations: each must turn this harness red ---');
	for (const m of MUTATIONS) {
		let red;
		try { red = await (m[2] ? runTail : run)(m[1], true); } catch (e) {
			if (/the mutation changed nothing/.test(String(e && e.message))) { fails++; console.log('  FAIL mutation no longer applies: ' + m[0]); continue; }
			red = 'a thrown error (' + (e && e.message) + '), so it';
		}
		const isRed = typeof red === 'string' || red > 0;
		if (!isRed) { fails++; }
		console.log((isRed ? '  ok   ' : '  FAIL ') + 'mutation "' + m[0] + '" turns ' + red + ' check(s) red');
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });

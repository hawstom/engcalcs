// Headless check of MERGE UPWARD for an alternative (Task 801; Tom, 2026-10-15), and of the
// retirement of Apply Base values that it replaces. Run with:
//   node dev/lpn-spike/alternative-merge-upward-harness.js
//
// Tom: *"Maybe 'Merge upward' and it lets you choose how many steps upward to target the merge (in
// case you want to skip parent)?"*, then, on the proposal to name a skipped level's own values and
// leave them untouched, *"Yes. Perfect."* On Net1, in the Physical tree Base > A > B > C:
//   1. The targets are the ancestors by name, parent first, up to Base; a Base has none, nor does a
//      Base of its own (Add base), nor the Scenarios tree. The command is greyed on a Base.
//   2. Merge to the parent: the source's own values land in the parent and leave the source, which
//      stays in the tree; every scenario using the source (two here) reads the same numbers after.
//   3. Undo puts the whole document back, byte for byte.
//   4. Skip a level that holds its own value for something merged: the plan names it ("Pipe 10:
//      Diameter"), the skipped value is untouched, and the source then reads it from there.
//   5. Skip a level that holds nothing merged: no warning, and the source reads the merged value.
//   6. Into the alternative the Base scenario uses: Base itself shows the merged value.
//   7. Into Base (the drawing): the elements take the values, as a Base edit does; undo restores.
//   8. Morph: into a stored ancestor the type goes like any value; into Base it stays in the source
//      and the question says so, while the rest (an `active`) still goes.
//   9. A calculation set: its demand multiplier moves up, and into Base it becomes the project's.
//  10. A scenario's own values in a file from before 2026-10-12 (an implicit alternative) merge too.
//  11. A scenario-level local value written by an older reader into a category the scenario names
//      an alternative for is nearest, and a merge of that alternative leaves it in place.
//  12. The command's flow: which ancestor, then the question with the skipped values listed, then
//      one undo step; Cancel at either question writes nothing.
//  13. Apply Base values is gone: no menu row, no handler, no words.
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
	"\t\tgetScenarios: function () { return scenarios; }, activeScenario: activeScenario, baseScenario: baseScenario,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp, effectiveSetting: effectiveSetting,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, scenarioById: scenarioById,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo, serializeProject: serializeProject,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, importInp: importInpFromFile, touchTree: touchTree,\n" +
	"\t\tsmAdd: smAdd, smName: smName, smBaseKey: smBaseKey, smRecords: smRecords, smImplicitKey: smImplicitKey, smRecord: smRecord,\n" +
	"\t\tsmMergeTargets: smMergeTargets, smMergePlan: smMergePlan, smMergeUpward: smMergeUpward, smTry: smTry,\n" +
	"\t\tsmActMergeUpward: smActMergeUpward, smCommands: smCommands, smSetTree: function (t) { smState.tree = t; },\n" +
	"\t\tsmSel: function () { return smState.sel; }, scenarioMenuRows: scenarioMenuRows, setBasicMode: setScenarioBasicMode,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

const L = loadLoopedNetwork(INJECT);
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.getSettings().engine = 'native';
L.importInp({ name: 'Net1.inp', _text: NET1 });
L.setBasicMode(false);

const T = 'physical', BASEK = L.smBaseKey(T);
const P10 = () => L.linkById('10'), P12 = () => L.linkById('12'), J22 = () => L.nodeById('22');
const rec = (id) => L.smRecord(T, id);
const snap = () => JSON.stringify(L.serializeProject());
function inScn(s, fn) { const was = L.activeScenario().id; L.switchScenario(s.id); try { return fn(); } finally { L.switchScenario(was); } }
const dia = (s) => inScn(s, () => L.effective(P10(), 'diameter'));
// Every act below is one undo step, as the command takes it (smTry()).
const act = (fn) => L.smTry(fn);

// The tree: Base > A > B > C. A holds pipe 12's diameter, B pipe 10's, C pipe 10's and junction 22's elevation.
const A = L.smAdd(T, BASEK, false), B = L.smAdd(T, A.id, false), C = L.smAdd(T, B.id, false);
L.smRecord(T, A.id).name = 'A'; L.smRecord(T, B.id).name = 'B'; L.smRecord(T, C.id).name = 'C';
A.values = { 'l:12': { diameter: 14 } };
B.values = { 'l:10': { diameter: 16 } };
C.values = { 'l:10': { diameter: 20 }, 'n:22': { elev: 900 } };
const S1 = L.createScenario('Uses C one'); S1.alternatives = { physical: C.id };
const S2 = L.createScenario('Uses C two'); S2.alternatives = { physical: C.id };
const SA = L.createScenario('Uses A'); SA.alternatives = { physical: A.id };
L.switchScenario(L.baseScenario().id);
L.touchTree('harness');
const base10 = P10()._diameter, base22 = J22().elev;

console.log('--- 1. the targets ---');
ok('1.1 C\'s ancestors by name, parent first, up to Base', JSON.stringify(L.smMergeTargets(T, C.id).map((u) => u.name)) === JSON.stringify(['B', 'A', PC.lpn_scenario_base || 'Base']),
	JSON.stringify(L.smMergeTargets(T, C.id)));
ok('1.2 the Base item has none', L.smMergeTargets(T, BASEK).length === 0);
const B2 = L.smAdd(T, null, true);
ok('1.3 nor does a Base of its own (Add base)', B2.root === true && L.smMergeTargets(T, B2.id).length === 0);
ok('1.4 nor does a scenario', L.smMergeTargets('scenarios', S1.id).length === 0);
L.smSetTree(T);
const cmd = (key) => L.smCommands(key).filter((c) => c.id === 'merge')[0];
ok('1.5 the command reads "Merge upward"', !!cmd(C.id) && cmd(C.id).label === 'Merge upward' && PC.lpn_sm_merge_up === 'Merge upward', cmd(C.id) && cmd(C.id).label);
ok('1.6 ...live on C, greyed on Base and on a Base of its own, saying why', cmd(C.id).off === false && cmd(BASEK).off === true && cmd(B2.id).off === true &&
	cmd(BASEK).offTip === PC.lpn_sm_merge_up_root, cmd(BASEK).offTip);
L.smSetTree('scenarios');
ok('1.7 ...and absent from the Scenarios tree', !L.smCommands(S1.id).some((c) => c.id === 'merge'));
L.smSetTree(T);

console.log('--- 2. merge to the parent ---');
const before = snap(), d1 = dia(S1), d2 = dia(S2), e1 = inScn(S1, () => L.effective(J22(), 'elev'));
let plan = L.smMergePlan(T, C.id, B.id);
ok('2.1 the plan: two values, no skipped level', plan.n === 2 && plan.skipped.length === 0, JSON.stringify(plan.skipped));
let res = act(() => L.smMergeUpward(T, C.id, B.id));
ok('2.2 the act answers', res && res.source === C.id && res.merged === 2, JSON.stringify(res));
ok('2.3 B now holds C\'s values (C\'s 20 over B\'s 16)', rec(B.id).values['l:10'].diameter === 20 && rec(B.id).values['n:22'].elev === 900, JSON.stringify(rec(B.id).values));
ok('2.4 C holds nothing of its own, and is still in the tree', !!rec(C.id) && !rec(C.id).values, JSON.stringify(rec(C.id)));
ok('2.5 both scenarios using C read the same numbers as before', dia(S1) === d1 && dia(S2) === d2 && inScn(S1, () => L.effective(J22(), 'elev')) === e1, [dia(S1), dia(S2)].join());
ok('2.6 Base did not move', P10()._diameter === base10 && J22().elev === base22);
ok('2.7 a source with nothing of its own now has nothing to merge', L.smMergePlan(T, C.id, B.id).own === 0);

console.log('--- 3. undo ---');
L.undo();
ok('3.1 one Ctrl+Z puts the document back byte for byte', snap() === before);

console.log('--- 4. skip a level that holds a value merged ---');
plan = L.smMergePlan(T, C.id, A.id);
ok('4.1 the plan names B and what it holds', plan.skipped.length === 1 && plan.skipped[0].name === 'B' && JSON.stringify(plan.skipped[0].lines) === JSON.stringify(['Pipe 10: Diameter']),
	JSON.stringify(plan.skipped));
res = act(() => L.smMergeUpward(T, C.id, A.id));
ok('4.2 A holds C\'s values beside its own', rec(A.id).values['l:10'].diameter === 20 && rec(A.id).values['n:22'].elev === 900 && rec(A.id).values['l:12'].diameter === 14, JSON.stringify(rec(A.id).values));
ok('4.3 B\'s own value is untouched', JSON.stringify(rec(B.id).values) === JSON.stringify({ 'l:10': { diameter: 16 } }), JSON.stringify(rec(B.id).values));
ok('4.4 so C\'s users read pipe 10 from B (16) and junction 22 from A (900)', dia(S1) === 16 && inScn(S2, () => L.effective(J22(), 'elev')) === 900, String(dia(S1)));
ok('4.5 the scenario using A gains the merged value', dia(SA) === 20, String(dia(SA)));
L.undo();
ok('4.6 undo', snap() === before);

console.log('--- 5. skip a level that holds nothing merged ---');
const keepB = rec(B.id).values;
rec(B.id).values = { 'l:11': { diameter: 6 } };
L.touchTree('harness');
const before5 = snap();
plan = L.smMergePlan(T, C.id, A.id);
ok('5.1 no skipped level is named', plan.skipped.length === 0, JSON.stringify(plan.skipped));
act(() => L.smMergeUpward(T, C.id, A.id));
ok('5.2 C\'s users read the merged 20 from A', dia(S1) === 20 && dia(S2) === 20);
ok('5.3 B is untouched', JSON.stringify(rec(B.id).values) === JSON.stringify({ 'l:11': { diameter: 6 } }));
L.undo();
ok('5.4 undo', snap() === before5);
rec(B.id).values = keepB;
L.touchTree('harness');

console.log('--- 6. into the alternative the Base scenario uses ---');
L.baseScenario().alternatives = { physical: A.id };
L.touchTree('harness');
const before6 = snap();
ok('6.1 Base, using A, reads the drawing\'s pipe 10', L.effective(P10(), 'diameter') === base10);
act(() => L.smMergeUpward(T, C.id, A.id));
ok('6.2 after the merge into A, Base itself reads 20', L.effective(P10(), 'diameter') === 20, String(L.effective(P10(), 'diameter')));
ok('6.3 the drawing itself is unchanged', P10()._diameter === base10);
L.undo();
ok('6.4 undo', snap() === before6);
delete L.baseScenario().alternatives;
L.touchTree('harness');

console.log('--- 7. into Base, the drawing ---');
const before7 = snap();
plan = L.smMergePlan(T, C.id, BASEK);
ok('7.1 the plan names B (pipe 10) and not A (A holds only pipe 12)', plan.skipped.length === 1 && plan.skipped[0].name === 'B', JSON.stringify(plan.skipped));
act(() => L.smMergeUpward(T, C.id, BASEK));
ok('7.2 the drawing takes junction 22\'s elevation and pipe 10\'s diameter', J22().elev === 900 && P10()._diameter === 20, [J22().elev, P10()._diameter].join());
ok('7.3 B and A keep their own values', rec(B.id).values['l:10'].diameter === 16 && rec(A.id).values['l:12'].diameter === 14);
ok('7.4 C is emptied, and its users read pipe 10 from B', !rec(C.id).values && dia(S1) === 16);
L.undo();
ok('7.5 undo restores the drawing', snap() === before7 && J22().elev === base22 && P10()._diameter === base10);
// Base scenario on another alternative: the merge still reaches the drawing, not that alternative.
L.baseScenario().alternatives = { physical: A.id };
L.touchTree('harness');
const before7b = snap();
act(() => L.smMergeUpward(T, C.id, BASEK));
ok('7.6 with Base using A, a merge into Base still writes the drawing and leaves A alone', P10()._diameter === 20 && !rec(A.id).values['l:10'], JSON.stringify(rec(A.id).values));
ok('7.7 ...and Base\'s pick of A is kept', L.baseScenario().alternatives.physical === A.id);
L.undo();
ok('7.8 undo', snap() === before7b);
delete L.baseScenario().alternatives;
L.touchTree('harness');

console.log('--- 8. Morph (an Active topology type override) ---');
const TT = 'topology', T1 = L.smAdd(TT, L.smBaseKey(TT), false), T2 = L.smAdd(TT, T1.id, false);
L.smRecord(TT, T2.id).values = { 'n:22': { type: 'tank' }, 'n:23': { active: false } };
L.touchTree('harness');
const before8 = snap();
plan = L.smMergePlan(TT, T2.id, T1.id);
ok('8.1 into a stored ancestor the type goes like any value', plan.n === 2 && !plan.keepsMorph);
act(() => L.smMergeUpward(TT, T2.id, T1.id));
ok('8.2 ...and is there', L.smRecord(TT, T1.id).values['n:22'].type === 'tank' && !L.smRecord(TT, T2.id).values);
L.undo();
ok('8.3 undo', snap() === before8);
plan = L.smMergePlan(TT, T2.id, L.smBaseKey(TT));
ok('8.4 into Base the type stays, and the plan says so', plan.n === 1 && plan.keepsMorph === true);
act(() => L.smMergeUpward(TT, T2.id, L.smBaseKey(TT)));
ok('8.5 junction 23 is inactive in the drawing; junction 22 is still a junction there', L.nodeById('23')._active === false && J22().type === 'junction', [L.nodeById('23')._active, J22().type].join());
ok('8.6 ...and the type is still T2\'s own', JSON.stringify(L.smRecord(TT, T2.id).values) === JSON.stringify({ 'n:22': { type: 'tank' } }), JSON.stringify(L.smRecord(TT, T2.id).values));
L.undo();
ok('8.7 undo', snap() === before8);

console.log('--- 9. a calculation set ---');
const CT = 'calculation', K1 = L.smAdd(CT, L.smBaseKey(CT), false), K2 = L.smAdd(CT, K1.id, false);
L.smRecord(CT, K2.id).demandMultiplier = 1.5;
L.touchTree('harness');
const before9 = snap(), dm0 = L.getSettings().hydraulics.demandMultiplier;
act(() => L.smMergeUpward(CT, K2.id, K1.id));
ok('9.1 the multiplier moves up into its parent', L.smRecord(CT, K1.id).demandMultiplier === 1.5 && L.smRecord(CT, K2.id).demandMultiplier === undefined);
L.undo();
act(() => L.smMergeUpward(CT, K2.id, L.smBaseKey(CT)));
ok('9.2 into Base it is the project\'s own multiplier', L.getSettings().hydraulics.demandMultiplier === 1.5, String(L.getSettings().hydraulics.demandMultiplier));
L.undo();
ok('9.3 undo restores the project\'s', snap() === before9 && L.getSettings().hydraulics.demandMultiplier === dm0, String(L.getSettings().hydraulics.demandMultiplier));

console.log('--- 10. a scenario\'s own values in a file from before 2026-10-12 ---');
const SO = L.createScenario('Old file');
SO.overrides = { 'l:10': { diameter: 30 } };
L.switchScenario(L.baseScenario().id);
L.touchTree('harness');
const before10 = snap(), IK = L.smImplicitKey(SO, T);
ok('10.1 it shows as its own item, with Base above it', !!L.smRecord(T, IK) && L.smRecord(T, IK).implicit === true &&
	JSON.stringify(L.smMergeTargets(T, IK).map((u) => u.key)) === JSON.stringify([BASEK]));
res = act(() => L.smMergeUpward(T, IK, BASEK));
ok('10.2 merged into Base: the drawing holds 30', P10()._diameter === 30 && res.source.indexOf(':') < 0, JSON.stringify(res));
ok('10.3 ...the scenario now names its own stored alternative, emptied, and reads 30 through it', !!SO.alternatives && !!rec(SO.alternatives.physical) && !rec(SO.alternatives.physical).values && dia(SO) === 30);
L.undo();
ok('10.4 undo', snap() === before10);

console.log('--- 11. a scenario-level value beside a named alternative ---');
// An older reader could leave a local value in a category the scenario names an alternative for;
// it is nearest (treeLayers()), and a merge of the alternative is not a merge of it. (Undo swaps
// in fresh scenario objects, so the scenario is looked up again.)
L.scenarioById(S1.id).overrides = { 'l:10': { diameter: 42 } };
L.touchTree('harness');
const before11 = snap();
ok('11.0 before the merge the scenario\'s own 42 wins there', dia(S1) === 42, String(dia(S1)));
act(() => L.smMergeUpward(T, C.id, B.id));
ok('11.1 the scenario\'s own 42 stays, and still wins there', L.scenarioById(S1.id).overrides['l:10'].diameter === 42 && dia(S1) === 42, String(dia(S1)));
ok('11.2 ...while the other scenario reads the merged 20 through B', dia(S2) === 20);
L.undo();
ok('11.3 undo', snap() === before11);
L.scenarioById(S1.id).overrides = {};
L.touchTree('harness');

console.log('--- 12. the command\'s flow ---');
const asked = [];
let answers = [];
global.window.lpnDialogAnswerer = function (req) { asked.push(req); return answers.length ? answers.shift() : undefined; };
const before12 = snap();
answers = [null];
L.smActMergeUpward(C.id);
ok('12.1 first it asks which ancestor, listing them by name, parent first, with Cancel last', asked[0] && asked[0].kind === 'choice' &&
	JSON.stringify(asked[0].choices.map((c) => c.label)) === JSON.stringify(['B', 'A', PC.lpn_scenario_base || 'Base', PC.lpn_cancel || 'Cancel']) &&
	asked[0].text === PC.lpn_sm_merge_pick.replace('{name}', 'C'), JSON.stringify(asked[0] && asked[0].choices));
ok('12.2 Cancel there writes nothing', snap() === before12);
asked.length = 0; answers = [A.id, false];
L.smActMergeUpward(C.id);
const q = asked[1] ? asked[1].text : '';
ok('12.3 then the question, naming the source, the count and the target', asked[1] && asked[1].kind === 'confirm' &&
	q.indexOf(PC.lpn_sm_merge_ask.replace('{n}', '2').replace('{name}', 'C').replace('{target}', 'A')) === 0, JSON.stringify(q));
ok('12.4 ...listing the skipped B and its value before anything is merged', q.indexOf(PC.lpn_sm_merge_skipped.replace(/\{between\}/g, 'B').replace('{name}', 'C').replace('{target}', 'A') + '\nPipe 10: Diameter') > 0, JSON.stringify(q));
ok('12.5 No writes nothing', snap() === before12);
asked.length = 0; answers = [A.id, true];
L.smActMergeUpward(C.id);
ok('12.6 Yes merges', rec(A.id).values['l:10'].diameter === 20 && rec(B.id).values['l:10'].diameter === 16 && !rec(C.id).values);
ok('12.7 ...and C stays selected', L.smSel() === C.id);
L.undo();
ok('12.8 one Ctrl+Z undoes all of it', snap() === before12);
asked.length = 0; answers = [B.id, true];
L.smActMergeUpward(BASEK);
ok('12.9 on Base it does nothing and asks nothing', asked.length === 0 && snap() === before12);
const E = L.smAdd(T, BASEK, false);
asked.length = 0;
L.smActMergeUpward(E.id);
ok('12.10 an empty alternative says it holds nothing to merge', asked.length === 1 && asked[0].kind === 'alert' && asked[0].text === PC.lpn_sm_merge_none.replace('{name}', L.smName(T, E.id)), JSON.stringify(asked[0]));
asked.length = 0; answers = [L.smBaseKey(TT), true];
L.smSetTree(TT);
L.smRecord(TT, T2.id).values = { 'n:22': { type: 'tank' } };
L.touchTree('harness');
L.smActMergeUpward(T2.id);
ok('12.11 a Morph alone, into Base: says it holds nothing to merge, and why', asked.length === 2 && asked[1].kind === 'alert' &&
	asked[1].text.indexOf(PC.lpn_sm_merge_keeps_morph.replace('{name}', L.smName(TT, T2.id))) > 0, JSON.stringify(asked[1] && asked[1].text));
L.smSetTree(T);

console.log('--- 13. Apply Base values is retired ---');
ok('13.1 no Scenarios menu row for it', !L.scenarioMenuRows().some((r) => /Apply Base/i.test(String(r.label || ''))));
ok('13.2 its words are gone', ['lpn_scenario_push_btn', 'lpn_scenario_push_tip', 'lpn_scenario_push_confirm', 'lpn_scenario_push_scenarios',
	'lpn_scenario_push_values', 'lpn_scenario_push_none'].every((k) => PC[k] === undefined));
const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
ok('13.3 and so is its handler', !/function pushBaseToScenarios|function pushHereButton/.test(src));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

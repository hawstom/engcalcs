// Headless check of TYPE OVERRIDES: Change type made in a scenario other than Base. Run with:
//   node dev/lpn-spike/scenario-type-override-harness.js
//
// Tom, 2026-10-07 (6a): *"You make it sound easy, so I guess we should build it out. I just want to
// minimize user confusion. So if Change type is used, with other than Base scenario, put up an alert
// box. 'Current scenario is not Base. Create overrides? [Create overrides] [Switch to Base]
// [Cancel]'"* -- dev/scenario-alternatives.md, "Type overrides".
//
// WHAT THIS HOLDS, on Net1, through the page's own chain (a real selection, changeSelectedType(),
// answered through the page's question box):
//   1. The question: exactly Tom's sentence and his three buttons, asked only outside Base.
//   2. Cancel writes nothing; Switch to Base switches and makes the ordinary Base change.
//   3. Create overrides: junction 22 is a tank in scenario B and a junction in Base, in the file,
//      the autosave and the undo step (all Base's), and in B's own override map.
//   4. HYDRAULICS, both engines: Base's heads unchanged to 1e-6; B's heads equal, to 1e-6, those of
//      a hand-built Net1 whose [TANKS] states a real tank 22 with B's values.
//   5. A Base-owned tank field typed in B (its highest depth) lands in B's map and nowhere else.
//   6. One undo, byte for byte; save and reopen; the .inp export of each scenario.
//   7. The asset-type pre-review's three findings, under a type override: pump -> pipe states the
//      New assets diameter it takes; Recalculate off shows no invented link result; a pipe whose
//      library type B chose keeps that type's diameter as a valve.
//   8. A Base change of an asset B states its own type for leaves B's asset as B had it.
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
require(ROOT + 'js/lpn-epanet.js');
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
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetScenarios: function () { return scenarios; }, activeScenario: activeScenario,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, redo: redo, importProject: importProject,\n" +
	"\t\tsetSelectionList: setSelectionList, changeSelectedType: changeSelectedType,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, runSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tcolorLinkValue: colorLinkValue, importInp: importInpFromFile, assembleModel: assembleModel,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(inpExportDocument(), inpExportOptions()); },\n" +
	"\t\tsaveToStorage: saveToStorage, makeUndoSnapshot: makeUndoSnapshot,\n" +
	// The Properties box's own Valve type select, rendered and changed as a person changes it.
	"\t\tpickValveType: function (id, v) { var f = document.createElement('div'), l = linkById(id), sel = null;\n" +
	"\t\t\trenderValveFields(f, l, id);\n" +
	"\t\t\t(function walk(e) { (e.children || e.childNodes || []).forEach(function (c) { if (!sel && c.tagName && String(c.tagName).toUpperCase() === 'SELECT') { sel = c; } walk(c); }); }(f));\n" +
	"\t\t\tif (!sel) { return false; } sel.value = v; (sel._listeners.change || []).slice().forEach(function (f) { f({ type: 'change', target: sel }); }); return true; },\n" +
	"\t\tnodeClass: function (id) { var e = nodeEls[id]; return e && e.circle ? e.circle.getAttribute('class') : null; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

// Every question the page asks is recorded; `answers` is a queue of replies by kind.
let asked = [], answers = { choice: [], confirm: [] };
global.window.lpnDialogAnswerer = function (req) {
	asked.push(req);
	if (req.kind === 'choice') { return answers.choice.length ? answers.choice.shift() : null; }
	if (req.kind === 'confirm') { return answers.confirm.length ? answers.confirm.shift() : true; }
	return undefined;
};

// The whole check, on a page built from js/looped-network.js as `mutate` leaves it. Returns the
// number of failed checks.
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
		return L;
	}
	const L = page();
	const S = L.getSettings();
	S.engine = 'native';
	const timeRunWas = global.EngCalcs.lpnTimeRun;
	// Net1 states 24 hours, which makes Calculate an asynchronous EPANET run; the instant is the same
	// question asked of both engines below, directly.
	global.EngCalcs.lpnTimeRun = null;
	const nativeHeads = (LL) => { const r = solver.lpnSolve((LL || L).assembleModel(), { tol: 1e-10 }); return r && r.converged ? r.heads : null; };
	const epanetHeads = async (LL) => { const r = await global.EngCalcs.lpnSolveEpanet((LL || L).assembleModel()); return r && r.ok ? r.heads : null; };
	function worst(a, b) {
		if (!a || !b) { return Infinity; }
		let w = 0;
		Object.keys(a).forEach((k) => { w = Math.max(w, Math.abs(a[k] - (b[k] === undefined ? NaN : b[k])) || (b[k] === undefined ? Infinity : 0)); });
		return w;
	}
	function change(kind, id, to, choice, confirm) {
		asked = [];
		answers = { choice: choice === undefined ? [] : [choice], confirm: confirm === undefined ? [] : [confirm] };
		L.setSelectionList([{ kind: kind, id: id }]);
		L.changeSelectedType(to);
		return asked;
	}
	const snap = () => JSON.stringify(L.serializeProject());
	const scnByName = (n) => L.getScenarios().filter((s) => s.name === n)[0];
	const ovIn = (n, key) => ((scnByName(n) || {}).overrides || {})[key] || {};
	function sectionOf(inp, id, links) {
		let sec = null; const found = [], secs = links ? ['PIPES', 'PUMPS', 'VALVES'] : ['JUNCTIONS', 'RESERVOIRS', 'TANKS'];
		inp.split(/\r?\n/).forEach((line) => {
			const m = /^\s*\[([A-Z]+)\]/.exec(line);
			if (m) { sec = m[1]; return; }
			const t = line.replace(/;.*$/, '').trim().split(/\s+/);
			if (t[0] === id && secs.indexOf(sec) >= 0) { found.push(sec); }
		});
		return found.join(',');
	}


	say('--- 1. the question, outside Base only ---');
	L.importInp({ name: 'Net1.inp', _text: NET1 });
	const baseNative0 = nativeHeads(), baseEpanet0 = await epanetHeads();
	ok('1.0 Net1 solves in both engines', !!baseNative0 && !!baseEpanet0);
	let q = change('node', '22', 'reservoir', undefined, false);
	ok('1.1 in Base no scope question is asked', !q.some((r) => r.kind === 'choice'), JSON.stringify(q.map((r) => r.kind)));
	L.undo();
	const B = L.createScenario('B');
	const before = snap(), inpBase0 = L.exportInp().inp;
	L.switchScenario(B.id);
	q = change('node', '22', 'tank', null);
	const ask = q[0] || {};
	ok('1.2 in scenario B the first question is the scope question', ask.kind === 'choice', JSON.stringify(q.map((r) => r.kind)));
	ok('1.3 ...in Tom\'s words', ask.text === PC.lpn_change_type_scenario_ask, ask.text);
	ok('1.4 ...with exactly his three buttons, in his order',
		JSON.stringify((ask.choices || []).map((c) => c.label)) === JSON.stringify([PC.lpn_change_type_create_overrides, PC.lpn_change_type_switch_base, PC.lpn_cancel]),
		JSON.stringify((ask.choices || []).map((c) => c.label)));

	say('\n--- 2. Cancel, and Switch to Base ---');
	ok('2.1 Cancel: nothing else asked, byte-identical, still in B', q.length === 1 && snap() === before && L.activeScenario().id === B.id);
	q = change('node', '22', 'tank', 'base');
	ok('2.2 Switch to Base: Base is showing', L.activeScenario().isBase);
	ok('2.3 ...and the ordinary Base change was made: a tank in Base and in B',
		L.nodeById('22').type === 'tank' && (L.switchScenario(B.id), L.nodeById('22').type === 'tank'));
	ok('2.4 ...with no type override stored', !('type' in ovIn('B', 'n:22')));
	L.undo();
	L.switchScenario(B.id);   // the switch is a view, not an edit: undo leaves Base showing
	ok('2.5 one undo: byte-identical', snap() === before);

	say('\n--- 3. Create overrides: a tank in B, a junction in Base ---');
	q = change('node', '22', 'tank', 'scenario');
	const n22 = L.nodeById('22');
	ok('3.1 only the scope question was asked (a junction made a tank loses nothing in B)', q.length === 1, JSON.stringify(q.map((r) => r.kind)));
	ok('3.2 in B node 22 is a tank, with the New assets depths',
		n22.type === 'tank' && L.effective(n22, 'level') === S.defaults.tankLevel && n22.maxLevel === S.defaults.tankMaxLevel &&
		n22.tankDiameter === S.defaults.tankDiameter, JSON.stringify(n22));
	ok('3.3 ...B\'s map holds the type and the tank\'s values', ovIn('B', 'n:22').type === 'tank' && 'level' in ovIn('B', 'n:22') &&
		'maxLevel' in ovIn('B', 'n:22'), JSON.stringify(ovIn('B', 'n:22')));
	const saved = L.serializeProject();
	const s22 = saved.nodes.filter((n) => n.id === '22')[0];
	ok('3.4 the file is Base\'s: 22 a junction with its demand 200, no tank field', s22.type === 'junction' && s22._demand === 200 &&
		!('maxLevel' in s22), JSON.stringify(s22));
	ok('3.5 ...and Base\'s nodes byte-identical to before', JSON.stringify(saved.nodes) === JSON.stringify(JSON.parse(before).nodes));
	ok('3.6 the undo step is Base\'s too', L.makeUndoSnapshot().state.doc.nodes.filter((n) => n.id === '22')[0].type === 'junction');
	ok('3.7 in B, 22 is drawn as a tank', /lpn-node-tank/.test(L.nodeClass('22') || ''), L.nodeClass('22'));
	L.switchScenario(L.baseScenario().id);
	ok('3.8 in Base 22 is a junction with demand 200, drawn as one', L.nodeById('22').type === 'junction' && L.effective(L.nodeById('22'), 'demand') === 200 &&
		/lpn-node-junction/.test(L.nodeClass('22') || ''), L.nodeClass('22'));
	L.switchScenario(B.id);

	say('\n--- 4. a Base-owned tank field typed in B is B\'s ---');
	L.setProp(n22, 'level', 260);
	n22.maxLevel = 300;   // what the Properties box's highest-depth field writes
	L.saveToStorage();
	ok('4.1 B\'s map holds the depth and the typed highest depth', ovIn('B', 'n:22').level === 260 && ovIn('B', 'n:22').maxLevel === 300,
		JSON.stringify(ovIn('B', 'n:22')));
	ok('4.2 ...the tank still shows it', L.nodeById('22').maxLevel === 300);
	ok('4.3 ...and Base\'s file has no highest depth on 22', !('maxLevel' in L.serializeProject().nodes.filter((n) => n.id === '22')[0]));

	say('\n--- 5. HYDRAULICS, both engines ---');
	const bNative = nativeHeads(), bEpanet = await epanetHeads();
	ok('5.1 B solves in both engines', !!bNative && !!bEpanet);
	ok('5.2 B\'s fixed head at 22 is its surface, 695 + 260 ft', bNative && Math.abs(bNative['22'] - (955 * 0.3048)) < 1e-9, bNative && bNative['22']);
	L.switchScenario(L.baseScenario().id);
	const baseNative1 = nativeHeads(), baseEpanet1 = await epanetHeads();
	ok('5.3 Base\'s heads unchanged to 1e-6, built-in solver', worst(baseNative0, baseNative1) < 1e-6, 'worst ' + worst(baseNative0, baseNative1));
	ok('5.4 Base\'s heads unchanged to 1e-6, EPANET', worst(baseEpanet0, baseEpanet1) < 1e-6, 'worst ' + worst(baseEpanet0, baseEpanet1));
	// The hand-built network: Net1 with junction 22 moved into [TANKS] with B's values.
	const tankRow = ' 22\t695\t260\t' + S.defaults.tankMinLevel + '\t300\t' + S.defaults.tankDiameter + '\t0\t\t;';
	const handInp = NET1.replace(/^ 22 [^\n]*\n/m, '').replace(/(\[TANKS\][^\n]*\n[^\n]*\n)/, '$1' + tankRow + '\n');
	ok('5.5 the hand-built file states 22 as a tank and not as a junction', sectionOf(handInp, '22') === 'TANKS', sectionOf(handInp, '22'));
	const H = page();
	H.getSettings().engine = 'native';
	H.importInp({ name: 'Net1-hand.inp', _text: handInp });
	const hNative = nativeHeads(H), hEpanet = await epanetHeads(H);
	ok('5.6 B\'s heads equal the hand-built network\'s to 1e-6, built-in solver', worst(hNative, bNative) < 1e-6 && Object.keys(hNative || {}).length === Object.keys(bNative || {}).length,
		'worst ' + worst(hNative, bNative));
	ok('5.7 ...and EPANET', worst(hEpanet, bEpanet) < 1e-6, 'worst ' + worst(hEpanet, bEpanet));
	ok('5.8 ...and the tank really changed the answer (22\'s head moved more than 1 ft)', baseNative0 && Math.abs(baseNative0['22'] - bNative['22']) > 0.3048,
		baseNative0 && (baseNative0['22'] / 0.3048).toFixed(2) + ' -> ' + (bNative['22'] / 0.3048).toFixed(2));

	say('\n--- 6. export, save and reopen, undo ---');
	const inpB0 = (L.switchScenario(B.id), L.exportInp().inp);
	ok('6.1 B\'s export writes 22 under [TANKS]', sectionOf(inpB0, '22') === 'TANKS', sectionOf(inpB0, '22'));
	L.switchScenario(L.baseScenario().id);
	const inpBase1 = L.exportInp().inp;
	const d62 = inpBase1.split('\n').filter((l, i) => l !== inpBase0.split('\n')[i]).slice(0, 3).join(' | ');
	ok('6.2 Base\'s export writes 22 under [JUNCTIONS], and is the export from before the change', sectionOf(inpBase1, '22') === 'JUNCTIONS' && inpBase1 === inpBase0, d62);
	const X = page();
	X.getSettings().engine = 'native';
	X.importInp({ name: 'Net1-B.inp', _text: inpB0 });
	ok('6.3 B\'s export, opened again, solves to B\'s heads (1e-6)', worst(nativeHeads(X), bNative) < 1e-6, 'worst ' + worst(nativeHeads(X), bNative));
	L.switchScenario(B.id);
	const file = JSON.parse(JSON.stringify(L.serializeProject()));
	const R = page();
	R.getSettings().engine = 'native';
	R.importProject(file);
	ok('6.4 reopened: B is showing, and 22 is a tank there with its depths',
		R.activeScenario().name === 'B' && R.nodeById('22').type === 'tank' && R.nodeById('22').maxLevel === 300 &&
		R.effective(R.nodeById('22'), 'level') === 260);
	R.getSettings().engine = 'native';
	ok('6.5 ...and solves to B\'s heads (1e-6)', worst(nativeHeads(R), bNative) < 1e-6, 'worst ' + worst(nativeHeads(R), bNative));
	R.switchScenario(R.baseScenario().id);
	ok('6.6 ...and in Base it is a junction again', R.nodeById('22').type === 'junction');
	// Undo: back to before the change in B, byte for byte.
	L.switchScenario(B.id);
	L.undo(); L.undo();
	ok('6.7 two undos (the depth, the change) put the document back byte for byte', snap() === before, '');
	ok('6.8 ...and 22 is a junction in B again', L.nodeById('22').type === 'junction');
	L.redo();
	ok('6.9 redo makes it B\'s tank again', L.nodeById('22').type === 'tank');
	L.undo();

	say('\n--- 7. the asset-type pre-review\'s findings, under a type override ---');
	{
		// (a) pump -> pipe: the New assets diameter, said in the box.
		L.switchScenario(B.id);
		q = change('link', '9', 'pipe', 'scenario', true);
		const box = (q[1] || {}).text || '';
		const p9 = L.linkById('9');
		ok('7.1 pump 9 -> pipe in B: the box says the diameter the pipe is born with', box.indexOf('9: ' + PC.lpn_field_diameter + ' ' + S.defaults.diameter + ' in') >= 0, box);
		ok('7.2 ...and it is that diameter in B, while Base\'s pump is untouched', p9.type === 'pipe' && L.effective(p9, 'diameter') === S.defaults.diameter &&
			(L.switchScenario(L.baseScenario().id), L.linkById('9').type === 'pump'));
		L.switchScenario(B.id);
		L.undo();
		// (b) Recalculate off: a changed link shows no invented result.
		S.autoRun = false;
		L.runSolve();
		const r0 = L.lastResult(), f9 = L.colorLinkValue(L.linkById('9'), 'flow');
		change('link', '9', 'pipe', 'scenario', true);
		ok('7.3 Recalculate off: the same stale solve is on show', L.lastResult() === r0);
		ok('7.4 ...and the new pipe shows no flow, velocity, head loss or gradient',
			['flow', 'velocity', 'headloss', 'gradient'].every((f) => L.colorLinkValue(L.linkById('9'), f) === undefined),
			['flow', 'velocity', 'headloss', 'gradient'].map((f) => L.colorLinkValue(L.linkById('9'), f)).join(','));
		L.undo();
		ok('7.5 undo puts the pump back with its own result', L.colorLinkValue(L.linkById('9'), 'flow') === f9);
		S.autoRun = true;
		// (c) a library pipe type chosen in B: its diameter stays B's on the valve.
		L.getDoc().pipeTypes = [{ id: 'DI30', props: { diameter: 30 } }];
		L.setProp(L.linkById('10'), 'typeId', 'DI30');
		ok('7.6 pipe 10 in B reads the library type\'s 30 in', L.effective(L.linkById('10'), 'diameter') === 30);
		change('link', '10', 'valve', 'scenario', true);
		const v10 = L.linkById('10');
		ok('7.7 pipe 10 -> valve in B: a TCV with B\'s 30 in, not Base\'s 18', v10.type === 'valve' && v10.valveType === 'TCV' &&
			L.effective(v10, 'diameter') === 30, JSON.stringify({ t: v10.type, vt: v10.valveType, d: L.effective(v10, 'diameter') }));
		L.switchScenario(L.baseScenario().id);
		ok('7.8 ...Base\'s pipe 10 is a pipe of 18 in', L.linkById('10').type === 'pipe' && L.effective(L.linkById('10'), 'diameter') === 18);
		const bv = nativeHeads();
		ok('7.9 Base still solves to its own heads', worst(baseNative0, bv) < 1e-6, 'worst ' + worst(baseNative0, bv));
	}

	say('\n--- 7b. Properties on B\'s own valve: the valve type and its setting are B\'s ---');
	{
		// Perry, 2026-10-07: TCV -> PRV in Properties showed the new setting, then left B's valve
		// with none once Base was laid back.
		L.switchScenario(B.id);
		ok('7b.1 Properties\' Valve type select was found and changed to PRV', L.pickValveType('10', 'PRV'));
		L.saveToStorage();   // Base laid back and out again, as every autosave does
		const v = L.linkById('10');
		ok('7b.2 B\'s valve is a PRV with the PRV default setting', v.valveType === 'PRV' && typeof L.effective(v, 'setting') === 'number' && L.effective(v, 'setting') !== 2,
			JSON.stringify({ vt: v.valveType, s: L.effective(v, 'setting'), ov: ovIn('B', 'l:10') }));
		ok('7b.3 ...held in B\'s map', ovIn('B', 'l:10').valveType === 'PRV' && typeof ovIn('B', 'l:10').setting === 'number', JSON.stringify(ovIn('B', 'l:10')));
		ok('7b.4 ...the file\'s pipe 10 has no setting or valve type', (function () { const l = L.serializeProject().links.filter((x) => x.id === '10')[0]; return l.type === 'pipe' && !('_setting' in l) && !('valveType' in l); }()));
		const pe = await epanetHeads();
		ok('7b.5 B solves with its PRV (EPANET, which a PRV needs)', !!pe, String(!!pe));
		L.switchScenario(L.baseScenario().id);
		ok('7b.6 Base still solves to its own heads', worst(baseNative0, nativeHeads()) < 1e-6);
		L.switchScenario(B.id);
		L.undo();
		ok('7b.7 one undo: back to B\'s TCV with setting 2', L.linkById('10').valveType === 'TCV' && L.effective(L.linkById('10'), 'setting') === 2,
			JSON.stringify(ovIn('B', 'l:10')));
		L.switchScenario(L.baseScenario().id);
	}

	say('\n--- 8. a Base change never reaches into B\'s own type ---');
	{
		// B: 10 a valve of 30 in. Base: 10 becomes a pump (no diameter of its own).
		q = change('link', '10', 'pump', undefined, true);
		ok('8.1 Base: 10 is a pump', L.linkById('10').type === 'pump');
		L.switchScenario(B.id);
		const v = L.linkById('10');
		ok('8.2 B: still a TCV valve of 30 in, with its setting', v.type === 'valve' && v.valveType === 'TCV' && L.effective(v, 'diameter') === 30 &&
			L.effective(v, 'setting') === 2, JSON.stringify({ t: v.type, d: L.effective(v, 'diameter'), s: L.effective(v, 'setting') }));
		const box = (q[0] || {}).text || '';
		ok('8.3 Base\'s box did not list B\'s valve values as lost', box.indexOf(', in scenario B') < 0, box);
		ok('8.4 both scenarios still solve', !!nativeHeads() && (L.switchScenario(L.baseScenario().id), !!nativeHeads()));
	}

	say('\n--- 9. back to Base\'s own type in B removes the override ---');
	{
		L.switchScenario(B.id);
		change('link', '10', 'pump', 'scenario', true);
		ok('9.1 10 back to Base\'s type (pump) in B: no type override left', !('type' in ovIn('B', 'l:10')) && L.linkById('10').type === 'pump',
			JSON.stringify(ovIn('B', 'l:10')));
		ok('9.2 ...and none of the valve\'s values', !('valveType' in ovIn('B', 'l:10')) && !('setting' in ovIn('B', 'l:10')), JSON.stringify(ovIn('B', 'l:10')));
	}

	global.EngCalcs.lpnTimeRun = timeRunWas;
	return fails;
}

// **LIVE MUTATIONS: EACH MUST TURN THIS HARNESS RED** (dev/testing-notes.md). One per way the type
// override could look right and be wrong.
const MUTATIONS = [
	['the scope question is never asked', (src) => src.replace(
		"\t\tif (inBaseScenario()) { go('base'); return; }", "\t\tgo('scenario'); return;")],
	['a file is written as the scenario sees it', (src) => src.replace(
		"\t\tif (!asSeen && typeView.list.length) {", "\t\tif (false) {")],
	['a Base-owned field typed in the scenario is not written back', (src) => src.replace(
		"if (!sameJSON(el[k], e.applied[k])) { writeOverrideIn(", "if (false) { writeOverrideIn(")],
	['a Base change reaches into a scenario\'s own type', (src) => src.replace(
		"if (owner.isBase || !plainObject(map[key]) || typeof map[key].type === 'string') { return; }",
		"if (owner.isBase || !plainObject(map[key])) { return; }")],
	['the scenario keeps no value both types have', (src) => src.replace(
		"\t\t\tif (pre.kept[p] === undefined || sameJSON(effective(el, p), pre.kept[p])) { return; }", "\t\t\treturn;")],
	['Properties\' valve type writes Base\'s setting in a scenario, and nothing writes it back', (src) => src.replace(
		"\t\t\tif (typeOverriddenHere(l)) {\n\t\t\t\twriteOverrideIn(activeScenario(), l, 'setting', defaultValveSetting(v));", "\t\t\tif (false) {").replace(
		"if (has.call(el, k) && !sameJSON(el[k], e.applied[k])) { writeOverrideIn(e.scn, el, e.props[k]", "if (false) { writeOverrideIn(e.scn, el, e.props[k]")],
	['the elements are not laid out for the scenario', (src) => src.replace(
		"\t\tif (typeOvAny) { typeViewApply(); } else { typeView.doc = doc; }", "\t\ttypeView.doc = doc;")]
];

(async function main() {
	await global.EngCalcs.lpnEpanetLoad();
	let fails = await run(null, false);
	console.log('\n--- 10. live mutations: each must turn this harness red ---');
	for (const m of MUTATIONS) {
		let red;
		try { red = await run(m[1], true); } catch (e) {
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

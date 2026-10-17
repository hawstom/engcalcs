// Headless check of MORPH in a scenario (Task 781). Run with:
//   node dev/lpn-spike/morph-harness.js
//
// Tom, 2026-10-14: *"I would like to create a scenario called 'Tank at J1' and change the J1
// junction to a tank in that scenario without having to delete and reconstitute the pipes
// connecting to it."* dev/scenario-alternatives.md, "Morph".
//
// EVERY HYDRAULIC CHECK SOLVES, in both engines, and compares with a HAND-BUILT Net1 .inp stating
// the network the scenario should be. On Net1, through the page's own chain:
//   1. Scenario "Tank at J1": Morph junction 22 into a tank. Same ID, same place, same four pipes;
//      the type is an Active topology override, the tank's values Physical and Initial settings
//      overrides from Settings > New assets. Both engines equal a hand-built Net1 with a tank at 22.
//   2. Base: 22 is a junction again, unchanged; Base heads and Base's export unchanged.
//   3. The scenario's .inp export writes 22 under [TANKS] with its four pipes; reopened, it solves
//      to the scenario's heads.
//   4. The project saved and reopened: the morph round-trips, and the file saves to the same bytes.
//   5. Undo and redo of the morph, one step each.
//   6. Inheritance: a child scenario has the tank; morphed back there, the parent keeps it.
//   7. Clearing the override (or picking Base's Active topology) gives Base's type back.
//   8. A link: pipe 10 into a valve in a scenario, a TCV, both engines; Base keeps the pipe.
//   9. A reservoir into a tank keeps its water surface; a node is refused a link type, said.
//  10. Base morphing 22 while a scenario morphs it keeps what the scenario reads.
//  11. Live mutations: each must turn this harness red.
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
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp, clearOverride: clearOverride,\n" +
	"\t\thasOverride: hasOverride, resolvedOverrides: resolvedOverrides, writeTargetFor: writeTargetFor,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tsetScenarioParent: setScenarioParent, saveUndoSnapshot: saveUndoSnapshot, touchTree: touchTree, assignAlternative: assignAlternative,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, redo: redo, importProject: importProject,\n" +
	"\t\tsetSelectionList: setSelectionList, changeSelectedType: changeSelectedType,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, assembleModel: assembleModel, importInp: importInpFromFile,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; }, buildDom: buildDom, breakPipeAtPoint: breakPipeAtPoint,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(inpExportDocument(), inpExportOptions()); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let asked = [];
global.window.lpnDialogAnswerer = function (req) {
	asked.push(req);
	return req.kind === 'confirm' ? true : undefined;
};

// A copy of Net1 with sections edited line by line: `drop` lists [section, id] rows to remove,
// `add` lists [section, row text] rows to append to a section.
function editInp(drop, add) {
	let sec = null;
	const out = [];
	NET1.split(/\r?\n/).forEach((line) => {
		const m = /^\s*\[([A-Z]+)\]/.exec(line);
		if (m) {
			if (sec) { add.filter((a) => a[0] === sec).forEach((a) => out.push(a[1])); }
			sec = m[1];
			out.push(line);
			return;
		}
		const id = line.replace(/;.*$/, '').trim().split(/\s+/)[0];
		if (id && drop.some((d) => d[0] === sec && d[1] === id)) { return; }
		out.push(line);
	});
	return out.join('\n');
}
// The sections of an .inp that name `id` as an asset, and the rows of [PIPES] that end at it.
function sectionOf(inp, id) {
	let sec = null; const found = [];
	inp.split(/\r?\n/).forEach((line) => {
		const m = /^\s*\[([A-Z]+)\]/.exec(line);
		if (m) { sec = m[1]; return; }
		const t = line.replace(/;.*$/, '').trim().split(/\s+/);
		if (t[0] === id && ['JUNCTIONS', 'RESERVOIRS', 'TANKS', 'PIPES', 'PUMPS', 'VALVES'].indexOf(sec) >= 0) { found.push(sec); }
	});
	return found.join(',');
}
function pipesAt(inp, id) {
	let sec = null; const found = [];
	inp.split(/\r?\n/).forEach((line) => {
		const m = /^\s*\[([A-Z]+)\]/.exec(line);
		if (m) { sec = m[1]; return; }
		const t = line.replace(/;.*$/, '').trim().split(/\s+/);
		if (sec === 'PIPES' && t.length > 2 && (t[1] === id || t[2] === id)) { found.push(t.slice(0, 3).join(' ')); }
	});
	return found.sort().join('|');
}

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
	const timeRunWas = global.EngCalcs.lpnTimeRun;
	global.EngCalcs.lpnTimeRun = null;
	const nativeHeads = (LL) => { const r = solver.lpnSolve(LL.assembleModel(), { tol: 1e-10 }); return r && r.converged ? r.heads : null; };
	const epanetHeads = async (LL) => { const r = await global.EngCalcs.lpnSolveEpanet(LL.assembleModel()); return r && r.ok ? r.heads : null; };
	function worst(a, b) {
		if (!a || !b) { return Infinity; }
		if (Object.keys(a).length !== Object.keys(b).length) { return Infinity; }
		let w = 0;
		Object.keys(a).forEach((k) => { w = (b[k] === undefined) ? Infinity : Math.max(w, Math.abs(a[k] - b[k])); });
		return w;
	}
	async function bothHeads(LL) { return { n: nativeHeads(LL), e: await epanetHeads(LL) }; }
	async function hand(text) { const H = page(); H.importInp({ name: 'hand.inp', _text: text }); return bothHeads(H); }
	const L = page();
	const S = L.getSettings();
	const snap = () => JSON.stringify(L.serializeProject());
	const base = () => L.switchScenario(L.baseScenario().id);
	function morph(refs, to) {
		asked = [];
		L.setSelectionList(refs.map((r) => ({ kind: r[0], id: r[1] })));
		L.changeSelectedType(to);
		return asked;
	}

	L.importInp({ name: 'Net1.inp', _text: NET1 });
	const base0 = await bothHeads(L);
	ok('0.1 Net1 solves in both engines', !!base0.n && !!base0.e);
	const inpBase0 = L.exportInp().inp;
	const node22 = JSON.stringify(L.nodeById('22'));
	const file0 = snap();

	say('--- 1. scenario "Tank at J1": junction 22 morphed into a tank ---');
	const T = L.createScenario('Tank at J1');
	L.switchScenario(T.id);
	const preMorph = snap();
	const q = morph([['node', '22']], 'tank');
	const n22 = L.nodeById('22');
	ok('1.1 22 is a tank in the scenario, no box asked', n22.type === 'tank' && q.length === 0, JSON.stringify(q.map((r) => r.kind)));
	ok('1.2 ...the same node: one node 22, the same object, at the same place',
		L.getDoc().nodes.filter((n) => n.id === '22').length === 1 && n22 === L.getDoc().nodes.filter((n) => n.id === '22')[0] &&
		n22.x === JSON.parse(node22).x && n22.y === JSON.parse(node22).y);
	ok('1.3 ...with its four pipes, ends unchanged', ['21', '22', '112', '122'].every((id) => { const l = L.linkById(id); return l && (l.from === '22' || l.to === '22'); }));
	const ov = L.resolvedOverrides(T)['n:22'] || {};
	ok('1.4 the type is an override, the tank\'s values New assets overrides',
		ov.type === 'tank' && ov.level === S.defaults.tankLevel && ov.minLevel === S.defaults.tankMinLevel &&
		ov.maxLevel === S.defaults.tankMaxLevel && ov.tankDiameter === S.defaults.tankDiameter, JSON.stringify(ov));
	const tt = L.writeTargetFor(T, 'topology');
	ok('1.5 ...the type in the scenario\'s Active topology alternative, the diameter in its Physical one',
		tt && tt.kind === 'alt' && tt.obj.category === 'topology' && tt.obj.values['n:22'].type === 'tank' &&
		L.writeTargetFor(T, 'physical').obj.values['n:22'].tankDiameter === S.defaults.tankDiameter &&
		L.writeTargetFor(T, 'initial').obj.values['n:22'].level === S.defaults.tankLevel);
	ok('1.6 the ground is kept: elevation 695', L.effective(n22, 'elev') === 695);
	const tH = await bothHeads(L);
	const tankRow = ' 22\t695\t' + S.defaults.tankLevel + '\t' + S.defaults.tankMinLevel + '\t' + S.defaults.tankMaxLevel + '\t' + S.defaults.tankDiameter + '\t0\t\t;';
	const hT = await hand(editInp([['JUNCTIONS', '22'], ['DEMANDS', '22']], [['TANKS', tankRow]]));
	ok('1.7 the scenario equals a hand-built Net1 with a tank at 22, built-in solver', worst(tH.n, hT.n) < 1e-6, 'worst ' + worst(tH.n, hT.n));
	ok('1.8 ...and EPANET', worst(tH.e, hT.e) < 1e-6, 'worst ' + worst(tH.e, hT.e));
	ok('1.9 ...and the tank changed the answer: 22 holds its water surface, 695 + depth', Math.abs(tH.n['22'] - base0.n['22']) > 0.3048 &&
		Math.abs(tH.n['22'] - (695 + S.defaults.tankLevel) * 0.3048) < 1e-6, tH.n['22'] + ' vs ' + base0.n['22']);

	say('\n--- 2. Base: the junction, unchanged ---');
	base();
	ok('2.1 22 is a junction in Base, every stored field as before', L.nodeById('22').type === 'junction' && JSON.stringify(L.nodeById('22')) === node22,
		JSON.stringify(L.nodeById('22')));
	const b2 = await bothHeads(L);
	ok('2.2 Base heads unchanged to 1e-9, both engines', worst(base0.n, b2.n) < 1e-9 && worst(base0.e, b2.e) < 1e-9);
	ok('2.3 Base\'s export is the export from before, character for character', L.exportInp().inp === inpBase0);
	L.switchScenario(T.id);
	ok('2.4 back in the scenario, 22 is a tank again', L.nodeById('22').type === 'tank');

	say('\n--- 3. the scenario\'s .inp export ---');
	const inpT = L.exportInp().inp;
	ok('3.1 22 is written under [TANKS], and nowhere else', sectionOf(inpT, '22') === 'TANKS,PIPES', sectionOf(inpT, '22'));
	ok('3.2 ...with its four pipes, the same rows as Base\'s export', pipesAt(inpT, '22') === pipesAt(inpBase0, '22') && pipesAt(inpT, '22').split('|').length === 4, pipesAt(inpT, '22'));
	const X = page();
	X.importInp({ name: 'T.inp', _text: inpT });
	const xH = await bothHeads(X);
	ok('3.3 reopened, the export solves to the scenario\'s heads, both engines', worst(xH.n, tH.n) < 1e-6 && worst(xH.e, tH.e) < 1e-6, worst(xH.n, tH.n) + ' / ' + worst(xH.e, tH.e));

	say('\n--- 4. save and reopen ---');
	const fileL = snap();
	const fileObj = JSON.parse(fileL);
	const in0 = JSON.stringify(JSON.parse(file0).nodes.filter((n) => n.id === '22')[0]);
	ok('4.1 the file holds Base\'s junction 22 as it was (the morph is an override, not the element)',
		fileObj.nodes.filter((n) => n.id === '22')[0].type === 'junction' && JSON.stringify(fileObj.nodes.filter((n) => n.id === '22')[0]) === in0);
	const R = page();
	R.importProject(JSON.parse(fileL));
	ok('4.2 reopened: the scenario is showing and 22 is a tank', R.activeScenario().name === 'Tank at J1' && R.nodeById('22').type === 'tank');
	const rH = await bothHeads(R);
	ok('4.3 ...and solves to the scenario\'s heads, both engines', worst(rH.n, tH.n) < 1e-9 && worst(rH.e, tH.e) < 1e-9);
	const fileR = JSON.stringify(R.serializeProject());
	let at = 0; while (at < fileR.length && fileR[at] === fileL[at]) { at++; }
	ok('4.4 ...and saves to the same bytes', fileR === fileL, fileL.slice(at - 60, at + 60) + ' || ' + fileR.slice(at - 60, at + 60));
	R.switchScenario(R.baseScenario().id);
	ok('4.5 ...and in Base 22 is the junction', R.nodeById('22').type === 'junction' && JSON.stringify(R.nodeById('22')) === node22);

	say('\n--- 5. undo and redo ---');
	const morphed = snap();
	L.undo();
	ok('5.1 one undo: 22 a junction in the scenario, the document byte for byte as before the morph', L.nodeById('22').type === 'junction' && snap() === preMorph);
	L.redo();
	ok('5.2 redo: the tank again, byte for byte', L.nodeById('22').type === 'tank' && snap() === morphed);

	say('\n--- 6. inheritance ---');
	const C = L.createScenario('Child', T.id);
	L.switchScenario(C.id);
	ok('6.1 the child inherits the morph: 22 a tank', L.nodeById('22').type === 'tank');
	const cH = await bothHeads(L);
	ok('6.2 ...and its heads equal the parent\'s, both engines', worst(cH.n, tH.n) < 1e-9 && worst(cH.e, tH.e) < 1e-9);
	morph([['node', '22']], 'junction');
	ok('6.3 morphed back in the child: a junction there', L.nodeById('22').type === 'junction' && L.resolvedOverrides(C)['n:22'].type === 'junction');
	const c2 = await bothHeads(L);
	ok('6.4 ...solving to Base\'s heads, both engines', worst(c2.n, base0.n) < 1e-6 && worst(c2.e, base0.e) < 1e-6, worst(c2.n, base0.n));
	L.switchScenario(T.id);
	ok('6.5 ...while the parent keeps its tank', L.nodeById('22').type === 'tank');

	say('\n--- 7. clearing the override gives the type back ---');
	L.saveUndoSnapshot();
	L.clearOverride(L.nodeById('22'), 'type');
	L.buildDom();
	ok('7.1 Clear override on the type: 22 a junction in the scenario', L.nodeById('22').type === 'junction');
	const c7 = await bothHeads(L);
	ok('7.2 ...solving to Base\'s heads', worst(c7.n, base0.n) < 1e-6 && worst(c7.e, base0.e) < 1e-6);
	L.undo();
	ok('7.3 undo: the tank again', L.nodeById('22').type === 'tank');
	// Morph back to Base's own type removes the override rather than stating "junction".
	morph([['node', '22']], 'junction');
	ok('7.4 Morph back to junction in the scenario removes the type override, and the tank\'s values with it',
		L.nodeById('22').type === 'junction' && !L.hasOverride(L.nodeById('22'), 'type') &&
		['level', 'minLevel', 'maxLevel', 'tankDiameter'].every((p) => !L.hasOverride(L.nodeById('22'), p)) && !L.resolvedOverrides(T)['n:22'],
		JSON.stringify(L.resolvedOverrides(T)['n:22']));
	L.undo();
	ok('7.5 undo: the tank again', L.nodeById('22').type === 'tank');
	// The scenario picks Base's Active topology alternative (the Scenarios table): the morph is not
	// read there, and the solve sees it at once.
	L.saveUndoSnapshot();
	L.assignAlternative(T.id, 'topology', 'base');
	const c8 = await bothHeads(L);
	ok('7.6 the scenario uses Base\'s Active topology: 22 a junction, solving to Base\'s heads', L.nodeById('22').type === 'junction' &&
		worst(c8.n, base0.n) < 1e-6 && worst(c8.e, base0.e) < 1e-6, L.nodeById('22').type);
	L.undo();
	ok('7.7 undo: its own Active topology, and the tank, again', L.nodeById('22').type === 'tank');

	say('\n--- 8. a link: pipe 10 into a valve in scenario V ---');
	{
		base();
		const V = L.createScenario('V');
		L.switchScenario(V.id);
		morph([['link', '10']], 'valve');
		const v = L.linkById('10');
		ok('8.1 10 is a TCV valve in V on its own ends', v.type === 'valve' && v.valveType === 'TCV' && v.from === '10' && v.to === '11');
		const vH = await bothHeads(L);
		const vRow = ' 10\t10\t11\t18\tTCV\t' + L.effective(v, 'setting') + '\t' + (L.effective(v, 'k') || 0) + '\t;';
		const hV = await hand(editInp([['PIPES', '10']], [['VALVES', vRow]]));
		ok('8.2 V equals a hand-built Net1 with a TCV at 10, built-in solver', worst(vH.n, hV.n) < 1e-6, 'worst ' + worst(vH.n, hV.n));
		ok('8.3 ...and EPANET', worst(vH.e, hV.e) < 1e-6, 'worst ' + worst(vH.e, hV.e));
		ok('8.4 V\'s export writes link 10 under [VALVES] (node 10 stays a junction)', sectionOf(L.exportInp().inp, '10') === 'JUNCTIONS,VALVES', sectionOf(L.exportInp().inp, '10'));
		base();
		ok('8.5 in Base 10 is the pipe, valve type absent', L.linkById('10').type === 'pipe' && L.linkById('10').valveType === undefined);
		ok('8.6 ...and Base\'s export is unchanged', L.exportInp().inp === inpBase0);
		// Perry, 2026-10-14: a split in Base copied V's morph onto the new half.
		const p10 = L.linkById('10'), a = L.nodeById(p10.from), b = L.nodeById(p10.to);
		L.saveUndoSnapshot();
		const made = L.breakPipeAtPoint(p10, 'junction', (a.x + b.x) / 2, (a.y + b.y) / 2);
		const mid = L.linkById('10').to;
		const half = L.getDoc().links.filter((l) => l.id !== '10' && l.from === mid)[0];
		L.switchScenario(V.id);
		ok('8.7 pipe 10 split in Base: in V, 10 is still the valve and the new half a pipe, holding no type override',
			!!made && mid !== '11' && L.linkById('10').type === 'valve' && !!half && half.to === '11' && L.linkById(half.id).type === 'pipe' &&
			!(L.resolvedOverrides(V)['l:' + half.id] || {}).type && (L.resolvedOverrides(V)['l:' + half.id] || {}).setting === undefined,
			half && (half.id + ' ' + L.linkById(half.id).type + ' ' + JSON.stringify(L.resolvedOverrides(V)['l:' + half.id])));
		base();
		L.undo();
		ok('8.8 undo: one pipe 10 again', !L.getDoc().links.some((l) => half && l.id === half.id), half && half.id + ' ' + L.getDoc().links.length + ' ' + L.linkById('10').to);
		// A pump has no head curve until one is chosen: said, as Base says it.
		const P2 = L.createScenario('Pump');
		L.switchScenario(P2.id);
		const q8 = morph([['link', '11']], 'pump');
		ok('8.9 pipe 11 into a pump in a scenario: the box says it has no head curve, in Base\'s words',
			q8.length === 1 && q8[0].text.indexOf(String(PC.lpn_change_type_no_curve).replace('{id}', '11')) >= 0 && L.linkById('11').type === 'pump',
			q8[0] && q8[0].text);
		base();
	}

	say('\n--- 9. a reservoir keeps its surface; a node is refused a link type ---');
	{
		const W = L.createScenario('W');
		L.switchScenario(W.id);
		morph([['node', '9'], ['link', '10']], 'tank');
		const r9 = L.nodeById('9');
		ok('9.1 reservoir 9 is a tank in W; its depth keeps the water surface (head 800 - ground)',
			r9.type === 'tank' && L.effective(r9, 'elev') !== undefined && Math.abs(L.effective(r9, 'elev') + L.effective(r9, 'level') - 800) < 1e-9,
			L.effective(r9, 'elev') + ' + ' + L.effective(r9, 'level'));
		const said = L.lastNotice();
		ok('9.2 ...and pipe 10, a link, is left as it is, said in the page\'s words', L.linkById('10').type === 'pipe' &&
			said === String(PC.lpn_morph_other_kind).replace('{ids}', '10'), said);
		base();
		ok('9.3 Base: 9 is the reservoir', L.nodeById('9').type === 'reservoir');
	}

	say('\n--- 10. Base morphs 22 while a scenario morphs it ---');
	{
		base();
		const demandWas = L.effective(L.nodeById('22'), 'demand');
		const K = L.createScenario('Keep');
		L.switchScenario(K.id);
		morph([['node', '22']], 'reservoir');
		base();
		morph([['node', '22']], 'tank');
		ok('10.1 Base: 22 is a tank', L.nodeById('22').type === 'tank');
		L.switchScenario(K.id);
		ok('10.2 Keep still has a reservoir', L.nodeById('22').type === 'reservoir');
		L.switchScenario(C.id);
		ok('10.3 Child, which morphed 22 back to a junction, keeps Base\'s old demand', L.nodeById('22').type === 'junction' &&
			L.effective(L.nodeById('22'), 'demand') === demandWas, L.effective(L.nodeById('22'), 'demand') + ' vs ' + demandWas);
		const kH = await bothHeads(L);
		ok('10.4 ...and solves to Base\'s original heads', worst(kH.n, base0.n) < 1e-6 && worst(kH.e, base0.e) < 1e-6, worst(kH.n, base0.n));
		base();
	}
	ok('11.0 (the document before any of this saved as it was opened)', file0.length > 0);

	say('\n--- 12. what a scenario morph would lose is said first ---');
	{
		const text = NET1.replace(/\[RULES\]\n/, '[RULES]\nRULE R1\nIF JUNCTION 22 PRESSURE BELOW 1\nTHEN LINK 112 STATUS IS CLOSED\n');
		const P = page();
		P.importInp({ name: 'Net1-rule.inp', _text: text });
		P.getDoc().customers.push({ id: 'M9', demand: 25, count: 1, link: null, node: '22', x: 0, y: 0 });
		P.buildDom();
		const Z = P.createScenario('Tank at J1');
		P.switchScenario(Z.id);
		asked = [];
		P.setSelectionList([{ kind: 'node', id: '22' }]);
		P.changeSelectedType('tank');
		const t = asked[0] ? asked[0].text : '';
		ok('12.1 one box, listing customer M9 as lost in this scenario, in Base\'s words', asked.length === 1 &&
			t.indexOf(String(PC.lpn_change_type_lost)) >= 0 &&
			t.indexOf(String(PC.lpn_change_type_line_scenario).replace('{id}', '22').replace('{property}', PC.lpn_tool_add_meter).replace('{value}', 'M9').replace('{scenario}', 'Tank at J1')) >= 0, t);
		ok('12.2 ...and the rule naming JUNCTION 22', t.indexOf('IF JUNCTION 22 PRESSURE BELOW 1') >= 0);
		ok('12.3 answered, 22 is a tank in the scenario', P.nodeById('22').type === 'tank');
	}

	global.EngCalcs.lpnTimeRun = timeRunWas;
	return fails;
}

// **LIVE MUTATIONS: EACH MUST TURN THIS HARNESS RED** (dev/testing-notes.md).
const MUTATIONS = [
	['Morph in a scenario changes Base instead', (src) => src.replace(
		"if (!inBaseFor('topology')) { morphInScenario(to); return; }", "")],
	['the elements are not laid out for the scenario', (src) => src.replace(
		"\t\t// The elements laid out as the scenario showing sees them (Morph) before any is drawn.\n\t\tmorphViewSync();\n", "")],
	['the file is written with the scenario\'s types', (src) => src.replace(
		"if (!asSeen && morphView.list.length) {", "if (false) {")],
	['the .inp export writes Base\'s types', (src) => src.replace(
		"var snap = serializeProject(true), block = scenarioSettingsBlock(", "var snap = serializeProject(), block = scenarioSettingsBlock(")],
	['the undo snapshot keeps the scenario\'s types', (src) => src.replace(
		"state: withBaseTypes(function () { return JSON.parse(JSON.stringify({ doc: doc, scenarios: scenarios, active: project.activeScenario })); }),",
		"state: JSON.parse(JSON.stringify({ doc: doc, scenarios: scenarios, active: project.activeScenario })),")],
	['a Base morph strips what a morphed scenario reads', (src) => src.replace("\t\tmorphPinBase(n, to);\n", "")],
	['a split copies the morph onto the new half', (src) => src.replace("\t\t\tdelete c2.type; delete c2.valveType;\n", "")],
	['a scenario morph says nothing of a customer\'s demand', (src) => src.replace("lost.push(changeTypeLine(LINE_S, el.id, pc.lpn_tool_add_meter", "void(changeTypeLine(LINE_S, el.id, pc.lpn_tool_add_meter")]
];

(async function main() {
	await global.EngCalcs.lpnEpanetLoad();
	let fails = await run(null, false);
	console.log('\n--- 11. live mutations: each must turn this harness red ---');
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

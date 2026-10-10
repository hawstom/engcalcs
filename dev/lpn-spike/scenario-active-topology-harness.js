// Headless check of ACTIVE TOPOLOGY and of Change type (Base only, in place; refused in a scenario) (Task 781). Run with:
//   node dev/lpn-spike/scenario-active-topology-harness.js
//
// Tom, 2026-10-08, choosing "Active topology first": *"I never wanted what we have anyway. Now that
// I understand, I want it changed. Change type is to be make a new object at the location of the
// old object. And that's physically analogous."* -- dev/scenario-alternatives.md, "Active topology"
// and "Change type in a scenario".
//
// EVERY HYDRAULIC CHECK SOLVES, in both engines, and compares with a HAND-BUILT Net1 .inp that
// states the network the scenario should be. On Net1, through the page's own chain:
//   1. A pipe drawn in scenario N is active only in N: Base's heads unchanged to 1e-6; N's equal a
//      hand-built Net1 with that pipe.
//   2. A pipe deactivated in scenario D: D's heads equal a hand-built Net1 without it; the pipe is
//      drawn greyed in D and in a node's absence its links are greyed too.
//   3. Change type: in Base junction 22 becomes a tank in place (ID kept), equal to a hand-built
//      Net1; in scenario B it is refused in one sentence, nothing changes; B switches pipe 21 off.
//   4. Inheritance: C, a child of B, has B's topology and B's heads.
//   5. Save and reopen; the .inp export of each scenario, reopened and solved.
//   6. Undo and redo of the Base change.
//   7. A link: pipe 10 -> valve refused in V, in place in Base.
//   8. A file a type override was saved in opens with it dropped.
//   9. Live mutations: each must turn this harness red.
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
	"\t\tsetScenarioParent: setScenarioParent, addLink: addLink, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, redo: redo, importProject: importProject,\n" +
	"\t\tsetSelectionList: setSelectionList, selectedRefs: selectedRefs, changeSelectedType: changeSelectedType,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, assembleModel: assembleModel, importInp: importInpFromFile,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; },\n" +
	"\t\tisActive: isActive, linkLive: linkLive, liveInScenario: liveInScenario, buildDom: buildDom,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(inpExportDocument(), inpExportOptions()); },\n" +
	"\t\tnodeClass: function (id) { var e = nodeEls[id]; return e && e.circle ? e.circle.getAttribute('class') : null; },\n" +
	"\t\tlinkClass: function (id) { var e = linkEls[id]; return e && e.line ? e.line.getAttribute('class') : null; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let asked = [], answers = { choice: [], confirm: [] };
global.window.lpnDialogAnswerer = function (req) {
	asked.push(req);
	if (req.kind === 'choice') { return answers.choice.length ? answers.choice.shift() : null; }
	if (req.kind === 'confirm') { return answers.confirm.length ? answers.confirm.shift() : true; }
	return undefined;
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
	// The worst difference over every node of `a`, `b` read through `rename` (a's id -> b's id), and
	// Infinity where the two networks do not hold the same nodes.
	function worst(a, b, rename) {
		if (!a || !b) { return Infinity; }
		if (Object.keys(a).length !== Object.keys(b).length) { return Infinity; }
		let w = 0;
		Object.keys(a).forEach((k) => {
			const kb = (rename && rename[k]) || k;
			w = (b[kb] === undefined) ? Infinity : Math.max(w, Math.abs(a[k] - b[kb]));
		});
		return w;
	}
	async function bothHeads(LL) { return { n: nativeHeads(LL), e: await epanetHeads(LL) }; }
	async function hand(text) { const H = page(); H.importInp({ name: 'hand.inp', _text: text }); return bothHeads(H); }
	const L = page();
	const S = L.getSettings();
	const snap = () => JSON.stringify(L.serializeProject());
	const base = () => L.switchScenario(L.baseScenario().id);
	function change(kind, id, to, choice, confirm) {
		asked = [];
		answers = { choice: choice === undefined ? [] : [choice], confirm: confirm === undefined ? [] : [confirm] };
		L.setSelectionList([{ kind: kind, id: id }]);
		L.changeSelectedType(to);
		return asked;
	}

	L.importInp({ name: 'Net1.inp', _text: NET1 });
	const base0 = await bothHeads(L);
	ok('0.1 Net1 solves in both engines', !!base0.n && !!base0.e);
	const inpBase0 = L.exportInp().inp;

	say('--- 1. a pipe drawn in scenario N is active only in N ---');
	const N = L.createScenario('N');
	L.switchScenario(N.id);
	L.saveUndoSnapshot();
	const np = L.addLink('pipe', '10', '22');
	const npRow = ' ' + np.id + '\t10\t22\t' + L.effective(np, 'length') + '\t' + L.effective(np, 'diameter') + '\t' +
		L.effective(np, 'roughness') + '\t' + (L.effective(np, 'k') || 0) + '\tOpen\t;';
	ok('1.1 the new pipe is active in N', L.isActive(np));
	const nH = await bothHeads(L);
	const hN = await hand(editInp([], [['PIPES', npRow]]));
	ok('1.2 N equals hand-built Net1 with the pipe, built-in solver', worst(nH.n, hN.n) < 1e-6, 'worst ' + worst(nH.n, hN.n));
	ok('1.3 ...and EPANET', worst(nH.e, hN.e) < 1e-6, 'worst ' + worst(nH.e, hN.e));
	ok('1.4 ...and the pipe moved the answer (more than 1 ft at 22)', Math.abs(nH.n['22'] - base0.n['22']) > 0.3048);
	base();
	ok('1.5 in Base the pipe is inactive and drawn greyed', !L.isActive(L.linkById(np.id)) && /lpn-inactive/.test(L.linkClass(np.id) || ''));
	const b1 = await bothHeads(L);
	ok('1.6 Base heads unchanged to 1e-6, built-in solver', worst(base0.n, b1.n) < 1e-6, 'worst ' + worst(base0.n, b1.n));
	ok('1.7 ...and EPANET', worst(base0.e, b1.e) < 1e-6, 'worst ' + worst(base0.e, b1.e));
	ok('1.8 Base\'s export leaves it out', sectionOf(L.exportInp().inp, np.id) === '');
	L.switchScenario(N.id);
	ok('1.9 N\'s export writes it', sectionOf(L.exportInp().inp, np.id) === 'PIPES');
	base();

	say('\n--- 2. a pipe deactivated in scenario D ---');
	const D = L.createScenario('D');
	L.switchScenario(D.id);
	L.setProp(L.linkById('111'), 'active', false);
	L.buildDom();
	ok('2.1 pipe 111 is drawn greyed in D', /lpn-inactive/.test(L.linkClass('111') || ''), L.linkClass('111'));
	const dH = await bothHeads(L);
	const hD = await hand(editInp([['PIPES', '111']], []));
	ok('2.2 D equals hand-built Net1 without pipe 111, built-in solver', worst(dH.n, hD.n) < 1e-6, 'worst ' + worst(dH.n, hD.n));
	ok('2.3 ...and EPANET', worst(dH.e, hD.e) < 1e-6, 'worst ' + worst(dH.e, hD.e));
	ok('2.4 ...and it moved the answer', Math.abs(dH.n['21'] - base0.n['21']) > 0.3048);
	// A node switched off takes its links out of the solve and greys them.
	L.setProp(L.nodeById('32'), 'active', false);
	L.buildDom();
	ok('2.5 junction 32 inactive in D: pipes 31 and 122 are not live and are drawn greyed',
		!L.linkLive(L.linkById('31')) && !L.linkLive(L.linkById('122')) && /lpn-inactive/.test(L.linkClass('31') || '') &&
		/lpn-inactive/.test(L.linkClass('122') || ''), L.linkClass('31'));
	ok('2.6 ...while their own Active flag is unchanged', L.isActive(L.linkById('31')));
	ok('2.7 ...and the solve leaves them out', !L.assembleModel().links.some((l) => l.id === '31' || l.id === '122'));
	L.setProp(L.nodeById('32'), 'active', true);
	base();
	ok('2.8 in Base 111 is live and not greyed', L.linkLive(L.linkById('111')) && !/lpn-inactive/.test(L.linkClass('111') || ''));

	say('\n--- 3. Change type works in Base only: in place there, refused in a scenario ---');
	base();
	const before0 = snap();
	let q = change('node', '22', 'tank', undefined, true);
	ok('3.1 in Base, junction 22 becomes a tank in place: the ID is kept, one node 22', L.nodeById('22').type === 'tank' &&
		L.getDoc().nodes.filter((n) => n.id === '22').length === 1);
	const tH = await bothHeads(L);
	const tankRow = ' 22\t695\t' + S.defaults.tankLevel + '\t' + S.defaults.tankMinLevel + '\t' + S.defaults.tankMaxLevel + '\t' + S.defaults.tankDiameter + '\t0\t\t;';
	const handT = editInp([['JUNCTIONS', '22']], [['TANKS', tankRow]]);
	const hT = await hand(handT);
	ok('3.2 Base equals the hand-built Net1 with a real tank at 22, built-in solver', worst(tH.n, hT.n) < 1e-6, 'worst ' + worst(tH.n, hT.n));
	ok('3.3 ...and EPANET', worst(tH.e, hT.e) < 1e-6, 'worst ' + worst(tH.e, hT.e));
	ok('3.4 ...and the tank changed the answer', Math.abs(tH.n['22'] - base0.n['22']) > 0.3048);
	L.undo();
	ok('3.5 one undo puts Base back byte for byte', snap() === before0 && L.nodeById('22').type === 'junction');
	const B = L.createScenario('B');
	L.switchScenario(B.id);
	const before = snap();
	q = change('node', '22', 'tank', undefined, true);
	ok('3.6 in B, Change type is refused: no box, nothing changed, 22 still a junction', q.length === 0 && snap() === before && L.nodeById('22').type === 'junction', JSON.stringify(q.map((r) => r.kind)));
	const said = L.lastNotice();
	ok('3.7 ...one sentence says it works in Base and points to Active topology', said === PC.lpn_change_type_base_only && /Base/.test(said) && /Active topology/.test(said) && said.split('. ').length === 2, said);
	q = change('link', '10', 'valve', undefined, true);
	ok('3.8 a link is refused the same way', q.length === 0 && snap() === before && L.linkById('10').type === 'pipe');
	// What a scenario does instead: switch an asset off. B has no pipe 21.
	L.setProp(L.linkById('21'), 'active', false);
	ok('3.9 B switches pipe 21 off in Active topology', !L.isActive(L.linkById('21')) && L.isActive(L.linkById('22')));
	const bH = await bothHeads(L);
	ok('3.10 B solves in both engines', !!bH.n && !!bH.e);
	const handB = editInp([['PIPES', '21']], []);
	const hB = await hand(handB);
	ok('3.11 B equals the hand-built Net1 without pipe 21, built-in solver', worst(bH.n, hB.n) < 1e-6, 'worst ' + worst(bH.n, hB.n));
	ok('3.12 ...and EPANET', worst(bH.e, hB.e) < 1e-6, 'worst ' + worst(bH.e, hB.e));
	base();
	const b3 = await bothHeads(L);
	ok('3.13 Base heads unchanged to 1e-6, built-in solver', worst(base0.n, b3.n) < 1e-6, 'worst ' + worst(base0.n, b3.n));
	ok('3.14 ...and EPANET', worst(base0.e, b3.e) < 1e-6, 'worst ' + worst(base0.e, b3.e));
	ok('3.15 Base\'s export is the export from before any change, character for character', L.exportInp().inp === inpBase0);

	say('\n--- 4. inheritance: C, a child of B ---');
	const C = L.createScenario('C');
	L.setScenarioParent(C.id, B.id);
	L.switchScenario(C.id);
	ok('4.1 C has B\'s topology: pipe 21 inactive', !L.isActive(L.linkById('21')));
	const cH = await bothHeads(L);
	ok('4.2 C\'s heads equal B\'s, built-in solver', worst(cH.n, bH.n) < 1e-9, 'worst ' + worst(cH.n, bH.n));
	ok('4.3 ...and EPANET', worst(cH.e, bH.e) < 1e-9, 'worst ' + worst(cH.e, bH.e));
	ok('4.4 the other scenarios keep pipe 21', [N, D].every((s) => L.liveInScenario(L.linkById('21'), s)));

	say('\n--- 5. export, save and reopen ---');
	L.switchScenario(B.id);
	const inpB = L.exportInp().inp;
	ok('5.1 B\'s export writes junction 21 but no pipe 21', sectionOf(inpB, '21') === 'JUNCTIONS');
	const X = page();
	X.importInp({ name: 'B.inp', _text: inpB });
	const xH = await bothHeads(X);
	ok('5.2 B\'s export, opened again, solves to B\'s heads (1e-6), both engines', worst(xH.n, bH.n) < 1e-6 && worst(xH.e, bH.e) < 1e-6,
		'worst ' + worst(xH.n, bH.n) + ' / ' + worst(xH.e, bH.e));
	const fileL = JSON.stringify(L.serializeProject()), file = JSON.parse(fileL);
	const R = page();
	R.importProject(file);
	ok('5.3 reopened: B is showing, pipe 21 inactive', R.activeScenario().name === 'B' && !R.isActive(R.linkById('21')));
	const rH = await bothHeads(R);
	ok('5.4 ...and B solves to its heads, both engines', worst(rH.n, bH.n) < 1e-9 && worst(rH.e, bH.e) < 1e-9);
	const fileR = JSON.stringify(R.serializeProject());
	let at = 0; while (at < fileR.length && fileR[at] === fileL[at]) { at++; }
	ok('5.5 ...and the reopened file saves to the same bytes', fileR === fileL, fileL.slice(at - 60, at + 60) + ' || ' + fileR.slice(at - 60, at + 60));
	R.switchScenario(R.baseScenario().id);
	ok('5.6 ...and in Base pipe 21 is active', R.isActive(R.linkById('21')));

	say('\n--- 6. undo and redo of the Base change ---');
	base();
	const pre6 = snap();
	change('node', '22', 'tank', undefined, true);
	const after = snap();
	L.undo();
	ok('6.1 one undo puts the document back byte for byte', snap() === pre6 && L.nodeById('22').type === 'junction');
	L.redo();
	ok('6.2 redo brings the change back byte for byte', snap() === after && L.nodeById('22').type === 'tank');
	L.undo();

	say('\n--- 7. a link: pipe 10 -> valve is refused in V, in place in Base ---');
	{
		base();
		const V = L.createScenario('V');
		L.switchScenario(V.id);
		const pre7 = snap();
		q = change('link', '10', 'valve', undefined, true);
		ok('7.1 refused in V: no box, nothing changed', q.length === 0 && snap() === pre7 && L.linkById('10').type === 'pipe');
		base();
		change('link', '10', 'valve', undefined, true);
		const v = L.linkById('10');
		ok('7.2 in Base the same link, ID 10, becomes a TCV valve on 10\'s ends', v.type === 'valve' && v.valveType === 'TCV' && v.from === '10' && v.to === '11' &&
			L.getDoc().links.filter((l) => l.id === '10').length === 1);
		ok('7.3 ...carrying 10\'s diameter, 18 in', L.effective(v, 'diameter') === 18);
		ok('7.4 ...and Base solves', !!nativeHeads(L));
		L.undo();
		ok('7.5 undo restores the pipe and Base heads', L.linkById('10').type === 'pipe' && worst(base0.n, nativeHeads(L)) < 1e-6);
	}

	say('\n--- 8. a file holding a type override opens with it dropped ---');
	{
		const f = JSON.parse(fileL);
		const sb = f.scenarios.filter((s) => s.name === 'B')[0];
		sb.overrides['n:12'] = { type: 'tank', level: 10, maxLevel: 20, minLevel: 0, tankDiameter: 30, demand: 75 };
		const M = page();
		M.importProject(f);
		const ov = (M.getScenarios().filter((s) => s.name === 'B')[0].overrides || {})['n:12'] || {};
		ok('8.1 the type and every value only a tank has are gone; the junction\'s own demand override stays',
			JSON.stringify(ov) === JSON.stringify({ demand: 75 }), JSON.stringify(ov));
		ok('8.2 12 is a junction in B', M.nodeById('12').type === 'junction');
	}

	say('\n--- 10. Perry\'s case: a control and a rule naming what B replaces, and a customer on 22 ---');
	{
		const text = NET1.replace(/\[CONTROLS\]\n/, '[CONTROLS]\n LINK 21 CLOSED IF NODE 2 BELOW 100\n')
			.replace(/\[RULES\]\n/, '[RULES]\nRULE R1\nIF NODE 22 PRESSURE BELOW 1\nTHEN LINK 112 STATUS IS CLOSED\n');
		const P = page();
		P.importInp({ name: 'Net1-perry.inp', _text: text });
		P.getDoc().customers.push({ id: 'M9', demand: 25, count: 1, link: null, node: '22', x: 0, y: 0 });
		P.buildDom();
		const ctlLinks = (m) => ((m.time && m.time.controls) || []).map((c) => String(c.link));
		const ruleCount = (m) => (m.rules || []).length;
		const m0 = P.assembleModel();
		ok('10.1 Base hands the engine the control on 21 and rule R1', ctlLinks(m0).indexOf('21') >= 0 && ruleCount(m0) === 1, JSON.stringify(ctlLinks(m0)) + ' rules ' + ruleCount(m0));
		const r0 = await global.EngCalcs.lpnSolveEpanet(m0);
		ok('10.2 Base runs on EPANET', !!r0 && r0.ok === true, r0 && (r0.error || r0.message));
		const inp0 = P.exportInp().inp;
		ok('10.3 Base\'s export writes both', /LINK 21 CLOSED IF NODE 2 BELOW 100/.test(inp0) && /RULE R1/.test(inp0));
		const PB = P.createScenario('B');
		P.switchScenario(PB.id);
		P.setProp(P.nodeById('22'), 'active', false);
		ok('10.4 B switches junction 22 off in Active topology: the control on 21 and the rule name inactive assets', !P.isActive(P.nodeById('22')) && !P.linkLive(P.linkById('21')));
		const m1 = P.assembleModel();
		ok('10.6 B hands the engine neither the control nor the rule', ctlLinks(m1).indexOf('21') < 0 && ruleCount(m1) === 0, JSON.stringify(ctlLinks(m1)) + ' rules ' + ruleCount(m1));
		const r1 = await global.EngCalcs.lpnSolveEpanet(m1);
		ok('10.7 B runs on EPANET itself (no refusal, so no fallback)', !!r1 && r1.ok === true, r1 && JSON.stringify(r1.issues || r1.error || r1.message));
		// The rule's drop rides on every solve's warnings; a control's on the run's (an EPS input),
		// so it is read where the run reads it, on the model's time block.
		const codes = ((r1 && r1.warnings) || []).concat((m1.time && m1.time.warnings) || []).map((w) => w.code + ':' + (w.ids || []).join(','));
		ok('10.8 ...and its warnings say which were left out, as inactive', codes.indexOf('control-inactive:21') >= 0 && codes.indexOf('rule-inactive:R1') >= 0, JSON.stringify(codes));
		const ex = P.exportInp();
		ok('10.9 B\'s export writes neither line', !/LINK 21 CLOSED/.test(ex.inp) && !/RULE R1/.test(ex.inp));
		const dcodes = ex.differences.map((d) => d.code);
		ok('10.10 ...and says so, and says M9\'s demand is not in the file', dcodes.indexOf('inactive-control') >= 0 && dcodes.indexOf('inactive-rule') >= 0 &&
			dcodes.indexOf('customer-inactive-node') >= 0, JSON.stringify(dcodes));
		P.switchScenario(P.baseScenario().id);
		const m2 = P.assembleModel();
		ok('10.12 back in Base the control and the rule are handed to the engine again', ctlLinks(m2).indexOf('21') >= 0 && ruleCount(m2) === 1, JSON.stringify(ctlLinks(m2)) + ' rules ' + ruleCount(m2));
		ok('10.13 ...and Base\'s export is what it was', P.exportInp().inp === inp0);
		// Last: a page loaded later becomes the clock's host (js/lpn-time.js), so P is done with first.
		const Q = page();
		Q.importInp({ name: 'B-perry.inp', _text: ex.inp });
		const rq = await global.EngCalcs.lpnSolveEpanet(Q.assembleModel());
		ok('10.11 B\'s export, opened again, runs on EPANET', !!rq && rq.ok === true, rq && JSON.stringify(rq.issues || rq.error));
	}

	global.EngCalcs.lpnTimeRun = timeRunWas;
	return fails;
}

// **LIVE MUTATIONS: EACH MUST TURN THIS HARNESS RED** (dev/testing-notes.md).
const MUTATIONS = [
	['Change type is allowed outside Base', (src) => src.replace(
		"if (!inBaseScenario()) { setNotice(", "if (false) { setNotice(")],
	['a link whose end is inactive is drawn active', (src) => src.replace(
		"off = !linkLive(el); ov = hasDisplayedOverride(el);", "off = !isActive(el); ov = hasDisplayedOverride(el);")],
	['the solve keeps a link whose end is inactive', (src) => src.replace(
		"\t\tvar links = doc.links.filter(function (l) {\n\t\t\treturn isActive(l) && live[l.from] && live[l.to];",
		"\t\tvar links = doc.links.filter(function (l) {\n\t\t\treturn isActive(l);")],
	['a type override is still read on open', (src) => src.replace("\t\tdropTypeOverrides();\n", "")],
	['a control naming an inactive asset reaches the engine', (src) => src.replace("\t\tdropInactiveControls(model);\n", "")],
	['a rule naming an inactive asset reaches the engine', (src) => src.replace("\t\t\tif (off) { inactive.push(b.name); return; }", "")]
];

(async function main() {
	await global.EngCalcs.lpnEpanetLoad();
	let fails = await run(null, false);
	console.log('\n--- 9. live mutations: each must turn this harness red ---');
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

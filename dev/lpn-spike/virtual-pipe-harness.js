// A VIRTUAL PIPE CHANGES NO RESULT. Run with:
//   node dev/lpn-spike/virtual-pipe-harness.js
//
// Task 822 (dev/assemblies.md). Tom, 2026-11-06: "I assume that a Virtual pipe + object needs to be early
// in this branch build too." A virtual pipe joins two nodes with zero length, volume, velocity and loss, so
// that an assembly's two coincident nodes (and later a converted pump or valve) can be joined without
// altering a single answer. Asserted here:
//   1. the invariance itself, on a small looped network, in BOTH solvers: inserting a virtual pipe moves no
//      head by more than 1e-3 m and no flow by more than 1e-5 m3/s, and the virtual pipe itself reports
//      zero velocity and zero head loss; its STORED diameter, roughness and length change nothing;
//   2. the page's model hands the solvers length 0 and no minor loss for it, and EPANET's text carries the
//      stand-in row a curveless pump already uses (0.01 m of 1000 mm), never a length of 0;
//   3. the .inp round trip: a file without a virtual pipe gets no marker line and exports as before; a file
//      with one writes the stand-in row and a `;VIRTUAL:` line, reads back virtual, and a second export is
//      byte-identical to the first;
//   4. the project file: save and open keeps it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, serializeProject: serializeProject,\n" +
	"\t\tmigrateSaved: migrateSaved,\n" +
	"\t\tcurrentModel: function () { return assembleModel(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
L.buildLayers();
setUnitSet('si');
const EC = global.EngCalcs;

const HEAD_TOL = 1e-3, FLOW_TOL = 1e-5;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

// A looped network in SI (LPS, metres, millimetres). `variant` 0: R1 feeds J1 by P1. 1: R1 feeds JA by P1
// and a virtual pipe V1 joins JA to J1 (the two sit at one point). 2: the same, but V1's own row states
// a long, narrow, rough pipe, which the `;VIRTUAL:` line must make irrelevant.
function inp(variant) {
	const feed = variant === 0 ? ' P1  R1  J1  500  250  130  0  Open' : ' P1  R1  JA  500  250  130  0  Open\n V1  JA  J1  ' +
		(variant === 2 ? '900  50  60' : '0.01  1000  150') + '  0  Open';
	return [
		'[TITLE]', 'virtual pipe invariance', '',
		'[JUNCTIONS]', ' J1  10', ' J2  12', ' J3  8', variant ? ' JA  10' : '', '',
		'[RESERVOIRS]', ' R1  70', '',
		'[PIPES]', feed,
		' P2  J1  J2  400  150  130  0  Open',
		' P3  J1  J3  300  150  130  0  Open',
		' P4  J2  J3  350  100  130  0  Open', '',
		'[DEMANDS]', ' J2  9', ' J3  6', '',
		'[COORDINATES]', ' R1 0 0', ' J1 100 0', ' J2 200 50', ' J3 200 -50', variant ? ' JA 100 0' : '', '',
		variant ? ';VIRTUAL: V1' : '', '',
		'[OPTIONS]', ' Units  LPS', ' Headloss  H-W', '', '[END]', ''].join('\n');
}
function open(text) {
	const parsed = EC.lpnInpParse(text);
	if (!parsed.ok) { throw new Error('the file does not parse: ' + parsed.error); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const d = L.docFromInp(parsed, 'v');
	L.applySaved(L.migrateSaved(d));
	L.buildDom();
	return { parsed, doc: L.getDoc(), model: L.currentModel() };
}
function worst(a, b, ids, field) {
	let w = 0, at = '';
	ids.forEach((id) => { const d = Math.abs(a[field][id] - b[field][id]); if (d > w) { w = d; at = id; } });
	return { w, at };
}

(async function () {
	console.log('-- 1. nothing moves');
	const base = open(inp(0)), inA = open(inp(1)), inB = open(inp(2));
	ok('the file marks V1 virtual on import', inA.parsed.links.find((l) => l.id === 'V1').virtual === true);
	ok('and no other pipe', inA.parsed.links.filter((l) => l.virtual).length === 1);
	const mV = inA.model.links.find((l) => l.id === 'V1'), mV2 = inB.model.links.find((l) => l.id === 'V1');
	ok('the page\'s model gives the solvers length 0 and no minor loss', mV.length === 0 && mV.k === 0 && mV.virtual === true, JSON.stringify(mV));
	ok('whatever the row stated (900 m, 50 mm)', mV2.length === 0 && mV2.k === 0, JSON.stringify(mV2));
	const ids = ['J1', 'J2', 'J3'], lids = ['P1', 'P2', 'P3', 'P4'];
	const natBase = EC.lpnSolve(base.model), natA = EC.lpnSolve(inA.model), natB = EC.lpnSolve(inB.model);
	ok('the built-in solver converges on all three', natBase.ok && natA.ok && natB.ok && natA.converged && natB.converged);
	[['inserted', natA], ['inserted, row says 900 m x 50 mm', natB]].forEach(([nm, r]) => {
		const h = worst(natBase, r, ids, 'heads'), q = worst(natBase, r, lids, 'flows');
		ok('built-in: ' + nm + ': heads agree', h.w <= HEAD_TOL, h.w.toExponential(2) + ' m @' + h.at);
		ok('built-in: ' + nm + ': flows agree', q.w <= FLOW_TOL, q.w.toExponential(2) + ' m3/s @' + q.at);
	});
	ok('built-in: JA stands at J1\'s head', Math.abs(natA.heads.JA - natA.heads.J1) <= HEAD_TOL, (natA.heads.JA - natA.heads.J1).toExponential(2));
	ok('built-in: V1 carries all the demand (15 L/s)', Math.abs(natA.flows.V1 - 0.015) <= FLOW_TOL, natA.flows.V1);
	ok('built-in: V1 reports velocity 0 and head loss 0', natA.velocities.V1 === 0 && natA.headlosses.V1 === 0);
	ok('built-in: V1 reports the flow, though', Math.abs(natA.flows.V1) > 0.01);

	const eBase = await EC.lpnSolveEpanet(base.model, { moduleUrl: NODE_ENGINE_URL });
	const eA = await EC.lpnSolveEpanet(inA.model, { moduleUrl: NODE_ENGINE_URL });
	const eB = await EC.lpnSolveEpanet(inB.model, { moduleUrl: NODE_ENGINE_URL });
	ok('EPANET converges on all three', eBase.ok && eA.ok && eB.ok && eA.converged && eB.converged, JSON.stringify(eA.engineError || eA.issues || ''));
	[['inserted', eA], ['inserted, row says 900 m x 50 mm', eB]].forEach(([nm, r]) => {
		const h = worst(eBase, r, ids, 'heads'), q = worst(eBase, r, lids, 'flows');
		ok('EPANET: ' + nm + ': heads agree', h.w <= HEAD_TOL, h.w.toExponential(2) + ' m @' + h.at);
		ok('EPANET: ' + nm + ': flows agree', q.w <= FLOW_TOL, q.w.toExponential(2) + ' m3/s @' + q.at);
	});
	ok('EPANET: V1 reports velocity 0 and head loss 0', eA.velocities.V1 === 0 && eA.headlosses.V1 === 0);
	const hh = worst(natA, eA, ids.concat(['JA']), 'heads');
	ok('the two engines agree with each other on the virtual network', hh.w <= HEAD_TOL, hh.w.toExponential(2) + ' m @' + hh.at);

	console.log('-- 2. what EPANET is handed');
	const text = EC.lpnToInp(inA.model).inp;
	const row = text.split('\n').find((l) => /^\s*V1\s/.test(l)) || '';
	ok('V1 is the stand-in pipe row, 0.01 m as wide as the widest ordinary pipe (250 mm) at C 150', /^\s*V1\s+JA\s+J1\s+0\.01\s+250\s+150\s+0\s+Open\s*$/.test(row), JSON.stringify(row));
	ok('no pipe of length 0 goes to EPANET', !/\s0\s+\d+\s+\d+\s+0\s+Open/.test(text));

	console.log('-- 3. the .inp round trip');
	open(inp(0));
	const plainOut = EC.lpnExportInp(L.serializeProject(), {});
	ok('a network with no virtual pipe writes no marker line', plainOut.ok && !/;VIRTUAL|;ASSEMBLY/i.test(plainOut.inp));
	const o1 = open(inp(1));
	const out1 = EC.lpnExportInp(L.serializeProject(), {});
	ok('export succeeds', out1.ok, JSON.stringify(out1.error));
	ok('it names the virtual pipe on one ;VIRTUAL: line', /^;VIRTUAL: V1$/m.test(out1.inp));
	const exRow = out1.inp.split('\n').find((l) => /^V1\s/.test(l.trim()) || /^\s*V1\s/.test(l)) || '';
	ok('and writes V1 as the stand-in row (the widest ordinary pipe, 250 mm)', /^V1\s+JA\s+J1\s+0\.01\s+250\s+150\s+0\s+Open/.test(exRow.trim()), JSON.stringify(exRow));
	const back = EC.lpnInpParse(out1.inp);
	ok('EPANET\'s own reader would see a plain pipe: the line is a comment', !/^\[VIRTUAL\]/m.test(out1.inp));
	ok('read back, V1 is virtual', back.ok && back.links.find((l) => l.id === 'V1').virtual === true);
	ok('and nothing else is', back.links.filter((l) => l.virtual).length === 1);
	open(out1.inp);
	const out2 = EC.lpnExportInp(L.serializeProject(), {});
	ok('a second export is byte-identical to the first', out2.inp === out1.inp);

	console.log('-- 4. the project file');
	open(inp(1));
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the saved project says V1 is virtual', saved.links.find((l) => l.id === 'V1').virtual === true);
	L.applySaved(L.migrateSaved(saved));
	L.buildDom();
	ok('opened again, it still is', L.getDoc().links.find((l) => l.id === 'V1').virtual === true);
	const again = L.currentModel().links.find((l) => l.id === 'V1');
	ok('and the model still gives it length 0', again.length === 0 && again.virtual === true);


	console.log('-- 5. a user-drawn pipe of Length 0 reports velocity 0 (Tom, 2026-11-09: "I say zero")');
	const plain0 = open(inp(0).replace(' P2  J1  J2  400  150', ' P2  J1  J2  0  150'));
	const m0 = plain0.model.links.find((l) => l.id === 'P2');
	ok('P2, a plain pipe of length 0, is a virtual pipe in the model: length 0, no minor loss', m0.length === 0 && m0.k === 0 && m0.virtual === true, JSON.stringify(m0));
	const n0 = EC.lpnSolve(plain0.model);
	ok('built-in: it converges, carries flow, and reports velocity 0 and head loss 0', n0.ok && n0.converged && Math.abs(n0.flows.P2) > 1e-4 && n0.velocities.P2 === 0 && n0.headlosses.P2 === 0, 'Q=' + n0.flows.P2 + ' V=' + n0.velocities.P2);
	ok('built-in: the pipe beside it still reports its own velocity', n0.velocities.P3 > 0, String(n0.velocities.P3));
	const e0 = await EC.lpnSolveEpanet(plain0.model, { moduleUrl: NODE_ENGINE_URL });
	ok('EPANET solves it too (no Error 200), reporting velocity 0', e0.ok === true && e0.converged && e0.velocities.P2 === 0 && e0.headlosses.P2 === 0, String(e0.engineError));
	const h0 = worst(n0, e0, ids, 'heads');
	ok('and the two engines agree on it', h0.w <= HEAD_TOL, h0.w.toExponential(2));
	const t0 = EC.lpnToInp(plain0.model).inp;
	ok('EPANET\'s text carries P2 as 0.01 m of 250 mm, the widest ordinary pipe', /^\s*P2\s+J1\s+J2\s+0\.01\s+250\s+150\s+0\s+Open/m.test(t0), JSON.stringify(t0.split('\n').find((l) => /^\s*P2\s/.test(l))));
	const x0 = EC.lpnExportInp(L.serializeProject(), {});
	ok('export writes the same stand-in row and a ;VIRTUAL: line naming P2', x0.ok && /^;VIRTUAL: P2$/m.test(x0.inp) && /^P2\s+J1\s+J2\s+0\.01\s+250\s+150/m.test(x0.inp.split('\n').map((l) => l.trim()).join('\n')), JSON.stringify(x0.error));
	open(x0.inp);
	ok('reopened, P2 is virtual again, with length 0 in the model', L.getDoc().links.find((l) => l.id === 'P2').virtual === true && L.currentModel().links.find((l) => l.id === 'P2').length === 0);
	ok('a second export is byte-identical', EC.lpnExportInp(L.serializeProject(), {}).inp === x0.inp);

	console.log('-- 6. the stand-in width is the project maximum');
	const wide = open(inp(1).replace(' P4  J2  J3  350  100', ' P4  J2  J3  350  400'));
	const eW = EC.lpnToInp(wide.model).inp;
	ok('EPANET\'s text: V1 takes 400 mm when the widest ordinary pipe is 400 mm', /^\s*V1\s+JA\s+J1\s+0\.01\s+400\s+/m.test(eW), JSON.stringify(eW.split('\n').find((l) => /^\s*V1\s/.test(l))));
	const wideOut = EC.lpnExportInp(L.serializeProject(), {});
	ok('export: V1 takes 400 mm, with the file\'s own characters', wideOut.ok && /^V1\s+JA\s+J1\s+0\.01\s+400\s+/m.test(wideOut.inp.split('\n').map((l) => l.trim()).join('\n')), JSON.stringify(wideOut.error));
	const eWr = await EC.lpnSolveEpanet(wide.model, { moduleUrl: NODE_ENGINE_URL });
	ok('EPANET still converges with the wider stand-in', eWr.ok && eWr.converged && eWr.velocities.V1 === 0);
	const lone = open(['[TITLE]', 'lone', '', '[JUNCTIONS]', ' J1  10', '', '[RESERVOIRS]', ' R1  70', '', '[PIPES]', ' V1  R1  J1  0  250  130  0  Open', '',
		'[DEMANDS]', ' J1  5', '', '[COORDINATES]', ' R1 0 0', ' J1 100 0', '', '[OPTIONS]', ' Units  LPS', ' Headloss  H-W', '', '[END]', ''].join('\n'));
	const eL = EC.lpnToInp(lone.model).inp;
	ok('a project with no other pipe falls back to 1000 mm', /^\s*V1\s+R1\s+J1\s+0\.01\s+1000\s+/m.test(eL), JSON.stringify(eL.split('\n').filter((l) => /V1|PIPES/.test(l))));
	open(inp(1));
	const v0 = EC.lpnSolve(inA.model);
	ok('the marked virtual pipe: velocity 0, flow untouched (15 L/s)', v0.velocities.V1 === 0 && Math.abs(v0.flows.V1 - 0.015) <= FLOW_TOL);

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

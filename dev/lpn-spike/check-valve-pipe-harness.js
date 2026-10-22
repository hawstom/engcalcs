// A CHECK-VALVE PIPE IS KEPT, WRITTEN BACK, AND SOLVED BY BOTH ENGINES. Run with:
//   node dev/lpn-spike/check-valve-pipe-harness.js
//
// A [PIPES] row whose status is CV is a pipe that passes flow only from its start node to its end
// node. It used to be imported as an OPEN pipe and reported, so the export wrote Open and the
// one-way rule was gone (found building a comparison model for WaterGEMS; the file is
// fixtures/epp-compare-1.inp, P-2 is the CV). Asserted here:
//   1. import keeps it (status 'cv'), with no report line about it;
//   2. export writes every [PIPES] token back character for character, the CV included;
//   3. the built-in solver and EPANET 2.3.5 agree on heads (0.8 mm) and flows, and on the CV's
//      state: shut with zero flow where flow would reverse, open where it runs forward -- on
//      constructed lines, on EPA's Net1 with a pipe made a CV both ways round, and on the file;
//   4. the extended-period loop (js/lpn-native-run.js) agrees with EPANET at every step of the file.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tcurrentModel: function () { return assembleModel(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;

const HEAD_TOL = 0.8e-3, FLOW_TOL = 2e-6, FLOW_REL = 1e-5, H = 3600;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

const FILE = path.join(__dirname, 'fixtures', 'epp-compare-1.inp');
const TEXT = fs.readFileSync(FILE, 'utf8');

function pipeRows(text) {
	const out = {}; let on = false;
	text.split(/\r?\n/).forEach((raw) => {
		const line = raw.replace(/;.*$/, '').trim();
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { on = m[1].toUpperCase() === 'PIPES'; return; }
		if (on && line) { const t = line.split(/\s+/); out[t[0]] = t; }
	});
	return out;
}

// ---- small models straight to the solvers -------------------------------------------------------
const LPS = 0.001;
function pipe(id, from, to, length, diameter, extra) {
	return Object.assign({ id, type: 'pipe', from, to, length, diameter, roughness: 130, k: 0, status: 'open' }, extra || {});
}
function jn(id, elev, demandLps) { return { id, type: 'junction', elev, demand: (demandLps || 0) * LPS }; }
function res(id, head) { return { id, type: 'reservoir', elev: head, head }; }
// R1 -> P1 -> J1 -> CV -> J2 -> P3 -> R2, a demand on each junction.
function line(r2) {
	return { method: 'hw', nodes: [res('R1', 100), jn('J1', 0, 10), jn('J2', 0, 10), res('R2', r2)],
		links: [pipe('P1', 'R1', 'J1', 800, 0.25), pipe('CV', 'J1', 'J2', 500, 0.2, { status: 'cv' }),
			pipe('P3', 'J2', 'R2', 600, 0.25)] };
}

async function compare(name, model, want) {
	const nat = EC.lpnSolve(model);
	const hyd = Object.assign({}, model.hydraulics || {}, { accuracy: 1e-5 });
	const epa = await EC.lpnSolveEpanet(Object.assign({}, model, { hydraulics: hyd }), { moduleUrl: NODE_ENGINE_URL });
	if (!nat.ok || !epa.ok) {
		ok(name, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || epa.engineError || ''));
		return;
	}
	let dH = 0, atH = '', dQ = 0, atQ = '', qMax = 0;
	model.nodes.forEach((n) => {
		const d = Math.abs(nat.heads[n.id] - epa.heads[n.id]);
		if (d > dH) { dH = d; atH = n.id; }
	});
	model.links.forEach((l) => {
		qMax = Math.max(qMax, Math.abs(epa.flows[l.id]));
		const d = Math.abs(nat.flows[l.id] - epa.flows[l.id]);
		if (d > dQ) { dQ = d; atQ = l.id; }
	});
	const qTol = Math.max(FLOW_TOL, FLOW_REL * qMax);
	const states = Object.keys(want).map((id) => `${id} native=${(nat.statuses || {})[id]} epanet=${(epa.statuses || {})[id]} ` +
		`Q=${nat.flows[id].toExponential(2)}/${epa.flows[id].toExponential(2)}`);
	const stateOk = Object.keys(want).every((id) => (nat.statuses || {})[id] === want[id] && (epa.statuses || {})[id] === want[id] &&
		(want[id] === 'open' || (nat.flows[id] === 0 && Math.abs(epa.flows[id]) < 1e-9)));
	ok(name, dH <= HEAD_TOL && dQ <= qTol && stateOk && nat.converged && epa.converged,
		`dH=${dH.toExponential(2)} m @${atH}  dQ=${dQ.toExponential(2)} m3/s @${atQ}  [${states.join('; ')}]` +
		(nat.converged ? '' : ' NATIVE-UNCONVERGED') + (epa.converged ? '' : ' EPANET-UNCONVERGED'));
}

function net1WithCv(id, reverse) {
	const parsed = EC.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', 'Net1.inp'), 'utf8'));
	const S = parsed.scale;
	const nodes = parsed.nodes.map((n) => {
		if (n.type === 'tank') {
			return { id: n.id, type: 'tank', elev: n.elev * S.head, head: n.head * S.head, level: n.level * S.head,
				minLevel: n.minLevel * S.head, maxLevel: n.maxLevel * S.head, diameter: n.diameter * S.head };
		}
		if (n.type === 'reservoir') { return { id: n.id, type: 'reservoir', elev: n.elev * S.head, head: n.head * S.head }; }
		return { id: n.id, type: 'junction', elev: n.elev * S.head, demand: (n.demand || 0) * S.flow };
	});
	const links = parsed.links.map((l) => {
		const out = { id: l.id, type: l.type, from: l.from, to: l.to, diameter: l.diameter * S.dia,
			roughness: l.roughness, length: (l.length || 0) * S.len, status: l.status, k: l.k || 0 };
		if (l.type === 'pump') { const f = EC.lpnPumpFromCurve([[1500 * S.flow, 250 * S.head]]); out.h0 = f.h0; out.a = f.a; out.b = f.b; }
		return out;
	});
	const m = { nodes, links, method: 'hw', visc: 1.007e-6 };
	const base = EC.lpnSolve(m);
	const l = links.find((x) => x.id === id);
	if ((base.flows[id] >= 0) === !!reverse) { const t = l.from; l.from = l.to; l.to = t; }
	l.status = 'cv';
	return m;
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	await warmEpanet();

	console.log('-- 1. import keeps the check valve');
	const parsed = EC.lpnInpParse(TEXT);
	ok('the file parses', parsed.ok, parsed.error);
	const p2 = parsed.links.find((l) => l.id === 'P-2');
	ok('P-2 is read as a check valve (status cv)', p2 && p2.status === 'cv', p2 && p2.status);
	ok('no other pipe is', parsed.links.filter((l) => l.status === 'cv').length === 1);
	ok('the import reports nothing about it', !(parsed.dropped || []).some((d) => d.code === 'check-valve'),
		JSON.stringify((parsed.dropped || []).map((d) => d.code)));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'epp-compare-1');
	const dp2 = doc.links.find((l) => l.id === 'P-2');
	ok('the document holds it as cv', dp2 && dp2._status === 'cv', dp2 && dp2._status);

	console.log('-- 2. export writes it back character for character');
	const out = EC.lpnExportInp(doc);
	ok('the document exports', out.ok, JSON.stringify(out.error));
	const src = pipeRows(TEXT), got = pipeRows(out.inp || '');
	let n = 0, same = 0; const diffs = [];
	Object.keys(src).forEach((id) => {
		src[id].forEach((t, i) => { n++; if (got[id] && got[id][i] === t) { same++; } else { diffs.push(id + '[' + i + '] ' + t + ' -> ' + (got[id] || [])[i]); } });
	});
	ok(`every [PIPES] token is byte-identical (${same}/${n})`, n > 0 && same === n, diffs.slice(0, 4).join(', '));
	ok('P-2 goes out as CV', got['P-2'] && got['P-2'][7] === 'CV', got['P-2'] && got['P-2'].join(' '));
	const again = EC.lpnInpParse(out.inp || '');
	ok('and reads back in as a check valve', again.ok && again.links.find((l) => l.id === 'P-2').status === 'cv');

	console.log('-- 3. both engines, one instant');
	await compare('line, flow would reverse: the CV shuts', line(140), { CV: 'closed' });
	await compare('line, flow runs forward: the CV stays open', line(60), { CV: 'open' });
	await compare('Net1, pipe 110 a CV with its flow: open', net1WithCv('110', false), { 110: 'open' });
	await compare('Net1, pipe 110 a CV against its flow: shut', net1WithCv('110', true), { 110: 'closed' });
	await compare('Net1, pipe 21 (a loop) a CV against its flow: shut', net1WithCv('21', true), { 21: 'closed' });
	L.applySaved(doc);
	L.buildDom();
	const model = L.currentModel();
	ok('the page\'s model hands the solvers status cv', model.links.find((l) => l.id === 'P-2').status === 'cv');
	await compare('epp-compare-1 at 0:00, P-2 forward', model, { 'P-2': 'open' });
	const off = JSON.parse(JSON.stringify(model));
	off.links.find((l) => l.id === 'PMP-1').status = 'closed';
	// With the pump off and a bypass round it, J-2 stands near the reservoir's head while the tank
	// holds J-3 far above it, so P-2 would carry water back toward the reservoir.
	off.links.push(pipe('BY', 'J-1', 'J-2', 30, 0.3));
	await compare('epp-compare-1, pump off: P-2 would run backwards, shuts', off, { 'P-2': 'closed' });

	console.log('-- 4. the extended-period loop');
	EC.lpnTimeArrived();
	const eps = L.currentModel();
	eps.hydraulics = Object.assign({}, eps.hydraulics || {}, { accuracy: 1e-5 });
	// Pump energy is bookkeeping that changes no head or flow, and the loop does not own it yet.
	delete eps.energy;
	const refused = EC.lpnNativeRunRefusals(eps);
	ok('the built-in loop takes the file', refused.length === 0, JSON.stringify(refused));
	await epsCompare('epp-compare-1, 24 h: every step agrees', eps, 0);
	// The pump stopped from 6:00 to 12:00 by time controls, with a check-valve bypass round it (J-1
	// to J-2): while it runs the bypass is shut by the pump's own lift, and while it is stopped the
	// bypass opens and P-2 shuts against the tank. Two CVs changing state through the day.
	const byp = JSON.parse(JSON.stringify(eps));
	byp.links.push(pipe('BY', 'J-1', 'J-2', 30, 0.3, { status: 'cv' }));
	// A small draw at J-2 (a service between pump and check valve), so that with the pump just
	// stopped and both CVs shut J-2 cannot float at a head neither engine is bound to agree on.
	const j2 = byp.nodes.find((x) => x.id === 'J-2');
	j2.demand = 1 * LPS; j2.demandBase = 1 * LPS; j2.demandPattern = null;
	byp.time.controls = [
		Object.assign({}, eps.time.controls[0], { link: 'PMP-1', condition: { kind: 'time', seconds: 6 * H }, action: { status: 'closed' } }),
		Object.assign({}, eps.time.controls[0], { link: 'PMP-1', condition: { kind: 'time', seconds: 12 * H }, action: { status: 'open' } })
	];
	ok('the bypass model is taken by the built-in loop', EC.lpnNativeRunRefusals(byp).length === 0, JSON.stringify(EC.lpnNativeRunRefusals(byp)));
	await epsCompare('pump stopped 6:00-12:00 with a CV bypass: every step agrees', byp, 1);

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

async function epsCompare(name, eps, mustShut) {
	const epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(eps)));
	const nat = EC.lpnNativeRun(eps);
	if (!epa.ok || !nat.ok) {
		ok(name, false, `native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || epa.error || ''));
	} else {
		let dH = 0, atH = '', dQ = 0, atQ = '', qMax = 0, st = 0, cvShut = 0;
		const sameT = epa.frames.length === nat.frames.length && epa.frames.every((f, i) => f.t === nat.frames[i].t);
		if (sameT) {
			epa.frames.forEach((fe, i) => {
				const fn = nat.frames[i];
				eps.nodes.forEach((x) => { const d = Math.abs(fn.heads[x.id] - fe.heads[x.id]); if (d > dH) { dH = d; atH = x.id + '@' + fe.t / H + 'h'; } });
				eps.links.forEach((l) => {
					qMax = Math.max(qMax, Math.abs(fe.flows[l.id]));
					const d = Math.abs(fn.flows[l.id] - fe.flows[l.id]);
					if (d > dQ) { dQ = d; atQ = l.id + '@' + fe.t / H + 'h'; }
					if (fn.statuses[l.id] !== fe.statuses[l.id]) { st++; }
				});
				if (fe.statuses['P-2'] === 'closed') { cvShut++; }
			});
		}
		const qTol = Math.max(FLOW_TOL, FLOW_REL * qMax);
		ok(name, sameT && dH <= HEAD_TOL && dQ <= qTol && st === 0 && (!mustShut || cvShut > 0),
			`steps ${nat.frames.length}/${epa.frames.length}  dH=${dH.toExponential(2)} m @${atH}  dQ=${dQ.toExponential(2)} m3/s @${atQ}` +
			`  status differences ${st}; P-2 shut in ${cvShut} of EPANET's steps`);
	}
}

// PBV AND GPV IN THE BUILT-IN SOLVER, HELD TO EPANET'S OWN ANSWER (Task 733, phase 2).
//
//   node dev/lpn-spike/native-pbv-gpv-harness.js
//
// The phase-1 recipe (native-valve-harness.js), for the two valve types left: every case is solved
// twice, by EngCalcs.lpnSolve (js/lpn-solver.js, the built-in solver) and by EngCalcs.lpnSolveEpanet
// (the vendored EPANET 2.3.5 engine, reading the .inp js/lpn-epanet.js writes from the SAME model).
// Every node head and every link flow must agree, and the built-in solver must leave each valve
// under the law the case was built to reach ('active' = a PBV holding its drop, 'open' = a PBV whose
// own minor loss already exceeds its setting, or any GPV), so a case that quietly stopped exercising
// what it names fails rather than passing on a different question.
//
// WHAT IS EXERCISED. A PBV: active with the water running forwards and BACKWARDS (EPANET's drop is
// unsigned, so a reversed PBV still holds its start node above its end node), open by its own
// minor loss, a zero setting, closed by the user, in a loop, beside a PRV whose flow comes from the
// node balance, and under Darcy-Weisbach. A GPV: a four-point curve read on its middle segment,
// below its first point and above its last, backwards, with a flat segment (EPANET's TINY slope
// floor), closed by the user, and with a PBV and a PRV in one network. Then EPA's Net1 and Net3 with
// pipes turned into PBVs and GPVs, settings chosen from a first solve.
//
// TOLERANCES are native-valve-harness.js's, for the same reason: EPANET keeps heads in single
// precision and reports through a float API, so about 1e-4 m of head is the floor however hard it
// is pushed. 2 mm of head and 0.002 L/s of flow, or 1e-5 of the largest flow in a big network. A
// wrong sign, a wrong segment or a wrong law is out by metres, not millimetres -- section 4 shows
// that each of those mistakes, made on purpose, does fail. Both engines run at Accuracy 1e-5.

'use strict';

const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));

const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
const HEAD_TOL = 2e-3;      // m
const FLOW_TOL = 2e-6;      // m3/s
const FLOW_REL = 1e-5;      // of the largest flow, for the big networks
const DW_HEAD_TOL = 5e-3;   // m -- validate_epanet.js's two-loop-darcy-weisbach measures 1.1e-3 m
const LPS = 0.001;

let pass = 0, fail = 0;
const worst = {};
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

function pipe(id, from, to, length, diameter, c) {
	return { id, type: 'pipe', from, to, length, diameter, roughness: c || 130, k: 0, status: 'open' };
}
function valve(id, from, to, vt, setting, diameter, extra) {
	return Object.assign({ id, type: 'valve', valveType: vt, from, to, length: 0,
		diameter: diameter || 0.2, roughness: 150, setting, k: 0, status: 'open' }, extra || {});
}
function jn(id, elev, demandLps) { return { id, type: 'junction', elev, demand: (demandLps || 0) * LPS }; }
function res(id, head) { return { id, type: 'reservoir', elev: head, head }; }
// A head-loss curve in L/s and metres, carried in the model's m3/s and metres.
function curve(pts) { return pts.map((p) => [p[0] * LPS, p[1]]); }

// Four points, rising faster at higher flow: 10 L/s -> 2 m, 25 -> 6, 40 -> 14, 60 -> 30.
const GPV4 = curve([[10, 2], [25, 6], [40, 14], [60, 30]]);
// A flat middle segment (6 m from 20 to 40 L/s), where EPANET floors the slope at TINY.
const GPVFLAT = curve([[5, 1], [20, 6], [40, 6], [60, 12]]);

// ---- the constructed cases ---------------------------------------------------------------------
// R (100 m) -> P1 -> J1 (elev 0) -> V -> J2 (elev 10) -> P2 -> J3 (elev 10, demand)
function line(vt, setting, extra, tail, demandLps) {
	return {
		method: 'hw',
		nodes: [res('R', 100), jn('J1', 0), jn('J2', 10), jn('J3', 10, demandLps === undefined ? 30 : demandLps)]
			.concat(tail ? tail.nodes : []),
		links: [pipe('P1', 'R', 'J1', 800, 0.25), valve('V', 'J1', 'J2', vt, setting, 0.2, extra),
			pipe('P2', 'J2', 'J3', 600, 0.2)].concat(tail ? tail.links : [])
	};
}
// A second, higher source on the far side, so flow wants to run backwards through the valve.
const backfeed = { nodes: [res('R2', 140)], links: [pipe('P3', 'R2', 'J3', 300, 0.3)] };
const gpv = (pts, extra) => Object.assign({ curvePoints: pts }, extra || {});

const CASES = [
	{ name: 'PBV active, 10 m', model: line('PBV', 10), want: { V: 'active' }, drop: { V: 10 } },
	{ name: 'PBV active, 35 m', model: line('PBV', 35), want: { V: 'active' }, drop: { V: 35 } },
	{ name: 'PBV active, with a minor loss below its setting', model: line('PBV', 10, { k: 2 }),
		want: { V: 'active' }, drop: { V: 10 } },
	// k = 10 rather than more: EPANET's minor loss uses g rounded to 32.2 ft/s2 (its 0.02517), so a
	// big k alone moves the answer by a millimetre or two, PBV or no PBV.
	{ name: 'PBV open (its own minor loss exceeds the setting)', model: line('PBV', 0.2, { k: 10 }),
		want: { V: 'open' } },
	{ name: 'PBV with a zero setting (an open valve)', model: line('PBV', 0, { k: 3 }), want: { V: 'open' } },
	{ name: 'PBV active with the water running backwards', model: line('PBV', 8, null, backfeed),
		want: { V: 'active' }, drop: { V: 8 }, reverse: 'V' },
	{ name: 'PBV closed by the user', model: line('PBV', 10, { status: 'closed' }, backfeed),
		want: { V: 'closed' } },
	{
		// Darcy-Weisbach is held to the looser bound validate_epanet.js measures for it on a valve-free
		// network, so this case shows only that the PBV's law is the same under the other friction law.
		name: 'PBV active, Darcy-Weisbach',
		model: (function () {
			const m = Object.assign(line('PBV', 12), { method: 'dw', visc: 1.007e-6 });
			m.links.forEach((l) => { if (l.type === 'pipe') { l.roughness = 0.15e-3; } });
			return m;
		}()),
		dw: true,
		want: { V: 'active' }
	},
	{ name: 'GPV on its middle segment', model: line('GPV', 0, gpv(GPV4)), want: { V: 'open' } },
	{ name: 'GPV below its first point', model: line('GPV', 0, gpv(GPV4), null, 4), want: { V: 'open' } },
	{ name: 'GPV above its last point', model: line('GPV', 0, gpv(GPV4), null, 75), want: { V: 'open' } },
	{ name: 'GPV with the water running backwards', model: line('GPV', 0, gpv(GPV4), backfeed),
		want: { V: 'open' }, reverse: 'V' },
	{ name: 'GPV on a flat segment (slope floored at TINY)', model: line('GPV', 0, gpv(GPVFLAT)),
		want: { V: 'open' } },
	{ name: 'GPV closed by the user', model: line('GPV', 0, gpv(GPV4, { status: 'closed' }), backfeed),
		want: { V: 'closed' } },
	{
		// A loop around the PBV: the drop and the loop flow have to settle together.
		name: 'PBV in a loop',
		model: {
			method: 'hw',
			nodes: [res('R', 120), jn('A', 0), jn('B', 20, 10), jn('C', 20, 25), jn('D', 15, 15)],
			links: [pipe('P1', 'R', 'A', 500, 0.3), valve('V', 'A', 'B', 'PBV', 15, 0.2),
				pipe('P2', 'B', 'C', 400, 0.2), pipe('P3', 'C', 'D', 400, 0.15),
				pipe('P4', 'A', 'D', 2500, 0.1), pipe('P5', 'B', 'D', 500, 0.15)]
		},
		want: { V: 'active' }, drop: { V: 15 }
	},
	{
		name: 'GPV in a loop',
		model: {
			method: 'hw',
			nodes: [res('R', 120), jn('A', 0), jn('B', 20, 10), jn('C', 20, 25), jn('D', 15, 15)],
			links: [pipe('P1', 'R', 'A', 500, 0.3), valve('V', 'A', 'B', 'GPV', 0, 0.2, gpv(GPV4)),
				pipe('P2', 'B', 'C', 400, 0.2), pipe('P3', 'C', 'D', 400, 0.15),
				pipe('P4', 'A', 'D', 2500, 0.1), pipe('P5', 'B', 'D', 500, 0.15)]
		},
		want: { V: 'open' }
	},
	{
		// A PBV and a GPV UPSTREAM of a PRV: the PRV takes its flow from what the rest of the network
		// leaves at its node (EPANET's Xflow), so the PBV's and GPV's flows have to be in that balance
		// before the PRV is assembled -- hydcoeffs.c puts them in linkcoeffs(), ahead of valvecoeffs().
		name: 'PBV, GPV and PRV together',
		model: {
			method: 'hw',
			nodes: [res('R', 150), jn('A', 0), jn('B', 0, 5), jn('C', 10, 20), jn('D', 10), jn('E', 5, 10),
				jn('F', 5), jn('G', 0, 15)],
			links: [
				pipe('P1', 'R', 'A', 600, 0.3),
				valve('VPBV', 'A', 'B', 'PBV', 20, 0.25),
				pipe('P2', 'B', 'C', 500, 0.25),
				valve('VGPV', 'C', 'D', 'GPV', 0, 0.2, gpv(GPV4)),
				pipe('P3', 'D', 'E', 400, 0.2),
				pipe('P4', 'B', 'E', 900, 0.15),
				valve('VPRV', 'E', 'F', 'PRV', 30, 0.2),
				pipe('P5', 'F', 'G', 300, 0.2)
			]
		},
		want: { VPBV: 'active', VGPV: 'open', VPRV: 'active' }, drop: { VPBV: 20 }
	},
	{
		name: 'pump upstream of a PBV',
		model: {
			method: 'hw',
			nodes: [res('R', 10), jn('A', 0), jn('B', 0), jn('C', 15), jn('D', 15, 40)],
			links: [pipe('P1', 'R', 'A', 50, 0.3),
				{ id: 'PU', type: 'pump', from: 'A', to: 'B', h0: 90, a: 90 * 0.333 / Math.pow(0.08, 2), b: 2,
					length: 0, diameter: 0.3, status: 'open' },
				pipe('P2', 'B', 'C', 300, 0.25), valve('V', 'C', 'D', 'PBV', 25, 0.2)]
		},
		want: { V: 'active' }, drop: { V: 25 }
	}
];

// ---- EPA's networks, with valves put in --------------------------------------------------------
function toSolverModel(parsed) {
	const S = parsed.scale;
	const nodes = parsed.nodes.map((n) => {
		if (n.type === 'tank') {
			return { id: n.id, type: 'tank', elev: n.elev * S.head, head: n.head * S.head,
				level: n.level * S.head, minLevel: n.minLevel * S.head,
				maxLevel: n.maxLevel * S.head, diameter: n.diameter * S.head };
		}
		if (n.type === 'reservoir') { return { id: n.id, type: 'reservoir', elev: n.elev * S.head, head: n.head * S.head }; }
		return { id: n.id, type: 'junction', elev: n.elev * S.head,
			demand: ((n.demand || 0) + (n.extraDemands || []).reduce((s, d) => s + (d.base || 0), 0)) * S.flow };
	});
	const links = parsed.links.map((l) => {
		const out = { id: l.id, type: l.type, from: l.from, to: l.to, diameter: l.diameter * S.dia,
			roughness: l.roughness, length: (l.length || 0) * S.len, status: l.status, k: l.k || 0 };
		if (l.type === 'pump') {
			const c = (parsed.curves || []).find((x) => x.id === l.curveId);
			let pts = c ? EngCalcs.lpnCurvePoints(c) : [];
			if (pts.length > 3) {
				const s = pts.slice().sort((u, v) => u[0] - v[0]);
				pts = [s[0], s[Math.floor((s.length - 1) / 2)], s[s.length - 1]];
			}
			const fit = pts.length ? EngCalcs.lpnPumpFromCurve(pts.map((p) => [p[0] * S.flow, p[1] * S.head]))
				: { h0: 0, a: 0, b: 2 };
			out.h0 = fit.h0; out.a = fit.a; out.b = fit.b;
		}
		return out;
	});
	return { nodes, links, method: 'hw', visc: 1.007e-6 };
}

function loadNet(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	return toSolverModel(parsed);
}

// Turn link `id` into a valve, pointing the way the water went in a solve with it wide open (a TCV
// at zero loss) -- or against it, `reverse`. `make(q)` returns the valve's fields from that flow.
function asValve(model, id, vt, make, reverse) {
	const m = JSON.parse(JSON.stringify(model));
	const l = m.links.find((x) => x.id === id);
	l.type = 'valve'; l.valveType = 'TCV'; l.setting = 0; l.length = 0; l.k = 0; l.roughness = 150;
	const base = EngCalcs.lpnSolve(m);
	if (!base.ok || !base.converged) { throw new Error('open-valve solve failed on ' + id); }
	const fwd = (base.flows[id] >= 0) !== !!reverse;
	if (!fwd) { const t = l.from; l.from = l.to; l.to = t; }
	l.valveType = vt;
	Object.assign(l, make(Math.abs(base.flows[id])));
	return m;
}
function chain(model, specs) {
	let m = model;
	for (const s of specs) { m = asValve(m, s[0], s[1], s[2], s[3]); }
	return m;
}
// A GPV curve built around the open flow q: four points at 0.4q, 0.8q, 1.2q and 1.6q, its loss
// rising from 0.5 m to 4 m, so the valve takes out a few metres and settles on a middle segment.
const gpvAround = (q) => ({ setting: 0, curvePoints: [[0.4 * q, 0.5], [0.8 * q, 1.2], [1.2 * q, 2.4], [1.6 * q, 4]] });

async function solveBoth(model) {
	const native = EngCalcs.lpnSolve(model);
	const hyd = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	const epa = await EngCalcs.lpnSolveEpanet(Object.assign({}, model, { hydraulics: hyd }), { moduleUrl: MODULE_URL });
	return { native, epa };
}

function diff(model, native, epa) {
	let dH = 0, atH = '', dQ = 0, atQ = '', qMax = 0;
	for (const n of model.nodes) {
		const d = Math.abs(native.heads[n.id] - epa.heads[n.id]);
		if (d > dH) { dH = d; atH = n.id; }
	}
	for (const l of model.links) {
		const d = Math.abs(native.flows[l.id] - epa.flows[l.id]);
		qMax = Math.max(qMax, Math.abs(epa.flows[l.id]));
		if (d > dQ) { dQ = d; atQ = l.id; }
	}
	return { dH, atH, dQ, atQ, qMax };
}

async function compare(c) {
	const { native, epa } = await solveBoth(c.model);
	if (!native.ok || !epa.ok) {
		ok(c.name, false, `ok native=${native.ok} epanet=${epa.ok} ` +
			JSON.stringify(native.issues || epa.issues || ''));
		return null;
	}
	const d = diff(c.model, native, epa);
	const qTol = Math.max(FLOW_TOL, FLOW_REL * d.qMax);
	const states = Object.keys(c.want || {}).map((id) => id + '=' + ((native.valveStatus || {})[id] || '?'));
	const stateOk = Object.keys(c.want || {}).every((id) => (native.valveStatus || {})[id] === c.want[id]);
	// The case is about what it says: a stated drop really is across the valve, start node above
	// end node, and a reversed case really does carry its water backwards.
	const headOf = (id) => (native.heads[id] !== undefined ? native.heads[id]
		: c.model.nodes.find((n) => n.id === id).head);
	let shapeOk = true, shape = '';
	Object.keys(c.drop || {}).forEach((id) => {
		const l = c.model.links.find((x) => x.id === id);
		const dh = headOf(l.from) - headOf(l.to);
		shape += ` drop ${id}=${dh.toFixed(4)} m`;
		if (Math.abs(dh - c.drop[id]) > HEAD_TOL) { shapeOk = false; }
	});
	if (c.reverse) {
		shape += ` Q ${c.reverse}=${(native.flows[c.reverse] / LPS).toFixed(3)} L/s`;
		if (!(native.flows[c.reverse] < -LPS)) { shapeOk = false; }
	}
	const pass1 = d.dH <= (c.dw ? DW_HEAD_TOL : HEAD_TOL) && d.dQ <= qTol && stateOk && shapeOk &&
		native.converged && epa.converged;
	ok(c.name, pass1,
		`dH=${d.dH.toExponential(2)} m @${d.atH}  dQ=${d.dQ.toExponential(2)} m3/s @${d.atQ}  ` +
		`[${states.join(' ')}]${stateOk ? '' : ' want ' + JSON.stringify(c.want)}${shape}` +
		(native.converged ? '' : ' NATIVE-UNCONVERGED') + (epa.converged ? '' : ' EPANET-UNCONVERGED') +
		`  it=${native.iterations}/${epa.iterations}`);
	const kind = /GPV/.test(c.name) && !/PBV/.test(c.name) ? 'GPV' : /PBV/.test(c.name) && !/GPV/.test(c.name) ? 'PBV' : 'both';
	const w = worst[kind] || (worst[kind] = { dH: 0, h: '', dQ: 0, q: '' });
	if (!c.dw && d.dH > w.dH) { w.dH = d.dH; w.h = c.name; }
	if (d.dQ > w.dQ) { w.dQ = d.dQ; w.q = c.name; }
	return d;
}

async function run() {
	console.log('-- 1. constructed networks');
	for (const c of CASES) { await compare(c); }

	console.log('-- 2. EPA Net1 and Net3, with PBVs and GPVs put in');
	const net1 = loadNet('Net1.inp');
	const net3 = loadNet('Net3.inp');
	const pbv = (s) => () => ({ setting: s });
	const net = [
		{ name: 'Net1 PBV on 111 (5 m)', m: net1, v: [['111', 'PBV', pbv(5)]], want: { 111: 'active' }, drop: { 111: 5 } },
		{ name: 'Net1 PBV reversed on 111 (5 m)', m: net1, v: [['111', 'PBV', pbv(5), true]], want: { 111: 'active' }, drop: { 111: 5 } },
		{ name: 'Net1 GPV on 21', m: net1, v: [['21', 'GPV', gpvAround]], want: { 21: 'open' } },
		{ name: 'Net1 GPV reversed on 21', m: net1, v: [['21', 'GPV', gpvAround, true]], want: { 21: 'open' } },
		{ name: 'Net3 PBV on 125 (3 m)', m: net3, v: [['125', 'PBV', pbv(3)]], want: { 125: 'active' }, drop: { 125: 3 } },
		{
			name: 'Net3 two PBVs and a GPV', m: net3,
			v: [['125', 'PBV', pbv(3)], ['177', 'PBV', pbv(2)], ['240', 'GPV', gpvAround]],
			want: { 125: 'active', 177: 'active', 240: 'open' }, drop: { 125: 3, 177: 2 }
		},
		{
			name: 'Net3 PBV and GPV, both against the open flow', m: net3,
			v: [['125', 'PBV', pbv(3), true], ['240', 'GPV', gpvAround, true]],
			want: { 125: 'active', 240: 'open' }, drop: { 125: 3 }
		}
	];
	for (const n of net) {
		await compare({ name: n.name, model: chain(n.m, n.v), want: n.want, drop: n.drop });
	}

	console.log('-- 3. the line the page routes on');
	ok('every valve type is native now', EngCalcs.lpnValveTypes.every((t) =>
		EngCalcs.lpnValveIsNative({ type: 'valve', valveType: t })));
	ok('a PBV network goes to neither engine but the chosen one',
		EngCalcs.lpnEpanetOnlyValves(line('PBV', 10)).length === 0);
	ok('a GPV with a usable curve likewise', EngCalcs.lpnEpanetOnlyValves(line('GPV', 0, gpv(GPV4))).length === 0);
	// A curve EPANET could not read either has no answer to match, so it keeps going to EPANET.
	ok('a GPV with no curve still goes to EPANET',
		EngCalcs.lpnEpanetOnlyValves(line('GPV', 0, gpv([]))).join() === 'V');
	ok('a GPV with a one-point curve still goes to EPANET',
		EngCalcs.lpnEpanetOnlyValves(line('GPV', 0, gpv(curve([[20, 5]])))).join() === 'V');
	ok('a GPV whose flows do not increase still goes to EPANET',
		EngCalcs.lpnEpanetOnlyValves(line('GPV', 0, gpv(curve([[20, 5], [20, 8]])))).join() === 'V');
	ok('...and the built-in solver refuses it by name rather than guessing',
		(EngCalcs.lpnSolve(line('GPV', 0, gpv([]))).issues || []).some((i) => i.code === 'valve-needs-epanet'));
	ok('a PBV on a reservoir is still refused by name',
		EngCalcs.lpnDiagnose({ nodes: [res('R', 50), jn('J', 0, 1)],
			links: [valve('V', 'R', 'J', 'PBV', 20, 0.2)] }).some((i) => i.code === 'valve-on-fixed-head'));

	console.log('-- 4. the comparison can fail');
	// Each of the three things this phase could get wrong, made wrong on purpose in the MODEL the
	// built-in solver sees, while EPANET solves the right one. Each must be out by far more than
	// the tolerance, or the cases above prove nothing about it.
	{
		const right = line('PBV', 8, null, backfeed);
		const epa = (await solveBoth(right)).epa;
		// A drop that followed the FLOW, as a pipe's loss does: with the water running backwards
		// that is the valve turned round, which is what is handed to the built-in solver here.
		const swapped = JSON.parse(JSON.stringify(right));
		swapped.links[1].from = 'J2'; swapped.links[1].to = 'J1';
		const nat = EngCalcs.lpnSolve(swapped);
		const d = diff(right, nat, epa);
		ok('a PBV whose drop followed the flow would be caught', d.dH > 100 * HEAD_TOL,
			`dH=${d.dH.toFixed(3)} m`);
	}
	{
		const right = line('GPV', 0, gpv(GPV4));
		const epa = (await solveBoth(right)).epa;
		// The curve read off by one segment: (flow, loss) pairs shifted.
		const shifted = line('GPV', 0, gpv(curve([[10, 6], [25, 14], [40, 30], [60, 46]])));
		const d = diff(right, EngCalcs.lpnSolve(shifted), epa);
		ok('a GPV read on the wrong segment would be caught', d.dH > 100 * HEAD_TOL, `dH=${d.dH.toFixed(3)} m`);
	}
	{
		const right = line('PBV', 0.2, { k: 10 });
		const epa = (await solveBoth(right)).epa;
		// The open law ignored: the setting forced although the minor loss already exceeds it.
		const forced = line('PBV', 0.2, { k: 0 });
		const d = diff(right, EngCalcs.lpnSolve(forced), epa);
		ok('a PBV forced when its minor loss already exceeds the setting would be caught',
			d.dH > 100 * HEAD_TOL, `dH=${d.dH.toFixed(3)} m`);
	}

	console.log('\nWorst differences from EPANET 2.3.5 (Hazen-Williams cases; Darcy-Weisbach held to ' +
		DW_HEAD_TOL * 1000 + ' mm):');
	Object.keys(worst).forEach((k) => {
		const w = worst[k];
		console.log(`  ${k}: head ${(w.dH * 1000).toFixed(3)} mm (${w.h}); flow ${(w.dQ / LPS).toExponential(2)} L/s (${w.q})`);
	});
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });

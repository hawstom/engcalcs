// PRV, PSV AND FCV IN THE BUILT-IN SOLVER, HELD TO EPANET'S OWN ANSWER (Task 733, phase 1).
//
//   node dev/lpn-spike/native-valve-harness.js
//
// Every case is solved twice: by EngCalcs.lpnSolve (js/lpn-solver.js, the built-in solver) and by
// EngCalcs.lpnSolveEpanet (the vendored EPANET 2.3.5 engine, reading the .inp js/lpn-epanet.js
// writes from the SAME model). Every node head and every link flow must agree, and the built-in
// solver must put each control valve in the state the case was built to reach, so a case that
// quietly stopped exercising the state it names fails rather than passing on a different question.
//
// TWO KINDS OF CASE. Small constructed networks, one per valve type and state (active, open,
// closed by reverse flow, closed by the user, the FCV's "cannot deliver its flow"), plus loops, a
// pump upstream of a PRV and a minor loss on an open valve. Then EPA's own Net1 and Net3 with
// pipes turned into valves: none of EPA's examples carries a PRV, PSV or FCV, so the valves are put
// into the real networks, with settings chosen from a first solve to land each one active, open
// or closed.
//
// TOLERANCES are validate_epanet.js's, for the same reason: EPANET keeps heads in single precision
// and reports through a float API, so about 1e-4 m of head is the floor however hard it is pushed.
// 2 mm of head and 0.002 L/s of flow, or 1e-5 of the largest flow in a big network. A wrong sign
// or a wrong state is out by metres, not millimetres. Both engines run at Accuracy 1e-5 (EPANET's
// floor) so a difference is never one engine stopping early.

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
const LPS = 0.001;
const DW_HEAD_TOL = 5e-3;   // m -- validate_epanet.js's two-loop-darcy-weisbach measures 1.1e-3 m

let pass = 0, fail = 0;
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

// ---- the constructed cases ---------------------------------------------------------------------
// R (100 m) -> P1 -> J1 (elev 0) -> V -> J2 (elev 10) -> P2 -> J3 (elev 10, 30 L/s)
function line(vt, setting, extra, tail) {
	return {
		method: 'hw',
		nodes: [res('R', 100), jn('J1', 0), jn('J2', 10), jn('J3', 10, 30)].concat(tail ? tail.nodes : []),
		links: [pipe('P1', 'R', 'J1', 800, 0.25), valve('V', 'J1', 'J2', vt, setting, 0.2, extra),
			pipe('P2', 'J2', 'J3', 600, 0.2)].concat(tail ? tail.links : [])
	};
}
// A second, higher source on the far side, so flow wants to run backwards through the valve.
const backfeed = { nodes: [res('R2', 140)], links: [pipe('P3', 'R2', 'J3', 300, 0.3)] };
// A lower outlet on the far side, so the valve passes flow to a sink and a PSV has work to do.
const drain = { nodes: [res('R3', 20)], links: [pipe('P4', 'J3', 'R3', 300, 0.3)] };

const CASES = [
	{ name: 'PRV active', model: line('PRV', 40), want: { V: 'active' } },
	{ name: 'PRV open (setting above what arrives)', model: line('PRV', 95), want: { V: 'open' } },
	{ name: 'PRV open, with a minor loss', model: line('PRV', 95, { k: 6 }), want: { V: 'open' } },
	{ name: 'PRV closed by reverse flow', model: line('PRV', 40, null, backfeed), want: { V: 'closed' } },
	{ name: 'PRV closed by the user', model: line('PRV', 40, { status: 'closed' }, backfeed), want: { V: 'closed' } },
	{ name: 'PSV active', model: line('PSV', 85, null, drain), want: { V: 'active' } },
	{ name: 'PSV open (upstream already above setting)', model: line('PSV', 30, null, drain), want: { V: 'open' } },
	{ name: 'PSV closed by reverse flow', model: line('PSV', 30, null, backfeed), want: { V: 'closed' } },
	{ name: 'FCV active', model: line('FCV', 20 * LPS, null, drain), want: { V: 'active' } },
	{ name: 'FCV cannot deliver its setting', model: line('FCV', 2000 * LPS, null, drain), want: { V: 'xfcv' } },
	{ name: 'FCV with reverse head (opens, flow backwards)', model: line('FCV', 20 * LPS, null, backfeed), want: { V: 'xfcv' } },
	{ name: 'FCV closed by the user', model: line('FCV', 20 * LPS, { status: 'closed' }, drain), want: { V: 'closed' } },
	{
		// A loop around the PRV: the valve holds J2 while a parallel pipe also feeds the zone, so
		// the setting and the loop flow have to settle together.
		name: 'PRV in a loop',
		model: {
			method: 'hw',
			nodes: [res('R', 120), jn('A', 0), jn('B', 20, 10), jn('C', 20, 25), jn('D', 15, 15)],
			links: [pipe('P1', 'R', 'A', 500, 0.3), valve('V', 'A', 'B', 'PRV', 45, 0.2),
				pipe('P2', 'B', 'C', 400, 0.2), pipe('P3', 'C', 'D', 400, 0.15),
				pipe('P4', 'A', 'D', 2500, 0.1), pipe('P5', 'B', 'D', 500, 0.15)]
		},
		want: { V: 'active' }
	},
	{
		name: 'PRV, PSV and FCV together',
		model: {
			method: 'hw',
			nodes: [res('R', 150), jn('A', 0), jn('B', 0, 5), jn('C', 10, 20), jn('D', 10), jn('E', 5, 10),
				jn('F', 5), jn('G', 0, 15), res('S', 30)],
			links: [
				Object.assign(pipe('P1', 'R', 'A', 600, 0.3), { roughness: 130 }),
				valve('VPRV', 'A', 'B', 'PRV', 70, 0.25),
				Object.assign(pipe('P2', 'B', 'C', 500, 0.25), { roughness: 130 }),
				valve('VFCV', 'C', 'D', 'FCV', 8 * LPS, 0.2),
				Object.assign(pipe('P3', 'D', 'E', 400, 0.2), { roughness: 130 }),
				Object.assign(pipe('P4', 'B', 'E', 900, 0.15), { roughness: 130 }),
				valve('VPSV', 'E', 'F', 'PSV', 40, 0.2),
				Object.assign(pipe('P5', 'F', 'G', 300, 0.2), { roughness: 130 }),
				Object.assign(pipe('P6', 'G', 'S', 300, 0.2), { roughness: 130 })
			]
		},
		want: { VPRV: 'active', VFCV: 'active', VPSV: 'active' }
	},
	{
		// Darcy-Weisbach is held to the looser bound validate_epanet.js measures for it on a valve-free
		// network (EPANET's friction factor differs from ours in the last digits), so this case
		// shows only that the valve logic is the same under the other friction law.
		name: 'PRV active, Darcy-Weisbach',
		model: (function () {
			const m = Object.assign(line('PRV', 40), { method: 'dw', visc: 1.007e-6 });
			m.links.forEach((l) => { if (l.type === 'pipe') { l.roughness = 0.15e-3; } });
			return m;
		}()),
		dw: true,
		want: { V: 'active' }
	},
	{
		// The PRV's upstream node leads nowhere else, so holding J2 leaves J1 with no equation: the
		// matrix is singular, and EPANET's badvalve() forces the valve open ('xpressure') and goes
		// on. Nothing flows through it, so it stays that way and J1 sits at J2's head.
		name: 'PRV that makes the matrix singular (badvalve)',
		model: {
			method: 'hw',
			nodes: [res('R', 100), jn('J1', 0), jn('J2', 10, 10), jn('J3', 10, 10)],
			links: [pipe('P1', 'R', 'J2', 800, 0.25), valve('V', 'J1', 'J2', 'PRV', 40, 0.2),
				pipe('P2', 'J2', 'J3', 600, 0.2)]
		},
		want: { V: 'xpressure' }
	},
	{
		name: 'pump upstream of a PRV',
		model: {
			method: 'hw',
			nodes: [res('R', 10), jn('A', 0), jn('B', 0), jn('C', 15), jn('D', 15, 40)],
			links: [pipe('P1', 'R', 'A', 50, 0.3),
				{ id: 'PU', type: 'pump', from: 'A', to: 'B', h0: 90, a: 90 * 0.333 / Math.pow(0.08, 2), b: 2,
					length: 0, diameter: 0.3, status: 'open' },
				pipe('P2', 'B', 'C', 300, 0.25), valve('V', 'C', 'D', 'PRV', 35, 0.2)]
		},
		want: { V: 'active' }
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

// Turn link `id` into a valve. The setting is chosen from a solve with that valve wide open (a TCV
// at zero loss), pointing the way the water went in that solve -- or against it, `reverse`.
function asValve(model, id, vt, settingOf, reverse) {
	const m = JSON.parse(JSON.stringify(model));
	const l = m.links.find((x) => x.id === id);
	l.type = 'valve'; l.valveType = 'TCV'; l.setting = 0; l.length = 0; l.k = 0; l.roughness = 150;
	const base = EngCalcs.lpnSolve(m);
	if (!base.ok || !base.converged) { throw new Error('open-valve solve failed on ' + id); }
	const fwd = (base.flows[id] >= 0) !== !!reverse;
	if (!fwd) { const t = l.from; l.from = l.to; l.to = t; }
	const byId = {}; m.nodes.forEach((n) => { byId[n.id] = n; });
	// And once with it shut, because in a LOOP a PRV is active only for a setting between the
	// downstream pressure the rest of the network gives with it shut and the one it gives open
	// (below that, the loop alone holds more and the valve closes); a PSV likewise upstream.
	l.status = 'closed';
	const shut = EngCalcs.lpnSolve(m);
	l.status = 'open';
	l.valveType = vt;
	const p = (r, id2) => r.heads[id2] - (byId[id2].elev || 0);
	l.setting = settingOf({
		pUp: p(base, l.from), pDown: p(base, l.to),
		pUpShut: shut.ok ? p(shut, l.from) : NaN, pDownShut: shut.ok ? p(shut, l.to) : NaN,
		q: Math.abs(base.flows[id])
	});
	return m;
}
function chain(model, specs) {
	let m = model;
	for (const s of specs) { m = asValve(m, s[0], s[1], s[2], s[3]); }
	return m;
}

async function compare(c) {
	const native = EngCalcs.lpnSolve(c.model);
	const hyd = Object.assign({ accuracy: 1e-5 }, c.model.hydraulics || {});
	const epa = await EngCalcs.lpnSolveEpanet(Object.assign({}, c.model, { hydraulics: hyd }), { moduleUrl: MODULE_URL });
	if (!native.ok || !epa.ok) {
		ok(c.name, false, `ok native=${native.ok} epanet=${epa.ok} ` +
			JSON.stringify(native.issues || epa.issues || ''));
		return null;
	}
	let dH = 0, atH = '', dQ = 0, atQ = '', qMax = 0;
	for (const n of c.model.nodes) {
		const d = Math.abs(native.heads[n.id] - epa.heads[n.id]);
		if (d > dH) { dH = d; atH = n.id; }
	}
	for (const l of c.model.links) {
		const d = Math.abs(native.flows[l.id] - epa.flows[l.id]);
		qMax = Math.max(qMax, Math.abs(epa.flows[l.id]));
		if (d > dQ) { dQ = d; atQ = l.id; }
	}
	const qTol = Math.max(FLOW_TOL, FLOW_REL * qMax);
	const states = Object.keys(c.want || {}).map((id) => id + '=' + ((native.valveStatus || {})[id] || '?'));
	const stateOk = Object.keys(c.want || {}).every((id) => (native.valveStatus || {})[id] === c.want[id]);
	ok(c.name, dH <= (c.dw ? DW_HEAD_TOL : HEAD_TOL) && dQ <= qTol && stateOk && native.converged && epa.converged,
		`dH=${dH.toExponential(2)} m @${atH}  dQ=${dQ.toExponential(2)} m3/s @${atQ}  ` +
		`[${states.join(' ')}]${stateOk ? '' : ' want ' + JSON.stringify(c.want)}` +
		(native.converged ? '' : ' NATIVE-UNCONVERGED') + (epa.converged ? '' : ' EPANET-UNCONVERGED') +
		`  it=${native.iterations}/${epa.iterations}`);
	return { dH, dQ };
}

async function run() {
	console.log('-- constructed networks');
	for (const c of CASES) { await compare(c); }

	console.log('-- EPA Net1 and Net3, with valves put in');
	const net1 = loadNet('Net1.inp');
	const b1 = EngCalcs.lpnSolve(net1);
	const net3 = loadNet('Net3.inp');
	const b3 = EngCalcs.lpnSolve(net3);
	ok('Net1 and Net3 solve without valves', b1.ok && b1.converged && b3.ok && b3.converged);
	const active = {
		PRV: (s) => (isFinite(s.pDownShut) ? (s.pDown + s.pDownShut) / 2 : s.pDown - 5),
		PSV: (s) => (isFinite(s.pUpShut) ? (s.pUp + s.pUpShut) / 2 : s.pUp + 5),
		FCV: (s) => 0.5 * s.q
	};
	const open = {
		PRV: (s) => s.pDown + 200,
		PSV: (s) => Math.max(0, s.pUp - 30),
		FCV: (s) => 50 * s.q + 1
	};
	const net = [
		// Links chosen in LOOPS, so the network stays connected with the valve shut and a setting
		// between "shut" and "open" exists (see asValve). Each Net1 case has one valve; the Net3 sets
		// put three disjoint ones in at once.
		{ name: 'Net1 PRV active on 111', m: net1, v: [['111', 'PRV', active.PRV]], want: { 111: 'active' } },
		{ name: 'Net1 PSV active on 11', m: net1, v: [['11', 'PSV', active.PSV]], want: { 11: 'active' } },
		{ name: 'Net1 FCV active on 21', m: net1, v: [['21', 'FCV', active.FCV]], want: { 21: 'active' } },
		{ name: 'Net1 PRV open on 111', m: net1, v: [['111', 'PRV', open.PRV]], want: { 111: 'open' } },
		{ name: 'Net1 PRV reversed on 111 (closes)', m: net1, v: [['111', 'PRV', active.PRV, true]], want: { 111: 'closed' } },
		{ name: 'Net3 PRV active on 125', m: net3, v: [['125', 'PRV', active.PRV]], want: { 125: 'active' } },
		{
			name: 'Net3 PRV + PSV + FCV, all active', m: net3,
			v: [['125', 'PRV', active.PRV], ['177', 'PSV', active.PSV], ['240', 'FCV', active.FCV]],
			want: { 125: 'active', 177: 'active', 240: 'active' }
		},
		{
			name: 'Net3 PRV + PSV + FCV, all open', m: net3,
			v: [['125', 'PRV', open.PRV], ['177', 'PSV', open.PSV], ['240', 'FCV', open.FCV]],
			want: { 125: 'open', 177: 'open', 240: 'xfcv' }
		},
		{
			name: 'Net3 PRV + PSV reversed (close), FCV reversed (opens)', m: net3,
			v: [['125', 'PRV', active.PRV, true], ['177', 'PSV', active.PSV, true], ['240', 'FCV', active.FCV, true]],
			want: { 125: 'closed', 177: 'closed', 240: 'xfcv' }
		}
	];
	for (const n of net) {
		await compare({ name: n.name, model: chain(n.m, n.v), want: n.want });
	}

	console.log('-- the line the page routes on');
	ok('PRV, PSV, FCV and TCV are native', ['PRV', 'PSV', 'FCV', 'TCV'].every((t) =>
		EngCalcs.lpnValveIsNative({ type: 'valve', valveType: t })));
	ok('PBV and GPV still need EPANET', ['PBV', 'GPV'].every((t) =>
		!EngCalcs.lpnValveIsNative({ type: 'valve', valveType: t })));
	// EPANET's input error 220 (project.c valvecheck): two PRVs in series. EPANET refuses it, so the
	// built-in solver must not quietly answer it: those valves still route to EPANET.
	const series = line('PRV', 60);
	series.nodes.push(jn('J4', 10, 5));
	series.links.push(valve('V2', 'J2', 'J4', 'PRV', 30, 0.2));
	ok('two PRVs in series still go to EPANET', EngCalcs.lpnEpanetOnlyValves(series).join(',') === 'V,V2');
	ok('a PRV on a reservoir is still refused by name',
		EngCalcs.lpnDiagnose({ nodes: [res('R', 50), jn('J', 0, 1)],
			links: [valve('V', 'R', 'J', 'PRV', 20, 0.2)] }).some((i) => i.code === 'valve-on-fixed-head'));

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });

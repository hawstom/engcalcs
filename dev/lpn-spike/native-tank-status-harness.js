// A FULL TANK TAKES NO WATER IN, AN EMPTY ONE GIVES NONE OUT -- in the built-in solver too.
//
//   node dev/lpn-spike/native-tank-status-harness.js
//
// OWA-EPANET 2.3.5 hydstatus.c tankstatus(), called from linkstatus() at every periodic status
// check and again on convergence (hydsolver.c hydsolve()), closes (TEMPCLOSED) any link carrying
// flow into a tank at its highest level or out of one at its lowest -- at t = 0 as at any other
// time. The built-in solver held every tank as a plain fixed head, so it pushed water into a full
// tank that EPANET keeps out. Found on WaterGEMS's own export of the Zenodo 7162154 model
// "EPS_Badapokharan_Operation as per design_base_model" (2026-10-18): pump U1 lifts through a PSV
// into the top inlet of T01, which starts at its maximum level. EPANET shuts the flow off and the
// pump sits at its shutoff head; the built-in solver passed 47 L/s and put the pump's junctions
// 15 m apart from EPANET's. The PSV was a bystander: the first case below is that network cut
// down, and the second shows the same difference with no valve and no pump at all.
//
// Every case is solved by EngCalcs.lpnSolve and by EngCalcs.lpnSolveEpanet on the same model, to
// native-valve-harness.js's tolerances, and names the link it expects the tank to close (flow 0)
// or to leave open -- so a case that stopped exercising the rule fails rather than passing.
// A pump joined straight to a full tank is not here: EPANET itself cycles that pump's status and
// does not converge (211 trials), so there is no answer of its to match.

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
const FLOW_REL = 1e-5;      // of the largest flow, for Net1
const LPS = 0.001;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

function pipe(id, from, to, length, diameter) {
	return { id, type: 'pipe', from, to, length, diameter, roughness: 140, k: 0, status: 'open' };
}
function jn(id, elev, demandLps) { return { id, type: 'junction', elev, demand: (demandLps || 0) * LPS }; }
function res(id, head) { return { id, type: 'reservoir', elev: head, head }; }
function tank(id, base, level, minLevel, maxLevel, diameter) {
	return { id, type: 'tank', elev: base, head: base + level, level, minLevel, maxLevel,
		diameter: diameter === undefined ? 5 : diameter };
}
// Badapokharan's U1, one point at 43.264 L/s and 37 m (EPANET's one-point rule).
function pumpU1(id, from, to) {
	return Object.assign({ id, type: 'pump', from, to, length: 0, diameter: 0.2, status: 'open' },
		EngCalcs.lpnPumpFromCurve([[43.264 * LPS, 37]]));
}

const CASES = [
	{
		// Badapokharan, cut down: R101 -> pipe -> U1 -> pipe up to the inlet -> PSV (setting 0)
		// -> a 1 mm stub into T01, full.
		name: 'pump -> PSV -> full tank (the Badapokharan inlet)',
		model: { method: 'hw',
			nodes: [res('R', 22), jn('A', 22), jn('B', 22), jn('C', 56), jn('D', 56), tank('T', 31.5, 24.5, 0, 24.5)],
			links: [pipe('P1', 'R', 'A', 25, 0.2), pumpU1('U', 'A', 'B'), pipe('P2', 'B', 'C', 25, 0.2),
				{ id: 'V', type: 'valve', valveType: 'PSV', from: 'C', to: 'D', length: 0, diameter: 0.2,
					roughness: 150, setting: 0, k: 0, status: 'open' },
				pipe('P3', 'D', 'T', 0.001, 1)] },
		closed: ['P3']
	},
	{
		name: 'reservoir -> pipe -> full tank',
		model: { method: 'hw', nodes: [res('R', 60), jn('A', 0), tank('T', 31.5, 24.5, 0, 24.5)],
			links: [pipe('P1', 'R', 'A', 100, 0.2), pipe('P2', 'A', 'T', 100, 0.2)] },
		closed: ['P2']
	},
	{
		name: 'empty tank -> pipe -> lower reservoir',
		model: { method: 'hw', nodes: [tank('T', 31.5, 0, 0, 24.5), jn('A', 0), res('R', 10)],
			links: [pipe('P1', 'T', 'A', 100, 0.2), pipe('P2', 'A', 'R', 100, 0.2)] },
		closed: ['P1']
	},
	{
		name: 'full tank supplying a demand stays open',
		model: { method: 'hw', nodes: [tank('T', 31.5, 24.5, 0, 24.5), jn('A', 0, 20)],
			links: [pipe('P1', 'T', 'A', 500, 0.2)] },
		open: ['P1']
	},
	{
		name: 'empty tank being filled stays open',
		model: { method: 'hw', nodes: [res('R', 60), jn('A', 0), tank('T', 31.5, 0, 0, 24.5)],
			links: [pipe('P1', 'R', 'A', 100, 0.2), pipe('P2', 'A', 'T', 100, 0.2)] },
		open: ['P2']
	},
	{
		// Diameter 0 is a reservoir to EPANET (input3.c tankdata: Type = (diam == 0) ? RESERVOIR),
		// and tankstatus() skips it, so a "full" one still takes water.
		name: 'a diameter-0 tank at its top level is a reservoir and takes water',
		model: { method: 'hw', nodes: [res('R', 60), jn('A', 0), tank('T', 31.5, 24.5, 0, 24.5, 0)],
			links: [pipe('P1', 'R', 'A', 100, 0.2), pipe('P2', 'A', 'T', 100, 0.2)] },
		open: ['P2']
	}
];

// EPA's Net1: at t = 0 its pump fills tank 2 through pipe 110. Started at its maximum level, the
// tank must refuse that water and the pump must work against the closed pipe.
function net1Full() {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', 'Net1.inp'), 'utf8'));
	if (!parsed.ok) { throw new Error('Net1 does not parse: ' + parsed.error); }
	const S = parsed.scale;
	const nodes = parsed.nodes.map((n) => {
		if (n.type === 'tank') {
			return tank(n.id, n.elev * S.head, n.maxLevel * S.head, n.minLevel * S.head,
				n.maxLevel * S.head, n.diameter * S.head);
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
			const fit = EngCalcs.lpnPumpFromCurve(EngCalcs.lpnCurvePoints(c).map((p) => [p[0] * S.flow, p[1] * S.head]));
			out.h0 = fit.h0; out.a = fit.a; out.b = fit.b;
		}
		return out;
	});
	return { nodes, links, method: 'hw' };
}

async function compare(c) {
	const native = EngCalcs.lpnSolve(c.model);
	const epa = await EngCalcs.lpnSolveEpanet(Object.assign({}, c.model, { hydraulics: { accuracy: 1e-5 } }),
		{ moduleUrl: MODULE_URL });
	if (!native.ok || !epa.ok) {
		ok(c.name, false, `ok native=${native.ok} epanet=${epa.ok} ` + JSON.stringify(native.issues || epa.issues || ''));
		return;
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
	const shut = (id) => native.flows[id] === 0;
	const stateOk = (c.closed || []).every(shut) && (c.open || []).every((id) => !shut(id));
	ok(c.name, dH <= HEAD_TOL && dQ <= qTol && stateOk && native.converged && epa.converged,
		`dH=${dH.toExponential(2)} m @${atH}  dQ=${dQ.toExponential(2)} m3/s @${atQ}` +
		(stateOk ? '' : `  want closed ${JSON.stringify(c.closed || [])} open ${JSON.stringify(c.open || [])}`) +
		(native.converged ? '' : ' NATIVE-UNCONVERGED') + (epa.converged ? '' : ' EPANET-UNCONVERGED') +
		`  it=${native.iterations}/${epa.iterations}`);
}

async function run() {
	for (const c of CASES) { await compare(c); }
	await compare({ name: 'Net1 with tank 2 started full (pipe 110 closes)', model: net1Full(), closed: ['110'] });
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });

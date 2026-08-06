// Phase 0.5 validation harness for js/lpn-solver.js (ROADMAP Task 146).
//
// Run:  node dev/lpn-spike/validate.js
//
// Four independent kinds of check, because "the solver agrees with itself" is not
// evidence:
//
//  1. RESIDUALS -- continuity at every junction and the constitutive head-loss
//     equation on every link, both to machine precision. For a network with at
//     least one fixed head and monotone head-loss functions the steady-state
//     solution is unique, so satisfying the equations IS being right. This checks
//     the SOLVE.
//  2. CLOSED FORM -- cases whose answer is derived by hand or by an independent
//     bisection, never by this solver. This checks that the equations being
//     satisfied are the intended ones.
//  3. EPANET -- the real EPANET engine (WASM) run over its own Net1/Net2/Net3. As
//     of Task 213 the suite is on EPANET's own Hazen-Williams constants, so this
//     runs with the shipped constants and no longer has to isolate constant choice
//     from solver error. This checks topology handling, pumps, and scale.
//  4. SUITE CONSISTENCY -- the head-loss kernel against this suite's own shipped,
//     long-trusted hazen-williams.js and branched-network.js. This checks that
//     lpn_ will not disagree with the calculator sitting next to it in the menu.
//
// The EPANET reference files are produced by dev/lpn-spike/make_reference.js and
// committed, so this harness runs with no network access and no node_modules.

const fs = require('fs');
const path = require('path');
const EngCalcs = require('../../js/lpn-solver.js');
const cases = require('./cases.js');

const GPM_TO_M3S = 6.309019640343977e-5;
const FT_TO_M = 0.3048;
const IN_TO_M = 0.0254;

let failures = 0;
let checks = 0;

function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

function fmt(x, dp) {
	return Number(x).toFixed(dp === undefined ? 6 : dp);
}

// ---------------------------------------------------------------------------
// 1. Residuals
// ---------------------------------------------------------------------------

// Continuity: at every junction, inflow - outflow must equal demand (+ emitter
// outflow). Computed from the reported flows, independently of the solver's
// internal bookkeeping.
function continuityResidual(model, result, emitterExp) {
	let worst = 0;
	let worstId = null;
	for (const node of model.nodes) {
		if (node.type === 'reservoir') { continue; }
		let net = 0;
		for (const link of model.links) {
			if (link.to === node.id) { net += result.flows[link.id]; }
			if (link.from === node.id) { net -= result.flows[link.id]; }
		}
		let draw = node.demand || 0;
		if (node.emitter > 0) {
			const dh = Math.max(result.heads[node.id] - (node.elev || 0), 0);
			draw += node.emitter * Math.pow(dh, emitterExp);
		}
		const r = Math.abs(net - draw);
		if (r > worst) { worst = r; worstId = node.id; }
	}
	return { worst, worstId };
}

// Energy: for every open link, the head loss recomputed from the constitutive
// equation must equal the difference of the solved end heads.
function energyResidual(model, result) {
	let worst = 0;
	let worstId = null;
	for (const link of model.links) {
		if (link.status === 'closed') { continue; }
		const dh = result.heads[link.from] - result.heads[link.to];
		const r = Math.abs(dh - result.headlosses[link.id]);
		if (r > worst) { worst = r; worstId = link.id; }
	}
	return { worst, worstId };
}

function checkResiduals(model, opts, contTol, enerTol) {
	const result = EngCalcs.lpnSolve(model, opts);
	if (!result.ok) {
		report(false, `${model.name}: solve failed`, JSON.stringify(result.issues));
		return null;
	}
	report(result.converged, `${model.name}: converged`, `${result.iterations} iterations`);

	const c = continuityResidual(model, result, model.emitterExponent || 0.5);
	report(c.worst < contTol, `${model.name}: continuity residual`,
		`max ${c.worst.toExponential(2)} m3/s${c.worstId ? ' at ' + c.worstId : ''}`);

	const e = energyResidual(model, result);
	report(e.worst < enerTol, `${model.name}: energy residual`,
		`max ${e.worst.toExponential(2)} m${e.worstId ? ' at ' + e.worstId : ''}`);

	return result;
}

// ---------------------------------------------------------------------------
// 2. Closed-form checks
// ---------------------------------------------------------------------------

function hwResistance(L, d, C) {
	return EngCalcs.hwCoef * L / (Math.pow(C, EngCalcs.hwExp) * Math.pow(d, EngCalcs.hwDiaExp));
}

function checkParallelSplitAnalytic() {
	const model = cases.twoLoopAnalytic;
	const result = EngCalcs.lpnSolve(model);
	if (!result.ok) { report(false, 'parallel split: solve failed'); return; }

	const n = 1.852;
	const Q = 50 * 0.001;
	const rA = hwResistance(800, 0.2, 130);
	const rB = hwResistance(400, 0.15, 130);

	// r_A Q_A^n = r_B Q_B^n and Q_A + Q_B = Q.
	const ratio = Math.pow(rA / rB, 1 / n);       // Q_B / Q_A
	const qa = Q / (1 + ratio);
	const qb = Q - qa;

	const eA = Math.abs(result.flows.PA - qa);
	const eB = Math.abs(result.flows.PB - qb);
	report(eA < 1e-12 && eB < 1e-12, 'parallel split matches closed form',
		`PA ${fmt(result.flows.PA * 1000, 6)} vs ${fmt(qa * 1000, 6)} L/s, ` +
		`PB ${fmt(result.flows.PB * 1000, 6)} vs ${fmt(qb * 1000, 6)} L/s`);

	// The trunk must carry exactly the demand.
	report(Math.abs(result.flows.P0 - Q) < 1e-12, 'trunk carries the whole demand',
		`${fmt(result.flows.P0 * 1000, 9)} L/s`);

	// And the head at J2 must equal reservoir head minus the two losses in series.
	const hJ1 = 100 - hwResistance(500, 0.3, 130) * Math.pow(Q, n);
	const hJ2 = hJ1 - rA * Math.pow(qa, n);
	report(Math.abs(result.heads.J1 - hJ1) < 1e-9 && Math.abs(result.heads.J2 - hJ2) < 1e-9,
		'heads match closed form',
		`J1 ${fmt(result.heads.J1, 9)} vs ${fmt(hJ1, 9)}, J2 ${fmt(result.heads.J2, 9)} vs ${fmt(hJ2, 9)}`);
}

function checkEmitterAnalytic() {
	const model = cases.emitterCase;
	const result = EngCalcs.lpnSolve(model);
	if (!result.ok) { report(false, 'emitter: solve failed'); return; }

	// Independent bisection on f(Q) = H_R - r Q^n - z - (Q/C)^(1/gamma) = 0.
	const r = hwResistance(600, 0.15, 130);
	const n = 1.852;
	const C = 0.002;
	const gamma = 0.5;
	const f = (q) => 80 - r * Math.pow(q, n) - 20 - Math.pow(q / C, 1 / gamma);

	let lo = 0, hi = 1;
	for (let i = 0; i < 200; i++) {
		const mid = (lo + hi) / 2;
		if (f(mid) > 0) { lo = mid; } else { hi = mid; }
	}
	const qExact = (lo + hi) / 2;

	report(Math.abs(result.flows.P - qExact) < 1e-10, 'emitter flow matches bisection',
		`${fmt(result.flows.P * 1000, 8)} vs ${fmt(qExact * 1000, 8)} L/s`);
}

function checkZeroDemand() {
	const result = EngCalcs.lpnSolve(cases.zeroDemandCase);
	if (!result.ok) { report(false, 'zero demand: solve failed'); return; }

	let maxQ = 0;
	let maxHeadErr = 0;
	for (const link of cases.zeroDemandCase.links) {
		maxQ = Math.max(maxQ, Math.abs(result.flows[link.id]));
	}
	for (const id of ['A', 'B', 'C']) {
		maxHeadErr = Math.max(maxHeadErr, Math.abs(result.heads[id] - 100));
	}
	const finite = Object.values(result.heads).every(Number.isFinite) &&
		Object.values(result.flows).every(Number.isFinite);

	report(finite, 'zero demand: no NaN or Infinity anywhere');
	// Not exactly zero, and that is the gradient floor working as designed: a link
	// at zero flow is given a finite conductance (1/lpnGradMin ~ 9e4), so head
	// differences at the roundoff level produce flows at the 1e-9 m3/s level --
	// two nanolitres per second, twelve orders of magnitude below anything the page
	// will ever display. Demanding exact zero here would mean removing the guard
	// that makes near-zero-flow links converge at all.
	report(maxQ < 1e-8, 'zero demand: all flows zero to within the gradient floor',
		`max ${maxQ.toExponential(2)} m3/s`);
	report(maxHeadErr < 1e-9, 'zero demand: whole network at reservoir head',
		`max error ${maxHeadErr.toExponential(2)} m`);
}

function checkDiagnostics() {
	const noRes = EngCalcs.lpnSolve(cases.noReservoirCase);
	report(!noRes.ok && noRes.issues[0] && noRes.issues[0].code === 'no-fixed-head',
		'diagnostic: network with no fixed head is refused before solving',
		noRes.issues.map(i => i.code).join(','));

	const unreach = EngCalcs.lpnSolve(cases.unreachableCase);
	const u = unreach.issues.find(i => i.code === 'unreachable');
	report(!unreach.ok && u && u.ids.length === 1 && u.ids[0] === 'X',
		'diagnostic: unreachable node is named, not just detected',
		u ? u.ids.join(',') : 'none');

	const closed = EngCalcs.lpnSolve(cases.closedLinkCase);
	const c = closed.issues.find(i => i.code === 'unreachable');
	report(!closed.ok && c && c.ids.join(',') === 'B',
		'diagnostic: a closed link isolates the node behind it',
		c ? c.ids.join(',') : 'none');
}

// ---------------------------------------------------------------------------
// 3. EPANET comparison
// ---------------------------------------------------------------------------

// Builds the solver's model from an .inp topology plus the engine's own t=0
// boundary conditions. Demands and fixed heads are INPUTS to the hydraulic
// problem, so taking them from the reference removes pattern parsing and tank
// level bookkeeping as confounds -- what is under test here is the hydraulics,
// not an .inp reader (that is Phase 3 work).
function modelFromReference(ref, inp) {
	const pipes = parseSection(inp, 'PIPES');
	const pumps = parseSection(inp, 'PUMPS');
	const curves = parseSection(inp, 'CURVES');

	const curveById = {};
	for (const c of curves) {
		if (!curveById[c[0]]) { curveById[c[0]] = []; }
		curveById[c[0]].push([parseFloat(c[1]) * GPM_TO_M3S, parseFloat(c[2]) * FT_TO_M]);
	}

	const nodes = ref.nodes.map(n => {
		if (n.type === 'Junction') {
			return {
				id: n.id, type: 'junction',
				elev: n.elevation * FT_TO_M,
				demand: n.demand * GPM_TO_M3S
			};
		}
		// Reservoirs and tanks are both fixed-head boundaries at a single instant.
		return { id: n.id, type: 'reservoir', head: n.head * FT_TO_M };
	});

	const statusById = {};
	for (const l of ref.links) { statusById[l.id] = l.status; }

	const links = [];
	for (const p of pipes) {
		links.push({
			id: p[0], type: 'pipe', from: p[1], to: p[2],
			length: parseFloat(p[3]) * FT_TO_M,
			diameter: parseFloat(p[4]) * IN_TO_M,
			roughness: parseFloat(p[5]),
			k: parseFloat(p[6]) || 0,
			status: statusById[p[0]] || 'open'
		});
	}
	for (const p of pumps) {
		const headIdx = p.indexOf('HEAD');
		const pump = EngCalcs.lpnPumpFromCurve(curveById[p[headIdx + 1]]);
		links.push(Object.assign({
			id: p[0], type: 'pump', from: p[1], to: p[2],
			status: statusById[p[0]] || 'open', diameter: 0
		}, pump));
	}

	return { name: ref.source, method: 'hw', nodes, links };
}

// EPANET's own continuity residual at each junction, in gpm, computed from the
// numbers it reported. This is the yardstick a disagreement is measured against.
function epanetContinuityResidual(ref) {
	let worst = 0;
	let worstId = null;
	for (const n of ref.nodes) {
		if (n.type !== 'Junction') { continue; }
		let net = 0;
		for (const l of ref.links) {
			if (l.to === n.id) { net += l.flow; }
			if (l.from === n.id) { net -= l.flow; }
		}
		const r = Math.abs(net - n.demand);
		if (r > worst) { worst = r; worstId = n.id; }
	}
	return { worst, worstId };
}

function parseSection(text, name) {
	const re = new RegExp(`\\[${name}\\]([\\s\\S]*?)(?=\\n\\s*\\[|$)`, 'i');
	const m = text.match(re);
	if (!m) { return []; }
	return m[1].split('\n')
		.map(l => l.replace(/;.*$/, '').trim())
		.filter(l => l.length > 0)
		.map(l => l.split(/\s+/));
}

function checkAgainstEpanet(name) {
	const refPath = path.join(__dirname, 'reference', `ref_${name}.json`);
	const inpPath = path.join(__dirname, 'reference', `${name}.inp`);
	if (!fs.existsSync(refPath)) {
		report(false, `${name}: reference missing`, 'run make_reference.js');
		return;
	}

	const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));
	const inp = fs.readFileSync(inpPath, 'utf8');
	const model = modelFromReference(ref, inp);

	const result = EngCalcs.lpnSolve(model, { tol: 1e-10, maxIter: 100 });
	if (!result.ok) {
		report(false, `${name}: solve failed`, JSON.stringify(result.issues));
		return;
	}
	report(result.converged, `${name}: converged`, `${result.iterations} iterations`);

	let worstHead = 0, worstHeadId = null;
	for (const n of ref.nodes) {
		const mine = result.heads[n.id] / FT_TO_M;
		const err = Math.abs(mine - n.head);
		if (err > worstHead) { worstHead = err; worstHeadId = n.id; }
	}

	let worstFlow = 0, worstFlowId = null;
	for (const l of ref.links) {
		if (result.flows[l.id] === undefined) { continue; }
		const mine = result.flows[l.id] / GPM_TO_M3S;
		const err = Math.abs(mine - l.flow);
		if (err > worstFlow) { worstFlow = err; worstFlowId = l.id; }
	}

	// EPANET stops on a relative flow criterion, so it carries its own residual.
	// Measure it, so that any disagreement can be ATTRIBUTED rather than assumed:
	// if our continuity residual is far smaller than EPANET's at the same node,
	// the difference is EPANET's convergence slack, not our error.
	const epaCont = epanetContinuityResidual(ref);

	report(worstHead < 0.01, `${name}: heads match EPANET`,
		`max ${fmt(worstHead, 5)} ft at ${worstHeadId}`);
	report(worstFlow < 0.05 || worstFlow < 10 * epaCont.worst,
		`${name}: flows match EPANET`,
		`max ${fmt(worstFlow, 5)} gpm at ${worstFlowId}; ` +
		`EPANET's own continuity residual is ${fmt(epaCont.worst, 5)} gpm at ${epaCont.worstId}`);

	const c = continuityResidual(model, result, 0.5);
	report(c.worst < 1e-9, `${name}: continuity residual`, `max ${c.worst.toExponential(2)} m3/s`);
}

// ---------------------------------------------------------------------------
// 4. Suite consistency
// ---------------------------------------------------------------------------

// The head-loss kernel must agree with the calculators already in the menu.
// branched-network.js is loaded with a stub global rather than a browser.
function checkSuiteConsistency() {
	global.EngCalcs = EngCalcs;
	const src = fs.readFileSync(path.join(__dirname, '../../js/branched-network.js'), 'utf8');
	// Only the pure head-loss helpers are needed; the rest of the file touches the
	// DOM, so evaluate just the functions this check compares against -- starting at
	// EngCalcs.g, because bpnFriction reads it and slicing below it silently yields
	// NaN rather than an error.
	const start = src.indexOf('EngCalcs.g =');
	const end = src.indexOf('EngCalcs.bpnReadRows');
	// eslint-disable-next-line no-eval
	eval(src.slice(start, end));
	if (!(EngCalcs.g > 0)) { throw new Error('bpn constants did not load'); }

	const L = 500, d = 0.25, C = 130, q = 0.04;

	const mine = hwResistance(L, d, C) * Math.pow(q, EngCalcs.hwExp);
	const theirs = EngCalcs.bpnFriction(
		{ diameter: d, length: L, q: q, rough: C, roughSi: 0 }, 'hw', 1.007e-6).hf;
	report(Math.abs(mine - theirs) < 1e-12, 'Hazen-Williams agrees with branched-network.js',
		`${fmt(mine, 9)} vs ${fmt(theirs, 9)} m`);

	const nMan = 0.011;
	const mineMan = EngCalcs.lpnResistance(
		{ diameter: d, length: L, roughness: nMan }, 'manning', 1.007e-6);
	const mineManH = mineMan.r * q * q;
	const theirsMan = EngCalcs.bpnFriction(
		{ diameter: d, length: L, q: q, rough: nMan, roughSi: 0 }, 'manning', 1.007e-6).hf;
	report(Math.abs(mineManH - theirsMan) < 1e-12, 'Manning agrees with branched-network.js',
		`${fmt(mineManH, 9)} vs ${fmt(theirsMan, 9)} m`);

	const e = 0.00015;
	const f = EngCalcs.lpnDwFriction(q, d, e, 1.007e-6);
	const fBpn = EngCalcs.bpnDwFriction(q, d, e, 1.007e-6);
	report(Math.abs(f - fBpn) < 1e-15, 'Darcy-Weisbach friction factor is identical',
		`${fmt(f, 9)} vs ${fmt(fBpn, 9)}`);

	const mineDw = EngCalcs.lpnResistance(
		{ diameter: d, length: L, roughness: e, f: f }, 'dw', 1.007e-6);
	const theirsDw = EngCalcs.bpnFriction(
		{ diameter: d, length: L, q: q, rough: 0, roughSi: e }, 'dw', 1.007e-6).hf;
	report(Math.abs(mineDw.r * q * q - theirsDw) < 1e-12,
		'Darcy-Weisbach head loss agrees with branched-network.js',
		`${fmt(mineDw.r * q * q, 9)} vs ${fmt(theirsDw, 9)} m`);

	// Task 213: the suite's Hazen-Williams IS EPANET's, so assert it against
	// EPANET's published US-unit form evaluated independently in US units, rather
	// than reporting a difference. h = 4.727 L Q^1.852 / (C^1.852 d^4.871), ft/cfs.
	const Lft = L / FT_TO_M, dft = d / FT_TO_M, qcfs = q / Math.pow(FT_TO_M, 3);
	const hUs = 4.727 * Lft * Math.pow(qcfs, 1.852) /
		(Math.pow(C, 1.852) * Math.pow(dft, 4.871)) * FT_TO_M;
	report(Math.abs(mine - hUs) / hUs < 1e-12,
		'Hazen-Williams matches EPANET\'s US-unit form 4.727 L Q^1.852 / (C^1.852 d^4.871)',
		`${fmt(mine, 9)} vs ${fmt(hUs, 9)} m`);

	// And that no page has quietly grown its own copy of the constants again --
	// three duplicated forms is exactly what Task 213 removed.
	const dupes = ['hazen-williams.js', 'branched-network.js', 'lpn-solver.js'].filter((f) => {
		const txt = fs.readFileSync(path.join(__dirname, '../../js/', f), 'utf8');
		return /7\.8828|0\.849|4\.8704|4\.727/.test(txt);
	});
	report(dupes.length === 0, 'no calculator carries its own Hazen-Williams constants',
		dupes.length ? dupes.join(', ') : 'all three use EngCalcs.hwSlope / EngCalcs.hwCoef');
}

// ---------------------------------------------------------------------------

console.log('\n=== 1. Residuals (continuity + energy, machine precision) ===');
checkResiduals(cases.twoLoopGrid, {}, 1e-12, 1e-9);
checkResiduals(cases.twoLoopManning, {}, 1e-12, 1e-9);
checkResiduals(cases.twoLoopDw, {}, 1e-12, 1e-9);
checkResiduals(cases.twoLoopMinorLosses, {}, 1e-12, 1e-9);
checkResiduals(cases.twoLoopAnalytic, {}, 1e-12, 1e-9);
checkResiduals(cases.emitterCase, {}, 1e-12, 1e-9);

console.log('\n=== 2. Closed form and edge cases ===');
checkParallelSplitAnalytic();
checkEmitterAnalytic();
checkZeroDemand();
checkDiagnostics();

console.log('\n=== 3. EPANET engine comparison (shipped constants) ===');
checkAgainstEpanet('Net1');
checkAgainstEpanet('Net2');
checkAgainstEpanet('Net3');

console.log('\n=== 4. Consistency with the rest of the suite ===');
checkSuiteConsistency();

// ---------------------------------------------------------------------------
// 5. Scale
// ---------------------------------------------------------------------------

// The design target is ~10-20 nodes; 200 is a headroom check, not a sizing target
// (ROADMAP Task 146). What matters is that the dense Cholesky, chosen BECAUSE of
// that target, does not fall over well beyond it.
function gridNetwork(rows, cols) {
	const nodes = [{ id: 'R', type: 'reservoir', head: 150 }];
	const links = [];
	const id = (r, c) => `J${r}_${c}`;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			nodes.push({ id: id(r, c), type: 'junction', elev: 10 + (r % 3), demand: 0.002 });
		}
	}
	links.push({ id: 'SRC', type: 'pipe', from: 'R', to: id(0, 0), length: 200, diameter: 0.5, roughness: 130, k: 0, status: 'open' });
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (c + 1 < cols) { links.push({ id: `H${r}_${c}`, type: 'pipe', from: id(r, c), to: id(r, c + 1), length: 150, diameter: 0.2, roughness: 130, k: 0, status: 'open' }); }
			if (r + 1 < rows) { links.push({ id: `V${r}_${c}`, type: 'pipe', from: id(r, c), to: id(r + 1, c), length: 150, diameter: 0.2, roughness: 130, k: 0, status: 'open' }); }
		}
	}
	return { name: `grid-${rows}x${cols}`, method: 'hw', nodes, links };
}

function checkScale() {
	for (const [rows, cols] of [[4, 5], [10, 20]]) {
		const model = gridNetwork(rows, cols);
		const t0 = process.hrtime.bigint();
		let result;
		const runs = rows * cols <= 20 ? 200 : 20;
		for (let i = 0; i < runs; i++) { result = EngCalcs.lpnSolve(model); }
		const ms = Number(process.hrtime.bigint() - t0) / 1e6 / runs;
		const c = continuityResidual(model, result, 0.5);
		// Judge the residual RELATIVE to the flow the network actually carries. An
		// absolute threshold silently becomes a stricter test as the network grows,
		// which measures float64 rather than the solver.
		const totalFlow = model.nodes.reduce((s, n) => s + (n.demand || 0), 0);
		const tol = 1e-7 * totalFlow;
		report(result.converged && c.worst < tol,
			`${model.name}: ${model.nodes.length} nodes, ${model.links.length} links`,
			`${ms.toFixed(2)} ms/solve, ${result.iterations} iterations, ` +
			`continuity ${c.worst.toExponential(1)} m3/s`);
	}
}

console.log('\n=== 5. Scale (target is 10-20 nodes; 200 is headroom, not a target) ===');
checkScale();

console.log(`\n${checks - failures}/${checks} checks passed.`);
process.exit(failures === 0 ? 0 : 1);

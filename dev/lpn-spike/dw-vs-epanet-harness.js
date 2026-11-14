// Darcy-Weisbach, the built-in solver against the vendored EPANET -- run with:
//   node dev/lpn-spike/dw-vs-epanet-harness.js
//
// WHY THIS EXISTS (code audit 2026-11, F5/F6/S1). Hazen-Williams networks agreed with EPANET to 5 mm and
// Darcy-Weisbach ones did not: 1.4 % of head loss in laminar flow, 1 to 2.6 % between Re 2000 and 4000,
// 0.08 % in turbulent flow, each from a different cause. This holds the lot, with the model handed over as
// the page hands it (NO viscosity stated, so each engine's own default applies -- the case that went wrong):
//
//   1. the default viscosity is EPANET's 1.1e-5 ft2/s, defined once (EngCalcs.EPANET_VISCOS), and no
//      source file in js/ restates the water-at-20-degC 1.007e-6 that the built-in solver used to run on;
//   2. friction factor, branch for branch with hydcoeffs.c frictionFactor(): laminar, the transitional cubic
//      (whose y2 is evaluated at Re 4000, not at the actual Re), and Swamee-Jain;
//   3. EPANET's resistcoeff() uses g = 32.2 ft/s2 for a Darcy-Weisbach pipe, not 32.174;
//   4. one friction function (lpnDwFriction and bpnDwFriction ARE EngCalcs.dwFriction);
//   5. a steady solve, a period run and Hazen-Williams, each held to EPANET;
//   6. the steady solve CONVERGES in the transition. Its friction factor used to be frozen at the last
//      iteration's flow, and Dunlop's rises with flow there, so it overshot: 100 iterations, "not
//      converged", flows 0.5 % off. EPANET carries d(f)/dQ in the gradient, and so does the solve now.
//
// THE TOLERANCE, AND WHAT IS LEFT. After the three fixes the built-in head loss sits 0.0005 % above EPANET's
// in laminar flow and up to 0.002 % in the transition. That is not ours: EPANET converts litres per second
// with LperFT3 = 28.317 where the exact figure is 28.31685, which is 5.3e-6 on every flow, and head loss
// follows flow (once in laminar flow, about twice in turbulent flow, steeper in the cubic). So the bound is
// 5e-5 of the head loss developed (REL), which is 2.5 times the largest residual measured over the sweep and
// 1000 times smaller than the defects it replaced; ABS is EPANET's own head resolution at a 1e-5 accuracy.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-msx.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const cases = require('./cases.js');

const MODULE = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
const REL = 5e-5;     // of the head loss developed
const ABS = 5e-5;     // m
const FLOW_REL = 5e-5;
const FLOW_ABS = 2e-7;   // m3/s

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const epanet = (m) => EngCalcs.lpnSolveEpanet(Object.assign({}, m, { hydraulics: Object.assign({ accuracy: 1e-5 }, m.hydraulics || {}) }), { moduleUrl: MODULE });

// A small seeded generator, so a failure reproduces.
function rng(seed) {
	let s = seed >>> 0;
	return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

async function main() {
	const FT = 0.3048;

	// ---- 1. one default viscosity, EPANET's ----------------------------------------------------------------
	console.log('-- the default viscosity is EPANET\'s, defined once');
	ok('EngCalcs.EPANET_VISCOS is 1.1e-5 ft2/s in m2/s', Math.abs(EngCalcs.EPANET_VISCOS - 1.1e-5 * FT * FT) < 1e-18 && Math.abs(EngCalcs.EPANET_VISCOS - 1.0219e-6) < 1e-10, String(EngCalcs.EPANET_VISCOS));
	const pipeModel = (q, d, e, L) => ({
		name: 'pipe', method: 'dw',
		nodes: [{ id: 'R', type: 'reservoir', head: 2e5 }, { id: 'J', type: 'junction', elev: 0, demand: q }],
		links: [{ id: 'P', type: 'pipe', from: 'R', to: 'J', length: L, diameter: d, roughness: e, k: 0, status: 'open' }]
	});
	{
		const a = EngCalcs.lpnSolve(pipeModel(0.0004, 0.1, 0.00015, 500)), b = EngCalcs.lpnSolve(Object.assign(pipeModel(0.0004, 0.1, 0.00015, 500), { visc: 1.1e-5 * FT * FT }));
		ok('a model that states no viscosity solves on EPANET\'s', a.heads.J === b.heads.J, `${a.heads.J} vs ${b.heads.J}`);
		const c = EngCalcs.lpnSolve(Object.assign(pipeModel(0.0004, 0.1, 0.00015, 500), { visc: 1.007e-6 }));
		ok('...and not on the 1.007e-6 it used to', c.heads.J !== a.heads.J);
	}
	{
		const hits = [];
		fs.readdirSync(path.join(ROOT, 'js')).filter((f) => /\.js$/.test(f)).forEach((f) => {
			fs.readFileSync(path.join(ROOT, 'js', f), 'utf8').split('\n').forEach((ln, i) => {
				if (/1\.007e-?0?6/i.test(ln.replace(/\/\/.*$/, ''))) { hits.push(f + ':' + (i + 1)); }
			});
		});
		ok('no js/ file carries a second default viscosity (1.007e-6) in code', hits.length === 0, hits.join(' '));
		const nr = fs.readFileSync(path.join(ROOT, 'js', 'lpn-native-run.js'), 'utf8');
		ok('the built-in period run reads the shared ft2/s figure', /VISCOS\s*=\s*EC\.EPANET_VISCOS_FT2S/.test(nr));
	}

	console.log('-- one friction function');
	ok('lpnDwFriction is EngCalcs.dwFriction', EngCalcs.lpnDwFriction === EngCalcs.dwFriction);
	{
		const src = fs.readFileSync(path.join(ROOT, 'js', 'branched-network.js'), 'utf8');
		ok('bpnDwFriction is EngCalcs.dwFriction (branched-network.js carries no body of its own)', /EngCalcs\.bpnDwFriction\s*=\s*EngCalcs\.dwFriction;/.test(src));
	}

	// ---- 2/3. a single pipe, laminar to fully turbulent, each against EPANET ---------------------------------
	console.log('-- one pipe, Re 100 to 3e6 (laminar, transitional, Swamee-Jain), head loss against EPANET');
	{
		const nu = 1.1e-5 * FT * FT;   // EPANET types.h VISCOS, stated here independently of the code under test
		let n = 0, bad = [], worstRel = 0, worstAt = '';
		const byRegime = { laminar: 0, transitional: 0, turbulent: 0 };
		for (const d of [0.05, 0.1, 0.3]) {
			for (const e of [0.00005, 0.00015, 0.001]) {
				for (const re of [100, 500, 1500, 1990, 2100, 2500, 3000, 3500, 3900, 4100, 5000, 20000, 3e5, 3e6]) {
					const q = re * nu * d * Math.PI / 4, L = 1000, m = pipeModel(q, d, e, L);
					const nat = EngCalcs.lpnSolve(m), epa = await epanet(m);
					const hn = 2e5 - nat.heads.J, he = 2e5 - epa.heads.J, rel = Math.abs(hn - he) / he;
					byRegime[re <= 2000 ? 'laminar' : re < 4000 ? 'transitional' : 'turbulent']++;
					n++;
					if (rel > worstRel) { worstRel = rel; worstAt = `d=${d} e=${e} Re=${re}`; }
					if (Math.abs(hn - he) > REL * he + ABS) { bad.push(`d=${d} e=${e} Re=${re}: ${hn.toPrecision(7)} vs ${he.toPrecision(7)} (${((hn / he - 1) * 100).toFixed(4)} %)`); }
				}
			}
		}
		ok(`${n} pipes (${byRegime.laminar} laminar, ${byRegime.transitional} transitional, ${byRegime.turbulent} turbulent) agree to ${REL * 100} % of head loss`, bad.length === 0,
			`worst ${(worstRel * 100).toFixed(5)} % at ${worstAt}` + (bad.length ? '\n     ' + bad.slice(0, 6).join('\n     ') : ''));
	}

	// ---- 5a. random looped networks, flows from laminar to turbulent ----------------------------------------
	console.log('-- random Darcy-Weisbach networks, heads and flows against EPANET');
	{
		const rand = rng(20261114);
		let worstH = 0, worstQ = 0, bad = [], unconverged = [], regimes = { laminar: 0, transitional: 0, turbulent: 0 };
		const NETS = 40;
		for (let t = 0; t < NETS; t++) {
			// A ring of 6 to 9 nodes with two chords. Demand scale rotates through three decades, so the pipes
			// run laminar (0.05 L/s), transitional (a few L/s in 50 mm) and turbulent.
			const N = 6 + Math.floor(rand() * 4), scale = [0.05, 0.5, 4, 30][t % 4];
			const nodes = [{ id: 'R', type: 'reservoir', head: 500 }], links = [];
			const dia = () => [0.05, 0.08, 0.1, 0.15, 0.2, 0.3][Math.floor(rand() * 6)];
			const rough = () => [0.00003, 0.00015, 0.0005, 0.002][Math.floor(rand() * 4)];
			for (let i = 1; i <= N; i++) {
				nodes.push({ id: 'J' + i, type: 'junction', elev: Math.floor(rand() * 20), demand: (0.3 + rand()) * scale * 0.001 });
			}
			const link = (id, a, b) => links.push({ id, type: 'pipe', from: a, to: b, length: 100 + Math.floor(rand() * 700), diameter: dia(), roughness: rough(), k: 0, status: 'open' });
			link('P0', 'R', 'J1');
			for (let i = 1; i < N; i++) { link('P' + i, 'J' + i, 'J' + (i + 1)); }
			link('PA', 'J' + N, 'J1');
			link('PB', 'J2', 'J' + (N - 1));
			link('PC', 'J1', 'J' + Math.ceil(N / 2));
			const m = { name: 'rand' + t, method: 'dw', nodes, links };
			const nat = EngCalcs.lpnSolve(m), epa = await epanet(m);
			if (!nat.ok || !epa.ok) { bad.push(`net ${t}: ok native=${nat.ok} epanet=${epa.ok}`); continue; }
			if (!nat.converged || nat.iterations > 30) { unconverged.push(`net ${t}: ${nat.iterations} iterations, converged ${nat.converged}`); }
			let span = 0;
			nodes.forEach((n) => { span = Math.max(span, 500 - epa.heads[n.id]); });
			let dh = 0, dq = 0, qBig = 0;
			nodes.forEach((n) => { dh = Math.max(dh, Math.abs(nat.heads[n.id] - epa.heads[n.id])); });
			links.forEach((l) => {
				dq = Math.max(dq, Math.abs(nat.flows[l.id] - epa.flows[l.id])); qBig = Math.max(qBig, Math.abs(epa.flows[l.id]));
				const re = Math.abs(epa.flows[l.id]) * 4 / (Math.PI * l.diameter * 1.1e-5 * FT * FT);
				regimes[re <= 2000 ? 'laminar' : re < 4000 ? 'transitional' : 'turbulent']++;
			});
			worstH = Math.max(worstH, span > 0 ? dh / span : 0); worstQ = Math.max(worstQ, qBig > 0 ? dq / qBig : 0);
			if (dh > REL * span + ABS || dq > FLOW_REL * qBig + FLOW_ABS) { bad.push(`net ${t} (scale ${scale}): dH ${dh.toExponential(2)} m of ${span.toFixed(3)} m, dQ ${dq.toExponential(2)} of ${qBig.toExponential(2)}`); }
		}
		ok(`${NETS} networks agree: heads within ${REL * 100} % of the head lost, flows within ${FLOW_REL * 100} % of the largest`, bad.length === 0,
			`worst head ${(worstH * 100).toFixed(5)} %, worst flow ${(worstQ * 100).toFixed(5)} %; link flows ${regimes.laminar} laminar, ${regimes.transitional} transitional, ${regimes.turbulent} turbulent` + (bad.length ? '\n     ' + bad.slice(0, 5).join('\n     ') : ''));
		// The frozen-friction iteration this replaced ran 100 iterations and reported "not converged" in the transition.
		ok('every one converges, in 30 iterations or fewer', unconverged.length === 0, unconverged.slice(0, 4).join('; '));
		ok('the sweep really spans all three regimes', regimes.laminar > 20 && regimes.transitional > 5 && regimes.turbulent > 50, JSON.stringify(regimes));
	}

	// ---- 5b. the period run (the built-in loop) against EPANET's ------------------------------------------------
	console.log('-- a Darcy-Weisbach period run, the built-in loop against EPANET');
	{
		const H = 3600, LPS = 0.001;
		const DAY = [0.2, 0.2, 0.2, 0.3, 0.5, 1.0, 1.6, 2.0, 1.8, 1.4, 1.2, 1.1, 1.2, 1.3, 1.2, 1.1, 1.3, 1.8, 2.2, 2.0, 1.4, 0.8, 0.4, 0.2];
		const jn = (id, elev, q, p) => ({ id, type: 'junction', elev, demand: q * LPS, demandBase: q * LPS, demandPattern: p || null });
		const pipe = (id, a, b, L, d, e) => ({ id, type: 'pipe', from: a, to: b, length: L, diameter: d, roughness: e, k: 0, status: 'open' });
		const mk = (scale) => ({
			method: 'dw',
			nodes: [{ id: 'R', type: 'reservoir', elev: 80, head: 80, headBase: 80, headPattern: null }, jn('A', 10, 6 * scale, 'D'), jn('B', 12, 4 * scale, 'D'), jn('C', 8, 2 * scale, 'D'),
				{ id: 'T', type: 'tank', elev: 60, ground: 60, head: 64, level: 4, minLevel: 0.5, maxLevel: 12, diameter: 18 }],
			links: [pipe('P1', 'R', 'A', 1500, 0.15, 0.00015), pipe('P2', 'A', 'B', 600, 0.08, 0.0005), pipe('P3', 'B', 'C', 500, 0.06, 0.00005),
				pipe('P4', 'C', 'A', 700, 0.08, 0.0005), pipe('P5', 'B', 'T', 400, 0.1, 0.00015)],
			time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), { duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H }),
				patterns: [{ id: 'D', multipliers: DAY }], defaultPattern: null, controls: [], warnings: [] },
			hydraulics: { accuracy: 1e-5 }
		});
		// 0.4 scale keeps the small pipes laminar at night; 6 puts the same pipes well into turbulence.
		for (const scale of [0.4, 6]) {
			const epa = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(mk(scale)))), nat = EngCalcs.lpnNativeRun(mk(scale));
			if (!epa.ok || !nat.ok) { ok(`period run, demand scale ${scale}`, false, `ok epanet=${epa.ok} native=${nat.ok}`); continue; }
			let dh = 0, dq = 0, qBig = 0, span = 0, minRe = 1e9, maxRe = 0;
			nat.frames.forEach((f, i) => {
				const g = epa.frames[i];
				Object.keys(g.heads).forEach((id) => { dh = Math.max(dh, Math.abs(f.heads[id] - g.heads[id])); span = Math.max(span, 80 - g.heads[id]); });
				Object.keys(g.flows).forEach((id) => { dq = Math.max(dq, Math.abs(f.flows[id] - g.flows[id])); qBig = Math.max(qBig, Math.abs(g.flows[id])); });
				mk(scale).links.forEach((l) => { const re = Math.abs(g.flows[l.id]) * 4 / (Math.PI * l.diameter * 1.1e-5 * FT * FT); minRe = Math.min(minRe, re); maxRe = Math.max(maxRe, re); });
			});
			// A tank's level carries the clock's rounding (native-wire-harness.js), so the bound is the same
			// 0.8 mm that harness holds, not the steady one.
			ok(`period run, demand scale ${scale} (Re ${Math.round(minRe)} to ${Math.round(maxRe)}), ${nat.frames.length} frames`, nat.frames.length === epa.frames.length && dh <= 0.8e-3 + REL * span && dq <= FLOW_REL * qBig + 2e-6,
				`dH ${dh.toExponential(2)} m of ${span.toFixed(2)} m, dQ ${dq.toExponential(2)} of ${qBig.toExponential(2)}`);
		}
	}

	// ---- 5c. Hazen-Williams is unchanged ---------------------------------------------------------------------
	console.log('-- Hazen-Williams is unchanged');
	{
		const m = cases.twoLoopGrid;
		const a = EngCalcs.lpnSolve(m), b = EngCalcs.lpnSolve(Object.assign({}, m, { visc: 1.007e-6 })), c = EngCalcs.lpnSolve(Object.assign({}, m, { visc: 1e-3 }));
		const same = m.nodes.every((n) => a.heads[n.id] === b.heads[n.id] && a.heads[n.id] === c.heads[n.id]);
		ok('heads do not depend on viscosity or on the Darcy-Weisbach gravity (bit for bit)', same);
		const epa = await epanet(m);
		let dh = 0;
		m.nodes.forEach((n) => { dh = Math.max(dh, Math.abs(a.heads[n.id] - epa.heads[n.id])); });
		ok('...and agree with EPANET to the 2 mm the suite has always held', dh <= 2e-3, dh.toExponential(2) + ' m');
		// The hand-computed value of the first reach, EPANET's own constants: h = 4.727 L Q^1.852 / (C^1.852 d^4.871) in feet.
		const q = a.flows.L1, Lft = 300 / FT, dft = 0.35 / FT, qcfs = Math.abs(q) / Math.pow(FT, 3);
		const hand = 4.727 * Lft * Math.pow(qcfs, 1.852) / (Math.pow(130, 1.852) * Math.pow(dft, 4.871)) * FT;
		ok('the first reach\'s head loss is still 4.727 L Q^1.852 / (C^1.852 d^4.871)', Math.abs((120 - a.heads.A) - hand) < 1e-9 * Math.max(1, hand) + 1e-9,
			`${(120 - a.heads.A).toPrecision(10)} vs ${hand.toPrecision(10)}`);
	}

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

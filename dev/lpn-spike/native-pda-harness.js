// PRESSURE-DRIVEN DEMAND IN THE BUILT-IN SOLVER, HELD TO EPANET 2.3.5 (Task 733, PDA).
//
//   node dev/lpn-spike/native-pda-harness.js
//
// Single instants first (lpnSolve against lpnSolveEpanet), then periods (the built-in loop against the
// EPANET engine). Constructed networks where the pressure falls short of the required pressure, below the
// minimum, or never short; a node of zero and of negative demand; each of the three PDA numbers changed;
// and Net1 and Net3 as shipped, with PDA options and the demands scaled until the network starves.
// Tolerances: heads and pressures 2 mm, flows and delivered demands 0.002 L/s or 1e-5 of the largest flow.
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const { buildModel } = require('./net3-model.js');

const LPS = 0.001;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const copy = (m) => JSON.parse(JSON.stringify(m));
const pipe = (id, from, to, length, d) => ({ id, type: 'pipe', from, to, length, diameter: d, roughness: 130, k: 0, status: 'open' });
const jn = (id, elev, q) => ({ id, type: 'junction', elev, demand: q * LPS, demandBase: q * LPS, demandPattern: null });
function pdaModel(o) {
	return {
		method: 'hw', visc: 1.007e-6,
		nodes: o.nodes, links: o.links,
		hydraulics: Object.assign({ accuracy: 1e-5, demandModel: 'PDA' }, o.hyd || {}),
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), { duration: 0 }), patterns: [], defaultPattern: null, controls: [], warnings: [] }
	};
}
function gap(a, b) { let d = 0, at = ''; Object.keys(a).forEach((id) => { const x = Math.abs(a[id] - b[id]); if (!(x <= d)) { d = x; at = id; } }); return { d, at }; }

async function steady(name, m) {
	const e = await EngCalcs.lpnSolveEpanet(copy(m), { tol: 1e-5 }), n = EngCalcs.lpnSolve(copy(m), { tol: 1e-5 });
	if (!e.ok || !n.ok) { ok(name, false, `epanet ${e.ok} native ${n.ok} ${JSON.stringify(n.issues || e.issues)}`); return null; }
	const qmax = Math.max.apply(null, Object.keys(e.flows).map((k) => Math.abs(e.flows[k])).concat([0]));
	const qtol = Math.max(2e-6, 1e-5 * qmax);
	const gh = gap(e.heads, n.heads), gq = gap(e.flows, n.flows), gd = gap(e.demands, n.demands), gf = gap(e.demandDeficits, n.demandDeficits);
	const short = Object.keys(e.demandDeficits).filter((k) => e.demandDeficits[k] > 1e-6).length;
	ok(name, n.converged && gh.d <= 2e-3 && gq.d <= qtol && gd.d <= qtol && gf.d <= qtol,
		`heads ${(gh.d * 1000).toFixed(3)} mm @${gh.at}, flows ${(gq.d * 1000).toFixed(5)} L/s, demand ${(gd.d * 1000).toFixed(5)} L/s @${gd.at}, deficit ${(gf.d * 1000).toFixed(5)} L/s; ${short} short of demand; tol ${(qtol * 1000).toFixed(4)} L/s`);
	return { e, n, short };
}

async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const R = (h) => ({ id: 'R', type: 'reservoir', elev: h, head: h, headBase: h, headPattern: null });
	// A reservoir on a long, thin pipe to two junctions: the far one starves.
	const line = (q1, q2, hyd, h) => pdaModel({ hyd, nodes: [R(h || 60), jn('A', 20, q1), jn('B', 22, q2)],
		links: [pipe('P1', 'R', 'A', 3000, 0.15), pipe('P2', 'A', 'B', 2000, 0.1)] });
	console.log('-- single instants, constructed');
	let r = await steady('both junctions starve (Pmin 0, Preq 20, exponent 0.5)', line(25, 18, { minPressure: 0, reqPressure: 20, pressureExponent: 0.5 }));
	ok('...and the case really is short of demand', r && r.short === 2, r && String(r.short));
	await steady('exponent 1.5', line(25, 18, { minPressure: 0, reqPressure: 20, pressureExponent: 1.5 }));
	await steady('exponent 1 (linear)', line(25, 18, { minPressure: 2, reqPressure: 25, pressureExponent: 1 }));
	await steady('a minimum pressure of 5 m', line(15, 12, { minPressure: 5, reqPressure: 30, pressureExponent: 0.5 }));
	r = await steady('enough pressure: full demand everywhere', line(3, 2, { minPressure: 0, reqPressure: 10, pressureExponent: 0.5 }, 100));
	ok('...and nothing is short', r && r.short === 0);
	await steady('defaults (Pmin 0, Preq 0.1, exponent 0.5 when unstated)', line(25, 18, {}));
	await steady('the pressure falls under the minimum: a junction delivers nothing', line(30, 30, { minPressure: 25, reqPressure: 40, pressureExponent: 0.5 }, 70));
	{
		const m = line(25, 18, { minPressure: 0, reqPressure: 20, pressureExponent: 0.5 });
		m.nodes.push(jn('C', 21, 0)); m.nodes.push(jn('D', 21, -6));
		m.links.push(pipe('P3', 'A', 'C', 500, 0.1), pipe('P4', 'B', 'D', 500, 0.1));
		await steady('a junction of zero demand and one of negative demand (a supply)', m);
	}
	{
		const m = line(25, 18, { minPressure: 0, reqPressure: 20, pressureExponent: 0.5 });
		m.nodes.push({ id: 'T', type: 'tank', elev: 30, ground: 30, head: 36, level: 6, minLevel: 0.5, maxLevel: 12, diameter: 12 });
		m.links.push(pipe('P5', 'B', 'T', 800, 0.1));
		await steady('with a tank on the starved end', m);
	}
	{
		const m = line(25, 18, { minPressure: 0, reqPressure: 20, pressureExponent: 0.5 });
		m.nodes.push({ id: 'Q', type: 'junction', elev: 20, demand: 5 * LPS, demandBase: 5 * LPS, demandPattern: null, emitter: 0.0005 });
		m.links.push(pipe('P6', 'A', 'Q', 600, 0.1));
		await steady('a junction with an emitter as well as a demand', m);
	}

	console.log('-- single instants, EPA\'s examples with PDA options and the demands scaled');
	function load(file) {
		const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
		const m = buildModel(EngCalcs, parsed);
		delete m.time;
		return m;
	}
	for (const [file, mult, hyd] of [['Net1.inp', 3, { minPressure: 10, reqPressure: 80, pressureExponent: 0.5 }],
		['Net1.inp', 5, { minPressure: 5, reqPressure: 90, pressureExponent: 0.7 }],
		['Net3.inp', 1.3, { minPressure: 0, reqPressure: 60, pressureExponent: 0.5 }],
		['Net3.inp', 2, { minPressure: 3, reqPressure: 35, pressureExponent: 0.5 }]]) {
		const m = load(file);
		m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {}, hyd, { demandModel: 'PDA' });
		m.nodes.forEach((n) => { if (n.type === 'junction') { n.demand *= mult; if (n.demandBase !== undefined) { n.demandBase *= mult; } } });
		const rr = await steady(file.replace('.inp', '') + ', demands x' + mult + ', ' + JSON.stringify(hyd), m);
		ok('...and it is short of demand somewhere', rr && rr.short > 0, rr && String(rr.short));
	}

	console.log('-- periods: the built-in loop against the EPANET engine');
	{
		const H = 3600;
		function pm(file, mult, hyd, ctrl) {
			const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
			const m = buildModel(EngCalcs, parsed);
			m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {}, hyd, { demandModel: 'PDA' });
			m.nodes.forEach((n) => { if (n.type === 'junction') { n.demand *= mult; if (n.demandBase !== undefined) { n.demandBase *= mult; } if (n.demands) { n.demands.forEach((d) => { d.base *= mult; }); } } });
			if (!ctrl) { m.time.controls = m.time.controls; }
			return m;
		}
		for (const [file, mult, hyd] of [['Net1.inp', 2.5, { minPressure: 10, reqPressure: 80, pressureExponent: 0.5 }],
			['Net3.inp', 1.3, { minPressure: 0, reqPressure: 60, pressureExponent: 0.5 }]]) {
			const m = pm(file, mult, hyd);
			const E = await EngCalcs.lpnEpanetRun(copy(m)), N = EngCalcs.lpnNativeRun(copy(m));
			if (!E.ok || !N.ok) { ok(file + ' period', false, `epanet ${E.ok} native ${N.ok} ${JSON.stringify(N.issues || '')}`); continue; }
			let dh = 0, dq = 0, dd = 0, dtk = 0, qmax = 0, deficient = 0;
			E.frames.forEach((fe, i) => {
				const fn = N.frames[i];
				Object.keys(fe.heads).forEach((id) => { dh = Math.max(dh, Math.abs(fe.heads[id] - fn.heads[id])); });
				Object.keys(fe.flows).forEach((id) => { dq = Math.max(dq, Math.abs(fe.flows[id] - fn.flows[id])); qmax = Math.max(qmax, Math.abs(fe.flows[id])); });
				Object.keys(fe.demands || {}).forEach((id) => { dd = Math.max(dd, Math.abs(fe.demands[id] - fn.demands[id])); });
				Object.keys(fe.levels || {}).forEach((id) => { dtk = Math.max(dtk, Math.abs(fe.levels[id] - fn.levels[id])); });
				Object.keys(fe.demandDeficits || {}).forEach((id) => { if (fe.demandDeficits[id] > 1e-6) { deficient++; } });
			});
			const qt = Math.max(2e-6, 1e-5 * qmax);
			ok(file.replace('.inp', '') + ' period x' + mult + ' (' + E.frames.length + ' steps)', E.frames.length === N.frames.length && dh <= 8e-3 && dq <= Math.max(qt, 2e-5) && dd <= Math.max(qt, 2e-5) && dtk <= 8e-3 && deficient > 0,
				`heads ${(dh * 1000).toFixed(3)} mm, flows ${(dq * 1000).toFixed(4)} L/s, demands ${(dd * 1000).toFixed(4)} L/s, tank levels ${(dtk * 1000).toFixed(3)} mm; ${deficient} node-steps short`);
		}
	}
	console.log('-- water age over a starved period (the quality pass reads the delivered demand)');
	{
		const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', 'Net1.inp'), 'utf8'));
		const m = buildModel(EngCalcs, parsed);
		m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {}, { demandModel: 'PDA', minPressure: 10, reqPressure: 80, pressureExponent: 0.5 });
		m.nodes.forEach((n) => { if (n.type === 'junction') { n.demand *= 2.5; if (n.demandBase !== undefined) { n.demandBase *= 2.5; } } });
		m.quality = { mode: 'age' };
		const E = await EngCalcs.lpnEpanetRun(copy(m)), N = EngCalcs.lpnNativeRun(copy(m), { quality: true });
		let dn = 0, dl = 0, big = 0;
		if (E.ok && N.ok) {
			E.frames.forEach((fe, i) => {
				Object.keys(fe.qualities).forEach((id) => { dn = Math.max(dn, Math.abs(fe.qualities[id] - N.frames[i].qualities[id])); big = Math.max(big, fe.qualities[id]); });
				Object.keys(fe.linkQualities).forEach((id) => { dl = Math.max(dl, Math.abs(fe.linkQualities[id] - N.frames[i].linkQualities[id])); });
			});
		}
		ok('Net1 age, demands x2.5 under PDA: nodes within 2 s, links within 5 s of EPANET', E.ok && N.ok && big > 0 && dn <= 2 && dl <= 5, `nodes ${dn.toFixed(3)} s, links ${dl.toFixed(3)} s, largest age ${big.toFixed(0)} s`);
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });

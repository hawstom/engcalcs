// THE PAGE'S ENERGY SUMMARY COUNTS AS EPANET 2.3.5 COUNTS (Task 821).
//
//   node dev/lpn-spike/energy-count-harness.js
//
// The page's summary (EngCalcs.lpnEpanetRun(...).energy, what the Energy box shows) is held to EPANET's own
// energy block (the vendored engine run on the same .inp, its binary output read back: the harness truth
// in native-eps-energy-truth.js). What is counted: a pump is ON LINE while its status is open, which is
// when EPANET reads an efficiency above 0, whatever the flow; and a single instant (duration 0) counts as
// one hour. Cases: a steady-state network with a pump, Net3 as a run with patterns, a pump left open at
// zero flow, and a pump closed by a control for part of the run. Tolerances are the ones slice 6 used
// (native-eps-energy-truth.js), except that the page does not carry kWh per m3 (not compared) and cost is
// compared as cost per day.
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
const { buildModel } = require('./net3-model.js');
const T = require('./native-eps-energy-truth.js');

const LPS = 0.001, H = 3600;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

const pipe = (id, from, to, length, diameter, c) =>
	({ id, type: 'pipe', from, to, length, diameter, roughness: c || 130, k: 0, status: 'open' });
const jn = (id, elev, demandLps, pattern) => ({ id, type: 'junction', elev, demand: (demandLps || 0) * LPS,
	demandBase: (demandLps || 0) * LPS, demandPattern: pattern || null });
const reservoir = (id, head) => ({ id, type: 'reservoir', elev: head, head, headBase: head, headPattern: null });
const tank = (id, base, level, min, max, dia) => ({ id, type: 'tank', elev: base, ground: base, head: base + level,
	level, minLevel: min, maxLevel: max, diameter: dia });
const pat = (id, multipliers) => ({ id, multipliers });
const DAY = [0.2, 0.2, 0.2, 0.3, 0.5, 1.0, 1.6, 2.0, 1.8, 1.4, 1.2, 1.1, 1.2, 1.3, 1.2, 1.1, 1.3, 1.8, 2.2, 2.0, 1.4, 0.8, 0.4, 0.2];
function constructed(o) {
	return {
		method: 'hw', visc: 1.007e-6, nodes: o.nodes, links: o.links,
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), o.times), patterns: o.patterns || [],
			defaultPattern: null, controls: o.controls || [], warnings: [] }
	};
}
const pumpLink = (id, from, to, pts) => Object.assign({ id, type: 'pump', from, to, diameter: 0.3, status: 'open', k: 0 },
	EngCalcs.lpnPumpFromCurve(pts));
const ctl = (link, action, condition) => ({ link, action, condition });
const at = (h) => ({ kind: 'time', seconds: Math.round(h * H) });
function withEnergy(m, e) { m.energy = Object.assign({ effic: {}, price: {}, pattern: {} }, e); return m; }

// Low reservoir R -> pump PU -> J (pattern demand) -> P2 -> tank T.
function pumpedTank(o) {
	return constructed({
		nodes: [reservoir('R', 40), jn('J', 10, o.q === undefined ? 25 : o.q, 'D'), tank('T', 60, 3, 0.5, 10, 15)],
		links: [Object.assign(pumpLink('PU', 'R', 'J', [[0, 70], [0.06, 55], [0.12, 20]]), { status: 'open' }),
			pipe('P2', 'J', 'T', 800, 0.25)],
		patterns: [pat('D', DAY)],
		controls: o.controls || [],
		times: Object.assign({ duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H }, o.times || {})
	});
}
// A pump into a dead end: a closed junction pair with no demand and no tank, so the pump is OPEN at zero flow.
function deadEnd(o) {
	return constructed({
		nodes: [reservoir('R', 40), jn('J', 10, 0), jn('K', 10, 0)],
		links: [pumpLink('PU', 'R', 'J', [[0, 70], [0.06, 55], [0.12, 20]]), pipe('P2', 'J', 'K', 400, 0.2)],
		times: Object.assign({ duration: 6 * H, hydraulicStep: H, patternStep: H, reportStep: H }, o.times || {})
	});
}
function loadNet3() {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', 'Net3.inp'), 'utf8'));
	const m = buildModel(EngCalcs, parsed);
	m.energy = EngCalcs.lpnEnergyParse(parsed.inpSections.ENERGY || []);
	return m;
}

// The page's summary against EPANET's block. The page keeps the run's kWh and cost, not per-day figures.
async function compare(name, model, expect) {
	model.hydraulics = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	await T.engine(EngCalcs);
	const run = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)), { sliceMs: 100000 });
	if (!run.ok) { ok(name, false, 'page run: ' + JSON.stringify(run.issues || run.report || '')); return; }
	const n = run.energy, t = (await T.truth(EngCalcs, model)).bin;
	if (!n || !t || n.pumps.length !== t.pumps.length) { ok(name, false, 'no energy block / pumps listed differ'); return; }
	const days = (run.duration > 0 ? run.duration : H) / 86400;   // EPANET's cost per day divides by the counted time
	let good = true, detail = '';
	const maxKw = t.pumps.reduce((a, r) => Math.max(a, r.peakKw), 0);
	n.pumps.forEach((r, i) => {
		const w = t.pumps[i];
		const rows = [['usage', r.usage, w.usage, T.USAGE_TOL, T.USAGE_TOL],
			['avgEfficiency', r.avgEfficiency, w.avgEfficiency, T.EFF_REL, 1e-6],
			['avgKw', r.avgKw, w.avgKw, T.REL_TOL, T.REL_TOL * maxKw],
			['peakKw', r.peakKw, w.peakKw, T.REL_TOL, T.REL_TOL * maxKw],
			['cost/day', r.cost / days, w.costPerDay, T.REL_TOL, T.REL_TOL * Math.max(w.costPerDay, 1e-9)]];
		rows.forEach((x) => {
			if (!(Math.abs(x[1] - x[2]) <= Math.max(x[3] * Math.abs(x[2]), x[4]))) { good = false; detail += ` ${r.id}.${x[0]} ${x[1]} vs ${x[2]};`; }
		});
	});
	if (expect) { const e = expect(n, t); if (e !== true) { good = false; detail += ' NOT EXERCISED: ' + e; } }
	ok(name, good, '[' + n.pumps.map((r) => r.id + ' ' + (r.usage * 100).toFixed(2) + '% on, ' + r.avgKw.toFixed(2) + ' kW avg, ' + (r.avgEfficiency * 100).toFixed(1) + '% eff').join('; ') + ']' + detail);
}

async function main() {
	const priced = { globalPrice: 0.1 };
	await compare('a single instant with a pump (duration 0): EPANET adds one hour', withEnergy(pumpedTank({ times: { duration: 0 } }), priced),
		(n) => (Math.abs(n.pumps[0].onSeconds - H) < 1e-6 && n.pumps[0].usage === 1 ? true : 'on ' + n.pumps[0].onSeconds + ', usage ' + n.pumps[0].usage));
	{
		const m = loadNet3();
		await compare('Net3 as a run with its patterns and controls (EPA: pump 10 on 58.33 percent of the day)', m,
			(n) => (Math.abs(n.pumps[0].usage * 100 - 58.33) < 0.01 ? true : 'usage ' + n.pumps[0].usage));
		const p = loadNet3(); p.energy.globalPrice = 0.12;
		await compare('Net3, priced', p);
	}
	await compare('a pump open at zero flow (no demand, a dead end): on line all six hours', withEnergy(deadEnd({}), priced),
		(n) => (n.pumps[0].usage > 0.999 ? true : 'usage ' + n.pumps[0].usage));
	await compare('a pump closed by a control from 6 h to 18 h', withEnergy(pumpedTank({ q: 12,
		controls: [ctl('PU', { status: 'closed' }, at(6)), ctl('PU', { status: 'open' }, at(18))] }), priced),
		(n) => (n.pumps[0].usage > 0.4 && n.pumps[0].usage < 0.6 ? true : 'usage ' + n.pumps[0].usage));
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(2); });

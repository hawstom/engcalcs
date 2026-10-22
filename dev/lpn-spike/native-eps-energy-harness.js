// THE BUILT-IN SOLVER'S PUMP ENERGY, HELD TO EPANET'S OWN ENERGY REPORT (Task 733, phase 3, slice 6).
//
//   node dev/lpn-spike/native-eps-energy-harness.js
//
// The truth here is NOT the page's own energy figure (js/lpn-epanet.js lpnEnergySummary, which adds up
// EN_ENERGY samples and decides "on line" from the power). It is what EPANET 2.3.5 itself accumulates in
// addenergy() and states in its report: the vendored engine is run on the same model's .inp, the hydraulics
// are solved and saved, and the energy block of its binary output file (output.c saveenergy(): per pump
// usage %, efficiency %, kWh per m3, average kW, peak kW and cost per day, then the demand charge) is read
// back. That block is single precision (7 digits), four more than the report prints. The first case also
// parses the report text itself and checks the binary against it, so the reader is held to the report.
//
// WHAT IS COMPARED, per pump: usage factor, average efficiency, kWh per m3, average kW, peak kW, cost per
// day; and the demand charge and the totals line. And the native loop's own totals (kWh, cost over the run).
//
// TOLERANCES and why: native-eps-energy-truth.js (measured worst: 1.2e-5 of usage, 7e-5 of anything else).
//
// CASES. Net3 (its two pumps; with the file's own [ENERGY], then with a global price, a price pattern, a
// per-pump price and price pattern, a demand charge, an efficiency curve and a different global efficiency),
// constructed networks (a pump on an efficiency curve; one that is off part of the day by a timer; a speed
// pattern on a pump with and without an efficiency curve, where the speed enters the efficiency; a pump
// switched by a rule; a pump shut by a tank-level control and by XHEAD; a stated SPEED 0; two pumps whose
// peaks fall apart, for the demand charge on the peak of the SUM; a price pattern on a 2 h step starting at
// 1 h; specific gravity; a single instant, where EPANET adds one hour), and Net1 with its controls and rules.
// Then the refusals.

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
const H = 3600;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

const T = require('./native-eps-energy-truth.js');
const engine = () => T.engine(EngCalcs);
const truth = (model, wantReport) => T.truth(EngCalcs, model, wantReport);

// ---- constructed networks (the same builders as native-eps-harness.js) --------------------------------
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
		method: 'hw', visc: 1.007e-6,
		nodes: o.nodes, links: o.links,
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), o.times), patterns: o.patterns || [],
			defaultPattern: null, controls: [], warnings: [] }
	};
}
const ctl = (link, action, condition) => ({ link, action, condition });
const at = (h) => ({ kind: 'time', seconds: Math.round(h * H) });
const ifNode = (node, cmp, value) => ({ kind: 'node', node, cmp, value });
const OPEN_ = { status: 'open' }, SHUT = { status: 'closed' };
const pumpLink = (id, from, to, pts) => Object.assign({ id, type: 'pump', from, to, diameter: 0.3, status: 'open', k: 0 },
	EngCalcs.lpnPumpFromCurve(pts));
function pageLikePump(l, speed, speedPattern) {
	l.h0Base = l.h0; l.aBase = l.a; l.statusBase = l.status;
	l.speed = speed === undefined ? 1 : speed;
	l.speedPattern = speedPattern || null;
	return l;
}
// Low reservoir R (40 m) -> pump PU -> J (pattern demand) -> P2 -> tank T at 60 m. P3 is a second supply a
// control can open.
function pumpedTank(o) {
	const m = constructed({
		nodes: [reservoir('R', 40), reservoir('R2', 75), jn('J', 10, o.q || 25, 'D'), tank('T', 60, o.level || 3, 0.5, o.max || 10, o.dia || 15)],
		links: [Object.assign(pumpLink('PU', 'R', 'J', [[0, 70], [0.06, 55], [0.12, 20]]), { status: o.pu || 'open' }),
			pipe('P2', 'J', 'T', 800, 0.25),
			Object.assign(pipe('P3', 'R2', 'J', 2000, 0.25), { status: o.p3 || 'open' })],
		patterns: [pat('D', DAY)],
		times: Object.assign({ duration: 48 * H, hydraulicStep: H, patternStep: H, reportStep: H }, o.times || {})
	});
	m.time.controls = o.controls || [];
	return m;
}
function patternedPump(o) {
	const m = pumpedTank(Object.assign({ p3: 'closed' }, o));
	if (o.mults) { m.time.patterns.push(pat('S', o.mults)); }
	pageLikePump(m.links.find((l) => l.id === 'PU'), o.speed, o.mults ? 'S' : null);
	return m;
}
const SPD = [1, 1, 0.9, 0.85, 0.8, 0.9, 1, 1.1, 1.15, 1.2, 1.1, 1, 1, 0.95, 0.9, 0.95, 1, 1.1, 1.2, 1.15, 1.05, 1, 0.95, 0.9];
// An efficiency curve, flow in m3/s and efficiency in percent, as docEnergy() hands it to both engines.
const EFFIC = [[0, 20], [0.02, 55], [0.05, 74], [0.08, 80], [0.12, 62]];
function withEnergy(m, e) { m.energy = Object.assign({ effic: {}, price: {}, pattern: {} }, e); return m; }
function withRules(m, text, convert) {
	const linkOf = (id) => m.links.find((l) => String(l.id) === String(id));
	const kindOf = (c) => {
		const l = linkOf(c.id);
		if (!l) { return 'none'; }
		if (l.type === 'pipe') { return 'roughness'; }
		if (l.type !== 'valve') { return 'none'; }
		const vt = String(l.valveType || 'TCV').toUpperCase();
		return vt === 'PRV' || vt === 'PSV' || vt === 'PBV' ? 'pressure' : vt === 'FCV' ? 'flow' : 'none';
	};
	const conv = convert || ((v, kind) => (kind === 'flow' ? v / 1000 : v));
	const blocks = EngCalcs.lpnRuleParse(text.trim().split('\n').map((x) => x.trim()));
	blocks.forEach((b) => { if (!b.ok) { throw new Error('rule ' + b.name + ' is not read by the page grammar'); } });
	m.rules = blocks.map((b) => EngCalcs.lpnRuleConvert(b, conv, kindOf));
	return m;
}
function loadEpa(file, stripped) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	const m = buildModel(EngCalcs, parsed);
	if (stripped) { m.time.controls = []; }
	m.energy = EngCalcs.lpnEnergyParse(parsed.inpSections.ENERGY || []);
	return { model: m, parsed };
}
// A price pattern: cheap at night, dear in the evening.
const TARIFF = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4, 2, 2, 2, 1.4, 1, 0.8, 0.5];

// ---- the comparison -----------------------------------------------------------------------------------
async function compare(c) {
	if (process.env.ONLY && c.name.indexOf(process.env.ONLY) < 0) { return; }
	const model = c.model;
	model.hydraulics = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	const nat = EngCalcs.lpnNativeRun(model);
	if (!nat.ok) { ok(c.name, false, 'native: ' + JSON.stringify(nat.issues || '')); return; }
	if (process.env.DUMPQ) {
		const e = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
		e.frames.slice(0, 3).forEach((f) => console.log(f.t / H + 'h', model.links.filter((l) => l.type === 'pump').map((l) => l.id + ' q=' + f.flows[l.id] + ' dh=' + (f.heads[l.to] - f.heads[l.from])).join(' ')));
	}
	const tr = await truth(model);
	const t = tr.bin, n = nat.energy;
	if (!n || !t) { ok(c.name, false, 'no energy block'); return; }
	if (n.pumps.length !== t.pumps.length || n.pumps.some((r, i) => r.id !== t.pumps[i].id)) {
		ok(c.name, false, 'pumps listed: native ' + n.pumps.map((r) => r.id) + ' / EPANET ' + t.pumps.map((r) => r.id));
		return;
	}
	const df = T.diff(n, t), worst = df.worst;
	let good = df.good, detail = df.detail;
	// what the case says it exercises
	let why = '';
	if (c.offGrid) {   // a rule ended a step between hydraulic steps: the loop solved at a time off the hourly grid
		const off = (nat.solveTimes || []).filter((x) => x % H !== 0).length;
		if (!off) { good = false; why += ' NOT EXERCISED: no solve off the hourly grid'; }
		else { why += ` ${off} solves off the hourly grid`; }
	}
	if (c.expect) {
		const e = c.expect(n, t);
		if (e !== true) { good = false; why = ' NOT EXERCISED: ' + e; }
	}
	ok(c.name, good, `${n.pumps.length} pump${n.pumps.length === 1 ? '' : 's'}  worst: usage ${worst.usage.toExponential(1)}, eff ${worst.avgEfficiency.toExponential(1)}, ` +
		`kWh/m3 ${worst.kwhPerM3.toExponential(1)}, avg kW ${worst.avgKw.toExponential(1)}, peak kW ${worst.peakKw.toExponential(1)}, cost ${worst.costPerDay.toExponential(1)}` +
		`  [${n.pumps.map((r) => r.id + ' ' + (r.usage * 100).toFixed(2) + '% ' + r.avgKw.toFixed(2) + ' kW ' + (r.avgEfficiency * 100).toFixed(1) + '%').join(', ')}` +
		(t.demandCharge ? `; demand ${t.demandCharge.toFixed(2)}` : '') + ']' + detail + why);
	return { n, t };
}

// expectations: a case must show the feature, so a case that quietly stopped using it fails
const used = (id, lo, hi) => (n) => { const r = n.pumps.find((x) => x.id === id); return r && r.usage > lo && r.usage < hi ? true : `${id} usage ${r && r.usage}`; };
const costs = (n) => (n.totalCostPerDay > 0 ? true : 'no cost');
const both = (...f) => (n, t) => { for (const g of f) { const v = g(n, t); if (v !== true) { return v; } } return true; };
const notAt75 = (id) => (n) => { const r = n.pumps.find((x) => x.id === id); return Math.abs(r.avgEfficiency - 0.75) > 0.01 ? true : `${id} efficiency stayed ${r.avgEfficiency}`; };
const demand = (n) => (n.demandCharge > 0 ? true : 'no demand charge');

async function run() {
	await engine();

	console.log('-- the reader of EPANET\'s binary energy block, held to the report text');
	{
		const { model } = loadEpa('Net3.inp', false);
		const tr = await truth(model, true);
		const rp = tr.report, b = tr.bin;
		ok('Net3: the report lists the two pumps', rp && rp.pumps.length === 2 && b.pumps.length === 2);
		if (rp) {
			let worst = 0;
			rp.pumps.forEach((r, i) => ['usage', 'avgEfficiency', 'kwhPerM3', 'avgKw', 'peakKw', 'costPerDay'].forEach((k) => {
				// the report prints 2 decimals (usage and efficiency as percent)
				const half = (k === 'usage' || k === 'avgEfficiency') ? 0.005 / 100 : 0.005;
				worst = Math.max(worst, Math.abs(r[k] - b.pumps[i][k]) / half);
			}));
			ok('Net3: the binary block agrees with every number the report prints, to the report\'s own rounding', worst <= 1.0001, `worst ${worst.toFixed(3)} of a unit in the last printed digit`);
		}
	}

	console.log('-- Net3 (EPA): its own [ENERGY], then priced');
	{
		const a = loadEpa('Net3.inp', false);
		await compare({ name: 'Net3 with its controls, [ENERGY] as the file states it (price 0, efficiency 75)', model: a.model,
			expect: both(used('10', 0.5, 0.65), used('335', 0.25, 0.32)) });
		// the page's own published anchor (energy-anchor-harness.js, Net3.rpt): 58.33 and 28.74 percent
		const nat = EngCalcs.lpnNativeRun(a.model).energy;
		ok('Net3: usage 58.33 and 28.74 percent, average kW 62.06 and 309.38, as EPA\'s Net3.rpt prints',
			Math.abs(nat.pumps[0].usage * 100 - 58.33) < 0.005 && Math.abs(nat.pumps[1].usage * 100 - 28.74) < 0.005 &&
			Math.abs(nat.pumps[0].avgKw - 62.06) < 0.005 && Math.abs(nat.pumps[1].avgKw - 309.38) < 0.005,
			nat.pumps.map((r) => (r.usage * 100).toFixed(3) + '% ' + r.avgKw.toFixed(3)).join(' | '));
		const priced = (e) => { const x = loadEpa('Net3.inp', false); x.model.time.patterns.push(pat('TARIFF', TARIFF)); x.model.energy = Object.assign({}, x.model.energy, e); return x.model; };
		await compare({ name: 'Net3, a global price of 0.12', model: priced({ globalPrice: 0.12 }), expect: costs });
		await compare({ name: 'Net3, a global price, a global price pattern', model: priced({ globalPrice: 0.12, globalPattern: 'TARIFF' }), expect: costs });
		await compare({ name: 'Net3, a demand charge of 8.5 per kW (levied on the peak of the SUM of the two pumps)', model: priced({ globalPrice: 0.1, demandCharge: 8.5 }),
			expect: both(costs, demand, (n) => (n.demandCharge < 8.5 * n.pumps.reduce((a, r) => a + r.peakKw, 0) * 0.999 ? true : 'the peaks coincided')) });
		await compare({ name: 'Net3, pump 335 with its own price and its own price pattern, pump 10 on the global ones',
			model: priced({ globalPrice: 0.12, globalPattern: 'TARIFF', price: { 335: 0.2 }, pattern: { 335: 'TARIFF' }, demandCharge: 3 }), expect: both(costs, demand) });
		await compare({ name: 'Net3, a pump price of 0.2 on pump 10 only, no global price', model: priced({ price: { 10: 0.2 } }), expect: costs });
		await compare({ name: 'Net3, global efficiency 62', model: priced({ globalEfficiency: 62, globalPrice: 0.1 }), expect: both(costs, notAt75('10')) });
		await compare({ name: 'Net3, an efficiency curve on pump 335 and 80 percent on pump 10', model: priced({ globalEfficiency: 80, globalPrice: 0.1, effic: { 335: 'E1' },
			efficCurves: { E1: [[0, 30], [0.1, 60], [0.2, 78], [0.3, 82], [0.4, 70]] } }), expect: both(costs, notAt75('335')) });
		await compare({ name: 'Net3 with no [ENERGY] at all (EPANET\'s default 75 percent, price 0)', model: (() => { const x = loadEpa('Net3.inp', false); delete x.model.energy; return x.model; })() });
		await compare({ name: 'Net3, controls stripped (both pumps on all day), priced', model: (() => { const x = loadEpa('Net3.inp', true); x.model.energy.globalPrice = 0.1; return x.model; })(), expect: costs });
	}

	console.log('-- constructed: an efficiency curve, and a pump that is off part of the day');
	await compare({ name: 'a pump on an efficiency curve, 48 h, priced', model: withEnergy(pumpedTank({ level: 4, q: 22 }),
		{ globalPrice: 0.09, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }), expect: both(costs, notAt75('PU')) });
	await compare({ name: 'the same pump at a constant 68 percent', model: withEnergy(pumpedTank({ level: 4, q: 22 }), { globalEfficiency: 68, globalPrice: 0.09 }), expect: costs });
	await compare({ name: 'a pump off by a timer from 6 h to 20 h, then on again (usage well under 100 percent)', model: withEnergy(pumpedTank({ level: 4, q: 12, p3: 'open',
		controls: [ctl('PU', SHUT, at(6)), ctl('PU', OPEN_, at(20)), ctl('PU', SHUT, at(30)), ctl('PU', OPEN_, at(44))],
		times: { duration: 48 * H } }), { globalPrice: 0.1, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }), expect: both(costs, used('PU', 0.3, 0.8)) });
	await compare({ name: 'a tank control holds a pump off above 8 m (the pump cycles; a 30 min report step)', model: withEnergy(pumpedTank({ level: 5, q: 15, max: 12,
		controls: [ctl('PU', SHUT, ifNode('T', 'above', 8)), ctl('PU', OPEN_, ifNode('T', 'below', 4))], times: { reportStep: H / 2 } }),
		{ globalPrice: 0.1 }), expect: both(costs, used('PU', 0.01, 0.9)) });

	console.log('-- constructed: speed patterns (the speed enters the efficiency curve), XHEAD, SPEED 0');
	await compare({ name: 'a speed pattern on a pump with an efficiency curve (Sarbu and Borza speed adjustment)', model: withEnergy(patternedPump({ level: 4, mults: SPD }),
		{ globalPrice: 0.1, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }), expect: both(costs, notAt75('PU')) });
	await compare({ name: 'a speed pattern, global efficiency only', model: withEnergy(patternedPump({ level: 4, mults: SPD }), { globalPrice: 0.1 }), expect: costs });
	await compare({ name: 'a speed pattern that stops the pump at night (usage under 100 percent)', model: withEnergy(patternedPump({ level: 6, q: 15,
		mults: [0, 0, 0, 0, 0, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 0, 0] }), { globalPrice: 0.1, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }),
		expect: both(costs, used('PU', 0.5, 0.95)) });
	await compare({ name: 'a pattern too slow to lift (XHEAD) for hours: no energy then', model: withEnergy(patternedPump({ level: 4, q: 10,
		mults: [1, 1, 0.55, 0.55, 0.55, 1, 1, 1, 0.5, 0.5, 1, 1] }), { globalPrice: 0.1 }), expect: both(costs, used('PU', 0.3, 0.97)) });
	await compare({ name: 'a stated SPEED 0 (open, no flow) beside a second supply, with an efficiency curve', model: withEnergy(patternedPump({ level: 5, q: 8, speed: 0, p3: 'open' }),
		{ globalPrice: 0.1, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }) });
	await compare({ name: 'a stated SPEED 0.85, no pattern, with an efficiency curve', model: withEnergy(patternedPump({ level: 4, speed: 0.85 }),
		{ globalPrice: 0.1, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }), expect: both(costs, notAt75('PU')) });

	console.log('-- constructed: rules, specific gravity, two pumps, price pattern clock, a single instant');
	await compare({ name: 'a pump switched by a rule on the tank level (a step ends between hydraulic steps)', model: withEnergy(withRules((() => { const m = pumpedTank({ level: 5, q: 45, max: 12, dia: 8 }); m.time.patterns.push(pat('TARIFF', TARIFF)); return m; })(),
		'RULE A\nIF TANK T LEVEL ABOVE 8\nTHEN PUMP PU STATUS IS CLOSED\nRULE B\nIF TANK T LEVEL BELOW 4\nTHEN PUMP PU STATUS IS OPEN'), { globalPrice: 0.1, globalPattern: 'TARIFF', demandCharge: 5 }),
		offGrid: true, expect: both(costs, demand, used('PU', 0.05, 0.95)) });
	{
		const m = pumpedTank({ level: 5, q: 15, max: 12 }); m.time.patterns.push(pat('TARIFF', TARIFF));
		await compare({ name: 'the same, with a rule on a clock window and a price pattern', model: withEnergy(withRules(m,
			'RULE A\nIF SYSTEM CLOCKTIME >= 6 AM\nAND SYSTEM CLOCKTIME < 8 PM\nTHEN PUMP PU STATUS IS OPEN\nELSE PUMP PU STATUS IS CLOSED'), { globalPrice: 0.1, globalPattern: 'TARIFF' }), expect: both(costs, used('PU', 0.2, 0.7)) });
	}
	{
		const m = pumpedTank({ level: 4, q: 22 }); m.hydraulics = { specificGravity: 1.25 };
		await compare({ name: 'specific gravity 1.25 scales the power', model: withEnergy(m, { globalPrice: 0.1 }), expect: costs });
		const m1 = withEnergy(pumpedTank({ level: 4, q: 22 }), { globalPrice: 0.1 }), r1 = EngCalcs.lpnNativeRun(m1), r2 = EngCalcs.lpnNativeRun(withEnergy(m, { globalPrice: 0.1 }));
		ok('...by 1.25 in the native loop', Math.abs(r2.energy.pumps[0].avgKw / r1.energy.pumps[0].avgKw - 1.25) < 0.01, (r2.energy.pumps[0].avgKw / r1.energy.pumps[0].avgKw).toFixed(4));
	}
	{
		// two pumps on opposite 12 h shifts: the demand charge is on the peak of the SUM, not the sum of the peaks
		const m = constructed({
			nodes: [reservoir('R', 0), jn('JA', 0, 50, 'SWAP'), jn('JB', 0, 50, 'SWAPB')],
			links: [pumpLink('PA', 'R', 'JA', [[0, 60], [0.05, 50], [0.1, 20]]), pumpLink('PB', 'R', 'JB', [[0, 60], [0.05, 50], [0.1, 20]])],
			patterns: [pat('SWAP', [].concat(new Array(12).fill(1), new Array(12).fill(0.2))), pat('SWAPB', [].concat(new Array(12).fill(0.2), new Array(12).fill(1)))],
			times: { duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H }
		});
		m.nodes[0].elev = 0;
		await compare({ name: 'two pumps on opposite shifts: demand charge on the peak of the sum', model: withEnergy(m, { globalPrice: 0.1, demandCharge: 9 }), expect: demand });
	}
	{
		const m = pumpedTank({ level: 4, q: 22, times: { duration: 36 * H, patternStep: 2 * H, patternStart: H, hydraulicStep: H } });
		m.time.patterns.push(pat('TARIFF', TARIFF.slice(0, 7)));
		await compare({ name: 'a price pattern of 7 periods on a 2 h pattern step starting at 1 h (period index wraps)', model: withEnergy(m, { globalPrice: 0.1, globalPattern: 'TARIFF', price: { PU: 0.15 } }), expect: costs });
	}
	{
		const m = pumpedTank({ level: 4, q: 22, times: { duration: 0 } });
		await compare({ name: 'a single instant (duration 0): EPANET counts one hour', model: withEnergy(m, { globalPrice: 0.1, demandCharge: 4, effic: { PU: 'E1' }, efficCurves: { E1: EFFIC } }),
			expect: (n) => (Math.abs(n.pumps[0].onSeconds - 3600) < 1e-6 ? true : 'on ' + n.pumps[0].onSeconds) });
	}
	{
		// the duration is not a multiple of the report step, and a report step shorter than the hydraulic step
		const m = pumpedTank({ level: 4, q: 22, times: { duration: 10 * H + 600, reportStep: 1800, hydraulicStep: H } });
		await compare({ name: 'a duration that is not a whole number of hours, a 30 min report step', model: withEnergy(m, { globalPrice: 0.1 }), expect: costs });
	}

	console.log('-- Net1 with its controls and the gallery rules');
	{
		const text = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net1.lwn'), 'utf8')).rules.join('\n');
		const a = loadEpa('Net1.inp', false);
		a.model.time.patterns.push(pat('TARIFF', TARIFF));
		a.model.energy = Object.assign({}, a.model.energy, { globalPrice: 0.11, globalPattern: 'TARIFF', demandCharge: 6 });
		await compare({ name: 'Net1 with its controls, priced (pump 9)', model: a.model, expect: both(costs, demand) });
		const b = loadEpa('Net1.inp', true);
		b.model.time.patterns.push(pat('TARIFF', TARIFF));
		b.model.energy = Object.assign({}, b.model.energy, { globalPrice: 0.11, globalPattern: 'TARIFF', demandCharge: 6 });
		// Net1 is a US file: the rules' levels are feet, the model is metres.
		withRules(b.model, text, (v, kind) => (kind === 'head' || kind === 'pressure' ? v * 0.3048 : kind === 'flow' ? v / 1000 : v));
		await compare({ name: 'Net1 with the gallery rules in place of its controls, priced (pump 9)', model: b.model, expect: both(costs, demand) });
		const c = loadEpa('Net1.inp', false);
		c.model.energy = Object.assign({}, c.model.energy, { globalPrice: 0.11, effic: { 9: 'E9' }, efficCurves: { E9: [[0, 40], [0.02, 65], [0.04, 78], [0.06, 70], [0.1, 40]] } });
		withRules(c.model, text, (v, kind) => (kind === 'head' || kind === 'pressure' ? v * 0.3048 : kind === 'flow' ? v / 1000 : v));
		await compare({ name: 'Net1 with its controls AND the gallery rules, pump 9 on an efficiency curve', model: c.model, expect: both(costs, notAt75('9')) });
	}

	refusals();
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}

function refusals() {
	console.log('-- refusals (the caller falls back to EPANET)');
	const base = () => withEnergy(pumpedTank({ level: 4, q: 22 }), { globalPrice: 0.1 });
	const refuse = (name, mut, id) => {
		const m = base(); mut(m);
		const r = EngCalcs.lpnNativeRun(m);
		ok('refuses ' + name, r.ok === false && r.refused === true && r.frames === undefined &&
			r.issues.some((i) => i.code === 'native-run-energy' && (!id || i.ids.indexOf(id) >= 0)), JSON.stringify(r.issues || ''));
	};
	refuse('a global price pattern the model lacks (EPANET error 205)', (m) => { m.energy.globalPattern = 'NOPE'; }, 'Global Pattern');
	refuse('a pump price pattern the model lacks', (m) => { m.energy.pattern = { PU: 'NOPE' }; }, 'PU');
	refuse('a negative global price (error 217)', (m) => { m.energy.globalPrice = -0.1; }, 'Global Price');
	refuse('a negative pump price', (m) => { m.energy.price = { PU: -1 }; }, 'PU');
	refuse('a negative demand charge (error 213)', (m) => { m.energy.demandCharge = -2; }, 'Demand Charge');
	refuse('a global efficiency of 0 (error 217)', (m) => { m.energy.globalEfficiency = 0; }, 'Global Efficiency');
	refuse('an efficiency curve whose flows do not increase (error 230)', (m) => { m.energy.effic = { PU: 'E1' }; m.energy.efficCurves = { E1: [[0, 30], [0.05, 70], [0.05, 60]] }; }, 'PU');
	{
		const m = base();
		ok('energy stated on a model with a pump is no longer refused', !EngCalcs.lpnNativeRunRefusals(m).some((r) => r.code === 'native-run-energy'));
		m.energy.effic = { PU: 'GONE' };   // a curve the document does not carry: no EFFIC row is written, the global efficiency applies
		ok('a pump naming an efficiency curve with no points runs at the global efficiency, as the bridge writes it', !EngCalcs.lpnNativeRunRefusals(m).some((r) => r.code === 'native-run-energy'));
	}
	{
		// the model without a pump has no energy answer, as the page's run has none
		const m = constructed({ nodes: [reservoir('R', 80), jn('J', 10, 10)], links: [pipe('P1', 'R', 'J', 500, 0.2)], times: { duration: 6 * H } });
		const r = EngCalcs.lpnNativeRun(m);
		ok('a network with no pump returns energy: null', r.ok && r.energy === null);
	}
	{
		// the shape: every field the page's own energy summary has is on the native one
		const r = EngCalcs.lpnNativeRun(withEnergy(pumpedTank({ level: 4, q: 22 }), { globalPrice: 0.1 }));
		const page = EngCalcs.lpnEnergySummary(EngCalcs.lpnEnergyAccInit(['PU']), { duration: 48 * H });
		const top = Object.keys(page), rowKeys = Object.keys(page.pumps[0] || {});
		const row = EngCalcs.lpnEnergySummary((() => { const a = EngCalcs.lpnEnergyAccInit(['PU']); EngCalcs.lpnEnergyAccumulate(a, { PU: { kw: 5, effic: 0.7, price: 0.1 } }, 3600); return a; })(), { duration: 3600 }).pumps[0];
		ok('the energy result has every field the page\'s own energy summary has, top level and per pump',
			top.every((k) => k in r.energy) && Object.keys(row).every((k) => k in r.energy.pumps[0]), 'extra fields: ' + Object.keys(r.energy.pumps[0]).filter((k) => !(k in row)).join(', ') + ' (pump); ' + Object.keys(r.energy).filter((k) => top.indexOf(k) < 0).join(', ') + ' (top)');
		void rowKeys;
	}
	{
		// the page does not call this file. js/lpn-time.js must still send every period run to EPANET.
		const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-time.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
		ok('nothing a visitor loads calls lpnNativeRun yet', !/lpnNativeRun\b/.test(src));
	}
}

run().catch((e) => { console.error(e); process.exit(2); });

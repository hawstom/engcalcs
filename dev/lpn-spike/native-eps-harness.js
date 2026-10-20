// THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, HELD TO EPANET'S OWN ANSWER (Task 733, phase 3, slice 1).
//
//   node dev/lpn-spike/native-eps-harness.js
//
// Every case is run twice from the SAME model: by EngCalcs.lpnNativeRun (js/lpn-native-run.js, the
// built-in solver walking the clock) and by EngCalcs.lpnEpanetRun (the vendored EPANET 2.3.5
// engine, runH()/nextH()). At EVERY reporting step, every node head, every tank level and every
// link flow must agree, and the two must report the same steps.
//
// THE CASES. Constructed networks that exercise what the slice owns: a tank that fills and drains
// on a demand pattern, one that FILLS TO ITS LIMIT and one that EMPTIES to its (the tank-full and
// tank-empty closure, and the step shortened to land exactly on the limit), a reservoir on a head
// pattern, a report step shorter than the hydraulic step, a pattern step that is not the report
// step, and demand categories. Then EPA's Net1, Net2 and Net3. Net2 has no controls. Net1 and Net3
// DO have [CONTROLS] (Net1: pump 9 on tank 2's level; Net3: pumps on tank 1, pump 10 on the
// clock), and controls are a later slice, so those two are run WITH THEIR CONTROLS STRIPPED, for
// both engines alike: a pump then stays in its initial state all day and the tanks run to a
// limit, which is a harder test of the tank logic than the controlled day, not an easier one.
// The stripped copy is stated in each case's name.
//
// EVERY CASE MUST EXERCISE WHAT IT NAMES: a tank case asserts that EPANET's own tank reached the
// limit (or moved at least a stated amount), so a case that quietly stopped moving a tank fails
// instead of passing on a flat line.
//
// THE REFUSALS. A network the slice cannot run (a control, a rule, a speed pattern, a volume
// curve, water quality, pump energy) must come back refused by name and run nothing, so the caller
// falls back to EPANET.
//
// TOLERANCE is native-valve-harness.js's: 0.8 mm of head (and of tank level), 0.002 L/s of flow or
// 1e-5 of the largest flow, with both engines at Accuracy 1e-5 (EPANET's floor), so a difference is
// never one engine stopping early. EPANET keeps heads in single precision. The tolerance is not
// loosened to make a case pass: a gap is reported with its numbers.

'use strict';

const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const { buildModel } = require('./net3-model.js');

const HEAD_TOL = 0.8e-3;    // m (also the tank level)
const FLOW_TOL = 2e-6;      // m3/s
const FLOW_REL = 1e-5;      // of the largest flow
const LPS = 0.001;
const H = 3600;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

// ---- constructed networks ----------------------------------------------------------------------
const pipe = (id, from, to, length, diameter, c) =>
	({ id, type: 'pipe', from, to, length, diameter, roughness: c || 130, k: 0, status: 'open' });
const jn = (id, elev, demandLps, pattern) => ({ id, type: 'junction', elev, demand: (demandLps || 0) * LPS,
	demandBase: (demandLps || 0) * LPS, demandPattern: pattern || null });
const reservoir = (id, head, pattern) => ({ id, type: 'reservoir', elev: head, head, headBase: head, headPattern: pattern || null });
const tank = (id, base, level, min, max, dia) => ({ id, type: 'tank', elev: base, ground: base, head: base + level,
	level, minLevel: min, maxLevel: max, diameter: dia });
const pat = (id, multipliers) => ({ id, multipliers });

function constructed(o) {
	return {
		method: 'hw', visc: 1.007e-6,
		nodes: o.nodes, links: o.links,
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), o.times), patterns: o.patterns || [],
			defaultPattern: null, controls: [], warnings: [] }
	};
}
// R (100 m) -> P1 -> J (30 L/s on a pattern) -> P2 -> T. A tank on a pipe fills when the demand is
// light and drains when it is heavy.
const DAY = [0.2, 0.2, 0.2, 0.3, 0.5, 1.0, 1.6, 2.0, 1.8, 1.4, 1.2, 1.1, 1.2, 1.3, 1.2, 1.1, 1.3, 1.8, 2.2, 2.0, 1.4, 0.8, 0.4, 0.2];
function lineWithTank(o) {
	return constructed({
		nodes: [reservoir('R', o.rHead || 80, o.rPattern), jn('J', 10, o.q || 30, 'D'),
			tank('T', 60, o.level, o.min, o.max, o.dia)],
		links: [pipe('P1', 'R', 'J', 1200, 0.3), pipe('P2', 'J', 'T', 800, 0.25)],
		patterns: [pat('D', DAY), pat('RH', o.rhm || [1])],
		times: o.times || { duration: 48 * H, hydraulicStep: H, patternStep: H, reportStep: H }
	});
}

const CASES = [
	{ name: 'tank on a demand pattern, 48 h', model: lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }), moves: 'T', minSwing: 0.5 },
	{ name: 'tank fills to its limit and stays full', model: lineWithTank({ level: 2, min: 0.5, max: 3, dia: 10, q: 12 }), reaches: 'max' },
	{ name: 'tank empties to its limit and stays empty', model: lineWithTank({ level: 2, min: 0.5, max: 12, dia: 10, q: 30, rHead: 60.2 }), reaches: 'min' },
	{ name: 'reservoir on a head pattern', model: lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18, rPattern: 'RH',
		rhm: [1, 1, 0.97, 0.94, 0.9, 0.9, 0.94, 0.98, 1.02, 1.04, 1.04, 1.02] }), moves: 'T', minSwing: 0.5 },
	{ name: 'report step 30 min, hydraulic step 1 h, pattern step 2 h', model: lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18,
		times: { duration: 24 * H, hydraulicStep: H, patternStep: 2 * H, reportStep: H / 2 } }), moves: 'T', minSwing: 0.5 },
	{ name: 'pattern step 45 min, report step 1 h, pattern start 30 min', model: lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18,
		times: { duration: 24 * H, hydraulicStep: H, patternStep: 2700, patternStart: 1800, reportStep: H } }), moves: 'T', minSwing: 0.5 },
	{ name: 'report start 6 h', model: lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18,
		times: { duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H, reportStart: 6 * H } }), moves: 'T', minSwing: 0.5 },
	{ name: 'two demand categories on two patterns', model: (() => {
		const m = lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 });
		const j = m.nodes.find((n) => n.id === 'J');
		j.demands = [{ base: 15 * LPS, pattern: 'D' }, { base: 10 * LPS, pattern: 'RH' }];
		m.time.patterns.find((p) => p.id === 'RH').multipliers = [0.5, 1.5];
		return m;
	})(), moves: 'T', minSwing: 0.5 }
];

// ---- EPA's examples ------------------------------------------------------------------------------
function loadEpa(file, stripped) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	const m = buildModel(EngCalcs, parsed);
	if (stripped) { m.time.controls = []; }
	return { model: m, hadControls: parsed.controls.length };
}

const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

async function compare(c) {
	const model = c.model;
	model.hydraulics = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	const epa = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	const nat = EngCalcs.lpnNativeRun(model);
	if (!epa.ok || !nat.ok) {
		ok(c.name, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || ''));
		return;
	}
	const sameSteps = epa.frames.length === nat.frames.length &&
		epa.frames.every((f, i) => f.t === nat.frames[i].t);
	let dH = 0, atH = '', dL = 0, atL = '', dQ = 0, atQ = '', qMax = 0, unconv = 0;
	const tankIds = model.nodes.filter((n) => n.type === 'tank').map((n) => n.id);
	const range = {}; tankIds.forEach((id) => { range[id] = { lo: Infinity, hi: -Infinity }; });
	if (sameSteps) {
		epa.frames.forEach((fe, i) => {
			const fn = nat.frames[i];
			if (fn.converged === false) { unconv++; }
			for (const n of model.nodes) {
				const d = Math.abs(fn.heads[n.id] - fe.heads[n.id]);
				if (d > dH) { dH = d; atH = n.id + '@' + fe.t / H + 'h'; }
				if (n.type === 'tank') {
					const dl = Math.abs(fn.levels[n.id] - fe.levels[n.id]);
					if (dl > dL) { dL = dl; atL = n.id + '@' + fe.t / H + 'h'; }
					range[n.id].lo = Math.min(range[n.id].lo, fe.levels[n.id]);
					range[n.id].hi = Math.max(range[n.id].hi, fe.levels[n.id]);
				}
			}
			for (const l of model.links) {
				qMax = Math.max(qMax, Math.abs(fe.flows[l.id]));
				const d = Math.abs(fn.flows[l.id] - fe.flows[l.id]);
				if (d > dQ) { dQ = d; atQ = l.id + '@' + fe.t / H + 'h'; }
			}
		});
	}
	const qTol = Math.max(FLOW_TOL, FLOW_REL * qMax);
	let exercised = true, why = '';
	if (c.moves) {
		const sw = range[c.moves === '*' ? tankIds[0] : c.moves].hi - range[c.moves === '*' ? tankIds[0] : c.moves].lo;
		exercised = sw >= c.minSwing; why = `swing ${sw.toFixed(2)} m`;
	}
	if (c.reaches) {
		const tk = model.nodes.find((n) => n.type === 'tank');
		const want = c.reaches === 'max' ? tk.maxLevel : tk.minLevel;
		const lim = tankIds.map((id) => epa.frames.filter((f) => Math.abs(f.levels[id] - want) < 1e-6).length)[0];
		exercised = lim >= 3; why = `${lim} frames at the ${c.reaches}`;
	}
	ok(c.name, sameSteps && dH <= HEAD_TOL && dL <= HEAD_TOL && dQ <= qTol && unconv === 0 && exercised,
		`steps ${nat.frames.length}/${epa.frames.length}${sameSteps ? '' : ' DIFFER'}  ` +
		`dH=${dH.toExponential(2)} m @${atH}  dLevel=${dL.toExponential(2)} m @${atL || '-'}  ` +
		`dQ=${dQ.toExponential(2)} m3/s @${atQ} (tol ${qTol.toExponential(1)})` +
		(unconv ? ` ${unconv} UNCONVERGED` : '') + (c.moves || c.reaches ? `  [${why}${exercised ? '' : ' NOT EXERCISED'}]` : ''));
}

async function run() {
	await EngCalcs.lpnEpanetLoad(MODULE_URL);
	console.log('-- constructed networks');
	for (const c of CASES) { await compare(c); }

	console.log('-- EPA examples (Net1 and Net3 with their [CONTROLS] stripped, for both engines)');
	const n2 = loadEpa('Net2.inp', false);
	ok('Net2 has no controls', n2.hadControls === 0);
	await compare({ name: 'Net2, 55 h', model: n2.model, moves: '*', minSwing: 0.5 });
	const n1 = loadEpa('Net1.inp', true);
	ok('Net1 had controls to strip', n1.hadControls === 2);
	await compare({ name: 'Net1, controls stripped, 24 h', model: n1.model, moves: '*', minSwing: 0.5 });
	const n3 = loadEpa('Net3.inp', true);
	ok('Net3 had controls to strip', n3.hadControls === 6);
	await compare({ name: 'Net3, controls stripped, 24 h', model: n3.model, moves: '*', minSwing: 0.5 });

	console.log('-- refusals (the caller falls back to EPANET)');
	const base = () => JSON.parse(JSON.stringify(CASES[0].model));
	const refusal = (name, mut, code) => {
		const m = base(); mut(m);
		const r = EngCalcs.lpnNativeRun(m);
		ok('refuses ' + name, r.ok === false && r.refused === true && r.frames === undefined &&
			r.issues.some((i) => i.code === code), JSON.stringify(r.issues || ''));
	};
	refusal('a simple control', (m) => { m.time.controls = [{ link: 'P1', action: { status: 'closed' }, condition: { kind: 'timer', seconds: 3600 } }]; }, 'native-run-controls');
	refusal('rules', (m) => { m.rules = [{ id: 'R1' }]; }, 'native-run-rules');
	refusal('a pump on a speed pattern', (m) => { m.links.push({ id: 'PU', type: 'pump', from: 'R', to: 'J', speedPattern: 'D', h0: 50, a: 1, b: 2 }); }, 'native-run-speed-pattern');
	refusal('a tank on a volume curve', (m) => { m.nodes.find((n) => n.id === 'T').volCurveName = 'V1'; }, 'native-run-volume-curve');
	refusal('water quality', (m) => { m.quality = { mode: 'age' }; }, 'native-run-quality');
	refusal('a tank starting above its maximum', (m) => { m.nodes.find((n) => n.id === 'T').level = 99; }, 'native-run-tank-levels');
	{
		const m = base(); m.hydraulics = { demandModel: 'PDA', minPressure: 0, reqPressure: 20 };
		const r = EngCalcs.lpnNativeRun(m);
		ok('a pressure-driven demand model is refused by name (lpnDiagnose)', r.ok === false && (r.issues || []).some((i) => i.code === 'pda-needs-epanet'), JSON.stringify(r.issues || ''));
	}
	{
		// The page does not call this file. js/lpn-time.js must still send every period run to EPANET.
		const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-time.js'), 'utf8') + fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
		ok('nothing a visitor loads calls lpnNativeRun yet', !/lpnNativeRun\b/.test(src));
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });

// THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, HELD TO EPANET'S OWN ANSWER (Task 733, phase 3, slices 1-2).
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
// SLICE 2, SIMPLE CONTROLS. Net1 and Net3 again WITH their [CONTROLS], and constructed cases for
// each kind: AT TIME and AT CLOCKTIME (with a start clock, wrapping past midnight), a tank level
// ABOVE and BELOW, a junction's pressure (decided inside the solve), a pump's speed, a pipe shut by
// a setting of 0, PRV/PSV/FCV/TCV/PBV settings and fixed OPEN/CLOSED, two controls on one link at
// one moment, and controls that fall INSIDE an hourly step (the step is cut to land on them). A
// case naming a link asserts EPANET's own frames show it shut or open at the hours it names (or
// switching at least as often as it says), and that both engines report the same status for it at
// every step. dev/lpn-spike/native-eps-examples-harness.js does the same for the shipped gallery.
//
// EVERY CASE MUST EXERCISE WHAT IT NAMES: a tank case asserts that EPANET's own tank reached the
// limit (or moved at least a stated amount), so a case that quietly stopped moving a tank fails
// instead of passing on a flat line.
//
// THE REFUSALS. A network the slices cannot run (a rule, a speed pattern, a volume curve, water
// quality, pump energy, a control on a reservoir, a junction-pressure control on a valve) must come
// back refused by name and run nothing, so the caller falls back to EPANET.
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

// ---- slice 2: simple controls ([CONTROLS]) on constructed networks --------------------------------
// Each control kind on its own, a control crossing INSIDE a hydraulic step (the step is cut to land
// on it, hydraul.c controltimestep()), and two controls firing on one link at one moment (the later
// one in the file wins, hydraul.c controls()). `ctl` builds the model's own control record, the shape
// js/lpn-time.js's lpnTimeModelBlock hands both engines.
const ctl = (link, action, condition) => ({ link, action, condition });
const at = (h) => ({ kind: 'time', seconds: Math.round(h * H) });
const clock = (h) => ({ kind: 'clocktime', seconds: Math.round(h * H) });
const ifNode = (node, cmp, value) => ({ kind: 'node', node, cmp, value });
const OPEN_ = { status: 'open' }, SHUT = { status: 'closed' };
const pumpLink = (id, from, to, pts) => Object.assign({ id, type: 'pump', from, to, diameter: 0.3, status: 'open', k: 0 },
	EngCalcs.lpnPumpFromCurve(pts));
// Low reservoir R (40 m) -> pump PU -> J (pattern demand) -> P2 -> tank T at 60 m. The pump fills
// the tank, the demand drains it. P3 is a second supply, from a high reservoir R2 (75 m), that a
// control can open; `pu: 'closed'` starts the pump shut.
function pumpedTank(o) {
	const m = constructed({
		nodes: [reservoir('R', 40), reservoir('R2', 75), jn('J', 10, o.q || 25, 'D'), tank('T', 60, o.level || 3, 0.5, o.max || 10, o.dia || 15)],
		links: [Object.assign(pumpLink('PU', 'R', 'J', [[0, 70], [0.06, 55], [0.12, 20]]), { status: o.pu || 'open' }),
			pipe('P2', 'J', 'T', 800, 0.25),
			Object.assign(pipe('P3', 'R2', 'J', 2000, 0.25), { status: o.p3 || 'open' })],
		patterns: [pat('D', DAY)],
		times: Object.assign({ duration: 48 * H, hydraulicStep: H, patternStep: H, reportStep: H }, o.times || {})
	});
	m.time.controls = o.controls;
	return m;
}
// R (80 m) -> P1 -> J -> V (a valve) -> K (demand) -> P2 -> tank T. A valve control acts on V.
function valveLine(vt, setting, controls, dia) {
	const m = constructed({
		nodes: [reservoir('R', 100), jn('J', 10, 5, 'D'), jn('K', 5, 20, 'D'), tank('T', 50, 4, 0.5, 12, 15)],
		links: [pipe('P1', 'R', 'J', 1200, 0.3), { id: 'V', type: 'valve', valveType: vt, from: 'J', to: 'K',
			diameter: dia || 0.25, setting, k: 0, length: 0, roughness: 130, status: 'open' }, pipe('P2', 'K', 'T', 800, 0.25)],
		patterns: [pat('D', DAY)],
		times: { duration: 24 * H, hydraulicStep: H, patternStep: H, reportStep: H }
	});
	m.time.controls = controls;
	return m;
}
const CONTROL_CASES = [
	{ name: 'AT TIME: a pipe shut at 5:00 and opened at 9:30 (inside an hourly step)',
		model: (() => { const m = lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 });
			m.time.controls = [ctl('P1', SHUT, at(5)), ctl('P1', OPEN_, at(9.5))]; return m; })(),
		statusOf: 'P1', closedAt: [6, 7, 8, 9], openAt: [4, 10] },
	{ name: 'AT CLOCKTIME, starting 6 AM: shut 13:15, open 2:40 (wraps past midnight), 48 h',
		model: (() => { const m = lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 });
			m.time.times.startClock = 6 * H;
			m.time.controls = [ctl('P1', SHUT, clock(13.25)), ctl('P1', OPEN_, clock(2 + 40 / 60))]; return m; })(),
		statusOf: 'P1', closedAt: [8, 10, 32], openAt: [7, 21, 31] },
	{ name: 'tank level: pump off ABOVE 8 m, on BELOW 2 m (crossings inside steps)',
		model: pumpedTank({ level: 3, controls: [ctl('PU', SHUT, ifNode('T', 'above', 8)), ctl('PU', OPEN_, ifNode('T', 'below', 2))], p3: 'closed' }),
		statusOf: 'PU', switches: 2 },
	{ name: 'tank level: second supply pipe opened BELOW 4 m and shut ABOVE 6 m, pump off',
		model: pumpedTank({ level: 5, q: 8, pu: 'closed', p3: 'closed', controls: [ctl('P3', OPEN_, ifNode('T', 'below', 4)), ctl('P3', SHUT, ifNode('T', 'above', 6))] }),
		statusOf: 'P3', switches: 4 },
	// At 30:00 the tank is full and has shut P2, so the timer's shutting P3 cuts J off; its head
	// collapses inside the solve, the pressure control re-opens P3 at once, and EPANET's frames show
	// P3 open all along. Matching that needs the full tank's shut P2 carried into the next solve, as
	// EPANET carries it (lpnSolve `tempClosed`).
	{ name: 'junction pressure: second supply opened when J falls BELOW 53 m (decided inside the solve), shut at 30:00 and re-opened by it',
		model: pumpedTank({ level: 5, q: 8, pu: 'closed', p3: 'closed', controls: [ctl('P3', OPEN_, ifNode('J', 'below', 53)), ctl('P3', SHUT, at(30))] }),
		statusOf: 'P3', switches: 1, openAt: [12, 30, 40] },
	{ name: 'junction pressure: pump shut when J rises ABOVE 80 m, back on when the tank falls BELOW 7 m',
		model: pumpedTank({ level: 5, q: 25, p3: 'closed', controls: [ctl('PU', SHUT, ifNode('J', 'above', 80)), ctl('PU', OPEN_, ifNode('T', 'below', 7))] }),
		statusOf: 'PU', switches: 2 },
	{ name: 'pump speed: 0.8 at 3:00, 1.15 when the tank falls BELOW 3 m, OPEN (speed 1) at 20:00',
		model: pumpedTank({ level: 4, controls: [ctl('PU', { setting: 0.8 }, at(3)), ctl('PU', { setting: 1.15 }, ifNode('T', 'below', 3)), ctl('PU', OPEN_, at(20))], p3: 'closed' }),
		moves: 'T', minSwing: 0.5 },
	{ name: 'pipe by number: setting 0 shuts it at 4:00, setting 1 opens it at 7:00',
		model: (() => { const m = lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 });
			m.time.controls = [ctl('P1', { setting: 0 }, at(4)), ctl('P1', { setting: 1 }, at(7))]; return m; })(),
		statusOf: 'P1', closedAt: [4, 5, 6], openAt: [3, 7] },
	{ name: 'tie: OPEN then CLOSED on one link at 6:00, the later line wins',
		model: (() => { const m = lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 });
			m.time.controls = [ctl('P1', OPEN_, at(6)), ctl('P1', SHUT, at(6)), ctl('P1', OPEN_, at(11))]; return m; })(),
		statusOf: 'P1', closedAt: [6, 10], openAt: [5, 11] },
	{ name: 'PRV: setting 20 m at 4:00, 35 m at 9:00, fixed OPEN at 14:00, CLOSED at 18:00, 25 m at 21:00',
		model: valveLine('PRV', 30, [ctl('V', { setting: 20, settingUnit: 'press' }, at(4)), ctl('V', { setting: 35, settingUnit: 'press' }, at(9)),
			ctl('V', OPEN_, at(14)), ctl('V', SHUT, at(18)), ctl('V', { setting: 25, settingUnit: 'press' }, at(21))]),
		statusOf: 'V', closedAt: [18, 20], openAt: [17] },
	{ name: 'PSV: setting 60 m at 5:00, fixed OPEN at 12:00, back to 45 m at 17:00',
		model: valveLine('PSV', 45, [ctl('V', { setting: 60, settingUnit: 'press' }, at(5)), ctl('V', OPEN_, at(12)), ctl('V', { setting: 45, settingUnit: 'press' }, at(17))]),
		moves: 'T', minSwing: 0.1 },
	{ name: 'FCV: 15 L/s at 3:00, 40 L/s when the tank falls BELOW 3 m, fixed OPEN at 16:00',
		model: valveLine('FCV', 0.025, [ctl('V', { setting: 0.015, settingUnit: 'flow' }, at(3)), ctl('V', { setting: 0.04, settingUnit: 'flow' }, ifNode('T', 'below', 3)), ctl('V', OPEN_, at(16))]),
		moves: 'T', minSwing: 0.5 },
	// A 400 mm TCV and small coefficients: EPANET's minor loss uses g rounded to 32.2 ft/s2 (its
	// 0.02517, input1.c), which alone moves a big loss by millimetres -- a gap of the minor-loss
	// formula, not of the controls (native-pbv-gpv-harness.js keeps its k small for the same reason).
	{ name: 'TCV (400 mm): loss coefficient 4 at 2:00, fixed OPEN at 10:00, CLOSED ABOVE 9 m, 2 BELOW 7 m',
		model: valveLine('TCV', 1, [ctl('V', { setting: 4 }, at(2)), ctl('V', OPEN_, at(10)), ctl('V', SHUT, ifNode('T', 'above', 9)), ctl('V', { setting: 2 }, ifNode('T', 'below', 7))], 0.4),
		moves: 'T', minSwing: 0.5 },
	{ name: 'PBV: 8 m at 3:00, CLOSED at 12:00, OPEN at 15:00',
		model: valveLine('PBV', 4, [ctl('V', { setting: 8, settingUnit: 'press' }, at(3)), ctl('V', SHUT, at(12)), ctl('V', OPEN_, at(15))]),
		statusOf: 'V', closedAt: [12, 14], openAt: [11, 15] }
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
	// A controlled link must be in the state the case names at the hours it names, in EPANET's own
	// frames (so the case exercises the control), and the native frames must agree with EPANET's
	// statuses for it at every step.
	let stDiff = 0;
	if (c.statusOf && sameSteps) {
		const st = (fr, h) => { const f = fr.find((x) => x.t === h * H); return f && f.statuses[c.statusOf]; };
		(c.closedAt || []).forEach((h) => { if (st(epa.frames, h) !== 'closed') { exercised = false; why += ` not closed @${h}h`; } });
		(c.openAt || []).forEach((h) => { if (st(epa.frames, h) !== 'open') { exercised = false; why += ` not open @${h}h`; } });
		let sw = 0;
		epa.frames.forEach((f, i) => {
			if (i && f.statuses[c.statusOf] !== epa.frames[i - 1].statuses[c.statusOf]) { sw++; }
			if (f.statuses[c.statusOf] !== nat.frames[i].statuses[c.statusOf]) { stDiff++; }
		});
		if (c.switches && sw < c.switches) { exercised = false; }
		why += `${why ? '; ' : ''}${c.statusOf} switched ${sw}x`;
	}
	ok(c.name, sameSteps && dH <= HEAD_TOL && dL <= HEAD_TOL && dQ <= qTol && unconv === 0 && exercised && stDiff === 0,
		`steps ${nat.frames.length}/${epa.frames.length}${sameSteps ? '' : ' DIFFER'}  ` +
		`dH=${dH.toExponential(2)} m @${atH}  dLevel=${dL.toExponential(2)} m @${atL || '-'}  ` +
		`dQ=${dQ.toExponential(2)} m3/s @${atQ} (tol ${qTol.toExponential(1)})` +
		(unconv ? ` ${unconv} UNCONVERGED` : '') + (stDiff ? ` ${stDiff} STATUS DIFFERENCES` : '') +
		(c.moves || c.reaches || c.statusOf ? `  [${why}${exercised ? '' : ' NOT EXERCISED'}]` : ''));
	return { dH, dL, dQ };
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

	console.log('-- slice 2: simple controls, constructed');
	for (const c of CONTROL_CASES) { await compare(c); }
	console.log('-- slice 2: EPA\'s Net1 and Net3 WITH their [CONTROLS]');
	const n1c = loadEpa('Net1.inp', false);
	await compare({ name: 'Net1 with its controls, 24 h (pump 9 on tank 2)', model: n1c.model, statusOf: '9', switches: 2 });
	const n3c = loadEpa('Net3.inp', false);
	await compare({ name: 'Net3 with its controls, 24 h (pump 10 on the clock; 335 and 330 on tank 1)', model: n3c.model, statusOf: '10', openAt: [1, 14], closedAt: [0, 15] });
	await compare({ name: 'Net3 with its controls: pump 335 / bypass 330', model: loadEpa('Net3.inp', false).model, statusOf: '335', switches: 1 });

	console.log('-- refusals (the caller falls back to EPANET)');
	const base = () => JSON.parse(JSON.stringify(CASES[0].model));
	const refusal = (name, mut, code) => {
		const m = base(); mut(m);
		const r = EngCalcs.lpnNativeRun(m);
		ok('refuses ' + name, r.ok === false && r.refused === true && r.frames === undefined &&
			r.issues.some((i) => i.code === code), JSON.stringify(r.issues || ''));
	};
	refusal('a control conditioned on a reservoir', (m) => { m.time.controls = [{ link: 'P1', action: { status: 'closed' }, condition: { kind: 'node', node: 'R', cmp: 'below', value: 1 } }]; }, 'native-run-control-unsupported');
	refusal('a junction-pressure control on a valve', (m) => {
		m.links.push({ id: 'V9', type: 'valve', valveType: 'PRV', from: 'J', to: 'T', diameter: 0.2, setting: 20, k: 0, length: 0, status: 'open' });
		m.time.controls = [{ link: 'V9', action: { status: 'closed' }, condition: { kind: 'node', node: 'J', cmp: 'below', value: 20 } }];
	}, 'native-run-control-unsupported');
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

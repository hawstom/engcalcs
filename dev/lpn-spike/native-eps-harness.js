// THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, HELD TO EPANET'S OWN ANSWER (Task 733, phase 3, slices 1-4).
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
// SLICE 3, PUMP SPEED PATTERNS. A pump on a pattern is given the page's own model of it (the curve
// at speed 1 as h0Base/aBase beside its stated speed and pattern, as assembleModel() hands it), and
// constructed cases cover: a pattern alone, one with zeros (the pump off), a pump stated Closed that
// its pattern opens, a control that shuts a patterned pump and the next step's pattern re-opening
// it, a tank control that holds one off, a junction-pressure control on one, a pattern step that is
// not the hydraulic step, a stated SPEED the pattern discards, a pattern too slow to lift (EPANET's
// XHEAD), and a stated SPEED 0 (open, no flow). Then EPA-side: pattern-attach.inp (the suite's own
// speed-pattern fixture) and Net3 with a speed pattern added to pump 335, and to pump 10 (stated
// Closed, under its two timers), with Net3's controls.
//
// SLICE 4, [RULES]. Rules are written as the page's text, read by lpn-rules.js and converted to SI by
// the same call assembleModel() makes (head and pressure in metres, a flow in L/s here), so the model
// carries `rules` as the page hands them to both engines. Constructed cases: a tank-level rule that
// fires BETWEEN hydraulic steps (the case asserts the native loop solved at a time off the hourly
// grid, which is the step being shortened, and that EPANET shows the pump switching), TIME and
// CLOCKTIME premises (equality within the increment, >= and <, across midnight, a start clock), ELSE
// actions, PRIORITY (higher wins, a tie keeps the first, the order of the rules), AND/OR chains, a rule
// and a simple control on the same link, a numeric action (pump speed, PRV and FCV settings, a pipe
// given 0), premises on junction pressure, link flow, link status, a pump's setting, system and node
// demand, a tank's fill and drain time, and a 30-minute hydraulic step. Then EPA's Net1 WITH the two
// rules the gallery ships on it (the example departs from Net1.inp from 10 AM by design).
//
// EVERY CASE MUST EXERCISE WHAT IT NAMES: a tank case asserts that EPANET's own tank reached the
// limit (or moved at least a stated amount), so a case that quietly stopped moving a tank fails
// instead of passing on a flat line.
//
// THE REFUSALS. A network the slices cannot run (a rule, a speed pattern on a pump the page did not
// model, a volume curve, water
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
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
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

// ---- slice 3: pump speed patterns -------------------------------------------------------------------
// The page's own model of a pump (js/looped-network.js assembleModel()): the curve at speed 1 as
// h0Base/aBase, the stated speed and pattern beside it, the document's own status as statusBase.
function pageLikePump(l, speed, speedPattern) {
	l.h0Base = l.h0; l.aBase = l.a; l.statusBase = l.status;
	l.speed = speed === undefined ? 1 : speed;
	l.speedPattern = speedPattern || null;
	return l;
}
function patternedPump(o) {
	const m = pumpedTank(Object.assign({ p3: 'closed', controls: [] }, o));
	if (o.mults) { m.time.patterns.push(pat('S', o.mults)); }
	pageLikePump(m.links.find((l) => l.id === 'PU'), o.speed, o.mults ? 'S' : null);
	return m;
}
const SPD = [1, 1, 0.9, 0.85, 0.8, 0.9, 1, 1.1, 1.15, 1.2, 1.1, 1, 1, 0.95, 0.9, 0.95, 1, 1.1, 1.2, 1.15, 1.05, 1, 0.95, 0.9];
const NIGHT_OFF = [0, 0, 0, 0, 0, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1.1, 1, 1, 1, 0, 0];
const PATTERN_CASES = [
	{ name: 'speed pattern, hourly, 48 h', model: patternedPump({ level: 4, mults: SPD }), moves: 'T', minSwing: 0.5 },
	{ name: 'speed pattern with zeros: the pump off 0-5 h and 22-24 h', model: patternedPump({ level: 6, q: 15, mults: NIGHT_OFF }),
		statusOf: 'PU', closedAt: [0, 4, 22, 24], openAt: [5, 12, 29], switches: 4 },
	{ name: 'stated Closed, on a pattern: the pattern opens it at the first step', model: patternedPump({ level: 4, pu: 'closed', mults: SPD }),
		statusOf: 'PU', openAt: [0, 1, 10, 40] },
	{ name: 'AT TIME shuts a patterned pump at 5:30; the 6:00 step\'s pattern re-opens it (30 min report)',
		model: patternedPump({ level: 4, mults: SPD, controls: [ctl('PU', SHUT, at(5.5))], times: { duration: 24 * H, reportStep: H / 2 } }),
		statusOf: 'PU', closedAt: [5.5], openAt: [5, 6, 6.5] },
	{ name: 'tank level holds a patterned pump off ABOVE 8 m (re-fired every step), on BELOW 4 m',
		model: patternedPump({ level: 5, q: 15, mults: SPD, controls: [ctl('PU', SHUT, ifNode('T', 'above', 8)), ctl('PU', OPEN_, ifNode('T', 'below', 4))] }),
		moves: 'T', minSwing: 2.5, capped: 8.01 },
	{ name: 'junction pressure shuts a patterned pump ABOVE 80 m (inside the solve)',
		model: patternedPump({ level: 5, mults: SPD, controls: [ctl('PU', SHUT, ifNode('J', 'above', 80))] }),
		statusOf: 'PU', switches: 2 },
	{ name: 'pattern step 2 h, pattern start 1 h, hydraulic step 1 h', model: patternedPump({ level: 4, mults: SPD,
		times: { duration: 48 * H, patternStep: 2 * H, patternStart: H } }), moves: 'T', minSwing: 0.5 },
	{ name: 'a stated SPEED 1.3 is discarded by its pattern', model: patternedPump({ level: 4, speed: 1.3, mults: SPD }), moves: 'T', minSwing: 0.5 },
	{ name: 'a pattern too slow to lift into the tank (EPANET XHEAD)', model: patternedPump({ level: 4, q: 10,
		mults: [1, 1, 0.55, 0.55, 0.55, 1, 1, 1, 0.5, 0.5, 1, 1] }), statusOf: 'PU', closedAt: [2, 3, 4, 8, 9], openAt: [1, 5, 10], switches: 4 },
	// The built-in solver's own defect this slice found: a pump pushed backwards was shut with Y = 0,
	// which kept the reverse flow the trial had reached (21.6 L/s through a pump EPANET held at 0).
	{ name: 'a single instant: a pump too slow to lift (SPEED 0.55) is XHEAD, no reverse flow', model: patternedPump({ level: 7, q: 10, speed: 0.55,
		times: { duration: 0 } }), statusOf: 'PU', closedAt: [0] },
	{ name: 'a stated SPEED 0, no pattern: OPEN at speed 0, no flow', model: patternedPump({ level: 5, q: 8, speed: 0, p3: 'open' }),
		statusOf: 'PU', openAt: [0, 12, 47], moves: 'T', minSwing: 0.1 },
	{ name: 'a stated SPEED 0.85, no pattern', model: patternedPump({ level: 4, speed: 0.85 }), moves: 'T', minSwing: 0.5 }
];


// ---- slice 4: [RULES] -----------------------------------------------------------------------------
// The text is read by the page's own grammar and converted the way assembleModel() converts it:
// metres, and a flow stated in L/s here becomes m3/s; a setting is converted by what its link is.
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
const ruled = (m, text, convert) => withRules(m, text, convert);
// R (100 m) -> P1 -> J -> V (a valve) -> K (demand) -> P2 -> a low, wide tank T that K fills, so the
// valve passes water forward all day.
function lowTankValveLine(vt, setting) {
	const m = valveLine(vt, setting, []);
	const t = m.nodes.find((n) => n.id === 'T');
	Object.assign(t, tank('T', 20, 4, 0.5, 12, 40));
	return m;
}
const RULE_CASES = [
	{ name: 'tank level: pump CLOSED when T is ABOVE 8 m, OPEN when BELOW 4 m (fires between hydraulic steps)', offGrid: true,
		model: ruled(pumpedTank({ level: 3, p3: 'closed', controls: [] }),
			'RULE 1\nIF TANK T LEVEL ABOVE 8\nTHEN PUMP PU STATUS IS CLOSED\nRULE 2\nIF TANK T LEVEL BELOW 4\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', switches: 3 },
	{ name: 'TIME: pipe shut when TIME = 5 (inside the increment), opened when 9:30 <= TIME < 12',
		model: ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }),
			'RULE T1\nIF SYSTEM TIME = 5\nTHEN PIPE P1 STATUS IS CLOSED\nRULE T2\nIF SYSTEM TIME >= 9:30\nAND SYSTEM TIME < 12\nTHEN PIPE P1 STATUS IS OPEN'),
		statusOf: 'P1', closedAt: [6, 7, 8, 9], openAt: [4, 10, 13] },
	{ name: 'TIME with units: 90 MINUTES and 2 HOURS premises',
		model: ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }),
			'RULE U1\nIF SYSTEM TIME = 90 MIN\nTHEN PIPE P1 STATUS IS CLOSED\nRULE U2\nIF SYSTEM TIME > 2 HOURS\nAND SYSTEM TIME < 3 HOURS\nTHEN PIPE P1 STATUS IS OPEN'),
		statusOf: 'P1', closedAt: [2], openAt: [1, 3, 5] },
	{ name: 'TIME <> (not equal): P2 is shut only in the increment that contains hour 20',
		model: ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 40 }),
			'RULE U3\nIF SYSTEM TIME <> 20 HOURS\nTHEN PIPE P2 STATUS IS OPEN\nELSE PIPE P2 STATUS IS CLOSED'),
		statusOf: 'P2', closedAt: [20], openAt: [19, 21] },
	{ name: 'CLOCKTIME across midnight, starting 10 PM, 48 h: shut at 12:30 AM, open from 5 AM to 8 AM, and again the next night',
		model: (() => { const m = ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }),
			'RULE C1\nIF SYSTEM CLOCKTIME = 12:30 AM\nTHEN PIPE P1 STATUS IS CLOSED\nRULE C2\nIF SYSTEM CLOCKTIME >= 5 AM\nAND SYSTEM CLOCKTIME < 8 AM\nTHEN PIPE P1 STATUS IS OPEN');
			m.time.times.startClock = 22 * H; return m; })(),
		statusOf: 'P1', closedAt: [3, 4, 5, 27, 28], openAt: [2, 8, 9, 12, 31] },
	{ name: 'CLOCKTIME = 12 AM met exactly at the end of the increment that crosses midnight',
		model: (() => { const m = ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }),
			'RULE M1\nIF SYSTEM CLOCKTIME = 12 AM\nTHEN PIPE P1 STATUS IS CLOSED\nRULE M2\nIF SYSTEM CLOCKTIME = 3 AM\nTHEN PIPE P1 STATUS IS OPEN');
			m.time.times.startClock = 22 * H; return m; })(),
		statusOf: 'P1', closedAt: [3, 4], openAt: [1, 6] },
	{ name: 'ELSE: pump CLOSED while T is ABOVE 6 m, otherwise OPEN',
		model: ruled(pumpedTank({ level: 3, p3: 'closed', controls: [] }),
			'RULE E1\nIF TANK T LEVEL ABOVE 6\nTHEN PUMP PU STATUS IS CLOSED\nELSE PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', switches: 4 },
	{ name: 'PRIORITY: the higher-priority OPEN beats an earlier CLOSED (rule order does not matter)',
		model: ruled(pumpedTank({ level: 6, q: 15, p3: 'closed', controls: [] }),
			'RULE A\nIF SYSTEM TIME >= 4\nTHEN PUMP PU STATUS IS CLOSED\nPRIORITY 1\nRULE B\nIF SYSTEM TIME >= 4\nTHEN PUMP PU STATUS IS OPEN\nPRIORITY 3\nRULE C\nIF SYSTEM TIME >= 20\nTHEN PUMP PU STATUS IS CLOSED\nPRIORITY 5'),
		statusOf: 'PU', openAt: [3, 5, 12, 19], closedAt: [21, 30] },
	{ name: 'PRIORITY: a later, higher-priority CLOSED replaces an earlier OPEN on the list',
		model: ruled(pumpedTank({ level: 6, q: 15, p3: 'closed', controls: [] }),
			'RULE A\nIF SYSTEM TIME >= 4\nTHEN PUMP PU STATUS IS OPEN\nPRIORITY 1\nRULE B\nIF SYSTEM TIME >= 8\nTHEN PUMP PU STATUS IS CLOSED\nPRIORITY 2\nRULE C\nIF SYSTEM TIME >= 8\nTHEN PUMP PU STATUS IS OPEN\nPRIORITY 2\nRULE D\nIF SYSTEM TIME >= 11\nTHEN PUMP PU STATUS IS OPEN\nPRIORITY 5'),
		statusOf: 'PU', closedAt: [9, 10], openAt: [7, 12, 30] },
	{ name: 'PRIORITY: equal priority, the first rule on the list keeps the link',
		model: ruled(pumpedTank({ level: 6, q: 15, p3: 'closed', controls: [] }),
			'RULE A\nIF SYSTEM TIME >= 5\nAND SYSTEM TIME < 8\nTHEN PUMP PU STATUS IS CLOSED\nRULE B\nIF SYSTEM TIME >= 5\nAND SYSTEM TIME < 8\nTHEN PUMP PU STATUS IS OPEN\nRULE D\nIF SYSTEM TIME >= 8\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', closedAt: [6, 7], openAt: [4, 9, 20] },
	{ name: 'AND / OR chain: pump OPEN when T is BELOW 3 m OR TIME >= 30, AND J pressure is ABOVE 20 m',
		model: ruled(pumpedTank({ level: 4, pu: 'closed', p3: 'closed', controls: [] }),
			'RULE O1\nIF TANK T LEVEL BELOW 3\nOR SYSTEM TIME >= 30\nAND JUNCTION J PRESSURE ABOVE 20\nTHEN PUMP PU STATUS IS OPEN\nRULE O2\nIF TANK T LEVEL ABOVE 5.5\nTHEN PUMP PU STATUS IS CLOSED'),
		statusOf: 'PU', switches: 2 },
	{ name: 'a rule and a simple control on one link: AT TIME 6 opens the pump, a rule shuts it at TIME >= 6 a moment later',
		model: ruled(pumpedTank({ level: 4, p3: 'closed', controls: [ctl('PU', OPEN_, at(6))] }),
			'RULE R6\nIF SYSTEM TIME >= 6\nAND SYSTEM TIME < 6.5\nTHEN PUMP PU STATUS IS CLOSED\nRULE R8\nIF SYSTEM TIME >= 8\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', closedAt: [7], openAt: [5, 6, 9] },
	{ name: 'a rule and a tank-level control on one pump (the control re-fires every step)',
		model: ruled(pumpedTank({ level: 5, q: 15, p3: 'closed', controls: [ctl('PU', SHUT, ifNode('T', 'above', 8)), ctl('PU', OPEN_, ifNode('T', 'below', 4))] }),
			'RULE X\nIF SYSTEM TIME >= 10\nAND SYSTEM TIME < 14\nTHEN PUMP PU STATUS IS CLOSED'),
		statusOf: 'PU', closedAt: [11, 12, 13], moves: 'T', minSwing: 0.5 },
	{ name: 'a numeric action: pump speed 0.7 when T is ABOVE 7 m, 1.1 BELOW 5 m (STATUS IS a number is a setting)', offGrid: true,
		model: ruled(pumpedTank({ level: 4, p3: 'closed', controls: [] }),
			'RULE S1\nIF TANK T LEVEL ABOVE 7\nTHEN PUMP PU SETTING IS 0.7\nRULE S2\nIF TANK T LEVEL BELOW 5\nTHEN PUMP PU STATUS IS 1.1'),
		moves: 'T', minSwing: 1 },
	{ name: 'a pump set to 0 is closed, set again above 0 is open',
		model: ruled(pumpedTank({ level: 4, p3: 'closed', controls: [] }),
			'RULE Z1\nIF SYSTEM TIME >= 6\nAND SYSTEM TIME < 10\nTHEN PUMP PU SETTING IS 0\nELSE PUMP PU SETTING IS 0.9'),
		statusOf: 'PU', closedAt: [7, 9], openAt: [5, 11] },
	{ name: 'a pipe given a number: 0 closes it, anything else opens it',
		model: ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18 }),
			'RULE N1\nIF SYSTEM TIME >= 5\nAND SYSTEM TIME < 8\nTHEN PIPE P1 SETTING IS 0\nELSE PIPE P1 SETTING IS 1'),
		statusOf: 'P1', closedAt: [6, 7], openAt: [4, 9] },
	{ name: 'PRV: setting 20 m from 4:00 to 9:00, otherwise 35 m, closed 5:00 to 7:30, then its setting again',
		model: ruled(lowTankValveLine('PRV', 30),
			'RULE V1\nIF SYSTEM TIME >= 4\nAND SYSTEM TIME < 9\nTHEN VALVE V SETTING IS 20\nELSE VALVE V SETTING IS 35\nRULE V2\nIF SYSTEM TIME >= 5\nAND SYSTEM TIME < 7.5\nTHEN VALVE V STATUS IS CLOSED\nPRIORITY 1'),
		statusOf: 'V', closedAt: [6, 7], openAt: [5, 8, 20] },
	{ name: 'FCV: 40 L/s while T is BELOW 6 m, otherwise 15 L/s (settings stated in L/s)',
		model: ruled(valveLine('FCV', 0.025, []),
			'RULE F1\nIF TANK T LEVEL BELOW 6\nTHEN VALVE V SETTING IS 40\nELSE VALVE V SETTING IS 15'),
		moves: 'T', minSwing: 0.5 },
	{ name: 'a junction\'s pressure, a pipe\'s flow and a pump\'s setting as premises',
		model: ruled(pumpedTank({ level: 5, q: 25, p3: 'closed', controls: [] }),
			'RULE J1\nIF JUNCTION J PRESSURE BELOW 58\nAND PIPE P2 FLOW BELOW 30\nTHEN PIPE P3 STATUS IS OPEN\nRULE J2\nIF PUMP PU SETTING BELOW 0.9\nTHEN PIPE P3 STATUS IS CLOSED\nRULE J3\nIF TANK T LEVEL ABOVE 6\nTHEN PUMP PU SETTING IS 0.8\nRULE J4\nIF TANK T LEVEL BELOW 4\nTHEN PUMP PU SETTING IS 1'),
		moves: 'T', minSwing: 0.5 },
	{ name: 'a link\'s status and the system demand as premises',
		model: ruled(pumpedTank({ level: 5, q: 25, p3: 'closed', controls: [] }),
			'RULE D1\nIF SYSTEM DEMAND ABOVE 40\nAND LINK P3 STATUS IS CLOSED\nTHEN LINK P3 STATUS IS OPEN\nRULE D2\nIF SYSTEM DEMAND BELOW 20\nAND LINK P3 STATUS IS OPEN\nTHEN LINK P3 STATUS IS CLOSED\nRULE D3\nIF NODE J DEMAND ABOVE 50\nTHEN PUMP PU STATUS IS CLOSED\nELSE PUMP PU STATUS IS OPEN'),
		statusOf: 'P3', switches: 2 },
	{ name: 'a tank\'s FILLTIME and DRAINTIME (in hours) as premises',
		model: ruled(pumpedTank({ level: 5, q: 25, p3: 'closed', controls: [] }),
			'RULE L1\nIF TANK T FILLTIME BELOW 3\nTHEN PUMP PU STATUS IS CLOSED\nRULE L2\nIF TANK T DRAINTIME BELOW 3\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', switches: 2 },
	{ name: 'a reservoir\'s HEAD as a premise, on a head pattern',
		model: ruled(lineWithTank({ level: 4, min: 0.5, max: 12, dia: 18, rPattern: 'RH',
			rhm: [1, 1, 0.97, 0.94, 0.9, 0.9, 0.94, 0.98, 1.02, 1.04, 1.04, 1.02] }),
			'RULE H1\nIF RESERVOIR R HEAD BELOW 76\nTHEN PIPE P2 STATUS IS CLOSED\nELSE PIPE P2 STATUS IS OPEN'),
		statusOf: 'P2', switches: 2 },
	{ name: 'hydraulic step 30 min (rule step 3 min), report 30 min: tank-level rule on a pump', offGrid: true,
		model: ruled(pumpedTank({ level: 3, p3: 'closed', controls: [], times: { hydraulicStep: H / 2, reportStep: H / 2, patternStep: H } }),
			'RULE 1\nIF TANK T LEVEL ABOVE 8\nTHEN PUMP PU STATUS IS CLOSED\nRULE 2\nIF TANK T LEVEL BELOW 4\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', switches: 3 },
	{ name: 'a pattern step of 2 h with a rule on a tank level: the rule cuts the hour, the pattern boundary cuts it too', offGrid: true,
		model: ruled(pumpedTank({ level: 3, p3: 'closed', controls: [], times: { patternStep: 2 * H } }),
			'RULE 1\nIF TANK T LEVEL ABOVE 7.3\nTHEN PUMP PU STATUS IS CLOSED\nRULE 2\nIF TANK T LEVEL BELOW 3.6\nTHEN PUMP PU STATUS IS OPEN'),
		statusOf: 'PU', switches: 3 },
	{ name: 'a tank that FILLS to its limit under a rule that never fires', reaches: 'max',
		model: ruled(lineWithTank({ level: 2, min: 0.5, max: 3, dia: 10, q: 12 }),
			'RULE Q1\nIF SYSTEM TIME >= 100\nTHEN PIPE P1 STATUS IS CLOSED') }
];

// ---- EPA's examples ------------------------------------------------------------------------------
// `pumps` gives a pump its page-like model (pageLikePump) with the file's own speed and pattern, or
// with a pattern added: { id: [patternId, multipliers] }.
function loadEpa(file, stripped, pumps, rulesText) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	const m = buildModel(EngCalcs, parsed);
	if (stripped) { m.time.controls = []; }
	if (pumps) {
		m.links.filter((l) => l.type === 'pump').forEach((l) => {
			const pl = parsed.links.find((x) => x.id === l.id), add = pumps === true ? null : pumps[l.id];
			if (pumps !== true && !add) { return; }
			if (add) { m.time.patterns.push(pat(add[0], add[1])); }
			pageLikePump(l, pl.speed, add ? add[0] : pl.speedPattern);
		});
	}
	// Net1 is a US file: the rules' levels are feet, the model is metres.
	if (rulesText) { withRules(m, rulesText, (v, kind) => (kind === 'head' || kind === 'pressure' ? v * 0.3048 : kind === 'flow' ? v / 1000 : v)); }
	return { model: m, hadControls: parsed.controls.length };
}

const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

async function compare(c) {
	if (process.env.ONLY && c.name.indexOf(process.env.ONLY) < 0) { return; }   // debugging: one case
	const model = c.model;
	model.hydraulics = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	const epa = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	const nat = EngCalcs.lpnNativeRun(model);
	if (!epa.ok || !nat.ok) {
		ok(c.name, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || ''));
		return;
	}
	if (process.env.DUMP) {
		epa.frames.forEach((fe, i) => {
			const fn = nat.frames[i];
			console.log(fe.t / H + 'h  ' + model.nodes.map((n) => n.id + ' ' + fe.heads[n.id].toFixed(3) + '/' + fn.heads[n.id].toFixed(3)).join('  ') + '   ' +
				model.links.map((l) => l.id + ' ' + (fe.flows[l.id] * 1000).toFixed(2) + '/' + (fn.flows[l.id] * 1000).toFixed(2) + fe.statuses[l.id][0] + fn.statuses[l.id][0]).join('  '));
		});
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
	// The tank's level in EPANET's frames stays at or under `capped` (a control holding it there).
	if (c.capped) {
		const hi = range[tankIds[0]].hi;
		if (!(hi <= c.capped)) { exercised = false; }
		why += `; highest ${hi.toFixed(3)} m`;
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
	// A rule that acts between hydraulic steps shortens the step: the native loop must have solved
	// at a time that is not a whole number of hours.
	if (c.offGrid) {
		const off = (nat.solveTimes || []).filter((t) => t % H !== 0).length;
		if (!off) { exercised = false; }
		why += `${why ? '; ' : ''}${off} solves off the hourly grid`;
	}
	ok(c.name, sameSteps && dH <= HEAD_TOL && dL <= HEAD_TOL && dQ <= qTol && unconv === 0 && exercised && stDiff === 0,
		`steps ${nat.frames.length}/${epa.frames.length}${sameSteps ? '' : ' DIFFER'}  ` +
		`dH=${dH.toExponential(2)} m @${atH}  dLevel=${dL.toExponential(2)} m @${atL || '-'}  ` +
		`dQ=${dQ.toExponential(2)} m3/s @${atQ} (tol ${qTol.toExponential(1)})` +
		(unconv ? ` ${unconv} UNCONVERGED` : '') + (stDiff ? ` ${stDiff} STATUS DIFFERENCES` : '') +
		(c.moves || c.reaches || c.statusOf || c.offGrid ? `  [${why}${exercised ? '' : ' NOT EXERCISED'}]` : ''));
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

	console.log('-- slice 3: pump speed patterns, constructed');
	for (const c of PATTERN_CASES) { await compare(c); }
	console.log('-- slice 3: pattern-attach.inp and Net3 with speed patterns');
	{
		const pa = loadEpa('pattern-attach.inp', false, true);
		const pu = pa.model.links.find((l) => l.id === 'PU1');
		ok('pattern-attach.inp: PU1 states SPEED 1.2 and PATTERN PSPD', pu.speed === 1.2 && pu.speedPattern === 'PSPD');
		await compare({ name: 'pattern-attach.inp, 11 h (reservoir head pattern, pump speed pattern)', model: pa.model });
	}
	await compare({ name: 'Net3 with its controls, pump 335 on a speed pattern', statusOf: '335', switches: 1, moves: '*', minSwing: 0.5,
		model: loadEpa('Net3.inp', false, { 335: ['S335', [1, 1, 0.95, 0.9, 0.9, 0.95, 1, 1.05, 1.1, 1.1, 1.05, 1]] }).model });
	await compare({ name: 'Net3 with its controls, pump 10 (stated Closed, two timers) on a pattern off at night', statusOf: '10',
		closedAt: [0, 3, 22], openAt: [6, 12, 16],
		model: loadEpa('Net3.inp', false, { 10: ['S10', [0, 0, 0, 0, 0, 0, 1, 1, 1.1, 1.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9, 0.9, 0, 0]] }).model });
	await compare({ name: 'Net3 with its controls stripped, both pumps on speed patterns', moves: '*', minSwing: 0.5,
		model: loadEpa('Net3.inp', true, { 10: ['S10', [0.9, 1, 1.1, 1]], 335: ['S335', [1, 0.9, 0.95, 1.05, 1.1, 1]] }).model });

	console.log('-- slice 4: [RULES], constructed');
	for (const c of RULE_CASES) { await compare(c); }
	console.log('-- slice 4: EPA\'s Net1 WITH the two rules the gallery ships on it (CLOCKTIME windows, tank 2 LEVEL in feet), and variations');
	{
		const text = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net1.lwn'), 'utf8')).rules.join('\n');
		const withR = loadEpa('Net1.inp', false, false, text);
		ok('Net1 carries both gallery rules', withR.model.rules.length === 2);
		await compare({ name: 'Net1 with its controls AND the gallery rules, 24 h (pump 9)', model: withR.model, statusOf: '9', switches: 3 });
		await compare({ name: 'Net1 with the gallery rules and its controls stripped', statusOf: '9', switches: 1,
			model: loadEpa('Net1.inp', true, false, text).model });
		await compare({ name: 'Net1, rules shutting pump 9 above 130 ft and opening it below 118 ft (priority 2)', statusOf: '9', switches: 1, offGrid: true,
			model: loadEpa('Net1.inp', false, false, 'RULE W\nIF TANK 2 LEVEL ABOVE 130\nTHEN PUMP 9 STATUS IS CLOSED\nRULE X\nIF TANK 2 LEVEL BELOW 118\nTHEN PUMP 9 STATUS IS OPEN\nPRIORITY 2').model });
	}

	{
		// Net3 (feet, 3 tanks, 2 pumps and a bypass) with its controls replaced by rules that do the same
		// work and more: the tank-1 pair as multi-action rules, pump 10 by the clock, a tank-3 rule.
		const NET3_RULES = 'RULE A\nIF TANK 1 LEVEL BELOW 17.1\nTHEN PUMP 335 STATUS IS OPEN\nAND PIPE 330 STATUS IS CLOSED\nRULE B\nIF TANK 1 LEVEL ABOVE 19.1\nTHEN PUMP 335 STATUS IS CLOSED\nAND PIPE 330 STATUS IS OPEN\n' +
			'RULE C\nIF SYSTEM CLOCKTIME >= 1 AM\nAND SYSTEM CLOCKTIME < 3 PM\nTHEN PUMP 10 STATUS IS OPEN\nELSE PUMP 10 STATUS IS CLOSED\n' +
			'RULE D\nIF TANK 3 LEVEL ABOVE 31\nOR TANK 2 LEVEL ABOVE 39\nTHEN PUMP 10 STATUS IS CLOSED\nPRIORITY 2';
		await compare({ name: 'Net3, controls replaced by rules (multi-action, ELSE, OR, PRIORITY), 24 h', statusOf: '10', switches: 2,
			model: loadEpa('Net3.inp', true, false, NET3_RULES).model });
		await compare({ name: 'Net3 with its controls AND tank-1 rules with other levels (rule and control on one pump)', statusOf: '335', switches: 1, offGrid: true,
			model: loadEpa('Net3.inp', false, false, 'RULE A\nIF TANK 1 LEVEL BELOW 18\nTHEN PUMP 335 STATUS IS OPEN\nRULE B\nIF TANK 1 LEVEL ABOVE 18.6\nTHEN PUMP 335 STATUS IS CLOSED').model });
	}

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
	// a rule the loop does not copy, or that EPANET itself rejects on reading the file
	const ruleRefusal = (name, text, mut, id) => {
		const m = base();
		m.nodes.push(jn('K', 5, 0));
		m.links.push(pipe('P9', 'J', 'K', 100, 0.1));
		if (mut) { mut(m); }
		withRules(m, text);
		const r = EngCalcs.lpnNativeRun(m);
		ok('refuses a rule: ' + name, r.ok === false && r.refused === true && r.frames === undefined &&
			r.issues.some((i) => i.code === 'native-run-rules' && i.ids.indexOf(id || 'Q') >= 0), JSON.stringify(r.issues || ''));
	};
	const gpv = (m) => { m.links.push({ id: 'G', type: 'valve', valveType: 'GPV', from: 'J', to: 'K', diameter: 0.1, setting: 1, k: 0, length: 0, status: 'open' }); };
	ruleRefusal('a premise on a pipe\'s roughness', 'RULE Q\nIF PIPE P1 SETTING ABOVE 100\nTHEN PIPE P9 STATUS IS CLOSED');
	ruleRefusal('a premise on a reservoir\'s pressure', 'RULE Q\nIF RESERVOIR R PRESSURE ABOVE 1\nTHEN PIPE P9 STATUS IS CLOSED');
	ruleRefusal('a premise on a GPV\'s setting', 'RULE Q\nIF VALVE G SETTING ABOVE 1\nTHEN PIPE P9 STATUS IS CLOSED', gpv);
	ruleRefusal('FILLTIME on a junction (EPANET error 201)', 'RULE Q\nIF NODE J FILLTIME BELOW 1\nTHEN PIPE P9 STATUS IS CLOSED');
	ruleRefusal('a time EPANET cannot read (error 202)', 'RULE Q\nIF SYSTEM TIME > 25 PM\nTHEN PIPE P9 STATUS IS CLOSED');
	ruleRefusal('a negative setting in an action (error 202)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PUMP PU SETTING IS -1',
		(m) => { m.links.push(pageLikePump({ id: 'PU', type: 'pump', from: 'R', to: 'J', h0: 50, a: 1, b: 2, status: 'open' })); });
	ruleRefusal('a numeric action on a GPV (error 202)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN VALVE G SETTING IS 3', gpv);
	ruleRefusal('an action on a check valve (error 207)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PIPE C STATUS IS CLOSED',
		(m) => { m.links.push(Object.assign(pipe('C', 'J', 'K', 100, 0.1), { status: 'cv' })); });
	ruleRefusal('a hydraulic step under 10 s (a rule step of zero)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PIPE P9 STATUS IS CLOSED',
		(m) => { m.time.times.hydraulicStep = 5; }, 'Rule Timestep');
	{
		const m = base(); m.rules = [{ id: 'R1' }];
		const r = EngCalcs.lpnNativeRun(m);
		ok('refuses a rule record it cannot read (no name or clauses)', r.refused === true && r.issues.some((i) => i.code === 'native-run-rules'), JSON.stringify(r.issues || ''));
	}
	refusal('a speed pattern on a pump without its unscaled curve (not the page\'s model)', (m) => { m.links.push({ id: 'PU', type: 'pump', from: 'R', to: 'J', speedPattern: 'D', h0: 50, a: 1, b: 2 }); }, 'native-run-speed-pattern');
	refusal('a speed pattern the model lacks', (m) => { m.links.push(pageLikePump({ id: 'PU', type: 'pump', from: 'R', to: 'J', h0: 50, a: 1, b: 2, status: 'open' }, 1, 'NOPE')); }, 'native-run-speed-pattern');
	refusal('a speed pattern with a negative multiplier', (m) => { m.time.patterns.push(pat('NEG', [1, -0.5]));
		m.links.push(pageLikePump({ id: 'PU', type: 'pump', from: 'R', to: 'J', h0: 50, a: 1, b: 2, status: 'open' }, 1, 'NEG')); }, 'native-run-speed-pattern');
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

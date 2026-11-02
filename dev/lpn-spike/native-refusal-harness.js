// WHAT THE BUILT-IN SOLVER RUNS AND WHAT IT REFUSES, AGAINST EPANET ITSELF (Task 733, native-pdd).
//
//   node dev/lpn-spike/native-refusal-harness.js
//
// With the built-in solver chosen, no network goes to EPANET because the built-in solver lacks a feature. Every
// case is one of two kinds, and each is held against the EPANET engine here:
//   RUNS  -- EPANET runs it, so the built-in loop runs it and agrees (0.8 mm of head and tank level, 0.002 L/s or
//            1e-5 of the largest flow, the quality tolerances of the quality harnesses);
//   REFUSED -- EPANET refuses it, or fails on it (the engine returns not-ok, or never returns), so
//            EngCalcs.lpnDiagnose names it BY NAME for a project that runs a period, and the built-in loop
//            names it too, whichever engine is chosen. A steady project is never refused for it.
'use strict';
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
for (const f of ['lpn-native-msx.js', 'lpn-native-run.js']) { require(path.join(ROOT, 'js', f)); }

const H = 3600, LPS = 0.001;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const copy = (m) => JSON.parse(JSON.stringify(m));
const pipe = (id, from, to, length, diameter) => ({ id, type: 'pipe', from, to, length, diameter, roughness: 130, k: 0, status: 'open' });
const pump = (extra) => Object.assign({ id: 'PU', type: 'pump', from: 'R', to: 'K', h0: 50, a: 1, b: 1.5, h0Base: 50, aBase: 1, speed: 1, status: 'open', statusBase: 'open', pumpSpeed: 1 }, extra);
function net() {
	return {
		method: 'hw', visc: 1.007e-6,
		nodes: [{ id: 'R', type: 'reservoir', elev: 100, head: 100, headBase: 100, headPattern: null },
			{ id: 'J', type: 'junction', elev: 10, demand: 20 * LPS, demandBase: 20 * LPS, demandPattern: null },
			{ id: 'K', type: 'junction', elev: 10, demand: 0, demandBase: 0, demandPattern: null },
			{ id: 'T', type: 'tank', elev: 60, ground: 60, head: 64, level: 4, minLevel: 0.5, maxLevel: 12, diameter: 15 }],
		links: [pipe('P1', 'R', 'J', 1200, 0.3), pipe('P2', 'J', 'T', 800, 0.25), pipe('P9', 'J', 'K', 100, 0.1)],
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), { duration: 6 * H, hydraulicStep: H, patternStep: H, reportStep: H }),
			patterns: [{ id: 'D', multipliers: [1, 1.2] }], defaultPattern: null, controls: [], warnings: [] },
		hydraulics: { accuracy: 1e-5 }
	};
}
const tank = (m) => m.nodes.find((n) => n.id === 'T');
const MSX = '[OPTIONS]\nAREA_UNITS FT2\nRATE_UNITS HR\nSOLVER EUL\nTIMESTEP 300\n[SPECIES]\nBULK TR MG\n[COEFFICIENTS]\nCONSTANT K 3\n[PIPES]\nRATE TR -K*TR\n[TANKS]\nRATE TR -K*TR\n[QUALITY]\nGLOBAL TR 0.4\nNODE R TR 1.0\n';
const withMsx = (text) => (m) => { m.quality = { mode: 'msx' }; m.msx = { text }; };
const rules = (m, text) => { m.rules = EngCalcs.lpnRuleParse(text.trim().split('\n')).filter((b) => b.ok).map((b) => EngCalcs.lpnRuleConvert(b, (v) => v, () => 'none')); };

// the largest gap between two runs, over every reporting step
function gap(e, n) {
	let head = 0, flow = 0, demand = 0, level = 0, qual = 0, link = 0, msx = 0, maxQ = 0;
	e.frames.forEach((fe, i) => {
		const fn = n.frames[i];
		Object.keys(fe.flows).forEach((id) => { maxQ = Math.max(maxQ, Math.abs(fe.flows[id])); });
		Object.keys(fe.heads).forEach((id) => { head = Math.max(head, Math.abs(fe.heads[id] - fn.heads[id])); });
		Object.keys(fe.flows).forEach((id) => { flow = Math.max(flow, Math.abs(fe.flows[id] - fn.flows[id])); });
		Object.keys(fe.demands || {}).forEach((id) => { demand = Math.max(demand, Math.abs(fe.demands[id] - fn.demands[id])); });
		Object.keys(fe.levels || {}).forEach((id) => { level = Math.max(level, Math.abs(fe.levels[id] - fn.levels[id])); });
		Object.keys(fe.qualities || {}).forEach((id) => { qual = Math.max(qual, Math.abs(fe.qualities[id] - (fn.qualities ? fn.qualities[id] : Infinity))); });
		Object.keys(fe.linkQualities || {}).forEach((id) => { link = Math.max(link, Math.abs(fe.linkQualities[id] - (fn.linkQualities ? fn.linkQualities[id] : Infinity))); });
		['msxNodes', 'msxLinks'].forEach((k) => Object.keys(fe[k] || {}).forEach((id) => fe[k][id].forEach((v, s) => {
			if (v !== null) { msx = Math.max(msx, Math.abs(v - fn[k][id][s])); }
		})));
	});
	return { head, flow, demand, level, qual, link, msx, maxQ };
}

// cases EPANET runs, and the loop must run the same way
const RUNS = [
	{ name: 'a speed pattern on a pump without the page\'s unscaled curve is ignored by both', mut: (m) => {
		m.time.patterns.push({ id: 'S', multipliers: [1, 0.6] }); const p = pump({ speedPattern: 'S' }); delete p.h0Base; delete p.aBase; m.links.push(p);
	}, moved: (e) => e.frames.some((f) => Math.abs(f.flows.PU) > 1e-4) },
	{ name: 'a tank that names a volume curve it has no rows for is a cylinder', mut: (m) => { tank(m).volCurveName = 'V1'; tank(m).volCurve = 'V1'; tank(m).volCurveSI = []; } },
	{ name: 'a tank whose minimum and maximum levels are equal, started at that level', mut: (m) => { const t = tank(m); t.minLevel = 12; t.maxLevel = 12; t.level = 12; } },
	{ name: 'a trace from a node out of the run is no analysis in either engine (quality 0 everywhere)', mut: (m) => { m.quality = { mode: 'trace', traceNode: 'NOPE' }; }, tolQ: 1e-12, tolL: 1e-12, zero: true },
	{ name: 'water age with a tank that has no area (a reservoir to the quality code)', mut: (m) => { m.quality = { mode: 'age' }; tank(m).diameter = 0; }, tolQ: 2, tolL: 5 },
	{ name: 'water age with an EPANET-MSX file attached and left unused', mut: (m) => { m.quality = { mode: 'age' }; m.msx = { text: MSX }; }, tolQ: 2, tolL: 5 },
	{ name: 'a chemical with a tank that has no area', mut: (m) => {
		m.quality = { mode: 'chemical', chemical: 'Chlorine mg/L' }; m.reactions = { bulk: {}, wall: {}, tank: {}, globalBulk: -0.5 };
		m.nodes.find((n) => n.id === 'R').initQuality = 1; tank(m).diameter = 0;
	}, tolQ: 1e-4, tolL: 1e-4 },
	{ name: 'EPANET-MSX with a tank that has no area', mut: (m) => { withMsx(MSX)(m); tank(m).diameter = 0; }, tolM: 5e-4 },
	{ name: 'EPANET-MSX mode with no file attached is no analysis in either engine', mut: (m) => { m.quality = { mode: 'msx' }; }, noQuality: true }
];

// cases EPANET refuses (not-ok), or fails on, named by lpnDiagnose in a period and by the loop
const REFUSED = [
	['a control on a check-valve pipe (error 207)', 'control-refused', 'P9', (m) => { m.links.find((l) => l.id === 'P9').status = 'cv'; m.time.controls = [{ link: 'P9', action: { status: 'closed' }, condition: { kind: 'time', seconds: 3600 } }]; }],
	['a numeric setting on a general purpose valve (error 207)', 'control-refused', 'G', (m) => {
		m.links.push({ id: 'G', type: 'valve', valveType: 'GPV', from: 'J', to: 'K', diameter: 0.1, setting: 1, k: 0, length: 0, status: 'open', curvePoints: [[0.001, 1], [0.01, 5]] });
		m.time.controls = [{ link: 'G', action: { setting: 3 }, condition: { kind: 'time', seconds: 3600 } }];
	}],
	['a negative setting on a pipe (error 211)', 'control-refused', 'P9', (m) => { m.time.controls = [{ link: 'P9', action: { setting: -1 }, condition: { kind: 'time', seconds: 3600 } }]; }],
	['a pump speed pattern the model lacks (error 205)', 'speed-pattern-refused', 'PU', (m) => { m.links.push(pump({ speedPattern: 'NOPE' })); }],
	['a tank volume curve with one row (error 230)', 'tank-curve-refused', 'T', (m) => { Object.assign(tank(m), { volCurve: 'C1', volCurveSI: [[0, 0]] }); }],
	['a tank volume curve whose levels do not increase (error 230)', 'tank-curve-refused', 'T', (m) => { Object.assign(tank(m), { volCurve: 'C1', volCurveSI: [[0, 0], [5, 50], [5, 60], [14, 900]] }); }],
	['a tank volume curve that stops short of the maximum level (error 225)', 'tank-curve-refused', 'T', (m) => { Object.assign(tank(m), { volCurve: 'C1', volCurveSI: [[0, 0], [5, 50], [8, 100]] }); }],
	['a tank started above its maximum level (error 225)', 'tank-levels-refused', 'T', (m) => { tank(m).level = 99; }],
	['a source of a type EPANET does not know (error 213)', 'quality-refused', 'J', (m) => { m.quality = { mode: 'chemical' }; m.nodes.find((n) => n.id === 'J').source = { type: 'BOOST', quality: 1 }; }],
	['a source on a pattern the model lacks (error 205)', 'quality-refused', 'J', (m) => { m.quality = { mode: 'chemical' }; m.nodes.find((n) => n.id === 'J').source = { type: 'MASS', quality: 1, pattern: 'NOPE' }; }],
	['a tank mixing model EPANET does not know (error 213)', 'quality-refused', 'T', (m) => { m.quality = { mode: 'age' }; tank(m).mixing = { model: 'STIRRED' }; }],
	['an EPANET-MSX file with a line it cannot read', 'quality-refused', /^line \d+/, withMsx(MSX.replace('CONSTANT K 3', 'BOGUS K 3'))],
	['an EPANET-MSX rate expression it cannot read', 'quality-refused', 'line 11 (408)', withMsx(MSX.replace('RATE TR -K*TR\n[TANKS]', 'RATE TR -K*\n[TANKS]'))],
	['an EPANET-MSX file with a species that has no pipe expression', 'quality-refused', /^expressions/, withMsx(MSX.replace('[PIPES]\nRATE TR -K*TR\n', '[PIPES]\n'))],
	['a negative energy price (error 217)', 'energy-refused', 'Global Price', (m) => { m.links.push(pump()); m.energy = { globalPrice: -1 }; }],
	['a global efficiency of 0 (error 217)', 'energy-refused', 'Global Efficiency', (m) => { m.links.push(pump()); m.energy = { globalEfficiency: 0 }; }],
	['a negative demand charge (error 213)', 'energy-refused', 'Demand Charge', (m) => { m.links.push(pump()); m.energy = { demandCharge: -2 }; }],
	['a price pattern the model lacks (error 205)', 'energy-refused', 'Global Pattern', (m) => { m.links.push(pump()); m.energy = { globalPattern: 'NOPE' }; }],
	['a pump efficiency curve whose flows do not increase (error 230)', 'energy-refused', 'PU', (m) => { m.links.push(pump()); m.energy = { effic: { PU: 'E1' }, efficCurves: { E1: [[0, 30], [0.01, 50], [0.01, 40]] } }; }],
	['a rule step of zero (a hydraulic step under 10 s with a rule)', 'rule-step-refused', 'Rule Timestep', (m) => { m.time.times.hydraulicStep = 5; rules(m, 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PIPE P9 STATUS IS CLOSED'); }, true]
];
// EPANET does not return for these (its quality walk never advances), so they are not run through it
const NEVER_RETURNS = [
	['a quality step of zero (hydraulic step under 10 s, none stated)', 'quality-refused', 'Quality Timestep', (m) => { m.quality = { mode: 'age' }; m.time.times.hydraulicStep = 5; }]
];
// EPANET returns no answer, or numbers with NaN in them, for these: a speed pattern with a negative multiplier (a
// power of a negative speed is NaN for a non-integer exponent), so it is named in both engines rather than run
const MEANINGLESS = [
	['a pump speed pattern with a negative multiplier', 'speed-pattern-refused', 'PU', (m) => { m.time.patterns.push({ id: 'NEG', multipliers: [1, -0.5] }); m.links.push(pump({ speedPattern: 'NEG' })); }]
];

async function epanetRun(m) {
	try { return await EngCalcs.lpnEpanetRun(copy(m)); } catch (e) { return { ok: false, thrown: true }; }
}
const named = (issues, code, id) => issues.some((i) => i.code === code && i.ids.some((x) => (id instanceof RegExp ? id.test(String(x)) : String(x) === id)));

async function main() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	console.log('-- EPANET runs it, so the built-in loop runs it and agrees');
	for (const c of RUNS) {
		const m = net(); c.mut(m);
		const diag = EngCalcs.lpnDiagnose(copy(m)), refs = EngCalcs.lpnNativeRunRefusals(copy(m), { quality: true }), gaps = EngCalcs.lpnNativeRunGaps(copy(m), { quality: true });
		const e = await epanetRun(m), n = EngCalcs.lpnNativeRun(copy(m), { quality: true });
		if (!(e.ok && n.ok && !diag.length && !refs.length && !gaps.length)) {
			ok(c.name, false, 'epanet ok=' + e.ok + ' native ok=' + n.ok + ' diag ' + JSON.stringify(diag) + ' refusals ' + JSON.stringify(refs));
			continue;
		}
		const g = gap(e, n), tolF = Math.max(2e-6, 1e-5 * g.maxQ), tolQ = c.tolQ || 0, tolL = c.tolL || 0, tolM = c.tolM || 0;
		const good = g.head <= 8e-4 && g.level <= 8e-4 && g.flow <= tolF && g.demand <= tolF && e.frames.length === n.frames.length &&
			(!tolQ || g.qual <= tolQ) && (!tolL || g.link <= tolL) && (!tolM || g.msx <= tolM) &&
			(!c.noQuality || (!e.frames.some((f) => f.qualities) && !n.frames.some((f) => f.qualities) && n.qualityRan === false)) &&
			(!c.zero || (n.qualityRan === true && n.frames.every((f) => Object.keys(f.qualities).every((id) => f.qualities[id] === 0)))) &&
			(!c.moved || c.moved(e));
		ok(c.name, good, `head ${(g.head * 1000).toFixed(4)} mm, level ${(g.level * 1000).toFixed(4)} mm, flow ${(g.flow * 1000).toFixed(5)} L/s, demand ${(g.demand * 1000).toFixed(5)} L/s, node quality ${g.qual.toExponential(2)}, link quality ${g.link.toExponential(2)}, msx ${g.msx.toExponential(2)}`);
	}
	console.log('-- EPANET refuses it, so both engines name it');
	for (const [name, code, id, mut, rulesToo] of REFUSED) {
		const m = net(); mut(m);
		const steady = copy(m); steady.time.times.duration = 0;
		ok(name + ': lpnDiagnose names it', named(EngCalcs.lpnDiagnose(copy(m)), code, id), JSON.stringify(EngCalcs.lpnDiagnose(copy(m))));
		ok(name + ': a steady project is not refused for it', !EngCalcs.lpnDiagnose(steady).some((i) => i.code === code));
		ok(name + ': the loop refuses it too, by name, and its plan is not a gap', EngCalcs.lpnNativeRun(copy(m), { quality: true }).refused === true && EngCalcs.lpnNativeRunGaps(copy(m), { quality: true }).length === 0);
		// EPANET itself, with our check switched off, must not take it
		const keep = EngCalcs.lpnPeriodRefused; EngCalcs.lpnPeriodRefused = () => [];
		const keepR = EngCalcs.lpnRulesRefused; EngCalcs.lpnRulesRefused = () => [];
		const e = await epanetRun(m);
		EngCalcs.lpnPeriodRefused = keep; EngCalcs.lpnRulesRefused = keepR;
		ok(name + ': EPANET itself does not run it', !e.ok, e.thrown ? 'threw' : 'ok=' + e.ok);
	}
	console.log('-- EPANET never returns, so both engines name it');
	for (const [name, code, id, mut] of NEVER_RETURNS) {
		const m = net(); mut(m);
		ok(name + ': lpnDiagnose names it', named(EngCalcs.lpnDiagnose(copy(m)), code, id), JSON.stringify(EngCalcs.lpnDiagnose(copy(m))));
		ok(name + ': the loop refuses it too, by name', EngCalcs.lpnNativeRun(copy(m), { quality: true }).refused === true && EngCalcs.lpnNativeRunGaps(copy(m), { quality: true }).length === 0);
	}
	console.log('-- EPANET gives no answer, or NaN, so both engines name it');
	for (const [name, code, id, mut] of MEANINGLESS) {
		const m = net(); mut(m);
		const steady = copy(m); steady.time.times.duration = 0;
		ok(name + ': lpnDiagnose names it', named(EngCalcs.lpnDiagnose(copy(m)), code, id));
		ok(name + ': a steady project is not refused for it', !EngCalcs.lpnDiagnose(steady).some((i) => i.code === code));
		ok(name + ': the loop refuses it too, by name', EngCalcs.lpnNativeRun(copy(m), { quality: true }).refused === true);
		const e = await epanetRun(m), bad = (f) => Object.keys(f.heads).some((id) => !isFinite(f.heads[id])) || Object.keys(f.flows).some((id) => !isFinite(f.flows[id]));
		ok(name + ': EPANET itself returns no answer, or one with NaN in it (this curve, b = 1.5)', !e.ok || e.frames.some(bad), 'ok=' + e.ok + ', ' + (e.frames || []).length + ' frames');
	}
	console.log('-- the page\'s own run path');
	{
		let engineName = 'native';
		EngCalcs.lpnTimeInit({
			tabs: [], doc: () => null, apply: () => {}, status: () => {}, notice: () => {},
			routeNote: () => {}, engine: () => engineName,
			solve: () => {}, solveNow: () => {}, native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
			snapshot: () => {}, save: () => {},
			toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
		});
		let epanetCalls = 0; const realRun = EngCalcs.lpnEpanetRun; EngCalcs.lpnEpanetRun = function () { epanetCalls++; return realRun.apply(this, arguments); };
		// a refused input: named, no run, EPANET not called
		const bad = net(); bad.links.push(pump({ speedPattern: 'NOPE' }));
		let r = await EngCalcs.lpnTimeRunModel(copy(bad), {});
		ok('a refused input comes back with its name and no frames, and EPANET is not called', r.ok === false && named(r.issues, 'speed-pattern-refused', 'PU') && !r.frames.length && epanetCalls === 0, JSON.stringify(r.issues));
		// a step the loop cannot solve: said plainly, no change of engine
		const cut = net(); cut.nodes.find((n) => n.id === 'K').demand = 5 * LPS; cut.nodes.find((n) => n.id === 'K').demandBase = 5 * LPS;
		cut.time.controls = [{ link: 'P9', action: { status: 'closed' }, condition: { kind: 'time', seconds: 2 * H } }];
		r = await EngCalcs.lpnTimeRunModel(copy(cut), {});
		ok('a step the built-in solver cannot solve stops the run, names the reason and the time, and EPANET is not called',
			r.ok === false && r.engine === 'native' && r.issues.some((i) => i.code === 'unreachable' && i.ids.indexOf('K') >= 0) && r.issues.some((i) => i.code === 'builtin-stopped' && i.t === 2 * H) && epanetCalls === 0, JSON.stringify(r.issues));
		// a loop that throws
		const keepSteps = EngCalcs.lpnNativeRunSteps; EngCalcs.lpnNativeRunSteps = function* () { throw new Error('boom'); };
		r = await EngCalcs.lpnTimeRunModel(copy(net()), {});
		EngCalcs.lpnNativeRunSteps = keepSteps;
		ok('a loop that throws is reported as the built-in solver\'s error, and EPANET is not called', r.ok === false && r.issues.some((i) => i.code === 'builtin-error' && /boom/.test(i.message)) && r.issues.some((i) => i.code === 'builtin-stopped') && epanetCalls === 0, JSON.stringify(r.issues));
		// the EPANET setting still runs EPANET
		engineName = 'epanet';
		r = await EngCalcs.lpnTimeRunModel(copy(net()), {});
		ok('the EPANET setting still runs EPANET', r.ok === true && r.engine === 'epanet' && epanetCalls === 1);
		EngCalcs.lpnEpanetRun = realRun;
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(2); });

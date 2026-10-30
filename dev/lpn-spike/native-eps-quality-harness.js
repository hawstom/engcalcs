// THE BUILT-IN SOLVER'S WATER-QUALITY PASS, HELD TO EPANET'S OWN ANSWER (Task 733, phase 4).
//
//   node dev/lpn-spike/native-eps-quality-harness.js
//
// Every case is run three ways from the SAME model:
//   1. EPANET:  EngCalcs.lpnEpanetRun (the vendored EPANET 2.3.5 engine: runH()/nextH(), then the
//      quality walk openQ()/runQ()/nextQ() over the hydraulics it saved), the page's own bridge.
//   2. OVER:    EngCalcs.lpnNativeQualityOver, the built-in quality pass walked over EPANET's OWN saved
//      hydraulics (native-eps-quality-truth.js reads the engine's hydraulics file). This isolates the
//      transcription of EPANET's quality code from any difference between the two hydraulic solutions,
//      so its tolerance is roundoff: |difference| <= 1e-8 x max(1, |value|) at every node and link at
//      every reporting time.
//   3. NATIVE:  EngCalcs.lpnNativeRun(model, {quality: true}), the built-in hydraulic loop AND the
//      quality pass, end to end. Here the two hydraulic solutions differ by what native-eps-harness.js
//      allows (0.8 mm of head, 1e-5 of the largest flow), and a water age or a concentration carried
//      along a path inherits that: a small flow differing by 0.1 percent moves a travel time by 0.1
//      percent, and a junction where two waters meet moves with the ratio of their flows. So each case
//      states its own tolerance (`tol`, in the frame's unit: seconds of age, percentage points of a
//      source share, the chemical's own unit) for every node and link at every reporting time, set from
//      the measured gap with headroom and stated in the case's name where it is not the default.
//
// EVERY CASE MUST EXERCISE WHAT IT NAMES (`exercised`): an age case asserts EPANET's own ages reached
// a stated value somewhere, a trace case that the share is spread (some node between 1 and 99 percent),
// a chemical case that the concentration moved (from its start, from a source, by a reaction), so a
// case that quietly carries nothing fails instead of passing on zeros.
//
// THE REFUSALS. Without `{quality: true}` the loop refuses any quality run (the page keeps quality on
// EPANET until slice 7 says otherwise); with it, what the pass cannot copy is refused by name.

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
const TRUTH = require('./native-eps-quality-truth.js');

const LPS = 0.001;
const H = 3600;
const OVER_REL = 1e-8;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

// ---- constructed networks (the shapes native-eps-harness.js uses) -----------------------------------
const pipe = (id, from, to, length, diameter, c) =>
	({ id, type: 'pipe', from, to, length, diameter, roughness: c || 130, k: 0, status: 'open' });
const jn = (id, elev, demandLps, pattern) => ({ id, type: 'junction', elev, demand: (demandLps || 0) * LPS,
	demandBase: (demandLps || 0) * LPS, demandPattern: pattern || null });
const reservoir = (id, head, pattern) => ({ id, type: 'reservoir', elev: head, head, headBase: head, headPattern: pattern || null });
const tank = (id, base, level, min, max, dia) => ({ id, type: 'tank', elev: base, ground: base, head: base + level,
	level, minLevel: min, maxLevel: max, diameter: dia });
const pat = (id, multipliers) => ({ id, multipliers });
const pumpLink = (id, from, to, pts) => Object.assign({ id, type: 'pump', from, to, diameter: 0.3, status: 'open', k: 0 },
	EngCalcs.lpnPumpFromCurve(pts));
const ctl = (link, action, condition) => ({ link, action, condition });
const at = (h) => ({ kind: 'time', seconds: Math.round(h * H) });
const ifNode = (node, cmp, value) => ({ kind: 'node', node, cmp, value });
const OPEN_ = { status: 'open' }, SHUT = { status: 'closed' };

function constructed(o) {
	return {
		method: 'hw', visc: 1.007e-6,
		nodes: o.nodes, links: o.links,
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), o.times), patterns: o.patterns || [],
			defaultPattern: null, controls: o.controls || [], warnings: [] },
		quality: o.quality
	};
}
const DAY = [0.2, 0.2, 0.2, 0.3, 0.5, 1.0, 1.6, 2.0, 1.8, 1.4, 1.2, 1.1, 1.2, 1.3, 1.2, 1.1, 1.3, 1.8, 2.2, 2.0, 1.4, 0.8, 0.4, 0.2];
const T48 = { duration: 48 * H, hydraulicStep: H, patternStep: H, reportStep: H };
// R (80 m) -> P1 -> J (30 L/s on a pattern) -> P2 -> T: the tank fills on light demand and drains on heavy.
function lineWithTank(o) {
	const m = constructed({
		nodes: [reservoir('R', o.rHead || 80), jn('J', 10, o.q || 30, 'D'), tank('T', 60, o.level || 4, 0.5, o.max || 12, o.dia || 18)],
		links: [pipe('P1', 'R', 'J', 1200, 0.3), pipe('P2', 'J', 'T', 800, 0.25)],
		patterns: [pat('D', DAY)],
		times: o.times || T48, quality: o.quality
	});
	if (o.mixing) { m.nodes[2].mixing = o.mixing; }
	return m;
}
// One pipe from a reservoir to a junction drawing a constant 20 L/s: the age at the far end, once the
// pipe has flushed, is the pipe's volume over the flow (70.686 m3 / 0.02 m3/s = 3534.3 s).
function onePipe(q) {
	return constructed({
		nodes: [reservoir('R', 60), jn('J', 0, 20)],
		links: [pipe('P', 'R', 'J', 1000, 0.3)],
		times: { duration: 6 * H, hydraulicStep: H, patternStep: H, reportStep: H }, quality: q
	});
}
// A loop fed from two reservoirs: R1 holds 100 m; R2 swings 94 to 106 m on its head pattern, so the
// middle pipe PM carries water one way in the morning and the other way in the afternoon (flow
// reversal: qualroute.c reversesegs()). JD hangs off J2 on a dead-end pipe with no demand (no flow:
// noflowqual()).
function twoSources(q, extra) {
	q = q || { mode: 'age' };
	const m = constructed({
		nodes: [reservoir('R1', 100), reservoir('R2', 100, 'RH'), jn('J1', 20, 15, 'D'), jn('J2', 20, 10, 'D'),
			jn('J3', 22, 12, 'D'), jn('JD', 18, 0)],
		links: [pipe('P1', 'R1', 'J1', 1500, 0.3), pipe('PM', 'J1', 'J2', 1200, 0.2), pipe('P2', 'R2', 'J2', 1500, 0.3),
			pipe('P3', 'J1', 'J3', 900, 0.15), pipe('P4', 'J3', 'J2', 900, 0.15), pipe('PD', 'J2', 'JD', 300, 0.1)],
		patterns: [pat('D', DAY), pat('RH', [0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.0, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.05, 1.04, 1.03, 1.02, 1.01, 1.0, 0.99, 0.98, 0.97, 0.96, 0.95])],
		times: T48, quality: q
	});
	return Object.assign(m, extra || {});
}
// Low reservoir R -> pump PU -> J -> P2 -> tank T, a second supply P3 from R2 through a check valve, a
// PRV V on the way to K, and pump controls on the tank's level. Pumps and valves hold no water to
// EPANET, but its transport still lays segments in them (evalnodeoutflow()); a CV pipe neither reacts
// nor ages (reactpipes() skips anything that is not a PIPE).
function pumpedTank(q, mixing) {
	const m = constructed({
		nodes: [reservoir('R', 40), reservoir('R2', 75), jn('J', 10, 25, 'D'), jn('K', 5, 8, 'D'), tank('T', 60, 3, 0.5, 10, 15)],
		links: [pumpLink('PU', 'R', 'J', [[0, 70], [0.06, 55], [0.12, 20]]),
			pipe('P2', 'J', 'T', 800, 0.25),
			Object.assign(pipe('P3', 'R2', 'J', 2000, 0.25), { status: 'cv' }),
			{ id: 'V', type: 'valve', valveType: 'PRV', from: 'J', to: 'K', diameter: 0.2, setting: 30, k: 0, length: 0, roughness: 130, status: 'open' }],
		patterns: [pat('D', DAY)],
		times: T48, quality: q,
		controls: [ctl('PU', SHUT, ifNode('T', 'above', 8)), ctl('PU', OPEN_, ifNode('T', 'below', 2))]
	});
	if (mixing) { m.nodes[4].mixing = mixing; }
	return m;
}

// ---- EPA's examples, as the page builds them --------------------------------------------------------
function loadEpa(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	return { parsed, model: buildModel(EngCalcs, parsed) };
}
// A chemical run as the page hands it over: the file's [QUALITY] initial concentrations, [SOURCES],
// [REACTIONS] (the wall coefficient brought to metres for a first-order wall, js/looped-network.js
// engineQuality()) and [MIXING], and the Quality, Tolerance and Diffusivity options.
function epaChemical(file) {
	const { parsed, model } = loadEpa(file), sec = parsed.inpSections || {}, ft = parsed.scale.head;
	const qo = parsed.qualityOptions || {};
	model.quality = { mode: 'chemical', chemical: qo.quality };
	if (qo.tolerance !== undefined) { model.quality.tolerance = parseFloat(qo.tolerance); }
	if (qo.diffusivity !== undefined) { model.quality.diffusivity = parseFloat(qo.diffusivity); }
	(sec.QUALITY || []).forEach((ln) => {
		const w = String(ln).split(';')[0].trim().split(/\s+/);
		const n = model.nodes.find((x) => x.id === w[0]);
		if (n && isFinite(parseFloat(w[1]))) { n.initQuality = parseFloat(w[1]); }
	});
	const src = EngCalcs.lpnSourcesParse(sec.SOURCES || []);
	Object.keys(src).forEach((id) => { model.nodes.find((x) => x.id === id).source = src[id]; });
	const mix = EngCalcs.lpnMixingParse(sec.MIXING || []);
	Object.keys(mix).forEach((id) => { model.nodes.find((x) => x.id === id).mixing = mix[id]; });
	const re = EngCalcs.lpnReactionsParse(sec.REACTIONS || []);
	if (re.orderWall === undefined || re.orderWall === 1) {
		if (typeof re.globalWall === 'number') { re.globalWall *= ft; }
		Object.keys(re.wall).forEach((id) => { re.wall[id] *= ft; });
	}
	model.reactions = re;
	return model;
}

// ---- the comparison ----------------------------------------------------------------------------------
const UNIT = { age: 's', trace: '%', chemical: 'mg/L' };
function worstGap(framesA, framesB, which) {
	let d = 0, at = '-', rel = 0;
	framesA.forEach((fa, i) => {
		const fb = framesB[i], a = fa[which] || {}, b = (fb && fb[which]) || {};
		Object.keys(a).forEach((id) => {
			const x = Math.abs(a[id] - b[id]);
			if (!(x <= d)) { d = x; at = id + '@' + fa.t / H + 'h'; }
			const r = x / Math.max(1, Math.abs(a[id]));
			if (!(r <= rel)) { rel = r; }
		});
	});
	return { d, at, rel };
}
async function compare(c) {
	if (process.env.ONLY && c.name.indexOf(process.env.ONLY) < 0) { return; }
	const model = c.model, mode = model.quality.mode, unit = UNIT[mode];
	model.hydraulics = Object.assign({ accuracy: 1e-5 }, model.hydraulics || {});
	const epa = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	const nat = EngCalcs.lpnNativeRun(model, { quality: true });
	const saved = await TRUTH.savedHydraulics(EngCalcs, model);
	const over = EngCalcs.lpnNativeQualityOver(model, saved.recs, saved.vEnd);
	if (!epa.ok || !nat.ok || !over.ok) {
		ok(c.name, false, `ok native=${nat.ok} over=${over.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || over.issues || epa.issues || ''));
		return;
	}
	const sameSteps = (fr) => fr.length === epa.frames.length && fr.every((f, i) => f.t === epa.frames[i].t && f.qualities);
	// 2. the transcription, over EPANET's own hydraulics
	const on = worstGap(epa.frames, over.frames, 'qualities'), ol = worstGap(epa.frames, over.frames, 'linkQualities');
	ok(c.name + ' -- quality pass over EPANET\'s own saved hydraulics', sameSteps(over.frames) && on.rel <= OVER_REL && ol.rel <= OVER_REL,
		`node ${on.d.toExponential(2)} ${unit} @${on.at}  link ${ol.d.toExponential(2)} ${unit} @${ol.at} (tol ${OVER_REL} x max(1, |value|))`);
	// 3. end to end
	const nn = worstGap(epa.frames, nat.frames, 'qualities'), nl = worstGap(epa.frames, nat.frames, 'linkQualities');
	let hi = -Infinity, lo = Infinity, mid = 0;
	epa.frames.forEach((f) => { Object.values(f.qualities || {}).forEach((v) => { hi = Math.max(hi, v); lo = Math.min(lo, v); if (v > 1 && v < 99) { mid++; } }); });
	let exercised = true, why = '';
	if (c.reaches !== undefined) { exercised = hi >= c.reaches; why = `highest ${hi.toPrecision(5)} ${unit}`; }
	if (c.spread) { exercised = mid > 0; why = `${mid} node-frames between 1 and 99 %`; }
	if (c.falls !== undefined) { exercised = lo <= c.falls; why = `lowest ${lo.toPrecision(5)} ${unit}`; }
	if (c.check) { const r = c.check(epa, nat); exercised = exercised && r.ok; why += (why ? '; ' : '') + r.why; }
	const lt = c.linkTol || c.tol;
	ok(c.name + ' -- end to end', sameSteps(nat.frames) && nn.d <= c.tol && nl.d <= lt && exercised,
		`node ${nn.d.toExponential(2)} ${unit} @${nn.at} (tol ${c.tol})  link ${nl.d.toExponential(2)} ${unit} @${nl.at} (tol ${lt})` +
		(why ? `  [${why}${exercised ? '' : ' NOT EXERCISED'}]` : ''));
}

// ---- Q1: WATER AGE -----------------------------------------------------------------------------------
const AGE = { mode: 'age' };
const AGE_CASES = [
	{ name: 'age: one pipe, constant 20 L/s (the far end reaches the travel time, 3534.3 s)', model: onePipe(AGE), tol: 0.5, reaches: 3500,
		check: (e) => { const v = e.frames[e.frames.length - 1].qualities.J, want = Math.PI * 0.15 * 0.15 * 1000 / 0.02;
			return { ok: Math.abs(v - want) < 60, why: `J at 6 h ${v.toFixed(1)} s, volume / flow ${want.toFixed(1)} s` }; } },
	{ name: 'age: tank on a demand pattern, completely mixed, 48 h', model: lineWithTank({ quality: AGE }), tol: 1, reaches: 20 * H },
	{ name: 'age: the same tank, two compartments (mixing zone 0.3)', model: lineWithTank({ quality: AGE, mixing: { model: '2COMP', fraction: 0.3 } }), tol: 1, reaches: 20 * H },
	{ name: 'age: the same tank, first in first out', model: lineWithTank({ quality: AGE, mixing: { model: 'FIFO' } }), tol: 1, reaches: 20 * H },
	{ name: 'age: the same tank, last in first out', model: lineWithTank({ quality: AGE, mixing: { model: 'LIFO' } }), tol: 1, reaches: 20 * H },
	{ name: 'age: a tank that fills to its limit and stays full (FIFO)', model: lineWithTank({ quality: AGE, q: 12, level: 2, max: 3, dia: 10, mixing: { model: 'FIFO' } }), tol: 1, reaches: 5 * H },
	{ name: 'age: a tank that fills to its limit and stays full (LIFO)', model: lineWithTank({ quality: AGE, q: 12, level: 2, max: 3, dia: 10, mixing: { model: 'LIFO' } }), tol: 1, reaches: 5 * H },
	// linkTol: PD is the dead end (measured 34 s on an age of 48 h).
	{ name: 'age: a loop fed from two reservoirs, the middle pipe reversing twice a day, a dead end', model: twoSources(AGE), tol: 1, linkTol: 60, reaches: 24 * H,
		check: (e) => { const s = e.frames.map((f) => Math.sign(f.flows.PM)).filter((x, i, a) => i && x && a[i - 1] && x !== a[i - 1]).length;
			return { ok: s >= 2, why: `PM reversed ${s}x` }; } },
	// linkTol: P2 into the tank after the pump shuts at its control level (measured 6.4 s at 39 h).
	{ name: 'age: pumped tank with level controls, a check-valve pipe and a PRV', model: pumpedTank(AGE), tol: 1, linkTol: 10, reaches: 10 * H,
		check: (e) => { const s = e.frames.filter((f, i) => i && f.statuses.PU !== e.frames[i - 1].statuses.PU).length;
			return { ok: s >= 1, why: `PU switched ${s}x` }; } },
	// A 30-minute report step makes the hydraulic step 30 minutes too, and J1 then takes in the middle
	// pipe's front within a minute of its reversal: 7.1 s at 14:30 on an age of 7600 s. PD is the dead end.
	{ name: 'age: quality step stated (60 s), report step 30 min', model: (() => { const m = twoSources(AGE);
		m.time.times = Object.assign(m.time.times, { qualityStep: 60, reportStep: H / 2, duration: 24 * H }); return m; })(), tol: 10, linkTol: 20, reaches: 5 * H },
	{ name: 'age: hydraulic step 30 min, quality step its default (180 s)', model: (() => { const m = lineWithTank({ quality: AGE, mixing: { model: 'FIFO' } });
		m.time.times.hydraulicStep = H / 2; return m; })(), tol: 1, reaches: 20 * H }
];

// ---- Q2: SOURCE TRACE ---------------------------------------------------------------------------------
const trace = (node) => ({ mode: 'trace', traceNode: node });
const TRACE_CASES = [
	// linkTol: PD is the dead end (measured 0.02 percentage points at 48 h).
	{ name: 'trace: the share of reservoir R1 in a loop fed from two, the middle pipe reversing', model: twoSources(trace('R1')), tol: 0.01, linkTol: 0.05, spread: true },
	{ name: 'trace: from a junction (J1), which is held at 100 % whatever reaches it', model: twoSources(trace('J1')), tol: 0.01, linkTol: 0.05, spread: true },
	// The reservoir at 66 m against a tank standing at 64 m: the tank fills at night and drains into J
	// at the morning and evening peaks, so J takes a mix of the two.
	{ name: 'trace: from a tank that fills and drains, completely mixed', model: lineWithTank({ quality: trace('T'), rHead: 66 }), tol: 0.01, spread: true },
	{ name: 'trace: from a tank that fills and drains, first in first out', model: lineWithTank({ quality: trace('T'), rHead: 66, mixing: { model: 'FIFO' } }), tol: 0.01, spread: true },
	{ name: 'trace: the reservoir feeding a tank that fills and drains, last in first out', model: lineWithTank({ quality: trace('R'), rHead: 66, mixing: { model: 'LIFO' } }), tol: 0.01, spread: true },
	{ name: 'trace: the reservoir behind a check-valve pipe, with a pumped tank and a PRV', model: pumpedTank(trace('R2'), { model: '2COMP', fraction: 0.4 }), tol: 0.01, spread: true }
];

// ---- Q3: ONE CHEMICAL ---------------------------------------------------------------------------------
// The model carries what js/lpn-epanet.js writes for a chemical: `quality` {mode, chemical, tolerance,
// diffusivity}, a node's `initQuality` and `source` {type, quality, pattern}, a tank's `mixing`, and
// `reactions` (the globals, and per pipe `bulk`/`wall` and per tank `tank`, in 1/day and m/day).
const CHEM = (extra) => Object.assign({ mode: 'chemical', chemical: 'Chlorine mg/L' }, extra || {});
function chem(m, o) {
	m.quality = CHEM(o.quality);
	m.reactions = Object.assign({ bulk: {}, wall: {}, tank: {} }, o.reactions || {});
	(m.nodes || []).forEach((n) => { if (o.init && o.init[n.id] !== undefined) { n.initQuality = o.init[n.id]; } });
	Object.keys(o.sources || {}).forEach((id) => { m.nodes.find((n) => n.id === id).source = o.sources[id]; });
	if (o.patterns) { m.time.patterns.push(...o.patterns); }
	return m;
}
// twoSources with a junction JI drawing a NEGATIVE demand (an inflow of 6 L/s, the only place EPANET
// lets a CONCEN source act at a junction), joined to J3.
function twoSourcesWithInflow() {
	const m = twoSources(null);
	m.nodes.push(jn('JI', 22, -6));
	m.links.push(pipe('PI', 'JI', 'J3', 400, 0.1));
	return m;
}
const INIT1 = { R1: 1.0, R2: 0.6, J1: 0.5, J2: 0.5, J3: 0.5, JD: 0.5 };
const DECAY = { orderBulk: 1, orderWall: 1, globalBulk: -0.5, globalWall: -0.3 };
const SRCPAT = pat('SP', [1, 1.5, 0.5, 2, 1, 0.8]);
// The highest and lowest concentration EPANET reports anywhere, for the `check`s below.
const span = (e) => { let hi = -Infinity, lo = Infinity; e.frames.forEach((f) => Object.values(f.qualities).forEach((v) => { hi = Math.max(hi, v); lo = Math.min(lo, v); })); return { hi, lo }; };
const atNode = (id, h, want, tol) => (e) => { const f = e.frames.find((x) => x.t === h * H), v = f && f.qualities[id];
	return { ok: Math.abs(v - want) <= tol, why: `${id} at ${h} h ${v === undefined ? '-' : v.toFixed(4)} (expected about ${want})` }; };
// PD, the dead end of twoSources, carries EPANET's numerical-noise flow (see the header): its average
// moves by up to 2.1e-4 mg/L over two days, hence `linkTol: DEAD_END` on those cases.
const DEAD_END = 5e-4;
const CHEM_CASES = [
	{ name: 'chemical: initial quality only, no reaction (a conservative tracer of the start)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1 }), check: (e) => { const r = span(e); return { ok: r.hi <= 1 + 1e-9 && r.lo >= 0.5 - 1e-9 && r.lo < 0.6, why: `range ${r.lo.toFixed(3)} to ${r.hi.toFixed(3)}` }; } },
	{ name: 'chemical: first-order bulk decay only (-0.5/day)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, reactions: { globalBulk: -0.5 } }), falls: 0.35 },
	{ name: 'chemical: first-order wall decay only (-0.3 m/day), mass-transfer limited (diffusivity stated 1.0)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, quality: { diffusivity: 1.0 }, reactions: { globalWall: -0.3 } }), falls: 0.45 },
	{ name: 'chemical: bulk and wall together, per-pipe coefficients on PM and P3 (the rest global)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, reactions: Object.assign({}, DECAY, { bulk: { PM: -2 }, wall: { P3: -1.2 } }) }), falls: 0.3 },
	{ name: 'chemical: wall coefficient from the roughness correlation (F = -40, Hazen-Williams)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, reactions: { globalBulk: -0.2, roughnessCorrelation: -40 } }), falls: 0.35 },
	{ name: 'chemical: growth to a limiting potential (bulk +0.8/day, limit 2.0)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, reactions: { globalBulk: 0.8, limitingPotential: 2.0 } }), reaches: 1.05 },
	{ name: 'chemical: zero-order wall (-0.05 mg/m2/day), second-order bulk (-0.4)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, reactions: { orderBulk: 2, orderWall: 0, globalBulk: -0.4, globalWall: -0.05 } }), falls: 0.45 },
	{ name: 'chemical: diffusivity 0 (no mass-transfer limit, Sc = 0) and tolerance 0.001', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, quality: { diffusivity: 0, tolerance: 0.001 }, reactions: DECAY }), falls: 0.3 },
	// THE FOUR SOURCE TYPES (quality.c findsourcequal()), each on a network that otherwise starts at 0.
	{ name: 'chemical: CONCEN source at reservoir R1 (1.2 on a pattern), with decay', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { sources: { R1: { type: 'CONCEN', quality: 1.2, pattern: 'SP' } }, patterns: [SRCPAT], reactions: DECAY }), reaches: 1.0 },
	{ name: 'chemical: CONCEN source at a junction drawing a negative demand (JI, 2.0)', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSourcesWithInflow(), { sources: { JI: { type: 'CONCEN', quality: 2.0 } } }),
		check: (e) => { const v = Math.max(...e.frames.map((f) => f.qualities.J3)); return { ok: v > 0.1 && v < 2, why: `J3 peaks at ${v.toFixed(3)}` }; } },
	{ name: 'chemical: CONCEN at a junction with a positive demand adds nothing (J1)', tol: 1e-9,
		model: chem(twoSources(null), { sources: { J1: { type: 'CONCEN', quality: 2.0 } } }),
		check: (e) => { const r = span(e); return { ok: r.hi === 0, why: `highest ${r.hi}` }; } },
	{ name: 'chemical: MASS booster at J1 (60 mg/min on a pattern), with decay', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { sources: { J1: { type: 'MASS', quality: 60, pattern: 'SP' } }, patterns: [SRCPAT], reactions: DECAY }), reaches: 0.05 },
	{ name: 'chemical: SETPOINT booster at J3 (0.8) on decaying water', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, sources: { J3: { type: 'SETPOINT', quality: 0.8 } }, reactions: DECAY }), reaches: 0.79 },
	{ name: 'chemical: FLOWPACED booster at J2 (+0.3 on a pattern) on decaying water', tol: 1e-4, linkTol: DEAD_END,
		model: chem(twoSources(null), { init: INIT1, sources: { J2: { type: 'FLOWPACED', quality: 0.3, pattern: 'SP' } }, patterns: [SRCPAT], reactions: DECAY }), reaches: 0.9 },
	// TANKS: the four mixing models with a tank coefficient, the tank filling and draining (rHead 66).
	...[['MIXED'], ['2COMP', 0.3], ['FIFO'], ['LIFO']].map(([mx, fr]) => ({
		name: `chemical: a tank that fills and drains, ${mx}${fr ? ' ' + fr : ''}, tank coefficient -1.5/day, a CONCEN source at the reservoir`, tol: 1e-4,
		model: chem(lineWithTank({ rHead: 66, mixing: fr ? { model: mx, fraction: fr } : { model: mx } }),
			{ init: { T: 0.2, J: 0.2 }, sources: { R: { type: 'CONCEN', quality: 1.0 } }, reactions: { globalBulk: -0.3, globalWall: -0.2, tank: { T: -1.5 } } }),
		check: (e) => { const v = e.frames.map((f) => f.qualities.T); return { ok: Math.max(...v) - Math.min(...v) > 0.1, why: `tank from ${Math.min(...v).toFixed(3)} to ${Math.max(...v).toFixed(3)}` }; } })),
	{ name: 'chemical: a source AT the tank (SETPOINT 0.9) on its outflow, two compartments', tol: 1e-4,
		model: chem(lineWithTank({ rHead: 66, mixing: { model: '2COMP', fraction: 0.5 } }), { init: { R: 0.4 }, sources: { T: { type: 'SETPOINT', quality: 0.9 } }, reactions: { globalBulk: -0.5 } }),
		reaches: 0.55 },
	// An emitter's discharge is part of the junction's NodeDemand in the hydraulics file, so it is an
	// outflow the quality pass carries water out by.
	{ name: 'chemical: an emitter at J3 (0.0005 m3/s per m^0.5) with decay', tol: 1e-4, linkTol: DEAD_END,
		model: (() => { const m = chem(twoSources(null), { init: INIT1, reactions: DECAY }); m.nodes.find((n) => n.id === 'J3').emitter = 0.0005; return m; })(),
		falls: 0.3 },
	{ name: 'chemical: pumped tank with level controls, a check-valve pipe, a PRV, two reservoirs at different strengths', tol: 1e-4,
		model: chem(pumpedTank(null, { model: 'FIFO' }), { init: { R: 1.0, R2: 0.3, T: 0.5 }, reactions: DECAY }), falls: 0.35 }
];

async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	console.log('-- refusals');
	{
		const m = onePipe(AGE);
		ok('a quality run is refused without {quality: true} (the page keeps quality on EPANET)',
			EngCalcs.lpnNativeRunRefusals(m).some((r) => r.code === 'native-run-quality') && EngCalcs.lpnNativeRun(m).refused === true);
		ok('and runs with it', EngCalcs.lpnNativeRunRefusals(m, { quality: true }).length === 0);
		const msx = Object.assign(onePipe({ mode: 'msx' }), { msx: { text: '[TITLE]' } });
		ok('EPANET-MSX is refused either way', EngCalcs.lpnNativeRunRefusals(msx, { quality: true }).some((r) => r.code === 'native-run-quality'));
		const fast = onePipe(AGE); fast.time.times.hydraulicStep = 5;
		ok('a quality step that comes to 0 (hydraulic step under 10 s, none stated) is refused by name',
			EngCalcs.lpnNativeRunRefusals(fast, { quality: true }).some((r) => r.code === 'native-run-quality' && r.ids[0] === 'Quality Timestep'));
		const tr = onePipe({ mode: 'trace', traceNode: 'NOPE' });
		ok('a trace on a node out of the run is refused by name', EngCalcs.lpnNativeRunRefusals(tr, { quality: true }).some((r) => r.ids[0] === 'NOPE'));
		const mx = lineWithTank({ quality: AGE, mixing: { model: 'STIRRED' } });
		ok('a mixing model EPANET does not know is refused by name (error 213)', EngCalcs.lpnNativeRunRefusals(mx, { quality: true }).some((r) => r.ids[0] === 'T'));
	}

	console.log('-- Q1: water age, constructed networks');
	for (const c of AGE_CASES) { await compare(c); }

	console.log('-- Q1: water age, EPA\'s examples');
	// Net3: tank 1's control fires at 21:19:39 in the built-in loop and 21:19:40 in EPANET (the two
	// round the time to the level to opposite sides of a second, native-eps-plan.md slice 5). One second
	// of 100 L/s through pipe 133, which reversed at 22:00 onto water 50 000 s older, is its 65 s; node
	// 109 is downstream of it (15.8 s at 23:00 on 27 800 s).
	for (const [file, tol, linkTol, reaches] of [['Net1.inp', 1, 1, 20 * H], ['Net2.inp', 3, 3, 40 * H], ['Net3.inp', 25, 100, 20 * H]]) {
		const m = loadEpa(file).model; m.quality = AGE;
		await compare({ name: `age: ${file}`, model: m, tol, linkTol, reaches });
	}

	console.log('-- Q2: source trace, constructed networks');
	for (const c of TRACE_CASES) { await compare(c); }

	console.log('-- Q2: source trace, EPA\'s examples');
	// Net3 at 0.1 percentage point: the same one-second control time as its age case above (pipe 133,
	// just reversed, 0.094 at 22:00), and node 273 at 14:00 (0.070), where the front of Lake water is
	// arriving through pipe 319 at 1.2 L/s at that hour and meets 11 percent water from pipe 235.
	for (const [file, node, tol, linkTol] of [['Net3.inp', 'Lake', 0.1, 0.1], ['Net3.inp', 'River', 0.1, 0.1], ['Net2.inp', '1', 0.01, 0.01],
		['Net1.inp', '9', 0.01, 0.01], ['Net1.inp', '2', 0.01, 0.01]]) {
		const m = loadEpa(file).model; m.quality = trace(node);
		await compare({ name: `trace: ${file} from ${node}`, model: m, tol, linkTol, spread: true });
	}

	console.log('-- Q3: one chemical, constructed networks');
	for (const c of CHEM_CASES) { await compare(c); }

	console.log('-- Q3: one chemical, EPA\'s examples');
	await compare({ name: 'chemical: Net1 as shipped (chlorine, bulk -0.5/day, wall -1 ft/day, initial 0.5 and 1.0)', model: epaChemical('Net1.inp'), tol: 1e-4, falls: 0.3 });
	// Net2 at 0.005 mg/L, half its own merge tolerance. Its source pattern steps the fluoride by exactly
	// 0.01 mg/L, which IS the Tolerance it states, so whether evalnodeoutflow() merges the new water
	// into the last segment (|0.09 - 0.08| < 0.01) is decided in the last bit of a double. At 31:00
	// pipe 1's upstream segment reads 0.09000000000000001 in one run and 0.08999999999999998 in the
	// other, one merges and one does not, and pipe 1 and node 2 differ by 0.0028 mg/L from 32:00.
	// Measured by swapping single built-in hydraulic records into the EPANET-hydraulics pass: the one at
	// 18:00 (pipe 1 stagnant, 5e-8 against -1e-6 cfs of numerical noise), or at 20:00 or 23:00 (flows
	// 1e-7 apart), each alone flips that merge.
	await compare({ name: 'chemical: Net2 as shipped (fluoride, a CONCEN source at junction 1 on pattern 3, no reaction)', model: epaChemical('Net2.inp'), tol: 5e-3,
		check: (e) => { const r = span(e); return { ok: r.lo < 0.5 && r.hi > 0.99, why: `range ${r.lo.toFixed(3)} to ${r.hi.toFixed(3)}` }; } });
	{
		// Net3 with chlorine at both sources (Lake 1.0, River 0.8 as initial quality), first-order decay.
		const { model: m } = loadEpa('Net3.inp');
		chem(m, { init: { Lake: 1.0, River: 0.8 }, reactions: { globalBulk: -0.3, globalWall: -0.15 } });
		await compare({ name: 'chemical: Net3 with chlorine at Lake (1.0) and River (0.8), bulk -0.3/day, wall -0.15 m/day', model: m, tol: 1e-3, linkTol: 1e-3, reaches: 0.7 });
	}

	console.log('-- Q3: refusals');
	{
		const a = chem(twoSources(null), { sources: { J1: { type: 'BOOST', quality: 1 } } });
		ok('a source type EPANET does not know is refused by name (error 213)', EngCalcs.lpnNativeRunRefusals(a, { quality: true }).some((r) => r.ids.indexOf('J1') >= 0));
		const b = chem(twoSources(null), { sources: { J1: { type: 'MASS', quality: 1, pattern: 'NOPE' } } });
		ok('a source on a pattern the model lacks is refused by name (error 205)', EngCalcs.lpnNativeRunRefusals(b, { quality: true }).some((r) => r.ids.indexOf('J1') >= 0));
	}

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(1); });

// A PUMP CURVE OF ANY NUMBER OF POINTS IS THE SAME PUMP IN BOTH ENGINES. Run with:
//   node dev/lpn-spike/pump-curve-multipoint-harness.js
//
// EPANET 2.3.5 reads a pump curve as a power law only when it has one point, or three starting at
// zero flow (validate.c pumpcurvepump()); any other curve is CUSTOM, used as straight segments
// between its points and extended past either end (hydcoeffs.c pumpcoeff(), curvecoeff()). The
// built-in solver used to fit three points to every curve -- a parabola through two, a free fit
// through three not starting at zero, the lowest, middle and highest of a longer one -- so those
// pumps ran differently in the two engines.
//
// Each case is an .inp written here, opened the way a visitor opens one (lpnInpParse, docFromInp,
// applySaved, assembleModel), and solved by the built-in solver. The reference is the vendored
// EPANET 2.3.5 run DIRECTLY on the same text, with no code of ours between the file and the engine.
// The page's own EPANET bridge (lpnSolveEpanet / lpnEpanetRun) is held to the same reference.
// Heads within 0.8 mm, flows within 1e-5 relative. Cases: 1, 2, 3 (with and without zero first
// flow), 4 and 6 points; speeds 0.85 and 1.1; a flow past the curve's last point; and an
// extended-period run on the 6-point curve through js/lpn-native-run.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tcurrentModel: function () { return assembleModel(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;

const HEAD_TOL = 0.8e-3, FLOW_TOL = 2e-6, FLOW_REL = 1e-5, H = 3600, LPS = 0.001;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

// R1 (head 100 m) -> pump PU -> J1 -> pipe P1 -> J2 (demand) -> pipe P2 -> R2 or tank T1.
// Flow L/s, head m: an LPS file, so a flow crosses at 0.001 and a head unchanged.
function fileFor(curve, opt) {
	const o = Object.assign({ r2: 125, speed: null, eps: false, demand: 10 }, opt || {});
	const rows = curve.map((p) => ` C1  ${p[0]}  ${p[1]}`).join('\n');
	const tail = o.eps ? 'T1' : 'R2';
	return `[TITLE]\npump curve harness\n
[JUNCTIONS]\n J1  100  0\n J2  105  ${o.demand}  ${o.eps ? 'D1' : ''}\n
[RESERVOIRS]\n R1  100\n${o.eps ? '' : ' R2  ' + o.r2 + '\n'}
[TANKS]\n${o.eps ? ' T1  120  3  1  6  25  0\n' : ''}
[PIPES]\n P1  J1  J2  400  300  130  0  Open\n P2  J2  ${tail}  600  300  130  0  Open\n
[PUMPS]\n PU  R1  J1  HEAD C1${o.speed !== null ? '  SPEED ' + o.speed : ''}\n
[CURVES]\n;PUMP: harness pump\n${rows}\n
[PATTERNS]\n D1  0.5  1.5  3  0.2\n
[TIMES]\n Duration  ${o.eps ? '24:00' : '0'}\n Hydraulic Timestep  1:00\n Pattern Timestep  6:00\n Report Timestep  1:00\n
[OPTIONS]\n Units  LPS\n Headloss  H-W\n Accuracy  0.00001\n
[COORDINATES]\n R1  0  0\n J1  10  0\n J2  50  0\n ${tail}  100  0\n
[END]\n`;
}

let mod = null;
async function rawRun(text, eps) {
	const ws = new mod.Workspace();
	await ws.loadModule();
	ws.writeFile('r.inp', text);
	const p = new mod.Project(ws);
	p.open('r.inp', 'r.rpt', 'r.out');
	p.openH(); p.initH(0);
	const out = {};
	const nn = p.getCount(0), nl = p.getCount(2);
	for (;;) {
		const t = p.runH();
		if (t % H === 0) {
			const h = {}, q = {};
			for (let i = 1; i <= nn; i++) { h[p.getNodeId(i)] = p.getNodeValue(i, 10); }   // EN_HEAD, m
			for (let i = 1; i <= nl; i++) { q[p.getLinkId(i)] = p.getLinkValue(i, 8) * LPS; }   // EN_FLOW
			out[t] = { h, q };
		}
		if (!eps || p.nextH() <= 0) { break; }
	}
	p.closeH(); p.close();
	return out;
}

function pageModel(text, name, eps) {
	const parsed = EC.lpnInpParse(text);
	if (!parsed.ok) { throw new Error(name + ': ' + parsed.error); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, name);
	L.applySaved(doc);
	L.buildDom();
	if (eps) { EC.lpnTimeArrived(); }
	const m = L.currentModel();
	m.hydraulics = Object.assign({}, m.hydraulics || {}, { accuracy: 1e-5 });
	delete m.energy;
	return m;
}

function worst(model, heads, flows, ref) {
	const w = { h: 0, ha: '', q: 0, qa: '', bad: false };
	model.nodes.forEach((n) => {
		const d = Math.abs(heads[n.id] - ref.h[n.id]);
		if (!(d <= w.h)) { w.h = d; w.ha = n.id; }
	});
	model.links.forEach((l) => {
		const r = ref.q[l.id], d = Math.abs(flows[l.id] - r);
		if (!(d <= Math.max(FLOW_TOL, FLOW_REL * Math.abs(r)))) { w.bad = true; }
		if (!(d <= w.q)) { w.q = d; w.qa = l.id; }
	});
	w.pass = w.h <= HEAD_TOL && !w.bad;
	return w;
}
const said = (w) => `dH=${w.h.toExponential(2)} m @${w.ha}  dQ=${w.q.toExponential(2)} m3/s @${w.qa}`;

async function instant(name, curve, opt, check) {
	const text = fileFor(curve, opt);
	const ref = (await rawRun(text, false))[0];
	const model = pageModel(text, 'pump-' + name, false);
	const nat = EC.lpnSolve(model);
	const epa = await EC.lpnSolveEpanet(model, { moduleUrl: NODE_ENGINE_URL });
	if (!nat.ok || !epa.ok) { ok(name, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || '')); return; }
	const wn = worst(model, nat.heads, nat.flows, ref), we = worst(model, epa.heads, epa.flows, ref);
	ok(name + ': built-in solver = EPANET on the file', wn.pass && nat.converged,
		`Q(PU)=${(ref.q.PU / LPS).toFixed(3)} L/s  ${said(wn)}`);
	ok(name + ': the page\'s EPANET bridge = EPANET on the file', we.pass, said(we));
	if (check) { check(ref, model); }
}

async function extended(name, curve, opt) {
	const text = fileFor(curve, Object.assign({ eps: true }, opt || {}));
	const ref = await rawRun(text, true);
	const model = pageModel(text, 'pump-eps-' + name, true);
	const refused = EC.lpnNativeRunRefusals(model);
	ok(name + ': the built-in loop takes it', refused.length === 0, JSON.stringify(refused));
	const nat = EC.lpnNativeRun(model);
	const epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	if (!nat.ok || !epa.ok) { ok(name, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || '')); return; }
	function sweep(run) {
		const w = { h: 0, ha: '', q: 0, qa: '', bad: false, steps: 0, pass: true };
		run.frames.forEach((f) => {
			if (!ref[f.t]) { return; }
			w.steps++;
			const s = worst(model, f.heads, f.flows, ref[f.t]);
			if (s.h > w.h) { w.h = s.h; w.ha = s.ha + '@' + f.t / H + 'h'; }
			if (s.q > w.q) { w.q = s.q; w.qa = s.qa + '@' + f.t / H + 'h'; }
			if (!s.pass) { w.pass = false; }
		});
		w.pass = w.pass && w.steps === Object.keys(ref).length;
		return w;
	}
	const wn = sweep(nat), we = sweep(epa);
	ok(name + ': built-in loop = EPANET on the file, every hour', wn.pass, `${wn.steps}/${Object.keys(ref).length} h  ${said(wn)}`);
	ok(name + ': the page\'s EPANET run = EPANET on the file, every hour', we.pass, `${we.steps}/${Object.keys(ref).length} h  ${said(we)}`);
}

const SIX = [[0, 46], [20, 45.5], [40, 43.5], [60, 40], [80, 34], [100, 25]];

(async function () {
	setUnitSet('si');
	L.buildLayers();
	L.seedDefaultInputs();
	await warmEpanet();
	mod = await EC.lpnEpanetLoad(NODE_ENGINE_URL);

	console.log('-- EPANET\'s reading of each curve (lpnPumpFromCurve)');
	ok('1 point is a power law', !EC.lpnPumpFromCurve([[50, 30]]).custom);
	ok('1 point: b is EPANET\'s ln(1.33334/0.33334)/ln 2, not 2',
		Math.abs(EC.lpnPumpFromCurve([[50, 30]]).b - Math.log(1.33334 / 0.33334) / Math.LN2) < 1e-12);
	ok('3 points from zero flow is a power law', !EC.lpnPumpFromCurve([[0, 45], [50, 38], [90, 20]]).custom);
	ok('2 points is custom', !!EC.lpnPumpFromCurve([[0, 40], [80, 20]]).custom);
	ok('3 points not from zero is custom', !!EC.lpnPumpFromCurve([[20, 42], [50, 36], [90, 20]]).custom);
	ok('6 points is custom', !!EC.lpnPumpFromCurve(SIX).custom);

	console.log('-- one instant');
	await instant('1 point', [[50, 30]], { r2: 120 });
	await instant('2 points', [[0, 40], [80, 20]]);
	await instant('3 points from zero flow', [[0, 45], [50, 38], [90, 20]]);
	await instant('3 points not from zero flow', [[20, 42], [50, 36], [90, 20]]);
	await instant('4 points', [[0, 45], [30, 43], [60, 37], [90, 25]]);
	await instant('6 points', SIX);
	await instant('6 points, speed 0.85', SIX, { speed: 0.85, r2: 115 });
	await instant('6 points, speed 1.1', SIX, { speed: 1.1 });
	await instant('4 points, speed 0.9', [[0, 45], [30, 43], [60, 37], [90, 25]], { speed: 0.9, r2: 120 });
	await instant('6 points, flow past the last point', SIX, { r2: 90, demand: 0 }, (ref) => {
		ok('  ...and the flow really is past it', ref.q.PU / LPS > 100, (ref.q.PU / LPS).toFixed(2) + ' L/s');
	});
	await instant('2 points, flow past the last point', [[0, 40], [80, 20]], { r2: 95, demand: 0 }, (ref) => {
		ok('  ...and the flow really is past it', ref.q.PU / LPS > 80, (ref.q.PU / LPS).toFixed(2) + ' L/s');
	});

	console.log('-- extended period (js/lpn-native-run.js)');
	await extended('6 points, 24 h into a tank', SIX);
	await extended('2 points at speed 0.95, 24 h into a tank', [[0, 40], [80, 20]], { speed: 0.95 });

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

// THE SHIPPED EPANET EXAMPLES, RUN THROUGH THE PAGE, GIVE EPANET'S OWN ANSWER AT EVERY HOUR.
//
//   node dev/lpn-spike/examples-vs-epanet-harness.js
//
// For each gallery copy of an EPA network (Net1, Net2, Net3, Net3-Novato-CA-World) this opens the
// .lwn the way the gallery does (migrateSaved, applySaved), builds the model the page builds
// (assembleModel) and runs it through the page's EPANET bridge (lpnEpanetRun). The reference is the
// vendored engine run DIRECTLY on EPA's own .inp in dev/lpn-spike/reference/, with no code of ours
// between the file and the engine. Every node head, every tank level and every link flow is
// compared at every hour.
//
// **NET1 DEPARTS FROM EPA'S Net1 FROM 10 AM, BY DESIGN.** The gallery copy carries two [RULES] Tom
// asked for on 2026-09-08 (net1-rules-harness.js) so the rule editor can be tried from the
// gallery. So its reference is Net1.inp PLUS those same two rules, appended as text. A review that
// compares the example with the bare Net1.inp will see pipe 110 reverse at 10:00 and conclude the
// controls are misread; they are not, and section 2 below proves the bare comparison does differ.
//
// Compared in SI against the page's own frames: a head in feet times 0.3048, a flow through the
// parser's own `scale.flow` for that file, so no hand-typed psi factor adds slack.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tmigrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');
const EC = global.EngCalcs;

// EPANET carries heads in single precision; our bridge writes an LPS file, so a flow crosses one
// unit conversion and back. Measured worst on master 2026-10-04: 0.000 ft of head, 0.069 gpm
// (Net3 link 283, of ~1000 gpm).
const HEAD_TOL_M = 0.003;		// ~0.01 ft
const FLOW_TOL_SI = 0.1 / 15850.32;	// 0.1 gpm, in m3/s
const FLOW_REL = 1e-4;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

let mod = null;
async function rawRun(inpText) {
	const ws = new mod.Workspace();
	await ws.loadModule();
	ws.writeFile('r.inp', inpText);
	const p = new mod.Project(ws);
	p.open('r.inp', 'r.rpt', 'r.out');
	p.openH(); p.initH(0);
	const out = {};
	const nn = p.getCount(0), nl = p.getCount(2);
	for (;;) {
		const t = p.runH();
		if (t % 3600 === 0) {
			const h = {}, q = {};
			for (let i = 1; i <= nn; i++) { h[p.getNodeId(i)] = p.getNodeValue(i, 10); }	// EN_HEAD
			for (let i = 1; i <= nl; i++) { q[p.getLinkId(i)] = p.getLinkValue(i, 8); }	// EN_FLOW
			out[t] = { h, q };
		}
		if (p.nextH() <= 0) { break; }
	}
	p.closeH(); p.close();
	return out;
}

function openExample(name, edit) {
	const saved = JSON.parse(fs.readFileSync(ROOT + 'examples/' + name + '.lwn', 'utf8'));
	if (edit) { edit(saved); }
	L.applySaved(L.migrateSaved(saved));
	return saved;
}

// Worst head, level and flow difference between the page's run and the raw run, over every hour.
async function compare(name, inpText, edit) {
	const parsed = EC.lpnInpParse(inpText);
	const ftToM = parsed.scale.head, qToSI = parsed.scale.flow;
	const ref = await rawRun(inpText);
	openExample(name, edit);
	const model = L.assembleModel();
	const run = await EC.lpnEpanetRun(model, {});
	const elev = {};
	model.nodes.forEach((n) => { elev[n.id] = n.elev; });
	const w = { frames: 0, h: 0, ha: '', lvl: 0, la: '', q: 0, qa: '', n: 0, ok: !!run.ok };
	(run.frames || []).forEach((f) => {
		const r = ref[f.t];
		if (!r) { return; }
		w.frames++;
		const at = (id) => id + ' at ' + f.t / 3600 + ' h';
		for (const id in r.h) {
			if (f.heads[id] === undefined) { continue; }
			w.n++;
			const d = Math.abs(f.heads[id] - r.h[id] * ftToM);
			if (d > w.h) { w.h = d; w.ha = at(id); }
			if (f.levels && f.levels[id] !== undefined) {
				const dl = Math.abs(f.levels[id] - (r.h[id] * ftToM - elev[id]));
				if (dl > w.lvl) { w.lvl = dl; w.la = at(id); }
			}
		}
		for (const id in r.q) {
			if (f.flows[id] === undefined) { continue; }
			const refQ = r.q[id] * qToSI;
			const d = Math.abs(f.flows[id] - refQ) / (FLOW_TOL_SI + FLOW_REL * Math.abs(refQ));
			if (d > w.q) { w.q = d; w.qa = at(id); }
		}
	});
	w.hours = Object.keys(ref).length;
	return w;
}
const passes = (w) => w.ok && w.frames === w.hours && w.h < HEAD_TOL_M && w.lvl < HEAD_TOL_M && w.q < 1;
const said = (w) => w.frames + '/' + w.hours + ' hours, worst head ' + (w.h / 0.3048).toFixed(4) +
	' ft (' + w.ha + '), level ' + (w.lvl / 0.3048).toFixed(4) + ' ft (' + w.la + '), flow ' +
	w.q.toFixed(3) + ' of tolerance (' + w.qa + ')';

(async function () {
	await warmEpanet();
	mod = await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const ref = (n) => fs.readFileSync(ROOT + 'dev/lpn-spike/reference/' + n + '.inp', 'utf8');
	const net1Rules = JSON.parse(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8')).rules;
	const net1WithRules = ref('Net1').replace('[RULES]', '[RULES]\n' + net1Rules.join('\n'));

	console.log('1. EACH SHIPPED EXAMPLE AGAINST EPANET ON EPA\'S OWN FILE');
	ok('the Net1 example still carries its two rules', net1Rules.filter((l) => /^RULE /.test(l)).length === 2);
	for (const [name, inp] of [['Net1', net1WithRules], ['Net2', ref('Net2')], ['Net3', ref('Net3')],
		['Net3-Novato-CA-World', ref('Net3')]]) {
		const w = await compare(name, inp);
		ok(name + ' matches EPANET at every hour', passes(w), said(w));
	}

	console.log('\n2. AND THE COMPARISON CAN FAIL');
	// The bare Net1.inp, without the example's rules: must differ, from 10 AM on.
	{
		const w = await compare('Net1', ref('Net1'));
		ok('Net1 example against the BARE Net1.inp differs (its rules act from 10 AM)', !passes(w), said(w));
	}
	// One control threshold moved: Net3's pump 335 starting at 18.1 ft instead of 17.1.
	{
		const w = await compare('Net3', ref('Net3'), (saved) => {
			const c = saved.controls.find((x) => x.link === '335' && x.condition && x.condition.cmp === 'below');
			c.condition.value += 1;
		});
		ok('Net3 with one control threshold moved by a foot is caught', !passes(w), said(w));
	}

	console.log(fails === 0 ? '\nexamples vs epanet harness: all checks passed'
		: '\nexamples vs epanet harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}()).catch((e) => { console.error(e); process.exit(1); });

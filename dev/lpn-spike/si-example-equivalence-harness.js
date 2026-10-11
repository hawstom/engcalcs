// THE SI TWINS OF Net2 AND Net3 SOLVE LIKE THEIR US ORIGINALS (ROADMAP Task 786). Run with:
//   node dev/lpn-spike/si-example-equivalence-harness.js
//
// Tom, 2026-10-11: convert Net2 and Net3 to SI. A converted file can be wrong silently -- a flow
// column left in gpm, a control threshold still in feet -- and open, draw and solve without a
// complaint. So each pair is opened the way the gallery opens it (migrateSaved, applySaved), built
// into the page's own model (assembleModel), and run three ways:
//   1. THE MODELS: every element's elevation, demand, length, diameter, tank level and pump point,
//      in the SI the engines read, compared one number at a time (this is where rounding shows).
//   2. A SINGLE INSTANT, by the built-in solver, where it can solve the network at all.
//   3. THE EXTENDED-PERIOD RUN through EPANET, every node head, tank level and link flow at every
//      reporting step, controls firing and tanks moving.
// Worst RELATIVE differences are printed and bounded. A mutation (one control threshold left in
// feet) must be caught, so the comparison can fail.
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
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
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// A relative difference that does not blow up where the quantity is ~0: scaled by the larger of
// the two values and by `floor`, the smallest value worth a relative statement in that quantity.
const rel = (a, b, floor) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), floor);
const worst = () => ({ v: 0, at: '' });
const note = (w, v, at) => { if (v > w.v) { w.v = v; w.at = at; } };

function open(file, edit) {
	setUnitSet(/-SI/.test(file) ? 'si' : 'us');
	const saved = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file, 'utf8'));
	if (edit) { edit(saved); }
	L.applySaved(L.migrateSaved(saved));
	return L.assembleModel();
}

// Floors, in SI: below these a number is rounding dust (1 mm of head, 1 mL/s of flow).
// A flow is judged as EPANET's own convergence is: a tolerance relative to the flow plus a floor of
// 0.001 L/s, because a loop's small flows are the difference of larger ones and amplify rounding.
const MODEL_REL = 1e-5, HEAD_ABS = 0.005, FLOW_REL = 1e-4, FLOW_ABS = 1e-6;

(async function () {
	await warmEpanet();
	await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const summary = [];

	for (const net of ['Net3', 'Net2']) {
		console.log('\n== ' + net + ': US original against its SI twin');
		const us = open(net + '.lwn'), si = open(net + '-SI.lwn');

		// 1. THE MODELS ---------------------------------------------------------------------
		const wm = worst();
		const num = (a, b, at, floor) => {
			if (typeof a !== 'number' && typeof b !== 'number') { return; }
			note(wm, rel(a, b, floor), at);
		};
		ok('same node and link ids, in order',
			us.nodes.map((n) => n.id).join() === si.nodes.map((n) => n.id).join()
			&& us.links.map((l) => l.id).join() === si.links.map((l) => l.id).join());
		us.nodes.forEach((a, i) => {
			const b = si.nodes[i];
			['elev', 'head', 'level', 'minLevel', 'maxLevel', 'diameter'].forEach((k) => {
				if (a[k] !== undefined) { num(a[k], b[k], 'node ' + a.id + ' ' + k, 1e-3); }
			});
			num(a.demand || 0, b.demand || 0, 'node ' + a.id + ' demand', 1e-6);
		});
		us.links.forEach((a, i) => {
			const b = si.links[i];
			['length', 'diameter', 'roughness', 'minorK'].forEach((k) => {
				if (a[k] !== undefined) { num(a[k], b[k], 'link ' + a.id + ' ' + k, 1e-6); }
			});
			(a.curve || a.curvePoints || []).forEach((p, j) => {
				const q = (b.curve || b.curvePoints)[j];
				num(p[0], q[0], 'link ' + a.id + ' curve x' + j, 1e-6);
				num(p[1], q[1], 'link ' + a.id + ' curve y' + j, 1e-3);
			});
		});
		ok('every converted input is within ' + MODEL_REL + ' relative',
			wm.v < MODEL_REL, 'worst ' + wm.v.toExponential(2) + ' (' + wm.at + ')');
		ok('the Hazen-Williams roughness is not touched',
			us.method === si.method && us.links.every((l, i) => l.roughness === si.links[i].roughness));
		summary.push(net + ' inputs: ' + wm.v.toExponential(2));

		// 2. A SINGLE INSTANT, built-in solver ---------------------------------------------
		const su = EC.lpnSolve(us, { tol: 1e-9 }), ss = EC.lpnSolve(si, { tol: 1e-9 });
		if (su.ok && ss.ok) {
			const wh = worst(), wq = worst();
			for (const id in su.heads) {
				note(wh, Math.abs(su.heads[id] - ss.heads[id]), 'node ' + id);
			}
			for (const id in su.flows) {
				note(wq, Math.abs(su.flows[id] - ss.flows[id]) / (FLOW_ABS / FLOW_REL + Math.abs(su.flows[id])), "link " + id);
			}
			ok('built-in single instant: heads agree', wh.v < HEAD_ABS,
				'worst ' + wh.v.toExponential(2) + ' m (' + wh.at + ')');
			ok('built-in single instant: flows agree', wq.v < FLOW_REL,
				'worst scaled ' + wq.v.toExponential(2) + ' (' + wq.at + ')');
			summary.push(net + ' built-in instant: head ' + wh.v.toExponential(2) + ' m, flow rel ' + wq.v.toExponential(2));
		} else {
			console.log('       (built-in solver declines this network: ' + JSON.stringify((su.issues || []).map((i) => i.code || i.message || i)).slice(0, 120) + '; EPANET covers it below)');
		}

		// 3. THE EXTENDED-PERIOD RUN, through EPANET ----------------------------------------
		const compareRuns = async (a, b) => {
			const ra = await EC.lpnEpanetRun(a, {}), rb = await EC.lpnEpanetRun(b, {});
			const w = { ok: ra.ok && rb.ok, frames: 0, same: ra.frames.length === rb.frames.length,
				h: worst(), lvl: worst(), q: worst(), qrel: worst(), tanksMoved: 0 };
			if (!w.same) { return w; }
			const lo = {}, hi = {};
			ra.frames.forEach((fa, i) => {
				const fb = rb.frames[i];
				w.frames++;
				const at = (id) => id + ' at ' + fa.t / 3600 + ' h';
				for (const id in fa.heads) { note(w.h, Math.abs(fa.heads[id] - fb.heads[id]), at(id)); }
				for (const id in fa.levels || {}) {
					note(w.lvl, Math.abs(fa.levels[id] - fb.levels[id]), at(id));
					lo[id] = Math.min(lo[id] === undefined ? Infinity : lo[id], fa.levels[id]);
					hi[id] = Math.max(hi[id] === undefined ? -Infinity : hi[id], fa.levels[id]);
				}
				for (const id in fa.flows) {
					note(w.qrel, Math.abs(fa.flows[id] - fb.flows[id]) / (FLOW_ABS / FLOW_REL + Math.abs(fa.flows[id])), at(id));
				}
			});
			for (const id in lo) { if (hi[id] - lo[id] > 0.1) { w.tanksMoved++; } }
			w.tanks = Object.keys(lo).length;
			return w;
		};
		const w = await compareRuns(us, si);
		ok('EPANET EPS ran both and gave the same number of steps', w.ok && w.same, w.frames + ' steps');
		ok('EPS: heads agree at every step', w.h.v < HEAD_ABS,
			'worst ' + w.h.v.toExponential(2) + ' m (' + w.h.at + ')');
		ok('EPS: tank levels agree at every step', w.lvl.v < HEAD_ABS,
			'worst ' + w.lvl.v.toExponential(2) + ' m (' + w.lvl.at + ')');
		ok('EPS: flows agree at every step', w.qrel.v < FLOW_REL,
			'worst scaled ' + w.qrel.v.toExponential(2) + ' (' + w.qrel.at + ')');
		ok('EPS: the tanks actually move (a flat run would agree with anything)',
			w.tanks > 0 && w.tanksMoved === w.tanks, w.tanksMoved + ' of ' + w.tanks);
		summary.push(net + ' EPS (' + w.frames + ' steps): head ' + w.h.v.toExponential(2) + ' m, level '
			+ w.lvl.v.toExponential(2) + ' m, flow rel ' + w.qrel.v.toExponential(2));

		// 4. THE COMPARISON CAN FAIL ---------------------------------------------------------
		if (net === 'Net3') {
			const bad = open('Net3-SI.lwn', (saved) => {
				const c = saved.controls.find((x) => x.link === '335' && x.condition && x.condition.cmp === 'below');
				c.condition.value = 17.1;	// left in feet
			});
			const wb = await compareRuns(us, bad);
			ok('a control threshold left in feet is caught',
				!(wb.ok && wb.same && wb.lvl.v < HEAD_ABS && wb.qrel.v < FLOW_REL),
				'level ' + wb.lvl.v.toExponential(2) + ' m, flow rel ' + wb.qrel.v.toExponential(2));
		}
	}

	console.log('\nWORST DIFFERENCES');
	summary.forEach((s) => console.log('  ' + s));
	console.log(fails === 0 ? '\nsi example equivalence harness: all checks passed'
		: '\nsi example equivalence harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}()).catch((e) => { console.error(e); process.exit(1); });

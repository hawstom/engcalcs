// A LOOP WITH NO SOURCE OR SINK CARRIES NO FLOW (ROADMAP Task 847). Run with:
//   node dev/lpn-spike/loop-circulation-harness.js
// Perry, 2026-10-27: on the Fire-flow-extension "1. Flow test: Static" scenario the built-in solver
// left 3.18 gpm going round the closed loop with zero demand; EPANET left 0.07 gpm.
'use strict';
const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\trunSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tgetScenarios: function () { return scenarios; }, switchScenario: switchScenario,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");
const GPM = 15850.32;
let fails = 0;
function ok(name, cond, extra) { if (!cond) { fails++; } console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
async function solve(engine) { L.settings().engine = engine; L.runSolve(); await settleEpanet(); return L.lastResult(); }
(async function () {
	await warmEpanet();
	for (const f of [['Fire-flow-extension.lwn', 'us'], ['Fire-flow-extension-SI.lwn', 'si']]) {
		console.log('\n=== ' + f[0]);
		setUnitSet(f[1]);
		L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
		const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + f[0], 'utf8'));
		L.applySaved(saved); L.buildDom(); L.applyMethodUI();
		const scn = L.getScenarios().filter((s) => /Static/.test(s.name))[0];
		L.switchScenario(scn.id);
		const doc = L.getDoc();
		const pipes = doc.links.filter((l) => l.type === 'pipe');
		const out = {};
		for (const eng of ['native', 'epanet']) {
			const r = await solve(eng);
			// the loop pipes: the loop carries flow in the closed ring; report the largest |flow| in any pipe not on the supply path
			out[eng] = r;
			let mx = 0, id = '';
			pipes.forEach((l) => { const q = Math.abs(r.flows[l.id]) * GPM; if (q > mx) { mx = q; id = l.id; } });
			console.log('  ' + eng + ': converged=' + r.converged + ' largest pipe flow ' + mx.toFixed(4) + ' gpm (' + id + ')');
			console.log('     ' + pipes.map((l) => l.id + '=' + (r.flows[l.id] * GPM).toFixed(4)).join(' '));
			ok(eng + ': zero demand, so every pipe carries under 0.1 gpm', mx < 0.1, mx.toFixed(4) + ' gpm');
		}
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();

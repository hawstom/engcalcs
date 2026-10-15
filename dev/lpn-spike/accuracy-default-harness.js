// ACCURACY DEFAULTS TO 0.001, AND THE TIP SAYS SO (R-388, Task 796). Run with:
//   node dev/lpn-spike/accuracy-default-harness.js
//
// Tom, 2026-10-15, asked whether an empty Accuracy should mean EPANET's own 0.001 instead of 1e-5:
// *"Yes. And tip says 1e-9, so sync that."* Before this an empty box meant 1e-5 in the EPANET engine
// and 1e-9 in the built-in one, and the Settings tip quoted the 1e-9; his two-system project
// reported "did not converge" at 1e-5 and converged at 0.001.
//
// Held here, because each is quiet when it breaks:
//   1. An empty box solves at 0.001 in BOTH engines -- the EPANET half read back out of the engine.
//   2. The Settings tip quotes the same 0.001.
//   3. A project that STATES an Accuracy keeps it, and saves it back unchanged.
//   4. No shipped example still carries the deprecated `tolerance` 1e-9, which outranked the
//      default and made the tip on every gallery example say 1e-9.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

const L = loadLoopedNetwork(
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tsolveAccuracy: solveAccuracy,\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n"
);
const solverEC = require(ROOT + 'js/lpn-solver.js');
Object.keys(solverEC).forEach(function (k) { global.EngCalcs[k] = solverEC[k]; });
require(ROOT + 'js/lpn-epanet.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function all(root, out) {
	(root.children || []).forEach(function (c) { out.push(c); all(c, out); });
	return out;
}
function accuracyTip() {
	L.rebuildSettings();
	const want = PC.lpn_settings_accuracy_tip;
	// A tip armed by EngCalcs.initTips() moves from `title` to Bootstrap's own attribute.
	function tipOf(n) { return n.title || (n.dataset && n.dataset.bsOriginalTitle) || ''; }
	const hit = all(byId.lpn_set_hydraulics_fields, []).filter(n => tipOf(n).indexOf(want) === 0)[0];
	return hit ? tipOf(hit) : null;
}

console.log('\n--- an empty box ---');
{
	const set = L.getSettings();
	set.hydraulics = {};
	delete set.tolerance;
	ok('a project that states no Accuracy solves natively at 0.001', L.solveAccuracy() === 0.001,
		String(L.solveAccuracy()));
	const tip = accuracyTip();
	ok('...and the Settings tip quotes the same 0.001',
		!!tip && tip.endsWith(PC.lpn_settings_default_is.replace('{n}', '0.001')), JSON.stringify(tip));
	ok('...and never 1e-9 or 1e-5', !!tip && !/1e-9|1e-5/.test(tip), JSON.stringify(tip));
}

console.log('\n--- a stated Accuracy is the user\'s number ---');
{
	const set = L.getSettings();
	set.hydraulics = { accuracy: 1e-5 };
	ok('a project stating 1e-5 solves at 1e-5', L.solveAccuracy() === 1e-5, String(L.solveAccuracy()));
	accuracyTip();
	const saved = L.serialize();
	ok('...and saves 1e-5 back, untouched by opening Settings',
		saved.settings && saved.settings.hydraulics && saved.settings.hydraulics.accuracy === 1e-5,
		JSON.stringify(saved.settings && saved.settings.hydraulics));
	set.hydraulics = {};
}

console.log('\n--- no shipped example carries the deprecated tolerance ---');
{
	['examples', 'dev/water-network-examples'].forEach(function (dir) {
		fs.readdirSync(path.join(ROOT, dir)).filter(f => /\.lwn$/.test(f)).forEach(function (f) {
			const d = JSON.parse(fs.readFileSync(path.join(ROOT, dir, f), 'utf8'));
			ok(dir + '/' + f + ' states no settings.tolerance', !d.settings || d.settings.tolerance === undefined,
				String(d.settings && d.settings.tolerance));
		});
	});
}

function model(hyd) {
	return {
		method: 'hw', hydraulics: hyd,
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'A', type: 'junction', elev: 0, demand: 0.02 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0.03 }
		],
		links: [
			{ id: 'P1', type: 'pipe', from: 'R', to: 'A', length: 500, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
			{ id: 'P2', type: 'pipe', from: 'A', to: 'B', length: 800, diameter: 0.2, roughness: 120, k: 0, status: 'open' }
		]
	};
}

(async function () {
	console.log('\n--- the EPANET engine, read back from the engine ---');
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const blank = await EngCalcs.lpnSolveEpanet(model({}));
	ok('an empty Accuracy reaches EPANET as 0.001', blank.ok && blank.accuracy === 0.001, String(blank.accuracy));
	const stated = await EngCalcs.lpnSolveEpanet(model({ accuracy: 1e-5 }));
	ok('...and a stated 1e-5 reaches it as 1e-5', stated.ok && Math.abs(stated.accuracy - 1e-5) < 1e-12,
		String(stated.accuracy));
	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });

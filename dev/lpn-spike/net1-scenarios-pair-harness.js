// THE SHIPPED NET1 PAIR, EVERY SCENARIO: the SI card's pressures equal the US card's, converted.
//   node dev/lpn-spike/net1-scenarios-pair-harness.js
//
// Net1-Scenarios.lwn (gpm, ft, in) and Net1-Scenarios-SI.lwn (L/s, m, mm) are the two Net1 cards on the
// wall. The SI file is converted from the US one by dev/scripts/convert_example_to_si.js. A converted
// file can be wrong silently: on 2026-10-28 the tank's bottomElev stayed 850 (feet) beside an elevation
// of 259.08 m, and every junction read about 670 m of pressure while the file opened and solved without
// complaint. So the two SHIPPED files (examples/, what a visitor opens) are each opened the way the
// gallery opens them, and for every scenario both are run through EPANET for the whole day; each
// junction's pressure (head minus elevation, in metres) must agree at every reporting step to within the
// diameter rounding (Tom, 2026-10-13: nominal inches round to the nearest 50 mm). A mutation (bottomElev
// left in feet) must be caught, so the comparison can fail.
'use strict';
const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
global.alert = global.window.alert = function () { };
const L = loadLoopedNetwork(
	"\t\tmigrateSaved: migrateSaved, applySaved: applySaved, assembleModel: assembleModel,\n" +
	"\t\tgetScenarios: function () { return scenarios; }, switchScenario: switchScenario,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n");
L.buildLayers();
const EC = global.EngCalcs;
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// Metres of head. Base, where the tank barely moves, agrees to 0.65 m (measured 2026-10-28). In the busy
// scenarios the nominal diameters rounded down to 50 mm (12 in = 300 mm, 14 in = 350 mm) make the mains
// about 1.6% narrower, so the pump's tank-level controls fire an hour earlier or later and a junction
// differs by up to 10.6 m at that one step (Max day, node 10, 23 h): the same behaviour
// si-example-equivalence-harness.js documents for Net3. A bottomElev left in feet is off by 590 m, so
// the bound still catches it.
const PRESSURE_ABS = { Base: 1.0, other: 12.0 };
const tol = (name) => (name === 'Base' ? PRESSURE_ABS.Base : PRESSURE_ABS.other);

function load(file, mutate) {
	setUnitSet(/-SI\.lwn$/.test(file) ? 'si' : 'us');
	const saved = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file, 'utf8'));
	if (mutate) { mutate(saved); }
	L.applySaved(L.migrateSaved(saved));
	return L.getScenarios().map((s) => ({ id: s.id, name: s.name }));
}
async function frames(scn) {
	L.switchScenario(scn.id);
	const model = L.assembleModel();
	const r = await EC.lpnEpanetRun(model, {});
	const elev = {};
	model.nodes.forEach((n) => { if (n.type === 'junction' || n.kind === 'junction') { elev[n.id] = n.elev; } });
	if (!Object.keys(elev).length) { throw new Error('no junctions in the model: ' + JSON.stringify(model.nodes[0])); }
	return { ok: r.ok, frames: r.frames, elev, junctions: model.nodes.filter((n) => n.kind === 'junction' || n.type === 'junction').map((n) => n.id) };
}
async function compare(mutateSi) {
	const us = load('Net1-Scenarios.lwn');
	const usRuns = {};
	for (const s of us) { usRuns[s.name] = await frames(s); }
	const si = load('Net1-Scenarios-SI.lwn', mutateSi);
	const out = [];
	for (const s of si) {
		const a = usRuns[s.name], b = await frames(s);
		let worst = 0, at = '', max = 0, n = 0;
		if (a && a.ok && b.ok && a.frames.length === b.frames.length) {
			a.frames.forEach((fa, i) => {
				const fb = b.frames[i];
				Object.keys(fa.heads).forEach((id) => {
					if (a.elev[id] === undefined) { return; }
					const pu = fa.heads[id] - a.elev[id], ps = fb.heads[id] - b.elev[id];
					n++; max = Math.max(max, Math.abs(ps));
					if (Math.abs(pu - ps) > worst) { worst = Math.abs(pu - ps); at = id + ' at ' + fa.t / 3600 + ' h'; }
				});
			});
		} else { worst = Infinity; at = 'a run did not complete or the step counts differ'; }
		out.push({ name: s.name, worst, at, max, n });
	}
	return { us, si, out };
}
(async function () {
	await warmEpanet();
	await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const r = await compare();
	ok('both shipped files hold the same five scenarios', r.us.map((s) => s.name).join('|') === r.si.map((s) => s.name).join('|'), r.si.map((s) => s.name).join('|'));
	ok('there are five', r.si.length === 5, String(r.si.length));
	r.out.forEach((o) => {
		ok(o.name + ': every junction pressure at every step equals the US one within ' + tol(o.name) + ' m (' + o.n + ' values)',
			o.n > 0 && o.worst <= tol(o.name), 'worst ' + o.worst.toFixed(3) + ' m (' + o.at + ')');
		ok(o.name + ': the SI pressures are plausible, under 200 m', o.max < 200, 'highest ' + o.max.toFixed(1) + ' m');
	});
	const bad = await compare((d) => { d.nodes.forEach((n) => { if (n.type === 'tank') { n.bottomElev = 850; } }); });
	ok('a tank bottomElev left in feet is caught', bad.out.every((o) => !(o.worst <= tol(o.name))), bad.out.map((o) => o.worst.toFixed(1)).join(', '));
	console.log(fails === 0 ? '\nnet1 scenarios pair harness: all checks passed' : '\nnet1 scenarios pair harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}()).catch((e) => { console.error(e); process.exit(1); });

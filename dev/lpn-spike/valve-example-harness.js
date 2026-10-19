// THE VALVES EXAMPLE (Valves.lwn), HELD HEADLESS IN BOTH ENGINES -- Tom, 2026-10-18, of the branch
// that put every valve type in the built-in solver: "Is there an example or test file for this? An
// example with valves would be good."
//   node dev/lpn-spike/valve-example-harness.js
//
// The file is built by dev/scripts/build_valve_example.js out of dev/scripts/valve_example.inp. Opened
// through the real path, it is solved by the built-in solver and by EPANET, and each of the six valves
// must be doing its job, not standing open:
//   PBV1  head drop across it = 60 psi            PRV1  pressure at its downstream node = 45 psi
//   PSV1  pressure at its upstream node = 55 psi   FCV1  flow through it = 300 gpm
//   TCV1  head loss = K v^2/2g with K = 150        GPV1  head loss = the STRAINER curve at its flow
// The two engines agree to 0.5 psi at every node and 0.5 gpm in every link. And each controlling valve
// is shown to be CONTROLLING: with its setting made harmless (PBV 0 psi, PRV 500 psi, PSV 0 psi, FCV
// 5,000 gpm) the answer moves, so the setting is what held the number.
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\trunSolve: runSolve, assembleModel: assembleModel, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra ? '   ' + extra : '')); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const PSI_PER_M = 0.4333 / 0.3048;   // EPANET's own: 0.4333 psi per foot of water
const GPM = 15850.32;                // gpm per m3/s
const FT = 3.28084;

(async function main() {
	setUnitSet('us');
	L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
	await warmEpanet();
	const text = fs.readFileSync(path.join(ROOT, 'examples/Valves.lwn'), 'utf8');
	const saved = L.acceptImportedText(text);
	ok('the shipped file opens through the real import path', !!saved);
	L.applySaved(saved); L.buildDom(); L.applyMethodUI();
	const doc = L.getDoc();
	const types = {};
	doc.links.filter((l) => l.type === 'valve').forEach((l) => { types[l.valveType] = l.id; });
	ok('one valve of each of the six types', Object.keys(types).sort().join() === 'FCV,GPV,PBV,PRV,PSV,TCV', JSON.stringify(types));
	ok('every valve has a Description', doc.links.filter((l) => l.type === 'valve').every((l) => l.desc && l.desc.length > 20));
	const curve = (doc.curves || []).filter((c) => c.kind === 'headloss')[0];
	ok('the GPV names a HEADLOSS curve in the Library', !!curve && doc.links.filter((l) => l.valveType === 'GPV')[0]._curveId === curve.id, curve && curve.id);

	const R = {};
	for (const eng of ['native', 'epanet']) {
		L.settings().engine = eng;
		L.runSolve(); await settleEpanet();
		R[eng] = L.lastResult();
		ok(eng + ' converges', !!R[eng] && R[eng].converged === true, JSON.stringify(R[eng] && R[eng].issues));
		ok(eng + ' was solved by ' + (eng === 'epanet' ? 'EPANET' : 'the native engine'),
			eng === 'epanet' ? R[eng].engine === 'epanet' : !R[eng].engine, R[eng].engine);
	}
	const model = L.assembleModel();

	console.log('--- the engines agree');
	let wp = 0, wq = 0;
	doc.nodes.forEach((n) => { if (n.type !== 'reservoir') { wp = Math.max(wp, Math.abs(R.native.pressures[n.id] - R.epanet.pressures[n.id]) * PSI_PER_M); } });
	doc.links.forEach((l) => { wq = Math.max(wq, Math.abs(R.native.flows[l.id] - R.epanet.flows[l.id]) * GPM); });
	ok('pressures agree to 0.5 psi at every node', wp < 0.5, wp.toFixed(4) + ' psi');
	ok('flows agree to 0.5 gpm in every link', wq < 0.5, wq.toFixed(4) + ' gpm');
	ok('the built-in solver reports PBV1, PRV1, PSV1 and FCV1 active', ['PBV1', 'PRV1', 'PSV1', 'FCV1'].every((v) => R.native.valveStatus[v] === 'active'), JSON.stringify(R.native.valveStatus));

	for (const eng of ['native', 'epanet']) {
		console.log('--- each valve does its job: ' + eng);
		const r = R[eng], p = (id) => r.pressures[id] * PSI_PER_M, q = (id) => r.flows[id] * GPM;
		const head = (id) => r.heads[id], dropFt = (a, b) => (head(a) - head(b)) * FT;
		ok('PBV1 takes 60 psi off the line (J1 to J2)', Math.abs((head('J1') - head('J2')) * PSI_PER_M - 60) < 0.05, ((head('J1') - head('J2')) * PSI_PER_M).toFixed(3) + ' psi');
		ok('PRV1 holds its downstream node J4 at 45 psi', Math.abs(p('J4') - 45) < 0.05, p('J4').toFixed(3) + ' psi, upstream J3 ' + p('J3').toFixed(2) + ' psi');
		ok('PSV1 holds its upstream node J3 at 55 psi', Math.abs(p('J3') - 55) < 0.05, p('J3').toFixed(3) + ' psi');
		ok('FCV1 passes exactly 300 gpm', Math.abs(q('FCV1') - 300) < 0.05, q('FCV1').toFixed(3) + ' gpm');
		const v = q('TCV1') / GPM / (Math.PI * 0.1016 * 0.1016 / 4), lossM = 150 * v * v / (2 * 9.80665);
		const tcv = head('J3') - head('J8');
		ok('TCV1 loses K v^2/2g with K = 150', Math.abs(tcv - lossM) / lossM < 0.01, (tcv * FT).toFixed(2) + ' ft vs ' + (lossM * FT).toFixed(2) + ' ft at ' + q('TCV1').toFixed(1) + ' gpm');
		ok('...and that is a real throttle, over 5 psi', tcv * PSI_PER_M > 5, (tcv * PSI_PER_M).toFixed(2) + ' psi');
		const gq = q('GPV1'), pts = curve.points;
		let want = null;
		for (let i = 1; i < pts.length; i++) { if (gq <= pts[i][0]) { want = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (gq - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); break; } }
		ok('GPV1 loses what the STRAINER curve gives at its flow', want !== null && Math.abs(dropFt('J3', 'J10') - want) < 0.02, dropFt('J3', 'J10').toFixed(3) + ' ft vs ' + (want && want.toFixed(3)) + ' ft at ' + gq.toFixed(1) + ' gpm');
	}

	console.log('--- the settings are what hold the numbers (built-in solver, setting made harmless)');
	const EC = global.EngCalcs, solve = (m) => EC.lpnSolve(m, { tol: 1e-9, maxIter: 400 });
	const with_ = (id, setting) => { const m = JSON.parse(JSON.stringify(model)); m.links.filter((l) => l.id === id)[0].setting = setting; return solve(m); };
	const base = R.native, pm = (r, id) => r.pressures[id] * PSI_PER_M;
	const open = {
		PBV1: with_('PBV1', 0), PRV1: with_('PRV1', 500 / PSI_PER_M),
		PSV1: with_('PSV1', 0), FCV1: with_('FCV1', 5000 / GPM)
	};
	ok('PBV1 wide open: J2 sits 60 psi higher than it does with the breaker', pm(open.PBV1, 'J2') - pm(base, 'J2') > 30,
		pm(open.PBV1, 'J2').toFixed(1) + ' vs ' + pm(base, 'J2').toFixed(1) + ' psi');
	ok('PRV1 wide open: the low zone sees the hub pressure, well over 45 psi', pm(open.PRV1, 'J4') - 45 > 5, pm(open.PRV1, 'J4').toFixed(1) + ' psi');
	ok('PSV1 wide open: the hub drops below 55 psi', pm(base, 'J3') - pm(open.PSV1, 'J3') > 2, pm(open.PSV1, 'J3').toFixed(1) + ' psi');
	ok('FCV1 wide open: the customer pond draws far more than 300 gpm', open.FCV1.flows.FCV1 * GPM > 400, (open.FCV1.flows.FCV1 * GPM).toFixed(1) + ' gpm');

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

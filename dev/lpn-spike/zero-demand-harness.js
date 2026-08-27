// A real network whose demands are zeroed still solves. Run:
//   node dev/lpn-spike/zero-demand-harness.js
//
// Tom, 2026-08-17: he set Elm Street Center's two 750 gpm demands to 0 and got "No solution was
// found. Check for values that are impossible in real life, such as a diameter of zero." EPANET
// solved the same network. There is nothing impossible in it -- Newton reaches 3e-6 relative by
// iteration 7 and then sits on a NOISY roundoff plateau between 3e-6 and 1.2e-5 forever, and the
// stall escape's gate was a hardcoded `sumAbsDq < 1e-6 * demandScale` that this network cannot
// meet. Zeroing a demand did not break anything physical: it cut demandScale by 4x, which raises
// every RELATIVE measure by 4x, and 1e-6 happened to sit between the old plateau and the new one.
//
// **THIS HARNESS EXISTS BECAUSE THE FIRST ONE PASSED FOR THE WRONG REASON**, and that is the lesson
// worth more than the assertions (dev/testing-notes.md): the first attempt never called
// setUnitSet(), so every unit select answered a factor of 1 and the model was assembled with 1960
// *gpm* as 1960 *m3/s* -- flows ~16,000x too large. At that scale the absolute floors in the solver
// (lpnGradMin, absTol, and the gate above) are all effectively zero, so the guard under test never
// engaged and the bug reported from the browser could not be reproduced at all. A stub that removes
// the coupling makes a harness pass for the wrong reason; here the coupling removed was the UNIT
// SYSTEM, which is invisible in the solver's own code because everything there is already SI.
//
// So: SET THE UNITS, then assert the demand sum is in a physically plausible range before believing
// anything below it. If that first check fails, the rest of the file is meaningless.

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tassembleModel: assembleModel, getDoc: function () { return doc; },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

L.buildLayers();
setUnitSet('us');
L.applySaved(JSON.parse(fs.readFileSync(ROOT + 'examples/Elm-Street-Center.lwn', 'utf8')));
setUnitSet('us');

// The project's own settings, so this is the tolerance the page really solves at, not a loose one
// chosen here. 1e-9 is what defaultSettings() ships and what runSolve() passes.
const TOL = 1e-9;

function solve() {
	const model = L.assembleModel();
	return {
		model: model,
		demandSum: model.nodes.reduce((s, n) => s + (n.demand || 0), 0),
		result: EngCalcs.lpnSolve(model, { tol: TOL })
	};
}

console.log('\n--- the units are real, or nothing below means anything ---');
{
	const s = solve();
	// 1960 gpm is 0.1237 m3/s. Unconverted it would read 1960, which is a river.
	ok('the assembled demand is in m3/s, not gpm', s.demandSum > 0.01 && s.demandSum < 1,
		s.demandSum + ' m3/s');
	ok('...and it is the file’s 1960 gpm', Math.abs(s.demandSum - 1960 / 15850.323) < 1e-4,
		s.demandSum.toExponential(4));
	ok('the shipped example solves', s.result.ok && s.result.converged,
		'ok=' + s.result.ok + ' converged=' + s.result.converged);
}

console.log('\n--- Tom’s edit: both 750 gpm demands set to 0 ---');
{
	const doc = L.getDoc();
	const big = doc.nodes.filter(n => n._demand === 750);
	ok('the two 750 gpm demands are found', big.length === 2, big.map(n => n.id).join(','));
	big.forEach(n => { n._demand = 0; });
	const s = solve();
	ok('the network still solves', s.result.ok && s.result.converged,
		'converged=' + s.result.converged + ' after ' + s.result.iterations + ' iterations');
	ok('...without exhausting the iteration budget', s.result.iterations < 100, s.result.iterations);
	// The answer must be right, not merely declared. Continuity at every junction is the property
	// that does not depend on which engine or which stopping rule produced it.
	const inflow = {};
	s.model.links.forEach(function (l) {
		const q = s.result.flows[l.id];
		inflow[l.from] = (inflow[l.from] || 0) - q;
		inflow[l.to] = (inflow[l.to] || 0) + q;
	});
	let worst = 0, at = null;
	s.model.nodes.forEach(function (n) {
		if (EngCalcs.lpnIsFixedHead(n)) { return; }
		const err = Math.abs((inflow[n.id] || 0) - (n.demand || 0));
		if (err > worst) { worst = err; at = n.id; }
	});
	// 1e-7 m3/s is 0.0016 gpm. The plateau this whole fix is about sits at ~1.4e-7 m3/s.
	ok('continuity holds at every junction', worst < 1e-6,
		'worst ' + worst.toExponential(3) + ' m3/s at ' + at);
}

console.log('\n--- a network at rest: every demand zero, the state while it is being drawn ---');
{
	const doc = L.getDoc();
	doc.nodes.forEach(n => { if (n._demand) { n._demand = 0; } });
	const s = solve();
	ok('total demand really is zero', s.demandSum === 0, String(s.demandSum));
	ok('it solves rather than reporting an impossible network',
		s.result.ok && s.result.converged,
		'converged=' + s.result.converged + ' after ' + s.result.iterations + ' iterations');
	let qMax = 0;
	s.model.links.forEach(l => { qMax = Math.max(qMax, Math.abs(s.result.flows[l.id])); });
	// One reservoir and no demand: the only physically correct answer is no flow anywhere.
	ok('...and the answer is that nothing flows', qMax < 1e-6,
		'largest |Q| ' + qMax.toExponential(3) + ' m3/s');
}

console.log('\n--- no demand, but not at rest: two reservoirs at different heads ---');
{
	// The case that makes the stall gate's scale read the FLOWS and not just the demand. Total
	// demand is zero, so a gate scaled on demand alone leaves only absTol (1e-12 m3/s), which no
	// network reaches -- yet real flow is circulating between the two water levels, so the
	// at-rest branch does not apply either. Without both terms this network is reported impossible.
	const model = {
		method: 'hw',
		nodes: [
			{ id: 'R1', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'R2', type: 'reservoir', elev: 0, head: 80 },
			{ id: 'A', type: 'junction', elev: 0, demand: 0 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0 }
		],
		links: [
			{ id: 'L1', type: 'pipe', from: 'R1', to: 'A', length: 300, diameter: 0.2, roughness: 130, k: 0, status: 'open' },
			{ id: 'L2', type: 'pipe', from: 'A', to: 'B', length: 300, diameter: 0.15, roughness: 130, k: 0, status: 'open' },
			{ id: 'L3', type: 'pipe', from: 'A', to: 'B', length: 250, diameter: 0.1, roughness: 130, k: 0, status: 'open' },
			{ id: 'L4', type: 'pipe', from: 'B', to: 'R2', length: 300, diameter: 0.2, roughness: 130, k: 0, status: 'open' }
		]
	};
	const r = EngCalcs.lpnSolve(model, { tol: TOL });
	ok('it solves', r.ok && r.converged, 'converged=' + r.converged + ' iters=' + r.iterations);
	ok('...and real flow is moving, so this is NOT the at-rest case',
		Math.abs(r.flows['L1']) > 1e-3, 'L1 = ' + r.flows['L1'].toExponential(3) + ' m3/s');
	// The two parallel pipes must carry the whole of it between them.
	ok('...continuity holds through the parallel pair',
		Math.abs(r.flows['L1'] - (r.flows['L2'] + r.flows['L3'])) < 1e-9,
		(r.flows['L1'] - (r.flows['L2'] + r.flows['L3'])).toExponential(3));
}

console.log('\n--- the guard is not a blanket "give up and call it converged" ---');
{
	// A genuinely impossible network must still be refused. A zero-diameter pipe is the case the
	// user-facing message names, so it is the one worth pinning.
	const doc = L.getDoc();
	const model = L.assembleModel();
	model.links.forEach(function (l) { l.diameter = 0; });
	const r = EngCalcs.lpnSolve(model, { tol: TOL });
	ok('a network of zero-diameter pipes does not silently "converge" to an answer',
		!r.converged || Object.keys(r.flows).every(function (id) { return r.flows[id] === 0; }),
		'converged=' + r.converged);
}

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall zero-demand assertions passed');
process.exit(fails ? 1 : 0);

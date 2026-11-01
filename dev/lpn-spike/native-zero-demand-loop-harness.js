// A LOOP WITH NO DEMAND CARRIES NO FLOW, IN THE BUILT-IN SOLVER.
//
//   node dev/lpn-spike/native-zero-demand-loop-harness.js
//
// A ring of pipes fed through a pump from a reservoir, every junction demand zero, has no source
// or sink inside it, so every pipe of the ring must carry zero. The built-in solver used to judge
// a network with no demand by its ABSOLUTE flow change against Accuracy (0.001, the page's
// default), so it stopped as soon as the total change fell under 1 L/s and left about 3 gpm
// circulating in the Fire flow extension example's Static flow test (EPANET: 0.07 gpm). The
// yardstick for a no-demand network is now the flow it carries (EPANET's sum|dQ|/sum|Q|).
// Also held: an ordinary demand case still agrees with EPANET, so the change moves nothing there.
'use strict';

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
const GPM = 6.30902e-5;     // m3/s per gpm

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const pipe = (id, f, t, L, D) => ({ id, type: 'pipe', from: f, to: t, length: L, diameter: D, roughness: 140, k: 0, status: 'open' });
const jn = (id, e, d) => ({ id, type: 'junction', elev: e, demand: (d || 0) * GPM });
const q600 = 600 * GPM, B = Math.log(9.85 / 4.2) / Math.log(2), A = 4.2 / Math.pow(q600, B);

// reservoir -> pump -> hydrant -> main -> tie-in E1 -> ring E1-E2-FH-E3-E1
function model(ringGpm, pump) {
	return {
		method: 'hw',
		nodes: [{ id: 'SYS', type: 'reservoir', elev: 0, head: pump ? 0 : 43.65 }, jn('P', 366), jn('F', 366.4),
			jn('E1', 367), jn('E2', 367, ringGpm), jn('FH', 367), jn('E3', 367)],
		links: [pump ? { id: 'PMP', type: 'pump', from: 'SYS', to: 'P', status: 'open', h0: 43.65, a: A, b: B, diameter: 0.3 } :
				pipe('PMP', 'SYS', 'P', 1, 0.3),
			pipe('M', 'P', 'F', 122, 0.3), pipe('A', 'F', 'E1', 60, 0.3), pipe('B', 'E1', 'E2', 91, 0.2),
			pipe('C', 'E2', 'FH', 91, 0.2), pipe('D', 'FH', 'E3', 91, 0.2), pipe('E', 'E3', 'E1', 91, 0.2)]
	};
}
const RING = ['B', 'C', 'D', 'E'];
const ringGpm = (r) => Math.max.apply(null, RING.map((k) => Math.abs(r.flows[k] / GPM)));

(async function () {
	for (const pump of [true, false]) {
		for (const tol of [1e-9, 1e-5, 1e-3, 1e-2]) {
			const r = EngCalcs.lpnSolve(model(0, pump), { tol });
			ok((pump ? 'pump' : 'reservoir') + ', no demand, Accuracy ' + tol + ': the ring carries under 0.1 gpm',
				r.ok && r.converged && ringGpm(r) < 0.1, ringGpm(r).toFixed(4) + ' gpm, ' + r.iterations + ' iterations');
		}
	}
	// An ordinary demand case at the page's default Accuracy still agrees with EPANET.
	const m = model(40, true);
	const n = EngCalcs.lpnSolve(m, { tol: 1e-3 });
	const e = await EngCalcs.lpnSolveEpanet(Object.assign({}, m, { hydraulics: { accuracy: 1e-5 } }), { moduleUrl: MODULE_URL });
	let dQ = 0;
	m.links.forEach((l) => { dQ = Math.max(dQ, Math.abs(n.flows[l.id] - e.flows[l.id])); });
	ok('40 gpm drawn at E2: native and EPANET agree within 0.05 gpm', n.converged && e.ok && dQ / GPM < 0.05,
		(dQ / GPM).toFixed(4) + ' gpm');
	console.log(pass + ' passed, ' + fail + ' failed');
	process.exit(fail ? 1 : 0);
})();

// A valve (or pipe) set Closed must reach a WARM EPANET session -- fix/gpv-closed-warm.
//
//   node dev/lpn-spike/valve-status-warm-harness.js
//
// DEFECT: pushValues() skips a GPV (EPANET error 207 on any control of one) and signatureOf()
// carried its curve but not its status, so open -> Closed -> solve kept the open flow through
// the "closed" valve on every later solve, while the built-in solver gave 0.
// For each valve type and for a pipe: solve open, closed, open again on ONE kept session, and
// assert the closed solve has zero flow through the link and the reopened one matches the first.
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(process.env.LPN_SESSION_MODULE || path.join(ROOT, 'js', 'lpn-epanet.js')));

const LPS = 0.001;
const pipe = (id, from, to, length, diameter) => ({ id, type: 'pipe', from, to, length, diameter, roughness: 130, k: 0, status: 'open' });
const valve = (id, from, to, vt, setting, extra) => Object.assign({ id, type: 'valve', valveType: vt, from, to, length: 0, diameter: 0.2, roughness: 150, setting, k: 0, status: 'open' }, extra || {});
const jn = (id, elev, d) => ({ id, type: 'junction', elev, demand: (d || 0) * LPS });
const res = (id, head) => ({ id, type: 'reservoir', elev: head, head });
const G4 = [[10, 2], [25, 6], [40, 14], [60, 30]].map(p => [p[0] * LPS, p[1]]);
// R -> J1 -[V]-> J2 -> J3 (demand), with a second reservoir feeding J3 so a closed V strands nothing.
function net(link) {
	return { method: 'hw',
		nodes: [res('R', 100), jn('J1', 0), jn('J2', 10), jn('J3', 10, 30), res('R2', 60)],
		links: [pipe('P1', 'R', 'J1', 800, 0.25), link, pipe('P2', 'J2', 'J3', 600, 0.2), pipe('P3', 'R2', 'J3', 300, 0.3)] };
}
const CASES = [
	['PRV', () => valve('V', 'J1', 'J2', 'PRV', 70)],
	['PSV', () => valve('V', 'J1', 'J2', 'PSV', 10)],
	['PBV', () => valve('V', 'J1', 'J2', 'PBV', 10)],
	['FCV', () => valve('V', 'J1', 'J2', 'FCV', 20)],
	['TCV', () => valve('V', 'J1', 'J2', 'TCV', 5)],
	['GPV', () => valve('V', 'J1', 'J2', 'GPV', 0, { curvePoints: G4 })],
	['pipe', () => pipe('V', 'J1', 'J2', 500, 0.2)]
];
let fail = 0;
const check = (ok, what) => { if (!ok) { fail++; console.log('FAIL ' + what); } };
const clone = m => JSON.parse(JSON.stringify(m));
const solve = m => EngCalcs.lpnSolveEpanet(m, { moduleUrl: MODULE_URL });

(async () => {
	for (const [name, mk] of CASES) {
		EngCalcs.lpnEpanetReset();
		const base = net(mk()), closed = clone(base);
		closed.links.find(l => l.id === 'V').status = 'closed';
		const seq = [];
		for (const m of [base, closed, base, closed, base]) { seq.push(await solve(m)); }
		const q = seq.map(r => r.ok ? r.flows.V / LPS : NaN);
		check(seq.every(r => r.ok), name + ' every solve ok');
		check(Math.abs(q[0]) > 1, name + ' open flow is nonzero (' + q[0] + ')');
		check(Math.abs(q[1]) < 1e-6 && Math.abs(q[3]) < 1e-6, name + ' closed flow is zero on a warm session: ' + q[1] + ', ' + q[3] + ' L/s');
		check(Math.abs(q[2] - q[0]) < 1e-3 && Math.abs(q[4] - q[0]) < 1e-3, name + ' reopened flow matches the first: ' + q.join(' / '));
	}
	console.log(fail ? fail + ' FAILED' : 'valve-status-warm-harness: all ok');
	process.exit(fail ? 1 : 0);
})();

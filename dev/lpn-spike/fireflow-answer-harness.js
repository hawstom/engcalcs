// THE FIRE-FLOW SWEEP'S ANSWERS, AGAINST THE SOLVER AS IT WAS BEFORE IT WAS MADE FAST. Run:
//   node dev/lpn-spike/fireflow-answer-harness.js [baseline-git-rev]
//
// dev/lpn-spike/spd-envelope-harness.js proves the solver reports the same numbers. This one asks
// the question a user would ask instead: does the whole-system sweep reach the SAME VERDICT at
// every junction -- the same pass/fail/design state, the same available flow, the same governing
// element -- as it did with the dense solver that shipped it?
//
// It is a separate file because it is a separate claim. A bit-identical solve implies a bit-
// identical sweep only if nothing in between reads a clock, a hash order or an iteration count as
// data; that is believed and is not proved by the solver harness, so it is checked rather than
// argued. The bisection is the reason it matters: it compares pressures against a threshold, so
// a difference far below any tolerance could still flip a branch and hand back a different flow.
//
// The baseline comes out of git rather than being reconstructed, for the reason solve-ab-bench.js
// gives: a reconstruction that quietly stops matching the old code proves nothing.
//
// SIZES. 49 and 121 junctions, not 225. The baseline is ~19x slower per solve and 225 junctions is
// 3,707 solves of it; the two smaller grids exercise every branch this can reach and run in
// seconds. The claim being checked is identity, and identity does not need the biggest case.

const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const NOW = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = NOW;
require(path.join(ROOT, 'js', 'lpn-fireflow.js'));

const REV = process.argv[2] || 'e3323b24';
const baselineSrc = execFileSync('git', ['-C', ROOT, 'show', REV + ':js/lpn-solver.js'], { encoding: 'utf8' });
const BEFORE = {};
Object.keys(NOW).forEach(k => { BEFORE[k] = NOW[k]; });
new Function('require', 'module', 'exports',
	baselineSrc)(function () { return BEFORE; }, { exports: BEFORE }, BEFORE);
if (BEFORE.lpnSolve === NOW.lpnSolve) {
	console.error('The baseline did not load its own lpnSolve, so both columns would be the ' +
		'current code and every comparison would pass for the wrong reason.');
	process.exit(1);
}

const gpm = NOW.lpnFireFlowGpmToSI, psi = NOW.lpnFireFlowPsiToHead;
function grid(n) {
	const nodes = [{ id: 'R', type: 'reservoir', elev: 0, head: 70 }];
	const links = [];
	const id = (i, j) => 'J' + i + '_' + j;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			nodes.push({ id: id(i, j), type: 'junction', elev: 5 + (i + j) * 0.2, demand: gpm(15) });
		}
	}
	links.push({ id: 'FEED', type: 'pipe', from: 'R', to: id(0, 0), length: 100, diameter: 0.3048,
		roughness: 130, k: 0, status: 'open' });
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i + 1 < n) {
				links.push({ id: 'H' + i + '_' + j, type: 'pipe', from: id(i, j), to: id(i + 1, j),
					length: 150, diameter: 0.2032, roughness: 130, k: 0, status: 'open' });
			}
			if (j + 1 < n) {
				links.push({ id: 'V' + i + '_' + j, type: 'pipe', from: id(i, j), to: id(i, j + 1),
					length: 150, diameter: 0.1524, roughness: 130, k: 0, status: 'open' });
			}
		}
	}
	return { method: 'hw', nodes: nodes, links: links };
}

let failures = 0;
function ok(what, cond, detail) {
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + what + (cond || detail === undefined ? '' : '  -- ' + detail));
}

// Object.is, recursively, so -0 is not silently accepted as 0 and an added or dropped field is a
// failure rather than a shrug.
function deepSame(a, b, at) {
	if (a === b || Object.is(a, b)) { return null; }
	if (typeof a !== typeof b || a === null || b === null) { return at + ': ' + a + ' vs ' + b; }
	if (typeof a !== 'object') { return at + ': ' + a + ' vs ' + b; }
	if (Array.isArray(a) !== Array.isArray(b)) { return at + ': array vs not'; }
	const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
	if (ka.join(',') !== kb.join(',')) { return at + ': fields ' + ka.join(',') + ' vs ' + kb.join(','); }
	for (const k of ka) {
		const d = deepSame(a[k], b[k], at + '.' + k);
		if (d) { return d; }
	}
	return null;
}

const noYield = () => Promise.resolve();

(async function () {
	for (const n of [7, 11]) {
		const model = grid(n);
		const junctions = model.nodes.filter(x => x.type === 'junction').map(x => x.id);
		const links = model.links.map(l => l.id);
		const args = {
			junctions: junctions, required: gpm(1000), residual: psi(20),
			design: { nodes: junctions, links: links, minPressure: psi(20), maxVelocity: 3 },
			yield: noYield
		};
		const before = await BEFORE.lpnFireFlowSweep(model, Object.assign({}, args,
			{ solve: m => BEFORE.lpnSolve(m, { tol: 1e-9, maxIter: 200 }) }));
		const after = await NOW.lpnFireFlowSweep(model, Object.assign({}, args,
			{ solve: m => NOW.lpnSolve(m, { tol: 1e-9, maxIter: 200 }) }));

		ok(junctions.length + ' junctions: the same number of solves',
			before.solves === after.solves, before.solves + ' vs ' + after.solves);
		ok(junctions.length + ' junctions: the same verdict tally',
			JSON.stringify(before.counts) === JSON.stringify(after.counts),
			JSON.stringify(before.counts) + ' vs ' + JSON.stringify(after.counts));
		const diff = deepSame(before.results, after.results, 'results');
		ok(junctions.length + ' junctions: every record identical, field for field, bit for bit',
			diff === null, diff);
	}
	console.log('\n' + (failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'));
	process.exit(failures === 0 ? 0 : 1);
}()).catch(e => { console.error(e); process.exit(1); });

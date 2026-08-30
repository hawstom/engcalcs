// BEFORE AND AFTER, IN ONE PROCESS, AS A RATIO. Run:
//   node dev/lpn-spike/solve-ab-bench.js [baseline-git-rev]
//
// WHY A RATIO AND NOT A SECOND. dev/lpn-spike/fireflow-bench.js's own table was measured twice on
// the same machine on the same code and disagreed by 3.7x (114.9 s against 428.3 s for the same
// 225-junction sweep) because the box was busy with other work the second time. A wall-clock
// figure from this repo is therefore not a fact about the code, and nobody can reproduce one. Two
// implementations timed BACK TO BACK IN THE SAME PROCESS share whatever load there is, so their
// ratio survives -- and it is also the only number that means anything to a reader on a different
// machine.
//
// The baseline is the real previous file, checked out of git rather than reconstructed here, and
// evaluated against its OWN copy of EngCalcs so the two solvers cannot overwrite each other's
// exports. Reconstructing it would be the stub mistake dev/testing-notes.md warns about: a
// baseline that has quietly stopped being the old code measures nothing.
//
// Not a harness; it asserts nothing, and run_harnesses.sh's *harness*.js glob skips it. The
// assertions about this change live in dev/lpn-spike/spd-envelope-harness.js, where they are
// COUNTS rather than times.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const NOW = require(path.join(ROOT, 'js', 'lpn-solver.js'));

// The baseline, from git, with its own EngCalcs.
const REV = process.argv[2] || 'HEAD';
const baselineSrc = execFileSync('git', ['-C', ROOT, 'show', REV + ':js/lpn-solver.js'], { encoding: 'utf8' });
const BEFORE = {};
Object.keys(NOW).forEach(k => { BEFORE[k] = NOW[k]; });
new Function('require', 'module', 'exports',
	baselineSrc)(function () { return BEFORE; }, { exports: BEFORE }, BEFORE);

const gpm = q => q * 0.0000630901964;
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

// Interleaved, alternating which goes first, and the MEDIAN of the passes is reported -- so a
// burst of load landing mid-run cannot be attributed to whichever implementation was running.
function timeSolve(EC, m, reps) {
	const t = process.hrtime.bigint();
	let r;
	for (let i = 0; i < reps; i++) { r = EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 }); }
	return { ms: Number(process.hrtime.bigint() - t) / 1e6 / reps, iters: r.iterations };
}
const median = a => a.slice().sort((x, y) => x - y)[a.length >> 1];

console.log('baseline = ' + REV + ':js/lpn-solver.js\n');
console.log('junctions   before ms   after ms   RATIO   Newton iterations (before/after)');
const rows = [];
for (const n of [7, 11, 15]) {
	const m = grid(n);
	timeSolve(BEFORE, m, 2); timeSolve(NOW, m, 2);
	const b = [], a = [];
	let ib, ia;
	for (let pass = 0; pass < 7; pass++) {
		if (pass % 2 === 0) {
			const x = timeSolve(BEFORE, m, 3); b.push(x.ms); ib = x.iters;
			const z = timeSolve(NOW, m, 3); a.push(z.ms); ia = z.iters;
		} else {
			const z = timeSolve(NOW, m, 3); a.push(z.ms); ia = z.iters;
			const x = timeSolve(BEFORE, m, 3); b.push(x.ms); ib = x.iters;
		}
	}
	const mb = median(b), ma = median(a), nn = m.nodes.length - 1;
	rows.push({ nn, mb, ma });
	console.log(String(nn).padStart(9) + String(mb.toFixed(2)).padStart(11) +
		String(ma.toFixed(2)).padStart(11) + ('x' + (mb / ma).toFixed(1)).padStart(8) +
		'   ' + ib + ' / ' + ia);
}
const f = rows[0], l = rows[rows.length - 1];
const ex = (p, q) => (Math.log(q / p) / Math.log(l.nn / f.nn)).toFixed(2);
console.log('\ngrowth exponent of ONE SOLVE from ' + f.nn + ' to ' + l.nn + ' junctions:  before ' +
	ex(f.mb, l.mb) + ',  after ' + ex(f.ma, l.ma));
console.log('The Newton iteration counts must be IDENTICAL in both columns. They are the proof ' +
	'that\nnothing about the convergence path changed -- only how fast each step is computed.');

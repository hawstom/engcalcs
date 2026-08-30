// What a whole-system fire flow sweep COSTS (ROADMAP Task 530). Run:
//   node dev/lpn-spike/fireflow-bench.js
//
// **MEASURED, NEVER EXTRAPOLATED.** The `fire-flow` branch measured ~112 s for 225 junctions and
// recorded the reason not to multiply it out: growth from 49 to 225 junctions was WORSE than
// linear, because one solve of a bigger network is itself slower. So this file measures at least
// two sizes and prints the growth exponent it actually saw; nobody may quote a figure for a size
// that is not in the table.
//
// WHAT CHANGED SINCE, and what did not. The per-solve half was the fixable half: the solver's
// linear algebra was a dense Cholesky, and it is an envelope factorization now, which measured
// ~19x on one solve at 225 junctions with every reported number bit-identical
// (dev/lpn-spike/spd-envelope-harness.js, dev/lpn-spike/fireflow-answer-harness.js).
//
// THE EXPONENT IS STILL ABOVE 1 AND THE RULE ABOVE STILL STANDS. The sweep's SOLVE COUNT grows
// linearly with junctions -- 819 / 2,043 / 3,707 -- and one solve still costs more on a bigger
// network, so the product still grows faster than the network does. A big constant factor is not
// a change of shape, and a figure for a size not in this table is still not quotable.
//
// AND DO NOT COMPARE THE SECONDS IN TWO RUNS OF THIS FILE. The same code on the same machine gave
// 114.9 s and 428.3 s for the 225-junction sweep, three days apart, because the box was busy the
// second time. The solve COUNTS are deterministic and are the only figures here that reproduce.
//
// NOT a harness: it asserts nothing and dev/scripts/run_harnesses.sh does not pick it up (its glob
// is *harness*.js). A timing number is not a pass/fail.
//
// The grid is square and every junction is tested, which is the worst case and the one Tom
// described: *"a big analysis that could take minutes to run for a big system."*

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EC;
require(path.join(ROOT, 'js', 'lpn-fireflow.js'));

const gpm = EC.lpnFireFlowGpmToSI, psi = EC.lpnFireFlowPsiToHead;

// A looped rectangular grid fed by one reservoir at a corner -- the shape a distribution system
// actually has, and the one that makes the solver work (a tree would converge in half the
// iterations and understate every number here).
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

function nativeSolve(m) { return EC.lpnSolve(m, { tol: 1e-9, maxIter: 200 }); }
const noYield = () => Promise.resolve();

(async function () {
	const rows = [];
	for (const n of [7, 11, 15]) {
		const model = grid(n);
		const junctions = model.nodes.filter(x => x.type === 'junction').map(x => x.id);
		const links = model.links.map(l => l.id);
		// One ordinary solve first, so the per-solve cost can be separated from the sweep's own
		// overhead. If the sweep is much more than solves x per-solve, the overhead is ours.
		const t0 = Date.now();
		for (let i = 0; i < 5; i++) { nativeSolve(model); }
		const perSolve = (Date.now() - t0) / 5;

		const t1 = Date.now();
		const set = await EC.lpnFireFlowSweep(model, {
			solve: nativeSolve, junctions: junctions, required: gpm(1000), residual: psi(20),
			design: { nodes: junctions, links: links, minPressure: psi(20), maxVelocity: 3 },
			yield: noYield
		});
		const ms = Date.now() - t1;
		rows.push({ n: junctions.length, links: links.length, ms: ms, solves: set.solves,
			perSolve: perSolve, counts: set.counts });
		console.log(junctions.length + ' junctions, ' + links.length + ' pipes: ' +
			(ms / 1000).toFixed(1) + ' s, ' + set.solves + ' solves (' +
			(ms / set.solves).toFixed(1) + ' ms each; one ordinary solve is ' +
			perSolve.toFixed(1) + ' ms), ' + JSON.stringify(set.counts));
	}
	// The growth exponent between the smallest and the largest, printed rather than assumed.
	const a = rows[0], b = rows[rows.length - 1];
	console.log('\ngrowth from ' + a.n + ' to ' + b.n + ' junctions: time x' +
		(b.ms / a.ms).toFixed(1) + ' for junctions x' + (b.n / a.n).toFixed(1) +
		'  ->  exponent ' + (Math.log(b.ms / a.ms) / Math.log(b.n / a.n)).toFixed(2));
	console.log('An exponent above 1 is why a figure for a size not in this table may not be quoted.');
}()).catch(e => { console.error(e); process.exit(1); });

// WHAT WARM STARTING WOULD BUY THE FIRE-FLOW SWEEP, AND WHAT IT WOULD COST. Run:
//   node dev/lpn-spike/warm-start-bench.js
//
// **NOTHING HERE IS SHIPPED, AND THAT IS THE POINT.** js/lpn-solver.js seeds every solve from the
// same cold guess -- flows at a 0.3 m/s velocity, heads at each junction's own elevation -- and
// still does after this file was written. The sweep runs ~16 solves per junction that differ in
// ONE node's demand, so each one re-derives from scratch a solution it very nearly already had.
// This file measures how many Newton iterations that costs, by evaluating a MODIFIED COPY of the
// real solver (patched in memory, never on disk) that starts from the previous solve's answer.
//
// The reason it is a measurement and not a change: warm starting moves the answer. Newton stops
// on the first iterate inside `tol`, and which iterate that is depends on where it started, so
// every head and flow this suite reports would shift in its last digits. That is a different
// algorithm, and CLAUDE.md's rule is that a different algorithm needs Tom rather than an agent.
// The envelope factorization that DID ship is the opposite case -- it changes no digit at all.
//
// So this prints the two numbers a decision needs: the iteration saving, and the size of the
// answer shift. Both are counts or relative sizes; neither is a wall-clock time, which on this
// machine is worthless (see solve-ab-bench.js).

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const COLD = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = COLD;
require(path.join(ROOT, 'js', 'lpn-fireflow.js'));

// ------------------------------------------------------------------------------------------
// The warm-start prototype: the real file, with its two seeding loops replaced.
// ------------------------------------------------------------------------------------------
const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-solver.js'), 'utf8');
const COLD_Q = "\t\t\t: 0.3 * Math.PI * links[k].diameter * links[k].diameter / 4;";
const COLD_H = "\tfor (i = 0; i < nn; i++) { H[i] = junctions[i].elev || 0; }";
if (src.indexOf(COLD_Q) < 0 || src.indexOf(COLD_H) < 0) {
	console.error('js/lpn-solver.js no longer seeds the way this bench patches. Re-read it before ' +
		'trusting any number below: a patch that silently stopped applying would measure the cold ' +
		'solver against itself and report a saving of zero.');
	process.exit(1);
}
const warmSrc = src
	.replace(COLD_Q, COLD_Q + "\n\t\tif (opts.warm && opts.warm.Q && opts.warm.Q.length === links.length) { Q[k] = opts.warm.Q[k]; }")
	.replace(COLD_H, COLD_H + "\n\tif (opts.warm && opts.warm.H && opts.warm.H.length === nn) { for (i = 0; i < nn; i++) { H[i] = opts.warm.H[i]; } }\n" +
		"\tif (opts.warm) { opts.warm.Q = Q; }");
const WARM = {};
Object.keys(COLD).forEach(k => { WARM[k] = COLD[k]; });
new Function('require', 'module', 'exports', warmSrc)(function () { return WARM; }, { exports: WARM }, WARM);

const gpm = COLD.lpnFireFlowGpmToSI, psi = COLD.lpnFireFlowPsiToHead;
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

const noYield = () => Promise.resolve();

(async function () {
	console.log('sweep      solves   Newton iterations   per solve   answer shift (max relative)');
	for (const n of [7, 11, 15]) {
		const model = grid(n);
		const junctions = model.nodes.filter(x => x.type === 'junction').map(x => x.id);
		const links = model.links.map(l => l.id);
		const design = { nodes: junctions, links: links, minPressure: psi(20), maxVelocity: 3 };
		const args = { junctions: junctions, required: gpm(1000), residual: psi(20),
			design: design, yield: noYield };

		let coldIters = 0;
		const coldSet = await COLD.lpnFireFlowSweep(model, Object.assign({}, args, {
			solve: m => { const r = COLD.lpnSolve(m, { tol: 1e-9, maxIter: 200 }); coldIters += r.iterations; return r; }
		}));

		// The warm state carried between solves is the PREVIOUS SOLVE'S FLOWS. Heads are left
		// cold: only emitters read H before the first factorization, so carrying them changes
		// nothing on a network without them, and carrying flows is what the topology argument is
		// actually about.
		let warmIters = 0;
		const carry = {};
		const warmSet = await WARM.lpnFireFlowSweep(model, Object.assign({}, args, {
			solve: m => { const r = WARM.lpnSolve(m, { tol: 1e-9, maxIter: 200, warm: carry }); warmIters += r.iterations; return r; }
		}));

		// How far the reported answer moved. The sweep's headline number per junction is the
		// available fire flow, so that is what is compared.
		let shift = 0;
		const byId = {};
		warmSet.results.forEach(r => { byId[r.id] = r; });
		coldSet.results.forEach(r => {
			const w = byId[r.id];
			if (!w || typeof r.available !== 'number' || typeof w.available !== 'number') { return; }
			const d = Math.abs(r.available - w.available);
			if (d > 0) { shift = Math.max(shift, d / Math.max(Math.abs(r.available), 1e-12)); }
		});

		console.log(String(junctions.length + ' junc').padEnd(11) +
			String(coldSet.solves).padStart(6) + '   ' +
			String(coldIters + ' -> ' + warmIters).padStart(17) + '   ' +
			(coldIters / coldSet.solves).toFixed(1) + ' -> ' + (warmIters / warmSet.solves).toFixed(1) +
			'    ' + (shift === 0 ? 'none' : shift.toExponential(1)));
	}
	console.log('\nThe iteration column is the whole case for warm starting; the last column is its ' +
		'price.\nBoth are reproducible on any machine. Neither is a decision an agent may take.');
}()).catch(e => { console.error(e); process.exit(1); });

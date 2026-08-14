// How long does each engine actually take? -- ROADMAP Task 313.
//
//   node dev/lpn-spike/engine-bench.js
//
// WHY THIS EXISTS. "The native solver is faster, so it stays the default" has been the stated
// reason for the engine toggle since Task 243, and it is repeated in js/lpn-epanet.js's header,
// in defaultSettings() and twice in the ROADMAP. Only HALF of it was ever measured: the native
// 0.4 ms at the 21-node target is real (dev/lpn-spike/validate.js prints it every run). The
// EPANET side was never timed at all -- it was INFERRED from "async, and a 678 KB import".
//
// Tom, 2026-08-14: "We've proceeded telling ourselves that our engine is faster than the EPANET
// engine. But I haven't seen evidence of this in my browser tests." He is right that there was no
// evidence, and a load-bearing claim with no measurement behind it is the thing this repo keeps
// learning to distrust.
//
// WHAT THIS MEASURES, and the split matters more than the totals:
//   1. native solve            -- the whole cost of the native path, per solve
//   2. EPANET: build the .inp  -- OUR code, string-building, per solve
//   3. EPANET: open the project-- the engine PARSING that text, per solve
//   4. EPANET: solve           -- the engine actually solving, per solve
//   5. EPANET: module load     -- once per page, not per solve
//
// 2, 3 and 4 are separated on purpose. If the EPANET path is slow, "the EPANET engine is slow" and
// "our integration re-serialises and re-parses a whole text file on every keystroke" are different
// diagnoses with different fixes, and only one of them is about EPANET.
//
// WHAT IT CANNOT TELL YOU. This is Node, not a browser: WASM instantiation, the 678 KB fetch and
// the JIT all behave differently there, and the fetch is the part a real user actually waits for.
// Treat the per-solve numbers as representative and the load number as a floor.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

const cases = require('./cases.js');

// Same generator validate.js uses for its scale check, so the two files' numbers are comparable.
function gridNetwork(rows, cols) {
	const nodes = [{ id: 'R', type: 'reservoir', head: 150 }];
	const links = [];
	const id = (r, c) => `J${r}_${c}`;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			nodes.push({ id: id(r, c), type: 'junction', elev: 10 + (r % 3), demand: 0.002 });
		}
	}
	links.push({ id: 'SRC', type: 'pipe', from: 'R', to: id(0, 0), length: 200, diameter: 0.5, roughness: 130, k: 0, status: 'open' });
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (c + 1 < cols) { links.push({ id: `H${r}_${c}`, type: 'pipe', from: id(r, c), to: id(r, c + 1), length: 150, diameter: 0.2, roughness: 130, k: 0, status: 'open' }); }
			if (r + 1 < rows) { links.push({ id: `V${r}_${c}`, type: 'pipe', from: id(r, c), to: id(r + 1, c), length: 150, diameter: 0.2, roughness: 130, k: 0, status: 'open' }); }
		}
	}
	return { name: `${nodes.length} nodes`, method: 'hw', nodes, links };
}

function ms(fn, runs) {
	// One untimed pass first: the first call through any of these paths pays for JIT warm-up and,
	// on the EPANET side, for the engine's own first-use allocation. A user pays that once; folding
	// it into a per-solve mean would misreport the steady state they actually live in.
	fn();
	const t0 = process.hrtime.bigint();
	for (let i = 0; i < runs; i++) { fn(); }
	return Number(process.hrtime.bigint() - t0) / 1e6 / runs;
}

async function main() {
	const size = fs.statSync(path.join(ROOT, 'js', 'vendor', 'epanet-js.js')).size;

	console.log('\nEngine timings -- Node ' + process.version + ', ' + new Date().toISOString().slice(0, 10));
	console.log('='.repeat(78));

	// ---- one-time module load ----
	const tLoad0 = process.hrtime.bigint();
	const mod = await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const importMs = Number(process.hrtime.bigint() - tLoad0) / 1e6;

	const wsProbe = new mod.Workspace();
	const tWasm0 = process.hrtime.bigint();
	await wsProbe.loadModule();
	const wasmMs = Number(process.hrtime.bigint() - tWasm0) / 1e6;

	console.log('\nONE-TIME, per page load (the user waits for this once):');
	console.log(`  module bytes on disk        ${(size / 1024).toFixed(0)} KB`);
	console.log(`  import()                    ${importMs.toFixed(1)} ms   (Node; a browser also FETCHES it)`);
	console.log(`  WASM instantiation          ${wasmMs.toFixed(1)} ms`);

	console.log('\nPER SOLVE (the page re-solves on every edit):');
	console.log('  network      native    inp    open   solve   EPANET total   ratio');
	console.log('  ' + '-'.repeat(66));

	for (const model of [cases.twoLoopGrid, gridNetwork(4, 5), gridNetwork(10, 20)]) {
		const label = (model.nodes.length + ' nodes').padEnd(11);
		const runs = model.nodes.length <= 25 ? 200 : 20;

		const nativeMs = ms(() => EngCalcs.lpnSolve(model), runs);

		// Our own .inp writer, on its own.
		const inpMs = ms(() => EngCalcs.lpnToInp(model), runs);
		const built = EngCalcs.lpnToInp(model);

		// The engine parsing that text. A fresh Workspace/Project each time, which is exactly what
		// EngCalcs.lpnSolveEpanet does today -- the point is to measure the path we actually ship.
		const ws = new mod.Workspace();
		await ws.loadModule();
		const openMs = ms(() => {
			const p = new mod.Project(ws);
			ws.writeFile('b.inp', built.inp);
			p.open('b.inp', 'b.rpt', 'b.out');
			p.close();
		}, runs);

		// The hydraulic solve alone, on an already-open project.
		const p = new mod.Project(ws);
		ws.writeFile('s.inp', built.inp);
		p.open('s.inp', 's.rpt', 's.out');
		const solveMs = ms(() => { p.openH(); p.initH(0); p.runH(); p.closeH(); }, runs);
		p.close();

		const total = inpMs + openMs + solveMs;
		console.log('  ' + label +
			nativeMs.toFixed(2).padStart(7) +
			inpMs.toFixed(2).padStart(7) +
			openMs.toFixed(2).padStart(8) +
			solveMs.toFixed(2).padStart(8) +
			total.toFixed(2).padStart(14) +
			(total / nativeMs).toFixed(1).padStart(8) + 'x');
	}

	console.log('\n  native = EngCalcs.lpnSolve.  inp/open/solve = the three parts of');
	console.log('  EngCalcs.lpnSolveEpanet: our writer, the engine parsing it, the engine solving.');
	console.log('  A page re-solve pays all three today, because each solve builds a new Project.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });

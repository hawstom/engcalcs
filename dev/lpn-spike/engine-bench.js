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
//   6. EngCalcs.lpnSolveEpanet end to end, both of its paths (value edit / reopen) -- Task 313
//
// 2, 3 and 4 are separated on purpose. If the EPANET path is slow, "the EPANET engine is slow" and
// "our integration re-serialises and re-parses a whole text file on every keystroke" are different
// diagnoses with different fixes, and only one of them is about EPANET.
//
// AND 6 EXISTS BECAUSE 2+3+4 LIED. The decomposition said an EPANET solve cost 1.25 ms; the
// exported function actually cost 9-10 ms, because it also constructed a Workspace and
// instantiated the WASM engine on every single solve -- and this file could not see that, having
// hoisted the Workspace out of its own loop. A decomposition measures the parts you thought of.
// So the last table calls the shipped function, unmodified, and that is the number to quote.
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

// Same shape as ms(), for the async path. The untimed warm-up pass matters more here: the very
// first call also opens the Project, so folding it in would price a keystroke as a topology click.
async function msAsync(fn, runs) {
	await fn();
	const t0 = process.hrtime.bigint();
	for (let i = 0; i < runs; i++) { await fn(); }
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

		// The engine parsing that text: a fresh Project each time, on a Workspace hoisted out of
		// the loop. Since Task 313 this is the cost of a TOPOLOGY change only, and the hoist is
		// the mistake described in the header -- kept deliberately, because the last table now
		// measures the real function and this one is only here to price the parse itself.
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

	console.log('\n  native = EngCalcs.lpnSolve.  inp/open/solve = the three parts an EPANET solve');
	console.log('  CAN cost: our writer, the engine parsing it, the engine solving. Before Task 313');
	console.log('  every page re-solve paid all three, because every solve built a new Project.');

	// ---- and what EngCalcs.lpnSolveEpanet ACTUALLY costs now (Task 313) ----
	//
	// The table above is a decomposition; this one is the shipped function, end to end, and it is
	// the number to quote. Two rows because there are two paths and they are ~25x apart:
	//
	//   VALUE  -- a diameter, a demand, an elevation: the signature is unchanged, so the open
	//             Project is reused and the numbers are pushed through the toolkit's setters.
	//             This is what a keystroke costs.
	//   REOPEN -- an element added or deleted, an id renamed, the friction method changed: the
	//             .inp is rebuilt and reparsed. A discrete click, not a keystroke.
	//
	// The value row deliberately CHANGES a demand on every iteration rather than re-solving an
	// identical model: an unchanged model would still exercise the setters, but timing it would
	// invite the suspicion that something was being skipped.
	console.log('\nPER SOLVE THROUGH EngCalcs.lpnSolveEpanet (Task 313 -- the shipped path):');
	console.log('  network      value edit   reopen   native   native / value');
	console.log('  ' + '-'.repeat(66));

	for (const model of [cases.twoLoopGrid, gridNetwork(4, 5), gridNetwork(10, 20)]) {
		const label = (model.nodes.length + ' nodes').padEnd(11);
		// More runs than the synchronous table uses, and the 201-node row is why: at 20 runs it
		// read 11 ms and at 200 it reads 2.9, because the value path is a few hundred small WASM
		// calls that the JIT is still warming up on. A cost that falls by 4x when you measure it
		// longer was never a cost -- it was a measurement.
		const runs = model.nodes.length <= 25 ? 400 : 200;
		const opts = { moduleUrl: 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js') };
		const target = model.nodes.find((n) => n.type === 'junction');
		const base = target.demand;

		const nativeMs = ms(() => EngCalcs.lpnSolve(model), runs);

		let i = 0;
		const valueMs = await msAsync(async () => {
			target.demand = base * (1 + 0.001 * (++i % 7));
			await EngCalcs.lpnSolveEpanet(model, opts);
		}, runs);
		target.demand = base;

		const reopenMs = await msAsync(async () => {
			EngCalcs.lpnEpanetReset();
			await EngCalcs.lpnSolveEpanet(model, opts);
		}, Math.max(10, runs / 20));

		console.log('  ' + label +
			valueMs.toFixed(2).padStart(11) +
			reopenMs.toFixed(2).padStart(9) +
			nativeMs.toFixed(2).padStart(9) +
			(nativeMs / valueMs).toFixed(2).padStart(15) + 'x');
	}

	console.log('\n  native/value > 1 means the EPANET path is the faster one. It crosses over');
	console.log('  somewhere between 21 and 201 nodes: below that the engine is far faster than');
	console.log('  ours but the round trip is dominated by OUR glue -- lpnDiagnose, a few hundred');
	console.log('  small WASM calls to push values in and read results back -- while above it the');
	console.log('  native O(n^3) Cholesky runs away and nothing else matters.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });

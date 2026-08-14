// Cross-check: EngCalcs.lpnSolveEpanet (real EPANET via WASM) vs EngCalcs.lpnSolve (native GGA).
//
// ROADMAP Task 243. Run:  node dev/lpn-spike/validate_epanet.js
//
// WHAT THIS IS ACTUALLY TESTING, which is not what it looks like. Both engines are already
// known-good against EPA's Net1/Net2/Net3 (see validate.js). So a disagreement here almost
// never means "a solver is wrong" -- it means the .inp WRITER in js/lpn-epanet.js got a unit
// or a convention wrong. That failure is silent by nature: a 0.15 m diameter written as
// "0.15" is read by EPANET as 0.15 mm, and the network still solves perfectly, just for a
// different network. This harness is the only thing standing between that and shipping.
//
// Node needs the wasm handed to it directly: the vendored build resolves its binary by fetch,
// which has no file:// support in Node. Browsers are unaffected -- that is the path the module
// is built for. See loadForNode() below.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
// Order matters. lpn-solver.js require()s PipeHydraulics.lib.js itself and RETURNS the shared
// EngCalcs object rather than mutating a global; lpn-epanet.js is a browser-style IIFE that
// hangs itself off globalThis.EngCalcs. So publish the solver's object as the global FIRST,
// and the two halves meet on the same object instead of silently building two.
require('./bootstrap.js');   // supplies EngCalcs.G -- see that file; without it every
                             // minor-loss and D-W case silently solves to zero head loss.
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

const cases = require('./cases.js');

// Tolerances. These are LOOSE compared with validate.js's 1e-12 closed-form checks, and
// deliberately so: EPANET carries heads in single precision internally and reports through a
// float API, so ~1e-4 m of head is the floor no matter how tight we set Accuracy. Anything
// bigger than these is a units/convention bug, not arithmetic.
const HEAD_TOL = 2e-3;   // m
const FLOW_TOL = 2e-6;   // m3/s  == 0.002 L/s

// Chezy-Manning gets its own, much looser pair, and the looseness is a RESULT rather than a
// concession. Measured 2026-08-09 across an 8x diameter range, EPANET's C-M head loss is a
// near-constant 0.9939-0.9944 of ours: our resistance is the exact derivation from
// V = (1/n) R^(2/3) with R = d/4 (constant 10.2936), EPANET's implies 10.231. We keep ours --
// see the long note in js/lpn-epanet.js for why adopting EPANET's here would be wrong even
// though Task 213 adopted EPANET's Hazen-Williams constants. So this case must still be
// CHECKED (a units bug would blow past even these), just not held to engine-identical.
// A relative bound, because the absolute error scales with the head loss in the network.
const MANNING_REL_TOL = 0.01;   // 1% -- comfortably above the measured 0.6%, far below a units bug

function loadForNode() {
	// Point the engine at the wasm bytes directly. The vendored single-file build embeds
	// them, so this is only needed if a future build splits the .wasm back out; kept as a
	// no-op hook so the failure mode is a clear message rather than a fetch stack trace.
	return EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
}

function maxDiff(a, b, keys) {
	let worst = 0, at = null;
	for (const k of keys) {
		const d = Math.abs((a[k] || 0) - (b[k] || 0));
		if (d > worst) { worst = d; at = k; }
	}
	return { worst, at };
}

async function run() {
	const suite = [
		cases.twoLoopAnalytic,
		cases.twoLoopGrid,
		cases.twoLoopManning,
		cases.twoLoopDw,
		cases.twoLoopMinorLosses,
		cases.pumpCase,
		cases.emitterCase,
		cases.closedLinkCase,
		cases.tankCase,
		cases.zeroDemandCase,
	].filter(Boolean);

	let pass = 0, fail = 0;

	for (const model of suite) {
		const native = EngCalcs.lpnSolve(model);
		let epa;
		try {
			epa = await EngCalcs.lpnSolveEpanet(model, {
				moduleUrl: 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'),
			});
		} catch (e) {
			console.log(`FAIL ${model.name}: EPANET threw -- ${e.message}`);
			fail++;
			continue;
		}

		if (!native.ok || !epa.ok) {
			// Both must agree even about refusing. A model the native solver rejects
			// structurally should never reach EPANET and come back with numbers.
			const same = native.ok === epa.ok;
			console.log(`${same ? 'PASS' : 'FAIL'} ${model.name}: ok native=${native.ok} epanet=${epa.ok}`);
			same ? pass++ : fail++;
			continue;
		}

		const nodeIds = model.nodes.map(n => n.id);
		const linkIds = model.links.map(l => l.id);
		const h = maxDiff(native.heads, epa.heads, nodeIds);
		const q = maxDiff(native.flows, epa.flows, linkIds);

		let ok, note = '';
		if ((model.method || 'hw') === 'manning') {
			// Relative to the head loss actually developed, not to the absolute head, or a
			// network sitting at 500 m would hide a large error behind a big number.
			const span = Math.max(...nodeIds.map(id => Math.abs(native.heads[id] || 0))) -
			             Math.min(...nodeIds.map(id => Math.abs(native.heads[id] || 0)));
			const rel = span > 0 ? h.worst / span : h.worst;
			ok = rel <= MANNING_REL_TOL;
			note = `   rel=${(rel * 100).toFixed(2)}% of head span (expected ~0.6%, see lpn-epanet.js)`;
		} else {
			ok = h.worst <= HEAD_TOL && q.worst <= FLOW_TOL;
		}
		console.log(
			`${ok ? 'PASS' : 'FAIL'} ${model.name.padEnd(26)} ` +
			`dH=${h.worst.toExponential(2)} m @${h.at}   dQ=${q.worst.toExponential(2)} m3/s @${q.at}` +
			(epa.warnings && epa.warnings.length ? `   [${epa.warnings.map(w => w.code).join(',')}]` : '') +
			note
		);
		ok ? pass++ : fail++;
	}

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });

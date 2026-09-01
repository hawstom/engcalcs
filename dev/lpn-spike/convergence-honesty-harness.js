// THE ENGINE IS ASKED WHETHER IT CONVERGED, AND THE PAGE SAYS WHAT IT ANSWERED -- ROADMAP Task 565.
//   node dev/lpn-spike/convergence-honesty-harness.js
//
// WHY THIS EXISTS. js/lpn-epanet.js returned `converged: true` HARDCODED at both of its success
// sites, js/lpn-time.js did the same for every frame of an extended-period run, and the steady site
// discarded `p.runH()`'s return value entirely. EPANET reports an unbalanced system as a WARNING,
// not an error: the run completes and hands back the last iterate, and the vendored wrapper's
// `_checkError()` prints any code under 100 to `console.warn` and returns. So nothing threw,
// nothing rejected, and applySolveResult()'s whole non-convergence branch was UNREACHABLE from the
// EPANET path -- pressures, velocities, colours, labels and reports all drawn from numbers nobody
// had said were wrong.
//
// **THE MEASUREMENT THAT MAKES IT A DEFECT AND NOT A TIDINESS ARGUMENT IS SECTION 1.** Net3 with
// `Trials 1` answers node 10 at 47.05 m against the converged 50.35 m -- a 3.3 m error, on a page
// that said it converged. That is the shape of defect this suite is least able to detect: not a
// wrong answer a user can see, but a plausible one they cannot.
//
// **A STUB WOULD PROVE NOTHING HERE**, so every section drives the VENDORED ENGINE against EPA's
// own Net3 (dev/testing-notes.md: a stub that removes the coupling makes a harness pass for the
// wrong reason). The quantity the stub would hold constant is the one that matters -- whether the
// iteration actually settled.
//
// **AND `Trials` IS REACHABLE THROUGH A CONTROL**, which is why an unreachable branch was worth
// this much: Settings has rows for Maximum trials and for If unbalanced, so a user can walk into
// section 1 without importing anything.

'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const { buildModel } = require('./net3-model.js');

const ENGINE = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail === undefined ? '' : `  (${detail})`));
	if (!ok) { failures++; }
}

// EPANET's own [OPTIONS] Accuracy is CLAMPED to [1e-5, 1e-1] as it reads the file, so a run that
// asks for 1e-8 is solved at 1e-5. Every assertion about accuracy below is against the clamped
// value, read back out of the engine, which is what convergenceOf() compares to.
const EPANET_MIN_ACCURACY = 1e-5;

function net3Model() {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	return buildModel(EngCalcs, EngCalcs.lpnInpParse(inp));
}

async function steadySection() {
	console.log('\n---- 1. a steady solve reports what the engine actually did ----');
	const model = net3Model();

	// Every case is a fresh session: the model SHAPE never changes, only its hydraulic options, and
	// the session signature does not cover those -- a warm Project would answer the previous run's
	// Trials. lpnEpanetReset() is the documented way back to a cold path.
	async function solveWith(hydraulics) {
		EngCalcs.lpnEpanetReset();
		model.hydraulics = hydraulics;
		return EngCalcs.lpnSolveEpanet(model, { moduleUrl: ENGINE });
	}

	const good = await solveWith({ trials: 200, accuracy: 1e-8 });
	check(good.ok, 'a 200-trial run completed');
	check(good.converged === true, 'and is reported CONVERGED', `converged=${good.converged}`);
	check(typeof good.iterations === 'number' && good.iterations > 0,
		'iterations is a real number, not the null it used to be', `iterations=${good.iterations}`);
	// THE CLAMP, ASSERTED. Asking for 1e-8 and comparing against 1e-8 would call this run
	// unconverged -- its relative error is ~6e-8. The accuracy carried back is the engine's.
	check(good.accuracy === EPANET_MIN_ACCURACY,
		'the accuracy carried back is the engine\'s CLAMPED one, not the 1e-8 we asked for',
		`accuracy=${good.accuracy}`);
	check(good.relativeError > 1e-8 && good.relativeError <= good.accuracy,
		'and the relative error sits between what we asked for and what the engine used',
		`relErr=${good.relativeError}`);

	const bad1 = await solveWith({ trials: 1, accuracy: 1e-8, unbalanced: 'continue', unbalancedTrials: 0 });
	check(bad1.ok, 'a 1-trial run also COMPLETES -- the engine warns, it does not refuse');
	check(bad1.refused !== true, 'and it is not a refusal', `refused=${bad1.refused}`);
	check(bad1.converged === false, 'but it is reported NOT CONVERGED', `converged=${bad1.converged}`);
	check(bad1.relativeError > bad1.accuracy,
		'because its relative error is past the accuracy the engine used',
		`${bad1.relativeError} > ${bad1.accuracy}`);

	// **THE NUMBERS ARE STILL THERE, AND THEY ARE STILL WRONG.** Both halves matter: the page draws
	// them (there is nothing else to draw), and they are far enough out that drawing them unmarked
	// is the defect.
	const h1 = bad1.heads['10'], hGood = good.heads['10'];
	check(typeof h1 === 'number' && isFinite(h1), 'the unconverged run still carries a full set of heads');
	check(Math.abs(h1 - hGood) > 1,
		'and they are WRONG by metres, which is why saying so matters',
		`node 10: ${h1.toFixed(2)} m unconverged vs ${hGood.toFixed(2)} m converged`);

	// `Unbalanced Stop` is a Settings row and does NOT make the toolkit refuse: it hands back the
	// last iterate exactly as Continue does. That is the door a user reaches this through.
	const stopped = await solveWith({ trials: 2, accuracy: 1e-8, unbalanced: 'stop' });
	check(stopped.ok && stopped.refused !== true,
		'`If unbalanced: Stop` still completes through the toolkit -- it does not refuse');
	check(stopped.converged === false, 'and it too is reported NOT CONVERGED');
}

async function epsSection() {
	console.log('\n---- 2. an extended-period run marks each frame, not the run ----');

	async function runWith(hydraulics) {
		EngCalcs.lpnEpanetReset();
		const model = net3Model();
		model.hydraulics = hydraulics;
		return EngCalcs.lpnEpanetRun(model, { moduleUrl: ENGINE });
	}

	const good = await runWith({ trials: 200, accuracy: 1e-8 });
	check(good.ok, `a full-day run completed (${good.frames.length} frames)`);
	check(good.converged === true, 'the run is reported CONVERGED');
	check(good.stepsUnconverged === 0, 'with no unconverged step', `steps=${good.steps}`);
	check(good.frames.every((f) => f.converged === true),
		'and every frame carries its own yes');

	const bad = await runWith({ trials: 1, accuracy: 1e-8, unbalanced: 'continue', unbalancedTrials: 0 });
	check(bad.ok && bad.refused !== true, 'a 1-trial full-day run also completes');
	check(bad.converged === false, 'the run is reported NOT CONVERGED');
	check(bad.stepsUnconverged > 0, 'and it names how many steps failed',
		`${bad.stepsUnconverged} of ${bad.steps}`);
	check(bad.firstUnconvergedTime !== null, 'and when the first one was',
		`t=${bad.firstUnconvergedTime} s`);

	// THE SCRUBBER'S OWN PATH. lpnTimeFrameResult() is what every downstream reader sees, and it
	// said `converged: true` for every frame of every run before Task 565.
	const fr = EngCalcs.lpnTimeFrameResult(bad, bad.frames[0].t);
	check(fr && fr.converged === false,
		'lpnTimeFrameResult() carries the frame\'s answer through to the page', `converged=${fr && fr.converged}`);
	const frGood = EngCalcs.lpnTimeFrameResult(good, good.frames[0].t);
	check(frGood && frGood.converged === true,
		'and still says yes for a run that did converge');
	check(typeof fr.relativeError === 'number' && typeof fr.accuracy === 'number',
		'with the two numbers the status bar prints', `relErr=${fr.relativeError}`);
}

// ================================================================================================
// 3. THE PAGE DRAWS IT AND SAYS SO
// ================================================================================================
// applySolveResult() used to share ONE branch between "the solver refused" and "the solver did not
// converge", and that branch threw the results away and printed "No solution was found" -- which is
// untrue of an unconverged run, where the last iterate is every number in existence. This section
// drives the real applySolveResult() through the DOM stub.
function pageSection() {
	console.log('\n---- 3. applySolveResult draws the numbers and leads with the warning ----');
	const { loadLoopedNetwork } = require('./lpn-dom-stub.js');
	const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

	const L = loadLoopedNetwork(
		EXAMPLE_EXPORTS +
		"\t\tapplySolveResult: applySolveResult,\n" +
		"\t\tlastSolveResult: function () { return lastSolveResult; },\n" +
		"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
		"\t\tgetDoc: function () { return doc; },\n" +
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); }\n"
	);
	L.buildLayers();
	openExample(L, 'us');
	L.runSolve();

	// The real setStatus() writes to `#lpn_status`, so this reads the page, not a spy.
	const status = () => {
		const el = global.document.getElementById('lpn_status');
		return (el && el.textContent) || '';
	};

	// A converged answer first, so the status bar has something else in it to be displaced.
	const model = L.assembleModel();
	const solved = EngCalcs.lpnSolve(model, { tol: 1e-6 });
	L.applySolveResult(solved);
	check(solved.converged === true, 'the built-in solver converged on the shipped example');
	check(status().indexOf('did not converge') < 0, 'and the status bar says nothing about convergence');

	// The same result, marked unconverged. Nothing else about it changes, so anything that differs
	// downstream is attributable to this one flag.
	const shaky = Object.assign({}, solved, {
		converged: false, iterations: 7, relativeError: 0.0421, accuracy: 1e-5
	});
	L.applySolveResult(shaky);
	check(L.lastSolveResult() !== null,
		'the results are KEPT -- the page has numbers to draw, which is the whole change');
	check(L.lastSolveResult().heads !== undefined, 'and they are the full set');
	const s = status();
	check(s.indexOf('The solve did not converge.') === 0,
		'the status bar LEADS with the warning, ahead of every other note', JSON.stringify(s.slice(0, 60)));
	check(s.indexOf('Do not use them') >= 0, 'and says plainly not to use them');
	check(s.indexOf('7 trials') >= 0, 'the trial count is printed', JSON.stringify(s));
	check(s.indexOf('0.0421') >= 0, 'the relative error is printed');
	check(s.indexOf('0.0000100') >= 0,
		'and the accuracy it was measured against', JSON.stringify(s));

	// A solver that gave us NOTHING is still the old message: that path is unchanged and must stay
	// distinguishable from this one.
	L.applySolveResult({ ok: false, issues: [], converged: false, iterations: 0 });
	check(L.lastSolveResult() === null, 'a result with ok:false still discards');
	check(status().indexOf('No solution was found') === 0,
		'and still says so with the original message', JSON.stringify(status().slice(0, 40)));

	// Unknown is not a no. An engine too old to answer must not raise the warning.
	L.applySolveResult(Object.assign({}, solved, { converged: null }));
	check(status().indexOf('did not converge') < 0,
		'`converged: null` (the engine could not be asked) raises no warning');
}

(async function () {
	await EngCalcs.lpnEpanetLoad(ENGINE);
	await steadySection();
	await epsSection();
	pageSection();
	console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
	process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

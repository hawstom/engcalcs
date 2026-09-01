// THE ACCEPTANCE TEST FOR THE WATER-QUALITY RUN: our source-share numbers against EPA's OWN
// published Net3 report, at every reporting step, plus an analytic anchor for water age.
//
//   node dev/lpn-spike/quality-net3-harness.js
//
// WHY THIS FILE AND NOT A COMPARISON WITH OURSELVES. Net3 IS EPA's own water-quality example --
// its [OPTIONS] says `Quality Trace Lake` and its report carries a Quality column in percent for
// every node at all 25 reporting times. dev/lpn-spike/reference/Net3.rpt was produced by EPANET 2.2
// from Net3.inp by EPA, so it can check the whole pipeline this repo owns: js/lpn-inp.js reading
// the option, js/lpn-epanet.js writing it and driving openQ()/runQ()/nextQ(), and the reporting
// grid the quality pass shares with the hydraulic one.
//
// **WATER AGE HAS NO PUBLISHED EPA REPORT IN THIS REPO**, so it is anchored differently and the
// difference is stated rather than papered over: a reservoir, one pipe, one junction drawing a
// constant demand. Once the pipe has flushed, the age at the far end is the travel time, which is
// the pipe's volume divided by the flow -- arithmetic anybody can do on paper, and nothing of ours
// is involved in producing it. Age and source share go through the SAME openQ()/runQ() walk and
// differ only in the keyword written and the hours-to-seconds scale, so the trace comparison above
// is what proves the walk and this is what proves the scale.
//
// THE STUB WARNING (dev/testing-notes.md) APPLIES TO THE AGE CASE IN PARTICULAR. The quantity the
// real thing varies that a toy could hold constant is TRAVEL TIME: a case whose age answer does not
// depend on the pipe's volume or on the flow would pass with the conversion factor wrong. So the
// age case is run TWICE, at two flows, and the ratio of the two ages is asserted -- a wrong scale
// factor cannot survive that, and neither can an age that is not really being transported.

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

const { parseReport } = require('./net3-report.js');
const { buildModel } = require('./net3-model.js');

// EPANET carries quality in single precision and the report prints two decimals, so 0.01 percent
// is the printing floor. The bound here is looser than that and the reason is physical rather than
// numerical: a source share at a node where two waters meet is a FRONT, and a front's position is
// as sensitive as the flow that carries it -- a hundredth of a gpm of difference in a pipe puts the
// boundary a little further along it. So the test is on the WORST node at the worst step AND on the
// median, because a handful of front nodes disagreeing by a percent is expected and a systematic
// offset is not.
const TRACE_TOL_PCT = 2.0;
const TRACE_MEDIAN_TOL_PCT = 0.05;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}

(async function () {
	// ---- 1. the option is READ, and it is read as a source share on a named node ----------------
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	check(parsed.qualityOptions.quality === 'Trace Lake',
		`[OPTIONS] Quality carried verbatim: ${JSON.stringify(parsed.qualityOptions.quality)}`);
	const q = EngCalcs.lpnQualityParse(parsed.qualityOptions.quality);
	check(q.mode === 'trace' && q.traceNode === 'Lake',
		`interpreted: mode ${q.mode}, source ${JSON.stringify(q.traceNode)}`);
	check(parsed.times.qualityStep === 300,
		`[TIMES] Quality Timestep read: ${parsed.times.qualityStep} s (Net3 states 0:05)`);

	// ---- 2. THE FILE'S OWN TOKEN STILL COMES BACK OUT UNCHANGED ---------------------------------
	//
	// The interpreted setting is beside the token, never on top of it, so an untouched document
	// exports the characters it was read with. This is the half of "ONLY THE USER TOUCHES A FILE'S
	// NUMBERS" that applies to a word.
	const live = { mode: q.mode, traceNode: q.traceNode, src: parsed.qualityOptions.quality };
	check(EngCalcs.lpnQualityText(live) === 'Trace Lake',
		`untouched, the exporter writes the file's own text: ${JSON.stringify(EngCalcs.lpnQualityText(live))}`);
	check(EngCalcs.lpnQualityText({ mode: 'age', src: 'Trace Lake' }) === 'Age',
		'once the user picks water age, the file stops claiming a trace');
	check(EngCalcs.lpnQualityText({ mode: 'trace', traceNode: 'River', src: 'Trace Lake' }) === 'Trace River',
		'a different source composes our own line');
	check(EngCalcs.lpnQualityText({ mode: 'chemical', src: 'Chlorine mg/L' }) === 'Chlorine mg/L',
		'a chemical is carried, never composed');
	check(EngCalcs.lpnQualityText({ mode: 'none' }) === '',
		'a document stating nothing writes nothing');
	// **THE WHOLE EXPORTER IS CHECKED WHERE THE PAGE IS LOADED**, not here:
	// dev/lpn-spike/inp-export-harness.js already imports Net1/Net2/Net3 through the page's own
	// docFromInp() and asserts every token comes back character for character, and it is where the
	// `[OPTIONS] Quality` line's own round trip is asserted too. This file cannot: the exporter
	// converts through EngCalcs.unitFactors, which is the page's table and not this scaffolding's.

	// ---- 3. the run, against EPA's own Quality column --------------------------------------------
	const rpt = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8');
	const ref = parseReport(rpt);
	const refTimes = Object.keys(ref).map(Number).sort((a, b) => a - b);

	const model = buildModel(EngCalcs, parsed);
	model.quality = { mode: q.mode, traceNode: q.traceNode };
	check(EngCalcs.lpnQualityRuns(model.quality), 'this model asks for an analysis we can run');
	check(/\n Quality TRACE Lake\b/.test(EngCalcs.lpnToInp(model, { eps: true }).inp),
		'the engine input states the analysis');
	check(/\n Quality Timestep  0:05\b/.test(EngCalcs.lpnToInp(model, { eps: true }).inp),
		"the engine input carries the file's own quality time step");

	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const t0 = Date.now();
	const run = await EngCalcs.lpnEpanetRun(model);
	const ms = Date.now() - t0;
	check(run.ok, `the run completed (${ms} ms)` + (run.ok ? '' : ` -- ${run.engineError}`));
	if (!run.ok) { process.exit(1); }
	check(run.frames.length === refTimes.length,
		`frames: ${run.frames.length}, EPA's report has ${refTimes.length}`);
	check(run.frames.every((f) => f.qualities && Object.keys(f.qualities).length > 0),
		'every frame carries a quality value for every node');

	let worst = 0, worstAt = '', n = 0;
	const diffs = [];
	for (const f of run.frames) {
		const r = ref[f.t];
		if (!r) { check(false, `EPA's report has no block at ${EngCalcs.lpnFormatTime(f.t)}`); continue; }
		for (const id in r.quality) {
			if (f.qualities[id] === undefined) continue;
			const d = Math.abs(f.qualities[id] - r.quality[id]);
			n++; diffs.push(d);
			if (d > worst) { worst = d; worstAt = `${id} at ${EngCalcs.lpnFormatTime(f.t)}`; }
		}
	}
	diffs.sort((a, b) => a - b);
	const median = diffs.length ? diffs[Math.floor(diffs.length / 2)] : Infinity;
	check(n > 2000, `source share: ${n} comparisons against EPA's own report`);
	check(worst < TRACE_TOL_PCT,
		`source share: worst ${worst.toFixed(3)} percent at ${worstAt} (tol ${TRACE_TOL_PCT})`);
	check(median < TRACE_MEDIAN_TOL_PCT,
		`source share: median ${median.toFixed(4)} percent (tol ${TRACE_MEDIAN_TOL_PCT})`);

	// **THE TRACE MUST ACTUALLY MOVE.** Every number above can agree while every share is zero if
	// the option never reached the engine, so the spread is asserted directly. Net3 exists to show
	// the Lake's share changing over the day.
	let lo = Infinity, hi = -Infinity;
	run.frames.forEach((f) => Object.keys(f.qualities).forEach((id) => {
		lo = Math.min(lo, f.qualities[id]); hi = Math.max(hi, f.qualities[id]);
	}));
	check(lo <= 0.01 && hi >= 99, `the share really varies: ${lo.toFixed(2)} to ${hi.toFixed(2)} percent`);

	// ---- 4. water age, against arithmetic rather than against ourselves --------------------------
	//
	// Reservoir -> one pipe -> one junction. The junction's demand is the only flow, so the water in
	// the pipe moves at Q/A and the age at the far end settles at the travel time V/Q. Everything
	// here is SI, which is what a model handed to js/lpn-epanet.js always is.
	async function ageCase(demandM3s) {
		const D = 0.3, L = 1000, area = Math.PI * D * D / 4, travel = area * L / demandM3s;
		const m = {
			nodes: [
				{ id: 'R', type: 'reservoir', head: 100, elev: 0 },
				{ id: 'J', type: 'junction', elev: 0, demand: demandM3s, demandBase: demandM3s }
			],
			links: [{ id: 'P', type: 'pipe', from: 'R', to: 'J', length: L, diameter: D,
				roughness: 130, k: 0, status: 'open' }],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			quality: { mode: 'age' },
			time: {
				times: { duration: 86400 * 3, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 60 },
				patterns: [], controls: [], warnings: []
			}
		};
		const r = await EngCalcs.lpnEpanetRun(m);
		if (!r.ok) { return { ok: false, engineError: r.engineError }; }
		const last = r.frames[r.frames.length - 1];
		return { ok: true, travel: travel, age: last.qualities.J };
	}
	const slow = await ageCase(0.02);
	const fast = await ageCase(0.04);
	check(slow.ok && fast.ok, 'the two age runs completed');
	if (slow.ok && fast.ok) {
		// SECONDS, because every result leaving js/lpn-epanet.js is SI. EPANET reports age in hours,
		// so a missing x3600 shows here as an answer 3600 times too small.
		const errSlow = Math.abs(slow.age - slow.travel) / slow.travel;
		const errFast = Math.abs(fast.age - fast.travel) / fast.travel;
		check(errSlow < 0.02,
			`age at half flow: ${slow.age.toFixed(1)} s against ${slow.travel.toFixed(1)} s of travel time (${(errSlow * 100).toFixed(2)}%)`);
		check(errFast < 0.02,
			`age at full flow: ${fast.age.toFixed(1)} s against ${fast.travel.toFixed(1)} s of travel time (${(errFast * 100).toFixed(2)}%)`);
		// THE COUPLING, asserted rather than assumed: double the flow, halve the age. A conversion
		// factor that is simply wrong passes both lines above only if it is wrong by a ratio, and
		// this is the line that says it is not.
		const ratio = slow.age / fast.age;
		check(Math.abs(ratio - 2) < 0.05, `double the flow halves the age: ratio ${ratio.toFixed(3)}`);
	}

	// ---- 5. what the page must NOT do ------------------------------------------------------------
	check(!EngCalcs.lpnQualityRuns({ mode: 'chemical' }),
		'a chemical is not run: it has no [REACTIONS] here to run against');
	check(!EngCalcs.lpnQualityRuns({ mode: 'trace', traceNode: '' }),
		'a source share with no source named is not run: EPANET would reject the file');
	check(!EngCalcs.lpnQualityRuns({ mode: 'none' }), 'and nothing asked for is nothing run');
	// A run with quality OFF must carry no quality at all -- not zeros, which read as an answer.
	const plain = await EngCalcs.lpnEpanetRun(Object.assign({}, model, { quality: { mode: 'none' } }));
	check(plain.ok && plain.frames.every((f) => f.qualities === undefined),
		'with the analysis off, no frame claims a quality value');

	console.log(failures === 0 ? '\nquality harness: all checks passed'
		: `\nquality harness: ${failures} FAILED`);
	process.exit(failures === 0 ? 0 : 1);
}());

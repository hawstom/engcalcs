// THE RUN BOX AND THE PROGRESS BEHIND IT -- ROADMAP Task 450.
//
//   node dev/lpn-spike/run-box-harness.js
//
// Tom, 2026-08-19: "The Run button does nothing... It needs a box with a progress bar and
// completion report. epanetjs also includes a link to the EPANET run report."
//
// TWO HALVES, and they are tested against two different things:
//
//   1. **THE PROGRESS IS REAL**, so it is checked against the REAL engine on the real Net3 rather
//      than against a stub. A stub that hands back a fraction proves only that the harness can
//      count -- the claim is that EPANET's own clock is what drives the bar, and only EPANET can
//      say whether that clock is monotonic, whether it arrives at the end, and whether the report
//      the engine writes is really there to be offered.
//   2. **THE BOX FOLLOWS THE RUN THAT OWNS IT**, which is about js/lpn-time.js's bookkeeping and
//      not about hydraulics, so it is driven with a fake engine and a fake host exactly as
//      dev/lpn-spike/time-harness.js drives the invalidation rule. The one that matters: a run
//      the page has SUPERSEDED must not leave a bar sitting on screen part-filled, because a
//      frozen bar and a live one look identical.
//
// **THERE IS NO DOM HERE.** The box's own state is kept in js/lpn-time.js and exposed through
// EngCalcs.lpnTimeRunBoxState(); the DOM is a rendering of it, and the browser pass
// (dev/browser-pass/specs/time.js) is what checks the rendering. Splitting it that way is what
// lets the bookkeeping be tested in Node at all.

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

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail === undefined ? '' : `  (${detail})`));
	if (!ok) failures++;
}
function eq(a, b, msg) { check(JSON.stringify(a) === JSON.stringify(b), `${msg}  (${JSON.stringify(a)})`); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const realRun = EngCalcs.lpnEpanetRun;

// ================================================================================================
// 1. REAL PROGRESS OUT OF THE REAL ENGINE
// ================================================================================================
async function progressSection() {
	console.log('\n---- real progress, from EPANET\'s own clock ----');
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	const model = buildModel(EngCalcs, parsed);
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	const seen = [];
	// A one-millisecond slice forces the loop to yield often, so the sequence of reports is long
	// enough to be a real test of monotonicity rather than one before and one after. The SHIPPED
	// slice is EngCalcs.LPN_EPANET_SLICE_MS; this drives the parameter rather than the constant so
	// nothing here depends on how fast this machine happens to be.
	const run = await realRun.call(EngCalcs, model, {
		sliceMs: 1,
		onProgress: (p) => seen.push(p)
	});

	check(run.ok, 'the run completed');
	check(seen.length >= 3, 'progress is reported more than once during the run', `${seen.length} reports`);
	eq(seen[0].fraction, 0, 'the first report is 0 -- the box opens empty rather than at a guess');
	eq(seen[seen.length - 1].fraction, 1, 'and the last one is exactly 1, so the bar always finishes');
	let monotonic = true, framesMonotonic = true;
	for (let i = 1; i < seen.length; i++) {
		if (seen[i].fraction < seen[i - 1].fraction) monotonic = false;
		if (seen[i].frames < seen[i - 1].frames) framesMonotonic = false;
	}
	check(monotonic, 'the fraction never goes backwards');
	check(framesMonotonic, 'and neither does the count of frames kept');
	check(seen.every((p) => p.fraction >= 0 && p.fraction <= 1), 'every fraction is inside 0..1');
	// **THE FRACTION IS SIMULATED TIME, NOT A COUNTER.** Asserted directly, because a plausible
	// wrong implementation -- frames.length / expected -- would pass everything above and then be
	// wrong on any run whose reporting grid does not start at zero.
	const drift = seen.filter((p) => p.duration > 0)
		.map((p) => Math.abs(p.fraction - p.t / p.duration))
		.reduce((a, b) => Math.max(a, b), 0);
	check(drift < 1e-12, 'the fraction IS t/duration -- EPANET\'s clock, not a frame counter',
		`worst drift ${drift}`);
	eq(seen[seen.length - 1].frames, run.frames.length, 'the last report agrees with the run it finished');

	// ---- the EPANET run report ----
	//
	// **IT IS THE ENGINE'S OWN FILE, VERBATIM.** Checked by its own header rather than by length:
	// anything we composed ourselves could be any length at all, and the one thing we must never do
	// is present our own numbers as EPANET's.
	check(typeof run.report === 'string' && run.report.length > 0,
		'the run carries EPANET\'s own report', `${(run.report || '').length} characters`);
	check(/E P A N E T/.test(run.report), '...with the engine\'s own banner in it');
	check(/Version 2\.3/.test(run.report), '...and the engine\'s own version');
	check(/Input Data File/.test(run.report), '...and its input summary');
	check(/Hydraulic Status/.test(run.report), '...and the status messages that say what happened');
	// Net3 switches pump 10 on a timer and 335/330 on tank 1: the report is the only place the page
	// can show a user WHY a link changed state, which is the whole reason it is worth offering.
	check(/changed by/.test(run.report), '...including which controls fired and when');

	// **SLICING CHANGES NO NUMBER.** The run above yielded on every step; this one runs in a single
	// slice. Same engine, same model, so every frame must be identical bit for bit -- that is what
	// says the yield is a pause and not a perturbation.
	const whole = await realRun.call(EngCalcs, model, { sliceMs: 1e9 });
	eq(whole.frames.length, run.frames.length, 'a sliced run and an unsliced one keep the same frames');
	let worst = 0;
	for (let i = 0; i < whole.frames.length; i++) {
		for (const id in whole.frames[i].heads) {
			worst = Math.max(worst, Math.abs(whole.frames[i].heads[id] - run.frames[i].heads[id]));
		}
	}
	eq(worst, 0, 'and every head is IDENTICAL, not merely close -- yielding is a pause, not a change');
}

// ================================================================================================
// 2. THE BOX FOLLOWS THE RUN THAT OWNS IT
// ================================================================================================
async function boxSection() {
	console.log('\n---- the box a run opens, and the run that takes it away ----');

	// The fake engine, in the shape dev/lpn-spike/time-harness.js uses: real wall clock, because
	// the page's own budget is a measurement of wall clock. It reports progress the way the real
	// one does, in steps, so the box is driven by the same sequence of calls.
	let cost = 5, steps = 4, report = 'EPANET report text';
	EngCalcs.lpnEpanetRun = function (model, options) {
		const opts = options || {};
		const frames = EngCalcs.lpnReportTimes(doc.times).map((t) => ({
			t, heads: {}, pressures: {}, flows: {}, headlosses: {}, velocities: {},
			demands: {}, levels: { T1: 3 }, statuses: {}
		}));
		let p = Promise.resolve();
		if (opts.onProgress) { opts.onProgress({ t: 0, duration: doc.times.duration, fraction: 0, frames: 0 }); }
		for (let k = 1; k <= steps; k++) {
			p = p.then(() => wait(cost / steps)).then(() => {
				if (opts.onProgress) {
					opts.onProgress({
						t: doc.times.duration * k / steps, duration: doc.times.duration,
						fraction: k / steps, frames: Math.round(frames.length * k / steps)
					});
				}
			});
		}
		return p.then(() => ({
			ok: true, engineVersion: 'fake', warnings: [], frames, report
		}));
	};

	const doc = { times: EngCalcs.lpnTimesDefaults(), nodes: [], links: [] };
	doc.times.duration = 86400;
	const shape = { elev: 100 };
	const buildFake = () => ({ nodes: [{ id: 'J1', type: 'junction', elev: shape.elev }], links: [] });
	let steadySolves = 0;
	const solveNow = () => { if (!EngCalcs.lpnTimeRun(buildFake())) { steadySolves++; } };
	const hydraulicEdit = () => { shape.elev += 1; solveNow(); };
	EngCalcs.lpnTimeInit({
		tabs: [],
		doc: () => doc,
		apply: () => {}, status: () => {},
		solve: solveNow, solveNow: solveNow,
		native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
		snapshot: () => {}, save: () => {},
		toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
	});
	EngCalcs.LPN_TIME_AUTO.idleMs = 40;
	EngCalcs.LPN_TIME_AUTO.budgetMs = 60;

	// ---- an AUTOMATIC run opens no box ----
	//
	// The page keeping itself up to date is not an event, and a box that appeared every time the
	// mouse stopped moving would be the page shouting about its own housekeeping.
	EngCalcs.lpnTimeArrived();
	solveNow();
	await wait(60);
	eq(EngCalcs.lpnTimeRunBoxState().open, false, 'a document arriving runs, and opens NO box');
	hydraulicEdit();
	await wait(120);
	eq(EngCalcs.lpnTimeRunBoxState().open, false, 'and neither does the automatic run after a quiet moment');

	// ---- Run opens one, and it fills ----
	const bars = [];
	const watch = setInterval(() => {
		const s = EngCalcs.lpnTimeRunBoxState();
		if (s.open && s.phase === 'running') { bars.push(s.fraction); }
	}, 1);
	cost = 40;
	EngCalcs.lpnTimeRunNow();
	await wait(5);
	check(EngCalcs.lpnTimeRunBoxState().open, 'pressing Run opens the box AS THE RUN STARTS');
	eq(EngCalcs.lpnTimeRunBoxState().phase, 'running', 'and it says it is running while it runs');
	await wait(120);
	clearInterval(watch);
	check(bars.length > 0, 'the bar was seen part-filled while the run was in flight', bars.join(' '));
	check(bars.every((v, i) => i === 0 || v >= bars[i - 1]), 'and it only ever filled', bars.join(' '));

	// ---- ...and it reports what the run did ----
	const done = EngCalcs.lpnTimeRunBoxState();
	eq(done.open, true, 'the box STAYS after the run -- a report nobody can finish reading is not a report');
	eq(done.phase, 'done', 'and it says the run finished');
	eq(done.fraction, 1, 'with the bar full');
	eq(done.frames, 25, 'it states the frame count');
	check(done.ms > 0, 'and how long the run took', `${Math.round(done.ms)} ms`);
	eq(EngCalcs.lpnTimeRunReport(), report, 'and it holds EPANET\'s own report, unedited');
	eq(done.reportLength, report.length, '...with its length in the state a test can read');

	// ---- THE REPORT OUTLIVES THE BOX (ROADMAP Task 467) ----
	//
	// Project > EPANET run report is the row that exists because the report was unreachable: the box
	// only ever appears for a run somebody pressed Calculate for, so on a network that re-runs itself
	// after a quiet moment -- the common case -- EPANET printed a report and nothing could show it.
	// Two properties, and the second is the one a stub could hide:
	//   * closing the box does not destroy the report;
	//   * an AUTOMATIC run, which never had a box at all, still leaves one.
	EngCalcs.lpnTimeRunBoxHide();
	eq(EngCalcs.lpnTimeRunBoxState().open, false, 'set up: the box is closed, as its X closes it');
	eq(EngCalcs.lpnTimeLastReport(), report, 'the last run\'s report is kept after the run');
	check(EngCalcs.lpnTimeShowReport(), 'and Project > EPANET run report puts it back on screen');
	{
		const shown = EngCalcs.lpnTimeRunBoxState();
		eq(shown.open, true, '...in the run box, which is the one place a run\'s outcome is shown');
		eq(shown.phase, 'done', '...saying the run finished rather than that one is running');
		eq(shown.reportLength, report.length, '...with the whole report in it');
		eq(EngCalcs.lpnTimeRunReport(), report, '...unedited');
		// The copy button is only reachable while a report is open, which is also the only state a
		// user can press it in -- so it is exercised here rather than after the box is torn down.
		await copySection();
	}

	// The automatic case, which is the one the row was built for. A fresh edit, no Calculate, no box
	// -- and a report at the end of it all the same.
	EngCalcs.lpnTimeRunBoxHide();
	report = 'Page 1  EPANET  automatic run\n  Hydraulic Status: balanced\n';
	hydraulicEdit();
	await wait(160);
	eq(EngCalcs.lpnTimeRunBoxState().open, false, 'an automatic run still opens no box');
	eq(EngCalcs.lpnTimeLastReport(), report, '...and still records its report');
	check(EngCalcs.lpnTimeShowReport(), '...which the menu row can show');
	eq(EngCalcs.lpnTimeRunReport(), report, '...and it is THIS run\'s report, not the earlier one');
	EngCalcs.lpnTimeRunBoxHide();

	// ---- A SUPERSEDED RUN TAKES ITS BOX WITH IT ----
	//
	// This is the one that matters. The page solves on a 300 ms debounce and a WASM round trip can
	// outlast the next edit; js/lpn-time.js already refuses to DRAW a superseded run's frames, and
	// a bar left sitting on screen at 60% is the same lie one layer up -- a frozen bar and a live
	// one look identical.
	cost = 120;
	EngCalcs.lpnTimeRunNow();
	// Long enough for the fake engine to have reported at least one step, so "part-filled" below
	// is a real part-fill rather than a bar that had not started.
	await wait(50);
	eq(EngCalcs.lpnTimeRunBoxState().phase, 'running', 'a slow run has its box up');
	const midway = EngCalcs.lpnTimeRunBoxState().fraction;
	hydraulicEdit();                       // supersedes it: a new token, and no new run (over budget)
	await wait(250);
	eq(EngCalcs.lpnTimeRunBoxState().open, false,
		'and the box GOES when that run is superseded, rather than freezing part-filled');
	check(midway > 0 && midway < 1, 'the superseded run really was PART WAY THROUGH, not finished',
		String(midway));

	// ---- a run that fails says so, in the box ----
	EngCalcs.lpnEpanetRun = () => wait(5).then(() => ({ ok: false, issues: [{ code: 'unreachable' }], frames: [] }));
	EngCalcs.lpnTimeRunNow();
	await wait(80);
	const failed = EngCalcs.lpnTimeRunBoxState();
	eq(failed.open, true, 'a run that cannot be done still opens a box');
	eq(failed.phase, 'failed', 'and the box says the run did not finish');
	eq(EngCalcs.lpnTimeRunReport(), '', 'and offers no report, because there is none');

	// ---- an engine that throws is the same story ----
	EngCalcs.lpnEpanetRun = () => wait(5).then(() => { throw new Error('no engine'); });
	EngCalcs.lpnTimeRunNow();
	await wait(80);
	eq(EngCalcs.lpnTimeRunBoxState().phase, 'failed', 'an engine that throws leaves the box saying so, not spinning');

	eq(steadySolves > 0, true, 'the page went on doing its ordinary steady solves throughout');
}

// ---- THE REPORT COPIES ITSELF OUT --------------------------------------------------------------
//
// **THE REPORT IS THE ONE PLACE A REFUSAL NAMES ITS OWN LINE**, which is how the `Error 205` in a
// reservoir's pattern column was finally found -- by a person reading it and typing it out. Tom
// asked for a copy button so the next one costs a press instead.
//
// A copy button that silently fails looks exactly like one that worked, so both routes are driven
// here: `navigator.clipboard` when it exists, and the off-screen textarea for a page served over
// plain http, where the modern API is simply absent. The label change is the only feedback a user
// gets, so it is asserted too.
async function copySection() {
	console.log('\n---- the run report copies itself out ----');
	const report = EngCalcs.lpnTimeRunReport();
	eq(typeof report === 'string' && report.length > 0, true, 'there is a report to copy');
	// A stand-in for the button: the copier only ever reads and writes its label.
	const btn = { textContent: 'Copy' };

	// 1. The modern route.
	let wrote = null;
	// **NODE SHIPS ITS OWN READ-ONLY `navigator`**, so a plain assignment is silently ignored and
	// every assertion below would pass by taking the fallback route instead of the one under test.
	const had = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
	const setNav = (v) => Object.defineProperty(globalThis, 'navigator', { value: v, configurable: true, writable: true });
	setNav({ clipboard: { writeText: function (t) { wrote = t; return Promise.resolve(); } } });
	EngCalcs.lpnTimeCopyForTest(report, btn);
	await wait(20);
	eq(wrote, report, 'the clipboard gets EPANET\'s own report, unedited');
	eq(btn.textContent !== 'Copy', true, '...and the button says so rather than staying silent');

	// 2. The fallback, which is what a page served over plain http actually uses -- there is no
	//    navigator.clipboard there at all, and a silent no-op would be indistinguishable from a copy.
	btn.textContent = 'Copy';
	setNav({});
	let selected = false, copied = false;
	// **THIS HARNESS HAS NO DOM AT ALL** -- it tests the run box's STATE, which is why the button
	// itself is not reachable here. The fallback route needs just enough of a document to prove it
	// selects a textarea and asks for a copy, so it gets one for the length of this assertion.
	const hadDoc = Object.getOwnPropertyDescriptor(globalThis, 'document');
	Object.defineProperty(globalThis, 'document', {
		value: {
			body: { appendChild: function () {}, removeChild: function () {} },
			execCommand: function (cmd) { copied = (cmd === 'copy'); return true; },
			createElement: function (tag) {
				return { value: '', style: {}, tagName: String(tag).toUpperCase(),
					select: function () { selected = true; } };
			}
		},
		configurable: true, writable: true
	});
	EngCalcs.lpnTimeCopyForTest(report, btn);
	await wait(20);
	if (hadDoc) { Object.defineProperty(globalThis, 'document', hadDoc); } else { delete globalThis.document; }
	eq(selected && copied, true, 'with no clipboard API it still copies, through a selected textarea');
	eq(btn.textContent !== 'Copy', true, '...and still says so');

	// 3. A route that FAILS must put the label back rather than claim success.
	btn.textContent = 'Copy';
	setNav({ clipboard: { writeText: function () { return Promise.reject(new Error('denied')); } } });
	EngCalcs.lpnTimeCopyForTest(report, btn);
	await wait(20);
	eq(btn.textContent, 'Copy', 'a refused clipboard leaves the label alone rather than lying');
	if (had) { Object.defineProperty(globalThis, 'navigator', had); }
}

(async function () {
	await progressSection();
	await boxSection();
	console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());

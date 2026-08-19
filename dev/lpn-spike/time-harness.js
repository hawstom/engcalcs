// js/lpn-time.js's PURE half: the reporting grid, the frame lookup, the settings edit that keeps
// the file's own text, and the unit conversion of a control on its way to the solver.
//
//   node dev/lpn-spike/time-harness.js
//
// The RUN itself is dev/lpn-spike/eps-net3-harness.js, against EPA's published 24-hour report.
// This file covers what that one cannot see: the arithmetic a user's edit goes through, and the
// three or four ways a plausible implementation gets it wrong without any number looking odd.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}
function eq(a, b, msg) { check(JSON.stringify(a) === JSON.stringify(b), `${msg}  (${JSON.stringify(a)})`); }

// ---- is it a run at all ----
check(EngCalcs.lpnTimeIsExtended({ duration: 86400 }), 'a duration of 24 h is a run');
check(!EngCalcs.lpnTimeIsExtended({ duration: 0 }), 'a duration of 0 is one instant -- EPANET\'s own rule');
check(!EngCalcs.lpnTimeIsExtended(null), 'a document with no clock is one instant');

// ---- the reporting grid ----
{
	const t = EngCalcs.lpnTimesDefaults();
	t.duration = 86400;
	eq(EngCalcs.lpnReportTimes(t).length, 25, '24 h at a 1 h report step is 25 stops, both ends inclusive');
	// REPORT START IS NOT ALWAYS ZERO. A grid built as k*step would label the slider with times the
	// run never reported.
	t.reportStart = 43200;
	const late = EngCalcs.lpnReportTimes(t);
	eq(late[0], 43200, 'the grid starts where the report starts');
	eq(late[late.length - 1], 86400, 'and still ends at the duration');
	// A report step that does not divide the duration must not invent a stop past the end.
	t.reportStart = 0; t.reportStep = 7 * 3600;
	const odd = EngCalcs.lpnReportTimes(t);
	check(odd[odd.length - 1] <= 86400, 'an indivisible report step stops at or before the duration');
}

// ---- which frame shows a moment ----
{
	const frames = [{ t: 0 }, { t: 3600 }, { t: 7200 }];
	eq(EngCalcs.lpnTimeFrameIndexAt(frames, 3600), 1, 'a moment on a stop shows that stop');
	// THE LAST FRAME AT OR BEFORE, never the nearest: a slider between two stops must show what was
	// true then, not a state that has not happened.
	eq(EngCalcs.lpnTimeFrameIndexAt(frames, 7100), 1, 'a moment between stops shows the earlier one');
	eq(EngCalcs.lpnTimeFrameIndexAt(frames, 99999), 2, 'past the end shows the last stop');
	eq(EngCalcs.lpnTimeFrameIndexAt([], 0), -1, 'an empty run has no frame');
}

// ---- the two readouts ----
{
	const t = EngCalcs.lpnTimesDefaults();
	// Elapsed and clock are DIFFERENT NUMBERS and answer different questions: a demand pattern runs
	// on the first, a CLOCKTIME control fires on the second.
	t.startClock = 6 * 3600;
	eq(EngCalcs.lpnTimeElapsedText(30 * 3600), '30:00', 'hour 30 of a run is 30:00 elapsed');
	eq(EngCalcs.lpnTimeClockText(t, 30 * 3600), '12:00', 'and the wall clock says noon, six hours in on day two');
	eq(EngCalcs.lpnTimeClockText(t, 0), '06:00', 'the run begins at its start clock time');
}

// ---- editing a setting keeps the user's own text ----
{
	const t = EngCalcs.lpnTimesDefaults();
	t.text = { duration: '24:00' };
	t.duration = 86400;
	eq(EngCalcs.lpnTimeText(t, 'duration', t.duration), '24:00',
		'an untouched value comes back as the text the file wrote');

	check(EngCalcs.lpnTimeSetField(t, 'duration', '36:00'), 'a valid edit is accepted');
	eq(t.duration, 129600, 'and stores the seconds');
	eq(EngCalcs.lpnTimeText(t, 'duration', t.duration), '36:00', 'and hands back exactly what was typed');

	// A BARE NUMBER IS HOURS in [TIMES], EPANET's rule and the one most likely to be assumed to be
	// seconds. Getting it wrong turns a one-day run into a ten-year one with no error anywhere.
	check(EngCalcs.lpnTimeSetField(t, 'duration', '48'), 'a bare number is accepted');
	eq(t.duration, 172800, 'and means HOURS, not seconds');
	eq(EngCalcs.lpnTimeText(t, 'duration', t.duration), '48', 'and is still shown as the user typed it');

	check(EngCalcs.lpnTimeSetField(t, 'patternStep', '30 minutes'), 'a number with its own unit word is accepted');
	eq(t.patternStep, 1800, 'and means what it says');

	// A REJECTED EDIT MUST CHANGE NOTHING. A half-written clock -- a new text beside an old number,
	// or the reverse -- would be handed back by lpnTimeText for as long as it happened to parse.
	const before = JSON.stringify(t);
	check(!EngCalcs.lpnTimeSetField(t, 'duration', 'soon'), 'text that is not a time is refused');
	check(!EngCalcs.lpnTimeSetField(t, 'duration', '-3'), 'a negative time is refused');
	check(!EngCalcs.lpnTimeSetField(t, 'duration', ''), 'an empty box is refused');
	check(!EngCalcs.lpnTimeSetField(t, 'noSuchField', '1:00'), 'a field that is not a time setting is refused');
	eq(JSON.stringify(t) === before, true, 'and none of them changed anything');

	// The text drops itself once the number moves by any other route -- so no edit path has to
	// remember to clear one.
	t.duration = 7200;
	eq(EngCalcs.lpnTimeText(t, 'duration', t.duration), '2:00', 'stale text is dropped, not shown');
}

// ---- a control's numbers reach the solver in SI ----
{
	// The threshold is the one that bites: a tank condition is a LEVEL and a junction condition is
	// a PRESSURE, in the units the document states. Net3's `BELOW 17.1` is 17.1 FEET, and left
	// unconverted it becomes 17.1 m -- above that tank's maximum, so the pump never starts and the
	// whole day is quietly wrong rather than visibly broken.
	const toSI = (v, id) => v * ({ lpn_u_elevhead: 0.3048, lpn_u_pressure: 0.70432, lpn_u_flow: 6.309e-5 }[id] || 1);
	const doc = {
		times: EngCalcs.lpnTimesDefaults(),
		patterns: [EngCalcs.lpnPatternMake('1', [1.2, 0.8])],
		controls: [
			{ link: '335', action: { status: 'open' }, condition: { kind: 'node', node: '1', cmp: 'below', value: 17.1, unit: 'head' } },
			{ link: 'V1', action: { setting: 300, settingUnit: 'flow' }, condition: { kind: 'time', seconds: 3600 } },
			{ link: 'P9', action: { setting: 0.9, settingUnit: null }, condition: { kind: 'clocktime', seconds: 21600 } }
		]
	};
	const block = EngCalcs.lpnTimeModelBlock(doc, toSI);
	check(Math.abs(block.controls[0].condition.value - 17.1 * 0.3048) < 1e-9,
		'a tank threshold converts through the elevation/head unit');
	check(Math.abs(block.controls[1].action.setting - 300 * 6.309e-5) < 1e-12,
		'an FCV setting converts through the flow unit');
	eq(block.controls[2].action.setting, 0.9,
		'a dimensionless setting -- a pump speed -- is NOT converted');
	eq(block.controls[2].condition.seconds, 21600, 'a clock condition carries its seconds untouched');
	// A multiplier is dimensionless and must reach the engine as written.
	eq(block.patterns[0].multipliers, [1.2, 0.8], 'a pattern crosses the boundary unchanged');
	// The block is a COPY: a run must not be able to edit the document through it.
	check(block.controls[0] !== doc.controls[0], 'the block copies the controls rather than aliasing them');
	eq(doc.controls[0].condition.value, 17.1, 'and the document still states its own number');
}

// ================================================================================================
// WHEN A PERIOD RUN HAPPENS -- ROADMAP Task 248, 2026-08-19
// ================================================================================================
//
// The editor half of js/lpn-time.js touches no DOM until something is actually mounted, so the
// whole invalidation rule can be driven here with a fake host and a fake engine, and the ONE
// number this change is justified by -- how many engine calls a burst of edits provokes -- can be
// counted rather than asserted.
//
// The rule under test, in one sentence: **an edit recalculates the first reporting time only, the
// frames go with it, and the period comes back either after a quiet moment (while the last measured
// run was cheap) or on the Run button (when it was not).**

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function runSection() {
	console.log('\n---- when a period run happens ----');

	// The fake engine. `cost` is real wall clock, because the page's own budget test is a
	// measurement of wall clock -- a stub that resolved instantly could never produce the expensive
	// case at all, which is exactly the "stub that removes the coupling" dev/testing-notes.md warns
	// about. It varies the one quantity the real thing varies: how long a run takes.
	let engineCalls = 0, cost = 5;
	EngCalcs.lpnEpanetRun = function () {
		engineCalls++;
		return wait(cost).then(() => ({
			ok: true, engineVersion: 'fake', warnings: [],
			frames: EngCalcs.lpnReportTimes(doc.times).map((t) => ({
				t, heads: {}, pressures: {}, flows: {}, headlosses: {}, velocities: {},
				demands: {}, levels: { T1: 3 }, statuses: {}
			}))
		}));
	};

	const doc = { times: EngCalcs.lpnTimesDefaults(), nodes: [], links: [] };
	doc.times.duration = 86400;

	let steadySolves = 0, statuses = [];
	// The page's own seam: solve() is the 300 ms debounce, solveNow() is not. Both end in the same
	// place -- runSolve(), which offers the model to lpnTimeRun() and does the steady solve itself
	// when it is handed back.
	// **TWO KINDS OF EDIT, and the difference is the whole of the biggest saving.** `elev` is a
	// number the solver reads; `x` is where the node is drawn and no solve has ever looked at it.
	// The page tells them apart by FINGERPRINTING the assembled model rather than by classifying
	// the edit, so this drives it the same way: the model is rebuilt on every solve out of the
	// same two fields a real assembleModel() would read.
	const shape = { elev: 100, x: 0 };
	const buildModel = () => ({ nodes: [{ id: 'J1', type: 'junction', elev: shape.elev }], links: [] });
	const solveNow = () => { if (!EngCalcs.lpnTimeRun(buildModel())) { steadySolves++; } };
	const hydraulicEdit = () => { shape.elev += 1; solveNow(); };
	const cosmeticEdit = () => { shape.x += 10; solveNow(); };
	EngCalcs.lpnTimeInit({
		tabs: [],
		doc: () => doc,
		apply: () => {}, status: (s) => statuses.push(s),
		solve: solveNow, solveNow: solveNow,
		native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
		snapshot: () => {}, save: () => {},
		toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
	});
	// Short enough to test in a second; the shipped values and the reasoning behind them are on
	// EC.LPN_TIME_AUTO in js/lpn-time.js.
	EngCalcs.LPN_TIME_AUTO.idleMs = 40;
	EngCalcs.LPN_TIME_AUTO.budgetMs = 60;

	// ---- a document arriving is presented over its duration ----
	EngCalcs.lpnTimeArrived();
	solveNow();
	await wait(60);
	eq(engineCalls, 1, 'a document that arrives with a duration is run once, without being asked');
	eq(EngCalcs.lpnTimeRunState().frames, 25, 'and the whole period is there');
	check(!!EngCalcs.lpnTimeCurrentFrame(), 'and lpnTimeCurrentFrame() answers');

	// ---- AN EDIT THE SOLVER CANNOT SEE COSTS NOTHING AT ALL ----
	//
	// Moving a node, editing a text element, recolouring, renaming. Every one of these provoked a
	// full period run before 2026-08-19. The frames are still a true solve of this document, so
	// they STAY -- there is nothing to recompute and nothing stale about them.
	engineCalls = 0; steadySolves = 0;
	cosmeticEdit();
	await wait(120);
	eq(engineCalls, 0, 'MOVING A NODE PROVOKES NO RUN, then or later');
	eq(EngCalcs.lpnTimeRunState().frames, 25, 'and the frames are KEPT -- nothing the solver reads changed');
	check(!!EngCalcs.lpnTimeCurrentFrame(), 'so the run is still there to be scrubbed through');

	// ---- A HYDRAULIC EDIT DOES NOT RUN THE PERIOD EITHER ----
	engineCalls = 0; steadySolves = 0;
	hydraulicEdit();
	eq(engineCalls, 0, 'AN EDIT PROVOKES NO ENGINE RUN');
	eq(steadySolves, 1, 'and the solve is handed back, so the page works out the first time step');
	eq(EngCalcs.lpnTimeCurrentFrame(), null,
		'THE STALE FRAMES ARE GONE -- lpnTimeCurrentFrame() cannot answer from a superseded run');
	eq(EngCalcs.lpnTimeRunState().t, 0, 'and the transport is back at the first reporting time');

	// ---- three drags in a burst: ONE run, and only after the quiet ----
	engineCalls = 0;
	hydraulicEdit(); await wait(10);
	hydraulicEdit(); await wait(10);
	hydraulicEdit();
	eq(engineCalls, 0, 'three edits in a burst provoke NO run while they are happening');
	await wait(120);
	eq(engineCalls, 1, 'and exactly one once the editing stops -- the burst is coalesced, not queued');
	eq(EngCalcs.lpnTimeRunState().frames, 25, 'the period is back');

	// ---- an expensive network stops re-running itself ----
	//
	// The budget is a MEASUREMENT, not a setting: the page times its own run and stops volunteering
	// once that measurement says a run costs more than a pause the user would not notice.
	cost = 90;   // over the 60 ms budget set above
	EngCalcs.lpnTimeRunNow();
	await wait(160);
	check(EngCalcs.lpnTimeRunState().lastRunMs > 60, 'a slow run is measured as slow',
		`${Math.round(EngCalcs.lpnTimeRunState().lastRunMs)} ms`);
	check(!EngCalcs.lpnTimeRunState().auto, 'so the page stops running the period by itself');
	engineCalls = 0;
	hydraulicEdit(); await wait(10); hydraulicEdit();
	await wait(160);
	eq(engineCalls, 0, 'AND AN EDIT NOW PROVOKES NOTHING AT ALL, however long the user waits');
	eq(EngCalcs.lpnTimeCurrentFrame(), null, 'nothing stale is left behind to draw');
	check(EngCalcs.lpnTimeStatusNote().length > 0,
		'and the page SAYS the later times are not being kept up to date');

	// ---- ...but Run still runs it ----
	EngCalcs.lpnTimeRunNow();
	await wait(160);
	eq(engineCalls, 1, 'Run works the whole period out');
	eq(EngCalcs.lpnTimeRunState().frames, 25, 'and the frames are back');
	eq(EngCalcs.lpnTimeStatusNote(), '', 'and the page stops saying they are out of date');

	// ---- a duration of 0 is not a run at all ----
	doc.times.duration = 0;
	engineCalls = 0;
	hydraulicEdit();
	await wait(160);
	eq(engineCalls, 0, 'a document with no duration never reaches the run at all');
	eq(EngCalcs.lpnTimeCurrentFrame(), null, 'and keeps no frames from when it had one');
}

runSection().then(() => {
	console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
});

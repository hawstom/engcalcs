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

console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);

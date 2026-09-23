// The toolbar's time-step selector: each row is ONE INSTANT, never a range, and elapsed time
// keeps climbing past 24:00 rather than wrapping to the wall clock. Run with:
//   node dev/lpn-spike/toolbar-time-step-harness.js
//
// R-105 first asked for a run-time RANGE ("Fix it to say 24:00 - 25:00"), which shipped
// 2026-09-21. Tom reopened it 2026-09-22: "I think I made a mistake, and these are not ranges,
// they are times... change the selector to have only one time per option." Mary (market-researcher)
// confirmed every comparable tool -- EPANET's own Browser Time, epanet-js's step model,
// WaterGEMS/SewerGEMS's Time Browser -- names one instant per step, and every quantity this
// control reveals is a snapshot at an instant. So the range framing is gone; the two things the
// FIRST fix correctly won are kept: elapsed time never wraps back to clock time, and the wall-clock
// reading survives in the row's tip.
//
// This drives EC.lpnTimeMountToolbar() itself through the real DOM stub, rather than re-deriving
// the label text by hand -- a harness that reimplements the fix would pass even if the mount
// function still built a range.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require(path.join(ROOT, 'dev', 'lpn-spike', 'lpn-dom-stub.js'));   // sets global.document
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const EngCalcs = global.EngCalcs;

let failures = 0;
function eq(a, b, msg) {
	const ok = a === b;
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + '  (' + JSON.stringify(a) + ')');
	if (!ok) { failures++; }
}
function ok(cond, msg) {
	console.log((cond ? '  ok   ' : '  FAIL ') + msg);
	if (!cond) { failures++; }
}

function stepRows(times) {
	const doc = { times: times };
	const host = { doc: function () { return doc; }, status: function () {} };
	EngCalcs.lpnTimeInit(host);
	const container = global.document.createElement('div');
	EngCalcs.lpnTimeMountToolbar(container, function (el, icon, name, tip) {
		el.setAttribute('aria-label', name);
		if (tip) { el.title = tip; }
	});
	const sel = container.children.filter(function (c) { return c.id === 'lpn_time_step'; })[0];
	return sel.children.map(function (o) { return { label: o.textContent, tip: o.title }; });
}

// A run past 24 hours: EPANET's own hourly grid, three hours past midnight.
{
	const t = Object.assign(EngCalcs.lpnTimesDefaults(), { duration: 27 * 3600, reportStep: 3600 });
	const rows = stepRows(t);
	const labels = rows.map(function (r) { return r.label; });

	// THE INVARIANT: one bare instant per row, never two times joined by a separator.
	labels.forEach(function (text, i) {
		ok(text.indexOf(' - ') === -1,
			'row ' + i + ' (' + JSON.stringify(text) + ') is a single instant, not a range');
	});

	eq(labels[0], '0:00', 'the first row is a bare instant');
	eq(labels[23], '23:00', 'the step ending the first day is a bare instant');
	eq(labels[24], '24:00', 'crossing midnight does not fall back to the wall clock');
	eq(labels[25], '25:00', 'and every row after it keeps climbing');
	eq(labels[26], '26:00', 'three days would read the same way -- nothing wraps');
	eq(labels[27], '27:00', 'the final report time reads exactly like every other row');
	eq(labels.length, 28, 'one row per reporting instant, 0:00 through 27:00');

	// THE CLOCK READING SURVIVES IN THE TIP, AND IT IS ALSO ONE INSTANT NOW (it may still wrap,
	// because EC.lpnTimeClockText() wrapping at 24:00 is what makes it a CLOCK reading at all).
	ok(rows[24].tip.indexOf(' - ') === -1, 'the tip at hour 24 is one clock reading, not a range');

	// **AND THE TIP NAMES THE DAY** (Tom, 2026-09-23). A wrapped clock alone cannot say which
	// morning `01:00` is, which is the whole reason the day number is there.
	eq(rows[0].tip, 'Day 1, 00:00', 'the first row is day 1');
	eq(rows[23].tip, 'Day 1, 23:00', 'the last hour before midnight is still day 1');
	eq(rows[24].tip, 'Day 2, 00:00', 'midnight rolls the day over');
	eq(rows[25].tip, 'Day 2, 01:00', 'and the hour after it is day 2, not a bare 01:00');
}

// **THE DAY BOUNDARY IS MIDNIGHT ON THE CLOCK, NOT 24 HOURS OF ELAPSED TIME**, and the two differ
// on any run that does not start at midnight. This is the case that separates the two rules: with
// a 06:00 start, day 2 arrives after 18 elapsed hours. Counting elapsed days instead would print
// "Day 1" against a clock reading of tomorrow morning, which is the ambiguity the day number was
// added to remove -- so this assertion is the one that matters most here.
{
	const t = EngCalcs.lpnTimesDefaults();
	t.duration = 30 * 3600;
	t.reportStep = 3600;
	t.startClock = 6 * 3600;
	const rows = stepRows(t);
	eq(rows[0].tip, 'Day 1, 06:00', 'the run starts at 6 in the morning of day 1');
	eq(rows[17].tip, 'Day 1, 23:00', '17 hours in is still the first day');
	eq(rows[18].tip, 'Day 2, 00:00', 'day 2 arrives after EIGHTEEN elapsed hours, not 24');
	eq(rows[18].label, '18:00', 'while the LABEL is still elapsed time and knows nothing of days');
}

// A single-instant network (no [TIMES] block at all) must still render one option.
{
	const t = EngCalcs.lpnTimesDefaults();
	const rows = stepRows(t);
	eq(rows.length, 1, 'a network with no duration has exactly one step');
	eq(rows[0].label, '0:00', 'and it is a bare instant, exactly like every other row');
}

console.log(failures ? ('\n' + failures + ' FAILURE(S)') : '\nall ok');
process.exit(failures ? 1 : 0);

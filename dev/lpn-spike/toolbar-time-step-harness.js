// The toolbar's time-step selector: each option must read as a RUN-TIME range, never wrapping
// back to a wall clock past 24 hours. Run with:
//   node dev/lpn-spike/toolbar-time-step-harness.js
//
// Tom, 2026-09-21, on a run past a day: "Starting at 24:00, the step end time is normalized back
// to clock time instead of staying at run time. So we get 24:00 - 0:00. Fix it to say
// 24:00 - 25:00, and fix all subsequent steps." EC.lpnTimeClockText() wraps at 24:00 on purpose --
// that is what a CLOCKTIME control fires on -- but the transport's step selector was pairing an
// elapsed start with a WRAPPED clock reading of that same instant, so the option at hour 24 of a
// longer run read "24:00  ·  00:00" instead of describing the step that runs from 24:00 to 25:00.
//
// This drives EC.lpnTimeMountToolbar() itself through the real DOM stub, rather than re-deriving
// the label text by hand -- a harness that reimplements the fix would pass even if the mount
// function still called the wrong formatter.

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

function stepLabels(times) {
	const doc = { times: times };
	const host = { doc: function () { return doc; }, status: function () {} };
	EngCalcs.lpnTimeInit(host);
	const container = global.document.createElement('div');
	EngCalcs.lpnTimeMountToolbar(container, function (el, icon, name, tip) {
		el.setAttribute('aria-label', name);
		if (tip) { el.title = tip; }
	});
	const sel = container.children.filter(function (c) { return c.id === 'lpn_time_step'; })[0];
	return sel.children.map(function (o) { return o.textContent; });
}

// A run past 24 hours: EPANET's own hourly grid, three hours past midnight.
{
	const t = Object.assign(EngCalcs.lpnTimesDefaults(), { duration: 27 * 3600, reportStep: 3600 });
	const labels = stepLabels(t);
	eq(labels[23], '23:00 - 24:00', 'the step ending the first day stays in run time');
	eq(labels[24], '24:00 - 25:00', 'crossing midnight does not fall back to the wall clock');
	eq(labels[25], '25:00 - 26:00', 'and every step after it keeps climbing');
	eq(labels[26], '26:00 - 27:00', 'three days would read the same way -- nothing wraps');
	eq(labels[27], '27:00', 'the final report time has no following step, so it is a bare instant');
	eq(labels[0], '0:00 - 1:00', 'an ordinary early step is a run-time range too, not a special case');
}

// A single-instant network (no [TIMES] block at all) must still render one option.
{
	const t = EngCalcs.lpnTimesDefaults();
	const labels = stepLabels(t);
	eq(labels.length, 1, 'a network with no duration has exactly one step');
	eq(labels[0], '0:00', 'and it is a bare instant, not a zero-length range');
}

console.log(failures ? ('\n' + failures + ' FAILURE(S)') : '\nall ok');
process.exit(failures ? 1 : 0);

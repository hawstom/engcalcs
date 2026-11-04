// THE TIME-SERIES Y AXIS FITS ITS DATA AT ANY MAGNITUDE. Run with:
//   node dev/lpn-spike/series-axis-harness.js
// Tom, 2026-11-03: "The Cl time series graph y axis ranges from -1 to 1 even when the series range
// is only from 0 to 0.1." Cause: axisBounds() defaulted its minimum span to 1.
const path = require('path');
const E = require(path.join(__dirname, '..', '..', 'js', 'lpn-profile.js'));
const P = (E && E.lpnProfile) || (global.EngCalcs && global.EngCalcs.lpnProfile);
let failures = 0;
function ok(c, m) { if (!c) { failures++; console.log('FAIL ' + m); } else { console.log('ok   ' + m); } }
function near(a, b) { return Math.abs(a - b) < 1e-9; }
function bounds(vals) {
	if (!P.seriesBounds) { return { min: -1, max: 1, step: 1, missing: true }; }
	return P.seriesBounds(vals, { ticks: 5, maxTicks: 8 });
}
function ticks(B) { return P.ticks(B); }
function check(name, vals, lo, hi, maxRatio) {
	const B = bounds(vals), t = ticks(B);
	ok(B.min <= lo + 1e-12 && B.max >= hi - 1e-12, name + ' contains the data (' + B.min + ' to ' + B.max + ')');
	ok((B.max - B.min) <= maxRatio * (hi - lo), name + ' fits the data (span ' + (B.max - B.min) + ')');
	ok(t.length >= 3 && t.length <= 9, name + ' has ' + t.length + ' ticks');
	return B;
}
let B = check('0 to 0.1', [0, 0.05, 0.1], 0, 0.1, 1.5);
ok(near(B.min, 0) && near(B.max, 0.1) && near(B.step, 0.02), '0 to 0.1 reads 0 to 0.1 in steps of 0.02');
check('tiny 0.001 to 0.004', [0.001, 0.0025, 0.004], 0.001, 0.004, 1.5);
B = check('normal 20 to 80', [20, 50, 80], 20, 80, 1.5);
ok(near(B.min, 20) && near(B.max, 80), 'normal 20 to 80 is unchanged');
check('negative -3 to 2', [-3, 0, 2], -3, 2, 1.5);
B = bounds([50, 50, 50]);
ok(B.min < 50 && B.max > 50 && (B.max - B.min) <= 2.5, 'flat 50 gets a small centred window');
B = bounds([0, 0, 0]);
ok(B.min < 0 && B.max > 0 && ticks(B).length >= 3, 'flat zero gets a window around zero');
console.log(failures ? failures + ' FAILED' : 'all passed');
process.exit(failures ? 1 : 0);

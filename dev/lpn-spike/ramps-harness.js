// Harness for js/lpn-ramps.js -- the colour catalogue, the five range allocation modes and the
// swatch geometry (ROADMAP Tasks 427, 429). Run with:
//   node dev/lpn-spike/ramps-harness.js
//
// WHY THIS EXISTS. Every claim this module makes is invisible to the eye that is checking it. A
// swatch bar looks equally plausible whether its boxes are uniform or drifting by a pixel each;
// a map looks equally colourful whether the breaks came from the mode the user picked or from a
// silent fallback; a hex is either a colour or it is nothing, and a browser draws a typo as black
// without complaining. The four defect classes below are all shipped-and-looked-fine failures:
//
//   * a MISTYPED HEX -- one character wrong and an element is drawn black, which reads as "no
//     value" rather than "bug". Nothing was typed here by hand, so this checks the generator too.
//   * a MISSING CLASS COUNT -- a ramp with no 6-class set makes the picker hand the map six
//     colours of which one is undefined, and undefined stringifies into the SVG as a valid-looking
//     nothing.
//   * NON-INCREASING BREAKS -- classIndex() walks the list in order, so a break out of order
//     silently makes a whole class unreachable. Quantile on this page's own data produces ties
//     constantly (dead-end pipes at 0 gpm), which is the realistic way this happens.
//   * DEGENERATE INPUT -- no solve yet, one element, or every value equal. The panel opens before
//     the first solve, so "no values" is a NORMAL state, not an error state, and NaN reaching a
//     legend is the failure.
//
// The distributions below have KNOWN answers computed by hand in the assertion, not values this
// file read out of the implementation.

const R = require('../../js/lpn-ramps.js').lpnRamps;

let failures = 0, checks = 0;
function ok(cond, what) {
	checks++;
	if (!cond) { failures++; console.error('FAIL: ' + what); }
}
function near(a, b, tol, what) {
	ok(Math.abs(a - b) <= tol, what + ' (got ' + a + ', expected ' + b + ')');
}

// ============================================================================================
// THE CATALOGUE
// ============================================================================================

const HEX = /^#[0-9a-f]{6}$/;
const keys = R.rampKeys();
ok(keys.length >= 40, 'catalogue holds dozens of ramps, not a handful (got ' + keys.length + ')');

const byFamily = {};
R.FAMILIES.forEach(function (f) { byFamily[f] = R.rampKeys(f).length; });
ok(byFamily.sequential > 0 && byFamily.diverging > 0 && byFamily.qualitative > 0,
	'all three of Brewer\'s families are represented: ' + JSON.stringify(byFamily));
ok(R.FAMILIES.reduce(function (s, f) { return s + byFamily[f]; }, 0) === keys.length,
	'every ramp belongs to a declared family -- no ramp is unreachable from the picker');

keys.forEach(function (k) {
	const r = R.RAMPS[k];
	ok(typeof r.name === 'string' && r.name.length > 0, k + ' has a name');
	for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
		const cols = r.colors[n];
		ok(Array.isArray(cols) && cols.length === n, k + ' has exactly ' + n + ' colours at ' + n + ' classes');
		if (!Array.isArray(cols)) { continue; }
		cols.forEach(function (c, i) {
			ok(typeof c === 'string' && HEX.test(c), k + '[' + n + '][' + i + '] is a valid hex: ' + c);
		});
		// A ramp with a repeated colour has a class the eye cannot distinguish from its neighbour.
		ok(new Set(cols).size === cols.length, k + ' at ' + n + ' classes has no repeated colour');
	}
});

// The heritage ramps must survive this rewrite BYTE-FOR-BYTE at their shipped class count, or every
// existing saved project silently changes colour.
ok(R.rampColors('epanet', 5).join() === '#0000ff,#00ffff,#00ff00,#ffff00,#ff0000',
	"EPANET's own five map colours are unchanged at 5 classes");
ok(R.rampColors('gray', 5).join() === '#dddddd,#aaaaaa,#777777,#444444,#000000',
	'gray is unchanged at 5 classes');
ok(R.rampColors('ylgnbu', 5).join() === '#ffffcc,#a1dab4,#41b6c4,#2c7fb8,#253494',
	'YlGnBu is unchanged at 5 classes');
ok(R.rampColors('rdylbu', 5).join() === '#d7191c,#fdae61,#ffffbf,#abd9e9,#2c7bb6',
	'RdYlBu is unchanged at 5 classes');

// Spot-check against colorbrewer2.org's published table, so a corrupted regeneration is caught.
ok(R.rampColors('blues', 3).join() === '#deebf7,#9ecae1,#3182bd', 'Blues 3-class matches Brewer');
ok(R.rampColors('set1', 3).join() === '#e41a1c,#377eb8,#4daf4a', 'Set1 3-class matches Brewer');
ok(R.RAMPS.viridis.colors[7][0] === '#440154', 'viridis starts at its published dark purple');
ok(R.RAMPS.viridis.colors[7][6] === '#fde725', 'viridis ends at its published yellow');

// A Brewer ramp is never interpolated; a continuous one always is. That flag is the whole record of
// which values are the designer's and which are ours.
keys.forEach(function (k) {
	const r = R.RAMPS[k];
	if (r.source === 'brewer') { ok(r.interpolated === false, k + ' (Brewer) is not interpolated'); }
	else { ok(r.interpolated === true, k + ' (' + r.source + ') is marked interpolated'); }
});

// Reversal, clamping, and the deliberate fallback.
ok(R.rampColors('blues', 5, { reverse: true }).join() === R.rampColors('blues', 5).slice().reverse().join(),
	'reverse returns the ramp backwards');
ok(R.rampColors('blues', 5)[0] === '#eff3ff', 'reverse did not mutate the catalogue');
ok(R.rampColors('no-such-ramp', 5).join() === R.rampColors('epanet', 5).join(),
	'an unknown ramp key falls back to epanet rather than throwing -- an old project must still open');
ok(R.rampColors('blues', 99).length === R.MAX_CLASSES, 'a class count above the range is clamped');
ok(R.rampColors('blues', 1).length === R.MIN_CLASSES, 'a class count below the range is clamped');

// ============================================================================================
// ATTRIBUTION -- the licence obligation, checked as code because prose does not fail a build
// ============================================================================================

const brewerCredit = R.CREDITS.filter(function (c) { return c.source === 'brewer'; })[0];
ok(!!brewerCredit, 'the Brewer credit exists');
ok(brewerCredit.text === 'This product includes color specifications and designs developed by ' +
	'Cynthia Brewer (http://colorbrewer.org/).',
	'the Brewer acknowledgement is VERBATIM as clause 2 of the Apache-2.0 licence requires');
// Clause 5: nothing user-facing may be NAMED ColorBrewer. Ramp names, family names and mode names
// are the strings a control can show.
const facing = keys.map(function (k) { return R.RAMPS[k].name; })
	.concat(R.FAMILIES, R.MODES.map(function (m) { return m.name; }));
ok(facing.every(function (s) { return !/colorbrewer/i.test(s); }),
	'no ramp, family or mode is NAMED ColorBrewer (licence clauses 4 and 5)');
// Every source that ships colours must be credited.
const sources = new Set(keys.map(function (k) { return R.RAMPS[k].source; }));
sources.forEach(function (s) {
	if (s === 'engcalcs') { return; }   // ours; nothing to credit
	ok(R.CREDITS.some(function (c) { return c.source === s; }), 'source "' + s + '" is credited');
});

// ============================================================================================
// THE FIVE MODES, on distributions with answers worked out by hand
// ============================================================================================

ok(R.MODES.length === 5, 'exactly five allocation modes');
ok(R.MODES.map(function (m) { return m.key; }).join() === 'equal,quantile,jenks,stddev,pretty',
	'the five modes are the five GIS names, in a stable order');

// --- equal interval: 0..100, 5 classes -> 20/40/60/80, arithmetic anybody can check.
const v0to100 = [];
for (let i = 0; i <= 100; i++) { v0to100.push(i); }
const eq = R.equalIntervalBreaks(v0to100, 5);
ok(eq.length === 4, 'equal interval: 5 classes give 4 breaks');
[20, 40, 60, 80].forEach(function (want, i) {
	near(eq[i], want, 1e-9, 'equal interval break ' + i + ' on 0..100 at 5 classes');
});

// --- quantile: 100 values 1..100, 4 classes -> the 25th/50th/75th percentiles.
const v1to100 = [];
for (let i = 1; i <= 100; i++) { v1to100.push(i); }
const qt = R.quantileBreaks(v1to100, 4);
ok(qt.length === 3, 'quantile: 4 classes give 3 breaks');
near(qt[1], 50.5, 1e-9, 'quantile median of 1..100');
// The defining property: each class holds a quarter of the population.
[0, 1, 2, 3].forEach(function (cls) {
	const n = v1to100.filter(function (v) { return R.classIndex(v, qt) === cls; }).length;
	ok(Math.abs(n - 25) <= 1, 'quantile class ' + cls + ' holds about a quarter (got ' + n + ')');
});

// --- quantile's named failure mode: 90 pipes at 0 gpm. The breaks must still be usable.
const ties = new Array(90).fill(0).concat([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
const qTies = R.quantileBreaks(ties, 5);
ok(qTies.length === 4, 'quantile on a tie-heavy network still returns 4 breaks');
ok(qTies.every(isFinite), 'quantile on a tie-heavy network returns no NaN or Infinity');
ok(strictlyIncreasing(qTies), 'quantile on a tie-heavy network is still strictly increasing');
// And it is honestly degenerate: the low breaks cluster on 0 rather than pretending to a spread.
ok(qTies[0] < 1e-6 && qTies[1] < 1e-6,
	'quantile on 90 zeros stacks its low breaks at 0 -- the degeneracy is shown, not hidden');

// --- Jenks: a distribution with two obvious clusters and one obvious gap.
const clustered = [1, 2, 3, 4, 5, 100, 101, 102, 103, 104];
const jk = R.jenksBreaks(clustered, 3);
ok(jk.length === 2, 'Jenks: 3 classes give 2 breaks');
ok(jk[jk.length - 1] > 5 && jk[jk.length - 1] <= 100,
	'Jenks puts a boundary in the empty gap between the two clusters (got ' + jk[1] + ')');
ok(clustered.filter(function (v) { return v <= 5; })
	.every(function (v) { return R.classIndex(v, jk) < R.classIndex(100, jk); }),
	'Jenks keeps the low cluster below the high cluster');
// Jenks must not be sensitive to input order -- it sorts internally.
const shuffled = clustered.slice().reverse();
ok(R.jenksBreaks(shuffled, 3).join() === jk.join(), 'Jenks does not depend on input order');
// The cost guard: a large population runs, quickly, on a deterministic sample.
const big = [];
for (let i = 0; i < 40000; i++) { big.push((i * 2654435761) % 100000); }
const t0 = Date.now();
const jkBig = R.jenksBreaks(big, 7);
const dt = Date.now() - t0;
ok(jkBig.length === 6 && jkBig.every(isFinite), 'Jenks on 40,000 values returns 6 finite breaks');
ok(dt < 10000, 'Jenks on 40,000 values completes in under 10 s via the sample cap (took ' + dt + ' ms)');
ok(R.jenksBreaks(big, 7).join() === jkBig.join(),
	'the Jenks sample is deterministic -- the same network gives the same legend twice');

// --- standard deviation: mean 0, sd 1 by construction, symmetric about the mean.
const norm = [];
for (let i = -50; i <= 50; i++) { norm.push(i); }
const sdB = R.stdDevBreaks(norm, 4);
ok(sdB.length === 3, 'standard deviation: 4 classes give 3 breaks');
near(sdB[1], 0, 1e-9, 'with an even class count the MEAN is the middle break');
near(sdB[2] - sdB[1], sdB[1] - sdB[0], 1e-9, 'standard-deviation classes are one sd wide, symmetric');
const sd5 = R.stdDevBreaks(norm, 5);
near((sd5[0] + sd5[3]) / 2, 0, 1e-9, 'with an odd class count the mean sits inside the middle class');

// --- pretty: 0..97 at 5 classes should land on round numbers, not 19.4/38.8/58.2/77.6.
const pr = R.prettyBreaks(v0to100.slice(0, 98), 5);
ok(pr.length === 4, 'pretty: 5 classes give 4 breaks');
ok(pr.every(function (v) { return Math.abs(v * 2 - Math.round(v * 2)) < 1e-9; }),
	'pretty breaks land on round numbers: ' + pr.join(', '));
ok(strictlyIncreasing(pr), 'pretty breaks are strictly increasing');
// Its named fallback: on a range too narrow for any round step it still returns the exact count.
const narrow = [52.10, 52.11, 52.12, 52.13, 52.14];
const prNarrow = R.prettyBreaks(narrow, 5);
ok(prNarrow.length === 4 && prNarrow.every(isFinite) && strictlyIncreasing(prNarrow),
	'pretty on a very narrow range falls back to rounded equal interval, still 4 finite breaks');

// --- every mode, over every class count, always satisfies the contract.
const samples = {
	'ramp 0..100': v0to100,
	'tie-heavy': ties,
	'two clusters': clustered,
	'negative and positive': [-30, -10, -5, 0, 2, 8, 40],
	'tiny magnitudes': [1e-9, 2e-9, 3e-9, 9e-9]
};
R.MODES.forEach(function (m) {
	Object.keys(samples).forEach(function (label) {
		for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
			const b = R.breaksFor(m.key, samples[label], n);
			const what = m.key + ' on ' + label + ' at ' + n + ' classes';
			ok(b.length === n - 1, what + ': n-1 breaks');
			ok(b.every(isFinite), what + ': every break finite');
			ok(strictlyIncreasing(b), what + ': strictly increasing');
		}
	});
});

// An unknown mode key must draw a map, not throw -- a stored setting from another version.
ok(R.breaksFor('no-such-mode', v0to100, 5).join() === eq.join(),
	'an unknown mode falls back to equal interval');

// ============================================================================================
// DEGENERATE INPUT -- the states the panel is genuinely in before the first solve
// ============================================================================================

[['no values', []], ['one value', [42]], ['all equal', [7, 7, 7, 7, 7]], ['all zero', [0, 0, 0]],
	['nulls and blanks only', [null, undefined, '', NaN]]].forEach(function (pair) {
	R.MODES.forEach(function (m) {
		for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
			const b = R.breaksFor(m.key, pair[1], n);
			const what = m.key + ' on "' + pair[0] + '" at ' + n + ' classes';
			ok(b.length === n - 1, what + ': still n-1 breaks');
			ok(b.every(isFinite), what + ': no NaN reaches the legend');
			ok(strictlyIncreasing(b), what + ': still strictly increasing');
		}
	});
});

// A value that does not exist is NOT class 0. A pump has no velocity, and colouring it "low" is a
// lie the eye cannot detect.
ok(R.classIndex(undefined, eq) === null, 'undefined has no class');
ok(R.classIndex(null, eq) === null, 'null has no class');
ok(R.classIndex('', eq) === null, 'an empty string has no class');
ok(R.classIndex(NaN, eq) === null, 'NaN has no class');
ok(R.classIndex(-999, eq) === 0, 'a value below every break is in the lowest class');
ok(R.classIndex(999, eq) === eq.length, 'a value above every break is in the highest class');
ok(R.classIndex(20, eq) === 1, 'a value exactly ON a break belongs to the class above it');
ok(R.classIndex('35', eq) === 1, 'a numeric string is read as its number');
// Class index and colour array must agree, or the map indexes past the end.
for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
	const b = R.equalIntervalBreaks(v0to100, n);
	const cols = R.rampColors('viridis', n);
	ok(R.classIndex(1e9, b) === cols.length - 1,
		'at ' + n + ' classes the top class indexes the last colour, never past it');
}

// ============================================================================================
// HAND-EDITED BREAKS -- the boxes at the bottom of Tom's Ranges submenu
// ============================================================================================

ok(R.validateBreaks([10, 20, 30, 40], 5).ok, 'four good breaks validate for 5 classes');
ok(R.validateBreaks(['10', '20', '30', '40'], 5).breaks.join() === '10,20,30,40',
	'typed strings come back as numbers');
ok(R.validateBreaks([-5, 0, 2.5, 1e6], 5).ok, 'negatives, zero and large numbers are all fine');
ok(R.validateBreaks([10, 20, 30], 5).reason === 'count', 'too few breaks is reported as count');
ok(R.validateBreaks([10, 20, 30], 5).index === 4, 'the count error says how many were expected');
ok(R.validateBreaks([10, 20, 30, 40, 50], 5).reason === 'count', 'too many breaks is reported too');
ok(R.validateBreaks([10, 20, 20, 40], 5).reason === 'not-increasing', 'a repeated break is rejected');
ok(R.validateBreaks([10, 20, 20, 40], 5).index === 2, 'the error names WHICH box');
ok(R.validateBreaks([10, 30, 20, 40], 5).reason === 'not-increasing', 'an out-of-order break is rejected');
ok(R.validateBreaks([10, 20, '', 40], 5).reason === 'not-number', 'an empty box is reported');
ok(R.validateBreaks([10, 20, 'abc', 40], 5).reason === 'not-number', 'a non-number is reported');
ok(R.validateBreaks([10, 20, Infinity, 40], 5).reason === 'not-finite', 'Infinity is reported');
ok(R.validateBreaks(null, 5).reason === 'count', 'no breaks at all is reported, not thrown');
ok(R.validateBreaks([10, 20, 30, 40], 5).breaks !== null &&
	R.validateBreaks([10, 20, 20, 40], 5).breaks === null,
	'a rejected list yields no breaks -- nothing half-validated reaches the map');
// It must not silently repair. A user's number is the user's.
const round = R.validateBreaks([10.123456789, 20.5, 30.5, 40.5], 5);
ok(round.breaks[0] === 10.123456789, 'validation does not round what the user typed');

// Every mode's own output must pass validation -- the generate and the tweak paths agree.
R.MODES.forEach(function (m) {
	for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
		ok(R.validateBreaks(R.breaksFor(m.key, v0to100, n), n).ok,
			m.key + ' output at ' + n + ' classes passes validateBreaks');
	}
});

// ============================================================================================
// SWATCH GEOMETRY -- Tom, 2026-08-18: "the color boxes are not uniform widths"
// ============================================================================================

[3, 4, 5, 6, 7].forEach(function (n) {
	[100, 137, 240, 33.5].forEach(function (w) {
		const g = R.swatchBoxes(w, n);
		ok(g.boxes.length === n, 'swatch: ' + n + ' boxes across ' + w);
		// UNIFORM, exactly -- not "within a pixel". This is the complaint being fixed.
		const widths = new Set(g.boxes.map(function (b) { return b.width; }));
		ok(widths.size === 1, 'swatch: all ' + n + ' boxes are EXACTLY the same width at ' + w);
		near(g.total, w, 1e-9, 'swatch: the boxes sum to the width given (' + n + ' across ' + w + ')');
		ok(g.boxes[0].x === 0, 'swatch: the first box starts at 0');
		// x from the index, never accumulated -- accumulation is what makes the last box drift.
		g.boxes.forEach(function (b, i) {
			near(b.x, i * (w / n), 1e-12, 'swatch: box ' + i + ' sits on its own slot');
		});
		near(g.boxes[n - 1].x + g.boxes[n - 1].width, w, 1e-9, 'swatch: the last box ends at the width');
	});
});

const gapped = R.swatchBoxes(100, 5, { gap: 2, height: 20 });
near(gapped.total, 100, 1e-9, 'swatch with a gap still spans the width');
ok(new Set(gapped.boxes.map(function (b) { return b.width; })).size === 1,
	'swatch with a gap keeps every box the same width');
ok(gapped.boxes.every(function (b) { return b.height === 20; }), 'swatch height is honoured');
ok(gapped.boxes[1].x - (gapped.boxes[0].x + gapped.boxes[0].width) > 0, 'a gap actually appears between boxes');

// Degenerate geometry must not produce NaN in an SVG attribute.
[[0, 5], [-10, 5], [100, 0], [100, -3], [NaN, 5], [100, NaN]].forEach(function (p) {
	const g = R.swatchBoxes(p[0], p[1]);
	ok(g.boxes.length >= 1, 'swatch(' + p[0] + ', ' + p[1] + ') returns at least one box');
	ok(g.boxes.every(function (b) { return isFinite(b.x) && isFinite(b.width) && b.width >= 0; }),
		'swatch(' + p[0] + ', ' + p[1] + ') produces no NaN and no negative width');
});

// swatchBar is the picker's row: geometry and colour together, one per class.
const bar = R.swatchBar('rdylbu', 7, 210);
ok(bar.boxes.length === 7, 'swatchBar draws one box per class');
ok(bar.boxes.every(function (b) { return HEX.test(b.color); }), 'every swatchBar box carries a hex');
ok(bar.boxes.map(function (b) { return b.color; }).join() === R.rampColors('rdylbu', 7).join(),
	'swatchBar colours are the ramp in order');
ok(bar.name === 'RdYlBu', 'swatchBar carries the scheme name for a title attribute');
const revBar = R.swatchBar('rdylbu', 7, 210, { reverse: true });
ok(revBar.boxes[0].color === bar.boxes[6].color, 'swatchBar honours reverse');

// Every ramp must be drawable at every count -- this is the picker's whole list, rendered.
keys.forEach(function (k) {
	for (let n = R.MIN_CLASSES; n <= R.MAX_CLASSES; n++) {
		const b = R.swatchBar(k, n, 180);
		ok(b.boxes.length === n && b.boxes.every(function (x) { return HEX.test(x.color); }),
			'swatchBar(' + k + ', ' + n + ') is fully drawable');
	}
});

// ============================================================================================

function strictlyIncreasing(a) {
	for (let i = 1; i < a.length; i++) { if (!(a[i] > a[i - 1])) { return false; } }
	return true;
}

console.log('ramps-harness: ' + checks + ' checks, ' + failures + ' failures  [' +
	keys.length + ' ramps: ' + R.FAMILIES.map(function (f) { return f + ' ' + byFamily[f]; }).join(', ') + ']');
if (failures) { process.exit(1); }

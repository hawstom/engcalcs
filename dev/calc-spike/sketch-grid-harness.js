// Cross-section sketch scale for mi_ and wi_ (ROADMAP).
//
//   node dev/calc-spike/sketch-grid-harness.js
//
// Tom, 2026-10-06: the sketches should get "either an automatic stations and elevations grid or the
// stations and elevations about 4 to 8 points". A grid of 4 to 8 round marks per axis is both.
//
// Part 1 -- the tick routine, EngCalcs.niceTicks(): 4 to 8 marks, each a 1, 2, 2.5 or 5 times a
//   power of ten, all inside the range, for spans from a thousandth to a million, any offset.
// Part 2 -- each page's own sketch, rendered through the page's own calculator, carries those marks
//   as SVG text, the unit symbol rides on the largest mark, and the section line is drawn after
//   (on top of) the grid.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');
const r = makeReporter('Cross-section sketch scale (mi_, wi_)');

const wi = loadCalculator('Weir-Flow-Irregular.php');
const E = wi.EngCalcs;

function isNice(t, step) {
	const k = Math.round(t / step);
	return Math.abs(k * step - t) < step * 1e-9;
}
function stepIsNice(step) {
	const m = step / Math.pow(10, Math.floor(Math.log10(step) + 1e-9));
	return [1, 2, 2.5, 5].some(v => Math.abs(m - v) < 1e-9);
}

// ---------------------------------------------------------------------------------------
r.section('niceTicks: 4 to 8 round values');
const cases = [
	['0.3 m channel', 0, 0.3], ['7 ft section', 0, 7], ['123 ft section', 0, 123],
	['negative elevations', -12.5, -3.2], ['straddling zero', -4, 9],
	['very flat section', 100.00, 100.04], ['high elevation, small span', 1234.5, 1237.1],
	['one thousandth', 0, 0.001], ['a million', 0, 1e6], ['1 to 1.7', 1, 1.7]
];
for (const [name, lo, hi] of cases) {
	const t = E.niceTicks(lo, hi);
	r.report(t.ticks.length >= 4 && t.ticks.length <= 8, `${name}: 4 to 8 marks`, `got ${t.ticks.length}: ${t.ticks}`);
	r.report(t.ticks.every(v => v >= lo - 1e-12 && v <= hi + 1e-12), `${name}: every mark lies inside the range`, String(t.ticks));
	r.report(stepIsNice(t.step) && t.ticks.every(v => isNice(v, t.step)), `${name}: step ${t.step} is 1, 2, 2.5 or 5 x 10^n`, String(t.ticks));
}
// Sweep: every span and offset must land in 4 to 8.
let bad = 0, total = 0;
for (let e = -3; e <= 5; e += 1) {
	for (const m of [1, 1.3, 1.7, 2.2, 2.9, 3.6, 4.4, 5.5, 6.7, 8.1, 9.9]) {
		for (const off of [0, 0.37, -0.81, 7.77, 123.456, -5000]) {
			const span = m * Math.pow(10, e), lo = off * Math.pow(10, e), t = E.niceTicks(lo, lo + span);
			total += 1;
			if (t.ticks.length < 4 || t.ticks.length > 8) { bad += 1; if (bad < 5) { console.log('  sweep miss', lo, lo + span, t.ticks.length); } }
		}
	}
}
r.report(bad === 0, `sweep of ${total} spans and offsets: always 4 to 8 marks`, `${bad} misses`);
r.eq(E.niceTicks(5, 5).ticks.length, 0, 'an empty range gives no marks');
r.eq(E.niceTicks(NaN, 5).ticks.length, 0, 'a non-finite end gives no marks');
r.eq(E.tickLabel(0.30000000000000004, 0.1), '0.3', 'a mark label has no float noise');
r.eq(E.tickLabel(-0.0001, 0.5), '0.0', 'a mark label is never -0');
r.eq(E.tickLabel(25, 5), '25', 'whole steps give whole labels');
r.eq(E.tickLabel(2.5, 2.5), '2.5', 'a 2.5 step shows its decimal');
r.eq(E.tickLabel(0.75, 0.25), '0.75', 'a 0.25 step shows two decimals');
r.eq(E.tickLabel(1200000, 250000), '1200000', 'a large step never goes exponential');

// ---------------------------------------------------------------------------------------
r.section('wi_ page: the default example draws marks');
function texts(svg) { return [...svg.matchAll(/<text class="ec-sk-tick"[^>]*>([^<]*)<\/text>/g)].map(m => m[1]); }
wi.initRows();
wi.set({ hw: 3 });
wi.run();
let svg = wi.html('sketch');
let tt = texts(svg);
r.report(svg.indexOf('<svg') === 0, 'the sketch is an svg');
r.report(tt.length >= 8 && tt.length <= 16, 'default example: 4 to 8 marks on each axis', `${tt.length} labels: ${tt}`);
r.report(svg.indexOf('class="ec-sk-grid"') >= 0 && svg.indexOf('class="ec-sk-grid"') < svg.indexOf('<polyline'), 'the grid is drawn before the crest');
r.report(/height="200"/.test(svg), 'the sketch is still 200 high');
r.report(!/ft|m<\/text>/.test(tt.join(' ')), 'wi has no unit selects and so shows no unit symbol', tt.join(' '));
r.report(/viewBox/.test(svg) && /max-width:100%/.test(svg), 'the svg scales down on a narrow screen');

// ---------------------------------------------------------------------------------------
r.section('mi_ page: marks carry the displayed unit');
const X = [0, 30, 40, 60, 70, 100], Z = [6, 3, 1, 1, 3, 6], N = [null, 0.040, 0.035, 0.025, 0.030, 0.040];
function loadMi(preset) {
	const p = loadCalculator('Manning-Irregular.php');
	for (let i = 0; i < X.length; i += 1) { p.addRow(); }
	p.units(preset);
	p.set({ ws: preset === 'si' ? 1.5 : 5, s0: 0.0025 });
	for (let i = 0; i < X.length; i += 1) {
		const f = preset === 'si' ? 0.3048 : 1;
		const cells = { station: X[i] * f, elevation: Z[i] * f };
		if (N[i] !== null) { cells.n = N[i]; }
		p.setRow(i, cells);
	}
	p.run();
	return p;
}
for (const preset of ['us', 'si']) {
	const p = loadMi(preset);
	svg = p.html('sketch');
	tt = texts(svg);
	const unit = preset === 'us' ? 'ft' : 'm';
	r.report(tt.length >= 8 && tt.length <= 16, `${preset}: 4 to 8 marks on each axis`, `${tt.length} labels: ${tt}`);
	r.eq(tt.filter(s => s.endsWith(' ' + unit)).length, 2, `${preset}: the unit '${unit}' rides on exactly two labels, one per axis`);
	r.report(/height="100"/.test(svg), `${preset}: the sketch is still 100 high`);
	r.report(svg.indexOf('class="ec-sk-grid"') < svg.indexOf('<line x1'), `${preset}: the grid is drawn before the section line`);
	r.report(/viewBox/.test(svg) && /max-width:100%/.test(svg), `${preset}: the svg scales down on a narrow screen`);
}
const pus = loadMi('us');
r.report(texts(pus.html('sketch')).some(s => /^100( ft)?$/.test(s)), 'us: the right-hand station mark is 100 (the section is 0 to 100 ft)', texts(pus.html('sketch')).join(' '));

r.finish();

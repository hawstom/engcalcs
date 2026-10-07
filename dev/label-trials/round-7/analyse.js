// ROUND 7: THE ANALYSIS, deterministic, from the raw per-view lines (score-all.js). JUDGES' SIDE.
//
//   node dev/label-trials/round-7/analyse.js <raw dir> > dev/label-trials/round-7/results.md
//
// The hypotheses are round-7-plan.md §4.5's, tested exactly as stated there: paired on the same set
// (the set, summed over its views, is the unit), exact two-sided sign test, Holm over the four builders
// where stated, 95% bootstrap interval (10,000 seeded resamples). H3 (each strategy card's ablations
// replicate) is checked card by card, by re-running the builder's own switches on the secret E1 sets,
// and is written up by hand; this file prints its reminder.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const M = require('./matrix.js');

function rng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function mean(a) { a = a.filter(function (x) { return x !== null && x !== undefined && isFinite(x); }); return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }
function bootCI(d, seed) {
	if (d.length < 2) { return [null, null]; }
	const r = rng(seed), B = 10000, means = new Float64Array(B);
	for (let b = 0; b < B; b++) { let s = 0; for (let i = 0; i < d.length; i++) { s += d[Math.floor(r() * d.length)]; } means[b] = s / d.length; }
	means.sort();
	return [means[Math.floor(0.025 * B)], means[Math.floor(0.975 * B)]];
}
function lnChoose(n, k) { let s = 0; for (let i = 1; i <= k; i++) { s += Math.log(n - k + i) - Math.log(i); } return s; }
function signTest(d) {
	const pos = d.filter(function (x) { return x > 0; }).length, neg = d.filter(function (x) { return x < 0; }).length, n = pos + neg;
	if (!n) { return { pos: 0, neg: 0, p: 1 }; }
	const k = Math.min(pos, neg);
	let p = 0;
	for (let i = 0; i <= k; i++) { p += Math.exp(lnChoose(n, i) - n * Math.LN2); }
	return { pos: pos, neg: neg, p: Math.min(1, 2 * p) };
}
function holm(ps) {
	const idx = ps.map(function (p, i) { return [p, i]; }).sort(function (a, b) { return a[0] - b[0]; });
	const adj = new Array(ps.length);
	let run = 0;
	idx.forEach(function (x, r) { run = Math.max(run, Math.min(1, x[0] * (ps.length - r))); adj[x[1]] = run; });
	return adj;
}
function kendall(a, b) {
	let c = 0, d = 0;
	for (let i = 0; i < a.length; i++) { for (let j = i + 1; j < a.length; j++) { const s = Math.sign(a[i] - a[j]) * Math.sign(b[i] - b[j]); if (s > 0) { c++; } else if (s < 0) { d++; } } }
	return a.length > 1 ? (c - d) / (a.length * (a.length - 1) / 2) : null;
}
function f(v, d) { return v === null || v === undefined || !isFinite(v) ? '-' : (+v).toFixed(d === undefined ? 1 : d); }
function fp(p) { return p === null || p === undefined ? '-' : p < 0.001 ? '<0.001' : p.toFixed(3); }
function table(head, rows) {
	return '| ' + head.join(' | ') + ' |\n|' + head.map(function () { return '---'; }).join('|') + '|\n' + rows.map(function (r) { return '| ' + r.join(' | ') + ' |'; }).join('\n') + '\n';
}
function median(a) { if (!a.length) { return null; } const s = a.slice().sort(function (x, y) { return x - y; }); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }

// One (entrant, set) cell from its view lines: sums, and the per-set rates the hypotheses use.
function aggregate(views) {
	const s = function (k) { return views.reduce(function (t, v) { return t + (v[k] || 0); }, 0); };
	const pr = views.filter(function (v) { return v.probe; }).map(function (v) { return v.probe; });
	const c = {
		placer: views[0].placer, set: views[0].set, exp: views[0].exp, variant: views[0].variant, n: views.length,
		labelsReq: s('labelsReq'), labelsShown: s('labelsShown'), topReq: s('topReq'), topShown: s('topShown'), valuesReq: s('valuesReq'), valuesShown: s('valuesShown'),
		breaks: s('N1') + s('N3') + s('N4') + s('N5') + s('invalid'), labelOnLeader: s('labelOnLeader'), leaderOnLeader: s('leaderOnLeader'),
		costTom: s('costTom'), hidden: s('hidden'), pubRoom: s('pubRoom'), heldRoom: s('heldRoom'), realBrought: s('realBrought'), realRequested: s('realRequested'),
		r14asked: s('r14asked'), r14along: s('r14along'), churn: s('churn'), compared: s('compared'),
		ms: views.map(function (v) { return v.ms; }), over1s: views.filter(function (v) { return v.ms > 1000; }).length,
		farHidden: pr.reduce(function (t, p) { return t + p.farHidden; }, 0), revived: pr.reduce(function (t, p) { return t + p.revived; }, 0),
		controlFlips: pr.reduce(function (t, p) { return t + p.controlFlips; }, 0)
	};
	c.labelsPct = c.labelsReq ? 100 * c.labelsShown / c.labelsReq : null;
	c.topPct = c.topReq ? 100 * c.topShown / c.topReq : null;
	c.valuesPct = c.valuesReq ? 100 * c.valuesShown / c.valuesReq : null;
	c.realPer100 = c.realRequested ? 100 * c.realBrought / c.realRequested : null;
	c.lolPer100 = c.labelsShown ? 100 * c.labelOnLeader / c.labelsShown : null;
	return c;
}

function load(dir) {
	const by = {}, failed = [];
	fs.readdirSync(dir).filter(function (x) { return /\.jsonl$/.test(x); }).forEach(function (file) {
		fs.readFileSync(path.join(dir, file), 'utf8').split('\n').filter(Boolean).forEach(function (l) {
			const o = JSON.parse(l);
			if (o.status) { failed.push(o); return; }
			const k = o.placer + '|' + o.set;
			(by[k] = by[k] || []).push(o);
		});
	});
	return { cells: Object.keys(by).sort().map(function (k) { return aggregate(by[k]); }), failed: failed };
}

function pooled(cells) {
	const s = function (k) { return cells.reduce(function (t, c) { return t + (c[k] || 0); }, 0); };
	const ms = [].concat.apply([], cells.map(function (c) { return c.ms; }));
	return {
		sets: cells.length, labels: 100 * s('labelsShown') / s('labelsReq'), top: 100 * s('topShown') / s('topReq'), values: 100 * s('valuesShown') / s('valuesReq'),
		pub: s('hidden') ? 100 * s('pubRoom') / s('hidden') : null, held: s('hidden') ? 100 * s('heldRoom') / s('hidden') : null,
		real: s('realRequested') ? 100 * s('realBrought') / s('realRequested') : null,
		lol: 100 * s('labelOnLeader') / s('labelsShown'), ldl: 100 * s('leaderOnLeader') / s('labelsShown'), tom: s('costTom') / s('labelsShown'),
		along: s('r14asked') ? 100 * s('r14along') / s('r14asked') : null, breaks: s('breaks'),
		msMed: median(ms), msMax: ms.length ? Math.max.apply(null, ms) : null, over1s: s('over1s'), views: ms.length,
		farHidden: s('farHidden'), revived: s('revived'), controlFlips: s('controlFlips')
	};
}
function paired(cells, a, b, key, exp) {
	const B = {};
	cells.filter(function (c) { return c.placer === b && c.exp === exp; }).forEach(function (c) { B[c.set] = c; });
	const d = [];
	cells.filter(function (c) { return c.placer === a && c.exp === exp; }).forEach(function (c) { if (B[c.set] && c[key] !== null && B[c.set][key] !== null) { d.push(c[key] - B[c.set][key]); } });
	return d;
}

function main() {
	const dir = process.argv[2] || path.join(__dirname, 'raw');
	const { cells, failed } = load(dir);
	const out = [];
	out.push('# Round 7 results (generated by analyse.js; do not edit by hand)\n');
	out.push(cells.length + ' (entrant, set) cells; ' + failed.length + ' cells failed or timed out' + (failed.length ? ': ' + failed.map(function (x) { return x.placer + ' ' + x.set + ' ' + x.status; }).join('; ') : '') + '.\n');
	['E0', 'E1', 'E2', 'E3'].forEach(function (exp) {
		const rows = [];
		Object.keys(M.PLACERS).forEach(function (p) {
			const cs = cells.filter(function (c) { return c.placer === p && c.exp === exp; });
			if (!cs.length) { return; }
			const P = pooled(cs);
			rows.push([p, P.sets, f(P.labels), f(P.top), f(P.values), f(P.pub), f(P.held), f(P.real, 2), f(P.lol, 2), f(P.ldl, 2), f(P.tom, 3), f(P.along, 0), P.breaks,
				f(P.msMed, 0) + ' / ' + f(P.msMax, 0), P.over1s + '/' + P.views]);
		});
		if (!rows.length) { return; }
		out.push('\n## ' + exp + ', pooled\n');
		out.push(table(['entrant', 'sets', 'labels %', 'most-wanted value %', 'values %', 'hidden with room, public %', 'hidden with room, held-back %', 'realizable per 100 requested',
			'label on leader /100', 'leader on leader /100', 'Tom cost /label', 'along %', 'breaks', 'ms median / max', 'views > 1 s'], rows));
	});

	out.push('\n## Hypotheses\n');
	// H1: realizable room falls against the builder's round-6 self on E1 (Holm), labels shown not down by more than one point.
	const h1 = ['A', 'B', 'C', 'D'].map(function (x) {
		const d = paired(cells, x + '7', x + '6', 'realPer100', 'E1'), dl = paired(cells, x + '7', x + '6', 'labelsPct', 'E1'), st = signTest(d);
		return { x: x, n: d.length, mean: mean(d), ci: bootCI(d, 71), neg: st.neg, pos: st.pos, p: st.p, dl: mean(dl) };
	});
	const h1adj = holm(h1.map(function (r) { return r.p; }));
	out.push('**H1 (the self-test helps).** Realizable room per 100 requested, round 7 minus round 6, paired on E1 sets:\n\n');
	out.push(table(['builder', 'sets', 'mean change', '95% CI', 'fell / rose', 'Holm p', 'labels shown change (points)'], h1.map(function (r, i) {
		return [r.x, r.n, f(r.mean, 2), '[' + f(r.ci[0], 2) + ', ' + f(r.ci[1], 2) + ']', r.neg + ' / ' + r.pos, fp(h1adj[i]), f(r.dl, 2)];
	})));
	const h1ok = h1.length && h1.every(function (r, i) { return r.n && r.mean < 0 && h1adj[i] < 0.05 && r.dl !== null && r.dl >= -1; });
	out.push('\nH1 ' + (h1ok ? 'SUPPORTED' : 'NOT supported') + '.\n');
	// H2: at least one builder shows more labels than R on E1 at no more label on leader per 100 shown.
	const R = pooled(cells.filter(function (c) { return c.placer === 'R' && c.exp === 'E1'; }));
	const h2 = M.BUILDERS7.map(function (p) {
		const d = paired(cells, p, 'R', 'labelsPct', 'E1'), st = signTest(d), P = pooled(cells.filter(function (c) { return c.placer === p && c.exp === 'E1'; }));
		return { p: p, n: d.length, mean: mean(d), pv: st.p, lol: P.lol, ok: d.length && mean(d) > 0 && st.p < 0.05 && P.lol <= R.lol };
	});
	out.push('\n**H2 (beyond the plain recipe).** Labels shown % minus R\'s, paired on E1; R shows ' + f(R.labels) + '% at ' + f(R.lol, 2) + ' label on leader per 100:\n\n');
	out.push(table(['builder', 'sets', 'mean points over R', 'sign p', 'label on leader /100', 'beats R'], h2.map(function (r) { return [r.p, r.n, f(r.mean, 2), fp(r.pv), f(r.lol, 2), r.ok ? 'yes' : 'no']; })));
	out.push('\nH2 ' + (h2.some(function (r) { return r.ok; }) ? 'SUPPORTED' : 'NOT supported') + '.\n');
	// Read beside H2 (not pre-registered): R's inner placer is round 6's C, which keeps the ID against the
	// drop order, so "labels shown" flatters it. Labels showing their most-wanted value do not.
	const h2b = M.BUILDERS7.map(function (p) { const d = paired(cells, p, 'R', 'topPct', 'E1'), st = signTest(d); return [p, d.length, f(mean(d), 2), fp(st.p)]; });
	out.push('\nBeside H2, not pre-registered: most-wanted value % minus R\'s, paired on E1 (R shows ' + f(R.top) + '%):\n\n' + table(['builder', 'sets', 'mean points over R', 'sign p'], h2b));
	out.push('\n**H3 (the strategies are real)** is checked card by card (each builder\'s STRATEGY.md ablations, re-run on the secret E1 sets) and written up by hand in the round record.\n');
	// H4: no builder over one second on any E1 or E2 view.
	const h4 = M.BUILDERS7.map(function (p) { const P = pooled(cells.filter(function (c) { return c.placer === p && (c.exp === 'E1' || c.exp === 'E2'); })); return [p, P.over1s + '/' + P.views, f(P.msMax, 0)]; });
	out.push('\n**H4 (R10).** Views over one second, E1 and E2:\n\n' + table(['builder', 'views over 1 s', 'worst ms'], h4));
	out.push('\nH4 ' + (h4.every(function (r) { return /^0\//.test(r[1]); }) ? 'SUPPORTED' : 'NOT supported') + '.\n');
	// H5: public and held-back room scores rank the eight placers the same way on E1.
	const eight = M.BUILDERS7.concat(M.BUILDERS6), pubs = [], helds = [];
	eight.forEach(function (p) { const P = pooled(cells.filter(function (c) { return c.placer === p && c.exp === 'E1'; })); pubs.push(P.pub); helds.push(P.held); });
	const tau = kendall(pubs, helds);
	out.push('\n**H5 (the tool, not the space).** Kendall tau between the public and held-back hidden-with-room shares of ' + eight.join(', ') + ' on E1: ' + f(tau, 2)
		+ '. H5 ' + (tau !== null && tau >= 0.6 ? 'SUPPORTED' : 'NOT supported (the builders may have learned the tool\'s blind spots)') + '.\n');
	// H6: each builder revives at most 5% of far hidden labels beyond its control flips.
	const h6 = M.BUILDERS7.map(function (p) {
		const P = pooled(cells.filter(function (c) { return c.placer === p && (c.exp === 'E1' || c.exp === 'E2'); }));
		const share = P.farHidden ? (P.revived - P.controlFlips) / P.farHidden : 0;
		return [p, P.revived + ' of ' + P.farHidden, P.controlFlips, f(100 * share, 2) + '%', share <= 0.05 ? 'yes' : 'no'];
	});
	out.push('\n**H6 (never by count).**\n\n' + table(['builder', 'far hidden labels revived', 'control flips', 'beyond control', 'at most 5%'], h6));
	out.push('\nH6 ' + (h6.every(function (r) { return r[4] === 'yes'; }) ? 'SUPPORTED' : 'NOT supported') + '.\n');
	process.stdout.write(out.join(''));
}

main();

// ROUND 5: THE PRE-REGISTERED ANALYSIS (round record §1.7), from raw/*.jsonl to sets.csv and
// results.md in this folder. Deterministic: the bootstrap is seeded.
//
//   node dev/label-trials/round-5-2026-09-29/analyse.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'raw');
const PLACERS = ['master', 'A', 'B', 'C', 'D'];
const OUTCOMES = [
	// [key, label, better: +1 higher is better, -1 lower is better]
	['breaks', 'breaks (N1+N3+N4+N5+invalid)', -1],
	['labelsPct', 'labels shown %', 1],
	['valuesPct', 'values shown %', 1],
	['gMiss', 'G missed room % of requested', -1],
	['lolPer100', 'leader-on-leader per 100 shown', -1],
	['tomPerLabel', 'Tom-weighted cost per shown label', -1],
	['msMed', 'time per layout, median ms', -1],
	['msMax', 'time per layout, max ms', -1],
	['churnRate', 'churn % of compared', -1],
	['lossRate', 'R11 rows lost on zoom-in %', -1],
	['r14close', 'R14 level with room at 4x %', -1],
	['ldrP90', 'leader p90 (label heights)', -1]
];

// ---- meta from a set id ------------------------------------------------------------------------
function meta(set) {
	let m = /^gen-(\w+)-n(\d+)-s(\d+)-(\w+)-(\w+)-j[\d.]+-seed(\d+)$/.exec(set);
	if (m) { return { kind: 'gen', family: m[1], n: +m[2], sp: +m[3], ids: m[4], fields: m[5], seed: +m[6], net: m[1] + '-n' + m[2] + '-seed' + m[6] }; }
	m = /^bench-([\w-]+?)-s(\d+)-(\w+)-seed(\d+)$/.exec(set);
	if (m) { return { kind: 'bench', family: m[1], n: null, sp: +m[2], ids: 'file', fields: m[3], seed: +m[4], net: m[1] + '-seed' + m[4] }; }
	return { kind: 'public', family: set, n: null, sp: null, ids: 'file', fields: 'file', seed: 0, net: set };
}

// ---- load and aggregate per (placer, set) ------------------------------------------------------
function load() {
	const cells = {};
	PLACERS.forEach(function (p) {
		const f = path.join(RAW, p + '.jsonl');
		if (!fs.existsSync(f)) { return; }
		fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(function (l) {
			const o = JSON.parse(l), k = p + '|' + o.set;
			const c = cells[k] = cells[k] || { placer: p, set: o.set, exp: o.exp, views: [], status: 'ok' };
			if (o.status) { c.status = o.status; c.error = o.error; return; }
			c.views.push(o);
		});
	});
	return Object.keys(cells).map(function (k) { return cells[k]; });
}
function median(a) { if (!a.length) { return null; } const s = a.slice().sort(function (x, y) { return x - y; }); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function sum(a, f) { return a.reduce(function (t, x) { return t + (f(x) || 0); }, 0); }

function aggregate(c) {
	const v = c.views.slice().sort(function (a, b) { return a.step - b.step; });
	const out = Object.assign({ placer: c.placer, set: c.set, exp: c.exp, status: c.status }, meta(c.set));
	if (c.status !== 'ok' || !v.length) { return out; }
	const lr = sum(v, function (x) { return x.labelsReq; }), ls = sum(v, function (x) { return x.labelsShown; });
	const vr = sum(v, function (x) { return x.valuesReq; }), vs = sum(v, function (x) { return x.valuesShown; });
	out.views = v.length;
	out.labelsReq = lr; out.labelsShown = ls;
	out.breaks = sum(v, function (x) { return x.N1 + x.N3 + x.N4 + x.N5 + x.invalid; });
	out.N1 = sum(v, function (x) { return x.N1; }); out.N3 = sum(v, function (x) { return x.N3; });
	out.N4 = sum(v, function (x) { return x.N4; }); out.N5 = sum(v, function (x) { return x.N5; }); out.invalid = sum(v, function (x) { return x.invalid; });
	out.breakSample = [].concat.apply([], v.map(function (x) { return (x.breakSample || []).map(function (s) { return x.view + ' ' + s; }); })).slice(0, 3).join(' ; ');
	out.labelsPct = lr ? 100 * ls / lr : null;
	out.valuesPct = vr ? 100 * vs / vr : null;
	out.gMiss = lr ? 100 * (sum(v, function (x) { return x.hiddenWithRoom; }) + sum(v, function (x) { return x.cutWithRoom; })) / lr : null;
	out.hiddenWithRoom = sum(v, function (x) { return x.hiddenWithRoom; }); out.cutWithRoom = sum(v, function (x) { return x.cutWithRoom; });
	out.hidden = sum(v, function (x) { return x.hidden; }); out.cut = sum(v, function (x) { return x.cut; });
	out.lolPer100 = ls ? 100 * sum(v, function (x) { return x.leaderOnLeader; }) / ls : null;
	out.tomPerLabel = ls ? sum(v, function (x) { return x.costTom; }) / ls : null;
	out.msMed = median(v.map(function (x) { return x.ms; }));
	out.msMax = Math.max.apply(null, v.map(function (x) { return x.ms; }));
	out.msFirst = v[0].ms;
	out.idleMs = v[0].idleMs;
	const cmp = sum(v, function (x) { return x.compared; });
	out.churnRate = cmp ? 100 * sum(v, function (x) { return x.churn; }) / cmp : null;
	let lost = 0, prevRows = 0, regained = 0;
	for (let i = 1; i < v.length; i++) { if (v[i].lost !== null && v[i].lost !== undefined) { lost += v[i].lost; regained += v[i].regained; prevRows += v[i - 1].rowsShown; } }
	out.lossRate = prevRows ? 100 * lost / prevRows : null;
	out.rowsLost = lost; out.rowsRegained = regained;
	const close = v.filter(function (x) { return (x.mult || 0) >= 4; });
	const lvl = sum(close, function (x) { return x.r14asked - x.r14along; });
	out.r14close = lvl ? 100 * sum(close, function (x) { return x.r14missed; }) / lvl : (close.length ? 0 : null);
	out.ldrP90 = median(v.map(function (x) { return x.leaderP90; }).filter(function (x) { return x !== null; }));
	out.r7on = sum(v, function (x) { return x.r7onOwn; }); out.r7checked = sum(v, function (x) { return x.r7checked; });
	out.maxLabelsReq = Math.max.apply(null, v.map(function (x) { return x.labelsReq; }));
	return out;
}

// ---- statistics --------------------------------------------------------------------------------
function rng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
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
	return (c - d) / (a.length * (a.length - 1) / 2);
}
function spearman(x, y) {
	function rank(a) { const s = a.map(function (v, i) { return [v, i]; }).sort(function (p, q) { return p[0] - q[0]; }); const r = new Array(a.length); for (let i = 0; i < s.length;) { let j = i; while (j + 1 < s.length && s[j + 1][0] === s[i][0]) { j++; } for (let k = i; k <= j; k++) { r[s[k][1]] = (i + j) / 2; } i = j + 1; } return r; }
	const rx = rank(x), ry = rank(y), n = x.length, mx = (n - 1) / 2;
	let num = 0, dx = 0, dy = 0;
	for (let i = 0; i < n; i++) { num += (rx[i] - mx) * (ry[i] - mx); dx += (rx[i] - mx) * (rx[i] - mx); dy += (ry[i] - mx) * (ry[i] - mx); }
	return num / Math.sqrt(dx * dy);
}

// ---- formatting --------------------------------------------------------------------------------
function f(v, d) { return v === null || v === undefined || !isFinite(v) ? '-' : (+v).toFixed(d === undefined ? 1 : d); }
function mean(a) { return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }
function table(head, rows) {
	return '| ' + head.join(' | ') + ' |\n|' + head.map(function () { return '---'; }).join('|') + '|\n' +
		rows.map(function (r) { return '| ' + r.join(' | ') + ' |'; }).join('\n') + '\n';
}

function main() {
	const aggs = load().map(aggregate);
	const ok = aggs.filter(function (a) { return a.status === 'ok'; });
	// sets.csv: every (placer, set) aggregate.
	const cols = ['exp', 'placer', 'set', 'status', 'kind', 'family', 'n', 'sp', 'ids', 'seed', 'views', 'labelsReq', 'maxLabelsReq', 'labelsShown',
		'breaks', 'N1', 'N3', 'N4', 'N5', 'invalid', 'labelsPct', 'valuesPct', 'gMiss', 'hidden', 'hiddenWithRoom', 'cut', 'cutWithRoom',
		'lolPer100', 'tomPerLabel', 'msMed', 'msMax', 'msFirst', 'idleMs', 'churnRate', 'lossRate', 'rowsLost', 'rowsRegained', 'r14close', 'ldrP90', 'r7on', 'r7checked', 'breakSample'];
	fs.writeFileSync(path.join(__dirname, 'sets.csv'), cols.join(',') + '\n' + aggs.map(function (a) {
		return cols.map(function (c) { const v = a[c]; if (v === undefined || v === null) { return ''; } if (typeof v === 'number') { return +v.toFixed(4); } return '"' + String(v).replace(/"/g, "'") + '"'; }).join(',');
	}).join('\n') + '\n');

	let md = '# Round 5 results (generated by analyse.js; do not edit by hand)\n\n';
	const failed = aggs.filter(function (a) { return a.status !== 'ok'; });
	md += 'Cells: ' + aggs.length + ' (placer x set), ' + ok.length + ' scored, ' + failed.length + ' failed or timed out.\n\n';
	if (failed.length) {
		md += table(['exp', 'placer', 'set', 'status', 'error'], failed.map(function (a) { return [a.exp, a.placer, a.set, a.status, String((load().find(function (c) { return c.placer === a.placer && c.set === a.set; }) || {}).error || '').slice(0, 120)]; }));
		md += '\n';
	}
	function sel(filter) { return ok.filter(filter); }
	function cellRow(list, keys) {
		return keys.map(function (k) { const v = list.map(function (a) { return a[k]; }).filter(function (x) { return x !== null && x !== undefined; }); return f(mean(v)); });
	}
	const HEAD_KEYS = ['labelsPct', 'valuesPct', 'gMiss', 'lolPer100', 'msMed', 'churnRate', 'lossRate'];
	const HEAD_NAMES = ['labels %', 'values %', 'G miss %', 'LoL/100', 'ms med', 'churn %', 'R11 loss %'];
	function brokeSets(list) { return list.filter(function (a) { return a.breaks > 0; }).length + '/' + list.length; }

	// T1: placer x family, E1 (and E0, E3 for contrast).
	md += '## T1. Placer x family (E1, mean over sets; E0 = public bench; E3 = published networks)\n\n';
	const fams = ['grid', 'tree', 'suburban', 'downtown'];
	const rowsT1 = [];
	PLACERS.forEach(function (p) {
		[['E0 (Net1-3, Novato)', function (a) { return a.exp === 'E0'; }]].concat(fams.map(function (fm) { return ['E1 ' + fm, function (a) { return a.exp === 'E1' && a.family === fm; }]; }))
			.concat([['E3 L-Town', function (a) { return a.exp === 'E3' && a.family === 'L-TOWN'; }], ['E3 C-Town', function (a) { return a.exp === 'E3' && a.family === 'C-TOWN'; }]])
			.forEach(function (g) {
				const list = sel(function (a) { return a.placer === p && g[1](a); });
				if (!list.length) { return; }
				rowsT1.push([p, g[0], String(list.length), brokeSets(list)].concat(cellRow(list, HEAD_KEYS)));
			});
	});
	md += table(['placer', 'scenes', 'sets', 'sets with breaks'].concat(HEAD_NAMES), rowsT1) + '\n';

	// T2: density, T3: size.
	md += '## T2. Placer x density (E1)\n\n';
	const rowsT2 = [];
	PLACERS.forEach(function (p) { [28, 44, 70].forEach(function (sp) { const list = sel(function (a) { return a.placer === p && a.exp === 'E1' && a.sp === sp; }); if (list.length) { rowsT2.push([p, sp + ' px', String(list.length), brokeSets(list)].concat(cellRow(list, HEAD_KEYS))); } }); });
	md += table(['placer', 'density', 'sets', 'sets with breaks'].concat(HEAD_NAMES), rowsT2) + '\n';
	md += '## T3. Placer x size (E1)\n\n';
	const rowsT3 = [];
	PLACERS.forEach(function (p) { [150, 1000, 5000].forEach(function (n) { const list = sel(function (a) { return a.placer === p && a.exp === 'E1' && a.n === n; }); if (list.length) { rowsT3.push([p, 'n=' + n, String(list.length), brokeSets(list)].concat(cellRow(list, HEAD_KEYS.concat(['msMax'])))); } }); });
	md += table(['placer', 'size', 'sets', 'sets with breaks'].concat(HEAD_NAMES, ['ms max']), rowsT3) + '\n';

	// Breaks listing.
	md += '## Breaks (every set with one)\n\n';
	const br = ok.filter(function (a) { return a.breaks > 0; });
	md += br.length ? table(['exp', 'placer', 'set', 'N1', 'N3', 'N4', 'N5', 'inv', 'sample'], br.map(function (a) { return [a.exp, a.placer, a.set, a.N1, a.N3, a.N4, a.N5, a.invalid, a.breakSample]; })) : 'None.\n';
	md += '\n';

	// T5: pairwise, E1 (master on the sets it ran).
	md += '## T5. Pairwise paired differences, E1 (row minus column placer; mean, 95% bootstrap CI, sign test +/-, Holm-adjusted p)\n\n';
	const summary = { pairwise: {} };
	OUTCOMES.forEach(function (o, oi) {
		const res = [];
		for (let i = 0; i < PLACERS.length; i++) {
			for (let j = i + 1; j < PLACERS.length; j++) {
				const p = PLACERS[i], q = PLACERS[j], P = {}, d = [];
				sel(function (a) { return a.exp === 'E1' && a.placer === p; }).forEach(function (a) { P[a.set] = a[o[0]]; });
				sel(function (a) { return a.exp === 'E1' && a.placer === q; }).forEach(function (a) { if (P[a.set] !== undefined && P[a.set] !== null && a[o[0]] !== null && a[o[0]] !== undefined) { d.push(P[a.set] - a[o[0]]); } });
				const st = signTest(d), ci = bootCI(d, 1000 + oi * 100 + i * 10 + j);
				res.push({ p: p, q: q, n: d.length, mean: mean(d), ci: ci, pos: st.pos, neg: st.neg, praw: st.p });
			}
		}
		const adj = holm(res.map(function (r) { return r.praw; }));
		res.forEach(function (r, k) { r.padj = adj[k]; });
		summary.pairwise[o[0]] = res;
		md += '**' + o[1] + '** (' + (o[2] > 0 ? 'higher' : 'lower') + ' is better)\n\n';
		md += table(['pair', 'sets', 'mean diff', '95% CI', '+/-', 'p (Holm)'], res.map(function (r) {
			return [r.p + ' - ' + r.q, String(r.n), f(r.mean, 2), '[' + f(r.ci[0], 2) + ', ' + f(r.ci[1], 2) + ']', r.pos + '/' + r.neg, r.padj < 0.001 ? '<0.001' : f(r.padj, 3)];
		})) + '\n';
	});

	// H3: time vs labels requested (every view), and the n=5000, 28 px cell.
	md += '## H3. Time per layout against labels requested (every E1 view)\n\n';
	const rowsH3 = [];
	PLACERS.forEach(function (p) {
		const xs = [], ys = [];
		load().filter(function (c) { return c.placer === p && c.exp === 'E1' && c.status === 'ok'; }).forEach(function (c) { c.views.forEach(function (v) { xs.push(v.labelsReq); ys.push(v.ms); }); });
		if (!xs.length) { return; }
		const big = sel(function (a) { return a.placer === p && a.exp === 'E1' && a.n === 5000 && a.sp === 28; });
		const bigMs = big.map(function (a) { return a.msMed; }), bigMax = big.map(function (a) { return a.msMax; });
		const perLabel = xs.map(function (x, i) { return x ? ys[i] / x : 0; });
		rowsH3.push([p, String(xs.length), f(spearman(xs, ys), 2), f(median(perLabel), 3), f(median(bigMs), 0), f(bigMax.length ? Math.max.apply(null, bigMax) : null, 0),
			f(mean(sel(function (a) { return a.placer === p && a.exp === 'E1'; }).map(function (a) { return a.idleMs || 0; })), 0)]);
	});
	md += table(['placer', 'views', 'Spearman(labels req, ms)', 'median ms per label', 'n=5000 28px: median of set medians', 'n=5000 28px: worst view', 'idle ms per set (mean)'], rowsH3) + '\n';

	// H4: density paired sign tests on G miss, same network.
	md += '## H4. G missed room: denser against sparser, same network (sign test, Holm over placers x 2)\n\n';
	const rowsH4 = [], pH4 = [];
	PLACERS.forEach(function (p) {
		[[28, 44], [44, 70]].forEach(function (pr) {
			const A = {}, d = [];
			sel(function (a) { return a.exp === 'E1' && a.placer === p && a.sp === pr[0]; }).forEach(function (a) { A[a.net] = a.gMiss; });
			sel(function (a) { return a.exp === 'E1' && a.placer === p && a.sp === pr[1]; }).forEach(function (a) { if (A[a.net] !== undefined) { d.push(A[a.net] - a.gMiss); } });
			const st = signTest(d);
			pH4.push(st.p);
			rowsH4.push([p, pr[0] + ' vs ' + pr[1] + ' px', String(d.length), f(mean(d), 2), st.pos + '/' + st.neg, st.p]);
		});
	});
	const aH4 = holm(pH4);
	md += table(['placer', 'pair', 'networks', 'mean diff (pts)', '+/-', 'p (Holm)'], rowsH4.map(function (r, k) { return r.slice(0, 5).concat([aH4[k] < 0.001 ? '<0.001' : f(aH4[k], 3)]); })) + '\n';

	// E2: ID style.
	md += '## E2. ID length (grid and suburban, n=1000, 44 px, the same 12 networks)\n\n';
	const rowsE2 = [];
	PLACERS.forEach(function (p) {
		['short', 'epanet', 'mixed', 'long'].forEach(function (ids) {
			const list = sel(function (a) { return a.placer === p && (a.exp === 'E2' || a.exp === 'E1') && a.n === 1000 && a.sp === 44 && (a.family === 'grid' || a.family === 'suburban') && a.ids === ids; });
			if (list.length) { rowsE2.push([p, ids, String(list.length), brokeSets(list)].concat(cellRow(list, HEAD_KEYS))); }
		});
	});
	md += table(['placer', 'IDs', 'sets', 'sets with breaks'].concat(HEAD_NAMES), rowsE2) + '\n';
	const rowsE2t = [];
	PLACERS.forEach(function (p) {
		['labelsPct', 'valuesPct', 'gMiss'].forEach(function (k) {
			const S = {}, d = [];
			sel(function (a) { return a.placer === p && a.ids === 'short' && a.n === 1000 && a.sp === 44; }).forEach(function (a) { S[a.net] = a[k]; });
			sel(function (a) { return a.placer === p && a.ids === 'long' && a.n === 1000 && a.sp === 44; }).forEach(function (a) { if (S[a.net] !== undefined) { d.push(a[k] - S[a.net]); } });
			const st = signTest(d);
			rowsE2t.push([p, k, String(d.length), f(mean(d), 2), st.pos + '/' + st.neg, f(st.p, 4)]);
		});
	});
	md += 'Long minus short, same network:\n\n' + table(['placer', 'outcome', 'networks', 'mean diff', '+/-', 'p (sign, raw)'], rowsE2t) + '\n';

	// H7: order in E1 against E3.
	md += '## H7. Placer order, E1 against E3 (Kendall tau over the placers both ran)\n\n';
	['labelsPct', 'gMiss', 'valuesPct'].forEach(function (k) {
		const e1 = [], e3 = [], names = [];
		PLACERS.forEach(function (p) {
			const a1 = sel(function (a) { return a.placer === p && a.exp === 'E1' && a.n <= 1000; }).map(function (a) { return a[k]; });
			const a3 = sel(function (a) { return a.placer === p && a.exp === 'E3'; }).map(function (a) { return a[k]; });
			if (a1.length && a3.length) { e1.push(mean(a1)); e3.push(mean(a3)); names.push(p); }
		});
		md += '- ' + k + ': tau = ' + f(e1.length > 1 ? kendall(e1, e3) : null, 2) + ' over ' + names.join(', ') + ' (E1 n<=1000 means ' + e1.map(function (x) { return f(x); }).join('/') + '; E3 ' + e3.map(function (x) { return f(x); }).join('/') + ')\n';
	});
	md += '\n';

	// Net3 threat: E0 against E1 per placer.
	md += '## Net3 threat. Each placer on the public bench (E0) against E1\n\n';
	const rowsN = [];
	PLACERS.forEach(function (p) {
		const e0 = sel(function (a) { return a.placer === p && a.exp === 'E0'; }), e1 = sel(function (a) { return a.placer === p && a.exp === 'E1'; });
		if (!e0.length || !e1.length) { return; }
		rowsN.push([p, brokeSets(e0), brokeSets(e1)].concat(['labelsPct', 'gMiss', 'msMed', 'churnRate', 'lossRate'].map(function (k) {
			return f(mean(e0.map(function (a) { return a[k]; }).filter(function (x) { return x !== null; }))) + ' / ' + f(mean(e1.map(function (a) { return a[k]; }).filter(function (x) { return x !== null; })));
		})));
	});
	md += table(['placer', 'E0 sets with breaks', 'E1 sets with breaks', 'labels % E0/E1', 'G miss % E0/E1', 'ms med E0/E1', 'churn % E0/E1', 'R11 loss % E0/E1'], rowsN) + '\n';

	fs.writeFileSync(path.join(__dirname, 'results.md'), md);
	fs.writeFileSync(path.join(__dirname, 'summary.json'), JSON.stringify(summary, null, 1) + '\n');
	console.log('wrote sets.csv, results.md, summary.json: ' + aggs.length + ' cells');
}

main();

// ROUND 6: THE PRE-REGISTERED ANALYSIS (round record §1.6), from raw/*.jsonl to sets.csv,
// summary.json and results.md in this folder. Deterministic: the bootstrap is seeded.
//
//   node dev/label-trials/round-6-2026-10-05/analyse.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, 'raw');
const PLACERS = ['master', 'A', 'B', 'C', 'D'];
const BUILDERS = ['A', 'B', 'C', 'D'];

// ---- meta from a set id ------------------------------------------------------------------------
function meta(set) {
	const m = /^gen-(\w+)-n(\d+)-s(\d+)-(\w+)-(\w+)-j[\d.]+-seed(\d+)(?:-b(\w+))?(?:-v(\w+))?$/.exec(set);
	if (m) {
		const bends = m[7] || 'family', valves = m[8] || 'few';
		return { kind: 'gen', family: m[1], n: +m[2], sp: +m[3], seed: +m[6], bends: bends, valves: valves,
			net: m[1] + '-n' + m[2] + '-seed' + m[6] };
	}
	return { kind: 'public', family: set, n: null, sp: null, seed: 0, bends: null, valves: null, net: set };
}

function load() {
	const cells = {};
	PLACERS.forEach(function (p) {
		const f = path.join(RAW, p + '.jsonl');
		if (!fs.existsSync(f)) { return; }
		fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(function (l) {
			const o = JSON.parse(l), arm = o.arm || 'full', k = p + '|' + o.set + '|' + arm;
			const c = cells[k] = cells[k] || { placer: p, set: o.set, arm: arm, exp: o.exp, variant: o.variant, views: [], status: 'ok' };
			if (o.status) { c.status = o.status; c.error = o.error; return; }
			c.views.push(o);
		});
	});
	return Object.keys(cells).map(function (k) { return cells[k]; });
}
function median(a) { if (!a.length) { return null; } const s = a.slice().sort(function (x, y) { return x - y; }); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function sum(a, f) { return a.reduce(function (t, x) { return t + (f(x) || 0); }, 0); }
function pct(a, b) { return b ? 100 * a / b : null; }

function aggregate(c) {
	const v = c.views.slice().sort(function (a, b) { return a.step - b.step; });
	const out = Object.assign({ placer: c.placer, set: c.set, arm: c.arm, exp: c.exp, variant: c.variant, status: c.status }, meta(c.set));
	if (c.status !== 'ok' || !v.length) { return out; }
	const S = function (k) { return sum(v, function (x) { return x[k]; }); };
	out.views = v.length;
	out.labelsReq = S('labelsReq'); out.labelsShown = S('labelsShown');
	out.breaks = sum(v, function (x) { return x.N1 + x.N3 + x.N4 + x.N5 + x.invalid; });
	out.N1 = S('N1'); out.N3 = S('N3');
	out.breakSample = [].concat.apply([], v.map(function (x) { return (x.breakSample || []).map(function (s) { return x.view.replace(/^.*@/, '@') + ' ' + s; }); })).slice(0, 3).join(' ; ');
	out.labelsPct = pct(out.labelsShown, out.labelsReq);
	out.valuesPct = pct(S('valuesShown'), S('valuesReq'));
	out.topPct = pct(S('topShown'), S('topReq'));
	out.idPct = pct(S('idsShown'), out.labelsReq);
	out.gMiss = pct(S('hiddenWithRoom') + S('cutWithRoom'), out.labelsReq);
	out.lolPer100 = out.labelsShown ? 100 * S('leaderOnLeader') / out.labelsShown : null;
	out.tomPerLabel = out.labelsShown ? S('costTom') / out.labelsShown : null;
	out.msMed = median(v.map(function (x) { return x.ms; }));
	out.msMax = Math.max.apply(null, v.map(function (x) { return x.ms; }));
	out.viewsOver1s = v.filter(function (x) { return x.ms > 1000; }).length;
	const cmp = S('compared');
	out.churnRate = cmp ? 100 * S('churn') / cmp : null;
	const lost = S('lost'), reg = S('regained');
	out.rowsLost = lost; out.rowsRegained = reg;
	if (c.arm === 'full') {
		out.hidAll = S('hidNode') + S('hidLink'); out.hidRoom = S('hidNodeRoom') + S('hidLinkRoom');
		out.hidNode = S('hidNode'); out.hidNodeRoom = S('hidNodeRoom'); out.hidLink = S('hidLink'); out.hidLinkRoom = S('hidLinkRoom');
		out.r1RoomPct = pct(out.hidRoom, out.hidAll);
		const pr = v.filter(function (x) { return x.probe; }).map(function (x) { return x.probe; });
		out.probeViews = pr.length;
		out.farHidden = sum(pr, function (x) { return x.farHidden; }); out.revived = sum(pr, function (x) { return x.revived; });
		out.controlFlips = sum(pr, function (x) { return x.controlFlips; }); out.lostFar = sum(pr, function (x) { return x.lostFar; });
		['hidRoom', 'hid1', 'hid2', 'hid3', 'placed', 'pl1', 'pl2', 'pl3', 'widestShare'].forEach(function (k) {
			out['gap_' + k] = sum(v, function (x) { return x.gap ? x.gap[k] : 0; });
		});
	}
	return out;
}

// ---- statistics (as round 5) ---------------------------------------------------------------------
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
function f(v, d) { return v === null || v === undefined || !isFinite(v) ? '-' : (+v).toFixed(d === undefined ? 1 : d); }
function fp(p) { return p === null || p === undefined ? '-' : p < 0.001 ? '<0.001' : p.toFixed(3); }
function mean(a) { a = a.filter(function (x) { return x !== null && x !== undefined && isFinite(x); }); return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }
function table(head, rows) {
	return '| ' + head.join(' | ') + ' |\n|' + head.map(function () { return '---'; }).join('|') + '|\n' +
		rows.map(function (r) { return '| ' + r.join(' | ') + ' |'; }).join('\n') + '\n';
}

// Paired differences of `key` between two groups of cells matched on `match(a)`.
function paired(listA, listB, match, key) {
	const byB = {};
	listB.forEach(function (b) { byB[match(b)] = b; });
	const d = [];
	listA.forEach(function (a) { const b = byB[match(a)]; if (b && a[key] !== null && b[key] !== null && a[key] !== undefined && b[key] !== undefined) { d.push(a[key] - b[key]); } });
	return d;
}
function pairTest(d, seed) { const ci = bootCI(d, seed), st = signTest(d); return { n: d.length, mean: mean(d), ci: ci, pos: st.pos, neg: st.neg, p: st.p }; }

function main() {
	const cells = load(), aggs = cells.map(aggregate), ok = aggs.filter(function (a) { return a.status === 'ok'; });
	const cols = ['exp', 'arm', 'placer', 'set', 'status', 'variant', 'family', 'n', 'sp', 'seed', 'bends', 'valves', 'views', 'labelsReq', 'labelsShown',
		'breaks', 'N1', 'N3', 'labelsPct', 'valuesPct', 'topPct', 'idPct', 'gMiss', 'r1RoomPct', 'hidAll', 'hidRoom', 'hidNode', 'hidNodeRoom', 'hidLink', 'hidLinkRoom',
		'probeViews', 'farHidden', 'revived', 'controlFlips', 'lostFar', 'lolPer100', 'tomPerLabel', 'msMed', 'msMax', 'viewsOver1s', 'churnRate', 'rowsLost', 'rowsRegained',
		'gap_hidRoom', 'gap_hid1', 'gap_hid2', 'gap_hid3', 'gap_placed', 'gap_pl1', 'gap_pl2', 'gap_pl3', 'gap_widestShare', 'breakSample'];
	fs.writeFileSync(path.join(__dirname, 'sets.csv'), cols.join(',') + '\n' + aggs.map(function (a) {
		return cols.map(function (c) { const v = a[c]; if (v === undefined || v === null) { return ''; } if (typeof v === 'number') { return +v.toFixed(4); } return '"' + String(v).replace(/"/g, "'") + '"'; }).join(',');
	}).join('\n') + '\n');
	const summary = {};
	let md = '# Round 6 results (generated by analyse.js; do not edit)\n\n';
	const failed = aggs.filter(function (a) { return a.status !== 'ok'; });
	md += '**Cells:** ' + aggs.length + ' (placer, set, arm), ' + ok.length + ' ok, ' + failed.length + ' failed or timed out.\n\n';
	if (failed.length) { md += table(['exp', 'arm', 'placer', 'set', 'status'], failed.map(function (a) { return [a.exp, a.arm, a.placer, a.set, a.status]; })); }
	function sel(fn) { return ok.filter(fn); }
	function broke(list) { return list.filter(function (a) { return a.breaks > 0; }).length + '/' + list.length; }
	const E1 = function (p, extra) { return sel(function (a) { return a.exp === 'E1' && a.arm === 'full' && a.placer === p && (!extra || extra(a)); }); };
	const netKey = function (a) { return a.family + '|' + a.seed + '|' + a.sp; };

	// ---- headline: placer x variant ------------------------------------------------------------
	md += '\n## Headline: placer x variant (E1, n = 1000, fresh seeds 61-64; mean over sets)\n\n';
	const rowsH = [];
	PLACERS.forEach(function (p) {
		['plain', 'bent', 'valved', 'both'].forEach(function (va) {
			const l = E1(p, function (a) { return a.variant === va; });
			if (!l.length) { return; }
			rowsH.push([p, va, broke(l), String(sum(l, function (a) { return a.N1; })), f(mean(l.map(function (a) { return a.labelsPct; }))), f(mean(l.map(function (a) { return a.valuesPct; }))),
				f(mean(l.map(function (a) { return a.topPct; }))), f(mean(l.map(function (a) { return a.gMiss; }))), f(mean(l.map(function (a) { return a.r1RoomPct; }))),
				f(median(l.map(function (a) { return a.msMed; })), 0), f(Math.max.apply(null, l.map(function (a) { return a.msMax; })), 0)]);
		});
	});
	md += table(['placer', 'variant', 'sets with breaks', 'N1 total', 'labels %', 'values %', 'top value %', 'G miss %', 'hidden with room % of hidden', 'median ms', 'worst ms'], rowsH);
	md += '\nE0 (the public bench), for reference:\n\n';
	md += table(['placer', 'sets with breaks', 'labels %', 'values %', 'top value %', 'G miss %', 'hidden with room % of hidden'], PLACERS.map(function (p) {
		const l = sel(function (a) { return a.exp === 'E0' && a.placer === p; });
		return [p, broke(l), f(mean(l.map(function (a) { return a.labelsPct; }))), f(mean(l.map(function (a) { return a.valuesPct; }))), f(mean(l.map(function (a) { return a.topPct; }))),
			f(mean(l.map(function (a) { return a.gMiss; }))), f(mean(l.map(function (a) { return a.r1RoomPct; })))];
	}));

	// ---- H1, H2: bends and valves -> breaks ------------------------------------------------------
	md += '\n## H1, H2: breaks with bends and with valves (paired on the same network, density and other factor)\n\n';
	summary.H12 = {};
	const rows12 = [];
	PLACERS.forEach(function (p) {
		[['bends', 'bent', 'plain', 'both', 'valved'], ['valves', 'valved', 'plain', 'both', 'bent']].forEach(function (fx, i) {
			const on = E1(p, function (a) { return a.variant === fx[1] || a.variant === fx[3]; });
			const off = E1(p, function (a) { return a.variant === fx[2] || a.variant === fx[4]; });
			const other = function (a) { return fx[0] === 'bends' ? a.valves : a.bends; };
			const d = paired(on, off, function (a) { return netKey(a) + '|' + other(a); }, 'breaks');
			const t = pairTest(d, 61 + i);
			summary.H12[p + '|' + fx[0]] = t;
			rows12.push([p, fx[0], broke(on), broke(off), String(sum(on, function (a) { return a.N1; })), String(sum(off, function (a) { return a.N1; })), f(t.mean, 2), t.pos + '/' + t.neg, fp(t.p)]);
		});
	});
	md += table(['placer', 'factor', 'sets with breaks, on', 'off', 'N1 on', 'N1 off', 'mean diff breaks per set', 'more/fewer', 'sign p'], rows12);
	const brk = sel(function (a) { return a.exp !== 'E0' && a.arm === 'full' && a.breaks > 0; });
	md += '\nEvery set with a break (first three sampled breaks):\n\n';
	md += brk.length ? table(['exp', 'placer', 'set', 'N1', 'N3', 'sample'], brk.slice(0, 80).map(function (a) { return [a.exp, a.placer, a.set, a.N1, a.N3, a.breakSample]; })) + (brk.length > 80 ? '\n(' + (brk.length - 80) + ' more in sets.csv)\n' : '') : 'None.\n';

	// ---- H3: bends cost labels and values ------------------------------------------------------
	md += '\n## H3: what bends cost (bent minus straight, paired), Holm over the five placers per outcome\n\n';
	summary.H3 = {};
	const rows3 = [];
	['labelsPct', 'valuesPct'].forEach(function (key, ki) {
		const ts = PLACERS.map(function (p, pi) {
			const on = E1(p, function (a) { return a.bends === 'many'; }), off = E1(p, function (a) { return a.bends === 'none'; });
			return pairTest(paired(on, off, function (a) { return netKey(a) + '|' + a.valves; }, key), 100 + 10 * ki + pi);
		});
		const adj = holm(ts.map(function (t) { return t.p; }));
		ts.forEach(function (t, i) { t.padj = adj[i]; summary.H3[PLACERS[i] + '|' + key] = t; rows3.push([PLACERS[i], key, String(t.n), f(t.mean, 2), '[' + f(t.ci[0], 2) + ', ' + f(t.ci[1], 2) + ']', t.pos + '/' + t.neg, fp(t.padj)]); });
	});
	md += table(['placer', 'outcome', 'pairs', 'mean diff (points)', '95% CI', 'up/down', 'Holm p'], rows3);

	// ---- H4: large networks ---------------------------------------------------------------------
	md += '\n## H4: large networks (E2: 5,000 and 20,000 nodes, 44 px, bent and valved; builders)\n\n';
	summary.H4 = {};
	const rows4 = [];
	BUILDERS.forEach(function (p) {
		const l5 = sel(function (a) { return a.exp === 'E2' && a.placer === p && a.n === 5000; }), l20 = sel(function (a) { return a.exp === 'E2' && a.placer === p && a.n === 20000; });
		const by5 = {};
		l5.forEach(function (a) { by5[a.family + '|' + a.seed] = a; });
		const ratios = l20.map(function (a) { const b = by5[a.family + '|' + a.seed]; return b && b.msMed ? a.msMed / b.msMed : null; }).filter(function (x) { return x !== null; });
		const views = l5.concat(l20).reduce(function (s, a) { return s + a.views; }, 0), over = sum(l5.concat(l20), function (a) { return a.viewsOver1s; });
		summary.H4[p] = { ratioMedian: median(ratios), ratios: ratios, viewsOver1s: over, views: views, failed: failed.filter(function (a) { return a.exp === 'E2' && a.placer === p; }).length };
		rows4.push([p, String(l5.length) + ' / ' + String(l20.length), f(median(l5.map(function (a) { return a.msMed; })), 0), f(median(l20.map(function (a) { return a.msMed; })), 0),
			f(median(ratios), 2), f(Math.max.apply(null, l5.concat(l20).map(function (a) { return a.msMax; })), 0), over + '/' + views,
			broke(l5.concat(l20)), f(mean(l5.concat(l20).map(function (a) { return a.labelsPct; }))), f(mean(l5.concat(l20).map(function (a) { return a.gMiss; })))]);
	});
	md += table(['placer', 'sets 5k / 20k', 'median ms 5k', 'median ms 20k', 'median ratio 20k/5k (paired)', 'worst ms', 'views over 1 s', 'sets with breaks', 'labels %', 'G miss %'], rows4);

	// ---- H5: R1 ---------------------------------------------------------------------------------
	md += '\n## H5: R1, hidden only for lack of room, never by count (E1 and E2, builders; probe on the 1x and 2x views)\n\n';
	summary.H5 = {};
	const rows5 = [];
	BUILDERS.forEach(function (p) {
		const l = sel(function (a) { return (a.exp === 'E1' || a.exp === 'E2') && a.arm === 'full' && a.placer === p; });
		const fh = sum(l, function (a) { return a.farHidden; }), rv = sum(l, function (a) { return a.revived; }), cf = sum(l, function (a) { return a.controlFlips; });
		const ha = sum(l, function (a) { return a.hidAll; }), hr = sum(l, function (a) { return a.hidRoom; });
		const hn = sum(l, function (a) { return a.hidNode; }), hnr = sum(l, function (a) { return a.hidNodeRoom; }), hl = sum(l, function (a) { return a.hidLink; }), hlr = sum(l, function (a) { return a.hidLinkRoom; });
		summary.H5[p] = { farHidden: fh, revived: rv, controlFlips: cf, hidden: ha, hiddenWithRoom: hr, hidNode: hn, hidNodeRoom: hnr, hidLink: hl, hidLinkRoom: hlr };
		rows5.push([p, String(l.length), rv + '/' + fh + ' (' + f(pct(rv, fh), 2) + '%)', String(cf), String(sum(l, function (a) { return a.lostFar; })),
			hr + '/' + ha + ' (' + f(pct(hr, ha)) + '%)', hnr + '/' + hn + ' (' + f(pct(hnr, hn)) + '%)', hlr + '/' + hl + ' (' + f(pct(hlr, hl)) + '%)']);
	});
	md += table(['placer', 'sets', 'far labels revived / far hidden', 'control flips', 'far shown that hid', 'hidden with room (all)', 'node labels', 'pipe labels'], rows5);
	const m5 = PLACERS.map(function (p) {
		const l = sel(function (a) { return (a.exp === 'E1') && a.arm === 'full' && a.placer === p; });
		return p + ' ' + f(pct(sum(l, function (a) { return a.hidRoom; }), sum(l, function (a) { return a.hidAll; }))) + '%';
	});
	md += '\nHidden with room, E1 only, every placer including master (whose replay cannot be probed for count): ' + m5.join(', ') + '.\n';

	// ---- H6: the drop-order arms ----------------------------------------------------------------
	md += '\n## H6: the drop-order arms (E3: E1\'s bent-and-valved sets; full = as requested, two = ID and the most-wanted value, one = the most-wanted value alone)\n\n';
	md += 'Every percentage is of the FULL request: labels %, values % (of the non-ID values asked for), top % (labels showing their most-wanted value: P for a node, Q for a pipe), ID % (labels showing their ID).\n\n';
	summary.H6 = {};
	const rows6 = [], rows6t = [];
	BUILDERS.forEach(function (p) {
		[28, 44].forEach(function (sp) {
			const arm = function (x) { return sel(function (a) { return a.placer === p && a.variant === 'both' && a.sp === sp && a.arm === x && (a.exp === 'E1' || a.exp === 'E3'); }); };
			const F = arm('full'), T = arm('two'), O = arm('one');
			[['full', F], ['two', T], ['one', O]].forEach(function (x) {
				rows6.push([p, sp + ' px', x[0], String(x[1].length), f(mean(x[1].map(function (a) { return a.labelsPct; }))), f(mean(x[1].map(function (a) { return a.topPct; }))),
					f(mean(x[1].map(function (a) { return a.valuesPct; }))), f(mean(x[1].map(function (a) { return a.idPct; }))), f(mean(x[1].map(function (a) { return a.lolPer100; })), 2), String(broke(x[1]))]);
			});
			[['one', O], ['two', T]].forEach(function (x, xi) {
				['topPct', 'valuesPct', 'labelsPct'].forEach(function (key, ki) {
					const t = pairTest(paired(x[1], F, function (a) { return a.family + '|' + a.seed; }, key), 600 + 100 * xi + 10 * ki + sp);
					summary.H6[p + '|' + sp + '|' + x[0] + '-full|' + key] = t;
					rows6t.push([p, sp + ' px', x[0] + ' - full', key, String(t.n), f(t.mean, 1), '[' + f(t.ci[0], 1) + ', ' + f(t.ci[1], 1) + ']', t.pos + '/' + t.neg, fp(t.p)]);
				});
			});
		});
	});
	md += table(['placer', 'density', 'arm', 'sets', 'labels %', 'top value %', 'values %', 'ID %', 'leader on leader per 100', 'sets with breaks'], rows6);
	md += '\nPaired against the full arm (same network and view):\n\n';
	md += table(['placer', 'density', 'arms', 'outcome', 'pairs', 'mean diff (points)', '95% CI', 'up/down', 'sign p'], rows6t);
	const mFull = sel(function (a) { return a.placer === 'master' && a.variant === 'both' && a.exp === 'E1'; });
	md += '\nMaster (the full arm only; its replay is the app\'s own choice): ' + [28, 44].map(function (sp) {
		const l = mFull.filter(function (a) { return a.sp === sp; });
		return sp + ' px labels ' + f(mean(l.map(function (a) { return a.labelsPct; }))) + '%, top value ' + f(mean(l.map(function (a) { return a.topPct; }))) + '%, values ' + f(mean(l.map(function (a) { return a.valuesPct; }))) + '%, ID ' + f(mean(l.map(function (a) { return a.idPct; }))) + '%';
	}).join('; ') + '.\n';

	// ---- H7: replication of round 5's order -----------------------------------------------------
	md += '\n## H7: does round 5\'s order of the placers hold on fresh seeds? (E1 plain vs round 5 E1)\n\n';
	const r5 = fs.readFileSync(path.join(__dirname, '../round-5-2026-09-29/sets.csv'), 'utf8').split('\n').filter(Boolean);
	const hd = r5[0].split(','), r5rows = r5.slice(1).map(function (l) { const v = l.split(','); const o = {}; hd.forEach(function (h, i) { o[h] = v[i] ? v[i].replace(/^"|"$/g, '') : ''; }); return o; });
	summary.H7 = {};
	const rows7 = [];
	['labelsPct', 'valuesPct', 'gMiss'].forEach(function (key) {
		const now = PLACERS.map(function (p) { return mean(E1(p, function (a) { return a.variant === 'plain'; }).map(function (a) { return a[key]; })); });
		const then = PLACERS.map(function (p) { return mean(r5rows.filter(function (r) { return r.exp === 'E1' && r.placer === p && r.status === 'ok' && +r.n <= 1000; }).map(function (r) { return +r[key]; })); });
		const tau = kendall(now, then);
		summary.H7[key] = { tau: tau, now: now, then: then };
		rows7.push([key, PLACERS.map(function (p, i) { return p + ' ' + f(now[i]); }).join(', '), PLACERS.map(function (p, i) { return p + ' ' + f(then[i]); }).join(', '), f(tau, 2)]);
	});
	md += table(['outcome', 'round 6, plain', 'round 5, E1 n <= 1000', 'Kendall tau'], rows7);

	// ---- H8: the round-5 recheck ---------------------------------------------------------------
	md += '\n## H8: round 5\'s D-break sets, extracted again with real vertices (E4)\n\n';
	const r5D = {};
	r5rows.filter(function (r) { return r.placer === 'D' && r.exp === 'E1'; }).forEach(function (r) { r5D[r.set] = +r.breaks; });
	summary.H8 = {};
	md += table(['placer', 'sets', 'sets with breaks now', 'N1 now', 'D: round 5 breaks on the same specs'], PLACERS.map(function (p) {
		const l = sel(function (a) { return a.exp === 'E4' && a.placer === p; });
		const then = l.reduce(function (s0, a) { return s0 + (r5D[a.set] || 0); }, 0);
		summary.H8[p] = { sets: l.length, broke: l.filter(function (a) { return a.breaks > 0; }).length, N1: sum(l, function (a) { return a.N1; }) };
		return [p, String(l.length), broke(l), String(sum(l, function (a) { return a.N1; })), p === 'D' ? String(then) : ''];
	}));
	const dNow = sel(function (a) { return a.exp === 'E4' && a.placer === 'D'; });
	const t8 = signTest(dNow.map(function (a) { return (r5D[a.set] || 0) - a.breaks; }));
	summary.H8.signTest = t8;
	md += '\nD, round 5 minus now, per set: ' + t8.pos + ' fewer now, ' + t8.neg + ' more; sign p ' + fp(t8.p) + '.\n';

	// ---- the gaps between a node's pipes (Task 539, spot_prime step 1) -----------------------------
	md += '\n## The gaps between a node\'s pipes, widest first (Task 539, R-079; descriptive)\n\n';
	md += 'Node labels at nodes with two or more pipes, E1 full arm. "Placed": the gap holding the direction from the node to the middle of the shown label; "baseline" is the mean share of the circle the widest gap takes (where a direction drawn at random would land). "Hidden with room": the best-ranked gap holding free ground for the ID row at the nearest reach.\n\n';
	summary.gap = {};
	md += table(['placer', 'placed', 'in widest', '2nd', '3rd+', 'baseline (widest share)', 'hidden with room', 'room in widest', '2nd', '3rd+'], PLACERS.map(function (p) {
		const l = E1(p), G = {};
		['hidRoom', 'hid1', 'hid2', 'hid3', 'placed', 'pl1', 'pl2', 'pl3', 'widestShare'].forEach(function (k) { G[k] = sum(l, function (a) { return a['gap_' + k]; }); });
		summary.gap[p] = G;
		return [p, String(G.placed), f(pct(G.pl1, G.placed)) + '%', f(pct(G.pl2, G.placed)) + '%', f(pct(G.pl3, G.placed)) + '%', f(pct(G.widestShare, G.placed)) + '%',
			String(G.hidRoom), f(pct(G.hid1, G.hidRoom)) + '%', f(pct(G.hid2, G.hidRoom)) + '%', f(pct(G.hid3, G.hidRoom)) + '%'];
	}));

	fs.writeFileSync(path.join(__dirname, 'results.md'), md);
	fs.writeFileSync(path.join(__dirname, 'summary.json'), JSON.stringify(summary, null, 1) + '\n');
	console.log('wrote sets.csv, results.md, summary.json: ' + ok.length + ' ok cells, ' + failed.length + ' failed');
}

main();

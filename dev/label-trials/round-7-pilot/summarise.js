// ROUND 7 PILOT: the table from run-pilot.js's lines. JUDGES' SIDE.
//
//   node dev/label-trials/round-7-pilot/summarise.js <pilot.jsonl>
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
function med(a) { const s = a.slice().sort(function (x, y) { return x - y; }); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; }
function pct(a, b) { return b ? (100 * a / b).toFixed(1) : '-'; }
const groups = {};
rows.forEach(function (r) {
	const dens = /-s28-/.test(r.set) ? '28' : '44';
	[r.placer + '+' + r.mode + ' all', r.placer + '+' + r.mode + ' ' + dens].forEach(function (k) { (groups[k] = groups[k] || []).push(r); });
});
const keys = Object.keys(groups).sort();
console.log('| placer | mode | density | sets | labels shown % | most-wanted value % | values % | hidden with room (smallest form) % of hidden | (ID row, round 6 way) | label on leader /100 shown | leader on leader /100 | Tom cost /label | breaks | ms median | ms max | views > 1 s |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
keys.forEach(function (k) {
	const g = groups[k], s = function (f) { return g.reduce(function (a, r) { return a + (r[f] || 0); }, 0); };
	const [pm, dens] = k.split(' '), [p, m] = pm.split('+');
	const sets = new Set(g.map(function (r) { return r.set; })).size;
	console.log('| ' + [p, m, dens, sets, pct(s('labelsShown'), s('labelsReq')), pct(s('topShown'), s('topReq')), pct(s('valuesShown'), s('valuesReq')),
		pct(s('hiddenRoomSmallest'), s('hidden')), pct(s('hiddenRoomId'), s('hidden')),
		(100 * s('labelOnLeader') / s('labelsShown')).toFixed(1), (100 * s('leaderOnLeader') / s('labelsShown')).toFixed(2),
		(s('costTom') / s('labelsShown')).toFixed(3), s('breaks'),
		med(g.map(function (r) { return r.ms; })).toFixed(0), Math.max.apply(null, g.map(function (r) { return r.ms; })).toFixed(0),
		g.filter(function (r) { return r.ms > 1000; }).length + '/' + g.length].join(' | ') + ' |');
});
// Paired: labels shown, repair minus none, per set (summed over its views), for each builder.
console.log('\nPaired per set (summed over views): repair minus the placer alone');
console.log('| placer | mode | sets better / same / worse (labels shown) | mean extra labels per set | mean extra labels per 100 requested |');
console.log('|---|---|---|---|---|');
const by = {};
rows.forEach(function (r) { const k = r.placer + '|' + r.mode + '|' + r.set; by[k] = by[k] || { shown: 0, req: 0 }; by[k].shown += r.labelsShown; by[k].req += r.labelsReq; });
['A', 'B', 'C', 'D'].forEach(function (p) {
	['rich', 'lean', 'strict'].forEach(function (m) {
		let b = 0, same = 0, w = 0, d = 0, d100 = 0, n = 0;
		Object.keys(by).forEach(function (k) {
			const [pp, mm, set] = k.split('|');
			if (pp !== p || mm !== m || !by[p + '|none|' + set]) { return; }
			const diff = by[k].shown - by[p + '|none|' + set].shown;
			n++; d += diff; d100 += 100 * diff / by[k].req;
			if (diff > 0) { b++; } else if (diff < 0) { w++; } else { same++; }
		});
		if (n) { console.log('| ' + [p, m, b + ' / ' + same + ' / ' + w, (d / n).toFixed(1), (d100 / n).toFixed(2)].join(' | ') + ' |'); }
	});
});

// ROUND 7, H3: DO THE STRATEGY CARDS' ABLATIONS REPLICATE ON SECRET SCENES? JUDGES' SIDE.
//
//   node dev/label-trials/round-7/ablate.js <work dir>            # runs, one cell at a time, resumable
//   node dev/label-trials/round-7/ablate.js <work dir> --report   # the table
//
// Each builder's card (frozen/STRATEGY-<x>.md) claims, on the public scenes, what each ingredient
// bought when switched off. H3 (round-7-plan.md §4.5): every ingredient a card claims as a gain of at
// least one label in 100 requested (39 of the public scenes' 3,895) replicates in sign on secret E1
// sets. The full E1 is 64 sets; with one worker on a shared machine this runs a fixed sample of 8
// (each family, plain and bent-and-valved, seed 71, 28 px: the crowded density, where the
// ingredients have work to do). That sample is a deviation from "the secret E1 sets", stated in the
// round record. Each cell is score-one.js run with the builder's own switch in its environment.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// The claims of at least 39 labels on the public scenes, read off each card's table (label gain =
// all-on labels minus that row's labels).
const CLAIMS = {
	A7: { env: 'PLACER_A_OFF', offs: { s11: 136, s16: 126, lead: 63 } },
	B7: { env: 'LPN_PLACER_B_OFF', offs: { reach: 223, smallfirst: 91, evict: 81 } },
	C7: { env: 'PLACER_C_OFF', offs: { evict: 143, fewest: 44 } },
	D7: { env: 'PLACER_D_OFF', offs: { evict: 245, timebound: 239, rescue: 203, rescueevict: 162, smallfirst: 133, tight: 85 } }
};
const SAMPLE = ['grid', 'tree', 'suburban', 'downtown'].reduce(function (a, f) {
	return a.concat(['bnone-vnone', 'bmany-vmany'].map(function (v) { return 'gen-' + f + '-n1000-s28-epanet-novato-j0.2-seed71-' + v; }));
}, []);

function runAll(work) {
	const dir = path.join(work, 'ablate');
	fs.mkdirSync(dir, { recursive: true });
	Object.keys(CLAIMS).forEach(function (p) {
		['(none)'].concat(Object.keys(CLAIMS[p].offs)).forEach(function (off) {
			const f = path.join(dir, p + '-' + off.replace(/[()]/g, '') + '.jsonl');
			const done = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(function (l) { return JSON.parse(l).set; }) : [];
			SAMPLE.forEach(function (sid) {
				if (done.indexOf(sid) >= 0) { return; }
				const env = Object.assign({}, process.env);
				if (off !== '(none)') { env[CLAIMS[p].env] = off; }
				const t0 = Date.now();
				const r = spawnSync(process.execPath, ['--max-old-space-size=4000', path.join(__dirname, 'score-one.js'), p, path.join(work, 'scenes', sid + '.json'), '0'], { env: env, encoding: 'utf8', maxBuffer: 1 << 28 });
				const lines = (r.stdout || '').split('\n').filter(function (l) { return l.charAt(0) === '{'; });
				if (r.status !== 0 || !lines.length) { console.log('FAILED ' + p + ' ' + off + ' ' + sid); return; }
				fs.appendFileSync(f, lines.join('\n') + '\n');
				console.log(p + ' off ' + off + ' ' + sid + ' ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
			});
		});
	});
}

function report(work) {
	const dir = path.join(work, 'ablate');
	function sets(p, off) {
		const f = path.join(dir, p + '-' + off + '.jsonl'), by = {};
		if (!fs.existsSync(f)) { return by; }
		fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(function (l) {
			const o = JSON.parse(l), s = by[o.set] = by[o.set] || { shown: 0, req: 0, vals: 0, vreq: 0 };
			s.shown += o.labelsShown; s.req += o.labelsReq; s.vals += o.valuesShown; s.vreq += o.valuesReq;
		});
		return by;
	}
	const rows = [];
	let all = true;
	Object.keys(CLAIMS).forEach(function (p) {
		const base = sets(p, 'none');
		Object.keys(CLAIMS[p].offs).forEach(function (off) {
			const o = sets(p, off);
			let pos = 0, neg = 0, d = 0, dv = 0, n = 0;
			Object.keys(base).forEach(function (sid) {
				if (!o[sid]) { return; }
				const x = 100 * (base[sid].shown - o[sid].shown) / base[sid].req;
				d += x; dv += 100 * (base[sid].vals - o[sid].vals) / base[sid].vreq; n++;
				if (x > 0) { pos++; } else if (x < 0) { neg++; }
			});
			const ok = n > 0 && d > 0;
			if (!ok) { all = false; }
			rows.push('| ' + [p, off, (100 * CLAIMS[p].offs[off] / 3895).toFixed(1), n, n ? (d / n).toFixed(2) : '-', n ? (dv / n).toFixed(2) : '-', pos + ' / ' + neg, ok ? 'yes' : 'no'].join(' | ') + ' |');
		});
	});
	console.log('| builder | ingredient switched off | card: labels it bought per 100 (public) | secret sets | mean labels it bought per 100 (secret) | mean values it bought per 100 | sets gained / lost | replicates in sign |');
	console.log('|---|---|---|---|---|---|---|---|');
	rows.forEach(function (r) { console.log(r); });
	console.log('\nH3 ' + (all ? 'SUPPORTED' : 'NOT supported') + ' (sign of the mean over the sample; "sets gained / lost" shows how consistent it was).');
}

const a = process.argv.slice(2);
if (!a[0]) { console.error('usage: ablate.js <work dir> [--report]'); process.exit(2); }
if (a.indexOf('--report') >= 0) { report(a[0]); } else { runAll(a[0]); }

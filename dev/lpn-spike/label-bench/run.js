// LABEL BENCH: RUN ONE PLACER ON EVERY SCENE AND PRINT ONE TABLE. Run with:
//
//   node dev/lpn-spike/label-bench/run.js --placer dev/lpn-spike/label-bench/placers/trivial.js
//   node dev/lpn-spike/label-bench/run.js --placer <path> --only novato-seq --verbose
//   node dev/lpn-spike/label-bench/run.js --placer <path> --json /tmp/out.json
//
// Options: --scenes <dir>        (default: scenes/ beside this file)
//          --only <set>[,<set>]  (scene set ids)
//          --verbose             (list every break)
//          --json <file>         (every layout and every score, for a judge to read)
//          --idle-open <ms>      (idle budget when a set opens; default 3000)
//          --idle-step <ms>      (idle budget between two views of a set; default 250)
//
// Exits 1 if any N1-N4 break (or an invalid placement) is found anywhere, 2 on a usage error.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { scoreView, stability, WEIGHTS } = require('./score.js');

function loadSets(dir, only) {
	return fs.readdirSync(dir).filter(function (f) { return /\.json$/.test(f); }).sort()
		.map(function (f) { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); })
		.filter(function (s) { return !only || only.indexOf(s.id) >= 0; });
}
function loadPlacer(p) {
	const mod = typeof p === 'string' ? require(path.resolve(p)) : p;
	return function () { return typeof mod.create === 'function' ? mod.create() : mod; };
}
function nowMs() { return Number(process.hrtime.bigint()) / 1e6; }

// Runs a placer over the sets and scores every view. Returns everything; prints nothing.
function runBench(placerPath, sets, opts) {
	opts = opts || {};
	const make = loadPlacer(placerPath), out = [];
	const idleOpen = opts.idleOpen === undefined ? 3000 : opts.idleOpen;
	const idleStep = opts.idleStep === undefined ? 250 : opts.idleStep;
	sets.forEach(function (set) {
		const placer = make();
		const rec = { id: set.id, name: placer.name || '?', steps: [], idleMs: 0 };
		let prev = null;
		set.steps.forEach(function (scene, i) {
			if (typeof placer.idle === 'function') {
				const t = nowMs();
				placer.idle(i === 0 ? idleOpen : idleStep, { scene: i === 0 ? scene : prev.scene, opening: i === 0 });
				rec.idleMs += nowMs() - t;
			}
			const t0 = nowMs();
			const layout = placer.place(scene, { prev: prev });
			const ms = (layout && typeof layout.recordedMs === 'number') ? layout.recordedMs : nowMs() - t0;
			const sc = scoreView(scene, layout);
			const step = { id: scene.id, ms: ms, score: sc, layout: layout };
			if (prev) { step.stability = stability(prev.scene, prev.layout, scene, layout); }
			rec.steps.push(step);
			prev = { scene: scene, layout: layout };
		});
		out.push(rec);
	});
	return out;
}

function pct(a, b) { return b ? (100 * a / b).toFixed(0) + '%' : '-'; }
function quant(arr, q) {
	if (!arr.length) { return null; }
	const s = arr.slice().sort(function (a, b) { return a - b; });
	return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1) + 0.5))];
}
function f1(v) { return v === null || v === undefined ? '-' : v.toFixed(1); }
function pad(s, n, left) { s = String(s); return left ? s.padEnd(n) : s.padStart(n); }

function machine() {
	const c = os.cpus() || [];
	return (c[0] ? c[0].model.replace(/\s+/g, ' ').trim() : '?') + ', ' + c.length + ' threads, '
		+ Math.round(os.totalmem() / 1073741824) + ' GB, ' + os.platform() + ' ' + os.release() + ', node ' + process.version;
}

// One table: a row per view, then a TOTAL row.
function printTable(results, log) {
	log = log || console.log;
	const cols = [['scene', 24, true], ['N1', 4], ['N2', 4], ['N3', 4], ['N4', 4], ['inv', 4], ['cost', 8],
		['rows', 12], ['labels', 12], ['ldr med', 8], ['p90', 6], ['max', 6], ['unforced', 10], ['ms', 7]];
	log(cols.map(function (c) { return pad(c[0], c[1], c[2]); }).join(' '));
	const T = { N1: 0, N2: 0, N3: 0, N4: 0, invalid: 0, cost: 0, rowsR: 0, rowsS: 0, labR: 0, labS: 0,
		ldr: [], moved: 0, unforced: 0, compared: 0, ms: [] };
	results.forEach(function (set) {
		set.steps.forEach(function (st) {
			const s = st.score, b = s.breaks;
			T.N1 += b.N1.length; T.N2 += b.N2.length; T.N3 += b.N3.length; T.N4 += b.N4.length; T.invalid += b.invalid.length;
			T.cost += s.cost; T.rowsR += s.rowsReq; T.rowsS += s.rowsShown; T.labR += s.labelsReq; T.labS += s.labelsShown;
			T.ldr = T.ldr.concat(s.leaderLH); T.ms.push(st.ms);
			const stab = st.stability;
			if (stab) { T.moved += stab.moved; T.unforced += stab.unforced; T.compared += stab.compared; }
			log([pad(st.id, 24, true), pad(b.N1.length, 4), pad(b.N2.length, 4), pad(b.N3.length, 4), pad(b.N4.length, 4),
				pad(b.invalid.length, 4), pad(s.cost.toFixed(1), 8),
				pad(s.rowsShown + '/' + s.rowsReq, 12), pad(s.labelsShown + '/' + s.labelsReq, 12),
				pad(f1(quant(s.leaderLH, 0.5)), 8), pad(f1(quant(s.leaderLH, 0.9)), 6), pad(f1(quant(s.leaderLH, 1)), 6),
				pad(stab ? stab.unforced + '/' + stab.compared : '', 10), pad(st.ms.toFixed(1), 7)].join(' '));
		});
	});
	log([pad('TOTAL', 24, true), pad(T.N1, 4), pad(T.N2, 4), pad(T.N3, 4), pad(T.N4, 4), pad(T.invalid, 4),
		pad(T.cost.toFixed(1), 8), pad(pct(T.rowsS, T.rowsR), 12), pad(pct(T.labS, T.labR), 12),
		pad(f1(quant(T.ldr, 0.5)), 8), pad(f1(quant(T.ldr, 0.9)), 6), pad(f1(quant(T.ldr, 1)), 6),
		pad(T.unforced + '/' + T.compared, 10), pad('', 7)].join(' '));
	log('time per layout: median ' + f1(quant(T.ms, 0.5)) + ' ms, max ' + f1(quant(T.ms, 1)) + ' ms, on ' + machine());
	const idle = results.reduce(function (a, s) { return a + s.idleMs; }, 0);
	if (idle) { log('idle hook time (not in the layout times): ' + idle.toFixed(0) + ' ms over ' + results.length + ' set(s)'); }
	log('cost weights: ' + Object.keys(WEIGHTS).map(function (k) { return k + ' ' + WEIGHTS[k]; }).join(', '));
	log('leader length in label heights (the shown block\'s own height); unforced = moved/compared between consecutive views');
	return T;
}

function main() {
	const a = process.argv.slice(2);
	function opt(name) { const i = a.indexOf(name); return i >= 0 ? a[i + 1] : undefined; }
	const placer = opt('--placer');
	if (!placer) { console.error('usage: node run.js --placer <path> [--only set,set] [--verbose] [--json file]'); process.exit(2); }
	const only = opt('--only') ? opt('--only').split(',') : null;
	const sets = loadSets(opt('--scenes') || path.join(__dirname, 'scenes'), only);
	if (!sets.length) { console.error('no scene sets found'); process.exit(2); }
	const res = runBench(placer, sets, { idleOpen: opt('--idle-open') !== undefined ? +opt('--idle-open') : undefined,
		idleStep: opt('--idle-step') !== undefined ? +opt('--idle-step') : undefined });
	console.log('placer: ' + (res[0] && res[0].name) + ' (' + placer + ')');
	const T = printTable(res);
	if (a.indexOf('--verbose') >= 0) {
		res.forEach(function (set) {
			set.steps.forEach(function (st) {
				const b = st.score.breaks;
				['N1', 'N2', 'N3', 'N4', 'invalid'].forEach(function (k) {
					b[k].forEach(function (m) { console.log('  ' + st.id + ' ' + k + ': ' + m); });
				});
				if (st.stability && st.stability.unforcedIds.length) {
					console.log('  ' + st.id + ' moved unforced: ' + st.stability.unforcedIds.join(' '));
				}
			});
		});
	}
	if (opt('--json')) { fs.writeFileSync(opt('--json'), JSON.stringify({ machine: machine(), results: res })); }
	const bad = T.N1 + T.N2 + T.N3 + T.N4 + T.invalid;
	console.log(bad ? 'BREAKS: ' + bad + ' (N1-N4 and invalid placements must be zero)' : 'No N1-N4 breaks.');
	process.exit(bad ? 1 : 0);
}

if (require.main === module) { main(); }
module.exports = { runBench, printTable, loadSets, machine };

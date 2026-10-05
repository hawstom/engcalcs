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
// Exits 1 if any N1, N3, N4 or N5 break (or an invalid placement) is found anywhere, 2 on a usage
// error. A leader crossing another leader is no longer fatal (N2 removed); it raises the cost.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { scoreView, stability, zoomRowChange } = require('./score.js');
const C = require('./contract.js');

// The crossing costs, worst to least (dev/label-placement-rules.md §3, "Costs, worst first").
// Builders get the order only (Tom's ruling of 2026-09-28): score.js counts each crossing by its
// rank in this order, and no other numbers are in the bench.
const CROSSING_ORDER = ['leader on leader', 'label on leader', 'label on pipe', 'leader on pipe',
	'label on customer (free)'];

// R9's repeat spacing is set here, from the viewport, per dev/label-placement-rules.md §3.1: master's
// own value is 0.75 x the shorter side of the visible map. The bench's scenes are all one fixed
// canvas (1400x900), so this is one number for every scene -- filled in at load time rather than by
// re-running extract.js's headless browser pass, which regenerating the committed scenes only for a
// derived, constant field would not be worth.
// R14 AT CLOSE ZOOM (Tom, 2026-09-28: "The problem was that at any close zoom whatsoever, pipe
// labels stayed horizontal [...] If they are still horizontal when there's no good reason to ignore
// the user setting, that's bad."): the views zoomed this far in or further (novato-zoom@4x and 8x,
// novato-seq@4x), where there is plenty of room.
const CLOSE_ZOOM = 4;

function withRepeatSpacing(scene) {
	scene.text.repeatSpacingPx = 0.75 * Math.min(scene.viewport.w, scene.viewport.h);
	return scene;
}

function loadSets(dir, only) {
	return fs.readdirSync(dir).filter(function (f) { return /\.json$/.test(f); }).sort()
		.map(function (f) { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); })
		.filter(function (s) { return !only || only.indexOf(s.id) >= 0; })
		.map(function (s) {
			s.steps.forEach(function (sc) {
				const bad = C.sceneProblem(sc);
				if (bad) { throw new Error('scene refused (missing or non-numeric coordinate): ' + bad); }
			});
			s.steps.forEach(withRepeatSpacing);
			return s;
		});
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
			if (prev) {
				step.stability = stability(prev.scene, prev.layout, scene, layout);
				step.zoomIn = zoomRowChange(prev.scene, prev.layout, scene, layout);
			}
			rec.steps.push(step);
			prev = { scene: scene, layout: layout };
		});
		out.push(rec);
	});
	return out;
}

// **R13 ON A SETTINGS CHANGE: THE ALIGNMENT SETTING SWITCHED OFF AT THE SAME VIEW.** The scene
// sets are all views of an unchanging project, so nothing above ever changes a setting under a
// placer. The page does: a user unticks "Draw link labels along the link line" and the very next
// place() gets the same view with `alignPipeLabels: false`, `along: false` on every pipe label, and
// `prev` = the layout it just made with the setting on. R13 says the layout reflects the settings,
// so no pipe label may stay turned. For the first view of every set that asks for any pipe label
// along its pipe: place it with the setting on, then again with it off and `prev` set, and count
// the pipe labels still turned (angle not a multiple of 180). A placer that cannot place a scene
// it has not seen (master's replay) is reported as such. Reported, never failing.
function settingsToggle(placerPath, sets) {
	const make = loadPlacer(placerPath), out = { checked: 0, stillTurned: 0, ids: [], skipped: false };
	sets.forEach(function (set) {
		const on = set.steps[0];
		if (!on.labels.some(function (r) { return r.along; })) { return; }
		const off = JSON.parse(JSON.stringify(on));
		off.id = on.id + '#align-off';
		off.settings = Object.assign({}, off.settings, { alignPipeLabels: false });
		off.labels.forEach(function (r) { if (r.kind === 'link') { r.along = false; } });
		const placer = make();
		let a, b;
		try {
			a = placer.place(on, { prev: null });
			b = placer.place(off, { prev: { scene: on, layout: a } });
		} catch (e) { out.skipped = true; return; }
		const L = (b && b.labels) || {};
		Object.keys(L).forEach(function (id) {
			const p = L[id];
			if (id.charAt(0) !== 'l' || !p || !p.shown) { return; }
			out.checked++;
			if (Math.abs(((+p.angle || 0) % 180)) > 0.5) { out.stillTurned++; out.ids.push(off.id + ' ' + id); }
		});
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
	const cols = [['scene', 24, true], ['N1', 4], ['N3', 4], ['N4', 4], ['N5', 4], ['inv', 4], ['cost', 8],
		['rows', 12], ['labels', 12], ['ldr med', 8], ['p90', 6], ['max', 6], ['churn', 8], ['ms', 7]];
	log(cols.map(function (c) { return pad(c[0], c[1], c[2]); }).join(' '));
	const T = { N1: 0, N3: 0, N4: 0, N5: 0, invalid: 0, cost: 0, rowsR: 0, rowsS: 0, labR: 0, labS: 0,
		ldr: [], moved: 0, churn: 0, compared: 0, ms: [],
		r5c: 0, r5m: 0, r7c: 0, r7o: 0, r9s: 0, r9h: 0, r14a: 0, r14y: 0, r14m: 0, r14ca: 0, r14cy: 0, r14cm: 0, zoomRegained: 0, zoomLost: 0 };
	results.forEach(function (set) {
		set.steps.forEach(function (st) {
			const s = st.score, b = s.breaks;
			T.N1 += b.N1.length; T.N3 += b.N3.length; T.N4 += b.N4.length; T.N5 += b.N5.length; T.invalid += b.invalid.length;
			T.cost += s.cost; T.rowsR += s.rowsReq; T.rowsS += s.rowsShown; T.labR += s.labelsReq; T.labS += s.labelsShown;
			T.ldr = T.ldr.concat(s.leaderLH); T.ms.push(st.ms);
			T.r5c += s.r5.checked; T.r5m += s.r5.mismatch; T.r7c += s.r7.checked; T.r7o += s.r7.onOwnPipe;
			T.r9s += s.r9.should; T.r9h += s.r9.has;
			T.r14a += s.r14.asked; T.r14y += s.r14.along; T.r14m += s.r14.missedWithRoom;
			if (s.r14.zoom >= CLOSE_ZOOM) { T.r14ca += s.r14.asked; T.r14cy += s.r14.along; T.r14cm += s.r14.missedWithRoom; }
			const stab = st.stability;
			if (stab) { T.moved += stab.moved; T.churn += stab.churn; T.compared += stab.compared; }
			if (st.zoomIn) { T.zoomRegained += st.zoomIn.regained; T.zoomLost += st.zoomIn.lost; }
			log([pad(st.id, 24, true), pad(b.N1.length, 4), pad(b.N3.length, 4), pad(b.N4.length, 4), pad(b.N5.length, 4),
				pad(b.invalid.length, 4), pad(s.cost.toFixed(1), 8),
				pad(s.rowsShown + '/' + s.rowsReq, 12), pad(s.labelsShown + '/' + s.labelsReq, 12),
				pad(f1(quant(s.leaderLH, 0.5)), 8), pad(f1(quant(s.leaderLH, 0.9)), 6), pad(f1(quant(s.leaderLH, 1)), 6),
				pad(stab ? stab.churn + '/' + stab.compared : '', 8), pad(st.ms.toFixed(1), 7)].join(' '));
		});
	});
	log([pad('TOTAL', 24, true), pad(T.N1, 4), pad(T.N3, 4), pad(T.N4, 4), pad(T.N5, 4), pad(T.invalid, 4),
		pad(T.cost.toFixed(1), 8), pad(pct(T.rowsS, T.rowsR), 12), pad(pct(T.labS, T.labR), 12),
		pad(f1(quant(T.ldr, 0.5)), 8), pad(f1(quant(T.ldr, 0.9)), 6), pad(f1(quant(T.ldr, 1)), 6),
		pad(T.churn + '/' + T.compared, 8), pad('', 7)].join(' '));
	log('time per layout: median ' + f1(quant(T.ms, 0.5)) + ' ms, max ' + f1(quant(T.ms, 1)) + ' ms, on ' + machine());
	const idle = results.reduce(function (a, s) { return a + s.idleMs; }, 0);
	if (idle) { log('idle hook time (not in the layout times): ' + idle.toFixed(0) + ' ms over ' + results.length + ' set(s)'); }
	log('cost = each crossing counted by its rank, worst to least: ' + CROSSING_ORDER.join(', ')
		+ ' (4, 3, 2, 1, 0; a label on a symbol, label or Text 5)');
	log('leader length in label heights (the shown block\'s own height); churn = moved/compared'
		+ ' between consecutive views, where the move showed nothing more and fixed no break (no stillness rule)');
	log('REPORTED, never failing -- R5 leader-side align: ' + T.r5m + '/' + T.r5c + ' stacked+leadered labels not'
		+ ' justified to their leader\'s side; R7 label-on-own-pipe: ' + T.r7o + '/' + T.r7c + ' shown pipe labels sit on'
		+ ' their own pipe; R9 repeats: ' + T.r9h + '/' + T.r9s + ' pipes longer than the repeat spacing carry repeats;'
		+ ' R11 zoom-in row change: ' + T.zoomRegained + ' regained, ' + T.zoomLost + ' lost, across zoom-in steps;'
		+ ' R14 along the pipe: ' + T.r14y + '/' + T.r14a + ' shown pipe labels the setting asks to lie along their pipe do,'
		+ ' and ' + T.r14m + ' of the rest had room beside their pipe to; R14 at close zoom (' + CLOSE_ZOOM + 'x and closer): of '
		+ (T.r14ca - T.r14cy) + ' pipe labels still level, ' + T.r14cm + ' had room to lie along their pipe with the same rows'
		+ ' (' + pct(T.r14cm, T.r14ca - T.r14cy) + '; should be near zero)');
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
	const tog = settingsToggle(placer, sets);
	console.log('REPORTED, never failing -- R13 alignment setting switched off at the same view: '
		+ (tog.skipped && !tog.checked ? 'not measurable (this placer cannot place a scene it has not seen)'
			: tog.stillTurned + '/' + tog.checked + ' shown pipe labels still turned (should be 0)'));
	if (a.indexOf('--verbose') >= 0) {
		tog.ids.forEach(function (m) { console.log('  R13 still turned after the setting went off: ' + m); });
		res.forEach(function (set) {
			set.steps.forEach(function (st) {
				const b = st.score.breaks;
				['N1', 'N3', 'N4', 'N5', 'invalid'].forEach(function (k) {
					b[k].forEach(function (m) { console.log('  ' + st.id + ' ' + k + ': ' + m); });
				});
				st.score.crossings.leaderOnLeader.forEach(function (m) {
					console.log('  ' + st.id + ' leader on leader (cost, not a break): ' + m);
				});
				if (st.score.r14.missedIds.length) {
					console.log('  ' + st.id + ' R14 not along its pipe, with room: ' + st.score.r14.missedIds.join(' '));
				}
				if (st.stability && st.stability.churnIds.length) {
					console.log('  ' + st.id + ' churn: ' + st.stability.churnIds.join(' '));
				}
			});
		});
	}
	if (opt('--json')) { fs.writeFileSync(opt('--json'), JSON.stringify({ machine: machine(), results: res })); }
	const bad = T.N1 + T.N3 + T.N4 + T.N5 + T.invalid;
	console.log(bad ? 'BREAKS: ' + bad + ' (N1, N3, N4, N5 and invalid placements must be zero)' : 'No N1, N3, N4, N5 breaks.');
	process.exit(bad ? 1 : 0);
}

if (require.main === module) { main(); }
module.exports = { runBench, printTable, loadSets, machine, settingsToggle, CLOSE_ZOOM };

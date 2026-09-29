// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
//   node dev/lpn-spike/label-bench/judges/judge.js --placer <path>
//
// Run on the placer as the bench runs it (fresh instance per scene set, the idle hook called the
// same way):
//
//   1. R-075, THE 12345678 TEST. The Novato scene sets (novato-zoom, novato-seq) laid out twice:
//      as shipped, and with "12345678" prefixed to every node ID (judges/scenes/*-12345678.json,
//      extracted from the app with that prefix set). **What it measures (rewritten 2026-09-28 on
//      Tom's ruling "The test is faulty. Their behavior is gold."):** of the labels the plain
//      layout SHOWED, how many the long-ID layout HID or showed FEWER VALUES of although FREE
//      GROUND WITHIN REACH (room.js, R075_REACH_ROWS) could have held them whole in that same
//      layout. A label that moved to make room for its longer ID and still shows as much is not a
//      failure; the moves are counted and reported only. Reported, not asserted.
//   2. TOM'S TWO SCREENSHOTS OF 2026-09-27 (dev/screenshots/label-couch-2026-09-27-*.png in the
//      main checkout, untracked), as named assertions on novato-seq at the two steps that bracket
//      their scale: 2x and 2.5x. Tank 1 to node 203 measures 124 px and 115 px on the screenshots
//      (rows pitch 14 px there, as here, so they are 1:1); those steps put it at 102 and 128 px.
//   3. R14, ALONG THE PIPE (Tom, 2026-09-28: "When there is space available, honor the setting
//      about aligning labels to pipes"). Over every public scene: of the shown pipe labels the
//      setting asks to lie along their pipe, those drawn otherwise although an aligned spot beside
//      their pipe was free (score.js alignedRoom()) may be at most R14_MAX_MISSED of them.
//      Also R13 on a settings change (run.js settingsToggle()): with the setting switched off at
//      the same view, and `prev` the layout made with it on, no pipe label may stay turned. Tom's
//      pre-reviewer found both round-3 placers keeping them on the real page (2026-09-28).
//   4. TOM'S CROSSING WEIGHTS (weights.js), the cost the bench reports by rank, weighted with his
//      numbers. Reported.
//
// Exit 1 if any named assertion fails.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const C = require('../contract.js');
const { runBench, loadSets, machine, settingsToggle } = require('../run.js');
const { roomWithinReach } = require('./room.js');
const TOM_WEIGHTS = require('./weights.js');

const BENCH = path.join(__dirname, '..');
const SCREEN_STEPS = ['novato-seq@2x', 'novato-seq@2.5x'];
const GANG = ['184', '163', '265', '183', '169', '179', '177', '271'];
// Thresholds, in text ROWS (scene.text.rowHeightPx). A judge may tighten them; say so when you do.
const REACH_ROWS = 6;       // S1/S3: a leader longer than this has gone "overseas"
const SOUTH_ROWS = 3;       // a block whose top is this far below its node is hung south
const SOUTH_MAX = 2;        // more than this many of the eight hung south is the screenshot's column

// R-075: free ground a straight leader of at most this many text rows reaches is "within reach".
// Half the "overseas" line below; at 1 row C/D/master lose 77/104/105 with room, at 6 rows 424/331/136.
const R075_REACH_ROWS = 3;
// R14: at most this share of the shown pipe labels asked to lie along their pipe may be drawn
// otherwise while an aligned spot beside their pipe was free. Master's own placer misses none.
const R14_MAX_MISSED = 0.05;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

function edgesHeld(reqA, a, reqB, b, text) {
	const dxA = a.x - reqA.anchor.x, dxB = b.x - reqB.anchor.x;
	const wA = C.blockSize(reqA, a, text).w, wB = C.blockSize(reqB, b, text).w;
	const left = Math.abs(dxA - dxB) <= 1, right = Math.abs((dxA + wA) - (dxB + wB)) <= 1;
	return (left || right) && Math.abs((a.y - reqA.anchor.y) - (b.y - reqB.anchor.y)) <= 1;
}

// One view pair: the plain layout A of scene sA, the long-ID layout B of scene sB. Exported for the
// judges' selftest.
function r075View(sA, A, sB, B, reach) {
	const reqA = {}, reqB = {};
	sA.labels.forEach(function (r) { reqA[r.id] = r; });
	sB.labels.forEach(function (r) { reqB[r.id] = r; });
	const out = { shown: 0, moved: [], hidden: [], fewer: [], hiddenRoom: [], fewerRoom: [] };
	Object.keys(A).forEach(function (id) {
		if (!A[id] || !A[id].shown || !reqA[id] || !reqB[id]) { return; }
		out.shown++;
		const b = B[id];
		const lost = !b || !b.shown ? 'hidden' : (b.rows.length < A[id].rows.length ? 'fewer' : null);
		if (lost) {
			out[lost].push(id);
			if (roomWithinReach(sB, { labels: B }, reqB[id], A[id].rows, { reachRows: reach })) { out[lost + 'Room'].push(id); }
		}
		if (b && b.shown && !edgesHeld(reqA[id], A[id], reqB[id], b, sA.text)) { out.moved.push(id); }
	});
	return out;
}

function r075(placer) {
	console.log('--- R-075: 12345678 prefixed to every node ID (reported, not asserted) ---');
	const setsA = loadSets(path.join(BENCH, 'scenes'), ['novato-zoom', 'novato-seq']);
	const setsB = loadSets(path.join(__dirname, 'scenes'), ['novato-zoom-12345678', 'novato-seq-12345678']);
	const plain = runBench(placer, setsA), long = runBench(placer, setsB);
	const T = { shown: 0, moved: 0, hidden: 0, fewer: 0, hiddenRoom: 0, fewerRoom: 0 };
	plain.forEach(function (set, si) {
		set.steps.forEach(function (st, k) {
			const v = r075View(setsA[si].steps[k], st.layout.labels || {}, setsB[si].steps[k], long[si].steps[k].layout.labels || {}, R075_REACH_ROWS);
			T.shown += v.shown; T.moved += v.moved.length; T.hidden += v.hidden.length; T.fewer += v.fewer.length;
			T.hiddenRoom += v.hiddenRoom.length; T.fewerRoom += v.fewerRoom.length;
			const lostRoom = v.hiddenRoom.concat(v.fewerRoom);
			console.log('  ' + st.id.padEnd(20) + ' shown ' + String(v.shown).padStart(4)
				+ '   lost with room: hid ' + String(v.hiddenRoom.length).padStart(3) + ', cut ' + String(v.fewerRoom.length).padStart(3)
				+ '   (all: hid ' + String(v.hidden.length).padStart(3) + ', cut ' + String(v.fewer.length).padStart(3)
				+ '; moved ' + String(v.moved.length).padStart(3) + ')'
				+ (lostRoom.length ? '   ' + lostRoom.slice(0, 8).join(' ') + (lostRoom.length > 8 ? ' ...' : '') : ''));
		});
	});
	const lost = T.hiddenRoom + T.fewerRoom;
	console.log('  TOTAL: of ' + T.shown + ' labels shown, the long IDs hid ' + T.hiddenRoom + ' and cut values from ' + T.fewerRoom
		+ ' WHERE FREE GROUND WITHIN ' + R075_REACH_ROWS + ' ROWS COULD HAVE HELD THEM (' + (T.shown ? (100 * lost / T.shown).toFixed(1) : '-') + '%).');
	console.log('         Reported only: they hid ' + T.hidden + ' and cut ' + T.fewer + ' in all, and moved ' + T.moved
		+ ' of those still shown (a move is not a failure: Tom, 2026-09-28).');
	return T;
}

function r14(placer) {
	console.log('--- R14: pipe labels along their pipe where there is room, every public scene ---');
	const sets = loadSets(path.join(BENCH, 'scenes'));
	const res = runBench(placer, sets);
	let asked = 0, along = 0, missed = 0, cost = 0, rankCost = 0;
	res.forEach(function (set) {
		set.steps.forEach(function (st) {
			const r = st.score.r14;
			asked += r.asked; along += r.along; missed += r.missedWithRoom;
			rankCost += st.score.cost;
			Object.keys(st.score.counts).forEach(function (k) { cost += st.score.counts[k] * TOM_WEIGHTS[k]; });
			if (r.asked) {
				console.log('  ' + st.id.padEnd(20) + ' along ' + String(r.along).padStart(4) + '/' + String(r.asked).padEnd(4)
					+ '  not along with room ' + String(r.missedWithRoom).padStart(4));
			}
		});
	});
	report(asked === 0 || missed <= R14_MAX_MISSED * asked, 'R14: at most ' + (100 * R14_MAX_MISSED) + '% of the pipe labels asked to lie along their pipe are drawn otherwise where there was room',
		missed + '/' + asked + (asked ? ' (' + (100 * missed / asked).toFixed(1) + '%)' : '') + '; along ' + along + '/' + asked);
	const tog = settingsToggle(placer, sets);
	if (!(tog.skipped && !tog.checked)) {
		report(tog.stillTurned === 0, 'R13: with "Draw link labels along the link line" switched off at the same view, no pipe label stays turned',
			tog.stillTurned + '/' + tog.checked + (tog.ids.length ? ': ' + tog.ids.slice(0, 5).join(', ') : ''));
	} else { console.log('  ..   R13 settings toggle: not measurable for this placer'); }
	console.log('--- Tom\'s crossing weights (weights.js), every public scene: weighted cost ' + cost.toFixed(1)
		+ ' (the bench\'s ranked cost ' + rankCost.toFixed(0) + ') ---');
	return { asked: asked, along: along, missed: missed, cost: cost };
}

function screenshots(placer) {
	console.log('--- Tom\'s two screenshots of 2026-09-27, at novato-seq 2x and 2.5x ---');
	const set = loadSets(path.join(BENCH, 'scenes'), ['novato-seq'])[0];
	const res = runBench(placer, [set])[0];
	SCREEN_STEPS.forEach(function (sid) {
		const k = set.steps.findIndex(function (s) { return s.id === sid; });
		const scene = set.steps[k], layout = res.steps[k].layout.labels || {};
		const req = {};
		scene.labels.forEach(function (r) { req[r.id] = r; });
		const row = scene.text.rowHeightPx;
		function boxes(id) { const p = layout[id]; return p && p.shown && req[id] ? C.placementBoxes(req[id], p, scene.text) : null; }
		// (a) label-couch-2026-09-27-overwrite-185-183.png: 185 written over 183, south of South
		// Novato Boulevard. Breaks N1.
		const b185 = boxes('n:185'), b183 = boxes('n:183');
		let over = false;
		if (b185 && b183) { b185.forEach(function (p) { b183.forEach(function (q) { if (C.boxesOverlap(p, q)) { over = true; } }); }); }
		report(!over, sid + ' [overwrite-185-183] 185\'s label is not written over 183\'s',
			'185 ' + (b185 ? 'shown' : 'hidden') + ', 183 ' + (b183 ? 'shown' : 'hidden'));
		// (b) label-couch-2026-09-27-gang-runs-south.png: eight labels hung in one column far south
		// of their nodes, leaders off the bottom of the screen, open ground west.
		const vp = scene.viewport, far = [], off = [], south = [], westLeft = [];
		GANG.forEach(function (n) {
			const id = 'n:' + n, p = layout[id], r = req[id];
			if (!p || !p.shown || !r) { return; }
			if (p.leader) {
				const len = C.polylineLength(p.leader) / row;
				if (len > REACH_ROWS) { far.push(n + ' (' + len.toFixed(1) + ' rows)'); }
				const e = p.leader[p.leader.length - 1];
				if (e[0] < vp.x || e[1] < vp.y || e[0] > vp.x + vp.w || e[1] > vp.y + vp.h) { off.push(n); }
			}
			if (p.y - r.anchor.y > SOUTH_ROWS * row) { south.push(n); }
			const W = C.blockSize(r, p, scene.text).w;
			if (p.rows.length > 1 && p.x + W <= r.anchor.x && p.align !== 'right') { westLeft.push(n); }
		});
		report(!far.length, sid + ' [gang-runs-south] none of the eight has a leader longer than ' + REACH_ROWS + ' rows (S1, S3)', far.join(', '));
		report(!off.length, sid + ' [gang-runs-south] no leader of the eight runs off the screen', off.join(' '));
		report(south.length <= SOUTH_MAX, sid + ' [gang-runs-south] at most ' + SOUTH_MAX + ' of the eight hung more than '
			+ SOUTH_ROWS + ' rows south of their nodes', south.length + ': ' + south.join(' '));
		report(!westLeft.length, sid + ' [gang-runs-south] a stacked label west of its node hangs on its east edge (S2)', westLeft.join(' '));
		const shownN = GANG.filter(function (n) { return layout['n:' + n] && layout['n:' + n].shown; }).length;
		console.log('        (' + shownN + ' of the eight shown at ' + sid + ')');
	});
}

function main() {
	if (require.main !== module) { return; }
	const a = process.argv.slice(2), i = a.indexOf('--placer');
	if (i < 0 || !a[i + 1]) { console.error('usage: node judges/judge.js --placer <path>'); process.exit(2); }
	const placer = path.resolve(a[i + 1]);
	console.log('JUDGES ONLY -- placer ' + a[i + 1] + ', on ' + machine());
	r075(placer);
	screenshots(placer);
	r14(placer);
	console.log(`\n${checks - failures}/${checks} named assertions passed.`);
	process.exit(failures ? 1 : 0);
}
main();
module.exports = { r075View, R075_REACH_ROWS, R14_MAX_MISSED };

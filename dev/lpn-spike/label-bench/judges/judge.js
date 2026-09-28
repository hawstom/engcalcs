// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
//   node dev/lpn-spike/label-bench/judges/judge.js --placer <path>
//
// Two secret tests, run on the placer as the bench runs it (fresh instance per scene set, the
// idle hook called the same way):
//
//   1. R-075, THE 12345678 TEST. The Novato scene sets (novato-zoom, novato-seq) laid out twice:
//      as shipped, and with "12345678" prefixed to every node ID (judges/scenes/*-12345678.json,
//      extracted from the app with that prefix set). Of the labels the unprefixed layout SHOWED,
//      how many the prefixed one MOVED (neither the edge it hangs on nor its row held within 1 px),
//      HID, or showed fewer values of. Rule S2 is what should pass it.
//   2. TOM'S TWO SCREENSHOTS OF 2026-09-27 (dev/screenshots/label-couch-2026-09-27-*.png in the
//      main checkout, untracked), as named assertions on novato-seq at the two steps that bracket
//      their scale: 2x and 2.5x. Tank 1 to node 203 measures 124 px and 115 px on the screenshots
//      (rows pitch 14 px there, as here, so they are 1:1); those steps put it at 102 and 128 px.
//
// Exit 1 if any named assertion fails. The R-075 counts are reported, not asserted: "nothing moves
// where free space exists within reach" needs a judge's eye on the cases that did move.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const C = require('../contract.js');
const { runBench, loadSets, machine } = require('../run.js');

const BENCH = path.join(__dirname, '..');
const SCREEN_STEPS = ['novato-seq@2x', 'novato-seq@2.5x'];
const GANG = ['184', '163', '265', '183', '169', '179', '177', '271'];
// Thresholds, in text ROWS (scene.text.rowHeightPx). A judge may tighten them; say so when you do.
const REACH_ROWS = 6;       // S1/S3: a leader longer than this has gone "overseas"
const SOUTH_ROWS = 3;       // a block whose top is this far below its node is hung south
const SOUTH_MAX = 2;        // more than this many of the eight hung south is the screenshot's column

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

function r075(placer) {
	console.log('--- R-075: 12345678 prefixed to every node ID ---');
	const plain = runBench(placer, loadSets(path.join(BENCH, 'scenes'), ['novato-zoom', 'novato-seq']));
	const long = runBench(placer, loadSets(path.join(__dirname, 'scenes'), ['novato-zoom-12345678', 'novato-seq-12345678']));
	const T = { shown: 0, moved: 0, hidden: 0, fewer: 0 };
	plain.forEach(function (set, si) {
		set.steps.forEach(function (st, k) {
			const lst = long[si].steps[k];
			const sA = loadSets(path.join(BENCH, 'scenes'), [set.id])[0].steps[k];
			const sB = loadSets(path.join(__dirname, 'scenes'), [long[si].id])[0].steps[k];
			const reqA = {}, reqB = {};
			sA.labels.forEach(function (r) { reqA[r.id] = r; });
			sB.labels.forEach(function (r) { reqB[r.id] = r; });
			const A = st.layout.labels || {}, B = lst.layout.labels || {};
			let shown = 0, moved = [], hidden = [], fewer = [];
			Object.keys(A).forEach(function (id) {
				if (!A[id] || !A[id].shown || !reqA[id] || !reqB[id]) { return; }
				shown++;
				const b = B[id];
				if (!b || !b.shown) { hidden.push(id); return; }
				if (!edgesHeld(reqA[id], A[id], reqB[id], b, sA.text)) { moved.push(id); }
				if (b.rows.length < A[id].rows.length) { fewer.push(id); }
			});
			T.shown += shown; T.moved += moved.length; T.hidden += hidden.length; T.fewer += fewer.length;
			console.log('  ' + st.id.padEnd(20) + ' shown ' + String(shown).padStart(4) + '   moved ' + String(moved.length).padStart(3)
				+ '   hidden ' + String(hidden.length).padStart(3) + '   fewer values ' + String(fewer.length).padStart(3)
				+ (moved.length ? '   moved: ' + moved.slice(0, 8).join(' ') + (moved.length > 8 ? ' ...' : '') : '')
				+ (hidden.length ? '   hidden: ' + hidden.slice(0, 8).join(' ') + (hidden.length > 8 ? ' ...' : '') : ''));
		});
	});
	console.log('  TOTAL: of ' + T.shown + ' labels shown, the long IDs moved ' + T.moved + ', hid ' + T.hidden
		+ ', and cut values from ' + T.fewer + '.');
	return T;
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
	const a = process.argv.slice(2), i = a.indexOf('--placer');
	if (i < 0 || !a[i + 1]) { console.error('usage: node judges/judge.js --placer <path>'); process.exit(2); }
	const placer = path.resolve(a[i + 1]);
	console.log('JUDGES ONLY -- placer ' + a[i + 1] + ', on ' + machine());
	r075(placer);
	screenshots(placer);
	console.log(`\n${checks - failures}/${checks} named assertions passed.`);
	process.exit(failures ? 1 : 0);
}
main();

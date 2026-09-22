// TOM'S ACCEPTANCE TEST FOR THE NODE LABELS, R-075, RUN AS HE STATED IT (ROADMAP Task 539). Run with:
//
//   node dev/lpn-spike/label-prefix-acceptance-harness.js
//   node dev/lpn-spike/label-prefix-acceptance-harness.js --quick      (the fit view only, no asserts)
//
// **HIS WORDS:** *"I am never going to be happy until I can add 12345678 to the node ID prefix
// without moving or hiding any of the labels shown."*
//
// So this takes a shipped drawing, switches on the node ID alone, lays it out with an empty prefix,
// then again with `12345678` as the prefix, and counts -- of the labels the SHORT layout drew --
// how many the long layout MOVED (a different endpoint, compared exactly) and how many it HID, at
// the fit view and three zooms in. **There is no seed to vary**: the layout is a pure function of
// the drawing and the zoom, and panning the view was measured to change nothing, so the zooms and
// the two drawings are the sample.
//
// **THE "HAD TO MOVE" COLUMN IS THE FLOOR, and it answers his R-102.** Every label of the short
// layout is left exactly where it was, given its long width, and kept in the pass's own order; a
// label that then lands on a symbol or on a label already kept could not have stayed. No placer
// can beat that number without printing text on something. Before 2026-09-22 it was 21 of 97 at
// 4x on Net3-World and the real pass moved exactly those and no more -- so at working zooms the
// moves were genuine collisions, made inevitable by where the SHORT layout had put its labels.
//
// **EVERY VIEW IS RUN TWICE: THE SHIPPED PASS, AND "BEFORE"**, which is the same pass with room to
// grow switched off (Collide.placeLabelsFirstFit() explains room to grow). The before column is the
// comparison and it is also this file's mutation: the shipped counts must beat it.
//
// Timing is reported beside it for his R-076 (*"but at what performance cost?"*): the wall time of
// the page's own refreshLabelText(), the full content-and-layout pass, averaged over the two
// prefixes of each view. dev/label-placement-algorithms.md section 20 is the record.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const EXAMPLES = path.join(__dirname, '../water-network-examples');
const FILES = ['Net3-Novato-CA-World.lwn', 'Net3.lwn'];
const LONG = '12345678';
const MULTS = [1, 2, 4, 8];

// **THE RATCHET.** Totals over every view of a file, shipped code, empty prefix against LONG. They
// may FALL and may not RISE. Measured 2026-09-22.
const CEILING = {
	'Net3-Novato-CA-World.lwn': { moved: 30, hidden: 41 },
	'Net3.lwn': { moved: 19, hidden: 28 }
};

// THE BEFORE: room to grow switched off through the stub's own source hook, so every label is
// placed at exactly its text width again -- the pass as it stood before 2026-09-22. A mutation that
// no longer matches throws rather than passing silently.
const BEFORE = function (src) {
	const from = 'grow: dataLabelBoxHeight(1) * LPN_NODE_ROOM_TO_GROW_ROWS,';
	if (src.indexOf(from) < 0) { throw new Error('label-prefix-acceptance-harness: re-aim BEFORE'); }
	return src.replace(from, 'grow: 0,');
};

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

function runChild(file, before, quick) {
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(path.join(__dirname, '../../js/lpn-collide.js')).lpnCollide;
	// The label height of every node label, off the placer's own inputs, so a move can be stated in
	// label heights on a geographic drawing where a world unit is a degree.
	let heights = {}, lastCall = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		labels.forEach(function (l) { heights[l.id] = l.h; });
		lastCall = { labels: labels.map(function (l) {
			return { id: l.id, anchor: l.anchor, w: l.w, h: l.h, yOff: l.yOff, lines: l.lines,
				priority: l.priority, dragged: l.dragged };
		}), obstacles: obstacles, pad: (opts && opts.pad) || 0 };
		return realFF.call(this, labels, obstacles, opts);
	};
	// **THE FLOOR: HOW MANY LABELS HAD TO MOVE.** Every label the short layout drew, left exactly
	// where it was and given its LONG width, in the pass's own order. One that then lands on a
	// symbol, or on a label already kept, cannot stay; every other one could. No placer can do better
	// than this number without breaking a hard rule, so it is what the shipped count is measured
	// against -- his R-102 question, "how many HAD to move", as a number.
	function floorOf(a, call) {
		const kept = [], order = call.labels.slice().sort(function (x, y) {
			if (!!y.dragged !== !!x.dragged) { return y.dragged ? 1 : -1; }
			return (y.priority || 0) - (x.priority || 0) || (x.id < y.id ? -1 : 1);
		});
		const nodeOf = {};
		doc.nodes.forEach(function (n) { nodeOf[L.nodeLabelKey(n.id)] = n.id; });
		let must = 0;
		order.forEach(function (l) {
			const s = a[nodeOf[l.id]];
			if (!s) { return; }
			const bs = Collide.labelLineBoxes(l, { x: s.ex, y: s.ey });
			const v = Collide.boxesClearOf(bs,
				{ boxes: call.obstacles.boxes.concat(kept), segments: call.obstacles.segments }, call.pad, l.id);
			if (v === 'blocked' && !l.dragged) { must++; return; }
			bs.forEach(function (b) { kept.push(b); });
		});
		return must;
	}
	stub.setUnitSet('us');
	const L = stub.loadLoopedNetwork(
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tsetView: function (v) { return applyView(v); },\n" +
		"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
		"\t\tscale: function () { return state.s; },\n" +
		"\t\tgetDoc: function () { return doc; },\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tnodeAt: nodeAt, nodeLabelPos: nodeLabelPos, nodeLabelKey: nodeLabelKey",
		null, before ? BEFORE : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(EXAMPLES, file), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, his own test case: one row, so the prefix is the only thing that changes.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	ls.prefix = ls.prefix || {}; ls.prefix.node = ls.prefix.node || {};
	L.zoomExtent();
	const sFit = L.scale(), doc = L.getDoc();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;
	// The view centres: the drawing's centroid, then two pans a fixed pseudo-random fraction of a
	// screen away. Fixed, so the numbers reproduce; more than one, so no single view decides.
	function snap() {
		const nodeEls = L.nodeEls(), out = {};
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || ne.hiddenDropped || ne.hiddenCrossed) { out[n.id] = null; return; }
			const at = L.nodeAt(n), end = L.nodeLabelPos(n);
			out[n.id] = { side: ne.side, dx: end.x - at.x, dy: end.y - at.y, ex: end.x, ey: end.y,
				h: heights[L.nodeLabelKey(n.id)] || 0 };
		});
		return out;
	}
	// One pass by default, because this runs in the suite; LPN_TIMING_REPEATS=n takes the median of
	// n passes for a timing someone means to quote. The layout is a pure function of the drawing, so
	// a repeat re-derives the same answer and only the clock differs.
	const REPEATS = Math.max(1, Number(process.env.LPN_TIMING_REPEATS) || 1);
	function timed() {
		const ms = [];
		for (let r = 0; r < REPEATS; r++) {
			heights = {};
			const t0 = process.hrtime.bigint();
			L.refreshLabelText();
			ms.push(Number(process.hrtime.bigint() - t0) / 1e6);
		}
		ms.sort(function (x, y) { return x - y; });
		return ms[ms.length >> 1];
	}
	const views = [];
	(quick ? [1] : MULTS).forEach(function (mult) {
		{
			const s = sFit * mult;
			if (!L.setView({ cx: cx, cy: cy, s: s })) { return; }
			ls.prefix.node.id = '';
			const msShort = timed(), a = snap();
			ls.prefix.node.id = LONG;
			const msLong = timed(), b = snap(), floor = floorOf(a, lastCall);
			let shown = 0, moved = 0, far = 0, hid = 0, hiddenShort = 0, hiddenLong = 0;
			Object.keys(a).forEach(function (id) {
				if (!b[id]) { hiddenLong++; }
				if (!a[id]) { hiddenShort++; return; }
				shown++;
				if (!b[id]) { hid++; return; }
				const d = Math.hypot(a[id].dx - b[id].dx, a[id].dy - b[id].dy);
				// EXACT, up to a last-bit wobble: "without moving" is not "without moving much".
				if (d > 1e-9 * Math.max(1, Math.abs(a[id].dx) + Math.abs(a[id].dy))) {
					moved++;
					if (a[id].h > 0 && d > 1.5 * a[id].h) { far++; }
				}
			});
			views.push({ mult: mult, total: Object.keys(a).length, shown: shown,
				moved: moved, far: far, hid: hid, floor: floor, hiddenShort: hiddenShort, hiddenLong: hiddenLong,
				msShort: msShort, msLong: msLong });
		}
	});
	return views;
}

function child(file, before, quick) {
	const args = [__filename, '--child', file, before ? 'before' : 'shipped'];
	if (quick) { args.push('--quick'); }
	const r = spawnSync(process.execPath, args,
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 900000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function sum(rows, k) { return rows.reduce(function (s, r) { return s + r[k]; }, 0); }
function median(a) {
	const s = a.slice().sort(function (x, y) { return x - y; }), m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function main() {
	if (process.argv[2] === '--child') {
		const out = runChild(process.argv[3], process.argv[4] === 'before', process.argv[5] === '--quick');
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	const quick = process.argv.indexOf('--quick') >= 0;
	console.log('--- R-075: add "' + LONG + '" to the node ID prefix; how many shown labels move or hide? ---');
	FILES.forEach(function (file) {
		const got = {};
		['shipped', 'before'].forEach(function (v) { got[v] = child(file, v === 'before', quick); });
		if (got.shipped.error || got.before.error) {
			report(false, file, got.shipped.error || got.before.error);
			return;
		}
		console.log('  ' + file + '  (view = zoom x fit / centre; counts are of labels the empty-prefix layout DREW)');
		console.log('    view   shown now/before  had-to-move | shipped: moved hid (>1.5h)   ms | before: moved hid (>1.5h)   ms');
		got.shipped.forEach(function (s, i) {
			const b = got.before[i];
			console.log('    x' + String(s.mult).padEnd(4) + String(s.shown).padStart(5) + '/' + b.shown + String(s.floor).padStart(10) + '/' + String(b.floor).padEnd(4)
				+ '   |' + String(s.moved).padStart(14) + String(s.hid).padStart(4) + '  (' + String(s.far).padStart(3) + ')'
				+ String(Math.round((s.msShort + s.msLong) / 2)).padStart(8) + ' |'
				+ String(b.moved).padStart(12) + String(b.hid).padStart(4) + '  (' + String(b.far).padStart(3) + ')'
				+ String(Math.round((b.msShort + b.msLong) / 2)).padStart(8));
		});
		const S = got.shipped, B = got.before;
		console.log('    total: had to move ' + sum(S, 'floor') + ' (before: ' + sum(B, 'floor') + ');  shipped moved ' + sum(S, 'moved') + ', hid ' + sum(S, 'hid')
			+ ' of ' + sum(S, 'shown') + ' shown;  before moved ' + sum(B, 'moved') + ', hid ' + sum(B, 'hid')
			+ ' of ' + sum(B, 'shown') + ' shown');
		console.log('    layout time per pass, median: shipped '
			+ median(S.map(function (r) { return (r.msShort + r.msLong) / 2; })).toFixed(0) + ' ms, before '
			+ median(B.map(function (r) { return (r.msShort + r.msLong) / 2; })).toFixed(0) + ' ms');
		if (quick) { return; }
		const cap = CEILING[file];
		report(sum(S, 'moved') <= cap.moved && sum(S, 'hid') <= cap.hidden,
			file + ': moved and hidden labels against the ratchet',
			'moved ' + sum(S, 'moved') + ' (ceiling ' + cap.moved + '), hid ' + sum(S, 'hid')
				+ ' (ceiling ' + cap.hidden + ')');
		// **HIS SENTENCE, EXACTLY, WHERE THE DRAWING HAS ROOM**: at 4x and 8x not one label moves
		// and not one hides. Zero, not a ceiling -- this is the property, not a ratchet.
		const zoomed = S.filter(function (r) { return r.mult >= 4; });
		report(zoomed.length === 2 && sum(zoomed, 'moved') === 0 && sum(zoomed, 'hid') === 0,
			file + ': at 4x and 8x, adding the prefix moves and hides NOTHING',
			zoomed.map(function (r) { return 'x' + r.mult + ' moved ' + r.moved + ' hid ' + r.hid; }).join(', '));
		// THE MUTATION: room to grow switched off must do worse, or this file cannot see the fix.
		report(sum(B, 'moved') + sum(B, 'hid') > sum(S, 'moved') + sum(S, 'hid')
				&& sum(B.filter(function (r) { return r.mult >= 4; }), 'moved') > 0,
			file + ': selftest -- with room to grow switched off, labels move again',
			'before ' + (sum(B, 'moved') + sum(B, 'hid')) + ' against shipped ' + (sum(S, 'moved') + sum(S, 'hid')));
	});
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();

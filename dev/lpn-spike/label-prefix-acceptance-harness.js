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
// may FALL and may not RISE. Measured 2026-09-22, with the leader slide and the column slide in:
// those two shorten leaders and cost a few moves at 1x and 2x (30 -> 38 on Net3-World), never at 4x.
// Re-measured after master's symbol cap (Task 705) landed and the gang repair and the slide began
// judging a room-claiming label by its room: 102 -> 11 moved over the four zooms on Net3-World. The
// hidden count rose with the cap itself, which hides more at the fit view on master alone (26).
// Re-measured the same day when the leader slide began taking the nearest clear spot and going round
// until nothing moved: Net3-World 11 -> 10, Net3 9 -> 10 (one more at its fit view). Traded
// knowingly for the longest leader on his northwest case, 28 -> 19 text heights at 2x.
//
// **AND THEN THE `moved` CEILING ROSE, WHICH A RATCHET IS NOT SUPPOSED TO DO. READ THIS BEFORE
// LOWERING IT BY HAND** (2026-09-22). Tom ruled that a longer leader is to be preferred to a label
// giving a property up, so the widened search ships on (`labelWidenSearch`). **That puts 22 more
// labels on the fit view of Net3-World** -- 69 drawn becomes 91 with the node ID alone, and the
// sweep's hidden count at the fit view falls from 29 to 10 at every prefix length. More labels on
// the drawing is more labels that can be in each other's way, so the number that move when the
// prefix grows rises with it: 10 to 43 on Net3-World, 10 to 46 on Net3, and none of it at 4x or 8x,
// where the property still holds exactly.
//
// **THE EVIDENCE THAT THIS IS CROWDING AND NOT THE PLACER GETTING WORSE IS THE `had-to-move`
// COLUMN BESIDE IT**, which is the floor no placer can beat without printing text on something: it
// rises from 33 to 45 on Net3-World, and the pass moves 43 -- fewer labels than have to move. Net3
// is the one that does not read that cleanly (46 moved against a floor of 30, all of it at the fit
// view) and it is honest to say so rather than to average it away.
//
// **IT IS ALSO A CONFLICT BETWEEN TWO OF HIS OWN ASKS, AND HE HAS NOT BEEN ASKED WHICH HE WANTS.**
// R-075 says adding `12345678` must move nothing; today's ruling says a label must not give up a
// property while a longer leader would do. At the fit view and at 2x they now pull opposite ways.
// Measured with each half switched off separately: the widening accounts for ALL of the rise and
// the crossing-shed rung for none.
const CEILING = {
	'Net3-Novato-CA-World.lwn': { moved: 43, hidden: 27 },
	'Net3.lwn': { moved: 46, hidden: 22 }
};

// THE BEFORE: room to grow switched off through the stub's own source hook, so every label is
// placed at exactly its text width again -- the pass as it stood before 2026-09-22. A mutation that
// no longer matches throws rather than passing silently.
const BEFORE = function (src) {
	const from = 'grow: LPN_NODE_ROOM_TO_GROW_ROWS.map(';
	if (src.indexOf(from) < 0) { throw new Error('label-prefix-acceptance-harness: re-aim BEFORE'); }
	return src.replace(from, 'grow: [].map(');
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
	if (quick === 'sweep') { return sweepIn(L, Collide, doc, ls, sFit, cx, cy, snap, function () { return lastCall; }, timed); }
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


// ---- THE PREFIX-LENGTH SWEEP (Tom, 2026-09-22) ----------------------------------------------------
//
// *"with 1 character added, there is no significant additional vertical spacing in the gang. But
// when I add a second character, a noticeable amount of additional gaps appear... the top label of
// this descending gang is eventually gratuitously 20 text heights away from its node."* So: prefixes
// of 0 to 10 characters, and per length the labels that moved (against length 0), the labels hidden,
// the longest vertical COLUMN (rows touching, overlapping in x), the leader of that column's TOP
// row, the longest leader in it, and the mean leader of every drawn label -- all in text heights.
// If adding text made no difference these would all be flat lines.
const SWEEP = '1234567890';
function sweepIn(L, Collide, doc, ls, sFit, cx, cy, snap, lastCall, timed) {
	const rows = [];
	// Fit and 2x by default, where the ratchet was measured; LPN_SWEEP_MULTS=1,2,4,8 reads further in.
	(process.env.LPN_SWEEP_MULTS || '1,2').split(',').map(Number).forEach(function (mult) {
		if (!L.setView({ cx: cx, cy: cy, s: sFit * mult })) { return; }
		let base = null;
		for (let k = 0; k <= SWEEP.length; k++) {
			ls.prefix.node.id = SWEEP.slice(0, k);
			const ms = timed(), a = snap(), call = lastCall();
			const spec = {};
			call.labels.forEach(function (l) { spec[l.id] = l; });
			const drawn = [];
			doc.nodes.forEach(function (n) {
				const v = a[n.id], sp = spec[L.nodeLabelKey(n.id)];
				if (!v || !sp) { return; }
				drawn.push({ id: n.id, v: v, h: sp.h, lead: Math.hypot(v.dx, v.dy) / sp.h,
					b: Collide.labelBoxAtEnd(sp, { x: v.ex, y: v.ey }) });
			});
			if (!base) { base = a; }
			let moved = 0;
			Object.keys(a).forEach(function (id) {
				if (a[id] && base[id] && (Math.abs(a[id].dx - base[id].dx) > 1e-12 || Math.abs(a[id].dy - base[id].dy) > 1e-12)) { moved++; }
			});
			// Columns: b directly below a, overlapping it in x by a third of the narrower, with a gap
			// under one row. The longest chain of those is "the gang" as a reader sees it.
			const below = {};
			drawn.forEach(function (p) { below[p.id] = []; });
			drawn.forEach(function (p) {
				drawn.forEach(function (q) {
					if (p === q) { return; }
					const ov = Math.min(p.b.cx + p.b.w / 2, q.b.cx + q.b.w / 2) - Math.max(p.b.cx - p.b.w / 2, q.b.cx - q.b.w / 2);
					const gap = (q.b.cy - q.b.h / 2) - (p.b.cy + p.b.h / 2);
					if (ov > Math.min(p.b.w, q.b.w) / 3 && gap > -0.05 * p.h && gap < p.h) { below[p.id].push(q); }
				});
			});
			const memo = {};
			const chain = function (p) {
				if (memo[p.id]) { return memo[p.id]; }
				memo[p.id] = [p];
				let best = [p];
				below[p.id].forEach(function (q) { const c = chain(q); if (c.length + 1 > best.length) { best = [p].concat(c); } });
				return (memo[p.id] = best);
			};
			let col = [];
			drawn.forEach(function (p) { const c = chain(p); if (c.length > col.length) { col = c; } });
			rows.push({ mult: mult, k: k, moved: moved, hidden: doc.nodes.length - drawn.length,
				column: col.length, top: col.length ? col[0].lead : 0,
				colMax: col.reduce(function (m, p) { return Math.max(m, p.lead); }, 0),
				mean: drawn.reduce(function (m, p) { return m + p.lead; }, 0) / Math.max(1, drawn.length),
				ms: ms });
		}
	});
	return rows;
}

function child(file, before, quick) {
	const args = [__filename, '--child', file, before ? 'before' : 'shipped'];
	if (quick === 'sweep') { args.push('--sweep'); } else if (quick) { args.push('--quick'); }
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

// The ratchet on the sweep: the worst top-of-column leader and the worst hidden count over all
// eleven lengths, fit and 2x. Measured 2026-09-22; may fall, may not rise.
//
// **TWO OF THE THREE ROSE ON 2026-09-22 AND IT IS THE SAME CAUSE AS CEILING'S** -- the widened
// search ships on, so the fit view draws 19 more labels at every prefix length (hidden 29 -> 10 at
// length 0) and they stand further out. A drawing with three labels on it has short leaders and a
// three-row column; this one has thirteen. `hidden` FELL from 47 to 29, which is the same fact read
// from the other side. **Two rows say plainly that the widening is not what makes a long leader
// long:** at lengths 9 and 10 the "now" and "before" columns are identical to the decimal (9.2 and
// 6.9 text heights), because past eight characters the text is wider than the reserve and room to
// grow stops applying at all -- that number was there before any of this and is R-136's own
// question. Measured 2026-09-22; may fall, may not rise.
const SWEEP_CEILING = { top: 9.3, hidden: 29, mean: 3.6 };
function sweepReport() {
	const file = FILES[0], got = { now: child(file, false, 'sweep'), before: child(file, true, 'sweep') };
	if (got.now.error || got.before.error) { report(false, 'prefix sweep', got.now.error || got.before.error); return; }
	console.log('  prefix length sweep, ' + file + ', node ID alone (leaders in text heights)');
	console.log('    zoom  len | now: moved hidden column top-lead col-max mean     ms | before: moved hidden column top-lead col-max mean');
	got.now.forEach(function (r, i) {
		const b = got.before[i], f = function (v) { return v.toFixed(1).padStart(8); };
		console.log('    x' + r.mult + '   ' + String(r.k).padStart(4) + ' |' + String(r.moved).padStart(10)
			+ String(r.hidden).padStart(7) + String(r.column).padStart(7) + f(r.top) + f(r.colMax) + f(r.mean)
			+ String(Math.round(r.ms)).padStart(7) + ' |' + String(b.moved).padStart(13) + String(b.hidden).padStart(7)
			+ String(b.column).padStart(7) + f(b.top) + f(b.colMax) + f(b.mean));
	});
	const worst = function (rows, k) { return rows.reduce(function (m, r) { return Math.max(m, r[k]); }, 0); };
	report(worst(got.now, 'top') <= SWEEP_CEILING.top && worst(got.now, 'hidden') <= SWEEP_CEILING.hidden
			&& worst(got.now, 'mean') <= SWEEP_CEILING.mean,
		'prefix sweep: worst top-of-column leader, hidden count and mean leader against the ratchet',
		'top ' + worst(got.now, 'top').toFixed(1) + ' h, hidden ' + worst(got.now, 'hidden') + ', mean '
			+ worst(got.now, 'mean').toFixed(2) + ' h (ceilings ' + SWEEP_CEILING.top + ', ' + SWEEP_CEILING.hidden + ', ' + SWEEP_CEILING.mean + ')');
}

function main() {
	if (process.argv[2] === '--child') {
		const out = runChild(process.argv[3], process.argv[4] === 'before', process.argv[5] === '--sweep' ? 'sweep' : process.argv[5] === '--quick');
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
	if (!quick) { sweepReport(); }
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();

// WHY DID EACH MOVED LABEL MOVE? Run with:
//
//   node dev/lpn-spike/label-width-cause-harness.js
//   node dev/lpn-spike/label-width-cause-harness.js --selftest    (mutations; must go red)
//
// **TOM'S ARGUMENT, AND IT IS GEOMETRIC** (2026-09-18, contradicting this project's own answer for
// the second time): *"width and height are independent dimensions in an area of unlimited width. No
// amount of additions to the string should affect placements."* He was answered with *"when labels
// are close enough to touch, a wider one genuinely does not fit in a gap a narrower one fits in"*,
// and **that sentence was wrong.** It conflates a two-dimensional gap with a one-dimensional one: a
// box that grows only in width can be blocked only by something lying in the direction it grew, so
// "it did not fit" is a claim about a BOUNDED gap and nothing had shown the gaps were bounded. It
// is also a restatement rather than an explanation, which is the deeper fault.
//
// **SO THIS FILE DOES NOT ARGUE. FOR EVERY LABEL THAT MOVES, IT NAMES THE OBJECT THE WIDER BOX HIT
// THAT THE NARROWER ONE DID NOT.** The first-fit is replayed offline from its own captured inputs,
// in its own committing order, with a FULL SCAN instead of the broad-phase grid -- so the grid
// cannot be the cause and every rejection can be enumerated. For each mover, the candidate it chose
// at the NARROW text is re-tested at the WIDE text against the obstacle list exactly as it stood
// when that label was placed, and each blocker is classified:
//
//   grew into a real object   the blocker is geometrically IDENTICAL in both runs and does not touch
//                             the narrow box at that same candidate. The label grew into something
//                             that was really there, in the direction it grew. Tom's principle is
//                             satisfied by this case.
//   something upstream moved  the blocker is a label box that itself differs between the two runs.
//                             This label's own extra width hit nothing; it is following a neighbour.
//   unclassified              ANYTHING ELSE, and it is a defect. A rejection with no blocker at all,
//                             a blocker that is not in the direction of growth, a candidate that
//                             exists at one width and not the other. **The assertion is that this is
//                             zero**, and the named suspects it would catch are a viewport or
//                             drawing bound, a quantised cell, a reach or leader rule keyed on box
//                             SIZE, a shed reading box area, and a side chooser with a width
//                             threshold.
//
// **THE MEASURED ANSWER, 2026-09-18** (Net3-World, node ID alone, `1234=` against no prefix):
//
//   | view | labels that move | grew into a real object | following a neighbour | unclassified |
//   |---|---|---|---|---|
//   | fit  | 58 of 97 | 14 | 44 | **0** |
//   | 2x   | 34 of 97 | 14 | 20 | **0** |
//
// **THE NUMBER THAT MATTERS IS 14, AND IT DOES NOT MOVE WITH THE ZOOM.** Only fourteen labels
// anywhere ever grow into anything; everything else is amplification by a greedy pass that places
// one label at a time. So the answer Tom was given was wrong twice over -- not only in the sentence
// he objected to, but in naming the minority mechanism as though it were the whole of it.
//
// dev/label-placement-algorithms.md section 16h is the record.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../../');
const ROOTJS = path.join(ROOT, 'js/lpn-collide.js');
// Two views of Tom's own drawing plus one synthetic drawing packed tight enough that a label really
// does have a node symbol one label-width away -- the BOUNDED case, kept so the classifier can be
// seen separating it from the unbounded ones rather than only asserted about them.
// **`roomCeiling` IS A RATCHET ON THE DEFECT ITSELF: labels dropped while they still had room.**
// Measured 2026-09-19, narrow and wide. Not one drop anywhere was genuinely enclosed, so these are
// entirely the three bounds coming up empty on ground that was there. **The numbers may FALL and may
// not RISE** -- lower them when a fix lands.
//
// **THE FIX EXISTS AND IS SWITCHED OFF, WHICH IS WHY THESE ARE STILL WHAT THEY WERE.** Set
// `labelWidenSearch` true in js/looped-network.js -- or tick "widen the search rather than hide"
// under ?debug=labels -- and every number below goes to ZERO, at his own `12345678` prefix as well
// as at `1234=`. Section 19bb is why it does not ship that way yet.
const FIXTURES = [
	{ tag: 'synthetic crowded', kind: 'synthetic', arg: 100, roomCeiling: { narrow: 0, wide: 0 } },
	{ tag: 'Net3-World fit', kind: 'net3', arg: 5000, roomCeiling: { narrow: 12, wide: 32 } },
	{ tag: 'Net3-World 2x', kind: 'net3', arg: 12000, roomCeiling: { narrow: 1, wide: 5 } }
];
// His own test: the same field, with and without four characters of Before text.
// **THE AFFIX IS OVERRIDABLE FOR EXPLORATION ONLY** -- `LPN_WIDE_AFFIX=12345678 node ...` runs his
// 2026-09-21 acceptance test. The ceilings above are measured at the default and are the ratchet;
// an override prints its own numbers and asserts nothing about them.
const NARROW = '', WIDE = process.env.LPN_WIDE_AFFIX || '1234=';

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- the child: one document per process, and the capture ------------------------------------

function sparseDoc(spacing) {
	const nodes = [], links = [];
	for (let i = 0; i < 12; i++) {
		nodes.push({ id: 'J' + (i + 1), type: 'junction',
			x: (i % 4) * spacing, y: Math.floor(i / 4) * spacing, elev: 100, _demand: 5 });
	}
	nodes.push({ id: 'R1', type: 'reservoir', x: -spacing, y: 0, head: 200 });
	for (let i = 0; i + 1 < 12; i++) {
		links.push({ id: 'P' + (i + 1), type: 'pipe', from: nodes[i].id, to: nodes[i + 1].id,
			diam: 200, rough: 130, verts: [] });
	}
	links.push({ id: 'P0', type: 'pipe', from: 'R1', to: 'J1', diam: 300, rough: 130, verts: [] });
	return { format: 'hawsedc-lpn', v: 6,
		project: { name: 'probe', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: nodes, links: links, labels: [] };
}

// The three mutations the selftest uses, applied to js/looped-network.js through the stub's own
// `mutate` hook. They are made in the SOURCE rather than monkeypatched, for the reason
// label-width-stability-harness.js records: the page calls these through its own closure.
const MUTATIONS = {
	// CAUGHT: a candidate raster whose REACH is keyed on the box width -- the "reach keyed on box
	// SIZE rather than on distance" suspect, stated exactly.
	'reach-reads-width': function (src) {
		return src.replace(
			'reach = Math.max(Math.hypot(d.x, d.y) * 3, fs * LPN_NODE_MIN_REACH_TEXT_HEIGHTS),',
			'reach = Math.max(Math.hypot(d.x, d.y) * 3, fs * LPN_NODE_MIN_REACH_TEXT_HEIGHTS) '
				+ '+ labelBoxWidth(ne) * 0.5,');
	},
	// CONTROL: every candidate moved by the same constant. The drawing changes; whether the
	// candidate set depends on the WIDTH does not, and the harness must say so rather than report
	// a win. A part that fails everything asserts nothing.
	'candidates-shifted': function (src) {
		return src.replace(
			'\t\tvar d = defaultLabelOffset(), ctx = nodeContextFor(n.id),',
			'\t\tvar d0 = defaultLabelOffset(), d = { x: d0.x * 1.4, y: d0.y }, ctx = nodeContextFor(n.id),');
	}
};

function runChild(kind, arg, mutationName) {
	const stub = require('./lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet } = stub;
	const Collide = require(ROOTJS).lpnCollide;
	let captured = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		const out = realFF.call(this, labels, obstacles, opts);
		// Deep-cloned: a later pass in the same refresh would otherwise scribble on the inputs this
		// analysis is about.
		captured = { labels: JSON.parse(JSON.stringify(labels)),
			obstacles: JSON.parse(JSON.stringify(obstacles)),
			opts: JSON.parse(JSON.stringify(opts || {})),
			out: JSON.parse(JSON.stringify(out)) };
		return out;
	};
	setUnitSet('us');
	const L = loadLoopedNetwork(
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
		"\t\tgetDoc: function () { return doc; },\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; }",
		null, mutationName ? MUTATIONS[mutationName] : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	if (kind === 'synthetic') { L.applySaved(sparseDoc(arg)); }
	else {
		L.applySaved(JSON.parse(fs.readFileSync(
			path.join(__dirname, '../water-network-examples/Net3-Novato-CA-World.lwn'), 'utf8')));
	}
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, which is his own test case: one row of text, so the affix is the only
	// thing that can change the box, and nothing can shed.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	if (kind === 'synthetic') {
		// The scale is FIXED and the spacing varies -- deriving it from the spacing reproduces the
		// identical picture, which is a fixture that varies nothing.
		if (!L.setView({ cx: arg * 1.5, cy: arg, s: 700 / (400 * 4) })) { throw new Error('view refused'); }
	} else {
		const doc = L.getDoc();
		let cx = 0, cy = 0;
		doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
		cx /= doc.nodes.length; cy /= doc.nodes.length;
		if (!L.setView({ cx: cx, cy: cy, s: arg })) { throw new Error('view refused'); }
	}
	const runs = {};
	[['narrow', NARROW], ['wide', WIDE]].forEach(function (a) {
		ls.prefix.node.id = a[1];
		captured = null;
		L.refreshLabelText();
		if (!captured) { throw new Error('no first-fit call captured at ' + a[0]); }
		runs[a[0]] = captured;
	});
	return classify(Collide, runs);
}

// ---- the analysis -----------------------------------------------------------------------------

// The first-fit, re-run offline. **A FULL SCAN, NOT THE GRID**, so the broad phase is excluded by
// construction rather than by argument -- and the agreement count below is what says the model is
// the real thing and not a second opinion about it.
function replay(Collide, cap) {
	const pad = cap.opts.pad > 0 ? cap.opts.pad : 0;
	const obs = { boxes: cap.obstacles.boxes.slice(), segments: cap.obstacles.segments.slice() };
	const order = cap.labels.slice().sort(function (a, b) {
		if (!!b.dragged !== !!a.dragged) { return b.dragged ? 1 : -1; }
		if ((a.priority || 0) !== (b.priority || 0)) { return (b.priority || 0) - (a.priority || 0); }
		return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
	});
	const chosen = {}, snapshots = {}, candidates = {}, deferred = [];
	order.forEach(function (lbl) {
		const sides = lbl.sides && lbl.sides.length ? lbl.sides : [lbl.home];
		// The obstacle list AS IT STOOD when this label was placed. Without it every rejection would
		// be re-tested against the finished drawing, which is not what the pass saw.
		snapshots[lbl.id] = { boxes: obs.boxes.slice(), segments: obs.segments.slice() };
		let pick = -1, pickBox = null, fb = -1, fbBox = null, all = sides;
		// **ROOM TO GROW, REPLAYED** (2026-09-22): a label narrower than its `grow` first stands at
		// the first side whose room is clear, and reserves the room. Asked through the pass's own
		// two functions, so the replay cannot hold a second opinion about it.
		if (lbl.grow > lbl.w && !lbl.dragged) {
			for (let i = 0; i < all.length; i++) {
				const room = Collide.growBoxAt(lbl, all[i]);
				if (!Collide.roomClearOf(room, obs, pad, lbl.id)) { continue; }
				pick = i; pickBox = Collide.labelLineBoxes(lbl, all[i]);
				obs.boxes.push(room);
				break;
			}
			if (pick >= 0) {
				chosen[lbl.id] = pick; candidates[lbl.id] = all;
				pickBox.forEach(function (cb) { obs.boxes.push(cb); });
				return;
			}
		}
		for (let i = 0; i < all.length; i++) {
			const b = Collide.labelLineBoxes(lbl, all[i]);
			const v = lbl.dragged ? 'clear' : Collide.boxesClearOf(b, obs, pad, lbl.id);
			if (v === 'clear') { pick = i; pickBox = b; break; }
			if (v === 'yielding' && fb < 0) { fb = i; fbBox = b; }
		}
		// **SET ASIDE FOR PHASE TWO, exactly as the pass does.** A label with no clear side and no
		// yielding one commits nothing here; it is rescued after everybody else has committed, so
		// it can displace nobody.
		if (pick < 0 && fb < 0 && lbl.widen) { deferred.push(lbl); return; }
		if (pick < 0 && fb >= 0) { pick = fb; pickBox = fbBox; }
		chosen[lbl.id] = pick;
		// The list the index refers to, WIDENING INCLUDED, so a classifier asking "where did the
		// narrow run put this label" can still find the point when that point came from an
		// escalation rather than from `lbl.sides`.
		candidates[lbl.id] = all;
		if (pick >= 0) { pickBox.forEach(function (cb) { obs.boxes.push(cb); }); }
	});
	// **PHASE TWO, REPLAYED TOO** (2026-09-21). The pass no longer drops a label when its ordinary
	// candidates come up empty -- it widens, after everyone else has committed. A replay that did
	// not follow it would disagree with the pass it is modelling, and the agreement count is the
	// whole reason this file is evidence rather than a second opinion.
	deferred.forEach(function (lbl) {
		let all = (lbl.sides && lbl.sides.length ? lbl.sides : [lbl.home]).slice();
		let pick = -1, pickBox = null;
		snapshots[lbl.id] = { boxes: obs.boxes.slice(), segments: obs.segments.slice() };
		for (let level = 1; level <= Collide.WIDEN_MAX_LEVEL && pick < 0; level++) {
			const more = Collide.widenSides(lbl.anchor, lbl.widen.offset, lbl.widen.arcs,
				lbl.widen.outer, level);
			if (!more || !more.length) { break; }
			const from = all.length;
			all = all.concat(more);
			for (let i = from; i < all.length; i++) {
				const b = Collide.labelLineBoxes(lbl, all[i]);
				if (Collide.boxesClearOf(b, obs, pad, lbl.id) === 'clear') { pick = i; pickBox = b; break; }
			}
		}
		chosen[lbl.id] = pick;
		candidates[lbl.id] = all;
		if (pick >= 0) { pickBox.forEach(function (cb) { obs.boxes.push(cb); }); }
	});
	return { chosen: chosen, snapshots: snapshots, candidates: candidates, pad: pad };
}

// Every HARD obstacle in the way of a box stack, with enough about each to say where it is and
// whether it is the same object in the other run. Soft obstacles are left out for the reason
// boxClearOf() leaves them out: a pipe does not block, it is gone round.
function blockersOf(Collide, boxes, obs, pad, ownerId) {
	const seen = {}, out = [];
	boxes.forEach(function (b) {
		const grown = pad > 0 ? Collide.box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a) : b;
		obs.boxes.forEach(function (o, i) {
			if (o.owner !== undefined && o.owner === ownerId) { return; }
			if (o.yields) { return; }
			if (Collide.boxOverlapDepth(grown, o) > 0 && !seen['b' + i]) {
				seen['b' + i] = 1;
				out.push({ idx: 'b' + i, kind: o.kind || 'box', owner: o.owner, o: o });
			}
		});
		obs.segments.forEach(function (o, i) {
			if (o.kind !== 'leader') { return; }
			if (o.owner !== undefined && o.owner === ownerId) { return; }
			if (Collide.segmentInBoxFraction(o, grown) > 0 && !seen['s' + i]) {
				seen['s' + i] = 1;
				out.push({ idx: 's' + i, kind: 'leader', owner: o.owner, o: o });
			}
		});
	});
	return out;
}

// ---- WHY IS ANY LABEL EVER DROPPED, WHEN THERE IS SPACE? (Tom, 2026-09-18) ---------------------
//
// **His words: *"But there is infinite space available. Moving is fine, but dropping is not."*** So
// the question is not how far a label travelled, it is why the pass ever answered "nowhere" on a
// plane that has somewhere. The answer is that the candidate set is bounded THREE ways, and a label
// is dropped the moment those bounds come up empty -- not when the drawing is full:
//
//   RADIUS   nodeFirstFitSpec() passes `outer` = max(3 x the resting offset, 1.5 text heights), and
//            polarCandidates() puts its three rings between the resting offset and that. So nothing
//            beyond three resting offsets from the node is ever proposed, however empty it is.
//   ARC      cardinalSides() rasters inside widestArc(arcs) -- the SINGLE widest gap between the
//            node's own pipes. Every other direction, however open, generates no candidate at all.
//   COUNT    polarCandidates() stops at `max` (24), filling the inner ring first.
//
// This function asks the drawing which of those three bounds actually did it, by re-searching the
// SAME obstacle list the pass had, in three widening regimes. It is a diagnosis, not a proposal:
// nothing here changes a placement.
function firstClearRadius(Collide, lbl, snap, pad, opts) {
	const inner = Math.hypot(lbl.home.x - lbl.anchor.x, lbl.home.y - lbl.anchor.y)
		|| Math.hypot(lbl.w, lbl.h) || 1;
	const maxR = opts.maxOffsets * inner, arc = opts.arc;
	for (let r = inner; r <= maxR + 1e-12; r += inner * 0.25) {
		for (let d = 0; d < 360; d += 10) {
			if (arc) {
				// The same window cardinalSides() rasters in, in the same y-down bearings.
				const a = ((d - arc.start) % 360 + 360) % 360;
				if (a > (arc.end - arc.start)) { continue; }
			}
			const rad = d * Math.PI / 180;
			const c = { x: lbl.anchor.x + r * Math.cos(rad), y: lbl.anchor.y + r * Math.sin(rad) };
			if (Collide.boxesClearOf(Collide.labelLineBoxes(lbl, c), snap, pad, lbl.id) === 'clear') {
				return r / inner;
			}
		}
	}
	return null;
}
// The angular window the raster actually used, recovered from the candidates themselves rather than
// recomputed -- the widest gap between this node's own pipes, as widestArc() chose it. Found as the
// complement of the largest circular gap in the bearings that were generated.
function arcOfCandidates(sides) {
	const degs = sides.filter(function (s) { return typeof s.deg === 'number'; })
		.map(function (s) { return ((s.deg % 360) + 360) % 360; }).sort(function (a, b) { return a - b; });
	if (degs.length < 2) { return null; }
	let gap = -1, at = 0;
	for (let i = 0; i < degs.length; i++) {
		const g = (i === degs.length - 1) ? (degs[0] + 360 - degs[i]) : (degs[i + 1] - degs[i]);
		if (g > gap) { gap = g; at = i; }
	}
	const start = degs[(at + 1) % degs.length];
	return { start: start, end: start + (360 - gap) };
}
// How far, in resting offsets, the real candidate set reached.
function reachOfCandidates(lbl) {
	const inner = Math.hypot(lbl.home.x - lbl.anchor.x, lbl.home.y - lbl.anchor.y)
		|| Math.hypot(lbl.w, lbl.h) || 1;
	let far = 0;
	(lbl.sides || []).forEach(function (s) {
		far = Math.max(far, Math.hypot(s.x - lbl.anchor.x, s.y - lbl.anchor.y));
	});
	return far / inner;
}
// **ONE DROPPED LABEL, DIAGNOSED AGAINST THE THREE BOUNDS, WIDENING ONE AT A TIME.** The order is
// the point: each regime relaxes exactly one thing, so whichever regime first finds room is the
// bound that did it.
function diagnoseDrop(Collide, lbl, snap, pad) {
	const arc = arcOfCandidates(lbl.sides || []), reach = reachOfCandidates(lbl);
	// 1. Its own window and its own reach, sampled DENSELY. The pass had 24 points here; if a dense
	//    sweep of the same ground finds room, the raster simply did not look closely enough.
	const dense = firstClearRadius(Collide, lbl, snap, pad, { maxOffsets: reach, arc: arc });
	if (dense !== null) { return { why: 'the raster RESOLUTION: room inside its own window', at: dense }; }
	// 2. Same reach, every bearing. Room here means the arc window hid open ground.
	const allAng = firstClearRadius(Collide, lbl, snap, pad, { maxOffsets: reach, arc: null });
	if (allAng !== null) { return { why: 'the ARC window: open ground it never looked toward', at: allAng }; }
	// 3. Every bearing, twenty resting offsets out. Room here means only the reach stopped it.
	const far = firstClearRadius(Collide, lbl, snap, pad, { maxOffsets: 20, arc: null });
	if (far !== null) { return { why: 'the RADIUS bound: open ground just beyond its reach', at: far }; }
	return { why: 'genuinely enclosed out to 20 resting offsets', at: null };
}

function classify(Collide, runs) {
	const N = replay(Collide, runs.narrow), W = replay(Collide, runs.wide);
	function agrees(cap, r) {
		let ok = 0, all = 0;
		cap.out.forEach(function (e) {
			all++;
			if (r.chosen[e.id] === (e.dropped ? -1 : e.side)) { ok++; }
		});
		return ok + '/' + all;
	}
	const labN = {}, labW = {};
	runs.narrow.labels.forEach(function (l) { labN[l.id] = l; });
	runs.wide.labels.forEach(function (l) { labW[l.id] = l; });
	// **THE CANDIDATE SET MUST NOT DEPEND ON THE WIDTH**, which is Tom's principle in its purest
	// testable form: where a label may be OFFERED a place cannot be a function of its text.
	let setDiff = 0, hDiff = 0;
	Object.keys(labN).forEach(function (id) {
		const a = labN[id], b = labW[id];
		if (!b) { return; }
		const key = function (l) {
			return JSON.stringify((l.sides || []).map(function (s) { return [s.x, s.y]; }));
		};
		if (key(a) !== key(b)) { setDiff++; }
		if (Math.abs(a.h - b.h) > 1e-9) { hDiff++; }
	});
	const movers = Object.keys(N.chosen).filter(function (id) { return W.chosen[id] !== N.chosen[id]; });
	const tally = { physics: 0, upstream: 0, unclassified: 0 };
	const rows = [], named = [];
	movers.forEach(function (id) {
		const lw = labW[id], ln = labN[id], iN = N.chosen[id];
		// **THE NARROW RUN'S OWN LIST**, not the wide run's: the question is whether the point the
		// narrow text chose is still free at the wider text, and with the widening in the pass that
		// point may have come from an escalation the plain `sides` list does not contain.
		const sides = N.candidates[id] || (lw && lw.sides && lw.sides.length ? lw.sides : (lw ? [lw.home] : null));
		if (!lw || !ln || iN < 0 || !sides || !sides[iN]) {
			tally.unclassified++;
			rows.push([id, 'no comparable candidate at the wider text', '']);
			return;
		}
		const cand = sides[iN], snapW = W.snapshots[id], snapN = N.snapshots[id];
		const wideBoxes = Collide.labelLineBoxes(lw, cand);
		const hitsWide = blockersOf(Collide, wideBoxes, snapW, W.pad, id);
		if (!hitsWide.length) {
			// Its own narrow choice is still free at the wider text, so its own geometry rejected
			// nothing: the divergence is entirely upstream.
			tally.upstream++;
			rows.push([id, 'following a neighbour (its own choice was still free)', '']);
			return;
		}
		const narrowSet = {};
		blockersOf(Collide, Collide.labelLineBoxes(ln, cand), snapW, W.pad, id)
			.forEach(function (h) { narrowSet[h.idx] = 1; });
		// Is the blocker the SAME object in the narrow run? A static obstacle is; a label box that
		// moved is not. Compared against the narrow run's list at the same moment.
		function sameInBoth(h) {
			if (h.idx.charAt(0) === 'b') {
				return snapN.boxes.some(function (o) {
					return Math.abs(o.cx - h.o.cx) < 1e-12 && Math.abs(o.cy - h.o.cy) < 1e-12
						&& Math.abs(o.w - h.o.w) < 1e-12 && Math.abs(o.h - h.o.h) < 1e-12;
				});
			}
			return snapN.segments.some(function (o) {
				return o.kind === 'leader' && Math.abs(o.x1 - h.o.x1) < 1e-12
					&& Math.abs(o.y1 - h.o.y1) < 1e-12 && Math.abs(o.x2 - h.o.x2) < 1e-12;
			});
		}
		// The growth strip: blocks the wide box, does not touch the narrow one at the same
		// candidate, and is the same object in both runs.
		const grew = hitsWide.filter(function (h) { return !narrowSet[h.idx] && sameInBoth(h); });
		if (grew.length) {
			const h = grew[0], dirRight = cand.x >= lw.anchor.x;
			// **THE DIRECTION IS THE WHOLE OF TOM'S ARGUMENT**, so it is asserted and not assumed: a
			// box that grew rightward may only be excused by something to the RIGHT of where it
			// started. Measured from the candidate endpoint, which is where the box hangs from.
			const side = dirRight ? (h.o.cx + h.o.w / 2) - cand.x : cand.x - (h.o.cx - h.o.w / 2);
			if (!(side > 0)) {
				tally.unclassified++;
				rows.push([id, 'blocked by something NOT in the direction it grew',
					h.kind + (h.owner ? ' ' + h.owner : '')]);
				return;
			}
			tally.physics++;
			let depth = 0;
			wideBoxes.forEach(function (b) {
				const grown = W.pad > 0 ? Collide.box(b.cx, b.cy, b.w + 2 * W.pad, b.h + 2 * W.pad, b.a) : b;
				depth = Math.max(depth, Collide.boxOverlapDepth(grown, h.o));
			});
			// **NAMED, because Tom asked for names**: which node, what it hit, which side, how deep.
			named.push({ id: id, hit: h.kind + (h.owner ? ' ' + h.owner : ''),
				side: dirRight ? 'right' : 'left',
				past: Number((side / lw.h).toFixed(2)), deep: Number((depth / lw.h).toFixed(3)) });
			rows.push([id, 'grew into a real object, in the direction it grew',
				h.kind + (h.owner ? ' ' + h.owner : '')
					+ ' ' + (dirRight ? 'right' : 'left') + ' of the endpoint by '
					+ (side / lw.h).toFixed(2) + ' label-heights']);
			return;
		}
		// Everything in the way is a label that had itself moved.
		if (hitsWide.every(function (h) { return !sameInBoth(h); })) {
			tally.upstream++;
			rows.push([id, 'following a neighbour (blocked only by a label that moved)',
				hitsWide[0].kind + (hitsWide[0].owner ? ' ' + hitsWide[0].owner : '')]);
			return;
		}
		// A blocker unchanged between the runs that ALREADY touched the narrow box -- which cannot
		// be, since the narrow run stood there. If it ever happens, the model is wrong and must say
		// so rather than be filed under a comfortable heading.
		tally.unclassified++;
		rows.push([id, 'blocked by an unchanged object that also touched the narrow box', '']);
	});
	// **THE DROPS, AT BOTH WIDTHS.** A drop is the outcome Tom rules out -- *"Moving is fine, but
	// dropping is not"* -- so each one is asked which of the three bounds produced it.
	const drops = {};
	[['narrow', N, labN], ['wide', W, labW]].forEach(function (pair) {
		const r = pair[1], labs = pair[2], list = [];
		Object.keys(r.chosen).forEach(function (id) {
			if (r.chosen[id] >= 0) { return; }
			const lbl = labs[id];
			if (!lbl) { return; }
			const d = diagnoseDrop(Collide, lbl, r.snapshots[id], r.pad);
			list.push({ id: id, why: d.why, at: d.at === null ? null : Number(d.at.toFixed(2)) });
		});
		drops[pair[0]] = list;
	});
	return { agreeN: agrees(runs.narrow, N), agreeW: agrees(runs.wide, W),
		setDiff: setDiff, hDiff: hDiff, total: Object.keys(N.chosen).length,
		movers: movers.length, tally: tally, rows: rows, named: named, drops: drops };
}

// ---- the parent -------------------------------------------------------------------------------

function child(kind, arg, mutation) {
	const args = [__filename, '--child', kind, String(arg)];
	if (mutation) { args.push(mutation); }
	const r = spawnSync(process.execPath, args,
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function assertFixture(f, res, verbose) {
	if (res.error) { report(false, f.tag, res.error); return; }
	const full = res.agreeN === res.total + '/' + res.total && res.agreeW === res.total + '/' + res.total;
	report(full, f.tag + ': the offline replay reproduces the real pass',
		'narrow ' + res.agreeN + ', wide ' + res.agreeW + ' (full scan, no broad-phase grid)');
	report(res.setDiff === 0, f.tag + ': where a label may be OFFERED a place does not read its text',
		res.setDiff + ' of ' + res.total + ' candidate sets differ');
	report(res.hDiff === 0, f.tag + ': only the WIDTH changed',
		res.hDiff + ' of ' + res.total + ' labels also changed height');
	report(res.tally.unclassified === 0,
		f.tag + ': every label that moved is accounted for by a real object or by a neighbour',
		res.movers + ' moved of ' + res.total + ' -- ' + res.tally.physics
			+ ' grew into a real object in the direction they grew, '
			+ res.tally.upstream + ' followed a neighbour, '
			+ res.tally.unclassified + ' unclassified');
	// **THE FOURTEEN, BY NAME.** Tom, 2026-09-18: *"Name names. Tell me which nodes had their labels
	// run into something real."*
	if (res.named.length) {
		console.log('        node        ran into                    side    past the edge   overlap');
		res.named.sort(function (a, b) { return a.id < b.id ? -1 : 1; }).forEach(function (n) {
			console.log('        ' + n.id.padEnd(12) + n.hit.padEnd(28) + n.side.padEnd(8)
				+ (n.past + ' h').padEnd(16) + n.deep + ' h');
		});
	}
	// **A DROP IS THE OUTCOME HE RULES OUT** -- *"Moving is fine, but dropping is not"* -- so it is
	// asserted, and always printed, never only under a flag.
	['narrow', 'wide'].forEach(function (w) {
		const d = res.drops[w];
		const by = {};
		d.forEach(function (e) { by[e.why] = (by[e.why] || 0) + 1; });
		const withRoom = d.filter(function (e) { return e.at !== null; }).length;
		const enclosed = d.length - withRoom;
		report(withRoom <= f.roomCeiling[w],
			f.tag + ' (' + w + '): labels dropped while they still had room',
			withRoom + ' of ' + res.total + ' dropped with room, ceiling ' + f.roomCeiling[w]
				+ '; ' + enclosed + ' genuinely enclosed'
				+ (d.length ? '  -- ' + Object.keys(by).map(function (k) { return by[k] + ' x ' + k; }).join(', ') : ''));
		if (verbose) { d.forEach(function (e) {
			console.log('          ' + e.id.padEnd(14) + e.why + (e.at === null ? '' : '  (room at ' + e.at + ' resting offsets)'));
		}); }
	});
	if (verbose) { res.rows.forEach(function (r) {
		console.log('        ' + r[0].padEnd(14) + r[1] + (r[2] ? '   ' + r[2] : ''));
	}); }
}

function selftest() {
	const f = FIXTURES[0];
	// CAUGHT: the candidate raster's reach keyed on the box width. This is the named suspect
	// "a reach or leader rule keyed on box SIZE", and the set leg is what must fail on it.
	const bad = child(f.kind, f.arg, 'reach-reads-width');
	report(!bad.error && bad.setDiff > 0,
		'selftest: caught -- a candidate reach that reads the label width',
		bad.error ? bad.error : bad.setDiff + ' of ' + bad.total + ' candidate sets differ');
	// CONTROL: every candidate moved by the same constant. The drawing changes and the answer to
	// "does the offer depend on the width" does not.
	const ctl = child(f.kind, f.arg, 'candidates-shifted');
	report(!ctl.error && ctl.setDiff === 0 && ctl.tally.unclassified === 0,
		'selftest: control, not caught -- every candidate shifted by a constant',
		ctl.error ? ctl.error : ctl.setDiff + ' sets differ, ' + ctl.tally.unclassified + ' unclassified');
}

function main() {
	if (process.argv[2] === '--child') {
		const res = runChild(process.argv[3], Number(process.argv[4]), process.argv[5]);
		process.stdout.write('@@JSON@@' + JSON.stringify(res) + '\n', function () { process.exit(0); });
		return;
	}
	console.log('--- for every label that moved, what the wider box hit ---');
	FIXTURES.forEach(function (f) { assertFixture(f, child(f.kind, f.arg), process.argv[2] === '--rows'); });
	selftest();
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();

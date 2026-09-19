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
const FIXTURES = [
	{ tag: 'synthetic crowded', kind: 'synthetic', arg: 100 },
	{ tag: 'Net3-World fit', kind: 'net3', arg: 5000 },
	{ tag: 'Net3-World 2x', kind: 'net3', arg: 12000 }
];
// His own test: the same field, with and without four characters of Before text.
const NARROW = '', WIDE = '1234=';

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
	const chosen = {}, snapshots = {};
	order.forEach(function (lbl) {
		const sides = lbl.sides && lbl.sides.length ? lbl.sides : [lbl.home];
		// The obstacle list AS IT STOOD when this label was placed. Without it every rejection would
		// be re-tested against the finished drawing, which is not what the pass saw.
		snapshots[lbl.id] = { boxes: obs.boxes.slice(), segments: obs.segments.slice() };
		let pick = -1, pickBox = null, fb = -1, fbBox = null;
		for (let i = 0; i < sides.length; i++) {
			const b = Collide.labelLineBoxes(lbl, sides[i]);
			const v = lbl.dragged ? 'clear' : Collide.boxesClearOf(b, obs, pad, lbl.id);
			if (v === 'clear') { pick = i; pickBox = b; break; }
			if (v === 'yielding' && fb < 0) { fb = i; fbBox = b; }
		}
		if (pick < 0 && fb >= 0) { pick = fb; pickBox = fbBox; }
		chosen[lbl.id] = pick;
		if (pick >= 0) { pickBox.forEach(function (cb) { obs.boxes.push(cb); }); }
	});
	return { chosen: chosen, snapshots: snapshots, pad: pad };
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
	const rows = [];
	movers.forEach(function (id) {
		const lw = labW[id], ln = labN[id], iN = N.chosen[id];
		const sides = lw && lw.sides && lw.sides.length ? lw.sides : (lw ? [lw.home] : null);
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
	return { agreeN: agrees(runs.narrow, N), agreeW: agrees(runs.wide, W),
		setDiff: setDiff, hDiff: hDiff, total: Object.keys(N.chosen).length,
		movers: movers.length, tally: tally, rows: rows };
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

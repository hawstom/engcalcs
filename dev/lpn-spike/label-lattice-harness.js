// HOW IS THE ENDLESS STACK POSSIBLE? THE LATTICE MEASURED AGAINST THE BOX. Run with:
//
//   node dev/lpn-spike/label-lattice-harness.js
//   LPN_WIDE_AFFIX=12345678 node dev/lpn-spike/label-lattice-harness.js
//   node dev/lpn-spike/label-lattice-harness.js --selftest    (mutations; must go red)
//
// **TOM, 2026-09-21, having been handed the mechanism as though it were a defence:** *"Clearly this
// is a bug. But you say it without batting an eyelash. If you don't understand why it's a bug, ask
// me. If you do, fix it. I'm just grateful that magically this endless stack happened so that I know
// it's possible; We just have to find out how it's possible and empower that."*
//
// He is right. The narrow case working is the EXISTENCE PROOF that a correct layout is available on
// that drawing; the wide case failing is the algorithm declining to find it. So this file does not
// explain -- it MEASURES the lattice a node label is offered, and puts the numbers beside the box
// that is being placed into it.
//
// **THE ONE QUANTITY IT EXISTS TO PRINT is the cloud-to-box ratio**: the diameter of the whole
// candidate cloud a node label is offered, divided by the width of the box being placed. When it is
// comfortably above 1 the offered places are genuinely DIFFERENT places and the labels tile; when it
// falls below 1 every candidate puts the box in very nearly the same place, so a node with 28
// candidates really has about one, and the pass is choosing between 28 spellings of the same answer.
//
// Nothing here changes a placement. Section 20 of dev/label-placement-algorithms.md is the record.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '../../');
const ROOTJS = path.join(ROOT, 'js/lpn-collide.js');

const NARROW = '', WIDE = process.env.LPN_WIDE_AFFIX || '1234=';

// **THE RATCHET IS ON THE DIAGNOSIS, NOT ON THE DRAWING.** These are the measured cloud-to-box
// ratios, which were 8.04 narrow against 2.19 wide before the reach took a floor in box widths and
// are 8.04 against 8.00 after. They may RISE and may not FALL. An LPN_WIDE_AFFIX override prints
// its own numbers and holds the same floors, because the whole point is that the ratio no longer
// depends on how long the string is.
const FIXTURES = [
	{ tag: 'Net3-World fit', arg: 5000, floor: { narrow: 7.5, wide: 7.5 } },
	{ tag: 'Net3-World 2x', arg: 12000, floor: { narrow: 7.5, wide: 7.5 } }
];

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// The mutations the selftest uses, made in the SOURCE through the stub's own `mutate` hook, for the
// reason label-width-stability-harness.js records: the page calls these through its own closure.
const MUTATIONS = {
	// CAUGHT: the WIDTH-BLIND LATTICE PUT BACK -- the reach as it stood before 2026-09-21, floored
	// on the symbol alone. This is the defect itself, so every leg above must go red on it.
	'blind-lattice': function (src) {
		return src.replace(
			'labelBoxWidth(ne) * LPN_NODE_REACH_BOX_WIDTHS),',
			'0),');
	},
	// CONTROL: a finer angle step, so MORE candidates are generated at both widths and none of them
	// moves a radius. The drawing changes and the ratio does not, so the fix must still read as
	// present. A part that fails everything asserts nothing.
	'finer-angles': function (src) {
		return src.replace(
			'rings: rings, max: 8 * rings,',
			'rings: rings, max: 20 * rings, angleStep: 10,');
	}
};

function runChild(arg, mutationName) {
	const stub = require('./lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet } = stub;
	const Collide = require(ROOTJS).lpnCollide;
	let captured = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		const out = realFF.call(this, labels, obstacles, opts);
		captured = { labels: JSON.parse(JSON.stringify(labels)), out: JSON.parse(JSON.stringify(out)) };
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
	L.applySaved(JSON.parse(fs.readFileSync(
		path.join(__dirname, '../water-network-examples/Net3-Novato-CA-World.lwn'), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, which is his own test case: one row of text, so the affix is the only thing
	// that can change the box, and nothing can shed.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	const doc = L.getDoc();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;
	if (!L.setView({ cx: cx, cy: cy, s: arg })) { throw new Error('view refused'); }
	const runs = {};
	[['narrow', NARROW], ['wide', WIDE]].forEach(function (a) {
		ls.prefix.node.id = a[1];
		captured = null;
		L.refreshLabelText();
		if (!captured) { throw new Error('no first-fit call captured at ' + a[0]); }
		runs[a[0]] = measure(Collide, captured);
	});
	return runs;
}

// ---- the measurement --------------------------------------------------------------------------

function median(a) {
	if (!a.length) { return 0; }
	const s = a.slice().sort(function (x, y) { return x - y; });
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// For ONE node label: the geometry of the lattice it is offered, and the box it is asked to put in
// it. Every number is in world units, the same units the boxes are in.
function measureOne(Collide, lbl) {
	const sides = (lbl.sides && lbl.sides.length) ? lbl.sides : [lbl.home];
	let far = 0;
	const near = [];
	for (let i = 0; i < sides.length; i++) {
		far = Math.max(far, Math.hypot(sides[i].x - lbl.anchor.x, sides[i].y - lbl.anchor.y));
		// Nearest-neighbour distance among the offered endpoints: "the spacing between spots", which
		// is the quantity Tom's own explanation named and nobody had ever measured.
		let best = Infinity;
		for (let j = 0; j < sides.length; j++) {
			if (j === i) { continue; }
			best = Math.min(best, Math.hypot(sides[i].x - sides[j].x, sides[i].y - sides[j].y));
		}
		if (isFinite(best)) { near.push(best); }
	}
	// **HOW MANY SPOTS DOES ONE BOX POISON?** Standing at candidate i, count the other candidates
	// whose box for a label of THIS size would overlap the box at i. That is the sentence "a wide
	// label occupies spots it is not standing on", as a number. Averaged over the candidates.
	let poison = 0;
	for (let i = 0; i < sides.length; i++) {
		const bi = Collide.labelBoxAtEnd(lbl, sides[i]);
		let hit = 0;
		for (let j = 0; j < sides.length; j++) {
			if (j === i) { continue; }
			if (Collide.boxOverlapDepth(bi, Collide.labelBoxAtEnd(lbl, sides[j])) > 0) { hit++; }
		}
		poison += hit;
	}
	poison = sides.length ? poison / sides.length : 0;
	// **EVERY LENGTH IS REPORTED IN LABEL HEIGHTS**, never in world units: this drawing is
	// geographic, so a world unit is a DEGREE and every number would print as 0.0. A label height is
	// the one length on the page a reader already has a feel for.
	const H = lbl.h > 0 ? lbl.h : 1;
	return {
		id: lbl.id, w: lbl.w / H, h: 1, n: sides.length,
		cloud: 2 * far / H,                   // the diameter of the whole offered cloud
		spacing: median(near) / H,            // the typical distance between neighbouring spots
		ratio: lbl.w > 0 ? (2 * far) / lbl.w : 0,
		reach: far / H,
		poison: poison,
		// How many of the 28 offered places are genuinely DISTINCT for a box this size: cluster the
		// candidates so that two whose boxes overlap by more than half are one place.
		distinct: distinctPlaces(Collide, lbl, sides)
	};
}

// Two candidates are the SAME PLACE for this box when their boxes overlap by more than half the box
// width -- a reader would not call them different positions. Union-find over that relation, so a
// node with 28 candidates and one real place reports 1.
function distinctPlaces(Collide, lbl, sides) {
	const parent = sides.map(function (_, i) { return i; });
	function root(x) { while (parent[x] !== x) { x = parent[x] = parent[parent[x]]; } return x; }
	const boxes = sides.map(function (c) { return Collide.labelBoxAtEnd(lbl, c); });
	for (let i = 0; i < sides.length; i++) {
		for (let j = i + 1; j < sides.length; j++) {
			const dx = Math.abs(boxes[i].cx - boxes[j].cx), dy = Math.abs(boxes[i].cy - boxes[j].cy);
			if (dx < lbl.w * 0.5 && dy < lbl.h * 0.5) {
				const a = root(i), b = root(j);
				if (a !== b) { parent[a] = b; }
			}
		}
	}
	const seen = {};
	let k = 0;
	for (let i = 0; i < sides.length; i++) { const r = root(i); if (!seen[r]) { seen[r] = 1; k++; } }
	return k;
}

function measure(Collide, cap) {
	const rows = cap.labels.map(function (l) { return measureOne(Collide, l); });
	const drawn = {};
	cap.out.forEach(function (o) { drawn[o.id] = !o.dropped; });
	const ratios = rows.map(function (r) { return r.ratio; });
	return {
		total: rows.length,
		hidden: cap.out.filter(function (o) { return o.dropped; }).length,
		medRatio: median(ratios),
		minRatio: Math.min.apply(null, ratios),
		medW: median(rows.map(function (r) { return r.w; })),
		medCloud: median(rows.map(function (r) { return r.cloud; })),
		medSpacing: median(rows.map(function (r) { return r.spacing; })),
		medPoison: median(rows.map(function (r) { return r.poison; })),
		medReach: median(rows.map(function (r) { return r.reach; })),
		medDistinct: median(rows.map(function (r) { return r.distinct; })),
		medN: median(rows.map(function (r) { return r.n; })),
		// The histogram Tom was offered and never given: how many labels sit in each band of the
		// cloud-to-box ratio.
		bands: [0.25, 0.5, 1, 2, 4].map(function (b, i, a) {
			const lo = i ? a[i - 1] : 0;
			return { lo: lo, hi: b, n: ratios.filter(function (r) { return r > lo && r <= b; }).length };
		}).concat([{ lo: 4, hi: Infinity, n: ratios.filter(function (r) { return r > 4; }).length }]),
		// Every label whose whole offered cloud is narrower than its own box, named: for these the
		// 28 candidates are 28 spellings of one place.
		starved: rows.filter(function (r) { return r.ratio < 1; })
			.sort(function (a, b) { return a.ratio - b.ratio; })
			.map(function (r) {
				return { id: r.id, w: Number(r.w.toFixed(1)), cloud: Number(r.cloud.toFixed(1)),
					ratio: Number(r.ratio.toFixed(2)), distinct: r.distinct, n: r.n,
					drawn: !!drawn[r.id] };
			})
	};
}

// ---- glue ------------------------------------------------------------------------------------

function child(arg, mutation) {
	const args = [__filename, '--child', String(arg)];
	if (mutation) { args.push(mutation); }
	const r = spawnSync(process.execPath, args,
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

function show(tag, w, m) {
	console.log('    ' + (tag + ' / ' + w).padEnd(26)
		+ 'box ' + m.medW.toFixed(2).padStart(6)
		+ '   cloud ' + m.medCloud.toFixed(2).padStart(6)
		+ '   spacing ' + m.medSpacing.toFixed(2).padStart(5)
		+ '   cloud/box ' + m.medRatio.toFixed(2).padStart(5)
		+ '   spots ' + String(m.medN).padStart(3)
		+ ' -> distinct ' + String(m.medDistinct).padStart(2)
		+ '   poisoned ' + m.medPoison.toFixed(1).padStart(5)
		+ '   hidden ' + m.hidden + '/' + m.total);
}

function assertFixture(f, res, verbose) {
	if (res.error) { report(false, f.tag, res.error); return; }
	['narrow', 'wide'].forEach(function (w) { show(f.tag, w, res[w]); });
	// **THE FIX, AS AN ASSERTION: a wide label is offered geometrically the SAME search a narrow one
	// gets.** Until 2026-09-21 the cloud was IDENTICAL at both widths -- 11.95 label-heights for a
	// 1.49 box and for a 5.45 one -- so the ratio collapsed from 8.04 to 2.19 and the wide label ran
	// out of lattice rather than out of plane. The floor on the reach makes both ratios 8, so the
	// two legs below are the defect inverted: the ratio must SURVIVE the widening, and the cloud
	// must DIFFER because it now reads the box.
	report(res.narrow.medRatio >= f.floor.narrow,
		f.tag + ': narrow labels are offered a cloud wider than the box they place',
		'median cloud/box ' + res.narrow.medRatio.toFixed(2) + ', floor ' + f.floor.narrow);
	report(res.wide.medRatio >= f.floor.wide,
		f.tag + ': a wide label is offered the same hunting ground in its own box widths',
		'median cloud/box ' + res.wide.medRatio.toFixed(2) + ', floor ' + f.floor.wide);
	report(res.wide.medCloud > res.narrow.medCloud * 1.5,
		f.tag + ': the lattice READS the box -- a wider box is offered a wider cloud',
		res.narrow.medCloud.toFixed(2) + ' against ' + res.wide.medCloud.toFixed(2));
	report(res.wide.medDistinct >= res.narrow.medDistinct,
		f.tag + ': a wide label has at least as many genuinely different places as a narrow one',
		res.narrow.medDistinct + ' against ' + res.wide.medDistinct);
	console.log('        cloud/box histogram (wide):  '
		+ res.wide.bands.map(function (b) {
			return (b.hi === Infinity ? '>' + b.lo : b.lo + '-' + b.hi) + ': ' + b.n;
		}).join('   '));
	if (verbose && res.wide.starved.length) {
		console.log('        labels whose whole offered cloud is narrower than their own box:');
		res.wide.starved.slice(0, 40).forEach(function (s) {
			console.log('          ' + s.id.padEnd(14) + 'box ' + String(s.w).padStart(6)
				+ '  cloud ' + String(s.cloud).padStart(6) + '  ratio ' + String(s.ratio).padStart(5)
				+ '  ' + s.n + ' spots -> ' + s.distinct + ' distinct   '
				+ (s.drawn ? 'drawn' : 'HIDDEN'));
		});
	}
}

function selftest() {
	const f = FIXTURES[0];
	// CAUGHT: the width-blind lattice restored. The clouds become identical and the wide ratio
	// collapses, which is exactly the defect.
	const bad = child(f.arg, 'blind-lattice');
	report(!bad.error && Math.abs(bad.narrow.medCloud - bad.wide.medCloud) < 1e-6
		&& bad.wide.medRatio < f.floor.wide,
		'selftest: caught -- the width-blind lattice put back',
		bad.error ? bad.error : 'clouds ' + bad.narrow.medCloud.toFixed(2) + '/' + bad.wide.medCloud.toFixed(2)
			+ ', wide ratio ' + bad.wide.medRatio.toFixed(2));
	// CONTROL: the candidate window nudged at both widths. The drawing changes; the ratio does not.
	const ctl = child(f.arg, 'finer-angles');
	report(!ctl.error && ctl.wide.medRatio >= f.floor.wide && ctl.narrow.medRatio >= f.floor.narrow,
		'selftest: control, not caught -- a finer angle step at both widths',
		ctl.error ? ctl.error : ctl.narrow.medRatio.toFixed(2) + ' against ' + ctl.wide.medRatio.toFixed(2));
}

function main() {
	if (process.argv[2] === '--child') {
		const res = runChild(Number(process.argv[3]), process.argv[4]);
		process.stdout.write('@@JSON@@' + JSON.stringify(res) + '\n', function () { process.exit(0); });
		return;
	}
	console.log('--- the lattice a node label is offered, measured against the box it must place ---');
	console.log('    affix: "' + (WIDE || '(none)') + '"   (LPN_WIDE_AFFIX to change)');
	FIXTURES.forEach(function (f) { assertFixture(f, child(f.arg), process.argv[2] !== '--quiet'); });
	selftest();
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();

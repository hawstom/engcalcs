// NO EMPTY SLOTS IN A GANG, NO RUNAWAY LEADERS, AND A PASS THAT COSTS WHAT IT SHOULD (R-338, R-351).
// Run with:
//
//   node dev/lpn-spike/label-gang-gap-harness.js
//
// **TOM, 2026-09-27** (R-338): *"There appears to be serious breakage afoot with no other explanation
// than 'Text and symbol sizes got bigger'. Can you do a deeper inquiry into what broke label
// placement, and why it now takes 5 times as long as before with apparently worse results?"* And
// on his browser pass (R-351), of the Novato southwest with P, Qb and Z on: a descending gang of
// stacked labels, 185 down to 177, with an empty gap about one text row tall between members, which
// he circled four times -- *"gratuitous spacing, and you know that the delay is far worse than
// before."*
//
// **WHAT WAS MEASURED, IN A REAL CHROME, before anything was changed** (the scripts are not kept;
// the numbers are in dev/label-placement-algorithms.md §22):
//   * The gaps were the leader slide's lattice. Its step was written as "a quarter text height" and
//     computed as a quarter of the LABEL's height, so on a four-row label each step was a whole row
//     and a label below another stopped up to a row short of it -- R-108's defect (a lattice blind to
//     the size of what it places) back in a pass written after R-108 was closed. The slide now finds
//     the exact edge of the clear ground (refineAlong() in js/lpn-collide.js).
//   * The time was the gang repair: 6.9 s of a 9.3 s pass at this view, asking every trial about
//     every label in a neighbourhood as wide as a whole column of the gang, four times a pass (the
//     crossing shed's rungs re-run the layout). Two bucket grids now hand each test only what lies
//     beside it; the layouts are byte-identical and the repair is 3-4x cheaper.
//   * What the slide still leaves open is the room a label reserves for a longer ID (R-075). It now
//     reserves that room on the ID row only, which is the row that grows; the gaps it still holds
//     are counted separately from empty slots, by a second run that slides by the text alone.
//   * Text 11 -> 12 and master's symbol cap explained part of the time, not most: the branch before
//     its merge already asked 10-25x master's placement tests at these views, and the bigger sizes
//     multiplied the most crowded ones by a further 3-7x (more rescues, bigger gangs).
//
// It asserts, on the gallery's Net3-Novato-CA-World with ID, elevation, base demand and pressure on,
// centred on node 179 at the zooms of his screenshot (1.5x and 1.75x of the fit):
//   1. no EMPTY GANG SLOT: of two drawn labels on near-parallel leaders stacked one above the other, the gap
//      between them is under GAP_ROWS text rows unless something (a label, a node symbol, a pipe)
//      stands in it;
//   2. the longest leader stays under a measured ceiling, in TEXT ROWS (not label heights, which is
//      what earlier harnesses divided by);
//   3. the pass at the crowded view asks no more than a measured ceiling of placement tests -- a
//      count, not milliseconds, because milliseconds swing 2-3x with whatever else the machine is
//      running and the count does not move at all;
//   4. the crossing shed breaks a tie on rank and degree by the id alone: the longest-leader rule
//      is gone (Tom, R-339: *"No."*).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const FILE = 'Net3-Novato-CA-World.lwn';
const FIELDS = ['id', 'elev', 'demand', 'pressure'];
const CENTER = '179';
const ZOOMS = [1.5, 1.75];
const OPEN_ZOOM = 3;
// A gap this many text rows or more between two stacked labels, with nothing standing in it, is an
// empty slot. The slide now stops within an eighth of a row of whatever it meets, plus the pad.
const GAP_ROWS = 0.6;
const PARALLEL_DEG = 20;
// Gaps the ID's reserve holds open, per view: a ratchet, may fall, may not rise. See main().
// Measured 2026-09-27: none at 1.5x; at 1.75x 183/40, 189/185 and 251/247, each 1.1-1.6 rows, and
// each closes when the slide ignores the reserve -- at the price of R-075 (a longer ID then moves a
// label at 4x). Which of the two Tom wants is his call; this holds the count where it is.
const RESERVE_CEILING = { 1.5: 0, 1.75: 3 };
// Longest leader, in text rows, may fall and may not rise. Measured 2026-09-27: 12.6 and 15.4 (the
// branch before R-338: 13.7 and 21.1). The ceiling is the measurement plus a tenth.
const LONGEST_CEILING = { 1.5: 14, 1.75: 17 };
// Placement tests per pass (see loadCountingCollide()). BEFORE is the branch at d8afdd5f, measured
// by this harness against that commit's js/lpn-collide.js; the ceiling is the fixed pass plus 20%.
const WORK_BEFORE = { 1.5: 3490569, 1.75: 5810676 };
const WORK_CEILING = { 1.5: 1680000, 1.75: 2790000 };

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// **THE COST IS COUNTED, NOT TIMED.** Every placement test in js/lpn-collide.js comes down to three
// primitives -- a box on a box, a segment through a box, two segments crossing -- so the number of
// times they are asked is a deterministic measure of a pass's work that the machine's load cannot
// move. The counters are added to a private copy of the module's source before anything requires
// it, so the shipped file is what is measured and nothing in it knows it is being counted.
// `noReserve` is the diagnostic run: the leader slide judges each label by its text alone, with no
// room held for a longer ID. A gap that closes there and not in the shipped run is the ID's reserve
// (R-075) at work, and is reported as that rather than as an empty slot.
function loadCountingCollide(noReserve) {
	const Module = require('module');
	const file = require.resolve(path.join(__dirname, '../../js/lpn-collide.js'));
	let src = fs.readFileSync(file, 'utf8');
	[['\tfunction boxOverlapDepth(A, B) {\n'], ['\tfunction segmentInBoxFraction(seg, b) {\n'], ['\tfunction segmentsCross(p, q) {\n']].forEach(function (a) {
		if (src.indexOf(a[0]) < 0) { throw new Error('label-gang-gap-harness: re-aim the work counter at ' + a[0]); }
		src = src.replace(a[0], a[0] + '\t\tglobal.__lgWork++;\n');
	});
	if (noReserve) {
		const from = 'sp = slideRoomSpec(sp0, r);';
		if (src.indexOf(from) < 0) { throw new Error('label-gang-gap-harness: re-aim the no-reserve run'); }
		src = src.replace(from, 'sp = sp0;');
	}
	global.__lgWork = 0;
	const m = new Module(file, module);
	m.filename = file;
	m.paths = Module._nodeModulePaths(path.dirname(file));
	m._compile(src, file);
	m.loaded = true;
	require.cache[file] = m;
}

async function runChild(noReserve) {
	loadCountingCollide(noReserve);
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(path.join(__dirname, '../../js/lpn-collide.js')).lpnCollide;
	let specs = null, obs = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		specs = labels; obs = obstacles;
		return realFF.call(this, labels, obstacles, opts);
	};
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
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; }, linkPointList: linkPointList,\n" +
		"\t\tnodeAt: nodeAt, nodeLabelPos: nodeLabelPos, nodeLabelKey: nodeLabelKey",
		null);
	L.buildLayers();
	L.setCanvas(1400, 900);
	const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../../examples', FILE), 'utf8'));
	if (saved.settings) { saved.settings.labelMaxWidth = null; }
	L.applySaved(saved);
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = FIELDS.indexOf(k) >= 0; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	await stub.warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await stub.settleEpanet();
	L.zoomExtent();
	const sFit = L.scale(), doc = L.getDoc();
	const c = L.nodeAt(doc.nodes.find(function (n) { return n.id === CENTER; }));
	const segs = [];
	doc.links.forEach(function (l) {
		const p = L.linkPointList(l);
		for (let i = 1; i < p.length; i++) { segs.push(Collide.segment(p[i - 1].x, p[i - 1].y, p[i].x, p[i].y, 'link')); }
	});
	function pass(z) {
		L.setView({ cx: c.x, cy: c.y, s: sFit * z * 1.0001 });
		L.refreshLabelText();
		L.setView({ cx: c.x, cy: c.y, s: sFit * z });
		global.__lgWork = 0;
		const t0 = process.hrtime.bigint();
		L.refreshLabelText();
		lastWork = global.__lgWork;
		return Number(process.hrtime.bigint() - t0) / 1e6;
	}
	let lastWork = 0;
	const out = { zooms: [] };
	// Warm once so the first timed pass is not charged the JIT.
	pass(OPEN_ZOOM);
	out.openMs = pass(OPEN_ZOOM);
	ZOOMS.forEach(function (z) {
		const ms = pass(z), work = lastWork;
		const spec = {};
		specs.forEach(function (l) { spec[l.id] = l; });
		const nodeEls = L.nodeEls(), drawn = [], row = L.settings().textSize * 1.2 / L.scale();
		const half = { w: 700 / L.scale(), h: 450 / L.scale() };
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id], sp = spec[L.nodeLabelKey(n.id)];
			if (!ne || !sp || ne.hiddenDropped || ne.hiddenCrossed) { return; }
			const a = L.nodeAt(n), e = L.nodeLabelPos(n);
			if (Math.abs(a.x - c.x) > half.w || Math.abs(a.y - c.y) > half.h) { return; }
			const bs = Collide.labelLineBoxes(sp, e);
			let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
			bs.forEach(function (b) {
				x0 = Math.min(x0, b.cx - b.w / 2); x1 = Math.max(x1, b.cx + b.w / 2);
				y0 = Math.min(y0, b.cy - b.h / 2); y1 = Math.max(y1, b.cy + b.h / 2);
			});
			const len = Math.hypot(e.x - a.x, e.y - a.y);
			drawn.push({ id: n.id, x0: x0, y0: y0, x1: x1, y1: y1, lead: len / row, ang: Math.round(Math.atan2(a.y - e.y, a.x - e.x) * 180 / Math.PI),
				leadered: len > 1e-12 && ne.leader && ne.leader.style.display !== 'none' });
		});
		const symbols = obs.boxes.filter(function (o) { return o.kind === 'symbol'; });
		function rectHits(r) {
			const q = Collide.box((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, r.x1 - r.x0, r.y1 - r.y0);
			if (drawn.some(function (d) { return d.x0 < r.x1 && r.x0 < d.x1 && d.y0 < r.y1 && r.y0 < d.y1 && d !== r.a && d !== r.b; })) { return 'label'; }
			if (symbols.some(function (o) { return Collide.boxOverlapDepth(q, o) > 0; })) { return 'symbol'; }
			if (segs.some(function (g) { return Collide.segmentInBoxFraction(g, q) > 0; })) { return 'pipe'; }
			return null;
		}
		const empty = [];
		const lb = drawn.filter(function (d) { return d.leadered; });
		lb.forEach(function (A) {
			let best = null;
			lb.forEach(function (B) {
				if (A === B) { return; }
				const xo = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0);
				if (xo < 0.5 * Math.min(A.x1 - A.x0, B.x1 - B.x0)) { return; }
				// A GANG is labels on near-parallel leaders stacked one above the other (Tom, R-318:
				// "a stack of labels with long and parallel leaders"). Two labels whose leaders run
				// PARALLEL_DEG or more apart are not a stack, and the ground between them is not a slot
				// either could close by moving toward its own node -- measured, every such pair on this
				// view is two labels at their resting corners or leaving at different angles.
				let da = Math.abs(A.ang - B.ang) % 360;
				if (da > 180) { da = 360 - da; }
				if (da >= PARALLEL_DEG) { return; }
				const g = B.y0 - A.y1;
				if (g < -0.01 * row || g > 2.5 * row) { return; }
				if (!best || g < best.g) { best = { B: B, g: g }; }
			});
			if (!best || best.g < GAP_ROWS * row) { return; }
			const r = { x0: Math.max(A.x0, best.B.x0), x1: Math.min(A.x1, best.B.x1), y0: A.y1, y1: best.B.y0, a: A, b: best.B };
			if (!rectHits(r)) { empty.push({ pair: A.id + '/' + best.B.id, text: A.id + '/' + best.B.id + ' ' + (best.g / row).toFixed(2) + ' rows' }); }
		});
		out.zooms.push({ zoom: z, ms: ms, work: work, drawn: drawn.length, leadered: lb.length, empty: empty,
			max: drawn.reduce(function (m, d) { return Math.max(m, d.lead); }, 0) });
	});
	return out;
}

// 4. The crossing shed's tie-break, asked directly: two labels of equal rank, each in one crossing
// with the other, so rank and degree tie. The one with the LONGER leader has the SMALLER id, so a
// longest-leader rule and the id rule disagree about which goes.
function tieBreak() {
	const Collide = require(path.join(__dirname, '../../js/lpn-collide.js')).lpnCollide;
	const seg = Collide.segment, box = Collide.box;
	// Leaders cross at (5,5): 'a' runs from (0,0) to a far label at (30,30); 'b' from (10,0) to (0,10).
	const a = { id: 'a', boxes: [box(34, 30, 8, 2)], leader: seg(0, 0, 30, 30, 'leader', 'a'), hideable: true, rank: 2 };
	const b = { id: 'b', boxes: [box(-4, 10, 8, 2)], leader: seg(10, 0, 0, 10, 'leader', 'b'), hideable: true, rank: 2 };
	const r = Collide.shedCrossingSurvivors([a, b]);
	report(r.before === 1, 'tie fixture: the two leaders form one crossing', 'before ' + r.before);
	report(r.hidden.length === 1 && r.hidden[0] === 'b',
		'a tie on rank and degree is broken by the id, not by the longer leader (R-339)',
		'hid ' + JSON.stringify(r.hidden) + ' (a has the longer leader; b the later id)');
}

async function main() {
	if (process.argv[2] === '--child') {
		const out = await runChild(process.argv[3] === 'noreserve');
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	console.log('--- gang gaps, leaders and pass cost: ' + FILE + ', fields ' + FIELDS.join('+') + ', centred on node ' + CENTER + ' ---');
	function child(mode) {
		const r = spawnSync(process.execPath, [__filename, '--child', mode],
			{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 900000 });
		const m = /@@JSON@@(.*)/.exec(r.stdout || '');
		if (!m) { report(false, 'the ' + mode + ' run', (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ')); return null; }
		return JSON.parse(m[1]);
	}
	const out = child('shipped'), diag = child('noreserve');
	if (out && diag) {
		out.zooms.forEach(function (z, zi) {
			// A shipped gap between two labels that the no-reserve run does NOT leave between the
			// same two is held open by the ID's reserve; one it leaves too is an empty slot.
			const also = diag.zooms[zi].empty.map(function (e) { return e.pair; });
			const emptySlots = z.empty.filter(function (e) { return also.indexOf(e.pair) >= 0; }),
				held = z.empty.filter(function (e) { return also.indexOf(e.pair) < 0; });
			console.log('    x' + z.zoom + '  drawn ' + z.drawn + ' (' + z.leadered + ' on leaders), longest leader '
				+ z.max.toFixed(1) + ' rows, ' + z.work + ' placement tests, ' + Math.round(z.ms) + ' ms (' + Math.round(out.openMs) + ' ms at x' + OPEN_ZOOM + ')');
			report(emptySlots.length === 0, 'x' + z.zoom + ': no empty slot between stacked labels on leaders',
				emptySlots.map(function (e) { return e.text; }).join(', '));
			report(held.length <= RESERVE_CEILING[z.zoom], 'x' + z.zoom + ': gaps held open by the ID\'s room to grow (R-075), against the ratchet',
				held.length + ' (ceiling ' + RESERVE_CEILING[z.zoom] + ')' + (held.length ? ': ' + held.map(function (e) { return e.text; }).join(', ') : ''));
			report(z.max <= LONGEST_CEILING[z.zoom], 'x' + z.zoom + ': the longest leader against the ceiling',
				z.max.toFixed(1) + ' rows (ceiling ' + LONGEST_CEILING[z.zoom] + ')');
			report(z.work <= WORK_CEILING[z.zoom], 'x' + z.zoom + ': the pass\'s placement tests against the ceiling',
				z.work + ' (ceiling ' + WORK_CEILING[z.zoom] + '; ' + WORK_BEFORE[z.zoom] + ' before R-338)');
		});
	}
	tieBreak();
	console.log('\nlabel-gang-gap-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main();

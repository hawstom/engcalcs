// SLIDE TOWARD THE NODE: LEADERS GET SHORTER AND NOTHING NEW TOUCHES (ROADMAP Task 539). Run with:
//
//   node dev/lpn-spike/label-slide-harness.js
//
// **TOM, 2026-09-22**, on the northwest of the Novato world example with three properties on and
// zoomed in (his three properties plus the ID: elevation, demand, pressure), two labels (nodes 120 and 257) parked up and left of their nodes with empty ground
// between: *"A human would have slid the two labels at A toward B, shortening the leaders without
// any bad effects. Could our algorithm be smart enough not to be gratuitously distant like this?"*
//
// Collide.slideTowardAnchors() is the answer. This drives the whole page -- a real document, a real
// EPANET solve so the demand and pressure rows exist, the real content pass -- twice: as shipped,
// and with the slide's result thrown away (the mutation, through the stub's own source hook). It
// asserts the three things his sentence contains:
//
//   1. the leaders get SHORTER, overall and on the two labels he pointed at;
//   2. "without any bad effects": no drawn node label box touches another drawn label box, a node
//      symbol or another label's leader any more often than it did without the slide;
//   3. no fewer labels are drawn (a swap of WHICH one of an already-crossing pair is hidden is
//      printed, and allowed -- see the assertion).
//
// It also prints the wall time of the content pass both ways, for his R-076.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const FILE = 'Net3-Novato-CA-World.lwn';
const FIELDS = (process.env.LPN_FIELDS || 'id,elev,demand,pressure').split(',');
// He wrote "120, 25x": 257 was the first reading, and 251 is the other label in that corner parked
// far from its node (28 text heights at 2x before the second slide pass), so both are held.
const HIS = ['120', '251', '257'];
// THE LONGEST LEADER, as a ratchet (text heights, may fall, may not rise). Measured 2026-09-22 after
// the slide took the nearest clear spot rather than the nearest reachable one and went round until
// nothing moved: 28.0 -> 19.1 at 2x and 23.8 -> 4.8 at 3x. The one-pass stepping slide gave 28.0 and
// 10.1, so this is the assertion that fails if either change is undone.
const LONGEST_CEILING = { 2: 19.2, 3: 4.9 };
const ZOOMS = (process.env.LPN_ZOOMS || '2,3').split(',').map(Number);

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

const NO_SLIDE = function (src) {
	const from = 'nodePlaced = slide.results;';
	if (src.indexOf(from) < 0) { throw new Error('label-slide-harness: re-aim NO_SLIDE'); }
	return src.replace(from, 'slide.results = null;');
};

async function runChild(noSlide) {
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(path.join(__dirname, '../../js/lpn-collide.js')).lpnCollide;
	let specs = null, obs = null, pad = 0;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		specs = labels; obs = obstacles; pad = (opts && opts.pad) || 0;
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
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tnodeAt: nodeAt, nodeLabelPos: nodeLabelPos, nodeLabelKey: nodeLabelKey",
		null, noSlide ? NO_SLIDE : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples', FILE), 'utf8')));
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
	const at = doc.nodes.filter(function (n) { return HIS.indexOf(n.id) >= 0; });
	let cx = 0, cy = 0;
	at.forEach(function (n) { const p = L.nodeAt(n); cx += p.x; cy += p.y; });
	cx /= at.length; cy /= at.length;
	const out = [];
	ZOOMS.forEach(function (z) {
		if (!L.setView({ cx: cx, cy: cy, s: sFit * z })) { return; }
		const t0 = process.hrtime.bigint();
		L.refreshLabelText();
		const ms = Number(process.hrtime.bigint() - t0) / 1e6;
		const spec = {};
		specs.forEach(function (l) { spec[l.id] = l; });
		const nodeEls = L.nodeEls(), drawn = [];
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id], sp = spec[L.nodeLabelKey(n.id)];
			if (!ne || !sp || ne.hiddenDropped || ne.hiddenCrossed) { return; }
			const a = L.nodeAt(n), e = L.nodeLabelPos(n);
			drawn.push({ id: n.id, sp: sp, a: a, e: e, lead: Math.hypot(e.x - a.x, e.y - a.y) / sp.h,
				boxes: Collide.labelLineBoxes(sp, e),
				leader: Collide.segment(a.x, a.y, e.x, e.y, 'leader', sp.id) });
		});
		// Every contact a drawn node label makes: another label's box, a node symbol that is not its
		// own, another label's leader through its box.
		let touch = 0;
		drawn.forEach(function (p) {
			p.boxes.forEach(function (b) {
				obs.boxes.forEach(function (o) {
					if (o.kind !== 'symbol') { return; }
					if (Math.abs(p.a.x - o.cx) <= o.w / 2 && Math.abs(p.a.y - o.cy) <= o.h / 2) { return; }
					if (Collide.boxOverlapDepth(b, o) > 0) { touch++; }
				});
				drawn.forEach(function (q) {
					if (q === p) { return; }
					q.boxes.forEach(function (c) { if (Collide.boxOverlapDepth(b, c) > 0) { touch++; } });
					if (Collide.segmentInBoxFraction(q.leader, b) > 0 && q.lead * q.sp.h > 1e-12) { touch++; }
				});
			});
		});
		const his = {};
		drawn.forEach(function (p) { if (HIS.indexOf(p.id) >= 0) { his[p.id] = p.lead; } });
		out.push({ zoom: z, drawn: drawn.map(function (p) { return p.id; }), touch: touch, his: his,
			mean: drawn.reduce(function (m, p) { return m + p.lead; }, 0) / Math.max(1, drawn.length),
			max: drawn.reduce(function (m, p) { return Math.max(m, p.lead); }, 0), ms: ms });
	});
	return out;
}

function child(noSlide) {
	const r = spawnSync(process.execPath, [__filename, '--child', noSlide ? 'off' : 'on'],
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

async function main() {
	if (process.argv[2] === '--child') {
		const out = await runChild(process.argv[3] === 'off');
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	console.log('--- slide toward the node: ' + FILE + ', fields ' + FIELDS.join('+') + ', centred on nodes ' + HIS.join(' and ') + ' ---');
	const on = child(false), off = child(true);
	if (on.error || off.error) { report(false, 'both runs', on.error || off.error); }
	else {
		on.forEach(function (a, i) {
			const b = off[i], f = function (v) { return v === undefined ? '-' : v.toFixed(1); };
			console.log('    x' + a.zoom + '  mean leader ' + f(b.mean) + ' -> ' + f(a.mean) + ' h, longest ' + f(b.max)
				+ ' -> ' + f(a.max) + ' h; ' + HIS.map(function (id) { return id + ' ' + f(b.his[id]) + ' -> ' + f(a.his[id]); }).join(', ')
				+ ' h; contacts ' + b.touch + ' -> ' + a.touch + '; drawn ' + b.drawn.length + ' -> ' + a.drawn.length
				+ '; pass ' + Math.round(b.ms) + ' -> ' + Math.round(a.ms) + ' ms');
			report(a.mean <= b.mean, 'x' + a.zoom + ': the leaders get no longer overall', f(b.mean) + ' -> ' + f(a.mean) + ' h');
			if (LONGEST_CEILING[a.zoom] !== undefined) {
				report(a.max <= LONGEST_CEILING[a.zoom], 'x' + a.zoom + ': the longest leader against the ratchet',
					f(a.max) + ' h (ceiling ' + LONGEST_CEILING[a.zoom] + ')');
			}
			report(a.touch <= b.touch, 'x' + a.zoom + ': the slide adds no contact with a label, a symbol or a leader',
				b.touch + ' -> ' + a.touch);
			// COUNTED, not per label: a slide never creates a crossing (a shorter leader is a piece
			// of the longer one), but it can change which of two labels ALREADY crossing is the one
			// the crossing shed hides, because the shed breaks ties on leader length. Measured at 2x:
			// node 171's leader already ran through 179's box; 171 got shorter, so 179 is hidden
			// where 171 was. The swaps are printed so a reader sees them.
			const lost = b.drawn.filter(function (id) { return a.drawn.indexOf(id) < 0; }),
				gained = a.drawn.filter(function (id) { return b.drawn.indexOf(id) < 0; });
			report(a.drawn.length >= b.drawn.length, 'x' + a.zoom + ': no fewer labels are drawn',
				b.drawn.length + ' -> ' + a.drawn.length + (lost.length ? '; swapped: hid ' + lost.join(' ') + ', showed ' + gained.join(' ') : ''));
			HIS.forEach(function (id) {
				if (b.his[id] === undefined || a.his[id] === undefined) { return; }
				report(a.his[id] <= b.his[id], 'x' + a.zoom + ': node ' + id + '\'s leader is no longer than before',
					f(b.his[id]) + ' -> ' + f(a.his[id]) + ' h');
			});
		});
	}
	if (!on.error && !off.error) {
		// HIS CASE, WHICH IS WHY THIS FILE EXISTS: at least one of the two labels he pointed at must
		// actually come nearer, or the slide is a pass that runs and does nothing where it was asked.
		const nearer = on.some(function (a, i) {
			return HIS.some(function (id) { return a.his[id] !== undefined && off[i].his[id] !== undefined && a.his[id] < off[i].his[id] - 0.1; });
		});
		report(nearer, 'his two labels: at least one comes measurably nearer its node');
	}
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

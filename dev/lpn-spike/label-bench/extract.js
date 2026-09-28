// LABEL BENCH: SCENE EXTRACTOR. Regenerates scenes/*.json (and master/*.json, the layouts the
// shipped page drew for the same views) from the REAL app, headlessly. Run with:
//
//   node dev/lpn-spike/label-bench/extract.js            (every public scene set)
//   node dev/lpn-spike/label-bench/extract.js --judges   (the judges' prefixed sets as well)
//   node dev/lpn-spike/label-bench/extract.js --only novato-zoom
//
// The page is js/looped-network.js evaluated against dev/lpn-spike/lpn-dom-stub.js, exactly as
// label-crossing-measure.js loads it: the example is opened, solved through the vendored EPANET
// engine, and refreshLabelText() -- the page's own content-and-layout pass -- is run at each view.
// Geometry and label rows are then read off the page and converted to VIEW pixels.
//
// ONE SCENE SET PER CHILD PROCESS: a second document loaded into a page that already holds one
// inherits its elements' measured widths and label state (label-crossing-measure.js says why).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const EXAMPLES = path.join(HERE, '../../water-network-examples');
const CANVAS = { w: 1400, h: 900 };
const NOVATO = 'Net3-Novato-CA-World.lwn';
const NOVATO_NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'];   // P, Qb, Z (and the ID)
const SEQ_CENTER = '179';
const SEQ_MULTS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];

// Every scene set the bench ships. `views` is 'saved' (the view the file opens on), 'zooms'
// (fit then 2x, 4x, 8x about the node centroid) or 'seq' (a zoom sequence about one node).
const SETS = [
	{ id: 'net1', file: 'Net1.lwn', views: 'saved' },
	{ id: 'net2', file: 'Net2.lwn', views: 'saved' },
	{ id: 'net3', file: 'Net3.lwn', views: 'saved' },
	{ id: 'novato-zoom', file: NOVATO, views: 'zooms', nodeFields: NOVATO_NODE_FIELDS },
	{ id: 'novato-seq', file: NOVATO, views: 'seq', nodeFields: NOVATO_NODE_FIELDS }
];
const JUDGE_SETS = [
	{ id: 'novato-zoom-12345678', file: NOVATO, views: 'zooms', nodeFields: NOVATO_NODE_FIELDS,
		prefix: '12345678', judges: true },
	{ id: 'novato-seq-12345678', file: NOVATO, views: 'seq', nodeFields: NOVATO_NODE_FIELDS,
		prefix: '12345678', judges: true }
];

function r2(v) { return Math.round(v * 100) / 100; }

async function extractSet(set) {
	const stub = require('../lpn-dom-stub.js');
	const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;
	// The last obstacle set runLabelCollisionAvoidance() handed its ring pass: by then the Text
	// boxes, their callout lines and every stationed (aligned) pipe label are on it.
	let lastObs = null;
	const realRing = Collide.placeLabels;
	Collide.placeLabels = function (labels, obs, opts) { lastObs = obs; return realRing.call(this, labels, obs, opts); };

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
		"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
		"\t\tstate: function () { return state; },\n" +
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; },\n" +
		"\t\tlabelEls: function () { return labelEls; },\n" +
		"\t\tnodeAt: nodeAt, nodeRadius: nodeRadius, linkPointList: linkPointList,\n" +
		"\t\tlinkLabelMid: function (l) { return linkLabelMid(l); }, nodeLabelPos: nodeLabelPos,\n" +
		"\t\tlinkLabelPos: linkLabelPos, nodeById: nodeById,\n" +
		"\t\tpumpSymbolSize: pumpSymbolSize, effectiveFontSize: function () { return effectiveFontSize(); },\n" +
		"\t\tlabelSeparator: labelSeparator, linkLabelAligned: linkLabelAligned,\n" +
		"\t\tlabelRank: labelRank, linkLabelStations: linkLabelStations"
	);
	L.buildLayers();
	L.setCanvas(CANVAS.w, CANVAS.h);
	const saved = JSON.parse(fs.readFileSync(path.join(EXAMPLES, set.file), 'utf8'));
	// **THE FILE'S LABELING THRESHOLD IS CLEARED.** Net3 (30) and Novato (65000) carry one that
	// hides every label at the views measured here; a bench of empty views measures nothing.
	if (saved.settings) { saved.settings.labelMaxWidth = null; }
	const savedView = saved.view;
	L.applySaved(saved);
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	if (set.nodeFields) {
		Object.keys(ls.node).forEach(function (k) { ls.node[k] = set.nodeFields.indexOf(k) >= 0; });
	}
	ls.prefix = ls.prefix || {}; ls.prefix.node = ls.prefix.node || {};
	if (set.prefix) { ls.prefix.node.id = set.prefix; }

	await warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await settleEpanet();

	const doc = L.getDoc(), settings = L.settings();
	const textPx = settings.textSize;
	// **TEXT IS MEASURED THE WAY EVERY HEADLESS HARNESS MEASURES IT**: lpn-dom-stub.js's nominal
	// advance, CHAR_W = 6 px per character at BASE_FS = 11 px, scaled with the text size (x1.12
	// bold, which data labels are not). It is not a font metric; it is the app's own headless one.
	const CHAR_W = 6, BASE_FS = 11;
	function textW(s) { return s.length ? s.length * CHAR_W * textPx / BASE_FS : 0; }
	const rowH = textPx * 1.2;

	// The user's drop order per kind: lowest Drop number first; a field with none goes first of all
	// (linkFieldRank()'s rule). ID is never in it -- it is the label.
	function dropOrder(group) {
		const pr = (ls.priority && ls.priority[group]) || {};
		return Object.keys(ls[group] || {}).filter(function (f) { return ls[group][f] && f !== 'id'; })
			.sort(function (a, b) {
				const ra = typeof pr[a] === 'number' ? pr[a] : -Infinity;
				const rb = typeof pr[b] === 'number' ? pr[b] : -Infinity;
				return ra - rb || (a < b ? -1 : 1);
			});
	}

	function views() {
		if (set.views === 'saved') {
			return [{ tag: 'open', v: savedView }];
		}
		L.zoomExtent();
		const sFit = L.state().s;
		if (set.views === 'zooms') {
			let cx = 0, cy = 0;
			doc.nodes.forEach(function (n) { const p = L.nodeAt(n); cx += p.x; cy += p.y; });
			cx /= doc.nodes.length; cy /= doc.nodes.length;
			return [1, 2, 4, 8].map(function (m) {
				return { tag: m === 1 ? 'fit' : m + 'x', mult: m, v: { cx: cx, cy: cy, s: sFit * m } };
			});
		}
		const c = L.nodeAt(L.nodeById(SEQ_CENTER));
		return SEQ_MULTS.map(function (m) {
			return { tag: m + 'x', mult: m, v: { cx: c.x, cy: c.y, s: sFit * m } };
		});
	}

	const steps = [], masters = [];
	views().forEach(function (vw) {
		if (!L.setView(vw.v)) { throw new Error(set.id + ': view refused ' + JSON.stringify(vw.v)); }
		L.refreshLabelText();
		// Timed on a SECOND pass over the same view: the first in a process carries the JIT. The
		// layout is a pure function of the view (label-stability-harness.js holds that), so the
		// second pass draws what the first did.
		const t0 = process.hrtime.bigint();
		L.refreshLabelText();
		const masterMs = Number(process.hrtime.bigint() - t0) / 1e6;
		const st = L.state(), s = st.s, tx = st.tx, ty = st.ty;
		const V = function (p) { return { x: r2(p.x * s + tx), y: r2(p.y * s + ty) }; };
		const inView = function (p) { return p.x >= 0 && p.y >= 0 && p.x <= CANVAS.w && p.y <= CANVAS.h; };
		const fsWorld = L.effectiveFontSize();
		const nodeEls = L.nodeEls(), linkEls = L.linkEls(), labelEls = L.labelEls();
		const scene = {
			id: set.id + '@' + vw.tag, set: set.id, step: steps.length, source: set.file,
			viewport: { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
			view: { s: s, tx: tx, ty: ty, note: 'view px = model * s + t (model = the app draw frame, y down)' },
			text: { sizePx: textPx, rowHeightPx: r2(rowH), separator: L.labelSeparator(),
				separatorW: r2(textW(L.labelSeparator())), hookMaxPx: r2(rowH) },
			dropOrder: { node: dropOrder('node'), link: dropOrder('link'), customer: [] },
			nodes: [], links: [], texts: [], customers: [], labels: []
		};
		if (vw.mult) { scene.zoom = vw.mult; }

		doc.nodes.forEach(function (n) {
			const p = V(L.nodeAt(n)), r = L.nodeRadius(n) * s;
			scene.nodes.push({ id: String(n.id), type: n.type, x: p.x, y: p.y,
				symbol: { x: r2(p.x - r), y: r2(p.y - r), w: r2(2 * r), h: r2(2 * r) } });
		});
		doc.links.forEach(function (l) {
			const pts = L.linkPointList(l).map(V);
			const rec = { id: String(l.id), type: l.type, from: String(l.from), to: String(l.to),
				points: pts.map(function (p) { return [p.x, p.y]; }), symbols: [], arrows: [] };
			if (l.type === 'pump' || l.type === 'valve') {
				// positionPumpSymbol(): centred between the END nodes, turned to the from->to line.
				const a = pts[0], b = pts[pts.length - 1], sz = L.pumpSymbolSize(l.type) * s;
				rec.symbols.push({ cx: r2((a.x + b.x) / 2), cy: r2((a.y + b.y) / 2), w: r2(sz), h: r2(sz),
					angle: r2(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI) });
			}
			const le = linkEls[l.id];
			(le && le.arrows || []).forEach(function (ar) {
				if (ar.style.display === 'none') { return; }
				const m = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\) scale\(([-0-9.e]+)\)/
					.exec(ar.getAttribute('transform') || '');
				if (!m) { return; }
				const c = V({ x: +m[1], y: +m[2] }), k = +m[4] * s;
				rec.arrows.push({ cx: c.x, cy: c.y, w: r2(1.6 * k), h: r2(1.6 * k), angle: r2(+m[3]) });
			});
			scene.links.push(rec);
		});
		// Text objects: fixed boxes (oriented) and their callout lines, off the obstacle set the
		// pass itself used (staticObstacles() pushes them in doc.labels order).
		const textBoxes = [], textLeaders = {};
		((lastObs && lastObs.boxes) || []).forEach(function (b) {
			if (b.kind === 'label' && b.textOwner !== undefined) { textBoxes.push(b); }
		});
		((lastObs && lastObs.segments) || []).forEach(function (g) {
			if (g.kind === 'leader' && g.textOwner !== undefined) { textLeaders[g.textOwner] = g; }
		});
		textBoxes.forEach(function (b) {
			const lb = doc.labels.find(function (x) { return x.id === b.textOwner; }) || {};
			const c = V({ x: b.cx, y: b.cy }), g = textLeaders[b.textOwner];
			const t = { id: String(b.textOwner), text: String(lb.text || ''),
				box: { cx: c.x, cy: c.y, w: r2(b.w * s), h: r2(b.h * s), angle: r2(b.a || 0) } };
			if (g) {
				const a = V({ x: g.ax, y: g.ay }), e = V({ x: g.bx, y: g.by });
				t.leader = [[a.x, a.y], [e.x, e.y]];
			}
			scene.texts.push(t);
		});

		// ---- labels requested, and what master drew for each -----------------------------------
		const out = {};
		function rowsOf(lines) {
			return (lines || []).map(function (ln) {
				return { field: ln.field || 'id', text: String(ln.text), w: r2(textW(String(ln.text))), h: r2(rowH) };
			});
		}
		function shownIdx(all, shown) {
			const used = {};
			return (shown || []).map(function (ln) {
				for (let i = 0; i < all.length; i++) {
					if (!used[i] && all[i].field === (ln.field || 'id') && all[i].text === String(ln.text)) { used[i] = 1; return i; }
				}
				for (let i = 0; i < all.length; i++) {
					if (!used[i] && all[i].field === (ln.field || 'id')) { used[i] = 1; return i; }
				}
				return -1;
			}).filter(function (i) { return i >= 0; }).sort(function (a, b) { return a - b; });
		}
		function leaderOf(h) {
			const e = h && h.leader;
			if (!e || e.style.display === 'none' || e.style.visibility === 'hidden') { return null; }
			const a = V({ x: +e.getAttribute('x1'), y: +e.getAttribute('y1') }),
				b = V({ x: +e.getAttribute('x2'), y: +e.getAttribute('y2') });
			if (![a.x, a.y, b.x, b.y].every(isFinite)) { return null; }
			return [[a.x, a.y], [b.x, b.y]];
		}
		function shown(h) { return !!h && !!h.text && h.text.style.visibility !== 'hidden'; }

		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || !ne.allLines || !ne.allLines.length) { return; }
			const anchor = V(L.nodeAt(n));
			if (!inView(anchor)) { return; }
			const rows = rowsOf(ne.allLines), id = 'n:' + n.id;
			const lab = { id: id, owner: String(n.id), kind: 'node', anchor: anchor, rows: rows,
				layout: 'stack', hand: null };
			if (n.lx !== undefined) {
				const b = L.nodeAt(n);
				lab.hand = V({ x: b.x + n.lx, y: b.y + (n.ly || 0) });
			}
			scene.labels.push(lab);
			if (!shown(ne)) { out[id] = { shown: false }; return; }
			const idx = shownIdx(rows, ne.lines);
			const end = V(L.nodeLabelPos(n)), W = Math.max.apply(null, idx.map(function (i) { return rows[i].w; }).concat([0]));
			const right = ne.side !== 'left';
			out[id] = { shown: true, rows: idx, layout: 'stack', align: right ? 'left' : 'right',
				x: r2(right ? end.x : end.x - W), y: r2(end.y - fsWorld * 0.85 * s), leader: leaderOf(ne) };
		});
		// Stationed (aligned / repeated) pipe labels reach the drawing as obstacle boxes stamped
		// with linkOwner, in station order.
		const stationBoxes = {};
		((lastObs && lastObs.boxes) || []).forEach(function (b) {
			if (b.linkOwner === undefined) { return; }
			(stationBoxes[b.linkOwner] = stationBoxes[b.linkOwner] || []).push(b);
		});
		doc.links.forEach(function (l) {
			const le = linkEls[l.id];
			if (!le || !le.allLines || !le.allLines.length) { return; }
			const anchor = V(L.linkLabelMid(l));
			if (!inView(anchor)) { return; }
			const rows = rowsOf(le.allLines), id = 'l:' + l.id, dragged = l.lx !== undefined;
			const lab = { id: id, owner: String(l.id), kind: 'link', anchor: { x: anchor.x, y: anchor.y },
				rows: rows, layout: dragged ? 'stack' : 'line', hand: null };
			if (dragged) {
				const m = L.linkLabelMid(l);
				lab.hand = V({ x: m.x + l.lx, y: m.y + (l.ly || 0) });
			}
			scene.labels.push(lab);
			if (!shown(le)) { out[id] = { shown: false }; return; }
			const idx = shownIdx(rows, le.lines), boxes = stationBoxes[l.id];
			const lineW = idx.reduce(function (a, i) { return a + rows[i].w; }, 0) + Math.max(0, idx.length - 1) * textW(L.labelSeparator());
			if (boxes && boxes.length) {
				const place = function (b) {
					const c = V({ x: b.cx, y: b.cy });
					return { x: r2(c.x - lineW / 2), y: r2(c.y - rowH / 2), angle: r2(b.a || 0), align: 'center' };
				};
				const first = place(boxes[0]);
				out[id] = { shown: true, rows: idx, layout: 'line', align: 'center', x: first.x, y: first.y,
					angle: first.angle, leader: null };
				if (boxes.length > 1) { out[id].repeats = boxes.slice(1).map(place); }
				return;
			}
			const end = V(L.linkLabelPos(l)), right = le.side !== 'left';
			const layout = dragged ? 'stack' : 'line';
			const W = layout === 'line' ? lineW : Math.max.apply(null, idx.map(function (i) { return rows[i].w; }).concat([0]));
			out[id] = { shown: true, rows: idx, layout: layout, align: right ? 'left' : 'right',
				x: r2(right ? end.x : end.x - W), y: r2(end.y - fsWorld * 0.85 * s), leader: leaderOf(le) };
		});
		steps.push(scene);
		masters.push({ id: scene.id, ms: r2(masterMs), labels: out });
	});
	return { set: { id: set.id, source: set.file, canvas: CANVAS, steps: steps },
		master: { set: set.id, note: 'The layout the shipped page drew for each step, read off the page after refreshLabelText(); ms is that pass on the node DOM stub.', steps: masters } };
}

function writeJson(file, obj) {
	fs.writeFileSync(file, JSON.stringify(obj, null, 0).replace(/\},\{"id"/g, '},\n{"id"') + '\n');
}

async function main() {
	const args = process.argv.slice(2);
	if (args[0] === '--child') {
		const set = SETS.concat(JUDGE_SETS).find(function (x) { return x.id === args[1]; });
		const res = await extractSet(set);
		const sceneDir = set.judges ? path.join(HERE, 'judges/scenes') : path.join(HERE, 'scenes');
		const masterDir = set.judges ? path.join(HERE, 'judges/master') : path.join(HERE, 'master');
		writeJson(path.join(sceneDir, set.id + '.json'), res.set);
		writeJson(path.join(masterDir, set.id + '.json'), res.master);
		const n = res.set.steps.map(function (s) { return s.labels.length; }).join('/');
		// Exit explicitly: the vendored EPANET engine leaves a handle open.
		process.stdout.write(set.id + ': ' + res.set.steps.length + ' step(s), labels ' + n + '\n', function () { process.exit(0); });
		return;
	}
	const only = args.indexOf('--only') >= 0 ? args[args.indexOf('--only') + 1] : null;
	const sets = SETS.concat(args.indexOf('--judges') >= 0 || only ? JUDGE_SETS : [])
		.filter(function (x) { return !only || x.id === only; });
	let bad = 0;
	sets.forEach(function (set) {
		const r = spawnSync(process.execPath, [__filename, '--child', set.id],
			{ encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 900000 });
		if (r.status !== 0) { bad++; console.log('FAILED ' + set.id + '\n' + (r.stderr || '').split('\n').slice(0, 20).join('\n')); return; }
		process.stdout.write(r.stdout);
	});
	process.exit(bad ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

// HIS SCREENSHOT, MEASURED: one label showing only `P=` on a long leader with open ground beside
// it (Tom, 2026-09-22, `_label-mystery.PNG`): *"a strange example where (a) we could have had all
// requested properties and (b) we could have had a shorter leader."*
//
// A PROBE, NOT A HARNESS -- it asserts nothing and is not in check_all.sh. It prints, per node
// label of the Novato world example with his three properties on:
//
//   * how many of its lines survived, and the value shed cascade's rung-by-rung story: which
//     labels placeLabelsFirstFit() dropped on each rung, and therefore which labels were enlisted
//     to give a value up (the dropped label AND every label standing on ground it could have used);
//   * the drawn leader length in text heights;
//   * whether the label is drawn at all.
//
// Run with:  node dev/lpn-spike/label-mystery-probe.js [zoom...]

'use strict';

const path = require('path');
const fs = require('fs');

const FILE = 'Net3-Novato-CA-World.lwn';
const FIELDS = (process.env.LPN_FIELDS || 'id,demand,pressure').split(',');
const ZOOMS = (process.argv.slice(2).filter(function (a) { return /^[0-9.]+$/.test(a); })
	.map(Number));
const USE = ZOOMS.length ? ZOOMS : [2, 4];
const WIDEN = process.env.LPN_WIDEN === '1';

async function run() {
	const stub = require('./lpn-dom-stub.js');
	const Collide = require(path.join(__dirname, '../../js/lpn-collide.js')).lpnCollide;
	let specs = null, obs = null, ffCalls = [];
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obstacles, opts) {
		const out = realFF.call(this, labels, obstacles, opts);
		specs = labels; obs = obstacles;
		ffCalls.push(out.filter(function (r) { return r.dropped; })
			.map(function (r) { return r.id.slice(2); }));
		return out;
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
		null, WIDEN ? function (src) {
			const from = 'var labelWidenSearch = false;';
			if (src.indexOf(from) < 0) { throw new Error('re-aim the widen mutation'); }
			return src.replace(from, 'var labelWidenSearch = true;');
		} : undefined
	);
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
	const sFit = L.scale(), doc = L.getDoc(), nodeEls = L.nodeEls();

	// THE SOUTHWEST CORNER of the drawing, which is the ground his screenshot is of.
	let x0 = Infinity, y0 = -Infinity;
	doc.nodes.forEach(function (n) {
		const p = L.nodeAt(n);
		x0 = Math.min(x0, p.x); y0 = Math.max(y0, p.y);
	});
	let cx = 0, cy = 0, k = 0;
	doc.nodes.forEach(function (n) {
		const p = L.nodeAt(n);
		if (p.x < x0 + (Math.abs(x0) * 0 + 1) * 1e9) { /* placeholder */ }
	});
	// Centre on the 20 nodes nearest the southwest corner.
	const sw = doc.nodes.map(function (n) {
		const p = L.nodeAt(n);
		return { n: n, p: p, d: Math.hypot(p.x - x0, p.y - y0) };
	}).sort(function (a, b) { return a.d - b.d; }).slice(0, 20);
	sw.forEach(function (s) { cx += s.p.x; cy += s.p.y; k++; });
	cx /= k; cy /= k;

	USE.forEach(function (z) {
		ffCalls = [];
		if (!L.setView({ cx: cx, cy: cy, s: sFit * z })) { return; }
		L.refreshLabelText();
		const spec = {};
		specs.forEach(function (l) { spec[l.id] = l; });
		console.log('\n=== ' + FILE + '  fields ' + FIELDS.join('+') + '  zoom x' + z
			+ (WIDEN ? '  widen MUTATED ON' : '') + ' ---');
		console.log('  first-fit calls this pass (dropped ids per call, the shed cascade rungs):');
		ffCalls.forEach(function (d, i) {
			console.log('    call ' + (i + 1) + ': ' + (d.length ? d.length + ' dropped -- ' + d.join(' ') : 'none dropped'));
		});
		const rows = [];
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id], sp = spec[L.nodeLabelKey(n.id)];
			if (!ne || ne.empty || !ne.allLines) { return; }
			const a = L.nodeAt(n), e = L.nodeLabelPos(n),
				h = sp ? sp.h : 1,
				lead = Math.hypot(e.x - a.x, e.y - a.y) / h;
			rows.push({ id: n.id,
				kept: ne.lines ? ne.lines.length : 0, all: ne.allLines.length,
				lead: lead,
				hid: !!(ne.hiddenDropped || ne.hiddenCrossed),
				why: ne.hiddenDropped ? 'dropped' : (ne.hiddenCrossed ? 'crossed' : ''),
				text: '' });
		});
		const shed = rows.filter(function (r) { return r.kept < r.all && !r.hid; });
		console.log('  labels drawn: ' + rows.filter(function (r) { return !r.hid; }).length
			+ '/' + rows.length + '; hidden ' + rows.filter(function (r) { return r.hid; }).length
			+ '; shedding a value while drawn: ' + shed.length);
		console.log('  the shedders, worst first:');
		shed.sort(function (p, q) { return (p.kept - p.all) - (q.kept - q.all) || q.lead - p.lead; })
			.forEach(function (r) {
				console.log('    ' + r.id + '  ' + r.kept + '/' + r.all + ' lines, leader '
					+ r.lead.toFixed(1) + ' h   [' + r.text + ']');
			});
		console.log('  the longest leaders:');
		rows.filter(function (r) { return !r.hid; })
			.sort(function (p, q) { return q.lead - p.lead; }).slice(0, 10)
			.forEach(function (r) {
				console.log('    ' + r.id + '  leader ' + r.lead.toFixed(1) + ' h, '
					+ r.kept + '/' + r.all + ' lines   [' + r.text + ']');
			});
		const hid = rows.filter(function (r) { return r.hid; });
		if (hid.length) {
			console.log('  hidden: ' + hid.map(function (r) { return r.id + '(' + r.why + ')'; }).join(' '));
		}
	});
}

run().catch(function (e) { console.error(e); process.exit(1); });

// WHAT THE 2026-09-26 MASTER MERGE CHANGED ABOUT THE LABELS, MEASURED (R-290). Run with:
//
//   node dev/lpn-spike/label-merge-attribution-measure.js
//
// Not a harness: it asserts nothing and run_harnesses.sh does not run it. It reproduces the table
// behind R-290 so the next reader does not have to rebuild it. Every row is label-drop-order's own
// count (Net3-Novato-CA-World, fields id+demand+pressure, the southwest of the drawing) at 2x and
// 3x of a fit scale, varying ONE thing at a time:
//
//   drawing  old = the example as it stood on the branch before the merge (text 11, link width 6,
//                  no "Zoom in to see labels" Text); new = master's example (text 12, link width 4,
//                  that Text on at every zoom). Either way the labeling threshold is cleared.
//   fit      old = 5373.8, the fit the branch's ratchets were measured at; new = what zoom to fit
//                  gives now. The harnesses' "2x" is 2x of whichever fit they get.
//   cap      old = the symbol cap before d039bb13 (10th-percentile pipe); new = master's rule.
//
// Measured 2026-09-26 (shed / hidden / values shown of 284 at 2x; shed / hidden at 3x):
//   old drawing, old fit, old cap   22 / 4 / 242   4 / 2   <- the branch as it stood (3 / 1 at 3x
//                                                            before the merge; the rest of master)
//   old drawing, old fit, new cap   57 / 4 / 208   4 / 2   <- master's cap alone
//   new drawing, new fit, old cap   77 / 1 / 188  18 / 0   <- master's drawing alone
//   new drawing, new fit, new cap   72 / 7 / 176  18 / 0   <- the merge as it stands
// The third row is the branch's own pre-merge code on the drawing users now see: the old ratchets
// (22 and 3) were never reachable on it.

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync, execFileSync } = require('child_process');

const FILE = 'Net3-Novato-CA-World.lwn';
const OLD_SHA = '0346dc5d';      // the branch's last commit before the merge
const OLD_FIT = 5373.828557;
const FIELDS = ['id', 'demand', 'pressure'];

const OLD_CAP = function (src) {
	const a = 'var lp = pLinkLengthWorld(symbolCapPercentile()), capLen = symbolCapMultiple() * lp;';
	const b = 'return settings.linkWidth / symbolScaleAt();';
	if (src.indexOf(a) < 0 || src.indexOf(b) < 0) { throw new Error('label-merge-attribution-measure: re-aim OLD_CAP'); }
	return src.replace(a, 'var lp = pLinkLengthWorld(10), capLen = lp;')
		.replace(b, 'return settings.linkWidth / (state.s || 1);');
};

async function runChild(drawing, fit, cap) {
	const stub = require('./lpn-dom-stub.js');
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
		"\t\tnodeAt: nodeAt",
		null, cap === 'old' ? OLD_CAP : undefined);
	L.buildLayers();
	L.setCanvas(1400, 900);
	const text = drawing === 'old'
		? execFileSync('git', ['show', OLD_SHA + ':dev/water-network-examples/' + FILE], { cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
		: fs.readFileSync(path.join(__dirname, '../water-network-examples', FILE), 'utf8');
	const saved = JSON.parse(text);
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
	const sFit = fit === 'old' ? OLD_FIT : L.scale(), doc = L.getDoc(), nodeEls = L.nodeEls();
	// The southwest of the drawing, chosen exactly as label-drop-order-harness.js chooses it.
	let x0 = Infinity, y0 = -Infinity;
	doc.nodes.forEach(function (n) { const p = L.nodeAt(n); x0 = Math.min(x0, p.x); y0 = Math.max(y0, p.y); });
	const sw = doc.nodes.map(function (n) {
		const p = L.nodeAt(n); return { p: p, d: Math.hypot(p.x - x0, p.y - y0) };
	}).sort(function (a, b) { return a.d - b.d; }).slice(0, 20);
	let cx = 0, cy = 0;
	sw.forEach(function (s) { cx += s.p.x; cy += s.p.y; });
	cx /= sw.length; cy /= sw.length;
	return [2, 3].map(function (z) {
		L.setView({ cx: cx, cy: cy, s: sFit * z });
		L.refreshLabelText();
		let hidden = 0, shed = 0, lines = 0;
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (!ne || ne.empty || !ne.allLines) { return; }
			if (ne.hiddenDropped || ne.hiddenCrossed) { hidden++; return; }
			const kept = ne.lines ? ne.lines.length : 0;
			lines += kept;
			if (kept < ne.allLines.length) { shed++; }
		});
		return { zoom: z, shed: shed, hidden: hidden, lines: lines, sFit: sFit };
	});
}

function main() {
	if (process.argv[2] === '--child') {
		runChild(process.argv[3], process.argv[4], process.argv[5]).then(function (out) {
			process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		}, function (e) { console.error(e); process.exit(1); });
		return;
	}
	console.log('--- ' + FILE + ', fields ' + FIELDS.join('+') + ': shed / hidden / values shown ---');
	[['old', 'old', 'old'], ['old', 'old', 'new'], ['new', 'new', 'old'], ['new', 'new', 'new']].forEach(function (c) {
		const r = spawnSync(process.execPath, [__filename, '--child'].concat(c),
			{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 900000 });
		const m = /@@JSON@@(.*)/.exec(r.stdout || '');
		const label = 'drawing ' + c[0] + ', fit ' + c[1] + ', cap ' + c[2];
		if (!m) { console.log('  ' + label + ': ERROR ' + (r.stderr || '').split('\n').slice(-4).join(' ')); return; }
		const out = JSON.parse(m[1]);
		console.log('  ' + label + ' (fit ' + out[0].sFit.toFixed(1) + '):  ' + out.map(function (a) {
			return 'x' + a.zoom + ' ' + a.shed + ' / ' + a.hidden + ' / ' + a.lines;
		}).join('   '));
	});
}

main();

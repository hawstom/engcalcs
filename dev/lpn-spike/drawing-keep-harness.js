// A TAB KEEPS ITS DRAWING WHILE YOU LOOK AT ANOTHER ONE (ROADMAP Task 680, the remaining phase).
// Run with:
//   node dev/lpn-spike/drawing-keep-harness.js
//
// Phase 1 (switch-keep-harness.js) kept the solve and the label layout, and a switch still built
// every shape again. Now each open project's drawing is kept hidden and shown again on the way
// back. What must be true, and what this pins:
//   (a) a switch away and back with the document unchanged builds ZERO elements, and no label moves;
//   (b) an edit in the project on screen never touches a drawing kept for another;
//   (c) closing a tab frees its drawing, and the keep is bounded;
// and the guard: a document moved under a hidden tab is rebuilt, never shown stale.

'use strict';
const path = require('path');
const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { setUnitSet, loadLoopedNetwork } = stub;

const L = loadLoopedNetwork(
	// The page's own layer stack (init()): five drawing layers inside the model group.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', { 'class': 'lpn-customers' }, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlinkSymbolLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tnodesLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, right: w, top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\taddNode: addNode, addLink: addLink, getDoc: function () { return doc; },\n" +
	"\t\tnewProject: newProject, openProject: openProject, discardProject: discardProject,\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tsaveToStorage: saveToStorage, applySaved: applySaved, refreshAll: refreshAllFromDocument,\n" +
	"\t\tbuildDom: buildDom, refreshLabelText: refreshLabelText, updateNode: updateNode,\n" +
	"\t\tnodeById: nodeById,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlayers: function () { return { model: modelLayer, nodes: nodesLayer, links: linksLayer,\n" +
	"\t\t\tlabels: labelsLayer, customers: customersLayer, symbols: linkSymbolLayer }; },\n" +
	"\t\tnodeEls: function () { return nodeEls; },\n" +
	"\t\tscale: function () { return state.s; }, zoomAbout: zoomAbout,\n" +
	"\t\tsettleZoom: function () { if (reshedTimer) { clearTimeout(reshedTimer); reshedTimer = null; } reshedNow(); },\n" +
	"\t\trefreshFontSizes: refreshFontSizes, lastLayoutScale: function () { return lastLayoutScale; },\n" +
	"\t\tsizes: function () {\n" +
	"\t\t\tvar s = state.s, px = function (v) { return Math.round(parseFloat(v) * s * 1e4) / 1e4; }, out = {};\n" +
	"\t\t\tObject.keys(nodeEls).forEach(function (id) { var h = nodeEls[id];\n" +
	"\t\t\t\tout['n:' + id] = [px(h.circle.r), h.text && h.text.style.fontSize ? px(h.text.style.fontSize) : null]; });\n" +
	"\t\t\tObject.keys(linkEls).forEach(function (id) { var h = linkEls[id];\n" +
	"\t\t\t\tout['l:' + id] = h.text && h.text.style.fontSize ? px(h.text.style.fontSize) : null; });\n" +
	"\t\t\t['--lpn-sym', '--lpn-symf', '--lpn-lw', '--lpn-hair'].forEach(function (k) {\n" +
	"\t\t\t\tout[k] = px(svg.style.getPropertyValue(k)); });\n" +
	"\t\t\treturn out; },\n" +
	"\t\tkept: function (id) { return keptDrawings[id] || null; },\n" +
	"\t\tkeptIds: function () { return keptDrawingOrder.slice(); },\n" +
	"\t\tkeepMax: function () { return DRAWING_KEEP_MAX; },\n" +
	"\t\tcounts: function () { return { built: drawingsBuilt, reused: drawingsReused,\n" +
	"\t\t\trestores: switchRestoreCount }; },\n" +
	"\t\tlayoutOf: function () {\n" +
	"\t\t\tvar out = {};\n" +
	"\t\t\tObject.keys(nodeEls).forEach(function (id) { var h = nodeEls[id];\n" +
	"\t\t\t\tout['n:' + id] = JSON.stringify([h.nudge, h.placedSide, h.lines, h.lineCount,\n" +
	"\t\t\t\t\t!!h.hiddenDropped, !!h.hiddenCrossed, h.tw, h.text.x, h.text.y]); });\n" +
	"\t\t\tObject.keys(linkEls).forEach(function (id) { var h = linkEls[id];\n" +
	"\t\t\t\tout['l:' + id] = JSON.stringify([h.nudge, h.placedSide, h.lines, h.lineCount,\n" +
	"\t\t\t\t\t!!h.hiddenShort, !!h.hiddenCrowded, !!h.hiddenCrossed, h.shedCount, h.tw,\n" +
	"\t\t\t\t\th.text.x, h.text.y]); });\n" +
	"\t\t\treturn out; }"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// What a switch BUILDS INTO THE DRAWING: every element in the five layers that was not there a
// moment ago. Counted by identity rather than by calls to createElementNS, because a switch also
// rebuilds things that are not the drawing (the user's backdrop image, the Settings box's icons)
// and those are not what this task keeps.
function drawingElements() {
	const out = new Set(), lay = L.layers();
	(function walk(e) { out.add(e); (e.children || []).forEach(walk); })({ children:
		[lay.customers, lay.links, lay.symbols, lay.nodes, lay.labels] });
	return out;
}
function newElements(before) {
	let n = 0, first = '';
	drawingElements().forEach(function (e) {
		if (e._tag && !before.has(e)) { n++; first = first || (e._tag + ' ' + (e['class'] || '')); }
	});
	return { n: n, first: first };
}

// A whole subtree as a string: tag, every primitive own property (attributes live there in the
// stub), the style, and the children in order. Two equal strings are two identical drawings.
function snap(e) {
	if (!e || typeof e !== 'object') { return String(e); }
	const own = Object.keys(e).filter(function (k) {
		return ['parentNode', 'children', 'classList', '_listeners', 'style', 'dataset', '_owner']
			.indexOf(k) < 0 && (e[k] === null || typeof e[k] !== 'object') && typeof e[k] !== 'function';
	}).sort().map(function (k) { return k + '=' + e[k]; });
	return '<' + e._tag + ' ' + own.join(' ') + ' style=' + JSON.stringify(e.style ? e.style._props : {}) +
		' display=' + (e.style ? e.style.display : '') + '>' +
		(e.children || []).map(snap).join('') + '</>';
}
function drawingSnap(d) {
	return ['customersLayer', 'linksLayer', 'linkSymbolLayer', 'nodesLayer', 'labelsLayer']
		.map(function (k) { return snap(d[k]); }).join('|');
}
function shown(layer) { return !layer.style || layer.style.display !== 'none'; }

setUnitSet('us');
L.buildLayers();
L.setCanvas(1400, 700);
L.markSized();

// Three projects. The first carries Net3 with every label field on, because a crowd is where a
// label could move; the other two are small and differ, so a borrowed element would show.
const net3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples/Net3.lwn'), 'utf8'));
if (net3.settings) { net3.settings.labelMaxWidth = null; }   // "always show labels" -- see switch-keep-harness.js
L.newProject();
const big = L.openId();
L.applySaved(net3);
L.refreshAll();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.refreshLabelText();
L.saveToStorage();
L.newProject();
const small = L.openId();
const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 100, 0);
L.addLink('pipe', a.id, b.id);
L.saveToStorage();
L.newProject();
const third = L.openId();
const c = L.addNode('junction', 0, 0), d = L.addNode('junction', 40, 30);
L.addLink('pipe', c.id, d.id);
L.saveToStorage();

console.log('--- (a) away and back builds nothing, and no label moves ---');
{
	L.openProject(big);   // arrive once, so the drawing below is the one a return would see
	const before = L.layoutOf();
	const nodesBefore = L.layers().nodes;
	const elsBefore = drawingElements();
	const snapBefore = drawingSnap({ customersLayer: L.layers().customers, linksLayer: L.layers().links,
		linkSymbolLayer: L.layers().symbols, nodesLayer: nodesBefore, labelsLayer: L.layers().labels });
	L.openProject(small);
	ok('the big drawing is kept, hidden, while the small project is on screen',
		!!L.kept(big) && !shown(L.kept(big).drawing.nodesLayer) && L.kept(big).drawing.nodesLayer === nodesBefore);
	ok('...and the one on screen is a different set of layers, shown',
		L.layers().nodes !== nodesBefore && shown(L.layers().nodes));
	const counts0 = L.counts();
	L.openProject(big);
	const counts1 = L.counts();
	const built = newElements(elsBefore);
	ok('the switch back builds ZERO elements (' + elsBefore.size + ' on the drawing)', built.n === 0,
		built.n + ' new; first ' + built.first);
	ok('...because it reused the kept drawing rather than building one',
		counts1.reused === counts0.reused + 1 && counts1.built === counts0.built,
		JSON.stringify(counts0) + ' -> ' + JSON.stringify(counts1));
	ok('...and ran no label pass (counted as a restore)', counts1.restores === counts0.restores + 1);
	ok('the very same layers are on screen again, shown', L.layers().nodes === nodesBefore && shown(nodesBefore));
	ok('the small drawing is now the hidden one', !!L.kept(small) && !shown(L.kept(small).drawing.nodesLayer));
	const after = L.layoutOf();
	const moved = Object.keys(before).filter(function (k) { return before[k] !== after[k]; });
	ok('the drawing has its labels (' + Object.keys(before).length + ')', Object.keys(before).length > 100);
	ok('...and not one of them moved', !moved.length, moved.length + ' moved; first ' + moved[0]);
	const snapAfter = drawingSnap({ customersLayer: L.layers().customers, linksLayer: L.layers().links,
		linkSymbolLayer: L.layers().symbols, nodesLayer: L.layers().nodes, labelsLayer: L.layers().labels });
	ok('every element of the drawing is exactly as it was', snapAfter === snapBefore,
		'length ' + snapBefore.length + ' -> ' + snapAfter.length);
}

console.log('\n--- (b) an edit on screen never touches a kept drawing ---');
{
	L.openProject(small);
	const keptBig = L.kept(big).drawing;
	const keptSnap = drawingSnap(keptBig);
	// Edits through the page's own paths: a new node, a moved node, a relabel, a whole rebuild.
	const n = L.addNode('junction', 60, 60);
	const moving = L.nodeById(a.id); moving.x = 25; moving.y = 15; L.updateNode(a.id);
	L.refreshLabelText();
	L.buildDom();
	L.saveToStorage();
	ok('the edit landed in the small project', !!L.nodeEls()[n.id] && !!L.getDoc().nodes.some(function (x) { return x.id === n.id; }));
	ok('the kept big drawing is untouched, element for element', drawingSnap(keptBig) === keptSnap);
	ok('...and holds no element of the small project',
		!keptBig.nodeEls[n.id] || L.getDoc().nodes.length === 0);
	ok('...and is still hidden', !shown(keptBig.nodesLayer));
	// An edit to a project that is ITSELF kept, made where the page cannot see it: the stored bytes
	// move, so the kept drawing is a picture of a document that no longer exists and must be rebuilt.
	L.openProject(third);
	const key = 'lpn_project_' + small;
	const stored = JSON.parse(localStorage.getItem(key));
	stored.nodes[0].elev = (stored.nodes[0].elev || 0) + 1234.5;
	localStorage.setItem(key, JSON.stringify(stored));
	const staleLayers = L.kept(small).drawing.nodesLayer;
	const c0 = L.counts();
	const elsStale = drawingElements();
	L.openProject(small);
	const rebuilt = newElements(elsStale);
	const c1 = L.counts();
	ok('a document moved under a hidden tab is REBUILT, never shown stale',
		c1.built === c0.built + 1 && c1.reused === c0.reused && rebuilt.n > 0,
		JSON.stringify(c0) + ' -> ' + JSON.stringify(c1) + ', ' + rebuilt.n + ' new elements');
	ok('...and its stale drawing left the page', staleLayers.parentNode.children.indexOf(staleLayers) < 0);
}

console.log('\n--- (c) closing a tab frees its drawing; the keep is bounded ---');
{
	// small is on screen; big and third are kept.
	ok('two drawings are kept', L.keptIds().length === 2, JSON.stringify(L.keptIds()));
	const thirdLayers = L.kept(third).drawing.nodesLayer, model = L.layers().model;
	L.discardProject(third);
	ok('closing a hidden tab drops its drawing from the keep', !L.kept(third));
	ok('...and from the page', model.children.indexOf(thirdLayers) < 0);
	// Closing the tab ON SCREEN lands on a neighbour; its own drawing must not be left behind.
	// Below the layer groups: a tab that lands on a project with nothing kept rebuilds INTO the
	// same groups, which frees the old shapes just as surely as removing the groups does.
	const closedShapes = new Set();
	drawingElements().forEach(function (e) { if (e._tag && e.parentNode && e.parentNode !== model &&
		e['class'] !== undefined && !/^(lpn-symbols|lpn-customers)$/.test(e['class'] || '')) { closedShapes.add(e); } });
	L.discardProject(small);
	ok('closing the open tab lands somewhere', !!L.openId() && L.openId() !== small);
	const left = [];
	(function walk(e) { if (closedShapes.has(e)) { left.push(e); } (e.children || []).forEach(walk); })(model);
	ok('...and not one shape of its drawing (' + closedShapes.size + ') is left on the page', closedShapes.size > 0 && !left.length,
		left.length + ' left');
	// Six projects visited in turn: never more than the cap kept, and the page holds exactly the
	// kept drawings plus the one on screen -- nothing orphaned.
	const ids = [L.openId()];
	for (let i = 0; i < 6; i++) {
		L.newProject();
		const p = L.addNode('junction', i, i), q = L.addNode('junction', i + 10, i);
		L.addLink('pipe', p.id, q.id);
		L.saveToStorage();
		ids.push(L.openId());
	}
	ids.forEach(function (id) { L.openProject(id); });
	ok('never more than ' + L.keepMax() + ' drawings kept', L.keptIds().length === L.keepMax(),
		L.keptIds().length + ' kept');
	const nodeLayers = model.children.filter(function (e) { return e['class'] === 'lpn-symbols'; }).length;
	ok('the page holds the kept drawings and the one on screen, nothing more',
		nodeLayers === 3 * (L.keepMax() + 1), nodeLayers + ' symbol layers for ' + (L.keepMax() + 1) + ' drawings');
	ok('the least recent was the one let go', !L.kept(ids[0]) && !L.kept(ids[1]) && !!L.kept(ids[ids.length - 2]));
}

console.log('\n--- (d) a drawing that comes back is sized for its OWN view, not the one it left ---');
{
	// Phase (a) went big -> small -> big at whatever zoom each fit to, and a stub fit gave them
	// near enough the same scale that a drawing sized at the wrong one could not show. Here the two
	// are as far apart as the page gets: a grid Net1 at pixels per foot, and the geographic Novato
	// at tens of thousands of pixels per degree. A kept drawing sized at the outgoing project's
	// scale draws its junctions 5x too large one way and sub-pixel the other (perry-680 t8).
	function load(file) {
		const j = JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples/' + file), 'utf8'));
		L.newProject(); const id = L.openId(); L.applySaved(j); L.refreshAll(); L.saveToStorage(); return id;
	}
	const grid = load('Net1.lwn'), geo = load('Net3-Novato-CA-World.lwn');
	// The same view, built from nothing: what the returned drawing must equal, element for element.
	function fresh() { L.buildDom(); L.refreshFontSizes(true); return L.sizes(); }
	function diff(a, b) {
		const k = Object.keys(b).filter(function (x) { return JSON.stringify(a[x]) !== JSON.stringify(b[x]); });
		return k.length + ' differ; first ' + k[0] + ' ' + JSON.stringify(a[k[0]]) + ' vs fresh ' + JSON.stringify(b[k[0]]);
	}
	function returnTo(id, from, label) {
		L.openProject(id); const sOwn = L.scale();
		L.openProject(from);
		ok(label + ': the two projects really are at different scales (' + sOwn.toPrecision(3) + ' vs ' +
			L.scale().toPrecision(3) + ')', Math.abs(Math.log(sOwn / L.scale())) > Math.log(2));
		// A drawing left with its labels hidden (Novato at its fit) owes the pass it skipped; one
		// laid out at the view it returns to owes nothing and must not run one.
		const owes = L.kept(id).drawing.labelWorkSkipped || L.kept(id).drawing.lastLayoutScale !== sOwn;
		const c0 = L.counts();
		L.openProject(id);
		const c1 = L.counts();
		ok(label + ': it came back from the keep' + (owes ? ' (owing its skipped label pass)' : ', with no label pass'),
			c1.reused === c0.reused + 1 && (owes || c1.restores === c0.restores + 1), JSON.stringify(c0) + ' -> ' + JSON.stringify(c1));
		ok(label + ': ...at its own scale', L.scale() === sOwn, L.scale() + ' vs ' + sOwn);
		const got = L.sizes(), want = fresh();
		ok(label + ': every node symbol and label is the on-screen size a fresh build gives (' +
			Object.keys(want).length + ')', JSON.stringify(got) === JSON.stringify(want), diff(got, want));
	}
	returnTo(grid, geo, 'grid Net1 back from geographic Novato');
	returnTo(geo, grid, 'geographic Novato back from grid Net1');
	// And after a zoom-in, laid out at the new scale, so the kept record's layout scale matches the
	// view it comes back to -- the case that skipped the resize outright.
	L.openProject(grid); L.zoomAbout(700, 350, 4); L.settleZoom();
	ok('the zoom-in was laid out at its own scale', L.lastLayoutScale() === L.scale());
	returnTo(grid, geo, 'zoomed-in Net1 back from Novato');
	L.openProject(geo); L.zoomAbout(700, 350, 4); L.settleZoom();
	returnTo(geo, grid, 'zoomed-in Novato back from Net1');
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

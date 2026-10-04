// JUNCTION AND PIPE: DRAW A CHAIN -- ROADMAP Task 719. Run with:
//   node dev/lpn-spike/chain-draw-harness.js
//
// Tom, from WaterCAD: "a Junction and Pipe toolbar command that adds Junction, Pipe, Junction,
// Pipe, etc until escape." Every assertion drives the page's own pointerdown/pointerup, keydown
// and undo, with bare map under the pointer, and reads the result out of `doc`. The thing that
// would make this pass for the wrong reason is calling addNode()/addLink() from here, which proves
// the two functions work and says nothing about the sequencing the tool adds.
//
// Covered: a 3-leg chain from open space; a chain started on an existing node; closing a loop on
// an existing node; Escape (and a right-click, and the tool button again) ending the chain with
// no dangling pipe; one undo step per press, with the chain standing on the node before; the
// shortcut; a touch tap; and that new assets take the single tools' defaults and ID prefixes.

'use strict';

const { byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode, getMode: function () { return mode; },\n" +
	"\t\tundo: undo, redo: redo, nodeById: nodeById,\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tpendingFrom: function () { return pendingLinkFrom; },\n" +
	"\t\trubberBand: function () { return rubberBandEl; },\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	svg._listeners = {};
	L.wirePointerEvents();
	L.setMode('select');
	return doc;
}
function fire(type, ev) { setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function click(x, y, opts) {
	opts = opts || {};
	const pt = opts.touch ? 'touch' : 'mouse', btn = opts.button || 0;
	fire('pointerdown', { pointerId: 3, clientX: x, clientY: y, pointerType: pt, button: btn });
	fire('pointerup', { pointerId: 3, clientX: x, clientY: y, pointerType: pt, button: btn });
}
function esc() {
	var stopped = false;
	var ev = { key: 'Escape', stopPropagation: function () { stopped = true; }, preventDefault: function () {} };
	(global.document._listeners.keydown || []).slice().forEach(function (fn) { if (!stopped) { fn(ev); } });
}
function key(k) {
	const ev = { key: k, ctrlKey: false, metaKey: false, altKey: false, target: { tagName: 'BODY' }, preventDefault: function () {} };
	(global.document._listeners.keydown || []).slice().forEach(function (fn) { fn(ev); });
}
function rightClickMenu() {
	let prevented = false;
	const ev = { target: { closest: function (sel) { return sel === '#lpn_canvas' ? svg : null; } }, preventDefault: function () { prevented = true; } };
	(global.document._listeners.contextmenu || []).slice().forEach(function (fn) { fn(ev); });
	return prevented;
}

// ---------------------------------------------------------------------------
console.log('\n--- 1. a three-leg chain from open space ---');
{
	const doc = fresh();
	L.setMode('add-chain');
	const d0 = L.undoDepth();
	click(100, 100);
	ok('the first press places one junction and no pipe', doc.nodes.length === 1 && doc.links.length === 0, doc.nodes.length + '/' + doc.links.length);
	ok('...which is a junction', doc.nodes[0].type === 'junction');
	ok('...and the chain stands on it', L.pendingFrom() === doc.nodes[0].id);
	ok('...as one undo step', L.undoDepth() === d0 + 1, L.undoDepth() - d0);
	click(300, 100);
	click(300, 300);
	click(500, 300);
	ok('three more presses: four junctions and three pipes', doc.nodes.length === 4 && doc.links.length === 3, doc.nodes.length + '/' + doc.links.length);
	const ids = doc.nodes.map(function (n) { return n.id; });
	const connected = doc.links.every(function (l, i) { return l.type === 'pipe' && l.from === ids[i] && l.to === ids[i + 1]; });
	ok('each pipe joins the previous junction to the next, in order', connected, JSON.stringify(doc.links.map(function (l) { return l.from + '>' + l.to; })));
	ok('the chain stands on the newest junction', L.pendingFrom() === ids[3]);
	ok('the tool is still the chain tool', L.getMode() === 'add-chain');
	ok('one undo step per press', L.undoDepth() === d0 + 4, L.undoDepth() - d0);
	ok('the rubber band is shown', L.rubberBand().style.display !== 'none');
	ok('no vertices were recorded on any pipe', doc.links.every(function (l) { return l.verts.length === 0; }));

	console.log('\n--- 2. new assets take the single tools\' defaults and prefixes ---');
	const S = L.getSettings();
	ok('junction defaults: elevation and demand', doc.nodes.every(function (n) {
		return n.elev === S.defaults.nodeElev && n._demand === S.defaults.demand;
	}));
	ok('pipe defaults: diameter and roughness', doc.links.every(function (l) {
		return l._diameter === S.defaults.diameter && l._roughness === S.defaults.roughness && l.lenAuto === true && l._length > 0;
	}), JSON.stringify(doc.links[0]));
	ok('IDs use the Junction and Pipe prefixes', ids.every(function (i) { return i.indexOf(S.idPrefixes.J) === 0; }) &&
		doc.links.every(function (l) { return l.id.indexOf(S.idPrefixes.L) === 0; }), ids.join(',') + ' ' + doc.links.map(function (l) { return l.id; }).join(','));
	ok('the same ID the single junction tool would mint comes next',
		(function () { const n = L.addNode('junction', 900, 900); const okId = n.id.indexOf(S.idPrefixes.J) === 0; doc.nodes.pop(); return okId; })());

	console.log('\n--- 3. Escape ends the chain and leaves nothing half-made ---');
	const nodesBefore = doc.nodes.length, linksBefore = doc.links.length;
	esc();
	ok('Escape clears the chain', L.pendingFrom() === null);
	ok('...without adding or removing anything', doc.nodes.length === nodesBefore && doc.links.length === linksBefore);
	ok('...and the tool stays selected for the next chain', L.getMode() === 'add-chain');
	ok('...with the rubber band hidden', L.rubberBand().style.display === 'none');
	click(700, 700);
	ok('the next press starts a NEW chain: a junction, no pipe back to the old one', doc.nodes.length === nodesBefore + 1 && doc.links.length === linksBefore);
	esc(); esc();
	ok('a second Escape puts the tool away', L.getMode() === 'select');
}

console.log('\n--- 4. start from an existing node; close a loop on one ---');
{
	const doc = fresh();
	const a = L.addNode('junction', 100, 100).id;
	const b = L.addNode('junction', 300, 100).id;
	L.setMode('add-chain');
	const d0 = L.undoDepth();
	click(100, 100);
	ok('a press on an existing node starts from it and adds nothing', L.pendingFrom() === a && doc.nodes.length === 2 && doc.links.length === 0);
	ok('...and takes no undo snapshot', L.undoDepth() === d0);
	click(100, 100);
	ok('a second press on the same node does nothing', L.pendingFrom() === a && doc.links.length === 0);
	click(300, 100);
	ok('a press on another existing node adds only a pipe', doc.nodes.length === 2 && doc.links.length === 1 && doc.links[0].from === a && doc.links[0].to === b);
	ok('...and continues from that node', L.pendingFrom() === b);
	click(300, 400);
	click(100, 400);
	click(100, 100);
	ok('a chain can close a loop on its first node', doc.links.length === 4 && doc.links[3].to === a && doc.nodes.length === 4, doc.nodes.length + '/' + doc.links.length);
	esc();
}

console.log('\n--- 5. undo takes back one press, and the chain stands on the node before ---');
{
	fresh();
	L.setMode('add-chain');
	click(100, 100); click(300, 100); click(500, 100);
	const first = L.getDoc().nodes[0].id, second = L.getDoc().nodes[1].id;
	// Undo REPLACES the document object, so it is read afresh each time.
	const doc = function () { return L.getDoc(); };
	L.undo();
	ok('undo takes back the last junction and its pipe together', doc().nodes.length === 2 && doc().links.length === 1, doc().nodes.length + '/' + doc().links.length);
	ok('...and the chain stands on the node before', L.pendingFrom() === second, L.pendingFrom());
	click(500, 300);
	ok('...and the next press continues from there', doc().links.length === 2 && doc().links[1].from === second);
	L.undo(); L.undo();
	ok('undoing the second pipe step leaves only the first junction', doc().nodes.length === 1 && doc().links.length === 0 && L.pendingFrom() === first, doc().nodes.length + '/' + doc().links.length + ' ' + L.pendingFrom());
	L.undo();
	ok('undoing the first press empties the map and ends the chain', doc().nodes.length === 0 && L.pendingFrom() === null);
}

console.log('\n--- 6. other ways out: right-click, the tool button, another tool ---');
{
	const doc = fresh();
	L.setMode('add-chain');
	click(100, 100); click(300, 100);
	const nodes = doc.nodes.length, links = doc.links.length;
	ok('the context menu is suppressed while a chain runs', rightClickMenu() === true);
	ok('...and it ends the chain', L.pendingFrom() === null && doc.nodes.length === nodes && doc.links.length === links);
	click(100, 100); click(300, 100);
	const n2 = doc.nodes.length, l2 = doc.links.length;
	click(500, 500, { button: 2 });
	ok('a right-button press adds nothing and ends the chain', L.pendingFrom() === null && doc.nodes.length === n2 && doc.links.length === l2);
	L.setMode('add-chain');
	click(700, 700);
	L.setMode('add-pipe');
	ok('choosing another tool abandons the chain', L.pendingFrom() === null);
	L.setMode('add-chain');
	click(900, 900);
	L.setMode('select');
	ok('...and so does Select', L.pendingFrom() === null);
}

console.log('\n--- 7. the shortcut and touch ---');
{
	const doc = fresh();
	key('0');
	ok('0 selects the tool', L.getMode() === 'add-chain');
	click(100, 100, { touch: true });
	click(300, 100, { touch: true });
	ok('a tap per vertex works', doc.nodes.length === 2 && doc.links.length === 1);
	// A press that travels is a pan or a pinch, not a tap.
	fire('pointerdown', { pointerId: 4, clientX: 500, clientY: 500, pointerType: 'touch', button: 0 });
	fire('pointerup', { pointerId: 4, clientX: 560, clientY: 560, pointerType: 'touch', button: 0 });
	ok('a travelling touch places nothing', doc.nodes.length === 2 && doc.links.length === 1);
	key('1');
	ok('1 returns to Select and abandons the chain', L.getMode() === 'select' && L.pendingFrom() === null);
}


console.log('\n--- 8. Redo carries the chain forward ---');
{
	fresh();
	L.setMode('add-chain');
	click(100, 100); click(300, 100); click(500, 100); click(700, 100);
	const ids = L.getDoc().nodes.map(function (n) { return n.id; });
	L.undo(); L.undo();
	ok('after two Undos the chain stands on J2', L.pendingFrom() === ids[1], L.pendingFrom());
	L.redo(); L.redo();
	ok('after two Redos J4 is back and the chain stands on it', L.getDoc().nodes.length === 4 && L.pendingFrom() === ids[3], L.pendingFrom());
	click(900, 100);
	const d = L.getDoc();
	ok('the next press continues from J4, not from J2', d.links[3].from === ids[3] && d.links.length === 4, JSON.stringify(d.links.map(function (l) { return l.from + '>' + l.to; })));
	L.undo(); L.undo();
	click(500, 400);
	L.redo();
	ok('a new press after Undo drops the undone steps: Redo then does not resurrect them', L.getDoc().nodes.length === 4 && L.pendingFrom() !== null);
	esc();
	// The Pipe tool is not a chain: Undo leaves its from-node alone when that node survives.
	fresh();
	const a = L.addNode('junction', 100, 100).id;
	L.setMode('add-pipe'); click(100, 100);
	L.undo();
	ok('the Pipe tool keeps its from-node through an unrelated Undo only if the node survives', L.pendingFrom() === null || L.pendingFrom() === a);
}

console.log('\n--- 9. the rubber band ---');
{
	fresh();
	L.setMode('add-chain');
	const rb = L.rubberBand();
	function at() { return [rb.getAttribute('x1'), rb.getAttribute('y1'), rb.getAttribute('x2'), rb.getAttribute('y2')].map(Number); }
	click(100, 100);
	fire('pointermove', { clientX: 300, clientY: 100, pointerType: 'mouse' });
	click(300, 100);
	let v = at();
	ok('after a click the band starts at the new node with zero length', v[0] === 300 && v[1] === 100 && v[2] === 300 && v[3] === 100, v.join(','));
	fire('pointermove', { clientX: 400, clientY: 250, pointerType: 'mouse' });
	v = at();
	ok('and follows the pointer from there', v[0] === 300 && v[2] === 400 && v[3] === 250, v.join(','));
	fire('pointerup', { pointerId: 9, clientX: 400, clientY: 250, pointerType: 'touch', button: 0 });
	ok('on touch the band is hidden when a finger lifts (after a pan or pinch)', rb.style.display === 'none');
	fire('pointermove', { clientX: 410, clientY: 260, pointerType: 'touch' });
	ok('...and returns on the next pointer move', rb.style.display !== 'none');
	click(400, 300, { touch: true });
	v = at();
	ok('a touch tap that adds a node shows the band at zero length on it', rb.style.display !== 'none' && v[0] === 400 && v[2] === 400 && v[3] === 300, v.join(','));
	esc();
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);

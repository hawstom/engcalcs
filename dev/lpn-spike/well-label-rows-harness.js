// A WELL'S LABEL BLOCK: THE HEADING, THEN ONE ROW PER MEMBER NODE. Run with:
//   node dev/lpn-spike/well-label-rows-harness.js
//
// Task 822, round 7 (Tom, round 6 pass, his example block):
//   W1 Z = 999', Q=99 gpm
//   W1R H=899'
//   W1D H= 799'
//   W1P H=1099', P=40 psi
// The heading is the well's ID with Z (the ground elevation, the outlet node's) and Q (the pump's flow), and nothing else; the groundwater
// reservoir W1R and the drawdown node W1D give H only ("P suppressed because it makes no sense"); the pump outlet W1P gives H and P; the drawdown
// valve W1V has no row, its flow being the pump's. Every number is the ordinary field's, so the label settings' toggles and affixes govern it.
// Also: the Well with tank's tee and tank are ordinary nodes with ordinary labels; the block sheds rows before the heading.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode, getMode: function () { return mode; },\n" +
	"\t\tundo: undo, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tselected: function () { return selectedRefs(); },\n" +
	"\t\tsetProp: setProp, effective: effective, runSolve: runSolve, closePopup: closePopup, refreshPopupIfOpen: refreshPopupIfOpen,\n" +
	"\t\topenPopup: openPopup, openLinkPopup: openLinkPopup, getPopup: function () { return currentPopup; },\n" +
	"\t\tterrainFill: terrainFillElevations, wellUnderground: wellUnderground,\n" +
	"\t\tapplySaved: applySaved, migrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tdeleteNode: deleteNode, deleteLink: deleteLink, linkEls: function () { return linkEls; },\n" +
	"\t\tapplyNodeRename: applyNodeRename, applyLinkRename: applyLinkRename,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, getScenarios: function () { return scenarios; },\n" +
	"\t\ttitleText: propsBoxTitleText,\n" +
	"\t\tnodeLines: nodeLabelFieldLines, linkLines: linkLabelFieldLines, scnLabels: scnLabels, assemblyOfNode: assemblyOfNode, nodeEls: function () { return nodeEls; }, explode: explodeAssembly, snap: saveUndoSnapshot, nodeRadius: nodeRadius, nodeSymbolSize: nodeSymbolSize, nodeHitSilhouette: nodeHitSilhouette,\n" +
	"\t\tcurrentModel: function () { return assembleModel(); },\n" +
	"\t\tresetIds: function () { nextId = newNextId(); },\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlinkSymbolLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('si');
const EC = global.EngCalcs;

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
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.assemblies = []; doc.curves = [];
	L.resetIds();
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	svg._listeners = {};
	L.wirePointerEvents();
	L.setMode('select');
	return doc;
}
function fire(type, ev) { (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function press(x, y, target) {
	setHitTarget(target || null);
	fire('pointerdown', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 });
	setHitTarget(null);
}
function hitNode(id) { return { dataset: { node: id }, classList: { contains: function () { return false; } } }; }
function hitLink(id) { return { dataset: { link: id }, classList: { contains: function () { return false; } } }; }
function fieldsOf() { return byId.lpn_popup_fields; }
function allKids(el, out) {
	out = out || [];
	(el.childNodes || el.children || []).forEach(function (c) { out.push(c); allKids(c, out); });
	return out;
}



const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function net(tank) {
	const doc = fresh();
	L.setMode(tank ? 'add-welltank' : 'add-well'); press(200, 150);
	if (tank) { press(200, 150, hitNode('W1P')); press(400, 400); }
	const j = L.addNode('junction', 600, 150); j._demand = 10;
	L.addLink('pipe', 'W1P', j.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1'); L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	if (tank) { L.setProp(L.nodeById('T1'), 'elev', 150); L.setProp(L.nodeById('J1'), 'elev', 150); }
	return doc;
}
(async function () {
for (const tank of [false, true]) {
	console.log('\n--- ' + (tank ? 'a Well with tank' : 'a Well') + ' ---');
	net(tank);
	L.runSolve();
	await wait(1500);
	const ls = L.scnLabels();
	ls.node.head = true; ls.node.elev = true; ls.node.pressure = true; ls.link.flow = true;
	const lines = (id) => L.nodeLines(L.nodeById(id), ls, null).map((x) => x.text);
	const block = lines('W1P');
	console.log('        ' + JSON.stringify(block));
	ok('four lines: the heading and one row each for W1R, W1D and W1P', block.length === 4 && /^W1 /.test(block[0]) && /^W1R /.test(block[1]) && /^W1D /.test(block[2]) && /^W1P /.test(block[3]), JSON.stringify(block));
	ok('the heading is Z then Q', /^W1 Z=\S+ Q=\S+$/.test(block[0].replace(/,/g, '')), block[0]);
	ok('the heading carries no head and no pressure', !/H=|P=/.test(block[0]));
	ok('W1R and W1D: H and no P', /H=/.test(block[1]) && !/P=/.test(block[1]) && /H=/.test(block[2]) && !/P=/.test(block[2]));
	ok('W1P: H and P', /H=/.test(block[3]) && /P=/.test(block[3]));
	ok('one Q in the whole block, and none in a row', block.join(' ').split('Q=').length === 2 && !block.slice(1).some((r) => /Q=/.test(r)));
	ok('the drawdown valve has no row and no label of its own', !block.some((r) => /^W1V /.test(r)) && L.linkLines(L.linkById('W1V'), ls, null).length === 0 && L.linkLines(L.linkById('W1'), ls, null).length === 0);
	ok('W1R and W1D draw no label of their own', lines('W1R').length === 0 && lines('W1D').length === 0);
	if (tank) {
		const tee = lines('J1'), tk = lines('T1');
		ok('the tee and the tank are ordinary nodes with ordinary labels', tee.length > 0 && tee[0] === 'J1' && tk.length > 0 && tk[0] === 'T1', JSON.stringify([tee, tk]));
	}
	// The settings govern it.
	ls.node.head = false;
	let b2 = lines('W1P');
	ok('with H off the rows give only P (W1P) and the others fall away', b2.length === 2 && /^W1 /.test(b2[0]) && /^W1P /.test(b2[1]) && !/H=/.test(b2.join(' ')) && /P=/.test(b2[1]), JSON.stringify(b2));
	ls.node.head = true; ls.node.elev = false;
	b2 = lines('W1P');
	ok('with Z off the heading is the ID and Q', /^W1 Q=/.test(b2[0]) && !/Z=/.test(b2[0]), b2[0]);
	ls.node.elev = true; ls.link.flow = false;
	b2 = lines('W1P');
	ok('with Q off the heading is the ID and Z', /^W1 Z=/.test(b2[0]) && !/Q=/.test(b2[0]), b2[0]);
	ls.link.flow = true; ls.node.pressure = false;
	b2 = lines('W1P');
	ok('with P off no row has P', !/P=/.test(b2.join(' ')));
	ls.node.pressure = true; ls.node.id = false; ls.link.id = false;
	b2 = lines('W1P');
	ok('with IDs off the heading stays: it is the tag', /^W1 /.test(b2[0]));
	ls.node.id = true; ls.link.id = true;
	ls.node.head = false; ls.node.elev = false; ls.node.pressure = false; ls.link.flow = false;
	b2 = lines('W1P');
	ok('with nothing to show but IDs the block is the ID alone', b2.length === 1 && b2[0] === 'W1', JSON.stringify(b2));
}

console.log('\n--- shedding: the rows go first, the heading last ---');
{
	net(false);
	L.runSolve();
	await wait(1500);
	const ls = L.scnLabels(); ls.node.head = true; ls.node.elev = true; ls.node.pressure = true; ls.link.flow = true;
	const full = L.nodeLines(L.nodeById('W1P'), ls, null);
	ok('the heading ranks above every row (it sheds last)', full[0].shedRank > Math.max.apply(null, full.slice(1).map((x) => x.shedRank)), JSON.stringify(full.map((x) => x.shedRank)));
	ok('the rows shed from the first down', full.slice(1).every((x, i, a) => i === 0 || x.shedRank > a[i - 1].shedRank));
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

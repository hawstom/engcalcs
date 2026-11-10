// A WELL'S TEE: A FULL TANK SHUTS ONLY ITS OWN BRANCH. Run with:
//   node dev/lpn-spike/well-tee-harness.js
//
// Task 822 (Mary, 2026-11-09, from EPANET's hydstatus.c tankstatus(): a link whose flow fills a full tank is
// temporarily closed; Tom: "Do we need a tee and an off-line tank"). The pump discharges to a tee node D; the system's
// pipes join D; the tank T hangs on a virtual pipe from D. Covered, in BOTH engines:
//   1. with the tank full and the pump able to lift above it, the pump still delivers the system demand (flow > 0) and
//      the tank's branch carries nothing;
//   2. with the tank half full the branch carries the surplus and the pump pumps more than the demand;
//   3. a slice-1 well (three nodes, `;ASSEMBLY: well R S T G P`) still opens, and the new form round-trips.
// The expected numbers are EPANET's own, from running this network (EXPECT below).
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
	"\t\tsetProp: setProp, effective: effective,\n" +
	"\t\topenPopup: openPopup, openLinkPopup: openLinkPopup, getPopup: function () { return currentPopup; },\n" +
	"\t\tterrainFill: terrainFillElevations, wellUnderground: wellUnderground,\n" +
	"\t\tapplySaved: applySaved, migrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tdeleteNode: deleteNode, deleteLink: deleteLink, linkEls: function () { return linkEls; },\n" +
	"\t\tapplyNodeRename: applyNodeRename, applyLinkRename: applyLinkRename,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, getScenarios: function () { return scenarios; },\n" +
	"\t\ttitleText: propsBoxTitleText,\n" +
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
function network(level) {
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	const j = L.addNode('junction', 600, 150);
	j._demand = 10;
	L.addLink('pipe', 'W1D', j.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1');
	L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setProp(L.nodeById('W1T'), 'elev', 150);
	L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.setProp(L.nodeById('W1T'), 'minLevel', 0);
	L.setProp(L.nodeById('W1T'), 'maxLevel', 3);
	L.setProp(L.nodeById('W1T'), 'level', level);
	return doc;
}
// EXPECT: filled from EPANET (m3/s). Full tank: pump 0.010, branch 0. Half full: tank head 151.5, pump above the demand.
const EXPECT = { 'full': { pump: 0.010000031601, branch: 0 }, 'half full': { pump: 0.047042617352, branch: 0.037042617352 } };

(async function () {
for (const [label, level] of [['full', 3], ['half full', 1.5]]) {
	console.log('\n--- the tank ' + label + ' ---');
	const doc = network(level);
	const model = L.currentModel();
	const eng = [['built-in', EC.lpnSolve(model)], ['EPANET', await EC.lpnSolveEpanet(model, { moduleUrl: NODE_ENGINE_URL })]];
	for (const [nm, r] of eng) {
		const q = r.flows.W1, qb = r.flows.W1B, ex = EXPECT[label];
		ok(nm + ': solved and converged', r.ok && r.converged, JSON.stringify(r.engineError || r.issues || ''));
		console.log('        ' + nm + ': pump ' + q + ', branch ' + qb + ', tee ' + r.heads.W1D + ', tank ' + r.heads.W1T);
		if (level === 3) {
			ok(nm + ': the pump still delivers the system demand through a full tank', q > 0 && Math.abs(q - 0.010) <= 1e-7, q);
			ok(nm + ': the full tank\'s branch carries nothing', Math.abs(qb) <= 1e-9, qb);
		} else {
			ok(nm + ': the half-full tank takes the surplus on its branch', qb > 1e-4 && q > 0.010 + 1e-4, q + ' ' + qb);
		}
		if (ex) {
			ok(nm + ': pump flow equals EPANET\'s ' + ex.pump, Math.abs(q - ex.pump) <= 5e-6, q);
			ok(nm + ': branch flow equals EPANET\'s ' + ex.branch, Math.abs(qb - ex.branch) <= 5e-6, qb);
		}
	}
}

console.log('\n--- a slice-1 well, with no tee, still opens and works ---');
{
	const doc = network(1.5);
	// Rebuild the old five-member form from the new one: the pipe joins the tank, no tee, no branch.
	const old = JSON.parse(JSON.stringify(L.serializeProject()));
	old.assemblies = [{ id: 'W1', kind: 'well', nodes: ['W1R', 'W1U', 'W1T'], links: ['W1V', 'W1'] }];
	old.nodes = old.nodes.filter((n) => n.id !== 'W1D');
	old.links = old.links.filter((l) => l.id !== 'W1B');
	old.links.forEach((l) => { if (l.to === 'W1D') { l.to = 'W1T'; } if (l.from === 'W1D') { l.from = 'W1T'; } });
	L.applySaved(L.migrateSaved(old)); L.buildDom();
	const d2 = L.getDoc();
	ok('opened: one well of three nodes and two links', d2.assemblies.length === 1 && d2.assemblies[0].nodes.length === 3 && d2.assemblies[0].links.length === 2, JSON.stringify(d2.assemblies));
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	ok('its comment is the five-member line', /^;ASSEMBLY: well W1R W1U W1T W1V W1$/m.test(inp), (inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const parsed = EC.lpnInpParse(inp);
	ok('and reads back as a three-node well', parsed.assemblies.length === 1 && parsed.assemblies[0].nodes.length === 3 && !(parsed.dropped || []).some((d) => d.code === 'assembly-unresolved'));
	ok('a pipe on a slice-1 well joins the tank', L.getDoc().links.some((l) => l.type === 'pipe' && (l.from === 'W1T' || l.to === 'W1T')));
	const r = EC.lpnSolve(L.currentModel());
	ok('it solves', r.ok && r.converged);
	const e = EC.lpnExportInp(L.serializeProject(), {});
	void e;
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

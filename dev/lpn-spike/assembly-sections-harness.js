// AN ASSEMBLY'S PROPERTIES BOX HAS A SECTION PER SUB-ELEMENT, AND ITS GRAPH ASKS WHICH. Run with:
//   node dev/lpn-spike/assembly-sections-harness.js
//
// Task 822 (Tom, 2026-11-09: "add headings for the sub-assets"; "results areas for every subasset from upstream to downstream";
// "we will need a way to ask 'Graph which sub-asset?'"). Covered:
//   1. a Well's box: its entry area first, then the well's one Flow, then one heading per member, upstream to downstream, each titled with its kind
//      and ID, results only, a pressure under the outlet alone;
//   2. a Pump+ and a Valve+: Junction, Pump or Valve, Junction;
//   3. the field is "Static water level elevation";
//   4. the time series graph of an assembly: a "Graph which sub-asset?" chooser lists the members in order, opens on the pump, and choosing
//      another redraws the chart for that element; a steady-state project has none;
//   (the right-click menu's rows are in assembly-sections-browser-harness.js, with the look of the box.)
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


const PC = EC.pageConfig;
const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(pred, ms) { const t0 = Date.now(); while (!pred() && Date.now() - t0 < ms) { await wait(25); } return pred(); }
function walk(root, fn) { (function go(e) { if (!e) { return; } fn(e); (e.children || e.childNodes || []).forEach(go); }(root)); }
function sections() {
	const out = [];
	walk(byId.lpn_popup_fields, (e) => {
		if (e.tagName === 'SECTION' && /lpn-asm-section/.test(e.className || '')) {
			const h = (e.children || e.childNodes).find((c) => c.tagName === 'H5');
			const labels = []; walk(e, (x) => { if (x.tagName === 'LABEL') { labels.push((x.textContent || '').replace(/\s+/g, ' ').trim()); } });
			out.push({ title: h ? h.textContent : '', labels });
		}
	});
	return out;
}
function entryLabels() {
	const out = [];
	(byId.lpn_popup_fields.children || byId.lpn_popup_fields.childNodes).forEach((c) => {
		if (c.tagName === 'LABEL') { out.push((c.textContent || '').replace(/\s+/g, ' ').trim()); }
	});
	return out;
}
function network() {
	const doc = fresh();
	L.setMode('add-well'); press(200, 150);
	const j = L.addNode('junction', 600, 150); j._demand = 10;
	const j2 = L.addNode('junction', 900, 150); j2._demand = 5;
	const p1 = L.addLink('pipe', 'W1P', j.id, []), p2 = L.addLink('pipe', j.id, j2.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1'); L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	// A Pump+ spliced into the pipe from the Well's outlet, and a Valve+ into the next one, so both carry flow.
	L.setMode('add-pumpplus'); press(400, 150, hitLink(p1.id));
	L.setMode('add-valveplus'); press(750, 150, hitLink(p2.id));
	// And a Well with tank, W2, apart from the rest: the browser harnesses of the Well's pump controls open it (well-controls-browser-harness.js).
	L.setMode('add-welltank'); press(200, 500); press(330, 500); press(330, 640);
	L.setProp(L.linkById('W2V'), 'curveId', 'DD1'); L.setProp(L.linkById('W2'), 'curveId', 'PC1');
	L.setProp(L.nodeById('W2P'), 'elev', 150); L.setProp(L.nodeById('W2R'), 'elev', 120);
	L.setProp(L.nodeById('T1'), 'elev', 150); L.setProp(L.nodeById('T1'), 'maxLevel', 3); L.setProp(L.nodeById('T1'), 'level', 1.5);
	return doc;
}
(async function () {
const doc = network();
L.setMode('select');
console.log('\n--- 1. the Well\'s box ---');
L.openPopup('W1P', 10, 10);
let secs = sections();
const titles = secs.map((s) => s.title);
ok('five headings, upstream to downstream, each a kind and an ID', JSON.stringify(titles) ===
	JSON.stringify(['Reservoir W1R', 'Drawdown valve W1V', 'Junction W1D', 'Pump W1', 'Junction W1P']), JSON.stringify(titles));
const entry = entryLabels();
console.log('        entry area: ' + entry.join(' | '));
ok('the entry area comes first and holds the curves and the static level', entry.some((x) => /Static water level elevation/.test(x)) && entry.some((x) => /Drawdown curve/.test(x)) && entry.some((x) => /Pump head curve/.test(x)));
ok('the field is named Static water level elevation', PC.lpn_field_well_static === 'Static water level elevation');
ok('the one Flow follows the entry area, once', entry.filter((x) => /^Flow/.test(x)).length === 1);
L.runSolve();
await until(() => L.getDoc() && true, 50);
await wait(1500);
L.openPopup('W1P', 10, 10);
secs = sections();
const by = (t) => secs.find((s) => s.title === t);
console.log('        solved: ' + secs.map((s) => s.title + ' [' + s.labels.join('; ') + ']').join('\n                '));
ok('Junction W1P shows Head and Pressure; W1D shows Head alone', by('Junction W1P').labels.some((x) => /^Head/.test(x)) && by('Junction W1P').labels.some((x) => /^Pressure/.test(x)) && by('Junction W1D').labels.some((x) => /^Head/.test(x)) && !by('Junction W1D').labels.some((x) => /^Pressure/.test(x)));
ok('the Pump shows Head and its Status, no Flow; the Drawdown valve no Flow', by('Pump W1').labels.some((x) => /^Head/.test(x)) && !by('Pump W1').labels.some((x) => /^Flow/.test(x)) && !by('Drawdown valve W1V').labels.some((x) => /^Flow/.test(x)));

console.log('\n--- 2. Pump+ and Valve+ ---');
L.openPopup('P1U', 10, 10);
let t2 = sections().map((s) => s.title);
ok('Pump+: Junction P1U, Pump P1, Junction P1D', JSON.stringify(t2) === JSON.stringify(['Junction P1U', 'Pump P1', 'Junction P1D']), JSON.stringify(t2));
L.openPopup('V1D', 10, 10);
t2 = sections().map((s) => s.title);
ok('Valve+: Junction V1U, Valve V1, Junction V1D', JSON.stringify(t2) === JSON.stringify(['Junction V1U', 'Valve V1', 'Junction V1D']), JSON.stringify(t2));

if (process.argv.includes('--write-fixture')) {
	// The browser harness opens this project: a Well, a Pump+ and a Valve+ with an extended period run set.
	const fx = JSON.parse(JSON.stringify(L.serializeProject()));
	fx.times = Object.assign(EC.lpnTimesDefaults(), { duration: 86400 });
	require('fs').writeFileSync(ROOT + 'dev/lpn-spike/assembly-sections-fixture.lwn', JSON.stringify(fx));
	console.log('wrote the fixture');
}
console.log('\n--- 4. the graph asks which sub-asset ---');
doc.times = EC.lpnTimesDefaults(); doc.times.duration = 86400;
L.runSolve();
EC.lpnTimeRunNow();
const ran = await until(() => EC.lpnTimeRunState().frames > 0, 90000);
ok('the extended period run finished', ran, JSON.stringify(EC.lpnTimeRunState()));
L.openPopup('W1P', 10, 10);
const g = byId.lpn_popup_graph;
const gsel = (id) => { let r = null; walk(g, (e) => { if (e.id === id) { r = e; } }); return r; };
const which = gsel('lpn_pgraph_member');
ok('the Well\'s graph has a "Graph which sub-asset?" chooser', !!which && PC.lpn_pgraph_which === 'Graph which sub-asset?');
const opts = which ? (which.children || which.childNodes).map((o) => o.textContent) : [];
ok('it lists the five members upstream to downstream', JSON.stringify(opts) === JSON.stringify(['Reservoir W1R', 'Drawdown valve W1V', 'Junction W1D', 'Pump W1', 'Junction W1P']), JSON.stringify(opts));
ok('it opens on the pump', which && which.value === 'link:W1', which && which.value);
const chartIds = () => { const ids = []; walk(g, (e) => { if (e.tagName === 'text' || e.nodeType === 3) { ids.push(String(e.textContent || '')); } }); return ids.join(' | '); };
const fieldOpts1 = (gsel('lpn_pgraph_field').children || gsel('lpn_pgraph_field').childNodes).map((o) => o.value);
ok('the pump offers pump results (flow, head)', fieldOpts1.indexOf('flow') >= 0);
which.value = 'node:W1P'; ((which._listeners || {}).change || []).forEach((f) => f({ type: 'change', target: which }));
const fieldOpts2 = (gsel('lpn_pgraph_field').children || gsel('lpn_pgraph_field').childNodes).map((o) => o.value);
ok('choosing the outlet redraws with a junction\'s own quantities', fieldOpts2.indexOf('pressure') >= 0 || fieldOpts2.indexOf('head') >= 0, JSON.stringify(fieldOpts2));
ok('and the choice differs from the pump\'s list', JSON.stringify(fieldOpts1) !== JSON.stringify(fieldOpts2), JSON.stringify([fieldOpts1, fieldOpts2]));
ok('the chosen member is remembered for the session on re-open', (L.closePopup(), L.openPopup('W1P', 10, 10), gsel('lpn_pgraph_member').value === 'node:W1P'));
L.openPopup('P1U', 10, 10);
const w2 = gsel('lpn_pgraph_member');
ok('a Pump+ lists Junction, Pump, Junction and opens on the pump', !!w2 && w2.value === 'link:P1' && (w2.children || w2.childNodes).length === 3);
L.openPopup('J1', 10, 10);
ok('an ordinary junction has no such chooser', !gsel('lpn_pgraph_member'));

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

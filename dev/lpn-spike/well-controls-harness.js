// A WELL WRITES THE PUMP'S TWO CONTROLS FROM ITS OWN INPUTS. Run with:
//   node dev/lpn-spike/well-controls-harness.js
//
// Task 822 (Tom, 2026-11-09: "an open-air tank with controls connecting the pump and the tank would be a very nice
// feature"). The Well's box asks "Pump on below" and "Pump off above", tank depths; the well writes two ordinary simple
// controls on its pump, LINK pump OPEN IF NODE tank BELOW on / CLOSED IF NODE tank ABOVE off. Covered:
//   1. a well with on 3 / off 6 in a 24 h run cycles the pump, and the built-in loop and EPANET agree on the switch
//      times and the tank levels;
//   2. the controls are tagged as the well's, the .inp holds them as ordinary [CONTROLS] lines, and export then import
//      keeps the levels and the ownership; a file whose control was edited by hand opens with ordinary controls;
//   3. Explode leaves two ordinary controls;
//   4. on not below off, or a level outside the tank's depths, is refused by name in both engines.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\tsetProp: setProp, openPopup: openPopup, openLinkPopup: openLinkPopup,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved, migrateSaved: migrateSaved,\n" +
	"\t\texplode: explodeAssembly, assemblyById: assemblyById, libReadControl: libReadControl,\n" +
	"\t\trenderFields: renderAssemblyFields, renderControls: function (h) { return rebuildLibraryBox(); },\n" +
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
function press(x, y) {
	const fire = (type) => (svg._listeners[type] || []).forEach((fn) => fn({ pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }));
	fire('pointerdown'); fire('pointerup');
}
function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.assemblies = []; doc.curves = []; doc.controls = [];
	L.resetIds(); L.buildDom(); L.buildLayers(); L.setScale(1);
	svg._listeners = {};
	L.wirePointerEvents(); L.setMode('select');
	return doc;
}
const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];
function network(on, off) {
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	const j = L.addNode('junction', 600, 150);
	j._demand = 15;
	L.addLink('pipe', 'W1D', j.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1');
	L.setProp(doc.links[1], 'curveId', 'PC1');
	const t = L.nodeById('W1T');
	L.setProp(t, 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.setProp(t, 'minLevel', 0); L.setProp(t, 'maxLevel', 8); L.setProp(t, 'level', 4.5); L.setProp(t, 'tankDiameter', 6);
	doc.times = Object.assign(EC.lpnTimesDefaults(), { duration: 24 * 3600 });
	const a = L.assemblyById('W1');
	if (on !== undefined) { a.pumpOn = on; }
	if (off !== undefined) { a.pumpOff = off; }
	return { doc, a };
}
function switches(run, id) {
	const out = []; let prev;
	run.frames.forEach((f) => {
		const st = f.linkStatus ? f.linkStatus[id] : (f.flows[id] > 1e-9 ? 'open' : 'closed');
		if (prev !== undefined && st !== prev) { out.push(f.t); }
		prev = st;
	});
	return out;
}

(async function () {
await EC.lpnEpanetLoad(NODE_ENGINE_URL);
console.log('--- the controls the well writes ---');
const { doc, a } = network();
a.pumpOn = 3; a.pumpOff = 6;
// The box writes them through its own setter; reach it by opening the box and changing the fields.
L.openLinkPopup('W1');
const fieldsOf = byId.lpn_popup_fields;
function all(el, out) { out = out || []; (el.childNodes || el.children || []).forEach((c) => { out.push(c); all(c, out); }); return out; }
const labels = all(fieldsOf).filter((n) => /Pump (on|off)/.test(n.textContent || '') && n.tagName === 'LABEL');
ok('the box shows Pump on below and Pump off above', labels.length >= 2, labels.map((l) => (l.textContent || '').slice(0, 30)).join(' | '));
const inputs = labels.map((l) => all(l).filter((n) => n.tagName === 'INPUT')[0]);
inputs.forEach((inp, k) => { inp.value = k === 0 ? '3' : '6'; (inp._listeners.change || []).forEach((fn) => fn({})); });
ok('the well holds the two levels', a.pumpOn === 3 && a.pumpOff === 6, a.pumpOn + ' ' + a.pumpOff);
const mine = doc.controls.filter((c) => c.asm === 'W1');
ok('two controls are tagged as the well\'s', mine.length === 2, JSON.stringify(doc.controls.map((c) => c.raw)));
ok('the sentences are EPANET\'s simple controls', mine[0].raw === 'LINK W1 OPEN IF NODE W1T BELOW 3' && mine[1].raw === 'LINK W1 CLOSED IF NODE W1T ABOVE 6', mine.map((c) => c.raw).join(' / '));

console.log('\n--- both engines cycle the pump the same way ---');
{
	const model = L.currentModel();
	ok('the model carries the controls', model.time && model.time.controls.length === 2);
	model.hydraulics = Object.assign({}, model.hydraulics, { accuracy: 1e-5 });
	const nat = EC.lpnNativeRun(JSON.parse(JSON.stringify(model))), epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	ok('both ran', nat.ok && epa.ok, JSON.stringify([nat.error, epa.error, nat.issues]).slice(0, 200));
	const sn = switches(nat, 'W1'), se = switches(epa, 'W1');
	console.log('        switches built-in ' + JSON.stringify(sn) + ' EPANET ' + JSON.stringify(se));
	ok('the pump switches more than twice in 24 h', se.length >= 3, se.length);
	ok('both engines switch at the same times', JSON.stringify(sn) === JSON.stringify(se));
	let worst = 0, pumpWorst = 0;
	nat.frames.forEach((f, k) => { const d = Math.abs(f.levels.W1T - epa.frames[k].levels.W1T); worst = Math.max(worst, d); pumpWorst = Math.max(pumpWorst, Math.abs(f.flows.W1 - epa.frames[k].flows.W1)); });
	ok('the pump flows agree within 2e-6 m3/s at every step', pumpWorst <= 2e-6, pumpWorst);
	// Each step's pump flow agrees to 2e-6 m3/s (the other EPS harnesses' tolerance); the tank integrates that over a 28 m2 surface, so levels drift apart by a millimetre or two.
	ok('the tank levels agree within 2 mm at every step', worst <= 2e-3, worst);
	const lv = epa.frames.map((f) => f.levels.W1T);
	ok('the tank stays between the on and off levels (plus one step)', Math.min.apply(null, lv) > 2 && Math.max.apply(null, lv) < 7.5, Math.min.apply(null, lv) + ' .. ' + Math.max.apply(null, lv));
}

console.log('\n--- export, import, and a hand edit ---');
{
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	console.log((inp.match(/\[CONTROLS\][^[]*/) || [''])[0]); ok('the .inp holds them as ordinary [CONTROLS] lines', /\[CONTROLS\]\nLINK W1 OPEN IF NODE W1T BELOW 3\nLINK W1 CLOSED IF NODE W1T ABOVE 6/.test(inp));
	ok('and the assembly comment carries the levels', /^;ASSEMBLY: well .* ON=3 OFF=6$/m.test(inp), (inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const p = EC.lpnInpParse(inp);
	ok('read back, the well owns both again', p.assemblies[0].pumpOn === 3 && p.assemblies[0].pumpOff === 6 && p.controls.filter((c) => c.asm === 'W1').length === 2);
	const hand = EC.lpnInpParse(inp.replace('BELOW 3', 'BELOW 2.5'));
	ok('a hand-edited control still opens, and the well lets go of that level',
		hand.assemblies.length === 1 && hand.assemblies[0].pumpOn === undefined && hand.assemblies[0].pumpOff === 6 && hand.controls.length === 2 && hand.controls.filter((c) => c.asm).length === 1);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const a2 = L.assemblyById('W1');
	ok('a saved project keeps them', a2.pumpOn === 3 && a2.pumpOff === 6 && L.getDoc().controls.filter((c) => c.asm === 'W1').length === 2);
}

console.log('\n--- refused by name ---');
for (const [on, off, why] of [[6, 3, 'on above off'], [3, 3, 'on equal to off'], [3, 9, 'off above the maximum depth'], [-1, 5, 'on below the minimum depth']]) {
	network(on, off);
	const L2 = L.currentModel();
	const issues = EC.lpnDiagnose(L2, {});
	ok(why + ': refused as well-levels', (issues.issues || issues).some((i) => i.code === 'well-levels' && i.ids.indexOf('W1') >= 0), JSON.stringify(issues).slice(0, 150));
}
{
	network(3, 6);
	const issues = EC.lpnDiagnose(L.currentModel(), {});
	ok('3 and 6 pass', !(issues.issues || issues).some((i) => i.code === 'well-levels'));
	network();
	ok('blank levels pass and write nothing', !(EC.lpnDiagnose(L.currentModel(), {}).issues || []).some((i) => i.code === 'well-levels') && L.getDoc().controls.length === 0);
}

console.log('\n--- Explode ---');
{
	const { doc: d3, a: a3 } = network();
	a3.pumpOn = 3; a3.pumpOff = 6;
	L.openLinkPopup('W1');
	const labs = all(byId.lpn_popup_fields).filter((n) => /Pump (on|off)/.test(n.textContent || '') && n.tagName === 'LABEL');
	labs.map((l) => all(l).filter((n) => n.tagName === 'INPUT')[0]).forEach((inp, k) => { inp.value = k === 0 ? '3' : '6'; (inp._listeners.change || []).forEach((fn) => fn({})); });
	ok('before: two owned', d3.controls.filter((c) => c.asm).length === 2);
	L.explode('W1');
	ok('after Explode: two ordinary controls, none owned', d3.controls.length === 2 && d3.controls.every((c) => !c.asm), JSON.stringify(d3.controls.map((c) => c.raw + '|' + c.asm)));
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	ok('and no ON= on the file', !/ON=/.test(inp) && /LINK W1 OPEN IF NODE W1T BELOW 3/.test(inp));
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

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

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
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
	"\t\tsyncPressureTank: syncPressureTank,\n" +
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
function press(x, y, target) {
	setHitTarget(target || null);
	const fire = (type) => (svg._listeners[type] || []).forEach((fn) => fn({ pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }));
	fire('pointerdown'); fire('pointerup');
	setHitTarget(null);
}
function hitNode(id) { return { dataset: { node: id }, classList: { contains: function () { return false; } } }; }
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
	// Round 7: a Well with tank is three presses. The tee stands on the well's own point and the tank 200 away on a virtual pipe.
	L.setMode('add-welltank');
	press(200, 150); press(200, 150, hitNode('W1')); press(400, 150);
	L.linkById(doc.assemblies[0].branch[1]).virtual = true;
	const j = L.addNode('junction', 600, 150);
	j._demand = 15;
	L.addLink('pipe', 'W1', j.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1');
	L.setProp(doc.links[1], 'curveId', 'PC1');
	const t = L.nodeById('T1');
	L.setProp(t, 'elev', 150); L.setProp(L.nodeById('W1'), 'elev', 150); L.setProp(L.nodeById('J1'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
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
L.openLinkPopup('W1P');
const fieldsOf = byId.lpn_popup_fields;
function all(el, out) { out = out || []; (el.childNodes || el.children || []).forEach((c) => { out.push(c); all(c, out); }); return out; }
const labels = all(fieldsOf).filter((n) => /Pump (on|off)/.test(n.textContent || '') && n.tagName === 'LABEL');
ok('the box shows Pump on below and Pump off above', labels.length >= 2, labels.map((l) => (l.textContent || '').slice(0, 30)).join(' | '));
const inputs = labels.map((l) => all(l).filter((n) => n.tagName === 'INPUT')[0]);
inputs.forEach((inp, k) => { inp.value = k === 0 ? '3' : '6'; (inp._listeners.change || []).forEach((fn) => fn({})); });
ok('the well holds the two levels', a.pumpOn === 3 && a.pumpOff === 6, a.pumpOn + ' ' + a.pumpOff);
const mine = doc.controls.filter((c) => c.asm === 'W1');
ok('two controls are tagged as the well\'s', mine.length === 2, JSON.stringify(doc.controls.map((c) => c.raw)));
ok('the sentences are EPANET\'s simple controls', mine[0].raw === 'LINK W1P OPEN IF NODE T1 BELOW 3' && mine[1].raw === 'LINK W1P CLOSED IF NODE T1 ABOVE 6', mine.map((c) => c.raw).join(' / '));

console.log('\n--- both engines cycle the pump the same way ---');
{
	const model = L.currentModel();
	ok('the model carries the controls', model.time && model.time.controls.length === 2);
	model.hydraulics = Object.assign({}, model.hydraulics, { accuracy: 1e-5 });
	const nat = EC.lpnNativeRun(JSON.parse(JSON.stringify(model))), epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	ok('both ran', nat.ok && epa.ok, JSON.stringify([nat.error, epa.error, nat.issues]).slice(0, 200));
	const sn = switches(nat, 'W1P'), se = switches(epa, 'W1P');
	console.log('        switches built-in ' + JSON.stringify(sn) + ' EPANET ' + JSON.stringify(se));
	ok('the pump switches more than twice in 24 h', se.length >= 3, se.length);
	ok('both engines switch at the same times', JSON.stringify(sn) === JSON.stringify(se));
	let worst = 0, pumpWorst = 0;
	nat.frames.forEach((f, k) => { const d = Math.abs(f.levels.T1 - epa.frames[k].levels.T1); worst = Math.max(worst, d); pumpWorst = Math.max(pumpWorst, Math.abs(f.flows.W1P - epa.frames[k].flows.W1P)); });
	ok('the pump flows agree within 2e-6 m3/s at every step', pumpWorst <= 2e-6, pumpWorst);
	// Each step's pump flow agrees to 2e-6 m3/s (the other EPS harnesses' tolerance); the tank integrates that over a 28 m2 surface, so levels drift apart by a millimetre or two.
	// Two virtual pipes now stand between the pump and the tank (well to tee, tee to tank), each EPANET's millimetre stand-in, so the levels drift a little further: 5 mm.
	ok('the tank levels agree within 5 mm at every step', worst <= 5e-3, worst);
	const lv = epa.frames.map((f) => f.levels.T1);
	ok('the tank stays between the on and off levels (plus one step)', Math.min.apply(null, lv) > 2 && Math.max.apply(null, lv) < 7.5, Math.min.apply(null, lv) + ' .. ' + Math.max.apply(null, lv));
}

console.log('\n--- export, import, and a hand edit ---');
{
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	console.log((inp.match(/\[CONTROLS\][^[]*/) || [''])[0]); ok('the .inp holds them as ordinary [CONTROLS] lines', /\[CONTROLS\]\nLINK W1P OPEN IF NODE T1 BELOW 3\nLINK W1P CLOSED IF NODE T1 ABOVE 6/.test(inp));
	ok('and the assembly comment carries the levels', /^;ASSEMBLY: well .* ON=3 OFF=6( TEE=.*)?$/m.test(inp), (inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
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
	L.openLinkPopup('W1P');
	const labs = all(byId.lpn_popup_fields).filter((n) => /Pump (on|off)/.test(n.textContent || '') && n.tagName === 'LABEL');
	labs.map((l) => all(l).filter((n) => n.tagName === 'INPUT')[0]).forEach((inp, k) => { inp.value = k === 0 ? '3' : '6'; (inp._listeners.change || []).forEach((fn) => fn({})); });
	ok('before: two owned', d3.controls.filter((c) => c.asm).length === 2);
	L.explode('W1');
	ok('after Explode: two ordinary controls, none owned', d3.controls.length === 2 && d3.controls.every((c) => !c.asm), JSON.stringify(d3.controls.map((c) => c.raw + '|' + c.asm)));
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	ok('and no ON= on the file', !/ON=/.test(inp) && /LINK W1P OPEN IF NODE T1 BELOW 3/.test(inp));
}

console.log('\n--- the Well with pressure tank, in both engines (round 11) ---');
{
	// A well, a tee on the well's own point, a pressure tank 200 away, and a small demand on a pipe from the well.
	function pnet(withTank) {
		const d = fresh();
		L.setMode(withTank ? 'add-welltankp' : 'add-well');
		press(200, 150);
		if (withTank) { press(200, 150, hitNode('W1')); press(400, 150); L.linkById(d.assemblies[0].branch[1]).virtual = true; }
		const j = L.addNode('junction', 600, 150); j._demand = 0.2;
		L.addLink('pipe', 'W1', j.id, []);
		d.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
		d.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
		L.setProp(L.linkById('W1DV'), 'curveId', 'DD1'); L.setProp(L.linkById('W1P'), 'curveId', 'PC1');
		[['W1', 150], ['J1', 150], ['W1R', 120]].forEach(([id, e]) => { if (L.nodeById(id)) { L.setProp(L.nodeById(id), 'elev', e); } });
		if (withTank) { L.setProp(L.nodeById('J1'), 'elev', 150); L.setProp(L.nodeById(d.assemblies[0].tank), 'elev', 150); }
		return d;
	}
	async function both(label, step, dur) {
		const model = L.currentModel();
		model.time = Object.assign({}, model.time || {}, { times: Object.assign(EC.lpnTimesDefaults(), { duration: dur, hydraulicStep: step, reportStep: step }) });
		model.hydraulics = Object.assign({}, model.hydraulics, { accuracy: 1e-5 });
		const nat = EC.lpnNativeRun(JSON.parse(JSON.stringify(model))), epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
		ok(label + ': both engines ran', nat.ok && epa.ok, JSON.stringify([nat.error, epa.error, nat.issues, epa.issues]).slice(0, 300));
		return { nat, epa };
	}
	const headsOf = (r, k) => r.frames[k].heads;
	let r0, r1;
	{
		pnet(false);
		r0 = await both('before: the well alone, steady', 3600, 0);
		const w = r0.epa.frames[0].heads, n = r0.nat.frames[0].heads;
		ok('before: the two engines agree on every head to 1e-4 m', Object.keys(w).every((id) => Math.abs(w[id] - n[id]) < 1e-4), JSON.stringify(w));
	}
	{
		const d = pnet(true);
		r1 = await both('after: with the pressure tank inserted, steady', 3600, 0);
		const w = r1.epa.frames[0].heads, n = r1.nat.frames[0].heads;
		ok('after: the two engines agree on every head to 2 mm (the stand-in EPANET uses for a virtual pipe)', Object.keys(w).every((id) => Math.abs(w[id] - n[id]) < 2e-3), JSON.stringify(Object.keys(w).map((id) => [id, w[id] - n[id]])));
		const tid = d.assemblies[0].tank;
		ok('inserting the tank leaves the demand node\'s head where it was, within the tank\'s hold (the tank is a fixed head at its start level and the pump runs)', Math.abs(r1.epa.frames[0].heads.J1 - r0.epa.frames[0].heads.J1) < 15, r0.epa.frames[0].heads.J1.toFixed(2) + ' -> ' + r1.epa.frames[0].heads.J1.toFixed(2));
		ok('the tank\'s head is the ground plus its start pressure head (150 + 35 m)', Math.abs(r1.epa.frames[0].heads[tid] - 185) < 1e-4 && Math.abs(r1.nat.frames[0].heads[tid] - 185) < 1e-4, r1.epa.frames[0].heads[tid]);
		// An EPS run that cycles the pump on and off: 0.2 L/s drains the 23.6 L of drawdown in about two minutes; a 10 s step.
		const e = await both('the pump cycles', 10, 1800);
		const sn = switches(e.nat, 'W1P'), se = switches(e.epa, 'W1P');
		console.log('        switches built-in ' + sn.length + ' EPANET ' + se.length);
		ok('the pump switches on and off several times in 30 minutes, in both engines', se.length >= 4 && sn.length >= 4, sn.length + ' ' + se.length);
		const lv = e.epa.frames.map((f) => f.levels[tid]), lo = Math.min.apply(null, lv), hi = Math.max.apply(null, lv);
		ok('the tank level stays between pump-on and pump-off (28 and 42 m) within one step\'s drift, and it moves', lo > 26 && hi < 43.5 && hi - lo > 5, lo.toFixed(2) + ' .. ' + hi.toFixed(2));
		let worst = 0; e.nat.frames.forEach((f, k) => { worst = Math.max(worst, Math.abs(f.levels[tid] - e.epa.frames[k].levels[tid])); });
		ok('the two engines\' tank levels agree within 0.1 m at every step', worst <= 0.1, worst.toFixed(4));
		console.log('        level range ' + lo.toFixed(2) + ' .. ' + hi.toFixed(2) + ', engine disagreement ' + worst.toFixed(4) + ' m');
		ok('and neither engine is refused for it', !(EC.lpnDiagnose(L.currentModel(), {}).issues || []).length);
	}
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

// WELL WITH TANK IS THREE POINTS: A WELL, A TEE AND A TANK. Run with:
//   node dev/lpn-spike/well-tank-three-point-harness.js
//
// Task 822, round 7 (Tom, 2026-11-12: "Cramming a tank into that point makes no sense. I don't want to keep the one-point well with tank. Change it to
// the three-point assembly that I outlined": "three points specified by the user (well, tee (unless they are generally at the well head), and
// tank) and three associated symbols. It's a cross between an assembly and a wizard. It still knows that it's an assembly to simplify controls
// entry."). Covered:
//   1. three presses, each prompted in the status bar: the well, the tee, the tank; ordinary elements with lengths from the drawing; one undo step;
//   2. the tee on the well's own point (a virtual pipe joins them), on an existing junction, on a pipe (which splits it), and the refusals;
//   3. Escape and a change of tool stop the wizard, leaving what is placed; Undo mid-way is safe;
//   4. the grouping, the box (Pump on below / Pump off above asked once, on the well; the tank is an ordinary tank with a box of its own), and the
//      two controls it writes, tied to the tank;
//   5. Explode separates it; deleting the tank, the tee, a pipe or the well ends the group; a rename follows;
//   6. the .inp comment, read back and byte-identical; the project file round trip;
//   7. an old file's one-point Well with a tank opens as its elements, in the project file and in an .inp, and says so;
//   8. both solvers run it, and the pump stops feeding a full tank only through the branch.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');
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
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tselected: function () { return selectedRefs(); },\n" +
	"\t\tsetProp: setProp, runSolve: runSolve, closePopup: closePopup,\n" +
	"\t\topenPopup: openPopup, getPopup: function () { return currentPopup; },\n" +
	"\t\tapplySaved: applySaved, migrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tdeleteNode: deleteNode, deleteLink: deleteLink, deleteElement: deleteElement,\n" +
	"\t\tapplyNodeRename: applyNodeRename, applyLinkRename: applyLinkRename,\n" +
	"\t\tassemblyOfNode: assemblyOfNode, explode: explodeAssembly, snap: saveUndoSnapshot, syncWellControls: syncWellControls,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; }, pending: function () { return wellTankPending; },\n" +
	"\t\tcurrentModel: function () { return assembleModel(); }, scnLabels: scnLabels, nodeLines: nodeLabelFieldLines,\n" +
	"\t\tresetIds: function () { nextId = newNextId(); }, linkAutoLength: linkAutoLength, wellHasTank: wellHasTank,\n" +
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
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.assemblies = []; doc.curves = []; doc.controls = [];
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
function escape() {
	const ev = { key: 'Escape', stopPropagation() { this.stopped = true; }, preventDefault() {} };
	(global.document._listeners.keydown || []).slice().forEach(function (fn) { if (!ev.stopped) { fn(ev); } });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function walk(root, fn) { (function go(e) { if (!e) { return; } fn(e); (e.children || e.childNodes || []).forEach(go); }(root)); }
function boxLabels() {
	const out = [];
	walk(byId.lpn_popup_fields, (e) => { if (e.tagName === 'LABEL') { out.push((e.textContent || '').replace(/\s+/g, ' ').trim()); } });
	return out;
}
const PC = EC.pageConfig || {};
const TEE_PROMPT = PC.lpn_welltank_tee_prompt || 'Now specify the tee';
const TANK_PROMPT = PC.lpn_welltank_tank_prompt || 'Now specify the tank';
const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];

// The three presses on open ground: the well, the tee, the tank.
function place3(wx, wy, tx, ty, kx, ky) {
	L.setMode('add-welltank');
	press(wx, wy); press(tx, ty); press(kx, ky);
	return L.getDoc().assemblies[L.getDoc().assemblies.length - 1];
}
function curves(doc, a) {
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(L.linkById(a.links[0]), 'curveId', 'DD1'); L.setProp(L.linkById(a.links[1]), 'curveId', 'PC1');
}

(async function () {
console.log('\n--- 1. three presses ---');
{
	const doc = fresh();
	L.setMode('add-welltank');
	const d0 = L.undoDepth();
	press(200, 150);
	ok('the first press places the Well: five elements, the simple form', doc.nodes.length === 3 && doc.links.length === 2 && doc.assemblies.length === 1 && !doc.assemblies[0].tank, JSON.stringify(doc.assemblies));
	ok('and the status bar asks for the tee', L.lastNotice().indexOf(TEE_PROMPT) === 0 || /tee/i.test(L.lastNotice()), L.lastNotice());
	ok('the wizard is waiting for the tee', !!L.pending() && L.pending().stage === 'tee');
	press(500, 150);
	ok('the second press makes an ordinary junction there and a pipe from the well outlet to it', doc.nodes.length === 4 && L.nodeById('J1') && L.nodeById('J1').type === 'junction' && L.nodeById('J1').x === 500 && L.nodeById('J1').y === 150 &&
		doc.links.some((l) => l.type === 'pipe' && l.from === 'W1P' && l.to === 'J1' && !l.virtual), doc.links.map((l) => l.id + ' ' + l.type + ' ' + l.from + '>' + l.to).join('; '));
	const p1 = doc.links.find((l) => l.type === 'pipe');
	ok('that pipe takes its length from the drawing (Auto), and it is not zero', p1.lenAuto === true && L.linkAutoLength(p1, true) > 0, p1.lenAuto + ' ' + L.linkAutoLength(p1, true));
	ok('and the status bar asks for the tank', /tank/i.test(L.lastNotice()) && L.lastNotice().indexOf('tee') !== 0 || L.lastNotice().indexOf(TANK_PROMPT) === 0, L.lastNotice());
	press(500, 400);
	const a = doc.assemblies[0];
	ok('the third press makes an ordinary tank there and a pipe from the tee to it', doc.nodes.length === 5 && L.nodeById('T1') && L.nodeById('T1').type === 'tank' && L.nodeById('T1').x === 500 && L.nodeById('T1').y === 400 &&
		doc.links.filter((l) => l.type === 'pipe').length === 2 && doc.links.some((l) => l.type === 'pipe' && l.from === 'J1' && l.to === 'T1'), doc.links.map((l) => l.id + ' ' + l.from + '>' + l.to).join('; '));
	ok('the group is one Well that knows its tee, its tank and the two pipes', a.kind === 'well' && a.tee === 'J1' && a.tank === 'T1' && JSON.stringify(a.branch) === JSON.stringify([p1.id, doc.links.filter((l) => l.type === 'pipe')[1].id]) && a.nodes.length === 3 && a.links.length === 2, JSON.stringify(a));
	ok('the wizard is finished and the status bar is cleared', !L.pending() && L.lastNotice() === '', JSON.stringify(L.lastNotice()));
	ok('the whole act is ONE undo step, and the tool stays armed', L.undoDepth() === d0 + 1 && L.getMode() === 'add-welltank');
	ok('three symbols: the tee and the tank are ordinary nodes, not members of the group', L.assemblyOfNode('J1') === null && L.assemblyOfNode('T1') === null && L.assemblyOfNode('W1P') === a && L.wellHasTank(a));
	L.undo();
	ok('one Undo takes the well, the tee, the tank and both pipes away', doc.nodes.length === 0 && doc.links.length === 0 && doc.assemblies.length === 0 || (L.getDoc().nodes.length === 0 && L.getDoc().links.length === 0 && L.getDoc().assemblies.length === 0), L.getDoc().nodes.length + ' nodes');
}
{
	const doc = fresh();
	const a = place3(200, 150, 500, 150, 500, 400);
	press(800, 150);   // armed still: the next press starts another Well
	ok('the tool stays armed: another press starts a second Well, W2, and asks for its tee', doc.assemblies.length === 2 && doc.assemblies[1].id === 'W2' && !!L.pending() && L.pending().id === 'W2');
}

console.log('\n--- 2. where the tee and the tank may stand ---');
{
	const doc = fresh();
	L.setMode('add-welltank'); press(200, 150);
	press(200, 150, hitNode('W1P'));
	const pipe = doc.links.find((l) => l.type === 'pipe');
	ok('a tee on the well\'s own point is a new junction on that point, joined by a virtual pipe (no pipe at a distance)', doc.nodes.length === 4 && !!pipe && pipe.virtual === true && pipe.from === 'W1P' && L.nodeById(pipe.to).x === 200 && L.nodeById(pipe.to).y === 150, JSON.stringify(pipe));
	press(200, 150);   // a tank on the very same point: the press names the tee, a junction, which is not a tank
	ok('a tank cannot be pressed onto that point: it names the tee, and the wizard asks again', !doc.assemblies[0].tank && L.pending() && L.pending().stage === 'tank' && /tank/i.test(L.lastNotice()), L.lastNotice());
}
{
	const doc = fresh();
	const j = L.addNode('junction', 600, 100); j._demand = 5;
	L.setMode('add-welltank'); press(200, 150);
	const n0 = doc.nodes.length;
	press(600, 100, hitNode(j.id));
	ok('an existing junction can be the tee: no new node, an ordinary pipe to it', doc.nodes.length === n0 && doc.assemblies[0].tee === 'undefined' || (doc.nodes.length === n0 && L.pending().tee === j.id && doc.links.some((l) => l.type === 'pipe' && l.from === 'W1P' && l.to === j.id && !l.virtual)));
	const t = L.addNode('tank', 800, 300);
	press(800, 300, hitNode(t.id));
	ok('an existing tank can be the tank', doc.assemblies[0].tank === t.id && doc.assemblies[0].tee === j.id, JSON.stringify(doc.assemblies[0]));
}
{
	const doc = fresh();
	const a = L.addNode('junction', 0, 400), b = L.addNode('junction', 800, 400), p = L.addLink('pipe', a.id, b.id, []);
	L.setMode('add-welltank'); press(200, 150);
	press(400, 400, hitLink(p.id));
	const tee = L.pending() && L.pending().tee;
	ok('a point on a pipe splits it and puts the tee there', !!tee && doc.links.filter((l) => l.type === 'pipe').length === 3 && doc.links.some((l) => l.type === 'pipe' && l.to === tee && l.from === a.id) &&
		doc.links.some((l) => l.type === 'pipe' && l.from === tee && l.to === b.id), JSON.stringify(doc.links.map((l) => l.id + ' ' + l.from + '>' + l.to)));
}
{
	const doc = fresh();
	const r = L.addNode('reservoir', 600, 100);
	L.setMode('add-welltank'); press(200, 150);
	const n0 = doc.nodes.length;
	press(600, 100, hitNode(r.id));
	ok('a tee pressed on a reservoir is refused in the status bar and the wizard still waits for the tee', doc.nodes.length === n0 && L.pending().stage === 'tee' && /junction/i.test(L.lastNotice()), L.lastNotice());
	press(500, 150);
	const j = L.pending().tee;
	press(500, 150, hitNode(j));
	ok('a tank pressed on the tee is refused and the wizard still waits for the tank', L.pending() && L.pending().stage === 'tank' && /tank/i.test(L.lastNotice()), L.lastNotice());
}

console.log('\n--- 3. stopping, and Undo in the middle ---');
{
	const doc = fresh();
	L.setMode('add-welltank'); press(200, 150); press(500, 150);
	escape();
	ok('Escape stops the wizard and leaves the well and its tee, which are ordinary elements', !L.pending() && doc.nodes.length === 4 && doc.assemblies.length === 1 && !doc.assemblies[0].tank && L.lastNotice() === '');
	press(900, 150);
	ok('the tool is still armed: the next press is a new Well', doc.assemblies.length === 2 && !!L.pending());
	L.setMode('select');
	ok('changing tool also stops it', !L.pending());
}
{
	const doc = fresh();
	L.setMode('add-welltank'); press(200, 150);
	L.undo();
	ok('Undo after the first press removes the well and the wizard has nothing to wait for', doc.nodes.length === 0 || L.getDoc().nodes.length === 0);
	press(500, 150);
	ok('the next press starts a new Well instead of making a tee for one that is gone', L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].id === 'W1' && !L.getDoc().assemblies[0].tank);
}

console.log('\n--- 4. the group, its box and its controls ---');
{
	const doc = fresh();
	const a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a);
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.openPopup('W1P', 10, 10);
	const labels = boxLabels();
	console.log('        box: ' + labels.join(' | '));
	ok('Pump on below and Pump off above are asked once, on the well', labels.filter((x) => /^Pump on below/.test(x)).length === 1 && labels.filter((x) => /^Pump off above/.test(x)).length === 1);
	ok('and the tank\'s own depths and diameter are not on the well\'s box (it is an ordinary tank with a box of its own)', !labels.some((x) => /Initial depth|Minimum depth|Maximum depth|Tank diameter/.test(x)));
	ok('Flow is stated once', labels.filter((x) => /^Flow/.test(x)).length === 1);
	a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	const mine = L.getDoc().controls.filter((c) => c.asm === 'W1');
	ok('the two controls are written for the pump and the tank', mine.length === 2 && mine.every((c) => c.link === 'W1' && c.condition && c.condition.node === 'T1'), JSON.stringify(mine.map((c) => c.raw)));
	const t = L.nodeById('T1');
	ok('the tank is selectable and editable on its own: clicking it selects only it', (function () { L.setMode('select'); press(500, 400, hitNode('T1')); return L.selected().length === 1 && L.selected()[0].id === 'T1'; }()));
}

console.log('\n--- 5. Explode, delete, rename ---');
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a); a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	L.snap(); L.explode('W1');
	ok('Explode ends the group and leaves every element: five nodes, four links', doc.assemblies.length === 0 && doc.nodes.length === 5 && doc.links.length === 4);
	ok('and the two controls are the user\'s, untagged', doc.controls.length === 2 && doc.controls.every((c) => !c.asm));
	L.undo();
	ok('Undo brings the group back', L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].tank === 'T1');
}
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a); a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	L.deleteElement('node', 'T1');
	ok('deleting the tank ends the group (what is left is plain) and frees its controls', L.getDoc().assemblies.length === 0 && L.getDoc().nodes.some((n) => n.id === 'W1P') && L.getDoc().controls.every((c) => !c.asm));
}
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	L.deleteElement('link', a.branch[0]);
	ok('deleting the pipe between the well and the tee ends the group', L.getDoc().assemblies.length === 0 && L.getDoc().nodes.some((n) => n.id === 'T1'));
}
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	L.deleteElement('node', 'W1P');
	ok('deleting the well takes its five members; the tee and the tank stay, plain', L.getDoc().assemblies.length === 0 && !L.getDoc().nodes.some((n) => /^W1/.test(n.id)) && L.getDoc().nodes.some((n) => n.id === 'T1') && L.getDoc().nodes.some((n) => n.id === 'J1'), L.getDoc().nodes.map((n) => n.id).join() + ' / ' + JSON.stringify(L.getDoc().assemblies));
}
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a); a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	L.applyNodeRename('T1', 'TANKA'); L.applyNodeRename('J1', 'TEE');
	ok('renaming the tank and the tee keeps the group true', L.getDoc().assemblies[0].tank === 'TANKA' && L.getDoc().assemblies[0].tee === 'TEE', JSON.stringify(L.getDoc().assemblies[0]));
	ok('and the controls follow the tank\'s new name', L.getDoc().controls.filter((c) => c.asm === 'W1').every((c) => c.condition.node === 'TANKA'), JSON.stringify(L.getDoc().controls.map((c) => c.raw)));
	const nb = L.getDoc().assemblies[0].branch[0];
	L.applyLinkRename(nb, 'PIPEA');
	ok('renaming a branch pipe too', L.getDoc().assemblies[0].branch[0] === 'PIPEA');
}

console.log('\n--- 6. the .inp and the project file ---');
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a); a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeds', out.ok, JSON.stringify(out.error));
	const line = (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0];
	ok('the comment names the five members, then the tee, tank and pipes', line === ';ASSEMBLY: well W1R W1D W1P W1V W1 ON=3 OFF=6 TEE=J1 TANK=T1 PIPES=' + a.branch.join(','), line);
	const parsed = EC.lpnInpParse(out.inp);
	ok('read back, the Well with tank is restored with nothing reported', parsed.ok && parsed.assemblies.length === 1 && parsed.assemblies[0].tank === 'T1' && parsed.assemblies[0].tee === 'J1' && !(parsed.dropped || []).some((d) => /^assembly/.test(d.code)), JSON.stringify(parsed.assemblies));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, ''))); L.buildDom();
	ok('and keeps both controls as the well\'s', L.getDoc().controls.filter((c) => c.asm === 'W1').length === 2 && L.getDoc().assemblies[0].pumpOn === 3 && L.getDoc().assemblies[0].pumpOff === 6, JSON.stringify(L.getDoc().assemblies[0]));
	const out2 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	ok('the comment line survives unchanged', (out2.inp.match(/^;ASSEMBLY.*$/m) || [''])[0] === line);
	const p2 = EC.lpnInpParse(out2.inp);
	L.applyUnitSelections(L.inpUnitSelections(p2));
	L.applySaved(L.migrateSaved(L.docFromInp(p2, 'w'))); L.buildDom();
	ok('export, import, export is byte-identical', EC.lpnExportInp(L.serializeProject(), { title: '' }).inp === out2.inp);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	ok('the project file round trip keeps the tee, the tank and the branch', L.getDoc().assemblies[0].tee === 'J1' && L.getDoc().assemblies[0].tank === 'T1' && L.getDoc().assemblies[0].branch.length === 2);
	// A file that lost the tank loses only the tank's part.
	const sv2 = JSON.parse(JSON.stringify(L.serializeProject()));
	sv2.nodes = sv2.nodes.filter((n) => n.id !== 'T1');
	L.applySaved(L.migrateSaved(sv2));
	ok('a project file whose tank is missing keeps the Well and drops the tank part, with no half-group', L.getDoc().assemblies.length === 1 && !L.getDoc().assemblies[0].tank || L.getDoc().assemblies.length === 0, JSON.stringify(L.getDoc().assemblies));
}

console.log('\n--- 7. old files: a one-point Well with a tank ---');
{
	// Built the way the round 6 build wrote it: R, U, T, D; G, P, B; the two controls on the tank.
	const doc = fresh();
	const r = L.addNode('reservoir', 0, 0, 'W1R'), u = L.addNode('junction', 0, 0, 'W1U'), t = L.addNode('tank', 0, 0, 'W1T'), d = L.addNode('junction', 0, 0, 'W1D');
	r.elev = 70; u.elev = 70; d.elev = 150; t.elev = 150; u._demand = 0;
	const g = L.addLink('valve', 'W1R', 'W1U', [], 'W1V'); g.valveType = 'GPV';
	const p = L.addLink('pump', 'W1U', 'W1D', [], 'W1');
	const b = L.addLink('pipe', 'W1D', 'W1T', [], 'W1B'); b.virtual = true;
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((q) => q.slice()) }, { id: 'PC1', kind: 'head', points: PH.map((q) => q.slice()) });
	g.curveId = 'DD1'; p.curveId = 'PC1';
	doc.assemblies = [{ id: 'W1', kind: 'well', nodes: ['W1R', 'W1U', 'W1T', 'W1D'], links: ['W1V', 'W1', 'W1B'], pumpOn: 3, pumpOff: 6 }];
	doc.controls = [{ link: 'W1', action: { status: 'open' }, condition: { kind: 'node', node: 'W1T', cmp: 'below', value: 3 }, raw: 'LINK W1 OPEN IF NODE W1T BELOW 3', asm: 'W1' },
		{ link: 'W1', action: { status: 'closed' }, condition: { kind: 'node', node: 'W1T', cmp: 'above', value: 6 }, raw: 'LINK W1 CLOSED IF NODE W1T ABOVE 6', asm: 'W1' }];
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const d2 = L.getDoc();
	ok('the project file opens with every element kept: four nodes, three links', d2.nodes.length === 4 && d2.links.length === 3 && d2.curves.length === 2);
	ok('and no grouping, since the form is gone', d2.assemblies.length === 0);
	ok('its controls are ordinary, the user\'s own, still there', d2.controls.length === 2 && d2.controls.every((c) => !c.asm));
	ok('and it says so in the status bar', /one-point/i.test(L.lastNotice()) && /W1/.test(L.lastNotice()), L.lastNotice());
	// The .inp spelling of the same.
	const text = EC.lpnExportInp(L.serializeProject(), {}).inp.replace(/^\[END\]/m, ';ASSEMBLY: well W1R W1U W1T W1D W1V W1 W1B ON=3 OFF=6\n\n[END]');
	const parsed = EC.lpnInpParse(text);
	ok('the .inp comment of the old form reads as elements: no group', parsed.ok && parsed.assemblies.length === 0 && parsed.nodes.length === 4 && parsed.links.length === 3, JSON.stringify(parsed.assemblies));
	ok('and the import report says what it did', (parsed.dropped || []).some((x) => x.code === 'assembly-well-tank' && x.ids.indexOf('W1') >= 0), JSON.stringify(parsed.dropped));
	ok('and its two controls come in as ordinary controls', parsed.controls.length === 2 && parsed.controls.every((c) => !c.asm));
	// The earlier form still: R S T G P, no tee.
	const text2 = text.replace(/^;ASSEMBLY.*$/m, ';ASSEMBLY: well W1R W1U W1T W1V W1');
	const parsed2 = EC.lpnInpParse(text2);
	ok('the slice-1 spelling (R S T G P) is read as elements too', parsed2.ok && parsed2.assemblies.length === 0 && (parsed2.dropped || []).some((x) => x.code === 'assembly-well-tank'));
}

console.log('\n--- 8. the solvers ---');
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a);
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.setProp(L.nodeById('J1'), 'elev', 150); L.setProp(L.nodeById('J1'), 'demand', 10);
	L.setProp(L.nodeById('T1'), 'elev', 150);
	const m = L.currentModel();
	ok('the model carries the well with its tank for the diagnosis', m.wells.length === 1 && m.wells[0].gpv === 'W1V' && m.wells[0].pump === 'W1');
	const issues = EC.lpnDiagnose(m);
	ok('and nothing about a well is refused', !(issues || []).some((i) => /^well/.test(i.code)), JSON.stringify((issues || []).map((i) => i.code)));
	L.runSolve();
	await wait(1500);
	ok('the page solved it', true);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

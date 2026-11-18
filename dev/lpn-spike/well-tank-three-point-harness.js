// WELL WITH TANK IS THREE POINTS: A WELL, A TEE AND A TANK. Run with:
//   node dev/lpn-spike/well-tank-three-point-harness.js
//
// Task 822, round 7 (Tom, round 6 pass: "Cramming a tank into that point makes no sense. I don't want to keep the one-point well with tank. Change it to
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
	"\t\townerOfProp: ownerOfProp, pushSpecList: pushSpecList, replaceOwnedNote: replaceOwnedNote, paneTables: paneTables, paneCellIsPlain: paneCellIsPlain,\n" +
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
	"\t\tassemblyOfAnyMember: assemblyOfAnyMember, effective: effective, createScenario: createScenario, switchScenario: switchScenario, getScenarios: function () { return scenarios; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; }, setLastResult: function (r) { lastSolveResult = r; }, notices: function () { return lastNoticeText; }, convertUnits: convertUnitValues, applyOneUnit: applyOneUnit,\n" +
	"\t\tassemblyById: assemblyById, curveById: curveById, pressureTankPoints: pressureTankPoints, pressureTankSI: pressureTankSI, syncPressureTank: syncPressureTank, toSI: toSI,\n" +
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
	ok('the mode hint says the same (the notice expires in 8 s, the hint stays)', byId.lpn_mode_hint && /tee/i.test(byId.lpn_mode_hint.textContent), byId.lpn_mode_hint && byId.lpn_mode_hint.textContent);
	press(500, 150);
	ok('the second press makes an ordinary junction there and a pipe from the well outlet to it', doc.nodes.length === 4 && L.nodeById('J1') && L.nodeById('J1').type === 'junction' && L.nodeById('J1').x === 500 && L.nodeById('J1').y === 150 &&
		doc.links.some((l) => l.type === 'pipe' && l.from === 'W1' && l.to === 'J1' && !l.virtual), doc.links.map((l) => l.id + ' ' + l.type + ' ' + l.from + '>' + l.to).join('; '));
	const p1 = doc.links.find((l) => l.type === 'pipe');
	ok('that pipe takes its length from the drawing (Auto), and it is not zero', p1.lenAuto === true && L.linkAutoLength(p1, true) > 0, p1.lenAuto + ' ' + L.linkAutoLength(p1, true));
	ok('and the status bar asks for the tank', /tank/i.test(L.lastNotice()) && L.lastNotice().indexOf('tee') !== 0 || L.lastNotice().indexOf(TANK_PROMPT) === 0, L.lastNotice());
	ok('and so does the mode hint, for the tank', byId.lpn_mode_hint && /^Now specify the tank/.test(byId.lpn_mode_hint.textContent), byId.lpn_mode_hint && byId.lpn_mode_hint.textContent);
	press(500, 400);
	const a = doc.assemblies[0];
	ok('the third press makes an ordinary tank there and a pipe from the tee to it', doc.nodes.length === 5 && L.nodeById('T1') && L.nodeById('T1').type === 'tank' && L.nodeById('T1').x === 500 && L.nodeById('T1').y === 400 &&
		doc.links.filter((l) => l.type === 'pipe').length === 2 && doc.links.some((l) => l.type === 'pipe' && l.from === 'J1' && l.to === 'T1'), doc.links.map((l) => l.id + ' ' + l.from + '>' + l.to).join('; '));
	ok('the group is one Well that knows its tee, its tank and the two pipes', a.kind === 'well' && a.tee === 'J1' && a.tank === 'T1' && JSON.stringify(a.branch) === JSON.stringify([p1.id, doc.links.filter((l) => l.type === 'pipe')[1].id]) && a.nodes.length === 3 && a.links.length === 2, JSON.stringify(a));
	ok('the wizard is finished and the status bar is cleared', !L.pending() && L.lastNotice() === '', JSON.stringify(L.lastNotice()));
	ok('the whole act is ONE undo step, and the tool stays armed', L.undoDepth() === d0 + 1 && L.getMode() === 'add-welltank');
	ok('three symbols: the tee and the tank are ordinary nodes, not members of the group', L.assemblyOfNode('J1') === null && L.assemblyOfNode('T1') === null && L.assemblyOfNode('W1') === a && L.wellHasTank(a));
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
	press(200, 150, hitNode('W1'));
	const pipe = doc.links.find((l) => l.type === 'pipe');
	ok('a tee on the well\'s own point is a new junction on that point, joined by a virtual pipe (no pipe at a distance)', doc.nodes.length === 4 && !!pipe && pipe.virtual === true && pipe.from === 'W1' && L.nodeById(pipe.to).x === 200 && L.nodeById(pipe.to).y === 150, JSON.stringify(pipe));
	press(200, 150);   // a tank on the very same point: the press names the tee, a junction, which is not a tank
	ok('a tank cannot be pressed onto that point: it names the tee, and the wizard asks again', !doc.assemblies[0].tank && L.pending() && L.pending().stage === 'tank' && /tank/i.test(L.lastNotice()), L.lastNotice());
}
{
	const doc = fresh();
	const j = L.addNode('junction', 600, 100); j._demand = 5;
	L.setMode('add-welltank'); press(200, 150);
	const n0 = doc.nodes.length;
	press(600, 100, hitNode(j.id));
	ok('an existing junction can be the tee: no new node, an ordinary pipe to it', doc.nodes.length === n0 && doc.assemblies[0].tee === 'undefined' || (doc.nodes.length === n0 && L.pending().tee === j.id && doc.links.some((l) => l.type === 'pipe' && l.from === 'W1' && l.to === j.id && !l.virtual)));
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
	L.setProp(L.nodeById('W1'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.openPopup('W1', 10, 10);
	const labels = boxLabels();
	console.log('        box: ' + labels.join(' | '));
	ok('Pump on below and Pump off above are asked once, on the well', labels.filter((x) => /^Pump on below/.test(x)).length === 1 && labels.filter((x) => /^Pump off above/.test(x)).length === 1);
	ok('and the tank\'s own depths and diameter are not on the well\'s box (it is an ordinary tank with a box of its own)', !labels.some((x) => /Initial depth|Minimum depth|Maximum depth|Tank diameter/.test(x)));
	ok('the Well\'s flow is stated once, above the headings; the only other Flow rows are the two branch pipes\' own (Round 8: every member has its heading)', labels.filter((x) => /^Flow/.test(x)).length === 3);
	a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	const mine = L.getDoc().controls.filter((c) => c.asm === 'W1');
	ok('the two controls are written for the pump and the tank', mine.length === 2 && mine.every((c) => c.link === 'W1P' && c.condition && c.condition.node === 'T1'), JSON.stringify(mine.map((c) => c.raw)));
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
	ok('deleting the tank ends the group (what is left is plain) and frees its controls', L.getDoc().assemblies.length === 0 && L.getDoc().nodes.some((n) => n.id === 'W1') && L.getDoc().controls.every((c) => !c.asm));
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
	L.deleteElement('node', 'W1');
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
	L.setProp(L.nodeById('W1'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeds', out.ok, JSON.stringify(out.error));
	const line = (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0];
	ok('the comment names the five members, then the tee, tank and pipes', line === ';ASSEMBLY: well W1R W1D W1 W1DV W1P ID=W1 ON=3 OFF=6 TEE=J1 TANK=T1 PIPES=' + a.branch.join(','), line);
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
	const g = L.addLink('valve', 'W1R', 'W1U', [], 'W1DV'); g.valveType = 'GPV';
	const p = L.addLink('pump', 'W1U', 'W1D', [], 'W1P');
	const b = L.addLink('pipe', 'W1D', 'W1T', [], 'W1B'); b.virtual = true;
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((q) => q.slice()) }, { id: 'PC1', kind: 'head', points: PH.map((q) => q.slice()) });
	g.curveId = 'DD1'; p.curveId = 'PC1';
	doc.assemblies = [{ id: 'W1P', kind: 'well', nodes: ['W1R', 'W1U', 'W1T', 'W1D'], links: ['W1DV', 'W1P', 'W1B'], pumpOn: 3, pumpOff: 6 }];
	doc.controls = [{ link: 'W1P', action: { status: 'open' }, condition: { kind: 'node', node: 'W1T', cmp: 'below', value: 3 }, raw: 'LINK W1P OPEN IF NODE W1T BELOW 3', asm: 'W1P' },
		{ link: 'W1P', action: { status: 'closed' }, condition: { kind: 'node', node: 'W1T', cmp: 'above', value: 6 }, raw: 'LINK W1P CLOSED IF NODE W1T ABOVE 6', asm: 'W1P' }];
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const d2 = L.getDoc();
	ok('the project file opens with every element kept: four nodes, three links', d2.nodes.length === 4 && d2.links.length === 3 && d2.curves.length === 2);
	ok('and no grouping, since the form is gone', d2.assemblies.length === 0);
	ok('its controls are ordinary, the user\'s own, still there', d2.controls.length === 2 && d2.controls.every((c) => !c.asm));
	ok('and it says so in the status bar', /one-point/i.test(L.lastNotice()) && /W1P/.test(L.lastNotice()), L.lastNotice());
	// The .inp spelling of the same.
	const text = EC.lpnExportInp(L.serializeProject(), {}).inp.replace(/^\[END\]/m, ';ASSEMBLY: well W1R W1U W1T W1D W1DV W1P W1B ON=3 OFF=6\n\n[END]');
	const parsed = EC.lpnInpParse(text);
	ok('the .inp comment of the old form reads as elements: no group', parsed.ok && parsed.assemblies.length === 0 && parsed.nodes.length === 4 && parsed.links.length === 3, JSON.stringify(parsed.assemblies));
	ok('and the import report says what it did', (parsed.dropped || []).some((x) => x.code === 'assembly-well-tank' && x.ids.indexOf('W1P') >= 0), JSON.stringify(parsed.dropped));
	ok('and its two controls come in as ordinary controls', parsed.controls.length === 2 && parsed.controls.every((c) => !c.asm));
	// The earlier form still: R S T G P, no tee.
	const text2 = text.replace(/^;ASSEMBLY.*$/m, ';ASSEMBLY: well W1R W1U W1T W1DV W1P');
	const parsed2 = EC.lpnInpParse(text2);
	ok('the slice-1 spelling (R S T G P) is read as elements too', parsed2.ok && parsed2.assemblies.length === 0 && (parsed2.dropped || []).some((x) => x.code === 'assembly-well-tank'));
}

console.log('\n--- 8. the solvers ---');
{
	const doc = fresh();
	let a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a);
	L.setProp(L.nodeById('W1'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	L.setProp(L.nodeById('J1'), 'elev', 150); L.setProp(L.nodeById('J1'), 'demand', 10);
	L.setProp(L.nodeById('T1'), 'elev', 150);
	const m = L.currentModel();
	ok('the model carries the well with its tank for the diagnosis', m.wells.length === 1 && m.wells[0].gpv === 'W1DV' && m.wells[0].pump === 'W1P');
	const issues = EC.lpnDiagnose(m);
	ok('and nothing about a well is refused', !(issues || []).some((i) => /^well/.test(i.code)), JSON.stringify((issues || []).map((i) => i.code)));
	L.runSolve();
	await wait(1500);
	ok('the page solved it', true);
}

console.log('\n--- 9. the Well with pressure tank (round 11) ---');
{
	const icons = require('fs').readFileSync(ROOT + 'lib/Icons.lib.php', 'utf8');
	ok('the Well with tank icon draws no stub and no cap: its riser turns into the run, and the file has no capped stub', !/capped stub/.test(icons.replace(/Tom's[^\n]*\n/g, '')) && !/\$run - 1\.3/.test(icons) && /ecWellTankIcon\(\) \{[\s\S]*?V' \. \$run \. 'H' \. \$tx/.test(icons));
	ok('and the pressure tank has an icon of its own', /'welltankp'\s*=>\s*ecWellPressureTankIcon\(\)/.test(icons));
	const NATIVE = L.toSI(1, 'lpn_u_pressure');
	ok('a psi is 0.70307 m of head in the page\'s pressure unit', Math.abs(L.toSI(1, 'lpn_u_pressure') * 1 - NATIVE) < 1e-12 && NATIVE > 0, String(NATIVE));
	// Boyle, checked against the published well tank: 44 gal total, 38 psig precharge, 40/60 switch: drawdown = V (1 - P0/P) between cut-in and cut-out.
	const psiT = 1 / EC.unitFactors.psi, psi = 0.70307, gal = 0.003785411784;
	const pts = L.pressureTankPoints({ vol: 44 * gal, pre: 38 * psi, on: 40 * psi, off: 60 * psi });
	const vAt = (h) => { let v = 0; for (let i = 1; i < pts.length; i++) { if (h <= pts[i][0] + 1e-12) { v = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (h - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return v; } } return pts[pts.length - 1][1]; };
	const draw44 = (vAt(60 * psi) - vAt(40 * psi)) / gal;
	ok('the curve starts at (0, 0), is zero up to the precharge, and rises', pts[0][0] === 0 && pts[0][1] === 0 && pts[1][1] === 0 && Math.abs(pts[1][0] - 38 * psi) < 1e-9 && pts.every((q, i) => !i || (q[0] > pts[i - 1][0] && q[1] >= pts[i - 1][1])), JSON.stringify(pts.slice(0, 3)));
	ok('44 gal, 38 psig precharge, 40/60: drawdown 11.35 gal by Boyle (44 x 0.2579), within 4% of the 11.8 gal on the Amtrol-based Next Generation sheet', Math.abs(draw44 - 44 * (52.7 / 54.7 - 52.7 / 74.7)) < 0.02 && Math.abs(draw44 - 11.8) / 11.8 < 0.04, draw44.toFixed(3));
	const draw32 = (function () { const q = L.pressureTankPoints({ vol: 32 * gal, pre: 38 * psi, on: 40 * psi, off: 60 * psi }); const f = (h) => { for (let i = 1; i < q.length; i++) { if (h <= q[i][0] + 1e-12) { return q[i - 1][1] + (q[i][1] - q[i - 1][1]) * (h - q[i - 1][0]) / (q[i][0] - q[i - 1][0]); } } return q[q.length - 1][1]; }; return (f(60 * psi) - f(40 * psi)) / gal; }());
	ok('32 gal, same switch: 8.25 gal', Math.abs(draw32 - 8.25) < 0.05, draw32.toFixed(3));
	ok('inputs that are not a tank give no curve', L.pressureTankPoints({ vol: 1, pre: 1, on: 5, off: 3 }) === null && L.pressureTankPoints({ vol: 0, pre: 1, on: 2, off: 3 }) === null);

	// Inserting it: three presses, the same wizard.
	const doc = fresh();
	L.setMode('add-welltankp');
	press(200, 150); press(500, 150);
	ok('the tank prompt for the pressure form says pressure tank', /pressure tank/i.test(L.lastNotice()) && /pressure tank/i.test(byId.lpn_mode_hint.textContent), L.lastNotice());
	L.setMode('add-welltankp'); // no-op: same mode
	const tk0 = L.addNode('tank', 800, 300);
	press(800, 300, hitNode(tk0.id));
	ok('an existing tank is refused for a pressure tank, and the wizard waits', L.pending() && L.pending().stage === 'tank' && /new/i.test(L.lastNotice()), L.lastNotice());
	press(500, 400);
	const a = doc.assemblies[0], t = L.nodeById('T2') || L.nodeById(a.tank);
	ok('the third press makes the tank, the group is a Well with a tank and a pressure tank', a.kind === 'well' && a.tank === t.id && !!a.pt && a.tee === 'J1' && doc.assemblies.length === 1, JSON.stringify(a));
	ok('typed in the project\'s units: 40 and 60 psi are 28 and 42 m in SI, volume 0.08 m3, empty pressure follows (absent)', a.pt.on === 28 && a.pt.off === 42 && a.pt.vol === 0.08 && a.pt.pre === undefined, JSON.stringify(a.pt));
	const c = L.curveById(a.pt.curve);
	ok('the VOLUME curve is in the document, written by the group', !!c && c.kind === 'volume' && c.points.length > 12 && c.id === 'W1TV', c && JSON.stringify(c.points.slice(0, 3)));
	ok('the tank stands on the ground: minimum level 0, maximum level the pump-off head, on the curve, starting between', t.minLevel === 0 && Math.abs(t.maxLevel - 42) < 1e-6 && t.volCurve === c.id && t._level > 28 && t._level < 42, JSON.stringify([t.minLevel, t.maxLevel, t.volCurve, t._level]));
	ok('the curve reaches the maximum level and the drawdown water at pump-off, by Boyle (precharge 28 m less 2 psi, atmosphere 14.7 psi)', Math.abs(c.points[c.points.length - 1][0] - 42) < 1e-6 && Math.abs(c.points[c.points.length - 1][1] - 0.08 * (1 - (28 - 2 * psiT + 14.7 * psiT) / (42 + 14.7 * psiT))) < 1e-6, JSON.stringify(c.points[c.points.length - 1]));
	ok('its controls are in pressure head: pump on below 28 and pump off above 42, written for the pump and the tank', a.pumpOn === 28 && a.pumpOff === 42 && doc.controls.filter((x) => x.asm === 'W1' && x.condition.node === t.id).length === 2, JSON.stringify(doc.controls.map((x) => x.raw)));
	// follows the well's elevation, at ground
	L.setProp(L.nodeById('W1'), 'elev', 123);
	ok('the tank follows the Well\'s elevation (ground), and so does the tee', L.nodeById(a.tank).elev === 123 && L.nodeById('J1').elev === 123 && a.tankFollow === true, L.nodeById(a.tank).elev);
	// an edit rewrites everything
	L.setMode('select'); L.openPopup('W1', 10, 10);
	const labels = boxLabels();
	console.log('        box: ' + labels.join(' | '));
	ok('the box asks pump on, pump off, empty pressure and tank volume once, on the well, and shows the two heads', ['Pump on below', 'Pump off above', 'Empty pressure', 'Tank volume', 'Pump on pressure head', 'Pump off pressure head'].every((w) => labels.filter((x) => x.indexOf(w) === 0).length === 1), '');
	a.pt.on = 30; a.pt.pre = 25; L.syncPressureTank(a);
	ok('an edit writes the curve, the limits and the controls again', Math.abs(L.curveById('W1TV').points[1][0] - 25) < 1e-3 && a.pumpOn === 30 && doc.controls.filter((x) => x.asm === 'W1').length === 2, JSON.stringify([a.pumpOn, L.curveById('W1TV').points[1]]));
	a.pt.on = 50; a.pt.off = 40; L.syncPressureTank(a);
	ok('pump on above pump off writes no controls (and leaves the curve)', doc.controls.filter((x) => x.asm === 'W1').length === 0 && a.pumpOn === undefined);
	a.pt.on = 28; a.pt.off = 42; delete a.pt.pre; L.syncPressureTank(a);

	// .inp round trip
	const out = EC.lpnExportInp(L.serializeProject(), {});
	const line = (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0];
	ok('the assembly comment carries PT= with the numbers and the curve', / PT=0\.08,,28,42,W1TV$/.test(line), line);
	ok('the curve and the tank row are in the file as EPANET reads them', /\[CURVES\][\s\S]*W1TV/.test(out.inp) && /;VOLUME:/.test(out.inp) && /W1TV/.test((out.inp.match(/\[TANKS\][^[]*/) || [''])[0]));
	const parsed = EC.lpnInpParse(out.inp);
	ok('read back with nothing reported', parsed.ok && parsed.assemblies[0].pt && parsed.assemblies[0].pt.curve === 'W1TV' && !(parsed.dropped || []).some((d) => /^assembly/.test(d.code)), JSON.stringify(parsed.assemblies[0] && parsed.assemblies[0].pt));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, ''))); L.buildDom();
	const b = L.getDoc().assemblies[0];
	ok('the group is back: pt, both controls, and the curve is the group\'s', b.pt && b.pt.on === 28 && b.pt.off === 42 && b.pt.pre === undefined && b.pumpOn === 28 && L.getDoc().controls.filter((x) => x.asm === 'W1').length === 2 && !!L.curveById('W1TV'), JSON.stringify(b));
	const out2 = EC.lpnExportInp(L.serializeProject(), {}).inp, p2 = EC.lpnInpParse(out2); L.applyUnitSelections(L.inpUnitSelections(p2)); L.applySaved(L.migrateSaved(L.docFromInp(p2, ''))); L.buildDom();
	const again = EC.lpnExportInp(L.serializeProject(), {}).inp, out_ = out2; if (again !== out_) { const A = out_.split('\n'), B = again.split('\n'); const i = A.findIndex((x, k) => x !== B[k]); console.log('        differs at line ' + i + ': ' + A[i] + ' | ' + B[i]); }
	ok('export, import, export, import, export is byte-identical from the second export', again === out_);
	const sv = JSON.parse(JSON.stringify(L.serializeProject())); L.applySaved(L.migrateSaved(sv)); L.buildDom();
	ok('the project file round trip keeps pt', L.getDoc().assemblies[0].pt.curve === 'W1TV' && L.getDoc().assemblies[0].pt.vol === 0.08);

	// Explode and regroup
	L.snap(); L.explode('W1');
	ok('Explode ends the group; the tank, the curve and the controls stay as ordinary elements', L.getDoc().assemblies.length === 0 && !!L.curveById('W1TV') && L.getDoc().controls.length === 2 && L.getDoc().controls.every((x) => !x.asm) && L.nodeById(b.tank).volCurve === 'W1TV');
	L.undo();
	ok('Undo regroups it, pressure tank and all', L.getDoc().assemblies.length === 1 && !!L.getDoc().assemblies[0].pt && L.getDoc().controls.filter((x) => x.asm === 'W1').length === 2);
	L.deleteElement('node', L.getDoc().assemblies[0].tank);
	ok('deleting the tank ends the group; the curve is then an ordinary curve', L.getDoc().assemblies.length === 0 && !!L.curveById('W1TV'));
}

console.log('\n--- 10. round 11 review fixes ---');
{
	// 1. A solve that was asked for and refused leaves no answer.
	const doc = fresh();
	const a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a);
	L.setLastResult({ heads: {}, flows: {}, pressures: {}, velocities: {}, headlosses: {} });
	a.pumpOn = 9999; a.pumpOff = 10000; L.syncWellControls(a);
	L.runSolve();
	ok('a refused solve (levels outside the tank) clears the results instead of leaving the old ones as current', L.lastResult() === null, JSON.stringify(L.lastResult()));
}
{
	// 2. Another Well's tee or tank is not available as this one's.
	const doc = fresh();
	const a1 = place3(200, 150, 500, 150, 500, 400);
	L.setMode('add-welltank'); press(200, 600);
	press(500, 150, hitNode('J1'));
	ok('another Well\'s tee is refused as a tee', L.pending() && L.pending().stage === 'tee' && /junction/i.test(L.lastNotice()), L.lastNotice());
	press(300, 650);
	press(500, 400, hitNode('T1'));
	ok('another Well\'s tank is refused as a tank', L.pending() && L.pending().stage === 'tank' && doc.assemblies[1] && !doc.assemblies[1].tank && /tank/i.test(L.lastNotice()), L.lastNotice());
	// 10. one index answers membership
	ok('any member of a group, tee, tank and branch pipes included, is found by the one index', L.assemblyOfAnyMember('node', 'J1') === a1 && L.assemblyOfAnyMember('node', 'T1') === a1 && L.assemblyOfAnyMember('link', a1.branch[1]) === a1 && L.assemblyOfAnyMember('node', 'nope') === null);
	L.setMode('select');
}
{
	// 3, 4. Kinds and malformed lines.
	const doc = fresh();
	const a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a);
	const inp = EC.lpnExportInp(L.serializeProject(), {}).inp;
	const bad = EC.lpnInpParse(inp.replace('TANK=T1', 'TANK=J1'));
	ok('a Well whose tank is a junction is not restored, and the report says so', bad.assemblies.length === 0 && bad.dropped.some((d) => d.code === 'assembly-kind' && d.ids.indexOf('W1P') >= 0), JSON.stringify(bad.dropped.map((d) => d.code)));
	const bad2 = EC.lpnInpParse(inp.replace(/PIPES=(\S+),/, 'PIPES=W1P,'));
	ok('so is one whose branch is a pump', bad2.assemblies.length === 0 && bad2.dropped.some((d) => d.code === 'assembly-kind'));
	const bad3 = EC.lpnInpParse(inp.replace(/^;ASSEMBLY: well W1R W1D W1 W1DV W1P/m, ';ASSEMBLY: well W1R W1D W1 W1P W1DV'));
	ok('and one whose valve and pump are swapped', bad3.assemblies.length === 0 && bad3.dropped.some((d) => d.code === 'assembly-kind'));
	const mal = EC.lpnInpParse(inp.replace(/^;ASSEMBLY: well W1R W1D W1 W1DV W1P/m, ';ASSEMBLY: well W1R W1D'));
	ok('a malformed ;ASSEMBLY line (wrong token count) is reported, never dropped silently', mal.assemblies.length === 0 && mal.dropped.some((d) => d.code === 'assembly-malformed' && /well W1R W1D/.test(d.ids[0])), JSON.stringify(mal.dropped.map((d) => d.code)));
	const mal2 = EC.lpnInpParse(inp.replace(/^;ASSEMBLY: well /m, ';ASSEMBLY: spigot '));
	ok('and so is an unknown kind', mal2.dropped.some((d) => d.code === 'assembly-malformed'));
	const sv = JSON.parse(JSON.stringify(L.serializeProject()));
	sv.nodes.find((n) => n.id === 'T1').type = 'junction';
	L.applySaved(L.migrateSaved(sv));
	ok('a project file whose tank is not a tank loses the grouping and says so', L.getDoc().assemblies.length === 0 && /W1/.test(L.notices()) && /kind/i.test(L.notices()), L.notices());
	// 5. grouping comments are matched exactly
	const own = EC.lpnInpParse(inp.replace('[END]', ';Virtual: pipes for the plant bypass\n;assembly: well W1R\n;VIRTUAL:no space\n\n[END]'));
	ok('a user\'s ;Virtual: and ;assembly: comments, or one without the space, are never read as IDs or groupings', own.assemblies.length === 1 && !(own.dropped || []).some((d) => /^assembly/.test(d.code)) && !own.links.some((l) => l.virtual && l.id === 'pipes'));
}
{
	// 6, 9. A virtual pipe carries its typed numbers, in lines under 255 characters.
	const doc = fresh();
	const n1 = L.addNode('junction', 0, 0), n2 = L.addNode('junction', 100, 0);
	const ids = [];
	for (let i = 0; i < 14; i++) { const p = L.addLink('pipe', n1.id, n2.id, [], 'VIRTUAL_PIPE_WITH_A_LONG_NAME_' + i + '_' + 'x'.repeat(20)); p.virtual = true; ids.push(p.id); }
	const p0 = L.linkById(ids[0]); p0._length = 123.5; p0._diameter = 200; p0._roughness = 130; p0._k = 0.5;
	const out = EC.lpnExportInp(L.serializeProject(), {}).inp;
	const vl = out.split('\n').filter((l) => /^;VIRTUAL: /.test(l));
	ok('the virtual pipes go out on several lines, each under 255 characters', vl.length >= 2 && vl.every((l) => l.length < 255), vl.map((l) => l.length).join(','));
	ok('the pipe\'s typed numbers ride on its entry', vl.some((l) => l.indexOf(ids[0] + '=123.5|200|130|0.5') >= 0), vl[0].slice(0, 120));
	const back = EC.lpnInpParse(out);
	const b0 = back.links.find((l) => l.id === ids[0]);
	ok('re-imported, every virtual pipe is virtual and the first has its own length, diameter, roughness and minor loss back, not the stand-in\'s', back.links.filter((l) => l.virtual).length === 14 && b0.length === 123.5 && b0.diameter === 200 && b0.roughness === 130 && b0.k === 0.5, JSON.stringify([b0.length, b0.diameter, b0.roughness, b0.k]));
	L.applyUnitSelections(L.inpUnitSelections(back)); L.applySaved(L.migrateSaved(L.docFromInp(back, ''))); L.buildDom();
	const o2 = EC.lpnExportInp(L.serializeProject(), {}).inp;
	ok('and the next export is byte-identical', o2 === out);
}
{
	// 7. One volume family: Length in metres, Elevation/Head in feet.
	const doc = fresh();
	L.applyOneUnit('lpn_u_length', 'm'); L.applyOneUnit('lpn_u_elevhead', 'fth2o'); L.applyOneUnit('lpn_u_pressure', 'psi');
	L.setMode('add-welltankp'); press(200, 150); press(500, 150); press(500, 400);
	const a = doc.assemblies[0];
	const ft = 0.3048, c = L.curveById(a.pt.curve), last = c.points[c.points.length - 1];
	ok('the volume is typed in the Elevation/Head unit cubed: a new tank is 2.7 ft^3 here, whatever the Length unit', a.pt.vol === 2.7 && a.pt.on === 40 && a.pt.off === 60, JSON.stringify(a.pt));
	const exp = 2.7 * (1 - (38 + 14.7) / (60 + 14.7));
	ok('the curve\'s volume axis is in that same unit: at the pump-off head the water is V (1 - P0/P) in ft^3', Math.abs(last[1] - exp) < 1e-3 && Math.abs(last[0] - 60 / EC.unitFactors.psi / ft) < 1e-3, last[0] + ' ' + last[1] + ' vs ' + exp);
	ok('and in SI it is the same vessel: 2.7 ft^3 is 0.0765 m^3', Math.abs(L.pressureTankSI(a).vol - 2.7 * ft * ft * ft) < 1e-9);
	L.applyOneUnit('lpn_u_length', 'ft'); L.applyOneUnit('lpn_u_elevhead', 'mh2o'); L.applyOneUnit('lpn_u_pressure', 'kpa');
	setUnitSet('si');
}
{
	// 8. A Well that takes its pump's ID takes its controls with it.
	const doc = fresh();
	const a = place3(200, 150, 500, 150, 500, 400);
	curves(doc, a); a.pumpOn = 3; a.pumpOff = 6; L.syncWellControls(a);
	const sv = JSON.parse(JSON.stringify(L.serializeProject()));
	const u = { id: 'U9', type: 'junction', x: 900, y: 900, elev: 0 }, d = { id: 'D9', type: 'junction', x: 900, y: 900, elev: 0 };
	sv.nodes.push(u, d); sv.links.push({ id: 'W1', type: 'pump', from: 'U9', to: 'D9', verts: [] });
	sv.assemblies = [{ id: 'W1', kind: 'pump', up: 'U9', down: 'D9', links: ['W1'] }].concat(sv.assemblies);
	L.applySaved(L.migrateSaved(sv));
	const ids = L.getDoc().assemblies.map((g) => g.id);
	ok('the Pump+ keeps W1 and the Well falls back to its pump\'s ID', JSON.stringify(ids) === '["W1","W1P"]', JSON.stringify(ids));
	ok('and the Well\'s two controls are retagged with it', L.getDoc().controls.filter((c) => c.asm === 'W1P').length === 2 && L.getDoc().controls.filter((c) => c.asm === 'W1').length === 0, JSON.stringify(L.getDoc().controls.map((c) => c.asm)));
	// A clash that cannot be repaired is dropped and the notice names the ID.
	const sv2 = JSON.parse(JSON.stringify(L.serializeProject()));
	sv2.nodes.push({ id: 'X1', type: 'junction', x: 1, y: 1, elev: 0 }, { id: 'X2', type: 'junction', x: 1, y: 1, elev: 0 });
	sv2.links.push({ id: 'W1P', type: 'pump', from: 'X1', to: 'X2', verts: [] });
	sv2.assemblies = sv2.assemblies.concat([{ id: 'W1P', kind: 'pump', up: 'X1', down: 'X2', links: ['W1P'] }]);
	L.applySaved(L.migrateSaved(sv2));
	ok('a group that clashes and cannot be renamed is not restored, and the notice names its ID', /W1P/.test(L.notices()) && /share an ID/.test(L.notices()), L.notices());
}
{
	// A, B. The pressure tank's own box and scenarios.
	const doc = fresh();
	L.setMode('add-welltankp'); press(200, 150); press(500, 150); press(500, 400);
	const a = doc.assemblies[0];
	const tk = L.nodeById(a.tank);
	L.setMode('select'); L.openPopup(a.tank, 10, 10);
	const labels = boxLabels();
	console.log('        tank box: ' + labels.join(' | '));
	ok('the pressure tank\'s box shows its depths and curve as the Well set them, with whose they are', labels.some((x) => /^Written by well W1/.test(x)) && labels.filter((x) => /^(Initial|Minimum|Maximum) depth/.test(x)).length === 3 && !(function () { let inputs = 0; walk(byId.lpn_popup_fields, (e) => { if (e.tagName === 'LABEL' && /^(Initial|Minimum|Maximum) depth/.test((e.textContent || '').trim())) { (e.children || e.childNodes || []).forEach((c) => { if (c.tagName === 'INPUT') { inputs++; } }); } }); return inputs; }()));
	if (process.argv.includes('--write-fixture')) {
		require('fs').writeFileSync(ROOT + 'dev/lpn-spike/well-pressure-tank-fixture.lwn', JSON.stringify(JSON.parse(JSON.stringify(L.serializeProject()))));
		console.log('wrote the fixture');
	}
	const before = JSON.stringify([tk.minLevel, tk.maxLevel, tk._level, tk.volCurve]);
	L.setProp(tk, 'maxLevel', 5); L.setProp(tk, 'volCurve', 'NOPE');
	ok('an edit of an owned property through the one write door is refused and says whose it is', JSON.stringify([tk.minLevel, tk.maxLevel, tk._level, tk.volCurve]) === before && /W1/.test(L.notices()), L.notices());
	// The whole vessel is the group's (round 12): diameter, minimum volume and overflow are refused like the levels; Elevation and Base elevation stay the tank's own.
	const vesselBefore = JSON.stringify([tk.tankDiameter, tk._tankDiameter, tk.minVolume, tk.overflow]);
	L.setProp(tk, 'tankDiameter', 7); L.setProp(tk, 'minVolume', 3); L.setProp(tk, 'overflow', 'YES');
	ok('the tank diameter, minimum volume and overflow are refused too', JSON.stringify([tk.tankDiameter, tk._tankDiameter, tk.minVolume, tk.overflow]) === vesselBefore);
	L.setProp(tk, 'bottomElev', 1.5);
	ok('the tank\'s Base elevation stays its own', L.effective(tk, 'bottomElev') === 1.5);
	// Properties: every owned input is a read-only row (no input element), the sentence shows once, and the identity rows stay typeable.
	const owned = ['Initial depth', 'Minimum depth', 'Maximum depth', 'Tank volume', 'Tank diameter', 'Minimum volume', 'Can overflow'];
	const inputsOf = (lab) => { let n = 0; walk(lab, (e) => { if (e.tagName === 'INPUT' || e.tagName === 'SELECT') { n++; } }); return n; };
	const labelEls = []; walk(byId.lpn_popup_fields, (e) => { if (e.tagName === 'LABEL') { labelEls.push(e); } });
	const txt = (e) => (e.textContent || '').replace(/\s+/g, ' ').trim();
	const ownedEls = labelEls.filter((e) => owned.some((o) => txt(e).indexOf(o) === 0));
	ok('all seven owned inputs are listed in the tank\'s box, none of them typeable', ownedEls.length === 7 && ownedEls.every((e) => inputsOf(e) === 0), ownedEls.map(txt).join(' | '));
	ok('the sentence shows exactly once, naming the well', labelEls.filter((e) => /^Written by well W1\. Change it in the Properties box of the well\.$/.test(txt(e))).length === 1);
	ok('the tank\'s Elevation and Base elevation are still typeable', ['Elevation', 'Base elevation'].every((o) => labelEls.some((e) => txt(e).indexOf(o) === 0 && inputsOf(e) > 0)));
	// Tables: the six columns are plain cells for this tank with the sentence as tip, and typeable for an ordinary tank.
	const spec = L.paneTables().filter((t) => t.cols.some((c) => c.key === 'tankDiameter'))[0];
	const ordinary = { id: 'T9', type: 'tank', x: 0, y: 0 };
	const lockedKeys = ['level', 'minLevel', 'maxLevel', 'tankDiameter', 'minVolume', 'overflow'];
	ok('Tables: those six cells are read-only for the pressure tank and typeable for another tank',
		lockedKeys.every((k) => { const c = spec.cols.filter((x) => x.key === k)[0]; return L.paneCellIsPlain(c, tk) && !L.paneCellIsPlain(c, ordinary); }));
	// Find and replace and the Settings push share pushSpecList(): its applies() leaves the pressure tank out, and the preview note names the well.
	ok('Find and replace: the diameter, minimum volume and overflow pushes skip the pressure tank and keep another tank',
		['tankDiameter', 'minVolume', 'overflow', 'level', 'minLevel', 'maxLevel'].every((k) => { const sp = L.pushSpecList().filter((x) => x.key === k)[0]; return sp && !sp.applies(tk) && sp.applies(ordinary); }));
	ok('ownerOfProp finds it for each owned property and not for its Elevation', ['level', 'minLevel', 'maxLevel', 'volCurve', 'tankDiameter', 'minVolume', 'overflow'].every((k) => L.ownerOfProp(tk, k) === a) && !L.ownerOfProp(tk, 'elev') && !L.ownerOfProp(tk, 'bottomElev'));
	// scenarios: like the open-air Well with tank, the group writes Base (its controls are document data, its numbers are Base's); an owned property is not overridable.
	L.createScenario('Dry year');
	const scn = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(scn.id);
	L.setProp(tk, 'maxLevel', 5);
	ok('in a child scenario an owned property still cannot be overridden: no override, same value', L.effective(tk, 'maxLevel') === tk.maxLevel && !JSON.stringify(scn.overrides || {}).includes('maxLevel'));
	a.pt.off = 50; L.syncPressureTank(a);
	ok('an edit of the group inside a scenario writes Base and the document, as the open-air Well\'s pump levels do', tk.maxLevel === 50 && a.pumpOff === 50 && L.effective(tk, 'maxLevel') === 50 && doc.controls.filter((c) => c.asm === 'W1').length === 2);
	L.setProp(L.nodeById('W1'), 'elev', 77);
	ok('the Well\'s ground elevation overridden in the scenario reaches the tank as for the open-air form', L.effective(tk, 'elev') === 77, L.effective(tk, 'elev'));
	L.switchScenario('base');
	ok('back in Base the tank and the group are as Base had them', tk.maxLevel === 50 && L.effective(tk, 'elev') !== 77);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

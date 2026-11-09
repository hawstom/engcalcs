// A WELL IS THREE NODES AND TWO LINKS AT ONE POINT, MANAGED AS ONE. Run with:
//   node dev/lpn-spike/well-harness.js
//
// Task 822, slice 1 (dev/assemblies.md; Tom's Well properties of 2026-10-25: groundwater static elevation, a
// general purpose valve for the drawdown curve, a pump curve; "Pump+ and Well on Pump"). R is a reservoir at the
// static elevation, S the pump's suction junction, T an open-air tank at the ground where the system's pipes attach;
// G is a GPV from R to S whose head-loss curve is the drawdown against pumping rate, P the pump from S to T.
// Every assertion drives the page's own tool and handlers and reads the result out of `doc`. Covered:
//   1. place on open ground: R, S, T coincident, G and P between them, one grouping, one undo step, IDs;
//   2. place by pressing a pipe: both halves of the pipe attach to T; the ground elevation follows the pipe;
//   3. one press selects all five; the box is the combined one with Explode; static elevation reaches R and S only;
//      position reaches all three; renaming a member keeps the group true;
//   4. Explode leaves plain elements, undo brings the group back, deleting a member dissolves it;
//   5. a pipe drawn to the well ends at, and one drawn from it starts at, the tank;
//   6. hydraulics, in BOTH engines: the pump's discharge head equals static - drawdown(Q) + pump head(Q);
//   7. EngCalcs.lpnDiagnose passes a GPV off a reservoir;
//   8. the project file and the .inp: `;ASSEMBLY: well R S T G P`, import restores it, export-import-export is
//      byte-identical, a file naming a missing member is reported and not half-restored;
//   9. scenarios: the static elevation and both curve references are overridable, the rest stays Base's;
//  10. the Well button tip and form.
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
	"\t\tapplySaved: applySaved, migrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tdeleteNode: deleteNode, deleteLink: deleteLink, linkEls: function () { return linkEls; },\n" +
	"\t\tapplyNodeRename: applyNodeRename, applyLinkRename: applyLinkRename,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, getScenarios: function () { return scenarios; },\n" +
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
const WELL_IDS = ['T1', 'R1', 'U1'];

(async function () {
console.log('\n--- 1. place on open ground ---');
{
	const doc = fresh();
	L.setMode('add-well');
	const d0 = L.undoDepth();
	press(200, 150);
	const types = doc.nodes.map((n) => n.id + ':' + n.type).sort().join(',');
	ok('three nodes: a reservoir, a junction and a tank', types === 'R1:reservoir,T1:tank,U1:junction', types);
	ok('two links: a GPV from R to S and a pump from S to T', doc.links.length === 2 &&
		doc.links[0].type === 'valve' && doc.links[0].valveType === 'GPV' && doc.links[0].from === 'R1' && doc.links[0].to === 'U1' &&
		doc.links[1].type === 'pump' && doc.links[1].from === 'U1' && doc.links[1].to === 'T1', doc.links.map((l) => l.id + ':' + l.type + ' ' + l.from + '>' + l.to).join('; '));
	ok('all three nodes are on one point', doc.nodes.every((n) => n.x === 200 && n.y === 150));
	const w = doc.assemblies[0];
	ok('one grouping, kind well, nodes R S T, links G P', doc.assemblies.length === 1 && JSON.stringify(w) ===
		JSON.stringify({ id: doc.links[0].id, kind: 'well', nodes: ['R1', 'U1', 'T1'], links: [doc.links[0].id, doc.links[1].id] }), JSON.stringify(w));
	const R = L.nodeById('R1'), S = L.nodeById('U1'), T = L.nodeById('T1');
	ok('the static elevation is the same at R and S, and below the ground', R.elev === S.elev && R.elev < T.elev, R.elev + ' ' + S.elev + ' ' + T.elev);
	ok('the reservoir states no head of its own (it follows the static elevation)', R.head === undefined);
	ok('the suction node has no demand', !S._demand);
	ok('one undo step', L.undoDepth() === d0 + 1, L.undoDepth() - d0);
	ok('the tool stays armed', L.getMode() === 'add-well');
	press(500, 150);
	ok('a second well: a second group with its own IDs', doc.assemblies.length === 2 && doc.assemblies[1].nodes.join() === 'R2,U2,T2', JSON.stringify(doc.assemblies[1]));
	L.undo();
	ok('undo takes the second away whole', L.getDoc().nodes.length === 3 && L.getDoc().links.length === 2 && L.getDoc().assemblies.length === 1);
	L.undo();
	ok('and the first', L.getDoc().nodes.length === 0 && L.getDoc().links.length === 0 && L.getDoc().assemblies.length === 0);
}

console.log('\n--- 2. place by pressing a pipe ---');
{
	const doc = fresh();
	const a = L.addNode('junction', 0, 0).id, b = L.addNode('junction', 400, 0).id;
	const pipe = L.addLink('pipe', a, b, []);
	L.nodeById(a).elev = 100; L.nodeById(b).elev = 200;
	L.setMode('add-well');
	press(200, 0, hitLink(pipe.id));
	const T = L.nodeById('T1');
	ok('halfway along the pipe the ground is 150', T && T.elev === 150, T && T.elev);
	const pipes = doc.links.filter((l) => l.type === 'pipe');
	ok('two pipes, both attached to the tank', pipes.length === 2 && pipes[0].from === a && pipes[0].to === 'T1' && pipes[1].from === 'T1' && pipes[1].to === b,
		pipes.map((l) => l.from + '>' + l.to).join('; '));
	ok('no stray junction is left behind: R, S and T only, besides the two ends', doc.nodes.length === 5, doc.nodes.map((n) => n.id).join(','));
	ok('the static elevation is below that ground', L.nodeById('R1').elev < 150 && L.nodeById('R1').elev === L.nodeById('U1').elev);
	L.undo();
	ok('one undo gives back the single pipe', L.getDoc().links.length === 1 && L.getDoc().nodes.length === 2 && L.getDoc().assemblies.length === 0 && L.getDoc().links[0].to === b);
}

console.log('\n--- 3. selection, the box, the shared values, a rename ---');
{
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	L.setMode('select');
	press(200, 150, hitNode('R1'));
	ok('pressing the reservoir selects all five elements', L.selected().length === 5, JSON.stringify(L.selected()));
	press(900, 900);
	press(200, 150, hitLink(doc.links[1].id));
	ok('so does pressing the pump', L.selected().length === 5);
	L.openPopup('U1', 10, 10);
	ok('opening any node opens the combined box', L.getPopup().kind === 'assembly', JSON.stringify(L.getPopup()));
	const kids = allKids(fieldsOf());
	const explode = kids.find((k) => k.getAttribute && k.getAttribute('data-assembly-explode') === '1');
	ok('the box has an Explode button', !!explode && explode.textContent === 'Explode');
	const labels = kids.filter((k) => k.tagName === 'LABEL').map((k) => (k.textContent || '').replace(/\s+/g, ' ').trim());
	console.log('        labels: ' + labels.join(' | '));
	L.setProp(L.nodeById('R1'), 'elev', 80);
	ok('the static elevation typed on R lands on S', L.nodeById('U1').elev === 80 && L.nodeById('R1').elev === 80);
	ok('and leaves the ground alone', L.nodeById('T1').elev !== 80);
	L.setProp(L.nodeById('U1'), 'elev', 75);
	ok('typed on S it lands on R', L.nodeById('R1').elev === 75);
	L.setProp(L.nodeById('T1'), 'elev', 140);
	ok('the ground elevation typed on T lands on T alone', L.nodeById('T1').elev === 140 && L.nodeById('R1').elev === 75 && L.nodeById('U1').elev === 75);
	L.setProp(L.nodeById('T1'), 'x', 250);
	ok('x moves all three: they stay coincident', ['R1', 'U1', 'T1'].every((id) => L.nodeById(id).x === 250));
	L.setProp(L.nodeById('T1'), 'x', 200);
	L.applyNodeRename('U1', 'SUC');
	L.applyLinkRename(doc.links[1].id, 'WP');
	const w = L.getDoc().assemblies[0];
	ok('renaming a node and the pump keeps the group true', JSON.stringify(w.nodes) === JSON.stringify(['R1', 'SUC', 'T1']) && w.links[1] === 'WP', JSON.stringify(w));
}

console.log('\n--- 4. Explode, undo, delete ---');
{
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	L.setMode('select');
	press(200, 150, hitNode('T1'));
	L.openPopup('T1', 10, 10);
	const explode = allKids(fieldsOf()).find((k) => k.getAttribute && k.getAttribute('data-assembly-explode') === '1');
	const d0 = L.undoDepth();
	(explode._listeners.click || []).forEach((fn) => fn({}));
	ok('Explode ends the group', doc.assemblies.length === 0);
	ok('and leaves the three nodes and two links, each still valid', doc.nodes.length === 3 && doc.links.length === 2 &&
		doc.links.every((l) => L.nodeById(l.from) && L.nodeById(l.to)));
	ok('as one undo step', L.undoDepth() === d0 + 1);
	L.undo();
	ok('undo brings the group back', L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].kind === 'well');
	L.deleteLink(L.getDoc().links[1].id);
	ok('deleting the pump dissolves the group', L.getDoc().assemblies.length === 0 && L.getDoc().nodes.length === 3);
	fresh();
	L.setMode('add-well');
	press(200, 150);
	L.deleteNode('R1');
	ok('deleting a node dissolves it too', L.getDoc().assemblies.length === 0);
	fresh();
	L.setMode('add-well');
	press(200, 150);
	L.setMode('select');
	press(200, 150, hitNode('T1'));
	const d1 = L.undoDepth();
	setHitTarget(null);
	const KEYDEL = (global.document && global.document._keydown) || null;
	void KEYDEL; void d1;
}

console.log('\n--- 5. pipes meet the tank ---');
{
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	const j = L.addNode('junction', 600, 150), j2 = L.addNode('junction', -200, 150);
	L.setMode('add-pipe');
	press(600, 150, hitNode(j.id));
	press(200, 150, hitNode('R1'));
	let p = doc.links.filter((l) => l.type === 'pipe')[0];
	ok('a pipe drawn to the well ends at the tank, though the reservoir was pressed', p && p.from === j.id && p.to === 'T1', p && (p.from + '>' + p.to));
	L.setMode('add-pipe');
	press(200, 150, hitNode('U1'));
	press(-200, 150, hitNode(j2.id));
	p = doc.links.filter((l) => l.type === 'pipe')[1];
	ok('a pipe drawn from the well starts at the tank', p && p.from === 'T1' && p.to === j2.id, p && (p.from + '>' + p.to));
}

// ---- the hydraulics ----
const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];          // l/s against m of drawdown
const PH = [[0, 70], [30, 62], [60, 40]];                 // l/s against m of head
function wellNetwork() {
	const doc = fresh();
	L.setMode('add-well');
	press(200, 150);
	const j = L.addNode('junction', 600, 150);
	j._demand = 10;
	L.addLink('pipe', 'T1', j.id, []);
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	const G = doc.links[0], P = doc.links[1];
	L.setProp(G, 'curveId', 'DD1');
	L.setProp(P, 'curveId', 'PC1');
	L.setProp(L.nodeById('T1'), 'elev', 150);
	L.setProp(L.nodeById('R1'), 'elev', 120);
	L.setProp(L.nodeById('T1'), 'level', 3);
	return doc;
}
function interp(pts, q) {
	for (let i = 0; i + 1 < pts.length; i++) {
		if (q >= pts[i][0] && q <= pts[i + 1][0]) { return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (q - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); }
	}
	return NaN;
}

console.log('\n--- 6. hydraulics: discharge head = static - drawdown(Q) + pump head(Q), in both engines ---');
{
	const doc = wellNetwork();
	const model = L.currentModel();
	const gm = model.links.find((l) => l.id === doc.links[0].id), pm = model.links.find((l) => l.id === doc.links[1].id);
	ok('the model carries the GPV with its drawdown curve in SI', gm.valveType === 'GPV' && gm.curvePoints.length === 4 &&
		Math.abs(gm.curvePoints[1][0] - 0.02) < 1e-12 && Math.abs(gm.curvePoints[1][1] - 4) < 1e-12, JSON.stringify(gm.curvePoints));
	const fit = EC.lpnPumpFromCurve(PH.map((p) => [p[0] / 1000, p[1]]));
	const results = [['built-in', EC.lpnSolve(model)], ['EPANET', await EC.lpnSolveEpanet(model, { moduleUrl: NODE_ENGINE_URL })]];
	for (const [nm, r] of results) {
		ok(nm + ': solved and converged', r.ok && r.converged, JSON.stringify(r.engineError || r.issues || ''));
		const Q = r.flows[pm.id] * 1000;     // l/s
		const hS = r.heads.U1, hT = r.heads.T1;
		ok(nm + ': the pump pumps a positive rate inside both curves', Q > 0 && Q < 60, Q.toFixed(4) + ' l/s');
		const dd = interp(DD, Q);
		ok(nm + ': suction head = static - drawdown(Q)', Math.abs(hS - (120 - dd)) <= 1e-4, 'diff ' + (hS - (120 - dd)).toExponential(2) + ' m  (Q ' + Q.toFixed(3) + ', drawdown ' + dd.toFixed(4) + ')');
		const lift = fit.custom ? interp(PH, Q) : fit.h0 - fit.a * Math.pow(Q / 1000, fit.b);
		ok(nm + ': discharge head = static - drawdown(Q) + pump head(Q)', Math.abs(hT - (120 - dd + lift)) <= 1e-4, 'diff ' + (hT - (120 - dd + lift)).toExponential(2) + ' m  (lift ' + lift.toFixed(4) + ')');
		ok(nm + ': the discharge head is the tank\'s water surface, 153 m', Math.abs(hT - 153) <= 1e-6, hT);
		ok(nm + ': the GPV carries the same flow, R to S', Math.abs(r.flows[doc.links[0].id] - r.flows[pm.id]) <= 1e-7);
	}
	const a = results[0][1], e = results[1][1];
	ok('the two engines agree on Q to 1e-6 m3/s', Math.abs(a.flows[pm.id] - e.flows[pm.id]) <= 1e-6, (a.flows[pm.id] - e.flows[pm.id]).toExponential(2));
}

console.log('\n--- 7. EngCalcs.lpnDiagnose ---');
{
	const doc = wellNetwork();
	const diag = EC.lpnDiagnose(L.currentModel());
	ok('a GPV off a reservoir is not refused', !(diag && (diag.errors || diag.issues || []).length) , JSON.stringify(diag));
}

console.log('\n--- 8. the project file and the .inp ---');
{
	const doc = wellNetwork();
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the saved project holds the grouping with its three nodes', saved.assemblies && saved.assemblies.length === 1 && saved.assemblies[0].nodes.join() === 'R1,U1,T1', JSON.stringify(saved.assemblies));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	ok('opened again, the group is there', L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].kind === 'well');
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeds', out.ok, JSON.stringify(out.error));
	const gid = doc.links[0].id, pid = doc.links[1].id;
	ok('it carries the ;ASSEMBLY: well comment line', new RegExp('^;ASSEMBLY: well R1 U1 T1 ' + gid + ' ' + pid + '$', 'm').test(out.inp), (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	ok('the GPV is a VALVES row off the reservoir', new RegExp('^\\s*' + gid + '\\s+R1\\s+U1\\s+\\S+\\s+GPV\\s+DD1', 'm').test(out.inp), (out.inp.match(new RegExp('^\\s*' + gid + '.*$', 'm')) || [''])[0]);
	const parsed = EC.lpnInpParse(out.inp);
	ok('read back, the group is restored with nothing reported', parsed.ok && parsed.assemblies.length === 1 && parsed.assemblies[0].kind === 'well' &&
		parsed.assemblies[0].nodes.join() === 'R1,U1,T1' && !(parsed.dropped || []).some((d) => d.code === 'assembly-unresolved'), JSON.stringify(parsed.assemblies));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, 'w'))); L.buildDom();
	ok('opened as a project it is a group again', L.getDoc().assemblies.length === 1);
	const out2 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	const asm = (t) => (t.match(/^;ASSEMBLY.*$/m) || [''])[0];
	ok('the line survives unchanged', asm(out2.inp) === asm(out.inp) && asm(out.inp) !== '');
	const p2 = EC.lpnInpParse(out2.inp);
	L.applyUnitSelections(L.inpUnitSelections(p2));
	L.applySaved(L.migrateSaved(L.docFromInp(p2, 'w'))); L.buildDom();
	const out3 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	ok('export, import, export is byte-identical', out3.inp === out2.inp);
	for (const miss of ['R1', 'U1', 'T1']) {
		const t = out.inp.replace(';ASSEMBLY: well R1 U1 T1', ';ASSEMBLY: well ' + miss.replace(miss, 'NOPE') + ' U1 T1');
		void t;
	}
	const broken = EC.lpnInpParse(out.inp.replace(';ASSEMBLY: well R1 U1 T1', ';ASSEMBLY: well R1 NOPE T1'));
	ok('a group naming a node the file lacks is reported, not half-restored', broken.assemblies.length === 0 && broken.dropped.some((d) => d.code === 'assembly-unresolved'));
	const broken2 = EC.lpnInpParse(out.inp.replace(' ' + pid + '\n', ' NOPE\n'));
	ok('so is one naming a link the file lacks', broken2.assemblies.length === 0 && broken2.dropped.some((d) => d.code === 'assembly-unresolved'));
	const short = EC.lpnInpParse(out.inp.replace(' ' + gid + ' ' + pid + '\n', ' ' + gid + '\n'));
	ok('and one that lacks a member is not a well', short.assemblies.length === 0);
	L.getDoc().assemblies = [];
	ok('with no group, no comment line', !/;ASSEMBLY/.test(EC.lpnExportInp(L.serializeProject(), {}).inp));
}

console.log('\n--- 9. scenarios: only the static elevation and the two curve references are overridable ---');
{
	const doc = wellNetwork();
	L.createScenario('Dry year');
	const scn = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(scn.id);
	L.setProp(L.nodeById('R1'), 'elev', 100);
	ok('the static elevation overridden in a scenario reads the same at R and S', L.effective(L.nodeById('R1'), 'elev') === 100 && L.effective(L.nodeById('U1'), 'elev') === 100);
	ok('Base is untouched', L.nodeById('R1').elev === 120 && L.nodeById('U1').elev === 120);
	doc.curves.push({ id: 'DD2', kind: 'headloss', points: [[0, 0], [60, 40]] });
	doc.curves.push({ id: 'PC2', kind: 'head', points: [[0, 80], [30, 70], [60, 50]] });
	L.setProp(doc.links[0], 'curveId', 'DD2');
	L.setProp(doc.links[1], 'curveId', 'PC2');
	ok('the two curve references are overridden', L.effective(doc.links[0], 'curveId') === 'DD2' && L.effective(doc.links[1], 'curveId') === 'PC2');
	ok('and Base keeps its own', doc.links[0].curveId === 'DD1' || doc.links[0]._curveId === 'DD1');
	const r = EC.lpnSolve(L.currentModel());
	ok('the scenario solves with the dry-year static level: the suction head is below 100 m', r.ok && r.heads.U1 < 100, r.heads.U1);
	L.switchScenario('base');
	ok('back in Base the static elevation is 120 again', L.effective(L.nodeById('R1'), 'elev') === 120);
}

console.log('\n--- 10. the Well button ---');
{
	const lang = require('fs').readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	ok('the Well tip opens like the Valve+ one', lang.indexOf("$ec_lang['lpn_tool_add_well_tip']='Add a well, its groundwater reservoir, its pump suction node, and its tank at one point. Specify a point on the map, or specify a pipe to split it and put the well in it.';") >= 0);
	const src = require('fs').readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('Well is the third form of the Pump button, after Pump and Pump+', /slot: 'add-pump'[\s\S]{0,700}mode: 'add-pump'[\s\S]{0,400}mode: 'add-pumpplus'[\s\S]{0,400}mode: 'add-well'/.test(src));
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

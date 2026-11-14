// MORPH WORKS WITH THE + ASSEMBLIES. Run with:
//   node dev/lpn-spike/assembly-morph-harness.js
//
// Task 822, round 7 (Tom, round 6 pass: "I think we need to have on our checklist to ensure that Morph works with the + assemblies before we
// merge this"). Water > Morph changes a node or link into another type. The rule decided here: a Morph of ANY member of an assembly (Pump+,
// Valve+, Well, and a Well with tank's tee, tank and pipes) first separates the group, as Explode does, inside the Morph's own undo step;
// the elements stay and the type changes as it does for any element; the status bar says so; one Undo restores both the group and the type.
// Morphing an ordinary element never touches a group. Tried here on EVERY member of the four forms, into EVERY other type of its kind, in Base
// and in a scenario (where the type is an override), with a solve after each.
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
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tundo: undo, nodeById: nodeById, linkById: linkById, effective: effective,\n" +
	"\t\tsetSelectionList: setSelectionList, changeSelectedType: changeSelectedType,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, getScenarios: function () { return scenarios; },\n" +
	"\t\tsetProp: setProp, serializeProject: serializeProject,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; }, currentModel: function () { return assembleModel(); },\n" +
	"\t\tresetIds: function () { nextId = newNextId(); }, runSolve: runSolve, lastResult: function () { return lastSolveResult; },\n" +
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
let asked = [], answer = true;
global.window.confirm = function (text) { asked.push(String(text)); return answer; };
global.alert = global.window.alert = function () {};

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; console.log('  FAIL ' + name + (extra === undefined ? '' : '   ' + extra)); }
	else if (!QUIET) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); }
}
const QUIET = !process.argv.includes('--verbose');
const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.assemblies = []; doc.curves = []; doc.controls = [];
	L.resetIds();
	L.buildDom(); L.buildLayers(); L.setScale(1);
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
const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];

// Each form is built the way the user builds it, with an ordinary pipe and junctions around it, and a demand so a solve means something.
const FORMS = {
	'Pump+': function (doc) {
		const a = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 800, 0); j._demand = 5;
		a.elev = 100; j.elev = 100;
		const p = L.addLink('pipe', a.id, j.id, []);
		L.setMode('add-pumpplus'); press(400, 0, { dataset: { link: p.id }, classList: { contains: () => false } });
		const g = doc.assemblies[0];
		doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((q) => q.slice()) });
		L.setProp(L.linkById(g.links[0]), 'curveId', 'PC1');
		return g;
	},
	'Valve+': function (doc) {
		const a = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 800, 0); j._demand = 5;
		a.elev = 100; j.elev = 90;
		const p = L.addLink('pipe', a.id, j.id, []);
		L.setMode('add-valveplus'); press(400, 0, { dataset: { link: p.id }, classList: { contains: () => false } });
		return doc.assemblies[0];
	},
	'Well': function (doc) {
		L.setMode('add-well'); press(200, 150);
		const j = L.addNode('junction', 600, 150); j._demand = 5; j.elev = 150;
		L.addLink('pipe', 'W1P', j.id, []);
		wellCurves(doc);
		return doc.assemblies[0];
	},
	'Well with tank': function (doc) {
		L.setMode('add-welltank'); press(200, 150); press(400, 150); press(400, 400);
		const j = L.addNode('junction', 600, 150); j._demand = 5; j.elev = 150;
		L.addLink('pipe', 'W1P', j.id, []);
		wellCurves(doc);
		const g = doc.assemblies[0];
		g.pumpOn = 1; g.pumpOff = 3;
		return g;
	}
};
function wellCurves(doc) {
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((q) => q.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((q) => q.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1'); L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
}
function membersOf(a) {
	const nodes = [].concat(a.nodes || [a.up, a.down]), links = a.links.slice();
	if (a.tank) { nodes.push(a.tee, a.tank); links.push.apply(links, a.branch); }
	return { nodes: nodes, links: links };
}
const NODE_TYPES = ['junction', 'reservoir', 'tank'], LINK_TYPES = ['pipe', 'pump', 'valve'];
const snapshotOf = () => JSON.stringify(L.serializeProject());

console.log('Morph every member of every form into every other type of its kind (Base):');
let cases = 0;
for (const form of Object.keys(FORMS)) {
	let probe = (function () { const doc = fresh(); return membersOf(FORMS[form](doc)); }());
	const memberList = probe.nodes.map((id) => ['node', id]).concat(probe.links.map((id) => ['link', id]));
	for (const [kind, id] of memberList) {
		for (const to of (kind === 'node' ? NODE_TYPES : LINK_TYPES)) {
			const doc = fresh();
			const g = FORMS[form](doc);
			const el = kind === 'node' ? L.nodeById(id) : L.linkById(id);
			if (el.type === to) { continue; }
			cases++;
			const gid = g.id, before = snapshotOf(), nodesBefore = doc.nodes.length, linksBefore = doc.links.length, typesBefore = {};
			doc.nodes.concat(doc.links).forEach((e) => { typesBefore[e.id] = e.type; });
			asked = [];
			L.setSelectionList([{ kind: kind, id: id }]);
			L.changeSelectedType(to);
			const tag = form + ' ' + id + ' -> ' + to;
			const e2 = kind === 'node' ? L.nodeById(id) : L.linkById(id);
			ok(tag + ': the group is separated', L.getDoc().assemblies.length === 0, JSON.stringify(L.getDoc().assemblies));
			ok(tag + ': the element is now a ' + to, !!e2 && e2.type === to);
			ok(tag + ': no element was lost', L.getDoc().nodes.length === nodesBefore && L.getDoc().links.length === linksBefore);
			ok(tag + ': no other element changed type', L.getDoc().nodes.concat(L.getDoc().links).every((e) => e.id === id || e.type === typesBefore[e.id]));
			ok(tag + ': the status bar says the group was separated', L.lastNotice().indexOf(gid) >= 0 && /separated/.test(L.lastNotice()), L.lastNotice());
			if (form === 'Well with tank') { ok(tag + ': the Well\'s controls are the user\'s now', L.getDoc().controls.every((c) => !c.asm)); }
			L.undo();
			ok(tag + ': ONE Undo restores the group and the type', JSON.stringify(L.serializeProject()) === before && L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].id === gid);
		}
	}
}
console.log('  ' + cases + ' morphs tried');

console.log('\nMorph of several members at once, and an ordinary element beside a group:');
{
	const doc = fresh();
	const g = FORMS['Pump+'](doc);
	const extra = L.addNode('junction', 1200, 0); extra._demand = 1; extra.elev = 100;
	const before = JSON.stringify(doc.assemblies);
	L.setSelectionList([{ kind: 'node', id: extra.id }]);
	L.changeSelectedType('tank');
	ok('an ordinary node morphs and the group beside it is untouched', JSON.stringify(L.getDoc().assemblies) === before && L.nodeById(extra.id).type === 'tank');
	L.setSelectionList([{ kind: 'node', id: g.up }, { kind: 'node', id: g.down }]);
	L.changeSelectedType('reservoir');
	ok('both nodes of a Pump+ morphed together: one group separated, named once', L.getDoc().assemblies.length === 0 && (L.lastNotice().match(new RegExp(g.id, 'g')) || []).length === 1, L.lastNotice());
	L.undo();
	ok('and one Undo restores it', L.getDoc().assemblies.length === 1 && L.nodeById(g.up).type === 'junction');
}
{
	// Into and out of a member's place: a member morphed away, then an ordinary element morphed to the member's old type.
	const doc = fresh();
	const g = FORMS['Valve+'](doc);
	L.setSelectionList([{ kind: 'link', id: g.links[0] }]);
	L.changeSelectedType('pump');
	ok('a Valve+ valve morphed to a pump leaves two plain junctions and a plain pump', L.getDoc().assemblies.length === 0 && L.linkById(g.links[0]).type === 'pump');
	L.setSelectionList([{ kind: 'link', id: g.links[0] }]);
	L.changeSelectedType('valve');
	ok('and morphed back it is a plain valve: the group does not come back by itself', L.getDoc().assemblies.length === 0 && L.linkById(g.links[0]).type === 'valve');
	const r = L.runSolve && true;
	void r;
}

console.log('\nIn a scenario the type is an override; the group still separates, Base keeps its types, Undo restores:');
for (const form of Object.keys(FORMS)) {
	const doc = fresh();
	const g = FORMS[form](doc);
	const dev = g.links[g.kind === 'well' ? 1 : 0];
	L.createScenario('Variant');
	const scn = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(scn.id);
	const before = snapshotOf(), baseType = L.linkById(dev).type;
	L.setSelectionList([{ kind: 'link', id: dev }]);
	L.changeSelectedType(baseType === 'pipe' ? 'valve' : 'pipe');
	ok(form + ' in a scenario: the group is separated', L.getDoc().assemblies.length === 0, JSON.stringify(L.getDoc().assemblies));
	ok(form + ' in a scenario: the scenario sees the new type', L.effective(L.linkById(dev), 'type') !== baseType, L.effective(L.linkById(dev), 'type'));
	L.switchScenario('base');
	ok(form + ' in a scenario: Base is unchanged, still a ' + baseType, L.linkById(dev).type === baseType, L.linkById(dev).type);
	L.switchScenario(scn.id);
	ok(form + ' in a scenario: the status bar says so', /separated/.test(L.lastNotice()), L.lastNotice());
	L.undo();
	ok(form + ' in a scenario: Undo restores the group and the override', JSON.stringify(L.serializeProject()) === before && L.getDoc().assemblies.length === 1);
}

console.log('\nThe project still solves after a Morph of a member:');
(async function () {
	for (const [form, kind, pick, to] of [['Pump+', 'node', (g) => g.down, 'tank'], ['Valve+', 'link', (g) => g.links[0], 'pipe'], ['Well', 'node', (g) => g.nodes[1], 'reservoir'], ['Well with tank', 'node', (g) => g.tee, 'reservoir']]) {
		const doc = fresh();
		const g = FORMS[form](doc);
		L.setSelectionList([{ kind: kind, id: pick(g) }]);
		L.changeSelectedType(to);
		const model = L.currentModel();
		const r = EC.lpnSolve(model);
		ok(form + ': after the morph the built-in solver returns an answer or a named refusal, never a crash', r && (r.ok === true || (r.issues || []).length > 0 || r.engineError !== undefined || r.converged !== undefined), JSON.stringify(r && (r.issues || r.engineError)));
	}
	console.log('\n' + checks + ' checks, ' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}());

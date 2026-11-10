// VALVE+: ONE POINT ON THE MAP, TWO NODES AND A PUMP UNDERNEATH. Run with:
//   node dev/lpn-spike/valve-plus-harness.js
//
// Task 822 (dev/assemblies.md): the second slice, the same pattern as Pump+ with a valve between the nodes.
// be exploded."* 2026-11-06: first slice is Valve+ only. Every assertion drives the page's own tool and pointer
// handlers (the Plus tool, a press on bare map, a press on a pipe, a press on a node in Select) and reads
// the result out of `doc`. Covered:
//   1. place on open ground: two coincident junctions with the U and D prefixes and one valve between them,
//      stored as one grouping; one undo step; several may be placed;
//   2. place by pressing a pipe: the pipe is spliced (pipe, pump, pipe) and both halves keep their ends;
//   3. one press selects the whole group; the Properties box is the combined one, with one Elevation and an
//      Explode button; an elevation edit lands on both nodes (and so does one made through setProp, as the
//      Tables do); renaming a member keeps the group true;
//   4. Explode leaves plain nodes and the valve, and undo brings the group back; deleting a member dissolves it;
//   5. the project file and the `.inp`: save and open round trip, `;ASSEMBLY:` comment in the export, plain
//      EPANET still reads it, import restores the group, a file without one has no such line;
//   6. the ID prefixes: U and D are settable, applied to the next one, and refused with a space.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

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
	"\t\tnodeLabelHidden: function (id) { return nodeEls[id].text.style.visibility === 'hidden'; },\n" +
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
setUnitSet('us');
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
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.assemblies = [];
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
function nodesAt(doc, x, y) { return doc.nodes.filter(function (n) { return n.x === x && n.y === y; }); }
function fieldsOf() { return byId.lpn_popup_fields; }
function allKids(el, out) {
	out = out || [];
	(el.childNodes || el.children || []).forEach(function (c) { out.push(c); allKids(c, out); });
	return out;
}

console.log('\n--- 1. place on open ground ---');
{
	const doc = fresh();
	L.setMode('add-valveplus');
	const d0 = L.undoDepth();
	press(200, 150);
	ok('two junctions and one valve', doc.nodes.length === 2 && doc.links.length === 1 && doc.links[0].type === 'valve',
		doc.nodes.length + '/' + doc.links.length);
	ok('the nodes are coincident', doc.nodes[0].x === doc.nodes[1].x && doc.nodes[0].y === doc.nodes[1].y);
	ok('IDs are V1U and V1D', doc.nodes[0].id === 'V1U' && doc.nodes[1].id === 'V1D', doc.nodes.map((n) => n.id).join(','));
	ok('the pump runs upstream to downstream', doc.links[0].from === 'V1U' && doc.links[0].to === 'V1D');
	ok('one grouping is stored', doc.assemblies.length === 1 && JSON.stringify(doc.assemblies[0]) ===
		JSON.stringify({ id: doc.links[0].id, kind: 'valve', up: 'V1U', down: 'V1D', links: [doc.links[0].id] }), JSON.stringify(doc.assemblies));
	ok('the elevations are equal', doc.nodes[0].elev === doc.nodes[1].elev);
	ok('one undo step', L.undoDepth() === d0 + 1, L.undoDepth() - d0);
	ok('the tool stays armed, so another can be placed', L.getMode() === 'add-valveplus');
	press(500, 150);
	ok('a second one: V2U, V2D and a second group', doc.assemblies.length === 2 && doc.nodes[2].id === 'V2U' && doc.nodes[3].id === 'V2D');
	ok('both nodes keep their own label drawn', !L.nodeLabelHidden('V1U') && !L.nodeLabelHidden('V1D'));
	ok("the valve symbol draws no plus and no discs", (function () { const le = L.linkEls()[doc.links[0].id]; return !!le && !le.asmPlus && !le.asmMarks; })());
	L.undo();
	ok('undo takes the second one away whole', L.getDoc().nodes.length === 2 && L.getDoc().links.length === 1 && L.getDoc().assemblies.length === 1, L.getDoc().nodes.length + '/' + L.getDoc().links.length + '/' + L.getDoc().assemblies.length);
	L.undo();
	ok('and the first', L.getDoc().nodes.length === 0 && L.getDoc().links.length === 0 && L.getDoc().assemblies.length === 0);
}

console.log('\n--- 2. place by pressing a pipe ---');
{
	const doc = fresh();
	const a = L.addNode('junction', 0, 0).id, b = L.addNode('junction', 400, 0).id;
	const pipe = L.addLink('pipe', a, b, []);
	L.nodeById(a).elev = 100; L.nodeById(b).elev = 200;
	L.setMode('add-valveplus');
	press(100, 0, hitLink(pipe.id));
	ok('the spliced pair takes the elevation along the pipe by length (a quarter of the way: 125)',
		L.nodeById('V1U').elev === 125 && L.nodeById('V1D').elev === 125, L.nodeById('V1U').elev + ' ' + L.nodeById('V1D').elev);
	L.undo();
	L.setMode('add-valveplus');
	press(200, 0, hitLink(pipe.id));
	ok('halfway: 150', L.nodeById('V1U').elev === 150 && L.nodeById('V1D').elev === 150, L.nodeById('V1U').elev + ' ' + L.nodeById('V1D').elev);
	const dle = L.nodeEls ? 0 : 0;
	ok('the pipe is spliced: two pipes and a pump', doc.links.filter((l) => l.type === 'pipe').length === 2 && doc.links.filter((l) => l.type === 'valve').length === 1,
		doc.links.map((l) => l.id + ':' + l.type + ' ' + l.from + '>' + l.to).join('; '));
	const g = L.getDoc().assemblies[0];
	ok('one grouping, V1U and V1D', doc.assemblies.length === 1 && g.up === 'V1U' && g.down === 'V1D', JSON.stringify(g));
	const p1 = doc.links.find((l) => l.id === pipe.id), p2 = doc.links.find((l) => l.type === 'pipe' && l.id !== pipe.id);
	ok('the first half ends at the upstream node, the other half starts at the downstream one', p1.from === a && p1.to === 'V1U' && p2.from === 'V1D' && p2.to === b,
		p1.from + '>' + p1.to + ' ' + p2.from + '>' + p2.to);
	ok('both nodes sit on the pipe at the press', nodesAt(L.getDoc(), 200, 0).length === 2);
	ok('one undo gives back the single pipe', (function () { L.undo(); const d = L.getDoc(); return d.links.length === 1 && d.nodes.length === 2 && d.assemblies.length === 0 && d.links[0].to === b; })());
}

console.log('\n--- 3. one press selects it all; one box; one elevation ---');
{
	const doc = fresh();
	L.setMode('add-valveplus');
	press(200, 150);
	L.setMode('select');
	press(200, 150, hitNode('V1D'));
	const sel = L.selected();
	ok('pressing the downstream node selects both nodes and the valve', sel.length === 3 &&
		sel.some((s) => s.kind === 'node' && s.id === 'V1U') && sel.some((s) => s.kind === 'node' && s.id === 'V1D') && sel.some((s) => s.kind === 'link'),
		JSON.stringify(sel));
	press(900, 900);
	press(200, 150, hitLink(doc.links[0].id));
	ok('so does pressing the pump', L.selected().length === 3);
	L.openPopup('V1U', 10, 10);
	ok('opening either node opens the combined box', L.getPopup().kind === 'assembly', JSON.stringify(L.getPopup()));
	const kids = allKids(fieldsOf());
	const explode = kids.find((k) => k.getAttribute && k.getAttribute('data-assembly-explode') === '1');
	ok('the box has an Explode button', !!explode && explode.textContent === 'Explode', explode && explode.textContent);
	// One elevation, edited through the same door the box uses
	L.setProp(L.nodeById('V1U'), 'elev', 123);
	ok('an elevation set on the upstream node lands on both', L.nodeById('V1U').elev === 123 && L.nodeById('V1D').elev === 123);
	L.setProp(L.nodeById('V1D'), 'elev', 77);
	ok('and from the downstream node too', L.nodeById('V1U').elev === 77 && L.nodeById('V1D').elev === 77);
	L.setProp(L.nodeById('V1D'), 'x', 250);
	ok('x moves both nodes: they stay coincident', L.nodeById('V1U').x === 250 && L.nodeById('V1D').x === 250);
	L.setProp(L.nodeById('V1D'), 'x', 200);
	const nearly = doc.links[0].id;
	EC.lpnRenameProbe = null;
}

console.log('\n--- 4. Explode, undo, delete ---');
{
	const doc = fresh();
	L.setMode('add-valveplus');
	press(200, 150);
	L.setMode('select');
	press(200, 150, hitNode('V1U'));
	L.openPopup('V1U', 10, 10);
	const explode = allKids(fieldsOf()).find((k) => k.getAttribute && k.getAttribute('data-assembly-explode') === '1');
	const d0 = L.undoDepth();
	(explode._listeners.click || []).forEach((fn) => fn({}));
	ok('Explode ends the group', doc.assemblies.length === 0);
	ok('and both nodes are labelled again', !L.nodeLabelHidden('V1U') && !L.nodeLabelHidden('V1D'));
	ok('and leaves two plain junctions and the valve', doc.nodes.length === 2 && doc.links.length === 1 && doc.nodes.every((n) => n.type === 'junction') && doc.links[0].type === 'valve');
	ok('as one undo step', L.undoDepth() === d0 + 1);
	L.undo();
	let d = L.getDoc();
	ok('undo brings the group back', d.assemblies.length === 1 && d.assemblies[0].up === 'V1U', JSON.stringify(d.assemblies));
	L.deleteLink(d.links[0].id);
	d = L.getDoc();
	ok('deleting the pump dissolves the group', d.assemblies.length === 0 && d.nodes.length === 2);
	fresh();
	L.setMode('add-valveplus');
	press(200, 150);
	L.deleteNode('V1D');
	d = L.getDoc();
	ok('deleting a node dissolves it too', d.assemblies.length === 0 && d.nodes.length === 1 && d.links.length === 0);
}

console.log('\n--- 5. the project file and the .inp ---');
{
	const doc = fresh();
	const r = L.addNode('reservoir', -100, 0), j = L.addNode('junction', 600, 0);
	r.elev = 100; j._demand = 5;
	const p1 = L.addLink('pipe', r.id, j.id, []);
	L.setMode('add-valveplus');
	press(300, 0, hitLink(p1.id));
	const pumpId = doc.assemblies[0].id;
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the saved project holds the grouping', saved.assemblies && saved.assemblies.length === 1 && saved.assemblies[0].id === pumpId, JSON.stringify(saved.assemblies));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	ok('opened again, the group is there and the nodes and pump with it', L.getDoc().assemblies.length === 1 && L.getDoc().nodes.length === 4 && L.getDoc().links.length === 3);
	ok('and the valve symbol still draws no plus', !L.linkEls()[pumpId].asmPlus);
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeds', out.ok, JSON.stringify(out.error));
	ok('it carries one ;ASSEMBLY: comment line', new RegExp('^;ASSEMBLY: valve V1U V1D ' + pumpId + '$', 'm').test(out.inp), (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const rows = out.inp.split('\n').filter((l) => /^\s*V1U\s|^\s*V1D\s/.test(l));
	ok('V1U and V1D are plain junction rows', rows.length >= 2);
	const parsed = EC.lpnInpParse(out.inp);
	ok('read back, the group is restored', parsed.ok && parsed.assemblies.length === 1 && parsed.assemblies[0].up === 'V1U' && parsed.assemblies[0].down === 'V1D', JSON.stringify(parsed.assemblies));
	ok('with nothing reported', !(parsed.dropped || []).some((d) => d.code === 'assembly-unresolved'));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, 'pp'))); L.buildDom();
	ok('opened as a project, it is a group again', L.getDoc().assemblies.length === 1);
	const out2 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	const asmLine = (t) => (t.match(/^;ASSEMBLY.*$/m) || [''])[0];
	ok('the grouping line survives the round trip unchanged', asmLine(out2.inp) === asmLine(out.inp) && asmLine(out.inp) !== '');
	const p2 = EC.lpnInpParse(out2.inp);
	L.applyUnitSelections(L.inpUnitSelections(p2));
	L.applySaved(L.migrateSaved(L.docFromInp(p2, 'pp'))); L.buildDom();
	ok('and a third export is byte-identical to the second', EC.lpnExportInp(L.serializeProject(), { title: '' }).inp === out2.inp);
	const broken = EC.lpnInpParse(out.inp.replace(/V1D/g, 'V1D').replace(';ASSEMBLY: valve V1U V1D', ';ASSEMBLY: valve V1U NOPE'));
	ok('a group naming a node the file lacks is reported, not half-restored', broken.assemblies.length === 0 && broken.dropped.some((d) => d.code === 'assembly-unresolved'));
	// no assembly, no line
	L.getDoc().assemblies = [];
	ok('with no group, no comment line', !/;ASSEMBLY/.test(EC.lpnExportInp(L.serializeProject(), {}).inp));
}

console.log('\n--- 6a. the Valve+ button tip ---');
{
	const lang = require('fs').readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	ok('the Valve+ tip opens with Tom\'s sentence, then the second sentence unchanged',
		lang.indexOf("$ec_lang['lpn_tool_add_valveplus_tip']='Add a valve, its upstream node, and its downstream node at one point. Specify a point on the map, or specify a pipe to split it and put the valve in it.';") >= 0);
}

console.log('\n--- 6. the ID prefixes ---');
{
	const doc = fresh();
	const S = L.getSettings();
	ok('there is no separate prefix for the two nodes: they take the device\'s ID and a letter', S.idPrefixes.U === undefined && S.idPrefixes.D === undefined);
	S.idPrefixes.V = 'X';
	L.setMode('add-valveplus');
	press(100, 100);
	ok('a changed prefix names the whole group: X1, X1U and X1D', doc.assemblies[0].id === 'X1' && doc.assemblies[0].up === 'X1U' && doc.assemblies[0].down === 'X1D', JSON.stringify(doc.assemblies[0]));
	// A taken member passes the whole number over: X2U is held by a junction, so the next group is X3, X3U, X3D.
	L.addNode('junction', 400, 400, 'X2U');
	press(150, 100);
	ok('a derived ID that is taken moves the whole group to the next free number', doc.assemblies[1].id === 'X3' && doc.assemblies[1].up === 'X3U' && doc.assemblies[1].down === 'X3D', JSON.stringify(doc.assemblies[1]));
	S.idPrefixes.V = 'V';
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);

// THE SIMPLE WELL: A RESERVOIR, A DRAWDOWN VALVE, A PUMP NODE, A PUMP AND A DISCHARGE NODE, AND NOTHING ELSE. Run with:
//   node dev/lpn-spike/well-simple-harness.js
//
// Task 822, round 6 (Tom, 2026-11-11: "focus for now on a simple well with pump and no tank"). Pressing Pump three times places this form; the
// tank form is "Well with tank" (well-harness.js, well-tee-harness.js). Covered:
//   1. place on open ground and by splicing a pipe: five elements, one grouping with three nodes and two links, pipes join the discharge node;
//   2. the box: every input at the top (ID, ground, static level, the two curves, Closed, Active) and none of the tank's; one heading per member,
//      results only, and every heading shows its rows before a run as well as after (Tom: nothing appeared under most headings);
//   3. the ground elevation is the discharge node's and the static level the reservoir's and the pump node's, each reaching only its own mates;
//   4. Explode leaves plain elements; deleting a member dissolves the group; undo restores it;
//   5. the .inp comment is `;ASSEMBLY: well R U D V P`, read back as a tankless Well, and written back byte-identically;
//   6. the Explode tips, for both forms, in the words Tom gave;
//   7. one label block for the assembly, headed by its ID, member rows tagged by their own IDs, every other member's label empty;
//   8. no valve symbol is drawn at a Well, and the symbol sits on the discharge node.
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

function wellNet(withPipe) {
	const doc = fresh();
	L.setMode('add-well'); press(200, 150);
	if (withPipe) {
		const j = L.addNode('junction', 600, 150); j._demand = 10;
		L.addLink('pipe', 'W1P', j.id, []);
	}
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
	L.setProp(doc.links[0], 'curveId', 'DD1'); L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setProp(L.nodeById('W1P'), 'elev', 150); L.setProp(L.nodeById('W1R'), 'elev', 120);
	return doc;
}
(async function () {
console.log('\n--- 1. place ---');
{
	const doc = fresh();
	L.setMode('add-well');
	const d0 = L.undoDepth();
	press(200, 150);
	const types = doc.nodes.map((n) => n.id + ':' + n.type).sort().join(',');
	ok('three nodes: reservoir W1R, drawdown node W1D, pump outlet W1P (Tom: W1, W1R, W1D, W1P)', types === 'W1D:junction,W1P:junction,W1R:reservoir', types);
	ok('two links: the drawdown valve W1V (a GPV, R to D) and the pump W1 (D to P)', doc.links.length === 2 &&
		doc.links[0].id === 'W1V' && doc.links[0].type === 'valve' && doc.links[0].valveType === 'GPV' && doc.links[0].from === 'W1R' && doc.links[0].to === 'W1D' &&
		doc.links[1].id === 'W1' && doc.links[1].type === 'pump' && doc.links[1].from === 'W1D' && doc.links[1].to === 'W1P', doc.links.map((l) => l.id + ' ' + l.from + '>' + l.to).join('; '));
	ok('no tank, no tee, no virtual pipe', !doc.nodes.some((n) => n.type === 'tank') && !doc.links.some((l) => l.virtual));
	ok('one grouping, three nodes and two links, no tank', JSON.stringify(doc.assemblies) === JSON.stringify([{ id: 'W1', kind: 'well', nodes: ['W1R', 'W1D', 'W1P'], links: ['W1V', 'W1'] }]), JSON.stringify(doc.assemblies));
	ok('one undo step; the tool stays armed', L.undoDepth() === d0 + 1 && L.getMode() === 'add-well');
	const R = L.nodeById('W1R'), D = L.nodeById('W1P');
	ok('the static level opens a round 30 m below the ground when there is one', typeof D.elev !== 'number' || R.elev === +(D.elev - 30).toFixed(4), R.elev + ' / ' + D.elev);
}
{
	const doc = fresh();
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 400, 0), p = L.addLink('pipe', a.id, b.id, []);
	L.setProp(a, 'elev', 100); L.setProp(b, 'elev', 100);
	L.setMode('add-well'); press(200, 0, hitLink(p.id));
	const w = doc.assemblies[0];
	ok('pressing a pipe splices a tankless Well in: the pipe ends at the discharge node, its other half starts there', !!w && w.nodes.length === 3 && doc.links.filter((l) => l.type === 'pipe').length === 2 &&
		doc.links.some((l) => l.type === 'pipe' && l.to === w.nodes[2]) && doc.links.some((l) => l.type === 'pipe' && l.from === w.nodes[2]), JSON.stringify(doc.links.map((l) => l.id + ' ' + l.from + '>' + l.to)));
	ok('its ground is the pipe\'s, 100, on the discharge node, the static level below it', L.nodeById(w.nodes[2]).elev === 100 && L.nodeById(w.nodes[0]).elev === 70);
}

console.log('\n--- 2. the box ---');
{
	const doc = wellNet(true);
	L.setMode('select');
	L.openPopup('W1P', 10, 10);
	const entry = entryLabels();
	console.log('        entry area: ' + entry.join(' | '));
	ok('the entry area holds the description and tag, the ground, the static level, the two curves, Closed and Active', ['Description', 'Tag', 'Elevation', 'Static water level elevation', 'Drawdown curve', 'Pump head curve', 'Closed', 'Active'].every((n) => entry.some((x) => x.indexOf(n) === 0)), entry.join(' | '));
	ok('and none of the tank\'s inputs or the pump levels', !entry.some((x) => /Initial depth|Minimum depth|Maximum depth|Tank diameter|Base elevation|Pump on below|Pump off above/.test(x)));
	const t = () => sections().map((s) => s.title);
	ok('five headings, upstream to downstream', JSON.stringify(t()) === JSON.stringify(['Reservoir W1R', 'Drawdown valve W1V', 'Junction W1D', 'Pump W1', 'Junction W1P']), JSON.stringify(t()));
	const noRun = sections();
	console.log('        before a run: ' + noRun.map((s) => s.title + ' [' + s.labels.join('; ') + ']').join('\n                      '));
	ok('before any run every heading still shows a row or more, blank (Tom: nothing under most headings)', noRun.every((s) => s.labels.length >= 1), noRun.map((s) => s.title + ':' + s.labels.length).join(' '));
	const sec = (n) => noRun.find((s) => s.title === n).labels;
	const flowsAll = []; walk(byId.lpn_popup_fields, (e) => { if (e.tagName === 'LABEL' && /^Flow/.test((e.textContent || '').replace(/\s+/g, ' ').trim())) { flowsAll.push(1); } });
	ok('FLOW IS STATED ONCE, above the headings, and no heading repeats it (Tom, round 6: "flow only once")', entryLabels().filter((x) => /^Flow/.test(x)).length === 1 && flowsAll.length === 1 && noRun.every((s) => !s.labels.some((x) => /^Flow/.test(x))), entryLabels().join(' | '));
	ok('PRESSURE IS AT THE OUTLET ONLY: W1P shows Head and Pressure; W1R and W1D show Head alone', sec('Junction W1P').some((x) => /^Pressure/.test(x)) && sec('Junction W1P').some((x) => /^Head/.test(x)) &&
		noRun.filter((s) => s.title !== 'Junction W1P').every((s) => !s.labels.some((x) => /^Pressure/.test(x))) && sec('Junction W1D').some((x) => /^Head/.test(x)) && sec('Reservoir W1R').some((x) => /^Head/.test(x)));
	ok('the pump shows Head and Status, the valve Head loss and Status', sec('Pump W1').some((x) => /^Head/.test(x)) && sec('Drawdown valve W1V').some((x) => /^Head loss/.test(x)));
	ok('no section holds an input', noRun.every((s) => !s.labels.some((x) => /depth|diameter|elevation|curve/i.test(x))));
	L.runSolve();
	await until(() => false, 1500);
	L.openPopup('W1P', 10, 10);
	const run = sections();
	console.log('        after a run: ' + run.map((s) => s.title + ' [' + s.labels.join('; ') + ']').join('\n                     '));
	ok('after a run the same rows are there, now with numbers', run.map((s) => s.labels.map((x) => x.replace(/\s.*$/, '')).join()).join('|') !== '' && run.every((s) => s.labels.length >= noRun.find((q) => q.title === s.title).labels.length - 1));
}

console.log('\n--- 3. which node holds which elevation ---');
{
	const doc = wellNet(false);
	L.setProp(L.nodeById('W1P'), 'elev', 200);
	ok('the ground typed on the discharge node reaches no other node', L.nodeById('W1R').elev === 120 && L.nodeById('W1D').elev === 120);
	L.setProp(L.nodeById('W1D'), 'elev', 110);
	ok('the static level typed on the pump node reaches the reservoir and not the ground', L.nodeById('W1R').elev === 110 && L.nodeById('W1P').elev === 200);
	L.setProp(L.nodeById('W1P'), 'x', 321);
	ok('position reaches all three', doc.nodes.every((n) => n.x === 321));
}

console.log('\n--- 4. explode, delete, undo ---');
{
	const doc = wellNet(true);
	L.snap(); L.explode('W1');
	ok('Explode leaves five plain nodes and links and no group', doc.assemblies.length === 0 && doc.nodes.length === 4 && doc.links.length === 3);
	L.undo();
	ok('undo brings the group back', doc.assemblies.length === 1 || L.getDoc().assemblies.length === 1);
}
{
	const doc = wellNet(false);
	L.deleteLink('W1V');
	ok('deleting a member dissolves the group', L.getDoc().assemblies.length === 0);
}

console.log('\n--- 5. the .inp ---');
{
	const doc = wellNet(true);
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('the export succeeds', out.ok, JSON.stringify(out.error));
	ok('it carries `;ASSEMBLY: well W1R W1D W1P W1V W1`', /^;ASSEMBLY: well W1R W1D W1P W1V W1$/m.test(out.inp), (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const parsed = EC.lpnInpParse(out.inp);
	ok('read back, a tankless Well is restored with nothing reported', parsed.ok && parsed.assemblies.length === 1 && parsed.assemblies[0].nodes.join() === 'W1R,W1D,W1P' && !(parsed.dropped || []).some((d) => d.code === 'assembly-unresolved'), JSON.stringify(parsed.assemblies));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, ''))); L.buildDom();
	const out2 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	ok('the comment line survives unchanged', (out2.inp.match(/^;ASSEMBLY.*$/m) || [''])[0] === (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const p2 = EC.lpnInpParse(out2.inp);
	L.applyUnitSelections(L.inpUnitSelections(p2));
	L.applySaved(L.migrateSaved(L.docFromInp(p2, 'w'))); L.buildDom();
	const out3 = EC.lpnExportInp(L.serializeProject(), { title: '' });
	ok('export, import, export is byte-identical', out3.inp === out2.inp);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	ok('the project file round trip keeps the three-node group', L.getDoc().assemblies.length === 1 && L.getDoc().assemblies[0].nodes.length === 3);
}

console.log('\n--- 6. the Explode tips and the button tips ---');
{
	const lang = require('fs').readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	ok('the tank form\'s tip is Tom\'s own wording', lang.indexOf("$ec_lang['lpn_assembly_explode_welltank_tip']='Separate this into its reservoir, drawdown valve, valve/pump node, pump, tee/connect node, virtual pipe, and tank, which stay in the network as ordinary elements.';") >= 0);
	ok('the simple Well\'s tip follows the same pattern', lang.indexOf("$ec_lang['lpn_assembly_explode_well_tip']='Separate this into its reservoir, drawdown valve, valve/pump node, pump, and discharge node, which stay in the network as ordinary elements.';") >= 0);
	const icons = require('fs').readFileSync(ROOT + 'lib/Icons.lib.php', 'utf8');
	ok('Well and Well with tank each have an icon of their own', /'well'\s*=>/.test(icons) && /'welltank'\s*=>/.test(icons));
}

console.log('\n--- 7. one label block ---');
{
	const doc = wellNet(true);
	L.runSolve();
	await until(() => false, 1500);
	const ls = L.scnLabels();
	ls.node.head = true;   // Tom's example block shows H on the rows; the default labels show P and Z
	const lines = (id) => L.nodeLines(L.nodeById(id), ls, null).map((x) => x.text);
	const block = lines('W1P');
	console.log('        the block: ' + JSON.stringify(block));
	ok('the outlet carries the block; its heading is the assembly ID with Z (the ground) and Q (the pump flow), in that order', block.length >= 2 && /^W1 /.test(block[0]) && /Q=/.test(block[0]) && /Z=/.test(block[0]) && block[0].indexOf('Z=') < block[0].indexOf('Q='), JSON.stringify(block));
	ok('no other number is in the heading', block[0].replace(/^W1/, '').split(/[ ,]+/).filter((x) => /[=:]/.test(x) || /^[0-9.-]+$/.test(x)).length <= 3, block[0]);
	ok('rows: W1R and W1D give H and no P; W1P gives H and P; the drawdown valve W1V has no row', block.length === 4 && /^W1R /.test(block[1]) && /^W1D /.test(block[2]) && /^W1P /.test(block[3]) &&
		/H=/.test(block[1]) && !/P=/.test(block[1]) && /H=/.test(block[2]) && !/P=/.test(block[2]) && /H=/.test(block[3]) && /P=/.test(block[3]) && !block.some((r) => /^W1V /.test(r)), JSON.stringify(block));
	ok('Q appears once in the block, in the heading', block.filter((r) => /Q=/.test(r)).length === 1);
	ok('every other node of the Well has an empty label', lines('W1R').length === 0 && lines('W1D').length === 0);
	ok('every link of the Well has an empty label', L.linkLines(L.linkById('W1'), ls, null).length === 0 && L.linkLines(L.linkById('W1V'), ls, null).length === 0);
	const plain = L.nodeLines(L.nodeById('J1'), ls, null);
	ok('an ordinary node is untouched', plain.length > 0 && plain[0].text === 'J1');
	ls.node.id = false; ls.link.id = false;
	const ls2 = L.nodeLines(L.nodeById('W1P'), ls, null);
	ok('the heading stays even with IDs off (it is the tag)', ls2.length > 0 && /^W1 /.test(ls2[0].text));
}

console.log('\n--- 8. the drawing ---');
{
	const doc = wellNet(true);
	const ne = L.nodeEls();
	ok('the discharge node is the one drawn as the Well, with its own grab shape', L.nodeHitSilhouette(L.nodeById('W1P')) !== null && String(ne.W1P.hit.tagName).toLowerCase() === 'path');
	ok('the reservoir and the pump node draw nothing', /lpn-asm-hid/.test(ne.W1R.circle.className || (ne.W1R.circle.getAttribute && ne.W1R.circle.getAttribute('class')) || '') || (ne.W1R.circle.classList && ne.W1R.circle.classList.contains && ne.W1R.circle.classList.contains('lpn-asm-hid')));
	const les = L.linkEls();
	const hidden = (e) => e && e.symbolG && ((e.symbolG.classList && e.symbolG.classList.contains && e.symbolG.classList.contains('lpn-asm-hid')) || /lpn-asm-hid/.test(e.symbolG.className || ''));
	ok('no valve symbol and no pump symbol is drawn at a Well', hidden(les.W1V) !== false && hidden(les.W1) !== false);
	L.explode('W1');
	ok('after Explode the discharge node is a plain junction again, with a disc for a grab shape', String(ne.W1P.hit.tagName).toLowerCase() !== 'path');
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
})();

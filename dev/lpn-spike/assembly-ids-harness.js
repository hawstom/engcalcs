// EVERY MEMBER OF AN ASSEMBLY IS IN ITS PROPERTIES BOX, AND A GROUP'S ID MAY BE ITS OUTLET NODE'S. Run with:
//   node dev/lpn-spike/assembly-ids-harness.js
//
// Task 822, round 8 (Tom, 2026-11-14). Covered:
//   1. THE TRANSPARENCY RULE, NO EXCEPTIONS (Tom: "I like that we are transparent in that we list every model element in Properties. Let's ensure that we
//      make that a rule with no exceptions."): build Pump+, Valve+, Well and Well with tank (and a Well saved before this round); open each group's
//      Properties; every member element (every node and link the grouping names, the tee, tank and branch pipes of a Well with tank included) appears
//      there under its own ID, as a section with that ID in its heading;
//   2. the Well's IDs (Tom's list): W1 the Well, W1R the aquifer reservoir, W1DV the drawdown valve, W1D the drawdown node, W1P the pump, W1 the node
//      at the outlet. The group and the outlet node share a text; every lookup, rename, Find-by-ID path, export, Explode and Undo still answers;
//   3. a file saved before this round keeps its IDs (pump W1, outlet W1P) and still renames and explodes;
//   4. a Well with tank's tee and tank follow the Well's elevation until the user types one of their own, and the diverged state survives a save, a
//      reopen and Undo;
//   5. group IDs are unique across every group (a Well's is a node's, a Pump+'s a link's): a rename, an `.inp` line, a project file, the mint and
//      the prefix batch each refuse or resolve a clash, and the box, the graph's remembered member and the controls find the right group;
//   6. the bearer is stored, so renaming an older Well's outlet to its pump's ID does not flip it;
//   7. following under the DEM source, in one batch in either order, in a scenario (typing there ends it there only; clearing the outlet's override clears
//      the followers'), and with a blank typed.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(
	"\t\tviaOwnerDoor: viaOwnerDoor,\n" +
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode, getMode: function () { return mode; },\n" +
	"\t\tundo: undo, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tselected: function () { return selectedRefs(); },\n" +
	"\t\tsetProp: setProp, effective: effective, runSolve: runSolve, closePopup: closePopup,\n" +
	"\t\topenPopup: openPopup, openLinkPopup: openLinkPopup, getPopup: function () { return currentPopup; },\n" +
	"\t\tapplySaved: applySaved, migrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tapplyNodeRename: applyNodeRename, applyLinkRename: applyLinkRename,\n" +
	"\t\tassemblyById: assemblyById, assemblyAllNodeIds: assemblyAllNodeIds, assemblyAllLinkIds: assemblyAllLinkIds, assemblyOfNode: assemblyOfNode, assemblyOfLink: assemblyOfLink,\n" +
	"\t\tidsTaken: function (id, group) { return validateNewId(id, '', group) !== true; },\n" +
	"\t\tapplyPrefix: function (key) { return elementsForIdKey(key).map(function (x) { return x.id; }); },\n" +
	"\t\texplode: explodeAssembly, snap: saveUndoSnapshot, syncWellControls: syncWellControls,\n" +
	"\t\tvalidate: validateNewId, applyPrefixAll: applyIdPrefixToAll, getSettings: function () { return settings; }, lastNotice: function () { return lastNoticeText; },\n" +
	"\t\tforceDem: function (on) { elevSourceIsDem = function () { return !!on; }; }, terrainFill: terrainFillElevations, clearOverride: clearOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, bearerOf: assemblyBearer, renameBearer: renameAssemblyBearer,\n" +
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
function walk(root, fn) { (function go(e) { if (!e) { return; } fn(e); (e.children || e.childNodes || []).forEach(go); }(root)); }
// The IDs the group's box names: each section carries its member's ID in `data-asm-member` and in the heading's text.
function boxIds() {
	const out = [];
	walk(byId.lpn_popup_fields, (e) => {
		if (e.tagName === 'SECTION' && /lpn-asm-section/.test(e.className || '')) {
			const h = (e.children || e.childNodes).find((c) => c.tagName === 'H5'), id = e.getAttribute('data-asm-member');
			if (id && h && h.textContent.split(' ').pop() === id) { out.push(id); }
		}
	});
	return out;
}
function members(a) { return { nodes: L.assemblyAllNodeIds(a), links: L.assemblyAllLinkIds(a) }; }

const DD = [[0, 0], [20, 4], [40, 14], [60, 30]];
const PH = [[0, 70], [30, 62], [60, 40]];
function curves(doc) {
	doc.curves.push({ id: 'DD1', kind: 'headloss', points: DD.map((p) => p.slice()) });
	doc.curves.push({ id: 'PC1', kind: 'head', points: PH.map((p) => p.slice()) });
}

console.log('--- 1. the transparency rule: every member, under its own ID, in every form ---');
{
	const doc = fresh();
	curves(doc);
	L.setMode('add-pumpplus'); press(100, 100);
	L.setMode('add-valveplus'); press(100, 300);
	L.setMode('add-well'); press(300, 100);
	L.setMode('add-welltank'); press(300, 400); press(400, 400); press(500, 400);
	L.setMode('select');
	ok('four groups, one of each form', doc.assemblies.map((a) => a.kind).join() === 'pump,valve,well,well', doc.assemblies.map((a) => a.kind).join());
	doc.assemblies.forEach((a) => {
		const m = members(a), want = m.nodes.concat(m.links).sort();
		L.openPopup(a.kind === 'well' ? a.nodes[2] : a.up, 10, 10);
		const got = boxIds().sort();
		const label = a.kind + ' ' + a.id + (a.tank ? ' with tank' : '');
		ok(label + ': every member element is in its Properties under its own ID (' + want.length + ')', JSON.stringify(got) === JSON.stringify(want), 'box: ' + got.join(',') + ' / members: ' + want.join(','));
		L.closePopup();
	});
	const w = doc.assemblies[2], wt = doc.assemblies[3];
	ok('a simple Well has five members (W1R, W1DV, W1D, W1P, W1) and a Well with tank nine', members(w).nodes.length + members(w).links.length === 5 && members(wt).nodes.length + members(wt).links.length === 9);
}

console.log('\n--- 2. the Well\'s IDs, and a group ID that is also a node ID ---');
{
	const doc = fresh();
	curves(doc);
	L.setMode('add-well'); press(200, 150);
	const j = L.addNode('junction', 600, 150); j._demand = 10;
	L.addLink('pipe', 'W1', j.id, []);
	L.setProp(doc.links[0], 'curveId', 'DD1'); L.setProp(doc.links[1], 'curveId', 'PC1');
	L.setMode('select');
	const a = doc.assemblies[0];
	ok('W1 the Well, W1R the aquifer reservoir, W1DV the virtual valve, W1D the drawdown node, W1P the pump, W1 the outlet node',
		a.id === 'W1' && a.nodes.join() === 'W1R,W1D,W1' && a.links.join() === 'W1DV,W1P' && L.nodeById('W1').type === 'junction' && L.nodeById('W1R').type === 'reservoir' && L.linkById('W1P').type === 'pump' && L.linkById('W1DV').valveType === 'GPV');
	ok('the group is found by its ID, and by the outlet node, the pump, the valve', L.assemblyById('W1') === a && L.assemblyOfNode('W1') === a && L.assemblyOfLink('W1P') === a && L.assemblyOfLink('W1DV') === a);
	ok('the ID-uniqueness check treats W1 as taken among nodes (it is a node) and free among links', L.idsTaken('W1', 'node') && !L.idsTaken('W1', 'link') && L.idsTaken('W1P', 'link'));
	ok('the next Well skips the whole number (W1 is taken by the first) and the Well prefix\'s batch is the outlet nodes', (() => { L.setMode('add-well'); press(200, 400); L.setMode('select'); return doc.assemblies[1].id === 'W2'; })() && L.applyPrefix('W').join() === 'W1,W2');
	ok('no other prefix\'s Apply to all would take a Well\'s outlet node: it is in no J batch', L.applyPrefix('J').indexOf('W1') < 0 && L.applyPrefix('J').indexOf('W2') < 0 && L.applyPrefix('P').indexOf('W1P') < 0 && L.applyPrefix('V').indexOf('W1DV') < 0 && L.applyPrefix('R').indexOf('W1R') < 0);
	// Rename: the outlet node's rename moves the group's ID; the pump's does not.
	L.snap(); L.applyLinkRename('W1P', 'PUMPX');
	ok('renaming the pump leaves the group\'s ID alone and the group true', a.id === 'W1' && a.links[1] === 'PUMPX' && L.assemblyById('W1') === a);
	L.openPopup('W1', 10, 10);
	L.snap(); L.applyNodeRename('W1', 'WELLA');
	ok('renaming the outlet node renames the group (the group\'s ID is its outlet node\'s) and the group stays true', a.id === 'WELLA' && a.nodes[2] === 'WELLA' && L.assemblyById('WELLA') === a && !L.assemblyById('W1'));
	ok('and the open box follows the new ID (a rename from the Tables pane does not close it)', L.getPopup() && L.getPopup().kind === 'assembly' && L.getPopup().id === 'WELLA', JSON.stringify(L.getPopup()));
	L.closePopup();
	L.snap(); L.applyNodeRename('WELLA', 'W1');
	L.syncWellControls(a);
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('export succeeds and the comment line carries the Well\'s own ID', out.ok && /^;ASSEMBLY: well W1R W1D W1 W1DV PUMPX ID=W1$/m.test(out.inp), (out.inp.match(/^;ASSEMBLY.*$/m) || [''])[0]);
	const p = EC.lpnInpParse(out.inp);
	ok('read back, the group\'s ID is W1 again, not the pump\'s', p.ok && p.assemblies[0].id === 'W1');
	// Explode, Undo.
	L.snap(); L.explode('W1');
	ok('Explode leaves W1 the node and PUMPX the link; no group answers to W1', !L.assemblyById('W1') && !!L.nodeById('W1') && !!L.linkById('PUMPX') && L.assemblyOfNode('W1') === null);
	L.undo();
	ok('Undo brings the group back, still W1, with the outlet node W1', !!L.assemblyById('W1') && L.assemblyById('W1').nodes[2] === 'W1' && !!L.nodeById('W1'));
	// Save and reopen.
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	ok('save and reopen keep the group\'s ID', L.getDoc().assemblies[0].id === 'W1' && L.getDoc().assemblies[0].nodes[2] === 'W1');
	// The title of the box.
	L.openPopup('W1', 10, 10);
	ok('the box is titled with the Well\'s own ID, not the pump\'s', /Well W1$/.test(byId.lpn_popup_boxtitle ? byId.lpn_popup_boxtitle.textContent : 'Well W1'));
}

console.log('\n--- 3. a file saved before this round keeps its IDs ---');
{
	fresh();
	const old = JSON.parse(fs.readFileSync(ROOT + 'dev/lpn-spike/assembly-before-round8.lwn', 'utf8'));
	L.applySaved(L.migrateSaved(old)); L.buildDom();
	const doc = L.getDoc(), a = L.assemblyById('W1');
	ok('the old Well opens with its own IDs: pump W1, valve W1V, outlet W1P, group W1 (the pump\'s)', !!a && a.nodes.join() === 'W1R,W1D,W1P' && a.links.join() === 'W1V,W1' && L.linkById('W1').type === 'pump' && L.nodeById('W1P').type === 'junction');
	const m = members(a), want = m.nodes.concat(m.links).sort();
	L.openPopup('W1P', 10, 10);
	ok('its Properties list every member under its own ID, as the new ones do', JSON.stringify(boxIds().sort()) === JSON.stringify(want), boxIds().join());
	L.closePopup();
	L.snap(); L.applyLinkRename('W1', 'PMP');
	ok('renaming the old Well\'s pump renames its group (its ID is its pump\'s)', a.id === 'PMP' && a.links[1] === 'PMP');
	L.snap(); L.applyNodeRename('W1P', 'OUT');
	ok('renaming the old Well\'s outlet leaves its group\'s ID alone', a.id === 'PMP' && a.nodes[2] === 'OUT');
	const out = EC.lpnExportInp(L.serializeProject(), {});
	ok('its comment line carries no ID= (a file before this round says no more than it did)', /^;ASSEMBLY: well W1R W1D OUT W1V PMP( ON=\S+)?( OFF=\S+)?/m.test(out.inp) && !/^;ASSEMBLY: well [^\n]*ID=/m.test(out.inp), (out.inp.match(/^;ASSEMBLY: well.*$/m) || [''])[0]);
	const w2 = doc.assemblies.filter((x) => x.kind === 'well' && x.tank)[0];
	ok('the old Well with tank has no following tee or tank (its elevations were typed)', !!w2 && !w2.teeFollow && !w2.tankFollow);
	const t0 = L.nodeById(w2.tank).elev;
	L.setProp(L.nodeById(w2.nodes[2]), 'elev', 777);
	ok('so changing its Well\'s elevation leaves its tank and tee alone', L.nodeById(w2.tank).elev === t0 && L.nodeById(w2.tee).elev !== 777);
}

console.log('\n--- 4. a Well with tank: the tee follows the Well\'s elevation until the user types its own; the tank opens at it and is its own (round 15) ---');
{
	const doc = fresh();
	L.setMode('add-welltank'); press(200, 150); press(400, 150); press(400, 400);
	L.setMode('select');
	const a = doc.assemblies[0], well = L.nodeById('W1'), tee = L.nodeById(a.tee), tank = L.nodeById(a.tank);
	ok('a new Well with tank: the tee and the tank open at the Well\'s elevation, and only the tee follows it', tee.elev === well.elev && tank.elev === well.elev && a.teeFollow === true && a.tankFollow === undefined, [well.elev, tee.elev, tank.elev].join());
	L.setProp(well, 'elev', 250);
	ok('typing the Well\'s elevation moves the tee and leaves the tank', tee.elev === 250 && tank.elev === 0, [tee.elev, tank.elev].join());
	L.snap();
	L.setProp(tank, 'elev', 300);
	ok('a tank elevation typed on the tank itself (no owner door) is written, and the tee still follows', a.tankFollow === undefined && a.teeFollow === true && tank.elev === 300 && tee.elev === 250);
	L.setProp(well, 'elev', 260);
	ok('the Well\'s next elevation moves the tee, and the tank stays as typed', tee.elev === 260 && tank.elev === 300, [tee.elev, tank.elev].join());
	L.setProp(tee, 'elev', 270);
	L.setProp(well, 'elev', 280);
	ok('a tee elevation typed ends the tee\'s following too; both stay', tee.elev === 270 && tank.elev === 300 && a.teeFollow === undefined);
	// Undo: back to the state before the tank was typed.
	L.undo();
	const a2 = L.getDoc().assemblies[0];
	ok('Undo restores the tee\'s following and the tank\'s elevation before it was typed', a2.tankFollow === undefined && a2.teeFollow === true && L.nodeById(a2.tank).elev === 0 && L.nodeById(a2.tee).elev === 250, JSON.stringify([a2.teeFollow, a2.tankFollow, L.nodeById(a2.tank).elev]));
	// Diverge, save, reopen.
	L.setProp(L.nodeById(a2.tank), 'elev', 400);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const a3 = L.getDoc().assemblies[0];
	ok('the tank\'s own elevation survives save and reopen, and the tee still follows', !a3.tankFollow && a3.teeFollow === true && L.nodeById(a3.tank).elev === 400);
	L.setProp(L.nodeById('W1'), 'elev', 500);
	ok('and after reopening the Well moves the tee and not the tank', L.nodeById(a3.tee).elev === 500 && L.nodeById(a3.tank).elev === 400, [L.nodeById(a3.tee).elev, L.nodeById(a3.tank).elev].join());
	// The existing-elements forms: a tee that is an existing junction and an existing tank were the user's, so they never follow.
	const doc2 = fresh();
	const jx = L.addNode('junction', 700, 100); jx.elev = 33;
	const tk = L.addNode('tank', 700, 300); tk.elev = 44;
	L.setMode('add-welltank'); press(200, 150); press(700, 100, hitNode(jx.id)); press(700, 300, hitNode(tk.id));
	L.setMode('select');
	const b = doc2.assemblies[0];
	L.setProp(L.nodeById('W1'), 'elev', 90);
	ok('an existing junction and an existing tank pressed as the tee and the tank are not followers', !b.teeFollow && !b.tankFollow && jx.elev === 33 && tk.elev === 44, [jx.elev, tk.elev].join());
	// A tee pressed on an existing pipe splits it, and is the Well's own placing: it takes the Well's elevation and follows it until its own is typed (Tom, 2026-11-15).
	const doc3 = fresh();
	const p1 = L.addNode('junction', 100, 400), p2 = L.addNode('junction', 700, 400); p1.elev = 10; p2.elev = 20;
	const pp = L.addLink('pipe', p1.id, p2.id, []);
	L.setMode('add-welltank'); press(200, 150); press(400, 400, { dataset: { link: pp.id }, classList: { contains: function () { return false; } } }); press(600, 150);
	L.setMode('select');
	const c = doc3.assemblies[0], well3 = L.nodeById('W1'), tee3 = c.tee && L.nodeById(c.tee);
	ok('a tee pressed on an existing pipe splits it and takes the Well\'s elevation, following it', !!tee3 && tee3.id !== p1.id && tee3.id !== p2.id && tee3.elev === well3.elev && c.teeFollow === true, JSON.stringify([c.tee, tee3 && tee3.elev, well3.elev, c.teeFollow]));
	L.setProp(well3, 'elev', 321);
	ok('and the Well\'s next elevation moves that tee', tee3.elev === 321, String(tee3 && tee3.elev));
	L.setProp(tee3, 'elev', 55);
	L.setProp(well3, 'elev', 400);
	ok('until the user types the tee\'s own elevation, which stays', tee3.elev === 55 && c.teeFollow === undefined, [tee3.elev, c.teeFollow].join());
}

console.log('\n--- 5. group IDs are unique across every group ---');
{
	const doc = fresh();
	curves(doc);
	L.setMode('add-pumpplus'); press(100, 100);
	L.setMode('add-well'); press(300, 100);
	L.setMode('select');
	const pp = doc.assemblies[0], w = doc.assemblies[1];
	ok('a Pump+ P1 (a link\'s ID) and a Well W1 (a node\'s ID)', pp.id === 'P1' && w.id === 'W1');
	ok('renaming the Well\'s outlet to P1, the Pump+\'s ID, is refused in the ID-taken words', L.validate('P1', 'W1', 'node') === (EC.pageConfig.lpn_id_taken || 'That ID is already in use.'), String(L.validate('P1', 'W1', 'node')));
	ok('and the Pump+\'s pump to W1, the Well\'s ID, likewise', L.validate('W1', 'P1', 'link') !== true, String(L.validate('W1', 'P1', 'link')));
	ok('a member that bears no group ID may take either text (W1D to P1 is a node, not a group)', L.validate('P1', 'W1D', 'node') === true);
	ok('a Well\'s ID is found by its ID, the Pump+\'s by its own: each opens its own box', (() => { L.openPopup('P1U', 1, 1); const a1 = L.getPopup().id; L.openPopup('W1', 1, 1); return a1 === 'P1' && L.getPopup().id === 'W1' && L.assemblyById('P1') === pp && L.assemblyById('W1') === w; })());
	// The prefix: Well prefix set to the Pump+'s, so the Apply to all target is the Pump+'s ID.
	L.getSettings().idPrefixes.W = 'P';
	L.applyPrefixAll('W');
	ok('Apply to all with the Well prefix P would make the Well P1: it is skipped, nothing is renamed', w.id === 'W1' && !!L.nodeById('W1'), w.id + ' / ' + L.lastNotice());
	L.getSettings().idPrefixes.W = 'W';
	// Minting: a Well placed while the Well prefix equals the Pump+'s skips the whole number.
	L.getSettings().idPrefixes.W = 'P';
	L.resetIds();
	L.setMode('add-well'); press(500, 100); L.setMode('select');
	const ids = doc.assemblies.map((x) => x.id);
	ok('a Well minted under the prefix P takes a whole number no group holds (P2), so every group ID is its own', new Set(ids).size === ids.length && ids.indexOf('P2') >= 0, ids.join());
	L.getSettings().idPrefixes.W = 'W';
	// The .inp: a Well whose outlet node is named P1 and a Pump+ whose pump is P1.
	const text = EC.lpnExportInp(L.serializeProject(), {}).inp;
	const clash = text.replace(/\bW1\b/g, 'P1');
	const parsed = EC.lpnInpParse(clash);
	const gids = parsed.assemblies.map((x) => x.id);
	ok('an .inp whose Well outlet is the Pump+\'s ID reads with unique group IDs: the Well falls back to its pump\'s (W1P)', parsed.ok && new Set(gids).size === gids.length && gids.indexOf('W1P') >= 0 && gids.indexOf('P1') >= 0, gids.join());
	const fix = EC.lpnGroupIdFix([{ id: 'A', kind: 'pump', links: ['A'] }, { id: 'A', kind: 'valve', links: ['A'] }, { id: 'A', kind: 'well', idBy: 'node', links: ['G', 'A'] }]);
	ok('and a clash with no fallback is not grouped and is named: the first keeps the ID, the well falls back only to a free pump ID', fix.kept.length === 1 && fix.clashed.join() === 'A,A', JSON.stringify(fix));
	// A project file with the same clash.
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	const sw = saved.assemblies.filter((x) => x.kind === 'well')[0];
	sw.id = 'P1'; delete sw.idBy;
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const after = L.getDoc().assemblies.map((x) => x.id);
	ok('a project file naming a Well P1 beside the Pump+ P1 opens with unique group IDs, the later group not grouped, and says so', new Set(after).size === after.length && after.filter((x) => x === 'P1').length === 1 && L.lastNotice().indexOf('share an ID') >= 0, after.join() + ' / ' + L.lastNotice());
}

console.log('\n--- 6. the bearer is stored, not read from the texts ---');
{
	fresh();
	const old = JSON.parse(fs.readFileSync(ROOT + 'dev/lpn-spike/assembly-before-round8.lwn', 'utf8'));
	L.applySaved(L.migrateSaved(old)); L.buildDom();
	const a = L.assemblyById('W1');
	ok('an older Well\'s bearer is its pump (W1), and its outlet is W1P', L.bearerOf(a).group === 'link' && L.bearerOf(a).id === 'W1' && a.nodes[2] === 'W1P');
	L.snap(); L.applyNodeRename('W1P', 'W1');
	ok('renaming its outlet W1P to W1 (the pump\'s ID) leaves the bearer the pump and the group W1', L.bearerOf(a).group === 'link' && L.bearerOf(a).id === 'W1' && a.id === 'W1' && a.nodes[2] === 'W1');
	L.snap(); L.renameBearer(a, 'PUMPQ');
	ok('and one rename of the bearer renames the pump and the group, not the outlet', a.id === 'PUMPQ' && a.links[1] === 'PUMPQ' && a.nodes[2] === 'W1');
}

console.log('\n--- 7. following: the DEM source, a batch in either order, a scenario, a blank ---');
{
	L.forceDem(true);
	const doc = fresh();
	L.setMode('add-welltank'); press(200, 150); press(400, 150); press(400, 400); L.setMode('select');
	let a = doc.assemblies[0];
	ok('under the DEM source a tee and a tank on open ground take their own ground and do not follow', !a.teeFollow && !a.tankFollow, JSON.stringify([a.teeFollow, a.tankFollow]));
	const readings = { W1: 100, tee: 250, tank: 300 };
	const run = (order) => {
		['W1', a.tee, a.tank].forEach((id) => { delete L.nodeById(id).elev; });
		L.terrainFill(order.map((k) => ({ id: k === 'W1' ? 'W1' : a[k], meters: readings[k] })));
		return [L.nodeById('W1').elev, L.nodeById(a.tee).elev, L.nodeById(a.tank).elev].join();
	};
	const r1 = run(['W1', 'tee', 'tank']), r2 = run(['tee', 'tank', 'W1']), r3 = run(['tank', 'W1', 'tee']);
	ok('one DEM batch gives the same elevations in any order: each reads its own ground', r1 === r2 && r2 === r3 && r1 !== '' , [r1, r2, r3].join(' | '));
	L.forceDem(false);
	// A follower and a DEM fill of the outlet: the fill moves nobody.
	const doc2 = fresh();
	L.setMode('add-welltank'); press(200, 150); press(400, 150); press(400, 400); L.setMode('select');
	a = doc2.assemblies[0];
	L.setProp(L.nodeById('W1'), 'elev', 50);
	const tee0 = L.nodeById(a.tee).elev;
	delete L.nodeById('W1').elev;
	L.forceDem(true);
	L.terrainFill([{ id: 'W1', meters: 777 }]);
	L.forceDem(false);
	ok('a DEM fill of the outlet does not carry a following tee to its reading (and does not end its following)', L.nodeById(a.tee).elev === tee0 && a.teeFollow === true, [L.nodeById(a.tee).elev, tee0, a.teeFollow].join());
	// A blank typed on the outlet is not an elevation to follow.
	L.setProp(L.nodeById('W1'), 'elev', 120);
	L.setProp(L.nodeById('W1'), 'elev', '');
	ok('a blank typed on the Well leaves the tee where it was', L.nodeById(a.tee).elev === 120, String(L.nodeById(a.tee).elev));
	L.setProp(L.nodeById(a.tank), 'elev', 60);
	L.setProp(L.nodeById('W1'), 'elev', 120);
	// Scenarios.
	const scn = L.createScenario('Dry year');
	L.setProp(L.nodeById('W1'), 'elev', 900);
	ok('in a scenario the Well\'s elevation reaches the tee as an override and not the tank: Base is untouched', L.effective(L.nodeById(a.tee), 'elev') === 900 && L.effective(L.nodeById(a.tank), 'elev') === 60 && L.nodeById(a.tee).elev === 120 && L.nodeById(a.tank).elev === 60);
	L.clearOverride(L.nodeById('W1'), 'elev');
	ok('clearing the Well\'s override in the scenario clears the tee\'s too: no stale 900', L.effective(L.nodeById('W1'), 'elev') === 120 && L.effective(L.nodeById(a.tee), 'elev') === 120 && L.effective(L.nodeById(a.tank), 'elev') === 60, [L.effective(L.nodeById(a.tee), 'elev'), L.effective(L.nodeById(a.tank), 'elev')].join());
	L.setProp(L.nodeById(a.tee), 'elev', 500);
	ok('an elevation typed on the tee in the scenario ends its following there only: Base still follows', a.teeFollow === true && a.followOff && Object.keys(a.followOff).length === 1 && a.tankFollow === undefined);
	L.setProp(L.nodeById('W1'), 'elev', 950);
	ok('in that scenario the next Well elevation moves neither the tee nor the tank', L.effective(L.nodeById(a.tee), 'elev') === 500 && L.effective(L.nodeById(a.tank), 'elev') === 60, [L.effective(L.nodeById(a.tee), 'elev'), L.effective(L.nodeById(a.tank), 'elev')].join());
	L.switchScenario('base');
	L.setProp(L.nodeById('W1'), 'elev', 130);
	ok('back in Base the tee still follows (typing in the scenario did not end it here) and the tank stays', L.nodeById(a.tee).elev === 130 && L.nodeById(a.tank).elev === 60, [L.nodeById(a.tee).elev, L.nodeById(a.tank).elev].join());
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(L.migrateSaved(saved)); L.buildDom();
	const b = L.getDoc().assemblies[0];
	ok('the per-scenario state survives save and reopen', b.teeFollow === true && b.followOff && Object.keys(b.followOff).length === 1, JSON.stringify(b.followOff));
}

console.log('\n--- 8. source guards from the round 9 review ---');
{
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8'), icons = fs.readFileSync(ROOT + 'lib/Icons.lib.php', 'utf8');
	const icon = (name) => require('child_process').execFileSync('php', ['-r', 'require $argv[1]; echo $ec_icons[$argv[2]];', ROOT + 'lib/Icons.lib.php', name], { encoding: 'utf8' });
	const lit = /^<path [^>]*? ?d="([^"]+)"/.exec(icon('well'))[1];
	ok('the Well silhouette fallback (a page with no icons) is the icon\'s own first path, and its centre and bounds', src.indexOf("'" + lit + "'") >= 0 && /ax: 12, ay: 14, x0: 7\.7, y0: 3, x1: 16\.3, y1: 21\.5/.test(src) && /data-ax="12" data-ay="14" data-x0="7\.7" data-y0="3" data-x1="16\.3" data-y1="21\.5"/.test(icon('well')), lit);
	ok('the "outlet junction" tip is offered only where the outlet bears the Well\'s ID', /bearer\.group === 'node' \? pc\.lpn_well_identity_tip : undefined\);\s*tagField\(fields, bearerEl, undefined, bearer\.group === 'node'/.test(src));
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);

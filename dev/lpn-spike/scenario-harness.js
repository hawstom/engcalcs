// Headless check of the PROJECT / SCENARIO model -- ROADMAP Task 184.
//
//   node dev/lpn-spike/scenario-harness.js
//
// WHY THIS EXISTS. A scenario is a set of OVERRIDES, and every mistake available here is silent:
// an override that the solver never reads looks exactly like a scenario nobody has edited; a
// property editor that writes the element instead of the override edits BASE under every other
// scenario at once and still shows the right number on screen; a save that drops the scenarios
// still opens, still draws, and still solves -- as Base. None of that raises an error, and none of
// it is visible in the one view a person is looking at.
//
// So this drives the REAL page code (the lpn-dom-stub.js technique) and asks the questions a user
// would, in the order they would:
//   1. an override takes effect in the solve, and BASE DOES NOT MOVE
//   2. clearing the marker puts the value back to Base's -- and the marker is INTENT, so it exists
//      even when the value equals Base's
//   3. an override survives a save/load round trip
//   4. an inactive element is out of the solve, and drawing inside a scenario is how it gets there
//   5. deleting in Base drops every scenario's overrides on that element; deleting in a scenario
//      does not delete anything at all
//   6. the status readout, the halos, and the two guards on the pushes
//
// MUTATION-TESTED, 2026-08-14, because a harness that has never failed has never been shown to be
// able to. Eleven defects were introduced into js/looped-network.js one at a time and all eleven
// were caught: setProp() writing the element instead of the override; the marker computed by DIFFING
// instead of recorded as intent; serializeProject() dropping the scenarios; undo() forgetting
// them; assembleModel() handing inactive links to the solver; deleteLink() leaving a deleted
// element's overrides behind; the halo ignoring the Labels filter; drawing in a scenario creating
// the element everywhere; deleting in a scenario really deleting; the Base-side delete destroying
// scenario values without saying so; and a rename stranding the overrides under the old id.
//
// One mutant is deliberately NOT here because it is equivalent rather than uncaught: making
// effective() return the element's value whenever the override equals it changes no number
// anybody can read -- the two are the same number by construction. What that mistake really
// breaks is the MARKER, and the marker mutant above is the one that catches it.

const { ROOT, setUnitSet, loadLoopedNetwork, ensure } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');
function byId(id) { return ensure(id); }

// The .inp reader, for section 10. Loaded here rather than there because the page loads it BEFORE
// js/looped-network.js and onto the same EngCalcs, and the import path expects it to already exist.
require(ROOT + 'js/lpn-inp.js');
// FileReader is the browser's; importInpFromFile() is written around it, so it is stubbed exactly
// as inp-import-harness.js stubs it rather than reaching past it into docFromInp().
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};

// window.confirm/prompt are stubbed to "yes"/"X" by lpn-dom-stub.js; the destructive paths below
// need to answer both ways, so they are made settable here rather than assumed.
let confirmAnswer = true, promptAnswer = 'Fire flow', lastAlert = null, confirmText = null;
global.confirm = global.window.confirm = function (m) { confirmText = m; return confirmAnswer; };
global.prompt = global.window.prompt = function () { return promptAnswer; };
global.alert = global.window.alert = function (m) { lastAlert = m; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tsetOverride: setOverride, clearOverride: clearOverride, hasOverride: hasOverride,\n" +
	// The override map's KEY (Task 324). Exported so the assertions below read the map through the
	// same seam the page writes it with -- a harness that spelled 'n:' + id itself would be a second
	// copy of the format, free to agree with a page that had changed underneath it.
	"\t\tovKey: ovKey, ovKeyFor: ovKeyFor, migrateOverrideKeys: migrateOverrideKeys,\n" +
	"\t\timportInp: importInpFromFile, storageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\tbaseValue: baseValue, overrideCount: function () { return overrideCount(activeScenario()); },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, deleteScenario: deleteScenario,\n" +
	"\t\tactiveScenario: activeScenario, assembleModel: assembleModel, isActive: isActive,\n" +
	"\t\tdeleteElement: deleteElement, deleteNode: deleteNode,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved, migrateSaved: migrateSaved,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\trenameNode: renameNode,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tscenarioMenu: openScenarioMenu, menuRows: function () { return document.getElementById('lpn_menu_list'); },\n" +
	"\t\tbuildMenuBar: buildMenuBar, closeMenu: closeMenu, wireTabs: wireTabs,\n" +
	"\t\tmenuOpen: function () { var p = document.getElementById('lpn_menu_popup');\n" +
	"\t\t\treturn !!(p && p.style.display === 'block'); },\n" +
	"\t\twireScenarioButton: wireScenarioButton, statusText: function () { return document.getElementById('lpn_scenario_btn').textContent; },\n" +
	"\t\tstatusTip: function () { return document.getElementById('lpn_scenario_btn').title || ''; },\n" +
	"\t\tpushBaseToScenarios: pushBaseToScenarios, labelSettings: function () { return labelSettings; },\n" +
	"\t\trefreshLabelText: refreshLabelText, refreshScenarioMarks: refreshScenarioMarks,\n" +
	"\t\tnodeCircle: function (id) { return nodeEls[id].circle; },\n" +
	"\t\tlinkHalo: function (id) { return linkEls[id].halo; },\n" +
	"\t\tlinkLine: function (id) { return linkEls[id].line; },\n" +
	// init() never runs (that is the point of the injection), so the SVG layers it would have
	// built are undefined. Same one-time setup the other harnesses do.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
// The page seeds its starting values from the units strip once the strip is in the DOM (init()
// does this, and init() never runs here). Without it every new element is built with an undefined
// diameter and roughness -- a network that draws and then divides by nothing.
L.seedDefaultInputs();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
// The popup is built as real elements; read it back the way a user does rather than trusting the
// call that built it.
function fieldsText() {
	function walk(el) {
		if (!el.children || !el.children.length) { return el.textContent || ''; }
		return el.children.map(walk).join('|');
	}
	return walk(L.popupFields());
}
function checkboxes() {
	const out = [];
	(function walk(el) {
		if (el.type === 'checkbox') { out.push(el); }
		(el.children || []).forEach(walk);
	})(L.popupFields());
	return out;
}
// openMenu() builds a row as a button with an icon span and a TEXT NODE, so the row's own
// textContent is empty -- read the tree, the way a person reads the menu.
function rowText(el) {
	if (!el.children || !el.children.length) { return el.textContent || ''; }
	return (el.textContent || '') + el.children.map(rowText).join('');
}
// The menu TOGGLES on a repeated click at the same anchor (that is what the real button does), so
// a test that just calls it twice reads a closed menu's stale rows.
function openScenarioMenu() {
	const btn = byId('lpn_scenario_btn');
	L.scenarioMenu(btn);
	if (byId('lpn_menu_popup').style.display !== 'block') { L.scenarioMenu(btn); }
	return L.menuRows().children.filter(function (c) { return c.tagName === 'BUTTON'; });
}
function findRow(rows, re) { return rows.filter(function (b) { return re.test(rowText(b)); })[0]; }

// A two-junction line off a reservoir: enough to solve, small enough to read.
//   R1 --L1--> J1 --L2--> J2
const r = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 100, 0);
const j2 = L.addNode('junction', 200, 0);
r.elev = 300;
const l1 = L.addLink('pipe', r.id, j1.id);
const l2 = L.addLink('pipe', l1.to, j2.id);
L.setProp(j1, 'demand', 100);
L.setProp(j2, 'demand', 100);
const solver = require(ROOT + 'js/lpn-solver.js');
function solve() { return solver.lpnSolve(L.assembleModel()); }

// ---------------------------------------------------------------------------
// 1. An override takes effect in the solve, and Base does not move
// ---------------------------------------------------------------------------
// This is the one that cannot be checked by looking at the screen: the number in the box and the
// number the solver read are two different things, and a scenario that "works" visually while the
// solve still reads Base is the exact failure the effective() seam exists to prevent.
console.log('\n--- an override reaches the solver, and Base stays where it was ---');
{
	const baseHead = solve().heads[j2.id];
	L.createScenario('Fire flow');
	ok('the new scenario is the active one', L.activeScenario().name === 'Fire flow');
	ok('...and Base is still in the list, still flagged', L.getScenarios()[0].isBase === true);

	L.setProp(j2, 'demand', 500);
	ok('the write went to the OVERRIDE, not to the element',
		L.hasOverride(j2, 'demand') && j2._demand === 100, 'element still holds ' + j2._demand);
	ok('effective() reports the scenario value', L.effective(j2, 'demand') === 500);
	const scnHead = solve().heads[j2.id];
	ok('and the SOLVER read it -- five times the demand costs more head',
		scnHead < baseHead - 0.5, baseHead.toFixed(3) + ' m -> ' + scnHead.toFixed(3) + ' m');

	L.switchScenario('base');
	ok('back in Base the demand is untouched', L.effective(j2, 'demand') === 100);
	ok('...and Base solves to exactly what it solved to before the scenario existed',
		near(solve().heads[j2.id], baseHead, 1e-12), baseHead.toFixed(6));
	L.switchScenario(L.getScenarios()[1].id);
}

// ---------------------------------------------------------------------------
// 2. The marker is INTENT, and clearing it returns the value to Base's
// ---------------------------------------------------------------------------
// "Even when the typed value equals Base's" is the whole decision (Task 184), and it is the one a
// diff-based implementation gets wrong while passing every other test here.
console.log('\n--- the marker records intent, not a difference ---');
{
	L.setProp(j1, 'demand', 100);   // exactly Base's value
	ok('an edit that equals Base STILL records an override',
		L.hasOverride(j1, 'demand'), JSON.stringify(L.activeScenario().overrides[L.ovKey(j1)]));
	ok('...and it is counted', L.overrideCount() === 2, L.overrideCount());

	// THE CASE THAT DECIDES THE WHOLE DESIGN, and the only one that can tell a marker from a diff:
	// the scenario set 100 deliberately, then BASE MOVES to 900. A diff-based implementation sees
	// "100 differs from 900, so it is an override" only by accident -- it would have been reading
	// Base all along while the two agreed, and the user's deliberate 100 would have silently
	// become 900 the moment somebody edited Base. The marker means the scenario does not move.
	const scnId = L.activeScenario().id;
	L.switchScenario('base');
	L.setProp(j1, 'demand', 900);
	ok('Base really did move -- otherwise the next check proves nothing', j1._demand === 900);
	L.switchScenario(scnId);
	ok('a scenario that deliberately typed Base\'s own number does NOT follow Base when it moves',
		L.effective(j1, 'demand') === 100, L.effective(j1, 'demand'));
	L.switchScenario('base');
	L.setProp(j1, 'demand', 100);
	L.switchScenario(scnId);

	L.setProp(j2, 'demand', 500);
	L.clearOverride(j2, 'demand');
	ok('clearing the marker returns the value to Base', L.effective(j2, 'demand') === 100);
	ok('...and the empty map is not left behind as a phantom mark',
		L.activeScenario().overrides[L.ovKey(j2)] === undefined);
	L.setProp(j2, 'demand', 500);

	// A rename must CARRY the overrides. If it does not, the scenario's values quietly stop
	// applying -- the map falls back to Base and nothing on screen says a number went away.
	L.setProp(j2, 'demand', 500);
	const j2id = j2.id;   // j2 IS the element -- its .id changes under the rename
	L.renameNode(j2id, 'J-9');
	ok('renaming an element carries its scenario values with it',
		L.effective(L.getDoc().nodes.filter(function (n) { return n.id === 'J-9'; })[0], 'demand') === 500,
		JSON.stringify(L.activeScenario().overrides));
	L.renameNode('J-9', j2id);
	ok('...and back again, leaving nothing stranded under the old name',
		L.effective(j2, 'demand') === 500 && !L.activeScenario().overrides[L.ovKeyFor('node', 'J-9')],
		JSON.stringify(L.activeScenario().overrides));

	// A property NOT on the whitelist is Base-owned identity and must write through even inside a
	// scenario -- MEMBERSHIP is overridable, IDENTITY is not.
	L.setProp(j2, 'elev', 42);
	ok('a property outside the whitelist writes the element, not an override',
		j2._elev === 42 && L.activeScenario().overrides[L.ovKey(j2)].elev === undefined);
}

// ---------------------------------------------------------------------------
// 3. The property row: marker, Base's value beside it, and the undo
// ---------------------------------------------------------------------------
console.log('\n--- the property row shows the marker and Base\'s value ---');
{
	L.renderNodeFields(j2.id);
	const txt = fieldsText();
	ok('a scenario row offers the override marker', /Only in this scenario/.test(txt), txt);
	// Built from the LIVE lang string, never a hardcoded 'Base: '. That literal broke on 2026-08-14
	// when lpn_scenario_base_value became 'Base scenario: {value}' -- and it would have broken
	// identically in all 26 translations, which is the tell that the assertion was testing the
	// wording rather than the behaviour. What matters here is that BASE'S NUMBER is shown beside the
	// scenario's, not which words surround it.
	const baseShown = ((EngCalcs.pageConfig && EngCalcs.pageConfig.lpn_scenario_base_value) || 'Base: {value}')
		.replace('{value}', '100');
	ok('...and shows Base\'s value beside the scenario\'s', txt.indexOf(baseShown) !== -1, txt);

	const marker = checkboxes().filter(function (c) { return c.checked; })[0];
	ok('the marker is ticked for an overridden property', !!marker);
	marker.checked = false;
	marker._listeners.change[0]();
	ok('unticking it in the popup returns the value to Base', L.effective(j2, 'demand') === 100);
	L.renderNodeFields(j2.id);
	ok('...and Base\'s value is no longer shown, because nothing is diverging',
		fieldsText().indexOf(((EngCalcs.pageConfig && EngCalcs.pageConfig.lpn_scenario_base_value) || 'Base: {value}')
			.replace('{value}', '')) === -1);

	L.undo();
	ok('undo restores the override -- the scenarios ride with the document',
		L.effective(j2, 'demand') === 500, L.effective(j2, 'demand'));

	L.switchScenario('base');
	L.renderNodeFields(j2.id);
	ok('in Base there is no marker at all', !/Only in this scenario/.test(fieldsText()));
	L.switchScenario(L.getScenarios()[1].id);
}

// ---------------------------------------------------------------------------
// 4. A save/load round trip
// ---------------------------------------------------------------------------
// A document that loses its scenarios still opens, still draws and still solves -- as Base. There
// is nothing to see, which is why this has to be asserted rather than noticed.
console.log('\n--- an override survives save and load ---');
{
	const file = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the file carries the scenarios', Array.isArray(file.scenarios) && file.scenarios.length === 2,
		JSON.stringify((file.scenarios || []).map(function (s) { return s.name; })));
	ok('...and which one was open', file.project.activeScenario === L.getScenarios()[1].id);

	L.applySaved(file);
	const back = L.getScenarios()[1];
	ok('the scenario comes back with its name', back.name === 'Fire flow', back.name);
	ok('...and with its overrides', back.overrides[L.ovKey(j2)].demand === 500,
		JSON.stringify(back.overrides));
	ok('...and the document opens in the scenario it was saved in',
		L.getProject().activeScenario === back.id);
	// The elements are new objects after a load; re-find them rather than reusing the old handles.
	const j2b = L.getDoc().nodes.filter(function (n) { return n.id === j2.id; })[0];
	ok('and the reloaded document solves the SCENARIO, not Base',
		L.effective(j2b, 'demand') === 500 && j2b._demand === 100);

	// A file written before scenarios existed (v1) has to arrive with exactly one Base and nothing
	// else -- the same shape an imported .inp lands in.
	const v1 = L.migrateSaved({ v: 1, nodes: [{ id: 'J1', type: 'junction', x: 0, y: 0, demand: 5 }], links: [], labels: [] });
	ok('a pre-scenario file migrates to one Base scenario and no others',
		v1.scenarios.length === 1 && v1.scenarios[0].isBase && !Object.keys(v1.scenarios[0].overrides).length,
		JSON.stringify(v1.scenarios));
}

// Rebuild the working document -- applySaved() above replaced every element object.
function reload(scenarioIndex) {
	const d = L.getDoc();
	return {
		r: d.nodes.filter(function (n) { return n.type === 'reservoir'; })[0],
		j1: d.nodes.filter(function (n) { return n.id === j1.id; })[0],
		j2: d.nodes.filter(function (n) { return n.id === j2.id; })[0],
		l1: d.links.filter(function (l) { return l.id === l1.id; })[0],
		l2: d.links.filter(function (l) { return l.id === l2.id; })[0]
	};
}

// ---------------------------------------------------------------------------
// 5. `active`: drawing inside a scenario, and what the solver is handed
// ---------------------------------------------------------------------------
console.log('\n--- an inactive element is drawn but not solved ---');
{
	const E = reload();
	ok('the solve sees both pipes to start with', L.assembleModel().links.length === 2);

	L.setProp(E.l2, 'active', false);
	ok('switching a pipe off is an ordinary override', L.hasOverride(E.l2, 'active'));
	const m = L.assembleModel();
	ok('...and the solver is handed the network WITHOUT it',
		m.links.length === 1 && m.links[0].id === E.l1.id, JSON.stringify(m.links.map(function (l) { return l.id; })));
	ok('the element is still in the document, so the other scenarios keep it',
		L.getDoc().links.length === 2);

	L.switchScenario('base');
	ok('and it is fully present in Base', L.assembleModel().links.length === 2);
	L.switchScenario(L.getScenarios()[1].id);

	// A node switched off takes its links with it, or the solver gets the dangling reference its
	// own diagnostics exist to complain about.
	L.setProp(E.j2, 'active', false);
	const m2 = L.assembleModel();
	ok('an inactive node is out of the model', !m2.nodes.some(function (n) { return n.id === E.j2.id; }));
	ok('...and so is every link that touched it',
		!m2.links.some(function (l) { return l.from === E.j2.id || l.to === E.j2.id; }));
	L.clearOverride(E.j2, 'active'); L.clearOverride(E.l2, 'active');

	// DRAWING inside a scenario: born inactive in Base, overridden active here.
	const j3 = L.addNode('junction', 300, 0);
	const l3 = L.addLink('pipe', E.j2.id, j3.id);
	ok('a node drawn in a scenario is active HERE', L.isActive(j3) === true);
	ok('...by an override, over a Base that has it switched off',
		L.hasOverride(j3, 'active') && j3._active === false);
	ok('...and the pipe drawn with it is the same', L.isActive(l3) && l3._active === false);
	ok('the scenario solves WITH them', L.assembleModel().nodes.length === 4);
	L.switchScenario('base');
	ok('and Base does not have them at all', L.assembleModel().nodes.length === 3,
		JSON.stringify(L.assembleModel().nodes.map(function (n) { return n.id; })));
	ok('...though they are in the drawing, ready to be switched on', L.getDoc().nodes.length === 4);
	L.switchScenario(L.getScenarios()[1].id);
}

// ---------------------------------------------------------------------------
// 6. Deleting: in a scenario, and in Base
// ---------------------------------------------------------------------------
console.log('\n--- deleting in a scenario switches off; deleting in Base really deletes ---');
{
	const E = reload();
	L.setProp(E.l2, 'diameter', 4);

	L.deleteElement('link', E.l2.id);
	ok('deleting inside a scenario deletes NOTHING', L.getDoc().links.length === 3,
		L.getDoc().links.length + ' links');
	ok('...it switches the element off here', L.isActive(E.l2) === false);
	L.switchScenario('base');
	ok('...and leaves it alone everywhere else', L.isActive(E.l2) === true);

	// In Base it is a real deletion, and it asks first BECAUSE scenarios hold values for it.
	confirmAnswer = false; confirmText = null;
	L.deleteElement('link', E.l2.id);
	// TWO values, counted rather than guessed: the diameter this test set, and the `active` the
	// scenario delete above wrote. Both belong to a scenario and both are about to be destroyed.
	ok('a Base deletion of an element with scenario values asks first, and says how many',
		/\b2\b/.test(confirmText || ''), JSON.stringify(confirmText));
	ok('...and No really means no', L.getDoc().links.length === 3);

	confirmAnswer = true;
	L.deleteElement('link', E.l2.id);
	ok('Yes deletes it', L.getDoc().links.length === 2);
	ok('...and drops every scenario\'s values for it',
		L.getScenarios()[1].overrides[L.ovKey(E.l2)] === undefined,
		JSON.stringify(L.getScenarios()[1].overrides));

	L.undo();
	ok('undo brings back the element AND the values that went with it',
		L.getDoc().links.length === 3 && !!L.getScenarios()[1].overrides[L.ovKey(E.l2)],
		JSON.stringify(L.getScenarios()[1].overrides));

	// An element no scenario has touched is deleted without a question -- the confirm is about the
	// invisible work, so an action with none must not manufacture one.
	confirmText = null;
	const before = L.getDoc().nodes.length;
	L.deleteElement('node', reload().r.id);
	ok('deleting an element with no scenario values asks nothing', confirmText === null,
		JSON.stringify(confirmText));
	ok('...and still deletes it', L.getDoc().nodes.length === before - 1);
	L.undo();
	L.switchScenario(L.getScenarios()[1].id);
}

// ---------------------------------------------------------------------------
// 7. The readout, the halos, and the guards on the two pushes
// ---------------------------------------------------------------------------
console.log('\n--- the readout, the halos, and the guards ---');
{
	L.wireScenarioButton();
	const txt = L.statusText();
	ok('the status strip names the scenario', /Fire flow/.test(txt), txt);
	ok('...and counts what it holds of its own', new RegExp(': ' + L.overrideCount() + '$').test(txt), txt);
	L.switchScenario('base');
	ok('in Base it says Base, and zero', /Base/.test(L.statusText()) && /: 0$/.test(L.statusText()), L.statusText());
	L.switchScenario(L.getScenarios()[1].id);

	// HALOS, filtered by the Labels panel exactly as the pushes are.
	const E = reload();
	// L2 still carries what the delete test left on it; this section is about the halo rule, so it
	// starts from a pipe that is genuinely untouched rather than from one that only looks it.
	L.clearOverride(E.l2, 'diameter'); L.clearOverride(E.l2, 'active');
	L.setProp(E.l1, 'diameter', 4);
	L.labelSettings().link.diameter = true;
	L.refreshLabelText();
	ok('an overridden pipe carries a halo when its property is on screen',
		L.linkHalo(E.l1.id).classList.contains('lpn-override'));
	L.labelSettings().link.diameter = false;
	L.refreshLabelText();
	ok('...and loses it when that label is turned off -- same filter as everything else',
		!L.linkHalo(E.l1.id).classList.contains('lpn-override'));
	ok('a pipe with no override never has one',
		!L.linkHalo(E.l2.id).classList.contains('lpn-override'));

	// ROADMAP Task 512 -- THE RING HAS TO EXPLAIN ITSELF. Tom and Mary each read the amber ring as a
	// stuck highlight; it was working exactly as designed and said so nowhere a person would look.
	// Two answers, and both are asserted here because either alone leaves the other half silent:
	// an SVG <title> ON the ring, and a sentence on the readout that counts them.
	//
	// A <title> CHILD, not a title= attribute -- `title` is not a rendered attribute of an SVG
	// element, so the attribute form would set something no browser ever shows and this harness
	// would have passed on it. That is the mutant this assertion exists to catch.
	function ringTitle(el) {
		var i;
		for (i = 0; el && i < el.childNodes.length; i++) {
			if (el.childNodes[i].nodeName === 'title') { return el.childNodes[i].textContent; }
		}
		return null;
	}
	L.labelSettings().link.diameter = true;
	L.refreshLabelText();
	ok('the ring carries a title element saying what it is',
		!!ringTitle(L.linkHalo(E.l1.id)), JSON.stringify(ringTitle(L.linkHalo(E.l1.id))));
	ok('...which names the scenario, because that is the answer to "why is this ringed"',
		(ringTitle(L.linkHalo(E.l1.id)) || '').indexOf(L.activeScenario().name) !== -1,
		JSON.stringify(ringTitle(L.linkHalo(E.l1.id))) + ' should contain ' + L.activeScenario().name);
	ok('an unringed element carries no stale title from an earlier scenario',
		ringTitle(L.linkHalo(E.l2.id)) === null, JSON.stringify(ringTitle(L.linkHalo(E.l2.id))));
	// The title must come and go WITH the ring, or the tooltip outlives the mark that prompted it.
	L.labelSettings().link.diameter = false;
	L.refreshLabelText();
	ok('...and the title leaves with the ring when the Labels filter hides it',
		ringTitle(L.linkHalo(E.l1.id)) === null, JSON.stringify(ringTitle(L.linkHalo(E.l1.id))));
	L.labelSettings().link.diameter = true;
	L.refreshLabelText();

	// The readout half. The sentence appears only when there is something on the map to explain:
	// with no overrides there are no rings, and a standing sentence about an absent mark is noise.
	L.wireScenarioButton();
	const tipWith = L.statusTip();
	ok('the count explains itself when it is above zero',
		L.overrideCount() > 0 && /ring/i.test(tipWith), L.overrideCount() + ' | ' + JSON.stringify(tipWith));
	L.switchScenario('base');
	L.wireScenarioButton();
	ok('...and says nothing about rings in Base, where there are none',
		!/ring/i.test(L.statusTip()), JSON.stringify(L.statusTip()));
	L.switchScenario(L.getScenarios()[1].id);
	L.wireScenarioButton();
	// `status` has no Labels row, so it can only be always-on: a filter can hide only what it can name.
	L.setProp(E.l2, 'status', 'closed');
	L.refreshLabelText();
	ok('an override with no Labels row of its own is always shown',
		L.linkHalo(E.l2.id).classList.contains('lpn-override'));
	L.clearOverride(E.l2, 'status');

	// An inactive element reads as inactive on the map, not merely in the model.
	L.setProp(E.l2, 'active', false);
	L.refreshLabelText();
	ok('an element that is off is drawn greyed', L.linkLine(E.l2.id).classList.contains('lpn-inactive'));
	L.clearOverride(E.l2, 'active');

	// THE TWO PUSHES. Both are Base-level, and both must refuse rather than do something plausible.
	lastAlert = null;
	L.pushBaseToScenarios();
	ok('the scenario push does nothing at all from inside a scenario',
		L.hasOverride(E.l1, 'diameter'), 'the override is still there');

	L.switchScenario('base');
	L.labelSettings().link.diameter = true;
	confirmAnswer = true; confirmText = null;
	L.pushBaseToScenarios();
	ok('from Base it names the property and counts what it will throw away',
		/Diameter/.test(confirmText || '') && /\b1\b/.test(confirmText || ''), JSON.stringify(confirmText));
	ok('...and the scenario goes back to the Base value',
		!L.getScenarios()[1].overrides[L.ovKey(E.l1)], JSON.stringify(L.getScenarios()[1].overrides));

	lastAlert = null;
	L.pushBaseToScenarios();
	ok('a second push says there is nothing left to do', /nothing would change/.test(lastAlert || ''),
		JSON.stringify(lastAlert));
}

// ---------------------------------------------------------------------------
// 7b. The SCOPED push -- one element, not the whole drawing (Task 317)
// ---------------------------------------------------------------------------
// Tom: "each property or element -- maybe start only with the element level". The everyday case is
// "I corrected P-12 in Base and want that one correction everywhere", and the danger of getting it
// wrong is invisible: a push that takes one element too many looks exactly like one that did not,
// until somebody opens the other scenario. So the assertions are about what SURVIVES, not only
// about what went.
console.log('\n--- the push, scoped to one element ---');
{
	const E = reload();
	const scn = L.getScenarios()[1];
	L.switchScenario(scn.id);
	L.setProp(E.l1, 'diameter', 4);
	L.setProp(E.l2, 'diameter', 5);
	L.switchScenario('base');
	L.labelSettings().link.diameter = true;

	confirmAnswer = true; confirmText = null;
	L.pushBaseToScenarios(E.l1);
	ok('the confirm NAMES the element it is scoped to', new RegExp(E.l1.id).test(confirmText || ''),
		JSON.stringify(confirmText));
	ok('...and counts one value, not two', /\b1\b/.test(confirmText || '') && !/\b2\b/.test(confirmText || ''),
		JSON.stringify(confirmText));
	ok('the named element goes back to Base', !scn.overrides[L.ovKey(E.l1)],
		JSON.stringify(scn.overrides));
	ok('...AND THE OTHER ONE IS UNTOUCHED -- the whole point of the task',
		!!scn.overrides[L.ovKey(E.l2)] && scn.overrides[L.ovKey(E.l2)].diameter === 5,
		JSON.stringify(scn.overrides));

	// GROUP SCOPING: a node push considers node properties only. With a link override outstanding
	// and Diameter on screen, it must report that nothing would change -- not silently clear the
	// link's value on its way past, and not ask a question the user could confirm out of habit.
	lastAlert = null; confirmText = null;
	L.pushBaseToScenarios(E.j1);
	ok('a node push sees no link property to push', /nothing would change/.test(lastAlert || ''),
		JSON.stringify(lastAlert));
	ok('...and asked nothing, so nothing could be confirmed by habit', confirmText === null);
	ok('...and l2 STILL has its own value', !!scn.overrides[L.ovKey(E.l2)], JSON.stringify(scn.overrides));

	// ...and the node push is not merely inert: give the node its own overridden demand and the
	// same call clears that, so the assertion above is about SCOPE and not about a broken button.
	L.switchScenario(scn.id);
	L.setProp(E.j1, 'demand', 0.01);
	L.switchScenario('base');
	confirmAnswer = true; confirmText = null;
	L.pushBaseToScenarios(E.j1);
	ok('a node push DOES clear that node\'s own demand', !scn.overrides[L.ovKey(E.j1)],
		JSON.stringify(scn.overrides));
	// The confirm names the properties of THIS element's kind only. Diameter is on screen and is
	// unreachable from a node either way, so listing it would be a promise about something that
	// cannot happen -- the one part of the group filter a user actually sees.
	// "Base demand" since 2026-08-25: the push writes the STORED number, and the page now has a
	// second, resolved Demand it cannot write.
	ok('...and named Base demand without naming Diameter',
		/Base demand/.test(confirmText || '') && !/Diameter/.test(confirmText || ''), JSON.stringify(confirmText));
	ok('...and STILL left the pipe alone', !!scn.overrides[L.ovKey(E.l2)], JSON.stringify(scn.overrides));

	// Scope does not weaken the Base-only guard.
	L.switchScenario(scn.id);
	confirmText = null;
	L.pushBaseToScenarios(E.l2);
	ok('a scoped push from inside a scenario does nothing at all',
		!!scn.overrides[L.ovKey(E.l2)] && confirmText === null, JSON.stringify(scn.overrides));
	L.switchScenario('base');
}

// ---------------------------------------------------------------------------
// 8. The menu: create, rename, delete, and what Base may not do
// ---------------------------------------------------------------------------
// Base cannot be deleted or renamed away (Task 184). Disabled rather than hidden, which is this
// page's own menu convention -- a vocabulary you can see is one you can learn.
console.log('\n--- create, rename, delete, and the two things Base may not do ---');
{
	L.switchScenario('base');
	const rows = openScenarioMenu();
	ok('every scenario is listed, Base first', /Base/.test(rowText(rows[0])), rowText(rows[0]));
	ok('...with a tick on the one you are in', /✓/.test(rowText(rows[0])), rowText(rows[0]));
	ok('Base cannot be renamed', findRow(rows, /Rename/).disabled === true);
	ok('Base cannot be deleted', findRow(rows, /Delete/).disabled === true);
	ok('...and Base is the only place the push is offered', findRow(rows, /all scenarios/).disabled === false);

	L.switchScenario(L.getScenarios()[1].id);
	const rows2 = openScenarioMenu();
	ok('inside a scenario, rename and delete are live',
		findRow(rows2, /Rename/).disabled === false && findRow(rows2, /Delete/).disabled === false);
	ok('...and the push is not', findRow(rows2, /all scenarios/).disabled === true);

	// Created through the menu row, the way a user does, rather than by calling createScenario().
	promptAnswer = 'No fire';
	const before = L.getScenarios().length;
	findRow(openScenarioMenu(), /New scenario/)._listeners.click[0]({});
	ok('the menu creates a scenario', L.getScenarios().length === before + 1);
	ok('...names it what was typed', L.activeScenario().name === 'No fire', L.activeScenario().name);
	ok('...and it starts empty, inheriting everything from Base', L.overrideCount() === 0);

	promptAnswer = 'Renamed';
	findRow(openScenarioMenu(), /Rename/)._listeners.click[0]({});
	ok('the menu renames it', L.activeScenario().name === 'Renamed', L.activeScenario().name);

	confirmAnswer = true;
	findRow(openScenarioMenu(), /Delete/)._listeners.click[0]({});
	ok('the menu deletes it', L.getScenarios().length === before);
	ok('...and drops you back into Base rather than nowhere', L.activeScenario().isBase === true);
	ok('the other scenario is untouched by all of that',
		L.getScenarios()[1].name === 'Fire flow', L.getScenarios()[1].name);
}

// ---------------------------------------------------------------------------
// 9. THE SEAM, field by field -- the five defects this harness could not see
// ---------------------------------------------------------------------------
// EVERY ASSERTION ABOVE DRIVES ONE FIELD: junction demand, which happened to be the correctly
// wired one. That single-field width is why five real, user-reachable defects survived a
// 60-assertion mutation-tested harness -- a valve's setting wrote Base from inside a scenario, a
// typed length switched every scenario off Auto, a blanked override evaporated on the next save,
// the Closed checkbox drew a marker it never ticked, and the status count was wrong on the
// commonest action on the page. Breadth across FIELDS is what was missing, not depth.
console.log('\n--- the write seam, per field (the Task 184 x Task 248 collision) ---');
{
	L.switchScenario('base');
	const doc = L.getDoc();
	const valve = L.addLink('valve', doc.nodes[0].id, doc.nodes[1].id);
	valve.valveType = 'PRV';
	L.setProp(valve, 'setting', 40);
	const scn = L.createScenario('Seam');
	L.switchScenario(scn.id);

	// 1. A valve setting edited in a scenario must record an override and leave Base alone. It used
	//    to write l._setting straight through, which IS Base, under every other scenario at once.
	L.renderLinkFields(valve.id);
	const boxes = [];
	(function walk(n) { (n.children || []).forEach(function (c) {
		if (c.tagName === 'INPUT' && c.type === 'number') { boxes.push(c); } walk(c); }); })(L.popupFields());
	ok('the valve popup renders editable rows', boxes.length > 0, boxes.length + ' number inputs');
	const settingBox = boxes[0];
	settingBox.value = '75';
	(settingBox._listeners.change || []).forEach(function (fn) { fn({ target: settingBox }); });
	ok('editing a valve setting in a scenario records an OVERRIDE',
		L.hasOverride(valve, 'setting'), JSON.stringify(L.activeScenario().overrides[L.ovKey(valve)]));
	ok('...and BASE DOES NOT MOVE', L.baseValue(valve, 'setting') === 40, L.baseValue(valve, 'setting'));
	L.switchScenario('base');
	ok('...confirmed from Base itself', L.effective(valve, 'setting') === 40, L.effective(valve, 'setting'));
	L.switchScenario(scn.id);
	ok('...and the scenario sees its own value', L.effective(valve, 'setting') === 75, L.effective(valve, 'setting'));

	// 2. lenAuto is Base-owned. Typing a length inside a scenario must not switch Base off Auto.
	const pipe = doc.links.filter(function (l) { return l.type === 'pipe'; })[0];
	pipe.lenAuto = true;
	L.renderLinkFields(pipe.id);
	const lenBoxes = [];
	(function walk(n) { (n.children || []).forEach(function (c) {
		if (c.tagName === 'INPUT' && c.type === 'number') { lenBoxes.push(c); } walk(c); }); })(L.popupFields());
	const lenBox = lenBoxes[lenBoxes.length - 1];
	lenBox.value = '1234';
	(lenBox._listeners.change || []).forEach(function (fn) { fn({ target: lenBox }); });
	ok('a length typed in a scenario leaves lenAuto alone in Base', pipe.lenAuto === true, pipe.lenAuto);

	// 3. A blanked override must SURVIVE a save. Stored as undefined it was silently dropped by
	//    JSON.stringify, so the override vanished on the next save, undo or file write.
	const res = doc.nodes.filter(function (n) { return n.type === 'reservoir'; })[0];
	if (res) {
		L.setProp(res, 'head', undefined);
		ok('a blanked value still records an override', L.hasOverride(res, 'head'),
			JSON.stringify(L.activeScenario().overrides[L.ovKey(res)]));
		const round = JSON.parse(JSON.stringify(L.serializeProject()));
		const kept = round.scenarios.filter(function (x) { return x.id === scn.id; })[0];
		ok('...and SURVIVES JSON.stringify, which drops undefined',
			kept && kept.overrides[L.ovKey(res)] && 'head' in kept.overrides[L.ovKey(res)],
			JSON.stringify(kept && kept.overrides[L.ovKey(res)]));
	}

	// 4/5. The ordinary edit path must reach afterPropertyEdit(), which is what refreshes the
	//      "Custom values" count. It used to end at scheduleSolve() -- a third of the job.
	// A FRESH junction and its DEMAND box, not the first box on the popup. Elevation is row one and
	// is deliberately NOT overridable -- it is survey data, Base-owned, as pushSpecList() records --
	// so editing it correctly changes no count, and asserting on it would have tested nothing while
	// looking like it tested something. Demand is the second row.
	L.switchScenario('base');
	const fresh = L.addNode('junction', 900, 900);
	L.switchScenario(scn.id);
	const before = L.overrideCount();
	L.renderNodeFields(fresh.id);
	const nBoxes = [];
	(function walk(n) { (n.children || []).forEach(function (c) {
		if (c.tagName === 'INPUT' && c.type === 'number') { nBoxes.push(c); } walk(c); }); })(L.popupFields());
	nBoxes[1].value = '77';
	(nBoxes[1]._listeners.change || []).forEach(function (fn) { fn({ target: nBoxes[1] }); });
	ok('an ordinary edit records the override', L.overrideCount() === before + 1,
		before + ' -> ' + L.overrideCount());
	// AND THE STATUS STRIP MUST AGREE. This is the assertion that actually catches finding 5, and
	// the first version of it did not: asserting on overrideCount() reads the DATA, which setProp
	// had already written correctly, so it passed with completeEdit() deliberately broken. What was
	// wrong was the READOUT -- afterPropertyEdit() is what refreshes it, and the ordinary edit path
	// never reached it, so the strip kept showing the old count while the value beneath it changed.
	// Mutation-testing is what exposed that: a mutation the harness cannot feel means the harness is
	// watching the wrong layer.
	ok('...and the STATUS STRIP shows the new count, not the old one',
		L.statusText().indexOf(String(before + 1)) !== -1,
		JSON.stringify(L.statusText()) + ' should mention ' + (before + 1));
	L.switchScenario('base');
}

// ---------------------------------------------------------------------------
// 10. A NODE AND A LINK THAT SHARE AN ID -- ROADMAP Task 324
// ---------------------------------------------------------------------------
// EVERY FIXTURE ABOVE IS HAND-BUILT WITH UNIQUE IDS, which is why this shipped. EPANET keeps nodes
// and links in SEPARATE namespaces, so a junction 20 and a pipe 20 are both legal and both
// ordinary -- re-measured 2026-08-14 over dev/epanet-models/: Net1 7 shared ids, Net2 35, Net3 72.
// With one flat map keyed by the bare id, a demand typed on junction 20 was read back by pipe 20.
// Tom saw the halo ("a remote pipe changed to orange along with the node"); the halo is the
// harmless half, and `active` -- which exists on BOTH groups -- is the one that silently drops an
// unrelated pipe out of the SOLVE.
//
// The network is imported rather than assembled, because the editor's own rename validation
// (validateNewId -> allIds) refuses a duplicate id: an import is the only way a user reaches this,
// which is the same reason the collision was invisible to a hand-built fixture.
//
//   R1 --P1-- 10 --P2-- 20 --P3-- 30 --"20"-- 40
//                        \_______"10"________/
//
// Link "20" joins 30 and 40, and link "10" joins 20 and 40: NEITHER touches the node it shares a
// name with. That is deliberate -- switching off node 20 legitimately takes its own incident links
// with it, so a collision test on an incident link could not tell a correct cascade from the bug.
console.log('\n--- a node and a link with the SAME ID are two different elements ---');
const COLLIDE_INP = [
	'[TITLE]',
	'Node/link id collision -- ROADMAP Task 324. EPANET namespaces are separate.',
	'',
	'[JUNCTIONS]',
	';ID  Elev  Demand',
	' 10  100   50',
	' 20  95    50',
	' 30  90    50',
	' 40  85    50',
	'',
	'[RESERVOIRS]',
	';ID  Head',
	' R1  260',
	'',
	'[PIPES]',
	';ID  Node1  Node2  Length  Diam  Rough  MinorLoss  Status',
	' P1  R1     10     900     12    130    0          Open',
	' P2  10     20     800     10    130    0          Open',
	' P3  20     30     800     10    130    0          Open',
	' 20  30     40     700     8     130    0          Open',
	' 10  20     40     1500    6     130    0          Open',
	'',
	'[COORDINATES]',
	' 10  0    0',
	' 20  100  0',
	' 30  200  0',
	' 40  300  0',
	' R1  -100 0',
	'',
	'[OPTIONS]',
	' Units     GPM',
	' Headloss  H-W',
	''
].join('\n');

function nodeOf(id) { return L.getDoc().nodes.filter(function (n) { return n.id === id; })[0]; }
function linkOf(id) { return L.getDoc().links.filter(function (l) { return l.id === id; })[0]; }
function modelHas(m, group, id) {
	return (group === 'link' ? m.links : m.nodes).some(function (x) { return x.id === id; });
}
{
	L.importInp({ name: 'collide.inp', _text: COLLIDE_INP });
	ok('the imported document really does hold a node AND a link called 20',
		!!nodeOf('20') && !!linkOf('20'), JSON.stringify({ node: !!nodeOf('20'), link: !!linkOf('20') }));
	ok('...and their override keys are different strings',
		L.ovKey(nodeOf('20')) !== L.ovKey(linkOf('20')),
		L.ovKey(nodeOf('20')) + ' vs ' + L.ovKey(linkOf('20')));

	const scn = L.createScenario('Collision');
	L.switchScenario(scn.id);

	// --- an override on the NODE leaves the LINK alone: in the map, in the solve, and on screen ---
	L.setProp(nodeOf('20'), 'demand', 500);
	ok('the node carries the override', L.hasOverride(nodeOf('20'), 'demand'),
		JSON.stringify(L.activeScenario().overrides));
	ok('...and the pipe of the same name carries NOTHING',
		L.activeScenario().overrides[L.ovKey(linkOf('20'))] === undefined,
		JSON.stringify(Object.keys(L.activeScenario().overrides)));
	L.refreshLabelText();
	ok('the node is haloed', L.nodeCircle('20').classList.contains('lpn-override'));
	ok('...and the pipe is NOT -- this is the symptom Tom reported',
		!L.linkHalo('20').classList.contains('lpn-override'));

	// THE DANGEROUS HALF. `active` is on both groups, so under one flat map switching the junction
	// off took a pipe it never touched out of the solve with it.
	L.setProp(nodeOf('20'), 'active', false);
	const m = L.assembleModel();
	ok('switching the junction off removes the junction', !modelHas(m, 'node', '20'));
	ok('...and its OWN incident pipes, which is the correct cascade',
		!modelHas(m, 'link', 'P2') && !modelHas(m, 'link', 'P3') && !modelHas(m, 'link', '10'));
	ok('...but the PIPE called 20, which it never touched, is still in the solve',
		modelHas(m, 'link', '20'), JSON.stringify(m.links.map(function (l) { return l.id; })));
	L.clearOverride(nodeOf('20'), 'active');

	// --- and the same in reverse: an override on the LINK leaves the NODE alone ---
	// The node's own override is cleared first, so "the node is unhaloed" means what it says. Left
	// in place it would halo the node legitimately, and the assertion would pass either way.
	L.clearOverride(nodeOf('20'), 'demand');
	L.setProp(linkOf('20'), 'active', false);
	const m2 = L.assembleModel();
	ok('switching the pipe off removes the pipe', !modelHas(m2, 'link', '20'));
	ok('...and the junction of the same name stays in the solve', modelHas(m2, 'node', '20'));
	L.setProp(linkOf('20'), 'diameter', 4);
	L.refreshLabelText();
	ok('the pipe is haloed by its own override', L.linkHalo('20').classList.contains('lpn-override'));
	ok('...and the junction of the same name is NOT -- the reverse of Tom\'s symptom',
		!L.nodeCircle('20').classList.contains('lpn-override'),
		JSON.stringify(L.activeScenario().overrides));
	L.clearOverride(linkOf('20'), 'active');
	L.setProp(nodeOf('20'), 'demand', 500);
	ok('the two elements hold their own values side by side',
		L.effective(nodeOf('20'), 'demand') === 500 && L.effective(linkOf('20'), 'diameter') === 4,
		L.effective(nodeOf('20'), 'demand') + ' / ' + L.effective(linkOf('20'), 'diameter'));

	// --- the round trip: both keys survive save and load, still telling the two apart ---
	const file = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the file is written at the group-keyed version', file.v === L.storageVersion(), 'v' + file.v);
	L.applySaved(file);
	ok('after a reload the node still has its demand and the pipe still has its diameter',
		L.effective(nodeOf('20'), 'demand') === 500 && L.effective(linkOf('20'), 'diameter') === 4,
		JSON.stringify(L.getScenarios()[1].overrides));

	// --- deleting one of the pair leaves the other's values alone ---
	L.switchScenario('base');
	confirmAnswer = true;
	L.deleteElement('link', '20');
	ok('deleting the pipe drops the pipe\'s values', !L.getScenarios()[1].overrides['l:20'],
		JSON.stringify(L.getScenarios()[1].overrides));
	ok('...and leaves the junction\'s untouched', !!L.getScenarios()[1].overrides['n:20'],
		JSON.stringify(L.getScenarios()[1].overrides));
	L.undo();
}

// ---------------------------------------------------------------------------
// 10b. The v4 -> v5 migration, which has to GUESS and must say how
// ---------------------------------------------------------------------------
// A bare key in a stored document is ambiguous by construction -- that ambiguity IS the defect --
// so the migration resolves each key against the elements the file actually holds and prefers the
// NODE where both exist. The rule is asserted here rather than left to the comment, because a
// migration nobody tests runs exactly once per user, unobserved, on their own data.
console.log('\n--- a v4 document migrates its bare override keys ---');
{
	const v4 = {
		v: 4,
		nodes: [{ id: '20', type: 'junction', x: 0, y: 0, _demand: 1 }, { id: 'J9', type: 'junction', x: 1, y: 0 }],
		links: [{ id: '20', type: 'pipe', from: '20', to: 'J9', _diameter: 8 },
			{ id: 'P1', type: 'pipe', from: '20', to: 'J9', _diameter: 8 }],
		labels: [],
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} },
			{ id: 's1', name: 'S', overrides: { '20': { demand: 500 }, 'P1': { diameter: 4 }, 'GONE': { demand: 7 } } }]
	};
	const out = L.migrateSaved(JSON.parse(JSON.stringify(v4)));
	const ov = out.scenarios[1].overrides;
	ok('the migrated document is at the current version', out.v === L.storageVersion(), 'v' + out.v);
	ok('an ambiguous key resolves to the NODE, as the rule states', !!ov['n:20'] && ov['n:20'].demand === 500,
		JSON.stringify(ov));
	ok('...and NOT to the link, which gets nothing', ov['l:20'] === undefined, JSON.stringify(ov));
	ok('an unambiguous key keeps its own group', !!ov['l:P1'] && ov['l:P1'].diameter === 4, JSON.stringify(ov));
	ok('a key naming no element at all is dropped, not carried forward',
		ov['n:GONE'] === undefined && ov['l:GONE'] === undefined && ov['GONE'] === undefined,
		JSON.stringify(ov));
	// The report exists so the rule is auditable from outside; assert it counts what it did.
	const rep = L.migrateOverrideKeys(JSON.parse(JSON.stringify(v4)));
	ok('the migration reports what it moved, dropped and had to guess at',
		rep.moved === 2 && rep.dropped === 1 && rep.ambiguous === 1, JSON.stringify(rep));
}

// ---------------------------------------------------------------------------
// 10c. THE REAL FILE, when it is on disk
// ---------------------------------------------------------------------------
// dev/epanet-models/ is gitignored, so it is absent from a worktree and present in the main
// checkout. That is reported rather than passed over in silence -- a skipped test that says
// nothing is indistinguishable from one that passed.
{
	const NET2 = path.join(ROOT, 'dev', 'epanet-models', 'Net2.inp');
	if (!fs.existsSync(NET2)) {
		console.log('\n--- Net2.inp not present (dev/epanet-models is gitignored) -- SKIPPED ---');
	} else {
		console.log('\n--- the same, on EPANET\'s own Net2.inp ---');
		L.importInp({ name: 'Net2.inp', _text: fs.readFileSync(NET2, 'utf8') });
		const nodeIds = {}, shared = [];
		L.getDoc().nodes.forEach(function (n) { nodeIds[n.id] = true; });
		L.getDoc().links.forEach(function (l) { if (nodeIds[l.id]) { shared.push(l.id); } });
		// COUNTED HERE, never quoted from the roadmap: the number is a fact about the file, and a
		// fact restated in prose is one that can go stale without anything noticing.
		ok('Net2 really does name nodes and links alike', shared.length > 0,
			shared.length + ' shared ids, e.g. ' + shared.slice(0, 6).join(' '));
		// A shared id whose link does not touch its namesake node -- the only kind that can tell the
		// collision apart from a legitimate cascade.
		const id = shared.filter(function (x) {
			const l = linkOf(x);
			return l && l.from !== x && l.to !== x;
		})[0];
		ok('...including one where the two are nowhere near each other', !!id, id);
		if (id) {
			const scn = L.createScenario('Net2 collision');
			L.switchScenario(scn.id);
			L.setProp(nodeOf(id), 'active', false);
			ok('switching junction ' + id + ' off leaves pipe ' + id + ' in the solve',
				modelHas(L.assembleModel(), 'link', id));
			L.refreshLabelText();
			ok('...and leaves it unhaloed', !L.linkHalo(id).classList.contains('lpn-override'));
		}
	}
}

// ================================================================================================
// THE MENU-BAR DOOR TO SCENARIOS, which nothing tested and which has now broken twice
// ================================================================================================
// Tom, 2026-08-25: *"The Water.Scenarios button does nothing."* Tom again, 2026-09-02, of the same
// row: *"Water.Scenarios menu does nothing. Oops."* -- a DIFFERENT cause each time, and neither
// reachable by any test here, because every one of them opens the scenario menu through the
// status-strip button (`lpn_scenario_btn`) instead of through the Water menu.
//
// **THE SECOND CAUSE.** A row whose job is to open another menu leaves the click that ran it with
// nowhere to belong: openMenu() clears the list and rebuilds it, so by the time the click reaches
// the document dismissal the row it started on has been DETACHED, `popup.contains(from)` is false,
// and the dismissal closes the menu that row just opened. `openMenuAnchor` is the Water BUTTON,
// which does not contain a row inside the pull-down, so the `onAnchor` exemption could not save it
// either. The page now records at POINTERDOWN whether the gesture began inside the pull-down, while
// the row is still in the tree.
//
// This drives the real document listener, which needed the stub's `document.addEventListener` to
// stop being a no-op -- it had been one since the stub was written, and it is why nothing
// document-level had ever been tested here.
// A real click carries stopPropagation()/currentTarget; menu rows call both, so a bare
// `{ target }` throws rather than testing anything.
function clickEvent(el) {
	return { type: 'click', target: el, currentTarget: el,
		stopPropagation: function () {}, preventDefault: function () {} };
}
console.log('\n--- Water > Scenarios opens the list, and its own click does not close it ---');
{
	L.wireTabs();          // installs the click-away dismissal
	L.buildMenuBar();
	const bar = byId('lpn_menubar');
	const water = (bar.children || []).filter(function (b) {
		return /water/i.test(String(b.textContent || ''));
	})[0];
	ok('the Water menu button exists', !!water, water && water.textContent);
	if (water) {
		document.dispatchEvent({ type: 'pointerdown', target: water });
		(water._listeners.click || []).forEach(function (f) { f(clickEvent(water)); });
		document.dispatchEvent({ type: 'click', target: water });
		ok('pressing it opens the pull-down', L.menuOpen());

		const row = L.menuRows().children.filter(function (c) {
			return c.tagName === 'BUTTON' && /scenario/i.test(String(c.textContent || ''));
		})[0];
		ok('...which carries a Scenarios row', !!row, row && String(row.textContent));
		if (row) {
			// The gesture in the order a browser delivers it: pointerdown on the row (seen by the
			// dismissal's capture listener), the row's own click (which rebuilds the list and
			// detaches `row`), then the click reaching the document.
			document.dispatchEvent({ type: 'pointerdown', target: row });
			(row._listeners.click || []).forEach(function (f) { f(clickEvent(row)); });
			document.dispatchEvent({ type: 'click', target: row });
			ok('...and choosing it leaves the scenario list OPEN, not closed by its own click',
				L.menuOpen());
			const names = L.menuRows().children
				.filter(function (c) { return c.tagName === 'BUTTON'; })
				.map(function (c) { return String(c.textContent || ''); });
			ok('...showing the scenarios themselves',
				names.some(function (t) { return /Base/i.test(t); }),
				JSON.stringify(names.slice(0, 3)));
		}
	}
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

// A UNIT SELECT COSTS ONLY WHAT REINTERPRETING A NUMBER COSTS (ROADMAP Task 653, the LEFT half).
// Run with:
//   node dev/lpn-spike/unit-select-lag-harness.js
//
// The first half of 653 (fix/settings-select-lag) fixed every OTHER Settings control: no select is
// rebuilt under the hand, and label refreshes coalesce into one pass per frame. LEFT was a UNIT
// select, because afterUnitChange() went through refreshAllFromDocument() -- the PROJECT-ARRIVAL
// path -- which calls buildDom() (throws away and rebuilds every SVG element), rebuildSettingsBox(),
// rebuildLibraryBox(), renderTabs(), restoreViewOrFit() and scheduleArrivalSolve(), unconditionally
// and SYNCHRONOUSLY inside the change handler. Measured in a real Chrome
// (browser-settings-select-probe.js) at 0.4-0.8 s.
//
// **NOTHING A UNIT DECIDES IS EVER A COORDINATE** (see unitServes()/LPN_UNIT_SELECTS in
// looped-network.js): length, diameter, roughness, elevation/head, pressure, flow, velocity,
// gradient and age are all VALUES an element carries, never an x/y or a lon/lat. So nothing on the
// map moves when a unit changes, and buildDom() -- which exists to give newly-shaped or newly-placed
// elements their SVG -- has nothing to do. What must still happen: the solve (if Recalculate is
// on), and everything that reads the document's numbers through the unit strip at render time --
// labels, an open Properties popup, the Tables pane, the legend, the map-status readout, and any
// colour break defined in this quantity.
//
// **WHY COUNTING, NOT THE CLOCK.** dev/session-handoff.md: the lag harness has failed once already
// under a full check_all.sh's load. A call count is exact under any machine load; a millisecond
// budget is not. So the budget here is "how many times is buildDom/refreshAllFromDocument/a
// SYNCHRONOUS label pass called", never a duration.
//
// **MUTATION-TESTED.** Reverting afterUnitChange() to call refreshAllFromDocument() (`git show
// <pre-fix SHA>:js/looped-network.js` for the old body) makes section 1's buildDom/
// refreshAllFromDocument counts fail, and section 2's "no synchronous label pass" assertion fail --
// confirmed by hand against the pre-fix code before this file was finished.

'use strict';

const { byId, setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

// **THREE COUNTERS, EACH A ONE-LINE INSERT AT A UNIQUE, UNCHANGED CALL SITE** -- the same technique
// settings-select-lag-harness.js uses for label passes, so a pass this file counts is a pass the
// page's own ?debug=perf instrument would also see.
global.__buildDomCalls = 0;
global.__arrivalCalls = 0;
global.__labelPassesSync = 0;
function mutate(src) {
	const markers = [
		["\tfunction buildDom() {\n\t\tvar i;", "\tfunction buildDom() {\n\t\tglobal.__buildDomCalls++;\n\t\tvar i;"],
		["\tfunction refreshAllFromDocument() {\n", "\tfunction refreshAllFromDocument() {\n\t\tglobal.__arrivalCalls++;\n"],
		["perfDebugCount('labelPasses');", "perfDebugCount('labelPasses'); global.__labelPassesSync++;"]
	];
	markers.forEach(function ([from, to]) {
		const n = src.split(from).length - 1;
		if (n !== 1) { throw new Error('marker not unique (' + n + '): ' + JSON.stringify(from)); }
		src = src.split(from).join(to);
	});
	return src;
}

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tonUnitChange: onUnitChange, remember: rememberUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tunitKey: unitKey, undo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\trequestLabelRefresh: requestLabelRefresh, flushLabelRefresh: flushLabelRefresh,\n" +
	"\t\trefreshLabelText: refreshLabelText,\n" +
	"\t\tINPUTS: LPN_UNIT_SELECTS,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs(); undoStack.length = 0;\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } ",
	null,
	mutate
);

byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

function pickUnit(name, key) {
	const sel = unitSelects[name];
	const i = sel.options.findIndex(o => o.value === key);
	if (i < 0) { throw new Error('no option ' + key + ' on ' + name); }
	byId.lpn_dialog_body.children.length = 0;
	byId.lpn_dialog_buttons.children.length = 0;
	sel.selectedIndex = i;
	L.onUnitChange(sel, name);
}
function dialogOpen() { return byId.lpn_dialog_body.children.length > 0; }
function press(label) {
	const b = byId.lpn_dialog_buttons.children.find(x => x.textContent === label);
	if (!b) { throw new Error('no button "' + label + '" (dialog open: ' + dialogOpen() + ')'); }
	(b._listeners.click || []).forEach(f => f());
}
function buildNetwork() {
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o',
		lpn_u_pressure: 'psi', lpn_u_flow: 'gpm' });
	L.remember();
	const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	L.setProp(j, 'demand', 150);
	L.setProp(pipe, 'length', 710);
	L.setProp(pipe, 'diameter', 8);
	j.elev = 40;
	L.buildDom();
	return { r: r, j: j, pipe: pipe };
}
function resetCounters() { global.__buildDomCalls = 0; global.__arrivalCalls = 0; global.__labelPassesSync = 0; }
function sleep(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

async function main() {

// ---- 1. NO PROJECT-ARRIVAL WORK ----------------------------------------------------------------
console.log('--- a unit change never touches the project-arrival path ---');
buildNetwork();
resetCounters();
pickUnit('lpn_u_length', 'm');
press('Non-destructive');
ok(global.__buildDomCalls === 0,
	'Non-destructive: buildDom() is not called -- nothing drawn changed shape',
	String(global.__buildDomCalls));
ok(global.__arrivalCalls === 0,
	'...and refreshAllFromDocument() (the project-SWITCH path) is not called either',
	String(global.__arrivalCalls));

buildNetwork();
resetCounters();
pickUnit('lpn_u_flow', 'ft3ps');
press('Destructive');
ok(global.__buildDomCalls === 0, 'Destructive: buildDom() is not called', String(global.__buildDomCalls));
ok(global.__arrivalCalls === 0, '...nor refreshAllFromDocument()', String(global.__arrivalCalls));

// A unit that needs no dialog (nothing typed in it) is the commonest case of all -- an early US/SI
// pick on a fresh project -- and goes through the same door.
{
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' });
	L.remember();
	L.buildDom();
	resetCounters();
	pickUnit('lpn_u_length', 'm');
	ok(!dialogOpen(), 'an empty project is asked nothing, as unit-change-harness.js already proves');
	ok(global.__buildDomCalls === 0, 'and still no buildDom()', String(global.__buildDomCalls));
	ok(global.__arrivalCalls === 0, 'and still no refreshAllFromDocument()', String(global.__arrivalCalls));
}

// ---- 2. THE LABEL PASS IS DEFERRED AND COALESCED, LIKE EVERY OTHER SETTINGS CONTROL -------------
console.log('--- the label pass this change owes is deferred, not paid inline ---');
buildNetwork();
resetCounters();
pickUnit('lpn_u_diameter', 'mm');
press('Non-destructive');
ok(global.__labelPassesSync === 0,
	'no SYNCHRONOUS label pass runs inside the change handler (requestLabelRefresh() only marks it owed)',
	String(global.__labelPassesSync));
L.flushLabelRefresh();
ok(global.__labelPassesSync === 1, 'and exactly one pass once it is flushed', String(global.__labelPassesSync));

// ---- 3. RECALCULATE OFF: THE DISPLAY STILL CATCHES UP, AND NOTHING SOLVES -----------------------
console.log('--- Recalculate off: no solve, but the owed relabel still exists ---');
buildNetwork();
L.settings().autoRun = false;
resetCounters();
pickUnit('lpn_u_pressure', 'kpa');
if (dialogOpen()) { press('Non-destructive'); }
// The unit changed and a relabel is owed even with Recalculate off -- this is not an ordinary
// element edit (which the stale-snapshot ruling keeps to just its own label): every element's
// DISPLAYED number depends on the unit strip, so the whole map is owed one pass, exactly like a
// Quality or Colour-by change.
ok(global.__labelPassesSync === 0, 'still deferred, not synchronous', String(global.__labelPassesSync));
L.flushLabelRefresh();
ok(global.__labelPassesSync === 1, 'and the owed pass still happens with Recalculate off', String(global.__labelPassesSync));
await sleep(400);   // longer than the 300 ms solve debounce
ok(global.__buildDomCalls === 0 && global.__arrivalCalls === 0,
	'and nothing under Recalculate off ever reached buildDom() or refreshAllFromDocument()');

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures) { process.exit(1); }
}
main().catch(function (e) { console.error(e); process.exit(1); });

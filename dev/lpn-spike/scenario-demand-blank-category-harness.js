// Tom, 2026-09-30: *"If a Junction has no demand category descriptions and I put a Category
// description for the first category in a Scenario, that Description wrongly goes to Base and
// thence inherits to all. Empty/blank description in Base needs to hold just like 0 flow."*
//
// **FINDING: already fixed.** R-369 (4df591f8, 2026-09-28 07:38) rewrote the demand breakdown as
// one overridable property, `demands` (see dev/scenario-seam-repair.md, "The fourth seam"). This
// exact recipe -- a junction with ONE demand row and NO description, edited in a non-Base scenario
// -- already isolates correctly under that fix. What was missing is a harness that STARTS from a
// blank/undefined description rather than one already carrying words (every fixture in
// scenario-demand-category-harness.js edits a category that already has text in it), which is
// this file.
//
// **Why production still shows the bug.** Tom pulled production at 9c71d54f, 2026-09-28 02:35 --
// five hours before the fix commit. `git merge-base --is-ancestor 4df591f8 9c71d54f` says NOT an
// ancestor: the fix is on master and on this branch, not yet on his server. This is the stale-
// production trap (dev/session-handoff.md), not a live defect in the checked-out code.
//
// Run with: node dev/lpn-spike/scenario-demand-blank-category-harness.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\teffective: effective, setProp: setProp, hasOverride: hasOverride, ovKey: ovKey,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tgetScenarios: function () { return scenarios; }, activeScenario: activeScenario,\n" +
	"\t\tresolvedDemand: resolvedDemand,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
L.importInp({ name: 'multi-category.inp',
	_text: fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/multi-category.inp'), 'utf8') });
const J = (id) => L.getDoc().nodes.find(n => n.id === id);
const baseNodes = () => JSON.stringify(L.getDoc().nodes);
const BASE0 = baseNodes();

function popupFor(id) {
	byId.lpn_popup_fields.children.length = 0;
	L.renderNodeFields(id);
	return byId.lpn_popup_fields.children;
}
function findAll(kids, tag) {
	const out = [];
	(function walk(list) {
		list.forEach((c) => {
			if (c.tagName === tag) { out.push(c); }
			if (c.children && c.children.length) { walk(c.children); }
		});
	})(kids);
	return out;
}
function table(id) {
	const kids = popupFor(id);
	const t = kids.filter(c => c.tagName === 'TABLE')[0];
	return {
		nums: findAll([t], 'INPUT').filter(i => i.type === 'number'),
		texts: findAll([t], 'INPUT').filter(i => i.type === 'text'),
		add: findAll(kids, 'BUTTON').filter(b => b.textContent.indexOf(PC.lpn_demand_add) >= 0)[0]
	};
}
function type(input, v) { input.value = v; input._listeners.change[0](); }
function ovOf(id) { return L.activeScenario().overrides[L.ovKey(J(id))] || {}; }

// J4 comes from multi-category.inp's [JUNCTIONS] row alone -- no [DEMANDS] entry at all, so it is
// exactly Tom's precondition: one demand row, `demandCategory` never set (undefined, not even '').
console.log('\n--- Tom\'s exact recipe: one row, no description, edit it in a scenario ---');
{
	ok('J4 starts with no category at all', J('J4').demandCategory === undefined,
		JSON.stringify(J('J4')));
	L.createScenario('Growth');
	const SCN = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(SCN.id);

	let t = table('J4');
	ok('the popup shows one row, its description box blank', t.texts.length === 1 && t.texts[0].value === '');
	type(t.texts[0], 'Sunset Meadows');

	ok('BASE IS UNCHANGED', baseNodes() === BASE0);
	ok('...J4\'s own demandCategory is still undefined', J('J4').demandCategory === undefined,
		JSON.stringify(J('J4')));
	ok('the scenario holds it as its own `demands` override, not `demand`',
		Array.isArray(ovOf('J4').demands) && ovOf('J4').demands[0].category === 'Sunset Meadows' &&
		!Object.prototype.hasOwnProperty.call(ovOf('J4'), 'demand'), JSON.stringify(ovOf('J4')));

	// A second, sibling scenario must not inherit it -- "thence inherits to all" is the second half
	// of the report, and it is a claim about EVERY scenario that never touched J4, not just Base.
	L.switchScenario('base');
	L.createScenario('Drought');
	const SCN2 = L.getScenarios()[L.getScenarios().length - 1];
	L.switchScenario(SCN2.id);
	ok('a sibling scenario reads Base\'s own row: no category, unchanged',
		L.effective(J('J4'), 'demands')[0].category === undefined,
		JSON.stringify(L.effective(J('J4'), 'demands')));
	ok('...and it has recorded no override of its own', !ovOf('J4').demands && !ovOf('J4').demand);

	// Base itself, read directly, never saw the word.
	L.switchScenario('base');
	ok('Base\'s own popup still shows the blank box', table('J4').texts[0].value === '');
	ok('...and resolvedDemand is unaffected (a description changes no number)',
		Math.abs(L.resolvedDemand(J('J4')) - 33 * 0.2) < 1e-9);

	L.switchScenario(SCN.id);
}

// The flow-only edit Tom names as the control case -- "0 flow... needs to hold" -- already worked
// before this defect; asserted here so a future change cannot fix the description and break the
// number it stands next to.
console.log('\n--- the flow edit beside it still isolates, as today ---');
{
	L.switchScenario('base');
	const before = baseNodes();
	L.switchScenario(L.getScenarios().filter(s => s.name === 'Growth')[0].id);
	const t = table('J2');
	type(t.nums[0], '0');
	ok('setting a category\'s flow to 0 in a scenario leaves Base alone', baseNodes() === before);
	ok('...and the scenario records the 0, not nothing',
		ovOf('J2').demand === 0, JSON.stringify(ovOf('J2')));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

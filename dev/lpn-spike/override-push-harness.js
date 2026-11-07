// PUSH OVERRIDE UPWARD (Task 855, Tom 2026-11-06: "an orange upward arrow/triangle above the override
// clearing circle ... 'Push override upward', meaning that the override is cleared in the current
// alternative and entered in its parent."). Run:
//   node dev/lpn-spike/override-push-harness.js
//
// Asserted: 1. child -> Base: cleared in the child, written to Base's element. 2. grandchild -> its
// parent scenario: cleared below, held by the parent, Base untouched. 3. a parent that names a stored
// alternative gets the write in that alternative, and a scenario sharing it changes. 4. the count of
// OTHER scenarios that change (the parent, the open scenario and what lies below it are not counted;
// a scenario that overrides it itself is not). 5. one undo restores both sides. 6. the arrow is drawn
// only where it can act (not in Base, not on an inherited value) and carries the tip; clicking it
// asks the count question only when other scenarios change, and cancel changes nothing. 7. Recalculate off: the stale snapshot rule
// is untouched (the push writes through setProp and clears through clearOverride, as an edit does).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tnodeById: nodeById, deleteScenario: deleteScenario, addNode: addNode, setProp: setProp, baseValue: baseValue, effective: effective, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, undo: undo, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tbaseId: function () { return baseScenario().id; }, scn: scenarioById, activeScenario: activeScenario,\n" +
	"\t\tpushOverrideUp: pushOverrideUp, pushOtherScenarios: pushOtherScenarios, pushValuesOf: pushValuesOf,\n" +
	"\t\tpushableProps: pushableProps, pushTarget: pushTarget,\n" +
	"\t\taskPushOverride: askPushOverride, altOf: function (id) { return altById(id); },\n" +
	"\t\tmarker: function (fields, e, p) { overrideMarker(fields, e, p); },\n" +
	"\t\tinScn: function (id, f) { var was = project.activeScenario; project.activeScenario = id; try { return f(); } finally { project.activeScenario = was; } },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const n0 = L.addNode('junction', 0, 0), m0 = L.addNode('junction', 10, 0);
L.setProp(n0, 'elev', 100); L.setProp(m0, 'elev', 100);
// An undo replaces the document's objects, so each use looks the element up afresh.
const nid = n0.id, mid = m0.id;
let n = n0, m = m0;
const fresh = () => { n = L.nodeById(nid); m = L.nodeById(mid); };
const val = (id, e, p) => L.inScn(id, () => L.effective(e, p));
const has = (id, e, p) => L.inScn(id, () => L.hasOverride(e, p));
const ids = (list) => list.map((s) => s.id).sort();

// Tree: Base -> A (holds m = 200, so it names a stored alternative) -> A1 (holds m = 333), A2 (inherits A);  Base -> B.
const A = L.createScenario('A', L.baseId());
L.setProp(m, 'elev', 200);
const A1 = L.createScenario('A1', A.id);
L.setProp(m, 'elev', 333);
const A2 = L.createScenario('A2', A.id);
const B = L.createScenario('B', L.baseId());
const altA = L.scn(A.id).alternatives.physical;
report(!!altA && L.scn(A1.id).alternatives.physical !== altA, 'A and A1 each name a stored alternative; A1 inherits through A\'s');
report(val(A2.id, m, 'elev') === 200 && val(A1.id, m, 'elev') === 333, 'A2 reads 200 through A; A1 reads its own 333');

// 1. child -> Base. B holds n = 250; the others inherit Base.
L.switchScenario(B.id);
L.setProp(n, 'elev', 250);
report(has(B.id, n, 'elev') && val(B.id, n, 'elev') === 250, 'B holds its own elevation');
report(JSON.stringify(ids(L.pushOtherScenarios(n, ['elev']))) === JSON.stringify([A.id, A1.id, A2.id].sort()),
	'pushing to Base counts every other scenario that inherits Base', ids(L.pushOtherScenarios(n, ['elev'])).join(','));
L.saveUndoSnapshot();
L.pushOverrideUp(n, ['elev'], L.pushValuesOf(n, ['elev']));
report(!has(B.id, n, 'elev'), 'cleared in B');
report(L.baseValue(n, 'elev') === 250, 'written to Base', String(L.baseValue(n, 'elev')));
report(val(A1.id, n, 'elev') === 250 && val(B.id, n, 'elev') === 250, 'scenarios that inherit Base now read it, B included');
L.undo(); fresh();
report(L.baseValue(n, 'elev') === 100 && has(B.id, n, 'elev') && val(B.id, n, 'elev') === 250, 'one undo restores Base and B together',
	'base ' + L.baseValue(n, 'elev') + ', B ' + val(B.id, n, 'elev'));

// 2. grandchild -> the alternative its parent scenario names.
L.switchScenario(A1.id);
report(JSON.stringify(ids(L.pushOtherScenarios(m, ['elev']))) === JSON.stringify([A2.id]),
	'pushing A1 into A\'s alternative counts A2 only (A is the parent; B does not use it)', ids(L.pushOtherScenarios(m, ['elev'])).join(','));
L.saveUndoSnapshot();
L.pushOverrideUp(m, ['elev'], L.pushValuesOf(m, ['elev']));
report(!has(A1.id, m, 'elev'), 'cleared in A1');
report(has(A.id, m, 'elev') && val(A.id, m, 'elev') === 333, 'A\'s stored alternative now holds 333');
report(val(A1.id, m, 'elev') === 333 && val(A2.id, m, 'elev') === 333, 'A1 and A2 read 333 through it');
report(L.baseValue(m, 'elev') === 100 && val(B.id, m, 'elev') === 100, 'Base and B (not under A) are unchanged');
L.undo(); fresh();
report(val(A.id, m, 'elev') === 200 && has(A1.id, m, 'elev') && val(A1.id, m, 'elev') === 333, 'one undo restores A and A1 together');

// 3. a scenario that shares the stored alternative is counted.
L.scn(B.id).alternatives = Object.assign({}, L.scn(B.id).alternatives || {}, { physical: altA });
L.switchScenario(A1.id);
report(JSON.stringify(ids(L.pushOtherScenarios(m, ['elev']))) === JSON.stringify([A2.id, B.id].sort()),
	'a scenario that shares A\'s alternative is counted too', ids(L.pushOtherScenarios(m, ['elev'])).join(','));
delete L.scn(B.id).alternatives.physical;

// 4. the arrow: drawn only where it can act.
function arrowIn(id, e, p) {
	return L.inScn(id, () => {
		const f = global.document.createElement('div');
		f.appendChild(global.document.createElement('label'));
		L.marker(f, e, p);
		const g = f.children.filter((c) => String(c.className).indexOf('lpn-ovm') === 0)[0];
		return g ? (g.children.filter((c) => String(c.className).indexOf('lpn-ovm-up') >= 0)[0] || null) : null;
	});
}
L.switchScenario(A1.id);
const up = arrowIn(A1.id, m, 'elev');
report(!!up, 'the arrow is drawn on an overridden value in a scenario with a parent');
report(up && up.title === 'Push override upward', 'its tip is "Push override upward"', up && up.title);
report(up && up.getAttribute('role') === 'button', 'it is a button (click and tap)');
report(!arrowIn(A2.id, m, 'elev'), 'no arrow on an inherited value');
report(!arrowIn(L.baseId(), m, 'elev'), 'no arrow in Base');

// 5. clicking it. Cancelled: nothing changes. Confirmed: the question carries the count, one undo step.
function click(c) { ((c._listeners && c._listeners.click) || []).slice().forEach((f) => f({ preventDefault() {}, stopPropagation() {} })); }
let asked = null, answer = false;
global.window = global.window || {};
global.window.lpnDialogAnswerer = (req) => { asked = req; return answer; };
L.switchScenario(A1.id);
click(arrowIn(A1.id, m, 'elev'));
report(asked && asked.kind === 'confirm' && /\(1 total\)/.test(asked.text) && /^Push override upward\?/.test(asked.text), 'siblings inherit it: the question is asked with the count', asked && asked.text);
fresh();
report(has(A1.id, m, 'elev') && val(A.id, m, 'elev') === 200, 'No: nothing changes');
answer = true; asked = null;
click(arrowIn(A1.id, m, 'elev'));
fresh();
report(!has(A1.id, m, 'elev') && val(A.id, m, 'elev') === 333, 'Yes: pushed', 'A ' + val(A.id, m, 'elev'));
L.undo(); fresh();
report(has(A1.id, m, 'elev') && val(A.id, m, 'elev') === 200, 'one undo after the click restores both');
// No other scenario changes: no question. Remove A2 (the only other scenario reading A's alternative).
L.switchScenario(L.baseId());
L.deleteScenario(A2.id);
L.switchScenario(A1.id);
asked = null; answer = true;
click(arrowIn(A1.id, m, 'elev'));
fresh();
report(asked === null && !has(A1.id, m, 'elev') && val(A.id, m, 'elev') === 333, 'when no other scenario changes there is no question, and it goes', asked ? 'asked ' + asked.text : 'not asked');
L.undo(); fresh();
report(has(A1.id, m, 'elev') && val(A.id, m, 'elev') === 200, 'and that is one undo step too');

// 6. Recalculate off. The click ends in afterPropertyEdit(), as the dot's Clear does, so a push
// refreshes the one element and its labels and leaves the stale results alone
// (stale-snapshot-harness.js holds that rule for afterPropertyEdit()).

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

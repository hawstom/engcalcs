// WITH RECALCULATE OFF, THE TABLE ON SHOW STILL FOLLOWS THE DOCUMENT. Run with:
//   node dev/lpn-spike/pane-follows-doc-harness.js
//
// Perry's pre-review of Tom's fifth pass (2026-09-22) found the defect this holds: Net3, Recalculate
// off, a scenario with one junction's demand overridden to 999999, then back to Base from the menu --
// and the Junctions table went on saying 999999 over a Base value of 0. The pane was refreshed when
// a solve landed, and with the switch off nothing lands; scheduleSolve()'s Recalculate-off door,
// afterManualEdit(), refreshed everything it owed except the table.
//
// **THE RULE UNDER TEST: anything that changes WHICH DATA the table shows refreshes the table on
// show at once, solve or no solve** -- a scenario switch, an undo, an edit, a unit switch, and a
// step of the transport. And the other half, CLAUDE.md's "Off means Snapshot": the RESULT columns
// keep what the last solve said; an edit never blanks them.
//
// Every assertion is the same comparison: each cell on screen against paneCellText(), the ONE
// function that decides what a cell says (the printed sheet reads it too). A cell that disagrees is
// stale, whichever door failed to refresh it.

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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, setProp: setProp,\n" +
	"\t\topenPane: openPane, setPaneTab: setPaneTab, settings: function () { return settings; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tbaseId: function () { return baseScenario().id; }, effective: effective,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo, completeEdit: completeEdit,\n" +
	"\t\tapply: applySolveResult, lastResult: function () { return lastSolveResult; },\n" +
	"\t\tsolveNow: function () { applySolveResult(EngCalcs.lpnSolve(assembleModel(), { tol: solveAccuracy() })); },\n" +
	"\t\tstale: function (id) { var spec = paneTableById(id), bad = [];\n" +
	"\t\t\tpaneTableRowsInOrder(spec).forEach(function (el) { var cells = spec.cells[el.id] || {};\n" +
	"\t\t\t\tpaneCols(spec).forEach(function (c) { var t = cells[c.key], want, got;\n" +
	"\t\t\t\t\tif (!t) { return; } want = paneCellText(c, el);\n" +
	"\t\t\t\t\tgot = paneCellIsPlain(c, el) ? t.textContent : (c.bool && t.type === 'checkbox' ? (t.checked ? paneCellText(c, el) : '') : t.value);\n" +
	"\t\t\t\t\tif (c.bool) { return; }\n" +
	"\t\t\t\t\tif (String(got) !== String(want)) { bad.push(el.id + '.' + c.key + ': ' + got + ' != ' + want); } }); });\n" +
	"\t\t\treturn bad; },\n" +
	"\t\tctl: function (id, elId, key) { return paneTableById(id).cells[elId][key]; },\n" +
	"\t\tcell: function (id, elId, key) { var t = paneTableById(id).cells[elId][key]; return t.value !== undefined && t.tagName !== 'TD' ? t.value : t.textContent; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

// A network the native solver can answer: a reservoir feeding two junctions.
const r = L.addNode('reservoir', 0, 0), j1 = L.addNode('junction', 100, 0), j2 = L.addNode('junction', 200, 0);
r.head = 100; j1.elev = 10; j2.elev = 20;
L.setProp(j1, 'demand', 5); L.setProp(j2, 'demand', 7);
L.addLink('pipe', r.id, j1.id); L.addLink('pipe', j1.id, j2.id);
L.settings().autoRun = false;
L.solveNow();
report(!!L.lastResult() && L.lastResult().ok, 'the network solves, so there are results to keep', L.lastResult() && L.lastResult().ok);
L.openPane('junctions');
L.setPaneTab('junctions');
report(L.stale('junctions').length === 0, 'the Junctions table starts in agreement with the document', L.stale('junctions').join('; '));
const pressureBefore = L.cell('junctions', j1.id, 'pressure');

// ---- a scenario switch: Perry's own repro -------------------------------------------------------
console.log('\n--- a scenario switch, with Recalculate off ---');
{
	const s = L.createScenario('S1');
	// Typed into the table's own cell, as Perry did: the cell then HOLDS 999999, so only a refresh
	// can make it say anything else after the switch back.
	const box = L.ctl('junctions', j1.id, 'demand');
	box.value = '999999';
	(box._listeners.change || []).forEach((f) => f({ target: box }));
	report(L.effective(j1, 'demand') === 999999 || String(L.effective(j1, 'demand')) === '999999',
		'the typed value is the scenario’s override', L.effective(j1, 'demand'));
	report(L.cell('junctions', j1.id, 'demand') === '999999', 'in the scenario the table shows the override', L.cell('junctions', j1.id, 'demand'));
	L.switchScenario(L.baseId());
	report(L.cell('junctions', j1.id, 'demand') === '5', 'back in Base the table shows Base’s 5, not the scenario’s 999999',
		L.cell('junctions', j1.id, 'demand'));
	report(L.stale('junctions').length === 0, '...and every cell agrees with the document', L.stale('junctions').join('; '));
	L.switchScenario(s.id);
	report(L.cell('junctions', j1.id, 'demand') === '999999', 'and switching back into the scenario shows the override again',
		L.cell('junctions', j1.id, 'demand'));
	L.switchScenario(L.baseId());
}

// ---- an edit and its undo ---------------------------------------------------------------------
console.log('\n--- an edit, then undo, with Recalculate off ---');
{
	L.saveUndoSnapshot();
	j2.elev = 55;
	L.completeEdit(null);
	report(L.cell('junctions', j2.id, 'elev') === '55', 'an edit made outside the table reaches it at once', L.cell('junctions', j2.id, 'elev'));
	L.undo();
	report(L.cell('junctions', j2.id, 'elev') === '20', 'undo puts the table back to 20', L.cell('junctions', j2.id, 'elev'));
	report(L.stale('junctions').length === 0, '...and every cell agrees with the restored document', L.stale('junctions').join('; '));
	// (There is no redo on this page to drive: undo() is the whole of the history.)
}

// ---- Off means Snapshot: the results stay -------------------------------------------------------
console.log('\n--- the result columns keep the last answer ---');
{
	report(pressureBefore !== '' && L.cell('junctions', j1.id, 'pressure') === pressureBefore,
		'after all of that, with nothing solved, the pressure still shows the last solve’s answer', pressureBefore + ' -> ' + L.cell('junctions', j1.id, 'pressure'));
}

// ---- a step of the transport ----------------------------------------------------------------------
// js/lpn-time.js's showFrame() hands a stored frame to host.apply, which is applySolveResult(); no
// solve runs. A frame is modelled as the kept result with every pressure moved, which is what a
// different time step is to the table.
console.log('\n--- a step of the transport ---');
{
	const frame = JSON.parse(JSON.stringify(L.lastResult()));
	let moved = 0;
	Object.keys(frame).forEach((k) => {
		const v = frame[k];
		if (v && typeof v === 'object' && !Array.isArray(v) && typeof v[j1.id] === 'number' && /press/i.test(k)) {
			Object.keys(v).forEach((id) => { v[id] += 12.5; moved++; });
		}
	});
	report(moved > 0, 'the frame carries different pressures', moved + ' moved');
	L.apply(frame);
	report(L.cell('junctions', j1.id, 'pressure') !== pressureBefore, 'the pressure column shows the new time step', pressureBefore + ' -> ' + L.cell('junctions', j1.id, 'pressure'));
	report(L.stale('junctions').length === 0, '...and every cell agrees with it', L.stale('junctions').join('; '));
}

// ---- a unit switch ---------------------------------------------------------------------------------
console.log('\n--- a unit switch ---');
{
	setUnitSet('si');
	EngCalcs.pageCalculator(null);
	report(L.stale('junctions').length === 0, 'after switching to SI every cell agrees with the document', L.stale('junctions').join('; '));
	setUnitSet('us');
	EngCalcs.pageCalculator(null);
}

console.log(failures ? `\nFAILURES: ${failures}/${checks}` : `\nall pass: ${checks}/${checks}`);
process.exit(failures ? 1 : 0);

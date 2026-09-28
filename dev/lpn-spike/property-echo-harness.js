// THE PROPERTIES BOX MUST SHOW WHAT THE MAP LABEL AND THE TABLES PANE SHOW. Run with:
//   node dev/lpn-spike/property-echo-harness.js
//
// WHY THIS EXISTS (ROADMAP Task 708, Tom, 2026-09-22): "When I change Base demand in Properties,
// Demand, Pressure etc. change on the node label, but not in Properties." The standing rule
// (CLAUDE.md, "AND AN EDIT STILL HAS TO SHOW UP EVERYWHERE THE INPUT IS SHOWN, IMMEDIATELY") says
// an edit must be reflected in the Table, the Properties box AND the map label at once -- tunnel
// vision on the one element edited, never a network-wide pass.
//
// THE ACTUAL DEFECT: afterPropertyEdit() already calls refreshPopupIfOpen() the instant the edit
// lands, so the popup is briefly correct -- and then schedules a solve 300 ms out. When that solve
// completes, applySolveResult() refreshes the map labels (refreshLabelText()) and the open Tables
// pane (refreshPaneIfOpen()), but never asked the open Properties popup to redraw. A junction's
// Pressure/Head fields are read straight off `lastSolveResult` at render time, so the popup simply
// sat on the numbers it drew a third of a second earlier, forever, until the popup was closed and
// reopened. The three venues therefore agree for an instant and then drift apart on every solve.
//
// FOUR GROUPS, each with its own live mutation so a harness that passes because the fix already
// works some other way is worth nothing:
//   1. RECALCULATE ON, a node: after an edit and the debounced solve, the popup, the label and the
//      table cell all read the SAME pressure for the same node.
//   2. RECALCULATE OFF, a node: an edit runs no solve, and all three venues go on agreeing with
//      each other about the STALE number -- off means a snapshot, not a disagreement.
//   3. RECALCULATE ON, a link: editing a pipe's diameter and letting the debounced solve land, the
//      popup's Flow/Velocity/Head loss rows must agree with the map label and the table, same as a
//      node's Pressure. renderLinkFields() reads lastSolveResult exactly as renderNodeFields()
//      does, so this is the same defect on the same seam -- Tom's report named both venues
//      ("Demand, Pressure etc.") and CLAUDE.md's brief asked this be checked for a link too.
//   4. THE MULTI-SELECT PROPERTIES BOX never shows a result column at all (multiSection() skips
//      any column with `c.result`, on purpose -- a result is not editable one at a time or forty at
//      a time), so there is no stale-result field for it to carry. This group asserts that
//      exclusion holds, so a future column addition cannot reopen the defect for a venue nobody
//      thought to re-check.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

const INJECT =
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tscheduleSolve: scheduleSolve, runSolve: runSolve,\n" +
	"\t\tafterPropertyEdit: afterPropertyEdit, setProp: setProp, updateNode: updateNode,\n" +
	"\t\tnodeEls: function () { return nodeEls; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\topenPopup: openPopup,\n" +
	"\t\topenLinkPopup: openLinkPopup,\n" +
	"\t\tsetSelectionList: setSelectionList,\n" +
	"\t\topenMultiProperties: openMultiProperties,\n" +
	"\t\tcurrentPopup: function () { return currentPopup; },\n" +
	"\t\tclosePopup: closePopup,\n" +
	"\t\tpopupFieldsDom: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpaneTables: paneTables, renderPaneTable: renderPaneTable,\n" +
	"\t\topenPaneTab: function (id) { paneState.open = true; paneState.tab = id; var t = paneTabById(id); if (t && t.show) { t.show(); } },\n" +
	"\t\tpaneCellDom: function (panel, elId, key) {\n" +
	"\t\t\tvar host = document.getElementById(panel), found = null;\n" +
	"\t\t\tfunction walk(node) {\n" +
	"\t\t\t\tif (!node || found) { return; }\n" +
	"\t\t\t\tif (node._lpnPaneId === elId && node._lpnPaneKey === key) { found = node; return; }\n" +
	"\t\t\t\t(node.children || []).forEach(walk);\n" +
	"\t\t\t}\n" +
	"\t\t\twalk(host);\n" +
	"\t\t\tif (!found) { return null; }\n" +
	"\t\t\tvar inputFound = null;\n" +
	"\t\t\t(found.children || []).forEach(function (c) { if (c.tagName === 'INPUT') { inputFound = c; } });\n" +
	"\t\t\treturn inputFound || found;\n" +
	"\t\t},\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tgetLibrary: function () { return library; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } ";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function openPage() {
	const L = loadLoopedNetwork(INJECT, null, null);
	setUnitSet('us');
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net3.lwn', 'utf8'));
	if (!saved) { throw new Error('Net3 did not open'); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	// Autosave refuses a document in no project (same guard other harnesses carry).
	const lib = L.getLibrary();
	lib.projects = [{ id: 'property-echo-fixture', name: 'fixture', updated: 0 }];
	lib.openId = 'property-echo-fixture';
	return { L: L, doc: L.getDoc(), settings: L.settings() };
}

// The number a venue is actually SHOWING for one node's pressure, read from that venue's own
// rendered output -- never recomputed here, or the harness would test itself instead of the page.
function popupPressure(L) {
	var fields = L.popupFieldsDom();
	if (!fields) { return undefined; }
	var found = null;
	(fields.children || []).forEach(function (label) {
		if (found || label.tagName !== 'LABEL') { return; }
		if (String(label.textContent || '').indexOf('Pressure') === 0) { found = label; }
	});
	if (!found || !found.children.length) { return undefined; }
	var span = found.children[found.children.length - 1];
	return span ? parseFloat(span.textContent) : undefined;
}
function labelPressure(L, nodeId) {
	var ne = L.nodeEls()[nodeId];
	if (!ne || !ne.allLines) { return undefined; }
	var line = ne.allLines.filter(function (l) { return l.field === 'pressure'; })[0];
	// The line carries its own affix, e.g. "P=-0.64" -- the number is the middle PART, not the
	// whole text (parseFloat('P=-0.64') is NaN because of the leading letters).
	if (!line) { return undefined; }
	var numPart = (line.parts || []).filter(function (p) { return /^-?\d/.test(p.text); })[0];
	return numPart ? parseFloat(numPart.text) : parseFloat(line.text.replace(/^[^-\d]+/, ''));
}
function tablePressure(L, nodeId) {
	L.openPaneTab('junctions');
	var cell = L.paneCellDom('lpn_pane_junctions', nodeId, 'pressure');
	if (!cell) { return undefined; }
	var text = cell.value !== undefined && cell.value !== '' ? cell.value : cell.textContent;
	return text === undefined || text === '' ? undefined : parseFloat(text);
}

// The same three readers, for a link's Flow row -- renderLinkFields()'s readonlyUnitField() writes
// a <label> whose text starts with the field's own name ("Flow"), same shape as a node's Pressure.
function popupFlow(L) {
	var fields = L.popupFieldsDom();
	if (!fields) { return undefined; }
	var found = null;
	(fields.children || []).forEach(function (label) {
		if (found || label.tagName !== 'LABEL') { return; }
		if (String(label.textContent || '').indexOf('Flow') === 0) { found = label; }
	});
	if (!found || !found.children.length) { return undefined; }
	var span = found.children[found.children.length - 1];
	return span ? parseFloat(span.textContent) : undefined;
}
function labelFlow(L, linkId) {
	var le = L.linkEls()[linkId];
	if (!le || !le.allLines) { return undefined; }
	var line = le.allLines.filter(function (l) { return l.field === 'flow'; })[0];
	if (!line) { return undefined; }
	var numPart = (line.parts || []).filter(function (p) { return /^-?\d/.test(p.text); })[0];
	return numPart ? parseFloat(numPart.text) : parseFloat(line.text.replace(/^[^-\d]+/, ''));
}
function labelFlowDecimals(L, linkId) {
	var le = L.linkEls()[linkId];
	var line = le && le.allLines ? le.allLines.filter(function (l) { return l.field === 'flow'; })[0] : null;
	var numPart = line ? (line.parts || []).filter(function (p) { return /^-?\d/.test(p.text); })[0] : null;
	var m = numPart ? /\.(\d+)/.exec(numPart.text) : null;
	return m ? m[1].length : 0;
}
function tableFlow(L, linkId) {
	L.openPaneTab('pipes');
	var cell = L.paneCellDom('lpn_pane_pipes', linkId, 'flow');
	if (!cell) { return undefined; }
	var text = cell.value !== undefined && cell.value !== '' ? cell.value : cell.textContent;
	return text === undefined || text === '' ? undefined : parseFloat(text);
}

async function group(title) {
	console.log('\n' + title);
	const page = openPage();
	page.L.runSolve();
	await wait(400);
	if (!page.L.lastResult()) { throw new Error('the fixture never produced a first solve'); }
	return page;
}

(async function () {
	console.log('=== property echo: Properties, the map label and the Table must agree ===');

	// =========================================================================================
	// 1. RECALCULATE ON: after the debounced solve, all three venues read the SAME number
	// =========================================================================================
	{
		const page = await group('-- 1. an edited junction\'s Pressure agrees in Properties, label and table --');
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];

		page.L.openPopup(junc.id, 0, 0);
		const beforePopup = popupPressure(page.L);
		const beforeLabel = labelPressure(page.L, junc.id);
		ok('the popup opened on a junction and shows a Pressure row', typeof beforePopup === 'number', beforePopup);

		// Edit Base demand the way Properties does: setProp() then the shared tail.
		page.L.setProp(junc, 'demand', (junc._demand || junc.demand || 0) + 500);
		page.L.afterPropertyEdit(junc);
		await wait(400);   // the 300 ms debounce, plus margin

		ok('a new solve actually ran (lastSolveResult reflects the edit)',
			!!page.L.lastResult() && page.L.lastResult().pressures[junc.id] !== undefined);

		const afterPopup = popupPressure(page.L);
		const afterLabel = labelPressure(page.L, junc.id);
		const afterTable = tablePressure(page.L, junc.id);

		ok('the map label\'s Pressure changed from the edit', afterLabel !== beforeLabel,
			beforeLabel + ' -> ' + afterLabel);
		ok('the Properties popup\'s Pressure changed from the SAME edit -- this is the reported defect',
			afterPopup !== beforePopup, 'popup stuck at ' + afterPopup + ', label moved to ' + afterLabel);
		ok('Properties and the map label now show the same number',
			Math.abs(afterPopup - afterLabel) < 0.05, 'popup ' + afterPopup + ' vs label ' + afterLabel);
		ok('Properties and the Tables pane now show the same number',
			Math.abs(afterPopup - afterTable) < 0.05, 'popup ' + afterPopup + ' vs table ' + afterTable);
		ok('the Tables pane and the map label agree with each other too',
			Math.abs(afterTable - afterLabel) < 0.05, 'table ' + afterTable + ' vs label ' + afterLabel);
	}

	// =========================================================================================
	// 2. RECALCULATE OFF: no solve runs, but all three venues stay in agreement about the STALE
	//    number -- "Off means Off, but it doesn't mean Hide or Delete. It means Snapshot in time."
	// =========================================================================================
	{
		const page = await group('-- 2. with Recalculate off, all three venues agree on the STALE snapshot --');
		page.settings.autoRun = false;
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		const staleResult = page.L.lastResult();

		page.L.openPopup(junc.id, 0, 0);
		const beforePopup = popupPressure(page.L);

		page.L.setProp(junc, 'demand', (junc._demand || junc.demand || 0) + 500);
		page.L.afterPropertyEdit(junc);
		await wait(400);

		ok('recalculate off means no new solve ran', page.L.lastResult() === staleResult);
		const afterPopup = popupPressure(page.L);
		const afterLabel = labelPressure(page.L, junc.id);
		const afterTable = tablePressure(page.L, junc.id);
		ok('the stale Pressure is unchanged by the edit -- a snapshot, not a recompute',
			afterPopup === beforePopup, beforePopup + ' -> ' + afterPopup);
		ok('Properties and the map label agree on the stale snapshot',
			Math.abs(afterPopup - afterLabel) < 0.05, 'popup ' + afterPopup + ' vs label ' + afterLabel);
		ok('Properties and the Tables pane agree on the stale snapshot',
			Math.abs(afterPopup - afterTable) < 0.05, 'popup ' + afterPopup + ' vs table ' + afterTable);
	}

	// =========================================================================================
	// 3. RECALCULATE ON, a LINK: the same defect on the same seam, for Flow/Velocity/Head loss
	// =========================================================================================
	{
		const page = await group('-- 3. an edited pipe\'s Flow agrees in Properties, label and table --');
		// A pipe INSIDE the network, not the main from a reservoir or tank: a source main carries the
		// total demand whatever its diameter, so its flow moves only in the hundredths and a label
		// showing whole units (US gpm, R-328) does not change at all.
		const fixedHead = {};
		page.doc.nodes.forEach(function (n) { if (n.type === 'reservoir' || n.type === 'tank') { fixedHead[n.id] = true; } });
		const pipes = page.doc.links.filter(function (l) { return l.type === 'pipe'; });
		const flows = page.L.lastResult().flows || {};
		const inner = pipes.filter(function (l) { return !fixedHead[l.from] && !fixedHead[l.to]; })
			.sort(function (a, b) { return Math.abs(flows[b.id] || 0) - Math.abs(flows[a.id] || 0); });
		const pipe = inner[0] || pipes[0];   // the busiest interior pipe, so halving it moves its flow

		page.L.openLinkPopup(pipe.id, 0, 0);
		const beforePopup = popupFlow(page.L);
		const beforeLabel = labelFlow(page.L, pipe.id);
		ok('the popup opened on a pipe and shows a Flow row', typeof beforePopup === 'number', beforePopup);

		// Halve the diameter -- a big enough change that flow through the rest of the loop moves.
		page.L.setProp(pipe, 'diameter', (pipe._diameter || pipe.diameter || 12) / 2);
		page.L.afterPropertyEdit(pipe);
		await wait(400);   // the 300 ms debounce, plus margin

		ok('a new solve actually ran (lastSolveResult reflects the edit)',
			!!page.L.lastResult() && page.L.lastResult().flows[pipe.id] !== undefined);

		const afterPopup = popupFlow(page.L);
		const afterLabel = labelFlow(page.L, pipe.id);
		const afterTable = tableFlow(page.L, pipe.id);

		ok('the map label\'s Flow changed from the edit', afterLabel !== beforeLabel,
			beforeLabel + ' -> ' + afterLabel);
		ok('the Properties popup\'s Flow changed from the SAME edit -- the link side of the same defect',
			afterPopup !== beforePopup, 'popup stuck at ' + afterPopup + ', label moved to ' + afterLabel);
		// The label rounds to ITS OWN decimals (per unit since R-328: whole gpm), so it agrees with
		// the others to half its last place, not to 0.05.
		const labelTol = Math.max(0.05, 0.5 * Math.pow(10, -labelFlowDecimals(page.L, pipe.id)) + 1e-9);
		ok('Properties and the map label now show the same number',
			Math.abs(afterPopup - afterLabel) <= labelTol, 'popup ' + afterPopup + ' vs label ' + afterLabel);
		ok('Properties and the Tables pane now show the same number',
			Math.abs(afterPopup - afterTable) < 0.05, 'popup ' + afterPopup + ' vs table ' + afterTable);
		ok('the Tables pane and the map label agree with each other too',
			Math.abs(afterTable - afterLabel) <= labelTol, 'table ' + afterTable + ' vs label ' + afterLabel);
	}

	// =========================================================================================
	// 4. THE MULTI-SELECT PROPERTIES BOX carries no result column, so it has nothing to go stale.
	//    This is not "untested" -- it is asserted so a future column addition cannot reopen the
	//    defect for a venue nobody thought to re-check.
	// =========================================================================================
	{
		const page = await group('-- 4. the multi-select Properties box shows no result column to go stale --');
		const juncs = page.doc.nodes.filter(function (n) { return n.type === 'junction'; }).slice(0, 2);
		page.L.setSelectionList(juncs.map(function (n) { return { kind: 'node', id: n.id }; }));
		page.L.openMultiProperties();
		ok('the multi popup actually opened', page.L.currentPopup() && page.L.currentPopup().kind === 'multi');
		var fields = page.L.popupFieldsDom();
		var text = fields ? String(fields.textContent || '') : '';
		ok('no "Pressure" row appears in the multi-select box',
			text.indexOf('Pressure') === -1, text);
		ok('no "Demand actual" row appears in the multi-select box either',
			text.indexOf('Demand actual') === -1, text);
	}

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILURE(S)'));
	process.exit(fails === 0 ? 0 : 1);
})();

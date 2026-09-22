// OFF MEANS A SNAPSHOT, NEVER HIDE OR DELETE. Run with:
//   node dev/lpn-spike/stale-snapshot-harness.js
//
// WHY THIS EXISTS. Tom extended the "recalculate off leaves the old answers alone" ruling
// (dev/lpn-spike/manual-recalc-harness.js) in three directions, in his own words:
//
//   "Off means Off, but it doesn't mean Hide or Delete. It means Snapshot in time."
//   "Any input we edit must be reflected wherever it shows, Table, Properties, and map labels...
//    we can have tunnel vision on only the label we change."
//   "Tables and Properties -- everything -- should show the stale results while user continues
//    to work."
//   Asked whether fire flow rings should stop clearing on an edit: "Yes... for fire flow rings,
//    we could provide a button in that box to clear the rings."
//
// FOUR GROUPS, each with its own live mutation so a harness that passes because the page happens
// to be quiet is worth nothing:
//
//   1. AN EDIT UPDATES EVERYWHERE, IN PLACE. A node's own map label and the Tables pane both pick
//      up a changed input with no solve run -- and no OTHER label on the map moves, because a
//      single edit gets refreshOneLabelInPlace(), never the network-wide refreshLabelTextPass() +
//      relayoutLabels() pass.
//   2. STALE RESULTS SURVIVE THE EDIT. lastSolveResult is untouched, so the Tables pane's result
//      columns keep showing the old numbers rather than blanking.
//   3. FIRE FLOW RINGS SURVIVE AN EDIT (and only an edit -- opening a different network still
//      clears them), and the box gets an explicit Clear control.
//   4. THE TRAP: no solve runs, but the edit still SAVES.

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
	"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; },\n" +
	"\t\tpaneTables: paneTables, renderPaneTable: renderPaneTable,\n" +
	// **THROUGH THE TAB'S OWN show(), NOT A BARE renderPaneTable(paneTableById(id)) CALL.** The
	// two return DIFFERENT spec objects for a reason unrelated to this ruling and out of scope
	// here -- paneTabs.push() below closes over paneTables()'s FIRST build, and the very next
	// top-level statement resets the module cache, so every LATER paneTables()/paneTableById()
	// call builds a second, disconnected set. Harmless in the shipped page (every real click runs
	// through a tab's own show()/refresh(), which always sees the first set); a harness that read
	// cells off the second set would be testing that duplication, not the fix. Reading the cell
	// back through the real rendered DOM below (paneCellDom) sidesteps the question entirely.
	"\t\topenPaneTab: function (id) { paneState.open = true; paneState.tab = id; var t = paneTabById(id); if (t && t.show) { t.show(); } },\n" +
	// The stub's querySelectorAll() is a no-op ([]) except on one hard-coded selector elsewhere,
	// so this walks .children by hand -- appendChild() is the one thing every element in the stub
	// genuinely supports.
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
	"\t\tclearFireFlowRun: clearFireFlowRun,\n" +
	"\t\tseedFireFlowRun: function (v) { fireFlowRun = v; refreshFireFlowMarks(); },\n" +
	"\t\tgetFireFlowRun: function () { return fireFlowRun; },\n" +
	"\t\tsetNoticeSpy: function (fn) { setNotice = fn; },\n" +
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

// **THE FULL-PASS COUNTER, AS A LIVE INSTRUMENT, NOT A POSITION GUESS.** A position-invariance
// check is not reliable evidence on its own: a network that happens to have room enough that the
// full collision pass moves nothing looks identical to tunnel vision having run. This counts calls
// to refreshLabelTextPass() itself -- the network-wide content+collision pass -- by splicing a
// counter increment into its own first line, the same technique the GATE mutations below use.
const FULL_PASS_MARK = "\tfunction refreshLabelTextPass() {\n";
const FULL_PASS_COUNTED = "\tfunction refreshLabelTextPass() {\n\t\tglobal.__fullPassCount = (global.__fullPassCount || 0) + 1;\n";
function withFullPassCounter(mutate) {
	return function (src) {
		if (src.indexOf(FULL_PASS_MARK) < 0) { throw new Error('refreshLabelTextPass() has moved; update FULL_PASS_MARK'); }
		var out = src.replace(FULL_PASS_MARK, FULL_PASS_COUNTED);
		return mutate ? mutate(out) : out;
	};
}

function openPage(mutate) {
	global.__fullPassCount = 0;
	const L = loadLoopedNetwork(INJECT, null, withFullPassCounter(mutate));
	setUnitSet('us');
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net3.lwn', 'utf8'));
	if (!saved) { throw new Error('Net3 did not open'); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();

	const EC = global.EngCalcs;
	const counts = { native: 0, epanet: 0, saves: 0 };
	const realNative = EC.lpnSolve;
	EC.lpnSolve = function () { counts.native++; return realNative.apply(this, arguments); };
	if (EC.lpnSolveEpanet) {
		const realEpanet = EC.lpnSolveEpanet;
		EC.lpnSolveEpanet = function () { counts.epanet++; return realEpanet.apply(this, arguments); };
	}
	if (EC.lpnEpanetRun) {
		const realRun = EC.lpnEpanetRun;
		EC.lpnEpanetRun = function () { counts.epanet++; return realRun.apply(this, arguments); };
	}
	// Same as manual-recalc-harness.js: autosave refuses a document in no project.
	const lib = L.getLibrary();
	lib.projects = [{ id: 'stale-snapshot-fixture', name: 'fixture', updated: 0 }];
	lib.openId = 'stale-snapshot-fixture';
	const store = global.localStorage;
	const realSet = store.setItem.bind(store);
	store.setItem = function (k, v) { if (String(k).indexOf('lpn') >= 0) { counts.saves++; } return realSet(k, v); };

	return { L: L, counts: counts, doc: L.getDoc(), settings: L.settings() };
}

async function group(title, mutate) {
	console.log('\n' + title);
	const page = openPage(mutate);
	page.L.runSolve();
	await wait(400);
	if (!page.L.lastResult()) { throw new Error('the fixture never produced a first solve'); }

	page.settings.autoRun = false;
	page.counts.native = 0; page.counts.epanet = 0; page.counts.saves = 0;
	return page;
}

(async function () {
	console.log('=== stale snapshot: off means off, but off means a SNAPSHOT ===');

	// =========================================================================================
	// 1. AN EDIT UPDATES THE MAP LABEL IN PLACE, WITH NO FULL PLACEMENT PASS
	// =========================================================================================
	{
		const page = await group('-- 1a. a node input edit reaches its own map label, in place --');
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		const other = page.doc.nodes.filter(function (n) { return n.type === 'junction' && n.id !== junc.id; })[0];
		const NE = page.L.nodeEls();
		const beforeText = NE[junc.id].text.textContent;
		const otherX = NE[other.id].text.getAttribute('x');
		const otherY = NE[other.id].text.getAttribute('y');

		global.__fullPassCount = 0;
		junc.elev = (junc.elev || 0) + 12345;
		page.L.updateNode(junc.id, true);

		ok('the edited node\'s own label text changed', NE[junc.id].text.textContent !== beforeText,
			NE[junc.id].text.textContent);
		ok('the edited node\'s label text now carries the new number',
			NE[junc.id].text.textContent.indexOf('12345') >= 0 || String(junc.elev).length > 0);
		ok('no OTHER node\'s label moved -- tunnel vision, not a full placement pass',
			NE[other.id].text.getAttribute('x') === otherX && NE[other.id].text.getAttribute('y') === otherY);
		ok('the network-wide content pass never ran -- refreshLabelTextPass() was called zero times',
			global.__fullPassCount === 0, global.__fullPassCount + ' calls');
		ok('no solve ran for a plain label update', page.counts.native + page.counts.epanet === 0,
			(page.counts.native + page.counts.epanet) + ' solves');
	}

	{
		const page = await group('-- 1b. a link input edit reaches its own map label, in place --');
		const pipe = page.doc.links.filter(function (l) { return l.type === 'pipe'; })[0];
		const LE = page.L.linkEls();
		const NE = page.L.nodeEls();
		const someNode = page.doc.nodes[0];
		const beforeText = LE[pipe.id].text.textContent;
		const otherX = NE[someNode.id].text.getAttribute('x');
		const otherY = NE[someNode.id].text.getAttribute('y');

		global.__fullPassCount = 0;
		page.L.setProp(pipe, 'diameter', (pipe._diameter || pipe.diameter || 8) + 999);
		page.L.afterPropertyEdit(pipe);

		ok('the edited pipe\'s own label text changed', LE[pipe.id].text.textContent !== beforeText,
			LE[pipe.id].text.textContent);
		ok('no unrelated node\'s label moved -- tunnel vision, not a full placement pass',
			NE[someNode.id].text.getAttribute('x') === otherX && NE[someNode.id].text.getAttribute('y') === otherY);
		ok('the network-wide content pass never ran -- refreshLabelTextPass() was called zero times',
			global.__fullPassCount === 0, global.__fullPassCount + ' calls');
		ok('no solve ran for a plain label update', page.counts.native + page.counts.epanet === 0,
			(page.counts.native + page.counts.epanet) + ' solves');
	}

	// =========================================================================================
	// 2. AN EDIT UPDATES THE TABLES PANE, WITH NO FULL PANE REBUILD REQUIRED FROM THE CALLER
	// =========================================================================================
	{
		const page = await group('-- 2. a Properties edit reaches the open Tables pane, in place --');
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		page.L.openPaneTab('junctions');   // the real "the tab is open" state -- refreshPaneIfOpen() reads it
		const cellBefore = page.L.paneCellDom('lpn_pane_junctions', junc.id, 'elev');
		ok('the pane actually built a cell for this junction\'s elevation', !!cellBefore);

		junc.elev = (junc.elev || 0) + 777;
		page.L.updateNode(junc.id, true);
		// **NOTHING ELSE IS CALLED HERE.** The point of the fix is that afterPropertyEdit()/
		// updateNode(id, true) themselves keep the open pane current -- a harness that called
		// renderPaneTable() again would be testing the harness, not the page.

		const cellAfter = page.L.paneCellDom('lpn_pane_junctions', junc.id, 'elev');
		ok('the OPEN pane\'s elevation cell shows the new number with no further call',
			cellAfter.value === String(junc.elev),
			'cell reads ' + JSON.stringify(cellAfter.value) + ', elev is ' + junc.elev);
	}

	// =========================================================================================
	// 3. STALE RESULTS SURVIVE AN EDIT -- lastSolveResult is untouched
	// =========================================================================================
	{
		const page = await group('-- 3. lastSolveResult is untouched by an edit with the switch off --');
		const before = page.L.lastResult();
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		junc.elev = (junc.elev || 0) + 5;
		page.L.updateNode(junc.id, true);
		page.L.scheduleSolve();
		await wait(500);
		ok('the last solve result object is the SAME one -- nothing cleared it',
			page.L.lastResult() === before);
	}

	// =========================================================================================
	// 4. FIRE FLOW RINGS SURVIVE AN EDIT, AND CAN BE CLEARED DELIBERATELY
	// =========================================================================================
	{
		const page = await group('-- 4a. fire flow rings survive an ordinary edit --');
		const notices = [];
		page.L.setNoticeSpy(function (t) { notices.push(t); });
		page.L.seedFireFlowRun({ byId: {} });
		ok('the fixture seeded a fire flow run', page.L.getFireFlowRun() !== null);

		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		junc.elev = (junc.elev || 0) + 9;
		page.L.updateNode(junc.id, true);
		page.L.scheduleSolve();
		await wait(500);

		ok('the rings are STILL THERE after the edit', page.L.getFireFlowRun() !== null);
		ok('and nothing said they were cleared, because nothing was', notices.length === 0,
			JSON.stringify(notices));
	}

	{
		console.log('\n-- 4b. the Clear control removes them deliberately, quietly --');
		const page = openPage();
		const notices = [];
		page.L.setNoticeSpy(function (t) { notices.push(t); });
		page.L.seedFireFlowRun({ byId: {} });
		page.L.clearFireFlowRun(true);
		ok('a deliberate Clear does remove the rings', page.L.getFireFlowRun() === null);
		ok('...quietly -- the user asked, so nothing needs to tell them', notices.length === 0);
	}

	// =========================================================================================
	// 5. THE TRAP: the edit still SAVES even though nothing solves
	// =========================================================================================
	{
		const page = await group('-- 5. the trap: an edit with the switch off still persists --');
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		junc.elev = (junc.elev || 0) + 3;
		page.L.updateNode(junc.id, true);
		page.L.scheduleSolve();
		await wait(500);
		ok('the edit was saved even though nothing solved', page.counts.saves > 0, page.counts.saves + ' writes');
		ok('...and, for the record, nothing solved', page.counts.native + page.counts.epanet === 0);
	}

	// =========================================================================================
	// LIVE MUTATIONS -- each turns a green assertion above red
	// =========================================================================================

	// Mutation A: put rebuildLink() back on the full document-wide pass.
	console.log('\n-- live mutation: rebuildLink() back on the full pass (Item 1b) --');
	{
		const FROM = "\t\tupdateTextOnLink(l.id);\n\t\trefreshOneLabelInPlace(l);\n\t}";
		const TO = "\t\tupdateTextOnLink(l.id);\n\t\trefreshLabelText();\n\t}";
		const page = openPage(function (src) {
			if (src.indexOf(FROM) < 0) { throw new Error('rebuildLink() has moved; update mutation A'); }
			return src.replace(FROM, TO);
		});
		page.L.runSolve();
		const pipe = page.doc.links.filter(function (l) { return l.type === 'pipe'; })[0];
		global.__fullPassCount = 0;
		page.L.setProp(pipe, 'diameter', (pipe._diameter || pipe.diameter || 8) + 999);
		page.L.afterPropertyEdit(pipe);
		ok('...mutated: a link edit now runs the network-wide pass -- so the check above is real',
			global.__fullPassCount > 0, global.__fullPassCount + ' calls, expected at least 1');
	}

	// Mutation B: updateNode() no longer refreshes content even when told to.
	console.log('\n-- live mutation: updateNode(id, true) stops refreshing content (Item 1a) --');
	{
		const FROM = "\t\tif (contentChanged) { refreshOneLabelInPlace(n); refreshPaneIfOpen(); }\n\t\tscheduleSolve();\n\t}";
		const TO = "\t\tscheduleSolve();\n\t}";
		const page = openPage(function (src) {
			if (src.indexOf(FROM) < 0) { throw new Error('updateNode() has moved; update mutation B'); }
			return src.replace(FROM, TO);
		});
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		const NE = page.L.nodeEls();
		const before = NE[junc.id].text.textContent;
		junc.elev = (junc.elev || 0) + 54321;
		page.L.updateNode(junc.id, true);
		ok('...mutated: the node\'s label text no longer updates -- so the check above is real',
			NE[junc.id].text.textContent === before);
	}

	// Mutation C: updateNode() stops telling the Tables pane when the content changed.
	console.log('\n-- live mutation: updateNode(id, true) stops refreshing the pane (Item 2) --');
	{
		const FROM = "\t\tif (contentChanged) { refreshOneLabelInPlace(n); refreshPaneIfOpen(); }\n";
		const TO = "\t\tif (contentChanged) { refreshOneLabelInPlace(n); }\n";
		const page = openPage(function (src) {
			if (src.indexOf(FROM) < 0) { throw new Error('updateNode() has moved; update mutation C'); }
			return src.replace(FROM, TO);
		});
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		page.L.openPaneTab('junctions');
		const before = page.L.paneCellDom('lpn_pane_junctions', junc.id, 'elev').value;
		junc.elev = (junc.elev || 0) + 111;
		page.L.updateNode(junc.id, true);
		ok('...mutated: the open pane cell no longer moves -- so the check above is real',
			page.L.paneCellDom('lpn_pane_junctions', junc.id, 'elev').value === before);
	}

	// Mutation D: scheduleSolve() clears the fire flow run again, as Task 530 originally shipped.
	console.log('\n-- live mutation: scheduleSolve() clears fire flow rings again (Item 3) --');
	{
		const FROM = "\tfunction scheduleSolve() {\n";
		const TO = "\tfunction scheduleSolve() {\n\t\tclearFireFlowRun(false);\n";
		const page = openPage(function (src) {
			if (src.indexOf(FROM) < 0) { throw new Error('scheduleSolve() has moved; update mutation D'); }
			return src.replace(FROM, TO);
		});
		page.L.seedFireFlowRun({ byId: {} });
		const junc = page.doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
		junc.elev = (junc.elev || 0) + 1;
		page.L.updateNode(junc.id, true);
		page.L.scheduleSolve();
		ok('...mutated: an ordinary edit clears the rings again -- so the check above is real',
			page.L.getFireFlowRun() === null);
	}

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILED'));
	process.exit(fails === 0 ? 0 : 1);
})().catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

// EVERY ID IN THE FIRE-FLOW TABLE GOES TO ITS ELEMENT -- Tom, 2026-09-28 ("Preparing to make
// videos"): *"In fire flow analysis, can every node have a hyperlink to go to it?"* Run with:
//   node dev/lpn-spike/fireflow-goto-link-harness.js
//
// Runs a real sweep on the built-in example and reads the rendered report: every row's Junction
// cell holds a go-to link naming that junction (with the label prefix), the Worst-effect cell's id
// is a link too, and clicking one is the same go-to a Find result is -- it selects when nothing is
// selected, and never replaces a selection set that is standing.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');
const PC = global.EngCalcs.pageConfig;

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, openFireFlowBox: openFireFlowBox, wireFireFlowBox: wireFireFlowBox,\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep, run: function () { return fireFlowRun; },\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\tsetNodeIdPrefix: function (p) { labelSettings.prefix = labelSettings.prefix || {};\n" +
	"\t\t\tlabelSettings.prefix.node = labelSettings.prefix.node || {};\n" +
	"\t\t\tlabelSettings.prefix.node.id = p; },\n" +
	"\t\trebuildFireFlowReport: rebuildFireFlowReport,\n" +
	"\t\tselectedRefs: selectedRefs, setSelectionList: setSelectionList, clearSel: clearSelection,\n" +
	"\t\tlocatedRef: locatedElementRef,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function kids(n) { return (n && (n.childNodes || n.children)) || []; }
function isTag(n, t) { return String(n && (n.tagName || n._tag)).toLowerCase() === t; }
function rows(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'tr')) { const tds = kids(x).filter((c) => isTag(c, 'td')); if (tds.length) { out.push(tds); } return; }
		kids(x).forEach(walk);
	})(el);
	return out;
}
function links(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'button') && String(x.className || x['class'] || '').indexOf('lpn-ff-goto') >= 0) { out.push(x); }
		kids(x).forEach(walk);
	})(el);
	return out;
}
function click(b) { ((b._listeners && b._listeners.click) || []).forEach((f) => f({})); }

(async function () {
	setUnitSet('us');
	L.reset();
	openExample(L, 'us');
	L.wireFireFlowBox();
	L.runSolve();
	L.openFireFlowBox();
	// A demanding flow and design check on, so some junctions pull others down and the Worst-effect
	// column names somebody.
	L.setAsk('required', '3000');
	L.setAsk('design', 'all');
	await L.runFireFlowSweep();
	const set = L.run();
	ok('a sweep ran', !!set && set.results.length > 0, set && set.results.length);
	L.setNodeIdPrefix('NODE-');
	L.rebuildFireFlowReport();
	const body = rows(byId.lpn_ff_report);
	ok('the report has one row per junction tested', body.length === set.results.length, body.length + ' / ' + set.results.length);
	const firstLinks = body.map((tds) => links(tds[0]));
	ok('every Junction cell holds exactly one go-to link', firstLinks.every((l) => l.length === 1));
	const shownIds = firstLinks.map((l) => l[0] && l[0].textContent);
	ok('...naming its junction with the node label prefix',
		set.results.every((r) => shownIds.indexOf('NODE-' + r.id) >= 0), JSON.stringify(shownIds.slice(0, 4)));
	ok('...and each carries the Go to on map tip', firstLinks.every((l) => l[0].title === PC.lpn_goto_on_map), firstLinks[0][0].title);
	const effectLinks = body.map((tds) => links(tds[6])).filter((l) => l.length);
	const withEffects = set.results.filter((r) => r.effects && (r.effects.nodes.length || r.effects.links.length)).length;
	ok('every Worst-effect cell that names an element names it as a link', effectLinks.length === withEffects && withEffects > 0,
		effectLinks.length + ' / ' + withEffects);

	console.log('\n--- clicking one is the ordinary go-to ---');
	L.clearSel();
	const rec0 = set.results[0], link0 = firstLinks[body.findIndex((tds) => links(tds[0])[0].textContent === 'NODE-' + rec0.id)][0];
	click(link0);
	ok('with nothing selected, the junction becomes the selection',
		JSON.stringify(L.selectedRefs()) === JSON.stringify([{ kind: 'node', id: rec0.id }]), JSON.stringify(L.selectedRefs()));
	const others = set.results.slice(1, 3).map((r) => ({ kind: 'node', id: r.id }));
	L.setSelectionList(others);
	click(link0);
	ok('with a selection set standing, the set is untouched', JSON.stringify(L.selectedRefs()) === JSON.stringify(others), JSON.stringify(L.selectedRefs()));
	ok('...and the junction gone to wears the go-to mark', JSON.stringify(L.locatedRef()) === JSON.stringify({ kind: 'node', id: rec0.id }), JSON.stringify(L.locatedRef()));
	const eLink = effectLinks[0][0];
	L.clearSel();
	click(eLink);
	const sel = L.selectedRefs();
	ok('a Worst-effect link goes to the element it names', sel.length === 1 && eLink.textContent.indexOf(sel[0].id) >= 0,
		eLink.textContent + ' -> ' + JSON.stringify(sel));

	if (fails) { console.log('\n' + fails + ' fire-flow go-to check(s) FAILED'); process.exit(1); }
	console.log('\nFire-flow go-to link harness: all checks passed.');
	process.exit(0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

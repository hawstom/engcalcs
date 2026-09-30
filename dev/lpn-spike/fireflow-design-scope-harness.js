// THE FIRE-FLOW DESIGN CHECK'S SCOPE IS ONE SELECTOR: NONE, ALL, OR SELECTED -- ROADMAP Task 742
// and Task 746. Tom, 2026-09-28: *"What would Mary and Sue think about changing the Fire flow
// analysis design check selector to offer None, All, and Selected?"* then *"Selection set build:
// Yes."* Briefly split 2026-09-29-echo (Task 746) into a checkbox plus a two-way scope selector;
// Tom, 2026-09-30: *"Replace Design check toggle with a third option 'None All Selected'."* --
// back to one selector, now in his own shorter words (None/All/Selected) rather than Task 742's
// "Do not check" / "All other junctions and all pipes" / "The selected junctions and their pipes".
// `ask.design` carries the internal 'off'/'all'/'selected' string, unchanged since Task 742. Run
// with:
//   node dev/lpn-spike/fireflow-design-scope-harness.js
//
// 1. The design check is one selector offering exactly None, All, Selected, in the page's own
//    words; the retired 'nodes' (and any unknown value) still reads as All.
// 2. Selected means the junctions selected on the map, the pipes that meet them, and any pipe
//    selected on its own -- and a real sweep reports effects ONLY inside that set.
// 3. Selected with nothing selected refuses out loud rather than silently checking nothing.
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
	"\t\tdesignScope: ffDesignScope, selectedSet: function () { return ffDesignSelectedSet(assembleModel()); },\n" +
	"\t\tincident: function (id) { return (incidentLinks[id] || []).slice(); },\n" +
	"\t\tnotice: function () { var n = document.getElementById('lpn_map_notice'); return n ? n.textContent : ''; },\n" +
	"\t\tjunctionIds: function () { return fireFlowJunctions().map(function (n) { return n.id; }); },\n" +
	"\t\tlinkIds: function () { return doc.links.map(function (l) { return l.id; }); },\n" +
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

// A `.lpn-ff-row`'s label text and its control, the same shape buildFireFlowControls() builds
// every row from -- so a UI-shape check reads the real DOM rather than trusting a comment.
function ffFormRows(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		const cls = String((x.className || x['class'] || '')).split(/\s+/);
		if (cls.indexOf('lpn-ff-row') >= 0) {
			const c = kids(x);
			out.push({ label: c[0] ? c[0].textContent : '', control: c[1] });
			return;
		}
		kids(x).forEach(walk);
	})(el);
	return out;
}
function ffRowFor(el, labelText) {
	const row = ffFormRows(el).filter((r) => r.label === labelText)[0];
	return row ? row.control : null;
}
function selectOptions(sel) {
	return sel ? kids(sel).map((o) => [o.value, o.textContent]) : null;
}
function fire(el) { ((el && el._listeners && el._listeners.change) || []).forEach((f) => f({})); }

(async function () {
	setUnitSet('us');
	L.reset();
	openExample(L, 'us');
	L.wireFireFlowBox();
	L.runSolve();
	L.openFireFlowBox();

	console.log('--- 1. the selector ---');
	const testScope = ffRowFor(byId.lpn_ff_controls, PC.lpn_ff_scope);
	const testOpts = selectOptions(testScope);
	ok('(a) junctions to test offers exactly All, Selected, in the page\'s own words',
		!!testOpts && testOpts[0][0] === 'all' && testOpts[0][1] === PC.lpn_ff_all &&
		testOpts[1][0] === 'selected' && testOpts[1][1] === PC.lpn_ff_selected, JSON.stringify(testOpts));

	const designScope = ffRowFor(byId.lpn_ff_controls, PC.lpn_ff_design);
	const designOpts = selectOptions(designScope);
	ok('(b) the design check offers exactly None, All, Selected, in the page\'s own words',
		!!designOpts && designOpts[0][0] === 'off' && designOpts[0][1] === PC.lpn_source_type_none &&
		designOpts[1][0] === 'all' && designOpts[1][1] === PC.lpn_ff_all &&
		designOpts[2][0] === 'selected' && designOpts[2][1] === PC.lpn_ff_selected, JSON.stringify(designOpts));
	ok('All by default, since the default ask.design is All', designScope.value === 'all');

	L.setAsk('required', '3000');
	designScope.value = 'off';
	fire(designScope);
	await L.runFireFlowSweep();
	ok('choosing None turns the design check off for a real run', L.run().design === null);
	designScope.value = 'all';
	fire(designScope);
	await L.runFireFlowSweep();
	ok('choosing it back on brings the design check back', L.run().design !== null);

	ok('the retired "nodes" still reads as All', L.designScope('nodes') === 'all');
	ok('an unknown value never means "do not check"', L.designScope(undefined) === 'all' && L.designScope('xyz') === 'all');
	ok('off and selected are themselves', L.designScope('off') === 'off' && L.designScope('selected') === 'selected');

	console.log('\n--- 2. Selected is the selected junctions and the pipes that meet them ---');
	const js = L.junctionIds();
	const pick = [js[0], js[js.length - 1]];
	L.setSelectionList(pick.map((id) => ({ kind: 'node', id: id })));
	let set = L.selectedSet();
	const wantLinks = [];
	pick.forEach((id) => L.incident(id).forEach((lid) => { if (wantLinks.indexOf(lid) < 0) { wantLinks.push(lid); } }));
	ok('its junctions are the selected ones', set.nodes.join() === pick.join(), JSON.stringify(set.nodes));
	ok('its pipes are the ones that meet them', set.links.slice().sort().join() === wantLinks.slice().sort().join(),
		JSON.stringify(set.links) + ' vs ' + JSON.stringify(wantLinks));
	const lonePipe = L.linkIds().filter((l) => wantLinks.indexOf(l) < 0)[0];
	L.setSelectionList(pick.map((id) => ({ kind: 'node', id: id })).concat([{ kind: 'link', id: lonePipe }]));
	set = L.selectedSet();
	ok('a pipe selected on its own is checked too', set.links.indexOf(lonePipe) >= 0, lonePipe);
	L.setSelectionList(pick.map((id) => ({ kind: 'node', id: id })));

	L.setAsk('required', '3000');
	L.setAsk('scope', 'all');
	L.setAsk('design', 'all');
	await L.runFireFlowSweep();
	const all = L.run();
	ok('All checks every junction and every pipe', all.design && all.design.nodes === js.length && all.design.links === L.linkIds().length,
		JSON.stringify(all.design));
	const outsideAll = [];
	all.results.forEach((r) => (r.effects ? r.effects.nodes : []).forEach((e) => { if (pick.indexOf(e.id) < 0) { outsideAll.push(e.id); } }));
	ok('(under All, some effect falls outside the picked two -- so the next check can fail)', outsideAll.length > 0, outsideAll.length);

	L.setSelectionList(pick.map((id) => ({ kind: 'node', id: id })));
	L.setAsk('design', 'selected');
	await L.runFireFlowSweep();
	const sel = L.run();
	ok('Selected checks exactly the selected set', sel.design && sel.design.nodes === pick.length && sel.design.links === wantLinks.length,
		JSON.stringify(sel.design));
	let stray = [];
	sel.results.forEach((r) => {
		if (!r.effects) { return; }
		r.effects.nodes.forEach((e) => { if (pick.indexOf(e.id) < 0) { stray.push(e.id); } });
		r.effects.links.forEach((e) => { if (wantLinks.indexOf(e.id) < 0) { stray.push(e.id); } });
	});
	ok('no effect is reported outside it', stray.length === 0, JSON.stringify(stray));

	console.log('\n--- 3. Selected with nothing selected refuses ---');
	L.clearSel();
	const before = L.run();
	await L.runFireFlowSweep();
	ok('no run happens', L.run() === before);
	ok('...and the notice says why', L.notice() === PC.lpn_ff_design_no_selection, L.notice());

	if (fails) { console.log('\n' + fails + ' design-scope check(s) FAILED'); process.exit(1); }
	console.log('\nFire-flow design scope harness: all checks passed.');
	process.exit(0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

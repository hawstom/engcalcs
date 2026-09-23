// A SETTINGS SELECT RESPONDS, KEEPS ITS ELEMENT, AND COSTS ONE LABEL PASS AT MOST (ROADMAP Task 653).
// Run with:
//   node dev/lpn-spike/settings-select-lag-harness.js
//
// Tom, 2026-09-13: *"the Settings Quality selector is very sluggish and doesn't work (change) once
// it responds. All selectors are the same that way."* Two defects, and this holds both:
//
//   1. THE LABEL PASS RAN INSIDE THE CHANGE HANDLER, once per call. requestLabelRefresh() now
//      marks it owed and runs it once, after the frame paints. Sections 1-2.
//   2. THE BOX WAS REBUILT UNDER THE SELECT, so the element the user held was thrown away and a
//      copy put in its place. keepSetboxControl() now puts the held one back. Sections 5-6.
//
// And the price of (1), paid in full: anything that READS the layout flushes the owed pass first,
// so no reader sees the drawing from before a change it was already told about (section 3), and an
// edit with Recalculate OFF still redraws only its own label (section 4).
//
// The real-browser numbers (before and after) come from browser-settings-select-probe.js; this
// counts passes, which is the part node can count honestly.

'use strict';

const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, byId, loadLoopedNetwork, setUnitSet } = stub;

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// A LABEL PASS is one run of refreshLabelText()'s content pass, counted where the page's own
// ?debug=perf instrument counts it -- so a pass the page skips (labels hidden) is not counted
// either, and a pass is one however many placement rounds it runs inside.
global.__lpnPasses = 0;
Object.defineProperty(global, 'passes', {
	get() { return global.__lpnPasses; }, set(v) { global.__lpnPasses = v; }
});

// **A SELECT'S VALUE IS ITS SELECTED OPTION**, as in a browser. The stub's select is a plain
// object whose `value` is whatever was last assigned, so a copy built with `opt.selected = true`
// would report '' -- and "the kept select shows the value the rebuild chose" would be asserting
// against a value nothing ever set. Re-coupled here rather than in the shared stub, because this is
// the one harness that asks.
const realCreate = global.document.createElement;
global.document.createElement = function (tag) {
	const el = realCreate.apply(this, arguments);
	if (String(tag).toLowerCase() === 'select') {
		const opts = function () { return el.children.filter(function (c) { return c.tagName === 'OPTION'; }); };
		Object.defineProperty(el, 'value', {
			configurable: true,
			get() { const o = opts(), hit = o.filter(function (x) { return x.selected; })[0] || o[0]; return hit ? hit.value : ''; },
			set(v) { opts().forEach(function (x) { x.selected = (x.value === String(v)); }); }
		});
	}
	return el;
};

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tfit: restoreViewOrFit, getDoc: function () { return doc; },\n" +
	"\t\trefreshLabelText: refreshLabelText, requestLabelRefresh: requestLabelRefresh,\n" +
	"\t\tflushLabelRefresh: flushLabelRefresh, relayoutLabels: relayoutLabels,\n" +
	"\t\tcaptureLabelLayout: captureLabelLayout, refreshOneLabelInPlace: refreshOneLabelInPlace,\n" +
	"\t\trebuildSettingsBox: rebuildSettingsBox,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tnodeEls: function () { return nodeEls; }",
	null,
	function (src) {
		return src.replace("perfDebugCount('labelPasses');",
			"perfDebugCount('labelPasses'); global.__lpnPasses++;");
	}
);
L.buildLayers();
L.setCanvas(1400, 900);
L.applySaved(JSON.parse(fs.readFileSync(ROOT + 'dev/water-network-examples/Net3.lwn', 'utf8')));
L.buildDom();
L.fit();
L.noteMapSized();
// No solve may land in the middle of a count: a scheduled one is a timer that runs its own pass.
L.settings().autoRun = false;
const ls = L.labelSettings();
ls.node.id = true; ls.node.elev = true;
L.refreshLabelText();
const doc = L.getDoc();
const probeId = doc.nodes.filter(function (n) { return n.type === 'junction'; })[0].id;
function linesOf(id) { const h = L.nodeEls()[id]; return (h && h.lines) ? h.lines.length : -1; }

// The Settings box, assembled: the stub hands every host out as a loose element, and the page
// finds the one the user is working IN by asking whether the box contains it.
const box = byId.lpn_settings_box;
Object.keys(byId).forEach(function (id) {
	if (/^lpn_set_/.test(id) && byId[id] !== box) { box.appendChild(byId[id]); }
});
function controlsIn(root, tag) {
	const out = [];
	(function walk(e) { (e.children || []).forEach(function (c) { if (c.tagName === tag) { out.push(c); } walk(c); }); }(root));
	return out;
}
function fire(el, type) { (el._listeners[type] || []).slice().forEach(function (f) { f({ type: type, target: el }); }); }

async function main() {

// ---- 1. A BURST OF REQUESTS IS ONE PASS, AND NOT A SYNCHRONOUS ONE ---------------------------
console.log('--- a burst of requests in one task ---');
await sleep(20);
passes = 0;
for (let i = 0; i < 5; i++) { L.requestLabelRefresh(); }
ok(passes === 0, 'five requests run no pass while the task that made them is still running', passes + ' passes');
await sleep(30);
ok(passes === 1, 'and exactly one pass once it has finished', passes + ' passes');
await sleep(30);
ok(passes === 1, 'with no second pass behind it', passes + ' passes');

// A unit preset goes through EngCalcs.pageCalculator, one of the call sites converted.
passes = 0;
EngCalcs.pageCalculator();
L.requestLabelRefresh(); L.requestLabelRefresh();
ok(passes === 0, 'pageCalculator() plus two more requests: still nothing synchronous', passes + ' passes');
await sleep(30);
ok(passes === 1, 'and one pass for all three', passes + ' passes');

// ---- 2. A SYNCHRONOUS PASS PAYS THE DEBT ------------------------------------------------------
console.log('--- a synchronous pass answers every request made before it ---');
passes = 0;
L.requestLabelRefresh();
L.refreshLabelText();
await sleep(30);
ok(passes === 1, 'request then refreshLabelText(): one pass, not two', passes + ' passes');

// ---- 3. EVERY READER OF THE LAYOUT SEES THE SETTLED ONE ---------------------------------------
console.log('--- a reader right after a change sees the change ---');
const withElev = linesOf(probeId);
ls.node.elev = false;
passes = 0;
L.requestLabelRefresh();
ok(linesOf(probeId) === withElev, 'the request really is deferred: the label still has its old rows',
	linesOf(probeId) + ' rows');
const kept = L.captureLabelLayout();
ok(kept.nodes[probeId] && kept.nodes[probeId].lines.length === withElev - 1,
	'captureLabelLayout() (the tab-switch keep) keeps the layout WITHOUT the row just switched off',
	(kept.nodes[probeId] ? kept.nodes[probeId].lines.length : 'none') + ' rows, was ' + withElev);
ok(passes === 1, 'by running the owed pass first', passes + ' passes');
await sleep(30);
ok(passes === 1, 'and the owed pass does not run again afterwards', passes + ' passes');

ls.node.elev = true;
passes = 0;
L.requestLabelRefresh();
L.relayoutLabels(true);
ok(linesOf(probeId) === withElev, 'relayoutLabels() lays out the rows the change just brought back',
	linesOf(probeId) + ' rows');
await sleep(30);
ok(passes >= 1 && passes <= 2, 'the owed pass ran inside it, and nothing ran after', passes + ' passes');

ls.node.elev = false;
L.requestLabelRefresh();
global.window.dispatchEvent({ type: 'beforeprint' });
ok(linesOf(probeId) === withElev - 1, 'printing flushes the owed pass before the page is laid out for paper',
	linesOf(probeId) + ' rows');
ls.node.elev = true;
L.refreshLabelText();

// ---- 4. RECALCULATE OFF: ONE EDIT, ONE LABEL ---------------------------------------------------
console.log('--- an edit with nothing owed redraws only its own label ---');
await sleep(30);
passes = 0;
L.refreshOneLabelInPlace(doc.nodes.filter(function (n) { return n.id === probeId; })[0]);
await sleep(30);
ok(passes === 0, 'refreshOneLabelInPlace() runs no network-wide pass', passes + ' passes');

// ---- 5. THE QUALITY SELECT KEEPS ITS ELEMENT --------------------------------------------------
console.log('--- the Quality select, changed ---');
L.rebuildSettingsBox();
const qHost = byId.lpn_set_quality_fields;
const q = controlsIn(qHost, 'SELECT')[0];
ok(!!q, 'the Quality select is built');
q.focus();
passes = 0;
q.value = 'age';
fire(q, 'change');
ok(L.settings().quality && L.settings().quality.mode === 'age', 'the change was taken', L.settings().quality && L.settings().quality.mode);
ok(controlsIn(qHost, 'SELECT')[0] === q, 'the SAME select element is in the box after the box rebuilt');
ok(q.value === 'age', 'showing its new value', q.value);
ok(document.activeElement === q, 'and still holding the focus, so the next arrow key lands on it');
await sleep(30);
ok(passes === 0, 'with no quality field on the map, a quality change runs NO label pass', passes + ' passes');

q.value = 'trace';
fire(q, 'change');
const qs = controlsIn(qHost, 'SELECT');
ok(qs[0] === q && qs.length === 2, 'Source trace: the select is kept AND the Trace node row appears under it',
	qs.length + ' selects');

ls.node.quality = true;
passes = 0;
q.value = 'age';
fire(q, 'change');
ok(passes === 0, 'with a quality field on the map, nothing runs inside the handler', passes + ' passes');
await sleep(30);
ok(passes === 1, '...and one pass runs after it', passes + ' passes');
ls.node.quality = false;
L.refreshLabelText();

// ---- 6. A COLOURING SELECT, WHICH REBUILDS ITS OWN SECTION ------------------------------------
console.log('--- Color nodes by, changed ---');
const cHost = byId.lpn_set_colors_node;
const c = controlsIn(cHost, 'SELECT').filter(function (s) { return s.id === 'lpn_set_color_node'; })[0];
ok(!!c, 'the Color nodes by select is built');
const pick = c && controlsIn(c, 'OPTION').map(function (o) { return o.value; }).filter(Boolean)[0];
c.focus();
c.value = pick;
fire(c, 'change');
ok(L.settings().colorNodeField === pick, 'the change was taken', L.settings().colorNodeField);
ok(controlsIn(cHost, 'SELECT').indexOf(c) >= 0, 'the SAME select element is in the box after its section rebuilt');
ok(c.value === pick, 'showing its new value', c.value);
ok(document.activeElement === c, 'and still holding the focus');

// A select whose OPTIONS came back different is not kept: the copy is the truth then. Simulated by
// renaming one of the held element's options, which the rebuild does not reproduce.
const opts = controlsIn(c, 'OPTION');
opts[opts.length - 1].textContent = 'a choice that no longer exists';
c.value = '';
fire(c, 'change');
const now = controlsIn(cHost, 'SELECT').filter(function (s) { return s.id === 'lpn_set_color_node'; })[0];
ok(now && now !== c, 'a select whose choices changed is replaced by its fresh copy, not kept');
ok(document.activeElement === now, 'and the focus goes to that copy');

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures) { process.exit(1); }
}
main().catch(function (e) { console.error(e); process.exit(1); });

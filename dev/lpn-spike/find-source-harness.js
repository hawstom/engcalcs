// **THE SOURCE SCOPE IN FIND** (Tom, 2026-10-05: in EPANET a junction becomes a Source when a
// Source Quality is entered). Run with:
//
//   node dev/lpn-spike/find-source-harness.js
//
// A source is a node of ANY kind with a [SOURCES] entry, so the scope is virtual: not an element
// type, it holds the very nodes the Junction, Reservoir and Tank scopes hold, chosen by
// nodeSource() -- the question the solver and the [SOURCES] export ask. This file asserts the
// scope finds exactly the three sources (a junction, a tank and a reservoir) and not the plain
// junction, offers the three source properties there and nowhere else, narrows on source quality,
// selects the underlying nodes, and writes nothing.

'use strict';

const { ROOT, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

// The panel builds itself into these two, and the Replace preview writes its message into a box
// only buildReplaceForm() creates -- so the form is built for real rather than stubbed.
ensure('lpn_find_form');
ensure('lpn_find_results');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	// The query, driven through the state the three pull-downs write.
	"\t\tquery: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\t\tfindState.value = value === undefined ? '' : value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tpropKeys: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[0]; }); },\n" +
	"\t\tpropLabels: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[1]; }); },\n" +
	"\t\topKeys: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[0]; }); },\n" +
	// The write half.
	"\t\tbuildForm: rebuildFindForm,\n" +
	"\t\ttype: function (text) { findQueryInput.value = text;\n" +
	"\t\t\t(findQueryInput._listeners.input || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tpressFind: function () { runFind(); },\n" +
	"\t\tresults: function () { return findResults.map(function (c) { return c.group + ':' + c.el.id; }); },\n" +
	"\t\tsetReplace: function (prop, value) { replaceState.prop = prop; replaceState.value = value; },\n" +
	"\t\tspecFields: function () { return replaceSpecs().map(function (s) { return s.field; }); },\n" +
	"\t\tpreview: runReplacePreview, apply: applyReplace,\n" +
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
	"\t\tmessage: function () { return replaceMsgBox ? replaceMsgBox.textContent : null; },\n" +
	// Scenarios, for the base-owned assertion.
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tbaseId: function () { return baseScenario().id; },\n" +
	"\t\thasOverride: hasOverride,\n" +
	"\t\tselNow: function () { return selections.map(function (s) { return s.kind + ':' + s.id; }); },\n" +
	"\t\tselectResults: function () { selectAndZoomTo(findResults.map(function (c) { return { group: c.group, id: c.el.id }; })); },\n" +
	"\t\tclearSel: function () { setSelectionList([]); },\n" +
	"\t\tsetProp: setProp, scopeKeys: function () { return findScopeDefs().map(function (d) { return d.key; }); },\n" +
	"\t\topenPane: openPane, renderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tfilterQuery: function (id) { return paneFilterQuery(paneTableById(id)); },\n" +
	"\t\tsetFilter: function (id, q) { paneSetFilter(id, q); },\n" +
	"\t\tpressFilter: function () { var b = null;\n" +
	"\t\t\t(function walk(e) { if (e.id === 'lpn_find_filter_go') { b = e; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\tif (!b) { throw new Error('no filter button'); }\n" +
	"\t\t\t(b._listeners.click || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tresultsText: function () { var t = '';\n" +
	"\t\t\t(function walk(e) { t += (e.textContent || '') + ' '; (e.children || []).forEach(walk); })(document.getElementById('lpn_find_results'));\n" +
	"\t\t\treturn t; },\n" +
	"\t\tsetQuality: function (m) { settings.quality = { mode: m }; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

ensure('lpn_toolbar').querySelectorAll = () => [];
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function same(a, b) { return JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort()); }
function tagLines(text) {
	const out = [];
	let inTags = false;
	for (const raw of text.split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(raw);
		if (m) { inTags = m[1].toUpperCase() === 'TAGS'; continue; }
		if (inTags && raw.replace(/;.*$/, '').trim()) { out.push(raw.replace(/\s+$/, '')); }
	}
	return out;
}

const FIXTURE = [
	'[TITLE]', 'Source fixture', '',
	'[JUNCTIONS]',
	' J1\t100\t50\t;',
	' J2\t90\t25\t;',
	' J3\t90\t25\t;',
	'',
	'[RESERVOIRS]',
	' R1\t200\t;',
	'',
	'[TANKS]',
	' T1\t150\t10\t2\t20\t30\t0\t;',
	'',
	'[PIPES]',
	' P1\tR1\tJ1\t1000\t12\t100\t0\tOpen',
	' P2\tJ1\tJ2\t1000\t12\t100\t0\tOpen',
	' P3\tJ2\tJ3\t1000\t12\t100\t0\tOpen',
	' P4\tJ3\tT1\t1000\t12\t100\t0\tOpen',
	'',
	'[PATTERNS]',
	' PAT1\t1\t0.5',
	'',
	'[SOURCES]',
	' J2\tCONCEN\t1.5\tPAT1',
	' R1\tCONCEN\t0.8',
	' T1\tSETPOINT\t2.5',
	'',
	'[QUALITY]',
	' J1\t0',
	'',
	'[OPTIONS]',
	' Units\tGPM',
	' Headloss\tH-W',
	' Quality\tChlorine mg/L',
	'',
	'[COORDINATES]',
	' J1\t10\t10', ' J2\t20\t10', ' J3\t30\t10', ' R1\t0\t10', ' T1\t40\t10',
	'',
	'[END]', ''
].join('\n');
L.importInp({ name: 'src.inp', _text: FIXTURE });
function load2() { L.importInp({ name: 'src.inp', _text: FIXTURE }); }
function sortq(a) { return a.slice().sort(); }

head('1. THE SCOPE EXISTS IN FIND ONLY');
ok('Source is a Find scope', L.scopeKeys().indexOf('source') >= 0, JSON.stringify(L.scopeKeys()));
const html = require('fs').readFileSync(ROOT + 'js/looped-network.js', 'utf8');
ok('no Insert tool or toolbar entry names it', !/lpn_tool_add_source|add_source/.test(html));

head('2. IT FINDS EXACTLY THE THREE SOURCES');
ok('junction, tank and reservoir, not the plain junctions',
	same(L.query('source', 'id', 'contains', ''), ['node:J2', 'node:R1', 'node:T1']),
	JSON.stringify(L.query('source', 'id', 'contains', '')));
ok('Junction scope is unchanged (3 junctions)', same(L.query('junction', 'id', 'contains', ''), ['node:J1', 'node:J2', 'node:J3']));

head('3. ITS PROPERTIES');
const keys = L.propKeys('source');
ok('trimmed to what every node shares plus the three',
	keys.join(',') === 'id,desc,tag,elev,initQuality,sourceType,sourceQuality,sourcePattern,demandActual,head,pressure,quality,axis1,axis2',
	JSON.stringify(keys));
ok('no Connectivity, no junction-only or tank-only property',
	!keys.some(function (k) { return /connection|emitter|fireFlow|demandCategory|level|mixing|tankDiameter|^demand$/i.test(k); }));
['sourceType', 'sourceQuality', 'sourcePattern', 'id', 'elev'].forEach(function (k) {
	ok(k + ' offered under Source', keys.indexOf(k) >= 0, JSON.stringify(keys));
});
['junction', 'reservoir', 'tank', 'all', 'pipe'].forEach(function (s) {
	ok('source properties NOT offered under ' + s, !/source/i.test(L.propKeys(s).join(',')), JSON.stringify(L.propKeys(s)));
});
ok('Source quality takes number conditions', L.opKeys('source', 'sourceQuality').indexOf('gt') >= 0 && L.opKeys('source', 'sourceQuality').indexOf('contains') < 0, JSON.stringify(L.opKeys('source', 'sourceQuality')));

head('4. A CONDITION ON SOURCE QUALITY NARROWS');
ok('above 1 finds J2 and T1', same(L.query('source', 'sourceQuality', 'gt', '1'), ['node:J2', 'node:T1']),
	JSON.stringify(L.query('source', 'sourceQuality', 'gt', '1')));
ok('below 1 finds R1', same(L.query('source', 'sourceQuality', 'lt', '1'), ['node:R1']));
ok('equal to 2.5 finds T1', same(L.query('source', 'sourceQuality', 'equals', '2.5'), ['node:T1']));
ok('type contains SETPOINT finds T1', same(L.query('source', 'sourceType', 'equals', 'SETPOINT'), ['node:T1']),
	JSON.stringify(L.query('source', 'sourceType', 'equals', 'SETPOINT')));
ok('type CONCEN finds J2 and R1', same(L.query('source', 'sourceType', 'equals', 'CONCEN'), ['node:J2', 'node:R1']));
ok('pattern contains PAT finds J2 only', same(L.query('source', 'sourcePattern', 'contains', 'PAT'), ['node:J2']));
L.buildForm();
L.type('Junction.Source quality above 0');
L.pressFind();
ok('a typed Junction.Source quality is refused, not answered', L.results().length === 0);
L.type('Source.Source quality above 1');
L.pressFind();
ok('the typed query agrees', same(L.results(), ['node:J2', 'node:T1']), JSON.stringify(L.results()));
L.type("Source.Source type equal to 'MASS'");
L.pressFind();
ok('a typed query with no match is empty', L.results().length === 0, JSON.stringify(L.results()));

head('5. SELECTING THE RESULTS SELECTS THE NODES');
L.type('Source.Source quality above 1');
L.pressFind();
L.clearSel();
L.selectResults();
ok('J2 and T1 are selected on the map', same(L.selNow(), ['node:J2', 'node:T1']), JSON.stringify(L.selNow()));

head('6. A NODE LEAVES THE SCOPE WHEN ITS QUALITY IS BLANKED, AND A PLAIN ONE JOINS WHEN GIVEN ONE');
L.setProp(L.nodeById('J2'), 'sourceQuality', undefined);
L.setProp(L.nodeById('J3'), 'sourceQuality', 3);
ok('J2 out, J3 in', same(L.query('source', 'id', 'contains', ''), ['node:J3', 'node:R1', 'node:T1']),
	JSON.stringify(L.query('source', 'id', 'contains', '')));

head('7. REPLACE ON THE SCOPE WRITES THE UNDERLYING NODE, NO SOURCE FIELD');
L.query('source', 'id', 'contains', '');
L.buildForm();
ok('no replace spec writes source type, quality or pattern',
	!L.specFields().some(function (f) { return /^source/.test(f); }), JSON.stringify(L.specFields()));
ok('it does offer node properties', L.specFields().indexOf('desc') >= 0, JSON.stringify(L.specFields()));

head('8. FILTER IN TABLE UNDER SOURCE: node tables only, every other table untouched');
load2();
L.openPane('pipes'); L.openPane('junctions'); L.openPane('reservoirs'); L.openPane('tanks');
L.setFilter('pipes', "Pipe.ID contains 'P'");
const pipesBefore = L.tableOrder('pipes');
L.setFilter('junctions', "Junction.ID contains 'zzz'");
L.buildForm();
L.type('Source.Source quality above 1');
L.pressFilter();
ok('Junctions shows J2 only', same(L.tableOrder('junctions'), ['J2']), JSON.stringify(L.tableOrder('junctions')));
ok('Tanks shows T1', same(L.tableOrder('tanks'), ['T1']), JSON.stringify(L.tableOrder('tanks')));
ok('Reservoirs shows none (R1 is below 1)', L.tableOrder('reservoirs').length === 0, JSON.stringify(L.tableOrder('reservoirs')));
ok('the stale Junctions filter was replaced', /Source/.test(L.filterQuery('junctions')), L.filterQuery('junctions'));
ok('Pipes is untouched', L.filterQuery('pipes') === "Pipe.ID contains 'P'" && same(L.tableOrder('pipes'), pipesBefore));
L.type('Source.Source quality above 0');
L.pressFilter();
ok('Source quality above 0: J2 / R1 / T1 only in their tables ' + JSON.stringify([L.tableOrder('junctions'), L.tableOrder('reservoirs'), L.tableOrder('tanks')]),
	same(L.tableOrder('junctions'), ['J2']) && same(L.tableOrder('reservoirs'), ['R1']) && same(L.tableOrder('tanks'), ['T1']));
ok('Pipes still untouched after Source.ID', L.filterQuery('pipes') === "Pipe.ID contains 'P'" && same(L.tableOrder('pipes'), pipesBefore));
ok('Valves and Customers carry no filter', L.filterQuery('valves') === '' && L.filterQuery('customers') === '');

head('9. THE EMPTY RESULT SAYS WHY WHEN NO CHEMICAL IS TRACKED');
L.importInp({ name: 'plain.inp', _text: FIXTURE.replace(/\[SOURCES\][\s\S]*?\[QUALITY\]/, '[QUALITY]') });
L.setQuality('none');
L.buildForm();
L.type('Source.Elevation above 0');
L.pressFind();
ok('no sources and no chemical: the reason is given', L.resultsText().indexOf(EngCalcs.pageConfig.lpn_find_source_no_chemical) >= 0, L.resultsText());
L.setQuality('chemical');
L.buildForm();
L.type('Source.Elevation above 0');
L.pressFind();
ok('chemical tracked: just "Nothing matched"', L.resultsText().indexOf(EngCalcs.pageConfig.lpn_find_source_no_chemical) < 0, L.resultsText());

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

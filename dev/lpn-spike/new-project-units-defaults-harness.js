// A NEW PROJECT IN ANOTHER UNIT SET MUST STILL DRAW NUMERIC THINGS. Run with:
//   node dev/lpn-spike/new-project-units-defaults-harness.js
//
// The defect (2026-10-06, found by the pre-reviewer): File > New project with SI units, then
// Import surveyed points > Create nodes threw `toFixed` of null and the report never opened.
// R-342's resetUnitBearingDefaultsFor() set the unit-bearing `settings.defaults` entries to null
// for a changed unit and nothing refilled them (only init() and Restore defaults call
// seedDefaultInputs()), so every junction, pipe and tank born after carried a null.
//
// For every direction (US to SI, SI to US, SI to SI, XY and geographic) this makes the project
// through the wizard's own createProjectFrom(), imports a small PNEZD file through the real
// dialog, draws a junction, a tank, a reservoir and a pipe, and asserts: nothing throws, the
// import box opened, and every new asset carries a finite number for each default it takes.

'use strict';
const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-survey.js');
const PC = global.EngCalcs.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (!cond && extra !== undefined ? '  -- ' + extra : ''));
}
const num = (v) => typeof v === 'number' && isFinite(v);

const L = loadLoopedNetwork(
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tland: landSurveyText,\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tcreateProjectFrom: createProjectFrom,\n" +
	"\t\tunitKey: unitKey,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tsvg.clientWidth = 900; svg.clientHeight = 600;\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tGEO: LPN_COORDS_GEO\n"
);
byId.lpn_toolbar.querySelectorAll = () => [];
let alerts = [];
global.window.alert = global.alert = function (m) { alerts.push(String(m)); };

function boxButtons() { return byId.lpn_dialog_buttons.children || []; }
function press(label) {
	const btn = boxButtons().find(b => b.textContent === label);
	if (!btn) { throw new Error('no button: ' + label + ' of ' + boxButtons().map(b => b.textContent)); }
	(btn._listeners.click || []).forEach(f => f());
}
function clearBox() { byId.lpn_dialog_body.children.length = 0; byId.lpn_dialog_buttons.children.length = 0; }

const CSV_XY = 'P,N,E,Z,D\nA,1000,2000,10,x\nB,1010,2000,11,y\nC,1010,2030,12,z\n';
const CSV_GEO = 'P,N,E,Z,D\nA,33.5000,-111.8000,10,x\nB,33.5010,-111.8000,11,y\nC,33.5010,-111.7990,12,z\n';

function unitsOf(set) {
	setUnitSet(set);
	const u = {};
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow',
		'lpn_u_velocity', 'lpn_u_gradient', 'lpn_u_roughness', 'lpn_u_age'].forEach(n => { u[n] = L.unitKey(n); });
	return u;
}

function run(from, to, geo) {
	const label = from + ' -> ' + to + (geo ? ' geographic' : ' XY');
	console.log('== ' + label + ' ==');
	const target = unitsOf(to);
	setUnitSet(from);
	L.buildLayers();
	alerts = []; clearBox();
	let err = null;
	try {
		L.createProjectFrom({ geo: geo, crs: '', place: null, method: 'hw', units: target });
		// createProjectFrom may have left the strip on `to`; the page does the same.
		const d = L.getSettings().defaults;
		['nodeElev', 'demand', 'diameter', 'roughness', 'k', 'tankLevel', 'tankMinLevel', 'tankMaxLevel', 'tankDiameter']
			.forEach(k => ok('settings.defaults.' + k + ' is a number', num(d[k]), String(d[k])));
		L.land(geo ? CSV_GEO : CSV_XY, 'p.csv');
		ok('the import box opened', boxButtons().length > 0);
		press(PC.lpn_survey_create);
		const doc = L.getDoc();
		ok('three junctions arrived', doc.nodes.length === 3, String(doc.nodes.length));
		const j = L.addNode('junction', geo ? -111.7 : 2100, geo ? 33.51 : 1100);
		const t = L.addNode('tank', geo ? -111.71 : 2200, geo ? 33.52 : 1200);
		const r = L.addNode('reservoir', geo ? -111.72 : 2300, geo ? 33.53 : 1300);
		const nodes = doc.nodes.slice();
		nodes.forEach(n => ok('node ' + n.id + ' elev is a number', num(n.elev), String(n.elev)));
		doc.nodes.filter(n => n.type === 'junction').forEach(n =>
			ok('junction ' + n.id + ' demand is a number', num(n._demand), String(n._demand)));
		doc.nodes.filter(n => n.type === 'tank').forEach(n => ['_level', 'minLevel', 'maxLevel', 'tankDiameter'].forEach(k =>
			ok('tank ' + n.id + ' ' + k + ' is a number', num(n[k]), String(n[k]))));
		const a = doc.nodes[0].id, b = doc.nodes[1].id;
		const p = L.addLink('pipe', a, b);
		const l = doc.links.find(x => x.id === (p && p.id ? p.id : p)) || doc.links[doc.links.length - 1];
		['_diameter', '_roughness', '_length', '_k'].forEach(k =>
			ok('pipe ' + k + ' is a number', num(l[k]), String(l[k])));
	} catch (e) { err = e; }
	ok('nothing threw', !err, err && (err.stack || String(err)).split('\n').slice(0, 3).join(' | '));
}

[['us', 'si'], ['si', 'us'], ['si', 'si'], ['us', 'us']].forEach(function (p) {
	run(p[0], p[1], false);
	run(p[0], p[1], true);
});

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);

// A VALVE STATED OPEN STAYS FIXED OPEN ON THE WARM EPANET PATH (EPS audit 3, 2026-11-20). Run with:
//   node dev/lpn-spike/eps-audit-warm-harness.js
//
// valves3.inp states a PRV, PSV, FCV, TCV (minor loss 2) and PBV Open in [STATUS]; EPANET then unsets their settings, so none of them
// regulates (input3.c; hydcoeffs.c tcvcoeff(), prvcoeff()...). The page's first solve builds the session cold from the .inp text, which says so.
// Editing a demand keeps the session (same signature) and pushValues() rewrites every valve's status and setting; if it writes the
// setting of a fixed-open valve, it starts regulating again. So: cold solve, edit a demand, warm solve, each compared with the built-in
// steady solver on the same model.
'use strict';
const fs = require('fs'), path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
global.alert = global.window.alert = function () { };
require(ROOT + 'js/lpn-net.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const L = loadLoopedNetwork(EXAMPLE_EXPORTS + "\t\tcurrentModel: function () { return assembleModel(); },\n\t\timportInp: importInpFromFile,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n");
L.buildLayers();
const EC = global.EngCalcs;
let fails = 0;
function ok(name, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); if (!cond) { fails++; } }
function worst(a, b, ids) { let w = 0; ids.forEach((id) => { w = Math.max(w, Math.abs(a[id] - b[id])); }); return w; }
(async function () {
	setUnitSet('us');
	await warmEpanet();
	L.importInp({ name: 'valves3.inp', _text: fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/fixtures/eps-audit/valves3.inp'), 'utf8') });
	EC.lpnTimeArrived();
	const model = L.currentModel();
	model.time = null;
	const fixed = model.links.filter((l) => l.type === 'valve' && l.valveFixed === 'open').map((l) => l.valveType).sort().join(',');
	ok('the model carries four fixed-open valves (PBV, PRV, PSV and FCV) and a TCV', fixed === 'FCV,PBV,PRV,PSV,TCV', fixed);
	const nodes = model.nodes.map((n) => n.id), links = model.links.map((l) => l.id);
	async function one(label, m) {
		const e = await EC.lpnSolveEpanet(JSON.parse(JSON.stringify(m)), {}), n = EC.lpnSolve(JSON.parse(JSON.stringify(m)), {});
		const dh = worst(e.heads, n.heads, nodes), dq = worst(e.flows, n.flows, links);
		ok(label + ': EPANET and the built-in solver agree (heads, flows)', e.ok && n.ok && dh < 1e-3 && dq < 2e-6, 'dH ' + dh.toExponential(1) + ' m, dQ ' + dq.toExponential(1) + ' m3/s');
	}
	await one('cold solve', model);
	const m2 = JSON.parse(JSON.stringify(model));
	m2.nodes.filter((n) => n.type === 'junction').forEach((n) => { n.demand = (n.demand || 0) * 1.4 + 0.0003; });
	await one('after a demand edit, on the warm session', m2);
	const m3 = JSON.parse(JSON.stringify(m2));
	m3.links.forEach((l) => { if (l.type === 'valve' && l.valveType === 'TCV') { l.k = 5; } });
	await one('after the TCV minor loss is edited, on the warm session', m3);
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

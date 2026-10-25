// Headless check of MORPH, Junction into Vertex (Tom, 2026-10-24: "It would be nice to be able to
// Morph a Junction into a vertex."). Run with:
//   node dev/lpn-spike/morph-vertex-harness.js
//
// On Net1, through the page's own chain:
//   1. A zero-demand junction made by splitting pipe 10, then Morph > Vertex: the two halves are one
//      pipe again (the first half's ID), the junction is gone, its place is a vertex, the typed
//      lengths are added back, and both engines give Net1's heads again.
//   2. One Undo brings the junction and both pipes back, byte for byte.
//   3. Refusals, by name and in plain words, nothing changed: a junction with demand, one that joins
//      three pipes, one at the end of a pump, a reservoir.
//   4. A Customer attached to the second half by station stays where it was drawn.
//   5. A scenario other than Base refuses, by name.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-rules.js');
require(ROOT + 'js/lpn-epanet.js');
const fs = require('fs');
const path = require('path');
const solver = require(ROOT + 'js/lpn-solver.js');
global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const NET1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
const INJECT =
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tserializeProject: serializeProject, undo: undo, redo: redo, assembleModel: assembleModel,\n" +
	"\t\tsetSelectionList: setSelectionList, nodeById: nodeById, linkById: linkById, importInp: importInpFromFile,\n" +
	"\t\tlastNotice: function () { return lastNoticeText; }, breakPipeAtPoint: breakPipeAtPoint,\n" +
	"\t\tmorphVertex: morphJunctionsToVertices, addCustomer: addCustomer, morphRows: changeTypeRows, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
function page() {
	const L = loadLoopedNetwork(INJECT, null, null);
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.getSettings().engine = 'native';
	L.importInp({ name: 'Net1.inp', _text: NET1 });
	return L;
}
const heads = (L) => { const r = solver.lpnSolve(L.assembleModel(), { tol: 1e-10 }); return r && r.converged ? r.heads : null; };
function worst(a, b) {
	if (!a || !b) { return Infinity; }
	let w = 0;
	Object.keys(a).forEach((k) => { w = (b[k] === undefined) ? Infinity : Math.max(w, Math.abs(a[k] - b[k])); });
	return w;
}
const sel = (L, ids) => L.setSelectionList(ids.map((id) => ({ kind: 'node', id })));

(async function main() {
	const PC = global.EngCalcs.pageConfig;
	let L = page();
	const base0 = heads(L);
	ok('0.1 Net1 solves', !!base0);
	const file0 = JSON.stringify(L.serializeProject());
	const p10 = L.linkById('10'), a = L.nodeById(p10.from), b = L.nodeById(p10.to);
	const len10 = p10._length;

	console.log('--- 1. a junction mid-pipe becomes a vertex ---');
	const made = L.breakPipeAtPoint(p10, 'junction', (a.x + b.x) / 2, (a.y + b.y) / 2);
	const J = made.node.id, half1 = made.original.id, half2 = made.added.id;
	const split = JSON.stringify(L.serializeProject());
	ok('1.1 the split made a junction and a second pipe', L.getDoc().links.length === 14 && !!L.nodeById(J));
	ok('1.2 Morph has a Vertex row, last, enabled with the junction selected', (sel(L, [J]), L.morphRows().slice(-1)[0].label === 'Vertex' && !L.morphRows().slice(-1)[0].disabled));
	sel(L, ['11']);
	ok('1.3 ...and enabled for any junction in the selection', !L.morphRows().slice(-1)[0].disabled);
	sel(L, []);
	ok('1.4 ...disabled with nothing selected', L.morphRows().slice(-1)[0].disabled === true);
	sel(L, [J]);
	const n = L.morphVertex();
	ok('2.0 one junction morphed', n === 1, String(n));
	ok('2.1 the junction is gone, one pipe fewer', !L.nodeById(J) && L.getDoc().links.length === 13);
	const S = L.linkById(half1);
	ok('2.2 the first half survives with the original ID and ends', !!S && !L.linkById(half2) && S.from === p10.from && S.to === b.id, JSON.stringify([S && S.from, S && S.to]));
	ok('2.3 the junction\'s place is now its one vertex', S.verts.length === 1 && Math.abs(S.verts[0].x - (a.x + b.x) / 2) < 1e-9 && Math.abs(S.verts[0].y - (a.y + b.y) / 2) < 1e-9, JSON.stringify(S.verts));
	ok('2.4 the typed length is the two halves added: back to the original', Math.abs(S._length - len10) < 1e-9, S._length + ' vs ' + len10);
	ok('2.5 the answer is Net1\'s again, to 1e-9', worst(base0, heads(L)) < 1e-9, String(worst(base0, heads(L))));
	ok('2.6 the notice says what happened', L.lastNotice() === PC.lpn_morph_vertex_done.replace('{n}', '1'), L.lastNotice());
	L.undo();
	ok('2.7 one Undo brings back the junction and both halves, byte for byte', JSON.stringify(L.serializeProject()) === split);
	L.redo();
	ok('2.8 Redo morphs again', !L.nodeById(J) && !!L.linkById(half1) && !L.linkById(half2));
	L.undo();

	console.log('\n--- 3. refusals, by name ---');
	// The sentence expected is the page's own, with the junction's ID (and a count) put in.
	const refuse = (id, key, n, label) => {
		sel(L, [id]);
		const before = JSON.stringify(L.serializeProject());
		const done = L.morphVertex();
		const want = PC[key].replace('{id}', id).replace('{n}', String(n));
		ok(label, done === 0 && L.lastNotice() === want && JSON.stringify(L.serializeProject()) === before, L.lastNotice());
	};
	refuse('11', 'lpn_morph_vertex_links', 3, '3.1 Net1 junction 11 (demand, several pipes) is refused by ID');
	refuse('10', 'lpn_morph_vertex_kind', '', '3.2 junction 10 (a pump on it) is refused by ID');
	refuse('9', 'lpn_morph_vertex_type', '', '3.3 reservoir 9 is refused: only a junction');
	// A junction on a three-pipe tee with no demand: 3 pipes.
	const T = L.nodeById('21');
	T._demand = 0; (T.extraDemands = []); T.demandCategory = '';
	refuse('21', 'lpn_morph_vertex_links', 3, '3.4 a junction of three or more pipes is refused with the count');
	// Demand on a two-pipe junction.
	sel(L, [J]);
	L.nodeById(J)._demand = 5;
	refuse(J, 'lpn_morph_vertex_demand', '', '3.5 a two-pipe junction with demand is refused');
	L.nodeById(J)._demand = 0;
	// Customers connected to the junction.
	L.getDoc().customers = [{ id: 'M1', demand: 1, count: 1, node: J, x: 0, y: 0 }];
	refuse(J, 'lpn_morph_vertex_customers', '', '3.6 a junction with a Customer connected to it is refused');
	L.getDoc().customers = [];

	// A simple merge only (Tom, 2026-10-24): different pipes, or data on the junction, are refused.
	const pipeB = L.linkById(half2), dWas = pipeB._diameter;
	pipeB._diameter = dWas + 2;
	refuse(J, 'lpn_morph_vertex_pipes', '', '3.7 two pipes of different diameter are refused');
	pipeB._diameter = dWas;
	const rWas = pipeB._roughness;
	pipeB._roughness = rWas + 10;
	refuse(J, 'lpn_morph_vertex_pipes', '', '3.8 two pipes of different roughness are refused');
	pipeB._roughness = rWas;
	[['elev', 12.5, 'its own elevation'], ['tag', 'zoneA', 'a tag'], ['desc', 'hydrant tee', 'a description'], ['_initQuality', 0.4, 'an initial quality']].forEach((f) => {
		const was = L.nodeById(J)[f[0]];
		L.nodeById(J)[f[0]] = f[1];
		refuse(J, 'lpn_morph_vertex_own', '', '3.9 a junction with ' + f[2] + ' is refused');
		if (was === undefined) { delete L.nodeById(J)[f[0]]; } else { L.nodeById(J)[f[0]] = was; }
	});
	sel(L, [J]);
	ok('3.10 with those put back it morphs again (and is undone)', L.morphVertex() === 1 && (L.undo(), true));

	console.log('\n--- 4. a Customer on the second half keeps its place ---');
	const h2 = L.linkById(half2), mid2 = { x: (L.nodeById(h2.from).x + L.nodeById(h2.to).x) / 2, y: (L.nodeById(h2.from).y + L.nodeById(h2.to).y) / 2 };
	L.addCustomer(mid2.x, mid2.y + 5, { link: half2, t: 0.5 });
	sel(L, [J]);
	const done = L.morphVertex();
	const c = L.getDoc().customers[0];
	ok('4.1 morphed', done === 1);
	ok('4.2 the Customer is on the surviving pipe, its station restated (0.5 along half 2 is 0.75 along the whole)', c.link === half1 && Math.abs(c.t - 0.75) < 0.02, JSON.stringify(c));
	L.undo();
	L.getDoc().customers = [];

	console.log('\n--- 4b. the first pipe points away from the junction ---');
	const f1 = L.linkById(half1), fromWas = f1.from;
	f1.from = J; f1.to = fromWas;   // the first half drawn the other way round
	const flipped = heads(L);
	sel(L, [J]);
	ok('4b.1 morphed', L.morphVertex() === 1);
	const R = L.linkById(half1);
	ok('4b.2 the merged pipe runs from the far end of the second half to the first half\'s far end, one vertex',
		R.from === b.id && R.to === fromWas && R.verts.length === 1, JSON.stringify([R.from, R.to, R.verts.length]));
	ok('4b.3 the answer is what the flipped split gave', worst(base0, heads(L)) < 1e-9 || worst(base0, heads(L)) - worst(base0, flipped) < 1e-9, 'merged vs Net1 ' + worst(base0, heads(L)) + ', flipped split vs Net1 ' + worst(base0, flipped));
	L.undo();

	console.log('\n--- 5. a scenario other than Base refuses ---');
	const sc = L.createScenario('Check');
	L.switchScenario(sc.id);
	sel(L, [J]);
	const bf = JSON.stringify(L.serializeProject());
	const dn = L.morphVertex();
	ok('5.1 refused in the scenario, by sentence', dn === 0 && L.lastNotice() === PC.lpn_morph_vertex_base, L.lastNotice());
	ok('5.2 ...and nothing changed', JSON.stringify(L.serializeProject()) === bf);
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });

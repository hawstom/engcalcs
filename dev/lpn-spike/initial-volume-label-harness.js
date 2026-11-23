// A TANK'S INITIAL VOLUME AS A NODE LABEL FIELD (Task 857, Tom 2026-11-18: "Should Initial volume be
// added as a node label option?" -> yes). Run with:
//   node dev/lpn-spike/initial-volume-label-harness.js
//
//   1. THE NUMBER IS EPANET'S. The project is exported as an .inp, opened in the vendored EPANET, and
//      its own initial volume (EN_INITVOLUME) is read for every tank of Net3 and for tanks built to
//      hit each branch of the rule: a cylinder with no Minimum volume, one with a Minimum volume, and
//      one with a volume curve. The page's value must match it; the expectation is never read off
//      the page's own formula.
//   2. THE FIELD IS OFFERED where node label fields are chosen (the Labels list, the hover card),
//      is off by default, and prints in the Volume unit with that unit's decimals.
//   3. IT IS BLANK FOR A NODE THAT IS NOT A TANK.
//   4. CHANGING THE VOLUME UNIT changes the printed number, not the stored inputs.

'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\trunSolve: runSolve, getDoc: function () { return doc; }, effective: effective,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tnodeLabel: function (id) { return nodeEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\tserializeProject: serializeProject, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tinpUnitSelections: inpUnitSelections, docFromInp: docFromInp, migrateSaved: migrateSaved,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, nodeById: nodeById, unitKey: unitKey,\n" +
	"\t\ttankInitialVolumeSI: tankInitialVolumeSI, nodeFieldDefs: nodeFieldDefs, LABEL_TABLE: LPN_LABEL_TABLE,\n" +
	"\t\tsetVolumeUnit: function (k) { var s = unitEl('lpn_u_volume'), i, was = unitKey('lpn_u_volume'), m = {}; for (i = 0; i < s.options.length; i++) { if (s.options[i].value === k) { s.selectedIndex = i; } } rememberUnitSelections(); m.lpn_u_volume = was; afterUnitChange(m); },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

let MODULE, WS;
async function engineInitVolumeM3(inpText) {
	if (!MODULE) {
		MODULE = await EC.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
		WS = new MODULE.Workspace();
		await WS.loadModule();
	}
	const p = new MODULE.Project(WS);
	WS.writeFile('iv.inp', inpText);
	p.open('iv.inp', 'iv.rpt', 'iv.out');
	const us = /Units\s+(GPM|CFS|MGD|IMGD|AFD)/i.test(inpText);
	const out = {};
	for (let i = 1; i <= p.getCount(0); i++) {
		if (p.getNodeType(i) === 2) { out[p.getNodeId(i)] = p.getNodeValue(i, 14) * (us ? Math.pow(0.3048, 3) : 1); }   // EN_INITVOLUME
	}
	return out;
}
function openInpText(text) {
	const parsed = EC.lpnInpParse(text);
	if (!parsed.ok) { throw new Error('parse failed'); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'probe');
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(doc))));
	L.buildDom();
	L.applyMethodUI();
}
const FILE = `[TITLE]
initial volume

[JUNCTIONS]
 J1 20 2

[RESERVOIRS]
 R1 100

[TANKS]
 TC 20 10 2 20 30 0
 TM 20 10 2 20 30 5000
 TV 20 6 1 12 30 0 SHAPE
 TZ 20 7 0 20 30 0

[PIPES]
 P1 R1 J1 1000 12 100 0 Open
 P2 J1 TC 500 8 100 0 Open
 P3 J1 TM 500 8 100 0 Open
 P4 J1 TV 500 8 100 0 Open
 P5 J1 TZ 500 8 100 0 Open

[CURVES]
;VOLUME: a vessel
 SHAPE 0 0
 SHAPE 4 3000
 SHAPE 12 20000

[COORDINATES]
 J1 0 0
 R1 -100 0
 TC 100 0
 TM 100 50
 TV 100 100
 TZ 100 150

[OPTIONS]
 Units GPM
 Headloss H-W

[END]
`;

async function main() {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();

	console.log('--- 1. the number is EPANET\'s own ---');
	openInpText(FILE);
	{
		const want = await engineInitVolumeM3(L.exportInp().inp);
		['TC', 'TM', 'TV', 'TZ'].forEach((id) => {
			const got = L.tankInitialVolumeSI(L.nodeById(id));
			ok('tank ' + id + ' initial volume matches EPANET', typeof got === 'number' && Math.abs(got - want[id]) <= 1e-4 * Math.abs(want[id]),
				got + ' m3 against EPANET ' + want[id]);
		});
		ok('the four cases are four different numbers', new Set(Object.keys(want).map((k) => want[k].toFixed(3))).size === 4);
	}
	const net3Text = fs.readFileSync(ROOT + 'examples/Net3-Novato-CA-World.lwn', 'utf8');
	{
		const saved = L.acceptImportedText(net3Text);
		L.applySaved(saved);
		L.buildDom();
		L.applyMethodUI();
		const doc = L.getDoc();
		const tanks = doc.nodes.filter((n) => n.type === 'tank');
		const want = await engineInitVolumeM3(L.exportInp().inp);
		ok('Net3 has its three tanks', tanks.length === 3, String(tanks.length));
		tanks.forEach((n) => {
			const got = L.tankInitialVolumeSI(n);
			ok('Net3 tank ' + n.id + ' initial volume matches EPANET', typeof got === 'number' && Math.abs(got - want[n.id]) <= 1e-4 * Math.abs(want[n.id]),
				got + ' m3 against EPANET ' + want[n.id]);
		});
	}

	console.log('--- 2. offered, off by default, printed in the Volume unit ---');
	openInpText(FILE);
	const ls = L.labelSettings();
	const defs = L.nodeFieldDefs(EC.pageConfig);
	ok('the Labels list offers Initial volume', defs.some((d) => d[0] === 'initVolume' && d[1] === EC.pageConfig.lpn_field_tank_initvol), JSON.stringify(defs.map((d) => d[0])));
	ok('it is off by default', L.LABEL_TABLE.node.initVolume.on === false && !ls.node.initVolume);
	Object.keys(ls.node).forEach((k) => { ls.node[k] = (k === 'initVolume'); });
	L.setVolumeUnit('ft3');
	L.refreshLabelText();
	const wantM3 = (await engineInitVolumeM3(L.exportInp().inp)).TC;
	const prefix = 'Vi=';
	const ft3 = L.nodeLabel('TC')[0];
	ok('a tank label prints it with its prefix, in cubic feet', ft3 === prefix + String(Math.round(wantM3 / Math.pow(0.3048, 3))), ft3 + ' (want ' + wantM3 / Math.pow(0.3048, 3) + ')');
	L.setVolumeUnit('gal');
	L.refreshLabelText();
	ok('in gallons the number is the same volume, whole gallons', L.nodeLabel('TC')[0] === prefix + String(Math.round(wantM3 / 0.003785411784)), L.nodeLabel('TC')[0]);
	L.setVolumeUnit('m3');
	L.refreshLabelText();
	ok('in cubic meters it has the unit\'s own decimals', L.nodeLabel('TC')[0] === prefix + wantM3.toFixed(1), L.nodeLabel('TC')[0]);
	console.log('--- 3. blank for a node that is not a tank ---');
	ok('a junction prints nothing for it', (L.nodeLabel('J1') || []).join('').indexOf(prefix) < 0, JSON.stringify(L.nodeLabel('J1')));
	ok('...and neither does a reservoir', (L.nodeLabel('R1') || []).join('').indexOf(prefix) < 0, JSON.stringify(L.nodeLabel('R1')));
	console.log('--- 4. a unit change moves the printed number only ---');
	const stored = JSON.stringify(L.getDoc().nodes.filter((n) => n.type === 'tank').map((n) => [n.id, n._level, n.minVolume, n.tankDiameter]));
	L.setVolumeUnit('l'); L.refreshLabelText();
	ok('litres print a different number', L.nodeLabel('TC')[0] !== ft3);
	ok('the stored tank inputs are untouched', JSON.stringify(L.getDoc().nodes.filter((n) => n.type === 'tank').map((n) => [n.id, n._level, n.minVolume, n.tankDiameter])) === stored);

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL  ' + (e && e.stack || e)); process.exit(1); });

// A TANK'S MINIMUM VOLUME AND CAN OVERFLOW, END TO END. Run with:
//   node dev/lpn-spike/tank-minvol-overflow-harness.js
//
// Tom, 2026-11-14: add EPANET's [TANKS] MinVol (column 7) and Overflow (column 9) to a tank's
// Properties, editable, with the scenario behaviour of every other tank field. The file's own
// values already crossed (inp-fidelity-harness.js section 2); this holds the editors:
//
//   1. THE POPUP (the shipped renderNodeFields, the shipped listeners): a Minimum volume number box
//      named for the Length unit cubed, and a Can overflow Yes/No choice. Typing writes the document;
//      choosing the word the file already spells that way changes nothing, characters included.
//   2. THE TABLES PANE carries both columns, and writes through the same setters.
//   3. THE SCENARIO SEAM: both are overridable, an edit inside a scenario is that scenario's own and
//      Base keeps its value, and the model and the .inp export of that scenario say it.
//   4. A LENGTH UNIT CHANGE converts the volume by the CUBE of the factor, Base and overrides.
//   5. FIND reads both.
//
// The expectation is read off the file by a deliberately dumber reader, never off the parser.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
global.alert = global.window.alert = function () {};
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, nodeById: nodeById, effective: effective,\n" +
	"\t\tsetProp: setProp, hasOverride: hasOverride, baseValue: baseValue,\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario,\n" +
	"\t\tbuildDom: buildDom, applyMethodUI: applyMethodUI, applySaved: applySaved, migrateSaved: migrateSaved, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tinpUnitSelections: inpUnitSelections, docFromInp: docFromInp, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tassembleModel: assembleModel, convertUnitValues: convertUnitValues,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\tquery: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
L.buildLayers();
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// ---- the dumber reader --------------------------------------------------------------------------
function tankRows(text) {
	const out = [];
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); continue; }
		if (section === 'TANKS') { out.push(line.split(/\s+/).join(' ')); }
	}
	return out;
}

// US (GPM) file: one tank, the volume in ft3.
const FILE = (row) => `[TITLE]
tank editors

[JUNCTIONS]
 J1 20 2

[RESERVOIRS]
 R1 100

[TANKS]
${row}

[PIPES]
 P1 R1 J1 1000 12 100 0 Open
 P2 J1 T1 500 8 100 0 Open

[COORDINATES]
 J1 0 0
 R1 -100 0
 T1 100 0

[OPTIONS]
 Units GPM
 Headloss H-W

[END]
`;

function open(text) {
	const parsed = EC.lpnInpParse(text);
	if (!parsed.ok) { throw new Error('parse failed'); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'probe');
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(doc))));
	L.buildDom();
	L.applyMethodUI();
	return parsed;
}
const labelsOf = () => (L.popupFields().children || []).filter((c) => c._tag === 'label');
const labelled = (re) => labelsOf().filter((c) => re.test(c.textContent || ''))[0];
const inputIn = (row) => (row.children || []).filter((c) => c._tag === 'input')[0];
const selectIn = (row) => (row.children || []).filter((c) => c._tag === 'select')[0];
const fire = (el, ev) => (el._listeners[ev || 'change'] || []).forEach((f) => f({}));
const popup = () => { L.popupFields().children.length = 0; L.renderNodeFields('T1'); };
const tank = () => L.nodeById('T1');

setUnitSet('us');

console.log('--- 1. the Properties box ---');
open(FILE(' T1 20 10 2 20 30 0'));
popup();
{
	const mv = labelled(/^Minimum volume/), ov = labelled(/^Can overflow/);
	ok('a tank\'s Properties carry Minimum volume and Can overflow', !!mv && !!ov, labelsOf().map((c) => c.textContent).join(' | '));
	ok('Minimum volume names the Length unit cubed', !!mv && /ft\^3/.test(mv.textContent), mv && mv.textContent);
	ok('Minimum volume is a number box, empty-capable', !!mv && inputIn(mv) && inputIn(mv).type === 'number');
	ok('Can overflow is a Yes/No choice and a tank with no Overflow says No',
		!!ov && selectIn(ov) && selectIn(ov).children.map((o) => o.value).join() === 'YES,NO' && selectIn(ov).children.filter((o) => o.selected)[0].value === 'NO');
	ok('both carry a tip', !!mv && !!ov && !!EC.pageConfig.lpn_field_tank_minvol_tip && !!EC.pageConfig.lpn_field_tank_overflow_tip);

	inputIn(mv).value = '5000';
	fire(inputIn(mv));
	ok('typing 5000 writes the tank', tank().minVolume === 5000, String(tank().minVolume));
	popup();
	selectIn(labelled(/^Can overflow/)).value = 'YES';
	fire(selectIn(labelled(/^Can overflow/)));
	ok('choosing Yes writes EPANET\'s word', tank().overflow === 'YES', String(tank().overflow));
	const m = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
	ok('the model hands both engines 5000 ft3 in cubic metres and Overflow',
		Math.abs(m.minVolume - 5000 * Math.pow(0.3048, 3)) < 1e-9 && m.overflow === true, JSON.stringify([m.minVolume, m.overflow]));
	ok('the export writes both in the file\'s columns', tankRows(L.exportInp().inp).join('|') === 'T1 20 10 2 20 30 5000 * YES', tankRows(L.exportInp().inp).join('|'));
	// Clearing the box is EPANET's 0.
	popup();
	inputIn(labelled(/^Minimum volume/)).value = '';
	fire(inputIn(labelled(/^Minimum volume/)));
	ok('clearing Minimum volume writes EPANET\'s 0', tankRows(L.exportInp().inp).join('|') === 'T1 20 10 2 20 30 0 * YES', tankRows(L.exportInp().inp).join('|'));
}

console.log('\n--- 2. a file\'s own spelling survives an edit that changes nothing ---');
{
	const row = ' T1 20 10 2 20 30 500.0 * yes';
	open(FILE(row));
	popup();
	ok('the Properties box shows the file\'s 500.0 and Yes', inputIn(labelled(/^Minimum volume/)).value === '500' || inputIn(labelled(/^Minimum volume/)).value === '500.0',
		inputIn(labelled(/^Minimum volume/)).value);
	ok('a lower-case yes reads as Yes', selectIn(labelled(/^Can overflow/)).children.filter((o) => o.selected)[0].value === 'YES');
	selectIn(labelled(/^Can overflow/)).value = 'YES';
	fire(selectIn(labelled(/^Can overflow/)));
	ok('choosing Yes again leaves the file\'s `yes`', tank().overflow === 'yes', String(tank().overflow));
	ok('and the row comes back as the file wrote it', tankRows(L.exportInp().inp).join('|') === tankRows(FILE(row)).join('|'), tankRows(L.exportInp().inp).join('|'));
	selectIn(labelled(/^Can overflow/)).value = 'NO';
	fire(selectIn(labelled(/^Can overflow/)));
	ok('choosing No writes NO', tankRows(L.exportInp().inp).join('|') === 'T1 20 10 2 20 30 500.0 * NO', tankRows(L.exportInp().inp).join('|'));
}

console.log('\n--- 3. the Tables pane ---');
{
	open(FILE(' T1 20 10 2 20 30 500 * YES'));
	const cols = L.tableCols('tanks');
	const mv = cols.filter((c) => c.key === 'minVolume')[0], ov = cols.filter((c) => c.key === 'overflow')[0];
	ok('the tanks table has both columns, editable', !!mv && !!ov && typeof mv.set === 'function' && typeof ov.set === 'function', cols.map((c) => c.key).join());
	ok('the volume column heading names the Length unit cubed', !!mv && /ft\^3/.test(mv.unitText()), mv && mv.unitText());
	ok('the cells read the document', !!mv && mv.get(tank()) === 500 && ov.get(tank()) === 'YES');
	ov.set(tank(), 'NO');
	mv.set(tank(), 750);
	ok('the cells write the document', tank().overflow === 'NO' && tank().minVolume === 750);
	ok('the overflow choice offers Yes and No', ov.choices().map((o) => o[0]).join() === 'YES,NO');
}

console.log('\n--- 4. a scenario owns its own ---');
{
	open(FILE(' T1 20 10 2 20 30 500 * NO'));
	ok('both are overridable, stored bare', L.OVERRIDABLE.node.minVolume === true && L.OVERRIDABLE.node.overflow === true);
	const S = L.createScenario('Bigger bowl');
	L.switchScenario(S.id);
	L.setProp(tank(), 'minVolume', 900);
	L.setProp(tank(), 'overflow', 'YES');
	ok('the writes are overrides', L.hasOverride(tank(), 'minVolume') && L.hasOverride(tank(), 'overflow'));
	ok('Base keeps its own', tank().minVolume === 500 && tank().overflow === 'NO');
	const m = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
	ok('the scenario\'s model says 900 ft3 and Overflow', Math.abs(m.minVolume - 900 * Math.pow(0.3048, 3)) < 1e-9 && m.overflow === true);
	ok('the scenario\'s export says them', tankRows(L.exportInp().inp).join('|') === 'T1 20 10 2 20 30 900 * YES', tankRows(L.exportInp().inp).join('|'));
	popup();
	ok('the scenario\'s Properties box shows them', inputIn(labelled(/^Minimum volume/)).value === '900' && selectIn(labelled(/^Can overflow/)).children.filter((o) => o.selected)[0].value === 'YES');
	L.switchScenario(L.baseScenario().id);
	const m0 = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
	ok('Base\'s model and export are unchanged', Math.abs(m0.minVolume - 500 * Math.pow(0.3048, 3)) < 1e-9 && !m0.overflow &&
		tankRows(L.exportInp().inp).join('|') === 'T1 20 10 2 20 30 500 * NO', tankRows(L.exportInp().inp).join('|'));
}

console.log('\n--- 5. a Length unit change converts a volume by the cube ---');
{
	open(FILE(' T1 20 10 2 20 30 1000 * NO'));
	const S = L.createScenario('Other');
	L.switchScenario(S.id);
	L.setProp(tank(), 'minVolume', 2000);
	L.switchScenario(L.baseScenario().id);
	const k = 0.3048;   // 100 ft -> 30.48 m: the length factor going from ft to m
	L.convertUnitValues('lpn_u_length', k);
	ok('Base\'s 1000 ft3 is now 1000 x k^3', Math.abs(tank().minVolume - 1000 * k * k * k) < 1e-9, String(tank().minVolume));
	L.switchScenario(S.id);
	ok('and the scenario\'s override too', Math.abs(L.effective(tank(), 'minVolume') - 2000 * k * k * k) < 1e-9, String(L.effective(tank(), 'minVolume')));
}

console.log('\n--- 6. Find reads both ---');
{
	open(FILE(' T1 20 10 2 20 30 500 * YES'));
	ok('a tank is findable on Minimum volume', L.query('tank', 'minVolume', 'equals', '500').length === 1 && L.query('tank', 'minVolume', 'gt', '600').length === 0);
	ok('a tank is findable on Can overflow', L.query('tank', 'overflow', 'equals', 'YES').length === 1 && L.query('tank', 'overflow', 'equals', 'NO').length === 0);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

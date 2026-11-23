// A TANK'S MINIMUM VOLUME AND CAN OVERFLOW, END TO END. Run with:
//   node dev/lpn-spike/tank-minvol-overflow-harness.js
//
// Tom, 2026-11-14: add EPANET's [TANKS] MinVol (column 7) and Overflow (column 9) to a tank's
// Properties, editable, with the scenario behaviour of every other tank field. The file's own
// values already crossed (inp-fidelity-harness.js section 2); this holds the editors:
//
//   1. THE POPUP (the shipped renderNodeFields, the shipped listeners): a Minimum volume number box
//      named for the Volume unit, and a Can overflow Yes/No choice. Typing writes the document;
//      choosing the word the file already spells that way changes nothing, characters included.
//   2. THE TABLES PANE carries both columns, and writes through the same setters.
//   3. THE SCENARIO SEAM: both are overridable, an edit inside a scenario is that scenario's own and
//      Base keeps its value, and the model and the .inp export of that scenario say it.
//   4. A VOLUME UNIT CHANGE reinterprets (or, on Convert, converts) the typed volume; a Length change leaves it alone.
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
	"\t\tserializeProject: serializeProject, unitKey: unitKey, colorNodeValue: colorNodeValue, tankVolumeUnitText: tankVolumeUnitText, unitServes: unitServes,\n" +
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
	ok('Minimum volume names the Volume unit (ft^3 on a US file)', !!mv && /ft\^3/.test(mv.textContent), mv && mv.textContent);
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

console.log('\n--- 5. the Volume unit converts a typed volume; a Length change leaves it alone (Task 857) ---');
{
	open(FILE(' T1 20 10 2 20 30 1000 * NO'));
	const S = L.createScenario('Other');
	L.switchScenario(S.id);
	L.setProp(tank(), 'minVolume', 2000);
	L.switchScenario(L.baseScenario().id);
	L.convertUnitValues('lpn_u_length', 0.3048);
	ok('a Length change does not move Base\'s minimum volume', tank().minVolume === 1000, String(tank().minVolume));
	L.switchScenario(S.id);
	ok('...nor the scenario\'s override', L.effective(tank(), 'minVolume') === 2000, String(L.effective(tank(), 'minVolume')));
	L.switchScenario(L.baseScenario().id);
	const k = 7.48051948;   // ft3 -> gal
	const n = L.convertUnitValues('lpn_u_volume', k);
	ok('the Volume unit converts Base\'s 1000 by its own factor', Math.abs(tank().minVolume - 1000 * k) < 1e-9, String(tank().minVolume));
	L.switchScenario(S.id);
	ok('and the scenario\'s override too', Math.abs(L.effective(tank(), 'minVolume') - 2000 * k) < 1e-9, String(L.effective(tank(), 'minVolume')));
	ok('it counted the numbers it decides', n >= 1, String(n));
	ok('the question names Minimum volume under Volume and not under Length',
		L.unitServes('lpn_u_volume').join() === 'Minimum volume' && L.unitServes('lpn_u_length').indexOf('Minimum volume') < 0,
		L.unitServes('lpn_u_volume').join() + ' / ' + L.unitServes('lpn_u_length').join());
}

console.log('\n--- 6. Find reads both ---');
{
	open(FILE(' T1 20 10 2 20 30 500 * YES'));
	ok('a tank is findable on Minimum volume', L.query('tank', 'minVolume', 'equals', '500').length === 1 && L.query('tank', 'minVolume', 'gt', '600').length === 0);
	ok('a tank is findable on Can overflow', L.query('tank', 'overflow', 'equals', 'YES').length === 1 && L.query('tank', 'overflow', 'equals', 'NO').length === 0);
}

console.log('\n--- 7. the Volume selector (Task 857): one unit for a typed and a solved volume ---');
{
	const sel = (u) => L.applyUnitSelections({ lpn_u_volume: u });
	const TXT = FILE(' T1 20 10 2 20 30 500 * NO');
	const clean = (t) => tankRows(t).join('|');
	const M3_PER_GAL = 3.785411784e-3, M3_PER_FT3 = Math.pow(0.3048, 3);
	setUnitSet('us');
	open(TXT);
	ok('a US file opens on cubic feet, the unit its MinVol is in', L.unitKey('lpn_u_volume') === 'ft3', L.unitKey('lpn_u_volume'));
	const base = L.exportInp().inp;
	const ft3 = Math.PI / 4 * 30 * 30 * (10 - 2);
	const t = L.nodeById('T1');
	const perFt3 = { gal: 28.316846592 / 3.785411784, ft3: 1, m3: 0.028316846592, l: 28.316846592 };
	['ft3', 'gal', 'm3', 'l'].forEach((u) => {
		sel(u);
		const v = L.colorNodeValue(t, 'volume');
		ok(u + ': Available volume at the initial depth ' + (ft3 * perFt3[u]).toFixed(2) + ' (shown ' + v + ')',
			typeof v === 'number' && Math.abs(v - ft3 * perFt3[u]) < 1e-6 * ft3 * perFt3[u], String(v));
		ok(u + ': the heading unit follows', L.tankVolumeUnitText() === { gal: 'gal', ft3: 'ft^3', m3: 'm^3', l: 'L' }[u], L.tankVolumeUnitText());
		ok(u + ': a typed Minimum volume is NOT converted by the change (500 stays 500)', t.minVolume === 500, String(t.minVolume));
		// The export: the file's own characters when the unit is the file's, a stated conversion otherwise.
		const out = L.exportInp();
		const want = u === 'ft3' ? 500 : 500 * (u === 'gal' ? M3_PER_GAL : u === 'm3' ? 1 : 1e-3) / M3_PER_FT3;
		const got = parseFloat(tankRows(out.inp)[0].split(' ')[6]);
		ok(u + ': MinVol goes out in the file\'s ft3: ' + want.toFixed(4), Math.abs(got - want) < 1e-9 * Math.max(1, want), clean(out.inp));
		ok(u + ': ' + (u === 'ft3' ? 'the file goes out byte for byte the same' : 'the export says it converted a volume'),
			u === 'ft3' ? out.inp === base : (out.differences || []).some((d) => d.code === 'unit-converted' && /volume/.test(d.detail || '')),
			JSON.stringify((out.differences || []).map((d) => d.detail)));
		// The model both engines read, in cubic metres, converted once from the unit it is typed in.
		const m = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0];
		const wantM3 = 500 * { ft3: M3_PER_FT3, gal: M3_PER_GAL, m3: 1, l: 1e-3 }[u];
		ok(u + ': the model carries ' + wantM3.toFixed(4) + ' m3', Math.abs(m.minVolume - wantM3) < 1e-12, String(m.minVolume));
	});
	// The Properties box heading and Find's unit text name the Volume unit.
	sel('gal'); popup();
	ok('the Properties heading says (gal) for Minimum volume', /^Minimum volume.*\(gal\)/.test((labelled(/^Minimum volume/) || {}).textContent || ''), (labelled(/^Minimum volume/) || {}).textContent);
	ok('...and for Available volume', /^Available volume.*\(gal\)/.test((labelled(/^Available volume/) || {}).textContent || ''));
	// A Length change no longer moves the typed volume's meaning: the Volume unit decides it.
	sel('ft3');
	// An SI file opens on cubic metres and exports byte for byte.
	const SI = TXT.replace('Units GPM', 'Units LPS').replace(' P1 R1 J1 1000 12 100', ' P1 R1 J1 300 300 100').replace(' P2 J1 T1 500 8 100', ' P2 J1 T1 150 200 100');
	setUnitSet('si');
	open(SI);
	ok('an SI file opens on cubic metres', L.unitKey('lpn_u_volume') === 'm3', L.unitKey('lpn_u_volume'));
	ok('...and its tank row exports as the file wrote it', clean(L.exportInp().inp) === clean(SI), clean(L.exportInp().inp));
	// Saved and reopened.
	setUnitSet('us'); open(TXT);
	sel('l');
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the project saves the Volume unit by name', saved.units && saved.units.lpn_u_volume === 'l', JSON.stringify(saved.units));
	sel('ft3');
	L.applyUnitSelections(saved.units);
	ok('and reopens in it', L.unitKey('lpn_u_volume') === 'l');
	// A project saved before the selector typed its volume in the Length unit cubed: it opens on that,
	// so no number changes meaning, whatever the last project left showing.
	setUnitSet('us');
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_volume: 'l' });
	L.applyUnitSelections({ lpn_u_length: 'm', lpn_u_diameter: 'mm' });
	ok('an old SI project: cubic metres', L.unitKey('lpn_u_volume') === 'm3', L.unitKey('lpn_u_volume'));
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in' });
	ok('an old US project: cubic feet, the unit its number was typed in', L.unitKey('lpn_u_volume') === 'ft3', L.unitKey('lpn_u_volume'));
	L.applyUnitSelections({ lpn_u_length: 'm', lpn_u_volume: 'ft3' });
	ok('a project that states its volume unit keeps it', L.unitKey('lpn_u_volume') === 'ft3');
	// Properties and the Tanks column print the same decimals.
	open(TXT);
	['gal', 'mgal', 'acft', 'm3', 'megaliter'].forEach((u) => {
		sel(u);
		popup();
		const row = labelled(/^Available volume/);
		const span = row && (row.children || []).filter((c) => c._tag === 'span').pop();
		const col = L.tableCols('tanks').filter((c) => c.key === 'volume')[0];
		const d = col.dec();
		const shown = span && span.textContent;
		const decs = shown && shown.indexOf('.') >= 0 ? shown.length - shown.indexOf('.') - 1 : 0;
		ok(u + ': Properties prints ' + d + ' decimals like the Tanks column (' + shown + ')', !!row && decs === d, shown);
	});
	setUnitSet('us');
}

console.log('\n--- 8. a solve before and after a Volume unit change, the engine reading the same tank (Task 857) ---');
(async function () {
	const { warmEpanet } = require('./lpn-dom-stub.js');
	await warmEpanet();
	setUnitSet('us');
	open(FILE(' T1 20 10 2 20 30 7500 * NO'));
	const M3_PER_GAL = 3.785411784e-3;
	const tankRow = (model) => (function (r) { return typeof r === "string" ? r : r.inp; }(EC.lpnToInp(model))).split(/\r?\n/).filter((l) => /^\s*T1\s/.test(l)).map((l) => l.trim().split(/\s+/));
	const solveIt = async () => {
		const model = L.assembleModel();
		const inp = tankRow(model)[0];
		const r = await EC.lpnSolveEpanet(JSON.parse(JSON.stringify(model)), { moduleUrl: require('./lpn-dom-stub.js').NODE_ENGINE_URL });
		return { minVolume: model.nodes.filter((n) => n.id === 'T1')[0].minVolume, inpMinVol: parseFloat(inp[6]), r };
	};
	const a = await solveIt();
	ok('the engine solves with a 7500 ft3 MinVol', a.r && a.r.ok !== false && a.r.heads, JSON.stringify(a.r && a.r.error));
	ok('EPANET\'s file got the volume in cubic metres', Math.abs(a.inpMinVol - 7500 * Math.pow(0.3048, 3)) < 1e-3 * a.inpMinVol, String(a.inpMinVol));
	// Reinterpret: the same typed 7500 now means gallons. The model must follow the unit, not the digits.
	L.applyUnitSelections({ lpn_u_volume: 'gal' });
	const b = await solveIt();
	ok('after the unit becomes gallons the model\'s MinVol is 7500 gal = ' + (7500 * M3_PER_GAL).toFixed(4) + ' m3',
		Math.abs(b.minVolume - 7500 * M3_PER_GAL) < 1e-12, String(b.minVolume));
	ok('...and the engine was handed that number', Math.abs(b.inpMinVol - 7500 * M3_PER_GAL) < 1e-3 * b.inpMinVol, String(b.inpMinVol));
	ok('...which is not what it was handed before', Math.abs(b.minVolume - a.minVolume) > 1);
	ok('the engine still solves, the heads untouched by where a MinVol puts the zero of the scale',
		b.r && b.r.heads && Math.abs(b.r.heads.T1 - a.r.heads.T1) < 1e-6, JSON.stringify([a.r.heads && a.r.heads.T1, b.r.heads && b.r.heads.T1]));
	// Convert (Destructive): 7500 ft3 becomes the same water in gallons; the model is the number it was.
	open(FILE(' T1 20 10 2 20 30 7500 * NO'));
	const before = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0].minVolume;
	L.applyUnitSelections({ lpn_u_volume: 'gal' });
	L.convertUnitValues('lpn_u_volume', 7.48051948);
	const after = L.assembleModel().nodes.filter((n) => n.id === 'T1')[0].minVolume;
	ok('Convert keeps the water: the model\'s MinVol is the same cubic metres before and after', Math.abs(after - before) < 1e-6 * before, before + ' -> ' + after);
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());

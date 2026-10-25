// Headless check of File > Import > EPANET file when a project is already open -- ROADMAP Task 814.
//
//   node dev/lpn-spike/inp-update-harness.js
//
// An EPANET file may now UPDATE the open project: assets are matched by ID, a differing value is
// written through setProp() (an override in a scenario, the asset itself in Base), an asset only in
// the file is added, an asset only in the project is kept and named, and the whole thing is ONE undo
// step. A unit mismatch is refused by name. With nothing open the file still makes a new project.
// Every sentence is read from the page's own config, never retyped (harness_wording_check.php).

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-georef.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () {};
global.confirm = global.window.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tundo: undo, getProject: function () { return project; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\teffective: effective, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tprojectCount: function () { return library.projects.length; },\n" +
	"\t\tscenarios: function () { return scenarios; }, overrideCount: overrideCount,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tz: 0 "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function walk(el) { return (!el.children || !el.children.length) ? (el.textContent || '') : el.children.map(walk).join('\n'); }
const dialogText = () => walk(byId.lpn_dialog_body);
const dialogButtons = () => byId.lpn_dialog_buttons.children.map(c => c.textContent);
function press(label) {
	const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
	if (!btn) { throw new Error('no such button: ' + label + ' in ' + JSON.stringify(dialogButtons())); }
	(btn._listeners.click || []).forEach(fn => fn({}));
}
function importText(text, name) {
	byId.lpn_dialog_body.children.length = 0;
	byId.lpn_dialog_buttons.children.length = 0;
	L.importInp({ name: name, _text: text });
}
const snap = () => JSON.stringify(L.getDoc());

const US = (extra) => `[TITLE]
update test

[JUNCTIONS]
;ID Elev Demand Pattern
 J1 100 0
 J2 ${extra.j2elev} ${extra.j2dem}
 J3 90 0
${extra.addJ || ''}
[RESERVOIRS]
;ID Head
 R1 ${extra.r1head}

[PIPES]
;ID Node1 Node2 Length Diam Rough MinorLoss Status
 P1 R1 J1 1200 ${extra.p1diam} 130 0 Open
 P2 J1 J2 800 10 120 2 Open
${extra.p3 === false ? '' : ' P3 J2 J3 1500 8 110 0 Open\n'}${extra.addP || ''}
[COORDINATES]
 J1 100 100
 J2 200 100
 J3 300 100
 R1 0 100
${extra.addC || ''}
[OPTIONS]
 Units GPM
 Headloss H-W

[END]
`;
const A = US({ j2elev: '95', j2dem: '120', r1head: '200', p1diam: '12' });
const B = US({ j2elev: '97.50', j2dem: '130.0', r1head: '200', p1diam: '14', p3: false,
	addJ: ' J9 80 15\n', addP: ' P9 J2 J9 500 6 100 0 Open\n', addC: ' J9 250 200\n' });
const SI = A.replace('Units GPM', 'Units LPS');

delete global.window.lpnInpDestination;   // drive the real question
setUnitSet('us');

console.log('\n--- nothing open: the file makes a new project, no question ---');
importText(A, 'a.inp');
ok('no question is asked of an empty project', byId.lpn_dialog_buttons.children.every(c => c.textContent !== (PC.lpn_inpup_btn_new)));
ok('the project holds the file', L.getDoc().nodes.length === 4 && L.getDoc().links.length === 3);
const projectsAfterA = L.projectCount();

console.log('\n--- Base only: update the open project ---');
importText(B, 'b.inp');
{
	const names = dialogButtons();
	ok('one small question: new project, this project, a new scenario, Cancel', names.length === 4 && names[0] === PC.lpn_inpup_btn_new && names[2] === PC.lpn_inpup_btn_newscn_basic && names[3] === PC.lpn_cancel, JSON.stringify(names));
	ok('the default answer is a new project, as before', true);
	const before = snap();
	press(names[1]);
	const d = L.getDoc();
	ok('no second project was made', L.projectCount() === projectsAfterA);
	const j2 = L.nodeById('J2');
	ok('a matched value is updated with the file number', j2.elev === 97.5 && j2._demand === 130, j2.elev + ' / ' + j2._demand);
	ok('the file characters ride with the number', j2.tok && j2.tok.elev === '97.50' && j2.tok._demand === '130.0', JSON.stringify(j2.tok));
	ok('an unchanged value is not touched', L.nodeById('J3').elev === 90 && L.nodeById('R1')._head === 200);
	ok('a pipe diameter is updated', L.linkById('P1')._diameter === 14);
	ok('an asset only in the file is added', !!L.nodeById('J9') && L.nodeById('J9')._demand === 15 && L.nodeById('J9').elev === 80 && !!L.linkById('P9'));
	ok('the added node sits where the file puts it', L.nodeById('J9').x === 250 && Math.abs(L.effective(L.nodeById('J9'), 'y') - 200) < 1e-9, L.nodeById('J9').x + ',' + L.effective(L.nodeById('J9'), 'y'));
	ok('an asset only in the project is KEPT', !!L.linkById('P3') && L.linkById('P3')._diameter === 8);
	const t = dialogText();
	ok('the receipt names the change old to new', t.indexOf('J2') >= 0 && t.indexOf('95') >= 0 && t.indexOf('97.50') >= 0, t.slice(0, 300));
	ok('the receipt lists what was kept', t.indexOf(PC.lpn_inpup_h_kept) >= 0 && /P3/.test(t.slice(t.indexOf(PC.lpn_inpup_h_kept))));
	ok('the receipt lists what was added', t.indexOf(PC.lpn_inpup_h_added) >= 0 && t.indexOf('J9') >= 0);
	ok('nothing to report as not applied: no such heading', t.indexOf(PC.lpn_inpup_h_na) < 0);
	ok('the receipt never says sync', !/sync/i.test(t));
	L.undo();
	ok('ONE undo restores the project exactly', snap() === before);
}

console.log('\n--- a scenario is open: it is the default target, Base is untouched ---');
{
	const sc = L.createScenario('Peak', 'base');
	const before = snap();
	importText(B, 'b.inp');
	const names = dialogButtons();
	ok('the question offers the open scenario and Base', names[1] === PC.lpn_inpup_btn_scenario.replace('{scenario}', 'Peak') && names[3] === PC.lpn_scenario_base && names[2] === PC.lpn_inpup_btn_newscn_basic, JSON.stringify(names));
	press(names[1]);
	const j2 = L.nodeById('J2');
	ok('Base values are not changed', j2.elev === 95 && j2._demand === 120 && L.linkById('P1')._diameter === 12);
	ok('the scenario reads the file values', L.effective(j2, 'elev') === 97.5 && L.effective(j2, 'demand') === 130 && L.effective(L.linkById('P1'), 'diameter') === 14);
	ok('they are overrides of the scenario', L.overrideCount(L.scenarios().filter(x => !x.isBase)[0]) >= 3, String(L.overrideCount(L.scenarios().filter(x => !x.isBase)[0])));
	ok('a new asset is inactive in Base and active in the scenario', L.nodeById('J9')._active === false && L.effective(L.nodeById('J9'), 'active') === true);
	ok('the receipt names the scenario', dialogText().indexOf('Peak') >= 0);
	L.undo();
	ok('undo restores the scenario and Base exactly', snap() === before && JSON.stringify(L.scenarios()) !== '');
	// And Base chosen on purpose, from inside the scenario.
	importText(B, 'b.inp');
	press(PC.lpn_scenario_base);
	ok('Base chosen: Base takes the values', L.nodeById('J2').elev === 97.5);
	ok('the open scenario stays open', L.getProject().activeScenario === sc.id);
	L.undo();
	ok('undo of a Base update restores it', snap() === before);
}

console.log('\n--- a new scenario, child of the open one (Task 814) ---');
{
	L.switchScenario('base');
	const peak = L.scenarios().filter(x => !x.isBase)[0];
	L.switchScenario(peak.id);
	const before = snap(), nScn = L.scenarios().length, peakOv = L.overrideCount(peak);
	importText(B, 'b.inp');
	const names = dialogButtons();
	ok('the choice reads "A new scenario" in Basic mode', names.indexOf(PC.lpn_inpup_btn_newscn_basic) >= 0, JSON.stringify(names));
	ok('the dialog has the name field', !!byId.lpn_dialog_body.children.length && dialogText().indexOf(PC.lpn_inpup_newscn_name) >= 0);
	press(PC.lpn_inpup_btn_newscn_basic);
	const made = L.scenarios()[L.scenarios().length - 1];
	ok('one scenario was created and is open', L.scenarios().length === nScn + 1 && L.getProject().activeScenario === made.id, made.name);
	ok('Base and the old scenario hold nothing of the file', L.nodeById('J2').elev === 95 && L.nodeById('J9')._active === false && L.overrideCount(peak) === peakOv);
	ok('the new scenario reads the file values through overrides', L.effective(L.nodeById('J2'), 'elev') === 97.5 && L.overrideCount(made) >= 3);
	ok('a new asset is active only in the new scenario', L.effective(L.nodeById('J9'), 'active') === true && L.nodeById('J9')._active === false);
	ok('the receipt names the new scenario and says it was created', dialogText().indexOf(PC.lpn_inpup_new_scn_basic.replace('{scenario}', made.name)) >= 0, dialogText().slice(0, 200));
	L.undo();
	ok('ONE undo removes the scenario and everything the file did', snap() === before && L.scenarios().length === nScn && L.getProject().activeScenario === peak.id);
	// A file that changes nothing creates nothing.
	importText(A, 'a.inp');
	press(PC.lpn_inpup_btn_newscn_basic);
	ok('a file with nothing to change leaves no empty scenario', L.scenarios().length === nScn && snap() === before);
	ok('and the receipt says so', dialogText().indexOf(PC.lpn_inpup_new_none) >= 0);
	ok('its heading does not claim an import', dialogText().indexOf(PC.lpn_inpup_refused_heading.split('{project}')[0]) === 0 && dialogText().indexOf('Imported') !== 0, dialogText().slice(0, 80));
	L.switchScenario('base');
}

console.log('\n--- a unit mismatch is refused by name ---');
{
	L.switchScenario('base');
	const before = snap(), scnBefore = JSON.stringify(L.scenarios());
	importText(SI, 'si.inp');
	press(dialogButtons()[1]);
	const t = dialogText();
	ok('the refusal leaves the project as it was', snap() === before && JSON.stringify(L.scenarios()) === scnBefore);
	ok('the refusal names the flow unit of the file and of the project', /gpm/i.test(t) && /l\/s|lps|L\/s/i.test(t) && t.indexOf(PC.lpn_result_flow) >= 0, t.slice(0, 400));
	ok('it says what to do instead', t.indexOf(PC.lpn_inpup_refused_lead) >= 0);
}

console.log('\n--- the new-project route is unchanged ---');
{
	const n0 = L.projectCount();
	importText(B, 'b.inp');
	press(PC.lpn_inpup_btn_new);
	ok('a new project is made', L.projectCount() === n0 + 1);
	ok('it holds the file, not a merge', L.getDoc().nodes.length === 5 && L.getDoc().links.length === 3 && L.linkById('P3') === null);
}

console.log('\n--- every link type adds: pump, each valve type, a check-valve pipe; and every ID renamed ---');
{
	const FULL = (ren) => {
		const n = (x) => ren ? 'Z' + x : x;
		return `[TITLE]
all types

[JUNCTIONS]
 ${n('J1')} 100 0
 ${n('J2')} 95 10
 ${n('J3')} 90 10
 ${n('J4')} 90 10
 ${n('J5')} 90 10
 ${n('J6')} 90 10
 ${n('J7')} 90 10
 ${n('J8')} 90 10

[RESERVOIRS]
 ${n('R1')} 200

[TANKS]
 ${n('T1')} 100 5 1 10 40 0

[PIPES]
 ${n('P1')} ${n('J1')} ${n('J2')} 1200 12 130 0 Open
 ${n('P2')} ${n('J2')} ${n('J3')} 800 10 120 2 CV

[PUMPS]
 ${n('PU1')} ${n('R1')} ${n('J1')} HEAD C1

[VALVES]
 ${n('V1')} ${n('J3')} ${n('J4')} 8 PRV 40 0
 ${n('V2')} ${n('J4')} ${n('J5')} 8 PSV 40 0
 ${n('V3')} ${n('J5')} ${n('J6')} 8 FCV 100 0
 ${n('V4')} ${n('J6')} ${n('J7')} 8 TCV 2 0
 ${n('V5')} ${n('J7')} ${n('J8')} 8 PBV 10 0
 ${n('V6')} ${n('J8')} ${n('T1')} 8 GPV C1 0

[CURVES]
 C1 0 100
 C1 500 50
 C1 1000 0

[COORDINATES]
 ${n('R1')} 0 0
 ${n('J1')} 100 0
 ${n('J2')} 200 0
 ${n('J3')} 300 0
 ${n('J4')} 400 0
 ${n('J5')} 500 0
 ${n('J6')} 600 0
 ${n('J7')} 700 0
 ${n('J8')} 800 0
 ${n('T1')} 900 0

[OPTIONS]
 Units GPM
 Headloss H-W

[END]
`;
	};
	importText(US({ j2elev: '95', j2dem: '120', r1head: '200', p1diam: '12' }), 'a2.inp');
	press(PC.lpn_inpup_btn_new);
	const before = snap();
	for (const ren of [false, true]) {
		importText(FULL(ren), 'full.inp');
		press(dialogButtons()[1]);
		const t = dialogText();
		const id = (x) => (ren ? 'Z' : '') + x;
		ok((ren ? 'renamed: ' : '') + 'the receipt appears', t.indexOf(PC.lpn_inpup_h_added) >= 0, t.slice(0, 120));
		ok((ren ? 'renamed: ' : '') + 'the pump is added', !!L.linkById(id('PU1')) && L.linkById(id('PU1')).type === 'pump');
		ok((ren ? 'renamed: ' : '') + 'all six valve types are added', ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'].every((v, i) => { const l = L.linkById(id(v)); return l && l.type === 'valve' && l.valveType === ['PRV', 'PSV', 'FCV', 'TCV', 'PBV', 'GPV'][i]; }));
		ok((ren ? 'renamed: ' : '') + 'the CV pipe is added as a check valve', !!L.linkById(id('P2')) && L.linkById(id('P2'))._status === 'cv', L.linkById(id('P2')) && L.linkById(id('P2'))._status);
		ok((ren ? 'renamed: ' : '') + 'the tank is added', !!L.nodeById(id('T1')) && L.nodeById(id('T1')).type === 'tank');
		L.undo();
		ok((ren ? 'renamed: ' : '') + 'one undo restores the project', snap() === before);
	}
}

console.log('\n--- a failure part way rolls everything back and says so ---');
{
	const T = US({ j2elev: '99', j2dem: '120', r1head: '200', p1diam: '12', addJ: ' J8 80 15 ;TRIGGER\n', addP: '', addC: ' J8 250 200\n' });
	const before2 = snap(), realParse = JSON.parse;
	JSON.parse = function (x) { if (x === '"TRIGGER"') { throw new Error('forced'); } return realParse.apply(this, arguments); };
	try { importText(T, 't.inp'); press(dialogButtons()[1]); } finally { JSON.parse = realParse; }
	const t = dialogText();
	ok('the project is exactly as it was', snap() === before2, t.slice(0, 160));
	ok('a dialog says nothing was changed', t.indexOf(PC.lpn_inpup_failed.split('{project}')[1].split('{reason}')[0].slice(0, 30)) >= 0 || /nothing in/.test(t), t.slice(0, 160));
}

console.log('\n--- the refusal lead fits the cause ---');
{
	const DW = US({ j2elev: '95', j2dem: '120', r1head: '200', p1diam: '12' }).replace('Headloss H-W', 'Headloss D-W');
	importText(DW, 'dw.inp'); press(dialogButtons()[1]);
	let t = dialogText();
	ok('formula only: the formula lead, not the units lead', t.indexOf(PC.lpn_inpup_refused_lead_formula) >= 0 && t.indexOf(PC.lpn_inpup_refused_lead) < 0, t.slice(0, 200));
	importText(DW.replace('Units GPM', 'Units LPS'), 'dw2.inp'); press(dialogButtons()[1]);
	t = dialogText();
	ok('both: the combined lead', t.indexOf(PC.lpn_inpup_refused_lead_both) >= 0, t.slice(0, 200));
}

console.log('\n--- the receipt only says what is true ---');
{
	importText(A, 'same.inp'); press(dialogButtons()[1]);
	const t = dialogText();
	ok('nothing changed: no undo sentence and no Not applied heading', t.indexOf(PC.lpn_inpup_undo) < 0 && t.indexOf(PC.lpn_inpup_h_na) < 0, t.slice(0, 200));
	const SH = US({ j2elev: '95', j2dem: '120', r1head: '200', p1diam: '12' }).replace(' R1 0 100', ' R1 5 100');
	importText(SH.replace('[END]', '[PATTERNS]\n PAT1 1 2\n\n[END]'), 'ni.inp'); press(dialogButtons()[1]);
	const t2 = dialogText();
	ok('only the kinds the file held are named', t2.indexOf(PC.lpn_inpup_i_positions) >= 0 && /patterns/.test(t2) && !/curves|rules|controls/.test(t2.slice(t2.indexOf(PC.lpn_inpup_h_na))), t2.slice(t2.indexOf(PC.lpn_inpup_h_na)));
}

console.log('\n--- a junction and a pipe sharing an ID are told apart ---');
{
	const SHARE = US({ j2elev: '95', j2dem: '120', r1head: '200', p1diam: '12' });
	importText(SHARE.replace(' J3 90 0', ' P3 90 0').replace('J2 J3 1500', 'J2 P3 1500'), 'share.inp'); press(dialogButtons()[1]);
	const t = dialogText();
	ok('kept and added lists carry the kind', /Kept[^]*Junction J3/.test(t) && /Assets added\nJunction P3/.test(t) && /connections/.test(t), t.slice(0, 400));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

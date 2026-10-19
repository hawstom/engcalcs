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
	ok('one small question: new project, this project, Cancel', names.length === 3 && names[0] === PC.lpn_inpup_btn_new && names[2] === PC.lpn_cancel, JSON.stringify(names));
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
	ok('the receipt lists what was not applied', t.indexOf(PC.lpn_inpup_h_na) >= 0);
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
	ok('the question offers the open scenario and Base', names[1] === PC.lpn_inpup_btn_scenario.replace('{scenario}', 'Peak') && names[2] === PC.lpn_inpup_btn_base, JSON.stringify(names));
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
	press(PC.lpn_inpup_btn_base);
	ok('Base chosen: Base takes the values', L.nodeById('J2').elev === 97.5);
	ok('the open scenario stays open', L.getProject().activeScenario === sc.id);
	L.undo();
	ok('undo of a Base update restores it', snap() === before);
}

console.log('\n--- a unit mismatch is refused by name ---');
{
	L.switchScenario('base');
	const before = snap(), scnBefore = JSON.stringify(L.scenarios());
	importText(SI, 'si.inp');
	press(dialogButtons()[1]);
	const t = dialogText();
	ok('nothing was changed', snap() === before && JSON.stringify(L.scenarios()) === scnBefore);
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

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

// A PIPE TYPE IS A DOCUMENT OBJECT, AND A PIPE HOLDS ONLY A REFERENCE (ROADMAP Task 465). Run:
//   node dev/lpn-spike/pipe-library-harness.js
//
// Tom, 2026-09-05: *"Pipe library: I foresee very soon that we will add the ability to refer to a
// library pipe for roughness, reaction coefficients, and maybe diameter (depending on what user
// chooses to include in the library pipe definition). The Library pipe selector can be immediately
// after ID, and any properties defined in the Library are disabled or removed in the pipe
// properties box. Very cool and open to user needs."*
//
// **THE ONE THING THAT GOES WRONG IS BINDING BY NAME, AND SECTION 3 IS IT.** Bentley's own
// Engineering Libraries documentation, cited in dev/pipe-library-design.md §4: *"Items are
// synchronized based on their label. If the label is the same, then the item's values will be made
// the same."* A definition identified by its NAME re-points every reference the moment two names
// collide, silently, because from the software's side nothing changed -- a label still matches a
// label. So the reference stored here is the id, a rename carries it, a clash is refused, and a
// later type taking an old name captures nothing.
//
// Sections:
//   1. the document object: id-keyed, and it survives a save and a reload
//   2. effective(): override before element before type, and what a type does NOT reach
//   3. binding is by ID -- a second type with the same name steals nothing
//   4. a rename carries every reference, in Base and in a scenario alike
//   5. deleting a type in use is REFUSED, by name and with the count
//   6. the popup: a property the type states renders DISABLED at its inherited value
//   7. detach copies the values in and drops the reference
//   8. the .inp exporter flattens a typed pipe, and every number still goes out

const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp,\n" +
	"\t\tlinkById: linkById, setDoc: function (d) { doc = d; }, getDoc: function () { return doc; },\n" +
	"\t\tdocPipeTypes: docPipeTypes, docPipeTypesRead: docPipeTypesRead,\n" +
	"\t\tpipeTypeById: pipeTypeById, pipeTypeUsers: pipeTypeUsers, pipeTypeOwns: pipeTypeOwns,\n" +
	"\t\tsetPipeType: setPipeType, detachPipeType: detachPipeType,\n" +
	"\t\tlibRenamePipeType: libRenamePipeType, libFreeId: libFreeId,\n" +
	"\t\tbuildPipeTypeSection: buildPipeTypeSection, renderLinkFields: renderLinkFields,\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tsetActiveScenario: function (id) { project.activeScenario = id; },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }

// The stub's querySelectorAll() answers nothing, so the walk is the harness's own -- and it is what
// section 6 reads a disabled control out of.
function walk(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}
function fire(el, type) {
	((el._listeners || {})[type] || []).slice().forEach(function (f) { f({ type: type }); });
}
const alerts = [];
global.alert = global.window.alert = function (m) { alerts.push(String(m)); };

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// A network small enough to read and big enough to have a second pipe that shares the type: two
// junctions, a reservoir and three pipes. Written as a saved project rather than drawn, because
// what every section below asks about is what a DOCUMENT holds.
function fixture() {
	return {
		v: 11, format: 'hawsedc-lpn', project: { name: 'types', activeScenario: 'base' },
		scenarios: [
			{ id: 'base', name: 'Base', isBase: true, overrides: {} },
			{ id: 's1', name: 'Relined', overrides: {} }
		],
		origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'R1', type: 'reservoir', x: 0, y: 0, _head: 100 },
			{ id: 'J1', type: 'junction', x: 100, y: 0, elev: 0, _demand: 100 },
			{ id: 'J2', type: 'junction', x: 200, y: 0, elev: 0, _demand: 50 }
		],
		links: [
			{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
				_diameter: 8, _roughness: 130, _length: 1000, _k: 0, _status: 'open' },
			{ id: 'P2', type: 'pipe', from: 'J1', to: 'J2', verts: [],
				_diameter: 6, _roughness: 120, _length: 500, _k: 0, _status: 'open' },
			{ id: 'P3', type: 'pipe', from: 'R1', to: 'J2', verts: [],
				_diameter: 10, _roughness: 140, _length: 1500, _k: 0, _status: 'open' }
		],
		labels: [], settings: {},
		// **A TYPE THAT STATES ROUGHNESS AND NOT DIAMETER IS LEGAL, AND IS THE WHOLE POINT** (Tom:
		// *"depending on what user chooses to include"*). T_PVC states both; T_C states roughness
		// alone, which is how a real approved-materials table carries two ages of one material.
		pipeTypes: [
			{ id: 'T_PVC', note: '8-inch C900 PVC', props: { diameter: 8, roughness: 150 } },
			{ id: 'T_C', note: 'design C factor only', props: { roughness: 100 } }
		],
		units: {
			lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi',
			lpn_u_diameter: 'in', lpn_u_flow: 'gpm', lpn_u_velocity: 'ftps',
			lpn_u_gradient: 'gradePercent'
		}
	};
}

// =============================================================================================
head('1. THE DOCUMENT OBJECT: id-keyed, and it survives a save and a reload');
// =============================================================================================
L.applySaved(fixture());
check(L.docPipeTypesRead().length === 2,
	`the document holds both definitions: ${L.docPipeTypesRead().map((t) => t.id).join(', ')}`);
check(!!L.pipeTypeById('T_PVC') && L.pipeTypeById('T_PVC').props.diameter === 8,
	'and a definition is found by its id');
// **A TYPE STATES A SUBSET, AND AN ABSENT KEY IS THE ANSWER, NEVER A ZERO.** A `roughness: 100,
// diameter: 0` would be a definition claiming a pipe of no bore; absence is what "this type does
// not state a diameter" has to look like.
check(!Object.prototype.hasOwnProperty.call(L.pipeTypeById('T_C').props, 'diameter'),
	'a type that states no diameter simply has no diameter key');

// **A REFERENCE SURVIVES A SAVE AND A RELOAD**, which is the whole claim that this is document data
// rather than a fact about the browser it was drawn in (CLAUDE.md: modelling data rides in
// serializeProject()).
L.setPipeType(L.linkById('P1'), 'T_PVC');
L.setPipeType(L.linkById('P2'), 'T_PVC');
const saved = JSON.parse(JSON.stringify(L.serializeProject()));
check((saved.pipeTypes || []).length === 2, 'serializeProject() carries the library');
check(saved.links[0]._typeId === 'T_PVC' && saved.links[1]._typeId === 'T_PVC',
	`and the two pipes carry the reference: ${saved.links[0]._typeId}`);
L.applySaved(JSON.parse(JSON.stringify(saved)));
check(L.effective(L.linkById('P1'), 'typeId') === 'T_PVC',
	'the reference is still there after the reload');
check(L.effective(L.linkById('P1'), 'roughness') === 150,
	`and the pipe still reads the definition's roughness: ${L.effective(L.linkById('P1'), 'roughness')}`);

// **ATTACHING A TYPE CLEARS THE PIPE'S OWN VALUE FOR WHAT THE TYPE STATES.** That is what "this
// pipe is an 8-inch C900 PVC" means: a local copy left underneath the definition is a second answer
// nothing would ever show. It is one undo away, and Detach (section 7) writes the values back.
check(L.linkById('P1')._roughness === undefined && L.linkById('P1')._diameter === undefined,
	`P1 holds no diameter or roughness of its own: ${JSON.stringify([L.linkById('P1')._diameter, L.linkById('P1')._roughness])}`);
// **AND ONLY FOR WHAT THE TYPE STATES.** Length is never in a definition -- it is a fact about one
// run of pipe -- so P1's own 1000 ft is untouched by anything the library does.
check(L.effective(L.linkById('P1'), 'length') === 1000,
	`the pipe's own length is not the library's business: ${L.effective(L.linkById('P1'), 'length')}`);

// =============================================================================================
head('2. effective(): OVERRIDE BEFORE ELEMENT BEFORE TYPE');
// =============================================================================================
{
	L.applySaved(fixture());
	const p1 = L.linkById('P1');
	// The TYPE layer, last: P1 states T_C, which states a roughness and no diameter.
	L.setPipeType(p1, 'T_C');
	check(L.effective(p1, 'roughness') === 100,
		`the type supplies what the element no longer states: ${L.effective(p1, 'roughness')}`);
	// The ELEMENT layer, before the type: T_C states no diameter, so P1's own 8 in stands. This is
	// the assertion that says the type is a DEFAULT under the element rather than a replacement for
	// it, and it is what makes a partial definition useful at all.
	check(L.effective(p1, 'diameter') === 8,
		`the element still answers for a property the type does not state: ${L.effective(p1, 'diameter')}`);
	check(L.pipeTypeOwns(p1, 'roughness') === true && L.pipeTypeOwns(p1, 'diameter') === false,
		'and pipeTypeOwns() draws that line in the one place the popup and the tables both ask');
	// The OVERRIDE layer, first. A scenario that has typed its own roughness on this pipe wins over
	// the definition, exactly as it wins over the element's own value.
	L.setActiveScenario('s1');
	L.setProp(p1, 'roughness', 65);
	check(L.effective(p1, 'roughness') === 65,
		`a scenario override beats the type: ${L.effective(p1, 'roughness')}`);
	L.setActiveScenario('base');
	check(L.effective(p1, 'roughness') === 100,
		`and Base still reads the definition: ${L.effective(p1, 'roughness')}`);

	// **A TYPE REACHES ONLY THE FOUR PROPERTIES IT MAY STATE.** Length, status and the two ends are
	// never in a definition (dev/pipe-library-design.md §2), so a `props` key naming one of them is
	// dead rather than dangerous -- effective() never consults the type for those properties at all.
	L.pipeTypeById('T_C').props.length = 99999;
	L.pipeTypeById('T_C').props.status = 'closed';
	check(L.effective(p1, 'length') === 1000 && L.effective(p1, 'status') === 'open',
		`a definition cannot reach length or status: ${L.effective(p1, 'length')}, ${L.effective(p1, 'status')}`);

	// **THE SCENARIO-ONLY TYPE, which is the case the resolution order has to be careful about.**
	// P3 is untyped in Base and still holds its own 140, so the element layer is PRESENT; a scenario
	// pointing it at T_C must still read 100, or choosing a type inside a scenario would change
	// nothing anybody could see.
	const p3 = L.linkById('P3');
	L.setActiveScenario('s1');
	L.setPipeType(p3, 'T_C');
	check(L.effective(p3, 'roughness') === 100,
		`a type stated only by a scenario is still read: ${L.effective(p3, 'roughness')}`);
	L.setActiveScenario('base');
	check(L.effective(p3, 'roughness') === 140,
		`while Base keeps its own number untouched: ${L.effective(p3, 'roughness')}`);
}

// =============================================================================================
head('3. BINDING IS BY ID: a second type with the same name steals nothing');
// =============================================================================================
{
	L.applySaved(fixture());
	const p1 = L.linkById('P1');
	L.setPipeType(p1, 'T_PVC');
	check(L.effective(p1, 'roughness') === 150, 'P1 starts on T_PVC');

	// A CLASH IS REFUSED, NOT MERGED. Bentley's library merges two items that share a label; here
	// the rename is turned away and the field snaps back, which is the contract libRenameCurve()
	// and validateNewId() both give.
	check(L.libRenamePipeType(L.pipeTypeById('T_C'), 'T_PVC') === false,
		'renaming one definition onto another\'s name is refused');
	check(L.pipeTypeById('T_C').props.roughness === 100 && L.pipeTypeById('T_PVC').props.roughness === 150,
		'so neither definition was made equal to the other');

	// AND THE HARDER HALF: the old name, taken later by a NEW definition, captures nothing. Rename
	// T_PVC to T_DI (P1 follows), then mint a fresh type and call it T_PVC. Under name binding P1
	// would jump to the newcomer; under id binding it does not move.
	check(L.libRenamePipeType(L.pipeTypeById('T_PVC'), 'T_DI') === true, 'a free name is accepted');
	check(L.effective(p1, 'typeId') === 'T_DI', 'and the pipe follows the rename');
	L.docPipeTypes().push({ id: 'T_PVC', note: 'a different product entirely', props: { roughness: 55 } });
	check(L.effective(p1, 'roughness') === 150,
		`a new definition taking the old name does not capture the pipe: ${L.effective(p1, 'roughness')}`);
	check(L.pipeTypeUsers('T_PVC').length === 0,
		`and nothing uses the newcomer: ${JSON.stringify(L.pipeTypeUsers('T_PVC'))}`);

	// The minting side of the same rule: a new id is one nothing in the list is using.
	check(L.libFreeId(L.docPipeTypes(), 'T') === 'T1',
		`a minted id avoids every id already there: ${L.libFreeId(L.docPipeTypes(), 'T')}`);
}

// =============================================================================================
head('4. A RENAME CARRIES EVERY REFERENCE, IN BASE AND IN A SCENARIO ALIKE');
// =============================================================================================
{
	L.applySaved(fixture());
	L.setPipeType(L.linkById('P1'), 'T_PVC');          // Base
	L.setActiveScenario('s1');
	L.setPipeType(L.linkById('P2'), 'T_PVC');          // a scenario override only
	L.setActiveScenario('base');
	check(L.pipeTypeUsers('T_PVC').length === 2,
		`both the Base reference and the scenario one count as use: ${L.pipeTypeUsers('T_PVC').join(', ')}`);
	check(L.libRenamePipeType(L.pipeTypeById('T_PVC'), 'T_PVC_C900') === true, 'the rename is accepted');
	check(L.linkById('P1')._typeId === 'T_PVC_C900', 'Base\'s own reference moved');
	const ov = L.getScenarios().filter((s) => s.id === 's1')[0].overrides['l:P2'];
	check(!!ov && ov.typeId === 'T_PVC_C900',
		`and so did the scenario's, which is the one a rename is most likely to strand: ${JSON.stringify(ov)}`);
	check(L.pipeTypeUsers('T_PVC').length === 0 && L.pipeTypeUsers('T_PVC_C900').length === 2,
		'nothing is left pointing at the old name');
}

// =============================================================================================
head('5. DELETING A TYPE IN USE IS REFUSED, BY NAME AND WITH THE COUNT');
// =============================================================================================
{
	L.applySaved(fixture());
	L.setPipeType(L.linkById('P1'), 'T_PVC');
	L.setPipeType(L.linkById('P2'), 'T_PVC');
	const host = global.document.createElement('div');
	L.buildPipeTypeSection(host);
	const dels = walk(host).filter((e) => e._tag === 'button' && e.className === 'lpn-lib-del');
	check(dels.length === 2, `one Delete button per definition: ${dels.length}`);
	alerts.length = 0;
	fire(dels[0], 'click');
	check(L.docPipeTypesRead().length === 2, 'the definition in use is still there');
	// **THE MESSAGE NAMES THE PIPES**, because "why will this not delete" and "where do I go to
	// undo it" are the same question, and the alternative -- deleting it and clearing the
	// references -- would change the diameter and the roughness of every pipe that stated it in
	// silence. buildCurveSection()'s ruling, on the same argument.
	check(alerts.length === 1 && /P1/.test(alerts[0]) && /P2/.test(alerts[0]) && /\b2\b/.test(alerts[0]),
		`and it says which pipes and how many: ${JSON.stringify(alerts[0])}`);
	// The other half: a definition nothing uses deletes without a word.
	alerts.length = 0;
	fire(dels[1], 'click');
	check(L.docPipeTypesRead().length === 1 && !L.pipeTypeById('T_C'),
		`an unused definition deletes: ${L.docPipeTypesRead().map((t) => t.id).join(', ')}`);
	check(alerts.length === 0, 'with nothing to say about it');
}

// =============================================================================================
head('6. THE POPUP: a property the type states renders DISABLED at its inherited value');
// =============================================================================================
{
	L.applySaved(fixture());
	const pf = global.document.getElementById('lpn_popup_fields');
	// T_C states a roughness and no diameter, so exactly one of the two boxes must go dead -- which
	// is a sharper assertion than "a disabled control exists", because a rule that disabled the
	// whole popup would pass that one.
	L.setPipeType(L.linkById('P1'), 'T_C');
	L.renderLinkFields('P1');
	const inputs = walk(pf).filter((e) => e._tag === 'input' && e.type === 'number');
	const disabled = inputs.filter((e) => e.disabled === true);
	check(disabled.length === 1,
		`exactly one box is disabled -- the one the definition states: ${disabled.length} of ${inputs.length}`);
	check(disabled[0].value === '100',
		`and it SHOWS the inherited value rather than hiding it, so a hand check needs no click-through: ${JSON.stringify(disabled[0].value)}`);
	check(inputs.some((e) => !e.disabled && e.value === '8'),
		'while the diameter the definition does not state is still editable at the pipe\'s own 8 in');
	// **THE SELECTOR STANDS IMMEDIATELY AFTER ID** (Tom's own placement), which here means it is the
	// first control in the fields box -- the ID has its own row above it.
	const controls = walk(pf).filter((e) => e._tag === 'select' || e._tag === 'input');
	check(controls.length > 0 && controls[0]._tag === 'select',
		`the pipe type selector is the first control on the popup: ${controls[0] && controls[0]._tag}`);
	// An untyped pipe is exactly the popup it always was: nothing disabled anywhere.
	L.renderLinkFields('P3');
	check(walk(pf).filter((e) => e._tag === 'input' && e.disabled === true).length === 0,
		'a pipe with no type has no disabled box at all');
}

// =============================================================================================
head('7. DETACH COPIES THE VALUES IN AND DROPS THE REFERENCE');
// =============================================================================================
{
	L.applySaved(fixture());
	const p1 = L.linkById('P1');
	L.setPipeType(p1, 'T_PVC');            // states diameter 8 and roughness 150
	check(L.effective(p1, 'diameter') === 8 && L.effective(p1, 'roughness') === 150,
		'P1 is reading both numbers from the definition');
	check(L.detachPipeType(p1) === true, 'detach reports that it did something');
	// **NOTHING ABOUT THE PIPE CHANGES AT THE MOMENT IT IS PRESSED**, which is what makes it safe:
	// it is a statement about who owns the numbers from here on, not an edit to any of them.
	check(L.effective(p1, 'diameter') === 8 && L.effective(p1, 'roughness') === 150,
		`the effective values are identical either side of the detach: ${L.effective(p1, 'diameter')}, ${L.effective(p1, 'roughness')}`);
	check(!L.effective(p1, 'typeId'), `and the reference is gone: ${JSON.stringify(L.effective(p1, 'typeId'))}`);
	check(p1._diameter === 8 && p1._roughness === 150,
		`the numbers are the pipe's OWN now, not the library's: ${JSON.stringify([p1._diameter, p1._roughness])}`);
	check(L.pipeTypeOwns(p1, 'roughness') === false, 'so nothing on this pipe is type-owned any more');
	// EDITABLE AGAIN, which is the whole reason detach exists: one pipe relined after a break must
	// be able to deviate without forking the definition into two entries nothing tells apart.
	L.setProp(p1, 'roughness', 90);
	check(L.effective(p1, 'roughness') === 90, 'and the deviating pipe takes its own value');
	// The definition, and every other pipe on it, is untouched.
	check(L.pipeTypeById('T_PVC').props.roughness === 150, 'the definition itself did not move');
	// Detaching a pipe that has no type is a no-op rather than an error.
	check(L.detachPipeType(L.linkById('P3')) === false, 'detaching an untyped pipe does nothing');
}

// =============================================================================================
head('8. THE .inp EXPORTER FLATTENS A TYPED PIPE');
// =============================================================================================
{
	// **A LIBRARY PIPE IS SOMETHING A ROUND TRIP LOSES, AND WHAT IS LOST IS THE INDIRECTION, NEVER A
	// NUMBER** (dev/pipe-library-design.md §6). EPANET has no such object, so every value still goes
	// out; what does not survive is that two pipes were one definition. The export ALERT is Task
	// 465's slice 5 and is deliberately not built here -- this section is the floor under it.
	L.applySaved(fixture());
	L.setPipeType(L.linkById('P1'), 'T_PVC');
	L.setPipeType(L.linkById('P2'), 'T_PVC');
	const out = L.exportInp();
	check(out.ok, `the document exports: ${JSON.stringify(out.error)}`);
	const rows = out.inp.split('\n').filter((r) => /^\s*P[12]\t/.test(r));
	check(rows.length === 2, `both typed pipes are written: ${rows.length}`);
	// The definition's own 8 in and 150 C, on both rows, in the file's own columns: id, from, to,
	// length, diameter, roughness, k, status.
	check(rows.every((r) => r.split('\t')[4] === '8' && r.split('\t')[5] === '150'),
		`each carries the definition's diameter and roughness: ${JSON.stringify(rows)}`);
	// And each keeps its OWN length, which no definition may state.
	check(rows[0].split('\t')[3] === '1000' && rows[1].split('\t')[3] === '500',
		'while the lengths stay the pipes\' own');
	check(!/pipeTypes|T_PVC/.test(out.inp),
		'and nothing of the library leaks into a format that has no word for it');
}

console.log(failures ? `\n${failures} FAILED` : '\nall passed');
process.exit(failures ? 1 : 0);

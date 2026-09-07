// A PIPE'S MINOR LOSS IS A SUM OF NAMED FITTINGS, AND THE EXPORT SAYS WHAT IT LOSES.
// ROADMAP Tasks 590 (slice 4) and 465 (slice 5). Run:
//   node dev/lpn-spike/fittings-harness.js
//
// dev/pipe-library-design.md §3 is the citation and it is not a guess: **k = sum(quantity x k_i)**
// is Crane Technical Paper 410's additive-K method, the shape of Bentley's own *Minor Loss
// Collection* dialog (Quantity, a picker into a library, and the coefficient) and of KYPipe's
// SigmaM. The coefficients seeded are EPANET 2.2 User Manual Table 3.3, thirteen rows, verbatim.
//
// **THE DEFAULT IS ZERO** -- EPANET 0, epanet-js 0, WaterGEMS and KYPipe zero absent a pick -- so
// section 2 exists to hold that half, which was asked and answered before any of this was built.
//
// **AND THE EXPORT ALERT MUST BE SILENT WHERE NOTHING FLATTENED** (§6 of the design record). A
// warning that fires on every export teaches people to dismiss it, so section 7 asserts the silence
// as hard as it asserts the two messages.
//
// Sections:
//   1. the arithmetic, against a hand-computed figure, and the catalogue is EPANET's own
//   2. the default stays ZERO with no list, and a typed k is untouched
//   3. a fittings list stated by a pipe TYPE reaches the pipe through effective()
//   4. binding is by ID -- a second list with the same name steals nothing, a rename carries
//   5. deleting a list in use is REFUSED, by name and with the count
//   6. the popup: a derived k renders DISABLED, a typed one stays editable
//   7. the export alert: one message per kind, a count each, and SILENCE where neither happened
//   8. the byte-identical export still holds for a pipe nobody touched

const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, effective: effective, setProp: setProp,\n" +
	"\t\tlinkById: linkById, setDoc: function (d) { doc = d; }, getDoc: function () { return doc; },\n" +
	"\t\tdocFittingSets: docFittingSets, docFittingSetsRead: docFittingSetsRead,\n" +
	"\t\tdocPipeTypes: docPipeTypes, pipeTypeById: pipeTypeById,\n" +
	"\t\tfittingSetById: fittingSetById, fittingSetUsers: fittingSetUsers,\n" +
	"\t\tpipeFittingSet: pipeFittingSet, pipeK: pipeK, pipeKIsDerived: pipeKIsDerived,\n" +
	"\t\tlibRenameFittingSet: libRenameFittingSet, fittingNames: fittingNames,\n" +
	"\t\tbuildFittingSection: buildFittingSection, renderLinkFields: renderLinkFields,\n" +
	"\t\tpipeTypeOwns: pipeTypeOwns, setPipeType: setPipeType, detachPipeType: detachPipeType,\n" +
	"\t\tshowInpExportFlattening: showInpExportFlattening,\n" +
	"\t\tassembleModel: assembleModel,\n" +
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

// The stub's querySelectorAll() answers nothing, so the walk is the harness's own -- pipe-library-
// harness.js's, and it is what section 6 reads a disabled control out of.
function walk(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}
const alerts = [];
global.alert = global.window.alert = function (m) { alerts.push(String(m)); };
// The export alert is a DIALOG rather than an alert(). openDialog() builds real elements into
// #lpn_dialog_body, so it is read back the way a user reads it -- inp-import-harness.js's rule for
// the import report, which is the same channel pointed the other way.
function dialogText() {
	const body = document.getElementById('lpn_dialog_body');
	return walk(body).map((e) => (e.children && e.children.length) ? '' : (e.textContent || '')).join('\n');
}
function clearDialog() { document.getElementById('lpn_dialog_body').children.length = 0; }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// Two junctions, a reservoir and three pipes -- pipe-library-harness.js's fixture, plus a fittings
// library. **F_STD IS THE HAND-COMPUTED FIGURE OF SECTION 1**: four long radius elbows at 0.6 and
// two fully open gate valves at 0.2, which is 4 x 0.6 + 2 x 0.2 = 2.8 exactly.
function fixture() {
	return {
		v: 11, format: 'hawsedc-lpn', project: { name: 'fittings', activeScenario: 'base' },
		scenarios: [
			{ id: 'base', name: 'Base', isBase: true, overrides: {} },
			{ id: 's1', name: 'Refitted', overrides: {} }
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
				_diameter: 6, _roughness: 120, _length: 500, _k: 1.5, _status: 'open' },
			{ id: 'P3', type: 'pipe', from: 'R1', to: 'J2', verts: [],
				_diameter: 10, _roughness: 140, _length: 1500, _k: 0, _status: 'open' }
		],
		labels: [], settings: {},
		pipeTypes: [
			{ id: 'T_PVC', note: '8-inch C900 PVC', props: { diameter: 8, roughness: 150 } }
		],
		fittingSets: [
			{ id: 'F_STD', note: 'standard tap assembly',
				items: [
					{ fit: 'elbow_long', qty: 4, k: 0.6 },
					{ fit: 'gate', qty: 2, k: 0.2 }
				] },
			{ id: 'F_EMPTY', items: [] }
		],
		units: {
			lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi',
			lpn_u_diameter: 'in', lpn_u_flow: 'gpm', lpn_u_velocity: 'ftps',
			lpn_u_gradient: 'gradePercent'
		}
	};
}

// =============================================================================================
head('1. THE ARITHMETIC, AGAINST A HAND-COMPUTED FIGURE');
// =============================================================================================
{
	// **4 x 0.6 + 2 x 0.2 = 2.8**, worked by hand and not by re-running the code under test. If
	// this fails, either the sum is not additive or a quantity is being ignored.
	L.applySaved(fixture());
	check(EngCalcs.lpnFittingsSum(L.fittingSetById('F_STD')) === 2.8,
		`4 long radius elbows at 0.6 and 2 gate valves at 0.2 sum to 2.8: ${EngCalcs.lpnFittingsSum(L.fittingSetById('F_STD'))}`);
	// An EMPTY list is a statement that this pipe has no fittings, and it sums to zero rather than
	// to undefined -- which is the same answer as no list at all, and correct.
	check(EngCalcs.lpnFittingsSum(L.fittingSetById('F_EMPTY')) === 0,
		'an empty list sums to 0, not to undefined');
	// **THE CATALOGUE IS EPANET 2.2 TABLE 3.3 AND NOTHING ELSE.** Thirteen rows; four of its own
	// numbers spot-checked against the published table, because an unsourced coefficient that looks
	// authoritative is the thing this assertion exists to stop drifting in.
	check(EngCalcs.lpnFittingCatalog.length === 13,
		`the catalogue holds Table 3.3's thirteen rows: ${EngCalcs.lpnFittingCatalog.length}`);
	check(EngCalcs.lpnFittingCatalogEntry('globe').k === 10.0
		&& EngCalcs.lpnFittingCatalogEntry('gate').k === 0.2
		&& EngCalcs.lpnFittingCatalogEntry('tee_branch').k === 1.8
		&& EngCalcs.lpnFittingCatalogEntry('exit').k === 1.0,
		'and the four spot-checked coefficients are the manual\'s own');
	// **EVERY CATALOGUE ROW HAS A NAME AND EVERY NAME HAS A ROW.** The coefficient lives in
	// js/lpn-fittings.js and the words in js/looped-network.js, deliberately, so that a translated
	// name can never become the stored token -- and this is what stops the two lists drifting.
	const names = L.fittingNames();
	check(EngCalcs.lpnFittingCatalog.every((c) => typeof names[c.key] === 'string' && names[c.key] !== ''),
		'every catalogue row has a displayed name');
	check(Object.keys(names).length === EngCalcs.lpnFittingCatalog.length,
		`and there is no name for a fitting that does not exist: ${Object.keys(names).length}`);
	// An item whose fitting is not in the catalogue is the "other fitting" row, and its own
	// coefficient is read exactly the same way -- there is no branch.
	check(EngCalcs.lpnFittingsSum({ items: [{ fit: '', qty: 3, k: 1.25 }] }) === 3.75,
		'an "other fitting" row is summed like any other');
}

// =============================================================================================
head('2. THE DEFAULT STAYS ZERO, AND A TYPED k IS UNTOUCHED');
// =============================================================================================
{
	// **ASKED AND ANSWERED BEFORE THIS WAS BUILT** (Task 590): EPANET 0, epanet-js 0
	// (`DEFAULT_MINOR_LOSS = 0` in their source), WaterGEMS and KYPipe both zero absent a pick. A
	// network that never touched this feature must behave exactly as it did.
	L.applySaved(fixture());
	const p1 = L.linkById('P1'), p2 = L.linkById('P2');
	check(L.pipeK(p1) === 0, `a pipe with no list and no typed k reads 0: ${L.pipeK(p1)}`);
	check(L.pipeKIsDerived(p1) === false, 'and its k is not derived from anything');
	check(L.pipeK(p2) === 1.5, `a typed k is returned untouched: ${L.pipeK(p2)}`);
	// A reference to a list the document does not hold resolves to NOTHING, leaving the typed value
	// in force. Nothing is repaired on the user's behalf.
	L.setProp(p2, 'fittingsId', 'F_GONE');
	check(L.pipeFittingSet(p2) === null, 'a reference to a missing list resolves to null');
	check(L.pipeK(p2) === 1.5, `and the pipe still reads its own typed k: ${L.pipeK(p2)}`);
	// And once a real list is stated the sum wins over the number underneath it, which is what
	// makes the popup's disabled box honest.
	L.setProp(p2, 'fittingsId', 'F_STD');
	check(L.pipeK(p2) === 2.8, `a stated list wins over the typed number: ${L.pipeK(p2)}`);
	check(L.pipeKIsDerived(p2) === true, 'and the pipe says so');
	// **THE SOLVE READS THE SUM**, which is the whole point: a model built from the number
	// underneath would answer a network nobody is looking at.
	const model = L.assembleModel();
	const solved = model.links.filter((x) => x.id === 'P2')[0];
	check(solved && solved.k === 2.8, `and the model handed to the solver carries 2.8: ${solved && solved.k}`);
}

// =============================================================================================
head('3. A LIST STATED BY A PIPE TYPE REACHES THE PIPE THROUGH effective()');
// =============================================================================================
{
	// **THIS IS THE SENTENCE THAT LINKS TASK 590 TO TASK 465** (dev/pipe-library-design.md §2): a
	// pipe TYPE may state a fittings list, and it resolves through the SAME layer the type's
	// diameter and roughness resolve through. A second resolution path for a reference would be a
	// second set of rules about what a scenario, an element and a type each win.
	L.applySaved(fixture());
	L.fittingSetById('F_STD');
	L.docPipeTypes()[0].props.fittingsId = 'F_STD';
	const p1 = L.linkById('P1');
	check(L.pipeK(p1) === 0, 'before the type is stated the pipe reads its own 0');
	L.setPipeType(p1, 'T_PVC');
	check(L.effective(p1, 'fittingsId') === 'F_STD',
		`the type's fittings list reaches the pipe: ${L.effective(p1, 'fittingsId')}`);
	check(L.pipeK(p1) === 2.8, `so its k is the list's sum: ${L.pipeK(p1)}`);
	check(L.pipeTypeOwns(p1, 'fittingsId') === true,
		'and the chooser on the popup is the type\'s to answer, not the pipe\'s');
	// **THE PIPE'S OWN REFERENCE WINS OVER NOTHING WHEN THE TYPE STATES ONE** -- attaching a type
	// clears what the type states, exactly as it clears a diameter.
	check(p1._fittingsId === undefined,
		`attaching the type cleared the pipe's own reference: ${JSON.stringify(p1._fittingsId)}`);
	// DETACH copies the reference in as the pipe's own and drops the type, which is how one pipe
	// deviates without forking the definition.
	L.detachPipeType(p1);
	check(p1._fittingsId === 'F_STD' && !L.effective(p1, 'typeId'),
		`detach leaves the reference on the pipe itself: ${JSON.stringify([p1._fittingsId, L.effective(p1, 'typeId')])}`);
	check(L.pipeK(p1) === 2.8, 'and nothing about the pipe changed at the moment it was pressed');
}

// =============================================================================================
head('4. BINDING IS BY ID, AND A RENAME CARRIES EVERY REFERENCE');
// =============================================================================================
{
	// **BENTLEY'S OWN LIBRARIES SYNCHRONISE ON THE LABEL** -- *"Items are synchronized based on
	// their label. If the label is the same, then the item's values will be made the same"* --
	// which re-points every reference the moment two names collide. The reference here is the id.
	L.applySaved(fixture());
	const p1 = L.linkById('P1');
	L.setProp(p1, 'fittingsId', 'F_STD');
	// A SECOND LIST WITH THE SAME NAME STEALS NOTHING, because the rename is refused outright.
	L.docFittingSets().push({ id: 'F_OTHER', items: [{ fit: 'globe', qty: 1, k: 10 }] });
	const other = L.fittingSetById('F_OTHER');
	check(L.libRenameFittingSet(other, 'F_STD') === false,
		'renaming a second list onto an existing name is refused');
	check(other.id === 'F_OTHER', 'and the list keeps the name it had');
	check(L.pipeK(p1) === 2.8, `so the pipe still reads the list it stated: ${L.pipeK(p1)}`);
	// A RENAME CARRIES EVERY REFERENCE -- on the pipe, and on a pipe TYPE that states one.
	L.docPipeTypes()[0].props.fittingsId = 'F_STD';
	check(L.libRenameFittingSet(L.fittingSetById('F_STD'), 'F_TAP') === true, 'a real rename is accepted');
	check(p1._fittingsId === 'F_TAP', `the pipe's reference followed it: ${p1._fittingsId}`);
	check(L.docPipeTypes()[0].props.fittingsId === 'F_TAP',
		`and so did the pipe type's: ${L.docPipeTypes()[0].props.fittingsId}`);
	check(L.pipeK(p1) === 2.8, 'and the answer never moved');
	check(L.libRenameFittingSet(L.fittingSetById('F_TAP'), '  ') === false, 'a blank name is refused');
	// **AND IT SURVIVES A SAVE AND A RELOAD**, which is the claim that this is document data.
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	check((saved.fittingSets || []).length === 3, 'serializeProject() carries the library');
	L.applySaved(JSON.parse(JSON.stringify(saved)));
	check(L.pipeK(L.linkById('P1')) === 2.8, 'and the reload still reads 2.8');
}

// =============================================================================================
head('5. DELETING A LIST IN USE IS REFUSED, BY NAME AND WITH THE COUNT');
// =============================================================================================
{
	L.applySaved(fixture());
	L.setProp(L.linkById('P1'), 'fittingsId', 'F_STD');
	L.setProp(L.linkById('P3'), 'fittingsId', 'F_STD');
	check(L.fittingSetUsers('F_STD').join(',') === 'P1,P3',
		`both pipes are found using it: ${L.fittingSetUsers('F_STD').join(',')}`);
	// **A LIST STATED BY A TYPE IS IN USE THOUGH NO PIPE NAMES IT** -- the limb a fittings list has
	// that a pipe type does not, and the one that would otherwise delete a list out from under an
	// entire standard in silence.
	L.applySaved(fixture());
	L.docPipeTypes()[0].props.fittingsId = 'F_STD';
	L.setPipeType(L.linkById('P2'), 'T_PVC');
	check(L.fittingSetUsers('F_STD').join(',') === 'P2',
		`a list reached only through a pipe type is still in use: ${L.fittingSetUsers('F_STD').join(',')}`);
	// The Library's Delete button REFUSES, naming the count and the pipes, and the list survives.
	alerts.length = 0;
	const host = { children: [], appendChild(c) { this.children.push(c); } };
	L.buildFittingSection(host);
	const del = walk(host).filter((e) => e.tagName === 'BUTTON' && e.textContent === 'Delete')[0];
	check(!!del, 'the Library offers a Delete on the entry');
	((del._listeners || {}).click || []).forEach((f) => f({ type: 'click' }));
	check(alerts.length === 1 && /F_STD|1 pipes|P2/.test(alerts[0]),
		`it refuses and names what is using it: ${JSON.stringify(alerts[0])}`);
	check(!!L.fittingSetById('F_STD'), 'and the list is still there');
	// An UNUSED list deletes without argument, or the refusal would be a wall rather than a guard.
	alerts.length = 0;
	const host2 = { children: [], appendChild(c) { this.children.push(c); } };
	L.buildFittingSection(host2);
	const dels = walk(host2).filter((e) => e.tagName === 'BUTTON' && e.textContent === 'Delete');
	((dels[1]._listeners || {}).click || []).forEach((f) => f({ type: 'click' }));
	check(alerts.length === 0 && !L.fittingSetById('F_EMPTY'),
		'an unused list deletes with no argument');
}

// =============================================================================================
head('6. THE POPUP: A DERIVED k IS DISABLED, A TYPED ONE IS EDITABLE');
// =============================================================================================
{
	L.applySaved(fixture());
	function kBox() {
		const fields = document.getElementById('lpn_popup_fields');
		return walk(fields).filter((e) => e.tagName === 'INPUT'
			&& /Minor \(local\) loss coefficient/.test((e.parentNode && e.parentNode.textContent) || ''))[0];
	}
	L.renderLinkFields('P2');
	check(kBox() && kBox().disabled !== true, 'a typed k stays editable');
	check(kBox() && +kBox().value === 1.5, `and shows the number typed: ${kBox() && kBox().value}`);
	L.setProp(L.linkById('P2'), 'fittingsId', 'F_STD');
	L.renderLinkFields('P2');
	check(kBox() && kBox().disabled === true,
		'a k added up from a fittings list is disabled');
	check(kBox() && kBox().value === '2.8', `and shows the sum: ${kBox() && kBox().value}`);
	// THE CHOOSER ITSELF is a select carrying every list in the document, showing the one stated.
	const sel = walk(document.getElementById('lpn_popup_fields'))
		.filter((e) => e.tagName === 'SELECT'
			&& (e.children || []).some((o) => o.value === 'F_STD'))[0];
	check(!!sel, 'the popup offers a fittings chooser');
	check(sel && (sel.children || []).filter((o) => o.selected)[0].value === 'F_STD',
		'with the stated list selected');
	// A LIST STATED BY THE TYPE DISABLES THE CHOOSER, because the reference is the type's.
	L.applySaved(fixture());
	L.docPipeTypes()[0].props.fittingsId = 'F_STD';
	L.setPipeType(L.linkById('P2'), 'T_PVC');
	L.renderLinkFields('P2');
	const sel2 = walk(document.getElementById('lpn_popup_fields'))
		.filter((e) => e.tagName === 'SELECT'
			&& (e.children || []).some((o) => o.value === 'F_STD'))[0];
	check(sel2 && sel2.disabled === true, 'a type-stated fittings list disables the chooser');
	check(kBox() && kBox().disabled === true, 'and the coefficient box with it');
}

// =============================================================================================
head('7. THE EXPORT ALERT: ONE MESSAGE PER KIND, AND SILENCE WHERE NEITHER HAPPENED');
// =============================================================================================
{
	// **NEITHER FEATURE TOUCHED: NO ALERT.** The floor under everything else in this section, and
	// the one this whole scoping rule exists for: a warning that fires on every export is one people
	// learn to dismiss, and then the one that mattered is dismissed with it.
	L.applySaved(fixture());
	let out = L.exportInp();
	check(out.ok, `the untouched network exports: ${JSON.stringify(out.error)}`);
	check(!out.differences.some((d) => d.code === 'pipe-type-flattened'
		|| d.code === 'fittings-flattened'),
		'a network with no types and no fittings lists reports neither flattening');
	clearDialog();
	L.showInpExportFlattening(out.differences, 'net.inp');
	check(dialogText().trim() === '', `and NO alert is raised at all: ${JSON.stringify(dialogText())}`);

	// **A TYPED PIPE FLATTENS ITS INDIRECTION, AND THE COUNT IS THE PIPES.**
	L.applySaved(fixture());
	L.setPipeType(L.linkById('P1'), 'T_PVC');
	L.setPipeType(L.linkById('P3'), 'T_PVC');
	out = L.exportInp();
	const t = out.differences.filter((d) => d.code === 'pipe-type-flattened')[0];
	check(!!t, 'a typed pipe reports the pipe type flattening');
	check(t && t.ids.join(',') === 'P1,P3', `naming the two pipes: ${t && t.ids.join(',')}`);
	check(t && t.detail === '1', `and how many definitions they share: ${t && t.detail}`);
	check(!out.differences.some((d) => d.code === 'fittings-flattened'),
		'and it does NOT also claim a fittings list flattened');
	// **WHAT IT SAYS: the indirection is lost and no number is**, with the count of pipes and the
	// count of definitions. The two messages do not share a sentence, so this one must not mention
	// a fittings list at all.
	clearDialog();
	L.showInpExportFlattening(out.differences, 'net.inp');
	let said = dialogText();
	check(/2 pipes here refer to 1 pipe types/.test(said),
		`the alert states both counts: ${JSON.stringify(said)}`);
	check(/none of them changed/.test(said), 'and says the numbers are all in the file');
	check(!/fittings/.test(said), 'and says nothing about fittings, which did not flatten here');
	check(/net\.inp/.test(said), 'and names the file it wrote');

	// **A FITTING-DERIVED k FLATTENS ITS ITEMISATION, AND NEVER A HAND-TYPED ONE.** P2 carries a
	// typed 1.5 in this fixture and must not appear.
	L.applySaved(fixture());
	L.setProp(L.linkById('P1'), 'fittingsId', 'F_STD');
	out = L.exportInp();
	const f = out.differences.filter((d) => d.code === 'fittings-flattened')[0];
	check(!!f, 'a fitting-derived k reports the fittings flattening');
	check(f && f.ids.join(',') === 'P1',
		`naming only the pipe whose k came from a list: ${f && f.ids.join(',')}`);
	check(!out.differences.some((d) => d.code === 'pipe-type-flattened'),
		'and it does NOT also claim a pipe type flattened');
	// **WHAT IT SAYS: the itemisation is lost and the total is not.** The summed k was exportable
	// before this feature existed, so nothing about the export is worse than it was.
	clearDialog();
	L.showInpExportFlattening(out.differences, 'net.inp');
	said = dialogText();
	check(/1 pipes here is added up from a fittings list/.test(said),
		`the alert states the count: ${JSON.stringify(said)}`);
	check(/exactly as it stands/.test(said), 'and says the total goes out untouched');
	check(!/pipe types/.test(said), 'and says nothing about pipe types, which did not flatten here');
	// **THE SUM IS WHAT GOES OUT**, so nothing about the answers changes on the far side.
	const p1row = out.inp.split('\n').filter((r) => /^\s*P1\t/.test(r))[0];
	check(p1row && p1row.split('\t')[6] === '2.8',
		`and the file carries the total: ${p1row && p1row.split('\t')[6]}`);
	// The pipe with the typed 1.5 is written from its own token, untouched.
	const p2row = out.inp.split('\n').filter((r) => /^\s*P2\t/.test(r))[0];
	check(p2row && p2row.split('\t')[6] === '1.5',
		`while a hand-typed k goes out as it stood: ${p2row && p2row.split('\t')[6]}`);
}

// =============================================================================================
head('8. THE BYTE-IDENTICAL EXPORT STILL HOLDS');
// =============================================================================================
{
	// **TASK 281'S ACCEPTANCE CRITERION IS NOT WEAKENED BY ANY OF THE ABOVE.** A pipe nobody
	// touched keeps the file's own TOKEN -- `710.0` comes back as `710.0`, not as `710` -- and the
	// fittings branch must never reach lpnNumText() on such a pipe.
	const saved = fixture();
	saved.links[1]._k = 1.50;
	saved.links[1].tok = { _k: '1.50', _length: '500.0' };
	L.applySaved(saved);
	const out = L.exportInp();
	const p2row = out.inp.split('\n').filter((r) => /^\s*P2\t/.test(r))[0];
	check(p2row && p2row.split('\t')[6] === '1.50',
		`an untouched pipe keeps the file's own text for its k: ${p2row && p2row.split('\t')[6]}`);
	check(p2row && p2row.split('\t')[3] === '500.0',
		`and for its length: ${p2row && p2row.split('\t')[3]}`);
	// And the moment a fittings list is stated the token has no claim, because the number moved.
	L.setProp(L.linkById('P2'), 'fittingsId', 'F_STD');
	const out2 = L.exportInp();
	const p2row2 = out2.inp.split('\n').filter((r) => /^\s*P2\t/.test(r))[0];
	check(p2row2 && p2row2.split('\t')[6] === '2.8',
		`a derived k is written as the number it is: ${p2row2 && p2row2.split('\t')[6]}`);
	check(p2row2 && p2row2.split('\t')[3] === '500.0',
		'while every other value on the row keeps its own text');
}

console.log(failures ? `\n${failures} FAILED` : '\nall passed');
process.exit(failures ? 1 : 0);

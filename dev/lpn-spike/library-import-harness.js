// IMPORT LIBRARIES FROM ANOTHER PROJECT FILE (ROADMAP Task 611). Run:
//   node dev/lpn-spike/library-import-harness.js
//
// Tom, 2026-09-08: *"If the Libraries have Import buttons that ask for selecting another project
// file, then import anything that is not a name conflict, that probably would be all that's
// needed."* And 2026-09-17, after using it: *"there should be a single 'Import libraries...' wizard
// available from every applicable library"*, *"Move the button to the File menu"*, *"SI: I don't see
// any line saying the file does not show its numbers in this project's units"*, and -- the one that
// matters most, because an import a person cannot undo is one they cannot safely try --
// *"Undo doesn't work."* Then 2026-09-18, after using it again: *"Remove buttons except at the File
// menu."* and *"This is too wordy and confusing. Have mercy on the humans."* -- the first reverses
// his own *"every applicable library"* sentence, and the later word wins.
//
// **THE TWO THINGS THAT GO WRONG HERE ARE BOTH SILENT, AND SECTIONS 2 AND 4 ARE THEM.**
//
//   * A name conflict RESOLVED rather than reported. The reference a pipe or a pump stores is the
//     id, so merging two definitions that share a label re-points every reference and nothing looks
//     wrong from the software's side -- Bentley's own Engineering Libraries defect, cited in
//     dev/pipe-library-design.md §4. Renaming the incoming one instead is the same failure from the
//     other side: two definitions where the user expected one, under a name nobody chose.
//   * A curve arriving WITHOUT ITS TOKENS. `parseFloat()` threw the text away at the one place text
//     became number, so a `300.0` that crosses without its token can only ever leave as `300`, and
//     the byte-identical round trip CLAUDE.md makes an absolute stops holding. Nothing warns
//     anybody: the number is right and only its spelling is gone.
//
// Sections:
//   1. the three libraries copy across, and a definition is CLONED rather than adopted
//   2. a name already taken here is skipped and REPORTED, and nothing of ours is touched
//   3. an import that finds nothing does not write an empty list into the document
//   4. a curve carries its kind, its note, its `src` lines and its per-coordinate tokens
//   5. a pipe type whose fittings list did not come with it is reported, not repaired
//   6. a curve a run cannot use is still copied in, and named
//   7. differing units are disclosed BEFORE the import, and NOTHING is converted
//   8. the Libraries box carries NO import button of its own, and the picker is wired
//   9. the chooser: one wizard, a checkbox per library the file holds, with its count
//  10. several libraries out of one file are ONE act -- one undo snapshot, one receipt
//  11. one undo puts the document AND the Libraries box back
//  12. the wizard has its own row in the File menu, and that row is the only door

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tseedDefaultInputs: seedDefaultInputs, setDoc: function (d) { doc = d; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tcurveById: curveById, pipeTypeById: pipeTypeById, fittingSetById: fittingSetById,\n" +
	"\t\tlibImportText: libImportText, libImportRun: libImportRun, libImportPick: libImportPick,\n" +
	"\t\tlibImportChoose: libImportChoose, libImportOffer: libImportOffer,\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\tlibImportUnitDiffs: libImportUnitDiffs, openFileMenu: openFileMenu,\n" +
	"\t\trebuildLibraryBox: rebuildLibraryBox, setLibSection: function (s) { libSection = s; },\n" +
	"\t\tlibCurveRunnable: libCurveRunnable,\n" +
	"\t\tbuildCurveSection: buildCurveSection, buildPipeTypeSection: buildPipeTypeSection,\n" +
	"\t\tbuildFittingSection: buildFittingSection, libEl: libEl,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-fittings.js'));

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }

// The stub's querySelectorAll() answers nothing, so the walk is the harness's own.
function walk(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}
// **THE REPORT IS READ OUT OF THE DIALOG, NEVER OUT OF A LITERAL HERE.** Every assertion below
// compares against EngCalcs.pageConfig.<key> with its placeholders left open, so rewording a
// string cannot turn this file red -- harness_wording_check.php's rule, and the whole reason
// dev/english-key-rulings.json can let a ruling lapse for free.
function reportLines() {
	const body = document.getElementById('lpn_dialog_body');
	return walk(body).filter(function (e) { return String(e.tagName).toLowerCase() === 'li'; })
		.map(function (e) { return String(e.textContent || ''); });
}
function reportHeading() {
	const body = document.getElementById('lpn_dialog_body');
	return walk(body).filter(function (e) { return String(e.tagName).toLowerCase() === 'p'; })
		.map(function (e) { return String(e.textContent || ''); })[0] || '';
}
// One language value as a regular expression with its {placeholders} left open, so what is pinned
// is WHICH message spoke and never how it is worded.
function pat(key) {
	const v = String((EngCalcs.pageConfig || {})[key] || '');
	if (!v) { throw new Error('no pageConfig value for ' + key); }
	return new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.*'));
}
function said(key) { return reportLines().some(function (t) { return pat(key).test(t); }); }
function saidOne(key) {
	const re = pat(key);
	return reportLines().filter(function (t) { return re.test(t); })[0] || '';
}
function clearReport() { document.getElementById('lpn_dialog_body').innerHTML = ''; }

// **THE WIZARD IS DRIVEN THROUGH ITS OWN DIALOG, NEVER AROUND IT.** libImportText() analyses the
// file and opens the chooser; these press its boxes and its buttons the way a person does, so what
// the sections below assert is what the wizard DOES and not what libImportRun() would do if it
// were asked directly. The stub carries `_listeners` rather than an event system, which is the
// seam every harness here drives a control through.
const KIND_LABEL = { curves: 'lpn_library_curves', pipetypes: 'lpn_library_pipetypes',
	fittings: 'lpn_library_fittings' };
function tag(e) { return String(e.tagName).toLowerCase(); }
function chooserRows() {
	const body = document.getElementById('lpn_dialog_body');
	return walk(body).filter(function (e) { return tag(e) === 'label'; }).map(function (lab) {
		const kids = walk(lab),
			input = kids.filter(function (e) { return e.type === 'checkbox'; })[0],
			text = kids.filter(function (e) { return tag(e) === 'span'; })
				.map(function (e) { return String(e.textContent || ''); })[0] || '';
		const kind = Object.keys(KIND_LABEL).filter(function (k) {
			return text.indexOf(String((EngCalcs.pageConfig || {})[KIND_LABEL[k]])) === 0;
		})[0];
		return { kind: kind, text: text, input: input };
	});
}
function dialogButton(label) {
	return walk(document.getElementById('lpn_dialog_buttons'))
		.filter(function (e) { return tag(e) === 'button' && e.textContent === label; })[0];
}
function press(label) {
	const b = dialogButton(label);
	if (!b) { throw new Error('no dialog button labelled ' + label); }
	(b._listeners.click || []).forEach(function (f) { f(); });
}
// **A BOX IS TICKED THROUGH ITS OWN CHANGE LISTENER, NEVER BY SETTING `.checked` ALONE.** The unit
// disclosure below the boxes is rebuilt by that listener, so a harness that only assigned the
// property would be testing the wizard with half its wiring cut -- exactly the stub-removes-the-
// coupling failure dev/testing-notes.md names. The stub keeps listeners in `_listeners`; firing
// them is the whole of what a real checkbox click adds.
function tick(input, on) {
	if (input.checked === on) { return; }
	input.checked = on;
	(input._listeners.change || []).forEach(function (f) { f(); });
}
// What the chooser is saying about units, right now, as a list of rendered <li> strings. Read out
// of the CHOOSER's body rather than the receipt's, which is the whole point of Task 611's units
// item: by the time a receipt exists the definitions are already in the document.
function chooserUnitLines() {
	const body = document.getElementById('lpn_dialog_body');
	return walk(body).filter(function (e) { return tag(e) === 'li'; })
		.map(function (e) { return String(e.textContent || ''); });
}
function chooserSaysUnits() {
	const body = document.getElementById('lpn_dialog_body');
	const re = pat('lpn_library_import_units');
	return walk(body).filter(function (e) { return tag(e) === 'p'; })
		.some(function (e) { return re.test(String(e.textContent || '')); });
}
// Pick the file and stop at the chooser, so a section can read what it says before pressing
// anything. The wizard's own defaults are in place: every box the file offers, checked.
function openWizard(text, fileName) {
	clearReport();
	L.libImportText(text, fileName);
}
// Pick the file, check exactly the libraries named (every box opens checked), press Import.
// `want` omitted means take the wizard's own defaults, which is everything the file holds.
function wizard(text, fileName, want) {
	openWizard(text, fileName);
	if (want) {
		chooserRows().forEach(function (r) { tick(r.input, want.indexOf(r.kind) >= 0); });
	}
	press((EngCalcs.pageConfig || {}).lpn_library_import_go);
}

const FIXTURE = JSON.parse(fs.readFileSync(path.join(__dirname, 'library-import-fixture.lwn'), 'utf8'));
function fixture() { return JSON.parse(JSON.stringify(FIXTURE)); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---- 1. THE THREE LIBRARIES COPY ACROSS -------------------------------------------------------
head('1. the three libraries copy across, and a definition is cloned rather than adopted');
(function () {
	const src = fixture();
	wizard(JSON.stringify(src), 'standards.lwn', ['pipetypes']);
	const d = L.getDoc();
	check((d.pipeTypes || []).length === 2, `both pipe types landed: ${JSON.stringify((d.pipeTypes || []).map(t => t.id))}`);
	check(L.pipeTypeById('DIP-8').props.diameter === 8 && L.pipeTypeById('DIP-8').props.roughness === 130,
		'the numbers came across exactly as the file wrote them');
	check(L.pipeTypeById('DIP-8').note === src.pipeTypes[0].note, 'the note came with it');
	check(said('lpn_library_import_added'), `the report names what it copied in: ${JSON.stringify(reportLines())}`);
	check(pat('lpn_library_import_heading').test(reportHeading()),
		`the heading names the file: ${reportHeading()}`);
	// A CLONE, NOT THE SOURCE OBJECT. The parsed document is about to be dropped; sharing a
	// reference into it would leave two projects editing one object the day anything held on.
	L.pipeTypeById('DIP-8').props.diameter = 6;
	check(src.pipeTypes[0].props.diameter === 8,
		'editing the imported type does not reach back into the parsed source document');
	L.pipeTypeById('DIP-8').props.diameter = 8;

	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['fittings']);
	check((L.getDoc().fittingSets || []).length === 1, 'the fittings list landed');
	check(EngCalcs.lpnFittingsSum(L.fittingSetById('Hydrant-lateral')).toFixed(3) === (1.8 + 0.2 + 2 * 0.8).toFixed(3),
		`its items add up through the one arithmetic: ${EngCalcs.lpnFittingsSum(L.fittingSetById('Hydrant-lateral'))}`);

	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['curves']);
	check((L.getDoc().curves || []).length === 2,
		`both curves landed: ${JSON.stringify((L.getDoc().curves || []).map(c => c.id))}`);
}());

// ---- 2. A NAME ALREADY TAKEN IS SKIPPED AND REPORTED -------------------------------------------
head('2. a name already taken here is skipped and reported, and nothing of ours is touched');
(function () {
	// Net1's own curve `1`, sitting in the project already. The fixture's `1` is a DIFFERENT pump
	// under the same name, which is the collision this section exists for.
	const mine = { id: '1', kind: 'head', note: 'mine', points: [[0, 250], [500, 120]] };
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 }, curves: [mine] });
	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['curves']);
	const d = L.getDoc();
	check(d.curves.length === 2, `one landed and one was skipped: ${JSON.stringify(d.curves.map(c => c.id))}`);
	check(L.curveById('1') === mine, 'the definition already here is the same object it was');
	check(JSON.stringify(L.curveById('1').points) === JSON.stringify([[0, 250], [500, 120]]),
		'not one of its numbers moved');
	check(!!L.curveById('Booster-B'), 'the one whose name was free came in');
	check(said('lpn_library_import_conflict'), `the clash is reported: ${JSON.stringify(reportLines())}`);
	check(saidOne('lpn_library_import_conflict').indexOf('1') >= 0, 'and it is reported BY NAME');
	// NOT RENAMED. A `1 (2)` or a `1-1` would be a definition under a name nobody chose.
	check(!d.curves.some(function (c) { return c.id !== '1' && c.id !== 'Booster-B'; }),
		'nothing arrived under an invented name');
}());

// A second copy of one name INSIDE the source file clashes with the first, not with whatever
// happened to come last.
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportRun({
		v: 6, units: {},
		pipeTypes: [{ id: 'T1', props: { diameter: 4 } }, { id: 'T1', props: { diameter: 99 } }]
	}, 'twice.lwn', ['pipetypes']);
	check(L.getDoc().pipeTypes.length === 1 && L.pipeTypeById('T1').props.diameter === 4,
		'the first T1 lands and the second is the clash, not the winner');
	check(said('lpn_library_import_conflict'), 'and the duplicate inside the file is reported too');
}());

// ---- 3. AN EMPTY IMPORT WRITES NOTHING ---------------------------------------------------------
head('3. an import that finds nothing does not write an empty list into the document');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportRun({ v: 6, units: {} }, 'bare.lwn', ['curves']);
	const d = L.getDoc();
	// The materialising getter writing `curves: []` into a document that stated none is a change to
	// the document -- the rule every library on this page is under, and what
	// dev/lpn-spike/unit-change-harness.js catches as a save that was not byte-identical after all.
	check(!Object.prototype.hasOwnProperty.call(d, 'curves'),
		`no curves key was created: ${JSON.stringify(Object.keys(d))}`);
	check(said('lpn_library_import_none'), `and it says so: ${JSON.stringify(reportLines())}`);
}());

// ---- 4. A CURVE CARRIES ITS KIND AND ITS SOURCE TOKENS -----------------------------------------
head('4. a curve carries its kind, its note, its src lines and its per-coordinate tokens');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	const src = fixture();
	wizard(JSON.stringify(src), 'standards.lwn', ['curves']);
	const c = L.curveById('Booster-B'), want = src.curves[1];
	check(c.kind === 'head', `the kind crossed: ${c.kind}`);
	check(c.note === want.note, 'the note crossed');
	check(c.points.length === 5, `every one of the five points crossed, unsampled: ${c.points.length}`);
	check(JSON.stringify(c.tok) === JSON.stringify(want.tok), `the token bag crossed whole: ${JSON.stringify(c.tok)}`);
	check(JSON.stringify(c.src) === JSON.stringify(want.src), 'the file\'s own [CURVES] lines crossed');
	// **AND THE TOKENS ARE WHAT THEY ARE FOR.** `String(parseFloat())` reproduces neither `300.0`
	// nor `104.`, so this is the assertion that would fail if the clone dropped `tok`.
	const lines = EngCalcs.lpnCurveLines(c, { same: true, mul: 1 }, { same: true, mul: 1 });
	check(lines.join('\n') === want.src.join('\n'),
		`the curve writes back character for character:\n${lines.join('\n')}`);
	check(lines.some(function (l) { return l.indexOf('300.0') >= 0; })
			&& lines.some(function (l) { return l.indexOf('104.') >= 0; }),
		'including the two tokens String(parseFloat()) cannot reproduce');
	check(EngCalcs.lpnCurveTypeWord(c.kind) === 'PUMP',
		'and its kind is one of EPANET\'s four, so it can state itself in a ;PUMP: comment');
}());

// ---- 5. A PIPE TYPE WHOSE FITTINGS LIST DID NOT COME WITH IT -----------------------------------
head('5. a pipe type whose fittings list did not come with it is reported, not repaired');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['pipetypes']);
	check(said('lpn_library_import_needs_fittings'),
		`the dangling reference is reported: ${JSON.stringify(reportLines())}`);
	check(saidOne('lpn_library_import_needs_fittings').indexOf('DIP-8') >= 0, 'by name');
	// NOTHING IS REPAIRED: the reference stands, and the type keeps saying what the file said.
	check(L.pipeTypeById('DIP-8').props.fittingsId === 'Hydrant-lateral',
		'the reference is left exactly as the file stated it');
	// Import the fittings library too and the reference resolves, with no second act on the type.
	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['fittings']);
	check(!!L.fittingSetById(L.pipeTypeById('DIP-8').props.fittingsId),
		'importing the fittings library from the same file makes it resolve');
	check(!said('lpn_library_import_needs_fittings'), 'and nothing is said about it the second time');
}());

// ---- 6. A CURVE A RUN CANNOT USE ---------------------------------------------------------------
head('6. a curve a run cannot use is still copied in, and named');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	// x not strictly increasing. EPANET refuses such a curve whatever its kind.
	L.libImportRun({ v: 6, units: {},
		curves: [{ id: 'Backwards', kind: 'head', points: [[0, 300], [0, 200], [500, 100]] }]
	}, 'odd.lwn', ['curves']);
	check(!!L.curveById('Backwards'),
		'it is COPIED IN, because dropping it would be the silent loss this whole task is about');
	check(JSON.stringify(L.curveById('Backwards').points) === JSON.stringify([[0, 300], [0, 200], [500, 100]]),
		'and not one point was repaired');
	check(said('lpn_library_import_curve_shape'), `and the report says a run cannot use it: ${JSON.stringify(reportLines())}`);
	check(L.libCurveRunnable({ points: [[0, 300], [500, 100]] }), 'a two point falling curve IS runnable');
	check(L.libCurveRunnable({ points: [[0, 300]] }), 'so is a single point curve, which is EPANET\'s own convention');
	check(!L.libCurveRunnable({ points: [] }), 'an empty curve is not');
}());

// ---- 7. DIFFERING UNITS ARE REPORTED AND NOTHING IS CONVERTED ---------------------------------
// **SAID BEFORE ANYTHING IS TAKEN, WHICH IS THE WHOLE OF THIS SECTION** (Tom, 2026-09-17: *"SI: I
// don't see any line saying the file does not show its numbers in this project's units."*). It used
// to be the last line of the RECEIPT, where the only remedy left is Undo; it is now the last thing
// the chooser says above the Import button. So every assertion here reads the CHOOSER, and the two
// at the end read the receipt to prove it is not also said there -- twice is a warning about a
// decision the user has already taken, not a disclosure.
//
// **AND IT IS A DISCLOSURE, NOT A CONVERSION.** Changing a unit on this page reinterprets a typed
// number rather than converting it, and a number that came from a file is the user's: both
// absolute. The number assertion below is the one that would catch a future "helpful" conversion.
head('7. differing units are disclosed BEFORE the import, and nothing is converted');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	const src = fixture();
	src.units.lpn_u_diameter = 'mm';
	openWizard(JSON.stringify(src), 'metric.lwn');
	check(chooserSaysUnits(), 'the chooser discloses the difference before anything is imported');
	// THE TWO DECLARATIONS, SIDE BY SIDE AND NAMED. "Units differ" on its own tells a person
	// nothing they can act on; which quantity, and which two units, is the whole content.
	const line = chooserUnitLines().filter(t => pat('lpn_library_import_units_line').test(t))[0] || '';
	check(!!line, `and names the quantity and both units: ${JSON.stringify(chooserUnitLines())}`);
	check(line.indexOf(String(pc.lpn_field_diameter)) >= 0, 'the quantity is named');
	check(/\bmm\b/.test(line) && /\bin\b/.test(line), `both unit labels appear: ${line}`);
	// **NOTHING IN THE CHOOSER OFFERS TO CONVERT.** Two buttons and no third: the only answers are
	// take the numbers as the file wrote them, or do not take them. A convert button added here
	// later fails this, which is the point -- it would be the third conversion site.
	const btns = walk(document.getElementById('lpn_dialog_buttons'))
		.filter(e => tag(e) === 'button').map(e => String(e.textContent || ''));
	check(btns.length === 2 && btns.indexOf(String(pc.lpn_library_import_go)) >= 0
		&& btns.indexOf(String(pc.lpn_cancel)) >= 0,
		`the chooser offers Import and Cancel and nothing else: ${JSON.stringify(btns)}`);

	// IT FOLLOWS THE BOXES, because whether it is TRUE depends on what is being taken. A fittings
	// list carries no unit at all, so a metric file has nothing to disclose to somebody taking only
	// the fittings -- and a warning that stands there anyway is one the reader learns to look past.
	const metric = fixture();
	metric.units.lpn_u_diameter = 'mm';
	metric.units.lpn_u_flow = 'lps';
	openWizard(JSON.stringify(metric), 'metric.lwn');
	check(chooserSaysUnits(), 'with everything checked, a metric file discloses');
	chooserRows().forEach(function (r) { tick(r.input, r.kind === 'fittings'); });
	check(!chooserSaysUnits(),
		'unchecking all but the fittings withdraws it, because a coefficient has no unit');
	chooserRows().forEach(function (r) { tick(r.input, r.kind === 'pipetypes'); });
	check(chooserSaysUnits(), 'and checking the pipe types brings it back');
	check(chooserUnitLines().length === 1, 'one line, for the one quantity pipe types depend on');

	// A file that states this project's own units has nothing to disclose, and an OLDER file that
	// stated no units at all is not making a claim we can contradict.
	openWizard(JSON.stringify(fixture()), 'same.lwn');
	check(!chooserSaysUnits(), 'a file in this project\'s own units says nothing about units');
	const silent = fixture();
	delete silent.units;
	openWizard(JSON.stringify(silent), 'old.lwn');
	check(!chooserSaysUnits(), 'and a file that declares no units at all says nothing either');

	// **THE NUMBER IS THE USER'S.** A definition crossing from a file that showed millimetres lands
	// as written and now means inches. A 203.2 here would be the third conversion site CLAUDE.md
	// warns about.
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	wizard(JSON.stringify(src), 'metric.lwn', ['pipetypes']);
	check(L.pipeTypeById('DIP-8').props.diameter === 8, 'and the number is the file\'s own, unconverted');
	// AND THE RECEIPT DOES NOT SAY IT AGAIN.
	check(!said('lpn_library_import_units'),
		`the receipt does not repeat it: ${JSON.stringify(reportLines())}`);
	check(!said('lpn_library_import_units_line'), 'nor the line naming the two units');
}());

// ---- 8. THE BUTTON AND THE PICKER --------------------------------------------------------------
head('8. the Libraries box carries NO import button, and the picker is wired');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	// **ONE DOOR, AND IT IS THE FILE MENU** (Tom, 2026-09-18: *"Remove buttons except at the File
	// menu."*). Each of the three sections carried the same button until he used it; a control
	// repeated in three places is three places to notice it and one behaviour to keep in step, and
	// the file rather than the section decides what is on offer anyway. THIS ASSERTION IS THE
	// RATCHET: a button put back in any section fails here.
	[['curves', L.buildCurveSection], ['pipetypes', L.buildPipeTypeSection],
		['fittings', L.buildFittingSection]].forEach(function (pair) {
		const host = L.libEl('div');
		pair[1](host);
		const hit = walk(host).filter(function (e) {
			return String(e.tagName).toLowerCase() === 'button'
				&& e.textContent === pc.lpn_library_import;
		});
		check(hit.length === 0, `the ${pair[0]} section carries no Import button of its own`);
	});
	// ONE LABEL, ONE KEY, and it is still supplied rather than falling back to a literal.
	check(typeof pc.lpn_library_import === 'string' && pc.lpn_library_import !== '',
		'and its label is supplied through pageConfig rather than a fallback literal');
	// The picker is a hidden input in the page, and the section that asked is remembered across
	// the trip out to it. A missing input must not throw.
	let clicked = 0;
	const input = document.getElementById('lpn_library_file');
	input.click = function () { clicked++; };
	L.libImportPick();
	check(clicked === 1, 'pressing Import opens the page\'s own hidden picker');
}());

// ---- 9. THE CHOOSER ----------------------------------------------------------------------------
head('9. the chooser: one wizard, a checkbox per library the file holds, with its count');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn');
	const rows = chooserRows();
	// THE FILE DECIDES WHAT IS ON OFFER, NOT THE SECTION THE BUTTON WAS PRESSED IN. Tom's own
	// wizard: one entry point, and step 2 is what this file turned out to hold.
	check(rows.length === 3, `every library the file holds is offered: ${JSON.stringify(rows.map(r => r.text))}`);
	check(rows.map(r => r.kind).join(',') === 'curves,pipetypes,fittings',
		`in the Libraries box's own section order: ${rows.map(r => r.kind).join(',')}`);
	// **THE COUNT IS THE POINT OF STEP 2**: it is the only thing on this screen that says what the
	// file actually holds, so somebody who chose the wrong file finds out before anything lands.
	check(rows.filter(r => r.kind === 'curves')[0].text
			=== pc.lpn_library_import_count.replace('{name}', pc.lpn_library_curves).replace('{count}', '2'),
		`each name carries its count: ${rows.filter(r => r.kind === 'curves')[0].text}`);
	// EVERY BOX OPENS CHECKED. Somebody who pressed Import libraries has already said what they
	// want; the boxes are there to take something out of that, which is the rarer half.
	check(rows.every(r => r.input.checked === true), 'and every box opens checked');
	// **THE ONE-LINE NOTE, AND IT IS THE WHOLE OF THE PROSE ON THIS SCREEN** (Tom, 2026-09-18:
	// *"This is too wordy and confusing. Have mercy on the humans."*). A library is taken whole, so
	// the only thing a person has to be told before pressing Import is that they undo an unwanted
	// entry afterwards the way they undo any other one.
	check(walk(document.getElementById('lpn_dialog_body')).filter(e => tag(e) === 'p')
		.some(e => pat('lpn_library_import_note').test(String(e.textContent || ''))),
		'the chooser carries the one-line note about taking a library whole');
	// PER LIBRARY, NEVER PER ENTRY (Declan). Nothing here offers a definition one at a time.
	check(rows.length === chooserRows().filter(r => !!r.kind).length,
		'the boxes are libraries, not entries');
	check(!!dialogButton(pc.lpn_cancel), 'and the chooser can be cancelled');

	// CANCEL TOUCHES NOTHING.
	press(pc.lpn_cancel);
	check(!L.getDoc().curves && !L.getDoc().pipeTypes,
		`cancelling the chooser imports nothing: ${JSON.stringify(Object.keys(L.getDoc()))}`);

	// AN UNCHECKED LIBRARY IS NOT IMPORTED, AND IS NOT REPORTED EITHER.
	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn', ['fittings']);
	check((L.getDoc().fittingSets || []).length === 1, 'the checked library lands');
	check(!L.getDoc().curves && !L.getDoc().pipeTypes,
		'and an unchecked one is not written into the document at all');
	check(reportLines().length === 1, `the receipt speaks only about what was taken: ${JSON.stringify(reportLines())}`);

	// NOTHING CHECKED IS THE SAME ANSWER AS CANCEL, GIVEN A LONGER WAY ROUND.
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn');
	chooserRows().forEach(function (r) { r.input.checked = false; });
	press(pc.lpn_library_import_go);
	check(!L.getDoc().curves && !L.getDoc().pipeTypes && !L.getDoc().fittingSets,
		'nothing checked imports nothing');
	check(reportLines().length === 0, 'and reports nothing, because a receipt for an import that never happened reads as a failure');

	// A FILE WITH NO LIBRARY IN IT NEVER REACHES THE CHOOSER: there is nothing to choose between.
	clearReport();
	L.libImportText(JSON.stringify({ format: 'hawsedc-lpn', v: 6, nodes: [], links: [], labels: [],
		origin: { x: 0, y: 0 }, units: {} }), 'bare.lwn');
	check(chooserRows().length === 0, 'a file with no libraries offers no boxes');
	check(said('lpn_library_import_no_libraries'), `and says so outright: ${JSON.stringify(reportLines())}`);
}());

// ---- 10. SEVERAL LIBRARIES ARE ONE ACT ---------------------------------------------------------
head('10. several libraries out of one file are one act: one undo snapshot, one receipt');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	wizard(JSON.stringify(fixture()), 'standards.lwn');
	const d = L.getDoc();
	check((d.curves || []).length === 2 && (d.pipeTypes || []).length === 2
		&& (d.fittingSets || []).length === 1, 'all three libraries land in one pass');
	// **THE DANGLING REFERENCE IS THE WHOLE REASON THIS IS ONE ACT.** Taking the pipe types alone
	// left DIP-8 pointing at a fittings list this project did not have; taking both in one pass
	// resolves it, and the report must not warn about a reference that now resolves.
	check(!!L.fittingSetById(L.pipeTypeById('DIP-8').props.fittingsId),
		'a pipe type finds the fittings list that came with it');
	check(!said('lpn_library_import_needs_fittings'),
		`and nothing is reported about a reference that resolves: ${JSON.stringify(reportLines())}`);
	// ONE RECEIPT, WITH EACH LIBRARY UNDER ITS OWN NAME -- `Copied in: DIP-8, 1, Hydrant-lateral`
	// would say nothing about where any of them went.
	const titles = walk(document.getElementById('lpn_dialog_body'))
		.filter(e => tag(e) === 'p').map(e => String(e.textContent || ''));
	check(pat('lpn_library_import_heading').test(titles[0]), `one heading, naming the file: ${titles[0]}`);
	[pc.lpn_library_curves, pc.lpn_library_pipetypes, pc.lpn_library_fittings].forEach(function (name) {
		check(titles.indexOf(name) > 0, `the receipt has a block headed ${name}`);
	});
	// ONE UNDO SNAPSHOT FOR THE WHOLE WIZARD: one button was pressed, so one Undo puts the project
	// back where it was, whether that took in one library or three. Three snapshots here would make
	// a user press Undo three times to get out of one answer they gave once.
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	const before = L.undoDepth();
	wizard(JSON.stringify(fixture()), 'standards.lwn');
	check(L.undoDepth() === before + 1,
		`three libraries in one pass leave exactly one undo step: ${L.undoDepth() - before}`);
	// AND THE UNITS QUESTION IS ASKED ONCE, ABOUT THE FILE, NOT THREE TIMES ABOUT ITS LIBRARIES --
	// asked in the chooser, which is where section 7 says it belongs. Two libraries here depend on
	// three unit selections between them and two of those differ, so the deduplication is real.
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	const metric = fixture();
	metric.units.lpn_u_diameter = 'mm';
	metric.units.lpn_u_flow = 'lps';
	openWizard(JSON.stringify(metric), 'metric.lwn');
	const lead = walk(document.getElementById('lpn_dialog_body')).filter(e => tag(e) === 'p')
		.filter(e => pat('lpn_library_import_units').test(String(e.textContent || '')));
	check(lead.length === 1, `the unit difference is led once, not once per library: ${lead.length}`);
	check(chooserUnitLines().length === 2,
		`one line per differing quantity: ${JSON.stringify(chooserUnitLines())}`);
	// DEDUPLICATED BY QUANTITY, not by library. No two libraries name one unit selector today, so
	// the wizard cannot reach this on its own -- asked directly, because a guard nothing can trip
	// is a guard that quietly stops working. The day a second library declares the flow unit, this
	// is what holds the disclosure to one line about it.
	check(L.libImportUnitDiffs(metric, ['curves', 'curves', 'pipetypes']).length === 2,
		'and a quantity named by two libraries still produces one line');
}());

// ---- 11. UNDO -----------------------------------------------------------------------------------
//
// **Tom, 2026-09-17: *"Undo doesn't work."*** It did, in the document, the whole time -- the
// snapshot deep-clones `doc` and the three libraries ride in it. What did not work was the only
// place a person can SEE those three. The Libraries box is built once and rebuilt by the paths that
// EDIT it, and undo is not one of those paths, so Ctrl+Z restored the document and left the box
// listing rows the project no longer had.
//
// **SO THIS SECTION ASSERTS BOTH HALVES, AND THE SECOND IS THE ONE THAT WAS BROKEN.** A harness
// that only read the document would have passed on the shipped defect, which is precisely why it
// took Tom's eyes to find it. The box is read as rendered DOM.
head('11. one undo puts the document AND the Libraries box back');
(function () {
	const pc = EngCalcs.pageConfig || {};
	// **THIS READS THE BOX AND NEVER REBUILDS IT, WHICH IS THE WHOLE TEST.** A version that called
	// rebuildLibraryBox() here would repaint the box itself and then find it correct however undo
	// behaved -- it would pass on the shipped defect, and the first draft of this section did
	// exactly that. The box is opened on a section ONCE, before the import; every repaint after
	// that is the page's own doing.
	//
	// A row's ID is an <input value> rather than text, so both halves are read: taking textContent
	// alone answers "no DIP-8 here" about a box plainly showing one.
	function openBoxOn(section) { L.setLibSection(section); L.rebuildLibraryBox(); }
	function boxText() {
		const c = document.getElementById('lpn_libbox_content');
		return String(c.textContent || '') + ' '
			+ walk(c).map(function (e) { return e.value; }).filter(Boolean).join(' ');
	}
	// One import-then-undo cycle with the box standing open on one section the whole time, which is
	// where a person is when they press Ctrl+Z after an import they did not want. One section per
	// cycle, because the box shows one at a time.
	function cycle(section, name) {
		L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
		openBoxOn(section);
		check(boxText().indexOf(name) < 0, `${section}: the box shows no ${name} yet`);
		wizard(JSON.stringify(fixture()), 'standards.lwn');
		check(boxText().indexOf(name) >= 0, `${section}: and shows ${name} once the import lands`);
		L.undo();
		check(boxText().indexOf(name) < 0, `${section}: and stops showing it after one undo`);
	}
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	const before = L.undoDepth();
	wizard(JSON.stringify(fixture()), 'standards.lwn');
	check(L.undoDepth() === before + 1, 'the import left exactly one undo step');
	L.undo();
	const d = L.getDoc();
	check(!(d.curves || []).length && !(d.pipeTypes || []).length && !(d.fittingSets || []).length,
		'one undo empties all three libraries in the document');
	check(L.undoDepth() === before, 'the undo step is spent');
	// **THE HALF THAT WAS BROKEN.** Before this fix the box went on listing the rows the import had
	// added, over a document that no longer held them, and the next press of Delete was aimed at a
	// list that no longer had the row.
	cycle('pipetypes', 'DIP-8');
	cycle('curves', 'Booster-B');
	cycle('fittings', 'Hydrant-lateral');
	// AN IMPORT THAT WROTE NOTHING TAKES NO SNAPSHOT, so Ctrl+Z after it is not swallowed by an
	// undo step that would put the document back exactly where it already is.
	const empty = L.undoDepth();
	openWizard(JSON.stringify({ version: 10, nodes: [], links: [], labels: [] }), 'bare.lwn');
	check(L.undoDepth() === empty, 'a file with no libraries adds no undo step');
	void pc;
}());

// ---- 12. THE FILE MENU --------------------------------------------------------------------------
//
// Tom, 2026-09-17: *"Move the button to the File menu. I thought you already did that."* It reads
// one of our own project files, so it belongs beside the rows that open one. It ALSO replaces the
// button that stood in each library section -- 2026-09-18, after using it: *"Remove buttons except
// at the File menu."* That reverses his earlier *"available from every applicable library"*, and
// the later word wins. One wizard, ONE door.
head('12. the wizard has a row in the File menu, beside the rows that open a project file');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	// The menubar button is not in the stub's element list, and this section is about the menu's
	// CONTENTS rather than about where it pops up, so the anchor is a bare element.
	L.openFileMenu(document.createElement('div'));
	const rows = walk(document.getElementById('lpn_menu_list'))
		.map(e => String(e.textContent || ''));
	check(rows.some(t => t.indexOf(String(pc.lpn_library_import)) >= 0),
		`the File menu carries the wizard: ${JSON.stringify(rows.filter(Boolean).slice(0, 12))}`);
	// BELOW THE ROWS THAT OPEN A WHOLE PROJECT, because this one does not open anything: it copies
	// into the project already on screen, and a row that edits the open document sitting above the
	// rows that REPLACE it would read as one of them. Convert as… dropped out of that group under
	// R-213 (Task 696; Tom, 2026-09-24: it acts on the OPEN project, so it now sits beside Save as…
	// instead) -- Import EPANET file… is the last of the rows this one still has to sit below.
	const at = (label) => rows.map((t, i) => [t, i]).filter(p => p[0].indexOf(String(label)) >= 0)
		.map(p => p[1])[0];
	check(at(pc.lpn_library_import) > at(pc.lpn_file_import_inp),
		'below Import EPANET file…, the last of the rows that open a project');
	// AND IT IS THE ONLY ROW ANYWHERE THAT OPENS THE WIZARD. Section 8 asserts the Libraries box
	// has none; this asserts the menu row is genuinely there to have taken their place, so the
	// removal cannot leave the wizard unreachable.
	check(rows.filter(t => t.indexOf(String(pc.lpn_library_import)) >= 0).length >= 1,
		'and the File menu row is the door that remains');
}());

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All library-import checks passed.'));
process.exit(failures ? 1 : 0);

// IMPORT A LIBRARY FROM ANOTHER PROJECT FILE (ROADMAP Task 611). Run:
//   node dev/lpn-spike/library-import-harness.js
//
// Tom, 2026-09-08, and it is the whole specification: *"If the Libraries have Import buttons that
// ask for selecting another project file, then import anything that is not a name conflict, that
// probably would be all that's needed."*
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
//   7. differing units are reported and NOTHING is converted
//   8. the button is in all three sections, and the picker is wired

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tseedDefaultInputs: seedDefaultInputs, setDoc: function (d) { doc = d; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tcurveById: curveById, pipeTypeById: pipeTypeById, fittingSetById: fittingSetById,\n" +
	"\t\tlibImportText: libImportText, libImportRun: libImportRun, libImportPick: libImportPick,\n" +
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

const FIXTURE = JSON.parse(fs.readFileSync(path.join(__dirname, 'library-import-fixture.lwn'), 'utf8'));
function fixture() { return JSON.parse(JSON.stringify(FIXTURE)); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---- 1. THE THREE LIBRARIES COPY ACROSS -------------------------------------------------------
head('1. the three libraries copy across, and a definition is cloned rather than adopted');
(function () {
	const src = fixture();
	L.libImportText(JSON.stringify(src), 'standards.lwn', 'pipetypes');
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
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn', 'fittings');
	check((L.getDoc().fittingSets || []).length === 1, 'the fittings list landed');
	check(EngCalcs.lpnFittingsSum(L.fittingSetById('Hydrant-lateral')).toFixed(3) === (1.8 + 0.2 + 2 * 0.8).toFixed(3),
		`its items add up through the one arithmetic: ${EngCalcs.lpnFittingsSum(L.fittingSetById('Hydrant-lateral'))}`);

	clearReport();
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn', 'curves');
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
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn', 'curves');
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
	}, 'twice.lwn', 'pipetypes');
	check(L.getDoc().pipeTypes.length === 1 && L.pipeTypeById('T1').props.diameter === 4,
		'the first T1 lands and the second is the clash, not the winner');
	check(said('lpn_library_import_conflict'), 'and the duplicate inside the file is reported too');
}());

// ---- 3. AN EMPTY IMPORT WRITES NOTHING ---------------------------------------------------------
head('3. an import that finds nothing does not write an empty list into the document');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportRun({ v: 6, units: {} }, 'bare.lwn', 'curves');
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
	L.libImportText(JSON.stringify(src), 'standards.lwn', 'curves');
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
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn', 'pipetypes');
	check(said('lpn_library_import_needs_fittings'),
		`the dangling reference is reported: ${JSON.stringify(reportLines())}`);
	check(saidOne('lpn_library_import_needs_fittings').indexOf('DIP-8') >= 0, 'by name');
	// NOTHING IS REPAIRED: the reference stands, and the type keeps saying what the file said.
	check(L.pipeTypeById('DIP-8').props.fittingsId === 'Hydrant-lateral',
		'the reference is left exactly as the file stated it');
	// Import the fittings library too and the reference resolves, with no second act on the type.
	clearReport();
	L.libImportText(JSON.stringify(fixture()), 'standards.lwn', 'fittings');
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
	}, 'odd.lwn', 'curves');
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
head('7. differing units are reported, and nothing is converted');
(function () {
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	const src = fixture();
	src.units.lpn_u_diameter = 'mm';
	L.libImportRun(src, 'metric.lwn', 'pipetypes');
	check(said('lpn_library_import_units'), `the unit difference is reported: ${JSON.stringify(reportLines())}`);
	// **THE NUMBER IS THE USER'S.** Changing a unit on this page reinterprets a typed number and
	// does not convert it, which is absolute; a definition crossing from a file that showed
	// millimetres lands as written and now means inches. A 203.2 here would be the third
	// conversion site CLAUDE.md warns about.
	check(L.pipeTypeById('DIP-8').props.diameter === 8, 'and the number is the file\'s own, unconverted');

	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	L.libImportRun(fixture(), 'same.lwn', 'pipetypes');
	check(!said('lpn_library_import_units'), 'a file in this project\'s own units says nothing about units');

	// A fittings list depends on no unit at all: a minor loss coefficient is dimensionless.
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	clearReport();
	const metric = fixture();
	metric.units.lpn_u_diameter = 'mm';
	metric.units.lpn_u_flow = 'lps';
	L.libImportRun(metric, 'metric.lwn', 'fittings');
	check(!said('lpn_library_import_units'),
		'and a fittings import never raises the units question, because a coefficient has none');
}());

// ---- 8. THE BUTTON AND THE PICKER --------------------------------------------------------------
head('8. the button is in all three sections, and the picker is wired');
(function () {
	const pc = EngCalcs.pageConfig || {};
	L.setDoc({ nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } });
	[['curves', L.buildCurveSection], ['pipetypes', L.buildPipeTypeSection],
		['fittings', L.buildFittingSection]].forEach(function (pair) {
		const host = L.libEl('div');
		pair[1](host);
		const hit = walk(host).filter(function (e) {
			return String(e.tagName).toLowerCase() === 'button'
				&& e.textContent === pc.lpn_library_import;
		});
		check(hit.length === 1, `the ${pair[0]} section carries exactly one Import button`);
	});
	// ONE LABEL, REUSED. Three sections, one concept, one key -- CLAUDE.md's concept-level rule.
	check(typeof pc.lpn_library_import === 'string' && pc.lpn_library_import !== '',
		'and its label is supplied through pageConfig rather than a fallback literal');
	// The picker is a hidden input in the page, and the section that asked is remembered across
	// the trip out to it. A missing input must not throw.
	let clicked = 0;
	const input = document.getElementById('lpn_library_file');
	input.click = function () { clicked++; };
	L.libImportPick('curves');
	check(clicked === 1, 'pressing Import opens the page\'s own hidden picker');
}());

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All library-import checks passed.'));
process.exit(failures ? 1 : 0);

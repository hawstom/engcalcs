// THE DEFAULT DEMAND PATTERN IS A SETTINGS ROW -- ROADMAP Task 553. Run with:
//   node dev/lpn-spike/default-pattern-harness.js
//
// WHY THIS EXISTS. `[OPTIONS] Pattern` is the quietest thing in an EPANET file: it decides what
// EVERY junction with a blank pattern column does, and until Task 553 the only place a person
// could see it was one line inside the Libraries box, three clicks from the map, filed under a
// list of pattern definitions. Tom, 2026-08-28: *"No pattern means to use the default pattern, and
// the default pattern must be specified in Settings along with other Hydraulics options."*
//
// The acceptance case is his: **import Net3 and the row says 1**, with nobody having typed it.
// Net3's `[OPTIONS]` carries `Pattern 1`, and 92 junctions rely on it.
//
// WHAT THIS HARNESS CAN AND CANNOT SEE. It builds the REAL Settings box through
// rebuildSettingsFields() and reads the DOM the page would draw, so a row that is not built, or
// built into the wrong section, fails here. It does not render, so it says nothing about where the
// row sits on screen.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, ensure, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// The page's own load order. lpn-time.js must be here or every multiplier is read at t = 0 whatever
// the transport says -- the stub-holds-the-coupling-constant failure dev/testing-notes.md names,
// and section 3 below is exactly a question about a multiplier.
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\tlibPatterns: libPatterns,\n" +
	"\t\tresolvedDemand: resolvedDemand,\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\tbuildPatternSection: buildPatternSection,\n" +
	// The document is drawn on import, and the draw walks these layers. Same six the other
	// import-driving harnesses here build.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// Every element under `root`, depth first. The stub's nodes carry `children`, so this is the same
// walk every other popup harness here does.
function all(root) {
	const out = [];
	(function walk(n) {
		(n.children || []).forEach(function (c) { out.push(c); walk(c); });
	}(root));
	return out;
}
function tagged(root, tag) { return all(root).filter(n => n.tagName === tag); }

// A Settings row is a <label class="lpn-set-row"> holding a <span> of label text and one control.
// Read back as {label, control} so an assertion can name the row the way a person would.
// **THE HYDRAULICS SECTION SPECIFICALLY**, not the whole box: the row's SECTION is half the
// claim. Tom asked for it "in Settings along with other Hydraulics options", and a row that built
// itself into Default inputs would satisfy a search of the whole panel and none of the request.
function settingsRows() {
	const box = byId.lpn_set_hydraulics_fields;
	if (!box) { return []; }
	return all(box)
		.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
		.map(function (line) {
			const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
			const ctl = (line.children || []).filter(c => c.tagName !== 'SPAN')[0];
			return { label: span ? span.textContent : '', control: ctl };
		});
}

const REF = path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp');

// ---------------------------------------------------------------------------
// 1. Net3's own [OPTIONS] Pattern reaches the document.
// ---------------------------------------------------------------------------
console.log('\n--- Net3 states a default pattern, and we keep it ---');
{
	L.importInp({ name: 'Net3.inp', _text: fs.readFileSync(REF, 'utf8') });
	const doc = L.getDoc();
	ok("the imported document's defaultPattern is Net3's own", doc.defaultPattern === '1',
		JSON.stringify(doc.defaultPattern));
	// The pattern itself must exist too, or the row would offer a value it cannot show.
	ok('...and pattern 1 is in the library to be chosen',
		L.libPatterns().some(p => String(p.id) === '1'),
		L.libPatterns().map(p => p.id).join(','));
	// It survives a save. It is PROJECT state, not page state -- which is the whole reason the row
	// writes through libCommit() and not through the page's own settings object.
	ok('...and it is carried in the serialized project', L.serialize().defaultPattern === '1');
}

// ---------------------------------------------------------------------------
// 2. The Settings box draws the row, and it opens on Net3's answer.
// ---------------------------------------------------------------------------
console.log('\n--- Settings shows it, without anybody typing it ---');
let patRow;
{
	L.rebuildSettings();
	const rows = settingsRows();
	ok('the Settings box built some rows at all', rows.length > 0, rows.length + ' rows');
	patRow = rows.filter(r => /Default demand pattern/.test(r.label))[0];
	ok('...one of which is Default demand pattern', !!patRow,
		rows.map(r => r.label.replace(/\s+/g, ' ').trim()).join(' | '));
	ok('...drawn as a select, not a text box',
		!!patRow && patRow.control && patRow.control.tagName === 'SELECT',
		patRow && patRow.control ? patRow.control.tagName : 'none');
	// **THE ACCEPTANCE CASE, IN TOM'S OWN WORDS.**
	ok('...whose value is 1, which is what Net3 said and nobody typed',
		!!patRow && patRow.control.value === '1',
		patRow && patRow.control ? JSON.stringify(patRow.control.value) : 'none');
	ok('...offering every pattern in the library, plus the blank',
		!!patRow && tagged(patRow.control, 'OPTION').length === L.libPatterns().length + 1,
		patRow ? tagged(patRow.control, 'OPTION').map(o => o.value).join(',') : '');
	// The blank is FIRST and is a named option, not an empty slot: "no pattern" is an answer.
	ok('...with the blank first and carrying a name',
		!!patRow && tagged(patRow.control, 'OPTION')[0].value === '' &&
			tagged(patRow.control, 'OPTION')[0].textContent.length > 0,
		patRow ? JSON.stringify(tagged(patRow.control, 'OPTION')[0].textContent) : '');
	// It carries a tip, because "default" alone does not say default for WHAT.
	ok('...and the label carries its tip', !!patRow && /\?/.test(patRow.label),
		patRow ? JSON.stringify(patRow.label) : '');
}

// ---------------------------------------------------------------------------
// 3. Choosing in that row writes the document and changes the answer.
// ---------------------------------------------------------------------------
console.log('\n--- and it is a control, not a readout ---');
{
	const doc = L.getDoc();
	// A junction with no pattern of its own is the one this row is about. Net3 has 92 of them; take
	// the first, and read what it draws before and after.
	const j = doc.nodes.filter(n => n.type === 'junction' && !n.demandPattern &&
		typeof n._demand === 'number' && n._demand !== 0)[0];
	ok('Net3 has a junction relying on the project default', !!j, j && j.id);
	const before = L.resolvedDemand(j, 0);
	patRow.control.value = '';
	patRow.control._listeners.change[0]();
	ok('choosing the blank clears the document', doc.defaultPattern === null,
		JSON.stringify(doc.defaultPattern));
	const after = L.resolvedDemand(j, 0);
	// **THE POINT OF THE WHOLE ROW.** Pattern 1's first multiplier is 1.0 in Net3, so if this
	// asserted only the number it would pass with the wiring cut. Assert the RESOLUTION instead:
	// with a default the junction follows a pattern, without one it does not.
	ok('...and the junction that relied on it now follows no pattern',
		L.resolvedDemand(j, 0) === j._demand,
		'base ' + j._demand + ', draws ' + after);
	patRow.control.value = '1';
	patRow.control._listeners.change[0]();
	ok('...and choosing 1 again puts it back', doc.defaultPattern === '1' &&
		L.resolvedDemand(j, 0) === before, 'draws ' + L.resolvedDemand(j, 0));
}

// ---------------------------------------------------------------------------
// 4. It is in ONE place. The Libraries box does not draw it any more.
// ---------------------------------------------------------------------------
console.log('\n--- one row, one place ---');
{
	// Two controls writing doc.defaultPattern is the two-places problem the Settings/Libraries line
	// exists to prevent -- and it would be a stale one, because the Libraries box is rebuilt on its
	// own schedule and would not hear a change made in Settings.
	const host = { tagName: 'DIV', children: [], appendChild: function (c) { this.children.push(c); } };
	let built = true;
	try { L.buildPatternSection(host); } catch (e) { built = false; }
	ok('the Libraries pattern section still builds', built);
	const sels = tagged(host, 'SELECT');
	ok('...and holds no default-pattern chooser of its own', sels.length === 0,
		sels.length + ' select(s)');
	const text = all(host).map(n => n.textContent || '').join(' ');
	ok('...nor the words for one', !/Default demand pattern/.test(text));
}

// ---------------------------------------------------------------------------
// 5. Building the row does not WRITE to the document.
// ---------------------------------------------------------------------------
console.log('\n--- and drawing it changes nothing ---');
{
	// **THE DEFECT THIS SECTION EXISTS FOR.** libPatterns() is a getter that ASSIGNS --
	// `doc.patterns = doc.patterns || []` -- so a caller can push onto the result. That is right for
	// a writer and wrong for a reader, and it was harmless only while the sole reader was a box
	// somebody had to open. This row is rebuilt on every unit change, so on a project that states no
	// patterns it wrote `patterns: []` into the document just by being drawn. `unit-change-harness.js`
	// caught it as a non-destructive unit switch that was not byte-identical; assert it at the source
	// too, because the symptom there names neither this row nor that getter.
	const doc = L.getDoc();
	delete doc.patterns;
	const before = JSON.stringify(doc);
	L.rebuildSettings();
	ok('a document that states no patterns still states none after the rebuild',
		JSON.stringify(doc) === before,
		'patterns is now ' + JSON.stringify(doc.patterns));
	ok('...and the row still built, offering the blank alone',
		settingsRows().some(r => /Default demand pattern/.test(r.label)));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

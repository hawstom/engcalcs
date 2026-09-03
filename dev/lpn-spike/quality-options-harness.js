// THE THREE WATER-QUALITY [OPTIONS] SURVIVE A ROUND TRIP -- ROADMAP Task 553. Run with:
//   node dev/lpn-spike/quality-options-harness.js
//
// WHY THIS EXISTS. Task 553 taught the importer every hydraulic `[OPTIONS]` key and left three
// behind: `Quality`, `Diffusivity` and `Tolerance`. EPA's own Net1 states all three, so a user who
// opened it and saved it got a file with none of them -- their own characters spent, which is
// CLAUDE.md's input-file-is-canonical rule broken in the quietest way there is.
//
// **WHY VERBATIM AND NOT PARSED, WHICH IS THE WHOLE DESIGN DECISION.** CLAUDE.md's unit rule says a
// unit is a LABEL and a MAGNITUDE with different requirements, and that a magnitude is needed only
// by a SOLVE. No solve on this page reads any of these three, so they are the middle case that rule
// names: carried verbatim, no problem. Two facts make it the only workable shape as well as the
// cheapest:
//   * `Quality Trace Lake` (Net3) and `Quality Chlorine mg/L` (Net1) are not numbers at all. The
//     value is a chemical and its unit, or the word TRACE and a node id.
//   * `Diffusivity 1.0` and `Tolerance 0.01` are numbers whose TEXT is the user's too, and
//     `String(parseFloat('1.0'))` is `'1'`. A parsed carry could not come back as the file wrote it,
//     which is the same measurement inp-token-harness.js makes across the whole file.
//
// **AND THEY GET NO CONTROL**, on CLAUDE.md's emitter-exponent precedent: eight `[OPTIONS]` are
// carried, exported and honoured with no Settings row, because the most technical-looking control
// in a box must not be one that adjusts nothing. Section 4 asserts the absence.
//
// **CARRYING A THING AND TELLING THE USER ABOUT IT ARE TWO JOBS** (Task 248.03's lesson). Section 5
// asserts both halves of the report: the new sentence that says these are kept and unused, and that
// the OLD sentence -- about the water-quality SECTIONS, which really are dropped -- no longer claims
// the settings were left out.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

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
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\tdropText: inpDropText,\n" +
	"\t\tmigrateSaved: migrateSaved, applySaved: applySaved,\n" +
	// EngCalcs.lpnExportInp, not js/lpn-epanet.js's lpnToInp: that one writes LPS always and
	// preserves nothing, because the only thing that reads it is the engine.
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
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

// The [OPTIONS] block of a file, keyword -> value, in the file's own spelling. Deliberately dumber
// than the real reader: asking the parser under test what the file says would be asking the
// defendant for the verdict.
function optsOf(text) {
	const block = (text.split(/^\[OPTIONS\]/m)[1] || '').split(/^\[/m)[0];
	const out = {};
	block.split(/\r?\n/).forEach(function (line) {
		const t = line.trim();
		if (!t || /^;/.test(t)) { return; }
		const m = /^(Specific\s+Gravity|Demand\s+Multiplier|Emitter\s+Exponent|\S+)\s+(.*)$/i.exec(t);
		if (m) { out[m[1].toUpperCase().replace(/\s+/g, ' ')] = m[2].trim().replace(/\s+/g, ' '); }
	});
	return out;
}
const refPath = (f) => path.join(ROOT, 'dev', 'lpn-spike', 'reference', f);

setUnitSet('us');

// ---------------------------------------------------------------------------
// 1. EPA's own Net1, which states all three, and the round trip is on STRINGS.
// ---------------------------------------------------------------------------
console.log('\n--- Net1 states all three, character for character ---');
{
	const net1 = fs.readFileSync(refPath('Net1.inp'), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: net1 });

	const q = L.getSettings().qualityOptions || {};
	ok('Quality came in as the file wrote it', q.quality === 'Chlorine mg/L', JSON.stringify(q.quality));
	ok('Diffusivity kept its own text, not its value', q.diffusivity === '1.0', JSON.stringify(q.diffusivity));
	ok('Tolerance kept its own text', q.tolerance === '0.01', JSON.stringify(q.tolerance));
	// The failure a parsed carry would produce, stated so the reason is in the harness and not only
	// in the code: 1.0 is a different FILE from 1, however equal the two numbers are.
	ok('...and Diffusivity is a string, so nothing can round it', typeof q.diffusivity === 'string',
		typeof q.diffusivity);

	const src = optsOf(net1), got = optsOf(L.export().inp);
	['QUALITY', 'DIFFUSIVITY', 'TOLERANCE'].forEach(function (k) {
		ok('Net1 exports ' + k + ' byte-identical', got[k] === src[k],
			JSON.stringify(src[k]) + ' -> ' + JSON.stringify(got[k]));
	});
}

// ---------------------------------------------------------------------------
// 2. Net3's Quality is a NODE REFERENCE, which no number could ever hold.
// ---------------------------------------------------------------------------
console.log('\n--- Net3 traces a node, and Net2 names a different chemical ---');
{
	const net3 = fs.readFileSync(refPath('Net3.inp'), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net3.inp', _text: net3 });
	const src = optsOf(net3), got = optsOf(L.export().inp);
	ok('Net3\'s `Trace Lake` survives whole', got.QUALITY === src.QUALITY,
		JSON.stringify(src.QUALITY) + ' -> ' + JSON.stringify(got.QUALITY));
	ok('...and it really is a node id, not a number', /Trace/i.test(src.QUALITY) && !isFinite(+src.QUALITY),
		JSON.stringify(src.QUALITY));

	const net2 = fs.readFileSync(refPath('Net2.inp'), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net2.inp', _text: net2 });
	const s2 = optsOf(net2), g2 = optsOf(L.export().inp);
	['QUALITY', 'DIFFUSIVITY', 'TOLERANCE'].forEach(function (k) {
		ok('Net2 exports ' + k + ' byte-identical', g2[k] === s2[k],
			JSON.stringify(s2[k]) + ' -> ' + JSON.stringify(g2[k]));
	});
}

// ---------------------------------------------------------------------------
// 3. Sparse in, sparse out -- and no leak from the file opened before it.
// ---------------------------------------------------------------------------
console.log('\n--- a file that states none gets none written for it ---');
const BARE = [
	'[TITLE]', 'No water-quality options at all', '',
	'[JUNCTIONS]', ' J1  100  50', '',
	'[RESERVOIRS]', ' R1  200', '',
	'[PIPES]', ' P1  R1  J1  1000  12  130  0  Open', '',
	'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
	'[END]', ''
].join('\n');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'bare.inp', _text: BARE });
	const q = L.getSettings().qualityOptions || {};
	ok('a file stating none leaves us holding none', Object.keys(q).length === 0, JSON.stringify(q));
	// The import before this one stated `Fluoride mg/L`. docFromInp() clones the CURRENT settings,
	// so a careless write would carry the last file's chemical into a file that never named one.
	ok('...and Net2\'s chemical did not ride in on the settings clone', q.quality === undefined,
		JSON.stringify(q.quality));
	const block = (L.export().inp.split(/^\[OPTIONS\]/m)[1] || '').split(/^\[/m)[0].toUpperCase();
	ok('...so the export invents none of them',
		!/QUALITY|DIFFUSIVITY|TOLERANCE/.test(block),
		JSON.stringify(block.trim().split(/\r?\n/)));
}

// ---------------------------------------------------------------------------
// 4. They survive a SAVE, and they get no control.
// ---------------------------------------------------------------------------
console.log('\n--- saved with the project, and shown nowhere ---');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: fs.readFileSync(refPath('Net1.inp'), 'utf8') });
	// The real save/open round trip. `settings` is serialized whole, so this rides on that -- true
	// today and true only by accident if nothing asserts it.
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.applySaved(L.migrateSaved(saved));
	const q = L.getSettings().qualityOptions || {};
	ok('Quality survives a save and reopen', q.quality === 'Chlorine mg/L', JSON.stringify(q.quality));
	ok('Diffusivity survives as text', q.diffusivity === '1.0', JSON.stringify(q.diffusivity));

	// **NO SETTINGS ROW.** Not "no row today" -- no row on purpose: nothing on this page acts on any
	// of the three, and a control that adjusts nothing is the defect the emitter-exponent precedent
	// records. Read off the rendered Settings box rather than off the source.
	L.rebuildSettings();
	function all(root, out) {
		(root.children || []).forEach(function (c) { out.push(c); all(c, out); });
		return out;
	}
	const labels = all(byId.lpn_set_hydraulics_fields, [])
		.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
		.map(function (line) {
			const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
			return span ? span.textContent.replace(/\s+/g, ' ').trim() : '';
		});
	ok('Settings offers no Diffusivity row', !labels.some(t => /Diffusiv/i.test(t)), labels.join(' | '));
	ok('Settings names no chemical', !labels.some(t => /Chlorine|Quality/i.test(t)), labels.join(' | '));

	// **AND THE TWO ROWS THAT DO EXIST**, in their own sub-heading rather than among the hydraulic
	// ones above -- EPANET's own Analysis Options order, Hydraulics then Quality. Read off the
	// rendered box for the same reason the absences above are.
	function rowsIn(host) {
		return all(host, [])
			.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
			.map(function (line) {
				const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
				return span ? span.textContent.replace(/\s+/g, ' ').trim() : '';
			});
	}
	const qRows = rowsIn(byId.lpn_set_quality_fields);
	ok('Water quality has its own rows, and Hydraulics does not carry them',
		qRows.length >= 1 && !labels.some(t => /^Track$/i.test(t)), qRows.join(' | '));
	// The label became EPANET's own name for this selector, `Quality parameter`, on the Task 573
	// Wave 0 pass: a one-word `Track` is a verb and a noun in English and neither in most target
	// languages, and its own values (Water age, Source trace) are noun phrases.
	ok('...the first of which names the quality parameter',
		/Quality parameter/i.test(qRows[0] || ''), qRows.join(' | '));
	// **THE SOURCE ROW APPEARS ONLY WHERE IT MEANS ANYTHING.** Net1 names a chemical, so nothing on
	// this page is tracing a source, and a "Trace node" selector beside it would be a control with
	// no analysis behind it.
	ok('...and no source row while nothing is being traced',
		!qRows.some(t => /Trace node/i.test(t)), qRows.join(' | '));

	// Switch it to a source share the way the control does, and the second row arrives.
	L.getSettings().quality = { mode: 'trace', traceNode: '10' };
	L.rebuildSettings();
	const traced = rowsIn(byId.lpn_set_quality_fields);
	ok('tracing a source adds the row that names it',
		traced.some(t => /Trace node/i.test(t)), traced.join(' | '));
	// **THE CHEMICAL THE FILE NAMED IS STILL REACHABLE**, or an open-and-save could not put it back.
	L.getSettings().quality = { mode: 'chemical', traceNode: '', src: 'Chlorine mg/L' };
	L.rebuildSettings();
	const chem = all(byId.lpn_set_quality_fields, [])
		.filter(n => n.tagName === 'SELECT')
		.map(sel => (sel.children || []).map(o => o.value).join(','))[0] || '';
	ok('a file that names a chemical can still say so', /chemical/.test(chem), chem);
	// **AND SO CAN A DOCUMENT THAT NAMES NONE, SINCE 2026-09-03** (Task 566). This line used to
	// assert the opposite, and it was right while a chemical was carried text the page could not
	// produce: offering an analysis that never runs is worse than not offering it. A chemical runs
	// now, so withholding the option would be withholding the feature.
	L.getSettings().quality = { mode: 'none', traceNode: '' };
	L.rebuildSettings();
	const plain = all(byId.lpn_set_quality_fields, [])
		.filter(n => n.tagName === 'SELECT')
		.map(sel => (sel.children || []).map(o => o.value).join(','))[0] || '';
	ok('and a document that names none can now choose one', /chemical/.test(plain), plain);
}

// ---------------------------------------------------------------------------
// 5. The report says both halves, and the old sentence stopped over-claiming.
// ---------------------------------------------------------------------------
console.log('\n--- the report tells the user, and tells the truth ---');
{
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(refPath('Net1.inp'), 'utf8'));
	const codes = parsed.dropped.map((d) => d.code);
	ok('the three options are REPORTED as well as kept', codes.indexOf('quality-options') >= 0,
		JSON.stringify(codes));
	// The [QUALITY] section is a different fact and keeps its own note: Net1 states starting
	// chlorine at its nodes, and none of that is modelled here.
	ok('...and the water-quality SECTIONS keep their own separate note',
		codes.indexOf('quality') >= 0, JSON.stringify(codes));

	const kept = L.dropText('quality-options');
	ok('the new sentence says they are kept', /kept/i.test(kept), JSON.stringify(kept));
	// **THIS ASSERTION WAS INVERTED ON 2026-09-01, AND THE INVERSION IS THE POINT.** It used to
	// require the words "Nothing on this page uses" -- true while all three options were carried
	// text, and FALSE the moment `Quality` became a live input driving a water-age or source-share
	// run. That is exactly the failure the block below is about: a sentence that was honest when it
	// was written and quietly became an over-claim in the other direction. So the sentence must now
	// say that a chemical is not worked out here, and must NOT claim that none of them is used.
	ok('...and no longer claims the page uses none of them',
		!/Nothing on this page uses/i.test(kept), JSON.stringify(kept));
	ok('...and still says a chemical is not worked out here',
		/chemical is not/i.test(kept), JSON.stringify(kept));
	// **THE HALF THAT WENT WRONG LAST TIME.** `lpn_inp_drop_rules` had to be rewritten the moment
	// rules started being carried, because "left out" had become false and a user reading it would
	// believe theirs were lost. The same sentence covered these settings until now.
	const sections = L.dropText('quality');
	ok('the section note no longer claims the SETTINGS were left out',
		!/settings were left out/i.test(sections), JSON.stringify(sections));

	// A file stating none says nothing about them, which is the other half of the report's contract.
	const none = EngCalcs.lpnInpParse(BARE);
	ok('a file stating none is not told about them',
		none.dropped.map((d) => d.code).indexOf('quality-options') < 0,
		JSON.stringify(none.dropped.map((d) => d.code)));
}

console.log(fails ? '\nFAIL ' + fails : '\nok');
process.exit(fails ? 1 : 0);

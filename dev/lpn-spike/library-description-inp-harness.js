// A PATTERN, A CONTROL AND A RULE CARRY THEIR DESCRIPTION THROUGH AN .inp. Run with:
//   node dev/lpn-spike/library-description-inp-harness.js
//
// Tom, 2026-10-14: "Let's add Description to the Library Patterns, Controls, and Rules." The
// description lives in the file as a whole-line `;comment` above the thing it describes:
//
//   [PATTERNS]  EPANET's own rule. The toolkit keeps the LAST whole-line comment directly above a
//               pattern's first row (input2.c `LineComment`, cleared by a blank line; input3.c
//               patterndata()) and writes it back as `;<comment>` above the rows (inpfile.c).
//   [CONTROLS]  EPANET has no description; its GUI keeps the section's lines, comments in place
//               (Uimport.pas ReadControlData, Uexport.pas ExportControls). Ours: the comment lines
//               back to the previous control, kept line for line until edited; or a trailing
//               `;comment` on the control's own line, written back there.
//   [RULES]     Carried as text, now WITH its comment lines (they were dropped before); the
//               description is the comment lines directly above a RULE line.
//
// And the user's numbers do not move: the shipped Net1/2/3 still export token for token (asserted
// by inp-export-harness.js); this asserts their descriptions now survive as well.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-rules.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond || extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

function importText(text, name) {
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { throw new Error(name + ': ' + parsed.error); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	return { parsed, doc: L.docFromInp(parsed, name) };
}
function section(text, name) {
	const out = [];
	let on = false;
	text.split(/\r?\n/).forEach((l) => {
		const m = /^\s*\[(\w+)\]/.exec(l);
		if (m) { on = m[1].toUpperCase() === name; return; }
		if (on && l.trim()) { out.push(l.replace(/\s+$/, '')); }
	});
	return out;
}
const J = (v) => JSON.stringify(v);

// ---- 1. a crafted file ---------------------------------------------------------------------------
const CRAFTED = [
	'[JUNCTIONS]', ' J2  10  5  ;', '[RESERVOIRS]', ' R1  100', '[TANKS]', ' T3  50  5  0  20  40  0',
	'[PIPES]', ' P1  R1  J2  100  12  100  0  Open', ' P2  J2  T3  100  12  100  0  Open',
	'[PATTERNS]',
	';ID   Multipliers',
	';Morning peak',
	' PA  1  2  3',
	' PA  4',
	';',
	' PB  1  1',
	';Separated by a blank line, so not a description (EPANET)',
	'',
	' PC  2  2',
	';Interleaved run: EPANET keeps the first description',
	' PA  5',
	'[CONTROLS]',
	';Fill the tank',
	'LINK P1 OPEN IF NODE T3 BELOW 5',
	'',
	';Two lines of',
	';heading comment',
	'LINK P1 CLOSED IF NODE T3 ABOVE 15',
	'LINK P2 OPEN AT TIME 2 ;trailing note',
	'LINK P2 CLOSED AT TIME 20',
	'[RULES]',
	';First rule description',
	'RULE R1',
	'IF TANK T3 LEVEL ABOVE 10',
	'THEN LINK P2 STATUS IS CLOSED',
	'',
	';Second rule description',
	'RULE R2',
	'IF TANK T3 LEVEL BELOW 2',
	'THEN LINK P2 STATUS IS OPEN',
	'[TIMES]', ' Duration 24:00',
	'[END]', ''
].join('\n');

console.log('\n1. A crafted file reads each description from where EPANET puts it');
const a = importText(CRAFTED, 'crafted.inp');
const pats = {};
(a.doc.patterns || []).forEach((p) => { pats[p.id] = p; });
ok('pattern PA reads the comment directly above its first row, not the column heading',
	pats.PA && pats.PA.note === 'Morning peak', J(pats.PA));
ok('...and its interleaved second run keeps the first description', pats.PA && pats.PA.note === 'Morning peak');
ok('...and its multipliers still concatenate', pats.PA && J(pats.PA.multipliers) === '[1,2,3,4,5]', J(pats.PA && pats.PA.multipliers));
ok('pattern PB under a bare ";" has no description', pats.PB && pats.PB.note === undefined, J(pats.PB));
ok('pattern PC with a blank line between comment and row has none (EPANET\'s reading)',
	pats.PC && pats.PC.note === undefined, J(pats.PC));
const ctls = a.doc.controls || [];
ok('four controls are read', ctls.length === 4, ctls.length);
ok('control 1 reads the comment above it', ctls[0] && ctls[0].note === 'Fill the tank', J(ctls[0]));
ok('control 2 reads both heading lines as one description',
	ctls[1] && ctls[1].note === 'Two lines of heading comment', J(ctls[1]));
ok('...and keeps their own lines to write back', ctls[1] && J(ctls[1].noteSrc) === J([';Two lines of', ';heading comment']));
ok('control 3 reads its trailing comment as its description, marked as trailing',
	ctls[2] && ctls[2].note === 'trailing note' && ctls[2].noteAt === 'end', J(ctls[2]));
ok('control 4 has none', ctls[3] && ctls[3].note === undefined, J(ctls[3]));
ok('[RULES] keeps its comment lines now', J(a.doc.rules) === J([';First rule description', 'RULE R1',
	'IF TANK T3 LEVEL ABOVE 10', 'THEN LINK P2 STATUS IS CLOSED', ';Second rule description', 'RULE R2',
	'IF TANK T3 LEVEL BELOW 2', 'THEN LINK P2 STATUS IS OPEN']), J(a.doc.rules));
ok('...and the rule count reported is still the rules\' own lines, not the comments',
	(a.parsed.dropped || []).some((d) => d.code === 'rules' && d.detail === 6),
	J((a.parsed.dropped || []).filter((d) => d.code === 'rules')));

// ---- 2. export puts each one back, and a re-import reads the same ---------------------------------
console.log('\n2. The export writes each description back where it came from');
const out = EngCalcs.lpnExportInp(a.doc);
ok('it exports', out.ok === true, J(out.error));
const P = section(out.inp, 'PATTERNS'), C = section(out.inp, 'CONTROLS'), R = section(out.inp, 'RULES');
ok('";Morning peak" sits directly above PA\'s first row', P[0] === ';Morning peak' && /^\s*PA\s/.test(P[1]), J(P));
ok('no description line is written for PB or PC', P.filter((l) => /^\s*;/.test(l)).length === 1, J(P));
ok('control 1: one comment line above', C[0] === ';Fill the tank' && C[1] === 'LINK P1 OPEN IF NODE T3 BELOW 5', J(C));
ok('control 2: both of the file\'s own lines, unchanged', C[2] === ';Two lines of' && C[3] === ';heading comment', J(C));
ok('control 3: the trailing comment back on its line', C[5] === 'LINK P2 OPEN AT TIME 2 ;trailing note', J(C));
ok('[RULES] comes back line for line', J(R) === J(a.doc.rules), J(R));
const b = importText(out.inp, 'again.inp');
ok('re-import: same pattern descriptions', J((b.doc.patterns || []).map((p) => p.note || null)) ===
	J((a.doc.patterns || []).map((p) => p.note || null)));
ok('re-import: same control descriptions', J((b.doc.controls || []).map((c) => c.note || null)) ===
	J(ctls.map((c) => c.note || null)));
ok('re-import: same rule text', J(b.doc.rules) === J(a.doc.rules));

// ---- 3. an edited description is written as one line --------------------------------------------
console.log('\n3. An edited description goes out as one line in the same place');
const ed = JSON.parse(JSON.stringify(a.doc));
ed.controls[1].note = 'Edited heading';
delete ed.controls[1].noteSrc;            // what the Library's Description field does
ed.controls[2].note = 'Edited trailing';
ed.patterns[0].note = 'Edited pattern';
const out2 = EngCalcs.lpnExportInp(ed);
const C2 = section(out2.inp, 'CONTROLS'), P2 = section(out2.inp, 'PATTERNS');
ok('control 2\'s two lines become one', C2[2] === ';Edited heading' && /^LINK P1 CLOSED/.test(C2[3]), J(C2));
ok('control 3 keeps its comment on its own line', C2[4] === 'LINK P2 OPEN AT TIME 2 ;Edited trailing', J(C2));
ok('the pattern\'s description line is the edited one', P2[0] === ';Edited pattern', J(P2));
// A stale noteSrc (an old project, or an editor that forgot) must not write the OLD lines.
const st = JSON.parse(JSON.stringify(a.doc));
st.controls[1].note = 'Edited but src left';
ok('a noteSrc that no longer says the description is not written',
	section(EngCalcs.lpnExportInp(st).inp, 'CONTROLS')[2] === ';Edited but src left');

// ---- 4. the shipped EPA models -------------------------------------------------------------------
console.log('\n4. Net1, Net2 and Net3 keep their descriptions, and their tokens');
const tok = (t) => t.split(/\r?\n/).map((l) => l.replace(/;.*$/, '').trim().split(/\s+/).join(' ')).filter(Boolean).join('\n');
['Net1.inp', 'Net2.inp', 'Net3.inp'].forEach((f) => {
	const text = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f), 'utf8');
	const d = importText(text, f).doc;
	const o = EngCalcs.lpnExportInp(d);
	const want = { 'Net1.inp': { '1': 'Demand Pattern' },
		'Net2.inp': { '1': 'Demand Pattern', '2': 'Pump Station Outflow Pattern', '3': 'Pump Station Fluoride Pattern' },
		'Net3.inp': { '1': 'General Default Demand Pattern', '2': 'Demand Pattern for Node 123',
			'3': 'Demand Pattern for Node 15', '4': 'Demand Pattern for Node 35', '5': 'Demand Pattern for Node 203' } }[f];
	Object.keys(want).forEach((id) => {
		const p = (d.patterns || []).filter((x) => x.id === id)[0];
		ok(f + ' pattern ' + id + ' is "' + want[id] + '"', p && p.note === want[id], J(p && p.note));
	});
	ok(f + ' [PATTERNS] and [CONTROLS] export with the same tokens as the source',
		tok(section(o.inp, 'PATTERNS').join('\n')) === tok(section(text, 'PATTERNS').join('\n')) &&
		tok(section(o.inp, 'CONTROLS').join('\n')) === tok(section(text, 'CONTROLS').join('\n')));
	if (f === 'Net3.inp') {
		ok('Net3 control 1 is "Lake source operates only part of the day"',
			d.controls[0].note === 'Lake source operates only part of the day', J(d.controls[0]));
		ok('Net3 control 3 carries both heading lines',
			d.controls[2].note === 'Pump 335 controlled by level in Tank 1 When pump is closed, bypass pipe is opened', J(d.controls[2]));
		const c3 = section(o.inp, 'CONTROLS');
		ok('Net3 [CONTROLS] comments come back exactly as the source wrote them',
			J(c3.filter((l) => /^;/.test(l))) === J(section(text, 'CONTROLS').filter((l) => /^;/.test(l))), J(c3));
	}
});

// ---- 5. the project file, and an old one -----------------------------------------------------------
console.log('\n5. The project file keeps every description; an old project loads unchanged');
// Put the crafted document on the page, save it as Save does, and open it again.
{
	const live = L.getDoc();
	Object.keys(live).forEach((k) => { delete live[k]; });
	Object.assign(live, JSON.parse(JSON.stringify(a.doc)));
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(L.serialize()))));
}
const re = L.getDoc();
ok('pattern note survives save and reload', (re.patterns || []).some((p) => p.id === 'PA' && p.note === 'Morning peak'));
ok('control note and its source lines survive', re.controls && re.controls[1].note === 'Two lines of heading comment'
	&& J(re.controls[1].noteSrc) === J([';Two lines of', ';heading comment']));
ok('rule comment lines survive', J(re.rules) === J(a.doc.rules), J(re.rules));
const model = L.assembleModel();
ok('the engine still gets both rules, and nothing from the comment lines',
	(model.rules || []).length === 2 && model.rules.every((r) => r.name === 'R1' || r.name === 'R2'),
	J((model.rules || []).map((r) => r.name)));
const old = JSON.parse(JSON.stringify(L.serialize()));
(old.patterns || []).forEach((p) => { delete p.note; });
(old.controls || []).forEach((c) => { delete c.note; delete c.noteSrc; delete c.noteAt; delete c.tail; });
old.rules = (old.rules || []).filter((l) => !/^\s*;/.test(l));
const oldText = JSON.stringify(old);
L.applySaved(L.migrateSaved(JSON.parse(oldText)));
ok('an old project with no descriptions loads and saves back unchanged in those sections',
	J(L.serialize().patterns) === J(old.patterns) && J(L.serialize().controls) === J(old.controls) &&
	J(L.serialize().rules) === J(old.rules));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

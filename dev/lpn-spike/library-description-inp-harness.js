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
	"\t\tassembleModel: assembleModel, inpDropText: inpDropText,\n" +
	"\t\truleEntries: function () { return libRuleEntries(libRulesRead()); },\n" +
	"\t\truleDesc: function (e) { return libRuleDesc(libRulesRead(), e); },\n" +
	"\t\trulesSplice: libRulesSplice, rulesWithout: libRulesWithout, rulesAppend: libRulesAppend,\n" +
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

// Every line of a section, blank ones included, without the blank lines at its two ends.
function sectionAll(text, name) {
	const out = [];
	let on = false;
	text.split(/\r?\n/).forEach((l) => {
		const m = /^\s*\[(\w+)\]/.exec(l);
		if (m) { on = m[1].toUpperCase() === name; return; }
		if (on) { out.push(l.replace(/\s+$/, '')); }
	});
	while (out.length && !out[0]) { out.shift(); }
	while (out.length && !out[out.length - 1]) { out.pop(); }
	return out;
}

// ---- 1. a crafted file ---------------------------------------------------------------------------
const CRAFTED = [
	'[JUNCTIONS]', ' J2  10  5  ;', '[RESERVOIRS]', ' R1  100', '[TANKS]', ' T3  50  5  0  20  40  0',
	'[PIPES]', ' P1  R1  J2  100  12  100  0  Open', ' P2  J2  T3  100  12  100  0  Open',
	'[PATTERNS]',
	';ID   Multipliers',
	';Morning peak',
	' PA  1  2  3',
	';between rows',
	' PA  4 ;row trailing',
	';',
	' PB  1  1',
	';Separated by a blank line, so a heading (EPANET reads no description)',
	'',
	' PC  2  2',
	';Interleaved run: EPANET keeps the first description',
	' PA  5',
	';after the last pattern',
	'',
	'[CONTROLS]',
	';Controls heading',
	'',
	';Fill the tank',
	'LINK P1 OPEN IF NODE T3 BELOW 5',
	'',
	';Two lines of',
	';heading comment',
	'LINK P1 CLOSED IF NODE T3 ABOVE 15',
	'LINK P2 OPEN AT TIME 2 ;trailing note',
	'LINK P2 CLOSED AT TIME 20',
	';above a missing link',
	'LINK NOPE OPEN AT TIME 3',
	';after the last control',
	'',
	'[RULES]',
	';Rules section heading',
	'',
	';desc R1',
	'RULE R1',
	'IF TANK T3 LEVEL ABOVE 10',
	'THEN LINK P2 STATUS IS CLOSED',
	'',
	';Second rule description',
	'RULE R2',
	'IF TANK T3 LEVEL BELOW 2',
	'THEN LINK P2 STATUS IS OPEN',
	'',
	'[TIMES]', ' Duration 24:00',
	'[END]', ''
].join('\n');
const RULES_IN = [';Rules section heading', '', ';desc R1', 'RULE R1', 'IF TANK T3 LEVEL ABOVE 10',
	'THEN LINK P2 STATUS IS CLOSED', '', ';Second rule description', 'RULE R2', 'IF TANK T3 LEVEL BELOW 2',
	'THEN LINK P2 STATUS IS OPEN'];

console.log('\n1. A crafted file: a description is only what sits DIRECTLY above; the rest is kept or reported');
const a = importText(CRAFTED, 'crafted.inp');
const pats = {};
(a.doc.patterns || []).forEach((p) => { pats[p.id] = p; });
ok('pattern PA reads the comment directly above its first row', pats.PA && pats.PA.note === 'Morning peak', J(pats.PA));
ok('...and keeps the column heading above that as its heading, verbatim',
	pats.PA && J(pats.PA.head) === J([';ID   Multipliers']), J(pats.PA && pats.PA.head));
ok('...and its multipliers still concatenate', pats.PA && J(pats.PA.multipliers) === '[1,2,3,4,5]', J(pats.PA && pats.PA.multipliers));
ok('pattern PB under a bare ";" has no description, and keeps the ";" line',
	pats.PB && pats.PB.note === undefined && J(pats.PB.head) === J([';']), J(pats.PB));
ok('pattern PC: a comment a blank line separates is a heading, blank line and all, not a description',
	pats.PC && pats.PC.note === undefined && J(pats.PC.head) === J([';Separated by a blank line, so a heading (EPANET reads no description)', '']), J(pats.PC));
ok('the comment after the last pattern stays, after it', pats.PC && J(pats.PC.foot) === J([';after the last pattern']), J(pats.PC && pats.PC.foot));
const lost = (sec) => ((a.parsed.dropped || []).filter((d) => d.code === 'comments' && d.detail === sec)[0] || {}).ids;
ok('every [PATTERNS] comment no pattern can keep is REPORTED: between rows, on a row, above a later run',
	J(lost('PATTERNS')) === J([';between rows', ';row trailing', ';Interleaved run: EPANET keeps the first description']),
	J(lost('PATTERNS')));
const ctls = a.doc.controls || [];
ok('four controls are kept (the one naming a missing link is reported, as before)', ctls.length === 4, ctls.length);
ok('control 1: the heading a blank line separates is NOT its description, and is kept verbatim',
	ctls[0] && ctls[0].note === 'Fill the tank' && J(ctls[0].head) === J([';Controls heading', '']), J(ctls[0]));
ok('control 2 reads both lines directly above it as one description (the Net3 reading)',
	ctls[1] && ctls[1].note === 'Two lines of heading comment' && ctls[1].head === undefined, J(ctls[1]));
ok('...and keeps their own lines to write back', ctls[1] && J(ctls[1].noteSrc) === J([';Two lines of', ';heading comment']));
ok('control 3 reads its trailing comment as its description, marked as trailing',
	ctls[2] && ctls[2].note === 'trailing note' && ctls[2].noteAt === 'end', J(ctls[2]));
ok('control 4: no description; the comment after the last control stays after it',
	ctls[3] && ctls[3].note === undefined && J(ctls[3].foot) === J([';after the last control']), J(ctls[3]));
ok('the comment above the control that was left out is REPORTED', J(lost('CONTROLS')) === J([';above a missing link']), J(lost('CONTROLS')));
ok('[RULES] keeps its comment lines AND its blank lines', J(a.doc.rules) === J(RULES_IN), J(a.doc.rules));
ok('...and the rule count reported is still the rules\' own lines, not the comments',
	(a.parsed.dropped || []).some((d) => d.code === 'rules' && d.detail === 6),
	J((a.parsed.dropped || []).filter((d) => d.code === 'rules')));
ok('the report has a sentence for the comments, from the language file',
	/comment/i.test(L.inpDropText('comments')) && L.inpDropText('comments') !== 'comments', L.inpDropText('comments'));

// ---- 2. export puts each one back, and a re-import reads the same ---------------------------------
console.log('\n2. The export writes every kept line back where it came from');
const out = EngCalcs.lpnExportInp(a.doc);
ok('it exports', out.ok === true, J(out.error));
const P = sectionAll(out.inp, 'PATTERNS'), C = sectionAll(out.inp, 'CONTROLS'), R = sectionAll(out.inp, 'RULES');
ok('[PATTERNS]: heading, description, PA\'s rows, ";", PB, heading and blank line, PC, the closing comment',
	P[0] === ';ID   Multipliers' && P[1] === ';Morning peak' && /^\s*PA\s/.test(P[2]) && P[3] === ';' && /^\s*PB\s/.test(P[4])
	&& P[5] === ';Separated by a blank line, so a heading (EPANET reads no description)' && P[6] === '' && /^\s*PC\s/.test(P[7])
	&& P[8] === ';after the last pattern' && P.length === 9, J(P));
ok('[CONTROLS] comes back as the file had it, less the left-out control and the blank line between groups',
	J(C) === J([';Controls heading', '', ';Fill the tank', 'LINK P1 OPEN IF NODE T3 BELOW 5', ';Two lines of',
		';heading comment', 'LINK P1 CLOSED IF NODE T3 ABOVE 15', 'LINK P2 OPEN AT TIME 2 ;trailing note',
		'LINK P2 CLOSED AT TIME 20', ';after the last control']), J(C));
ok('[RULES] comes back line for line, blank lines included', J(R) === J(RULES_IN), J(R));
const b = importText(out.inp, 'again.inp');
const keep = (d) => J({ p: d.patterns.map((x) => [x.id, x.head, x.note, x.foot]),
	c: d.controls.map((x) => [x.head, x.note, x.noteSrc, x.noteAt, x.foot]), r: d.rules });
ok('re-import: the same descriptions, headings and closing comments', keep(b.doc) === keep(a.doc), keep(b.doc));
ok('...and nothing reported lost the second time', !(b.parsed.dropped || []).some((d) => d.code === 'comments'),
	J((b.parsed.dropped || []).filter((d) => d.code === 'comments')));
{ const o2 = EngCalcs.lpnExportInp(b.doc).inp; const d1 = out.inp.split('\n'), d2 = o2.split('\n'); const at = d1.findIndex((l, k) => l !== d2[k]); ok('...and the second export is the first, character for character (bar the [TITLE] file name)', d1.slice(2).join('\n') === d2.slice(2).join('\n'), at + ': ' + J([d1[at], d2[at]])); }

// ---- 3. an edited description is written as one line --------------------------------------------
console.log('\n3. An edited description goes out as one line in the same place');
const ed = JSON.parse(JSON.stringify(a.doc));
ed.controls[1].note = 'Edited heading';
delete ed.controls[1].noteSrc;            // what the Library's Description field does
ed.controls[2].note = 'Edited trailing';
ed.patterns[0].note = 'Edited pattern';
const out2 = EngCalcs.lpnExportInp(ed);
const C2 = section(out2.inp, 'CONTROLS'), P2 = section(out2.inp, 'PATTERNS');
ok('control 2\'s two lines become one', C2[3] === ';Edited heading' && /^LINK P1 CLOSED/.test(C2[4]), J(C2));
ok('control 3 keeps its comment on its own line', C2[5] === 'LINK P2 OPEN AT TIME 2 ;Edited trailing', J(C2));
ok('the pattern\'s description line is the edited one, under its heading', P2[1] === ';Edited pattern', J(P2));
// A stale noteSrc (an old project, or an editor that forgot) must not write the OLD lines.
const st = JSON.parse(JSON.stringify(a.doc));
st.controls[1].note = 'Edited but src left';
ok('a noteSrc that no longer says the description is not written',
	section(EngCalcs.lpnExportInp(st).inp, 'CONTROLS')[3] === ';Edited but src left');
// A pattern with no multipliers: EPANET's writer states the comment anyway (inpfile.c).
const em = JSON.parse(JSON.stringify(a.doc));
em.patterns.push({ id: 'PE', multipliers: [], note: 'Empty one' });
const PE = sectionAll(EngCalcs.lpnExportInp(em).inp, 'PATTERNS');
ok('an empty pattern\'s description is written, followed by a blank line', PE[PE.length - 2] === ';Empty one' || PE[PE.length - 1] === ';Empty one', J(PE));
const emBack = importText(EngCalcs.lpnExportInp(em).inp, 'empty.inp').doc;
ok('...so it does not become the next pattern\'s description on the way back in',
	emBack.patterns.every((p) => p.note !== 'Empty one'), J(emBack.patterns.map((p) => [p.id, p.note])));

// ---- 3b. the Library's own rule edits, on Perry's file ------------------------------------------
console.log('\n3b. The Rules editor: a heading is never a description, never deleted with a rule');
{
	const live = L.getDoc();
	const keptRules = live.rules;
	live.rules = RULES_IN.slice();
	const es = L.ruleEntries();
	ok('two rules', es.length === 2 && es[0].name === 'R1' && es[1].name === 'R2', J(es));
	ok('rule R1\'s Description is "desc R1" alone, not the section heading', L.ruleDesc(es[0]) === 'desc R1', L.ruleDesc(es[0]));
	ok('rule R2\'s Description is its own comment', L.ruleDesc(es[1]) === 'Second rule description', L.ruleDesc(es[1]));
	const cleared = L.rulesSplice(es[0].descStart, es[0].start, []);
	ok('clearing R1\'s Description removes only its line; the heading stays', J(cleared) === J([';Rules section heading', ''].concat(RULES_IN.slice(3))), J(cleared));
	const del1 = L.rulesWithout(0);
	ok('deleting R1 removes R1 and its description; the heading and R2 stay',
		J(del1) === J([';Rules section heading', '', ';Second rule description', 'RULE R2', 'IF TANK T3 LEVEL BELOW 2', 'THEN LINK P2 STATUS IS OPEN']), J(del1));
	const del2 = L.rulesWithout(1);
	ok('deleting R2 removes R2 and its description; R1 and the heading stay', J(del2) === J(RULES_IN.slice(0, 6)), J(del2));
	// 6. a rule appended after loose comments keeps its own description and only that
	const dest = ['RULE A', 'IF TANK T3 LEVEL ABOVE 1', 'THEN LINK P2 STATUS IS OPEN', ';a loose comment'];
	const app = L.rulesAppend(dest, [';desc B', 'RULE B', 'IF TANK T3 LEVEL ABOVE 2', 'THEN LINK P2 STATUS IS CLOSED']);
	live.rules = app;
	const ea = L.ruleEntries();
	ok('an appended rule after a loose comment gets a blank line between',
		app[4] === '' && app[5] === ';desc B', J(app));
	ok('...so its Description is its own, not merged with the comment above', L.ruleDesc(ea[1]) === 'desc B', L.ruleDesc(ea[1]));
	ok('...and after a rule body no blank line is added', L.rulesAppend(dest.slice(0, 3), ['RULE C']).length === 4);
	live.rules = keptRules;
}

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

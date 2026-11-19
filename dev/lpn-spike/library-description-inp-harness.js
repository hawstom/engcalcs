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
	"\t\truleItems: function () { return libRuleItems(libRulesRead()); },\n" +
	"\t\trulesWith: libRulesWith,\n" +
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
const items = a.doc.controls || [], ctls = items.filter((c) => !c.comment);
ok('four controls are kept (the one naming a missing link is reported, as before)', ctls.length === 4, ctls.length);
ok('the comments are rows of their own, in the order the file states: heading, "Fill the tank", the two-line block, "above a missing link", the closing one',
	J(items.map((c) => c.comment ? c.lines.length : 'C')) === J([1, 1, 'C', 2, 'C', 'C', 'C', 1, 1]), J(items.map((c) => c.comment ? c.lines : c.raw)));
ok('the blank line before a comment or a control is its `gap`', items[1].gap === 1 && items[3].gap === 1 && items[0].gap === undefined, J(items.map((c) => c.gap)));
ok('no control reads a comment above it as its description', ctls.every((c) => c.head === undefined && c.noteSrc === undefined && c.foot === undefined));
ok('control 3 reads its trailing comment as its description', ctls[2].note === 'trailing note' && ctls[2].noteAt === 'end', J(ctls[2]));
ok('the comment above the control that was left out is KEPT as a row, so nothing is reported lost for [CONTROLS]', lost('CONTROLS') === undefined && items.some((c) => c.comment && c.lines[0] === ';above a missing link'), J(lost('CONTROLS')));
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
ok('[CONTROLS] comes back as the file had it, less the left-out control, whose blank line goes to the row after it',
	J(C) === J([';Controls heading', '', ';Fill the tank', 'LINK P1 OPEN IF NODE T3 BELOW 5', '', ';Two lines of',
		';heading comment', 'LINK P1 CLOSED IF NODE T3 ABOVE 15', 'LINK P2 OPEN AT TIME 2 ;trailing note',
		'LINK P2 CLOSED AT TIME 20', ';above a missing link', '', ';after the last control']), J(C));
ok('[RULES] comes back line for line, blank lines included', J(R) === J(RULES_IN), J(R));
const b = importText(out.inp, 'again.inp');
const keep = (d) => J({ p: d.patterns.map((x) => [x.id, x.head, x.note, x.foot]),
	c: d.controls.reduce((acc, x) => x.comment ? acc.concat(x.lines) : acc.concat([[x.raw, x.note, x.noteAt]]), []), r: d.rules });
ok('re-import: the same descriptions, headings and closing comments', keep(b.doc) === keep(a.doc), keep(b.doc));
ok('...and nothing reported lost the second time', !(b.parsed.dropped || []).some((d) => d.code === 'comments'),
	J((b.parsed.dropped || []).filter((d) => d.code === 'comments')));
{ const o2 = EngCalcs.lpnExportInp(b.doc).inp; const d1 = out.inp.split('\n'), d2 = o2.split('\n'); const at = d1.findIndex((l, k) => l !== d2[k]); ok('...and the second export is the first, character for character (bar the [TITLE] file name)', d1.slice(2).join('\n') === d2.slice(2).join('\n'), at + ': ' + J([d1[at], d2[at]])); }

// ---- 3. an edited description is written as one line --------------------------------------------
console.log('\n3. An edited description goes out as one line in the same place');
const ed = JSON.parse(JSON.stringify(a.doc));
ed.controls[5].note = 'Edited trailing';
ed.controls[3].lines = [';Edited heading'];   // what the Libraries comment field does
ed.patterns[0].note = 'Edited pattern';
const out2 = EngCalcs.lpnExportInp(ed);
const C2 = sectionAll(out2.inp, 'CONTROLS'), P2 = section(out2.inp, 'PATTERNS');
ok('an edited comment row goes out as the new lines, in the same place', C2[5] === ';Edited heading' && /^LINK P1 CLOSED/.test(C2[6]), J(C2));
ok('a control description is written after its sentence', C2.indexOf('LINK P1 CLOSED IF NODE T3 ABOVE 15 ;Edited trailing') >= 0 || C2.some((l) => /;Edited trailing$/.test(l)), J(C2));
ok('the pattern\'s description line is the edited one, under its heading', P2[1] === ';Edited pattern', J(P2));
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
	const es = L.ruleItems();
	ok('five items: heading, comment, rule R1, comment, rule R2', es.map((e) => e.kind).join() === 'comment,comment,rule,comment,rule' && es[2].name === 'R1' && es[4].name === 'R2', J(es));
	ok('a comment directly above a rule is its own row, not that rule\'s Description', es[1].lines[0] === ';desc R1' && es[1].gap === 1 && es[2].gap === 0, J(es));
	const cleared = L.rulesWith(1, null);
	ok('deleting the comment above R1 leaves the heading and both rules', J(cleared) === J([';Rules section heading', ''].concat(RULES_IN.slice(3))), J(cleared));
	const del1 = L.rulesWith(2, null);
	ok('deleting R1 removes R1 only; every comment and R2 stay',
		J(del1) === J([';Rules section heading', '', ';desc R1', '', ';Second rule description', 'RULE R2', 'IF TANK T3 LEVEL BELOW 2', 'THEN LINK P2 STATUS IS OPEN']), J(del1));
	const del2 = L.rulesWith(4, null);
	ok('deleting R2 removes R2 only', J(del2) === J(RULES_IN.slice(0, 8)), J(del2));
	const ed = L.rulesWith(3, [';Second, rewritten']);
	ok('editing a comment replaces only its lines', J(ed) === J(RULES_IN.slice(0, 7).concat([';Second, rewritten'], RULES_IN.slice(8))), J(ed));
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
		ok('Net3 [CONTROLS] is a comment row, two controls, a comment row of two lines, and four controls (Tom, 2026-11-16: a comment is a row)',
			J(d.controls.map((c) => c.comment ? c.lines.length : 'C')) === J([1, 'C', 'C', 2, 'C', 'C', 'C', 'C']) && d.controls[0].lines[0] === ';Lake source operates only part of the day' && d.controls[3].gap === 1, J(d.controls.map((c) => c.comment ? c.lines : c.raw)));
		ok('...and no Net3 control has a description of its own', d.controls.every((c) => c.comment || c.note === undefined));
		ok('Net3 [CONTROLS] exports character for character', section(o.inp, 'CONTROLS').join('\n') === section(text, 'CONTROLS').join('\n'));
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
ok('comment rows and a control description survive', re.controls && J(re.controls[3].lines) === J([';Two lines of', ';heading comment'])
	&& re.controls[5].note === 'trailing note' && re.controls[3].gap === 1);
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

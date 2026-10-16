// A DESCRIPTION TAKES LINES AND PARAGRAPHS, AND AN .inp CARRIES THEM (Task 806). Run with:
//   node dev/lpn-spike/description-lines-harness.js
//
// Tom, 2026-10-15: "I think that all Description fields should allow multiple lines and paragraphs
// like most software to allow internal documentation."
//
// Tom, 2026-10-16, on how the .inp holds them: "Maybe " \P ", since it's both intuitive, and it's
// what Autodesk historically used in Dimensions."
//
// EPANET holds one line per description (a trailing `;comment`; a pattern's or curve's one comment
// line above its rows) and has no continuation syntax. The rule under test: the WHOLE description
// goes in that one place, each line break written as " \P ". Asserted here: a multi-line description
// of every kind survives export and re-import, a blank paragraph line is two markers, a bare "\P"
// reads as a break too, a backslash-P the person typed survives as typed, a single-line description
// is written exactly as it always was, a file in the early `;|` layout still reads and goes back out
// as one line, and nothing is silently dropped.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-rules.js');
require(ROOT + 'js/lpn-inp.js');
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-dxf.js');
require(ROOT + 'js/lpn-tablefile.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
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
const J = (v) => JSON.stringify(v);

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

function importText(text, name) {
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { throw new Error(name + ': ' + parsed.error); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	return { parsed, doc: L.docFromInp(parsed, name) };
}
function lines(text, sec) {
	const out = []; let on = false;
	text.split(/\r?\n/).forEach((l) => {
		const m = /^\s*\[(\w+)\]/.exec(l);
		if (m) { on = m[1].toUpperCase() === sec; return; }
		if (on) { out.push(l.replace(/\s+$/, '')); }
	});
	return out;
}

// ---- 1. text rules -------------------------------------------------------------------------------
console.log('1. lpnDescText keeps lines and paragraphs');
{
	const d = EngCalcs.lpnDescText;
	ok('LF kept', d('A\nB') === 'A\nB');
	ok('CRLF and CR become LF', d('A\r\nB\rC') === 'A\nB\nC');
	ok('a blank line (paragraph break) is kept', d('A\n\nB') === 'A\n\nB');
	ok('trailing blanks per line and blank lines at the ends go', d('\n A  \nB \n\n') === 'A\nB');
	ok('first line / one line helpers', EngCalcs.lpnDescFirstLine('A\nB') === 'A' && EngCalcs.lpnDescOneLine('A\n\nB') === 'A B');
	const I = EngCalcs.lpnDescInline, F = (s) => EngCalcs.lpnDescText(EngCalcs.lpnDescFromInline(s));
	ok('inline: a line break is " \\P ", a blank line two markers', I('A\nB\n\nC') === 'A \\P B \\P  \\P C', J(I('A\nB\n\nC')));
	ok('inline: one line is unchanged, a backslash without P too', I('C:\\temp; a') === 'C:\\temp; a');
	ok('inline: a typed backslash-P gains one backslash', I('C:\\Pumps') === 'C:\\\\Pumps' && I('x\\\\Py') === 'x\\\\\\Py', J(I('C:\\Pumps')));
	ok('read back: " \\P ", bare "\\P", and a run of markers', F('A \\P B') === 'A\nB' && F('A\\PB') === 'A\nB' && F('A \\P  \\P B') === 'A\n\nB');
	ok('read back: one space each side belongs to the marker, so an indent survives', F('A \\P   two') === 'A\n  two', J(F('A \\P   two')));
	ok('read back: "\\\\P" is a typed backslash-P', F('C:\\\\Pumps') === 'C:\\Pumps' && F('x\\\\\\Py') === 'x\\\\Py');
	ok('read back: text with no \\P is returned as it came', EngCalcs.lpnDescFromInline('  C:\\temp  ') === '  C:\\temp  ');
	['A\nB', 'A\n\nB', 'C:\\Pumps\nsecond \\P literal', 'A\n  indented', 'tab\there', '\\', 'end\\', 'P\\\\P\\']
		.forEach((t) => ok('round trip ' + J(t), F(I(t)) === EngCalcs.lpnDescText(t), J(I(t)) + ' -> ' + J(F(I(t)))));
	ok('DXF carries a newline as the caret escape ^J, not a raw line break', EngCalcs.lpnDxfString('A\nB') === 'A^JB', EngCalcs.lpnDxfString('A\nB'));
}

// ---- 2. a crafted file with continuation lines ---------------------------------------------------
console.log('\n2. A file in the early ;| layout still reads, and writes back as one line with \\P');
const SRC = [
	'[JUNCTIONS]', ';ID Elev Demand',
	' J1\t100\t0\t;Corner of Elm and Main',
	' J2\t90\t12\t;First line',
	';|Second line',
	';|',
	';|Third paragraph',
	' J3\t85\t8',
	'[RESERVOIRS]', ' R1\t200\t;Plant', ';|discharge, 24 in',
	'[TANKS]', ' T1\t120\t10\t0\t25\t15\t0\t;Standpipe', ';|north hill',
	'[PIPES]',
	' P1\tR1\tJ1\t1200\t12\t100\t0\tOpen\t;1962 main', ';|replaced 2019',
	' P2\tJ1\tJ2\t800\t8\t100\t0\tOpen',
	' P3\tJ2\tJ3\t600\t6\t100\t0\tOpen',
	' P4\tJ3\tT1\t500\t8\t100\t0\tOpen',
	'[VALVES]', ' V1\tJ1\tJ3\t6\tTCV\t2\t0\t;Vault 14', ';|north side',
	'[PATTERNS]', ';|second line of it', ';Morning peak', ' PA\t1\t2\t3',
	'[CURVES]', ';|rated 2019', ';PUMP: Pump 10', ' C1\t0\t100', ' C1\t500\t60',
	'[CONTROLS]', ';Fill the tank', ';|and no more', 'LINK P1 OPEN IF NODE T1 BELOW 5',
	'[OPTIONS]', ' UNITS\tGPM', ' HEADLOSS\tH-W',
	'[END]', ''
].join('\n');
const a = importText(SRC, 'lines.inp');
const byId = (arr, id) => arr.filter((x) => x.id === id)[0];
const node = (id) => byId(a.doc.nodes, id), link = (id) => byId(a.doc.links, id);
ok('J1 single line unchanged', node('J1').desc === 'Corner of Elm and Main', J(node('J1').desc));
ok('J2 reads three lines with a paragraph break', node('J2').desc === 'First line\nSecond line\n\nThird paragraph', J(node('J2').desc));
ok('J3 has none', node('J3').desc === undefined);
ok('R1 tank T1 pipe P1 valve V1 read their continuation',
	node('R1').desc === 'Plant\ndischarge, 24 in' && node('T1').desc === 'Standpipe\nnorth hill'
	&& link('P1').desc === '1962 main\nreplaced 2019' && link('V1').desc === 'Vault 14\nnorth side');
ok('pattern note', byId(a.doc.patterns, 'PA').note === 'Morning peak\nsecond line of it', J(byId(a.doc.patterns, 'PA').note));
ok('curve note', byId(a.doc.curves, 'C1').note === 'Pump 10\nrated 2019', J(byId(a.doc.curves, 'C1').note));
ok('control note', a.doc.controls[0].note === 'Fill the tank\nand no more', J(a.doc.controls[0].note));
ok('nothing about the ;| lines is reported lost', !(a.parsed.dropped || []).some((d) => d.code === 'comments'), J(a.parsed.dropped));

const out = EngCalcs.lpnExportInp(a.doc);
ok('it exports', out.ok === true, J(out.error));
const Jn = lines(out.inp, 'JUNCTIONS').filter(Boolean);
ok('J2 is written whole on its row, " \\P " for each line break',
	Jn.some((l) => /^\s*J2\s/.test(l) && l.endsWith('\t;First line \\P Second line \\P  \\P Third paragraph')), J(Jn));
ok('no ;| line is written anywhere', !out.inp.split(/\r?\n/).some((l) => /^\s*;\|/.test(l)));
ok('J1 single line written exactly as before', Jn.some((l) => /^\s*J1\s+100(\.0+)?\s+.*\t;Corner of Elm and Main$/.test(l) || /\t;Corner of Elm and Main$/.test(l)), J(Jn));
ok('the pattern writes one comment line above its rows',
	J(lines(out.inp, 'PATTERNS').filter(Boolean).slice(0, 2).map((l) => l.replace(/\s+/g, ' '))) === J([';Morning peak \\P second line of it', ' PA 1 2 3']), J(lines(out.inp, 'PATTERNS')));
ok('the curve writes one type line above its rows', (() => { const c = lines(out.inp, 'CURVES').filter(Boolean); return c[0] === ';PUMP: Pump 10 \\P rated 2019' && /^\s*C1\s/.test(c[1]); })(), J(lines(out.inp, 'CURVES')));
ok('the control writes one line above it', (() => { const c = lines(out.inp, 'CONTROLS').filter(Boolean); return c[0] === ';Fill the tank \\P and no more' && /^LINK P1/.test(c[1]); })(), J(lines(out.inp, 'CONTROLS')));
const b = importText(out.inp, 'lines.inp');
const dump = (d) => J({ n: d.nodes.map((x) => [x.id, x.desc]), l: d.links.map((x) => [x.id, x.desc]),
	p: d.patterns.map((x) => [x.id, x.note]), c: d.curves.map((x) => [x.id, x.note]), k: d.controls.map((x) => x.note) });
ok('re-import reads the same descriptions', dump(b.doc) === dump(a.doc), dump(b.doc));
{ const o2 = EngCalcs.lpnExportInp(b.doc).inp, d1 = out.inp.split('\n'), d2 = o2.split('\n'), at = d1.findIndex((l, k) => l !== d2[k]);
	ok('second export is identical to the first (stable)', o2 === out.inp, 'line ' + at + ': ' + J(d1[at]) + ' vs ' + J(d2[at])); }
ok('no text of any description is lost: every source line is in the export',
	['First line', 'Second line', 'Third paragraph', 'discharge, 24 in', 'north hill', 'replaced 2019', 'north side', 'second line of it', 'rated 2019', 'and no more']
		.every((t) => out.inp.indexOf(t) >= 0));

// ---- 2b. EPANET ITSELF SEES THE WHOLE TEXT EVERYWHERE -------------------------------------------
// Runs the vendored epanet-js engine on the export and reads each comment back through its own
// getComment: the one comment slot holds the whole description, " \P " and all.
console.log('\n2b. The vendored EPANET engine reads every description whole');
const done2b = (async () => {
	const mod = await import(require('url').pathToFileURL(ROOT + 'js/vendor/epanet-js.js').href);
	const ws = new mod.Workspace(); await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('d.inp', out.inp);
	p.open('d.inp', 'd.rpt', 'd.out');
	const T = mod.ObjectType, idx = (t, id) => ({ [T.Node]: () => p.getNodeIndex(id), [T.Link]: () => p.getLinkIndex(id),
		[T.TimePat]: () => p.getPatternIndex(id), [T.Curve]: () => p.getCurveIndex(id) })[t]();
	const c = (t, id) => p.getComment(t, idx(t, id));
	ok('junction J2 (three lines)', c(T.Node, 'J2') === 'First line \\P Second line \\P  \\P Third paragraph', J(c(T.Node, 'J2')));
	ok('junction J1 (one line)', c(T.Node, 'J1') === 'Corner of Elm and Main');
	ok('junction J3 (none) is not handed a stray line', c(T.Node, 'J3') === '', J(c(T.Node, 'J3')));
	ok('reservoir R1', c(T.Node, 'R1') === 'Plant \\P discharge, 24 in', J(c(T.Node, 'R1')));
	ok('tank T1', c(T.Node, 'T1') === 'Standpipe \\P north hill');
	ok('pipe P1', c(T.Link, 'P1') === '1962 main \\P replaced 2019', J(c(T.Link, 'P1')));
	ok('valve V1', c(T.Link, 'V1') === 'Vault 14 \\P north side', J(c(T.Link, 'V1')));
	ok('pattern PA', c(T.TimePat, 'PA') === 'Morning peak \\P second line of it', J(c(T.TimePat, 'PA')));
	ok('curve C1 (EPANET keeps the type line whole)', c(T.Curve, 'C1') === 'PUMP: Pump 10 \\P rated 2019', J(c(T.Curve, 'C1')));
	p.close();
})().catch((e) => { ok('the engine read the export: ' + e.message, false); });

// ---- 2c. a file in the " \P " layout -----------------------------------------------------------
console.log('\n2c. A file that says \\P reads it as a line break; an unedited one writes back character for character');
const SRC2 = [
	'[JUNCTIONS]',
	' J1\t100\t0\t;Corner of Elm \\P and Main',
	' J2\t90\t12\t;Bare\\Pmarker',
	' J3\t85\t8\t;Share is \\\\Public\\docs',
	' J4\t80\t0\t;C:\\temp, no marker',
	'[RESERVOIRS]', ' R1\t200',
	'[PIPES]',
	' P1\tR1\tJ1\t1200\t12\t100\t0\tOpen\t;1962 main \\P  \\P replaced 2019',
	' P2\tJ1\tJ2\t800\t8\t100\t0\tOpen',
	' P3\tJ2\tJ3\t600\t6\t100\t0\tOpen',
	' P4\tJ3\tJ4\t500\t8\t100\t0\tOpen',
	'[PATTERNS]', ';Morning peak \\P weekdays', ' PA\t1\t2\t3',
	'[CURVES]', ';PUMP: Pump 10 \\P rated 2019', ' C1\t0\t100', ' C1\t500\t60',
	'[CONTROLS]', ';Fill the tank \\P and no more', 'LINK P1 OPEN IF NODE J1 BELOW 5',
	'LINK P2 CLOSED IF NODE J2 ABOVE 90 ;close it \\P at night',
	'[OPTIONS]', ' UNITS\tGPM', ' HEADLOSS\tH-W',
	'[END]', ''
].join('\n');
{
	const r = importText(SRC2, 'p.inp'), d = r.doc;
	ok('" \\P " is a line break', byId(d.nodes, 'J1').desc === 'Corner of Elm\nand Main', J(byId(d.nodes, 'J1').desc));
	ok('a bare "\\P" is a line break', byId(d.nodes, 'J2').desc === 'Bare\nmarker', J(byId(d.nodes, 'J2').desc));
	ok('"\\\\P" is a typed backslash-P', byId(d.nodes, 'J3').desc === 'Share is \\Public\\docs', J(byId(d.nodes, 'J3').desc));
	ok('a backslash with no P is text', byId(d.nodes, 'J4').desc === 'C:\\temp, no marker');
	ok('two markers are a blank line', byId(d.links, 'P1').desc === '1962 main\n\nreplaced 2019', J(byId(d.links, 'P1').desc));
	ok('pattern, curve, control above and control trailing', byId(d.patterns, 'PA').note === 'Morning peak\nweekdays'
		&& byId(d.curves, 'C1').note === 'Pump 10\nrated 2019' && d.controls[0].note === 'Fill the tank\nand no more'
		&& d.controls[1].note === 'close it\nat night', J([byId(d.curves, 'C1').note, d.controls.map((c) => c.note)]));
	const o = EngCalcs.lpnExportInp(d).inp, has = (l) => o.split(/\r?\n/).some((x) => x.replace(/\s+$/, '').endsWith(l));
	ok('J1, J3, J4 and P1 written back character for character', has('\t;Corner of Elm \\P and Main') && has('\t;Share is \\\\Public\\docs')
		&& has('\t;C:\\temp, no marker') && has('\t;1962 main \\P  \\P replaced 2019'), J(lines(o, 'JUNCTIONS')));
	ok('the bare "\\P" goes back out in the spaced spelling', has('\t;Bare \\P marker'));
	ok('pattern, curve and both controls written back as they came', has(';Morning peak \\P weekdays') && has(';PUMP: Pump 10 \\P rated 2019')
		&& has(';Fill the tank \\P and no more') && has('ABOVE 90 ;close it \\P at night'), J(lines(o, 'CONTROLS')));
	{ const o2 = EngCalcs.lpnExportInp(importText(o, 'p.inp').doc).inp, a1 = o.split('\n'), a2 = o2.split('\n'), at = a1.findIndex((l, k) => l !== a2[k]);
		ok('a second round trip is stable', o2 === o, at + ': ' + J(a1[at]) + ' vs ' + J(a2[at])); }
}

// ---- 3. an edit made on the page -----------------------------------------------------------------
console.log('\n3. A description typed on the page (with paragraphs) exports and comes back');
{
	const doc = JSON.parse(JSON.stringify(a.doc));
	byId(doc.nodes, 'J3').desc = 'Meter vault\n\nKey at the office\n  indented';
	byId(doc.links, 'P2').desc = 'one line only';
	doc.patterns[0].note = 'Edited\nlines';
	byId(doc.nodes, 'J1').desc = 'Typed C:\\Pumps\nand a second line';
	doc.controls[0].note = 'One\nTwo';
	const o = EngCalcs.lpnExportInp(doc).inp;
	ok('J3 is written on its row with the markers', o.indexOf('\t;Meter vault \\P  \\P Key at the office \\P   indented\n') > 0, J(lines(o, 'JUNCTIONS')));
	ok('a typed backslash-P is written with one more backslash', o.indexOf('\t;Typed C:\\\\Pumps \\P and a second line') > 0);
	const r = importText(o, 'edited.inp').doc;
	ok('...and reads back as typed', byId(r.nodes, 'J1').desc === 'Typed C:\\Pumps\nand a second line', J(byId(r.nodes, 'J1').desc));
	ok('an edited control note goes out on one line', lines(o, 'CONTROLS').filter(Boolean)[0] === ';One \\P Two' && r.controls[0].note === 'One\nTwo', J(lines(o, 'CONTROLS')));
	ok('J3 comes back with its paragraphs and indent', byId(r.nodes, 'J3').desc === 'Meter vault\n\nKey at the office\n  indented', J(byId(r.nodes, 'J3').desc));
	ok('P2 one line stays one line', byId(r.links, 'P2').desc === 'one line only');
	ok('the pattern edit', r.patterns[0].note === 'Edited\nlines');
}

// ---- 4. a stray ;| comment is not swallowed -------------------------------------------------------
console.log('\n4. A ;| comment that follows no element row is an ordinary comment');
{
	const s2 = SRC.replace(' J3\t85\t8', ';|stray\n J3\t85\t8').replace('[JUNCTIONS]', '[JUNCTIONS]\n;|before any row');
	const r = importText(s2, 'stray.inp');
	ok('J3 is unaffected by a stray ;| above it', byId(r.doc.nodes, 'J3').desc === undefined);
	ok('...and J1 is not given the stray line', byId(r.doc.nodes, 'J1').desc === 'Corner of Elm and Main');
}

// ---- 5. exports that quote -----------------------------------------------------------------------
console.log('\n5. CSV quotes a newline; GeoJSON is JSON');
{
	const heads = ['ID', 'Description'], rows = [['J2', 'First\nSecond "q"']];
	const csv = EngCalcs.lpnTableCsv(heads, rows);
	ok('CSV quotes a field with a line break and doubles its quotes', /"First\r?\nSecond ""q"""/.test(csv), J(csv));
}
{
	const gj = JSON.stringify({ properties: { description: 'A\n\nB' } });
	ok('GeoJSON properties escape the newline', gj.indexOf('\\n\\n') > 0 && JSON.parse(gj).properties.description === 'A\n\nB');
}

done2b.then(() => {
console.log(fails ? '\n' + fails + ' FAILED' : '\nall description-lines checks passed');
process.exit(fails ? 1 : 0);
});

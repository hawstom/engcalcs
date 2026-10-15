// A DESCRIPTION TAKES LINES AND PARAGRAPHS, AND AN .inp CARRIES THEM (Task 806). Run with:
//   node dev/lpn-spike/description-lines-harness.js
//
// Tom, 2026-10-15: "I think that all Description fields should allow multiple lines and paragraphs
// like most software to allow internal documentation."
//
// EPANET holds one line per description (a trailing `;comment`; a pattern's or curve's one comment
// line above its rows) and has no continuation syntax. The rule under test: the FIRST line goes
// exactly where EPANET puts a description, and each later line goes on a `;|` whole-line comment
// directly after it. Asserted here: a multi-line description of every kind survives export and
// re-import, a blank paragraph line is a bare `;|`, a single-line description is written exactly as
// it always was, an unedited `;|` file round-trips byte for byte in those lines, and nothing is
// silently dropped.

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
	ok('DXF carries a newline as the caret escape ^J, not a raw line break', EngCalcs.lpnDxfString('A\nB') === 'A^JB', EngCalcs.lpnDxfString('A\nB'));
}

// ---- 2. a crafted file with continuation lines ---------------------------------------------------
console.log('\n2. A file with ;| lines reads into one description per element, and writes back the same');
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
ok('J2 is written: first line on the row, then ;| lines, a bare ;| for the blank',
	Jn.some((l, k) => /^\s*J2\s.*\t;First line$/.test(l) && Jn[k + 1] === ';|Second line' && Jn[k + 2] === ';|' && Jn[k + 3] === ';|Third paragraph'), J(Jn));
ok('J1 single line written exactly as before', Jn.some((l) => /^\s*J1\s+100(\.0+)?\s+.*\t;Corner of Elm and Main$/.test(l) || /\t;Corner of Elm and Main$/.test(l)), J(Jn));
ok('J1 gets no continuation line', Jn[Jn.findIndex((l) => /^\s*J1\s/.test(l)) + 1].indexOf(';|') !== 0);
ok('the pattern writes the ;| lines, then the first line LAST above its rows',
	J(lines(out.inp, 'PATTERNS').filter(Boolean).slice(0, 3).map((l) => l.replace(/\s+/g, ' '))) === J([';|second line of it', ';Morning peak', ' PA 1 2 3']), J(lines(out.inp, 'PATTERNS')));
ok('the curve writes the ;| line, then its type line last above its rows', (() => { const c = lines(out.inp, 'CURVES').filter(Boolean); return c[0] === ';|rated 2019' && c[1] === ';PUMP: Pump 10'; })(), J(lines(out.inp, 'CURVES')));
ok('the control writes its two lines above it', (() => { const c = lines(out.inp, 'CONTROLS').filter(Boolean); return c[0] === ';Fill the tank' && c[1] === ';|and no more' && /^LINK P1/.test(c[2]); })(), J(lines(out.inp, 'CONTROLS')));
const b = importText(out.inp, 'lines.inp');
const dump = (d) => J({ n: d.nodes.map((x) => [x.id, x.desc]), l: d.links.map((x) => [x.id, x.desc]),
	p: d.patterns.map((x) => [x.id, x.note]), c: d.curves.map((x) => [x.id, x.note]), k: d.controls.map((x) => x.note) });
ok('re-import reads the same descriptions', dump(b.doc) === dump(a.doc), dump(b.doc));
{ const o2 = EngCalcs.lpnExportInp(b.doc).inp, d1 = out.inp.split('\n'), d2 = o2.split('\n'), at = d1.findIndex((l, k) => l !== d2[k]);
	ok('second export is identical to the first (stable)', o2 === out.inp, 'line ' + at + ': ' + J(d1[at]) + ' vs ' + J(d2[at])); }
ok('no text of any description is lost: every source line is in the export',
	['First line', 'Second line', 'Third paragraph', 'discharge, 24 in', 'north hill', 'replaced 2019', 'north side', 'second line of it', 'rated 2019', 'and no more']
		.every((t) => out.inp.indexOf(t) >= 0));

// ---- 2b. EPANET ITSELF SEES THE FIRST LINE EVERYWHERE ------------------------------------------
// Runs the vendored epanet-js engine on the export (EPANET 2.2 keeps the LAST comment-only line
// above a pattern's or curve's rows -- src/input2.c, "Store full line comment" -- so the first
// line must be that one) and reads each comment back through its own getComment.
console.log('\n2b. The vendored EPANET engine reads the first line of every description');
const done2b = (async () => {
	const mod = await import(require('url').pathToFileURL(ROOT + 'js/vendor/epanet-js.js').href);
	const ws = new mod.Workspace(); await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('d.inp', out.inp);
	p.open('d.inp', 'd.rpt', 'd.out');
	const T = mod.ObjectType, idx = (t, id) => ({ [T.Node]: () => p.getNodeIndex(id), [T.Link]: () => p.getLinkIndex(id),
		[T.TimePat]: () => p.getPatternIndex(id), [T.Curve]: () => p.getCurveIndex(id) })[t]();
	const c = (t, id) => p.getComment(t, idx(t, id));
	ok('junction J2 (three lines)', c(T.Node, 'J2') === 'First line', J(c(T.Node, 'J2')));
	ok('junction J1 (one line)', c(T.Node, 'J1') === 'Corner of Elm and Main');
	ok('junction J3 (none) is not handed a stray line', c(T.Node, 'J3') === '', J(c(T.Node, 'J3')));
	ok('reservoir R1', c(T.Node, 'R1') === 'Plant');
	ok('tank T1', c(T.Node, 'T1') === 'Standpipe');
	ok('pipe P1', c(T.Link, 'P1') === '1962 main', J(c(T.Link, 'P1')));
	ok('valve V1', c(T.Link, 'V1') === 'Vault 14', J(c(T.Link, 'V1')));
	ok('pattern PA', c(T.TimePat, 'PA') === 'Morning peak', J(c(T.TimePat, 'PA')));
	ok('curve C1 (EPANET keeps the type line whole)', c(T.Curve, 'C1') === 'PUMP: Pump 10', J(c(T.Curve, 'C1')));
	p.close();
})().catch((e) => { ok('the engine read the export: ' + e.message, false); });

// ---- 3. an edit made on the page -----------------------------------------------------------------
console.log('\n3. A description typed on the page (with paragraphs) exports and comes back');
{
	const doc = JSON.parse(JSON.stringify(a.doc));
	byId(doc.nodes, 'J3').desc = 'Meter vault\n\nKey at the office\n  indented';
	byId(doc.links, 'P2').desc = 'one line only';
	doc.patterns[0].note = 'Edited\nlines';
	const o = EngCalcs.lpnExportInp(doc).inp;
	const r = importText(o, 'edited.inp').doc;
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

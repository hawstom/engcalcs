// THE SHIPPED Net3 MUST EXPORT ITSELF BACK. Run with:
//   node dev/lpn-spike/inp-roundtrip-net3-harness.js
//
// ROADMAP Task 430. Tom, 2026-08-18: "A round trip survives to very close results. Not identical...
// I notice that the inputs have been converted." Net3 is in standard EPANET US units, so nothing
// about it should ever be multiplied by anything -- which reframes the task from "which units do we
// write" to "the pass-through did not fire on a file that should have hit it".
//
// THIS HARNESS TAKES THE USER'S PATH, not the developer's. inp-export-harness.js imports
// dev/lpn-spike/reference/Net3.inp with the CURRENT importer and re-exports it, and passes: 1,280
// tokens byte-identical. What a visitor actually opens is examples/Net3-lpn.json off the gallery
// wall, and that is a different document -- generated once, committed, and served ever since. So the
// comparison here is: the SHIPPED gallery Net3, opened the way applySaved() opens it, exported, and
// diffed token by token against EPA's own Net3.inp.
//
// IT CLASSIFIES rather than merely asserting, because "FAIL" answers none of Task 430's questions:
//
//   CONVERTED   parseFloat differs -- a factor was applied. This is the thing Task 430 is named for.
//   REFORMATTED the value is the same double and the CHARACTERS are not ("220.0" -> "220"). The
//               user's own text was spent. Also a pass-through failure, one layer up.
//   RENAMED     a non-numeric token the writer replaced (a pump's curve id).
//
// KNOWN FAILING BY DESIGN: it exits 0 so a red run cannot block an unrelated commit, and prints a
// banner instead. Turn EXPECT_CLEAN on when Task 430 is fixed, and it becomes an ordinary harness.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

// Flip to true once Task 430 lands: the harness then fails the build on any regression.
const EXPECT_CLEAN = false;

const L = loadLoopedNetwork(
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

// The same deliberately-dumber reader the other .inp harnesses use: section, id, column. Asking the
// real parser what the file says would be asking the defendant for the verdict.
function tokensBySection(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		out[section].push(line.split(/\s+/));
	}
	return out;
}
function rowsById(rows) {
	const out = {};
	(rows || []).forEach((r) => { if (!(r[0] in out)) { out[r[0]] = r; } });
	return out;
}

// What each column of each section IS, so a count can be reported per QUANTITY and not merely per
// section. Column 0 is the id everywhere.
const COLUMNS = {
	JUNCTIONS: [null, 'elevation', 'demand', 'pattern'],
	RESERVOIRS: [null, 'head', 'pattern'],
	TANKS: [null, 'elevation', 'initial level', 'min level', 'max level', 'tank diameter', 'min volume'],
	PIPES: [null, 'node1', 'node2', 'length', 'pipe diameter', 'roughness', 'minor loss', 'status'],
	PUMPS: [null, 'node1', 'node2', 'parameter', 'curve id'],
	VALVES: [null, 'node1', 'node2', 'valve diameter', 'valve type', 'setting', 'minor loss'],
	COORDINATES: [null, 'x', 'y'],
	VERTICES: [null, 'x', 'y']
};
const SECTIONS = Object.keys(COLUMNS);

function compare(label, srcText, gotText) {
	const src = tokensBySection(srcText), got = tokensBySection(gotText);
	const findings = [];
	let compared = 0, identical = 0;
	SECTIONS.forEach((sec) => {
		if (!src[sec] || !src[sec].length) { return; }
		if (!got[sec]) {
			findings.push({ kind: 'SECTION MISSING', sec, id: '', col: '', from: src[sec].length + ' rows', to: '(none)' });
			return;
		}
		const gm = rowsById(got[sec]);
		src[sec].forEach((r) => {
			const q = gm[r[0]];
			if (!q) { return; }   // a row the writer legitimately does not emit is not a token question
			for (let i = 1; i < r.length; i++) {
				const a = r[i], b = q[i];
				if (b === undefined) { continue; }
				compared++;
				if (a === b) { identical++; continue; }
				const x = parseFloat(a), y = parseFloat(b);
				const kind = (isFinite(x) && isFinite(y))
					? (x === y ? 'REFORMATTED' : 'CONVERTED')
					: 'RENAMED';
				findings.push({ kind, sec, id: r[0], col: (COLUMNS[sec][i] || 'col' + i), from: a, to: b });
			}
		});
	});
	return { label, findings, compared, identical };
}

function report(res) {
	console.log('\n  ' + res.label);
	console.log('  ' + res.compared + ' tokens compared, ' + res.identical + ' byte-identical, ' +
		res.findings.length + ' different');
	if (!res.findings.length) { return; }
	const byKind = {};
	res.findings.forEach((f) => {
		const k = f.kind + '  ' + f.sec + ' / ' + f.col;
		(byKind[k] = byKind[k] || []).push(f);
	});
	Object.keys(byKind).sort().forEach((k) => {
		const list = byKind[k];
		const sample = list.slice(0, 4).map((f) => f.id + ': ' + JSON.stringify(f.from) + ' -> ' + JSON.stringify(f.to));
		console.log('    ' + String(list.length) + '  ' + k);
		sample.forEach((s) => console.log('            ' + s));
		if (list.length > sample.length) { console.log('            ... and ' + (list.length - sample.length) + ' more'); }
	});
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const REF = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');

// ---- 1. the reproducible case: the Net3 the gallery ships --------------------------------------
console.log('\n1. The shipped gallery Net3, opened and exported');
const shipped = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net3-lpn.json'), 'utf8'));
console.log('  examples/Net3-lpn.json units: ' + JSON.stringify(shipped.units));
console.log('  elements carrying the file\'s own text (tok): ' +
	(shipped.nodes.concat(shipped.links).filter((e) => e && e.tok).length) +
	' of ' + (shipped.nodes.length + shipped.links.length));
L.applySaved(JSON.parse(JSON.stringify(shipped)));
const galleryDoc = L.serializeProject();
const galleryOut = EngCalcs.lpnExportInp(galleryDoc);
if (!galleryOut.ok) { console.log('  EXPORT REFUSED: ' + JSON.stringify(galleryOut)); process.exit(0); }
console.log('  the seven selectors the writer compared: ' + JSON.stringify(galleryDoc.units));
console.log('  units the writer reports converting: ' +
	JSON.stringify(galleryOut.differences.filter((d) => d.code === 'unit-converted' || d.code === 'flow-units-not-epanet')));
const gallery = compare('examples/Net3-lpn.json  ->  .inp   vs   EPA Net3.inp', REF, galleryOut.inp);
report(gallery);

// ---- 2. the control: the same model imported from the .inp today -------------------------------
// If this one is clean and the one above is not, the writer is not the defendant -- the DOCUMENT is.
console.log('\n2. Control: reference/Net3.inp imported with today\'s reader, then exported');
const parsed = EngCalcs.lpnInpParse(REF);
L.applyUnitSelections(L.inpUnitSelections(parsed));
const freshDoc = L.docFromInp(parsed, 'Net3.inp');
console.log('  elements carrying the file\'s own text (tok): ' +
	(freshDoc.nodes.concat(freshDoc.links).filter((e) => e && e.tok).length) +
	' of ' + (freshDoc.nodes.length + freshDoc.links.length));
const freshOut = EngCalcs.lpnExportInp(freshDoc);
const fresh = compare('reference/Net3.inp  ->  import  ->  .inp   vs   EPA Net3.inp', REF, freshOut.inp);
report(fresh);

// ---- 3. the verdict ---------------------------------------------------------------------------
const converted = gallery.findings.filter((f) => f.kind === 'CONVERTED');
const reformatted = gallery.findings.filter((f) => f.kind === 'REFORMATTED');
const renamed = gallery.findings.filter((f) => f.kind === 'RENAMED');
console.log('\n3. Verdict');
console.log('  CONVERTED   (a factor was applied): ' + converted.length);
console.log('  REFORMATTED (the user\'s characters were spent): ' + reformatted.length);
console.log('  RENAMED     (a token the writer replaces): ' + renamed.length);
console.log('  the same model imported from its .inp today: ' + fresh.findings.length + ' differences');

const clean = gallery.findings.length === 0;
if (clean) {
	console.log('\nall Net3 round-trip checks passed');
} else if (EXPECT_CLEAN) {
	console.log('\nFAIL: the Net3 round trip is not byte-identical');
	process.exit(1);
} else {
	console.log('\n*** KNOWN FAILING (Task 430) *** ' + gallery.findings.length +
		' tokens do not come back as themselves. Diagnosis: dev/inp-export-conversion-bug.md.');
	console.log('Exiting 0 on purpose so this cannot block an unrelated commit; set EXPECT_CLEAN once fixed.');
}

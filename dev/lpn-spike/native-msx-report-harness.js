// THE EPANET-MSX TEXT REPORT FROM THE BUILT-IN RUN (Task 733, native-wire). Run with:
//
//   node dev/lpn-spike/native-msx-report-harness.js
//
// EPANET-MSX writes a text report of its own into the run report (msxrpt.c): a logo and the title, then for each node and link the
// [REPORT] section flags a table of the species it flags, one row per reporting time. Each case runs the engine and the built-in loop on one network and one .msx and
// compares the two texts from "Analysis ended" to the end of the MSX tables: every word and heading must be equal;
// the numbers are the two solvers' own (they differ by 2.6e-4 of the value at worst, native-msx-harness.js), so a printed
// number may differ in its last digit. The engine prints series tables whatever [TIMES] Statistic says (measured, four values), so
// the loop does too. The "Water Quality Mass Balance" blocks after the tables are compared too: each mass to 2e-3 of itself.
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
['lpn-inp', 'lpn-epanet', 'lpn-time', 'lpn-native-msx', 'lpn-native-run'].forEach((f) => require(path.join(ROOT, 'js', f + '.js')));
const { buildModel } = require('./net3-model.js');
let pass = 0, fail = 0;
function ok(name, cond, extra) { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : '')); cond ? pass++ : fail++; }
const FIX = path.join(__dirname, 'fixtures', 'msx-example');
const copy = (m) => JSON.parse(JSON.stringify(m));
const EXMSX = fs.readFileSync(path.join(FIX, 'example.msx'), 'utf8');
function example(msxText) {
	const m = buildModel(EngCalcs, EngCalcs.lpnInpParse(fs.readFileSync(path.join(FIX, 'example.inp'), 'utf8')));
	m.quality = Object.assign({}, m.quality, { mode: 'msx' });
	m.msx = { text: msxText };
	m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {});
	return m;
}
// The part of a run report this harness compares: everything after "Analysis ended" (the MSX tables and the mass balance blocks).
function tail(report) {
	const lines = String(report || '').split('\n'), i = lines.findIndex((l) => /Analysis ended/.test(l));
	return lines.slice(i + 1).map((l) => l.replace(/\s+$/, ''));
}
// a printed number may differ in its last digit; everything else must be identical
function lineMatch(a, b) {
	if (a === b) { return true; }
	const ta = a.trim().split(/\s+/), tb = b.trim().split(/\s+/);
	for (let i = 0; i < ta.length; i++) {
		if (ta[i] === tb[i]) { continue; }
		if (/^-?\d\.\d+e[+-]\d+$/.test(ta[i]) && /^-?\d\.\d+e[+-]\d+$/.test(tb[i])) {   // a mass in the balance blocks: 2e-3 of itself, or noise
			const x = Number(ta[i]), y = Number(tb[i]);
			if (Math.abs(x - y) <= 2e-3 * Math.max(Math.abs(x), Math.abs(y)) || Math.max(Math.abs(x), Math.abs(y)) < 1e-5) { continue; }
			return false;
		}
		if (!/^-?\d+\.?\d*$/.test(ta[i]) || !/^-?\d+\.?\d*$/.test(tb[i])) { return false; }
		const dec = (ta[i].split('.')[1] || '').length, unit = Math.pow(10, -dec);
		if (Math.abs(Number(ta[i]) - Number(tb[i])) > 1.0001 * unit + 5e-4 * Math.max(Math.abs(Number(ta[i])), Math.abs(Number(tb[i])))) { return false; }
	}
	return true;
}
async function same(name, m) {
	const e = await EngCalcs.lpnEpanetRun(copy(m)), refs = EngCalcs.lpnNativeRunRefusals(copy(m), { quality: true });
	if (!e.ok || refs.length) { ok(name + ': both solvers take it', false, JSON.stringify(e.issues || refs)); return null; }
	const n = EngCalcs.lpnNativeRun(copy(m), { quality: true });
	if (!n.ok) { ok(name + ': the built-in loop ran', false, JSON.stringify(n.issues)); return null; }
	const a = tail(e.report), b = tail(n.report);
	let first = -1, diffs = 0;
	for (let i = 0; i < Math.max(a.length, b.length); i++) { if (!lineMatch(a[i] || '', b[i] || '')) { diffs++; if (first < 0) { first = i; } } }
	ok(name + ': the MSX report is the engine\'s, line for line', first < 0 && a.length > 3 || (a.length === 0 && b.length === 0 && false),
		first < 0 ? a.length + ' lines' : `${diffs} lines differ, first ${first + 1}: engine "${a[first]}" built-in "${b[first]}"`);
	return { a, b, e, n };
}
async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const base = await same('EPA\'s arsenic example (nodes C and D, link 5, four species)', example(EXMSX));
	if (base) { ok('the tables are there (three of them)', base.b.filter((l) => /<<< (Node|Link)/.test(l)).length === 3); }
	await same('every node and link, precision 4 on AS5, species NH2CL off', example(EXMSX.replace(/NODES\s+C\s+D[^\n]*/, 'NODES ALL').replace(/LINKS\s+5[^\n]*/, 'LINKS ALL').replace('SPECIE  AS5   YES', 'SPECIE  AS5 YES 4').replace('SPECIE  NH2CL YES', 'SPECIE  NH2CL NO')));
	await same('a page of 24 lines', example(EXMSX + '\n  PAGESIZE 24\n'));
	// A file that flags nothing writes no MSX report at all, in either solver.
	{
		const none = example(EXMSX.replace(/NODES[^\n]*\n/, '').replace(/LINKS[^\n]*\n/, ''));
		const e = await EngCalcs.lpnEpanetRun(copy(none)), n = EngCalcs.lpnNativeRun(copy(none), { quality: true });
		ok('a [REPORT] that flags no node and no link prints no MSX report in either solver', !/EPANET-MSX 2\.0/.test(e.report) && !/EPANET-MSX 2\.0/.test(n.report) && /Processing MSX input file/.test(n.report) && /Processing MSX input file/.test(e.report));
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((x) => { console.error(x); process.exit(2); });

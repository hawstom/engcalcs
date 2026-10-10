// FOUR DEFECTS TOM HIT ON DEMAND PATTERNS (2026-10-10). Run with:
//   node dev/lpn-spike/demand-pattern-default-harness.js
//
//  1. A junction demand with no pattern did not use the default pattern: with [OPTIONS] Pattern
//     unstated, EPANET 2.2 uses a pattern whose ID is "1" if one exists; otherwise the demand is
//     constant. Both of our engines and the extended-period run must follow exactly that.
//  2. The Default demand pattern selector went dead (stale options after a pattern was added).
//  3. The Junctions table had no Demand pattern column.
//  4. Properties on several junctions had no Demand pattern row (it is built from the columns).
//
// The Net3 check goes the whole way a user's work goes: Net3.inp with its `Pattern 1` option
// REMOVED -> the page's own importer -> assembleModel -> EPANET engine, compared at every step with
// EPA's published Net3.rpt (which was produced WITH `Pattern 1`). Then the same document with
// pattern "1" renamed away must run flat.

'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-epanet.js');
const { parseReport } = require('./net3-report.js');

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
	"\t\tserialize: serializeProject, libPatterns: libPatterns,\n" +
	"\t\tresolvedDemand: resolvedDemand, assembleModel: assembleModel,\n" +
	"\t\ttimeBlock: function () { return EngCalcs.lpnTimeModelBlock(doc, toSI); },\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\trenamePattern: libRenamePattern, effDefault: effDefaultPattern,\n" +
	"\t\tjunctionSpec: function () { return paneTables().filter(function (s) { return s.type === 'junction'; })[0]; },\n" +
	"\t\tcols: function (s) { return paneCols(s); }, cellText: paneCellText, writeCell: paneWriteCellText,\n" +
	"\t\tmultiSection: multiSection,\n" +
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
function all(root) {
	const out = [];
	(function walk(n) { (n.children || []).forEach(function (c) { out.push(c); walk(c); }); }(root));
	return out;
}
function tagged(root, tag) { return all(root).filter(n => n.tagName === tag); }
function settingsPatternSelect() {
	const box = byId.lpn_set_hydraulics_fields;
	const line = all(box).filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || '') &&
		(n.children || []).some(c => c.tagName === 'SPAN' && c.textContent.indexOf(PC.lpn_settings_default_pattern) >= 0))[0];
	return line && (line.children || []).filter(c => c.tagName !== 'SPAN')[0];
}
function fire(el, ev) { ((el._listeners || {})[ev] || []).forEach(f => f({ target: el })); }

const REF_INP = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
const NO_PATTERN_OPTION = REF_INP.replace(/^ Pattern +\t1\r?\n/m, '');
const RPT = parseReport(fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8'));
const FT = 1 / 0.3048;

(async function () {
	console.log('\n--- 1. a blank demand pattern follows EPANET\'s rule ---');
	ok('the test file really has no Pattern option', NO_PATTERN_OPTION !== REF_INP && !/^ Pattern +\t/m.test(NO_PATTERN_OPTION));
	setUnitSet('us');
	L.importInp({ name: 'Net3.inp', _text: NO_PATTERN_OPTION });
	let doc = L.getDoc();
	ok('import stated no default pattern (nothing invented)', !doc.defaultPattern, JSON.stringify(doc.defaultPattern));
	ok('...yet pattern "1" exists', L.libPatterns().some(p => p.id === '1'));
	const j = doc.nodes.filter(n => n.type === 'junction' && !n.demandPattern && n._demand > 0)[0];
	ok('...and junctions rely on the default', !!j, j && j.id);
	ok('the effective default is "1"', L.effDefault() === '1');
	const withOne = L.resolvedDemand(j);
	const m0 = L.libPatterns().filter(p => p.id === '1')[0].multipliers[0];
	ok('the built-in resolution applies pattern 1 at t=0', Math.abs(withOne - j._demand * m0) < 1e-9 && m0 !== 1,
		'base ' + j._demand + ' x ' + m0 + ' = ' + withOne);
	ok('serialized project still states no Pattern', !L.serialize().defaultPattern);
	const exported = global.EngCalcs.lpnExportInp(L.serialize(), {}).inp;
	ok('export writes no Pattern option the file did not have', !/^\s*Pattern\s+/m.test(exported.split('[OPTIONS]')[1].split('[')[0]));

	// the EPANET engine, whole day, against EPA's own report
	const model = L.assembleModel();
	model.time = L.timeBlock();
	ok('the model handed to EPANET names pattern 1 on the junction', model.nodes.filter(n => n.id === j.id)[0].demandPattern === '1');
	await global.EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const run = await global.EngCalcs.lpnEpanetRun(model);
	ok('EPANET run completes', run.ok);
	let worst = 0, n = 0;
	for (const f of run.frames) {
		const r = RPT[f.t]; if (!r) { continue; }
		for (const id in r.head) { if (f.heads[id] === undefined) { continue; } n++; worst = Math.max(worst, Math.abs(f.heads[id] * FT - r.head[id])); }
	}
	ok('EPS on our page matches EPA\'s Net3 report (pattern 1 varies the demands): ' + n + ' heads, worst ' + worst.toFixed(3) + ' ft',
		n > 1000 && worst < 0.05);
	// demands in the run vary with the pattern
	const dem = run.frames.map(f => f.demands && f.demands[j.id]).filter(v => typeof v === 'number');
	ok('the junction demand varies through the day', dem.length > 5 && Math.max(...dem) - Math.min(...dem) > 1e-6,
		dem.length ? Math.min(...dem).toExponential(3) + '..' + Math.max(...dem).toExponential(3) : 'no demands in frames');

	// no pattern "1": constant. Rename it away.
	const p1 = L.libPatterns().filter(p => p.id === '1')[0];
	L.renamePattern(p1, 'DAY');
	ok('renamed away: effective default is none', L.effDefault() === null);
	ok('...and the demand is constant', Math.abs(L.resolvedDemand(j) - j._demand) < 1e-9);
	const flat = L.assembleModel();
	ok('...and the model carries no pattern for it', !flat.nodes.filter(x => x.id === j.id)[0].demandPattern);
	// renamed back: pattern "1" again
	L.renamePattern(L.libPatterns().filter(p => p.id === 'DAY')[0], '1');
	ok('renamed back to "1": the pattern applies again', L.effDefault() === '1' && Math.abs(L.resolvedDemand(j) - withOne) < 1e-9);
	// a stated default wins over "1"
	L.getDoc().patterns.push(global.EngCalcs.lpnPatternMake('B', [2, 2, 2]));
	L.getDoc().defaultPattern = 'B';
	ok('a stated default pattern wins over "1"', L.effDefault() === 'B' && Math.abs(L.resolvedDemand(j) - j._demand * 2) < 1e-9);
	L.getDoc().defaultPattern = null;

	console.log('\n--- 2. the Default demand pattern selector stays alive ---');
	L.rebuildSettings();
	let sel = settingsPatternSelect();
	ok('selector exists', !!sel);
	ok('blank option says what it means ("pattern 1 is used")', /\b1\b/.test(tagged(sel, 'OPTION')[0].textContent),
		JSON.stringify(tagged(sel, 'OPTION')[0].textContent));
	// a pattern is added AFTER the Settings box was built
	L.getDoc().patterns.push(global.EngCalcs.lpnPatternMake('NEW', [1, 1, 1]));
	fire(sel, 'mousedown');
	ok('a pattern added later is offered when the selector is used', tagged(sel, 'OPTION').some(o => o.value === 'NEW'),
		tagged(sel, 'OPTION').map(o => o.value).join(','));
	sel.value = 'NEW'; fire(sel, 'change');
	ok('...and choosing it is stored', L.getDoc().defaultPattern === 'NEW');
	// a pattern renamed after the box was built, while it is the default
	L.renamePattern(L.libPatterns().filter(p => p.id === 'NEW')[0], 'NEW2');
	fire(sel, 'focus');
	ok('a renamed pattern follows into the selector, keeping the choice',
		sel.value === 'NEW2' && L.getDoc().defaultPattern === 'NEW2', sel.value);
	sel.value = 'B'; fire(sel, 'change');
	ok('...and it can be changed again', L.getDoc().defaultPattern === 'B');
	L.getDoc().defaultPattern = null;

	console.log('\n--- 3. the Junctions table has a Demand pattern column ---');
	const spec = L.junctionSpec();
	const col = L.cols(spec).filter(c => c.key === 'demandPattern')[0];
	ok('column exists', !!col);
	const jn = L.getDoc().nodes.filter(x => x.type === 'junction' && !x.demandPattern && x._demand > 0);
	ok('blank reads blank (Default), not a stored value', L.cellText(col, jn[0]) === '', JSON.stringify(L.cellText(col, jn[0])));
	ok('the blank choice is labelled Default', col.choices()[0][1] === PC.lpn_choice_default, col.choices()[0][1]);
	ok('it is a pick-list of the project\'s patterns', col.choices().length === L.libPatterns().length + 1);
	ok('picking a pattern writes the junction', L.writeCell(spec, col, jn[0], 'B') && jn[0].demandPattern === 'B');
	ok('...and the demand follows it', Math.abs(L.resolvedDemand(jn[0]) - jn[0]._demand * 2) < 1e-9);
	ok('blank again clears it', L.writeCell(spec, col, jn[0], '') && !jn[0].demandPattern);

	console.log('\n--- 4. Properties on several junctions sets Demand pattern on all ---');
	const host = { tagName: 'DIV', children: [], appendChild: function (c) { this.children.push(c); } };
	L.multiSection(host, { spec: spec, els: [jn[0], jn[1], jn[2]] });
	const rows = tagged(host, 'LABEL').filter(l => l.textContent.indexOf(PC.lpn_field_demand_pattern) >= 0 || (l.children || []).some(c => (c.textContent || '').indexOf(PC.lpn_field_demand_pattern) >= 0));
	ok('a Demand pattern row is offered', rows.length >= 1);
	const msel = rows.length ? tagged(rows[0], 'SELECT')[0] : null;
	ok('...as a pick-list', !!msel);
	if (msel) {
		msel.value = 'B'; fire(msel, 'change');
		ok('choosing sets it on every selected junction', [jn[0], jn[1], jn[2]].every(x => x.demandPattern === 'B'),
			[jn[0], jn[1], jn[2]].map(x => x.demandPattern).join(','));
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());

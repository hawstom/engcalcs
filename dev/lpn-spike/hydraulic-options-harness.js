// EPANET'S HYDRAULIC [OPTIONS] SURVIVE A ROUND TRIP -- ROADMAP Task 553. Run with:
//   node dev/lpn-spike/hydraulic-options-harness.js
//
// WHY THIS EXISTS. Until Task 553 the importer read exactly five keys out of `[OPTIONS]` -- Units,
// Headloss, Emitter Exponent, Demand Multiplier and Pattern -- and read PAST every other line in
// silence. Not adopted, not applied, and **not even reported as a difference**. A file stating
// `Viscosity 1.3` and `Unbalanced Continue 10` came back out of the exporter stating neither, which
// is CLAUDE.md's input-file-is-canonical rule broken in the quietest way available: nothing on
// screen changes, nothing warns, and the loss is only visible to whoever diffs two files.
//
// Tom, 2026-08-28, listing what a person must be able to see: *"the default pattern must be
// specified in Settings along with other Hydraulics options including Headloss Formula, Specific
// Gravity, Relative Viscosity, Maximum Trials, Accuracy, If Unbalanced (Continue or Stop), Demand
// Multiplier, Emitter Exponent, Status Report (Yes or No), Max. Head Error, etc."*
//
// **THE SPARSENESS IS THE DESIGN AND SECTION 3 IS WHERE IT IS PROVED.** A key is stored only where
// the FILE stated it. Filling `hydraulics` with EPANET's defaults instead would be indistinguishable
// on screen and would add eleven lines to every exported file that the source never had -- which
// `inp-export-harness.js` measures as a round trip that is no longer byte-identical.

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
	"\t\tassembleModel: assembleModel, resolvedDemand: resolvedDemand,\n" +
	// EngCalcs.lpnExportInp, not js/lpn-epanet.js's lpnToInp: that one writes LPS always and
	// preserves nothing, because the only thing that reads it is the engine. This is the writer a
	// human's file goes through, and it reads its settings off `doc.settings`.
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

// A minimal but complete network, so the [OPTIONS] block is the only thing under test. Every
// hydraulic option EPANET's own writer emits is stated, each with a value that is NOT its default --
// a check against the defaults would pass with the whole feature deleted.
const FIXTURE = [
	'[TITLE]',
	'Every hydraulic option, none of them at its default',
	'',
	'[JUNCTIONS]',
	' J1  100  50',
	'',
	'[RESERVOIRS]',
	' R1  200',
	'',
	'[PIPES]',
	' P1  R1  J1  1000  12  130  0  Open',
	'',
	'[OPTIONS]',
	' Units              GPM',
	' Headloss           H-W',
	' Specific Gravity   1.02',
	' Viscosity          1.3',
	' Trials             75',
	' Accuracy           0.0005',
	' Unbalanced         Continue 12',
	' Demand Multiplier  2.5',
	' Emitter Exponent   0.62',
	' Status             Full',
	' HeadError          0.002',
	' FlowChange         0.01',
	' DampLimit          0.4',
	' CheckFreq          3',
	' MaxCheck           14',
	'',
	'[END]',
	''
].join('\n');

setUnitSet('us');
byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'options.inp', _text: FIXTURE });

// ---------------------------------------------------------------------------
// 1. Every stated option reached the document, with the file's own number.
// ---------------------------------------------------------------------------
console.log('\n--- the file said it, so we hold it ---');
const h = L.getSettings().hydraulics || {};
{
	const want = {
		specificGravity: 1.02, viscosity: 1.3, trials: 75, accuracy: 0.0005,
		demandMultiplier: 2.5, emitterExponent: 0.62, headError: 0.002,
		flowChange: 0.01, dampLimit: 0.4, checkFreq: 3, maxCheck: 14,
		statusReport: 'FULL', unbalanced: 'continue', unbalancedTrials: 12
	};
	Object.keys(want).forEach(function (k) {
		ok(k + ' came in as the file stated it', h[k] === want[k],
			JSON.stringify(h[k]) + ' (wanted ' + JSON.stringify(want[k]) + ')');
	});
	// Emitter exponent is the one that ALSO has a home outside this list, because the solver has
	// read `settings.emitterExponent` since long before Task 553. Both must agree or the exporter
	// and the solve would disagree about the same file.
	ok('...and the emitter exponent also reached the field the solver reads',
		L.getSettings().emitterExponent === 0.62, L.getSettings().emitterExponent);
}

// ---------------------------------------------------------------------------
// 2. And every one comes back out.
// ---------------------------------------------------------------------------
console.log('\n--- and the exporter writes each one back ---');
{
	const out = L.export();
	ok('the export succeeded', out && out.ok === true, out && out.ok);
	const block = (out.inp.split(/^\[OPTIONS\]/m)[1] || '').split(/^\[/m)[0];
	const lines = block.split(/\r?\n/).map(t => t.trim()).filter(Boolean);
	// Compared by (keyword, value) rather than by whole line: the writer's column padding is its
	// own business and is not what this harness is about.
	function stated(word) {
		const row = lines.filter(t => t.toUpperCase().indexOf(word.toUpperCase()) === 0)[0];
		return row ? row.slice(word.length).trim().replace(/\s+/g, " ") : null;
	}
	[['Specific Gravity', '1.02'], ['Viscosity', '1.3'], ['Trials', '75'],
		['Accuracy', '0.0005'], ['Demand Multiplier', '2.5'], ['Emitter Exponent', '0.62'],
		['Status', 'FULL'], ['HeadError', '0.002'], ['FlowChange', '0.01'],
		['DampLimit', '0.4'], ['CheckFreq', '3'], ['MaxCheck', '14']
	].forEach(function (pair) {
		ok(pair[0] + ' is written back as ' + pair[1], stated(pair[0]) === pair[1],
			JSON.stringify(stated(pair[0])));
	});
	// **THE TWO-TOKEN ONE.** `Unbalanced Continue 12` has to come back with its count; writing
	// `Continue` alone silently changes EPANET's behaviour from "twelve more trials" to "none".
	ok('Unbalanced comes back with its trial count', stated('Unbalanced') === 'Continue 12',
		JSON.stringify(stated('Unbalanced')));
}

// ---------------------------------------------------------------------------
// 3. A file that states NOTHING gets nothing written for it.
// ---------------------------------------------------------------------------
console.log('\n--- sparse in, sparse out ---');
{
	// **NET1 IS THE WRONG FIXTURE FOR THIS AND THAT IS WORTH RECORDING**: EPA's own Net1 states
	// Specific Gravity, Viscosity, Trials, Accuracy, CheckFreq, MaxCheck, DampLimit and Unbalanced,
	// all at their defaults. So it proves the round trip and says nothing about sparseness. A file
	// that states NOTHING is the case that matters, because it is what this page's own New Project
	// produces, and eleven invented lines in its export is what would break byte identity.
	const bare = [
		'[TITLE]', 'Nothing but the two required options', '',
		'[JUNCTIONS]', ' J1  100  50', '',
		'[RESERVOIRS]', ' R1  200', '',
		'[PIPES]', ' P1  R1  J1  1000  12  130  0  Open', '',
		'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
		'[END]', ''
	].join('\n');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'bare.inp', _text: bare });
	const hyd = L.getSettings().hydraulics || {};
	ok('a file stating no hydraulic options leaves us holding none',
		Object.keys(hyd).length === 0, JSON.stringify(hyd));
	// **AND THE PREVIOUS PROJECT'S OPTIONS DID NOT LEAK INTO THIS ONE.** The import clones the
	// CURRENT settings -- map appearance, id prefixes, the things a person sets once -- so an
	// options block written onto that clone carelessly would carry the last file's `Viscosity 1.3`
	// into a file that never said it. The fixture above stated fourteen of them, so this is a real
	// test and not a tautology.
	ok('...and none of the fourteen the file before it stated', hyd.viscosity === undefined,
		JSON.stringify(hyd.viscosity));
	const out = L.export();
	const block = (out.inp.split(/^\[OPTIONS\]/m)[1] || '').split(/^\[/m)[0].toUpperCase();
	ok('...so the export invents none of them',
		!/VISCOSITY|SPECIFIC|TRIALS|ACCURACY|UNBALANCED|HEADERROR|DAMPLIMIT|CHECKFREQ|MAXCHECK|STATUS/.test(block),
		JSON.stringify(block.trim().split(/\r?\n/)));
}

// ---------------------------------------------------------------------------
// 4. Net1 states nearly all of them, and every one survives the round trip.
// ---------------------------------------------------------------------------
console.log('\n--- EPA\'s own Net1, which states eight of them ---');
{
	const net1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: net1 });
	function optsOf(text) {
		const block = (text.split(/^\[OPTIONS\]/m)[1] || '').split(/^\[/m)[0];
		const out = {};
		block.split(/\r?\n/).forEach(function (line) {
			const t = line.trim();
			if (!t || /^;/.test(t)) { return; }
			// Two-word keywords, in the file's own spelling. Everything else is one word.
			const m = /^(Specific\s+Gravity|Demand\s+Multiplier|Emitter\s+Exponent|\S+)\s+(.*)$/i.exec(t);
			if (m) { out[m[1].toUpperCase().replace(/\s+/g, ' ')] = m[2].trim().replace(/\s+/g, ' '); }
		});
		return out;
	}
	const src = optsOf(net1), got = optsOf(L.export().inp);
	// **QUALITY, DIFFUSIVITY AND TOLERANCE ARE NOT MODELLED AND ARE STILL CARRIED**, since the
	// water-quality half of Task 553 landed. Nothing solves with them, so they ride as the file's
	// own characters; dev/lpn-spike/quality-options-harness.js is where that is proved in full.
	// They are asserted here on the SAME footing as every other option -- byte-identical, not
	// numerically equal -- because `Diffusivity 1.0` is exactly the token a parse-and-reformat
	// writer would return as `1`.
	Object.keys(src).forEach(function (k) {
		ok('Net1\'s ' + k + ' survives the round trip',
			got[k] !== undefined && parseFloat(got[k]) === parseFloat(src[k]) || got[k] === src[k],
			JSON.stringify(src[k]) + ' -> ' + JSON.stringify(got[k]));
	});
	['QUALITY', 'DIFFUSIVITY', 'TOLERANCE'].forEach(function (k) {
		ok('Net1\'s ' + k + ' comes back character for character', got[k] === src[k],
			JSON.stringify(src[k]) + ' -> ' + JSON.stringify(got[k]));
	});
}

// ---------------------------------------------------------------------------
// 5. The four that get a control, and the ones that deliberately do not.
// ---------------------------------------------------------------------------
console.log('\n--- four rows, and the rest carried without one ---');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'options.inp', _text: FIXTURE });
	L.rebuildSettings();
	const box = byId.lpn_set_hydraulics_fields;
	function all(root, out) {
		(root.children || []).forEach(function (c) { out.push(c); all(c, out); });
		return out;
	}
	const labels = all(box, []).filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
		.map(function (line) {
			const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
			return span ? span.textContent.replace(/\s+/g, ' ').trim() : '';
		});
	['Accuracy', 'Demand multiplier', 'Specific gravity', 'Relative viscosity', 'Emitter exponent',
		'Maximum trials'].forEach(function (w) {
		ok(w + ' has a row', labels.some(t => t.indexOf(w) === 0), labels.join(' | '));
	});
	// **AND "CONVERGENCE TOLERANCE" IS GONE** (Tom, 2026-08-28: *"Deprecate our 'Convergence
	// tolerance' to use the EPANET setting"*). The two measured the same kind of thing — a sum of
	// absolute flow changes over an iteration, normalised — and two rows a reader cannot tell apart
	// is worse than one.
	ok('...and Convergence tolerance is gone, replaced by Accuracy',
		!labels.some(t => /Convergence/.test(t)), labels.join(' | '));
	// **AND THE ONES THAT DO NOT, WHICH IS AS DELIBERATE AS THE ONES THAT DO.** CLAUDE.md's
	// emitter-exponent precedent: never ship the most technical-looking control in a box if it is
	// the one that adjusts nothing. Accuracy is the interesting exclusion -- it has no honest place
	// beside Convergence tolerance, which is a different quantity on a different scale, and which
	// of the two a reader should meet is Tom's call and not a script's.
	['Unbalanced', 'Head error', 'Status report', 'Flow change', 'Damp'].forEach(function (w) {
		ok('...and ' + w + ' deliberately has none', !labels.some(t => t.indexOf(w) === 0),
			labels.join(' | '));
	});
}

// ---------------------------------------------------------------------------
// 6. Each of the four CHANGES AN ANSWER, in the engine the page defaults to.
// ---------------------------------------------------------------------------
console.log('\n--- and each one acts, rather than merely being stored ---');
{
	const solver = require(ROOT + 'js/lpn-solver.js');
	function solveNow() { return solver.lpnSolve(L.assembleModel(), { tol: 1e-9 }); }
	const set = L.getSettings();

	// **THE DEMAND MULTIPLIER IS APPLIED EXACTLY ONCE, AND ONCE IS THE WHOLE ASSERTION.** It used to
	// be folded into the stored number at import; it is applied at resolvedDemand() now. If both
	// happened the answer would be 2.5 x 2.5. The fixture states 2.5 and a base of 50.
	const j1 = L.getDoc().nodes.filter(n => n.id === 'J1')[0];
	ok('the stored base demand is the file\'s own 50, not 50 x 2.5',
		j1._demand === 50, j1._demand);
	set.hydraulics.demandMultiplier = 2.5;
	const at25 = L.resolvedDemand(j1);
	set.hydraulics.demandMultiplier = 1;
	const at1 = L.resolvedDemand(j1);
	ok('...and 2.5 draws exactly 2.5 times what 1 draws', Math.abs(at25 - 2.5 * at1) < 1e-9,
		at1 + ' -> ' + at25);
	delete set.hydraulics.demandMultiplier;
	ok('...and no multiplier is the same as a multiplier of 1', L.resolvedDemand(j1) === at1);

	// **SPECIFIC GRAVITY CHANGES THE PRESSURE AND NOT THE FLOW.** A denser fluid raises no head --
	// the energy equation does not care what it weighs -- so a harness that only checked "the
	// answer moved" would pass with it wired into the wrong term.
	delete set.hydraulics.specificGravity;
	const plain = solveNow();
	set.hydraulics.specificGravity = 1.5;
	const dense = solveNow();
	ok('specific gravity 1.5 raises the pressure by half again',
		Math.abs(dense.pressures.J1 - 1.5 * plain.pressures.J1) < 1e-9,
		plain.pressures.J1 + ' -> ' + dense.pressures.J1);
	ok('...and leaves the FLOW untouched, which is the physics',
		Math.abs(dense.flows.P1 - plain.flows.P1) < 1e-12,
		plain.flows.P1 + ' -> ' + dense.flows.P1);
	delete set.hydraulics.specificGravity;

	// **RELATIVE VISCOSITY ONLY ACTS UNDER DARCY-WEISBACH**, which is the honest claim and the one
	// the tip makes. Under Hazen-Williams the fixture's own method, it must change nothing at all.
	set.hydraulics.viscosity = 5;
	ok('viscosity changes nothing under Hazen-Williams',
		Math.abs(solveNow().flows.P1 - plain.flows.P1) < 1e-12);
	// **AND THE ROUGHNESS HAS TO BE A REAL ONE FOR THIS TO MEAN ANYTHING.** The fixture's pipe
	// carries 130, which is a Hazen-Williams C; read as a Darcy-Weisbach roughness HEIGHT it is 130
	// feet, so the flow is fully rough and the friction factor stops depending on Reynolds number
	// altogether -- viscosity then correctly changes nothing, and a harness that stopped there would
	// have concluded the wiring was dead. 0.0005 ft is drawn steel.
	//
	// **AND THE FLOW HAS TO BE SOLIDLY TURBULENT, WHICH THE FIXTURE'S 50 gpm IS NOT.** At 50 gpm in
	// a 12 in main the velocity is 0.04 m/s and Re is about 1.3e4; five times the viscosity drops it
	// to 2.6e3, which is the TRANSITION zone, where the direction of the friction factor is not a
	// simple monotone in Re and the whole head loss is 3 mm anyway. The demand is raised for this
	// one measurement so both viscosities sit in fully turbulent flow, where "thicker costs more
	// head" is unambiguous physics and a sign test means something.
	set.method = 'dw';
	const link = L.getDoc().links.filter(l => l.id === 'P1')[0];
	const wasRough = link._roughness, wasDemand = j1._demand;
	link._roughness = 0.0005;
	j1._demand = 2000;
	//
	// **AND THE OBSERVABLE IS THE HEAD, NOT THE FLOW.** One reservoir feeding one junction's demand
	// through one pipe: continuity fixes that pipe's flow at the demand whatever the friction is, so
	// the flow is constant BY CONSTRUCTION and reading it would have reported "viscosity does
	// nothing" for a correctly wired option. What friction changes here is how much head it costs to
	// deliver that flow.
	delete set.hydraulics.viscosity;
	const dwThin = solveNow().heads.J1;
	set.hydraulics.viscosity = 5;
	const dwThick = solveNow().heads.J1;
	ok('...and moves the answer under Darcy-Weisbach, on a roughness where it can',
		Math.abs(dwThick - dwThin) > 1e-6, dwThin + ' -> ' + dwThick);
	ok('...in the direction physics requires: a thicker fluid costs more head',
		dwThick < dwThin, dwThin + ' -> ' + dwThick);
	set.method = 'hw';
	link._roughness = wasRough;
	j1._demand = wasDemand;
	delete set.hydraulics.viscosity;

	// Maximum trials reaches the native solver's own cap. Asserted through a network that cannot
	// converge in one trial rather than by reading the option back, which would prove nothing.
	// **ASSERTED ON `converged`, NOT ON THE ITERATION COUNT.** The loop reports `iter` AFTER it
	// exits, so a cap of 1 and a network that converges on its second pass both report 2 -- the
	// count cannot tell "it stopped" from "it finished". Whether it CONVERGED can.
	set.hydraulics.trials = 1;
	const capped = solveNow();
	delete set.hydraulics.trials;
	const free = solveNow();
	ok('maximum trials 1 stops the native solver before it converges',
		capped.converged === false && free.converged === true,
		'capped ' + capped.converged + ' (' + capped.iterations + '), free ' +
			free.converged + ' (' + free.iterations + ')');
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

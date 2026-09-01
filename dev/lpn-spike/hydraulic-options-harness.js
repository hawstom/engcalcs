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
		'Maximum trials', 'If it will not settle', 'Extra trials first', 'Head error limit',
		'Flow change limit', 'Damping starts at'].forEach(function (w) {
		ok(w + ' has a row', labels.some(t => t.indexOf(w) === 0), labels.join(' | '));
	});
	// **AND "CONVERGENCE TOLERANCE" IS GONE** (Tom, 2026-08-28: *"Deprecate our 'Convergence
	// tolerance' to use the EPANET setting"*). The two measured the same kind of thing — a sum of
	// absolute flow changes over an iteration, normalised — and two rows a reader cannot tell apart
	// is worse than one.
	ok('...and Convergence tolerance is gone, replaced by Accuracy',
		!labels.some(t => /Convergence/.test(t)), labels.join(' | '));
	// **AND THE THREE THAT STILL DO NOT, WHICH IS AS DELIBERATE AS THE ELEVEN THAT DO.** Tom's
	// 2026-08-29 ruling reversed the burden of proof -- a setting now needs a reason NOT to have a
	// row -- so each of these three has one, and two of the three are MEASURED rather than argued
	// (section 7 below is the measurement):
	//   Status report decides what EPANET's own `.rpt` holds and this page has no `.rpt`. It is a
	//     report-formatting key: no answer anywhere depends on it.
	//   Trials between status checks (CheckFreq) and the last trial that checks status (MaxCheck)
	//     steer the PATH to a converged answer and not the answer. Their only reachable effect on
	//     an answer is at 0, which EPANET refuses the whole input over.
	// All three are still carried, exported and honoured -- sections 1 to 4 hold that.
	['Status report', 'Trials between', 'Last trial'].forEach(function (w) {
		ok('...and ' + w + ' deliberately has none', !labels.some(t => t.indexOf(w) === 0),
			labels.join(' | '));
	});
	// **THE UNBALANCED TRIAL COUNT IS THE ONE ROW THAT COMES AND GOES.** `Unbalanced Stop 10` is
	// not a line EPANET writes, so the count exists only under "report the last try"; the fixture
	// states Continue 12, which is why the row is there two assertions above.
	{
		const set = L.getSettings();
		set.hydraulics.unbalanced = 'stop';
		delete set.hydraulics.unbalancedTrials;
		L.rebuildSettings();
		const after = all(byId.lpn_set_hydraulics_fields, [])
			.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
			.map(function (line) {
				const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
				return span ? span.textContent.replace(/\s+/g, ' ').trim() : '';
			});
		ok('...and the extra-trial count disappears under "report nothing"',
			!after.some(t => t.indexOf('Extra trials first') === 0), after.join(' | '));
		set.hydraulics.unbalanced = 'continue';
		set.hydraulics.unbalancedTrials = 12;
	}
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

// ---------------------------------------------------------------------------
// 7. THE FIVE EPANET-ONLY ROWS, AND THE TWO THAT WERE MEASURED INTO SILENCE.
// ---------------------------------------------------------------------------
// **THIS SECTION EXISTS BECAUSE A ROW THAT RENDERS AND CHANGES NOTHING IS THE DEFECT.** Tom's
// 2026-08-29 ruling ("every setting from EPANET must be added and implemented unless research says
// otherwise") reversed the burden of proof but not the standard: a control still has to act. So each
// row added here is asserted through the ENGINE THAT READS IT, and the two options that got no row
// are asserted to be genuinely inert rather than merely obscure.
//
// **A DELIBERATELY UNCONVERGEABLE NETWORK IS THE INSTRUMENT.** Four of these five options only show
// themselves where a solve is struggling; on a network that converges in three trials, a stopping
// rule is invisible whatever it says. `Trials 1` is what makes the rule observable.
//
// The model is built by hand rather than through assembleModel(), so this section says nothing about
// the Settings box (section 5 does) and everything about the option reaching the engine.
const solverEC = require(ROOT + 'js/lpn-solver.js');
Object.keys(solverEC).forEach(function (k) { global.EngCalcs[k] = solverEC[k]; });
require(ROOT + 'js/lpn-epanet.js');

function optModel(hyd) {
	return {
		method: 'hw', hydraulics: hyd,
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'A', type: 'junction', elev: 0, demand: 0.02 },
			{ id: 'B', type: 'junction', elev: 0, demand: 0.03 },
			{ id: 'C', type: 'junction', elev: 10, demand: 0.01 }
		],
		// **THE CHECK VALVE IS NOT DECORATION.** CheckFreq and MaxCheck govern how often EPANET
		// re-examines a check valve's open/shut state, so a network without one could not possibly
		// show them acting, and "no effect" measured on it would prove nothing at all.
		links: [
			{ id: 'P1', type: 'pipe', from: 'R', to: 'A', length: 500, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
			{ id: 'P2', type: 'pipe', from: 'A', to: 'B', length: 800, diameter: 0.2, roughness: 120, k: 0, status: 'open' },
			{ id: 'P3', type: 'pipe', from: 'B', to: 'C', length: 600, diameter: 0.15, roughness: 110, k: 0, status: 'open' },
			{ id: 'P4', type: 'pipe', from: 'C', to: 'A', length: 700, diameter: 0.15, roughness: 110, k: 0, status: 'cv' }
		]
	};
}

(async function () {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	async function headB(hyd) {
		const r = await EngCalcs.lpnSolveEpanet(optModel(hyd));
		return r.ok ? r.heads.B : null;
	}

	console.log('\n--- the five EPANET-only rows each move an answer ---');
	const solved = await headB({ accuracy: 1e-9, trials: 200 });

	// **ACCURACY.** The one row both engines read, and the only one of the six whose native half is
	// asserted above (section 6's `trials`). Here it is the EPANET half: a loose tolerance stops
	// short of the answer a tight one reaches.
	const loose = await headB({ accuracy: 1, trials: 200 });
	ok('accuracy 1 stops EPANET short of where 1e-9 gets to',
		loose !== null && Math.abs(loose - solved) > 1e-6, solved + ' -> ' + loose);

	// **HEAD ERROR AND FLOW CHANGE ARE EXTRA STOPPING TESTS, SO THE FLOW TEST HAS TO BE DISARMED TO
	// SEE THEM.** Under EPANET's own rule the solve stops when ANY satisfied criterion is met, so
	// with Accuracy at its usual value the answer is already exact and a second criterion can only
	// be invisible. Accuracy 1 hands the decision to the criterion under test, which is the only
	// arrangement in which "it changed the answer" is attributable.
	const byHead = await headB({ accuracy: 1, trials: 200, headError: 1e-6 });
	ok('a tight head-error limit pulls the answer back to the solved one',
		byHead !== null && Math.abs(byHead - solved) < 1e-6 && Math.abs(byHead - loose) > 1e-6,
		loose + ' -> ' + byHead + '  (solved ' + solved + ')');
	ok('...and a slack one leaves the loose answer where it was',
		Math.abs(await headB({ accuracy: 1, trials: 200, headError: 100 }) - loose) < 1e-12);

	const byFlow = await headB({ accuracy: 1, trials: 200, flowChange: 1e-12 });
	ok('a tight flow-change limit does the same, through its own criterion',
		byFlow !== null && Math.abs(byFlow - solved) < 1e-6 && Math.abs(byFlow - loose) > 1e-6,
		loose + ' -> ' + byFlow);
	ok('...and a slack one leaves the loose answer where it was',
		Math.abs(await headB({ accuracy: 1, trials: 200, flowChange: 1 }) - loose) < 1e-12);

	// **IF IT WILL NOT SETTLE, AND WHAT IT ACTUALLY DOES WAS MEASURED BEFORE THE STRINGS WERE
	// WRITTEN.** EPANET's `Unbalanced Stop` is documented as halting with an error; through the
	// TOOLKIT, which is what this page uses, it halts and hands back the last iterate rather than
	// refusing -- measured here, and the first draft of this row said "Report nothing" on the
	// strength of the documentation. The label says "Stop there" because that is what happens.
	// The pair still changes the answer, decisively: given one trial on a network that needs more,
	// keeping on settles it and stopping there does not.
	const keepTrying = await headB({ trials: 1, unbalanced: 'continue', unbalancedTrials: 200 });
	const stopThere = await headB({ trials: 1, unbalanced: 'stop' });
	ok('one trial and "keep trying" reaches the settled answer anyway',
		keepTrying !== null && Math.abs(keepTrying - solved) < 1e-9, solved + ' vs ' + keepTrying);
	ok('...and "stop there" does not, which is the whole difference',
		stopThere !== null && Math.abs(stopThere - solved) > 1e-6, solved + ' vs ' + stopThere);
	// **AND THE COUNT IS PART OF THE OPTION, NOT DECORATION.** Keeping on with no extra trials is
	// stopping there by another name, which is why the count row appears with that choice and only
	// with it.
	ok('...and "keep trying" with no extra trials is the same as stopping',
		Math.abs(await headB({ trials: 1, unbalanced: 'continue', unbalancedTrials: 0 }) - stopThere) < 1e-12);

	// **DAMPING.** The smallest of the five, and asserted as a difference rather than a direction:
	// damping changes the route the iteration takes, so where it lands differs in the last digits
	// the tolerance was ever going to guarantee. A sign test here would be asserting noise.
	const damped = await headB({ accuracy: 1e-9, trials: 200, dampLimit: 0.5 });
	ok('damping moves where the iteration lands', damped !== null && damped !== solved,
		solved + ' -> ' + damped);

	// -----------------------------------------------------------------------
	// **AND THE TWO THAT WERE MEASURED INTO SILENCE, WHICH IS THE OTHER HALF OF THE RULING.**
	// "Research says otherwise" has to be a measurement or it is an opinion. CheckFreq and MaxCheck
	// return heads identical TO THE LAST BIT across their whole useful range on the network shape
	// they are supposed to matter on -- so they steer the path and not the destination, and a box
	// for them would be the emitter-exponent mistake with a different name. If this ever fails,
	// they have earned their rows and this comment is the thing that is wrong.
	// -----------------------------------------------------------------------
	console.log('\n--- and the two with no row change no answer, measured ---');
	for (const v of [1, 2, 100]) {
		ok('CheckFreq ' + v + ' returns the identical head',
			(await headB({ accuracy: 1e-9, trials: 200, checkFreq: v })) === solved);
	}
	for (const v of [1, 10, 200]) {
		ok('MaxCheck ' + v + ' returns the identical head',
			(await headB({ accuracy: 1e-9, trials: 200, maxCheck: v })) === solved);
	}
	// Their one reachable effect: 0 is not a legal value and EPANET refuses the input over it.
	// A control whose only visible outcome is a refusal is not a control.
	ok('...and 0, their only visible value, is a refusal', (await headB({ checkFreq: 0 })) === null);

	// **STATUS REPORT CHANGES NO ANSWER, EITHER, AND FOR A REASON NEEDING NO MEASUREMENT** -- it
	// selects what EPANET writes into a `.rpt` this page never asks for. Asserted anyway, because
	// "it only affects a report" is exactly the kind of claim that is true until somebody wires the
	// value into the wrong writer.
	ok('Status Full changes no answer either',
		(await headB({ accuracy: 1e-9, trials: 200, statusReport: 'FULL' })) === solved);

	// **AND THE REASON ANY OF THIS IS OBSERVABLE AT ALL** (js/lpn-epanet.js signatureOf): the engine
	// keeps an open Project between solves and reuses it whenever the network's SHAPE is unchanged.
	// The options live in the `.inp` text and no setter pushes them, so before they were put in the
	// signature every assertion above passed the FIRST value and silently reused it for the rest --
	// fourteen option sets, one identical head. This is that regression, as one line.
	ok('a changed option is not answered from the previous solve\'s session',
		(await headB({ accuracy: 1e-9, trials: 200 })) === solved &&
		(await headB({ accuracy: 1, trials: 200 })) === loose && solved !== loose);

	// -----------------------------------------------------------------------
	// 8. THE SHIPPED GALLERY STATES WHAT ITS OWN `.inp` STATES.
	// -----------------------------------------------------------------------
	// **A STORED PROJECT DOES NOT GAIN A FEATURE THE DAY THE IMPORTER DOES**, which is the lesson
	// the water-quality half of Task 553 paid for: `examples/Net1.lwn` carried no `qualityOptions`
	// for as long as that carry existed, and the first person to notice was Tom exporting one.
	// `settings.hydraulics` was the same gap, left open on purpose because filling it moves what the
	// gallery COMPUTES -- Net1 states `Accuracy 0.001` and this page's own default is 1e-9.
	//
	// **MEASURED BEFORE IT WAS FILLED, ON ALL FOUR EPA EXAMPLES:** worst head change 2.5e-7 m
	// (Net3, node 231), worst relative flow change 0.00224% (Net3, link 285), and every one still
	// converges. Below any decimal place the page displays, so the gallery's answers do not visibly
	// move -- but the file is now stating its own source's number, which is the rule.
	//
	// Read off the SHIPPED file, not the source folder: `examples/` is generated, and a gallery that
	// silently regenerated without this would be the gap reopening exactly as it did before.
	console.log('\n--- and the shipped gallery states its own source\'s options ---');
	{
		const shipped = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net1.lwn'), 'utf8'));
		const hyd = (shipped.settings || {}).hydraulics || {};
		const want = {
			specificGravity: 1, viscosity: 1, trials: 40, accuracy: 0.001, checkFreq: 2,
			maxCheck: 10, dampLimit: 0, unbalanced: 'continue', unbalancedTrials: 10,
			demandMultiplier: 1, emitterExponent: 0.5
		};
		Object.keys(want).forEach(function (k) {
			ok('Net1.lwn states ' + k + ' as Net1.inp does', hyd[k] === want[k],
				JSON.stringify(hyd[k]) + ' (wanted ' + JSON.stringify(want[k]) + ')');
		});
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();

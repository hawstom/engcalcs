// **THE PROGRESS BAR MUST NOT FINISH BEFORE THE WORK DOES** -- ROADMAP Task 686. Run with:
//
//   node dev/lpn-spike/run-progress-harness.js
//
// **THE DEFECT WAS THE BAR, NOT THE MILLISECONDS.** Reading the reaction rate out of EPANET's
// binary output file costs a measured 234 ms on Net3 over 24 hours at a 5 minute reporting step
// (289 periods, 119 links, a 1.56 MB file), and it ran on the main thread AFTER the run's progress
// bar had already reached 100%. A bar sitting at 100% while the tab is frozen does not read as a
// run still working; it reads as the page hanging. The cost scales with links times periods, so a
// utility-scale network at a fine step pays seconds of it.
//
// Tom, 2026-09-18, rejecting both a worker and a narrower reader: *"Add some arbitrary amount to
// the progress bar (just guess a percent like 10% based on what you've seen so far) and don't
// finish the progress bar until all the output is available."*
//
// **SO WHAT IS ASSERTED HERE IS AN ORDER, NOT A DURATION.** A timing assertion would be flaky on
// every machine this ever runs on, and the cost was never the complaint. The three things that can
// be wrong are each an ordering:
//
//   1. **THE BAR REACHES 100% BEFORE THE READ.** The original defect, exactly.
//   2. **NOTHING IS RESERVED AT ALL**, so the reserved share exists in a constant and not in the
//      ticks the consumer actually sees.
//   3. **THE RESERVED SHARE IS NEVER PAINTED.** Reserving 10% and then reading in the SAME
//      macrotask leaves the browser no chance to paint the 90%, so the reader sees the bar jump
//      from wherever it was to 100% after the freeze -- the defect with a constant added.
//
// The engine's own `readBinary()` is wrapped so the read itself is one of the events in the
// recorded order. That is what makes leg 1 decidable rather than assumed: the assertion is that
// the read is BETWEEN the 90% tick and the 100% tick, in the ticks a real consumer received.
//
// NO ENGLISH LITERAL IS ASSERTED ANYWHERE (dev/scripts/harness_wording_check.php); this file
// asserts numbers and an order and reads no string at all.

'use strict';

const { ROOT, NODE_ENGINE_URL, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-epanet.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, assembleModel: assembleModel,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function head(t) { console.log('\n' + t); }

const CHEM = { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' };
const AGE = { mode: 'age', traceNode: '' };

setUnitSet('si');
L.buildLayers();
L.seedDefaultInputs();

// A reservoir holding a residual and two junctions drawing demand. Small on purpose: what is under
// test is the SHAPE of the progress, and a network big enough to make the read slow would only
// make the harness slow.
const res = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 400, 0);
const j2 = L.addNode('junction', 900, 0);
const p1 = L.addLink('pipe', res.id, j1.id);
const p2 = L.addLink('pipe', j1.id, j2.id);
L.setProp(res, 'initQuality', 1);
L.setProp(p1, 'diameter', 300);
L.setProp(p2, 'diameter', 200);
L.setProp(j1, 'demand', 5);
L.setProp(j2, 'demand', 5);

/**
 * One run, with every progress tick recorded in the order a real consumer received it, and the
 * engine's own binary read recorded in the same list.
 *
 * **THE SLICE IS ONE MILLISECOND** so the walks yield often and the ticks are plentiful; it changes
 * no number in the run (see LPN_EPANET_SLICE_MS), only how often it lets go of the thread.
 */
async function runRecording(shim) {
	const events = [];
	const wrapped = typeof shim.readBinary === 'function';
	shim.recordRead = function () { events.push({ kind: 'read' }); };
	// Set from inside the 90% tick's own timer: if the run yields before reading, this macrotask
	// runs first and the flag is up by the time the bar is finished. Without a yield it is not.
	let painted = false;
	try {
		const run = await EngCalcs.lpnEpanetRun(L.assembleModel(), {
			sliceMs: 1,
			onProgress: function (p) {
				events.push({ kind: 'tick', f: p.fraction, painted: painted });
				if (Math.abs(p.fraction - 0.9) < 1e-9) { setTimeout(function () { painted = true; }, 0); }
			}
		});
		return { run: run, events: events, wrapped: wrapped };
	} finally {
		shim.recordRead = null;
	}
}

/**
 * **THE ENGINE MODULE IS AN ES MODULE NAMESPACE AND ITS EXPORTS CANNOT BE ASSIGNED TO**, so the
 * wrapping is done on a shallow copy that the loader hands back in its place. Every export is the
 * real one -- `Project`, `Workspace`, `LinkType` and the rest are carried across by name -- and the
 * only thing that differs is that `readBinary()` says so before it reads. dev/testing-notes.md's
 * first lesson applies: what must not be stubbed is the reading itself, and it is not.
 */
function shimFor(mod) {
	const shim = Object.assign({}, mod);
	const real = mod.readBinary;
	if (typeof real === 'function') {
		shim.readBinary = function () {
			if (shim.recordRead) { shim.recordRead(); }
			return real.apply(mod, arguments);
		};
	}
	EngCalcs.lpnEpanetLoad = function () { return Promise.resolve(shim); };
	return shim;
}

(async function () {
	const mod = shimFor(await warmEpanet());
	const doc = L.getDoc();
	const settings = L.getSettings();
	doc.times = Object.assign(EngCalcs.lpnTimesDefaults(), {
		duration: 12 * 3600, hydraulicStep: 3600, reportStep: 3600, patternStep: 3600,
		qualityStep: 60, reportStart: 0
	});
	settings.reactions = Object.assign(settings.reactions || {}, {
		orderBulk: 1, orderWall: 1, orderTank: 1,
		globalBulk: -0.5, globalWall: -1, limitingPotential: 0, roughnessCorrelation: 0
	});

	// =========================================================================================
	head('1. The share is declared, and it is the share Tom asked for');
	// =========================================================================================
	ok('the run reserves a share of the bar for the read',
		EngCalcs.LPN_EPANET_READ_SPAN > 0 && EngCalcs.LPN_EPANET_READ_SPAN < 1,
		String(EngCalcs.LPN_EPANET_READ_SPAN));

	// =========================================================================================
	head('2. A chemical run: the bar holds, the file is read, and only then is it finished');
	// =========================================================================================
	L.setQuality(Object.assign({}, CHEM));
	const chem = await runRecording(mod);
	const ticks = chem.events.filter((e) => e.kind === 'tick').map((e) => e.f);
	ok('the run produced frames', chem.run.ok && (chem.run.frames || []).length > 1,
		String((chem.run.frames || []).length) + ' frames');
	ok('the engine\'s own binary reader was wrapped, so the order below means something',
		chem.wrapped);
	ok('...and it really was called, so this run had an output file to read',
		chem.events.some((e) => e.kind === 'read'));

	const hold = 1 - EngCalcs.LPN_EPANET_READ_SPAN;
	const last = ticks[ticks.length - 1];
	ok('the last thing the consumer hears is 100%', last === 1, String(last));
	ok('**and nothing before it went past the reserved boundary**',
		ticks.slice(0, -1).every((f) => f <= hold + 1e-9),
		ticks.map((f) => f.toFixed(3)).join(' '));
	ok('...with the bar actually parked ON the boundary rather than merely under it',
		ticks.some((f) => Math.abs(f - hold) < 1e-9), ticks.map((f) => f.toFixed(3)).join(' '));

	// **THE HEADLINE.** Read the recorded order back: 90%, then the engine's file, then 100%.
	const order = chem.events.map((e) => (e.kind === 'read' ? 'read' : String(e.f)));
	const iRead = order.indexOf('read');
	const iHold = order.lastIndexOf(String(hold));
	const iDone = order.indexOf('1');
	ok('**the file is read AFTER the bar reaches the boundary**', iHold >= 0 && iRead > iHold,
		order.join(' '));
	ok('**and the bar is finished only AFTER the file has been read**', iDone > iRead,
		order.join(' '));

	// Leg 3: the reserved share is worth nothing if the browser never gets to paint it.
	const doneTick = chem.events.filter((e) => e.kind === 'tick' && e.f === 1)[0];
	ok('...and the run let go of the thread in between, so that boundary can be painted',
		!!doneTick && doneTick.painted === true);

	// The read is what the share was reserved for, so the answers it produces must be on the
	// frames by the time the run resolves -- the other half of "all the output is available".
	ok('every frame carries the rates the read produced',
		(chem.run.frames || []).every((f) => f.linkRates && typeof f.linkRates[p1.id] === 'number'),
		String((chem.run.frames || []).filter((f) => f.linkRates).length) + ' of ' +
			String((chem.run.frames || []).length));

	// =========================================================================================
	head('3. A run with nothing to read finishes the bar at the end of its own walk');
	// =========================================================================================
	// **A BAR THAT STOPPED AT 90% FOR EVER WOULD BE A DEFECT OF ITS OWN.** Water age writes no
	// output file and reads none, so the whole bar belongs to the walk.
	L.setQuality(Object.assign({}, AGE));
	const age = await runRecording(mod);
	const ageTicks = age.events.filter((e) => e.kind === 'tick').map((e) => e.f);
	ok('the age run produced frames', age.run.ok && (age.run.frames || []).length > 1,
		String((age.run.frames || []).length) + ' frames');
	ok('nothing was read, because there is no output file to read',
		!age.events.some((e) => e.kind === 'read'));
	ok('the bar still finishes', ageTicks[ageTicks.length - 1] === 1);
	ok('...and no tick was parked on the reserved boundary, which belongs to a read',
		!ageTicks.slice(0, -1).some((f) => Math.abs(f - hold) < 1e-9),
		ageTicks.map((f) => f.toFixed(3)).join(' '));
	// The walk itself must still reach the top of its own phase: with nothing reserved, the
	// quality walk owns the second half outright.
	ok('...and the walk\'s own ticks still climb past the boundary',
		ageTicks.some((f) => f > hold), ageTicks.map((f) => f.toFixed(3)).join(' '));

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILURE(S)'));
	process.exit(fails === 0 ? 0 : 1);
}()).catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

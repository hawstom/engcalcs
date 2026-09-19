// OFF MEANS OFF: "Recalculate automatically" unticked, an edit solves NOTHING. Run with:
//   node dev/lpn-spike/manual-recalc-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-19, reviewing a branch: *"I saw a banner message that when
// Recalculate is off, the first time step is still calculated. This is bad. Off means off. This
// could explain the delay I am seeing. With recalculate off and no zooms happening, there should
// be nothing happening when I change inputs. It should be lightning fast."*
//
// **HE WAS RIGHT, AND THE SWITCH WAS WEAKER THAN EVEN THE BANNER ADMITTED.** `settings.autoRun`
// reached the arithmetic through exactly one door -- scheduleIdleRun() in js/lpn-time.js -- which
// only ever suppressed the LATER time steps of an extended-period run. Measured here before the
// repair, on the shipped Net3 example with the box unticked: one pipe roughness edit still
// produced one full EPANET solve. And on a document with NO duration, which is most of them, the
// switch suppressed nothing at all, because js/lpn-time.js hands that case straight back.
//
// So the gate moved to scheduleSolve(), the one door every edit on the page goes through. The
// assertions below are in three groups and all three matter:
//
//   1. **NO SOLVE**, steady-state and extended-period alike. This is the defect.
//   2. **THE EDIT STILL PERSISTS.** Autosave used to piggyback on the solve debounce, so a repair
//      that only removed the solve would silently stop saving -- a worse defect than the one being
//      fixed, and invisible until a reload.
//   3. **THE RESULTS ARE TAKEN AWAY, not left to be believed.** A label still reading a pressure
//      for a pipe whose diameter has since changed is the "quietly wrong picture" clearFireFlowRun()
//      and dropFrames() already exist to prevent.
//
// AND THE LAST GROUP IS A LIVE MUTATION. A harness that passes because the page happens to be
// quiet is worth nothing, so the gate is removed from the source and the same assertions are
// required to FAIL. Without it, deleting the repair would leave this file green.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

const INJECT =
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tscheduleSolve: scheduleSolve, runSolve: runSolve,\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tgetLibrary: function () { return library; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, defaultSettings: defaultSettings,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } ";

// The gate, as one line of the shipped source. The mutation below deletes exactly this, which puts
// the page back on the behaviour Tom reported -- and loadLoopedNetwork() throws if it matches
// nothing, so a rewording of the gate cannot quietly turn the mutation into a no-op.
const GATE = "\t\tif (settings.autoRun === false) { afterManualEdit(); return; }\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// Opens a project and counts every call either solver receives. Counting at the SOLVERS rather
// than at runSolve() is deliberate: the question Tom asked is "is arithmetic happening", and a
// repair that reached runSolve() and returned early from somewhere inside it would still be a
// repair. This counts the thing that costs.
function openPage(file, mutate) {
	const L = loadLoopedNetwork(INJECT, null, mutate);
	setUnitSet('us');
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + file, 'utf8'));
	if (!saved) { throw new Error('the example did not open: ' + file); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();

	const EC = global.EngCalcs;
	const counts = { native: 0, epanet: 0, saves: 0 };
	const realNative = EC.lpnSolve;
	EC.lpnSolve = function () { counts.native++; return realNative.apply(this, arguments); };
	if (EC.lpnSolveEpanet) {
		const realEpanet = EC.lpnSolveEpanet;
		EC.lpnSolveEpanet = function () { counts.epanet++; return realEpanet.apply(this, arguments); };
	}
	if (EC.lpnEpanetRun) {
		const realRun = EC.lpnEpanetRun;
		EC.lpnEpanetRun = function () { counts.epanet++; return realRun.apply(this, arguments); };
	}
	// **AUTOSAVE REFUSES A DOCUMENT THAT IS IN NO PROJECT** -- saveToStorage() returns at its first
	// line when `library.openId` is null, which is the state a bare harness is in. Without this the
	// save assertions below would measure the fixture rather than the repair, and would pass on
	// master and on the mutation alike. One project, named, open.
	const lib = L.getLibrary();
	lib.projects = [{ id: 'manual-recalc-fixture', name: 'fixture', updated: 0 }];
	lib.openId = 'manual-recalc-fixture';
	// The autosave sink. localStorage is the stub's, and what matters is only that a write
	// HAPPENED for this document -- what it contains is serializeProject()'s business and is
	// asserted by its own harnesses.
	const store = global.localStorage;
	const realSet = store.setItem.bind(store);
	store.setItem = function (k, v) { if (String(k).indexOf('lpn') >= 0) { counts.saves++; } return realSet(k, v); };

	return { L: L, counts: counts, doc: L.getDoc(), settings: L.settings() };
}

// The edit a person actually makes: a number in the property popup changes, the page redraws what
// it drew, and scheduleSolve() is told. Roughness rather than a coordinate, so there is no way for
// the page to decide the edit was not hydraulic and skip the work for a reason of its own.
function hydraulicEdit(page) {
	const pipe = page.doc.links.filter(function (l) { return l.type === 'pipe'; })[0];
	pipe.rough = (pipe.rough || 130) + 1;
	page.L.scheduleSolve();
}

async function group(title, file, mutate) {
	console.log('\n' + title);
	const page = openPage(file, mutate);
	const extended = !!(page.doc.times && page.doc.times.duration);

	// First: the answers are on screen, put there the way opening a project puts them there.
	page.L.runSolve();
	await wait(400);
	const hadResult = !!page.L.lastResult() || page.counts.epanet > 0;

	page.settings.autoRun = false;
	page.counts.native = 0;
	page.counts.epanet = 0;
	page.counts.saves = 0;

	hydraulicEdit(page);
	await wait(50);
	hydraulicEdit(page);
	hydraulicEdit(page);
	// Well past the 300 ms debounce and past js/lpn-time.js's idle timer, so "it is only late"
	// cannot be mistaken for "it never happened".
	await wait(900);

	return {
		page: page, extended: extended, hadResult: hadResult,
		solves: page.counts.native + page.counts.epanet,
		saves: page.counts.saves
	};
}

(async function () {
	console.log('=== R-041: "Recalculate automatically" off means OFF ===');

	// ---- 1. a steady-state document: the case the old switch did not touch at all ----------------
	const basic = await group('-- Basic example (no duration): three edits with the box unticked --',
		'Basic-example-US-units.lwn');
	ok('a steady-state document solves ZERO times on an edit', basic.solves === 0, basic.solves + ' solves');
	ok('the edit is still saved', basic.saves > 0, basic.saves + ' writes');
	ok('the results were taken away rather than left standing', basic.page.L.lastResult() === null);

	// ---- 2. an extended-period document: the case the banner described -------------------------
	const net3 = await group('-- Net3 (24-hour duration): three edits with the box unticked --',
		'Net3.lwn');
	ok('Net3 states a duration, so this is the case the deleted banner was about', net3.extended);
	ok('an extended-period document solves ZERO times on an edit', net3.solves === 0, net3.solves + ' solves');
	ok('the edit is still saved', net3.saves > 0, net3.saves + ' writes');
	ok('no frames are left behind to draw',
		global.EngCalcs.lpnTimeCurrentFrame ? global.EngCalcs.lpnTimeCurrentFrame() === null : true);

	// ---- 3. the Calculate button still calculates ----------------------------------------------
	//
	// The other half of "off means off", and the half that makes it usable rather than merely
	// quiet. Calculate reaches runSolve() through host.solveNow(), which deliberately does NOT go
	// through the gated scheduleSolve().
	net3.page.counts.native = 0;
	net3.page.counts.epanet = 0;
	net3.page.L.runSolve();
	await wait(900);
	ok('...but pressing Calculate still works the network out',
		net3.page.counts.native + net3.page.counts.epanet > 0);

	// ---- 4. the deleted banner ------------------------------------------------------------------
	ok('the half-fresh banner is gone from the page', !global.EngCalcs.lpnTimeStatusNote);

	// ---- 5. THE LIVE MUTATION -------------------------------------------------------------------
	//
	// Put the page back on the behaviour Tom reported and require the first assertion to fail. A
	// green run above proves nothing on its own: the page could be quiet for a reason that has
	// nothing to do with the gate.
	console.log('\n-- live mutation: the gate removed, which is master as he found it --');
	const broken = await group('   (expecting a solve, which is the defect)',
		'Net3.lwn',
		function (src) {
			if (src.indexOf(GATE) < 0) { throw new Error('the gate line has moved; update GATE in this harness'); }
			return src.replace(GATE, '');
		});
	ok('without the gate, an edit DOES solve -- so the assertions above are testing the repair',
		broken.solves > 0, 'the mutated page solved ' + broken.solves + ' times, expected more than 0');

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILED'));
	process.exit(fails === 0 ? 0 : 1);
})().catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

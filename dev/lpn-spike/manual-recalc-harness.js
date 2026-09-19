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
//   3. **THE OLD ANSWERS STAY EXACTLY WHERE THEY ARE.** *"Recalc off Old values: Leave in place
//      stale. Don't clear. Trust the user."* (Tom, 2026-09-19, reading the first repair, which
//      cleared them and said so in the status bar.) With the switch off HE decides when the
//      answers are worked out, so he also decides how long the last set is worth looking at.
//      There is no grey-out and no sentence either -- *leave in place*, not *mark it*.
//   4. **OPENING A PROJECT RUNS NOTHING EITHER.** *"Calculate on open: No. Off means off; you say
//      it, but do you believe it? Consent, people! And the industry is used to that."* (same
//      reading). The first repair exempted arrival on the argument that opening a file is asking
//      for answers; he rejected the argument, and EPANET and its peers open a model without
//      solving it.
//
// AND EACH GATE IS A LIVE MUTATION. A harness that passes because the page happens to be quiet is
// worth nothing, so each gate is removed from the source in turn and the assertions it holds are
// required to FAIL. Without that, deleting a repair would leave this file green.

'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

const INJECT =
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tscheduleSolve: scheduleSolve, runSolve: runSolve,\n" +
	"\t\trefreshAllFromDocument: refreshAllFromDocument,\n" +
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
// The ARRIVAL gate, the same line of reasoning at the other door. Removing it puts the page back
// on the behaviour Tom rejected: a project that calculates itself the moment it opens.
const ARRIVAL_GATE = "\t\tif (settings.autoRun === false) {\n" +
	"\t\t\tif (EngCalcs.lpnTimeStandDown) { EngCalcs.lpnTimeStandDown(); }\n" +
	"\t\t\treturn;\n" +
	"\t\t}\n";
// The line that KEEPS the old answers is an absence, and an absence cannot be deleted -- so this
// mutation puts the clearing back instead, which is the page as it shipped earlier on 2026-09-19,
// and the retention assertions are required to fail against it.
const STAND_DOWN = "\t\tif (EngCalcs.lpnTimeStandDown) { EngCalcs.lpnTimeStandDown(); }\n\t}\n";
const STAND_DOWN_AND_CLEAR = "\t\tif (EngCalcs.lpnTimeStandDown) { EngCalcs.lpnTimeStandDown(); }\n" +
	"\t\tlastSolveResult = null;\n\t}\n";

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
	ok('the old answers are STILL THERE, untouched -- "leave in place stale"',
		basic.page.L.lastResult() !== null);

	// ---- 2. an extended-period document: the case the banner described -------------------------
	const net3 = await group('-- Net3 (24-hour duration): three edits with the box unticked --',
		'Net3.lwn');
	ok('Net3 states a duration, so this is the case the deleted banner was about', net3.extended);
	ok('an extended-period document solves ZERO times on an edit', net3.solves === 0, net3.solves + ' solves');
	ok('the edit is still saved', net3.saves > 0, net3.saves + ' writes');
	ok('the old answers are STILL THERE, untouched -- "leave in place stale"',
		net3.page.L.lastResult() !== null);
	// The transport's frames are the extended-period half of the same numbers, and they stay for
	// the same reason: taking them away is the page deciding for him.
	ok('...and so are the frames the transport is showing',
		global.EngCalcs.lpnTimeCurrentFrame ? global.EngCalcs.lpnTimeCurrentFrame() !== null : true);

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

	// ---- 4. the deleted banners -----------------------------------------------------------------
	ok('the half-fresh banner is gone from the page', !global.EngCalcs.lpnTimeStatusNote);
	// And the sentence the first repair put in its place. It announced a clearing that no longer
	// happens, so the key went with it -- nothing may say anything about the old answers at all.
	ok('and nothing on the page says the results were cleared',
		fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8').indexOf('lpn_manual_results_cleared') < 0);

	// ---- 4b. R-047: OPENING A PROJECT RUNS NOTHING WITH THE SWITCH OFF -------------------------
	//
	// A fresh page, the switch turned off BEFORE the document arrives, and then the real arrival
	// path -- refreshAllFromDocument(), which the gallery, File > Import, a tab switch and the boot
	// path all reach. Counted at the solvers, the same way an edit is counted above.
	console.log('\n-- Net3 opened with the box already unticked --');
	const arriveOff = openPage('Net3.lwn');
	arriveOff.settings.autoRun = false;
	arriveOff.counts.native = 0; arriveOff.counts.epanet = 0;
	arriveOff.L.refreshAllFromDocument();
	await wait(900);
	ok('opening a project with the switch off solves ZERO times',
		arriveOff.counts.native + arriveOff.counts.epanet === 0,
		(arriveOff.counts.native + arriveOff.counts.epanet) + ' solves');

	// The control, and it is what makes the assertion above mean anything: with the switch ON the
	// same arrival DOES calculate, so the zero is the switch and not a harness that opened nothing.
	const arriveOn = openPage('Net3.lwn');
	arriveOn.settings.autoRun = true;
	arriveOn.counts.native = 0; arriveOn.counts.epanet = 0;
	arriveOn.L.refreshAllFromDocument();
	await wait(900);
	ok('...while with the switch ON the same arrival still calculates',
		arriveOn.counts.native + arriveOn.counts.epanet > 0,
		(arriveOn.counts.native + arriveOn.counts.epanet) + ' solves');

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

	// ...and the arrival gate on its own. This mutation IS the page as it shipped earlier on
	// 2026-09-19: the edit gate in place, and opening a project calculating anyway.
	console.log('\n-- live mutation: the ARRIVAL gate removed, which is the page he rejected --');
	const arriveBroken = openPage('Net3.lwn', function (src) {
		if (src.indexOf(ARRIVAL_GATE) < 0) { throw new Error('the arrival gate has moved; update ARRIVAL_GATE in this harness'); }
		return src.replace(ARRIVAL_GATE, '');
	});
	arriveBroken.settings.autoRun = false;
	arriveBroken.counts.native = 0; arriveBroken.counts.epanet = 0;
	arriveBroken.L.refreshAllFromDocument();
	await wait(900);
	ok('without the arrival gate, opening with the switch off DOES calculate -- the defect he named',
		arriveBroken.counts.native + arriveBroken.counts.epanet > 0,
		(arriveBroken.counts.native + arriveBroken.counts.epanet) + ' solves');

	// ...and the clearing put back, so "the old answers are still there" is testing the repair
	// rather than a page that never had any answers to lose.
	console.log('\n-- live mutation: the clearing put back, which is the page he rejected --');
	const cleared = await group('   (expecting the answers to be taken away, which is the defect)',
		'Net3.lwn',
		function (src) {
			if (src.indexOf(STAND_DOWN) < 0) { throw new Error('afterManualEdit() has moved; update STAND_DOWN in this harness'); }
			return src.replace(STAND_DOWN, STAND_DOWN_AND_CLEAR);
		});
	ok('with the clearing back, the old answers ARE taken away -- so the checks above test the repair',
		cleared.page.L.lastResult() === null);

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILED'));
	process.exit(fails === 0 ? 0 : 1);
})().catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

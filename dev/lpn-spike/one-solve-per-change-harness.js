// ONE CHANGE, ONE APPLIED RESULT, ONE LABEL PASS (ROADMAP Task 653). Run with:
//   node dev/lpn-spike/one-solve-per-change-harness.js
//
// **THE DEFECT, MEASURED IN A REAL CHROME ON NET3 AND NET3-NOVATO** (browser-settings-select-probe.js).
// One Settings change on a project with a clock applied TWO results, each with a full label pass:
// the steady solve at the first reporting time, then the extended-period run about a second later,
// replacing it at the very same instant. The first was never going to be looked at for longer than
// the idle wait in js/lpn-time.js, and it cost as much to draw as the one that stayed.
//
// So a cheap run now IS the edit's answer (editRunsNow() in js/lpn-time.js), and what this holds:
//
//   1. AN EPS PROJECT, RECALCULATE ON: one change applies exactly one result -- the run's frame at
//      the first reporting time, the same one the user ended up looking at before -- and runs
//      exactly one label pass. Twice over, so the second change is not riding on the first.
//   2. THE CONTROL: the same page with the gate pushed out of reach (every run counts as slow)
//      applies two, so the count above is measuring the repair and not a quiet page.
//   3. A RUN THAT FAILS still reports, in the status bar, in the words the page states.
//   4. RECALCULATE OFF applies nothing at all.
//   5. A STEADY-ONLY PROJECT still solves steady and applies that one result.
//
// Passes are counted where ?debug=perf counts them (perfDebugCount('labelPasses')), and applies at
// applySolveResult()'s first line, both by injection -- the page's code is otherwise unchanged.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { ROOT, byId, loadLoopedNetwork, setUnitSet } = stub;

require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

const EC = global.EngCalcs;
const PC = EC.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// A SELECT'S VALUE IS ITS SELECTED OPTION, as in a browser -- the same re-coupling
// settings-select-lag-harness.js makes, for the same reason.
const realCreate = global.document.createElement;
global.document.createElement = function (tag) {
	const el = realCreate.apply(this, arguments);
	if (String(tag).toLowerCase() === 'select') {
		const opts = function () { return el.children.filter(function (c) { return c.tagName === 'OPTION'; }); };
		Object.defineProperty(el, 'value', {
			configurable: true,
			get() { const o = opts(), hit = o.filter(function (x) { return x.selected; })[0] || o[0]; return hit ? hit.value : ''; },
			set(v) { opts().forEach(function (x) { x.selected = (x.value === String(v)); }); }
		});
	}
	return el;
};

global.__lpnPasses = 0;
global.__lpnApplies = [];
const INJECT =
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tfit: restoreViewOrFit, getDoc: function () { return doc; },\n" +
	"\t\trefreshLabelText: refreshLabelText, runSolve: runSolve,\n" +
	"\t\trebuildSettingsBox: rebuildSettingsBox,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; }";
function count(src) {
	const pass = "perfDebugCount('labelPasses');", apply = '\tfunction applySolveResult(result) {\n';
	if (src.indexOf(pass) < 0 || src.indexOf(apply) < 0) { throw new Error('a counting seam has moved; update this harness'); }
	return src.replace(pass, pass + ' global.__lpnPasses++;')
		.replace(apply, apply + '\t\tglobal.__lpnApplies.push(result && result.t !== undefined ? \'frame\' : \'steady\');\n');
}

// The Settings box, assembled: the stub hands every host out as a loose element.
function controlsIn(root, tag) {
	const out = [];
	(function walk(e) { (e.children || []).forEach(function (c) { if (c.tagName === tag) { out.push(c); } walk(c); }); }(root));
	return out;
}
function fire(el, type) { (el._listeners[type] || []).slice().forEach(function (f) { f({ type: type, target: el }); }); }
function statusText() {
	const t = byId.lpn_status_text || byId.lpn_status;
	return t ? String(t.textContent || '') : '';
}

// `wanted` is left standing on a document with no clock (lpnTimeArrived() sets it and only a run
// consumes it), so it is read only where a run could consume it.
async function settled(L, timeoutMs) {
	const t0 = Date.now(), extended = EC.lpnTimeIsExtended(L.getDoc().times);
	// Past the 300 ms debounce first, so a run not yet started is not read as a run finished.
	await sleep(400);
	while (Date.now() - t0 < timeoutMs) {
		const s = EC.lpnTimeRunState();
		if (!s.busy && !s.idle && !(s.wanted && extended)) { break; }
		await sleep(50);
	}
	// And one frame's worth more, for the coalesced label pass.
	await sleep(80);
}

// Opens a project the way a tab arrives: the document, the drawing, the arrival flag, one solve.
async function openPage(file) {
	const L = loadLoopedNetwork(INJECT, null, count);
	setUnitSet('us');
	L.buildLayers();
	L.setCanvas(1400, 900);
	const saved = JSON.parse(fs.readFileSync(ROOT + file, 'utf8'));
	// Net3 ships a labeling threshold (30) and opens past it, where NO pass runs at all. This
	// counts passes, so it switches the threshold off on its own copy.
	if (saved.settings) { saved.settings.labelMaxWidth = null; saved.settings.autoRun = true; }
	L.applySaved(saved);
	L.buildDom();
	L.fit();
	L.noteMapSized();
	L.labelSettings().node.id = true;
	L.rebuildSettingsBox();
	if (EC.lpnTimeArrived) { EC.lpnTimeArrived(); }
	L.runSolve();
	await settled(L, 20000);
	return L;
}
async function change(L, value) {
	const q = controlsIn(byId.lpn_set_quality_fields, 'SELECT')[0];
	if (!q) { throw new Error('the Quality select was not built'); }
	global.__lpnPasses = 0;
	global.__lpnApplies = [];
	q.value = value;
	fire(q, 'change');
	await settled(L, 20000);
	// Past the idle wait as well, so a run that the old order would still have been waiting to
	// start is counted rather than missed.
	await sleep(EC.LPN_TIME_AUTO.idleMs + 200);
	await settled(L, 20000);
	return { applies: global.__lpnApplies.slice(), passes: global.__lpnPasses };
}

(async function main() {
	console.log('=== Task 653: one change, one applied result, one label pass ===');

	// ---- 1. AN EPS PROJECT, RECALCULATE ON ------------------------------------------------------
	console.log('\n--- 1. Net3 (24 hours), Recalculate on: the Quality select, changed twice ---');
	const net3 = await openPage('dev/water-network-examples/Net3.lwn');
	const arrived = EC.lpnTimeRunState();
	ok('the project arrived with its run in hand', arrived.frames === 25, arrived.frames + ' frames');
	ok('...and that run was measured by its own thread time', typeof arrived.lastBusyMs === 'number',
		String(arrived.lastBusyMs));
	for (const v of ['age', 'none']) {
		const r = await change(net3, v);
		ok('Quality -> ' + v + ': exactly ONE result applied', r.applies.length === 1, JSON.stringify(r.applies));
		ok('...and it is the run\'s frame, the one the user ends up looking at', r.applies[0] === 'frame');
		ok('...with exactly ONE label pass', r.passes === 1, r.passes + ' passes');
		const s = EC.lpnTimeRunState(), res = net3.lastResult();
		ok('...the frames are all there, at the first reporting time', s.frames === 25 && s.t === 0,
			s.frames + ' frames at t=' + s.t);
		ok('...and the result on screen is the run\'s, under the analysis just chosen',
			!!res && (v === 'none' ? !res.qualityMode : res.qualityMode === v), res && String(res.qualityMode));
	}

	// ---- 2. THE CONTROL -------------------------------------------------------------------------
	// Every run counted as slow: the old order, preview then run. It must apply TWO, or the ones
	// above prove nothing.
	console.log('\n--- 2. control: the same page with every run counted as slow (the order before) ---');
	const slow = EC.LPN_TIME_SLOW_MS;
	EC.LPN_TIME_SLOW_MS = -1;
	const before = await change(net3, 'age');
	EC.LPN_TIME_SLOW_MS = slow;
	ok('the old order applies TWO results for one change -- the defect',
		before.applies.length === 2 && before.applies[0] === 'steady' && before.applies[1] === 'frame',
		JSON.stringify(before.applies));
	ok('...and runs two label passes', before.passes === 2, before.passes + ' passes');

	// ---- 3. A FAILED RUN STILL REPORTS -----------------------------------------------------------
	console.log('\n--- 3. a run that fails still says so ---');
	const realRun = EC.lpnEpanetRun;
	EC.lpnEpanetRun = function () { return Promise.reject(new Error('the engine went away')); };
	const realWarn = console.warn;
	console.warn = function () {};
	const failed = await change(net3, 'none');
	console.warn = realWarn;
	EC.lpnEpanetRun = realRun;
	const noEngine = String(PC.lpn_time_no_engine || '').split('{time}')[0];
	ok('the status bar says what happened, in the page\'s own words',
		!!noEngine && statusText().indexOf(noEngine) === 0, JSON.stringify(statusText().slice(0, 60)));
	ok('...and the built-in solver\'s answer is what is drawn, once', failed.applies.length === 1 &&
		failed.applies[0] === 'steady', JSON.stringify(failed.applies));

	// ---- 4. RECALCULATE OFF ---------------------------------------------------------------------
	console.log('\n--- 4. Recalculate off: nothing is applied ---');
	net3.settings().autoRun = false;
	const off = await change(net3, 'age');
	ok('Recalculate off: NO result applied', off.applies.length === 0, JSON.stringify(off.applies));
	ok('...and no label pass', off.passes === 0, off.passes + ' passes');
	net3.settings().autoRun = true;

	// ---- 5. A STEADY-ONLY PROJECT ---------------------------------------------------------------
	console.log('\n--- 5. a project with no clock: still one steady solve ---');
	const basic = await openPage('examples/Basic-example-US-units.lwn');
	ok('the Basic example states no duration', !EC.lpnTimeIsExtended(basic.getDoc().times));
	const st = await change(basic, 'age');
	ok('a change applies exactly ONE result, and it is the steady solve',
		st.applies.length === 1 && st.applies[0] === 'steady', JSON.stringify(st.applies));
	ok('...with exactly one label pass', st.passes === 1, st.passes + ' passes');

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILED'));
	process.exit(fails === 0 ? 0 : 1);
})().catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

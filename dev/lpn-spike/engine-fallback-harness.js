// EPANET CHOSEN, EPANET CANNOT RUN: THE BUILT-IN LOOP RUNS THE PERIOD (Task 733).
//
//   node dev/lpn-spike/engine-fallback-harness.js
//
// Tom: "We will not release this branch until the gap is gone." With the built-in setting the page never
// hands a network to EPANET; this holds the other direction. With EPANET the chosen solver and EPANET unable to
// load or to start (offline, a blocked download, a refused start, a failed run), a 24 h Net3 run still
// produces every period, through the built-in loop; the status bar says plainly that EPANET could not be
// loaded; the run says it is the built-in solver's (engine, summary, report header). A network lpnDiagnose
// refuses is refused as before. An EPANET run that SUCCEEDS is EPANET's answer and is not touched.

'use strict';

const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-msx.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const { buildModel } = require('./net3-model.js');

const HEAD_TOL = 0.8e-3;   // m, also a tank's level
const FLOW_TOL = 2e-6;     // m3/s
const FLOW_REL = 1e-5;     // of the largest flow

// Strings read from the real lang file, so no English literal is asserted here.
function langEn() {
	const src = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8'), out = {};
	src.replace(/\$ec_lang\['(lpn_engine_[a-z_]+)'\]='((?:[^'\\]|\\.)*)';/g, (m, k, v) => { out[k] = v.replace(/\\'/g, "'"); return m; });
	return out;
}

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

function loadEpa(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	return { parsed, model: buildModel(EngCalcs, parsed) };
}
// The file's chemical run as the page hands it over (the same reading native-eps-quality-harness.js uses).
function chemical(file) {
	const { parsed, model } = loadEpa(file), sec = parsed.inpSections || {}, ft = parsed.scale.head;
	const qo = parsed.qualityOptions || {};
	model.quality = { mode: 'chemical', chemical: qo.quality };
	if (qo.tolerance !== undefined) { model.quality.tolerance = parseFloat(qo.tolerance); }
	if (qo.diffusivity !== undefined) { model.quality.diffusivity = parseFloat(qo.diffusivity); }
	(sec.QUALITY || []).forEach((ln) => {
		const w = String(ln).split(';')[0].trim().split(/\s+/);
		const n = model.nodes.find((x) => x.id === w[0]);
		if (n && isFinite(parseFloat(w[1]))) { n.initQuality = parseFloat(w[1]); }
	});
	const src = EngCalcs.lpnSourcesParse(sec.SOURCES || []);
	Object.keys(src).forEach((id) => { model.nodes.find((x) => x.id === id).source = src[id]; });
	const mix = EngCalcs.lpnMixingParse(sec.MIXING || []);
	Object.keys(mix).forEach((id) => { model.nodes.find((x) => x.id === id).mixing = mix[id]; });
	const re = EngCalcs.lpnReactionsParse(sec.REACTIONS || []);
	if (re.orderWall === undefined || re.orderWall === 1) {
		if (typeof re.globalWall === 'number') { re.globalWall *= ft; }
		Object.keys(re.wall).forEach((id) => { re.wall[id] *= ft; });
	}
	model.reactions = re;
	return model;
}
function traced(file, node) {
	const { model } = loadEpa(file);
	model.quality = { mode: 'trace', traceNode: node };
	return model;
}

// ---- the page's run path, with a host the way the page's seam is ----------------------------------------
let engine = 'native', doc = null, applied = null, statuses = [], routeNotes = [], notices = [], current = null;
EngCalcs.lpnTimeInit({
	tabs: [],
	doc: () => doc,
	apply: (r) => { if (applied) { applied(r); } },
	status: (t, c) => statuses.push([t, c]),
	notice: (t, c) => notices.push([t, c]),
	routeNote: (t) => routeNotes.push(t),
	engine: () => engine,
	// The Run button asks, then the page solves, which offers the model to lpnTimeRun().
	solve: () => { EngCalcs.lpnTimeRun(current); }, solveNow: () => { EngCalcs.lpnTimeRun(current); },
	native: () => ({ ok: true, converged: true, heads: {}, flows: {}, engine: 'native-steady' }),
	snapshot: () => {}, save: () => {},
	toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
});

// Run a model through lpnTimeRun() with the host answering `eng`. Resolves with the run the page holds,
// the frames as the page reads them, and the sentences the host was handed.
function pagePath(model, eng) {
	engine = eng;
	doc = { times: model.time.times, nodes: model.nodes, links: model.links };
	statuses = []; routeNotes = []; notices = [];
	// A copy, so neither engine edits the other's input.
	current = JSON.parse(JSON.stringify(model));
	return new Promise((resolve) => {
		applied = () => {
			const kept = EngCalcs.lpnTimeKeep();
			if (!kept) { return; }
			applied = null;
			resolve({ run: kept.run, frames: EngCalcs.lpnTimeRunFrames(), statuses: statuses.slice(), routeNotes: routeNotes.slice(), notices: notices.slice() });
		};
		EngCalcs.lpnTimeRunNow();
	});
}


const LANG = (function () {
	const s = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8'), o = {};
	s.replace(/\$ec_lang\['(lpn_[a-z_]+)'\]='((?:[^'\\]|\\.)*)';/g, (m, k, v) => { o[k] = v.replace(/\\'/g, "'"); return m; });
	return o;
})();
EngCalcs.pageConfig = LANG;

(async function () {
	const realEpanetRun = EngCalcs.lpnEpanetRun;
	const { model } = { model: buildModel(EngCalcs, EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', 'Net3.inp'), 'utf8'))) };
	const tagged = (stage, msg) => { const e = new Error(msg); e.lpnStage = stage; return e; };

	// 1. every cause: EPANET rejects, the built-in loop runs every period
	const causes = {
		'download blocked': tagged('fetch', 'Failed to fetch dynamically imported module'),
		'browser refused to start it': tagged('engine', 'WebAssembly refused'),
		'run failed to start': tagged('run', 'abort(0)')
	};
	let firstFrames = null;
	for (const name of Object.keys(causes)) {
		EngCalcs.lpnEpanetRun = () => Promise.reject(causes[name]);
		const r = await pagePath(model, 'epanet');
		ok(name + ': 24 h Net3 produces all 25 periods', r.frames.length === 25 && r.frames[24].t === 86400, 'frames ' + r.frames.length);
		ok(name + ': the run is the built-in solver\'s', r.run.ok === true && r.run.engine === 'native' && r.frames.every((f) => f.engine === 'native'));
		ok(name + ': the run report is the built-in solver\'s', /Looped Network built-in solver/.test(r.run.report) && /Balanced after/.test(r.run.report));
		const note = r.routeNotes[r.routeNotes.length - 1];
		const want = name === 'download blocked' ? LANG.lpn_time_epanet_fallback_why.replace('{reason}', EngCalcs.lpnEngineReason(EngCalcs.lpnEngineFailWhy(causes[name]))) : null;
		ok(name + ': the status bar says EPANET could not be loaded and the built-in solver ran it',
			/EPANET solver could not/.test(note) && /built-in solver ran this network/.test(note) && note.indexOf('{') < 0 && (!want || note === want), JSON.stringify(note));
		ok(name + ': no one-instant message, no "only by EPANET" message', !statusesText(r).some((t) => /at 0:00 only|can only be solved/.test(t)));
		if (!firstFrames) { firstFrames = r.frames; }
	}
	// the reason is named when it is known, and the offline sentence stands alone
	EngCalcs.lpnEpanetRun = () => Promise.reject(tagged('run', 'x'));
	let r = await pagePath(model, 'epanet');
	ok('a failed run names its cause in the sentence', r.routeNotes.slice(-1)[0] === LANG.lpn_time_epanet_fallback_why.replace('{reason}', EngCalcs.lpnEngineReason('run')), JSON.stringify(r.routeNotes.slice(-1)[0]));
	Object.defineProperty(global, 'navigator', { value: { onLine: false }, configurable: true });
	EngCalcs.lpnEpanetRun = () => Promise.reject(tagged('fetch', 'offline'));
	r = await pagePath(model, 'epanet');
	ok('offline: the plain sentence', r.routeNotes.slice(-1)[0] === LANG.lpn_time_epanet_fallback, JSON.stringify(r.routeNotes.slice(-1)[0]));
	Object.defineProperty(global, 'navigator', { value: { onLine: true }, configurable: true });

	// 2. the same numbers as choosing the built-in solver
	EngCalcs.lpnEpanetRun = () => Promise.reject(tagged('fetch', 'x'));
	const viaFallback = await pagePath(model, 'epanet');
	const direct = await pagePath(model, 'native');
	ok('the fallback frames equal the built-in setting\'s', viaFallback.frames.length === direct.frames.length &&
		viaFallback.frames.every((f, i) => JSON.stringify(f.heads) === JSON.stringify(direct.frames[i].heads) && JSON.stringify(f.levels) === JSON.stringify(direct.frames[i].levels)));
	ok('the built-in setting itself says "Solved with the built-in solver."', direct.routeNotes.slice(-1)[0] === LANG.lpn_engine_native_used);

	// 3. an EPANET run that works is EPANET's, and says nothing of falling back
	EngCalcs.lpnEpanetRun = realEpanetRun;
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ep = await pagePath(model, 'epanet');
	ok('EPANET runs when it can (engine epanet, no fallback sentence)', ep.run.engine === 'epanet' && ep.frames.length === 25 && ep.routeNotes.every((t) => t === ''), 'engine ' + ep.run.engine);

	// 4. a refusal by name is the same as before, with EPANET unable to run
	EngCalcs.lpnEpanetRun = () => Promise.reject(tagged('fetch', 'x'));
	const bad = JSON.parse(JSON.stringify(model));
	const tk = bad.nodes.find((n) => n.type === 'tank' && n.diameter > 0); tk.level = tk.maxLevel + 5;
	const refused = await new Promise((resolve) => {
		engine = 'epanet'; current = bad; doc = { times: bad.time.times, nodes: bad.nodes, links: bad.links };
		statuses = [];
		applied = (res) => { applied = null; resolve(res); };
		EngCalcs.lpnTimeRunNow();
	});
	ok('a network lpnDiagnose refuses is refused by name even when EPANET cannot run',
		refused && refused.ok === false && (refused.issues || []).some((i) => i.code === 'tank-levels-refused'),
		JSON.stringify(refused && Object.keys(refused)) + JSON.stringify((refused && refused.issues || []).map((i) => i.code)) + JSON.stringify(statuses));

	// 5. a steady project: the page's own EPANET-failure message is unchanged (checked in engine-failure-wording-harness)
	console.log('\n' + pass + ' passed, ' + fail + ' failed');
	process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
function statusesText(r) { return r.statuses.map((s) => s[0]); }

// A FAILED EPANET RUN NAMES ITS OWN CAUSE. Run with:
//   node dev/lpn-spike/engine-failure-wording-harness.js
//
// WHY. An engineer with satellite tiles drawing was told "Connect to the internet one time to fetch
// the EPANET solver". js/lpn-time.js showed that for ANY rejection of EngCalcs.lpnEpanetRun: a blocked
// download, a browser that would not start WebAssembly, and a plain exception in the run were all the
// same sentence, and two of the three have nothing to do with the connection.
//
// THE FAILURES ARE REAL. Each cause is produced by the real EngCalcs.lpnEpanetRun, not a stub that
// rejects with a hand-labelled error: a bad module URL (fetch), the vendored engine with
// Workspace.loadModule forced to reject (engine), and a Project that cannot be built inside the real run (run). The page half then feeds those very errors to both banners.
// What is asserted is WHICH sentence appears (whole-string equality against pageConfig), never how
// it is worded (dev/scripts/harness_wording_check.php).

'use strict';
const path = require('path');
const { setUnitSet, loadLoopedNetwork, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');
require(path.join(__dirname, '..', '..', 'js', 'lpn-time.js'));

const INJECT =
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\twarmEpanetEngine: warmEpanetEngine, tsWaitingText: tsWaitingText,\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function setOnLine(v) {
	Object.defineProperty(globalThis, 'navigator', { value: { onLine: v }, configurable: true, writable: true });
}
const EC = global.EngCalcs;
const PC = EC.pageConfig || {};
const sub = (t, time) => t.replace('{time}', time);

const MODEL = {
	nodes: [{ id: 'R1', type: 'reservoir', head: 100 }, { id: 'J1', type: 'junction', elev: 0, demand: 0.001 }],
	links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', diameter: 0.2, roughness: 130, length: 100 }],
	method: 'hw'
};
async function failure(opts) {
	try { await EC.lpnEpanetRun(MODEL, opts); } catch (e) { return e; }
	return null;
}

async function main() {
	setUnitSet('si');
	const realLoad = EC.lpnEpanetLoad;
	const errs = {};

	console.log('\n--- the real run tags the stage that failed ---');
	setOnLine(true);
	// (a) fetch: the module cannot be imported.
	EC.lpnEpanetLoad = function (url, p) { return realLoad('file:///no/such/epanet-js.js', p); };
	errs.fetch = await failure({});
	ok('an unimportable module is tagged fetch', errs.fetch && errs.fetch.lpnStage === 'fetch', errs.fetch && errs.fetch.lpnStage);
	EC.lpnEpanetLoad = function (url, p) { return realLoad(NODE_ENGINE_URL, p); };
	// (b) engine: the module arrives and the engine will not start.
	const mod = await EC.lpnEpanetLoad();
	const origLoadModule = mod.Workspace.prototype.loadModule;
	mod.Workspace.prototype.loadModule = function () { return Promise.reject(new Error('RuntimeError: Aborted')); };
	errs.engine = await failure({});
	mod.Workspace.prototype.loadModule = origLoadModule;
	ok('a WebAssembly start that fails is tagged engine', errs.engine && errs.engine.lpnStage === 'engine', errs.engine && errs.engine.lpnStage);
	// (c) run: the engine started and the run itself throws. (An exception inside the try blocks of
	// the run resolves as a refusal, which has its own message; this is one that escapes them.)
	EC.lpnEpanetLoad = function (url, p) {
		return realLoad(NODE_ENGINE_URL, p).then((m) => Object.assign({}, m, { Project: function () { throw new Error('page bug'); } }));
	};
	errs.run = await failure({});
	EC.lpnEpanetLoad = function (url, p) { return realLoad(NODE_ENGINE_URL, p); };
	ok('an exception in the run is tagged run', errs.run && errs.run.lpnStage === 'run', errs.run && errs.run.lpnStage);
	ok('...and the first tag stays: the engine error was not re-tagged run', errs.engine.lpnStage === 'engine');

	console.log('\n--- which cause each earns ---');
	setOnLine(false);
	ok('a fetch failure offline is offline', EC.lpnEngineFailWhy(errs.fetch) === 'offline');
	ok('an engine failure offline is still an engine failure', EC.lpnEngineFailWhy(errs.engine) === 'engine');
	setOnLine(true);
	ok('a fetch failure online is fetch', EC.lpnEngineFailWhy(errs.fetch) === 'fetch');
	ok('an untagged rejection is a run failure', EC.lpnEngineFailWhy(new Error('x')) === 'run');

	console.log('\n--- banner 1: the extended period note ---');
	const L = loadLoopedNetwork(INJECT);
	L.buildLayers(); L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: 200, _roughness: 130, _length: 1000, _k: 0, _status: 'open' });
	doc.times = EC.lpnTimesDefaults(); doc.times.duration = 86400;
	let status = '';
	const solveNow = () => { EC.lpnTimeRun({ nodes: [{ id: 'J1', type: 'junction', elev: 1 }], links: [] }); };
	EC.lpnTimeInit({
		tabs: [], doc: () => doc, apply: () => {}, status: (t) => { status = t; },
		solve: solveNow, solveNow: solveNow,
		native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
		snapshot: () => {}, save: () => {}, toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
	});
	EC.LPN_TIME_AUTO.idleMs = 40; EC.LPN_TIME_AUTO.budgetMs = 60;
	const NOW = EC.lpnTimeElapsedText(0);
	const exp = {
		offline: sub(PC.lpn_time_no_engine, NOW),
		fetch: sub(PC.lpn_time_no_engine_why.replace('{reason}', PC.lpn_time_engine_fetch_failed), NOW),
		engine: sub(PC.lpn_time_no_engine_why.replace('{reason}', PC.lpn_time_engine_start_failed), NOW),
		run: sub(PC.lpn_time_no_engine_why.replace('{reason}', PC.lpn_time_engine_run_failed), NOW)
	};
	async function drive(err, onLine) {
		setOnLine(onLine);
		EC.lpnEpanetRun = () => wait(5).then(() => { throw err; });
		EC.lpnTimeRunBoxHide(); status = '';
		EC.lpnTimeArrived(); EC.lpnTimeRunNow();
		await wait(100);
		return status;
	}
	const cases = [['offline', errs.fetch, false], ['fetch', errs.fetch, true], ['engine', errs.engine, true], ['run', errs.run, true]];
	for (const [name, err, onLine] of cases) {
		const s = await drive(err, onLine);
		ok('status says the ' + name + ' sentence', s === exp[name], JSON.stringify(s));
		ok('...and still states the network at {time} only', /\b0:00\b|at /.test(s) && s.indexOf('{') < 0 && /built-in solver/.test(s));
		const w = L.tsWaitingText(PC);
		ok('time-series note says the same ' + name + ' sentence', w === exp[name], JSON.stringify(w));
	}
	// The offline note's own closing sentence, taken from its key: the other causes must not carry it.
	const offlineTail = PC.lpn_time_no_engine.slice(PC.lpn_time_no_engine.lastIndexOf('. ', PC.lpn_time_no_engine.length - 2) + 2);
	ok('only the offline note tells the reader to go online',
		exp.offline.indexOf(offlineTail) >= 0 && ['fetch', 'engine', 'run'].every((k) => exp[k].indexOf(offlineTail) < 0));
	ok('the run sentence names the report link', PC.lpn_time_engine_run_failed.indexOf(PC.lpn_wrong_btn) >= 0);

	console.log('\n--- banner 2: lpn_engine_unavailable (valve network, download fails) ---');
	const notice = global.document.getElementById('lpn_map_notice');
	async function warm(onLine) {
		setOnLine(onLine);
		const L2 = loadLoopedNetwork(INJECT);
		L2.buildLayers(); L2.seedDefaultInputs();
		EC.lpnEpanetLoad = () => Promise.reject(new Error('Failed to fetch dynamically imported module'));
		notice.textContent = '';
		L2.warmEpanetEngine('valve');
		await wait(20);
		return notice.textContent;
	}
	let n = await warm(false);
	ok('offline keeps today\'s sentence', n === PC.lpn_engine_unavailable, JSON.stringify(n));
	n = await warm(true);
	ok('online, a blocked download says so', n === PC.lpn_engine_unavailable_fetch, JSON.stringify(n));
	const tail2 = PC.lpn_engine_unavailable.slice(PC.lpn_engine_unavailable.lastIndexOf('. ', PC.lpn_engine_unavailable.length - 2) + 2);
	ok('...and does not tell the reader to go online', n.indexOf(tail2) < 0);

	console.log(fails ? '\n' + fails + ' failure(s)' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

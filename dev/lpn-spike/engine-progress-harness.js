// THE FIRST ENGINE FETCH SAYS HOW FAR ALONG IT IS -- ROADMAP Task 608. Run with:
//   node dev/lpn-spike/engine-progress-harness.js
//
// WHY THIS EXISTS. js/vendor/epanet-js.js is 664 KB and floors at roughly 7 s on 3G and 21 s on 2G
// before handshake, and since Task 605 made EPANET the page default an ordinary first-time visitor
// waits for all of it at their first solve. Nielsen's response-time doctrine is that past ten
// seconds a wait needs a progress indicator or the reader leaves. Tom, 2026-09-08: *"I am also open
// to putting up a banner 'Loading solver. Results delayed momentarily. Continue working.'"*
//
// **THE TWO HALVES FAIL IN OPPOSITE DIRECTIONS AND ARE ASSERTED SEPARATELY.**
//   * The LOADER half (js/lpn-epanet.js, watchFetch) fails by INVENTING a number. A dynamic
//     import() reports nothing, so the bytes are counted off a fetch of the same URL -- and the
//     two ways that goes wrong quietly are a gzipped response, whose Content-Length counts encoded
//     bytes while the reader hands back decoded ones, and a response with no length at all. Both
//     must report NO TOTAL rather than a confident fraction, so those assertions are about a zero.
//   * The BANNER half (js/looped-network.js) fails by SAYING NOTHING while somebody waits, or by
//     saying it when nobody is waiting. Silence is correct for a background fetch on a network the
//     built-in solver is about to answer -- dev/lpn-spike/engine-prefetch-harness.js section 2 owns
//     that -- and wrong the moment the engine still arriving is the one the answer will come from.
//
// NO ENGLISH WORDING IS PINNED HERE. Every expected string is built out of
// EngCalcs.pageConfig, which the DOM stub fills from lib/lang.ec.en.php, so rewording a string is
// not a red build in a file about hydraulics (dev/scripts/harness_wording_check.php).

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const PC = global.EngCalcs.pageConfig || {};
const doc$ = global.document;
const bannerEl = doc$.getElementById('lpn_engine_banner');
const PAGE = require('fs').readFileSync(require('path').resolve(__dirname, '..', '..', 'Looped-Network.php'), 'utf8');
function banner() { return (bannerEl && bannerEl.textContent) || ''; }
function pct(n) { return PC.lpn_engine_wait_pct.replace('{percent}', String(n)); }
function kb(n) { return PC.lpn_engine_wait_bytes.replace('{kb}', String(n)); }
function settle() { return new Promise(function (r) { setTimeout(r, 0); }); }

// ---------------------------------------------------------------------------------------------
// THE LOADER HALF. global.fetch is replaced with something whose headers and chunking this test
// chooses, because what is being asserted is how a REPLY is read, and no real reply can be asked
// to be gzipped, truncated or silent about its length on demand.
// ---------------------------------------------------------------------------------------------
const realFetch = global.fetch;
function fakeFetch(headers, chunks, mode) {
	global.fetch = function () {
		if (mode === 'reject') { return Promise.reject(new Error('offline')); }
		let i = 0;
		return Promise.resolve({
			ok: mode !== 'notok',
			headers: { get: function (k) { return headers[k.toLowerCase()] || null; } },
			body: mode === 'nobody' ? null : {
				getReader: function () {
					return {
						read: function () {
							return Promise.resolve(i < chunks.length
								? { done: false, value: { length: chunks[i++] } }
								: { done: true });
						}
					};
				}
			}
		});
	};
}
// The load is asked for a module that does not exist, so import() rejects and the cached promise
// resets itself -- which is what makes each case below start cold. What is under test is
// everything that happened BEFORE the import.
async function runLoad(cb) {
	try { await global.EngCalcs.lpnEpanetLoad('/engcalcs/dev/lpn-spike/no-such-engine.mjs', cb); }
	catch (e) { /* expected: there is no such module */ }
}

async function main() {

console.log('=== Task 608: the first engine fetch reports how far along it is ===');
setUnitSet('si');

console.log('\n--- the loader counts the bytes ---');
{
	fakeFetch({ 'content-length': '1000' }, [250, 250, 500]);
	const seen = [];
	await runLoad(function (p) { seen.push(p); });
	ok('progress was reported at all', seen.length > 0, seen.length + ' calls');
	ok('...opening at zero, so the reader sees the wait begin',
		seen[0] && seen[0].loaded === 0, JSON.stringify(seen[0]));
	ok('...with the stated total on every call',
		seen.every(function (p) { return p.total === 1000; }), JSON.stringify(seen));
	ok('...never going backwards',
		seen.every(function (p, i) { return i === 0 || p.loaded >= seen[i - 1].loaded; }),
		JSON.stringify(seen.map(function (p) { return p.loaded; })));
	ok('...and ending on the whole file', seen[seen.length - 1].loaded === 1000,
		JSON.stringify(seen[seen.length - 1]));
}
{
	// A GZIPPED REPLY COUNTS TWO DIFFERENT THINGS: Content-Length is the encoded length and the
	// reader hands back decoded bytes, so believing it prints numbers past 100%. No total is the
	// honest answer, and the banner half turns that into a byte count.
	fakeFetch({ 'content-length': '236000', 'content-encoding': 'gzip' }, [300000, 378695]);
	const seen = [];
	await runLoad(function (p) { seen.push(p); });
	ok('a compressed reply states NO total rather than the encoded one',
		seen.length > 0 && seen.every(function (p) { return p.total === 0; }),
		JSON.stringify(seen.map(function (p) { return p.total; })));
	ok('...and the bytes are still counted', seen[seen.length - 1].loaded === 678695,
		seen[seen.length - 1].loaded);
}
{
	fakeFetch({}, [100, 100]);
	const seen = [];
	await runLoad(function (p) { seen.push(p); });
	ok('a reply that states no length reports no total either',
		seen.length > 0 && seen.every(function (p) { return p.total === 0; }),
		JSON.stringify(seen.map(function (p) { return p.total; })));
}
{
	fakeFetch({ 'content-length': '10' }, [], 'reject');
	const seen = [];
	await runLoad(function (p) { seen.push(p); });
	ok('a fetch that fails reports nothing and is not the loader\'s answer', seen.length === 0,
		seen.length + ' calls');
}
{
	fakeFetch({ 'content-length': '10' }, [10], 'nobody');
	const seen = [];
	await runLoad(function (p) { seen.push(p); });
	ok('a reply with no streaming body reports nothing rather than guessing', seen.length === 0,
		seen.length + ' calls');
}
{
	// OPT-IN PER CALL. Every harness and every caller that wants no indicator must pay no second
	// request, which is the whole reason the progress pass is a parameter and not the default.
	let called = 0;
	global.fetch = function () { called++; return Promise.reject(new Error('no')); };
	await runLoad(undefined);
	ok('no callback means no fetch at all, so nothing is requested twice', called === 0, called);
}
global.fetch = realFetch;

// ---------------------------------------------------------------------------------------------
// THE BANNER HALF. The real loader is replaced by a gate the test opens by hand, because a real
// load would resolve before the banner could be read.
// ---------------------------------------------------------------------------------------------
let loads = 0, gate = null, prog = null;
function fakeLoader() {
	loads = 0; gate = null; prog = null;
	global.EngCalcs.lpnEpanetLoad = function (url, onProgress) {
		loads++; prog = onProgress;
		return new Promise(function (res, rej) { gate = { res: res, rej: rej }; });
	};
}
function line(L) {
	const d = L.getDoc();
	d.nodes.length = 0; d.links.length = 0; d.labels.length = 0;
	d.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	d.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	d.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: 200, _roughness: 130, _length: 1000, _k: 0, _status: 'open' });
	return d;
}
function withPrv(L) {
	const d = line(L);
	d.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 0 });
	d.links.push({ id: 'V1', type: 'valve', valveType: 'PRV', from: 'J1', to: 'J2', verts: [],
		_diameter: 200, _setting: 40, _k: 0, _status: 'open' });
	return d;
}
// **ONE INSTANCE PER SCENARIO.** epanetWarmState leaves 'cold' once and never returns, which is
// the point of it, so a second scenario in the same instance would be testing nothing.
function fresh() {
	const L = loadLoopedNetwork(INJECT);
	L.buildLayers();
	L.seedDefaultInputs();
	delete global.EngCalcs.lpnSolveEpanet;   // the page must not reach the real bridge here
	if (bannerEl) { bannerEl.textContent = ''; }
	return L;
}

console.log('\n--- the ordinary network whose answer is the one still arriving ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'epanet';
	line(L);
	L.runSolve();
	ok('the fetch started', loads === 1, loads + ' fetches');
	ok('a progress callback was handed to it', typeof prog === 'function', typeof prog);
	ok('the banner is Tom\'s own sentence', banner() === PC.lpn_engine_wait, JSON.stringify(banner()));

	prog({ loaded: 0, total: 678695 });
	ok('...and zero percent is shown, not hidden',
		banner() === PC.lpn_engine_wait + ' ' + pct(0), JSON.stringify(banner()));
	prog({ loaded: 339347, total: 678695 });
	ok('...half way through it says so',
		banner() === PC.lpn_engine_wait + ' ' + pct(49), JSON.stringify(banner()));
	prog({ loaded: 678695, total: 678695 });
	ok('...and the last chunk reads a hundred',
		banner() === PC.lpn_engine_wait + ' ' + pct(100), JSON.stringify(banner()));

	// **THE PAGE IS NOT FROZEN, WHICH IS WHAT "Continue working" PROMISES.** The banner is a live
	// region rather than anything modal, the document still takes edits, and the load is still
	// outstanding while both are true.
	// Read from the PAGE SOURCE, because the DOM stub builds this element by id and never sees the
	// attributes the markup carries. A live region announces itself and leaves the page alone; a
	// dialog would take the focus and make "Continue working" false.
	ok('the banner is a status region and not a dialog',
		/id="lpn_engine_banner"[^>]*role="status"/.test(PAGE) &&
		!/id="lpn_engine_banner"[^>]*(aria-modal|role="(dialog|alertdialog)")/.test(PAGE),
		'Looped-Network.php');
	const before = L.getDoc().nodes.length;
	L.getDoc().nodes.push({ id: 'J9', type: 'junction', x: 700, y: 120, elev: 5, _demand: 1 });
	L.runSolve();
	ok('an edit made during the wait is taken', L.getDoc().nodes.length === before + 1,
		L.getDoc().nodes.length);
	ok('...and the engine is still in flight while it is taken', loads === 1 && gate !== null);
	ok('...and the wait is still on screen', banner().indexOf(PC.lpn_engine_wait) === 0,
		JSON.stringify(banner()));

	gate.res({});
	await settle();
	ok('the banner goes away when the engine lands', banner() === '', JSON.stringify(banner()));
}

console.log('\n--- nobody is waiting: the built-in solver is the one answering ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'native';
	line(L);
	L.runSolve();
	ok('the background fetch still starts', loads === 1, loads + ' fetches');
	ok('...and says nothing, because the answers are already on screen', banner() === '',
		JSON.stringify(banner()));
	prog({ loaded: 100, total: 1000 });
	ok('...not even a percentage, which would be a wait nobody is in', banner() === '',
		JSON.stringify(banner()));
}

console.log('\n--- a network only EPANET can solve keeps its own stronger sentence ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'native';
	withPrv(L);
	L.runSolve();
	ok('the banner is the needs-the-engine sentence', banner() === PC.lpn_engine_needed_loading,
		JSON.stringify(banner()));
	prog({ loaded: 250000, total: 1000000 });
	ok('...and it carries the same percentage',
		banner() === PC.lpn_engine_needed_loading + ' ' + pct(25), JSON.stringify(banner()));
	gate.rej(new Error('offline'));
	await settle();
	ok('a failure replaces the whole thing, percentage included',
		banner() === PC.lpn_engine_needed_failed, JSON.stringify(banner()));
}

console.log('\n--- and when the size was never stated ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'epanet';
	line(L);
	L.runSolve();
	prog({ loaded: 0, total: 0 });
	ok('nothing is claimed before a single byte has arrived', banner() === PC.lpn_engine_wait,
		JSON.stringify(banner()));
	prog({ loaded: 204800, total: 0 });
	ok('the kilobytes are reported, and no percentage is invented',
		banner() === PC.lpn_engine_wait + ' ' + kb(200), JSON.stringify(banner()));
	// A TOTAL THAT IS WRONG MUST NOT PRINT 140%. Clamped, because "nearly there" is at least a
	// reading a person can act on, where arithmetic nobody believes is not.
	prog({ loaded: 900, total: 500 });
	ok('an understated total is clamped rather than printed',
		banner() === PC.lpn_engine_wait + ' ' + pct(100), JSON.stringify(banner()));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });

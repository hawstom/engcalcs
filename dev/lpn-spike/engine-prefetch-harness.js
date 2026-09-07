// THE EPANET ENGINE IS FETCHED BEFORE ANYBODY IS WAITING FOR IT -- ROADMAP Task 608. Run with:
//   node dev/lpn-spike/engine-prefetch-harness.js
//
// WHY THIS EXISTS. Task 605 made the EPANET solver the page default, and js/vendor/epanet-js.js is
// 664 KB that the service worker deliberately does not precache -- so a first-time visitor drawing
// an ordinary network of pipes and junctions now waits for the whole file at their first solve,
// having asked for nothing. Tom, 2026-09-06: *"Whoops. I didn't consider that. how about (1) We
// always start, if not present, an EPANET fetch in the background as soon as there is a solveable
// network or a Calculate demand. (2) If there is anything that the built-in solver can't handle, we
// disable the built-in solver and we show a banner ... while it fetches?"*
//
// **THE TWO HALVES FAIL IN OPPOSITE DIRECTIONS, WHICH IS WHY THEY ARE ASSERTED SEPARATELY.**
//   * Part 1 fails by being NOISY or by firing too often: a background fetch nobody asked for that
//     announces itself, or one that starts again on every keystroke. So the assertions are a count
//     and an ABSENCE of text, not the presence of anything.
//   * Part 2 fails by being SILENT: a checkbox that greys out with no reason, or a wait with no
//     banner. And it has one way of failing that nothing on screen would show -- rewriting
//     `settings.engine`, which Task 602 forbids, because the setting is the user's PREFERENCE and
//     the routing is a FACT ABOUT THIS NETWORK. That one is asserted as an absence, the way
//     engine-checkbox-harness.js asserts the migration that was not written.
//
// **EACH SCENARIO GETS ITS OWN loadLoopedNetwork().** `epanetWarmState` is module state that leaves
// 'cold' once and never returns, which is the whole point of it -- so a test of the cold path after
// a test of the warm one would be testing nothing. A second instance has never seen the first.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\thydraulicsFieldsEl: function () { return document.getElementById('lpn_set_hydraulics_fields'); },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const PC = global.EngCalcs.pageConfig || {};
// Read for one ABSENCE assertion below: a key nobody renders is 27 strings maintained for nothing.
const LANG_EN = require('fs').readFileSync(require('path').resolve(__dirname, '..', '..', 'lib/lang.ec.en.php'), 'utf8');
const doc$ = global.document;
const noticeEl = doc$.getElementById('lpn_map_notice');
const bannerEl = doc$.getElementById('lpn_engine_banner');
function notice() { return (noticeEl && noticeEl.textContent) || ''; }
function banner() { return (bannerEl && bannerEl.textContent) || ''; }
function clearOverlays() {
	if (noticeEl) { noticeEl.textContent = ''; }
	if (bannerEl) { bannerEl.textContent = ''; }
}

function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}
// The engine row's checkbox, found BY ITS LABEL -- a row inserted above it must not silently move
// the assertion onto "Recalculate automatically", which is also a checkbox. Same walk
// engine-checkbox-harness.js uses.
const ENGINE_LABEL = PC.lpn_settings_engine_native;
function engineBox(L) {
	let hit = null;
	(function walk(n) {
		if (hit || !n || !n.children) { return; }
		for (const c of n.children) {
			if (c.className === 'lpn-set-row' && allText(c).indexOf(ENGINE_LABEL) !== -1) {
				hit = (c.children || []).filter(function (k) { return k.tagName === 'INPUT'; })[0] || null;
				if (hit) { return; }
			}
			walk(c);
			if (hit) { return; }
		}
	})(L.hydraulicsFieldsEl());
	return hit;
}
// Every settings NOTE in the hydraulics section, joined. The reason under a disabled control has to
// be findable by its words, not by its position.
function hydraulicsNotes(L) {
	const out = [];
	(function walk(n) {
		if (!n || !n.children) { return; }
		for (const c of n.children) {
			if (c.className === 'lpn-set-note') { out.push(allText(c)); }
			walk(c);
		}
	})(L.hydraulicsFieldsEl());
	return out.join(' | ');
}

// A CONTROLLABLE FETCH. The real EngCalcs.lpnEpanetLoad imports 664 KB and resolves; what every
// assertion below is about is WHEN it is called, HOW OFTEN, and what is on screen while it has not
// answered yet -- none of which the real one can be asked. It is replaced rather than wrapped
// because a real load would resolve before the banner could be read.
let loads = 0, gate = null;
function fakeLoader() {
	loads = 0; gate = null;
	global.EngCalcs.lpnEpanetLoad = function () {
		loads++;
		return new Promise(function (res, rej) { gate = { res: res, rej: rej }; });
	};
}
function settle() { return new Promise(function (r) { setTimeout(r, 0); }); }

// A plain reservoir-pipe-junction line, written straight into the document the way
// engine-route-harness.js does. SI strip units (mm, m, L/s): the document stores what the user
// typed and the solver is the one that converts.
function line(L) {
	const d = L.getDoc();
	d.nodes.length = 0; d.links.length = 0; d.labels.length = 0;
	d.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	d.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	d.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: 200, _roughness: 130, _length: 1000, _k: 0, _status: 'open' });
	return d;
}
// The same line with a PRV on the far end -- an active valve, which only EPANET switches. It may
// not sit on a fixed head (EPANET input error 219), hence the second junction.
function withPrv(L) {
	const d = line(L);
	d.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 0 });
	d.links.push({ id: 'V1', type: 'valve', valveType: 'PRV', from: 'J1', to: 'J2', verts: [],
		_diameter: 200, _setting: 40, _k: 0, _status: 'open' });
	return d;
}
function fresh() {
	const L = loadLoopedNetwork(INJECT);
	L.buildLayers();
	L.seedDefaultInputs();
	// **EPANET IS NOT ALLOWED TO ANSWER IN THIS HARNESS.** runSolveEpanet() would otherwise reach
	// the real bridge, which loads the engine through its own path -- a second caller of the thing
	// being counted. Removing it is exactly what runSolve() sees before the engine has arrived,
	// which is the state every assertion here is about.
	delete global.EngCalcs.lpnSolveEpanet;
	clearOverlays();
	return L;
}

async function main() {

console.log('=== Task 608: the EPANET fetch starts before anybody is waiting ===');
setUnitSet('si');

// ------------------------------------------------------------------------------------------
// 0. THE PREDICATE, AND IT IS ONE PREDICATE
// ------------------------------------------------------------------------------------------
// EngCalcs.lpnIsSolveable is the single definition the page reuses; it borrows lpnDiagnose()'s own
// engine-independent refusal rather than growing a second opinion about what a solve needs.
console.log('\n--- EngCalcs.lpnIsSolveable ---');
const S = global.EngCalcs.lpnIsSolveable;
ok('the predicate exists at all', typeof S === 'function');
ok('an empty model is not solveable', S({ nodes: [], links: [] }) === false);
ok('a reservoir with nothing attached is not solveable -- a head with no link is not a question',
	S({ nodes: [{ id: 'R1', type: 'reservoir', head: 30 }], links: [] }) === false);
ok('two junctions and a pipe are not solveable -- no fixed head anywhere',
	S({
		nodes: [{ id: 'J1', type: 'junction' }, { id: 'J2', type: 'junction' }],
		links: [{ id: 'L1', type: 'pipe', from: 'J1', to: 'J2' }]
	}) === false);
ok('one fixed head and one link IS solveable',
	S({
		nodes: [{ id: 'R1', type: 'reservoir', head: 30 }, { id: 'J1', type: 'junction' }],
		links: [{ id: 'L1', type: 'pipe', from: 'R1', to: 'J1' }]
	}) === true);
ok('a link with an end that is in no node is not solveable -- lpnDiagnose names it dangling',
	S({
		nodes: [{ id: 'R1', type: 'reservoir', head: 30 }],
		links: [{ id: 'L1', type: 'pipe', from: 'R1', to: 'GONE' }]
	}) === false);

// ------------------------------------------------------------------------------------------
// 1. AN EMPTY DOCUMENT STARTS NOTHING
// ------------------------------------------------------------------------------------------
console.log('\n--- nothing drawn yet ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'native';
	L.runSolve();
	ok('an empty document does not fetch the engine', loads === 0, loads + ' fetches');

	// Nor does a drawing that is not yet a network. This is the case a naive "the document is not
	// empty" test would get wrong, and it is most of the time somebody spends drawing.
	const d = L.getDoc();
	d.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	d.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	L.runSolve();
	ok('two nodes with no pipe between them do not fetch it either', loads === 0, loads + ' fetches');
	ok('...and nothing was said about any of it', notice() === '' && banner() === '',
		JSON.stringify([notice(), banner()]));
}

// ------------------------------------------------------------------------------------------
// 2. A SOLVEABLE NETWORK DOES, ONCE, AND SILENTLY
// ------------------------------------------------------------------------------------------
console.log('\n--- the drawing becomes a network ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'native';   // so the solve itself never reaches for EPANET
	line(L);
	L.runSolve();
	ok('a solveable network starts the fetch', loads === 1, loads + ' fetches');
	// PART 1 IS SILENT. Tom asked for a background fetch, not a message; the only banner he asked
	// for is Part 2's, and this network does not need EPANET at all.
	ok('...and says nothing on the map', notice() === '', JSON.stringify(notice()));
	ok('...and shows no banner', banner() === '', JSON.stringify(banner()));

	// THE DEBOUNCE, ASSERTED AS A COUNT. Every edit reaches runSolve() through scheduleSolve()'s
	// 300 ms timer, so what has to hold here is that repeated arrivals do not repeat the fetch.
	L.runSolve(); L.runSolve(); L.runSolve();
	ok('four solves later it has still been fetched once', loads === 1, loads + ' fetches');

	// AND THE FAILURE IS SILENT TOO, on this path: nobody asked, so nobody is owed a report.
	gate.rej(new Error('offline'));
	await settle();
	ok('a background fetch that fails says nothing either', notice() === '' && banner() === '',
		JSON.stringify([notice(), banner()]));
	// AND IT DOES NOT COME BACK. warmEpanetEngine() deliberately retries after a failure when a
	// user touches a valve -- that is their moment and they are online again. The BACKGROUND leg
	// must not, or every keystroke on a network drawn offline is another failed 664 KB request.
	L.runSolve(); L.runSolve();
	ok('...and solving again does not start it over', loads === 1, loads + ' fetches');
}

// ------------------------------------------------------------------------------------------
// 3. A NETWORK ONLY EPANET CAN SOLVE: THE CHECKBOX AND THE BANNER
// ------------------------------------------------------------------------------------------
console.log('\n--- a PRV, which the built-in solver does not switch ---');
{
	fakeLoader();
	const L = fresh();
	// 'native' ON PURPOSE. It is the value that makes the next assertion mean something: if the
	// page wrote settings.engine to force the routing, this is where it would show.
	L.settings().engine = 'native';
	withPrv(L);
	L.runSolve();

	ok('the fetch started for it', loads === 1, loads + ' fetches');
	ok('the banner is Tom\'s own sentence, and it is the shipped string',
		banner() === PC.lpn_engine_needed_loading, JSON.stringify(banner()));
	ok('...which says results are coming when the load finishes',
		/Results will be available when completely loaded/.test(banner()), JSON.stringify(banner()));

	L.rebuildSettingsFields();
	const box = engineBox(L);
	ok('the settings panel still renders the engine checkbox', !!box);
	// **NOT DISABLED, AND THIS ASSERTION IS A REVERSAL** (Tom, 2026-09-06). It shipped disabled for
	// one round on his own instruction and he withdrew it: the tip on this very row already names
	// both cases permanently, so the greying was a conditional duplicate of a permanent telling --
	// bought at the price of a control that flickers as you draw, and of the user losing the one
	// thing the box is for, which is saying what they want for the network's OTHER states.
	ok('...and it is NOT disabled, because three other things already say this', !!box && box.disabled === false,
		box && box.disabled);
	ok('...and the tip is where that fact lives permanently',
		/PRV, PSV, or FCV/.test(PC.lpn_settings_engine_native_tip || ''), 'tip names the valve case');
	ok('...and names the other case too',
		/extended period run/.test(PC.lpn_settings_engine_native_tip || ''), 'tip names the EPS case');
	// The note that explained the greying went with the greying. Asserted as an ABSENCE, because a
	// key nobody renders is 27 strings maintained for nothing.
	ok('...and the note that explained the greying is gone from the file',
		!/lpn_settings_engine_native_off/.test(LANG_EN), 'no such key in lang.ec.en.php');

	// **THE ABSENCE THAT MATTERS.** Task 602: the setting is a preference, the routing is a fact
	// about this network. Nothing here may write to settings.engine -- not the disabling, not the
	// banner, not the fetch -- or the user's stored choice is silently rewritten by a valve.
	ok('settings.engine was NOT rewritten', L.settings().engine === 'native', L.settings().engine);
	ok('...and a project saved right now still states it',
		L.serializeProject().settings.engine === 'native', L.serializeProject().settings.engine);

	// THE BANNER IS A WAIT, SO IT ENDS WHEN THE WAIT DOES.
	gate.res({});
	await settle();
	ok('the banner clears when the engine arrives', banner() === '', JSON.stringify(banner()));

	// AND THE NETWORK GOING BACK TO ORDINARY CHANGES NOTHING ABOUT THE BOX, which is the point of
	// not disabling it: there is no state to come back from.
	const d = L.getDoc();
	d.links.pop(); d.nodes.pop();          // the PRV and the junction beyond it
	L.runSolve();
	L.rebuildSettingsFields();
	ok('deleting the valve leaves the checkbox exactly as it was',
		!!engineBox(L) && engineBox(L).disabled === false, engineBox(L) && engineBox(L).disabled);
	ok('...and the user\'s choice is still their own', L.settings().engine === 'native', L.settings().engine);
}

// ------------------------------------------------------------------------------------------
// 4. THE ONE FAILURE A BACKGROUND FETCH IS ENTITLED TO REPORT
// ------------------------------------------------------------------------------------------
// Silence is right everywhere in section 2 and wrong here: this network has no answers at all
// without the engine, so a blank map with no reason given is the page failing quietly.
console.log('\n--- and when it cannot be fetched at all ---');
{
	fakeLoader();
	const L = fresh();
	L.settings().engine = 'native';
	withPrv(L);
	L.runSolve();
	ok('the wait is on screen while it tries', banner() === PC.lpn_engine_needed_loading, JSON.stringify(banner()));
	gate.rej(new Error('offline'));
	await settle();
	ok('a failure the reader IS subject to replaces it',
		banner() === PC.lpn_engine_needed_failed, JSON.stringify(banner()));
	ok('...and it says the network cannot be solved without the engine',
		/can only be solved by it/.test(banner()), JSON.stringify(banner()));
	ok('...and still nothing was written to the one-shot notice', notice() === '', JSON.stringify(notice()));
	ok('...and settings.engine is still the user\'s', L.settings().engine === 'native', L.settings().engine);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });

// A DIGIT PICKS A TOOL -- ROADMAP Task 595. Run with:
//   node dev/lpn-spike/tool-keys-harness.js
//
// **WHY THIS EXISTS.** `lpn_` had exactly one door to a new asset: a pointer click on the toolbar
// followed by a click on the canvas. The `data-entry-clerk` seat asked for a keyboard door and Tom
// asked for it on the roadmap; what it needed was WHICH KEYS, and the answer is not ours.
//
// **THE NUMBERS ARE epanet-js's** (Tom, 2026-09-06, read out of the running product): 1 Select,
// 2 Junction, 3 Reservoir, 4 Tank, 5 Pipe, 6 Pump, 7 Valve, 8 Customer. We bind every object we
// share to the same digit they do, so an EPANET user's fingers already know this page -- which is
// the whole value, and the reason section 1 asserts the exact mapping rather than "some digit works".
//
// **8 IS ASSERTED EMPTY, and that is the assertion most likely to be deleted by somebody in a
// hurry.** It is epanet-js's Customer, which is our Task 247. Binding it to anything else now means
// moving a key people have already learned. A test that says "8 does nothing" looks pointless until
// the day it stops being true.
//
// **THE FOUR WAYS THIS GOES WRONG, which is why each section is shaped as it is:**
//   1. A digit fires while somebody is TYPING. The cheapest key to press by accident, and Tom's own
//      report is exactly this shape ("It was scary when I entered an unknown node"). Asserted
//      against the real guard, `isTextEntry()`, on input, textarea, select and contenteditable.
//   2. A digit steals a browser chord. Ctrl/Alt/Meta+digit switches tabs on every desktop platform.
//      Asserted: a modified digit is ignored.
//   3. The mapping drifts from the toolbar. The key IS the toolbar's own position, so a key that
//      sets a mode no toolbar button offers is a mode nobody can leave by mouse.
//   4. It is not muffleable. A binding nobody presses must cost a person who never presses it
//      exactly nothing -- so it must call the SAME setMode() the buttons call, creating nothing.

'use strict';

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetMode: function () { return mode; }, setMode: setMode,\n" +
	"\t\ttoolKeys: function () { return LPN_TOOL_KEYS; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// Drive the page's own keydown listeners, the way the browser would.
function press(key, opts) {
	const e = Object.assign({ key: key, target: null, preventDefault: function () { this._d = true; } }, opts || {});
	(global.document._listeners.keydown || []).slice().forEach(function (f) { f(e); });
	return e;
}

console.log('1. THE MAPPING IS epanet-js\'s, DIGIT FOR DIGIT');
{
	const want = { '1': 'select', '2': 'add-junction', '3': 'add-reservoir', '4': 'add-tank',
		'5': 'add-pipe', '6': 'add-pump', '7': 'add-valve', '9': 'add-text' };
	Object.keys(want).forEach(function (k) {
		L.setMode('select');
		press(k);
		ok('"' + k + '" selects ' + want[k], L.getMode() === want[k], L.getMode());
	});
	// **8 IS THEIRS FOR CUSTOMER (Task 247) AND MUST STAY FREE.** See the head of this file.
	L.setMode('select');
	press('8');
	ok('"8" is left unbound, reserved for Customer as epanet-js has it', L.getMode() === 'select', L.getMode());
	// A digit we never claimed must not do anything either.
	L.setMode('select');
	press('0');
	ok('"0" does nothing', L.getMode() === 'select', L.getMode());
}

console.log('\n2. A DIGIT NEVER FIRES WHILE SOMEBODY IS TYPING');
{
	// The real guard, on the four things it recognises. `select` is in the list because a native
	// <select> answers digits by jumping to an option starting with that character.
	[['input', {}], ['textarea', {}], ['select', {}], ['div', { isContentEditable: true }]]
		.forEach(function (pair) {
			L.setMode('select');
			press('2', { target: Object.assign({ tagName: pair[0].toUpperCase() }, pair[1]) });
			ok('a digit typed into a <' + pair[0] + '> does not switch tools', L.getMode() === 'select', L.getMode());
		});
	// And the same key with nothing focused still works, or the guard has eaten the feature.
	L.setMode('select');
	press('2');
	ok('...while the same key with nothing focused still works', L.getMode() === 'add-junction', L.getMode());
}

console.log('\n3. A MODIFIED DIGIT BELONGS TO THE BROWSER');
{
	[['ctrlKey'], ['metaKey'], ['altKey']].forEach(function (mod) {
		L.setMode('select');
		const o = {}; o[mod[0]] = true;
		press('2', o);
		ok(mod[0] + '+2 is left to the browser', L.getMode() === 'select', L.getMode());
	});
}

console.log('\n4. EVERY KEY NAMES A MODE THE TOOLBAR ALSO OFFERS');
{
	// The key IS the toolbar's position, so a key that reaches a mode no button offers would be a
	// mode a mouse user cannot leave. Read off the page's own source rather than a second list.
	const fs = require('fs');
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const keys = L.toolKeys();
	Object.keys(keys).forEach(function (k) {
		const m = keys[k];
		ok('"' + k + '" -> ' + m + ', which the toolbar also sets',
			src.indexOf("mode: '" + m + "'") >= 0 || src.indexOf("setMode('" + m + "')") >= 0);
	});
	ok('and nothing is bound that is not a mode', Object.keys(keys).every(function (k) {
		return typeof keys[k] === 'string' && keys[k].length > 0;
	}));
}

console.log(fails === 0 ? '\ntool keys harness: all checks passed'
	: `\ntool keys harness: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);

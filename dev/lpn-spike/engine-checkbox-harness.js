// THE ENGINE CHECKBOX IS DISPLAYED THE OTHER WAY ROUND FROM THE WAY IT IS STORED (Task 602), AND
// SINCE TASK 605 THE DEFAULT IS EPANET AND NOTHING MIGRATES A SAVED FILE. Run with:
//   node dev/lpn-spike/engine-checkbox-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-06: *"This is really a choice about the built-in solver. They
// don't get a choice about the EPANET solver."* The row used to read "Solve with the EPANET
// solver", so an unticked box read as "never EPANET" -- false on two paths the user does not
// control, since an extended-period run and an active PRV/PSV/FCV go to EPANET whatever the box
// says. The label now names what is actually being decided, and the box means the opposite of
// what it used to.
//
// **THE STORED VOCABULARY DID NOT MOVE, AND THAT IS THE THING THAT CAN REGRESS.** `settings.engine`
// is still `epanet`/`native` in every saved project, so a future edit that "tidies" the polarity
// by flipping the stored value instead of the rendered one would silently reverse the meaning of
// every file anybody has already saved -- and nothing on screen would look different to whoever
// made the change. So the assertions are in two halves and both matter: what the CONTROL shows for
// a given stored value, and what a serialize/applySaved ROUND TRIP carries back.
//
// Deliberately not asserted here: which engine actually solves. That is
// dev/lpn-spike/engine-route-harness.js, and it observes physics rather than a flag.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\thydraulicsFieldsEl: function () { return document.getElementById('lpn_set_hydraulics_fields'); },\n" +
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
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}
// The stub has no dispatchEvent; listeners are called directly, exactly as the other harnesses do.
function fire(el, type) {
	(el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); });
}
// Find the engine row's checkbox BY ITS LABEL, not by position: a row inserted above it must not
// silently move the assertion onto "Recalculate automatically", which is also a checkbox.
const LABEL = (global.EngCalcs.pageConfig || {}).lpn_settings_engine_native;
function engineBox() {
	const body = L.hydraulicsFieldsEl();
	let hit = null;
	(function walk(n) {
		if (hit || !n || !n.children) { return; }
		for (const c of n.children) {
			if (c.className === 'lpn-set-row' && allText(c).indexOf(LABEL) !== -1) {
				hit = (c.children || []).filter(function (k) { return k.tagName === 'INPUT'; })[0] || null;
				if (hit) { return; }
			}
			walk(c);
			if (hit) { return; }
		}
	})(body);
	return hit;
}

console.log('=== Task 602: engine checkbox polarity ===');

setUnitSet('us');
L.reset();
openExample(L);

// ---- 0. The label is the one the user was given, and it names the BUILT-IN solver -------------
// Read out of the language file rather than typed here, so a reworded string does not quietly turn
// the rest of this harness into a search for something that no longer exists.
ok('the row has a label at all', typeof LABEL === 'string' && LABEL.length > 0, LABEL);
ok('the label names the built-in solver, not EPANET',
	/built-in/i.test(LABEL || '') && !/EPANET/i.test(LABEL || ''), LABEL);

// ---- 1. A project stored on EPANET renders the box UNCHECKED ---------------------------------
L.setEngine('epanet');
L.rebuildSettingsFields();
let box = engineBox();
ok('the settings panel renders the engine checkbox', !!box);
ok('engine "epanet" renders the box unchecked', !!box && box.checked === false, box && box.checked);

// ---- 2. A project stored on the built-in solver renders it CHECKED ----------------------------
L.setEngine('native');
L.rebuildSettingsFields();
box = engineBox();
ok('engine "native" renders the box checked', !!box && box.checked === true, box && box.checked);

// ---- 3. Ticking and unticking write back the ORIGINAL vocabulary ------------------------------
// The whole point: the control is inverted and the stored words are not. A change here that wrote
// `true`/`false`, or `builtin`, would pass every visual check and break every saved file.
box.checked = false; fire(box, 'change');
ok('unticking stores the string "epanet"', L.settings().engine === 'epanet', L.settings().engine);
box.checked = true; fire(box, 'change');
ok('ticking stores the string "native"', L.settings().engine === 'native', L.settings().engine);

// ---- 4. The ROUND TRIP -- what a saved project carries and what it renders as -----------------
// serializeProject() then applySaved() is the assertion that matters: it is the path a file
// actually takes, so a stored-polarity flip shows up here and nowhere else.
['epanet', 'native'].forEach(function (engine) {
	L.setEngine(engine);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('a saved project states engine "' + engine + '" verbatim',
		!!saved.settings && saved.settings.engine === engine, saved.settings && saved.settings.engine);
	L.reset();
	L.applySaved(saved);
	L.buildDom();
	ok('reopening it restores engine "' + engine + '"', L.settings().engine === engine, L.settings().engine);
	L.rebuildSettingsFields();
	const b = engineBox();
	ok('...and the box reads ' + (engine === 'epanet' ? 'unchecked' : 'checked'),
		!!b && b.checked === (engine !== 'epanet'), b && b.checked);
});

// ---- 5. A project saved before this task, and one saved after, mean the same thing ------------
// The migration that was NOT done, asserted as an absence. A file written when the label said
// "Solve with the EPANET solver" states `engine: 'epanet'` when the user ticked that box, and it
// must still mean EPANET today -- the words on screen changed, the file did not.
const pre602 = JSON.parse(JSON.stringify(L.serializeProject()));
pre602.settings.engine = 'epanet';
L.reset();
L.applySaved(pre602);
L.buildDom();
ok('a pre-602 file stating "epanet" still selects EPANET', L.settings().engine === 'epanet', L.settings().engine);
L.rebuildSettingsFields();
ok('...and shows the built-in box unticked, which is what it now means',
	!!engineBox() && engineBox().checked === false);

// ---- 6. Task 605: EPANET IS THE DEFAULT, AND NOTHING MIGRATES -------------------------------
// Tom, 2026-09-06: *"'Always use the EPANET solver' is the page default."* The default moved from
// 'native' to 'epanet' in defaultSettings(), and the three things that could go wrong with that
// are asserted separately, because each fails silently on its own.
//
// The FIRST is the default itself, read out of defaultSettings() rather than out of a fresh
// project, so a reset that happened to leave a stale object behind cannot make it look right.
ok('a new project states engine "epanet"', L.defaultSettings().engine === 'epanet',
	L.defaultSettings().engine);
L.reset();
L.rebuildSettingsFields();
ok('...and a new project shows the built-in box unticked, which is what that means',
	!!engineBox() && engineBox().checked === false, engineBox() && engineBox().checked);

// The SECOND is the absence of a migration, and it is the mirror of section 5. A file saved when
// 'native' was the default states 'native' because that is what its author was solving with; the
// setting is a PREFERENCE and the routing is a fact about the network (Task 602's rule), so moving
// the default may not reach back into a file anybody has already saved. A "helpful" upgrade here
// would change every one of those files' answers with nothing on screen saying so.
const preDefault = JSON.parse(JSON.stringify(L.serializeProject()));
preDefault.settings.engine = 'native';
L.reset();
L.applySaved(preDefault);
L.buildDom();
ok('a file saved before the default moved still selects the built-in solver',
	L.settings().engine === 'native', L.settings().engine);
L.rebuildSettingsFields();
ok('...and still shows its box ticked', !!engineBox() && engineBox().checked === true);

// The THIRD is the banner. Tom, same message: *"No more banner about the EPANET solver."* The
// gallery's welcome line was, under Task 222, the one place this page said what engine it runs.
// The line stays -- a greeting is not an advertisement -- and the engine clause is gone. Asserted
// on the shipped English rather than on the rendered pane because the pane fetches a manifest;
// what the ruling is about is the sentence.
const WELCOME = (global.EngCalcs.pageConfig || {}).lpn_examples_welcome;
ok('the gallery still greets the visitor', typeof WELCOME === 'string' && WELCOME.length > 0, WELCOME);
ok('...and the greeting names no engine and no solver',
	!/EPANET/i.test(WELCOME || '') && !/solver/i.test(WELCOME || ''), WELCOME);

console.log(fails === 0 ? '\nAll checks passed.' : '\n' + fails + ' FAILURE(S).');
process.exit(fails === 0 ? 0 : 1);

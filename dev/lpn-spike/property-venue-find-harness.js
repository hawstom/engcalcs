// Headless check of the Task 708 gaps closed on feat/property-venue: Find and Replace rows for
// Active/Shut (any link), a junction's emitter coefficient, a tank's level/min level/max level/
// diameter/mixing model/mixing fraction, a pump's relative speed/energy price/energy price
// pattern, and Replace on a pipe's length.
//
//   node dev/lpn-spike/property-venue-find-harness.js
//
// WHY THIS EXISTS. dev/property-venue-matrix.md's ranked gaps (#2-#6) are now closed in
// findPropDefs()/findValueOf()/pushSpecList(), and dev/lpn-spike/replace-harness.js already covers
// the general Replace machinery (the count, Cancel, one undo step, the scenario seam). What that
// harness does NOT reach is the property-specific reasons several of these entries could not just
// reuse `prop`: `length` and `emitter` need their own `set` so a bypassed setProp() cannot skip
// `lenAuto` or the emitter's unit conversion, and `status`/`mixingModel` go through the new
// `choices` door in replaceValueOf() rather than the number/`str`/`text` ones. Each is asserted
// here for the one thing that would silently break it.
//
// Every element is FOUND before it is REPLACED, so a Find regression cannot hide behind a Replace
// pass that reads replaceSpecs() directly.

const { ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
ensure('lpn_find_form');
ensure('lpn_find_results');
// The real lib/lang.ec.en.php the stub loads, read once so this file never pins English wording
// as a literal (dev/scripts/harness_wording_check.php) -- and so the "restore English" step below
// puts back the actual current string rather than a copy typed here that could drift from it.
const PC_EN = global.EngCalcs.pageConfig;

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, effective: effective,\n" +
	"\t\tbuildDom: buildDom, baseValue: baseValue, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; }, clearUndo: clearUndo,\n" +
	"\t\tquery: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tvalueOf: function (scope, prop, id) { findState.scope = scope;\n" +
	"\t\t\tvar c = findCandidates().filter(function (x) { return x.el.id === id; })[0];\n" +
	"\t\t\treturn c ? findValueOf(c, prop) : undefined; },\n" +
	"\t\tsetReplace: function (prop, value) { replaceState.prop = prop; replaceState.value = value; },\n" +
	"\t\tspecFields: function (scope) { findState.scope = scope; return replaceSpecs().map(function (s) { return s.field; }); },\n" +
	"\t\tpreview: runReplacePreview, apply: applyReplace, cancel: cancelReplace,\n" +
	"\t\tpressFind: function () { runFind(); },\n" +
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
	// **THE ACTUAL SELECT-VALUED UI, DRIVEN AS A PERSON WOULD** (pre-review fix, Task 708): the
	// panel is BUILT (rebuildFindForm(), the real function, into the real #lpn_find_form), the
	// options a reader would see are read off the rendered <select> rather than off findChoiceDefs()
	// directly -- which would pass even if renderFindControls() never called it -- and choosing one
	// fires the same 'change' handler a click does.
	"\t\tbuildPanel: rebuildFindForm,\n" +
	"\t\tsetFindState: function (scope, prop, op, value) { findState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value; },\n" +
	"\t\tsetWord: function (key, value) { EngCalcs.pageConfig[key] = value; },\n" +
	// The Nth <select> under one root, in document order -- root is findControlsBox (scope,
	// property, condition, then the value select when the property is a choice) or replaceBox
	// (the property-to-change select, then the value select).
	"\t\tselectAt: function (root, n) { var out = null, i = 0;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (c._tag === 'select') { i++; if (i === n) { out = c; } } walk(c); }); })(root);\n" +
	"\t\t\treturn out; },\n" +
	"\t\tfindControlsBox: function () { return findControlsBox; },\n" +
	"\t\treplaceBox: function () { return replaceBox; },\n" +
	"\t\tselectOptions: function (sel) { return sel ? sel.children.map(function (o) { return [o.value, o.textContent]; }) : null; },\n" +
	"\t\tchooseOption: function (sel, v) { sel.value = v;\n" +
	"\t\t\t(sel._listeners && sel._listeners.change || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tresultRows: function () { var out = [];\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (c._tag === 'button') { out.push(c.textContent); } walk(c); }); })(document.getElementById('lpn_find_results'));\n" +
	"\t\t\treturn out; },\n" +
	// The Settings box's "New assets" section and its one push button -- for the guard added
	// beside pushFieldShown() at that button's own filter (Task 708 pre-review).
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettingsDefaults: function () { return settings.defaults; },\n" +
	"\t\tclick: function (elem) { (elem._listeners && elem._listeners.click || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tfirstButtonIn: function (root) { var out = null;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (!out && c._tag === 'button') { out = c; } walk(c); }); })(root);\n" +
	"\t\t\treturn out; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; findState = { scope: 'all', prop: 'id', op: 'contains', value: '' };\n" +
	"\t\t\treplaceState = { prop: '', value: '' }; replacePending = null; replaceMsgBox = null;\n" +
	"\t\t\tundoStack.length = 0;\n" +
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
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
ensure('lpn_toolbar').querySelectorAll = () => [];

function linkOf(id) { return L.getDoc().links.filter(l => l.id === id)[0]; }
function nodeOf(id) { return L.getDoc().nodes.filter(n => n.id === id)[0]; }

function build(unitSet) {
	setUnitSet(unitSet || 'us');
	L.reset();
	const r = L.addNode('reservoir', 0, 0).id;
	const j1 = L.addNode('junction', 100, 0).id;
	const j2 = L.addNode('junction', 200, 0).id;
	const t = L.addNode('tank', 300, 0).id;
	const p1 = L.addLink('pipe', r, j1).id;
	const p2 = L.addLink('pipe', j1, j2).id;
	const pump = L.addLink('pump', j2, t).id;
	L.buildDom();
	return { r: r, j1: j1, j2: j2, t: t, p1: p1, p2: p2, pump: pump };
}

// ---- 1. ACTIVE/SHUT (gap #2), on a pipe AND a pump, base and inside a scenario -------------------
{
	console.log('\n--- status: found and replaced as open/closed ---');
	const n = build();
	L.setProp(linkOf(n.p2), 'status', 'closed');
	ok('Find locates the closed pipe and not the open one',
		JSON.stringify(L.query('pipe', 'status', 'equals', 'closed')) === JSON.stringify(['link:' + n.p2]),
		JSON.stringify(L.query('pipe', 'status', 'equals', 'closed')));
	ok('...and the case of the typed word does not matter',
		JSON.stringify(L.query('pipe', 'status', 'equals', 'Closed')) === JSON.stringify(['link:' + n.p2]));
	ok('the open pipe reads back as the word "open", not a number',
		L.valueOf('pipe', 'status', n.p1) === 'open', String(L.valueOf('pipe', 'status', n.p1)));
	// A typo is refused rather than silently matched or silently written.
	L.query('pipe', 'status', 'equals', 'open');
	L.setReplace('status', 'clsoed');
	L.preview();
	ok('a misspelled status is refused, not written as a fourth state',
		L.pending() === null, JSON.stringify(L.pending()));
	L.setReplace('status', 'CLOSED');
	L.preview();
	ok('...but a valid word in any case previews the one open pipe',
		L.pending() && L.pending().length === 1 && L.pending()[0] === 'link:' + n.p1,
		JSON.stringify(L.pending()));
	const changed = L.apply();
	ok('the write reports one change and stores the lowercase token',
		changed === 1 && linkOf(n.p1)._status === 'closed', String(linkOf(n.p1)._status));
	ok('exactly one undo step covers the whole write', L.undoDepth() === 1, String(L.undoDepth()));
	L.undo();
	ok('...and undo reopens it', linkOf(n.p1)._status === 'open');

	// The scenario seam: a status write inside a scenario must record an override and leave Base
	// alone, the same rule replace-harness.js already proves for diameter.
	const scn = L.createScenario('Outage');
	L.switchScenario(scn.id !== undefined ? scn.id : scn);
	L.query('pump', 'status', 'equals', 'open');
	L.setReplace('status', 'closed');
	L.preview();
	L.apply();
	ok('a pump shut inside a scenario is an override, not a Base write',
		L.effective(linkOf(n.pump), 'status') === 'closed' &&
		L.baseValue(linkOf(n.pump), 'status') === 'open' &&
		L.hasOverride(linkOf(n.pump), 'status') === true);
}

// ---- 2. THE EMITTER COEFFICIENT (gap #3), crossing its own unit -----------------------------------
{
	console.log('\n--- emitter: found and replaced through its own unit ---');
	const n = build();
	L.setProp(nodeOf(n.j1), 'emitter', 5);   // emitterToStore()'s SI-ish internal representation
	ok('a junction stating an emitter coefficient is findable above 0',
		JSON.stringify(L.query('junction', 'emitter', 'gt', '0')) === JSON.stringify(['node:' + n.j1]),
		JSON.stringify(L.query('junction', 'emitter', 'gt', '0')));
	ok('a junction with none states nothing (empty, not zero)',
		JSON.stringify(L.query('junction', 'emitter', 'empty', '')).indexOf('"node:' + n.j2 + '"') >= 0);
	L.query('junction', 'emitter', 'gt', '0');
	L.setReplace('emitter', '8');
	L.preview();
	L.apply();
	// **THE ASSERTION THAT WOULD FAIL IF replaceWrite() EVER TOOK THE setProp() SHORTCUT FOR THIS
	// SPEC**: a plain setProp('emitter', 8) would store the DISPLAYED 8 raw, and reading it back
	// through emitterToDisplay(effective(...)) would then answer something other than 8 (the
	// display/store pair is not the identity function once a pressure or flow unit is non-1).
	ok('the round trip through emitterToStore()/emitterToDisplay() returns exactly what was typed',
		Math.abs(L.valueOf('junction', 'emitter', n.j1) - 8) < 1e-9,
		String(L.valueOf('junction', 'emitter', n.j1)));
}

// ---- 3. PIPE LENGTH IS NOW WRITABLE (gap #6), and clears lenAuto in Base --------------------------
{
	console.log('\n--- length: replaceable, and Auto turns off in Base ---');
	['us', 'si'].forEach(function (unitSet) {
		const n = build(unitSet);
		ok('length is findable before it is replaceable (unchanged behaviour)',
			L.query('pipe', 'length', 'gt', '0').length === 2);
		L.query('pipe', 'length', 'gt', '0');
		L.setReplace('length', '500');
		L.preview();
		const changed = L.apply();
		ok('under ' + unitSet + ' both pipes take the typed 500, with no unit conversion either end',
			changed === 2 && L.effective(linkOf(n.p1), 'length') === 500
				&& L.effective(linkOf(n.p2), 'length') === 500,
			String(L.effective(linkOf(n.p1), 'length')));
		ok('...and Auto turned off, so a later geometry pass cannot silently overwrite the typed value',
			linkOf(n.p1).lenAuto === false && linkOf(n.p2).lenAuto === false);
	});

	// Inside a scenario `lenAuto` is never consulted (only a Base geometry pass reads it), so the
	// write there is a plain override and Base's own drawn length is untouched.
	const n = build();
	const before = linkOf(n.p1)._length;
	const scn = L.createScenario('Reline');
	L.switchScenario(scn.id !== undefined ? scn.id : scn);
	L.query('pipe', 'length', 'gt', '0');
	L.setReplace('length', '9999');
	L.preview();
	L.apply();
	ok('inside a scenario, length is an override',
		L.effective(linkOf(n.p1), 'length') === 9999 &&
		L.baseValue(linkOf(n.p1), 'length') === before &&
		L.hasOverride(linkOf(n.p1), 'length') === true);
}

// ---- 4. THE FOUR TANK SCALARS AND THE MIXING MODEL/FRACTION (gap #4) ------------------------------
{
	console.log('\n--- tank level, min/max level, diameter, and mixing (Task 708 gap #4) ---');
	const n = build('si');
	L.setProp(nodeOf(n.t), 'level', 6);
	nodeOf(n.t).minLevel = 0;
	nodeOf(n.t).maxLevel = 9;
	nodeOf(n.t).tankDiameter = 15;
	ok('a tank is findable on its level, min level, max level and diameter',
		L.query('tank', 'level', 'equals', '6').length === 1 &&
		L.query('tank', 'minLevel', 'equals', '0').length === 1 &&
		L.query('tank', 'maxLevel', 'equals', '9').length === 1 &&
		L.query('tank', 'tankDiameter', 'lt', '20').length === 1);
	// Min/max/diameter are base-owned geometry, not in LPN_OVERRIDABLE, so a scenario write must
	// land on the document itself rather than becoming an override nothing reads.
	const scn = L.createScenario('Bigger tank');
	L.switchScenario(scn.id !== undefined ? scn.id : scn);
	L.query('tank', 'tankDiameter', 'equals', '15');
	L.setReplace('tankDiameter', '20');
	L.preview();
	L.apply();
	ok('tank diameter writes the document even from inside a scenario, because it is not overridable',
		nodeOf(n.t).tankDiameter === 20 && L.hasOverride(nodeOf(n.t), 'tankDiameter') === false);
	L.switchScenario('base');

	// Level IS overridable, unlike its three neighbours -- the one row in this gap with a `prop`.
	L.query('tank', 'level', 'equals', '6');
	L.setReplace('level', '7');
	L.preview();
	L.apply();
	ok('level is an ordinary overridable input, unlike min/max/diameter beside it',
		L.effective(nodeOf(n.t), 'level') === 7 && L.baseValue(nodeOf(n.t), 'level') === 7);

	// The mixing model, matched through the new `choices` door, case-insensitively, and refused
	// when the typed word is not one of EPANET's four tokens.
	ok('a fresh tank reads MIXED, the standing default',
		L.valueOf('tank', 'mixingModel', n.t) === 'MIXED');
	L.query('tank', 'mixingModel', 'equals', 'mixed');
	ok('mixingModel matches the internal token case-insensitively',
		L.query('tank', 'mixingModel', 'equals', 'mixed').length === 1);
	L.setReplace('mixingModel', '2comp');
	L.preview();
	L.apply();
	ok('a valid choice is normalized to the stored token', nodeOf(n.t).mixingModel === '2COMP');
	L.setReplace('mixingModel', 'stirred');
	L.preview();
	ok('an unrecognised word is refused, not written as a fifth model', L.pending() === null);

	// The fraction only applies once the model is two-compartment -- the same gate the popup's
	// `plainFor` and the table cell both draw the row under.
	nodeOf(n.t).mixingFraction = 0.3;
	ok('mixing fraction is findable on a two-compartment tank',
		L.query('tank', 'mixingFraction', 'equals', '0.3').length === 1);
	nodeOf(n.t).mixingModel = 'MIXED';
	ok('...and not on a tank back under complete mixing, where the fraction is unused',
		L.valueOf('tank', 'mixingFraction', n.t) === undefined);
}

// ---- 5. THE THREE PUMP INPUTS (gap #5) -------------------------------------------------------------
{
	console.log('\n--- pump relative speed, energy price and its pattern (Task 708 gap #5) ---');
	const n = build();
	L.getDoc().patterns = [{ id: 'TARIFF', multipliers: [1, 1] }];
	ok('a fresh pump reads speed 1, the standing default', L.valueOf('link', 'speed', n.pump) === 1);
	linkOf(n.pump).speed = 0.8;
	ok('a pump running slower is findable below 1', L.query('pump', 'speed', 'lt', '1').length === 1);
	L.query('pump', 'speed', 'lt', '1');
	L.setReplace('speed', '0');
	L.preview();
	L.apply();
	ok('a blank/zero/negative speed reads back as 1, not as a pump switched off -- Shut has its own property',
		linkOf(n.pump).speed === 1, String(linkOf(n.pump).speed));

	L.setProp(linkOf(n.pump), 'energyPrice', 0.12);
	ok('energy price is findable', L.query('pump', 'energyPrice', 'gt', '0').length === 1);
	L.query('pump', 'energyPrice', 'gt', '0');
	L.setReplace('energyPrice', '0.2');
	L.preview();
	L.apply();
	ok('...and replaceable, through the scenario seam like any other overridable input',
		L.effective(linkOf(n.pump), 'energyPrice') === 0.2);

	// The price PATTERN is an id, validated against the document's own library at WRITE time --
	// exactly customPattern's own rule in customerReplaceSpecs(), which is also unvalidated at
	// the preview stage: the library is not consulted until `set()` runs, so the preview promises
	// a candidate was matched and the write itself is the one place an unknown id is refused.
	L.query('pump', 'id', 'contains', n.pump);
	L.setReplace('energyPattern', 'NO-SUCH-PATTERN');
	L.preview();
	L.apply();
	ok('a pattern id nothing in the library answers to is silently left unwritten',
		L.effective(linkOf(n.pump), 'energyPattern') === undefined,
		String(L.effective(linkOf(n.pump), 'energyPattern')));
	L.setReplace('energyPattern', 'TARIFF');
	L.preview();
	L.apply();
	ok('a real pattern id is written', L.effective(linkOf(n.pump), 'energyPattern') === 'TARIFF');
}

// ---- 6. A CHOICE PROPERTY'S VALUE COMES FROM A <SELECT>, IN THE READER'S OWN LANGUAGE -------------
//
// PRE-REVIEW FIX (Task 708): a Spanish reader typing "cerrado" into a plain text box found
// nothing, because the box compared their word against the stored English token, and a matched
// row printed "closed" straight back at them. Sections 1 and 4 above proved the FIND/REPLACE
// MACHINERY is right about the codes; this section proves the actual on-screen control is a
// picklist built from the SAME words the popup already shows, in whatever language the page is
// running -- built with rebuildFindForm()/buildReplaceForm(), the real functions, into the real
// #lpn_find_form, and read off the rendered <select> rather than off findChoiceDefs() directly,
// which would pass even if renderFindControls() had never been taught to call it.
//
// **REAL SPANISH WORDS, NOT INVENTED ONES** -- copied once from lib/lang.ec.es.php (the anchor
// language nearest this feature) into a temporary pageConfig override via L.setWord(), the same
// door find-harness.js's own doc block names for testing a second language "without a second lang
// file." Every assertion below reads the word back off `es[key]`, never off a literal typed twice,
// so this file has nothing in it for harness_wording_check.php to catch either way.
{
	console.log('\n--- a choice property is picked from a <select>, in Spanish (Task 708 pre-review) ---');
	const n = build();
	const es = {
		lpn_result_status_open: 'Abierto', lpn_result_status_closed: 'Cerrado',
		lpn_field_closed: 'Cerrada',
		lpn_mixing_mixed: 'Mezcla completa', lpn_mixing_2comp: 'Mezcla en dos compartimentos',
		lpn_mixing_fifo: 'Flujo pistón FIFO', lpn_mixing_lifo: 'Flujo pistón LIFO'
	};
	Object.keys(es).forEach(function (k) { L.setWord(k, es[k]); });
	L.setProp(linkOf(n.p2), 'status', 'closed');

	// ---- Find's value box ----
	L.setFindState('pipe', 'status', 'equals', '');
	L.buildPanel();
	const statusOptions = L.selectOptions(L.selectAt(L.findControlsBox(), 4));
	ok('the Find value select offers the Spanish words, not the English codes',
		JSON.stringify(statusOptions) === JSON.stringify([['open', es.lpn_result_status_open], ['closed', es.lpn_result_status_closed]]),
		JSON.stringify(statusOptions));
	L.chooseOption(L.selectAt(L.findControlsBox(), 4), 'closed');
	L.pressFind();
	ok('choosing "Cerrado" from the select finds the closed pipe',
		JSON.stringify(L.resultRows()).indexOf(n.p2) >= 0, JSON.stringify(L.resultRows()));
	ok('...and the result row prints the Spanish word, not the English "closed"',
		L.resultRows().some(function (t) { return t.indexOf(es.lpn_result_status_closed) >= 0; }) &&
		!L.resultRows().some(function (t) { return t.indexOf('closed') >= 0; }),
		JSON.stringify(L.resultRows()));

	// ---- Replace's value box, writing through the select ----
	L.buildPanel();
	const replaceStatusOptions = L.selectOptions(L.selectAt(L.replaceBox(), 2));
	ok('Replace offers the identical Spanish picklist for the same property',
		JSON.stringify(replaceStatusOptions) === JSON.stringify(statusOptions), JSON.stringify(replaceStatusOptions));
	L.chooseOption(L.selectAt(L.replaceBox(), 2), 'open');
	// The select's own onChange has already set replaceState.value = 'open' -- the same write
	// pressing "Replace" then "Change them" performs, in the two calls sections 1-5 above already
	// exercise directly (runReplacePreview()/applyReplace()).
	L.preview();
	L.apply();
	ok('choosing "Abierto" and pressing Replace reopens the pipe',
		linkOf(n.p2)._status === 'open', String(linkOf(n.p2)._status));

	// ---- The mixing model select shows the popup's own four words ----
	L.setFindState('tank', 'mixingModel', 'equals', '');
	L.buildPanel();
	const mixOptions = L.selectOptions(L.selectAt(L.findControlsBox(), 4));
	ok('the mixing model select is the popup\'s own four words, in the same order',
		JSON.stringify(mixOptions) === JSON.stringify([
			['MIXED', es.lpn_mixing_mixed], ['2COMP', es.lpn_mixing_2comp],
			['FIFO', es.lpn_mixing_fifo], ['LIFO', es.lpn_mixing_lifo]]),
		JSON.stringify(mixOptions));
	// The find select is left on "MIXED" -- the fresh tank's own default -- so the query still
	// matches it; choosing a DIFFERENT one here would only prove the select's own onChange runs,
	// which the status case above already proved, and would leave nothing for Replace to find.
	L.buildPanel();
	const replaceMixOptions = L.selectOptions(L.selectAt(L.replaceBox(), 2));
	ok('Replace\'s mixing model select is the identical list',
		JSON.stringify(replaceMixOptions) === JSON.stringify(mixOptions), JSON.stringify(replaceMixOptions));
	L.chooseOption(L.selectAt(L.replaceBox(), 2), 'FIFO');
	L.preview();
	L.apply();
	ok('choosing a word from the select writes the code underneath', nodeOf(n.t).mixingModel === 'FIFO');

	// Restore English so nothing below (or in a later run sharing this process) reads Spanish.
	Object.keys(es).forEach(function (k) { L.setWord(k, PC_EN[k]); });
}

// ---- 7. THE "NEW ASSETS" PUSH GUARD (pre-review: Perry found no automated coverage) ---------------
//
// **THE BUG THIS GUARDS AGAINST.** "Apply these new-asset values to every existing asset" seeds
// each property from `settings.defaults[s.key]`; before this fix its filter was `pushFieldShown`
// alone, which answers "is this shown on the map," not "does a New-asset default exist for it."
// `length` and `status` are shown on the map by default OPTION and neither has a New-asset
// default (`length` deliberately -- `lenAuto` would overwrite it immediately -- and `status` was
// simply never given one), so turning either label on and pressing the button would have pushed
// `settings.defaults.length`/`.status`, both `undefined`, onto every pipe. Diameter is the
// control: it DOES have a default, and turning its label on must still let the button work.
{
	console.log('\n--- the New-assets push guard (a property shown but with no seeded default) ---');
	const n = build();
	L.setProp(linkOf(n.p1), 'length', 111);
	L.setProp(linkOf(n.p1), 'status', 'closed');
	const beforeDiameter = L.effective(linkOf(n.p1), 'diameter');
	ok('the fixture starts with neither property at its would-be pushed value',
		L.settingsDefaults().length === undefined && L.settingsDefaults().status === undefined,
		JSON.stringify([L.settingsDefaults().length, L.settingsDefaults().status]));
	// Turn on the map labels for all three, exactly what a visitor would do before reaching for
	// this button -- length and status to see them printed, diameter along for the ride.
	L.labelSettings().link.length = true;
	L.labelSettings().link.status = true;
	L.labelSettings().link.diameter = true;
	L.settingsDefaults().diameter = 24;   // a real New-asset default, unlike length/status
	L.rebuildSettings();
	const btn = L.firstButtonIn(document.getElementById('lpn_set_default_fields'));
	ok('the push button is on the box', !!btn);
	L.click(btn);
	ok('length is untouched -- pushing `undefined` onto it is exactly the bug this guards',
		L.effective(linkOf(n.p1), 'length') === 111, String(L.effective(linkOf(n.p1), 'length')));
	ok('status is untouched, for the same reason',
		L.effective(linkOf(n.p1), 'status') === 'closed', String(L.effective(linkOf(n.p1), 'status')));
	ok('...while diameter, which DOES have a seeded default, still pushes -- the guard is scoped, not a kill switch',
		L.effective(linkOf(n.p1), 'diameter') === 24 && L.effective(linkOf(n.p1), 'diameter') !== beforeDiameter,
		String(L.effective(linkOf(n.p1), 'diameter')));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

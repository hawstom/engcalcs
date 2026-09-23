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
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
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

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

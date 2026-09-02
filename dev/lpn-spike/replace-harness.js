// Headless check of REPLACE -- ROADMAP Task 389 (search and replace inputs across the network),
// which is Task 353's query with a write on the end.
//
//   node dev/lpn-spike/replace-harness.js
//
// WHY THIS EXISTS. find-harness.js already proves the query returns the right elements. This is
// about the WRITE, and a bulk write has four ways to be wrong that nobody can see happening:
//
//   1. **The count promises something the write does not do.** "37 pipes will change" is the only
//      thing the user has to go on -- the matched pipes are spread over a map they are not looking
//      at. A count of everything that MATCHED (rather than everything that will actually change) is
//      wrong by exactly the pipes already sitting at the new value, and looks right.
//   2. **Cancel writes anyway.** A preview that has already touched the document is not a preview.
//   3. **It is 37 undo steps, not one.** UNDO_LIMIT is 20, so a 37-element replace undone one
//      element at a time cannot be undone at all: the first seventeen snapshots are gone and the
//      document is permanently half-replaced.
//   4. **It writes past setProp() and edits BASE from inside a scenario** -- the seam that has
//      already produced five user-reachable defects (dev/scenario-seam-repair.md). This is the
//      invisible one: on screen inside the scenario the number is right, and every OTHER scenario
//      has silently been changed.
//
// (4) is asserted the only way it can be from outside: a replace run inside a scenario must leave
// Base's value alone and record an override. A direct write does the opposite of both, so the pair
// of assertions cannot pass without setProp().
//
// MUTATION-TESTED, 2026-08-24. Five defects were introduced into js/looped-network.js one at a time
// and all five were caught: counting matches instead of changes (4 failures); Cancel leaving the
// pending set in place (2); saveUndoSnapshot() moved inside the loop (5); replaceWrite() writing
// el['_' + prop] directly instead of setProp() (3); and a rebuilt form keeping a stale preview (1).
//
// **THE setProp() MUTANT IS THE ONE TO NOTE: scenario_seam_check.php PASSES IT.** That check reads
// the source a line at a time and matches a LITERAL property name, so a computed write --
// el['_' + spec.prop] -- is invisible to it. The guard and this harness cover different halves of
// the same rule, and the write here is generic by nature, so the assertion belongs here.

const { ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// The Find panel's two boxes are not in the stub's harvested id list, because find-harness.js calls
// findMatches() directly and never builds the form. This one DOES build it -- the message the user
// reads is part of what is being tested -- so they have to exist.
ensure('lpn_find_form');
ensure('lpn_find_results');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tsetProp: setProp, effective: effective, buildDom: buildDom,\n" +
	"\t\tdeleteElement: deleteElement, baseValue: baseValue, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tclearUndo: clearUndo,\n" +
	// The query and the write, driven through the same state the pull-downs write.
	"\t\tquery: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tsetReplace: function (prop, value) { replaceState.prop = prop; replaceState.value = value; },\n" +
	"\t\treplaceState: function () { return replaceState; },\n" +
	"\t\tspecFields: function (scope) { findState.scope = scope; return replaceSpecs().map(function (s) { return s.field; }); },\n" +
	"\t\tnormalize: function () { replaceNormalize(); return replaceState.prop; },\n" +
	"\t\tpreview: runReplacePreview, apply: applyReplace, cancel: cancelReplace,\n" +
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
	// The form, so the sentences a user reads are exercised rather than assumed.
	"\t\tbuildForm: rebuildFindForm,\n" +
	"\t\tmessage: function () { return replaceMsgBox ? replaceMsgBox.textContent : null; },\n" +
	// The Replace heading, and the tip that lives on it since Task 477's phone pass. Read off the
	// real element rather than off the lang key, so a heading that stopped carrying its "?" fails.
	"\t\theadingText: function () { var h = null;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (!h && c.style && c.style.fontWeight === 'bold') { h = c; } walk(c); }); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\treturn h ? h.textContent : null; },\n" +
	// **SCOPED TO THE HEADING, not to the first .ec-help anywhere in the form.** It was the latter
	// until 2026-09-02, and it started answering with the Query label\'s tip the moment that label
	// got one -- so this file failed on a change that had nothing to do with it. The heading is
	// found the same way headingText() finds it, and the tip is looked for INSIDE that.
	"\t\theadingTip: function () { var head = null, h = null;\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (!head && c.style && c.style.fontWeight === 'bold') { head = c; } walk(c); }); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\tif (!head) { return null; }\n" +
	"\t\t\tif (head.className === 'ec-help' && head.title) { return head.title; }\n" +
	"\t\t\t(function walk(e) { (e.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (!h && c.className === 'ec-help' && c.title) { h = c; } walk(c); }); })(head);\n" +
	"\t\t\treturn h ? h.title : null; },\n" +
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

// A reservoir, four junctions, and five pipes -- THREE of them 6 inch, one 12 inch, and one already
// 8 inch. That last one is the whole point of the count assertion: it MATCHES a search for "not 12"
// and it must not be counted as a change when the new value is 8.
function build(unitSet) {
	setUnitSet(unitSet || 'us');
	L.reset();
	const r = L.addNode('reservoir', 0, 0).id;
	const a = L.addNode('junction', 100, 0).id;
	const b = L.addNode('junction', 200, 0).id;
	const c = L.addNode('junction', 300, 0).id;
	const d = L.addNode('junction', 400, 0).id;
	const links = [L.addLink('pipe', r, a), L.addLink('pipe', a, b), L.addLink('pipe', b, c),
		L.addLink('pipe', c, d), L.addLink('pipe', a, c)];
	L.setProp(links[0], 'diameter', 6);
	L.setProp(links[1], 'diameter', 6);
	L.setProp(links[2], 'diameter', 6);
	L.setProp(links[3], 'diameter', 12);
	L.setProp(links[4], 'diameter', 8);
	[a, b, c, d].forEach(function (id, i) { L.setProp(L.getDoc().nodes.filter(n => n.id === id)[0], 'demand', 10 * (i + 1)); });
	L.buildDom();
	return { r: r, nodes: [a, b, c, d], links: links.map(l => l.id), objs: links };
}
function dia(id) { return L.effective(L.getDoc().links.filter(l => l.id === id)[0], 'diameter'); }
function nodeOf(id) { return L.getDoc().nodes.filter(n => n.id === id)[0]; }

// ---- 1. the preview counts CHANGES, not matches -------------------------------------------------
{
	console.log('\n--- the preview count ---');
	const n = build();
	L.query('pipe', 'diameter', 'lt', '12');   // the three 6 inch pipes AND the 8 inch one
	ok('the query itself matches four pipes', L.query('pipe', 'diameter', 'lt', '12').length === 4,
		JSON.stringify(L.query('pipe', 'diameter', 'lt', '12')));
	L.setReplace('diameter', '8');
	L.preview();
	ok('...but the preview promises only the three that will really change',
		L.pending() && L.pending().length === 3, JSON.stringify(L.pending()));
	ok('...and the pipe already at 8 inches is not one of them',
		L.pending().indexOf('link:' + n.links[4]) < 0, JSON.stringify(L.pending()));
	// Nothing has been written yet: a preview that has already touched the document is not a preview.
	ok('the preview writes nothing at all',
		dia(n.links[0]) === 6 && dia(n.links[3]) === 12 && L.undoDepth() === 0,
		dia(n.links[0]) + '/' + L.undoDepth());
	// A set with nothing in it is SAID, not previewed: an Apply button over an empty set is a button
	// that does nothing when pressed.
	L.setReplace('diameter', '12');
	L.query('pipe', 'diameter', 'equals', '12');
	L.preview();
	ok('a replace that would change nothing offers no button to press', L.pending() === null);
}

// ---- 2. Cancel ----------------------------------------------------------------------------------
{
	console.log('\n--- cancel ---');
	const n = build();
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('diameter', '8');
	L.preview();
	ok('three pipes are pending', L.pending().length === 3);
	L.cancel();
	ok('cancel drops the pending set', L.pending() === null);
	ok('...and nothing was written',
		dia(n.links[0]) === 6 && dia(n.links[1]) === 6 && dia(n.links[2]) === 6);
	ok('...and no undo step was spent on it', L.undoDepth() === 0, String(L.undoDepth()));
	// Apply with nothing pending must be a no-op rather than a write of the last previewed set:
	// that is what makes Cancel real rather than cosmetic.
	ok('applying after a cancel writes nothing', L.apply() === 0 && dia(n.links[0]) === 6);
}

// ---- 3. the write, and ONE undo step ------------------------------------------------------------
{
	console.log('\n--- the write, and the undo ---');
	const n = build();
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('diameter', '8');
	L.preview();
	const changed = L.apply();
	ok('the write reports the previewed count', changed === 3, String(changed));
	ok('...and every matched pipe carries the new value',
		dia(n.links[0]) === 8 && dia(n.links[1]) === 8 && dia(n.links[2]) === 8,
		[dia(n.links[0]), dia(n.links[1]), dia(n.links[2])].join('/'));
	ok('...and the pipe that did not match is untouched', dia(n.links[3]) === 12);
	// **ONE SNAPSHOT, NOT THREE.** With UNDO_LIMIT at 20, a per-element snapshot makes a large
	// replace impossible to undo at all -- the earliest snapshots have already been shifted off.
	ok('the whole replace cost exactly one undo step', L.undoDepth() === 1, String(L.undoDepth()));
	L.undo();
	ok('...and one undo puts every one of them back',
		dia(n.links[0]) === 6 && dia(n.links[1]) === 6 && dia(n.links[2]) === 6,
		[dia(n.links[0]), dia(n.links[1]), dia(n.links[2])].join('/'));
	ok('...leaving nothing further to undo', L.undoDepth() === 0);

	// The pending set is held as IDS, not as element objects: the panel stays open across an edit,
	// so an element deleted between the preview and the button must be skipped, not written through.
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('diameter', '8');
	L.preview();
	L.deleteElement('link', n.links[0]);
	const after = L.apply();
	ok('an element deleted between the preview and the write is skipped, not resurrected',
		after === 2 && L.getDoc().links.filter(l => l.id === n.links[0]).length === 0, String(after));
}

// ---- 4. THE SCENARIO SEAM -----------------------------------------------------------------------
// The one defect nothing on screen would show. Inside a scenario, setProp() records an OVERRIDE and
// leaves Base alone; a direct write to el['_diameter'] changes Base under every other scenario and
// records nothing. Both halves are asserted, because either one alone can be passed by accident.
{
	console.log('\n--- a replace inside a scenario goes through setProp() ---');
	const n = build();
	const scn = L.createScenario('Fire flow');
	L.switchScenario(scn.id !== undefined ? scn.id : scn);
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('diameter', '8');
	L.preview();
	ok('the same query and count work inside a scenario', L.pending().length === 3);
	L.apply();
	const l0 = L.getDoc().links.filter(l => l.id === n.links[0])[0];
	ok('the scenario sees the new value', L.effective(l0, 'diameter') === 8, String(L.effective(l0, 'diameter')));
	ok('...BASE DOES NOT MOVE', L.baseValue(l0, 'diameter') === 6, String(L.baseValue(l0, 'diameter')));
	ok('...and the change is recorded as an override, which is what makes it a scenario at all',
		L.hasOverride(l0, 'diameter') === true);
	// Undo has to carry the overrides with the document, or undoing a scenario-side replace leaves
	// the map showing values nothing recorded.
	L.undo();
	ok('one undo removes every override the replace wrote',
		L.hasOverride(l0, 'diameter') === false && L.effective(l0, 'diameter') === 6,
		String(L.effective(l0, 'diameter')));

	// **ELEVATION IS THE DELIBERATE EXCEPTION AND IT IS BASE-OWNED.** It is survey data, not a design
	// variable, so it is not in LPN_OVERRIDABLE and pushSpecList() gives it no `prop` -- exactly as
	// the property popup writes it. Asserted so the exception stays a decision rather than a bug.
	nodeOf(n.nodes[0]).elev = 100;
	nodeOf(n.nodes[1]).elev = 100;
	L.query('junction', 'elev', 'equals', '100');
	L.setReplace('elev', '120');
	L.preview();
	ok('elevation is replaceable', L.pending() && L.pending().length === 2, JSON.stringify(L.pending()));
	L.apply();
	ok('...and writes Base, because elevation is not a scenario variable',
		nodeOf(n.nodes[0]).elev === 120 && L.hasOverride(nodeOf(n.nodes[0]), 'elev') === false);
}

// ---- 5. what is offered, and where ---------------------------------------------------------------
{
	console.log('\n--- the property list follows the scope ---');
	const n = build();
	ok('a pipe scope offers the pipe inputs',
		JSON.stringify(L.specFields('pipe')) === JSON.stringify(['diameter', 'roughness', 'km']),
		JSON.stringify(L.specFields('pipe')));
	ok('a junction scope offers the node inputs',
		// `fireFlow` joined them with Task 530 -- a junction's own required fire flow is an INPUT
		// this tool can set in bulk, which is the whole point of giving a district one number.
		JSON.stringify(L.specFields('junction')) === JSON.stringify(['elev', 'demand', 'fireFlow']),
		JSON.stringify(L.specFields('junction')));
	// **RESULTS ARE SEARCHABLE AND NOT WRITABLE.** Pressure is printed on the map, so it is a
	// perfectly good thing to search on; nothing writes it, so it must never appear here.
	ok('a solved result is never offered as something to set',
		L.specFields('junction').indexOf('pressure') < 0 && L.specFields('pipe').indexOf('velocity') < 0);
	// Length is left out with the results, for its own reason: `lenAuto` is a second decision per
	// link ("follow the drawing") that one value box cannot express.
	ok('length is left out, because Auto is a second decision per link',
		L.specFields('pipe').indexOf('length') < 0, JSON.stringify(L.specFields('pipe')));
	// A mixed scope has no single property to set. Nothing is offered, and it is SAID.
	ok('the all-elements scope offers nothing to set', L.specFields('all').length === 0);
	ok('a Text scope offers nothing to set either', L.specFields('text').length === 0);

	// The searched property is what the write offers first: "find every 6 inch main, make it 8"
	// names one property twice.
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('', '');
	ok('the property being searched is the one offered to change', L.normalize() === 'diameter');
	// A search on something unwritable falls back rather than leaving the control pointing at nothing.
	L.query('pipe', 'velocity', 'gt', '5');
	L.setReplace('', '');
	ok('...and a search on a result falls back to the first writable property',
		L.normalize() === 'diameter', L.normalize());
	ok('...as does a search on an ID', (L.query('pipe', 'id', 'contains', ''), L.setReplace('', ''), L.normalize()) === 'diameter');
}

// ---- 6. the sentences a person actually reads ---------------------------------------------------
{
	console.log('\n--- the form, and its messages ---');
	const n = build();
	L.query('pipe', 'diameter', 'equals', '6');
	L.buildForm();
	L.setReplace('diameter', '');
	L.preview();
	ok('an empty value is answered with what to do about it',
		/value/i.test(L.message() || ''), JSON.stringify(L.message()));
	L.setReplace('diameter', 'wide');
	L.preview();
	ok('...and so is a value that is not a number', /value/i.test(L.message() || ''), JSON.stringify(L.message()));
	L.setReplace('diameter', '8');
	L.preview();
	ok('a real preview says how many will change', /3/.test(L.message() || ''), JSON.stringify(L.message()));
	// **A CHANGED QUERY INVALIDATES THE COUNT.** A number on screen about a value the box no longer
	// holds is the one way a preview can lie, and rebuilding the form is what every scope and
	// property change goes through.
	L.buildForm();
	ok('rebuilding the form drops the pending set', L.pending() === null);
	// **THE MIXED SCOPE STILL EXPLAINS ITSELF -- AS A "?" ON THE HEADING, NOT AS A SENTENCE**
	// (Tom, 2026-08-27, of the box on a phone). It was two wrapped lines at the narrowest width this
	// page has, saying a thing worth reading once. What must NOT happen is the section vanishing:
	// that reads as a feature that comes and goes, and it is why the tip moved rather than being
	// deleted.
	L.query('all', 'id', 'contains', '');
	L.buildForm();
	ok('the all-elements scope no longer spends two lines of the box on a sentence',
		(L.message() || '') === '', JSON.stringify(L.message()));
	ok('...but the section is still there, with its heading',
		(L.headingText() || '').length > 0, JSON.stringify(L.headingText()));
	ok('...and the explanation is on it, reachable as a "?" tip',
		/one kind/i.test(L.headingTip() || ''), JSON.stringify(L.headingTip()));
	ok('...with the glyph a person can actually see and tap',
		L.headingText().indexOf('?') >= 0, JSON.stringify(L.headingText()));
	// And it goes away once the question has been answered: a permanent "choose one kind of asset"
	// on a box where one is already chosen is a "?" answering a question nobody is in.
	L.query('pipe', 'diameter', 'equals', '6');
	L.buildForm();
	ok('choosing a kind of asset takes the "?" away again',
		!L.headingTip() && L.headingText().indexOf('?') < 0, JSON.stringify(L.headingText()));
	L.query('pipe', 'diameter', 'equals', '6');
	L.setReplace('diameter', '8');
	L.preview();
	const wrote = L.apply();
	ok('the finished write says how many changed', wrote === 3 && /3/.test(L.message() || ''),
		JSON.stringify(L.message()));
	// The rows on screen are the panel's claim about the map, so they are re-run over the document
	// the write just changed: after "6 becomes 8" there are no 6 inch pipes left to list.
	ok('...and the result list no longer claims the pipes it just changed',
		L.query('pipe', 'diameter', 'equals', '6').length === 0);
}

// ---- 7. the value is in the DISPLAYED unit, both ends -------------------------------------------
// This page stores what the user typed, so 8 means 8 inches under `us` and 8 millimetres under `si`,
// and NEITHER end converts. A conversion on one end alone would make "find 6, replace with 8" mean
// two different sixes -- which no assertion about a single number can catch, so both unit sets run
// the identical script and must produce the identical stored numbers.
{
	console.log('\n--- no conversion, either end ---');
	['us', 'si'].forEach(function (set) {
		const n = build(set);
		L.query('pipe', 'diameter', 'equals', '6');
		L.setReplace('diameter', '8');
		L.preview();
		L.apply();
		ok('under ' + set + ' the typed 8 is stored as 8',
			dia(n.links[0]) === 8 && dia(n.links[3]) === 12, String(dia(n.links[0])));
	});
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

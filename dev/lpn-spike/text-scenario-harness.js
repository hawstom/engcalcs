// A TEXT LABEL INSIDE A SCENARIO -- ROADMAP Task 407, and Task 412's Base-wide marker. Run with:
//   node dev/lpn-spike/text-scenario-harness.js
//
// WHAT THIS DEFENDS, and why each half of it is silent when it breaks.
//
//   1. TEXT IS A THIRD GROUP. elGroup() used to tell a link from a node by `from` and call
//      everything else a node, so a Text label keyed as 'n:<id>' -- and a label X1 beside a
//      junction X1 (both legal here, and inevitable once a user sets the Text prefix to J) shared
//      one override map entry. That is Task 324's bug verbatim: 7 / 35 / 72 colliding ids in
//      Net1 / Net2 / Net3. The dangerous half is `active`, which BOTH groups have -- switching a
//      note off would have taken a junction out of the solve, with nothing on screen to say so.
//      Section 1 builds the collision deliberately, because it is the whole point of the group.
//
//   2. THE WRITE SEAM. renderLabelFields() used to write `lb.text = input.value`, which inside a
//      scenario edits BASE under every other scenario at once while showing the right words on
//      screen -- the exact failure setProp() exists to prevent, and the one that produced five
//      user-reachable defects in the valve popup. Section 2 asserts the element does not move.
//
//   3. POSITION IS NOT A SCENARIO VALUE (Tasks 338, 407). Two scenarios of one network must LOOK
//      the same or you cannot compare them. This is enforced by ABSENCE from LPN_OVERRIDABLE, so
//      the assertion has to come at it from the behaviour side as well as the whitelist side --
//      section 4, which also anchors itself to the real drag statement in the source, since a
//      harness cannot drive a pointer sequence here.
//
//   4. THE STORAGE RENAME. `_text` is what elGroup() recognises a label BY, so a document saved
//      before Task 407 -- every document on every user's device -- must come back with its notes
//      renamed, or every label silently reads as a node AND draws blank. Section 6 opens documents
//      in the old shape, including a v2 one, which lags at v2 forever and therefore never reaches
//      the version-gated part of the chain.
//
// THE STUB, and what it is allowed to hold constant: this one measures text width from the
// character count (lpn-dom-stub.js), which is the coupling section 3 needs -- a note switched off
// must stop being drawn, and a constant-width stub would still let every geometry assertion pass.
// Nothing here reads a solve, so no solver relationship is stubbed away.

const { setUnitSet, loadLoopedNetwork, ROOT } = require('./lpn-dom-stub.js');
const fs = require('fs');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\teffective: effective, setProp: setProp, hasOverride: hasOverride, baseValue: baseValue,\n" +
	"\t\tclearOverride: clearOverride, isOverridable: isOverridable, isActive: isActive,\n" +
	// The key format is read through the page's own seam, never spelled here: a harness that wrote
	// 't:' + id would be a second copy of the format, free to agree with a page that had changed.
	"\t\tovKey: ovKey, ovKeyFor: ovKeyFor, elGroup: elGroup,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveScenario: activeScenario, overrideCount: function () { return overrideCount(activeScenario()); },\n" +
	"\t\tlabelById: labelById, labelEl: function (id) { return labelEls[id]; },\n" +
	"\t\tdeleteElement: deleteElement, afterPropertyEdit: afterPropertyEdit, buildDom: buildDom,\n" +
	"\t\trenderLabelFields: renderLabelFields, renderNodeFields: renderNodeFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tmigrateSaved: migrateSaved, serializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\tsetSetting: function (k, v) { settings[k] = v; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function hidden(id) {
	const e = L.labelEl(id);
	return !!(e && e.text && e.text.classList.contains('lpn-lbl-hidden'));
}
function drawnText(id) { return L.labelEl(id).text.textContent; }
// The popup read back the way a person reads it: the words, and whether the row carries a box.
function fieldsText() {
	function walk(el) {
		if (!el.children || !el.children.length) { return el.textContent || ''; }
		return (el.textContent || '') + el.children.map(walk).join('|');
	}
	return walk(L.popupFields());
}
function checkboxes() {
	const out = [];
	(function walk(el) {
		if (el.type === 'checkbox') { out.push(el); }
		(el.children || []).forEach(walk);
	})(L.popupFields());
	return out;
}
// ONE EDIT, THE WAY THE PAGE MAKES ONE. Every property row in this file is setProp() followed by
// afterPropertyEdit() -- the write seam and then the redraw seam. A harness that called setProp()
// alone would be asserting the MODEL while the drawing was never asked to change, which is the
// half of Task 407 a user actually sees.
function edit(el, prop, value) { L.setProp(el, prop, value); L.afterPropertyEdit(el); }
function fire(el, type) {
	(el._listeners[type] || []).forEach(function (fn) { fn({ type: type, currentTarget: el, target: el }); });
}
// Every text <input> in the popup, in order -- the first is the note's words.
function textInputs() {
	const out = [];
	(function walk(el) {
		if (el.type === 'text') { out.push(el); }
		(el.children || []).forEach(walk);
	})(L.popupFields());
	return out;
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
// Wide enough that nothing hides on the size threshold: this harness is about membership, and a
// note hidden for being too small would look exactly like a note switched off.
L.setCanvas(1200, 800);
L.setZoom(1);

const doc = L.getDoc();

// ---------------------------------------------------------------------------
// 1. A LABEL AND A JUNCTION WITH THE SAME ID (Task 324, re-run for the new group)
// ---------------------------------------------------------------------------
console.log('\n--- a label id that equals a junction id ---');
const j1 = L.addNode('junction', 0, 0);
const note = L.addText(200, 200, null);
// Built by hand rather than hoped for: mintId() keeps ids apart WITHIN this document, so the
// collision has to be created deliberately -- and it is entirely reachable in a real one, because a
// user may set the Text prefix and the junction prefix to the same letter, and an imported .inp
// brings its own ids from a file that never heard of ours.
note.id = j1.id;
ok('the label and the junction really do share an id', note.id === j1.id, j1.id);
ok('...and the page still tells them apart', L.elGroup(note) === 'label' && L.elGroup(j1) === 'node',
	L.elGroup(note) + ' / ' + L.elGroup(j1));
ok('...so their override keys are DIFFERENT', L.ovKey(note) !== L.ovKey(j1),
	L.ovKey(note) + ' vs ' + L.ovKey(j1));
ok('...and each key is the one its own group spells', L.ovKey(note) === L.ovKeyFor('label', note.id)
	&& L.ovKey(j1) === L.ovKeyFor('node', j1.id));

{
	const s1 = L.createScenario('Fire flow');
	// THE DANGEROUS HALF. `active` is on both groups, so a shared key means switching the note off
	// switches the junction out of the SOLVE -- silently, and nowhere near where the user clicked.
	edit(note, 'active', false);
	ok('switching the note off leaves the junction in the network', L.isActive(j1) === true);
	ok('...and the note itself really is off', L.isActive(note) === false);
	edit(j1, 'demand', 500);
	ok('a demand typed on the junction is not read back by the label',
		L.effective(note, 'demand') === undefined, String(L.effective(note, 'demand')));
	L.clearOverride(note, 'active');
	L.clearOverride(j1, 'demand');
	L.switchScenario('base');
	// Put the ids back apart for the rest of the harness, so nothing below passes or fails for a
	// reason section 1 created.
	note.id = 'X99';
	doc.labels.forEach(function () {});
	L.getScenarios().forEach(function (s) { s.overrides = {}; });
	L.switchScenario(s1.id);
	L.switchScenario('base');
}

// ---------------------------------------------------------------------------
// 2. WHAT THE NOTE SAYS is a scenario value; BASE DOES NOT MOVE
// ---------------------------------------------------------------------------
console.log('\n--- overriding the words ---');
const lb = L.addText(300, 300, null);
edit(lb, 'text', 'PHASE 1');
ok('Base holds the typed words', L.effective(lb, 'text') === 'PHASE 1');
ok('...stored underscored, like every overridable property', lb._text === 'PHASE 1' && lb.text === undefined,
	JSON.stringify({ _text: lb._text, text: lb.text }));

const scn = L.createScenario('Phase 2');
{
	edit(lb, 'text', 'PHASE 2');
	ok('the write went to the OVERRIDE, not to the element',
		L.hasOverride(lb, 'text') && lb._text === 'PHASE 1', 'element still holds ' + lb._text);
	ok('effective() reports the scenario words', L.effective(lb, 'text') === 'PHASE 2');
	ok('Base\'s own value is still readable beside it', L.baseValue(lb, 'text') === 'PHASE 1');

	L.switchScenario('base');
	ok('back in Base the note reads what it always read', L.effective(lb, 'text') === 'PHASE 1');
	ok('...and the drawing shows that, not the scenario\'s words', drawnText(lb.id) === 'PHASE 1',
		drawnText(lb.id));
	L.switchScenario(scn.id);
	ok('and back in the scenario the drawing shows its words', drawnText(lb.id) === 'PHASE 2',
		drawnText(lb.id));

	// The marker is INTENT, not a diff -- the same rule the rest of the scenario model follows.
	edit(lb, 'text', 'PHASE 1');
	ok('typing Base\'s own words in a scenario STILL records an override', L.hasOverride(lb, 'text'));
	L.switchScenario('base');
	edit(lb, 'text', 'AS BUILT');
	L.switchScenario(scn.id);
	ok('...so the scenario does not follow Base when Base moves',
		L.effective(lb, 'text') === 'PHASE 1', L.effective(lb, 'text'));
	L.clearOverride(lb, 'text');
	ok('clearing the marker hands the note back to Base', L.effective(lb, 'text') === 'AS BUILT');
	edit(lb, 'text', 'PHASE 2');
}

// ---------------------------------------------------------------------------
// 3. PRESENCE: absent reads as true, false hides the note, true shows it again
// ---------------------------------------------------------------------------
console.log('\n--- a note that is only in one scenario ---');
{
	ok('a note nobody has touched is present', L.effective(lb, 'active') === true
		&& lb._active === undefined, 'stored: ' + String(lb._active));
	ok('...and is drawn', hidden(lb.id) === false);

	edit(lb, 'active', false);
	ok('switched off in the scenario, the note is not drawn', hidden(lb.id) === true);
	L.switchScenario('base');
	ok('...and Base still draws it -- the scenario took nothing away from anyone else',
		hidden(lb.id) === false && L.effective(lb, 'active') === true);
	L.switchScenario(scn.id);
	ok('...and it is still off here', hidden(lb.id) === true);
	edit(lb, 'active', true);
	ok('switched back on, it is drawn again', hidden(lb.id) === false);

	// THE CASE THE FEATURE EXISTS FOR: a note that belongs to one scenario alone, with no second
	// mechanism -- parked in Base, switched on here.
	L.switchScenario('base');
	const only = L.addText(400, 400, null);
	edit(only, 'text', 'TEMPORARY BYPASS');
	edit(only, 'active', false);
	ok('parked in Base, the note is not drawn there', hidden(only.id) === true);
	L.switchScenario(scn.id);
	edit(only, 'active', true);
	ok('...and one scenario can switch it on', hidden(only.id) === false && drawnText(only.id) === 'TEMPORARY BYPASS');
	L.switchScenario('base');
	ok('...without it appearing in Base', hidden(only.id) === true);

	// Drawn INSIDE a scenario, a note is born in Base switched off and switched on here -- the same
	// membership rule a pipe follows, which is what makes "one id space, one element set" hold.
	L.switchScenario(scn.id);
	const born = L.addText(500, 500, null);
	ok('a note drawn inside a scenario is present here', L.effective(born, 'active') === true);
	L.switchScenario('base');
	ok('...and absent in Base', L.effective(born, 'active') === false);
	L.switchScenario(scn.id);
}

// ---------------------------------------------------------------------------
// 4. POSITION IS THE NETWORK'S, NOT THE SCENARIO'S (Tasks 338 / 407)
// ---------------------------------------------------------------------------
console.log('\n--- the drawing does not fork ---');
{
	['x', 'y', 'sizeMult', 'anchorNode', 'align', 'valign', 'rot', 'bold'].forEach(function (p) {
		ok('`' + p + '` is not overridable', L.isOverridable(lb, p) === false);
	});
	ok('...while `text` and `active` are',
		L.isOverridable(lb, 'text') && L.isOverridable(lb, 'active'));

	// A DRAG IS A PLAIN WRITE TO lb.x/lb.y, and a pointer sequence is the half this scaffolding
	// cannot drive -- so the write is performed here and ANCHORED to the real statement below, which
	// is what stops this from testing a copy of the page rather than the page.
	const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	ok('the drag really does write the label\'s own x/y (so simulating it is not a fiction)',
		/else \{ lb\.x = w3\.x \+ drag\.offX; lb\.y = w3\.y \+ drag\.offY; \}/.test(src));

	const before = { x: lb.x, y: lb.y };
	lb.x = 777; lb.y = 888;                       // the drag, inside a scenario
	ok('the move landed on the element itself, not in an override',
		lb.x === 777 && L.activeScenario().overrides[L.ovKey(lb)].x === undefined);
	ok('...and Base sees it', (L.switchScenario('base'), lb.x === 777 && lb.y === 888));
	L.switchScenario(scn.id);
	ok('...and so does every scenario -- the map cannot move under the reader',
		lb.x === 777 && lb.y === 888, lb.x + ', ' + lb.y);
	lb.x = before.x; lb.y = before.y;
}

// ---------------------------------------------------------------------------
// 5. THE POPUP ROW STILL EDITS THROUGH THE SEAM
// ---------------------------------------------------------------------------
console.log('\n--- the Text popup edits through the seam ---');
{
	// THE ROW STILL EDITS. The marker is presentation; the seam is what matters, so the words are
	// typed the way a user types them and the override is read back through the model.
	L.switchScenario(scn.id);
	L.renderLabelFields(lb.id);
	const box = textInputs()[0];
	box.value = 'TYPED IN THE POPUP';
	fire(box, 'change');
	ok('typing in the popup writes the OVERRIDE', L.hasOverride(lb, 'text')
		&& L.effective(lb, 'text') === 'TYPED IN THE POPUP');
	ok('...and leaves Base alone', L.baseValue(lb, 'text') === 'AS BUILT', L.baseValue(lb, 'text'));
	ok('...and the drawing follows', drawnText(lb.id) === 'TYPED IN THE POPUP', drawnText(lb.id));
	L.switchScenario('base');
	ok('...and Base still draws Base\'s words', drawnText(lb.id) === 'AS BUILT', drawnText(lb.id));
	L.switchScenario(scn.id);
}

// ---------------------------------------------------------------------------
// 6. EVERY DOCUMENT ALREADY SAVED STILL OPENS
// ---------------------------------------------------------------------------
// `_text` is what elGroup() recognises a label BY, so a document in the old shape does not merely
// draw blank notes -- every one of its labels keys as a NODE, which is the collision section 1 is
// about. Both halves are asserted, on a v7 document and on a v2 one.
console.log('\n--- documents written before the rename ---');
{
	function oldShape(v) {
		return {
			v: v, project: { name: '', activeScenario: 'base' },
			scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
			origin: { x: 0, y: 0 },
			// `_demand` underscored and present: this is a v7 document, where every overridable property
			// already carried the underscore, and the node labels are drawn from it.
			nodes: [{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 100, _demand: 0 }],
			links: [],
			labels: [{ id: 'X1', text: 'PUMP HOUSE', x: 10, y: 20, anchorNode: null, sizeMult: 1 },
				{ id: 'X2', x: 30, y: 40, anchorNode: null, sizeMult: 1 }]
		};
	}
	const m7 = L.migrateSaved(oldShape(7));
	ok('a v7 document comes out at the current version', m7.v === L.storageVersion(),
		m7.v + ' vs ' + L.storageVersion());
	ok('...with the note\'s words moved to _text', m7.labels[0]._text === 'PUMP HOUSE'
		&& m7.labels[0].text === undefined, JSON.stringify(m7.labels[0]));
	ok('...and a label that never had any words gets an empty string, not nothing',
		m7.labels[1]._text === '', JSON.stringify(m7.labels[1]._text));
	ok('...so every migrated label is classified as a label', m7.labels.every(function (x) {
		return L.elGroup(x) === 'label';
	}));

	// V2 IS THE ONE VERSION THAT LAGS, on purpose: it holds a units question that is the user's to
	// answer, so it never reaches a version-gated step. Its notes must still come back.
	const m2 = L.migrateSaved(oldShape(2));
	ok('a v2 document still lags at v2', m2.v === 2, m2.v);
	ok('...and its notes are renamed anyway -- a lagging document must still draw its words',
		m2.labels[0]._text === 'PUMP HOUSE' && m2.labels[0].text === undefined);
	ok('...and are still told apart from its junctions', L.elGroup(m2.labels[0]) === 'label'
		&& L.ovKey(m2.labels[0]) !== L.ovKeyFor('node', 'X1'));

	// And the round trip a user actually makes: open one, and the note is on screen.
	L.applySaved(JSON.parse(JSON.stringify(m7)));
	L.buildDom();
	ok('an old document opens with its note drawn', drawnText('X1') === 'PUMP HOUSE', drawnText('X1'));
	ok('...and the wordless one draws an empty string rather than "undefined"',
		drawnText('X2') === '', JSON.stringify(drawnText('X2')));
}

// ---------------------------------------------------------------------------
// 7. A SCENARIO'S NOTE SURVIVES A SAVE, AND A DELETION TAKES IT WITH IT
// ---------------------------------------------------------------------------
console.log('\n--- storage and deletion ---');
{
	// THE NOTE IS DRAWN IN BASE, THEN the scenario is made. Drawn the other way round it would be
	// born switched off in Base (bornInScenario), and "Base still has it" below would be asserting
	// the opposite of what it says.
	L.switchScenario('base');
	const n2 = L.addText(600, 600, null);
	const s = L.createScenario('Storm');
	edit(n2, 'text', 'BYPASS OPEN');
	const key = L.ovKey(n2);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the override is written under the label key', !!(saved.scenarios || []).filter(function (x) {
		return x.overrides && x.overrides[key];
	}).length, key);

	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(saved))));
	L.buildDom();
	L.switchScenario(L.getScenarios().filter(function (x) { return !x.isBase; })[0].id);
	const back = L.labelById(n2.id);
	ok('...and comes back after a round trip', L.effective(back, 'text') === 'BYPASS OPEN',
		L.effective(back, 'text'));

	// Deleting in a scenario is "not in this network", not a deletion -- the note belongs to Base
	// and to every other scenario too.
	L.deleteElement('label', back.id);
	ok('deleting a note inside a scenario switches it off instead', L.isActive(back) === false
		&& L.labelById(back.id) !== null);
	L.switchScenario('base');
	ok('...and Base still has it', L.labelById(back.id) !== null && L.isActive(back) === true,
		JSON.stringify({ found: !!L.labelById(back.id), active: L.isActive(back) }));

	// In Base it is a real deletion, and it must not leave its scenario values behind for the next
	// element that mints the same id.
	L.deleteElement('label', back.id);
	ok('deleting it in Base really deletes it', L.labelById(back.id) === null);
	ok('...and takes every scenario\'s values on it away', L.getScenarios().every(function (x) {
		return !x.overrides[key];
	}));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nALL PASS');
process.exit(fails ? 1 : 0);

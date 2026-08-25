// THE UNIT-CHANGE DIALOG FOR A PROJECT THAT ALREADY HAS CONTENT -- ROADMAP Task 425. Run with:
//   node dev/lpn-spike/unit-change-harness.js
//
// WHY THIS EXISTS, AND WHY IT IS NOT unit-set-harness.js. That harness proves there is ONE set of
// units and that convertUnitValues() rewrites the right numbers. This one is about the QUESTION:
// what a user is asked when a unit changes under a network they have already typed, and what each
// of the three answers does to the document.
//
// The four claims, and what each failure looks like on the page:
//
//   1. **An empty project is asked nothing.** Non-destructive and Destructive end at the same
//      document when there is no number to reinterpret, so a modal there is a dialog in front of
//      the commonest first action on the page -- the kind of thing Tom has already ruled against
//      when a feature announcement dressed itself as a required choice.
//   2. **Non-destructive leaves every stored number BYTE-IDENTICAL.** Not "within tolerance":
//      identical. It is the suite's standing rule ("changing a unit reinterprets the typed number;
//      it does not convert it"), it is marked absolute, and this page is the one place that ever
//      broke it. A conversion creeping in here is invisible -- 710 comes back 709.9913664.
//   3. **Destructive converts, and ONE undo reverts the whole change.** The whole change means the
//      numbers AND the unit: a snapshot that restored the values under the NEW unit would land the
//      user in the Non-destructive outcome they had just declined, silently.
//   4. **Cancel changes nothing at all, not even the unit** -- and the field list is one name per
//      line, not a comma list (Tom, 2026-08-18).

const { byId, setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tonUnitChange: onUnitChange, remember: rememberUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tunitKey: unitKey, undo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tINPUTS: LPN_UNIT_SELECTS,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs(); undoStack.length = 0;\n" +
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

byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// ---- driving the page the way a hand does -------------------------------------------------------
// A user picks a new option and the browser fires `change`; wireUnitSelects() catches it in the
// capture phase and calls onUnitChange(). init() never runs in a harness, so the select is
// moved and the handler called directly -- the same two steps, in the same order.
function pickUnit(name, key) {
	const sel = unitSelects[name];
	const i = sel.options.findIndex(o => o.value === key);
	if (i < 0) { throw new Error('no option ' + key + ' on ' + name); }
	byId.lpn_dialog_body.children.length = 0;
	byId.lpn_dialog_buttons.children.length = 0;
	sel.selectedIndex = i;
	L.onUnitChange(sel, name);
}
// The dialog as a reader meets it: one line per element, which is exactly the property claim 4 is
// about, so the reader and the assertion cannot disagree.
function dialogLines() {
	function walk(el) {
		if (!el.children || !el.children.length) { return [el.textContent || '']; }
		return el.children.reduce((a, c) => a.concat(walk(c)), []);
	}
	return walk(byId.lpn_dialog_body).filter(s => s !== '');
}
function dialogOpen() { return dialogLines().length > 0; }
function buttonLabels() { return byId.lpn_dialog_buttons.children.map(b => b.textContent); }
function press(label) {
	const b = byId.lpn_dialog_buttons.children.find(x => x.textContent === label);
	if (!b) { throw new Error('no button "' + label + '" -- have ' + JSON.stringify(buttonLabels())); }
	(b._listeners.click || []).forEach(f => f());
}
// A little US network with a number in every quantity the question can be asked about.
function buildNetwork() {
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o',
		lpn_u_pressure: 'psi', lpn_u_flow: 'gpm' });
	L.remember();
	const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	L.setProp(j, 'demand', 150);
	L.setProp(pipe, 'length', 710);
	L.setProp(pipe, 'diameter', 8);
	j.elev = 40;
	L.buildDom();
	return { r: r, j: j, pipe: pipe };
}
const snapshot = () => JSON.stringify([L.getDoc(), L.getScenarios()]);

// ---- 1. an empty project is asked nothing --------------------------------------------------------
{
	console.log('\n--- an empty project is asked nothing ---');
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_flow: 'gpm' });
	L.remember();
	pickUnit('lpn_u_length', 'm');
	ok('no dialog when there is nothing typed', !dialogOpen(), JSON.stringify(dialogLines()));
	// And the change still STANDS. The point of not asking is that there is no question, not that
	// the user's choice is discarded.
	ok('...and the new unit is simply adopted', L.unitKey('lpn_u_length') === 'm', L.unitKey('lpn_u_length'));
	ok('...and nothing went on the undo stack', L.undoDepth() === 0, String(L.undoDepth()));

	// A project with ELEMENTS but no number in this quantity is the same case, and it is the reason
	// the test is "how many values does this unit decide" rather than "is the map empty".
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm' });
	L.remember();
	const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
	L.addLink('pipe', r.id, j.id);
	L.buildDom();
	pickUnit('lpn_u_pressure', 'kpa');
	ok('no dialog for a unit no element carries a number in (no pressure valve here)',
		!dialogOpen(), JSON.stringify(dialogLines()));
}

// ---- 2. the question itself ----------------------------------------------------------------------
{
	console.log('\n--- the question ---');
	buildNetwork();
	pickUnit('lpn_u_flow', 'ft3ps');
	const lines = dialogLines();
	ok('a project with content IS asked', dialogOpen());
	ok('the title is Tom\'s: "This unit decides what your inputs mean"',
		lines[0] === 'This unit decides what your inputs mean', lines[0]);
	// The lead names the unit CHOSEN, not the one still on the strip -- the select was put back
	// while the question stands, so reading it would name the old unit and the sentence would be a lie.
	// (The stub's option text is the unit's own name -- 'ft3ps' where the shipped select says 'cfs'
	// -- because it builds options straight out of lib/Units.lib.php's factor table. What is under
	// test is that the OPTION'S OWN TEXT is used, so the assertion reads it from the select rather
	// than hard-coding either spelling.)
	const chosen = unitSelects.lpn_u_flow.options.find(o => o.value === 'ft3ps').textContent;
	ok('the lead names the chosen unit and what it is the unit OF',
		lines[1] === chosen + ' is the unit of what you enter for:', lines[1]);
	// **ONE NAME PER LINE, NOT A COMMA LIST** (Tom, 2026-08-18).
	const fieldLines = lines.slice(2, lines.indexOf(global.EngCalcs.pageConfig.lpn_units_options_head));
	ok('the fields it decides are listed', fieldLines.length >= 2, JSON.stringify(fieldLines));
	ok('...one name per line', fieldLines.every(l => l.indexOf(',') < 0), JSON.stringify(fieldLines));
	ok('...and Demand is one of them', fieldLines.indexOf('Demand') >= 0, JSON.stringify(fieldLines));
	// Reworded by sprint 459's Wave 0 (2026-08-24): 'Options for units change:' is a noun pile that
	// parses two ways -- [options for units] [change] or [options for] [units change]. The heading is
	// read from the key rather than retyped here, so the next rewording is not a second failure.
	ok('the options are headed', lines.indexOf(global.EngCalcs.pageConfig.lpn_units_options_head) >= 0, JSON.stringify(lines));
	ok('Non-destructive says it leaves the inputs alone',
		lines.some(l => /^Non-destructive: leaves every input as it is/.test(l)), JSON.stringify(lines));
	ok('Destructive says it rewrites them and that it loses the originals',
		lines.some(l => /^Destructive: rewrites every input/.test(l) && /loses the original inputs/.test(l)),
		JSON.stringify(lines));
	// The answer to Task 425's open question, said where the user is deciding rather than only in a
	// code comment: the undo snapshot IS the backup, so the dialog has to promise it.
	ok('...and that Undo puts them back', lines.some(l => /Undo puts them back/.test(l)));
	ok('three buttons, Non-destructive first and Cancel last',
		JSON.stringify(buttonLabels()) === JSON.stringify(['Non-destructive', 'Destructive', 'Cancel']),
		JSON.stringify(buttonLabels()));
	// Nothing has happened yet: the select is back on the old unit and the document is untouched.
	ok('the unit is held at the old one while the question stands',
		L.unitKey('lpn_u_flow') === 'gpm', L.unitKey('lpn_u_flow'));
}

// ---- 3. Cancel changes nothing at all, not even the unit -----------------------------------------
{
	console.log('\n--- Cancel ---');
	buildNetwork();
	const before = snapshot();
	pickUnit('lpn_u_diameter', 'mm');
	press('Cancel');
	ok('Cancel leaves the document byte-identical', snapshot() === before);
	ok('...and leaves the UNIT alone too', L.unitKey('lpn_u_diameter') === 'in', L.unitKey('lpn_u_diameter'));
	ok('...and takes no undo snapshot', L.undoDepth() === 0, String(L.undoDepth()));
	// A cancelled change must not poison the next one: picking the same unit again asks again.
	pickUnit('lpn_u_diameter', 'mm');
	ok('...and the next attempt still asks', dialogOpen());
	press('Cancel');
}

// ---- 4. Non-destructive: every stored number BYTE-IDENTICAL ---------------------------------------
{
	console.log('\n--- Non-destructive ---');
	const net = buildNetwork();
	const before = snapshot();
	pickUnit('lpn_u_length', 'm');
	press('Non-destructive');
	ok('the unit changed', L.unitKey('lpn_u_length') === 'm', L.unitKey('lpn_u_length'));
	ok('...and every stored number is byte-identical', snapshot() === before);
	ok('...710 is still exactly 710', net.pipe._length === 710, String(net.pipe._length));
	ok('...and nothing went on the undo stack, because nothing was rewritten',
		L.undoDepth() === 0, String(L.undoDepth()));
	// Every input unit, not just the one: the standing rule is suite-wide and a per-unit exception
	// would be exactly the kind of quiet conversion site CLAUDE.md warns is always the third one.
	L.INPUTS.forEach(name => {
		const net2 = buildNetwork();
		const b = snapshot(), from = L.unitKey(name);
		const sel = unitSelects[name];
		const other = sel.options.map(o => o.value).find(v => v !== from);
		pickUnit(name, other);
		if (dialogOpen()) { press('Non-destructive'); }
		ok(name + ': Non-destructive rewrites nothing', snapshot() === b, from + ' -> ' + other);
		void net2;
	});
}

// ---- 5. Destructive: converts, and ONE undo reverts the whole change -------------------------------
{
	console.log('\n--- Destructive, and the undo that answers the backup question ---');
	const net = buildNetwork();
	const before = snapshot();
	pickUnit('lpn_u_length', 'm');
	press('Destructive');
	ok('the unit changed', L.unitKey('lpn_u_length') === 'm');
	ok('...and 710 ft was rewritten as 216.408 m',
		Math.abs(net.pipe._length - 710 * 0.3048) < 1e-9, String(net.pipe._length));
	ok('...and it is NOT byte-identical, which is the whole difference between the two answers',
		snapshot() !== before);
	ok('...and one snapshot was taken', L.undoDepth() === 1, String(L.undoDepth()));

	// **ONE UNDO REVERTS THE WHOLE SET** -- the numbers and the unit. Restoring the numbers under
	// the NEW unit would be half an undo, and it would leave the user in the Non-destructive
	// outcome they had just declined.
	L.undo();
	ok('one undo puts every number back, byte-identical', snapshot() === before, String(L.getDoc().links[0]._length));
	ok('...AND puts the unit back', L.unitKey('lpn_u_length') === 'ft', L.unitKey('lpn_u_length'));
	ok('...and the stack is empty again', L.undoDepth() === 0, String(L.undoDepth()));
	// And the page is not left half-armed: the next unit change compares against the restored unit,
	// so it asks rather than silently deciding the user chose nothing.
	pickUnit('lpn_u_length', 'm');
	ok('...and the next change still asks its question', dialogOpen());
	press('Cancel');

	// A scenario override is a value in the same unit as the property it overrides, so it converts
	// with Base -- and comes back with Base. unit-set-harness.js proves the conversion; what is
	// checked here is that the UNDO reaches it too, which is the half a snapshot can silently miss.
	const net2 = buildNetwork();
	L.getScenarios().push({ id: 's1', name: 'Fire flow', overrides: { ['link:' + net2.pipe.id]: { length: 800 } } });
	const b2 = snapshot();
	pickUnit('lpn_u_length', 'm');
	press('Destructive');
	const ov = L.getScenarios()[1].overrides['link:' + net2.pipe.id].length;
	ok('a scenario override converts with Base', Math.abs(ov - 800 * 0.3048) < 1e-9, String(ov));
	L.undo();
	ok('...and one undo restores it with Base', snapshot() === b2,
		String(L.getScenarios()[1].overrides['link:' + net2.pipe.id].length));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

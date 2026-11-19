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
//   1. **An empty project is asked nothing.** Keep and Convert end at the same
//      document when there is no number to reinterpret, so a modal there is a dialog in front of
//      the commonest first action on the page -- the kind of thing Tom has already ruled against
//      when a feature announcement dressed itself as a required choice.
//   2. **Keep leaves every stored number BYTE-IDENTICAL.** Not "within tolerance":
//      identical. It is the suite's standing rule ("changing a unit reinterprets the typed number;
//      it does not convert it"), it is marked absolute, and this page is the one place that ever
//      broke it. A conversion creeping in here is invisible -- 710 comes back 709.9913664.
//   3. **Convert converts, and ONE undo reverts the whole change.** The whole change means the
//      numbers AND the unit: a snapshot that restored the values under the NEW unit would land the
//      user in the Keep outcome they had just declined, silently.
//   4. **Cancel changes nothing at all, not even the unit** -- and the field list is one name per
//      line, not a comma list (Tom, 2026-08-18).

const { byId, setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');
// The dialog's own text, read from the real lib/lang.ec.en.php the stub loads -- the same reason
// the options heading below has always been read from its key rather than retyped
// (dev/scripts/harness_wording_check.php).
const PC = global.EngCalcs.pageConfig;

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tonUnitChange: onUnitChange, remember: rememberUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tunitKey: unitKey, undo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tINPUTS: LPN_UNIT_SELECTS, getSettings: function () { return settings; },\n" +
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
// The Decimals field(s) the question carries, found by the attribute the page gives each one.
function decimalFields() {
	const out = [];
	(function walk(el) { (el.children || []).forEach(c => { if (c._tag === 'input' && c.getAttribute('data-decimals-for')) { out.push(c); } walk(c); }); })(byId.lpn_dialog_body);
	return out;
}
function setDecimals(n) { decimalFields().forEach(f => { f.value = String(n); }); }
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
	// TYPED, as the Properties box records a typed length: Auto off. An Auto length is the slope
	// distance (Task 643) and follows a unit switch that changes the rise, so it is not the subject.
	pipe.lenAuto = false;
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
	// Tom, 2026-11-18: "Convert inputs from old unit to new? [Convert] [Keep] [Cancel]". The names are
	// the OPTIONS' own text (the stub spells ft3ps where the shipped select says cfs), read from the
	// select rather than hard-coded.
	const optText = (k) => unitSelects.lpn_u_flow.options.find(o => o.value === k).textContent;
	ok('the question names the old unit and the new one',
		lines[0] === PC.lpn_units_convert_q.replace('{old}', optText('gpm')).replace('{new}', optText('ft3ps')), lines[0]);
	// **ONE NAME PER LINE, NOT A COMMA LIST** (Tom, 2026-08-18).
	const fieldLines = lines.slice(1, lines.indexOf(PC.lpn_labels_col_decimals));
	ok('the fields it decides are listed', fieldLines.length >= 2, JSON.stringify(fieldLines));
	ok('...one name per line', fieldLines.every(l => l.indexOf(',') < 0), JSON.stringify(fieldLines));
	// "Base demand" since 2026-08-25: this list is the TYPED fields a unit decides the meaning of,
	// and the resolved Demand beside it is not typed anywhere.
	ok('...and Base demand is one of them', fieldLines.indexOf('Base demand') >= 0, JSON.stringify(fieldLines));
	ok('a Decimals field follows the list', lines.indexOf(PC.lpn_labels_col_decimals) > 0, JSON.stringify(lines));
	ok('three buttons: Convert, Keep, Cancel',
		JSON.stringify(buttonLabels()) === JSON.stringify([PC.lpn_convas_ok, PC.lpn_units_keep, PC.lpn_cancel]),
		JSON.stringify(buttonLabels()));
	ok('the old Destructive and Non-destructive words are gone', lines.concat(buttonLabels()).every(l => !/destructive/i.test(l)));
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

// ---- 4. Keep: every stored number BYTE-IDENTICAL ---------------------------------------
{
	console.log('\n--- Keep ---');
	const net = buildNetwork();
	const before = snapshot();
	pickUnit('lpn_u_length', 'm');
	press('Keep');
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
		if (dialogOpen()) { press('Keep'); }
		ok(name + ': Keep rewrites nothing', snapshot() === b, from + ' -> ' + other);
		void net2;
	});
}

// ---- 5. Convert: converts, and ONE undo reverts the whole change -------------------------------
{
	console.log('\n--- Convert, and the undo that answers the backup question ---');
	const net = buildNetwork();
	const before = snapshot();
	pickUnit('lpn_u_length', 'm');
	setDecimals(3);
	press('Convert');
	ok('the unit changed', L.unitKey('lpn_u_length') === 'm');
	ok('...and 710 ft was rewritten as 216.408 m (Decimals 3)',
		net.pipe._length === 216.408, String(net.pipe._length));
	ok('...and it is NOT byte-identical, which is the whole difference between the two answers',
		snapshot() !== before);
	ok('...and one snapshot was taken', L.undoDepth() === 1, String(L.undoDepth()));

	// **ONE UNDO REVERTS THE WHOLE SET** -- the numbers and the unit. Restoring the numbers under
	// the NEW unit would be half an undo, and it would leave the user in the Keep
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
	setDecimals(6);
	press('Convert');
	const ov = L.getScenarios()[1].overrides['link:' + net2.pipe.id].length;
	ok('a scenario override converts with Base', Math.abs(ov - 800 * 0.3048) < 1e-6, String(ov));
	L.undo();
	ok('...and one undo restores it with Base', snapshot() === b2,
		String(L.getScenarios()[1].overrides['link:' + net2.pipe.id].length));
}

// ---- 6. Decimals, for Length and for Volume ----------------------------------------------------------
{
	console.log('\n--- Decimals ---');
	// Length: the default is the number of places the page shows the new unit with (meters: 1).
	let net = buildNetwork();
	pickUnit('lpn_u_length', 'm');
	ok('the Decimals field opens blank (no rounding)', decimalFields().length === 1 && decimalFields()[0].value === '', decimalFields().map(f => f.value).join());
	press('Convert');
	ok('Length: blank Decimals does not round (710 ft -> 216.408 m)', Math.abs(net.pipe._length - 216.408) < 1e-9, String(net.pipe._length));
	L.undo();
	net = L.getDoc().links[0];
	pickUnit('lpn_u_length', 'm');
	setDecimals(0);
	press('Convert');
	ok('Length: Decimals 0 rounds to exactly 0 places (710 ft -> 216)', L.getDoc().links[0]._length === 216, String(L.getDoc().links[0]._length));
	L.undo();
	pickUnit('lpn_u_length', 'm');
	setDecimals(4);
	press('Convert');
	ok('Length: Decimals 4 keeps four places (216.408)', L.getDoc().links[0]._length === 216.408, String(L.getDoc().links[0]._length));
	L.undo();
	// A blank or negative entry falls back to the default rather than writing garbage.
	pickUnit('lpn_u_length', 'm');
	setDecimals('');
	press('Convert');
	ok('Length: a blank Decimals field means no rounding', Math.abs(L.getDoc().links[0]._length - 216.408) < 1e-9, String(L.getDoc().links[0]._length));
	L.undo();
	// Keep never rounds, whatever the field says.
	const before = snapshot();
	pickUnit('lpn_u_length', 'm');
	setDecimals(0);
	press('Keep');
	ok('Keep ignores Decimals and leaves every number as typed', snapshot() === before);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm' });
	L.remember();

	// Volume: a tank's Minimum volume, 20,000 ft3 (EPANET's own cubic feet), asked about gal.
	function volumeNetwork() {
		L.reset();
		L.setCanvas(800, 600);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm', lpn_u_volume: 'ft3' });
		L.remember();
		const t = L.addNode('tank', 0, 0);
		L.setProp(t, 'minVolume', 20000);
		L.buildDom();
		return t;
	}
	volumeNetwork();
	const T = () => L.getDoc().nodes[0];
	pickUnit('lpn_u_volume', 'gal');
	const vlines = dialogLines();
	const volText = (k) => unitSelects.lpn_u_volume.options.find(o => o.value === k).textContent;
	ok('Volume asks the same question, naming ft3 and gal',
		vlines[0] === PC.lpn_units_convert_q.replace('{old}', volText('ft3')).replace('{new}', volText('gal')), vlines[0]);
	ok('...lists Minimum volume as what it decides', vlines.indexOf(PC.lpn_field_tank_minvol) >= 0, JSON.stringify(vlines));
	ok('...with the same three buttons', JSON.stringify(buttonLabels()) === JSON.stringify([PC.lpn_convas_ok, PC.lpn_units_keep, PC.lpn_cancel]));
	ok('...and a Decimals field that opens blank', decimalFields().length === 1 && decimalFields()[0].value === '', decimalFields().map(f => f.value).join());
	press('Convert');
	ok('Volume: blank Decimals gives the full 149610.389... gal', Math.abs(T().minVolume - 149610.3896) < 1e-3 && T().minVolume !== 149610.39, String(T().minVolume));
	ok('...and the unit is gal', L.unitKey('lpn_u_volume') === 'gal');
	L.undo();
	ok('...one Undo restores 20000 and ft3', T().minVolume === 20000 && L.unitKey('lpn_u_volume') === 'ft3', T().minVolume + ' ' + L.unitKey('lpn_u_volume'));
	pickUnit('lpn_u_volume', 'gal');
	setDecimals(2);
	press('Convert');
	ok('Volume: Decimals 2 gives 149610.39', T().minVolume === 149610.39, String(T().minVolume));
	L.undo();
	pickUnit('lpn_u_volume', 'gal');
	press('Keep');
	ok('Volume: Keep reads the typed 20000 as gallons', T().minVolume === 20000 && L.unitKey('lpn_u_volume') === 'gal', T().minVolume + ' ' + L.unitKey('lpn_u_volume'));
	volumeNetwork();
	pickUnit('lpn_u_volume', 'gal');
	press('Cancel');
	ok('Volume: Cancel leaves the unit as it was', L.unitKey('lpn_u_volume') === 'ft3' && T().minVolume === 20000);
	// Exactly the Decimals asked for, even when that gives zero.
	T().minVolume = 0.0004;
	pickUnit('lpn_u_volume', 'gal');
	setDecimals(0);
	press('Convert');
	ok('Volume: Decimals 0 rounds exactly (0.0004 ft3 -> 0 gal)', T().minVolume === 0, String(T().minVolume));
}

// ---- 7. Rounding is exactly the Decimals chosen --------------------------------------------------
{
	console.log('\n--- exact Decimals ---');
	function one(dec, want) {
		L.reset(); L.setCanvas(800, 600);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'mm', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'lps', lpn_u_roughness: 'mm', lpn_u_volume: 'ft3' });
		L.remember();
		const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
		const pipe = L.addLink('pipe', r.id, j.id);
		pipe.diameter = undefined; L.setProp(pipe, 'diameter', 150); L.buildDom();
		pickUnit('lpn_u_diameter', 'in');
		setDecimals(dec);
		press('Convert');
		ok('150 mm to in at Decimals ' + dec + ' is ' + want, L.getDoc().links[0]._diameter === want, String(L.getDoc().links[0]._diameter));
		L.undo();
		ok('Undo restores 150 mm', L.getDoc().links[0]._diameter === 150 && L.unitKey('lpn_u_diameter') === 'mm', L.getDoc().links[0]._diameter + ' ' + L.unitKey('lpn_u_diameter'));
	}
	one(0, 6); one(2, 5.91);
	// Blank: full precision, and the Settings tolerances are never rounded even when Decimals is typed.
	function exact(dec, want, label) {
		L.reset(); L.setCanvas(800, 600);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'mm', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'lps', lpn_u_roughness: 'mm', lpn_u_volume: 'ft3' });
		L.remember();
		const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
		const pipe = L.addLink('pipe', r.id, j.id);
		pipe.diameter = undefined; L.setProp(pipe, 'diameter', 150); L.buildDom();
		pickUnit('lpn_u_diameter', 'in');
		setDecimals(dec);
		press('Convert');
		const got = L.getDoc().links[0]._diameter;
		ok(label, Math.abs(got - want) <= 1e-9 * want, String(got));
	}
	exact('', 150 / 25.4, '150 mm to in with blank Decimals is 5.905511811...');
	exact(10, 5.9055118110, '150 mm to in at typed Decimals 10 is obeyed (not clamped to 8)');
	// Blank Decimals stores no binary noise: 14 in and 24 in to mm are 355.6 and 609.6, not 355.59999999999997.
	{
		L.reset(); L.setCanvas(800, 600);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm', lpn_u_roughness: 'mm', lpn_u_volume: 'ft3' });
		L.remember();
		const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0), k = L.addNode('junction', 200, 0);
		const p1 = L.addLink('pipe', r.id, j.id), p2 = L.addLink('pipe', j.id, k.id);
		p1.diameter = undefined; p2.diameter = undefined; L.setProp(p1, 'diameter', 14); L.setProp(p2, 'diameter', 24); L.buildDom();
		pickUnit('lpn_u_diameter', 'mm');
		setDecimals('');
		press('Convert');
		const ds = L.getDoc().links.map(x => String(x._diameter)).join();
		ok('14 in and 24 in to mm with blank Decimals store 355.6 and 609.6', ds === '355.6,609.6', ds);
	}
	{
		L.reset(); L.setCanvas(800, 600);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm', lpn_u_roughness: 'mm' });
		L.remember();
		const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0), p = L.addLink('pipe', r.id, j.id);
		L.getSettings().method = 'dw';
		L.setProp(p, 'roughness', 2); L.buildDom();
		pickUnit('lpn_u_roughness', 'ft');
		press('Convert');
		const got = L.getDoc().links[0]._roughness;
		ok('Darcy-Weisbach roughness 2 mm -> ft with blank Decimals within 1e-9', Math.abs(got - 2 / 304.8) <= 1e-9 * 2 / 304.8, String(got));
	}
}

// ---- 8. Enter after a keyboard unit change keeps (code review: Convert was the focused button) ------
{
	console.log('\n--- the focused answer is Keep ---');
	buildNetwork();
	pickUnit('lpn_u_length', 'm');
	const btns = byId.lpn_dialog_buttons.children;
	ok('the visual order is still Convert, Keep, Cancel', JSON.stringify(btns.map(b => b.textContent)) === JSON.stringify([PC.lpn_convas_ok, PC.lpn_units_keep, PC.lpn_cancel]));
	ok('Keep holds the focus', global.document.activeElement === btns[1], global.document.activeElement && global.document.activeElement.textContent);
	press('Keep');
}

// ---- 9. Settings > New assets numbers, the legacy Volume fallback, the stale token -------------------
{
	console.log('\n--- the other numbers a Convert owes ---');
	buildNetwork();
	const d0 = L.getSettings().defaults.diameter;
	pickUnit('lpn_u_diameter', 'mm');
	press('Convert');
	const d1 = L.getSettings().defaults.diameter;
	ok('Convert moves the New assets diameter too (' + d0 + ' in -> ' + d1 + ' mm)', Math.abs(d1 - d0 * 25.4) <= 5e-4 * d0 * 25.4, String(d1));
	buildNetwork();
	const d2 = L.getSettings().defaults.diameter;
	pickUnit('lpn_u_diameter', 'mm');
	press('Keep');
	ok('Keep leaves the New assets diameter alone', L.getSettings().defaults.diameter === d2);
	// A project saved before the Volume selector: its volume unit comes from its own length unit.
	['ft', 'm', 'in'].forEach((k) => {
		const units = { lpn_u_length: k }, copy = JSON.stringify(units);
		L.applyUnitSelections(units);
		const want = k === 'm' ? 'm3' : 'ft3';
		ok('a legacy project in ' + k + ' opens on ' + want + ' whatever the last project left', L.unitKey('lpn_u_volume') === want, L.unitKey('lpn_u_volume'));
		ok('...and the caller\'s units object is not written to', JSON.stringify(units) === copy);
		L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_volume: 'l' });
	});
	// The converted Minimum volume sheds the file's text for the old number.
	L.reset(); L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_flow: 'gpm', lpn_u_volume: 'ft3' });
	L.remember();
	const t = L.addNode('tank', 0, 0);
	L.setProp(t, 'minVolume', 20000); L.getDoc().nodes[0].tok = { minVolume: '20000.0' };
	L.buildDom();
	pickUnit('lpn_u_volume', 'gal');
	press('Convert');
	ok('the converted Minimum volume keeps no stale .inp text', !(L.getDoc().nodes[0].tok && L.getDoc().nodes[0].tok.minVolume), JSON.stringify(L.getDoc().nodes[0].tok));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

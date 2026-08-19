// The bottom pane — ROADMAP Task 434. Run with:
//   node dev/lpn-spike/pane-harness.js
//
// WHY THIS EXISTS. The pane is a container, so nothing it does is arithmetic anyone can check by
// reading a number off the screen. Every way it can be wrong is a layout the user has to fight:
//
//   1. **It tells the canvas how tall to be.** The map's height has been MEASURED since Task 432,
//      and a pane that writes a height instead of asking for a re-measure creates a second source
//      of truth for one number — which is how the map ends up under the fold or the page ends up
//      scrolling. The pane sits in normal flow and calls applyMapHeight(), full stop.
//      (dev/lpn-spike/map-height-harness.js owns the other half: that every applyMapHeight()
//      caller is an environment event. Opening a pane IS one.)
//   2. **A drag with no ceiling eats the map.** The grip must always leave a canvas worth looking
//      at, and it must always leave the pane itself usable at the other end.
//   3. **A tab that draws on the MAP does not clean up after itself.** The profile paints a route
//      highlight; leave its tab, or close the pane, and that highlight belongs to something the
//      user can no longer see. There are three doors out and they must all go through one hook.
//   4. **The pane's height and open tab get saved into the PROJECT.** They are facts about the
//      window you are sitting at, not about the network — a colleague opening your file must not
//      inherit your screen.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');

// **THE STUB MUST KNOW ONE PHYSICAL RELATIONSHIP: a box that has been given a height MEASURES that
// height.** Without it the clamp, the drag and the "remembered height" are all asserted against a
// constant 500 and the harness passes whatever the code does.
const paneBody = byId.lpn_pane_body;
paneBody.getBoundingClientRect = function () {
	const h = parseFloat(this.style.height) || 0;
	return { left: 0, top: 0, right: 1000, bottom: h, width: 1000, height: h };
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\twirePane: wirePane, openPane: openPane, closePane: closePane, togglePane: togglePane,\n" +
	"\t\tsetPaneTab: setPaneTab, paneIsOpen: paneIsOpen, paneState: function () { return paneState; },\n" +
	"\t\tclampPaneHeight: clampPaneHeight, paneMaxHeight: paneMaxHeight,\n" +
	"\t\tprofileIsOpen: profileIsOpen, pathLayer: function () { return profilePathLayer; },\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	// The junctions tab, driven the way the user drives it: sort by clicking a heading, type in a
	// cell, read what the table says.
	"\t\tsortJunctions: sortJunctions, renderJunctions: renderJunctions,\n" +
	"\t\tjunctionOrder: function () { return junctionRowsInOrder().map(function (n) { return n.id; }); },\n" +
	"\t\tjunctionCells: function () { return junctionCells; },\n" +
	// The scenario machinery through its own doors -- createScenario()/switchScenario(), never a
	// hand-built scenario object, or the seam under test would be tested against a shape the page
	// does not use.
	"\t\tsetProp: setProp, effective: effective,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tscenarioIds: function () { return scenarios.map(function (s) { return s.id; }); },\n" +
	// Layers, so a node can really be added and the route highlight really drawn.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');
function stripComments(s) { return s.replace(/^[ \t]*\/\/.*$/gm, ''); }
function fnBody(name) {
	const at = src.indexOf('function ' + name + '(');
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return stripComments(src.slice(at, end));
}

// ---- 1. it is BELOW the map, in flow, and outside the calculator form -----------------------
console.log('\n--- where the pane sits ---');
{
	const canvasAt = php.indexOf('id="lpn_canvas"');
	const formEnd = php.indexOf('\n</form>');
	const paneAt = php.indexOf('id="lpn_pane"');
	report(canvasAt > 0 && paneAt > canvasAt, 'the pane markup comes after the canvas');
	report(paneAt > formEnd, '...and outside #formInput, so a stray Enter in a tab cannot submit it');
	// NOT position:fixed and NOT absolute: an out-of-flow pane is invisible to flowBelowMap(), which
	// measures `body.bottom - svg.bottom`, and the map would then be sized as though it were not
	// there.
	const paneMarkup = php.slice(paneAt, paneAt + 400);
	report(!/position\s*:\s*(fixed|absolute)/.test(paneMarkup), 'the pane is in normal flow');
	report(/\.lpn-pane\s*\{[^}]*display:\s*flex/.test(css), 'and is laid out as a column of grip, tabs, body');
}

// ---- 2. the canvas is re-measured, never told ------------------------------------------------
console.log('\n--- the map height stays measured ---');
{
	const apply = fnBody('applyPaneLayout');
	report(/applyMapHeight\(\);/.test(apply), 'applyPaneLayout() asks for a re-measure');
	report(!/lpn_canvas|svg\.setAttribute\(\s*'height'/.test(apply),
		'...and never writes a canvas height itself');
	// One door in and out of the DOM. Open, close, switch and drag all end in applyPaneLayout(), so
	// there is no second place for the pane's idea of its own size to live.
	['openPane', 'closePane', 'setPaneTab'].forEach(function (f) {
		report(/applyPaneLayout\(\);/.test(fnBody(f)), f + '() goes through applyPaneLayout()');
	});
	report(/applyPaneLayout\(\);/.test(fnBody('wirePane')), 'and so does the drag handler');
}

// ---- 3. open, close, toggle, and which tab ---------------------------------------------------
console.log('\n--- the state machine ---');
{
	L.wirePane();
	report(!L.paneIsOpen(), 'a first visit opens with the pane CLOSED — the map is what the page is for');
	L.openPane('profile');
	report(L.paneIsOpen() && byId.lpn_pane.style.display === 'flex', 'opening shows it');
	report(paneBody.style.height === '260px', '...at the default height', paneBody.style.height);
	report(L.profileIsOpen(), '...on the profile tab');
	L.togglePane();
	report(!L.paneIsOpen() && byId.lpn_pane.style.display === 'none', 'the toolbar toggle closes it');
	report(!L.profileIsOpen(), '...and the profile is not "open" behind a closed pane');
	L.togglePane();
	report(L.paneIsOpen(), 'and opens it again');
	// A tab that does not exist must not blank the pane. Belt and braces for a stored state written
	// by a later version of the page and read by an earlier one.
	L.setPaneTab('no-such-tab');
	report(L.paneState().tab === 'profile', 'an unknown tab id is ignored, not obeyed');
}

// ---- 4. the ceiling and the floor ------------------------------------------------------------
console.log('\n--- a drag can never eat the map ---');
{
	const vh = 900;   // the stub's window
	const max = L.paneMaxHeight();
	report(max <= Math.floor(vh * 0.8), 'the pane can never take the whole window', max + ' of ' + vh);
	report(L.clampPaneHeight(100000) === max, 'an absurd drag stops at the ceiling', String(max));
	report(L.clampPaneHeight(1) === 110, 'and a drag to nothing stops at the pane floor');
	report(L.clampPaneHeight(0) === 260, 'a missing height falls back to the default, not to zero');

	// The grip, driven the way a pointer drives it. UP is TALLER.
	const grip = byId.lpn_pane_grip;
	const down = grip._listeners.pointerdown[0], move = grip._listeners.pointermove[0],
		up = grip._listeners.pointerup[0];
	const before = parseFloat(paneBody.style.height);
	down({ clientY: 600, pointerId: 1, preventDefault: function () {} });
	move({ clientY: 540, pointerId: 1 });
	report(parseFloat(paneBody.style.height) === before + 60, 'dragging the top edge UP makes the pane taller',
		before + ' -> ' + paneBody.style.height);
	move({ clientY: 660, pointerId: 1 });
	report(parseFloat(paneBody.style.height) === before - 60, '...and DOWN makes it shorter');
	up({ pointerId: 1 });
	move({ clientY: 100, pointerId: 1 });
	report(parseFloat(paneBody.style.height) === before - 60, 'a move after the pointer is up does nothing');
}

// ---- 5. remembered, per browser, never in the project ----------------------------------------
console.log('\n--- what is remembered, and where ---');
{
	const raw = global.localStorage.getItem('lpn_pane');
	report(!!raw, 'the pane state is written to localStorage');
	const saved = JSON.parse(raw);
	report(saved.open === true && saved.tab === 'profile' && saved.h === parseFloat(paneBody.style.height),
		'...and it is the open state, the tab and the height', raw);
	// THE PROJECT MUST NOT CARRY IT. A colleague opening your file gets your network, not your
	// window. Checked against the real serializer rather than by reading the function, because the
	// failure mode is a key added somewhere down inside it.
	const doc = JSON.stringify(L.serialize());
	report(doc.indexOf('paneState') < 0 && doc.indexOf('"pane"') < 0,
		'serializeProject() knows nothing about the pane');

	// A stored state is APPLIED on the next load. Same door as the first run: wirePane().
	global.localStorage.setItem('lpn_pane', JSON.stringify({ open: true, h: 333, tab: 'profile' }));
	L.wirePane();
	report(L.paneIsOpen() && paneBody.style.height === '333px', 'a remembered pane comes back the size it was',
		paneBody.style.height);
	global.localStorage.setItem('lpn_pane', '{not json');
	L.wirePane();
	report(L.paneIsOpen() && paneBody.style.height === '333px', 'corrupt stored state changes nothing');
}

// ---- 6. the profile's route highlight has ONE way out ----------------------------------------
console.log('\n--- leaving the profile clears its route ---');
{
	const tabs = src.slice(src.indexOf('var paneTabs = ['), src.indexOf('var paneState ='));
	report(/hide: function \(\) \{ drawProfilePath\(null\); \}/.test(tabs),
		'the profile tab declares a hide hook that clears the map highlight');
	// The three doors out. Each must run the outgoing tab's hook, and each is a separate line of
	// code that could forget.
	report(/if \(paneState\.open && was && was !== now && was\.hide\) \{ was\.hide\(\); \}/.test(fnBody('setPaneTab')),
		'door 1: switching tabs');
	report(/if \(t && t\.hide\) \{ t\.hide\(\); \}/.test(fnBody('closePane')), 'door 2: the pane X');
	report(/closePane\(\);/.test(fnBody('togglePane')), 'door 3: the toolbar toggle, through the same close');

	// And live: with a real network drawn, opening the profile paints a layer and closing removes it.
	L.addNode('reservoir', 0, 0);
	L.openPane('profile');
	L.closePane();
	report(!L.pathLayer(), 'after closing, no route highlight is left on the map');
}

// ---- 7. the right edge of the toolbar --------------------------------------------------------
console.log('\n--- Find and the pane toggle, at the right edge ---');
{
	const bar = fnBody('wireToolbar');
	const endAt = bar.indexOf("endGroup.className += ' lpn-toolbar-end'");
	report(endAt > 0, 'there is an end group on the toolbar');
	const end = bar.slice(endAt);
	report(/toggleFindPopup\(findBtn\)/.test(end),
		'it opens the SAME Find panel the menu row does — the goto-by-ID search, not a second one');
	report(/id = 'lpn_pane_btn'/.test(end) && /togglePane/.test(end), 'and carries the pane toggle');
	report(/aria-pressed/.test(end), '...as a pressed/unpressed toggle, since the pane X can close it too');
	report(/\.lpn-toolbar-end\s*\{[^}]*margin-left:\s*auto/.test(css),
		'the group is pushed to the right edge by an auto margin, at every window width');
	report(/#lpn_toolbar\s*\{[^}]*display:\s*flex/.test(css), '...which needs the strip to be a flex row');
}

// ---- 8. what is deliberately NOT in the BOTTOM pane -------------------------------------------
// Tom, 2026-08-18, explicitly: Settings and Labels are not tabs of the bottom pane, and the left
// pane of epanet-js is not wanted at all. Recorded as a check because "we decided not to" is
// exactly the kind of ruling a later pass re-litigates by accident.
//
// LABELS MOVED TWICE: to the right pane (Task 427), and then into the Settings box (Task 441, Tom
// abandoning the right pane's contents the same day). So the ruling this guards is now three-sided:
// not a bottom-pane tab, not a pull-down of its own, and NOT TWO HOMES -- the checkbox lists exist
// exactly once, inside #lpn_settings_box.
console.log('\n--- the rulings that are easiest to undo by accident ---');
{
	const tabs = src.slice(src.indexOf('var paneTabs = ['), src.indexOf('var paneState ='));
	report(!/settings|labels/i.test(tabs), 'Settings and Labels are not tabs of the bottom pane');
	report(php.indexOf('lpn_labels_popup') < 0, 'the Labels pull-down is gone, not duplicated');
	report(php.indexOf('lpn_settings_popup') < 0,
		'...and so is the Settings pull-down — Settings is the two-pane box now');
	const box = php.indexOf('id="lpn_settings_box"');
	report(box > 0, 'the Settings box is in the page');
	['lpn_labels_node_fields', 'lpn_labels_link_fields', 'lpn_labels_options',
		'lpn_set_id_fields', 'lpn_set_default_fields', 'lpn_set_map_fields', 'lpn_set_units_fields',
		'lpn_set_time_fields', 'lpn_set_hydraulics_fields', 'lpn_set_page_fields',
		'lpn_set_colors_node', 'lpn_set_colors_link', 'lpn_set_colors_shared'].forEach((id) => {
		const at = php.indexOf('id="' + id + '"');
		report(at > box, `...and ${id} lives inside it`, at < 0 ? 'missing' : '');
	});
	// The two panes and the search, which are what makes it the paradigm Tom named rather than a
	// tall pull-down with an X on it.
	report(php.indexOf('id="lpn_setbox_index"') > box, 'it has an index pane');
	report(php.indexOf('id="lpn_setbox_content"') > box, '...and a content pane');
	report(php.indexOf('id="lpn_setbox_filter"') > box, '...and a filter across the top');
	report(php.indexOf('id="lpn_setbox_close"') > box, '...and an X, because it is a box, not a menu');
	report(/makePanelDraggable\(box/.test(fnBody('wireSettingsBox')),
		'...and it drags by its chrome, like the property popup');
	// NOTHING COLLAPSES (Tom: "No need ever to collapse; just scroll/jump to your section"). The
	// <details> the right pane used are gone, and section() no longer builds a disclosure button.
	report(!/lpn-rp-sec/.test(php), 'no collapsing <details> sections are left in the page');
	report(!/aria-expanded/.test(fnBody('rebuildSettingsFields')),
		'...and the Settings sub-headings are headings, not disclosure buttons');
	// THE RIGHT PANE SURVIVES, EMPTY (Tom: "For now we can keep the right pane, but empty it").
	const rp = php.indexOf('id="lpn_rpane"');
	report(rp > 0, 'the right pane is still in the page');
	report(php.indexOf('id="lpn_rpane_empty"') > rp, '...and says it is empty rather than being blank');
	report(php.indexOf('id="lpn_rpane_grip"') > rp, '...and keeps its grip, ready for whatever docks next');
	// One home, not two: a second copy of any of these ids is a second checkbox list, and the two
	// would drift the first time one of them was rebuilt.
	['lpn_labels_node_fields', 'lpn_labels_link_fields'].forEach((id) => {
		report(php.split('id="' + id + '"').length === 2, `${id} exists exactly once`);
	});
	// AND THE LEGEND IS NOT COVERED (Tom: "The right pane covers the map, including the labels
	// legend"). A right-hand legend position carries the panel's width as an inset, so the fix is
	// arithmetic rather than somebody remembering to move it.
	report(/LEGEND_RIGHT\s*=\s*'calc\(4px \+ var\(--lpn-overlay-right/.test(src),
		'a right-hand legend clears the right pane by a published inset');
	report(/--lpn-overlay-right/.test(php),
		'...and the map overlay containers read the same inset');
}

// ---- 9. the Junctions tab --------------------------------------------------------------------
// The tabular editor. What can be quietly wrong here is the WRITE, not the reading: a table is a
// second editor of properties the popup already edits, and a second editor that writes directly
// edits BASE from inside a scenario under every scenario at once. That is not hypothetical --
// dev/scenario-seam-repair.md is the incident.
console.log('\n--- the Junctions tab ---');
{
	const doc = L.getDoc();
	// A network with something to sort: three junctions, one of them with no elevation at all.
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 100, 0), c = L.addNode('junction', 200, 0);
	a.elev = 30; b.elev = 10; delete c.elev;
	L.setProp(a, 'demand', 5); L.setProp(b, 'demand', 50); L.setProp(c, 'demand', 1);
	L.openPane('junctions');
	report(L.paneState().tab === 'junctions' && !L.profileIsOpen(),
		'the pane opens on the junctions tab, and the profile is not showing');

	report(L.junctionOrder().join(',') === [a.id, b.id, c.id].join(','), 'it sorts by ID to begin with',
		L.junctionOrder().join(','));
	L.sortJunctions('demand');
	report(L.junctionOrder().join(',') === [c.id, a.id, b.id].join(','), 'clicking Demand sorts by demand',
		L.junctionOrder().join(','));
	L.sortJunctions('demand');
	report(L.junctionOrder().join(',') === [b.id, a.id, c.id].join(','), 'clicking it again reverses',
		L.junctionOrder().join(','));
	// **A BLANK IS NOT THE SMALLEST VALUE.** Sorting descending to find the deepest node must not
	// return a screenful of junctions that have no elevation.
	L.sortJunctions('elev');
	report(L.junctionOrder().indexOf(c.id) === 2, 'a junction with no elevation sorts last, ascending',
		L.junctionOrder().join(','));
	L.sortJunctions('elev');
	report(L.junctionOrder().indexOf(c.id) === 2, '...and last descending too, which is the point',
		L.junctionOrder().join(','));

	// **THE WRITE SEAM.** Typing in the demand cell inside a scenario must record an OVERRIDE, not
	// rewrite the base network. Driven through the cell's own change handler, so what is tested is
	// the path the user takes.
	L.createScenario('Peak hour');
	L.renderJunctions();
	const cells = L.junctionCells()[a.id];
	cells.demand.value = '99';
	cells.demand._listeners.change[0]();
	report(L.effective(a, 'demand') === 99, 'typing in a demand cell changes the demand in THIS scenario');
	L.switchScenario('base');
	report(L.effective(a, 'demand') === 5, '...and leaves the base network alone — it went through setProp()',
		String(L.effective(a, 'demand')));
	// The elevation is not an overridable property, and is written exactly as the popup writes it.
	L.switchScenario(L.scenarioIds()[1]);
	L.renderJunctions();
	const cellsB = L.junctionCells()[b.id];
	cellsB.elev.value = '12.5';
	cellsB.elev._listeners.change[0]();
	report(b.elev === 12.5, 'typing in an elevation cell edits the elevation', String(b.elev));

	// **AN EDIT MUST NOT MOVE THE ROW.** Sorted by elevation, b was in the middle; setting it to
	// 12.5 does not re-sort, because the sort was a gesture the user made once and a table that
	// re-orders itself under a typing hand is unusable.
	const orderNow = L.junctionOrder().join(',');
	L.renderJunctions();
	report(L.junctionOrder().join(',') === orderNow, 'editing a value does not re-sort the table',
		orderNow + '  →  ' + L.junctionOrder().join(','));
	L.sortJunctions('id');
	L.sortJunctions('elev');   // a fresh column always sorts ascending
	report(L.junctionOrder()[0] === b.id, '...and clicking a heading does re-sort it, lowest first',
		L.junctionOrder().join(','));

	// **A SOLVE MUST NOT TAKE THE CELL AWAY FROM THE TYPIST.** renderJunctions() runs on every
	// solve, which is 300 ms after every keystroke.
	const src9 = fnBody('refillJunctions');
	report(/activeElementSafe\(\)/.test(src9), 'a refill leaves the cell the user is in alone');
	report(/if \(sig === junctionSig && junctionCells\) \{ refillJunctions\(rows\); return; \}/.test(fnBody('renderJunctions')),
		'...and a solve refills the table rather than rebuilding it');
	// The two result columns are the solver's, and are read through the SAME accessor the map
	// labels use, so a cell and the label beside the symbol can never disagree.
	report(/return colorNodeValue\(n, col\);/.test(fnBody('junctionValue')),
		'head and pressure come from colorNodeValue(), the map labels\' own accessor');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

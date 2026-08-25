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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\twirePane: wirePane, openPane: openPane, closePane: closePane, togglePane: togglePane,\n" +
	"\t\tsetPaneTab: setPaneTab, paneIsOpen: paneIsOpen, paneState: function () { return paneState; },\n" +
	"\t\tclampPaneHeight: clampPaneHeight, paneMaxHeight: paneMaxHeight,\n" +
	"\t\tprofileIsOpen: profileIsOpen, pathLayer: function () { return profilePathLayer; },\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	// The asset tables, driven the way the user drives them: sort by clicking a heading, type in a
	// cell, read what the table says. Reached through paneTableById() rather than by a per-type
	// export, because ONE renderer serving six types is the thing under test (Task 455).
	"\t\tpaneTables: paneTables, paneTableById: paneTableById,\n" +
	"\t\tpaneTabIds: function () { return paneTabs.map(function (t) { return t.id; }); },\n" +
	"\t\tsortTable: function (id, col) { sortPaneTable(paneTableById(id), col); },\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\ttableCells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttableCols: function (id) { return paneTableById(id).cols; },\n" +
	"\t\ttableHeadings: function (id) { return paneTableById(id).cols.map(paneHeadingText); },\n" +
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
	// What must hold is that the hook CLEARS THE HIGHLIGHT, not that it does only that -- Task 433
	// added profileDrawCancel() beside it so a half-drawn path cannot outlive the panel it is being
	// drawn in. Pinning the whole line verbatim made that addition look like a regression.
	report(/hide: function \(\) \{[^}]*drawProfilePath\(null\);/.test(tabs),
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
		'lpn_set_colors_node', 'lpn_set_colors_link', 'lpn_set_colors_nodelink',
		'lpn_set_colors_shared'].forEach((id) => {
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
	// **AND IT RESIZES BY FINGER AS WELL AS BY MOUSE** (Tom, 2026-08-23: "I can't figure out how to
	// resize Settings on a phone. Is that our fault?"). `resize: both` is a mouse-only affordance in
	// every mobile engine, so the box needs a real element with pointer handlers on top of it. Both
	// boxes wear the .lpn-setbox shell, so both get the grabber or the two disagree about what that
	// shell means.
	['wireSettingsBox', 'wireLibraryBox'].forEach((fn) => {
		report(/addPanelResizeGrip\(box\)/.test(fnBody(fn)),
			`${fn}() gives its box a touch resize grabber`);
	});
	report(/grip\.addEventListener\('pointerdown'/.test(fnBody('addPanelResizeGrip')) &&
		/setPointerCapture/.test(fnBody('addPanelResizeGrip')),
		'...built on pointer events with capture, so a fast drag off the square keeps resizing');
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

// ---- 9. the six ASSET TABLES ------------------------------------------------------------------
// The tabular editors. What can be quietly wrong here is the WRITE, not the reading: a table is a
// second editor of properties the popup already edits, and a second editor that writes directly
// edits BASE from inside a scenario under every scenario at once. That is not hypothetical --
// dev/scenario-seam-repair.md is the incident.
//
// SINCE TASK 455 there are six of them and ONE renderer, so the second thing to hold is that the
// six stay six: each type lists only its own elements, keeps its own sort, and never lets a result
// column become a text box.
console.log('\n--- six tabs, one renderer ---');
{
	const ids = L.paneTables().map((t) => t.id);
	report(ids.join(',') === 'junctions,reservoirs,tanks,pipes,pumps,valves',
		'six asset tables, in the toolbar’s Add order, nodes before links', ids.join(','));
	// **PROFILE IS LAST, NOT FIRST** (Tom, 2026-08-21: "making Profile the last tab"). It is still
	// the odd one out -- a drawing where the other six are tables -- and the end of the strip is
	// where an odd one out belongs; at the front it stood between the reader and the six things
	// that are alike. Asserted at BOTH ends, because the bug this catches is a reorder that drops
	// it somewhere in the middle of the six.
	report(L.paneTabIds()[L.paneTabIds().length - 1] === 'profile',
		'Profile is the LAST tab — it is a drawing, the six before it are tables',
		L.paneTabIds().join(','));
	report(L.paneTabIds()[0] === 'junctions',
		'...so the strip OPENS on a table, which is what the Print button beside it acts on',
		L.paneTabIds()[0]);
	report(L.paneTabIds().length === 7, 'seven tabs in all', String(L.paneTabIds().length));
	report(L.paneTabIds().indexOf('text') < 0 && ids.indexOf('text') < 0,
		'Text is NOT a tab — nothing about a label solves, so its table would have no column worth reading');
	// Every table has a panel div of its own in the page, which is also what gives each its own
	// scroll offset for nothing.
	L.paneTabIds().slice(1).forEach((id) => {
		report(php.indexOf('id="lpn_pane_' + id + '"') > 0, `#lpn_pane_${id} is a panel in the page`);
	});
	// ONE renderer. Six copies of a 200-line table is the thing Task 455 was written to avoid, and
	// the cheap guard is that the per-type function names never came back.
	report(!/function render(Junctions|Reservoirs|Tanks|Pipes|Pumps|Valves)\b/.test(src),
		'there is no per-type renderer — renderPaneTable() serves all six');
	report(/function renderPaneTable\(spec\)/.test(src), 'and the one renderer takes a spec');
	// The tab strip and the table list cannot drift, because the tabs are BUILT from the tables.
	report(/paneTables\(\)\.forEach\(function \(spec\) \{\s*paneTabs\.push\(/.test(src),
		'the six tabs are generated from the six specs, not written out twice');
	// ONE tip and ONE empty message for all six -- the translation budget was the design decision.
	report(src.split("tip: 'lpn_pane_tab_tip'").length === 2,
		'one generic tab tip serves all six');
	report(/pc\.lpn_pane_none/.test(fnBody('renderPaneTable')),
		'...and one generic "none of these yet" message');
	report(!/lpn_pane_junctions_none|lpn_pane_tab_junctions_tip/.test(src + php),
		'the junction-specific tip and empty message are retired, not left beside the generic ones');
}

console.log('\n--- each table lists exactly its own type ---');
{
	const doc = L.getDoc();
	// One of everything, so "exactly its own type" is a claim with something to be wrong about.
	const j1 = L.addNode('junction', 0, 0), j2 = L.addNode('junction', 100, 0),
		j3 = L.addNode('junction', 200, 0),
		r1 = L.addNode('reservoir', 0, 100), t1 = L.addNode('tank', 100, 100);
	j1.elev = 30; j2.elev = 10; delete j3.elev;
	L.setProp(j1, 'demand', 5); L.setProp(j2, 'demand', 50); L.setProp(j3, 'demand', 1);
	const p1 = L.addLink('pipe', j1.id, j2.id), p2 = L.addLink('pipe', j2.id, j3.id);
	const pu1 = L.addLink('pump', r1.id, j1.id);
	const v1 = L.addLink('valve', t1.id, j2.id);

	// EXACT COUNTS, and no id in two tables. Section 6 already left one reservoir on the map, which
	// is why the reservoir count is 2 and why this is stated as counts rather than as "the one I
	// just added" -- a table that quietly listed every node would pass the second form.
	const listed = (id) => L.tableOrder(id);
	const want = { junctions: 3, reservoirs: 2, tanks: 1, pipes: 2, pumps: 1, valves: 1 };
	Object.keys(want).forEach((id) => {
		report(listed(id).length === want[id], `${id} lists exactly its own ${want[id]}`,
			listed(id).length + ' of ' + want[id] + ': ' + listed(id).join(','));
	});
	const seen = {}, twice = [];
	Object.keys(want).forEach((id) => listed(id).forEach((x) => {
		if (seen[x]) { twice.push(x); } seen[x] = id;
	}));
	report(twice.length === 0, 'no part is listed by two tables', twice.join(','));
	report(listed('pipes').indexOf(pu1.id) < 0 && listed('pipes').indexOf(v1.id) < 0,
		'the pump and the valve are NOT in the pipe table — a link is not a pipe');
	report(listed('pumps')[0] === pu1.id && listed('valves')[0] === v1.id,
		'...they are in their own', listed('pumps')[0] + ' / ' + listed('valves')[0]);
	report(listed('junctions').indexOf(r1.id) < 0 && listed('junctions').indexOf(t1.id) < 0,
		'and a reservoir and a tank are not junctions');

	// **A RESULT COLUMN IS NEVER TYPED INTO.** The rule CLAUDE.md states as "a number the user
	// supplied and a number we computed are different kinds of thing", asserted against the real
	// cells rather than against the spec, because the cell is what the user can reach.
	L.openPane('pipes');
	L.renderTable('pipes');
	const pipeCells = L.tableCells('pipes')[p1.id];
	['flow', 'velocity', 'headloss'].forEach((k) => {
		report(pipeCells[k] && pipeCells[k]._tag === 'td', `a pipe's ${k} cell is a plain cell, not an input`,
			pipeCells[k] && pipeCells[k]._tag);
	});
	['diameter', 'length', 'roughness', 'km'].forEach((k) => {
		report(pipeCells[k] && pipeCells[k]._tag === 'input', `...and its ${k} cell IS editable`,
			pipeCells[k] && pipeCells[k]._tag);
	});
	// The endpoints are identity, which is the drawing's to own: read-only for the same reason a
	// result is, and for a different reason.
	report(pipeCells.from && pipeCells.from._tag === 'td' && pipeCells.to && pipeCells.to._tag === 'td',
		'a pipe’s From and To are read-only — re-drawing the pipe is how they change');
	report(pipeCells.from.textContent === j1.id && pipeCells.to.textContent === j2.id,
		'...and they name the right nodes', pipeCells.from.textContent + ' → ' + pipeCells.to.textContent);
	// A pump has no editable scalar at all: what it is, is its curve.
	L.renderTable('pumps');
	const pumpCells = L.tableCells('pumps')[pu1.id];
	report(Object.keys(pumpCells).every((k) => pumpCells[k]._tag === 'td'),
		'every cell of the pump table is read-only — a pump IS its curve, and a curve lives in the popup');
	// The valve's SETTING heading carries no unit, because the quantity differs per row.
	L.renderTable('valves');
	const vHead = L.tableHeadings('valves');
	report(vHead.indexOf('Setting') >= 0, 'the valve Setting heading names no unit', vHead.join(' | '));
	report(L.tableCells('valves')[v1.id].valveType._tag === 'td',
		'...and the valve Type is read-only — changing it re-seeds the setting, which belongs in the popup');
}

console.log('\n--- sorting: a gesture, per table ---');
{
	const doc = L.getDoc();
	const js = L.tableOrder('junctions');
	report(js.join(',') === js.slice().sort().join(','), 'a table sorts by ID to begin with', js.join(','));
	L.sortTable('junctions', 'demand');
	const byDemand = L.tableOrder('junctions');
	report(byDemand[0] !== js[0] || byDemand.length === 1, 'clicking Demand sorts by demand', byDemand.join(','));
	L.sortTable('junctions', 'demand');
	report(L.tableOrder('junctions').join(',') === byDemand.slice().reverse().join(','),
		'clicking it again reverses', L.tableOrder('junctions').join(','));

	// **A BLANK IS NOT THE SMALLEST VALUE.** Sorting descending to find the deepest node must not
	// return a screenful of junctions that have no elevation.
	const noElev = doc.nodes.filter((n) => n.type === 'junction' && n.elev === undefined)[0];
	L.sortTable('junctions', 'elev');
	report(L.tableOrder('junctions').indexOf(noElev.id) === 2, 'a junction with no elevation sorts last, ascending',
		L.tableOrder('junctions').join(','));
	L.sortTable('junctions', 'elev');
	report(L.tableOrder('junctions').indexOf(noElev.id) === 2, '...and last descending too, which is the point',
		L.tableOrder('junctions').join(','));

	// **SORTING ONE TABLE LEAVES THE OTHERS ALONE** (Task 455). Six tables sharing one sort would
	// re-order Junctions under the hand of somebody who clicked a heading on Pipes.
	const pipesBefore = L.tableOrder('pipes').join(',');
	L.sortTable('junctions', 'id');
	report(L.tableOrder('pipes').join(',') === pipesBefore, 'sorting Junctions does not re-order Pipes',
		pipesBefore + '  →  ' + L.tableOrder('pipes').join(','));
	report(L.paneTableById('junctions').sort.col === 'id' && L.paneTableById('pipes').sort.col === 'id',
		'...because each table owns its own sort');
	L.sortTable('pipes', 'diameter');
	report(L.paneTableById('junctions').sort.col === 'id' && L.paneTableById('pipes').sort.col === 'diameter',
		'and sorting Pipes by diameter leaves the Junctions sort where it was',
		L.paneTableById('junctions').sort.col + ' / ' + L.paneTableById('pipes').sort.col);
}

console.log('\n--- the write seam ---');
{
	const doc = L.getDoc();
	const a = doc.nodes.filter((n) => n.type === 'junction')[0];
	const b = doc.nodes.filter((n) => n.type === 'junction')[1];
	const pipe = doc.links.filter((l) => l.type === 'pipe')[0];
	const base = L.effective(a, 'demand');
	// **THE WRITE SEAM.** Typing in the demand cell inside a scenario must record an OVERRIDE, not
	// rewrite the base network. Driven through the cell's own change handler, so what is tested is
	// the path the user takes.
	L.switchScenario('base');
	L.setProp(pipe, 'diameter', 200);   // a real Base number, so "Base keeps its own" is a claim about 200
	L.createScenario('Peak hour');
	L.renderTable('junctions');
	const cells = L.tableCells('junctions')[a.id];
	cells.demand.value = '99';
	cells.demand._listeners.change[0]();
	report(L.effective(a, 'demand') === 99, 'typing in a demand cell changes the demand in THIS scenario');
	L.switchScenario('base');
	report(L.effective(a, 'demand') === base, '...and leaves the base network alone — it went through setProp()',
		String(L.effective(a, 'demand')));
	// A LINK property goes through the same seam, and it is the one the valve incident was about.
	L.switchScenario(L.scenarioIds()[1]);
	const baseDia = pipe._diameter;
	L.renderTable('pipes');
	const pcells = L.tableCells('pipes')[pipe.id];
	pcells.diameter.value = '400';
	pcells.diameter._listeners.change[0]();
	report(L.effective(pipe, 'diameter') === 400, 'typing a pipe diameter changes it in THIS scenario');
	report(pipe._diameter === baseDia, '...and Base keeps its own', String(pipe._diameter));
	// The elevation is not an overridable property, and is written exactly as the popup writes it.
	L.renderTable('junctions');
	const cellsB = L.tableCells('junctions')[b.id];
	cellsB.elev.value = '12.5';
	cellsB.elev._listeners.change[0]();
	report(b.elev === 12.5, 'typing in an elevation cell edits the elevation', String(b.elev));
	L.switchScenario('base');

	// **AN EDIT MUST NOT MOVE THE ROW.** The sort was a gesture the user made once, and a table
	// that re-orders itself under a typing hand is unusable.
	const orderNow = L.tableOrder('junctions').join(',');
	L.renderTable('junctions');
	report(L.tableOrder('junctions').join(',') === orderNow, 'editing a value does not re-sort the table',
		orderNow + '  →  ' + L.tableOrder('junctions').join(','));
	L.sortTable('junctions', 'id');
	L.sortTable('junctions', 'elev');   // a fresh column always sorts ascending
	report(L.tableOrder('junctions')[0] === b.id, '...and clicking a heading does re-sort it, lowest first',
		L.tableOrder('junctions').join(','));

	// **A SOLVE MUST NOT TAKE THE CELL AWAY FROM THE TYPIST.** renderPaneTable() runs on every
	// solve, which is 300 ms after every keystroke.
	report(/activeElementSafe\(\)/.test(fnBody('refillPaneTable')), 'a refill leaves the cell the user is in alone');
	report(/if \(sig === spec\.sig && spec\.cells\) \{ refillPaneTable\(spec, rows\); return; \}/.test(fnBody('renderPaneTable')),
		'...and a solve refills the table rather than rebuilding it');
	// The result columns are the solver's, and are read through the SAME accessors the map labels
	// use, so a cell and the label beside the symbol can never disagree.
	report(/return colorNodeValue\(n, key\);/.test(fnBody('paneColNodeResult')),
		'node results come from colorNodeValue(), the map labels’ own accessor');
	report(/return colorLinkValue\(l, key\);/.test(fnBody('paneColLinkResult')),
		'...and link results from colorLinkValue()');
	// Every edit ends the way the popup's does, so a table write cannot forget the override mark,
	// the status count or the save.
	report(/completeEdit\(c\.prop \? \{ el: el, prop: c\.prop \} : null\);/.test(fnBody('paneTableRow')),
		'every table edit ends in completeEdit(), the popup’s own ending');
}

// ---- 10. seven tabs wrap, and the pane still fits ---------------------------------------------
// Tom, 2026-08-19, choosing between wrapping and a type selector: *"Seven tabs and let them wrap:
// Yes."* So the strip is allowed to be two lines, and the thing that must not happen is the pane
// silently growing past the share of the window the ceiling reserves for it.
console.log('\n--- the strip may be two lines ---');
{
	// The wrapping row is .lpn-pane-strip, which holds the Print button AND the tablist; the
	// tablist itself is `display: contents` so both wrap as one flow (Task 488). Asking
	// .lpn-pane-tabs for flex-wrap here would pass on a strip that cannot wrap at all.
	report(/\.lpn-pane-strip \{[^}]*flex-wrap: wrap/.test(css), 'the tab strip wraps rather than overflowing');
	report(/\.lpn-pane-head\s*\{[^}]*align-items:\s*flex-start/.test(css),
		'...with the X pinned to the top rather than stretched down beside two rows');
	report(/@media \(max-width: 60rem\) \{ \.lpn-pane-tab \{ padding/.test(css),
		'...and the tabs give up side padding before they give up a line');
	report(!/\.lpn-pane-strip \{[^}]*overflow-x/.test(css),
		'the strip never scrolls sideways — the page may not scroll at all (Task 432)');
	// THE CEILING KNOWS ABOUT THE CHROME. The body's height is the only number JS writes, so if the
	// cap ignored the grip and a two-line strip the whole pane would sit past 80% of the window.
	report(/Math\.floor\(vh \* 0\.8\) - paneChromeHeight\(\)/.test(fnBody('paneMaxHeight')),
		'the pane ceiling subtracts the measured chrome, so a second line of tabs is accounted for');
	report(/pane\.getBoundingClientRect\(\)\.height/.test(fnBody('paneChromeHeight')) &&
		/body\.getBoundingClientRect\(\)\.height/.test(fnBody('paneChromeHeight')),
		'...and the chrome is MEASURED, never a constant that a wrapped strip would falsify');
}

// ---- 11. a column has ONE alignment, and the heading is part of the column ---------------------
// Tom, 2026-08-23: *"the inputs and the headings are not middle/center (?) justified with each
// other. Inputs are left and headings are center. This looks worst on Reservoirs because they have
// fewer, wider columns. But it applies to all of the tables."*
//
// **THE CENTRING CAME FROM THE BROWSER, NOT FROM US.** A sort heading is a <button>, and every
// browser's own stylesheet centres a button's text; the <th> said `left` and was overruled inside
// its own cell. Invisible while a heading is one line, and unmissable the moment it wraps -- which
// on a phone is most of them, and worst where the columns are widest.
//
// The fix is a class on the heading matching the class on its cells, so this section asks the two
// questions that can go wrong independently: does the RENDERER put the same class on both, and
// does a RULE then fire on it. Measured in a real browser at 360px, Elm Street Center's Pipes
// table: ten headings centred over cells aligned left or right, now ten agreeing.
console.log('\n--- heading and cells share one alignment ---');
{
	const NUM = 'lpn-pane-num', FIRST = 'lpn-pane-first';
	// The real panels, filled by the real renderer -- every one of the six, because "it applies to
	// all of the tables" is the claim being checked.
	L.paneTables().forEach(function (spec) {
		L.renderTable(spec.id);
		const host = byId[spec.panel];
		const table = (host.children || []).filter((c) => c._tag === 'table')[0];
		if (!table) { report(false, spec.id + ': the panel holds a table'); return; }
		const thead = table.children.filter((c) => c._tag === 'thead')[0];
		const tbody = table.children.filter((c) => c._tag === 'tbody')[0];
		const ths = thead.children[0].children;
		const tds = tbody.children[0].children;
		report(ths.length === spec.cols.length && tds.length === spec.cols.length,
			spec.id + ': one heading and one cell per column', ths.length + ' / ' + tds.length);
		const disagree = spec.cols.filter((c, i) => ths[i].className !== tds[i].className);
		report(disagree.length === 0, spec.id + ': every heading carries its own cells’ classes',
			disagree.map((c) => c.key).join(','));
		// And the class is the one the alignment hangs on: a number is a number whether it was typed
		// or computed, which is the rule the printed sheet has always used.
		const wrong = spec.cols.filter((c, i) =>
			(ths[i].classList.contains(NUM)) !== !!(c.result || c.set));
		report(wrong.length === 0, spec.id + ': exactly the number columns are marked as numbers',
			wrong.map((c) => c.key).join(','));
		// **AND EXACTLY ONE COLUMN IS THE FIRST ONE**, which is what the alignment now hangs on:
		// left there, centred everywhere else, heading and cell alike.
		const firstTh = spec.cols.map((c, i) => i).filter((i) => ths[i].classList.contains(FIRST));
		const firstTd = spec.cols.map((c, i) => i).filter((i) => tds[i].classList.contains(FIRST));
		report(firstTh.length === 1 && firstTh[0] === 0 && firstTd.length === 1 && firstTd[0] === 0,
			spec.id + ': one column is marked first, and it is the leftmost',
			firstTh.join(',') + ' / ' + firstTd.join(','));
		// **THE BOX WIDTH REACHES THE BOX**, as the custom property the stylesheet reads. A column
		// that names no width says nothing at all, so CSS's own 7em fallback stands -- assert the
		// silence too, or a stray default would be invisible here.
		spec.cols.forEach((c, i) => {
			const target = spec.cells[Object.keys(spec.cells)[0]][c.key];
			if (!target || target._tag !== 'input') { return; }
			report(target.style.getPropertyValue('--lpn-pane-col-w') === (c.em ? c.em + 'em' : ''),
				spec.id + '/' + c.key + ': the box carries its column’s width',
				target.style.getPropertyValue('--lpn-pane-col-w') || '(none)');
		});
	});
	// The ID column is the worked example of the other side: a name is not a figure.
	L.renderTable('pipes');
	const pipeTable = byId.lpn_pane_pipes.children.filter((c) => c._tag === 'table')[0];
	const pipeThs = pipeTable.children.filter((c) => c._tag === 'thead')[0].children[0].children;
	report(!pipeThs[0].classList.contains(NUM) && pipeThs[0].classList.contains('lpn-pane-col-id'),
		'the ID heading is not a number column, and names itself');
	report(pipeThs[5].classList.contains('lpn-pane-col-roughness'),
		'...and every column names itself, which is what lets one column be narrowed',
		pipeThs[5].className);
	// The Libraries curve table is a .lpn-pane-table too, so it takes the same positional rule --
	// read from the source, because that section is built inside the Libraries box and has no
	// panel of its own here.
	const curve = fnBody('buildCurveSection');
	report(/th\.className = 'lpn-pane-num' \+ \(i === 0 \? ' lpn-pane-first' : ''\)/.test(curve) &&
		/td\.className = 'lpn-pane-num' \+ \(i === 0 \? ' lpn-pane-first' : ''\)/.test(curve),
		'the Libraries curve table marks its first column the same way');
}

// ---- 12. the rules that alignment, the box widths and the sticky heading hang on --------------
// Read from css/engcalcs.css and asked of the elements the renderer above actually built. Asserting
// that a class was applied proves nothing on its own; these two sections together are the chain.
//
// **AND THE INPUT IS ASKED, NOT ONLY ITS CELL.** That is the question that was not asked last time:
// the <td> was given an alignment, the <th> was given the same one, and the box the user types in
// went on taking the browser's. A control's own stylesheet wins inside the control, so a cell's
// alignment reaches an <input> only where something says `inherit`.
console.log('\n--- and the stylesheet answers accordingly ---');
{
	const CSS = require('./pane-table-css.js').load(path.join(ROOT, 'css', 'engcalcs.css'));
	const blind = [];
	const WIDE = 1200, SMALL = 360;
	const html = { tag: 'html', cls: [], canvasHost: true };
	const panel = { tag: 'div', cls: ['lpn-pane-panel', 'lpn-pane-scroll', 'on'] };
	const table = { tag: 'table', cls: ['lpn-pane-table'] };
	const thead = { tag: 'thead', cls: [] };
	const tr = { tag: 'tr', cls: [] };
	// A heading really does sit inside a <thead>, and `.lpn-pane-table thead th` is the rule that
	// makes it stick -- a chain missing that node would answer "no rule" to every sticky question.
	const chainTo = (node) => [html, panel, table].concat(node.tag === 'th' ? [thead] : [], [tr, node]);
	const clsFor = (key, num, first) => ['lpn-pane-col-' + key]
		.concat(first ? ['lpn-pane-first'] : [], num ? ['lpn-pane-num'] : []);
	const cell = (tag, key, num, first) => chainTo({ tag: tag, cls: clsFor(key, num, first) });
	const inputIn = (key) => [html, panel, table, tr,
		{ tag: 'td', cls: clsFor(key, true, false) }, { tag: 'input', cls: [] }];
	const sortBtn = chainTo({ tag: 'th', cls: clsFor('flow', true, false) })
		.concat([{ tag: 'button', cls: ['lpn-pane-sort'] }]);
	const align = (chain, w) => CSS.winning(CSS.rules, chain, w, 'text-align', blind);
	const width = (chain, w) => CSS.winning(CSS.rules, chain, w, 'width', blind);

	// **THE READER'S OWN SELF-TEST.** Two answers it must get right before any answer it gives is
	// worth reading, and a selector it cannot parse is collected and reported at the end rather
	// than silently answering "no rule".
	report(align(cell('td', 'id', false, true), WIDE) === 'start', 'reader self-test: the first cell reads start');
	report(width(inputIn('length'), WIDE) === 'var(--lpn-pane-col-w, 7em)' &&
		width(inputIn('length'), SMALL) === '3.5em',
		'reader self-test: the desktop box takes its column’s width and the phone box is 3.5em',
		width(inputIn('length'), WIDE) + ' / ' + width(inputIn('length'), SMALL));

	// 1. ALIGNMENT. Tom, 2026-08-23: *"Right is great justification for numbers. But in tables,
	// center is safest for everything but the first column... Make the headings center and we will
	// be back to where we started, focusing on the inputs as we should."* So the question is asked
	// of POSITION, at both widths, of the heading and of the cell -- and of the box inside the cell.
	[WIDE, SMALL].forEach((w) => {
		// `start`, not `left`: the first column is the LEADING one, which in an RTL language is
		// the right-hand edge. The print rules below still say `left` and are asserted separately —
		// they are a different question and did not move.
		report(align(cell('th', 'id', false, true), w) === 'start' &&
			align(cell('td', 'id', false, true), w) === 'start',
			'the first column leads at ' + w + 'px, heading and cell alike');
		report(align(cell('th', 'flow', true, false), w) === 'center' &&
			align(cell('td', 'flow', true, false), w) === 'center',
			'...a figures column is centred at ' + w + 'px, heading and cell alike');
		report(align(cell('th', 'from', false, false), w) === 'center' &&
			align(cell('td', 'from', false, false), w) === 'center',
			'...and so is a column of names that is not the first', align(cell('td', 'from', false, false), w));
		// **THE HALF THAT SLIPPED THROUGH.** A <td> aligns the box; the text inside a form control
		// is aligned by the browser's own stylesheet unless something hands it back.
		report(align(inputIn('length'), w) === 'inherit',
			'...and the INPUT takes its cell’s alignment rather than the browser’s at ' + w + 'px',
			String(align(inputIn('length'), w)));
	});
	// The heading BUTTON is the other control with a stylesheet of its own -- every browser centres
	// a <button>, which is what made the headings disagree with their cells in the first place.
	report(align(sortBtn, WIDE) === 'inherit',
		'the sort button hands its alignment back to its own heading cell', align(sortBtn, WIDE));

	// 2. THE PRINTED SHEET IS A SEPARATE QUESTION AND DID NOT MOVE. Names left, figures right, as it
	// has been since it shipped: nobody types on paper, and a printed column of figures reads as one
	// only when it is right-aligned. The screen rules are the same selectors, so this is the check
	// that they do not leak onto it.
	{
		const printTable = { tag: 'table', cls: ['lpn-pane-table', 'lpn-print-table'] };
		const pCell = (tag, key, num, first) => [html, printTable]
			.concat(tag === 'th' ? [thead] : [], [tr, { tag: tag, cls: clsFor(key, num, first) }]);
		const pAlign = (chain) => CSS.winning(CSS.rules, chain, WIDE, 'text-align', blind, 'print');
		report(pAlign(pCell('td', 'flow', true, false)) === 'right' &&
			pAlign(pCell('th', 'flow', true, false)) === 'right',
			'on paper a figures column is still right', pAlign(pCell('td', 'flow', true, false)));
		report(pAlign(pCell('td', 'from', false, false)) === 'left' &&
			pAlign(pCell('td', 'id', false, true)) === 'left',
			'...and a name column, first or not, is still left');
		// And the screen is not answering with the paper's rules either way round.
		report(align(cell('td', 'flow', true, false), WIDE) === 'center',
			'...while the screen is unaffected by any of it');
	}

	// 3. THE STICKY HEADING, and the 6px band the rows were scrolling through above it.
	const thChain = cell('th', 'flow', true, false);
	report(CSS.winning(CSS.rules, [html, panel], WIDE, 'padding-top', blind) === '0',
		'a scrolling panel has no top padding -- a sticky top:0 sticks to the CONTENT edge, and the ' +
		'padding above it is the band the sliver showed in');
	report(CSS.winning(CSS.rules, thChain, WIDE, 'padding-top', blind) === '6px',
		'...the heading carries that padding itself, so the table still opens with air above it');
	report(CSS.winning(CSS.rules, thChain, WIDE, 'position', blind) === 'sticky' &&
		CSS.winning(CSS.rules, thChain, WIDE, 'top', blind) === '0',
		'the heading row still sticks');
	report(CSS.winning(CSS.rules, thChain, WIDE, 'z-index', blind) === '2',
		'...above the rows rather than merely painted after them');
	report(/^(#fff|rgb|white)/.test(String(CSS.winning(CSS.rules, thChain, WIDE, 'background', blind))),
		'...opaque, in the pane’s own colour', CSS.winning(CSS.rules, thChain, WIDE, 'background', blind));
	// The rule under the headings is an inset shadow: under `border-collapse: collapse` a border
	// belongs to the TABLE, so it scrolls away from the sticky cell that declared it.
	report(/inset 0 -1px 0/.test(String(CSS.winning(CSS.rules, thChain, WIDE, 'box-shadow', blind))),
		'the line under the headings travels with them');
	report(CSS.winning(CSS.rules, thChain, WIDE, 'border-bottom', blind) === null,
		'...and is not a border, which under border-collapse would scroll on its own');

	// 4. THE PHONE-ONLY WIDTHS on the two columns Tom named, and the desktop that must not move.
	// Both were widened again in round 3 (2026-08-23). Roughness stops at 3.5em, the width every
	// other phone box in these tables already has, rather than the 2.5 factor asked for -- the
	// stylesheet states why. Minor loss takes the same 1.4 its desktop box took.
	report(width(cell('th', 'roughness', true, false), SMALL) === '5em' &&
		width(inputIn('roughness'), SMALL) === '3.5em',
		'Roughness on a phone is the phone default box, not a narrower one');
	report(width(inputIn('km'), SMALL) === '3em',
		'...and the Minor loss box took the same 1.4 the desktop one took');
	report(width(cell('th', 'km', true, false), SMALL) === '3.7em',
		'...inside a column widened with it, which only shortens its heading');
	// **ROUND 4 REVERSED THIS ONE COLUMN** (Tom, 2026-08-25, from a phone: "Roughnes/s, C"; ROADMAP
	// Task 527). `anywhere` is what lets a declared width beat a long word, and it was right when
	// this column was 2.6em; round 3 widened it to 5em and "Roughness," is 94.4px against the 66 the
	// heading then had. `break-word` puts the column's floor back at its longest word -- the heading
	// breaks at its comma instead, and the column pays 28px. km keeps `anywhere` because nothing in
	// it has ever split: its longest word is "Minor", ~34px in a 47px column.
	report(CSS.winning(CSS.rules, cell('th', 'roughness', true, false), SMALL, 'overflow-wrap', blind) === 'break-word',
		'the Roughness heading keeps its word rather than being split -- an abbreviation instead ' +
		'would be 26 translations',
		String(CSS.winning(CSS.rules, cell('th', 'roughness', true, false), SMALL, 'overflow-wrap', blind)));
	report(CSS.winning(CSS.rules, cell('th', 'km', true, false), SMALL, 'overflow-wrap', blind) === 'anywhere',
		'...while Minor loss, which has never had to split, keeps the bounded width');
	// **TOM SAW THE PHONE AND SAID "On phone, widths are good".** Every phone box is 3.5em unless
	// that block names it, and the desktop per-column widths arrive as a CUSTOM PROPERTY precisely
	// so that they cannot reach down here: an inline width would have beaten all of it.
	['length', 'elev', 'demand', 'diameter', 'level'].forEach((key) => {
		report(width(inputIn(key), SMALL) === '3.5em', 'the phone box for ' + key + ' is untouched at 3.5em',
			String(width(inputIn(key), SMALL)));
	});
	report(width(cell('th', 'roughness', true, false), WIDE) === null && width(cell('th', 'km', true, false), WIDE) === null,
		'no desktop COLUMN carries a width, so a narrower box can never force a heading to wrap ' +
		'-- the heading row is as tall as it was',
		width(cell('th', 'roughness', true, false), WIDE) + ' / ' + width(cell('th', 'km', true, false), WIDE));

	// 5. WHAT THE DESKTOP BOXES ACTUALLY SHOW. Tom, 2026-08-23, gave a factor per column against the
	// 7em they all were, with one condition: *"An input must still show its content."* There is no
	// browser in this worktree, so the width is turned into characters by an arithmetic model whose
	// three constants are all readable facts about the page, and the model is calibrated against the
	// one figure a real browser has already produced here: 3.5em was MEASURED at five digits when
	// the phone widths shipped.
	const FONT_PX = 14.4;    // .lpn-pane-table's .9em, of Bootstrap's 1rem body -- and Bootstrap's
	                         // reboot gives an <input> `font-size: inherit`, so the box's em is this
	const DIGIT_PX = 7.92;   // 0.55em, the digit advance of the system sans-serif stack
	const CHROME_PX = 6;     // the UA text box's own 1px border and 2px padding, both sides; the
	                         // suite strips the number spinner, so nothing else is reserved
	const chars = (em) => Math.floor((em * FONT_PX - CHROME_PX) / DIGIT_PX);
	report(chars(3.5) === 5, 'model self-test: 3.5em shows five digits, as measured in a browser for the phone',
		String(chars(3.5)));
	report(chars(7) === 11, 'model self-test: the old 7em box showed eleven', String(chars(7)));
	// Column, the width shipped, and the longest value that column really holds. A pipe length runs
	// to five figures, an SI diameter is millimetres so 1200 is four, a Hazen-Williams C is three
	// (the shipped default method), and a minor-loss k has to show "2.5" -- Tom's own acceptance
	// test for that column, and three characters because the decimal point is one of them.
	// **EVERY COLUMN NOW SHIPS THE FACTOR TOM DECLARED**, including the two that used to deviate.
	// `narrow: true` marks a column whose box is knowingly smaller than its longest value — see the
	// paragraph below, which is the live question, not a footnote.
	const WANT = [
		['junctions', 'elev', 3.5, 4], ['junctions', 'demand', 3.5, 4],
		['reservoirs', 'elev', 3.5, 4], ['reservoirs', 'head', 3.5, 4],
		['tanks', 'level', 3.5, 4], ['tanks', 'minLevel', 3.5, 4], ['tanks', 'maxLevel', 3.5, 4],
		['tanks', 'tankDiameter', 3.5, 4],
		['pipes', 'diameter', 3, 4], ['pipes', 'length', 4.2, 5],
		['pipes', 'roughness', 6, 6], ['pipes', 'km', 3, 3]
	];
	WANT.forEach(([tid, key, em, needs, narrow]) => {
		const col = L.tableCols(tid).filter((c) => c.key === key)[0];
		report(!!col && col.em === em, tid + '/' + key + ': the column declares ' + em + 'em',
			col ? String(col.em) : 'no such column');
		if (narrow) {
			// Asserted as a KNOWN shortfall rather than dropped. If the arithmetic ever changes,
			// somebody is told; a check that simply stopped asking would not notice either way.
			report(chars(em) < needs, '...and ' + em + 'em knowingly shows ' + chars(em)
				+ ' of the ' + needs + ' characters that column can hold');
		} else {
			report(chars(em) >= needs, '...and ' + em + 'em shows ' + chars(em) + ' characters, needing ' + needs);
		}
	});
	// **NO NARROW COLUMN IS LEFT.** Tom asked for 0.2 on Minor loss and 0.3 on Diameter, was shown
	// that 1.4em displays one character of "2.5" and 2.1em three of an SI diameter's "1200", then
	// reversed himself the same day (2026-08-23) on a different ground: *"inputs are flexible. You
	// can enter more than their width."* Round 3 settled it from the other end instead -- *"I
	// confess I am being too stingy"* -- and every column now shows its own longest value, so the
	// belief is no longer load-bearing anywhere in this table. ROADMAP Task 495 asks him to confirm
	// it in a browser anyway, because it is a fact about the suite's inputs and not about these
	// four columns.
	report(chars(3) >= 4, 'Diameter at 3em now shows ' + chars(3) + ' characters of an SI "1200"');
	report(chars(6) >= 6, 'Roughness at 6em shows ' + chars(6) + ' characters of a DW "0.0015"');

	// The reader's blind-spot report, scoped to the selectors that could possibly reach what this
	// section asks about. A rule about the menu bar or a spinner is none of its business, and a
	// reader that listed those would be ignored within a week.
	const mine = [...new Set(blind)].filter((sel) =>
		/lpn-pane/.test(sel) && !/[:[]/.test(sel.replace('html:has(#lpn_canvas)', '')));
	report(mine.length === 0, 'every pane-table selector this section met was one the reader understands',
		mine.join(' | '));
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

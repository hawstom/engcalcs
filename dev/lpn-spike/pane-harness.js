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
	report(L.paneTabIds()[0] === 'profile', 'Profile is still the first tab — it is a drawing, the rest are tables',
		L.paneTabIds().join(','));
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
	report(/\.lpn-pane-tabs\s*\{[^}]*flex-wrap:\s*wrap/.test(css), 'the tab strip wraps rather than overflowing');
	report(/\.lpn-pane-head\s*\{[^}]*align-items:\s*flex-start/.test(css),
		'...with the X pinned to the top rather than stretched down beside two rows');
	report(/@media \(max-width: 60rem\) \{ \.lpn-pane-tab \{ padding/.test(css),
		'...and the tabs give up side padding before they give up a line');
	report(!/\.lpn-pane-tabs\s*\{[^}]*overflow-x/.test(css),
		'the strip never scrolls sideways — the page may not scroll at all (Task 432)');
	// THE CEILING KNOWS ABOUT THE CHROME. The body's height is the only number JS writes, so if the
	// cap ignored the grip and a two-line strip the whole pane would sit past 80% of the window.
	report(/Math\.floor\(vh \* 0\.8\) - paneChromeHeight\(\)/.test(fnBody('paneMaxHeight')),
		'the pane ceiling subtracts the measured chrome, so a second line of tabs is accounted for');
	report(/pane\.getBoundingClientRect\(\)\.height/.test(fnBody('paneChromeHeight')) &&
		/body\.getBoundingClientRect\(\)\.height/.test(fnBody('paneChromeHeight')),
		'...and the chrome is MEASURED, never a constant that a wrapped strip would falsify');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

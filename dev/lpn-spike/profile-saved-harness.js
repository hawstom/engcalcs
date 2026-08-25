// Tasks 509 and 510 -- the profile's EDIT BOX and its SAVED PATHS.
//
//   node dev/lpn-spike/profile-saved-harness.js
//
// Two features, one harness, because they are one seam: the box edits the path and the saved list
// stores it, and both write through `profileState`.
//
// ---- WHAT TASK 509 EXISTS TO CATCH ------------------------------------------------------------
//
// Task 506 removed the profile's left-hand control column and the page is better for it, but it
// took two operations with it -- Tom, 2026-08-25: *"You are right that we lost something."* They
// are back in an overlay box, and the way to get them wrong is to give them back in name only:
//
//   1. **Changing ONE end redraws the whole route.** Then it is the gesture wearing a pull-down,
//      and the waypoints the user placed are gone. Asserted as: set `From`, and the waypoints and
//      the far end are still exactly what they were.
//   2. **Removing ONE waypoint removes all of them, or the wrong one.** The chips were the only way
//      to drop a single stop, and a chip that clears the list is Remove-all with a different label.
//   3. **The box stands open over a gesture it is not editing.** While the chooser runs,
//      profileStops() ignores `from`/`to`/`waypoints` entirely -- so a box left open there is a set
//      of controls that appear to do nothing, which is worse than no controls.
//
// ---- WHAT TASK 510 EXISTS TO CATCH, AT THE FILE BOUNDARY ---------------------------------------
//
//   4. **A saved path does not survive save-and-open.** It is document data, so serializeProject()
//      must write it and applySaved() must read it back, and the round trip is asserted on the
//      SERIALIZED object rather than on the live one -- which is the only place a missing key shows.
//   5. **An id naming a node this document no longer has is DROPPED.** It is the user's data
//      (CLAUDE.md's file rule), and a junction deleted by accident comes back with the next undo
//      while a pruned saved path does not. So the stored list must come back key for key, and the
//      page must SAY what is missing rather than quietly shortening the path.
//   6. **The `.inp` exporter carries it.** EPANET has no such object. Nothing in js/lpn-inp.js reads
//      `doc.profiles`, which is exactly why this is asserted rather than trusted: the day somebody
//      writes a generic "everything in doc" section, this is the line that fails.

const { byId, setUnitSet, loadLoopedNetwork, ROOT } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

// window.prompt and window.confirm are the New/Rename/Delete interface. The stub answers 'X' and
// true; these let a check say what the user typed for THAT press.
let promptAnswer = 'X', confirmAnswer = true;
global.window.prompt = function () { return promptAnswer; };
global.window.confirm = function () { return confirmAnswer; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\twirePane: wirePane, openPane: openPane, setMode: setMode,\n" +
	"\t\twireProfileEditPopup: wireProfileEditPopup,\n" +
	"\t\tprofileState: function () { return profileState; },\n" +
	"\t\tprofileStops: profileStops,\n" +
	"\t\tprofilePath: profilePath,\n" +
	// The saved list through the page's own accessor, never through a doc key typed out here: the
	// harness must fail if the page renames the field, not silently read an undefined one.
	"\t\tsavedProfiles: savedProfiles,\n" +
	"\t\tprofileSavedIssues: profileSavedIssues,\n" +
	"\t\tapplySavedProfile: applySavedProfile,\n" +
	"\t\tnewSavedProfile: newSavedProfile, renameSavedProfile: renameSavedProfile,\n" +
	"\t\tdeleteSavedProfile: deleteSavedProfile,\n" +
	// The ARROW wirePane() builds beside the Profile tab -- Task 510's placement, found in the real
	// strip, so a check on it is a check on the strip and not on a description of it.
	"\t\tprofileMenuBtn: function () {\n" +
	"\t\t\tvar strip = document.getElementById('lpn_pane_tabs');\n" +
	"\t\t\treturn (strip.children || []).filter(function (c) { return c.id === 'lpn_pane_tab_menu_profile'; })[0] || null;\n" +
	"\t\t},\n" +
	// The rows of whichever menu is open, off the popup openMenu() filled.
	"\t\tmenuRows: function () {\n" +
	"\t\t\tvar list = document.getElementById('lpn_menu_list');\n" +
	"\t\t\treturn (list.children || []).map(function (c) { return String(c.textContent || ''); });\n" +
	"\t\t},\n" +
	// The panel's Edit button, built by rebuildProfileForm() into a box the stub knows.
	"\t\teditBtn: function () {\n" +
	"\t\t\tvar box = document.getElementById('lpn_profile_form');\n" +
	"\t\t\treturn (box.children || []).filter(function (c) { return c.id === 'lpn_profile_edit_btn'; })[0] || null;\n" +
	"\t\t},\n" +
	"\t\teditIsOpen: profileEditIsOpen, closeEdit: closeProfileEditPopup,\n" +
	// The box's own controls, by tag, walking the tree the page really built.
	"\t\teditEls: function (tag) {\n" +
	"\t\t\tvar out = [], box = document.getElementById('lpn_profile_edit_form');\n" +
	"\t\t\t(function walk(e) {\n" +
	"\t\t\t\tif (!e) { return; }\n" +
	"\t\t\t\tif (e._tag === tag) { out.push(e); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk);\n" +
	"\t\t\t}(box));\n" +
	"\t\t\treturn out;\n" +
	"\t\t},\n" +
	"\t\tnoticeText: function () {\n" +
	"\t\t\tvar n = document.getElementById('lpn_map_notice'); return n ? n._text : null; },\n" +
	"\t\tprofileDrawStart: profileDrawStart, profileDrawCancel: profileDrawCancel,\n" +
	// openMenu() TOGGLES on its own anchor, so a second press of the arrow closes the pull-down
	// and leaves its last rows standing in the DOM. Dismissed first, exactly as clicking away does.
	"\t\tcloseMenu: closeMenu,\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; drag = null;\n" +
	"\t\t\tprofileState = { from: '', to: '', waypoints: [], draw: null, activeId: '' };\n" +
	"\t\t\tprofileShown = false;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function same(actual, expected, name) {
	const a = JSON.stringify(actual), b = JSON.stringify(expected);
	ok(name, a === b, a === b ? '' : `got ${a}, want ${b}`);
}

byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');
L.wirePane();
L.wireProfileEditPopup();

// A CHAIN with one branch, so a waypoint is a real choice and dropping it is a visible one:
//
//    A --- B --- C --- D          the direct way: 100 + 100 + 100
//           \                     E hangs off B, so a route through E doubles back
//            E
const P = { A: [0, 0], B: [100, 0], C: [200, 0], D: [300, 0], E: [100, 100] };
function build() {
	L.reset();
	L.setMode('select');
	const id = {};
	Object.keys(P).forEach((k) => { id[k] = L.addNode('junction', P[k][0], P[k][1]).id; });
	function mk(a, b, len) {
		const l = L.addLink('pipe', id[a], id[b]);
		l.lenAuto = false; l._length = len;
		return l.id;
	}
	mk('A', 'B', 100); mk('B', 'C', 100); mk('C', 'D', 100); mk('B', 'E', 100);
	// The box is closed between fixtures the way the tab's own hide() closes it: a section that
	// inherited an open box from the one before would toggle it SHUT on its first press.
	L.closeEdit();
	L.openPane('profile');
	return id;
}
function click(el) { (el._listeners.click || []).forEach((fn) => fn({ preventDefault() {}, stopPropagation() {} })); }
function selects() { return L.editEls('select'); }
function chips() { return L.editEls('button'); }
function pickSelect(sel, value) {
	sel.value = value;
	(sel._listeners.change || []).forEach((fn) => fn({}));
}

// ---- 1. the door -----------------------------------------------------------------------------
{
	console.log('\n--- the Edit button is the door, and it opens a box (Task 509) ---');
	build();
	const btn = L.editBtn();
	ok('the panel carries an Edit button', !!btn);
	ok('...and the box is shut until it is pressed', !L.editIsOpen());
	click(btn);
	ok('pressing it opens the box', L.editIsOpen());
	ok('...with the two ends, one pull-down each', selects().length === 2, selects().length + ' selects');
	click(btn);
	ok('pressing it again shuts the box', !L.editIsOpen());
	click(btn);

	// **THE BOX IS OVER THE MAP, NOT IN THE PANEL.** Task 506's ruling is that the panel has no
	// control column, and an overlay that had crept back into #lpn_profile_form would be one.
	let inPanel = 0;
	(function walk(e) { if (!e) { return; } if (e._tag === 'select') { inPanel++; } (e.children || []).forEach(walk); }(byId.lpn_profile_form));
	ok('...and no pull-down has crept back into the panel itself', inPanel === 0, inPanel + ' selects');
}

// ---- 2. changing ONE end, which is the first operation Task 506 took --------------------------
{
	console.log('\n--- one end moves; the waypoints and the far end do not ---');
	const id = build();
	// A route with a waypoint on it, set the way the gesture would leave it.
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E];
	click(L.editBtn());
	same(L.profileStops(), [id.A, id.E, id.D], 'the box opens on the route that is on screen');

	pickSelect(selects()[0], id.C);
	ok('changing From moves that end', L.profileState().from === id.C, L.profileState().from);
	same(L.profileState().waypoints, [id.E], '...AND THE WAYPOINTS ARE STILL THERE');
	ok('...and the far end is untouched', L.profileState().to === id.D, L.profileState().to);

	pickSelect(selects()[1], id.A);
	ok('changing To moves the other end', L.profileState().to === id.A);
	same(L.profileState().waypoints, [id.E], '...and again the waypoints survive');
	ok('...and the near end is untouched', L.profileState().from === id.C);
}

// ---- 3. removing ONE waypoint, which is the second ---------------------------------------------
{
	console.log('\n--- a chip removes itself, and only itself ---');
	const id = build();
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E, id.C];
	click(L.editBtn());
	// Two waypoint chips plus the Remove-all beside them.
	ok('a chip per waypoint, plus Remove all', chips().length === 3, chips().length + ' buttons');

	click(chips()[0]);
	same(L.profileState().waypoints, [id.C], 'THE CHIP REMOVES ONE WAYPOINT, NOT THE LIST');
	ok('...and the two ends are untouched',
		L.profileState().from === id.A && L.profileState().to === id.D);
	ok('...and the box redraws with one chip left', chips().length === 2, chips().length + ' buttons');

	// Remove all is still there, and is still a different act.
	click(chips()[chips().length - 1]);
	same(L.profileState().waypoints, [], 'Remove all clears every waypoint');
	ok('...and the ends still survive that too',
		L.profileState().from === id.A && L.profileState().to === id.D);
}

// ---- 4. the box and the gesture never edit the same thing at once ------------------------------
{
	console.log('\n--- the chooser takes the box with it ---');
	const id = build();
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	click(L.editBtn());
	ok('the box is open', L.editIsOpen());
	L.profileDrawStart();
	ok('starting the chooser SHUTS the box', !L.editIsOpen());
	ok('...and withdraws the Edit door while the gesture runs', !L.editBtn());
	L.profileDrawCancel();
	ok('cancelling the gesture puts the door back', !!L.editBtn());
}

// ---- 5. Task 510: the list, and the three commands ---------------------------------------------
{
	console.log('\n--- New, Rename, Delete, and the list on the tab ---');
	const id = build();
	ok('the Profile tab carries a menu arrow', !!L.profileMenuBtn());
	// **PRESSING THE ARROW MUST NOT ARM THE CHOOSER.** The tab's second show() is the command that
	// starts drawing a path, so an arrow routed through openPane() would draw one every time.
	click(L.profileMenuBtn());
	ok('pressing the arrow does NOT start a path', !L.profileState().draw);
	ok('...and the menu says there is nothing saved yet',
		L.menuRows().some((t) => /No saved paths/.test(t)), JSON.stringify(L.menuRows()));

	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E];
	promptAnswer = 'Main line';
	L.newSavedProfile();
	ok('New keeps one path', L.savedProfiles().length === 1, L.savedProfiles().length);
	same(L.savedProfiles()[0].stops, [id.A, id.E, id.D],
		'...as the STOPS the user chose, not the route they resolve to');
	ok('...named what was typed', L.savedProfiles()[0].name === 'Main line', L.savedProfiles()[0].name);

	promptAnswer = 'Trunk';
	L.renameSavedProfile();
	ok('Rename renames the selected one', L.savedProfiles()[0].name === 'Trunk');
	same(L.savedProfiles()[0].stops, [id.A, id.E, id.D], '...and changes nothing else');

	// A second path, so applying one is a real choice.
	L.profileState().from = id.A;
	L.profileState().to = id.C;
	L.profileState().waypoints = [];
	promptAnswer = 'Short';
	L.newSavedProfile();
	ok('a second path joins the list', L.savedProfiles().length === 2);
	L.closeMenu();
	click(L.profileMenuBtn());
	ok('...and both names are in the menu',
		L.menuRows().some((t) => /Trunk/.test(t)) && L.menuRows().some((t) => /Short/.test(t)),
		JSON.stringify(L.menuRows()));

	L.applySavedProfile(L.savedProfiles()[0]);
	same(L.profileStops(), [id.A, id.E, id.D], 'applying a saved path puts its stops back on screen');

	confirmAnswer = false;
	L.deleteSavedProfile();
	ok('Delete asks first, and a refusal keeps the path', L.savedProfiles().length === 2);
	confirmAnswer = true;
	L.deleteSavedProfile();
	ok('...and a confirmation removes it', L.savedProfiles().length === 1, L.savedProfiles().length);
	ok('...leaving the DRAWING alone, which is what the question promised',
		L.getDoc().nodes.length === 5, L.getDoc().nodes.length + ' nodes');
	// New with nothing drawn saves nothing rather than an empty name.
	L.profileState().from = ''; L.profileState().to = ''; L.profileState().waypoints = [];
	L.newSavedProfile();
	ok('New with no path on screen saves nothing, and says so',
		L.savedProfiles().length === 1 && /No path yet/.test(L.noticeText() || ''),
		JSON.stringify(L.noticeText()));
}

// ---- 6. THE FILE BOUNDARY ----------------------------------------------------------------------
{
	console.log('\n--- a saved path survives save-and-open, verbatim ---');
	const id = build();
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E];
	promptAnswer = 'Main line';
	L.newSavedProfile();

	const file = JSON.parse(JSON.stringify(L.serialize()));
	ok('serializeProject() writes the saved paths',
		Array.isArray(file.profiles) && file.profiles.length === 1, JSON.stringify(file.profiles));
	same(file.profiles[0].stops, [id.A, id.E, id.D], '...with the stops the user chose');

	// THE ROUND TRIP, through the same door a real open uses.
	L.reset();
	ok('the new document starts with none', L.savedProfiles().length === 0);
	L.applySaved(JSON.parse(JSON.stringify(file)));
	ok('opening the file brings the saved path back', L.savedProfiles().length === 1);
	same(L.savedProfiles()[0], file.profiles[0], 'THE ROUND TRIP IS THE SAME OBJECT, key for key');

	// A file written before Task 510 has no such key and must open exactly as it always did.
	const old = JSON.parse(JSON.stringify(file));
	delete old.profiles;
	L.applySaved(old);
	same(L.savedProfiles(), [], 'a file written before this existed opens with an empty list');
}

// ---- 7. AN UNKNOWN ID IS REPORTED, NOT DROPPED --------------------------------------------------
{
	console.log('\n--- a stop naming a node this document does not have ---');
	const id = build();
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E];
	promptAnswer = 'Main line';
	L.newSavedProfile();
	const file = JSON.parse(JSON.stringify(L.serialize()));
	// The node goes away between the save and the open -- which is exactly the case: somebody
	// deleted a junction, or opened the file against a network that never had it.
	file.nodes = file.nodes.filter((n) => n.id !== id.E);
	file.links = file.links.filter((l) => l.from !== id.E && l.to !== id.E);

	L.reset();
	L.applySaved(JSON.parse(JSON.stringify(file)));
	same(L.savedProfiles()[0].stops, [id.A, id.E, id.D],
		'THE STORED PATH KEEPS THE UNKNOWN ID -- it is the user\'s data');
	const issues = L.profileSavedIssues();
	ok('...and the page can say which one is missing',
		issues.length === 1 && issues[0].missing.length === 1, JSON.stringify(issues));
	ok('...by name', issues[0].missing[0] === id.E, JSON.stringify(issues[0].missing));

	L.applySavedProfile(L.savedProfiles()[0]);
	ok('applying it SAYS SO rather than shortening the path in silence',
		(L.noticeText() || '').indexOf(id.E) >= 0, JSON.stringify(L.noticeText()));
	same(L.profileStops(), [id.A, id.D], '...and draws the part that can be drawn');
	same(L.savedProfiles()[0].stops, [id.A, id.E, id.D], '...WITHOUT rewriting what is stored');

	// And it survives ANOTHER save: a file opened and saved again must not lose it either.
	const again = JSON.parse(JSON.stringify(L.serialize()));
	same(again.profiles[0].stops, [id.A, id.E, id.D],
		'saving that document again writes the unknown id back unchanged');
}

// ---- 8. THE .inp EXPORTER SKIPS IT ---------------------------------------------------------------
{
	console.log('\n--- EPANET has no such object, so the export has no trace of it ---');
	const id = build();
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [id.E];
	promptAnswer = 'ZZTOPPATH';
	L.newSavedProfile();
	const out = EngCalcs.lpnExportInp(L.serialize(), { effective: (o) => o, labelSize: () => null });
	ok('the export succeeds', !!(out && out.ok), out && out.detail);
	ok('...and names no saved path', (out.text || '').indexOf('ZZTOPPATH') < 0);
	ok('...and writes no section for one', !/\[PROFILES?\]/i.test(out.text || ''));
}

console.log('\n' + (fails ? `FAILED ${fails} of ${checks}` : `All ${checks} checks passed.`));
process.exit(fails ? 1 : 0);

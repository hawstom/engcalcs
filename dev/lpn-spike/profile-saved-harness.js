// Tasks 509 and 510 -- the profile's EDIT BOX and its SAVED PATHS.
//
//   node dev/lpn-spike/profile-saved-harness.js
//
// Two features, one harness, because they are one seam: the box edits the path and the saved list
// stores it, and both write through `profileState`.
//
// ---- WHAT IS LEFT OF TASK 509 HERE ------------------------------------------------------------
//
// **THE EDIT BOX IS GONE, 2026-08-29** -- Tom, having used it: *"we shouldn't need any interface in
// the bottom pane other than an Edit button. We have From and To: I can see those in the map. We
// have Nodes on the way: I can see those on the map."* Its two pull-downs and its waypoint chips
// are handles on the drawing now, so the three hazards this file used to hold -- changing one end
// redrawing the whole route, a chip clearing the list, and controls left standing over a gesture
// they are not editing -- moved with them to dev/lpn-spike/profile-edit-harness.js, which drives
// the handles. What stays here is the DOOR and the INTERLOCK: the button exists, it toggles edit
// mode, and the chooser turns edit mode off rather than running beside it.
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
	"\t\teditIsOpen: function () { return !!profileState.editing; },\n" +
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
	// Edit mode is turned off between fixtures the way the tab's own hide() turns it off: a section
	// that inherited it from the one before would toggle it OFF on its first press.
	L.openPane('profile');
	return id;
}
function click(el) { (el._listeners.click || []).forEach((fn) => fn({ preventDefault() {}, stopPropagation() {} })); }

// ---- 1. the door, and the interlock ------------------------------------------------------------
{
	console.log('\n--- the Edit button is the door, and it arms the path (Task 509) ---');
	const id = build();
	const btn = L.editBtn();
	ok('the panel carries an Edit button', !!btn);
	ok('...and the path is not in edit mode until it is pressed', !L.editIsOpen());
	click(btn);
	ok('pressing it puts the path in edit mode', L.editIsOpen());
	click(btn);
	ok('pressing it again takes it back out', !L.editIsOpen());

	// **NOTHING OPENS IN THE PANEL.** Task 506's ruling is that the panel has no control column, and
	// the retired overlay's pull-downs creeping back into #lpn_profile_form would be one.
	click(btn);
	let inPanel = 0;
	(function walk(e) { if (!e) { return; } if (e._tag === 'select') { inPanel++; } (e.children || []).forEach(walk); }(byId.lpn_profile_form));
	ok('...and no pull-down has appeared in the panel', inPanel === 0, inPanel + ' selects');

	// THE INTERLOCK: profileStops() ignores from/to/waypoints while the chooser runs, so edit mode
	// left on there would be a set of handles that appear to do nothing.
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileDrawStart();
	ok('starting the chooser turns edit mode OFF', !L.editIsOpen());
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

// WHETHER A BOX WAS OPEN, REMEMBERED -- Tom, 2026-09-04: *"lpn Boxes: Browser remembers its
// position on reload, but doesn't remember whether it was open. Can it do that too?"* Run with:
//
//   node dev/lpn-spike/box-open-memory-harness.js
//
// WHY THIS EXISTS. Every way of getting this wrong is silent, and three of them are only visible on
// the SECOND page load, which is exactly the pass a person testing by hand does not do:
//
//   1. **The flag rides an existing key, so a loader that types its fields can drop it.** The
//      Settings record was five numbers and `loadSetboxLayout()` accepted a field only if it was a
//      finite number; `open` is a boolean, and the box would have gone on never reopening while the
//      writer looked perfectly correct. Asserted through a real localStorage round trip rather than
//      by reading the variable back, because holding a value in memory is not the thing that was
//      asked for.
//   2. **A corner remembered on a big monitor opens off the edge of a small one.** The restore path
//      deliberately owns no placement of its own -- it calls the same opener a menu row calls, which
//      re-clamps. If that ever stopped being true, the box would come back at coordinates nobody can
//      reach, and on a phone that is a box with no visible X.
//   3. **A box that must NOT come back.** The three report boxes, the Library box and every modal
//      are deliberately excluded (see restoreOpenBoxes()), and "deliberately excluded" and "nobody
//      wired it yet" look identical in a diff. Asserted here so that adding one is a decision
//      somebody makes on purpose, against a failing test.
//   4. **Escape writes to storage on every press.** closeSettingsBox() runs on every Escape whether
//      or not the box is showing. Unguarded, that is a localStorage write behind a key the reader
//      never touched, on a key they may never have created.
//
// It also holds the thing Tom would notice on the first reload: a restored Find box must NOT steal
// the caret. A box the reader opened wants focus; a box that merely came back with the page must
// not have it, or the first keystroke after every reload disappears into it.

'use strict';

const { byId, ensure, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	// The Find box: its element, its two doors, its loader, and the flag itself.
	"\t\tfindEl: function () { return document.getElementById('lpn_find_popup'); },\n" +
	"\t\topenFind: function (anchor, restoring) { toggleFindPopup(anchor, restoring); },\n" +
	"\t\tcloseFind: closeFindPopup,\n" +
	"\t\tloadFindLayout: loadFindLayout,\n" +
	"\t\tsaveFindLayout: saveFindLayout,\n" +
	"\t\tfindOpen: function () { return findUserOpen; },\n" +
	"\t\tsetFindPos: function (p) { findUserPos = p; },\n" +
	// The Settings box: the same three things, plus the record it shares with the geometry.
	"\t\tsetboxEl: setboxEl,\n" +
	"\t\tsetboxIsOpen: setboxIsOpen,\n" +
	"\t\topenSettings: function (s) { openSettingsBox(s); },\n" +
	"\t\tcloseSettings: closeSettingsBox,\n" +
	"\t\tloadSetboxLayout: loadSetboxLayout,\n" +
	"\t\tsetboxLayout: function () { return setboxLayout; },\n" +
	// The boot path itself.
	"\t\trestoreOpenBoxes: restoreOpenBoxes,\n" +
	// The boxes that must stay shut, read by id so this list is the same list restoreOpenBoxes()
	// names in prose.
	"\t\tdisplayOf: function (id) { var e = document.getElementById(id); return e ? e.style.display : '(absent)'; },\n" +
	// The focus spy, wrapped around the LOOKUP the opener itself performs rather than around an
	// element handed in from outside: rebuildFindForm() replaces the field on every open, so an
	// element spied on before the call is not the element that gets focused.
	"\t\tarmFocusSpy: function () { var c = { n: 0 }, p = document.getElementById('lpn_find_popup'),\n" +
	"\t\t\torig = p.querySelector;\n" +
	"\t\t\tp.querySelector = function (s) { var el = orig.call(p, s);\n" +
	"\t\t\t\tif (el && s === 'input[type=text]') { el.focus = function () { c.n++; }; }\n" +
	"\t\t\t\treturn el; };\n" +
	"\t\t\treturn c; },\n" +
	"\t\tsmallScreen: smallScreen,\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const FIND_KEY = 'lpn_findbox';
const SETBOX_KEY = 'lpn_setbox';
function stored(k) {
	const raw = global.localStorage.getItem(k);
	return raw === null ? null : JSON.parse(raw);
}
function keyNames() {
	const out = [];
	for (let i = 0; i < global.localStorage.length; i++) { out.push(global.localStorage.key(i)); }
	return out.sort();
}
// A fresh browser: nothing at all in storage, and the two records back at their birth values.
function wipe() {
	keyNames().forEach(k => global.localStorage.removeItem(k));
}

console.log('\n--- the Find box records that it is open, on the key that already holds where it is ---');
{
	wipe();
	L.openFind(null);
	ok('opening writes open:true', stored(FIND_KEY) !== null && stored(FIND_KEY).open === true,
		JSON.stringify(stored(FIND_KEY)));
	ok('and no second key was created', keyNames().join(',') === FIND_KEY, keyNames().join(','));
	L.closeFind();
	ok('closing writes open:false', stored(FIND_KEY).open === false);
	ok('the box really is hidden', L.displayOf('lpn_find_popup') === 'none', L.displayOf('lpn_find_popup'));
}

console.log('\n--- the geometry and the flag survive together, through storage ---');
{
	wipe();
	L.setFindPos({ left: 321, top: 210 });
	L.openFind(null);
	// The reload: forget everything held in memory and read the record back the way a fresh page
	// does. Position and openness are one record, so a loader that drops either drops the other's
	// argument for being there.
	L.setFindPos(null);
	L.loadFindLayout();
	ok('the corner came back', L.findOpen() === true && stored(FIND_KEY).left === 321,
		JSON.stringify(stored(FIND_KEY)));
	ok('and so did the openness', L.findOpen() === true);
}

console.log('\n--- the Settings box: a BOOLEAN on a record of five numbers ---');
{
	wipe();
	L.openSettings();
	ok('opening writes open:true', stored(SETBOX_KEY) !== null && stored(SETBOX_KEY).open === true,
		JSON.stringify(stored(SETBOX_KEY)));
	ok('the box is showing', L.setboxIsOpen() === true);
	// THE DEFECT THIS ONE IS FOR: loadSetboxLayout() used to accept a field only if it was a finite
	// number, so a boolean would have been read back as the birth value and the box would never have
	// reopened -- with the writer looking entirely correct.
	L.setboxLayout().open = false;
	L.loadSetboxLayout();
	ok('and the loader does not throw the boolean away', L.setboxLayout().open === true);
	L.closeSettings();
	ok('closing writes open:false', stored(SETBOX_KEY).open === false);
	ok('the box is hidden', L.setboxIsOpen() === false);
}

console.log('\n--- a record written before this field existed reads as CLOSED, with no migration ---');
{
	wipe();
	global.localStorage.setItem(SETBOX_KEY, JSON.stringify({ left: 40, top: 50, w: 500, h: 400, ix: 106 }));
	L.setboxLayout().open = true;
	L.loadSetboxLayout();
	ok('an absent open reads false', L.setboxLayout().open === false);
	ok('and the five numbers still arrive', L.setboxLayout().w === 500 && L.setboxLayout().ix === 106);
	global.localStorage.setItem(FIND_KEY, JSON.stringify({ left: 10, top: 20, w: null, h: null }));
	L.loadFindLayout();
	ok('same for the Find record', L.findOpen() === false);
}

console.log('\n--- Escape does not write to storage behind a box that is already shut ---');
{
	wipe();
	// Escape calls closeSettingsBox() on every press. With nothing open, nothing may be written --
	// including the key itself, which this visitor has never created.
	L.closeSettings();
	L.closeSettings();
	ok('no key was created by closing a closed box', keyNames().length === 0, keyNames().join(','));
	L.closeFind();
	ok('and the same for Find', keyNames().length === 0, keyNames().join(','));
}

console.log('\n--- the boot path reopens exactly the two boxes, and nothing else ---');
{
	wipe();
	global.localStorage.setItem(FIND_KEY, JSON.stringify({ left: 100, top: 120, w: null, h: null, open: true }));
	global.localStorage.setItem(SETBOX_KEY, JSON.stringify({ left: 200, top: 60, w: 520, h: 420, ix: 106, open: true }));
	L.loadFindLayout();
	L.loadSetboxLayout();
	L.restoreOpenBoxes();
	ok('Find came back', L.displayOf('lpn_find_popup') === 'flex', L.displayOf('lpn_find_popup'));
	ok('Settings came back', L.setboxIsOpen() === true);
	// The deliberate exclusions, by id. Each one is named in restoreOpenBoxes()'s own note with the
	// reason it is excluded; this is that note held to.
	// The deliberate exclusions, by id. Each one is named in restoreOpenBoxes()'s own note with the
	// reason it is excluded; this is that note held to. "Shut" is "restoreOpenBoxes() did not SHOW
	// it" -- the stub does not read the page's inline styles, so a box it has never touched reports
	// an empty display, and asserting on the literal 'none' would have been asserting about the stub.
	[['lpn_ff_box', 'fire flow -- a report about a run, and a reload has no run'],
	 ['lpn_energy_box', 'energy -- same'],
	 ['lpn_scncmp_box', 'scenario compare -- opening it starts N solves'],
	 ['lpn_library_box', 'the Library box -- it remembers no corner either'],
	 ['lpn_popup', 'the property popup -- an answer to a selection that is not restored'],
	 ['lpn_new_panel', 'the New-project box -- a modal'],
	 ['lpn_ff_run_box', 'the fire-flow run dialog -- a modal'],
	 ['lpn_notes_popup', 'the notes popover -- transient'],
	 ['lpn_dialog', 'the confirm dialog -- a modal'],
	 ['lpn_backdrop_target_panel', 'the backdrop target panel -- a transient chooser'],
	 ['lpn_menu_popup', 'a pull-down']
	].forEach(function (row) {
		ensure(row[0]);
		var d = L.displayOf(row[0]);
		ok('stays shut: ' + row[1], d !== 'flex' && d !== 'block', d);
	});
	ok('and boot created no storage key of its own',
		keyNames().join(',') === [FIND_KEY, SETBOX_KEY].sort().join(','), keyNames().join(','));
}

console.log('\n--- a restored box does not take the caret ---');
{
	wipe();
	const spy = L.armFocusSpy();
	L.openFind(null);
	const byHand = spy.n;
	L.closeFind();
	L.openFind(null, true);
	ok('opening it by hand focuses the field', byHand === 1, byHand);
	ok('restoring it on boot does not', spy.n === byHand, spy.n);
	ok('but it is open all the same', L.displayOf('lpn_find_popup') === 'flex');
}

console.log('\n--- a corner remembered on a bigger monitor is clamped back into this window ---');
{
	wipe();
	// The restore path owns no placement: it calls the same opener a menu row calls, and that opener
	// re-clamps. Asserted through the boot path so that what is checked is the journey the user
	// actually takes -- a 2560px desktop's corner arriving in a 1200x900 window.
	global.localStorage.setItem(FIND_KEY,
		JSON.stringify({ left: 2400, top: 1300, w: null, h: null, open: true }));
	L.loadFindLayout();
	L.restoreOpenBoxes();
	const el = L.findEl();
	const left = parseFloat(el.style.left), top = parseFloat(el.style.top);
	ok('it is inside the window horizontally', left >= 0 && left < global.window.innerWidth, left);
	ok('it is inside the window vertically', top >= 0 && top < global.window.innerHeight, top);
	ok('and it is not simply where it was remembered', left !== 2400 && top !== 1300, left + ',' + top);
}

console.log(fails ? '\n' + fails + ' FAILURE(S)\n' : '\nAll box-open-memory checks passed.\n');
process.exit(fails ? 1 : 0);

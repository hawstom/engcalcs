// WHETHER A BOX WAS OPEN, REMEMBERED -- Tom, 2026-09-04: *"lpn Boxes: Browser remembers its
// position on reload, but doesn't remember whether it was open. Can it do that too?"* Run with:
//
//   node dev/lpn-spike/box-open-memory-harness.js
//
// WHY THIS EXISTS. Every way of getting this wrong is silent, and most of them are only visible on
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
//   3. **A box that must NOT come back.** The three report boxes and every modal are deliberately
//      excluded (see restoreOpenBoxes()), and "deliberately excluded" and "nobody wired it yet"
//      look identical in a diff. Asserted here so that adding one is a decision somebody makes on
//      purpose, against a failing test.
//   4. **Escape writes to storage on every press.** closeSettingsBox() and closeLibraryBox() run on
//      every Escape whether or not the box is showing. Unguarded, that is a localStorage write
//      behind a key the reader never touched, on a key they may never have created.
//   5. **THE FLAG RIDES ON A SAVER THE USER HAS NOT NECESSARILY TRIGGERED** -- Tom, 2026-09-04:
//      *"It took a few reloads before Find started remembering."* The one shape that produces
//      exactly that report is a record written only by the drag and resize handlers, so a box that
//      is merely OPENED and never moved persists nothing until the day the reader happens to drag
//      it. The §"opened and never touched" section below is that failure, held: a box is opened
//      with NO drag, NO resize and NO observer flush, and a genuinely fresh module -- a reload --
//      has to bring it back.
//
// It also holds the thing Tom would notice on the first reload: a restored Find box must NOT steal
// the caret. A box the reader opened wants focus; a box that merely came back with the page must
// not have it, or the first keystroke after every reload disappears into it.
//
// **A RELOAD HERE IS A SECOND loadLoopedNetwork(), NOT A RESET OF THE VARIABLES.** Every one of
// these records is read back into module-scope state at wiring time, so a test that keeps one
// module and re-calls its loader is asking whether a value survives an assignment. A second
// instance over the same localStorage has no memory of the first at all, which is what a reload is.

'use strict';

const { byId, ensure, loadLoopedNetwork, flushResizeObservers, clearResizeObservers } = require('./lpn-dom-stub.js');

// Everything the page keeps private that this harness has to reach. One string, because a "reload"
// is a second module built from exactly the same injection -- two lists would drift.
const INJECT =
	// The Find box: its element, its two doors, its loader, and the flag itself.
	"\t\tfindEl: function () { return document.getElementById('lpn_find_popup'); },\n" +
	"\t\topenFind: function (anchor, restoring) { toggleFindPopup(anchor, restoring); },\n" +
	"\t\tcloseFind: closeFindPopup,\n" +
	"\t\tloadFindLayout: loadFindLayout,\n" +
	"\t\tsaveFindLayout: saveFindLayout,\n" +
	"\t\tfindOpen: function () { return findUserOpen; },\n" +
	"\t\tsetFindPos: function (p) { findUserPos = p; },\n" +
	"\t\twireFindPopup: wireFindPopup,\n" +
	// The Settings box: the same three things, plus the record it shares with the geometry.
	"\t\tsetboxEl: setboxEl,\n" +
	"\t\tsetboxIsOpen: setboxIsOpen,\n" +
	"\t\topenSettings: function (s) { openSettingsBox(s); },\n" +
	"\t\tcloseSettings: closeSettingsBox,\n" +
	"\t\tloadSetboxLayout: loadSetboxLayout,\n" +
	"\t\tsetboxLayout: function () { return setboxLayout; },\n" +
	"\t\twireSettingsBox: wireSettingsBox,\n" +
	// The Libraries box, which got the whole memory -- corner, size and openness -- on Tom's word.
	"\t\tlibBoxEl: libBoxEl,\n" +
	"\t\tlibBoxIsOpen: libBoxIsOpen,\n" +
	"\t\topenLibrary: openLibraryBox,\n" +
	"\t\tcloseLibrary: closeLibraryBox,\n" +
	"\t\tloadLibboxLayout: loadLibboxLayout,\n" +
	"\t\tlibboxLayout: function () { return libboxLayout; },\n" +
	"\t\twireLibraryBox: wireLibraryBox,\n" +
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
	"\t\tsmallScreen: smallScreen,\n";

const L = loadLoopedNetwork(INJECT);

// A RELOAD: the markup's own inline `display:none` back on every box, the old page's observers
// retired, and a module that has never seen any of this. The three wiring calls are the three the
// boot path makes, in the order init() makes them -- each is where its box's record is READ, so a
// reload that skipped one would be testing a loader nobody calls.
function reload() {
	['lpn_find_popup', 'lpn_settings_box', 'lpn_library_box'].forEach(function (id) {
		byId[id].style.display = 'none';
	});
	clearResizeObservers();
	const P = loadLoopedNetwork(INJECT);
	P.wireFindPopup();
	P.wireSettingsBox();
	P.wireLibraryBox();
	return P;
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const FIND_KEY = 'lpn_findbox';
const SETBOX_KEY = 'lpn_setbox';
const LIBBOX_KEY = 'lpn_libbox';
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

console.log('\n--- the Libraries box: a corner, a size and a flag, on a key of its own ---');
{
	wipe();
	L.openLibrary();
	ok('opening writes open:true', stored(LIBBOX_KEY) !== null && stored(LIBBOX_KEY).open === true,
		JSON.stringify(stored(LIBBOX_KEY)));
	ok('the box is showing', L.libBoxIsOpen() === true);
	ok('and no other key was created', keyNames().join(',') === LIBBOX_KEY, keyNames().join(','));
	// Same boolean-among-numbers trap as the Settings record, and it is worth asserting separately:
	// this loader is a second copy of that shape, and a second copy is where the fix stops being
	// applied.
	L.libboxLayout().open = false;
	L.loadLibboxLayout();
	ok('the loader does not throw the boolean away', L.libboxLayout().open === true);
	L.closeLibrary();
	ok('closing writes open:false', stored(LIBBOX_KEY).open === false);
	ok('the box is hidden', L.libBoxIsOpen() === false);
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
	global.localStorage.setItem(LIBBOX_KEY, JSON.stringify({ left: 12, top: 34 }));
	L.libboxLayout().open = true;
	L.loadLibboxLayout();
	ok('same for the Libraries record', L.libboxLayout().open === false);
	ok('and its corner still arrives', L.libboxLayout().left === 12 && L.libboxLayout().top === 34);
}

console.log('\n--- Escape does not write to storage behind a box that is already shut ---');
{
	wipe();
	// Escape calls closeSettingsBox() and closeLibraryBox() on every press. With nothing open,
	// nothing may be written -- including the key itself, which this visitor has never created.
	L.closeSettings();
	L.closeSettings();
	ok('no key was created by closing a closed box', keyNames().length === 0, keyNames().join(','));
	L.closeFind();
	ok('and the same for Find', keyNames().length === 0, keyNames().join(','));
	L.closeLibrary();
	L.closeLibrary();
	ok('and the same for the Libraries box', keyNames().length === 0, keyNames().join(','));
}

console.log('\n--- the boot path reopens exactly the three boxes, and nothing else ---');
{
	wipe();
	global.localStorage.setItem(FIND_KEY, JSON.stringify({ left: 100, top: 120, w: null, h: null, open: true }));
	global.localStorage.setItem(SETBOX_KEY, JSON.stringify({ left: 200, top: 60, w: 520, h: 420, ix: 106, open: true }));
	global.localStorage.setItem(LIBBOX_KEY, JSON.stringify({ left: 240, top: 80, w: 600, h: 460, open: true }));
	L.loadFindLayout();
	L.loadSetboxLayout();
	L.loadLibboxLayout();
	L.restoreOpenBoxes();
	ok('Find came back', L.displayOf('lpn_find_popup') === 'flex', L.displayOf('lpn_find_popup'));
	ok('Settings came back', L.setboxIsOpen() === true);
	ok('the Libraries box came back', L.libBoxIsOpen() === true);
	// The deliberate exclusions, by id. Each one is named in restoreOpenBoxes()'s own note with the
	// reason it is excluded; this is that note held to. "Shut" is "restoreOpenBoxes() did not SHOW
	// it" -- the stub does not read the page's inline styles, so a box it has never touched reports
	// an empty display, and asserting on the literal 'none' would have been asserting about the stub.
	[['lpn_ff_box', 'fire flow -- a report about a run, and a reload has no run'],
	 ['lpn_energy_box', 'energy -- same'],
	 ['lpn_scncmp_box', 'scenario compare -- opening it starts N solves'],
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
		keyNames().join(',') === [FIND_KEY, SETBOX_KEY, LIBBOX_KEY].sort().join(','), keyNames().join(','));
}

console.log('\n--- OPENED AND NEVER TOUCHED: no drag, no resize, and it still comes back ---');
{
	// Tom, 2026-09-04: *"It took a few reloads before Find started remembering."* The shape that
	// produces that report is an `open` flag written only where the GEOMETRY is written -- the drag
	// callback and the resize observer -- so a box that is opened and left alone stores nothing
	// until the reader happens to move it. Every box here is opened by its own door and then
	// touched by nothing at all: no setFindPos, no drag, no flushResizeObservers.
	wipe();
	const A = reload();
	A.openFind(null);
	A.openSettings();
	A.openLibrary();
	const recs = { find: stored(FIND_KEY), set: stored(SETBOX_KEY), lib: stored(LIBBOX_KEY) };
	ok('Find wrote a record with no geometry in it at all',
		recs.find !== null && recs.find.open === true
		&& recs.find.left === null && recs.find.top === null
		&& recs.find.w === null && recs.find.h === null, JSON.stringify(recs.find));
	ok('so did the Libraries box',
		recs.lib !== null && recs.lib.open === true
		&& recs.lib.left === null && recs.lib.top === null
		&& recs.lib.w === null && recs.lib.h === null, JSON.stringify(recs.lib));
	ok('and Settings recorded the flag whatever its numbers are',
		recs.set !== null && recs.set.open === true, JSON.stringify(recs.set));

	// THE RELOAD, and it is the whole point of the section: a module that has never seen any of the
	// above, wired the way init() wires it, restoring from storage alone.
	const B = reload();
	ok('a fresh page reads Find back as open', B.findOpen() === true);
	ok('...and Settings', B.setboxLayout().open === true);
	ok('...and the Libraries box', B.libboxLayout().open === true);
	B.restoreOpenBoxes();
	ok('Find is on screen again', B.displayOf('lpn_find_popup') === 'flex', B.displayOf('lpn_find_popup'));
	ok('Settings is on screen again', B.setboxIsOpen() === true);
	ok('the Libraries box is on screen again', B.libBoxIsOpen() === true);

	// And the other direction, from the same untouched state: closing persists immediately too, so
	// a box shut on the way out does not come back uninvited.
	B.closeFind();
	B.closeSettings();
	B.closeLibrary();
	const C = reload();
	C.restoreOpenBoxes();
	ok('a box closed and never dragged stays shut',
		C.displayOf('lpn_find_popup') === 'none' && C.setboxIsOpen() === false && C.libBoxIsOpen() === false,
		C.displayOf('lpn_find_popup') + ',' + C.setboxIsOpen() + ',' + C.libBoxIsOpen());
}

console.log('\n--- the RESIZE OBSERVER writes the same records, and may never flip the flag ---');
{
	// The observer is the writer no harness had ever run: `window.ResizeObserver` did not exist in
	// the stub, so `if (window.ResizeObserver)` was false and the one saver that fires without the
	// user doing anything was invisible here (dev/testing-notes.md: a missing function is a
	// held-constant coupling too). It now exists, and what matters about it is one invariant --
	// it stores GEOMETRY, and it must never be able to answer the openness question.
	wipe();
	const A = reload();
	flushResizeObservers();
	ok('a flush behind three closed boxes writes nothing at all', keyNames().length === 0, keyNames().join(','));
	A.openFind(null);
	A.openLibrary();
	flushResizeObservers();
	ok('Find is still open after the observer has written', stored(FIND_KEY).open === true,
		JSON.stringify(stored(FIND_KEY)));
	ok('and so is the Libraries box', stored(LIBBOX_KEY).open === true, JSON.stringify(stored(LIBBOX_KEY)));
	ok('and the observer did store a size for it', typeof stored(LIBBOX_KEY).w === 'number',
		JSON.stringify(stored(LIBBOX_KEY)));
	A.closeFind();
	A.closeLibrary();
	flushResizeObservers();
	ok('a flush behind a box that was just closed cannot reopen it',
		stored(FIND_KEY).open === false && stored(LIBBOX_KEY).open === false,
		JSON.stringify(stored(FIND_KEY)) + ' ' + JSON.stringify(stored(LIBBOX_KEY)));
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
	global.localStorage.setItem(LIBBOX_KEY,
		JSON.stringify({ left: 2400, top: 1300, w: null, h: null, open: true }));
	L.loadFindLayout();
	L.loadLibboxLayout();
	L.restoreOpenBoxes();
	[['Find', L.findEl()], ['the Libraries box', L.libBoxEl()]].forEach(function (row) {
		const el = row[1];
		const left = parseFloat(el.style.left), top = parseFloat(el.style.top);
		ok(row[0] + ' is inside the window horizontally', left >= 0 && left < global.window.innerWidth, left);
		ok(row[0] + ' is inside the window vertically', top >= 0 && top < global.window.innerHeight, top);
		ok(row[0] + ' is not simply where it was remembered', left !== 2400 && top !== 1300, left + ',' + top);
	});
}

console.log(fails ? '\n' + fails + ' FAILURE(S)\n' : '\nAll box-open-memory checks passed.\n');
process.exit(fails ? 1 : 0);

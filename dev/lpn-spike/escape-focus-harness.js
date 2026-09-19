// ESCAPE REACHES A STANDING BOX ONLY WHEN FOCUS IS INSIDE IT. Run with:
//   node dev/lpn-spike/escape-focus-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-19: *"And please don't let Escape close those boxes when the mouse
// cursor is elsewhere. When I say 'only when box is in focus', I mean it in the strongest way
// possible. Big guards on closing a box."* He had reported the same thing before and it was a live
// defect on master: one document-level keydown ran closeMenu(), closeViewPopovers(), closePopup(),
// closeSettingsBox() and closeLibraryBox() on every Escape anywhere on the page, asking
// `document.activeElement` nothing at all. So an Escape meant for a tool or a selection also swept
// away a Properties or Settings box the reader had not touched.
//
// **THE MENUS STAY PAGE-WIDE AND THAT IS NOT AN OVERSIGHT.** Tom's 2026-08-13 ruling -- *"these are
// menus, not boxes"* -- and the convention Ida cites (Higley, "Escaping 101") agree: a pull-down
// and a view popover never take focus, so there is no focus to ask about, and dismissing them from
// anywhere IS the pattern. Asserted below, because a future tidy-up that "makes Escape consistent"
// would break a ruling by making the code look neater.
//
// **AND THE THIRD ASSERTION IS THE ONE THAT IS EASY TO MISS.** Scoping the closers without scoping
// escapeClosableOpen() would trade Tom's complaint for a DEAD ESCAPE KEY: an open-but-unfocused box
// would still count as "a box was open", so the press would cost neither the box nor the armed
// tool, for as long as that box sat in the corner. That is worse than what he reported, and nothing
// on screen would say why.
//
// THE MUTATION AT THE END is the point of the file. A harness asserting that a box stayed open can
// pass because the box never opened, because the key never arrived, or because the handler is not
// wired -- so the guard is removed from the source and the first assertion is REQUIRED to fail.

'use strict';

const { mkEl, ensure, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const INJECT =
	"\t\tcloseMenu: closeMenu,\n" +
	"\t\tsetboxIsOpen: setboxIsOpen, libBoxIsOpen: libBoxIsOpen,\n" +
	"\t\tsetMode: setMode, getMode: function () { return mode; },\n";

// The guard, as it stands in the shipped source. loadLoopedNetwork() throws when a mutation matches
// nothing, so rewording the guard cannot quietly turn the mutation below into a no-op.
const GUARD = "\t\tif (escapeFocusIsInside('lpn_popup')) { closePopup(); }\n" +
	"\t\tif (escapeFocusIsInside('lpn_settings_box')) { closeSettingsBox(); }\n" +
	"\t\tif (escapeFocusIsInside('lpn_library_box')) { closeLibraryBox(); }\n";
const PAGE_WIDE = "\t\tclosePopup();\n\t\tcloseSettingsBox();\n\t\tcloseLibraryBox();\n";

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// Escape, as the page receives it. The stub has no real event dispatch, so the document's own
// registered keydown listeners are called directly -- the house pattern in these harnesses.
function pressEscape() {
	(global.document._listeners.keydown || []).slice().forEach(function (fn) {
		fn({ key: 'Escape', type: 'keydown', preventDefault: function () {}, target: global.document.activeElement });
	});
}

// The three boxes, shown the way the page shows them. Display strings matter: setboxIsOpen() and
// libBoxIsOpen() test for 'flex' exactly, and the popup for anything that is not 'none'.
function showBoxes() {
	ensure('lpn_popup').style.display = 'block';
	ensure('lpn_settings_box').style.display = 'flex';
	ensure('lpn_library_box').style.display = 'flex';
}
function boxStates() {
	return {
		popup: ensure('lpn_popup').style.display,
		settings: ensure('lpn_settings_box').style.display,
		library: ensure('lpn_library_box').style.display
	};
}
function allOpen(s) { return s.popup !== 'none' && s.settings === 'flex' && s.library === 'flex'; }

// A focusable element genuinely inside a box, the way every one of these boxes really holds its
// fields -- not the box element itself, because a reader's focus lands on a control.
const probes = {};
function fieldInside(boxId) {
	if (!probes[boxId]) {
		const box = ensure(boxId), input = mkEl('input');
		input.id = boxId + '_probe_field';
		box.appendChild(input);
		probes[boxId] = input;
	}
	return probes[boxId];
}

function build(mutate) {
	const L = loadLoopedNetwork(INJECT, null, mutate);
	// Every id this harness drives must exist before the handler can see it. ensure() is the stub's
	// own door; the real page builds these in Looped-Network.php.
	['lpn_popup', 'lpn_settings_box', 'lpn_library_box', 'lpn_menu_popup'].forEach(function (id) {
		ensure(id).style.display = 'none';
	});
	return L;
}

console.log('=== R-005: Escape and the three standing boxes ===');

const L = build();

// ---- 1. FOCUS OUTSIDE: THE BOXES ARE LEFT ALONE. This is Tom's complaint. --------------------
console.log('\n-- focus is on the drawing, which is where it is nearly all of the time --');
showBoxes();
global.document.activeElement = global.document.body;
pressEscape();
let s = boxStates();
ok('Properties stays open when Escape is pressed with focus outside it', s.popup !== 'none', s.popup);
ok('Settings stays open too', s.settings === 'flex', s.settings);
ok('Libraries stays open too', s.library === 'flex', s.library);

// ...and nothing focused at all is the same answer. A reader who has clicked empty canvas leaves
// activeElement null in some browsers and body in others; both are "not inside a box".
showBoxes();
global.document.activeElement = null;
pressEscape();
ok('...and with nothing focused at all, which is the other spelling of the same state',
	allOpen(boxStates()), JSON.stringify(boxStates()));

// A focused control that belongs to something ELSE on the page must not count either -- the guard
// asks whether focus is inside THAT box, not whether anything anywhere has focus.
showBoxes();
global.document.activeElement = mkEl('input');
pressEscape();
ok('...and with focus in a field belonging to another box entirely',
	allOpen(boxStates()), JSON.stringify(boxStates()));

// ---- 2. FOCUS INSIDE: THE BOX CLOSES, AND ONLY THAT BOX ---------------------------------------
console.log('\n-- focus is inside one of the boxes, which is the case that keeps a keyboard exit --');
showBoxes();
global.document.activeElement = fieldInside('lpn_settings_box');
pressEscape();
s = boxStates();
ok('Escape from inside Settings closes Settings', s.settings === 'none', s.settings);
ok('...and leaves Properties alone, because one press costs one thing', s.popup !== 'none', s.popup);
ok('...and leaves Libraries alone', s.library === 'flex', s.library);

showBoxes();
global.document.activeElement = fieldInside('lpn_popup');
pressEscape();
s = boxStates();
ok('Escape from inside Properties closes Properties', s.popup === 'none', s.popup);
ok('...and leaves Settings alone', s.settings === 'flex', s.settings);

showBoxes();
global.document.activeElement = fieldInside('lpn_library_box');
pressEscape();
s = boxStates();
ok('Escape from inside Libraries closes Libraries', s.library === 'none', s.library);
ok('...and leaves Settings alone', s.settings === 'flex', s.settings);

// The box element itself, not one of its fields: a box given tabindex, or a click landing on its
// own background. Still inside.
showBoxes();
global.document.activeElement = ensure('lpn_settings_box');
pressEscape();
ok('the box element itself counts as inside itself', boxStates().settings === 'none');

// ---- 3. THE MENU IS UNTOUCHED (Tom's 2026-08-13 ruling) ---------------------------------------
console.log('\n-- the menu pull-down, which is a menu and not a box --');
ensure('lpn_menu_popup').style.display = 'block';
global.document.activeElement = global.document.body;
pressEscape();
ok('Escape closes the menu from anywhere on the page, as the 2026-08-13 ruling says',
	ensure('lpn_menu_popup').style.display === 'none', ensure('lpn_menu_popup').style.display);

// ---- 4. ESCAPE IS NOT DEAD WHILE AN UNFOCUSED BOX SITS THERE ----------------------------------
//
// The leg that is easy to miss: escapeClosableOpen() has to ask the same focus question, or an
// open-but-unfocused box swallows the press and the armed tool never goes away.
console.log('\n-- an armed tool, with an unfocused box standing in the corner --');
showBoxes();
ensure('lpn_menu_popup').style.display = 'none';
L.setMode('pipe');
global.document.activeElement = global.document.body;
pressEscape();
ok('Escape still leaves the armed tool, even though a box is open elsewhere',
	L.getMode() === 'select', L.getMode());
ok('...and that same press still did not touch the boxes', allOpen(boxStates()), JSON.stringify(boxStates()));

// ---- 5. THE LIVE MUTATION ---------------------------------------------------------------------
console.log('\n-- live mutation: the guard removed, which is master as Tom found it --');
build(function (src) {
	if (src.indexOf(GUARD) < 0) { throw new Error('the guard lines have moved; update GUARD in this harness'); }
	return src.replace(GUARD, PAGE_WIDE);
});
showBoxes();
global.document.activeElement = global.document.body;
pressEscape();
s = boxStates();
ok('without the guard, Escape from outside DOES close all three -- so the checks above test the repair',
	s.popup === 'none' && s.settings === 'none' && s.library === 'none', JSON.stringify(s));

console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILED'));
process.exit(fails === 0 ? 0 : 1);

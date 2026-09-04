// THE DIVIDER BETWEEN THE SETTINGS PANES -- ROADMAP Task 576. Run with:
//   node dev/lpn-spike/setbox-divider-harness.js
//
// Tom, 2026-09-04: *"It might be nice... to let the user drag the divider between the settings
// panes."* The index pane is a fixed width chosen against English section names on a PC, so a
// language with longer words, or a reader who simply wants more of the list visible, had nothing
// to say so with.
//
// FOUR THINGS HERE ARE QUIET WHEN THEY BREAK, WHICH IS WHY THEY ARE ASSERTED AND NOT DESCRIBED:
//
//   1. **The clamps.** One number is written -- the index's flex-basis -- and the content pane takes
//      whatever is left, so a missing floor is a pane dragged to nothing and a missing ceiling is an
//      index that has swallowed the settings it indexes. Neither throws; both just look broken.
//   2. **The sign in the five RTL languages.** The index sits on the RIGHT there, so dragging
//      towards the window's right edge must NARROW it. Get this wrong and the divider runs away from
//      the pointer -- and it would be correct in the 22 languages anybody testing this reads.
//   3. **The keyboard.** A drag handle wired only to `pointermove` is a control a keyboard user does
//      not have at all, and nothing on screen says so.
//   4. **The spacing arithmetic.** A third flex child earns a second `gap`. The negative margin that
//      pays it back is checked here against the stylesheet, because the phone rule subtracts a fifth
//      of a 10px gap by hand and would be silently wrong against a 26px one.

'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\twireDivider: function () { wireSetboxDivider(); },\n" +
	"\t\tsetIndexWidth: function (px) { return setSetboxIndexWidth(px); },\n" +
	"\t\tresetIndexWidth: function () { resetSetboxIndexWidth(); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const index = byId.lpn_setbox_index;
const panes = byId.lpn_setbox_panes;
const divider = byId.lpn_setbox_divider;

// The stub hands every element the same 1000px rect. The panes row is given a real width so the
// ceiling has something to be a fraction OF, and the index reports whatever was last written to it,
// which is what the page's own getBoundingClientRect() would say after a repaint.
panes.clientWidth = 400;
index.getBoundingClientRect = function () {
	const w = parseFloat(index.style.flexBasis || '106');
	return { left: 0, top: 0, right: w, bottom: 500, width: w, height: 500 };
};
function widthNow() { return parseFloat(index.style.flexBasis); }
function press(x) { (divider._listeners.pointerdown || []).forEach(f => f({ clientX: x, pointerId: 1 })); }
function moveTo(x) { (divider._listeners.pointermove || []).forEach(f => f({ clientX: x, pointerId: 1 })); }
function release() { (divider._listeners.pointerup || []).forEach(f => f({ pointerId: 1 })); }
function key(k) { (divider._listeners.keydown || []).forEach(f => f({ key: k })); }
function ltr() { document.documentElement.dir = ''; }
function rtl() { document.documentElement.dir = 'rtl'; }

L.wireDivider();
ltr();

console.log('\n--- the drag moves the index, and only the index ---');
{
	L.setIndexWidth(106);
	press(200);
	moveTo(260);
	ok('dragging right widens the index by exactly the distance dragged', widthNow() === 166, widthNow());
	moveTo(180);
	// The whole gesture is measured from where it STARTED, never from the last move: accumulating
	// deltas is how a drag drifts away from the pointer over a long one.
	ok('...and dragging back is measured from the press, not from the last move',
		widthNow() === 86, widthNow());
	release();
	moveTo(600);
	ok('...and a move after the release does nothing', widthNow() === 86, widthNow());
}

console.log('\n--- the clamps ---');
{
	L.setIndexWidth(106);
	press(200);
	moveTo(0);
	ok('the index cannot be dragged to nothing', widthNow() === 48, widthNow());
	moveTo(900);
	// 60% of the 400px panes row. Past this the index has swallowed the settings it is an index to.
	ok('...and cannot swallow the content pane', widthNow() === 240, widthNow());
	release();
}

console.log('\n--- right is not always wider (the five RTL languages) ---');
{
	rtl();
	L.setIndexWidth(106);
	press(200);
	moveTo(260);
	ok('dragging towards the right edge NARROWS an index that sits on the right',
		widthNow() === 48, widthNow());
	moveTo(160);
	ok('...and dragging away from it widens the index', widthNow() === 146, widthNow());
	release();
	ltr();
}

console.log('\n--- the keyboard has the same control the mouse has ---');
{
	L.setIndexWidth(106);
	key('ArrowRight');
	ok('an arrow key moves the divider', widthNow() === 118, widthNow());
	key('ArrowLeft');
	key('ArrowLeft');
	ok('...in both directions', widthNow() === 94, widthNow());
	rtl();
	key('ArrowRight');
	ok('...and the arrow names a direction on SCREEN, so it flips with the writing direction',
		widthNow() === 82, widthNow());
	ltr();
	key('Home');
	ok('Home hands the width back to the stylesheet rather than to a number of our own',
		index.style.flexBasis === '', JSON.stringify(index.style.flexBasis));
	key('PageUp');
	ok('...and a key it does not own is left alone', index.style.flexBasis === '');
}

console.log('\n--- the markup and the spacing ---');
{
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
	// To the closing tag, not to the first `>`: the aria-label is a PHP echo and carries one of
	// its own, which is what the first version of this regex stopped at.
	const tag = (php.match(/<div id="lpn_setbox_divider"[\s\S]*?<\/div>/) || [''])[0];
	ok('the divider is in the shipped markup', tag !== '');
	ok('...as a separator, so it is announced as one', /role="separator"/.test(tag));
	ok('...reachable by keyboard', /tabindex="0"/.test(tag));
	// An aria-label out of $ec_lang, not an English literal: this is a name a screen reader reads
	// aloud, in 27 languages.
	ok('...and named from the language file, never in English here',
		/aria-label="<\?=htmlspecialchars\(\$ec_lang\['lpn_setbox_divider'\]\)\?>"/.test(tag), tag);
	ok('...and carries no title, which on touch would be a tip that does not exist',
		!/title=/.test(tag), tag);

	const rule = (css.match(/\.lpn-setbox-divider \{[\s\S]*?\}/) || [''])[0];
	ok('the strip declines the browser\'s own scroll gesture', /touch-action:\s*none/.test(rule), rule);
	// 6px strip, -8px each side, against a 10px gap counted twice: 6 + 26 - 16 = 10, the spacing
	// the two panes had before there was a divider between them.
	const basis = (rule.match(/flex:\s*0 0 (\d+)px/) || [])[1];
	const marg = (rule.match(/margin:\s*0 (-?\d+)px/) || [])[1];
	const gap = (css.match(/\.lpn-setbox-panes \{[^}]*gap:\s*(\d+)px/) || [])[1];
	ok('...and gives back exactly the second gap it costs',
		Number(basis) + 2 * Number(gap) + 2 * Number(marg) === Number(gap),
		'basis ' + basis + ', margin ' + marg + ', gap ' + gap);
}

console.log(fails === 0 ? '\nsetbox-divider: ALL PASS' : '\nsetbox-divider: ' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);

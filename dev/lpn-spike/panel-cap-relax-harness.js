// A HEIGHT CAP FOLLOWS THE BOX IT CAPS. Run with:
//   node dev/lpn-spike/panel-cap-relax-harness.js
//
// Tom, 2026-09-06, on a freshly erased page (ROADMAP Task 606):
//
//   *"I 'Erase page' (new shopper). I open Settings. I drag and resize. The height is limited. :-(
//   I reload the page. Settings jumps downward against the bottom of the screen. I drag and resize.
//   Height is still limited. I repeat. Height is unlimited... I assume that this applies to all
//   non-hog boxes."*
//
// THE DEFECT WAS A STALE NUMBER, not a race. capPanelToRoomBelow() writes an inline max-height at
// OPEN time, measured from the chrome floor; dragging the box upward makes room the cap knows
// nothing about, and the browser's own resize widget then stops against a ceiling that describes a
// place the box has left. It resolved on a reload because only a height BELOW the cap is ever
// stored -- so once he happened to shrink the box, the next open measured a natural height that fit
// and capped nothing at all.
//
// FOUR RULES, and the last two are what stop the fix from becoming a second defect:
//   1. A cap is re-measured from the box's own top, not from the chrome floor.  -- section 1
//   2. It only ever LOOSENS: a drag may not cap an uncapped box, nor tighten one -- section 1
//      (dragBounds() lets a box hang off the bottom on purpose; squaring that up on release would
//      move a box the user had just placed).
//   3. The rendered height is frozen before the ceiling lifts, so nothing springs
//      to its natural size in the user's hand.                                  -- section 2
//   4. Resizable panels only -- a menu or the property popup is as tall as its
//      contents, and freezing one would pin it to whatever it last held.        -- sections 1, 3
//
// **THE STUB IS TAUGHT ONE PHYSICAL RELATIONSHIP**, the same one panel-fill-harness.js teaches and
// for the reason dev/testing-notes.md gives: the shared DOM stub hands every element one constant
// rect, so a panel whose rect ignored its own style would pass this file while failing in a window.
// The panel here reports the height its own max-height allows, which IS the browser behaviour the
// whole defect is about.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// Comments blanked, line numbers kept -- several of them quote the calls being counted.
const code = js.split('\n').map(function (ln) {
	const at = ln.indexOf('//');
	return (at >= 0 && !/['"`]/.test(ln.slice(0, at))) ? ln.slice(0, at) : ln;
}).join('\n');
function body(name) {
	const at = code.search(new RegExp('function ' + name + '\\s*\\('));
	if (at < 0) { return ''; }
	let i = code.indexOf('{', at), depth = 0, end = i;
	for (; end < code.length; end++) {
		if (code[end] === '{') { depth++; }
		else if (code[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return code.slice(at, end);
}

// A panel that behaves like one: its rect follows its own inline top/height, and its height is
// whatever its natural height and its max-height allow -- which is the one coupling that makes a
// stale ceiling visible at all.
function makePanel(opts) {
	const p = {
		natural: opts.natural,
		style: { top: opts.top + 'px', height: opts.height === undefined ? '' : opts.height + 'px',
			maxHeight: opts.maxHeight === undefined ? '' : opts.maxHeight + 'px', overflowY: '' },
		__resize: opts.resize === undefined ? 'both' : opts.resize,
		__body: opts.withBody ? { style: { maxHeight: '' }, __chrome: opts.chrome || 0 } : null
	};
	p.getBoundingClientRect = function () {
		const wish = parseFloat(p.style.height);
		let h = isFinite(wish) ? wish : p.natural;
		const cap = parseFloat(p.style.maxHeight);
		if (isFinite(cap) && h > cap) { h = cap; }
		return { top: parseFloat(p.style.top), height: h };
	};
	if (p.__body) {
		p.__body.getBoundingClientRect = function () {
			return { height: Math.max(0, p.getBoundingClientRect().height - p.__body.__chrome) };
		};
	}
	return p;
}
function load(innerHeight, edge) {
	const src = 'var POPUP_EDGE = ' + edge + ';\n' +
		'var window = { innerHeight: ' + innerHeight + ',\n' +
		'  getComputedStyle: function (p) { return { resize: p.__resize }; } };\n' +
		'function panelBody(p) { return p.__body; }\n' +
		body('resetPanelHeight') + '\n' + body('capPanelHeight') + '\n' + body('relaxPanelCap') + '\n' +
		'return relaxPanelCap;';
	return new Function(src)();
}
const EDGE = +(js.match(/var POPUP_EDGE = (\d+);/) || [])[1] || 4;

// ============================================================================================
// 1. THE CAP FOLLOWS THE BOX (rules 1 and 2)
// ============================================================================================
console.log('\n--- a cap is the room where the box IS (rules 1 and 2) ---');
{
	ok('POPUP_EDGE is read out of the file, never retyped', EDGE > 0, String(EDGE));
	const relax = load(900, EDGE);

	// Tom's own sequence, in numbers. A 900px window under a 200px chrome: the box opens at the
	// floor, capped to the room under it and shorter than it wants to be. He then drags it to the
	// top of the window, where dragBounds() lets it go and where there is 200px more room.
	const opened = 900 - 200 - EDGE;
	const p = makePanel({ top: 200, natural: 736, height: undefined, maxHeight: opened, withBody: true, chrome: 50 });
	ok('the box opens capped, shorter than it wants to be', p.getBoundingClientRect().height === opened,
		opened + ' of a natural 736');
	p.style.top = '0px';                       // the drag, which dragBounds() explicitly allows
	relax(p);
	ok('...and dragging it to the top of the window hands the room back',
		p.style.maxHeight === (900 - EDGE) + 'px', p.style.maxHeight);
	ok('...so the box can now be grown to the full window, which it could not before',
		parseFloat(p.style.maxHeight) - opened === 200);
	ok('...and the body ceiling moved with it, or the blank strip comes back',
		parseFloat(p.__body.style.maxHeight) === 900 - EDGE - 50, p.__body.style.maxHeight);

	// **THE CAP IS REPLACED, NEVER DROPPED.** A box with no ceiling at all can be grown past the
	// bottom edge, and the grabber it grew by is then the corner that has just left the window.
	const q = makePanel({ top: 400, natural: 736, maxHeight: 900 - 400 - EDGE, withBody: true, chrome: 50 });
	q.style.top = '200px';
	relax(q);
	ok('a partial gain re-caps to the new room rather than uncapping',
		q.style.maxHeight === (900 - 200 - EDGE) + 'px', q.style.maxHeight);
	ok('...so the box still ends inside the window',
		200 + parseFloat(q.style.maxHeight) <= 900 - EDGE + 1);

	// RULE 2, both halves. These are the two ways a "tidy up on release" would move a box the user
	// had just placed.
	const never = makePanel({ top: 700, natural: 736, withBody: true, chrome: 50 });
	relax(never);
	ok('a box that was never capped is not capped by a drag', never.style.maxHeight === '');
	const down = makePanel({ top: 100, natural: 736, maxHeight: 600, withBody: true, chrome: 50 });
	down.style.top = '500px';                  // dragged DOWN: less room than the cap admits
	relax(down);
	ok('...and a drag downward never tightens the cap it found', down.style.maxHeight === '600px');

	// RULE 4. A panel the user cannot size does not own its height, so nothing here freezes one.
	const menu = makePanel({ top: 90, natural: 736, maxHeight: 400, withBody: true, chrome: 50, resize: 'none' });
	menu.style.top = '0px';
	relax(menu);
	ok('a panel that is not resizable is left exactly as it was',
		menu.style.maxHeight === '400px' && menu.style.height === '');
}

// ============================================================================================
// 2. NOTHING SPRINGS IN THE USER'S HAND (rule 3)
// ============================================================================================
console.log('\n--- the size on screen survives the release (rule 3) ---');
{
	const relax = load(900, EDGE);
	// A box the user had already sized SMALLER than its cap. Lifting the ceiling must not restore
	// the natural height he had deliberately left behind.
	const p = makePanel({ top: 400, natural: 736, height: 300, maxHeight: 900 - 400 - EDGE, withBody: true, chrome: 50 });
	const was = p.getBoundingClientRect().height;
	p.style.top = '0px';
	relax(p);
	ok('a box sized by hand comes out of the drag the size it went in', p.getBoundingClientRect().height === was,
		was + ' -> ' + p.getBoundingClientRect().height);
	ok('...and its own inline height is what holds it there, untouched', p.style.height === '300px');
	ok('...with room above it to grow into, which is the whole point',
		parseFloat(p.style.maxHeight) === 900 - EDGE, p.style.maxHeight);

	// The other half of rule 3: a box the cap was BINDING keeps the size the cap gave it, because
	// that is the size on screen. Freezing is the difference between handing back room and
	// resizing the box on the user's behalf.
	const r2 = load(900, EDGE);
	const b = makePanel({ top: 200, natural: 736, maxHeight: 900 - 200 - EDGE, withBody: true, chrome: 50 });
	const bwas = b.getBoundingClientRect().height;
	b.style.top = '0px';
	r2(b);
	ok('a box the cap was holding down stays the height it was holding it at',
		b.getBoundingClientRect().height === bwas, bwas + ' -> ' + b.getBoundingClientRect().height);
	ok('...pinned by an inline height rather than by the ceiling that has just moved',
		b.style.height === bwas + 'px', b.style.height);
}

// ============================================================================================
// 3. THE WIRING -- one seam, every draggable box (Tom: "all non-hog boxes")
// ============================================================================================
console.log('\n--- one seam, so no box is half-wired ---');
{
	ok('relaxPanelCap() exists', !!body('relaxPanelCap'));
	// It hangs off makePanelDraggable()'s own endDrag, which is what makes it true of every panel
	// that function has ever made draggable -- Settings, the Library, Find and the fire-flow boxes
	// alike -- rather than of a list somebody has to remember to extend.
	ok('...and it is called from makePanelDraggable(), not from one box\'s opener',
		/relaxPanelCap\(popup\)/.test(body('makePanelDraggable')));
	const calls = (code.match(/relaxPanelCap\(/g) || []).length - 1;   // less the declaration
	ok('...exactly once, so there is one seam and not two', calls === 1, calls + ' call site(s)');
	ok('...on the END of the drag, not on every pointermove that would relayout the box',
		/function endDrag\([\s\S]{0,400}?relaxPanelCap\(popup\)/.test(body('makePanelDraggable')));
	// It reuses the two functions that already know how this page caps a panel. A third opinion
	// about where the scrollbar goes is what .lpn-popover-body exists to prevent.
	ok('...and it caps through capPanelHeight(), never by writing max-height itself',
		/capPanelHeight\(/.test(body('relaxPanelCap')) &&
		!/panel\.style\.maxHeight =/.test(body('relaxPanelCap')));
	ok('...and releases through resetPanelHeight(), which clears the body with the panel',
		/resetPanelHeight\(panel, body\)/.test(body('relaxPanelCap')));
	// The opening rule is unchanged and Tom's "jumps downward" on reload is that rule working:
	// clampPanel() floors a REOPENED box at the chrome, deliberately (Task 562's record).
	ok('the opening clamp still floors a reopened box at the chrome',
		/clampPanel\([^)]*floor\)/.test(body('openSettingsBox')));
}

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'all checks passed'));
process.exit(fails ? 1 : 0);

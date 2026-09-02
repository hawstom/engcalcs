// A STANDING BOX ON A PHONE, AND A DELIBERATE MOVE ANYWHERE. Run with:
//   node dev/lpn-spike/panel-fill-harness.js
//
// Tom, 2026-09-01, using the map page on a phone and on a PC:
//
//   *"They act like they are trying to move. But it's feeble. They must have a bunch of constraints
//   that are preventing them from doing what I ask. In general, I would say that when a box opens,
//   it needs to fit entirely on the screen. And for some of these larger boxes that are resizeable,
//   I would have them maybe fill the entire browser. Then after that, what the user does is their
//   business. If they want to drag or size the box so only a tiny sliver remains or is visible on
//   the screen, so be it. This is the phone."*
//
//   *"Find is not resizeable on phone. Fire flow and Settings are resizeable, but their width is
//   constrained so much that resize feels claustrophobic and pointless."*
//
//   *"On PC this works well despite the hard limits, and my only complaint is that I can't drag a
//   box above the map onto the top area of the page."*
//
// FIVE RULES CAME OUT OF THAT, and four of them are arithmetic or wiring, which is what this file
// holds. The fifth -- that a phone box does not remember where it was dragged -- is a pair of
// ABSENCES, and absences are what a harness is for: nothing here can see that a box came back in
// its initial state by looking at it once.
//
//   1. A box opens fully on screen.                        -- sections 1 and 2
//   2. On a phone a standing box opens filling the window.  -- sections 2 and 3
//   3. Once open, a drag may take it almost off screen.     -- section 1
//   4. On a phone it opens in that state EVERY time.        -- section 4
//   5. On a PC it may be dragged up over the page header.   -- section 1
//
// **THE STUB IS TAUGHT ONE PHYSICAL RELATIONSHIP AND IT IS THE ONE THAT MATTERS**
// (dev/testing-notes.md: a stub that holds constant what the real thing varies makes a harness pass
// for the wrong reason). lpn-dom-stub.js hands every element the same 1000x500 rect whatever its
// style says, so a fill that wrote no width at all would measure exactly like one that wrote the
// right width. The panel in section 3 is therefore hand-made and its getBoundingClientRect()
// FOLLOWS its own inline left/top/width/height -- which is the single coupling a viewport has that
// a headless process does not.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// Comments blanked, line numbers kept -- the same reader panel-touch-harness.js uses, and for the
// same reason: this file is nearly half comment and several of them quote the calls being counted.
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

// ============================================================================================
// 1. THE DRAG BOUNDS -- pure arithmetic, evaluated in isolation like clampPanel() beside it.
// ============================================================================================
console.log('\n--- a deliberate move is the user\'s (rules 3 and 5) ---');
{
	const SLIVER = +(js.match(/var LPN_DRAG_SLIVER = (\d+);/) || [])[1];
	ok('the sliver is read out of the file, never retyped', SLIVER > 0, String(SLIVER));
	// Wrapped rather than eval'd loose: this file is strict, so a function declared inside eval()
	// does not escape it. The constant is spliced in beside it for the same reason it is read out
	// of the file at all -- a retune must move the assertions with it.
	const dragBounds = eval('(function () { var LPN_DRAG_SLIVER = ' + SLIVER + ';\n' +
		body('dragBounds') + '\nreturn dragBounds; })()');

	// RULE 5, and it is the whole of Tom's PC complaint. The page chrome bottom is around 90px on
	// this page; a drag must be able to put the box above it, at the very top of the window.
	const up = dragBounds(300, -200, 400, 300, 1200, 900);
	ok('a box may be dragged up onto the page header, above the chrome', up.top === 0, JSON.stringify(up));

	// RULE 3 in both directions. A box hauled off the right edge keeps one sliver on screen -- and
	// the top 40px of every one of these boxes is its drag band across the full width, so that
	// sliver is always something that can be picked up again.
	const right = dragBounds(5000, 100, 400, 300, 1200, 900);
	ok('...and pushed off the right until only a sliver is left', right.left === 1200 - SLIVER, JSON.stringify(right));
	const left = dragBounds(-5000, 100, 400, 300, 1200, 900);
	ok('...and off the left the same way', left.left === SLIVER - 400, JSON.stringify(left));
	const down = dragBounds(100, 5000, 400, 300, 1200, 900);
	ok('...and off the bottom', down.top === 900 - SLIVER, JSON.stringify(down));

	// THE ONE THING IT STILL REFUSES, and it is not tidiness: a band dragged off the TOP is gone,
	// with nothing left to grab and no double-click target to send the box home.
	ok('but never above the top of the window, where the drag band could not be grabbed',
		dragBounds(100, -9999, 400, 300, 1200, 900).top === 0);

	// A move that is already inside the window is not touched at all, which is what "their
	// business" means for the ordinary case.
	const in_ = dragBounds(310, 240, 400, 300, 1200, 900);
	ok('a box moved well inside the window is left exactly where it was put',
		in_.left === 310 && in_.top === 240, JSON.stringify(in_));

	// **AND THE OPENING CLAMP IS STILL THE STRICT ONE** (rule 1). Two functions, deliberately
	// different, and the drag is the only caller of the loose one.
	const callers = (code.match(/dragBounds\(/g) || []).length - 1;   // less the declaration
	ok('dragBounds() has exactly one caller, and it is the drag', callers === 1, callers + ' call site(s)');
	ok('...and makePanelDraggable() is it', /dragBounds\(/.test(body('makePanelDraggable')));
	ok('the OPENING clamp is untouched and still floors at the chrome',
		/function clampPanel\(left, top, w, h, vw, vh, topMin\)/.test(code) &&
		/clampPanel\([^)]*chromeFloor\(\)\)/.test(code));
}

// ============================================================================================
// 2. THE WIRING -- which boxes fill, and the declared reason for the two that do not.
// ============================================================================================
console.log('\n--- one seam decides how a standing box opens (rule 2) ---');
{
	ok('placePanelForScreen() exists', !!body('placePanelForScreen'));
	ok('...and it is the only caller of fillPanelToScreen()',
		(code.match(/fillPanelToScreen\(/g) || []).length === 2, 'declaration + 1 call');
	ok('...and it decides at the ONE small-screen breakpoint, never a second one',
		/smallScreen\(\)/.test(body('placePanelForScreen')));
	ok('...and it clears the fill on the way back to a pointer machine',
		/resetPanelFill\(box\)/.test(body('placePanelForScreen')));

	// **THE FOUR THAT FILL.** Named by their opener rather than by an id: what has to be true is
	// that the function which PLACES the box goes through the seam.
	[['openSettingsBox', 'Settings'], ['openLibraryBox', 'the Library box'],
		['openFireFlowBox', 'Fire flow'], ['toggleFindPopup', 'Find']].forEach(function (p) {
		ok(p[1] + ' opens through the seam', /placePanelForScreen\(/.test(body(p[0])));
	});

	// **AND THE TWO THAT DELIBERATELY DO NOT**, declared with the reason, so exempting a third is
	// a sentence somebody has to write rather than a call somebody forgot.
	const EXEMPT = [
		['wirePopup', 'the property popup -- it opens BESIDE the element it describes, and filling ' +
			'the window would hide the junction the reader is comparing it against. It is not ' +
			'resizeable either, so it is not one of the boxes Tom was talking about.'],
		['wireFireFlowBox', 'the fire flow RUN dialog -- a bar, two lines and a Stop button, over a ' +
			'drawing it is reporting on. Its own stylesheet comment already says it is narrow on ' +
			'purpose. (This wiring function also wires the fire flow BOX, which does fill.)']
	];
	// Every panel made draggable is either opened through the seam or declared above. The count is
	// the guard: a seventh draggable panel makes this fail until somebody decides which it is.
	const wired = (code.match(/makePanelDraggable\(/g) || []).length - 1;
	ok('every draggable panel is either filled or declared exempt', wired === 4 + EXEMPT.length,
		wired + ' draggable panels, 4 filled + ' + EXEMPT.length + ' exempt');
	EXEMPT.forEach(function (e) {
		ok('exempt: ' + e[0], !!body(e[0]), e[1].slice(0, 60) + '...');
	});
}

// ============================================================================================
// 3. THE FILL ITSELF -- run, against a panel whose rect follows its own style.
// ============================================================================================
console.log('\n--- and it really fills the window, inline caps and all ---');
{
	require('./lpn-dom-stub.js');
	const L = require('./lpn-dom-stub.js').loadLoopedNetwork(
		"\t\tfillPanelToScreen: fillPanelToScreen,\n" +
		"\t\tresetPanelFill: resetPanelFill,\n" +
		"\t\tplacePanelForScreen: placePanelForScreen,\n" +
		"\t\tsmallScreen: smallScreen,\n"
	);

	// THE COUPLING THE STUB IS MISSING. A real box measures what its style says; this one does too,
	// and the body's height follows the box's minus its furniture, which is what capPanelHeight()
	// subtracts. Without that, a fill that wrote nothing would measure identically to a correct one.
	const CHROME = 48;   // the 40px drag band plus 8px of padding, as the markup has it
	function panel(naturalBody) {
		const bodyEl = {
			style: {},
			getBoundingClientRect: function () {
				const cap = parseFloat(bodyEl.style.maxHeight);
				return { height: isFinite(cap) ? Math.min(cap, naturalBody) : naturalBody };
			}
		};
		const p = {
			style: { maxWidth: '22rem' },   // #lpn_find_popup's inline cap, the one that must lose
			querySelector: function (sel) { return sel === '.lpn-popover-body' ? bodyEl : null; },
			body: bodyEl,
			getBoundingClientRect: function () {
				const w = parseFloat(p.style.width), h = parseFloat(p.style.height);
				const left = parseFloat(p.style.left) || 0, top = parseFloat(p.style.top) || 0;
				const hh = isFinite(h) ? h : bodyEl.getBoundingClientRect().height + CHROME;
				const ww = isFinite(w) ? w : 352;
				return { left: left, top: top, width: ww, height: hh, right: left + ww, bottom: top + hh };
			}
		};
		return p;
	}

	global.window.innerWidth = 360;
	global.window.innerHeight = 640;
	ok('the stub agrees this is a small screen', L.smallScreen() === true);

	// A box whose content is far taller than the phone -- the Settings case.
	const tall = panel(2000);
	const h = L.fillPanelToScreen(tall);
	const EDGE = 4;   // POPUP_EDGE; chromeFloor() is 4 here because the stub's chrome has no offsetParent
	ok('the box is placed at the left margin', tall.style.left === EDGE + 'px', tall.style.left);
	ok('...and its width is the whole window less the margins',
		tall.style.width === (360 - 2 * EDGE) + 'px', tall.style.width);
	ok('...and the INLINE 22rem cap is overridden, not merely competed with',
		tall.style.maxWidth === (360 - 2 * EDGE) + 'px', tall.style.maxWidth);
	ok('...and the stylesheet minimum cannot hold it wider than the window',
		tall.style.minWidth === '0' && tall.style.minHeight === '0');
	ok('...and its height is everything under the chrome', h === 640 - EDGE - EDGE, String(h));
	ok('...and the overflow went INSIDE the scrolling body, where a finger can reach it',
		parseFloat(tall.body.style.maxHeight) === h - CHROME, tall.body.style.maxHeight);
	ok('...so the box really is the size of the window', tall.getBoundingClientRect().height === h);

	// A box whose content is SHORTER than the phone still fills: "occupy the entire page and be
	// done with it" is a rule about the window, not about the content.
	const short = panel(120);
	const h2 = L.fillPanelToScreen(short);
	ok('a box with little in it fills the window too', short.style.height === h2 + 'px', short.style.height);

	// AND IT COMES BACK. A window resized across the breakpoint -- or a project opened on a phone
	// and continued on a laptop -- must not leave a box wearing phone pixels.
	global.window.innerWidth = 1200;
	global.window.innerHeight = 900;
	ok('the stub agrees this is no longer a small screen', L.smallScreen() === false);
	let placed = 0;
	L.placePanelForScreen(tall, function () { placed++; });
	ok('on a pointer machine the box\'s own placement runs', placed === 1);
	ok('...and every pixel the fill wrote is gone',
		!tall.style.width && !tall.style.height &&
		!tall.style.minWidth && !tall.style.minHeight,
		JSON.stringify(tall.style));
	// **AND THE MARKUP'S OWN CAP IS PUT BACK RATHER THAN DELETED.** #lpn_find_popup writes
	// `max-width: 22rem` inline and nowhere else, so blanking it would not fall back to a
	// stylesheet rule -- it would leave Find as wide as its longest result for the session.
	ok('...but the box\'s own inline width cap is restored, not deleted',
		tall.style.maxWidth === '22rem', tall.style.maxWidth);

	// ...and on a phone the caller's placement does NOT run, which is rule 4 seen from the inside:
	// that placement is where setboxLayout and findUserPos are read.
	global.window.innerWidth = 360;
	global.window.innerHeight = 640;
	placed = 0;
	L.placePanelForScreen(panel(2000), function () { placed++; });
	ok('on a phone the remembered placement is not consulted at all', placed === 0);
	global.window.innerWidth = 1200;
	global.window.innerHeight = 900;
}

// ============================================================================================
// 4. RULE 4 IS A PAIR OF ABSENCES -- nothing on a phone writes the remembered layout.
// ============================================================================================
console.log('\n--- a phone box opens in its initial state every time (rule 4) ---');
{
	// Tom named the disadvantage himself and took it: *"I can't see any option other than to open it
	// in its initial state, and this has its disadvantages obviously, since we are not respecting
	// the user's moves."* What must not happen is the WORSE outcome -- a size or a corner measured
	// on a phone, stored, and then inflicted on the desktop, which is a box that moved itself while
	// the user was on a train.
	const wire = body('wireSettingsBox');
	const move = wire.slice(wire.indexOf('makePanelDraggable('), wire.indexOf('addPanelResizeGrip'));
	ok('a drag on a phone does not store the corner', /smallScreen\(\)/.test(move) && /return;/.test(move));
	const obs = wire.slice(wire.indexOf('ResizeObserver'));
	ok('a resize on a phone does not store the size', /smallScreen\(\)\) \{ return; \}/.test(obs));
	// The desktop's own protections are still there: a capped height is the viewport's and is not
	// stored, and a box grown off the window is slid back.
	ok('...while a capped height is still not mistaken for a chosen one', /capped/.test(obs));
	ok('...and a box grown off the window is still slid back', /clampPanel\(/.test(obs));
}

// ============================================================================================
// 5. THE STYLESHEET HALF -- the scrolling body keeps its touch gestures.
// ============================================================================================
console.log('\n--- a box that fills the screen has to be scrollable by finger ---');
{
	// `.lpn-dragpanel { touch-action: none }` is what makes a touch DRAG possible at all, and it is
	// written on the box, so it lands on everything inside it. The two Settings panes were given
	// their gestures back by name on 2026-09-01 and the other scrolling regions were not -- and a
	// box that now fills the phone is a box whose whole content is inside one of them.
	ok('the scrolling body of a draggable panel takes its touch gestures back',
		/\.lpn-dragpanel \.lpn-popover-body \{[^}]*touch-action:\s*auto/.test(css));
	ok('...and so do the two Settings panes, which are nested scrollers inside it',
		/\.lpn-setbox-index, \.lpn-setbox-content \{[^}]*touch-action:\s*auto/.test(css));
	ok('...and the fire flow report and its sideways table, which are the others',
		/\.lpn-ff-report, \.lpn-ff-tablewrap \{[^}]*touch-action:\s*auto/.test(css));
	// The drag itself must still be possible, or this whole file is about a gesture that cannot
	// start.
	ok('and the box itself still claims the gesture, or no finger could drag it',
		/\.lpn-dragpanel \{[^}]*touch-action:\s*none/.test(css));

	// **AN UNSET HYDRAULICS NUMBER SHOWS NOTHING AT ALL** (Tom, 2026-09-01).
	//
	// The first version of this section asserted the opposite -- that the placeholder carried the
	// default and was styled as live text -- which was the answer to his FIRST report (*"On PC it's
	// obviously disabled"*, of Maximum trials; it never was, nothing sets `disabled` on one of
	// these). He then rejected the premise underneath that fix: *"Why are there numerical
	// placeholders in empty fields? That gives bad UX. Are there values or not? And what do the
	// numbers mean if they are not really there?"* -- and ruled: *"There's no value, and the tip
	// states the default."*
	//
	// So the three assertions below are the ruling, and the fourth is the constraint neither
	// version may break: **blank must keep meaning "the file did not say"**, because an empty box
	// exports no line and a typed default exports one stating it. Those are two different files and
	// only the user may choose between them.
	ok('nothing disables a hydraulics number row', !/input\.disabled/.test(body('hydNumberRow')));
	ok('...and blank still means "the file did not say"',
		/input\.value = settings\.hydraulics\[key\] === undefined \? '' :/.test(body('hydNumberRow')));
	ok('an unset hydraulics row shows NO number: no placeholder is set',
		!/input\.placeholder\s*=/.test(body('hydNumberRow')));
	ok('...and no stylesheet rule is left dressing one up',
		!/input::placeholder\s*\{/.test(css));
	ok('...because the DEFAULT moved into the tip, as one whole sentence with a number in it',
		/lpn_settings_default_is/.test(body('hydNumberRow'))
		&& /\$ec_lang\['lpn_settings_default_is'\]='[^']*\{n\}[^']*';/
			.test(fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8')));
}

console.log('');
console.log(fails ? fails + ' FAILED' : 'panel-fill: ALL PASS');
process.exit(fails ? 1 : 0);

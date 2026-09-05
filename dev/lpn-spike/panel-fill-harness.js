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

	// **THE FIVE THAT FILL.** Named by their opener rather than by an id: what has to be true is
	// that the function which PLACES the box goes through the seam.
	const FILLS = [['openSettingsBox', 'Settings'], ['openLibraryBox', 'the Library box'],
		['openFireFlowBox', 'Fire flow'], ['toggleFindPopup', 'Find'],
		// Pump energy (Task 566): a report table wide enough to need the whole window on a phone,
		// which is the case the seam exists for.
		['openEnergyBox', 'Pump energy'],
		// The scenario comparison: a table one row per scenario, and the same case as Pump energy
		// -- wide enough that a phone wants the whole window for it.
		['openScenarioCompareBox', 'the scenario comparison']];
	FILLS.forEach(function (p) {
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
	// **COUNTED IN COMMENT-BLANKED SOURCE, which this needed and did not have.** A prose line
	// mentioning `makePanelDraggable()` -- and there are several, because the function is the seam
	// three other rules point at -- counted as a seventh wired panel and failed this check on
	// 2026-09-02. Blanking comments before counting call sites is what every other scanner in this
	// repo does (see dev/scripts/js_scan.inc.php's own note) and is the fix rather than rewording
	// the comment, which would leave the trap set for the next person.
	const codeOnly = code
		.replace(/\/\*[\s\S]*?\*\//g, ' ')
		.split('\n').map(function (l) {
			const at = l.indexOf('//');
			return at < 0 ? l : l.slice(0, at);
		}).join('\n');
	const wired = (codeOnly.match(/makePanelDraggable\(/g) || []).length - 1;
	ok('every draggable panel is either filled or declared exempt', wired === FILLS.length + EXEMPT.length,
		wired + ' draggable panels, ' + FILLS.length + ' filled + ' + EXEMPT.length + ' exempt');
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
		"\t\tsmallScreen: smallScreen,\n" +
		"\t\tmakePanelDraggable: makePanelDraggable, raisePanel: raisePanel,\n"
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
			// An inline size cap on the box, which is what must lose to the fill. Synthetic since
			// 2026-09-04: Find's own 22rem moved out of the markup and into `.lpn-findbox` as a
			// definite width when it was made resizeable, because a cap cannot be dragged past. The
			// RULE under test did not move -- an inline value must be overridden and then handed
			// back -- so the fixture keeps stating one.
			style: { maxWidth: '22rem' },
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
	// **AND THE MARKUP'S OWN CAP IS PUT BACK RATHER THAN DELETED.** Blanking an inline value does
	// not fall back to whatever the markup said -- it deletes it. The box in this fixture states one,
	// so the restore has something to be wrong about.
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
	// ============================================================================================
	// PANEL STACKING (Tom, 2026-09-02) -- three reports, one missing mechanism
	// ============================================================================================
	// *"The boxes that can drag up to the top of the page need to cover the menu icons and the
	// project tabs. They need to cover everything."* / *"When the Find box is open, the other
	// moveables need to still move. Fire flow doesn't, and Settings opened behind it, lost."* /
	// *"The box I am moving now needs to be at the draworder front."*
	//
	// **THIS ASSERTS A REVERSAL, which is why it is worth spelling out.** Tom's 2026-08-24 ruling
	// put the chrome ABOVE the boxes and the stylesheet still carries a z-index of 30 for that
	// reason; his 2026-09-02 ruling puts every movable box above it. Both are his. A future reader
	// finding the older sentence in the CSS must not "restore" it.
	const CHROME_Z = 30;
	const chromeRule = /#lpn_menubar,\s*#lpn_toolbar,\s*#lpn_tabs\s*\{[^}]*z-index:\s*(\d+)/.exec(css);
	ok('the chrome still declares a z-index of its own', chromeRule && Number(chromeRule[1]) === CHROME_Z,
		chromeRule && chromeRule[1]);
	const panelRule = /\.lpn-dragpanel\s*\{[^}]*z-index:\s*(\d+)/.exec(css);
	ok('every movable box starts far above it', panelRule && Number(panelRule[1]) >= 1000,
		panelRule && panelRule[1]);
	ok('...and above Bootstrap\'s fixed navbar (1030) and the toolbar (1080)',
		panelRule && Number(panelRule[1]) > 1080, panelRule && panelRule[1]);
	// The run box is draggable like the rest, and at EQUAL specificity the later rule wins -- so its
	// own class z-index was quietly beating .lpn-dragpanel's until 2026-09-02. A run in progress must
	// not be buried by a box opened over it.
	const runRule = /\.lpn-runbox\s*\{[^}]*z-index:\s*(\d+)/.exec(css);
	ok('the run box is in the same stack, not under it',
		runRule && panelRule && Number(runRule[1]) >= Number(panelRule[1]),
		runRule && runRule[1]);
	// The registration bar is deliberately over everything while a click sequence is running.
	ok('and the registration bar still outranks them all',
		/z-index:\s*3000/.test(css) && panelRule && Number(panelRule[1]) < 3000);

	// **NO PANEL MAY CARRY AN INLINE z-index IN THE MARKUP** -- the defect that made the first
	// version of this whole fix a no-op. An inline style beats any stylesheet rule, so six boxes sat
	// at the 20/22/23 the markup gave them while `.lpn-dragpanel { z-index: 1200 }` sat there
	// looking correct, and only raisePanel()'s own inline write ever moved them. The fire-flow run
	// box was the one that showed it: it does not open through placePanelForScreen(), so nothing
	// raised it and it opened at 23, underneath the chrome. Tom: *"No visible Run box."*
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const inlineZ = ['lpn_popup', 'lpn_find_popup', 'lpn_settings_box', 'lpn_library_box',
		'lpn_ff_box', 'lpn_ff_run_box'].filter(function (id) {
		const m = new RegExp('id="' + id + '"[^>]*z-index:\\s*(\\d+)').exec(php);
		return !!m;
	});
	ok('no movable box carries an inline z-index in the markup', inlineZ.length === 0,
		JSON.stringify(inlineZ));

	// **THE LADDER ABOVE THE BOXES.** Menus, the modal dialog and the tooltips all have to clear the
	// panel band or they are hidden by the thing that summoned them.
	const band = /LPN_PANEL_Z_CEILING = (\d+)/.exec(js);
	ok('the panel band declares a ceiling', band, band && band[1]);
	const above = { lpn_menu_popup: 'a menu over a box dragged across its strip',
		lpn_dialog: 'a modal dialog' };
	Object.keys(above).forEach(function (id) {
		const m = new RegExp('id="' + id + '"[^>]*z-index:\\s*(\\d+)').exec(php);
		ok(above[id] + ' clears the panel band',
			m && band && Number(m[1]) > Number(band[1]), m && m[1]);
	});
	const tipRule = /\.tooltip\s*\{[^}]*z-index:\s*(\d+)/.exec(css);
	ok('and a tip clears everything the user summoned, including a box and a dialog',
		tipRule && band && Number(tipRule[1]) > Number(band[1]) &&
		Number(tipRule[1]) > 1870, tipRule && tipRule[1]);

	// The band renormalises rather than climbing for ever, which is what makes the line above safe.
	ok('the stack renormalises at the ceiling instead of climbing past it',
		/renormalisePanelStack\(\);/.test(js) && /lpnPanels\.indexOf\(popup\) < 0/.test(js));

	// **RAISE ON TOUCH IS REGISTERED IN THE CAPTURE PHASE, and that is load-bearing.** The drag
	// handler returns early unless the press is on the panel's own chrome, so a press on a control
	// inside the box never reaches it -- and typing in Find must still bring Find forward.
	ok('a press anywhere in a panel raises it, captured before the drag handler',
		/popup\.addEventListener\('pointerdown', function \(\) \{ raisePanel\(popup\); \}, true\)/
			.test(body('makePanelDraggable')));
	ok('opening a box raises it too, at the one seam every standing box is placed through',
		/__lpnRaise\(\)/.test(body('placePanelForScreen')));
	// The counter only counts up. Comparing and swapping would need a registry of every panel.
	ok('the stack counter never goes down', /lpnPanelZ \+= 1;/.test(js) && !/lpnPanelZ -/.test(js));

	// **AND IT ACTUALLY REORDERS, run rather than read.** Everything above this is source-level and
	// would pass on a raisePanel() that assigned nothing. Two real panels, raised in turn: the one
	// raised last must be numerically in front, which is the whole of Tom's third report.
	const S = require('./lpn-dom-stub.js').loadLoopedNetwork(
		"\t\traisePanel: raisePanel, makePanelDraggable: makePanelDraggable,\n"
	);
	const a = { style: {}, classList: { add: function () {} }, addEventListener: function () {},
		getBoundingClientRect: function () { return { left: 0, top: 0, width: 10, height: 10 }; } };
	const b = { style: {}, classList: { add: function () {} }, addEventListener: function () {},
		getBoundingClientRect: function () { return { left: 0, top: 0, width: 10, height: 10 }; } };
	S.raisePanel(a);
	S.raisePanel(b);
	ok('the box raised last is in front', Number(b.style.zIndex) > Number(a.style.zIndex),
		a.style.zIndex + ' then ' + b.style.zIndex);
	ok('...and both are above the chrome, so neither can hide under the menu bar',
		Number(a.style.zIndex) > CHROME_Z && Number(b.style.zIndex) > CHROME_Z,
		a.style.zIndex + ', ' + b.style.zIndex);
	// Tom's second report: with Find open, Fire flow would not move and a new Settings opened behind
	// it. Raising the older box again must put it back on top -- otherwise "click it to use it"
	// does not work and the user is stuck reaching for the menu, which is exactly what he did.
	S.raisePanel(a);
	ok('raising an older box again brings it back to the front',
		Number(a.style.zIndex) > Number(b.style.zIndex),
		a.style.zIndex + ' vs ' + b.style.zIndex);
	// And a second raise of the box already in front must not burn a number on every pointer press.
	const held = a.style.zIndex;
	S.raisePanel(a);
	ok('...but re-raising the front box is a no-op', a.style.zIndex === held, held);

	// **THE RENORMALISATION KEEPS THE ORDER, which is the only thing that makes it safe.** Run, not
	// read: 700 raises drive the counter past the 1799 ceiling, and afterwards the boxes must still
	// be stacked the way the user left them and must all be back inside the band -- or a tooltip at
	// 1900 would be under a box again, which is the defect this bound exists to prevent.
	const wired = [];
	function wiredPanel() {
		const el = { style: {}, classList: { add: function () {} },
			addEventListener: function () {},
			getBoundingClientRect: function () { return { left: 0, top: 0, width: 10, height: 10 }; } };
		S.makePanelDraggable(el, null);   // this is what puts it in the registry
		wired.push(el);
		return el;
	}
	const p1 = wiredPanel(), p2 = wiredPanel(), p3 = wiredPanel();
	S.raisePanel(p1); S.raisePanel(p2); S.raisePanel(p3);
	for (let i = 0; i < 700; i++) { S.raisePanel(i % 2 ? p2 : p3); }
	// Raise them back into a KNOWN order after the churn, so the assertion below is about the order
	// surviving renormalisation rather than about which index the loop happened to stop on.
	S.raisePanel(p1); S.raisePanel(p2); S.raisePanel(p3);
	const zs = wired.map(function (e) { return Number(e.style.zIndex); });
	ok('after 700 raises every box is still inside the band',
		zs.every(function (z) { return z >= 1200 && z <= 1799; }), JSON.stringify(zs));
	ok('...and the last one raised is still the front one',
		Number(p3.style.zIndex) > Number(p2.style.zIndex) &&
		Number(p2.style.zIndex) > Number(p1.style.zIndex),
		JSON.stringify({ p1: p1.style.zIndex, p2: p2.style.zIndex, p3: p3.style.zIndex }));

	ok('nothing disables a hydraulics number row', !/input\.disabled/.test(body('hydNumberRow')));
	// **THE RULE, NOT THE OLD SPELLING OF IT.** This used to match `settings.hydraulics[key]`
	// literally. The row grew a second HOME with the scenario demand multiplier (planning
	// engineer's wish list row 1) -- in a scenario it reads `activeScenario()[key]` -- so the
	// literal moved while the rule did not: blank is still "not stated", in whichever home, and
	// still never a zero.
	ok('...and blank still means "the file did not say"',
		/input\.value = home\(\)\[key\] === undefined \? '' :/.test(body('hydNumberRow')));
	ok('...in whichever of the row\'s two homes the value lives',
		/\(o\.perScenario && !inBaseScenario\(\)\) \? activeScenario\(\) : settings\.hydraulics/
			.test(body('hydNumberRow')));
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

// Where a popover opens, and how tall it is allowed to be (ROADMAP Task 372). Run with:
//   node dev/lpn-spike/popover-place-harness.js
//
// Tom, 2026-08-15: "Settings box opens, if its expanded options are too long, too tall for the
// screen, and its top extends to cover its button." Two faults, one cause: nothing capped a
// popover's height, so a tall one was placed under its button and then a viewport clamp hauled it
// back up ON TOP of that button -- the one place the user is looking and the control they will
// click to dismiss it.
//
// THE VIEWPORT HEIGHT IS THE VARIABLE UNDER TEST, so nothing here holds it constant. A harness that
// only ever asked about one window would have passed on the old code too: at a comfortable height
// every popover fits, the clamp never fires, and the defect is invisible. Every section below sweeps
// a range of window heights, including ones shorter than the panel.
//
// The fake panel teaches the stub the ONE physical relationship the real thing has and the naive
// stub would not: capping the scrolling BODY shortens the whole PANEL by the same amount, and the
// panel's chrome (padding, and #lpn_popup's pinned close button) survives the cap. Hold that
// constant -- return a fixed height whatever the cap -- and a capped panel still measures too tall,
// which is precisely the state that put a box over its own button.

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../../css/engcalcs.css'), 'utf8');
const php = fs.readFileSync(path.join(__dirname, '../../Looped-Network.php'), 'utf8');

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

const EDGE = +(src.match(/var POPUP_EDGE = (\d+);/) || [])[1];
report(EDGE > 0, 'the viewport margin is read out of the file', String(EDGE));

// A mutable window, so a section can put the same panel in a tall screen and a short one.
var window = { innerWidth: 1200, innerHeight: 900 };
// **THE CHROME FLOOR IS A STUB WITH A REAL NUMBER IN IT, not a stub that returns 0.** The page's
// own chromeFloor() measures the menu bar, toolbar and tab strip; a stub returning nothing would
// make every check below pass by removing the coupling it exists to test. It is a variable so a
// section can put the panel under a tall strip and a short one, exactly as `window` does.
var CHROME_FLOOR = 0;
function chromeFloor() { return CHROME_FLOOR; }
eval(`var POPUP_EDGE = ${EDGE};\n` + [
	extract('panelPlacement'), extract('capPanelHeight'), extract('resetPanelHeight'),
	extract('panelBody'), extract('openPanelAtAnchor'), extract('fitPanelToViewport')
].join('\n'));

// bodyH: how tall the body WANTS to be. chrome: everything else in the panel, which a cap never
// eats. The panel's measured height is chrome + min(bodyH, whatever cap is on the body) -- that is
// the coupling, and it is what makes a capped panel actually shorter.
function fakePanel(w, bodyH, chrome, hasBody, hasBand) {
	const body = {
		style: {},
		getBoundingClientRect() {
			const cap = parseFloat(body.style.maxHeight);
			return { width: w, height: isNaN(cap) ? bodyH : Math.min(bodyH, cap) };
		}
	};
	const panel = {
		style: {},
		// `.lpn-popover-x` is the CLOSE BUTTON, and openPanelAtAnchor() asks for it to decide whether
		// this panel has a top band worth lifting clear of the chrome. A menu pull-down has none.
		querySelector(sel) {
			if (sel === '.lpn-popover-x') { return hasBand ? { tag: 'button' } : null; }
			return (hasBody && sel === '.lpn-popover-body') ? body : null;
		},
		getBoundingClientRect() {
			// A panel with no body wrapper scrolls itself, so its own max-height is what binds.
			const own = parseFloat(panel.style.maxHeight);
			const natural = hasBody ? chrome + body.getBoundingClientRect().height : chrome + bodyH;
			return { width: w, height: isNaN(own) ? natural : Math.min(natural, own) };
		},
		_body: body
	};
	return panel;
}
const rect = (left, top, w, h) => ({ left, top, right: left + w, bottom: top + h, width: w, height: h });
const px = (v) => parseFloat(v);

console.log('\n-- a panel that fits hangs under its button and is not capped --');
{
	const anchor = rect(300, 40, 90, 28);
	for (const vh of [700, 900, 1400]) {
		window.innerHeight = vh;
		const p = fakePanel(240, 260, 16, true);
		const at = openPanelAtAnchor(p, anchor);
		report(at.side === 'below' && px(p.style.top) === anchor.bottom,
			`vh=${vh}: it opens at the button's bottom edge`, p.style.top);
		report(at.maxHeight === null && !p.style.maxHeight && !p._body.style.maxHeight,
			'...and neither the panel nor its body is pinned to a height');
	}
	// Not pinning is what lets Settings rebuild its fields and be a different size next time.
	const p = fakePanel(240, 260, 16, true);
	openPanelAtAnchor(p, anchor);
	report(p.getBoundingClientRect().height === 276, 'an uncapped panel measures its natural height');
}

console.log('\n-- THE REPORTED BUG: a panel taller than the room below never covers its button --');
{
	// A menu-bar button near the top, and a Settings panel with every section expanded.
	const anchor = rect(300, 40, 90, 28);
	// Sweep from just-too-short down to absurd. The old code failed all of them the same way, and a
	// harness that asked only about a comfortable window would have failed to notice.
	for (const vh of [960, 800, 600, 420, 300, 200]) {
		window.innerHeight = vh;
		const p = fakePanel(240, 900, 16, true);
		const at = openPanelAtAnchor(p, anchor);
		const top = px(p.style.top), h = p.getBoundingClientRect().height;
		report(top >= anchor.bottom || top + h <= anchor.top,
			`vh=${vh}: the panel clears the button that opened it`, `top ${top} h ${h}`);
		report(top + h <= vh - EDGE + 0.001 && top >= EDGE - 0.001,
			'...and still lands inside the window', `bottom ${top + h} of ${vh}`);
		report(px(p._body.style.maxHeight) < 900, 'the body took the cap, so it scrolls');
	}
}

console.log('\n-- a button near the BOTTOM flips the panel above it --');
{
	window.innerHeight = 900;
	const anchor = rect(300, 830, 90, 28);           // 42px of room below, 826 above
	const p = fakePanel(240, 400, 16, true);
	const at = openPanelAtAnchor(p, anchor);
	report(at.side === 'above', 'it opens above rather than being squeezed into 42px');
	report(px(p.style.top) + p.getBoundingClientRect().height === anchor.top,
		'...with its bottom edge on the button top', p.style.top);
	report(!p._body.style.maxHeight, 'and no cap, because it fits up there');
}

console.log('\n-- when NEITHER side fits, it takes the bigger side and scrolls --');
{
	window.innerHeight = 500;
	const anchor = rect(300, 300, 90, 28);           // 172 below, 296 above
	const p = fakePanel(240, 900, 16, true);
	const at = openPanelAtAnchor(p, anchor);
	report(at.side === 'above', 'above is the bigger side here', `${at.side}`);
	report(Math.abs(px(p.style.top) + p.getBoundingClientRect().height - anchor.top) < 0.001,
		'it still stops at the button', p.style.top);
	// The mirror case: the same anchor low in a window makes below the bigger side.
	const anchor2 = rect(300, 120, 90, 28);          // 352 below, 116 above
	const p2 = fakePanel(240, 900, 16, true);
	const at2 = openPanelAtAnchor(p2, anchor2);
	report(at2.side === 'below' && px(p2.style.top) === anchor2.bottom, 'and the mirror case goes below');
}

console.log('\n-- a tie between the two sides keeps the pull-down where a pull-down belongs --');
{
	window.innerHeight = 900;
	const anchor = rect(300, 430, 90, 28);           // 438 below, 426 above -- below wins
	const p = fakePanel(240, 900, 16, true);
	report(openPanelAtAnchor(p, anchor).side === 'below',
		'a few pixels of advantage does not flip a menu upward');
}

console.log('\n-- horizontal is still a clamp, because sliding sideways hides nothing --');
{
	window.innerWidth = 500; window.innerHeight = 900;
	const anchor = rect(400, 40, 90, 28);
	const p = fakePanel(240, 200, 16, true);
	openPanelAtAnchor(p, anchor);
	report(px(p.style.left) === 500 - 240 - EDGE, 'a panel off the right edge is pulled back', p.style.left);
	const wide = fakePanel(900, 200, 16, true);
	openPanelAtAnchor(wide, anchor);
	report(px(wide.style.left) === EDGE, 'and one wider than the window keeps its LEFT edge on screen');
	window.innerWidth = 1200;
}

console.log('\n-- the cap is undone before the next measurement --');
{
	// A panel opened in a short window and then in a tall one must come back to full size. Without
	// resetPanelHeight() it would ratchet smaller on every open, and nothing on screen would say why.
	const p = fakePanel(240, 600, 16, true);
	const anchor = rect(300, 40, 90, 28);
	window.innerHeight = 300; openPanelAtAnchor(p, anchor);
	const short = p.getBoundingClientRect().height;
	window.innerHeight = 1000; const at = openPanelAtAnchor(p, anchor);
	report(short < 300, 'the short window capped it', String(short));
	report(at.maxHeight === null && p.getBoundingClientRect().height === 616,
		'and the tall window gets the whole panel back', String(p.getBoundingClientRect().height));
}

console.log('\n-- a panel with no .lpn-popover-body scrolls itself (the menus) --');
{
	window.innerHeight = 400;
	const p = fakePanel(200, 700, 8, false);
	openPanelAtAnchor(p, rect(10, 30, 60, 24));
	report(p.style.overflowY === 'auto', 'the panel takes the scrollbar itself');
	report(px(p.style.maxHeight) > 0 && p.getBoundingClientRect().height <= 400 - EDGE,
		'and is capped to the room it has', p.style.maxHeight);
}

console.log('\n-- fitPanelToViewport: for the panels with no anchor to avoid --');
{
	for (const vh of [1000, 500, 220]) {
		window.innerHeight = vh;
		const p = fakePanel(300, 800, 40, true);
		const h = fitPanelToViewport(p);
		report(h <= vh - 2 * EDGE, `vh=${vh}: the height it reports fits the window`, String(h));
		report(h === p.getBoundingClientRect().height, '...and is the height the panel actually is');
	}
	// The chrome is never eaten by the cap: a 40px band plus a body that fits inside what is left.
	window.innerHeight = 300;
	const p = fakePanel(300, 800, 40, true);
	fitPanelToViewport(p);
	report(px(p._body.style.maxHeight) === 300 - 2 * EDGE - 40,
		'the close button and padding are subtracted before the body is capped', p._body.style.maxHeight);
}

console.log('\n-- every popover goes through the one placer, which is the whole of Task 372 --');
{
	// Four boxes with four copies of the same six lines is what let Settings and Labels drift away
	// from the fix Notes already had.
	// **NEITHER LABELS NOR SETTINGS IS IN THIS LIST ANY MORE.** Both are sections of the Settings
	// box since Task 441, and that box is not anchored to anything: it is centred on first open and
	// then lives where the user dragged it, which is the property popup's rule rather than a
	// pull-down's. Asserted as an absence, so a later pass cannot quietly re-anchor it.
	report(!/openPanelAtAnchor/.test(extract('openSettingsBox')),
		'the Settings box is a standing box, not an anchored pull-down');
	report(/clampPanel\(/.test(extract('openSettingsBox')),
		'...and it is clamped into the viewport, so a remembered position always comes back');
	report(/openPanelAtAnchor\(popup, anchor\.getBoundingClientRect\(\), !!level\)/.test(extract('openMenu')),
		'the menus and their fly-outs');
	// Matched on the PLACER, not on the anchor expression. This read `panel, menu.getBounding...`
	// until 2026-08-16, when the anchor moved off the removed toolbar button and gained a fallback
	// -- and the assertion failed for a fix rather than for a defect. Task 372's rule is that the
	// panel goes through openPanelAtAnchor(); which rect it is handed is that panel's own business.
	report(/openPanelAtAnchor\(panel,/.test(extract('showBackdropTargetPanel')),
		'the backdrop-position panel');
	report(/fitPanelToViewport\(popup\)/.test(extract('toggleNotesPopup')), 'the Notes box');
	report(/fitPanelToViewport\(popup\)/.test(extract('openPopupAt')), 'and the property popup');
	// The clamp must be handed the CAPPED height, or it re-derives a top from a height the panel no
	// longer has -- which is the original bug wearing a different hat.
	report(/clampPanel\(sx, sy, r\.width, h,/.test(extract('openPopupAt')),
		'the property popup clamps with its capped height, not its measured one');
	// The three popovers all carry the scrolling wrapper. Notes had it alone until this task.
	report((php.match(/lpn-popover-body/g) || []).length >= 4,
		'and the markup gives every popover the scrolling body', String((php.match(/lpn-popover-body/g) || []).length));
	report(/\.lpn-popover-body \{ overflow: auto/.test(css), 'which the stylesheet makes scroll');
}

console.log('\n-- clicking the menu bar dismisses an open popover (Tom, 2026-08-15) --');
{
	// "When Labels or Settings are open, clicking in the top row of the menu bar does not close
	// them. Clicking anywhere else outside them does close them." The handler exempted #lpn_menubar
	// and #lpn_toolbar wholesale; the two buttons that needed protecting are now named directly.
	const tabs = extract('wireTabs');
	report(!/#lpn_menubar/.test(tabs), 'the menu bar is no longer exempt from the dismissal');
	report(!/#lpn_toolbar/.test(tabs), 'nor is the toolbar');
	report(/viewPopoverAnchor/.test(tabs), 'the control that OPENED the popover is exempt instead');
	report(/closest\('#lpn_menu_popup, #lpn_menu_popup2'\)/.test(tabs),
		'and a menu row stays exempt, since rows are what open these panels');
	report(/if \(!except\) \{ viewPopoverAnchor = null; \}/.test(extract('closeViewPopovers')),
		'and closing them all forgets it, so a stale button cannot go on being exempt');
	// **THE SETTINGS BOX IS OUT OF THIS RULE ENTIRELY** (Task 441): it is a standing box, so a
	// click away must leave it exactly where it is. Asserted as an absence from VIEW_POPOVERS,
	// because putting it back would silently restore the pull-down behaviour Tom replaced.
	report(!/lpn_settings_popup|lpn_settings_box/.test(
		src.slice(src.indexOf('var VIEW_POPOVERS'), src.indexOf('var VIEW_POPOVERS') + 200)),
		'the Settings box is not a click-away pull-down');
}


console.log('\n-- a panel hung below its button clears the WHOLE chrome, not just that button --');
{
	// The reported case: the Find panel hung off a menu row whose bottom was 279, while the toolbar
	// and tab strip below it reached 356. It opened at 279 and its own close button was behind the
	// toolbar.
	window.innerHeight = 1200;
	const anchor = rect(60, 250, 90, 29);
	CHROME_FLOOR = 360;
	const p = fakePanel(240, 400, 16, true, true);
	openPanelAtAnchor(p, anchor);
	report(px(p.style.top) >= CHROME_FLOOR,
		'a downward panel starts below the last strip of chrome, not below its own row',
		p.style.top + ' vs floor ' + CHROME_FLOOR);

	// **AND A MENU PULL-DOWN IS NOT LIFTED, because it has no band to protect** (regression, Tom
	// 2026-08-25: *"Menus have moved down and away from their buttons."*). The lift was written for
	// the draggable boxes, whose top band carries the drag surface and the close button; the same
	// entry point serves the menus, and applying it to them left the Water menu floating below the
	// whole toolbar and tab strip with nothing joining it to the word that opened it.
	CHROME_FLOOR = 360;
	const m = fakePanel(240, 400, 16, true, false);
	openPanelAtAnchor(m, anchor);
	report(px(m.style.top) === anchor.bottom,
		'a menu with no close button hangs at its own button, chrome or no chrome',
		m.style.top + ' should be ' + anchor.bottom + ' (floor ' + CHROME_FLOOR + ')');

	// ...and with no chrome to clear it still hangs off its own button, unchanged.
	CHROME_FLOOR = 0;
	const q = fakePanel(240, 400, 16, true, true);
	openPanelAtAnchor(q, anchor);
	report(px(q.style.top) === anchor.bottom,
		'...and with no chrome in the way it still hangs at the button\'s bottom edge', q.style.top);

	// An UPWARD flip is never pushed down: it flipped to avoid its own anchor, and the floor would
	// land it back on top of it.
	window.innerHeight = 340;
	CHROME_FLOOR = 300;
	const r2 = fakePanel(240, 200, 16, true);
	const at = openPanelAtAnchor(r2, rect(60, 250, 90, 29));
	report(at.side !== 'below' ? px(r2.style.top) < 250 : true,
		'an upward flip is not dragged down onto the control it flipped away from',
		at.side + ' at ' + r2.style.top);
	window.innerHeight = 900;
	CHROME_FLOOR = 0;
}

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);

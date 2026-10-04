// A PANEL IS MADE DRAGGABLE AND HIDDEN IN ONE PLACE EACH -- ROADMAP Task 562. Run with:
//   node dev/lpn-spike/panel-touch-harness.js
//
// `dev/phone-interaction-model.md` found two guards on this page that a person had to REMEMBER to
// add to the next panel somebody wrote, and both had already been forgotten:
//
//   1. **`touch-action: none`.** Six boxes are made draggable by script; three were named in the
//      stylesheet. Find and the two fire-flow boxes could be dragged by a mouse and not by a
//      finger, because without that property the browser claims the gesture for scrolling before
//      `pointermove` ever fires. The stylesheet comment beside the list even named *Find* as one of
//      its three while the selector beside it named *Library*, which is what a hand-maintained
//      list looks like once it has drifted.
//   2. **Sweeping a panel's tooltips when it closes.** Twelve closers; six swept and six did not.
//      A tip is rendered into `document.body`, not into the box that raised it, so hiding the box
//      leaves the tip standing over the map -- and on touch there is no pointer to move away and
//      the trigger it belonged to is now `display:none`, so its own outside-tap listener can never
//      fire either. Tom, 2026-08-29: *"Tips (? glyphs) in the Node editor survive the editor box on
//      close on a phone."*
//
// **THE LITERAL SCANS ARE NOT THE WHOLE GUARD** (found 2026-09-19, Task 701). Sections 1b and 2 match
// a LITERAL `'block'`, `'flex'` or `'none'`, so the ternary form -- `el.style.display = open ?
// 'flex' : 'none'` -- escaped them, about fifty sites. Section 2b now reads every other display
// write and requires a declaration (function + element + reason); section 2c asserts that only
// applyPaneLayout() opens or closes the bottom panel, in the DOM and in `paneState.open`.
//
// **THE FIX IS STRUCTURAL AND SO IS THIS HARNESS.** Neither is a list of six panels to keep up to
// date -- makePanelDraggable() adds the class itself, and hidePanel() sweeps -- so what is asserted
// is that there is no OTHER door. A per-panel checklist would have passed on the day the drift
// happened, which is the whole reason it is not what is written here.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
// **COMMENTS BLANKED, KEEPING THE LINE NUMBERS**, the way third_party_request_check.php does it:
// this file is 47% comment lines and several of them QUOTE the very calls being counted -- the rule
// forbidding a hand-written closer says `style.display = 'none'` inside its own sentence. Blanking
// rather than deleting so a reported line number is still the line in the file.
const code = js.split('\n').map(function (ln) {
	const at = ln.indexOf('//');
	return (at >= 0 && !/['"`]/.test(ln.slice(0, at))) ? ln.slice(0, at) : ln;
}).join('\n');
const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function body(name) {
	const at = js.search(new RegExp('function ' + name + '\\s*\\('));
	if (at < 0) { return ''; }
	let i = js.indexOf('{', at), depth = 0, end = i;
	for (; end < js.length; end++) {
		if (js[end] === '{') { depth++; }
		else if (js[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return js.slice(at, end);
}

// ---------------------------------------------------------------------------
// 1. DRAGGABLE AND TOUCH-DRAGGABLE IN THE SAME PLACE.
// ---------------------------------------------------------------------------
console.log('\n--- one place makes a panel draggable ---');
{
	const mk = body('makePanelDraggable');
	ok('makePanelDraggable() exists', !!mk);
	ok('...and it adds the class itself, so a panel cannot be half-wired',
		/classList\.add\('lpn-dragpanel'\)/.test(mk));
	// The stylesheet's half. A CLASS, never a list of ids: the id list is what drifted.
	ok('the stylesheet gives .lpn-dragpanel `touch-action: none`',
		/\.lpn-dragpanel\s*\{[^}]*touch-action:\s*none/.test(css));
	ok('...and `cursor: move`, so the chrome says it can be dragged',
		/\.lpn-dragpanel\s*\{[^}]*cursor:\s*move/.test(css));
	// **THE DRIFT CANNOT COME BACK.** An id that carries `touch-action: none` is a panel named by
	// hand somewhere other than makePanelDraggable(), which is the exact shape of the defect.
	const idTouch = (css.match(/^#lpn_[^{\n]*\{[^}]*touch-action:\s*none[^}]*\}/gm) || [])
		.filter(function (r) { return !/^#lpn_canvas\b/.test(r); });   // the map itself, not a panel
	ok('no PANEL is named by id for touch-action any more', idTouch.length === 0,
		JSON.stringify(idTouch));
	// And the count, so the two halves can be seen to be about the same set of boxes.
	const calls = (js.match(/makePanelDraggable\(/g) || []).length - 1;   // less the declaration
	ok('every draggable panel goes through that one function', calls >= 6, calls + ' call sites');
}

// ---------------------------------------------------------------------------
// 1b. A PANEL THAT BECOMES VISIBLE COMES TO THE FRONT.
//
//     Tom, 2026-09-05: *"When an asset is clicked and its properties box opens, it is hidden under
//     Libraries... It needs to win at the moment the asset is clicked."* The raise mechanism had
//     existed since 2026-09-02 and reached six of the eight panels, because it was wired to
//     placePanelForScreen() -- the seam that RESTORES A REMEMBERED CORNER. The two boxes that place
//     themselves instead of remembering are the fire flow run dialog (which had already been caught,
//     for the same reason, three days earlier) and the property popup, which had not.
//
//     So the invariant is stated over the SEAMS rather than over the boxes: a function that makes a
//     panel visible must raise it in the same breath. Asserted as "every function that sets a
//     registered panel's display to block or flex also calls the raise", which is what makes a ninth
//     panel written next month fail here rather than open behind something.
// ---------------------------------------------------------------------------
console.log('\n--- a panel that opens comes to the front ---');
{
	ok('raisePanel() exists and the panels have a bounded band',
		/function raisePanel\s*\(/.test(code) && /LPN_PANEL_Z_CEILING/.test(code));
	// The three seams, each named with what it does that the others do not.
	const SEAMS = [
		['placePanelForScreen', 'the six standing boxes, which restore a remembered corner'],
		['openPopupAt', 'the property popup, which opens beside the element it describes'],
		['openFireFlowRunBox', 'the run dialog, which centres itself on every open']
	];
	SEAMS.forEach(function (pair) {
		const b = body(pair[0]);
		ok(pair[0] + '() raises the panel it shows -- ' + pair[1],
			!!b && /__lpnRaise/.test(b), b ? '' : 'FUNCTION NOT FOUND');
	});
	// **THE NEGATIVE HALF, which is the one that catches the ninth panel.** Every assignment that
	// makes something visible must sit in a function that also raises -- either by calling the raise
	// itself, or by going through placePanelForScreen(), which raises whatever it places. Stated over
	// the ENCLOSING FUNCTION rather than over the seam list, because the six standing boxes set their
	// own `display` a few lines above the placing call and are correct.
	function coveringFn(at) {
		let i = code.lastIndexOf('function ', at);
		while (i >= 0) {
			let j = code.indexOf('{', i), depth = 0, end = j;
			for (; end < code.length; end++) {
				if (code[end] === '{') { depth++; }
				else if (code[end] === '}') { depth--; if (depth === 0) { end++; break; } }
			}
			if (end > at) { return code.slice(i, end); }
			i = code.lastIndexOf('function ', i - 1);
		}
		return '';
	}
	const shows = [];
	const re = /([A-Za-z_$][\w$]*)\.style\.display = '(?:block|flex)'/g;
	let m;
	while ((m = re.exec(code)) !== null) {
		const fn = coveringFn(m.index);
		if (/__lpnRaise|raisePanel\(|placePanelForScreen\(/.test(fn)) { continue; }
		shows.push(m[1] + ' @' + code.slice(0, m.index).split('\n').length);
	}
	// Declared: what is made visible that is NOT a draggable panel. A row here is a sentence somebody
	// had to write, exactly as in section 2's NOT_A_PANEL.
	const NOT_A_PANEL_SHOW = [
		[/^lab @/, 'a node data label on the map'],
		[/^valLab @/, 'a valve data label on the map'],
		[/^qLab @/, 'a water-quality label on the map'],
		[/^row @/, 'a row inside a box that is already open'],
		[/^sepRow @/, 'a row inside a box that is already open'],
		[/^div @/, 'a row inside a box that is already open'],
		[/^banner @/, 'the one-line status banner across the top of the map'],
		[/^engineBar @/, 'the engine-wait progress bar (Task 608): a 6px track under that same '
			+ 'banner, holding no control, with no drag, no resize, no stored geometry and nothing '
			+ 'focusable -- the same reasoning as the banner it hangs from. **IT SHOWS AND HIDES '
			+ 'ITSELF AND NOTHING ELSE**: it is not mounted in the bottom pane and it opens no '
			+ 'panel, so it is here because this scan reads EVERY display assignment in the file, '
			+ 'not because the bar reaches into anything. `engineBar` rather than `bar`, because '
			+ 'the toolbar and the georeference bar are both called `bar` in their own functions '
			+ 'and a row reading `bar` would excuse all three (Tom, 2026-09-19: *"Why would the run '
			+ 'progress bar do anything to the bottom panel?"* -- it does not)'],
		[/^back @/, 'the modal dialog backdrop -- an empty scrim, holding no control'],
		[/^dlg @/, 'the modal dialog itself, centred by CSS and outranking everything'],
		[/^panel @/, 'openPanelAtAnchor(): the menus, their fly-outs and the panels that hang off a '
			+ 'control. These live in the CHROME band by Tom\'s 2026-08-24 ruling and must NOT be '
			+ 'raised into the 1200 band -- a menu belongs to the button that opened it. The six '
			+ 'standing boxes that ALSO hang off a control go through placePanelForScreen().'],
		[/^marker @/, 'paneStartColDrag() (2026-09-26, fourth pass): the column-drag insertion '
			+ 'marker, a thin line at the edge of the heading the pointer is nearest. It holds no '
			+ 'control, has no drag of its own, no resize, no stored geometry and nothing '
			+ 'focusable to trap -- the same reasoning as the select-area marquee below -- and it '
			+ 'is built and destroyed with the drag itself, never left standing for hidePanel() to '
			+ 'find.']
	];
	const undeclared = shows.filter(function (s) {
		return !NOT_A_PANEL_SHOW.some(function (r) { return r[0].test(s); });
	});
	ok('nothing outside those seams makes a panel visible', undeclared.length === 0,
		JSON.stringify(undeclared));
}

// ---------------------------------------------------------------------------
// 2. ONE FUNCTION HIDES A PANEL, AND SWEEPING ITS TIPS IS PART OF HIDING IT.
//
//    The assertion is the NEGATIVE one -- no other `display = 'none'` -- with
//    a declared list of the things that are not panels. A positive list of
//    closers is exactly the artefact that drifted.
// ---------------------------------------------------------------------------
console.log('\n--- one place hides a panel, tips and all ---');
{
	const hp = body('hidePanel');
	ok('hidePanel() exists', !!hp);
	ok('...and it sweeps the panel\'s own tips before hiding it',
		/hideTipsIn\(el\)/.test(hp) && /el\.style\.display = 'none'/.test(hp));
	// Scoped to the closing panel, never the document: closing one box must not take down a tip
	// somebody is reading over another one.
	ok('...scoped to the panel, not the document', !/hideTipsIn\(document\)/.test(hp));

	// **WHAT IS NOT A PANEL.** Each of these hides a piece of the DRAWING or a one-line message,
	// none of them can contain a control, so none of them can raise a tooltip. Declared here with
	// the reason rather than pattern-matched, so adding a real panel to this list is a deliberate
	// act somebody has to write a sentence for.
	const NOT_A_PANEL = [
		[/holder\.leader\.style\.display/, 'a label leader line on the map'],
		[/le\.leader\.style\.display/, 'a link label leader line on the map'],
		[/le\.arrows\[i\]\.style\.display/, 'a flow arrow on the map'],
		[/\bb\.style\.display = 'none'; return;/, 'the satellite toggle button'],
		[/pop\.style\.display = 'none';/, 'a colour-ramp list, hidden as it is BUILT'],
		[/msg\.style\.display = 'none';/, 'a one-line status message'],
		[/banner\.style\.display = 'none'/, 'the model-locked banner'],
		// Keyed on the VARIABLE NAME alone, not on the indentation of the line after it: a
		// declaration that has to be re-tabbed when its function moves is one nobody trusts.
		// `engineBar` is unique to refreshEpanetBar(), which is the point of the name.
		[/engineBar\.style\.display = 'none';/, 'the engine-wait progress bar (Task 608), declared with its reason beside NOT_A_PANEL_SHOW above'],
		[/back\.style\.display = 'none'/, 'the modal backdrop -- an empty scrim, holds no control'],
		[/b\.el\.style\.display = 'none'; return;/, 'a legend badge on the map'],
		[/pendingPathEl\.style\.display = 'none'; return;/, 'the dashed line of a link being drawn (Task 567)'],
		[/selectAreaEl\.style\.display = 'none'; return;/, 'the select-area marquee on the map (Task 266)'],
		[/marker\.style\.display = 'none';/, 'the column-drag insertion marker (2026-09-26, fourth '
			+ 'pass), declared with its reason beside NOT_A_PANEL_SHOW above'],
		[/zoomWinEl\.style\.display = 'none'; return;/, 'the Zoom Window drag box on the map (Task 682), the same kind of shape as the select-area marquee above'],
		[/box\.style\.display = 'none'; box\.textContent = '';/, 'the select-area instruction bubble, which holds no control'],
		[/el\.style\.display = 'none'; \}\n\t\ttry \{ localStorage\.setItem\(MENU_CUE_KEY/,
			'the one-time menu cue (Task 625): a line of text and a dismiss button, with no drag, '
			+ 'no resize, no stored geometry and nothing focusable to trap -- hidePanel() exists '
			+ 'for boxes that have those, and it would also write a layout record this has none of'],
		[/el\.style\.display = 'none'; return; }\n\t\tnice = scaleBarRound/,
			'the scale bar, when there is no honest number to print: a readout in the map footer '
			+ 'strip, with no drag, no resize, no stored geometry and nothing focusable -- the '
			+ 'same reasoning as the menu cue two rows up'],
		[/el\.style\.display = 'none'; return; }\n\t\tunit = unitLabel/,
			'the scale bar again, when the rounded bar would be too short to label'],
		[/el\.style\.display = 'none';\n\t}/, 'hidePanel() itself']
	];
	const lines = code.split('\n');
	const stray = [];
	lines.forEach(function (ln, i) {
		if (ln.indexOf("style.display = 'none'") < 0) { return; }
		const ctx = ln + '\n' + (lines[i + 1] || '');
		if (NOT_A_PANEL.some(function (d) { return d[0].test(ctx); })) { return; }
		stray.push((i + 1) + ': ' + ln.trim());
	});
	ok('nothing hides a panel except hidePanel()', stray.length === 0, JSON.stringify(stray));

	// The six closers that DID sweep must not have grown a second copy of the sweep: one seam.
	const inline = (js.match(/hideTipsIn\([a-z]+\); *[a-z]+\.style\.display/g) || []);
	ok('no closer still sweeps by hand beside hiding', inline.length === 0, JSON.stringify(inline));
}

// ---------------------------------------------------------------------------
// 2b. EVERY OTHER SPELLING OF A SHOW OR A HIDE (ROADMAP Task 701).
//
//     Sections 1b and 2 read a LITERAL `'block'`, `'flex'` or `'none'`. The same assignment written
//     as a choice (`open ? 'flex' : 'none'`), as a variable, or as `''` (clear the inline rule and
//     let the stylesheet decide) is invisible to them -- about fifty sites. This section reads the
//     RHS-agnostic form: every `X.style.display = <anything that is not one of those three
//     literals>` must be declared below with the function that may write it and the element it may
//     touch, and a sentence saying why it is not a panel. A site that matches no row fails, so a
//     new conditional show/hide has to be classified by somebody on the day it is written, which is
//     what the literal scans already force for the plain form.
//
//     Keyed on FUNCTION NAME + LEFT-HAND SIDE, never on a line number or indentation. A row that is
//     never matched fails too, because an unused row is a standing excuse for a site not yet written.
// ---------------------------------------------------------------------------
console.log('\n--- no conditional show or hide goes undeclared ---');
const fnRanges = [];
{
	const fre = /function\s+([A-Za-z_$][\w$]*)\s*\(/g;
	let fm;
	while ((fm = fre.exec(code)) !== null) {
		let i = code.indexOf('{', fm.index), depth = 0, end = i;
		for (; end < code.length; end++) {
			if (code[end] === '{') { depth++; }
			else if (code[end] === '}') { depth--; if (depth === 0) { end++; break; } }
		}
		fnRanges.push({ name: fm[1], from: fm.index, to: end });
	}
}
// The innermost NAMED function around an offset (an anonymous callback belongs to the named one).
function namedFnAt(at) {
	let best = null;
	fnRanges.forEach(function (r) {
		if (r.from <= at && at < r.to && (!best || r.from > best.from)) { best = r; }
	});
	return best ? best.name : '(top level)';
}
const LIT_DISPLAY = /^'(?:block|flex|none)'$/;
const COND = 'a visibility that is a pure function of state, with no control to close and no tip to sweep';
const OWN_ROW = 'a row or field inside a box that is already open';
// [function regex, element regex, why it is not a panel]. The bottom panel, the right panel and
// their buttons are NOT here: section 2c names who may write them, which is stricter than a reason.
const CONDITIONAL_DISPLAY = [
	[/^updateDataLeader$/, /^holder\.leader$/, 'a label leader line on the map'],
	[/^propGraphSync$/, /^box$/, 'the Graph section inside the Properties box (lpn_popup_graph): shown when the element has run frames, hidden through hidePanel() otherwise; part of the Properties box, not a panel of its own'],
	[/^showDrawing$/, /^L$/, 'a map drawing layer of a kept project (Task 680): hidden while its project is not on screen, shown on its return; map layers, not a panel'],
	[/^twin$/, /^n$/, 'a fresh map drawing layer cloned from a possibly hidden one (Task 680), so it starts visible; a map layer, not a panel'],
	[/^updateArrow$/, /^le\.arrows\[i\]$/, 'a flow arrow on the map'],
	[/^refreshScaleBar$/, /^el$/, 'the scale bar readout in the map footer strip'],
	[/^renderColorLegend$/, /^box$/, 'the colour legend on the map: ' + COND + '. JUDGEMENT CALL: it is '
		+ 'draggable furniture, but it is shown and hidden by what the map holds, never by the visitor, '
		+ 'so there is no closer to route through hidePanel()'],
	[/^renderLabelsLegend$/, /^box$/, 'the labels legend on the map: same reasoning as the colour legend above'],
	[/^updateOffscreenNotice$/, /^el$/, 'the one-line "something is off screen" notice on the map'],
	[/^refreshBasemapTeaser$/, /^b$/, 'the satellite toggle button'],
	[/^paneSelButtonSync$/, /^b$/, 'the Tables pane\'s Selection only button (Task 757): shown on a table tab only, like Print; a control in the pane head, not a panel'],
	[/^refreshBasemapCredit$/, /^(?:c|el2)$/, 'a basemap attribution line in the map footer, required by the tile licences'],
	[/^georefRefreshBar$/, /^bar$/, 'the georeference bar across the map: a fixed strip, not a draggable box'],
	[/^georefRefreshBar$/, /^georefBarEl\('lpn_georef_\w+'\)$/, 'a control inside the georeference bar'],
	[/^paintZoomWin$/, /^zoomWinEl$/, 'the Zoom Window drag box on the map'],
	[/^mapgeoShow$/, /^b$/, 'a control inside the map-geometry bar'],
	[/^mapgeoRefreshBar$/, /^bar$/, 'the map-geometry bar: a fixed strip, not a draggable box'],
	[/^setPendingLinkFrom$/, /^rubberBandEl$/, 'the rubber-band line of a link being drawn'],
	[/^drawPendingPath$/, /^pendingPathEl$/, 'the dashed line of a link being drawn'],
	[/^paintAreaMarquee$/, /^selectAreaEl$/, 'the select-area marquee on the map'],
	[/^updateAreaHint$/, /^box$/, 'the select-area instruction bubble, which holds no control (it raises itself)'],
	[/^renderFindMessage$/, /^findQueryMsgEl$/, 'a one-line message inside the Find box'],
	[/^setOpen$/, /^pop$/, 'a colour-ramp list under its own button, closed by that button'],
	[/^writeBreaks$/, /^msg$/, 'a one-line message inside a box that is already open'],
	[/^updateEmptyHint$/, /^hint$/, 'the empty-map welcome wall, laid over the map by state'],
	[/^openConvertAsBox$/, /^u\.item$/, OWN_ROW],
	[/^syncNewBoxRoughness$/, /^newBoxUnits\[i\]\.item$/, OWN_ROW],
	[/^applyMethodUI$/, /^row$/, OWN_ROW],
	[/^setboxShow$/, /^el$/, 'a row, group or section inside the Settings box, filtered by its search field. '
		+ 'JUDGEMENT CALL: it can be handed any element of that box, but never the box itself; the box is '
		+ 'opened and closed through placePanelForScreen() and hidePanel()'],
	[/^filterSetboxContainer$/, /^(?:kid|pendingSub)$/, 'a row inside the Settings box, filtered by its search field'],
	[/^applySetboxFilter$/, /^(?:sec|b|none)$/, 'a section, section button or "no match" line inside the Settings box'],
	[/^libCurveEqRefresh$/, /^entry\._lpnEqField$/, 'a field inside the Library curve editor'],
	[/^showNotice$/, /^el$/, 'the one-line map notice (lpn_map_notice): text only, no control'],
	[/^syncStatusBoxVisibility$/, /^el$/, 'the status line (lpn_status): text only, no control. JUDGEMENT CALL: it is a box, '
		+ 'but it holds no control, cannot be dragged and cannot be closed by the visitor'],
	[/^paintEngineBanner$/, /^el$/, 'the engine-wait banner across the top of the map: text only']
];
// What section 2c owns instead, as function + element.
const PANE_SEAM_WRITES = [['applyPaneLayout', 'pane'], ['applyPaneLayout', 'btn'], ['applyRPaneLayout', 'pane']];
const condUsed = CONDITIONAL_DISPLAY.map(function () { return 0; });
const condStray = [];
let condSeen = 0;
{
	const re = /([A-Za-z_$][\w$.\[\]()']*?)\.style\.display\s*=(?!=)\s*([^;\n]*)/g;
	let m;
	while ((m = re.exec(code)) !== null) {
		if (LIT_DISPLAY.test(m[2].trim())) { continue; }
		condSeen++;
		const fn = namedFnAt(m.index), lhs = m[1];
		let hit = PANE_SEAM_WRITES.some(function (p) { return p[0] === fn && p[1] === lhs; });
		CONDITIONAL_DISPLAY.forEach(function (d, i) {
			if (d[0].test(fn) && d[1].test(lhs)) { hit = true; condUsed[i]++; }
		});
		if (!hit) { condStray.push(fn + ' ' + lhs + ' @' + code.slice(0, m.index).split('\n').length); }
	}
}
ok('every conditional or computed display write is declared', condStray.length === 0, JSON.stringify(condStray));
ok('...and the scan sees them (a scan that reads nothing passes everything)', condSeen >= 40, condSeen + ' sites');
ok('...and no declaration is left unused', condUsed.every(function (n) { return n > 0; }),
	JSON.stringify(CONDITIONAL_DISPLAY.filter(function (d, i) { return !condUsed[i]; })
		.map(function (d) { return d[0].source + ' ' + d[1].source; })));
// The other spellings of the same act. Not display assignments, so they need their own look.
{
	const other = [];
	const reO = /\.style\.setProperty\(\s*'display'|\.style\.cssText\s*=[^;\n]*display\s*:|\.hidden\s*=(?!=)|removeAttribute\(\s*'hidden'|classList\.(?:toggle|add|remove)\(\s*'[^']*(?:hidden|hide|collaps)[^']*'/g;
	// [function regex, matched-text regex, why]
	const DECLARED_OTHER = [
		[/.*/, /lpn-lbl-hidden|lpn-labels-hidden/, 'a CSS class that blanks the map\'s data labels'],
		[/.*/, /^\.hidden\s*=\s*(?:\[|work\.filter)/, 'a list of hidden table columns, not an element'],
		[/.*/, /^\.style\.cssText\s*=\s*'display:flex;gap:0\.5em/, 'a row built inside a box, with its layout'],
		[/^wipeEverything$/, /^\.hidden\s*=\s*true/, 'a throwaway download form built and submitted in one breath, never in the page'],
	];
	let om;
	while ((om = reO.exec(code)) !== null) {
		const fn = namedFnAt(om.index), line = code.slice(0, om.index).split('\n').length,
			text = om[0] + code.slice(om.index + om[0].length, om.index + om[0].length + 40).split('\n')[0];
		if (DECLARED_OTHER.some(function (d) { return d[0].test(fn) && d[1].test(text); })) { continue; }
		other.push(fn + ' "' + om[0].trim() + '" @' + line);
	}
	ok('no OTHER spelling of a show or hide (setProperty, cssText, .hidden, a hide class) goes undeclared',
		other.length === 0, JSON.stringify(other));
}

// ---------------------------------------------------------------------------
// 2c. ONLY applyPaneLayout() OPENS OR CLOSES THE BOTTOM PANEL (and only applyRPaneLayout() the right).
//
//     By discipline until Task 701, and the shape `dev/scenario-seam-repair.md` is about: one write
//     seam, and the defects that followed when something else wrote around it. Two doors, closed here:
//       (a) the DOM -- any function other than the seam that shows, hides, classes or hands to
//           hidePanel() the element `paneEl()` returns (or `lpn_pane_body`), however the value is
//           spelled, through a variable or directly;
//       (b) the STATE -- `paneState.open = ...` anywhere but the functions that own it. They are
//           allowed because each either calls the seam at once (openPane, closePane) or is the
//           loader, whose caller applies the stored layout.
//     The right panel is held to the same rule, as the same shape of seam beside it.
// ---------------------------------------------------------------------------
console.log('\n--- only applyPaneLayout() opens or closes the bottom panel ---');
{
	const PANES = [
		{ label: 'bottom panel', seam: 'applyPaneLayout', getter: 'paneEl', ids: ['lpn_pane', 'lpn_pane_body'],
			state: 'paneState', stateOwners: ['loadPaneState', 'openPane', 'closePane'],
			callers: ['openPane', 'closePane'] },
		{ label: 'right panel', seam: 'applyRPaneLayout', getter: 'rpaneEl', ids: ['lpn_rpane'],
			state: 'rpaneState', stateOwners: ['loadRPaneState', 'openRightPane', 'closeRightPane'],
			callers: ['openRightPane', 'closeRightPane'] }
	];
	PANES.forEach(function (P) {
		ok(P.seam + '() exists', !!body(P.seam));
		const idAlt = P.ids.join('|');
		// Every way of GETTING the element: its getter, or its id directly.
		const getSrc = '(?:' + P.getter + '\\(\\)|document\\.getElementById\\(\\s*\'(?:' + idAlt + ')\'\\s*\\))';
		const doors = [];
		let seamWrites = 0;
		fnRanges.forEach(function (r) {
			const src = code.slice(r.from, r.to);
			const aliasRe = new RegExp('\\b([A-Za-z_$][\\w$]*)\\s*=\\s*' + getSrc, 'g');
			const names = [getSrc];
			let am;
			while ((am = aliasRe.exec(src)) !== null) { names.push('\\b' + am[1] + '\\b'); }
			const who = '(?:' + names.join('|') + ')';
			const write = new RegExp(who + '\\s*\\.(?:style\\.(?:display|visibility|cssText)|hidden\\b|classList\\.(?:toggle|add|remove)\\(\\s*\'[^\']*(?:hid|collaps|open|clos|show)[^\']*\')'
				+ '|' + who + '\\s*\\.setAttribute\\(\\s*\'(?:style|hidden)\''
				+ '|\\b(?:hidePanel|placePanelForScreen)\\(\\s*' + who, 'g');
			let wm;
			while ((wm = write.exec(src)) !== null) {
				const abs = r.from + wm.index;
				if (namedFnAt(abs) !== r.name) { continue; }   // belongs to a nested named function
				if (r.name === P.seam) { seamWrites++; continue; }
				if (r.name === P.getter) { continue; }
				doors.push(r.name + ' @' + code.slice(0, abs).split('\n').length + ': ' + wm[0].slice(0, 50));
			}
		});
		ok('no function but ' + P.seam + '() writes the ' + P.label + '\'s display, class or hiding', doors.length === 0,
			JSON.stringify(doors));
		ok('...and the seam really does write it (a guard over a seam that writes nothing passes anything)',
			seamWrites >= 1, seamWrites + ' writes');
		// (b) the state.
		const stateRe = new RegExp('\\b' + P.state + '\\s*(?:\\.open|\\[\\s*\'open\'\\s*\\])\\s*=(?!=)|\\b' + P.state + '\\s*=(?!=)', 'g');
		const stateDoors = [];
		let sm;
		while ((sm = stateRe.exec(code)) !== null) {
			const abs = sm.index, fn = namedFnAt(abs);
			if (/\bvar\s+$/.test(code.slice(Math.max(0, abs - 6), abs))) { continue; }   // the declaration
			if (P.stateOwners.indexOf(fn) >= 0) { continue; }
			stateDoors.push(fn + ' @' + code.slice(0, abs).split('\n').length);
		}
		ok('no function but ' + P.stateOwners.join(', ') + ' sets whether the ' + P.label + ' is open',
			stateDoors.length === 0, JSON.stringify(stateDoors));
		P.callers.forEach(function (c) {
			ok(c + '() applies the layout the moment it changes the state',
				new RegExp(P.seam + '\\(\\)').test(body(c)), body(c) ? '' : 'FUNCTION NOT FOUND');
		});
	});
}

// ---------------------------------------------------------------------------
// 3. AND IT REALLY SWEEPS. The two lines above are a shape; this runs the
//    function. The stub's own elements answer querySelectorAll() with nothing,
//    which would make a shape-only assertion pass over a hidePanel() that had
//    quietly stopped calling hideTipsIn -- so the panel here is hand-made and
//    answers with a trigger, and bootstrap is taught to hand back a tooltip
//    that records being hidden.
// ---------------------------------------------------------------------------
console.log('\n--- ...and the sweep is not decorative ---');
{
	require('./lpn-dom-stub.js');   // window, document, bootstrap
	const L = require('./lpn-dom-stub.js').loadLoopedNetwork(
		"\t\thidePanel: hidePanel,\n"
	);
	let hidden = 0;
	const trigger = {};
	const panel = {
		style: { display: 'block' },
		querySelectorAll: function (sel) {
			return sel === '[aria-describedby^="tooltip"]' ? [trigger] : [];
		}
	};
	const prev = global.bootstrap.Tooltip.getInstance;
	global.bootstrap.Tooltip.getInstance = function (el) {
		return el === trigger ? { hide: function () { hidden++; } } : null;
	};
	L.hidePanel(panel);
	global.bootstrap.Tooltip.getInstance = prev;
	ok('hiding a panel hides the box', panel.style.display === 'none', panel.style.display);
	ok('...and dismisses the tooltip that was standing over the map', hidden === 1, hidden);
	// A missing panel is not an error: several closers look their box up by id and may not find it.
	let threw = false;
	try { L.hidePanel(null); } catch (e) { threw = true; }
	ok('hiding a panel that is not there is a no-op, not a throw', !threw);
}

// ---------------------------------------------------------------------------
// 4. EVERY CONTAINER GIVEN TO initTips() IS HIDDEN THROUGH THAT SEAM.
//    The other direction of the same invariant: a box that raises tips and is
//    then hidden by something other than hidePanel() is the defect, and section
//    2 forbids the only mechanism by which it could happen. What is left to say
//    is that the whole-document sweep still exists for the OPENING rule and has
//    not been folded into the closing one -- they answer different questions.
// ---------------------------------------------------------------------------
console.log('\n--- opening and closing are different sweeps ---');
{
	ok('hideOpenTips() still sweeps the whole document, for the OPENING rule',
		/function hideOpenTips\(\) \{ hideTipsIn\(document\); \}/.test(js));
	// **THE SEAM MOVED ON 2026-09-02 and the old spelling is now a defect, not a synonym.** Every
	// call goes through initTipsIn(), which sweeps orphaned tips before re-wiring -- a rebuild that
	// calls EngCalcs.initTips() directly skips the sweep and leaves a tip on screen for ever. So
	// this counts the new seam AND fails on the old one.
	const tipped = (code.match(/initTipsIn\(([a-zA-Z]+)\)/g) || []);
	ok('containers are still handed to the tip seam by name', tipped.length > 10, tipped.length);
	const direct = (code.match(/EngCalcs\.initTips\(([a-zA-Z]+)\)/g) || [])
		.filter(function (c) { return !/initTipsIn/.test(c); });
	ok('...and nothing calls EngCalcs.initTips() around it, which would skip the orphan sweep',
		direct.length === 1, JSON.stringify(direct));
	// A container given tips must be one of: the document itself (init), or an element that some
	// closer hides -- and section 2 has already proved every such hide goes through hidePanel().
	const named = tipped.map(function (c) { return c.replace(/.*\(|\)/g, ''); });
	ok('...and none of them is a bare `document` outside init',
		named.filter(function (n) { return n === 'document'; }).length <= 2,
		JSON.stringify(named.filter(function (n) { return n === 'document'; })));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

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
		[/back\.style\.display = 'none'/, 'the modal backdrop -- an empty scrim, holds no control'],
		[/b\.el\.style\.display = 'none'; return;/, 'a legend badge on the map'],
		[/pendingPathEl\.style\.display = 'none'; return;/, 'the dashed line of a link being drawn (Task 567)'],
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

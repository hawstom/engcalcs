// THE MAP'S CURSOR CONTRACT AND THE NON-HOGGING BOX'S TITLE BAR -- Tom, 2026-09-09. Run with:
//
//   node dev/lpn-spike/map-cursor-harness.js
//
// TWO OF HIS INSTRUCTIONS OF THAT DAY, HELD TOGETHER BECAUSE BOTH FAIL THE SAME WAY: the page
// renders perfectly and looks right, and the only symptom is what a hand feels.
//
// **THE CURSOR.** *"a move cursor is being used to point at labels and assets. The problem with
// this is that the move cursor has a huge hit box. We need a cursor with an infinitesimal hitbox.
// ... make the open area a panning hand, the grabber a small pointer cursor, and the placement and
// area picker (coordinates) a small crosshairs cursor."* Three cursors, one sentence each: the bare
// map is a hand because you may drag it; an object under the select tool is a `pointer` because
// pressing it acts on THAT object; a tool about to put something at an (x, y) is a `crosshair`
// because the coordinate is what the gesture means. `move` is banned on this map -- not because it
// is the wrong idea but because the glyph is ~24 px of drawn arrows with its hot spot at the
// centre, so it covers the junction disc it is aimed at.
//
// WHAT WOULD MAKE THIS PASS FOR THE WRONG REASON, and it is why the CSS is read as TEXT rather than
// through a computed style: the DOM stub has no cascade at all, so `getComputedStyle().cursor`
// would answer whatever the harness itself last wrote and every assertion would be a tautology.
// The stylesheet IS the artefact here -- there is no JS deciding a cursor on this page, which was
// itself measured (zero `style.cursor` writes across 23,821 sampled points).
//
// The MODE half is real code and is driven through the page's own setMode(), because the class is
// derived from the mode string rather than listed: `newMode.indexOf('add-') === 0`. A list would
// have to be edited for the eighth tool; a derivation is asserted by naming every tool the toolbar
// actually offers and checking it against the toolbar's own array, so a NEW tool that needs the
// cursor cannot be added without this test seeing it.
//
// **THE TITLE BAR.** *"Every non-hogging box has a drag bar or title bar. The title bar should have
// standard styling including a divider between it and the rest of the box. Properties has it, but
// standard styling needs to be applied to all non-hogging windows/boxes ... I sure hope that the
// list of non-hoggers is neatly presented as an array in the code to make this elegant."* There is
// no array and there does not need to be one: every box is `padding: 40px ...` with a
// `.lpn-setbox-title` inside it, so the bar and its divider belong to that one class. This holds
// both halves of that -- every box has the title element, and the class draws a divider -- because
// a box added later with a hand-written title div would look right to its author and wear no bar.

'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const CSS = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');
const PAGE = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// Comments are blanked before every scan: this file's own rules are argued in prose directly above
// them, and `cursor: move` appears in that prose as the thing being banned.
const cssCode = CSS.replace(/\/\*[\s\S]*?\*\//g, ' ');

console.log('\n-- 1. the three cursors, read out of the stylesheet --');

ok('bare canvas says grab', /#lpn_canvas\s*\{[^}]*cursor:\s*grab\b/.test(cssCode));
ok('canvas says grabbing while the button is down',
	/#lpn_canvas\.lpn-panning\s*\{[^}]*cursor:\s*grabbing\b/.test(cssCode));
ok('placement/area mode says crosshair over the whole drawing',
	/#lpn_canvas\.lpn-placemode[^{]*\*[^{]*\{[^}]*cursor:\s*crosshair\b/.test(cssCode));

// **`move` IS BANNED ON THE MAP, AND THE MAP IS EVERY `.lpn-` RULE THAT IS NOT A BOX.** The panels
// keep theirs: `.lpn-dragpanel` is a window title bar, where a four-headed arrow is the convention
// and there is no small target underneath it to cover. So the scan is the drawing's own selectors,
// named, rather than every rule in the file -- and a NEW map selector taking `cursor: move` is
// caught by the second assertion below, which reads the rule text and not a list.
const MAP_SELECTORS = ['.lpn-node', '.lpn-node-hit', '.lpn-link', '.lpn-link-hit',
	'.lpn-link-symbol-hit', '.lpn-vhandle', '.lpn-draglbl'];
MAP_SELECTORS.forEach(function (sel) {
	const re = new RegExp('(^|[,\\s])' + sel.replace('.', '\\.') + '\\s*(,[^{]*)?\\{([^}]*)\\}', 'gm');
	let m, cursors = [];
	while ((m = re.exec(cssCode)) !== null) {
		const c = /cursor:\s*([a-z-]+)/.exec(m[3]);
		if (c) { cursors.push(c[1]); }
	}
	ok(sel + ' never says move', cursors.indexOf('move') < 0, cursors.join(',') || '(none)');
});

// The stronger, list-free half: no rule anywhere under #lpn_canvas may say `move`.
const canvasMove = (cssCode.match(/#lpn_canvas[^{]*\{[^}]*cursor:\s*move\b/g) || []);
ok('no #lpn_canvas rule says move', canvasMove.length === 0, String(canvasMove.length));

// **WHERE YOU MAY CLICK AND WHERE THE CURSOR CHANGES ARE TWO DIFFERENT AREAS** (Tom, 2026-09-09:
// *"we want the cursor to clearly become a pointer when pointing is appropriate, not all over the
// map"*). Each of the three invisible bands is 12 SCREEN pixels wide at every zoom, so on a dense
// drawing at the fit zoom there is no bare map between two pipes -- every gap is a band. A band
// saying `pointer` therefore made the whole canvas a pointer finger, and made moving from a gap
// onto a real node change nothing, which is the "the cursor does not want to change" report.
//
// The band must keep its HIT and lose its CURSOR, and both halves are asserted: `pointer-events`
// unchanged (the 6 px of slop that makes a 0.7-wide pipe clickable), `cursor: inherit` so the band
// shows whatever the canvas is saying. A future edit that gives a band a cursor value of its own
// fails here rather than being discovered on a dense drawing.
//
// **THE TWO SYMBOL BANDS SAY `visible` AGAIN SINCE 2026-09-10, AND THE SECOND HALF OF THE ROW IS
// WHY THAT IS NOT THE 2026-09-09 DEFECT COMING BACK.** That defect was `visible` with NO
// `stroke-width`: the perimeter then takes the initial value, ONE USER UNIT, which on this page is
// one WORLD unit -- 11.5 px of invisible reach on the XY Net3 example and 4,215 px on the same
// network as a geographic project (dev/browser-pass/specs/nodehit.js has the measurement). It was
// fixed with `visibleFill`, which drops the stroke from the hit test altogether.
//
// Task 618 needs the stroke BACK, because a stroke is the only thing that can put a constant slop
// round an outline that is not a circle -- a reservoir's band is its triangle now, and a pump's is
// its volute. So each of those two rows carries a SECOND pattern here: the width it must declare,
// with a zero fallback, which is what makes the keyword safe. Either half alone is the bug, so
// neither may be dropped.
// The FOURTH slot is the cursor each shape must carry -- see the note below the hit-area assertion.
[['.lpn-link-hit', 'visibleStroke', null, 'inherit'],
	['.lpn-link-symbol-hit', 'visible', /stroke-width:\s*var\(--lpn-symhit,\s*0\)/, 'default'],
	['.lpn-node-hit', 'visible', /stroke-width:\s*0\s*;/, 'default']].forEach(function (row) {
	// Anchored at a line start: `.lpn-vertexmode .lpn-link-hit` is a DIFFERENT rule that correctly
	// says crosshair, and an unanchored match finds it first and reads it as this one.
	const re = new RegExp('(^|\\n)\\' + row[0] + '\\s*\\{([^}]*)\\}');
	const m = re.exec(cssCode);
	ok(row[0] + ' keeps its hit area',
		!!m && new RegExp('pointer-events:\\s*' + row[1] + '\\s*;').test(m[2]) &&
		(!row[2] || row[2].test(m[2])),
		m ? (/pointer-events:\s*([A-Za-z]+)/.exec(m[2]) || [])[1] : '(no rule)');
	// **THE SHAPE THAT IS THE INK CARRIES THE OBJECT CURSOR; THE ONE THAT IS SLOP INHERITS**
	// (Tom, 2026-09-10, at 100 px symbols: *"Reservoir and Pump cursor is a grab except for a single
	// pixel at its anchor point"*). While these were oversized invisible bands, `inherit` was right:
	// what they covered was mostly map, and the canvas's own `grab` reaching them was the honest
	// answer. Since Task 618 the node and symbol shapes ARE the drawn silhouette and the drawn symbol
	// beside them is `pointer-events: none`, so they are the topmost hit target over a vessel, a pump
	// or a valve -- and `inherit` told the reader the map was pannable while they pointed at an asset.
	// `.lpn-link-hit` is different and keeps `inherit`: it is still a band AROUND the pipe rather than
	// the pipe, and `.lpn-link` carries `default` for the ink itself.
	ok(row[0] + ' carries cursor: ' + row[3],
		!!m && new RegExp('cursor:\\s*' + row[3] + '\\s*;').test(m[2]),
		m ? (/cursor:\s*([a-z-]+)/.exec(m[2]) || [])[1] : '(no rule)');
});
// **AND THE DRAWN THINGS SAY `default`, WHICH IS TOM'S OWN PREFERENCE MEASURED AGAINST THE SAME
// COMPLAINT** (2026-09-09, having used the corrected map: *"I prefer default over pointer at the
// labels and assets. It's more precise."*). A finger's hot spot sits at the tip of a hand about
// 20 px wide; an arrow tapers to nothing at its own hot spot, so it hides less of a 7 px junction
// disc. The band must still not be the thing carrying it, which is what the rows above hold.
ok('the drawn pipe says default', /\.lpn-link \{[^}]*cursor:\s*default/.test(cssCode));
ok('the drawn node says default', /\.lpn-node \{[^}]*cursor:\s*default/.test(cssCode));

// The two grabbable things he named by hand, positively asserted -- a label and a vertex grip both
// used to wear the four-headed arrow, and both are the smallest targets on the map. They say
// `default` since 2026-09-09, for the reason on the drawn pipe above; what matters here is that
// neither has gone back to `move`, which the list further up holds absolutely.
ok('a draggable label says default',
	/\.lpn-draglbl\s*\{[^}]*cursor:\s*default\b/.test(cssCode));
ok('a vertex grip says default',
	/\.lpn-vhandle\s*\{[^}]*cursor:\s*default\b/.test(cssCode));

console.log('\n-- 2. which modes wear the placement cursor, driven through setMode() --');

const { byId, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const L = loadLoopedNetwork(
	// **THE MODULE'S OWN `svg` IS HANDED THE REAL ELEMENT.** setMode()'s toggle is guarded on it and
	// it is assigned by buildDom(), which this harness has no drawing for; a harness that skipped
	// this would watch every assertion below pass vacuously against a null canvas -- the
	// stub-that-removes-the-coupling trap, one level up. It is the page's element from the stub, so
	// the class really does land where the stylesheet's selector would read it.
	"\t\tsetCanvas: function (e) { svg = e; }, setMode: setMode, getMode: function () { return mode; },\n" +
	"\t\tnoop: 0\n"
);
const svg = byId.lpn_canvas;
L.setCanvas(svg);
function classOn() { return svg.classList.contains('lpn-placemode'); }

// CROSSHAIR: a tool whose press means a coordinate.
const CROSSHAIR = ['add-junction', 'add-reservoir', 'add-tank', 'add-pipe', 'add-pump',
	'add-valve', 'add-text', 'select-area'];
// NOT crosshair, each for its own stated reason: `select` acts on the object under the pointer,
// `delete` does too (so `pointer` is the true thing to say), and `vertices` already states its own
// rule per element in the stylesheet.
const PLAIN = ['select', 'delete', 'vertices'];

CROSSHAIR.forEach(function (m) {
	L.setMode(m);
	ok(m + ' wears the placement cursor', classOn() === true);
});
PLAIN.forEach(function (m) {
	L.setMode(m);
	ok(m + ' does not', classOn() === false);
});
// Leaving a placement tool takes it off, which is the failure `lpn-panning` actually had: a class
// written by one handler and cleared by another stuck on for good.
L.setMode('add-pipe'); L.setMode('select');
ok('leaving a placement tool clears it', classOn() === false);

// **THE PAGE ITSELF IS THE AUTHORITY ON WHAT THE MODES ARE**, read as text rather than held as a
// list here: every mode string the source ever passes to setMode() must be in exactly one of the
// two arrays above. A ninth tool therefore fails HERE, on the day it is written, rather than
// shipping with whatever cursor the `add-` derivation happens to give it -- which is the point of
// deriving instead of listing, and is worth nothing if nobody notices the derivation guessed.
const inSource = [];
JS.replace(/setMode\(\s*'([a-z-]+)'/g, function (all, m) { inSource.push(m); return all; });
const known = CROSSHAIR.concat(PLAIN);
const unknown = inSource.filter(function (m) { return known.indexOf(m) < 0; });
ok('every mode the page sets is accounted for', unknown.length === 0,
	unknown.join(',') || String(inSource.length) + ' sites');
// And the keyboard's own map, which is a second door onto the same tools.
const keyed = [];
const km = /var LPN_TOOL_KEYS = \{([\s\S]*?)\};/.exec(JS);
if (km) { km[1].replace(/'([a-z-]+)'\s*[,}\n]/g, function (all, m) { if (m.length > 1) { keyed.push(m); } return all; }); }
ok('every keyboard tool is accounted for',
	keyed.length > 0 && keyed.every(function (m) { return known.indexOf(m) >= 0; }),
	keyed.join(','));

console.log('\n-- 3. every non-hogging box wears the same title bar --');

// A non-hogging box is a `.lpn-popover` with the 40 px drag band. The two menu popups have
// `padding:4px` and are pull-downs, not boxes, so the band IS the discriminator and no list is kept.
const boxRe = /<div id="(lpn_[a-z0-9_]+)"[^>]*class="[^"]*lpn-popover[^"]*"[^>]*style="([^"]*)"/g;
let m, boxes = [];
while ((m = boxRe.exec(PAGE)) !== null) {
	if (/padding:\s*40px/.test(m[2])) { boxes.push(m[1]); }
}
ok('the drag band identifies the boxes', boxes.length >= 8, boxes.length + ': ' + boxes.join(' '));

// The Notes popover is the one 40 px box with no title, and it is DECLARED rather than silently
// tolerated: it is a free-text pad opened over the map with nothing to name.
const NO_TITLE = ['lpn_notes_popup'];
boxes.forEach(function (id) {
	if (NO_TITLE.indexOf(id) >= 0) { return; }
	// The title is the first .lpn-setbox-title inside the box's own markup.
	const at = PAGE.indexOf('id="' + id + '"');
	const next = PAGE.indexOf('\n<div id="lpn_', at + 1);
	const body = PAGE.slice(at, next < 0 ? PAGE.length : next);
	ok(id + ' carries a .lpn-setbox-title', /class="lpn-setbox-title"/.test(body));
});
NO_TITLE.forEach(function (id) {
	ok(id + ' is the declared exception', boxes.indexOf(id) >= 0);
});

// The bar and its divider belong to the ONE class, which is what makes the above enough.
const titleRule = /\.lpn-setbox-title\s*\{([^}]*)\}/.exec(cssCode);
ok('.lpn-setbox-title exists', !!titleRule);
if (titleRule) {
	ok('it runs the full width of the band', /left:\s*0/.test(titleRule[1]) && /right:\s*0/.test(titleRule[1]));
	ok('it draws the divider', /border-bottom:\s*1px solid/.test(titleRule[1]));
	ok('it stays out of the drag', /pointer-events:\s*none/.test(titleRule[1]));
}
// The per-box rule that drew the one visible divider is GONE. If it came back, two rules would be
// drawing the Properties bar and the boxes would drift apart again.
ok('no per-box divider survives', !/#lpn_popup::before/.test(cssCode));

// The class is written in exactly one place, which is the whole reason it cannot stick.
const writes = (JS.match(/lpn-placemode/g) || []).length;
ok('lpn-placemode is written once', writes === 1, String(writes));

console.log(fails ? '\n' + fails + ' FAILURE(S)\n' : '\nAll assertions passed.\n');
process.exit(fails ? 1 : 0);

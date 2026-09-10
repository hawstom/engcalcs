// TOM'S 2026-09-08 SECOND WORKLIST -- the three defects that shipped with a green harness. Run with:
//   node dev/lpn-spike/worklist-2026-09-08b-harness.js
//
// Each section names, first, the COUPLING the existing harnesses were not modelling. That is the
// point of this file: every one of these was reported from real use while the suite was green, and
// in every case the reason was a stub or an assertion holding constant the one quantity the browser
// varies (`dev/testing-notes.md`; CLAUDE.md's stub rule).
//
//   1. THE POINTER CURSOR (*"My cursor is never turning into a pointer even though select (pointer)
//      mode is on."*). The stub has no CSS engine at all -- getComputedStyle() answers '' for
//      everything -- so no node harness in this repository can ever resolve a cursor. What CAN be
//      held is the two mechanisms: a stylesheet rule whose SPECIFICITY outranks every object cursor
//      on the map, and a class that is written by one handler and cleared by another under a guard.
//
//   2. THE DOUBLE TIP (*"Two tips appear when I hover on the toolbar icon, one is our styled tip.
//      The other is the browser tip. Only on this button."*). Bootstrap MOVES a `title` off the
//      element when it takes it over; the stub has no Bootstrap, so a repaint that writes `title`
//      back looked identical to one that did not. A minimal stand-in with that one behaviour is
//      installed below -- teaching the stub the physical relationship rather than asserting harder.
//
//   3. THE TEXT TABLE (*"Adding a text doesn't immediately add to the Text table."*). Every other
//      add reaches the open pane through applySolveResult(), because every edit schedules a solve.
//      A Text schedules none. No harness had ever combined addText() with an OPEN pane, so the one
//      path with no solve behind it was the one path nothing watched.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
// The two names the real area button is painted with, read from the real lib/lang.ec.en.php the
// stub loads rather than retyped here (dev/scripts/harness_wording_check.php).
const PC = global.EngCalcs.pageConfig;

let checks = 0, failures = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

const SRC = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
// **COMMENTS BLANKED, because the note that explains a rule quotes the selector it removed.** The
// same trap `third_party_request_check.php` and `cookie_attribute_check.php` both hit: the fix for
// a finding is a comment naming the thing, and a scan that reads comments then finds it again.
const CSS = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8')
	.replace(/\/\*[\s\S]*?\*\//g, ' ');

// ================================================================================================
// 1. THE POINTER CURSOR OVER MAP OBJECTS
// ================================================================================================
console.log('--- an object under the pointer says what it is, panning or not ---');
{
	// **THE RULE THAT TOOK IT AWAY.** `#lpn_canvas.lpn-panning *` is an id plus a class plus a
	// universal selector: specificity (1,1,0). Every per-object cursor is a bare class, (0,1,0).
	// So while that class was on, nothing on the drawing could say what it was -- and the class is
	// written by one handler and was cleared by another under a guard, so a gesture whose drag was
	// dropped elsewhere left it on for good.
	//
	// Matched on the SELECTOR rather than on a computed cursor, because the stub has no CSS engine
	// and never will: getComputedStyle() answers '' for every property, by design.
	ok('no universal selector under the panning class outranks the object cursors',
		!/#lpn_canvas\.lpn-panning\s*\*/.test(CSS));
	ok('...while the canvas itself still closes its hand, which cursor inheritance carries',
		/#lpn_canvas\.lpn-panning\s*\{[^}]*cursor:\s*grabbing/.test(CSS));
	// The six that mean something. Each is a bare class selector, so each keeps its own cursor.
	// **THE BANDS TAKE THE CANVAS'S CURSOR SINCE 2026-09-09, and that is not a weakening of this
	// section.** Tom: *"we want the cursor to clearly become a pointer when pointing is appropriate,
	// not all over the map."* A 12-screen-pixel band around every pipe IS the map at a fit zoom on a
	// dense drawing, so `pointer` there answered his complaint by making the whole canvas a pointer
	// finger. The hit area is unchanged -- `pointer-events` on all three bands is untouched -- and
	// the FEEDBACK moved onto the drawn stroke and the drawn disc, which is what this row now holds.
	// **`default` ON THE DRAWN THINGS SINCE 2026-09-09** -- Tom, having used the corrected map:
	// *"I prefer default over pointer at the labels and assets. It's more precise."* The complaint
	// this section was written for was that an object said NOTHING different from the bare map; it
	// still says something different (`grab` is the map, `default` is a thing), and the arrow hides
	// less of a 7 px disc than the hand did.
	[['.lpn-node', 'default'], ['.lpn-link', 'default'], ['.lpn-link-hit', 'inherit'],
		['.lpn-link-symbol-hit', 'default'], ['.lpn-vhandle', 'default'], ['.lpn-draglbl', 'default']
	].forEach(function (row) {
		const re = new RegExp('\\' + row[0].replace('.', '.') + '[^{}]*\\{[^}]*cursor:\\s*' + row[1]);
		ok(row[0] + ' still states cursor: ' + row[1], re.test(CSS));
	});
	// **AND THE GRAB BAND TAKES THE MODE'S CURSOR TOO.** The invisible 12 px ribbon is what the
	// pointer is over almost all of the time, so a Vertices-mode crosshair on the 2 px pipe alone
	// is a crosshair almost nobody sees.
	ok('the invisible grab band follows Vertices mode as the pipe does',
		/\.lpn-vertexmode \.lpn-link,\s*\.lpn-vertexmode \.lpn-link-hit\s*\{[^}]*crosshair/.test(CSS));

	// **THE CLASS CANNOT STICK.** Clearing it is now unguarded: there is no pan in progress once a
	// pointer has been released, and clearing a class costs nothing. Read out of endPointer(), with
	// comment lines blanked so the note that explains the change is not mistaken for the code.
	const bare = SRC.split('\n').map(function (ln) { return /^\s*\/\//.test(ln) ? '' : ln; }).join('\n');
	const endAt = bare.indexOf('if (drag && drag.type === \'pinch\' && pointers.size < 2)');
	const before = bare.slice(Math.max(0, endAt - 600), endAt);
	ok('setPanning(false) runs before either drag test, under no guard at all',
		/setPanning\(false\);\s*$/.test(before.replace(/\s+$/, '') + '\n') ||
		/setPanning\(false\);[^;]*$/.test(before.trim()), JSON.stringify(before.trim().slice(-60)));
	ok('...and neither drag branch clears it any more, so there is one clearing site on release',
		!/pointerId === e\.pointerId\) \{ drag = null; dragDirty = false; setPanning\(false\); \}/.test(bare));
	ok('the class still has exactly one writer', (SRC.match(/classList\.toggle\('lpn-panning'/g) || []).length === 1);
}

// ================================================================================================
// 2. A REPAINTED TOOLBAR BUTTON DOES NOT GROW A SECOND TIP
// ================================================================================================
console.log('\n--- a toolbar button repainted after initTips() keeps one tip ---');
{
	// **THE STUB IS TAUGHT ONE THING: BOOTSTRAP MOVES THE TITLE.** That is the whole mechanism.
	// EngCalcs.initTips() hands every `.ec-help[title]` to Bootstrap, which takes the attribute off
	// the element and keeps the text itself -- which is the only reason a styled tip does not
	// arrive with a native one under it. A stub with no Bootstrap made a repaint that writes
	// `title` back indistinguishable from one that does not, which is exactly the quantity the
	// browser varies and the harness held constant.
	// The shared stub ships `EngCalcs.initTips` as a no-op and a Bootstrap whose getInstance()
	// always answers null, which is exactly the constant that made this defect invisible. Both are
	// replaced here with the ONE behaviour that produces it, and nothing more: handing an element
	// to Bootstrap MOVES its `title` attribute onto the instance, and disposing gives it back.
	const instances = new Map();
	const fakeBootstrap = {
		Tooltip: {
			getInstance: function (el) { return instances.get(el) || null; },
			getOrCreateInstance: function (el) {
				let t = instances.get(el);
				if (!t) {
					t = { _title: el.title, dispose: function () { el.title = this._title; instances.delete(el); } };
					el.title = '';              // the removal that stops the browser drawing its own
					instances.set(el, t);
				}
				return t;
			}
		}
	};
	const priorBootstrap = global.bootstrap, priorInit = global.EngCalcs.initTips;
	global.bootstrap = global.window.bootstrap = fakeBootstrap;
	// initTips()'s own selector, and only its selector: `.ec-help[title]`. A button whose title
	// Bootstrap has already taken is not matched again, which is what makes the repaint the only
	// way a second title can appear.
	global.EngCalcs.initTips = function (root) {
		(root.querySelectorAll('.ec-help[title]') || []).forEach(function (el) {
			if (el.title) { fakeBootstrap.Tooltip.getOrCreateInstance(el); }
		});
	};

	const L = loadLoopedNetwork(
		"\t\tsetIconLabel: setIconLabel,\n" +
		"\t\ttoolbarIndex: function () { return toolbarIconIndex; },\n" +
		"\t\tresetToolbarIndex: function () { toolbarIconIndex = []; }"
	);
	const btn = global.document.createElement('button');
	btn.id = '__tipbtn';
	// **THE REAL DOOR, over a parent that can really be queried.** The shared stub's
	// querySelectorAll() answers [] for everything (session handoff §3), so a root handed to
	// initTips() here has to be able to find its own child -- otherwise this section would be
	// asserting that a sweep which visited nothing changed nothing.
	const holder = global.document.createElement('div');
	holder.querySelectorAll = function () { return [btn]; };
	btn.parentNode = holder;

	L.resetToolbarIndex();
	L.setIconLabel(btn, 'select-window', PC.lpn_tool_area_window, 'Click on the map as instructed.');
	ok('the button carries a title before the tips are wired', !!btn.title, JSON.stringify(btn.title));
	ok('...and the .ec-help class that is the only selector initTips() wires',
		btn.className.indexOf('ec-help') >= 0, btn.className);
	global.EngCalcs.initTips(holder);
	ok('...which Bootstrap then takes off it, so the browser draws nothing',
		!btn.title, JSON.stringify(btn.title));

	// THE REPAINT. Only the area-select slot is ever repainted, which is why only that button ever
	// showed two tips -- and why the fix is at the door and not at that call site.
	L.setIconLabel(btn, 'select-lasso', PC.lpn_tool_area_lasso, 'Click on the map as instructed.');
	ok('a repaint does not leave a raw title behind for the browser to draw',
		!btn.title, JSON.stringify(btn.title));
	ok('...and the tip is still armed, so the styled one survives the repaint',
		!!fakeBootstrap.Tooltip.getInstance(btn));
	ok('...carrying the NEW words, not the ones it was built with',
		fakeBootstrap.Tooltip.getInstance(btn)._title.indexOf(PC.lpn_tool_area_lasso) >= 0,
		fakeBootstrap.Tooltip.getInstance(btn)._title);

	// **AND THE HELP LIST DOES NOT GROW.** Help, What the toolbar icons mean is DERIVED from this
	// index; a repaint that pushed a second row listed the area button once per shape change.
	ok('the index holds one row per button, however often it is repainted',
		L.toolbarIndex().length === 1, L.toolbarIndex().length + ' rows');
	ok('...and it is the CURRENT icon and name', L.toolbarIndex()[0].icon === 'select-lasso' &&
		L.toolbarIndex()[0].name === PC.lpn_tool_area_lasso, JSON.stringify(L.toolbarIndex()[0].name));

	// The class list must not grow either: setIconLabel() appends `ec-help`, so a `+=` on a button
	// repainted on every shape change grew it without bound.
	const areaPaint = SRC.slice(SRC.indexOf('function paintAreaButton()'), SRC.indexOf('function paintAreaButton()') + 700);
	ok('the area button tests before it appends its own class',
		/indexOf\('lpn-tool-more'\) < 0/.test(areaPaint));

	// **AND WHERE THE SHIFT SENTENCE IS** (Tom, 2026-09-08: *"I can't find the Shift tip in the
	// browser."*). It has two homes and always had: the selection bubble appends it to whichever
	// instruction the tool is showing, and lpn_tool_area_tip carries the same sentence, so it is
	// also in the tip on the button he was hovering -- the tip the double-title defect above made
	// unreadable. Held as a fact about the two render sites, so a future edit of either cannot
	// quietly leave the Shift rule with nowhere to be read.
	const lang0 = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
	const shift = /\$ec_lang\['lpn_area_hint_shift'\]='([^']*)'/.exec(lang0);
	ok('there is a Shift sentence', !!shift, shift && shift[1]);
	ok('...the selection bubble appends it to every instruction',
		/pc\.lpn_area_hint_shift \|\|/.test(SRC));
	const areaTip = /\$ec_lang\['lpn_tool_area_tip'\]='([^']*)'/.exec(lang0);
	ok('...and the toolbar button\'s own tip states it too, word for word',
		!!areaTip && !!shift && areaTip[1].indexOf(shift[1]) >= 0, areaTip && areaTip[1]);

	global.bootstrap = global.window.bootstrap = priorBootstrap;
	global.EngCalcs.initTips = priorInit;
}

// ================================================================================================
// 3. A NEW TEXT REACHES THE OPEN TABLE, AND CAN BE PICKED UP
// ================================================================================================
console.log('\n--- adding a Text updates the open pane, and puts the tool down ---');
{
	const L = loadLoopedNetwork(
		"\t\tgetDoc: function () { return doc; }, addText: addText, addNode: addNode,\n" +
		"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom,\n" +
		"\t\topenPane: openPane, setPaneTab: setPaneTab, paneIsOpen: paneIsOpen,\n" +
		"\t\twirePane: wirePane,\n" +
		"\t\tpaneTableById: paneTableById,\n" +
		"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
		"\t\ttableCols: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); }"
	);
	L.buildLayers();
	L.seedDefaultInputs();
	L.buildDom();
	L.wirePane();
	L.openPane('text');
	ok('the Text tab is open', L.paneIsOpen() === true);

	// **THE TABLE IS READ AFTER THE ADD AND NOTHING IS RE-RENDERED BY HAND.** A harness that called
	// renderPaneTable() itself would be asserting that the renderer works, which was never in
	// doubt; what was missing was anything CALLING it on this one path.
	const before = L.tableOrder('text');
	const lb = L.addText(40, 40, null);
	const after = L.tableOrder('text');
	ok('the new Text is in the table without changing tabs and back',
		after.length === before.length + 1 && after.indexOf(lb.id) >= 0, after.join(','));

	// The columns Tom could not find. They exist; an ATTACHED Text renders them as plain text
	// rather than as selectors, on his own 2026-08-18 ruling that a leader decides the alignment.
	const cols = L.tableCols('text');
	ok('the Text table has an alignment column', cols.indexOf('align') >= 0, cols.join(','));
	ok('...and a vertical one', cols.indexOf('valign') >= 0, cols.join(','));

	// **THE ADD PATH REFRESHES THE PANE ITSELF**, because it is the one add with no solve behind it.
	const addAt = SRC.indexOf('function addText(');
	// Comments blanked: addText()'s own note NAMES scheduleSolve() to say why it does not call it.
	const add = SRC.slice(addAt, SRC.indexOf('\n\t}', SRC.indexOf('return lb;', addAt)))
		.split('\n').map(function (ln) { return /^\s*\/\//.test(ln) ? '' : ln; }).join('\n');
	ok('addText() refreshes the open pane directly', /refreshPaneIfOpen\(\);/.test(add));
	ok('...rather than borrowing scheduleSolve(), which has nothing here to solve',
		!/scheduleSolve\(\);/.test(add), add.length + ' chars of addText()');

	// **AND THE TOOL PUTS ITSELF DOWN**, which is why a new Text could not be dragged: pointerdown
	// returns before arming any drag while the mode still begins with `add-`.
	const up = SRC.slice(SRC.indexOf("else if (mode === 'add-text')"),
		SRC.indexOf("else if (mode === 'add-text')") + 4200);
	ok('the add-text gesture ends in Select, so the Text just placed is draggable',
		/setMode\('select'\);/.test(up.slice(up.indexOf('addText(w.x, w.y'))));

	// The alignment rows are SUPPRESSED on an attached Text and always were. What was missing is
	// anything on screen saying so, which is why two Texts that look alike offered different rows.
	const popup = SRC.slice(SRC.indexOf('function alignRow(labelText, prop, options, dflt)'),
		SRC.indexOf('function alignRow(labelText, prop, options, dflt)') + 400);
	ok('an attached Text is still offered no alignment rows', /if \(textIsAnchored\(lb\)\) \{ return; \}/.test(popup));
	ok('...and the Attached asset row now carries the tip that says why',
		/lpn_field_text_attached_tip/.test(SRC));
	const lang = fs.readFileSync(path.join(ROOT, 'lib', 'lang.ec.en.php'), 'utf8');
	const m = /\$ec_lang\['lpn_field_text_attached_tip'\]='([^']*)'/.exec(lang);
	ok('...which names the alignment it is explaining', !!m && /alignment/.test(m[1]), m && m[1]);
	const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
	ok('...and the key reaches pageConfig', php.indexOf("$ec_lang['lpn_field_text_attached_tip']") >= 0);
}

console.log('\n' + (failures ? failures + ' FAILED of ' + checks : 'all ' + checks + ' checks passed'));
process.exit(failures ? 1 : 0);

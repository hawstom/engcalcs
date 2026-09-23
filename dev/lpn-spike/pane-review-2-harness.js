// TOM'S 2026-09-21 BROWSER PASS ON THE SPREADSHEET TABLES -- the five findings that came after the
// ones pane-review-harness.js already holds. Run with:
//   node dev/lpn-spike/pane-review-2-harness.js
//
// Each block quotes him and asserts the behaviour through the page's own doors -- a keydown at the
// table, a mousedown, a contextmenu -- rather than by reading the flags under test, which is the
// stub failure dev/testing-notes.md names first.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

global.navigator.clipboard = { writeText: function () { return { then: function () {} }; } };
setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane, spec: paneTableById,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tmode: paneCellMode, focusable: paneCellFocusable,\n" +
	"\t\tscrollTopFor: paneScrollTopFor, clampXY: paneClampXY,\n" +
	"\t\tselectedRefs: selectedRefs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
const PC = global.EngCalcs.pageConfig;

// ---------------------------------------------------------------------------------------------
// 8. ONE SCROLL PARADIGM, AND IT IS WHOLE CELL AT TOP
// ---------------------------------------------------------------------------------------------
// Tom: "What we have seems to be a split opinion, with sometimes whole cell at the top and
// sometimes at the bottom when I am arrowing down; we need to choose and do what we do well; and
// my vote is whole cell at top." And: "the next down movement jumps my cursor to the top of the
// view, which is disorienting."
//
// The arithmetic is asserted directly, because it is the half with a right answer: given where the
// panel is scrolled, how tall the visible band is, how tall the sticky heading is, and where the
// rows begin, there is exactly one place the scroll should come to rest.
console.log('\n--- item 8: one scroll paradigm -- a whole cell at the top ---');
{
	const headH = 20, viewH = 120, rowH = 20;
	// Rows begin under the heading: 20, 40, 60, ... twenty rows.
	const rowTops = [];
	for (let i = 0; i < 20; i++) { rowTops.push(headH + i * rowH); }
	const top = (i) => rowTops[i];
	const bottom = (i) => rowTops[i] + rowH;
	const sc = (cur, i) => L.scrollTopFor(cur, viewH, headH, top(i), bottom(i), rowTops);

	// A cell already fully inside the band does not move the scroll at all.
	report(sc(0, 2) === 0, 'a visible cell scrolls nothing', String(sc(0, 2)));

	// Arrowing DOWN past the last whole visible row. With scrollTop 0 the band is [20,120], so
	// rows 0..4 are whole (row 4 is 100..120). Row 5 is 120..140 and must come into view.
	const down1 = sc(0, 5);
	report(down1 > 0, 'arrowing past the bottom scrolls down', String(down1));
	report(rowTops.indexOf(down1 + headH) >= 0,
		'...and comes to rest on a row boundary, so the top row is a WHOLE row', String(down1));
	report(bottom(5) <= down1 + viewH, '...with the cell the caret is on fully visible');
	report(down1 <= top(5) - headH, '...and not scrolled past its own top edge');

	// THE JUMP HE REPORTED: two more Downs must keep walking by about a row, never leap so far
	// that the cursor lands at the top of the view.
	const down2 = sc(down1, 6), down3 = sc(down2, 7);
	report(down2 > down1 && down3 > down2, 'each further Down moves on', `${down1} ${down2} ${down3}`);
	report(down2 - down1 <= rowH + 0.001 && down3 - down2 <= rowH + 0.001,
		'...by one row and never by a page', `${down2 - down1} / ${down3 - down2}`);
	report(top(6) > down2 + headH && top(7) > down3 + headH,
		'...so the cursor never ends up at the top of the view (his "disorienting" jump)');

	// Arrowing UP is the SAME invariant read the other way: the cell becomes the first whole row.
	const up = sc(down3, 1);
	report(up === top(1) - headH, 'arrowing above the fold puts that cell flush under the heading',
		String(up));
	report(rowTops.indexOf(up + headH) >= 0, '...which is a row boundary too, as going down was');
	report(L.scrollTopFor(60, viewH, headH, top(0), bottom(0), rowTops) === 0,
		'the first row cannot scroll to a negative offset');

	// **THE BAND IS RARELY A WHOLE NUMBER OF ROWS, and that is where the two paradigms part.**
	// A panel 110 px tall shows five and a half rows. The old rule scrolled the target cell's
	// BOTTOM flush with the floor, which leaves half a row clipped under the heading -- his split
	// opinion. Whole-cell-at-top rounds on to the next row boundary instead, so the top of the
	// band is always a row's own top edge.
	const ragged = 110;
	const got = L.scrollTopFor(0, ragged, headH, top(5), bottom(5), rowTops);
	report(got === top(2) - headH, 'a band that is not a whole number of rows still rests on a row',
		`${got} (bottom-flush would be ${bottom(5) - ragged})`);
	report(got !== bottom(5) - ragged, '...and that is NOT the bottom-flush answer we used to give',
		`${got} vs ${bottom(5) - ragged}`);
	report(rowTops.indexOf(got + headH) >= 0, '...so a whole cell sits under the heading');
	report(bottom(5) <= got + ragged, '...with the caret’s own cell still wholly visible');
}

// ---------------------------------------------------------------------------------------------
// 7. THE RIGHT-CLICK MENU STAYS ON THE SCREEN
// ---------------------------------------------------------------------------------------------
console.log('\n--- item 7: the right-click menu is clamped inside the window ---');
{
	// Tom: "When I right-click on a cell near the bottom of the screen, the right-click menu goes
	// off the bottom of the screen. Oops. Fix that."
	const vw = 1000, vh = 800, w = 160, h = 130;
	let at = L.clampXY(500, 400, w, h, vw, vh);
	report(at.x === 500 && at.y === 400, 'a menu with room stays exactly at the pointer',
		JSON.stringify(at));
	at = L.clampXY(500, 760, w, h, vw, vh);
	report(at.y === 760 - h, 'near the bottom it FLIPS above the pointer, not merely slides up',
		JSON.stringify(at));
	report(at.y + h <= vh, '...and is wholly on screen');
	at = L.clampXY(960, 400, w, h, vw, vh);
	report(at.x === 960 - w && at.x + w <= vw, 'near the right edge it flips to the other side',
		JSON.stringify(at));
	at = L.clampXY(960, 760, w, h, vw, vh);
	report(at.x + w <= vw && at.y + h <= vh, 'in the corner it flips on both axes', JSON.stringify(at));
	// Taller than the window: there is no side to flip to, so it clamps and stays visible at the top.
	at = L.clampXY(300, 700, w, 900, vw, vh);
	report(at.y >= 0 && at.y <= 4, 'a menu taller than the window clamps rather than flipping',
		JSON.stringify(at));
}

// ---------------------------------------------------------------------------------------------
// THE TABLE ITSELF -- built once, used by the blocks below
// ---------------------------------------------------------------------------------------------
const j = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)];
const ids = j.map((n) => n.id);
const pipe = L.addLink('pipe', ids[0], ids[1]);
L.openPane('junctions');
L.renderTable('junctions');
const spec = L.spec('junctions');
const tableEl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];
const cols = L.tableCols('junctions');
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function cell(tab, elId, k) { return L.cells(tab)[elId][k]; }
function td(tab, elId, k) { return L.tds(tab)[elId][k]; }

// ---------------------------------------------------------------------------------------------
// 5. THE ARROWS DO NOT GET STUCK AT A PULL-DOWN
// ---------------------------------------------------------------------------------------------
console.log('\n--- item 5: left and right arrows get stuck at selectors ---');
// A pull-down lives in the tanks table (the mixing model), not in junctions -- so this block and
// the one after it work that table. The finding is about the CONTROL, not about which table it
// happens to sit in.
const tank = L.addNode('tank', 40, 0);
L.openPane('tanks');
L.renderTable('tanks');
const tankTable = byId.lpn_pane_tanks.children.filter((c) => c._tag === 'table')[0];
const tCols = L.tableCols('tanks');
const choiceIdx = tCols.findIndex((c) => c.choices);
{
	// Tom: "Left and right arrows get stuck at selectors unless I first skip over them with Ctrl;
	// interesting."
	//
	// The cause is one omission with a silent symptom. paneCellFocusable() answered the <td> for a
	// choice cell because it looked for INPUT and BUTTON and not SELECT -- and that <td> is given
	// no tabIndex, so focus() on it does nothing and the caret is left on document.body, OUTSIDE
	// the table. The table's own keydown listener then never hears another key.
	report(choiceIdx > 0, 'the tanks table has a pull-down column, and not as its first',
		choiceIdx >= 0 ? tCols[choiceIdx].key : 'none');
	const k = tCols[choiceIdx].key;
	const control = cell('tanks', tank.id, k);
	report(control && control._tag === 'select', 'and its cell holds a <select>', control && control._tag);
	const f = L.focusable(td('tanks', tank.id, k));
	report(f === control, 'the caret goes to the pull-down itself, not to the cell around it',
		f === control ? 'select' : (f && f._tag));
	report(L.mode(control) === 'ready',
		'a pull-down reports a mode instead of falling off the end of the mode machinery',
		String(L.mode(control)));

	// Now the gesture: land on the pull-down with a Right arrow, then press Right again. The
	// caret must move on, and must still be inside the table so the NEXT key is heard.
	const before = tCols[choiceIdx - 1].key;
	global.document.activeElement = null;
	fire(tankTable, 'focusin', { target: td('tanks', tank.id, before) });
	global.document.activeElement = cell('tanks', tank.id, before);
	function arrow(dir) {
		fire(tankTable, 'keydown', { key: dir, shiftKey: false, ctrlKey: false, metaKey: false,
			altKey: false, preventDefault: function () {} });
	}
	arrow('ArrowRight');
	const b1 = L.selBox('tanks');
	report(tCols[b1.fc].key === k, 'one Right lands on the pull-down', tCols[b1.fc].key);
	report(global.document.activeElement === control,
		'...and the caret really is in it, not adrift on the document body');
	arrow('ArrowRight');
	const b2 = L.selBox('tanks');
	report(b2.fc === b1.fc + 1, 'a second Right leaves it -- no Ctrl required', String(b2.fc - b1.fc));
	arrow('ArrowLeft');
	report(L.selBox('tanks').fc === b1.fc, 'and Left comes back onto it');
	arrow('ArrowLeft');
	report(L.selBox('tanks').fc === b1.fc - 1, '...and Left again leaves it the other way');
	// A pull-down is not a box to empty: Delete on one must do nothing rather than try to write a
	// blank into a control that can only hold one of the options it offers.
	fire(tankTable, 'focusin', { target: td('tanks', tank.id, k) });
	global.document.activeElement = control;
	let delPrevented = 0;
	fire(tankTable, 'keydown', { key: 'Delete', shiftKey: false, ctrlKey: false, metaKey: false,
		altKey: false, preventDefault: function () { delPrevented++; } });
	report(delPrevented === 0, 'Delete on a pull-down is not a command this table claims',
		String(delPrevented));
}

console.log('\n--- item 5: a press on a pull-down still opens it ---');
{
	// The R-038 fix calls preventDefault() on every plain press so a browser cannot arm its own
	// drag-selection of the CHARACTERS in a text box. A <select> has no characters to drag over,
	// and preventing its mousedown stops the list from opening at all -- so the press on a
	// pull-down or a checkbox must stay the browser's.
	const k = tCols[choiceIdx].key;
	let prevented = 0;
	fire(tankTable, 'mousedown', { target: td('tanks', tank.id, k), button: 0, shiftKey: false,
		preventDefault: function () { prevented++; } });
	report(prevented === 0, 'a plain press on a pull-down is left to the browser', String(prevented));
	fire(tankTable, 'mouseup', {});

	const bools = tCols.filter((c) => c.bool);
	if (bools.length) {
		prevented = 0;
		fire(tankTable, 'mousedown', { target: td('tanks', tank.id, bools[0].key), button: 0,
			shiftKey: false, preventDefault: function () { prevented++; } });
		report(prevented === 0, 'and so is a press on a checkbox, or it could never be ticked',
			String(prevented));
		fire(tankTable, 'mouseup', {});
	}
	// A text cell is the case the fix was written for and must still be prevented.
	prevented = 0;
	fire(tableEl, 'mousedown', { target: td('junctions', ids[0], 'elev'), button: 0,
		shiftKey: false, preventDefault: function () { prevented++; } });
	report(prevented === 1, 'a press on a typed cell still blocks the browser\u2019s text selection',
		String(prevented));
	fire(tableEl, 'mouseup', {});
}

console.log('\n--- item 5: but a cell BEING TYPED IN keeps its own mouse ---');
{
	// Perry's pre-review, 2026-09-21. The block that stops a browser highlighting characters in a
	// cell nobody is typing in must not reach INSIDE the one cell that is being typed in: there
	// the characters are the user's, and the mouse is how the caret gets to them. Blocking it left
	// the caret wherever Edit mode had put it, with only Home, End and the arrows able to move it.
	//
	// **THIS IS THE CASE THE FIRST VERSION OF THIS HARNESS NEVER CONSTRUCTED** -- every press it
	// fired was in READY mode, so the exemption it was really testing was "not while editing" and
	// it never once entered Edit mode to find out.
	const c = cell('junctions', ids[0], 'elev');
	const cTd = td('junctions', ids[0], 'elev');
	// Edit mode through its own door -- a real double-click, not by writing the flag.
	fire(tableEl, 'focusin', { target: cTd });
	global.document.activeElement = c;
	fire(c, 'dblclick', {});
	report(L.mode(c) === 'edit', 'a double-click really did open the cell for editing', String(L.mode(c)));

	let prevented = 0, refocused = 0;
	const realFocus = c.focus;
	c.focus = function () { refocused++; if (realFocus) { realFocus.call(c); } };
	fire(tableEl, 'mousedown', { target: cTd, button: 0, shiftKey: false,
		preventDefault: function () { prevented++; } });
	report(prevented === 0, 'a press inside the cell being typed in is left to the browser',
		String(prevented));
	report(refocused === 0, '...and it is not re-focused, which would put the caret back',
		String(refocused));
	// Dragging across part of the value must select the CHARACTERS, not start a cell range --
	// so the press must not have armed the drag either. Dragged onto the NEXT ROW, because a
	// drag that ends on the cell it began on leaves a one-cell rectangle whether it was armed
	// or not, which is a test that cannot fail.
	fire(tableEl, 'mouseover', { target: td('junctions', ids[1], 'elev'), buttons: 1,
		preventDefault: function () {} });
	const dragBox = L.selBox('junctions');
	report(dragBox.r1 === dragBox.r0 && dragBox.c1 === dragBox.c0,
		'...and dragging out of it does not start extending a cell range',
		(dragBox.r1 - dragBox.r0 + 1) + 'x' + (dragBox.c1 - dragBox.c0 + 1));
	fire(tableEl, 'mouseup', {});
	c.focus = realFocus;

	// A press on a DIFFERENT cell while this one is being edited is an ordinary move, and the
	// block must be back on for it -- otherwise the fix above would trade one defect for R-038.
	prevented = 0;
	fire(tableEl, 'mousedown', { target: td('junctions', ids[1], 'elev'), button: 0,
		shiftKey: false, preventDefault: function () { prevented++; } });
	report(prevented === 1, 'a press on another cell while one is being edited still blocks',
		String(prevented));
	fire(tableEl, 'mouseup', {});
	// Leave the table in READY mode for whatever runs after this block.
	fire(tableEl, 'keydown', { key: 'Escape', shiftKey: false, ctrlKey: false, metaKey: false,
		altKey: false, preventDefault: function () {} });
}

// ---------------------------------------------------------------------------------------------
// 6(a). THE PIN SHARES THE ID'S LINE
// ---------------------------------------------------------------------------------------------
console.log('\n--- item 6(a): the pin is on the ID’s own line ---');
{
	// Tom: "We have a gratuitous space waster at ID where the goto map icon (nice unsolicited
	// touch!) is a line break below the ID number. Put on same line."
	const idTd = td('junctions', ids[0], 'id');
	report(String(idTd['class'] || '').indexOf('lpn-pane-idcell') >= 0,
		'the ID cell says which cell it is', String(idTd['class']));
	const css = require('fs').readFileSync('css/engcalcs.css', 'utf8');
	report(/td\.lpn-pane-idcell\s*\{[^}]*white-space:\s*nowrap/.test(css),
		'...and the stylesheet keeps its two controls on one line');
	// The pin must still be the SECOND control, or the caret would land on it instead of the box.
	const kids = idTd.children.map((c) => c._tag);
	report(kids[0] === 'input' && kids[kids.length - 1] === 'button',
		'the box comes first and the pin after it, so the caret lands in the box', kids.join(','));
}

// ---------------------------------------------------------------------------------------------
// 6(c). A SUPPORT COLUMN SHOWS THE ASSET IT NAMES
// ---------------------------------------------------------------------------------------------
console.log('\n--- item 6(c): right-click on From or To shows THAT asset ---');
{
	// Tom: "an interesting possibility that when we right-click on a support column (like From and
	// To) that contains an asset, we can Show on map that asset instead of the row's asset."
	L.openPane('pipes');
	L.renderTable('pipes');
	const pipeTable = byId.lpn_pane_pipes.children.filter((c) => c._tag === 'table')[0];
	function menuEl() {
		return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
	}
	function rightClick(k) {
		const cellTd = td('pipes', pipe.id, k);
		fire(pipeTable, 'mousedown', { target: cellTd, button: 2, shiftKey: false,
			preventDefault: function () {} });
		fire(pipeTable, 'focusin', { target: cellTd });
		fire(pipeTable, 'mouseup', {});
		fire(pipeTable, 'contextmenu', { target: cellTd, clientX: 10, clientY: 20,
			preventDefault: function () {} });
		return menuEl();
	}
	// The ID column: the row's own element, which is what it has always done.
	let menu = rightClick('id');
	report(!!menu, 'the menu opens on the pipes table');
	fire(menu.children[2], 'click', {});
	let refs = L.selectedRefs();
	report(refs.length === 1 && refs[0].kind === 'link' && refs[0].id === pipe.id,
		'Select in map on the ID column still selects the row’s own asset', JSON.stringify(refs));

	// The From column: the node that end lands on.
	menu = rightClick('from');
	fire(menu.children[2], 'click', {});
	refs = L.selectedRefs();
	report(refs.length === 1 && refs[0].kind === 'node' && refs[0].id === ids[0],
		'Select in map on From selects the node at that end', JSON.stringify(refs));

	// The To column: the other one.
	menu = rightClick('to');
	fire(menu.children[2], 'click', {});
	refs = L.selectedRefs();
	report(refs.length === 1 && refs[0].kind === 'node' && refs[0].id === ids[1],
		'Select in map on To selects the node at the other end', JSON.stringify(refs));

	// A support column whose value is a NUMBER, not an asset, falls back to the row.
	menu = rightClick('length');
	if (menu) {
		fire(menu.children[2], 'click', {});
		refs = L.selectedRefs();
		report(refs.length === 1 && refs[0].kind === 'link' && refs[0].id === pipe.id,
			'an ordinary column still means the row’s own asset', JSON.stringify(refs));
	}
}

console.log('\n--- item 7: the opened menu itself is placed on screen ---');
{
	// The same clamp, through the real door: a right-click 40 px above a short window.
	L.openPane('junctions');
	L.renderTable('junctions');
	const tbl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];
	const wasH = global.window.innerHeight;
	global.window.innerHeight = 300;   // the stub's default menu box is 500 tall
	const cellTd = td('junctions', ids[0], 'elev');
	// A left press first, so there is a selection for the menu to be about.
	fire(tbl, 'mousedown', { target: cellTd, button: 0, shiftKey: false, preventDefault: function () {} });
	fire(tbl, 'focusin', { target: cellTd });
	fire(tbl, 'mouseup', {});
	fire(tbl, 'mousedown', { target: cellTd, button: 2, shiftKey: false, preventDefault: function () {} });
	fire(tbl, 'mouseup', {});
	fire(tbl, 'contextmenu', { target: cellTd, clientX: 20, clientY: 280, preventDefault: function () {} });
	const menu = global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
	report(!!menu, 'the menu opened');
	report(parseFloat(menu.style.top) < 280,
		'a menu opened near the bottom is moved up off the edge', menu.style.top);
	report(parseFloat(menu.style.top) >= 0, '...and not off the top instead', menu.style.top);
	global.window.innerHeight = wasH;
}

// ---------------------------------------------------------------------------------------------
// 9. AN INACTIVE TAB LOOKS LIKE A TAB
// ---------------------------------------------------------------------------------------------
console.log('\n--- item 9: an inactive tab says it is one ---');
{
	// Tom: "Currently, all the non-active tables are undecorated plain text, which doesn't really
	// say 'I'm an inactive tab.'" Asserted against the stylesheet, which is where the answer is.
	const css = require('fs').readFileSync('css/engcalcs.css', 'utf8');
	const rest = (css.match(/\n\.lpn-pane-tab \{([^}]*)\}/) || [])[1] || '';
	report(/background:\s*#[0-9a-f]{3,6}/i.test(rest),
		'an inactive tab has a ground of its own, not `none`', rest.replace(/\s+/g, ' ').trim());
	report(/border:\s*1px solid #[0-9a-f]{3,6}/i.test(rest),
		'...and a visible edge, not a transparent one');
	report(/border-radius/.test(rest), '...with the top corners rounded, which is what says "tab"');
	report(/border-bottom:\s*0/.test(rest),
		'...and no bottom border, so the selected one alone joins the panel');
	const on = (css.match(/\.lpn-pane-tab\[aria-selected="true"\] \{([^}]*)\}/) || [])[1] || '';
	report(/background:\s*#fff/i.test(on) && /font-weight:\s*bold/.test(on),
		'the selected tab keeps the whole of its distinction', on.replace(/\s+/g, ' ').trim());
	report(/#f0f0f0/.test(rest) && !/#f0f0f0/.test(on),
		'...and it is not the same ground as the ones behind it');
}

console.log(`\n${failures ? `${failures} FAILED of ${checks}` : `all pass: ${checks}/${checks}`}`);
process.exit(failures ? 1 : 0);

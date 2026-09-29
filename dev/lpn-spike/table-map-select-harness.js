// THE TABLES' RIGHT-CLICK MENU SELECTS AND UNSELECTS ON THE MAP -- Tom, 2026-09-28: *"In Table, we
// need a right-click option to Select (unselect) on map. Maybe we could just have Select (and zoom)
// that zooms only if there is a single selected. But it may be better to have separate commands."*
// Run with:
//   node dev/lpn-spike/table-map-select-harness.js
//
// Separate commands, driven through the table's own mousedown and contextmenu: Select on map ADDS
// the rows to the map selection, Unselect on map takes them out, Zoom & select adds and moves the
// view; none of them replaces a selection. Each is offered only when it would do something. And the
// menu is keyboard-reachable: the Menu key or Shift+F10 opens it with the first item focused,
// Up/Down walk it, Escape closes it and gives the caret back.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const S = require('./selset-fixture.js');
const { L, ids, fire, tableEl, td, cell, click, rightClick, menuLabels, menuItem, menuEl, ok, done, refs, PC } = S;
// Shift+Down: how the table extends a range from the keyboard (a Shift+click is the mouse's way).
function extendDown(n) {
	for (let i = 0; i < n; i++) {
		fire(tableEl, 'keydown', { key: 'ArrowDown', shiftKey: true, ctrlKey: false, metaKey: false, altKey: false,
			target: global.document.activeElement, preventDefault: function () {} });
	}
}

console.log('--- one row, nothing selected ---');
L.clearSel();
let m = rightClick(ids[1], 'elev');
let labels = menuLabels(m);
ok('Select on map is offered', labels.indexOf(PC.lpn_pane_select_on_map) >= 0, labels.join(' | '));
ok('Unselect on map is not (nothing to unselect)', labels.indexOf(PC.lpn_pane_unselect_on_map) < 0);
ok('Zoom & select is offered, in its ruled words', labels.indexOf(PC.lpn_pane_goto_tip) >= 0);
fire(menuItem(m, PC.lpn_pane_select_on_map), 'click', {});
ok('Select on map selects the row\'s junction', JSON.stringify(L.selectedRefs()) === refs([ids[1]]), JSON.stringify(L.selectedRefs()));
ok('...and closes the menu', !menuEl());

console.log('\n--- it ADDS; it never replaces ---');
m = rightClick(ids[3], 'elev');
fire(menuItem(m, PC.lpn_pane_select_on_map), 'click', {});
ok('a second Select on map adds to the first', JSON.stringify(L.selectedRefs()) === refs([ids[1], ids[3]]), JSON.stringify(L.selectedRefs()));
m = rightClick(ids[3], 'elev');
labels = menuLabels(m);
ok('on a selected row, Unselect on map is offered and Select on map is not',
	labels.indexOf(PC.lpn_pane_unselect_on_map) >= 0 && labels.indexOf(PC.lpn_pane_select_on_map) < 0, labels.join(' | '));
fire(menuItem(m, PC.lpn_pane_unselect_on_map), 'click', {});
ok('Unselect on map takes out that one and leaves the rest', JSON.stringify(L.selectedRefs()) === refs([ids[1]]), JSON.stringify(L.selectedRefs()));

console.log('\n--- a range of rows ---');
click(ids[0], 'elev');
extendDown(2);
m = rightClick(ids[2], 'elev');
labels = menuLabels(m);
ok('a range holding selected and unselected rows offers both', labels.indexOf(PC.lpn_pane_select_on_map) >= 0 &&
	labels.indexOf(PC.lpn_pane_unselect_on_map) >= 0, labels.join(' | '));
fire(menuItem(m, PC.lpn_pane_select_on_map), 'click', {});
ok('Select on map adds every row of the range, keeping what was there', JSON.stringify(L.selectedRefs()) === refs([ids[1], ids[0], ids[2]]),
	JSON.stringify(L.selectedRefs()));
m = rightClick(ids[2], 'elev');
fire(menuItem(m, PC.lpn_pane_unselect_on_map), 'click', {});
ok('Unselect on map over the range empties it', L.selectedRefs().length === 0, JSON.stringify(L.selectedRefs()));

console.log('\n--- Zoom & select ---');
L.setSelectionList([{ kind: 'node', id: ids[3] }]);
L.setView({ cx: 5000, cy: 5000, s: 0.01 });
click(ids[0], 'elev');
m = rightClick(ids[0], 'elev');
fire(menuItem(m, PC.lpn_pane_goto_tip), 'click', {});
ok('Zoom & select adds the row to the selection', JSON.stringify(L.selectedRefs()) === refs([ids[3], ids[0]]), JSON.stringify(L.selectedRefs()));
let v = L.view();
ok('...and goes there', Math.abs(v.cx - 0) < 1 && Math.abs(v.cy - 0) < 1 && v.s > 0.01, JSON.stringify(v));
click(ids[1], 'elev');
extendDown(2);
L.setView({ cx: 5000, cy: 5000, s: 0.01 });
m = rightClick(ids[3], 'elev');
fire(menuItem(m, PC.lpn_pane_goto_tip), 'click', {});
v = L.view();
ok('over several rows it fits them all (centred between the first and last)', Math.abs(v.cx - 200) < 1 && v.s > 0.01, JSON.stringify(v));

console.log('\n--- from the keyboard ---');
L.clearSel();
click(ids[2], 'elev');
const kd = { key: 'ContextMenu', target: cell(ids[2], 'elev'), shiftKey: false, preventDefault: function () { this.p = true; } };
fire(tableEl, 'keydown', kd);
m = menuEl();
ok('the Menu key opens the menu', !!m && kd.p === true);
ok('...with its first item focused', !!m && global.document.activeElement === m.children[0]);
fire(tableEl, 'contextmenu', { target: td(ids[2], 'elev'), button: 0, preventDefault: function () {} });
ok('the browser\'s own contextmenu for that key does not open a second menu', menuEl() === m);
fire(m, 'keydown', { key: 'ArrowDown', preventDefault: function () {}, stopPropagation: function () {} });
ok('Down moves to the next item', global.document.activeElement === m.children[1]);
fire(m, 'keydown', { key: 'ArrowUp', preventDefault: function () {}, stopPropagation: function () {} });
fire(m, 'keydown', { key: 'ArrowUp', preventDefault: function () {}, stopPropagation: function () {} });
ok('Up from the first wraps to the last', global.document.activeElement === m.children[m.children.length - 1]);
fire(m, 'keydown', { key: 'Escape', preventDefault: function () {}, stopPropagation: function () {} });
ok('Escape closes it', !menuEl());
ok('...and the caret is back in the cell', global.document.activeElement === cell(ids[2], 'elev'));
const sf = { key: 'F10', shiftKey: true, target: cell(ids[2], 'elev'), preventDefault: function () {} };
fire(tableEl, 'keydown', sf);
m = menuEl();
ok('Shift+F10 opens it too', !!m);
const selItem = menuItem(m, PC.lpn_pane_select_on_map);
fire(selItem, 'click', {});
ok('and Select on map, chosen from the keyboard, selects the row', JSON.stringify(L.selectedRefs()) === refs([ids[2]]), JSON.stringify(L.selectedRefs()));

done('Table map-select harness');

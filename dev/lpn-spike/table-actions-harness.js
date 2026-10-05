// THE TABLES' RIGHT-CLICK MENU OPENS PROPERTIES AND CAN DELETE THE ELEMENT -- Tom, 2026-10-05:
// (a) *"Table Select on map or Zoom and select should open Properties for those elements."*
// (b) *"Table delete needs to delete the element ... or there needs to be a separate Delete
// element menu item."*
// Run with:
//   node dev/lpn-spike/table-actions-harness.js
//
// Select on map and Zoom & select leave the Properties box open on the whole selection (the
// multi box for several); Delete element / Delete elements removes the rows' own elements through
// the map's deleteElement(), in one Undo-able step per element, and plain Delete still only clears
// values.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const S = require('./selset-fixture.js');
const { L, ids, fire, tableEl, td, cell, click, rightClick, menuLabels, menuItem, menuEl, ok, done, refs, PC } = S;
const { ensure } = require('./lpn-dom-stub.js');
ensure('lpn_popup'); ensure('lpn_popup_fields'); ensure('lpn_popup_title');
const title = () => global.document.getElementById('lpn_popup_title').textContent;
// The single-element box titles itself from the element; the multi box says "{n} selected".
const single = () => title() !== '' && title().indexOf('selected') < 0;
function extendDown(n) {
	for (let i = 0; i < n; i++) {
		fire(tableEl, 'keydown', { key: 'ArrowDown', shiftKey: true, ctrlKey: false, metaKey: false, altKey: false,
			target: global.document.activeElement, preventDefault: function () {} });
	}
}

console.log('--- Select on map opens Properties ---');
L.clearSel();
let m = rightClick(ids[1], 'elev');
fire(menuItem(m, PC.lpn_pane_select_on_map), 'click', {});
ok('one row selected', JSON.stringify(L.selectedRefs()) === refs([ids[1]]));
ok('Properties is open on that junction (the single box)', single(), title());

L.clearSel();
click(ids[0], 'elev');
extendDown(2);
m = rightClick(ids[2], 'elev');
fire(menuItem(m, PC.lpn_pane_select_on_map), 'click', {});
ok('three rows selected', L.selectedRefs().length === 3);
ok('Properties shows the multi-selection', title() === String(PC.lpn_multi_title || '{n} selected').replace('{n}', '3'), title());

console.log('\n--- Zoom & select opens Properties ---');
L.clearSel();
click(ids[3], 'elev');
m = rightClick(ids[3], 'elev');
fire(menuItem(m, PC.lpn_pane_goto_tip), 'click', {});
ok('Zoom & select on one row opens that junction', single(), title());
click(ids[0], 'elev');
extendDown(1);
m = rightClick(ids[1], 'elev');
fire(menuItem(m, PC.lpn_pane_goto_tip), 'click', {});
ok('Zoom & select on two more shows the multi box', title() === String(PC.lpn_multi_title || '{n} selected').replace('{n}', '3'), title());

console.log('\n--- Delete still only clears values ---');
L.clearSel();
const before = L.tableOrder('junctions').length;
m = rightClick(ids[3], 'elev');
ok('Delete element is offered, singular for one row', menuLabels(m).indexOf(PC.lpn_pane_delete_element) >= 0, menuLabels(m).join(' | '));
ok('...and not the plural', menuLabels(m).indexOf(PC.lpn_pane_delete_elements) < 0);
fire(menuItem(m, PC.lpn_tool_delete), 'click', {});
ok('plain Delete keeps the row', L.tableOrder('junctions').length === before);

console.log('\n--- Delete element removes the element ---');
const pipesBefore = L.getDoc().links.length;
m = rightClick(ids[3], 'elev');
fire(menuItem(m, PC.lpn_pane_delete_element), 'click', {});
ok('the junction is gone from the document', !L.getDoc().nodes.some((n) => n.id === ids[3]));
ok('its pipe went with it (the map\'s cascade)', L.getDoc().links.length === pipesBefore - 1);
L.renderTable('junctions');
ok('and from the table', L.tableOrder('junctions').indexOf(ids[3]) < 0);

console.log('\n--- several rows ---');
click(ids[0], 'elev');
extendDown(1);
m = rightClick(ids[1], 'elev');
ok('plural label over a range', menuLabels(m).indexOf(PC.lpn_pane_delete_elements) >= 0, menuLabels(m).join(' | '));
fire(menuItem(m, PC.lpn_pane_delete_elements), 'click', {});
ok('both rows\' junctions are gone', !L.getDoc().nodes.some((n) => n.id === ids[0] || n.id === ids[1]));
ok('the survivor is untouched', L.getDoc().nodes.some((n) => n.id === ids[2]));

done('Table actions harness');

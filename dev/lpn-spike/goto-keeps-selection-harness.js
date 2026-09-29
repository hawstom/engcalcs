// BUILDING A SELECTION SET FROM TABLES AND FIND -- Tom, 2026-09-28: *"Trying to build a selection set
// for fire flow, I am having a hard time unselecting certain Junctions. (1) In Tables, if I go to a
// Junction, it selects it, destroying my selection set. (2) In Find, if I go to a Junction, it
// selects it, destroying my selection set. ... (4) I tried holding down Shift while clicking on Find
// results. Maybe we can do that. (5) Maybe in Tables we can have a heavy bar/border at the start of
// the row if the asset is selected on the map."* Run with:
//   node dev/lpn-spike/goto-keeps-selection-harness.js
//
// (1)(2) Going to an element -- the Tables pin, a Find row -- never replaces a selection: with one
//        standing, the element gone to wears the go-to mark instead; with none, it is selected, as
//        it always was. Any change of selection retires the mark.
// (4)    Shift+click and Ctrl+click on a Find row put it in the selection or take it out.
// (5)    A Tables row whose element is selected on the map carries `lpn-mapsel` (the bar), live,
//        whichever door changed the selection; the Find list's rows carry it too.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const S = require('./selset-fixture.js');
const { L, ids, fire, pin, rowBar, findRows, ok, done, refs, PC } = S;
const set2 = [{ kind: 'node', id: ids[0] }, { kind: 'node', id: ids[3] }];

console.log('--- (1) the Tables pin ---');
// Read off aria-label: initTipsIn() moves a `title` into the page's own tip.
const pinName = pin(ids[1]).getAttribute('aria-label');
ok('the pin says Go to on map', pinName === PC.lpn_goto_on_map + ' ' + ids[1], pinName);
L.clearSel();
fire(pin(ids[1]), 'click', {});
ok('with nothing selected, the pin selects its junction, as before', JSON.stringify(L.selectedRefs()) === refs([ids[1]]),
	JSON.stringify(L.selectedRefs()));
L.setSelectionList(set2);
fire(pin(ids[1]), 'click', {});
ok('with a set standing, the pin leaves the set exactly as it was', JSON.stringify(L.selectedRefs()) === refs([ids[0], ids[3]]),
	JSON.stringify(L.selectedRefs()));
ok('...and marks the junction it went to', JSON.stringify(L.locatedRef()) === JSON.stringify({ kind: 'node', id: ids[1] }) &&
	L.nodeClass(ids[1]).indexOf('lpn-located') >= 0, L.nodeClass(ids[1]));
fire(pin(ids[2]), 'click', {});
ok('a second go-to moves the mark', L.nodeClass(ids[2]).indexOf('lpn-located') >= 0 && L.nodeClass(ids[1]).indexOf('lpn-located') < 0);
L.toggle('node', ids[1]);
ok('any change of selection retires the mark', L.locatedRef() === null && L.nodeClass(ids[2]).indexOf('lpn-located') < 0);

console.log('\n--- (5) the bar on a Tables row ---');
L.setSelectionList(set2);
ok('rows whose junction is selected carry the bar', rowBar(ids[0]) && rowBar(ids[3]));
ok('rows whose junction is not, do not', !rowBar(ids[1]) && !rowBar(ids[2]));
L.toggle('node', ids[2]);
ok('it follows a selection made anywhere, live', rowBar(ids[2]));
L.toggle('node', ids[0]);
ok('...and leaves with it', !rowBar(ids[0]));
L.spec('junctions').sig = null;
L.renderTable('junctions');
ok('a rebuilt table draws the bars again', rowBar(ids[2]) && rowBar(ids[3]) && !rowBar(ids[0]) && !rowBar(ids[1]));

console.log('\n--- (2) and (4) Find ---');
L.setSelectionList(set2);
L.buildPanel();
L.setState('junction', 'id', 'contains', '');
L.pressFind();
let rows = findRows();
const rowOf = (id) => rows.filter((r) => r._lpnFindRef.id === id)[0];
const box = L.resultsBox();
let hint = null;
(function walk(e) { (e.children || []).forEach((k) => { if (String(k['class'] || k.className || '') === 'lpn-find-hint') { hint = k; } walk(k); }); })(box);
ok('the list says Shift+click works', !!hint && hint.textContent === PC.lpn_find_shift_hint, hint && hint.textContent);
ok('Find rows of selected junctions carry the bar', rowOf(ids[0]).classList.contains('lpn-mapsel') && !rowOf(ids[1]).classList.contains('lpn-mapsel'));
fire(rowOf(ids[1]), 'click', {});
ok('a plain click goes there and leaves the set alone', JSON.stringify(L.selectedRefs()) === refs([ids[0], ids[3]]) &&
	JSON.stringify(L.locatedRef()) === JSON.stringify({ kind: 'node', id: ids[1] }), JSON.stringify([L.selectedRefs(), L.locatedRef()]));
fire(rowOf(ids[1]), 'click', { shiftKey: true, preventDefault: function () {} });
ok('Shift+click adds it to the set', JSON.stringify(L.selectedRefs()) === refs([ids[0], ids[3], ids[1]]), JSON.stringify(L.selectedRefs()));
ok('...and its row, and its Tables row, carry the bar at once', rowOf(ids[1]).classList.contains('lpn-mapsel') && rowBar(ids[1]));
fire(rowOf(ids[0]), 'click', { ctrlKey: true, preventDefault: function () {} });
ok('Ctrl+click takes one out', JSON.stringify(L.selectedRefs()) === refs([ids[3], ids[1]]), JSON.stringify(L.selectedRefs()));
ok('...and the bar leaves both lists', !rowOf(ids[0]).classList.contains('lpn-mapsel') && !rowBar(ids[0]));
fire(rowOf(ids[3]), 'click', { shiftKey: true, preventDefault: function () {} });
ok('Shift+click on a selected one takes it out too', JSON.stringify(L.selectedRefs()) === refs([ids[1]]), JSON.stringify(L.selectedRefs()));

done('Go-to keeps selection harness');

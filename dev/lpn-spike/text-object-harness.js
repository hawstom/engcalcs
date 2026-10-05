// A TEXT OBJECT'S DELETE, DETACH AND DESCRIPTION -- Tom, 2026-10-05. Run with:
//   node dev/lpn-spike/text-object-harness.js
//
//   1. *"Text table doesn't update when a text element is deleted."* A Text schedules no solve, so
//      the open pane was never told. Read the table's rows after a real delete, nothing re-rendered
//      by hand; and the removal must reach the saved project, which was the same missing line.
//   2. *"Text that is attached to an asset needs to be able to be detached, at least by deleting the
//      attachment in Table or Properties."* Clearing the Anchor cell, or the Properties box, frees
//      the Text where it is drawn; Undo re-attaches it.
//   3. *"Add a Description property. As usual, not overridable."* Properties row, Text-table
//      column, saved in the project, never in a scenario's overrides. [LABELS] has no comment slot
//      that EPANET reads, so the .inp carries none and the round trip is unchanged.
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');
const path = require('path');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addText: addText, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom,\n" +
	"\t\topenPane: openPane, wirePane: wirePane,\n" +
	"\t\tpaneTableById: paneTableById, paneColByKey: paneColByKey, paneCellText: paneCellText,\n" +
	"\t\tpaneWriteCellText: paneWriteCellText,\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tdeleteElement: deleteElement, undo: undo, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tlabelById: labelById, labelEls: function () { return labelEls; },\n" +
	"\t\tlabelsByAnchor: function () { return labelsByAnchor; },\n" +
	"\t\ttextLabelPoint: textLabelPoint, serializeProject: serializeProject,\n" +
	"\t\trenderLabelFields: renderLabelFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tsetProp: setProp,\n" +
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
const textSpec = L.paneTableById('text');
// What the pane has RENDERED (one cell set per row on screen), not what the document holds: the
// defect was exactly the difference between the two.
function shown() { return Object.keys(textSpec.cells || {}); }

console.log('--- 1. deleting a Text updates the open Text table and the saved project ---');
{
	const a = L.addText(10, 10, null), b = L.addText(50, 50, null);
	ok('1.1 both are rendered in the table', shown().indexOf(a.id) >= 0 && shown().indexOf(b.id) >= 0, shown().join(','));
	L.deleteElement('label', a.id);
	const rows = shown();
	ok('1.2 the deleted Text is gone from the table, nothing re-rendered by hand',
		rows.indexOf(a.id) < 0 && rows.indexOf(b.id) >= 0, rows.join(','));
	ok('1.3 ...and from the document', !L.labelById(a.id));
	const saved = L.serializeProject();
	ok('1.4 ...and from what would be saved', saved.labels.every(function (x) { return x.id !== a.id; }));
}

{
	// A node's delete cascades to its attached Texts; the table must follow that path too.
	const n = L.addNode('junction', 200, 200), t = L.addText(210, 210, n.id);
	ok('1.5 setup: an attached Text is rendered', shown().indexOf(t.id) >= 0);
	L.deleteElement('node', n.id);
	ok('1.6 deleting its node takes the Text out of the table too', shown().indexOf(t.id) < 0 && !L.labelById(t.id));
}

console.log('--- 2. detaching ---');
{
	const n1 = L.addNode('junction', 30, 40), n2 = L.addNode('junction', 100, 0);
	const link = L.addLink('pipe', n1.id, n2.id);
	const lb = L.addText(5, 5, n1.id);
	ok('2.0 setup: the Text is attached to the node', lb.anchorNode === n1.id);
	const col = L.paneColByKey(textSpec, 'anchor');
	ok('2.1 the Anchor cell reads the node', L.paneCellText(col, lb) === n1.id);
	const before = L.textLabelPoint(lb);
	L.saveUndoSnapshot();
	ok('2.2 typing another id is refused and changes nothing',
		(L.paneWriteCellText(textSpec, col, lb, 'J9') || true) && lb.anchorNode === n1.id);
	ok('2.3 clearing the Anchor cell is accepted', L.paneWriteCellText(textSpec, col, lb, '') === true);
	ok('2.4 the Text is free', !lb.anchorNode && !lb.anchorLink && lb.anchorT === undefined);
	const after = L.textLabelPoint(lb);
	ok('2.5 it stays where it was drawn', after.x === before.x && after.y === before.y,
		JSON.stringify(before) + ' -> ' + JSON.stringify(after));
	ok('2.6 the leader is gone', !L.labelEls()[lb.id].leader);
	ok('2.7 the node no longer lists it', (L.labelsByAnchor()[n1.id] || []).indexOf(lb.id) < 0);
	ok('2.8 the Anchor cell reads empty', L.paneCellText(col, lb) === '');
	L.undo();
	const back = L.labelById(lb.id);
	ok('2.9 Undo re-attaches it', !!back && back.anchorNode === n1.id);

	// A link-anchored Text, detached from Properties.
	const lk = L.addText(0, 0, null, { link: link.id, t: 0.5 });
	ok('2.10 setup: attached to the link', lk.anchorLink === link.id);
	L.renderLabelFields(lk.id);
	let input = null;
	(function walk(e) {
		if (input) { return; }
		if (e._tag === 'label' && (e.textContent || '').indexOf(global.EngCalcs.pageConfig.lpn_field_text_attached) >= 0) {
			(e.children || []).forEach(function (c) { if (c.type === 'text') { input = c; } });
		}
		(e.children || []).forEach(walk);
	})(L.popupFields());
	ok('2.11 Properties shows the Attached asset as a box', !!input && input.value === link.id);
	if (input) {
		const p0 = L.textLabelPoint(lk);
		input.value = '';
		(input._listeners.change || []).forEach(function (f) { f({}); });
		ok('2.12 clearing it detaches the Text where it is drawn',
			!lk.anchorLink && lk.anchorT === undefined &&
			L.textLabelPoint(lk).x === p0.x && L.textLabelPoint(lk).y === p0.y);
		L.undo();
		ok('2.13 Undo re-attaches it', L.labelById(lk.id).anchorLink === link.id);
	}
}

console.log('--- 3. Description ---');
{
	const lb = L.addText(0, 0, null);
	const col = L.paneColByKey(textSpec, 'desc');
	ok('3.1 the Text table has a Description column', !!col);
	ok('3.2 writing the cell stores desc', L.paneWriteCellText(textSpec, col, lb, 'Corner of Elm and Main') && lb.desc === 'Corner of Elm and Main');
	ok('3.3 ...it reads back', L.paneCellText(col, lb) === 'Corner of Elm and Main');
	ok('3.4 it is saved in the project', L.serializeProject().labels.filter(function (x) { return x.id === lb.id; })[0].desc === 'Corner of Elm and Main');
	L.renderLabelFields(lb.id);
	const pc = global.EngCalcs.pageConfig;
	let input = null;
	(function walk(e) {
		if (input) { return; }
		if (e._tag === 'label' && (e.textContent || '').indexOf(pc.lpn_field_desc) >= 0) {
			(e.children || []).forEach(function (c) { if (c.type === 'text') { input = c; } });
		}
		(e.children || []).forEach(walk);
	})(L.popupFields());
	ok('3.5 Properties shows a Description box with the value', !!input && input.value === 'Corner of Elm and Main');
	if (input) {
		input.value = 'North side';
		(input._listeners.input || []).forEach(function (f) { f({}); });
		ok('3.6 typing in Properties writes it', lb.desc === 'North side');
	}
	const src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
	const ov = /LPN_OVERRIDABLE\s*=\s*\{[\s\S]*?\n\t\};/.exec(src);
	ok('3.7 desc is not in the overridable list', !ov || !/\bdesc\b/.test(ov[0]));
	const inp = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'lpn-inp.js'), 'utf8');
	ok('3.8 the .inp writer gives [LABELS] no description comment', !/descOf\(lb\)|descOf\(lb2\)/.test(inp));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nText object harness: all checks passed.');
process.exit(fails ? 1 : 0);

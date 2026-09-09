// AN ALIGNMENT CELL AN ATTACHED TEXT CANNOT USE. Run with:
//   node dev/lpn-spike/pane-attached-align-harness.js
//
// Tom, 2026-09-08: *"In Tables, should H & V alignment say 'attached' if attached? center and
// middle uneditable look like a bug."*
//
// He is right, and it is the same rule the property popup already states. A Text attached to a node
// or a pipe takes its horizontal and vertical alignment from the side of the leader it sits on, so
// alignRow() draws no alignment rows for it at all (his 2026-08-18 ruling) and
// lpn_field_text_attached_tip says why. The TABLE has no such freedom -- every column has a cell in
// every row -- so it was rendering the stored default, uneditable, and `center` in a cell you
// cannot change reads as a control that has stopped working rather than as a rule.
//
// **WHAT THIS FILE CANNOT SEE.** Italic and grey is a stylesheet fact and there is no CSS engine
// here; section 3 reads the rule as text. What is asserted is the WORD the cell carries, that it
// carries it in both the places a cell is written, that the cell is not typeable, and that the tip
// on it is the popup's own sentence and not a second one.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addText: addText,\n" +
	"\t\tlabelById: labelById, textIsAnchored: textIsAnchored,\n" +
	"\t\tpaneTableById: paneTableById, paneCols: paneCols,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\trefillTable: function (id) { var s = paneTableById(id);\n" +
	"\t\t\trefillPaneTable(s, paneTableRowsInOrder(s)); },\n" +
	"\t\ttableCells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttableTds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tpaneCellText: paneCellText, paneCellIsPlain: paneCellIsPlain,\n" +
	"\t\tpaneCellEditable: function (c, el) { return !paneCellIsPlain(c, el) && !!c.set; },\n" +
	"\t\tpc: function () { return EngCalcs.pageConfig; }\n"
);

// One free Text and one attached to a junction -- both real, both made by the page's own addText().
const doc = L.getDoc();
const nid = L.addNode('junction', 100, 100).id;
const free = L.addText(400, 400);
const bound = L.addText(105, 105, nid);

console.log('\n--- the two Texts are what the sections below assume ---');
ok('one Text is free-floating', L.textIsAnchored(free) === false || !L.textIsAnchored(free));
ok('...and one is attached to a node', !!L.textIsAnchored(bound), bound.anchorNode);

// ================================================================================================
// 1. WHAT THE CELL SAYS
// ================================================================================================
console.log('\n--- the cell states the rule instead of an inert value ---');
const spec = L.paneTableById('text');
ok('there is a Text table to look at', !!spec);
const cols = L.paneCols(spec);
const align = cols.filter(function (c) { return c.key === 'align' || c.key === 'valign'; });
ok('...with a horizontal and a vertical alignment column', align.length === 2,
	align.map(function (c) { return c.key; }).join(','));

// **NEVER PINNED AS A LITERAL.** The word is Tom's to change; the assertion is that the cell says
// whatever lpn_pane_text_attached says.
const WORD = L.pc().lpn_pane_text_attached;
ok('lpn_pane_text_attached reaches the page through pageConfig', !!WORD, WORD);

align.forEach(function (c) {
	ok(c.key + ': the attached Text\'s cell says the attached word',
		L.paneCellText(c, bound) === WORD, L.paneCellText(c, bound));
	ok(c.key + ': ...and the free Text still shows its own value',
		L.paneCellText(c, free) === c.get(free) && L.paneCellText(c, free) !== WORD,
		L.paneCellText(c, free));
	ok(c.key + ': the attached cell is not typeable',
		L.paneCellIsPlain(c, bound) === true && L.paneCellEditable(c, bound) === false);
	ok(c.key + ': ...and the free one still is',
		L.paneCellIsPlain(c, free) === false && L.paneCellEditable(c, free) === true);
});

// ================================================================================================
// 2. BOTH PLACES A CELL IS WRITTEN
// ================================================================================================
// A cell is built once and refilled on every solve. A word written only at build time comes back as
// the inert value the first time anything settles, which is the defect wearing a different hat.
console.log('\n--- built and refilled through the same one function ---');
{
	ensure(spec.panel);
	L.renderTable('text');
	const tds = L.tableTds('text')[bound.id];
	ok('the attached row has cells to look at', !!tds && !!tds.align, tds && Object.keys(tds).join(','));
	if (tds && tds.align) {
		['align', 'valign'].forEach(function (k) {
			ok(k + ': the built cell carries the word', tds[k].textContent === WORD, tds[k].textContent);
			ok(k + ': ...and no control inside it, so there is no path by which it could be typed',
				tds[k].childNodes.length === 0, String(tds[k].childNodes.length));
			ok(k + ': ...marked as a stated rule rather than a value',
				(tds[k].className || '').indexOf('lpn-pane-stated') >= 0, tds[k].className);
			ok(k + ': ...and carrying the property popup\'s OWN sentence, not a second one',
				tds[k].title === L.pc().lpn_field_text_attached_tip,
				(tds[k].title || '').slice(0, 40));
			ok(k + ': ...reachable on a touch screen, which is what ec-help wires',
				(tds[k].className || '').indexOf('ec-help') >= 0);
			tds[k].textContent = 'wiped';
		});
		L.refillTable('text');
		['align', 'valign'].forEach(function (k) {
			ok(k + ': a refill writes the word back, not the stored centre',
				tds[k].textContent === WORD, tds[k].textContent);
		});
	}
	const freeTds = L.tableTds('text')[free.id];
	ok('a free Text still gets a real control in its alignment cell',
		!!freeTds && !!freeTds.align && freeTds.align.childNodes.length > 0,
		freeTds && freeTds.align ? String(freeTds.align.childNodes.length) : 'no cell');
	ok('...and is NOT marked as a stated rule',
		!!freeTds && (freeTds.align.className || '').indexOf('lpn-pane-stated') < 0);
}

// ================================================================================================
// 3. THE STYLESHEET HALF, AND THE ONE EXPLANATION
// ================================================================================================
console.log('\n--- the styling, and the one sentence ---');
{
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	const rule = (css.match(/\.lpn-pane-table td\.lpn-pane-stated \{[^}]*\}/) || [''])[0];
	ok('a stated cell has a rule of its own', !!rule, rule.replace(/\s+/g, ' '));
	ok('...that makes it read as a different kind of thing from a value',
		/font-style:\s*italic/.test(rule));

	// ONE explanation for one rule. The table borrows the popup's key rather than owning a second
	// sentence that could drift from it.
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	const uses = (js.match(/lpn_field_text_attached_tip/g) || []).length;
	ok('the tip key is read in the popup and in the table, and nowhere writes a rival sentence',
		uses >= 2, uses + ' read(s)');
	ok('lpn_pane_text_attached is supplied to pageConfig by the page',
		fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8')
			.indexOf('lpn_pane_text_attached:') > 0);
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);

// SETTINGS PARITY, ALL LABELS vs CUSTOMER LABELS (Task, Tom 2026-09-23, verbatim): "Make the
// Customer labels and All labels zoom limits settings interfaces identical. (a) Both to have the
// placeholder 'Always show', (not 'Always show labels'). (b) Both to say 'Show labels when zoomed
// to this map width or less'. (c) Both tips to be similar to the all labels tip, but with the last
// sentence removed since it's misleading. (d) Both styles to use the ? glyph. (d) Both 'ft' to be
// before the button. (e) All means all, not all except customer... put a qualifier in the Customer
// label tip that 'This has no effect if it is larger than the similar setting for all labels.'
// (f) Ensure that the words 'zoom', 'show', and 'label' are present for filtering. (g) ... can
// Settings filter work as an AND word search?"
//
// Run with: node dev/lpn-spike/label-limit-parity-harness.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fsmod = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet, mkEl, visibleTip } = stub;

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { return applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\tgetDoc: function () { return doc; }, refreshLabelText: refreshLabelText,\n" +
	"\t\trebuildSettings: function () { rebuildSettingsBox(); },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tcustomerLabelsAttempted: function () { return customerLabelsAttempted(); },\n" +
	"\t\tsetboxWordsMatch: setboxWordsMatch, filterSetboxContainer: filterSetboxContainer,\n" +
	"\t\tapplySetboxFilter: function () { applySetboxFilter(); },\n" +
	"\t\tserialize: function () { return serializeProject(); },\n" +
	"\t\tgetState: function () { return state; }"
);
L.buildLayers();
L.setCanvas(1400, 900);
stub.byId.lpn_canvas.appendChild(stub.byId.lpn_labels_legend);

function openNet3Novato() {
	L.applySaved(JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8')));
	L.buildDom();
	L.setView(L.geoHome());
}
openNet3Novato();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.refreshLabelText();

function fire(el, type) { (el._listeners[type] || []).forEach(function (f) { f({ preventDefault() {} }); }); }
// Every `<label class="lpn-set-row">` under a host, walked the same way settingsInput() does in
// label-limit-zero-harness.js -- a stub tree has no querySelectorAll, so every harness that reads
// this box walks `.children` by hand.
function rowsIn(hostId) {
	var rows = [];
	(function walk(e) {
		if (!e) { return; }
		if (e.classList && e.classList.contains('lpn-set-row')) { rows.push(e); }
		(e.children || []).forEach(walk);
	})(stub.byId[hostId]);
	return rows;
}
function inputIn(row) {
	var found = null;
	(function walk(e) {
		if (found || !e) { return; }
		if (e.tagName === 'INPUT') { found = e; return; }
		(e.children || []).forEach(walk);
	})(row);
	return found;
}
function buttonIn(row) {
	var found = null;
	(function walk(e) {
		if (found || !e) { return; }
		if (e.tagName === 'BUTTON') { found = e; return; }
		(e.children || []).forEach(walk);
	})(row);
	return found;
}
function glyphIn(row) {
	var found = null;
	(function walk(e) {
		if (found || !e) { return; }
		if (e.classList && e.classList.contains('ec-tip')) { found = e; return; }
		(e.children || []).forEach(walk);
	})(row);
	return found;
}
function helpIn(row) {
	var found = null;
	(function walk(e) {
		if (found || !e) { return; }
		if (e.classList && e.classList.contains('ec-help')) { found = e; return; }
		(e.children || []).forEach(walk);
	})(row);
	return found;
}

L.rebuildSettings();
const PC = global.EngCalcs.pageConfig;

// ---- (a)-(d), (f): the two rows built by hand -----------------------------------------------
console.log('== (a)-(d),(f): the two rows are built the same way, in real DOM ==');
{
	var allRows = rowsIn('lpn_set_map_fields').filter(function (r) {
		return !!inputIn(r) && inputIn(r).id === 'lpn_set_label_max_width';
	});
	var custRows = rowsIn('lpn_labels_customer_fields').filter(function (r) { return !!inputIn(r); });
	ok(allRows.length === 1, 'the all-labels row is found');
	ok(custRows.length === 1, 'the customer row is found');
	var allRow = allRows[0], custRow = custRows[0];
	if (allRow && custRow) {
		var allInput = inputIn(allRow), custInput = inputIn(custRow);
		// (a) placeholder
		ok(allInput.placeholder === (PC.lpn_settings_label_always || 'Always show') &&
			allInput.placeholder === 'Always show',
			'(a) the all-labels box\'s placeholder is "Always show"', allInput.placeholder);
		ok(custInput.placeholder === allInput.placeholder,
			'(a) the customer box carries the identical placeholder', custInput.placeholder);
		// **THE TWO NUMBER BOXES ARE THE SAME WIDTH** (Tom, 2026-09-23 pre-review: the all-labels
		// box was 7em, the customer box 2.6rem -- visibly narrower for no reason tied to what either
		// box holds). Both now come from the one shared `buildLabelWidthControl()`, so this also
		// guards against a future edit changing one without the other.
		ok(allInput.style.width === '7em', 'the all-labels box is 7em wide', allInput.style.width);
		ok(custInput.style.width === allInput.style.width,
			'the customer box is the identical width, not its old narrower 2.6rem', custInput.style.width);
		// (b) the row NAME -- setFieldLabel() writes it as the help span's leading text node, so the
		// label's own textContent (before the trailing "?" glyph text) is compared with the
		// all-labels row's own key, asserted through pageConfig rather than an English literal.
		var allHelp = helpIn(allRow), custHelp = helpIn(custRow);
		ok(!!allHelp && !!custHelp, '(d) both rows wrap their name in a span.ec-help');
		ok(visibleTip(allHelp) === PC.lpn_settings_label_max_width_tip, 'the all-labels row carries its own tip');
		ok(visibleTip(custHelp) === PC.lpn_labels_customer_width_tip, 'the customer row carries its own tip');
		ok(allHelp.textContent.indexOf(PC.lpn_settings_label_max_width) === 0,
			'(b) the all-labels row says lpn_settings_label_max_width', allHelp.textContent);
		ok(custHelp.textContent.indexOf(PC.lpn_settings_label_max_width) === 0,
			'(b) the customer row says the SAME words, not lpn_labels_customer_width', custHelp.textContent);
		// (d) the "?" glyph, the ecTipLabel-style door, on both
		var allGlyph = glyphIn(allRow), custGlyph = glyphIn(custRow);
		ok(!!allGlyph && allGlyph._text === '?', '(d) the all-labels row carries the "?" glyph');
		ok(!!custGlyph && custGlyph._text === '?', '(d) the customer row carries the "?" glyph too');
		// (d)/2 "ft" (the length unit) sits before the "Use current view" button on BOTH rows --
		// walk the row's own control group in document order and check the unit text lands between
		// the number box and the button, never after it.
		function orderOK(row) {
			var order = [], seenInput = false;
			(function walk(e) {
				if (!e) { return; }
				if (e.tagName === 'INPUT') { order.push('input'); }
				else if (e.tagName === 'BUTTON') { order.push('button'); }
				else if (e.classList && e.classList.contains('lpn-set-note') && e._text) { order.push('unit'); }
				(e.children || []).forEach(walk);
			})(row);
			var ui = order.indexOf('unit'), bi = order.indexOf('button');
			return ui >= 0 && bi >= 0 && ui < bi;
		}
		ok(orderOK(allRow), '(d) the all-labels row puts "ft" before the button');
		ok(orderOK(custRow), '(d) the customer row puts "ft" before the button too');
		// (f) zoom / show / label are all present, in the row's own searchable words (name + tip)
		['zoom', 'show', 'label'].forEach(function (w) {
			ok((allHelp.textContent + ' ' + visibleTip(allHelp)).toLowerCase().indexOf(w) >= 0,
				'(f) the all-labels row\'s own text mentions "' + w + '"');
			ok((custHelp.textContent + ' ' + visibleTip(custHelp)).toLowerCase().indexOf(w) >= 0,
				'(f) the customer row\'s own text mentions "' + w + '"');
		});
	}
}

// ---- (c): the tip's last sentence is gone, and the qualifier is Tom's own wording -------------
console.log('== (c): tips ==');
{
	var allTip = PC.lpn_settings_label_max_width_tip, custTip = PC.lpn_labels_customer_width_tip;
	ok(allTip.indexOf('Text you placed yourself stays') < 0,
		'(c) the misleading last sentence is gone from the all-labels tip');
	ok(custTip.indexOf('This has no effect if it is larger than the similar setting for all labels') >= 0,
		'(c) the customer tip carries Tom\'s own qualifier sentence, verbatim');
	function whileClause(t) { var m = /drawn only while ([^.]*)\./.exec(t); return m && m[1]; }
	ok(!!whileClause(custTip) && whileClause(custTip) === whileClause(allTip),
		'(c) the customer tip is otherwise the parallel sentence, not a different shape');
}

// ---- (e): all means all -- 0 on the all-labels row hides customer labels regardless -----------
console.log('== (e): the all-labels limit wins over a customer setting that would otherwise show ==');
{
	var box = inputIn(rowsIn('lpn_set_map_fields').filter(function (r) {
		return inputIn(r) && inputIn(r).id === 'lpn_set_label_max_width';
	})[0]);
	var custBox = inputIn(rowsIn('lpn_labels_customer_fields').filter(function (r) { return !!inputIn(r); })[0]);
	// Customer labels wide open -- wider than the whole-Earth view geoHome() opens this fixture on
	// (~4e7 m across), so nothing about ITS OWN setting would hide them.
	custBox.value = '2000000000'; fire(custBox, 'change');
	box.value = ''; fire(box, 'change');
	ok(L.customerLabelsAttempted() === true,
		'with the all-labels limit blank, a wide-open customer limit shows customer labels');
	box.value = '0'; fire(box, 'change');
	ok(L.labelsHidden() === true, 'typing 0 on the all-labels row hides all generated labels');
	ok(L.customerLabelsAttempted() === false,
		'(e) ...and customer labels too, even though the customer row itself never changed');
	box.value = ''; fire(box, 'change');
	ok(L.customerLabelsAttempted() === true, 'clearing the all-labels row again lets customer labels back');
}

// ---- blanking the CUSTOMER box now reaches null, exactly like the all-labels box always could ---
// (Tom, pre-review, 2026-09-23: the change handler refused an empty entry and reverted to the old
// number, so the "Always show" placeholder was unreachable -- nothing ever set
// labelSettings.customerMaxWidth to null.) Driven through the real box and its real `change` event,
// never a direct model poke, the same rule label-limit-zero-harness.js already follows for the
// all-labels box.
console.log('== blanking the customer box: null, shown at any zoom, and it survives a save/reload ==');
{
	L.setCanvas(1400, 900);
	var box = inputIn(rowsIn('lpn_set_map_fields').filter(function (r) {
		return inputIn(r) && inputIn(r).id === 'lpn_set_label_max_width';
	})[0]);
	var custBox = inputIn(rowsIn('lpn_labels_customer_fields').filter(function (r) { return !!inputIn(r); })[0]);
	// The all-labels row must be OUT OF THE WAY here -- blank, its own "always" state -- so this
	// section is testing the customer row's own reach for null, not (e)'s gate re-appearing.
	box.value = ''; fire(box, 'change');
	// Start the customer row on a real, narrow number, so "cleared it" is an observable change and
	// not a box that already read blank by coincidence.
	custBox.value = '50'; fire(custBox, 'change');
	ok(L.labelSettings().customerMaxWidth === 50, 'a real number takes, as before', String(L.labelSettings().customerMaxWidth));
	custBox.value = ''; fire(custBox, 'change');
	ok(L.labelSettings().customerMaxWidth === null,
		'blanking the real box through its own change handler stores null, not the old number');
	ok(custBox.value === '', 'the box itself shows blank, not a reverted number');
	// **AT ANY ZOOM** -- null means no threshold of its own, so this must hold at a canvas 1 px wide
	// and one a billion wide alike, the same width sweep label-limit-zero-harness.js runs for the
	// all-labels row's own blank case.
	[10, 1000, 1e6, 1e9].forEach(function (w) {
		L.setCanvas(w, 900);
		ok(L.customerLabelsAttempted() === true,
			'null shows customer labels at canvas width ' + w, '(subject to the all-labels gate, which is blank here too)');
	});
	L.setCanvas(1400, 900);
	// **SURVIVES serializeProject() -> applySaved()** -- JSON round-trips `null` faithfully; the
	// reader at 26621-26635 has to accept it on the way back in, which is the actual gap the
	// pre-review named ("nothing ever sets... to null" was half the bug; the other half was that
	// even a hand-poked null would have been silently dropped on reload before this fix).
	var saved = JSON.parse(JSON.stringify(L.serialize()));
	ok(saved.labelSettings.customerMaxWidth === null, 'the saved project file itself carries null, not 0 or a number');
	// Reload it, through the real door -- applySaved(), never a direct labelSettings assignment.
	saved.labelSettings.customerMaxWidth = null;   // re-assert after the JSON round trip above, belt and braces
	L.applySaved(saved);
	ok(L.labelSettings().customerMaxWidth === null,
		'reloading the saved project keeps the customer row blank -- null, not reverted to a default');
	// Put the fixture back the way every later section expects to find it.
	openNet3Novato();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	L.refreshLabelText();
	L.rebuildSettings();
}

// ---- (g): the filter is an AND of words, not one substring ------------------------------------
console.log('== (g): AND-of-words, driven against the real filterSetboxContainer() ==');
{
	// A tiny fake tree: two rows under one container, neither built through rebuildSettingsFields()
	// -- filterSetboxContainer() is generic over any `.lpn-set-row`-shaped children, so this tests
	// the matcher itself without needing the box's own section scaffolding.
	function fakeRow(name, tip) {
		var row = mkEl('label');
		row.classList.add('lpn-set-row');
		var help = mkEl('span'); help.classList.add('ec-help'); help.title = tip || '';
		help._text = name; help.textContent = name + (tip ? ' ?' : '');
		row.children.push(help);
		row.textContent = name + ' ' + (tip || '');
		row.title = '';
		return row;
	}
	// **FIXTURE TEXT, NOT SHIPPED WORDING** -- invented sentences that happen to carry "zoom" and
	// "label" apart (never adjacent, so the pre-fix substring bug would miss them) without reading
	// as any real `$ec_lang` value, so this section tests the matcher's own logic rather than
	// pinning a string harness_wording_check.php would otherwise have to hold still forever.
	var container = mkEl('div');
	var rowA = fakeRow('Zoomed far out, this fixture stops showing its own label',
		'A made-up row for this test alone, never a real Settings control.');
	var rowB = fakeRow('Rotate the compass rose icon by this many degrees',
		'Another made-up row, about something entirely unrelated.');
	container.children.push(rowA, rowB);

	function shown(words) {
		L.filterSetboxContainer(container, words);
		return [rowA.style.display, rowB.style.display];
	}
	ok(shown([])[0] === '' && shown([])[1] === '', 'no words: both rows show');
	ok(shown(['zoom'])[0] === '' && shown(['zoom'])[1] === 'none',
		'one word: only the row that mentions it shows');
	// **THE MUTATION THIS SECTION EXISTS TO CATCH**: the pre-fix code tested the WHOLE typed string
	// as one substring, so two words that are both present but never ADJACENT (never in that order,
	// as one phrase) matched nothing. "zoom label" is exactly that case for row A: "label" appears
	// in "labels", "zoom" appears in "zoomed", but "zoom label" is not a substring of the row's text.
	ok(shown(['zoom', 'label'])[0] === '',
		'(g) two words, both present but never adjacent, still match (AND, not one substring)');
	ok(shown(['zoom', 'label'])[1] === 'none', '...and the row that only matches one of them does not');
	ok(shown(['zoom', 'xyzzy'])[0] === 'none' && shown(['zoom', 'xyzzy'])[1] === 'none',
		'a word that matches nothing excludes every row, even alongside one that does match');
	ok(L.setboxWordsMatch('zoomed far out, this fixture stops showing its own label',
		['zoom', 'show', 'label']) === true,
		'(f) the shared row text a reader would search for finds itself under all three words');
}

console.log('\n' + checks + ' checks, ' + failures + ' failed');
process.exit(failures ? 1 : 0);

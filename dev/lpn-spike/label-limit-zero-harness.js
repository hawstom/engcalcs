// THE LABELING THRESHOLD'S 0 CASE (2026-09-23), retiring "Thematic map (colors only)". Run with:
//   node dev/lpn-spike/label-limit-zero-harness.js
//
// Tom, 2026-09-23: *"I noticed that we have a tip saying that 0 is never for Customer labels.
// Should we do the same for all labels and use that to replace the 'Thematic map, no labels'
// setting?"* -- yes. `settings.labelMaxWidth` now carries three states instead of two:
//   * blank / null  -- no threshold, labels drawn at every zoom (unchanged);
//   * 0             -- generated labels NEVER drawn, at any zoom, mirroring the customer row's
//                      own 0 ("Type 0 to leave customers unlabelled.");
//   * a real number -- the threshold as it already worked.
//
// **0 IS NOT "PAST A REAL THRESHOLD".** A Text object's own "Show at all zoom levels" rule
// (R-174) is keyed to a GENUINE typed width being exceeded, and must not fire just because 0 was
// typed somewhere else -- that would make a user's own writing disappear under the setting that
// replaced "Thematic map (colors only)", which promised the opposite ("Text you placed yourself
// stays"). js/looped-network.js splits this into `labelsPastThreshold()` (real number only, feeds
// the per-label rule) and `labelsFullyHidden()` (0 or a real number exceeded, feeds
// `dataLabelsHidden` and the labels legend) -- section 2 is the check that would catch the two
// being collapsed back into one.
//
// **NET3.lwn (THE XY EXAMPLE) SHIPS labelMaxWidth: 30 AND OPENS PAST IT** (Task 705,
// 2026-09-22) -- dev/lpn-spike/switch-keep-harness.js clears it before reuse for exactly this
// reason. This harness opens Net3-Novato-CA-World.lwn instead (labelMaxWidth is unset there) and
// sets `settings.labelMaxWidth` explicitly in every section regardless, so no assertion here rides
// on either shipped file's own number.

const fsmod = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

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
	EXAMPLE_EXPORTS +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetView: function (v) { return applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trefreshLabelText: refreshLabelText, refreshLabelSuppression: refreshLabelSuppression,\n" +
	"\t\tapplyLabelVisibility: applyLabelVisibility, renderLabelsLegend: renderLabelsLegend,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlabelSettingsJson: function () { return JSON.stringify(labelSettings); },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\taddText: addText, labelEl: function (id) { return labelEls[id]; },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tlabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tlabelWidthLimitSI: labelWidthLimitSI, visibleMapMetres: visibleMapMetres,\n" +
	"\t\tlegendBox: function () { return document.getElementById('lpn_labels_legend'); },\n" +
	"\t\tsvgClasses: function () { return svg.getAttribute('class') || ''; },\n" +
	"\t\tsetGeoref: function (g) { georef = g; },\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\tscale: function () { return state.s; }"
);
L.buildLayers();
L.setCanvas(1400, 900);
// The stub creates every id as an orphan; the legend box has to be reachable the way the real page
// puts it (a sibling of the canvas), or its display style is a property on a node nothing shows.
stub.byId.lpn_canvas.appendChild(stub.byId.lpn_labels_legend);

function openNet3Novato() {
	L.applySaved(JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8')));
	L.buildDom();
	L.setView(L.geoHome());
	L.noteMapSized();
}

openNet3Novato();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.refreshLabelText();

const doc = L.getDoc();
const aNode = doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];

// A Text object of the user's own, default (allZoom absent, so OFF under R-174) -- the one the 0
// case must never touch.
const note = L.addText(aNode.x, aNode.y - 5, null);
function noteHidden() {
	var le = L.labelEl(note.id);
	return !!(le && le.text && le.text.classList && le.text.classList.contains('lpn-lbl-hidden'));
}

// ---- 0. real-language wording exists, and the retired key is gone -----------------------------
console.log('== wording (asserted through pageConfig, never an English literal) ==');
{
	const PC = global.EngCalcs.pageConfig;
	ok(typeof PC.lpn_settings_label_max_width_tip === 'string' && PC.lpn_settings_label_max_width_tip.length > 0,
		'the labeling-threshold tip exists');
	ok(!('lpn_settings_color_thematic' in PC) && !('lpn_settings_color_thematic_tip' in PC),
		'the retired "Thematic map (colors only)" keys are gone from pageConfig');
	// The customer row's own tip is the wording pattern this follows -- asserted to exist, not
	// paraphrased, so this harness cannot drift from the real string by restating it.
	ok(typeof PC.lpn_labels_customer_width_tip === 'string' &&
		PC.lpn_labels_customer_width_tip.indexOf('0') >= 0,
		'the customer row\'s own 0 tip is the pattern the threshold tip follows');
}

// ---- 1. migrating a saved "Thematic map (colors only)" project --------------------------------
console.log('== migrating colorThematic on open ==');
{
	openNet3Novato();
	var saved1 = JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8'));
	saved1.settings = Object.assign({}, saved1.settings, { colorThematic: true });
	delete saved1.settings.labelMaxWidth;
	L.applySaved(saved1);
	ok(L.settings().labelMaxWidth === 0,
		'a saved project with colorThematic true opens with the threshold at 0',
		String(L.settings().labelMaxWidth));
	ok(!('colorThematic' in L.settings()), 'the retired flag itself is dropped, not carried along');

	// **0 WINS OVER A SAVED POSITIVE THRESHOLD** -- the reader's last visible state was no labels
	// at all, not labels past some particular width, so the state that reproduces the screen they
	// left is the one this keeps.
	var saved2 = JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8'));
	saved2.settings = Object.assign({}, saved2.settings, { colorThematic: true, labelMaxWidth: 500 });
	L.applySaved(saved2);
	ok(L.settings().labelMaxWidth === 0,
		'0 wins over a saved positive threshold when colorThematic was also on',
		String(L.settings().labelMaxWidth));

	// A project that never had the flag at all is untouched.
	var saved3 = JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8'));
	saved3.settings = Object.assign({}, saved3.settings, { labelMaxWidth: 500 });
	L.applySaved(saved3);
	ok(L.settings().labelMaxWidth === 500,
		'a plain saved threshold with no thematic flag opens unchanged',
		String(L.settings().labelMaxWidth));

	openNet3Novato();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	L.refreshLabelText();
}

// ---- 2. blank: labels shown at any zoom ---------------------------------------------------------
console.log('== blank: always shown ==');
{
	L.settings().labelMaxWidth = null;
	[10, 1000, 1e6, 1e9].forEach(function (w) {
		L.setCanvas(w, 900);
		L.applyLabelVisibility();
		ok(!L.labelsHidden(), 'blank: labels are drawn at canvas width ' + w, L.svgClasses());
	});
	ok(!noteHidden(), 'blank: the user\'s own Text is drawn too');
	L.renderLabelsLegend();
	ok(L.legendBox().style.display !== 'none', 'blank: the labels legend is shown (a field is on)');
	L.setCanvas(1400, 900);
}

// ---- 3. zero: never shown, at any zoom, and nothing else about the drawing changes -------------
console.log('== zero: never shown ==');
{
	var before = L.labelSettingsJson();
	L.settings().labelMaxWidth = 0;
	[10, 1000, 1e6, 1e9].forEach(function (w) {
		L.setCanvas(w, 900);
		L.applyLabelVisibility();
		ok(L.labelsHidden(), '0: generated labels are hidden at canvas width ' + w, L.svgClasses());
	});
	ok(L.labelSettingsJson() === before,
		'0 never edits the user\'s label choices -- switching it off gives them back untouched');
	// **THE ONE THING THIS FILE EXISTS TO PROVE.** 0 hides generated node and link labels; it must
	// not reach a Text object's own visibility, which is governed by a REAL threshold only
	// (labelsPastThreshold(), not labelsFullyHidden()).
	ok(!noteHidden(), '0: the user\'s own Text stays drawn (it is not generated annotation)');
	L.renderLabelsLegend();
	ok(L.legendBox().style.display === 'none', '0: the labels legend hides with the labels');
	L.setCanvas(1400, 900);
	L.settings().labelMaxWidth = null;
	L.applyLabelVisibility();
	ok(!L.labelsHidden(), 'clearing it back to blank restores the labels');
}

// ---- 4. a real positive number: the threshold behaves exactly as before ------------------------
console.log('== a real threshold: unchanged ==');
{
	// A plain XY project, opened the way a visitor opens one (Task 378) -- Net3-Novato is
	// geographic, and this section wants a display-unit threshold compared against a plain map
	// width, the same mechanism dev/lpn-spike/zoom-symbol-cap-harness.js section 6 exercises.
	openExample(L, 'us');
	L.setCanvas(1400, 900);
	var ls2 = L.labelSettings();
	Object.keys(ls2.node).forEach(function (k) { ls2.node[k] = true; });
	Object.keys(ls2.link).forEach(function (k) { ls2.link[k] = true; });
	L.refreshLabelText();
	var aNode2 = L.getDoc().nodes.filter(function (n) { return n.type === 'junction'; })[0];
	var note2 = L.addText(aNode2.x, aNode2.y - 5, null);
	function note2Hidden() {
		var le = L.labelEl(note2.id);
		return !!(le && le.text && le.text.classList && le.text.classList.contains('lpn-lbl-hidden'));
	}

	L.settings().labelMaxWidth = 100; // this project's display length unit (ft)
	// A scale worked out from the threshold itself, never guessed: at state.s = mapBox().w / X the
	// view is X world units wide, so a scale either side of the 100-unit threshold is computed
	// directly from it rather than picked by trial and error.
	var w = 1400; // mapBox().w, fixed by setCanvas() above
	var sNarrow = w / 50;   // a 50-unit-wide view: inside the threshold
	var sWide = w / 200;    // a 200-unit-wide view: past it
	L.getState().s = sWide;
	L.applyLabelVisibility();
	ok(L.labelWidthLimitSI() > 0 && L.visibleMapMetres() > L.labelWidthLimitSI(),
		'the fixture really is past the threshold at this scale (a check on the check)');
	ok(L.labelsHidden(), 'zoomed out past a real 100-unit threshold, labels are hidden');
	L.getState().s = sNarrow;
	L.applyLabelVisibility();
	ok(L.visibleMapMetres() < L.labelWidthLimitSI(),
		'the fixture really is inside the threshold at this scale (a check on the check)');
	ok(!L.labelsHidden(), 'zoomed in within the same threshold, labels are drawn');
	// And a real threshold, unlike 0, DOES reach a Text object with "Show at all zoom levels" off
	// -- Task 705's own rule, untouched by this task.
	L.getState().s = sWide;
	L.applyLabelVisibility();
	ok(note2Hidden(),
		'a real threshold, exceeded, hides a Text object with "Show at all zoom levels" off too');
	L.settings().labelMaxWidth = null;
	L.applyLabelVisibility();
}

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures) { console.log(failures + ' FAILURE(S)'); process.exit(1); }
console.log('label-limit-zero-harness complete: all checks passed.');

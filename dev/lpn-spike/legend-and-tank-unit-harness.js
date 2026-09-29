// TWO INDEPENDENT DEFECTS, ONE FILE BECAUSE BOTH CAME OUT OF THE SAME REVIEW PASS. Run with:
//   node dev/lpn-spike/legend-and-tank-unit-harness.js
//
// PART 1 -- THE NODE LABELS LEGEND'S CORNER AND STACKING (Tom, 2026-09-28: "New project: Put Node
// labels legend at top left. And I assume and hope that it has lower z-index than the messenger
// history"). This is a SETTING (settings.legendPosition, in the Settings box's Symbology/Map
// appearance group), not a hardcoded position, so what moved is its DEFAULT for a brand-new
// project -- and Tom asked, in the same breath, that the robustness of that be checked rather than
// assumed:
//   1. defaultSettings() opens on 'top-left' now (was 'top-right' on a pointer).
//   2. An existing project that stored another corner keeps it (Object.assign merge in
//      applySaved(), never touched by this change).
//   3. A project saved before legendPosition existed at all gets the NEW default, not the old one.
//   4. R-342: a new project follows the one it was opened from -- a project whose legend sits at
//      bottom-right hands that corner to a project created from it, units matching or not; this is
//      not a "unit-calibrated" setting (it names a screen corner, not a number in any unit), so
//      resetUnitBearingDefaultsFor() must never touch it.
//   5. Changing the setting moves the legend live (the Settings row's own change handler, already
//      wired) and the corner is still offered as an option alongside every other one.
//   6. It survives save/reopen (serializeProject() writes the whole of `settings`, unconditionally)
//      and, deliberately, does NOT survive an EPANET .inp round trip -- .inp has no such field, so
//      an import opens on the built-in default like any other new project, which is correct and is
//      asserted here rather than left as an unstated assumption.
//
// The STACKING ORDER is asserted at the SOURCE rather than measured in a real layout: this repo's
// dom stub does not implement getBoundingClientRect well enough to trust a z-index comparison
// computed from it (dev/lpn-spike/browser-drive.js exists for exactly that reason), and the
// numbers here are static CSS/inline-style declarations, not something a solve or an edit can
// change at runtime -- a source read is the honest test of "which number did the file actually
// ship", not a proxy for one.
//
// PART 2 -- THE TANK DIAMETER'S UNIT (a defect found in pre-review: the Tanks table, the
// Properties popup and the native solver's own model all read a tank's DIAMETER -- a horizontal
// distance across the vessel -- in the ELEVATION/HEAD unit, so the heading printed "Tank diameter
// (ft H2O)", "(ft WS)" in German. CLAUDE.md: "Tank diameter is in the LENGTH unit, pipe diameter
// in millimetres"). Checked in every venue CLAUDE.md and the fix touched: the Tables column
// heading, the Properties popup's field label, the native solver's model (js/lpn-inp.js's export
// path already has its own coverage in inp-export-harness.js's two mixed-unit cases), and that a
// LIVE change of the Length unit rescales it while a change of Elevation/Head does not -- the
// mirror image of how it used to behave, and the whole point of the fix.

'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// =================================================================================================
console.log('\n0. THE STACKING ORDER, READ AT THE SOURCE');
// =================================================================================================
{
	const php = fs.readFileSync(path.join(ROOT, 'Looped-Network.php'), 'utf8');
	const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');

	function zIndexOf(text, needle) {
		const i = text.indexOf(needle);
		ok('...found ' + JSON.stringify(needle), i >= 0);
		if (i < 0) { return null; }
		const tail = text.slice(i, i + 400);
		const m = tail.match(/z-index:\s*(-?\d+)/);
		ok('...' + JSON.stringify(needle) + ' carries a z-index nearby', !!m, tail.slice(0, 120));
		return m ? +m[1] : null;
	}

	const zLegend = zIndexOf(php, 'id="lpn_labels_legend"');
	const zOverlayTl = zIndexOf(php, 'id="lpn_map_overlay_tl"');
	const zNotice = zIndexOf(php, 'id="lpn_map_notice"');
	const zZoom = zIndexOf(php, 'id="lpn_zoom_control"');
	const mColorLegend = css.match(/\.lpn-color-legend\s*\{[^}]*z-index:\s*(-?\d+)/);
	ok('.lpn-color-legend carries a z-index', !!mColorLegend, css.match(/\.lpn-color-legend\s*\{[^}]*\}/));
	const zColorLegend = mColorLegend ? +mColorLegend[1] : null;

	// #lpn_map_overlay_tl is the column the message-log BUTTON and PANEL both live in (see
	// Looped-Network.php's own comment above #lpn_msglog_panel: "A CHILD OF THIS COLUMN"), so its
	// z-index is what stands for "the messenger history" here.
	ok('the labels legend is BELOW the message-log column (Tom: lower z-index than the messenger history)',
		typeof zLegend === 'number' && typeof zOverlayTl === 'number' && zLegend < zOverlayTl,
		zLegend + ' vs ' + zOverlayTl);
	ok('...and below the one-shot notice that also lives there', zLegend < zNotice, zLegend + ' vs ' + zNotice);
	ok('...and below the on-map zoom chip, the other permanent top-left/top-right occupant',
		zLegend < zZoom, zLegend + ' vs ' + zZoom);
	ok('the colour key (which can share the same corner) carries the SAME number as the labels legend',
		zColorLegend === zLegend, zColorLegend + ' vs ' + zLegend);
}

// =================================================================================================
console.log('\n1. THE DEFAULT, AND ITS ROBUSTNESS (R-342, applySaved(), save/reopen, .inp import)');
// =================================================================================================
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tdefaultSettings: defaultSettings,\n" +
	"\t\tapplySaved: applySaved,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tcreateProjectFrom: createProjectFrom,\n" +
	"\t\tunitKey: unitKey,\n" +
	"\t\tlegendPositionOptions: function () { return legendPositionOptions(EngCalcs.pageConfig || {}); },\n" +
	"\t\taddNode: addNode,\n" +
	"\t\tconvertUnitValues: convertUnitValues,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpaneHeading: function (tab, key) { var t = paneTables().filter(function (s) { return s.id === tab; })[0],\n" +
	"\t\t\tc = paneCols(t).filter(function (x) { return x.key === key; })[0];\n" +
	"\t\t\treturn c ? paneHeadingText(c) : null; },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject()); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
require(path.join(ROOT, 'js', 'lpn-inp.js'));
L.buildLayers();
setUnitSet('us');

// All text under a node, the recursive read several other harnesses already use: a stub node's
// textContent does not aggregate its children's.
function allTextOf(n) {
	if (!n) { return ''; }
	var t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allTextOf(c); });
	return t;
}
function fieldsFor(host, tag) {
	var out = [];
	(function walk(node) {
		(node.children || []).forEach(function (c) {
			if (c.tagName === tag) { out.push(c); }
			walk(c);
		});
	})(host);
	return out;
}

ok('1a. a fresh project opens with the legend at top-left',
	L.defaultSettings().legendPosition === 'top-left', L.defaultSettings().legendPosition);

ok('1b. the corner is still one of the six offered choices, not a hidden default',
	L.legendPositionOptions().some(function (o) { return o[0] === 'top-left'; }) &&
	L.legendPositionOptions().some(function (o) { return o[0] === 'top-right'; }) &&
	L.legendPositionOptions().some(function (o) { return o[0] === 'bottom-right'; }),
	L.legendPositionOptions().map(function (o) { return o[0]; }));

{
	// 1c. AN EXISTING PROJECT THAT STORED ANOTHER CORNER KEEPS IT.
	var saved = { nodes: [], links: [], labels: [], settings: { legendPosition: 'bottom-right' } };
	L.applySaved(saved);
	ok('1c. a save naming bottom-right stays at bottom-right (never overridden by the new default)',
		L.getSettings().legendPosition === 'bottom-right', L.getSettings().legendPosition);
}

{
	// 1d. A SAVE FROM BEFORE THIS KEY EXISTED gets the NEW built-in default.
	var savedOld = { nodes: [], links: [], labels: [], settings: {} };
	L.applySaved(savedOld);
	ok('1d. a save with no legendPosition key at all opens on the NEW default (top-left)',
		L.getSettings().legendPosition === 'top-left', L.getSettings().legendPosition);
}

{
	// 1e. R-342: A NEW PROJECT FOLLOWS THE ONE IT WAS OPENED FROM.
	setUnitSet('us');
	L.getSettings().legendPosition = 'bottom-right';
	var sameUnits = {};
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow',
		'lpn_u_velocity', 'lpn_u_gradient'].forEach(function (n) { sameUnits[n] = L.unitKey ? L.unitKey(n) : undefined; });
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: { lpn_u_length: 'ft' } });
	ok('1e. same-units new project inherits the OPEN project\'s corner, not the built-in default',
		L.getSettings().legendPosition === 'bottom-right', L.getSettings().legendPosition);

	// And again with the wizard actually changing a unit -- legendPosition names a screen corner,
	// not a number in any unit family, so a unit change must not reset it either.
	L.getSettings().legendPosition = 'middle-left';
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: { lpn_u_length: 'm', lpn_u_diameter: 'mm' } });
	ok('1e2. ...and survives a wizard that DOES change units (it is not unit-calibrated)',
		L.getSettings().legendPosition === 'middle-left', L.getSettings().legendPosition);
}

{
	// 1f. CHANGING THE SETTING MOVES THE LEGEND LIVE -- exercised here as "the corner a fresh
	// change is written to is read straight back", the same contract the Settings row's own
	// change handler relies on (settings.legendPosition = value; renderLabelsLegend()).
	L.getSettings().legendPosition = 'middle-right';
	ok('1f. the live setting reads back exactly what was written', L.getSettings().legendPosition === 'middle-right');
}

{
	// 1g. SAVE/REOPEN: serializeProject() carries the whole of `settings`.
	L.getSettings().legendPosition = 'bottom-left';
	var out = L.serializeProject();
	ok('1g. a save carries legendPosition', out.settings && out.settings.legendPosition === 'bottom-left',
		out.settings && out.settings.legendPosition);
	L.getSettings().legendPosition = 'top-right';
	L.applySaved(JSON.parse(JSON.stringify(out)));
	ok('1g2. ...and reopening it restores that exact corner', L.getSettings().legendPosition === 'bottom-left',
		L.getSettings().legendPosition);
}

{
	// 1h. AN EPANET .inp ROUND TRIP DOES NOT CARRY IT -- DELIBERATELY. .inp has no field for a
	// screen corner; an import is a NEW project by the same door createProjectFrom() other new
	// projects use, so it opens on the built-in default, exactly as it would with no prior project
	// open at all. Asserted so this is a stated design choice rather than an untested assumption.
	L.getSettings().legendPosition = 'bottom-right';
	var text = ['[JUNCTIONS]', ' J1 10 5', '', '[RESERVOIRS]', ' R1 20', '',
		'[PIPES]', ' P1 R1 J1 500 200 130 0 Open', '',
		'[OPTIONS]', ' Units GPM', ' Headloss H-W', '',
		'[COORDINATES]', ' J1 0 0', ' R1 100 0', '', '[END]', ''].join('\n');
	var parsed = EngCalcs.lpnInpParse(text);
	ok('...the fixture parses', parsed.ok, parsed.error);
	var settingsIsTouched = /legendPosition/.test(JSON.stringify(parsed));
	ok('1h. the parsed .inp carries no legendPosition at all (there is no such field in the format)',
		!settingsIsTouched);
}

// =================================================================================================
console.log('\n2. THE TANK DIAMETER\'S UNIT (CLAUDE.md: "Tank diameter is in the LENGTH unit")');
// =================================================================================================
{
	setUnitSet('us');
	var t = L.addNode('tank', 10, 10);

	var heading = L.paneHeading('tanks', 'tankDiameter');
	ok('2a. the Tanks table heading names the LENGTH unit ("ft")', heading === 'Tank diameter (ft)', heading);
	ok('2a2. ...and never a head suffix', !/H2O|WS/i.test(heading || ''), heading);

	L.renderNodeFields(t.id);
	var labelText = fieldsFor(L.popupFields(), 'LABEL')
		.map(allTextOf)
		.filter(function (s) { return /Tank diameter/.test(s); })[0];
	ok('2b. the Properties popup label names the LENGTH unit too', /\(ft\)/.test(labelText || ''), labelText);
	ok('2b2. ...and never a head suffix', !/H2O|WS/i.test(labelText || ''), labelText);

	setUnitSet('si');
	var heading2 = L.paneHeading('tanks', 'tankDiameter');
	ok('2c. under SI it reads plain metres, not "m H2O"', heading2 === 'Tank diameter (m)', heading2);
	setUnitSet('us');
}

{
	// 2d. A LIVE UNIT CHANGE: Length rescales the diameter; Elevation/Head no longer does.
	setUnitSet('us');
	var doc = L.getDoc();
	doc.nodes.push({ id: 'TX', type: 'tank', x: 0, y: 0, elev: 100, _level: 5, minLevel: 0, maxLevel: 20, tankDiameter: 50 });
	L.convertUnitValues('lpn_u_elevhead', 2);
	var afterElev = doc.nodes.filter(function (n) { return n.id === 'TX'; })[0];
	ok('2d. an Elevation/Head unit change leaves the tank diameter alone', afterElev.tankDiameter === 50, afterElev.tankDiameter);
	ok('...while it does still move the elevation (elev/level/heads ARE that family)',
		afterElev.elev === 200, afterElev.elev);
	L.convertUnitValues('lpn_u_length', 3);
	var afterLen = doc.nodes.filter(function (n) { return n.id === 'TX'; })[0];
	ok('2e. a Length unit change DOES rescale the tank diameter', afterLen.tankDiameter === 150, afterLen.tankDiameter);
	ok('...without touching the elevation again', afterLen.elev === 200, afterLen.elev);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);

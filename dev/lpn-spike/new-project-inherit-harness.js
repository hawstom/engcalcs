// R-342 -- A NEW PROJECT FOLLOWS THE ONE IT LEFT AS MUCH AS IT CAN. Run with:
//   node dev/lpn-spike/new-project-inherit-harness.js
//
// Tom's ruling (dev/tom-review-queue.md, 2026-09-27): "Things are more complicated now. A new
// project copies the open project where units are the same (not changed in the New Project
// wizard). Otherwise a new project gets built-in defaults. The party line is that new projects
// follow current project as much as they can."
//
// So this harness checks BOTH directions of createProjectFrom(), against the SAME customized
// "current" project:
//
//   1. The wizard's units equal the open project's -- everything customized survives: an ID
//      prefix, a Show order, a hand-ticked "Use units" box, a typed model default, a widened
//      customer label limit. This was already true before R-342 (newProject() clones the whole of
//      settings/labelSettings unconditionally) and stays true.
//
//   2. The wizard's units differ -- the reading this harness holds the branch to is NARROW: only
//      the pieces actually CALIBRATED to the changed unit reset to the built-in default (a
//      "Use units" tick, a `settings.defaults` number, the length-unit-stated customer label
//      limit). Everything unit-independent (the ID prefix, the Show order) still survives, and a
//      user's own customized DECIMALS COUNT still survives too -- that one rides on
//      afterUnitChange()'s existing followUnitDecimals(), the same rule an ordinary in-place unit
//      change on an existing project already uses, so a new project does not answer the question
//      differently (CLAUDE.md: "changing a unit reinterprets the typed number; it never converts
//      it" is about MODELLED numbers, not a display-format preference).

'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tls: function () { return labelSettings; },\n" +
	"\t\tresetLS: function () { labelSettings = defaultLabelSettings(); },\n" +
	"\t\tcreateProjectFrom: createProjectFrom,\n" +
	"\t\tchangedUnitSelectors: changedUnitSelectors,\n" +
	"\t\tunitKey: unitKey,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const q = (v) => JSON.stringify(v);

setUnitSet('us');
L.buildLayers();

// The customizations a real person would make and expect to carry between their own projects.
function customizeCurrentProject() {
	var s = L.getSettings(), ls = L.ls();
	s.idPrefixes.J = 'JJ';                 // unit-independent preference
	s.defaults.diameter = 8;               // typed in the CURRENT diameter unit (in, US)
	ls.show.node.id = 5;                   // unit-independent preference
	ls.decimals.link.length = 2;           // the user's OWN choice, off the ft default of 0
	ls.useUnits.link.length = true;        // hand-ticked, against the ft default of false (R-347)
	ls.customerMaxWidth = 500;             // stated in the CURRENT length unit (ft, US)
}

// ---- 1. same units: everything customized survives -------------------------------------------
console.log('== 1. the wizard leaves every unit the same: full inheritance ==');
{
	setUnitSet('us');
	L.resetLS();
	customizeCurrentProject();
	var units = {};
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow',
		'lpn_u_velocity', 'lpn_u_gradient', 'lpn_u_roughness', 'lpn_u_age'].forEach(function (n) {
		units[n] = L.unitKey(n);
	});
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: units });
	var s = L.getSettings(), ls = L.ls();
	ok('idPrefixes.J carries over', s.idPrefixes.J === 'JJ', q(s.idPrefixes));
	ok('defaults.diameter carries over (same diameter unit)', s.defaults.diameter === 8, s.defaults.diameter);
	ok('show.node.id carries over', ls.show.node.id === 5, ls.show.node.id);
	ok('decimals.link.length carries over', ls.decimals.link.length === 2, ls.decimals.link.length);
	ok('useUnits.link.length (hand-ticked) carries over', ls.useUnits.link.length === true, ls.useUnits.link.length);
	ok('customerMaxWidth carries over (same length unit)', ls.customerMaxWidth === 500, ls.customerMaxWidth);
}

// ---- 2. units changed: only the unit-calibrated pieces reset ----------------------------------
console.log('== 2. the wizard changes Length and Diameter: a narrow reset ==');
{
	setUnitSet('us');
	L.resetLS();
	customizeCurrentProject();
	var units2 = { lpn_u_length: 'm', lpn_u_diameter: 'mm' };
	var changed = L.changedUnitSelectors({ lpn_u_length: 'ft', lpn_u_diameter: 'in' }, units2);
	ok('changedUnitSelectors reports both', q(changed.slice().sort()) === q(['lpn_u_diameter', 'lpn_u_length']), q(changed));
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: units2 });
	var s2 = L.getSettings(), ls2 = L.ls();
	ok('idPrefixes.J STILL carries over (unit-independent)', s2.idPrefixes.J === 'JJ', q(s2.idPrefixes));
	ok('show.node.id STILL carries over (unit-independent)', ls2.show.node.id === 5, ls2.show.node.id);
	ok('defaults.diameter resets to the built-in default for mm (100), never null', s2.defaults.diameter === 100, s2.defaults.diameter);
	ok('useUnits.link.length resets to the built-in default for metres (ticked, R-347)', ls2.useUnits.link.length === true, ls2.useUnits.link.length);
	ok('customerMaxWidth resets to the built-in default (length unit changed)', ls2.customerMaxWidth === 1000, ls2.customerMaxWidth);
	// The one deliberately UNCHANGED reading: decimals is a display-format preference, not a typed
	// model number, and afterUnitChange()'s own followUnitDecimals() already answers this question
	// for an ordinary in-place unit change -- a new project asks it no differently. The user's own
	// "2" is untouched by the reset; whether it MOVES here is exactly what followUnitDecimals()'s
	// "still at the old default" rule decides, and 2 is not ft's default of 0, so it stays 2.
	ok('decimals.link.length is left to followUnitDecimals(), not force-reset', ls2.decimals.link.length === 2, ls2.decimals.link.length);
}

// ---- 3. units changed, but NOT length or diameter: nothing tied to them resets ----------------
console.log('== 3. the wizard changes only Pressure: Length/Diameter pieces are untouched ==');
{
	setUnitSet('us');
	L.resetLS();
	customizeCurrentProject();
	var units3 = { lpn_u_pressure: 'mh2o' };
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: units3 });
	var s3 = L.getSettings(), ls3 = L.ls();
	ok('defaults.diameter carries over (its own unit did not change)', s3.defaults.diameter === 8, s3.defaults.diameter);
	ok('useUnits.link.length carries over (its own unit did not change)', ls3.useUnits.link.length === true, ls3.useUnits.link.length);
	ok('customerMaxWidth carries over (length did not change)', ls3.customerMaxWidth === 500, ls3.customerMaxWidth);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);

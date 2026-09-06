// THE FIVE WATER-QUALITY SETTINGS A FILE COULD STATE AND NOTHING COULD SHOW -- ROADMAP Task 593.
// Run with:  node dev/lpn-spike/reaction-globals-harness.js
//
// **WHY THIS EXISTS, AND WHY IT IS A DELIVERY BUG RATHER THAN AN ARITHMETIC ONE.** Net2 and Net3
// both state `Order Bulk`, `Order Tank`, `Order Wall`, `Limiting Potential` and `Roughness
// Correlation`. Every one of the five ALREADY parsed, round-tripped byte for byte and reached the
// EPANET engine -- so nothing was lost and no answer was wrong. What was missing was a READER:
// `settingsChemicalRows()` offered `globalBulk` and `globalWall` and nothing else, so a person
// opening one of EPA's own networks could not see five numbers their own answers depend on. Same
// shape as Task 581, same answer: the document already knows, and the gap is delivery.
//
// **SO THIS HARNESS PROVES THE READER, NOT THE PHYSICS.** reaction-anchor-harness.js already owns
// the physics (a coefficient reaches the engine, and is converted where it has a length in it).
// The four ways a reader like this goes wrong, which is why each section is shaped as it is:
//
//   1. **A ROW THAT DOES NOT EXIST.** The whole defect. Asserted off the RENDERED Settings box,
//      never off the source, because a control the code builds into a host no page supplies is a
//      control nobody can reach -- the silent hole lpn-dom-stub.js's own host list warns about.
//   2. **A BLANK THAT STORES ZERO.** "Not stated" and "zero" are different statements about the
//      water: the first leaves EPANET's own default standing, the second overrides it with 0. An
//      empty number box hands back `+'' === 0`, so clearing a box MUST delete the key and the
//      exporter must then write no line at all.
//   3. **A WALL ORDER THAT IS NOT 0 OR 1.** EPANET allows only those two. A number spinner would
//      cheerfully accept 2 and hand the engine a value it refuses, so the control is a chooser --
//      and the chooser must still carry the third state, "not stated".
//   4. **A CONVERSION NOBODY ASKED FOR.** An order is a dimensionless exponent, a limiting
//      potential is a concentration (which EPANET converts for nobody) and the roughness
//      correlation is a ratio. Only `globalWall` is a length, and only at order 1. If any of these
//      five were run through toSI() it would be the third conversion site the unit paradigm
//      forbids, and the number would come back out of the exporter changed.

'use strict';

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\tdocReactions: docReactions, engineQuality: engineQuality,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function all(root, out) {
	(root.children || []).forEach(function (c) { out.push(c); all(c, out); });
	return out;
}
// A rendered row's visible label, read the way quality-options-harness.js reads one.
function rowsIn(host) {
	return all(host, [])
		.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
		.map(function (line) {
			const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
			return span ? span.textContent.replace(/\s+/g, ' ').trim() : '';
		});
}
// The stub's elements record their listeners rather than implementing dispatchEvent, so a harness
// drives a control the way the browser would by calling what the page registered.
const fire = (el, type, ev) => (el._listeners[type] || []).forEach((f) => f(ev || {}));
function controlsIn(host, tag) {
	return all(host, []).filter(n => n.tagName === tag);
}

setUnitSet('us');
// A chemical is being tracked: the reaction rows exist only in that mode, which is correct and is
// asserted below rather than assumed.
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L' });

// =====================================================================================
console.log('1. THE FIVE ROWS EXIST AT ALL, WHICH IS THE WHOLE OF TASK 593');
// =====================================================================================
L.rebuildSettings();
const rows = rowsIn(byId.lpn_set_quality_fields);
[
	['bulk reaction order', /Bulk reaction order/i],
	['tank reaction order', /Tank reaction order/i],
	['wall reaction order', /Wall reaction order/i],
	['limiting potential', /Limiting potential/i],
	['roughness correlation', /Roughness correlation/i]
].forEach(function (r) {
	ok('Settings shows a ' + r[0] + ' row', rows.some(t => r[1].test(t)), rows.join(' | '));
});
// The two that were always there must not have been displaced by the five that arrived.
ok('...and the two coefficients that were always there are still there',
	rows.some(t => /Bulk reaction coefficient/i.test(t)) && rows.some(t => /Wall reaction coefficient/i.test(t)),
	rows.join(' | '));

// =====================================================================================
console.log('\n2. THE WALL ORDER IS A CHOOSER OF 0, 1 AND NOT-STATED -- NEVER A NUMBER BOX');
// =====================================================================================
// EPANET's own restriction, not ours. A spinner would accept 2 and hand the engine a value it
// refuses; the third state is what keeps "not stated" reachable after a value has been picked.
const sels = controlsIn(byId.lpn_set_quality_fields, 'SELECT');
const wallSel = sels.filter(s => (s.children || []).map(o => o.value).join(',') === ',0,1')[0];
ok('the wall order is a select', !!wallSel,
	sels.map(s => (s.children || []).map(o => o.value).join(',')).join(' | '));
if (wallSel) {
	const vals = (wallSel.children || []).map(o => o.value);
	ok('...offering exactly not-stated, 0 and 1', vals.join(',') === ',0,1', vals.join(','));
	ok('...and it opens on not-stated when the document says nothing', wallSel.value === '');
}

// =====================================================================================
console.log('\n3. BLANK IS A STATE: CLEARING A BOX WRITES NO LINE, IT DOES NOT WRITE ZERO');
// =====================================================================================
// The whole reason coeffRow() deletes the key rather than storing 0. Driven through the real
// control's own change handler, because that is where the mistake would live.
const numbers = controlsIn(byId.lpn_set_quality_fields, 'INPUT').filter(n => n.type === 'number');
ok('the four numeric rows are number inputs', numbers.length >= 4, String(numbers.length));

const s = L.getSettings();
s.reactions = s.reactions || { tank: {} };
s.reactions.orderBulk = 2;
s.reactions.limitingPotential = 0.4;
s.reactions.roughnessCorrelation = 1.5;
L.rebuildSettings();
const filled = controlsIn(byId.lpn_set_quality_fields, 'INPUT').filter(n => n.type === 'number');
ok('a stated order comes back into its box', filled.some(n => n.value === '2'),
	filled.map(n => n.value).join(','));
ok('...and so does a stated limiting potential', filled.some(n => n.value === '0.4'),
	filled.map(n => n.value).join(','));

// Clear one through its own handler and require the KEY to be gone, not set to 0.
const orderBox = filled.filter(n => n.value === '2')[0];
if (orderBox) {
	orderBox.value = '';
	fire(orderBox, 'change');
	ok('clearing an order deletes the key rather than storing zero',
		!('orderBulk' in L.getSettings().reactions),
		JSON.stringify(L.getSettings().reactions.orderBulk));
}

// =====================================================================================
console.log('\n4. NONE OF THE FIVE IS CONVERTED, WHICH IS WHAT THE EXPORTER DEPENDS ON');
// =====================================================================================
// engineQuality() is the one place a reaction number may be converted, and only globalWall may be,
// and only at order 1. If any of these five went through toSI() the document's own number would
// come back out of the exporter changed -- the input-file-is-canonical rule broken.
const react = { orderBulk: 2, orderTank: 1, orderWall: 0,
	limitingPotential: 0.4, roughnessCorrelation: 1.5, globalWall: -0.5, wall: {} };
const eng = L.engineQuality(react);
['orderBulk', 'orderTank', 'orderWall', 'limitingPotential', 'roughnessCorrelation'].forEach(function (k) {
	ok(k + ' reaches the engine unconverted', eng[k] === react[k], String(eng[k]));
});
// And the one that IS a length still is, at order 1 -- so this harness cannot pass by the
// conversion having been removed altogether.
const eng1 = L.engineQuality({ orderWall: 1, globalWall: -0.5, wall: {} });
ok('...while the wall coefficient is still converted at order 1, so nothing was disabled wholesale',
	eng1.globalWall !== -0.5, String(eng1.globalWall));

// =====================================================================================
console.log('\n5. AND THE DOCUMENT STILL CARRIES ALL FIVE TO THE EXPORTER');
// =====================================================================================
const s2 = L.getSettings();
s2.reactions = { tank: {}, orderBulk: 2, orderTank: 1, orderWall: 0,
	limitingPotential: 0.4, roughnessCorrelation: 1.5 };
const dr = L.docReactions();
['orderBulk', 'orderTank', 'orderWall', 'limitingPotential', 'roughnessCorrelation'].forEach(function (k) {
	ok('docReactions reports ' + k, dr[k] === s2.reactions[k], String(dr[k]));
});
const inp = L.exportInp().inp;
const react4 = (String(inp).split(/^\[REACTIONS\]/m)[1] || '').split(/^\[/m)[0];
[['ORDER BULK', /Order\s+Bulk\s+2/i], ['ORDER TANK', /Order\s+Tank\s+1/i],
	['ORDER WALL', /Order\s+Wall\s+0/i], ['LIMITING POTENTIAL', /Limiting\s+Potential\s+0\.4/i],
	['ROUGHNESS CORRELATION', /Roughness\s+Correlation\s+1\.5/i]].forEach(function (r) {
	ok('the exporter writes ' + r[0], r[1].test(react4), react4.replace(/\s+/g, ' ').trim());
});

console.log(fails === 0 ? '\nreaction globals harness: all checks passed'
	: `\nreaction globals harness: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);

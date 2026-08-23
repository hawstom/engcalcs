// What SIGN a solve result is shown with -- run with:
//   node dev/lpn-spike/readout-sign-harness.js
//
// WHY THIS EXISTS. Tom, 2026-08-14: "pipe flows are still displaying as negative... Q being
// negative is a simple oversight." The solver signs every flow against the link's own from->to
// direction, which is whichever end the user clicked first, so a minus sign on a readout reports
// the DRAWING ORDER and nothing about the water. Direction is carried by the arrow instead.
//
// This is the kind of rule that gets tidied away, because the obvious-looking code -- print the
// number the solver returned -- is the defect, and on a network where every pipe happens to run
// forwards it looks perfect. The example network is used precisely because three of its six pipes
// solve NEGATIVE, and the harness asserts that first, so it can never quietly become vacuous.
//
// TWO THINGS MUST NOT BE "FIXED" BY THE SAME BRUSH, and both are checked:
//   * the ARROW still reads the sign -- it is the only thing left that carries direction;
//   * a PUMP keeps its negative head loss, which is not drawing order but the whole of how this
//     page expresses a head gain (Tom, 2026-07-30: "Negative head loss is fine").
//
// Also here because it is the same transform: the arrow is drawn at 75% of every other symbol
// (Tom, 2026-08-14), and the fit test that decides whether one is drawn at all must use the same
// 75% -- a smaller arrow that still reserves the old space is a half-applied change nobody sees.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tlinkLabel: function (id) { return linkEls[id].lines.map(function (l) { return l.text; }); },\n" +
	"\t\trenderLinkFields: renderLinkFields, updateArrow: updateArrow,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tarrowTransforms: function (id) { return linkEls[id].arrows.map(function (a) {\n" +
	"\t\t\treturn a.style.display === 'none' ? null : a.getAttribute('transform'); }); },\n" +
	"\t\tsegAngles: function (id) { return segmentMidpoints(linkById(id)).map(function (m) { return m.angle; }); },\n" +
	"\t\tsymbolFactor: symbolFactor, arrowFactor: arrowFactor,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function allText(n) {
	if (!n) { return ''; }
	let t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allText(c); });
	return t;
}
// The popup renders label + value as sibling nodes under one <label>; this reads the whole row and
// pulls the number out of it, so a reordering of the fields cannot retarget the assertion.
function popupRow(match) {
	const rows = L.popupFields().children.filter(function (c) { return /label/i.test(c.tagName || ''); });
	for (const r of rows) { const t = allText(r); if (match.test(t)) { return t; } }
	return null;
}

console.log('=== solve results: which sign reaches the reader ===');

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
openExample(L);
L.runSolve();

const raw = EngCalcs.lpnSolve(L.assembleModel(), { tol: 1e-9 });
const doc = L.getDoc();
const pipes = doc.links.filter(function (l) { return l.type === 'pipe'; });
const pumps = doc.links.filter(function (l) { return l.type === 'pump'; });
const reversed = pipes.filter(function (l) { return raw.flows[l.id] < 0; });

ok('the example network really does solve some pipes backwards', reversed.length > 0,
	reversed.length + ' of ' + pipes.length);
ok('...and has a pump, whose head loss is genuinely negative',
	pumps.length > 0 && pumps.every(function (l) { return raw.headlosses[l.id] < 0; }));

// ---- 1. The MAP LABEL ---------------------------------------------------------------------
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'flow' || k === 'headloss'); });
// **PIPE-ALIGNED LABELS OFF, so this file tests the SIGN and not the layout** (Task 399). With them
// on, a label bound to its pipe sheds values when it collides with a node label, and on this fixture
// the pump's head loss is exactly what goes -- head loss is rank 3 and flow is rank 1, so the shed
// is doing what Tom's priority table tells it to. The assertions below are about what a negative
// number MEANS, and a layout rule quietly removing the number under test would make them fail for a
// reason that has nothing to do with signs.
L.settings().alignPipeLabels = false;
L.refreshLabelText();

// Since Task 333 a label line reads "<prefix><separator><number>", so the sign and the magnitude
// live PAST the prefix. Everything below tests the number, which is what carries the sign -- a
// regex anchored at the start of the whole line would now pass vacuously on every label.
function numberPart(text) { return String(text).replace(/^[^0-9+\-.]*/, ''); }

const negLabels = pipes.filter(function (l) { return L.linkLabel(l.id).some(function (t) { return /^-/.test(numberPart(t)); }); });
ok('no pipe label prints a minus sign', negLabels.length === 0,
	negLabels.map(function (l) { return l.id + ': ' + L.linkLabel(l.id).join('/'); }).join('  '));
ok('...and the numbers are the magnitudes, not zeroed or dropped',
	reversed.every(function (l) { return L.linkLabel(l.id).some(function (t) { return parseFloat(numberPart(t)) > 0; }); }),
	reversed.map(function (l) { return l.id + ': ' + L.linkLabel(l.id).join('/'); }).join('  '));
ok('a PUMP still shows its negative head loss -- that sign is a head gain, not drawing order',
	pumps.every(function (l) { return L.linkLabel(l.id).some(function (t) { return /^-/.test(numberPart(t)); }); }),
	pumps.map(function (l) { return l.id + ': ' + L.linkLabel(l.id).join('/'); }).join('  '));

// ---- 2. The POPUP, which is the canonical results location ---------------------------------
const back = reversed[0];
L.renderLinkFields(back.id);
const flowRow = popupRow(/Flow/);
ok('the popup shows a Flow row for a backwards pipe', !!flowRow, JSON.stringify(flowRow));
ok('...with no minus sign on it', !!flowRow && !/-\d/.test(flowRow), JSON.stringify(flowRow));
const hlRow = popupRow(/Head loss \(/);
ok('...and no minus sign on its head loss either', !!hlRow && !/-\d/.test(hlRow), JSON.stringify(hlRow));
const gradRow = popupRow(/gradient/i);
ok('...nor on the gradient, which is derived from it', !!gradRow && !/-\d/.test(gradRow), JSON.stringify(gradRow));

L.renderLinkFields(pumps[0].id);
const pumpHl = popupRow(/Head loss \(/);
ok('the pump popup KEEPS its minus sign', !!pumpHl && /-\d/.test(pumpHl), JSON.stringify(pumpHl));

// ---- 3. The ARROW still carries the direction ----------------------------------------------
// Read from the transform the page actually wrote, not recomputed: the sign has exactly one
// remaining consumer, so if this rotation stops flipping, direction is gone from the drawing
// entirely and nothing else would say so.
function rotationOf(t) { const m = /rotate\(([-\d.]+)\)/.exec(t || ''); return m ? parseFloat(m[1]) : null; }
function scaleOf(t) { const m = /scale\(([-\d.]+)\)/.exec(t || ''); return m ? parseFloat(m[1]) : null; }
let flipped = 0, aligned = 0;
doc.links.forEach(function (l) {
	const angles = L.segAngles(l.id), q = raw.flows[l.id];
	L.arrowTransforms(l.id).forEach(function (t, i) {
		if (t === null) { return; }
		const d = ((rotationOf(t) - angles[i]) % 360 + 360) % 360;
		if (q < 0) { flipped++; ok('arrow on ' + l.id + ' seg ' + i + ' points upstream-to-downstream (180 flip)', Math.abs(d - 180) < 1e-6, d); }
		else { aligned++; ok('arrow on ' + l.id + ' seg ' + i + ' follows the drawn direction', d < 1e-6 || Math.abs(d - 360) < 1e-6, d); }
	});
});
ok('both arrow directions were actually exercised', flipped > 0 && aligned > 0, flipped + ' flipped, ' + aligned + ' aligned');

// ---- 4. The arrow is 75% of every other symbol ---------------------------------------------
const scales = [];
doc.links.forEach(function (l) { L.arrowTransforms(l.id).forEach(function (t) { if (t !== null) { scales.push(scaleOf(t)); } }); });
ok('every arrow is drawn at arrowFactor(), not symbolFactor()',
	scales.length > 0 && scales.every(function (s) { return Math.abs(s - L.arrowFactor()) < 1e-9; }),
	JSON.stringify(scales) + ' vs ' + L.arrowFactor());
ok('...and arrowFactor() is 75% of the symbol size',
	Math.abs(L.arrowFactor() - 0.75 * L.symbolFactor()) < 1e-12,
	L.arrowFactor() + ' vs ' + L.symbolFactor());

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

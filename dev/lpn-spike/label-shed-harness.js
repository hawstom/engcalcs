// The link-label fitting cascade: shed values before hiding the label (ROADMAP Task 399).
// Run with:
//   node dev/lpn-spike/label-shed-harness.js
//
// WHY THIS EXISTS. Before this, a link label that did not fit its pipe vanished whole
// (`linkLabelTooShort()`), which is the crudest possible answer: nine values are thrown away
// because the ninth would not fit. The cascade sheds by the user's own priority order until what
// is left fits, and hiding becomes the LAST rung rather than the only one. Every step of that is
// invisible on a screenshot -- a shed label looks exactly like a label that was always short.
//
// What can break quietly:
//   1. THE SHED ORDER IS NOT THE READING ORDER, and confusing them is the defect this whole file
//      is built around. Values are DRAWN id, diameter, length, roughness, km, flow, ... and SHED
//      km, roughness, length, ... So what survives is an arbitrary SUBSET of the row, not a prefix
//      of it, and any arithmetic that assumes a prefix is wrong in a way that still looks sensible.
//   2. THE SHED MUST BE MINIMAL. Every value removed past the first that fits is information taken
//      from the reader for nothing, and nothing on screen says it happened.
//   3. SURVIVORS KEEP READING ORDER. A reader's eye learns a label's order; reshuffling what is
//      left would make each shed look like a different kind of label.
//   4. SEPARATORS GO BETWEEN SURVIVORS. Shed a middle value and the two separators around it must
//      become one, or the label carries a gap where a number used to be.
//   5. A DRAGGED LABEL NEVER SHEDS -- the same hedge that exempts it from the short-pipe rule.
//
// **THIS HARNESS DEPENDS ON THE STUB KNOWING THAT TEXT WIDTH FOLLOWS CHARACTER COUNT.** It did not,
// until this task: getBBox() returned a constant, so a shed changed no measurement and every
// assertion here would have passed against a cascade that did nothing at all. See lpn-dom-stub.js.

const assert = require('assert');
const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0;
function ok(cond, what) { assert.ok(cond, what); checks++; }
function eq(a, b, what) { assert.deepStrictEqual(a, b, what); checks++; }

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, refreshLabelText: refreshLabelText,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\ttooShort: function (l) { return linkLabelTooShort(l, linkEls[l.id]); },\n" +
	"\t\tpipeLength: function (l) { return Geom.polylineLength(linkPointList(l)); },\n" +
	"\t\tlabelWidth: function (l) { return labelBoxWidth(linkEls[l.id]); },\n" +
	"\t\ttspanText: function (id) { return linkEls[id].text.children.map(function (t) { return t.textContent; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }"
);

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.drawExample();
L.runSolve();

const doc = L.getDoc(), ls = L.labelSettings();
// Everything on, which is the crowded case the cascade exists for.
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.refreshLabelText();

const READING_ORDER = ['id', 'diameter', 'length', 'roughness', 'km',
	'flow', 'velocity', 'headloss', 'gradient'];

function fieldsOn(id) {
	return (L.linkEls()[id].lines || []).map(function (x) { return x.field; });
}
// Shrink one link to a fraction of its drawn length by moving its far node.
const target = doc.links.filter(function (l) { return l.type === 'pipe'; }).pop();
const from = doc.nodes.filter(function (n) { return n.id === target.from; })[0];
const to = doc.nodes.filter(function (n) { return n.id === target.to; })[0];
const span = { x: to.x - from.x, y: to.y - from.y };
function setLength(frac) {
	to.x = from.x + span.x * frac;
	to.y = from.y + span.y * frac;
	L.refreshLabelText();
	return fieldsOn(target.id);
}

// At full length nothing sheds -- the cascade must not fire on a label that already fits.
eq(setLength(1), READING_ORDER, 'a pipe with room keeps every value');
eq(L.linkEls()[target.id].shedCount, 0, 'and reports no shed');

// Squeeze it and watch the cascade. Each step must be a SUBSET of the last: shedding is monotone in
// room, so a shorter pipe can never bring a value back.
const steps = [0.6, 0.45, 0.3, 0.2, 0.1];
let prev = READING_ORDER;
const seen = [];
steps.forEach(function (f) {
	const now = setLength(f);
	seen.push({ f: f, fields: now.slice() });
	ok(now.length <= prev.length, 'shrinking never adds a value back (at ' + f + ')');
	now.forEach(function (k) {
		ok(prev.indexOf(k) >= 0, k + ' survived at ' + f + ' only because it survived the step before');
	});
	// SURVIVORS KEEP READING ORDER.
	eq(now.slice().sort(function (a, b) { return READING_ORDER.indexOf(a) - READING_ORDER.indexOf(b); }),
		now, 'survivors stay in reading order at ' + f);
	// WHAT WENT IS THE WORST-RANKED. Everything shed must rank worse than everything kept.
	const gone = prev.filter(function (k) { return now.indexOf(k) < 0; });
	gone.forEach(function (g) {
		now.forEach(function (k) {
			ok(ls.priority.link[g] > ls.priority.link[k],
				g + ' (rank ' + ls.priority.link[g] + ') was shed while ' + k +
				' (rank ' + ls.priority.link[k] + ') was kept');
		});
	});
	prev = now;
});
ok(seen[seen.length - 1].fields.length < READING_ORDER.length, 'a short pipe really does shed');

// THE SHED IS MINIMAL: at every step, putting back the best-ranked value that was shed would make
// the label wider than its pipe. Anything less than that is information given away for free.
ok(L.labelWidth(target) <= L.pipeLength(target) || L.tooShort(target),
	'what survives either fits the pipe or has reached the terminal rung');

// THE TERMINAL RUNG. Squeezed far enough, even the single best value cannot fit, and the old
// all-or-nothing hide takes over -- now as the LAST step of a cascade rather than the only step.
setLength(0.02);
eq(fieldsOn(target.id).length, 1, 'the cascade bottoms out at one value');
eq(L.tooShort(target), true, 'and below that the label hides, which is the terminal rung');

// SEPARATORS GO BETWEEN SURVIVORS, NOT BESIDE THE GAPS. Shedding a middle value must leave one
// separator between its neighbours, never two against each other.
setLength(0.45);
const sep = ls.separator;
const drawn = L.tspanText(target.id).join('');
ok(drawn.indexOf(sep + sep) < 0, 'no doubled separator where a value was removed');
ok(drawn.length > 0, 'the shed label still draws something');

// A DRAGGED LABEL NEVER SHEDS. Same hedge, same reason, as the short-pipe exemption: dragging a
// label off a stub is exactly what you do when you want that number on the sheet.
setLength(0.1);
const shedWhenAuto = fieldsOn(target.id).length;
target.lx = 40; target.ly = -40;
L.refreshLabelText();
eq(fieldsOn(target.id), READING_ORDER, 'a dragged label keeps every value however short its pipe');
ok(shedWhenAuto < READING_ORDER.length, 'and the same label really did shed while it was automatic');
eq(L.linkEls()[target.id].shedCount, 0, 'a dragged label reports no shed');
delete target.lx; delete target.ly;

// IDEMPOTENT. Refreshing twice on an unchanged drawing must not shed twice -- the cascade reads the
// full field list every time, never its own previous output. A cascade that ate its own tail would
// strip a label one value per repaint, which on a page that repaints on every solve is fatal and
// slow enough to look like something else.
setLength(0.45);
const once = fieldsOn(target.id);
L.refreshLabelText();
L.refreshLabelText();
eq(fieldsOn(target.id), once, 'shedding is idempotent across repeated refreshes');

console.log('label-shed-harness: ' + checks + ' checks passed  (cascade: '
	+ seen.map(function (s) { return s.fields.length; }).join(' -> ') + ' values)');

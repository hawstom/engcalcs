// OFF MEANS OFF: a thematic map, and a project being placed on the map, do NO label work.
// Run with:
//   node dev/lpn-spike/labels-off-work-harness.js
//   node dev/lpn-spike/labels-off-work-harness.js --cost    (the cost table alone, no assertions)
//
// WHY THIS EXISTS. Tom, 2026-09-17: *"Thematic map (labels off) should not do any label
// calculations. Off should mean off. Consent, people!"* applyLabelVisibility() had recorded
// `dataLabelsHidden` since Task 428, and exactly two places read it -- the zoom path and the
// debounced re-shed. Every OTHER trigger (a rebuild, a project switch, a settings edit, a solve, a
// scenario switch, a drag) still composed every label's text, measured each one with getBBox() and
// ran the collision relaxation over the lot, to place lettering `.lpn-labels-hidden` was not
// drawing.
//
// **BOTH DIRECTIONS, OR THE FIX IS STALE LABELS.** Skipping work while hidden is only correct if
// the way back does it. Section 3 is the one that matters: content changed while hidden must be on
// screen when the labels come back, laid out for the CURRENT scale and not the one they were
// hidden at.
//
// **AND THE USER'S OWN TEXT IS NOT SUPPRESSED** (Task 428). `doc.labels` is authored content with
// its own size-scaled rules; only generated annotation hides. Section 4 holds that line -- it is
// the trap in this file, where "label" names two different things.

const fsmod = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

// ---- the two counters, read off the seams rather than off the source ----------------------------
// A LAYOUT PASS is one first-fit placement of the generated labels: runLabelCollisionAvoidance()
// calls it once, so the count IS the number of times the relaxation ran.
// A MEASUREMENT is a layout READ on a text element -- getBBox()/getComputedTextLength() -- which in
// a browser forces a synchronous layout of the whole drawing. That is the cost this task removes,
// and it is the one node can count honestly even though it cannot feel it.
let passes = 0, measures = 0, textMeasures = 0;
const realFirstFit = Collide.placeLabelsFirstFit;
Collide.placeLabelsFirstFit = function () { passes++; return realFirstFit.apply(this, arguments); };
// **WHICH LABEL WAS MEASURED IS READ OFF THE ELEMENT, not guessed from the call site.** Generated
// annotation carries `lpn-annotation`, declared where it is built (annotationEl(), Task 334); the
// user's own Text objects do not, by construction. So the two counts can never drift apart from
// what the page itself means by the word -- which is the trap in this file, where "label" names
// both.
// A TSPAN INSIDE AN ANNOTATION IS ANNOTATION. noteRowWidths() measures each row of a stacked label
// one tspan at a time, and a tspan carries no class of its own -- reading only the element measured
// filed 707 of them under the user's Text, which is a count of the wrong thing rather than a small
// error. So the walk goes up until something declares itself.
function isAnnotation(el) {
	for (var e = el, i = 0; e && i < 4; e = e.parentNode, i++) {
		var c = String((e.getAttribute && e.getAttribute('class')) || '');
		if (/\blpn-annotation\b/.test(c)) { return true; }
		if (/\blpn-lbl\b/.test(c)) { return false; }
	}
	return false;
}
function noteMeasure(el) { if (isAnnotation(el)) { measures++; } else { textMeasures++; } }
const origCreate = global.document.createElementNS;
global.document.createElementNS = function (ns, tag) {
	const el = origCreate(ns, tag);
	const gb = el.getBBox, gc = el.getComputedTextLength;
	el.getBBox = function () { noteMeasure(this); return gb.call(this); };
	el.getComputedTextLength = function () { noteMeasure(this); return gc.call(this); };
	return el;
};
function cost(fn) {
	const p0 = passes, m0 = measures, t0 = textMeasures;
	fn();
	return { passes: passes - p0, measures: measures - m0, textMeasures: textMeasures - t0 };
}
// **THE REVIVAL FINISHES ON A TIMER, so a harness that does not wait measures half of it.**
// refreshLabelSuppression() ends in scheduleReshed(), which is debounced 120 ms because a wheel is
// a burst -- see its comment. In a browser the labels are back a frame or two later; here nothing
// runs the timer unless the process yields.
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
async function costAsync(fn) {
	const p0 = passes, m0 = measures, t0 = textMeasures;
	await fn();
	await sleep(250);
	return { passes: passes - p0, measures: measures - m0, textMeasures: textMeasures - t0 };
}
function show(name, c) {
	console.log('      ' + name.padEnd(34) + String(c.passes).padStart(4) + ' passes  '
		+ String(c.measures).padStart(6) + ' annotation measurements  '
		+ String(c.textMeasures).padStart(4) + ' on the user\'s own Text');
}

setUnitSet('us');
const L = loadLoopedNetwork(
	// init()'s own layer order, so a geographic project draws where the page draws it.
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
	"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\trefreshFontSizes: refreshFontSizes, refreshValueColors: refreshValueColors,\n" +
	"\t\tswitchScenario: switchScenario, createScenario: createScenario,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\taddText: addText, labelEl: function (id) { return labelEls[id]; },\n" +
	"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; },\n" +
	"\t\tlabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tlayoutScale: function () { return lastLayoutScale; },\n" +
	"\t\tsetGeoref: function (g) { georef = g; },\n" +
	"\t\tscale: function () { return state.s; }, fs: effectiveFontSize"
);
L.buildLayers();
L.setCanvas(1400, 900);
L.applySaved(JSON.parse(fsmod.readFileSync(
	ROOT + 'dev/water-network-examples/Net3-Novato-CA-World.lwn', 'utf8')));
L.buildDom();
L.setView(L.geoHome());
L.noteMapSized();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });

// buildDom() REPLACES the element maps, so they are asked for rather than held -- a harness
// holding the map from before a rebuild reads the labels of a drawing that is gone.
const doc = L.getDoc();
function nodeEl(id) { return L.nodeEls()[id]; }
let cx = 0, cy = 0;
doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
cx /= doc.nodes.length; cy /= doc.nodes.length;
const READ_ZOOM = 30000;
// The ceiling section 3 holds the revival to. A label is nudged in WORLD units, so the honest
// figure is pixels: on this drawing at this zoom the worst auto-placed node label lands ~64 px
// from home. Laid out at the scale it was HIDDEN at -- a quarter of this one -- the same nudges
// read four times as far, which is the whole failure mode.
const NUDGE_PX_MAX = 150;   // one of the four zooms node-shed-harness.js uses; Net3-World is read here

// One scenario to switch into, and one Text object of the user's own for section 4.
const sTest = L.createScenario('Test');

const note = L.addText(cx, cy, null);

function setThematic(on) { L.settings().colorThematic = !!on; L.refreshValueColors(); }

async function main() {

await warmEpanet();
L.settings().engine = 'epanet';
L.runSolve();
await settleEpanet();
L.setView({ cx: cx, cy: cy, s: READ_ZOOM });
L.refreshLabelText();

// ---- 0. the cost with labels ON, so the saving has something to be a saving FROM ---------------
console.log('--- what one of each trigger costs with labels drawn ---');
const on = {
	rebuild: cost(function () { L.buildDom(); }),
	settings: cost(function () { ls.node.elev = !ls.node.elev; L.refreshLabelText(); }),
	relayout: cost(function () { L.relayoutLabels(); }),
	fonts: cost(function () { L.refreshFontSizes(); })
};
Object.keys(on).forEach(function (k) { show(k, on[k]); });
const onTotal = Object.keys(on).reduce(function (a, k) {
	return { passes: a.passes + on[k].passes, measures: a.measures + on[k].measures,
		textMeasures: a.textMeasures + on[k].textMeasures };
}, { passes: 0, measures: 0, textMeasures: 0 });
show('TOTAL, labels on', onTotal);
ok(onTotal.passes > 0 && onTotal.measures > 0,
	'the drawing really does label work when labels are on',
	onTotal.passes + ' passes, ' + onTotal.measures + ' measurements');

// ---- 1. THEMATIC MAP: off means off ------------------------------------------------------------
console.log('--- thematic map: every trigger, and none of them lays out or measures ---');
setThematic(true);
ok(L.labelsHidden(), 'generated annotation is hidden');
const off = {
	rebuild: cost(function () { L.buildDom(); }),
	settings: cost(function () { ls.node.elev = !ls.node.elev; L.refreshLabelText(); }),
	relayout: cost(function () { L.relayoutLabels(); }),
	fonts: cost(function () { L.refreshFontSizes(); }),
	scenario: cost(function () { L.switchScenario(sTest.id); })
};
Object.keys(off).forEach(function (k) { show(k, off[k]); });
const offTotal = Object.keys(off).reduce(function (a, k) {
	return { passes: a.passes + off[k].passes, measures: a.measures + off[k].measures,
		textMeasures: a.textMeasures + off[k].textMeasures };
}, { passes: 0, measures: 0, textMeasures: 0 });
show('TOTAL, thematic', offTotal);
Object.keys(off).forEach(function (k) {
	ok(off[k].passes === 0, 'thematic: ' + k + ' runs no label layout pass', off[k].passes + ' passes');
	ok(off[k].measures === 0, 'thematic: ' + k + ' measures no generated label', off[k].measures + ' measurements');
});

// ---- 2. PLACING THE PROJECT ON THE MAP is the other suppressor (Task 145) ----------------------
console.log('--- georeferencing in progress: the same silence ---');
setThematic(false);
L.refreshLabelText();
L.setGeoref({ t: null });
L.refreshValueColors();          // arrives at refreshLabelSuppression(), as every suppressor does
ok(L.labelsHidden(), 'generated annotation is hidden while the project is being placed');
const geo = cost(function () { L.buildDom(); ls.node.elev = !ls.node.elev; L.refreshLabelText(); L.relayoutLabels(); });
show('georef: rebuild + settings + relayout', geo);
ok(geo.passes === 0, 'georef: no label layout pass', geo.passes + ' passes');
ok(geo.measures === 0, 'georef: no generated label measured', geo.measures + ' measurements');
L.setGeoref(null);
L.refreshValueColors();

// ---- 3. THE WAY BACK, which is the half that makes the skip legal -----------------------------
console.log('--- coming back: content is fresh and laid out for the CURRENT scale ---');
setThematic(true);
// Change what the labels SAY while nobody is looking, and move the camera while nobody is looking.
Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
ls.node.id = true; ls.node.elev = true;
L.refreshLabelText();
L.setView({ cx: cx, cy: cy, s: READ_ZOOM * 4 });
const back = await costAsync(function () { setThematic(false); });
show('the revival itself', back);
ok(!L.labelsHidden(), 'generated annotation is back');
ok(back.passes > 0 && back.measures > 0, 'the revival does the work that was skipped',
	back.passes + ' passes, ' + back.measures + ' measurements');
ok(L.layoutScale() === L.scale(), 'the layout belongs to the scale on screen now',
	'laid out at ' + L.layoutScale() + ', drawn at ' + L.scale());
{
	// The content decided while hidden is what is on screen: two lines, id and elevation.
	const drawn = doc.nodes.map(function (n) { return nodeEl(n.id); })
		.filter(function (ne) { return ne && !ne.empty && ne.lines; });
	ok(drawn.length > 0, 'node labels are drawn after the revival', drawn.length + ' of ' + doc.nodes.length);
	const fields = {};
	drawn.forEach(function (ne) { (ne.allLines || []).forEach(function (l) { fields[l.field || '?'] = true; }); });
	// **NOT MERELY "pressure is gone"**: an empty set would satisfy that, and an empty set is what a
	// broken revival produces. The list has to be exactly the two fields left on while nobody was
	// looking.
	ok(Object.keys(fields).sort().join(',') === 'elev,id',
		'the settings changed while hidden are the ones in force',
		'fields asked for: ' + Object.keys(fields).sort().join(','));
	// **A NUDGE IS IN WORLD UNITS AND BELONGS TO THE SCALE THAT PRODUCED IT** (see relayoutLabels()).
	// Read it back in PIXELS -- nudge x scale -- and the figure stops depending on the zoom, so a
	// layout computed at a quarter of this zoom shows up as four times the pixel displacement.
	const px = doc.nodes.map(function (n) {
		const ne = nodeEl(n.id);
		if (!ne || ne.empty || ne.hiddenDropped || !ne.nudge) { return null; }
		return Math.hypot(ne.nudge.x, ne.nudge.y) * L.scale();
	}).filter(function (v) { return v !== null; });
	px.sort(function (a, b) { return a - b; });
	const worst = px.length ? px[px.length - 1] : 0, med = px.length ? px[Math.floor(px.length / 2)] : 0;
	console.log('      node label nudge, in pixels: median ' + med.toFixed(1) + ', worst ' + worst.toFixed(1));
	ok(worst <= NUDGE_PX_MAX, 'no label is placed for a scale other than this one',
		'worst nudge ' + worst.toFixed(1) + ' px against a ceiling of ' + NUDGE_PX_MAX);
}

// ---- 4. THE USER'S OWN TEXT IS NOT SUPPRESSED (Task 428) ---------------------------------------
console.log('--- authored Text is content, not annotation, and keeps its geometry ---');
{
	const te = L.labelEl(note.id);
	ok(!!te, 'the Text object has an element');
	setThematic(true);
	const before = te.text.getAttribute('x');
	L.setView({ cx: cx, cy: cy, s: READ_ZOOM });
	L.relayoutLabels();
	ok(te.text.getAttribute('x') !== null, 'a Text label still has a position under a thematic map', String(before) + ' -> ' + te.text.getAttribute('x'));
	ok(!(te.text.classList && te.text.classList.contains('lpn-annotation')),
		'a Text label is not generated annotation');
	// **AND THE WORK IT NEEDS IS STILL DONE.** A rebuild under a thematic map measures the authored
	// Text objects and nothing else: zero here would mean the suppression had reached content.
	const reb = cost(function () { L.buildDom(); });
	show('rebuild, thematic, Text only', reb);
	ok(reb.measures === 0, 'a thematic rebuild measures no generated label', reb.measures + '');
	ok(reb.textMeasures > 0, 'a thematic rebuild still measures the user\'s own Text',
		reb.textMeasures + ' measurements');
	setThematic(false);
}

console.log('\n' + (failures ? failures + ' of ' + checks + ' FAILED' : 'all ' + checks + ' checks passed'));
console.log('COST  labels on: ' + onTotal.passes + ' passes / ' + onTotal.measures + ' measurements'
	+ '    thematic (one more trigger): ' + offTotal.passes + ' passes / ' + offTotal.measures + ' measurements'
	+ '    (' + offTotal.textMeasures + ' authored-Text measurements, which are not suppressed)');
process.exit(failures ? 1 : 0);

}
main().catch(function (e) { console.error(e); process.exit(1); });

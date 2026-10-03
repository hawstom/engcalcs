// THE LABEL LAYOUT IS BANKED PER ZOOM BUCKET, AND A BANKED BUCKET IS NEVER THE WRONG ONE (ROADMAP
// Task 681(c)/(d)). Run with:
//   node dev/lpn-spike/label-bucket-cache-harness.js
//
// Tom, 2026-09-17: *"We should be able to save label position and shedding state for every node at
// every zoom level. And I assume that that would give us almost instantaneous zooming."* And the
// rule: *"What we need to be vigilant for is unnecessary passes. We have to be aware of whether the
// pre-placements are final or not. I would agitate for using the next more zoomed out (larger text)
// bucket and not revisiting it. And of course the buckets should correlate to the PC mouse zoom
// levels."*
//
// **THE PROPERTY UNDER TEST IS NOT SPEED** (the browser measures that: `?debug=perf`, one ZOOM line
// per settle). It is that a banked answer is never a stale one, because a label in the wrong place
// is worse than a slow one. So, on Net3 with every label field on and a few customers:
//
//   1. Coming back to a bucket already visited runs ZERO passes and draws the identical layout --
//      identical to the first visit AND to the uncached pass at the same scale.
//   2. A value change (a time step, a Calculate), a label-setting change, an element move and a
//      window resize each empty the bank, so the next visit to a banked bucket is a FRESH pass that
//      matches the uncached one. **And the same checks fail with the invalidation switched off**,
//      which is what shows they can fail at all.
//   3. A scale between two notches takes the ZOOMED-OUT notch's bucket, never the nearest, and the
//      view is not snapped to it.
//   4. At a notch scale the bank introduces no overlap the uncached path does not have; between
//      notches, the zoomed-out notch's layout drawn at the smaller text has no more overlaps than
//      that notch's own exact layout.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { loadLoopedNetwork, setUnitSet } = stub;

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, top: 0, right: w, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\trefreshLabelText: refreshLabelText, zoomAbout: zoomAbout, reshedNow: reshedNow, zoomExtent: zoomExtent,\n" +
	"\t\taddCustomer: addCustomer, updateNode: updateNode, applySolveResult: applySolveResult,\n" +
	"\t\tsolveNative: function () { applySolveResult(EngCalcs.lpnSolve(assembleModel(), { tol: solveAccuracy() })); },\n" +
	"\t\tsolve: function () { return lastSolveResult; },\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, settings: function () { return settings; },\n" +
	"\t\tgetDoc: function () { return doc; }, state: function () { return state; },\n" +
	"\t\tlabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tcache: function () { return labelCache; }, bucketOf: labelBucketOf,\n" +
	"\t\tpasses: function () { return labelCachePasses; }, hits: function () { return labelCacheHits; },\n" +
	"\t\tmiss: function () { return labelCacheMiss; },\n" +
	// The uncached pass at the scale on screen, as a REFERENCE: it must not count as one of the bank's
	// passes nor taint the bank, or every comparison would empty what it is comparing against.
	"\t\tuncachedPass: function () { var g = labelCacheGen, p = labelCachePasses; labelCacheEnabled = false;\n" +
	"\t\t\ttry { reshedNow(); } finally { labelCacheEnabled = true; labelCacheGen = g; labelCachePasses = p; } },\n" +
	"\t\tsetEnabled: function (v) { labelCacheEnabled = v; },\n" +
	"\t\tsetInvalidates: function (v) { labelCacheInvalidates = v; },\n" +
	// THE LAYOUT AS DRAWN: every element of the labels layer, its attributes, inline style and text.
	// A DOM serialisation rather than a list of holder fields, so a decision that reached the screen
	// by a route this harness did not think of is still compared.
	"\t\tdrawn: function () {\n" +
	"\t\t\tvar SKIP = { children: 1, parentNode: 1, _listeners: 1, classList: 1, style: 1, dataset: 1, _owner: 1, _styleAttr: 1 };\n" +
	// A HIDDEN element is compared as hidden and nothing more: a leader set to display:none keeps
	// whatever coordinates it last had, from whatever scale that was, and no reader can see them.
	"\t\t\tfunction ser(e) {\n" +
	// (The stub keeps the `style` ATTRIBUTE and the style OBJECT apart; a browser does not, so the
	// object wins where it says anything and the attribute is read where it does not.)
	"\t\t\t\tvar sp = e.style || {}, sa = (e.getAttribute && e.getAttribute('style')) || '';\n" +
	"\t\t\t\tvar disp = ('display' in sp) ? sp.display : (/display\\s*:\\s*none/.test(sa) ? 'none' : '');\n" +
	"\t\t\t\tvar vis = ('visibility' in sp) ? sp.visibility : (/visibility\\s*:\\s*hidden/.test(sa) ? 'hidden' : '');\n" +
	"\t\t\t\tif (disp === 'none' || vis === 'hidden') { return '<' + e._tag + ' hidden>'; }\n" +
	"\t\t\t\tvar keys = Object.keys(e).filter(function (k) { return !SKIP[k] && typeof e[k] !== 'function' && (e[k] === null || typeof e[k] !== 'object'); }).sort();\n" +
	// The EFFECTIVE inline style: the attribute's declarations with the object's on top, empty values
	// dropped -- the same size written at creation or written later is the same size on screen.
	"\t\t\t\tvar eff = {};\n" +
	"\t\t\t\tsa.split(';').forEach(function (d) { var kv = d.split(':'); if (kv.length === 2 && kv[1].trim()) { eff[kv[0].trim().replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); })] = kv[1].trim(); } });\n" +
	"\t\t\t\tObject.keys(sp).forEach(function (k) { if (k !== '_props' && typeof sp[k] !== 'function') { if (sp[k] === '' || sp[k] === null) { delete eff[k]; } else { eff[k] = String(sp[k]); } } });\n" +
	"\t\t\t\tvar st = JSON.stringify(Object.keys(eff).sort().map(function (k) { return k + ':' + eff[k]; }));\n" +
	"\t\t\t\treturn '<' + e._tag + ' ' + keys.map(function (k) { return k + '=' + e[k]; }).join(' ') + ' ' + st + '>' +\n" +
	"\t\t\t\t\t(e.children || []).map(ser).join('');\n" +
	"\t\t\t}\n" +
	// ORDER-FREE: a chain's repeat copies are appended as they are grown, so the same picture can
	// sit in the layer in a different order depending on which zoom grew them first.
	"\t\t\treturn labelsLayer.children.map(ser).sort().join('\\n');\n" +
	"\t\t},\n" +
	// Overlapping pairs of DRAWN label boxes, at the size the text is drawn at now: read off the DOM
	// (position, anchor, rotation, visibility), sized by the banked widths at the current scale.
	"\t\toverlaps: function () {\n" +
	"\t\t\tvar fsz = effectiveFontSize(), items = [], i, j, n = 0;\n" +
	"\t\t\tfunction shown(t) { return t && t.style.visibility !== 'hidden' && t.style.display !== 'none'; }\n" +
	"\t\t\tfunction rot(t) { var m = /rotate\\(([-0-9.e]+)/.exec(t.getAttribute('transform') || ''); return m ? +m[1] : 0; }\n" +
	"\t\t\tfunction push(owner, t, w, h) {\n" +
	"\t\t\t\tif (!shown(t)) { return; }\n" +
	"\t\t\t\tvar anc = t.getAttribute('text-anchor') || 'start';\n" +
	"\t\t\t\titems.push({ o: owner, b: Geom.orientedLabelBox(+t.getAttribute('x'), +t.getAttribute('y'), w, h,\n" +
	"\t\t\t\t\tanc === 'middle' ? 'middle' : (anc === 'end' ? 'end' : 'start'), 'top', rot(t), fsz) });\n" +
	"\t\t\t}\n" +
	"\t\t\tdoc.nodes.forEach(function (nd) { var ne = nodeEls[nd.id]; if (ne && !ne.empty) { push('n' + nd.id, ne.text, labelBoxWidth(ne), dataLabelBoxHeight(ne.lineCount)); } });\n" +
	"\t\t\tdoc.links.forEach(function (l) { var le = linkEls[l.id]; if (!le || le.empty) { return; }\n" +
	"\t\t\t\tvar w = labelBoxWidth(le), h = dataLabelBoxHeight(le.lineCount);\n" +
	"\t\t\t\tpush('l' + l.id, le.text, w, h);\n" +
	"\t\t\t\t(le.repeats || []).forEach(function (r) { push('l' + l.id, r.text, w, h); }); });\n" +
	"\t\t\tfor (i = 0; i < items.length; i++) { for (j = i + 1; j < items.length; j++) {\n" +
	"\t\t\t\tif (items[i].o !== items[j].o && Collide.boxOverlapDepth(items[i].b, items[j].b) > 1e-9) { n++; } } }\n" +
	"\t\t\treturn { pairs: n, labels: items.length };\n" +
	"\t\t}"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return true; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
	return false;
}

setUnitSet('us');
L.buildLayers();
const W = 1400, H = 700;
L.setCanvas(W, H);
L.applySaved(JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples/Net3.lwn'), 'utf8')));
L.buildDom();
L.noteMapSized();
const doc = L.getDoc();
// Every field on, so the shed and the hide have work to do at every zoom: a bank compared on a
// drawing where nothing sheds proves nothing about the shed.
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
// A few meters on the longest pipe, so a customer label's placement is in the bank too.
const longest = doc.links.slice().sort(function (a, b) {
	const pa = doc.nodes.find(n => n.id === a.from), pb = doc.nodes.find(n => n.id === a.to);
	const qa = doc.nodes.find(n => n.id === b.from), qb = doc.nodes.find(n => n.id === b.to);
	return Math.hypot(qa.x - qb.x, qa.y - qb.y) - Math.hypot(pa.x - pb.x, pa.y - pb.y);
})[0];
{
	const a = doc.nodes.find(n => n.id === longest.from), b = doc.nodes.find(n => n.id === longest.to);
	for (let i = 1; i <= 3; i++) {
		const t = i / 4;
		L.addCustomer(a.x + (b.x - a.x) * t + 2, a.y + (b.y - a.y) * t + 2, { link: longest.id });
	}
}
L.solveNative();
L.refreshLabelText();

// A view where the labels are on and crowded: the model's own centre, zoomed so it spans the canvas.
const st = L.state();
{
	let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
	doc.nodes.forEach(function (n) { x0 = Math.min(x0, n.x); x1 = Math.max(x1, n.x); y0 = Math.min(y0, n.y); y1 = Math.max(y1, n.y); });
	st.s = Math.min(W / (x1 - x0), H / (y1 - y0)) * Number(process.env.ZOOMX || 6);
	st.tx = W / 2 - st.s * (x0 + x1) / 2;
	st.ty = H / 2 - st.s * (y0 + y1) / 2;
}
const CX = W / 2, CY = H / 2;
// One wheel notch, settled -- what the 120 ms debounce does, without waiting for it.
function notch(f) { L.zoomAbout(CX, CY, f); L.reshedNow(); }
function hash(s) { return require('crypto').createHash('sha1').update(s).digest('hex').slice(0, 12); }
// The gesture every comparison below is made on: anchor, three notches in, three back out.
const SEQ = [1, 1.1, 1.1, 1.1, 1 / 1.1, 1 / 1.1, 1 / 1.1];
function runSequence() {
	const out = [];
	SEQ.forEach(function (f) {
		const p = L.passes();
		notch(f);
		out.push({ s: st.s, drawn: L.drawn(), o: L.overlaps(), passes: L.passes() - p });
	});
	return out;
}

// **THE UNCACHED REFERENCE RUNS IN ITS OWN PROCESS**, the same gesture with the bank switched off.
// Not in this one: the zoom pass is not a pure function of the scale (below), so a reference pass
// run here would start from whatever state the bank had just left and answer a different question.
if (process.env.LBC_CHILD === 'uncached') {
	L.setEnabled(false);
	const seq = runSequence();
	process.stdout.write(JSON.stringify(seq.map(function (r) { return { s: r.s, h: hash(r.drawn), o: r.o }; })));
	process.exit(0);
}
const ref = JSON.parse(require('child_process').execFileSync(process.execPath, [__filename],
	{ env: Object.assign({}, process.env, { LBC_CHILD: 'uncached' }), maxBuffer: 1 << 26 }).toString());

console.log('--- 1. coming back to a bucket runs no pass and draws the identical layout ---');
const seq = runSequence();
const A = seq[0].s;
ok('the labels are drawn at the starting view (or nothing below means anything)', !L.labelsHidden() && seq[0].o.labels > 50,
	seq[0].o.labels + ' labels drawn');
ok('four buckets visited for the first time cost one pass each',
	seq.slice(0, 4).every(function (r) { return r.passes === 1; }), seq.slice(0, 4).map(r => r.passes).join(','));
ok('...and going back through three of them runs ZERO passes',
	seq.slice(4).every(function (r) { return r.passes === 0; }), seq.slice(4).map(r => r.passes).join(','));
const pairs = [[4, 2], [5, 1], [6, 0]];
ok('...each revisit draws exactly what the first visit drew',
	pairs.every(function (p) { return seq[p[0]].drawn === seq[p[1]].drawn; }),
	pairs.map(function (p) { return 'bucket ' + p[1] + ' ' + (seq[p[0]].drawn === seq[p[1]].drawn ? 'same' : 'DIFFERENT'); }).join(', '));
ok('...and every first visit is exactly the uncached pass at that scale',
	seq.slice(0, 4).every(function (r, i) { return hash(r.drawn) === ref[i].h; }),
	seq.slice(0, 4).map(function (r, i) { return hash(r.drawn) === ref[i].h ? 'same' : 'DIFFERENT'; }).join(', '));
ok('the view came back to the scale it started at', Math.abs(st.s / A - 1) < 1e-9, st.s + ' vs ' + A);
// **WHAT THE BANK FIXES ON THE WAY: THE UNCACHED ZOOM PASS IS NOT A PURE FUNCTION OF THE SCALE.**
// Run twice at one scale it alternates between two answers, so going in and back out drew a
// different picture from the one that was there. Printed, not asserted: it is the reference's
// property, and a later placer may cure it.
{
	const same = [[4, 2], [5, 1], [6, 0]].filter(function (p) { return ref[p[0]].h === ref[p[1]].h; }).length;
	console.log('       (uncached, the same three revisits drew the first visit\'s picture ' + same + ' of 3 times)');
}

console.log('\n--- 4. no overlap introduced ---');
ok('at every notch, first visit or revisit, the banked layout has the uncached first visit\'s overlaps',
	[0, 1, 2, 3, 4, 5, 6].every(function (i) {
		const first = i < 4 ? i : (i === 4 ? 2 : i === 5 ? 1 : 0);
		return seq[i].o.pairs === ref[first].o.pairs;
	}),
	seq.map(function (r) { return r.o.pairs; }).join(',') + ' overlapping pairs; uncached '
	+ ref.map(function (r) { return r.o.pairs; }).join(','));

console.log('\n--- 3. between two notches the bucket is the ZOOMED-OUT one, and the view is not snapped ---');
{
	const C = L.cache();
	// Just inside bucket 0, above its own notch: rounds DOWN to 0 (the notch at A), not up to 1.
	let p = L.passes();
	L.zoomAbout(CX, CY, 1.09); L.reshedNow();
	ok('a scale 9% above a notch is in that notch\'s bucket, already banked: no pass',
		L.bucketOf(st.s) === 0 && L.passes() === p, 'bucket ' + L.bucketOf(st.s) + ', ' + (L.passes() - p) + ' passes');
	ok('...the view stays where it was put (not snapped)', Math.abs(st.s / (A * 1.09) - 1) < 1e-9, (st.s / A).toFixed(4) + ' x the notch');
	L.zoomAbout(CX, CY, 1 / 1.09); L.reshedNow();
	// Just BELOW the notch at A: nearest would say bucket 0, outward says -1, the notch at A/1.1.
	p = L.passes();
	L.zoomAbout(CX, CY, 0.98); L.reshedNow();
	ok('a scale 2% below a notch takes the notch BELOW it (outward), not the nearest',
		L.bucketOf(st.s) === -1, 'bucket ' + L.bucketOf(st.s));
	const e = C.entries[-1];
	ok('...that bucket was laid out at the zoomed-out notch\'s own scale',
		!!e && Math.abs(e.scale / (A / 1.1) - 1) < 1e-9, e ? (e.scale / A).toFixed(4) + ' x A' : 'no entry');
	ok('...in one pass, and it is final: no second pass at the exact scale', L.passes() - p === 1, (L.passes() - p) + ' passes');
	ok('...while the view stays at the scale the reader chose', Math.abs(st.s / (A * 0.98) - 1) < 1e-9, (st.s / A).toFixed(4) + ' x A');
	const between = L.overlaps();
	p = L.passes();
	L.zoomAbout(CX, CY, 0.95 / 0.98); L.reshedNow();
	ok('a second scale inside the same bucket is a hit', L.passes() === p && L.bucketOf(st.s) === -1,
		(L.passes() - p) + ' passes, bucket ' + L.bucketOf(st.s));
	// The notch's own layout, drawn at the notch.
	L.zoomAbout(CX, CY, (A / 1.1) / st.s); L.reshedNow();
	const atNotch = L.overlaps();
	ok('between notches, the notch\'s layout at the smaller text overlaps no more than at the notch',
		between.pairs <= atNotch.pairs, between.pairs + ' vs ' + atNotch.pairs + ' overlapping pairs');
	// ZOOM TO FIT MOVES THE NOTCHES. The wheel's notches after a fit are counted from where the fit
	// lands, so the buckets must be too, or every notch after a fit would be "between notches". On
	// Net3 the fit is past the labeling threshold, so no settle runs there: the first settle that
	// draws labels after it starts the buckets instead.
	L.zoomExtent();
	L.reshedNow();
	let k = 0;
	while (L.labelsHidden() && k++ < 40) { notch(1.1); }
	const atS = st.s;
	ok('after Zoom to fit, the first settle that draws labels starts the buckets at its own scale',
		!L.labelsHidden() && Math.abs(C.anchor / atS - 1) < 1e-9 && L.bucketOf(atS) === 0,
		(C.anchor / atS).toFixed(6) + ' x the scale, ' + k + ' notches in from the fit');
	notch(1.1);
	const p3 = L.passes();
	notch(1 / 1.1);
	ok('...and a notch in and back out comes back to that bucket without a pass', L.passes() === p3, (L.passes() - p3) + ' passes');
	L.zoomAbout(CX, CY, A / st.s); L.reshedNow();
}

console.log('\n--- 2. what changes the answer empties the bank ---');
// Each event on a bank holding bucket 0 (here) and bucket 1 (one notch in): the event happens
// here, then the reader goes to bucket 1. A sound bank lays bucket 1 out again; an unsound one
// serves the picture it banked before the event.
function texts() {
	return L.drawn().split('\n').map(function (l) { return (l.match(/_text=[^ ]*/g) || []).join(''); }).sort().join('|');
}
const EVENTS = {
	'a time step (new values from the run)': { visible: true, fn: function () {
		const copy = JSON.parse(JSON.stringify(L.solve()));
		Object.keys(copy.pressures || {}).forEach(function (k) { copy.pressures[k] = copy.pressures[k] * 1.37 + 3; });
		Object.keys(copy.flows || {}).forEach(function (k) { copy.flows[k] = copy.flows[k] * 2.9; });
		L.applySolveResult(copy);
	} },
	'a Calculate after an edit': { visible: true, fn: function () {
		doc.nodes.forEach(function (n) { if (typeof n._demand === 'number') { n._demand *= 3; } });
		L.solveNative();
	} },
	'a label setting': { visible: true, fn: function () {
		ls.node.elev = !ls.node.elev;
		L.refreshLabelText();
	} },
	'an element moved': { visible: true, fn: function () {
		const n = doc.nodes[Math.floor(doc.nodes.length / 2)];
		n.x += 300 / st.s; n.y -= 200 / st.s;
		L.updateNode(n.id, false);
	} },
	// Nothing on this view need move for a resize, so only the pass is asserted.
	'a window resize': { visible: false, fn: function () { L.setCanvas(700, 420); } }
};
function runEvent(ev) {
	L.setCanvas(W, H);
	L.zoomAbout(CX, CY, A / st.s);
	L.refreshLabelText();
	L.reshedNow();
	notch(1.1);
	const staleDrawn = L.drawn(), staleTexts = texts();
	notch(1 / 1.1);
	const p0 = L.passes();
	ev.fn();
	notch(1.1);
	const r = { fresh: L.passes() - p0 === 1, why: L.miss(), sameAsStale: L.drawn() === staleDrawn,
		textsChanged: texts() !== staleTexts };
	L.zoomAbout(CX, CY, 1 / 1.1);
	return r;
}
function sound(ev, r) { return r.fresh && (!ev.visible || !r.sameAsStale); }
Object.keys(EVENTS).forEach(function (name) {
	const ev = EVENTS[name], r = runEvent(ev);
	ok(name + ': the next visit to a banked bucket is a fresh pass' + (ev.visible ? ', not the banked picture' : ''),
		sound(ev, r), 'fresh ' + r.fresh + ' (' + r.why + '), same as banked ' + r.sameAsStale);
});

console.log('\n--- 2b. and with the invalidation switched off, those same checks fail ---');
// THE MUTATION TEST. Without it every check above could pass because nothing it changes reaches
// the bank. Switched off, each event must leave the bank serving the picture from before it.
L.setInvalidates(false);
let caught = 0;
Object.keys(EVENTS).forEach(function (name) {
	const ev = EVENTS[name], r = runEvent(ev), bad = !sound(ev, r);
	if (bad) { caught++; }
	ok(name + ': with invalidation off the check above fails', bad,
		'fresh ' + r.fresh + ', same as banked ' + r.sameAsStale + (ev.visible ? ', values/content changed ' + r.textsChanged : ''));
});
L.setInvalidates(true);
ok('every event is caught when the invalidation is disabled', caught === Object.keys(EVENTS).length,
	caught + ' of ' + Object.keys(EVENTS).length);

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

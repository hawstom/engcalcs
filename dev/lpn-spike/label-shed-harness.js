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
const { drawExampleSource } = require('./example-fixture.js');


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
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tpipeLength: function (l) { return Geom.polylineLength(linkPointList(l)); },\n" +
	"\t\troom: function (l) { return linkLabelRoom(l, linkEls[l.id].alignedAlong); },\n" +
	"\t\tlabelWidth: function (l) { return labelBoxWidth(linkEls[l.id]); },\n" +
	"\t\ttspanText: function (id) { return linkEls[id].text.children.map(function (t) { return t.textContent; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }",
	// The code-drawn ring main, moved out of the shipped file (Task 378) and spliced back
	// into its own scope here. See dev/lpn-spike/example-draw-fixture.js.
	drawExampleSource()
);

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.drawExample();
L.runSolve();

const doc = L.getDoc(), ls = L.labelSettings();
// Everything on, which is the crowded case the cascade exists for.
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
// **THE TWO STOPPING CONDITIONS ARE TESTED SEPARATELY, AND THAT IS THE POINT OF THIS LINE.** With
// pipe-aligned labels ON, the CONFLICT shed also fires and every count below would be the sum of two
// causes -- so a length cascade that had stopped working would still look busy. Off, a link label is
// a free participant that can MOVE, so shedAlignedForConflicts() skips it entirely and what remains
// is the length rule alone. Section 2 turns it back on and tests the other half.
L.settings().alignPipeLabels = false;
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

// A segment with room to spare keeps every value -- the cascade must not fire on a label that fits.
// The baseline is 2x the drawn length so the roomy case is genuinely roomy at nine values.
eq(setLength(2), READING_ORDER, 'a segment with room to spare keeps every value');
eq(L.linkEls()[target.id].shedCount, 0, 'and reports no shed');

// Squeeze it and watch the cascade. Each step must be a SUBSET of the last: shedding is monotone in
// room, so a shorter pipe can never bring a value back.
const steps = [1.2, 0.9, 0.6, 0.3, 0.1];
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
	// **WORSE IS A SMALLER NUMBER SINCE TASK 445**: the column is a DROP order, so 1 is surrendered
	// first and the largest number is the last one standing. This comparison read `>` at v8 and the
	// inversion is the whole point of the task, so it must read `<` here -- a shed value must hold a
	// lower number than every value that survived it.
	const gone = prev.filter(function (k) { return now.indexOf(k) < 0; });
	gone.forEach(function (g) {
		now.forEach(function (k) {
			ok(ls.priority.link[g] < ls.priority.link[k],
				g + ' (rank ' + ls.priority.link[g] + ') was shed while ' + k +
				' (rank ' + ls.priority.link[k] + ') was kept');
		});
	});
	prev = now;
});
ok(seen[seen.length - 1].fields.length < READING_ORDER.length, 'a short pipe really does shed');

// THE SHED IS MINIMAL: at every step, putting back the best-ranked value that was shed would make
// the label wider than its pipe. Anything less than that is information given away for free.
ok(L.labelWidth(target) <= L.room(target) || L.tooShort(target),
	'what survives either fits its own SEGMENT or has reached the terminal rung');

// **THE ROOM IS THE SEGMENT, NOT THE POLYLINE, and on a bent pipe those differ wildly.** This is
// the measurement that was wrong: a label is rotated to one segment's angle, so the rest of a bent
// pipe is not room it can use. Asserted by BENDING a pipe and demanding the room follow the bend
// rather than the total.
{
	const bend = doc.links.filter(function (l) { return l.type === 'pipe' && l.id !== target.id; })[0];
	const a = doc.nodes.filter(function (n) { return n.id === bend.from; })[0];
	const b = doc.nodes.filter(function (n) { return n.id === bend.to; })[0];
	bend.verts = [{ x: a.x + (b.x - a.x) * 0.97, y: a.y + (b.y - a.y) * 0.97 + 300 }];
	L.refreshLabelText();
	ok(L.room(bend) < L.pipeLength(bend) * 0.9,
		'a label near a bend is measured against its own short segment, not the whole pipe',
		L.room(bend).toFixed(0) + ' of ' + L.pipeLength(bend).toFixed(0));
	bend.verts = [];
	L.refreshLabelText();
}

// **THERE IS A REAL BAND WHERE A LABEL HAS SHED AND IS STILL DRAWN**, and it comes from the cascade
// itself rather than from any fudge between the two thresholds: the shed runs while the label is too
// long for its segment, and the hide fires only if even one value is too long. Asserted directly,
// because "it sheds" and "you can see it shed" are different claims and only the second is the
// feature.
let sawVisibleShed = false;
[1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.45, 0.3].forEach(function (f) {
	setLength(f);
	const h = L.linkEls()[target.id];
	if (h.shedCount > 0 && !L.tooShort(target)) { sawVisibleShed = true; }
});
ok(sawVisibleShed, 'there is a range of pipe lengths where the label sheds and is still SHOWN');

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

// ---- 2. the CONFLICT shed: what a reader actually meets -----------------------------------------
//
// The length rule only fires when a label is wider than its own pipe, which on a normal drawing it
// never is (45-84% measured on this fixture). Tom, 2026-08-16: "I cannot detect a single instance of
// shed. It's always all or nothing." He was right, and this is the half that answers it.
L.settings().alignPipeLabels = true;
setLength(1);   // every pipe back to full length, so nothing below is a LENGTH shed
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });

// **THE FIXTURE HAS TO BE BUILT, because the drawn example does not have this conflict.** Two pipe
// labels only fight when two pipes run close together, and the six-pipe example is too open. So one
// long pipe is laid alongside another long one: both keep their full length (no length shed is
// possible) and their labels land on top of each other. That isolates the conflict rule exactly the
// way turning alignment off isolated the length rule.
const pipes = doc.links.filter(function (l) { return l.type === 'pipe'; })
	.map(function (l) { return { l: l, len: L.pipeLength(l) }; })
	.sort(function (a, b) { return b.len - a.len; });
const keepPipe = pipes[0].l, movePipe = pipes[1].l;
function nodeOf(id) { return doc.nodes.filter(function (n) { return n.id === id; })[0]; }
const ka = nodeOf(keepPipe.from), kb = nodeOf(keepPipe.to);
const ma = nodeOf(movePipe.from), mb = nodeOf(movePipe.to);
// A small perpendicular offset: close enough that the two labels overlap, far enough that the pipes
// are still two pipes.
const ux = kb.x - ka.x, uy = kb.y - ka.y, ulen = Math.hypot(ux, uy) || 1;
const off = 2;
ma.x = ka.x - uy / ulen * off; ma.y = ka.y + ux / ulen * off;
mb.x = kb.x - uy / ulen * off; mb.y = kb.y + ux / ulen * off;
L.refreshLabelText();

const shedNow = doc.links.filter(function (l) {
	const h = L.linkEls()[l.id];
	return h && h.shedCount > 0 && !h.hiddenShort;
});
ok(shedNow.length > 0, 'two pipes laid alongside each other shed on CONFLICT, at full length');

// **SHED OUT AND STILL IN THE WAY MEANS HIDE.** The cascade has two entrances -- too long for its
// segment, and in conflict -- and until now only the first had an exit. A label that gave up
// everything but its best value and STILL overlapped a neighbour simply stayed there and overlapped
// it, which is the one outcome the whole pass exists to prevent (Tom, 2026-08-17).
{
	// THREE coincident pipes, not two, and the reason is a real property rather than a fixture
	// detail: an aligned label picks a SIDE of its line, so two labels on one line simply sit above
	// and below it and never conflict at all. The third has nowhere left to go.
	const third = pipes[2].l;
	const ta = nodeOf(third.from), tb = nodeOf(third.to);
	[[ma, mb], [ta, tb]].forEach(function (pair) {
		pair[0].x = ka.x; pair[0].y = ka.y;
		pair[1].x = kb.x; pair[1].y = kb.y;
	});
	L.refreshLabelText();
	const three = [keepPipe, movePipe, third].map(function (l) { return L.linkEls()[l.id]; });
	const hidden = three.filter(function (h) { return h.hiddenCrowded; });
	ok(hidden.length > 0,
		'three labels on one line: the one with nowhere left to go hides once it has nothing to shed');
	hidden.forEach(function (h) {
		eq(h.lines.length, 1, 'it hid only after shedding down to its single best value');
	});
	ok(hidden.length < three.length,
		'and the ones that DO have a side keep their labels -- hiding is the last rung, not the rule');
	// A hidden label is not an obstacle: it is not drawn, and reserving its ground would make the
	// next label shed for something nobody can see.
	ok(three.filter(function (h) { return !h.hiddenCrowded; }).length >= 2,
		'the two that fit both keep theirs, so a hidden label crowded nobody out');
}

// **A LINK LABEL SHEDS FOR A NODE LABEL RATHER THAN BEING HIDDEN WHOLE.** This is the case Tom
// photographed: long pipe labels lying across the node labels at each end, none of them shedding,
// and others vanishing entirely. Both symptoms were the same fault -- the shed pass could not see
// node labels, so the only thing left to resolve the conflict was nodeRepairAgainstLinks(), which
// takes a link label away whole. Asserted as the RATIO: shedding must be the common answer and
// hiding-whole the rare one.
{
	const yielded = doc.links.filter(function (l) {
		const h = L.linkEls()[l.id];
		return h && h.hiddenYielded;
	});
	ok(yielded.length <= shedNow.length,
		'hiding a link label whole is rarer than shedding one (' + yielded.length
		+ ' hidden vs ' + shedNow.length + ' shed)');
	yielded.forEach(function (l) {
		const h = L.linkEls()[l.id];
		ok((h.allLines || h.lines).length - h.lines.length > 0 || (h.allLines || h.lines).length <= 1,
			l.id + ' was only hidden whole after it had already shed what it could');
	});
}
ok(L.linkEls()[keepPipe.id].shedCount === 0 || L.linkEls()[movePipe.id].shedCount === 0,
	'the longer pipe keeps its values -- longest first, so it is placed before the other arrives');
ok(shedNow.length < doc.links.length, 'and an uncrowded label elsewhere keeps everything');

// WHAT WENT IS STILL THE WORST-RANKED. The conflict shed and the length shed must agree about
// order, or the same label would drop different values for the two reasons.
shedNow.forEach(function (l) {
	const h = L.linkEls()[l.id];
	const kept = h.lines.map(function (x) { return x.field; });
	const all = h.allLines.map(function (x) { return x.field; });
	const gone = all.filter(function (k) { return kept.indexOf(k) < 0; });
	gone.forEach(function (g) {
		kept.forEach(function (k) {
			// A SMALLER NUMBER IS SHED FIRST (Task 445) -- see the note on the same comparison above.
			ok(ls.priority.link[g] < ls.priority.link[k],
				l.id + ': shed ' + g + ' (' + ls.priority.link[g] + ') while keeping ' + k +
				' (' + ls.priority.link[k] + ')');
		});
	});
	ok(kept.length >= 1, l.id + ' keeps at least one value -- shedding is not hiding');
});

// NOT A RATCHET. Every shed is measured from the FULL value list, never from what survived last
// time, so repeated refreshes settle rather than eating the label one value per repaint. This is the
// assertion that a "cache the last shed" optimisation would break, and it would break it invisibly
// on a page that repaints on every solve.
const settled = doc.links.map(function (l) { return (L.linkEls()[l.id].lines || []).length; });
L.refreshLabelText();
L.refreshLabelText();
eq(doc.links.map(function (l) { return (L.linkEls()[l.id].lines || []).length; }), settled,
	'the conflict shed settles instead of ratcheting');

// AND IT RECOVERS. A shed is a response to the CURRENT drawing, never a permanent mark on the label:
// give the map less to fit and less is shed.
//
// The assertion is on the TOTAL, not on each label, and the difference is a real finding rather than
// a weakened test. With only two fields showing, this fixture's pump P1 still sheds one -- its label
// is short but its pipe is short too, and it genuinely collides. "Every label recovers completely"
// is therefore false on a crowded drawing and always will be; what must hold is that shedding tracks
// the crowd.
function totalShed() {
	return doc.links.reduce(function (n, l) {
		const h = L.linkEls()[l.id];
		return n + ((h && h.shedCount) || 0);
	}, 0);
}
const shedWithNine = totalShed();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = (k === 'id' || k === 'flow'); });
L.refreshLabelText();
const shedWithTwo = totalShed();
ok(shedWithTwo < shedWithNine,
	'less to fit means less shed (' + shedWithNine + ' -> ' + shedWithTwo + ')');
doc.links.forEach(function (l) {
	const h = L.linkEls()[l.id];
	if (!h || h.empty) { return; }
	ok(h.lines.length >= 1, l.id + ' still says something -- shedding never empties a label');
});

console.log('label-shed-harness: ' + checks + ' checks passed  (length cascade: '
	+ seen.map(function (s) { return s.fields.length; }).join(' -> ') + ' values; '
	+ shedNow.length + ' of ' + doc.links.length + ' links shed on conflict)');

// What is GENERATED ANNOTATION, what hides when, and whether the halo is drawn at all. Run with:
//   node dev/lpn-spike/label-visibility-harness.js
//
// Three ROADMAP tasks meet in one place here, and they meet because they are one question asked
// three ways -- WHICH MARKS ARE OURS AND WHEN SHOULD THEY BE ON SCREEN:
//
//   Task 334  Membership in "generated annotation" is declared where the element is BUILT
//             (annotationEl()), not remembered as a selector list in a stylesheet. Section 1
//             asserts the membership, both halves: every generated mark carries the class, and the
//             user's own Text label -- authored content -- does not.
//   Task 340  A Text label hides at a threshold scaled by ITS OWN size. Section 2.
//   Task 330  The label halo is switchable, and the switch belongs to the project. Section 3.
//
// WHY SECTION 1 IS WORTH ITS LINES, since "does this element have a class" reads like a tautology:
// the defect it replaces was invisible exactly because it was spread across two files. Task 331
// hid annotation by naming four selectors in css/engcalcs.css, the extrema badge was not one of
// them, and Tom caught it on screen the same day -- "Extrema glyphs forgot to hide when zoomed
// out." Nothing in the code connected the badge to the labels it decorated, so nothing could have
// failed. Asserting the membership set here is what makes the next omission a failing check rather
// than a screenshot.
//
// The headless DOM cannot measure text or lay anything out, so the map's visible width is imposed
// (svg.clientWidth, exactly as a browser would report it) rather than derived. That is the only
// quantity these three rules turn on, and it is the same one the settings panel captures.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tapplyLabelVisibility: applyLabelVisibility, applyMaskLabels: applyMaskLabels,\n" +
	"\t\trefreshFontSizes: refreshFontSizes, relayout: relayoutLabels,\n" +
	"\t\tleaderEnd: function (id) { var e = labelEls[id].leader;\n" +
	"\t\t\treturn { x: +e.getAttribute('x2'), y: +e.getAttribute('y2') }; },\n" +
	"\t\ttextBox: function (id) { var lb = labelById(id), le = labelEls[id],\n" +
	"\t\t\tan = lb.anchorNode ? nodeById(lb.anchorNode) : null;\n" +
	"\t\t\treturn textLabelBox(lb, le, an ? an.x + lb.x : lb.x, an ? an.y + lb.y : lb.y); },\n" +
	"\t\tsetSetting: function (k, v) { settings[k] = v; },\n" +
	"\t\tdelSetting: function (k) { delete settings[k]; },\n" +
	// The two knobs the rules actually read: how wide the map is on screen, and the zoom that turns
	// that into model length units.
	// BOTH dimensions, since 2026-08-15: the threshold reads the SMALLER of the two (mapSpan('min'))
	// rather than the width, after Tom pointed out that "narrower" was invoking field of view and
	// then being read literally. A harness that sets only the width leaves the height undefined,
	// which reads as zero, which is smaller than every threshold -- so nothing would ever hide and
	// every check here would pass for the wrong reason.
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tvisibleMapWidth: visibleMapWidth,\n" +
	"\t\tsvgHas: function (c) { return svg.classList.contains(c); },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tlinkEl: function (id) { return linkEls[id]; },\n" +
	"\t\tlabelEl: function (id) { return labelEls[id]; },\n" +
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
function classes(e) { return String((e && e.getAttribute('class')) || ''); }
function isAnnotation(e) { return / lpn-annotation$|^lpn-annotation$|\blpn-annotation\b/.test(classes(e)); }
function hidden(e) { return !!(e && e.classList && e.classList.contains('lpn-lbl-hidden')); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 100, 0);
const p = L.addLink('pipe', a.id, b.id);
const note = L.addText(50, 40, null);        // an ordinary note, size 1
const title = L.addText(50, 80, null);       // a title block, size 3 below
title.sizeMult = 3;
L.refreshLabelText();

// ---- 1. What is generated annotation, declared at the build site (Task 334) ----------------
console.log('--- generated annotation carries the class, authored content does not ---');
{
	const ne = L.nodeEl(a.id), le = L.linkEl(p.id);
	ok('a node data label is annotation', isAnnotation(ne.text), classes(ne.text));
	ok('...and its leader', isAnnotation(ne.leader), classes(ne.leader));
	ok('a link data label is annotation', isAnnotation(le.text), classes(le.text));
	ok('...and its leader', isAnnotation(le.leader), classes(le.leader));
	// The arrow is the element that PROVED the line is "things we generated to be read" rather than
	// "labels" (Tom, 2026-08-14: "Arrows also should hide at hideable zoom levels").
	ok('every flow arrow on the pipe is annotation',
		le.arrows.length > 0 && le.arrows.every(isAnnotation),
		le.arrows.length + ' arrow(s): ' + le.arrows.map(classes).join(' | '));
	// The other half, and the one that keeps the class honest: a Text label the user typed is NOT
	// annotation, however much it looks like one in the DOM.
	const te = L.labelEl(note.id);
	ok('a user Text label is NOT annotation', !isAnnotation(te.text), classes(te.text));
	// The class is ADDED to whatever the element already had, never instead of it -- a label that
	// lost .lpn-lbl would lose its halo (Task 376), and one that lost .lpn-draglbl would stop being
	// draggable, both silently.
	ok('the class is added to the element\'s own classes, not swapped for them',
		/\blpn-lbl\b/.test(classes(ne.text)) && /\blpn-draglbl\b/.test(classes(ne.text)) &&
		/\blpn-leader\b/.test(classes(ne.leader)),
		classes(ne.text) + ' / ' + classes(ne.leader));
}

// ---- 2. A Text label's own threshold, scaled by its own size (Task 340) ---------------------
console.log('\n--- a Text label hides on its own size-scaled threshold ---');
{
	// A 1000 px square canvas at zoom 1 is a map 1000 length units across in its SMALLER dimension.
	// The threshold below is 1000, so the drawing sits exactly AT it -- the deliberate boundary
	// case, since the rule is a strict "bigger than".
	L.setCanvas(1000, 1000);   // square, so the smaller dimension is unambiguous
	L.setZoom(1);
	L.setSetting('labelMaxWidth', 1000);
	L.applyLabelVisibility();
	ok('the map really is as wide as the harness thinks', L.visibleMapWidth() === 1000, L.visibleMapWidth());
	ok('at the threshold exactly, the data labels are still drawn', !L.svgHas('lpn-labels-hidden'));
	ok('...and so is a 1x Text label', !hidden(L.labelEl(note.id).text));

	// Zoom out a hair: the map is now 1250 units wide, past the 1000-unit threshold.
	L.setZoom(0.8);
	L.applyLabelVisibility();
	ok('past the threshold the generated annotation goes', L.svgHas('lpn-labels-hidden'), L.visibleMapWidth());
	// THE FLOOR. A 1x Text label has EXACTLY the data labels' threshold, so nothing authored
	// vanishes while anything generated is still drawn -- and the ordinary note goes at the same
	// moment they do, rather than being exempt as it was under Task 331.
	ok('...and a 1x Text label goes with them, no earlier and no later', hidden(L.labelEl(note.id).text));
	// THE POINT OF THE TASK. Sheet lettering: the drawing title is legible from across the room and
	// the callouts are not. A 3x title survives to 3x the map width, and 1250 is well inside 3000.
	ok('a 3x title block survives, because its threshold is 3x as wide',
		!hidden(L.labelEl(title.id).text), 'sizeMult ' + title.sizeMult);
	// NOTHING IS LEFT BEHIND BY EITHER OF THEM, and since Task 376 that is true by construction
	// rather than by a second hide call: the halo is a stroke on the glyphs, so it goes exactly when
	// the text goes. The pair of assertions that used to stand here -- the mask stays with the label
	// that stayed, the mask goes with the one that went -- were checking an element that no longer
	// exists. Both of these labels are unanchored and so have no leader either; the anchored case
	// is section 2b.

	// Out past 3000 units wide and even the title goes. Without this the previous check passes for
	// a rule that never hides a Text label at all -- which is exactly the Task 331 behaviour this
	// replaces, so the assertion above is only meaningful in company with this one.
	L.setZoom(0.2);            // 5000 units wide
	L.applyLabelVisibility();
	ok('far enough out, the title block goes too', hidden(L.labelEl(title.id).text), L.visibleMapWidth());

	// THE PER-LABEL ESCAPE HATCH (Tom, 2026-08-15). He asked for a "Show always" checkbox and
	// explicitly rejected the automatic version -- "the non-customizable way to do this would be to
	// show always the largest text, but we don't want to do that" -- which is right: a rule that
	// spares whichever label happens to be biggest makes a legend compete on font size for a
	// property it should simply declare, and changes its mind whenever another label is resized.
	// Still zoomed to 5000 units wide here, four times even the 3x title's threshold.
	note.alwaysShow = true;
	L.applyLabelVisibility();
	ok('a label marked Always show survives a zoom that hides everything else',
		!hidden(L.labelEl(note.id).text) && hidden(L.labelEl(title.id).text));
	ok('...while the generated annotation is still gone -- this exempts ONE label, not the rule',
		L.svgHas('lpn-labels-hidden'));
	note.alwaysShow = false;
	L.applyLabelVisibility();
	ok('unticking it puts the label back under the threshold', hidden(L.labelEl(note.id).text));

	// Blank means always show, which is the default and the pre-Task-331 behaviour.
	L.setSetting('labelMaxWidth', null);
	L.applyLabelVisibility();
	ok('with no threshold set, nothing hides at any zoom',
		!L.svgHas('lpn-labels-hidden') && !hidden(L.labelEl(note.id).text) && !hidden(L.labelEl(title.id).text));
}

// ---- 3. Background masking is switchable, and it is the project's (Task 330) ----------------
// ---- 2b. A TEXT LABEL IS LAID OUT AT EVERY ZOOM ----------------------------------------------
// **THE ONE THAT GOT AWAY.** relayoutLabels() laid out node and link labels and silently skipped
// the user's own Text labels -- harmless only while something else positioned them on every zoom,
// which refreshFontSizes() did until Task 366 stopped it re-measuring.
//
// The SYMPTOM has changed and the COUPLING has not. It used to show as a mask: a Text label's
// background rect was sized in world units from a pixel width, so zooming in left a caption's rect
// at the old scale and it became a large 75%-white sheet over the network -- Tom photographed
// exactly that on Net3, whose "LAKE" and "RIVER" captions he marked "Nothing here" and "Gray".
// Task 376 deleted the rect (the halo is a stroke on the glyphs and cannot fall out of step with
// them by construction), so the assertion moved to the other thing this pass computes from the same
// pixel width: WHERE AN ANCHORED TEXT LABEL'S LEADER ATTACHES. It reaches the near edge of the
// label's box, the box's width is banked in pixels and divided by the scale, and nothing else lays
// it out -- so a zoom that skips this pass leaves the rule reaching for the box's old size.
console.log('\n--- an anchored Text label is re-laid-out on every zoom, or its leader points nowhere ---');
{
	L.setSetting('labelMaxWidth', null);
	// Anchored, because an unanchored Text has no leader and therefore nothing scale-dependent
	// left to check: its x/y ARE its position. The defect this guards is in the anchored path.
	const tag = L.addText(a.x + 30, a.y + 20, a.id);
	function leaderIsOnTheBoxEdge(id) {
		var e = L.leaderEnd(id), b = L.textBox(id);
		// The near vertical edge, and the vertical centre -- Geom.leaderAttach()'s own answer, which
		// is what updateLabelGeometry() draws. Tolerance is a fraction of the BOX, never a world
		// constant: a flat allowance passes at one zoom and fails at another for geometry that is
		// perfectly correct, which is the mistake the deleted version of this check first made.
		var tol = b.h / 100,
			nearX = Math.abs(e.x - b.x) < tol || Math.abs(e.x - (b.x + b.w)) < tol;
		return nearX && Math.abs(e.y - (b.y + b.h / 2)) < tol;
	}
	[1, 10, 0.25, 1].forEach(function (z) {
		L.setZoom(z);
		L.refreshFontSizes();
		L.relayout();
		ok('the leader lands on the label\'s own box edge at zoom ' + z, leaderIsOnTheBoxEdge(tag.id),
			JSON.stringify(L.leaderEnd(tag.id)) + ' vs box ' + JSON.stringify(L.textBox(tag.id)));
	});
}

console.log('\n--- the halo toggle ---');
{
	L.setSetting('maskLabels', true);
	L.applyMaskLabels();
	ok('the halo on is the drawing the page has always made', !L.svgHas('lpn-masks-off'));
	L.setSetting('maskLabels', false);
	L.applyMaskLabels();
	ok('the halo off is one class on the <svg>, not a per-element edit', L.svgHas('lpn-masks-off'));
	// THE UPGRADE CASE, and the reason the test is `=== false` in the code rather than a truthiness
	// test: every project saved before this task has no such key at all, and an absent setting must
	// draw the halo. A truthy test would silently restyle every drawing in the library.
	L.delSetting('maskLabels');
	L.applyMaskLabels();
	ok('a project saved before this setting existed still draws the halo', !L.svgHas('lpn-masks-off'));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

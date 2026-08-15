// What is GENERATED ANNOTATION, what hides when, and whether the mask is drawn at all. Run with:
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
//   Task 330  Background masking is switchable, and the switch belongs to the project. Section 3.
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
	"\t\tsetSetting: function (k, v) { settings[k] = v; },\n" +
	"\t\tdelSetting: function (k) { delete settings[k]; },\n" +
	// The two knobs the rules actually read: how wide the map is on screen, and the zoom that turns
	// that into model length units.
	"\t\tsetCanvasWidth: function (w) { svg.clientWidth = w; },\n" +
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
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
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
	ok('...and so is its mask', isAnnotation(ne.mask), classes(ne.mask));
	ok('...and its leader', isAnnotation(ne.leader), classes(ne.leader));
	ok('a link data label is annotation', isAnnotation(le.text), classes(le.text));
	ok('...and so is its mask', isAnnotation(le.mask), classes(le.mask));
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
	ok('...and neither is its mask', !isAnnotation(te.mask), classes(te.mask));
	// The class is ADDED to whatever the element already had, never instead of it -- a mask that
	// lost .lpn-lbl-mask would stop being painted, and a label that lost .lpn-draglbl would stop
	// being draggable, both silently.
	ok('the class is added to the element\'s own classes, not swapped for them',
		/\blpn-lbl\b/.test(classes(ne.text)) && /\blpn-draglbl\b/.test(classes(ne.text)) &&
		/\blpn-lbl-mask\b/.test(classes(ne.mask)) && /\blpn-leader\b/.test(classes(ne.leader)),
		classes(ne.text) + ' / ' + classes(ne.mask) + ' / ' + classes(ne.leader));
}

// ---- 2. A Text label's own threshold, scaled by its own size (Task 340) ---------------------
console.log('\n--- a Text label hides on its own size-scaled threshold ---');
{
	// 1000 px of canvas at zoom 1 is a map 1000 length units wide. The threshold below is 1000, so
	// the drawing sits exactly AT it -- the deliberate boundary case, since the rule is a strict
	// "wider than".
	L.setCanvasWidth(1000);
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
	// Its mask and leader are part of the same assembly and must not be left hanging behind a
	// label that went, nor blanked out from under one that stayed.
	ok('...and its mask stays with it', !hidden(L.labelEl(title.id).mask));
	ok('the vanished note took its mask with it', hidden(L.labelEl(note.id).mask));

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
	ok('...and it takes its mask with it', !hidden(L.labelEl(note.id).mask));
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
console.log('\n--- the mask toggle ---');
{
	L.setSetting('maskLabels', true);
	L.applyMaskLabels();
	ok('masking on is the drawing the page has always made', !L.svgHas('lpn-masks-off'));
	L.setSetting('maskLabels', false);
	L.applyMaskLabels();
	ok('masking off is one class on the <svg>, not a per-element edit', L.svgHas('lpn-masks-off'));
	// THE UPGRADE CASE, and the reason the test is `=== false` in the code rather than a truthiness
	// test: every project saved before this task has no such key at all, and an absent setting must
	// mask. A truthy test would silently restyle every drawing in the library on the day this ships.
	L.delSetting('maskLabels');
	L.applyMaskLabels();
	ok('a project saved before this setting existed still masks', !L.svgHas('lpn-masks-off'));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

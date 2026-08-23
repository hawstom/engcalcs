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
//   Task 407  A Text label is on the drawing or it is not, by scenario membership -- and that is
//             the ONLY thing that hides one now. Sections 2 and 2a: 2 is the guard that no label
//             hides because of the zoom, 2a is the rule that survived.
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
// (svg.clientWidth, exactly as a browser would report it) rather than derived -- which is what lets
// section 2 sweep the zoom across four orders of magnitude.

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
	// How wide the map is on screen, and the zoom that turns that into model length units. BOTH
	// dimensions: mapSpan('min') is the house standard, so a harness that sets only the width leaves
	// the height undefined, which reads as zero -- and every span-dependent check would answer from
	// a map nobody could see.
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tvisibleMapWidth: visibleMapWidth,\n" +
	"\t\tsvgHas: function (c) { return svg.classList.contains(c); },\n" +
	// The WHOLE class string, not a membership test: section 4 asks css/engcalcs.css which of its
	// own rules would fire, and that question cannot be asked one guessed class at a time.
	"\t\tsvgClasses: function () { return svg.getAttribute('class') || ''; },\n" +
	"\t\tsetThematic: function (on) { settings.colorThematic = !!on; refreshValueColors(); },\n" +
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

// ---- 2. NO LABEL HIDES BECAUSE OF THE ZOOM ---------------------------------------------------
// Tom, 2026-08-19: *"Always show labels, Zoom level, Current view, etc.: Remove that entire concept
// from our repository now that we have good hiding and Thematic map."* A map-width threshold used
// to hide generated annotation and, scaled by each label's own size ratio, the user's Text labels
// too. It is gone, and this is the guard that keeps it gone: an implicit automatic mechanism beside
// the Visibility panel's explicit one is a thing to learn and a thing to be surprised by.
//
// The zooms below span four orders of magnitude of visible map width on purpose -- the old rule
// fired somewhere in that range for every threshold it could have been given.
console.log('\n--- nothing hides because of how far out you are ---');
{
	L.setCanvas(1000, 1000);   // square, so the smaller dimension is unambiguous
	[1, 0.8, 0.2, 0.001, 50].forEach(function (z) {
		L.setZoom(z);
		L.applyLabelVisibility();
		ok('at zoom ' + z + ' the generated annotation is drawn', !L.svgHas('lpn-labels-hidden'),
			L.visibleMapWidth() + ' units across');
		ok('...and so is a 1x Text label', !hidden(L.labelEl(note.id).text));
		ok('...and so is a 3x title block', !hidden(L.labelEl(title.id).text));
	});
}

// ---- 2a. WHAT DOES STILL HIDE A TEXT LABEL: MEMBERSHIP ----------------------------------------
// The one surviving per-label rule (Task 407). A label switched off is not on the drawing at all,
// and that is a statement about the model rather than about the view -- which is exactly why it
// survived the removal above.
console.log('\n--- a Text label switched off is not drawn ---');
{
	L.setZoom(1);
	note._active = false;   // the Base store; setProp() is the seam a UI would use
	L.applyLabelVisibility();
	ok('a label switched off in this scenario is hidden', hidden(L.labelEl(note.id).text));
	ok('...and its neighbours are untouched', !hidden(L.labelEl(title.id).text));
	delete note._active;
	L.applyLabelVisibility();
	ok('switching it back on puts it back', !hidden(L.labelEl(note.id).text));
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

// ---- 4. NO SUPPRESSOR REACHES THE USER'S OWN TEXT (Task 428) ---------------------------------
// Tom, 2026-08-18: *"Turning off Text on 'no labels' is unexpected."* Thematic mode used to put
// `.lpn-thematic` on the <svg> and css/engcalcs.css hid `.lpn-thematic .lpn-lbl` -- and a Text
// object the user typed carries `.lpn-lbl` exactly as a generated label does, so somebody's own
// writing vanished when they changed colouring mode.
//
// **THIS SECTION READS THE REAL STYLESHEET, and that is the point.** The defect lived in the JOIN
// between two files: the JS knew which elements were authored content, the CSS selector could not
// see it, and neither file was wrong on its own. A check that asserted "the svg carries class X"
// would pass against any class, including one the stylesheet hides everything with -- the stub
// would have removed the very coupling that broke. So the question asked here is the browser's own:
// GIVEN what the JS put on the <svg>, would any hiding rule in css/engcalcs.css fire on this
// element? Both halves are asserted in every state -- the generated label DOES hide, the Text
// label does NOT -- because a harness in which nothing hides at all would pass the second half
// alone, which is exactly the wrong-reason pass dev/testing-notes.md warns about.
const fs = require('fs'), path = require('path');
const CSS_PATH = path.join(__dirname, '..', '..', 'css', 'engcalcs.css');

// A deliberately SMALL CSS reader: comments out, at-rule preludes treated as nesting, every rule
// kept as {selector list, declarations}. It is not a CSS engine and does not need to be -- a
// selector shape it cannot read is recorded rather than quietly answering "no match".
function cssRules(src) {
	var s = src.replace(/\/\*[\s\S]*?\*\//g, ''), out = [], sel = '', i = 0;
	while (i < s.length) {
		var c = s.charAt(i);
		if (c === '{') {
			var pre = sel.trim(); sel = '';
			if (pre.charAt(0) === '@') { i++; continue; }   // @media/@supports: nest, don't consume
			var d = 1, j = i + 1, body = '';
			while (j < s.length) {
				var k = s.charAt(j);
				if (k === '{') { d++; } else if (k === '}') { d--; if (d === 0) { break; } }
				body += k; j++;
			}
			out.push({ sel: pre, body: body });
			i = j + 1; continue;
		}
		if (c === '}') { sel = ''; i++; continue; }
		sel += c; i++;
	}
	return out;
}
// A compound this reader understands is class tokens and nothing else. Ids, element names,
// combinators and functional pseudo-classes are recorded as unreadable.
function classTokens(compound) {
	if (!/^(\.[A-Za-z0-9_-]+)+$/.test(compound)) { return null; }
	return compound.split('.').filter(Boolean);
}
var unreadable = [];
// `svgCls` is what the JS put on the <svg>; `elCls` is the element's own class attribute. Every
// hiding rule that can reach a label is either one compound on the target or an ancestor compound
// plus a target compound -- and the only classed ancestor a label has is the <svg> itself, because
// the world and layer <g>s carry no classes (the stub builds them that way, as the page does).
function ruleHides(rule, svgCls, elCls) {
	if (!/(^|[;\s])(display\s*:\s*none|visibility\s*:\s*hidden)/.test(rule.body)) { return false; }
	var svgSet = svgCls.split(/\s+/).filter(Boolean), elSet = elCls.split(/\s+/).filter(Boolean);
	function has(set, toks) { return toks.every(function (t) { return set.indexOf(t) >= 0; }); }
	return rule.sel.split(',').some(function (one) {
		var parts = one.trim().split(/\s+/);
		if (parts.length > 2) { unreadable.push(one.trim()); return false; }
		var target = classTokens(parts[parts.length - 1]);
		if (!target) { unreadable.push(one.trim()); return false; }
		if (!has(elSet, target)) { return false; }
		if (parts.length === 1) { return true; }
		var anc = classTokens(parts[0]);
		if (!anc) { unreadable.push(one.trim()); return false; }
		return has(svgSet, anc);
	});
}
console.log('\n--- no way of hiding labels reaches a Text object the user placed ---');
{
	const RULES = cssRules(fs.readFileSync(CSS_PATH, 'utf8'));
	ok('the stylesheet parsed into rules at all', RULES.length > 50, RULES.length + ' rules');
	// The reader's own guard. The rule the original defect was written in must be one this reader
	// can actually evaluate -- if a future edit reshaped it into a form classTokens() cannot read,
	// this whole section would stop being able to see the defect and would still say ALL PASS.
	ok('the reader can evaluate an `.ancestor .target` class rule, both ways',
		ruleHides({ sel: '.lpn-labels-hidden .lpn-annotation', body: 'visibility: hidden;' },
			'lpn-labels-hidden', 'lpn-lbl lpn-annotation') &&
		!ruleHides({ sel: '.lpn-labels-hidden .lpn-annotation', body: 'visibility: hidden;' },
			'lpn-labels-hidden', 'lpn-lbl'));

	L.setZoom(1);
	function gen() { return L.nodeEl(a.id).text; }
	function own() { return L.labelEl(title.id).text; }
	function hiddenByCss(e) {
		var svgCls = L.svgClasses(), elCls = classes(e);
		return RULES.some(function (r) { return ruleHides(r, svgCls, elCls); });
	}
	function state(name) {
		ok(name + ': the generated node label is hidden', hiddenByCss(gen()),
			'svg="' + L.svgClasses() + '" el="' + classes(gen()) + '"');
		ok(name + ': the user\'s own Text is NOT', !hiddenByCss(own()),
			'svg="' + L.svgClasses() + '" el="' + classes(own()) + '"');
	}
	// Baseline, so the states below mean something: with nothing suppressed neither is hidden.
	ok('with nothing suppressed the generated label is drawn', !hiddenByCss(gen()));
	ok('...and so is the Text', !hiddenByCss(own()));

	// (a) THEMATIC MODE -- the one Tom reported.
	L.setThematic(true);
	state('thematic map');
	L.setThematic(false);
	ok('switching thematic off brings the generated label back', !hiddenByCss(gen()));
	ok('...and left the Text alone throughout', !hiddenByCss(own()));

	// (b) A SECOND ROUND, because a suppressor that latched would pass (a) once and never again:
	// the revival path (refreshLabelSuppression) has to put the generated label back every time.
	L.setThematic(true);
	state('thematic map, second time');
	L.setThematic(false);
	ok('both off again: everything is back', !hiddenByCss(gen()) && !hiddenByCss(own()));

	// The reader's blind-spot report, scoped to the selectors that could possibly reach a label.
	// A rule about print areas or tab strips is none of this check's business; one about .lpn-lbl
	// that the reader silently skipped would be.
	var blind = unreadable.filter(function (sel) {
		return /lpn-lbl|lpn-annotation|lpn-leader|lpn-draglbl/.test(sel);
	});
	ok('every hiding rule that mentions a label class was readable', blind.length === 0,
		blind.join(' | '));
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

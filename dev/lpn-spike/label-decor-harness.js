// Task 298 — the extrema badge is part of the label's footprint.
//
//   node dev/lpn-spike/label-decor-harness.js
//
// Tom, 2026-08-14: "The extrema glyph is not accounted for in the leader attachment. So it can
// overhang a steeply vertical leader when label is dragged left."
//
// applyExtremaTicks() draws two rails and a chevron hanging off the END of a decorated number, so a
// label's real right edge is further right than the <text> element's own bbox. Four things read that
// width — the leader attachment, the collision boxes, the mask rect and zoom-to-fit — and all four
// were reading the text alone.
//
// What can actually be wrong, and is what this file asserts:
//   * the badge's reach measured from the WIDEST DECORATED line, which is often not the widest line;
//   * the reach going to zero when nothing is decorated, which is also how the Task 190 "mark
//     highest and lowest" toggle arrives here — there is no second code path for the switch;
//   * the leader attaching left of the badge, i.e. drawing the rule straight through it.
//
// The leader half is checked against the REAL geometry from js/lpn-geom.js, not a copy: the defect
// was in what got PASSED to it, and a re-implementation here would test the wrong thing.
//
// UPDATED FOR TASK 328, which turned the leader around. The endpoint is now STORED and the text
// hangs off it, so the box width no longer decides where the rule ends -- it decides where the TEXT
// starts. The invariant is the same one and the failure looks identical on screen: hang the box off
// the text width alone and the badge reaches PAST the endpoint, straight across the rule. Only the
// function that has to know it moved, from updateDataLeader() to dataLabelOrigin().

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');
const Geom = require('../../js/lpn-geom.js').lpnGeom;

function extract(name) {
	const re = new RegExp('(?:async )?function ' + name + '\\s*\\(');
	const at = src.search(re);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = src.indexOf('{', at), depth = 0, end = i;
	for (; end < src.length; end++) {
		if (src[end] === '{') { depth++; }
		else if (src[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return src.slice(at, end);
}

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// ---- the seams, and nothing more ----------------------------------------
// The badge's own dimensions come from the file, so a future retune of the rail moves these
// assertions with it instead of stranding them on a copied number.
const TICK_GAP = +(src.match(/var TICK_GAP = ([\d.]+);/) || [])[1];
const TICK_LENGTH = +(src.match(/var TICK_LENGTH = ([\d.]+);/) || [])[1];
report(TICK_GAP > 0 && TICK_LENGTH > 0, 'badge dimensions read out of the file', `gap ${TICK_GAP}, rail ${TICK_LENGTH}`);
const PAD = TICK_GAP + TICK_LENGTH;

let tf = 1;
function textFactor() { return tf; }
// A <text> whose tspans report the widths we hand it — getComputedTextLength() is the one browser
// call measureDecorRight() makes.
function fakeText(widths) {
	return { childNodes: widths.map(w => ({ getComputedTextLength: () => w })) };
}

// ADVERSE_FRAC comes out of the file for the same reason the badge dimensions do -- a retune of the
// hysteresis must move these assertions rather than strand them on a copied number.
const ADVERSE_FRAC = +(src.match(/var ADVERSE_FRAC = ([\d.]+);/) || [])[1];
eval([extract('measureDecorRight'), extract('labelBoxWidth'), extract('dataLabelOrigin')].join('\n'));

// ---- 1. the reach itself ------------------------------------------------
{
	const lines = [{ text: 'J12' }, { text: '1.20', decoration: 'high' }];
	report(near(measureDecorRight(fakeText([12, 8]), lines), 8 + PAD),
		'reach = decorated line width + gap + rail', String(measureDecorRight(fakeText([12, 8]), lines)));

	// THE CASE A "widest line + pad" SHORTCUT GETS WRONG. The decorated line is the SHORT one here,
	// so padding the bbox width would over-reserve; measuring per line gives the true edge.
	const mixed = [{ text: '125.00' }, { text: '1.20', decoration: 'low' }];
	report(near(measureDecorRight(fakeText([30, 8]), mixed), 8 + PAD),
		'measured from the decorated line, not the widest one', String(measureDecorRight(fakeText([30, 8]), mixed)));

	// Two decorated lines: the one that reaches furthest wins.
	const two = [{ text: 'a', decoration: 'high' }, { text: 'b', decoration: 'low' }];
	report(near(measureDecorRight(fakeText([5, 21]), two), 21 + PAD), 'furthest of several badges wins');

	// It scales with the text, because the badge does (textFactor()).
	tf = 2;
	report(near(measureDecorRight(fakeText([8]), [{ decoration: 'high' }]), 8 + 2 * PAD), 'the badge grows with the text size');
	tf = 1;
}

// ---- 2. the toggle, which arrives for free ------------------------------
// Marks off means decorationFor() returns undefined, means no decorated line, means zero reserved.
// That is the whole implementation of "sensitive to the toggle state" and it needs no branch.
{
	report(measureDecorRight(fakeText([12, 8]), [{ text: 'J12' }, { text: '1.20' }]) === 0,
		'no decorated line reserves nothing');
	report(measureDecorRight(fakeText([]), []) === 0, 'an empty label reserves nothing');
	report(/if \(!lines\[i\]\.decoration\) \{ continue; \}/.test(extract('measureDecorRight')),
		'the toggle is read off the decoration itself, with no second code path');
	// And the toggle really does clear the decoration rather than hiding the mark, which is what
	// makes the sentence above true.
	report(/marks off/i.test(src) || /markExtrema/.test(src), 'the toggle still lives in decorationFor()');
}

// ---- 3. the width every consumer uses -----------------------------------
{
	report(labelBoxWidth({ tw: 30, decorRight: 0 }) === 30, 'undecorated label is its text width');
	report(labelBoxWidth({ tw: 30, decorRight: 12 }) === 30, 'a badge inside the text width adds nothing');
	report(labelBoxWidth({ tw: 12, decorRight: 20 }) === 20, 'a badge past the text width sets the width');
	report(labelBoxWidth({}) === 0, 'an unmeasured holder is 0, not NaN');

	// All four consumers, by name. Missing one is exactly how this defect survived: the leader was
	// the visible symptom, but collision avoidance and zoom-to-fit read the same number.
	// dataLabelOrigin() replaced updateDataLeader()/currentLeaderBoxes() here when Task 328 moved
	// the width from the leader's end to the text's start -- those two now draw between two stored
	// world points and must NOT read a width at all, which is asserted directly below.
	for (const site of ['dataLabelOrigin', 'layoutNodeLabel', 'layoutLinkLabel', 'bbox']) {
		report(/labelBoxWidth\(/.test(extract(site)), `${site}() uses labelBoxWidth()`);
	}
	report(/w: labelBoxWidth\(holder\)/.test(extract('runLabelCollisionAvoidance')), 'collision boxes use labelBoxWidth()');
}

// ---- 4. the badge stays inside the box, so the rule never crosses it ----
// The reported case, restated for Task 328: the label hangs LEFT of its anchor, so its RIGHT edge
// is the one sitting on the leader's endpoint. If that edge is the text's own, the badge hangs past
// the endpoint and the steep rule runs straight through it.
{
	const anchorX = 100, endX = 60, tw = 20, decorRight = 34;   // badge reaches 14 past the digits
	const end = { x: endX, y: 0 };

	const holder = { tw: tw, decorRight: decorRight, side: 'left' };
	const org = dataLabelOrigin(holder, { x: anchorX, y: 0 }, end);
	report(holder.side === 'left', 'a label left of its anchor keeps its text on the left');
	report(near(org.x + labelBoxWidth(holder), endX),
		'its right edge lands exactly on the stored endpoint', `${org.x + labelBoxWidth(holder)} vs ${endX}`);
	report(near(org.x + decorRight, endX), 'and that edge IS the badge\'s outer end',
		`${org.x + decorRight} vs ${endX}`);
	// What the text-only width would have done: the badge lands 14 past the endpoint, over the rule.
	report(endX - tw + decorRight > endX, 'the old text-only width would put the badge past it (the reported defect)',
		`${endX - tw + decorRight} > ${endX}`);

	// The other side is unaffected: hanging RIGHT, the text starts AT the endpoint and the badge
	// trails away from the rule — so widening the box must not move the origin at all.
	const rightHolder = { tw: tw, decorRight: decorRight, side: 'right' };
	const rightOrg = dataLabelOrigin(rightHolder, { x: anchorX, y: 0 }, { x: 200, y: 0 });
	report(near(rightOrg.x, 200), 'hanging right, the text starts on the endpoint', String(rightOrg.x));

	// AND THE ENDPOINT ITSELF IS NEVER DERIVED. This is the whole of Task 328: the two functions
	// that draw the rule take two world points and must not consult a width, or the angle starts
	// moving with the zoom again.
	report(!/labelBoxWidth\(/.test(extract('updateDataLeader')),
		'updateDataLeader() reads no width -- it draws A to the stored B');
	report(!/labelBoxWidth\(/.test(extract('currentLeaderBoxes')),
		'currentLeaderBoxes() reads no width either -- same two points');
}

// ---- 5. measured before layout, not after -------------------------------
// applyExtremaTicks() runs AFTER the leader is placed (relayoutLabels()), so reading the badge's
// reach out of the drawn ticks would feed every consumer the previous pass's answer.
{
	const refresh = extract('refreshLabelText');
	report(/decorRight = measureDecorRight/.test(refresh), 'decorRight is set in refreshLabelText()');
	// The CALL, at the function's own indent -- 'relayoutLabels()' also appears in a comment above it.
	report(refresh.indexOf('measureDecorRight') < refresh.indexOf('\n\t\trelayoutLabels();'),
		'and set before the layout pass that consumes it');
}

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);

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
// The leader half is checked against the REAL Geom.leaderAttach() from js/lpn-geom.js, not a copy:
// the defect was in what got PASSED to it, and a re-implementation here would test the wrong thing.

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

eval([extract('measureDecorRight'), extract('labelBoxWidth')].join('\n'));

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
	for (const site of ['updateDataLeader', 'currentLeaderBoxes', 'layoutNodeLabel', 'layoutLinkLabel', 'bbox']) {
		report(/labelBoxWidth\(/.test(extract(site)), `${site}() uses labelBoxWidth()`);
	}
	report(/w: labelBoxWidth\(holder\)/.test(extract('runLabelCollisionAvoidance')), 'collision boxes use labelBoxWidth()');
}

// ---- 4. the leader clears the badge -------------------------------------
// The reported case: label dragged LEFT of its anchor, so the leader attaches to the label's RIGHT
// edge and runs steeply back to the node. If that edge is the text's, the rule crosses the badge.
{
	const anchorX = 100, posX = 60, tw = 20, decorRight = 34;   // badge reaches 14 past the digits
	const badgeRight = posX + decorRight;

	const bad = tw / 2;                                          // what the code used to pass
	const before = Geom.leaderAttach('left', posX + bad, bad, anchorX, 0.25);
	report(before.x < badgeRight, 'the old text-only width attached INSIDE the badge (the reported defect)',
		`${before.x} < ${badgeRight}`);

	const halfW = labelBoxWidth({ tw: tw, decorRight: decorRight }) / 2;
	const after = Geom.leaderAttach('left', posX + halfW, halfW, anchorX, 0.25);
	report(after.side === 'left', 'a label left of its anchor still attaches on the label\'s right edge');
	report(near(after.x, badgeRight), 'and that edge is now the badge\'s outer end', `${after.x} vs ${badgeRight}`);

	// The other side is unaffected: dragged RIGHT, the leader attaches to the LEFT edge, which the
	// badge never touches — so widening the box must not move it.
	const rightHalf = labelBoxWidth({ tw: tw, decorRight: decorRight }) / 2;
	const rightSide = Geom.leaderAttach('right', 200 + rightHalf, rightHalf, anchorX, 0.25);
	report(near(rightSide.x, 200), 'dragged right, the leader still attaches at the text\'s left edge', String(rightSide.x));
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

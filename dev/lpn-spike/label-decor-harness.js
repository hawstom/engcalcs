// The data label's footprint, and the leader that hangs off it.
//
//   node dev/lpn-spike/label-decor-harness.js
//
// THIS FILE USED TO BE TWICE THIS LONG, and the half that went is the point. Task 298 existed
// because the extrema badge -- two rails and a chevron -- was drawn just past the END of a
// decorated number, so a label's real right edge was further right than its <text> bbox. Four
// consumers had to be taught that (leader attachment, collision boxes, the mask rect of the day,
// zoom-to-fit) and
// each got it wrong first; Tom found the last one on screen: "The extrema glyph is not accounted
// for in the leader attachment. So it can overhang a steeply vertical leader when label is dragged
// left."
//
// Task 333 replaced that badge with the number's own text-decoration (overline for the max,
// underline for the min), after Tom said the placement was "a perpetual problem". A decoration is
// drawn INSIDE the glyph box by the text engine, so the footprint is the text again -- and the
// whole class of bug, plus measureDecorRight() and every assertion about its reach, went with it.
// What is left below is what remains TRUE and can still regress:
//
//   * every consumer of a label's width goes through the one function, labelBoxWidth(), rather
//     than reading .tw for itself -- which is what would let a future footprint change (a units
//     suffix, a thematic swatch) be made in one place;
//   * the leader is drawn between two STORED world points and consults no width at all (Task 328),
//     because a width is a screen-pixel quantity and letting one back in makes the rule's angle
//     move with the zoom.

const fs = require('fs');
const path = require('path');
// The REAL geometry, not a copy: the side-flip hysteresis under dataLabelOrigin() is the thing
// being exercised, and re-implementing it here would test the wrong function.
const Geom = require('../../js/lpn-geom.js').lpnGeom;

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

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

// ADVERSE_FRAC comes out of the file rather than being copied -- a retune of the hysteresis must
// move these assertions with it rather than strand them on a number that used to be true.
const ADVERSE_FRAC = +(src.match(/var ADVERSE_FRAC = ([\d.]+);/) || [])[1];
eval([extract('labelBoxWidth'), extract('dataLabelOrigin')].join('\n'));

// ---- 1. one width, and it is the text ----------------------------------
{
	report(labelBoxWidth({ tw: 30 }) === 30, 'a label is its text width');
	report(labelBoxWidth({}) === 0, 'an unmeasured holder is 0, not NaN');
	// The mark is INSIDE the glyphs now, so nothing may re-introduce a reach beside the text
	// without also teaching every consumer below about it.
	report(!/decorRight/.test(src), 'no consumer carries a badge reach any more');
	report(!/applyExtremaTicks|measureDecorRight/.test(src), 'and the badge machinery is gone, not merely unused');

	// Every consumer, by name. Missing one is exactly how the original defect survived: the leader
	// was the visible symptom, but collision avoidance and zoom-to-fit read the same number.
	// THE TWO LAYOUT FUNCTIONS LEFT THIS LIST WITH TASK 376. They read the width for one thing only
	// -- to size the background rect behind the text -- and the rect is gone: the halo that replaced
	// it is a stroke on the glyphs, which is the label's width by construction and cannot be given
	// the wrong one. What they still do is place the text through dataLabelOrigin(), which is on
	// this list, so the property this section asserts is unchanged; there are simply two fewer
	// places able to break it.
	for (const site of ['dataLabelOrigin', 'bbox']) {
		report(/labelBoxWidth\(/.test(extract(site)), `${site}() uses labelBoxWidth()`);
	}
	report(/w: labelBoxWidth\(holder\)/.test(extract('runLabelCollisionAvoidance')), 'collision boxes use labelBoxWidth()');
}

// ---- 2. which side of the endpoint the text hangs on --------------------
// The label hangs LEFT of its anchor here, so its RIGHT edge is the one sitting on the leader's
// stored endpoint. Task 328 turned the leader around: the endpoint is stored and the text hangs off
// it, so the box width decides where the TEXT STARTS.
{
	const anchorX = 100, endX = 60, tw = 20;
	const end = { x: endX, y: 0 };

	const holder = { tw: tw, side: 'left' };
	const org = dataLabelOrigin(holder, { x: anchorX, y: 0 }, end);
	report(holder.side === 'left', 'a label left of its anchor keeps its text on the left');
	report(near(org.x + labelBoxWidth(holder), endX),
		'its right edge lands exactly on the stored endpoint', `${org.x + labelBoxWidth(holder)} vs ${endX}`);

	// The other side is unaffected: hanging RIGHT, the text starts AT the endpoint.
	const rightHolder = { tw: tw, side: 'right' };
	const rightOrg = dataLabelOrigin(rightHolder, { x: anchorX, y: 0 }, { x: 200, y: 0 });
	report(near(rightOrg.x, 200), 'hanging right, the text starts on the endpoint', String(rightOrg.x));

	// AND THE ENDPOINT ITSELF IS NEVER DERIVED. This is the whole of Task 328: the two functions
	// that draw the rule take two world points and must not consult a width, or the angle starts
	// moving with the zoom again.
	report(!/labelBoxWidth\(/.test(extract('updateDataLeader')),
		'updateDataLeader() reads no width -- it draws A to the stored B');
	// **SIZE IT FOR THIS SCALE, THEN MEASURE IT.** Tom, with two screenshots of the same view: "See
	// the size of these boxes before and after I drag." getBBox() returns WORLD units and
	// noteMeasuredWidth() multiplies by the CURRENT scale, so both halves must belong to the same
	// moment -- and a label's font-size is itself world units (textSize / s). Run this after a zoom
	// but before refreshFontSizes() has touched the element and you measure text drawn at the old
	// scale, multiply by the new one, and bank a pixel width wrong by exactly the zoom ratio. It
	// healed on the next drag only because a drag ends in a solve, which re-enters here.
	//
	// Asserted on ORDER, which is the whole of the bug: the assignment must precede the measurement
	// in both branches. A harness cannot measure text, so it cannot catch this any other way.
	//
	// **THE WRITE AND THE READ ARE NOW SEPARATE FUNCTIONS** (Task 440), so the order is checked
	// across the concatenation of everything the pass is made of: refreshLabelTextPass(),
	// writeNodeLabelGlyphs() and writeLabelGlyphs()/measureLabelWidths() (each half's own write and
	// the one read), and renderLinkLabel(), which is the two back to back for a caller holding one
	// label. Searching the sources rather than naming which holds which keeps this true through the
	// next move as well -- Task 469 moved the node write out of refreshLabelTextPass() and into
	// writeNodeLabelGlyphs(), and this list is where that shows up.
	// **CONCATENATED WRITE HALVES FIRST, THEN THE PASSES THAT MEASURE**, which is the order the page
	// runs them in: each kind's font size is written by its own write function and every measurement
	// happens in a later loop that calls measureLabelWidths(). Reading the two halves in source order
	// would say nothing, because a write function may be defined anywhere in the file.
	const rlt = extract('writeNodeLabelGlyphs') + '\n' + extract('writeLabelGlyphs') +
		'\n' + extract('refreshLabelText') + '\n' + extract('refreshLabelTextPass') +
		'\n' + extract('renderLinkLabel') + '\n' + extract('measureLabelWidths');
	['ne', 'le'].forEach(function (v) {
		const set = rlt.indexOf(v + '.text.style.fontSize = fsNow;');
		const measure = rlt.indexOf('measureLabelWidths(' + v + ')');
		report(set >= 0 && measure >= 0 && set < measure,
			v + ' is sized for the current scale before it is measured', 'set@' + set + ' measure@' + measure);
	});
	// **AND EVERY MEASUREMENT IN THE PASS GOES THROUGH THAT ONE FUNCTION.** With the batched passes
	// (Task 440) a label is measured from a loop that cannot see the write that produced it, so
	// "the write is above the read" is no longer readable line by line. What keeps it true is that
	// measureLabelWidths() is the only tape measure in the pass and is only ever called on labels
	// already written by writeLabelGlyphs(). A getBBox() reappearing anywhere else in these
	// functions is the defect, whatever order it is in.
	['refreshLabelTextPass', 'writeLabelGlyphs', 'writeNodeLabelGlyphs', 'renderLinkLabel',
		'shedToSegment', 'shedToSegmentBatch', 'shedNodeLabelsForCrowding'].forEach(function (fn) {
		// Comment lines stripped: these functions EXPLAIN getBBox() at length, and a prose mention is
		// not a call.
		const code = extract(fn).split('\n').map(function (s) { return s.replace(/\/\/.*$/, ''); }).join('\n');
		report(!/getBBox\(|getComputedTextLength\(|noteMeasuredWidth\(/.test(code),
			fn + '() measures nothing itself -- measureLabelWidths() is the one tape measure');
	});
	report(/fsNow = effectiveFontSize\(\) \+ 'px'/.test(rlt),
		'...from effectiveFontSize(), which is the same quantity refreshFontSizes() publishes');

	// **A PIPE IS NOT AN OBSTACLE TO ITS OWN LABEL.** Tom, minutes after pipes became obstacles:
	// "Pipe labels are fickle now. I see them and then I don't see them." A link's data label sits ON
	// its pipe by design -- that is how you tell whose number it is -- so without an owner on the
	// pipe segment every pipe threw its own label perpendicular off itself on every pass.
	// Asserted on the WIRING rather than the arithmetic: rawScore() already honours `owner`
	// (collide-harness covers that), and what broke was that pipes were built without one.
	report(/kind: 'link', owner: linkLabelKey\(l\.id\)/.test(extract('staticObstacles')),
		'a pipe segment carries its own link as owner');
	// A LEADER CARRIES ITS OWNER TOO, and since Task 379 a data label's leader is not gathered at all
	// -- the pass commits each one as it places the label it belongs to, so it cannot be forgotten
	// and cannot disagree with where the label went. What staticObstacles() still gathers is the
	// user's own Text label leaders, which nothing in the pass moves.
	const collideSrc = require('fs').readFileSync(
		require('path').resolve(__dirname, '../../js/lpn-collide.js'), 'utf8');
	report(/segment\(lbl\.anchor\.x, lbl\.anchor\.y, c\.x, c\.y, 'leader', lbl\.id\)/.test(collideSrc),
		'...and a leader still carries its own label, as it always did');
	report(ADVERSE_FRAC > 0, 'the hysteresis fraction is still read out of the file', String(ADVERSE_FRAC));
}

// ---- 3. the Task 190 toggle still clears the decoration -----------------
// Marks off means decorationFor() returns undefined, means no segment carries a text-decoration.
// There is no second code path for the switch, which is what makes it free.
{
	const dec = extract('decorationFor');
	report(/if \(!labelSettings\.markExtrema\) \{ return undefined; \}/.test(dec),
		'the toggle is enforced in decorationFor(), before anything is drawn');
	report(/if \(value === extrema\.max && value === extrema\.min\) \{ return undefined; \}/.test(dec),
		'a value that is simultaneously max and min earns no mark');
	report(/seg\.decoration === 'high' \? 'overline' : 'underline'/.test(extract('setMultilineText')),
		'and a decorated segment is marked by the text engine, not by a badge element');
}

// ---- 4. the extrema rule is the plain one -----------------------------------------------
// Deliberately NO tie rule: a mark suppressed once enough elements share it has been proposed and
// reverted twice. Asserting the plain behaviour is what stops it coming back a third time.
{
	let labelSettings = { markExtrema: true };
	eval(extract('fieldExtrema') + '\n' + extract('decorationFor'));

	let ex = fieldExtrema([1, 2, 3, 4, 5]);
	report(decorationFor(ex, 5) === 'high' && decorationFor(ex, 1) === 'low', 'a unique high and low are marked');
	report(decorationFor(ex, 3) === undefined, 'and nothing between them is');

	// Elm Street's own shape. Every zero IS the minimum and every one of them is marked; that is the
	// rule, not a defect to be fixed here.
	ex = fieldExtrema([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 30, 45]);
	report(decorationFor(ex, 0) === 'low', 'a value shared by many is still marked lowest');
	report(decorationFor(ex, 45) === 'high', 'and the one highest demand is marked highest');
	report(ex.minHeld === undefined, 'no tie count is computed at all');

	report(fieldExtrema([1, 2]) === null, 'fewer than three values is no finding at all');
	report(decorationFor(fieldExtrema([5, 5, 5]), 5) === undefined, 'max === min is still refused');
	labelSettings.markExtrema = false;
	report(decorationFor(fieldExtrema([1, 2, 3]), 3) === undefined, 'and the Task 190 toggle still wins');
}

console.log(`\n${checks - failures}/${checks} passed`);
process.exit(failures ? 1 : 0);

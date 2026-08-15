// Aligned (GIS-style) pipe labels — the collision and badge defects (ROADMAP Task 329).
//
//   node dev/lpn-spike/aligned-label-harness.js
//
// Written 2026-08-14 after Tom hit two failures in one drawing on Elm Street Center, which is the
// only shipped example with `alignPipeLabels` on:
//
//   "This conflict between pipe labels could and should have been avoided."
//   "These glyphs somehow got orphaned."  (a picture of extrema rails and chevrons lying beside a
//                                          rotated pipe label instead of on the end of it)
//
// They looked like two bugs and were three, all from ONE cause: an aligned label is rendered
// through an SVG `rotate(angle ax ay)` on its <text>, and everything else in the file kept
// reasoning about it as though it were still a horizontal box at its unaligned position.
//
//   1. COLLISION, PHANTOM BOX. It went into the relaxation as a MOVABLE box at the UNALIGNED
//      position with an UNROTATED w/h. So the pass shoved real labels out of empty space, computed
//      a nudge the aligned renderer discards, and never saw the rotated text at all.
//   2. COLLISION, ALIGNED vs ALIGNED. Fixing (1) by making it an immovable obstacle fixes
//      aligned-vs-node and leaves aligned-vs-aligned exactly as broken, because two immovable
//      boxes just overlap forever. A pipe-bound label has one degree of freedom, so it SLIDES
//      along its own pipe — what every GIS does with a road name.
//   3. ORPHANED BADGES. applyExtremaTicks() positions from the text's RAW x/y and appends siblings
//      into the layer with no transform. Invisible for a horizontal label (same coordinate
//      system); for a rotated one the digits swing away and the badges stay behind.
//
// The pure geometry is asserted numerically below. The two wiring facts — that aligned labels no
// longer reach addDataLabel(), and that badges inherit the transform — are asserted STRUCTURALLY
// against the source, because both live inside the editor's closure and neither can be reached
// without a browser. A structural assertion is weak evidence in general; here it is pinning the
// exact line whose absence caused a defect Tom had to find by eye.

const fs = require('fs');
const path = require('path');

const Geom = require('../../js/lpn-geom.js').lpnGeom;
const Collide = require('../../js/lpn-collide.js').lpnCollide;

const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function close(a, b, label, tol) {
	const ok = Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol);
	report(ok, label, ok ? '' : `got ${a}, want ${b}`);
}

console.log('\n-- rotatedLabelBox: unrotated is the plain box --');
{
	// fontSize 4 => ascent 3.4; a 10x4 box anchored at (100, 200), text-anchor middle.
	const b = Geom.rotatedLabelBox(100, 200, 10, 4, 0, 4);
	close(b.x, 95, 'left edge is half a width left of the anchor');
	close(b.y, 200 - 3.4, 'top edge is one ascent above the baseline');
	close(b.w, 10, 'width unchanged');
	close(b.h, 4, 'height unchanged');
}

console.log('\n-- rotatedLabelBox: a quarter turn swaps the extents --');
{
	const b = Geom.rotatedLabelBox(100, 200, 10, 4, 90, 4);
	close(b.w, 4, 'width becomes the old height');
	close(b.h, 10, 'height becomes the old width');
}

console.log('\n-- THE DISCRIMINATING TEST: rotation is about the ANCHOR, not the box centre --');
{
	// This is the one that separates a correct implementation from the obvious wrong one. The SVG
	// attribute is `rotate(a cx cy)` about the TEXT ANCHOR, which for a single-line label sits
	// about 1.4 units below the box centre at fontSize 4. Rotate about the box's own centre
	// instead and the box stays centred on x = 100; rotate about the anchor and it swings sideways.
	const b = Geom.rotatedLabelBox(100, 200, 10, 4, 90, 4);
	const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
	close(cx, 101.4, 'centre swings sideways by the anchor-to-centre distance');
	close(cy, 200, 'and lands level with the anchor');
	report(Math.abs(cx - 100) > 1, 'the box is NOT still centred on the anchor’s x — that would be rotation about the box centre');
}

console.log('\n-- rotatedLabelBox: a diagonal label is wider AND taller than either extent --');
{
	const b = Geom.rotatedLabelBox(0, 0, 10, 4, 45, 4);
	report(b.w > 10 * Math.SQRT1_2 && b.w < 14, 'width is the |w·cos|+|h·sin| envelope', b.w.toFixed(3));
	report(b.h > 4 && b.h < 14, 'height likewise', b.h.toFixed(3));
	// Generous is the right direction to err for a legibility guard: the AABB encloses the rotated
	// rectangle, so a diagonal label claims a little more room than it strictly occupies.
	report(b.w >= 10 * Math.cos(Math.PI / 4), 'the AABB never under-claims');
}

console.log('\n-- rectsOverlap, shared with the relaxation so the two agree on "clear" --');
{
	const a = { x: 0, y: 0, w: 10, h: 10 };
	report(Collide.rectsOverlap(a, { x: 5, y: 5, w: 10, h: 10 }), 'plainly overlapping');
	report(!Collide.rectsOverlap(a, { x: 11, y: 0, w: 10, h: 10 }), 'plainly clear');
	report(!Collide.rectsOverlap(a, { x: 10, y: 0, w: 10, h: 10 }), 'exactly touching is not overlapping');
	report(Collide.rectsOverlap(a, { x: 11, y: 0, w: 10, h: 10 }, 2), 'a pad makes near neighbours count as crowded');
	report(!Collide.rectsOverlap(a, { x: 11, y: 0, w: 10, h: 10 }, 0.5), 'a pad smaller than the gap does not');
}

console.log('\n-- wiring: an aligned label no longer goes through the ordinary relaxation --');
{
	const fn = src.slice(src.indexOf('function runLabelCollisionAvoidance'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/if \(linkLabelAligned\(l\)\) \{ aligned\.push\(l\)/.test(body),
		'aligned links are diverted out of the addDataLabel path');
	report(/placeAlignedLabels\(aligned, statics, fs\)/.test(body),
		'and handed to the station search, which commits them as obstacles');
	// The phantom is the thing that must never come back: a movable box for a label the renderer
	// will not move. What guarantees that is the `return` — the aligned branch must leave before
	// the addDataLabel call on the following line, not merely be written above it.
	report(/if \(linkLabelAligned\(l\)\) \{.*\breturn;/.test(body),
		'the aligned branch RETURNS, so it cannot fall through into addDataLabel');
	report(body.indexOf('linkLabelAligned(l)') < body.indexOf('addDataLabel(le, dataLabelOrigin'),
		'and it is tested before the ordinary path is reached');
}

console.log('\n-- wiring: the station list is ordered outward from the middle --');
{
	const m = src.match(/var LPN_ALIGNED_STATIONS = \[([^\]]+)\]/);
	report(!!m, 'the station list exists');
	if (m) {
		const st = m[1].split(',').map(Number);
		close(st[0], 0.5, 'the first station tried is the middle');
		let ok = true;
		for (let i = 1; i < st.length; i++) {
			if (Math.abs(st[i] - 0.5) < Math.abs(st[i - 1] - 0.5) - 1e-9) { ok = false; }
		}
		report(ok, 'each later station is no closer to the middle than the one before', JSON.stringify(st));
		report(st.every(s => s > 0.12 && s < 0.88), 'every station is inside dodgeAlongPolyline’s own clamps');
		// Alternating sides, so a pushed label does not drift consistently one way along every pipe.
		report(st.slice(1).some(s => s < 0.5) && st.slice(1).some(s => s > 0.5),
			'the fallbacks try both directions along the pipe');
	}
}

console.log('\n-- wiring: longest pipe first, so the placement order is stable --');
{
	const fn = src.slice(src.indexOf('function placeAlignedLabels'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/polylineLength/.test(body), 'pipes are measured');
	report(/sort\(function \(a, b\) \{ return b\.len - a\.len; \}\)/.test(body), 'and sorted longest first');
	report(/movable: false/.test(body), 'a placed aligned label is committed as an IMMOVABLE obstacle');
}

console.log('\n-- wiring: extrema badges inherit their label’s transform --');
{
	const fn = src.slice(src.indexOf('function applyExtremaTicks'));
	const body = fn.slice(0, fn.indexOf('\n\tfunction ', 10));
	report(/xform = textEl\.getAttribute\('transform'\)/.test(body),
		'the badge reads the transform off the text element rather than recomputing it');
	report(/if \(xform\) \{ attrs\.transform = xform; \}/.test(body),
		'and applies it to every badge it builds');
	// The regression that would orphan them again is a badge appended with a bare el('line'|
	// 'polyline') call, bypassing the helper. The helper's own push (which takes `tag`, a variable)
	// is the one legitimate occurrence, so match on a QUOTED tag to tell them apart.
	report(!/holder\.tickEls\.push\(el\('/.test(body),
		'no badge is created outside the transform-aware helper');
	const n = (body.match(/\n\t\t\ttick\('/g) || []).length;
	report(n === 3, 'all three badge parts (two rails, one chevron) go through it', `found ${n}`);
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

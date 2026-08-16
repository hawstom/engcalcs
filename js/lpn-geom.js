// lpn-geom.js — the map editor's pure geometry (ROADMAP Task 293).
//
// Split from js/looped-network.js by PURITY, not by subject: everything here takes values
// and returns values — no DOM, no `doc`, no `nodeEls`, no settings, no closure variables,
// so it is reachable without a browser. Keep it that way; a module that reached back into
// the editor's closure would be just as untestable, one file further away. The caller in
// looped-network.js stays responsible for resolving node ids to points, reading the current
// font size, and writing the answer onto an SVG attribute.
//
// Coordinates are the map's own world units, Y-DOWN (SVG convention), same as every
// other geometry in the editor.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnGeom = (function () {
	'use strict';

	// ---- polylines -------------------------------------------------------
	// `pts` is always an array of {x, y} — for a link that is
	// [fromNode].concat(l.verts, [toNode]), resolved by the caller.

	function polylineLength(pts) {
		var i, sum = 0;
		for (i = 0; i < pts.length - 1; i++) {
			sum += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
		}
		return sum;
	}

	// The SVG `points` attribute value for a polyline.
	function polylinePointsAttr(pts) {
		var i, out = [];
		for (i = 0; i < pts.length; i++) { out.push(pts[i].x + ',' + pts[i].y); }
		return out.join(' ');
	}

	// The point a fraction `f` of the way along the WHOLE polyline, by arc length -- not
	// the midpoint of some chosen segment. Returns the point plus the along-distance it
	// sits at, so callers can reason about spacing between things placed on the same link.
	function pointAlongPolyline(pts, f) {
		var segs = [], total = 0, i, d, want, run;
		for (i = 0; i < pts.length - 1; i++) {
			d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			segs.push(d); total += d;
		}
		if (!(total > 0)) { return { x: pts[0].x, y: pts[0].y, dist: 0, total: 0 }; }
		want = f * total; run = 0;
		for (i = 0; i < segs.length; i++) {
			if (run + segs[i] >= want || i === segs.length - 1) {
				var t = segs[i] > 0 ? (want - run) / segs[i] : 0;
				t = Math.max(0, Math.min(1, t));
				return {
					x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
					y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
					dist: want, total: total
				};
			}
			run += segs[i];
		}
		return { x: pts[0].x, y: pts[0].y, dist: 0, total: total };
	}

	// Place something at `along` (a fraction) on the polyline, then step it clear of any
	// obstacle it would land on top of -- `obstacleDists` are along-distances in the same
	// space `pointAlongPolyline().dist` reports (the editor passes flow-arrow positions).
	// The thing moves ALONG the line rather than off it, so it stays on what it labels,
	// and is clamped well inside the ends so it never crowds a node.
	function dodgeAlongPolyline(pts, along, obstacleDists, clear, loClamp, hiClamp) {
		var here = pointAlongPolyline(pts, along), i, f;
		if (!(here.total > 0)) { return here; }
		for (i = 0; i < obstacleDists.length; i++) {
			if (Math.abs(obstacleDists[i] - here.dist) >= clear) { continue; }
			// Step to whichever side of this obstacle is farther from the line's own ends,
			// so the dodge never pushes the label off the end of a short pipe.
			f = (obstacleDists[i] > here.dist)
				? (obstacleDists[i] - clear) / here.total
				: (obstacleDists[i] + clear) / here.total;
			f = Math.max(loClamp, Math.min(hiClamp, f));
			return pointAlongPolyline(pts, f);
		}
		return here;
	}

	// ---- leader lines ----------------------------------------------------
	// A leader attaches to the label box's NEAR vertical edge, so the rule never runs
	// through the text. `centerX` is the box centre, `halfW` half its width, `anchorX`
	// the x of the thing being labelled.

	function leaderAttachX(centerX, halfW, anchorX) {
		return centerX >= anchorX ? centerX - halfW : centerX + halfW;
	}

	// The same thing WITH hysteresis, for the render path. Text tracks the drag point
	// continuously (never jumps); only the attachment edge flips, and it flips late --
	// at `adverseFrac` of the label's own width past the anchor's vertical line (0 = near
	// edge at the line, 1 = far edge at the line; flipping later means the leader has to
	// reach clear across the text). Without the previous side carried in, a label dragged
	// just past the line would flicker its leader from edge to edge.
	// Returns the new side and the x to attach at; the caller stores `side` for next time.
	function leaderAttach(prevSide, centerX, halfW, anchorX, adverseFrac) {
		var offset = centerX - anchorX,
			trigger = halfW * (1 - 2 * adverseFrac),
			side = prevSide || 'right';
		if (side === 'right' && offset < trigger) { side = 'left'; }
		else if (side === 'left' && offset > -trigger) { side = 'right'; }
		return { side: side, x: side === 'right' ? centerX - halfW : centerX + halfW };
	}

	// THE OTHER DIRECTION, and the one a data label uses. Above, the label box is the input
	// and the leader's end is derived from it; here the ENDPOINT is the input (the user's own
	// point, in map units) and the TEXT hangs off it. That ordering is what keeps the leader
	// angle invariant under zoom: a box's WIDTH is a screen-pixel quantity, so in world units
	// it is proportional to 1/zoom, and deriving the endpoint from it slides the leader by a
	// whole box width as you zoom.
	// Returns which side of the endpoint the box occupies: 'right' means it extends to the
	// right (its left edge sits ON the endpoint), 'left' means it extends left. The text
	// therefore always continues AWAY from the anchor, so the rule never runs through it.
	// Hysteresis is the same idea and the same number as leaderAttach()'s: with
	// adverseFrac 0.75 the flip waits until the endpoint is half a box-half-width past the
	// anchor's vertical line, so an endpoint parked on that line does not flicker the text
	// from one side to the other by its full width.
	function labelSideAtEnd(prevSide, endX, anchorX, halfW, adverseFrac) {
		var offset = endX - anchorX,
			hyst = halfW * (2 * adverseFrac - 1),
			side = prevSide || 'right';
		if (side === 'right' && offset < -hyst) { side = 'left'; }
		else if (side === 'left' && offset > hyst) { side = 'right'; }
		return side;
	}

	// ---- label boxes -----------------------------------------------------

	// Approximate vertical box of a left-anchored, top-down multi-line <text> (node/link
	// labels): no exact ascent/descent metrics are available cross-browser without layout,
	// so this uses a fraction of font size that reads right for the suite's actual label
	// content (short numbers/letters, no descenders like "g"/"y"). Good enough for
	// collision boxes; not meant to be pixel-exact.
	function dataLabelBoxHeight(lineCount, fontSize, lineHeight) {
		return fontSize * 1.1 + Math.max(0, lineCount - 1) * lineHeight;
	}

	// WHERE A LABEL'S BOX ACTUALLY IS, given the point it is anchored at and what that point
	// MEANS to the text element -- i.e. its own text-anchor/dominant-baseline. This is the one
	// place the anchor convention is interpreted, so a bounding box, a collision box and a leader
	// attachment can never disagree about where the same label is (ROADMAP Task 332).
	//
	// hAlign is the SVG text-anchor vocabulary ('start' | 'middle' | 'end') and vAlign says what
	// y is: 'middle' (dominant-baseline:central -- vertical centre), 'hanging' (y IS the top of
	// the text, which is how EPANET anchors a [LABELS] point), or anything else meaning y is the
	// FIRST LINE'S BASELINE, the node/link data-label convention. The 0.85·fontSize ascent in
	// that last case is an approximation on purpose -- no cross-browser metrics without layout.
	//
	// Returns {x, y, w, h} with x/y at the TOP-LEFT, the same shape lpn-collide uses.
	function labelBoxAt(x, y, w, h, hAlign, vAlign, fontSize) {
		var left = hAlign === 'middle' ? x - w / 2 : hAlign === 'end' ? x - w : x;
		var top = vAlign === 'middle' ? y - h / 2 : vAlign === 'hanging' ? y : y - fontSize * 0.85;
		return { x: left, y: top, w: w, h: h };
	}

	// WHICH PART OF A SEGMENT IS INSIDE A RECTANGLE, as the parameter range [t0, t1] along it
	// (0 = a, 1 = b), or null if none of it is. Liang–Barsky, which is the standard answer and
	// is exact -- no sampling, no stepping.
	//
	// Used to cull repeated link labels. Clip the LINE first, not each label's own point: point
	// testing is O(number of labels), and the whole point of the cull is that a pipe a thousand
	// view-widths long must not cost a thousand tests to draw four labels. Clipping is
	// O(segments), after which the station indices in view are two divisions.
	//
	// A segment lying exactly along an edge counts as inside (the p === 0 branch keeps it when it
	// is not strictly outside) -- for a cull, keeping a borderline label is the harmless direction.
	function segmentRectRange(ax, ay, bx, by, rect) {
		var dx = bx - ax, dy = by - ay, t0 = 0, t1 = 1, i,
			p = [-dx, dx, -dy, dy],
			q = [ax - rect.x0, rect.x1 - ax, ay - rect.y0, rect.y1 - ay],
			r;
		for (i = 0; i < 4; i++) {
			if (p[i] === 0) {
				if (q[i] < 0) { return null; }   // parallel to this edge and outside it
				continue;
			}
			r = q[i] / p[i];
			if (p[i] < 0) { if (r > t1) { return null; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return null; } if (r < t1) { t1 = r; } }
		}
		return { t0: t0, t1: t1 };
	}

	// The AXIS-ALIGNED BOUNDING BOX of a label that is drawn ROTATED, given where it would be
	// unrotated. An aligned pipe label is rendered `text-anchor: middle`, rotated about its own
	// anchor, and takes NO nudge (the GIS convention: a label lying along its pipe has already
	// declared which pipe it belongs to). The collision pass must therefore be given THIS box --
	// handing it the unrotated box at the unaligned position makes a phantom in two directions at
	// once, shoving other labels away from where nothing is drawn while the real text collides
	// unseen somewhere else.
	//
	// The rotation is about the ANCHOR (ax, ay), not about the box's own centre — that is what the
	// SVG `rotate(a cx cy)` on the text element does, and a box rotated about the wrong point is
	// off by the distance between the two, which for a single-line label is most of its height.
	// So: rotate the unrotated box's centre about the anchor, then grow the half-extents by the
	// standard |w·cos|+|h·sin| formula.
	//
	// Returns the same {x, y, w, h} shape the collision boxes use (x/y = top-left), so the caller
	// can hand it straight to lpn-collide with `movable: false`.
	function rotatedLabelBox(ax, ay, w, h, angleDeg, fontSize) {
		var b = orientedLabelBox(ax, ay, w, h, 'middle', 'top', angleDeg, fontSize),
			rad = angleDeg * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad),
			halfW = (Math.abs(w * cos) + Math.abs(h * sin)) / 2,
			halfH = (Math.abs(w * sin) + Math.abs(h * cos)) / 2;
		return { x: b.cx - halfW, y: b.cy - halfH, w: halfW * 2, h: halfH * 2 };
	}
	// THE SAME BOX WITHOUT THROWING THE ANGLE AWAY: {cx, cy, w, h, a}, which is what
	// lpn-collide's separating-axis tests take (ROADMAP Task 379). Prefer this to the AABB
	// above wherever the consumer can handle an oriented box -- an aligned pipe label's AABB
	// is 5.2x the label's own area at 45 degrees for a 100x12 label, and the ratio grows
	// without limit with its length, so every one of those empty units is ground a label is
	// kept out of for no reason.
	//
	// The rotation is about the ANCHOR (ax, ay), not about the box's own centre — that is what
	// the SVG `rotate(a cx cy)` on the text element does, and a box turned about the wrong point
	// is off by the distance between the two, which for a single-line label is most of its height.
	// hAlign/vAlign say what the anchor MEANS, in labelBoxAt()'s own vocabulary.
	function orientedLabelBox(ax, ay, w, h, hAlign, vAlign, angleDeg, fontSize) {
		var b = labelBoxAt(ax, ay, w, h, hAlign, vAlign, fontSize),
			cx0 = b.x + b.w / 2, cy0 = b.y + b.h / 2,
			rad = (angleDeg || 0) * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad),
			dx = cx0 - ax, dy = cy0 - ay;
		return {
			cx: ax + dx * cos - dy * sin,
			cy: ay + dx * sin + dy * cos,
			w: b.w, h: b.h, a: angleDeg || 0
		};
	}


	// ---- Aligned (GIS-style) link labels ---------------------------------------------------
	//
	// Places a link's label ALONG the pipe rather than horizontally beside it, the way every GIS
	// labels a road or a main.
	//
	// THE CONSTRAINT THAT DECIDES THE MOST HERE IS NOT WHICH SIDE -- IT IS THAT TEXT MUST NEVER
	// RENDER UPSIDE DOWN. A pipe drawn right-to-left has to be flipped 180 degrees to stay
	// readable, and that flip SWAPS which side of the line is "the top". So the order is fixed:
	// normalise the angle FIRST, then offset. Offsetting before flipping puts labels on westward
	// pipes on the opposite side from their eastward neighbours, and the drawing reads as though
	// the side were chosen at random.
	//
	// WHICH SIDE: `side` is +1 for the top (the default) and -1 for the bottom. Both are returned
	// as CANDIDATES rather than one being computed as correct, because "the side with least
	// congestion" is not a new algorithm -- it is runLabelCollisionAvoidance() being handed two
	// positions instead of one.
	//
	// **WHERE THE FLIP HAPPENS IS `opts.bias`, AND 90 IS THE WORST PLACE FOR IT.** The
	// normalisation window is (bias - 180, bias], so at the natural-looking 90 the decision
	// boundary sits exactly on VERTICAL -- which is where street mains, risers and property
	// services actually are. Two parallel vertical pipes drawn in opposite directions then land
	// either side of the knife edge and their labels read in opposite directions, for a difference
	// of a tenth of a degree that nobody can see. The shipped setting is 110, which puts the
	// boundary 20 degrees past vertical so the whole near-vertical cluster falls on one side of it
	// and reads the same way.
	//
	// The cost of moving it is that a pipe between 90 and `bias` renders text tilted past vertical
	// (at 110, twenty degrees past), which is a head-tilt to read but never upside down. That is
	// the trade the number expresses, which is why it is a setting rather than a constant.
	//
	// Returns the first line's baseline anchor in UNROTATED map coordinates, so the renderer can
	// draw a plain rotated text block:
	//
	//     <text transform="rotate(angle x y)" x=x y=y text-anchor="middle">
	//         <tspan x=x dy=0>..</tspan><tspan x=x dy=lineHeight>..</tspan>
	//
	// That works because rotating by `angle` maps +y' onto the BOTTOM side of the pipe, so a
	// positive dy always steps away from the pipe on the bottom and toward it on the top -- which
	// is why the two sides anchor at different lines (bottom anchors at the line nearest the
	// pipe, top at the one furthest) and the tspans need no per-side handling at all.
	function alignedLabelAnchor(ax, ay, bx, by, opts) {
		opts = opts || {};
		var frac = opts.frac === undefined ? 0.5 : opts.frac,
			gap = opts.gap || 0,
			fontSize = opts.fontSize || 0,
			lh = opts.lineHeight || fontSize,
			nLines = Math.max(1, opts.nLines || 1),
			side = opts.side === -1 ? -1 : 1,
			bias = typeof opts.bias === 'number' && isFinite(opts.bias) ? opts.bias : 90,
			dx = bx - ax,
			dy = by - ay,
			deg = Math.atan2(dy, dx) * 180 / Math.PI,
			flipped = false;
		// A zero-length link has no direction; treat it as horizontal rather than returning NaN.
		if (!dx && !dy) { deg = 0; }
		// The readable window is (bias - 180, bias]. Anything outside it turns 180 degrees, which
		// is the same line read from the other end.
		if (deg > bias || deg <= bias - 180) { deg += 180; flipped = true; }
		if (deg > 180) { deg -= 360; }
		if (deg <= -180) { deg += 360; }
		var rad = deg * Math.PI / 180,
			// Unit normal pointing UP-SCREEN (SVG y grows downward, and cos(deg) >= 0 after the
			// flip, so this component is always <= 0 -- i.e. always the top).
			nx = Math.sin(rad),
			ny = -Math.cos(rad),
			// Distance along that normal to the FIRST line's baseline. Top: the block sits above
			// the pipe, so line 0 is the furthest out. Bottom: line 0 is nearest, one ascent below.
			d = side > 0 ? gap + (nLines - 1) * lh : -(gap + fontSize * 0.85);
		return {
			x: ax + dx * frac + nx * d,
			y: ay + dy * frac + ny * d,
			angle: deg,
			side: side,
			flipped: flipped,
			nx: nx,
			ny: ny
		};
	}


	// Shortest distance from a point to a polyline. Used to pick which SIDE of a pipe a label goes
	// on (looped-network.js alignedSideFor()): the label's own pipe is excluded by the caller, so
	// what this measures is how close the candidate position comes to some OTHER pipe.
	//
	// staticObstacleBoxes() collects nodes and Text labels only, never LINKS, so a data label is
	// otherwise free to sit straight on top of a pipe. Distance to the line is the right measure
	// rather than a bounding box: a diagonal pipe's box is mostly empty space, and boxing it would
	// push labels away from clear ground.
	function pointToSegmentDistance(px, py, ax, ay, bx, by) {
		var vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy, t;
		if (!len2) { return Math.hypot(px - ax, py - ay); }
		t = ((px - ax) * vx + (py - ay) * vy) / len2;
		t = t < 0 ? 0 : (t > 1 ? 1 : t);
		return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
	}
	function pointToPolylineDistance(pts, px, py) {
		var best = Infinity, i, d;
		if (!pts || !pts.length) { return best; }
		if (pts.length === 1) { return Math.hypot(px - pts[0].x, py - pts[0].y); }
		for (i = 0; i + 1 < pts.length; i++) {
			d = pointToSegmentDistance(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
			if (d < best) { best = d; }
		}
		return best;
	}

	return {
		polylineLength: polylineLength,
		polylinePointsAttr: polylinePointsAttr,
		pointAlongPolyline: pointAlongPolyline,
		dodgeAlongPolyline: dodgeAlongPolyline,
		leaderAttachX: leaderAttachX,
		leaderAttach: leaderAttach,
		labelSideAtEnd: labelSideAtEnd,
		dataLabelBoxHeight: dataLabelBoxHeight,
		labelBoxAt: labelBoxAt,
		segmentRectRange: segmentRectRange,
		alignedLabelAnchor: alignedLabelAnchor,
		rotatedLabelBox: rotatedLabelBox,
		orientedLabelBox: orientedLabelBox,
		pointToSegmentDistance: pointToSegmentDistance,
		pointToPolylineDistance: pointToPolylineDistance
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}

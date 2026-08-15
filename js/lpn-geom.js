// lpn-geom.js — the map editor's pure geometry (ROADMAP Task 293).
//
// Lifted out of js/looped-network.js, which is 8,000+ lines of closure state and SVG
// element handles: nothing in it could be reached without a browser, so the whole map
// editor had zero behavioural tests while the 641-line solver had eleven harnesses.
// The split is by PURITY, not by subject: everything here takes values and returns
// values — no DOM, no `doc`, no `nodeEls`, no settings, no closure variables. The
// caller in looped-network.js stays responsible for resolving node ids to points,
// reading the current font size, and writing the answer onto an SVG attribute.
//
// Deliberately NOT a "split the file into modules" pass. A module that still reached
// back into the editor's closure would be just as untestable, one file further away.
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

	// ---- label boxes -----------------------------------------------------

	// Approximate vertical box of a left-anchored, top-down multi-line <text> (node/link
	// labels): no exact ascent/descent metrics are available cross-browser without layout,
	// so this uses a fraction of font size that reads right for the suite's actual label
	// content (short numbers/letters, no descenders like "g"/"y"). Good enough for a mask
	// rect and collision boxes; not meant to be pixel-exact.
	function dataLabelBoxHeight(lineCount, fontSize, lineHeight) {
		return fontSize * 1.1 + Math.max(0, lineCount - 1) * lineHeight;
	}

	// Geometry of the background rect drawn behind a label so it stays legible over a
	// backdrop image or another element -- sized from the SAME w/h the label's own
	// geometry uses, so it never drifts out of sync with what it is supposed to cover.
	// hAlign/vAlign describe what x/y MEAN for the label being masked, matching each
	// label type's own text-anchor/dominant-baseline: 'start'/'top' for a node or link
	// label (x = left edge, y = first line's baseline); 'middle'/'middle' for a Text
	// label (x = centre, y = vertical centre).
	function maskRect(x, y, w, h, hAlign, vAlign, fontSize, pad) {
		var left = hAlign === 'middle' ? x - w / 2 : x;
		var top = vAlign === 'middle' ? y - h / 2 : y - fontSize * 0.85;
		return { x: left - pad, y: top - pad, width: w + 2 * pad, height: h + 2 * pad };
	}


	// ---- Aligned (GIS-style) link labels ---------------------------------------------------
	//
	// Places a link's label ALONG the pipe rather than horizontally beside it, the way every GIS
	// labels a road or a main. Tom, 2026-08-14: "start only with the GIS paradigm. We align the
	// labels with pipes... and we make them disappear when we are zoomed out."
	//
	// THE CONSTRAINT THAT DECIDES THE MOST HERE IS NOT WHICH SIDE -- IT IS THAT TEXT MUST NEVER
	// RENDER UPSIDE DOWN. A pipe drawn right-to-left has to be flipped 180 degrees to stay
	// readable, and that flip SWAPS which side of the line is "the top". So the order is fixed:
	// normalise the angle into (-90, 90] FIRST, then offset. Offsetting before flipping puts
	// labels on westward pipes on the opposite side from their eastward neighbours, and the
	// drawing reads as though the side were chosen at random -- which is the failure this
	// function exists to prevent, not the failure of picking the "wrong" side.
	//
	// WHICH SIDE: `side` is +1 for the top (the default, and Tom's answer when forced to choose)
	// and -1 for the bottom. Both are returned as CANDIDATES rather than one being computed as
	// correct, because "the side with least congestion" is not a new algorithm -- it is
	// runLabelCollisionAvoidance() being handed two positions instead of one.
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
			dx = bx - ax,
			dy = by - ay,
			deg = Math.atan2(dy, dx) * 180 / Math.PI,
			flipped = false;
		// A zero-length link has no direction; treat it as horizontal rather than returning NaN.
		if (!dx && !dy) { deg = 0; }
		if (deg > 90 || deg <= -90) { deg += 180; flipped = true; }
		if (deg > 180) { deg -= 360; }
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
	// This exists because staticObstacleBoxes() has never included LINKS -- it collects nodes and
	// Text labels only -- so a data label has always been free to sit straight on top of a pipe, and
	// aligning labels along pipes made that visible immediately (Tom's Elm Street screenshot,
	// 2026-08-14). Distance to the line is the right measure rather than a bounding box: a diagonal
	// pipe's box is mostly empty space, and boxing it would push labels away from clear ground.
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
		dataLabelBoxHeight: dataLabelBoxHeight,
		maskRect: maskRect,
		alignedLabelAnchor: alignedLabelAnchor,
		pointToSegmentDistance: pointToSegmentDistance,
		pointToPolylineDistance: pointToPolylineDistance
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}

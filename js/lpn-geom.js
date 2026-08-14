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

	return {
		polylineLength: polylineLength,
		polylinePointsAttr: polylinePointsAttr,
		pointAlongPolyline: pointAlongPolyline,
		dodgeAlongPolyline: dodgeAlongPolyline,
		leaderAttachX: leaderAttachX,
		leaderAttach: leaderAttach,
		dataLabelBoxHeight: dataLabelBoxHeight,
		maskRect: maskRect
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}

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

	// ---- GEODESY: a length on the Earth, for a geographic project (ROADMAP Task 145) ------------
	//
	// In a geographic project a point is a LONGITUDE and a LATITUDE, so the distance between two of
	// them is not `hypot(dx, dy)` -- a degree of longitude is not a degree of latitude, and neither
	// is a metre.
	//
	// **WHY NOT HAVERSINE, which is the answer everybody reaches for.** Haversine is exact on a
	// SPHERE, and the Earth is not one: at 6371 km mean radius it is wrong by up to ~0.5%, which is
	// 5 m in a kilometre. That is inside nobody's pipe tolerance. What follows instead is the local
	// radii-of-curvature form on the WGS84 ellipsoid -- the meridional radius M for the north-south
	// leg and the prime-vertical radius N for the east-west one, both evaluated at the mean latitude
	// of the two points. It is millimetre-accurate over the few kilometres a water network spans, it
	// needs no iteration (unlike Vincenty), and it is six lines of arithmetic.
	//
	// It degrades over CONTINENTAL distances, where the mean-latitude assumption stops holding. That
	// is the right trade for this page: a distribution network is a site, and a tool that was exact
	// across an ocean and slow on every pipe would be the wrong one.
	//
	// Returns METRES. The caller converts to the project's length unit -- this file knows no units.
	var WGS84_A = 6378137;              // semi-major axis, metres (the defining constant)
	var WGS84_F = 1 / 298.257223563;    // flattening (the other defining constant)
	var WGS84_E2 = WGS84_F * (2 - WGS84_F);   // first eccentricity squared, derived from them
	function geodesicMeters(lon1, lat1, lon2, lat2) {
		var latMid = (lat1 + lat2) / 2 * Math.PI / 180,
			sinLat = Math.sin(latMid),
			w = 1 - WGS84_E2 * sinLat * sinLat,
			// M: how far a metre goes per radian of LATITUDE here. N: per radian of longitude, before
			// the cos(lat) that shrinks a degree of longitude toward the poles.
			m = WGS84_A * (1 - WGS84_E2) / Math.pow(w, 1.5),
			n = WGS84_A / Math.sqrt(w),
			dLat = (lat2 - lat1) * Math.PI / 180,
			// **LONGITUDE WRAPS AND LATITUDE DOES NOT.** Two points either side of the 180th meridian
			// are next to each other, not most of the way round the world. Without this a network
			// spanning the antimeridian reports pipes 40,000 km long, and every one of its
			// hydraulics is then wrong in a way that looks like a solver fault.
			dLon = ((lon2 - lon1 + 540) % 360 - 180) * Math.PI / 180;
		return Math.hypot(m * dLat, n * Math.cos(latMid) * dLon);
	}
	// The same sum polylineLength() makes, leg by leg on the ellipsoid. A polyline's legs are
	// separately geodesic: summing the straight-line degrees first and converting once would be the
	// same error the flat formula makes, merely postponed.
	function geodesicPolylineMeters(pts) {
		var i, sum = 0;
		for (i = 0; i < pts.length - 1; i++) {
			sum += geodesicMeters(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
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

	// WHICH SEGMENT a fraction along the polyline lands on, and HOW LONG THAT SEGMENT IS.
	//
	// **A LABEL LYING ALONG A PIPE SITS ON ONE SEGMENT, NOT ON THE POLYLINE.** It is rotated to that
	// segment's own angle, so the room it has is that segment's length -- and on a bent pipe the two
	// numbers are nothing like each other. A 1000-unit main with a bend 60 units from its end gives a
	// label at that station 60 units of room, not 1000. Measuring against the polyline says it fits,
	// and it is drawn straight through the bend and off the pipe.
	//
	// Returns { index, length, total }. `index` is the segment's own index, so a caller can tell
	// whether either end of it is a real NODE (index 0 starts at one, index pts.length-2 ends at one)
	// or merely a vertex, which needs no symbol clearance.
	function segmentAtFraction(pts, f) {
		var segs = [], total = 0, i, d, want, run = 0;
		for (i = 0; i < pts.length - 1; i++) {
			d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			segs.push(d); total += d;
		}
		if (!segs.length) { return { index: 0, length: 0, total: 0 }; }
		if (!(total > 0)) { return { index: 0, length: 0, total: 0 }; }
		want = f * total;
		for (i = 0; i < segs.length; i++) {
			if (run + segs[i] >= want || i === segs.length - 1) {
				return { index: i, length: segs[i], total: total };
			}
			run += segs[i];
		}
		return { index: 0, length: segs[0], total: total };
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
	// the text, which is how EPANET anchors a [LABELS] point), 'bottom' (y is the bottom edge of
	// the whole block), or anything else meaning y is the FIRST LINE'S BASELINE, the node/link
	// data-label convention. The 0.85·fontSize ascent in that last case is an approximation on
	// purpose -- no cross-browser metrics without layout.
	//
	// Returns {x, y, w, h} with x/y at the TOP-LEFT, the same shape lpn-collide uses.
	function labelBoxAt(x, y, w, h, hAlign, vAlign, fontSize) {
		var left = hAlign === 'middle' ? x - w / 2 : hAlign === 'end' ? x - w : x;
		var top = vAlign === 'middle' ? y - h / 2
			: vAlign === 'hanging' ? y
			: vAlign === 'bottom' ? y - h
			: y - fontSize * 0.85;
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


	// ---- local feature context: which way is open (ROADMAP Task 397) --------------------------
	//
	// **BEARINGS ARE SCALE-INVARIANT. DISTANCES ARE NOT. THAT IS THE WHOLE REASON THIS IS ANGLES.**
	// Every label dimension in this editor is a pixel figure divided by the zoom (a label's width in
	// world units is 1/scale), while the pipes are in world units and do not move. So an "openness"
	// measured as a world distance is a different number at every zoom, and a label picking its side
	// from one changes side as the user scrolls the wheel -- for a reason no reader can see. Measured
	// as an angle, the answer moves only when the network's SHAPE moves, which is the only thing that
	// should move it.
	//
	// `deg` is a compass-free bearing in degrees, the same convention atan2(dy, dx) returns and the
	// same y-down sense as everything else here.

	// The absolute difference between two bearings, wrapped into [0, 180].
	function angularGap(aDeg, bDeg) {
		var d = Math.abs(aDeg - bDeg) % 360;
		return d > 180 ? 360 - d : d;
	}
	// HOW OPEN ONE DIRECTION IS: the angle to the nearest occupied bearing, in degrees, so bigger is
	// clearer. With nothing occupied it is 180 -- the most open a direction can be -- rather than
	// Infinity, so callers can compare, sum and average it without special cases.
	function directionOpenness(occupiedDegs, dirDeg) {
		var best = 180, i, d;
		if (!occupiedDegs) { return best; }
		for (i = 0; i < occupiedDegs.length; i++) {
			d = angularGap(dirDeg, occupiedDegs[i]);
			if (d < best) { best = d; }
		}
		return best;
	}
	// WHICH OF THE OFFERED DIRECTIONS IS MOST OPEN -- returned as an index into `dirDegs`, so the
	// caller keeps ownership of what those directions mean.
	//
	// **THE FIRST DIRECTION IS THE INCUMBENT AND WINS EVERY TIE AND EVERY NARROW CONTEST.** `margin`
	// is how much better a challenger must be, as a ratio, exactly as LPN_SIDE_SWITCH_MARGIN already
	// requires of a pipe label's other side. A drawing whose labels sit one side of some nodes and
	// the other side of others, for differences no reader can perceive, is worse than one that is
	// occasionally tight: consistency IS legibility here. Pass margin 1 for a plain argmax.
	function mostOpenDirection(occupiedDegs, dirDegs, margin) {
		var best = 0, bestOpen = directionOpenness(occupiedDegs, dirDegs[0]), i, open;
		margin = margin > 0 ? margin : 1;
		for (i = 1; i < dirDegs.length; i++) {
			open = directionOpenness(occupiedDegs, dirDegs[i]);
			if (open > bestOpen * margin) { bestOpen = open; best = i; }
		}
		return best;
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


	// ---- "HOW CLOSE IS THE NEAREST OTHER PIPE" IS A LOCAL QUESTION, NOT A WALK ------------------
	//
	// pointToPolylineDistance() answers it for ONE polyline, and looped-network.js's alignedSideFor()
	// used to call it for EVERY link to decide which side of its own pipe ONE label hangs on --
	// 480 x 480 on the 256-junction grid dev/browser-pass/specs/perf.js is measured against, and 21%
	// of the self time of opening it. Nothing about the answer is global: a candidate position is
	// beaten by whichever pipe happens to be nearest it, and every pipe further away than the best
	// found so far cannot change it.
	//
	// So the segments go into a uniform grid once per pass and each query walks OUTWARD in rings
	// until the ring itself is further away than the best distance already found.
	//
	// **THE ANSWER IS THE SAME NUMBER, NOT AN APPROXIMATION OF IT**, and that is what makes this an
	// optimisation rather than a change to the drawing: a label placed on the other side of its pipe
	// is a defect, not a saving. `dev/lpn-spike/aligned-side-index-harness.js` requires this to agree
	// with pointToPolylineDistance() exactly, and counts the calls that prove the walk is gone.
	//
	// **A SEGMENT SPANNING MANY CELLS GOES IN A LIST THAT IS ALWAYS CHECKED**, rather than into every
	// cell it crosses. A transmission main across a whole network would otherwise be filed thousands
	// of times, which is the cost this is here to remove, paid at build time instead.
	var SEG_INDEX_MAX_AXIS = 256, SEG_INDEX_MAX_CELLS = 32;
	// `entries` is [{key, pts}] -- key is whatever the caller wants back for "whose segment is this",
	// and is what a query excludes. Point lists come in exactly as pointToPolylineDistance() takes
	// them, so there is one shape of geometry in this file and not two.
	function buildSegmentIndex(entries) {
		var segs = [], i, j, pts, a, b,
			minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		function usable(p) { return !!p && isFinite(p.x) && isFinite(p.y); }
		function addSeg(key, ax, ay, bx, by) {
			segs.push({ key: key, ax: ax, ay: ay, bx: bx, by: by });
			if (ax < minX) { minX = ax; } if (ax > maxX) { maxX = ax; }
			if (bx < minX) { minX = bx; } if (bx > maxX) { maxX = bx; }
			if (ay < minY) { minY = ay; } if (ay > maxY) { maxY = ay; }
			if (by < minY) { minY = by; } if (by > maxY) { maxY = by; }
		}
		for (i = 0; i < (entries || []).length; i++) {
			pts = (entries[i] && entries[i].pts) || [];
			// A single usable point is a degenerate segment, which is what pointToSegmentDistance()
			// already treats a zero-length one as -- so a stub link still registers.
			for (j = 0; j + 1 < pts.length; j++) {
				a = pts[j]; b = pts[j + 1];
				if (usable(a) && usable(b)) { addSeg(entries[i].key, a.x, a.y, b.x, b.y); }
				else if (usable(a)) { addSeg(entries[i].key, a.x, a.y, a.x, a.y); }
				else if (usable(b)) { addSeg(entries[i].key, b.x, b.y, b.x, b.y); }
			}
			if (pts.length === 1 && usable(pts[0])) {
				addSeg(entries[i].key, pts[0].x, pts[0].y, pts[0].x, pts[0].y);
			}
		}
		var idx = { segs: segs, big: segs, cells: null, cell: 0, minX: 0, minY: 0, nx: 0, ny: 0 };
		if (!segs.length) { idx.big = []; return idx; }
		// About one segment per cell, capped so a degenerate bounding box (every pipe on one line)
		// cannot ask for an unbounded grid.
		var span = Math.max(maxX - minX, maxY - minY),
			axis = Math.max(1, Math.min(SEG_INDEX_MAX_AXIS, Math.ceil(Math.sqrt(segs.length))));
		if (!(span > 0) || !isFinite(span)) { idx.big = segs; return idx; }
		idx.cell = span / axis;
		idx.minX = minX; idx.minY = minY;
		idx.nx = axis; idx.ny = axis;
		idx.cells = [];
		idx.big = [];
		for (i = 0; i < axis * axis; i++) { idx.cells.push(null); }
		function cellOf(v, lo) {
			var k = Math.floor((v - lo) / idx.cell);
			return k < 0 ? 0 : (k > axis - 1 ? axis - 1 : k);
		}
		for (i = 0; i < segs.length; i++) {
			var s = segs[i],
				x0 = cellOf(Math.min(s.ax, s.bx), minX), x1 = cellOf(Math.max(s.ax, s.bx), minX),
				y0 = cellOf(Math.min(s.ay, s.by), minY), y1 = cellOf(Math.max(s.ay, s.by), minY);
			if ((x1 - x0 + 1) * (y1 - y0 + 1) > SEG_INDEX_MAX_CELLS) { idx.big.push(s); continue; }
			for (var cy = y0; cy <= y1; cy++) {
				for (var cx = x0; cx <= x1; cx++) {
					var k = cy * axis + cx;
					if (!idx.cells[k]) { idx.cells[k] = []; }
					idx.cells[k].push(s);
				}
			}
		}
		return idx;
	}
	// The distance from (px, py) to the nearest segment in the index whose key is NOT `excludeKey`.
	// Infinity when there is no such segment, exactly as pointToPolylineDistance() of nothing is.
	function nearestSegmentDistance(idx, px, py, excludeKey) {
		var best = Infinity;
		function consider(arr) {
			var t, s, d;
			for (t = 0; t < arr.length; t++) {
				s = arr[t];
				if (s.key === excludeKey) { continue; }
				d = pointToSegmentDistance(px, py, s.ax, s.ay, s.bx, s.by);
				if (d < best) { best = d; }
			}
		}
		function cellAt(gx, gy) {
			if (gx < 0 || gy < 0 || gx > idx.nx - 1 || gy > idx.ny - 1) { return; }
			var list = idx.cells[gy * idx.nx + gx];
			if (list) { consider(list); }
		}
		if (!idx) { return best; }
		consider(idx.big);
		if (!idx.cells) { return best; }
		// The query point's own cell, UNCLAMPED: a point outside the drawing is still a definite
		// number of rings away from everything in it, and clamping it would break the stopping rule
		// below by pretending it sits on the edge.
		var cx = Math.floor((px - idx.minX) / idx.cell), cy = Math.floor((py - idx.minY) / idx.cell),
			nx = idx.nx, ny = idx.ny,
			// The first ring that can touch the grid at all, and the last that can.
			rFrom = Math.max(0, -cx, cx - (nx - 1), -cy, cy - (ny - 1)),
			rTo = Math.max(Math.abs(cx), Math.abs(cx - (nx - 1)), Math.abs(cy), Math.abs(cy - (ny - 1))),
			r, g;
		for (r = rFrom; r <= rTo; r++) {
			// **THE STOPPING RULE IS (r - 1), NOT r.** The point sits somewhere inside its own cell,
			// not at its centre, so a cell r rings out is only guaranteed to be (r - 1) cells away.
			// Off by one here and the nearest pipe is sometimes missed -- silently, on one label.
			if (best <= (r - 1) * idx.cell) { break; }
			if (r === 0) { cellAt(cx, cy); continue; }
			// The perimeter of the ring only; everything inside it was done on an earlier pass.
			for (g = cx - r; g <= cx + r; g++) { cellAt(g, cy - r); cellAt(g, cy + r); }
			for (g = cy - r + 1; g <= cy + r - 1; g++) { cellAt(cx - r, g); cellAt(cx + r, g); }
		}
		return best;
	}

	return {
		polylineLength: polylineLength,
		geodesicMeters: geodesicMeters,
		geodesicPolylineMeters: geodesicPolylineMeters,
		polylinePointsAttr: polylinePointsAttr,
		pointAlongPolyline: pointAlongPolyline,
		segmentAtFraction: segmentAtFraction,
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
		pointToPolylineDistance: pointToPolylineDistance,
		buildSegmentIndex: buildSegmentIndex,
		nearestSegmentDistance: nearestSegmentDistance,
		angularGap: angularGap,
		directionOpenness: directionOpenness,
		mostOpenDirection: mostOpenDirection
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}

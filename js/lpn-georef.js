// lpn-georef.js — placing an XY-grid network onto the world map (ROADMAP Task 145).
//
// Pure math for the georeferencing wizard: the user has a network drawn in arbitrary XY units
// and wants it on OpenStreetMap. That is a RIGID SIMILARITY TRANSFORM — translate, uniform
// scale, rotate — and nothing else. No shear, no per-axis scale, no rubber-sheeting: a survey
// drawing is already correct in its own frame, and anything that could stretch one axis would
// silently deform pipe lengths the user measured.
//
// Split from js/looped-network.js by PURITY exactly as js/lpn-geom.js was: everything here
// takes values and returns values — no DOM, no `doc`, no settings, no closure variables. The
// caller stays responsible for reading node coordinates out of the document, for drawing the
// handles, and for writing the answer back.
//
// COORDINATES ARE THE DOCUMENT'S OWN, Y-UP. That is the outward frame the editor already
// reports to the user (outwardX()/outwardY() in looped-network.js), the frame an EPANET
// [COORDINATES] row is written in, and the frame in which "north" means +y. The editor's
// INTERNAL geometry is y-down (SVG), so a caller must convert before it gets here — handing
// screen-frame y to this file mirrors the whole network north-south.
//
// THE TRANSFORM OBJECT is the whole interface:
//
//     { anchor: {x, y},          the doc-space point that lands on `origin`
//       origin: {lon, lat},      where it lands, degrees
//       metersPerUnit: number,   ground metres per one doc XY unit
//       rotDeg: number }         CCW-positive; 0 means model +y points north
//
// Everything else is derived from it, and every "With..." function returns a NEW one. Nothing
// here mutates its argument, because the wizard's preview re-derives from the committed
// transform on every pointer move and a mutating helper would compound the drag.

var EngCalcs = EngCalcs || {};

(function () {
	'use strict';

	// ---- the projection ------------------------------------------------------------------
	//
	// A LOCAL TANGENT PLANE about `origin` — literally the flat-earth approximation, and the
	// right one here. A distribution network is a site; over a few kilometres the ellipsoid's
	// curvature is below the width of the pipe symbol.
	//
	// **THE RADII ARE EVALUATED AT `origin.lat`, WHICH IS A CONSTANT, AND THAT IS THE WHOLE
	// DESIGN.** js/lpn-geom.js's geodesicMeters() evaluates them at the MEAN latitude of the two
	// points it measures, which is more accurate for a single measurement and is not invertible:
	// the mean latitude depends on the answer. A georeferencing transform must be exactly
	// invertible — the user drags a handle in lon/lat and we must recover the doc point it grabbed
	// — so the radii are frozen at the origin and the inverse is plain algebra. The price is a
	// scale error that grows with distance from the origin; dev/lpn-spike/georef-harness.js
	// measures it rather than asserting it is small.
	//
	// These must be the SAME WGS84 constants js/lpn-geom.js defines, derived the same way from the
	// two defining ones. The harness checks that by comparing a mapped leg against that file's own
	// geodesicMeters(), so a divergence here fails a test rather than showing up as a map that
	// drifts off its own basemap.
	var WGS84_A = 6378137;                    // semi-major axis, metres
	var WGS84_F = 1 / 298.257223563;          // flattening
	var WGS84_E2 = WGS84_F * (2 - WGS84_F);   // first eccentricity squared
	var DEG = Math.PI / 180;

	// Metres per degree of latitude and of longitude AT ONE LATITUDE: the meridional radius M and
	// the prime-vertical radius N, the latter shrunk by cos(lat) because a degree of longitude
	// closes toward the poles.
	function metersPerDegree(lat) {
		var s = Math.sin(lat * DEG), w = 1 - WGS84_E2 * s * s;
		return {
			lat: WGS84_A * (1 - WGS84_E2) / Math.pow(w, 1.5) * DEG,
			lon: WGS84_A / Math.sqrt(w) * Math.cos(lat * DEG) * DEG
		};
	}

	// **LONGITUDE WRAPS AND LATITUDE DOES NOT.** Same rule as geodesicMeters(): two points either
	// side of the 180th meridian are neighbours. Without this a network straddling the
	// antimeridian inverts to doc coordinates most of the way round the world.
	function wrapLon(d) {
		var r = (d + 180) % 360;
		return (r < 0 ? r + 360 : r) - 180;
	}

	// doc (x, y) -> {lon, lat}.
	function toLonLat(t, x, y) {
		var rad = t.rotDeg * DEG, cos = Math.cos(rad), sin = Math.sin(rad),
			dx = x - t.anchor.x, dy = y - t.anchor.y,
			east = (dx * cos - dy * sin) * t.metersPerUnit,
			north = (dx * sin + dy * cos) * t.metersPerUnit,
			mpd = metersPerDegree(t.origin.lat);
		return {
			lon: wrapLon(t.origin.lon + east / mpd.lon),
			lat: t.origin.lat + north / mpd.lat
		};
	}

	// The exact algebraic inverse of toLonLat(): a rotation matrix's inverse is its transpose, and
	// the radii are constants, so there is nothing to iterate.
	function fromLonLat(t, lon, lat) {
		var mpd = metersPerDegree(t.origin.lat),
			east = wrapLon(lon - t.origin.lon) * mpd.lon,
			north = (lat - t.origin.lat) * mpd.lat,
			rad = t.rotDeg * DEG, cos = Math.cos(rad), sin = Math.sin(rad),
			s = t.metersPerUnit;
		return {
			x: t.anchor.x + (east * cos + north * sin) / s,
			y: t.anchor.y + (-east * sin + north * cos) / s
		};
	}

	function points(t, pts) {
		var i, out = [];
		for (i = 0; i < pts.length; i++) { out.push(toLonLat(t, pts[i].x, pts[i].y)); }
		return out;
	}

	// ---- building a transform ------------------------------------------------------------

	// TWO CONTROL POINTS FULLY DETERMINE A SIMILARITY, which is why the wizard asks for exactly
	// two and not three: two points carry four numbers, and translate + scale + rotate is four
	// unknowns. A third point would over-determine it and force a least-squares fit that honours
	// NEITHER point the user placed — the opposite of what "I put this corner on that corner"
	// means to them.
	//
	// `a` and `b` are {x, y, lon, lat}. Solved in the tangent plane about `a`, so `a` is exact by
	// construction and `b` is exact because the plane is the same one toLonLat() will use.
	//
	// The algebra is one complex division. Rotating (dx, dy) by `rad` and scaling by `s` is
	// multiplication by s·e^(i·rad), so s·e^(i·rad) = (east + i·north) / (dx + i·dy): the modulus
	// is metersPerUnit and the argument is rotDeg.
	function fromTwoPoints(a, b) {
		var mpd = metersPerDegree(a.lat),
			east = wrapLon(b.lon - a.lon) * mpd.lon,
			north = (b.lat - a.lat) * mpd.lat,
			dx = b.x - a.x, dy = b.y - a.y,
			den = dx * dx + dy * dy,
			// A degenerate pair (the same doc point twice) has no scale and no rotation to
			// recover; return an identity-rotation transform at metre scale rather than NaN,
			// so the wizard shows something and the user can move a handle.
			re = den ? (east * dx + north * dy) / den : 1,
			im = den ? (north * dx - east * dy) / den : 0;
		return {
			anchor: { x: a.x, y: a.y },
			origin: { lon: a.lon, lat: a.lat },
			metersPerUnit: Math.hypot(re, im),
			rotDeg: Math.atan2(im, re) / DEG
		};
	}

	// Bounding box of doc points. Lives here rather than in the caller so the wizard, the fit and
	// the harness cannot disagree about what "the model's extent" is.
	function bounds(pts) {
		var i, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for (i = 0; i < pts.length; i++) {
			if (pts[i].x < minX) { minX = pts[i].x; }
			if (pts[i].y < minY) { minY = pts[i].y; }
			if (pts[i].x > maxX) { maxX = pts[i].x; }
			if (pts[i].y > maxY) { maxY = pts[i].y; }
		}
		return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
	}

	function metersPerUnitFromExtent(modelExtentUnits, groundMeters) {
		return modelExtentUnits ? groundMeters / modelExtentUnits : 1;
	}

	// THE FIRST PLACEMENT, and it is deliberately approximate. Centres the model's bounding box in
	// the given lon/lat rectangle, unrotated, scaled to fill FILL_FRACTION of whichever dimension
	// binds. Its job is reassurance — the user sees their network on a map at a plausible size and
	// then refines it — so nothing here needs to be right, only visible. Precision arrives with
	// fromTwoPoints().
	var FILL_FRACTION = 0.8;
	function fitToBounds(ptsXY, boundsLonLat) {
		var b = bounds(ptsXY),
			latC = (boundsLonLat.south + boundsLonLat.north) / 2,
			lonC = wrapLon(boundsLonLat.west + wrapLon(boundsLonLat.east - boundsLonLat.west) / 2),
			mpd = metersPerDegree(latC),
			groundW = Math.abs(wrapLon(boundsLonLat.east - boundsLonLat.west)) * mpd.lon,
			groundH = Math.abs(boundsLonLat.north - boundsLonLat.south) * mpd.lat,
			modelW = b.maxX - b.minX, modelH = b.maxY - b.minY,
			scale = Infinity;
		if (modelW > 0) { scale = Math.min(scale, groundW / modelW); }
		if (modelH > 0) { scale = Math.min(scale, groundH / modelH); }
		// A single point, or a model with no extent on either axis, has no scale to derive. One
		// metre per unit is the honest default: it is what a bare EPANET file means by SI units.
		if (!isFinite(scale) || !(scale > 0)) { scale = 1; }
		return {
			anchor: { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 },
			origin: { lon: lonC, lat: latC },
			metersPerUnit: scale * FILL_FRACTION,
			rotDeg: 0
		};
	}

	// ---- editing a transform ---------------------------------------------------------------

	// AN EQUIVALENT TRANSFORM RE-EXPRESSED ABOUT A CHOSEN PIVOT. Scaling and rotating both need a
	// fixed point, and expressing the transform about that point is what MAKES it fixed: after
	// this, changing metersPerUnit or rotDeg cannot move the pivot, because the pivot IS the
	// anchor/origin pair. No compensating translation to get wrong.
	//
	// The rebased transform is not bit-identical to its input away from the pivot: the tangent
	// plane moves to the pivot's latitude, so the radii change by the same few ppm the projection
	// is accurate to anyway. That is the cost of exactness AT the handle, which is where the user
	// is looking.
	function rebase(t, pivotLonLat) {
		var p = fromLonLat(t, pivotLonLat.lon, pivotLonLat.lat);
		return {
			anchor: { x: p.x, y: p.y },
			origin: { lon: pivotLonLat.lon, lat: pivotLonLat.lat },
			metersPerUnit: t.metersPerUnit,
			rotDeg: t.rotDeg
		};
	}

	// Move the whole model by a lon/lat offset. The tangent plane travels with it, which is what
	// "the model moved" means — the drawing is rigid and the ground under it changed.
	function withTranslation(t, dLon, dLat) {
		return {
			anchor: { x: t.anchor.x, y: t.anchor.y },
			origin: { lon: wrapLon(t.origin.lon + dLon), lat: t.origin.lat + dLat },
			metersPerUnit: t.metersPerUnit,
			rotDeg: t.rotDeg
		};
	}

	// A corner handle drags about the OPPOSITE corner, so the pivot is a lon/lat the caller
	// already has on screen rather than a doc point it would have to invert first.
	function withScale(t, factor, pivotLonLat) {
		var r = rebase(t, pivotLonLat);
		r.metersPerUnit = t.metersPerUnit * factor;
		return r;
	}

	// CCW-positive, matching rotDeg's own sense: with the model's +y pointing north at rotDeg 0,
	// +90 turns it to point WEST.
	function withRotation(t, deltaDeg, pivotLonLat) {
		var r = rebase(t, pivotLonLat);
		r.rotDeg = t.rotDeg + deltaDeg;
		return r;
	}

	EngCalcs.lpnGeorefToLonLat = toLonLat;
	EngCalcs.lpnGeorefFromLonLat = fromLonLat;
	EngCalcs.lpnGeorefPoints = points;
	EngCalcs.lpnGeorefFromTwoPoints = fromTwoPoints;
	EngCalcs.lpnGeorefFitToBounds = fitToBounds;
	EngCalcs.lpnGeorefWithTranslation = withTranslation;
	EngCalcs.lpnGeorefWithScale = withScale;
	EngCalcs.lpnGeorefWithRotation = withRotation;
	EngCalcs.lpnGeorefBounds = bounds;
	EngCalcs.lpnGeorefMetersPerUnitFromExtent = metersPerUnitFromExtent;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}

// Task 145 — headless check of js/lpn-georef.js, the georeferencing wizard's pure math.
//
//   node dev/lpn-spike/georef-harness.js
//
// require()s its subject directly, like geom-harness.js and for the same reason: what is tested
// below is byte-for-byte the module the page loads, not a function lifted out of a closure.
//
// What can actually be wrong here:
//   * the inverse not being the inverse -- a handle drag would then walk the model a little
//     further every pointer move, which reads as "the map is drifting" and never as an algebra
//     bug. Section 1 is the whole reason the radii are frozen at origin.lat;
//   * the rotation sense, which has a 50% chance of being right by accident and mirrors the
//     network when it is wrong (section 4);
//   * a pivot that does not hold still, so a corner handle scales the model AND slides it
//     (section 5);
//   * the flat-earth approximation being used outside the site-sized range it is good for.
//     Section 3 MEASURES that rather than asserting it, and prints the number, so a later reader
//     deciding whether a 50 km network is acceptable has the figure in front of them instead of
//     the word "small";
//   * a "With..." helper mutating the committed transform the preview re-derives from (section 6).

const Geom = require('../../js/lpn-geom.js').lpnGeom;
const G = require('../../js/lpn-georef.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

function T(anchorX, anchorY, lon, lat, mpu, rot) {
	return {
		anchor: { x: anchorX, y: anchorY },
		origin: { lon: lon, lat: lat },
		metersPerUnit: mpu,
		rotDeg: rot
	};
}

// ---- 1. round trip -----------------------------------------------------------------------
// The inverse must be EXACT, not merely close: a wizard drag reads a lon/lat back to doc space
// and writes the result, so any one-way error compounds over the drag.
console.log('--- round trip: fromLonLat(toLonLat(p)) === p ---');
{
	const lats = [0, 38, 60, -33];
	// Up to 100 m per unit against points 10,000 units out, i.e. a model a thousand kilometres
	// across. Beyond that the model wraps the antimeridian and the inverse is genuinely
	// many-to-one -- a limit of the sphere, not of the algebra, and far outside this page's scope.
	const scales = [0.001, 1, 30.48, 100];
	const rots = [0, 17, 90, 180, -123.456];
	const pts = [
		{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 },
		{ x: -450.25, y: 1200.75 }, { x: 9999, y: -8888 }
	];
	// MEASURED IN GROUND METRES AS WELL AS DOC UNITS. The precision floor here is the lon/lat
	// pair itself: a longitude near 112 degrees resolves to about 1.4e-14 in a double, which is
	// a couple of NANOMETRES on the ground no matter what metersPerUnit is. A doc-unit budget
	// therefore cannot be met at every scale at once -- at 0.001 m per unit those same two
	// nanometres are 2e-6 doc units -- while the drawing is unaffected either way. So the
	// scale-free assertion is in metres, and 1e-9 doc units is asserted at the scales a real
	// project uses.
	let worstM = 0, worstDoc = 0, worstAt = '';
	lats.forEach(lat => scales.forEach(mpu => rots.forEach(rot => {
		const t = T(120, -45, -111.94, lat, mpu, rot);
		pts.forEach(p => {
			const ll = G.lpnGeorefToLonLat(t, p.x, p.y);
			const back = G.lpnGeorefFromLonLat(t, ll.lon, ll.lat);
			const abs = Math.max(Math.abs(back.x - p.x), Math.abs(back.y - p.y));
			if (abs * mpu > worstM) {
				worstM = abs * mpu; worstDoc = abs;
				worstAt = `lat ${lat}, mpu ${mpu}, rot ${rot}, (${p.x},${p.y})`;
			}
		});
	})));
	report(worstM < 1e-6, 'round trip closes to under a micrometre of ground over 4 latitudes x 4 scales x 5 rotations',
		`worst ${worstM.toExponential(3)} m (${worstDoc.toExponential(3)} doc units) at ${worstAt}`);
	// The same sweep restricted to project-realistic scales, where the doc-unit budget applies.
	let worstReal = 0, realAt = '';
	lats.forEach(lat => [1, 30.48, 100].forEach(mpu => rots.forEach(rot => {
		const t = T(120, -45, -111.94, lat, mpu, rot);
		pts.forEach(p => {
			const ll = G.lpnGeorefToLonLat(t, p.x, p.y);
			const back = G.lpnGeorefFromLonLat(t, ll.lon, ll.lat);
			const abs = Math.max(Math.abs(back.x - p.x), Math.abs(back.y - p.y));
			if (abs > worstReal) { worstReal = abs; realAt = `lat ${lat}, mpu ${mpu}, rot ${rot}`; }
		});
	})));
	// 1e-8 rather than 1e-9, and the reason is not sloppiness: `lon - origin.lon` subtracts two
	// numbers near 112 degrees, and a double's last bit there is 1.4e-14 degrees, which is about
	// 2.3 nanometres of ground. At 1 m per unit that IS 2.3e-9 doc units, so a 1e-9 budget is
	// below what absolute lon/lat arithmetic can deliver, whatever the algebra does. Measured
	// worst below; anything an order of magnitude larger is a real regression.
	report(worstReal < 1e-8, 'round trip is exact to 1e-8 doc units at 1 m/unit and coarser',
		`worst ${worstReal.toExponential(3)} at ${realAt}`);
}

// The antimeridian, which is the one place a longitude subtraction can be wrong by 360 degrees.
{
	const t = T(0, 0, 179.98, -17, 1, 0);
	const ll = G.lpnGeorefToLonLat(t, 5000, 0);
	const back = G.lpnGeorefFromLonLat(t, ll.lon, ll.lat);
	report(ll.lon < 0 && near(back.x, 5000, 1e-6) && near(back.y, 0, 1e-6),
		'a model crossing the 180th meridian wraps rather than travelling round the world',
		`lon ${ll.lon.toFixed(5)}, back to x ${back.x.toFixed(6)}`);
}

// ---- 2. fromTwoPoints --------------------------------------------------------------------
// Two control points carry four numbers and a similarity has four unknowns, so BOTH must be
// reproduced exactly. A fit that only honours one is the classic failure and looks fine on the
// point the user placed first.
console.log('--- fromTwoPoints reproduces both control points ---');
{
	const cases = [
		[{ x: 0, y: 0, lon: -111.94, lat: 33.42 }, { x: 1000, y: 0, lon: -111.929, lat: 33.4245 }],
		[{ x: 250, y: -700, lon: 2.3522, lat: 48.8566 }, { x: -1300, y: 900, lon: 2.3400, lat: 48.8700 }],
		[{ x: -5, y: -5, lon: 100.5018, lat: 13.7563 }, { x: 5, y: 5, lon: 100.5019, lat: 13.7564 }],
		// Southern hemisphere, and a pair whose model vector points the "wrong" way round.
		[{ x: 800, y: 400, lon: 151.2093, lat: -33.8688 }, { x: -200, y: -600, lon: 151.2000, lat: -33.8760 }]
	];
	let worst = 0;
	cases.forEach((c, i) => {
		const t = G.lpnGeorefFromTwoPoints(c[0], c[1]);
		c.forEach(cp => {
			const ll = G.lpnGeorefToLonLat(t, cp.x, cp.y);
			worst = Math.max(worst, Math.abs(ll.lon - cp.lon), Math.abs(ll.lat - cp.lat));
		});
		report(true, `case ${i + 1} solved`,
			`${t.metersPerUnit.toPrecision(8)} m/unit, rot ${t.rotDeg.toFixed(4)} deg`);
	});
	report(worst < 1e-9, 'both control points land within 1e-9 degrees', `worst ${worst.toExponential(3)} deg`);
}

// A degenerate pair must not produce NaN -- the wizard shows something and the user drags a handle.
{
	const t = G.lpnGeorefFromTwoPoints(
		{ x: 10, y: 10, lon: 5, lat: 45 }, { x: 10, y: 10, lon: 5.001, lat: 45 });
	report(isFinite(t.metersPerUnit) && isFinite(t.rotDeg),
		'two control points at the SAME doc point give a finite transform, not NaN',
		`${t.metersPerUnit} m/unit, rot ${t.rotDeg}`);
}

// ---- 3. GROUND FIDELITY, the one that matters --------------------------------------------
// Does a pipe that is 5000 units long in the model actually measure 5000 x metersPerUnit on the
// ellipsoid? Measured with js/lpn-geom.js's own geodesicMeters(), which is what the editor
// reports pipe lengths with -- so this is simultaneously the check that the WGS84 constants in
// the two files agree.
//
// The error is the price of freezing the radii at origin.lat instead of re-evaluating them at
// each leg's mean latitude. It grows with the square of distance from the origin and with
// latitude, which is exactly why the numbers below are printed rather than merely passed.
console.log('--- ground fidelity: mapped leg vs geodesicMeters() ---');
//
// THE LEGS RUN FROM THE ORIGIN OUTWARD, NOT SYMMETRICALLY ACROSS IT. A leg centred on the origin
// has the origin AS its mean latitude, so geodesicMeters() and this file evaluate the radii at
// the same place and agree to rounding -- which measures nothing. The user's anchor is a corner
// of their drawing, so the honest test puts the whole model on one side of it.
function legErrors(lat, mpu, extentUnits, label, tolFrac) {
	const t = T(0, 0, -111.94, lat, mpu, 0);
	const h = extentUnits;
	const legs = [
		['north-south', { x: 0, y: 0 }, { x: 0, y: h }],
		['east-west', { x: 0, y: 0 }, { x: h, y: 0 }],
		['diagonal', { x: 0, y: 0 }, { x: h, y: h }]
	];
	let worst = 0, worstLeg = '';
	legs.forEach(([name, a, b]) => {
		const want = Math.hypot(b.x - a.x, b.y - a.y) * mpu;
		const A = G.lpnGeorefToLonLat(t, a.x, a.y), B = G.lpnGeorefToLonLat(t, b.x, b.y);
		const got = Geom.geodesicMeters(A.lon, A.lat, B.lon, B.lat);
		const e = Math.abs(got - want) / want;
		if (e > worst) { worst = e; worstLeg = name; }
	});
	const pct = (worst * 100).toPrecision(3);
	if (tolFrac === undefined) {
		report(true, `${label}: worst leg error`, `${pct}%  (${worstLeg})`);
	} else {
		report(worst < tolFrac, `${label}: every leg within ${(tolFrac * 100).toPrecision(2)}%`,
			`worst ${pct}%  (${worstLeg})`);
	}
	return worst;
}
// The site-sized case the wizard is FOR: a 5 km x 5 km model at 38 degrees, 1 m per unit.
legErrors(38, 1, 5000, '5 km at lat 38', 0.0002);
// The numbers that turn "site-sized only" into a measurement instead of a claim.
legErrors(60, 1, 5000, '5 km at lat 60');
legErrors(38, 10, 5000, '50 km at lat 38');
legErrors(60, 10, 5000, '50 km at lat 60');

// THE CONSTANTS THEMSELVES, isolated from the mean-latitude difference above: a leg CENTRED on
// the origin latitude gives geodesicMeters() the very same latitude this file froze its radii at,
// so the only thing left that can disagree is the value of A, F or E2. Ten kilometres rather
// than one hundred metres, because geodesicMeters() subtracts two latitudes near 47 and a short
// leg loses four digits of the difference to cancellation before any constant is consulted.
{
	const t = T(0, 0, 7.4474, 46.9480, 1, 0);
	const A = G.lpnGeorefToLonLat(t, 0, -5000), B = G.lpnGeorefToLonLat(t, 0, 5000);
	const e = Math.abs(Geom.geodesicMeters(A.lon, A.lat, B.lon, B.lat) - 10000) / 10000;
	report(e < 1e-12, 'the WGS84 constants agree with js/lpn-geom.js: 10 km north measures 10 km',
		`relative error ${e.toExponential(3)}`);
	const C = G.lpnGeorefToLonLat(t, -5000, 0), D = G.lpnGeorefToLonLat(t, 5000, 0);
	const e2 = Math.abs(Geom.geodesicMeters(C.lon, C.lat, D.lon, D.lat) - 10000) / 10000;
	report(e2 < 1e-12, '...and east-west too, so N as well as M matches', `relative error ${e2.toExponential(3)}`);
}

// metersPerUnitFromExtent is the wizard's "this drawing is 2000 ft across" entry point.
report(G.lpnGeorefMetersPerUnitFromExtent(1000, 304.8) === 0.3048,
	'metersPerUnitFromExtent: 1000 units across 304.8 m is 0.3048 m/unit');
report(G.lpnGeorefMetersPerUnitFromExtent(0, 500) === 1,
	'metersPerUnitFromExtent: a zero extent falls back to 1, never Infinity');

// ---- 4. rotation sense -------------------------------------------------------------------
// CCW-positive. Getting this backwards mirrors the network, and a symmetric test network would
// not show it -- hence an explicit compass assertion.
console.log('--- rotation is CCW-positive ---');
{
	const t = T(0, 0, 0, 45, 1000, 90);
	const p = G.lpnGeorefToLonLat(t, 0, 1);           // one unit along the model's +y
	report(p.lon < 0 && near(p.lat, 45, 1e-9),
		'rotDeg 90 turns the model +y axis to point WEST',
		`lon ${p.lon.toExponential(3)}, lat offset ${(p.lat - 45).toExponential(3)}`);
	const q = G.lpnGeorefToLonLat(T(0, 0, 0, 45, 1000, 0), 0, 1);
	report(q.lat > 45 && near(q.lon, 0, 1e-9), 'rotDeg 0 points the model +y axis NORTH',
		`lat ${q.lat.toFixed(6)}`);
	const r = G.lpnGeorefToLonLat(T(0, 0, 0, 45, 1000, -90), 0, 1);
	report(r.lon > 0, 'rotDeg -90 points it EAST', `lon ${r.lon.toExponential(3)}`);
}

// ---- 5. the pivot holds still ------------------------------------------------------------
// A corner handle drags about the opposite corner. If the pivot moves, the model scales AND
// slides, which the user experiences as the drawing running away from the pointer.
console.log('--- withScale / withRotation hold their pivot ---');
{
	const base = T(300, -120, -111.94, 33.42, 12.5, 23);
	const pivots = [
		G.lpnGeorefToLonLat(base, 0, 0),
		G.lpnGeorefToLonLat(base, 5000, 5000),
		G.lpnGeorefToLonLat(base, -2000, 800)
	];
	let worstS = 0, worstR = 0;
	pivots.forEach(pv => {
		const docPt = G.lpnGeorefFromLonLat(base, pv.lon, pv.lat);
		[0.25, 1, 4.7].forEach(f => {
			const ll = G.lpnGeorefToLonLat(G.lpnGeorefWithScale(base, f, pv), docPt.x, docPt.y);
			worstS = Math.max(worstS, Math.abs(ll.lon - pv.lon), Math.abs(ll.lat - pv.lat));
		});
		[-90, -12.5, 0, 137].forEach(d => {
			const ll = G.lpnGeorefToLonLat(G.lpnGeorefWithRotation(base, d, pv), docPt.x, docPt.y);
			worstR = Math.max(worstR, Math.abs(ll.lon - pv.lon), Math.abs(ll.lat - pv.lat));
		});
	});
	report(worstS < 1e-9, 'withScale leaves its pivot at the same lon/lat', `worst ${worstS.toExponential(3)} deg`);
	report(worstR < 1e-9, 'withRotation leaves its pivot at the same lon/lat', `worst ${worstR.toExponential(3)} deg`);

	// ...and they actually DO the thing, so a no-op could not pass the two checks above.
	const s2 = G.lpnGeorefWithScale(base, 2, pivots[0]);
	report(near(s2.metersPerUnit, 25, 1e-12), 'withScale doubles metersPerUnit', `${s2.metersPerUnit}`);
	const r45 = G.lpnGeorefWithRotation(base, 45, pivots[0]);
	report(near(r45.rotDeg, 68, 1e-12), 'withRotation adds to rotDeg', `${r45.rotDeg}`);

	// TRANSLATION IS RIGID ON THE GROUND, NOT IN DEGREES, and that distinction is the design.
	// The anchor moves by exactly the offset asked for. Every OTHER point moves by the offset
	// plus a small change in longitude SPAN, because the tangent plane travelled to a new
	// latitude where the same ground width is a different number of degrees. Asserting a
	// constant degree offset everywhere would be asserting the map is a flat grid.
	const tr = G.lpnGeorefWithTranslation(base, 0.01, -0.02);
	const a0 = G.lpnGeorefToLonLat(base, base.anchor.x, base.anchor.y);
	const a1 = G.lpnGeorefToLonLat(tr, base.anchor.x, base.anchor.y);
	report(near(a1.lon - a0.lon, 0.01, 1e-12) && near(a1.lat - a0.lat, -0.02, 1e-12),
		'withTranslation moves the anchor by exactly the offset asked for',
		`d(${(a1.lon - a0.lon).toFixed(12)}, ${(a1.lat - a0.lat).toFixed(12)})`);
	const q0 = [{ x: -4000, y: 2500 }, { x: 6000, y: -1500 }];
	const before = Geom.geodesicMeters(
		...['lon', 'lat'].map(k => G.lpnGeorefToLonLat(base, q0[0].x, q0[0].y)[k]),
		...['lon', 'lat'].map(k => G.lpnGeorefToLonLat(base, q0[1].x, q0[1].y)[k]));
	const after = Geom.geodesicMeters(
		...['lon', 'lat'].map(k => G.lpnGeorefToLonLat(tr, q0[0].x, q0[0].y)[k]),
		...['lon', 'lat'].map(k => G.lpnGeorefToLonLat(tr, q0[1].x, q0[1].y)[k]));
	report(Math.abs(after - before) / before < 2e-4,
		'a translated model is still RIGID: the ground distance between two nodes is unchanged',
		`${before.toFixed(3)} m -> ${after.toFixed(3)} m`);
}

// ---- 6. no mutation ----------------------------------------------------------------------
// The wizard's preview re-derives from the committed transform on every pointer move; a helper
// that edited its input in place would compound the whole drag into the document.
console.log('--- the "With..." helpers are pure ---');
{
	const base = T(300, -120, -111.94, 33.42, 12.5, 23);
	const snapshot = JSON.stringify(base);
	const pv = G.lpnGeorefToLonLat(base, 100, 100);
	const results = [
		G.lpnGeorefWithTranslation(base, 0.5, -0.5),
		G.lpnGeorefWithScale(base, 3, pv),
		G.lpnGeorefWithRotation(base, -40, pv)
	];
	report(JSON.stringify(base) === snapshot, 'the input transform is unchanged after every With... call');
	report(results.every(r => r !== base && r.anchor !== base.anchor && r.origin !== base.origin),
		'each returns a NEW object, sharing no nested anchor/origin with its input');
}

// ---- 7. fitToBounds, the first placement -------------------------------------------------
// Reassurance-grade on purpose: the user must SEE their network on a map, then refine it with
// two control points. What must hold is that it lands inside the rectangle and fills it.
console.log('--- fitToBounds ---');
{
	const pts = [{ x: 0, y: 0 }, { x: 2000, y: 0 }, { x: 2000, y: 1000 }, { x: 0, y: 1000 }];
	const b = { west: -112.00, south: 33.40, east: -111.90, north: 33.46 };
	const t = G.lpnGeorefFitToBounds(pts, b);
	const ll = G.lpnGeorefPoints(t, pts);
	const inside = ll.every(p => p.lon > b.west && p.lon < b.east && p.lat > b.south && p.lat < b.north);
	report(inside, 'the whole model lands inside the target rectangle');
	report(t.rotDeg === 0, 'the first placement is unrotated');
	const spanLon = Math.max(...ll.map(p => p.lon)) - Math.min(...ll.map(p => p.lon));
	const spanLat = Math.max(...ll.map(p => p.lat)) - Math.min(...ll.map(p => p.lat));
	const fill = Math.max(spanLon / (b.east - b.west), spanLat / (b.north - b.south));
	report(fill > 0.6 && fill <= 0.85, 'it fills ~80% of the binding dimension', `fill ${(fill * 100).toFixed(1)}%`);
	const c = G.lpnGeorefToLonLat(t, 1000, 500);
	report(near(c.lon, (b.west + b.east) / 2, 1e-9) && near(c.lat, (b.south + b.north) / 2, 1e-9),
		'the model bounding box is centred on the rectangle');
	// A single node has no extent; it must still place, at 1 m per unit, and not divide by zero.
	const one = G.lpnGeorefFitToBounds([{ x: 42, y: 42 }], b);
	report(isFinite(one.metersPerUnit) && one.metersPerUnit > 0,
		'a one-node model places at a finite scale rather than Infinity', `${one.metersPerUnit} m/unit`);
}

// ---- 8. bounds ---------------------------------------------------------------------------
{
	const b = G.lpnGeorefBounds([{ x: 3, y: -1 }, { x: -7, y: 4 }, { x: 0, y: 0 }]);
	report(b.minX === -7 && b.maxX === 3 && b.minY === -1 && b.maxY === 4, 'bounds: min/max on both axes');
	const one = G.lpnGeorefBounds([{ x: 5, y: 6 }]);
	report(one.minX === 5 && one.maxX === 5 && one.minY === 6 && one.maxY === 6, 'bounds: a single point is its own box');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

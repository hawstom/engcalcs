// **HOW BIG A SYSTEM WE SERVE, AND WHAT IT COSTS AT THE EDGE.** Run with:
//   node dev/lpn-spike/scope-of-service-harness.js
//
// Tom, 2026-08-25, striking a code comment that said a document "may span the globe":
//   *"While it's physically feasible for a technological and social society to be so cosmopolitan
//   as to have a system that spans the globe, that utility would have a budget in trillions of
//   dollars, and our mission is aimed at more modest ventures. We can set a mission scope of 300 km
//   or so for a system/model/project span, and even that is probably highly conservative."*
//
// **THE DECLARED MISSION SCOPE IS A 300 km SPAN**, and it is a statement about who this page is for
// rather than about arithmetic. This file exists to say what it costs -- because a scope nobody has
// measured is a number somebody made up -- and to show the cost is negligible well past it, which
// is what "highly conservative" has to mean if it means anything.
//
// (Superseded, recorded so it is not re-proposed: the first ruling the same day was "the width of a
// UTM zone or half the width", 6 degrees or 3. He narrowed it deliberately and gave the reason --
// budget and mission, not geometry. The table below still runs out to 6 degrees so the shape of the
// curve past the scope is visible.)
//
// WHAT IS ACTUALLY APPROXIMATED. js/lpn-geom.js's geodesicMeters() is NOT a geodesic. It takes the
// two WGS84 radii of curvature at the MID-LATITUDE of the leg and treats the leg as flat in that
// local frame. That is excellent for a pipe and degrades with length, and it is what fills every
// `lenAuto` length in a geographic project -- so it is the flat-earth assumption Tom named, and the
// quantity his bound protects.
//
// **MEASURED AGAINST VINCENTY'S INVERSE, WRITTEN HERE FROM THE PUBLISHED FORMULA** rather than
// called out of the page: a harness that checks code against itself proves only self-consistency.
// Vincenty is accurate to well under a millimetre on the ellipsoid, which is four orders of
// magnitude finer than anything asserted below.
//
// WHAT THIS CANNOT SEE: whether anybody's real system is inside the bound. That is a question about
// water utilities, not about arithmetic, and it belongs to the utility-planning-engineer.

const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const Geom = require(path.join(ROOT, 'js', 'lpn-geom.js')).lpnGeom
	|| require(path.join(ROOT, 'js', 'lpn-geom.js'));

let fails = 0;
function ok(what, cond, detail) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + what + (detail !== undefined ? '   ' + detail : ''));
}

// ---- the reference: Vincenty's inverse formula on WGS84 ----------------------------------------
const A = 6378137.0, F = 1 / 298.257223563, B = A * (1 - F);
function vincenty(lon1, lat1, lon2, lat2) {
	const rad = Math.PI / 180;
	const L = (lon2 - lon1) * rad;
	const U1 = Math.atan((1 - F) * Math.tan(lat1 * rad));
	const U2 = Math.atan((1 - F) * Math.tan(lat2 * rad));
	const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
	const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
	let lambda = L, lambdaP, iter = 0;
	let sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaM, C;
	do {
		const sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
		sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
			(cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
		if (sinSigma === 0) { return 0; }
		cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
		sigma = Math.atan2(sinSigma, cosSigma);
		sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
		cos2Alpha = 1 - sinAlpha * sinAlpha;
		cos2SigmaM = cos2Alpha === 0 ? 0 : cosSigma - 2 * sinU1 * sinU2 / cos2Alpha;
		C = F / 16 * cos2Alpha * (4 + F * (4 - 3 * cos2Alpha));
		lambdaP = lambda;
		lambda = L + (1 - C) * F * sinAlpha *
			(sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
	} while (Math.abs(lambda - lambdaP) > 1e-12 && ++iter < 200);
	const u2 = cos2Alpha * (A * A - B * B) / (B * B);
	const Aa = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
	const Bb = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
	const dSigma = Bb * sinSigma * (cos2SigmaM + Bb / 4 *
		(cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
		Bb / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
	return B * Aa * (sigma - dSigma);
}

console.log('--- 0. the reference agrees with ours where nobody doubts it: a pipe ---');
{
	// A 300 m pipe. If these two disagreed here, every number below would be about Vincenty being
	// mistyped rather than about the approximation.
	const lat = 33.0, lon = -112.0, d = 0.003;
	const ours = Geom.geodesicMeters(lon, lat, lon + d, lat + d);
	const ref = vincenty(lon, lat, lon + d, lat + d);
	// A part in 1e7, not 1e9: the two are different formulas, not the same one twice. 0.006 ppm on
	// a 435 m leg is 3 micrometres, which is four orders below anything this page can mean.
	ok('on a short leg the two agree to a part in 1e7',
		Math.abs(ours / ref - 1) < 1e-7,
		ours.toFixed(4) + ' m vs ' + ref.toFixed(4) + ' m  (' + (1e6 * (ours / ref - 1)).toFixed(3) + ' ppm)');
}

console.log('\n--- 1. what the approximation costs across the declared scope ---');
// The worst case for a mid-latitude flat frame is a leg that runs mostly NORTH-SOUTH, because that
// is where the radius of curvature changes fastest across the leg. Reported for both axes so the
// number is not quietly the easy one.
// 2.7 degrees is about 300 km of latitude -- the declared mission scope. The larger spans are kept
// so the shape of the curve past it is visible, not because they are served.
const SCOPE_DEG = 2.7;
const SPANS = [0.1, 0.5, 1, SCOPE_DEG, 3, 6];
const worstBySpan = {};
SPANS.forEach(function (span) {
	let worstPpm = 0, where = '';
	[0, 15, 33, 45, 60].forEach(function (lat0) {
		[[span, 0], [0, span], [span, span]].forEach(function (d) {
			const lon = -112, lat = lat0;
			const ours = Geom.geodesicMeters(lon, lat, lon + d[0], lat + d[1]);
			const ref = vincenty(lon, lat, lon + d[0], lat + d[1]);
			if (ref <= 0) { return; }
			const ppm = Math.abs(1e6 * (ours / ref - 1));
			if (ppm > worstPpm) {
				worstPpm = ppm;
				where = 'lat ' + lat0 + ', d(' + d[0] + ',' + d[1] + '), ' + (ref / 1000).toFixed(0) + ' km';
			}
		});
	});
	worstBySpan[span] = worstPpm;
	console.log('       ' + String(span).padStart(4) + ' deg leg: worst ' +
		worstPpm.toFixed(0).padStart(6) + ' ppm   (' + where + ')');
});

console.log('');
// **THE BOUND, AND IT IS THE POINT OF THE FILE.** At the declared 300 km mission scope the flat
// approximation is far better than the numbers it is fed: nobody places a node by dragging on a map
// to a part in ten thousand, and no Hazen-Williams C is known to a tenth of that.
ok('at the declared 300 km mission scope an automatic length is within 0.05%',
	worstBySpan[SCOPE_DEG] < 500, worstBySpan[SCOPE_DEG].toFixed(0) + ' ppm');
// Tom: *"even that is probably highly conservative."* This is what that sentence means in numbers --
// at more than double the scope it is still a tenth of a percent, so the bound is a mission
// statement with room to spare rather than a cliff the arithmetic falls off.
ok('...and at 6 degrees, more than double it, still within 0.15% -- so the scope is conservative',
	worstBySpan[6] < 1500, worstBySpan[6].toFixed(0) + ' ppm');
// A bound that costs nothing at every size is a bound nobody needs. This says the quantity is real
// and growing, so declining to serve a continental system is a decision rather than a decoration.
ok('...while the error really does grow with span, so this measures something',
	worstBySpan[6] > worstBySpan[SCOPE_DEG] && worstBySpan[SCOPE_DEG] > worstBySpan[0.1],
	[0.1, SCOPE_DEG, 6].map(function (x) { return x + ':' + worstBySpan[x].toFixed(0); }).join('  '));
// The scale every pipe in a real system is drawn at. If this were not tiny the whole page would be
// suspect, and it is the reassurance the bound is protecting.
ok('a leg of ordinary size -- a tenth of a degree, 11 km -- costs under 10 ppm',
	worstBySpan[0.1] < 10, worstBySpan[0.1].toFixed(2) + ' ppm');

console.log('\n--- 2. the antimeridian is still handled, and is not what the scope is about ---');
{
	// A system inside the scope may still straddle 180 degrees. That is a WRAP, not a large span,
	// and geodesicMeters() already handles it; asserted here so the new bound is not read as
	// permission to drop it.
	const ours = Geom.geodesicMeters(179.99, 10, -179.99, 10);
	const ref = vincenty(179.99, 10, -179.99, 10);
	ok('two points either side of 180 are neighbours, not 40,000 km apart',
		Math.abs(ours / ref - 1) < 1e-6 && ours < 5000,
		ours.toFixed(1) + ' m vs ' + ref.toFixed(1) + ' m');
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

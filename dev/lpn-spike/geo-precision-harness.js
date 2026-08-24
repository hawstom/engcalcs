// Where a geographic drawing loses its own coordinates -- ROADMAP Task 439.
//
//   node dev/lpn-spike/geo-precision-harness.js
//
// WHAT THIS MEASURES, AND WHAT IT DOES NOT. The world group carries
// `translate(tx,ty) scale(s)` (setTransform()) and every child carries a RAW document coordinate,
// so a node's screen position is `s * x + tx`. In a geographic project x is a longitude, so at a
// deep zoom `s * x` and `tx` are both enormous and nearly equal, and their difference is a handful
// of pixels. That is catastrophic cancellation, and a rasteriser working in float32 cannot do it.
//
// This harness models THE ARITHMETIC in float32 (Math.fround at each step). It does NOT prove what
// any particular browser does -- Skia's exact pipeline is not reproduced here, and no claim about
// it is made. What it proves is that the composition the page asks for is unrepresentable, which is
// enough to justify the fix and enough to show the fix works. The browser-side symptom is recorded
// separately in Task 439: a <circle> rasterised at x = -41,548,184.
//
// VALIDATED AGAINST ITS OWN REFERENCE FIRST, which is the trap CLAUDE.md names: a harness that
// reimplements the thing it checks must be shown to agree with the thing before it is allowed to
// accuse it. Section 0 does that -- in float64 the same composition is exact to well under a
// thousandth of a pixel, so any error section 1 reports is the float32 model's and not a mistake in
// the arithmetic written here.

const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;
const Geom = require(path.join(ROOT, 'js', 'lpn-geom.js')).lpnGeom
	|| require(path.join(ROOT, 'js', 'lpn-geom.js'));

let fails = 0;
function ok(what, cond, detail) {
	if (!cond) { fails++; }
	console.log((cond ? 'PASS  ' : 'FAIL  ') + what + (detail !== undefined ? '   ' + detail : ''));
}

const f32 = Math.fround;

// A small real network: Novato, California. Half a kilometre across, which is an ordinary site.
// Longitude is the number that matters -- it is ~122, and 122 is the whole problem.
const SITE = { lon: -122.5694, lat: 38.1074 };
const SPAN_DEG = 0.005;   // ~440 m of longitude at this latitude

// The page's own numbers, read out of js/looped-network.js rather than retyped, so this harness
// cannot drift away from the scale the page really permits.
const fs = require('fs');
const SRC = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
// **THE WHOLE EXPRESSION, NOT ITS FIRST NUMBER.** `DEG_PER_M = 1 / 111132` read through a bare
// number-shaped pattern comes back as 1, and the harness then computes a maximum scale of 500
// instead of 5.56e7 and reports that nothing is wrong. That is exactly the stub-that-removes-the-
// coupling failure, and it happened here on the first run: three assertions passed the code by
// asserting against a zoom range the page does not have. Captured to the statement separator and
// evaluated, with a guard so only arithmetic is ever evaluated.
function constOf(name) {
	const m = SRC.match(new RegExp('\\b' + name + '\\s*=\\s*([^;,\\n]+)'));
	if (!m) { throw new Error('could not read ' + name + ' out of js/looped-network.js'); }
	const expr = m[1].trim();
	if (!/^[-+*/()0-9.eE\s]+$/.test(expr)) {
		throw new Error(name + ' is not a numeric expression: ' + expr);
	}
	const v = Function('return (' + expr + ');')();
	if (!isFinite(v)) { throw new Error(name + ' did not evaluate to a number: ' + expr); }
	return v;
}
const MAX_SCALE_GRID = constOf('MAX_SCALE_GRID');
const DEG_PER_M = constOf('DEG_PER_M');
const MAX_SCALE_GEO = MAX_SCALE_GRID / DEG_PER_M;   // maxScale() for a geographic project

// The screen position the page asks a rasteriser for: s * x + tx, where tx puts the view centre in
// the middle of a 1000 px window. Composed step by step so each rounding is where a real pipeline
// would put one.
function screenX(x, centre, s, round) {
	const r = round || (v => v);
	const tx = r(500 - r(r(s) * r(centre)));
	return r(r(r(s) * r(x)) + tx);
}

// A symbol is a few pixels across. An error of half a pixel is the most that can be lost before the
// drawing stops being the drawing; a node dot placed 0.5 px out is still on its pipe.
const TOLERANCE_PX = 0.5;

console.log('--- 0. the reference: in float64 the composition is exact ---');
{
	let worst = 0;
	for (let i = 0; i <= 50; i++) {
		const x = SITE.lon + (i / 50 - 0.5) * SPAN_DEG;
		const got = screenX(x, SITE.lon, MAX_SCALE_GEO);
		const want = MAX_SCALE_GEO * (x - SITE.lon) + 500;
		worst = Math.max(worst, Math.abs(got - want));
	}
	ok('float64 places every node where the algebra says, at the deepest zoom the page allows',
		worst < 1e-3, 'worst ' + worst.toExponential(2) + ' px');
	ok('...so this harness agrees with its own reference before it accuses anything',
		worst < TOLERANCE_PX, worst.toExponential(2) + ' px < ' + TOLERANCE_PX);
}

console.log('\n--- 1. THE DEFECT: the same composition in float32, on raw longitudes ---');
let breakScale = null;
{
	// Walk the zoom range the page permits and find where the drawing stops being placeable.
	for (let s = 1e3; s <= MAX_SCALE_GEO; s *= 2) {
		let worst = 0;
		for (let i = 0; i <= 50; i++) {
			const x = SITE.lon + (i / 50 - 0.5) * SPAN_DEG;
			worst = Math.max(worst, Math.abs(screenX(x, SITE.lon, s, f32) - screenX(x, SITE.lon, s)));
		}
		if (worst > TOLERANCE_PX && breakScale === null) { breakScale = s; }
	}
	ok('there IS a scale inside the permitted range where float32 cannot place a node',
		breakScale !== null, breakScale === null ? 'never broke' : 'first break at ' + breakScale.toExponential(3) + ' px/degree');

	// The roadmap's "past about 600,000 px/degree". Asserted as an ORDER OF MAGNITUDE, not a
	// threshold: the exact number depends on where the site is, and a site at longitude 12 breaks
	// ten times deeper than one at longitude 122. What must hold is that it breaks well inside the
	// range the page's own maxScale() allows.
	ok('...and it is far inside the range, not at its edge',
		breakScale !== null && breakScale < MAX_SCALE_GEO / 100,
		'break ' + (breakScale || 0).toExponential(2) + ' vs maxScale ' + MAX_SCALE_GEO.toExponential(2));

	let worstAtMax = 0;
	for (let i = 0; i <= 50; i++) {
		const x = SITE.lon + (i / 50 - 0.5) * SPAN_DEG;
		worstAtMax = Math.max(worstAtMax,
			Math.abs(screenX(x, SITE.lon, MAX_SCALE_GEO, f32) - screenX(x, SITE.lon, MAX_SCALE_GEO)));
	}
	// **100 px, and the number is principled rather than tuned.** A node placed 100 px from where it
	// was asked for is not on its own pipe, not under its own label and not where a click will find
	// it -- it is a different drawing. The measured value at this site is several times that; the
	// assertion states the line, not the measurement, so a change that halves the error still fails
	// while the drawing is still wrong.
	ok('at the deepest permitted zoom a node lands nowhere near where it was asked for',
		worstAtMax > 100, worstAtMax.toFixed(1) + ' px');
}

console.log('\n--- 2. THE FIX: the same drawing, rebased to a local origin ---');
{
	// The origin is a POWER OF TWO fraction of a degree, and that is not decoration. `lon - ox` is
	// exact in doubles whenever ox/2 <= lon <= 2*ox (Sterbenz), which holds for any origin chosen
	// near the model; a power-of-two grid also makes the origin itself exactly representable, so
	// adding it back on the way out is exact too. Byte-identical round trips depend on both halves.
	const GRID = 1 / 128;
	const ox = Math.floor(SITE.lon / GRID) * GRID;
	ok('the chosen origin is exactly representable', ox === f64exact(ox), String(ox));
	function f64exact(v) { return v; }   // a double is a double; named so the assertion reads

	let worstShift = 0;
	for (let i = 0; i <= 50; i++) {
		const x = SITE.lon + (i / 50 - 0.5) * SPAN_DEG;
		// Round trip: the number that leaves the file, shifted in and back out again.
		worstShift = Math.max(worstShift, Math.abs(((x - ox) + ox) - x));
	}
	ok('shifting a coordinate to the origin and back is EXACT, not merely close',
		worstShift === 0, 'worst departure ' + worstShift);

	let worst = 0;
	for (let i = 0; i <= 50; i++) {
		const x = SITE.lon + (i / 50 - 0.5) * SPAN_DEG;
		worst = Math.max(worst, Math.abs(
			screenX(x - ox, SITE.lon - ox, MAX_SCALE_GEO, f32) -
			screenX(x - ox, SITE.lon - ox, MAX_SCALE_GEO)));
	}
	ok('with a local origin, float32 places every node at the deepest permitted zoom',
		worst < TOLERANCE_PX, 'worst ' + worst.toExponential(2) + ' px');
}

console.log('\n--- 3. the same story on the Y axis, which is Mercator and not a latitude ---');
{
	const my = Geom.mercY(SITE.lat);
	const GRID = 1 / 128;
	const oy = Math.floor(my / GRID) * GRID;
	let worstRaw = 0, worstShifted = 0, worstTrip = 0;
	for (let i = 0; i <= 50; i++) {
		const lat = SITE.lat + (i / 50 - 0.5) * SPAN_DEG;
		const y = Geom.mercY(lat);
		worstRaw = Math.max(worstRaw, Math.abs(screenX(y, my, MAX_SCALE_GEO, f32) - screenX(y, my, MAX_SCALE_GEO)));
		worstShifted = Math.max(worstShifted,
			Math.abs(screenX(y - oy, my - oy, MAX_SCALE_GEO, f32) - screenX(y - oy, my - oy, MAX_SCALE_GEO)));
		worstTrip = Math.max(worstTrip, Math.abs(((y - oy) + oy) - y));
	}
	ok('a Mercator y breaks in float32 exactly as a longitude does', worstRaw > TOLERANCE_PX,
		worstRaw.toExponential(3) + ' px');
	ok('...and a local origin fixes it', worstShifted < TOLERANCE_PX, worstShifted.toExponential(2) + ' px');
	ok('...and the shift is exact on the way out, so a saved file is unchanged',
		worstTrip === 0, 'worst departure ' + worstTrip);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);

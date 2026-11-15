// EPANET's Darcy-Weisbach friction factor, written out again from its source, as an outside reference.
//
// Source: OpenWaterAnalytics/EPANET, src/hydcoeffs.c, DWpipecoeff() and frictionFactor() (v2.2, dev
// branch). The constants A1 to AC are that file's own, lines 23 to 31, and are NOT the ones typed in
// js/PipeHydraulics.lib.js: this is a second transcription, taken from the C source, so a slip in either one
// shows as a disagreement. The reference takes Re and relative roughness e/d, where EPANET takes
// w = q / (viscosity * d) = Re * pi / 4, so the Reynolds-number thresholds read 2000 and 4000.
//
//   Re <= 2000   Hagen-Poiseuille                f = 64/Re   (DWpipecoeff: r = 16 pi s R, A2 * s cut-off)
//   Re >= 4000   Swamee-Jain                     f = 1 / (A9 ln(e/(3.7 d) + A8/w^0.9))^2
//   between      Dunlop's cubic in r = w/A2, with fa and fb evaluated at Re = 4000 (y2 = e/3.7 + AB)
//
// Used by dw-harness.js, mhp-harness.js and ip-harness.js, so the three single-pipe pages are held to the
// same thing.

const A1 = 3.14159265358979323850e+03;   // 1000*PI
const A2 = 1.57079632679489661930e+03;   // 500*PI
const A8 = 4.61841319859066668690e+00;   // 5.74*(PI/4)^.9
const A9 = -8.68588963806503655300e-01;  // -2/ln(10)
const AB = 3.28895476345399058690e-03;   // 5.74/(4000^.9)
const AC = -5.14214965799093883760e-03;  // AA*AB, AA = -2*.9*2/ln(10)

/** EPANET's friction factor at Reynolds number `re` and relative roughness `rel` (= e/d). */
function epanetF(re, rel) {
	const w = re * Math.PI / 4;
	if (w <= A2) { return 64 / re; }
	if (w >= A1) {
		const y1 = A8 / Math.pow(w, 0.9);
		const y3 = A9 * Math.log(rel / 3.7 + y1);
		return 1 / (y3 * y3);
	}
	const y2 = rel / 3.7 + AB;
	const y3 = A9 * Math.log(y2);
	const fa = 1 / (y3 * y3);
	const fb = (2 + AC / (y2 * y3)) * fa;
	const r = w / A2;
	const x1 = 7 * fa - fb;
	const x2 = 0.128 - 17 * fa + 2.5 * fb;
	const x3 = -0.128 + 13 * fa - 2 * fb;
	const x4 = 0.032 - 3 * fa + 0.5 * fb;
	return x1 + r * (x2 + r * (x3 + r * x4));
}

module.exports = { epanetF };

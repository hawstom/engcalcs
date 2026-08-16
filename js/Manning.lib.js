// Manning.lib.js
// Loaded by Manning calculators.

// Master namespace object if not already exists.
EngCalcs.Manning = EngCalcs.Manning || {};

EngCalcs.Manning.c = 1.0;
EngCalcs.Manning.g = EngCalcs.G;
EngCalcs.Manning.alpha_blodgett = 0.319;
EngCalcs.Manning.alpha_bathurst = 1.0;

EngCalcs.Manning.mc_riprap_size = function(y, a, v, g, z, s0, c, sgrock) {
	var
	d50,
	hvmax = v * v * 1.33 * 1.33 / (2 * g) ;
	// Isbash
	d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	return d50;
};
EngCalcs.Manning.bathurst_n = function(alpha, g, t, da, d50, fr) {
	var
	b = 1.14 * Math.pow(d50 / t, 0.453) * Math.pow(da/d50, 0.814),
	fcg = Math.pow(t / da, -b),
	x = 1.025 * Math.pow(t / d50, 0.118),
	freg = 13.434 * Math.pow(t / d50, 0.492) * Math.pow(b, x),
	ffr = Math.pow(0.28 * fr/b, Math.log10(0.755 / b));
	return alpha * Math.pow(da, 1/6) / (Math.sqrt(g) * ffr * freg * fcg);
};

// Given a trapezoidal channel's fixed geometry/hydraulic inputs and a trial depth y,
// runs the same roughness/rock-size auto-iteration mtc_ uses on its main form, to
// convergence (or up to 100 passes). Shared by Manning-Trap.php's pageCalculator and
// its solve-for-y-given-Q solver so both use one verified implementation.
EngCalcs.Manning.mtc_iterate = function(p) {
	'use strict';
	var g = EngCalcs.G, c = 1.0, alpha_blodgett = 0.319, alpha_bathurst = 1.0,
		max_err = 0.00001, ft_per_m = EngCalcs.FT_PER_M;
	var i = 0;
	var d50_in = p.d50_in, n_in = p.n_in;
	if (d50_in === 0) { d50_in = 0.1 * p.y; }
	// Seed only. n_strickler is RECOMPUTED inside the loop from the current d50, alongside
	// n_blodgett, n_bathurst and n_pi -- see the note there.
	var n_strickler = Math.pow(d50_in, 1 / 6) / 21.1;
	if (n_in === 0) { n_in = n_strickler; }
	// WHICH LOOP IS RUNNING IS A PROPERTY OF THE RADIOS, and is decided ONCE, here -- never
	// inferred inside the loop by letting a `switch`'s default branch clear `iterate_p`. Doing
	// that couples the two iterations and fails silently in both directions:
	//
	//   * `v` is computed near the TOP of a pass from the PREVIOUS pass's n, and n is updated near
	//     the BOTTOM. So a loop cut to one pass reports v, Q and Froude from the n the user typed
	//     while displaying the new n. (Not the shear stress: tau = R S is geometry and slope
	//     alone.) On the main form the next recalculation heals it; in solveForY it does NOT,
	//     because that calls this once per trial depth and gets no second pass.
	//   * The safety factor must scale a CALCULATED rock size only. There is nothing to scale when
	//     the user names the rock, and inflating a typed d50 corrupts the P&I range check.
	//
	// So: iterate while EITHER unknown is still moving, and stop only when BOTH have settled.
	// dev/calc-spike/mtc-harness.js asserts this.
	var n_iterating = (p.n_radio === 'bb' || p.n_radio === 'strickler' || p.n_radio === 'pi');
	var d50_iterating = (p.d50_radio === 'isbash' || p.d50_radio === 'maynord' || p.d50_radio === 'searcy');
	var iterate_p = true;
	var n_prev, n_settled, d50_settled;
	var a, pw, rh, t, da, da_over_d50, v, q, froude, tau,
		n_blodgett, n_bathurst, n_pi, rh_ft, d50_ft, blodgett_v_bathurst,
		d50_mra, d50_searcy, c_isbash, d50_bottom, d50_z1, d50_z2, d50_calc, v_bend;
	while (iterate_p === true && i < 100) {
		i++;
		a = p.y * (p.b + (+p.z1 + +p.z2) * p.y / 2);
		pw = p.b + p.y * (Math.sqrt(1 + Math.pow(p.z1, 2)) + Math.sqrt(1 + Math.pow(p.z2, 2)));
		rh = a / pw;
		t = p.b + p.y * (+p.z1 + +p.z2);
		da = a / t;
		da_over_d50 = da / d50_in;
		v = c / n_in * Math.pow(rh, 2 / 3) * Math.pow(p.s0, 0.5);
		q = v * a;
		froude = v * Math.sqrt(t / (g * a * Math.cos(Math.atan(p.s0))));
		tau = rh * p.s0;
		// RECOMPUTED EVERY PASS, from the CURRENT d50, exactly like its three siblings below.
		// Hoisting it out of the loop freezes the roughness the rock size converges against, so
		// the loop stops coupling and the converged answer depends on the starting guess (the
		// same channel settling on 0.542 in from a typed 4 in but 0.298 in from 24 in).
		// dev/calc-spike/mtc-harness.js asserts start-independence. Harmless where nothing moves:
		// with no rock radio d50 is constant, so this is the same value every pass.
		n_strickler = Math.pow(d50_in, 1 / 6) / 21.1;
		n_blodgett = alpha_blodgett * Math.pow(da, 1 / 6) / (2.25 + 5.23 * Math.log10(da / d50_in));
		n_bathurst = EngCalcs.Manning.bathurst_n(alpha_bathurst, g, t, da, d50_in, froude);
		rh_ft = rh * ft_per_m;
		d50_ft = d50_in * ft_per_m;
		n_pi = 0.0926 * Math.pow(rh_ft, 1 / 6) / (1.46 + 2.23 * Math.log10(rh_ft / d50_ft));
		blodgett_v_bathurst = (da_over_d50 < 0.3) ? '----' : (da_over_d50 < 1.5) ? 'Bathurst' : (da_over_d50 <= 185) ? 'Blodgett' : '++++';
		n_prev = n_in;
		switch (p.n_radio) {
			case 'bb':
				switch (blodgett_v_bathurst) {
					case 'Blodgett':
						n_in = n_blodgett;
						break;
					case 'Bathurst':
						n_in = n_bathurst;
						break;
					default:
						n_in = n_strickler;
				}
				break;
			case 'strickler':
				n_in = n_strickler;
				break;
			case 'pi':
				n_in = n_pi;
				break;
			default:
				// No roughness radio: n stays exactly as the user typed it.
				break;
		}
		c_isbash = (p.beta <= 30) ? 1.2 : 0.86;
		d50_bottom = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, 1000, p.s0, c_isbash, p.sgrock);
		d50_z1 = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, p.z1, p.s0, c_isbash, p.sgrock);
		d50_z2 = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, p.z2, p.s0, c_isbash, p.sgrock);
		// MAYNORD, RUFF & ABT (1989), per Witheridge, "Background to Rock Sizing Equations"
		// (Catchments & Creeks), Eq 14/17:
		//
		//     d50 = 0.031 sf (Ss-1)^-1.25 V^2.5 / y^0.25      [d50 m, V m/s, y m]
		//
		// TWO SILENT TRAPS, both of which have been walked into here before:
		//   * THE EXPONENT ON (Ss-1) IS 1.25, not 0.25. At the default sg = 2.65 a lost digit
		//     oversizes the rock 1.65x -- conservative, so nothing looks wrong -- while
		//     under-responding to sgrock, which is a user-editable input.
		//   * THE BEND FACTOR ADJUSTS THE VELOCITY, NOT d50. A bend raises V, and d50 goes as
		//     V^2.5. Dividing d50 by the factor instead multiplies the answer by 0.67 where it
		//     should be ~2 -- about 4x IN THE UNSAFE DIRECTION, the smallest rock exactly where a
		//     bend demands the most. Cross-check against the Isbash column, which handles a bend
		//     through K (1.2 -> 0.86) and correctly GROWS; a direction disagreement is the tell.
		//
		// 4/3, not Maynord's 1.5: Maynord's 1.5 is for NATURAL channels, and this calculator is
		// mostly used on artificial ones. 4/3 is California Division of Highways (1970), cited in
		// the same reference (Eq 18) -- and cited on the label too, since the column carries
		// Maynord's name and this factor is not his.
		//
		// sf lives OUTSIDE this expression, as the page's own d50_safety input applied to
		// d50_calc below, which is the same thing in a different place.
		v_bend = (p.beta <= 30) ? v : v * 4 / 3;
		d50_mra = 0.031 * Math.pow(v_bend, 2.5) / (Math.pow(p.sgrock - 1, 1.25) * Math.pow(p.y, 0.25));
		// SEARCY (1967), Eq 6 of the same reference: 0.022 V^2, and the reference states it in SI.
		// LEFT AS IT IS ON PURPOSE. A code review argued this was a US-customary constant applied
		// to an SI velocity, because 0.022 is also exactly the Isbash form at K = 0.86 in ft units
		// -- but that is a coincidence, not a derivation, and read as SI it sits sensibly BELOW
		// Maynord and both Isbash values rather than landing precisely on one of them. Resolves
		// the open question at dev/ai-report.md:125. Do not "fix" this without Searcy 1967 itself.
		d50_searcy = 0.022 * Math.pow(v, 2);
		switch (p.d50_radio) {
			case 'isbash':
				d50_calc = Math.max(d50_bottom, d50_z1, d50_z2);
				break;
			case 'maynord':
				d50_calc = d50_mra;
				break;
			case 'searcy':
				d50_calc = d50_searcy;
				break;
			default:
				// No rock radio: the rock is the one the user named, and the safety factor has
				// nothing to scale. d50 does not move, so this half is settled by definition.
				d50_calc = d50_in;
				break;
		}
		if (d50_iterating === true) {
			d50_settled = (Math.abs(p.d50_safety * d50_calc / d50_in - 1) <= max_err);
			d50_in = (d50_in + 5 * p.d50_safety * d50_calc) / 6;
		} else {
			d50_settled = true;
		}
		// n is SETTLED, not merely updated. That distinction is the whole fix: `v` in this pass
		// was computed from n_prev, so it is only a valid answer once n_prev and n_in agree.
		// Iterating to that point is what makes the reported v, q, froude and tau consistent with
		// the n in the roughness box -- no separate final pass needed, and none wanted, because a
		// final pass would also recompute n_strickler and change answers this fix is not about.
		n_settled = (n_iterating !== true) || (Math.abs(n_in / n_prev - 1) <= max_err);
		iterate_p = !(n_settled && d50_settled);
	}
	return {
		a: a, pw: pw, rh: rh, t: t, v: v, q: q, froude: froude, tau: tau,
		n_strickler: n_strickler, n_blodgett: n_blodgett, n_bathurst: n_bathurst, n_pi: n_pi,
		blodgett_v_bathurst: blodgett_v_bathurst,
		d50_bottom: d50_bottom, d50_z1: d50_z1, d50_z2: d50_z2, d50_mra: d50_mra, d50_searcy: d50_searcy,
		n_in: n_in, d50_in: d50_in,
		converged: i < 100, iterations: i
	};
};

EngCalcs.Sketch = {};

EngCalcs.Sketch.construct = function(obj) {
	this.maxHeight = obj.maxHeight;
	this.maxWidth = obj.maxWidth;
	this.strokeColor = obj.strokeColor;
	this.strokeWidth = obj.strokeWidth;
	this.figureTop = obj.figureTop;
	this.figureLeft = obj.figureLeft;
	this.figureHeight = obj.figureHeight;
	this.figureWidth = obj.figureWidth;
	this.xScale = (this.maxWidth-this.strokeWidth) / this.figureWidth;
	this.yScale = -1 * (this.maxHeight-this.strokeWidth) / this.figureHeight;
};

// Convert point from right-handed figure coordinate system
// to left-handed sketch coordinate system
EngCalcs.Sketch.convertPoint = function(objFigurePoint) {
	var objPoint = {};
	objPoint.x = this.strokeWidth/2 + (objFigurePoint.x - this.figureLeft) * this.xScale;
	objPoint.y = this.strokeWidth/2 + (objFigurePoint.y - this.figureTop) * this.yScale;
	return objPoint;
};

EngCalcs.Sketch.getLineHtml = function(arrPoints) {
	return '<line '
	+ 'x1="' + this.convertPoint(arrPoints[0]).x.toString()
	+ '" y1="'  + this.convertPoint(arrPoints[0]).y.toString()
	+ '" x2="'  + this.convertPoint(arrPoints[1]).x.toString()
	+ '" y2="'  + this.convertPoint(arrPoints[1]).y.toString()
	+ '" style="stroke:' + this.strokeColor
	+ ';stroke-width:' + this.strokeWidth + '" />';
};

EngCalcs.Sketch.getMiddleTextHtml = function(obj) {
	return '<text '
	+ 'x="' + this.convertPoint(obj.point).x.toString()
	+ '" y="'  + this.convertPoint(obj.point).y.toString()
	+ '" transform="rotate(' + obj.rotation.toString()
	+ ' ' + this.convertPoint(obj.point).x.toString()
	+ ',' + (this.convertPoint(obj.point).y-obj.height/2).toString() + ')"'
	+ '" style="font-size: ' + obj.height + 'px;"'
	+ ' fill="green" text-anchor = "middle"'
	+ '>' + obj.text + '</text>';
};

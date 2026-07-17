// Manning.lib.js
// Loaded by Manning calculators.

// Master namespace object if not already exists.
EngCalcs.Manning = EngCalcs.Manning || {};

EngCalcs.Manning.c = 1.0;
EngCalcs.Manning.g = 9.806;
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
	var g = 9.806, c = 1.0, alpha_blodgett = 0.319, alpha_bathurst = 1.0,
		max_err = 0.00001, ft_per_m = 3.28084;
	var i = 0;
	var d50_in = p.d50_in, n_in = p.n_in;
	if (d50_in === 0) { d50_in = 0.1 * p.y; }
	var n_strickler = Math.pow(d50_in, 1 / 6) / 21.1;
	if (n_in === 0) { n_in = n_strickler; }
	var iterate_p = true;
	var a, pw, rh, t, da, da_over_d50, v, q, froude, tau,
		n_blodgett, n_bathurst, n_pi, rh_ft, d50_ft, blodgett_v_bathurst,
		d50_mra, d50_searcy, c_isbash, d50_bottom, d50_z1, d50_z2, d50_calc;
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
		n_blodgett = alpha_blodgett * Math.pow(da, 1 / 6) / (2.25 + 5.23 * Math.log10(da / d50_in));
		n_bathurst = EngCalcs.Manning.bathurst_n(alpha_bathurst, g, t, da, d50_in, froude);
		rh_ft = rh * ft_per_m;
		d50_ft = d50_in * ft_per_m;
		n_pi = 0.0926 * Math.pow(rh_ft, 1 / 6) / (1.46 + 2.23 * Math.log10(rh_ft / d50_ft));
		blodgett_v_bathurst = (da_over_d50 < 0.3) ? '----' : (da_over_d50 < 1.5) ? 'Bathurst' : (da_over_d50 <= 185) ? 'Blodgett' : '++++';
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
				iterate_p = false;
		}
		c_isbash = (p.beta <= 30) ? 1.2 : 0.86;
		d50_bottom = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, 1000, p.s0, c_isbash, p.sgrock);
		d50_z1 = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, p.z1, p.s0, c_isbash, p.sgrock);
		d50_z2 = EngCalcs.Manning.mc_riprap_size(p.y, a, v, g, p.z2, p.s0, c_isbash, p.sgrock);
		d50_mra = 0.031 * Math.pow(v, 2.5) / (Math.pow(p.sgrock - 1, 0.25) * Math.pow(p.y, 0.25) * ((p.beta <= 30) ? 1 : 1.5));
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
				d50_calc = d50_in;
				iterate_p = false;
		}
		if (iterate_p === true) {
			iterate_p = (Math.abs(p.d50_safety * d50_calc / d50_in - 1) > max_err);
			d50_in = (d50_in + 5 * p.d50_safety * d50_calc) / 6;
		} else {
			d50_in = p.d50_safety * d50_calc;
		}
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

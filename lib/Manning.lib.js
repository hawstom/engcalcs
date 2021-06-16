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
	if (s0 < 0.02) {
		// Isbash
		d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
	} else if (s0 < 0.1) {
		// Robinson unit q = v * y corrected 2015-10-17
		d50 = 1.413 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.794);
	} else if (s0 < 0.4) {
		// Robinson
		d50 = 0.4623 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.307);
	} else {
		d50 = '++++';
	}
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

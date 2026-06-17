EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806; // m/s²
	this.var.isRect = (document.getElementById('shape_rect') && document.getElementById('shape_rect').checked) ? 1 : 0;
	document.getElementById('w_row').style.display = this.var.isRect ? '' : 'none';

	this.readFormInput(objForm, 'h1_elev',   hasUnits = true);
	this.readFormInput(objForm, 'a1',        hasUnits = true);
	this.readFormInput(objForm, 'h2_elev',   hasUnits = true);
	this.readFormInput(objForm, 'h_orifice', hasUnits = true);
	this.readFormInput(objForm, 'a0',        hasUnits = true);
	this.readFormInput(objForm, 'd',         hasUnits = true);
	this.readFormInput(objForm, 'w',         hasUnits = true);
	this.readFormInput(objForm, 'cd',        hasUnits = false);

	var H1  = this.var.h1_elev - this.var.h_orifice; // initial head above orifice (m)
	var H2  = this.var.h2_elev - this.var.h_orifice; // ending head above orifice (m)
	var Aor = this.var.isRect
		? (this.var.d * this.var.w)
		: (Math.PI * this.var.d * this.var.d / 4);
	var A1  = this.var.a1; // pond area at H1
	var A0  = this.var.a0; // pond area at H=0 (orifice elevation)
	// A2 interpolated from conic model: l(H) = √A0 + (√A1−√A0)·H/H1
	var A2  = H1 > 0 ? Math.pow(Math.sqrt(A0) + (Math.sqrt(A1) - Math.sqrt(A0)) * H2/H1, 2) : A0;

	if (H1 > H2 && H2 >= 0 && Aor > 0 && A1 > 0 && A2 >= 0 && A0 >= 0 && this.var.cd > 0) {
		// t = t(H1,A1,A0) - t(H2,A2,A0)
		// where t(H,Ax,A0) = √H/(Cd·Aor·√(2g)) · (2Ax/5 + 8√(Ax·A0)/15 + 16A0/15)
		var coeff    = 1 / (this.var.cd * Aor * Math.sqrt(2 * this.var.g));
		var t_full   = coeff * Math.sqrt(H1) * ((2/5) * A1 + (8/15) * Math.sqrt(A1 * A0) + (16/15) * A0);
		var t_ending = coeff * Math.sqrt(H2) * ((2/5) * A2 + (8/15) * Math.sqrt(A2 * A0) + (16/15) * A0);
		var t = t_full - t_ending;
		this.var.a_ending = A2;
		this.var.t_sec = t;
		this.var.t_min = t / 60;
		this.var.t_hr  = t / 3600;
		this.var.t_day = t / 86400;
	} else {
		this.var.t_sec = 0;
		this.var.t_min = 0;
		this.var.t_hr  = 0;
		this.var.t_day = 0;
	}

	this.writeFormResult(objForm, 'a_ending', precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 't_sec', precision = 0, hasUnits = false);
	this.writeFormResult(objForm, 't_min', precision = 1, hasUnits = false);
	this.writeFormResult(objForm, 't_hr',  precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 't_day', precision = 3, hasUnits = false);
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

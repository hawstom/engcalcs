EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = EngCalcs.G;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'c', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.readFormInput(objForm, 'z_up', hasUnits = true);
	this.readFormInput(objForm, 'p_up', hasUnits = true);
	this.readFormInput(objForm, 'z_down', hasUnits = true);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	// Sf on EPANET's constants -- see js/PipeHydraulics.lib.js for the derivation.
	this.var.sf = EngCalcs.hwSlope(this.var.q, this.var.d, this.var.c);
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g);
	this.var.hf = this.var.sf * this.var.l;
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
	// Solve DOWNSTREAM from the known upstream end (Task 167). Velocity head is the
	// same at both ends (one diameter, one flow), so it cancels out of p_down -- it is
	// still carried explicitly so the EGL/HGL rows stay honest about the energy line.
	this.var.hgl_up   = +this.var.z_up + +this.var.p_up;
	this.var.egl_up   = +this.var.hgl_up + +this.var.hv;
	this.var.egl_down = +this.var.egl_up - +this.var.hl;
	this.var.hgl_down = +this.var.egl_down - +this.var.hv;
	this.var.p_down   = +this.var.hgl_down - +this.var.z_down;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeVelocityCheck('vel_check', (this.var.v >= EngCalcs.VELOCITY_OK.min && this.var.v <= EngCalcs.VELOCITY_OK.max) ? 'ok' : (this.var.v > EngCalcs.VELOCITY_OK.max ? 'high' : 'low'), {
		ok: EngCalcs.pageConfig.mhp_vel_ok_short,
		high: EngCalcs.pageConfig.mhp_vel_high_short,
		low: EngCalcs.pageConfig.mhp_vel_low_short,
		highTip: EngCalcs.pageConfig.mhp_vel_high,
		lowTip: EngCalcs.pageConfig.mhp_vel_low
	});
	this.writeFormResult(objForm, 'sf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hf', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hm', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hl', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'p_down', precision = 4, hasUnits = true);
	// A negative downstream pressure means the hydraulic grade line has fallen below
	// the pipe: it would not flow full and the result is not valid. Separating
	// elevation from pressure is what makes this checkable at all -- the old
	// single-EGL form could only warn about it in prose (see mphl_note_1).
	this.writeVelocityCheck('p_check', (this.var.p_down >= 0) ? 'ok' : 'low', {
		ok:     EngCalcs.pageConfig.hw_pressure_ok_short,
		low:    EngCalcs.pageConfig.hw_pressure_neg_short,
		lowTip: EngCalcs.pageConfig.hw_pressure_neg
	});
	this.writeFormResult(objForm, 'hgl_up', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'egl_up', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'egl_down', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl_down', precision = 4, hasUnits = true);
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
};

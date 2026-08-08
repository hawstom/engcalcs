EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'n', hasUnits = false);
	this.readFormInput(objForm, 'k', hasUnits = false);
	this.readFormInput(objForm, 'egl1', hasUnits = true);
	this.var.c = 1.0;
	this.var.g = EngCalcs.G;
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g);
	this.var.hm = this.var.k * this.var.hv;
	this.var.sf = Math.pow(this.var.v,2) * Math.pow(this.var.n,2) * 6.3496 / (Math.pow(this.var.c,2) * Math.pow(this.var.d,4/3));
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hf = this.var.l * this.var.sf;
	this.var.hgl1 = +this.var.egl1 - +this.var.hv;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.egl2 = +this.var.egl1 + +this.var.hl;
	this.var.hgl2 = +this.var.egl2 - +this.var.hv;
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
	this.writeFormResult(objForm, 'egl1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'egl2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl2', precision = 4, hasUnits = true);
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
};

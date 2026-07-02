EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.khw = 0.849,
	this.var.g = 9.806;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'c', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.readFormInput(objForm, 'egl1', hasUnits = true);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.v = this.var.q / this.var.a;
	// From 7.8828/d^4.8704 * (Q/(k*C))^1.852 at Wikipedia Hazen-Williams article.
	this.var.sf = 7.8828 / Math.pow(this.var.d, 4.8704) * Math.pow(this.var.q / (this.var.khw * this.var.c), 1.852);
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hv = Math.pow(this.var.v,2) / (2 * this.var.g);
	this.var.hgl1 = +this.var.egl1 - +this.var.hv;
	this.var.hf = this.var.sf * this.var.l;
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.egl2 = +this.var.egl1 + +this.var.hl;
	this.var.hgl2 = +this.var.egl2 - +this.var.hv;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeVelocityCheck('vel_check', (this.var.v >= 1.0 && this.var.v <= 3.0) ? 'ok' : (this.var.v > 3.0 ? 'high' : 'low'), {
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
	this.writeFormResult(objForm, 'hgl1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'egl2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hgl2', precision = 4, hasUnits = true);
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
};

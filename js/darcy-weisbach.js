EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'q', hasUnits = true);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.readFormInput(objForm, 'l', hasUnits = true);
	this.readFormInput(objForm, 'e', hasUnits = true);
	this.readFormInput(objForm, 'v', hasUnits = false);
	this.readFormInput(objForm, 'km', hasUnits = false);
	this.readFormInput(objForm, 'egl1', hasUnits = true);
	this.var.a = (Math.PI * Math.pow(this.var.d, 2) / 4);
	this.var.pw = Math.PI * this.var.d;
	this.var.rh = this.var.d / 4;
	this.var.u = this.var.q / this.var.a;
	this.var.re = this.var.u * this.var.d / this.var.v;
	if (this.var.re === 0) {
		this.var.regime = 0;
		this.var.regime_label = EngCalcs.pageConfig.regime_laminar;
		this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy%E2%80%93Weisbach_equation#Laminar_regime">Hagen-Pouseuille</a>';
		this.var.f = 0;
	} else if (this.var.re < 2000) {
		this.var.regime = 0;
		this.var.regime_label = EngCalcs.pageConfig.regime_laminar;
		this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy%E2%80%93Weisbach_equation#Laminar_regime">Hagen-Pouseuille</a>';
		this.var.f = 64 / this.var.re;
	} else if (this.var.re < 4000) {
		this.var.regime = 1;
		this.var.regime_label = EngCalcs.pageConfig.regime_transitional;
		this.var.f_method = 'Moody Dunlop EPANET';
		this.var.r = this.var.re/2000;
		this.var.y2 = this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9);
		this.var.y3 = -0.86859 * Math.log(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(4000,0.9));
		this.var.fa = Math.pow(this.var.y3,-2);
		this.var.fb =  this.var.fa * (2 - 0.00514215 / (this.var.y2 * this.var.y3));
		this.var.x1 =  7 * this.var.fa - this.var.fb;
		this.var.x2 =  0.128 - 17 * this.var.fa + 2.5 * this.var.fb;
		this.var.x3 =  -0.128 + 13 * this.var.fa - 2 * this.var.fb;
		this.var.x4 =  this.var.r * (0.032 - 3 * this.var.fa + 0.5 * this.var.fb);
		this.var.f =  this.var.x1 + this.var.r * (this.var.x2 + this.var.r * (this.var.x3 + this.var.x4));
	} else {
		this.var.regime = 2;
		this.var.regime_label = EngCalcs.pageConfig.regime_turbulent;
		this.var.f_method = '<a href="https://en.wikipedia.org/wiki/Darcy_friction_factor_formulae#Swamee%E2%80%93Jain_equation">Swamee Jain</a>';
		this.var.f = 0.25 / Math.pow(Math.log10(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9)), 2);
	}
	this.var.sf = this.var.f * Math.pow(this.var.u, 2) / (2 * this.var.d * this.var.g);
	this.var.tau = this.var.rh * this.var.sf;
	this.var.hv = Math.pow(this.var.u,2) / (2 * this.var.g);
	this.var.hgl1 = +this.var.egl1 - +this.var.hv;
	this.var.hf = this.var.sf * this.var.l;
	this.var.hm = this.var.hv * this.var.km;
	this.var.hl = +this.var.hf + +this.var.hm;
	this.var.egl2 = +this.var.egl1 + +this.var.hl;
	this.var.hgl2 = +this.var.egl2 - +this.var.hv;
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'u', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeVelocityCheck('vel_check', (this.var.u >= 1.0 && this.var.u <= 3.0) ? 'ok' : (this.var.u > 3.0 ? 'high' : 'low'), {
		ok: EngCalcs.pageConfig.mhp_vel_ok_short,
		high: EngCalcs.pageConfig.mhp_vel_high_short,
		low: EngCalcs.pageConfig.mhp_vel_low_short,
		highTip: EngCalcs.pageConfig.mhp_vel_high,
		lowTip: EngCalcs.pageConfig.mhp_vel_low
	});
	this.writeFormResult(objForm, 're', precision = 0, hasUnits = false);
	document.getElementById('regime_label').innerHTML = this.var['regime_label'];
	document.getElementById('f_method').innerHTML = this.var['f_method'];
	this.writeFormResult(objForm, 'f', precision = 4, hasUnits = false);
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

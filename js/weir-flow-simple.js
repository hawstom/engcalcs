// Cw is unit-system-specific (US customary ~3.0, SI ~1.84).
// All inputs are left unconverted; the external reference link covers Cw selection.
EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.readFormInput(objForm, 'l', hasUnits = false);
	this.readFormInput(objForm, 'h', hasUnits = false);
	this.readFormInput(objForm, 'cw', hasUnits = false);
	this.var.q = this.var.cw * this.var.l * Math.pow(this.var.h, 1.5);
	this.writeFormResult(objForm, 'q', precision = 2, hasUnits = false);
};

EngCalcs.pageCalculatorInitialize = function () {
};

EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};

	this.readFormInput(objForm, 'cs_Q_in',  hasUnits = true);
	this.readFormInput(objForm, 'cs_Q_out', hasUnits = true);

	var Q_in  = this.var.cs_Q_in;   // m³/s SI
	var Q_out = this.var.cs_Q_out;  // m³/s SI

	this.var.cs_Q_loss   = Q_in - Q_out;
	this.var.cs_pct_loss = (Q_in > 0) ? (Q_in - Q_out) / Q_in : 0;
	this.var.cs_Ec       = (Q_in > 0) ? Q_out / Q_in : 0;
	this.var.cs_Vol_day  = this.var.cs_Q_loss * 86400;
	this.var.cs_Vol_year = this.var.cs_Q_loss * 86400 * 365.25;

	var cfg = EngCalcs.pageConfig;

	var lossEl = document.getElementById('cs_loss_check');
	if (lossEl) {
		if (this.var.cs_Q_loss > 0) {
			lossEl.innerHTML  = cfg.loss_positive;
			lossEl.style.color = 'steelblue';
		} else if (this.var.cs_Q_loss === 0) {
			lossEl.innerHTML  = cfg.loss_zero;
			lossEl.style.color = 'gray';
		} else {
			lossEl.innerHTML  = cfg.loss_negative;
			lossEl.style.color = 'red';
		}
	}

	var ecEl = document.getElementById('cs_Ec_check');
	if (ecEl) {
		if (this.var.cs_Ec >= 0.80) {
			ecEl.innerHTML  = cfg.Ec_good;
			ecEl.style.color = 'green';
		} else if (this.var.cs_Ec >= 0.60) {
			ecEl.innerHTML  = cfg.Ec_fair;
			ecEl.style.color = 'darkorange';
		} else {
			ecEl.innerHTML  = cfg.Ec_poor;
			ecEl.style.color = 'red';
		}
	}

	this.writeFormResult(objForm, 'cs_Q_loss',   precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'cs_pct_loss',  precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Ec',        precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Vol_day',   precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Vol_year',  precision = 0, hasUnits = true);
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

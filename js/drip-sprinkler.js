EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};

	this.readFormInput(objForm, 'q_avg', hasUnits = true);
	this.readFormInput(objForm, 'q_min', hasUnits = true);
	this.readFormInput(objForm, 'se',    hasUnits = true);
	this.readFormInput(objForm, 'sl',    hasUnits = true);
	this.readFormInput(objForm, 'n_e',   hasUnits = false);
	this.readFormInput(objForm, 'n_l',   hasUnits = false);
	this.readFormInput(objForm, 'd',     hasUnits = true);

	var q   = this.var.q_avg;
	var se  = this.var.se;
	var sl  = this.var.sl;
	var n_e = this.var.n_e;
	var n_l = this.var.n_l;

	this.var.a_e   = (se > 0 && sl > 0) ? se * sl : 0;
	this.var.pr    = (this.var.a_e > 0 && q > 0) ? q / this.var.a_e : 0;
	this.var.du    = (q > 0) ? Math.min(1, Math.max(0, this.var.q_min / q)) : 0;
	this.var.q_lat = n_e * q;
	this.var.q_sys = n_l * this.var.q_lat;
	// t_run: depth (m) / rate (m/s) = seconds → convert to hours
	this.var.t_run = (this.var.pr > 0 && this.var.d > 0) ? this.var.d / this.var.pr / 3600 : 0;

	var duEl = document.getElementById('du_check');
	if (duEl) {
		var du = this.var.du;
		var cfg = EngCalcs.pageConfig;
		duEl.className = '';
		if (du >= 0.90) {
			duEl.innerHTML = cfg.du_excellent;
			duEl.classList.add('ec-status-ok');
		} else if (du >= 0.80) {
			duEl.innerHTML = cfg.du_good;
			duEl.classList.add('ec-status-info');
		} else if (du >= 0.70) {
			duEl.innerHTML = cfg.du_acceptable;
			duEl.classList.add('ec-status-warn');
		} else {
			duEl.innerHTML = cfg.du_poor;
			duEl.classList.add('ec-status-bad');
		}
	}

	this.writeFormResult(objForm, 'a_e',   precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'pr',    precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'du',    precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 'q_lat', precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 'q_sys', precision = 1, hasUnits = true);

	var tEl = document.getElementById('t_run');
	if (tEl) { tEl.innerHTML = isFinite(this.var.t_run) && this.var.t_run > 0 ? this.var.t_run.toFixed(2) : ''; }
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

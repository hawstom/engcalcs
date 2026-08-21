EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};

	this.readFormInput(objForm, 'cs_Q_in',        hasUnits = true);
	this.readFormInput(objForm, 'cs_Q_out',        hasUnits = true);
	this.readFormInput(objForm, 'cs_L',            hasUnits = true);
	this.readFormInput(objForm, 'cs_wp',           hasUnits = true);
	// Prices PER a unit, so they convert by the RECIPROCAL of the unit factor -- a cubic metre
	// of water costs 35.3147 times what a cubic foot costs. readFormInput() divides, which is
	// right for a quantity and wrong by the factor SQUARED for a rate (Task 473).
	this.readFormInputPerUnit(objForm, 'cs_water_value');
	this.readFormInputPerUnit(objForm, 'cs_lining_cost');
	this.readFormInput(objForm, 'cs_Ec_target',    hasUnits = false);

	var Q_in      = this.var.cs_Q_in;      // m³/s SI
	var Q_out     = this.var.cs_Q_out;     // m³/s SI
	var L         = this.var.cs_L;         // m SI
	var wp        = this.var.cs_wp;        // m SI
	var wv        = this.var.cs_water_value;  // currency per m³ SI
	var lc        = this.var.cs_lining_cost;  // currency per m² SI
	var Ec_target = this.var.cs_Ec_target; // fraction 0–1

	// --- Basic seepage ---
	var Q_loss = Q_in - Q_out;
	this.var.cs_Q_loss   = Q_loss;
	this.var.cs_pct_loss = (Q_in > 0) ? Q_loss / Q_in : 0;
	this.var.cs_Ec       = (Q_in > 0) ? Q_out / Q_in  : 0;
	this.var.cs_Vol_day  = Q_loss * 86400;
	this.var.cs_Vol_year = Q_loss * 86400 * 365.25;

	// --- Per-unit-length ---
	this.var.cs_Q_loss_per_L = (L > 0) ? Q_loss / L : 0;  // m²/s SI

	// --- Lining payback ---
	var lining_area = L * wp;  // m²
	this.var.cs_lining_area = lining_area;

	// Annual volume lost in m³; wv is currency/m³ SI
	var annual_vol_lost = this.var.cs_Vol_year;  // m³
	var annual_value_lost = annual_vol_lost * wv;
	this.var.cs_annual_value_lost = annual_value_lost;

	// Lining reduces seepage: lined canal achieves Ec_target instead of cs_Ec.
	// Recovery = fraction of inflow recovered = Ec_target - cs_Ec (clamped ≥ 0).
	var Ec_now = this.var.cs_Ec;
	var Ec_gain = (Ec_target > Ec_now) ? (Ec_target - Ec_now) : 0;
	var Q_recovered = Q_in * Ec_gain;  // m³/s recovered
	var annual_vol_recovered = Q_recovered * 86400 * 365.25;
	var annual_value_recovered = annual_vol_recovered * wv;
	this.var.cs_annual_value_recovered = annual_value_recovered;

	var total_lining_cost = lining_area * lc;
	this.var.cs_lining_total_cost = total_lining_cost;

	this.var.cs_payback_years = (annual_value_recovered > 0) ? total_lining_cost / annual_value_recovered : Infinity;

	// --- Status messages ---
	var cfg = EngCalcs.pageConfig;

	var lossEl = document.getElementById('cs_loss_check');
	if (lossEl) {
		lossEl.className = '';
		if (Q_loss > 0) {
			lossEl.innerHTML = cfg.loss_positive;
			lossEl.classList.add('ec-status-info');
		} else if (Q_loss === 0) {
			lossEl.innerHTML = cfg.loss_zero;
			lossEl.classList.add('ec-status-neutral');
		} else {
			lossEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.loss_negative);
			lossEl.classList.add('ec-status-bad');
		}
	}

	var ecEl = document.getElementById('cs_Ec_check');
	if (ecEl) {
		ecEl.className = '';
		if (this.var.cs_Ec >= 0.80) {
			ecEl.innerHTML = EngCalcs.writeCheckHTML(true, cfg.Ec_good);
			ecEl.classList.add('ec-status-ok');
		} else if (this.var.cs_Ec >= 0.60) {
			ecEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.Ec_fair);
			ecEl.classList.add('ec-status-warn');
		} else {
			ecEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.Ec_poor);
			ecEl.classList.add('ec-status-bad');
		}
	}

	// --- Write results ---
	this.writeFormResult(objForm, 'cs_Q_loss',               precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'cs_pct_loss',             precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Ec',                   precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Vol_day',              precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Vol_year',             precision = 0, hasUnits = true);
	this.writeFormResult(objForm, 'cs_Q_loss_per_L',         precision = 6, hasUnits = true);
	this.writeFormResult(objForm, 'cs_lining_area',          precision = 0, hasUnits = true);
	this.writeFormResult(objForm, 'cs_annual_value_lost',    precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'cs_annual_value_recovered',precision= 2, hasUnits = false);
	this.writeFormResult(objForm, 'cs_lining_total_cost',    precision = 2, hasUnits = false);

	// Payback: show "—" if infinite (no recovery), otherwise years
	var paybackEl = document.getElementById('cs_payback_years');
	if (paybackEl) {
		if (!isFinite(this.var.cs_payback_years)) {
			paybackEl.innerHTML = '—';
		} else {
			paybackEl.innerHTML = this.var.cs_payback_years.toFixed(1);
		}
	}
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

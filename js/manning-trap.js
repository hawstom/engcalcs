EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = EngCalcs.G;
	this.var.ft_per_m = EngCalcs.FT_PER_M;
	// Read and convert form inputs to this.var.___ as SI units
	this.readFormInput(objForm, 'b', hasUnits = true);
	this.readFormInput(objForm, 'y', hasUnits = true);
	this.readFormInput(objForm, 'z1', hasUnits = false);
	this.readFormInput(objForm, 'z2', hasUnits = false);
	this.readFormInput(objForm, 's0', hasUnits = true);
	this.var.n_radio = objForm.n_radio.value;
	this.readFormInput(objForm, 'n_in', hasUnits = false);
	this.readFormInput(objForm, 'beta', hasUnits = false);
	this.readFormInput(objForm, 'sgrock', hasUnits = false);
	this.readFormInput(objForm, 'd50_in', hasUnits = true);
	this.var.d50_radio = objForm.d50_radio.value;
	this.readFormInput(objForm, 'd50_safety', hasUnits = false);
	var result = this.Manning.mtc_iterate({
		b: this.var.b, y: this.var.y, z1: this.var.z1, z2: this.var.z2, s0: this.var.s0,
		n_radio: this.var.n_radio, n_in: this.var.n_in,
		d50_radio: this.var.d50_radio, d50_in: this.var.d50_in, d50_safety: this.var.d50_safety,
		beta: this.var.beta, sgrock: this.var.sgrock
	});
	this.var.a = result.a;
	this.var.pw = result.pw;
	this.var.rh = result.rh;
	this.var.t = result.t;
	this.var.v = result.v;
	this.var.hv = Math.pow(this.var.v, 2) / (2 * this.var.g);
	this.var.q = result.q;
	this.var.froude = result.froude;
	this.var.tau = result.tau;
	this.var.n_strickler = result.n_strickler;
	this.var.n_blodgett = result.n_blodgett;
	this.var.n_bathurst = result.n_bathurst;
	this.var.n_pi = result.n_pi;
	this.var.blodgett_v_bathurst = result.blodgett_v_bathurst;
	this.var.d50_bottom = result.d50_bottom;
	this.var.d50_z1 = result.d50_z1;
	this.var.d50_z2 = result.d50_z2;
	this.var.d50_mra = result.d50_mra;
	this.var.d50_searcy = result.d50_searcy;
	this.var.d50_ft = result.d50_in * this.var.ft_per_m;
	this.var.n_in = result.n_in;
	this.var.d50_in = result.d50_in;
	if (this.var.n_radio !== '') {
		objForm.n_in.value = this.var.n_in.toFixed(4);
	}
	if (this.var.d50_radio !== '') {
		objForm.d50_in.value = (this.var.d50_in * objForm.d50_inu.value).toFixed(4);
	}
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'froude', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'n_strickler', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'n_blodgett', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'n_bathurst', precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'n_pi', precision = 4, hasUnits = false);
	document.getElementById('blodgett_v_bathurst').innerHTML = (this.var.blodgett_v_bathurst);
	var piEl = document.getElementById('pi_range_check');
	if (piEl) {
		piEl.className = '';
		if (this.var.d50_ft < 0.28 || this.var.d50_ft > 0.36) {
			piEl.innerHTML = EngCalcs.writeCheckHTML(false, EngCalcs.pageConfig.mtc_pi_out_of_range, EngCalcs.pageConfig.mtc_pi_tip);
			piEl.classList.add('ec-status-warn');
		} else {
			piEl.innerHTML = EngCalcs.writeCheckHTML(true, EngCalcs.pageConfig.mtc_pi_ok, EngCalcs.pageConfig.mtc_pi_ok_tip);
			piEl.classList.add('ec-status-ok');
		}
	}
	this.writeVelocityCheck('v_check', this.var.v > EngCalcs.VELOCITY_OK.max ? 'high' : (this.var.v < EngCalcs.VELOCITY_OK.min ? 'low' : 'ok'), {
		ok: EngCalcs.pageConfig.mhp_vel_ok_short,
		high: EngCalcs.pageConfig.mhp_vel_high_short,
		low: EngCalcs.pageConfig.mhp_vel_low_short,
		highTip: EngCalcs.pageConfig.mtc_vel_high,
		lowTip: EngCalcs.pageConfig.mtc_vel_low
	});
	this.writeFormResult(objForm, 'd50_bottom', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_z1', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_z2', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_mra', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'd50_searcy', precision = 4, hasUnits = true);
	// Sketch
	this.var.gymax = 100; // Max graphic flow depth
	this.var.garmax = 6; // Max graphic aspect ratio
	this.var.gar = this.var.t / this.var.y; // Flow aspect ratio
	this.var.gt = Math.min(this.var.garmax, this.var.gar) * this.var.gymax; // Graphic flow width
	this.var.gs = this.var.gt/ this.var.t; // Graphic scale
	this.var.gy = this.var.gs * this.var.y;
	this.var.gh = this.var.gy + this.var.gymax/2; // SVG height
	this.var.gyb = this.var.gy + this.var.gymax/4; // Bottom of flow
	this.var.gyt = this.var.gymax/4; // Top of flow
	this.var.gw = this.var.gt; // SVG width
	this.var.gxb1 = this.var.z1 * this.var.y * this.var.gs;
	this.var.gxb2 = this.var.gxb1 + this.var.b * this.var.gs;
	this.var.gxm = this.var.gw/2;
	this.var.gtx1 = this.var.gxm - this.var.gymax/16;
	this.var.gtx2 = this.var.gxm + this.var.gymax/16;
	this.var.gty = this.var.gyt - this.var.gymax/8;
	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.var.gh + '" width="' + this.var.gw + '" style="font-family:sans-serif;font-size:11px;">' +
			'<polyline points="' +
			'0,' + this.var.gyt  + ' ' +
			this.var.gxb1 + ',' + this.var.gyb + ' ' +
			this.var.gxb2 + ',' + this.var.gyb + ' ' +
			this.var.gt + ',' + this.var.gyt + '" ' +
			'fill="none" stroke="black" stroke-width="' + this.var.gymax/25 + '"/>' +
			'<line x1="0" y1="' + this.var.gyt  + '" x2="' + this.var.gt + '" y2="' + this.var.gyt  + '" stroke="blue" stroke-width="' + this.var.gymax/25 + '"/>' +
			'<polygon points="' +
			this.var.gxm + ',' + this.var.gyt + ' ' +
			this.var.gtx1 + ',' + this.var.gty + ' ' +
			this.var.gtx2 + ',' + this.var.gty + '" ' +
			'fill="white" stroke="black" stroke-width="' + this.var.gymax/50 + '"/>' +
			'Sorry, your browser does not support inline SVG.' +
		'</svg>';
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
};

// v2 (2026-07-27): the solver moved out of a standalone banner above the form and into the
// depth field's own label (ROADMAP Task 143), so its Q input and units select are now form
// elements holding two positional cookie slots, immediately ahead of y -- solver_q is the
// 11th INPUT in the form (the three n_radio buttons count too). Insert those two slots at
// their page defaults so a v1 cookie's saved inputs still land in the right fields.
EngCalcs.cookieFormatVersion = 2;
EngCalcs.migrateCookie = function (cookieVars, fromVersion) {
	'use strict';
	if (fromVersion >= 2) { return cookieVars; }
	return this.insertSolverCookieSlots(cookieVars, 11);
};

// Solves for depth y given a target Q, using b, z1, z2, s0, and the current
// roughness/rock-size radio state from the main form. Depth and Q increase together
// for this trapezoidal-channel geometry (no local peak, unlike a circular pipe), so a
// plain bisection on y is valid even while n and d50 are re-iterated at every trial
// depth via the same EngCalcs.Manning.mtc_iterate the main calculator uses.
EngCalcs.solveForY = function() {
	'use strict';
	var objForm = document.forms['formInput'];
	var b   = parseFloat(objForm['b'].value) / parseFloat(objForm['bu'].value);
	var z1  = parseFloat(objForm['z1'].value);
	var z2  = parseFloat(objForm['z2'].value);
	var s0  = parseFloat(objForm['s0'].value) / parseFloat(objForm['s0u'].value);
	var n_radio = objForm.n_radio.value;
	var n_in = parseFloat(objForm['n_in'].value);
	var beta = parseFloat(objForm['beta'].value);
	var sgrock = parseFloat(objForm['sgrock'].value);
	var d50_radio = objForm.d50_radio.value;
	var d50_in = parseFloat(objForm['d50_in'].value) / parseFloat(objForm['d50_inu'].value);
	var d50_safety = parseFloat(objForm['d50_safety'].value);
	var qu = parseFloat(document.getElementById('solver_qu').value);
	var q_target = parseFloat(document.getElementById('solver_q').value) / qu;
	var msgEl = document.getElementById('solver_msg');

	function computeQ(y) {
		return EngCalcs.Manning.mtc_iterate({
			b: b, y: y, z1: z1, z2: z2, s0: s0,
			n_radio: n_radio, n_in: n_in,
			d50_radio: d50_radio, d50_in: d50_in, d50_safety: d50_safety,
			beta: beta, sgrock: sgrock
		});
	}

	if (isNaN(q_target) || q_target <= 0) {
		msgEl.textContent = EngCalcs.pageConfig.mpf_solver_enter_positive_q;
		return;
	}

	var lo = 1e-6, hi = 1, i = 0, result;
	result = computeQ(hi);
	while (result.q < q_target && i < 60) { hi *= 2; result = computeQ(hi); i++; }
	if (result.q < q_target || !result.converged) {
		msgEl.textContent = EngCalcs.pageConfig.mtc_solver_no_solution;
		return;
	}

	var mid = hi;
	for (i = 0; i < 60; i++) {
		mid = (lo + hi) / 2;
		result = computeQ(mid);
		if (result.q < q_target) { lo = mid; } else { hi = mid; }
		if (hi - lo < 1e-10) { break; }
	}
	if (!result.converged) {
		msgEl.textContent = EngCalcs.pageConfig.mtc_solver_no_solution;
		return;
	}

	var yu = parseFloat(objForm['yu'].value);
	objForm['y'].value = parseFloat((mid * yu).toPrecision(6));
	if (n_radio !== '') {
		objForm['n_in'].value = result.n_in.toFixed(4);
	}
	if (d50_radio !== '') {
		objForm['d50_in'].value = (result.d50_in * parseFloat(objForm['d50_inu'].value)).toFixed(4);
	}
	msgEl.textContent = '';
	EngCalcs.submitForm();
};

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('n_in').addEventListener('input', function() {
		document.querySelectorAll('[id^="n_radio_"]').forEach(function(el) { el.checked = false; });
	});
	document.getElementById('d50_in').addEventListener('input', function() {
		document.querySelectorAll('[id^="d50_radio_"]').forEach(function(el) { el.checked = false; });
	});
});

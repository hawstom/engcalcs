EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.c = 1.0;
	this.var.g = 9.806;
	// Read and convert form inputs to "this.var.___" as SI units
	this.readFormInput(objForm, 'd0', hasUnits = true);
	this.readFormInput(objForm, 'sf', hasUnits = true);
	this.readFormInput(objForm, 'n', hasUnits = false);
	this.readFormInput(objForm, 'dd0', hasUnits = true);
	// Theta here is half the included angle of the wetted perimeter.
	this.var.y = this.var.dd0 * this.var.d0;
	this.var.theta = Math.acos(1 - 2 * this.var.dd0);
	this.var.a = (this.var.theta - Math.sin(2 * this.var.theta) / 2) * Math.pow(this.var.d0, 2) / 4;
	this.var.a0 = Math.PI * Math.pow(this.var.d0, 2) / 4;
	this.var.aa0 = this.var.a / this.var.a0;
	this.var.pw = this.var.theta * this.var.d0;
	this.var.rh = this.var.d0 / (4 * this.var.theta) * (this.var.theta - Math.sin(this.var.theta) * Math.cos(this.var.theta));
	this.var.t = this.var.d0 * Math.sin(this.var.theta);
	this.var.v = this.var.c / this.var.n*Math.pow(this.var.rh,2/3)*Math.pow(this.var.sf,0.5);
	this.var.hv = this.var.v * this.var.v / (2 * this.var.g);
	this.var.q = this.var.v * this.var.a;
	this.var.f = this.var.v * Math.sqrt(this.var.t/(this.var.g * this.var.a * Math.cos(Math.atan(this.var.sf))));
	this.var.tau = this.var.rh * this.var.sf;
	this.var.q0 = this.var.c / this.var.n * Math.PI * Math.pow(this.var.d0, 8/3) / Math.pow(4, 5/3) * Math.pow(this.var.sf, 0.5);
	this.var.qq0 = this.var.q / this.var.q0;

	this.writeFormResult(objForm, 'y', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'a', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'a0', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'aa0', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'pw', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rh', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 't', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'v', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'hv', precision = 4, hasUnits = true);
	this.writeVelocityCheck('vel_check', (this.var.v >= 1.0 && this.var.v <= 3.0) ? 'ok' : (this.var.v > 3.0 ? 'high' : 'low'), {
		ok: EngCalcs.pageConfig.mhp_vel_ok_short,
		high: EngCalcs.pageConfig.mhp_vel_high_short,
		low: EngCalcs.pageConfig.mhp_vel_low_short,
		highTip: EngCalcs.pageConfig.mhp_vel_high,
		lowTip: EngCalcs.pageConfig.mhp_vel_low
	});
	this.writeFormResult(objForm, 'f', precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 'tau', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q0', precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'qq0', precision = 4, hasUnits = true);

	// Sketch
	this.var.gcr = 50; // Graphic pipe circle radius
	this.var.gh = 3 * this.var.gcr; // SVG height
	this.var.gw = 3 * this.var.gcr; // SVG width
	this.var.gcx = 1.5 * this.var.gcr; // Pipe center x
	this.var.gcy = 1.5 * this.var.gcr; // Pipe center y
	this.var.gcb = this.var.gcy + this.var.gcr; // Pipe bottom
	this.var.glx1 = this.var.gcx - this.var.t/this.var.d0 * this.var.gcr;
	this.var.glx2 = this.var.gcx + this.var.t/this.var.d0 * this.var.gcr;
	this.var.gly = this.var.gcy + (1/2 - this.var.dd0) * 2 * this.var.gcr;
	this.var.gty = this.var.gly - this.var.gcr/4;
	this.var.gtx1 = this.var.gcx - this.var.gcr/8;
	this.var.gtx2 = this.var.gcx + this.var.gcr/8;

	document.getElementById('sketch').innerHTML =
		'<svg height="' + this.var.gh + '" width="' + this.var.gw + '" style="font-family:sans-serif;font-size:11px;">' +
			'<circle cx="' + this.var.gcx + '" cy="' + this.var.gcy + '" r="' + this.var.gcr + '" stroke="black" stroke-width="' + this.var.gcr/25 + '" fill="white"/>' +
			'<line x1="' + this.var.glx1 + '" y1="' + this.var.gly + '" x2="' + this.var.glx2 + '" y2="' + this.var.gly + '" stroke="blue" stroke-width="' + this.var.gcr/25 + '"/>' +
			'<line x1="' + this.var.gcx + '" y1="' + this.var.gcb + '" x2="' + this.var.gcx + '" y2="' + this.var.gly + '" stroke="blue" stroke-width="' + this.var.gcr/3 + '"/>' +
			'<polygon points="' +
			this.var.gcx + ',' + this.var.gly + ' ' +
			this.var.gtx1 + ',' + this.var.gty + ' ' +
			this.var.gtx2 + ',' + this.var.gty + '" ' +
			'fill="white" stroke="black" stroke-width="' + this.var.gcr/50 + '"/>' +
			'Sorry, your browser does not support inline SVG.' +
		'</svg>';
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
};

// Solves for y/d0 given a target Q, using d0, n, sf from the main form.
// Q for a circular Manning pipe peaks at y/d0 ≈ 0.9376; no solution above that.
EngCalcs.solveForDd0 = function() {
	'use strict';
	var objForm = document.forms['formInput'];
	var d0 = parseFloat(objForm['d0'].value) / parseFloat(objForm['d0u'].value);
	var n  = parseFloat(objForm['n'].value);
	var sf = parseFloat(objForm['sf'].value) / parseFloat(objForm['sfu'].value);
	var qu = parseFloat(document.getElementById('solver_qu').value);
	var q_target = parseFloat(document.getElementById('solver_q').value) / qu;
	var msgEl = document.getElementById('solver_msg');

	function computeQ(dd0) {
		var theta = Math.acos(1 - 2 * dd0);
		var a  = (theta - Math.sin(2 * theta) / 2) * d0 * d0 / 4;
		var rh = d0 / (4 * theta) * (theta - Math.sin(theta) * Math.cos(theta));
		return a * Math.pow(rh, 2/3) * Math.pow(sf, 0.5) / n;
	}

	if (isNaN(q_target) || q_target <= 0) {
		msgEl.textContent = 'Enter a positive target Q.';
		return;
	}

	var DD0_PEAK = 0.9376;
	var q_max = computeQ(DD0_PEAK);
	if (q_target > q_max) {
		msgEl.textContent = 'No solution: Q exceeds pipe capacity at y/d0 = 93.8% '
			+ '(Qmax = ' + (q_max * qu).toFixed(4) + ' in selected units).';
		return;
	}

	var lo = 1e-4, hi = DD0_PEAK, mid = 0.5;
	for (var i = 0; i < 60; i++) {
		mid = (lo + hi) / 2;
		if (computeQ(mid) < q_target) { lo = mid; } else { hi = mid; }
		if (hi - lo < 1e-10) { break; }
	}

	var dd0u = parseFloat(objForm['dd0u'].value);
	objForm['dd0'].value = parseFloat((mid * dd0u).toPrecision(6));
	msgEl.textContent = '';
	EngCalcs.submitForm();
};

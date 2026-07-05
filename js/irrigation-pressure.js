// Irrigation Pressure Calculator (prefix ip_).
// Marches the Energy Grade Line backward from a guessed critical-emitter
// pressure to the supply, reach by reach, then bisects the guess against
// the known supply pressure. Same bisection shape as
// EngCalcs.solveForDd0 in manning-pipe-flow.js, but the forward function
// here is a full row-by-row march instead of one closed-form formula.

EngCalcs.g = 9.806;
EngCalcs.christiansenM = 1.852; // fixed loss exponent used by Christiansen's F(n), not user-facing.

// Darcy-Weisbach friction factor for one reach, same 3-regime approach as darcy-weisbach.js.
EngCalcs.ipFriction = function (q, d, e, visc) {
	'use strict';
	var a = Math.PI * d * d / 4,
		v = q / a,
		re = Math.abs(v) * d / visc,
		f;
	if (re === 0) {
		f = 0;
	} else if (re < 2000) {
		f = 64 / re;
	} else if (re < 4000) {
		var r = re / 2000,
			y2 = e / (3.7 * d) + 5.74 / Math.pow(re, 0.9),
			y3 = -0.86859 * Math.log10(e / (3.7 * d) + 5.74 / Math.pow(4000, 0.9)),
			fa = Math.pow(y3, -2),
			fb = fa * (2 - 0.00514215 / (y2 * y3)),
			x1 = 7 * fa - fb,
			x2 = 0.128 - 17 * fa + 2.5 * fb,
			x3 = -0.128 + 13 * fa - 2 * fb,
			x4 = r * (0.032 * fa + 0.5 * fb);
		f = x1 + r * (x2 + r * (x3 + x4));
	} else {
		f = 0.25 / Math.pow(Math.log10(e / (3.7 * d) + 5.74 / Math.pow(re, 0.9)), 2);
	}
	return { a: a, v: v, f: f };
};

// Christiansen's multi-outlet reduction factor for n equally-spaced, equal-discharge outlets.
EngCalcs.christiansenF = function (n) {
	'use strict';
	if (n <= 1) { return 1; }
	var m = EngCalcs.christiansenM;
	return 1 / (m + 1) + 1 / (2 * n) + Math.sqrt(m - 1) / (6 * n * n);
};

// Reads the reach table rows (raw values in each column's currently selected display units,
// converted to SI) into this.rows. Also flags (but does not silently fix) a blank elev_ds
// on the last row, since that value anchors the whole result.
EngCalcs.ipReadRows = function (objForm) {
	'use strict';
	var lengthu = objForm['lengthu'].value,
		diameteru = objForm['diameteru'].value,
		roughnessu = objForm['roughnessu'].value,
		elevu = objForm['elevu'].value,
		rows = [],
		i,
		row,
		cells,
		elevDsRaw;
	this.lastRowElevMissing = false;
	for (i = 0; i < this.numCalcRows; i += 1) {
		row = document.getElementById('CalcsBody').getElementsByTagName('tr')[i];
		cells = row.getElementsByTagName('input');
		elevDsRaw = cells[6].value;
		if (elevDsRaw === '' && i === this.numCalcRows - 1) { this.lastRowElevMissing = true; }
		rows.push({
			isLateral: cells[0].checked,
			count: +cells[1].value,
			length: +cells[2].value / lengthu,
			diameter: +cells[3].value / diameteru,
			roughness: +cells[4].value / roughnessu,
			kMinor: +cells[5].value,
			// Blank elev_ds defaults to "flat" (filled in once the node-above elevation is known, in the march).
			elevDs: (elevDsRaw === '') ? null : (+elevDsRaw / elevu)
		});
	}
	return rows;
};

// Marches the EGL backward from hFar (guessed critical-emitter pressure) to the supply.
// Returns the computed required supply pressure and, if fillOutputs is true, also writes
// per-row results into this.rowResults for display.
EngCalcs.ipMarch = function (hFar, fillOutputs) {
	'use strict';
	var rows = this.rows,
		g = this.g,
		i,
		row,
		qDs = 0,
		elevDsNode = null,
		hDs = hFar,
		eglDs,
		draw,
		qEmitter,
		qUs,
		fr,
		fN,
		hf,
		hm,
		headloss,
		eglUs,
		elevUsNode,
		vDs,
		hUs,
		results = [],
		lateralQs = [],
		lateralHds = [];

	for (i = rows.length - 1; i >= 0; i -= 1) {
		row = rows[i];
		if (elevDsNode === null) {
			// Last (most remote) row: its own downstream node is the critical emitter.
			elevDsNode = (row.elevDs === null) ? 0 : row.elevDs;
		}
		eglDs = hDs + elevDsNode; // v = 0 beyond the last row (no pipe past the critical emitter).

		if (row.isLateral) {
			qEmitter = this.var.k * Math.pow(Math.max(hDs, 0), this.var.x);
			draw = qEmitter * row.count;
			lateralQs.push(qEmitter);
			lateralHds.push(hDs);
		} else {
			// Main row: count is already the total emitter count on every lateral in this reach.
			draw = this.var.q_design * row.count;
		}
		qUs = qDs + draw;

		fr = this.ipFriction(qUs, row.diameter, row.roughness, this.var.visc);
		fN = row.isLateral ? this.christiansenF(row.count) : 1;
		hf = fN * fr.f * (row.length / row.diameter) * fr.v * fr.v / (2 * g);
		hm = row.kMinor * fr.v * fr.v / (2 * g);
		headloss = hf + hm;
		eglUs = eglDs + headloss;

		elevUsNode = (i === 0) ? this.var.elev_supply : (rows[i - 1].elevDs === null ? elevDsNode : rows[i - 1].elevDs);
		vDs = qDs / fr.a;
		hUs = eglUs - elevUsNode - fr.v * fr.v / (2 * g);

		results[i] = {
			qUs: qUs, qDs: qDs,
			hUs: hUs, hDs: eglDs - elevDsNode - vDs * vDs / (2 * g),
			v: fr.v, hv: fr.v * fr.v / (2 * g), hf: hf, hm: hm
		};

		qDs = qUs;
		elevDsNode = elevUsNode;
		hDs = hUs;
	}

	if (fillOutputs) {
		this.rowResults = results;
		this.lateralQs = lateralQs;
		this.lateralHds = lateralHds;
	}
	return hDs; // Hus of row 0 == the computed required supply pressure.
};

EngCalcs.pageCalculator = function (objForm) {
	'use strict';
	var hasUnits, precision, msgEl = document.getElementById('ip_msg');
	this.var = {};
	this.readFormInput(objForm, 'h_supply', hasUnits = true);
	this.readFormInput(objForm, 'elev_supply', hasUnits = true);
	this.readFormInput(objForm, 'q_design', hasUnits = true);
	this.readFormInput(objForm, 'h_design', hasUnits = true);
	this.readFormInput(objForm, 'x', hasUnits = false);
	this.readFormInput(objForm, 'dp_avg', hasUnits = true);
	this.readFormInput(objForm, 'visc', hasUnits = false);
	this.readFormInput(objForm, 'se', hasUnits = true);
	this.readFormInput(objForm, 'sl', hasUnits = true);
	this.readFormInput(objForm, 'n_e', hasUnits = false);
	this.readFormInput(objForm, 'n_l', hasUnits = false);
	this.readFormInput(objForm, 'd', hasUnits = true);
	this.var.k = this.var.q_design / Math.pow(this.var.h_design, this.var.x);

	this.rows = this.ipReadRows(objForm);
	if (this.rows.length === 0) { return; }

	var hSupplyTarget = this.var.h_supply,
		elevSupply = this.var.elev_supply,
		maxElevDrop = Math.max(0, elevSupply - Math.min.apply(null, this.rows.map(function (r) { return (r.elevDs === null) ? elevSupply : r.elevDs; }).concat(elevSupply))),
		lo = 0,
		hi = hSupplyTarget + maxElevDrop + 1,
		mid = hi / 2,
		i;

	if (this.ipMarch(lo, false) > hSupplyTarget || this.ipMarch(hi, false) < hSupplyTarget) {
		msgEl.textContent = EngCalcs.pageConfig.ip_no_solution;
		['h_far', 'q_supply', 'q_critical', 'q_avg_lateral', 'q_avg_field', 'du_estimate', 'q_ratio', 'a_e', 'pr', 'q_lat', 'q_sys', 't_run'].forEach(function (name) {
			document.getElementById(name).innerHTML = '&mdash;';
		});
		document.getElementById('ip_elev_warn').innerHTML = '';
		document.getElementById('ip_worst_case_warn').innerHTML = '';
	} else {
		msgEl.textContent = '';
		for (i = 0; i < 60; i += 1) {
			mid = (lo + hi) / 2;
			if (this.ipMarch(mid, false) < hSupplyTarget) { lo = mid; } else { hi = mid; }
			if (hi - lo < 1e-9) { break; }
		}
		this.ipMarch(mid, true);
		this.var.h_far = mid;
		this.var.q_supply = this.rowResults[0].qUs;
		this.var.q_critical = this.var.k * Math.pow(Math.max(this.var.h_far, 0), this.var.x);
		this.var.q_avg_lateral = this.lateralQs.length
			? this.lateralQs.reduce(function (a, b) { return a + b; }, 0) / this.lateralQs.length
			: 0;
		// The test lateral is deliberately the presumed worst case, so its raw average is a
		// biased-low stand-in for a field average. q_avg_field re-evaluates each lateral row's
		// own emitter curve at (its computed pressure + the entered dp_avg estimate), correcting
		// for that bias -- feeds both the uniformity check below and Application Design.
		var dpAvg = this.var.dp_avg, k = this.var.k, x = this.var.x;
		this.var.q_avg_field = this.lateralHds.length
			? this.lateralHds.reduce(function (sum, h) { return sum + k * Math.pow(Math.max(h + dpAvg, 0), x); }, 0) / this.lateralHds.length
			: 0;
		// Uniformity check, shaped like textbook low-quarter DU (low-group avg / population mean)
		// but sampled only from the test lateral's modeled rows -- can legitimately be >= 1 (see
		// ip_notes_3_def). Kept separate from q_ratio, a different, non-uniformity design-point check.
		this.var.du_estimate = this.var.q_avg_field ? this.var.q_critical / this.var.q_avg_field : NaN;
		this.var.q_ratio = this.var.q_design ? this.var.q_critical / this.var.q_design : NaN;

		// Application design (ported from js/drip-sprinkler.js), fed by the corrected q_avg_field
		// instead of a manually-entered rate.
		this.var.a_e = (this.var.se > 0 && this.var.sl > 0) ? this.var.se * this.var.sl : 0;
		this.var.pr = (this.var.a_e > 0 && this.var.q_avg_field > 0) ? this.var.q_avg_field / this.var.a_e : 0;
		this.var.q_lat = this.var.n_e * this.var.q_avg_field;
		this.var.q_sys = this.var.n_l * this.var.q_lat;
		this.var.t_run = (this.var.pr > 0 && this.var.d > 0) ? this.var.d / this.var.pr / 3600 : 0;

		this.writeFormResult(objForm, 'h_far', precision = 4, hasUnits = true);
		this.writeFormResult(objForm, 'q_supply', precision = 4, hasUnits = true);
		this.writeFormResult(objForm, 'q_critical', precision = 4, hasUnits = true);
		this.writeFormResult(objForm, 'q_avg_lateral', precision = 4, hasUnits = true);
		this.writeFormResult(objForm, 'q_avg_field', precision = 4, hasUnits = true);
		document.getElementById('du_estimate').innerHTML = isNaN(this.var.du_estimate) ? '&mdash;' : this.var.du_estimate.toFixed(3);
		document.getElementById('q_ratio').innerHTML = isNaN(this.var.q_ratio) ? '&mdash;' : this.var.q_ratio.toFixed(3);
		this.writeFormResult(objForm, 'a_e', precision = 3, hasUnits = true);
		this.writeFormResult(objForm, 'pr', precision = 2, hasUnits = true);
		this.writeFormResult(objForm, 'q_lat', precision = 1, hasUnits = true);
		this.writeFormResult(objForm, 'q_sys', precision = 1, hasUnits = true);
		document.getElementById('t_run').innerHTML = (isFinite(this.var.t_run) && this.var.t_run > 0) ? this.var.t_run.toFixed(2) : '';

		this.ipWriteRows(objForm);

		document.getElementById('ip_worst_case_warn').innerHTML =
			(this.var.h_far >= this.var.h_supply) ? EngCalcs.pageConfig.ip_worst_case_warn : '';
	}

	var warnEl = document.getElementById('ip_elev_warn');
	warnEl.innerHTML = this.lastRowElevMissing ? EngCalcs.pageConfig.ip_elev_ds_missing_warn : '';
};

EngCalcs.ipPressureWarnHtml = function (h) {
	'use strict';
	if (h >= 0) { return ''; }
	return ' <span class="ec-tip" title="' + EngCalcs.pageConfig.ip_pressure_warn + '">' + EngCalcs.pageConfig.ip_pressure_warn_short + '</span>';
};

EngCalcs.ipWriteRows = function (objForm) {
	'use strict';
	var q_usu = objForm['q_usu'].value,
		q_dsu = objForm['q_dsu'].value,
		h_usu = objForm['h_usu'].value,
		h_dsu = objForm['h_dsu'].value,
		vu = objForm['vu'].value,
		hvu = objForm['hvu'].value,
		hfu = objForm['hfu'].value,
		hmu = objForm['hmu'].value,
		hlu = objForm['hlu'].value,
		i,
		r;
	for (i = 0; i < this.rowResults.length; i += 1) {
		r = this.rowResults[i];
		document.getElementsByName('q_us')[i].innerHTML = (r.qUs * q_usu).toFixed(4);
		document.getElementsByName('h_us')[i].innerHTML = (r.hUs * h_usu).toFixed(4) + this.ipPressureWarnHtml(r.hUs);
		document.getElementsByName('q_ds')[i].innerHTML = (r.qDs * q_dsu).toFixed(4);
		document.getElementsByName('h_ds')[i].innerHTML = (r.hDs * h_dsu).toFixed(4) + this.ipPressureWarnHtml(r.hDs);
		document.getElementsByName('v')[i].innerHTML = (r.v * vu).toFixed(4);
		document.getElementsByName('hv')[i].innerHTML = (r.hv * hvu).toFixed(4);
		document.getElementsByName('hf')[i].innerHTML = (r.hf * hfu).toFixed(4);
		document.getElementsByName('hm')[i].innerHTML = (r.hm * hmu).toFixed(4);
		document.getElementsByName('hl')[i].innerHTML = ((r.hf + r.hm) * hlu).toFixed(4);
	}
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
	'use strict';
	// Start from a clean slate: a mismatched/stale cookie (e.g. from a since-changed page
	// layout) may have already appended rows via cookieToForm's backfill before giving up.
	document.getElementById('CalcsBody').innerHTML = '';
	this.numCalcRows = 0;
	this.pageAddCalcRow();
	this.pageAddCalcRow();
	this.pageAddCalcRow();
};

EngCalcs.addIrrigationPressureReach = function (isLateral, count, length, diameter, roughness, kMinor, elevDs) {
	'use strict';
	var arrColumns = [
		{ name: 'is_lateral', value: isLateral, inputType: 'checkbox' },
		{ name: 'count', value: count, inputType: 'number' },
		{ name: 'l', value: length, inputType: 'number' },
		{ name: 'diameter', value: diameter, inputType: 'number' },
		{ name: 'roughness', value: roughness, inputType: 'number' },
		{ name: 'k_minor', value: kMinor, inputType: 'number' },
		{ name: 'elev_ds', value: elevDs, inputType: 'number' },
		{ name: 'q_us', value: null, inputType: null },
		{ name: 'h_us', value: null, inputType: null },
		{ name: 'q_ds', value: null, inputType: null },
		{ name: 'h_ds', value: null, inputType: null },
		{ name: 'v', value: null, inputType: null },
		{ name: 'hv', value: null, inputType: null },
		{ name: 'hf', value: null, inputType: null },
		{ name: 'hm', value: null, inputType: null },
		{ name: 'hl', value: null, inputType: null }
	];
	this.addCalcRow(arrColumns);
};

// Default 3-row example: one main reach feeding the test lateral's takeoff,
// then the test lateral itself split into two segments (same idiom as the
// Manning-Irregular/Weir-Flow-Irregular calculators' sample rows).
EngCalcs.pageAddCalcRow = function () {
	'use strict';
	var isLateral, count, length, diameter, roughness, kMinor, elevDs, prev = this.numCalcRows - 1;
	if (this.numCalcRows === 0) {
		isLateral = false; count = 30; length = 50; diameter = 25; roughness = 0.15; kMinor = 1; elevDs = 0;
	} else if (this.numCalcRows === 1) {
		// A gentle, realistic slope (~0.5%) -- large enough to demonstrate elevation's effect
		// without letting it dominate friction loss the way an exaggerated drop would.
		isLateral = true; count = 5; length = 10; diameter = 12; roughness = 0.0015; kMinor = 1; elevDs = -0.05;
	} else if (this.numCalcRows === 2) {
		isLateral = true; count = 5; length = 10; diameter = 12; roughness = 0.0015; kMinor = 1; elevDs = -0.1;
	} else {
		isLateral = document.getElementsByName('is_lateral')[prev].checked;
		count = +document.getElementsByName('count')[prev].value;
		length = +document.getElementsByName('l')[prev].value;
		diameter = +document.getElementsByName('diameter')[prev].value;
		roughness = +document.getElementsByName('roughness')[prev].value;
		kMinor = +document.getElementsByName('k_minor')[prev].value;
		elevDs = +document.getElementsByName('elev_ds')[prev].value;
	}
	this.addIrrigationPressureReach(isLateral, count, length, diameter, roughness, kMinor, elevDs);
};

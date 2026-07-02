EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806; // m/s²
	this.var.isRect = (document.getElementById('shape_rect') && document.getElementById('shape_rect').checked) ? 1 : 0;
	document.getElementById('w_row').style.display = this.var.isRect ? '' : 'none';

	this.readFormInput(objForm, 'h1_elev',   hasUnits = true);
	this.readFormInput(objForm, 'a1',        hasUnits = true);
	this.readFormInput(objForm, 'h2_elev',   hasUnits = true);
	this.readFormInput(objForm, 'h_orifice', hasUnits = true);
	this.readFormInput(objForm, 'a0',        hasUnits = true);
	this.readFormInput(objForm, 'd',         hasUnits = true);
	this.readFormInput(objForm, 'w',         hasUnits = true);
	this.readFormInput(objForm, 'cd',        hasUnits = false);

	var h1  = this.var.h1_elev - this.var.h_orifice; // initial head above orifice centroid (m)
	var h2  = this.var.h2_elev - this.var.h_orifice; // ending head above orifice centroid (m)
	var Aor = this.var.isRect
		? (this.var.d * this.var.w)
		: (Math.PI * this.var.d * this.var.d / 4);
	var A1  = this.var.a1; // pond area at h1
	var A0  = this.var.a0; // pond area at h=0 (orifice centroid elevation)
	// A2 interpolated from conic model: l(h) = √A0 + (√A1−√A0)·h/h1
	var A2  = h1 > 0 ? Math.pow(Math.sqrt(A0) + (Math.sqrt(A1) - Math.sqrt(A0)) * h2/h1, 2) : A0;

	// Ending elevation must stay above the orifice top (centroid + D/2)
	var h2_min = this.var.d / 2;
	var h2_check_el = document.getElementById('h2_check');

	if (h1 > h2 && h2 >= h2_min && Aor > 0 && A1 > 0 && A2 >= 0 && A0 >= 0 && this.var.cd > 0) {
		// t = t(h1,A1,A0) - t(h2,A2,A0)
		// where t(h,Ax,A0) = √h/(Cd·Aor·√(2g)) · (2Ax/5 + 8√(Ax·A0)/15 + 16A0/15)
		var coeff    = 1 / (this.var.cd * Aor * Math.sqrt(2 * this.var.g));
		var t_start  = coeff * Math.sqrt(h1) * ((2/5) * A1 + (8/15) * Math.sqrt(A1 * A0) + (16/15) * A0);
		var t_ending = coeff * Math.sqrt(h2) * ((2/5) * A2 + (8/15) * Math.sqrt(A2 * A0) + (16/15) * A0);
		var t = t_start - t_ending;

		this.var.h1    = h1;
		this.var.q_max = this.var.cd * Aor * Math.sqrt(2 * this.var.g * h1);

		// Drained volume: integral of A(h)dh from h2 to h1 using antiderivative (α+βh)³/(3β)
		// where α=√A0, β=(√A1−√A0)/h1; flat-pond fallback when √A1≈√A0
		var sqA0 = Math.sqrt(A0), sqA1 = Math.sqrt(A1);
		if (Math.abs(sqA1 - sqA0) < 1e-12) {
			this.var.vol = A0 * (h1 - h2);
		} else {
			var beta = (sqA1 - sqA0) / h1;
			var sqA2 = Math.sqrt(A2);
			this.var.vol = (sqA1 * sqA1 * sqA1 - sqA2 * sqA2 * sqA2) / (3 * beta);
		}

		this.var.a_ending = A2;
		this.var.t_sec = t;
		this.var.t_min = t / 60;
		this.var.t_hr  = t / 3600;
		this.var.t_day = t / 86400;
		if (h2_check_el) {
			h2_check_el.className = 'ec-status-ok';
			h2_check_el.innerHTML = EngCalcs.pageConfig.h2_ok;
		}
	} else {
		this.var.h1    = 0;
		this.var.q_max = 0;
		this.var.vol   = 0;
		this.var.t_sec = 0;
		this.var.t_min = 0;
		this.var.t_hr  = 0;
		this.var.t_day = 0;
		if (h2_check_el) {
			h2_check_el.className = '';
			if (h2 < h2_min) {
				h2_check_el.innerHTML = EngCalcs.pageConfig.h2_warn;
				h2_check_el.classList.add('ec-status-warn');
			} else {
				h2_check_el.innerHTML = '';
			}
		}
	}

	this.writeFormResult(objForm, 'h1',    precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'q_max', precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'a_ending', precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 'vol',   precision = 1, hasUnits = true);
	this.writeFormResult(objForm, 't_sec', precision = 0, hasUnits = false);
	this.writeFormResult(objForm, 't_min', precision = 1, hasUnits = false);
	this.writeFormResult(objForm, 't_hr',  precision = 2, hasUnits = false);
	this.writeFormResult(objForm, 't_day', precision = 3, hasUnits = false);

	this.odtDrawSketch(EngCalcs.pageConfig.sketch_start, EngCalcs.pageConfig.sketch_end);
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

EngCalcs.odtDrawSketch = function(labelStart, labelEnd) {
	var el = document.getElementById('sketch');
	if (!el) { return; }
	var v = this.var;
	var zinv = v.h_orifice - v.d / 2;
	if (!isFinite(v.h1_elev) || !isFinite(v.h2_elev) || !isFinite(v.h_orifice) || !isFinite(v.d) || v.d <= 0 || v.h1_elev <= v.h_orifice) {
		el.innerHTML = '';
		return;
	}

	var svgW = 300, svgH = 180;
	var wallW = 8;
	var wallX = 140;

	var startYFixed = svgH * 0.15;
	var invYFixed = svgH * 0.75;
	var scale = (invYFixed - startYFixed) / (v.h1_elev - zinv);

	function toY(elev) {
		return startYFixed + (v.h1_elev - elev) * scale;
	}

	var startY = toY(v.h1_elev);
	var endY   = toY(v.h2_elev);
	var crownY = toY(v.h_orifice + v.d / 2);
	var invY   = toY(zinv);
	var gndY   = svgH - 10;

	var wallTop = Math.max(2, crownY);

	var s = '<svg width="' + svgW + '" height="' + svgH + '" style="font-family:sans-serif;font-size:11px;">';

	// Upper wall block
	if (wallTop > 2) {
		s += '<rect x="' + wallX + '" y="2" width="' + wallW + '" height="' + (wallTop - 2) + '" fill="black"/>';
	}
	// Lower wall block
	if (invY < gndY) {
		s += '<rect x="' + wallX + '" y="' + invY + '" width="' + wallW + '" height="' + (gndY - invY) + '" fill="black"/>';
	}

	// Starting water surface
	s += '<line x1="0" y1="' + startY + '" x2="' + wallX + '" y2="' + startY + '" stroke="blue" stroke-width="2"/>';
	var startTextY = (startY < 15) ? startY + 13 : startY - 4;
	s += '<text x="4" y="' + startTextY + '" fill="blue">' + labelStart + '</text>';

	// Ending water surface
	s += '<line x1="0" y1="' + endY + '" x2="' + wallX + '" y2="' + endY + '" stroke="blue" stroke-width="2"/>';
	var endTextY = (endY < 15) ? endY + 13 : endY - 4;
	s += '<text x="4" y="' + endTextY + '" fill="blue">' + labelEnd + '</text>';

	s += '</svg>';
	el.innerHTML = s;
};

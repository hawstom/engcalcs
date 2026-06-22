EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g   = 9.806;
	this.var.rho = 1000;

	this.readFormInput(objForm, 'q',      hasUnits = true);
	this.readFormInput(objForm, 'hgross', hasUnits = true);
	this.readFormInput(objForm, 'd',      hasUnits = true);
	this.readFormInput(objForm, 'l',      hasUnits = true);
	this.readFormInput(objForm, 'e',      hasUnits = true);
	this.readFormInput(objForm, 'km',     hasUnits = false);
	this.readFormInput(objForm, 'nu',     hasUnits = false);
	this.readFormInput(objForm, 'eta',    hasUnits = false);

	// Pipe geometry and velocity
	this.var.a   = Math.PI * this.var.d * this.var.d / 4;
	this.var.vel = this.var.q / this.var.a;
	this.var.re  = this.var.vel * this.var.d / this.var.nu;
	this.var.hv  = this.var.vel * this.var.vel / (2 * this.var.g);

	// Friction factor (same as Darcy-Weisbach calculator)
	if (this.var.re < 2000) {
		this.var.f = 64 / this.var.re;
	} else if (this.var.re < 4000) {
		var r  = this.var.re / 2000;
		var y2 = this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9);
		var y3 = -0.86859 * Math.log10(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(4000, 0.9));
		var fa = Math.pow(y3, -2);
		var fb = fa * (2 - 0.00514215 / (y2 * y3));
		this.var.f = (7*fa - fb) + r * ((0.128 - 17*fa + 2.5*fb) + r * ((-0.128 + 13*fa - 2*fb) + r*(0.032*fa + 0.5*fb)));
	} else {
		this.var.f = 0.25 / Math.pow(Math.log10(this.var.e / (3.7 * this.var.d) + 5.74 / Math.pow(this.var.re, 0.9)), 2);
	}

	// Head losses
	this.var.hf  = this.var.f * (this.var.l / this.var.d) * this.var.hv;
	this.var.hm  = this.var.km * this.var.hv;
	this.var.hl  = this.var.hf + this.var.hm;
	this.var.hnet = Math.max(0, this.var.hgross - this.var.hl);

	// Power and annual energy
	this.var.power      = this.var.eta * this.var.rho * this.var.g * this.var.q * this.var.hnet;
	this.var.annual_kwh = this.var.power / 1000 * 8760;

	this.writeFormResult(objForm, 'vel',        precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'f',          precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'hf',         precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'hm',         precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'hl',         precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'hnet',       precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'power',      precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'annual_kwh', precision = 1, hasUnits = true);

	// Velocity check
	var velEl = document.getElementById('vel_check');
	if (velEl) {
		var vms = this.var.vel;
		if (vms >= 1.0 && vms <= 3.0) {
			velEl.innerHTML = EngCalcs.pageConfig.vel_ok;
			velEl.style.color = 'green';
		} else if (vms > 3.0) {
			velEl.innerHTML = EngCalcs.pageConfig.vel_high;
			velEl.style.color = 'darkorange';
		} else {
			velEl.innerHTML = EngCalcs.pageConfig.vel_low;
			velEl.style.color = 'darkorange';
		}
	}

	// Head loss % check
	var hlEl = document.getElementById('hl_check');
	if (hlEl && this.var.hgross > 0) {
		var hlPct = this.var.hl / this.var.hgross * 100;
		if (hlPct <= 10) {
			hlEl.innerHTML = hlPct.toFixed(1) + '% — ' + EngCalcs.pageConfig.hl_ok;
			hlEl.style.color = 'green';
		} else if (hlPct <= 20) {
			hlEl.innerHTML = hlPct.toFixed(1) + '% — ' + EngCalcs.pageConfig.hl_warn;
			hlEl.style.color = 'darkorange';
		} else {
			hlEl.innerHTML = hlPct.toFixed(1) + '% — ' + EngCalcs.pageConfig.hl_bad;
			hlEl.style.color = 'red';
		}
	}

	this.psDrawSketch();
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

EngCalcs.psDrawSketch = function() {
	var el = document.getElementById('sketch');
	if (!el) { return; }
	var v = this.var;
	if (!isFinite(v.hgross) || v.hgross <= 0 || !isFinite(v.hl)) {
		el.innerHTML = '';
		return;
	}

	var W = 320, H = 220;
	var barX = 110, barW = 60;
	var svgTop = 30, svgBot = H - 30;
	var barH = svgBot - svgTop;

	// Clamp h_L fraction for display (cap at 80% so H_net bar is always visible)
	var frac = Math.min(Math.max(v.hl / v.hgross, 0), 0.80);
	var hLpx  = Math.round(frac * barH);
	var hNpx  = barH - hLpx;

	var s = '<svg width="' + W + '" height="' + H + '" style="font-family:sans-serif;font-size:11px;">';

	// h_L portion (top) — color by severity
	var hlFill = (frac <= 0.10) ? '#c8e6c9' : (frac <= 0.20) ? '#ffe082' : '#ffcc80';
	if (hLpx > 0) {
		s += '<rect x="' + barX + '" y="' + svgTop + '" width="' + barW + '" height="' + hLpx + '" fill="' + hlFill + '" stroke="black" stroke-width="1"/>';
	}
	// H_net portion (bottom, blue)
	s += '<rect x="' + barX + '" y="' + (svgTop + hLpx) + '" width="' + barW + '" height="' + hNpx + '" fill="#b3e5fc" stroke="black" stroke-width="1"/>';

	// Labels inside bars
	var midHL  = svgTop + hLpx / 2;
	var midHN  = svgTop + hLpx + hNpx / 2;
	if (hLpx > 16) {
		s += '<text x="' + (barX + barW/2) + '" y="' + (midHL + 4) + '" text-anchor="middle" font-size="11">h<tspan baseline-shift="sub" font-size="9">L</tspan></text>';
	}
	if (hNpx > 16) {
		s += '<text x="' + (barX + barW/2) + '" y="' + (midHN + 4) + '" text-anchor="middle" font-size="11">H<tspan baseline-shift="sub" font-size="9">net</tspan></text>';
	}

	// Left bracket: H_gross
	var bx = barX - 14;
	s += '<line x1="' + bx + '" y1="' + svgTop + '" x2="' + bx + '" y2="' + svgBot + '" stroke="#666" stroke-width="1" stroke-dasharray="4,3"/>';
	s += '<line x1="' + (bx-5) + '" y1="' + svgTop + '" x2="' + (bx+5) + '" y2="' + svgTop + '" stroke="#666" stroke-width="1"/>';
	s += '<line x1="' + (bx-5) + '" y1="' + svgBot + '" x2="' + (bx+5) + '" y2="' + svgBot + '" stroke="#666" stroke-width="1"/>';
	s += '<text x="' + (bx - 7) + '" y="' + (H/2 + 4) + '" text-anchor="end" fill="#444">H<tspan baseline-shift="sub" font-size="9">gross</tspan></text>';

	// Right annotation: h_L percentage
	var rx = barX + barW + 8;
	var hlPct = (v.hl / v.hgross * 100);
	var labelColor = (frac <= 0.10) ? 'green' : (frac <= 0.20) ? 'darkorange' : 'red';
	if (hLpx > 0) {
		s += '<line x1="' + (barX + barW) + '" y1="' + svgTop + '" x2="' + (rx + 5) + '" y2="' + svgTop + '" stroke="#aaa" stroke-width="1" stroke-dasharray="3,2"/>';
		s += '<line x1="' + (barX + barW) + '" y1="' + (svgTop + hLpx) + '" x2="' + (rx + 5) + '" y2="' + (svgTop + hLpx) + '" stroke="#aaa" stroke-width="1" stroke-dasharray="3,2"/>';
		s += '<text x="' + (rx + 7) + '" y="' + (midHL + 4) + '" fill="' + labelColor + '">' + hlPct.toFixed(1) + '%</text>';
	}
	s += '<text x="' + (rx + 7) + '" y="' + (midHN + 4) + '" fill="#0277bd">H<tspan baseline-shift="sub" font-size="9">net</tspan></text>';

	s += '</svg>';
	el.innerHTML = s;
};

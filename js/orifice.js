EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g = 9.806; // m/s²
	this.var.isRect = (document.getElementById('shape_rect') && document.getElementById('shape_rect').checked) ? 1 : 0;
	document.getElementById('w_row').style.display = this.var.isRect ? '' : 'none';

	this.readFormInput(objForm, 'd',    hasUnits = true);
	this.readFormInput(objForm, 'w',    hasUnits = true);
	this.readFormInput(objForm, 'zinv', hasUnits = true);
	this.readFormInput(objForm, 'hwe',  hasUnits = true);
	this.readFormInput(objForm, 'twe',  hasUnits = true);
	this.readFormInput(objForm, 'cd',   hasUnits = false);

	this.var.centroid  = this.var.zinv + this.var.d / 2;
	this.var.crown     = this.var.zinv + this.var.d;
	this.var.submerged = (this.var.twe > this.var.centroid) ? 1 : 0;
	this.var.h         = this.var.submerged
		? Math.max(0, this.var.hwe - this.var.twe)
		: Math.max(0, this.var.hwe - this.var.centroid);
	this.var.area      = this.var.isRect
		? (this.var.d * this.var.w)
		: (Math.PI * this.var.d * this.var.d / 4);
	this.var.q = (this.var.h > 0 && this.var.area > 0)
		? this.var.cd * this.var.area * Math.sqrt(2 * this.var.g * this.var.h)
		: 0;

	var regimeEl = document.getElementById('regime');
	if (regimeEl) {
		regimeEl.className = '';
		var regimeOk = (this.var.hwe >= this.var.crown && this.var.h > 0);
		if (this.var.twe > this.var.hwe) {
			regimeEl.innerHTML = EngCalcs.pageConfig.regime_twe_above_hwe;
			regimeEl.classList.add('ec-status-bad');
		} else if (!regimeOk) {
			regimeEl.innerHTML = EngCalcs.pageConfig.regime_warn;
			regimeEl.classList.add('ec-status-warn');
		} else if (this.var.submerged) {
			regimeEl.innerHTML = EngCalcs.pageConfig.regime_submerged;
			regimeEl.classList.add('ec-status-info');
		} else {
			regimeEl.innerHTML = EngCalcs.pageConfig.regime_valid;
			regimeEl.classList.add('ec-status-ok');
		}
	}

	this.writeFormResult(objForm, 'centroid', precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'h',        precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'area',     precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'q',        precision = 3, hasUnits = true);

	this.orDrawSketch();
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

EngCalcs.orDrawSketch = function() {
	var el = document.getElementById('sketch');
	if (!el) { return; }
	var v = this.var;
	if (!isFinite(v.hwe) || !isFinite(v.zinv) || !isFinite(v.twe) || !isFinite(v.d) || v.d <= 0 || v.hwe <= v.zinv) {
		el.innerHTML = '';
		return;
	}

	var svgW = 300, svgH = 180;
	var wallW = 8;
	var wallX = 140;

	// Fix HWE at 15% from top, invert at 75% from top
	var hweYFixed = svgH * 0.15;
	var invYFixed = svgH * 0.75;
	var scale = (invYFixed - hweYFixed) / (v.hwe - v.zinv);

	function toY(elev) {
		return hweYFixed + (v.hwe - elev) * scale;
	}

	var hweY   = toY(v.hwe);
	var tweY   = toY(v.twe);
	var crownY = toY(v.crown);
	var invY   = toY(v.zinv);
	var gndY   = svgH - 10;
	var sw     = 3; // stroke-width, matches Manning channel style

	// Cap wall top at SVG edge
	var wallTop = Math.max(2, crownY);

	var s = '<svg width="' + svgW + '" height="' + svgH + '" style="font-family:sans-serif;font-size:11px;">';

	// Upper wall block (from SVG top to crown of opening)
	if (wallTop > 2) {
		s += '<rect x="' + wallX + '" y="2" width="' + wallW + '" height="' + (wallTop - 2) + '" fill="black"/>';
	}
	// Lower wall block (from invert to ground line)
	if (invY < gndY) {
		s += '<rect x="' + wallX + '" y="' + invY + '" width="' + wallW + '" height="' + (gndY - invY) + '" fill="black"/>';
	}

	// HWE water surface line (upstream)
	s += '<line x1="0" y1="' + hweY + '" x2="' + wallX + '" y2="' + hweY + '" stroke="blue" stroke-width="2"/>';

	// TWE water surface line (downstream, only when submerged)
	if (v.submerged && tweY < gndY) {
		s += '<line x1="' + (wallX + wallW) + '" y1="' + tweY + '" x2="' + svgW + '" y2="' + tweY + '" stroke="blue" stroke-width="2"/>';
	}

	// HWE label
	var hweTextY = (hweY < 15) ? hweY + 13 : hweY - 4;
	s += '<text x="4" y="' + hweTextY + '" fill="blue">HWE</text>';

	// TWE label (only when submerged)
	if (v.submerged && tweY < gndY) {
		var tweTextY = (tweY < 15) ? tweY + 13 : tweY - 4;
		s += '<text x="' + (wallX + wallW + 4) + '" y="' + tweTextY + '" fill="blue">TWE</text>';
	}

	s += '</svg>';
	el.innerHTML = s;
};

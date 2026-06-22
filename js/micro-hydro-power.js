EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};
	this.var.g   = 9.806;  // m/s²
	this.var.rho = 1000;   // kg/m³ (fresh water)

	this.readFormInput(objForm, 'q',      hasUnits = true);
	this.readFormInput(objForm, 'hgross', hasUnits = true);
	this.readFormInput(objForm, 'hloss',  hasUnits = true);
	this.readFormInput(objForm, 'eta',    hasUnits = false);

	this.var.hnet       = this.var.hgross - this.var.hloss;
	// P = η × ρ × g × Q × H_net  [W]
	this.var.power      = (this.var.hnet > 0)
		? this.var.eta * this.var.rho * this.var.g * this.var.q * this.var.hnet
		: 0;
	// Annual energy at 100% capacity factor [kWh/yr]
	this.var.annual_kwh = this.var.power / 1000 * 8760;

	this.writeFormResult(objForm, 'hnet',       precision = 3, hasUnits = true);
	this.writeFormResult(objForm, 'power',      precision = 2, hasUnits = true);
	this.writeFormResult(objForm, 'annual_kwh', precision = 0, hasUnits = false);

	this.mhpDrawSketch();
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

EngCalcs.mhpDrawSketch = function() {
	var el = document.getElementById('sketch');
	if (!el) { return; }
	var v = this.var;
	if (!isFinite(v.hgross) || v.hgross <= 0 || !isFinite(v.q) || v.q <= 0) {
		el.innerHTML = '';
		return;
	}

	var W = 360, H = 210;
	// Layout constants
	var pondX1 = 10,  pondX2 = 110, headY  = 35;
	var pipeX1 = 110, pipeY1 = 75,  pipeX2 = 270, pipeY2 = 160;
	var houseX1 = 258, houseY1 = 152, houseX2 = 300, houseY2 = 185;
	var tailY   = 178;
	var bracketX = 330;

	var s = '<svg width="' + W + '" height="' + H + '" style="font-family:sans-serif;font-size:11px;">';

	// Headpond bank lines
	s += '<line x1="' + pondX1 + '" y1="' + (headY + 20) + '" x2="' + pondX2 + '" y2="' + (headY + 20) + '" stroke="black" stroke-width="3"/>';
	s += '<line x1="' + pondX2 + '" y1="4" x2="' + pondX2 + '" y2="' + pipeY1 + '" stroke="black" stroke-width="4"/>';

	// Headpond water surface
	s += '<line x1="' + pondX1 + '" y1="' + headY + '" x2="' + pondX2 + '" y2="' + headY + '" stroke="blue" stroke-width="2"/>';
	s += '<text x="' + (pondX1 + 2) + '" y="' + (headY - 4) + '" fill="blue">HWL</text>';

	// Penstock (pipe going down the slope)
	s += '<line x1="' + pipeX1 + '" y1="' + pipeY1 + '" x2="' + pipeX2 + '" y2="' + pipeY2 + '" stroke="black" stroke-width="5"/>';

	// Powerhouse box
	s += '<rect x="' + houseX1 + '" y="' + houseY1 + '" width="' + (houseX2 - houseX1) + '" height="' + (houseY2 - houseY1) + '" fill="none" stroke="black" stroke-width="2"/>';
	s += '<text x="' + (houseX1 + 3) + '" y="' + (houseY1 + 20) + '" fill="black" font-size="10">⚡</text>';

	// Tailrace water surface
	s += '<line x1="' + houseX2 + '" y1="' + tailY + '" x2="' + (W - bracketX + houseX2 + 20) + '" y2="' + tailY + '" stroke="blue" stroke-width="2"/>';
	s += '<text x="' + (houseX2 + 4) + '" y="' + (tailY - 3) + '" fill="blue">TWL</text>';

	// H_gross bracket (dashed vertical line on right)
	s += '<line x1="' + bracketX + '" y1="' + headY + '" x2="' + bracketX + '" y2="' + tailY + '" stroke="#666" stroke-width="1" stroke-dasharray="4,3"/>';
	s += '<line x1="' + (bracketX - 5) + '" y1="' + headY + '" x2="' + (bracketX + 5) + '" y2="' + headY + '" stroke="#666" stroke-width="1"/>';
	s += '<line x1="' + (bracketX - 5) + '" y1="' + tailY + '" x2="' + (bracketX + 5) + '" y2="' + tailY + '" stroke="#666" stroke-width="1"/>';
	var labelY = Math.round((headY + tailY) / 2) + 4;
	s += '<text x="' + (bracketX + 7) + '" y="' + labelY + '" fill="#444">H<tspan baseline-shift="sub" font-size="9">gross</tspan></text>';

	s += '</svg>';
	el.innerHTML = s;
};

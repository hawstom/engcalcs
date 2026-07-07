EngCalcs.pageCalculator = function(objForm) {
	'use strict';
	var hasUnits, precision;
	this.var = {};

	var g = 9.806; // m/s²

	this.readFormInput(objForm, 'rc_S0', hasUnits = true);
	this.readFormInput(objForm, 'rc_qt', hasUnits = true);
	this.readFormInput(objForm, 'rc_np', hasUnits = false);
	this.readFormInput(objForm, 'rc_sg', hasUnits = false);
	this.readFormInput(objForm, 'rc_SD', hasUnits = false);
	this.readFormInput(objForm, 'rc_yn', hasUnits = true);

	var S0 = this.var.rc_S0;
	var qt = this.var.rc_qt;
	var np = this.var.rc_np;
	var sg = this.var.rc_sg;
	var SD = this.var.rc_SD;
	var yn = this.var.rc_yn;
	var cfg = EngCalcs.pageConfig;

	// D50 in mm — Robinson, Rice & Kadavy (1998) Eq. 1 or 2
	var D50_mm = 0;
	if (S0 > 0 && qt > 0) {
		if (S0 < 0.10) {
			D50_mm = Math.pow(qt * Math.pow(S0, 1.50) / 9.76e-7, 1 / 1.89);
		} else {
			D50_mm = Math.pow(qt * Math.pow(S0, 0.58) / 8.07e-6, 1 / 1.89);
		}
	}

	var D50_m = D50_mm / 1000;
	this.var.rc_D50 = D50_m; // SI base (meters) for unit conversion

	// Geometric outputs (all in meters)
	this.var.rc_layer        = 2  * D50_m;
	this.var.rc_crest_radius = 40 * D50_m;
	this.var.rc_crest_length = 40 * D50_m * Math.atan(S0); // arc = R × θ, θ = chute angle
	this.var.rc_apron_length = 15 * D50_m;

	// Manning n (Robinson 1998 Eq. 3, D50 in mm)
	this.var.rc_n_chute = (D50_mm > 0 && S0 > 0) ? 0.0292 * Math.pow(D50_mm * S0, 0.147) : 0;
	var n = this.var.rc_n_chute;

	// Flow through rock mantle (Robinson 1998 Eq. 4–5)
	this.var.rc_Vm = (D50_m > 0 && S0 > 0) ? np * Math.pow(S0 * g * D50_m / 4, 0.5) : 0;
	this.var.rc_qm = this.var.rc_Vm * 2 * D50_m;

	// Surface flow and depth (Robinson 1998 Eq. 6–7)
	this.var.rc_qs = Math.max(0, qt - this.var.rc_qm);
	var qs = this.var.rc_qs;
	this.var.rc_d = (n > 0 && qs > 0 && S0 > 0) ? Math.pow(n * qs / Math.pow(S0, 0.5), 0.6) : 0;

	// Inlet ponding check: weir head Hp for broad-crested weir at qt (Robinson, 1998)
	// If Hp > yn (normal depth in inlet channel), ponding occurs upstream — see rc_Hp hover tip
	var Hp = (qt > 0) ? Math.pow(qt / 1.45, 2/3) : 0;
	this.var.rc_Hp = Hp;

	// Inlet ponding check
	var pondEl = document.getElementById('rc_ponding_check');
	if (pondEl) {
		pondEl.className = '';
		if (yn > 0 && Hp > 0) {
			if (Hp > yn) { pondEl.innerHTML = cfg.rc_pond_ok;   pondEl.classList.add('ec-status-ok');   }
			else          { pondEl.innerHTML = cfg.rc_pond_warn; pondEl.classList.add('ec-status-warn'); }
		} else {
			pondEl.innerHTML = '';
		}
	}

	// Equation / validity status
	var statusEl = document.getElementById('rc_eq_used');
	if (statusEl) {
		statusEl.className = '';
		if (S0 < 0.02) {
			statusEl.innerHTML = cfg.rc_eq_warn_low;
			statusEl.classList.add('ec-status-bad');
		} else if (S0 > 0.40) {
			statusEl.innerHTML = cfg.rc_eq_warn_high;
			statusEl.classList.add('ec-status-bad');
		} else if (S0 < 0.10) {
			statusEl.innerHTML = cfg.rc_eq1;
			statusEl.classList.add('ec-status-ok');
		} else {
			statusEl.innerHTML = cfg.rc_eq2;
			statusEl.classList.add('ec-status-info');
		}
	}

	// Specific gravity validity check
	var sgEl = document.getElementById('rc_sg_check');
	if (sgEl && sg > 0) {
		sgEl.className = '';
		if (sg < 2.54)      { sgEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.rc_sg_low, cfg.rc_sg_low_tip);   sgEl.classList.add('ec-status-bad'); }
		else if (sg > 2.82) { sgEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.rc_sg_high, cfg.rc_sg_high_tip); sgEl.classList.add('ec-status-bad'); }
		else                { sgEl.innerHTML = EngCalcs.writeCheckHTML(true, cfg.rc_sg_ok, cfg.rc_sg_ok_tip);     sgEl.classList.add('ec-status-ok');  }
	}

	// Gradation SD validity check
	var sdEl = document.getElementById('rc_SD_check');
	if (sdEl && SD > 0) {
		sdEl.className = '';
		if (SD < 1.15)      { sdEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.rc_SD_low, cfg.rc_SD_low_tip);   sdEl.classList.add('ec-status-bad'); }
		else if (SD > 1.47) { sdEl.innerHTML = EngCalcs.writeCheckHTML(false, cfg.rc_SD_high, cfg.rc_SD_high_tip); sdEl.classList.add('ec-status-bad'); }
		else                { sdEl.innerHTML = EngCalcs.writeCheckHTML(true, cfg.rc_SD_ok, cfg.rc_SD_ok_tip);     sdEl.classList.add('ec-status-ok');  }
	}

	this.rcDrawSketch();

	this.writeFormResult(objForm, 'rc_D50',          precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_layer',         precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_crest_radius',  precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_crest_length',  precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_apron_length',  precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_n_chute',       precision = 4, hasUnits = false);
	this.writeFormResult(objForm, 'rc_Vm',            precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_qm',            precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_qs',            precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_d',             precision = 4, hasUnits = true);
	this.writeFormResult(objForm, 'rc_Hp',            precision = 3, hasUnits = true);
};

EngCalcs.pageCalculatorInitialize = function(objForm) {};

EngCalcs.rcDrawSketch = function() {
	var el = document.getElementById('rc_sketch');
	if (!el) return;
	var cfg = EngCalcs.pageConfig;
	var v = this.var;
	var D50 = v.rc_D50;
	if (!D50 || D50 <= 0) { el.innerHTML = ''; return; }

	var S0 = v.rc_S0, d = v.rc_d;
	var W = 590, H = 255;

	var thetaVis = 0.384;
	var cosT = Math.cos(thetaVis), sinT = Math.sin(thetaVis);
	var gnx = -sinT, gny = cosT;
	var wnx =  sinT, wny = -cosT;

	var xL = 22, yApp = 65;
	var xCrest = 148, R_px = 185;  // large crest radius for visual clarity
	var chuteLen = 185, apronLen = 68, exitLen = 72;
	var layerPx = 14;

	var arcCy = yApp + R_px;
	var xCC   = xCrest + R_px * sinT;
	var yCC   = arcCy  - R_px * cosT;

	var xChuteEnd = xCC + chuteLen * cosT;
	var yChuteEnd = yCC + chuteLen * sinT;
	var xApronEnd = xChuteEnd + apronLen;
	var yApronEnd = yChuteEnd;
	var xExitEnd  = xApronEnd + exitLen;
	var yExitEnd  = yApronEnd;

	var geoYapp = yApp + layerPx;
	var R_geo   = R_px - layerPx;   // crest geotextile arc radius
	var geoCCx  = xCC       + gnx * layerPx, geoCCy  = yCC       + gny * layerPx;
	var geoCEx  = xChuteEnd + gnx * layerPx, geoCEy  = yChuteEnd + gny * layerPx;

	var dPx = (d > 0 && D50 > 0) ? Math.min(d / D50 * layerPx * 0.5, 26) : 10;

	// Upstream pool depth is larger than chute depth (weir head > normal depth)
	var dUpPx   = Math.min(dPx * 2 + 4, 28);
	var wseUpY  = yApp - dUpPx;
	var wseChSx = xCC       + wnx * dPx, wseChSy = yCC       + wny * dPx;
	var wseChEx = xChuteEnd + wnx * dPx, wseChEy = yChuteEnd + wny * dPx;
	var yTw     = yExitEnd - Math.max(dPx * 0.65, 14);

	// S-curve-free bezier over crest: k bounded in (0, kMax) ensures monotone control-point y-values
	var kMax  = (wseChSy - wseUpY) / sinT;
	var kBez  = kMax * 0.40;

	function r(n) { return n.toFixed(1); }

	var s = '<svg width="' + W + '" height="' + H + '" style="font-family:sans-serif;font-size:11px;">';

	s += '<defs>';
	s += '<pattern id="rp" patternUnits="userSpaceOnUse" width="6" height="6">';
	s += '<rect width="6" height="6" fill="#cfc8b2"/>';
	s += '<line x1="0" y1="6" x2="6" y2="0" stroke="#aaa" stroke-width="0.6"/>';
	s += '<line x1="-1" y1="1" x2="1" y2="-1" stroke="#aaa" stroke-width="0.6"/>';
	s += '<line x1="5" y1="7" x2="7" y2="5" stroke="#aaa" stroke-width="0.6"/>';
	s += '</pattern>';
	// Arrowhead marker for leader lines
	s += '<marker id="ah" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">';
	s += '<polygon points="0,0.5 9,3.5 0,6.5" fill="black"/></marker>';
	s += '</defs>';

	// Soil — approach is unlined; boundary follows bed then structure underside
	s += '<polygon points="' +
		r(xL)        + ',' + r(yApp)                + ' ' +
		r(xCrest)    + ',' + r(yApp)                + ' ' +
		r(geoCCx)    + ',' + r(geoCCy)              + ' ' +
		r(geoCEx)    + ',' + r(geoCEy)              + ' ' +
		r(xApronEnd) + ',' + r(yApronEnd + layerPx) + ' ' +
		r(xApronEnd) + ',' + r(yExitEnd)            + ' ' +
		r(xExitEnd)  + ',' + r(yExitEnd)            + ' ' +
		r(xExitEnd)  + ',' + (H - 3)                + ' ' +
		r(xL)        + ',' + (H - 3)                +
		'" fill="#c9a87c" stroke="none"/>';

	// Riprap — crest transition, chute, apron (approach is unlined)
	s += '<polygon points="' +
		r(xCrest) + ',' + r(yApp)    + ' ' +
		r(xCC)    + ',' + r(yCC)     + ' ' +
		r(geoCCx) + ',' + r(geoCCy)  + ' ' +
		r(xCrest) + ',' + r(geoYapp) +
		'" fill="url(#rp)" stroke="none"/>';
	s += '<polygon points="' +
		r(xCC)       + ',' + r(yCC)       + ' ' +
		r(xChuteEnd) + ',' + r(yChuteEnd) + ' ' +
		r(geoCEx)    + ',' + r(geoCEy)    + ' ' +
		r(geoCCx)    + ',' + r(geoCCy)    +
		'" fill="url(#rp)" stroke="none"/>';
	s += '<polygon points="' +
		r(xChuteEnd) + ',' + r(yChuteEnd)           + ' ' +
		r(xApronEnd) + ',' + r(yApronEnd)           + ' ' +
		r(xApronEnd) + ',' + r(yApronEnd + layerPx) + ' ' +
		r(geoCEx)    + ',' + r(geoCEy)              +
		'" fill="url(#rp)" stroke="none"/>';

	// Filter fabric — under crest arc + under chute + under apron + right-face wrap
	// Apron starts at geoCEx/geoCEy (continuous with chute, closing the junction gap)
	var ga = 'stroke="#555" stroke-width="1.3" stroke-dasharray="5,3" fill="none"';
	s += '<path d="M' + r(xCrest) + ',' + r(geoYapp) + ' A' + R_geo + ',' + R_geo + ' 0 0,1 ' + r(geoCCx) + ',' + r(geoCCy) + '" ' + ga + '/>';
	s += '<line x1="' + r(geoCCx)    + '" y1="' + r(geoCCy)              + '" x2="' + r(geoCEx)    + '" y2="' + r(geoCEy)              + '" ' + ga + '/>';
	s += '<line x1="' + r(geoCEx)    + '" y1="' + r(geoCEy)              + '" x2="' + r(xApronEnd) + '" y2="' + r(yApronEnd + layerPx) + '" ' + ga + '/>';
	s += '<line x1="' + r(xApronEnd) + '" y1="' + r(yApronEnd + layerPx) + '" x2="' + r(xApronEnd) + '" y2="' + r(yApronEnd)           + '" ' + ga + '/>';

	// Exit channel and end wall
	s += '<line x1="' + r(xApronEnd) + '" y1="' + r(yExitEnd) + '" x2="' + r(xExitEnd)  + '" y2="' + r(yExitEnd)        + '" stroke="black" stroke-width="1.5"/>';
	s += '<line x1="' + r(xExitEnd)  + '" y1="' + r(yExitEnd - 36) + '" x2="' + r(xExitEnd) + '" y2="' + r(yExitEnd + 10) + '" stroke="black" stroke-width="2"/>';

	// Structure outlines — approach bed drawn lighter to distinguish from rock structure
	s += '<line x1="' + r(xL)     + '" y1="' + r(yApp) + '" x2="' + r(xCrest) + '" y2="' + r(yApp) + '" stroke="#777" stroke-width="1.2"/>';
	// Left face of crest rock — dashed filter fabric wraps up this face
	s += '<line x1="' + r(xCrest) + '" y1="' + r(yApp) + '" x2="' + r(xCrest) + '" y2="' + r(geoYapp) + '" ' + ga + '/>';
	s += '<path d="M' + r(xCrest) + ',' + r(yApp) + ' A' + R_px + ',' + R_px + ' 0 0,1 ' + r(xCC) + ',' + r(yCC) + '" fill="none" stroke="black" stroke-width="2"/>';
	s += '<line x1="' + r(xCC)       + '" y1="' + r(yCC)       + '" x2="' + r(xChuteEnd) + '" y2="' + r(yChuteEnd)           + '" stroke="black" stroke-width="2"/>';
	s += '<line x1="' + r(xChuteEnd) + '" y1="' + r(yChuteEnd) + '" x2="' + r(xApronEnd) + '" y2="' + r(yApronEnd)           + '" stroke="black" stroke-width="2"/>';
	// Right face of apron — filter wrap drawn in filter section; no separate solid line needed

	// Water surface
	s += '<line x1="' + r(xL) + '" y1="' + r(wseUpY) + '" x2="' + r(xCrest) + '" y2="' + r(wseUpY) + '" stroke="blue" stroke-width="2"/>';
	// Over-crest: bezier departs horizontal, arrives at chute slope; upstream pool deeper than chute depth
	// 1.4× cc1 pull keeps the WSE tangent horizontal longer before dropping — halves curvature at crest top
	var bcc1x = r(xCrest + Math.max(kBez * cosT * 1.4, 14));
	var bcc2x = r(wseChSx - cosT * kBez), bcc2y = r(wseChSy - sinT * kBez);
	s += '<path d="M' + r(xCrest) + ',' + r(wseUpY) + ' C' + bcc1x + ',' + r(wseUpY) + ' ' + bcc2x + ',' + bcc2y + ' ' + r(wseChSx) + ',' + r(wseChSy) + '" fill="none" stroke="blue" stroke-width="2"/>';
	// Chute WSE extends at chute slope until it meets TW level (no transition arc — user specified)
	var x_meet = wseChSx + (yTw - wseChSy) * cosT / sinT;
	x_meet = Math.min(Math.max(x_meet, wseChSx + 10), xApronEnd);
	s += '<line x1="' + r(wseChSx) + '" y1="' + r(wseChSy) + '" x2="' + r(x_meet)   + '" y2="' + r(yTw) + '" stroke="blue" stroke-width="2"/>';
	s += '<line x1="' + r(x_meet)  + '" y1="' + r(yTw)     + '" x2="' + r(xExitEnd) + '" y2="' + r(yTw) + '" stroke="blue" stroke-width="2"/>';

	// Slope indicator — at 0.18 along chute (upslope from outlet area); armV matches visual thetaVis
	var siX = xCC + 0.18 * chuteLen * cosT + wnx * 20;
	var siY = yCC + 0.18 * chuteLen * sinT + wny * 20;
	var armH = 100, armV = armH * sinT / cosT, sq = 10;
	s += '<line x1="' + r(siX)       + '" y1="' + r(siY)        + '" x2="' + r(siX + armH) + '" y2="' + r(siY)        + '" stroke="black" stroke-width="1.5"/>';
	s += '<line x1="' + r(siX + armH)+ '" y1="' + r(siY)        + '" x2="' + r(siX + armH) + '" y2="' + r(siY + armV) + '" stroke="black" stroke-width="1.5"/>';
	s += '<line x1="' + r(siX)       + '" y1="' + r(siY)        + '" x2="' + r(siX + armH) + '" y2="' + r(siY + armV) + '" stroke="black" stroke-width="1.5"/>';
	s += '<polyline points="' + r(siX+armH-sq) + ',' + r(siY) + ' ' + r(siX+armH-sq) + ',' + r(siY+sq) + ' ' + r(siX+armH) + ',' + r(siY+sq) + '" fill="none" stroke="black" stroke-width="1"/>';
	s += '<text x="' + r(siX + armH * 0.4) + '" y="' + r(siY - 4) + '" text-anchor="middle">1</text>';
	s += '<text x="' + r(siX + armH + 4)   + '" y="' + r(siY + armV * 0.5 + 4) + '">S&#x2080;</text>';

	// --- Labels ---

	// q arrow
	var qx1 = xL + 6, qx2 = xL + 34, qy = wseUpY - 9;
	s += '<line x1="' + r(qx1) + '" y1="' + r(qy) + '" x2="' + r(qx2) + '" y2="' + r(qy) + '" stroke="black" stroke-width="1.2"/>';
	s += '<polygon points="' + r(qx2) + ',' + r(qy) + ' ' + r(qx2-6) + ',' + r(qy-4) + ' ' + r(qx2-6) + ',' + r(qy+4) + '" fill="black"/>';
	s += '<text x="' + r(qx1 + 2) + '" y="' + r(qy - 3) + '" font-style="italic">q</text>';

	// Combined "Top Crest Curve / 40D₅₀ radius" — elbow leader pointing at arc midpoint
	var arcMidX = xCrest + R_px * Math.sin(thetaVis * 0.50);
	var arcMidY = arcCy  - R_px * Math.cos(thetaVis * 0.50);
	var labElbX = xCrest - 2,  labElbY = yApp + 33;
	var labX    = xCrest - 32;
	s += '<line x1="' + r(labX) + '" y1="' + r(labElbY) + '" x2="' + r(labElbX) + '" y2="' + r(labElbY) + '" stroke="black" stroke-width="0.9"/>';
	s += '<line x1="' + r(labElbX) + '" y1="' + r(labElbY) + '" x2="' + r(arcMidX) + '" y2="' + r(arcMidY) + '" stroke="black" stroke-width="0.9" marker-end="url(#ah)"/>';
	s += '<text x="' + r(labX - 2) + '" y="' + r(labElbY - 16) + '" text-anchor="end">' + cfg.rc_sketch_top_crest_curve + '</text>';
	s += '<text x="' + r(labX - 2) + '" y="' + r(labElbY - 3)  + '" text-anchor="end">40\xd7D50 ' + cfg.rc_sketch_radius + '</text>';

	// Filter label — dot on geo line, leader into soil
	var gFeatT = 0.40;
	var gFeatX = geoCCx + (geoCEx - geoCCx) * gFeatT;
	var gFeatY = geoCCy + (geoCEy - geoCCy) * gFeatT;
	var gLeadX = gFeatX + gnx * 16, gLeadY = gFeatY + gny * 16;
	s += '<circle cx="' + r(gFeatX) + '" cy="' + r(gFeatY) + '" r="2" fill="#555"/>';
	s += '<line x1="' + r(gFeatX) + '" y1="' + r(gFeatY) + '" x2="' + r(gLeadX) + '" y2="' + r(gLeadY) + '" stroke="#555" stroke-width="0.8"/>';
	s += '<text x="' + r(gLeadX) + '" y="' + r(gLeadY + 14) + '" fill="#333">' + cfg.rc_sketch_filter + '</text>';

	// Outlet Apron dimension
	var dimY = yApronEnd + layerPx + 14;
	s += '<line x1="' + r(xChuteEnd) + '" y1="' + r(dimY)   + '" x2="' + r(xApronEnd) + '" y2="' + r(dimY)   + '" stroke="black" stroke-width="1"/>';
	s += '<line x1="' + r(xChuteEnd) + '" y1="' + r(dimY-5) + '" x2="' + r(xChuteEnd) + '" y2="' + r(dimY+5) + '" stroke="black" stroke-width="1"/>';
	s += '<line x1="' + r(xApronEnd) + '" y1="' + r(dimY-5) + '" x2="' + r(xApronEnd) + '" y2="' + r(dimY+5) + '" stroke="black" stroke-width="1"/>';
	s += '<text x="' + r((xChuteEnd+xApronEnd)*0.5) + '" y="' + r(dimY+13) + '" text-anchor="middle">15×D50</text>';
	s += '<text x="' + r((xChuteEnd+xApronEnd)*0.5) + '" y="' + r(dimY+27) + '" text-anchor="middle">' + cfg.rc_sketch_outlet_apron + '</text>';

	// TW indicator
	var twX = xApronEnd + exitLen * 0.55;
	s += '<line x1="' + r(twX) + '" y1="' + r(yExitEnd) + '" x2="' + r(twX) + '" y2="' + r(yTw + 1) + '" stroke="#444" stroke-width="0.8" stroke-dasharray="2,2"/>';
	s += '<text x="' + r(twX + 3) + '" y="' + r((yExitEnd+yTw)*0.5 + 4) + '">TW</text>';

	s += '</svg>';
	el.innerHTML = s;
};

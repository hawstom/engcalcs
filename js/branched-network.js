// Branched (distributary/tree) Pipe Network Calculator (prefix bpn_).
//
// A distributary network: a source feeds a main that splits downstream into
// branches, each delivering a fixed point demand. Topology is stored with a
// single parent pointer per line (the line's "upstream" line) -- no node table.
// The downstream end of a line IS a node; results are computed there.
//
// Because demands are fixed, the solve is two non-iterative directional sweeps:
//   1. Flows, bottom -> top: each line carries its own demand + every descendant's.
//   2. Heads, top -> bottom: each line's downstream head = its parent's downstream
//      head minus this line's loss (friction by active method + minor + elevation).
// No Hardy-Cross, no convergence loop (that is why this fills the niche where
// EPANET is overkill). Loops are out of scope -- see the scope doc.
//
// Series-by-default: a blank "upstream" defaults to the previous line (N-1), so a
// no-topology entry is a plain series pipeline; branching is opt-in by overriding.

EngCalcs.g = 9.806;

// Copy/paste data area bookkeeping: 5 singleton 'i' inputs (printable_title,
// printable_subtitle, h_source, elev_source, visc) precede the table; every row
// has 8 editable columns (id, upstream, length, diameter, roughness, k, demand,
// elev_down), the rest are outputs.
// 9 singleton 'i' inputs precede the table: printable_title, printable_subtitle,
// elev_source, h_source1, h_source2, q_source2, h_source3, q_source3, visc.
EngCalcs.dataSingletonsCount = 9;
// The first row has no "upstream" input (it is always the source), so it carries
// one fewer editable cell than the others -- mirrors Manning-Irregular's first row.
EngCalcs.dataColumnsFirstRowCount = 7;
EngCalcs.dataColumnsOtherRowsCount = 8;

// Darcy-Weisbach friction factor for one line: same 3-regime Swamee-Jain approach
// as darcy-weisbach.js / irrigation-pressure.js. e is absolute roughness (SI m).
EngCalcs.bpnDwFriction = function (q, d, e, visc) {
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
			y3 = -0.86859 * Math.log(e / (3.7 * d) + 5.74 / Math.pow(4000, 0.9)),
			fa = Math.pow(y3, -2),
			fb = fa * (2 - 0.00514215 / (y2 * y3)),
			x1 = 7 * fa - fb,
			x2 = 0.128 - 17 * fa + 2.5 * fb,
			x3 = -0.128 + 13 * fa - 2 * fb,
			x4 = r * (0.032 - 3 * fa + 0.5 * fb);
		f = x1 + r * (x2 + r * (x3 + x4));
	} else {
		f = 0.25 / Math.pow(Math.log10(e / (3.7 * d) + 5.74 / Math.pow(re, 0.9)), 2);
	}
	return f;
};

// Friction head loss (SI m) for one line by the active method.
//   line.q      flow (m3/s)          line.length  (m)      line.diameter (m)
//   line.rough  raw roughness number as typed (Manning n / HW C)
//   line.roughSi roughness as a length (m) -- used only by Darcy-Weisbach (e)
// Returns {hf, v} (v is the pipe velocity, m/s, for reporting and minor loss).
EngCalcs.bpnFriction = function (line, method, visc) {
	'use strict';
	var g = this.g,
		d = line.diameter,
		L = line.length,
		q = line.q,
		a,
		v,
		hf,
		f,
		rh,
		sf;
	if (!(d > 0)) { return { hf: 0, v: 0 }; }
	a = Math.PI * d * d / 4;
	v = q / a;
	if (!(L > 0) || q === 0) { return { hf: 0, v: v }; }
	if (method === 'manning') {
		// V = (1/n) R^(2/3) Sf^(1/2), full-pipe R = d/4.  Sf = n^2 v^2 / R^(4/3).
		rh = d / 4;
		sf = line.rough * line.rough * v * v / Math.pow(rh, 4 / 3);
		hf = sf * L;
	} else if (method === 'hw') {
		// Hazen-Williams, identical form to hazen-williams.js (khw = 0.849):
		// Sf = 7.8828 / d^4.8704 * (Q / (0.849 C))^1.852.
		if (!(line.rough > 0)) { return { hf: 0, v: v }; }
		sf = 7.8828 / Math.pow(d, 4.8704) * Math.pow(Math.abs(q) / (0.849 * line.rough), 1.852);
		hf = sf * L;
	} else {
		// Darcy-Weisbach / Swamee-Jain.
		f = this.bpnDwFriction(q, d, line.roughSi, visc);
		hf = f * (L / d) * v * v / (2 * g);
	}
	return { hf: hf, v: v };
};

// Reads the line table rows (display units -> SI) into this.lines, resolves each
// line's parent pointer, and determines which lines are reachable from the source.
EngCalcs.bpnReadRows = function (objForm) {
	'use strict';
	var lengthu = objForm['lengthu'].value,
		diameteru = objForm['diameteru'].value,
		roughnessu = objForm['roughnessu'].value,
		demandu = objForm['demandu'].value,
		elevu = objForm['elevu'].value,
		// Global demand multiplier -- scales every line demand at once for a peak-hour or
		// future-growth run. Blank or unusable => 1 (use demands as entered). An explicit 0
		// is honored: it is the legitimate no-draw / static case.
		demandMultRaw = objForm['demand_mult'].value,
		demandMult = (demandMultRaw === '' || !isFinite(+demandMultRaw) || +demandMultRaw < 0)
			? 1 : +demandMultRaw,
		lines = [],
		idToIndex = {},
		i,
		row,
		id,
		up,
		elevRaw;

	this.topologyProblem = false;

	// Read each input by name within its own row: the first row deliberately has no
	// "upstream" input (its upstream is always the source), so positional indexing
	// would be off by one there -- name lookups are robust to a missing cell.
	var trs = document.getElementById('CalcsBody').getElementsByTagName('tr');
	function cellVal(rowEl, name) {
		var e = rowEl.querySelector('input[name="' + name + '"]');
		return e ? e.value : '';
	}
	for (i = 0; i < this.numCalcRows; i += 1) {
		row = trs[i];
		id = (cellVal(row, 'bpn_id') || '').trim();
		up = (cellVal(row, 'bpn_up') || '').trim();
		elevRaw = cellVal(row, 'bpn_elev');
		// First occurrence of an id wins the lookup; a later duplicate is a topology
		// problem (its own upstream references stay valid, but others pointing to the
		// id are ambiguous).
		if (id !== '' && !Object.prototype.hasOwnProperty.call(idToIndex, id)) {
			idToIndex[id] = i;
		} else if (id !== '') {
			this.topologyProblem = true;
		}
		lines.push({
			id: id,
			upRaw: up,
			length: +cellVal(row, 'bpn_l') / lengthu,
			diameter: +cellVal(row, 'bpn_diameter') / diameteru,
			rough: +cellVal(row, 'bpn_roughness'),                 // raw: Manning n or HW C
			roughSi: +cellVal(row, 'bpn_roughness') / roughnessu,   // as a length: DW e (m)
			kMinor: +cellVal(row, 'bpn_k') || 0,
			demand: (+cellVal(row, 'bpn_demand') || 0) / demandu * demandMult,
			elevDown: (elevRaw === '') ? null : (+elevRaw / elevu)
		});
	}

	// Resolve parent index for each line.
	//   blank upstream  -> previous line (series default); blank on line 0 -> source (-1)
	//   named upstream  -> that id's line; unknown id -> invalid (-2)
	for (i = 0; i < lines.length; i += 1) {
		if (lines[i].upRaw === '') {
			lines[i].parent = (i === 0) ? -1 : i - 1;
		} else if (Object.prototype.hasOwnProperty.call(idToIndex, lines[i].upRaw)) {
			lines[i].parent = idToIndex[lines[i].upRaw];
			if (lines[i].parent === i) { lines[i].parent = -2; this.topologyProblem = true; }
		} else {
			lines[i].parent = -2; // unknown reference
			this.topologyProblem = true;
		}
	}

	// Reachability from the source: BFS from roots (parent === -1) following children.
	// Any cycle is necessarily detached from the source (roots have parent -1), so the
	// reachable set is automatically acyclic -- unreachable lines are flagged, not solved.
	var children = lines.map(function () { return []; }),
		reachable = lines.map(function () { return false; }),
		depth = lines.map(function () { return 0; }),
		queue = [],
		idx,
		c;
	for (i = 0; i < lines.length; i += 1) {
		if (lines[i].parent >= 0) { children[lines[i].parent].push(i); }
		if (lines[i].parent === -1) { queue.push(i); reachable[i] = true; depth[i] = 1; }
	}
	while (queue.length) {
		idx = queue.shift();
		for (c = 0; c < children[idx].length; c += 1) {
			if (!reachable[children[idx][c]]) {
				reachable[children[idx][c]] = true;
				depth[children[idx][c]] = depth[idx] + 1;
				queue.push(children[idx][c]);
			}
		}
	}
	for (i = 0; i < lines.length; i += 1) {
		if (!reachable[i]) { this.topologyProblem = true; }
		lines[i].reachable = reachable[i];
		lines[i].depth = depth[i];
	}

	this.lines = lines;
	this.children = children;
	// Solve order: parents before children (BFS order from the reachable pass).
	this.solveOrder = [];
	var q2 = [];
	for (i = 0; i < lines.length; i += 1) { if (lines[i].parent === -1) { q2.push(i); } }
	while (q2.length) {
		idx = q2.shift();
		this.solveOrder.push(idx);
		for (c = 0; c < children[idx].length; c += 1) { q2.push(children[idx][c]); }
	}
	return lines;
};

// The two-pass solve. Fills line.q, line.v, line.hf, line.hm, line.hl, line.eglDown,
// line.pDown for every reachable line.
EngCalcs.bpnSolve = function () {
	'use strict';
	var lines = this.lines,
		method = this.var.method,
		visc = this.var.visc,
		g = this.g,
		i,
		idx,
		line,
		fr,
		parentEgl,
		parentElev,
		j;

	// Pass 1 -- flows, bottom->top. Each line pushes its own demand up its ancestor
	// chain via the parent pointer (parent-pointer only, no child adjacency needed).
	for (i = 0; i < lines.length; i += 1) { lines[i].q = 0; }
	for (i = 0; i < lines.length; i += 1) {
		if (!lines[i].reachable) { continue; }
		j = i;
		while (j !== -1) { lines[j].q += lines[i].demand; j = lines[j].parent; }
	}

	// Total flow leaving the source (sum of the root line flows) is now known -- and
	// because demands are fixed, that flow is fixed too. So the supply head is a direct
	// lookup on the supply curve at this design flow (no operating-point iteration).
	var qTotal = 0;
	for (i = 0; i < lines.length; i += 1) {
		if (lines[i].reachable && lines[i].parent === -1) { qTotal += lines[i].q; }
	}
	this.var.q_total = qTotal;
	this.var.h_supply = this.bpnSupplyHead(qTotal);

	// Pass 2 -- heads, top->bottom, in parent-before-child order.
	var sourceEgl = this.var.elev_source + this.var.h_supply;
	for (i = 0; i < this.solveOrder.length; i += 1) {
		idx = this.solveOrder[i];
		line = lines[idx];
		if (line.parent === -1) {
			parentEgl = sourceEgl;
			parentElev = this.var.elev_source;
		} else {
			parentEgl = lines[line.parent].eglDown;
			parentElev = (lines[line.parent].elevDown === null) ? this.var.elev_source : lines[line.parent].elevDown;
		}
		// Blank downstream elevation defaults to flat (same as the upstream node).
		if (line.elevDown === null) { line.elevDownEff = parentElev; } else { line.elevDownEff = line.elevDown; }

		fr = this.bpnFriction(line, method, visc);
		line.v = fr.v;
		line.hf = fr.hf;
		line.hm = line.kMinor * fr.v * fr.v / (2 * g);
		line.hl = line.hf + line.hm;
		line.eglDown = parentEgl - line.hl;
		// Gauge pressure head at the downstream node (this line's velocity head removed).
		line.pDown = line.eglDown - line.elevDownEff - fr.v * fr.v / (2 * g);
	}

	// Summary: lowest downstream pressure anywhere in the network (the critical point).
	var pMin = Infinity;
	for (i = 0; i < lines.length; i += 1) {
		if (lines[i].reachable) { pMin = Math.min(pMin, lines[i].pDown); }
	}
	this.var.p_min = isFinite(pMin) ? pMin : 0;
};

// Source head at a given flow, read from the supply curve using the standard
// pump-curve forms (so extrapolation past the entered points is physically shaped,
// not a straight line):
//   1 point  -> flat: a reservoir/tank head, constant regardless of flow.
//   2 points -> parabola  H = H0 - a*Q^2  (max head at zero flow: the classic
//               two-point pump-curve / affinity-law shape).
//   3 points -> power law H = H0 - a*Q^b  (the EPANET three-point pump curve; b is
//               fitted). Falls back to a shutoff parabola on non-monotone data.
EngCalcs.bpnSupplyHead = function (q) {
	'use strict';
	var sorted = this.var.supplyPoints.slice().sort(function (a, b) { return a[0] - b[0]; }),
		pts = [],
		i;
	// Drop any point that repeats the previous point's flow: two heads at one flow is
	// contradictory and would divide by zero in the curve fits below.
	for (i = 0; i < sorted.length; i += 1) {
		if (i === 0 || sorted[i][0] !== sorted[i - 1][0]) { pts.push(sorted[i]); }
	}
	if (pts.length === 1) { return pts[0][1]; }
	if (pts.length === 2) { return this.bpnParabolaHead(pts[0], pts[1], q); }
	return this.bpnPowerCurveHead(pts, q);
};

// H = H0 - a*Q^2 through two points, with the parabola's vertex (maximum head) at
// zero flow -- the standard two-point pump-curve equation. When point 1 is at Q=0
// (the default static head) this reduces to H0 = h1, a = (h1-h2)/q2^2.
EngCalcs.bpnParabolaHead = function (p0, p1, q) {
	'use strict';
	var q0 = p0[0], h0 = p0[1], q1 = p1[0], h1 = p1[1],
		d = q1 * q1 - q0 * q0;
	if (d === 0) { return h0; }
	var a = (h0 - h1) / d, H0 = h0 + a * q0 * q0;
	return H0 - a * q * q;
};

// H = H0 - a*Q^b through three points (EPANET power-curve form). Solves the shape
// exponent b by bisection on (h1-h2)(q3^b - q2^b) = (h2-h3)(q2^b - q1^b), then back-
// solves a and H0. If no valid (monotone) fit exists, falls back to a shutoff
// parabola through the outer two points.
EngCalcs.bpnPowerCurveHead = function (pts, q) {
	'use strict';
	var q1 = pts[0][0], h1 = pts[0][1], q2 = pts[1][0], h2 = pts[1][1], q3 = pts[2][0], h3 = pts[2][1];
	function f(b) {
		return (h1 - h2) * (Math.pow(q3, b) - Math.pow(q2, b)) - (h2 - h3) * (Math.pow(q2, b) - Math.pow(q1, b));
	}
	var lo = 0.1, hi = 20, flo = f(lo), fhi = f(hi), mid, i;
	if (!isFinite(flo) || !isFinite(fhi) || flo * fhi > 0) {
		return this.bpnParabolaHead(pts[0], pts[2], q);
	}
	for (i = 0; i < 80; i += 1) {
		mid = (lo + hi) / 2;
		if (f(lo) * f(mid) <= 0) { hi = mid; } else { lo = mid; }
		if (hi - lo < 1e-10) { break; }
	}
	var b = (lo + hi) / 2,
		a = (h1 - h2) / (Math.pow(q2, b) - Math.pow(q1, b)),
		H0 = h1 + a * Math.pow(q1, b);
	return H0 - a * Math.pow(q, b);
};

EngCalcs.pageCalculator = function (objForm) {
	'use strict';
	var hasUnits, warnEl = document.getElementById('bpn_topology_warn');
	this.var = {};
	this.readFormInput(objForm, 'elev_source', hasUnits = true);
	this.readFormInput(objForm, 'visc', hasUnits = false);
	// Max. allowable pipe head (pressure rating) for the high-pressure flag. Blank => null,
	// which disables only the high side of the inline pressure check (low/subatmospheric stays on).
	var hMaxRaw = objForm['h_max_allow'].value;
	this.var.hMaxAllow = (hMaxRaw === '') ? null : +hMaxRaw / objForm['h_max_allowu'].value;
	// The method selector must never be blank. If anything (a layout-drift cookie bail,
	// an old stored value) left it empty, fall back to the first method and fix the
	// visible dropdown so it can't show an empty selection.
	if (!objForm['method'].value) { objForm['method'].value = 'hw'; }
	this.var.method = objForm['method'].value;
	this.bpnUpdateMethodUI();

	// Supply curve. Point 1 is the static supply head at zero flow (head only -- always
	// the shutoff/reservoir point). Points 2 and 3 are optional and each need both a
	// flow and a head to count. One point -> flat reservoir head.
	this.var.supplyPoints = [];
	var h1Raw = objForm['h_source1'].value;
	if (h1Raw !== '') { this.var.supplyPoints.push([0, +h1Raw / objForm['h_source1u'].value]); }
	[2, 3].forEach(function (n) {
		var qRaw = objForm['q_source' + n].value, hRaw = objForm['h_source' + n].value;
		if (qRaw !== '' && hRaw !== '') {
			this.var.supplyPoints.push([+qRaw / objForm['q_source' + n + 'u'].value, +hRaw / objForm['h_source' + n + 'u'].value]);
		}
	}, this);
	if (this.var.supplyPoints.length === 0) { this.var.supplyPoints = [[0, 0]]; }

	this.bpnReadRows(objForm);
	if (this.lines.length === 0) { return; }
	this.bpnSolve();
	this.bpnWriteRows(objForm);
	this.bpnLoadToggles();
	this.bpnRenderSketch(objForm);

	this.writeFormResult(objForm, 'q_total', 4, hasUnits = true);
	this.writeFormResult(objForm, 'h_supply', 3, hasUnits = true);
	this.writeFormResult(objForm, 'p_min', 3, hasUnits = true);

	warnEl.innerHTML = this.topologyProblem
		? EngCalcs.writeCheckHTML(false, EngCalcs.pageConfig.bpn_topology_warn_short, EngCalcs.pageConfig.bpn_topology_warn)
		: '';
};

// Show only the inputs the active friction method actually uses: kinematic
// viscosity and the roughness-length unit selector are Darcy-Weisbach-only; the
// roughness column symbol switches n (Manning) / C (Hazen-Williams) / e (D-W).
EngCalcs.bpnUpdateMethodUI = function () {
	'use strict';
	var method = this.var.method,
		isDw = (method === 'dw'),
		viscRow = document.getElementById('visc_row'),
		rSym = document.getElementById('bpn_roughness_symbol'),
		rSel = document.forms['formInput']['roughnessu'];
	if (viscRow) { viscRow.style.display = isDw ? '' : 'none'; }
	if (rSel) { rSel.style.display = isDw ? '' : 'none'; }
	if (rSym) { rSym.innerHTML = (method === 'manning') ? 'n' : (method === 'hw') ? 'C' : 'e'; }
};

EngCalcs.bpnWriteRows = function (objForm) {
	'use strict';
	var q_lineu = objForm['q_lineu'].value,
		vu = objForm['vu'].value,
		hlu = objForm['hlu'].value,
		p_downu = objForm['p_downu'].value,
		cfg = EngCalcs.pageConfig,
		// Inline pressure band: low = 0 (subatmospheric flag, unchanged); high = the entered
		// pipe rating (null when blank => high check off).
		pressureLabels = {
			lowShort: cfg.bpn_pressure_warn_short, lowTip: cfg.bpn_pressure_warn,
			highShort: cfg.ip_pressure_high_short, highTip: cfg.ip_pressure_high
		},
		// Velocity band: suite-standard fixed SI limits (<1 m/s low, >3 m/s high).
		velocityLabels = {
			lowShort: cfg.mhp_vel_low_short, lowTip: cfg.mhp_vel_low,
			highShort: cfg.mhp_vel_high_short, highTip: cfg.mhp_vel_high
		},
		i,
		line,
		dash = '&mdash;';
	for (i = 0; i < this.lines.length; i += 1) {
		line = this.lines[i];
		if (line.reachable) {
			document.getElementsByName('q_line')[i].innerHTML = (line.q * q_lineu).toFixed(4);
			document.getElementsByName('v')[i].innerHTML = (line.v * vu).toFixed(4) + EngCalcs.inlineRangeWarnHtml(line.v, 0.6, 3.0, velocityLabels);
			document.getElementsByName('hl')[i].innerHTML = (line.hl * hlu).toFixed(4);
			document.getElementsByName('p_down')[i].innerHTML = (line.pDown * p_downu).toFixed(4) + EngCalcs.inlineRangeWarnHtml(line.pDown, 0, this.var.hMaxAllow, pressureLabels);
		} else {
			document.getElementsByName('q_line')[i].innerHTML = dash;
			document.getElementsByName('v')[i].innerHTML = dash;
			document.getElementsByName('hl')[i].innerHTML = dash;
			document.getElementsByName('p_down')[i].innerHTML = dash;
		}
	}
};

// ---------------------------------------------------------------------------
// "Tall" topology sanity sketch (source at top, flow downward). Grid layout:
// row = depth, column = a reclaimed lane. Series runs squash to one column (a
// single, sibling-less child inherits its parent's column); branches open new
// columns to the right. Cells show the line ID plus any toggled-on fields.
// ---------------------------------------------------------------------------
EngCalcs.bpnSketchToggles = { length: false, diameter: false, q: false, elevation: false, p: false };
EngCalcs.bpnTogglesKey = 'bpn_sketch_toggles';
EngCalcs.bpnToggleFields = { length: 'bpn_show_length', diameter: 'bpn_show_diameter', q: 'bpn_show_q', elevation: 'bpn_show_elevation', p: 'bpn_show_p' };
// One readable-on-white colour per data field, each a small physical nod: length =
// green (money), diameter = clay/terracotta (clay/concrete pipe), flow = water blue,
// elevation = warm saddle-brown (dirt; kept warm and saturated so it reads clearly
// apart from the cool steel pressure), pressure = steel/gunmetal (metal, like a gauge
// or pipe). The sketch cells are always white, so these stay legible in dark mode too.
// Matches the checkbox labels.
EngCalcs.bpnFieldColors = { id: '#000', length: '#2e7d32', diameter: '#bf4b2b', q: '#1565c0', elevation: '#8b5a2b', p: '#455a64' };
EngCalcs.bpnToggleOrder = ['length', 'diameter', 'q', 'elevation', 'p'];

// Persist the sketch checkboxes across visits (they live outside the form, so the
// calc cookie never captures them). localStorage keeps them independent of the calc.
EngCalcs.bpnLoadToggles = function () {
	'use strict';
	try {
		var s = window.localStorage.getItem(this.bpnTogglesKey);
		if (s) {
			var t = JSON.parse(s);
			this.bpnToggleOrder.forEach(function (f) {
				if (typeof t[f] === 'boolean') { this.bpnSketchToggles[f] = t[f]; }
			}, this);
		}
	} catch (e) { /* private mode / disabled storage: fall back to defaults */ }
	var fields = this.bpnToggleFields;
	Object.keys(fields).forEach(function (f) {
		var el = document.getElementById(fields[f]);
		if (el) { el.checked = this.bpnSketchToggles[f]; }
	}, this);
};

EngCalcs.bpnToggleSketch = function (field, checked) {
	'use strict';
	this.bpnSketchToggles[field] = checked;
	try { window.localStorage.setItem(this.bpnTogglesKey, JSON.stringify(this.bpnSketchToggles)); } catch (e) { /* ignore */ }
	if (this.lines) { this.bpnRenderSketch(document.forms['formInput']); }
};

EngCalcs.bpnRenderSketch = function (objForm) {
	'use strict';
	var container = document.getElementById('bpn_sketch');
	if (!container) { return; }
	var lines = this.lines,
		children = this.children,
		reachable = lines.map(function (l) { return l.reachable; }),
		col = lines.map(function () { return 0; }),
		nextCol = 0,
		self = this,
		i;

	// Column assignment: post-order, first child inherits the parent's column.
	function assignCol(idx) {
		var kids = children[idx].filter(function (k) { return reachable[k]; });
		if (kids.length === 0) {
			col[idx] = nextCol;
			nextCol += 1;
		} else {
			kids.forEach(assignCol);
			col[idx] = col[kids[0]];
		}
	}
	var roots = [];
	for (i = 0; i < lines.length; i += 1) { if (lines[i].parent === -1 && reachable[i]) { roots.push(i); } }
	roots.forEach(assignCol);

	// Node list: a synthetic source node above the root line(s), then each reachable line.
	var lengthu = objForm['lengthu'].value,
		diameteru = objForm['diameteru'].value,
		elevu = objForm['elevu'].value,
		q_lineu = objForm['q_lineu'].value,
		p_downu = objForm['p_downu'].value,
		tog = this.bpnSketchToggles,
		colors = this.bpnFieldColors,
		nodes = [],
		sourceCol = roots.length ? col[roots[0]] : 0;

	nodes.push({ col: sourceCol, depth: 0, isSource: true, textLines: [{ t: EngCalcs.pageConfig.bpn_source_label, color: colors.id, bold: true }], parentNode: -1 });
	var lineNode = lines.map(function () { return -1; });
	for (i = 0; i < lines.length; i += 1) {
		if (!reachable[i]) { continue; }
		var t = [{ t: lines[i].id || ('#' + (i + 1)), color: colors.id, bold: true }];
		if (tog.length) { t.push({ t: (lines[i].length * lengthu).toFixed(1), color: colors.length }); }
		if (tog.diameter) { t.push({ t: (lines[i].diameter * diameteru).toFixed(1), color: colors.diameter }); }
		if (tog.q) { t.push({ t: (lines[i].q * q_lineu).toFixed(2), color: colors.q }); }
		if (tog.elevation) { t.push({ t: (lines[i].elevDownEff * elevu).toFixed(1), color: colors.elevation }); }
		if (tog.p) { t.push({ t: (lines[i].pDown * p_downu).toFixed(1), color: colors.p }); }
		lineNode[i] = nodes.length;
		nodes.push({ col: col[i], depth: lines[i].depth, textLines: t, lineIdx: i });
	}
	// Wire parent references between nodes (root lines hang off the source node 0).
	for (i = 0; i < lines.length; i += 1) {
		if (!reachable[i] || lineNode[i] < 0) { continue; }
		nodes[lineNode[i]].parentNode = (lines[i].parent === -1) ? 0 : lineNode[lines[i].parent];
	}

	// Measure: column width = widest cell in that column; row height uniform.
	var charW = 7, lineH = 13, padX = 6, padY = 5, gapX = 22, gapY = 26,
		colCount = nextCol || 1,
		colW = [], j, w;
	for (j = 0; j < colCount; j += 1) { colW[j] = 24; }
	nodes.forEach(function (n) {
		w = 0;
		n.textLines.forEach(function (o) { w = Math.max(w, o.t.length * charW); });
		colW[n.col] = Math.max(colW[n.col], w + 2 * padX);
	});
	var colX = [], acc = 8;
	for (j = 0; j < colCount; j += 1) { colX[j] = acc; acc += colW[j] + gapX; }
	var totalW = acc + 8;
	var maxDepth = 0;
	nodes.forEach(function (n) { maxDepth = Math.max(maxDepth, n.depth); });
	function cellH(n) { return n.textLines.length * lineH + 2 * padY; }
	var dmax = maxDepth;
	// Row heights per depth, stacked with a constant gap between cell edges -- so the
	// space between any row and the next is exactly gapY regardless of a row's cell
	// height (keeps the short source cell from leaving a gratuitous gap above line 1).
	var rowH = [], rowY = [], acc2 = 8;
	for (j = 0; j <= dmax; j += 1) { rowH[j] = 0; }
	nodes.forEach(function (n) { rowH[n.depth] = Math.max(rowH[n.depth], cellH(n)); });
	for (j = 0; j <= dmax; j += 1) { rowY[j] = acc2; acc2 += rowH[j] + gapY; }
	var totalH = (acc2 - gapY) + 8;

	// Geometry per node.
	nodes.forEach(function (n) {
		n.w = colW[n.col];
		n.h = cellH(n);
		n.x = colX[n.col];
		n.y = rowY[n.depth];
		n.cx = n.x + n.w / 2;
	});

	// Build SVG: connectors first (behind cells), then cells.
	var svg = '<svg viewBox="0 0 ' + totalW + ' ' + totalH + '" width="' + totalW +
		'" height="' + totalH + '" style="max-width:100%;height:auto" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="11">';
	nodes.forEach(function (n) {
		if (n.parentNode === undefined || n.parentNode < 0) { return; }
		var p = nodes[n.parentNode],
			y1 = p.y + p.h,
			y2 = n.y,
			ymid = (y1 + y2) / 2;
		svg += '<path d="M' + p.cx + ' ' + y1 + ' V' + ymid + ' H' + n.cx + ' V' + y2 +
			'" fill="none" stroke="#000" stroke-width="1"/>';
	});
	nodes.forEach(function (n) {
		svg += '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h +
			'" rx="4" fill="' + (n.isSource ? '#e8f0ff' : '#fff') + '" stroke="#000" stroke-width="1"/>';
		n.textLines.forEach(function (o, k) {
			var ty = n.y + padY + lineH * (k + 1) - 3;
			svg += '<text x="' + n.cx + '" y="' + ty + '" text-anchor="middle" fill="' + o.color + '"' +
				(o.bold ? ' font-weight="bold"' : '') + '>' + self.bpnEscapeSvg(o.t) + '</text>';
		});
	});
	svg += '</svg>';
	container.innerHTML = svg;
};

EngCalcs.bpnEscapeSvg = function (s) {
	'use strict';
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

EngCalcs.pageCalculatorInitialize = function (objForm) {
	'use strict';
	document.getElementById('CalcsBody').innerHTML = '';
	this.numCalcRows = 0;
	this.pageAddCalcRow();
	this.pageAddCalcRow();
	this.pageAddCalcRow();
};

EngCalcs.addBranchedNetworkLine = function (id, upstream, length, diameter, roughness, kMinor, demand, elevDown) {
	'use strict';
	var arrColumns = [
		{ name: 'bpn_id', value: id, inputType: 'text' },
		// upstream === null on the first row -> no input cell (its upstream is the source).
		{ name: 'bpn_up', value: upstream, inputType: (upstream === null ? null : 'text') },
		{ name: 'bpn_l', value: length, inputType: 'number' },
		{ name: 'bpn_diameter', value: diameter, inputType: 'number' },
		{ name: 'bpn_roughness', value: roughness, inputType: 'number' },
		{ name: 'bpn_k', value: kMinor, inputType: 'number' },
		{ name: 'bpn_demand', value: demand, inputType: 'number' },
		{ name: 'bpn_elev', value: elevDown, inputType: 'number' },
		{ name: 'q_line', value: null, inputType: null },
		{ name: 'v', value: null, inputType: null },
		{ name: 'hl', value: null, inputType: null },
		{ name: 'p_down', value: null, inputType: null }
	];
	this.addCalcRow(arrColumns);
	// First row: its upstream cell has no input -- label it "Source" (greyed) so the
	// blank cell reads as intentional rather than missing.
	if (upstream === null) {
		var trs = document.getElementById('CalcsBody').getElementsByTagName('tr'),
			cell = trs[trs.length - 1].querySelector('td[name="bpn_up"]');
		if (cell) {
			cell.innerHTML = '<span style="color:#888">' + this.bpnEscapeSvg(EngCalcs.pageConfig.bpn_source_label || 'Source') + '</span>';
		}
	}
};

// Default example: a main (line 1) feeding two branches (2 and 3). Line 2 blank
// upstream -> series from 1; line 3's upstream set to "1" makes it branch off 1.
// Elevations step down a gentle slope from a source at 100 m.
EngCalcs.pageAddCalcRow = function () {
	'use strict';
	var id, up, length, diameter, roughness, kMinor, demand, elevDown, prev = this.numCalcRows - 1;
	if (this.numCalcRows === 0) {
		// First line: upstream = null renders no input (always fed by the source).
		id = '1'; up = null; length = 200; diameter = 100; roughness = 150; kMinor = 2; demand = 0; elevDown = 90;
	} else if (this.numCalcRows === 1) {
		id = '2'; up = ''; length = 150; diameter = 75; roughness = 150; kMinor = 2; demand = 5; elevDown = 82;
	} else if (this.numCalcRows === 2) {
		id = '3'; up = '1'; length = 150; diameter = 75; roughness = 150; kMinor = 2; demand = 5; elevDown = 84;
	} else {
		// New rows extend the series by default (blank upstream = the previous line).
		id = String(this.numCalcRows + 1);
		up = '';
		length = +document.getElementsByName('bpn_l')[prev].value;
		diameter = +document.getElementsByName('bpn_diameter')[prev].value;
		roughness = +document.getElementsByName('bpn_roughness')[prev].value;
		kMinor = +document.getElementsByName('bpn_k')[prev].value;
		demand = +document.getElementsByName('bpn_demand')[prev].value;
		elevDown = +document.getElementsByName('bpn_elev')[prev].value;
	}
	this.addBranchedNetworkLine(id, up, length, diameter, roughness, kMinor, demand, elevDown);
};

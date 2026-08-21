// Branched Pipe Network (bpn_) -- a worked example, anchored against the source methods.
//
//   node dev/calc-spike/bpn-harness.js
//
// WHAT IT IS ANCHORED AGAINST. Nothing here compares the page to itself; every expected number
// below is recomputed in this file's own arithmetic from a published equation, in the equation's
// own published units, and only then compared with what the page displays.
//
//   * FRICTION, Hazen-Williams: the form EPANET solves and states in its manual (Rossman, EPANET 2
//     Users Manual, section 3.1 "Hydraulic Head Loss"), in US units --
//         h_f = 4.727 L Q^1.852 / (C^1.852 d^4.871)      h_f, L, d in ft; Q in cfs
//     The 4.727 is typed here as a literal, so a change to EngCalcs.hwCoef in
//     js/PipeHydraulics.lib.js cannot move both sides of the comparison at once.
//   * FRICTION, Manning: V = (1/n) R^(2/3) S^(1/2) in SI, with a full pipe's R = d/4, rearranged
//     to S = n^2 V^2 / R^(4/3). (Chow, Open-Channel Hydraulics, eq. 5-6, applied to a full pipe.)
//   * FRICTION, Darcy-Weisbach: the page uses Swamee & Jain (1976) for f; this harness checks it
//     against the equation Swamee-Jain APPROXIMATES -- Colebrook-White, solved here by fixed-point
//     iteration -- and holds it to the 1% Swamee-Jain claims over the range tested.
//   * MINOR LOSS: h_m = k V^2 / (2 g), with g = 9.80665 m/s^2 (standard gravity, ISO 80000-3).
//   * THE TWO-PASS SOLVE ITSELF: continuity (a line carries its own demand plus every
//     descendant's) and the energy equation along the tree (EGL falls by h_f + h_m across each
//     line; the gauge pressure head at a node is EGL - elevation - velocity head). Those are the
//     part that is bpn_'s OWN, and they are what the four friction kernels are wrapped in.
//   * SUPPLY CURVE: the two-point pump curve H = H0 - a Q^2 with its vertex at shutoff.
//
// UNIT CONVERSIONS are likewise re-derived here from the exact definitions (ft = 0.3048 m,
// gal = 3.785411784 L) rather than read out of $ec_units, so a wrong conversion factor cannot
// launder itself through both sides. The dimensionless proportionality checks below are stronger
// still: a wrong factor cannot survive "doubling the length doubles the loss" either way.
//
// MUTATIONS TRIED, all caught:
//   1. EngCalcs.hwExp 1.852 -> 1.85            (absolute h_f, and the Q^1.852 proportionality)
//   2. EngCalcs.hwDiaExp 4.871 -> 4.87         (absolute h_f, and the d^-4.871 proportionality)
//   3. bpnSolve minor loss k*v*v/(2g) -> k*v*v/g   (absolute h_l on the line that has a k)
//   4. bpnSolve p_down keeps the velocity head   (absolute p_down, every line)
//   5. bpnReadRows series default i-1 -> -1     (the branch/series topology flows)
//   6. bpnFriction Manning R = d/4 -> d/2       (the Manning absolute example)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Branched Pipe Network (bpn_) worked example');

// EVERY TOLERANCE HERE IS SET BY THE PAGE'S DISPLAY PRECISION, NOT BY THE PHYSICS. The row cells
// are written with .toFixed(4), so a head loss near 8 ft is quantised at about 1e-5 relative --
// and a RATIO of two such numbers carries twice that. 1e-4 is therefore the tightest honest
// statement about anything read out of a results cell; asking for 1e-6 would only be testing
// rounding. It is still four orders of magnitude tighter than any of the mutations listed above.
const TOL = 1e-4;

// ---- the reference arithmetic, from the exact definitions --------------------------------
const FT = 0.3048;                 // exactly, by definition
const GAL = 3.785411784e-3;        // m3, exactly, by definition
const G = 9.80665;                 // m/s2, standard gravity
const GPM_PER_CFS = (FT * FT * FT) / (GAL / 60);
const G_FT = G / FT;               // ft/s2

/** Hazen-Williams head loss, ft, from EPANET's stated US-unit form. */
function hwLossFt(lengthFt, flowGpm, cFactor, diaIn) {
	const q = flowGpm / GPM_PER_CFS, d = diaIn / 12;
	return 4.727 * lengthFt * Math.pow(q, 1.852) / (Math.pow(cFactor, 1.852) * Math.pow(d, 4.871));
}

/** Full-pipe velocity, ft/s. */
function velFtps(flowGpm, diaIn) {
	const q = flowGpm / GPM_PER_CFS, d = diaIn / 12;
	return q / (Math.PI * d * d / 4);
}

/** Velocity head, ft. */
function velHeadFt(vFtps) { return vFtps * vFtps / (2 * G_FT); }

/**
 * Colebrook-White, solved by fixed-point iteration -- the equation Swamee-Jain approximates.
 *     1/sqrt(f) = -2 log10( e/(3.7 d) + 2.51 / (Re sqrt(f)) )
 */
function colebrookF(re, relRough) {
	let f = 0.02;
	for (let i = 0; i < 200; i += 1) {
		const rhs = -2 * Math.log10(relRough / 3.7 + 2.51 / (re * Math.sqrt(f)));
		f = 1 / (rhs * rhs);
	}
	return f;
}

// ---- one network, entered once, used by most of the sections -----------------------------
//
// Source at elevation 100 ft feeding a 1,000 ft 8 in main (line 1). Line 2 continues it in
// series (blank upstream) to a 200 gpm demand; line 3 BRANCHES off line 1 -- its upstream is
// named "1" -- to a 300 gpm demand through a k = 2.5 fitting. Nothing about that arrangement is
// special; it is the smallest network in which the series default and an explicit branch are
// both exercised and give different answers.
const MAIN = {
	elevSource: 100, supplyHeadFt: 100,
	rows: [
		{ id: '1', up: null, L: 1000, d: 8, c: 100, k: 0, demand: 0, elev: 100 },
		{ id: '2', up: '', L: 500, d: 6, c: 100, k: 0, demand: 200, elev: 95 },
		{ id: '3', up: '1', L: 800, d: 6, c: 130, k: 2.5, demand: 300, elev: 80 }
	]
};

/**
 * Loads the page, builds its rows with its OWN row builder, and enters the network above in US
 * units with every head column reading in feet of water. Head columns default to psi; asserting
 * in feet keeps this file's arithmetic in the units the published equation is written in.
 */
function loadMain(overrides) {
	const o = overrides || {};
	const page = loadCalculator('Branched-Network.php');
	page.initRows();
	page.units('us');
	['hl', 'p_down', 'h_supply', 'p_min', 'h_source1', 'h_source2', 'h_source3', 'h_max_allow']
		.forEach(n => page.unit(n, 'fth2o'));
	page.set({
		elev_source: MAIN.elevSource,
		h_source1: MAIN.supplyHeadFt,
		h_source2: '', q_source2: '', h_source3: '', q_source3: '',
		h_max_allow: '', demand_mult: (o.demandMult === undefined ? 1 : o.demandMult),
		method: o.method || 'hw'
	});
	MAIN.rows.forEach(function (row, i) {
		const cells = {
			bpn_id: row.id,
			bpn_l: (o.length && o.length[i] !== undefined) ? o.length[i] : row.L,
			bpn_diameter: (o.dia && o.dia[i] !== undefined) ? o.dia[i] : row.d,
			bpn_roughness: (o.rough && o.rough[i] !== undefined) ? o.rough[i] : row.c,
			bpn_k: row.k,
			bpn_demand: row.demand,
			bpn_elev: row.elev
		};
		// The first row has no upstream cell at all -- it is always fed by the source.
		if (row.up !== null) { cells.bpn_up = (o.up && o.up[i] !== undefined) ? o.up[i] : row.up; }
		page.setRow(i, cells);
	});
	page.run();
	return page;
}

// =========================================================================================
r.section('the page builds its own rows, and they are the rows it ships');

const base = loadMain();
r.eq(base.rowCount(), 3, 'pageCalculatorInitialize() seeds three lines');
r.eq(base.cells('q_line').length, 3, 'every line has a flow cell');
// The first row's upstream cell is a plain TD carrying the word "Source"; rows below it hold a
// real text INPUT. Reading the tag is what distinguishes them -- both answer to the same name.
r.eq(base.cell('bpn_up', 0).tagName, 'TD', 'the first line\'s upstream cell holds no input');
r.eq(base.cell('bpn_up', 1).tagName, 'INPUT', 'every line below it has an upstream input');

// =========================================================================================
r.section('continuity -- pass 1, flows bottom to top');

// Line 1 carries both demands; line 2 and line 3 hang off it and carry their own only.
r.close(base.rowNum('q_line', 0), 500, 1e-9, 'line 1 carries both descendants\' demands (500 gpm)');
r.close(base.rowNum('q_line', 1), 200, 1e-9, 'line 2 carries its own demand only (200 gpm)');
r.close(base.rowNum('q_line', 2), 300, 1e-9, 'line 3 branches off line 1 and carries 300 gpm');
r.close(base.num('q_total'), 500, 1e-9, 'total supply flow is the sum of the demands');

// A branch is not a series run, and the difference must be visible: point line 3 at line 2
// instead and line 2's flow must pick up line 3's demand.
const series = loadMain({ up: [undefined, '', '2'] });
r.close(series.rowNum('q_line', 1), 500, 1e-9,
	'with line 3 downstream of line 2, line 2 carries 500 gpm');
r.close(series.rowNum('q_line', 0), 500, 1e-9, 'and line 1 still carries the whole 500 gpm');

// =========================================================================================
r.section('Hazen-Williams head loss -- the absolute worked example');
//
//   line 1:  h_f = 4.727 * 1000 * (500/448.8311688)^1.852 / (100^1.852 * (8/12)^4.871)
//   line 2:  the same with L = 500 ft, Q = 200 gpm, d = 6 in
//   line 3:  the same with L = 800 ft, Q = 300 gpm, C = 130, d = 6 in, plus k = 2.5 minor loss

const hf = MAIN.rows.map((row, i) => hwLossFt(row.L, [500, 200, 300][i], row.c, row.d));
const vFt = MAIN.rows.map((row, i) => velFtps([500, 200, 300][i], row.d));
const hm = MAIN.rows.map((row, i) => row.k * velHeadFt(vFt[i]));

r.close(base.rowNum('hl', 0), hf[0] + hm[0], TOL, 'line 1 head loss, ft of water');
r.close(base.rowNum('hl', 1), hf[1] + hm[1], TOL, 'line 2 head loss, ft of water');
r.close(base.rowNum('hl', 2), hf[2] + hm[2], TOL, 'line 3 head loss, friction + k = 2.5 fitting');
r.close(base.rowNum('v', 0), vFt[0], TOL, 'line 1 velocity, ft/s');
r.close(base.rowNum('v', 1), vFt[1], TOL, 'line 2 velocity, ft/s');
r.close(base.rowNum('v', 2), vFt[2], TOL, 'line 3 velocity, ft/s');
// The minor loss is separable and must be exactly k V^2/2g: line 3 with k = 0 loses exactly h_m
// less. This is what catches a 2 g written as g.
r.close(base.rowNum('hl', 2) - hf[2], hm[2], TOL,
	'the k = 2.5 fitting contributes exactly k V^2 / 2g');

// =========================================================================================
r.section('the energy equation along the tree -- pass 2, heads top to bottom');
//
//   EGL at the source  = elevation + supply head          = 100 + 100 = 200 ft
//   EGL below a line   = EGL above it - (h_f + h_m)
//   gauge head at node = EGL - node elevation - V^2/2g

const eglSource = MAIN.elevSource + MAIN.supplyHeadFt;
const egl1 = eglSource - (hf[0] + hm[0]);
const egl2 = egl1 - (hf[1] + hm[1]);
const egl3 = egl1 - (hf[2] + hm[2]);      // line 3 hangs off line 1, NOT off line 2
const pDown = [
	egl1 - MAIN.rows[0].elev - velHeadFt(vFt[0]),
	egl2 - MAIN.rows[1].elev - velHeadFt(vFt[1]),
	egl3 - MAIN.rows[2].elev - velHeadFt(vFt[2])
];
r.close(base.rowNum('p_down', 0), pDown[0], TOL, 'pressure head at node 1');
r.close(base.rowNum('p_down', 1), pDown[1], TOL, 'pressure head at node 2');
r.close(base.rowNum('p_down', 2), pDown[2], TOL,
	'pressure head at node 3 -- 20 ft lower ground, so HIGHER than node 2');
r.ok(pDown[2] > pDown[1], 'and the branch node is genuinely the higher-pressure one',
	`${pDown[2].toFixed(3)} ft vs ${pDown[1].toFixed(3)} ft`);
r.close(base.num('p_min'), Math.min.apply(null, pDown), TOL,
	'the reported critical point is the lowest node pressure in the network');

// =========================================================================================
r.section('the exponents themselves -- dimensionless, so no unit factor can launder them');

// h_f is linear in L. Doubling every length must exactly double every friction loss, and the
// minor losses (which do not depend on L) must not move.
const longer = loadMain({ length: MAIN.rows.map(row => row.L * 2) });
r.close(longer.rowNum('hl', 0) / base.rowNum('hl', 0), 2, TOL, 'h_f is linear in length (line 1)');
r.close(longer.rowNum('hl', 1) / base.rowNum('hl', 1), 2, TOL, 'h_f is linear in length (line 2)');

// h_f goes as Q^1.852. demand_mult scales every demand at once, so every flow doubles.
const peak = loadMain({ demandMult: 2 });
r.close(peak.rowNum('q_line', 0), 1000, 1e-9, 'demand_mult = 2 doubles the flows');
r.close(peak.rowNum('hl', 0) / base.rowNum('hl', 0), Math.pow(2, 1.852), TOL,
	'h_f goes as Q^1.852 (line 1, no fitting)');
r.close(peak.rowNum('hl', 1) / base.rowNum('hl', 1), Math.pow(2, 1.852), TOL,
	'h_f goes as Q^1.852 (line 2, no fitting)');
// Line 3 has a fitting, whose loss goes as Q^2 -- a different exponent, and the combined ratio
// must sit strictly between the two. That is a check the pure-friction lines cannot make.
const ratio3 = peak.rowNum('hl', 2) / base.rowNum('hl', 2);
r.ok(ratio3 > Math.pow(2, 1.852) && ratio3 < 4,
	'a line with a fitting scales between Q^1.852 and Q^2', `ratio ${ratio3.toFixed(6)}`);

// h_f goes as C^-1.852.
const rougher = loadMain({ rough: [80, 80, 80] });
r.close(rougher.rowNum('hl', 0) / base.rowNum('hl', 0), Math.pow(100 / 80, 1.852), TOL,
	'h_f goes as C^-1.852');

// h_f goes as d^-4.871.
const bigger = loadMain({ dia: [10, 6, 6] });
r.close(bigger.rowNum('hl', 0) / base.rowNum('hl', 0), Math.pow(8 / 10, 4.871), TOL,
	'h_f goes as d^-4.871');

// =========================================================================================
r.section('the supply curve -- two points make a shutoff parabola');
//
//   H = H0 - a Q^2, vertex at Q = 0.  With H(0) = 100 ft and H(500 gpm) = 64 ft,
//   a = 36 / 500^2, so H(250 gpm) = 100 - 36/4 = 91 ft.

function loadWithCurve(demandMult) {
	const page = loadMain({ demandMult: demandMult });
	page.set({ q_source2: 500, h_source2: 64 });
	page.run();
	return page;
}
r.close(loadWithCurve(1).num('h_supply'), 64, TOL,
	'at the design flow the supply head is the second curve point');
r.close(loadWithCurve(0.5).num('h_supply'), 91, TOL,
	'at half the flow the parabola gives 100 - 36/4 = 91 ft');
r.close(base.num('h_supply'), 100, 1e-9,
	'one point alone is a flat reservoir head, whatever the flow');

// =========================================================================================
r.section('Manning, the second friction method');
//
//   S = n^2 V^2 / R^(4/3) in SI, R = d/4 for a full pipe. Line 1: n = 0.013,
//   L = 1000 ft = 304.8 m, d = 8 in = 0.2032 m, Q = 500 gpm.

const manning = loadMain({ method: 'manning', rough: [0.013, 0.013, 0.013] });
(function () {
	const n = 0.013;
	const lSi = 1000 * FT, dSi = 8 / 12 * FT;
	const qSi = 500 / GPM_PER_CFS * FT * FT * FT;
	const vSi = qSi / (Math.PI * dSi * dSi / 4);
	const rh = dSi / 4;
	const hfSi = n * n * vSi * vSi / Math.pow(rh, 4 / 3) * lSi;
	r.close(manning.rowNum('hl', 0), hfSi / FT, TOL,
		'Manning head loss on line 1, ft of water');
	// Manning's velocity is the same continuity velocity -- the method changes the loss, not V.
	r.close(manning.rowNum('v', 0), base.rowNum('v', 0), 1e-9,
		'the friction method does not change the pipe velocity');
}());
// n^2 exactly: doubling n quadruples the Manning loss. (Hazen-Williams would give 2^1.852.)
const manningRough = loadMain({ method: 'manning', rough: [0.026, 0.013, 0.013] });
r.close(manningRough.rowNum('hl', 0) / manning.rowNum('hl', 0), 4, TOL,
	'the Manning loss goes as n^2');

// =========================================================================================
r.section('Darcy-Weisbach, against the equation Swamee-Jain approximates');

const dw = loadMain({ method: 'dw', rough: [0.00015, 0.00015, 0.00015] });
(function () {
	// The roughness column is a LENGTH under Darcy-Weisbach, and its unit select is 'ft' in the
	// US preset -- 0.00015 ft is commercial steel.
	const eSi = 0.00015 * FT, dSi = 8 / 12 * FT, lSi = 1000 * FT, nu = 1e-6;
	const qSi = 500 / GPM_PER_CFS * FT * FT * FT;
	const vSi = qSi / (Math.PI * dSi * dSi / 4);
	const re = vSi * dSi / nu;
	const f = colebrookF(re, eSi / dSi);
	const hfSi = f * (lSi / dSi) * vSi * vSi / (2 * G);
	r.ok(re > 4000, 'the worked example is turbulent, where Swamee-Jain applies', `Re = ${re.toFixed(0)}`);
	r.close(dw.rowNum('hl', 0), hfSi / FT, 0.01,
		'Darcy-Weisbach loss agrees with Colebrook-White to within Swamee-Jain\'s claimed 1%');
	// A far tighter statement than the 1%: Swamee-Jain is an explicit formula, so re-evaluating
	// it here must reproduce the page exactly.
	const fSj = 0.25 / Math.pow(Math.log10(eSi / (3.7 * dSi) + 5.74 / Math.pow(re, 0.9)), 2);
	r.close(dw.rowNum('hl', 0), fSj * (lSi / dSi) * vSi * vSi / (2 * G) / FT, TOL,
		'and it is Swamee-Jain (1976) exactly');
}());

// =========================================================================================
r.section('the same network in SI -- the display factors are a lens, not a second calculator');

(function () {
	const page = loadCalculator('Branched-Network.php');
	page.initRows();
	page.units('si');
	['hl', 'p_down', 'h_supply', 'p_min', 'h_source1'].forEach(n => page.unit(n, 'mh2o'));
	page.set({
		elev_source: MAIN.elevSource * FT, h_source1: MAIN.supplyHeadFt * FT,
		h_source2: '', q_source2: '', h_source3: '', q_source3: '',
		h_max_allow: '', demand_mult: 1, method: 'hw'
	});
	// SI preset: length in m, diameter in mm, demand in L/s, elevation in m.
	const lps = gpm => gpm / GPM_PER_CFS * FT * FT * FT * 1000;
	MAIN.rows.forEach(function (row, i) {
		const cells = {
			bpn_id: row.id, bpn_l: row.L * FT, bpn_diameter: row.d * 25.4,
			bpn_roughness: row.c, bpn_k: row.k,
			bpn_demand: lps(row.demand), bpn_elev: row.elev * FT
		};
		if (row.up !== null) { cells.bpn_up = row.up; }
		page.setRow(i, cells);
	});
	page.run();
	for (let i = 0; i < 3; i += 1) {
		r.close(page.rowNum('hl', i), (hf[i] + hm[i]) * FT, TOL,
			`line ${i + 1} head loss in metres matches the US-unit worked example`);
		r.close(page.rowNum('p_down', i), pDown[i] * FT, TOL,
			`node ${i + 1} pressure head in metres matches the US-unit worked example`);
	}
}());

// =========================================================================================
r.section('topology problems are flagged, never solved quietly');

const unknownUp = loadMain({ up: [undefined, '', 'nowhere'] });
r.ok(/⚠/.test(unknownUp.html('bpn_topology_warn')),
	'an upstream id that names no line raises the topology warning',
	unknownUp.html('bpn_topology_warn').replace(/<[^>]*>/g, ''));
r.ok(!/\d/.test(unknownUp.rowHtml('q_line', 2)),
	'and that line reports no flow rather than a plausible-looking one',
	unknownUp.rowHtml('q_line', 2));
r.ok(!/⚠/.test(base.html('bpn_topology_warn')),
	'a sound tree raises no topology warning');

const selfRef = loadMain({ up: [undefined, '2', ''] });
r.ok(/⚠/.test(selfRef.html('bpn_topology_warn')),
	'a line named as its own upstream raises the topology warning');

r.finish();

// Hand-built test networks for the Phase 0.5 solver spike. All SI.
//
// These exist to test the things EPANET's example networks do NOT exercise:
// emitters, closed links, a disconnected node, a zero-demand network, and cases
// with a closed-form answer that is independent of the solver's own machinery.

const M3S_PER_LPS = 0.001;

function pipe(id, from, to, length, diameter, roughness, k) {
	return {
		id, type: 'pipe', from, to,
		length, diameter, roughness,
		k: k || 0, status: 'open'
	};
}

// Reservoir -- pipe -- J1 -- (two parallel pipes) -- J2(demand).
//
// A genuine loop with a closed-form answer: the two parallel pipes see the same
// head difference, so r1 Q1^n = r2 Q2^n with Q1 + Q2 = Q. That makes the split
// analytic and completely independent of the GGA.
const twoLoopAnalytic = {
	name: 'parallel-pipes-analytic',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 100 },
		{ id: 'J1', type: 'junction', elev: 0, demand: 0 },
		{ id: 'J2', type: 'junction', elev: 0, demand: 50 * M3S_PER_LPS }
	],
	links: [
		pipe('P0', 'R', 'J1', 500, 0.3, 130),
		pipe('PA', 'J1', 'J2', 800, 0.2, 130),
		pipe('PB', 'J1', 'J2', 400, 0.15, 130)
	]
};

// Two loops, one reservoir, four demands. No closed form; this is the residual and
// cross-method workhorse.
const twoLoopGrid = {
	name: 'two-loop-grid',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 120 },
		{ id: 'A', type: 'junction', elev: 10, demand: 20 * M3S_PER_LPS },
		{ id: 'B', type: 'junction', elev: 12, demand: 30 * M3S_PER_LPS },
		{ id: 'C', type: 'junction', elev: 8, demand: 25 * M3S_PER_LPS },
		{ id: 'D', type: 'junction', elev: 15, demand: 15 * M3S_PER_LPS },
		{ id: 'E', type: 'junction', elev: 11, demand: 10 * M3S_PER_LPS }
	],
	links: [
		pipe('L1', 'R', 'A', 300, 0.35, 130),
		pipe('L2', 'A', 'B', 400, 0.25, 130),
		pipe('L3', 'B', 'C', 400, 0.20, 130),
		pipe('L4', 'C', 'D', 400, 0.20, 130),
		pipe('L5', 'D', 'A', 400, 0.25, 130),
		pipe('L6', 'B', 'E', 350, 0.15, 130),
		pipe('L7', 'E', 'C', 350, 0.15, 130)
	]
};

// Same grid under each friction method, to prove the method switch is wired
// through the resistance/derivative pair rather than only through reporting.
const twoLoopManning = Object.assign({}, twoLoopGrid, {
	name: 'two-loop-manning',
	method: 'manning',
	links: twoLoopGrid.links.map(l => Object.assign({}, l, { roughness: 0.011 }))
});

const twoLoopDw = Object.assign({}, twoLoopGrid, {
	name: 'two-loop-darcy-weisbach',
	method: 'dw',
	visc: 1.007e-6,
	links: twoLoopGrid.links.map(l => Object.assign({}, l, { roughness: 0.00015 }))
});

// Minor losses on every link, to prove the k term enters both h and dh/dQ.
const twoLoopMinorLosses = Object.assign({}, twoLoopGrid, {
	name: 'two-loop-minor-losses',
	links: twoLoopGrid.links.map(l => Object.assign({}, l, { k: 2.5 }))
});

// Single emitter with a closed-form answer: one reservoir, one pipe, one emitter
// junction, no demand. Solve r Q^n = H_R - (z + (Q/C)^(1/gamma)) numerically by
// bisection in the checker -- an independent root-find, not the solver's Newton.
const emitterCase = {
	name: 'emitter',
	method: 'hw',
	emitterExponent: 0.5,
	nodes: [
		{ id: 'R', type: 'reservoir', head: 80 },
		{ id: 'J', type: 'junction', elev: 20, demand: 0, emitter: 0.002 }
	],
	links: [pipe('P', 'R', 'J', 600, 0.15, 130)]
};

// A closed link that would otherwise carry flow, plus a node reachable only
// through it. The closed link must be excluded from the SOLVE but its node must
// still be reported as unreachable rather than silently producing a number.
const closedLinkCase = {
	name: 'closed-link-isolates-node',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 100 },
		{ id: 'A', type: 'junction', elev: 0, demand: 20 * M3S_PER_LPS },
		{ id: 'B', type: 'junction', elev: 0, demand: 5 * M3S_PER_LPS }
	],
	links: [
		pipe('L1', 'R', 'A', 300, 0.25, 130),
		Object.assign(pipe('L2', 'A', 'B', 300, 0.2, 130), { status: 'closed' })
	]
};

// A TANK as the only source, plus a second one being fed from it (ROADMAP Task 248).
//
// WHAT THIS CASE CAN AND CANNOT CATCH, measured rather than assumed (2026-08-14). Both tanks'
// initial levels sit deliberately close to their maxima, so a LEVEL written at the wrong scale
// lands outside the min/max band and EPANET refuses the network outright -- verified by writing
// level*1000 on purpose, which turns this line into "EPANET Error 110".
//
// It does NOT catch a wrong tank DIAMETER, and that is worth stating plainly because the diameter
// is the likelier mistake: in an .inp under LPS a PIPE diameter is in MILLIMETRES and a TANK
// diameter is in METRES, the same word in two units three sections apart in one file. Writing
// diameter*1000 on purpose leaves this case PASSING to the last digit, because a steady-state
// solve never reads a tank diameter at all. Only an .inp round trip can see it, which is exactly
// what dev/lpn-spike/tank-harness.js exists to do -- do not let this case stand in for it.
//
// The physics being asserted here: T1's surface is elev + level = 60 + 8 = 68 m, T2's is
// 20 + 9 = 29 m, and both are FIXED for this instant. So this is a two-fixed-head network and the junction
// between them sits wherever the two pipes balance. If a tank were quietly treated as a reservoir
// at its BOTTOM elevation instead of its surface, every head here moves by the level.
const tankCase = {
	name: 'tanks-as-fixed-heads',
	method: 'hw',
	nodes: [
		{ id: 'T1', type: 'tank', elev: 60, head: 68, level: 8, minLevel: 0, maxLevel: 10, diameter: 15 },
		{ id: 'J1', type: 'junction', elev: 10, demand: 25 * M3S_PER_LPS },
		{ id: 'T2', type: 'tank', elev: 20, head: 29, level: 9, minLevel: 0.5, maxLevel: 9.5, diameter: 12 }
	],
	links: [
		pipe('L1', 'T1', 'J1', 600, 0.3, 130),
		pipe('L2', 'J1', 'T2', 400, 0.25, 130)
	]
};

// A THROTTLE VALVE (TCV) IN BOTH ENGINES -- ROADMAP Task 248 phase 2.
//
// This is the one valve type both engines solve, so it is the only one validate_epanet.js can
// compare. A TCV is a zero-length link whose whole head loss is k V^2 / 2g with k = its SETTING,
// so the two engines agreeing here is evidence about exactly two things: that lpnToInp writes the
// diameter in MILLIMETRES (a valve diameter follows the PIPE convention, not the tank's) and that
// the setting lands in the SETTING column rather than the minor-loss column beside it.
//
// WHAT IT CANNOT SEE, and the reason dev/lpn-spike/valve-harness.js exists beside it: both engines
// here read the SAME model object, so a setting converted into the wrong unit on the way to the
// file is converted wrongly for EPANET only -- but a TCV setting is DIMENSIONLESS, so there is no
// conversion to get wrong on this case at all. A PRV's setting is a pressure and an FCV's is a
// flow, and neither type can appear in this suite because the native solver refuses them by
// design. So the two conversions most likely to be wrong are invisible to every engine comparison
// there is, and only a round trip through the file text can check them.
//
// V1 sits between two junctions on purpose: an active valve may not touch a fixed-head node
// (EPANET input error 219, and EngCalcs.lpnDiagnose's 'valve-on-fixed-head'), and while a TCV is
// exempt from that rule, keeping the case to the stricter placement means it stays valid if its
// type is ever changed in a future test.
function valve(id, from, to, valveType, setting, diameter, k) {
	return {
		id, type: 'valve', valveType, from, to,
		length: 0, diameter, roughness: 150,
		setting, k: k || 0, status: 'open'
	};
}

const valveTcvCase = {
	name: 'throttle-valve',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
		{ id: 'J1', type: 'junction', elev: 10, demand: 0 },
		{ id: 'J2', type: 'junction', elev: 10, demand: 0 },
		{ id: 'J3', type: 'junction', elev: 5, demand: 40 * M3S_PER_LPS }
	],
	links: [
		pipe('L1', 'R', 'J1', 400, 0.25, 130),
		valve('V1', 'J1', 'J2', 'TCV', 8, 0.25),
		pipe('L2', 'J2', 'J3', 300, 0.25, 130)
	]
};

const noReservoirCase = {
	name: 'no-fixed-head',
	method: 'hw',
	nodes: [
		{ id: 'A', type: 'junction', elev: 0, demand: 10 * M3S_PER_LPS },
		{ id: 'B', type: 'junction', elev: 0, demand: 10 * M3S_PER_LPS }
	],
	links: [pipe('L1', 'A', 'B', 300, 0.25, 130)]
};

const unreachableCase = {
	name: 'unreachable-node',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 100 },
		{ id: 'A', type: 'junction', elev: 0, demand: 20 * M3S_PER_LPS },
		{ id: 'X', type: 'junction', elev: 0, demand: 5 * M3S_PER_LPS }
	],
	links: [pipe('L1', 'R', 'A', 300, 0.25, 130)]
};

// Every demand zero. The whole network sits at reservoir head with zero flow --
// the case that divides by zero unless the low-flow linearization is right, and
// the state every freshly drawn network starts in.
const zeroDemandCase = {
	name: 'zero-demand',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 100 },
		{ id: 'A', type: 'junction', elev: 0, demand: 0 },
		{ id: 'B', type: 'junction', elev: 0, demand: 0 },
		{ id: 'C', type: 'junction', elev: 0, demand: 0 }
	],
	links: [
		pipe('L1', 'R', 'A', 300, 0.25, 130),
		pipe('L2', 'A', 'B', 300, 0.20, 130),
		pipe('L3', 'B', 'C', 300, 0.20, 130),
		pipe('L4', 'C', 'A', 300, 0.20, 130)
	]
};

// A pump on a real network, with a curve fitted the way the UI fits one.
//
// THIS CASE EXISTS BECAUSE ITS ABSENCE SHIPPED A BUG. validate_epanet.js had no pump when the
// EPANET adapter first landed, so nothing caught that EPANET's 3-point curve fit only recovers
// the shutoff head when the FIRST sample sits at Q = 0. Tom found it in the browser instead.
// A loop around the pump, so the pump is not the only path to the demand -- a pump feeding a
// fixed demand through a single path has no degrees of freedom left and is a poor test.
const pumpCase = {
	name: 'pump-with-curve',
	method: 'hw',
	nodes: [
		{ id: 'R', type: 'reservoir', head: 10 },
		{ id: 'J1', type: 'junction', elev: 0, demand: 0 },
		{ id: 'J2', type: 'junction', elev: 0, demand: 20 * M3S_PER_LPS },
		{ id: 'J3', type: 'junction', elev: 0, demand: 10 * M3S_PER_LPS }
	],
	links: [
		pipe('P1', 'R', 'J1', 100, 0.25, 130),
		{ id: 'PU', type: 'pump', from: 'J1', to: 'J2', status: 'open',
		  // H = h0 - a Q^b, the same fit recomputePumpCurve() produces from a single
		  // design point of 50 L/s at 30 m (see EngCalcs.lpnPumpFromCurve).
		  h0: 40.0002, a: 4000.08, b: 2,
		  // A PUMP STILL NEEDS A DIAMETER, even though no head-loss term uses it. The solver
		  // seeds every link's initial flow from 0.3 * pi * d^2 / 4 (lpnSolve), so a pump
		  // without one starts at NaN and the whole network solves to NaN while reporting
		  // ok: true and converged: false. assembleModel() always supplies it, so the app is
		  // fine; a hand-written test case is where this bites. Cost an hour on 2026-08-09.
		  diameter: 0.25 },
		pipe('P2', 'J2', 'J3', 200, 0.20, 130),
		pipe('P3', 'J3', 'J1', 250, 0.20, 130)
	]
};

module.exports = {
	pumpCase,
	twoLoopAnalytic,
	twoLoopGrid,
	twoLoopManning,
	twoLoopDw,
	twoLoopMinorLosses,
	emitterCase,
	closedLinkCase,
	tankCase,
	valveTcvCase,
	noReservoirCase,
	unreachableCase,
	zeroDemandCase
};

// A TANK FILLS ON THE SCHEDULE ITS OWN SHAPE GIVES (ROADMAP Task 587).
//
//   node dev/lpn-spike/tank-volume-curve-harness.js
//
// A `[TANKS]` row states a vessel's shape twice: as a diameter, which is a cylinder, and as the id
// of a `[CURVES]` entry giving volume against level. Since Task 586 the curve is a document object,
// imported whole and exported byte for byte; until Task 587 it reached no engine, so every tank
// filled on a cylinder's schedule whatever its file said. That is invisible at a single instant --
// the water surface is the level the file gives either way -- so only a RUN can catch it, which is
// what this file is.
//
// WHY THE ARITHMETIC IS HAND-CHECKABLE AND DELIBERATELY SO. The network is one junction pushing a
// CONSTANT 10 L/s into one tank through a short fat pipe. A negative demand is a fixed inflow at any
// head, so the volume added in six hours is 0.010 x 21600 = 216 m3 and nothing about the hydraulics
// can change it. Everything else is the level-to-volume relationship, which is the whole question:
//
//   As a CYLINDER of 10 m diameter:  A = pi/4 x 10^2 = 78.5398 m2
//                                    216 / 78.5398 = 2.7503 m rise, from 1.00 m to 3.7503 m.
//
//   As the STEPPED curve below:      0 m -> 0 m3, 2 m -> 20 m3, 10 m -> 420 m3
//                                    (10 m2 of plan area up to 2 m, 50 m2 above it)
//                                    1.00 m is 10 m3; 10 + 216 = 226 m3; 226 is 206 above the
//                                    20 m3 at 2 m, and 206 / 50 = 4.12 m, so 6.12 m.
//
// Two and a third metres apart on a tank six metres deep. Both stay inside 0..10 m, so neither
// answer is a clamp at a limit, and the curve is piecewise linear so EPANET's own interpolation is
// exact rather than approximate -- there is no tolerance argument to have about the shape itself.
//
// THE THIRD CASE IS THE UNIT ONE AND IT IS WHY THIS FILE HAS THREE. A volume curve's abscissa is a
// LEVEL and its ordinate is a VOLUME, both in the file's own units, and this page has no volume
// selector at all: the ordinate's factor is the abscissa's CUBED, which is EPANET's own pairing
// (cubic feet under US flow units, cubic metres under SI). So the same physical tank and the same
// physical curve are stated a second time in FEET and CUBIC FEET, and the two runs must agree in
// metres. A cubic foot mistaken for a cubic metre is a factor of 35.3 and this is what sees it.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

const FT = 0.3048;
const HOURS = 6;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

// The page's own edge, in miniature: js/looped-network.js's assembleModel() converts display units
// to SI at exactly this boundary and hands js/lpn-time.js the same `toSI`. `f` is the document's
// Elevation/Head unit in metres -- 1 for a metric document, 0.3048 for one stated in feet.
function converter(f) {
	const factor = { lpn_u_elevhead: f, lpn_u_flow: 1, lpn_u_pressure: 1, lpn_u_diameter: 1, lpn_u_length: 1 };
	return (v, id) => (typeof v === 'number' ? v * factor[id] : v);
}

// The DOCUMENT, in whatever unit `f` names -- levels, the tank diameter and the curve's abscissa in
// that unit, and the curve's ordinate in its cube. `curve` is null for the cylinder case.
function buildDoc(f, withCurve) {
	const L = (m) => m / f;                      // metres -> the document's unit
	const V = (m3) => m3 / (f * f * f);          // cubic metres -> its cube
	const tank = {
		id: 'T', type: 'tank', elev: 0, _level: L(1), minLevel: 0, maxLevel: L(10),
		tankDiameter: L(10)
	};
	if (withCurve) { tank.volCurve = 'SHAPE'; }
	return {
		nodes: [{ id: 'N1', type: 'junction', elev: 0, _demand: -0.010 }, tank],
		links: [{ id: 'P1', type: 'pipe', from: 'N1', to: 'T' }],
		curves: withCurve ? [{
			id: 'SHAPE', kind: 'volume',
			points: [[0, 0], [L(2), V(20)], [L(10), V(420)]]
		}] : [],
		patterns: [], controls: [],
		times: { duration: HOURS * 3600, hydraulicStep: 3600, patternStep: 3600,
			patternStart: 0, reportStep: 3600, reportStart: 0, startClock: 0 }
	};
}

// The SOLVER-SIDE model, built the way assembleModel() builds one: every length through toSI, then
// the one line that hangs the clock and the tank shapes on it.
function buildModel(doc, f) {
	const toSI = converter(f);
	const model = {
		method: 'hw', visc: 1.007e-6,
		nodes: doc.nodes.map((n) => (n.type === 'tank'
			? {
				id: n.id, type: 'tank',
				elev: toSI(n.elev, 'lpn_u_elevhead'),
				head: toSI(n.elev + n._level, 'lpn_u_elevhead'),
				level: toSI(n._level, 'lpn_u_elevhead'),
				minLevel: toSI(n.minLevel, 'lpn_u_elevhead'),
				maxLevel: toSI(n.maxLevel, 'lpn_u_elevhead'),
				diameter: toSI(n.tankDiameter, 'lpn_u_elevhead')
			}
			: {
				id: n.id, type: 'junction', elev: toSI(n.elev, 'lpn_u_elevhead'),
				demand: n._demand, demandBase: n._demand, demandPattern: null
			})),
		// Short and fat on purpose: the loss is negligible, so the inflow is the demand and the
		// answer is about the tank's shape and nothing else.
		links: doc.links.map((l) => ({ id: l.id, type: 'pipe', from: l.from, to: l.to,
			diameter: 0.3, roughness: 130, length: 10, status: 'open', k: 0 }))
	};
	model.time = EngCalcs.lpnTimeModelBlock(doc, toSI);
	EngCalcs.lpnTankVolumeAttach(model, doc, toSI);
	return model;
}

(async function () {
	console.log('THE MODEL SIDE: what the curve becomes on its way to the engine');

	const cylModel = buildModel(buildDoc(1, false), 1);
	const siModel = buildModel(buildDoc(1, true), 1);
	const usModel = buildModel(buildDoc(FT, true), FT);

	const cylTank = cylModel.nodes.find((n) => n.type === 'tank');
	const siTank = siModel.nodes.find((n) => n.type === 'tank');
	const usTank = usModel.nodes.find((n) => n.type === 'tank');

	check(!cylTank.volCurve && !cylTank.volCurveSI,
		'a tank naming no curve carries none: the cylinder path is untouched');
	check(siTank.volCurve === 'SHAPE' && siTank.volCurveSI.length === 3,
		`a tank naming one carries all three of its points (${siTank.volCurveSI && siTank.volCurveSI.length})`);
	// The document said feet and cubic feet; SI is metres and cubic metres, and the two documents
	// describe the same vessel. 1e-9 is float noise on a 420 m3 number, not a tolerance.
	let worstPt = 0;
	for (let i = 0; i < 3; i++) {
		worstPt = Math.max(worstPt,
			Math.abs(usTank.volCurveSI[i][0] - siTank.volCurveSI[i][0]),
			Math.abs(usTank.volCurveSI[i][1] - siTank.volCurveSI[i][1]));
	}
	check(worstPt < 1e-9,
		`the feet-and-cubic-feet document converts to the same curve (worst ${worstPt.toExponential(2)})`);
	check(near(siTank.volCurveSI[2][1], 420, 1e-9),
		`the top of the curve is 420 m3 (${siTank.volCurveSI[2][1]})`);

	// A curve EPANET would refuse is left off rather than repaired, and the document keeps it.
	const badDoc = buildDoc(1, true);
	badDoc.curves[0].points = [[0, 0], [2, 20], [1, 400]];   // x not increasing
	const badModel = buildModel(badDoc, 1);
	check(!badModel.nodes.find((n) => n.type === 'tank').volCurve,
		'a curve whose level column does not increase is left off the model');
	check(badDoc.curves[0].points[2][0] === 1 && badDoc.curves[0].points[2][1] === 400,
		"and the document's own points are not touched by having been refused");

	console.log('THE FILE: the eighth column and the rows it names');
	const cylText = EngCalcs.lpnToInp(cylModel, { eps: true }).inp;
	const siText = EngCalcs.lpnToInp(siModel, { eps: true }).inp;
	const cylRow = cylText.split('\n').find((r) => /^\s*T\s/.test(r) && !/;/.test(r));
	const siRow = siText.split('\n').find((r) => /^\s*T\s/.test(r) && !/;/.test(r));
	check(cylRow.trim().split(/\s+/).length === 7,
		`a cylinder still writes seven columns (${cylRow.trim()})`);
	check(siRow.trim().split(/\s+/).length === 8 && /V_SHAPE\s*$/.test(siRow),
		`a shaped tank writes the eighth (${siRow.trim()})`);
	check(/\n\s*V_SHAPE\s+0\s+0\b/.test(siText) && /\n\s*V_SHAPE\s+10\s+420\b/.test(siText),
		'and the curve itself is in [CURVES], in metres and cubic metres');
	check(!/V_SHAPE/.test(cylText), 'the cylinder file names no volume curve at all');

	console.log('THE RUN: six hours of 10 L/s into the same tank, three ways');
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));

	async function levelAfter(model, what) {
		const run = await EngCalcs.lpnEpanetRun(model);
		check(run.ok, `${what}: the run completed`);
		if (!run.ok) { return null; }
		const last = run.frames[run.frames.length - 1];
		check(last.t === HOURS * 3600, `${what}: the last frame is at ${HOURS} h (${last.t} s)`);
		return last.levels.T;
	}

	const cylLevel = await levelAfter(cylModel, 'cylinder');
	const siLevel = await levelAfter(siModel, 'shaped, metres');
	const usLevel = await levelAfter(usModel, 'shaped, feet');

	// 216 m3 / 78.5398 m2 on top of 1.00 m. The tolerance is EPANET's own step arithmetic, not a
	// hedge: the inflow is constant and the area is constant, so this one is exact algebra.
	const cylWant = 1 + 216 / (Math.PI * 25);
	check(near(cylLevel, cylWant, 0.005),
		`cylinder: ${cylLevel.toFixed(4)} m, hand-computed ${cylWant.toFixed(4)} m`);
	// 226 m3 on the stepped curve: 2 m plus (226 - 20) / 50.
	const curveWant = 2 + (226 - 20) / 50;
	check(near(siLevel, curveWant, 0.005),
		`shaped: ${siLevel.toFixed(4)} m, hand-computed ${curveWant.toFixed(4)} m`);
	// THE ASSERTION THE WHOLE FILE IS FOR. Before Task 587 these two were the same number.
	check(Math.abs(siLevel - cylLevel) > 2,
		`the two shapes end ${Math.abs(siLevel - cylLevel).toFixed(4)} m apart`);
	// And the same vessel stated in feet reaches the same metres.
	check(near(usLevel, siLevel, 0.005),
		`feet and metres agree: ${usLevel.toFixed(4)} m against ${siLevel.toFixed(4)} m`);

	// THE COUPLING A HAND-BUILT DOCUMENT WOULD HOLD CONSTANT, and the reason this section exists:
	// everything above spells the fields out itself, so it would pass just as happily if the
	// importer called them something else. A real `.inp` is the only thing that can say the eighth
	// `[TANKS]` column, `doc.curves` and the reader agree on one set of names.
	console.log('THE IMPORTER: the names really do meet');
	const parsed = EngCalcs.lpnInpParse([
		'[JUNCTIONS]', ' N1  0  0', '',
		'[TANKS]', ';ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  MinVol  VolCurve',
		' T  0  1  0  10  10  0  SHAPE', '',
		'[PIPES]', ' P1  N1  T  10  300  130  0  Open', '',
		'[CURVES]', ';VOLUME: the vessel', ' SHAPE  0  0', ' SHAPE  2  20', ' SHAPE  10  420', '',
		'[OPTIONS]', ' Units  LPS', ' Headloss  H-W', ''
	].join('\n'));
	const inTank = parsed.nodes.find((n) => n.type === 'tank');
	const inCurve = (parsed.curves || []).find((c) => c.id === 'SHAPE');
	check(inTank && inTank.volCurve === 'SHAPE',
		`the eighth column reaches the tank as volCurve (${inTank && inTank.volCurve})`);
	check(inCurve && inCurve.kind === 'volume' && inCurve.points.length === 3,
		`and the curve arrives typed, with its points (${inCurve && inCurve.kind}, ${inCurve && inCurve.points.length})`);
	// The document js/looped-network.js builds out of that, in the fields it builds them in.
	const impDoc = {
		nodes: [{ id: 'T', type: 'tank', volCurve: inTank.volCurve }],
		curves: parsed.curves, patterns: [], controls: [], times: parsed.times
	};
	const impModel = { nodes: [{ id: 'T', type: 'tank' }], links: [] };
	EngCalcs.lpnTankVolumeAttach(impModel, impDoc, converter(1));
	check(impModel.nodes[0].volCurve === 'SHAPE' && impModel.nodes[0].volCurveSI.length === 3,
		'an imported tank reaches the model carrying the curve the file gave it');

	console.log(failures ? `\n${failures} FAILED` : '\nall passed');
	process.exit(failures ? 1 : 0);
}());

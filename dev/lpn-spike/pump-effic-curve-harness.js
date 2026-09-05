// A PUMP'S OWN EFFICIENCY CURVE, FROM THE FILE TO THE ENGINE AND BACK. Run with:
//   node dev/lpn-spike/pump-effic-curve-harness.js
//
// ROADMAP Task 582. EPANET's `[ENERGY]` may say `PUMP <id> EFFIC <curve>`, naming a `[CURVES]`
// entry whose abscissa is a FLOW and whose ordinate is a percent. Before this task js/lpn-inp.js
// read those points into a local map, used them for nothing and dropped them, which cost two
// different things:
//
//   1. **THE EXPORTED FILE WAS ONE EPANET REJECTS.** `[ENERGY]` was carried verbatim, so the row
//      naming the curve came back out; the curve did not. An `.inp` whose EFFIC names an undefined
//      curve is refused at the door.
//   2. **THE MONEY WAS WRONG BY THE RATIO OF TWO EFFICIENCIES.** With no curve to hand the engine,
//      such a pump ran at the network's global efficiency, so its kW, its kWh and its cost were all
//      off and nothing on screen said which number was doing the work.
//
// **THE TRAP THIS FILE EXISTS FOR IS THE FLOW AXIS.** A curve's first column is a flow in the
// FILE's unit -- GPM in every US model anybody will open -- and the engine input js/lpn-epanet.js
// writes is L/s always. A missing conversion does not throw and does not look wrong: the curve
// simply sits a thousand times too narrow, every operating point falls past its last node, and
// EPANET quietly pins the efficiency at the end value. Section 3 is anchored so that failure is a
// DIFFERENT NUMBER from the right one, and section 4 states the GPM factor against the file's own
// tokens.
//
// **WHAT IS NOT WIRED YET, AND IT IS SAID HERE RATHER THAN LEFT TO BE DISCOVERED.** The document
// carries the curve and writes it back (sections 1 and 2), and lpnToInp() emits it and its EFFIC
// row (sections 3 to 5). The one link still missing is `docEnergy()` in js/looped-network.js, which
// must put `efficCurves: EngCalcs.lpnEfficCurves(doc.inpSections, <flow unit to m3/s>)` on the
// model it hands the engine. Until it does, the engine leg here is exercised by this harness and by
// nothing else, and the page still runs such a pump at the global efficiency.

const path = require('path');
const { ROOT, NODE_ENGINE_URL, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}
function head(t) { console.log('\n' + t); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// **THE FIXTURE IS SYNTHETIC AND HAS TO BE.** Net1, Net2 and Net3 all state a single
// `Global Efficiency` and no curve at all, so there is no EPA model that exercises this at all --
// which is itself why the feature could sit unbuilt without any harness going red.
//
// Written in the exporter's own column style so section 2 can compare the WHOLE FILE rather than a
// section of it: a byte-identical round trip is the acceptance criterion this repo holds an `.inp`
// to, and a partial comparison is the one that lets a lost line through.
const FIXTURE = [
	'[TITLE]',
	'effic.inp',
	'',
	'[JUNCTIONS]',
	' J1\t100\t500',
	'',
	'[RESERVOIRS]',
	' R1\t0',
	'',
	'[PUMPS]',
	' P1\tR1\tJ1\tHEAD C1',
	'',
	'[CURVES]',
	' C1\t0\t300',
	' C1\t1000\t200',
	' E1\t200\t40',
	' E1\t500\t70',
	' E1\t800\t55',
	'',
	'[ENERGY]',
	' Global Efficiency\t75',
	' PUMP\tP1\tEFFIC\tE1',
	'',
	'[TIMES]',
	' Duration\t0:00',
	' Hydraulic Timestep\t1:00',
	' Pattern Timestep\t1:00',
	' Pattern Start\t0:00',
	' Report Timestep\t1:00',
	' Report Start\t0:00',
	' Start ClockTime\t0:00',
	'',
	'[OPTIONS]',
	' Units\tGPM',
	' Headloss\tH-W',
	'',
	'[COORDINATES]',
	' J1\t10\t10',
	' R1\t0\t0',
	'',
	'[END]',
	''
].join('\n');

(async function () {

	// =========================================================================================
	head('1. The efficiency curve survives the read, and the head curve is still not carried');
	// =========================================================================================
	const parsed = EngCalcs.lpnInpParse(FIXTURE);
	check(parsed.ok, 'the fixture parses as an .inp');
	const carried = (parsed.inpSections || {}).CURVES || [];
	check(carried.length === 3, `three [CURVES] lines are carried: ${carried.length}`);
	check(carried.every((ln) => /^\s*E1\b/.test(ln)),
		`and every one of them is E1's, not C1's: ${JSON.stringify(carried)}`);
	// **THE FILE'S OWN CHARACTERS, TABS INCLUDED.** A carried line that had been re-spaced would
	// still look right in a diff of tokens and would fail the byte test in section 2.
	check(carried[1] === ' E1\t500\t70', `the middle line is the file's own text: ${JSON.stringify(carried[1])}`);
	// A pump's HEAD curve is redrawn by the exporter from the document's own points, so carrying its
	// text as well would write the section twice. This is the half of the selection rule that has no
	// symptom until somebody adds a second kind of curve.
	check(!carried.some((ln) => /\bC1\b/.test(ln)), 'the pump head curve is excluded from the carry');
	// And the [ENERGY] row itself is still read the way Task 566 reads it.
	const energy = EngCalcs.lpnEnergyParse((parsed.inpSections || {}).ENERGY || []);
	check(energy.effic.P1 === 'E1', `the EFFIC row still names the curve: ${JSON.stringify(energy.effic.P1)}`);

	// =========================================================================================
	head('2. Import then export is BYTE-IDENTICAL, the whole file');
	// =========================================================================================
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'effic.inp');
	check(((doc.inpSections || {}).CURVES || []).length === 3,
		'the carry reaches the saved document, so it survives save and reopen');
	const out = EngCalcs.lpnExportInp(doc);
	check(out.ok, `the document exports: ${JSON.stringify(out.error)}`);
	if (out.ok) {
		// Not "within tolerance" -- identical. The one number the user did not edit is every number
		// in this file.
		check(out.inp === FIXTURE, 'the exported text equals the imported text, character for character');
		if (out.inp !== FIXTURE) {
			const a = FIXTURE.split('\n'), b = out.inp.split('\n');
			for (let i = 0; i < Math.max(a.length, b.length); i++) {
				if (a[i] !== b[i]) { console.log(`      line ${i + 1}: ${JSON.stringify(a[i])} vs ${JSON.stringify(b[i])}`); }
			}
		}
		// **AND THE SECTION IS WRITTEN ONCE.** The carry rides in the bag that `carriedRest()`
		// empties after [OPTIONS]; without CURVES on the placed list the same three lines would be
		// written a second time under a second header, and EPANET reads the later one.
		check((out.inp.match(/^\[CURVES\]$/gm) || []).length === 1,
			`[CURVES] appears exactly once: ${(out.inp.match(/^\[CURVES\]$/gm) || []).length}`);
	}

	// **THE ABSCISSA MOVES WHEN THE FLOW UNIT MOVES.** A project working in m3/s exports under LPS,
	// which is a real conversion, and a curve carried verbatim through it would state its flows in
	// the old unit under the new keyword -- the same silent corruption the head curves go through
	// `curveNum()` to avoid.
	{
		const si = JSON.parse(JSON.stringify(doc));
		si.units = Object.assign({}, si.units, { lpn_u_flow: 'm3ps', lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'm', lpn_u_pressure: 'mh2o' });
		const conv = EngCalcs.lpnExportInp(si);
		check(conv.ok, `the converted export runs: ${JSON.stringify(conv.error)}`);
		if (conv.ok) {
			const line = (conv.inp.split('\n').filter((l) => /^\s*E1\b/.test(l)))[1] || '';
			// 500 m3/s is 500000 L/s. The number is enormous because the fixture's numbers are, and
			// that is the point: nothing here rescales a curve to look sensible.
			check(/^\s*E1\t500000\t70$/.test(line), `E1's middle point converts with the flow unit: ${JSON.stringify(line)}`);
		}
	}

	// =========================================================================================
	head('3. THE FLOW AXIS: the engine input carries the curve in L/s and the EFFIC row with it');
	// =========================================================================================
	require(ROOT + 'js/lpn-patterns.js');
	require(ROOT + 'js/lpn-epanet.js');
	require(ROOT + 'js/lpn-time.js');

	// The model js/looped-network.js hands the engine: SI throughout, so a curve's flow is in m3/s
	// exactly as a pipe's is. 0.02, 0.04 and 0.06 m3/s are 20, 40 and 60 L/s.
	const CURVE_SI = [[0.02, 40], [0.04, 70], [0.06, 55]];
	function pumpModel(energy) {
		return {
			nodes: [
				{ id: 'R', type: 'reservoir', head: 0, elev: 0 },
				{ id: 'J', type: 'junction', elev: 0, demand: 0.05 }
			],
			links: [
				{ id: 'PU', type: 'pump', from: 'R', to: 'J', h0: 60, a: 2000, b: 2, status: 'open' }
			],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			energy: Object.assign({ globalEfficiency: 75, effic: {}, price: {}, pattern: {} }, energy || {}),
			time: {
				times: { duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 0 },
				patterns: [], controls: [], warnings: []
			}
		};
	}
	const withCurve = pumpModel({ effic: { PU: 'E1' }, efficCurves: { E1: CURVE_SI } });
	const built = EngCalcs.lpnToInp(withCurve);
	const efRows = (built.inp.match(/^ EF_PU[^\n]*/gm) || []);
	check(efRows.length === 3, `the engine input carries three EF_PU rows: ${efRows.length}`);
	check(/ EF_PU\s+20\s+40/.test(built.inp),
		`its first point is 20 L/s at 40%: ${JSON.stringify(efRows[0])}`);
	check(/ EF_PU\s+40\s+70/.test(built.inp) && / EF_PU\s+60\s+55/.test(built.inp),
		'and the other two points are 40 L/s at 70% and 60 L/s at 55%');
	check(/ PUMP\s+PU\s+EFFIC\s+EF_PU/.test(built.inp),
		'the [ENERGY] section states the EFFIC row that names it');
	// **THE NAME IS OURS, NOT THE DOCUMENT'S, AND A COLLISION IS THE REASON.** The head curves this
	// writer emits are `C_<pumpid>`; a document whose efficiency curve was called `C_PU` would
	// otherwise overwrite this pump's own head curve and quietly change how much head it makes.
	{
		const collide = EngCalcs.lpnToInp(pumpModel({ effic: { PU: 'C_PU' }, efficCurves: { C_PU: CURVE_SI } }));
		const headPoints = (collide.inp.match(/ C_PU\s+\S+\s+\S+/g) || []);
		check(headPoints.length === 3, `a curve named C_PU cannot displace the head curve: ${headPoints.length} C_PU rows`);
		check(/ PUMP\s+PU\s+EFFIC\s+EF_PU/.test(collide.inp), 'the efficiency curve is renamed EF_PU instead');
	}
	// **AND A PUMP THAT DID NOT GO OUT AS A PUMP GETS NO ROW.** A curveless one becomes a pipe, and
	// an [ENERGY] row naming a link that is not a pump is another input EPANET refuses.
	{
		const bare = pumpModel({ effic: { PU: 'E1' }, efficCurves: { E1: CURVE_SI } });
		bare.links[0].h0 = 0; bare.links[0].a = 0;
		const b = EngCalcs.lpnToInp(bare);
		check(!/EFFIC/.test(b.inp), 'a curveless pump, written out as a pipe, gets no EFFIC row');
	}

	// =========================================================================================
	head('4. THE FILE\'S OWN UNIT: a GPM curve reaches the engine as litres per second');
	// =========================================================================================
	// The document above is a GPM file, so its curve's abscissa is in gallons per minute. This is the
	// conversion the whole task turns on, and it is stated against the file's own tokens rather than
	// against a number typed here twice.
	const GPM_TO_SI = 1 / EngCalcs.unitFactor('gpm');
	const fromDoc = EngCalcs.lpnEfficCurves(doc.inpSections, GPM_TO_SI);
	check(!!fromDoc.E1 && fromDoc.E1.length === 3, 'the carried lines read back as three points');
	if (fromDoc.E1) {
		check(fromDoc.E1[0][1] === 40 && fromDoc.E1[2][1] === 55,
			'the ordinate is a percent and crosses untouched');
		// 500 gal/min x 3.785411784 L/gal / 60 s = 31.5450982 L/s. Arithmetic, not a fixture.
		const lps = fromDoc.E1[1][0] * 1000;
		check(Math.abs(lps - 500 * 3.785411784 / 60) < 1e-9,
			`500 gpm arrives as ${lps.toFixed(7)} L/s against 3.785411784/60 x 500 = ${(500 * 3.785411784 / 60).toFixed(7)}`);
		// And a factor of 1 -- the mistake this is guarding -- would have left it at 500.
		check(Math.abs(EngCalcs.lpnEfficCurves(doc.inpSections, 1).E1[1][0] - 500) < 1e-12,
			'with no factor the same line reads 500, which is what a missing conversion looks like');
	}
	// End to end: those SI points through the engine writer come out in L/s.
	const gpmBuilt = EngCalcs.lpnToInp(pumpModel({ effic: { PU: 'E1' }, efficCurves: fromDoc }));
	check(/ EF_PU\s+31\.5450982\s+70/.test(gpmBuilt.inp),
		`the engine input states 31.5450982 L/s for the 500 gpm point: ${JSON.stringify((gpmBuilt.inp.match(/^ EF_PU[^\n]*/gm) || [])[1])}`);

	// =========================================================================================
	head('5. THE ANSWER: EPANET reports the curve\'s own efficiency, and the power that follows it');
	// =========================================================================================
	await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);
	const run = await EngCalcs.lpnEpanetRun(withCurve, { sliceMs: 100000 });
	check(run.ok && !!run.energy, `the network ran: ${JSON.stringify(run.error || '')}`);
	if (run.ok && run.energy) {
		const row = run.energy.pumps[0], f = run.frames[0];
		const q = Math.abs(f.flows.PU);
		// The junction draws 0.05 m3/s and the pump is the only way in, so the working point is
		// 50 L/s exactly. **THAT IS WHAT MAKES THE EFFICIENCY HAND-COMPUTABLE:** 50 L/s sits half
		// way between the curve's 40 L/s / 70% and 60 L/s / 55% nodes, so a linear interpolation
		// gives 62.5% and no other number.
		check(Math.abs(q - 0.05) < 1e-6, `the pump moves the demand: ${(q * 1000).toFixed(4)} L/s`);
		check(Math.abs(row.avgEfficiency * 100 - 62.5) < 0.01,
			`the reported efficiency is the curve's own 62.5%: ${(row.avgEfficiency * 100).toFixed(4)}%`);
		// **AND 62.5 IS NOT 75 AND NOT 55.** The global efficiency this model also states is 75, so
		// a run that ignored the curve reports 75; a run that lost the flow-axis conversion puts
		// 50 L/s past the curve's last node and EPANET pins it at 55. Three distinguishable numbers,
		// which is the whole reason the fixture's ordinates are what they are.
		check(Math.abs(row.avgEfficiency * 100 - 75) > 1,
			'it is not the global efficiency the same document states');
		const RHO_G = 9806.65;
		const dh = f.heads.J - f.heads.R;
		const analyticKw = RHO_G * q * dh / 0.625 / 1000;
		const err = Math.abs(row.peakKw - analyticKw) / analyticKw;
		// 0.1% is EPANET's own 62.4 lb/ft3 against standard gravity, exactly as
		// energy-anchor-harness.js section 4 measures it. A real error in the efficiency is 20%.
		check(err < 0.001,
			`and the power follows it: engine ${row.peakKw.toFixed(4)} kW against rho g Q H / 0.625 = ${analyticKw.toFixed(4)} kW (${(err * 100).toFixed(3)}%)`);
		// The same case with the curve taken away must report the global efficiency instead, which
		// is what says the curve is doing the work rather than something else in the model.
		const plain = await EngCalcs.lpnEpanetRun(pumpModel({}), { sliceMs: 100000 });
		check(plain.ok && Math.abs(plain.energy.pumps[0].avgEfficiency * 100 - 75) < 0.01,
			`without the curve the same network reports 75%: ${(plain.energy.pumps[0].avgEfficiency * 100).toFixed(4)}%`);
		// A worse efficiency is MORE power for the same water, and the ratio is the ratio of the
		// two efficiencies with nothing else in it: 75/62.5 = 1.2.
		check(Math.abs(row.peakKw / plain.energy.pumps[0].peakKw - 75 / 62.5) < 0.005,
			`and 62.5% draws 1.2x the power 75% does: ${(row.peakKw / plain.energy.pumps[0].peakKw).toFixed(5)}`);
	}

	console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All checks passed.'));
	process.exit(failures ? 1 : 0);
}());

// THE ACCEPTANCE TEST FOR PUMP ENERGY AND COST -- ROADMAP Task 566, dev/pump-energy.md. Run with:
//
//   node dev/lpn-spike/energy-anchor-harness.js
//
// **THE ANSWER HERE IS MONEY, SO EVERY ASSERTION BELOW SAYS WHAT KIND OF ANCHOR IT IS.** There are
// three kinds in this file and they are not equally strong:
//
//   1. **PUBLISHED (section 3).** EPA's own `Net3.rpt` carries an Energy Usage table -- usage
//      factor, average efficiency, average kW and peak kW for both of Net3's pumps. That is a
//      document nobody here wrote, and it is the strongest thing available. Four numbers per pump.
//   2. **ANALYTIC (section 4).** A pump moving a measured flow against a measured head must draw
//      P = rho g Q H / efficiency. There is no free parameter in that: the flow and the head come
//      out of the same run, and the power is then arithmetic anybody can do on paper.
//   3. **ARITHMETIC ON GATHERED NUMBERS (sections 5 and 6).** What a run COST is the power the
//      engine reported, times hours, times the price the user typed. Hand-computed here from the
//      same power, so what is being checked is the accounting -- the on-time weighting, the price
//      pattern, the per-pump override, and the demand charge being levied on the peak of the sum.
//
// **NO COST FIGURE IN THIS FILE IS CHECKED ONLY AGAINST OURSELVES**: every one of them is built
// from a power that section 3 or section 4 has already anchored.
//
// **AND A NOTE ON WHY THE EPA REPORT CANNOT ANCHOR THE MONEY.** Net1, Net2 and Net3 all state
// `Global Price 0.0` and `Demand Charge 0.0`, so every cost in every published report is 0.00.
// The power columns are anchorable and the cost column is not, which is exactly why sections 4
// to 6 exist and are labelled the way they are.

const path = require('path');
const fs = require('fs');
const { ROOT, NODE_ENGINE_URL, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}
function head(t) { console.log('\n' + t); }

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tsetSettings: function (s) { settings = s; },\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tassembleModel: assembleModel, docEnergy: docEnergy,\n" +
	"\t\treadEnergySection: readEnergySection,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\trebuildEnergyReport: rebuildEnergyReport, openEnergyBox: openEnergyBox,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;

(async function () {

	// =========================================================================================
	head('1. [ENERGY] is read, and the file\'s own numbers arrive as their own numbers');
	// =========================================================================================
	const net3 = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(net3);
	const e3 = EngCalcs.lpnEnergyParse(parsed.inpSections.ENERGY || []);
	check(e3.globalEfficiency === 75, `Net3 Global Efficiency: ${e3.globalEfficiency} (the file says 75)`);
	check(e3.globalPrice === 0, `Net3 Global Price: ${e3.globalPrice}`);
	check(e3.demandCharge === 0, `Net3 Demand Charge: ${e3.demandCharge}`);
	check(e3.globalPattern === undefined, 'Net3 states no price pattern, so the record holds none');
	// EPANET's per-pump grammar, which Net3 has none of: the keyword PUMP, an id, then which of the
	// three this row states. The EFFIC row names a CURVE and must stay a string -- reading it as a
	// number is how `E1` becomes NaN.
	const perPump = EngCalcs.lpnEnergyParse([
		' Global Efficiency 80', ' Global Pattern OFFPEAK', ' Demand Charge 12.5',
		' PUMP  10  EFFIC  E1', ' PUMP  10  PRICE  0.07', ' PUMP  335  PATTERN  NIGHT'
	]);
	check(perPump.effic['10'] === 'E1', `a per-pump efficiency curve stays an id: ${JSON.stringify(perPump.effic['10'])}`);
	check(perPump.price['10'] === 0.07, `a per-pump price is a number: ${perPump.price['10']}`);
	check(perPump.pattern['335'] === 'NIGHT', `and a per-pump price pattern is an id: ${perPump.pattern['335']}`);
	check(perPump.globalPattern === 'OFFPEAK' && perPump.demandCharge === 12.5,
		'the globals beside them still read as globals');

	// =========================================================================================
	head('2. The file\'s own text still comes back out unchanged');
	// =========================================================================================
	// The interpretation lives BESIDE the token, never over it -- `[OPTIONS] Quality`'s rule,
	// applied to a whole section.
	const back = EngCalcs.lpnEnergyText(e3, parsed.inpSections.ENERGY);
	check(back.join('\n') === parsed.inpSections.ENERGY.join('\n'),
		'untouched, the exporter writes the file\'s own characters, `0.0` included');
	const moved = EngCalcs.lpnEnergyText(Object.assign({}, e3, { globalPrice: 0.12 }),
		parsed.inpSections.ENERGY);
	check(/Global Price\t0.12/.test(moved.join('\n')) && !/Global Price\s+0\.0$/m.test(moved.join('\n')),
		'once a price is typed the section is composed and states the new number');
	check(/Global Efficiency\t75/.test(moved.join('\n')),
		'and the efficiency the file stated is still in it');
	const composed = EngCalcs.lpnEnergyText({
		globalEfficiency: 80, effic: { P1: 'E1' }, price: { P1: 0.09 }, pattern: { P2: 'NIGHT' }
	}, null).join('\n');
	check(/PUMP\tP1\tEFFIC\tE1/.test(composed) && /PUMP\tP1\tPRICE\t0.09/.test(composed)
		&& /PUMP\tP2\tPATTERN\tNIGHT/.test(composed),
	'a composed section writes EPANET\'s own per-pump rows');

	// =========================================================================================
	head('3. THE PUBLISHED ANCHOR: EPA\'s own Net3 Energy Usage table');
	// =========================================================================================
	//
	//   Pump    Usage   Avg.Effic   Avg.Kw   Peak Kw     (Net3.rpt, lines 164-165)
	//   10      58.33     75.00      62.06     62.76
	//   335     28.74     75.00     309.38    310.79
	//
	// Nothing of ours produced those numbers. Reproducing them says that the power comes out of the
	// engine correctly, that "average" means averaged over the time the pump RAN, that the usage
	// factor is over the whole duration, and -- the one that is easy to get wrong -- that the
	// integration is over EVERY HYDRAULIC STEP and not over the reported frames. nextH() stops when
	// a tank fills and when a control fires, and those steps are shorter than the reporting step.
	require(ROOT + 'js/lpn-patterns.js');
	require(ROOT + 'js/lpn-epanet.js');
	require(ROOT + 'js/lpn-time.js');
	const { buildModel } = require('./net3-model.js');
	await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);

	const net3model = buildModel(EngCalcs, parsed);
	net3model.energy = e3;
	const net3run = await EngCalcs.lpnEpanetRun(net3model, { sliceMs: 100000 });
	check(net3run.ok && net3run.energy, 'Net3 ran and reported energy');
	const EPA = {
		'10': { usage: 58.33, effic: 75.00, avgKw: 62.06, peakKw: 62.76 },
		'335': { usage: 28.74, effic: 75.00, avgKw: 309.38, peakKw: 310.79 }
	};
	if (net3run.ok && net3run.energy) {
		net3run.energy.pumps.forEach(function (row) {
			const want = EPA[row.id];
			if (!want) { check(false, `unexpected pump ${row.id}`); return; }
			// The report prints two decimals, so it can say no more than +-0.005 about any of
			// them. The bound is the report's own precision and not a tolerance we chose.
			check(Math.abs(row.usage * 100 - want.usage) < 0.01,
				`pump ${row.id} usage factor: ${(row.usage * 100).toFixed(2)}% against EPA's ${want.usage}%`);
			check(Math.abs(row.avgEfficiency * 100 - want.effic) < 0.01,
				`pump ${row.id} average efficiency: ${(row.avgEfficiency * 100).toFixed(2)}% against EPA's ${want.effic}%`);
			check(Math.abs(row.avgKw - want.avgKw) < 0.01,
				`pump ${row.id} average kW: ${row.avgKw.toFixed(3)} against EPA's ${want.avgKw}`);
			check(Math.abs(row.peakKw - want.peakKw) < 0.01,
				`pump ${row.id} peak kW: ${row.peakKw.toFixed(3)} against EPA's ${want.peakKw}`);
		});
		// **AND THE AVERAGE IS PLAINLY NOT OVER THE WHOLE DAY**, which is the definition this
		// asserts rather than assumes: pump 10 ran 58% of the time, so an average over the period
		// would be near 36 kW and not near 62.
		const p10 = net3run.energy.pumps.filter(function (r) { return r.id === '10'; })[0];
		check(p10 && p10.avgKw > 0.9 * p10.peakKw,
			`the average is over the time the pump RAN: ${p10.avgKw.toFixed(2)} against a ${p10.peakKw.toFixed(2)} peak`);
		// Net3 states a price of zero, so the cost column of the published report is 0.00 and this
		// is all it can say. Asserted anyway, because a page that invented a price would fail here.
		check(net3run.energy.totalCost === 0,
			'and Net3\'s own price of 0.0 gives a total cost of exactly 0, as its report does');
	}

	// =========================================================================================
	head('4. THE ANALYTIC ANCHOR: P = rho g Q H / efficiency');
	// =========================================================================================
	//
	// A reservoir, a pump, a pipe and a junction drawing a constant demand, run for a day with
	// nothing switching. The flow and the head rise across the pump are read out of the run's own
	// frames; the power that must accompany them is arithmetic with no free parameter in it.
	const RHO_G = 9806.65;          // N/m3, water. EPANET's own 62.4 lb/ft3 is 9802 -- see below.
	const EFF = 75;                 // percent
	function pumpCase(opts) {
		opts = opts || {};
		const m = {
			nodes: [
				{ id: 'R', type: 'reservoir', head: 0, elev: 0 },
				{ id: 'J', type: 'junction', elev: 0, demand: opts.q === undefined ? 0.05 : opts.q }
			],
			links: [
				// H = h0 - a Q^b, this page's own pump curve. Flat enough that the working point
				// is well inside it and steep enough that it is a pump and not a fixed head.
				{ id: 'PU', type: 'pump', from: 'R', to: 'J', h0: 60, a: 2000, b: 2, status: 'open' }
			],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			energy: Object.assign({ globalEfficiency: EFF, effic: {}, price: {}, pattern: {} },
				opts.energy || {}),
			time: {
				times: { duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 0 },
				patterns: opts.patterns || [], controls: [], warnings: []
			}
		};
		return EngCalcs.lpnEpanetRun(m, { sliceMs: 100000 });
	}
	const steady = await pumpCase();
	check(steady.ok && steady.energy, 'the one-pump case ran');
	let analyticKw = 0;
	if (steady.ok) {
		const f = steady.frames[0];
		const q = Math.abs(f.flows.PU);                       // m3/s
		const dh = f.heads.J - f.heads.R;                     // m
		analyticKw = RHO_G * q * dh / (EFF / 100) / 1000;     // kW
		const row = steady.energy.pumps[0];
		const err = Math.abs(row.peakKw - analyticKw) / analyticKw;
		// **0.1% IS THE DENSITY, NOT SLOP.** EPANET works in 62.4 lb/ft3, which is 9802.4 N/m3
		// against the 9806.65 used on the line above -- 0.04% on its own. The bound is set just
		// wide enough to hold that and nothing else; a real error in the formula, in the efficiency
		// or in a unit is orders of magnitude larger.
		check(err < 0.001,
			`Q = ${q.toFixed(5)} m3/s against H = ${dh.toFixed(3)} m at ${EFF}%: engine ${row.peakKw.toFixed(4)} kW against rho g Q H / e = ${analyticKw.toFixed(4)} kW (${(err * 100).toFixed(3)}%)`);
		// **THE COUPLING, ASSERTED RATHER THAN ASSUMED** (dev/testing-notes.md). A case whose
		// answer did not depend on the flow would pass with the power frozen: at a smaller demand
		// the pump rides higher on its own curve, so both Q and H move and the power must follow
		// them, not either one alone.
		const light = await pumpCase({ q: 0.02 });
		const lf = light.frames[0];
		const lightAnalytic = RHO_G * Math.abs(lf.flows.PU) * (lf.heads.J - lf.heads.R) / (EFF / 100) / 1000;
		check(light.ok && Math.abs(light.energy.pumps[0].peakKw - lightAnalytic) / lightAnalytic < 0.001,
			`at a smaller demand it tracks its own working point: ${light.energy.pumps[0].peakKw.toFixed(4)} kW against ${lightAnalytic.toFixed(4)}`);
		check(light.energy.pumps[0].peakKw < 0.75 * row.peakKw,
			`and the two cases really are different: ${light.energy.pumps[0].peakKw.toFixed(2)} kW against ${row.peakKw.toFixed(2)} kW`);
		// **THE EFFICIENCY REALLY IS APPLIED, AND IN THE RIGHT DIRECTION.** Halving it must double
		// the power: a page that quietly ran everything at EPANET's default 75 would pass every
		// assertion above.
		const half = await pumpCase({ energy: { globalEfficiency: EFF / 2 } });
		check(half.ok && Math.abs(half.energy.pumps[0].peakKw / row.peakKw - 2) < 0.01,
			`half the efficiency is twice the power: ${(half.energy.pumps[0].peakKw / row.peakKw).toFixed(4)}`);
		check(Math.abs(steady.energy.pumps[0].avgEfficiency - 0.75) < 1e-6,
			`and the efficiency reported back is the one stated: ${steady.energy.pumps[0].avgEfficiency}`);
	}

	// =========================================================================================
	head('5. THE MONEY: kWh, price, price schedule, and the demand charge');
	// =========================================================================================
	//
	// Arithmetic on the power section 4 has already anchored. A pump running unchanged for 24 hours
	// at P kW uses 24 P kWh and costs 24 P price.
	const PRICE = 0.11, CHARGE = 8.5;
	const priced = await pumpCase({ energy: { globalPrice: PRICE, demandCharge: CHARGE } });
	if (priced.ok) {
		const row = priced.energy.pumps[0], kw = row.peakKw;
		check(Math.abs(row.onSeconds - 86400) < 1, `it ran the whole day: ${row.onSeconds} s`);
		check(Math.abs(row.usage - 1) < 1e-9, `so the usage factor is 1: ${row.usage}`);
		check(Math.abs(row.kwh - kw * 24) / (kw * 24) < 1e-6,
			`energy: ${row.kwh.toFixed(4)} kWh against 24 h x ${kw.toFixed(4)} kW = ${(kw * 24).toFixed(4)}`);
		check(Math.abs(row.cost - kw * 24 * PRICE) / (kw * 24 * PRICE) < 1e-6,
			`cost: ${row.cost.toFixed(4)} against 24 h x ${kw.toFixed(4)} kW x ${PRICE} = ${(kw * 24 * PRICE).toFixed(4)}`);
		// **THE DEMAND CHARGE IS ON POWER AND NOT ON ENERGY**, which is the distinction a tariff
		// turns on: it is charged once, on the highest kW ever drawn, and it is not a share of the
		// cost above it.
		check(Math.abs(priced.energy.demandCharge - CHARGE * kw) / (CHARGE * kw) < 1e-6,
			`demand charge: ${priced.energy.demandCharge.toFixed(4)} against ${CHARGE} x ${kw.toFixed(4)} kW`);
		check(Math.abs(priced.energy.totalCost - (row.cost + CHARGE * kw)) < 1e-9,
			`total: ${priced.energy.totalCost.toFixed(4)} = energy ${row.cost.toFixed(4)} + demand ${(CHARGE * kw).toFixed(4)}`);
		// **AND A PRICE SCHEDULE IS THE POINT OF A TARIFF.** Twelve hours at half price and twelve
		// at double must cost 1.25 times the flat day -- (0.5 + 2)/2 -- and a page that ignored the
		// pattern would report exactly the flat figure.
		const pat = EngCalcs.lpnPatternMake('TARIFF',
			[].concat(new Array(12).fill(0.5), new Array(12).fill(2)));
		const sched = await pumpCase({
			energy: { globalPrice: PRICE, globalPattern: 'TARIFF' }, patterns: [pat]
		});
		const flatCost = kw * 24 * PRICE;
		check(sched.ok && Math.abs(sched.energy.pumps[0].cost - flatCost * 1.25) / (flatCost * 1.25) < 1e-4,
			`on a half-then-double tariff: ${sched.energy.pumps[0].cost.toFixed(4)} against ${(flatCost * 1.25).toFixed(4)}`);
		check(Math.abs(sched.energy.pumps[0].kwh - kw * 24) / (kw * 24) < 1e-6,
			'and the ENERGY is unchanged by the price of it');
		// A pump's own price beats the network's. EPANET's rule, and this page's.
		const own = await pumpCase({ energy: { globalPrice: PRICE, price: { PU: PRICE * 3 } } });
		check(own.ok && Math.abs(own.energy.pumps[0].cost - flatCost * 3) / (flatCost * 3) < 1e-6,
			`a pump's own price replaces the network's: ${own.energy.pumps[0].cost.toFixed(4)} against ${(flatCost * 3).toFixed(4)}`);
		// **NO PRICE IS NOT A DEFAULT PRICE.** There is none on this page and there must not be:
		// a document that states nothing reports a cost of zero, not a plausible invented figure.
		check(steady.energy.totalCost === 0 && steady.energy.kwh > 0,
			`with no price stated the energy is real (${steady.energy.kwh.toFixed(1)} kWh) and the cost is exactly 0`);
	}

	// =========================================================================================
	head('6. Two pumps: the demand charge is on the peak of the SUM');
	// =========================================================================================
	//
	// A utility is billed for the most it ever drew at one moment, so two pumps whose peaks fall in
	// different hours are not billed as though they had coincided. The sum-of-peaks mistake is
	// invisible on a one-pump network, which is why this case exists.
	const twoPat = EngCalcs.lpnPatternMake('SWAP',
		[].concat(new Array(12).fill(1), new Array(12).fill(0)));
	const twoPatB = EngCalcs.lpnPatternMake('SWAPB',
		[].concat(new Array(12).fill(0), new Array(12).fill(1)));
	const two = await EngCalcs.lpnEpanetRun({
		nodes: [
			{ id: 'R', type: 'reservoir', head: 0, elev: 0 },
			{ id: 'JA', type: 'junction', elev: 0, demand: 0.05, demandBase: 0.05, demandPattern: 'SWAP' },
			{ id: 'JB', type: 'junction', elev: 0, demand: 0.05, demandBase: 0.05, demandPattern: 'SWAPB' }
		],
		links: [
			{ id: 'PA', type: 'pump', from: 'R', to: 'JA', h0: 60, a: 2000, b: 2, status: 'open' },
			{ id: 'PB', type: 'pump', from: 'R', to: 'JB', h0: 60, a: 2000, b: 2, status: 'open' }
		],
		method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
		energy: { globalEfficiency: EFF, demandCharge: CHARGE, effic: {}, price: {}, pattern: {} },
		time: {
			times: { duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
				reportStep: 3600, reportStart: 0, startClock: 0, qualityStep: 0 },
			patterns: [twoPat, twoPatB], controls: [], warnings: []
		}
	}, { sliceMs: 100000 });
	if (two.ok && two.energy) {
		const sumOfPeaks = two.energy.pumps.reduce(function (a, r) { return a + r.peakKw; }, 0);
		check(two.energy.peakKw < 0.75 * sumOfPeaks,
			`the two pumps never peak together: peak of the sum ${two.energy.peakKw.toFixed(2)} kW against a sum of peaks of ${sumOfPeaks.toFixed(2)} kW`);
		check(Math.abs(two.energy.demandCharge - CHARGE * two.energy.peakKw) < 1e-9,
			`and the demand charge is levied on the first of those: ${two.energy.demandCharge.toFixed(4)}`);
		// Each pump did half a day's work, which is what makes the case a case. Read off the
		// ENERGY rather than the usage factor: neither pump is ever switched off here, and a pump
		// left open with nothing to deliver draws a whisper, so both are "on line" all day. That
		// is EPANET's own reading of an open pump and it is stated in js/lpn-epanet.js beside the
		// accumulator; where a control really switches a pump, section 3 shows the usage factors
		// landing on EPA's own to two decimals.
		check(two.energy.pumps.every(function (r) {
			return Math.abs(r.kwh - r.peakKw * 12) / (r.peakKw * 12) < 0.01;
		}), 'each pump did half a day of work: ' + two.energy.pumps.map(function (r) {
			return r.id + ' ' + r.kwh.toFixed(1) + ' kWh against ' + (r.peakKw * 12).toFixed(1);
		}).join(', '));
	} else {
		check(false, 'the two-pump case ran');
	}

	// =========================================================================================
	head('7. The page holds the numbers, and a per-pump price goes through setProp()');
	// =========================================================================================
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	const s = L.getSettings();
	s.energy = { globalEfficiency: 70, globalPrice: 0.09, demandCharge: 5, effic: {} };
	const r1 = L.addNode('reservoir', 0, 0), j1 = L.addNode('junction', 100, 0);
	const pu = L.addLink('pump', r1.id, j1.id);
	L.setProp(pu, 'energyPrice', 0.2);
	L.setProp(pu, 'energyPattern', 'NIGHT');
	const de = L.docEnergy();
	check(de.globalEfficiency === 70 && de.globalPrice === 0.09 && de.demandCharge === 5,
		'the globals reach the model from the setting');
	check(de.price[pu.id] === 0.2 && de.pattern[pu.id] === 'NIGHT',
		`and the pump's own price and schedule from the pump: ${de.price[pu.id]}, ${de.pattern[pu.id]}`);
	// **THE WRITE SEAM.** setProp() is the one place an overridable property is written
	// (scenario_seam_check.php); the proof that these two really go through it is that a scenario
	// can hold its own value while Base keeps the one it had.
	const sc = L.createScenario('Off peak');
	L.switchScenario(sc.id);
	L.setProp(pu, 'energyPrice', 0.05);
	check(L.docEnergy().price[pu.id] === 0.05, 'inside a scenario the price is the scenario\'s');
	L.switchScenario('base');
	check(L.docEnergy().price[pu.id] === 0.2,
		`and Base still holds its own, untouched: ${L.docEnergy().price[pu.id]}`);
	// **NOTHING HERE CARRIES A UNIT**, which is the finding that says why there is no
	// engineEnergy() clone beside engineHydraulics() and engineQuality(). The same document under
	// the other unit preset must hand the engine exactly the same numbers.
	const usModel = L.assembleModel();
	setUnitSet('si');
	const siModel = L.assembleModel();
	check(JSON.stringify(usModel.energy) === JSON.stringify(siModel.energy),
		'and the energy record is identical under the US and SI presets, because none of it is dimensioned');
	setUnitSet('us');

	// =========================================================================================
	head('8. An imported [ENERGY] lands on the document, and a project reopens holding it');
	// =========================================================================================
	const s2 = {};
	const links2 = [{ id: '10', type: 'pump' }, { id: '335', type: 'pump' }];
	L.readEnergySection({ ENERGY: [' Global Efficiency 75', ' PUMP 10 PRICE 0.04',
		' PUMP 335 PATTERN NIGHT', ' PUMP 10 EFFIC E1'] }, s2, links2);
	check(s2.energy.globalEfficiency === 75, 'the global lands on the setting');
	check(links2[0]._energyPrice === 0.04 && links2[1]._energyPattern === 'NIGHT',
		'a per-pump price and schedule land on the pumps, in Base');
	check(s2.energy.effic['10'] === 'E1',
		'and the efficiency CURVE stays on the setting, having no control on this page');
	const empty = {};
	L.readEnergySection({}, empty, []);
	check(!!empty.energy, 'a file stating no [ENERGY] still gets the record, which is what tells the exporter the section has been read');

	// =========================================================================================
	head('9. The controls and the report really build');
	// =========================================================================================
	//
	// **A HOST MISSING FROM THE STUB IS A SILENT HOLE**, which is why this section exists at all:
	// rebuildSettingsFields() returns at one guard if any of its hosts is absent, so a harness that
	// never looked would report a green page with an empty Settings box.
	L.rebuildSettingsFields();
	const energyHost = document.getElementById('lpn_set_energy_fields');
	const labels = (energyHost.children || []).map(function (c) { return c.textContent || ''; }).join(' | ');
	check((energyHost.children || []).length >= 5,
		`the Energy section built its rows: ${(energyHost.children || []).length}`);
	// "Peak demand charge" since 2026-09-04 (Tom, reading the new-key list: *"Why not 'Peak demand
	// charge'?"* -- it is charged on the one highest moment, so the name says which moment).
	check(/Pump efficiency/.test(labels) && /Price of power/.test(labels)
		&& /Peak demand charge/.test(labels) && /Currency/.test(labels),
	'and they are the efficiency, the price, the peak demand charge and the currency');
	// **THE DISCLOSURE IS IN THE BOX**, not in a comment: there is no default price on this page.
	check(/no price of its own/.test(labels), 'with the note that this page offers no price of its own');
	// A report with no run says so rather than showing zeros.
	L.rebuildEnergyReport();
	const reportHost = document.getElementById('lpn_energy_report');
	check(/EPANET engine/.test(reportHost.textContent || ''),
		'with no run in hand the report says it needs the engine and a run time');
	// And with one, it draws the table. The summary is handed in through the one door the page
	// reads it by, so this exercises the real path rather than a private hook.
	EngCalcs.lpnTimeRunEnergy = function () {
		return EngCalcs.lpnEnergySummary(
			EngCalcs.lpnEnergyAccumulate(EngCalcs.lpnEnergyAccInit([pu.id]),
				(function (o) { o[pu.id] = { kw: 40, effic: 0.7, price: 0.2 }; return o; }({})), 3600),
			{ duration: 3600, demandCharge: 5 });
	};
	L.rebuildEnergyReport();
	const text = reportHost.textContent || '';
	check(new RegExp(pu.id).test(text) && /Peak kW/.test(text),
		'the table drew, with the pump\'s own id in it');
	check(/1:00/.test(text), 'and the run\'s length is stated the way every other time on this page is');
	check(/8\b/.test(text), `the money is on screen: 40 kW for 1 h at 0.2 is 8 (${text.replace(/\s+/g, ' ').slice(0, 200)})`);
	check(/200/.test(text), 'and the demand charge of 5 per kW on a 40 kW peak is 200');

	console.log('\n' + (failures ? failures + ' FAILURES' : 'all checks passed'));
	process.exit(failures ? 1 : 0);
}());

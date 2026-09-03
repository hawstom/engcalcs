// THE ACCEPTANCE TEST FOR THE CHEMICAL / REACTION WATER-QUALITY MODE -- ROADMAP Task 566,
// dev/water-quality.md. Run with:
//
//   node dev/lpn-spike/reaction-anchor-harness.js
//
// **THIS IS AN ANALYTIC ANCHOR AND IT IS NOT AN EPA REPORT. SAID FIRST, BECAUSE IT MATTERS.**
// Water age and source share are checked against EPA's own published `Net3.rpt`
// (dev/lpn-spike/quality-net3-harness.js, 2,425 comparisons). **There is no EPA report for a
// chlorine run in this repository**: Net1 states `Quality Chlorine mg/L` and no `.rpt` beside it,
// and Net3's report is a TRACE run. So this file anchors the third mode the way the age case is
// anchored -- on arithmetic with no free parameter in it -- and says so rather than quietly
// comparing the page against itself.
//
// **THE ARITHMETIC.** A reservoir, one pipe, one junction drawing a constant demand. The reservoir
// holds its own concentration for the whole run (that is what EPANET does with a reservoir's
// initial quality), the water in the pipe moves at Q/A, and with a first-order bulk coefficient Kb
// and no wall reaction the concentration arriving at the far end once the pipe has flushed is
//
//     C = C0 * exp(Kb * V / Q)      V = pipe volume, Q = flow, Kb in 1/day
//
// which anybody can do on paper. Nothing of ours is involved in producing the right answer.
//
// **THE STUB WARNING (dev/testing-notes.md) APPLIES, AND THE QUANTITY IT APPLIES TO IS TRAVEL
// TIME.** A case whose answer did not depend on the pipe's volume or on the flow would pass with
// the whole transport broken. So the case is run at TWO flows and the two answers are tied to each
// other: halving the travel time must halve ln(C/C0) exactly, which no wrong scale factor and no
// frozen coefficient can survive.
//
// **AND ONE FINDING THAT IS NOT ABOUT OUR CODE AT ALL, MEASURED HERE BECAUSE IT DECIDES WHETHER
// THIS FILE CAN BE AN ANCHOR.** EPANET's `[OPTIONS] Tolerance` is the parcel-merging tolerance: it
// merges two adjacent parcels of water whose concentrations differ by less than it, so at its own
// default of 0.01 the decay profile is smeared and the answer wanders up to 0.9% off the exact one
// AND DOES NOT CONVERGE as the quality time step shrinks. That is EPANET's documented behaviour and
// not our error -- but it means the option has to reach the engine, which it did not before this
// task, because dev/water-quality.md said Tolerance and Diffusivity mean something only to a
// reacting chemical and a reacting chemical did not run. Both halves are asserted below.

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

// The page, driven for real. Everything the assertions read comes out through these hooks rather
// than being recomputed here, so a harness cannot agree with a page that has moved underneath it.
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tsetSettings: function (s) { settings = s; },\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tassembleModel: assembleModel, docReactions: docReactions, engineQuality: engineQuality,\n" +
	"\t\treadQualitySections: readQualitySections, qualitySetting: qualitySetting,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	// init() never runs, so the SVG layers it would build are undefined. The same one-time setup
	// every other page-driving harness does.
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
	head('1. [REACTIONS] and [QUALITY] are read, and Net1\'s own coefficient arrives as its own number');
	// =========================================================================================
	const net1 = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net1.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(net1);
	const react = EngCalcs.lpnReactionsParse(parsed.inpSections.REACTIONS || []);
	// Net1 states ` Global Bulk           	-.5`. A file that says so must arrive saying so; before
	// this task the whole section was carried text and the page ran with no coefficient at all.
	check(react.globalBulk === -0.5, `Net1 Global Bulk: ${react.globalBulk} (the file says -.5)`);
	check(react.globalWall === -1, `Net1 Global Wall: ${react.globalWall}`);
	check(react.orderBulk === 1 && react.orderWall === 1 && react.orderTank === 1,
		`the three reaction orders: ${react.orderBulk}/${react.orderWall}/${react.orderTank}`);
	check(react.limitingPotential === 0 && react.roughnessCorrelation === 0,
		'Limiting Potential and Roughness Correlation are read too');
	const init = EngCalcs.lpnInitQualityParse(parsed.inpSections.QUALITY || []);
	check(init['9'] === 1.0 && init['10'] === 0.5,
		`Net1 [QUALITY]: node 9 starts at ${init['9']}, node 10 at ${init['10']}`);
	// A per-element row, which Net1 has none of. Its grammar is the same keyword as the global row,
	// told apart by the second token, so it is worth its own fixture.
	const perPipe = EngCalcs.lpnReactionsParse([
		' Global Bulk  -0.4', ' BULK  P1  -1.2', ' WALL  P2  -0.05', ' TANK  T1  -0.3'
	]);
	check(perPipe.bulk.P1 === -1.2 && perPipe.wall.P2 === -0.05 && perPipe.tank.T1 === -0.3,
		'a per-pipe BULK, a per-pipe WALL and a per-tank row are told apart from the globals');
	check(perPipe.globalBulk === -0.4, 'and the global row beside them still reads as a global');

	// =========================================================================================
	head('2. The file\'s own text still comes back out unchanged');
	// =========================================================================================
	// The interpretation lives BESIDE the token, never over it -- the rule `[OPTIONS] Quality`
	// already follows, applied to a whole section.
	const back = EngCalcs.lpnReactionsText({
		orderBulk: 1, orderTank: 1, orderWall: 1, globalBulk: -0.5, globalWall: -1,
		limitingPotential: 0, roughnessCorrelation: 0, bulk: {}, wall: {}, tank: {}
	}, parsed.inpSections.REACTIONS);
	check(back.join('\n') === parsed.inpSections.REACTIONS.join('\n'),
		'untouched, the exporter writes the file\'s own characters, `-.5` included');
	const moved = EngCalcs.lpnReactionsText({
		orderBulk: 1, orderTank: 1, orderWall: 1, globalBulk: -0.6, globalWall: -1,
		limitingPotential: 0, roughnessCorrelation: 0, bulk: {}, wall: {}, tank: {}
	}, parsed.inpSections.REACTIONS);
	check(/Global Bulk\t-0.6/.test(moved.join('\n')) && !/-\.5/.test(moved.join('\n')),
		'once a coefficient is edited the section is composed and states the new number');
	const q1 = EngCalcs.lpnInitQualityText(init, parsed.inpSections.QUALITY);
	check(q1.join('\n') === parsed.inpSections.QUALITY.join('\n'),
		'and [QUALITY] round-trips on the same rule, `1.0` included');
	// The byte-identical round trip through the PAGE'S OWN exporter is asserted where the page is
	// loaded: dev/lpn-spike/inp-export-harness.js and section-carry-harness.js, which run Net1,
	// Net2 and Net3 through docFromInp() and compare every token.

	// =========================================================================================
	head('3. THE ANCHOR: first-order decay in one pipe, against arithmetic');
	// =========================================================================================
	//
	// SI throughout, which is what a model handed to js/lpn-epanet.js always is. The concentration
	// is the one quantity here with no factor on either side: EPANET transports and reacts it in
	// whatever units it is stated in, so C0 = 1 is a pure number and so is the answer.
	require(ROOT + 'js/lpn-patterns.js');
	require(ROOT + 'js/lpn-epanet.js');
	require(ROOT + 'js/lpn-time.js');
	await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);

	const KB = -0.5;                 // 1/day, first order. A published chlorine number's order.
	const D = 0.3, LEN = 1000;       // m
	const AREA = Math.PI * D * D / 4;
	function decayCase(demandM3s, opts) {
		opts = opts || {};
		const travel = AREA * LEN / demandM3s;       // seconds
		const analytic = Math.exp(KB * travel / 86400);
		const m = {
			nodes: [
				{ id: 'R', type: 'reservoir', head: 100, elev: 0, initQuality: 1 },
				{ id: 'J', type: 'junction', elev: 0, demand: demandM3s, demandBase: demandM3s }
			],
			links: [{ id: 'P', type: 'pipe', from: 'R', to: 'J', length: LEN, diameter: D,
				roughness: 130, k: 0, status: 'open' }],
			method: 'hw', visc: 1.007e-6, emitterExponent: 0.5,
			quality: { mode: 'chemical', chemical: 'Chlorine mg/L',
				tolerance: opts.tolerance === undefined ? 1e-8 : opts.tolerance },
			reactions: { orderBulk: 1, orderWall: 1, globalBulk: KB, globalWall: 0 },
			time: {
				times: { duration: 86400 * 2, hydraulicStep: 3600, patternStep: 3600, patternStart: 0,
					reportStep: 3600, reportStart: 0, startClock: 0,
					qualityStep: opts.qualityStep || 60 },
				patterns: [], controls: [], warnings: []
			}
		};
		return EngCalcs.lpnEpanetRun(m).then(function (r) {
			if (!r.ok) { return { ok: false, engineError: r.engineError }; }
			const last = r.frames[r.frames.length - 1];
			return { ok: true, travel: travel, analytic: analytic, c: last.qualities.J };
		});
	}
	check(EngCalcs.lpnQualityRuns({ mode: 'chemical' }),
		'a chemical is a run now, where it used to be carried text');

	const slow = await decayCase(0.010);
	const fast = await decayCase(0.020);
	check(slow.ok && fast.ok, 'the two decay runs completed');
	if (slow.ok && fast.ok) {
		const eSlow = Math.abs(slow.c - slow.analytic) / slow.analytic;
		const eFast = Math.abs(fast.c - fast.analytic) / fast.analytic;
		check(eSlow < 0.001,
			`at ${(slow.travel / 3600).toFixed(3)} h of travel: ${slow.c.toFixed(6)} against exp(Kb t) = ${slow.analytic.toFixed(6)} (${(eSlow * 100).toFixed(4)}%)`);
		check(eFast < 0.001,
			`at ${(fast.travel / 3600).toFixed(3)} h of travel: ${fast.c.toFixed(6)} against exp(Kb t) = ${fast.analytic.toFixed(6)} (${(eFast * 100).toFixed(4)}%)`);
		// **THE COUPLING, ASSERTED RATHER THAN ASSUMED.** ln C is linear in travel time, so double
		// the flow and the exponent halves exactly. A coefficient that never reached the engine,
		// a decay applied per time STEP rather than per residence time, or a concentration that is
		// really a copy of the source, all fail this line and can pass the two above.
		const ratio = Math.log(slow.c) / Math.log(fast.c);
		check(Math.abs(ratio - 2) < 0.01,
			`double the flow halves the decay exponent: ln ratio ${ratio.toFixed(4)} (exactly 2)`);
		// And the chemical must actually be decaying: an unreacted tracer answers 1.0 everywhere
		// and would satisfy a tolerance test written loosely enough.
		check(slow.c < 0.98 && slow.c > 0.9, `and it really decayed: ${slow.c.toFixed(4)} from 1.0`);
	}
	// **THE ANCHOR HOLDS AT A DIFFERENT TIME STEP**, which is what says the answer is the physics
	// and not one lucky discretisation.
	const finer = await decayCase(0.010, { qualityStep: 10 });
	check(finer.ok && Math.abs(finer.c - finer.analytic) / finer.analytic < 0.001,
		`at a 10 s quality step the same case still lands on the arithmetic: ${finer.c.toFixed(6)}`);

	// =========================================================================================
	head('4. [OPTIONS] Tolerance reaches the engine, and it is why this can be an anchor');
	// =========================================================================================
	const loose = await decayCase(0.010, { tolerance: 0.01 });   // EPANET's own default
	check(loose.ok, 'the same case runs at EPANET\'s own parcel tolerance');
	if (loose.ok && slow.ok) {
		const eLoose = Math.abs(loose.c - loose.analytic) / loose.analytic;
		// NOT A FAILURE OF OURS. EPANET merges parcels differing by less than Tolerance, so a loose
		// one smears the profile. Asserted so that nobody later "fixes" the anchor by loosening
		// the bound instead of stating the option.
		const eTight = Math.abs(slow.c - slow.analytic) / slow.analytic;
		check(eLoose > 20 * eTight,
			`at Tolerance 0.01 the same run is ${(eLoose * 100).toFixed(4)}% off the arithmetic against ${(eTight * 100).toFixed(4)}% at the document's own, which is EPANET's parcel merging and not our arithmetic`);
	}
	const inp = EngCalcs.lpnToInp({
		nodes: [{ id: 'R', type: 'reservoir', head: 10, elev: 0, initQuality: 1.25 },
			{ id: 'J', type: 'junction', elev: 0, demand: 0.01 }],
		links: [{ id: 'P', type: 'pipe', from: 'R', to: 'J', length: 100, diameter: 0.2,
			roughness: 130, k: 0, status: 'open' }],
		method: 'hw',
		quality: { mode: 'chemical', chemical: 'Chlorine mg/L', tolerance: 0.002, diffusivity: 1.3 },
		reactions: { orderBulk: 1, globalBulk: -0.7, wall: { P: -0.25 }, bulk: {}, tank: {} }
	}).inp;
	check(/\n Quality Chlorine mg\/L\b/.test(inp), 'the engine input names the chemical the document names');
	check(/\n Tolerance 0.002\b/.test(inp), 'and states the parcel tolerance');
	check(/\n Diffusivity 1.3\b/.test(inp), 'and the diffusivity');
	check(/\[QUALITY\]\n R  1.25/.test(inp), 'the reservoir\'s own concentration is stated');
	check(/\[REACTIONS\]\n[\s\S]*Order Bulk  1[\s\S]*Global Bulk  -0.7[\s\S]*WALL  P  -0.25/.test(inp),
		'and the reaction coefficients, globals and per-pipe alike');
	// **NONE OF IT FOR AN ANALYSIS THAT IS NOT A CHEMICAL.** An age run has no species to start and
	// no reaction to apply, and stating either would be input for an analysis nobody asked for.
	const ageInp = EngCalcs.lpnToInp({
		nodes: [{ id: 'R', type: 'reservoir', head: 10, elev: 0, initQuality: 1.25 },
			{ id: 'J', type: 'junction', elev: 0, demand: 0.01 }],
		links: [{ id: 'P', type: 'pipe', from: 'R', to: 'J', length: 100, diameter: 0.2,
			roughness: 130, k: 0, status: 'open' }],
		method: 'hw', quality: { mode: 'age', tolerance: 0.002 },
		reactions: { globalBulk: -0.7, bulk: {}, wall: {}, tank: {} }
	}).inp;
	check(!/\[QUALITY\]/.test(ageInp) && !/\[REACTIONS\]/.test(ageInp) && !/Tolerance/.test(ageInp),
		'a water-age run states neither section and neither option');

	// =========================================================================================
	head('5. THE WALL COEFFICIENT IS A LENGTH PER DAY, measured against the engine');
	// =========================================================================================
	//
	// This is the fact that makes engineQuality() necessary, and it is established here rather than
	// assumed from a manual. The same physical network in two unit systems: Kw = -1 m/day in an LPS
	// file must equal Kw = -1/0.3048 ft/day in a GPM file. If it does, the coefficient carries the
	// FILE'S length, and a US project handed straight to our LPS-and-metres engine writer would be
	// wrong by 3.28 in the term that decides how much chlorine is left.
	const mod = await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);
	const ws = new mod.Workspace();
	await ws.loadModule();
	const M_PER_FT = 0.3048;
	function rawRun(text) {
		ws.writeFile('a.inp', text);
		const p = new mod.Project(ws);
		p.open('a.inp', 'a.rpt', '');
		p.openH(); p.initH(1);
		do { p.runH(); } while (p.nextH() > 0);
		p.closeH();
		p.openQ(); p.initQ(0);
		const ji = p.getNodeIndex('J');
		let last = 0;
		do { p.runQ(); last = p.getNodeValue(ji, 12); } while (p.nextQ() > 0);
		p.close();
		return last;
	}
	function wallFile(units, head, len, dia, flow, kw) {
		return `[TITLE]\nwall\n[JUNCTIONS]\n J 0 ${flow}\n[RESERVOIRS]\n R ${head}\n` +
			`[PIPES]\n P R J ${len} ${dia} 130 0 OPEN\n[QUALITY]\n R 1.0\n` +
			`[REACTIONS]\n Order Bulk 1\n Order Wall 1\n Global Bulk 0\n Global Wall ${kw}\n` +
			'[TIMES]\n Duration 48:00\n Hydraulic Timestep 1:00\n Quality Timestep 0:01\n Report Timestep 1:00\n' +
			`[OPTIONS]\n Units ${units}\n Headloss H-W\n Quality Chlorine mg/L\n Tolerance 1e-8\n[END]\n`;
	}
	const cSI = rawRun(wallFile('LPS', 100, LEN, D * 1000, 20, -1));
	const cUS = rawRun(wallFile('GPM', 100 / M_PER_FT, LEN / M_PER_FT, D * 1000 / 25.4,
		20 / 3.785411784 * 60, -1 / M_PER_FT));
	check(Math.abs(cSI - cUS) / cSI < 1e-5,
		`Kw = -1 m/day in LPS and -${(1 / M_PER_FT).toFixed(4)} ft/day in GPM agree: ${cSI.toFixed(6)} against ${cUS.toFixed(6)}`);
	const cUSnaive = rawRun(wallFile('GPM', 100 / M_PER_FT, LEN / M_PER_FT, D * 1000 / 25.4,
		20 / 3.785411784 * 60, -1));
	check(Math.abs(cUSnaive - cSI) / cSI > 0.05,
		`and handing the same NUMBER across without the factor is a real error: ${cUSnaive.toFixed(6)} against ${cSI.toFixed(6)}`);

	// =========================================================================================
	head('6. So the page converts it, on a clone, at the engine boundary and nowhere else');
	// =========================================================================================
	setUnitSet('us');              // a US project: lpn_u_length is ft
	L.buildLayers();
	L.seedDefaultInputs();
	const s = L.getSettings();
	s.reactions = { orderBulk: 1, orderWall: 1, globalBulk: -0.5, globalWall: -1, tank: {} };
	s.quality = { mode: 'chemical', chemical: 'Chlorine mg/L' };
	const r1 = L.addNode('reservoir', 0, 0), j1 = L.addNode('junction', 100, 0);
	const p1 = L.addLink('pipe', r1.id, j1.id);
	L.setProp(p1, 'wallCoeff', -2);
	L.setProp(p1, 'bulkCoeff', -0.9);
	L.setProp(j1, 'initQuality', 0.8);
	const docR = L.docReactions();
	check(docR.globalWall === -1 && docR.wall[p1.id] === -2,
		'the document holds the numbers the user typed, in the project\'s own units');
	const engR = L.engineQuality(docR);
	check(Math.abs(engR.globalWall - (-0.3048)) < 1e-12,
		`the engine gets the global wall coefficient in metres per day: ${engR.globalWall}`);
	check(Math.abs(engR.wall[p1.id] - (-2 * 0.3048)) < 1e-12,
		`and the pipe's own the same way: ${engR.wall[p1.id]}`);
	check(engR.globalBulk === -0.5 && engR.bulk[p1.id] === -0.9,
		'and a BULK coefficient crosses unchanged, being a reciprocal time');
	// **THE DOCUMENT IS NOT TOUCHED.** engineQuality() is a reader; a getter that assigns is a
	// writer wearing a reader's name (the libPatterns() lesson).
	check(L.docReactions().globalWall === -1 && L.getSettings().reactions.globalWall === -1,
		'and the document still says -1, because the conversion was on a clone');
	// A ZERO-ORDER wall coefficient is a mass per area per day and carries the concentration unit,
	// which nobody converts -- so it must NOT be scaled. Stated as a check because the tempting
	// mistake is to convert every wall coefficient.
	const zeroOrder = L.engineQuality({ orderWall: 0, globalWall: -1, bulk: {}, wall: { X: -3 }, tank: {} });
	check(zeroOrder.globalWall === -1 && zeroOrder.wall.X === -3,
		'a zero-order wall coefficient is left alone: it has no length in it');
	// And it reaches the model the run reads.
	const model = L.assembleModel();
	check(Math.abs(model.reactions.globalWall - (-0.3048)) < 1e-12,
		'the model the run is built from carries the converted coefficient');
	check(model.nodes.filter(function (n) { return n.id === j1.id; })[0].initQuality === 0.8,
		'and the node carries what it starts the run holding');
	check(model.quality.mode === 'chemical' && model.quality.chemical === 'Chlorine mg/L',
		'and the analysis names the chemical the document names');

	// =========================================================================================
	head('7. A per-pipe coefficient goes through setProp(), so a scenario cannot edit Base');
	// =========================================================================================
	const scn = L.createScenario('Relined');
	L.switchScenario(scn.id);
	L.setProp(p1, 'wallCoeff', -0.1);
	check(L.effective(p1, 'wallCoeff') === -0.1, 'the scenario sees its own wall coefficient');
	check(p1._wallCoeff === -2, 'and BASE still holds -2, which is the whole point of the seam');
	check(L.docReactions().wall[p1.id] === -0.1,
		'the model built inside the scenario reads the scenario\'s number');
	L.setProp(j1, 'initQuality', 1.4);
	check(L.effective(j1, 'initQuality') === 1.4 && j1._initQuality === 0.8,
		'and a starting concentration overrides the same way');
	L.switchScenario('base');
	check(L.effective(p1, 'wallCoeff') === -2 && L.effective(j1, 'initQuality') === 0.8,
		'back in Base, Base\'s own numbers');

	// =========================================================================================
	head('8. And the values survive a save and open');
	// =========================================================================================
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	check(saved.settings.reactions.globalBulk === -0.5,
		'the globals are in the project file');
	check(saved.links.filter(function (l) { return l.id === p1.id; })[0]._wallCoeff === -2,
		'the pipe\'s own coefficient is on the pipe');
	check(saved.nodes.filter(function (n) { return n.id === j1.id; })[0]._initQuality === 0.8,
		'and the node\'s starting concentration is on the node');

	console.log(failures === 0 ? '\nreaction anchor harness: all checks passed'
		: `\nreaction anchor harness: ${failures} FAILED`);
	process.exit(failures === 0 ? 0 : 1);
}()).catch(function (e) { console.error(e); process.exit(1); });

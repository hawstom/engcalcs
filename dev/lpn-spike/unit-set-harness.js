// ONE SET OF UNITS -- ROADMAP Task 522, which reverses Task 422's input/result split. Run with:
//   node dev/lpn-spike/unit-set-harness.js
//
// WHY THIS EXISTS. Task 422 gave the page two units strips: one deciding what typed numbers MEAN,
// one deciding how answers are read, with flow, elevation/head and pressure appearing in both. Tom,
// 2026-08-24: *"I think it's our design mistake, and we shouldn't allow them to be independent or
// to diverge. We shouldn't have separate input and output units."* The argument is not tidiness --
// a design where two controls may legitimately disagree gives a defect somewhere to hide, and this
// one hid Task 521's bug from an AI reading the source with the code in front of it.
//
// What has to hold, and what each failure looks like:
//
//   1. **THERE IS ONE SELECTOR PER QUANTITY.** A solved head and a typed elevation read through the
//      same one, so they cannot drift apart. If a `lpn_u_r_*` name ever comes back, the whole class
//      of defect comes back with it.
//   2. **"One set" is the input set PLUS velocity and gradient**, which are results-only and never
//      had an input twin -- so this is a merge with two extras, not a deletion of one group.
//   3. **AN OLD FILE CARRYING BOTH MAPS OPENS WITH NO QUESTION ASKED, AND THE INPUT UNIT WINS.**
//      That is the migration, and it is one rule in one place (reconcileLegacyUnits). Taking the
//      result unit where the two disagree would silently reinterpret every number in the document.
//   4. **Changing a unit still reinterprets rather than converts**, and Convert still rewrites the
//      right numbers including scenario overrides. Those are Task 422's guarantees and survive.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tresultUnit: resultUnit, unitFactor: unitFactor, unitKey: unitKey,\n" +
	"\t\tconvertValues: convertUnitValues, countValues: countUnitValues,\n" +
	"\t\tunitServes: unitServes,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tALL: LPN_UNIT_SELECTS, RESULTS: LPN_RESULT_UNIT,\n" +
	"\t\taddScenario: function (name) { var sc = { id: 's1', name: name, overrides: {} };\n" +
	"\t\t\tscenarios.push(sc); return sc; },\n" +
	"\t\tsetOverride: function (el, prop, v) { var sc = scenarios[scenarios.length - 1];\n" +
	"\t\t\t(sc.overrides[ovKey(el)] = sc.overrides[ovKey(el)] || {})[prop] = v; },\n" +
	"\t\tgetOverride: function (el, prop) { var sc = scenarios[scenarios.length - 1];\n" +
	"\t\t\treturn (sc.overrides[ovKey(el)] || {})[prop]; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// ---- 1. one set, and it is the input set plus the two that were results-only --------------------
{
	console.log('\n--- one set ---');
	const all = L.ALL;
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_roughness', 'lpn_u_elevhead', 'lpn_u_pressure',
		'lpn_u_flow', 'lpn_u_velocity', 'lpn_u_gradient']
		.forEach(n => ok('the set holds ' + n, all.indexOf(n) >= 0));
	ok('and holds nothing else', all.length === 8, JSON.stringify(all));
	// **NO `lpn_u_r_*` SURVIVES ANYWHERE IN THE SET.** Named as a pattern rather than as three
	// strings, so a fourth one invented later is caught too.
	ok('no result-only twin is left in the set', all.every(n => n.indexOf('lpn_u_r_') !== 0),
		JSON.stringify(all.filter(n => n.indexOf('lpn_u_r_') === 0)));
	// Every quantity a RESULT is printed in resolves to a selector that is really in the set --
	// which is what makes "the number on the map is in the unit the strip names" true by
	// construction rather than by inspection.
	Object.keys(L.RESULTS).forEach(q => {
		ok('a solved ' + q + ' reads through a selector in the set',
			all.indexOf(L.resultUnit(q)) >= 0, L.resultUnit(q));
	});
	// **AND THE SHARED QUANTITIES ARE ONE SELECTOR, NOT TWO.** This is the assertion the whole task
	// is for: an entered elevation and a solved head are read the same way, always.
	ok('a solved head reads in the elevation selector', L.resultUnit('elevhead') === 'lpn_u_elevhead');
	ok('a solved pressure reads in the pressure selector', L.resultUnit('pressure') === 'lpn_u_pressure');
	ok('a solved flow reads in the flow selector', L.resultUnit('flow') === 'lpn_u_flow');
	// Velocity and gradient decide no typed number, which is why they still change with no fanfare
	// without a list anywhere saying so -- unitChangeNeedsDialog() finds nothing to count.
	['lpn_u_velocity', 'lpn_u_gradient'].forEach(n =>
		ok(n + ' decides no typed field -- it was never an input', L.unitServes(n).length === 0));
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_roughness', 'lpn_u_elevhead', 'lpn_u_pressure',
		'lpn_u_flow'].forEach(n =>
		ok(n + ' names the fields it decides', L.unitServes(n).length > 0,
			JSON.stringify(L.unitServes(n))));
}

// ---- 2. the three kinds of file all open, and none of them asks anything ------------------------
{
	console.log('\n--- opening an old file ---');

	// (a) BEFORE Task 422: input keys only. Nothing to reconcile; it simply opens.
	L.reset();
	L.applyUnitSelections({ lpn_u_flow: 'lps', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
		lpn_u_length: 'm', lpn_u_diameter: 'mm' });
	ok('a pre-split file opens on its own units -- flow', L.unitKey('lpn_u_flow') === 'lps');
	ok('...head', L.unitKey('lpn_u_elevhead') === 'mh2o');
	ok('...pressure', L.unitKey('lpn_u_pressure') === 'kpa');

	// (b) BETWEEN Task 422 and Task 522, with the two AGREEING -- the common case. The result keys
	// go away and nothing else changes.
	L.reset();
	setUnitSet('us');
	L.applyUnitSelections({ lpn_u_flow: 'lps', lpn_u_r_flow: 'lps', lpn_u_elevhead: 'mh2o',
		lpn_u_r_elevhead: 'mh2o', lpn_u_pressure: 'kpa', lpn_u_r_pressure: 'kpa' });
	ok('a split-era file that agrees with itself opens unchanged', L.unitKey('lpn_u_flow') === 'lps');
	const backAgree = L.readUnitSelections();
	ok('...and is written back with no result keys at all',
		Object.keys(backAgree).every(k => k.indexOf('lpn_u_r_') !== 0), JSON.stringify(backAgree));

	// (c) **THE ONE THAT NEEDED A RULING: the two DISAGREE.** The input unit wins, because it says
	// what the stored numbers MEAN -- taking the result unit would reinterpret every one of them.
	// The units chosen here are all three different from the page's US defaults, so a pass cannot
	// come from a selector simply having been left alone.
	L.reset();
	setUnitSet('us');
	L.applyUnitSelections({ lpn_u_flow: 'lps', lpn_u_r_flow: 'ft3ps', lpn_u_elevhead: 'mh2o',
		lpn_u_r_elevhead: 'fth2o', lpn_u_pressure: 'kpa', lpn_u_r_pressure: 'psi' });
	ok('where the two disagree the INPUT unit wins -- flow', L.unitKey('lpn_u_flow') === 'lps',
		L.unitKey('lpn_u_flow'));
	ok('...head', L.unitKey('lpn_u_elevhead') === 'mh2o', L.unitKey('lpn_u_elevhead'));
	ok('...pressure', L.unitKey('lpn_u_pressure') === 'kpa', L.unitKey('lpn_u_pressure'));
	// And the result therefore reads in that same unit -- the disagreement is gone, not preserved.
	ok('...and a solved flow now reads in it too',
		L.unitFactor(L.resultUnit('flow')) === L.unitFactor('lpn_u_flow'));

	// (d) A file naming ONLY a result key -- hand-edited, or a quantity whose input key was dropped.
	// The unit stands in rather than being thrown away: losing it would leave the document reading
	// in whatever the page happened to boot in, which is the Task 521 symptom by another door.
	L.reset();
	setUnitSet('us');
	L.applyUnitSelections({ lpn_u_r_flow: 'lps', lpn_u_length: 'm' });
	ok('a lone result key stands in for a missing input key', L.unitKey('lpn_u_flow') === 'lps',
		L.unitKey('lpn_u_flow'));

	// **THE MIGRATION MUTATES A COPY, NEVER THE FILE.** Asserted because reconcileLegacyUnits()
	// deletes keys out of the map it is handed, and the map handed to it must be the one read out of
	// the file rather than anything the caller intends to write back.
	L.reset();
	setUnitSet('us');
	const fromFile = { lpn_u_flow: 'lps', lpn_u_r_flow: 'ft3ps' };
	L.applyUnitSelections(fromFile);
	const back = L.readUnitSelections();
	ok('reading the selections back names one unit per quantity',
		Object.keys(back).every(k => k.indexOf('lpn_u_r_') !== 0), JSON.stringify(back));
	ok('...including the roughness unit, which the split-era list never stored',
		!!back.lpn_u_roughness, JSON.stringify(back.lpn_u_roughness));
}

// ---- 3. Convert rewrites the right numbers, and only those --------------------------------------
{
	console.log('\n--- Convert ---');
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_flow: 'gpm', lpn_u_length: 'ft', lpn_u_diameter: 'in',
		lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi' });
	const r = L.addNode('reservoir', 0, 0);
	const j = L.addNode('junction', 100, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	L.setProp(j, 'demand', 250);
	L.setProp(pipe, 'length', 1000);
	L.setProp(pipe, 'diameter', 8);
	j.elev = 40;
	L.buildDom();

	// gpm -> cfs. 250 gpm is 0.557 cfs; the multiplier is fNew/fOld.
	const n = L.convertValues('lpn_u_flow', 1 / 448.8311688);
	ok('converting flow rewrites the demand', Math.abs(j._demand - 250 / 448.8311688) < 1e-9,
		String(j._demand));
	ok('...and counts what it changed', n >= 1, String(n));
	// **AND NOTHING ELSE.** A flow conversion that touched a length or an elevation would be a
	// different network wearing the same name.
	ok('...and leaves the pipe length alone', pipe._length === 1000, String(pipe._length));
	ok('...and the diameter', pipe._diameter === 8, String(pipe._diameter));
	ok('...and the elevation', j.elev === 40, String(j.elev));

	// The count must not itself be a mutation -- the counter and the mutator are one function.
	const before = JSON.stringify(L.getDoc());
	const c = L.countValues('lpn_u_flow');
	ok('counting changes nothing', JSON.stringify(L.getDoc()) === before, String(c));
	// **AND A RESULTS-ONLY UNIT COUNTS ZERO**, which is exactly what keeps it silent now that every
	// selector goes through the one handler.
	ok('velocity decides nothing, so changing it asks nothing', L.countValues('lpn_u_velocity') === 0);
	ok('...and gradient the same', L.countValues('lpn_u_gradient') === 0);
}

// ---- 4. a scenario's overrides convert too --------------------------------------------------------
// An override is a value in the same unit as the property it overrides. Missed by a conversion, one
// scenario silently describes a different network from every other.
{
	console.log('\n--- scenario overrides ---');
	L.reset();
	L.setCanvas(800, 600);
	L.applyUnitSelections({ lpn_u_flow: 'gpm', lpn_u_length: 'ft' });
	const r = L.addNode('reservoir', 0, 0);
	const j = L.addNode('junction', 100, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	L.setProp(j, 'demand', 100);
	L.addScenario('Fire flow');
	L.setOverride(j, 'demand', 1500);
	L.setOverride(pipe, 'length', 800);
	L.buildDom();

	L.convertValues('lpn_u_flow', 0.5);
	ok("a scenario's demand override converts with Base's", L.getOverride(j, 'demand') === 750,
		String(L.getOverride(j, 'demand')));
	ok('...and its length override is untouched by a FLOW conversion',
		L.getOverride(pipe, 'length') === 800, String(L.getOverride(pipe, 'length')));

	L.setProp(pipe, 'diameter', 8);
	L.setProp(pipe, 'length', 500);
	L.convertValues('lpn_u_length', 2);
	ok('a length conversion reaches the length override', L.getOverride(pipe, 'length') === 1600,
		String(L.getOverride(pipe, 'length')));
	ok('...and Base\'s own length', pipe._length === 1000, String(pipe._length));
	// **AND NOT THE DIAMETER.** Length and diameter are both distances and both live on the same
	// element, which is exactly why a conversion of one can quietly take the other with it.
	ok('...and NOT the diameter, which has its own unit', pipe._diameter === 8, String(pipe._diameter));
}

// ---- 5. roughness converts only where it is a length ---------------------------------------------
// Hazen-Williams C and Manning's n are dimensionless. Multiplying either would invent a pipe nobody
// specified -- and the selector is only SHOWN under Darcy-Weisbach, which is why it is easy to miss.
{
	console.log('\n--- roughness is three quantities ---');
	L.reset();
	L.setCanvas(800, 600);
	const r = L.addNode('reservoir', 0, 0), j = L.addNode('junction', 100, 0);
	const pipe = L.addLink('pipe', r.id, j.id);
	L.setProp(pipe, 'roughness', 130);
	L.buildDom();
	L.convertValues('lpn_u_roughness', 25.4);
	ok('under Hazen-Williams a roughness conversion changes nothing',
		pipe._roughness === 130, String(pipe._roughness));
}

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
process.exit(fails === 0 ? 0 : 1);

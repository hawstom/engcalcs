// INPUT UNITS AND RESULT UNITS ARE TWO GROUPS -- ROADMAP Task 422. Run with:
//   node dev/lpn-spike/unit-split-harness.js
//
// WHY THIS EXISTS. Tom switched Net3's flow unit from gpm to cfs and a 6,104 gpm main read
// 1,338 cfs. Nothing was broken: the demands he typed were REINTERPRETED as cfs, the network became
// 449x bigger, and the solver answered honestly. But "I changed how I read the answers" and "I
// changed what the model is" had the same control, and only one of them was what he meant.
//
// The split makes them two controls. What has to hold, and what each failure looks like:
//
//   1. **A result unit changes the reading and NOTHING ELSE.** If a result conversion ever went
//      through an input unit, the number on the map would be right only while the two happened to
//      agree -- which is the default, so it would look correct until the day somebody split them.
//   2. **An input unit still means what the standing rule says.** Reinterpret leaves every stored
//      number alone; that rule is CLAUDE.md's and is marked absolute.
//   3. **Convert rewrites the RIGHT numbers, including scenario overrides.** An override missed by a
//      conversion leaves one scenario describing a different network from the others, silently, and
//      only inside that scenario.
//   4. **A file written before the split still reads its results exactly as it did.** Its `units`
//      names no result key at all.

const { byId, setUnitSet, loadLoopedNetwork, unitSelects } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, buildDom: buildDom,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tresultUnit: resultUnit, unitFactor: unitFactor, unitKey: unitKey,\n" +
	"\t\tconvertValues: convertUnitValues, countValues: countUnitValues,\n" +
	"\t\tunitServes: unitServes,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tINPUTS: LPN_INPUT_SELECTS, ALL: LPN_UNIT_SELECTS,\n" +
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

// ---- 1. the two groups are declared, and the shared quantities are in both ----------------------
{
	console.log('\n--- the two groups ---');
	const inputs = L.INPUTS, all = L.ALL;
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_roughness', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow']
		.forEach(n => ok('input group holds ' + n, inputs.indexOf(n) >= 0));
	['lpn_u_velocity', 'lpn_u_gradient'].forEach(n =>
		ok(n + ' is a RESULT only -- it was never an input', inputs.indexOf(n) < 0));
	// The three that serve both sides are duplicated. That is the whole shape of the task.
	['lpn_u_r_elevhead', 'lpn_u_r_pressure', 'lpn_u_r_flow'].forEach(n => {
		ok(n + ' exists as its own selector', all.indexOf(n) >= 0);
		ok('...and is not in the input group', inputs.indexOf(n) < 0);
	});
	// Every input unit can say which typed fields it decides -- that list is what the warning names
	// AND what a conversion touches, so an empty one would be a silent no-op.
	inputs.forEach(n => ok(n + ' names the fields it decides', L.unitServes(n).length > 0,
		JSON.stringify(L.unitServes(n))));
}

// ---- 2. a file written before the split still reads its results the same way ---------------------
{
	console.log('\n--- an older file ---');
	L.reset();
	// No result keys at all, which is every project ever saved before today -- and units that are
	// NOT the ones the strip starts on, or the twin default would be indistinguishable from the
	// selectors simply having been left alone.
	L.applyUnitSelections({ lpn_u_flow: 'lps', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
		lpn_u_length: 'm', lpn_u_diameter: 'mm' });
	ok('a missing result unit reads as its input twin -- flow',
		L.unitFactor(L.resultUnit('flow')) === L.unitFactor('lpn_u_flow'),
		L.unitFactor(L.resultUnit('flow')) + ' vs ' + L.unitFactor('lpn_u_flow'));
	ok('...head', L.unitFactor(L.resultUnit('elevhead')) === L.unitFactor('lpn_u_elevhead'));
	ok('...pressure', L.unitFactor(L.resultUnit('pressure')) === L.unitFactor('lpn_u_pressure'));
	// And reading it back writes the result keys out, so the file says what it means from now on.
	const back = L.readUnitSelections();
	ok('reading the selections back names the result units too',
		!!back.lpn_u_r_flow && !!back.lpn_u_r_elevhead && !!back.lpn_u_r_pressure, JSON.stringify(back));
}

// ---- 3. the two sides really are independent -----------------------------------------------------
// **THE ASSERTION THE WHOLE TASK IS FOR.** Change the result unit and the input factor must not
// move; change the input unit and the result factor must not.
{
	console.log('\n--- independence ---');
	L.reset();
	L.applyUnitSelections({ lpn_u_flow: 'gpm', lpn_u_r_flow: 'gpm' });
	const inBefore = L.unitFactor('lpn_u_flow');
	L.applyUnitSelections({ lpn_u_flow: 'gpm', lpn_u_r_flow: 'ft3ps' });
	ok('changing the RESULT flow unit leaves the input unit alone',
		L.unitFactor('lpn_u_flow') === inBefore, L.unitFactor('lpn_u_flow') + ' vs ' + inBefore);
	ok('...and really did change the result unit',
		L.unitFactor(L.resultUnit('flow')) !== inBefore, String(L.unitFactor(L.resultUnit('flow'))));

	const resBefore = L.unitFactor(L.resultUnit('flow'));
	L.applyUnitSelections({ lpn_u_flow: 'lps', lpn_u_r_flow: 'ft3ps' });
	ok('changing the INPUT flow unit leaves the result unit alone',
		L.unitFactor(L.resultUnit('flow')) === resBefore);
}

// ---- 4. Convert rewrites the right numbers, and only those --------------------------------------
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
	const k = L.unitFactor('lpn_u_flow');   // gpm per m3/s
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
}

// ---- 5. a scenario's overrides convert too --------------------------------------------------------
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

// ---- 6. roughness converts only where it is a length ---------------------------------------------
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

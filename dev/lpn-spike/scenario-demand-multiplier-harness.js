// A SCENARIO CARRIES ITS OWN DEMAND MULTIPLIER -- utility-planning-engineer wish list, row 1.
//   node dev/lpn-spike/scenario-demand-multiplier-harness.js
//
// Tom, on the row: *"Nice."* The case for it, in the agent's own words and CITED there: the same
// three scenario names recur across every published water master plan it read, independently --
// average day, maximum day, peak hour. Today the only way to build "max day" as an overlay on
// "average day" is to hand-edit every junction's demand in the new scenario, because this page's
// one bulk-write tool refuses inside a scenario by design.
//
// **WHAT IS BEING ASSERTED IS THAT THERE IS STILL ONLY ONE MULTIPLIER.** The design decision that
// costs the most if it is got wrong is not the arithmetic, it is the shape: EPANET has exactly one
// `[OPTIONS] Demand Multiplier` per file, and a scenario already stands in for a file, so this is
// the EXISTING option made overridable and not a fourth multiplier concept. So the assertions
// follow the number through every door it can leave by -- the solve, the engine bridge, the `.inp`
// export, the save file and the scenario badge -- and check it is the same number in all of them.
//
// **AND THE ONE THAT IS EASY TO GET BACKWARDS:** an overridden node demand is NOT an escape from
// the multiplier. It is multiplied exactly like a Base one, which is EPANET's own behaviour and
// WNTR's, and is already what this page does with the document-wide multiplier.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, ensure } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom,\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, effective: effective,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveScenario: activeScenario, inBase: inBaseScenario,\n" +
	"\t\toverrideCount: function (s) { return overrideCount(s || activeScenario()); },\n" +
	"\t\tresolvedDemand: resolvedDemand, docDM: docDemandMultiplier,\n" +
	"\t\tscenarioDM: scenarioDemandMultiplier,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), {\n" +
	"\t\t\teffective: effective, demandMultiplier: scenarioDemandMultiplier() }); },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('us');
void ensure;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A reservoir feeding two junctions, each asking for 100 (display units).
L.seedDefaultInputs();
const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
L.buildDom();
const r = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 100, 0);
const j2 = L.addNode('junction', 200, 0);
L.addLink('pipe', r.id, j1.id);
L.addLink('pipe', j1.id, j2.id);
L.setProp(j1, 'demand', 100);
L.setProp(j2, 'demand', 100);

// ---------------------------------------------------------------------------
// 1. BASE IS UNCHANGED. Everything below is an addition to a document that has
//    never seen one, so a project with no scenarios must behave exactly as it
//    did -- multiplier 1, and no `Demand Multiplier` line in an export.
// ---------------------------------------------------------------------------
console.log('\n--- a document that says nothing still says nothing ---');
{
	ok('a fresh document multiplies by 1', L.docDM() === 1, L.docDM());
	ok('...and Base carries no multiplier of its own', L.scenarioDM() === undefined, L.scenarioDM());
	ok('...so a junction asking for 100 gets 100', L.resolvedDemand(j1) === 100, L.resolvedDemand(j1));
	const inp = L.exportInp();
	ok('...and the exported file states no Demand Multiplier',
		inp.ok && inp.inp.indexOf('Demand Multiplier') < 0);
}

// ---------------------------------------------------------------------------
// 2. THE DOCUMENT'S OWN MULTIPLIER still works exactly as Task 553 shipped it.
// ---------------------------------------------------------------------------
console.log('\n--- the document-level option is untouched ---');
{
	L.getSettings().hydraulics = L.getSettings().hydraulics || {};
	L.getSettings().hydraulics.demandMultiplier = 1.2;
	ok('the document\'s multiplier resolves', L.docDM() === 1.2, L.docDM());
	ok('...and reaches the demand', Math.abs(L.resolvedDemand(j1) - 120) < 1e-9, L.resolvedDemand(j1));
	const inp = L.exportInp();
	ok('...and is exported', inp.ok && /Demand Multiplier\s+1\.2/.test(inp.inp));
}

// ---------------------------------------------------------------------------
// 3. THE SCENARIO'S OWN. One number instead of one edit per junction, which is
//    the whole want.
// ---------------------------------------------------------------------------
console.log('\n--- a scenario carries its own ---');
{
	const maxDay = L.createScenario('Maximum day');
	// **TOM'S DEFECT, 2026-09-02:** *"Creating a Scenario blanks the demand multiplier. It should
	// preserve it until you change it as with all other settings."* It is SEEDED rather than left
	// blank-and-inheriting, because the Settings row draws what the scenario actually holds and an
	// empty box beside nine filled ones reads as a setting that was lost. Both halves are asserted:
	// the number the user sees, and the badge that must not claim a change nobody made.
	ok('a new scenario is born with the document\'s multiplier', L.scenarioDM() === 1.2, L.scenarioDM());
	ok('...so it resolves unchanged', L.docDM() === 1.2, L.docDM());
	ok('...and the badge says nothing was overridden', L.overrideCount(maxDay) === 0,
		L.overrideCount(maxDay));

	maxDay.demandMultiplier = 1.8;
	ok('...and says one once it differs', L.overrideCount(maxDay) === 1, L.overrideCount(maxDay));
	ok('setting one resolves to it, not to the document\'s', L.docDM() === 1.8, L.docDM());
	ok('...and every junction moves at once, with no per-node edit',
		Math.abs(L.resolvedDemand(j1) - 180) < 1e-9 && Math.abs(L.resolvedDemand(j2) - 180) < 1e-9,
		L.resolvedDemand(j1) + ', ' + L.resolvedDemand(j2));

	// **AN OVERRIDDEN NODE DEMAND IS NOT AN ESCAPE FROM IT.** EPANET's and WNTR's own behaviour,
	// and already what this page does with the document-wide multiplier. Getting this backwards
	// would be silent: every number on screen still looks like a number.
	L.setProp(j2, 'demand', 50);
	ok('an overridden node demand is multiplied too, exactly like a Base one',
		Math.abs(L.resolvedDemand(j2) - 90) < 1e-9, L.resolvedDemand(j2));
	L.setProp(j2, 'demand', 100);

	// Base does not move. The whole point of a scenario.
	L.switchScenario('base');
	ok('Base is untouched', L.docDM() === 1.2 && Math.abs(L.resolvedDemand(j1) - 120) < 1e-9,
		L.docDM() + ', ' + L.resolvedDemand(j1));
	L.switchScenario(maxDay.id);

	// Blank means inherit, in the scenario exactly as it means "the file did not say" in Base.
	delete maxDay.demandMultiplier;
	ok('clearing it inherits again', L.docDM() === 1.2, L.docDM());
	maxDay.demandMultiplier = 1.8;
}

// ---------------------------------------------------------------------------
// 4. EVERY DOOR THE NUMBER LEAVES BY. If it is right in the solve and wrong in
//    one of these, the screen and the deliverable disagree and nothing says so.
// ---------------------------------------------------------------------------
console.log('\n--- the same number, whichever way it leaves ---');
{
	// The engine bridge. On a one-instant run the demands already carry it (section 3); on an
	// extended-period run the engine multiplies from this option, so this is the only place it can
	// arrive, and it must be the SCENARIO'S.
	const m = L.assembleModel();
	ok('the engine is told the scenario\'s multiplier', m.hydraulics.demandMultiplier === 1.8,
		m.hydraulics.demandMultiplier);
	// **AND THE DOCUMENT'S OWN COPY IS NOT REWRITTEN**, which is the rule the whole units paradigm
	// rests on: what came from the file stays as it came.
	ok('...without rewriting the document\'s own copy',
		L.getSettings().hydraulics.demandMultiplier === 1.2,
		L.getSettings().hydraulics.demandMultiplier);

	// The export, which is what a utility actually hands over.
	const inp = L.exportInp();
	ok('an export from inside the scenario states the scenario\'s number',
		inp.ok && /Demand Multiplier\s+1\.8/.test(inp.inp),
		(inp.inp.match(/Demand Multiplier.*/) || [''])[0]);
	ok('...and exactly one such line', inp.ok && (inp.inp.match(/Demand Multiplier/g) || []).length === 1);
	L.switchScenario('base');
	ok('...where an export from Base states the document\'s',
		/Demand Multiplier\s+1\.2/.test(L.exportInp().inp));
	L.switchScenario(L.getScenarios()[1].id);

	// The badge beside the scenario's name. A max-day scenario whose whole content is a 1.8 would
	// otherwise read (0) -- an empty scenario nobody finished.
	ok('the scenario badge counts it as a change', L.overrideCount() >= 1, L.overrideCount());
	ok('...and Base still counts nothing', L.overrideCount(L.getScenarios()[0]) === 0,
		L.overrideCount(L.getScenarios()[0]));

	// The save file. A scenario is serialized whole, so this should already hold -- asserted
	// because "already holds" is exactly the kind of thing that stops holding silently.
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(saved);
	const back = L.getScenarios().filter(function (x) { return !x.isBase; })[0];
	ok('it survives a save and reopen', back && back.demandMultiplier === 1.8,
		back && back.demandMultiplier);
	ok('...and is live again on reopen', L.docDM() === 1.8, L.docDM());
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);

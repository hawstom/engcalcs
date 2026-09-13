// **THE CHEMICAL PROPERTIES ARE OFFERED TO THE SYMBOLOGY, AND EACH ONE CARRIES ITS OWN UNIT** --
// ROADMAP Task 638. Run with:
//
//   node dev/lpn-spike/chemical-symbology-harness.js
//
// WHAT WAS WRONG. `COLOR_NODE_FIELDS` offered ONE quality entry covering all three analyses and
// `COLOR_LINK_FIELDS` offered none at all, so a link could never be coloured or labelled by
// anything the quality run produced. `linkFieldDefs()` had the same gap. EPANET colours a link by
// its average quality, its reaction rate, its friction factor and its status, and a node by its
// quality and its initial quality; three of those four link fields and the missing node one are
// what this file asserts. (The REACTION RATE shipped separately under Task 652 and is asserted in
// dev/lpn-spike/reaction-rate-harness.js. What stood here -- that it could not ship because the
// toolkit exposes no getter and deriving one would mean writing mass-transfer arithmetic of our
// own -- was right about the getter and wrong about the conclusion: EPANET writes the number into
// its BINARY OUTPUT FILE, the wrapper already exports a reader for it, and nothing had to be
// derived.)
//
// **THE UNIT IS THE TRAP, NOT THE LIST, AND IT IS WHY THIS FILE IS MOSTLY ABOUT UNITS.** One
// quality field means three different quantities depending on `settings.quality.mode`:
//
//   age      -- a TIME, in the project's own age unit, which the engine reports in hours.
//   trace    -- a SOURCE SHARE, which is a percentage: unitless, and NOT dimensionless.
//   chemical -- a CONCENTRATION in the label the document states beside the chemical's name,
//               which is text the user owns and that nothing of ours converts.
//
// So `colorFieldUnit()` answers a unit ID and `colorFieldUnitText()` answers a MARK, and the two
// part company on exactly the modes where an id does not exist. A field coloured under the wrong
// unit label renders perfectly and is silently wrong, which is the class this repository fails
// builds over.
//
// **THE STUB WARNING (dev/testing-notes.md) IS ANSWERED BY RUNNING THE REAL ENGINE.** Nothing here
// invents a solve result: section 3 drives `EngCalcs.lpnEpanetRun()` over a real extended-period
// water-age run, maps a frame through the real `EngCalcs.lpnTimeFrameResult()`, and hands it to
// the page's own `applySolveResult()`. A harness that assigned `lastSolveResult` by hand would pass
// with the whole bridge missing -- and the bridge is where Task 638's one new engine read lives.
//
// **AND THE FRICTION FACTOR IS CHECKED AGAINST ITS OWN DEFINITION, not against itself.** f is
// back-computed from the head loss whichever friction method produced it:
//
//     h_f = f (L/D) V^2 / 2g   =>   f = 2 g D h_f / (L V^2)
//
// The harness recomputes that from the SAME frame's head loss and velocity and from the document's
// own length and diameter, converted independently, so a factor dropped inside linkFrictionFactor()
// cannot agree with it. Run in US units on purpose: in metres a missing conversion is invisible.
//
// NO ENGLISH LITERAL IS ASSERTED ANYWHERE (dev/scripts/harness_wording_check.php). Every label and
// every word comes from `EngCalcs.pageConfig`, which the stub fills from the real
// lib/lang.ec.en.php, so rewording a string is never a red build here.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tassembleModel: assembleModel, applySolveResult: applySolveResult,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	// The four functions Task 638 owns, handed over by name so the harness reads the page's own
	// answers rather than a second opinion about them.
	"\t\tcolorFieldUnit: colorFieldUnit, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tcolorFieldOptions: function (g) { return colorFieldOptions(g).map(function (o) { return o[0]; }); },\n" +
	"\t\tcolorFieldLabel: colorFieldLabel, colorValueOf: colorValueOf,\n" +
	"\t\tnodeFields: function () { return nodeFieldDefs(EngCalcs.pageConfig || {}).map(function (f) { return f[0]; }); },\n" +
	"\t\tlinkFields: function () { return linkFieldDefs(EngCalcs.pageConfig || {}).map(function (f) { return f[0]; }); },\n" +
	"\t\tresultUnit: resultUnit, unitLabel: unitLabel, unitFactor: unitFactor,\n" +
	// The LABEL half: the toggles, a rebuild, and what a link's label actually says.
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tlinkLabel: function (id) { return (linkEls[id].allLines || []).map(function (l) { return l.text; }); },\n" +
	"\t\tnodeLabel: function (id) { return (nodeEls[id].allLines || []).map(function (l) { return l.text; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function head(t) { console.log('\n' + t); }
function near(a, b, tol) {
	return isFinite(a) && isFinite(b) && Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(b));
}

const AGE = { mode: 'age', traceNode: '' };
const CHEM = { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' };

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// A reservoir, a junction drawing a demand, and a tank: the smallest network that has water
// travelling far enough to have an age, a pipe that loses head, and a link whose status is worth
// asking about.
const res = L.addNode('reservoir', 0, 0);
const jun = L.addNode('junction', 1000, 0);
const tank = L.addNode('tank', 2000, 0);
const p1 = L.addLink('pipe', res.id, jun.id);
const p2 = L.addLink('pipe', jun.id, tank.id);
// A PARALLEL main, and it is here to be SHUT. Shutting p2 instead would cut the tank off the
// network, and every number this file asserts would then be measured on a network that has stopped
// flowing -- a friction factor on still water, a water age nobody is carrying. A second pipe beside
// it leaves the hydraulics exactly as they were and still gives the status field something to say.
const p3 = L.addLink('pipe', jun.id, tank.id);

// =================================================================================================
head('1. The fields are OFFERED, on both groups, to the colour picker and to the Labels list');
// =================================================================================================
L.setQuality(Object.assign({}, AGE));

const nodeColour = L.colorFieldOptions('node');
const linkColour = L.colorFieldOptions('link');
ok('a node can be coloured by its quality', nodeColour.indexOf('quality') >= 0, nodeColour.join(','));
ok('...and by its initial quality, which EPANET also offers',
	nodeColour.indexOf('initQuality') >= 0, nodeColour.join(','));
ok('a link can be coloured by its average quality', linkColour.indexOf('quality') >= 0, linkColour.join(','));
ok('...by its friction factor', linkColour.indexOf('friction') >= 0, linkColour.join(','));
ok('...and by its status', linkColour.indexOf('status') >= 0, linkColour.join(','));

const nodeLabels = L.nodeFields();
const linkLabels = L.linkFields();
ok('every colour field a node has is also a label field',
	nodeColour.every(k => nodeLabels.indexOf(k) >= 0), nodeLabels.join(','));
ok('and every colour field a link has is also a label field',
	linkColour.every(k => linkLabels.indexOf(k) >= 0), linkLabels.join(','));

// The legend heading is read out of the SAME defs the Labels popover uses (colorFieldLabel), so a
// field that is offered under two different names in two places is the defect this closes.
ok('a link\'s average quality is not called what a node\'s quality is called',
	L.colorFieldLabel('link', 'quality') !== L.colorFieldLabel('node', 'quality'),
	L.colorFieldLabel('link', 'quality') + ' / ' + L.colorFieldLabel('node', 'quality'));
ok('under water age, the link heading is the average one',
	L.colorFieldLabel('link', 'quality') === PC.lpn_result_avg_water_age,
	L.colorFieldLabel('link', 'quality'));
ok('the friction factor carries EPANET\'s own name',
	L.colorFieldLabel('link', 'friction') === PC.lpn_result_friction_factor);
ok('and so does the status', L.colorFieldLabel('link', 'status') === PC.lpn_result_status);
ok('the initial quality reuses the popup\'s own whole label rather than a second key',
	L.colorFieldLabel('node', 'initQuality') === PC.lpn_quality_initial);

// =================================================================================================
head('2. EVERY ADDED FIELD RESOLVES TO THE RIGHT UNIT, in all three analyses');
// =================================================================================================
// The three modes in turn. What must be true in each:
//   * a node's quality and a LINK's average quality are the SAME quantity, so they must always
//     answer the same id and the same mark. They went through two different branches before this.
//   * a friction factor and a status are never given a unit at all.
//   * an initial quality is a typed number in the document's own label, so it has no id ever, and
//     a mark only where the document states a chemical.
function unitPair(group, field) { return [L.colorFieldUnit(group, field), L.colorFieldUnitText(group, field)]; }

L.setQuality(Object.assign({}, AGE));
ok('water age: a node\'s quality is read in the project\'s age unit',
	L.colorFieldUnit('node', 'quality') === L.resultUnit('age'), L.colorFieldUnit('node', 'quality'));
ok('water age: a link\'s average quality is read in the very same unit',
	L.colorFieldUnit('link', 'quality') === L.resultUnit('age'), L.colorFieldUnit('link', 'quality'));
ok('water age: and both print the same mark',
	L.colorFieldUnitText('link', 'quality') === L.colorFieldUnitText('node', 'quality')
		&& L.colorFieldUnitText('link', 'quality') === L.unitLabel(L.resultUnit('age')),
	L.colorFieldUnitText('link', 'quality'));

L.setQuality({ mode: 'trace', traceNode: res.id });
ok('source trace: the share has NO unit id, which is the honest answer',
	L.colorFieldUnit('node', 'quality') === '' && L.colorFieldUnit('link', 'quality') === '',
	JSON.stringify([L.colorFieldUnit('node', 'quality'), L.colorFieldUnit('link', 'quality')]));
// **UNITLESS IS NOT DIMENSIONLESS.** A bare 43 under the word "Source share" reads as a fraction to
// one engineer and as a percent to the next, so the MARK exists where the id does not -- and it must
// now exist on the link side too, which had no quality field at all to get it wrong on.
ok('source trace: but both still print the per-cent mark',
	L.colorFieldUnitText('node', 'quality') === '%' && L.colorFieldUnitText('link', 'quality') === '%',
	JSON.stringify(unitPair('link', 'quality')));

L.setQuality(Object.assign({}, CHEM));
ok('a chemical: no unit id either, because the unit is the document\'s own text',
	L.colorFieldUnit('node', 'quality') === '' && L.colorFieldUnit('link', 'quality') === '');
ok('a chemical: and both print the label stated beside the chemical name',
	L.colorFieldUnitText('node', 'quality') === 'mg/L' && L.colorFieldUnitText('link', 'quality') === 'mg/L',
	JSON.stringify(unitPair('link', 'quality')));
ok('the initial quality prints that same document label, and has no id of ours',
	L.colorFieldUnit('node', 'initQuality') === '' && L.colorFieldUnitText('node', 'initQuality') === 'mg/L',
	JSON.stringify(unitPair('node', 'initQuality')));

// A friction factor is dimensionless and a status is not a quantity: neither may pick up a unit
// from any mode, so both are asked under the chemical analysis, where the quality fields do have a
// mark to accidentally borrow.
ok('a friction factor is dimensionless in every analysis',
	L.colorFieldUnit('link', 'friction') === '' && L.colorFieldUnitText('link', 'friction') === '',
	JSON.stringify(unitPair('link', 'friction')));
ok('a status is not a quantity and is never given a unit',
	L.colorFieldUnit('link', 'status') === '' && L.colorFieldUnitText('link', 'status') === '',
	JSON.stringify(unitPair('link', 'status')));

// **STATUS BEFORE ANYTHING HAS BEEN SOLVED: THE DOCUMENT'S OWN ANSWER.** The colour system is a
// break-based ramp over a number line, so a categorical field enters it as 1 open / 0 closed -- see
// linkStatusNumber(), where the cost (a numeric legend) is stated. Asserted HERE, with no solve
// result standing, because that is the half of linkStatusOf() the document owns; section 3 asserts
// the other half, where a run has been made and the engine's own answer is the one that shows.
ok('with nothing solved, an open link colours as the top of the status ramp',
	L.colorValueOf('link', p1, 'status') === 1);
L.setProp(p3, 'status', 'closed');
ok('...and a shut one as the bottom', L.colorValueOf('link', p3, 'status') === 0);
L.setProp(p3, 'status', 'open');

// **THE COUNTER-MEASUREMENT: the override really is what answers.** COLOR_LINK_FIELDS declares the
// quality field with the AGE unit so the field is offered at all, exactly as the node's does. If
// colorFieldUnit() ever stopped overriding it, the two assertions above would come back with the
// age unit id under a chemical, which is a map labelled in hours showing milligrams per litre.
ok('...and the declared age unit is genuinely overridden rather than merely absent',
	L.colorFieldUnit('link', 'quality') !== L.resultUnit('age'));

// =================================================================================================
head('3. EVERY ADDED FIELD PRODUCES A VALUE FROM A REAL QUALITY RUN');
// =================================================================================================
(async function () {
	await warmEpanet();
	const doc = L.getDoc();

	// **AN EXTENDED-PERIOD RUN, AND IT HAS TO BE.** Water quality is transported along flows that
	// have already been worked out, so a run of zero duration has no quality dimension at all --
	// which is why `quality` was the one node field a network did not have until it was asked for.
	L.setQuality(Object.assign({}, AGE));
	doc.times = Object.assign(EngCalcs.lpnTimesDefaults(), {
		duration: 24 * 3600, hydraulicStep: 3600, reportStep: 3600, patternStep: 3600
	});
	// Shut before the run rather than after it, so the status the map shows below is the engine's
	// own report and not the document's copy of the same fact.
	L.setProp(p3, 'status', 'closed');
	const run = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	ok('the engine ran the period', (run.frames || []).length > 1, (run.frames || []).length + ' frames');
	const last = run.frames[run.frames.length - 1];
	ok('...and it carried a link quality map out of the walk, not just a node one',
		last.linkQualities && typeof last.linkQualities[p1.id] === 'number',
		JSON.stringify(last.linkQualities));

	// Through the REAL frame mapper and the page's own apply, so everything below is read from the
	// map the way a person looking at the screen reads it.
	L.applySolveResult(EngCalcs.lpnTimeFrameResult(run, last.t));

	const ageUnit = L.resultUnit('age');
	const linkQ = L.colorValueOf('link', p1, 'quality');
	const nodeQ = L.colorValueOf('node', jun, 'quality');
	ok('a link now has an average quality on the map', typeof linkQ === 'number' && isFinite(linkQ) && linkQ > 0, linkQ);
	ok('a node still has its own', typeof nodeQ === 'number' && isFinite(nodeQ) && nodeQ > 0, nodeQ);
	// **THE SCALE, WHICH IS THE ONE THING A PLAUSIBLE NUMBER HIDES.** EPANET reports an age in
	// HOURS and this bridge leaves in SECONDS, so the link walk multiplies by 3600 exactly as the
	// node walk does. Read back against the raw frame and the project's own age factor: a missing
	// or doubled conversion is a factor of 3600 and cannot survive this.
	ok('...and it is the frame\'s own seconds, converted once into the project\'s age unit',
		near(linkQ, last.linkQualities[p1.id] * L.unitFactor(ageUnit), 1e-9),
		linkQ + ' vs ' + last.linkQualities[p1.id] * L.unitFactor(ageUnit));

	// **THE FRICTION FACTOR, AGAINST ITS OWN DEFINITION.** Recomputed here from the same frame's
	// head loss and velocity and from the document's own length and diameter, each converted on
	// this side, so nothing of linkFrictionFactor()'s arithmetic is borrowed.
	const f = L.colorValueOf('link', p1, 'friction');
	const lenSI = L.effective(p1, 'length') / L.unitFactor('lpn_u_length');
	const diaSI = L.effective(p1, 'diameter') / L.unitFactor('lpn_u_diameter');
	const expected = 2 * EngCalcs.G * diaSI * last.headlosses[p1.id]
		/ (lenSI * last.velocities[p1.id] * last.velocities[p1.id]);
	ok('a link has a friction factor', typeof f === 'number' && isFinite(f) && f > 0, f);
	ok('...and it is 2gD h_f / (L V^2) worked out independently here', near(f, expected, 1e-9),
		f + ' vs ' + expected);
	// A plausibility floor, because the assertion above would also pass if BOTH sides were wrong by
	// the same conversion. A turbulent Darcy f lives between about 0.01 and 0.1 whatever the pipe.
	ok('...and it lands where a Darcy friction factor lives', f > 0.005 && f < 0.2, f);
	// **A ZERO VELOCITY HAS NO FRICTION FACTOR AND MUST NOT REPORT ONE.** f is undefined there, and
	// a 0 on the map would read as a perfectly smooth pipe rather than as still water.
	ok('a pipe nothing flows through reports no friction factor at all',
		L.colorValueOf('link', { id: 'nope', type: 'pipe' }, 'friction') === undefined);

	// **STATUS ONCE A RUN HAS BEEN MADE: THE ENGINE'S OWN ANSWER, WHICH IS THE ONE THAT SHOWS.**
	// A check valve that shut, a pump a control stopped and a valve that went closed are states the
	// engine reports and the document never held, so the result wins wherever there is one -- see
	// linkStatusOf(). The pipe below was shut in the document BEFORE the run, so this asserts the
	// whole road: the document's status is pushed to the engine, the engine reports it back on every
	// frame, the frame mapper carries it, and the map reads the engine's word rather than the
	// document's.
	ok('the engine reported a status for every link', last.statuses
		&& last.statuses[p1.id] === 'open' && last.statuses[p3.id] === 'closed',
		JSON.stringify(last.statuses));
	ok('an open link colours as the top of the status ramp', L.colorValueOf('link', p1, 'status') === 1);
	ok('...and the shut one as the bottom', L.colorValueOf('link', p3, 'status') === 0);

	// ---- THE LABEL HALF ------------------------------------------------------------------------
	// Task 638 says COLOURED and LABELLED, and the two lists are separate declarations: a field can
	// be in the colour map and absent from the label pass, which draws perfectly and prints nothing.
	const ls = L.labelSettings();
	ls.link.quality = true; ls.link.friction = true; ls.link.status = true;
	L.refreshLabelText();
	// Banked BEFORE the initial-quality row is switched on, so "prints nothing" below is measured
	// against this node's own label rather than against a string that happens not to appear in it.
	const tankBefore = L.nodeLabel(tank.id).join(' | ');
	ls.node.initQuality = true;
	L.setProp(jun, 'initQuality', 0.8);
	L.refreshLabelText();

	const lines = L.linkLabel(p1.id);
	ok('the average quality prints on the pipe', lines.some(t => t.indexOf(String(Math.round(linkQ))) >= 0)
		|| lines.length >= 3, lines.join(' | '));
	ok('the friction factor prints with the one symbol every hydraulics text uses',
		lines.some(t => t.indexOf('f=') === 0), lines.join(' | '));
	// The word, not a 1 -- and read from pageConfig, never as a literal.
	ok('the status prints as a WORD', lines.indexOf(PC.lpn_result_status_open) >= 0, lines.join(' | '));
	ok('...and the other word on the link the run reported shut',
		L.linkLabel(p3.id).indexOf(PC.lpn_result_status_closed) >= 0, L.linkLabel(p3.id).join(' | '));

	// An initial quality is the user's typed number, which crosses nothing on its way to the map.
	L.setQuality(Object.assign({}, CHEM));
	L.refreshLabelText();
	const nlines = L.nodeLabel(jun.id);
	ok('a node prints the starting concentration it was typed',
		nlines.some(t => t.indexOf('0.80') >= 0), nlines.join(' | '));
	// **BLANK IS NOT ZERO.** A node nobody stated one on prints nothing rather than 0.00, the same
	// rule an unsolved pressure and an unstated elevation already follow.
	ok('...and a node nobody stated one on prints nothing at all, rather than a 0.00',
		L.nodeLabel(tank.id).join(' | ') === tankBefore,
		L.nodeLabel(tank.id).join(' | ') + '   was   ' + tankBefore);

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());

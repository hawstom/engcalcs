// THE CONTROLS FOR THE REACTION COEFFICIENTS -- ROADMAP Task 566, dev/water-quality.md. Run with:
//
//   node dev/lpn-spike/reaction-controls-harness.js
//
// dev/lpn-spike/reaction-anchor-harness.js proves the PHYSICS: that a coefficient reaches the
// engine, that it is converted where it has a length in it, and that the concentration coming back
// is the arithmetic. This proves the other half, which that file cannot see -- that a person can
// reach the numbers at all:
//
//   1. **THE PIPE PAIR HAD A POPUP ROW AND NOTHING ELSE.** Every other overridable link property
//      is also a Tables column and a Find and replace field. A property reachable from one screen
//      out of three is a property most users will never find, and a bulk edit of it -- "every main
//      we relined in 2019" -- had no door at all.
//   2. **THE TANK COEFFICIENT HAD NO CONTROL WHATSOEVER.** It was read from `[REACTIONS] TANK <id>`
//      and written back out, and no screen in the application could show it or change it. Water
//      stands in a tank far longer than it stands in any main, so that is the coefficient most
//      likely to decide what the residual is.
//   3. **A SOURCE SHARE PRINTED NO UNIT.** A bare 43 under the heading "Source share" is a
//      fraction to one reader and a percentage to the next. A percentage is UNITLESS and is not
//      DIMENSIONLESS, and the legend's unit slot takes a unit id, which a percentage has not got.
//
// **THE FOUR WAYS THIS CAN BE WRONG, AND THEY ARE WHY EACH ASSERTION IS SHAPED AS IT IS:**
//
//   * A write that misses `setProp()` looks perfect on screen inside a scenario and has silently
//     changed Base under every other scenario (dev/scenario-seam-repair.md). Asserted the only way
//     it can be from outside: an edit inside a scenario must leave Base's number standing.
//   * A blank cell that stores 0. "Use the global coefficient" and "this pipe does not react" are
//     two different statements about the water, and a pane cell hands back `+'' === 0`.
//   * A control offered where the number it edits is invisible. The coefficients are shown only
//     while a chemical is being tracked, so a Find property or a Tables column that ignored that
//     would let somebody write a value they can then never see.
//   * A value with two homes. The tank coefficient moved off `settings.reactions.tank` onto the
//     tank; if the old map were merely copied rather than moved, the first edit would produce two
//     numbers and no reader could say which one the engine gets.

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tdocReactions: docReactions, serializeProject: serializeProject,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\treadQualitySections: readQualitySections,\n" +
	"\t\tprepareDocument: prepareDocument, applySaved: applySaved,\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	// The popup, the two tables and the two halves of Find and replace, read through the page's own
	// declarations rather than through a second copy of them here.
	"\t\tpopupNode: function (id) { renderNodeFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpopupLink: function (id) { renderLinkFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpaneCols: function (tab) { var t = paneTables().filter(function (s) { return s.id === tab; })[0];\n" +
	"\t\t\treturn paneCols(t).map(function (c) { return c.key; }); },\n" +
	"\t\tpaneCol: function (tab, key) { var t = paneTables().filter(function (s) { return s.id === tab; })[0];\n" +
	"\t\t\treturn paneCols(t).filter(function (c) { return c.key === key; })[0] || null; },\n" +
	"\t\tpaneHeading: function (tab, key) { var t = paneTables().filter(function (s) { return s.id === tab; })[0],\n" +
	"\t\t\tc = paneCols(t).filter(function (x) { return x.key === key; })[0];\n" +
	"\t\t\treturn c ? paneHeadingText(c) : null; },\n" +
	"\t\tfindProps: function (scope) { findState.scope = scope;\n" +
	"\t\t\treturn findPropDefs().map(function (r) { return r[0]; }); },\n" +
	"\t\tfindValue: function (group, el, prop) { return findValueOf({ group: group, el: el }, prop); },\n" +
	"\t\treplaceFields: function () { return pushSpecList().map(function (s) { return s.field; }); },\n" +
	"\t\treplaceSpec: function (f) { return pushSpecList().filter(function (s) { return s.field === f; })[0] || null; },\n" +
	"\t\tpushShown: function (f) { var s = pushSpecList().filter(function (x) { return x.field === f; })[0];\n" +
	"\t\t\treturn s ? pushFieldShown(s) : null; },\n" +
	"\t\tqualityUnitText: qualityUnitText, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
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
// Every text node under an element, joined -- the popup is labels and inputs, so one walk is what
// "does the popup ask for this" means here.
function textOf(el) {
	if (!el) { return ''; }
	let out = el.textContent || '';
	(el.children || []).forEach(c => { out += ' ' + textOf(c); });
	return out;
}

const CHEM = { mode: 'chemical', chemical: 'Chlorine mg/L' };

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setQuality(Object.assign({}, CHEM));
const res = L.addNode('reservoir', 0, 0);
const jun = L.addNode('junction', 100, 0);
const tank = L.addNode('tank', 200, 0);
const pipe = L.addLink('pipe', res.id, jun.id);
const pipe2 = L.addLink('pipe', jun.id, tank.id);

// =================================================================================================
head('1. The pipe pair is on all three screens, not just the popup');
// =================================================================================================
const linkPopup = textOf(L.popupLink(pipe.id));
ok('the pipe popup still asks for both', linkPopup.indexOf('Bulk reaction coefficient') >= 0
	&& linkPopup.indexOf('Wall reaction coefficient') >= 0);
ok('the bulk one names its unit', linkPopup.indexOf('Bulk reaction coefficient (1/day)') >= 0);
ok('and the wall one is a length per day, in the project\'s length unit',
	linkPopup.indexOf('Wall reaction coefficient (ft/day)') >= 0);

const pipeCols = L.paneCols('pipes');
ok('the Pipes table has a column for each', pipeCols.indexOf('bulkCoeff') >= 0
	&& pipeCols.indexOf('wallCoeff') >= 0, pipeCols.join(','));
ok('they sit with the inputs, before the results',
	pipeCols.indexOf('wallCoeff') < pipeCols.indexOf('flow'));
ok('the bulk heading carries its unit', L.paneHeading('pipes', 'bulkCoeff') === 'Bulk reaction (1/day)',
	L.paneHeading('pipes', 'bulkCoeff'));
ok('and the wall heading the project\'s length per day',
	L.paneHeading('pipes', 'wallCoeff') === 'Wall reaction (ft/day)',
	L.paneHeading('pipes', 'wallCoeff'));

const props = L.findProps('pipe');
ok('Find offers both on pipes', props.indexOf('bulkCoeff') >= 0 && props.indexOf('wallCoeff') >= 0,
	props.join(','));
const rfields = L.replaceFields();
ok('and Replace can write both', rfields.indexOf('bulkCoeff') >= 0 && rfields.indexOf('wallCoeff') >= 0,
	rfields.join(','));
// **THE FIND PROPERTY AND THE REPLACE FIELD MUST BE THE SAME NAME.** replaceNormalize() offers the
// property being searched first by comparing the two, so a mismatch does not fail -- it silently
// falls back to the first writable property, and "find every -0.5 wall coefficient, make it -0.1"
// arrives pointing at Diameter.
ok('under the same names, which is what offers the searched property first',
	props.indexOf('bulkCoeff') >= 0 && rfields.indexOf('bulkCoeff') >= 0);

// =================================================================================================
head('2. A Replace writes through setProp(), and the pushes leave them alone');
// =================================================================================================
const bulkSpec = L.replaceSpec('bulkCoeff'), wallSpec = L.replaceSpec('wallCoeff');
// replaceWrite() takes the `prop` branch and goes through setProp(); a spec with no `prop` is
// written directly, which for an overridable property is the seam defect itself.
ok('the bulk spec declares its overridable property', bulkSpec && bulkSpec.prop === 'bulkCoeff');
ok('and so does the wall spec', wallSpec && wallSpec.prop === 'wallCoeff');
ok('both are pipe-only', !bulkSpec.applies({ type: 'valve' }) && bulkSpec.applies({ type: 'pipe' }));
// No map label and no Settings row, so pushFieldShown() is false and BOTH pushes skip them --
// relining a run of mains is a fact about those mains, not a default to force onto every scenario.
ok('neither is a starting value nor a scenario push', L.pushShown('bulkCoeff') === false
	&& L.pushShown('wallCoeff') === false);

// =================================================================================================
head('3. The tank coefficient has a control, where the tank\'s other properties live');
// =================================================================================================
const tankPopup = textOf(L.popupNode(tank.id));
ok('the tank popup asks for it', tankPopup.indexOf('Reaction coefficient') >= 0);
ok('as a rate in 1/day', tankPopup.indexOf('Reaction coefficient (1/day)') >= 0);
const tankCols = L.paneCols('tanks');
ok('the Tanks table has a column for it', tankCols.indexOf('tankCoeff') >= 0, tankCols.join(','));
ok('headed by the word without the tab\'s own noun repeated in it',
	L.paneHeading('tanks', 'tankCoeff') === 'Reaction (1/day)', L.paneHeading('tanks', 'tankCoeff'));

L.setProp(tank, 'tankCoeff', -0.4);
ok('typing one stores it under the underscored name setProp() writes', tank._tankCoeff === -0.4);
ok('and the document gathers it off the tank', L.docReactions().tank[tank.id] === -0.4);
ok('a tank that states nothing states nothing', L.effective(L.addNode('tank', 300, 0), 'tankCoeff') === undefined);

// =================================================================================================
head('4. Every new write is overridable, so a scenario cannot edit Base');
// =================================================================================================
L.setProp(pipe, 'bulkCoeff', -0.5);
L.setProp(pipe, 'wallCoeff', -1.5);
const scn = L.createScenario('Relined');
L.switchScenario(scn.id);
L.setProp(pipe, 'bulkCoeff', -0.1);
L.setProp(tank, 'tankCoeff', -0.9);
ok('the scenario sees its own pipe coefficient', L.effective(pipe, 'bulkCoeff') === -0.1);
ok('and BASE still holds -0.5, which is the whole point of the seam', pipe._bulkCoeff === -0.5);
ok('the tank coefficient overrides the same way', L.effective(tank, 'tankCoeff') === -0.9
	&& tank._tankCoeff === -0.4);
ok('and the model built inside the scenario reads the scenario\'s numbers',
	L.docReactions().tank[tank.id] === -0.9 && L.docReactions().bulk[pipe.id] === -0.1);
L.switchScenario('base');
ok('back in Base, Base\'s own numbers', L.effective(pipe, 'bulkCoeff') === -0.5
	&& L.effective(tank, 'tankCoeff') === -0.4);

// =================================================================================================
head('5. A blank is not a zero, at every door');
// =================================================================================================
// EPANET's own rule: a pipe with no coefficient of its own uses the global. A 0 is a pipe that does
// not react, which is a different statement, so nothing here may turn one into the other.
const bulkCol = L.paneCol('pipes', 'bulkCoeff');
ok('the Tables column declares itself blank-capable', bulkCol && bulkCol.blank === true);
bulkCol.set(pipe, undefined);
ok('and clearing the cell clears the property rather than storing a zero',
	L.effective(pipe, 'bulkCoeff') === undefined, String(L.effective(pipe, 'bulkCoeff')));
ok('so the document states no coefficient for that pipe',
	L.docReactions().bulk[pipe.id] === undefined);
bulkCol.set(pipe, 0);
ok('while a typed zero IS stored, being a pipe that does not react',
	L.effective(pipe, 'bulkCoeff') === 0 && L.docReactions().bulk[pipe.id] === 0);
bulkCol.set(pipe, -0.5);
ok('a Find on a pipe that states nothing answers undefined, not 0',
	L.findValue('link', pipe2, 'wallCoeff') === undefined);
ok('and on one that states something, the number as typed',
	L.findValue('link', pipe, 'wallCoeff') === -1.5);

// =================================================================================================
head('6. None of it is offered while the analysis is not a chemical');
// =================================================================================================
L.setQuality({ mode: 'age' });
ok('the pipe popup drops both rows',
	textOf(L.popupLink(pipe.id)).indexOf('reaction coefficient') < 0);
ok('the tank popup drops its row',
	textOf(L.popupNode(tank.id)).indexOf('Reaction coefficient') < 0);
ok('the Pipes table drops both columns', L.paneCols('pipes').indexOf('bulkCoeff') < 0
	&& L.paneCols('pipes').indexOf('wallCoeff') < 0);
ok('the Tanks table drops its column', L.paneCols('tanks').indexOf('tankCoeff') < 0);
ok('Find stops offering them', L.findProps('pipe').indexOf('bulkCoeff') < 0);
ok('and Replace stops offering them, so nobody can write what nobody can see',
	L.replaceSpec('bulkCoeff').applies({ type: 'pipe' }) === false);
// **THE VALUES ARE STILL THERE.** Hiding a control is not deleting a number: the document is
// unchanged and the coefficients come back the moment the analysis does.
ok('the numbers themselves are untouched', L.effective(pipe, 'bulkCoeff') === -0.5
	&& L.effective(tank, 'tankCoeff') === -0.4);
L.setQuality(Object.assign({}, CHEM));

// =================================================================================================
head('7. A source share states its unit, and a percentage is not a unit id');
// =================================================================================================
L.setQuality({ mode: 'trace', traceNode: res.id });
ok('the legend heading carries the per-cent mark', L.colorFieldUnitText('node', 'quality') === '%',
	L.colorFieldUnitText('node', 'quality'));
ok('and the Tables heading says the same thing, from the same function',
	L.paneHeading('junctions', 'quality') === 'Source share (%)',
	L.paneHeading('junctions', 'quality'));
L.setQuality({ mode: 'age' });
ok('a water age still names the time unit its selector names',
	L.paneHeading('junctions', 'quality') === 'Water age (hr)', L.paneHeading('junctions', 'quality'));
ok('and the legend agrees with it', L.colorFieldUnitText('node', 'quality') === 'hr');
L.setQuality(Object.assign({}, CHEM));
ok('a concentration is named by the DOCUMENT, never by a unit of ours',
	L.qualityUnitText() === 'mg/L', L.qualityUnitText());
L.setQuality({ mode: 'chemical', chemical: 'Fluoride' });
ok('and a chemical stated with no unit gets no unit rather than a guess',
	L.qualityUnitText() === '');
L.setQuality(Object.assign({}, CHEM));
// The other fields are untouched by all of this: their unit is still their unit id's label.
ok('an ordinary field still reads its unit out of the unit table',
	L.colorFieldUnitText('link', 'diameter') === 'in', L.colorFieldUnitText('link', 'diameter'));

// =================================================================================================
head('8. The tank coefficient reaches the file, and an older project keeps its number');
// =================================================================================================
const out = L.exportInp();
const inp = out.ok ? out.inp : '';
ok('the project exports', out.ok === true, JSON.stringify(out.error));
ok('the exported file states the tank\'s own coefficient',
	new RegExp('TANK\\s+' + tank.id + '\\s+-0.4').test(inp), (inp.match(/\n\s*TANK\s[^\n]*/) || [''])[0].trim());

// Reading a file: a `[REACTIONS] TANK` row lands on the tank it names.
const nodes = [{ id: 'T9', type: 'tank' }, { id: 'J9', type: 'junction' }];
const st = {};
L.readQualitySections({ REACTIONS: [' Global Bulk -0.5', ' TANK  T9  -0.75'] }, st, nodes, []);
ok('an imported TANK row lands on its tank', nodes[0]._tankCoeff === -0.75);
ok('and is not left on the setting as well, so the number has one home',
	Object.keys(st.reactions.tank).length === 0);

// A project saved while the coefficient lived on the setting -- everything saved on 2026-09-03.
const older = {
	v: L.storageVersion(),
	project: { name: 'older', activeScenario: 'base' },
	scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
	nodes: [{ id: 'T1', type: 'tank', x: 0, y: 0, elev: 0 }],
	links: [], labels: [], nextId: { J: 1, R: 1, L: 1, P: 1, T: 2, X: 1 }, units: {},
	settings: { quality: { mode: 'chemical', chemical: 'Chlorine mg/L', src: 'Chlorine mg/L' },
		reactions: { globalBulk: -0.5, tank: { T1: -0.65 } } }
};
L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(older))));
const t1 = L.getDoc().nodes.filter(n => n.id === 'T1')[0];
ok('a project saved with the map on the setting keeps its number', L.effective(t1, 'tankCoeff') === -0.65,
	String(L.effective(t1, 'tankCoeff')));
ok('the map is emptied rather than copied, so no later edit can leave two disagreeing numbers',
	Object.keys(L.getSettings().reactions.tank).length === 0);
ok('and the document reports the moved value as the tank\'s own',
	L.docReactions().tank.T1 === -0.65);

console.log(fails === 0 ? '\nreaction controls harness: all checks passed'
	: `\nreaction controls harness: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);

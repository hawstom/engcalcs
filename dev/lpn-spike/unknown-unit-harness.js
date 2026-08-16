// A UNIT WE HAVE NO FACTOR FOR STOPS THE SOLVE AND NOTHING ELSE (ROADMAP Task 390 step 4). Run:
//   node dev/lpn-spike/unknown-unit-harness.js
//
// A unit is a LABEL and a MAGNITUDE. The label is a string and is always the user's; the magnitude
// is a factor and only a SOLVE needs one. So a name this build has no factor for has exactly one
// right outcome, and it is neither of the two obvious ones:
//
//   not "reject the document"  -- the drawing and every number in it are perfectly good
//   not "guess a factor"       -- EngCalcs.unitFactor() answers 1 for a name it does not know,
//                                 and a network solved through that looks entirely ordinary
//
// The document opens, the name is carried verbatim into and out of storage, the readout shows it,
// and the SOLVE refuses by name. Those four are what this harness asserts, because three of them
// passing without the fourth is the papering-over Tom objected to.
//
// Section 3 is the other half of the same task: with the `flow_epanet` family, all ten of EPANET's
// flow keywords now land on a unit this page offers, so an import never converts a flow and the
// unknown-unit path can no longer be reached from a well-formed `.inp` at all. That is the
// difference between completing a closed enumeration and working around it.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, unitSelects, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, readUnitSelections: readUnitSelections,\n" +
	"\t\tunresolvedUnitNames: unresolvedUnitNames, unitLabel: unitLabel, unitKey: unitKey,\n" +
	"\t\trunSolve: runSolve, addNode: addNode,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---- 1. the name is carried, not corrected ----------------------------------------------------
console.log('\n1. A unit this build does not offer is carried verbatim');

// 'furlong_per_fortnight' is deliberately not a real EngCalcs unit: the point is a name we have no
// factor for, and the mechanism must not care WHY (a hand-edited file, a family that changed, a
// document written by a later build).
const before = L.readUnitSelections();
ok('the strip starts fully resolved', L.unresolvedUnitNames().length === 0, JSON.stringify(L.unresolvedUnitNames()));

L.applyUnitSelections(Object.assign({}, before, { lpn_u_length: 'furlong_per_fortnight' }));
ok('the unknown name is reported', L.unresolvedUnitNames().join() === 'furlong_per_fortnight', JSON.stringify(L.unresolvedUnitNames()));
// THE ONE THAT MATTERS FOR THE FILE: saving must write the user's own declaration back, not the
// unit the select happened to be left showing. Rewriting it here would be the same defect as
// rewriting a number, one level up.
ok('a save writes the name back unchanged', L.readUnitSelections().lpn_u_length === 'furlong_per_fortnight', L.readUnitSelections().lpn_u_length);
ok('the readout shows the document\'s own name', L.unitLabel('lpn_u_length') === 'furlong_per_fortnight', L.unitLabel('lpn_u_length'));
// Everything else is untouched: one unknown unit is not a broken document.
ok('the other selectors are unaffected', L.readUnitSelections().lpn_u_diameter === before.lpn_u_diameter, L.readUnitSelections().lpn_u_diameter);

// ---- 2. and the solve refuses, by name --------------------------------------------------------
console.log('\n2. The solve refuses, and says which unit and why');
const statusEl = global.document.getElementById('lpn_status');

// A network with something in it, or runSolve() returns on the empty check before reaching here.
const doc = L.getDoc();
doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
doc.nodes.push({ id: 'J1', type: 'junction', x: 100, y: 0, elev: 50, _demand: 1 });
doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', _diameter: 200, _roughness: 130, _length: 100, _k: 0, _status: 'open', verts: [] });

L.runSolve();
const refusal = statusEl.textContent || '';
ok('the refusal names the unit', refusal.indexOf('furlong_per_fortnight') >= 0, JSON.stringify(refusal));
// TWO DIFFERENT FACTS, and CLAUDE.md requires both said out loud: that we do not know the unit,
// and that answers are therefore impossible. Asserted as two separate ideas rather than as one
// exact string, so rewording the message does not fail this and dropping half of it does.
ok('the refusal says the drawing is intact', /kept|shown|came in|unchanged/i.test(refusal), JSON.stringify(refusal));
ok('the refusal says no answers can be given', /no answers|cannot|can not/i.test(refusal), JSON.stringify(refusal));
ok('nothing was solved', L.getDoc().nodes.length === 2);

// The refusal is not sticky: install a unit we do know and the page works again.
L.applyUnitSelections(before);
ok('a known unit clears the refusal', L.unresolvedUnitNames().length === 0, JSON.stringify(L.unresolvedUnitNames()));
statusEl.textContent = '';
L.runSolve();
ok('and the solve runs', (statusEl.textContent || '').indexOf('furlong') < 0, JSON.stringify(statusEl.textContent));
// A document with no units block at all (a very old file) is not an unknown-unit document.
L.applyUnitSelections(null);
ok('a document with no units block refuses nothing', L.unresolvedUnitNames().length === 0);

// ---- 3. all ten EPANET flow keywords now have a unit of their own -----------------------------
// Read from js/lpn-inp.js's own table rather than typed here, so a keyword added there without a
// selector fails this rather than going unnoticed.
console.log('\n3. Every EPANET flow keyword lands on a unit this page offers');
const keywords = Object.keys(EngCalcs.lpnInpFlowUnits);
ok('the keyword list is EPANET\'s closed set of ten', keywords.length === 10, keywords.join(','));

const flowOptions = unitSelects.lpn_u_flow.options.map((o) => o.value);
const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
const mapSrc = /var LPN_INP_FLOW_UNIT = \{([\s\S]*?)\};/.exec(src)[1];
const sameSrc = /var LPN_INP_FLOW_SAME = \{([^}]*)\}/.exec(src)[1];
keywords.forEach((kw) => {
	const m = new RegExp(kw + ":\\s*'([a-z0-9]+)'").exec(mapSrc);
	ok(kw + ' names a unit', !!m, mapSrc);
	if (!m) { return; }
	ok(kw + ' -> ' + m[1] + ' is on the flow selector', flowOptions.indexOf(m[1]) >= 0, flowOptions.join(','));
	// And therefore no import has to convert it: the file's own number crosses untouched.
	ok(kw + ' is a pass-through import', new RegExp('\\b' + kw + ':\\s*1\\b').test(sameSrc), sameSrc);
});

// The claim above is worth nothing if the units are not really distinct, which is the mistake a
// copied line makes: every keyword must map to a DIFFERENT unit, or two of them silently share one.
const mapped = keywords.map((kw) => (new RegExp(kw + ":\\s*'([a-z0-9]+)'").exec(mapSrc) || [])[1]);
ok('the ten keywords map to ten different units', new Set(mapped).size === 10, mapped.join(','));

// ---- 4. and an .inp in each keyword really does pass its flows through -------------------------
// The end-to-end version of section 3, because a table can agree with itself. One tiny network,
// written out ten times with only the UNITS keyword changed, and the demand must come back as the
// characters the file states -- value and text both.
console.log('\n4. A file in each keyword imports its flows untouched');
function tinyInp(keyword) {
	return '[TITLE]\n t\n[JUNCTIONS]\n J1  100.0  150.0\n[RESERVOIRS]\n R1  200.0\n' +
		'[PIPES]\n P1  R1  J1  1000.0  12.00  130  0\n' +
		'[COORDINATES]\n J1  10  10\n R1  0  0\n[OPTIONS]\n UNITS  ' + keyword + '\n HEADLOSS  H-W\n[END]\n';
}
keywords.forEach((kw) => {
	const parsed = EngCalcs.lpnInpParse(tinyInp(kw));
	ok(kw + ': parses', parsed.ok, JSON.stringify(parsed.error));
	if (!parsed.ok) { return; }
	ok(kw + ': no unknown-flow-units report', !parsed.dropped.some((d) => d.code === 'unknown-flow-units'), JSON.stringify(parsed.dropped));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	ok(kw + ': the selector took the file\'s own flow unit', L.unresolvedUnitNames().length === 0, JSON.stringify(L.unresolvedUnitNames()));
	const saved = L.docFromInp(parsed, kw + '.inp');
	const j = saved.nodes.filter((n) => n.id === 'J1')[0];
	ok(kw + ': the demand is the file\'s number', j._demand === 150, j._demand);
	ok(kw + ': the demand is the file\'s text', EngCalcs.lpnNumText(j, '_demand', j._demand) === '150.0',
		JSON.stringify(EngCalcs.lpnNumText(j, '_demand', j._demand)));
});

console.log('');
if (fails) { console.log(fails + ' FAILED of ' + checks); process.exit(1); }
console.log('all ' + checks + ' unknown-unit checks passed');

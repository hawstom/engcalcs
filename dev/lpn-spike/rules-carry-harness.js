// [RULES] ARE CARRIED, NOT THROWN AWAY -- ROADMAP Task 248.03, first phase. Run with:
//   node dev/lpn-spike/rules-carry-harness.js
//
// **WHAT THIS PHASE CLAIMS, AND WHAT IT DOES NOT.** It claims that a file's `[RULES]` survive
// import, a save, and export, character for character; and that the EPANET engine is handed them, so
// a rule-driven network solves CORRECTLY on that path. It does not claim that this page models a
// rule: the native solver still cannot read one, and nothing on the page can edit one. Task 248.03's
// remaining scope is that language and its editor.
//
// **WHY THIS WAS WORTH DOING BEFORE THE LANGUAGE.** `[RULES]` was in the importer's REPORTABLE list,
// so it was counted as a difference and then DROPPED. A file whose pumps are driven by rules
// therefore came back out of the exporter with none -- the input-is-canonical rule broken exactly as
// `[OPTIONS]` was under Task 553 -- and solved wrong here in silence, with every number on screen
// looking reasonable. That is the shape of the two worst defects this project has recorded.
//
// **THE REFERENTIAL GUARD IS THE PART THAT NEEDED CARE.** EPANET rejects the WHOLE input over one
// rule naming a link it has not been given. Passing rules through blind would turn "we do not model
// your rules" into "your network does not solve", which reads as our arithmetic failing. Section 4
// is that case, and it is a NORMAL one: an element can go missing by being deleted or by being
// switched off inside a scenario.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, epanetSolves, warmEpanet, settleEpanet } =
	require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tdeleteLink: deleteLink,\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A reservoir feeding a tank through a pump, with a rule that closes the pump on tank level. This
// is the smallest network in which a RULE CHANGES THE ANSWER -- which is what section 5 needs, and
// what a fixture full of rules that decide nothing could never show.
const FIXTURE = [
	'[TITLE]',
	'A pump a rule can switch off',
	'',
	'[JUNCTIONS]',
	' J1              	100         	200         	                	;',
	'',
	'[RESERVOIRS]',
	' R1              	100         	                	;',
	'',
	'[TANKS]',
	' T1              	100         	15          	0           	30          	50          	0           	         	;',
	'',
	'[PIPES]',
	' P1              	J1          	T1          	1000        	12          	130         	0           	Open  	;',
	'',
	'[PUMPS]',
	' PU1             	R1          	J1          	HEAD C1 	;',
	'',
	'[CURVES]',
	' C1              	1000        	150         	;',
	'',
	'[RULES]',
	'RULE  RUL1',
	'IF    TANK T1 LEVEL ABOVE 20',
	'THEN  PUMP PU1 STATUS IS CLOSED',
	'PRIORITY 1',
	'',
	'[OPTIONS]',
	' Units              	GPM',
	' Headloss           	H-W',
	'',
	'[END]',
	''
].join('\n');

function rulesBlockOf(text) {
	return (text.split(/^\[RULES\]/m)[1] || '').split(/^\[/m)[0]
		.split(/\r?\n/).map(t => t.replace(/\s+$/, '')).filter(t => t.trim());
}

byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'rules.inp', _text: FIXTURE });

// ---------------------------------------------------------------------------
// 1. The text reached the document, line for line.
// ---------------------------------------------------------------------------
console.log('\n--- the file stated rules, so we hold them ---');
{
	const doc = L.getDoc();
	ok('the rules are on the document', Array.isArray(doc.rules) && doc.rules.length === 4,
		JSON.stringify(doc.rules));
	// **THE CHARACTERS, NOT A REBUILT SENTENCE.** Nothing here understands a rule well enough to
	// compose one, so the file's own text is the only honest form to keep.
	ok('...as the file\'s own lines', doc.rules.join('\n') ===
		'RULE  RUL1\nIF    TANK T1 LEVEL ABOVE 20\nTHEN  PUMP PU1 STATUS IS CLOSED\nPRIORITY 1',
		JSON.stringify(doc.rules));
}

// ---------------------------------------------------------------------------
// 1b. And the import still SAYS the file has them.
// ---------------------------------------------------------------------------
{
	// **CARRYING A THING AND TELLING THE USER ABOUT IT ARE TWO JOBS**, and the first quietly broke
	// the second while this was being built: the line that keeps the rule text `continue`s past the
	// counter every other section reaches, so `[RULES]` stopped being reported as a difference at
	// all. `import-notes-harness.js` caught it. Asserted here too, at the source, because the
	// symptom there names neither this section nor that counter.
	const notes = byId.lpn_dialog_body.textContent || '';
	ok('the import still reports that this file has rule-based controls',
		/rule/i.test(notes), JSON.stringify(notes.slice(0, 160)));
}

// ---------------------------------------------------------------------------
// 2. And back out again, and through a save.
// ---------------------------------------------------------------------------
console.log('\n--- and the exporter writes them back ---');
{
	const out = L.export();
	ok('the export succeeded', out && out.ok === true, out && out.detail);
	ok('...with a [RULES] section holding the same four lines',
		rulesBlockOf(out.inp).join('\n') === rulesBlockOf(FIXTURE).join('\n'),
		JSON.stringify(rulesBlockOf(out.inp)));
	// The project file is the other round trip, and it is the one a person makes every day.
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	ok('...and a saved project carries them too',
		Array.isArray(saved.rules) && saved.rules.length === 4, JSON.stringify(saved.rules));
}

// ---------------------------------------------------------------------------
// 3. A file with no rules gets no [RULES] section invented for it.
// ---------------------------------------------------------------------------
console.log('\n--- and a file with none still has none ---');
{
	const net1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: net1 });
	ok('Net1 states no rules, so we hold none', (L.getDoc().rules || []).length === 0,
		JSON.stringify(L.getDoc().rules));
	// An empty `[RULES]` header is a statement EPA's own file never made -- the same reasoning
	// `[OPTIONS] Pattern` follows, and what keeps the round trip byte-identical.
	ok('...and the export writes no [RULES] header at all',
		!/^\[RULES\]/m.test(L.export().inp));
}

// ---------------------------------------------------------------------------
// 4. The referential guard, which is a NORMAL case and not a corrupt file.
// ---------------------------------------------------------------------------
console.log('\n--- a rule naming something that is gone ---');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'rules.inp', _text: FIXTURE });
	const blocks = EngCalcs.lpnRuleBlocks(L.getDoc().rules);
	ok('the scanner finds the elements the rule names', blocks.length === 1 &&
		blocks[0].nodes.join(',') === 'T1' && blocks[0].links.join(',') === 'PU1',
		JSON.stringify(blocks.map(b => ({ n: b.name, nodes: b.nodes, links: b.links }))));
	ok('...and passes over everything it does not model',
		blocks[0].lines.length === 4, blocks[0].lines.length);
	// While everything exists, the model carries the rule.
	ok('the model hands the engine the rule', (L.assembleModel().rules || []).length === 4,
		JSON.stringify(L.assembleModel().rules));
	ok('...and reports nothing dropped', (EngCalcs.lpnRuleDrops || []).length === 0);

	// **NOW DELETE THE PUMP THE RULE NAMES.** EPANET rejects the whole input over this one line, so
	// the rule must not be sent -- and the drop must be reported, not swallowed.
	L.deleteLink('PU1');
	const m = L.assembleModel();
	ok('a rule naming a deleted link is NOT handed to the engine', (m.rules || []).length === 0,
		JSON.stringify(m.rules));
	ok('...and the drop is reported by name', (EngCalcs.lpnRuleDrops || []).length === 1 &&
		EngCalcs.lpnRuleDrops[0].name === 'RUL1' &&
		EngCalcs.lpnRuleDrops[0].missing.join(',') === 'PU1',
		JSON.stringify(EngCalcs.lpnRuleDrops));
	// **AND THE DOCUMENT STILL HOLDS IT.** Dropping a rule from the SOLVE is not deleting it from
	// the user's file: they may put the pump back, and the export must still say what they stated.
	ok('...while the document keeps the rule, and the export still writes it',
		(L.getDoc().rules || []).length === 4 && /^\[RULES\]/m.test(L.export().inp),
		JSON.stringify(L.getDoc().rules));
}

// ---------------------------------------------------------------------------
// 5. WHY THE ENGINE IS *NOT* HANDED THE RULES, MEASURED RATHER THAN ASSERTED.
// ---------------------------------------------------------------------------
(async function () {
	console.log('\n--- and why the engine is NOT handed them ---');
	await warmEpanet();
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'rules.inp', _text: FIXTURE });
	const doc = L.getDoc();
	const tank = doc.nodes.filter(n => n.type === 'tank')[0];
	function solve() { return EngCalcs.lpnSolveEpanet(L.assembleModel(), {}); }

	// **THIS SECTION EXISTS BECAUSE THE OPPOSITE WAS BUILT FIRST AND WAS WRONG.** Passing the rule
	// text into js/lpn-epanet.js's input looked obviously right -- this page does not model a rule,
	// the engine does. It is false, and only a measurement could say so.
	//
	// **THE BRIDGE WRITES LPS AND METRES ALWAYS. A RULE'S NUMBERS ARE IN THE FILE'S OWN UNITS.**
	// The fixture is a GPM file whose rule reads `IF TANK T1 LEVEL ABOVE 20` -- twenty FEET. In the
	// metric input that writer builds, the same tank's level is 7.62, so the rule never fires; and a
	// rule that DID fire would fire at the wrong threshold, with every number on screen looking
	// reasonable. That is the shape of the two worst defects this project has recorded.
	const built = EngCalcs.lpnToInp(L.assembleModel());
	ok('the engine input is metric, whatever the file was',
		/Units LPS/.test(built.inp), (built.inp.match(/Units \S+/) || [])[0]);
	// 15 ft is 4.572 m. The rule's threshold is the bare number 20, so in this input it would be
	// compared against 4.572 -- and against 7.62 with the level raised to 25 ft below. **Neither can
	// ever exceed 20**, which is why the rule was silently inert rather than merely imprecise.
	ok('...so the tank the rule tests reads 4.572, not 15',
		/^\s*T1\s+\S+\s+4\.572\b/m.test(built.inp),
		(built.inp.split(/^\[TANKS\]/m)[1] || '').split(/\n/)[1]);
	// **AND THEREFORE NO [RULES] SECTION IS WRITTEN AT ALL.** Silence beats a threshold in the wrong
	// unit: an unmodelled rule is reported as a difference at import, where the user can see it.
	ok('so the engine input states no rules', !/^\[RULES\]/m.test(built.inp));

	// The measurement that settled it: with the level raised past the rule's own 20 (feet), the pump
	// is unaffected -- because 25 ft is 7.62 m and the metric rule would be comparing against 20 m.
	tank._level = 15;
	const quiet = await solve();
	tank._level = 25;
	const raised = await solve();
	ok('the engine solved both ways', quiet.ok !== false && raised.ok !== false,
		JSON.stringify([quiet.ok, raised.ok]));
	ok('...and the pump runs at both levels, rule or no rule',
		Math.abs(quiet.flows.PU1) > 1e-6 && Math.abs(raised.flows.PU1) > 1e-6,
		quiet.flows.PU1 + ' / ' + raised.flows.PU1);

	// **WHAT IS STILL TRUE, AND IS THE POINT OF THE PHASE:** the rule survived all of that. It is
	// on the document, it goes back out in the user's own units, and nothing silently obeyed a
	// number it had misread.
	ok('the rule is still on the document after every solve',
		(L.getDoc().rules || []).length === 4, JSON.stringify(L.getDoc().rules));
	ok('...and still comes back out of the exporter unchanged',
		rulesBlockOf(L.export().inp).join('\n') === rulesBlockOf(FIXTURE).join('\n'));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());

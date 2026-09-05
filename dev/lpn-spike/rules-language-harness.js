// THE [RULES] LANGUAGE -- ROADMAP Task 248.03, second phase. Run with:
//   node dev/lpn-spike/rules-language-harness.js
//
// The first phase (dev/lpn-spike/rules-carry-harness.js) claims the TEXT survives a round trip and
// that the engine is deliberately handed none of it. This one claims the rest: that a rule is
// PARSED, that every number in it is converted per clause into the engine's own units, that the
// engine then really fires it at the threshold the user typed, and that a rule this page cannot read
// is kept and marked rather than discarded.
//
// **EVERY ASSERTION HERE IS ANCHORED ON A US-UNIT FILE (GPM, FEET, PSI), ON PURPOSE.** The bridge
// writes LPS and metres always, so a missing conversion is invisible in a metric fixture: 20 stays
// 20 and every test passes on a page that is silently wrong. Section 2 is the measurement that
// settles it -- the same network is solved with the conversion in place and with it removed, and the
// pump changes state in one and not the other.

'use strict';

const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

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
function near(a, b) { return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }

// A reservoir pumping into a junction, a pipe on to a tank, and rules that exercise EVERY quantity
// kind a rule can state: a tank LEVEL (a length), a junction PRESSURE, a pipe FLOW, a pump SETTING
// (a speed, dimensionless), a status keyword, a clock time and a priority.
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
	// A WIDE tank on purpose: 200 ft across, so two hours of pumping moves its level about a foot and
	// the run cannot cross the rule's own 20 ft threshold by filling. A 50 ft tank fills past it in
	// under an hour, and then every frame is right for a reason that has nothing to do with units.
	' T1              	100         	15          	0           	30          	200         	0           	         	;',
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
	'RULE  R1',
	'IF    TANK T1 LEVEL ABOVE 20',
	'THEN  PUMP PU1 STATUS IS CLOSED',
	'PRIORITY 1',
	'',
	'RULE  R2',
	'IF    JUNCTION J1 PRESSURE BELOW 50',
	'AND   PIPE P1 FLOW ABOVE 100',
	'THEN  PIPE P1 STATUS IS OPEN',
	'ELSE  PIPE P1 STATUS IS CLOSED',
	'',
	'RULE  R3',
	'IF    SYSTEM CLOCKTIME >= 3 AM',
	'THEN  PUMP PU1 SETTING IS 1.5',
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
function engineRuleLines(model) {
	return rulesBlockOf(EngCalcs.lpnToInp(model || L.assembleModel()).inp);
}

byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'rules.inp', _text: FIXTURE });

// ---------------------------------------------------------------------------
// 1. EVERY CLAUSE KIND, CONVERTED OR LEFT ALONE, ON A GPM/FEET FILE
// ---------------------------------------------------------------------------
console.log('\n--- a rule\'s numbers reach the engine in the engine\'s units ---');
{
	const lines = engineRuleLines();
	console.log('   ' + lines.join('\n   '));
	const valueAfter = (needle) => {
		const line = lines.filter(t => t.indexOf(needle) === 0)[0] || '';
		return parseFloat(line.split(/\s+/).pop());
	};
	// A LENGTH. 20 ft = 6.096 m exactly, and this is the clause the whole task turns on: left
	// unconverted it would be compared against a tank whose level this input states as 4.572.
	ok('a tank LEVEL is a length: 20 ft goes out as 6.096 m',
		near(valueAfter('IF TANK T1 LEVEL ABOVE'), 6.096), valueAfter('IF TANK T1 LEVEL ABOVE'));
	// A PRESSURE. Under LPS, EPANET's pressure unit is metres of water, which is this suite's own
	// SI pressure unit -- so the factor is psi per metre of water and nothing else.
	ok('a junction PRESSURE is a pressure: 50 psi goes out as metres of water',
		near(valueAfter('AND JUNCTION J1 PRESSURE BELOW') || valueAfter('IF JUNCTION J1 PRESSURE BELOW'),
			50 / 1.4223343307119563),
		valueAfter('IF JUNCTION J1 PRESSURE BELOW') + ' vs ' + (50 / 1.4223343307119563));
	// A FLOW. m3/s on the model, L/s in the input, the same 1000 every other flow in that file makes.
	// 1 gal = 3.785411784 L exactly, so 100 gpm = 6.30901964 L/s exactly.
	ok('a pipe FLOW is a flow: 100 gpm goes out in L/s',
		near(valueAfter('AND PIPE P1 FLOW ABOVE'), 6.30901964),
		valueAfter('AND PIPE P1 FLOW ABOVE'));
	// THE THREE THAT MUST NOT MOVE. A pump's SETTING is a speed multiplier, a PRIORITY is a rank,
	// and a CLOCKTIME is a time of day -- scaling any of them would be the mirror-image defect.
	ok('a pump SETTING is a speed and is left alone',
		lines.indexOf('THEN PUMP PU1 SETTING IS 1.5') >= 0, lines.join(' | '));
	ok('a PRIORITY is left alone', lines.indexOf('PRIORITY 1') >= 0);
	ok('a CLOCKTIME is left alone', lines.indexOf('IF SYSTEM CLOCKTIME >= 3 AM') >= 0);
	ok('a status keyword is left alone',
		lines.indexOf('THEN PUMP PU1 STATUS IS CLOSED') >= 0 &&
		lines.indexOf('ELSE PIPE P1 STATUS IS CLOSED') >= 0);
	ok('all three rules reached the engine', lines.filter(t => t.indexOf('RULE ') === 0).length === 3);
}

// ---------------------------------------------------------------------------
// 2. THE RULE REALLY FIRES, IN THE REAL ENGINE, AT THE THRESHOLD THE USER TYPED
// ---------------------------------------------------------------------------
(async function () {
	console.log('\n--- and the engine obeys it at the level the user wrote ---');
	await warmEpanet();
	const doc = L.getDoc();
	const tank = doc.nodes.filter(n => n.type === 'tank')[0];

	// **THIS IS AN EXTENDED-PERIOD RUN, AND IT HAS TO BE.** EPANET checks its rule base BETWEEN time
	// steps, so a run of zero duration never evaluates one: the same fixture solved as a single
	// instant leaves the pump running at a level the rule says shuts it, whatever the threshold says.
	// That is the engine's own behaviour rather than ours, and the assertion below measures it so
	// that nobody re-reads the instant result as a broken conversion.
	doc.times = Object.assign(EngCalcs.lpnTimesDefaults(), {
		duration: 7200, hydraulicStep: 3600, reportStep: 3600, patternStep: 3600
	});
	const runAt = async (level) => {
		tank._level = level;
		const run = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
		return run;
	};
	const flowsIn = (run) => (run.frames || []).map(f => f.flows.PU1);

	// The rule closes PU1 above 20 FEET. 15 ft is below it and 25 ft is above it, and both numbers
	// are stated in the project's own units, which is the entire claim.
	const below = await runAt(15);
	const above = await runAt(25);
	ok('the engine ran both ways', (below.frames || []).length > 1 && (above.frames || []).length > 1,
		JSON.stringify([(below.frames || []).length, (above.frames || []).length]));
	ok('at 15 ft, below the rule\'s 20, the pump runs',
		flowsIn(below).every(q => Math.abs(q) > 1e-6), JSON.stringify(flowsIn(below)));
	ok('at 25 ft, above the rule\'s 20, the rule shuts the pump',
		flowsIn(above).slice(1).every(q => Math.abs(q) < 1e-9), JSON.stringify(flowsIn(above)));

	// **THE COUNTER-MEASUREMENT, WHICH IS WHY js/lpn-rules.js EXISTS.** With the conversion removed
	// the input states `ABOVE 20` against a tank whose level it states as 7.62 metres, so the rule
	// can never fire and the pump runs at both levels -- exactly the silent wrongness the first
	// phase measured and refused to ship. lpnRuleConvert is replaced rather than the writer, so
	// everything else about the input is identical.
	const realConvert = EngCalcs.lpnRuleConvert;
	EngCalcs.lpnRuleConvert = function (block) { return block; };
	const unconvertedLines = engineRuleLines();
	const unconverted = await runAt(25);
	EngCalcs.lpnRuleConvert = realConvert;
	ok('...and unconverted the input would have said ABOVE 20',
		unconvertedLines.indexOf('IF TANK T1 LEVEL ABOVE 20') >= 0, unconvertedLines.join(' | '));
	// The flow is smaller than the converted run's because R2's thresholds are wrong too and its ELSE
	// shuts P1. Only R1 is under test here, and R1 is the one that never fires.
	ok('...at which the same 25 ft tank never reaches the threshold and the pump keeps running',
		flowsIn(unconverted).every(q => Math.abs(q) > 1e-6), JSON.stringify(flowsIn(unconverted)));

	// **AND THE INSTANT RUN IS THE ENGINE'S BEHAVIOUR, NOT A DEFECT.** Stated here so a reader who
	// finds the pump running on a one-moment solve does not go looking for a missing factor.
	tank._level = 25;
	const instant = await EngCalcs.lpnSolveEpanet(L.assembleModel(), {});
	ok('a single-instant solve does not apply rules, which is what EPANET itself does',
		Math.abs(instant.flows.PU1) > 1e-6, instant.flows.PU1);
	tank._level = 15;
	delete doc.times;

	// -----------------------------------------------------------------------
	// 3. THE DOCUMENT IS UNTOUCHED BY ALL OF IT
	// -----------------------------------------------------------------------
	console.log('\n--- and the user\'s own text is byte-identical coming back out ---');
	ok('the document still holds the file\'s own lines',
		(L.getDoc().rules || []).join('\n') === rulesBlockOf(FIXTURE).join('\n'),
		JSON.stringify(L.getDoc().rules));
	ok('...and the exporter writes them back character for character',
		rulesBlockOf(L.export().inp).join('\n') === rulesBlockOf(FIXTURE).join('\n'));

	// -----------------------------------------------------------------------
	// 4. A RULE THIS PAGE CANNOT READ IS KEPT AND MARKED, NEVER DISCARDED
	// -----------------------------------------------------------------------
	console.log('\n--- a rule we cannot read ---');
	{
		const doc2 = L.getDoc();
		const before = doc2.rules.slice();
		doc2.rules = before.concat(['', 'RULE  R4', 'IF    TANK T1 WOBBLE ABOVE 20',
			'THEN  PUMP PU1 STATUS IS CLOSED']);
		const parsed = EngCalcs.lpnRuleParse(doc2.rules);
		ok('the parser reads three rules and refuses the fourth',
			parsed.filter(b => b.ok).length === 3 && parsed.length === 4,
			parsed.map(b => b.name + ':' + b.ok).join(' '));
		const model = L.assembleModel();
		ok('...so the engine input still states three rules',
			engineRuleLines(model).filter(t => t.indexOf('RULE ') === 0).length === 3);
		ok('...and the drop is reported by name, not in silence',
			(model.ruleWarnings || []).some(w => w.code === 'rule-unreadable' && w.ids.indexOf('R4') >= 0),
			JSON.stringify(model.ruleWarnings));
		ok('...while the document keeps every line of it',
			doc2.rules.slice(-3).join('|') === 'RULE  R4|IF    TANK T1 WOBBLE ABOVE 20|THEN  PUMP PU1 STATUS IS CLOSED');
		ok('...and the exporter still writes it out',
			/WOBBLE/.test(L.export().inp));
		doc2.rules = before;
	}

	// -----------------------------------------------------------------------
	// 5. THE EDITOR'S SPLIT LOSES NOTHING
	// -----------------------------------------------------------------------
	//
	// The Libraries box edits one rule at a time by rewriting its chunk and putting the others back.
	// That is only safe while the split is lossless -- blank lines and comments included -- so this
	// is the property the editor is built on rather than an incidental one.
	console.log('\n--- the editor can rewrite one rule and leave the rest alone ---');
	{
		const lines = ['; a comment before anything', 'RULE  A', 'IF SYSTEM TIME >= 4',
			'THEN PUMP PU1 STATUS IS OPEN', '', '; and one between', 'RULE  B',
			'IF TANK T1 LEVEL BELOW 5', 'THEN PUMP PU1 STATUS IS OPEN'];
		const chunks = EngCalcs.lpnRuleSplit(lines);
		ok('the split puts every line back', [].concat(...chunks.map(c => c.lines)).join('\n') === lines.join('\n'));
		ok('...in three chunks: the preamble and the two rules',
			chunks.length === 3 && chunks[0].name === '' && chunks[1].name === 'A' && chunks[2].name === 'B',
			chunks.map(c => JSON.stringify(c.name)).join(' '));
		// **THE TRAILING BLANK AND COMMENT BELONG TO CHUNK A FOR THE CONCATENATION AND TO CHUNK B
		// FOR A READER**, which is what `trailing` counts. Rewriting A's body puts them back.
		ok('...and the blank line and the comment that introduce B are counted as trailing',
			chunks[1].trailing === 2, String(chunks[1].trailing));
		const body = (c) => c.lines.slice(0, c.lines.length - (c.trailing || 0));
		const trail = (c) => c.lines.slice(c.lines.length - (c.trailing || 0));
		const edited = [].concat(chunks[0].lines,
			['RULE  A', 'IF SYSTEM TIME >= 6', 'THEN PUMP PU1 STATUS IS OPEN'], trail(chunks[1]),
			chunks[2].lines);
		ok('...so editing rule A leaves the comment, the blank line and rule B untouched',
			edited.slice(-5).join('\n') === lines.slice(-5).join('\n') && edited[0] === lines[0],
			JSON.stringify(edited));
		ok('...and the box only ever shows A\'s own three lines', body(chunks[1]).length === 3,
			JSON.stringify(body(chunks[1])));
	}

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}());

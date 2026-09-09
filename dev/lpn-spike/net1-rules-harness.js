// THE TWO RULES SHIPPED ON THE Net1 EXAMPLE REALLY DO SOMETHING. Run with:
//   node dev/lpn-spike/net1-rules-harness.js
//
// Tom, 2026-09-08, asked for two `[RULES]` on the Net1 example so the rule editor could be
// exercised from the gallery without writing a file first. **AN EXAMPLE RULE THAT CHANGES NOTHING
// IS WORSE THAN NO EXAMPLE RULE**: it looks exactly like a rule that works, and the person testing
// the feature concludes the feature is broken -- or, worse, concludes it works.
//
// `examples-audit-harness.js` §5 asserts the LINES: verbatim, parsed, and naming assets the project
// actually has. That is a fact about the file. This is the other fact, and it is the one no reading
// of the file can give: the same shipped project, run through the page's own chain, answers
// DIFFERENTLY with the rules than without them.
//
// **THE CHAIN IS THE PAGE'S OWN** (session handoff §3): migrateSaved, applySaved, assembleModel,
// lpnEpanetRun. Task 582 shipped five green sections that each handed the engine a model the
// harness had built, so the page's only document-to-model bridge could put nothing on it and
// nothing noticed. Nothing here builds a model.
//
// **AND IT HAS TO BE AN EXTENDED-PERIOD RUN.** EPANET checks its rule base BETWEEN time steps, so
// the same network solved as one instant leaves the pump exactly where it was, whatever any rule
// says. Net1's own `[TIMES]` state a 24 h duration, which is why the rules were written against a
// clock: the shipped example already runs long enough to reach both of their windows.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
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

const NET1 = path.join(ROOT, 'examples', 'Net1.lwn');

/**
 * Opens the SHIPPED example exactly as the gallery does, keeping the rules named in `which`.
 *
 * `which` is 'both', 'none', '1' or '2'. Taking a rule AWAY rather than writing one is what keeps
 * this a test of the shipped file: every run below is the project as published, minus something.
 */
function openNet1(which) {
	byId.lpn_dialog_body.children.length = 0;
	const saved = JSON.parse(fs.readFileSync(NET1, 'utf8'));
	if (which === 'none') { saved.rules = []; }
	else if (which === '1' || which === '2') {
		const chunks = global.EngCalcs.lpnRuleSplit(saved.rules).filter((c) => c.name === which);
		saved.rules = chunks.reduce((all, c) => all.concat(c.lines), []);
	}
	L.applySaved(L.migrateSaved(saved));
	return L.getDoc();
}

(async function () {
	console.log('1. THE SHIPPED FILE CARRIES THEM AND THE PAGE READS THEM BACK');
	{
		const doc = openNet1('both');
		ok('the gallery copy of Net1 opens with rules on the document', (doc.rules || []).length === 12,
			String((doc.rules || []).length));
		// The 24 h clock is what makes them reachable at all, and it is the example's own, not ours.
		ok('...and the example already runs long enough to reach both clock windows',
			doc.times && doc.times.duration === 86400, JSON.stringify(doc.times && doc.times.duration));
		// modelRules() is the bridge. A rule that never gets past it is a rule the engine never sees.
		// `model.rules` is a list of CONVERTED BLOCKS, not text: js/lpn-epanet.js composes the
		// section with lpnRuleWrite() and the same scale it uses itself, so that is what is read
		// here rather than a second opinion about what the engine is handed.
		const model = L.assembleModel();
		const lines = global.EngCalcs.lpnRuleWrite(model.rules, { flow: 1000, roughness: 1 }).join('\n');
		ok('both rules cross assembleModel() into the engine input',
			/RULE 1/.test(lines) && /RULE 2/.test(lines), lines.slice(0, 200));
		ok('...and none of them was refused as naming a missing asset',
			!(model.ruleWarnings || []).length, JSON.stringify(model.ruleWarnings));
		// **THE NUMBERS ARE CONVERTED PER CLAUSE, WHICH IS THE WHOLE REASON js/lpn-rules.js EXISTS.**
		// Net1 is a FEET file and the bridge writes metres, so a level written 133 must arrive as
		// 40.5384. If this ever reads 133 the rules are being handed through as characters and both
		// of them fire at the wrong level with every number on screen looking reasonable.
		ok('a level written 133 ft reaches the engine as 40.5384 m',
			/LEVEL ABOVE 40\.5384/.test(lines), lines.slice(0, 400));
		ok('...and 120 ft as 36.576 m', /LEVEL BELOW 36\.576/.test(lines), lines.slice(0, 400));
		// A clock time is not a dimension and must come through as the words the file wrote.
		ok('a clock time is left exactly as written', /CLOCKTIME >= 10 AM/.test(lines)
			&& /CLOCKTIME < 2 PM/.test(lines) && /CLOCKTIME >= 3 PM/.test(lines), lines.slice(0, 400));
	}

	console.log('\n2. AND THE RUN ANSWERS DIFFERENTLY BECAUSE OF THEM');
	await warmEpanet();
	const runNet1 = async (which) => {
		openNet1(which);
		return global.EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	};
	// Pump 9 is the only link either rule touches, so its flow through the day is the whole
	// measurement. Net1's own [CONTROLS] switch that pump too, on the tank crossing 110 ft and
	// 140 ft; both rules act strictly inside that band, so anything below is the rules.
	const pumpFlow = (run) => (run.frames || []).map((f) => f.flows['9']);
	const both = pumpFlow(await runNet1('both'));
	const none = pumpFlow(await runNet1('none'));
	const only1 = pumpFlow(await runNet1('1'));
	const only2 = pumpFlow(await runNet1('2'));
	ok('all four runs produced a full day of frames',
		[both, none, only1, only2].every((a) => a.length === 25),
		JSON.stringify([both.length, none.length, only1.length, only2.length]));
	const differs = (a, b) => a.reduce((at, q, i) => (Math.abs(q - b[i]) > 1e-6 ? at.concat(i) : at), []);
	// **THE ONE ASSERTION THAT CANNOT BE FAKED BY WRITING THE SECTION CORRECTLY.** If the rules were
	// dropped, converted into a threshold nothing crosses, or written into a section the engine
	// ignores, these arrays are identical and everything else about the file still looks perfect.
	ok('the pump does not run the same day with the rules as without them',
		differs(both, none).length > 0, 'differs at hours ' + JSON.stringify(differs(both, none)));
	// **EACH RULE ON ITS OWN, because two rules and one measurement cannot tell which one acted**,
	// and a second rule nobody can see acting is the one a person testing the feature would edit
	// first and learn nothing from.
	ok('...rule 1 alone changes the day', differs(only1, none).length > 0,
		JSON.stringify(differs(only1, none)));
	ok('...and rule 2 alone changes it too', differs(only2, none).length > 0,
		JSON.stringify(differs(only2, none)));
	// **THE COUNTER-MEASUREMENT, and it is a BEFORE test rather than an outside-the-window one.**
	// A tank carries its own state forward, so an hour the rules changed moves every hour after it
	// whether a rule fires there or not. What must hold is that nothing changed BEFORE the first
	// window opens: rule 1 states 10 AM and rule 2 states 3 PM, so hours 0 to 9 are the same run
	// or something other than the rules moved.
	ok('nothing changed before the first window opens, so it is the rules and not the run',
		differs(both, none).every((h) => h >= 10), JSON.stringify(differs(both, none)));

	console.log('\n3. AND THE DOCUMENT STILL HOLDS THE FILE\'S OWN LINES');
	{
		const doc = openNet1('both');
		const onDisk = JSON.parse(fs.readFileSync(NET1, 'utf8')).rules;
		ok('opening, assembling and running left the user\'s text alone',
			(doc.rules || []).join('\n') === onDisk.join('\n'), JSON.stringify(doc.rules));
	}

	console.log(fails === 0 ? '\nnet1 rules harness: all checks passed'
		: '\nnet1 rules harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}());

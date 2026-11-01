// A [RULES] BLOCK EPANET WOULD REFUSE IS NAMED, BY RULE, IN BOTH ENGINES (Task 733).
//
//   node dev/lpn-spike/native-rules-refusal-harness.js
//
// EngCalcs.lpnDiagnose answers "rules-refused" with the rule names for a project that runs a period,
// before either engine runs, so the built-in setting and the EPANET setting say the same thing. Each
// text below is run through the EPANET engine with that check switched off, to hold that EPANET really
// does refuse it; and a rule EPANET reads but the built-in loop does not copy is NOT named (it is a
// fallback to EPANET, not a refusal). A steady project, which never runs a rule, is never refused.
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));

const H = 3600, LPS = 0.001;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
const pipe = (id, from, to, length, diameter) => ({ id, type: 'pipe', from, to, length, diameter, roughness: 130, k: 0, status: 'open' });
function net(duration) {
	return {
		method: 'hw', visc: 1.007e-6,
		nodes: [{ id: 'R', type: 'reservoir', elev: 100, head: 100, headBase: 100, headPattern: null },
			{ id: 'J', type: 'junction', elev: 10, demand: 20 * LPS, demandBase: 20 * LPS, demandPattern: null },
			{ id: 'K', type: 'junction', elev: 10, demand: 0, demandBase: 0, demandPattern: null },
			{ id: 'T', type: 'tank', elev: 60, ground: 60, head: 64, level: 4, minLevel: 0.5, maxLevel: 12, diameter: 15 }],
		links: [pipe('P1', 'R', 'J', 1200, 0.3), pipe('P2', 'J', 'T', 800, 0.25), pipe('P9', 'J', 'K', 100, 0.1),
			Object.assign(pipe('C', 'K', 'T', 100, 0.1), { status: 'cv' })],
		time: { times: Object.assign(EngCalcs.lpnTimesDefaults(), { duration: duration, hydraulicStep: H, patternStep: H, reportStep: H }),
			patterns: [], defaultPattern: null, controls: [], warnings: [] },
		hydraulics: { accuracy: 1e-5 }
	};
}
function ruled(text, duration) {
	const m = net(duration === undefined ? 6 * H : duration);
	// As assembleModel() does: a rule the grammar cannot read is dropped (and said), never handed to an engine.
	const blocks = EngCalcs.lpnRuleParse(text.trim().split('\n').map((x) => x.trim())).filter((b) => b.ok);
	m.rules = blocks.map((b) => EngCalcs.lpnRuleConvert(b, (v) => v, () => 'none'));
	return m;
}
const unreadable = (m) => EngCalcs.lpnDiagnose(m).filter((i) => i.code === 'rules-refused').reduce((a, i) => a.concat(i.ids), []);

// Rules EPANET refuses to read: the page's grammar reads some (it parses the text) and not others.
const REFUSED = [
	['FILLTIME on a junction (error 201)', 'RULE Q\nIF NODE J FILLTIME BELOW 1\nTHEN PIPE P9 STATUS IS CLOSED'],
	['a time EPANET cannot read (error 202)', 'RULE Q\nIF SYSTEM TIME > 25 PM\nTHEN PIPE P9 STATUS IS CLOSED'],
	['an action on a check valve (error 207)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PIPE C STATUS IS CLOSED'],
	['an action on a link that does not exist (error 204)', 'RULE Q\nIF SYSTEM TIME > 2\nTHEN PIPE NOSUCH STATUS IS CLOSED'],
	['a premise on a node that does not exist (error 203)', 'RULE Q\nIF NODE NOSUCH PRESSURE BELOW 10\nTHEN PIPE P9 STATUS IS CLOSED']
];
// Rules EPANET reads and runs, which the built-in loop does not copy: not named here.
const READ = [
	['a premise on a pipe\'s roughness', 'RULE Q\nIF PIPE P1 SETTING ABOVE 100\nTHEN PIPE P9 STATUS IS CLOSED'],
	['a premise on a reservoir\'s pressure', 'RULE Q\nIF RESERVOIR R PRESSURE ABOVE 1\nTHEN PIPE P9 STATUS IS CLOSED']
];

async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const check = EngCalcs.lpnRulesRefused;
	for (const [name, text] of REFUSED) {
		const m = ruled(text);
		ok(name + ': lpnDiagnose names the rule', unreadable(m).join() === 'Q', JSON.stringify(EngCalcs.lpnDiagnose(m)));
		ok(name + ': a steady project is not refused for it', unreadable(ruled(text, 0)).length === 0);
		ok(name + ': the built-in run also refuses it, by name', EngCalcs.lpnNativeRunRefusals(m).some((r) => r.code === 'native-run-rules' && r.ids.indexOf('Q') >= 0));
		// EPANET with our check off: the engine itself must not take the text.
		EngCalcs.lpnRulesRefused = () => [];
		let r;
		try { r = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(m))); } catch (e) { r = { ok: false, thrown: true }; }
		EngCalcs.lpnRulesRefused = check;
		ok(name + ': EPANET itself does not run it', !r.ok, r.refused ? 'refused' : (r.thrown ? 'threw' : 'ok=' + r.ok));
	}
	for (const [name, text] of READ) {
		const m = ruled(text);
		ok(name + ': lpnDiagnose does not name it (EPANET reads it)', unreadable(m).length === 0);
		ok(name + ': the built-in loop leaves it to EPANET', EngCalcs.lpnNativeRunRefusals(m).some((r) => r.code === 'native-run-rules'));
		const r = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(m)));
		ok(name + ': EPANET runs it', r.ok === true);
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });

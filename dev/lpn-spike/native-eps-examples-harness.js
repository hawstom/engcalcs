// THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP ON THE SHIPPED EXAMPLES (Task 733, phase 3, slices 2-4).
//
//   node dev/lpn-spike/native-eps-examples-harness.js
//
// native-eps-harness.js holds the loop to EPANET on models built from EPA's .inp files. This one
// opens each gallery example that states [CONTROLS] (examples/*.lwn) through the PAGE'S OWN
// document and assembleModel(), the model a visitor's run would be handed, and runs it twice: by
// EngCalcs.lpnNativeRun and by EngCalcs.lpnEpanetRun (the vendored EPANET 2.3.5). At every reporting
// step every head, tank level and link flow must agree, and every link's open/closed status.
//
// AS SHIPPED, every one of them is refused by name (each runs water quality and states [ENERGY]),
// which is the caller's cue to use EPANET and the answer the slice owes it. So each is then compared
// with what the loop does not yet own TAKEN OFF, from both engines alike: water quality and pump
// energy, which change no head or flow in EPANET (quality is worked out after the hydraulics; energy
// is bookkeeping). SLICE 4 owns [RULES], so the three Net1 examples (Net1, Net1-SI, Net1-Scenarios)
// are compared WITH their rules, which DO change the hydraulics, and each must arrive on the model
// with them and with its pump switching. Each example must have controls; an example losing them
// fails rather than passing on nothing.
//
// SLICE 3, PUMP SPEED PATTERNS. No gallery example ships one, so every example with a pump and a
// period (a duration; the Basic examples and Elm Street are single instants) is
// opened again with a speed pattern ADDED to the document (one new pattern, named by each of its
// pumps), through the same page path, and compared the same way. Each must still have its pumps on
// the pattern when it reaches the model, and the pattern must move the pumps' speed; an example
// whose pumps lost it fails.
//
// TOLERANCE is native-eps-harness.js's, at Accuracy 1e-5 in both engines.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-native-run.js');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tcurrentModel: function () { return assembleModel(); },\n");
const EC = global.EngCalcs;

const HEAD_TOL = 0.8e-3, FLOW_TOL = 2e-6, FLOW_REL = 1e-5, H = 3600;
let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

const ALL = fs.readdirSync(ROOT + 'examples').filter((f) => /\.lwn$/.test(f));
const docOf = (f) => JSON.parse(fs.readFileSync(ROOT + 'examples/' + f, 'utf8'));
const EXAMPLES = ALL.filter((f) => (docOf(f).controls || []).length > 0);
const PUMPED = ALL.filter((f) => (docOf(f).links || []).some((l) => l.type === 'pump') &&
	((docOf(f).times || {}).duration > 0));
const SPEED = [1, 1, 0.95, 0.9, 0.9, 0.95, 1, 1.05, 1.1, 1.1, 1.05, 1];

// The example's text with SPEED added to its patterns and named by every pump.
function withSpeedPattern(file) {
	const d = docOf(file);
	d.patterns = (d.patterns || []).concat([{ id: 'SPEED', multipliers: SPEED }]);
	d.links.forEach((l) => { if (l.type === 'pump') { l.speedPattern = 'SPEED'; } });
	return JSON.stringify(d);
}

async function compare(file, text) {
	const rulesInDoc = !text && (docOf(file).rules || []).length > 0;
	L.applySaved(L.acceptImportedText(text || fs.readFileSync(ROOT + 'examples/' + file, 'utf8')));
	EC.lpnTimeArrived();
	const model = L.currentModel();
	const nCtl = ((model.time && model.time.controls) || []).length;
	if (!text && !nCtl) { ok(file + ' reaches the model with its controls', false, 'no controls on the model'); return; }
	if (text) {
		const pumps = model.links.filter((l) => l.type === 'pump');
		if (!pumps.length || !pumps.every((l) => l.speedPattern === 'SPEED' && l.h0Base !== undefined)) {
			ok(file + ' reaches the model with its pumps on the speed pattern', false, JSON.stringify(pumps.map((l) => [l.id, l.speedPattern])));
			return;
		}
		file += ' with a speed pattern on ' + pumps.map((l) => l.id).join(', ');
	}
	model.hydraulics = Object.assign({}, model.hydraulics || {}, { accuracy: 1e-5 });
	const refused = EC.lpnNativeRunRefusals(model);
	const r0 = EC.lpnNativeRun(model);
	if (!text) {
		ok(file + ' as shipped: refused by name, so the caller uses EPANET', refused.length > 0 && r0.refused === true,
			refused.map((r) => r.code).join(', '));
	}
	const hadRules = !!(model.rules && model.rules.length);
	if (!text && rulesInDoc && !hadRules) { ok(file + ' reaches the model with its rules', false, 'no rules on the model'); return; }
	delete model.quality; delete model.msx; delete model.energy;
	const still = EC.lpnNativeRunRefusals(model);
	if (still.length) { ok(file + ' with quality, energy and rules off', false, 'still refused: ' + JSON.stringify(still)); return; }
	file += hadRules ? `, quality and energy off, ${model.rules.length} RULES on` : ', quality and energy off';
	const epa = await EC.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	const nat = EC.lpnNativeRun(model);
	if (!epa.ok || !nat.ok) { ok(file, false, `ok native=${nat.ok} epanet=${epa.ok} ` + JSON.stringify(nat.issues || epa.issues || '')); return; }
	const same = epa.frames.length === nat.frames.length && epa.frames.every((f, i) => f.t === nat.frames[i].t);
	let dH = 0, atH = '', dL = 0, atL = '', dQ = 0, atQ = '', qMax = 0, st = 0, sw = 0;
	if (same) {
		epa.frames.forEach((fe, i) => {
			const fn = nat.frames[i];
			model.nodes.forEach((n) => {
				const d = Math.abs(fn.heads[n.id] - fe.heads[n.id]);
				if (d > dH) { dH = d; atH = n.id + '@' + fe.t / H + 'h'; }
				if (n.type === 'tank') {
					const dl = Math.abs(fn.levels[n.id] - fe.levels[n.id]);
					if (dl > dL) { dL = dl; atL = n.id + '@' + fe.t / H + 'h'; }
				}
			});
			model.links.forEach((l) => {
				qMax = Math.max(qMax, Math.abs(fe.flows[l.id]));
				const d = Math.abs(fn.flows[l.id] - fe.flows[l.id]);
				if (d > dQ) { dQ = d; atQ = l.id + '@' + fe.t / H + 'h'; }
				if (fn.statuses[l.id] !== fe.statuses[l.id]) { st++; }
				if (i && fe.statuses[l.id] !== epa.frames[i - 1].statuses[l.id]) { sw++; }
			});
		});
	}
	const qTol = Math.max(FLOW_TOL, FLOW_REL * qMax);
	// A speed-pattern case need not switch a status; its pumps' flow must move with the pattern.
	let qSwing = 0;
	if (text && same) {
		model.links.filter((l) => l.type === 'pump').forEach((l) => {
			const q = epa.frames.map((f) => f.flows[l.id]);
			qSwing = Math.max(qSwing, Math.max(...q) - Math.min(...q));
		});
	}
	ok(`${file}, ${nCtl} controls`, same && dH <= HEAD_TOL && dL <= HEAD_TOL && dQ <= qTol && st === 0 && (text ? qSwing > 1e-3 : sw > 0),
		`steps ${nat.frames.length}/${epa.frames.length}${same ? '' : ' DIFFER'}  dH=${dH.toExponential(2)} m @${atH}  ` +
		`dLevel=${dL.toExponential(2)} m @${atL || '-'}  dQ=${dQ.toExponential(2)} m3/s @${atQ} (tol ${qTol.toExponential(1)})  ` +
		`[${sw} status changes in EPANET's frames${text ? `; pump flow swing ${(qSwing * 1000).toFixed(1)} L/s` : ''}${st ? `; ${st} STATUS DIFFERENCES` : ''}]`);
}

(async function () {
	setUnitSet('us');
	await warmEpanet();
	ok('the gallery has examples with controls', EXAMPLES.length >= 2, EXAMPLES.join(', '));
	for (const f of EXAMPLES) { await compare(f); }
	ok('the gallery has examples with pumps', PUMPED.length >= 4, PUMPED.join(', '));
	for (const f of PUMPED) { await compare(f, withSpeedPattern(f)); }
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

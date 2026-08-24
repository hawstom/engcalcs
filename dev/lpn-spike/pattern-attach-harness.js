// A PATTERN ON A RESERVOIR HEAD AND ON A PUMP SPEED -- ROADMAP Task 248.02. Run with:
//   node dev/lpn-spike/pattern-attach-harness.js
//
// Task 423 gave a junction's demand a pattern and dev/lpn-spike/pattern-demand-harness.js proved
// the multiplier reached the solver. This is the same proof for the other two attachment points
// EPANET has -- a reservoir's total head (Head x Pattern) and a pump's relative speed -- and EPA's
// own Net1/Net2/Net3 use NEITHER, which is why the fixture is hand-written.
//
// **THE FIXTURE IS TWO DISCONNECTED COMPONENTS ON PURPOSE** (reference/pattern-attach.inp). Each
// junction is fed by exactly one thing, so its flow is its own demand and nothing else -- and a
// demand with no pattern is constant. That makes both anchors EXACT rather than approximate:
//
//   1. THE RESERVOIR. EPANET reports R1's head at every step, and it must be the file's own
//      200.0 ft times RHEAD's multiplier for that hour. That is EPANET answering the question
//      this task is about, in its own numbers, with nothing of ours in between.
//   2. THE PUMP. The flow through PU1 is J2's 150 gpm at every step, so the head EPANET reports
//      across it must satisfy the affinity law at that step's speed:
//          H = s^2 ( h0 - a (Q/s)^b )
//      with h0/a/b fitted from the file's own three curve points. The fit is ours
//      (EngCalcs.lpnPumpFromCurve) and the answer is EPANET's, so the two have to agree
//      independently -- exactly the shape of dev/lpn-spike/eps-net3-harness.js's anchor.
//
// **AND `s` IS THE PATTERN'S MULTIPLIER, NOT 1.20 TIMES IT -- MEASURED HERE, NOT ASSUMED.** The
// first version of this harness composed them and was 87 ft out. Written `SPEED 1.2` alone the same
// pump develops exactly the affinity head for 1.2; written `SPEED 2.0 PATTERN P` it develops the
// head for P(t) and the 2.0 is discarded. Section 7 asserts BOTH halves, because that pair is the
// whole of why js/looped-network.js's pumpSpeedNow() replaces rather than multiplies.
//
// The engine is REAL here (dev/lpn-spike/lpn-dom-stub.js loads the vendored EPANET), so this file
// is async and awaits settleEpanet() after anything that solves.

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet, GPM, FT } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-inp.js');
// **BEFORE loadLoopedNetwork**, because js/looped-network.js calls EngCalcs.lpnTimeInit() at script
// scope to register itself as the clock's host. Required after it, lpnTimeAttach() would find no
// host, every model would arrive with no `time` block, and the run in section 7 would quietly be a
// single instant -- which is exactly the stub-holds-the-coupling-constant failure
// dev/testing-notes.md warns about, wearing a passing harness.
require(ROOT + 'js/lpn-time.js');

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
	"\t\tserialize: serializeProject, assembleModel: assembleModel,\n" +
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\trunSolve: runSolve, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tlibRenamePattern: libRenamePattern, libDeletePattern: libDeletePattern,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// RELATIVE, for the same reason pattern-demand-harness.js gives: a value that crossed into SI and
// back is not the same double, so a part-per-billion bound states "the multiplier was applied"
// while an absolute one would be a claim about float arithmetic.
function near(a, b, rel) { return Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(b)); }

const FIX = path.join(ROOT, 'dev/lpn-spike/reference/pattern-attach.inp');
const TEXT = fs.readFileSync(FIX, 'utf8');

// The popup builds fields into this element; every section that reads a control reads it here.
const pf = byId.lpn_popup_fields;
function selectsIn(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) {
		if (c.tagName === 'SELECT') { out.push(c); }
		selectsIn(c, out);
	});
	return out;
}
function inputsIn(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) {
		if (c.tagName === 'INPUT' && c.type === 'number') { out.push(c); }
		inputsIn(c, out);
	});
	return out;
}
function fire(el, type) { (el._listeners[type] || []).forEach(function (f) { f({ target: el }); }); }

async function main() {

console.log('=== Task 248.02: a pattern on a reservoir head and on a pump ===');

await warmEpanet();
setUnitSet('si');   // the file's own units must win, exactly as in inp-import-harness.js
byId.lpn_dialog_body.children.length = 0;
L.importInp({ name: 'pattern-attach.inp', _text: TEXT });
const doc = L.getDoc();

// ---------------------------------------------------------------------------
console.log('\n1. the file\'s two attachments reach the document');
// ---------------------------------------------------------------------------
const R1 = doc.nodes.find((n) => n.id === 'R1'), R2 = doc.nodes.find((n) => n.id === 'R2');
const PU1 = doc.links.find((l) => l.id === 'PU1');
ok('the reservoir carries its head pattern', R1 && R1.headPattern === 'RHEAD', R1 && R1.headPattern);
ok('a reservoir with a blank column carries none', R2 && !R2.headPattern, R2 && R2.headPattern);
ok('the pump carries its relative speed', PU1 && PU1.speed === 1.2, PU1 && PU1.speed);
ok('the pump carries its speed pattern', PU1 && PU1.speedPattern === 'PSPD', PU1 && PU1.speedPattern);
ok('...and the file\'s own text for the speed', PU1 && PU1.tok && PU1.tok.speed === '1.20',
	JSON.stringify(PU1 && PU1.tok));
ok('both patterns came in', doc.patterns.length === 2, doc.patterns.length + ' patterns');

const times = doc.times;
const rhead = EngCalcs.lpnPatternById(doc.patterns, 'RHEAD');
const pspd = EngCalcs.lpnPatternById(doc.patterns, 'PSPD');
const mult = (p, t) => EngCalcs.lpnPatternValue(p, t, times.patternStep, times.patternStart);
ok('RHEAD is not flat -- so every test below can tell two answers apart',
	Math.abs(mult(rhead, 0) - mult(rhead, 5 * 3600)) > 0.05,
	mult(rhead, 0) + ' -> ' + mult(rhead, 5 * 3600));
ok('PSPD is not flat either',
	Math.abs(mult(pspd, 0) - mult(pspd, 4 * 3600)) > 0.05,
	mult(pspd, 0) + ' -> ' + mult(pspd, 4 * 3600));

// ---------------------------------------------------------------------------
console.log('\n2. the property popup attaches one, and it is the SAME control the demand uses');
// ---------------------------------------------------------------------------
const PC = EngCalcs.pageConfig || {};
{
	L.renderNodeFields('R1');
	const sels = selectsIn(pf);
	const headSel = sels.find((s) => (s.children || []).some((o) => o.value === 'RHEAD'));
	ok('the reservoir popup offers a pattern picker', !!headSel, sels.length + ' selects');
	ok('...showing this reservoir\'s own pattern', headSel && headSel.value === 'RHEAD',
		headSel && headSel.value);
	ok('...listing every pattern in the project plus No pattern',
		headSel && headSel.children.length === doc.patterns.length + 1,
		headSel && headSel.children.length);
	// The write, through the control rather than around it.
	headSel.value = 'PSPD';
	fire(headSel, 'change');
	ok('choosing one writes it onto the reservoir', R1.headPattern === 'PSPD', R1.headPattern);
	headSel.value = '';
	fire(headSel, 'change');
	ok('choosing No pattern clears it -- null, never the empty string',
		R1.headPattern === null, JSON.stringify(R1.headPattern));
	headSel.value = 'RHEAD';
	fire(headSel, 'change');
	ok('...and back', R1.headPattern === 'RHEAD');
	// A junction has no head pattern row: the head is a RESULT there, not a boundary.
	L.renderNodeFields('J1');
	const jLabels = JSON.stringify(pf.children.map((c) => c.textContent || ''));
	ok('a junction is not offered one', jLabels.indexOf(PC.lpn_field_head_pattern) < 0, jLabels);
}
{
	L.renderLinkFields('PU1');
	const sels = selectsIn(pf);
	const spdSel = sels.find((s) => (s.children || []).some((o) => o.value === 'PSPD') &&
		(s.children || []).some((o) => o.value === ''));
	ok('the pump popup offers a speed pattern picker', !!spdSel);
	ok('...showing this pump\'s own', spdSel && spdSel.value === 'PSPD', spdSel && spdSel.value);
	const nums = inputsIn(pf);
	const speedBox = nums.find((i) => String(i.value) === '1.2');
	ok('the pump popup offers its relative speed', !!speedBox,
		JSON.stringify(nums.map((i) => i.value)));
	speedBox.value = '0.8';
	fire(speedBox, 'change');
	ok('typing one writes it onto the pump', PU1.speed === 0.8, PU1.speed);
	// A blank or a negative is 1 -- the curve as drawn -- and never 0, which would be a pump the
	// user did not switch off appearing to be off.
	speedBox.value = '';
	fire(speedBox, 'change');
	ok('a blank speed reads as 1, not as 0', PU1.speed === 1, PU1.speed);
	speedBox.value = '1.2';
	fire(speedBox, 'change');
	ok('...and back', PU1.speed === 1.2, PU1.speed);
	spdSel.value = '';
	fire(spdSel, 'change');
	ok('No pattern clears the schedule', PU1.speedPattern === null, JSON.stringify(PU1.speedPattern));
	spdSel.value = 'PSPD';
	fire(spdSel, 'change');
	ok('...and back', PU1.speedPattern === 'PSPD');
}

// ---------------------------------------------------------------------------
console.log('\n3. one instant: the multiplier reaches the model, and the document is untouched');
// ---------------------------------------------------------------------------
{
	const model = L.assembleModel();
	const mr = model.nodes.find((n) => n.id === 'R1');
	const mp = model.links.find((l) => l.id === 'PU1');
	const m0 = mult(rhead, 0);
	ok('the document still holds the file\'s own head', R1._head === 200, R1._head);
	ok('...and the solver is handed head x the pattern\'s multiplier at t=0',
		near(mr.head / FT, 200 * m0), (mr.head / FT).toFixed(6) + ' vs ' + (200 * m0).toFixed(6));
	ok('...with the unscaled head beside it for the run',
		near(mr.headBase / FT, 200) && mr.headPattern === 'RHEAD',
		(mr.headBase / FT) + ' / ' + mr.headPattern);

	// The pump's fitted curve, scaled by the affinity laws: H = s^2 ( h0 - a (Q/s)^b ), which is
	// H = (s^2 h0) - (a s^(2-b)) Q^b.
	const fit = EngCalcs.lpnPumpFromCurve(PU1.curvePoints.map((p) => [p[0] * GPM, p[1] * FT]));
	// The pattern is attached, so the multiplier IS the speed and the pump's own 1.2 stands aside.
	const s0 = mult(pspd, 0);
	ok('the pump\'s curve is handed over SCALED by the speed',
		near(mp.h0, fit.h0 * s0 * s0) && near(mp.a, fit.a * Math.pow(s0, 2 - fit.b)),
		mp.h0 + ' vs ' + fit.h0 * s0 * s0);
	ok('...with the UNSCALED curve beside it for the run',
		near(mp.h0Base, fit.h0) && near(mp.aBase, fit.a) && mp.speed === 1.2 &&
		mp.speedPattern === 'PSPD', mp.h0Base + ' / ' + mp.speed);
	ok('the document still holds the file\'s own speed', PU1.speed === 1.2, PU1.speed);
	// ...and with no pattern attached, that stated speed is the one that scales the curve.
	{
		const was = PU1.speedPattern;
		PU1.speedPattern = null;
		const solo = L.assembleModel().links.find((l) => l.id === 'PU1');
		ok('with no pattern, the pump\'s own speed scales the curve',
			near(solo.h0, fit.h0 * 1.2 * 1.2), solo.h0 + ' vs ' + fit.h0 * 1.44);
		PU1.speedPattern = was;
	}

	// **A SCHEDULE THAT READS 0 IS A PUMP THAT IS OFF, NOT ONE THAT SUCKS.** The scaling algebra
	// degenerates at s = 0 into H = -a Q^b -- a lossy connection water still flows through.
	doc.patterns.push(EngCalcs.lpnPatternMake('OFF', [0, 0, 0]));
	PU1.speedPattern = 'OFF';
	const off = L.assembleModel().links.find((l) => l.id === 'PU1');
	ok('a zero multiplier closes the pump in the MODEL', off.status === 'closed', off.status);
	ok('...while the document says nothing of the kind',
		PU1._status !== 'closed' && off.statusBase !== 'closed', PU1._status + ' / ' + off.statusBase);
	PU1.speedPattern = 'PSPD';
	doc.patterns.pop();
}

// ---------------------------------------------------------------------------
console.log('\n4. renaming and deleting a pattern travels to all four attachment points');
// ---------------------------------------------------------------------------
{
	ok('a rename reaches a reservoir head', L.libRenamePattern(rhead, 'River') && R1.headPattern === 'River',
		R1.headPattern);
	L.libRenamePattern(rhead, 'RHEAD');
	ok('a rename reaches a pump speed', L.libRenamePattern(pspd, 'Duty') && PU1.speedPattern === 'Duty',
		PU1.speedPattern);
	L.libRenamePattern(pspd, 'PSPD');
	// A reference to a pattern that is gone would still SAY the reservoir follows one.
	const spare = EngCalcs.lpnPatternMake('SPARE', [1, 1]);
	doc.patterns.push(spare);
	R1.headPattern = 'SPARE'; PU1.speedPattern = 'SPARE';
	L.libDeletePattern(spare);
	ok('a delete clears both references', R1.headPattern === null && PU1.speedPattern === null,
		R1.headPattern + ' / ' + PU1.speedPattern);
	R1.headPattern = 'RHEAD'; PU1.speedPattern = 'PSPD';
}

// ---------------------------------------------------------------------------
console.log('\n5. the round trip: every value the user did not edit comes back byte-identical');
// ---------------------------------------------------------------------------
{
	const out = EngCalcs.lpnExportInp(L.serialize(), {
		effective: function (el, prop) { return el['_' + prop]; }
	});
	ok('the export succeeds', !!out && out.ok, out && JSON.stringify(out.error));
	const text = (out && out.inp) || '';

	// The deliberately-dumber reader inp-export-harness.js uses: section, row, whitespace.
	function section(name) {
		const rows = [];
		let inSec = false;
		for (const raw of text.split(/\r?\n/)) {
			const line = raw.replace(/;.*$/, '').trim();
			if (!line) { continue; }
			const m = /^\[(\w+)\]/.exec(line);
			if (m) { inSec = m[1].toUpperCase() === name; continue; }
			if (inSec) { rows.push(line.split(/\s+/)); }
		}
		return rows;
	}
	const rRow = section('RESERVOIRS').find((r) => r[0] === 'R1');
	ok('[RESERVOIRS] R1 keeps the file\'s own head, character for character',
		rRow && rRow[1] === '200.0', JSON.stringify(rRow));
	ok('...and names its pattern in the third column', rRow && rRow[2] === 'RHEAD', JSON.stringify(rRow));
	const r2Row = section('RESERVOIRS').find((r) => r[0] === 'R2');
	ok('a reservoir with no pattern writes no third column', r2Row && r2Row.length === 2,
		JSON.stringify(r2Row));
	const pRow = section('PUMPS').find((r) => r[0] === 'PU1');
	ok('[PUMPS] PU1 keeps its speed, character for character',
		pRow && pRow.indexOf('SPEED') > 0 && pRow[pRow.indexOf('SPEED') + 1] === '1.20',
		JSON.stringify(pRow));
	ok('...and names its schedule', pRow && pRow[pRow.indexOf('PATTERN') + 1] === 'PSPD',
		JSON.stringify(pRow));
	ok('...and still names its curve', pRow && pRow.indexOf('HEAD') > 0, JSON.stringify(pRow));
	ok('[PATTERNS] is written', section('PATTERNS').length > 0);

	// And the whole thing read back is the same document.
	const back = EngCalcs.lpnInpParse(text);
	ok('our own file parses', back.ok, back.error);
	const bR1 = back.nodes.find((n) => n.id === 'R1'), bP = back.links.find((l) => l.id === 'PU1');
	ok('the reservoir returns with the same head AND the same pattern',
		bR1.head === 200 && bR1.headPattern === 'RHEAD', bR1.head + ' / ' + bR1.headPattern);
	ok('the pump returns with the same speed AND the same schedule',
		bP.speed === 1.2 && bP.speedPattern === 'PSPD', bP.speed + ' / ' + bP.speedPattern);
	ok('...and the token survives a second trip', bP.tok && bP.tok.speed === '1.20',
		JSON.stringify(bP.tok));
	ok('both patterns return', back.patterns.length === 2, back.patterns.length);

	// A pump the user leaves at 1 states no SPEED at all -- EPANET's own default, and a column the
	// file it came from did not have.
	const wasSpeed = PU1.speed;
	PU1.speed = 1;
	const plain = EngCalcs.lpnExportInp(L.serialize(), { effective: (el, p) => el['_' + p] });
	ok('a pump at speed 1 writes no SPEED column', plain.ok && plain.inp.indexOf('SPEED') < 0);
	PU1.speed = wasSpeed;
}

// ---------------------------------------------------------------------------
console.log('\n6. EPANET unreachable: one instant, the multipliers in it, and said out loud');
// ---------------------------------------------------------------------------
{
	const realRun = EngCalcs.lpnEpanetRun, realSolve = EngCalcs.lpnSolveEpanet;
	EngCalcs.lpnEpanetRun = undefined;
	EngCalcs.lpnSolveEpanet = undefined;
	L.settings().engine = 'native';
	L.runSolve();
	await settleEpanet();
	const res = L.lastResult();
	ok('the built-in solver still answers', !!res && res.converged === true,
		JSON.stringify(res && res.issues));
	const m0 = mult(rhead, 0);
	ok('...at the reservoir\'s PATTERNED head, not its written one',
		near(res.heads.R1 / FT, 200 * m0, 1e-9),
		(res.heads.R1 / FT).toFixed(6) + ' vs ' + (200 * m0).toFixed(6));
	// **AND THE PUMP AT THAT SAME INSTANT, AS PHYSICS AND NOT AS A FLAG.** This is the only place
	// the built-in solver's own scaled curve is checked against the affinity law; get the exponent
	// wrong (s^-b instead of s^(2-b)) and the network still solves, just at the wrong head.
	{
		const fit = EngCalcs.lpnPumpFromCurve(PU1.curvePoints.map((p) => [p[0] * GPM, p[1] * FT]));
		const s = mult(pspd, 0), q = Math.abs(res.flows.PU1);
		const want = s * s * (fit.h0 - fit.a * Math.pow(q / s, fit.b));
		ok('...and the pump at that instant obeys the affinity law at the pattern\'s speed',
			near((res.heads.J2 - res.heads.R2), want, 1e-6),
			((res.heads.J2 - res.heads.R2) / FT).toFixed(4) + ' vs ' + (want / FT).toFixed(4) + ' ft');
	}
	const said = byId.lpn_status.textContent || '';
	ok('...and the page says it is one moment only', /moment|EPANET/i.test(said), said.slice(0, 80));
	EngCalcs.lpnEpanetRun = realRun;
	EngCalcs.lpnSolveEpanet = realSolve;
}

// ---------------------------------------------------------------------------
console.log('\n7. the run: EPANET\'s own numbers, against the two closed forms');
// ---------------------------------------------------------------------------
{
	const model = L.assembleModel();
	const run = await EngCalcs.lpnEpanetRun(model);
	ok('the period runs', run && run.ok !== false && run.frames && run.frames.length === 12,
		run && (run.frames ? run.frames.length + ' frames' : JSON.stringify(run.issues || run.error)));
	if (run && run.frames && run.frames.length) {
		// --- the reservoir: EPANET's reported head IS Head x Pattern ---
		let worstR = 0, atR = null;
		run.frames.forEach(function (f) {
			const want = 200 * mult(rhead, f.t);
			const got = f.heads.R1 / FT;
			if (Math.abs(got - want) > worstR) { worstR = Math.abs(got - want); atR = f.t; }
		});
		ok('every frame puts the reservoir at its written head times that hour\'s multiplier',
			worstR < 1e-5, 'worst ' + worstR.toExponential(2) + ' ft at t=' + atR + ' s');
		// The frames must MOVE, or the assertion above would pass on a flat run.
		const spread = Math.max.apply(null, run.frames.map((f) => f.heads.R1)) -
			Math.min.apply(null, run.frames.map((f) => f.heads.R1));
		ok('...and the reservoir really moved through the run', spread / FT > 15,
			(spread / FT).toFixed(2) + ' ft between the highest and lowest frame');
		// And the junction below it moves with it: the flow is its own constant demand, so the
		// head difference between two frames is the reservoir's difference exactly.
		let worstJ = 0;
		run.frames.forEach(function (f) {
			const d = Math.abs((f.heads.J1 - run.frames[0].heads.J1) -
				(f.heads.R1 - run.frames[0].heads.R1));
			if (d > worstJ) { worstJ = d; }
		});
		ok('...and the junction below it moves by exactly as much', worstJ / FT < 5e-3,
			'worst ' + (worstJ / FT).toExponential(2) + ' ft');

		// --- the pump: the affinity law at that hour's speed ---
		const fit = EngCalcs.lpnPumpFromCurve(PU1.curvePoints.map((p) => [p[0] * GPM, p[1] * FT]));
		let worstP = 0, atP = null, movedP = 0;
		run.frames.forEach(function (f) {
			const s = mult(pspd, f.t),
				q = Math.abs(f.flows.PU1),
				want = s * s * (fit.h0 - fit.a * Math.pow(q / s, fit.b)),
				got = f.heads.J2 - f.heads.R2;
			if (Math.abs(got - want) > worstP) { worstP = Math.abs(got - want); atP = f.t; }
			movedP = Math.max(movedP, Math.abs(got - (run.frames[0].heads.J2 - run.frames[0].heads.R2)));
		});
		ok('every frame\'s pump head obeys H = s^2 ( h0 - a (Q/s)^b ) at that hour\'s speed',
			worstP / FT < 0.01, 'worst ' + (worstP / FT).toFixed(4) + ' ft at t=' + atP + ' s');
		ok('...and the pump head really moved with its schedule', movedP / FT > 5,
			(movedP / FT).toFixed(2) + ' ft');
		// The flow is the demand at every step, which is what makes both anchors exact.
		const qBad = run.frames.filter((f) => !near(Math.abs(f.flows.PU1) / GPM, 150, 1e-6)).length;
		ok('the pump carries J2\'s demand at every step', qBad === 0, qBad + ' frames differ');
	}
}

// ---------------------------------------------------------------------------
console.log('\n8. the measurement pumpSpeedNow() is built on: a pattern REPLACES the speed');
// ---------------------------------------------------------------------------
// The claim is about EPANET, so it is asked of EPANET, twice, on the same pump. Composing the two
// instead (s = 1.20 x P) is 87 ft of pump head out at P = 1.10 and solves without complaint, which
// is exactly the class of wrong answer this whole task is exposed to.
{
	const fit = EngCalcs.lpnPumpFromCurve(PU1.curvePoints.map((p) => [p[0] * GPM, p[1] * FT]));
	const headAt = (frames) => frames[0].heads.J2 - frames[0].heads.R2;
	const law = (s, q) => s * s * (fit.h0 - fit.a * Math.pow(q / s, fit.b));

	const wasPat = PU1.speedPattern;
	PU1.speedPattern = null;
	const solo = await EngCalcs.lpnEpanetRun(L.assembleModel());
	ok('SPEED alone: EPANET develops the affinity head for that speed',
		near(headAt(solo.frames), law(1.2, Math.abs(solo.frames[0].flows.PU1)), 1e-6),
		(headAt(solo.frames) / FT).toFixed(3) + ' ft');

	PU1.speedPattern = wasPat;
	const wasSpeed = PU1.speed;
	PU1.speed = 2;
	const both = await EngCalcs.lpnEpanetRun(L.assembleModel());
	ok('SPEED plus PATTERN: EPANET uses the multiplier and DISCARDS the stated speed',
		near(headAt(both.frames), law(mult(pspd, 0), Math.abs(both.frames[0].flows.PU1)), 1e-6),
		(headAt(both.frames) / FT).toFixed(3) + ' ft at a multiplier of ' + mult(pspd, 0));
	ok('...which is NOT what composing them would give', 
		Math.abs(headAt(both.frames) - law(2 * mult(pspd, 0), Math.abs(both.frames[0].flows.PU1))) / FT > 10,
		'composed would be ' + (law(2 * mult(pspd, 0), Math.abs(both.frames[0].flows.PU1)) / FT).toFixed(1) + ' ft');
	PU1.speed = wasSpeed;
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

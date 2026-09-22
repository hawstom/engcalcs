// **THE REACTION RATE, ANCHORED AGAINST EPANET'S OWN REPORT** -- ROADMAP Task 652. Run with:
//
//   node dev/lpn-spike/reaction-rate-harness.js
//
// **THE POINT OF THIS FILE IS THAT WE DID NOT INVENT THE ARITHMETIC, AND IT PROVES IT TWICE.**
//
// Task 638 shipped four of EPANET's five link report columns and stopped at the fifth, correctly:
// the toolkit's `LinkProperty` enum ends at `LinkQual`, so there is no getter, and a friction factor
// is the definition of head loss rearranged where a reaction rate is a MODEL -- a bulk term, a wall
// term, and a mass-transfer coefficient off a Sherwood correlation. Deriving that ourselves would
// have been inventing arithmetic nothing checks, which this repository refuses.
//
// **THE DOOR THAT WAS MISSED IS THE BINARY OUTPUT FILE.** EPANET fills `qual->PipeRateCoeff[k]` in
// `reactpipes()` (`src/qualreact.c`) and writes it as the seventh of eight per-link series in
// `linkoutput()` (`src/output.c`, `case REACTRATE`) -- the same array its own `.rpt` link table
// prints from. The vendored wrapper already exports `readBinary()` and names that series
// `reactionRate`. So the page now shows EPANET's own number, and there is no arithmetic of ours
// anywhere on the path.
//
// **LEG ONE -- AGAINST EPANET'S OWN `.rpt`, EVERY PIPE, EVERY REPORTING PERIOD.** Section 3 takes
// the `.inp` the page's own exporter built, appends nothing but a `[REPORT]` section asking for the
// Reaction column, runs it through a SEPARATE Workspace, and compares EPANET's own printed report
// against what `linkReactionRate()` puts on the map. The report prints two decimals, so the bound
// is the report's own precision and not a tolerance anybody chose -- the same argument
// dev/lpn-spike/energy-anchor-harness.js makes about the Energy Usage table.
//
// **LEG TWO -- AGAINST THE PUBLISHED MODEL, COMPUTED HERE FROM THE MANUAL.** Leg one would pass if
// our reader and EPANET's writer agreed about a number that meant something else entirely: it says
// the plumbing is right, not that the quantity is the one an engineer thinks it is. So section 4
// recomputes the rate from EPANET's published water-quality model -- first-order bulk plus a wall
// term limited by mass transfer, with the Sherwood correlation and the Schmidt number -- and lands
// on the same numbers. That arithmetic lives HERE and is never shipped: it is a check ON the
// engine's answer, not a second source OF it.
//
// **AND A THIRD THING THE FIRST TWO CANNOT SEE: WHICH FRAME A RATE IS HUNG ON.** Both legs above
// would pass with every period's rate written onto the wrong frame, because a settled run reports
// the same number at every instant. Section 5 runs a case that is still CHANGING at every reported
// step and pins the whole series in order, with a non-zero report start -- the one arrangement in
// which EPANET's period index and this page's frame list could drift apart.
//
// NO ENGLISH LITERAL IS ASSERTED ANYWHERE (dev/scripts/harness_wording_check.php). Every label comes
// from `EngCalcs.pageConfig`, which the stub fills from the real lib/lang.ec.en.php.

'use strict';

const { ROOT, NODE_ENGINE_URL, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-epanet.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddNode: addNode, addLink: addLink, effective: effective, setProp: setProp,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tassembleModel: assembleModel, applySolveResult: applySolveResult,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	// Task 652's own four, handed over by name so this file reads the page's answers rather than a
	// second opinion about them.
	"\t\tlinkReactionRate: linkReactionRate, reactionRateUnitText: reactionRateUnitText,\n" +
	"\t\tcolorFieldUnit: colorFieldUnit, colorFieldUnitText: colorFieldUnitText,\n" +
	"\t\tcolorValueOf: colorValueOf, colorFieldLabel: colorFieldLabel, colorLinkValue: colorLinkValue,\n" +
	// The two surfaces Task 664 found it missing from (Tom, 2026-09-21): the Properties popup and
	// the Tables pane. renderLinkFields builds the real popup DOM; the Tables pane reads through
	// colorLinkValue() above, the same accessor paneColLinkResult() calls.
	"\t\trenderLinkFields: renderLinkFields,\n" +
	"\t\tcolorFieldOptions: function (g) { return colorFieldOptions(g).map(function (o) { return o[0]; }); },\n" +
	"\t\tlinkFields: function () { return linkFieldDefs(EngCalcs.pageConfig || {}).map(function (f) { return f[0]; }); },\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, refreshLabelText: refreshLabelText,\n" +
	"\t\tunitFactor: unitFactor, resultUnit: resultUnit,\n" +
	"\t\tlinkLabel: function (id) { return (linkEls[id].allLines || []).map(function (l) { return l.text; }); },\n" +
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
// The stub's querySelectorAll() answers nothing, so the walk is the harness's own -- fittings-
// harness.js's, reused here to read a disabled control (none here) or, as below, a popup's text.
function walk(el, out) {
	out = out || [];
	(el.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}

// ---------------------------------------------------------------------------------------------
// THE REFERENCE RUN: the page's own `.inp`, run again through a SEPARATE Workspace with a
// `[REPORT]` section asking EPANET to print its Reaction column.
//
// **THE `.inp` IS THE PAGE'S, NOT A COPY TYPED HERE.** A network written twice is two networks, and
// the two would have to be kept in step by hand forever. `[REPORT]` is inserted before `[END]`
// because that is the only section this file adds; every pipe, every coefficient, every time is the
// exporter's own text.
//
// `Page 0` turns off pagination so no header interrupts a table, and `Summary No` / `Status No`
// drop the two blocks that are not results. `Links All` plus `Reaction Yes` is the whole request.
// ---------------------------------------------------------------------------------------------
const REPORT_SECTION = '[REPORT]\n Links All\n Nodes None\n Reaction Yes\n Status No\n Summary No\n Page 0\n\n';

function withReportSection(inp) {
	const i = inp.indexOf('[END]');
	return i < 0 ? inp + '\n' + REPORT_SECTION : inp.slice(0, i) + REPORT_SECTION + inp.slice(i);
}

/**
 * EPANET's own printed Reaction column, as `{ t_seconds: { linkId: rate } }`.
 *
 * The report is plain text, so this reads it the way a person does: a "Link Results at H:MM:SS"
 * heading opens a table, the two heading rows name the columns, and each row after the rule is one
 * link. **The Reaction column is found by its POSITION in the heading row rather than assumed**, so
 * a build that prints a different set of columns fails to find it rather than reading a velocity as
 * a reaction rate.
 */
function parseLinkReport(rpt) {
	const out = {};
	const lines = rpt.split(/\r?\n/);
	let at = null, col = -1, inTable = false;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const m = /Link Results at (\d+):(\d\d):(\d\d)/.exec(line);
		if (m) {
			at = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
			out[at] = {};
			col = -1; inTable = false;
			continue;
		}
		if (at === null) { continue; }
		// The column heading row: the one carrying the word EPANET prints over that column. Taken
		// from the report itself rather than counted, for the reason above.
		if (col < 0 && /\bReaction\b/.test(line)) {
			// **+1 FOR THE ID CELL.** The heading row names only the value columns, and every data
			// row carries the link's id in front of them -- so the heading's index 3 is the data
			// row's index 4. Off by one here reads a head loss as a reaction rate, which is a
			// plausible small number beside a plausible small number and passed once.
			col = line.trim().split(/\s+/).indexOf('Reaction') + 1;
			continue;
		}
		if (col < 0) { continue; }
		if (/^\s*-{5,}\s*$/.test(line)) { inTable = !inTable; continue; }
		if (!inTable) { continue; }
		const parts = line.trim().split(/\s+/);
		// A link row is an id followed by numbers. `col` counts from the heading row, whose first
		// cell sits over the id column, so the index lines up directly.
		if (parts.length <= col) { continue; }
		const v = Number(parts[col]);
		if (!isFinite(v)) { continue; }
		out[at][parts[0]] = v;
	}
	return out;
}

async function epanetReport(inp) {
	const mod = await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('ref.inp', withReportSection(inp));
	p.open('ref.inp', 'ref.rpt', 'ref.out');
	p.solveH();
	p.solveQ();
	p.report();
	p.close();
	return parseLinkReport(ws.readFile('ref.rpt'));
}

// ---------------------------------------------------------------------------------------------
// LEG TWO: EPANET'S PUBLISHED WATER-QUALITY MODEL, WRITTEN OUT HERE AND NOWHERE ELSE.
//
// EPANET 2.2 manual, water quality chapter, and `src/qualreact.c`'s `pipereact()`, `bulkrate()`,
// `wallrate()` and `piperate()`. For a FIRST-ORDER bulk reaction with no limiting potential and a
// FIRST-ORDER wall reaction, the instantaneous rate in a parcel at concentration c is
//
//     r(c) = (Kb + Rc) * c        Kb = bulk coefficient, Rc = the wall rate coefficient
//
// and Rc is the wall coefficient LIMITED BY MASS TRANSFER to the pipe wall:
//
//     Rc = (4/d) * Kw * kf / (kf + |Kw|)        kf = Sh * D / d
//     Sh = 0.0149 Re^0.88 Sc^(1/3)              for Re >= 2300
//     Sh = 3.65 + 0.0668 y / (1 + 0.04 y^(2/3)) for Re < 2300, y = (d/L) Re Sc
//     Sc = nu / D                               Schmidt number
//
// **THAT LINEARITY IS THE WHOLE REASON THIS LEG CAN EXIST.** EPANET reports the VOLUME-WEIGHTED
// mean of |r| over the parcels standing in the pipe, and separately reports the volume-weighted
// mean CONCENTRATION as the link's average quality. Where r is linear in c the mean of the rate is
// the rate at the mean, exactly -- so the published model can be checked against two numbers the
// engine already reports, with no parcel profile of our own. It would NOT hold at a second-order
// reaction or under a limiting potential, which is why every case here is first order and says so.
//
// SI throughout, which is what the page's exporter always writes. The formula is dimensionless in
// its unit system: Re and Sc carry none, and `(4/d) * [L/s]` is a reciprocal time either way.
// ---------------------------------------------------------------------------------------------

// EPANET's own defaults, from its manual's [OPTIONS] section: the Viscosity and Diffusivity options
// are RELATIVE, and these are what they are relative to. Stated in ft^2/s as EPANET states them and
// carried into metres by the suite's own exact foot, so there is one definition of a foot here too.
const FT2 = 0.3048 * 0.3048;
const EPANET_VISCOSITY = 1.1e-5 * FT2;   // m^2/s, water at 20 C
const EPANET_DIFFUSIVITY = 1.3e-8 * FT2; // m^2/s, chlorine at 20 C

function publishedRate(o) {
	// o: { d, len, flow (m3/s), kb, kw, c }  -- kb and kw per DAY, as a [REACTIONS] row states them
	const area = Math.PI * o.d * o.d / 4;
	const u = Math.abs(o.flow) / area;
	const sc = EPANET_VISCOSITY / EPANET_DIFFUSIVITY;
	const re = u * o.d / EPANET_VISCOSITY;
	let sh;
	if (re < 1) { sh = 2; }
	else if (re >= 2300) { sh = 0.0149 * Math.pow(re, 0.88) * Math.pow(sc, 0.333); }
	else {
		const y = o.d / o.len * re * sc;
		sh = 3.65 + 0.0668 * y / (1 + 0.04 * Math.pow(y, 0.667));
	}
	const kf = sh * EPANET_DIFFUSIVITY / o.d;          // m/s
	const kwSec = o.kw / 86400;                        // m/s, off a per-day coefficient
	const rc = kwSec === 0 ? 0 : (4 / o.d) * kwSec * kf / (kf + Math.abs(kwSec));
	const kbSec = o.kb / 86400;                        // 1/s
	// Back to per DAY, which is the basis EPANET reports this column in, and a magnitude because
	// reactpipes() accumulates fabs().
	return Math.abs(kbSec + rc) * o.c * 86400;
}

// ---------------------------------------------------------------------------------------------

const CHEM = { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' };
const AGE = { mode: 'age', traceNode: '' };

setUnitSet('si');
L.buildLayers();
L.seedDefaultInputs();

// A reservoir holding a residual, two junctions drawing demand, and a pump: three pipes of
// different diameters carrying different flows, so the Reynolds number and therefore the wall term
// differ from pipe to pipe. A network where every pipe had the same rate would pass with the rate
// read off the wrong link.
const res = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 400, 0);
const j2 = L.addNode('junction', 900, 0);
const p1 = L.addLink('pipe', res.id, j1.id);
const p2 = L.addLink('pipe', j1.id, j2.id);

L.setProp(res, 'initQuality', 1);
L.setProp(p1, 'diameter', 300);
L.setProp(p2, 'diameter', 200);
L.setProp(j1, 'demand', 5);
L.setProp(j2, 'demand', 5);

(async function () {
	await warmEpanet();
	const doc = L.getDoc();
	const settings = L.getSettings();

	// =========================================================================================
	head('1. The field is offered, and it is offered by EPANET\'s own name');
	// =========================================================================================
	L.setQuality(Object.assign({}, CHEM));
	const linkColour = L.colorFieldOptions('link');
	ok('a link can be coloured by its reaction rate', linkColour.indexOf('rate') >= 0, linkColour.join(','));
	ok('...and labelled by it', L.linkFields().indexOf('rate') >= 0, L.linkFields().join(','));
	ok('...under the name the language file gives it, never a literal typed here',
		L.colorFieldLabel('link', 'rate') === PC.lpn_result_reaction_rate,
		L.colorFieldLabel('link', 'rate'));
	// A NODE has no reaction rate: EPANET reacts pipes and tanks, and a tank's reaction is not a
	// column anybody reports. Offering it on both groups would be the half-symmetric dimension
	// dev/water-quality.md argues against.
	ok('a node is not offered one, because EPANET does not report one',
		L.colorFieldOptions('node').indexOf('rate') < 0);

	// =========================================================================================
	head('2. The unit is a THIRD one, and it is neither of the two already here');
	// =========================================================================================
	//
	// A water age is a TIME with a unit family and a factor; a source share is a bare per-cent mark;
	// a concentration is the document's own label. A reaction rate is that label PER DAY -- a fourth
	// shape of answer to "what is this number in", and the one most easily given the wrong one.
	ok('it has no unit id, because there is no family and no factor',
		L.colorFieldUnit('link', 'rate') === '', L.colorFieldUnit('link', 'rate'));
	const dayWord = PC.u_day;
	ok('...and its mark is the document\'s own concentration label, per day',
		L.colorFieldUnitText('link', 'rate') === 'mg/L/' + dayWord,
		L.colorFieldUnitText('link', 'rate'));
	ok('...which is NOT the average quality\'s mark, though both are chemical answers',
		L.colorFieldUnitText('link', 'rate') !== L.colorFieldUnitText('link', 'quality'),
		L.colorFieldUnitText('link', 'quality'));
	// The per-day word is the one the elapsed-time family already ships, so it is translated and no
	// new key was written for it. Asserted by identity with the language file rather than by text.
	ok('...and the day is the language file\'s own word, not an English literal',
		typeof dayWord === 'string' && dayWord.length > 0 &&
			L.reactionRateUnitText().slice(-dayWord.length) === dayWord,
		L.reactionRateUnitText());
	// A document that states no unit beside the chemical still states a time basis. EPANET would
	// silently default to mg/L here; we state what we know and invent nothing.
	L.setQuality({ mode: 'chemical', chemical: 'Chlorine', traceNode: '' });
	ok('a chemical named with no unit still says per day, and invents no concentration label',
		L.reactionRateUnitText() === '/' + dayWord, L.reactionRateUnitText());
	L.setQuality(Object.assign({}, CHEM));

	// =========================================================================================
	head('3. THE ANCHOR: every pipe, every period, against EPANET\'s OWN printed report');
	// =========================================================================================
	doc.times = Object.assign(EngCalcs.lpnTimesDefaults(), {
		duration: 12 * 3600, hydraulicStep: 3600, reportStep: 3600, patternStep: 3600,
		qualityStep: 60, reportStart: 0
	});
	settings.reactions = Object.assign(settings.reactions || {}, {
		orderBulk: 1, orderWall: 1, orderTank: 1,
		globalBulk: -0.5, globalWall: -1, limitingPotential: 0, roughnessCorrelation: 0
	});
	const model = L.assembleModel();
	const run = await EngCalcs.lpnEpanetRun(model, {});
	ok('the engine ran the period', run.ok && (run.frames || []).length > 1,
		(run.frames || []).length + ' frames');

	const built = EngCalcs.lpnToInp(model, { eps: true }).inp;
	const reported = await epanetReport(built);
	const times = Object.keys(reported).map(Number).sort(function (a, b) { return a - b; });
	ok('EPANET\'s own report carried a Reaction column for every reporting period',
		times.length === run.frames.length, times.length + ' tables against ' + run.frames.length + ' frames');

	// **THE REPORT'S PRECISION IS THE BOUND, AND IT IS NOT A TOLERANCE ANYBODY CHOSE.** EPANET
	// prints this column to two decimals, so it can say no more than +-0.005 about any value. A
	// tighter assertion would be asserting against rounding.
	let compared = 0, worst = 0, worstAt = '';
	for (let i = 0; i < times.length; i++) {
		const t = times[i];
		const frame = run.frames[i];
		L.applySolveResult(EngCalcs.lpnTimeFrameResult(run, frame.t));
		doc.links.forEach(function (l) {
			const mine = L.linkReactionRate(l);
			const theirs = reported[t][l.id];
			if (typeof mine !== 'number' || typeof theirs !== 'number') { return; }
			compared++;
			const d = Math.abs(mine - theirs);
			if (d > worst) { worst = d; worstAt = l.id + ' at ' + (t / 3600) + ' h'; }
		});
	}
	ok('every pipe at every period was compared', compared === times.length * doc.links.length,
		compared + ' comparisons');
	ok('...and the page\'s number is EPANET\'s own printed number, inside the report\'s own precision',
		compared > 0 && worst <= 0.005,
		'worst ' + worst.toFixed(6) + ' at ' + worstAt);
	// **THE COUNTER-MEASUREMENT.** A run of zeros would satisfy every line above. The rate has to be
	// a real, non-trivial number that differs between two pipes carrying different flows through
	// different diameters -- which is the wall term doing its work.
	L.applySolveResult(EngCalcs.lpnTimeFrameResult(run, run.frames[run.frames.length - 1].t));
	const r1 = L.linkReactionRate(p1), r2 = L.linkReactionRate(p2);
	ok('and it really reacted, rather than reporting zeros', r1 > 0.1 && r2 > 0.1,
		r1 + ' / ' + r2);
	ok('...differently in two pipes of different diameter and flow',
		Math.abs(r1 - r2) > 0.01, r1 + ' / ' + r2);

	// **AND IT REACHES THE TWO PLACES A READER ACTUALLY SEES IT.** linkReactionRate() answering
	// correctly is worth nothing if the colour ramp and the label row do not read it -- which is the
	// half of Task 638 that needed three separate wirings, and the half a value test cannot see.
	ok('the colour ramp reads the same number the value function gives',
		L.colorValueOf('link', p1, 'rate') === L.linkReactionRate(p1),
		String(L.colorValueOf('link', p1, 'rate')));
	const ls = L.labelSettings();
	ls.link.rate = true;
	L.refreshLabelText();
	const withRate = L.linkLabel(p1.id);
	// Rounded to the field's own decimals, so the label is compared against that rather than against
	// the raw float -- and NOT against any English, which the wording check forbids.
	const shown = L.linkReactionRate(p1).toFixed(ls.decimals.link.rate);
	ok('...and the label row prints it, to the decimals the field declares',
		withRate.some(function (t) { return t.indexOf(shown) >= 0; }),
		JSON.stringify(withRate) + ' looking for ' + shown);
	ls.link.rate = false;
	L.refreshLabelText();
	ok('...and stops printing it when the row is turned off',
		!L.linkLabel(p1.id).some(function (t) { return t.indexOf(shown) >= 0; }),
		JSON.stringify(L.linkLabel(p1.id)));

	// **AND THE TWO PLACES TOM ACTUALLY LOOKED** (Task 664, 2026-09-21: "Reaction rate does not
	// appear in Properties or Tables. I see it only in Settings.Symbology.Link."). Both must read
	// the identical number linkReactionRate() gives -- the map label, the popup and the table are
	// three separate wirings of one accessor, exactly as section 3 above already argues for the
	// colour ramp.
	L.renderLinkFields(p1.id);
	const fieldsText = walk(document.getElementById('lpn_popup_fields'))
		.map(function (e) { return e.textContent || ''; }).join(' | ');
	ok('the Properties popup shows the reaction rate',
		fieldsText.indexOf(PC.lpn_result_reaction_rate) >= 0 &&
			fieldsText.indexOf(L.linkReactionRate(p1).toFixed(2)) >= 0,
		fieldsText);
	ok('the Tables pane\'s own accessor reads the same number',
		L.colorLinkValue(p1, 'rate') === L.linkReactionRate(p1),
		String(L.colorLinkValue(p1, 'rate')));

	// =========================================================================================
	head('4. AND THE NUMBER MEANS WHAT THE MANUAL SAYS: the published model, recomputed here');
	// =========================================================================================
	//
	// Section 3 says our reader agrees with EPANET's writer. This says the quantity they agree
	// about is the one the water-quality chapter defines -- bulk plus wall, the wall limited by
	// mass transfer through a Sherwood correlation. Without this leg both could agree about
	// something else entirely.
	const lastFrame = run.frames[run.frames.length - 1];
	let worstModel = 0, worstModelAt = '';
	[p1, p2].forEach(function (l) {
		const mine = L.linkReactionRate(l);
		const c = lastFrame.linkQualities[l.id];
		const predicted = publishedRate({
			d: L.effective(l, 'diameter') / L.unitFactor('lpn_u_diameter'),
			len: lengthOf(l),
			flow: lastFrame.flows[l.id],
			kb: -0.5, kw: -1, c: c
		});
		const rel = Math.abs(mine - predicted) / predicted;
		if (rel > worstModel) { worstModel = rel; worstModelAt = l.id; }
		ok('  ' + l.id + ': EPANET ' + mine.toFixed(6) + ' against the published model ' +
			predicted.toFixed(6), rel < 0.002, (rel * 100).toFixed(4) + '%');
	});
	ok('the reported rate IS the published bulk-plus-wall model, to better than a fifth of a per cent',
		worstModel < 0.002, 'worst ' + (worstModel * 100).toFixed(4) + '% at ' + worstModelAt);

	// =========================================================================================
	head('5. THE PERIOD IS THE FRAME, and a settled run cannot tell you so');
	// =========================================================================================
	//
	// Every assertion above would pass with every rate written onto the wrong frame, because the
	// network above settles and then reports the same number for ever. So: a run that is still
	// CHANGING at every reported step, with a NON-ZERO report start -- the one arrangement where
	// EPANET's period index and this page's frame list could drift apart, since EPANET writes its
	// first period at Rstart and isReportTime() is the only thing on our side that knows that.
	doc.times = Object.assign(EngCalcs.lpnTimesDefaults(), {
		duration: 6 * 3600, hydraulicStep: 900, reportStep: 900, patternStep: 3600,
		qualityStep: 60, reportStart: 2 * 3600
	});
	const model2 = L.assembleModel();
	const run2 = await EngCalcs.lpnEpanetRun(model2, {});
	const reported2 = await epanetReport(EngCalcs.lpnToInp(model2, { eps: true }).inp);
	const times2 = Object.keys(reported2).map(Number).sort(function (a, b) { return a - b; });
	ok('the offset run reported from its own start, not from zero',
		run2.frames.length > 0 && run2.frames[0].t === 2 * 3600,
		'first frame at ' + (run2.frames.length ? run2.frames[0].t : 'none'));
	ok('...and EPANET wrote the same number of periods', times2.length === run2.frames.length,
		times2.length + ' / ' + run2.frames.length);
	let aligned = true, alignNote = '';
	for (let i = 0; i < times2.length; i++) {
		L.applySolveResult(EngCalcs.lpnTimeFrameResult(run2, run2.frames[i].t));
		const mine = L.linkReactionRate(p2);
		const theirs = reported2[times2[i]][p2.id];
		if (typeof mine !== 'number' || typeof theirs !== 'number' || Math.abs(mine - theirs) > 0.005) {
			aligned = false;
			alignNote = 'frame ' + i + ' t=' + run2.frames[i].t + ' mine ' + mine + ' theirs ' + theirs;
			break;
		}
	}
	ok('every frame of the offset run carries the period EPANET wrote for that instant',
		aligned, alignNote);

	// =========================================================================================
	head('6. WHERE THERE IS NO RATE, THERE IS NO NUMBER -- never a zero');
	// =========================================================================================
	//
	// EPANET leaves the array at zero unless the analysis is a chemical and the link is a pipe. A
	// zero carried through would read as an answer: "this water is not reacting" is a finding, and
	// "EPANET did not compute this" is not.
	L.setQuality(Object.assign({}, AGE));
	const ageRun = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	L.applySolveResult(EngCalcs.lpnTimeFrameResult(ageRun, ageRun.frames[ageRun.frames.length - 1].t));
	ok('a water-age run produces no reaction rate at all, rather than a column of zeros',
		L.linkReactionRate(p1) === undefined, String(L.linkReactionRate(p1)));
	ok('...and the field is not offered under it either',
		L.colorFieldOptions('link').indexOf('rate') >= 0,
		'still offered: the picker lists what the page HAS, and the value guard is what answers');
	// **THE MODE GUARD, WHICH IS THE ONE linkQualityValue() STATES ITS REASON FOR.** A setting can
	// be changed without re-running, so a chemical heading over a rate from an age run is exactly
	// the defect that guard exists to make impossible.
	L.setQuality(Object.assign({}, CHEM));
	ok('switching the analysis back without re-running shows nothing, not a stale rate',
		L.linkReactionRate(p1) === undefined, String(L.linkReactionRate(p1)));

	// A pump holds no water and EPANET's reactpipes() skips it by name. The engine writes a run of
	// zeros for it, and this page must carry none.
	//
	// **A VALVE RATHER THAN A PUMP, AND THE REASON IS A FINDING.** A pump with no curve is written
	// into `[PIPES]` as a short fat pipe by our own exporter (js/lpn-epanet.js's isRealPump(), held
	// by dev/lpn-spike/session-harness.js), so EPANET types it as a PIPE, reacts it, and reports a
	// real rate on it -- correctly. **That is exactly why fillReactionRates() reads the type out of
	// the binary file rather than off our own document:** the two genuinely disagree here, and the
	// engine is the one that decides what it reacted. A valve is a valve in both.
	L.setQuality(Object.assign({}, CHEM));
	const valve = L.addLink('valve', j2.id, L.addNode('junction', 1400, 0).id);
	const valveRun = await EngCalcs.lpnEpanetRun(L.assembleModel(), {});
	if (valveRun.ok) {
		L.applySolveResult(EngCalcs.lpnTimeFrameResult(valveRun, valveRun.frames[valveRun.frames.length - 1].t));
		ok('a valve carries no reaction rate, because EPANET reacted no valve',
			L.linkReactionRate(valve) === undefined, String(L.linkReactionRate(valve)));
		ok('...while the pipes beside it still carry theirs',
			typeof L.linkReactionRate(p1) === 'number', String(L.linkReactionRate(p1)));
	} else {
		ok('the valve network ran', false, valveRun.engineError || 'refused');
	}

	console.log('\n' + (fails === 0 ? 'ALL OK' : fails + ' FAILURE(S)'));
	process.exit(fails === 0 ? 0 : 1);
}()).catch(function (e) {
	console.error(e && e.stack || e);
	process.exit(1);
});

// The drawn length of a link in metres, which is what the exporter writes when nothing overrides
// it. Written here rather than borrowed so this file's own arithmetic leg depends on nothing of the
// page's -- the whole point of section 4 is to be an independent opinion.
function lengthOf(l) {
	const doc = L.getDoc();
	function at(id) {
		const n = doc.nodes.filter(function (x) { return x.id === id; })[0];
		return n ? [n.x, n.y] : [0, 0];
	}
	const a = at(l.from), b = at(l.to);
	return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

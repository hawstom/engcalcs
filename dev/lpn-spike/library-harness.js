// DOES THE LIBRARIES BOX WRITE A DOCUMENT THAT STILL SOLVES? (ROADMAP Tasks 462 and 460)
//
//   node dev/lpn-spike/library-harness.js
//
// **THE ASSERTION THAT MATTERS IS NOT "THE EDITOR RENDERS".** dev/lpn-spike/eps-document-harness.js
// already proves the DOCUMENT carries Net3's patterns, curves and controls through save, reopen and
// run, to 0.005 ft against EPA's own published report. What that harness cannot say is whether a
// pattern or a control the USER just typed is the same kind of thing as one the importer wrote --
// and it is exactly there that an editor goes wrong: a record built by hand that is missing the
// unit annotation js/lpn-inp.js adds is a record that solves QUIETLY WRONG, because a tank
// threshold of 17.1 read as metres instead of feet is a plausible number that stops a pump ever
// starting.
//
// So this harness edits Net3 through the Libraries box's own functions, saves, reopens, and runs
// what came back:
//
//     Net3.inp -> docFromInp -> [ EDIT via libParseMultipliers / libReadControl / libRename... ]
//                                            |
//              run <- assembleModel <- applySaved <- JSON text <- serializeProject
//
// and checks that the edit is still there afterwards, that the run still moves every tank, and that
// what reaches the SOLVER (lpnTimeModelBlock) carries the units the edit was supposed to give it.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

// The page's own internals, handed out through the stub's injection seam. Every name below is a
// function the Libraries box's controls call directly, so a check here is a check on the code path
// a click takes -- not on a re-implementation of it.
const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, assembleModel: assembleModel,\n" +
	"\t\tapplyUnits: function (p) { applyUnitSelections(inpUnitSelections(p)); },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\ttimeBlock: function () { return EngCalcs.lpnTimeModelBlock(doc, toSI); },\n" +
	"\t\tsetDoc: function (d) { doc = d; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tparseMultipliers: libParseMultipliers, formatMultipliers: libFormatMultipliers,\n" +
	"\t\tspanText: libSpanText, sparkline: libSparkline,\n" +
	"\t\treadControl: libReadControl, controlText: libControlText,\n" +
	"\t\trenamePattern: libRenamePattern, deletePattern: libDeletePattern,\n" +
	"\t\tcurves: libCurves, freeId: libFreeId\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-net.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

const FT = 1 / 0.3048;
const LEVEL_TOL_FT = 0.05;

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail ? '   ' + detail : ''));
	if (!ok) { failures++; }
}

(async function () {
	// ---- 1. THE SERIES FIELD, on its own -----------------------------------------------------
	//
	// One text box holds a pattern. What it has to survive is what a person actually puts in one:
	// a line copied out of an `.inp` (spaces), a column pasted from a spreadsheet (newlines), and a
	// comma-separated list.
	console.log('-- the multiplier field --');
	check(L.parseMultipliers('1.0 1.2 1.4').join(',') === '1,1.2,1.4', 'spaces, as an .inp writes them');
	check(L.parseMultipliers('1,1.2,1.4').join(',') === '1,1.2,1.4', 'commas');
	check(L.parseMultipliers('1\n1.2\n1.4\n').join(',') === '1,1.2,1.4', 'a column pasted from a spreadsheet');
	check(L.parseMultipliers('  1.0 ,, 1.2  ').join(',') === '1,1.2', 'stray separators and spaces are not values');
	// **A ZERO IS A REAL MULTIPLIER AND MUST SURVIVE.** Net3's pattern 2 opens with six of them, and
	// a falsy test on that zero has already produced a confident wrong answer in this repo (see the
	// header of net3-vs-epanet-report.js). A parser that drops it turns six hours of no demand into
	// six hours of full demand.
	check(L.parseMultipliers('0 0 0 1').join(',') === '0,0,0,1', 'a multiplier of 0 is a value, not an absence');
	check(L.parseMultipliers('').length === 0, 'an empty field is an empty pattern, not a NaN');
	check(L.parseMultipliers('abc x').length === 0, 'and text that is not numbers contributes nothing');
	// Round trip: what the field shows must parse back to what the document holds.
	const series = [0, 0.5, 1, 1.25, 2];
	check(L.parseMultipliers(L.formatMultipliers(series)).join(',') === series.join(','),
		'format then parse is the identity', L.formatMultipliers(series));
	// The trailing-zero rule every other number on this page follows.
	check(L.formatMultipliers([1, 1.5]) === '1 1.5', 'and 1 comes back as 1, not 1.0000',
		L.formatMultipliers([1, 1.5]));

	// The sparkline is a SHAPE, so what is checked is that it always produces one -- the two cases
	// that produce a NaN path instead are an empty series (nothing to scale) and a FLAT one (a zero
	// range, which is a division by zero in the obvious implementation).
	console.log('\n-- the sparkline --');
	const flat = L.sparkline([1, 1, 1, 1]);
	const flatPath = (flat.children || []).filter((c) => c._tag === 'path')[0];
	check(!!flatPath && !/NaN/.test(flatPath.d || ''), 'a FLAT pattern draws a line, not NaN',
		flatPath && flatPath.d);
	const empty = L.sparkline([]);
	check((empty.children || []).length === 0, 'an empty pattern draws nothing at all rather than throwing');
	const shaped = L.sparkline([0, 1, 2]);
	const shapedPath = (shaped.children || []).filter((c) => c._tag === 'path')[0];
	// A step line, not a smooth one: 2n segments for n multipliers, because a multiplier holds for
	// the whole of its interval and then jumps. A curve through the points would draw a demand the
	// solver never applies.
	check(!!shapedPath && (shapedPath.d.match(/L/g) || []).length === 2 * 3 - 1,
		'a step line, one flat run per multiplier', shapedPath && shapedPath.d);

	// ---- 2. NET3, THROUGH THE PAGE'S OWN IMPORT ----------------------------------------------
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	// The units strip moves FIRST, exactly as the page's own import does -- skipping it silently
	// reinterprets every elevation as metres (see eps-document-harness.js, where that produced a
	// 782 ft "defect" that was the harness).
	setUnitSet('us');
	L.applyUnits(parsed);
	const doc = L.docFromInp(parsed, 'Net3');
	L.setDoc(doc);

	console.log('\n-- the control sentence, read against a real network --');
	// Net3's own control, verbatim. The unit annotation is the whole point: NODE 1 is a TANK, so its
	// threshold is a water LEVEL and lpnTimeModelBlock must convert it as one.
	const good = L.readControl('LINK 335 OPEN IF NODE 1 BELOW 17.1');
	check(good.ok, 'Net3\'s own control is understood', JSON.stringify(good.rec && good.rec.condition));
	check(good.ok && good.rec.condition.unit === 'head',
		'and its threshold is annotated as a LEVEL, because node 1 is a tank',
		good.rec && good.rec.condition.unit);
	// A junction condition is a PRESSURE. Same sentence shape, different unit, decided by the node.
	const junc = doc.nodes.filter((n) => n.type === 'junction')[0];
	const onJunction = L.readControl('LINK 335 CLOSED IF NODE ' + junc.id + ' ABOVE 40');
	check(onJunction.ok && onJunction.rec.condition.unit === 'press',
		'a condition on a junction is annotated as a PRESSURE instead',
		onJunction.rec && onJunction.rec.condition.unit);
	// The two ways a sentence can fail, told apart -- because the cures are different and the
	// verdict line says which one it is.
	check(!L.readControl('OPEN THE VALVE PLEASE').ok, 'a sentence the parser cannot read is not understood');
	const ghost = L.readControl('LINK 99999 OPEN AT TIME 3');
	check(!ghost.ok && ghost.missing === '99999',
		'a sentence that is well formed but names nothing here says WHICH id', ghost.missing);
	// A time control, and the bare-number-is-HOURS rule it depends on.
	const timed = L.readControl('LINK 335 CLOSED AT TIME 3');
	check(timed.ok && timed.rec.condition.seconds === 3 * 3600,
		'AT TIME 3 is three HOURS, not three seconds', timed.rec && timed.rec.condition.seconds);
	// The sentence is shown back as the sentence that was typed, not as a re-composition of it --
	// the same rule the `.inp` importer keeps for a number's token.
	check(L.controlText(good.rec) === 'LINK 335 OPEN IF NODE 1 BELOW 17.1',
		'a control is shown back as the words it was written in', L.controlText(good.rec));

	// ---- 3. EDIT, SAVE, REOPEN, RUN ----------------------------------------------------------
	console.log('\n-- an edit made through the box, taken all the way to a run --');
	// (a) A PATTERN, edited exactly as the multiplier field's change handler edits one.
	const pat = doc.patterns.filter((p) => p.id === '1')[0];
	check(!!pat, 'Net3 has the pattern its junctions name');
	const EDITED = '0.5 0.6 0.7 0.8 0.9 1 1.1 1.2 1.3 1.4 1.5 1.6 1.5 1.4 1.3 1.2 1.1 1 0.9 0.8 0.7 0.6 0.5 0.4';
	pat.multipliers = L.parseMultipliers(EDITED);
	// (b) A CONTROL, added exactly as the Add button adds one and then typed into.
	const added = L.readControl('LINK 335 CLOSED AT CLOCKTIME 3 AM');
	check(added.ok, 'a clocktime control typed into the box is understood');
	doc.controls.push(added.rec);
	// (c) A RENAME, which has to travel to everything that points at the pattern.
	// **A JUNCTION IS POINTED AT IT FIRST, deliberately.** Net3's junctions name no pattern of their
	// own -- they follow [OPTIONS] Pattern -- so a rename test on the file as imported would exercise
	// the project-default half and quietly skip the per-junction half. This is exactly the write the
	// property popup's new Demand pattern selector makes.
	doc.nodes.filter((n) => n.type === 'junction').slice(0, 3).forEach((n) => { n.demandPattern = '1'; });
	const usesPattern = doc.nodes.filter((n) => n.demandPattern === '1').length;
	check(usesPattern === 3, 'three junctions name the pattern directly, as the popup selector sets them');
	const wasDefault = doc.defaultPattern === '1';
	check(L.renamePattern(pat, 'Diurnal'), 'a pattern can be renamed');
	check(!L.renamePattern(doc.patterns[1], 'Diurnal'), '...but not onto a name already in use');
	check(doc.nodes.filter((n) => n.demandPattern === 'Diurnal').length === usesPattern,
		'the rename travels to every junction that named it', String(usesPattern));
	check(!wasDefault || doc.defaultPattern === 'Diurnal',
		'and to the project default, which is what Net3 uses it as', String(doc.defaultPattern));

	const text = JSON.stringify(L.serializeProject());
	L.applySaved(JSON.parse(text));
	const back = L.getDoc();

	const backPat = (back.patterns || []).filter((p) => p.id === 'Diurnal')[0];
	check(!!backPat, 'the renamed pattern is in the reopened document');
	// BYTE-IDENTICAL, not "within tolerance": a multiplier is a number the user typed, and a save
	// and an open must hand back the same characters.
	check(!!backPat && L.formatMultipliers(backPat.multipliers) === EDITED,
		'and every multiplier came back exactly as typed',
		backPat && L.formatMultipliers(backPat.multipliers));
	check((back.controls || []).length === 7, 'the added control is there too, beside Net3\'s six',
		String((back.controls || []).length));
	check(back.defaultPattern === 'Diurnal', 'and the project still points at the renamed pattern',
		String(back.defaultPattern));

	// **WHAT REACHES THE SOLVER, which is a different question from what is in the document.**
	// lpnTimeModelBlock is the one place a control's numbers are converted, and it converts on the
	// annotation. A control the box built without one would arrive here with its threshold
	// unconverted and the network would solve, plausibly, wrong.
	const block = L.timeBlock();
	check(block.controls.length === 7, 'all seven controls reach the solver', String(block.controls.length));
	const tankCond = block.controls.filter((c) => c.condition && c.condition.kind === 'node');
	check(tankCond.length > 0 && tankCond.every((c) => isFinite(c.condition.value)),
		'every node condition arrives with a finite, converted threshold');
	// 17.1 ft is 5.212 m. Unconverted it would arrive as 17.1, which is above that tank's maximum
	// level -- the pump would never start and nothing would look broken.
	const seventeen = tankCond.filter((c) => Math.abs(c.condition.value - 17.1 * 0.3048) < 1e-6);
	check(seventeen.length > 0, 'and the 17.1 ft threshold arrives as 5.212 m, not as 17.1',
		JSON.stringify(tankCond.map((c) => +c.condition.value.toFixed(4))));
	const clock = block.controls.filter((c) => c.condition && c.condition.kind === 'clocktime');
	check(clock.length === 1 && clock[0].condition.seconds === 3 * 3600,
		'the clocktime control we typed reaches it as 3 am', JSON.stringify(clock[0] && clock[0].condition));

	// **A SENTENCE THAT NAMES SOMETHING THIS NETWORK DOES NOT HAVE MUST NOT REACH THE ENGINE.**
	// js/lpn-epanet.js composes a [CONTROLS] line out of the record and hands the whole `.inp` to
	// EPANET, which REJECTS a control on a link it has never heard of -- so one dangling sentence
	// would take the entire run down rather than being quietly ignored. The editor keeps such a
	// sentence as text with NO CONDITION, which is exactly the shape lpnTimeModelBlock drops.
	const before = L.timeBlock().controls.length;
	back.controls.push({ link: '', raw: 'LINK NOPE OPEN AT TIME 1', action: {}, condition: null, text: {} });
	check(L.timeBlock().controls.length === before,
		'a sentence kept as text with no condition never reaches the solver',
		`${before} before, ${L.timeBlock().controls.length} after`);
	back.controls.pop();

	const model = L.assembleModel();
	model.time = L.timeBlock();
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const run = await EngCalcs.lpnEpanetRun(model);
	check(run.ok, 'the edited, saved and reopened document RUNS');
	if (!run.ok) { console.log(JSON.stringify(run.issues || run)); process.exit(1); }
	// The one thing a series of steady states cannot fake: a tank that never moves means the
	// patterns and the controls did not survive as anything the engine could use.
	const tanks = model.nodes.filter((nd) => nd.type === 'tank').map((nd) => nd.id);
	let moved = 0;
	tanks.forEach((id) => {
		let lo = Infinity, hi = -Infinity;
		run.frames.forEach((f) => {
			const v = f.levels && f.levels[id];
			if (typeof v === 'number') { lo = Math.min(lo, v); hi = Math.max(hi, v); }
		});
		if ((hi - lo) * FT > LEVEL_TOL_FT) { moved++; }
	});
	check(moved === tanks.length, `every tank still fills and drains: ${moved} of ${tanks.length}`);
	// **AND THE EDIT ACTUALLY CHANGED THE ANSWER**, which is the check the rest of this harness
	// exists to earn. Everything above would pass just as happily if the edited pattern had been
	// carried faithfully through the save and then IGNORED by the engine -- and that is the shape
	// the real defect would have.
	//
	// Measured as a RATIO of one junction's demand at two moments, so it needs no unit and no base
	// demand: the multiplier is the only thing that differs between the two frames, so the ratio of
	// the demands IS the ratio of the multipliers. The edited series opens at 0.5 and peaks at 1.6
	// at the twelfth hour, where Net3's own pattern 1 opens at 1.34 -- so a ratio of 3.2 can only
	// come from the series that was typed into the box.
	const times = back.times || EngCalcs.lpnTimesDefaults();
	const jd = back.nodes.filter((n) => n.type === 'junction' &&
		typeof run.frames[0].demands[n.id] === 'number' && run.frames[0].demands[n.id] > 1e-9)[0];
	check(!!jd, 'a junction with a real demand to read the pattern off');
	const peak = run.frames.filter((f) => f.t === 11 * 3600)[0];
	check(!!peak, 'the run has a frame at the eleventh hour');
	const want = EngCalcs.lpnPatternValue(backPat, 11 * 3600, times.patternStep, times.patternStart) /
		EngCalcs.lpnPatternValue(backPat, 0, times.patternStep, times.patternStart);
	const got = peak.demands[jd.id] / run.frames[0].demands[jd.id];
	check(Math.abs(got - want) < 1e-3,
		'the demand the ENGINE applied moves in the ratio the edited series states',
		`wanted ${want.toFixed(4)}, got ${got.toFixed(4)}`);

	// ---- 4. DELETING A PATTERN CANNOT LEAVE A DANGLING NAME -----------------------------------
	console.log('\n-- delete --');
	const doomed = back.patterns.filter((p) => p.id === 'Diurnal')[0];
	L.setDoc(back);
	L.deletePattern(doomed);
	check(back.patterns.filter((p) => p.id === 'Diurnal').length === 0, 'the pattern is gone');
	check(back.nodes.every((n) => n.demandPattern !== 'Diurnal'),
		'and no junction still claims to follow it');
	check(back.defaultPattern !== 'Diurnal', 'and the project default was cleared with it',
		String(back.defaultPattern));
	// A network with no patterns at all still solves -- lpnPatternValue returns 1 for every way of
	// having no answer, which is the pre-Task-423 behaviour and must stay reachable.
	const after = L.assembleModel();
	after.time = L.timeBlock();
	const run2 = await EngCalcs.lpnEpanetRun(after);
	check(run2.ok, 'and the network still runs with that pattern deleted');

	// ---- 5. THE CURVE LIST IS A VIEW OF WHAT THE LINKS ALREADY HOLD ---------------------------
	console.log('\n-- curves --');
	const curves = L.curves();
	check(curves.length === 2, 'Net3\'s two pumps are the whole curve list', String(curves.length));
	check(curves.every((l) => (l.curvePoints || []).length === 3),
		'each with its three points, read off the link rather than off a copy',
		curves.map((l) => (l.curvePoints || []).length).join('/'));
	// A pump that BORROWS another pump's curve is deliberately not listed: it owns no curve, and
	// listing it would show the same three points twice under two names.
	curves[1].curveRef = curves[0].id;
	check(L.curves().length === 1, 'a pump that borrows another\'s curve is not a second entry',
		String(L.curves().length));

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());

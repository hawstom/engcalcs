// A CURVE IS A DOCUMENT OBJECT, AND AN ELEMENT HOLDS ONLY A REFERENCE (ROADMAP Task 586). Run:
//   node dev/lpn-spike/curve-library-harness.js
//
// Tom, 2026-09-05: *"In the first two days programming lpn at the end of July, we needed a pump
// curve, but we didn't have a Library. Now we have a library, and it's time to move the pump curves
// to the Library with the other Curves... move all pump curve data to the Library under curves and
// leave only curve references in the pump properties."*
//
// **THE DEFECT THIS CLOSES IS THE STRONGEST ARGUMENT FOR THE CHANGE, AND SECTION 1 IS IT.** A pump
// head curve of more than three points was SAMPLED at its ends and its middle on the way in
// (`pump-curve-reduced`), written back out as those three points, and re-sampled AGAIN off our own
// fitted curve for the engine at [0, 0.5, 0.9] q_max. A five-point manufacturer's curve was
// therefore rewritten twice and the user's own numbers never came back -- CLAUDE.md's oldest and
// most absolute rule broken, honestly reported and still wrong.
//
// What the library buys is structural: the document keeps every point the file stated, and the
// three-point FIT becomes a derived thing the NATIVE solver alone needs.
//
// Sections:
//   1. a five-point head curve imports whole and exports byte-identically
//   2. a v10 project -- curvePoints, a curveRef borrow and an efficiency curve -- migrates to v11
//      and solves to the same answer
//   3. the id collision: two pumps whose unrelated curves are both called C1
//   4. EPANET's answer on a >3-point curve, and the size of the change from the old sampling

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved, migrateSaved: migrateSaved,\n" +
	"\t\tmintCurveLibrary: mintCurveLibrary, assembleModel: assembleModel,\n" +
	"\t\tlibPasteCells: libPasteCells, libPasteIsGrid: libPasteIsGrid,\n" +
	"\t\tlibMergePaste: libMergePaste, libGridPoints: libGridPoints,\n" +
	"\t\tlibCurveGridOf: libCurveGridOf, libCurveTsv: libCurveTsv,\n" +
	"\t\tbuildCurveEntry: buildCurveEntry, curveChooser: curveChooser,\n" +
	"\t\tgetLibSection: function () { return libSection; },\n" +
	"\t\tsetDoc: function (d) { doc = d; }, getDoc: function () { return doc; },\n" +
	"\t\tlinkById: linkById, effective: effective, curveById: curveById,\n" +
	"\t\tresolveCurvePoints: resolveCurvePoints, pumpFit: pumpFit,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// **A FIVE-POINT PUMP CURVE, WRITTEN IN THE EXPORTER'S OWN COLUMN STYLE** so section 1 can compare
// the WHOLE FILE rather than a section of it. The tokens are deliberately awkward -- `300.0`,
// `104.`, `20.00` -- because `String(parseFloat(t))` reproduces none of the three, which is exactly
// the 9.3% of EPA's own tokens the token bag exists for.
const FIVE = [
	'[TITLE]',
	'five.inp',
	'',
	'[JUNCTIONS]',
	' J1\t100\t250',
	'',
	'[RESERVOIRS]',
	' R1\t0',
	'',
	'[PUMPS]',
	' P1\tR1\tJ1\tHEAD C1',
	'',
	'[CURVES]',
	' C1\t0\t300.0',
	' C1\t250\t290',
	' C1\t500\t260',
	' C1\t750\t200',
	' C1\t1000\t104.',
	'',
	// The clock the exporter writes for a document that carries one. Stated here so the comparison
	// in section 1 can be the WHOLE FILE: a partial one is what lets a lost line through.
	'[TIMES]',
	' Duration\t0:00',
	' Hydraulic Timestep\t1:00',
	' Pattern Timestep\t1:00',
	' Pattern Start\t0:00',
	' Report Timestep\t1:00',
	' Report Start\t0:00',
	' Start ClockTime\t0:00',
	'',
	'[OPTIONS]',
	' Units\tGPM',
	' Headloss\tH-W',
	'',
	'[COORDINATES]',
	' J1\t10\t10',
	' R1\t0\t0',
	'',
	'[END]',
	''
].join('\n');

(async function () {

	// =========================================================================================
	head('1. A FIVE-POINT HEAD CURVE, WHOLE, AND BYTE-IDENTICAL BACK OUT');
	// =========================================================================================
	const parsed = EngCalcs.lpnInpParse(FIVE);
	check(parsed.ok, 'the fixture parses as an .inp');
	const c1 = (parsed.curves || []).filter((c) => c.id === 'C1')[0];
	check(!!c1 && c1.points.length === 5,
		`all five points arrive, where three used to: ${JSON.stringify(c1 && c1.points)}`);
	check(!!c1 && c1.kind === 'head', 'and the curve is typed by what references it');
	// **NOTHING IS REPORTED AS REDUCED ANY MORE, BECAUSE NOTHING IS REDUCED.** `pump-curve-reduced`
	// was the honest disclosure of a rewrite; the rewrite is gone, so the disclosure is too.
	check(!(parsed.dropped || []).some((d) => d.code === 'pump-curve-reduced'),
		`no pump-curve-reduced: ${JSON.stringify((parsed.dropped || []).map((d) => d.code))}`);
	check(parsed.links[0].curveId === 'C1', 'the pump holds the file\'s own curve name');

	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const doc = L.docFromInp(parsed, 'five.inp');
	L.applySaved(JSON.parse(JSON.stringify(doc)));
	const out = L.exportInp();
	check(out.ok, `the document exports: ${JSON.stringify(out.error)}`);
	if (out.ok) {
		// Not "within tolerance" -- identical, which is this repo's acceptance criterion for a value
		// the user did not edit. The five-point curve is the value that could not meet it before.
		check(out.inp === FIVE, 'the exported text equals the imported text, character for character');
		if (out.inp !== FIVE) {
			const a = FIVE.split('\n'), b = out.inp.split('\n');
			for (let i = 0; i < Math.max(a.length, b.length); i++) {
				if (a[i] !== b[i]) { console.log(`      line ${i + 1}: ${JSON.stringify(a[i])} vs ${JSON.stringify(b[i])}`); }
			}
		}
		// The two tokens that make the point: neither survives parseFloat + String.
		check(/^ C1\t0\t300\.0$/m.test(out.inp) && /^ C1\t1000\t104\.$/m.test(out.inp),
			'including `300.0` and `104.`, which String(parseFloat(t)) cannot reproduce');
	}

	// **THE FIT IS DERIVED AND SEES AT MOST THREE**, sampled at the ends and the middle. That is the
	// only place the reduction survives, and it writes nothing back.
	const fitPts = L.resolveCurvePoints(L.linkById('P1'));
	check(fitPts.length === 5, `the document still holds five points after the export: ${fitPts.length}`);
	const fit = L.pumpFit(L.linkById('P1'));
	check(isFinite(fit.h0) && fit.h0 > 0, `and the native solver gets a fit from three of them: h0 = ${fit.h0}`);
	check(L.curveById('C1').points.length === 5, 'with nothing written back onto the curve');

	// =========================================================================================
	head('2. A v10 PROJECT MIGRATES: points, a curveRef borrow, and an efficiency curve');
	// =========================================================================================
	// The shape of a real project saved the day before this task: two pumps, the second BORROWING
	// the first's curve by naming the pump, and an efficiency curve held on the pump.
	const v10 = {
		v: 10, format: 'lpn', project: { name: 'legacy', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'R1', type: 'reservoir', x: 0, y: 0, _head: 0 },
			{ id: 'J1', type: 'junction', x: 100, y: 0, elev: 0, _demand: 300 }
		],
		links: [
			{ id: 'P1', type: 'pump', from: 'R1', to: 'J1', verts: [],
				curvePoints: [[0, 300], [500, 260], [1000, 104]], curveRef: null, curveId: 'C1',
				efficPoints: [[200, 40], [500, 70], [800, 55]], efficCurveId: 'E1',
				_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open' },
			{ id: 'P2', type: 'pump', from: 'R1', to: 'J1', verts: [],
				curvePoints: [], curveRef: 'P1',
				_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open' }
		],
		labels: [], settings: {}, units: {
			lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi',
			lpn_u_diameter: 'in', lpn_u_flow: 'gpm', lpn_u_velocity: 'ftps',
			lpn_u_gradient: 'gradePercent'
		}
	};
	// THE ANSWER BEFORE THE MOVE, computed the way the old code did: the fit off the pump's own
	// points. Nothing in this harness can run the old code, so what is compared is the FIT -- which
	// is the whole of what the solver ever saw of a curve.
	// **A RELATIVE COMPARISON AND NOT A BIT ONE, DELIBERATELY.** The page crosses to SI through
	// EngCalcs.unitFactor(); this line divides by the same gpm-per-m3/s number written out, and the
	// two differ in the last bit. What the assertion is about is that the migration did not change
	// the pump, and 1e-12 says that far more strongly than the tolerance any answer is read at.
	const wantFit = EngCalcs.lpnPumpFromCurve(
		v10.links[0].curvePoints.map((p) => [p[0] / 15850.323141488905, p[1] * 0.3048]));
	const near = (a, b) => Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));

	const migrated = L.migrateSaved(JSON.parse(JSON.stringify(v10)));
	check(migrated.v === 11, `the project is stamped v11: ${migrated.v}`);
	L.applySaved(migrated);
	const mDoc = L.getDoc();
	check((mDoc.curves || []).length === 2,
		`two curves are minted, not three: ${(mDoc.curves || []).map((c) => c.id + '/' + c.kind).join(', ')}`);
	check(!!L.curveById('C1') && L.curveById('C1').kind === 'head'
			&& L.curveById('C1').points.length === 3, 'the head curve keeps the name the file gave it');
	check(!!L.curveById('E1') && L.curveById('E1').kind === 'effic',
		'and the efficiency curve keeps its own');
	// **THE BORROW BECOMES A SHARED REFERENCE**, which is what a library makes it mean.
	check(L.effective(L.linkById('P1'), 'curveId') === 'C1'
			&& L.effective(L.linkById('P2'), 'curveId') === 'C1',
		`both pumps name the one curve: ${L.effective(L.linkById('P2'), 'curveId')}`);
	check(!L.linkById('P2').curveRef && !L.linkById('P1').curvePoints
			&& !L.linkById('P1').efficPoints,
		'and nothing of the old paradigm is left on either element');
	// SAME ANSWER. The fit the solver is handed is bit-identical to the one the old document gave.
	const f1 = L.pumpFit(L.linkById('P1')), f2 = L.pumpFit(L.linkById('P2'));
	check(near(f1.h0, wantFit.h0) && near(f1.a, wantFit.a) && near(f1.b, wantFit.b),
		`the solved fit is unchanged across the migration: ${f1.h0} vs ${wantFit.h0}`);
	check(f2.h0 === f1.h0 && f2.a === f1.a && f2.b === f1.b,
		'and the borrowing pump is identical rather than similar, as it was before');
	// IDEMPOTENT: migrating an already-migrated document must find nothing left to do.
	const twice = L.mintCurveLibrary(JSON.parse(JSON.stringify(migrated)));
	check((twice.curves || []).length === 2,
		`minting twice mints nothing new: ${(twice.curves || []).length}`);

	// =========================================================================================
	head('3. THE ID COLLISION: two pumps whose unrelated curves are both called C1');
	// =========================================================================================
	// **THIS IS THE RISK THE MOVE CREATES.** Before Task 586 a curve id was unique per ELEMENT, so
	// two pumps could perfectly well both call their curve `C1` and mean different machines. Merging
	// them would silently give one pump the other's performance.
	const clash = JSON.parse(JSON.stringify(v10));
	clash.links[1].curveRef = null;
	clash.links[1].curveId = 'C1';
	clash.links[1].curvePoints = [[0, 150], [500, 130], [1000, 52]];   // half the head, same name
	const cm = L.migrateSaved(clash);
	L.applySaved(cm);
	const names = (L.getDoc().curves || []).map((c) => c.id);
	check(names.length === 3, `three curves, not two: ${names.join(', ')}`);
	check(L.effective(L.linkById('P1'), 'curveId') === 'C1',
		'the first claimant keeps the name');
	check(L.effective(L.linkById('P2'), 'curveId') === 'C1_P2',
		`and the second takes one of its own, after its element: ${L.effective(L.linkById('P2'), 'curveId')}`);
	check(L.resolveCurvePoints(L.linkById('P1'))[0][1] === 300
			&& L.resolveCurvePoints(L.linkById('P2'))[0][1] === 150,
		'so neither pump was given the other\'s performance');
	// AND THE OTHER HALF OF THE RULE: identical points under one name is SHARING, not a collision.
	const same = JSON.parse(JSON.stringify(v10));
	same.links[1].curveRef = null;
	same.links[1].curveId = 'C1';
	same.links[1].curvePoints = JSON.parse(JSON.stringify(same.links[0].curvePoints));
	L.applySaved(L.migrateSaved(same));
	check((L.getDoc().curves || []).length === 2,
		`two pumps stating the identical C1 share one curve: ${(L.getDoc().curves || []).map((c) => c.id).join(', ')}`);
	check(L.effective(L.linkById('P2'), 'curveId') === 'C1', 'both naming C1');

	// =========================================================================================
	head('4. EPANET\'S ANSWER ON A >3-POINT CURVE, AND THE SIZE OF THE CHANGE');
	// =========================================================================================
	// **THIS CHANGES ANSWERS, IN THE DIRECTION OF CORRECTNESS, AND THE NUMBER IS STATED RATHER THAN
	// HIDDEN.** Until Task 586 the engine was handed three samples of OUR fit; it is handed the
	// user's own points now. The two are compared on the same network, so what comes out is the size
	// of the change a real five-point curve sees.
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FIVE), 'five.inp')));
	const model = L.assembleModel();
	const now = await EngCalcs.lpnSolveEpanet(model);
	check(now.ok, `the five-point network runs: ${JSON.stringify(now.issues || now.error || '')}`);

	// The OLD behaviour, reproduced exactly: strip `curveSI` and the writer falls back to the fit's
	// own [0, 0.5, 0.9] sampling, which is the branch it still takes for three points or fewer.
	const asBefore = JSON.parse(JSON.stringify(model));
	asBefore.links.forEach((l) => { if (l.type === 'pump') { l.curveSI = [l.curveSI[0], l.curveSI[2], l.curveSI[4]]; } });
	const before = await EngCalcs.lpnSolveEpanet(asBefore);
	check(before.ok, 'and so does the same network reduced to three points, as it used to be');
	if (now.ok && before.ok) {
		const hNow = now.heads.J1, hWas = before.heads.J1;
		const dFt = Math.abs(hNow - hWas) / 0.3048;
		console.log(`       J1 head: ${(hNow / 0.3048).toFixed(4)} ft with all five points, `
			+ `${(hWas / 0.3048).toFixed(4)} ft with the three it used to keep`);
		console.log(`       the measured change on this curve: ${dFt.toFixed(4)} ft`);
		// **THE ASSERTION IS THAT THEY REALLY DIFFER**, because a change of zero would mean the
		// engine never saw the extra points and this whole section proves nothing. The direction is
		// not asserted: which way a particular curve moves is a fact about that curve.
		check(dFt > 0.01, `the extra points really reach the engine and move the answer: ${dFt.toFixed(4)} ft`);
		// A five-point curve is not a power law, so the engine must be interpolating it: the head at
		// the pump has to sit ON the user's own curve rather than on our fit through three of it.
		// **AND THE NEW ANSWER IS THE USER'S OWN NUMBER.** The demand is 250 gpm and the curve STATES
		// 290 ft at 250 gpm, so an engine reading the curve reports exactly 290; one reading a power
		// law fitted through three of the five reports 291.84. That is the whole change in one line:
		// the answer moved onto the point the manufacturer published.
		check(Math.abs(hNow / 0.3048 - 290) < 5e-4,
			`the five-point answer IS the curve's own stated point: ${(hNow / 0.3048).toFixed(4)} ft against 290`);
		check(Number.isFinite(hNow), 'and the answer is a number, not a NaN from a re-typed curve');
	}

	// =========================================================================================
	head('5. THE FOUR KINDS, THE FILE\'S OWN TYPE COMMENT, AND THE TANK VOLUME CURVE');
	// =========================================================================================
	// Tom, 2026-09-05: *"When we are finished there will be four kinds of curve, Pump (head), (Pump)
	// Efficiency, (Tank) Volume, and Headloss. Right?"* Right, and `[CURVES]` has no fifth.
	//
	// **EPANET STATES A CURVE'S TYPE IN A `;PUMP:`-STYLE COMMENT** and its own writer always emits
	// one -- Net1, Net2 and Net3 all carry them. That comment is the ONLY thing that can type a
	// curve nothing references, which is exactly what the Library's "Add a curve" button makes.
	const FOUR = [
		'[JUNCTIONS]', ' J1\t100\t250',
		'[RESERVOIRS]', ' R1\t0',
		'[TANKS]', ' T1\t100\t10\t0\t20\t50\t0\tVC1',
		'[PIPES]', ' L1\tJ1\tT1\t100\t12\t130\t0\tOpen',
		'[PUMPS]', ' P1\tR1\tJ1\tHEAD C1',
		'[CURVES]',
		';PUMP: the duty curve',
		' C1\t0\t300', ' C1\t250\t290',
		';EFFICIENCY: how well it does it',
		' E1\t100\t60', ' E1\t300\t72',
		';VOLUME: the tank is a cone',
		' VC1\t0\t0', ' VC1\t20\t9000',
		';HEADLOSS:',
		' HL1\t0\t0', ' HL1\t40\t6',
		' UNTYPED\t1\t2',
		'[ENERGY]', ' PUMP\tP1\tEFFIC\tE1',
		'[COORDINATES]', ' J1\t10\t10', ' R1\t0\t0', ' T1\t20\t20',
		'[OPTIONS]', ' Units\tGPM', ' Headloss\tH-W', '[END]', ''
	].join('\n');
	const four = EngCalcs.lpnInpParse(FOUR);
	const kindOf = (id) => ((four.curves || []).find((c) => c.id === id) || {}).kind;
	check(four.ok, 'the four-kind fixture parses');
	check(kindOf('C1') === 'head' && kindOf('E1') === 'effic'
			&& kindOf('VC1') === 'volume' && kindOf('HL1') === 'headloss',
		`each curve takes the type its own comment states: ${['C1', 'E1', 'VC1', 'HL1'].map(kindOf).join(', ')}`);
	// **A HEADLOSS CURVE NOTHING REFERENCES IS STILL A HEADLOSS CURVE**, which is the whole reason
	// the comment is read rather than the type being inferred from references alone. No valve in
	// this file names HL1, and before Task 586 its lines were dropped on export entirely.
	check(!four.links.some((l) => l.curveId === 'HL1'), 'HL1 is referenced by nothing');
	check(kindOf('HL1') === 'headloss', 'and is typed anyway, out of the file\'s own comment');
	// A curve with neither a comment nor a reference: EPANET's own G_CURVE, and it survives.
	check(kindOf('UNTYPED') === 'generic',
		`a curve with no comment and no reference is generic, not guessed: ${kindOf('UNTYPED')}`);
	check((four.curves || []).length === 5, `all five curves reach the library: ${(four.curves || []).length}`);
	// The comment's DESCRIPTION is the user's text and is kept with the rest of the curve.
	check(((four.curves || []).find((c) => c.id === 'C1') || {}).note === 'the duty curve',
		'the comment\'s own words are kept beside the curve');
	// **THE TANK NAMES ITS VOLUME CURVE**, which is the column that used to be read, reported and
	// thrown away -- so an exported file lost it and EPANET read a cylinder.
	const t1 = four.nodes.find((n) => n.id === 'T1');
	check(t1 && t1.volCurve === 'VC1', `the tank keeps the name of its volume curve: ${t1 && t1.volCurve}`);
	check((four.dropped || []).some((d) => d.code === 'tank-volume-curve'),
		'and the difference is still reported, because nothing here USES one yet');

	L.applyUnitSelections(L.inpUnitSelections(four));
	const fourDoc = L.docFromInp(four, 'four.inp');
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(fourDoc))));
	const fourOut = L.exportInp();
	check(fourOut.ok, `the four-kind document exports: ${JSON.stringify(fourOut.error)}`);
	if (fourOut.ok) {
		check(/^ T1\t100\t10\t0\t20\t50\t0\tVC1$/m.test(fourOut.inp),
			`the [TANKS] row states its volume curve in column eight: ${(fourOut.inp.match(/^ T1[^\n]*/m) || [])[0]}`);
		[';PUMP: the duty curve', ';EFFICIENCY: how well it does it', ';VOLUME: the tank is a cone']
			.forEach((ln) => {
				check(fourOut.inp.indexOf('\n' + ln + '\n') >= 0,
					`the type comment goes back out verbatim: ${ln}`);
			});
		check(/^ HL1\t40\t6$/m.test(fourOut.inp) && /^ UNTYPED\t1\t2$/m.test(fourOut.inp),
			'and a curve nothing references is written back rather than dropped');
	}
	// **A CURVE CREATED HERE CARRIES ITS TYPE OUT IN EPANET'S OWN COMMENT**, which is the only place
	// it can: nothing references it, so a reader has nothing else to go on.
	L.getDoc().curves.push({ id: 'NEW1', kind: 'headloss', points: [[0, 0], [10, 2]] });
	const withNew = L.exportInp();
	check(withNew.ok && /\n;HEADLOSS:\n NEW1\t0\t0/.test(withNew.inp),
		`a curve made in the Library states its own type: ${(withNew.inp.match(/;HEADLOSS:[^\n]*\n NEW1[^\n]*/) || [])[0]}`);

	// =========================================================================================
	head('6. A TRUE TABLE EDITOR: THE SPREADSHEET PASTE, THE DESCRIPTION, AND NO MAKER');
	// =========================================================================================
	// Tom, 2026-09-05: *"Curves editor is missing Description and a true table editor. The line
	// given is worse than EPANET, and it really can't take a spreadsheet paste. We need to fix
	// that."* and *"Pump properties has no 'New curve...' button. And it shouldn't unless that's a
	// link to the Curves library."*
	//
	// **THE PASTE TEXT IN THIS SECTION IS REAL CLIPBOARD TEXT AND NOT A CONVENIENT SHAPE.** Excel
	// and LibreOffice both put a two-column selection on the clipboard as TAB between the cells and
	// a newline between the rows -- CRLF from Windows -- so that is what is pasted here.

	// ---- the parser, on its own ----
	const TSV = '0\t300\n250\t290\n500\t260\n750\t200\n1000\t104';
	let cells = L.libPasteCells(TSV);
	check(cells.length === 5 && cells.every((r) => r.length === 2),
		`a two-column spreadsheet paste reads as five rows of two: ${JSON.stringify(cells[0])}`);
	check(L.libPasteIsGrid(cells), 'and it is a grid, so the page handles it rather than the browser');
	const crlf = L.libPasteCells(TSV.replace(/\n/g, '\r\n'));
	check(JSON.stringify(crlf) === JSON.stringify(cells),
		'CRLF from Windows reads identically to LF');
	check(!L.libPasteIsGrid(L.libPasteCells('300')),
		'one cell is NOT a grid: ordinary typing is left to the browser\'s own paste');
	// The `[CURVES]` block out of somebody's e-mail: space separated, with the curve's own name in
	// front of every pair. It was the one thing the old single text field did well.
	const INP_BLOCK = ' C1  0  300\n C1  250  290\n C1  500  260';
	const inpCells = L.libPasteCells(INP_BLOCK);
	check(inpCells.length === 3 && inpCells[0].length === 3,
		`a space-separated .inp block reads as rows of three: ${JSON.stringify(inpCells[0])}`);

	// ---- the merge, on its own ----
	// **IT LANDS AT THE CELL IT WAS PASTED INTO AND GROWS THE GRID.** Three rows already there, a
	// five-row paste aimed at the first cell, and the answer is five points in the pasted order.
	let merged = L.libMergePaste([['0', '1'], ['1', '2'], ['2', '3']], 0, 0, cells);
	check(JSON.stringify(L.libGridPoints(merged))
			=== JSON.stringify([[0, 300], [250, 290], [500, 260], [750, 200], [1000, 104]]),
		`the paste lands in order and the grid grows past three rows: ${JSON.stringify(L.libGridPoints(merged))}`);
	// Aimed at row 2 instead: the two rows above it are untouched and the rest is appended.
	merged = L.libMergePaste([['0', '1'], ['1', '2']], 1, 0, cells);
	check(JSON.stringify(L.libGridPoints(merged)[0]) === JSON.stringify([0, 1])
			&& L.libGridPoints(merged).length === 6,
		`a paste aimed at row 2 leaves row 1 alone and grows to six: ${JSON.stringify(L.libGridPoints(merged))}`);
	// **A SINGLE COLUMN FILLS THE COLUMN IT WAS PASTED INTO AND LEAVES ITS PARTNER ALONE**, which is
	// what lets the two halves of a curve arrive in two gestures. Rows with no partner yet are not
	// points and are not written to the document, but they stay on screen waiting for one.
	const oneCol = L.libPasteCells('12\n14\n16');
	const filled = L.libMergePaste([['0', '300'], ['250', '290'], ['500', '260']], 0, 1, oneCol);
	check(JSON.stringify(L.libGridPoints(filled)) === JSON.stringify([[0, 12], [250, 14], [500, 16]]),
		`a single column pasted into the second column replaces it, row for row: ${JSON.stringify(L.libGridPoints(filled))}`);
	const grown = L.libMergePaste([['0', '300']], 0, 0, oneCol);
	check(grown.length === 3 && grown[1][0] === '14' && grown[1][1] === ''
			&& L.libGridPoints(grown).length === 1,
		'a single column past the end of the list makes rows with a blank partner, and only the complete row is a point');
	// The leading curve name is dropped, and ONLY where every row really has one.
	check(JSON.stringify(L.libGridPoints(L.libMergePaste([], 0, 0, inpCells)))
			=== JSON.stringify([[0, 300], [250, 290], [500, 260]]),
		'the .inp block\'s leading curve name is dropped and the pairs land');
	check(L.libGridPoints(L.libMergePaste([], 0, 0, L.libPasteCells('1 2 3\n4 5 6'))).length === 2
			&& L.libGridPoints(L.libMergePaste([], 0, 0, L.libPasteCells('1 2 3\n4 5 6')))[0][0] === 1,
		'while three columns of NUMBERS keep their first column and drop the third');
	// The OUT direction (ROADMAP Task 186), which is the same shape going back.
	check(L.libCurveTsv([[0, 300], [250, 290]]) === '0\t300\n250\t290',
		`copy out is two tab-separated columns: ${JSON.stringify(L.libCurveTsv([[0, 300], [250, 290]]))}`);

	// ---- the same paste, through the real table, on the real document ----
	// **THE STUB DOES NOT SHORT-CIRCUIT THIS.** The entry is built by the shipped builder, the
	// listener the shipped code registered is the one called, and what is asserted afterwards is
	// the DOCUMENT.
	L.applyUnitSelections(L.inpUnitSelections(four));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FOUR), 'four.inp')));
	// **THE GRID CELLS ARE PICKED OUT BY inputmode, NOT BY type.** They were `type=number` until the
	// keyboard work in section 7: a number input's Up and Down are its spinner, and `selectionStart`
	// throws on one in Chrome and Firefox, so neither the arrow keys nor a caret-aware Left could be
	// built on it. They are text fields with `inputmode="decimal"` now, which is what still brings up
	// a phone's numeric keypad -- and inputmode is what tells them apart from the description field,
	// which is the only other text input in a curve entry.
	const inputsIn = (el, out) => {
		(el.children || []).forEach((c) => {
			if (c._tag === 'input' && c.getAttribute('inputmode') === 'decimal') { out.push(c); }
			inputsIn(c, out);
		});
		return out;
	};
	const buttonsIn = (el, out) => {
		(el.children || []).forEach((c) => {
			if (c._tag === 'button') { out.push(c); }
			buttonsIn(c, out);
		});
		return out;
	};
	const fire = (el, type, ev) => (el._listeners[type] || []).forEach((f) => f(ev || {}));

	let curveHost = document.createElement('div');
	let cRec = L.curveById('C1');
	L.buildCurveEntry(curveHost, cRec);
	let boxes = inputsIn(curveHost, []);
	check(boxes.length === 6,
		`a two-point curve draws two rows and one blank, six cells: ${boxes.length}`);
	check(boxes[0].value === '0' && boxes[1].value === '300',
		`with the curve's own numbers in them: ${boxes[0].value}, ${boxes[1].value}`);
	// The paste, into the first cell.
	fire(boxes[0], 'paste', {
		clipboardData: { getData: () => TSV.replace(/\n/g, '\r\n') },
		preventDefault: () => {}
	});
	check(JSON.stringify(L.curveById('C1').points)
			=== JSON.stringify([[0, 300], [250, 290], [500, 260], [750, 200], [1000, 104]]),
		`a real CRLF two-column paste lands as five points in order: ${JSON.stringify(L.curveById('C1').points)}`);
	boxes = inputsIn(curveHost, []);
	check(boxes.length === 12, `and the table grew to five rows plus a blank: ${boxes.length / 2} rows`);
	check(boxes[8].value === '1000' && boxes[9].value === '104',
		`the fifth row holds the last pasted pair: ${boxes[8].value}, ${boxes[9].value}`);
	// **A PASTE IS THE USER TYPING**, so the file's own lines and tokens go with it -- they state
	// numbers the document no longer holds.
	check(!L.curveById('C1').src && !L.curveById('C1').tok,
		'and the file\'s own lines and tokens went with the edit');

	// ---- the description: edited round-trips, unedited is byte-identical ----
	L.applyUnitSelections(L.inpUnitSelections(four));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FOUR), 'four.inp')));
	curveHost = document.createElement('div');
	cRec = L.curveById('C1');
	check(cRec.note === 'the duty curve', `the description arrives from the file: ${cRec.note}`);
	L.buildCurveEntry(curveHost, cRec);
	const descBox = (function find(el) {
		let hit = null;
		(el.children || []).forEach((ch) => {
			if (!hit && ch._tag === 'input' && ch.type === 'text' && ch.value === 'the duty curve') { hit = ch; }
			if (!hit) { hit = find(ch); }
		});
		return hit;
	}(curveHost));
	check(!!descBox, 'and it is on screen in a field of its own, which it never was before');
	descBox.value = 'Zone 3 booster, 2019 test';
	fire(descBox, 'change');
	check(L.curveById('C1').note === 'Zone 3 booster, 2019 test',
		`an edited description reaches the document: ${L.curveById('C1').note}`);
	const descOut = L.exportInp();
	check(descOut.ok && descOut.inp.indexOf(';PUMP: Zone 3 booster, 2019 test') >= 0,
		'and goes back out in EPANET\'s own type comment');
	// **THE POINTS ARE STILL THE FILE'S OWN CHARACTERS.** Editing the description drops `src` --
	// those lines carry the OLD comment -- but keeps `tok`, because nobody touched a number.
	check(descOut.ok && /^ C1\t0\t300$/m.test(descOut.inp) && /^ C1\t250\t290$/m.test(descOut.inp),
		'while the rows under it are unchanged, character for character');
	check(descOut.ok && descOut.inp.indexOf(';PUMP: the duty curve') < 0,
		'and the old description is gone rather than left standing beside the new one');
	// The other three curves in the same file were not touched at all, and prove the unedited case.
	check(descOut.ok && descOut.inp.indexOf(';EFFICIENCY: how well it does it') >= 0
			&& descOut.inp.indexOf(';VOLUME: the tank is a cone') >= 0,
		'a description nobody edited is still written back byte for byte');

	// ---- the chooser makes nothing, and links to the Library instead ----
	const fields = document.createElement('div');
	L.curveChooser(fields, L.linkById('P1'), 'curveId', 'head', 'Curve', '');
	const opts = [];
	(function walk(el) {
		(el.children || []).forEach((ch) => { if (ch._tag === 'option') { opts.push(ch); } walk(ch); });
	}(fields));
	check(!opts.some((o) => String(o.value).indexOf('') >= 0),
		`the chooser no longer offers an entry that MAKES a curve: ${opts.map((o) => o.textContent).join(' | ')}`);
	check(!opts.some((o) => /New curve/i.test(String(o.textContent))),
		'by name as well as by value');
	check(opts.some((o) => o.value === 'C1') && opts.some((o) => o.value === ''),
		'and still offers every head curve the Library holds, plus "no curve"');
	// Found by the label `lpn_curve_library_link` carries TODAY. It read 'Curves library' until
	// 2026-09-06, when Wave 0 moved it to 'Libraries, Curves' -- the comma-path shape the rest of
	// this page uses for a place to go. What the check is ABOUT is the click below.
	const link = buttonsIn(fields, []).filter((b) => /Libraries, Curves/i.test(String(b.textContent)))[0];
	check(!!link, 'a link into the Library stands beside it');
	if (link) {
		fire(link, 'click');
		check(L.getLibSection() === 'curves',
			`and it is real navigation: the box is put on its Curves section (${L.getLibSection()})`);
	}

	// =========================================================================================
	head('7. THE HEADER EPANET\'S OWN SHAPE, AND THE EQUATION UNDER THE TYPE');
	// =========================================================================================
	// Tom, 2026-09-05: *"Just to be parallel with EPANET, put pump ID (with new ID label above it)
	// and Description on row/line 1 and Type selector and Equation (for pump head) on row/line 2.
	// (b) Also, what do you think about putting the curve plot/graph below all its inputs?"*
	L.applyUnitSelections(L.inpUnitSelections(four));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FOUR), 'four.inp')));
	curveHost = document.createElement('div');
	cRec = L.curveById('C1');
	L.buildCurveEntry(curveHost, cRec);
	let entryEl = curveHost.children[0];
	const rowsOf = (el) => (el.children || []).filter((ch) => /lpn-lib-curve-row/.test(String(ch['class'] || '')));
	const textIn = (el, out) => {
		(el.children || []).forEach((ch) => {
			if (ch._tag === 'input' || ch._tag === 'select' || ch._tag === 'output') { out.push(ch); }
			textIn(ch, out);
		});
		return out;
	};
	const twoRows = rowsOf(entryEl);
	check(twoRows.length === 2, `the header is two rows: ${twoRows.length}`);
	const line1 = textIn(twoRows[0], []).map((e) => e._tag);
	check(line1[0] === 'input' && line1[1] === 'input' && line1.indexOf('select') < 0,
		`line 1 is the id and the description, and no type selector: ${line1.join(',')}`);
	check(textIn(twoRows[0], [])[0].value === 'C1'
			&& textIn(twoRows[0], [])[1].value === 'the duty curve',
		'and they hold this curve\'s own id and description');
	// The visible fieldNames above the fields, which the id field never had: it carried an aria-label and
	// nothing a person could read.
	const fieldNames = [];
	(function walkNames(el) {
		(el.children || []).forEach((ch) => {
			if (/lpn-lib-fieldname/.test(String(ch['class'] || ''))) { fieldNames.push(ch._text); }
			walkNames(ch);
		});
	}(entryEl));
	check(fieldNames[0] === 'ID' && fieldNames[1] === 'Description',
		`each field on line 1 is named above it: ${fieldNames.slice(0, 2).join(' | ')}`);
	const line2 = textIn(twoRows[1], []);
	check(line2[0]._tag === 'select', `line 2 leads with the type selector: ${line2[0]._tag}`);
	check(fieldNames[2] === 'Curve type' && fieldNames[3] === 'Equation',
		`and its two fields are named EPANET's way: ${fieldNames.slice(2, 4).join(' | ')}`);
	// **THE EQUATION IS THE FIT THE RUN USES.** C1 in the four-kind file is 0/300 and 250/290, which
	// fits h = 300 - a Q^2 with a = 10/62500 = 1.6e-4.
	const eq = line2.filter((e) => e._tag === 'output')[0];
	check(!!eq && /^Head = 300 - 0\.00016 Flow\^2$/.test(String(eq._text)),
		`the equation is printed under the type, in the table's own units: ${eq && eq._text}`);
	check(String(eq.title || '').length > 0 && /ec-help/.test(String(eq['class'] || '')),
		'and it carries the tip that says it is worked out every time and never stored');
	// **THE PLOT IS BELOW ALL THE INPUTS** (Tom's (b)). It was directly under the header, with the
	// description, the table and the copy button between it and the numbers it draws.
	const kidTags = (entryEl.children || []).map((ch) => ch._tag);
	const svgAt = kidTags.indexOf('svg');
	const tableAt = kidTags.indexOf('div', 2);   // the grid wrapper
	check(svgAt > tableAt && tableAt > 0,
		`the chart sits after the grid rather than above it: ${kidTags.join(',')}`);

	// A kind with no equation shows NO field rather than a label over a blank.
	L.getDoc().curves.filter((x) => x.id === 'VC1').forEach((x) => {
		const h = document.createElement('div');
		L.buildCurveEntry(h, x);
		const outs = textIn(h.children[0], []).filter((e) => e._tag === 'output');
		check(outs.length === 0, `a tank volume curve prints no equation at all: ${outs.length}`);
	});
	// And a head curve with too few points keeps the field but empties it, so the equation appears
	// on its own once there is one, without the entry being rebuilt under the user.
	//
	// **IT WAITS FOR THE SECOND POINT** (Tom, 2026-09-05, asked directly whether it should appear
	// as the first point is typed: *"No. It waits for the second point."*). The one-point case is
	// the assertion that matters, and it would pass for the wrong reason if the fit simply failed:
	// EPANET's single-point convention invents the shut-off head and the runout, so a fit of one
	// point returns a perfectly finite equation. That is what is being withheld.
	[[], [[250, 290]]].forEach((points, i) => {
		const empty = { id: 'EMPTY' + i, kind: 'head', points: points };
		L.getDoc().curves.push(empty);
		const emptyHost = document.createElement('div');
		L.buildCurveEntry(emptyHost, empty);
		const emptyEq = textIn(emptyHost.children[0], []).filter((e) => e._tag === 'output')[0];
		check(!!emptyEq && emptyEq._text === '' && emptyEq.parentNode.style.display === 'none',
			`a head curve with ${points.length} point(s) has an equation field, hidden and empty`);
		L.getDoc().curves.pop();
	});
	// The other side of the same line: two points DO print one, so the guard above is a threshold
	// and not a feature that stopped working.
	{
		const two = { id: 'TWO', kind: 'head', points: [[0, 300], [250, 290]] };
		L.getDoc().curves.push(two);
		const twoHost = document.createElement('div');
		L.buildCurveEntry(twoHost, two);
		const twoEq = textIn(twoHost.children[0], []).filter((e) => e._tag === 'output')[0];
		check(!!twoEq && /^Head = /.test(String(twoEq._text)) && twoEq.parentNode.style.display !== 'none',
			`the second point is what brings the equation: ${twoEq && twoEq._text}`);
		L.getDoc().curves.pop();
	}

	// =========================================================================================
	head('8. THE SPREADSHEET PARADIGM: TAB IS COLUMN FIRST, THEN ROW');
	// =========================================================================================
	// Tom, 2026-09-05: *"It would be amazing to be able to move among the kcells using tab and arrow
	// keys like in the spreadsheet paradigm. I think column first, then row for tab would be best."*
	const key = (el, k, shift) => {
		let stopped = false;
		fire(el, 'keydown', { key: k, shiftKey: !!shift, preventDefault: () => { stopped = true; } });
		return stopped;
	};
	const where = (kcells) => {
		const a = document.activeElement;
		for (let r = 0; r < kcells.length; r++) {
			for (let cc = 0; cc < 2; cc++) { if (kcells[r][cc] === a) { return r + ',' + cc; } }
		}
		return 'off the grid';
	};
	L.applyUnitSelections(L.inpUnitSelections(four));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FOUR), 'four.inp')));
	curveHost = document.createElement('div');
	cRec = L.curveById('C1');
	L.buildCurveEntry(curveHost, cRec);
	entryEl = curveHost.children[0];
	let kcells = entryEl._lpnCells;
	check(kcells.length === 3 && kcells[0].length === 2,
		`the two-point curve offers three rows of two cells: ${kcells.length}`);
	// X to Y: the same row, the next COLUMN. This is the half a plain DOM tab order already got
	// right, and it is asserted so that a future reordering of the row cannot quietly lose it.
	check(key(kcells[0][0], 'Tab') && where(kcells) === '0,1',
		`Tab from X lands on the same row's Y: ${where(kcells)}`);
	// Y to the NEXT ROW'S X, stepping over the row's own remove button -- which is what a plain tab
	// order does NOT do, and is the whole of "column first, then row".
	check(key(kcells[0][1], 'Tab') && where(kcells) === '1,0',
		`Tab from Y lands on the next row's X, not on the remove button: ${where(kcells)}`);
	check(key(kcells[1][0], 'Tab', true) && where(kcells) === '0,1',
		`Shift+Tab walks back along the same path: ${where(kcells)}`);
	check(key(kcells[0][1], 'Tab', true) && where(kcells) === '0,0',
		`and back across the columns: ${where(kcells)}`);
	check(!key(kcells[0][0], 'Tab', true),
		'Shift+Tab out of the very first cell is left to the browser, so the grid can be left');
	// **TAB OUT OF THE BLANK LAST ROW LEAVES THE GRID.** Growing a row there would add an empty
	// point every time somebody tabbed past the table.
	check(!key(kcells[2][1], 'Tab'),
		'Tab out of the blank row at the end is an ordinary Tab and adds nothing');
	check(L.curveById('C1').points.length === 2,
		`and the curve still has its two points: ${JSON.stringify(L.curveById('C1').points)}`);
	// **TAB OUT OF A FILLED LAST ROW GROWS THE TABLE**, the way typing into it already did -- and
	// the caret lands in the row it just made, in the entry that came back from the rebuild.
	kcells[2][0].value = '500'; kcells[2][1].value = '255';
	check(key(kcells[2][1], 'Tab'), 'Tab out of a filled last row is handled by the page');
	check(JSON.stringify(L.curveById('C1').points) === JSON.stringify([[0, 300], [250, 290], [500, 255]]),
		`the typed row reached the document: ${JSON.stringify(L.curveById('C1').points)}`);
	entryEl = curveHost.children[0];
	kcells = entryEl._lpnCells;
	check(kcells.length === 4 && document.activeElement === kcells[3][0],
		`a fresh blank row was added and the caret is in its X cell: ${where(kcells)}`);
	// **AND THE EQUATION FOLLOWED THE THIRD POINT.** Three points fit h0, a and b directly, so the
	// exponent is no longer the two-point parabola's.
	const eq3 = textIn(entryEl, []).filter((e) => e._tag === 'output')[0];
	check(!!eq3 && /^Head = 300 - /.test(String(eq3._text)) && !/\^2$/.test(String(eq3._text)),
		`and the equation is the three-point fit now: ${eq3 && eq3._text}`);

	// ---- the arrow keys, which are geometry ----
	check(key(kcells[0][0], 'ArrowDown') && where(kcells) === '1,0',
		`Down moves a row within the column: ${where(kcells)}`);
	check(key(kcells[1][0], 'ArrowUp') && where(kcells) === '0,0',
		`Up moves back: ${where(kcells)}`);
	check(!key(kcells[0][0], 'ArrowUp'),
		'Up out of the top row does nothing, rather than wrapping to the bottom');
	check(key(kcells[0][0], 'ArrowRight') && where(kcells) === '0,1',
		`Right crosses to the next column: ${where(kcells)}`);
	check(key(kcells[0][1], 'ArrowLeft') && where(kcells) === '0,0',
		`Left crosses back: ${where(kcells)}`);
	check(!key(kcells[0][1], 'ArrowRight'),
		'Right out of the last column stays put: the arrows are geometry, not a tab order');
	// **A CARET IN THE MIDDLE OF A VALUE IS EDITING, AND KEEPS ITS ARROW KEYS.** This is why the
	// kcells are text inputs: `selectionStart` cannot be read on a number one at all.
	kcells[0][1].selectionStart = 1; kcells[0][1].selectionEnd = 1;
	check(!key(kcells[0][1], 'ArrowLeft'),
		'Left with the caret inside the value moves the caret, not the focus');
	kcells[0][1].selectionStart = 0; kcells[0][1].selectionEnd = String(kcells[0][1].value).length;
	check(!key(kcells[0][1], 'ArrowLeft'),
		'and Left on a freshly tabbed-into cell collapses the selection first');
	// Down out of a filled last row grows the table too, on the same one path.
	kcells = curveHost.children[0]._lpnCells;
	kcells[3][0].value = '750'; kcells[3][1].value = '200';
	check(key(kcells[3][0], 'ArrowDown'), 'Down out of a filled last row is handled');
	check(L.curveById('C1').points.length === 4,
		`and it committed the row on the way: ${JSON.stringify(L.curveById('C1').points)}`);

	// =========================================================================================
	head('9. ONE COLUMN PASTED, THROUGH THE REAL TABLE');
	// =========================================================================================
	// The section's note says so in Tom's own words (`lpn_library_curve_values_tip`, edited by him
	// 2026-09-05): *"Select one or two columns in a spreadsheet, copy them, and paste into the first
	// cell you want them to land in."* Section 6 asserts that of libMergePaste(); this asserts it of
	// the thing a person actually uses, because a promise on screen is about the widget.
	L.applyUnitSelections(L.inpUnitSelections(four));
	L.applySaved(L.migrateSaved(L.docFromInp(EngCalcs.lpnInpParse(FOUR), 'four.inp')));
	curveHost = document.createElement('div');
	cRec = L.curveById('C1');
	L.buildCurveEntry(curveHost, cRec);
	let gcells = curveHost.children[0]._lpnCells;
	// A column of heads out of a spreadsheet, dropped on the Y cell of the first row. The flows
	// beside them are untouched, and the curve grows past the two points it had.
	fire(gcells[0][1], 'paste', {
		clipboardData: { getData: () => '300\r\n290\r\n260\r\n200' },
		preventDefault: () => {}
	});
	check(JSON.stringify(L.curveById('C1').points) === JSON.stringify([[0, 300], [250, 290]]),
		`the two rows that have a flow become points, and the other two wait: ${JSON.stringify(L.curveById('C1').points)}`);
	gcells = curveHost.children[0]._lpnCells;
	check(gcells.length === 5 && gcells[2][0].value === '' && gcells[2][1].value === '260'
			&& gcells[3][1].value === '200',
		'the grid grew to hold every pasted value, each with an empty flow beside it');
	// Now the flow column, pasted into the X cell of the same first row: the curve completes.
	fire(gcells[0][0], 'paste', {
		clipboardData: { getData: () => '0\r\n250\r\n500\r\n750' },
		preventDefault: () => {}
	});
	check(JSON.stringify(L.curveById('C1').points)
			=== JSON.stringify([[0, 300], [250, 290], [500, 260], [750, 200]]),
		`the second column lands beside the first and the curve is whole: ${JSON.stringify(L.curveById('C1').points)}`);
	// A single column dropped into the MIDDLE of the table replaces only that column, from there down.
	gcells = curveHost.children[0]._lpnCells;
	fire(gcells[2][1], 'paste', {
		clipboardData: { getData: () => '255\n199' },
		preventDefault: () => {}
	});
	check(JSON.stringify(L.curveById('C1').points)
			=== JSON.stringify([[0, 300], [250, 290], [500, 255], [750, 199]]),
		`a column pasted mid-table rewrites its own column from that row down: ${JSON.stringify(L.curveById('C1').points)}`);

	console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'All curve-library checks passed.'));
	process.exit(failures ? 1 : 0);
}());

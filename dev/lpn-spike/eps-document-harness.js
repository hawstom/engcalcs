// DOES **OUR DOCUMENT** CARRY THE TIME MODEL? Net3 through the whole round trip, against EPA.
//
//   node dev/lpn-spike/eps-document-harness.js
//
// **THIS EXISTS BECAUSE TOM CHALLENGED THE OTHER HARNESS AND THE CHALLENGE WAS FAIR.**
// 2026-08-19, on eps-net3-harness.js matching EPA's published 24-hour report: *"How can that be
// possible when we don't have curves, patterns, and controls? All you are doing is showing that
// their engine runs their file. Our site doesn't handle any of that info or display it. You may be
// able to run their file on their engine, but have you tried running our json that can't handle
// curves, patterns, and controls?"*
//
// He is right about what that harness proves. It goes lpnInpParse -> buildModel -> run: our
// PARSER and our EPANET bridge, and the document never appears. If serializeProject() drops a
// pump curve or a pattern, that harness passes and the user still loses their network.
//
// So this one goes the whole way, through every seam the user's own work goes through:
//
//     Net3.inp  ->  lpnInpParse  ->  docFromInp  ->  serializeProject  ->  JSON text
//                                                                            |
//     EPA's own Net3.rpt  <-  compare  <-  lpnEpanetRun  <-  assembleModel  <-  applySaved
//
// It is the same acceptance criterion as the file round trip: not "within tolerance of something
// we computed", but agreement with a report EPA published, at every one of its 25 reporting steps.
// A document that cannot hold a curve, a pattern or a control fails here and cannot fail there.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tdocFromInp: docFromInp, assembleModel: assembleModel,\n" +
	"\t\tapplyUnits: function (p) { applyUnitSelections(inpUnitSelections(p)); },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\ttimeBlock: function () { return EngCalcs.lpnTimeModelBlock(doc, toSI); },\n" +
	"\t\tsetDoc: function (d) { doc = d; },\n" +
	"\t\tgetDoc: function () { return doc; }\n"
);
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-net.js'));
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

const FT = 1 / 0.3048;
const HEAD_TOL_FT = 0.05;
const LEVEL_TOL_FT = 0.05;

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail ? '   ' + detail : ''));
	if (!ok) { failures++; }
}

const { parseReport } = require('./net3-report.js');

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);

	// ---- 1. the IMPORT, which is the page's own docFromInp and not the parser ----
	// **THE UNITS STRIP MOVES FIRST, exactly as the page's own import does** (looped-network.js,
	// the File > Import EPANET file handler). docFromInp() stores the FILE'S OWN NUMBERS precisely
	// because the strip is already showing the file's own units, so skipping this step is not a
	// formality -- it silently reinterprets every elevation as metres. Skipping it here is what
	// produced a 782 ft "defect" on the first run of this harness, and the defect was the harness.
	setUnitSet('us');        // the strip has to EXIST before applyUnitSelections can move it
	L.applyUnits(parsed);
	const doc = L.docFromInp(parsed, 'Net3');
	L.setDoc(doc);
	const pumps = doc.links.filter((l) => l.type === 'pump');
	check(pumps.length === 2, `the document holds Net3's 2 pumps`, String(pumps.length));
	check(pumps.every((p) => (p.curvePoints || []).length === 3),
		'...each with its THREE curve points, not a fitted coefficient',
		pumps.map((p) => (p.curvePoints || []).length).join('/'));
	check((doc.patterns || []).length === parsed.patterns.length && doc.patterns.length >= 2,
		`the document holds the file's ${parsed.patterns.length} patterns`,
		String((doc.patterns || []).length));
	check((doc.controls || []).length === 6, 'and its 6 controls',
		String((doc.controls || []).length));
	check(!!doc.times && doc.times.duration === 86400,
		'and a 24 hour duration', doc.times && String(doc.times.duration));

	// ---- 2. SAVE AND REOPEN, as text, exactly as a file does ----
	const text = JSON.stringify(L.serializeProject());
	L.applySaved(JSON.parse(text));
	const back = L.getDoc();
	const bp = back.links.filter((l) => l.type === 'pump');
	check(bp.every((p) => (p.curvePoints || []).length === 3),
		'a save and an open keeps every curve point', bp.map((p) => (p.curvePoints || []).length).join('/'));
	check((back.patterns || []).length === (doc.patterns || []).length, '...and every pattern');
	check((back.controls || []).length === 6, '...and every control');
	check(back.times && back.times.duration === 86400, '...and the clock');

	// ---- 3. RUN WHAT CAME BACK, and compare with EPA ----
	const model = L.assembleModel();
	model.time = L.timeBlock();
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const run = await EngCalcs.lpnEpanetRun(model);
	check(run.ok, 'the reopened document runs');
	if (!run.ok) { console.log(JSON.stringify(run.issues || run)); process.exit(1); }

	const ref = parseReport(fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8'));
	const refTimes = Object.keys(ref).map(Number).sort((a, b) => a - b);
	check(run.frames.length === refTimes.length,
		`frames: ${run.frames.length}, EPA's report has ${refTimes.length}`);

	let worst = 0, worstAt = '', n = 0;
	for (const f of run.frames) {
		const r = ref[f.t];
		if (!r) { continue; }
		for (const id in r.head) {
			if (f.heads[id] === undefined) { continue; }
			const d = Math.abs(f.heads[id] * FT - r.head[id]);
			n++;
			if (d > worst) { worst = d; worstAt = `${id} at ${EngCalcs.lpnFormatTime(f.t)}`; }
		}
	}
	check(n > 1000, `${n} head comparisons against EPA's own numbers`);
	check(worst <= HEAD_TOL_FT,
		`worst head error through the DOCUMENT: ${worst.toFixed(3)} ft at ${worstAt} (tol ${HEAD_TOL_FT})`);

	// The one thing a series of steady states cannot fake, and the reason patterns and controls
	// have to have survived: a tank that never moves means the run is 25 copies of t=0.
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
	check(moved === tanks.length,
		`every tank filled and drained out of OUR document: ${moved} of ${tanks.length}`);

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());

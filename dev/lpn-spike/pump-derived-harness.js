// A DERIVED NUMBER IS NOT STORED BESIDE THE USER'S (ROADMAP Task 390 step 5). Run:
//   node dev/lpn-spike/pump-derived-harness.js
//
// A pump carries curvePoints -- 1 to 3 [Q, H] pairs the USER typed, in the units on the strip --
// and the solver reads h0/a/b, the SI coefficients of H = h0 - a Q^b fitted to them. Those two are
// different kinds of number, and they used to live on the same link.
//
// The symptom of that was a REPAIR MECHANISM: every unit switch had to re-run the fit across the
// whole document, because the same three points mean a different pump under L/s than under gpm and
// a stored triple nobody refreshed described a pump the user had never entered. What this harness
// asserts is that the repair is not merely correct now but UNNECESSARY -- the fit follows a unit
// switch with nothing called in between, because it is computed at the solver handoff.
//
// The strongest assertion here is section 3, and it is the cheap kind: the derivation must give the
// same answer twice, and must follow its inputs with no maintenance step. Nothing has to be known
// about pump physics to state that.

const { ROOT, setUnitSet, unitSelects, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tassembleModel: assembleModel, serializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const FT = 0.3048, GPM = 6.309019640343977e-5;
const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const doc = L.getDoc();
doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 0 });
doc.nodes.push({ id: 'J1', type: 'junction', x: 100, y: 0, elev: 0, _demand: 100 });
// One pump on a real curve, plus a second that copies it by reference, plus a third with no curve.
doc.links.push({
	id: 'P1', type: 'pump', from: 'R1', to: 'J1', verts: [],
	curvePoints: [[0, 220], [500, 180], [1000, 100]], curveRef: null,
	_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open'
});
doc.links.push({
	id: 'P2', type: 'pump', from: 'R1', to: 'J1', verts: [],
	curvePoints: [], curveRef: 'P1',
	_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open'
});
doc.links.push({
	id: 'P3', type: 'pump', from: 'R1', to: 'J1', verts: [],
	curvePoints: [], curveRef: null,
	_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open'
});
doc.links.push({
	id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
	_diameter: 8, _roughness: 130, _length: 100, _k: 0, _status: 'open'
});
const byId = (m, id) => m.links.filter((l) => l.id === id)[0];

// ---- 1. the document holds only what the user typed --------------------------------------------
console.log('\n1. The document carries the points, and none of the fit');
doc.links.forEach((l) => {
	ok(l.id + ' stores no fitted curve',
		l.h0 === undefined && l.a === undefined && l.b === undefined,
		JSON.stringify([l.h0, l.a, l.b]));
});

// ---- 2. the solver is handed the fit, in SI ---------------------------------------------------
console.log('\n2. The solver handoff derives it, in SI');
let m = L.assembleModel();
// 220 ft of shutoff head is 67.06 m. A fit taken from the DISPLAYED numbers would hand over 220,
// which is 3.3x wrong and still solves.
ok('P1 shutoff head is SI', near(byId(m, 'P1').h0, 220 * FT, 1e-9), byId(m, 'P1').h0 + ' m');
ok('P1 has a real resistance term', byId(m, 'P1').a > 0, byId(m, 'P1').a);
// curveRef is resolved by the derivation, so a borrowing pump is identical rather than similar.
ok('P2 borrows P1\'s curve exactly',
	byId(m, 'P2').h0 === byId(m, 'P1').h0 && byId(m, 'P2').a === byId(m, 'P1').a && byId(m, 'P2').b === byId(m, 'P1').b,
	JSON.stringify([byId(m, 'P2').h0, byId(m, 'P2').a, byId(m, 'P2').b]));
// A pump with no curve is a connection that neither adds nor loses head, never a NaN.
ok('P3 has no curve and no head', byId(m, 'P3').h0 === 0 && byId(m, 'P3').a === 0 && byId(m, 'P3').b === 2,
	JSON.stringify([byId(m, 'P3').h0, byId(m, 'P3').a, byId(m, 'P3').b]));
// A pipe never gets one: both engines test the type before reading it, so three undefineds per
// link were the only thing the old inline properties ever produced.
ok('a pipe is handed no pump curve at all', byId(m, 'L1').h0 === undefined, byId(m, 'L1').h0);

// IDEMPOTENCE, the cheapest strong assertion there is: deriving twice must equal deriving once,
// to the last bit, and it needs no reference data.
const again = L.assembleModel();
ok('deriving twice gives the identical fit',
	byId(again, 'P1').h0 === byId(m, 'P1').h0 && byId(again, 'P1').a === byId(m, 'P1').a,
	byId(again, 'P1').h0 + ' vs ' + byId(m, 'P1').h0);
ok('and still writes nothing to the document', doc.links.every((l) => l.h0 === undefined));

// ---- 3. a unit switch needs no repair ---------------------------------------------------------
// THE HEART OF STEP 5. Changing a unit REINTERPRETS the typed numbers (Task 263): 500 becomes
// 500 L/s instead of 500 gpm, so the pump really is a different pump and every derived head moves.
// Nothing is called between the switch and the re-derivation -- no refit, no refresh, no save --
// because there is no stored value left to repair.
console.log('\n3. A unit switch is followed with nothing called in between');
const beforeH0 = byId(m, 'P1').h0, beforeA = byId(m, 'P1').a;
const flow = unitSelects.lpn_u_flow;
const lpsIndex = flow.options.map((o) => o.value).indexOf('lps');
ok('the flow selector offers L/s', lpsIndex >= 0, flow.options.map((o) => o.value).join(','));
flow.selectedIndex = lpsIndex;

const after = L.assembleModel();
// The head points did not change unit, so shutoff head is untouched: shutoff is at Q = 0 and no
// flow unit can move it. That it is EXACTLY equal is the check -- a refit through a round trip
// would land a few ulps away.
ok('shutoff head is bit-identical across the switch', byId(after, 'P1').h0 === beforeH0,
	byId(after, 'P1').h0 + ' vs ' + beforeH0);
// The resistance term is per unit of flow, so it must move.
ok('the resistance term followed the flow unit', byId(after, 'P1').a !== beforeA, byId(after, 'P1').a);
// AND IT MOVED TO THE RIGHT PLACE, asked in the only way that does not restate the fit's own
// algebra: the derived curve must pass through the points the user typed, read in whatever unit
// the strip is currently naming. Three parameters through three points, so this is exact.
// Stated as a function so it can be asked again under the other unit, which is the whole test:
// the same typed numbers, two units, two curves, each right for its own reading.
function curveHitsTypedPoints(label, model, flowToSI, headToSI) {
	const p = byId(model, 'P1');
	doc.links[0].curvePoints.forEach(([q, h]) => {
		const qSI = q * flowToSI, want = h * headToSI;
		const got = p.h0 - p.a * Math.pow(qSI, p.b);
		ok(label + ': the curve passes through the typed point ' + q + ', ' + h,
			near(got, want, 1e-9), got + ' vs ' + want);
	});
}
curveHitsTypedPoints('under L/s', after, 0.001, FT);
ok('the typed points were NOT rewritten by the switch',
	JSON.stringify(doc.links[0].curvePoints) === JSON.stringify([[0, 220], [500, 180], [1000, 100]]),
	JSON.stringify(doc.links[0].curvePoints));
flow.selectedIndex = flow.options.map((o) => o.value).indexOf('gpm');
ok('and switching back returns the original fit bit-for-bit',
	byId(L.assembleModel(), 'P1').a === beforeA, byId(L.assembleModel(), 'P1').a + ' vs ' + beforeA);
curveHitsTypedPoints('under gpm', L.assembleModel(), GPM, FT);

// ---- 4. a document written before this loses its stale copy ------------------------------------
console.log('\n4. A pre-Task-390 document drops the fit it carried');
const saved = L.serializeProject();
saved.links.forEach((l) => { if (l.type === 'pump') { l.h0 = 999; l.a = 999; l.b = 9; } });
L.applySaved(saved);
ok('the stale triple is gone from the document',
	L.getDoc().links.every((l) => l.h0 === undefined && l.a === undefined && l.b === undefined),
	JSON.stringify(L.getDoc().links.map((l) => l.h0)));
// And the solver is handed the derivation, not the number the old file carried.
ok('and the solver gets the derived fit, not the stored 999',
	near(byId(L.assembleModel(), 'P1').h0, 220 * FT, 1e-9),
	byId(L.assembleModel(), 'P1').h0);
// A save must not put it back.
ok('a save writes no fitted curve either',
	L.serializeProject().links.every((l) => l.h0 === undefined), JSON.stringify(L.serializeProject().links.map((l) => l.h0)));

console.log('');
if (fails) { console.log(fails + ' FAILED of ' + checks); process.exit(1); }
console.log('all ' + checks + ' derived-pump-curve checks passed');

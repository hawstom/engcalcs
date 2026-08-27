// AN IMPORT MUST NOT REWRITE THE USER'S NUMBERS. Run with:
//   node dev/lpn-spike/inp-passthrough-harness.js
//
// Section 1 is a property test over EPA's own Net1/Net2/Net3: re-import each `.inp` and check
// every stored number against the token the file actually contains. Section 2 is a regression
// against `dev/water-network-examples/`, the corpus those three were repaired into.
//
// WHY A WHOLE HARNESS, when inp-import-harness.js already asserts a handful of values exactly:
//
//   1. THE DEFECT WAS A ROUNDING ERROR, so it hides behind any tolerance and behind any small
//      sample. `docFromInp()` stored `toDisplay(<SI>, unit)` while js/lpn-inp.js had already
//      normalised the file to SI with its own constants -- a trip that is a no-op in principle
//      and is not one in doubles. It stored 709.9913664 for a 710 ft elevation. Which VALUES it
//      spoils depends on the bit patterns, not on the units, so three hand-picked numbers is not
//      evidence: with exactly-reciprocal factors 95 and 120 survive and 12 and 75 do not.
//      Checking every number in three real models is.
//
//   2. BETTER CONSTANTS CANNOT FIX IT, and that has been measured rather than assumed:
//      `150 * 0.3048 * (1/0.3048) === 149.99999999999997`, and 35% of a random 20,000-value
//      sample fails to return bit-identical even when both factors are exact. So the assertion
//      here is `===`, and the fix it defends is pass-through -- not a more precise table.
//
//   3. THE COMPARISON IS AGAINST THE FILE, NOT AGAINST A FIXTURE. The expected value is read out
//      of the `.inp` token by token, so nothing here can go stale, and there is no second copy of
//      the answer to drift away from the models.
//
// The one quantity deliberately NOT checked here is an emitter coefficient: it is derived, has no
// display unit on this page, and is documented as the exception at [EMITTERS] in js/lpn-inp.js.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// The page loads the reader before js/looped-network.js; do the same, onto the same EngCalcs.
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function done(label) { console.log('  ' + (fails ? 'FAIL ' : 'ok   ') + label + '   ' + checks + ' checks'); }

// ---- the file's own tokens, read straight out of the .inp -------------------------------------
// Deliberately a second, dumber reader than js/lpn-inp.js: it knows only "section, first token is
// the id, column N is the number", which is all that is needed to say what the file SAYS. Using
// the real parser as the expectation would be asking the defendant for the verdict.
function tokensBySection(text) {
	const out = {};
	let section = null;
	for (let raw of text.split(/\r?\n/)) {
		const line = raw.replace(/;.*$/, '').trim();
		if (!line) { continue; }
		const m = /^\[(\w+)\]/.exec(line);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		out[section].push(line.split(/\s+/));
	}
	return out;
}

function checkModel(inpPath) {
	const text = fs.readFileSync(inpPath, 'utf8');
	const sec = tokensBySection(text);
	const parsed = EngCalcs.lpnInpParse(text);
	ok(path.basename(inpPath) + ' parses', parsed.ok, JSON.stringify(parsed.error));
	if (!parsed.ok) { return; }

	// The import path in full: put the strip on the file's units first, exactly as importInpText()
	// does, because docFromInp() is written against the selector state and not against the file.
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const saved = L.docFromInp(parsed, path.basename(inpPath));
	const node = {}, link = {};
	saved.nodes.forEach((n) => { node[n.id] = n; });
	saved.links.forEach((l) => { link[l.id] = l; });

	const tag = path.basename(inpPath) + ': ';
	// A US model's flow keyword is GPM in all three of EPA's, which is one this page offers, so
	// every number below must cross untouched. Guard the assumption rather than assume it: if a
	// future model here used MGD, the flows genuinely convert and these checks would be wrong.
	const flowPassThrough = parsed.flowUnits === 'GPM' || parsed.flowUnits === 'CFS' || parsed.flowUnits === 'LPS';

	(sec.JUNCTIONS || []).forEach((r) => {
		const n = node[r[0]];
		if (!n) { return; }
		ok(tag + 'J ' + r[0] + ' elevation is the file token', n.elev === +r[1], n.elev + ' vs ' + r[1]);
		// Only where [DEMANDS] does not replace this column, and only where the file's flow unit
		// is one the page offers.
		const replaced = (sec.DEMANDS || []).some((d) => d[0] === r[0]);
		if (!replaced && r[2] !== undefined && flowPassThrough) {
			ok(tag + 'J ' + r[0] + ' demand is the file token', n._demand === +r[2], n._demand + ' vs ' + r[2]);
		}
	});
	(sec.RESERVOIRS || []).forEach((r) => {
		const n = node[r[0]];
		if (!n) { return; }
		// **THE COLUMN IS A HEAD AND IT LANDS IN THE HEAD** (Task 390). It used to land in `elev`
		// too, which invented a ground elevation the file never states.
		ok(tag + 'R ' + r[0] + ' head is the file token', n._head === +r[1], n._head + ' vs ' + r[1]);
		ok(tag + 'R ' + r[0] + ' is given no ground elevation', n.elev === undefined, String(n.elev));
	});
	(sec.TANKS || []).forEach((r) => {
		const n = node[r[0]];
		if (!n) { return; }
		// All five are in the elevation/head unit, the vessel diameter included.
		ok(tag + 'T ' + r[0] + ' bottom elevation', n.elev === +r[1], n.elev + ' vs ' + r[1]);
		ok(tag + 'T ' + r[0] + ' initial level', n._level === +r[2], n._level + ' vs ' + r[2]);
		ok(tag + 'T ' + r[0] + ' minimum level', n.minLevel === +r[3], n.minLevel + ' vs ' + r[3]);
		ok(tag + 'T ' + r[0] + ' maximum level', n.maxLevel === +r[4], n.maxLevel + ' vs ' + r[4]);
		ok(tag + 'T ' + r[0] + ' vessel diameter', n.tankDiameter === +r[5], n.tankDiameter + ' vs ' + r[5]);
	});
	(sec.PIPES || []).forEach((r) => {
		const l = link[r[0]];
		if (!l) { return; }
		ok(tag + 'P ' + r[0] + ' length is the file token', l._length === +r[3], l._length + ' vs ' + r[3]);
		ok(tag + 'P ' + r[0] + ' diameter is the file token', l._diameter === +r[4], l._diameter + ' vs ' + r[4]);
		ok(tag + 'P ' + r[0] + ' roughness is the file token', l._roughness === +r[5], l._roughness + ' vs ' + r[5]);
	});
	(sec.COORDINATES || []).forEach((r) => {
		const n = node[r[0]];
		if (!n) { return; }
		// X passes through; Y is NEGATED on the way in (the document is y-down in memory and
		// Cartesian on disk), which is a sign change and therefore still exact.
		ok(tag + 'XY ' + r[0] + ' x', n.x === +r[1], n.x + ' vs ' + r[1]);
		ok(tag + 'XY ' + r[0] + ' |y|', Math.abs(n.y) === Math.abs(+r[2]), n.y + ' vs ' + r[2]);
	});
}

console.log('\n1. Every number in EPA Net1/Net2/Net3 survives the import unchanged');
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
['Net1.inp', 'Net2.inp', 'Net3.inp'].forEach((f) => checkModel(path.join(ROOT, 'dev', 'lpn-spike', 'reference', f)));
done('EPA models import their own numbers');

console.log('\n2. Regression against dev/water-network-examples/');
// THE CORPUS IS READ, NEVER WRITTEN. Those files carry hand edits (names, views, label offsets)
// on top of the import, so only the quantities an import decides are compared -- a whole-file
// diff would report every deliberate edit as a failure.
const before = fails;
[['Net1.inp', 'Net1.lwn'], ['Net2.inp', 'Net2.lwn'], ['Net3.inp', 'Net3.lwn']].forEach(([inp, json]) => {
	const jsonPath = path.join(ROOT, 'dev', 'water-network-examples', json);
	if (!fs.existsSync(jsonPath)) { console.log('  skip  ' + json + ' is not here'); return; }
	const want = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', inp), 'utf8'));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const got = L.docFromInp(parsed, inp);
	const gotNode = {};
	got.nodes.forEach((n) => { gotNode[n.id] = n; });
	const gotLink = {};
	got.links.forEach((l) => { gotLink[l.id] = l; });
	['elev', '_head', '_demand', '_level', 'minLevel', 'maxLevel', 'tankDiameter'].forEach((k) => {
		want.nodes.forEach((n) => {
			if (!(k in n) || !gotNode[n.id]) { return; }
			ok(json + ' ' + n.id + '.' + k, gotNode[n.id][k] === n[k], gotNode[n.id][k] + ' vs ' + n[k]);
		});
	});
	['_length', '_diameter', '_roughness'].forEach((k) => {
		want.links.forEach((l) => {
			if (!(k in l) || !gotLink[l.id]) { return; }
			ok(json + ' ' + l.id + '.' + k, gotLink[l.id][k] === l[k], gotLink[l.id][k] + ' vs ' + l[k]);
		});
	});
	// **PUMP CURVE POINTS, and this list is where they were missing.** The corpus shipped with
	// Net3's curve reading 103.99873536 where the file says `104.` -- the old SI round trip's damage,
	// preserved in a file nobody re-generated and invisible to every check here because the compared
	// fields were named one by one and this one was not on the list. Found 2026-08-18 by Tom, reading
	// the numbers. The values are exact today; what was missing was anything that would say so.
	want.links.forEach((l) => {
		if (!l.curvePoints || !gotLink[l.id]) { return; }
		const got = gotLink[l.id].curvePoints || [];
		ok(json + ' ' + l.id + ' curve has the same number of points',
			got.length === l.curvePoints.length, got.length + ' vs ' + l.curvePoints.length);
		l.curvePoints.forEach((pt, i) => {
			if (!got[i]) { return; }
			ok(json + ' ' + l.id + ' curve point ' + i,
				got[i][0] === pt[0] && got[i][1] === pt[1],
				JSON.stringify(got[i]) + ' vs ' + JSON.stringify(pt));
		});
	});
});
console.log('  ' + (fails > before ? 'FAIL ' : 'ok   ') + 'the corpus reproduces from its .inp');

console.log('');
if (fails) { console.log(fails + ' FAILED of ' + checks); process.exit(1); }
console.log('all ' + checks + ' import pass-through checks passed');

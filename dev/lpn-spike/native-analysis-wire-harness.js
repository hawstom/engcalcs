// THE ANALYSIS RUNS FOLLOW THE ENGINE SETTING (Task 733, native-wire slice 8).
//
//   node dev/lpn-spike/native-analysis-wire-harness.js
//
// Scenario comparison, fire flow for a duration, criticality, demand scaling, the Alternatives preview
// and the analysis run all call EngCalcs.lpnTimeRunModel() instead of the EPANET bridge. Here the models
// those analyses build (a fire demand on a pattern, a pipe closed, a demand multiplier, a scenario's
// total run time) are run both ways on Net1 and Net3 and read the way the page reads them
// (lpnEpsRunResult, lpnDurFireDigest): minimum pressure of every junction within 1 mm, highest velocity
// of every link within 1e-4 m/s, the same tank-empty verdict, and the digest's own verdicts equal.
// Also: the page source calls the bridge nowhere else; a run is quiet (the status bar's solver note is
// the transport's); the EPANET setting runs EPANET; a refusal falls back to EPANET without a note.
'use strict';
const path = require('path');
const fs = require('fs');
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
require(path.join(ROOT, 'js', 'lpn-criticality.js'));
require(path.join(ROOT, 'js', 'lpn-durfire.js'));
const { buildModel } = require('./net3-model.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
let engine = 'native', routeNotes = [];
EngCalcs.lpnTimeInit({
	tabs: [], doc: () => null, apply: () => {}, status: () => {}, notice: () => {},
	routeNote: (t) => routeNotes.push(t), engine: () => engine,
	solve: () => {}, solveNow: () => {}, native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
	snapshot: () => {}, save: () => {},
	toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
});
function load(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	const m = buildModel(EngCalcs, parsed);
	m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {});
	return m;
}
const copy = (m) => JSON.parse(JSON.stringify(m));
async function both(m) {
	engine = 'epanet'; routeNotes = [];
	const e = await EngCalcs.lpnTimeRunModel(copy(m), {}), eNotes = routeNotes.slice();
	engine = 'native'; routeNotes = [];
	const n = await EngCalcs.lpnTimeRunModel(copy(m), {}), nNotes = routeNotes.slice();
	return { e, n, eNotes, nNotes };
}
function gap(a, b) {
	let d = 0, at = '';
	Object.keys(a).forEach((id) => { const x = Math.abs(a[id] - b[id]); if (!(x <= d)) { d = x; at = id; } });
	return { d, at };
}
function compare(name, m, r) {
	ok(name + ': the setting picks the engine (EPANET / built-in)', r.e.engine === 'epanet' && r.n.engine === 'native', `${r.e.engine} / ${r.n.engine}`);
	ok(name + ': a run writes no solver note of its own', r.eNotes.length === 0 && r.nNotes.length === 0, JSON.stringify(r.nNotes));
	const re = EngCalcs.lpnEpsRunResult(r.e, m), rn = EngCalcs.lpnEpsRunResult(r.n, m);
	const gp = gap(re.pressures, rn.pressures), gv = gap(re.velocities, rn.velocities);
	ok(name + ': lowest pressure of every node within 1 mm', re.ok && rn.ok && gp.d <= 1e-3, `worst ${(gp.d * 1000).toFixed(3)} mm at ${gp.at}`);
	ok(name + ': highest velocity of every link within 1e-4 m/s', gv.d <= 1e-4, `worst ${gv.d.toExponential(2)} at ${gv.at}`);
	ok(name + ': same tank-empty verdict and same step count', !!re.emptied === !!rn.emptied && re.steps === rn.steps, `${re.steps} / ${rn.steps}`);
	return { re, rn };
}

async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	for (const file of ['Net1.inp', 'Net3.inp']) {
		const base = load(file), tag = file.replace('.inp', '');
		const junc = base.nodes.filter((n) => n.type === 'junction' && (n.demandBase || n.demand) > 0);
		const jn = junc[Math.floor(junc.length / 2)].id;
		// Fire flow for a duration: the model the page builds, base and fired runs, the digest.
		const ps = base.time.times.patternStep || 3600, built = EngCalcs.lpnDurFireModel(base, { nodeId: jn, flow: 0.03, start: ps, duration: 2 * ps });
		ok(tag + ': the fire model builds', built.ok, built.code + ' step ' + built.step);
		const rb = await both(base), rf = await both(built.model);
		compare(tag + ' base run', base, rb);
		compare(tag + ' fire run', built.model, rf);
		const dig = (x, y) => EngCalcs.lpnDurFireDigest({ model: base, fire: built.fire, residual: 14, base: x, fired: y });
		const de = dig(rb.e, rf.e), dn = dig(rb.n, rf.n);
		const close = (x, y, t) => (x === null || x === undefined) ? (y === null || y === undefined) : Math.abs(x - y) <= t;
		ok(tag + ' fire flow over a duration: the digest says the same in both engines (lowest pressure, pressure at the fire, flow delivered, verdict, recovery)',
			de.ok && dn.ok && close(de.lowest.pressure, dn.lowest.pressure, 1e-3) && close(de.lowestAtFire.pressure, dn.lowestAtFire.pressure, 1e-3) &&
			close(de.delivered.flow, dn.delivered.flow, 1e-6) && de.shortfall === dn.shortfall && de.holds === dn.holds && !de.emptyAt === !dn.emptyAt &&
			de.recoveryNote === dn.recoveryNote && !!(de.recovery && de.recovery.recovered) === !!(dn.recovery && dn.recovery.recovered) &&
			de.tanks.every((t, i) => close(t.lowest.level, dn.tanks[i].lowest.level, 1e-3)),
			`lowest ${de.lowest.pressure.toFixed(4)}/${dn.lowest.pressure.toFixed(4)} delivered ${de.delivered.flow}/${dn.delivered.flow} holds ${de.holds}`);
		// Criticality: one pipe out of service for the whole run.
		let out = null, pid = null, tried = 0;
		for (const l of base.links.filter((x) => x.type === 'pipe' && x.status !== 'closed')) {
			const t = copy(base); t.links.find((x) => x.id === l.id).status = 'closed';
			engine = 'epanet';
			const r = await EngCalcs.lpnTimeRunModel(copy(t), {});
			tried++;
			// A pipe whose loss leaves nobody cut off: no node at a head of minus millions.
			if (r.ok && r.frames.every((f) => Object.keys(f.pressures).every((id) => f.pressures[id] > -50))) { out = t; pid = l.id; break; }
		}
		ok(tag + ': found a pipe whose closure leaves everyone served', !!out, 'pipe ' + pid + ' after ' + tried);
		compare(tag + ' criticality (pipe ' + pid + ' closed)', out, await both(out));
		// Demand scaling: every demand doubled.
		const mult = file === 'Net1.inp' ? 2 : 1.4, sc = copy(base);
		sc.hydraulics = Object.assign({}, sc.hydraulics, { demandMultiplier: mult });
		compare(tag + ' demand scaling (x' + mult + ')', sc, await both(sc));
	}
	// Net3 with the demands pushed until the pumps run past their curves (EPANET warning 4). The gap that
	// used to be 17 mm here (Task 733) had two parts. EPANET divides an LPS file's flows by 28.317 although
	// a cubic foot is 28.3168466 L, so its hydraulics are the physical problem with every flow 5.4e-6
	// smaller, and the loop now solves in those flows (js/lpn-native-run.js solveInFeet()); a closed link
	// carries head difference over CBIG as hydcoeffs.c says, and a tank's net inflow counts it. Base Net3
	// is then within 0.005 mm of EPANET at every node (it was 0.13 mm). The multiplier 1.5 exactly is a
	// knife edge: tank 2 reaches its minimum level at 15:07:56 to within 1.5e-6 m (0.1 s of its flow),
	// EPANET lands a hair above it and leaves the pipe open for the next 3124 s, the loop lands a hair below
	// and shuts it, so every later step differs (35 mm at one node). Tighter convergence in EPANET
	// moves its side by 3e-7 m, not across. Held: the 1.5 run up to that event, and every neighbour.
	{
		const net3 = load('Net3.inp');
		const scaled = (mult) => { const m = copy(net3); m.hydraulics = Object.assign({}, m.hydraulics, { demandMultiplier: mult }); return m; };
		const worst = (r, upTo) => {
			let w = 0, at = '';
			r.e.frames.forEach((fe, i) => {
				const fn = r.n.frames[i];
				if (!fn || fn.t !== fe.t || fe.t > upTo) { return; }
				Object.keys(fe.pressures).forEach((id) => { const d = Math.abs(fe.pressures[id] - fn.pressures[id]); if (d > w) { w = d; at = id + '@' + fe.t; } });
			});
			return { w, at };
		};
		const base = worst(await both(scaled(1)), Infinity);
		ok('Net3 base run: pressure of every node at every step within 0.005 mm of EPANET (was 0.13 mm before the flow constant)', base.w <= 5e-6, `worst ${(base.w * 1000).toFixed(4)} mm at ${base.at}`);
		for (const mult of [1.45, 1.48, 1.52, 1.55, 1.6, 2]) {
			const r = await both(scaled(mult)), w = worst(r, Infinity);
			ok(`Net3 demands x${mult} (pumps past their curves): every step within 0.8 mm of EPANET`, w.w <= 8e-4 && r.e.frames.length === r.n.frames.length, `worst ${(w.w * 1000).toFixed(4)} mm at ${w.at}`);
		}
		const r15 = await both(scaled(1.5)), w15 = worst(r15, 54000);
		ok('Net3 demands x1.5: every step up to the 15:07:56 event within 0.8 mm of EPANET (the knife edge after it is not held)', w15.w <= 8e-4, `worst ${(w15.w * 1000).toFixed(4)} mm at ${w15.at}`);
	}
	// The solve stops where EPANET's does (hydsolver.c hasconverged(): total flow change within Accuracy of total flow),
	// from the flows EPANET starts from (hydraul.c initlinkflow(): 1 ft/s, a pump at its design flow), so the number
	// of trials EPANET reports for every step is the number the loop reports.
	for (const file of ['Net1.inp', 'Net2.inp', 'Net3.inp']) {
		for (const acc of [1e-5, 1e-3]) {
			const m = load(file); m.hydraulics.accuracy = acc;
			const r = await both(m);
			const diffs = r.e.frames.filter((f, i) => !r.n.frames[i] || f.iterations !== r.n.frames[i].iterations);
			ok(`${file} at Accuracy ${acc}: every step takes the same number of trials as EPANET`, diffs.length === 0 && r.e.frames.length === r.n.frames.length,
				`${r.e.frames.length} steps, ${diffs.length} differ` + (diffs.length ? ' first at ' + diffs[0].t : ''));
		}
	}
	// A refusal falls back to EPANET, quietly: the analysis is not the transport's status bar.
	{
		const m = load('Net1.inp');
		m.nodes.find((n) => n.type === 'tank').volCurveName = 'NOSUCH';
		engine = 'native'; routeNotes = [];
		const r = await EngCalcs.lpnTimeRunModel(copy(m), {});
		ok('a model the loop refuses is run by EPANET, and the status bar is left alone', r.engine === 'epanet' && routeNotes.length === 0, r.engine);
	}
	// The page's own source calls the bridge nowhere: every run goes through the one choice.
	{
		const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
		ok('looped-network.js never calls the EPANET bridge directly', !/lpnEpanetRun\s*\(/.test(src));
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });

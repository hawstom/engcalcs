// A PUMP SWITCHED OFF IN A SCENARIO MUST NOT TAKE THE EPANET ENGINE DOWN (Tom, 2026-10-14).
//
//   node dev/lpn-spike/epanet-topology-refusal-harness.js
//
// Tom's report: "The EPANET solver rejected this network, so the run did not start. EPANET solver
// message: memory access out of bounds". His project (fixtures/fotobi-topology.epp is it, its
// scenarios restated as plain overrides) is two small systems, each a reservoir and a pump feeding
// pipes with a tank on them, with four controls switching the pumps on tank level. Two defects,
// one behind the other:
//
//   1. THE INPUT. A scenario that switches a pump off (or its reservoir) left the controls naming
//      that pump in [CONTROLS] (EPANET Error 204) and its energy price in [ENERGY] (Error 216).
//      EPANET refuses the whole file over either.
//   2. THE ENGINE. Closing a Project whose open EPANET refused damages the WASM engine, and a later
//      call in the same Workspace fails for no reason of its own: a malloc that never returns, or
//      the "memory access out of bounds" trap Tom saw. js/lpn-epanet.js now retires that engine.
//
// Held here, with the real engine (js/vendor/epanet-js.js):
//   A. every scenario solves AND runs 24 hours through EPANET, neither refused -- except "Tanks run
//      dry", whose demand empties both tanks: EPANET stops the run there (Error 110, the junctions
//      have no source left) and the result says WHEN, so the page no longer says "did not start";
//   B. a pump-off scenario's input names no pump in [CONTROLS] or [ENERGY], and says which
//      controls it left out (code `control-inactive`);
//   C. with only the tanks as sources the built-in solver agrees there is a source (no refusal),
//      and every junction's head is below the tank that feeds it -- water runs downhill;
//   D. two solves started together both answer (they used to close each other's Project);
//   E. the call sequence that poisoned the engine -- a good run, a refused run, a refused solve, a
//      refused run -- is followed by good solves and runs. Before the fix every call after it came
//      back "memory access out of bounds", Tom's message word for word; other orders of the same
//      calls hung inside the engine's malloc instead, which is why this part runs in a child
//      process with a time limit.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
// The engine prints a line per unbalanced or disconnected step; this harness reads them as results.
['log', 'warn', 'error'].forEach((k) => {
	const f = console[k].bind(console);
	console[k] = (...a) => { if (typeof a[0] === 'string' && a[0].indexOf('epanet-js (') === 0) { return; } f(...a); };
});
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-topology.epp');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
require(path.join(ROOT, 'js', 'lpn-time.js'));

const L = loadLoopedNetwork(
	"\t\tassembleModel: assembleModel, applySaved: applySaved, switchScenario: switchScenario,\n" +
	"\t\tacceptImportedText: acceptImportedText, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n");
const EngCalcs = global.EngCalcs;
['lpn-inp.js', 'lpn-net.js', 'lpn-patterns.js', 'lpn-epanet.js'].forEach((f) => require(path.join(ROOT, 'js', f)));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const clone = (m) => JSON.parse(JSON.stringify(m));
const said = (r) => !r ? 'none' : r.refused ? 'REFUSED ' + r.engineError : (r.ok ? 'ok' : 'issues ' + JSON.stringify(r.issues).slice(0, 120));

function loadFixture() {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.applySaved(L.acceptImportedText(fs.readFileSync(FIXTURE, 'utf8')));
}
function modelOf(name) {
	const scn = L.getScenarios().find((s) => s.name === name);
	L.switchScenario(scn.id);
	return L.assembleModel();
}
// A copy EPANET refuses on open: a tank whose water level is above its own maximum (Error 225),
// and for a run a junction on a pattern the file does not have (Error 205).
function refusedCopy(model, multiplier) {
	const m = clone(model);
	const t = m.nodes.find((n) => n.type === 'tank');
	t.level = t.maxLevel + 5;
	m.nodes.find((n) => n.type === 'junction').demandPattern = 'NO-SUCH-PATTERN';
	m.hydraulics = Object.assign({}, m.hydraulics, { demandMultiplier: multiplier });
	return m;
}

// ---- E, the child: the poisoning sequence, then good work, then exit 0 ----
async function poisonChild() {
	loadFixture();
	await EngCalcs.lpnEpanetLoad();
	const eps = modelOf('EPS'), nowells = modelOf('No wells'), off = modelOf('EPS Pump off');
	const out = [];
	out.push('solve ' + said(await EngCalcs.lpnSolveEpanet(clone(eps), {})));
	out.push('run ' + said(await EngCalcs.lpnEpanetRun(clone(eps))));
	out.push('solve ' + said(await EngCalcs.lpnSolveEpanet(clone(nowells), {})));
	out.push('run* ' + said(await EngCalcs.lpnEpanetRun(refusedCopy(off, 7))));
	out.push('solve* ' + said(await EngCalcs.lpnSolveEpanet(refusedCopy(nowells, 8), {})));
	out.push('run* ' + said(await EngCalcs.lpnEpanetRun(refusedCopy(off, 9))));
	for (let k = 0; k < 3; k++) {
		out.push('solve ' + said(await EngCalcs.lpnSolveEpanet(clone(off), {})));
		out.push('run ' + said(await EngCalcs.lpnEpanetRun(clone(eps))));
		out.push('run ' + said(await EngCalcs.lpnEpanetRun(clone(off))));
	}
	console.log(JSON.stringify(out));
	process.exit(0);
}

async function main() {
	loadFixture();
	await EngCalcs.lpnEpanetLoad();
	const names = L.getScenarios().map((s) => s.name);
	ok('the fixture opens with its ten scenarios', names.length === 10, names.join(' | '));

	console.log('\n--- A. every scenario solves and runs through EPANET ---');
	for (const name of names) {
		const model = modelOf(name);
		const steady = await EngCalcs.lpnSolveEpanet(clone(model), {});
		const heads = steady && steady.heads ? Object.values(steady.heads) : [];
		ok(name + ': the solve is EPANET\'s, not refused', !!steady && steady.ok && !steady.refused && heads.length === model.nodes.length &&
			heads.every((h) => isFinite(h)), said(steady));
		const run = await EngCalcs.lpnEpanetRun(clone(model));
		if (name === 'Tanks run dry') {
			// Both tanks close at 15048 s (4:10:48). EPANET then limps on disconnected, and how long
			// before Error 110 swings by hours on a 0.2% length change, so only the bounds are held.
			ok(name + ': EPANET stops the run when the tanks are empty, and the result says when',
				!!run && run.refused && /110/.test(run.engineError) && run.stoppedAt >= 15048 && run.stoppedAt < 24 * 3600 &&
				/disconnected/.test(run.report || ''), said(run) + ' stoppedAt=' + (run && run.stoppedAt));
			// Task 808: the periods EPANET solved before the stop are kept, real and whole, and
			// nothing is carried past the last of them.
			const fr = (run && run.frames) || [], lastT = fr.length ? fr[fr.length - 1].t : -1,
				ids = fr.length ? Object.keys(fr[0].heads) : [];
			ok(name + ': the solved periods before the stop are kept (partial, solvedTo = last frame)',
				!!run && run.partial === true && fr.length >= 2 && run.solvedTo === lastT && lastT <= run.stoppedAt + 1e-6 &&
				fr[0].t === 0 && fr.every((f, k) => k === 0 || f.t > fr[k - 1].t && f.t <= run.solvedTo),
				'frames=' + fr.length + ' solvedTo=' + (run && run.solvedTo) + ' stoppedAt=' + (run && run.stoppedAt));
			ok('...every kept frame holds finite real heads and flows, and none sits past the stop',
				fr.every((f) => f.t <= run.stoppedAt + 1e-6 && ids.length > 0 && ids.every((id) => isFinite(f.heads[id])) &&
					Object.keys(f.flows).every((id) => isFinite(f.flows[id]))));
			ok('...and no period the run never reached is drawn: fewer frames than the full 25',
				fr.length < 25 && fr.every((f) => f.t % 3600 === 0), 'frames=' + fr.length);
			continue;
		}
		ok(name + ': the 24-hour run finishes with 25 reporting times', !!run && run.ok && !run.refused && (run.frames || []).length === 25,
			said(run) + ' frames=' + ((run && run.frames) || []).length);
	}

	console.log('\n--- B. a pump-off scenario hands EPANET nothing naming the pumps ---');
	const off = modelOf('EPS Pump off');
	ok('EPS Pump off: both pumps are out of its network', !off.links.some((l) => l.type === 'pump'), off.links.map((l) => l.id).join(','));
	const built = EngCalcs.lpnToInp(off, { eps: true });
	const section = (name) => { const m = built.inp.match(new RegExp('\\[' + name + '\\]\\n([\\s\\S]*?)\\n\\n')); return m ? m[1] : ''; };
	ok('...[CONTROLS] names neither pump', !/P-N[EW]/.test(section('CONTROLS')), JSON.stringify(section('CONTROLS')));
	ok('...[ENERGY] names neither pump', !/P-N[EW]/.test(section('ENERGY')), JSON.stringify(section('ENERGY')));
	const w = (built.warnings || []).find((x) => x.code === 'control-inactive');
	ok('...and says which controls it left out', !!w && w.ids.slice().sort().join(',') === 'P-NE,P-NW', JSON.stringify(w));
	const eps = modelOf('EPS');
	const epsInp = EngCalcs.lpnToInp(eps, { eps: true }).inp;
	ok('EPS (R-NE off, so pump P-NE with it): no [ENERGY] row for P-NE, P-NW\'s controls kept',
		!/PUMP\s+P-NE/.test(epsInp) && /LINK P-NW OPEN IF NODE T-NW/.test(epsInp) && !/LINK P-NE/.test(epsInp));

	console.log('\n--- C. the tanks alone are a source, to both engines ---');
	ok('EPS Pump off: no structural refusal (every node has a path to a tank)', EngCalcs.lpnDiagnose(off).length === 0,
		JSON.stringify(EngCalcs.lpnDiagnose(off)).slice(0, 200));
	const native = EngCalcs.lpnSolve(clone(off), { tol: 1e-9 });
	ok('...the built-in solver solves it', !!native && native.ok, JSON.stringify((native && native.issues) || []).slice(0, 200));
	const ep = await EngCalcs.lpnSolveEpanet(clone(off), {});
	const tankHead = { NW: ep.heads['T-NW'], NE: ep.heads['T-NE'] };
	const juncs = off.nodes.filter((n) => n.type === 'junction');
	ok('...and every junction stands below the tank of its own system (water runs downhill)',
		juncs.every((n) => ep.heads[n.id] <= Math.max(tankHead.NW, tankHead.NE) + 1e-6), JSON.stringify(tankHead));
	ok('...with the two engines within 1 cm at every node',
		off.nodes.every((n) => Math.abs(native.heads[n.id] - ep.heads[n.id]) < 0.01),
		off.nodes.map((n) => n.id + ':' + (native.heads[n.id] - ep.heads[n.id]).toExponential(1)).join(' '));

	console.log('\n--- D. two solves started together both answer ---');
	const both = await Promise.all([EngCalcs.lpnSolveEpanet(clone(eps), {}), EngCalcs.lpnSolveEpanet(clone(off), {})]);
	ok('neither is refused', both.every((r) => r.ok && !r.refused), both.map(said).join(' / '));

	console.log('\n--- E. a refused input no longer poisons the engine ---');
	const child = spawnSync(process.execPath, [__filename, '--poison'], { encoding: 'utf8', timeout: 90000 });
	const line = (child.stdout || '').split('\n').filter((s) => s.charAt(0) === '[').pop() || '';
	let steps = [];
	try { steps = JSON.parse(line); } catch (e) { steps = []; }
	ok('the sequence finishes (it used to hang inside the engine\'s malloc)', child.status === 0 && steps.length === 15,
		'exit=' + child.status + (child.signal ? ' signal=' + child.signal : ''));
	ok('...the three deliberately bad inputs are refused', steps.filter((s) => /\* REFUSED/.test(s)).length === 3, steps.slice(3, 6).join(' | '));
	ok('...and every solve and run after them answers', steps.length === 15 && steps.slice(6).every((s) => / ok$/.test(s)),
		steps.slice(6).join(' | '));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}

(process.argv[2] === '--poison' ? poisonChild() : main()).catch((e) => { console.error(e); process.exit(1); });

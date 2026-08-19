// THE ACCEPTANCE TEST FOR THE RUN (ROADMAP Task 248): our extended-period simulation of Net3
// against EPA's OWN published 24-hour report, at EVERY reporting step.
//
//   node dev/lpn-spike/eps-net3-harness.js
//
// WHY THIS FILE AND NOT A COMPARISON WITH OURSELVES. dev/lpn-spike/validate_epanet.js compares two
// engines reading a file WE wrote, so a convention we got wrong is wrong identically on both sides
// and agrees perfectly. dev/lpn-spike/reference/Net3.rpt was produced by EPANET 2.2 from
// Net3.inp by EPA, and it is offline, so it can check the whole pipeline this repo owns:
// js/lpn-inp.js reading the file, js/lpn-time.js converting the clock and the controls, and
// js/lpn-epanet.js writing an LPS `.inp` and driving runH()/nextH().
//
// THE THREE THINGS ONLY A WHOLE-RUN COMPARISON CAN CATCH, each of which passes a t=0 check:
//
//   1. TANKS THAT DO NOT MOVE. A series of independent steady states reproduces 0:00 exactly and
//      then holds every tank at its starting level for the rest of the day.
//   2. A CONTROL IN THE WRONG UNITS. Net3's pumps switch on `Node 1 BELOW 17.1`, which is 17.1
//      FEET. Copied verbatim into an LPS file it reads as 17.1 m -- above that tank's maximum --
//      so pump 335 never runs. At 0:00 nothing has switched yet and the network is identical.
//   3. A PATTERN MULTIPLIED TWICE. Baking the t=0 multiplier into the base demand AND naming the
//      pattern gives 1.34 x 1.34 at midnight and drifts from there.
//
// The tolerances are the ones dev/lpn-spike/validate_epanet.js justifies: EPANET carries heads in
// single precision and the report prints two decimals, so ~0.01 ft of head and a few tenths of a
// gpm are the floor. A TANK gets a looser bound in the same units for a different reason -- its
// level is an integral, so a hundredth of a foot per step of reporting rounding accumulates.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));

const FT = 1 / 0.3048;
const HEAD_TOL_FT = 0.05;
const FLOW_TOL_GPM = 1.0;
const LEVEL_TOL_FT = 0.05;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) failures++;
}

// ---- the reference: every Node/Link Results block in EPA's report ----
//
// The blocks are ordered and repeat under "(continued)" headers, so the parse keys on the TIME in
// the heading rather than on position, and merges continuations into the same frame.
function parseReport(text) {
	const frames = {};
	let cur = null, kind = null;
	for (const line of text.split(/\r?\n/)) {
		const h = /^\s*(Node|Link) Results at (\d+):(\d+) Hrs:/.exec(line);
		if (h) {
			const t = parseInt(h[2], 10) * 3600 + parseInt(h[3], 10) * 60;
			frames[t] = frames[t] || { t, head: {}, demand: {}, flow: {}, status: {} };
			cur = frames[t];
			kind = h[1];
			continue;
		}
		if (/^\s*(Page|Node|Link|-----|\*)/.test(line) || !line.trim() || !cur) {
			// A page break or a column header, not a row. The id test below is what really decides.
			if (/^\s*Page /.test(line)) { /* keep cur: the block continues overleaf */ }
			continue;
		}
		const p = line.trim().split(/\s+/);
		if (kind === 'Node' && p.length >= 4 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) {
			cur.demand[p[0]] = parseFloat(p[1]);
			cur.head[p[0]] = parseFloat(p[2]);
		} else if (kind === 'Link' && p.length >= 4 && /^-?[.\d]+$/.test(p[1]) && /^-?[.\d]+$/.test(p[2])) {
			cur.flow[p[0]] = parseFloat(p[1]);
			cur.status[p[0]] = p[4] || p[3];
		}
	}
	return frames;
}

const { buildModel } = require('./net3-model.js');

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const rpt = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.rpt'), 'utf8');
	const ref = parseReport(rpt);
	const refTimes = Object.keys(ref).map(Number).sort((a, b) => a - b);

	const parsed = EngCalcs.lpnInpParse(inp);
	check(parsed.times && parsed.times.duration === 86400, `[TIMES] read: duration ${parsed.times && parsed.times.duration} s`);
	check(parsed.controls.length === 6, `[CONTROLS] read: ${parsed.controls.length} of 6`);
	check(parsed.patterns.length >= 2, `[PATTERNS] read: ${parsed.patterns.length}`);

	const model = buildModel(EngCalcs, parsed);
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const t0 = Date.now();
	const run = await EngCalcs.lpnEpanetRun(model);
	const ms = Date.now() - t0;
	check(run.ok, `the run completed (${ms} ms)`);
	if (!run.ok) { process.exit(1); }
	check(run.frames.length === refTimes.length,
		`frames: ${run.frames.length}, EPA's report has ${refTimes.length}`);

	// ---- head, flow and tank level, at every reporting step ----
	let worstH = 0, worstHat = '', worstQ = 0, worstQat = '', worstL = 0, worstLat = '';
	let nH = 0, nQ = 0, nL = 0, movedTanks = 0;
	const tankIds = model.nodes.filter((n) => n.type === 'tank').map((n) => n.id);
	const tankRange = {};
	tankIds.forEach((id) => { tankRange[id] = { lo: Infinity, hi: -Infinity }; });

	for (const f of run.frames) {
		const r = ref[f.t];
		if (!r) { check(false, `EPA's report has no block at ${EngCalcs.lpnFormatTime(f.t)}`); continue; }
		for (const id in r.head) {
			if (f.heads[id] === undefined) continue;
			const d = Math.abs(f.heads[id] * FT - r.head[id]);
			nH++;
			if (d > worstH) { worstH = d; worstHat = `${id} at ${EngCalcs.lpnFormatTime(f.t)}`; }
		}
		for (const id in r.flow) {
			if (f.flows[id] === undefined) continue;
			// m3/s -> GPM through the parser's own scale, not a retyped constant.
			const d = Math.abs(f.flows[id] / parsed.scale.flow - r.flow[id]);
			nQ++;
			if (d > worstQ) { worstQ = d; worstQat = `${id} at ${EngCalcs.lpnFormatTime(f.t)}`; }
		}
		for (const id of tankIds) {
			if (f.levels[id] === undefined || r.head[id] === undefined) continue;
			// The report prints a tank's GRADE (head), so the level is compared through the tank's
			// own elevation rather than against a column the report does not have.
			const elev = model.nodes.find((n) => n.id === id).elev;
			const lvlFt = f.levels[id] * FT, refLvlFt = (r.head[id] - elev * FT);
			nL++;
			tankRange[id].lo = Math.min(tankRange[id].lo, lvlFt);
			tankRange[id].hi = Math.max(tankRange[id].hi, lvlFt);
			const d = Math.abs(lvlFt - refLvlFt);
			if (d > worstL) { worstL = d; worstLat = `${id} at ${EngCalcs.lpnFormatTime(f.t)}`; }
		}
	}
	check(worstH < HEAD_TOL_FT, `head: ${nH} comparisons, worst ${worstH.toFixed(3)} ft at ${worstHat} (tol ${HEAD_TOL_FT})`);
	check(worstQ < FLOW_TOL_GPM, `flow: ${nQ} comparisons, worst ${worstQ.toFixed(3)} gpm at ${worstQat} (tol ${FLOW_TOL_GPM})`);
	check(worstL < LEVEL_TOL_FT, `tank level: ${nL} comparisons, worst ${worstL.toFixed(3)} ft at ${worstLat} (tol ${LEVEL_TOL_FT})`);

	// **THE TANKS MUST ACTUALLY MOVE.** Every number above can agree while the levels are constant
	// if the reference is misread; a flat tank is the failure this whole file exists to catch, so
	// it is asserted directly rather than inferred.
	tankIds.forEach((id) => {
		const swing = tankRange[id].hi - tankRange[id].lo;
		if (swing > 0.5) movedTanks++;
		console.log(`       tank ${id}: ${tankRange[id].lo.toFixed(2)} to ${tankRange[id].hi.toFixed(2)} ft over the day`);
	});
	check(movedTanks === tankIds.length, `every tank filled and drained: ${movedTanks} of ${tankIds.length}`);

	// **THE CONTROLS MUST ACTUALLY FIRE.** Net3 closes pump 10 at 15:00 and switches 335/330 on
	// tank 1's level. A run whose controls were dropped, or whose thresholds were left in feet,
	// solves cleanly with these links in one state all day.
	const switched = [];
	for (const id of ['10', '335', '330']) {
		const seen = {};
		run.frames.forEach((f) => { if (f.statuses[id]) seen[f.statuses[id]] = true; });
		if (Object.keys(seen).length > 1) switched.push(id);
	}
	check(switched.length === 3, `controls fired on links 10, 335, 330: ${switched.join(', ') || 'none'}`);

	// The document is untouched by a run: a tank's stored level is the user's initial condition.
	const storedLevels = model.nodes.filter((n) => n.type === 'tank').map((n) => n.level);
	const parsedLevels = parsed.nodes.filter((n) => n.type === 'tank').map((n) => n.level * parsed.scale.head);
	check(JSON.stringify(storedLevels) === JSON.stringify(parsedLevels),
		'the run wrote nothing back onto the tanks');

	console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());

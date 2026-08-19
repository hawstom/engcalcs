// DOES THE PROFILE ACTUALLY ANIMATE? The profile chart over a real Net3 extended-period run.
//
//   node dev/lpn-spike/profile-eps-harness.js
//
// profile-harness.js checks the chart's pure geometry at ONE instant; eps-net3-harness.js checks
// the run against EPA's own report. Neither asks the question a viewer asks of the play button:
// does the hydraulic grade line MOVE, and does the ground stay put?
//
// The page's wiring is showFrame() -> host.apply() -> applySolveResult() -> refreshPaneIfOpen() ->
// renderProfile(), so the profile follows the transport with no listener of its own. What can be
// wrong is not the wiring but the data: a frame result that carries the same heads at every step
// draws a chart that plays and never changes, which looks exactly like a broken play button.
//
//   1. THE GRADE LINE IS FLAT IN TIME. Every frame the same heads -- the "series of independent
//      steady states" failure, invisible at t=0 and invisible in a still screenshot.
//   2. THE GROUND MOVES. Elevation is the document's, never the run's, so a frame that rewrote it
//      would mean the chart is reading heads into the ground series.
//   3. A FRAME IS MISSING. lpnTimeFrameResult() snaps to the frame at or before t; a reporting
//      stop with no frame silently repeats its predecessor and the animation stutters.

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
const Profile = require(path.join(ROOT, 'js', 'lpn-profile.js')).lpnProfile;
const { buildModel } = require('./net3-model.js');

const FT = 1 / 0.3048;
let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}

(async function () {
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	const model = buildModel(EngCalcs, parsed);
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const run = await EngCalcs.lpnEpanetRun(model);
	check(run.ok, 'the run completed');
	if (!run.ok) { process.exit(1); }

	// The document's own half of the chart. In SI, because a frame's heads are, and the profile
	// only ever subtracts one from the other.
	const elev = {}, length = {}, type = {};
	model.nodes.forEach((n) => { elev[n.id] = n.elev; });
	model.links.forEach((l) => { length[l.id] = l.length; type[l.id] = l.type; });

	// A route that has to move: the pump station at the Lake feeds tank 1, so this path carries a
	// pump that switches on and off under Net3's own controls.
	const graph = Profile.buildGraph(model.links);
	const p = Profile.pathThrough(graph, ['River', '101']);
	check(!!p && p.nodes.length >= 3, `a path exists: ${p ? p.nodes.join(' → ') : 'none'}`);

	const stops = EngCalcs.lpnReportTimes(parsed.times);
	check(stops.length === run.frames.length,
		`every reporting stop has a frame: ${stops.length} stops, ${run.frames.length} frames`);

	// ---- walk the run the way the play button does ----
	let snapped = 0;
	const series = stops.map((t) => {
		const r = EngCalcs.lpnTimeFrameResult(run, t);
		if (!r || r.t !== t) { snapped++; }
		return { t: t, s: Profile.profileSeries(p, { elev: elev, head: r.heads, length: length, type: type }) };
	});
	check(snapped === 0, `every stop lands on its own frame, none repeating its predecessor (${stops.length} stops)`);

	// 1. The grade line moves.
	const headAt = (f, i) => f.s.nodes[i].head;
	let worst = 0, worstAt = '';
	for (let i = 0; i < series[0].s.nodes.length; i++) {
		let lo = Infinity, hi = -Infinity, loT = 0, hiT = 0;
		series.forEach((f) => {
			const h = headAt(f, i);
			if (h < lo) { lo = h; loT = f.t; }
			if (h > hi) { hi = h; hiT = f.t; }
		});
		if ((hi - lo) * FT > worst) {
			worst = (hi - lo) * FT;
			worstAt = `${series[0].s.nodes[i].id}, ${(lo * FT).toFixed(1)} ft at ` +
				`${EngCalcs.lpnFormatTime(loT)} to ${(hi * FT).toFixed(1)} ft at ${EngCalcs.lpnFormatTime(hiT)}`;
		}
	}
	check(worst > 1, `the grade line moves over the day: ${worst.toFixed(1)} ft at ${worstAt}`);

	// A single moving node would satisfy the check above while the rest of the chart sat still, so
	// count how much of the route is actually animated.
	const moving = series[0].s.nodes.filter((_, i) => {
		const hs = series.map((f) => headAt(f, i));
		return (Math.max.apply(null, hs) - Math.min.apply(null, hs)) * FT > 0.1;
	}).length;
	check(moving >= series[0].s.nodes.length - 1,
		`${moving} of ${series[0].s.nodes.length} nodes on the route move (the fixed head at the source may not)`);

	// 2. The ground does not. Compared with Object.is, because Net3's River is a reservoir stated
	// by HEAD with no elevation of its own, so its ground is NaN in every frame -- equally absent,
	// which `===` calls a difference. runs() drops it from the ground line and the chart is right.
	const groundSame = series.every((f) =>
		f.s.nodes.every((n, i) => Object.is(n.ground, series[0].s.nodes[i].ground)));
	check(groundSame, 'the ground line is the DOCUMENT\'s elevation and never moves');
	check(series[0].s.ground.length === 1 && series[0].s.ground[0].length === p.nodes.length - 1,
		`the ground line skips the reservoir and draws the other ${p.nodes.length - 1} nodes`);

	// The station axis is the document's too, so it must not rescale under the animation -- an
	// x-axis that breathed frame to frame would make the chart unreadable while it played.
	check(series.every((f) => f.s.length === series[0].s.length),
		`the station axis holds still at ${Math.round(series[0].s.length * FT)} ft`);

	console.log(failures ? `\n${failures} FAILED` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());

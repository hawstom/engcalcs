// Task 409 — headless check of js/lpn-profile.js, the profile's pure half.
//
//   node dev/lpn-spike/profile-harness.js
//
// Like geom-harness.js this simply require()s its subject, so what is tested is byte-for-byte the
// module the page loads.
//
// What can actually be wrong here, in the order it would hurt:
//
//   1. **The station is map distance, not link length.** The single defect Task 409 names first, and
//      it is invisible: the drawing still looks like a profile, just of a different pipe. Nothing in
//      lpn-profile.js can see a coordinate, so the check is that the stations come out of the
//      LENGTHS and that a hand-entered length that disagrees with the drawing wins.
//   2. **The vertical axis is not truncated.** Also invisible in the small: a zero-anchored axis
//      draws every line, in the right order, with the relief flattened out of it. Quantified below
//      on Net1's real elevations and the real EPANET engine's heads — 79% of the frame truncated,
//      30% anchored at zero. Net3 is reported too, and is the honest counter-case: its datum is
//      already near zero, so truncation buys it almost nothing (but its ground reaches -5 ft, which
//      a zero-anchored axis would clip).
//   3. **Dijkstra returns A path rather than THE shortest one.** A network with two routes of
//      different length and the same hop count catches a hop-count search; a network whose shortest
//      route has MORE hops catches a breadth-first one.
//   4. **A closed link is drawn as a steep pipe instead of a break**, inventing a head loss.
//   5. **A pump is drawn as a slope instead of a step**, spreading its head over the ground.

const Profile = require('../../js/lpn-profile.js').lpnProfile;
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function eq(actual, expected, label) {
	report(near(actual, expected), label, `got ${actual}, want ${expected}`);
}
function same(actual, expected, label) {
	const a = JSON.stringify(actual), b = JSON.stringify(expected);
	report(a === b, label, a === b ? '' : `got ${a}, want ${b}`);
}

// ---- 1. pathfinding ----------------------------------------------------
console.log('\n--- pathfinding ---');
{
	// A ---L1(100)--- B ---L2(100)--- C
	//  \______________L3(500)_______/
	// Same hop count is not the question; LENGTH is.
	const g = Profile.buildGraph([
		{ id: 'L1', from: 'A', to: 'B', length: 100 },
		{ id: 'L2', from: 'B', to: 'C', length: 100 },
		{ id: 'L3', from: 'A', to: 'C', length: 500 }
	]);
	const p = Profile.shortestPath(g, 'A', 'C');
	same(p.nodes, ['A', 'B', 'C'], 'the shortest route by LENGTH wins over the one-hop route');
	same(p.links, ['L1', 'L2'], '...and reports the links it used');
	eq(p.length, 200, '...and its total length');

	// The mirror image: the shortest route has MORE hops than the long one. A breadth-first search
	// passes the case above and fails this one.
	const g2 = Profile.buildGraph([
		{ id: 'S1', from: 'A', to: 'B', length: 10 },
		{ id: 'S2', from: 'B', to: 'C', length: 10 },
		{ id: 'S3', from: 'C', to: 'D', length: 10 },
		{ id: 'LONG', from: 'A', to: 'D', length: 900 }
	]);
	same(Profile.shortestPath(g2, 'A', 'D').nodes, ['A', 'B', 'C', 'D'],
		'three short hops beat one long one (a hop count would pick LONG)');

	report(Profile.shortestPath(g2, 'A', 'Z') === null, 'an unknown node is null, not a crash');
	const g3 = Profile.buildGraph([
		{ id: 'a', from: 'A', to: 'B', length: 1 },
		{ id: 'b', from: 'X', to: 'Y', length: 1 }
	]);
	report(Profile.shortestPath(g3, 'A', 'Y') === null, 'two islands are NOT connected — null, not an empty path');
	same(Profile.shortestPath(g3, 'A', 'A'), { nodes: ['A'], links: [], length: 0 }, 'a node to itself is a zero-length path');

	// Zero-length links (a pump, a valve) must not break the search or the total.
	const g4 = Profile.buildGraph([
		{ id: 'PU', from: 'A', to: 'B', length: 0 },
		{ id: 'P1', from: 'B', to: 'C', length: 50 }
	]);
	eq(Profile.shortestPath(g4, 'A', 'C').length, 50, 'a zero-length pump adds no station');

	// ---- waypoints: the whole of path editing --------------------------
	const p2 = Profile.pathThrough(g, ['A', 'C']);
	same(p2.nodes, ['A', 'B', 'C'], 'two stops is the suggested path');
	// Forcing the route through the long link is exactly Google Directions' waypoint gesture, and it
	// is the only path edit this feature has.
	const g5 = Profile.buildGraph([
		{ id: 'L1', from: 'A', to: 'B', length: 100 },
		{ id: 'L2', from: 'B', to: 'C', length: 100 },
		{ id: 'L3', from: 'A', to: 'D', length: 400 },
		{ id: 'L4', from: 'D', to: 'C', length: 400 }
	]);
	same(Profile.shortestPath(g5, 'A', 'C').nodes, ['A', 'B', 'C'], 'without a waypoint the short way wins');
	same(Profile.pathThrough(g5, ['A', 'D', 'C']).nodes, ['A', 'D', 'C'], 'a waypoint forces the route through it');
	eq(Profile.pathThrough(g5, ['A', 'D', 'C']).length, 800, '...and the length is the sum of the legs');
	same(Profile.pathThrough(g5, ['A', 'A', 'C']).nodes, ['A', 'B', 'C'], 'a repeated stop collapses');
	report(Profile.pathThrough(g5, ['A', 'Z', 'C']) === null, 'an unreachable waypoint is null, not a silent detour');
}

// ---- 2. stations and series -------------------------------------------
console.log('\n--- stations and series ---');
{
	const g = Profile.buildGraph([
		{ id: 'L1', from: 'A', to: 'B', length: 100 },
		{ id: 'L2', from: 'B', to: 'C', length: 250 }
	]);
	const path = Profile.shortestPath(g, 'A', 'C');
	const data = {
		elev: { A: 100, B: 90, C: 80 },
		head: { A: 120, B: 115, C: 110 },
		length: { L1: 100, L2: 250 },
		type: { L1: 'pipe', L2: 'pipe' }
	};
	const s = Profile.profileSeries(path, data);
	same(s.nodes.map(n => n.station), [0, 100, 350], 'stations are the cumulative LINK LENGTHS');
	eq(s.length, 350, 'the total station is the path length');
	same(s.nodes.map(n => n.pressure), [20, 25, 30], 'pressure is grade minus ground at each node');
	same(s.ground, [[{ x: 0, y: 100 }, { x: 100, y: 90 }, { x: 350, y: 80 }]], 'the ground line is one unbroken run');
	report(s.hgl.length === 1 && s.hgl[0].length === 3, 'the grade line is one unbroken run');
	report(s.band.length === 1 && s.band[0].length === 3, 'the pressure band spans the whole path');

	// **THE STATION IS THE STORED LENGTH, NOT THE DRAWN ONE.** Same topology, one hand-entered
	// length. Nothing else in the answer may move.
	const s2 = Profile.profileSeries(path, Object.assign({}, data, { length: { L1: 9999, L2: 250 } }));
	same(s2.nodes.map(n => n.station), [0, 9999, 10249],
		'a hand-entered length moves the station — the profile follows `len`, never the map');

	// A missing elevation is a HOLE, not a zero.
	const s3 = Profile.profileSeries(path, Object.assign({}, data, { elev: { A: 100, C: 80 } }));
	report(s3.ground.length === 2, 'a missing elevation breaks the ground line in two');
	report(!s3.ground.some(run => run.some(p => p.y === 0)), '...and never draws it at zero');
	report(s3.band.length === 0 || s3.band.every(run => run.length > 1),
		'the pressure band is not drawn across a node with no ground');
	report(s3.nodes[1].pressure === undefined, 'a node with no ground has no pressure — undefined, not 0');

	// A node the solve could not reach.
	const s4 = Profile.profileSeries(path, Object.assign({}, data, { head: { A: 120, C: 110 } }));
	report(s4.hgl.length === 2, 'a node with no solved head breaks the grade line');
}

// ---- 3. the closed link and the pump ----------------------------------
console.log('\n--- closed links and pumps ---');
{
	const g = Profile.buildGraph([
		{ id: 'P1', from: 'A', to: 'B', length: 100 },
		{ id: 'P2', from: 'B', to: 'C', length: 100 },
		{ id: 'P3', from: 'C', to: 'D', length: 100 }
	]);
	const path = Profile.shortestPath(g, 'A', 'D');
	// A CLOSED pipe: the heads on the two sides are unrelated, so the line must BREAK. Joining them
	// would draw a 40 ft head loss across a pipe carrying nothing.
	const s = Profile.profileSeries(path, {
		elev: { A: 100, B: 100, C: 100, D: 100 },
		head: { A: 160, B: 160, C: 120, D: 119 },
		length: { P1: 100, P2: 100, P3: 100 },
		type: { P1: 'pipe', P2: 'pipe', P3: 'pipe' },
		closed: { P2: true }
	});
	report(s.hgl.length === 2, 'a closed link BREAKS the grade line rather than sloping across it');
	same(s.breaks, ['P2'], '...and names the link that broke it');
	report(s.band.length === 2, '...and the pressure band breaks with it',
		'a band drawn across the break would shade a pressure nobody computed');
	report(s.hgl[0].length === 2 && s.hgl[1].length === 2, '...two runs of two, not one run of four');

	// A PUMP: its head arrives at the device, not along the ground. Drawn as a step at the link's
	// midpoint — a vertical line for the usual zero-length pump.
	const g2 = Profile.buildGraph([
		{ id: 'PU', from: 'A', to: 'B', length: 0 },
		{ id: 'P1', from: 'B', to: 'C', length: 200 }
	]);
	const s2 = Profile.profileSeries(Profile.shortestPath(g2, 'A', 'C'), {
		elev: { A: 10, B: 10, C: 10 },
		head: { A: 20, B: 120, C: 110 },
		length: { PU: 0, P1: 200 },
		type: { PU: 'pump', P1: 'pipe' }
	});
	const run = s2.hgl[0];
	report(run.some(p => p.step), 'a pump is drawn as a STEP in the grade line');
	const step = run.filter(p => p.step)[0], before = run[run.indexOf(step) - 1];
	report(near(step.x, before.x), '...vertical: the step has no horizontal extent on a zero-length pump',
		`x ${before.x} -> ${step.x}`);
	report(step.y > before.y, '...and it goes UP', `${before.y} -> ${step.y}`);
	// A pump with real ground length puts the step in the MIDDLE of it, not at either end.
	const s3 = Profile.profileSeries(Profile.shortestPath(
		Profile.buildGraph([{ id: 'PU', from: 'A', to: 'B', length: 40 }]), 'A', 'B'), {
		elev: { A: 10, B: 10 }, head: { A: 20, B: 120 },
		length: { PU: 40 }, type: { PU: 'pump' }
	});
	const st = s3.hgl[0].filter(p => p.step)[0];
	eq(st.x, 20, 'a pump with ground length steps at its midpoint');
}

// ---- 4. the vertical axis: TRUNCATION ----------------------------------
console.log('\n--- the vertical axis ---');
{
	// The heart of the task. A network's relief is small against its elevations.
	const b = Profile.axisBounds([200, 210, 260, 240]);
	report(b.min > 0, 'the axis does NOT start at zero', `min ${b.min}`);
	report(b.min <= 200 && b.max >= 260, 'it contains every plotted value', `${b.min}..${b.max}`);
	report((b.max - b.min) <= 1.5 * (260 - 200), 'and the frame is not much wider than the data',
		`span ${b.max - b.min} for data span 60`);
	// The step-choice trap: rounding the ends to a step picked as span/5 quietly un-truncates the
	// axis. 8..147 must not floor to -50.
	const bs = Profile.axisBounds([8, 147]);
	report(bs.min >= 0, 'rounding the ends outward does not undo the truncation', `min ${bs.min}`);
	report(Math.round((bs.max - bs.min) / bs.step) <= 8, '...and the gridlines stay countable',
		`${Math.round((bs.max - bs.min) / bs.step)} intervals of ${bs.step}`);
	report(near(b.min % b.step, 0) && near(b.max % b.step, 0), 'the ends land on the tick step',
		`step ${b.step}`);

	// Data that straddles zero keeps zero, because the DATA put it there.
	const bz = Profile.axisBounds([-5, 40]);
	report(bz.min <= -5 && bz.max >= 40 && bz.min < 0,
		'zero is not special — data below it is in range, not clipped', `${bz.min}..${bz.max}`);

	// A flat profile is an answer, not a divide by zero.
	const bf = Profile.axisBounds([100, 100, 100]);
	report(bf.max > bf.min, 'a perfectly flat profile still gets a real axis', `${bf.min}..${bf.max}`);
	report(bf.min < 100 && bf.max > 100, '...with the data inside it');

	// No data at all (nothing solved yet) must still produce a drawable frame.
	const be = Profile.axisBounds([]);
	report(be.max > be.min && be.empty, 'an empty series gives a drawable, flagged-empty axis');
	// undefined values are skipped rather than turned into NaN bounds.
	const bu = Profile.axisBounds([undefined, 50, null, 70, NaN]);
	report(isFinite(bu.min) && isFinite(bu.max) && bu.min <= 50 && bu.max >= 70,
		'missing values are skipped, not counted as 0 or NaN', `${bu.min}..${bu.max}`);

	// niceStep is the whole reason the labels are readable.
	same([0.9, 1.1, 2.3, 4, 6, 11].map(Profile.niceStep), [1, 2, 2.5, 5, 10, 20], 'niceStep: 1/2/2.5/5/10 decades');
	// Ticks are generated by index, so a 0.1 step does not drift.
	const t = Profile.ticks({ min: 0, max: 1, step: 0.1 });
	report(t.length === 11 && near(t[10], 1) && near(t[3], 0.3), 'ticks do not accumulate float error',
		`t[3] = ${t[3]}`);

	// plotY flips: a HIGHER value is a SMALLER y in SVG.
	const box = { left: 40, top: 10, width: 400, height: 200 }, yB = { min: 100, max: 200, step: 20 };
	eq(Profile.plotY(200, yB, box), 10, 'plotY: the top of the range is the top of the box');
	eq(Profile.plotY(100, yB, box), 210, 'plotY: the bottom of the range is the bottom of the box');
	eq(Profile.plotX(0, { min: 0, max: 1000 }, box), 40, 'plotX: station 0 is the left edge');
	eq(Profile.plotX(1000, { min: 0, max: 1000 }, box), 440, 'plotX: the end is the right edge');
}

// ---- 5. Net3: the real thing ------------------------------------------
//
// Elevations from examples/Net3-lpn.json (the shipped example) and heads from the REAL EPANET
// engine's t=0 solution (dev/lpn-spike/reference/ref_Net3.json). Both are in feet, which is what
// makes them comparable here; the page's own unit crossing is looped-network.js's job and is
// asserted by the browser spec, not by this file.
console.log('\n--- Net3, with EPANET\'s own heads ---');
{
	const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net3-lpn.json'), 'utf8'));
	const ref = JSON.parse(fs.readFileSync(path.join(__dirname, 'reference', 'ref_Net3.json'), 'utf8'));
	const elev = {}, head = {}, length = {}, type = {};
	doc.nodes.forEach(n => { if (typeof n.elev === 'number') { elev[n.id] = n.elev; } });
	ref.nodes.forEach(n => { head[n.id] = n.head; });
	// The tanks' and reservoirs' water surface, which is what a fixed-head node contributes to a
	// profile — taken from the same reference so the whole line is one solve.
	doc.links.forEach(l => {
		length[l.id] = (typeof l._length === 'number' ? l._length : (l.length || 0));
		type[l.id] = l.type;
	});
	const g = Profile.buildGraph(doc.links.map(l => ({ id: l.id, from: l.from, to: l.to, length: length[l.id] })));

	const p = Profile.shortestPath(g, 'River', '101');
	report(!!p, 'Net3: a path exists from the River to node 101');
	report(p.nodes.length >= 3, `Net3: the path has ${p ? p.nodes.length : 0} nodes`, p ? p.nodes.join(' → ') : '');
	const s = Profile.profileSeries(p, { elev: elev, head: head, length: length, type: type });
	report(s.length > 0, `Net3: the path is ${Math.round(s.length)} ft long on LINK LENGTHS`);

	const values = [];
	s.nodes.forEach(n => { if (typeof n.ground === 'number') { values.push(n.ground); }
		if (typeof n.head === 'number') { values.push(n.head); } });
	const b = Profile.axisBounds(values);
	console.log(`       Net3 data ${Math.min.apply(null, values).toFixed(1)}..${Math.max.apply(null, values).toFixed(1)} ft` +
		`   axis ${b.min}..${b.max} ft (step ${b.step})`);
	// **NET3 IS THE CASE WHERE TRUNCATION WINS LITTLE**, because its datum is already near zero —
	// and it is here to keep that honest rather than to flatter the feature. What it does prove is
	// that a zero anchor CLIPS: Net3's ground reaches -5 ft.
	report(b.min < 0, 'Net3: the axis reaches below zero, because the ground does', `min ${b.min} ft`);

	// The one thing the ROADMAP names first, on a real network: the stations must not be the map
	// distance between the symbols. Net3's coordinates are in map units of its own, so the two
	// disagree by orders of magnitude — this asserts we are on the pipe lengths.
	const byId = {}; doc.nodes.forEach(n => { byId[n.id] = n; });
	let mapDist = 0;
	for (let i = 1; i < p.nodes.length; i++) {
		const a = byId[p.nodes[i - 1]], c = byId[p.nodes[i]];
		mapDist += Math.hypot(c.x - a.x, c.y - a.y);
	}
	report(Math.abs(s.length - mapDist) / s.length > 0.5,
		'Net3: the station total is the LINK LENGTHS, nowhere near the map distance',
		`links ${Math.round(s.length)} vs map ${Math.round(mapDist)}`);
}

// ---- 6. Net1: what truncation is worth -------------------------------
//
// The number that makes the case. Same construction as Net3 above, on the network whose site sits
// 700 ft above the datum — which is the ordinary case, not an unusual one.
console.log('\n--- Net1: the truncation payoff ---');
{
	const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net1-lpn.json'), 'utf8'));
	const ref = JSON.parse(fs.readFileSync(path.join(__dirname, 'reference', 'ref_Net1.json'), 'utf8'));
	const elev = {}, head = {}, length = {}, type = {};
	doc.nodes.forEach(n => { if (typeof n.elev === 'number') { elev[n.id] = n.elev; } });
	ref.nodes.forEach(n => { head[n.id] = n.head; });
	doc.links.forEach(l => {
		length[l.id] = (typeof l._length === 'number' ? l._length : (l.length || 0));
		type[l.id] = l.type;
	});
	const g = Profile.buildGraph(doc.links.map(l => ({ id: l.id, from: l.from, to: l.to, length: length[l.id] })));
	const s = Profile.profileSeries(Profile.shortestPath(g, '10', '23'), { elev: elev, head: head, length: length, type: type });
	const values = [];
	s.nodes.forEach(n => { if (typeof n.ground === 'number') { values.push(n.ground); }
		if (typeof n.head === 'number') { values.push(n.head); } });
	const lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
	const b = Profile.axisBounds(values);
	const truncated = (hi - lo) / (b.max - b.min), anchored = (hi - lo) / (b.max - 0);
	console.log(`       data ${lo.toFixed(1)}..${hi.toFixed(1)} ft   axis ${b.min}..${b.max} ft (step ${b.step})`);
	console.log(`       the data fills ${(truncated * 100).toFixed(0)}% of the truncated frame and ` +
		`${(anchored * 100).toFixed(0)}% of one anchored at zero`);
	report(b.min > 0, 'Net1: the axis is truncated — it does not start at zero', `min ${b.min} ft`);
	report(truncated > 0.7, 'Net1: the data fills most of the truncated frame');
	report(truncated > 2 * anchored, 'Net1: truncating more than doubles the usable relief',
		`${(truncated * 100).toFixed(0)}% vs ${(anchored * 100).toFixed(0)}%`);
}

// ---- THE ROUTE IS SHOWN ON THE MAP (ROADMAP Task 433) ---------------------------------------
// Tom: "a route you cannot see is a route you cannot check." The DRAWING of it needs a browser, but
// three structural properties do not, and each is a way the feature could be silently wrong: the
// highlight must come from the same `path` the chart does, it must be cleared when the panel closes,
// and it must be redrawn on a zoom (its widths are screen-derived).
console.log('\n-- the route is drawn on the map --');
{
	const lnSrc = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
	report(/function drawProfilePath\(path\)/.test(lnSrc), 'there is a map highlight at all');
	// ONE path, computed once. Two calls to profilePath() would let the chart and the map disagree
	// about which route is on screen -- which is the exact confusion this feature exists to remove.
	report(/path = profilePath\(\);\n(\s*\/\/.*\n)*\s*drawProfilePath\(path\);/.test(lnSrc),
		'the map is drawn from the SAME path object the chart is');
	// Since Task 434 the profile is a TAB, so "closed" has three doors -- the pane's X, the toolbar
	// toggle, and switching to another tab -- and all three go through paneTabs' `hide` hook. That
	// hook is therefore the only place the clear has to be, and the only place it can be forgotten.
	report(/id: 'profile'[\s\S]{0,400}?hide: function \(\) \{ drawProfilePath\(null\); \}/.test(lnSrc),
		'leaving the profile tab clears it');
	report(/if \(paneState\.open && was && was !== now && was\.hide\) \{ was\.hide\(\); \}/.test(lnSrc),
		'...switching tabs runs that hook');
	report(/function closePane\(\)[\s\S]{0,240}?if \(t && t\.hide\) \{ t\.hide\(\); \}/.test(lnSrc),
		'...and so does closing the pane');
	report(/if \(profileIsOpen\(\)\) \{ drawProfilePath\(profilePath\(\)\); \}/.test(lnSrc),
		'a zoom redraws it, so its stroke stays a constant thickness on screen');
	// UNDER the nodes: a route is about the pipes and must not bury the junction symbols the user is
	// about to click as a waypoint.
	report(/world\.insertBefore\(profilePathLayer, nodesLayer\)/.test(lnSrc),
		'it sits above the links and below the nodes');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);

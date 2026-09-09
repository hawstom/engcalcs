// DOES THE REPAIR LOWER THE COUNT, WHICH ROUTE LOWERS IT, AND DOES THE FINAL SHED REACH ZERO
// (ROADMAP Task 539, phases two and three). Run with:
//
//   node dev/lpn-spike/label-gang-harness.js
//   node dev/lpn-spike/label-gang-harness.js --fixtures   (the pure cases alone, no examples)
//   node dev/lpn-spike/label-gang-harness.js --full       (every example x every mode, the record)
//   node dev/lpn-spike/label-gang-harness.js --measure <file.lwn> <mode> [--stability]
//
// A mode is a repair route ('off', 'brute', 'gang', 'both') optionally plus '+shed'.
//
// **THE TARGET IS ZERO, AND IT IS TOM'S** (2026-09-09: *"if there are crossing leaders we need to
// hide one. The count has to get down to 0. We have to know what we are doing here, and not show
// them if we can't show them beautifully."*). That SUPERSEDES the line that stood here, which said
// the measurement was a comparison and needed no absolute target. It still is a comparison -- the
// same example is measured at the same four zooms in five configurations, repair off, brute alone,
// gang alone, both, and both plus the final shed, which is what ships -- but the last column is now
// asserted at 0 rather than merely reported. Tom, 2026-09-08: *"We could scientifically try both
// approaches to see which works better."*
//
// **AND THE COLUMN BESIDE IT IS THE COST, which is the number he needs in order to have ruled
// well.** Zero crossings bought by hiding thirty labels may not be the trade anybody wants, so the
// labels hidden per view are printed next to the count they bought and are asserted to stay within
// a stated ceiling. A pair that survives even the shed is one where BOTH halves are the user's own
// -- hand-placed labels and Text objects, which an automatic pass may never hide -- and it is named
// rather than averaged away.
//
// **THE ASSERTION THAT MATTERS IS ON Net3-Novato-CA-World AT THE FIT ZOOM**, because that is the
// drawing he marked five gangs on, and it is the one drawing where the strategy is allowed to be
// judged wrong. Everywhere else the harness asserts only the property that makes the pass safe to
// run at all: **the count does not rise over the drawing.** The repair scores the layout it was
// given as trial zero and must beat it strictly, so a mode that finds nothing leaves the drawing
// alone -- a property, not a hope, and worth a line here because it is what lets the pass run on
// every frame. Why that is asserted over the four zooms together rather than one at a time is in
// compare(), and the answer is the cross-pass convergence, not a softened standard.
//
// **DEFAULT RUN IS ONE EXAMPLE, FIVE MODES; --full IS ALL SEVEN.** Each measurement is a whole page
// load, a solve through the real EPANET engine and four layouts, so the full grid is 35 child
// processes and about three minutes. That is the record, taken by hand and copied into
// dev/label-placement-algorithms.md; the suite pays for the one drawing the assertion is about.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { measure, EXAMPLES } = require('./label-crossing-measure.js');

const HERE = __dirname;
const MODES = ['off', 'brute', 'gang', 'both', 'both+shed'];
const SHIPPED = 'both+shed';
const HEADLINE = 'Net3-Novato-CA-World.lwn';

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ================================================================================================
// 1. THE PURE CASES
// ================================================================================================
//
// Hand-built geometry, no page, no engine: the repair asked exactly the questions Tom's rule asks.
// Node A sits above node B; A's label has been given the LOWER slot and B's the upper one, which is
// the one arrangement in which their two leaders must cross. That is his screenshot, reduced to two
// nodes and two boxes.
function runFixtures() {
	const Collide = require(path.join(HERE, '../../js/lpn-collide.js')).lpnCollide;
	const seg = Collide.segment, box = Collide.box;

	// One label spec and one placement of it, at a given endpoint, in the shape the two passes
	// exchange -- built through the pass's OWN box helpers, so the fixture cannot drift from the
	// geometry the repair reasons about.
	function spec(id, ax, ay, sides, w, h) {
		return { id: id, anchor: { x: ax, y: ay }, home: { x: ax + 2, y: ay - 2 },
			w: w || 20, h: h || 6, yOff: -3, dragged: false, sides: sides, priority: 1 };
	}
	function at(sp, c) {
		return { id: sp.id, x: c.x, y: c.y, dx: c.x - sp.home.x, dy: c.y - sp.home.y,
			dropped: false, side: (sp.sides || []).indexOf(c),
			box: Collide.labelBoxAtEnd(sp, c), boxes: Collide.labelLineBoxes(sp, c), leader: null };
	}
	const NO_OBS = { boxes: [], segments: [] };

	console.log('\n--- fixtures: the gang route alone, on two crossed leaders ---');
	{
		// **THE ANGLE RULE AND NOTHING ELSE.** Neither label is offered a single candidate side, so
		// the brute route has nothing to try and the only move available is re-dealing the two slots
		// the pair already occupies. If the count falls here it fell because the stack was ordered by
		// the bearing of the node each label belongs to, which is the whole gang idea.
		const upper = { x: 30, y: 0 }, lower = { x: 30, y: 20 };
		const a = spec('n:A', 0, 0, []), b = spec('n:B', 0, 20, []);
		const before = Collide.labelCrossings([
			{ id: a.id, boxes: Collide.labelLineBoxes(a, lower), leader: seg(0, 0, 30, 20) },
			{ id: b.id, boxes: Collide.labelLineBoxes(b, upper), leader: seg(0, 20, 30, 0) }
		]);
		report(before.counts.leaderCross === 1, 'the fixture really does cross', before.counts.pairs + ' pair(s)');
		// `report` asks for the closing count, which the pass does not take unless somebody wants
		// it -- and without it `after` would be the 0 it was initialised to and this assertion would
		// pass on a pass that did nothing.
		const r = Collide.repairCrossingGangs([a, b], [at(a, lower), at(b, upper)], NO_OBS,
			{ strategies: ['gang'], report: true });
		report(r.stats.after === 0 && r.stats.before === 1,
			'the gang route alone clears it', JSON.stringify(r.stats));
		const A = r.results.find(function (x) { return x.id === 'n:A'; });
		report(A.y === 0, 'the upper node took the upper row -- the stack is ordered by angle', 'A.y=' + A.y);
		report(r.stats.gang === 1 && r.stats.brute === 0, 'and the gang route is what did it');
	}

	console.log('\n--- fixtures: the brute route alone, on a label lying across a leader ---');
	{
		// One label, one FOREIGN leader through its box, and one alternative side. The brute route
		// is the only one that can help -- a gang of one has no stack to order -- and this is the
		// trigger that does most of the work on real drawings (76 label-on-leader against 9
		// leader-leader across the 28 measured views).
		const here = { x: 30, y: 0 }, away = { x: 30, y: 40 };
		const a = spec('n:A', 0, 0, [here, away]);
		const foreign = [{ id: 'l:P1', boxes: [box(200, 200, 8, 4, 0)], leader: seg(35, -30, 35, 30) }];
		const r = Collide.repairCrossingGangs([a], [at(a, here)], NO_OBS,
			{ strategies: ['brute'], foreign: foreign, report: true });
		report(r.stats.before === 1 && r.stats.after === 0,
			'the brute route alone clears it', JSON.stringify(r.stats));
		report(r.results[0].y === 40, 'by taking its own other candidate side', JSON.stringify(r.results[0].y));
	}

	console.log('\n--- fixtures: the ways it could quietly do harm ---');
	{
		// (a) A CLEAN DRAWING IS NOT TOUCHED. Nothing is flagged, so nothing is considered, and the
		// results come back as they went in -- the property that makes this safe on every frame.
		const a = spec('n:A', 0, 0, [{ x: 30, y: -20 }]), b = spec('n:B', 0, 40, [{ x: 30, y: 60 }]);
		const p = [at(a, a.sides[0]), at(b, b.sides[0])];
		const r = Collide.repairCrossingGangs([a, b], p, NO_OBS, {});
		report(r.stats.before === 0 && r.stats.moved === 0 && r.results[0] === p[0] && r.results[1] === p[1],
			'a clean drawing comes back untouched, object for object', JSON.stringify(r.stats));

		// (b) A HARD OBSTACLE IS STILL HARD. The alternative side that would clear the crossing has a
		// symbol standing on it, so the repair must prefer the crossing it was given: the score is
		// lexicographic and an overlap can never be bought with a crossing.
		const here = { x: 30, y: 0 }, away = { x: 30, y: 40 };
		const c = spec('n:C', 0, 0, [here, away]);
		const obs = { boxes: [box(40, 40, 40, 12, 0, 'symbol')], segments: [] };
		const blocked = Collide.repairCrossingGangs([c], [at(c, here)], obs, {
			strategies: ['brute'],
			foreign: [{ id: 'l:P1', boxes: [box(200, 200, 8, 4, 0)], leader: seg(35, -30, 35, 30) }]
		});
		report(blocked.stats.moved === 0 && blocked.results[0].y === 0,
			'it will not move onto a symbol to clear a crossing', JSON.stringify(blocked.stats));

		// (c) A DRAGGED LABEL IS THE USER'S AND IS NEVER MOVED, whatever it crosses.
		const d = spec('n:D', 0, 0, [here, away]);
		d.dragged = true;
		const dragged = Collide.repairCrossingGangs([d], [at(d, here)], NO_OBS, {
			foreign: [{ id: 'l:P1', boxes: [box(200, 200, 8, 4, 0)], leader: seg(35, -30, 35, 30) }]
		});
		report(dragged.stats.moved === 0 && dragged.results[0].y === 0,
			'a dragged label is left where the user put it', JSON.stringify(dragged.stats));

		// (d) A LEADER SHORTER THAN THE RENDERER'S THRESHOLD IS NOT DRAWN AND SO CANNOT CROSS. The
		// same pair as the first fixture, with a threshold above the leader length: nothing is
		// flagged, because nothing is on the map to flag.
		const e = spec('n:E', 0, 0, []), f = spec('n:F', 0, 20, []);
		const quiet = Collide.repairCrossingGangs([e, f],
			[at(e, { x: 30, y: 20 }), at(f, { x: 30, y: 0 })], NO_OBS, { leaderMin: 100 });
		report(quiet.stats.before === 0 && quiet.stats.moved === 0,
			'a leader the renderer hides is not a crossing', JSON.stringify(quiet.stats));

		// (e) IDEMPOTENT. Running the repair on its own output must find nothing left to do, or the
		// pass could oscillate between two layouts on a drawing nobody touched.
		const g = spec('n:G', 0, 0, []), h = spec('n:H', 0, 20, []);
		const once = Collide.repairCrossingGangs([g, h],
			[at(g, { x: 30, y: 20 }), at(h, { x: 30, y: 0 })], NO_OBS, { report: true });
		const twice = Collide.repairCrossingGangs([g, h], once.results, NO_OBS, {});
		report(once.stats.after === 0 && twice.stats.moved === 0,
			'running it again moves nothing', JSON.stringify(twice.stats));
	}

	console.log('\n--- fixtures: the final shed, where nothing could be repaired ---');
	{
		// The same crossed pair as the first fixture, with neither label offered an alternative and
		// the stack already dealt: nothing may MOVE, so the only remedy left is to hide one of them.
		function ent(id, ax, ay, cx, cy, extra) {
			const sp = spec(id, ax, ay, []);
			const e = { id: id, boxes: Collide.labelLineBoxes(sp, { x: cx, y: cy }),
				leader: seg(ax, ay, cx, cy), hideable: true, rank: 2 };
			Object.keys(extra || {}).forEach(function (k) { e[k] = extra[k]; });
			return e;
		}
		// (a) IT REACHES ZERO, and it hides exactly one of the two.
		let r = Collide.shedCrossingSurvivors([ent('n:A', 0, 0, 30, 20), ent('n:B', 0, 20, 30, 0)], {});
		report(r.before === 1 && r.after === 0 && r.hidden.length === 1,
			'one crossed pair costs exactly one label', JSON.stringify(r.hidden));

		// (b) **RANK DECIDES, AND IT OUTRANKS EVERY OTHER TERM.** The same pair with A named by a
		// tank (rank 0) and B by a junction (rank 2): the junction goes, whichever way round the
		// array is written. The reversed array is the whole assertion -- without a stated rule this
		// is where "whichever came first" would show.
		const tank = ent('n:A', 0, 0, 30, 20), junc = ent('n:B', 0, 20, 30, 0);
		tank.rank = 0;
		r = Collide.shedCrossingSurvivors([tank, junc], {});
		const flipped = Collide.shedCrossingSurvivors([junc, tank], {});
		report(r.hidden.join() === 'n:B' && flipped.hidden.join() === 'n:B',
			'the tank label keeps its place and the junction label goes, in either array order',
			JSON.stringify([r.hidden, flipped.hidden]));

		// (c) **A HAND-PLACED LABEL IS NEVER HIDDEN BY AN AUTOMATIC PASS.** Make the junction the
		// user's own and the answer reverses even though rank says otherwise, because hideability is
		// a GATE and not a term on the ladder.
		const held = ent('n:B', 0, 20, 30, 0);
		held.hideable = false;
		r = Collide.shedCrossingSurvivors([tank, held], {});
		report(r.hidden.join() === 'n:A' && r.after === 0,
			'a hand-placed label outranks the ladder: the automatic one goes', JSON.stringify(r.hidden));

		// (d) **BOTH HALVES THE USER'S OWN: THE PAIR STANDS AND IS REPORTED.** Overruling the user
		// is not on the ladder, so this is the one exit that does not reach zero -- Elm-Street-Center
		// lives here, with 14 of its 18 node labels hand-placed.
		const heldA = ent('n:A', 0, 0, 30, 20);
		heldA.hideable = false;
		r = Collide.shedCrossingSurvivors([heldA, held], {});
		report(r.hidden.length === 0 && r.after === 1 && r.residual.length === 1,
			'two hand-placed labels crossing are left alone and named', JSON.stringify(r.residual));

		// (e) **DEGREE BUYS MORE THAN ONE PAIR AT A TIME.** One wide label with two foreign leaders
		// lying across it, all three the same rank, and the two leaders parallel so they do not
		// cross each other: the shared label is in two pairs and each leader in one. Hiding the
		// shared one costs a single label and clears both, which is the greedy vertex cover this
		// problem really is; hiding the other two would cost two labels for the same picture.
		const wide = spec('n:H', 0, 10, [], 60);
		const hub = { id: 'n:H', boxes: Collide.labelLineBoxes(wide, { x: 30, y: 10 }),
				leader: seg(0, 10, 30, 10), hideable: true, rank: 2 },
			up = { id: 'n:U', boxes: [], leader: seg(40, -20, 40, 40), hideable: true, rank: 2 },
			dn = { id: 'n:D', boxes: [], leader: seg(70, -20, 70, 40), hideable: true, rank: 2 };
		r = Collide.shedCrossingSurvivors([up, hub, dn], {});
		report(r.before === 2 && r.after === 0 && r.hidden.join() === 'n:H',
			'the label in two crossings goes, and one hide clears both',
			JSON.stringify([r.before, r.hidden]));

		// (f) **A HIDDEN LABEL KEEPS ITS RESERVATION: the pipe label under it does NOT come back.**
		// A covered yielder is off the map before this pass starts and stays off, so hiding the node
		// label standing on it cannot reveal it and cannot conjure a new crossing. Releasing it
		// instead oscillates -- see coveredNow() in js/lpn-collide.js for the measurement.
		const cover = ent('n:C', 0, 0, 30, 20, { covers: true }),
			other = ent('n:O', 0, 20, 30, 0, { covers: true }),
			under = { id: 'l:P', boxes: Collide.labelLineBoxes(spec('l:P', 0, 0, []), { x: 30, y: 20 }),
				leader: null, hideable: true, rank: 3, yields: true };
		r = Collide.shedCrossingSurvivors([cover, other, under], {});
		report(r.after === 0 && r.hidden.indexOf('l:P') < 0,
			'a covered pipe label stays covered as the labels over it go',
			JSON.stringify([r.before, r.hidden, r.residual]));
	}

}

// ================================================================================================
// 2. ONE EXAMPLE, ONE MODE
// ================================================================================================
function runMode(file, mode, extra) {
	const run = spawnSync(process.execPath, [__filename, '--measure', file, mode].concat(extra || []),
		{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000, killSignal: 'SIGKILL' });
	const line = (run.stdout || '').split('\n').find(function (l) { return l.indexOf('@@JSON@@') === 0; });
	if (run.status !== 0 || !line) {
		return { error: run.error && run.error.code === 'ETIMEDOUT'
			? 'TIMED OUT after 120 s' : (run.stderr || '').split('\n').slice(-6).join(' | ') };
	}
	return JSON.parse(line.slice('@@JSON@@'.length));
}

function compare(file) {
	const got = {};
	MODES.forEach(function (m) { got[m] = runMode(file, m); });
	const bad = MODES.filter(function (m) { return got[m].error; });
	if (bad.length) {
		report(false, 'measured ' + file, bad.map(function (m) { return m + ': ' + got[m].error; }).join(' | '));
		return null;
	}
	console.log('  ' + file + '   pairs (leader-leader + label-on-leader, unordered)');
	console.log('    zoom      off    brute     gang     both    +shed   labels hid   moved   ms/pass');
	got.off.rows.forEach(function (row, i) {
		const cell = function (m) {
			const r = got[m].rows[i];
			return String(r.counts.pairs).padStart(8);
		};
		const both = got.both.rows[i], ship = got[SHIPPED].rows[i];
		console.log('    x' + String(row.zoom).padEnd(4)
			+ cell('off') + cell('brute') + cell('gang') + cell('both') + cell(SHIPPED)
			+ String(ship.shed.length).padStart(13)
			+ String((both.repair && both.repair.moved) || 0).padStart(8)
			+ (both.repairCalls
				? ((both.repairMs + ship.shedMs) / both.repairCalls).toFixed(2).padStart(10) : '   n/a'));
		if (ship.shedResidual.length) {
			console.log('           residual, nothing may hide either half: ' + ship.shedResidual.join(', '));
		}
	});
	// **ZERO, AT EVERY MEASURED ZOOM, OR THE SURVIVOR IS NAMED.** The shed hides one of every pair
	// that survives the repair, so the only way a pair can stand is that BOTH halves are the user's
	// own -- a hand-placed label or a Text object. That is a correct outcome and not a shortfall
	// (Elm-Street-Center carries 14 hand-placed node labels out of 18), so it passes and prints.
	got[SHIPPED].rows.forEach(function (r) {
		report(r.counts.pairs === r.shedResidual.length,
			'x' + r.zoom + ' reaches 0 crossings, or every survivor is the user\'s own',
			r.counts.pairs + ' pair(s), ' + r.shedResidual.length + ' of them hand-placed on both sides');
	});
	// **THE COUNT MAY NOT RISE OVER THE DRAWING, IN ANY MODE.** The repair scores the layout it was
	// given as trial zero and must beat it strictly, so within ONE pass it cannot make a view worse
	// -- and that is asserted directly by the fixtures.
	//
	// **IT IS ASSERTED OVER THE FOUR ZOOMS TOGETHER AND NOT ONE AT A TIME, and the reason is the
	// convergence Task 436 records rather than a softened standard.** The zooms are read in
	// sequence in one process, and shedAlignedForConflicts() seeds each pass from where the LAST
	// layout put things: so a repair at the fit zoom changes what is shed at 2x, which changes the
	// drawing the repair is then handed. A single view can therefore come out one pair worse while
	// every earlier view came out better -- measured on Net3 (XY), where the gang route alone runs
	// 15/8/5/1 to 12/9/3/1: one view up by one, the drawing down by four. Per-zoom rises are
	// printed, because a growing list of them is the signal that something else is wrong.
	let rose = [], worse = [];
	MODES.slice(1).forEach(function (m) {
		let sum = 0, base = 0;
		got[m].rows.forEach(function (r, i) {
			sum += r.counts.pairs;
			base += got.off.rows[i].counts.pairs;
			if (r.counts.pairs > got.off.rows[i].counts.pairs) {
				rose.push(m + ' x' + r.zoom + ': ' + got.off.rows[i].counts.pairs + '->' + r.counts.pairs);
			}
		});
		if (sum > base) { worse.push(m + ': ' + base + '->' + sum); }
	});
	if (rose.length) { console.log('    (one view up, the drawing not: ' + rose.join(', ') + ')'); }
	report(!worse.length, 'no mode raises the count over ' + file, worse.join(', ') || 'none does');
	return got;
}

// ================================================================================================
// the runner
// ================================================================================================
async function main() {
	const arg = process.argv[2];
	if (arg === '--measure') {
		const out = await measure(process.argv[3], process.argv[4] || 'both',
			{ stability: process.argv[5] === '--stability' ? 5 : 0 });
		// EXIT EXPLICITLY, with the callback. See label-crossing-harness.js: the vendored EPANET
		// engine leaves a handle open, a child that merely returns never exits, and the parent's
		// spawnSync() then blocks until the timeout -- which reads as a slow machine, not a hang.
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	runFixtures();
	if (arg === '--fixtures') {
		console.log(`\n${checks - failures}/${checks} checks passed (fixtures only).`);
		process.exit(failures ? 1 : 0);
	}

	const files = arg === '--full'
		? fs.readdirSync(EXAMPLES).filter(function (f) { return /\.lwn$/.test(f); }).sort()
		: [HEADLINE];
	console.log('\n--- the comparison, one example and one mode per process ---');
	console.log('    (zoom 1 is zoom-to-fit; 2/4/8 are steps in from it, centered on the network)');
	let head = null;
	files.forEach(function (f) {
		const got = compare(f);
		if (f === HEADLINE) { head = got; }
	});
	// **THE ONE DRAWING THE STRATEGY IS JUDGED ON.** Tom marked five gangs on Net3-World; phase one
	// found the same shape at the fit zoom. If the shipped configuration cannot lower the count
	// THERE, the strategy is wrong and this harness says so rather than averaging it away.
	if (head) {
		const off = head.off.rows[0].counts.pairs, both = head.both.rows[0].counts.pairs;
		report(both < off, HEADLINE + ' at the fit zoom: the repair alone LOWERS the count',
			off + ' -> ' + both + ' pairs');
		// **AND THE SHIPPED CONFIGURATION REACHES HIS NUMBER.** Net3-World has no hand-placed label
		// on it, so there is no residual class here and the target is flat zero over all four views.
		const ship = head[SHIPPED].rows;
		report(ship.every(function (r) { return r.counts.pairs === 0; }),
			HEADLINE + ': 0 crossings at every measured zoom',
			ship.map(function (r) { return 'x' + r.zoom + ':' + r.counts.pairs; }).join(' '));
		// The cost, held to a CEILING rather than to a number, because the shed is greedy over a
		// graph that moves with the view and pinning an exact count would go red on any placement
		// change that did not make the drawing worse. Measured 2026-09-09 -- see
		// dev/label-placement-algorithms.md section 11 for the per-view figures this bounds.
		const worst = ship.reduce(function (n, r) { return Math.max(n, r.shed.length); }, 0);
		report(worst <= 12, HEADLINE + ': the shed stays cheap',
			'worst view hides ' + worst + ' labels (ceiling 12)');
	}
	// **FIVE PASSES OVER ONE UNTOUCHED VIEW, AND IT FOUND A TWO-CYCLE THAT IS NOT THE SHED'S.**
	// A hide is the most visible thing this pass does, so the shed's stated order is worth nothing
	// unless a redraw gives the same answer -- and it does not, because THE LAYOUT UNDER IT
	// alternates. Measured with the shed switched off and the crossing PAIRS listed rather than
	// counted: `off` and `brute` repeat the same seven pairs five times, and `gang` alternates
	// between two sets of five, A B A B A. `shedAlignedForConflicts()` seeds each pass from where
	// the last layout put the node labels, so a gang move changes what the pipe labels round it shed,
	// which changes the obstacles the next first-fit sees, which moves the gang back (Task 436's
	// cross-pass convergence, failing to converge). **It shipped with phase two and this harness
	// could not see it, because the count is 5 in both states.**
	//
	// So what is asserted here is what phase three OWNS -- the shed is a deterministic function of
	// the layout it is handed, so it hides the same NUMBER on each pass and every pass is at zero --
	// and the alternating sets are printed rather than hidden. See dev/label-placement-algorithms.md
	// section 11d; the fix belongs to the gang route, not to the shed.
	console.log('\n--- five passes over one untouched view ---');
	const st = runMode(HEADLINE, SHIPPED, ['--stability']);
	if (st.error || !st.stability) {
		report(false, 'measured the stability run', st.error || 'no rows');
	} else {
		const settled = st.stability.slice(1),
			nOf = function (p) { return p.hidden.split(' ').filter(Boolean).length; };
		report(settled.every(function (p) { return nOf(p) === nOf(settled[0]); }),
			HEADLINE + ': every redraw hides the same NUMBER of labels',
			st.stability.map(nOf).join(' -> '));
		report(settled.every(function (p) { return p.pairs === 0; }),
			'...and every one of them is at 0 crossings',
			st.stability.map(function (p) { return p.pairs; }).join(' -> '));
		const distinct = st.stability.map(function (p) { return p.hidden; })
			.filter(function (h, i, a) { return a.indexOf(h) === i; });
		if (distinct.length > 1) {
			console.log('    the layout under it alternates, so the SET does too: '
				+ distinct.join('   /   '));
		}
	}
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

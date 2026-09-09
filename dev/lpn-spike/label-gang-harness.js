// DOES THE GANG REPAIR ACTUALLY LOWER THE COUNT, AND WHICH OF THE TWO ROUTES LOWERS IT (ROADMAP
// Task 539, phase two). Run with:
//
//   node dev/lpn-spike/label-gang-harness.js
//   node dev/lpn-spike/label-gang-harness.js --fixtures   (the pure cases alone, no examples)
//   node dev/lpn-spike/label-gang-harness.js --full       (every example x every mode, the record)
//   node dev/lpn-spike/label-gang-harness.js --measure <file.lwn> <mode>
//
// **THE MEASUREMENT IS A COMPARISON AND NEEDS NO ABSOLUTE TARGET** (dev/label-placement-algorithms.md
// section 8, finding 3: the crossing count is a fact about a VIEW, not about a drawing). So the same
// example is measured at the same four zooms four times over -- with the repair off, with the brute
// route alone, with the gang route alone, and with both, which is what ships -- and the columns are
// put beside each other. Tom, 2026-09-08: *"We could scientifically try both approaches to see which
// works better."*
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
// **DEFAULT RUN IS ONE EXAMPLE, FOUR MODES; --full IS ALL SEVEN.** Each measurement is a whole page
// load, a solve through the real EPANET engine and four layouts, so the full grid is 28 child
// processes and about two minutes. That is the record, taken by hand and copied into
// dev/label-placement-algorithms.md; the suite pays for the one drawing the assertion is about.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { measure, EXAMPLES } = require('./label-crossing-measure.js');

const HERE = __dirname;
const MODES = ['off', 'brute', 'gang', 'both'];
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
}

// ================================================================================================
// 2. ONE EXAMPLE, ONE MODE
// ================================================================================================
function runMode(file, mode) {
	const run = spawnSync(process.execPath, [__filename, '--measure', file, mode],
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
	console.log('    zoom      off    brute     gang     both      gangs moved (both)   repair ms/pass');
	got.off.rows.forEach(function (row, i) {
		const cell = function (m) {
			const r = got[m].rows[i];
			return String(r.counts.pairs).padStart(8);
		};
		const both = got.both.rows[i];
		console.log('    x' + String(row.zoom).padEnd(4)
			+ cell('off') + cell('brute') + cell('gang') + cell('both')
			+ String((both.repair && both.repair.moved) || 0).padStart(15)
			+ ' labels' + (both.repairCalls
				? (both.repairMs / both.repairCalls).toFixed(2).padStart(14) : '   n/a'));
	});
	// **THE COUNT MAY NOT RISE OVER THE DRAWING, IN ANY MODE.** The repair scores the layout it was
	// given as trial zero and must beat it strictly, so within ONE pass it cannot make a view worse
	// -- and that is asserted directly by the fixtures.
	//
	// **IT IS ASSERTED OVER THE FOUR ZOOMS TOGETHER AND NOT ONE AT A TIME.** The zooms are read in
	// sequence in one process, so what one view leaves on the elements is what the next one starts
	// from; a single view coming out one pair worse while every earlier view came out better used to
	// be a measured fact -- Net3 (XY) ran 15/8/5/1 to 12/9/3/1 under the gang route alone, one view
	// up by one and the drawing down by four. **Since Task 539's stability work, no view rises on any
	// example in any mode**, because the shed no longer seeds from the last layout
	// (predictNodeLabelBoxes()). The aggregate form is kept anyway: it is the promise the repair
	// actually makes, and per-zoom rises are still printed, because a list of them coming back is
	// the signal that something upstream is remembering again.
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
		const out = await measure(process.argv[3], process.argv[4] || 'both');
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
		report(both < off, HEADLINE + ' at the fit zoom: the count FALLS', off + ' -> ' + both + ' pairs');
	}
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

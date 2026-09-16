// IS THERE OPEN GROUND THE CANDIDATE LIST CANNOT SEE, AND DOES USING IT HIDE FEWER LABELS
// (ROADMAP Task 539, phase four -- `spot_prime`). Run with:
//
//   node dev/lpn-spike/label-spot-harness.js
//   node dev/lpn-spike/label-spot-harness.js --fixtures   (the pure geometry alone, no examples)
//   node dev/lpn-spike/label-spot-harness.js --full       (every shipped example, the record)
//
// **THE NUMBER THIS MOVES IS NOT THE CROSSING COUNT.** Every measured view of every shipped example
// has been at 0 crossings since phase three, and a count at zero cannot say whether a placement is
// GOOD -- only that it is not embarrassing (Tom, 2026-09-15, asking for this branch: *"I would want
// to get this branch started on the grounds that having a better network model could improve our
// performance placing labels."*). What zero COST is the labels phase three had to hide to reach it,
// so that is what this asserts: **crossings stay at zero and the shed gets no busier.**
//
// **AND THE THREE THINGS THAT MADE THE FIRST BUILD REPORT NOTHING ARE ALL FIXTURES HERE**, because
// each of them failed by finding less rather than by going wrong:
//
//   * a rectangle-collection cap that truncated in ROW ORDER, so a raster round one obstacle
//     returned the band above it and never the three beside it;
//   * a symbol gate that refused every leader ever drawn, because a leader starts inside its own
//     node's symbol and a symbol box carries no owner to exempt it by;
//   * an unclipped segment walk, which is not a correctness bug but cost 221 ms a pass on Net2.
//
// dev/label-placement-algorithms.md section 12 is the record.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { EXAMPLES } = require('./label-crossing-measure.js');

const HERE = __dirname;
const HEADLINE = 'Net3-Novato-CA-World.lwn';
const SHIPPED = 'all+shed';
// **THE SHED'S BILL, AS A CEILING AND NOT A NUMBER.** Measured 2026-09-15 over all 28 views of the
// 7 shipped examples in the shipped configuration: 38 labels hidden, down from 44 before the spot
// route. A ceiling rather than an equality because the shed is greedy over a graph that moves with
// the view, and pinning the exact count would go red on any placement change that did not make the
// drawing worse. The number may FALL and may not RISE -- lower it when it falls.
const SHED_CEILING_ALL = 38;
const SHED_CEILING_HEADLINE = 16;      // 5 / 7 / 4 / 0 over Net3-World's four views

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ================================================================================================
// 1. THE PURE GEOMETRY
// ================================================================================================
function runFixtures() {
	const Collide = require(path.join(HERE, '../../js/lpn-collide.js')).lpnCollide;
	const box = Collide.box, seg = Collide.segment;

	console.log('\n--- fixtures: spotPrime() finds the open ground, all of it ---');
	{
		// One obstacle in the middle of an otherwise empty field. A reader sees four open bands and
		// so must this: above, below, left, right, all at the same distance.
		const obs = { boxes: [box(0, 0, 40, 40, 0, 'symbol')], segments: [] };
		const got = Collide.spotPrime({ x: 0, y: 0 }, 100, obs,
			{ need: { w: 30, h: 20 }, cell: 5, maxSpots: 8 });
		report(got.length === 4, 'one obstacle in an empty field yields FOUR spots, not one',
			got.length + ': ' + got.map(function (s) { return s.cx + ',' + s.cy; }).join(' '));
		// **THE ONE THAT CAUGHT THE TRUNCATION BIAS.** With the rectangle cap below the geometric
		// maximum this returned the band ABOVE the obstacle alone -- every kept rectangle came from
		// the top rows, because the histogram scan emits them in row order. Three of the four bands
		// were never emitted, and nothing about the answer looked wrong.
		const sides = got.map(function (s) { return s.cx + ',' + s.cy; }).sort().join(' ');
		report(sides === '-60,0 0,-60 0,60 60,0', '...and they are the four SIDES, not four of one',
			sides);
		report(got.every(function (s) { return Math.abs(s.dist - 60) < 1e-9; }),
			'...each at the same distance, since the field is symmetric',
			got.map(function (s) { return s.dist.toFixed(0); }).join(' '));
		// His three extreme boxes, section 9b: the square bounds the other two.
		const s0 = got[0];
		report(s0.tall && s0.squat && s0.square,
			'...and each carries his three extreme boxes',
			'tall ' + s0.tall.w + 'x' + s0.tall.h + ', squat ' + s0.squat.w + 'x' + s0.squat.h
			+ ', square ' + s0.square.w + 'x' + s0.square.h);
		report(s0.tall.h >= s0.square.h && s0.squat.w >= s0.square.w,
			'...tallest is no shorter than the square and widest no narrower');
	}
	{
		// **A RECTANGLE MAY NOT SPAN A BLOCKED COLUMN**, which a first draft of the histogram scan
		// did -- it stacked HEIGHTS instead of indices, so the left edge of a closing bar was
		// guessed and came out on the far side of the hole. The answer looked plausible (a
		// 200x120 rectangle where none can exist) and only this kind of fixture can see it.
		const obs = { boxes: [box(0, 0, 40, 40, 0, 'symbol')], segments: [] };
		const got = Collide.spotPrime({ x: 0, y: 0 }, 100, obs,
			{ need: { w: 1, h: 1 }, cell: 5, maxSpots: 8 });
		const spans = got.filter(function (s) {
			return s.tall.w > 100 && s.tall.h > 100;
		});
		report(!spans.length, 'no spot claims a rectangle that spans the obstacle',
			spans.length ? spans.map(function (s) { return s.tall.w + 'x' + s.tall.h; }).join(' ')
				: 'none does');
	}
	{
		// A LINK LONGER THAN THE WHOLE RASTER still blocks the cells it crosses. This is the
		// clipping fixture: the walk is clipped to the grid for cost, and clipping it wrongly would
		// mark nothing at all and report the field wide open -- an optimistic raster, which is the
		// one direction this grid is allowed to err in and still the direction a reader would see.
		const obs = { boxes: [], segments: [seg(-1e6, 0, 1e6, 0, 'link')] };
		const got = Collide.spotPrime({ x: 0, y: 0 }, 100, obs,
			{ need: { w: 30, h: 20 }, cell: 5, maxSpots: 8 });
		report(got.length === 2, 'a pipe a million units long still cuts the field in two',
			got.length + ' spot(s): ' + got.map(function (s) { return s.cx + ',' + s.cy; }).join(' '));
		report(got.every(function (s) { return Math.abs(s.cy) > 20; }),
			'...and neither spot straddles it',
			got.map(function (s) { return s.cy.toFixed(0); }).join(' '));
	}
	{
		// `need` IS A FILTER AND NOT A REQUEST: a spot too small for the footprint is not returned,
		// so a caller never has to re-ask. Nothing fits between two obstacles 10 apart.
		const obs = { boxes: [box(-30, 0, 40, 200, 0, 'symbol'), box(30, 0, 40, 200, 0, 'symbol')],
			segments: [] };
		const tight = Collide.spotPrime({ x: 0, y: 0 }, 100, obs,
			{ need: { w: 40, h: 20 }, cell: 5, maxSpots: 8 });
		report(!tight.some(function (s) { return Math.abs(s.cx) < 10; }),
			'a gap narrower than the footprint is not offered as a spot',
			tight.length + ' spot(s) and none in the slot');
	}
	{
		report(!Collide.spotPrime({ x: 0, y: 0 }, 0, { boxes: [], segments: [] }, {}).length,
			'a reach of zero returns nothing rather than dividing by it');
		const full = Collide.spotPrime({ x: 0, y: 0 }, 100,
			{ boxes: [box(0, 0, 1000, 1000, 0, 'symbol')], segments: [] },
			{ need: { w: 10, h: 10 }, cell: 5 });
		report(!full.length, 'a completely blocked field yields no spots', full.length + ' spot(s)');
	}

	console.log('\n--- fixtures: what a long leader may and may not do ---');
	{
		// **A LEADER STARTS INSIDE ITS OWN NODE'S SYMBOL, ALWAYS.** The first build gated on
		// "passes through no symbol" and so refused every trial it ever generated: 108 spots found
		// on Net3-World and 0 trials scored, with the statistics reporting both numbers and nobody
		// reading them together.
		const own = box(0, 0, 10, 10, 0, 'symbol');
		const far = box(60, 0, 10, 10, 0, 'symbol');
		// The pipe spans BOTH ways from x = 0: a leader that merely touches a link's endpoint is
		// not crossing it, and a fixture that asks the question at the endpoint is asking a
		// different one.
		const obs = { boxes: [own, far], segments: [seg(-100, 40, 100, 40, 'link')] };
		report(Collide.leaderClearOfSymbols(seg(0, 0, 0, -50, 'leader'), obs, 'n:A'),
			'a leader out of its own symbol is clear -- the symbol it STARTS in is exempt');
		report(!Collide.leaderClearOfSymbols(seg(0, 0, 100, 0, 'leader'), obs, 'n:A'),
			'a leader through somebody ELSE\'s node symbol is not');
		report(Collide.leaderClearOfSymbols(seg(0, 0, 0, 100, 'leader'), obs, 'n:A'),
			'a leader across a PIPE is not gated here -- it is a term, not a gate');
		report(Collide.leaderLinkCrossings(seg(0, 0, 0, 100, 'leader'), obs, 'n:A') === 1,
			'...and the term counts it', 'one pipe crossed');
		report(Collide.leaderLinkCrossings(seg(0, 0, 0, -100, 'leader'), obs, 'n:A') === 0,
			'...and counts none when none is crossed');
		report(Collide.leaderLinkCrossings(null, obs, 'n:A') === 0,
			'a label with no drawn leader crosses nothing');
	}

	console.log('\n--- fixtures: the spot route clears what neither other route can reach ---');
	// ONE LABEL, ONE FOREIGN LEADER THROUGH ITS BOX, AND NOWHERE INSIDE THE CANDIDATE RING TO GO.
	// This is the trigger that does most of the work on real drawings -- 76 label-on-leader against
	// 9 leader-leader across the 28 measured views -- and it is the case neither cheap route can
	// touch: `brute` is offered one candidate, which is where the label already is, and a gang of
	// one has no stack to re-deal. So whatever happens here is the spot route or nothing.
	function oneLabel(sides) {
		return { id: 'n:A', anchor: { x: 0, y: 0 }, home: { x: 2, y: -2 },
			w: 20, h: 6, yOff: -3, dragged: false, sides: sides, priority: 1 };
	}
	function at(sp, c) {
		return { id: sp.id, x: c.x, y: c.y, dx: c.x - sp.home.x, dy: c.y - sp.home.y,
			dropped: false, side: (sp.sides || []).indexOf(c),
			box: Collide.labelBoxAtEnd(sp, c), boxes: Collide.labelLineBoxes(sp, c), leader: null };
	}
	// The foreigner's leader runs straight down through where the label sits. Nobody may move it.
	const CROSSED = [{ id: 'l:P1', boxes: [box(400, 400, 8, 4, 0)], leader: seg(25, -30, 25, 30) }];
	{
		const here = { x: 20, y: 0 };
		const a = oneLabel([here]);
		const open = { boxes: [], segments: [] };
		const cheap = Collide.repairCrossingGangs([a], [at(a, here)], open,
			{ strategies: ['brute', 'gang'], foreign: CROSSED, report: true });
		report(cheap.stats.before === 1 && cheap.stats.after === 1,
			'brute + gang cannot clear it -- one candidate, and a gang of one has no stack',
			JSON.stringify({ before: cheap.stats.before, after: cheap.stats.after }));
		const got = Collide.repairCrossingGangs([a], [at(a, here)], open,
			{ strategies: ['brute', 'gang', 'spot'], foreign: CROSSED, report: true });
		report(got.stats.after === 0, 'the spot route clears it', JSON.stringify(got.stats));
		report(got.stats.spot === 1 && got.stats.spotsFound > 0,
			'...and it is the spot route that did it, on ground it had to go and find',
			got.stats.spotsFound + ' spot(s) found, ' + got.stats.spotTrials + ' trial(s) scored');
		const A = got.results.find(function (x) { return x.id === 'n:A'; });
		report(Math.abs(A.x - here.x) > 1e-9 || Math.abs(A.y - here.y) > 1e-9,
			'...and the label really moved', 'to ' + A.x.toFixed(1) + ',' + A.y.toFixed(1));
	}
	{
		// **AND IT MAY NOT SPEND A HARD OVERLAP TO BUY A CROSSING**, which is the gate section 10b
		// states and which applies to this route exactly as to the other two. Every square unit
		// round the node is occupied, so the pass must decline to move at all rather than stack the
		// label onto something a reader cannot read through.
		const here = { x: 20, y: 0 };
		const a = oneLabel([here]);
		const walled = { boxes: [box(0, 0, 4000, 4000, 0, 'symbol')], segments: [] };
		const got = Collide.repairCrossingGangs([a], [at(a, here)], walled,
			{ strategies: ['brute', 'gang', 'spot'], foreign: CROSSED, report: true });
		report(got.stats.after === 1 && got.stats.spot === 0,
			'with no open ground it declines to move rather than stacking onto something',
			JSON.stringify({ after: got.stats.after, spot: got.stats.spot,
				found: got.stats.spotsFound }));
	}

	console.log('\n--- fixtures: the developer view (?debug=spots) sees it and cannot steer it ---');
	{
		// **THE TRACE IS AN OUT-PARAMETER AND A SHIPPED PAGE MUST NOT PAY FOR IT.** Absent the
		// flag there is no list at all, which is the assertion that keeps the picture from becoming
		// a second code path the drawing depends on.
		const here = { x: 20, y: 0 };
		const a = oneLabel([here]);
		const open = { boxes: [], segments: [] };
		const quiet = Collide.repairCrossingGangs([a], [at(a, here)], open,
			{ strategies: ['brute', 'gang', 'spot'], foreign: CROSSED });
		report(!quiet.stats.trace, 'no trace unless it is asked for');

		const seen = Collide.repairCrossingGangs([a], [at(a, here)], open,
			{ strategies: ['brute', 'gang', 'spot'], foreign: CROSSED, trace: true });
		const t = (seen.stats.trace || [])[0];
		report(!!t && t.ran && t.won && t.spots.length > 0 && t.trials > 0,
			'a gang the search fixed is traced with its spots, its trials and its verdict',
			t ? JSON.stringify({ ran: t.ran, by: t.by, spots: t.spots.length, trials: t.trials })
				: 'no record');
		// The raster is recorded BY REFERENCE, so the picture is the very array the scan ran over
		// and not a second one built to look like it -- the drift `js_fallback_string_check.php`
		// exists because of, in geometry.
		report(!!t && !!t.field && t.field.blocked.length === t.field.n * t.field.n
				&& t.need && t.need.h > 0,
			'...and the occupancy raster and the footprint it was asked for come with it',
			t && t.field ? t.field.n + 'x' + t.field.n + ' cells of ' + t.field.cell.toFixed(1)
				: 'no field');
	}
	{
		// **`,all` LOOKS WHERE THE SHIPPED SCHEDULE DOES NOT, AND MAY NOT MOVE ANYTHING.** The
		// shipped search runs only where the cheap routes left a crossing standing, so on the gangs
		// they DID clear -- most of them, on a real drawing -- the overlay would be empty, which is
		// exactly the case somebody watching the screen needs explained. The switch searches those
		// gangs for the picture alone, and the only thing that makes it safe to offer is that the
		// layout it produces is identical.
		//
		// The fixture is the gang route's own: two crossed leaders that the re-deal clears, so by
		// the time the spot branch is reached there is nothing left to fix.
		const upper = { x: 30, y: 0 }, lower = { x: 30, y: 20 };
		function gspec(id, ax, ay) {
			return { id: id, anchor: { x: ax, y: ay }, home: { x: ax + 2, y: ay - 2 },
				w: 20, h: 6, yOff: -3, dragged: false, sides: [], priority: 1 };
		}
		const a = gspec('n:A', 0, 0), b = gspec('n:B', 0, 20);
		const open = { boxes: [], segments: [] };
		function run(extra) {
			return Collide.repairCrossingGangs([a, b], [at(a, lower), at(b, upper)], open,
				Object.assign({ strategies: ['brute', 'gang', 'spot'], report: true, trace: true },
					extra));
		}
		const plain = run({});
		const look = run({ spotAlways: true });
		const pt = (plain.stats.trace || [])[0], lt = (look.stats.trace || [])[0];
		report(!!pt && !pt.ran && !pt.searchOnly,
			'a gang the cheap routes cleared is not searched on a shipped page',
			pt ? JSON.stringify({ ran: pt.ran, by: pt.by }) : 'no record');
		report(!!lt && lt.searchOnly && !lt.ran && lt.trials === 0 && lt.spots.length > 0,
			'...and IS searched for the picture alone under the switch, with nothing tried',
			lt ? JSON.stringify({ searchOnly: lt.searchOnly, trials: lt.trials,
				spots: lt.spots.length }) : 'no record');
		report(JSON.stringify(plain.results) === JSON.stringify(look.results)
				&& look.stats.moved === plain.stats.moved && look.stats.spot === plain.stats.spot,
			'...and the drawing it produces is identical to the one without the switch');
	}
}

// ================================================================================================
// 2. THE SHIPPED DRAWINGS: the shed must get no busier
// ================================================================================================
function runMode(file, mode) {
	const run = spawnSync(process.execPath,
		[path.join(HERE, 'label-gang-harness.js'), '--measure', file, mode],
		{ cwd: HERE, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 240000 });
	const line = (run.stdout || '').split('\n').find(function (l) { return l.indexOf('@@JSON@@') === 0; });
	if (!line) {
		return { error: (run.stderr || run.stdout || 'no output').split('\n').slice(-4).join(' | ') };
	}
	return JSON.parse(line.slice('@@JSON@@'.length));
}

function checkExamples(files, ceiling) {
	let shed = 0, drawn = 0, pairs = 0, residual = 0, spotWins = 0, spots = 0, views = 0;
	files.forEach(function (f) {
		const got = runMode(f, SHIPPED);
		if (got.error) { report(false, 'measured ' + f, got.error); return; }
		got.rows.forEach(function (r) {
			views++;
			shed += r.shed.length;
			drawn += r.passes[0].drawn;
			pairs += r.counts.pairs;
			residual += r.shedResidual.length;
			spotWins += (r.repair && r.repair.spot) || 0;
			spots += (r.repair && r.repair.spotsFound) || 0;
		});
		console.log('    ' + f.padEnd(28)
			+ ' pairs ' + got.rows.map(function (r) { return r.counts.pairs; }).join('/')
			+ '   hidden ' + got.rows.map(function (r) { return r.shed.length; }).join('/')
			+ '   drawn ' + got.rows.map(function (r) { return r.passes[0].drawn; }).join('/')
			+ '   spot won ' + got.rows.map(function (r) { return (r.repair && r.repair.spot) || 0; }).join('/'));
	});
	// **THE ABSOLUTE.** A model improvement that raises the crossing count has failed however
	// elegant it is; the only pairs allowed to stand are the ones where BOTH halves are the user's
	// own drawing, which the shed reports by id.
	report(pairs === residual, views + ' views: 0 crossings, or every survivor is the user\'s own',
		pairs + ' pair(s), ' + residual + ' of them hand-placed on both sides');
	// **AND THE NUMBER THIS PHASE EXISTS TO MOVE.** Hiding is the last remedy, so a better model
	// hides FEWER. A ratchet: it may fall and may not rise.
	report(shed <= ceiling, views + ' views: the shed is no busier than it was',
		shed + ' labels hidden (ceiling ' + ceiling + '), ' + drawn + ' drawn');
	// A route that finds nothing to do and a route that finds nothing look identical in the count
	// alone, which is the distinction section 10c asked to be measured before this was built.
	report(spots > 0, 'the spot search finds open ground on a real drawing',
		spots + ' spot(s) offered across ' + views + ' views, ' + spotWins + ' gang(s) placed in one');
}

function main() {
	const arg = process.argv[2];
	runFixtures();
	if (arg === '--fixtures') {
		console.log(`\n${checks - failures}/${checks} checks passed (fixtures only).`);
		process.exit(failures ? 1 : 0);
	}
	const files = arg === '--full'
		? fs.readdirSync(EXAMPLES).filter(function (f) { return /\.lwn$/.test(f); }).sort()
		: [HEADLINE];
	console.log('\n--- the shipped drawings: crossings at zero, and the shed no busier ---');
	checkExamples(files, arg === '--full' ? SHED_CEILING_ALL : SHED_CEILING_HEADLINE);
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main();

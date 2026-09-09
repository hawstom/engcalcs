// HOW MANY LEADERS CROSS, AND HOW MANY LABELS LIE ACROSS SOMEBODY ELSE'S LEADER (Task 539, phase
// one). Run with:
//
//   node dev/lpn-spike/label-crossing-harness.js
//   node dev/lpn-spike/label-crossing-harness.js --fixtures     (the pure cases alone, no examples)
//   node dev/lpn-spike/label-crossing-harness.js --measure <file.lwn>   (one example, JSON out)
//
// **THIS HARNESS MEASURES AND MOVES NOTHING.** Tom, 2026-08-26, with a screenshot of two node labels
// whose leaders cross: *"This might be forgiveable if it looked difficult or impossible. But when it
// looks so easy (to a human) to resolve, it's embarrassing."* And in the same breath: *"I don't want
// to be forever tweaking this."* So the first thing built was the number -- how big the problem
// actually is on the drawings we already ship -- before anybody optimized anything. The gang move
// itself is phase two, it is Collide.repairCrossingGangs(), and label-gang-harness.js is what
// judges it: this file's job is still to say what the shipped drawing holds.
//
// WHAT IS ASSERTED, and the order matters:
//
//   1. THE PURE CASES. Collide.labelCrossings() finds a hand-built crossing pair, finds a hand-built
//      label-on-leader, and reports NOTHING on a hand-built clean pair. Plus the three ways it could
//      quietly report the wrong thing: counting a label's own leader (a constant on every drawing),
//      reading a stacked label as one block instead of its rows, and splitting one three-label gang
//      into two pairs.
//   2. THE LIVE COUNT, on every shipped example, at four zooms each. **NO BOUND IS ASSERTED ON IT
//      beyond "it ran and it is finite"** -- the spread across examples and zooms is the finding,
//      and a threshold invented here would be a number nobody chose. The counts are PRINTED, and
//      the ones that matter are copied into the Task 539 block.
//
// **THE SAMPLE, THE FOUR SOURCES IT IS ASSEMBLED FROM, AND WHY THE LEADER HAS TO COME FROM THE
// DOM: all of it is in ./label-crossing-measure.js, which does the measuring for this harness and
// for label-gang-harness.js alike, so there is one measurement and not two.
//
// **ONE EXAMPLE PER PROCESS.** shedAlignedForConflicts() seeds node labels as obstacles where the
// LAST layout placed them, so the pass converges ACROSS passes and two loads in one process would
// contaminate each other (ROADMAP Task 436). The parent run spawns `--measure` once per file.
//
// **AND THE NUMBERS BELOW ARE NOW THE DRAWING AS IT SHIPS**, which since Task 539 phase two
// means AFTER Collide.repairCrossingGangs() has moved the gangs it can. The before/after
// comparison, and the two routes measured against each other, are label-gang-harness.js's.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { measure, EXAMPLES } = require('./label-crossing-measure.js');

const HERE = __dirname;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ================================================================================================
// 1. THE PURE CASES
// ================================================================================================
function runFixtures() {
	const Collide = require(path.join(HERE, '../../js/lpn-collide.js')).lpnCollide;
	const seg = Collide.segment, box = Collide.box;

	console.log('\n--- fixtures: two leaders that cross ---');
	{
		// An X at (5,5). The two boxes hang off opposite ends and are nowhere near each other, so
		// the ONLY thing wrong with this picture is the crossing -- which is the case Tom
		// photographed.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'b', box: box(-4, 12, 8, 4, 0), leader: seg(10, 0, 0, 10) }
		]);
		report(r.counts.leaderCross === 1, 'the crossing is found', JSON.stringify(r.leaderPairs));
		report(r.counts.labelOnLeader === 0, '...and nothing else is claimed');
		report(r.counts.gangs === 1 && r.gangs[0].length === 2, 'the pair is one gang of two');
	}

	console.log('\n--- fixtures: a label lying across somebody else’s leader ---');
	{
		// **THE TRIGGER THE FIRST ONE WOULD MISS.** These two leaders do not come close to each
		// other; B's runs straight through A's box. Tom named this second trigger himself, and it is
		// just as ugly on the page.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(20, 0, 10, 4, 0), leader: seg(0, 0, 15, 0) },
			{ id: 'b', box: box(20, 22, 8, 4, 0), leader: seg(20, -20, 20, 20) }
		]);
		report(r.counts.leaderCross === 0, 'no leader crossing here, and none is reported');
		report(r.counts.labelOnLeader === 1 && r.labelOnLeader[0].label === 'a'
			&& r.labelOnLeader[0].leader === 'b',
			'a’s box is crossed by b’s leader', JSON.stringify(r.labelOnLeader[0]));
		report(r.counts.pairs === 1 && r.counts.gangs === 1,
			'the two triggers feed one pair list, so this is also one gang');
	}

	console.log('\n--- fixtures: a clean pair, which must NOT be reported ---');
	{
		// Two parallel leaders, boxes well apart: the picture a gang move is trying to PRODUCE. A
		// detector that flags this one would send phase two chasing layouts that are already right.
		const r = Collide.labelCrossings([
			{ id: 'a', box: box(14, -12, 8, 4, 0), leader: seg(0, 0, 10, -10) },
			{ id: 'b', box: box(14, 8, 8, 4, 0), leader: seg(0, 20, 10, 10) }
		]);
		report(r.counts.leaderCross === 0 && r.counts.labelOnLeader === 0 && r.counts.gangs === 0,
			'nothing reported on a clean pair', JSON.stringify(r.counts));
		report(r.counts.labels === 2 && r.counts.leaders === 2,
			'...and it did look at both of them', JSON.stringify(r.counts));
	}

	console.log('\n--- fixtures: the three ways it could report the wrong thing ---');
	{
		// (a) A LABEL'S OWN LEADER IS NEVER COUNTED. It stops at the box's near edge by
		// construction, so counting it would add the same constant to every drawing and the number
		// would say nothing about the layout.
		const own = Collide.labelCrossings([
			{ id: 'a', box: box(14, 0, 8, 4, 0), leader: seg(0, 0, 10, 0) },
			{ id: 'far', box: box(500, 500, 8, 4, 0), leader: seg(480, 500, 496, 500) }
		]);
		report(own.counts.labelOnLeader === 0 && own.counts.leaderCross === 0,
			'a leader landing on its own box is not a crossing', JSON.stringify(own.counts));

		// (b) THE STAIRCASE, NOT THE BLOCK (Task 406). A stacked label reserves one box per ROW, and
		// a leader through the gap beside a short row is through nothing at all.
		const rows = [box(20, 0, 20, 4, 0), box(14, 5, 8, 4, 0)];
		const stair = Collide.labelCrossings([
			{ id: 'a', boxes: rows, leader: seg(0, 0, 9, 0) },
			{ id: 'b', box: box(60, 60, 8, 4, 0), leader: seg(30, -20, 30, 20) }
		]);
		report(stair.counts.labelOnLeader === 1,
			'a leader through ONE row of a stacked label counts once, not once per row',
			JSON.stringify(stair.labelOnLeader));
		const notch = Collide.labelCrossings([
			{ id: 'a', boxes: rows, leader: seg(0, 0, 9, 0) },
			{ id: 'b', box: box(60, 60, 8, 4, 0), leader: seg(19, 5, 40, 5) }
		]);
		report(notch.counts.labelOnLeader === 0,
			'...and a leader in the notch beside the short row hits nothing, because the block is '
			+ 'not the geometry', JSON.stringify(notch.counts));

		// (c) A GANG IS A COMPONENT, NOT A PAIR, AND THE TWO TRIGGERS FEED ONE GRAPH. Tom's cluster D
		// is three labels competing for one open sector; reporting it as separate pairs would have
		// phase two move them in twos and undo itself. Here a and b cross leaders, and c -- which
		// draws no leader of its own -- sits on top of the crossing point, so it is joined to both by
		// the OTHER trigger.
		const chain = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'b', box: box(-4, 12, 8, 4, 0), leader: seg(10, 0, 0, 10) },
			{ id: 'c', box: box(5, 5, 4, 2, 0), leader: null }
		]);
		report(chain.counts.leaderCross === 1 && chain.counts.labelOnLeader === 2,
			'one leader crossing and two labels-on-leaders', JSON.stringify(chain.counts));
		report(chain.counts.gangs === 1 && chain.gangs[0].length === 3,
			'...which is ONE gang of three, not three findings', JSON.stringify(chain.gangs));

		// (d) A DROPPED LABEL IS NOT ON THE MAP. placeLabelsFirstFit() returns it with a null box,
		// and a label nobody can see cannot be in a crossing.
		const dropped = Collide.labelCrossings([
			{ id: 'a', box: box(14, 12, 8, 4, 0), leader: seg(0, 0, 10, 10) },
			{ id: 'gone', box: null, leader: null }
		]);
		report(dropped.counts.labels === 1, 'a dropped label is not counted at all',
			JSON.stringify(dropped.counts));
	}
}

// ================================================================================================
// the runner
// ================================================================================================
async function main() {
	const arg = process.argv[2];
	if (arg === '--measure') {
		const out = await measure(process.argv[3], 'both');
		// **EXIT EXPLICITLY. RETURNING HANGS THE WHOLE SUITE, AND IT DID.** A child that returns
		// from main() exits only when the event loop drains, and this one has loaded the vendored
		// EPANET engine through a dynamic import -- which leaves a handle open, so the process sits
		// at 0% CPU for ever with its work finished and its line written. The parent's spawnSync()
		// then blocks with no timeout, `run_harnesses.sh` never reaches harness 91 of 160, and
		// `check_all.sh` never returns at all. Measured 2026-09-06: reproduced on this tree and on
		// the commit before it, so it is not new -- it is intermittent, which is worse, because a
		// suite that hangs one run in three reads as a slow machine.
		// The callback is load-bearing: stdout to a PIPE is asynchronous, so exiting on the next
		// line would race the very line the parent is waiting to read.
		process.stdout.write('@@JSON@@' + JSON.stringify(out) + '\n', function () { process.exit(0); });
		return;
	}
	runFixtures();
	if (arg === '--fixtures') {
		console.log(`\n${checks - failures}/${checks} checks passed (fixtures only).`);
		process.exit(failures ? 1 : 0);
	}

	console.log('\n--- the live count, one example per process ---');
	console.log('    (zoom 1 is zoom-to-fit; 2/4/8 are steps in from it, centred on the network)');
	const files = fs.readdirSync(EXAMPLES).filter(function (f) { return /\.lwn$/.test(f); }).sort();
	report(files.length > 0, 'there are examples to measure', files.length + ' file(s)');
	let measured = 0;
	files.forEach(function (f) {
		// **AND THE PARENT REFUSES TO WAIT FOR EVER, whatever the child does.** The explicit exit
		// above fixes the cause; this makes the failure mode survivable if any future cause appears,
		// because the two are not the same guarantee. A hang here is invisible -- no output, no
		// failure, the runner simply stops -- while a timeout is one red line naming the file.
		// Ninety seconds is far above the worst honest measurement (the largest example takes a few
		// seconds even on a loaded machine) and far below "somebody gives up and kills it".
		const run = spawnSync(process.execPath, [__filename, '--measure', f],
			{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 90000, killSignal: 'SIGKILL' });
		const line = (run.stdout || '').split('\n').find(function (l) { return l.indexOf('@@JSON@@') === 0; });
		if (run.status !== 0 || !line) {
			report(false, 'measured ' + f, run.error && run.error.code === 'ETIMEDOUT'
				? 'TIMED OUT after 90 s -- the child did not exit'
				: (run.stderr || '').split('\n').slice(-6).join(' | '));
			return;
		}
		measured++;
		const out = JSON.parse(line.slice('@@JSON@@'.length));
		console.log('  ' + f);
		out.rows.forEach(function (r) {
			const c = r.counts;
			console.log('    zoom x' + r.zoom + '  ' + String(c.labels).padStart(4) + ' labels, '
				+ String(c.leaders).padStart(4) + ' with leaders  ->  '
				+ String(c.leaderCross).padStart(3) + ' leader crossings, '
				+ String(c.labelOnLeader).padStart(3) + ' label-on-leader, '
				+ String(c.pairs).padStart(3) + ' pairs in ' + String(c.gangs).padStart(3) + ' gangs');
		});
		// **NO BOUND, ON PURPOSE.** What is asserted is that the measurement HAPPENED and is finite;
		// the size of the number is the finding this phase exists to produce, and a threshold picked
		// here would be one nobody chose. Phase two's assertion is a COMPARISON -- the same drawing
		// before and after a gang move -- which needs no absolute number at all.
		const ok = out.rows.length > 0 && out.rows.every(function (r) {
			return isFinite(r.counts.leaderCross) && isFinite(r.counts.labelOnLeader)
				&& r.counts.labels > 0;
		});
		report(ok, 'measured ' + f, out.rows.length + ' zoom(s), '
			+ out.rows.map(function (r) { return r.counts.pairs; }).join('/') + ' pairs');
	});
	report(measured === files.length, 'every example was measured',
		measured + '/' + files.length);

	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });

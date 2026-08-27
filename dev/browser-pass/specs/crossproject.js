// §31 — arriving at a project must not cost more because of the project you LEFT.
//
// Tom, 2026-08-19: *"Switching from Net3-World to Net3 still takes 5 seconds with no 'Please wait'
// indicator. And the reply you gave the last time I reported this was wrong… I know from ample
// experience with lpn that this delay has never happened until I got this Net3-World model
// operational and then switched away from it."* He was right and the earlier answer — that Net3's
// own open was simply slow — was wrong. The control below is what settles it: the SAME arrival at
// the SAME project, reached from a blank XY project and from the lat/lon one.
//
//     arriving at Net3 from a blank XY project      405 ms,   568 ms
//     arriving at Net3 from Net3-World (lat/lon)  14,616 ms, 22,398 ms
//
// A CPU profile of one 16.4 s arrival put 62.8% in `span()` (js/lpn-collide.js), 29.6% in the
// garbage collector it fed, and 4.6% in `addSegment` — 97% in the label-collision index, and none
// of it in the 2.6 MB backdrop image or in paint.
//
// **THE CAUSE: the label reach is derived from the LABEL SIZES and the obstacles are the DRAWING,
// and nothing tied the two together.** A label's world size is `settings.textSize / state.s`, so
// arriving with the scale still set by a lat/lon project (state.s in the millions, because a world
// unit there is a DEGREE) made every label microscopic while Net3's pipes stayed thousands of units
// long. `grid()` indexes an obstacle into every cell its bounding box touches, so one pipe went
// into (L/cell)² cells. The fix is in `js/lpn-collide.js`, which now raises its own cell size — the
// safe direction, since a bigger cell can only offer the narrow phase more candidates to reject.
// `dev/lpn-spike/collide-harness.js` asserts both halves; this spec is the end-to-end guard.

const fs = require('fs');
const path = require('path');
const { Session } = require('../lib/session');
const SRC = path.join(__dirname, '..', '..', 'water-network-examples');

exports.title = '31. Arriving at a project costs the same whatever you left';

// Generous, because this machine is not Tom's and the pass runs alongside everything else. The
// defect was 30-50x, so a bound that catches it does not need to be tight -- and a tight one here
// is a test that fails for reasons that are not defects.
const BOUND_MS = 5000;
// The two arrivals must also be COMPARABLE. This is the assertion that really encodes the finding:
// the whole complaint is that one of them was 30x the other.
const RATIO = 4;

async function openFile(a, name) {
	await a.writeFile(name, fs.readFileSync(path.join(SRC, name), 'utf8'));
	await a.queuePick(name);
	await a.menuClick('Open…');
	const d = await a.dialog();
	if (d && (d.buttons || []).includes('Continue')) { await a.answerTrainingPanel('TGH'); }
	await a.settle(3000);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.makeEdit();
		await a.settle(400);
		await openFile(a, 'Net3-Novato-CA-World.lwn');
		await openFile(a, 'Net3-lpn.json');

		// The switch is synchronous inside the click handler, so the evaluate does not return until
		// it is done; the layout read after it adds the paint the user actually waits for.
		async function clickTab(label) {
			const t = Date.now();
			const found = await a.page.evaluate((lab) => {
				const els = Array.from(document.querySelectorAll('#lpn_tabs .lpn-tab'));
				const hit = els.find((e) => ((e.querySelector('.lpn-tab-name') || {}).textContent || '').indexOf(lab) >= 0);
				if (!hit) { return false; }
				(hit.querySelector('.lpn-tab-name') || hit).click();
				return true;
			}, label);
			if (!found) { return null; }
			await a.page.evaluate(() => document.getElementById('lpn_canvas').getBoundingClientRect().width);
			const ms = Date.now() - t;
			await a.settle(1200);
			return ms;
		}

		// Best of two each, alternating, for the reason perf.js gives: this number swings with what
		// else the machine is doing, and alternating is what makes the PAIR mean anything.
		let fromBlank = Infinity, fromGeo = Infinity;
		for (let i = 0; i < 2; i++) {
			await clickTab('Project1');
			const b = await clickTab('Net3-lpn');
			await clickTab('Net3-World');
			const g = await clickTab('Net3-lpn');
			if (b === null || g === null) { report.ok(false, 'both tabs are present'); return; }
			fromBlank = Math.min(fromBlank, b);
			fromGeo = Math.min(fromGeo, g);
		}

		report.ok(fromGeo < BOUND_MS,
			`arriving at Net3 from the lat/lon project is prompt`, `${fromGeo} ms (bound ${BOUND_MS})`);
		report.ok(fromGeo < fromBlank * RATIO + 500,
			'...and costs about what arriving from a blank XY project costs',
			`from lat/lon ${fromGeo} ms vs from blank ${fromBlank} ms`);
		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors.join(' | '));
	} finally { await a.close(); }
};

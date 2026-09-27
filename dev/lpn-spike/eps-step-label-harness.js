// A TIME STEP WRITES THE NEW NUMBERS INTO THE LABELS; PLACEMENT WAITS FOR THE CLOCK TO STOP (R-315).
// Run with:
//   node dev/lpn-spike/eps-step-label-harness.js
//
// Tom, 2026-09-26: *"It's very sluggish. My browser froze while advancing through EPS time steps. It
// eventually caught up. But we may want to delay/debounce label placement unless we succeed in
// making it a lot faster."*
//
// **AGAINST THE REAL PAGE, IN A REAL CHROMIUM, ON THE GALLERY'S NET3 (NOVATO).** What froze him is
// forced layout and the placement search, which node does not do; lpn-dom-stub.js would report a
// tenth of it. The example opens from the wall, zoomed in until its labels show, and its 24-hour
// run is stepped with the transport's own Step forward button and played with its own Play.
//
// Measured when this was written (headless Chromium, Net3 zoomed in, ID/demand/head/pressure/
// elevation and flow/velocity on), 24 steps clicked 150 ms apart:
//   before: every step blocked the page 300-1,270 ms (it ran the whole placement pass), and Play
//           at 4x took 17 s to show 24 hours that should take 2.4 s
//   after:  the longest step blocked 61-150 ms, Play at 4x took 2.6 s, and ONE placement pass of
//           ~0.7 s ran after the clock stopped
//
// **THE BAR IS A RATIO, NOT A STOPWATCH**, because this runs beside other agents' check_all runs
// and absolute milliseconds swing 2-3x with the load (the same master build measured 527 ms and
// 1,274 ms a step an hour apart). What does not swing is the proportion: a step must cost at most
// STEP_RATIO of one full placement pass measured in the same browser a moment later. Before the
// fix a step WAS a full pass (ratio ~1); after it, 0.09-0.2. 0.4 is double the worst seen.
//
//   1. Stepping: each step's numbers are on screen the instant it lands (labels change), no step
//      blocks more than STEP_RATIO of a placement pass, and exactly the placement is left to do.
//   2. After the clock stops, the placement pass runs once, and what it draws says the same
//      numbers the step wrote -- the fast path and the full pass agree, high/low marks included.
//   3. Play at 4x: the run plays through in at most PLAY_RATIO of what 24 placement passes cost.
//
// **RUN IT DIRECTLY -- DO NOT PREFIX IT WITH `flock`.** It locks /tmp/engcalcs-browser.lock itself
// by re-executing under flock, like table-divider-align-harness.js; an outer flock would deadlock.
// (It launches chromium through playwright, which is what makes run_harnesses.sh run it alone.)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_EPS_STEP_LABEL_LOCKED';
const NAME = 'eps-step-label-harness';
const STEP_RATIO = 0.4;
const PLAY_RATIO = 0.5;
const STEPS = 24;

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// Every data label's glyphs, keyed by what it labels: [text, class] per tspan.
function labelTexts(page) {
	return page.evaluate(() => {
		const out = {};
		document.querySelectorAll('#lpn_canvas text.lpn-lbl').forEach((e, i) => {
			const k = e.getAttribute('data-nodelbl') !== null ? 'n:' + e.getAttribute('data-nodelbl')
				: e.getAttribute('data-linklbl') !== null ? 'l:' + e.getAttribute('data-linklbl') + (e.getAttribute('data-repeat') !== null ? '#' + e.getAttribute('data-repeat') : '')
					: e.getAttribute('data-custlbl') !== null ? 'c:' + e.getAttribute('data-custlbl') : null;
			if (!k) { return; }
			out[k] = Array.from(e.childNodes).map((t) => [t.textContent, (t.getAttribute && t.getAttribute('class')) || '']);
		});
		return out;
	});
}
const now = (page) => page.evaluate(() => performance.now());
const longTasks = (page) => page.evaluate(() => window.__ecLongTasks.slice());
const clearLongTasks = (page) => page.evaluate(() => { window.__ecLongTasks.length = 0; });
const longest = (a) => a.reduce((m, e) => Math.max(m, e.d), 0);
// Waits until the page has been quiet for QUIET ms after `from` (a performance.now() reading): no
// long task running or ending inside that window. A placement pass is seconds on a loaded machine,
// and its long-task entry is only delivered once it ENDS, so a fixed wait would read "no pass" off
// a pass still running.
async function quietAfter(page, from, quiet) {
	for (let i = 0; i < 120; i++) {
		await page.waitForTimeout(250);
		const st = await page.evaluate(() => [performance.now(), window.__ecLongTasks.slice()]);
		const lastEnd = st[1].filter((e) => e.s + e.d >= from).reduce((m, e) => Math.max(m, e.s + e.d), from);
		if (st[0] - lastEnd >= quiet) { return; }
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME);
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.openExampleCard(await a.lang('lpn_ex_net3_world_title'));
		await a.settle(1500);
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });

		// Wait for the 24-hour run, then zoom in until the labels are drawn, as a reader would.
		let frames = 0;
		for (let i = 0; i < 60 && frames < 2; i++) {
			frames = await page.evaluate(() => EngCalcs.lpnTimeRunState().frames);
			if (frames < 2) { await page.waitForTimeout(500); }
		}
		ok('the example ran its extended period', frames === STEPS + 1, frames + ' frames');
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		await page.mouse.move(c.x + c.w / 2, c.y + c.h / 2);
		for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, -240); await a.settle(60); }
		await a.settle(2500);
		const shown = await page.evaluate(() => !document.getElementById('lpn_canvas').classList.contains('lpn-labels-hidden')
			&& document.querySelectorAll('#lpn_canvas text[data-nodelbl]').length);
		ok('zoomed in, the data labels are drawn', !!shown, shown + ' node labels');
		await page.evaluate(() => {
			window.__ecLongTasks = [];
			new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__ecLongTasks.push({ s: e.startTime, d: e.duration })))
				.observe({ type: 'longtask', buffered: false });
		});

		console.log('\n--- 1. stepping: the numbers land at once, the placement waits ---');
		const step = 'document.querySelector(\'button[data-icon="step-fwd"]\')';
		let before = await labelTexts(page), changedEvery = true, stepMs = [];
		for (let k = 0; k < STEPS; k++) {
			stepMs.push(await page.evaluate('(function(){ var t0 = performance.now(); ' + step + '.click(); return performance.now() - t0; })()'));
			const after = await labelTexts(page);
			const changed = Object.keys(after).filter((id) => before[id] && JSON.stringify(before[id]) !== JSON.stringify(after[id])).length;
			if (!changed) { changedEvery = false; console.log('      step ' + (k + 1) + ': no label changed'); }
			before = after;
			await page.waitForTimeout(150);
		}
		const tStop = await now(page);
		const atEnd = await page.evaluate(() => EngCalcs.lpnTimeNow());
		ok('all ' + STEPS + ' steps were taken', atEnd === 86400, 'clock at ' + atEnd + ' s');
		ok('every step changed what the labels say, before any placement ran', changedEvery);
		// The click handler's own time is the step: the frame is applied synchronously inside it, so
		// a step that ran the placement pass shows it here. Long tasks in the window are NOT used, so
		// a settle that a loaded machine lets fire between two clicks is not charged to a step.
		const stepWorst = Math.max.apply(null, stepMs);
		// Read straight after the LAST click, before the settle timer could have fired.
		const stepped = before;

		console.log('\n--- 2. after the clock stops, one placement pass, and it agrees ---');
		await quietAfter(page, tStop, 2000);
		const settleTasks = (await longTasks(page)).filter((e) => e.s >= tStop);
		const pass = longest(settleTasks);
		ok('a placement pass ran once the clock stopped', pass > 0, settleTasks.length + ' long task(s), longest ' + pass.toFixed(0) + ' ms');
		console.log('      longest step blocked the page ' + stepWorst.toFixed(0) + ' ms; one placement pass ' + pass.toFixed(0) + ' ms');
		ok('no step blocks more than ' + STEP_RATIO + ' of a placement pass', pass > 0 && stepWorst <= STEP_RATIO * pass,
			'ratio ' + (pass ? (stepWorst / pass).toFixed(2) : 'n/a'));
		const s1 = stepped, s2 = await labelTexts(page);
		let compared = 0, same = 0;
		const differ = [];
		Object.keys(s2).forEach((id) => {
			if (!s1[id] || s1[id].length !== s2[id].length) { return; }
			compared++;
			if (JSON.stringify(s1[id]) === JSON.stringify(s2[id])) { same++; } else if (differ.length < 3) { differ.push(id + ' ' + JSON.stringify(s1[id]) + ' vs ' + JSON.stringify(s2[id])); }
		});
		ok('most labels kept their shape through the placement pass', compared >= 0.8 * Object.keys(s2).length, compared + ' of ' + Object.keys(s2).length);
		ok('where the shape held, the step wrote exactly what the placement pass wrote', compared > 0 && same === compared,
			same + '/' + compared + (differ.length ? '  ' + differ.join(' | ') : ''));

		console.log('\n--- 3. Play at 4x runs at the speed it says ---');
		const g0 = await now(page);
		await page.evaluate(() => EngCalcs.lpnTimeGoTo(0));
		await quietAfter(page, g0, 2000);
		await page.evaluate(() => { const s = document.getElementById('lpn_time_speed'); s.value = '4'; s.dispatchEvent(new Event('change')); });
		await clearLongTasks(page);
		const p0 = await now(page);
		await page.evaluate(() => document.querySelector('button[data-icon="play"]').click());
		let pEnd = null;
		for (let i = 0; i < 600 && pEnd === null; i++) {
			await page.waitForTimeout(100);
			const st = await page.evaluate(() => [document.querySelector('button[data-icon="play"], button[data-icon="pause"]').getAttribute('aria-pressed') === 'true', EngCalcs.lpnTimeNow(), performance.now()]);
			if (!st[0] && st[1] === 86400) { pEnd = st[2]; }
		}
		ok('Play reached the end of the run', pEnd !== null);
		await quietAfter(page, pEnd, 2000);
		const playTasks = await longTasks(page);
		const during = playTasks.filter((e) => e.s < pEnd), afterPlay = playTasks.filter((e) => e.s >= pEnd);
		const playMs = pEnd - p0;
		console.log('      24 hours at 4x took ' + (playMs / 1000).toFixed(1) + ' s (2.4 s at full speed); longest freeze while playing '
			+ longest(during).toFixed(0) + ' ms; placement after it stopped ' + longest(afterPlay).toFixed(0) + ' ms');
		ok('Play took at most ' + PLAY_RATIO + ' of what ' + STEPS + ' placement passes cost', pass > 0 && playMs <= PLAY_RATIO * STEPS * pass,
			'ratio ' + (pass ? (playMs / (STEPS * pass)).toFixed(2) : 'n/a'));
		ok('no placement pass ran while Play was running', longest(during) <= STEP_RATIO * pass,
			longest(during).toFixed(0) + ' ms');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

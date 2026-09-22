// HOW LONG DOES A TABLE TAB TAKE TO APPEAR, IN A REAL CHROME? (Task 690, R-111)
//
//   flock /tmp/engcalcs-browser.lock node dev/browser-pass/tables-probe.js [lpn_ex_net3_title] [--solve] [--profile]
//
// Tom, 2026-09-21: *"Switching to Junctions the first time and some subsequent times delayed about
// 3 seconds or more. This is the worst issue I found."*
//
// **A PROBE, NOT A SPEC: it asserts nothing and prints what the page did.** The bound that DOES
// assert lives in specs/tables.js; this is the instrument that tells you where the time went.
//
// WHAT "HOW LONG" MEANS HERE. The click handler returning is not what a person waits for: style,
// layout and paint run after it, and anything the handler schedules (a timer, a second frame) runs
// after THAT. So each switch is timed from the click to the first animation frame after which the
// page stays quiet -- no frame gap over 50 ms -- for half a second, and the longest single frame gap
// in that window is printed beside it. With --profile a CPU profile is taken around each switch
// and the self-time leaders printed with their script and line.
//
// Absolute milliseconds are this machine's, not Tom's. The SHAPE and the before/after ratio travel.
//
// WHAT IT FOUND, 2026-09-22, lpn_ex_net3_title (the XY Net3) with --solve, three runs each, on a shared 4-core box:
//   * BEFORE: a switch back to Junctions (92 rows x 14 columns) took 279-560 ms, median ~360.
//     Every show() threw the table away and built it again, then the browser re-derived style and
//     layout for ~1,300 controls because `display: none` had discarded both. The trace split was
//     roughly a third each script-plus-forced-layout, layout, and paint.
//   * AFTER: 17-97 ms, median ~60. show() refills in place (and writes only the cells that
//     changed), and a hidden table keeps its rendering (`content-visibility: hidden`), so a switch
//     back costs a paint and nothing else. The FIRST showing of a table is still a build: 321-378 ms
//     for Pipes (117 x 17), against 428-543 before.
// Under load the before case ran past a second on single switches here (1,192 ms once), which is
// the likeliest reading of Tom's "3 seconds": the same work, on a machine busy with other things.

const path = require('path');
const env = require('./lib/env.js');
const { Session } = require('./lib/session.js');

// The example's card title, or its language key (lpn_ex_*_title), which is the default's form.
const EXAMPLE = process.argv.slice(2).find(a => !a.startsWith('--')) || 'lpn_ex_net3_world_title';
const PROFILE = process.argv.includes('--profile');
// --solve presses Calculate first, so the tables carry their RESULT columns as Tom's do.
const SOLVE = process.argv.includes('--solve');
// --trace records a DevTools timeline around each switch and sums the main thread's time by kind
// (script, style, layout, paint), which is the split a CPU profile's "(program)" hides.
const TRACE = process.argv.includes('--trace');
// --width=N sets the window width, because a narrower window wraps the pane's tab strip.
const WIDTH = Number((process.argv.find(a => a.startsWith('--width=')) || '=0').split('=')[1]) || 0;
// --throttle=N slows the CPU N times, to see which costs grow with a slower machine.
const THROTTLE = Number((process.argv.find(a => a.startsWith('--throttle=')) || '=1').split('=')[1]) || 1;
const ORDER = ['junctions', 'pipes', 'junctions', 'pumps', 'junctions', 'pipes', 'junctions'];

// Runs INSIDE the page: click the tab, then watch animation frames until the page has been quiet
// for QUIET ms. Returns when-quiet and the worst gap.
const SWITCH = async ([id, QUIET]) => {
	const b = document.getElementById('lpn_pane_tab_' + id);
	if (!b) { return { error: 'no tab ' + id }; }
	const t0 = performance.now();
	b.click();
	const tClick = performance.now() - t0;
	let last = performance.now(), worst = 0, settledAt = null, quietSince = last;
	await new Promise(res => {
		function frame(now) {
			const gap = now - last;
			if (gap > worst) { worst = gap; }
			if (gap > 50) { quietSince = now; }
			last = now;
			if (now - quietSince >= QUIET || now - t0 > 15000) { settledAt = quietSince; res(); return; }
			requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	});
	const host = document.getElementById('lpn_pane_' + id);
	return {
		click: Math.round(tClick),
		visible: Math.round(settledAt - t0),
		worstFrame: Math.round(worst),
		rows: host ? host.querySelectorAll('tbody tr').length : -1,
		cols: host ? host.querySelectorAll('thead th').length : -1,
		heads: host ? [...host.querySelectorAll('thead th')].map(t => t.textContent.trim().slice(0, 14)).join('|') : ''
	};
};

(async function main() {
	const playwright = require('./node_modules/playwright-core');
	const server = await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const s = await Session.open(browser, 'A', WIDTH ? { viewport: { width: WIDTH, height: 900 } } : undefined);
		await s.goto('Looped-Network.php');
		await s.openExampleCard(/^lpn_ex_/.test(EXAMPLE) ? await s.lang(EXAMPLE) : EXAMPLE);
		await s.settle(3000);
		const nodes = await s.nodeCount();
		console.log(`${EXAMPLE}: ${nodes} nodes drawn; status: ${(await s.status() || '').slice(0, 120)}`);
		if (SOLVE) {
			const RUN = await s.lang('lpn_time_run');
			console.log('  Calculate: ' + await s.page.evaluate((t) => {
				const b = [...document.querySelectorAll('button')].find(x =>
					(x.textContent || '').trim() === t || x.getAttribute('aria-label') === t);
				if (b) { b.click(); return 'pressed'; }
				return 'no button';
			}, RUN));
			await s.settle(4000);
			console.log('  after Calculate: ' + (await s.status() || '').slice(0, 120));
		}
		// Open the pane on a drawing tab first, so every table switch below is a real switch.
		await s.page.evaluate(() => { const b = document.getElementById('lpn_pane_btn'); if (b) { b.click(); } });
		await s.settle(500);
		await s.page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_profile'); if (b) { b.click(); } });
		await s.settle(1500);
		const cdp = (PROFILE || TRACE || THROTTLE > 1) ? await s.context.newCDPSession(s.page) : null;
		if (THROTTLE > 1) { await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE }); }
		if (cdp) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); }
		for (let i = 0; i < ORDER.length; i++) {
			if (PROFILE) { await cdp.send('Profiler.start'); }
			const traceEvents = [];
			if (TRACE) {
				cdp.removeAllListeners('Tracing.dataCollected');
				cdp.on('Tracing.dataCollected', (e) => { traceEvents.push(...e.value); });
				await cdp.send('Tracing.start', { categories: 'devtools.timeline,blink', transferMode: 'ReportEvents' });
			}
			const r = await s.page.evaluate(SWITCH, [ORDER[i], 500]);
			let top = '';
			if (PROFILE) {
				const { profile } = await cdp.send('Profiler.stop');
				const byId = new Map(profile.nodes.map(n => [n.id, n])), self = new Map();
				profile.samples.forEach((sid, k) => {
					const n = byId.get(sid); if (!n) { return; }
					const f = n.callFrame, key = (f.functionName || '(anon)') + ' ' +
						path.basename(f.url || '') + ':' + (f.lineNumber + 1);
					self.set(key, (self.get(key) || 0) + (profile.timeDeltas[k] || 0) / 1000);
				});
				top = '\n      ' + [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
					.map(([k, v]) => k + ' ' + v.toFixed(0) + 'ms').join('; ');
			}
			if (TRACE) {
				const done = new Promise((res) => cdp.once('Tracing.tracingComplete', res));
				await cdp.send('Tracing.end');
				await done;
				const sums = {};
				traceEvents.filter(e => e.ph === 'X' && e.dur && /^(FunctionCall|EvaluateScript|UpdateLayoutTree|Layout|Paint|PrePaint|Layerize|RecalculateStyles|HitTest|ParseHTML|EventDispatch)$/.test(e.name))
					.forEach(e => { sums[e.name] = (sums[e.name] || 0) + e.dur / 1000; });
				top += '\n      trace: ' + Object.entries(sums).sort((a, b) => b[1] - a[1])
					.map(([k, v]) => k + ' ' + v.toFixed(0) + 'ms').join('; ');
			}
			delete r.heads;
			console.log(`  ${i + 1}. -> ${ORDER[i].padEnd(9)} ${JSON.stringify(r)}${top}`);
			await s.settle(800);
		}
		if (s.errors.length) { console.log('  PAGE ERRORS: ' + s.errors.slice(0, 3).join(' | ')); }
		await s.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
}());

// A TANK'S DEPTH IN THE PROPERTIES BOX GRAPH (Tom, 2026-10-14: "It would be really nice for the Time Series
// graphs for Tanks to be able to show depth."). The Time series tab already offered Depth (Task 783); the
// graph at the foot of the Properties box (PG_FIELDS) did not.
//   node dev/lpn-spike/tank-depth-graph-browser-harness.js   (takes the browser lock itself)
// Real Chromium, Net1 (tank 2, bottom elevation 850 ft) and its SI twin, EPANET run finished: the
// Properties graph for the tank offers Depth; choosing it plots, at every reporting step, the frame's head
// minus the tank bottom, in the LENGTH unit of the project (read from the dot tooltips); a junction's
// Properties graph does not offer Depth; the Time series tab agrees with the Properties graph.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TANKDG_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('tank-depth-graph-browser-harness: NOT RUN -- lock held 180 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		for (const [key, toLen, bottomSI] of [['lpn_ex_net1_title', 1 / 0.3048, 850 * 0.3048], ['lpn_ex_net1_si_title', 1, null]]) {
			const a = await Session.open(browser, 'tank-depth-graph', { viewport: { width: 1500, height: 950 } });
			await a.goto('Looped-Network.php');
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.openExampleCard(await a.lang(key));
			await a.settle(800);
			console.log('\n--- ' + key + ' ---');
			await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
			const depthName = await a.lang('lpn_result_depth');
			const openNode = async (id) => {
				const bb = await (await a.page.$('.lpn-node-hit[data-node="' + id + '"]')).boundingBox();
				await a.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
				await a.settle(900);
			};
			const options = () => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pgraph_field option')).map((o) => [o.value, o.textContent]));

			let opts;
			await openNode('2');
			opts = await options();
			console.log('  tank 2 offers', JSON.stringify(opts.map((o) => o[1])));
			ok('the tank\'s Properties graph offers Depth', opts.some((o) => o[0] === 'depth' && o[1] === depthName));
			await a.page.evaluate(() => { const s = document.getElementById('lpn_pgraph_field'); s.value = 'depth'; s.dispatchEvent(new Event('change', { bubbles: true })); });
			await a.settle(700);
			const chart = await a.page.evaluate(() => {
				const host = document.getElementById('lpn_pgraph_chart');
				return { text: host.textContent, lines: host.querySelectorAll('.lpn-ts-line').length,
					dots: Array.from(host.querySelectorAll('.lpn-ts-dot title')).map((t) => t.textContent) };
			});
			ok('a line is drawn, with the quantity named on the axis', chart.lines >= 1 && chart.text.indexOf(depthName) >= 0, chart.text.slice(0, 90));
			const frames = await a.page.evaluate(() => EngCalcs.lpnTimeRunFrames().map((f) => ({ t: f.t, head: f.heads['2'], level: f.levels && f.levels['2'] })));
			ok('one dot per reporting step', chart.dots.length === frames.length, chart.dots.length + ' dots, ' + frames.length + ' frames');
			let bad = 0, moved = new Set(), checked = 0, maxErr = 0;
			chart.dots.forEach((d, i) => {
				const v = parseFloat(d.trim().split(/\s+/).pop()), f = frames[i];
				const want = (bottomSI === null ? f.head - 0 : f.head - bottomSI) * toLen;
				// SI twin: bottom is read from the project, so compare to the engine's own level instead.
				const want2 = f.level * toLen;
				const err = Math.abs(v - (bottomSI === null ? want2 : want));
				maxErr = Math.max(maxErr, err); checked++; moved.add(v);
				if (err > 0.011) { bad++; }
				if (bottomSI !== null) { if (Math.abs(v - want2) > 0.011) { bad++; } }
			});
			ok('every plotted depth equals head minus the tank bottom (' + checked + ' steps, worst error ' + maxErr.toFixed(4) + ')', bad === 0 && checked > 3);
			ok('the depth moves over the run (not a flat line)', moved.size > 3, moved.size + ' distinct values');

			// The Time series tab agrees (it already offered Depth).
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(500);
			await a.page.evaluate(() => document.getElementById('lpn_pane_tab_timeseries').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await a.settle(800);
			await a.page.evaluate(() => document.getElementById('lpn_ts_add').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await a.settle(400);
			await a.page.evaluate(() => {
				const sel = document.getElementById('lpn_ts_quantity'); sel.value = 'depth'; sel.dispatchEvent(new Event('change', { bubbles: true }));
			});
			await a.settle(700);
			const tab = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ts_chart .lpn-ts-dot title')).map((t) => t.textContent)
				.filter((t) => t.trim().indexOf('2 ') === 0).map((t) => t.trim().split(/\s+/).pop()));
			ok('the Time series tab plots the same numbers for tank 2', tab.length === chart.dots.length &&
				tab.every((v, i) => v === chart.dots[i].trim().split(/\s+/).pop()), tab.length + ' dots');
			// A junction offers no Depth.
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(300);
			await openNode('10');
			opts = await options();
			ok('a junction\'s Properties graph does not offer Depth', opts.length > 0 && !opts.some((o) => o[0] === 'depth'), JSON.stringify(opts.map((o) => o[0])));

			await a.page.keyboard.press('Escape');
			await a.page.mouse.click(5, 300);
			await a.settle(500);
			ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
			await a.close();
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' tank depth graph check(s) FAILED' : '\nTank depth graph harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

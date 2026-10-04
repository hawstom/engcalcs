// THE PROPERTIES BOX, WITH ITS GRAPH, RUNS THE FULL HEIGHT OF THE MAP.
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/properties-box-fill-harness.js
//
// Tom, 2026-10-03 (browser pass on feat/property-graph, Task 637): *"the one tweak that I would
// suggest is to put the top of Properties at the top of the map and its bottom at the bottom of
// the screen."* Real headless Chromium, empty storage, EPA's Net1 example (an extended-period run,
// so a pipe's box carries the graph). At 1280x800 and 1920x1080: box top == map top and box
// bottom == window.innerHeight (+-1 px). At 390x844: the box is fully on screen.

const path = require('path');
const { Session } = require('../browser-pass/lib/session');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const measure = (page) => page.evaluate(() => {
	const p = document.getElementById('lpn_popup').getBoundingClientRect();
	const m = document.getElementById('lpn_canvas').getBoundingClientRect();
	const g = document.getElementById('lpn_popup_graph');
	return { top: p.top, bottom: p.bottom, left: p.left, right: p.right, w: p.width, mapTop: m.top,
		vh: window.innerHeight, vw: window.innerWidth,
		graph: !!g && g.style.display !== 'none' && g.getBoundingClientRect().height > 0,
		graphBottom: g ? g.getBoundingClientRect().bottom : 0 };
});

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		for (const [vw, vh] of [[1280, 800], [1920, 1080], [390, 844]]) {
			console.log('\n' + vw + 'x' + vh);
			const a = await Session.open(browser, 'F-' + vw);
			const page = a.page;
			await page.setViewportSize({ width: vw, height: vh });
			await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
			await a.goto('Looped-Network.php');
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(800);
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			const pts = await page.evaluate(() => Array.prototype.slice.call(document.querySelectorAll('.lpn-link-pipe'))
				.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
			let m = null;
			for (const at of pts) {
				await page.mouse.click(at.x, at.y); await a.settle(700);
				m = await measure(page);
				if (m.w > 0 && m.graph) { break; }
			}
			ok('a pipe opens the box with the graph at its foot', !!m && m.w > 0 && m.graph, JSON.stringify(m));
			if (m && m.w > 0) {
				{
					ok('its top is the top of the map', Math.abs(m.top - m.mapTop) <= 1, m.top + ' vs ' + m.mapTop);
					ok('its bottom is the bottom of the window', Math.abs(m.bottom - m.vh) <= 1, m.bottom + ' vs ' + m.vh);
				}
				ok('it is fully on screen', m.top >= -1 && m.bottom <= m.vh + 1 && m.left >= -1 && m.right <= m.vw + 1,
					JSON.stringify(m));
				// The graph is the foot of a body that scrolls inside the box, so it need not fit; it must be reachable.
				ok('and the box scrolls to the graph', await page.evaluate(() => {
					const b = document.querySelector('#lpn_popup .lpn-popover-body');
					return !!b && getComputedStyle(b).overflowY !== 'visible';
				}));
			}
			await a.close();
		}
	} finally {
		await browser.close(); env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

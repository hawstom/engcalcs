// THE PROPERTIES BOX OPENS AT ITS NORMAL SIZE FOR EVERY ELEMENT TYPE AND DOES NOT RESIZE WHEN MOVED.
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/properties-box-width-harness.js
//
// Tom, 2026-10-03 (browser pass on feat/property-graph): *"Selecting a pump or pipe (but not a
// junction or reservoir) opens properties narrow ... and full height ... And when I move the box,
// it expands ... and contracts ... automatically. Once I manually size it, it stops acting like
// that."* The box is `position: fixed` with `width: auto`, so the browser sized it to the room
// between its left edge and the window's right edge: opened near the right edge, or dragged there,
// it squeezed, its fields wrapped and it grew tall. And the ResizeObserver recorded every automatic
// size as a size the reader had chosen. Real headless Chromium, EMPTY storage (a fresh context),
// a window about the size of Tom's at 125% scaling, EPA's Net3 example.

const path = require('path');
const { Session } = require('../browser-pass/lib/session');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const KINDS = [['pipe', '.lpn-link-pipe'], ['pump', '.lpn-link-pump'], ['junction', '.lpn-node-junction']];

const rect = (page) => page.evaluate(() => {
	const r = document.getElementById('lpn_popup').getBoundingClientRect();
	return { l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), y: r.top + 8, x: r.left + r.width / 2 };
});
async function dragBy(page, a, dx) {
	const r = await rect(page);
	await page.mouse.move(r.x, r.y); await page.mouse.down();
	await page.mouse.move(r.x + dx / 2, r.y, { steps: 4 }); await page.mouse.move(r.x + dx, r.y, { steps: 4 });
	await page.mouse.up(); await a.settle(400);
	return rect(page);
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		for (const [kind, sel] of KINDS) {
			console.log('\n' + kind + ', opened at the right-most one on the map');
			const a = await Session.open(browser, 'A-' + kind);   // a fresh context: empty storage
			const page = a.page;
			await page.setViewportSize({ width: 1229, height: 690 });
			await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
			await a.goto('Looped-Network.php');
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
			await a.settle(500);
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			// The right-most candidates first (the squeeze is worst there); one that cannot be hit is skipped.
			const pts = await page.evaluate((s) => Array.prototype.slice.call(document.querySelectorAll(s))
				.sort((p, q) => q.getBoundingClientRect().x - p.getBoundingClientRect().x).slice(0, 6)
				.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }), sel);
			for (const at of pts) {
				await page.mouse.click(at.x, at.y); await a.settle(600);
				if ((await rect(page)).w > 0) { break; }
			}
			const first = await rect(page);
			const hasGraph = await page.evaluate(() => {
				const g = document.getElementById('lpn_popup_graph'); return !!g && g.style.display !== 'none';
			});
			ok('the box is open, with the graph at its foot', first.w > 0 && hasGraph, JSON.stringify(first));
			// What the box measures when the whole window is free to spread in: its normal size.
			const normal = await dragBy(page, a, -first.l);
			ok('it opened at its normal width, not squeezed by the right edge',
				Math.abs(first.w - normal.w) <= 2, first.w + ' opened, ' + normal.w + ' with room');
			ok('it opened at its normal height (the full height of the map, with the graph)',
				Math.abs(first.h - normal.h) <= 2,
				first.h + ' opened, ' + normal.h + ' with room');
			ok('and that width is a real box, not a sliver', normal.w >= 300, String(normal.w));
			for (const dx of [250, 300, 300, -400]) {
				const q = await dragBy(page, a, dx);
				ok('moving it ' + (dx > 0 ? 'right' : 'left') + ' by ' + Math.abs(dx) + ' leaves its size alone',
					Math.abs(q.w - normal.w) <= 1 && Math.abs(q.h - normal.h) <= 1,
					normal.w + 'x' + normal.h + ' -> ' + q.w + 'x' + q.h);
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

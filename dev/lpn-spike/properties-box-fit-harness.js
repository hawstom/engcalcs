// THE PROPERTIES BOX OPENS NO WIDER THAN IT NEEDS TO AVOID ALL BUT THE 5%-ILE OF ROWS WRAPPING.
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/properties-box-fit-harness.js
//
// Tom, 2026-10-03: *"I think that the properties box is opening too wide, and I would like it to
// be initially no wider than needed to avoid all but the 5%-ile (1 line in 20 for this particular
// situation) wrapping."* On open, with no size the reader dragged: at most 5% of the rows wrap, a
// few pixels narrower would break that (so the width is minimal), and selecting another element
// while it is open leaves the width alone. Real headless Chromium, empty storage, EPA's Net3.

const path = require('path');
const { Session } = require('../browser-pass/lib/session');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const KINDS = [['junction', '.lpn-node-junction'], ['pipe', '.lpn-link-pipe'], ['pump', '.lpn-link-pump'], ['tank', '.lpn-node-tank']];

// Rows (between <br>s) that are taller at width w than with the window to spread in.
const WRAP = (w) => {
	const popup = document.getElementById('lpn_popup'), f = document.getElementById('lpn_popup_fields');
	const keep = popup.style.width;
	function rows() {
		const out = []; let start = 0; const k = f.childNodes;
		function cut(a, b) {
			if (b <= a) { return; }
			const rg = document.createRange(); rg.setStart(f, a); rg.setEnd(f, b);
			const r = rg.getBoundingClientRect();
			if (r.height > 0) { out.push(r.height); }
		}
		for (let i = 0; i < k.length; i++) { if (k[i].nodeName === 'BR') { cut(start, i); start = i + 1; } }
		cut(start, k.length);
		return out;
	}
	const names = [];
	(function () {
		let t = ''; const k = f.childNodes;
		for (let i = 0; i <= k.length; i++) {
			if (i === k.length || k[i].nodeName === 'BR') { if (t.trim()) { names.push(t.trim().replace(/\s+/g, ' ').slice(0, 50)); } t = ''; }
			else { t += k[i].textContent; }
		}
	})();
	popup.style.width = '2400px'; const nat = rows();
	if (window.__dumpRows) { window.__dumpRows(); }
	popup.style.width = w + 'px'; const now = rows();
	popup.style.width = keep;
	let wrapped = 0; const which = [];
	for (let i = 0; i < nat.length; i++) { if (now[i] > nat[i] + 2) { wrapped++; which.push(i); } }
	return { rows: nat.length, wrapped, which: which.map((i) => names[i]) };
};
const info = (page) => page.evaluate(() => {
	const p = document.getElementById('lpn_popup'), r = p.getBoundingClientRect();
	return { w: Math.round(r.width * 10) / 10, h: Math.round(r.height), title: (document.getElementById('lpn_popup_title') || {}).textContent };
});
async function openKind(a, page, sel) {
	const pts = await page.evaluate((s) => Array.prototype.slice.call(document.querySelectorAll(s))
		.sort((p, q) => q.getBoundingClientRect().x - p.getBoundingClientRect().x).slice(0, 8)
		.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }), sel);
	for (const at of pts) {
		await page.mouse.click(at.x, at.y); await a.settle(600);
		if ((await info(page)).w > 0) { return true; }
	}
	return false;
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		for (const [kind, sel] of KINDS) {
			console.log('\n' + kind);
			const a = await Session.open(browser, 'F-' + kind);
			const page = a.page;
			await page.setViewportSize({ width: 1229, height: 690 });
			await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
			await a.goto('Looped-Network.php');
			await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
			await a.settle(500);
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			const opened = await openKind(a, page, sel);
			ok('the Properties box is shown', opened);
			if (!opened) { await a.close(); continue; }
			const o = await info(page);
			const at = await page.evaluate(WRAP, o.w);
			console.log('  WIDTH ' + kind + ' ' + o.w + ' px (' + at.wrapped + ' of ' + at.rows + ' rows wrap: ' + at.which.join(' | ') + ')');
			const allow = (n) => Math.max(1, Math.floor(0.05 * n));
			ok('at most 5% of the rows (and at least one) wrap on open', at.wrapped <= allow(at.rows), at.wrapped + '/' + at.rows);
			if (kind === 'pump') { ok('the pump opens well under the 652 px its prose note needs', o.w < 500, String(o.w)); }
			if (kind === 'pipe' || kind === 'pump') {
				// Minimal: the box is as wide as its grid asks for and no wider. On the row grid (Task 828) nothing re-wraps as the
				// box narrows, and since the borderless-cell change (box-design, 2026-10-27) the value track is no longer
				// max-content, so 8 px less no longer scrolls the grid sideways. What the open width is held to now: the grid's
				// own max-content width plus the box's chrome (popupFitWidth), within 4 px (rounding and the 2 px margin
				// allowance).
				const min = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('lpn_popup')).minWidth));
				const ask = await page.evaluate(() => {
					const popup = document.getElementById('lpn_popup'), body = popup.querySelector('.lpn-popover-body'), keep = body.style.width;
					const chrome = popup.getBoundingClientRect().width - body.getBoundingClientRect().width;
					body.style.width = 'max-content';
					const w = body.getBoundingClientRect().width;
					body.style.width = keep;
					return { asks: Math.round(w + chrome), popup: Math.round(popup.getBoundingClientRect().width) };
				});
				ok('the box is as wide as its grid asks for (within 4 px), or at the CSS minimum',
					Math.abs(ask.popup - ask.asks) <= 4 || ask.popup <= min + 1, JSON.stringify(ask) + '; min ' + min);
			}
			// Selecting another element while it is open does not change the width.
			const other = await page.evaluate(() => {
				const e = document.querySelector('.lpn-node-junction'); const r = e.getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
			});
			await page.mouse.click(other.x, other.y); await a.settle(600);
			const o2 = await info(page);
			ok('clicking another element leaves the width alone', o2.w === o.w || o2.w === 0, o.w + ' -> ' + o2.w);
			await a.close();
		}
	} finally {
		await browser.close(); env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

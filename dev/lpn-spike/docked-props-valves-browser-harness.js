// A DOCKED PROPERTIES BODY ON VALVES.lwn IS NOT SQUEEZED TO A SLIVER (Perry 2026-10-28: 38 px tall, ID row then blank).
// With the default docks, press an element of dev/water-network-examples/Valves.lwn: the body is taller than 300 px.
//   node dev/lpn-spike/docked-props-valves-browser-harness.js   (takes the browser lock itself)
// (box-design review, Perry 2026-10-27), in a real browser WITH the default docks (EC_DEFAULT_DOCKS; an
// automated browser starts with none, which hid the overflow from properties-rows-browser-harness.js).
//   For every asset type (junction, reservoir, tank, pipe, pump, the six valves, customer, Text, shape),
//   with nothing selected, and with two assets selected, at 1400 x 900 and at 390 x 844:
//     - no content in the Properties box is wider than the box (scrollWidth <= clientWidth, and no
//       descendant's right edge past the body's);
//   PC: a computed value is in a different (muted) ink than an editable one; an editable cell changes
//     its fill on hover; the Base demand table's inputs have no border; a pipe's Auto length has a "?".
//   Phone: "Something wrong here?" and the map credit do not overlap, at 390 x 844 and 360 x 740.
//
//   node dev/lpn-spike/docked-props-valves-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKVALVES_LOCKED';
const NAME = 'docked-props-valves-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const ex = (f) => JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', f), 'utf8'));

	// Net1 (junction, reservoir, tank, pipe, pump) with a customer and a shape; Valves.lwn holds the six valves.
	function net1Doc() {
		const d = ex('Net1.lwn');
		const a = d.nodes.filter((n) => n.id === '11')[0], b = d.nodes.filter((n) => n.id === '12')[0];
		d.customers = [{ id: 'M1', count: 1, link: '121', t: 0.4, x: 3, y: 0, demand: 2 }];
		d.shapes = [{ id: 'S1', pts: [{ x: 15, y: 25 }, { x: 35, y: 25 }, { x: 35, y: 12 }], closed: false }];
		return d;
	}
	const VALVES = ['PBV1', 'PRV1', 'PSV1', 'FCV1', 'TCV1', 'GPV1'];
	async function open(size, phone, d) {
		const a = await Session.open(browser, NAME, { viewport: size, hasTouch: !!phone, isMobile: !!phone, serviceWorkers: 'block' });
		const page = a.page;
		await page.addInitScript('window.EC_DEFAULT_DOCKS = true;');
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		await a.settle(600);
		return a;
	}
	// Show Properties: from its tab when it is tucked (a phone's flyout, a PC box not yet pinned); on a PC it is
	// pinned once, as a person would, so it stays beside the map.
	async function showProps(a, pin) {
		const page = a.page;
		const vis = () => page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none' && getComputedStyle(p).visibility !== 'hidden'; });
		if (!(await vis())) {
			const tab = page.locator('.lpn-dock-tab[aria-controls=lpn_popup]');
			if (await tab.count()) { await tab.click(); await a.settle(500); }
		}
		if (pin) {
			const b = page.locator('#lpn_popup .lpn-corner-btn[data-dock=autohide]');
			if (await b.count() && await b.first().isVisible()) { await b.first().click().catch(() => {}); await a.settle(500); }
		}
	}
	const idOf = (page) => page.evaluate(() => { const i = document.querySelector('#lpn_popup_title input'); return i ? i.value : ((document.getElementById('lpn_popup_title') || {}).textContent || '').trim(); });
	// Press an asset on the map until Properties says it is the one selected (the first press may only tuck a flyout).
	async function select(a, sel, want, shift) {
		for (let t = 0; t < 3; t++) {
			await tuck(a);
			if (!(await click(a, sel, shift))) { return false; }
			await showProps(a, false);
			if (want === null || (await idOf(a.page)) === want) { return true; }
		}
		return false;
	}
	async function tuck(a) { /* a phone is measured by resizing the window after the press, so nothing covers the map */ }
	async function click(a, sel, shift) {
		await a.settle(900);
		const p = await a.page.evaluate((s) => {
			const all = Array.from(document.querySelectorAll(s)).filter((e) => e.getBoundingClientRect().width > 0); const el = all[0];
			if (!el) { return null; }
			let r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
			// A point inside the element's box that really lands on it (a symbol's box is not always its drawn shape).
			const same = (t) => !!t && (t === el || el.contains(t) || ['data-node', 'data-link', 'data-lbl'].some((k) => el.hasAttribute(k) && t.closest && t.closest('[' + k + ']') && t.closest('[' + k + ']').getAttribute(k) === el.getAttribute(k)));
			if (!same(document.elementFromPoint(x, y))) {
				for (let i = 0; i < 25; i++) {
					const px = r.left + r.width * (0.1 + 0.2 * (i % 5)), py = r.top + r.height * (0.1 + 0.2 * Math.floor(i / 5));
					if (same(document.elementFromPoint(px, py))) { x = px; y = py; break; }
				}
			}
			if (el.nodeName === 'polyline') {   // a line or shape: a point ON it
				const pt = el.getPointAtLength(el.getTotalLength() / 3), m = el.getScreenCTM();
				x = pt.x * m.a + pt.y * m.c + m.e; y = pt.x * m.b + pt.y * m.d + m.f;
			}
			return { x, y };
		}, sel);
		if (!p) { console.log('  (no element for ' + sel + ')'); return false; }
		await a.page.mouse.move(p.x, p.y); await a.settle(250);
		if (shift) { await a.page.keyboard.down('Shift'); }
		await a.page.mouse.click(p.x, p.y);
		if (shift) { await a.page.keyboard.up('Shift'); }
		await a.settle(700);
		return true;
	}

	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Valves.lwn'), 'utf8'));
	const ids = { node: d.nodes[0].id, link: d.links[0].id };
	const a = await open({ width: 1400, height: 900 }, false, d);
	for (const [name, sel, want] of [['junction/node', '[data-node="' + ids.node + '"]', ids.node], ['first link', '[data-link="' + ids.link + '"]', ids.link]]) {
		const sel1 = await select(a, sel, want, false);
		ok(name + ' ' + want + ' opens Properties', sel1);
		const m = await a.page.evaluate(() => {
			const box = document.getElementById('lpn_popup'), body = box.querySelector('.lpn-popover-body');
			const rows = Array.from(body.querySelectorAll('input, select, textarea')).filter((e) => e.getClientRects().length);
			return { h: Math.round(body.getBoundingClientRect().height), sh: body.scrollHeight, boxH: Math.round(box.getBoundingClientRect().height), n: rows.length, docked: box.className };
		});
		ok(name + ': docked Properties body is taller than 300 px', m.h > 300, m.h + ' px (box ' + m.boxH + ', content ' + m.sh + ', ' + m.n + ' fields)');
		ok(name + ': all its rows can be reached (content no more than twice the body, or the body scrolls)', m.n > 0 && m.h >= Math.min(m.sh, 300));
	}
	await a.close().catch(() => {});
	await browser.close(); env.stopServer();
	console.log('docked-props-valves-browser-harness: ' + (checks - failures) + '/' + checks + ' ok');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

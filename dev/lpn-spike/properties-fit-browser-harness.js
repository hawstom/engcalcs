// THE PROPERTIES BOX NEVER OVERFLOWS, READ-ONLY IS MUTED, AUTO LENGTH HAS A TIP, THE PHONE FOOTER IS CLEAR
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
//   node dev/lpn-spike/properties-fit-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PROPFIT_LOCKED';
const NAME = 'properties-fit-browser-harness';
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
	// Nothing in the box is wider than the box.
	function fit(page) {
		return page.evaluate(() => {
			const box = document.getElementById('lpn_popup'), body = box.querySelector('.lpn-popover-body');
			const br = body.getBoundingClientRect(), out = [];
			Array.from(body.querySelectorAll('*')).forEach((e) => {
				const r = e.getBoundingClientRect();
				if (r.width > 0 && r.right > br.right + 1.5 && getComputedStyle(e).display !== 'none') { out.push(e.nodeName + '.' + String(e.className).slice(0, 30) + ' +' + Math.round(r.right - br.right)); }
			});
			return { shown: getComputedStyle(box).display !== 'none' && br.width > 0, scroll: body.scrollWidth - body.clientWidth, w: Math.round(br.width), out: out.slice(0, 3), text: (body.textContent || '').trim().slice(0, 40), id: (document.querySelector('#lpn_popup_title input') || {}).value || (document.getElementById('lpn_popup_title') || {}).textContent, cls: box.className.replace(/d-print-none|lpn-popover|lpn-propbox|lpn-dragpanel/g, '').trim() };
		});
	}

	const kinds = [['shape (it has no Properties of its own: the box stays as it was)', '[data-shape="S1"] polyline', null], ['tank', 'path.lpn-node-hit[data-node="2"]', '2'], ['junction', '[data-node="11"]', '11'], ['reservoir', '[data-node="9"]', '9'], ['pipe', '[data-link="10"]', '10'], ['pump', '[data-link="9"]', '9'],
		['customer', '.lpn-meter', 'Customer M1'], ['text', 'text[data-lbl="X2"]', 'Text']];
	for (const mode of [{ name: 'PC 1400x900', size: { width: 1400, height: 900 }, phone: false }, { name: 'phone 390x844', size: { width: 390, height: 844 }, phone: true }]) {
		console.log('\n--- ' + mode.name + ' ---');
		for (const doc of ['net1', 'valves']) {
			const a = await open({ width: 1400, height: 900 }, mode.phone, doc === 'net1' ? net1Doc() : ex('Valves.lwn'));
			const tag = mode.name + ' ';
			const check = async (what, want) => {
				// A phone: the asset was pressed in a wide window (the phone's map is a sliver), then the window is made 390 x 844.
				if (mode.phone) { await a.page.setViewportSize(mode.size); await a.settle(900); await showProps(a, false); }
				const m = await fit(a.page), id = await idOf(a.page);
				if (mode.phone) { await a.page.setViewportSize({ width: 1400, height: 900 }); await a.settle(900); }
				ok(tag + what + ': Properties shows it', want === null || id === want, '"' + id + '"');
				ok(tag + what + ': nothing wider than the box (' + m.w + ' px)', m.shown && m.scroll <= 1 && m.out.length === 0, JSON.stringify(m));
			};
			try {
				await showProps(a, true);
				if (doc === 'net1') {
					await check('nothing selected', null);
					for (const k of kinds) {
						if (await select(a, '#lpn_canvas ' + k[1], k[2])) { await check(k[0], k[2]); } else { ok(tag + k[0] + ': selected on the map', false, 'box says "' + await idOf(a.page) + '"'); }
					}
					await select(a, '#lpn_canvas [data-node="11"]', '11');
					await select(a, '#lpn_canvas [data-node="12"]', '2 selected', true);
					await check('two assets selected', '2 selected');
				} else {
					for (const v of VALVES) {
						if (await select(a, '#lpn_canvas [data-link="' + v + '"]', v)) { await check('valve ' + v, v); } else { ok(tag + 'valve ' + v + ': selected on the map', false); }
					}
				}
			} finally { await a.close(); }
		}
	}


	// ---- cells: read-only is muted, editable answers the pointer, the demand table is borderless, Auto length has a tip ----
	console.log('\n--- cells and the Auto length tip (PC) ---');
	{
		const a = await open({ width: 1400, height: 900 }, false, net1Doc());
		const page = a.page;
		try {
			await showProps(a, true);
			ok('cells: junction 11 selected', await select(a, '#lpn_canvas [data-node="11"]', '11'));
			const c = await page.evaluate(() => {
				const f = document.getElementById('lpn_popup_fields'), vis = (e) => e && e.getClientRects().length;
				const ro = Array.from(f.querySelectorAll('.lpn-grow > span.lpn-gval:not(.lpn-gw-num)')).filter(vis)[0];
				const ed = Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval[type=number]')).filter(vis)[0];
				const ti = Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval[data-gprop="demand"]')).filter(vis)[0];   // sheet-light: the Base demand box (the table is in the Demand categories box)
				ed.__x = 1;
				const r = ed.getBoundingClientRect();
				return { ro: ro ? getComputedStyle(ro).color : null, roText: ro ? ro.textContent : null, ed: getComputedStyle(ed).color, bg: getComputedStyle(ed).backgroundColor, x: r.left + r.width / 2, y: r.top + r.height / 2,
					tbl: ti ? getComputedStyle(ti).borderTopWidth + ' ' + getComputedStyle(ti).backgroundColor : null };
			});
			ok('cells: a computed value is in a different ink from an editable one', c.ro !== null && c.ro !== c.ed, 'computed ' + c.ro + ' (' + c.roText + ') vs editable ' + c.ed);
			await page.mouse.move(c.x, c.y); await a.settle(300);
			const h = await page.evaluate(() => getComputedStyle(Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow > input.lpn-gval[type=number]')).filter((e) => e.getClientRects().length)[0]).backgroundColor);
			ok('cells: an editable cell changes its fill under the pointer', h !== c.bg, c.bg + ' -> ' + h);
			ok('cells: the Base demand box has no border and no fill', c.tbl !== null && /^0px (rgba\(0, 0, 0, 0\)|transparent)/.test(c.tbl), c.tbl);
			ok('cells: pipe 10 selected', await select(a, '#lpn_canvas [data-link="10"]', '10'));
			const t = await page.evaluate(() => {
				const rows = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((r) => /Auto length/.test(r.textContent));
				const h = rows[0] && rows[0].querySelector('.ec-help');
				return { rows: rows.length, tip: h ? h.getAttribute('data-bs-original-title') || h.getAttribute('title') || '' : null, glyph: !!(h && h.querySelector('.ec-tip')) };
			});
			ok('Auto length: one row, with a ? and a tip that says what it does', t.rows === 1 && t.glyph && /follow|slope|drawing/i.test(t.tip || ''), JSON.stringify(t));
		} finally { await a.close(); }
	}

	// ---- the phone footer: "Something wrong here?" and the map credit never overlap ----
	console.log('\n--- the phone footer ---');
	for (const sz of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
		for (const docks of [true, false]) {
			const a = await Session.open(browser, NAME, { viewport: sz, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
			const page = a.page;
			try {
				if (docks) { await page.addInitScript('window.EC_DEFAULT_DOCKS = true;'); }
				// A one-pixel PNG for every street tile, so the credit shows as it does for a visitor.
				await page.route(/tile\.openstreetmap\.org/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') }));
				await page.route(/api\.mapbox\.com/, (r) => r.abort());
				await a.goto('Looped-Network.php?ec_nolog=1');
				await page.evaluate(() => { localStorage.clear(); });
				await a.reload();
				await page.getByText('Allow this', { exact: true }).tap().catch(() => {});
				await a.settle(500);
				await page.getByText(await a.lang('lpn_examples_blank')).tap().catch(() => {});
				await a.settle(2500);
				const g = await page.evaluate(() => {
					const R = (s) => { const e = document.querySelector(s); if (!e || !e.getClientRects().length) { return null; } const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
					return { wrong: R('#lpn_wrong_btn'), credit: R('#lpn_basemap_credit') };
				});
				const tag = 'phone ' + sz.width + 'x' + sz.height + (docks ? ' with docks' : ' without docks') + ': ';
				ok(tag + 'the credit and the "Something wrong here?" link are both on screen', !!g.wrong && !!g.credit, JSON.stringify(g));
				if (g.wrong && g.credit) {
					const hit = g.wrong.l < g.credit.r && g.credit.l < g.wrong.r && g.wrong.t < g.credit.b && g.credit.t < g.wrong.b;
					ok(tag + 'they do not overlap', !hit, JSON.stringify(g));
				}
			} finally { await a.close(); }
		}
	}

	await browser.close();
	env.stopServer();
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

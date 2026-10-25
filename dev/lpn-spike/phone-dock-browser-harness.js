// A PHONE'S DOCKED BOXES, FROM A CLEAN AND FROM A DIRTY BROWSER (Tom, 2026-10-24, on his Android phone).
// Real Chromium at 390 x 844 with a touch screen and the first-visit docks switched on:
//   a. an old saved layout (floating positions only, nothing docked) does not stop Properties
//      starting docked and auto-hidden; a layout the visitor did dock is kept;
//   b. every docked box has its auto-hide tab, even one saved as pinned or with a width of 60 px;
//      its flyout is at least 240 px wide, its edge can be dragged by a finger, and a phone offers no
//      pin button;
//   c. the tab strip starts below the project chrome, and follows when the chrome grows afterwards;
//   d. a selected Customer looks as it does on a PC (same stroke, same blue pixels), and the Properties
//      flyout does not sit on top of it.
//
//   node dev/lpn-spike/phone-dock-browser-harness.js   (takes the browser lock itself)
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONEDOCK_BROWSER_LOCKED';
const NAME = 'phone-dock-browser-harness';

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

function projectText() {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	d.customers = [{ id: 'M1', demand: 12.5, count: 3, link: null, x: 25, y: 60, desc: 'School', tag: 'inst' }];
	return JSON.stringify(d);
}

// A browser that holds `store` (key -> JSON text) and the project, opened as a phone or a desktop.
async function visit(Session, browser, label, store, phone) {
	const opts = phone ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, serviceWorkers: 'block' }
		: { viewport: { width: 1200, height: 800 }, serviceWorkers: 'block' };
	const a = await Session.open(browser, NAME + '-' + label, opts);
	await a.context.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.page.evaluate(([txt, st]) => {
		localStorage.clear();
		localStorage.setItem('lpn_project_phonedock', txt);
		Object.keys(st).forEach((k) => localStorage.setItem(k, st[k]));
	}, [projectText(), store]);
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	return a;
}
const rect = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); if (!e) { return null; } const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; }, sel);
const tabs = (page) => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-dock-tab')).map((t) => t.getAttribute('aria-controls')));
const chromeBottom = (page) => page.evaluate(() => Math.max(...['lpn_menubar', 'lpn_toolbar', 'lpn_tabs'].map((id) => { const e = document.getElementById(id); return e && e.offsetParent ? e.getBoundingClientRect().bottom : 0; })));
async function touch(cdp, type, pts) { await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts }); }
async function tapXY(a, cdp, x, y) { await touch(cdp, 'touchStart', [{ x, y, id: 1 }]); await touch(cdp, 'touchEnd', []); await a.settle(500); }

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		console.log('--- a. an old saved layout does not win ---');
		let a = await visit(Session, browser, 'oldfloat', {
			lpn_setbox: JSON.stringify({ left: 300, top: 200, w: 500, h: 400, open: false }),
			lpn_libbox: JSON.stringify({ left: 40, top: 80, w: 300, h: 300, open: false })
		}, true);
		ok('a.1 a record of floating positions only: Properties still starts as an auto-hide tab at the right', (await tabs(a.page)).includes('lpn_popup'), JSON.stringify(await tabs(a.page)));
		ok('a.2 ...and no page error', !a.errors.length, (a.errors[0] || '').slice(0, 160));
		await a.close();
		a = await visit(Session, browser, 'ownlayout', { lpn_dockbox: JSON.stringify({ lpn_popup: { dock: 'left', open: true, autohide: true } }) }, true);
		const own = await tabs(a.page);
		ok('a.3 a layout the visitor docked is kept as saved (their box only, no defaults added)', JSON.stringify(own) === JSON.stringify(['lpn_popup']), JSON.stringify(own));
		await a.close();

		console.log('\n--- b. a docked box on a phone: its tab, a usable width, an edge a finger can drag ---');
		a = await visit(Session, browser, 'pinned', {
			lpn_dockbox: JSON.stringify({ lpn_popup: { dock: 'right', open: true, dockW: 60 } }),
			lpn_setbox: JSON.stringify({ left: 10, top: 10, w: 300, h: 300, open: true, dock: 'right', dockW: 60, autohide: true })
		}, true);
		const t = await tabs(a.page);
		ok('b.1 a box saved as PINNED, 60 px wide, has its auto-hide tab (and so does a keyed Settings box saved as auto-hide)', t.includes('lpn_popup') && t.includes('lpn_settings_box'), JSON.stringify(t));
		const cdp = await a.context.newCDPSession(a.page);
		const tab = await rect(a.page, '.lpn-dock-tab[aria-controls="lpn_popup"]');
		await tapXY(a, cdp, tab.l + tab.w / 2, tab.t + tab.h / 2);
		const fly = await rect(a.page, '#lpn_popup');
		ok('b.2 tapping the tab flies the box out at least 240 px wide', fly && fly.w >= 240 && fly.l >= 0, JSON.stringify(fly));
		ok('b.3 ...and it leaves part of the map to look at', fly && fly.w <= 390 - 24 - 40, JSON.stringify(fly));
		const dockBtns = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup .lpn-box-corner [data-dock]')).map((b) => b.getAttribute('data-dock')));
		ok('b.4 a phone offers no pin button (nothing there can be pinned)', !dockBtns.includes('autohide') && dockBtns.includes('float'), JSON.stringify(dockBtns));
		const grip = await rect(a.page, '.lpn-dock-grip.lpn-dock-grip-live');
		ok('b.5 the box edge is a finger wide (at least 24 px)', grip && grip.w >= 24, JSON.stringify(grip));
		if (grip) {
			const y = grip.t + grip.h / 2, x0 = grip.l + grip.w / 2;
			await touch(cdp, 'touchStart', [{ x: x0, y, id: 1 }]);
			for (let i = 1; i <= 5; i++) { await touch(cdp, 'touchMove', [{ x: x0 - 8 * i, y, id: 1 }]); }
			await touch(cdp, 'touchEnd', []);
			await a.settle(500);
			const wide = await rect(a.page, '#lpn_popup');
			ok('b.6 a finger dragging the edge leftward widens the box', wide && wide.w > fly.w + 20, JSON.stringify([fly.w, wide && wide.w]));
		}
		ok('b.7 no page error', !a.errors.length, (a.errors[0] || '').slice(0, 160));
		await a.close();

		console.log('\n--- c. the tabs start below the project chrome ---');
		a = await visit(Session, browser, 'chrome', {}, true);
		let cb = await chromeBottom(a.page), st = await rect(a.page, '#lpn_dock_strip_right');
		ok('c.1 on a first visit the tab strip begins at or below the bottom of the chrome', st && st.t >= cb - 1, JSON.stringify({ stripTop: st && st.t, chromeBottom: cb }));
		await a.page.evaluate(() => { const e = document.getElementById('lpn_tabs'); e.style.paddingBottom = '48px'; });
		await a.settle(700);
		cb = await chromeBottom(a.page); st = await rect(a.page, '#lpn_dock_strip_right');
		ok('c.2 the chrome grows afterwards: the strip follows without anything being opened', st && st.t >= cb - 1, JSON.stringify({ stripTop: st && st.t, chromeBottom: cb }));
		await a.close();

		console.log('\n--- d. a selected Customer looks as it does on a PC ---');
		const blue = async (pg) => {
			const r = await pg.evaluate(() => { const b = document.querySelector('.lpn-meter[data-cust="M1"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
			const buf = await pg.screenshot({ clip: { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 20), width: 40, height: 40 } });
			return pg.evaluate(async (b64) => {
				const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
				const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
				const g = c.getContext('2d'); g.drawImage(img, 0, 0);
				const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
				for (let k = 0; k < d.length; k += 4) { if (d[k + 2] > 150 && d[k + 2] - d[k] > 40 && d[k + 2] - d[k + 1] > 20) { n++; } }
				return n / (c.width * c.height);
			}, buf.toString('base64'));
		};
		const sel1 = (pg) => pg.evaluate(() => {
			const m = document.querySelector('.lpn-meter[data-cust="M1"]'), b = m.getBoundingClientRect();
			const o = { bubbles: true, clientX: b.left + b.width / 2, clientY: b.top + b.height / 2, pointerId: 5, pointerType: 'touch', button: 0, isPrimary: true };
			m.dispatchEvent(new PointerEvent('pointerdown', o)); m.dispatchEvent(new PointerEvent('pointerup', o));
		});
		const stroke = (pg) => pg.evaluate(() => getComputedStyle(document.querySelector('.lpn-meter[data-cust="M1"]')).strokeWidth);
		a = await visit(Session, browser, 'phone', {}, true);
		const pBefore = await blue(a.page);
		const pMeter0 = (await rect(a.page, '.lpn-meter[data-cust="M1"]')).l;
		await sel1(a.page);
		await a.settle(1000);
		const pStroke = await stroke(a.page), pFly = await rect(a.page, '#lpn_popup'), pMeter = await rect(a.page, '.lpn-meter[data-cust="M1"]');
		ok('d.1 tapping the Customer selects it and Properties flies out', await a.page.evaluate(() => document.querySelector('.lpn-meter[data-cust="M1"]').classList.contains('lpn-selected')) && pFly && pFly.w > 0);
		ok('d.2 the Customer is not under the Properties flyout', pMeter.l + pMeter.w <= pFly.l, JSON.stringify({ meter: pMeter.l, flyout: pFly.l }));
		const pAfter = await blue(a.page);   // the flyout stays up: it must not be what hides the mark
		await a.page.screenshot({ path: process.env.PHONEDOCK_SHOT || '/tmp/phone-dock-customer.png' });
		ok('d.3 the phone shows a blue halo round it, counted from the screen\'s own pixels', pAfter - pBefore > 0.04, JSON.stringify([pBefore, pAfter]));
		const d = await visit(Session, browser, 'desk', {}, false);
		const dBefore = await blue(d.page);
		await sel1(d.page);
		await d.settle(800);
		const dStroke = await stroke(d.page);
		const dAfter = await blue(d.page);
		ok('d.4 the same drawing as a PC: the same stroke width', pStroke === dStroke, JSON.stringify([pStroke, dStroke]));
		ok('d.5 ...and about the same amount of blue (within 25%)', Math.abs((pAfter - pBefore) - (dAfter - dBefore)) <= 0.25 * (dAfter - dBefore), JSON.stringify([pAfter - pBefore, dAfter - dBefore]));
		ok('no page errors', !a.errors.length && !d.errors.length, (a.errors[0] || d.errors[0] || '').slice(0, 160));
		await d.close();

		console.log('\n--- e. the map pans only as far as it must, and comes back ---');
		const cdpE = await a.context.newCDPSession(a.page);
		const tapOut = async () => { await tapXY(a, cdpE, 62, 790); await a.settle(400); };
		const meterAt = async () => { const r = await rect(a.page, '.lpn-meter[data-cust="M1"]'); return r && r.l; };
		const gripR = await rect(a.page, '.lpn-dock-grip.lpn-dock-grip-live');
		ok('e.1 the flyout\'s edge grip lies inside the box (it does not reach over the map)', gripR && gripR.l >= pFly.l - 1, JSON.stringify({ grip: gripR, flyout: pFly.l }));
		const hit = await a.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.id || e.className.toString()) : null; }, [pFly.l - 5, pFly.t + 300]);
		ok('e.2 a point 5 px beside the flyout is the map, not the grip', !/grip/.test(String(hit)), String(hit));
		const afterPan = await meterAt();
		ok('e.3 the pan moved the Customer only to just clear of the flyout (8 px), not to the middle', Math.abs(afterPan + 4 - (pFly.l - 8)) <= 6 || afterPan < pFly.l - 8, JSON.stringify([afterPan, pFly.l]));
		await tapOut();
		await a.settle(900);
		ok('e.4 the flyout tucks', !(await a.page.evaluate(() => document.getElementById('lpn_popup').classList.contains('lpn-dock-out'))));
		const back = await meterAt();
		ok('e.5 ...and the map is back where it was before the selection', Math.abs(back - pMeter0) <= 1, JSON.stringify([back, pMeter0]));
		for (let i = 0; i < 3; i++) {
			await sel1(a.page); await a.settle(900);
			await tapOut(); await a.settle(900);
		}
		ok('e.6 three more select-and-tuck rounds leave the map where it was', Math.abs((await meterAt()) - pMeter0) <= 1, String(await meterAt()));
		await tapOut(); await a.settle(500);
		const nodeInfo = () => a.page.evaluate(() => {
			const ns = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node')).filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.left > 28 && r.right < 105 && r.top > 140 && r.bottom < 800; });
			if (!ns.length) { return null; }
			const r = ns[0].getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: ns[0].getAttribute('data-node') };
		});
		const n0 = await nodeInfo();
		if (n0) {
			await a.page.evaluate((n) => {
				const c = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + n.id + '"]');
				const o = { bubbles: true, clientX: n.x, clientY: n.y, pointerId: 6, pointerType: 'touch', button: 0, isPrimary: true };
				c.dispatchEvent(new PointerEvent('pointerdown', o)); c.dispatchEvent(new PointerEvent('pointerup', o));
			}, n0);
			await a.settle(900);
			const n1 = await a.page.evaluate((id) => { const r = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return r.left + r.width / 2; }, n0.id);
			ok('e.8 a selection the flyout does not cover does not move the map', Math.abs(n1 - n0.x) <= 1, JSON.stringify([n0.x, n1]));
		} else { ok('e.8 a node left of the flyout exists to test with', false); }
		await sel1(a.page); await a.settle(900);
		const m1 = await meterAt();
		await a.page.evaluate(() => { const c = document.getElementById('lpn_canvas'); c.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, clientX: 60, clientY: 400, bubbles: true, cancelable: true })); });
		await a.settle(400);
		const zoomed = await meterAt();
		await tapOut(); await a.settle(900);
		ok('e.7 if the visitor zoomed meanwhile, the map is not pulled back', Math.abs(zoomed - m1) < 1 || Math.abs((await meterAt()) - zoomed) <= 1, JSON.stringify([m1, zoomed, await meterAt()]));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

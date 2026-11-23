// A WELL'S JOINED TANK CAN BE DRAGGED, AND A NEGATIVE TANK DIAMETER IS FLAGGED, IN A REAL CHROME. Run with:
//   node dev/lpn-spike/well-tank-drag-browser-harness.js
//
// Task 822, round 16 (Tom: "The tank has its independent position. Allow it to be dragged."). Before: a press on the vessel of a joined Well with tank (or pressure tank)
// and a drag moved the tank's own point, which the joined drawing does not draw, so nothing moved on the screen and Explode later showed the tank somewhere else.
// Now the drag takes the tank out of the joined drawing (`apart` on the group): the tank, the tee and the pipes are drawn as themselves and the tank follows the pointer.
// The group stays. Also: a negative Tank diameter typed on a Well's box shows the page's own value warning (lpn_valwarn_negative; the page flags and never refuses).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_TANK_DRAG_LOCKED';
const NAME = 'well-tank-drag-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.'); process.exit(1); }
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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 } });
		let P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await a.reload(); await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1200);
		const stored = () => P.evaluate(() => { const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId; return JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'); });
		const tankAt = async () => { const p = await stored(); const t = p.nodes.filter((n) => n.type === 'tank')[0]; return { x: t.x, y: t.y }; };
		const drawnTank = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-node-symbol-tank')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none' && !e.closest('.lpn-asm-hid'); }).map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
		const joinedBox = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas .lpn-node-symbol-well')).filter((x) => x.getBoundingClientRect().width > 0 && !x.closest('.lpn-asm-hid'))[0]; if (!e) { return null; } const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; });
		const hasExplode = () => P.evaluate(() => !!document.querySelector('[data-assembly-explode]'));
		const drag = async (x, y, dx, dy) => { await P.mouse.move(x, y); await P.mouse.down(); await P.mouse.move(x + dx / 2, y + dy / 2, { steps: 6 }); await P.mouse.move(x + dx, y + dy, { steps: 6 }); await P.mouse.up(); await a.settle(1000); };

		for (const [label, kind] of [['Well with tank', 'welltank'], ['Well with pressure tank', 'welltankp']]) {
			console.log('\n--- ' + label + ' ---');
			await a.newProject('us'); P = a.page; await a.dismissGallery(); await a.settle(1000);
			await a.menuClickSub('Insert', label, 'project');
			await P.mouse.click(500, 400); await a.settle(700);
			await P.mouse.click(600, 400); await a.settle(500);
			await P.mouse.click(700, 400); await a.settle(900);
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(900);
			const m = await joinedBox();
			ok(label + ': drawn joined to start with, the tank not drawn on its own', !!m && (await drawnTank()).length === 0);
			const t0 = await tankAt();
			const vx = m.l + m.w * 0.85, vy = m.t + m.h * 0.5;
			await drag(vx, vy, 80, 120);
			const t1 = await tankAt();
			const dt = await drawnTank();
			ok(label + ': dragging the vessel moves the tank\'s point', Math.abs(t1.x - t0.x) > 20 || Math.abs(t1.y - t0.y) > 20, JSON.stringify([t0, t1]));
			ok(label + ': the tank is then drawn as itself, under the pointer (what moved is what is seen)', dt.length === 1 && Math.hypot(dt[0].x - (vx + 80), dt[0].y - (vy + 120)) < 12, JSON.stringify([dt, vx + 80, vy + 120]));
			const alone = await joinedBox();
			ok(label + ': the Well is drawn alone again (its symbol narrower than the joined one)', !alone || alone.w < m.w * 0.8, JSON.stringify([alone && alone.w, m.w]));
			const st = await stored();
			ok(label + ': the group stays and says the tank is apart (saved)', !!(st.assemblies || []).filter((x) => x.kind === 'well' && x.apart)[0], JSON.stringify((st.assemblies || []).map((x) => [x.id, x.apart])));
			// Undo puts the joined drawing and the old point back.
			await P.keyboard.press('Escape'); await a.settle(300);
			await P.keyboard.press('Control+z'); await a.settle(900);
			const t2 = await tankAt(), m2 = await joinedBox();
			ok(label + ': Undo restores the tank\'s point and the joined drawing', Math.abs(t2.x - t0.x) < 0.01 && Math.abs(t2.y - t0.y) < 0.01 && !!m2 && (await drawnTank()).length === 0, JSON.stringify([t2, m2]));
			// Drag it out again, then drag the tank by its own symbol: it follows.
			await drag(vx, vy, 80, 120);
			const dt2 = (await drawnTank())[0];
			await P.keyboard.press('Escape'); await a.settle(300);
			await drag(dt2.x, dt2.y, 50, -70);
			const dt3 = (await drawnTank())[0];
			ok(label + ': the tank drawn as itself drags by its own symbol', !!dt3 && Math.abs(dt3.x - (dt2.x + 50)) < 12 && Math.abs(dt3.y - (dt2.y - 70)) < 12, JSON.stringify([dt2, dt3]));
			// Dragged right onto the Well's own outlet, the tank does not snap onto the Well's node (the pointer is the tank's centre, a few px off the Well's own point at most)
			await P.keyboard.press('Escape'); await a.settle(300);
			const wc = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			await drag(dt3.x, dt3.y, wc.x + 2 - dt3.x, wc.y - dt3.y);
			const stW = await stored();
			const wN = stW.nodes.filter((n) => n.id === 'W1')[0], tN = stW.nodes.filter((n) => n.type === 'tank')[0];
			ok(label + ': a tank dropped on its Well\'s outlet is not snapped onto it (its point is not the Well\'s)', Math.hypot(tN.x - wN.x, tN.y - wN.y) > 0.5, JSON.stringify([wN.x, wN.y, tN.x, tN.y]));
			await drag((await drawnTank())[0].x, (await drawnTank())[0].y, 120, 90);
			// Select the Well (its box has Explode): the group is still there.
			await P.keyboard.press('Escape'); await a.settle(300);
			const wc2 = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			await P.mouse.click(wc2.x, wc2.y); await a.settle(800);
			ok(label + ': the Well\'s box still has Explode', await hasExplode());
			if (kind === 'welltank') {
				// A negative tank diameter on the Well's box is flagged (zero is legal and is not, checked below) with the page's own words.
				for (const bad of ['-5']) {
					const flagged = await P.evaluate((v) => {
						const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => /^\s*Tank diameter/.test(x.textContent))[0];
						if (!l) { return { found: false }; }
						const i = l.querySelector('input'); i.value = v; i.dispatchEvent(new Event('change', { bubbles: true }));
						return { found: true };
					}, bad);
					await a.settle(800);
					const after = await P.evaluate(() => {
						const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => /^\s*Tank diameter/.test(x.textContent))[0];
						const w = l && l.querySelector('.lpn-valwarn');
						return { warn: !!w, tip: l ? l.outerHTML : '' };
					});
					const want = await P.evaluate(() => (EngCalcs.pageConfig || {}).lpn_valwarn_negative);
					ok('a Tank diameter of ' + bad + ' typed on the Well\'s box shows the warning', flagged.found && after.warn && after.tip.indexOf(want) >= 0, JSON.stringify([flagged, after.warn]));
				}
				for (const good of ['0', '12']) {
				await P.evaluate((v) => { const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => /^\s*Tank diameter/.test(x.textContent))[0]; const i = l.querySelector('input'); i.value = v; i.dispatchEvent(new Event('change', { bubbles: true })); });
				await a.settle(800);
				const clear = await P.evaluate(() => { const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => /^\s*Tank diameter/.test(x.textContent))[0]; return !!l && !l.querySelector('.lpn-valwarn'); });
				ok('a Tank diameter of ' + good + ' shows no warning', clear);
				}
			}
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + (failures ? failures + ' of ' + checks + ' FAILED' : 'ALL PASS (' + checks + ' checks)'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

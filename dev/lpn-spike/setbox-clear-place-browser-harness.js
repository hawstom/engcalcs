// CLEARING AN OVERRIDE IN THE SETTINGS BOX KEEPS THE ROW WHERE IT WAS ON SCREEN, IN A REAL CHROMIUM
// -- Tom's browser pass, 2026-10-17. Run with:
//   node dev/lpn-spike/setbox-clear-place-browser-harness.js
//
// Tom: "Clearing a demand override in Settings scrolls the main pane away from the input of
// interest because of the removal of a line." The dot in a held row's gutter clears the override
// and rebuilds the box; the dot sits in a `data-lpn-noseam` gutter, so the click never reached
// setboxPin(), and nothing held the row still while the box was rebuilt.
// Measured before the fix: the field moved 2 px here, the box's scroll position shifting under it;
// a larger move (248 px) was seen only when the box's width changed between the edit and the clear.
// Asserted on Net1, in a scenario, with the box scrolled so the row sits mid-way down:
//   1. Demand multiplier typed, then its dot clicked: the override is gone and the field has not
//      moved on screen.
//   2. Friction method and every third checkbox row made overrides, then each cleared by its dot:
//      none moves on screen.
//   3. Properties, a junction's demand: its dot clears it and removes the line under it, and the
//      demand field stays put (it did before the fix too; held here as a guard).
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SBCLEAR_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SBCLEAR_LOCKED: '1' }) });
		if (r.status === 75) { console.error('setbox-clear-place-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		// A short window, so the Properties box scrolls too (section 3).
		const a = await Session.open(browser, 'A', { viewport: { width: 1400, height: 560 } });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = async (k) => a.lang(k);
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const scenarioMenu = async (label) => {
			await require('./manager-door.js').ensure(page, label);
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
			let hit = false;
			for (const r of rowsH) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label.trim() || t.replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); throw new Error('no scenario menu row ' + label); }
			await a.settle(1000);
		};
		a.answerPromptWith('Peak');
		await scenarioMenu(await L('lpn_scenario_new'));
		await a.settle(1200);
		await a.toolbarClick(await L('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(600);

		// A tagged row of the box, named by its data-lpn-setting text. place() puts its control mid-way
		// down the box; where() says where that control is on screen, and where the row's dot is.
		const place = (sel) => page.evaluate((sel) => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === sel)[0];
			if (!r) { return null; }
			const c = r.querySelector('input, select') || r, s = document.getElementById('lpn_setbox_content');
			const cr = c.getBoundingClientRect(), b = s.getBoundingClientRect();
			s.scrollTop += (cr.top - b.top) - s.clientHeight / 2;
			return true;
		}, sel);
		const where = (sel) => page.evaluate((sel) => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === sel)[0];
			if (!r) { return null; }
			const c = r.querySelector('input, select') || r, dot = r.querySelector('.lpn-ovm-dot');
			const d = dot ? dot.getBoundingClientRect() : null;
			return { y: c.getBoundingClientRect().top, held: r.classList.contains('lpn-set-held'), dot: d ? { x: d.left + d.width / 2, y: d.top + d.height / 2 } : null, value: c.value };
		}, sel);
		const clearByDot = async (sel) => {
			await place(sel);
			await a.settle(200);
			const w0 = await where(sel);
			if (!w0 || !w0.dot) { return { w0, w1: null }; }
			await page.mouse.click(w0.dot.x, w0.dot.y);
			await a.settle(1000);
			return { w0, w1: await where(sel) };
		};

		console.log('--- 1. the demand multiplier ---');
		const dmSel = await page.evaluate(() => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.getAttribute('data-lpn-setting').indexOf('demandMultiplier') >= 0)[0];
			return r ? r.getAttribute('data-lpn-setting') : null;
		});
		ok('the Settings box has a Demand multiplier row', !!dmSel, dmSel);
		await place(dmSel);
		await a.settle(200);
		const dmInput = await page.evaluateHandle((sel) => Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.getAttribute('data-lpn-setting') === sel)[0].querySelector('input'), dmSel);
		await dmInput.asElement().click();
		await page.keyboard.press('Control+a');
		await page.keyboard.type('1.5');
		await page.keyboard.press('Tab');
		await a.settle(1200);
		const dmHeld = await where(dmSel);
		ok('typed 1.5 in the scenario: the row is held and wears a dot', !!dmHeld && dmHeld.held && !!dmHeld.dot, JSON.stringify(dmHeld));
		const dm = await clearByDot(dmSel);
		ok('its dot clicked: the override is cleared', !!dm.w1 && !dm.w1.held, JSON.stringify(dm.w1));
		ok('...and the Demand multiplier field did not move on screen', !!dm.w1 && Math.abs(dm.w1.y - dm.w0.y) < 2, JSON.stringify({ before: dm.w0 && dm.w0.y, after: dm.w1 && dm.w1.y }));

		console.log('--- 2. the friction method, and every third checkbox row ---');
		const sels = await page.evaluate(() => {
			const out = [];
			const rows = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((r) => r.offsetParent);
			const m = rows.filter((r) => r.getAttribute('data-lpn-setting') === JSON.stringify([['settings', 'method']]))[0];
			if (m) { out.push({ sel: m.getAttribute('data-lpn-setting'), kind: 'select' }); }
			rows.filter((r) => r.querySelector('input[type=checkbox]')).forEach((r, i) => { if (i % 3 === 0) { out.push({ sel: r.getAttribute('data-lpn-setting'), kind: 'cb' }); } });
			return out;
		});
		const moved = [];
		let tried = 0;
		for (const s of sels) {
			await place(s.sel);
			await a.settle(150);
			const h = await page.evaluateHandle((x) => {
				const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((y) => y.offsetParent && y.getAttribute('data-lpn-setting') === x.sel)[0];
				return r ? r.querySelector(x.kind === 'cb' ? 'input[type=checkbox]' : 'select') : null;
			}, s);
			const el = h.asElement();
			if (!el) { continue; }
			if (s.kind === 'cb') { const b = await el.boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); } else { await el.selectOption('dw'); }
			await a.settle(900);
			const w = await where(s.sel);
			if (!w || !w.held || !w.dot) { continue; }
			const c = await clearByDot(s.sel);
			tried++;
			if (!c.w1 || c.w1.held || Math.abs(c.w1.y - c.w0.y) > 2) { moved.push(s.sel.slice(0, 60) + ' ' + Math.round(c.w0.y) + '->' + (c.w1 ? Math.round(c.w1.y) + (c.w1.held ? ' still held' : '') : 'gone')); }
		}
		ok('friction method and every third checkbox row made overrides, then cleared by the dot (' + tried + '): none moves on screen', tried >= 8 && moved.length === 0, JSON.stringify(moved.slice(0, 8)));
		console.log('--- 3. Properties: a junction\'s demand ---');
		await page.keyboard.press('Escape');
		await a.settle(300);
		await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); if (b) { b.style.display = 'none'; } });
		const at = await page.evaluate(() => {
			const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)')).filter((c) => c.getBoundingClientRect().width > 0);
			const r = ns[3].getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await page.mouse.click(at.x, at.y);
		await a.settle(900);
		const demIn = () => page.evaluateHandle(() => document.querySelector('#lpn_popup_fields .lpn-demand-table input'));
		const pw = () => page.evaluate(() => {
			const i = document.querySelector('#lpn_popup_fields .lpn-demand-table input');
			const dot = document.querySelector('#lpn_popup_fields .lpn-ovm-dot');
			const sc = i && i.closest('.lpn-popover-body');
			const d = dot ? dot.getBoundingClientRect() : null;
			return i ? { y: i.getBoundingClientRect().top, value: i.value, dot: d && d.width ? { x: d.left + d.width / 2, y: d.top + d.height / 2 } : null,
				notes: document.querySelectorAll('#lpn_popup_fields .lpn-ov-note').length, st: sc ? sc.scrollTop : null, sh: sc ? sc.scrollHeight : null, ch: sc ? sc.clientHeight : null } : null;
		});
		const di = (await demIn()).asElement();
		await di.click();
		await page.keyboard.press('Control+a');
		await page.keyboard.type('333');
		await page.keyboard.press('Tab');
		await a.settle(1000);
		await page.evaluate(() => { const i = document.querySelector('#lpn_popup_fields .lpn-demand-table input'); const sc = i.closest('.lpn-popover-body'); const r = i.getBoundingClientRect(), b = sc.getBoundingClientRect(); sc.scrollTop += (r.top - b.top) - sc.clientHeight / 2; });
		await a.settle(200);
		const pa = await pw();
		ok('Properties: 333 typed in the scenario makes the demand an override, with its dot and the line under it', !!pa && !!pa.dot && pa.notes === 1, JSON.stringify(pa));
		if (pa && pa.dot) { await page.mouse.click(pa.dot.x, pa.dot.y); }
		await a.settle(1000);
		const pb = await pw();
		ok('...its dot clicked: cleared, the line gone, and the demand field did not move on screen', !!pb && !pb.dot && pb.notes === 0 && Math.abs(pb.y - pa.y) < 2, JSON.stringify(pb));
		ok('no page error', errors.length === 0, JSON.stringify(errors.slice(0, 3)));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' clear-place check(s) FAILED' : '\nSettings box clear-place browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

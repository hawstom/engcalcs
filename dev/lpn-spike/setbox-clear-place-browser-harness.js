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
//   4. Tom's own case, in Spanish with the box docked at the right: as a first visit docks it
//      (auto-hide, EC_DEFAULT_DOCKS), pinned, and auto-hidden. The dot is HOVERED until its tip
//      shows, then clicked. Before the fix this threw the content 561 px: something read layout
//      half way through the rebuild (only with a tip showing), when the content was shorter than
//      the scroll position, and the browser clamped scrollTop there.
//   5. Then Ctrl+Z, with the pointer resting on the row's "?" until its tip shows: the undo
//      rebuilds the box with no control pinned, so only keepSetboxControl()'s unclamp holds it.
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

		// ---- 4. TOM'S CASE: Spanish, the box docked at the right, labels under their fields ----
		for (const mode of ['defaults', 'docked', 'autohide']) {
			console.log('--- 4. ' + mode + ' at the right, in Spanish: the demand multiplier ---');
			const b = await Session.open(browser, 'B' + mode, { viewport: { width: 1400, height: 900 } });
			const P = b.page, errsB = [];
			// A visitor's first visit docks the right-hand boxes, auto-hidden (applyDefaultDocks()); a
			// webdriver session does not unless asked, so 'defaults' asks.
			if (mode === 'defaults') { await P.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; }); }
			P.on('pageerror', (e) => errsB.push(String(e && e.message)));
			await b.goto('Looped-Network.php?lang=es');
			await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
			await b.settle(1500);
			await P.evaluate(() => {
				let e = document.querySelector('.ec-consent-actions');
				while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
				if (e) { e.style.display = 'none'; }
			});
			b.answerPromptWith('Escenario 1');
			const newRow = await b.lang('lpn_scenario_new');
			await require('./manager-door.js').ensure(P, newRow);
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '') === newRow.trim()) { await r.click(); break; }
			}
			await b.settle(1500);
			// A first visit with a project open already has Settings pinned open at the right (Tom, 2026-10-26).
			if (mode === 'defaults') { /* nothing to open */ }
			else { await b.toolbarClick(await b.lang('lpn_tool_settings')); }
			await P.waitForSelector('#lpn_settings_box', { state: 'visible' });
			await b.settle(600);
			if (mode !== 'defaults') { await P.click('#lpn_settings_box .lpn-corner-btn[data-dock="right"]'); await b.settle(800); }
			if (mode === 'autohide') { await P.click('#lpn_settings_box .lpn-corner-btn[data-dock="autohide"]'); await b.settle(600);
				// Out again from its tab, as a flyout over the map.
				await P.evaluate(() => { const t = Array.from(document.querySelectorAll('[id^="lpn_dock_strip_"] *')).filter((x) => x.__lpnDockFor === 'lpn_settings_box' || /Config/.test(x.textContent || '') && x.children.length === 0)[0]; if (t) { t.click(); } });
				await b.settle(800);
			}
			const sel = JSON.stringify([['settings', 'hydraulics', 'demandMultiplier']]);
			const W = (s) => P.evaluate((s) => {
				const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === s)[0];
				const sc = document.getElementById('lpn_setbox_content'), box = document.getElementById('lpn_settings_box');
				if (!r) { return { none: true, shown: !!box && box.getBoundingClientRect().width }; }
				const c = r.querySelector('input'), dot = r.querySelector('.lpn-ovm-dot'), d = dot ? dot.getBoundingClientRect() : null;
				return { y: c.getBoundingClientRect().top, held: r.classList.contains('lpn-set-held'), value: c.value,
					docked: box.classList.contains('lpn-docked'), boxW: Math.round(box.getBoundingClientRect().width),
					st: Math.round(sc.scrollTop), sh: sc.scrollHeight, ch: sc.clientHeight,
					dot: d && d.width ? { x: d.left + d.width / 2, y: d.top + d.height / 2 } : null };
			}, s);
			const center = () => P.evaluate((s) => {
				const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === s)[0];
				const c = r.querySelector('input'), sc = document.getElementById('lpn_setbox_content');
				sc.scrollTop += (c.getBoundingClientRect().top - sc.getBoundingClientRect().top) - sc.clientHeight / 2;
			}, sel);
			await center();
			await b.settle(200);
			const inp = await P.evaluateHandle((s) => Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === s)[0].querySelector('input'), sel);
			await inp.asElement().click();
			await P.keyboard.press('Control+a');
			await P.keyboard.type('2');
			await P.keyboard.press('Tab');
			await b.settle(1200);
			await center();
			await b.settle(300);
			const w0 = await W(sel);
			ok(mode + ': docked at the right, Multiplicador de demanda held with its dot', !!w0 && w0.docked && w0.held && !!w0.dot, JSON.stringify(w0));
			// Hovered first, long enough for its tip to show, as Tom's screenshot has it.
			if (w0 && w0.dot) { await P.mouse.move(w0.dot.x, w0.dot.y); await b.settle(1500); await P.mouse.click(w0.dot.x, w0.dot.y); }
			await b.settle(1200);
			const w1 = await W(sel);
			ok(mode + ': its dot clicked, the override is cleared and the field stays where it was on screen', !!w1 && !w1.held && !!w0 && Math.abs(w1.y - w0.y) < 2, JSON.stringify(w1));
			const q = await P.evaluate((s) => {
				const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((x) => x.offsetParent && x.getAttribute('data-lpn-setting') === s)[0];
				const t = r && r.querySelector('.ec-tip'), g = t ? t.getBoundingClientRect() : null;
				return g && g.width ? { x: g.left + g.width / 2, y: g.top + g.height / 2 } : null;
			}, sel);
			if (q) { await P.mouse.move(q.x, q.y); await b.settle(1500); }
			await P.keyboard.press('Control+z');
			await b.settle(1200);
			const w2 = await W(sel);
			// The held row is 2 px taller than a plain one, so the field may sit 2 px lower inside it; the
			// box's scroll position must not change at all.
			ok(mode + ': Ctrl+Z with the "?" tip showing puts the override back, the box does not scroll', !!q && !!w2 && w2.held && !!w0 && w2.st === w0.st && Math.abs(w2.y - w0.y) < 3, JSON.stringify(w2));
			ok(mode + ': no page error', errsB.length === 0, JSON.stringify(errsB.slice(0, 3)));
			await b.context.close().catch(() => {});
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' clear-place check(s) FAILED' : '\nSettings box clear-place browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

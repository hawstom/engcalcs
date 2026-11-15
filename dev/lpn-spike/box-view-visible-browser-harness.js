// A BOX NEVER SHOWS A VIEW WITH NOTHING IN IT (Tom, 2026-11-14: *"When visiting a Library, specifically Patterns, the Library is
// not scrolled to the top, or at least so that something is visible. I think that we should never return to any view with
// nothing visible."*). Real Chromium, the real page, Net3 (five patterns, six controls). Run with:
//   node dev/lpn-spike/box-view-visible-browser-harness.js   (takes the browser lock itself)
//
// The cause: the Libraries box borrows the Settings box's shell, which ends in one pane-height of blank room so the last settings
// section can reach the top (`.lpn-setbox-content::after`), and the browser keeps a scroll position while one list is swapped for
// another. Scrolled to the end of Patterns and then shown Controls, the position stood, below all of Controls: a blank box.
//   1. Libraries: from the very end of every section, every other section opens with something in view, at its top;
//   2. Libraries: scrolled to the end, closed and reopened, there is something in view;
//   3. Libraries: there is no blank room to scroll into at all (it is the Settings box's alone), so no position can be past the list;
//   4. Settings, which keeps blank room after its content so the last section can reach the top: the room is the pane's height minus the last
//      section's, so at the end of the scroll range the last section stands at the top of the pane, at several window heights and at phone size,
//      after a resize while at the end, after a close and reopen, and after a rebuild by Undo.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'box-view-visible-browser-harness';
if (process.env.EC_BOXVIEW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_BOXVIEW_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || cond ? '' : '   ' + extra));
}
const SHOTS = process.env.EC_SHOTS || '';

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const P = a.page;
		P.on('pageerror', (e) => errors.push(String(e && e.message)));
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1500);

		const SECS = ['patterns', 'curves', 'pipetypes', 'fittings', 'controls', 'rules'];
		// What a person sees of a scroller: how many of its children are in the view, its scroll position and its range.
		const view = (id) => P.evaluate((id) => {
			const c = document.getElementById(id), b = c.getBoundingClientRect();
			const kids = Array.prototype.filter.call(c.children, (k) => k.offsetHeight > 0);
			const inView = kids.filter((k) => { const r = k.getBoundingClientRect(); return r.bottom > b.top && r.top < b.bottom; }).length;
			return { top: Math.round(c.scrollTop), range: Math.round(c.scrollHeight - c.clientHeight), kids: kids.length, inView };
		}, id);
		const libOpen = () => P.evaluate(() => { const b = document.getElementById('lpn_library_box'); return !!b && getComputedStyle(b).display !== 'none'; });
		const openLib = async () => {
			if (!(await libOpen())) { await a.menuClick(await a.lang('lpn_library_menu'), 'project'); await P.waitForSelector('#lpn_library_box', { state: 'visible' }); await a.settle(300); }
		};
		const closeLib = async () => {
			await P.evaluate(() => document.getElementById('lpn_libbox_close').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
			await a.settle(300);
		};
		const section = async (s) => {
			await P.evaluate((s) => document.getElementById('lpn_libbox_link_' + s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), s);
			await a.settle(250);
		};
		const toEnd = (id) => P.evaluate((id) => { const c = document.getElementById(id); c.scrollTop = c.scrollHeight; }, id);
		// A short box, so even the short sections have room to be scrolled past.
		await openLib();
		await P.evaluate(() => { const b = document.getElementById('lpn_library_box'); b.style.height = '420px'; });
		await a.settle(300);

		console.log('\n1. From the end of any section, any other section opens in view, at its top');
		for (const from of SECS) {
			await section(from);
			await toEnd('lpn_libbox_content');
			for (const to of SECS) {
				if (to === from) { continue; }
				await section(from);
				await toEnd('lpn_libbox_content');
				await section(to);
				const v = await view('lpn_libbox_content');
				ok(from + ' scrolled to its end, then ' + to + ': something is in view, at the top', v.inView > 0 && v.top === 0, JSON.stringify(v));
			}
		}

		console.log('\n2. Closed and reopened, scrolled to the end');
		for (const s of SECS) {
			await section(s);
			await toEnd('lpn_libbox_content');
			await closeLib();
			await openLib();
			const v = await view('lpn_libbox_content');
			ok(s + ': closed at its end and reopened, something is in view', v.inView > 0, JSON.stringify(v));
		}

		console.log('\n3. The Libraries box has no blank room to scroll into');
		for (const s of SECS) {
			await section(s);
			await toEnd('lpn_libbox_content');
			const v = await view('lpn_libbox_content');
			ok(s + ': at the very end of its scroll range something is still in view', v.inView > 0, JSON.stringify(v));
		}
		await section('patterns');
		if (SHOTS) { await toEnd('lpn_libbox_content'); await P.screenshot({ path: path.join(SHOTS, 'patterns-end-r2.png') }); }

		console.log('\n4. The Settings box: the end of its scroll range is the top of its last section, at every window height');
		await closeLib();
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await P.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(600);
		// where the last section stands against the pane: its top below the pane's top by how much, and how much of it shows
		const lastSec = () => P.evaluate(() => {
			const c = document.getElementById('lpn_setbox_content'), b = c.getBoundingClientRect();
			const kids = Array.prototype.filter.call(c.children, (k) => k.offsetHeight > 0), l = kids[kids.length - 1].getBoundingClientRect();
			return { top: Math.round(c.scrollTop), range: Math.round(c.scrollHeight - c.clientHeight), paneH: Math.round(b.height), lastH: Math.round(l.height),
				off: Math.round(l.top - b.top), shows: Math.round(Math.min(l.bottom, b.bottom) - Math.max(l.top, b.top)) };
		});
		const atEnd = async (tag) => {
			await toEnd('lpn_setbox_content');
			await a.settle(150);
			const m = await lastSec();
			// the last section is in view, and when it is shorter than the pane it stands at the pane's top (it can still reach the top)
			ok(tag + ': at the end of the scroll range the last section is in view', m.shows > 20, JSON.stringify(m));
			ok(tag + ': ...at the top of the pane when it is shorter than the pane', m.lastH >= m.paneH || Math.abs(m.off) <= 6, JSON.stringify(m));
		};
		for (const vp of [{ width: 1400, height: 900 }, { width: 1400, height: 640 }, { width: 1400, height: 480 }, { width: 390, height: 740 }, { width: 1400, height: 900 }]) {
			await P.setViewportSize(vp);
			await a.settle(700);
			await atEnd(vp.width + 'x' + vp.height);
		}
		// resized while at the end: the room follows the pane
		await toEnd('lpn_setbox_content');
		await P.setViewportSize({ width: 1400, height: 520 });
		await a.settle(700);
		let m = await lastSec();
		ok('resized while scrolled to the end: the last section is still in view', m.shows > 20, JSON.stringify(m));
		await P.setViewportSize({ width: 1400, height: 900 });
		await a.settle(700);
		// closed and reopened at the end (Perry: one line, 174 px from the end)
		await toEnd('lpn_setbox_content');
		await P.evaluate(() => document.getElementById('lpn_setbox_close').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await a.settle(400);
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await P.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(700);
		m = await lastSec();
		ok('closed at the end and reopened: the last section is in view', m.shows > 20 || m.top === 0, JSON.stringify(m));
		if (SHOTS) { await toEnd('lpn_setbox_content'); await P.screenshot({ path: path.join(SHOTS, 'settings-end-r2.png') }); }
		// a rebuild by Undo from the end
		await P.evaluate(() => { document.getElementById('lpn_setbox_content').scrollTop = 0; });
		const box0 = P.locator('#lpn_setbox_content input[type=checkbox]:visible').first();
		const was = await box0.isChecked();
		await box0.click();
		await a.settle(400);
		ok('the setting changed', (await box0.isChecked()) !== was);
		await toEnd('lpn_setbox_content');
		let v = await view('lpn_setbox_content');
		ok('Settings at the end of its range has something in view', v.inView > 0 && v.top === v.range, JSON.stringify(v));
		await P.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await P.mouse.move(700, 800);
		await P.keyboard.press('Control+z');
		await a.settle(900);
		ok('the Undo put the setting back', (await box0.isChecked()) === was);
		v = await view('lpn_setbox_content');
		ok('after the Undo rebuilt the Settings box, something is in view', v.inView > 0, JSON.stringify(v));
		if (SHOTS) { await P.screenshot({ path: path.join(SHOTS, 'settings-after-undo-r2.png') }); }
		ok('no page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails === 0 ? '\n' + NAME + ': all checks passed' : '\n' + NAME + ': ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });

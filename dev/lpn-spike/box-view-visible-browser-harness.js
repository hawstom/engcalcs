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
//   3. Libraries: nothing is in the blank room to scroll into at all (the blank room is the Settings box's alone);
//   4. the guard itself, with the blank room put back by hand (what a stylesheet regression would do): a rebuild from a position
//      held in the blank room brings the list into view, and a position that shows something is left alone;
//   5. Settings, which keeps its blank room: scrolled into it and then rebuilt by Undo, the box shows something, and a position
//      with content in view is left alone.
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

		console.log('\n4. The guard, with the blank room put back by hand');
		await P.evaluate(() => {
			const st = document.createElement('style');
			st.id = 'boxview_room';
			st.textContent = '#lpn_libbox_content::after { content: ""; display: block; min-height: 100%; }';
			document.head.appendChild(st);
		});
		await section('patterns');
		await toEnd('lpn_libbox_content');
		let v = await view('lpn_libbox_content');
		ok('with the room back, the end of Patterns is a blank view (the defect, reproduced)', v.inView === 0, JSON.stringify(v));
		await section('patterns');   // the same section again: a rebuild that keeps the position
		v = await view('lpn_libbox_content');
		ok('a rebuild from that position brings the list into view', v.inView > 0, JSON.stringify(v));
		// a position that shows content is left where it is
		await P.evaluate(() => { document.getElementById('lpn_libbox_content').scrollTop = 40; });
		await section('patterns');
		v = await view('lpn_libbox_content');
		ok('a position that shows something is left alone by a rebuild', v.top === 40, JSON.stringify(v));
		await P.evaluate(() => { const s = document.getElementById('boxview_room'); if (s) { s.remove(); } });

		console.log('\n5. The Settings box keeps its blank room, and is not left in it by a rebuild');
		await closeLib();
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await P.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(600);
		// something undoable that is a setting, so the Undo rebuilds the Settings box: the first checkbox in it, then back to the top
		await P.evaluate(() => { document.getElementById('lpn_setbox_content').scrollTop = 0; });
		const box0 = P.locator('#lpn_setbox_content input[type=checkbox]:visible').first();
		const was = await box0.isChecked();
		await box0.click();
		await a.settle(400);
		ok('the setting changed', (await box0.isChecked()) !== was);
		await toEnd('lpn_setbox_content');
		v = await view('lpn_setbox_content');
		ok('Settings scrolled to the end of its blank room is an empty view (the room is its own design)', v.inView === 0 && v.top === v.range, JSON.stringify(v));
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

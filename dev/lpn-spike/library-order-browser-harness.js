// THE LIBRARIES BOX ORDER BUTTONS (ROADMAP Task 859). Real Chromium, the real page.
//   node dev/lpn-spike/library-order-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-11-13: buttons to Move up, Move down, Move to top, Move to bottom in the Libraries. In every one of
// the six sections, on the gallery Net1 (a second item added where it has fewer than two):
//   1. the four buttons show, each an icon with its name as its accessible name and tip, all disabled
//      while nothing is selected;
//   2. clicking an entry selects it: it is marked, and a move that cannot act is disabled;
//   3. a click on Move up (or Move to top) moves the row, the mark follows it, the disabled states follow;
//   4. the keyboard does it: Tab to a button, Enter, and the focus is still on a button that can act;
//   5. one Ctrl+Z puts the row back;
//   6. Controls and Rules say in the tip that a move can change a run; the other sections do not.
// The moves themselves, saved order and export order: library-order-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LIBORDER_BROWSER_LOCKED';
const NAME = 'library-order-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || cond ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const SHOTS = process.env.EC_SHOTS || '';

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		const P = (fn, arg) => a.page.evaluate(fn, arg);
		const dismiss = () => P(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const openLib = async (sec) => {
			const open = await P(() => { const b = document.getElementById('lpn_library_box'); return !!b && getComputedStyle(b).display !== 'none'; });
			if (!open) {
				await a.menuClick(await a.lang('lpn_library_menu'), 'project');
				await a.page.waitForSelector('#lpn_library_box', { state: 'visible' });
			}
			await P((s) => {
				document.getElementById('lpn_libbox_link_' + s)
					.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, sec);
			await a.settle(300);
		};
		// What identifies an entry: everything typed in it, so a row of any section reads as one string.
		const rows = () => P(() => Array.prototype.map.call(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry'),
			(e) => Array.prototype.map.call(e.querySelectorAll('input[type=text], input[type=number], textarea'), (v) => v.value).join('|')));
		const state = () => P(() => {
			const moves = Array.prototype.map.call(document.querySelectorAll('#lpn_libbox_content .lpn-lib-move'), (b) => ({
				how: b.getAttribute('data-move'), disabled: b.disabled, label: b.getAttribute('aria-label'), title: b.getAttribute('data-bs-original-title') || b.title || '',
				icon: !!b.querySelector('svg'), text: b.textContent.trim()
			}));
			const sel = Array.prototype.map.call(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry'),
				(e) => e.classList.contains('lpn-lib-entry-sel'));
			const act = document.activeElement;
			return { moves, sel, focusMove: act && act.classList && act.classList.contains('lpn-lib-move') ? { how: act.getAttribute('data-move'), disabled: act.disabled } : null };
		});
		const dis = (s) => s.moves.map((m) => m.how + ':' + (m.disabled ? 'off' : 'on')).join(' ');
		const ADD = { patterns: 'lpn_library_pattern_add', curves: 'lpn_library_curve_add', pipetypes: 'lpn_library_pipetype_add',
			fittings: 'lpn_library_fittings_add', controls: 'lpn_library_control_add', rules: 'lpn_library_rule_add' };

		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await dismiss();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		const names = { top: await a.lang('lpn_library_move_top'), up: await a.lang('lpn_pane_manage_cols_up'),
			down: await a.lang('lpn_pane_manage_cols_down'), bottom: await a.lang('lpn_library_move_bottom') };
		const runTip = { controls: await a.lang('lpn_library_move_tip_controls'), rules: await a.lang('lpn_library_move_tip_rules') };

		for (const sec of ['patterns', 'curves', 'pipetypes', 'fittings', 'controls', 'rules']) {
			console.log('\n--- ' + sec + ' ---');
			await openLib(sec);
			// Two items at least; the Add button is the section's own, the same one a person presses.
			for (let k = 0; k < 3 && (await rows()).length < 2; k++) {
				await a.page.locator('#lpn_libbox_content > section > .lpn-lib-toolrow > button, #lpn_libbox_content > section > button').first().click();
				await a.settle(300);
			}
			const start = await rows();
			ok(sec + ': there are two or more items', start.length >= 2, JSON.stringify(start));
			// Add made the order change visibly: the new item is last, so item 0 and item 1 are the pair moved below.
			let s = await state();
			ok(sec + ': the four buttons show', s.moves.length === 4 && ['top', 'up', 'down', 'bottom'].every((h) => s.moves.some((m) => m.how === h)), JSON.stringify(s.moves));
			ok(sec + ': each is an icon with its name as its accessible name', s.moves.every((m) => m.icon && m.text === '' && m.label === names[m.how]),
				JSON.stringify(s.moves.map((m) => [m.how, m.icon, m.label])));
			ok(sec + ': each carries a tip that begins with its name', s.moves.every((m) => m.title.indexOf(names[m.how]) === 0), JSON.stringify(s.moves.map((m) => m.title)));
			if (runTip[sec]) { ok(sec + ': the tip says a move can change a run', s.moves.every((m) => m.title.indexOf(runTip[sec]) > 0)); }
			else { ok(sec + ': the tip does not claim a move changes a run', s.moves.every((m) => !/change a run/.test(m.title))); }
			ok(sec + ': with nothing selected, all four are disabled', s.moves.every((m) => m.disabled) && !s.sel.some(Boolean), dis(s));

			// select the LAST entry by clicking in it
			const last = start.length - 1;
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(last).locator('input, textarea').first().click();
			s = await state();
			ok(sec + ': clicking an entry marks it', s.sel[last] === true && s.sel.filter(Boolean).length === 1, JSON.stringify(s.sel));
			ok(sec + ': at the bottom, Up and Top can act and Down and Bottom cannot', dis(s) === 'top:on up:on down:off bottom:off', dis(s));

			// Move to top by mouse
			await a.page.locator('#lpn_lib_move_top').click();
			await a.settle(200);
			let r = await rows();
			ok(sec + ': Move to top puts that item first', r[0] === start[last] && r.length === start.length, JSON.stringify([start, r]));
			s = await state();
			ok(sec + ': the mark follows it', s.sel[0] === true && s.sel.filter(Boolean).length === 1);
			ok(sec + ': at the top, Down and Bottom can act and Up and Top cannot', dis(s) === 'top:off up:off down:on bottom:on', dis(s));
			if (SHOTS) { await a.page.screenshot({ path: path.join(SHOTS, sec + '.png') }); }

			// keyboard: focus Move down, press Enter, twice (the second from a button that stays enabled while there is room)
			await a.page.locator('#lpn_lib_move_down').focus();
			await a.page.keyboard.press('Enter');
			await a.settle(200);
			r = await rows();
			ok(sec + ': Enter on Move down moves it down one', r[1] === start[last] && r[0] === start[0], JSON.stringify([start, r]));
			s = await state();
			ok(sec + ': and the focus is still on a button that can act', !!s.focusMove && !s.focusMove.disabled, JSON.stringify(s.focusMove));
			await a.page.locator('#lpn_lib_move_top').focus();
			await a.page.keyboard.press('Space');
			await a.settle(200);
			r = await rows();
			ok(sec + ': Space on Move to top takes it first again', r[0] === start[last], JSON.stringify(r));
			await a.page.locator('#lpn_lib_move_bottom').focus();
			await a.page.keyboard.press('Space');
			await a.settle(200);
			r = await rows();
			ok(sec + ': Space on Move to bottom takes it to the end', r[r.length - 1] === start[last], JSON.stringify(r));
			s = await state();
			ok(sec + ': the focus left the disabled button for one that can act', !!s.focusMove && !s.focusMove.disabled, JSON.stringify(s.focusMove));

			// one Ctrl+Z undoes ONE move
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(0).locator('.lpn-lib-id, input, textarea').first().blur().catch(() => {});
			await P(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await a.page.keyboard.press('Control+z');
			await a.settle(300);
			r = await rows();
			ok(sec + ': one Ctrl+Z puts it one step back', r[0] === start[last] && r.length === start.length, JSON.stringify(r));
		}
		const alive = await P(() => !!document.getElementById('lpn_library_box'));
		ok('the page is still alive', alive);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails === 0 ? '\n' + NAME + ': all checks passed' : '\n' + NAME + ': ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });

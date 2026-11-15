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
//   6. Controls and Rules say in the tip how the order decides a conflict, the other four say it never changes a run, and the `?` on
//      Controls and on Rules opens the User Manual at the one entry that says the same words;
//   7. the first press after typing in an item (a rename rebuilds the box) acts, and the item stays selected;
//   8. a control or rule has no ID, so it is selected by position: Delete then Add leaves nothing selected (no item the user never chose),
//      and typing a second RULE into a rule's text rebuilds the box, so the entries and the buttons are not stale.
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
		const noneTip = await a.lang('lpn_library_move_tip_none');

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
			if (runTip[sec]) { ok(sec + ': the tip says how the order decides a conflict', s.moves.every((m) => m.title.indexOf(runTip[sec]) > 0) && s.moves.every((m) => m.title.indexOf(noneTip) < 0)); }
			else { ok(sec + ': the tip says the order never changes a run', s.moves.every((m) => m.title.indexOf(noneTip) > 0) && s.moves.every((m) => m.title.indexOf(runTip.controls) < 0 && m.title.indexOf(runTip.rules) < 0)); }
			{
				// the `?` beside the heading opens the manual at the entry that says the Move tip's sentence in the same words: a tap on Move
				// moves the item, so the tip cannot be read by a tap, and the entry can
				const stem = { controls: 'ctl', rules: 'ctl' }[sec] || sec, sentence = runTip[sec] || noneTip;
				const q = a.page.locator('#lpn_libbox_content .lpn-lib-sec > h3 button.lpn-lib-manual');
				ok(sec + ': the heading carries one `?`, with no title (a tap cannot hover)', (await q.count()) === 1 && (await q.getAttribute('title')) === null);
				await q.click();
				await a.settle(900);
				const g = await P((stem) => {
					const b = document.getElementById('lpn_hotkeys_popup'), c = document.getElementById('lpn_guide_content'), dt = c.querySelector('#guide-term-lpn_guide_lib_' + stem);
					if (!dt || !b) { return { found: false }; }
					const cr = c.getBoundingClientRect(), r = dt.getBoundingClientRect();
					return { found: true, open: getComputedStyle(b).display !== 'none', top: Math.round(r.top - cr.top), paneH: Math.round(cr.height), term: dt.textContent.trim(), text: dt.nextElementSibling.textContent };
				}, stem);
				ok(sec + ': the `?` opens the manual at its own entry, in view', g.found && g.open && g.top >= -2 && g.top < g.paneH, JSON.stringify(g));
				ok(sec + ': that entry says the Move tip\'s sentence word for word', g.found && g.text.indexOf(sentence) >= 0, g.text);
				if (SHOTS) { await a.page.screenshot({ path: path.join(SHOTS, sec + '-manual-r2.png') }); }
				await P(() => { const x = document.querySelector('#lpn_hotkeys_popup .lpn-popover-x'); if (x) { x.click(); } });
				await a.settle(300);
			}
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

			// THE FIRST PRESS AFTER TYPING ACTS (Perry's review): a field edited and not yet left is committed by the press itself, a rename
			// rebuilds the box under the pointer, and the selection follows the item through it.
			const cur = await rows(), tl = cur.length - 1, entry = a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(tl);
			const field = sec === 'controls' ? entry.locator('input[type=text]').first()
				: sec === 'rules' ? entry.locator('textarea:not(.lpn-lib-desc)').first() : entry.locator('.lpn-lib-id').first();
			const was = await field.inputValue();
			await field.click();
			await field.fill(sec === 'rules' ? was + '\n' : sec === 'controls' ? was + ' ' : was + 'X');
			const typed = await rows();
			await a.page.locator('#lpn_lib_move_top').click();
			await a.settle(300);
			const norm = (x) => x.split('|').map((t) => t.trim()).join('|');
			r = await rows();
			ok(sec + ': the first press after typing in the item moves it', norm(r[0]) === norm(typed[tl]) && r.length === cur.length, JSON.stringify([typed, r]));
			s = await state();
			ok(sec + ': ...and it is still the selected item', s.sel[0] === true && dis(s) === 'top:off up:off down:on bottom:on', dis(s) + JSON.stringify(s.sel));
		}
		console.log('\n--- selection by position ---');
		const marked = () => P(() => Array.prototype.map.call(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry'), (e) => e.classList.contains('lpn-lib-entry-sel')));
		const addBtn = () => a.page.locator('#lpn_libbox_content > section > .lpn-lib-toolrow > button, #lpn_libbox_content > section > button').first();
		for (const sec of ['controls', 'rules']) {
			await openLib(sec);
			for (let k = 0; k < 4 && (await rows()).length < 3; k++) { await addBtn().click(); await a.settle(300); }
			let n = (await rows()).length;
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(n - 1).click({ position: { x: 4, y: 4 } });
			let m = await marked();
			ok(sec + ': the last item is selected', m[n - 1] === true && m.filter(Boolean).length === 1, JSON.stringify(m));
			// Delete the first, Add one: the count is the same again, and the old position must not be selected
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(0).locator('.lpn-lib-del').click();
			await a.settle(300);
			await addBtn().click();
			await a.settle(300);
			m = await marked();
			const st2 = await state();
			ok(sec + ': after Delete and Add the same count is back and nothing is selected', (await rows()).length === n && !m.some(Boolean) && st2.moves.every((x) => x.disabled), JSON.stringify([m, dis(st2)]));
		}
		// ONE TIP AT A TIME (Perry): a control's field keeps its own long tip while it has focus; hovering a Move button must close it
		{
			await openLib('controls');
			const field = a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(1).locator('input[type=text]').first();
			await field.click();
			await a.settle(900);
			const upBefore = await P(() => document.querySelectorAll('.tooltip.show').length);
			await a.page.mouse.move(5, 5);
			await a.page.locator('#lpn_lib_move_up').hover();
			await a.settle(1500);
			const tips = await P(() => Array.prototype.map.call(document.querySelectorAll('.tooltip.show'), (t) => t.textContent.trim().slice(0, 40)));
			ok('the field\'s own tip is up before the pointer goes to Move up (' + upBefore + ')', upBefore >= 1);
			ok('with the pointer on Move up exactly one tip is up, and it is the Move tip', tips.length === 1 && tips[0].indexOf(names.up) === 0, JSON.stringify(tips));
		}
		// a rule's text that comes to hold another rule: the box is built again
		{
			await openLib('rules');
			const before = (await rows()).length;
			const f = a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(0).locator('textarea:not(.lpn-lib-desc)').first();
			await f.click();
			const v = await f.inputValue();
			await f.fill(v + '\n\nRULE ZZ9\nIF SYSTEM CLOCKTIME >= 3 AM\nTHEN PUMP 10 STATUS IS OPEN');
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(1).click({ position: { x: 4, y: 4 } });
			await a.settle(500);
			const now = await rows();
			ok('typing a second RULE into a rule makes the box show one more entry', now.length === before + 1, before + ' -> ' + now.length);
			// the entries are the document's: pressing Move top on the new last one puts it first, and the text of that rule is the one typed
			await a.page.locator('#lpn_libbox_content .lpn-lib-entry').nth(now.length - 1).click({ position: { x: 4, y: 4 } });
			await a.page.locator('#lpn_lib_move_top').click();
			await a.settle(300);
			const r2 = await rows();
			ok('...and Move to top then acts on the rule that was selected', r2.length === now.length && r2[0] === now[now.length - 1], JSON.stringify([now.slice(-1), r2.slice(0, 1)]));
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

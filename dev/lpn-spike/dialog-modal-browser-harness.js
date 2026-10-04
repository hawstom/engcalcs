// THE PAGE'S ONE QUESTION BOX, CLICKED IN A REAL CHROME (ROADMAP Task 710).
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/dialog-modal-browser-harness.js
//
// Tom, 2026-10-04: *"The browser-style boxes aren't pretty. I think they all should be converted."*
// Every alert/confirm/prompt on the Looped Network page is now askDialog() (EngCalcs.lpnAsk), drawn
// in #lpn_dialog. This run deletes the harness seam (window.lpnDialogAnswerer, which the browser-pass
// Session installs) and answers the real box the way a visitor does:
//
//   (1) it looks like the page's other boxes: the same title band class, background and border as
//       the Settings box, and the buttons are the page's plain buttons;
//   (2) it is a modal dialog to a screen reader: role alertdialog/dialog, aria-modal, labelled by
//       its title and described by its message;
//   (3) Enter is the default button, Escape is Cancel, Tab stays inside, and focus goes back to
//       whatever had it;
//   (4) a prompt's field takes focus with its text selected, and a second question waits its turn;
//   (5) on a phone in tall mode (390 px) it fits inside the window;
//   (6) a real call site -- Background image > Scale by picking -- asks its distance in the box,
//       and the "Adjusting the background image" bar wears the same light dress as every other box
//       (Tom: *"It is in dark mode unlike everything else."*);
//   (7) no native dialog is raised anywhere in it;
//   (8) on a phone the registration bar is a short band along the foot, not a column over the map;
//   (9) a HELD Enter on Edit > Delete network opens the box and never presses its OK (Perry,
//       2026-10-04: the auto-repeat deleted all 45 nodes); a fresh Enter still confirms, and
//       Ctrl+Z, Ctrl+Y and the Undo button take the deletion back and forth;
//  (10) the title band never lies over the message, for every kind, at three window sizes;
//  (11) Save as opens the file picker and no box; Revert confirms in the box and reloads the file;
//  (12) georeferencing's questions (Go to, site width, the two-point pick, Keep this placement)
//       each take every typed character, the pick's too, though it opens on a press on the map.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DIALOG_MODAL_BROWSER_LOCKED';
const NAME = 'dialog-modal-browser-harness';

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

let Session;
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function openSession(browser, viewport, natives) {
	const a = await Session.open(browser, NAME, { viewport });
	a.page.on('dialog', (d) => { natives.push(d.type() + ': ' + d.message()); d.dismiss().catch(() => {}); });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => {
		const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
		// The real box, not the seam: this run answers it by hand.
		delete window.lpnDialogAnswerer;
	});
	await a.settle(1500);
	return a;
}
// Ask through the page's own door and keep the answer where the test can read it.
function ask(a, req) {
	return a.page.evaluate((r) => {
		window.__answers = window.__answers || [];
		EngCalcs.lpnAsk(r, (v) => { window.__answers.push(v === undefined ? '(alert)' : v); });
	}, req);
}
const answers = (a) => a.page.evaluate(() => (window.__answers || []).slice());
const box = (a) => a.page.evaluate(() => {
	const d = document.getElementById('lpn_dialog');
	if (!d || getComputedStyle(d).display === 'none') { return null; }
	const r = d.getBoundingClientRect(), ae = document.activeElement;
	const title = document.getElementById('lpn_dialog_title');
	return {
		role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'),
		labelledby: d.getAttribute('aria-labelledby'), describedby: d.getAttribute('aria-describedby'),
		title: title ? title.textContent : '', titleClass: title ? title.className : '',
		titleShown: !!title && getComputedStyle(title).display !== 'none',
		text: (document.getElementById('lpn_dialog_body') || {}).textContent || '',
		buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent),
		buttonClasses: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.className),
		focusInside: d.contains(ae), focusTag: ae ? ae.tagName : '', focusText: ae ? (ae.textContent || ae.value || '') : '',
		selected: ae && ae.tagName === 'INPUT' ? ae.selectionEnd - ae.selectionStart : -1,
		left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: window.innerWidth, vh: window.innerHeight,
		bg: getComputedStyle(d).backgroundColor, border: getComputedStyle(d).borderTopColor
	};
});

async function sectionComponent(browser) {
	console.log('\n--- the box itself, on a desk ---');
	const natives = [];
	const a = await openSession(browser, { width: 1400, height: 900 }, natives);
	const pc = await a.page.evaluate(() => ({ ok: EngCalcs.pageConfig.lpn_dialog_ok, cancel: EngCalcs.pageConfig.lpn_cancel, name: EngCalcs.pageConfig.lpn_main_menu }));
	const setbox = await a.page.evaluate(() => {
		const s = document.getElementById('lpn_settings_box');
		return { bg: getComputedStyle(s).backgroundColor, border: getComputedStyle(s).borderTopColor };
	});
	// Something the visitor had focused before the question, to come back to.
	await a.page.focus('#lpn_menu_edit');

	await ask(a, { kind: 'confirm', text: 'Delete the thing?' });
	let b = await box(a);
	ok('a confirm opens the in-page box', !!b);
	ok('it is an alertdialog, aria-modal', b && b.role === 'alertdialog' && b.modal === 'true', b && b.role + ' ' + b.modal);
	ok('labelled by its title, described by its message', b && b.labelledby === 'lpn_dialog_title' && b.describedby === 'lpn_dialog_body');
	ok('the title band is the page\'s own (.lpn-setbox-title) and names the page', b && b.titleShown && b.titleClass === 'lpn-setbox-title' && b.title === pc.name, b && b.title);
	ok('the same background and border as the Settings box', b && b.bg === setbox.bg && b.border === setbox.border, b && (b.bg + ' / ' + b.border));
	ok('OK and Cancel, plain page buttons dressed alike', b && b.buttons.join('|') === pc.ok + '|' + pc.cancel && b.buttonClasses.every((c) => c === ''), b && b.buttons.join('|'));
	ok('focus is on OK', b && b.focusInside && b.focusTag === 'BUTTON' && b.focusText === pc.ok, b && b.focusText);
	for (let i = 0; i < 4; i++) { await a.page.keyboard.press('Tab'); }
	b = await box(a);
	ok('Tab four times: focus is still inside the box', b && b.focusInside, b && b.focusTag);
	await a.page.keyboard.press('Shift+Tab');
	b = await box(a);
	ok('Shift+Tab too', b && b.focusInside);
	await a.page.focus('#lpn_dialog_buttons button');
	await a.page.keyboard.press('Enter');
	await a.settle(200);
	ok('Enter answers yes and closes it', (await answers(a)).join() === 'true' && !(await box(a)), JSON.stringify(await answers(a)));
	ok('focus goes back to what had it', await a.page.evaluate(() => document.activeElement && document.activeElement.id) === 'lpn_menu_edit');

	await ask(a, { kind: 'confirm', text: 'Again?' });
	await a.page.keyboard.press('Escape');
	await a.settle(200);
	ok('Escape answers no', (await answers(a))[1] === false && !(await box(a)), JSON.stringify(await answers(a)));

	await ask(a, { kind: 'prompt', text: 'Name for this scenario', value: 'Scenario 1' });
	b = await box(a);
	ok('a prompt is a dialog (not alertdialog) with a field', b && b.role === 'dialog' && b.focusTag === 'INPUT');
	ok('the field has focus with its text selected', b && b.selected === 'Scenario 1'.length, b && b.selected);
	await a.page.keyboard.type('Peak hour');
	await a.page.keyboard.press('Enter');
	await a.settle(200);
	ok('typing and Enter answers the typed text', (await answers(a))[2] === 'Peak hour', JSON.stringify(await answers(a)));

	await ask(a, { kind: 'prompt', text: 'Name?', value: 'x' });
	await a.page.click(`#lpn_dialog_buttons button:text-is("${pc.cancel}")`);
	await a.settle(200);
	ok('Cancel answers null', (await answers(a))[3] === null);

	// Two questions at once: the second waits for the first, as two native dialogs did.
	await ask(a, { kind: 'confirm', text: 'First question' });
	await ask(a, { kind: 'alert', text: 'Second message' });
	b = await box(a);
	ok('the first question is the one showing', b && b.text === 'First question', b && b.text);
	await a.page.keyboard.press('Enter');
	await a.settle(200);
	b = await box(a);
	ok('answered, the second one takes its place', b && b.text === 'Second message' && b.buttons.length === 1, b && b.text);
	await a.page.keyboard.press('Escape');
	await a.settle(200);
	ok('an alert closes on Escape', !(await box(a)) && (await answers(a)).slice(4).join() === 'true,(alert)', JSON.stringify(await answers(a)));

	// The backdrop still swallows a click: the map underneath does not hear it.
	await ask(a, { kind: 'confirm', text: 'Modal?' });
	const back = await a.page.evaluate(() => {
		const d = document.getElementById('lpn_dialog_backdrop');
		const el = document.elementFromPoint(20, window.innerHeight - 20);
		return { shown: getComputedStyle(d).display !== 'none', top: el === d };
	});
	ok('the scrim is over the page while it asks', back.shown && back.top, JSON.stringify(back));
	await a.page.keyboard.press('Escape');

	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionPhone(browser) {
	console.log('\n--- a phone in tall mode (390 x 844) ---');
	const natives = [];
	const a = await openSession(browser, { width: 390, height: 844 }, natives);
	const long = await a.page.evaluate(() => EngCalcs.pageConfig.lpn_confirm_wipe);
	await ask(a, { kind: 'confirm', text: long });
	const b = await box(a);
	ok('the box fits inside the window', b && b.left >= 0 && b.right <= b.vw && b.top >= 0 && b.bottom <= b.vh, b && JSON.stringify([b.left, b.right, b.top, b.bottom, b.vw, b.vh]));
	ok('with both buttons on screen', b && b.buttons.length === 2);
	ok('a long question uses the width of the phone, not half of it', b && b.right - b.left >= b.vw - 40, b && String(b.right - b.left));
	await a.page.keyboard.press('Escape');
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	await a.close();
}

async function menuRow(a, sel, label) {
	return a.page.evaluate(([s, l]) => {
		const r = Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).find((x) => x.textContent.indexOf(l) >= 0);
		if (r) { r.click(); }
		return !!r;
	}, [sel, label]);
}
async function sectionScaleByPicking(browser) {
	console.log('\n--- Background image > Scale by picking ---');
	const natives = [];
	const a = await openSession(browser, { width: 1400, height: 900 }, natives);
	const names = await a.page.evaluate(() => ({
		b: EngCalcs.pageConfig.lpn_backdrop_menu, s: EngCalcs.pageConfig.lpn_backdrop_scale,
		ask: EngCalcs.pageConfig.lpn_backdrop_scale_prompt2
	}));
	await a.page.setInputFiles('#lpn_backdrop_file', { name: 'pic.png', mimeType: 'image/png', buffer: PNG });
	await a.settle(1500);
	await a.page.click('#lpn_menu_map');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	ok('Map > Background image', await menuRow(a, '#lpn_menu_list', names.b));
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	ok('> Scale by picking', await menuRow(a, '#lpn_menu_list2', names.s));
	await a.settle(400);
	const dress = await a.page.evaluate(() => {
		const bar = document.getElementById('lpn_regmode_bar'), s = document.getElementById('lpn_settings_box');
		if (!bar) { return null; }
		const cb = getComputedStyle(bar), cs = getComputedStyle(s);
		return { bg: cb.backgroundColor, sbg: cs.backgroundColor, color: cb.color, border: cb.borderTopColor, sborder: cs.borderTopColor, bw: cb.borderTopWidth };
	});
	ok('the "Adjusting the background image" bar is up', !!dress);
	ok('it wears the Settings box\'s light background, not a dark one', dress && dress.bg === dress.sbg, dress && dress.bg + ' vs ' + dress.sbg);
	ok('and its one-pixel border', dress && dress.border === dress.sborder && dress.bw === '1px', dress && JSON.stringify(dress));
	// Two points on the bare map: a fresh page puts the Examples cards over its middle, and a
	// click there opens an example instead.
	const pts = await a.page.evaluate(() => {
		const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect(), out = [];
		for (let y = r.top + 40; y < Math.min(r.bottom, window.innerHeight) - 40 && out.length < 2; y += 37) {
			for (let x = r.left + 40; x < r.right - 40 && out.length < 2; x += 53) {
				const e = document.elementFromPoint(x, y);
				if (e && e.closest && e.closest('#lpn_canvas') && (!out.length || Math.abs(out[0][0] - x) > 150)) { out.push([x, y]); y += 0; }
			}
		}
		return out;
	});
	ok('two bare points on the map to pick', pts.length === 2, JSON.stringify(pts));
	for (const [x, y] of pts) { await a.page.mouse.click(x, y); await a.settle(250); }
	const b = await box(a);
	ok('the second click asks the distance in the page\'s box', b && b.text.indexOf(names.ask) === 0 && b.focusTag === 'INPUT', b && b.text);
	await a.page.keyboard.press('Escape');
	await a.settle(200);
	ok('Escape closes it, and the mode is over', !(await box(a)) && !(await a.page.evaluate(() => !!document.getElementById('lpn_regmode_bar'))));
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionPhoneBar(browser) {
	console.log('\n--- the registration bar on a phone (390 x 844) ---');
	const natives = [];
	const a = await openSession(browser, { width: 390, height: 844 }, natives);
	const names = await a.page.evaluate(() => ({ b: EngCalcs.pageConfig.lpn_backdrop_menu, s: EngCalcs.pageConfig.lpn_backdrop_scale }));
	await a.page.setInputFiles('#lpn_backdrop_file', { name: 'pic.png', mimeType: 'image/png', buffer: PNG });
	await a.settle(1500);
	await a.page.click('#lpn_menu_map');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	ok('Map > Background image', await menuRow(a, '#lpn_menu_list', names.b));
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	ok('> Scale by picking', await menuRow(a, '#lpn_menu_list2', names.s));
	await a.settle(400);
	const r = await a.page.evaluate(() => {
		const bar = document.getElementById('lpn_regmode_bar'), map = document.getElementById('lpn_canvas');
		if (!bar) { return null; }
		const b = bar.getBoundingClientRect(), m = map.getBoundingClientRect();
		const visTop = Math.max(m.top, 0), visBottom = Math.min(m.bottom, window.innerHeight);
		const overlap = Math.max(0, Math.min(b.bottom, visBottom) - Math.max(b.top, visTop));
		return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, w: b.width, h: b.height,
			vw: window.innerWidth, vh: window.innerHeight, share: overlap / (visBottom - visTop) };
	});
	ok('the bar is up', !!r);
	ok('it spans the phone, less gutters (>= 340 px of 390)', r && r.w >= 340 && r.left >= 0 && r.right <= r.vw, r && JSON.stringify(r));
	ok('it sits along the foot of the window', r && r.vh - r.bottom <= 16, r && String(r.vh - r.bottom));
	ok('it covers no more than a fifth of the visible map', r && r.share <= 0.2, r && r.share.toFixed(3) + ' (' + Math.round(r.h) + ' px tall)');
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	await a.close();
}

async function sectionHeldEnter(browser) {
	console.log('\n--- holding Enter on Edit > Delete network ---');
	const natives = [];
	const a = await openSession(browser, { width: 1400, height: 900 }, natives);
	await a.page.evaluate(() => {
		const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
		const card = cards.find((c) => /Net1/.test(c.textContent || '')) || cards[0];
		card.click();
	});
	await a.settle(2000);
	await a.page.evaluate(() => { delete window.lpnDialogAnswerer; });
	const nodes = () => a.page.evaluate(() => document.querySelectorAll('#lpn_canvas [data-node]').length);
	const before = await nodes();
	ok('an example network is open', before > 0, before + ' node elements');
	const label = await a.page.evaluate(() => EngCalcs.pageConfig.lpn_edit_delete_network);
	await a.page.click('#lpn_menu_edit');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const focused = await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((x) => x.textContent.indexOf(l) >= 0);
		if (r) { r.focus(); }
		return !!r && document.activeElement === r;
	}, label);
	ok('the Delete network row has the focus', focused);
	// Held: one press, then the auto-repeat (Playwright sends repeat=true for a key already down).
	for (let i = 0; i < 12; i++) { await a.page.keyboard.down('Enter'); await a.page.waitForTimeout(35); }
	await a.page.keyboard.up('Enter');
	await a.settle(300);
	const b = await box(a);
	ok('the held Enter opened the question', !!b, b && b.text.slice(0, 40));
	ok('...and did not answer it: every node is still there', (await nodes()) === before, String(await nodes()));
	// The button's own keyboard activation is a click with detail 0; before a fresh key inside the
	// box, one is ignored.
	await a.page.evaluate(() => document.querySelector('#lpn_dialog_buttons button').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 })));
	await a.settle(300);
	ok('a keyboard click on OK before any fresh key does not answer it either', !!(await box(a)) && (await nodes()) === before);
	await a.page.keyboard.press('Enter');
	await a.settle(800);
	ok('a fresh Enter confirms: the network is deleted', !(await box(a)) && (await nodes()) === 0, String(await nodes()));
	// Tom, 2026-10-04: *"Undo key doesn't work for Delete network."* One undoable step now.
	await a.page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
	await a.page.keyboard.press('Control+z');
	await a.settle(800);
	ok('Ctrl+Z gives the whole network back', (await nodes()) === before, String(await nodes()));
	await a.page.keyboard.press('Control+y');
	await a.settle(800);
	ok('Ctrl+Y deletes it again', (await nodes()) === 0, String(await nodes()));
	const undoClicked = await a.page.evaluate((l) => {
		const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent && (x.getAttribute('aria-label') === l || x.title === l || (x.textContent || '').trim() === l));
		if (b) { b.click(); }
		return !!b;
	}, await a.page.evaluate(() => EngCalcs.pageConfig.lpn_tool_undo));
	await a.settle(800);
	ok('the Undo button gives it back too', undoClicked && (await nodes()) === before, undoClicked + ' ' + (await nodes()));
	ok('the question no longer says it cannot be undone', await a.page.evaluate(() => !/undone/.test(EngCalcs.pageConfig.lpn_confirm_delete_network)));
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionTitleBand(browser) {
	// Tom, 2026-10-04 (Delete network): the title band lay over the first line of the question,
	// because the box's inline `padding: 12px` outranked the titled rule's top padding.
	for (const vp of [{ width: 1440, height: 900 }, { width: 1100, height: 700 }, { width: 390, height: 844 }]) {
		console.log('\n--- the title band clears the message (' + vp.width + ' x ' + vp.height + ') ---');
		const natives = [];
		const a = await openSession(browser, vp, natives);
		const long = await a.page.evaluate(() => EngCalcs.pageConfig.lpn_confirm_wipe);
		for (const kind of ['alert', 'confirm', 'prompt', 'copy']) {
			await ask(a, { kind, text: long, value: 'x' });
			const r = await a.page.evaluate(() => {
				const d = document.getElementById('lpn_dialog'), t = document.getElementById('lpn_dialog_title');
				const m = document.querySelector('#lpn_dialog_body .lpn-dialog-msg');
				if (!d || !t || !m) { return null; }
				const dr = d.getBoundingClientRect(), tr = t.getBoundingClientRect(), mr = m.getBoundingClientRect();
				return { tb: tr.bottom, mt: mr.top, left: dr.left, top: dr.top, w: dr.width, vw: window.innerWidth, vh: window.innerHeight };
			});
			ok(kind + ': the title band\'s bottom is above the message\'s top', r && r.tb <= r.mt, r && (r.tb + ' vs ' + r.mt));
			ok(kind + ': the box is centred across the window, not in a corner', r && Math.abs(r.left + r.w / 2 - r.vw / 2) <= 2 && r.top >= r.vh * 0.1, r && JSON.stringify([r.left, r.top, r.w]));
			await a.page.keyboard.press('Escape');
			await a.settle(150);
		}
		ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
		await a.close();
	}
}

async function sectionSaveAsRevert(browser) {
	// Tom, 2026-10-04: *"I don't see a dialog on Save as, but Revert also is buggy."* Save as asks
	// no question of its own: the browser's file picker is its box (after the one-time panel about
	// that picker). Revert asks its one confirm in the page's box, and OK puts the file back.
	console.log('\n--- File > Save as, then File > Revert, in the real box ---');
	const natives = [];
	const a = await openSession(browser, { width: 1440, height: 900 }, natives);
	await a.openExampleCard(await a.page.evaluate(() => EngCalcs.pageConfig.lpn_ex_net1_title));
	await a.settle(1500);
	await a.page.evaluate(() => { delete window.lpnDialogAnswerer; });
	const L = await a.page.evaluate(() => ({ sa: EngCalcs.pageConfig.lpn_file_saveas, rv: EngCalcs.pageConfig.lpn_file_revert, ok: EngCalcs.pageConfig.lpn_dialog_ok }));
	const before = await a.nodeCount();
	await a.queuePick('net1-revert.lwn');
	await a.menuClick(L.sa);
	await a.settle(600);
	if (await a.dialog()) { await a.answerTrainingPanel(); await a.settle(1500); }
	ok('Save as opens the file picker, and the file is written', (await a.pickerCalls()).some((c) => c.kind === 'save') && (await a.listFiles()).indexOf('net1-revert.lwn') >= 0);
	ok('...with no question box left open', !(await box(a)));
	await a.makeEdit();
	ok('an edit makes the tab unsaved', (await a.nodeCount()) === before + 1 && await a.currentTabDirty());
	await a.menuClick(L.rv);
	await a.settle(400);
	const b = await box(a);
	ok('Revert asks in the page\'s box, naming the file', b && b.text.indexOf('net1-revert.lwn') >= 0 && b.buttons.length === 2, b && b.text);
	await a.page.click(`#lpn_dialog_buttons button:text-is("${L.ok}")`);
	await a.settle(1500);
	ok('OK loads the file again: the edit is gone and the tab is saved', !(await box(a)) && (await a.nodeCount()) === before && !(await a.currentTabDirty()), String(await a.nodeCount()));
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function sectionGeoref(browser) {
	// Tom, 2026-10-04: *"...so is georeference."* File > Convert as, Go to (two questions in a row),
	// the two-point pick, and Keep this placement, every question in the real box. The pick's
	// question opens on a press on the map, whose own default action took the field's focus, so the
	// first typed character was lost (34.61 became 4.61).
	console.log('\n--- georeferencing: Convert as, Go to, two-point pick, Keep this placement ---');
	const natives = [];
	const a = await openSession(browser, { width: 1440, height: 900 }, natives);
	const page = a.page;
	await page.unroute(/tile\.openstreetmap\.org|api\.mapbox\.com/);
	await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
	const S = (k) => a.lang(k);
	const f = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
	f.project = Object.assign({}, f.project, { name: 'Elm' });
	delete f.project.gallery;
	await a.writeFile('Elm.lwn', JSON.stringify(f));
	await a.queuePick('Elm.lwn');
	await a.menuClick(await S('lpn_file_open'));
	await a.settle(800);
	if (await a.dialog()) { await a.answerTrainingPanel(); await a.settle(1500); }
	await a.menuClick(await S('lpn_file_convert_as'));
	await page.waitForSelector('#lpn_convas_panel', { state: 'visible' });
	await page.check('#lpn_convas_kind_epsg').catch(() => {});
	await page.click('#lpn_convas_ok');
	await a.settle(1500);
	await page.evaluate(() => { delete window.lpnDialogAnswerer; });
	const field = () => page.evaluate(() => {
		const d = document.getElementById('lpn_dialog'), ae = document.activeElement;
		if (!d || getComputedStyle(d).display === 'none') { return null; }
		return { text: (document.getElementById('lpn_dialog_body') || {}).textContent || '', inField: !!ae && ae.classList.contains('lpn-dialog-input'), value: ae && ae.value };
	});
	// Types the answer and reads it back BEFORE Enter, so a lost keystroke is seen as itself.
	async function answer(label, text) {
		const fb = await field();
		ok(label + ': asked in the page\'s box, with the focus in its field', fb && fb.inField, fb && JSON.stringify(fb));
		await page.keyboard.type(text);
		const fa = await field();
		ok(label + ': every typed character arrives', fa && fa.value === text, fa && fa.value);
		await page.keyboard.press('Enter');
		await a.settle(900);
	}
	await page.click('#lpn_georef_goto');
	await a.settle(500);
	await answer('Go to', '34.61,-112.32');
	await answer('...then the site width', '300');
	await page.click('#lpn_georef_drop');
	await a.settle(800);
	await page.click('#lpn_georef_twopt');
	await a.settle(400);
	const pts = await page.evaluate(() => [...document.querySelectorAll('#lpn_canvas [data-node]')]
		.map((e) => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })
		.filter(([x, y]) => x > 60 && y > 160 && x < innerWidth - 60 && y < innerHeight - 60));
	ok('nodes on screen to pick', pts.length >= 2, String(pts.length));
	if (pts.length >= 2) {
		const p1 = pts[0];
		const p2 = pts.reduce((b, p) => (Math.hypot(p[0] - p1[0], p[1] - p1[1]) > Math.hypot(b[0] - p1[0], b[1] - p1[1]) ? p : b), p1);
		await page.mouse.click(p1[0], p1[1]);
		await a.settle(500);
		await answer('first picked point', '34.61,-112.32');
		ok('...and the second point is asked for', await a.notice() === await S('lpn_georef_twopt_pick2'), await a.notice());
		await page.mouse.click(p2[0], p2[1]);
		await a.settle(500);
		await answer('second picked point', '34.62,-112.31');
		ok('...and the model sits on the two points', await a.notice() === await S('lpn_georef_twopt_done'), await a.notice());
	}
	await page.click('#lpn_georef_finish');
	await a.settle(600);
	const fin = await box(a);
	ok('Keep this placement asks in the page\'s box', fin && fin.text === await S('lpn_georef_confirm') && fin.focusInside, fin && fin.text.slice(0, 40));
	await page.keyboard.press('Enter');
	await a.settle(1500);
	ok('...and OK ends the wizard on a lat/lon project', !(await box(a)) && !(await page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none')) &&
		await page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_' + JSON.parse(localStorage.getItem('lpn_index')).openId)).project.coords === 'geo'));
	ok('no native dialog was raised', natives.length === 0, natives.join(' | '));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		await sectionComponent(browser);
		await sectionPhone(browser);
		await sectionTitleBand(browser);
		await sectionScaleByPicking(browser);
		await sectionPhoneBar(browser);
		await sectionHeldEnter(browser);
		await sectionSaveAsRevert(browser);
		await sectionGeoref(browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

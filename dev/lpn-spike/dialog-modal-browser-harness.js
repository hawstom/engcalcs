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
//       2026-10-04: the auto-repeat deleted all 45 nodes); a fresh Enter still confirms.
'use strict';

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
		await sectionScaleByPicking(browser);
		await sectionPhoneBar(browser);
		await sectionHeldEnter(browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

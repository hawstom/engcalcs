// HIDING A STANDING MESSAGE, AND THE ZOOM WINDOW DOORS, in a real Chrome.
//
//   node dev/lpn-spike/message-dismiss-browser-harness.js     (takes the browser lock itself)
//
// Tom, 2026-10-07: dismiss "no path to a reservoir"; and "a way to zoom window without Zoom to Fit
// first". Covers: x on a hideable message, hide, chip restores, different text shows again, same
// text stays hidden across solves, opening another network clears it, no x on "Add a reservoir",
// nothing in localStorage, and the Map menu row and the W key entering Zoom Window with a drag zooming.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MESSAGE_DISMISS_BROWSER_LOCKED';
const NAME = 'message-dismiss-browser-harness';

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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(1000);
		await a.newProject('us');
		const myTab = (await a.tabs()).findIndex((t) => t.current);

		const st = () => page.evaluate(() => {
			const vis = (id) => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; };
			return {
				text: document.getElementById('lpn_status_text').textContent,
				box: vis('lpn_status'), x: vis('lpn_status_dismiss'), chip: vis('lpn_status_chip'), wrong: vis('lpn_wrong_status_btn'),
				chipText: document.getElementById('lpn_status_chip').textContent
			};
		});
		const place = async (tool, fx, fy) => {
			await a.dismissGallery();
			await a.toolbarClick(tool);
			const r = await page.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
			await page.mouse.click(r.x + r.w * fx, r.y + r.h * fy);
			await a.settle(900);
			await a.toolbarClick('Select');
			await a.settle(500);
		};
		const wait = () => a.settle(1200);

		console.log('\n--- a message that means no result has no x ---');
		await place('Junction', 0.3, 0.4);
		await wait();
		let s = await st();
		const noRes = await a.lang('lpn_diag_no_fixed_head');
		ok('"Add a reservoir" is on screen', s.box && s.text.indexOf(noRes) === 0, s.text);
		ok('...and has no x', !s.x);

		console.log('\n--- a hideable message ---');
		await place('Reservoir', 0.6, 0.6);
		await wait();
		s = await st();
		const unreach = await a.lang('lpn_diag_unreachable');
		ok('"no path to a reservoir" is on screen', s.text.indexOf(unreach) === 0, s.text);
		ok('...with an x, no chip, and the Something wrong button', s.x && !s.chip && s.wrong);
		const first = s.text;
		const xTip = await page.evaluate(() => { const e = document.getElementById('lpn_status_dismiss'); return (e.getAttribute('aria-label') || '') + '|' + (e.title || ''); });
		ok('the x has an accessible name and a tip', /^[^|]+\|[^|]+$/.test(xTip), xTip);
		await page.evaluate(() => document.getElementById('lpn_status_dismiss').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		s = await st();
		ok('the x hides the message', s.text === '' && !s.x);
		ok('...a chip says how many are hidden', s.chip && s.chipText === (await a.lang('lpn_status_hidden')).replace('{count}', '1'), s.chipText);
		ok('...the box stays up for the chip, and the Something wrong button is untouched', s.box && s.wrong);

		console.log('\n--- the same text stays hidden through other solves ---');
		await place('Reservoir', 0.8, 0.3);   // another solve; the unreachable list is unchanged
		await wait();
		s = await st();
		ok('a solve that says the same words leaves it hidden', s.text === '' && s.chip, JSON.stringify(s));

		console.log('\n--- different text shows again ---');
		await place('Junction', 0.15, 0.8);   // a second unreachable node: a different list
		await wait();
		s = await st();
		ok('a different node list shows the message again', s.text.indexOf(unreach) === 0 && s.text !== first && s.x && !s.chip, s.text);

		console.log('\n--- the chip restores ---');
		await page.evaluate(() => document.getElementById('lpn_status_dismiss').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		ok('hidden again', (await st()).chip);
		await page.evaluate(() => document.getElementById('lpn_status_chip').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		s = await st();
		ok('the chip brings the message back', s.text.indexOf(unreach) === 0 && s.x && !s.chip, s.text);

		console.log('\n--- opening another network clears the hiding ---');
		await page.evaluate(() => document.getElementById('lpn_status_dismiss').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		ok('hidden before the switch', (await st()).chip);
		const tabsBefore = (await a.tabs()).length;
		await a.newProject('us');
		await a.settle(800);
		ok('a second project is open', (await a.tabs()).length === tabsBefore + 1);
		s = await st();
		ok('the new project shows no chip', !s.chip && s.text === '');
		const tabs = await a.tabs();
		console.log('   tabs:', JSON.stringify(tabs.map((t) => t.label + (t.current ? '*' : ''))));
		await page.click('#lpn_tabs .lpn-tab >> nth=' + myTab);
		await a.settle(1800);
		s = await st();
		ok('back on the first network the message shows again', s.text.indexOf(unreach) === 0 && s.x && !s.chip, JSON.stringify(s));

		console.log('\n--- a hidden text is forgotten once it stops showing ---');
		await place('Junction', 0.1, 0.2);   // J3: the list is J1, J2, J3
		await wait();
		s = await st();
		ok('three unreachable nodes are named', /J1, J2, J3/.test(s.text), s.text);
		await page.evaluate(() => document.getElementById('lpn_status_dismiss').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		ok('hidden', (await st()).chip);
		await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await page.keyboard.press('Control+z'); await a.settle(1200);
		s = await st();
		ok('undo (the problem changes) shows the shorter list', /J1, J2$/.test(s.text) && s.x && !s.chip, JSON.stringify(s));
		await page.keyboard.press('Control+y'); await a.settle(1200);
		s = await st();
		ok('redo brings the broken state back SHOWING, not hidden', /J1, J2, J3/.test(s.text) && s.x && !s.chip, JSON.stringify(s));

		console.log('\n--- nothing is stored ---');
		const stored = await page.evaluate(() => {
			const all = [];
			for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); all.push(k + '=' + localStorage.getItem(k)); }
			return all.join('\n') + '\n' + document.cookie;
		});
		ok('no storage mentions the message', !/status_hidden|statusHidden|lpn_status_dismiss/i.test(stored));

		console.log('\n--- Zoom Window by the Map menu row ---');
		const mode = () => page.evaluate(() => {
			const b = document.querySelector('#lpn_toolbar button[data-tool="zoom-window"]');
			return { pressed: b && b.getAttribute('aria-pressed'), label: b && (b.getAttribute('aria-label') || '') };
		});
		const sym = () => page.evaluate(() => { const es = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols > *:not(.lpn-node-hit)')).filter((e) => e.getBoundingClientRect().width > 0); const r = es[0].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, n: es.length }; });
		const dragBox = async () => {
			const r = await page.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
			await page.mouse.move(r.x + r.w * 0.25, r.y + r.h * 0.25);
			await page.mouse.down();
			await page.mouse.move(r.x + r.w * 0.45, r.y + r.h * 0.45, { steps: 6 });
			await page.mouse.move(r.x + r.w * 0.5, r.y + r.h * 0.5, { steps: 6 });
			await page.mouse.up();
			await a.settle(900);
		};
		const zwLabel = (await a.lang('lpn_tool_zoom_window')).trim();
		const zfLabel = (await a.lang('lpn_tool_zoom_extent')).trim();
		await a.openMenu('map');
		const rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((b) => b.textContent.trim()));
		const iFit = rows.findIndex((t) => t.indexOf(zfLabel) === 0), iZw = rows.findIndex((t) => t.indexOf(zwLabel) === 0);
		ok('the Map menu has a Zoom Window row right after Zoom to fit', iFit >= 0 && iZw === iFit + 1, rows.slice(0, 4).join(' | '));
		const hk = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((b) => b.getAttribute('data-hotkey')));
		ok('...and the row shows its key', hk[iZw] === 'W', String(hk[iZw]));
		ok('not in Zoom Window yet, and Zoom to fit never pressed', (await mode()).pressed !== 'true');
		const before = await sym();
		await page.evaluate((l) => {
			const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
			r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
		}, zwLabel);
		await a.settle(400);
		let m = await mode();
		ok('the row enters Zoom Window directly', m.pressed === 'true' && m.label.indexOf(zwLabel) === 0, JSON.stringify(m));
		await dragBox();
		const after = await sym();
		ok('a drag zooms the map', Math.abs(after.w - before.w) > 0.01 || Math.abs(after.x - before.x) > 5, JSON.stringify([before, after]));
		m = await mode();
		ok('the mode ends after the zoom', m.pressed !== 'true');

		console.log('\n--- Zoom Window by the W key ---');
		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await page.keyboard.press('w');
		await a.settle(300);
		m = await mode();
		ok('W enters Zoom Window', m.pressed === 'true', JSON.stringify(m));
		const b2 = await sym();
		await dragBox();
		const a2 = await sym();
		ok('...and a drag zooms', Math.abs(a2.w - b2.w) > 0.01 || Math.abs(a2.x - b2.x) > 5, JSON.stringify([b2, a2]));
		await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '\u0446', code: 'KeyW', bubbles: true })));
		await a.settle(300);
		ok('a Russian layout (key ц, code KeyW) enters it', (await mode()).pressed === 'true');
		await page.keyboard.press('Escape'); await a.settle(300);
		await page.keyboard.press('W');
		await a.settle(300);
		ok('capital W enters it too', (await mode()).pressed === 'true');
		await page.keyboard.press('w');
		await a.settle(300);
		ok('W again leaves it', (await mode()).pressed !== 'true');
		ok('Zoom to fit still needs its second press (button behaviour unchanged)', await (async () => {
			await a.toolbarClick(zfLabel); await a.settle(300);
			const one = (await mode()).pressed !== 'true';
			await a.toolbarClick(zfLabel); await a.settle(300);
			return one && (await mode()).pressed === 'true';
		})());
		await page.keyboard.press('Escape');
		await a.settle(300);

		console.log('\n--- the keys help lists W ---');
		const help = await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').textContent);
		ok('the keyboard shortcuts help has the W row', /W\s*Zoom Window/.test(help), help.slice(0, 40));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + failures + ' failed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

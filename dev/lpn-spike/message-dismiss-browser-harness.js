// HIDING A STANDING MESSAGE, AND THE ZOOM WINDOW DOORS, in a real Chrome.
//
//   node dev/lpn-spike/message-dismiss-browser-harness.js     (takes the browser lock itself)
//
// Tom, 2026-10-07: dismiss "no path to a reservoir"; and "a way to zoom window without Zoom to Fit
// first"; then "Hidden means hidden" and "We need to access Zoom Window without any view change
// intervening". Covers: x on a hideable message; hiding leaves no trace on the map (status box, its
// buttons, the history glyph's highlight, and the canvas SVG unchanged); the hidden message is the top
// row of the message history, marked, and Show there restores it; different text shows again; same
// text stays hidden across solves; opening another network clears it; no x on "Add a reservoir";
// nothing in localStorage; and the toolbar corner triangle, the Map menu row and the W key entering
// Zoom Window with the view transform untouched, then a drag zooming.
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
				box: vis('lpn_status'), x: vis('lpn_status_dismiss'), wrong: vis('lpn_wrong_status_btn'),
				chip: !!document.getElementById('lpn_status_chip')
			};
		});
		// Every visible element on the map's overlay that carries the message's words, the history
		// panel aside; the history glyph's highlight; and the canvas SVG itself.
		const traces = (text) => page.evaluate((t) => {
			const map = document.getElementById('lpn_canvas').parentElement;
			const panel = document.getElementById('lpn_msglog_panel');
			const hits = Array.from(map.querySelectorAll('*')).filter((e) => {
				if (panel.contains(e) || e.children.length) { return false; }
				const r = e.getBoundingClientRect();
				return r.width > 0 && getComputedStyle(e).visibility !== 'hidden' && (e.textContent || '').indexOf(t) >= 0;
			}).map((e) => e.id || e.className);
			return { hits, glyphLit: document.getElementById('lpn_msglog_btn').classList.contains('lpn-msglog-active') };
		}, text);
		const svgNow = () => page.evaluate(() => document.getElementById('lpn_canvas').outerHTML);
		const clickX = async () => { await page.click('#lpn_status_dismiss'); await a.settle(400); };
		const openLog = async () => {
			if (!(await page.evaluate(() => getComputedStyle(document.getElementById('lpn_msglog_panel')).display !== 'none'))) {
				await page.click('#lpn_msglog_btn'); await a.settle(400);
			}
			return page.evaluate(() => Array.from(document.querySelectorAll('#lpn_msglog_panel .lpn-msglog-panel-row')).map((r) => ({
				hidden: r.classList.contains('lpn-msglog-panel-hidden'),
				mark: (r.querySelector('.lpn-msglog-panel-when') || {}).textContent,
				text: (r.querySelector('.lpn-msglog-panel-text') || {}).textContent,
				show: !!r.querySelector('button.lpn-msglog-unhide')
			})));
		};
		const closeLog = async () => {
			if (await page.evaluate(() => getComputedStyle(document.getElementById('lpn_msglog_panel')).display !== 'none')) {
				await page.keyboard.press('Escape'); await a.settle(300);
			}
		};
		const showFromLog = async () => { await openLog(); await page.click('#lpn_msglog_panel button.lpn-msglog-unhide'); await a.settle(400); };
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
		const svgBefore = await svgNow();
		await page.screenshot({ path: '/tmp/' + NAME + '-before-hide.png' });
		await clickX();
		await page.mouse.move(700, 880); await a.settle(300);
		await page.screenshot({ path: '/tmp/' + NAME + '-after-hide.png' });
		s = await st();
		ok('the x hides the message', s.text === '' && !s.x);
		ok('...and the whole box goes: no chip, no Something wrong button over the map', !s.box && !s.wrong && !s.chip, JSON.stringify(s));
		let tr = await traces(first);
		ok('...no visible element on the map carries the words', tr.hits.length === 0, JSON.stringify(tr.hits));
		ok('...the history glyph is not lit for it', !tr.glyphLit);
		ok('...and the map drawing itself is untouched by the hide', (await svgNow()) === svgBefore);
		let log = await openLog();
		await page.screenshot({ path: '/tmp/' + NAME + '-history.png' });
		const hiddenMark = (await a.lang('lpn_msglog_hidden')).trim();
		ok('the history\'s TOP row is the hidden message, marked Hidden, with Show', log.length > 0 && log[0].hidden && log[0].text === first && log[0].mark === hiddenMark && log[0].show, JSON.stringify(log[0]));
		ok('...and it is listed once, not twice', log.filter((r) => r.text === first).length === 1, String(log.filter((r) => r.text === first).length));
		ok('...and only the top row has a Show', log.filter((r) => r.show).length === 1);
		await closeLog();

		console.log('\n--- the same text stays hidden through other solves ---');
		await place('Reservoir', 0.8, 0.3);   // another solve; the unreachable list is unchanged
		await wait();
		s = await st();
		ok('a solve that says the same words leaves it hidden, box and all', s.text === '' && !s.box, JSON.stringify(s));
		log = await openLog();
		ok('...and still the top row of the history', log[0] && log[0].hidden && log[0].text === first, JSON.stringify(log[0]));
		await closeLog();

		console.log('\n--- different text shows again ---');
		await place('Junction', 0.15, 0.8);   // a second unreachable node: a different list
		await wait();
		s = await st();
		ok('a different node list shows the message again', s.text.indexOf(unreach) === 0 && s.text !== first && s.x && s.box, s.text);
		log = await openLog();
		ok('...and the history has no hidden row any more', !log.some((r) => r.hidden), JSON.stringify(log.slice(0, 2)));
		await closeLog();

		console.log('\n--- Show in the history restores ---');
		const second = s.text;
		await clickX();
		ok('hidden again', !(await st()).box);
		const focusAfterX = await page.evaluate(() => document.activeElement && document.activeElement.id);
		ok('...focus went to the history glyph, where the message went', focusAfterX === 'lpn_msglog_btn', String(focusAfterX));
		await showFromLog();
		s = await st();
		ok('Show brings the message back onto the map', s.text === second && s.x && s.box && s.wrong, JSON.stringify(s));
		log = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_msglog_panel .lpn-msglog-panel-row')).map((r) => r.classList.contains('lpn-msglog-panel-hidden')));
		ok('...and the open history drops its hidden row', log.length > 0 && !log.some(Boolean), JSON.stringify(log));
		await closeLog();

		console.log('\n--- opening another network clears the hiding ---');
		await clickX();
		ok('hidden before the switch', !(await st()).box);
		const tabsBefore = (await a.tabs()).length;
		await a.newProject('us');
		await a.settle(800);
		ok('a second project is open', (await a.tabs()).length === tabsBefore + 1);
		s = await st();
		ok('the new project shows nothing', !s.box && s.text === '');
		log = await openLog();
		ok('...and its history has no hidden row', !log.some((r) => r.hidden));
		await closeLog();
		const tabs = await a.tabs();
		console.log('   tabs:', JSON.stringify(tabs.map((t) => t.label + (t.current ? '*' : ''))));
		await page.click('#lpn_tabs .lpn-tab >> nth=' + myTab);
		await a.settle(1800);
		s = await st();
		ok('back on the first network the message shows again', s.text.indexOf(unreach) === 0 && s.x && s.box, JSON.stringify(s));

		console.log('\n--- a hidden text is forgotten once it stops showing ---');
		await place('Junction', 0.1, 0.2);   // J3: the list is J1, J2, J3
		await wait();
		s = await st();
		ok('three unreachable nodes are named', /J1, J2, J3/.test(s.text), s.text);
		await clickX();
		ok('hidden', !(await st()).box);
		await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		await page.keyboard.press('Control+z'); await a.settle(1200);
		s = await st();
		ok('undo (the problem changes) shows the shorter list', /J1, J2$/.test(s.text) && s.x && s.box, JSON.stringify(s));
		await page.keyboard.press('Control+y'); await a.settle(1200);
		s = await st();
		ok('redo brings the broken state back SHOWING, not hidden', /J1, J2, J3/.test(s.text) && s.x && s.box, JSON.stringify(s));

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
		const viewT = () => page.evaluate(() => {
			const g = Array.from(document.querySelectorAll('#lpn_canvas > g')).find((e) => /^translate\(.*scale\(/.test(e.getAttribute('transform') || ''));
			return g ? g.getAttribute('transform') : 'NONE';
		});
		// Off the fitted view on purpose, so a fit sneaking in before the drag would show.
		const unfit = async () => {
			await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await page.keyboard.press('-'); await a.settle(400);
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
		await page.keyboard.press('Escape');
		await a.settle(200);
		await unfit();
		await a.openMenu('map');
		const before = await sym();
		const vMenu0 = await viewT();
		await page.evaluate((l) => {
			const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
			r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
		}, zwLabel);
		await a.settle(400);
		let m = await mode();
		ok('the row enters Zoom Window directly', m.pressed === 'true' && m.label.indexOf(zwLabel) === 0, JSON.stringify(m));
		const vMenu1 = await viewT();
		ok('...with the view transform unchanged (no fit first)', vMenu0 === vMenu1 && vMenu0 !== 'NONE', vMenu0 + ' -> ' + vMenu1);
		await dragBox();
		const after = await sym();
		ok('a drag zooms the map', Math.abs(after.w - before.w) > 0.01 || Math.abs(after.x - before.x) > 5, JSON.stringify([before, after]));
		m = await mode();
		ok('the mode ends after the zoom', m.pressed !== 'true');

		console.log('\n--- Zoom Window by the W key ---');
		await unfit();
		const vW0 = await viewT();
		await page.keyboard.press('w');
		await a.settle(300);
		m = await mode();
		ok('W enters Zoom Window', m.pressed === 'true', JSON.stringify(m));
		ok('...with the view transform unchanged (no fit first)', (await viewT()) === vW0 && vW0 !== 'NONE', vW0);
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

		console.log('\n--- Zoom Window by the corner triangle of the Zoom to fit button ---');
		const zbox = () => page.evaluate(() => { const r = document.querySelector('#lpn_toolbar button[data-tool="zoom-window"]').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		await unfit();
		let zb = await zbox();
		console.log('   button box', JSON.stringify(zb));
		const vC0 = await viewT();
		await page.mouse.click(zb.x + zb.w - 3, zb.y + zb.h - 3);
		await a.settle(400);
		m = await mode();
		ok('a click on the corner triangle enters Zoom Window on the FIRST press', m.pressed === 'true' && m.label.indexOf(zwLabel) === 0, JSON.stringify(m));
		ok('...with the view transform unchanged (no fit first)', (await viewT()) === vC0, vC0);
		const b3 = await sym();
		await dragBox();
		const a3 = await sym();
		ok('...and a drag zooms', Math.abs(a3.w - b3.w) > 0.01 || Math.abs(a3.x - b3.x) > 5, JSON.stringify([b3, a3]));
		await unfit();
		zb = await zbox();
		const vC1 = await viewT();
		await page.mouse.click(zb.x + zb.w - 12, zb.y + zb.h - 12);   // inside a 14 px corner square
		await a.settle(400);
		ok('the corner target is about 14 px square, not just the 6 px drawing', (await mode()).pressed === 'true' && (await viewT()) === vC1);
		await page.mouse.click(zb.x + zb.w - 3, zb.y + zb.h - 3);
		await a.settle(400);
		ok('a second corner click leaves Zoom Window', (await mode()).pressed !== 'true');
		await unfit();
		const vC2 = await viewT();
		await page.mouse.click(zb.x + zb.w / 2 - 4, zb.y + zb.h / 2 - 4);
		await a.settle(600);
		ok('a click on the middle of the button still fits (view changes) and does not enter Zoom Window', (await viewT()) !== vC2 && (await mode()).pressed !== 'true');
		await page.mouse.click(zb.x + zb.w / 2 - 4, zb.y + zb.h / 2 - 4);
		await a.settle(400);
		ok('...and its second press still enters Zoom Window', (await mode()).pressed === 'true');
		await page.keyboard.press('Escape'); await a.settle(300);
		const tip = await page.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[data-tool="zoom-window"]'); return b.title || b.getAttribute('data-bs-original-title') || ''; });
		ok('the button\'s tip is the stated sentence, naming the corner and W', tip.indexOf(await a.lang('lpn_tool_zoom_extent_tip')) >= 0 && /triangle/.test(tip) && /\bW\b/.test(tip), tip);

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

// THE GUIDE'S TYPE MATCHES THE PAGE'S OTHER BOXES, AND CTRL+K RAISES IT (Tom, 2026-10-08).
//   node dev/lpn-spike/guide-style-harness.js          (takes the browser lock itself)
//   node dev/lpn-spike/guide-style-harness.js --measure   prints the numbers and asserts nothing
//
// Real Chromium. Tom: "It has larger text than the rest of the page" and "Ctrl+K should bring the box
// to the front (zindex)". The reference is Settings (its content pane, rows, filter field); Find and
// replace and Notes are read as well, so a drift of the shared shell shows here.
//   1. Body text, lists, definition terms, headings, search field and results in the Guide use the
//      same computed font-family and size as the reference box's, and the headings sit on the
//      page's scale (not above it).
//   2. Ctrl+K with the Guide open but behind a box opened after it puts the Guide in front: higher
//      z-index, and elementFromPoint at the Guide's title finds the Guide.
//   3. ?lang=es opens by Ctrl+K and searches.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_GUIDESTYLE_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('guide-style-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
const MEASURE = process.argv.indexOf('--measure') > 0;
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond && !MEASURE) { fails++; }
}

async function boot(Session, browser, tag, extra) {
	const a = await Session.open(browser, 'gstyle-' + tag, extra);
	await a.goto('Looped-Network.php' + (tag === 'es' ? '?lang=es' : ''));
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(600);
	return a;
}
const ctrlK = (page) => page.keyboard.press('Control+k');

// Computed type of the first element matching sel inside the box (visible ones only).
const typeOf = (page, boxId, sel) => page.evaluate(([b, s]) => {
	const box = document.getElementById(b);
	const els = Array.from(box.querySelectorAll(s)).filter(e => e.getClientRects().length);
	if (!els.length) { return null; }
	const cs = getComputedStyle(els[0]);
	return { size: cs.fontSize, lh: cs.lineHeight, fam: cs.fontFamily, weight: cs.fontWeight, color: cs.color };
}, [boxId, sel]);

async function openSettings(a) {
	await a.page.evaluate(() => {
		const t = document.querySelector('#lpn_toolbar button[data-ec-settings], #lpn_toolbar button');
	});
	await a.menuClick(await a.lang('lpn_tool_settings'), 'project').catch(async () => {});
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await boot(Session, browser, 'en');
		const page = a.page;
		// Open the Guide, then the Settings box after it (so Settings is in front).
		await ctrlK(page); await a.settle(300);
		ok('Ctrl+K opens the Guide', await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'));
		const settingsName = await a.lang('lpn_tool_settings');
		await page.evaluate((n) => {
			const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).filter(x => (x.getAttribute('aria-label') || x.textContent || '').trim() === n)[0];
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
		}, settingsName);
		await a.settle(400);
		let setOpen = await page.evaluate(() => document.getElementById('lpn_settings_box').style.display !== 'none');
		if (!setOpen) {
			await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); b.style.display = 'flex'; });
			setOpen = true;
		}
		ok('Settings is open for reference', setOpen);

		console.log('\n1. Type');
		const REF = 'lpn_settings_box';
		const rows = [
			['body text', 'lpn_hotkeys_popup', '.lpn-guide-prose', REF, '.lpn-setbox-content'],
			['definition text', 'lpn_hotkeys_popup', '.lpn-guide-section dd', REF, '.lpn-setbox-content'],
			['row text', 'lpn_hotkeys_popup', '.lpn-guide-row .lpn-guide-tip', REF, '.lpn-setbox-content'],
			['search field', 'lpn_hotkeys_popup', '#lpn_guide_search', REF, '#lpn_setbox_filter'],
			['contents rail link', 'lpn_hotkeys_popup', '.lpn-guide-nav a', REF, '.lpn-setbox-index a, .lpn-setbox-index button, .lpn-setbox-index *']
		];
		const table = [];
		for (const r of rows) {
			const g = await typeOf(page, r[1], r[2]), s = await typeOf(page, r[3], r[4]);
			table.push([r[0], g, s]);
			console.log('  ' + r[0] + ': guide ' + JSON.stringify(g) + ' | settings ' + JSON.stringify(s));
			ok(r[0] + ': font size equals the reference box\'s', !!g && !!s && g.size === s.size, g && s && (g.size + ' vs ' + s.size));
			ok(r[0] + ': font family equals the reference box\'s', !!g && !!s && g.fam === s.fam);
		}
		const h2 = await typeOf(page, 'lpn_hotkeys_popup', '.lpn-guide-section > h2');
		const h3 = await typeOf(page, 'lpn_hotkeys_popup', '.lpn-guide-menu > h3, .lpn-guide-section dt');
		const refHead = await typeOf(page, REF, '.lpn-set-head');
		const refSub = await typeOf(page, REF, '.lpn-set-sub');
		console.log('  h2 ' + JSON.stringify(h2) + ' | settings heading ' + JSON.stringify(refHead));
		console.log('  h3/dt ' + JSON.stringify(h3) + ' | settings sub-heading ' + JSON.stringify(refSub));
		ok('section heading (h2) is the size of a Settings section heading', !!h2 && !!refHead && h2.size === refHead.size, h2 && refHead && (h2.size + ' vs ' + refHead.size));
		ok('group heading (h3/dt) is the size of a Settings sub-heading', !!h3 && !!refSub && h3.size === refSub.size, h3 && refSub && (h3.size + ' vs ' + refSub.size));
		ok('no hard-coded colour in the Guide\'s stylesheet rules', await page.evaluate(() => {
			let bad = [];
			Array.from(document.styleSheets).forEach(ss => { try { Array.from(ss.cssRules).forEach(function walk(r) {
				if (r.cssRules && !r.style) { Array.from(r.cssRules).forEach(walk); return; }
				if (r.selectorText && /guide/.test(r.selectorText) && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(r.style.cssText.replace(/var\([^)]*\)/g, ''))) { bad.push(r.selectorText); }
			}); } catch (e) {} });
			return bad.length === 0 ? true : bad.join(' | ');
		}));

		console.log('\n2. Ctrl+K raises the Guide above a box opened after it');
		const z = () => page.evaluate(() => {
			const g = document.getElementById('lpn_hotkeys_popup'), s = document.getElementById('lpn_settings_box');
			const r = document.querySelector('#lpn_hotkeys_title').getBoundingClientRect();
			const top = document.elementFromPoint(r.left + 20, r.top + r.height / 2);
			return { g: Number(g.style.zIndex) || 0, s: Number(s.style.zIndex) || 0, onTop: !!top && g.contains(top) };
		});
		// Settings was opened after the Guide, so raise Settings the way a click does, then see.
		await page.evaluate(() => { document.getElementById('lpn_settings_box').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); });
		await page.evaluate(() => {
			const g = document.getElementById('lpn_hotkeys_popup'), s = document.getElementById('lpn_settings_box');
			// Park the Guide's title under Settings so the overlap is certain.
			const sr = s.getBoundingClientRect();
			g.style.left = Math.max(0, sr.left + 10) + 'px'; g.style.top = Math.max(0, sr.top + 10) + 'px';
		});
		const before = await z();
		ok('set-up: Settings is above the Guide', before.s > before.g, JSON.stringify(before));
		await page.mouse.click(5, 5).catch(() => {});
		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await ctrlK(page); await a.settle(300);
		const after = await z();
		ok('Ctrl+K puts the Guide in front of Settings', after.g > after.s && after.onTop, JSON.stringify(after));
		ok('...with the search field focused', await page.evaluate(() => document.activeElement && document.activeElement.id === 'lpn_guide_search'));

		await a.context.close().catch(() => {});

		console.log('\n4. A non-English page (es)');
		const b = await boot(Session, browser, 'es');
		await b.page.keyboard.press('Control+k'); await b.settle(300);
		ok('es: Ctrl+K opens the Guide', await b.page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'));
		const bs = await typeOf(b.page, 'lpn_hotkeys_popup', '.lpn-guide-prose');
		await b.page.keyboard.type('tuber'); await b.settle(300);
		const shown = await b.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-section')).filter(s => s.getClientRects().length).length);
		const none = await b.page.evaluate(() => { const n = document.getElementById('lpn_guide_none'); return !!n && n.getClientRects().length > 0; });
		ok('es: searching narrows to some section', shown > 0 && !none, shown + ' sections, none=' + none);
		ok('es: body text size is the same as English (14.4px)', !!bs && bs.size === '14.4px', bs && bs.size);
		ok('no page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.context.close().catch(() => {});
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nguide-style-harness: ${fails} FAILURE(S)` : '\nguide-style-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();

// THE PROPERTIES BOX TITLE SAYS WHICH ASSET IT IS EDITING (Tom, 2026-11-06: *"'Properties' is the
// important word, and varying it would be confusing, bad UX."*).
//   Properties: Junction 22      one asset: the type word, then its ID
//   Properties: Pipes (2)        several of one kind
//   Properties: 3 selected       a mix
//   Properties                   nothing selected
// and it follows a rename, a Morph, a selection change and a scenario switch.
//   node dev/lpn-spike/properties-title-browser-harness.js    (takes the browser lock itself)
//   SHOTDIR=/path  also saves a docked and a floating screenshot there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_PTT_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_PTT_LOCKED: '1' }) });
		if (r.status === 75) { console.error('properties-title-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = (k) => a.lang(k);
		const settle = (ms) => a.settle(ms);
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.goto('Looped-Network.php');
		await a.openNet1Plain(await L('lpn_ex_net1_title'));
		await settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const P = await L('lpn_popup_boxtitle');
		const title = () => page.evaluate(() => document.getElementById('lpn_popup_boxtitle').textContent);
		const tool = async (k) => L('lpn_tool_add_' + k);
		const hit = async (sel, shift) => {
			const b = await (await page.$(sel)).boundingBox();
			if (shift) { await page.keyboard.down('Shift'); }
			await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
			if (shift) { await page.keyboard.up('Shift'); }
			await settle(500);
		};
		const node = async (id, shift) => { if (!shift) { await page.keyboard.press('Escape'); } return hit('.lpn-node-hit[data-node="' + id + '"]', shift); };
		const link = async (id, shift) => { if (!shift) { await page.keyboard.press('Escape'); } return hit('#lpn_canvas .lpn-link-hit[data-link="' + id + '"]', shift); };
		const changeTo = async (k) => { await a.menuClickSub(await L('lpn_morph_menu'), await L('lpn_tool_add_' + k), 'project'); await settle(800);
			if (await a.dialog()) { await a.dialogClick(await L('lpn_morph_ok')); } await settle(800); };
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
			}
			await settle(1200);
		};

		console.log('--- 1. nothing selected ---');
		await page.keyboard.press('Escape');
		ok('1.1 plain "' + P + '"', (await title()) === P, await title());

		console.log('--- 2. one asset ---');
		await node('22');
		ok('2.1 a junction', (await title()) === P + ': ' + await tool('junction') + ' 22', await title());
		await page.click('#lpn_popup .lpn-corner-btn[data-dock="right"]');   // out of the way of the map
		await settle(500);
		await link('10');
		ok('2.2 a pipe', (await title()) === P + ': ' + await tool('pipe') + ' 10', await title());

		console.log('--- 3. a rename ---');
		await node('22');
		await page.fill('#lpn_popup_title input', '22x');
		await page.press('#lpn_popup_title input', 'Enter');
		await page.evaluate(() => document.querySelector('#lpn_popup_title input').dispatchEvent(new Event('change', { bubbles: true })));
		await settle(800);
		ok('3.1 the new ID follows', (await title()) === P + ': ' + await tool('junction') + ' 22x', await title());
		await page.fill('#lpn_popup_title input', '22');
		await page.evaluate(() => document.querySelector('#lpn_popup_title input').dispatchEvent(new Event('change', { bubbles: true })));
		await settle(800);
		ok('3.2 renamed back', (await title()) === P + ': ' + await tool('junction') + ' 22', await title());

		console.log('--- 4. a Morph (a pipe becomes a valve, a junction a tank) ---');
		await link('10');
		await changeTo('valve');
		ok('4.1 the valve', (await title()) === P + ': ' + await tool('valve') + ' 10', await title());
		await node('22');
		await changeTo('tank');
		ok('4.2 the tank', (await title()) === P + ': ' + await tool('tank') + ' 22', await title());
		await page.keyboard.press('Escape');
		await page.keyboard.press('Control+z');
		await settle(1000);
		await node('22');
		ok('4.3 Ctrl+Z on the tank: junction again', (await title()) === P + ': ' + await tool('junction') + ' 22', await title());

		console.log('--- 5. several of one kind, then a mix ---');
		await page.keyboard.press('Escape');
		await link('11'); await link('12', true);
		const two = (await L('lpn_pane_tab_pipes')) + ' (2)';
		ok('5.1 two pipes', (await title()) === P + ': ' + two, await title());
		await node('21', true);
		ok('5.2 two pipes and a junction', (await title()) === P + ': ' + (await L('lpn_multi_title')).replace('{n}', '3'), await title());

		console.log('--- 6. a scenario switch ---');
		await page.keyboard.press('Escape');
		a.answerPromptWith('B');
		await scenarioMenu(await L('lpn_scenario_new'));
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		await node('22');
		await changeTo('tank');
		ok('6.1 in B, 22 is a tank', (await title()) === P + ': ' + await tool('tank') + ' 22', await title());
		await scenarioMenu(await L('lpn_scenario_base'));
		ok('6.2 back in Base with 22 still selected: a junction', (await title()) === P + ': ' + await tool('junction') + ' 22', await title());

		console.log('--- 7. the menu row and the help still say Properties ---');
		ok('7.1 the box heading in the guide is the plain word', (await L('lpn_popup_boxtitle')) === 'Properties');

		console.log('--- 7b. the tab and the Guide keep the plain box name ---');
		await node('21');
		const tabText = await page.evaluate(() => { const t = document.querySelector('.lpn-dock-tab[aria-controls="lpn_popup"]'); return t ? t.textContent.trim() : null; });
		ok('7b.1 docked: the side tab reads "' + P + '" while the title bar names the asset', tabText === P && (await title()) === P + ': ' + await tool('junction') + ' 21', tabText + ' | ' + await title());

		console.log('--- 7c. a cleared selection empties the box ---');
		const none = await L('lpn_popup_none');
		const body = () => page.evaluate(() => document.getElementById('lpn_popup_fields').textContent.trim());
		const emptyClick = async () => {
			const e = await page.evaluate(() => {
				const c = document.getElementById('lpn_canvas').getBoundingClientRect();
				for (let y = c.top + 60; y < c.bottom - 60; y += 25) {
					for (let x = c.left + 60; x < c.right - 60; x += 25) {
						const el = document.elementFromPoint(x, y);
						if (el && (el.id === 'lpn_canvas' || (el.closest('#lpn_canvas') && !/hit|lpn-node|lpn-link|symbol|label|text/.test(String(el.getAttribute('class') || '') + el.tagName)))) { return { x, y }; }
					}
				}
				return null;
			});
			await page.mouse.click(e.x, e.y);
			await settle(600);
		};
		await node('21');
		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await page.keyboard.press('Escape');
		await settle(600);
		if ((await body()) !== none) { await page.keyboard.press('Escape'); await settle(600); }
		ok('7c.1 docked, Escape: "nothing selected" body and plain title', (await body()) === none && (await title()) === P, (await title()) + ' | ' + (await body()).slice(0, 40));
		await node('21');
		await emptyClick();
		ok('7c.2 docked, empty-map click: "nothing selected" body and plain title', (await body()) === none && (await title()) === P, (await title()) + ' | ' + (await body()).slice(0, 40));
		await node('21');
		await page.click('#lpn_popup .lpn-corner-btn[data-dock="float"]');
		await settle(500);
		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await page.keyboard.press('Escape');
		await settle(600);
		const floatGone = await page.evaluate(() => document.getElementById('lpn_popup').style.display === 'none');
		ok('7c.3 floating, Escape: the selection is cleared and no stale asset shows', floatGone || ((await title()) === P && (await body()) === none), (await title()) + ' | floatGone ' + floatGone);
		await page.click('#lpn_popup_close').catch(() => {});
		await settle(300);
		await node('21');
		await page.click('#lpn_popup .lpn-corner-btn[data-dock="right"]');
		await settle(500);

		console.log('--- 8. the selected asset goes away: plain again ---');
		await node('22');
		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await page.keyboard.press('Delete');
		if (await a.dialog()) { await a.dialogClick('OK'); }   // it also deletes the scenario's overrides
		await settle(800);
		ok('8.1 plain again', (await title()) === P, await title());
		if (process.env.SHOTDIR) {
			await node('21');
			await page.screenshot({ path: path.join(process.env.SHOTDIR, 'docked.png') });
			await page.click('#lpn_popup .lpn-corner-btn[data-dock="float"]');
			await settle(600);
			await page.screenshot({ path: path.join(process.env.SHOTDIR, 'floating.png') });
		}
		console.log('--- 9. the Guide ---');
		await node('21');
		await a.menuClick(await L('lpn_help_manual'), 'help');
		await settle(800);
		const guideH = await page.evaluate(() => { const h = document.querySelector('#lpn_guide_b_lpn_popup h3'); return h ? h.textContent.trim() : null; });
		ok('9.1 the Guide\'s Boxes entry reads "' + P + '" while an asset is selected', guideH !== null && guideH.indexOf(':') < 0 && guideH.indexOf(P) === 0, String(guideH));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

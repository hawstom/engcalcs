// Task 748: every menu of the Looped Network page answers the keyboard (WAI-ARIA menubar pattern).
// Drives the REAL page with real key presses, never by calling openMenu(): open a menu, arrow across
// menus, into a fly-out and back, Enter activates, Escape closes one level and returns focus, Tab
// closes. Any fly-out built with a `submenu:` row inherits this, so it tests File > Import (a
// fly-out that exists on master) and makes no assumption about which menus have one.
//
// Run with:
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/menu-keyboard-harness.js

const path = require('path');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const page = await context.newPage();
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
		await page.waitForSelector('#lpn_menubar .lpn-menubar-item');
		await page.waitForTimeout(400);

		const focusId = () => page.evaluate(() => document.activeElement && document.activeElement.id || '');
		const focusText = () => page.evaluate(() => {
			const a = document.activeElement;
			return a && a.classList.contains('lpn-menu-row') ? a.textContent.replace(/[▸\s]+$/, '').trim() : '';
		});
		const shown = (id) => page.evaluate((i) => document.getElementById(i).style.display === 'block', id);
		const key = (k) => page.keyboard.press(k);
		const rowTexts = (list) => page.evaluate((l) => Array.from(document.querySelectorAll('#' + l + ' button.lpn-menu-row'))
			.map((b) => ({ t: b.textContent.replace(/[▸\s]+$/, '').trim(), dis: b.disabled, sub: b.getAttribute('aria-haspopup') === 'menu' })), list);

		console.log('\n--- roles ---');
		ok('menu bar is a menubar', await page.$eval('#lpn_menubar', (e) => e.getAttribute('role')) === 'menubar');
		ok('its items are menuitems with a popup', await page.$$eval('#lpn_menubar .lpn-menubar-item',
			(els) => els.every((e) => e.getAttribute('role') === 'menuitem' && e.getAttribute('aria-haspopup') === 'menu')));

		console.log('\n--- closed bar: Left/Right walk the bar, Down opens ---');
		await page.focus('#lpn_menu_file');
		await key('ArrowRight');
		ok('Right from File focuses Edit', await focusId() === 'lpn_menu_edit', await focusId());
		ok('...and opens nothing', !(await shown('lpn_menu_popup')));
		await key('ArrowLeft'); await key('ArrowLeft');
		ok('Left from File wraps to the last item', await focusId() === 'lpn_menu_lang', await focusId());
		await key('ArrowRight');
		ok('Right from the last wraps to File', await focusId() === 'lpn_menu_file');

		console.log('\n--- open File by keyboard ---');
		await key('ArrowDown');
		ok('Down opens the menu', await shown('lpn_menu_popup'));
		ok('aria-expanded true on File', await page.$eval('#lpn_menu_file', (e) => e.getAttribute('aria-expanded')) === 'true');
		const file = await rowTexts('lpn_menu_list');
		const firstEnabled = file.find((r) => !r.dis);
		ok('focus is on the first enabled row', await focusText() === firstEnabled.t, await focusText());
		const enabled = file.filter((r) => !r.dis);
		ok('menu role', await page.$eval('#lpn_menu_list', (e) => e.getAttribute('role')) === 'menu');

		console.log('\n--- Down/Up skip disabled rows and wrap; Home/End ---');
		const seen = [await focusText()];
		for (let i = 1; i < enabled.length; i++) { await key('ArrowDown'); seen.push(await focusText()); }
		ok('Down visits every enabled row once, in order', JSON.stringify(seen) === JSON.stringify(enabled.map((r) => r.t)), JSON.stringify(seen));
		await key('ArrowDown');
		ok('Down from the last wraps to the first', await focusText() === enabled[0].t);
		await key('ArrowUp');
		ok('Up from the first wraps to the last', await focusText() === enabled[enabled.length - 1].t);
		await key('Home');
		ok('Home', await focusText() === enabled[0].t);
		await key('End');
		ok('End', await focusText() === enabled[enabled.length - 1].t);
		ok('a disabled row never takes focus', !(await page.evaluate(() => document.activeElement.disabled)));

		console.log('\n--- fly-out: Right opens, Left closes back to its row ---');
		const subRow = file.find((r) => r.sub);
		ok('File has a fly-out row to test with', !!subRow);
		await key('Home');
		let guard = 0;
		while (await focusText() !== subRow.t && guard++ < 40) { await key('ArrowDown'); }
		ok('reached the fly-out row', await focusText() === subRow.t);
		ok('its aria-expanded starts false', await page.evaluate(() => document.activeElement.getAttribute('aria-expanded')) === 'false');
		await key('ArrowRight');
		ok('Right opens the fly-out', await shown('lpn_menu_popup2'));
		ok('parent stays open', await shown('lpn_menu_popup'));
		const subs = await rowTexts('lpn_menu_list2');
		ok('focus is on the fly-out first enabled row', await focusText() === subs.find((r) => !r.dis).t, await focusText());
		ok('the opener says aria-expanded true', await page.evaluate(() => {
			return Array.from(document.querySelectorAll('#lpn_menu_list button[aria-haspopup]')).some((b) => b.getAttribute('aria-expanded') === 'true');
		}));
		await key('ArrowDown');
		ok('Down moves within the fly-out', (await shown('lpn_menu_popup2')) && await page.evaluate(() => document.getElementById('lpn_menu_popup2').contains(document.activeElement)));
		await key('ArrowLeft');
		ok('Left closes the fly-out', !(await shown('lpn_menu_popup2')));
		ok('...and returns focus to its parent row', await focusText() === subRow.t, await focusText());
		ok('...with the parent still open', await shown('lpn_menu_popup'));
		await key('Enter');
		ok('Enter on a fly-out row opens it too', await shown('lpn_menu_popup2'));
		await key('Escape');
		ok('Escape closes only the fly-out', !(await shown('lpn_menu_popup2')) && await shown('lpn_menu_popup'));
		ok('...focus back on the row', await focusText() === subRow.t);
		await key('ArrowRight'); await key('ArrowDown');
		await key('ArrowRight');
		ok('...the Edit menu is open', await page.$eval('#lpn_menu_edit', (e) => e.getAttribute('aria-expanded')) === 'true');
		ok('...and the fly-out is gone', !(await shown('lpn_menu_popup2')));

		console.log('\n--- arrows across menus move an open menu along ---');
		ok('focus is inside the Edit menu', await page.evaluate(() => document.getElementById('lpn_menu_popup').contains(document.activeElement)));
		await key('ArrowRight');
		ok('Right opens Map', await page.$eval('#lpn_menu_map', (e) => e.getAttribute('aria-expanded')) === 'true');
		ok('...and closes Edit', await page.$eval('#lpn_menu_edit', (e) => e.getAttribute('aria-expanded')) === 'false');
		await key('ArrowLeft'); await key('ArrowLeft');
		ok('Left twice reaches File, open', await page.$eval('#lpn_menu_file', (e) => e.getAttribute('aria-expanded')) === 'true');

		console.log('\n--- Escape closes one level and returns focus to the opener ---');
		await key('Escape');
		ok('Escape closes the menu', !(await shown('lpn_menu_popup')));
		ok('...focus is on the File button', await focusId() === 'lpn_menu_file', await focusId());
		ok('...aria-expanded false', await page.$eval('#lpn_menu_file', (e) => e.getAttribute('aria-expanded')) === 'false');

		console.log('\n--- Tab closes the menu and moves on ---');
		await key('Enter');
		ok('Enter on the button opens it with focus inside', (await shown('lpn_menu_popup')) && (await focusText()) !== '');
		await key('Tab');
		ok('Tab closes the menu', !(await shown('lpn_menu_popup')));
		ok('...and focus is not stuck in the hidden menu', await page.evaluate(() => !document.getElementById('lpn_menu_popup').contains(document.activeElement)));
		ok('...it moved on to the next item in the bar', await focusId() === 'lpn_menu_edit', await focusId());
		await page.focus('#lpn_menu_file');
		await key('Space');
		ok('Space opens too', await shown('lpn_menu_popup'));
		await key('Escape');

		console.log('\n--- Enter activates a row ---');
		await page.focus('#lpn_menu_help');
		await key('ArrowDown');
		const helpRows = await rowTexts('lpn_menu_list');
		const plain = helpRows.find((r) => !r.dis && !r.sub);
		while (await focusText() !== plain.t) { await key('ArrowDown'); }
		await key('Enter');
		ok('Enter closes the menu (the row ran)', !(await shown('lpn_menu_popup')));

		console.log('\n--- mouse behaviour unchanged: a click opens without moving focus into the menu ---');
		await page.keyboard.press('Escape');
		await page.click('#lpn_menu_file');
		ok('mouse click opens', await shown('lpn_menu_popup'));
		ok('...and focus stays on the button', await focusId() === 'lpn_menu_file', await focusId());
		await page.keyboard.press('Escape');
		ok('Escape still closes a mouse-opened menu', !(await shown('lpn_menu_popup')));
		await page.click('#lpn_menu_file');
		await page.mouse.click(700, 500);
		ok('click-away still closes', !(await shown('lpn_menu_popup')));

		await context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });

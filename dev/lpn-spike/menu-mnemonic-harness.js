// Task 748: menu mnemonics and keyboard mode on the Looped Network page. Real key presses against the
// real page: Alt+Shift+{F,E,M,W,H,L} (Ctrl+Option on a Mac) open File, Edit, Map, Water, Help and
// Language with focus on the first enabled row, from inside a text field too; F10 goes to the bar;
// the Latin key badges show only in keyboard mode; pointer-only rows are skipped by the arrow keys;
// no chord reaches a drawing tool; and a right-to-left page opens the same menus.
//
// Run with:
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/menu-mnemonic-harness.js

const path = require('path');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const MENUS = [['F', 'lpn_menu_file'], ['E', 'lpn_menu_edit'], ['M', 'lpn_menu_map'],
	['W', 'lpn_menu_project'], ['H', 'lpn_menu_help'], ['L', 'lpn_menu_lang']];

async function suite(page, label, mac) {
	console.log('\n=== ' + label + ' ===');
	const chord = async (letter) => {
		if (mac) { await page.keyboard.press('Control+Alt+' + letter.toLowerCase()); }
		else { await page.keyboard.press('Alt+Shift+' + letter); }
	};
	const shown = () => page.evaluate(() => document.getElementById('lpn_menu_popup').style.display === 'block');
	const expandedId = () => page.evaluate(() => {
		const e = document.querySelector('#lpn_menubar .lpn-menubar-item[aria-expanded="true"]');
		return e ? e.id : '';
	});
	const firstRowFocused = () => page.evaluate(() => {
		const rows = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row:not(:disabled):not([data-pointer-only])'));
		return rows.length > 0 && document.activeElement === rows[0];
	});
	const badgesVisible = () => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-kbdbadge'))
		.filter((b) => b.getClientRects().length > 0).map((b) => b.textContent).join(''));
	const mode = () => page.evaluate((m) => (window.__lpnMode = null, document.getElementById('lpn_mode_hint') ? document.getElementById('lpn_mode_hint').textContent : ''));
	const hint0 = await mode();

	ok('no badge is visible before keyboard mode', (await badgesVisible()) === '');
	for (const [letter, id] of MENUS) {
		await page.keyboard.press('Escape');
		await chord(letter);
		ok(letter + ' opens ' + id, (await shown()) && (await expandedId()) === id, await expandedId());
		ok(letter + ': focus is on the first enabled row', await firstRowFocused());
		ok(letter + ': the badge row is showing', (await badgesVisible()) === 'FEMWHL', await badgesVisible());
		await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
		ok(letter + ': two Escapes leave keyboard mode', (await badgesVisible()) === '' && !(await shown()));
	}
	ok('no chord changed the drawing tool', (await mode()) === hint0, await mode());

	console.log('--- from inside a text field ---');
	await page.evaluate(() => { const i = document.createElement('input'); i.id = 'km_probe'; document.body.appendChild(i); i.focus(); });
	await chord('E');
	ok('chord opens Edit while typing in an input', (await expandedId()) === 'lpn_menu_edit');
	await page.keyboard.press('Escape');
	ok('Escape closes the menu, focus on the Edit button, badges stay', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_edit' && (await badgesVisible()) === 'FEMWHL');
	await page.keyboard.press('Escape');
	ok('second Escape returns focus to the input', (await page.evaluate(() => document.activeElement.id)) === 'km_probe');
	ok('...and ends keyboard mode', (await badgesVisible()) === '');
	await page.evaluate(() => { document.getElementById('km_probe').value = ''; });
	await page.keyboard.type('m');
	ok('typing a plain letter still types', (await page.evaluate(() => document.getElementById('km_probe').value)) === 'm');
	await page.evaluate(() => document.getElementById('km_probe').remove());

	console.log('--- F10 ---');
	await page.evaluate(() => document.activeElement.blur());
	await page.keyboard.press('F10');
	ok('F10 focuses the first menu name', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_file');
	ok('...opens nothing', !(await shown()));
	ok('...and shows the badges', (await badgesVisible()) === 'FEMWHL');
	await page.keyboard.press(await page.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
	ok('Next-arrow walks the bar in keyboard mode', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_edit');
	await page.keyboard.press('Escape');
	ok('Escape from the bar ends the mode', (await badgesVisible()) === '');
	ok('...and leaves the menu bar', !(await page.evaluate(() => document.activeElement.classList.contains('lpn-menubar-item'))));

	console.log('--- a click ends keyboard mode ---');
	await chord('F');
	ok('badges up', (await badgesVisible()) === 'FEMWHL');
	await page.mouse.click(700, 500);
	ok('a pointer click removes them', (await badgesVisible()) === '' && !(await shown()));

	console.log('--- no reflow ---');
	const widths = async () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menubar .lpn-menubar-item')).map((b) => b.getBoundingClientRect().width + ':' + b.getBoundingClientRect().left).join(','));
	const w0 = await widths();
	await page.keyboard.press('F10');
	ok('the bar does not move when the badges show', (await widths()) === w0);
	await page.keyboard.press('Escape');

	console.log('--- focus returns to where it was after a row that opens no box ---');
	await page.evaluate(() => { const d = document.createElement('div'); d.id = 'km_cell'; d.tabIndex = 0; d.textContent = 'cell'; document.body.appendChild(d); });
	const onCell = () => page.evaluate(() => document.activeElement.id === 'km_cell');
	await page.focus('#km_cell');
	await chord('E');
	const undoLabel = await page.evaluate(() => EngCalcs.pageConfig.lpn_tool_undo);
	for (let g = 0; g < 40 && (await page.evaluate(() => document.activeElement.textContent.trim())) !== undoLabel; g++) { await page.keyboard.press('ArrowDown'); }
	await page.keyboard.press('Enter');
	await page.waitForTimeout(250);
	ok('Edit > Undo: focus is back on the cell', await onCell(), await page.evaluate(() => document.activeElement.id || document.activeElement.tagName));
	ok('...the menu is closed and keyboard mode over', !(await shown()) && (await badgesVisible()) === '');
	await page.focus('#km_cell');
	await chord('M');
	await page.keyboard.press('Enter');   // first row: Zoom to fit
	await page.waitForTimeout(250);
	ok('Map > Zoom to fit: focus is back on the cell', await onCell(), await page.evaluate(() => document.activeElement.id || document.activeElement.tagName));
	await page.focus('#km_cell');
	await chord('W');
	const setLabel = await page.evaluate(() => EngCalcs.pageConfig.lpn_tool_settings);
	for (let g = 0; g < 40 && (await page.evaluate(() => document.activeElement.textContent.trim())) !== setLabel; g++) { await page.keyboard.press('ArrowDown'); }
	await page.keyboard.press('Enter');
	await page.waitForTimeout(250);
	ok('Water > Settings: focus lands on a field, not the close button', await page.evaluate(() => {
		const a = document.activeElement, b = document.getElementById('lpn_settings_box');
		return !!b && b.contains(a) && a.id !== 'lpn_settings_close' && !a.classList.contains('lpn-popover-x');
	}), await page.evaluate(() => document.activeElement.tagName + '#' + document.activeElement.id));
	await page.keyboard.press('Escape');
	await page.evaluate(() => document.getElementById('km_cell').remove());

	console.log('--- Map > Background image: the pick rows are pointer-only ---');
	await chord('M');
	// The Background image row is the first fly-out row in the Map menu whose fly-out has an Add row.
	const nsub = await page.evaluate(() => document.querySelectorAll('#lpn_menu_list button.lpn-menu-row[aria-haspopup]').length);
	let bd = [];
	for (let i = 0; i < nsub && !bd.length; i++) {
		await page.evaluate((k) => document.querySelectorAll('#lpn_menu_list button.lpn-menu-row[aria-haspopup]')[k].focus(), i);
		await page.keyboard.press(await page.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
		bd = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).map((b) => ({ t: b.textContent.trim(), po: b.hasAttribute('data-pointer-only') })));
		if (!bd.some((r) => r.po)) { bd = []; }
	}
	const pc = await page.evaluate(() => [EngCalcs.pageConfig.lpn_backdrop_position, EngCalcs.pageConfig.lpn_backdrop_scale, EngCalcs.pageConfig.lpn_backdrop_scale_from]);
	ok('Move, Scale by picking and Scale from... are flagged', pc.every((t) => bd.some((r) => r.t === t && r.po)), JSON.stringify(bd));
	ok('Add and the world-file row are not', bd.filter((r) => !r.po).length >= 2);
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');

	console.log('--- pointer-only rows ---');
	const pointerOnly = await page.evaluate(() => null);
	await chord('E');
	const edit = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((b) => ({ t: b.textContent.trim(), po: b.hasAttribute('data-pointer-only'), dis: b.disabled })));
	ok('Edit has pointer-only rows (Vertices, selection shapes)', edit.filter((r) => r.po).length >= 4, JSON.stringify(edit.filter((r) => r.po)));
	ok('...and they stay visible in the list', edit.length > edit.filter((r) => !r.po).length);
	const seen = new Set();
	for (let i = 0; i < edit.length + 2; i++) {
		seen.add(await page.evaluate(() => document.activeElement.hasAttribute('data-pointer-only')));
		await page.keyboard.press('ArrowDown');
	}
	ok('ArrowDown never lands on a pointer-only row', !seen.has(true));
	await page.keyboard.press('End');
	ok('End does not either', !(await page.evaluate(() => document.activeElement.hasAttribute('data-pointer-only'))));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	await chord('W');
	await page.keyboard.press('Enter');   // the Water menu's first row, Insert, opens its fly-out
	const sub = await page.evaluate(() => ({ open: document.getElementById('lpn_menu_popup2').style.display === 'block',
		onPointer: document.activeElement.hasAttribute('data-pointer-only'),
		n: document.querySelectorAll('#lpn_menu_list2 [data-pointer-only]').length }));
	ok('Water > Insert fly-out opened, its asset rows are pointer-only, focus is not on one', sub.open && sub.n >= 8 && !sub.onPointer, JSON.stringify(sub));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const open = async (ctx, q) => {
			const page = await ctx.newPage();
			await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1' + q), { waitUntil: 'load' });
			await page.waitForSelector('#lpn_menubar .lpn-menubar-item');
			await page.waitForTimeout(400);
			return page;
		};
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		await suite(await open(ctx, ''), 'Windows/Linux, English', false);
		await ctx.close();

		const mac = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36' });
		const mp = await open(mac, '');
		await mp.addInitScript(() => {});
		console.log('\n=== Mac: Ctrl+Option, and Alt+Shift does nothing ===');
		const isMac = await mp.evaluate(() => /mac/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform));
		if (isMac) {
			await mp.keyboard.press('Alt+Shift+F');
			ok('Alt+Shift+F is not a chord on a Mac', await mp.evaluate(() => document.getElementById('lpn_menu_popup').style.display !== 'block'));
			await mp.keyboard.press('Control+Alt+f');
			ok('Ctrl+Option+F opens File', await mp.evaluate(() => document.getElementById('lpn_menu_file').getAttribute('aria-expanded') === 'true'));
		} else {
			console.log('  (platform string is not Mac under this browser; Mac branch not exercised)');
		}
		await mac.close();

		const rtl = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const rp = await open(rtl, '&lang=he');
		ok('the page is dir=rtl', await rp.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl');
		await suite(rp, 'right-to-left (he)', false);
		await rp.keyboard.press('F10');
		const geo = await rp.evaluate(() => {
			const b = document.querySelector('#lpn_menu_file'), g = b.querySelector('.lpn-kbdbadge');
			const br = b.getBoundingClientRect(), gr = g.getBoundingClientRect();
			return { badgeNearLeft: gr.left < br.left + br.width / 2 && gr.right <= window.innerWidth, text: g.textContent };
		});
		ok('in RTL the badge sits at the inline-end (left) corner and reads as a Latin letter', geo.badgeNearLeft && geo.text === 'F', JSON.stringify(geo));
		await rtl.close();

		const ph = await browser.newContext({ viewport: { width: 390, height: 800 } });
		const pp = await open(ph, '');
		await pp.keyboard.press('F10');
		const phone = await pp.evaluate(() => {
			const bar = document.getElementById('lpn_menubar'), bs = Array.from(document.querySelectorAll('.lpn-kbdbadge')).map((g) => g.getBoundingClientRect());
			return { overflow: document.documentElement.scrollWidth > window.innerWidth, barH: bar.getBoundingClientRect().height, visible: bs.filter((r) => r.width > 0).length };
		});
		ok('phone width: six badges, no horizontal overflow', phone.visible === 6 && !phone.overflow, JSON.stringify(phone));
		await ph.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });

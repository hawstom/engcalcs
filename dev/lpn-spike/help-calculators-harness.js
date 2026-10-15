// Task 625: Help > HawsEDC Calculators sits directly above Privacy notice and its address works.
//   node dev/lpn-spike/help-calculators-harness.js
const fs = require('fs');
const path = require('path');
const env = require('../browser-pass/lib/env');
const en = fs.readFileSync(path.join(__dirname, '../../lib/lang.ec.en.php'), 'utf8');
const label = (en.match(/\$ec_lang\['menu_brand'\]='([^']*)'/) || [])[1];
const privacy = (en.match(/\$ec_lang\['privacy_link'\]='([^']*)'/) || [])[1];
let fails = 0;
function ok(n, c, x) { if (c) { console.log('  ok   ' + n); } else { fails++; console.log('  FAIL ' + n + (x ? '  -- ' + x : '')); } }
(async () => {
	const playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const page = await ctx.newPage();
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
		await page.waitForSelector('#lpn_menu_help');
		await page.waitForTimeout(400);
		await page.click('#lpn_menu_help');
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'))
			.map((b) => (b.querySelector('.lpn-menu-label') || b).textContent.trim().replace(/\s+/g, ' ')));
		const i = rows.findIndex((t) => t.indexOf(label) === 0);
		const p = rows.findIndex((t) => t.indexOf(privacy) === 0);
		ok('the row "' + label + '" is present', i >= 0, JSON.stringify(rows));
		ok('it sits directly above "' + privacy + '"', i >= 0 && p === i + 1, i + ',' + p);
		const row = (await page.$$('#lpn_menu_list button.lpn-menu-row'))[i];
		const [popup] = await Promise.all([ctx.waitForEvent('page'), row.click()]);
		const url = popup.url();
		ok('it opens a new tab on the suite index', /\/index\.php$/.test(url), url);
		const r = await page.request.get(url);
		ok('that address answers HTTP 200', r.status() === 200, String(r.status()));
		ok('this tab is still on the map', /Looped-Network/.test(page.url()));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();

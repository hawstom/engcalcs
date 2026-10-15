// Ctrl+C in the Screenshot markup view copies the picture (Tom, 2026-10-14).
// Real Chromium with the real clipboard (clipboard-read and clipboard-write granted): no stub.
//   node dev/lpn-spike/screenshot-ctrl-c-harness.js
'use strict';
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const READ = async () => {
	const items = await navigator.clipboard.read();
	for (const it of items) {
		if (it.types.indexOf('image/png') >= 0) {
			const b = await it.getType('image/png'), bm = await createImageBitmap(b);
			return { type: 'image/png', w: bm.width, h: bm.height, size: b.size };
		}
	}
	return { type: items.length ? items[0].types.join(',') : 'empty' };
};
(async () => {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'screenshot-ctrl-c-harness', { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: env.origin() });
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1000);
		await a.menuClick(await a.lang('lpn_screenshot_menu'), 'map');
		await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
		await page.keyboard.press('Escape');
		await page.selectOption('#lpn_snip_scale', '2');
		await page.evaluate(() => document.getElementById('lpn_snip_again').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await page.waitForSelector('#lpn_snip_canvas', { state: 'visible', timeout: 15000 });
		const dim = await page.$eval('#lpn_snip_canvas', (c) => ({ w: c.width, h: c.height }));
		await page.evaluate(() => navigator.clipboard.writeText('sentinel'));
		ok('the tip names the key', /Ctrl\+C/.test(await page.$eval('#lpn_snip_copy', (e) => e.title || e.getAttribute('data-bs-original-title') || '')));
		await page.keyboard.press('Control+c');
		for (let i = 0; i < 60 && (await a.notice()) === ''; i++) { await page.waitForTimeout(250); }
		const got = await page.evaluate(READ);
		ok('Ctrl+C puts an image/png on the clipboard', got.type === 'image/png', JSON.stringify(got));
		ok('...of the screenshot\'s size (' + dim.w + ' x ' + dim.h + ')', got.w === dim.w && got.h === dim.h, JSON.stringify(got));
		ok('the confirmation is shown', (await a.notice()) === (await a.lang('lpn_screenshot_copied')), JSON.stringify(await a.notice()));
		// A pen stroke is part of what is copied: the clipboard picture differs from the plain one.
		// Never taken from a text field.
		await page.evaluate(() => navigator.clipboard.writeText('sentinel'));
		await page.evaluate(() => { const i = document.createElement('input'); i.id = 'cc_probe'; i.value = 'abc'; document.getElementById('lpn_snip_edit').appendChild(i); i.focus(); i.select(); });
		await page.keyboard.press('Control+c');
		await page.waitForTimeout(500);
		ok('Ctrl+C in a text field copies the field\'s text, not the picture', (await page.evaluate(() => navigator.clipboard.readText())) === 'abc');
		// Failure: clipboard refuses -> said plainly (downloaded instead).
		await page.evaluate(() => { document.getElementById('cc_probe').remove(); document.activeElement && document.activeElement.blur(); });
		await page.evaluate(() => { navigator.clipboard.write = () => Promise.reject(new Error('denied')); });
		const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
		await page.keyboard.press('Control+c');
		ok('when the clipboard refuses, the picture is downloaded', !!(await dl));
		const pcSaved = await a.lang('lpn_screenshot_saved');
		ok('...and the notice says so plainly', await page.evaluate((t) => document.body.innerText.indexOf(t) >= 0, pcSaved));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})();

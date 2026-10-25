// Before/after screenshots of the default look (Task 811, "the better default"): Net3 open, Settings open, then About.
//   node dev/lpn-spike/theme-default-shots.js before|after   [REPO override via EC_SHOT_REPO]
// Writes ~/webdev/worktrees/_panel/www/img/theme-default-<view>-<tag>.png. Run under flock /tmp/engcalcs-browser.lock.
'use strict';
const path = require('path'), os = require('os'), fs = require('fs');
const REPO = process.env.EC_SHOT_REPO || path.resolve(__dirname, '..', '..');
const OUT = path.join(os.homedir(), 'webdev/worktrees/_panel/www/img');
const tag = process.argv[2] || 'after';
(async () => {
	const env = require(path.join(REPO, 'dev/browser-pass/lib/env.js'));
	const { Session } = require(path.join(REPO, 'dev/browser-pass/lib/session.js'));
	const { chromium } = require(path.join(REPO, 'dev/browser-pass/node_modules/playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const views = [['desktop-light', 1440, 900, 'light'], ['desktop-dark', 1440, 900, 'dark'], ['phone', 390, 780, 'light']];
	for (const [name, w, h, scheme] of views) {
		const s = await Session.open(browser, name, { colorScheme: scheme, viewport: { width: w, height: h } });
		await s.goto('Looped-Network.php');
		await s.page.click('.ec-consent-btn').catch(() => {});
		await s.openExampleCard(await s.lang('lpn_ex_net3_title'));
		await s.settle(800);
		if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')).catch(() => {}); }
		await s.settle(500);
		await s.page.screenshot({ path: path.join(OUT, 'theme-default-' + name + '-' + tag + '.png') });
		await s.menuClick('About', 'help').catch((e) => console.log('about: ' + e.message));
		await s.settle(500);
		await s.page.screenshot({ path: path.join(OUT, 'theme-default-' + name + '-dialog-' + tag + '.png') });
		await s.close();
	}
	await browser.close(); env.stopServer();
})();

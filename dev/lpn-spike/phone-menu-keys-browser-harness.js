// NO SHORTCUT KEYS IN MENUS ON A TOUCH SCREEN (Tom, 2026-10-04, on a phone: "Letters on menus have
// no use on phone. We assume that all phone users have seen this on PC."). In real Chromium:
//   1. a phone (390 x 844, touch, no hover): no menu row shows its shortcut key;
//   2. a desktop (mouse): the same rows still show theirs.
//
//   node dev/lpn-spike/phone-menu-keys-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONEKEYS_BROWSER_LOCKED';
const NAME = 'phone-menu-keys-browser-harness';

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

async function hotkeyRows(Session, browser, extra) {
	const a = await Session.open(browser, NAME, extra);
	try {
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openMenu('edit');
		await a.settle(300);
		return await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-menu-row[data-hotkey]')).map((r) => ({
			key: r.getAttribute('data-hotkey'), shown: getComputedStyle(r, '::after').content
		})));
	} finally { await a.close(); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const phone = await hotkeyRows(Session, browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		ok('the phone\'s Edit menu has rows with a shortcut key to hide', phone.length > 0, phone.length);
		ok('on a phone no row shows its shortcut key', phone.every((r) => r.shown === 'none'), JSON.stringify(phone.filter((r) => r.shown !== 'none')));
		const desk = await hotkeyRows(Session, browser, { viewport: { width: 1400, height: 900 } });
		ok('on a desktop every such row still shows it', desk.length > 0 && desk.every((r) => r.shown !== 'none'), JSON.stringify(desk.slice(0, 3)));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

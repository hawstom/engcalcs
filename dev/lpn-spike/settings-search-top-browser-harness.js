// A NEW SETTINGS SEARCH STARTS AT THE TOP OF ITS RESULTS (R-397). Tom, 2026-10-15: *"Settings search
// has what appears to be a regression. When I type a search term, the scrollbar doesn't go to the
// top. So my results appear empty."*
//
// Regressed by 4de96172 (2026-09-04), which added a pane-height of blank room after the content so
// the last section can scroll to the top. A filter typed while scrolled down then left the reader
// looking at that blank room. Measured here in a real Chrome, at a desktop and a phone width:
//
//   1. Scrolled to the bottom of Settings, typing a word leaves a matching row on screen in the
//      content pane, which starts at the top.
//   2. Clearing the search (Escape) starts at the top too.
//
//   node dev/lpn-spike/settings-search-top-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SETSEARCH_BROWSER_LOCKED';
const NAME = 'settings-search-top-browser-harness';

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

// How the content pane looks now: its scroll, and how many visible setting rows sit inside it.
function view(page) {
	return page.evaluate(() => {
		const c = document.getElementById('lpn_setbox_content'), cr = c.getBoundingClientRect();
		const rows = [...c.querySelectorAll('.lpn-set-row, [data-lpn-setting]')].filter((e) => {
			if (!e.offsetParent) { return false; }
			const b = e.getBoundingClientRect();
			return b.height > 0 && b.bottom > cr.top + 2 && b.top < cr.bottom - 2;
		});
		return { top: Math.round(c.scrollTop), max: c.scrollHeight - c.clientHeight, onScreen: rows.length };
	});
}

async function walk(Session, browser, extra, tag) {
	const a = await Session.open(browser, NAME, extra);
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_basic_us_title'));
		await a.settle(800);
		await a.menuClick('Settings', 'project');
		await a.settle(700);
		const bottom = async () => {
			await a.page.evaluate(() => { const c = document.getElementById('lpn_setbox_content'); c.scrollTop = c.scrollHeight; });
			await a.settle(150);
		};
		await bottom();
		const before = await view(a.page);
		ok(tag + ': the pane really was scrolled down before the search', before.top > 200, JSON.stringify(before));
		await a.page.focus('#lpn_setbox_filter');
		await a.page.keyboard.type('roughness', { delay: 20 });
		await a.settle(300);
		const typed = await view(a.page);
		ok(tag + ': typing a search word starts the results at the top', typed.top === 0, JSON.stringify(typed));
		ok(tag + ': ...so a matching row is on screen, not blank room', typed.onScreen > 0, JSON.stringify(typed));

		await bottom();
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		const cleared = await view(a.page);
		ok(tag + ': ...with the whole list back', cleared.max > before.max - 5, JSON.stringify(cleared));
		ok(tag + ': Escape clears the search and starts at the top', cleared.top === 0, JSON.stringify(cleared));
		ok(tag + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- desktop, 1440 x 900 ---');
		await walk(Session, browser, { viewport: { width: 1440, height: 900 } }, '1440');
		console.log('\n--- phone, 412 x 915, touch ---');
		await walk(Session, browser, { viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true }, 'phone');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

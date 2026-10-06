// THE BOLT SHOWS ON A PHONE WHEN RECALCULATE IS OFF. At <= 640 px the toolbar keeps only the
// transport; an older rule also hid the Calculate button (the bolt), so a phone user with Recalculate
// off had no way to calculate. Measured here in a real Chrome, Net3 open at 360 and 320 px:
//
//   1. Recalculate ON: the bolt is not visible (auto-run does the work).
//   2. Recalculate OFF: the bolt is visible, inside the viewport, and the page has no sideways scroll.
//   3. At 1440 px the bolt follows the same rule (visible only when Recalculate is off).
//
//   node dev/lpn-spike/phone-bolt-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONEBOLT_BROWSER_LOCKED';
const NAME = 'phone-bolt-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention; re-run it alone.');
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

const BOLT = () => {
	const b = document.querySelector('#lpn_toolbar_run button[data-icon="run"]');
	if (!b) { return { exists: false }; }
	const r = b.getBoundingClientRect();
	return {
		exists: true,
		shown: getComputedStyle(b).display !== 'none' && r.width > 0 && r.height > 0,
		inside: r.left >= 0 && r.right <= window.innerWidth + 0.5,
		doc: document.documentElement.scrollWidth > window.innerWidth + 1,
		kids: [...document.querySelectorAll('#lpn_toolbar_run > *')].map((e) => Math.round(e.getBoundingClientRect().left) + '+' + Math.round(e.getBoundingClientRect().width) + e.tagName[0] + (e.getAttribute('data-icon')||'') + ':' + getComputedStyle(e).display).join(' '), grp: Math.round(document.getElementById('lpn_toolbar_run').getBoundingClientRect().left),
		sw: document.documentElement.scrollWidth, iw: window.innerWidth,
		past: [...document.querySelectorAll('#lpn_toolbar *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 0.5 && e.offsetParent).map((e) => e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().right)).slice(0, 6)
	};
};

async function measure(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, { viewport });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1200);
		const on = await a.page.evaluate(BOLT);
		await a.menuClick('Settings', 'project');
		await a.settle(700);
		const label = await a.lang('lpn_settings_auto_run');
		const flipped = await a.page.evaluate((text) => {
			const box = document.getElementById('lpn_setbox_content');
			const inputs = [...box.querySelectorAll('input[type=checkbox]')].filter((i) => {
				const row = i.closest('.lpn-setrow, tr, div, label');
				return row && row.textContent.indexOf(text) === 0 || (row && row.textContent.indexOf(text) >= 0 && row.textContent.length < text.length + 400);
			});
			const i = inputs[0];
			if (!i) { return false; }
			i.checked = false;
			i.dispatchEvent(new Event('change', { bubbles: true }));
			return true;
		}, label);
		await a.settle(500);
		const off = await a.page.evaluate(BOLT);
		return { on, off, flipped };
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
		for (const w of [360, 320, 1440]) {
			console.log('\n--- ' + w + ' px ---');
			const m = await measure(Session, browser, { width: w, height: w < 600 ? 740 : 900 });
			ok(w + ': found and switched off the Recalculate checkbox', m.flipped);
			ok(w + ': Recalculate ON: the bolt is not shown', m.on.exists && !m.on.shown);
			ok(w + ': Recalculate OFF: the bolt is shown', m.off.exists && m.off.shown, JSON.stringify(m.off));
			ok(w + ': Recalculate OFF: the bolt is inside the viewport', m.off.inside);
			ok(w + ': Recalculate OFF: no sideways page scroll', !m.off.doc);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

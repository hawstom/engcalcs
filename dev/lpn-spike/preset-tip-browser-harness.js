// SCENARIO PRESET TIPS: MAX DAY AND PEAK HOUR SHARE ONE SENTENCE, WITH THEIR OWN NUMBERS, in a real Chrome.
//
//   node dev/lpn-spike/preset-tip-browser-harness.js
//
// The scenario menu is opened and the tip on "5. Max Day" and "6. Peak hour" is read.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PRESET_TIP_BROWSER_LOCKED';
const NAME = 'preset-tip-browser-harness';

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

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const count = (a, attr) => a.page.evaluate((s) => new Set(Array.from(document.querySelectorAll('#lpn_canvas [' + s + ']')).map((e) => e.getAttribute(s))).size, attr);
const rowTexts = (a, list) => a.page.$$eval(list + ' button.lpn-menu-row', (els) => els.map((b) => b.textContent.replace(/[▸\s]+$/, '').trim()));

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	await a.newProject('us');
	await a.settle(800);
	return a;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const P = a.page;
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const tipOf = async (name) => {
			const row = await P.$('xpath=//div[@id="lpn_menu_list"]//button[contains(normalize-space(.), "' + name + '")]');
			if (!row) { return null; }
			await row.hover();
			await P.waitForFunction(() => Array.from(document.querySelectorAll('.tooltip.show .tooltip-inner')).some((e) => !/^The set of values/.test(e.textContent)), null, { timeout: 5000 }).catch(() => {});
			const t = await P.evaluate(() => (Array.from(document.querySelectorAll('.tooltip.show .tooltip-inner')).map((e) => e.textContent.trim()).filter((x) => !/^The set of values/.test(x))[0]) || '');
			await P.mouse.move(5, 5); await a.settle(400);
			return t;
		};
		const raw = await a.lang('lpn_scenario_preset_mult_tip');
		const tpl = (m, lo, hi) => raw.replace('{mult}', m).replace('{lo}', lo).replace('{hi}', hi).trim();
		const md = { tip: await tipOf(await a.lang('lpn_scenario_preset_max_day')) }, ph = { tip: await tipOf(await a.lang('lpn_scenario_preset_peak_hour')) }, fm = { tip: await tipOf(await a.lang('lpn_scenario_preset_fire_max_day')) };
		ok('Max Day tip: 2.0 times, between 1.2 and 3.0', md.tip === tpl('2.0', '1.2', '3.0'), md.tip);
		ok('Peak hour tip: 3.0 times, between 3.0 and 6.0', ph.tip === tpl('3.0', '3.0', '6.0'), ph.tip);
		ok('no placeholder left unfilled', !/[{}]/.test((md || {}).tip + (ph || {}).tip));
		ok('Fire plus max day keeps its own tip', fm.tip === (await a.lang('lpn_scenario_preset_fire_max_day_tip')).trim(), fm.tip);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

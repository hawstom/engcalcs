// TABLES COLUMN HEADINGS FOLLOW THE SHORT PROPERTIES NAMES, IN A REAL CHROMIUM (Tom, 2026-10-27:
// "Yes" to Active, Check valve, Initial depth, Minimum depth, Maximum depth). On Net1:
//   1. the Pipes table heads its column Check valve and Active (not "Check valve (CV)" or "Is active?");
//   2. the Tanks table heads Initial depth, Minimum depth and Maximum depth (not "Water depth" ...);
//   3. each heading is the very text the same field carries in Properties (one key, no new strings).
//
//   node dev/lpn-spike/tables-headings-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'tables-headings-browser-harness';
if (process.env.EC_THW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_THW_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
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
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1600, height: 1000 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(2500);
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(600);
		const heads = async (tab) => {
			await page.click('#lpn_pane_tab_' + tab);
			await a.settle(700);
			return page.evaluate((t) => Array.from(document.querySelectorAll('#lpn_pane_' + t + ' thead th')).map((h) => h.textContent.replace(/\s+/g, ' ').trim()), tab);
		};
		const has = (hs, w) => hs.some((h) => h === w || h.indexOf(w + ' ') === 0);
		const pipes = await heads('pipes');
		ok('1.1 Pipes: Check valve and Active', has(pipes, 'Check valve') && has(pipes, 'Active'), JSON.stringify(pipes));
		ok('1.2 Pipes: no "(CV)" and no "Is active?"', !pipes.some((h) => /\(CV\)|Is active/.test(h)), JSON.stringify(pipes));
		const tanks = await heads('tanks');
		ok('2.1 Tanks: Initial depth, Minimum depth, Maximum depth', has(tanks, 'Initial depth') && has(tanks, 'Minimum depth') && has(tanks, 'Maximum depth'), JSON.stringify(tanks));
		ok('2.2 Tanks: no "Water depth"', !tanks.some((h) => /water depth/i.test(h)), JSON.stringify(tanks));
		const keys = ['lpn_field_active_short', 'lpn_field_cv_short', 'lpn_field_tank_level_short', 'lpn_field_tank_minlevel_short', 'lpn_field_tank_maxlevel_short'];
		const vals = [];
		for (const k of keys) { vals.push(await a.lang(k)); }
		ok('3.1 the headings are the Properties keys\' text', JSON.stringify(vals) === JSON.stringify(['Active', 'Check valve', 'Initial depth', 'Minimum depth', 'Maximum depth']), JSON.stringify(vals));
		ok('3.2 no page errors', a.errors.length === 0, (a.errors[0] || '').slice(0, 160));
		await a.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));

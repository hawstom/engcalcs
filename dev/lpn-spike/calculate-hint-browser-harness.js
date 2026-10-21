// CHOOSING WATER > CALCULATE WITH RECALCULATE AUTOMATICALLY ON SAYS IT IS NOT NEEDED (Tom,
// 2026-10-21). Still calculates; opens Settings at the row, marks it, shows a notice with a
// Don't show this again button that is remembered; no notice with the setting off. Also checked at
// phone width (tall).
//
//   node dev/lpn-spike/calculate-hint-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CALCHINT_BROWSER_LOCKED';
const NAME = 'calculate-hint-browser-harness';

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


const IMG = path.join(process.env.HOME, 'webdev/worktrees/_panel/www/img');
const SHOT = (n) => { try { require('fs').mkdirSync(IMG, { recursive: true }); } catch (e) {} return path.join(IMG, n); };

const STATE = () => {
	const box = document.getElementById('lpn_settings_box');
	const hint = document.getElementById('lpn_setbox_calchint');
	const flash = box && box.querySelector('.lpn-set-row-flash');
	const rect = (e) => { if (!e) { return null; } const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
	return {
		boxOpen: !!box && box.style.display === 'flex',
		hint: !!hint && hint.offsetParent !== null, hintText: hint ? hint.querySelector('.lpn-calchint-text').textContent : '',
		flashRow: flash ? flash.textContent.slice(0, 60) : null,
		flashRect: rect(flash), boxRect: rect(box), iw: window.innerWidth, ih: window.innerHeight,
		doc: document.documentElement.scrollWidth > window.innerWidth + 1,
		solved: !!(window.EngCalcs && document.getElementById('lpn_status_text') && document.getElementById('lpn_status_text').textContent)
	};
};

async function run(Session, browser, viewport, tag) {
	const a = await Session.open(browser, NAME, { viewport });
	const out = {};
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } try { localStorage.removeItem('lpn_calchint'); } catch (e) {} });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1200);
		const calc = await a.lang('lpn_time_run');
		out.hintText = await a.lang('lpn_calc_hint');
		out.before = await a.page.evaluate(STATE);
		await a.page.evaluate(() => { window.__runs = 0; const f = EngCalcs.lpnTimeRunNow; EngCalcs.lpnTimeRunNow = function () { window.__runs++; return f.apply(this, arguments); }; });
		await a.menuClick(calc, 'project');
		await a.settle(900);
		out.runs = await a.page.evaluate(() => window.__runs);
		out.on1 = await a.page.evaluate(STATE);
		await a.page.mouse.move(2, 2); await a.settle(500);
		await a.page.screenshot({ path: SHOT(tag === 'desktop' ? 'calculate-hint.png' : 'calculate-hint-phone.png') });
		// Dismiss forever.
		await a.page.click('.lpn-calchint-mute');
		await a.settle(300);
		out.afterMute = await a.page.evaluate(STATE);
		out.stored = await a.page.evaluate(() => { try { return localStorage.getItem('lpn_calchint'); } catch (e) { return 'err'; } });
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(300);
		await a.menuClick(calc, 'project');
		await a.settle(900);
		out.on2 = await a.page.evaluate(STATE);
		// Setting off: unmute, turn the setting off, Calculate again.
		await a.page.evaluate(() => { localStorage.removeItem('lpn_calchint'); document.getElementById('lpn_setbox_close').click(); });
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.settle(600);
		const label = await a.lang('lpn_settings_auto_run');
		await a.page.evaluate((text) => {
			const box = document.getElementById('lpn_setbox_content');
			const row = [...box.querySelectorAll('[data-lpn-setting]')].find((r) => r.textContent.indexOf(text) === 0);
			const i = row.querySelector('input[type=checkbox]'); i.checked = false; i.dispatchEvent(new Event('change', { bubbles: true }));
		}, label);
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(400);
		await a.menuClick(calc, 'project');
		await a.settle(900);
		out.off = await a.page.evaluate(STATE);
	} finally { await a.close(); }
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const [tag, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 360, height: 740 }]]) {
			console.log('\n--- ' + tag + ' ---');
			const m = await run(Session, browser, vp, tag);
			ok(tag + ': before Calculate no hint', !m.before.hint);
			ok(tag + ': Calculate opens Settings', m.on1.boxOpen);
			ok(tag + ': Recalculate automatically row is highlighted', !!m.on1.flashRow && m.on1.flashRow.indexOf('Recalculate automatically') === 0, m.on1.flashRow);
			ok(tag + ': highlighted row is on screen inside the box', !!m.on1.flashRect && !!m.on1.boxRect && m.on1.flashRect.t >= m.on1.boxRect.t && m.on1.flashRect.b <= m.on1.boxRect.b + 1 && m.on1.flashRect.b <= m.on1.ih, JSON.stringify([m.on1.flashRect, m.on1.boxRect]));
			ok(tag + ': notice shows Tom\'s sentence', m.on1.hint && m.on1.hintText === m.hintText && /not needed/.test(m.hintText), m.on1.hintText);
			ok(tag + ': Calculate still calculated', m.runs === 1);
			ok(tag + ': no sideways scroll', !m.on1.doc);
			ok(tag + ': Don\'t show again hides it and is remembered', !m.afterMute.hint && m.stored === '0', String(m.stored));
			ok(tag + ': Calculate again, muted: no notice', !m.on2.hint);
			ok(tag + ': setting off: no notice', !m.off.hint && !m.off.flashRow);
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

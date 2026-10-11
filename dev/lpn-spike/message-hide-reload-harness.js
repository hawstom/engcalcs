// HIDING A MESSAGE SURVIVES A RELOAD, by Tom's exact sequence, in a real Chrome.
//
//   node dev/lpn-spike/message-hide-reload-harness.js     (takes the browser lock itself)
//
// Tom, 2026-10-10, of "hide an amber message with its x, reload the page, it stays hidden": "No.
// Doesn't stay hidden." The earlier harness waited 1.5 s for the autosave and then reloaded, which a
// person does not do. Here: a new project, ONE junction, "Add a reservoir..." shows, click the x, and
// reload at once, at several delays, and again after the project was opened from the library.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MESSAGE_HIDE_RELOAD_LOCKED';
const NAME = 'message-hide-reload-harness';

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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const v of [['new', 0], ['new', 2500], ['blank', 0], ['blank', 2500], ['Net1', 0], ['Net2', 0], ['Net3', 2500]]) {
			const delay = v[1];
			console.log('\n--- ' + v[0] + ' project, one junction, x, reload after ' + delay + ' ms ---');
			const a = await Session.open(browser, NAME + delay, { viewport: { width: 1400, height: 900 } });
			const page = a.page;
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			const prep = async () => {
				await a.answerTrainingPanel().catch(() => {});
				await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			};
			await a.goto('Looped-Network.php');
			await prep();
			await a.settle(1000);
			if (v[0] === 'new') { await a.newProject('us'); } else if (/^Net/.test(v[0])) { await a.openExampleCard(await a.lang('lpn_ex_' + v[0].toLowerCase() + '_title')); await a.settle(2500); }
			await a.dismissGallery();
			await a.toolbarClick('Junction');
			const r = await page.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
			const corner = /^Net/.test(v[0]);
			await page.mouse.click(r.x + r.w * (corner ? 0.97 : 0.3), r.y + r.h * (corner ? 0.97 : 0.4));
			await a.settle(900);
			await a.toolbarClick('Select');
			await a.settle(1200);
			const noRes = corner ? (await a.lang('lpn_omitted_note')).split('{ids}')[0] : await a.lang('lpn_diag_no_fixed_head');
			const text = () => page.evaluate(() => (document.getElementById('lpn_status_text') || {}).textContent);
			ok('"Add a reservoir" is standing', ((await text()) || '').indexOf(noRes) === 0, await text());
			await page.click('#lpn_status_dismiss');
			await a.settle(delay + 50);
			ok('hidden before the reload', (await text()) === '');
			await a.reload();
			await prep();
			await a.settle(2000);
			ok('after the reload the message is still hidden', (await text()) === '', await text());
			if (corner) {
				// A run is new news: an edit that runs again says the sentence again.
				await a.toolbarClick('Junction');
				await page.mouse.click(r.x + r.w * 0.95, r.y + r.h * 0.9); await a.settle(600);
				await a.toolbarClick('Select'); await a.settle(2500);
				ok('a later run says it again', ((await text()) || '').indexOf(noRes) === 0, await text());
			}
			ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + failures + ' failed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });

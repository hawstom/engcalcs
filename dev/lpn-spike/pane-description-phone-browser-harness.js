// THE DESCRIPTION COLUMN DOES NOT OPEN WIDER THAN THE TABLES PANE ON A PHONE (Tom, 2026-11-08, testing at
// phone width: "We can't let the Description column be initially so wide on a phone."). The initial width
// rule (a) holds the longest present content, with no ceiling, so one long Description made the column
// several panes wide. This opens Net3 at a tall phone, gives one pipe a long Description, and measures the
// Pipes table's Description column when nobody has dragged it:
//   1. at 390 px it is no wider than the pane's visible width;
//   2. a width the visitor dragged to is kept, even wider than the pane;
//   3. at 1440 px the column still holds its content (the desktop rule is unchanged).
//
//   node dev/lpn-spike/pane-description-phone-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANEDESC_BROWSER_LOCKED';
const NAME = 'pane-description-phone-browser-harness';

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
const LONGSTR = 'Transmission main from the south booster station to the Elm Street tank, replaced in 1998 with ductile iron, lined, relocated at the creek crossing';
const INP = ['[TITLE]', 'Phone', '', '[JUNCTIONS]', ';ID Elev Demand', ' J1\t100\t5', ' J2\t90\t5', '', '[RESERVOIRS]', ';ID Head', ' R1\t150', '',
	'[PIPES]', ';ID Node1 Node2 Length Diam Rough MinorLoss Status', ' P1\tR1\tJ1\t1000\t12\t100\t0\tOpen\t;' + LONGSTR, ' P2\tJ1\tJ2\t800\t8\t100\t0\tOpen', '',
	'[COORDINATES]', ' R1\t0\t0', ' J1\t100\t0', ' J2\t200\t0', '', '[END]', ''].join('\n');

async function measure(Session, browser, viewport, dragEm) {
	const a = await Session.open(browser, NAME, { viewport });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.evaluate((em) => {
			localStorage.setItem('lpn_pane', JSON.stringify({ open: true, h: 300, tab: 'pipes' }));
			if (em) { localStorage.setItem('lpn_panecols', JSON.stringify({ pipes: { w: { desc: em } } })); }
		}, dragEm || 0);
		await a.reload();
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		await a.page.setInputFiles('#lpn_inp_file', { name: 'desc.inp', mimeType: 'text/plain', buffer: Buffer.from(INP) });
		await a.settle(1500);
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(800);
		return await a.page.evaluate(() => {
			const th = document.querySelector('#lpn_pane_pipes thead th.lpn-pane-col-desc');
			const body = document.getElementById('lpn_pane_pipes');
			const longest = Math.max.apply(null, Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-desc input')).map((i) => i.value.length));
			return { th: th ? Math.round(th.getBoundingClientRect().width) : null,
				pane: Math.round(body.getBoundingClientRect().width), longest: longest };
		});
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
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const p = await measure(Session, browser, { width: 390, height: 844 });
		console.log('  390: description column ' + p.th + ' px, pane ' + p.pane + ' px, longest value ' + p.longest + ' chars');
		ok('390: the Description column is drawn', p.th > 0);
		ok('390: it opens no wider than the pane', p.th <= p.pane, p.th + ' vs ' + p.pane);
		const d = await measure(Session, browser, { width: 390, height: 844 }, 60);
		console.log('  390 dragged to 60em: ' + d.th + ' px');
		ok('390: a dragged width is kept even beyond the pane', d.th > d.pane, d.th + ' vs ' + d.pane);
		const w = await measure(Session, browser, { width: 1440, height: 900 });
		console.log('  1440: description column ' + w.th + ' px, pane ' + w.pane + ' px, longest value ' + w.longest + ' chars');
		ok('1440: the Description column still holds its content (desktop unchanged)', w.th > 800, String(w.th));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

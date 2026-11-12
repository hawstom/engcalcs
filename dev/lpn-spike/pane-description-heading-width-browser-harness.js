// A DESCRIPTION COLUMN OPENS JUST WIDE ENOUGH FOR ITS HEADING (Tom, 2026-11-09: "It shouldn't expand to fit
// its contents; that's not sustainable. Leave it just long enough for its heading."). Opens a project whose
// junction and pipe Descriptions run to several hundred characters with line breaks, and measures the
// Description column of the Junctions and Pipes tables when nobody has dragged it, at 1440 px and 390 px.
// The expected width is the same column's width in the same project with the Descriptions blank, where only
// the heading can set it. A dragged width is kept (stored in lpn_panecols as before).
//
//   node dev/lpn-spike/pane-description-heading-width-browser-harness.js   (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANEDESCW_BROWSER_LOCKED';
const NAME = 'pane-description-heading-width-browser-harness';

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
const LONG = Array.from({ length: 6 }, (_, i) => 'Line ' + (i + 1) + ': transmission main from the south booster station to the Elm Street tank, replaced in 1998 with lined ductile iron, relocated at the creek crossing').join('\\P');
function inp(desc) {
	return ['[TITLE]', 'Desc', '', '[JUNCTIONS]', ';ID Elev Demand Pattern', ' J1\t100\t5\t\t' + (desc ? ';' + desc : ''), ' J2\t90\t5', '', '[RESERVOIRS]', ';ID Head', ' R1\t150', '',
		'[PIPES]', ';ID Node1 Node2 Length Diam Rough MinorLoss Status', ' P1\tR1\tJ1\t1000\t12\t100\t0\tOpen\t' + (desc ? ';' + desc : ''), ' P2\tJ1\tJ2\t800\t8\t100\t0\tOpen', '',
		'[COORDINATES]', ' R1\t0\t0', ' J1\t100\t0', ' J2\t200\t0', '', '[END]', ''].join('\n');
}
async function measure(Session, browser, viewport, tab, desc, dragEm) {
	const a = await Session.open(browser, NAME, { viewport });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.evaluate(([t, em]) => {
			localStorage.setItem('lpn_pane', JSON.stringify({ open: true, h: 300, tab: t }));
			if (em) { const o = {}; o[t] = { w: { desc: em } }; localStorage.setItem('lpn_panecols', JSON.stringify(o)); }
		}, [tab, dragEm || 0]);
		await a.reload();
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		await a.page.setInputFiles('#lpn_inp_file', { name: 'desc.inp', mimeType: 'text/plain', buffer: Buffer.from(inp(desc)) });
		await a.settle(1500);
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(800);
		return await a.page.evaluate((t) => {
			const th = document.querySelector('#lpn_pane_' + t + ' thead th.lpn-pane-col-desc');
			const lens = Array.from(document.querySelectorAll('#lpn_pane_' + t + ' td.lpn-pane-col-desc textarea, #lpn_pane_' + t + ' td.lpn-pane-col-desc input')).map((i) => i.value.length);
			return { th: th ? th.getBoundingClientRect().width : null, longest: lens.length ? Math.max.apply(null, lens) : 0 };
		}, tab);
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
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
			for (const tab of ['junctions', 'pipes']) {
				const base = await measure(Session, browser, vp, tab, '');
				const long = await measure(Session, browser, vp, tab, LONG);
				const tag = vp.width + ' ' + tab;
				console.log('  ' + tag + ': heading-only ' + (base.th && base.th.toFixed(1)) + ' px, long Description ' + (long.th && long.th.toFixed(1)) + ' px (longest value ' + long.longest + ' chars)');
				ok(tag + ': the long Description is really loaded', long.longest > 300, String(long.longest));
				ok(tag + ': the column opens at its heading width', base.th > 0 && Math.abs(long.th - base.th) <= 2, long.th + ' vs ' + base.th);
			}
		}
		const d = await measure(Session, browser, { width: 1440, height: 900 }, 'pipes', LONG, 40);
		ok('1440 pipes: a dragged width (40em) is kept', d.th > 400, String(d.th));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

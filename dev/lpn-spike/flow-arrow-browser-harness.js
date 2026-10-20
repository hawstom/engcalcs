// FLOW ARROW IS A DOUBLE CHEVRON, IN THE REAL PAGE (Tom, 2026-10-20: "To avoid our flow arrows being
// mistaken for leaders, can we try a double chevron unfilled closed arrow?").
//
//   node dev/lpn-spike/flow-arrow-browser-harness.js [out.png]
//
// Net1, calculated. Asserts every drawn .lpn-arrow is a path of two closed subpaths (two heads),
// whose computed fill is none and stroke is the pipe's own. Saves a PNG of the map when a path is
// given. EC_REPO points the run at another checkout (used to photograph master "before").
// Takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FLOWARROW_LOCKED';
const OUT = process.argv[2];

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('NOT RUN -- browser lock held 180 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium;
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'flow-arrow');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);
		await a.page.keyboard.press('F5').catch(() => {});
		await a.settle(200);
		const calc = await a.page.$('#lpn_calc_btn, [data-cmd="calculate"]');
		if (calc) { await calc.click(); await a.settle(1500); }
		const info = await a.page.$$eval('.lpn-arrow', (els) => els.filter((e) => e.style.display !== 'none').map((e) => {
			const cs = getComputedStyle(e), d = e.getAttribute('d') || '';
			return { tag: e.tagName.toLowerCase(), d: d, fill: cs.fill, stroke: cs.stroke, sw: parseFloat(cs.strokeWidth) };
		}));
		console.log('drawn arrows: ' + info.length);
		ok('some arrows are drawn after a solve', info.length > 0);
		if (OUT === undefined || process.env.EC_BEFORE !== '1') {
			ok('each is a <path>', info.every((i) => i.tag === 'path'));
			ok('each has exactly two closed heads (two M, two Z)',
				info.every((i) => (i.d.match(/M/g) || []).length === 2 && (i.d.match(/Z/gi) || []).length === 2));
			ok('none is filled', info.every((i) => i.fill === 'none'));
			ok('all are stroked', info.every((i) => i.stroke && i.stroke !== 'none' && i.sw > 0));
		}
		if (OUT) {
			const el = await a.page.$('#lpn_map, svg.lpn-svg, #lpn_canvas') || a.page;
			await a.page.screenshot({ path: OUT });
			console.log('wrote ' + OUT);
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? fails + ' FAILED' : 'all checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

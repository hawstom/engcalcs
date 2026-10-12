// THE TOOL KEYS RUN 0 SELECT, 1 CHAIN, 2 JUNCTION ... 9 TEXT, in a real Chrome.
//
//   node dev/lpn-spike/tool-key-order-browser-harness.js
//
// Tom, 2026-10-12: Chain was last, far from Junction, with a key separated from Junction's; he asked
// for 0 Select, the other edit buttons, then 1 Chain, 2 Junction and so on. Asserts the key map, the
// Insert group's button order, the Insert menu's row order, and each tip's printed shortcut.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TOOL_KEY_ORDER_LOCKED';
const NAME = 'tool-key-order-browser-harness';

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
		await a.dismissGallery();
		const WANT = ['select', 'add-chain', 'add-junction', 'add-reservoir', 'add-tank', 'add-pipe', 'add-pump', 'add-valve', 'add-meter', 'add-text'];
		const pressed = () => P.evaluate(() => { const b = document.querySelector('#lpn_toolbar [data-tool][aria-pressed="true"]'); return b ? b.dataset.tool : null; });

		console.log('\n--- each digit picks its tool ---');
		for (let d = 0; d <= 9; d++) {
			await P.keyboard.press(d === 0 ? '1' : '0');   // leave the target mode first
			await P.keyboard.press(String(d));
			await a.settle(120);
			ok(d + ' picks ' + WANT[d], (await pressed()) === WANT[d], String(await pressed()));
		}
		await P.keyboard.press('Escape');

		console.log('\n--- the Insert group reads Chain, Junction, ... Text, and Select leads the strip ---');
		const strip = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_toolbar [data-tool]')).map((b) => ({ t: b.dataset.tool, g: Array.from(b.parentNode.parentNode.children).indexOf(b.parentNode), tip: (function () { const i = window.bootstrap && window.bootstrap.Tooltip.getInstance(b); return b.title || (i && (i._config && i._config.title || (i._getTitle && i._getTitle()))) || b.getAttribute('data-bs-original-title') || ''; })() })));
		const keyed = strip.filter((b) => WANT.indexOf(b.t) >= 0);
		ok('keyed buttons appear in key order', keyed.map((b) => b.t).join(' ') === WANT.join(' '), keyed.map((b) => b.t).join(' '));
		const ins = strip.filter((b) => WANT.indexOf(b.t) > 0).map((b) => b.t);
		ok('the Insert group is Chain first, then Junction', ins[0] === 'add-chain' && ins[1] === 'add-junction', ins.join(' '));
		const ci = strip.findIndex((b) => b.t === 'add-chain'), ji = strip.findIndex((b) => b.t === 'add-junction');
		ok('Chain sits immediately before Junction', ji === ci + 1, ci + ',' + ji);
		const hint = await a.lang('lpn_tool_key_hint');
		WANT.forEach((m, d) => {
			const b = strip.find((x) => x.t === m);
			ok(m + ' tip carries "' + hint.replace('{key}', String(d)) + '"', b && b.tip.indexOf(hint.replace('{key}', String(d))) >= 0, b && b.tip);
		});

		console.log('\n--- the Insert menu lists Chain first ---');
		await a.openMenu('project');
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_menu_insert'));
		await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const rows = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		await a.closeMenu();
		const chainLabel = await a.lang('lpn_tool_add_chain'), junctionLabel = await a.lang('lpn_tool_add_junction');
		const ri = rows.findIndex((r) => r.indexOf(chainLabel) === 0), rj = rows.findIndex((r) => r.indexOf(junctionLabel) === 0 && r.indexOf(chainLabel) !== 0);
		ok('Chain is the first Insert row', ri === 0, rows.slice(0, 3).join(' | '));
		ok('Junction follows it', rj === 1, rows.slice(0, 3).join(' | '));
		const helpRows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_hotkeys_popup table.lpn-notes-table tr')).map((r) => r.textContent.trim()));
		const rowFor = helpRows.find((r) => r.indexOf('1' + chainLabel) === 0);
		ok('Help\'s Map table has a row for key 1 naming the Chain tool', !!rowFor, helpRows.slice(0, 3).join(' | '));
		ok('...and no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

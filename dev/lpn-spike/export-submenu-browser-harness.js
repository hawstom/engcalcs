// FILE > EXPORT IS ONE SUBMENU holding every export row, in a real Chrome.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/export-submenu-browser-harness.js
//
// The rows are File > Export > EPANET file and GeoJSON file (Tom, 2026-10-06). The submenu opens by
// mouse (click the row) and by keyboard (Down into File, onto Export, Right), lists every export,
// and each row still downloads exactly one file with the right extension. A new export added to
// exportMenuRows() must be added to ROWS below, or the "every export row" check fails.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_EXPORT_SUBMENU_BROWSER_LOCKED';
const NAME = 'export-submenu-browser-harness';

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

const ROWS = [['lpn_file_export_item_inp', '.inp'], ['lpn_file_export_item_geojson', '.geojson']];
let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const SUB = '#lpn_menu_list2 button.lpn-menu-row';
const norm = (t) => t.replace(/[▸\s]+$/, '').trim();
const subTexts = (a) => a.page.$$eval(SUB, (els) => els.map((b) => b.textContent.replace(/[▸\s]+$/, '').trim()));
const subShown = (a) => a.page.evaluate(() => document.getElementById('lpn_menu_popup2').style.display === 'block');
async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	await a.openExampleCard(await a.lang('lpn_ex_net3_world_title'));
	await a.settle(1500);
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
		for (const how of ['mouse', 'keyboard']) {
			console.log('\n--- opened by ' + how + ' ---');
			const a = await open(browser);
			const menuLabel = (await a.lang('lpn_file_export_menu')).trim();
			const want = [];
			for (const r of ROWS) { want.push((await a.lang(r[0])).trim()); }
			const cur = () => a.page.evaluate(() => (document.activeElement.textContent || '').replace(/[▸\s]+$/, '').trim());
			const openFile = async () => {
				if (how === 'mouse') { await a.page.click('#lpn_menu_file'); }
				else { await a.page.focus('#lpn_menu_file'); await a.page.keyboard.press('ArrowDown'); }
				await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			};
			const openSub = async () => {
				if (how === 'mouse') {
					await a.page.evaluate((l) => {
						const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
						r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
					}, menuLabel);
				} else {
					await a.page.keyboard.press('Home');
					let g = 0;
					while (await cur() !== menuLabel && g++ < 40) { await a.page.keyboard.press('ArrowDown'); }
					await a.page.keyboard.press('ArrowRight');
				}
				await a.page.waitForSelector(SUB, { state: 'attached' });
			};
			await openFile();
			const flat = (await a.page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((b) => b.textContent))).map(norm);
			ok('File has the Export row and no other row starting Export', flat.indexOf(menuLabel) >= 0 && !flat.some((t) => /^Export/i.test(t) && t !== menuLabel), flat.join(' | '));
			await openSub();
			ok('the fly-out is shown', await subShown(a));
			const got = await subTexts(a);
			ok('it holds every export row, in order', JSON.stringify(got) === JSON.stringify(want), got.join(' | '));
			ok('no row repeats the word Export', got.every((t) => !/^Export/i.test(t)));
			for (let i = 0; i < ROWS.length; i++) {
				if (i > 0) { await a.page.keyboard.press('Escape'); await a.settle(200); await openFile(); await openSub(); }
				let dl = null;
				const p = a.page.waitForEvent('download', { timeout: 8000 }).then((d) => { dl = d; }, () => {});
				if (how === 'mouse') {
					await a.page.evaluate((l) => {
						const r = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
						r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
					}, want[i]);
				} else {
					for (let k = 0; k < i; k++) { await a.page.keyboard.press('ArrowDown'); }
					await a.page.keyboard.press('Enter');
				}
				await p;
				ok(want[i] + ' downloads one file ending ' + ROWS[i][1], !!dl && dl.suggestedFilename().endsWith(ROWS[i][1]), dl && dl.suggestedFilename());
				await a.settle(400);
			}
			ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
			await a.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

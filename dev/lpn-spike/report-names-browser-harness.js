// REPORTS MENU ROW NAMES AND THE BOXES THEY OPEN, in a real Chrome.
//
//   node dev/lpn-spike/report-names-browser-harness.js
//
// Tom, 2026-10-07: no Reports row carries "(EPANET)"; the Status row reads "Status changes" and
// so does its box title. Each row is clicked and the box it opens is checked.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_REPORT_NAMES_BROWSER_LOCKED';
const NAME = 'report-names-browser-harness';

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
		const openReports = async () => {
			await a.closeMenu().catch(() => {}); await a.settle(200);
			await a.openMenu('project');
			await P.evaluate((l) => {
				const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
				r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			}, await a.lang('lpn_reports_menu'));
			await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		};
		await openReports();
		const reps = await rowTexts(a, '#lpn_menu_list2');
		ok('rows read Run, Status changes, Calibration, Full', JSON.stringify(reps.slice(2)) === JSON.stringify(['Run', 'Status changes', 'Calibration', 'Full']), reps.join(' | '));
		ok('no row says EPANET', !reps.some((t) => /EPANET/.test(t)), reps.join(' | '));
		const L = async (k) => (await a.lang(k)).trim();
		const names = { run: await L('lpn_reports_epanet'), status: await L('lpn_reports_status'), calib: await L('lpn_reports_calib'), full: await L('lpn_reports_full') };
		ok('row texts are the language strings, none naming EPANET', JSON.stringify(reps.slice(2)) === JSON.stringify([names.run, names.status, names.calib, names.full]) && !/EPANET/.test(names.run + names.status));
		const cases = [[names.run, 'lpn_rptbox', await L('lpn_time_run_report')], [names.status, 'lpn_status_box', await L('lpn_status_title')], [names.full, 'lpn_full_box', null], [names.calib, 'lpn_calib_box', null]];
		const noReport = await L('lpn_time_no_report');
		for (const [row, box, title] of cases) {
			await openReports();
			await P.evaluate((t) => {
				const r = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === t);
				r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			}, row);
			await a.settle(500);
			const info = await P.evaluate((id) => {
				const b = document.getElementById(id);
				const t = document.getElementById(id.replace('_box','box') + '_title');
				return { shown: !!b && b.style.display !== 'none', title: t ? t.textContent.trim() : null };
			}, box);
			if (row === names.run) {
				// No run yet: the row answers with a notice instead of an empty box.
				const said = await P.evaluate((nr) => document.body.innerText.indexOf(nr) >= 0, noReport);
				ok('Run answers with the no-report notice (nothing calculated yet)', info.shown || said, JSON.stringify(info));
			} else {
				ok(row + ' opens ' + box, info.shown, JSON.stringify(info));
			}
			if (title) { ok(row + ' box title does not say EPANET', !/EPANET/.test(info.title || ''), info.title); }
			if (title) { ok(row + ' box title is "' + title + '"', info.title === title, info.title); }
		}
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

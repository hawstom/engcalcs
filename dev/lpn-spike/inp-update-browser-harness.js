// AN EPANET FILE UPDATES THE OPEN PROJECT (Task 814), in a real Chrome through the real File menu.
//
//   node dev/lpn-spike/inp-update-browser-harness.js
//
// With assets in the open project, File > Import > EPANET file asks where the file goes. "This project"
// matches IDs, updates values, adds and keeps assets, and ends in a receipt dialog; "A new project" is
// the old behaviour. Real Chrome catches what the stub cannot: the dialog buttons actually work.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_INP_UPDATE_BROWSER_LOCKED';
const NAME = 'inp-update-browser-harness';

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


const mk = (j2, p1, extra) => ['[TITLE]', 'upd', '', '[JUNCTIONS]', ' J1  10  100', ' J2  ' + j2 + '  100', extra.junc || '',
	'[RESERVOIRS]', ' R1  50', '', '[PIPES]', ' P1  R1  J1  1000  ' + p1 + '  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', extra.pipe || '', '',
	'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
	'[COORDINATES]', ' R1  1100  2100', ' J1  1200  2150', ' J2  1300  2250', extra.coord || '', '', '[END]', ''].join('\n');
const A = mk('10', '12', {});
const B = mk('15.50', '14', { junc: ' J7  20  5', pipe: ' P7  J2  J7  500  6  100  0  Open', coord: ' J7  1400  2300' });
const dialogText = (a) => a.page.evaluate(() => (document.getElementById('lpn_dialog_body') || {}).textContent || '');
async function closeDialogs(a) {
	for (let k = 0; k < 6; k++) {
		const shown = await a.page.evaluate(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
		if (!shown) { return; }
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(300);
	}
}
const buttons = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		const T = {};
		for (const k of ['lpn_inpup_btn_new', 'lpn_inpup_h_kept', 'lpn_inpup_h_added', 'lpn_inpup_h_na', 'lpn_cancel']) { T[k] = (await a.lang(k)).trim(); }
		const proj = (await a.lang('lpn_inpup_btn_project')).trim();

		await a.page.setInputFiles('#lpn_inp_file', { name: 'upd.inp', mimeType: 'text/plain', buffer: Buffer.from(A) });
		await a.settle(900);
		await closeDialogs(a);
		const tabs0 = (await a.tabs()).length;
		ok('an empty project takes the first file with no question', tabs0 >= 1);

		console.log('\n--- the question, then This project ---');
		await a.page.setInputFiles('#lpn_inp_file', { name: 'upd2.inp', mimeType: 'text/plain', buffer: Buffer.from(B) });
		await a.settle(900);
		const bs = await buttons(a);
		ok('the buttons are: a new project, this project, Cancel', bs.length === 3 && bs[0] === T.lpn_inpup_btn_new && bs[1] === proj.replace('{project}', 'upd') && bs[2] === T.lpn_cancel, bs.join(' | '));
		await a.page.click('#lpn_dialog_buttons button:has-text("' + bs[1] + '")');
		await a.settle(900);
		const rec = await dialogText(a);
		ok('no second project tab was made', (await a.tabs()).length === tabs0);
		ok('the receipt names the change old to new', /J2, [^:]+: 10 to 15\.50/.test(rec) && /P1, [^:]+: 12 to 14/.test(rec), rec.slice(0, 260));
		ok('the receipt lists the added assets by kind, and has no empty "not applied" part', rec.indexOf(T.lpn_inpup_h_added) >= 0 && rec.indexOf('Junction J7') >= 0 && rec.indexOf(T.lpn_inpup_h_na) < 0);
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(500);
		console.log('\n--- one undo puts it all back ---');
		await a.page.keyboard.press('Control+z');
		await a.settle(700);
		await a.page.setInputFiles('#lpn_inp_file', { name: 'upd2.inp', mimeType: 'text/plain', buffer: Buffer.from(B) });
		await a.settle(900);
		await a.page.click('#lpn_dialog_buttons button:has-text("' + bs[1] + '")');
		await a.settle(900);
		const again = await dialogText(a);
		ok('after Undo the same file changes the same values again (the old ones were back)', /J2, [^:]+: 10 to 15\.50/.test(again), again.slice(0, 200));
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(400);
		console.log('\n--- A new project ---');
		await a.page.setInputFiles('#lpn_inp_file', { name: 'upd3.inp', mimeType: 'text/plain', buffer: Buffer.from(B) });
		await a.settle(900);
		await a.page.click('#lpn_dialog_buttons button:has-text("' + T.lpn_inpup_btn_new + '")');
		await a.settle(1200);
		ok('the old behaviour: a new project tab appears', (await a.tabs()).length === tabs0 + 1, String((await a.tabs()).length));
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

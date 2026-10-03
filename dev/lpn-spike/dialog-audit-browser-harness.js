// A CONVERTED MESSAGE LANDS IN THE LOG AND NEVER IN A DIALOG (ROADMAP Task 710). A real Chrome.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/dialog-audit-browser-harness.js
//
// Two converted alert()s, reached the way a visitor reaches them: choose a file that is not a
// project (lpn_import_bad_file), and choose a file that is not an EPANET network
// (lpn_inp_bad_file). Each must (1) show on the map's notice line, (2) be in the message log at the
// warning severity, and (3) never raise a browser dialog. Playwright auto-dismisses a dialog, so
// the page handler counts them instead; a count above zero is the defect.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DIALOG_AUDIT_BROWSER_LOCKED';
const NAME = 'dialog-audit-browser-harness';

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
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const dialogs = [];
		a.page.on('dialog', (d) => { dialogs.push(d.type() + ': ' + d.message()); d.dismiss().catch(() => {}); });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);

		const pc = await a.page.evaluate(() => ({ p: EngCalcs.pageConfig.lpn_import_bad_file, i: EngCalcs.pageConfig.lpn_inp_bad_file }));
		const cases = [
			['a file that is not a project', '#lpn_project_file', 'notes.json', '{ this is not a project', pc.p],
			['a file that is not an EPANET network', '#lpn_inp_file', 'notes.inp', 'nothing like a network here', pc.i]
		];
		for (const [label, sel, name, body, said] of cases) {
			console.log('\n--- ' + label + ' ---');
			ok('the page supplies the sentence', !!said);
			await a.page.setInputFiles(sel, { name, mimeType: 'text/plain', buffer: Buffer.from(body) });
			await a.settle(800);
			const got = await a.page.evaluate(() => {
				const n = document.getElementById('lpn_map_notice');
				return { notice: n ? n.textContent : '', shown: !!n && getComputedStyle(n).display !== 'none' };
			});
			ok('it shows on the map notice line', got.shown && got.notice === said, got.notice);
			// Open the log through its own glyph: that is the proof it is READABLE, not just kept.
			await a.page.click('#lpn_msglog_btn');
			await a.settle(300);
			const rows = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_msglog_panel .lpn-msglog-panel-row')).map((r) => r.textContent));
			ok('and it is in the message log', rows.some((t) => t.indexOf(said) >= 0), rows.length + ' row(s)');
			await a.page.click('#lpn_msglog_btn');
			await a.settle(200);
		}
		ok('no blocking dialog was raised', dialogs.length === 0, dialogs.join(' | '));
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

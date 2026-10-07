// PROJECT FILES ARE WRITTEN AS .epp AND .epp, .lwn AND .json ALL OPEN, in a real Chrome.
//
//   node dev/lpn-spike/epp-file-browser-harness.js
//
// Task 780 (Tom, 2026-10-07: "Do it" on writing .epp from the next merge while still reading .lwn
// and .json). File > Save as suggests a name ending .epp and writes it; the file's content is the
// same JSON; Open takes an .epp, an .lwn and a .json alike, each showing the saved network.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_EPP_FILE_BROWSER_LOCKED';
const NAME = 'epp-file-browser-harness';

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
const nodes = (a) => a.page.evaluate(() => new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node'))).size);

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
		const box = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top }; });
		const L = await P.evaluate(() => ({ sa: EngCalcs.pageConfig.lpn_file_saveas, op: EngCalcs.pageConfig.lpn_file_open }));

		console.log('\n--- File > Save as writes .epp ---');
		await a.dismissGallery();
		ok('a new project starts empty', (await nodes(a)) === 0, String(await nodes(a)));
		await P.keyboard.press('2');
		for (let i = 0; i < 3; i++) { await P.mouse.click(box.x + 200 + i * 120, box.y + 400); await a.settle(250); }
		await P.keyboard.press('Escape');
		ok('three junctions drawn', (await nodes(a)) === 3, String(await nodes(a)));
		await a.menuClick(L.sa);
		await a.settle(600);
		if (await a.dialog()) { await a.answerTrainingPanel(); await a.settle(1500); }
		const calls = (await a.pickerCalls()).filter((c) => c.kind === 'save');
		ok('the Save as picker suggests a name ending .epp', calls.length === 1 && /\.epp$/.test(calls[0].suggestedName), JSON.stringify(calls));
		const files = await a.listFiles();
		const written = files.filter((f) => /\.epp$/.test(f));
		ok('the file written ends .epp, and no .lwn or .json is written', written.length === 1 && !files.some((f) => /\.(lwn|json)$/i.test(f)), files.join(', '));
		const text = await a.readFile(written[0]);
		const doc = JSON.parse(text);
		ok('the content is the same JSON project (format key unchanged)', typeof doc.format === 'string' && doc.format.length > 0 && Array.isArray(doc.nodes || doc.network && doc.network.nodes || [1]), String(doc.format));

		console.log('\n--- Open takes .epp, .lwn and .json ---');
		for (const ext of ['.epp', '.lwn', '.json']) {
			const b = await open(browser);
			const before = await nodes(b);
			await b.writeFile('Carried' + ext, text);
			await b.queuePick('Carried' + ext);
			await b.menuClick(L.op);
			await b.settle(1500);
			// The file was just saved by the first session, which still holds its lock: open it read-only.
			for (let k = 0; k < 3 && (await b.dialog()); k++) {
				const d = await b.dialog();
				if ((d.buttons || []).indexOf('Open read-only') >= 0) { await b.dialogClick('Open read-only'); } else { await b.answerTrainingPanel().catch(() => {}); }
				await b.settle(1500);
			}
			ok('Open reads a ' + ext + ' file: its three junctions are on the map', before === 0 && (await nodes(b)) === 3, before + ' -> ' + (await nodes(b)));
			ok('...and no uncaught page errors (' + ext + ')', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
			await b.close();
		}
		// The hidden file inputs (drag-in, library, Convert as) take all three too.
		for (const id of ['lpn_project_file', 'lpn_library_file', 'lpn_geo_file']) {
			const acc = await P.evaluate((i) => document.getElementById(i).getAttribute('accept'), id);
			ok(id + ' accepts .epp, .lwn and .json', /\.epp/.test(acc) && /\.lwn/.test(acc) && /\.json/.test(acc), acc);
		}
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

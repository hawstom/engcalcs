// **DOES THE LOOPED NETWORK PAGE RUN WITH NO PHP BEHIND IT?** (Task 756, desktop plan, Spike 0)
//
//   node dev/lpn-spike/desktop-static-harness.js          (about 25 s; needs Chromium, php, python3)
//
// Builds the English page with dev/scripts/build_desktop_static.php into a scratch folder, serves
// that folder with `python3 -m http.server` (which runs no PHP), opens Net1, and reads the
// junction pressures from the built-in solver and from EPANET. Then it tries the same folder
// straight from file:// and REPORTS what happens; that half is information, never a failure,
// because it is known not to work (see "Spike 0 result" in dev/desktop-platforms-plan.md).
//
// Not in check_all: it launches a browser and takes longer than the 60 s that keeps a check
// in. Browser runs go through `flock /tmp/engcalcs-browser.lock`; this does not take it itself.

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');

const REPO = path.resolve(__dirname, '../..');
const pw = require(path.join(REPO, 'dev/browser-pass/node_modules/playwright-core'));
const env = require(path.join(REPO, 'dev/browser-pass/lib/env.js'));

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++; if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}
function note(s) { console.log('  --   ' + s); }

const OUT = process.env.DESKTOP_OUT || path.join(os.tmpdir(), 'engcalcs-desktop-build-' + process.pid);

function freePort() {
	return new Promise((res) => {
		const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); });
	});
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function dirSize(d) {
	return fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => {
		const p = path.join(d, e.name);
		return n + (e.isDirectory() ? dirSize(p) : fs.statSync(p).size);
	}, 0);
}

// Everything that goes wrong on a page, in one list.
function watch(page) {
	const log = { errors: [], pageErrors: [], failed: [], bad: [], ok: [] };
	page.on('console', m => { if (m.type() === 'error') { log.errors.push(m.text().slice(0, 160)); } });
	page.on('pageerror', e => log.pageErrors.push(String(e).slice(0, 160)));
	page.on('requestfailed', r => log.failed.push(r.url().replace(/^.*?\/\/[^/]*/, '') + ' ' + r.failure().errorText));
	page.on('response', r => {
		const u = r.url().replace(/^.*?\/\/[^/]*/, '');
		if (r.status() >= 400) { log.bad.push(r.status() + ' ' + r.request().method() + ' ' + u); } else { log.ok.push(u); }
	});
	return log;
}

// The Pressure column of the Junctions table, by header, as numbers.
async function pressures(page) {
	return page.evaluate(() => {
		const t = document.querySelector('#lpn_pane_junctions table');
		const heads = [...t.querySelectorAll('thead th')].map(h => h.textContent.replace(/­/g, ''));
		const col = heads.findIndex(h => /^Pressure/.test(h));
		return [...t.querySelectorAll('tbody tr')].map(r => {
			const c = r.children;
			return { id: (c[0].textContent || '').trim(), p: parseFloat(c[col].textContent) };
		});
	});
}
async function setEngineCheckbox(page, builtIn) {
	// The Settings box row for the built-in solver, found by its language key; checked means built-in.
	await page.evaluate((want) => {
		const label = EngCalcs.pageConfig.lpn_settings_engine_native;
		const row = [...document.querySelectorAll('input[type=checkbox]')].find(i =>
			((i.closest('div') || {}).textContent || '').indexOf(label) >= 0);
		if (row.checked !== want) { row.click(); }
	}, builtIn);
	await page.waitForTimeout(3500);
}

(async () => {
	console.log('build');
	execFileSync('php', [path.join(REPO, 'dev/scripts/build_desktop_static.php'), OUT], { stdio: ['ignore', 'ignore', 'inherit'] });
	const mb = dirSize(OUT) / 1048576;
	check(fs.existsSync(path.join(OUT, 'index.html')), 'the page was rendered to index.html');
	note('folder size ' + mb.toFixed(1) + ' MB');

	const port = await freePort();
	const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: OUT, stdio: 'ignore' });
	await sleep(800);
	const browser = await pw.chromium.launch({ executablePath: env.findChromium() });
	try {
		// ---- served over http, no PHP ----------------------------------------------------
		console.log('served over http (python http.server, no PHP)');
		const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();
		const log = watch(page);
		await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
		await page.waitForTimeout(2500);
		check(log.pageErrors.length === 0, 'no uncaught page errors', log.pageErrors.join(' | '));
		const cards = await page.$$eval('#lpn_examples_pane .lpn-example-card', e => e.length);
		check(cards >= 7, 'the example wall has its cards (manifest.json fetched)', cards + ' cards');
		await page.click('#lpn_examples_pane .lpn-example-card:has-text("EPANET Net1")');
		await page.waitForTimeout(2500);
		const nodes = await page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-symbols > *:not(.lpn-node-hit)').length);
		check(nodes > 5, 'Net1 opened and drew', nodes + ' symbols');
		await page.click('#lpn_pane_btn'); await page.waitForTimeout(400);
		await page.click('#lpn_pane_tab_junctions'); await page.waitForTimeout(600);
		await page.click('#lpn_toolbar button[aria-label="Settings"]'); await page.waitForTimeout(600);

		await setEngineCheckbox(page, true);
		const nat = await pressures(page);
		check(nat.length >= 9 && nat.every(r => r.p > 0), 'built-in solver: pressures read', 'first junction = ' + nat[0].p + ' psi');
		await setEngineCheckbox(page, false);
		const epa = await pressures(page);
		check(epa.length === nat.length && epa.every(r => r.p > 0), 'EPANET: pressures read', 'first junction = ' + epa[0].p + ' psi');
		const epanetLoaded = log.ok.some(u => /epanet-js\.js/.test(u)) && log.ok.some(u => /slim\/index\.js/.test(u));
		check(epanetLoaded, 'the EPANET engine files were served (epanet-js.js and slim/index.js)');
		const stat = await page.evaluate(() => (document.getElementById('lpn_status') || {}).textContent || '');
		const missing = await page.evaluate(() => EngCalcs.pageConfig.lpn_time_no_engine);
		check(stat.indexOf(missing.slice(0, 40)) < 0, 'the status line does not say the EPANET engine is missing');
		const worst = Math.max.apply(null, nat.map((r, i) => Math.abs(r.p - epa[i].p)));
		note('largest pressure difference between the two engines: ' + worst.toFixed(2) + ' psi');

		const unexpected = log.bad.filter(s => !/\/(log-[a-z-]+|sw|manifest|lpn-lock)\.php/.test(s));
		check(unexpected.length === 0, 'no failed request except the known server pages', unexpected.join(' | '));
		note('known server-page failures seen: ' + (log.bad.filter(s => !unexpected.includes(s)).join(' ; ') || 'none'));
		note('console errors: ' + (log.errors.join(' ; ') || 'none'));
		await page.context().close();

		// ---- the same folder from file:// -------------------------------------------------
		console.log('same folder opened from file:// (information only)');
		const p2 = await (await browser.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();
		const l2 = watch(p2);
		await p2.goto('file://' + path.join(OUT, 'index.html'), { waitUntil: 'load' });
		await p2.waitForTimeout(2500);
		note('as built (absolute /engcalcs/ paths): ' + l2.failed.length + ' failed requests, ' + l2.pageErrors.length + ' page errors; EngCalcs defined: ' + await p2.evaluate(() => typeof window.EngCalcs));
		await p2.context().close();

		// A copy with the absolute paths made relative, to see what file:// breaks beyond them.
		const REL = OUT + '-rel';
		fs.rmSync(REL, { recursive: true, force: true });
		fs.cpSync(OUT, REL, { recursive: true });
		const idx = path.join(REL, 'index.html');
		fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace(/(["'(])\/engcalcs\//g, '$1engcalcs/'));
		const p3 = await (await browser.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();
		const l3 = watch(p3);
		await p3.goto('file://' + idx, { waitUntil: 'load' });
		await p3.waitForTimeout(2500);
		note('paths made relative in index.html only: scripts run: ' + await p3.evaluate(() => typeof window.EngCalcs) +
			'; example wall cards: ' + await p3.$$eval('#lpn_examples_pane .lpn-example-card', e => e.length));
		note('  failed: ' + (l3.failed.slice(0, 6).join(' ; ') || 'none') + '; console: ' + (l3.errors.slice(0, 4).join(' ; ') || 'none'));
		note('  EPANET module import() from file://: ' + await p3.evaluate(() =>
			import('./engcalcs/js/vendor/epanet-js.js').then(() => 'worked', e => 'refused (' + e.message.slice(0, 70) + ')')));
		await p3.context().close();
		fs.rmSync(REL, { recursive: true, force: true });
	} finally {
		await browser.close();
		server.kill();
		if (!process.env.DESKTOP_OUT) { fs.rmSync(OUT, { recursive: true, force: true }); }
	}
	console.log(failures ? failures + ' of ' + checks + ' FAILED' : 'all ' + checks + ' ok');
	process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

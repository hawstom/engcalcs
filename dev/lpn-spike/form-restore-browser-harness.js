// THE BROWSER'S FORM RESTORE MUST NOT POUR STALE VALUES INTO THE SETTINGS BOXES, in a real Chrome.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/form-restore-browser-harness.js
//
// Tom saw the Settings > Symbology > Node labels prefix/suffix/number boxes holding a longitude,
// a latitude and other fields' prefixes (2026-10-26). Chrome saves each control's value on leaving
// the page and restores by position on back/forward; a different number of controls then shifts
// the values. Here the shift is forced (three extra text boxes typed into before leaving, which a
// later visit would not have), once with the inline js/no-form-restore.js cut out, to prove the browser really
// does it, and once as shipped, to prove the Settings label boxes come back as the model wrote them.
// Also: every input, select and textarea on the page, static or script-built, carries
// autocomplete="off".
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FORM_RESTORE_BROWSER_LOCKED';
const NAME = 'form-restore-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s; re-run alone.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++; if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
// A Playwright route switches off the browser's form restore, which is the thing under test, so
// nothing here uses one. The control run goes through a tiny forwarding server that answers 404 for
// the protection script cut out of the page; tile hosts are made unreachable by a launch flag instead.
const http = require('http');
function proxy(origin, blockFix) {
	return new Promise((resolve) => {
		const srv = http.createServer(async (q, res) => {
			if (q.url.startsWith('/blank')) { res.setHeader('content-type', 'text/html'); return res.end('<p>blank'); }
			const r = await fetch(origin + q.url);
			res.statusCode = r.status; res.setHeader('content-type', r.headers.get('content-type') || '');
			let body = Buffer.from(await r.arrayBuffer());
			if (blockFix && /Looped-Network\.php/.test(q.url)) {
				const t = body.toString('utf8'), mo = t.indexOf('new MutationObserver(sweep)'), at = t.lastIndexOf('<script>', mo), end = t.indexOf('</script>', mo);
				if (mo < 0 || at < 0) { throw new Error('protection script not found in the page'); }
				body = Buffer.from(t.slice(0, at) + t.slice(end + 9));
			}
			res.end(body);
		}).listen(0, () => resolve(srv));
	});
}
async function run(browser, Session, env, blockFix) {
	const origin = new URL(env.pageUrl('Looped-Network.php')).origin;
	const srv = await proxy(origin, blockFix), base = 'http://localhost:' + srv.address().port;
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.goto(base + '/engcalcs/Looped-Network.php', { waitUntil: 'load' });
	await a.settle(1500);
	const snap = () => a.page.evaluate(() => [...document.querySelectorAll('#lpn_labels_node_fields input, #lpn_labels_link_fields input')]
		.map((i) => i.type === 'checkbox' ? String(i.checked) : i.value));
	const before = await snap();
	const unprotected = await a.page.evaluate(() => [...document.querySelectorAll('input,select,textarea')]
		.filter((i) => i.getAttribute('autocomplete') !== 'off').map((i) => i.id || i.outerHTML.slice(0, 60)));
	// Stale state: extra typed boxes at the very front, as an older build's page would have had.
	await a.page.evaluate(() => {
		for (let k = 0; k < 6; k++) {
			const i = document.createElement('input'); i.type = k % 2 ? 'number' : 'text';
			i.value = k % 2 ? '38.1' : '-122.' + k; document.body.insertBefore(i, document.body.firstChild);
		}
	});
	await a.page.evaluate(() => { window.addEventListener('unload', () => {}); }); // keeps the page out of the back/forward cache, so the browser must restore form state
	await a.page.goto(base + '/blank');
	await a.page.goBack();
	await a.settle(2000);
	const after = await snap();
	const landed = await a.page.evaluate(() => [...document.querySelectorAll('input')].filter((i) => /^-122\.|^38\.1$/.test(i.value)).map((i) => (i.id || i.closest('[id]').id) + '=' + i.value));
	console.log(blockFix ? 'stale values landed in: ' + landed.slice(0, 10).join(', ') : 'landed (shipped): ' + landed.length);
	await a.close(); srv.close();
	return { before, after, unprotected, same: JSON.stringify(before) === JSON.stringify(after) };
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath, args: ['--host-resolver-rules=MAP tile.openstreetmap.org 127.0.0.1:1, MAP *.tile.openstreetmap.org 127.0.0.1:1, MAP api.mapbox.com 127.0.0.1:1'] });
	try {
		console.log('\n--- control: the protection blocked ---');
		const c = await run(browser, Session, env, true);
		ok('without the protection the browser does shift values into the Settings boxes (the defect is real)', !c.same);
		console.log('\n--- as shipped ---');
		const s = await run(browser, Session, env, false);
		ok('the Settings label boxes read the same after back/forward with stale boxes typed into', s.same,
			s.same ? '' : JSON.stringify(s.after));
		ok('every input, select and textarea carries autocomplete="off"', s.unprotected.length === 0, s.unprotected.slice(0, 5).join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + checks + ' checks, ' + failures + ' failures');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

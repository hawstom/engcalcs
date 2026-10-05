// THE EPANET ENGINE IS PREFETCHED ONCE, ONLY AFTER IDLE, AND THE FIRST RUN DOES NOT DOWNLOAD IT AGAIN
// (Task 726; Tom, 2026-10-05: "EPANET pre-fetch slowly: Yes.").   node dev/lpn-spike/engine-idle-prefetch-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Not to be confused with engine-prefetch-harness.js, which is Task 608's warm-on-solveable-network.
//
// A real Chromium against this checkout's own php -S. Downloads are counted from the SERVER's access
// log (200 responses for js/vendor/epanet-js.js and js/vendor/slim/index.js), because a count made in
// the page would not see a request the service worker answered. requestIdleCallback is replaced by a
// queue the harness flushes, so "not before idle" is observed rather than assumed.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_IDLEPF_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('engine-idle-prefetch-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('engine-idle-prefetch-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('engine-idle-prefetch-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// Idle callbacks wait in window.__idleQ until the harness runs them; connection is stubbed on request.
const IDLE_STUB = `
	window.__idleQ = [];
	window.requestIdleCallback = function (fn) { window.__idleQ.push(fn); return window.__idleQ.length; };
	window.__flushIdle = function () { var q = window.__idleQ.splice(0); q.forEach(function (f) { f({ didTimeout: false, timeRemaining: function () { return 50; } }); }); return q.length; };
`;
// The page's own fetch calls, recorded: a repeat served from the HTTP cache never reaches the server
// log, so the server log alone cannot see a guard that has been removed.
const FETCH_LOG_STUB = `
	window.__fetchLog = [];
	(function () { var f = window.fetch; window.fetch = function (u, init) {
		window.__fetchLog.push({ url: String(u && u.url || u), priority: init && init.priority || '' });
		return f.apply(this, arguments); }; })();
`;
const SAVE_DATA_STUB = `
	Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true, effectiveType: '4g' } });
`;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	const srv = await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('engine-idle-prefetch-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const downloads = (re) => srv.errors.join('').split('\n').filter((l) => /\[200\]: GET/.test(l) && re.test(l)).length;
	const ENGINE = /\/js\/vendor\/epanet-js\.js/, SLIM = /\/js\/vendor\/slim\/index\.js/;

	async function open(name, initScripts, extra) {
		const a = await Session.open(browser, name, extra);
		for (const s of initScripts) { await a.context.addInitScript(s); }
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		return a;
	}

	try {
		// ---- A. idle, once, and the first Run reuses it ----
		console.log('A. the ordinary visitor');
		let e0 = downloads(ENGINE), s0 = downloads(SLIM);
		const a = await open('idle-a', [IDLE_STUB, FETCH_LOG_STUB]);
		const pageFetches = (pg) => pg.page.evaluate(() => window.__fetchLog.filter((x) => /epanet-js\.js|slim\/index\.js/.test(x.url)));
		await a.settle(1500);
		ok('page loaded and the first project has drawn', await a.page.evaluate(() => document.readyState === 'complete' && !!document.getElementById('lpn_canvas')));
		ok('an idle callback is waiting', await a.page.evaluate(() => window.__idleQ.length) >= 1);
		ok('nothing fetched before idle', downloads(ENGINE) === e0 && downloads(SLIM) === s0);
		await a.page.evaluate(() => window.__flushIdle());
		await a.settle(2500);
		ok('after idle: the engine fetched once', downloads(ENGINE) === e0 + 1, String(downloads(ENGINE) - e0));
		ok('after idle: its one static import (slim/index.js) fetched once', downloads(SLIM) === s0 + 1, String(downloads(SLIM) - s0));
		await a.page.evaluate(() => window.__flushIdle());
		ok('a second idle does not fetch again (once per page)', await a.page.evaluate(() => EngCalcs.lpnEpanetPrefetch()) === 'loaded' && downloads(ENGINE) === e0 + 1);
		let pf = await pageFetches(a);
		ok('the page itself called fetch exactly twice (engine, slim), both low priority', pf.length === 2 && pf.every((x) => x.priority === 'low'), JSON.stringify(pf));
		// The first Run: load the engine for real and solve with it.
		const solved = await a.page.evaluate(async () => {
			const mod = await EngCalcs.lpnEpanetLoad();
			return !!(mod && (mod.Project || mod.Workspace));
		});
		ok('the first load resolves with the engine', solved);
		await a.settle(500);
		ok('the first Run downloaded no second copy of the engine', downloads(ENGINE) === e0 + 1, String(downloads(ENGINE) - e0));
		ok('and no second copy of slim/index.js', downloads(SLIM) === s0 + 1, String(downloads(SLIM) - s0));
		ok('the Run made no further fetch call of its own', (await pageFetches(a)).length === 2);
		await a.context.close();

		// ---- B. Save-Data ----
		console.log('B. Save-Data on');
		e0 = downloads(ENGINE); s0 = downloads(SLIM);
		const b = await open('idle-b', [IDLE_STUB, SAVE_DATA_STUB]);
		await b.settle(800);
		await b.page.evaluate(() => window.__flushIdle());
		await b.settle(1500);
		ok('Save-Data: nothing fetched after idle', downloads(ENGINE) === e0 && downloads(SLIM) === s0);
		ok('Save-Data: the refusal is named', await b.page.evaluate(() => EngCalcs.lpnEpanetPrefetch()) === 'savedata');
		await b.context.close();

		// ---- C. already loaded ----
		console.log('C. engine already loaded');
		e0 = downloads(ENGINE);
		// Service worker blocked, so Cache Storage cannot answer 'cached' first and mask the loaded guard.
		const c = await open('idle-c', [IDLE_STUB, FETCH_LOG_STUB], { serviceWorkers: 'block' });
		await c.settle(800);
		await c.page.evaluate(() => EngCalcs.lpnEpanetLoad());
		const afterLoad = downloads(ENGINE);
		ok('the load itself fetched the engine', afterLoad >= e0, String(afterLoad - e0));
		await c.page.evaluate(() => window.__flushIdle());
		await c.settle(1500);
		ok('already loaded: idle fetches nothing more', downloads(ENGINE) === afterLoad);
		ok('already loaded: the page made no fetch call for the engine', (await c.page.evaluate(() => window.__fetchLog.filter((x) => /epanet-js\.js|slim\/index\.js/.test(x.url)))).length === 0);
		ok('already loaded: the refusal is named', await c.page.evaluate(() => EngCalcs.lpnEpanetPrefetch()) === 'loaded');
		await c.context.close();

		// ---- E. a Run while the prefetch is in flight takes over ----
		console.log('E. Run while the prefetch is in flight');
		e0 = downloads(ENGINE);
		const e = await Session.open(browser, 'idle-e', { serviceWorkers: 'block' });
		await e.context.addInitScript(IDLE_STUB);
		await e.context.addInitScript(FETCH_LOG_STUB);
		const prio = [];
		let delayed = 0;
		await e.context.route(/\/js\/vendor\/epanet-js\.js/, async (route) => {
			if (delayed++ === 0) { await new Promise((r) => setTimeout(r, 5000)); }	// the prefetch's request, held
			try { await route.continue(); } catch (err) { /* aborted while held: expected */ }
		});
		const cdp = await e.context.newCDPSession(e.page);
		await cdp.send('Network.enable');
		cdp.on('Network.requestWillBeSent', (ev) => { if (/epanet-js\.js/.test(ev.request.url)) { prio.push(ev.request.initialPriority); } });
		await e.goto('Looped-Network.php');
		await e.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await e.settle(800);
		await e.page.evaluate(() => window.__flushIdle());
		await e.settle(500);
		const t0 = Date.now();
		await e.page.evaluate(() => EngCalcs.lpnEpanetLoad());
		const took = Date.now() - t0;
		ok('the Run did not wait behind the held prefetch', took < 3500, took + ' ms');
		await e.page.waitForTimeout(6000);
		ok('exactly one completed engine download', downloads(ENGINE) === e0 + 1, String(downloads(ENGINE) - e0));
		ok('the prefetch was low priority and the Run was not', prio.length >= 2 && /low/i.test(prio[0]) && !/low/i.test(prio[prio.length - 1]), JSON.stringify(prio));
		await e.context.close();

		// ---- D. no requestIdleCallback: a timer, still after load ----
		console.log('D. a browser without requestIdleCallback');
		e0 = downloads(ENGINE);
		const d = await open('idle-d', ['delete window.requestIdleCallback; window.requestIdleCallback = undefined;']);
		await d.settle(1500);
		ok('fallback: not fetched at once', downloads(ENGINE) === e0);
		await d.page.waitForTimeout(6500);
		ok('fallback: fetched after the timeout', downloads(ENGINE) === e0 + 1, String(downloads(ENGINE) - e0));
		await d.context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

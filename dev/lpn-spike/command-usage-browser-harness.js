// COMMAND USAGE, IN A REAL CHROMIUM (Task 815; Tom, 2026-10-17). Run with:
//   node dev/lpn-spike/command-usage-browser-harness.js          (takes the browser lock itself)
//   node dev/lpn-spike/command-usage-browser-harness.js --write  (rewrites lib/lpn-commands.json)
//
// WHAT IS AT RISK, none of it visible from a browser pass:
//   C1  THE COMMAND LIST GOING STALE. spock.php shows commands nobody used, from
//       lib/lpn-commands.json. This harness builds that list from the menus the page really
//       builds (EngCalcs.lpnCommandCatalog) and fails when the file differs: a new menu row is a
//       red line here until --write is run, so a new command can never be missing from the report.
//   C2  AN ID THE ENDPOINT WOULD EAT OR CUT. Every id must survive log-signal-event.php's charset
//       and 80-character cap unchanged, and be unique.
//   C3  ONE BEACON PER COMMAND PER PAGE LOAD, AND THE RIGHT ONE: a menu row (Scenario manager, a
//       row in a fly-out: Fire flow analysis) and a toolbar button each send exactly one
//       `lpn` / `cmd:<id>`; a second click sends none; the body holds page, lang, event, detail
//       and nothing else.
//   C4  CONTENT IS NOT A COMMAND. Choosing a scenario row sends no cmd: signal.
//   C5  NOTHING STORED. Across every cmd: signal no cookie, localStorage, sessionStorage or
//       IndexedDB write happens inside logSignal; and with the endpoint down and no consent
//       nothing is queued in the offline queue.
//   C6  THE EXISTING GATING STILL HOLDS, END TO END against the real endpoint: an ordinary visitor
//       who has not agreed gets one row in the page-load bucket (`visit`); a tester browser
//       (ec_nolog) gets none.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CMDUSAGE_LOCKED';
const NAME = 'command-usage-browser-harness';
const WRITE = process.argv.indexOf('--write') >= 0;
const CATALOG_FILE = path.join(REPO, 'lib', 'lpn-commands.json');
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

function catalogJson(cat) {
	const groups = [];
	cat.forEach((c) => {
		let g = groups.filter((x) => x.id === c.group)[0];
		if (!g) { g = { id: c.group, label: c.groupLabel, commands: [] }; groups.push(g); }
		g.commands.push({ id: c.id, label: c.label, parent: c.parent });
	});
	return JSON.stringify({ groups: groups }, null, 1)
		.replace(/\n\s+("id": "[^\n]*"label": [^\n]*"parent": [^\n]*)\n\s+\}/g, ' $1 }') + '\n';
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	const signalLog = path.join(REPO, 'log', 'engcalcs-signal.log');
	const logSizeBefore = fs.existsSync(signalLog) ? fs.statSync(signalLog).size : -1;
	try {
		// ---- a session whose beacons we catch and answer 204 ----------------------------------
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const beacons = [];
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await page.route(/log-signal-event\.php/, (route) => {
			const p = new URLSearchParams(route.request().postData() || '');
			beacons.push(Object.fromEntries(p.entries()));
			route.fulfill({ status: 204, body: '' });
		});
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_scnbasic', 'off'); });
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.settle(2500);
		const cmds = () => beacons.filter((b) => b.event === 'lpn' && /^cmd:/.test(b.detail || '')).map((b) => b.detail);

		// ---- C1, C2: the command list ------------------------------------------------------------
		console.log('\n---- C1/C2. the command list ----');
		const cat = await page.evaluate(() => EngCalcs.lpnCommandCatalog());
		ok('the page lists its commands (menus, scenario menu, toolbar)', cat.length > 100, 'found ' + cat.length);
		const ids = cat.map((c) => c.id);
		ok('every id is unique', new Set(ids).size === ids.length,
			ids.filter((x, i) => ids.indexOf(x) !== i).join(', '));
		const endpoint = fs.readFileSync(path.join(REPO, 'log-signal-event.php'), 'utf8');
		const keep = new RegExp('[^' + /preg_replace\('#\[\^([^\]]*)\]#'/.exec(endpoint)[1] + ']', 'g');
		const cap = parseInt(/strlen\(\$detail\) > (\d+)/.exec(endpoint)[1], 10);
		ok('every id survives the endpoint charset and the ' + cap + '-character cap as sent',
			ids.every((id) => ('cmd:' + id).replace(keep, '') === 'cmd:' + id && ('cmd:' + id).length <= cap),
			ids.filter((id) => ('cmd:' + id).length > cap || ('cmd:' + id).replace(keep, '') !== 'cmd:' + id).join(', '));
		ok('the five menus, the scenario menu and the toolbar are all present',
			['file', 'edit', 'map', 'project', 'help', 'scenario', 'tb'].every((g) => cat.some((c) => c.group === g)));
		const want = catalogJson(cat);
		if (WRITE) {
			fs.writeFileSync(CATALOG_FILE, want);
			console.log('  wrote ' + path.relative(REPO, CATALOG_FILE) + ' (' + cat.length + ' commands)');
		} else {
			const have = fs.existsSync(CATALOG_FILE) ? fs.readFileSync(CATALOG_FILE, 'utf8') : '';
			ok('lib/lpn-commands.json matches the menus the page builds (run with --write if a command was added or renamed)',
				have === want);
		}

		// ---- C3: a menu row, a fly-out row, a toolbar button -------------------------------------
		console.log('\n---- C3. one beacon per command ----');
		const before = beacons.length;
		await a.openMenu('project');
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_scenario_menu'));
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		await a._clickRow('#lpn_menu_list2', await a.lang('lpn_sm_menu'));
		await a.settle(900);
		ok('Water > Scenarios > Scenario manager sends exactly one cmd beacon', cmds().length === 1 && cmds()[0] === 'cmd:project/scenario_menu/sm_menu', JSON.stringify(cmds()));
		const sent = beacons[beacons.length - 1];
		const wholeBody = beacons.slice(before);
		ok('...and its body is page, lang, event and detail, nothing else',
			wholeBody.every((b) => Object.keys(b).sort().join(',') === 'detail,event,lang,page'), JSON.stringify(sent));
		ok('...with the page name', sent && sent.page === 'Looped-Network');

		await a.openMenu('project');
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_scenario_menu'));
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		await a._clickRow('#lpn_menu_list2', await a.lang('lpn_sm_menu'));
		await a.settle(600);
		ok('choosing it again in the same page load sends nothing more', cmds().length === 1, JSON.stringify(cmds()));

		await a.openMenu('project');
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_analyze_menu'));
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		await a._clickRow('#lpn_menu_list2', await a.lang('lpn_ff_menu'));
		await a.settle(900);
		ok('Water > Analyze > Fire flow analysis sends exactly its own cmd beacon',
			cmds().length === 2 && cmds()[1] === 'cmd:project/analyze_menu/ff_menu', JSON.stringify(cmds()));

		await page.click('#lpn_toolbar button[data-tool="add-junction"]');
		await a.settle(300);
		ok('the Junction toolbar button sends exactly one cmd:tb/add-junction',
			cmds().length === 3 && cmds()[2] === 'cmd:tb/add-junction', JSON.stringify(cmds()));
		await page.click('#lpn_toolbar button[data-tool="add-junction"]');
		await page.click('#lpn_toolbar button[data-tool="add-junction"]');
		await a.settle(300);
		ok('pressing it again sends nothing more', cmds().length === 3, JSON.stringify(cmds()));

		// ---- C4: content is not a command ----------------------------------------------------------
		console.log('\n---- C4. content is not a command ----');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const scnRow = await page.evaluate(() => {
			const rows = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'));
			const r = rows[rows.length - 1];
			return r ? r.textContent.replace(/^[\s✓]+/, '').trim() : '';
		});
		await a._clickRow('#lpn_menu_list', scnRow).catch(async () => {
			await page.evaluate(() => { const rows = document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'); rows[rows.length - 1].click(); });
		});
		await a.settle(500);
		ok('choosing a scenario by name sends no cmd beacon', cmds().length === 3, JSON.stringify(cmds()) + ' row=' + scnRow);

		// ---- C5: nothing stored ---------------------------------------------------------------------
		console.log('\n---- C5. nothing stored ----');
		// Fresh page load so the in-memory dedupe is empty and the trap sees real sends.
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		await page.evaluate(() => {
			window.__w = []; window.__n = 0; window.__in = 0;
			const sp = Storage.prototype.setItem;
			Storage.prototype.setItem = function (k) { if (window.__in) { window.__w.push('storage:' + k); } return sp.apply(this, arguments); };
			const desc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
			Object.defineProperty(document, 'cookie', { configurable: true, get() { return desc.get.call(document); },
				set(v) { if (window.__in) { window.__w.push('cookie:' + String(v).split('=')[0]); } desc.set.call(document, v); } });
			const io = indexedDB.open;
			indexedDB.open = function () { if (window.__in) { window.__w.push('indexedDB.open'); } return io.apply(this, arguments); };
			const ls = EngCalcs.logSignal;
			EngCalcs.logSignal = function (ev, d) {
				const mine = ev === 'lpn' && /^cmd:/.test(d);
				if (mine) { window.__n++; window.__in++; }
				try { return ls.apply(this, arguments); } finally { if (mine) { window.__in--; } }
			};
		});
		for (const tool of ['select', 'add-pipe', 'add-tank', 'vertices']) {
			await page.click('#lpn_toolbar button[data-tool="' + tool + '"]').catch(() => {});
		}
		await a.openMenu('map');
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_tool_zoom_extent'));
		await a.settle(500);
		const trapped = await page.evaluate(() => ({ writes: window.__w, n: window.__n }));
		ok('the trap saw cmd: signals go through', trapped.n >= 3, 'n=' + trapped.n);
		ok('no cookie, localStorage or IndexedDB write happens inside any cmd: signal', trapped.writes.length === 0, JSON.stringify(trapped.writes));

		// The offline queue: endpoint down, visitor has not agreed, so nothing may be queued.
		const b = await Session.open(browser, 'B', { serviceWorkers: 'block' });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.page.route(/log-signal-event\.php/, (route) => route.abort());
		await b.goto('Looped-Network.php?ec_nolog=1');
		await b.settle(2000);
		await b.page.click('#lpn_toolbar button[data-tool="add-junction"]');
		await b.settle(800);
		const queued = await b.page.evaluate(async () => {
			const consented = typeof EngCalcs.analyticsConsented === 'function' ? EngCalcs.analyticsConsented() : null;
			const dbs = (indexedDB.databases ? await indexedDB.databases() : []).map((d) => d.name);
			if (dbs.indexOf(EngCalcs._QUEUE_DB) < 0) { return { consented, dbs, n: 0 }; }
			const db = await EngCalcs._openQueueDB();
			const n = await new Promise((res) => { const r = db.transaction(EngCalcs._QUEUE_STORE).objectStore(EngCalcs._QUEUE_STORE).count(); r.onsuccess = () => res(r.result); });
			return { consented, dbs, n };
		});
		ok('with the endpoint down and no consent, a failed cmd: beacon is not queued on the device',
			queued.consented === false && queued.n === 0, JSON.stringify(queued));
		await b.context.close();

		// ---- C6: the real endpoint, both buckets of gating -----------------------------------------
		console.log('\n---- C6. the real endpoint ----');
		const readNew = () => {
			if (!fs.existsSync(signalLog)) { return []; }
			const start = logSizeBefore > 0 ? logSizeBefore : 0;
			return fs.readFileSync(signalLog, 'utf8').slice(start).split('\n').filter((l) => /\tlpn\tcmd:/.test(l));
		};
		const c = await Session.open(browser, 'C', { serviceWorkers: 'block' });
		await c.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await c.goto('Looped-Network.php?ec_nolog=1');   // a tester browser: this is the gating that says no
		await c.settle(2000);
		await c.page.click('#lpn_toolbar button[data-tool="add-pump"]');
		await c.settle(1200);
		ok('a tester browser (ec_nolog) leaves no cmd: row in the log', readNew().length === 0, readNew().join(' | '));
		await c.context.close();

		const d = await Session.open(browser, 'D', { serviceWorkers: 'block' });
		await d.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await d.page.goto(env.pageUrl('Looped-Network.php'), { waitUntil: 'load' });   // an ordinary visitor
		await d.settle(2500);
		await d.page.click('#lpn_toolbar button[data-tool="add-pump"]');
		await d.settle(1500);
		const rows = readNew();
		ok('an ordinary visitor who has not agreed leaves exactly one cmd: row', rows.length === 1, rows.join(' | '));
		const f = (rows[0] || '').split('\t');
		ok('...that row names the command, nothing else, and is in the page-load bucket (visit)',
			f[5] === 'cmd:tb/add-pump' && f[f.length - 1] === 'visit', JSON.stringify(f));
		await d.context.close();
		await a.context.close();
	} catch (e) {
		failures++;
		console.log('  FAIL harness error: ' + (e && e.stack || e));
	} finally {
		// Whatever the real endpoint wrote during C6 is the harness's, not the log's.
		try {
			if (logSizeBefore >= 0 && fs.existsSync(signalLog)) { fs.truncateSync(signalLog, logSizeBefore); }
			else if (logSizeBefore < 0 && fs.existsSync(signalLog)) { fs.unlinkSync(signalLog); }
		} catch (e2) { /* the log is gitignored runtime state */ }
		await browser.close();
		env.stopServer();
	}
	ok('no uncaught page error', errors.length === 0, errors.join(' | '));
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main();

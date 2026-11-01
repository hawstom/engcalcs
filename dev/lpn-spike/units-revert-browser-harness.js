// A PROJECT'S UNITS CHANGE ONLY WHEN ITS USER CHANGES THEM -- R-415, IN A REAL CHROME.
//
//   node dev/lpn-spike/units-revert-browser-harness.js
//
// Tom, 2026-10-16: "somehow my units got set back to US." His Fotobi had been converted to SI with
// File, Convert as, and its numbers are metric, but the file he saved declares ft, in, ft H2O, psi
// and gpm, so a 2.5 m tank ran as a 2.5 ft one (fotobi-declared-units-harness.js). Every save writes
// the units the strip shows, so any path that moves the strip while a project is still open, and
// then saves that project, stamps the wrong units on its numbers. Two such paths, one section each:
//
//   1. File, Import, EPANET file. The strip moved to the .inp's units BEFORE importProject() saved
//      the project being left, so importing a GPM file beside metric Fotobi saved Fotobi in feet.
//   2. New project (the tab strip's +), Create, while a placement wizard is open. newProject() refused and left the
//      open project open, and createProjectFrom() went on to install the box's units on it.
//
// fixtures/fotobi-us-2026-10-15.epp is his US original, unchanged; the harness converts it the way he
// did.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself by re-executing
// under flock, as convert-as-browser-harness.js does; an outer flock on the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const NAME = 'units-revert-browser-harness';
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_UNITS_REVERT_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a units failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

const FOTOBI = path.join(__dirname, 'fixtures', 'fotobi-us-2026-10-15.epp');
const NET1 = path.join(REPO, 'dev', 'water-network-examples', 'Net1.inp');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error(NAME + ': playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		// An English page in a US region, as Tom has it: the first-visit preset is US.
		let a = await Session.open(browser, 'A', { extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
		let page = a.page;
		await a.context.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) =>
			r.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		const stored = () => page.evaluate(() => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return (ix.projects || []).map((p) => {
				const d = JSON.parse(localStorage.getItem('lpn_project_' + p.id) || 'null');
				return { id: p.id, name: p.name, open: p.id === ix.openId, units: d && d.units, method: d && d.settings && d.settings.method,
					tank: d && (d.nodes.find((n) => n.id === 'T-NW') || {}).maxLevel };
			});
		});
		const byName = async (n) => (await stored()).find((p) => p.name === n);
		const strip = () => page.evaluate(() => {
			const o = {}; document.querySelectorAll('#lpn_units_strip select').forEach((s) => { o[s.name] = s.value; }); return o;
		});
		const brief = (u) => u ? [u.lpn_u_length, u.lpn_u_diameter, u.lpn_u_elevhead, u.lpn_u_flow].join(' / ') : String(u);
		async function dialogs(prefer) {
			for (let k = 0; k < 4 && (await a.dialog()); k++) {
				const d = await a.dialog();
				const want = (prefer || []).concat(['Continue', 'Open read-only', 'OK']).find((b) => d.buttons.indexOf(b) >= 0) || d.buttons[0];
				await a.dialogClick(want).catch(() => {});
				await a.settle(800);
			}
		}
		async function switchTab(name) {
			for (const t of await page.$$('#lpn_tabs .lpn-tab')) {
				const n = await t.$('.lpn-tab-name');
				if (n && ((await n.textContent()) || '').replace(/^\*/, '').trim() === name) { await n.click(); await a.settle(1200); return true; }
			}
			return false;
		}
		const S = (k) => a.lang(k);

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();

		console.log('\n--- 1. File, Import, EPANET file beside a metric project ---');
		await a.writeFile('Fotobi_US_WGS84.epp', fs.readFileSync(FOTOBI, 'utf8'));
		await a.queuePick('Fotobi_US_WGS84.epp');
		await a.menuClick(await S('lpn_file_open'));
		await a.settle(1500); await dialogs();
		await a.menuClick(await S('lpn_file_convert_as'));
		await page.waitForSelector('#lpn_convas_panel', { state: 'visible' });
		await page.click('#lpn_convas_si');
		await page.click('#lpn_convas_ok');
		await a.settle(2000); await dialogs();
		const COPY = (await S('lpn_copy_of')).replace('{name}', 'Fotobi_US_WGS84');
		const conv = await byName(COPY);
		ok('Convert as SI gives a metric copy: m, mm, m H2O, L/s', !!conv && conv.open && brief(conv.units) === 'm / mm / mh2o / lps', conv && brief(conv.units));
		const tank = conv && conv.tank;
		await page.setInputFiles('#lpn_inp_file', NET1);
		await a.settle(2500); await dialogs();
		const net1 = await byName('Net1');
		ok('Net1.inp lands in its own tab, in its own units (ft, in, ft H2O, gpm)', !!net1 && net1.open && brief(net1.units) === 'ft / in / fth2o / gpm', net1 && brief(net1.units));
		const after = await byName(COPY);
		ok('THE METRIC PROJECT LEFT BEHIND STILL DECLARES m, mm, m H2O, L/s', !!after && brief(after.units) === 'm / mm / mh2o / lps', after && brief(after.units));
		ok('...with its numbers untouched (T-NW maximum ' + tank + ')', !!after && after.tank === tank, after && after.tank);
		await switchTab(COPY); await dialogs();
		const s1 = await strip();
		ok('back on its tab, the units strip shows metres and millimetres', brief(s1) === 'm / mm / mh2o / lps', brief(s1));

		console.log('\n--- 2. New project, Create, while the world map is being placed ---');
		// A fresh profile, so the examples wall is the front door again.
		await a.close();
		a = await Session.open(browser, 'B', { extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
		page = a.page;
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await S('lpn_ex_net1_si_title'));
		const base = (await stored()).find((p) => p.open);
		ok('a metric grid project is open', !!base && base.units.lpn_u_length === 'm', base && brief(base.units));
		const rowClick = (re) => page.evaluate((r) => {
			const bs = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row'));
			const m = bs.filter((b) => new RegExp(r, 'i').test(b.textContent || ''));
			if (!m.length) { return false; }
			m[m.length - 1].click(); return true;
		}, re);
		await page.click('#lpn_menu_map'); await a.settle(300);
		await rowClick('World map'); await a.settle(300);
		await rowClick('^Attach'); await a.settle(1500);
		const barUp = await page.$eval('#lpn_mapgeo_bar', (e) => e.style.display !== 'none').catch(() => false);
		ok('Map, World map, Attach opens the placement bar', barUp);
		const tabsBefore = (await a.tabs()).length;
		// The menu bar is closed while the bar is up; the tab strip's + is the door that stays open.
		await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('#lpn_tabs button.lpn-tab-btn')).find((x) => x.textContent === '+');
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		});
		await page.waitForSelector('#lpn_new_panel', { state: 'visible' });
		await page.click('#lpn_new_us');
		await page.click('#lpn_new_create');
		await a.settle(800);
		ok('the new project is refused: no tab is added', (await a.tabs()).length === tabsBefore, (await a.tabs()).length + ' tabs');
		const still = (await stored()).find((p) => p.id === base.id);
		ok('THE OPEN PROJECT STILL DECLARES ITS OWN UNITS, not the box\'s US ones', !!still && brief(still.units) === brief(base.units), still && brief(still.units));
		ok('...and its own friction method', !!still && still.method === base.method, still && still.method);
		const s2 = await strip();
		ok('...and the units strip still shows them', brief(s2) === brief(base.units), brief(s2));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });

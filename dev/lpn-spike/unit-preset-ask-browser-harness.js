// SETTINGS > UNITS, SI AND US ASK BEFORE THEY CHANGE WHAT YOUR NUMBERS MEAN -- IN A REAL CHROME.
//
//   node dev/lpn-spike/unit-preset-ask-browser-harness.js
//
// Tom, 2026-10-16: "Settings > Units, SI and US buttons reinterpret every unit in one click without
// asking: Fix it." One unit select asks first (onUnitChange: Non-destructive, Destructive, Cancel);
// the two buttons went through the suite's EngCalcs.setUnits(), which fires no change event, so
// they reinterpreted every number in the project silently. They now ask the same question, once
// for the whole click, and an empty project still changes with no question, as a select does.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const NAME = 'unit-preset-ask-browser-harness';
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_UNIT_PRESET_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of this harness; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

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
		const a = await Session.open(browser, 'A', { extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
		const page = a.page;
		const open = () => page.evaluate(() => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const d = JSON.parse(localStorage.getItem('lpn_project_' + ix.openId) || 'null');
			const pipe = d.links.find((l) => l.type === 'pipe' && typeof l._diameter === 'number');
			return { units: d.units, pipe: pipe && { id: pipe.id, d: pipe._diameter } };
		});
		const strip = () => page.evaluate(() => {
			const o = {}; document.querySelectorAll('#lpn_units_strip select').forEach((s) => { o[s.name] = s.value; }); return o;
		});
		const brief = (u) => [u.lpn_u_length, u.lpn_u_diameter, u.lpn_u_elevhead, u.lpn_u_flow].join(' / ');
		// A pointer press (detail 1), dispatched in the page: the button sits in the Settings box.
		const preset = (which) => page.evaluate((id) => {
			document.getElementById(id).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		}, which === 'si' ? 'set_units_si' : 'set_units_us');
		const press = (label) => page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return !!b;
		}, label);
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const L = {};
		for (const k of ['lpn_units_warn_title', 'lpn_units_nondestructive', 'lpn_units_destructive', 'lpn_cancel', 'lpn_ex_valves_title']) { L[k] = await a.lang(k); }
		await a.openExampleCard(L.lpn_ex_valves_title);
		await a.settle(600);
		const p0 = await open();
		ok('a US project with numbers in it is open', brief(p0.units) === 'ft / in / fth2o / gpm' && !!p0.pipe, brief(p0.units));

		console.log('\n--- SI, then Cancel ---');
		await preset('si'); await a.settle(400);
		const d1 = await a.dialog();
		ok('SI asks the question a unit select asks', !!d1 && d1.text.indexOf(L.lpn_units_warn_title) >= 0, d1 && d1.text.slice(0, 80));
		ok('...with the same three answers', !!d1 && [L.lpn_units_nondestructive, L.lpn_units_destructive, L.lpn_cancel].every((x) => d1.buttons.indexOf(x) >= 0), d1 && JSON.stringify(d1.buttons));
		const leads = await page.evaluate(() => document.querySelectorAll('#lpn_dialog_body .lpn-unit-fields').length);
		ok('...naming each unit the click changes that decides a number (one list per unit)', leads >= 4, leads + ' lists');
		ok('nothing has moved while it asks', brief(await strip()) === brief(p0.units));
		await press(L.lpn_cancel); await a.settle(400);
		const p1 = await open();
		ok('Cancel leaves the strip, the stored units and the numbers as they were',
			brief(await strip()) === brief(p0.units) && brief(p1.units) === brief(p0.units) && p1.pipe.d === p0.pipe.d, brief(p1.units) + ', ' + p1.pipe.d);

		console.log('\n--- SI, Non-destructive ---');
		await preset('si'); await a.settle(400);
		await press(L.lpn_units_nondestructive); await a.settle(600);
		const p2 = await open();
		ok('every unit is SI, on the strip and in the project', brief(p2.units) === 'm / mm / mh2o / lps' && brief(await strip()) === brief(p2.units), brief(p2.units));
		ok('...and the typed numbers are untouched (' + p0.pipe.d + ' now means mm)', p2.pipe.d === p0.pipe.d, p2.pipe.d);

		console.log('\n--- US, Destructive ---');
		await preset('us'); await a.settle(400);
		ok('US asks too', !!(await a.dialog()));
		await press(L.lpn_units_destructive); await a.settle(600);
		const p3 = await open();
		ok('every unit is US again', brief(p3.units) === 'ft / in / fth2o / gpm', brief(p3.units));
		ok('...and the numbers were rewritten (' + p0.pipe.d + ' mm is ' + (p0.pipe.d / 25.4).toFixed(4) + ' in)', Math.abs(p3.pipe.d - p0.pipe.d / 25.4) < 1e-9, p3.pipe.d);
		await page.keyboard.press('Escape');
		await page.mouse.click(5, 300).catch(() => {});
		await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })));
		await a.settle(600);
		const p4 = await open();
		ok('one Undo takes the whole click back, units and numbers', brief(p4.units) === 'm / mm / mh2o / lps' && p4.pipe.d === p0.pipe.d, brief(p4.units) + ', ' + p4.pipe.d);

		console.log('\n--- an empty project changes with no question ---');
		await a.newProject('us');
		await preset('si'); await a.settle(500);
		ok('no question', !(await a.dialog()));
		ok('the strip is SI', brief(await strip()) === 'm / mm / mh2o / lps', brief(await strip()));
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

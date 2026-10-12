// A TANK'S TWO ELEVATIONS ON A REAL, NON-ENGLISH PAGE (Tom, 2026-10-11). Run with:
//   node dev/lpn-spike/tank-ground-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// ?lang=es, Net1: the Tanks table carries Base elevation right after Elevation and a Pressure
// column, and the tank's Properties box shows both elevations and a pressure. The new strings are
// not translated yet, they arrive as the English fallback -- never as "undefined" or blank.
// Typing a ground 20 m (65.6 ft) below the base in the Properties box moves the pressure and leaves
// the head where it was. The arithmetic itself is held by tank-ground-harness.js.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TANKGROUND_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('tank-ground-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('tank-ground-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('tank-ground-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('tank-ground-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'tankground', { viewport: { width: 1500, height: 950 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?lang=es');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		const esBase = await a.lang('lpn_field_tank_base_elev'), esElev = await a.lang('lpn_field_elev'), esPressure = await a.lang('lpn_result_pressure');
		ok('the page really is Spanish (Elevation is not the English word)', esElev && esElev !== 'Elevation', esElev);

		// ---- the Properties box ------------------------------------------------------------------
		console.log('1. THE PROPERTIES BOX');
		const at = await page.evaluate(() => {
			const g = Array.from(document.querySelectorAll('#lpn_canvas [data-node="2"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!g) { return null; }
			const r = g.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		ok('tank 2 is on the map', !!at);
		if (at) {
			await page.mouse.click(at.x, at.y);
			await a.settle(900);
		}
		const fields = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => {
			const i = l.querySelector('input');
			return { text: l.textContent.replace(/­/g, '').trim(), value: i ? i.value : null, ph: i ? i.placeholder : null };
		}));
		let f = await fields();
		const fBase = f.find((x) => x.text.indexOf(esBase) === 0),
			fElev = f.find((x) => x.text.indexOf(esElev) === 0);
		ok('Properties lists ' + esElev + ' and ' + esBase, !!fBase && !!fElev, f.map((x) => x.text).join(' | '));
		ok('both read 850 for an imported tank', fBase && fElev && fBase.value === '850' && fElev.value === '850',
			JSON.stringify({ fBase, fElev }));
		const pBefore = f.find((x) => x.text.indexOf(esPressure) === 0);
		ok('Properties lists a pressure for the tank', !!pBefore, f.map((x) => x.text).join(' | '));
		
		// Type the ground 20 m below the base, the way a reader does.
		const newGround = (850 - 20 / 0.3048).toFixed(2);
		await page.evaluate(([label, v]) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((x) => x.textContent.replace(/­/g, '').trim().indexOf(label) === 0 &&
					x.textContent.indexOf('Base') < 0)[0];
			const i = l.querySelector('input');
			i.focus(); i.value = v;
			i.dispatchEvent(new Event('input', { bubbles: true }));
			i.dispatchEvent(new Event('change', { bubbles: true }));
			i.blur();
		}, [esElev, newGround]);
		await a.settle(900);
		f = await fields();
		const fBase2 = f.find((x) => x.text.indexOf(esBase) === 0),
			fElev2 = f.find((x) => x.text.indexOf(esElev) === 0);
		ok('the ground took the new number and the base stayed at 850',
			fElev2 && fBase2 && near(parseFloat(fElev2.value), +newGround, 1e-6) && fBase2.value === '850',
			JSON.stringify({ fElev2, fBase2 }));
		const pAfter = f.find((x) => x.text.indexOf(esPressure) === 0);
		// A read-only row is text, not an input: its number is the last one on the line.
		const lastNum = (x) => { const m = x && /(-?[\d.]+)\s*$/.exec(x.text); return m ? parseFloat(m[1]) : NaN; };
		const pv0 = lastNum(pBefore), pv1 = lastNum(pAfter);
		// 20 m of water is 28.4 psi.
		ok('the tank pressure rose by 20 m of water, about 28.4 psi (' + pv0 + ' -> ' + pv1 + ')',
			near(pv1 - pv0, 20 * 1.4219702, 0.05));
		// ---- the Tanks table ---------------------------------------------------------------------
		console.log('\n2. THE TANKS TABLE');
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await page.click('#lpn_pane_tab_tanks');
		await a.settle(800);
		const heads = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_tanks table th'))
			.map((h) => h.textContent.replace(/­/g, '').trim()));
		const iElev = heads.findIndex((h) => h.indexOf(esElev) === 0);
		ok(esBase + ' (Base elevation) is the column right after ' + esElev,
			iElev >= 0 && heads[iElev + 1].indexOf(esBase) === 0, heads.join(' | '));
		ok('a Pressure column (' + esPressure + ') is in the tanks table', heads.some((h) => h.indexOf(esPressure) === 0));
		ok('no heading reads "undefined" or is blank', heads.every((h) => h && h.indexOf('undefined') < 0));

	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall tank ground browser checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

// THE CORNER BASEMAP BUTTON IN A SCENARIO, in a real Chromium.
//
//   node dev/lpn-spike/scenario-basemap-browser-harness.js
//
// Tom, 2026-10-17, on Fotobi in a scenario: from Satellite he pressed through to topo and street
// map, and the button that should bring Satellite back did nothing. Base said Satellite, so the
// seam saw no change on the project and dropped the press; the scenario kept its street map.
//
// What it holds: a lat/lon project whose Base says Satellite, opened in a child scenario, cycles
// satellite, topo, street, satellite on three presses; Base still says Satellite; Ctrl+Z after the
// third press puts the street map back.
//
// No network: tiles are answered locally by a route.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCENARIO_BASEMAP_LOCKED';
const NAME = 'scenario-basemap-browser-harness';

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

let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// A small lat/lon network at Fotobi, Ghana, Base on Satellite, opened in a child scenario.
function fotobi() {
	const at = [['R1', 'reservoir', -0.3060, 6.1040], ['J1', 'junction', -0.3040, 6.1030], ['J2', 'junction', -0.3010, 6.1032]];
	const nodes = at.map(([id, type, x, y]) => type === 'reservoir' ? { id, type, x, y, head: 120 } : { id, type, x, y, elev: 80, _demand: 1 });
	const pipe = (id, from, to) => ({ id, type: 'pipe', from, to, verts: [], _diameter: 150, _roughness: 120, _length: 300,
		lenAuto: false, _status: 'open', _k: 0 });
	return {
		format: 'hawsedc-lpn', v: 11,
		project: { name: 'Fotobi', activeScenario: 's2', coords: 'geo', basemap: 'satellite' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }, { id: 's2', name: 'Fire flow', parent: 'base', overrides: {} }],
		nodes,
		links: [pipe('P1', 'R1', 'J1'), pipe('P2', 'J1', 'J2')],
		units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
			lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr' }
	};
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		await a.writeFile('Fotobi.lwn', JSON.stringify(fotobi()));
		await a.queuePick('Fotobi.lwn');
		await a.menuClick(await a.lang('lpn_file_open'));
		await a.settle(300);
		await a.answerTrainingPanel();
		await a.settle(2000);

		// Which style the tiles on screen are, and what Base says in storage.
		const showing = () => page.evaluate(() => {
			const img = document.querySelector('.lpn-basemap image'), h = img ? img.getAttribute('href') : '';
			return /mapbox\.satellite/.test(h) ? 'satellite' : /outdoors-v12/.test(h) ? 'outdoors' : /openstreetmap/.test(h) ? 'osm' : 'none';
		});
		const stored = () => page.evaluate(() => {
			const p = JSON.parse(localStorage.getItem('lpn_project_' + JSON.parse(localStorage.getItem('lpn_index')).openId));
			return { active: p.project.activeScenario, base: p.project.basemap };
		});
		const press = async () => { await page.click('#lpn_basemap_teaser'); await a.settle(1200); };

		const s0 = await stored();
		ok('Fotobi is open in the child scenario', s0.active === 's2', s0.active);
		ok('it opens on satellite', await showing() === 'satellite', await showing());
		await press();
		ok('one press: topo', await showing() === 'outdoors', await showing());
		await press();
		ok('two presses: street map', await showing() === 'osm', await showing());
		await press();
		ok('three presses: satellite again, though Base already says satellite', await showing() === 'satellite', await showing());
		ok('Base still says satellite', (await stored()).base === 'satellite', (await stored()).base);
		await page.keyboard.press('Control+z');
		await a.settle(1200);
		ok('Ctrl+Z after the third press puts the street map back', await showing() === 'osm', await showing());
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

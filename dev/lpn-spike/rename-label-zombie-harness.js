// A RENAMED ELEMENT'S MAP LABEL STAYS ALIVE -- ROADMAP Task 775, in a real Chrome.
//
//   node dev/lpn-spike/rename-label-zombie-harness.js
//
// Tom, 2026-10-07, on the Fotobi, Ghana model he built on production (9c71d54f): *"Labels edited
// in Properties repeatedly went zombie in that session. In fact, it's still manifesting."* His
// word for a zombie (2026-09-01): a label that is drawn but cannot be dragged or used.
//
// **THE CAUSE, MEASURED ON master AND ON 9c71d54f BEFORE THE FIX.** A rename (Properties' ID box,
// or the Tables pane's ID cell) rekeys `nodeEls`/`linkEls` and rewrote `data-node` on the disc
// and the grab band, and `data-link` on the bend handles, and nothing else. The label text and
// its grab path kept `data-nodelbl`/`data-linklbl` naming the OLD id, so the label still showed
// the new name and still followed its element, while every pointer path read the dead id:
// pressing on it threw `Cannot read properties of null (reading 'lx')` in nodeLabelPos() and the
// label stayed where it was; clicking it selected nothing. A renamed pipe was worse: its line, its
// grab band and its pump or valve symbol kept the old `data-link`, so the pipe itself stopped
// answering a click. The label stays that way until the project is reopened, so every rename made
// while building a model leaves one.
//
// What it holds, on a lat/lon project at Fotobi opened from a file:
//   1. A junction renamed in Properties: its label carries the new id, a drag moves it, a click on
//      it selects the junction under its new name, and no page error.
//   2. A pipe renamed in Properties: the same for its label, and a click on the pipe itself opens
//      Properties under its new name. No element on the map names the old id.
//   3. A junction renamed in the Tables pane's ID cell (the other door into the same rename).
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock, as convert-as-fotobi-harness.js does.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'rename-label-zombie-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RENAME_ZOMBIE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
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

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// A small lat/lon network at Fotobi, Ghana: a reservoir and six junctions on a loop with a tail.
function fotobi() {
	const at = [
		['R1', 'reservoir', -0.3060, 6.1040], ['J1', 'junction', -0.3040, 6.1030], ['J2', 'junction', -0.3010, 6.1032],
		['J3', 'junction', -0.3008, 6.1005], ['J4', 'junction', -0.3038, 6.1002], ['J5', 'junction', -0.2985, 6.0990],
		['J6', 'junction', -0.2970, 6.1015]
	];
	const nodes = at.map(([id, type, x, y]) => type === 'reservoir'
		? { id, type, x, y, head: 120 }
		: { id, type, x, y, elev: 80, _demand: 1 });
	const pipe = (id, from, to) => ({ id, type: 'pipe', from, to, verts: [], _diameter: 150, _roughness: 120, _length: 300,
		lenAuto: false, _status: 'open', _k: 0 });
	return {
		format: 'hawsedc-lpn', v: 11,
		project: { name: 'Fotobi', activeScenario: 'base', coords: 'geo', basemap: 'osm' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes,
		links: [pipe('P1', 'R1', 'J1'), pipe('P2', 'J1', 'J2'), pipe('P3', 'J2', 'J3'), pipe('P4', 'J3', 'J4'),
			pipe('P5', 'J4', 'J1'), pipe('P6', 'J3', 'J5'), pipe('P7', 'J2', 'J6')],
		units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
			lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr' }
	};
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error(NAME + ': playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) =>
			route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		const S = (k) => a.lang(k);
		const center = (sel) => page.evaluate((s) => {
			const e = document.querySelector(s);
			if (!e) { return null; }
			const r = e.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, sel);
		// Every element on the map that still answers to an id: what a pointer press would read.
		const naming = (attr, id) => page.$$eval('#lpn_canvas [' + attr + '="' + id + '"]',
			(es) => es.map((e) => e.tagName.toLowerCase() + '.' + (e.getAttribute('class') || '').split(' ')[0]));
		const popupId = () => page.evaluate(() => {
			const p = document.getElementById('lpn_popup'), i = document.querySelector('#lpn_popup_title input');
			return p && p.style.display !== 'none' && i ? i.value : null;
		});
		const closePopup = async () => {
			await page.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b) { b.click(); } });
			await a.settle(300);
		};
		async function renameInProperties(newId) {
			await page.evaluate(() => { const i = document.querySelector('#lpn_popup_title input'); i.focus(); i.select(); });
			await page.keyboard.type(newId);
			await page.keyboard.press('Enter');
			await a.settle(1500);
		}
		// A label's life signs: it moves under a drag, and a click on it opens its element. The label
		// is found by what it SAYS (its first line is the element's name), not by its dataset, so a
		// label whose dataset went stale is still found and its drag and click are still tried.
		async function labelAlive(attr, id, what) {
			await closePopup();
			const tag = await page.evaluate(([at, nm]) => {
				const t = Array.from(document.querySelectorAll('#lpn_canvas text.lpn-lbl[' + at + ']:not([data-repeat])')).find((e) => {
					const first = e.querySelector('tspan') ? e.querySelector('tspan').textContent : e.textContent;
					return first.trim() === nm;
				});
				if (!t) { return null; }
				t.setAttribute('data-harness-probe', '1');
				return t.getAttribute(at);
			}, [attr, id]);
			const sel = '#lpn_canvas text[data-harness-probe="1"]';
			ok(what + ': its label, which reads ' + id + ', answers to ' + id, tag === id, 'it answers to ' + tag);
			const p0 = await center(sel);
			if (!p0) { return; }
			const errs = a.errors.length;
			await page.mouse.move(p0.x, p0.y);
			await page.mouse.down();
			await page.mouse.move(p0.x + 30, p0.y + 25, { steps: 6 });
			await page.mouse.up();
			await a.settle(500);
			const p1 = await center(sel);
			ok(what + ': a drag moves its label', p1 && Math.hypot(p1.x - p0.x, p1.y - p0.y) > 15,
				JSON.stringify(p0) + ' -> ' + JSON.stringify(p1));
			ok(what + ': the drag raises no page error', a.errors.length === errs, a.errors.slice(errs, errs + 1).join(' | ').split('\n')[0]);
			const errs2 = a.errors.length;
			await page.mouse.click(p1.x, p1.y);
			await a.settle(700);
			ok(what + ': a click on its label opens Properties for it', await popupId() === id,
				String(await popupId()) + (a.errors.length > errs2 ? '; ' + a.errors[errs2].split('\n')[0] : ''));
			await page.evaluate(() => { const t = document.querySelector('[data-harness-probe]'); if (t) { t.removeAttribute('data-harness-probe'); } });
			await closePopup();
		}

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		await a.writeFile('Fotobi.lwn', JSON.stringify(fotobi(), null, '\t'));
		await a.queuePick('Fotobi.lwn');
		await a.menuClick(await S('lpn_file_open'));
		await a.settle(300);
		await a.answerTrainingPanel();
		await a.settle(2000);
		ok('Fotobi is open with its labels drawn', !!(await center('#lpn_canvas text[data-nodelbl="J1"]')));

		console.log('\n--- 1. a junction renamed in Properties ---');
		{
			const at = await center('#lpn_canvas .lpn-node-hit[data-node="J1"]');
			await page.mouse.click(at.x, at.y);
			await a.settle(600);
			ok('Properties is open for J1', await popupId() === 'J1', String(await popupId()));
			await renameInProperties('J1A');
			ok('Properties now names J1A', await popupId() === 'J1A', String(await popupId()));
			const stale = (await naming('data-node', 'J1')).concat(await naming('data-nodelbl', 'J1'));
			ok('nothing on the map still answers to J1', stale.length === 0, stale.join(', '));
			await labelAlive('data-nodelbl', 'J1A', 'J1A');
		}

		console.log('\n--- 2. a pipe renamed in Properties ---');
		{
			const at = await center('#lpn_canvas .lpn-link-hit[data-link="P2"]');
			await page.mouse.click(at.x, at.y);
			await a.settle(600);
			ok('Properties is open for P2', await popupId() === 'P2', String(await popupId()));
			await renameInProperties('P2A');
			const stale = (await naming('data-link', 'P2')).concat(await naming('data-linklbl', 'P2'));
			ok('nothing on the map still answers to P2', stale.length === 0, stale.join(', '));
			await closePopup();
			const at2 = await center('#lpn_canvas .lpn-link-hit[data-link="P2A"]');
			ok('the pipe\'s grab band carries the new id', !!at2);
			if (at2) {
				await page.mouse.click(at2.x, at2.y);
				await a.settle(600);
				ok('a click on the pipe opens Properties for P2A', await popupId() === 'P2A', String(await popupId()));
			}
			await labelAlive('data-linklbl', 'P2A', 'P2A');
		}

		console.log('\n--- 3. a junction renamed in the Tables pane ---');
		{
			await page.evaluate(() => document.getElementById('lpn_pane_btn').click());
			await a.settle(800);
			await page.evaluate(() => { const t = document.getElementById('lpn_pane_tab_junctions'); if (t) { t.click(); } });
			await a.settle(600);
			const found = await page.evaluate(() => {
				const i = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody tr td:first-child input'))
					.find((x) => x.value === 'J3');
				if (!i) { return false; }
				i.focus(); i.select();
				return true;
			});
			ok('the Tables pane shows J3 in an editable ID cell', found);
			if (found) {
				await page.keyboard.type('J3A');
				await page.keyboard.press('Enter');
				await a.settle(1500);
				await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
				const stale = (await naming('data-node', 'J3')).concat(await naming('data-nodelbl', 'J3'));
				ok('nothing on the map still answers to J3', stale.length === 0, stale.join(', '));
				await labelAlive('data-nodelbl', 'J3A', 'J3A');
			}
		}

		ok('no uncaught page errors', a.errors.length === 0, a.errors.length + ': ' + a.errors.slice(0, 1).join(' | ').split('\n')[0]);
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

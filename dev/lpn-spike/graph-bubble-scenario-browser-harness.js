// TIME SERIES GRAPHS ON THE MAP ARE A PRESENTATION OVERRIDE (Task 804). Real Chromium, the real page, Net1.
//   node dev/lpn-spike/graph-bubble-scenario-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-15 (R-391): *"The Time series balloons/bubbles should be a Presentation override."*
// The rule built: the set of graphs is ONE Presentation value. A child scenario shows its parent's
// set until it changes it (opens, closes, moves, resizes, or picks another quantity in a graph); the
// first change copies the inherited set into the child's own Presentation alternative and applies
// the change there. Base's set is `doc.bubbles`. Clear override gives the parent's set back.
//   1. Base opens with two graphs (22 and 10). Child and Grandchild (a child of Child) show the same
//      two, at the same places, and hold nothing of their own; nothing is marked in the Settings box.
//   2. In Child: one graph dragged, one closed, one opened from the right-click menu (12). Child now
//      holds its own set in its own Presentation alternative; Base's file set is unchanged.
//   3. Grandchild inherits Child's new set; Base still shows its own two where they were.
//   4. The Settings box's "Time series graphs on the map" row is marked held in Child only, and the
//      Settings table has the row with Child's set in words.
//   5. Reload (the project reopened from its saved copy): each scenario shows its own set again.
//   6. Clear override (the row's dot) in Child: Child and Grandchild show Base's two again; the
//      alternative is kept, holding no set.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BUBBLE_SCN_LOCKED';
const NAME = 'graph-bubble-scenario-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.bubbles = [
			{ id: 'tsb1', g: 'node', n: '22', x: 30, y: -230, w: 300, f: 'pressure' },
			{ id: 'tsb2', g: 'link', n: '10', x: -330, y: 40, w: 260, f: 'flow' }];
		d.scenarios.push({ id: 's1', name: 'Child', overrides: {} });
		d.scenarios.push({ id: 's2', name: 'Grandchild', overrides: {}, parent: 's1' });
		d.project = Object.assign({}, d.project, { activeScenario: 'base' });
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		const tidy = () => page.evaluate(() => {
			const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
			delete window.lpnDialogAnswerer;
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await tidy();
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.settle(2500);
		const L = (k) => a.lang(k);
		const runEps = async () => {
			await page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await a.waitFor(() => page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
			await a.settle(800);
		};
		await runEps();

		// The graphs on screen, as "asset@left,top" sorted, and their titles.
		const shown = () => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).filter((b) => b.style.display !== 'none').map((b) => {
			const r = b.getBoundingClientRect();
			return { id: b.getAttribute('data-bubble'), n: b.querySelector('.lpn-tsb-title').textContent, l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width) };
		}).sort((x, y) => (x.n < y.n ? -1 : 1)));
		const names = (list) => list.map((b) => b.n).join(',');
		const places = (list) => list.map((b) => b.n + '@' + b.l + ',' + b.t + 'w' + b.w).join(' ');
		const saved = () => page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				let x = null;
				try { x = JSON.parse(localStorage.getItem(localStorage.key(i)) || 'null'); } catch (e) { x = null; }
				if (x && Array.isArray(x.scenarios) && x.scenarios.some((s) => s.name === 'Child')) { return x; }
			}
			return null;
		});
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
			let hit = false;
			for (const r of rowsH) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label || t.replace(/\s*\(\d+\)$/, '') === label) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); throw new Error('no scenario menu row ' + label); }
			await a.settle(1200);
		};
		const pointOf = (g, id) => page.evaluate(([g, i]) => {
			const els = Array.from(document.querySelectorAll('#lpn_canvas [data-' + g + '="' + i + '"]'));
			for (const el of els) {
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, [g, id]);
		const boxOpen = () => page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && b.style.display !== 'none' && b.style.display !== ''; });
		const openBox = async () => {
			if (!await boxOpen()) { await a.toolbarClick(await L('lpn_tool_settings')); await page.waitForSelector('#lpn_settings_box', { state: 'visible' }); await a.settle(600); }
		};
		const boxRow = () => page.evaluate(() => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((e) => e.getAttribute('data-lpn-setting') === '[["bubbles"]]')[0];
			return r ? { held: r.classList.contains('lpn-set-held'), dot: !!r.querySelector('.lpn-ovm-dot'), text: (document.getElementById('lpn_set_bubbles_value') || {}).textContent } : null;
		});
		const presAltOf = (sv, sid) => {
			const s = sv.scenarios.filter((x) => x.id === sid)[0];
			const id = s && s.alternatives && s.alternatives.presentation;
			return id ? (sv.alternatives || []).filter((x) => x.id === id)[0] || null : null;
		};

		console.log('1. Base, and two scenarios that inherit its set');
		const base0 = await shown();
		ok('1.1 Base shows its two graphs', names(base0) === '10,22', places(base0));
		await scenarioMenu('Child');
		const child0 = await shown();
		ok('1.2 Child shows the same two, at the same places', places(child0) === places(base0), places(child0));
		await scenarioMenu('Grandchild');
		ok('1.3 Grandchild shows them too', places(await shown()) === places(base0));
		let sv = await saved();
		ok('1.4 nothing is stored for either: no Presentation alternative, no set', !presAltOf(sv, 's1') && !presAltOf(sv, 's2') &&
			!sv.scenarios.some((s) => s.settings && s.settings.bubbles), JSON.stringify(sv.alternatives || null));
		await openBox();
		let row = await boxRow();
		ok('1.5 the Settings box has the row, unmarked in an inheriting scenario', !!row && !row.held && !row.dot, JSON.stringify(row));

		console.log('2. Child changes the set');
		await scenarioMenu('Child');
		// a real drag of the 22 graph's header, by its title
		const t22 = await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('.lpn-tsb')).filter((x) => x.querySelector('.lpn-tsb-title').textContent === '22')[0];
			const r = b.querySelector('.lpn-tsb-title').getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await page.mouse.move(t22.x, t22.y);
		await page.mouse.down();
		await page.mouse.move(t22.x + 30, t22.y + 20, { steps: 4 });
		await page.mouse.move(t22.x + 60, t22.y + 40, { steps: 4 });
		await page.mouse.up();
		await a.settle(600);
		const moved = (await shown()).filter((b) => b.n === '22')[0];
		const was = base0.filter((b) => b.n === '22')[0];
		ok('2.1 the dragged graph moved by the drag', moved && moved.l - was.l === 60 && moved.t - was.t === 40, JSON.stringify(moved));
		sv = await saved();
		let alt = presAltOf(sv, 's1');
		ok('2.2 the first change made Child its own Presentation alternative holding the whole set', !!alt && alt.category === 'presentation' &&
			Array.isArray(alt.settings && alt.settings.bubbles) && alt.settings.bubbles.length === 2, JSON.stringify(alt));
		ok('2.3 Base\'s set in the file is unchanged', JSON.stringify(sv.bubbles) === JSON.stringify(d.bubbles), JSON.stringify(sv.bubbles));
		await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('.lpn-tsb')).filter((x) => x.querySelector('.lpn-tsb-title').textContent === '10')[0];
			b.querySelector('.lpn-tsb-close').click();
		});
		await a.settle(500);
		ok('2.4 closing 10 leaves only 22 in Child', names(await shown()) === '22');
		// open 12 from the right-click menu
		const p12 = await pointOf('node', '12');
		await page.mouse.move(p12.x, p12.y);
		await page.mouse.click(p12.x, p12.y, { button: 'right' });
		await a.settle(400);
		const label = await L('lpn_tsb_menu');
		await page.evaluate((l) => {
			Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click();
		}, label);
		await a.settle(700);
		const child1 = await shown();
		ok('2.5 the right-click menu opened a graph of 12 in Child', names(child1) === '12,22', places(child1));
		sv = await saved();
		alt = presAltOf(sv, 's1');
		ok('2.6 Child\'s alternative holds 22 and 12', alt && alt.settings.bubbles.map((b) => b.n).sort().join(',') === '12,22', JSON.stringify(alt && alt.settings));
		ok('2.7 Base\'s set in the file is still unchanged', JSON.stringify(sv.bubbles) === JSON.stringify(d.bubbles));
		await openBox();
		row = await boxRow();
		ok('2.8 the Settings box row is marked held in Child, with its dot', !!row && row.held && row.dot, JSON.stringify(row));
		ok('2.9 the row names the set in words', !!row && /22/.test(row.text) && /12/.test(row.text) && !/10/.test(row.text), row && row.text);

		console.log('3. switching back and forth');
		await scenarioMenu('Grandchild');
		ok('3.1 Grandchild inherits Child\'s new set', places(await shown()) === places(child1), places(await shown()));
		row = await boxRow();
		ok('3.2 Grandchild is not marked', !!row && !row.held && !row.dot, JSON.stringify(row));
		await scenarioMenu(await L('lpn_scenario_base'));
		const base1 = await shown();
		ok('3.3 Base shows its own two, where they were', places(base1) === places(base0), places(base1));
		row = await boxRow();
		ok('3.4 Base is not marked held', !!row && !row.held && !row.dot, JSON.stringify(row));
		await scenarioMenu('Child');
		ok('3.5 Child shows its set again', places(await shown()) === places(child1));

		console.log('4. the Settings table');
		const tableHas = await page.evaluate(() => {
			const t = (EngCalcs.pageConfig || {}).lpn_settings_row_bubbles;
			return !!t && t.length > 0;
		});
		ok('4.1 the row name reaches the page (the held mark in 2.8 is read off the Settings table rows)', tableHas);

		console.log('5. saved and reopened');
		const before = await saved();
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await tidy();
		await a.settle(2500);
		await runEps();
		const after = await saved();
		ok('5.1 the reopened project saves back the same sets', JSON.stringify(after.bubbles) === JSON.stringify(before.bubbles) &&
			JSON.stringify(after.alternatives) === JSON.stringify(before.alternatives), JSON.stringify(after.alternatives));
		const cur = after.project.activeScenario;
		ok('5.2 it reopens in Child, showing Child\'s set', cur === 's1' && names(await shown()) === '12,22', cur + ' ' + names(await shown()));
		await scenarioMenu(await L('lpn_scenario_base'));
		ok('5.3 Base shows its two', names(await shown()) === '10,22');
		await scenarioMenu('Grandchild');
		ok('5.4 Grandchild shows Child\'s', names(await shown()) === '12,22');

		console.log('6. Clear override');
		await scenarioMenu('Child');
		await openBox();
		const dot = await page.evaluate(() => {
			const r = Array.from(document.querySelectorAll('#lpn_setbox_content [data-lpn-setting]')).filter((e) => e.getAttribute('data-lpn-setting') === '[["bubbles"]]')[0];
			const d = r && r.querySelector('.lpn-ovm-dot');
			if (!d) { return false; }
			d.scrollIntoView({ block: 'center' });
			const b = d.getBoundingClientRect();
			return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
		});
		ok('6.1 the row has a dot to click', !!dot);
		if (dot) { await page.mouse.click(dot.x, dot.y); await a.settle(1200); }
		ok('6.2 Child shows Base\'s two again', names(await shown()) === '10,22', names(await shown()));
		sv = await saved();
		alt = presAltOf(sv, 's1');
		ok('6.3 the alternative is kept, holding no set', !!alt && !(alt.settings && alt.settings.bubbles), JSON.stringify(alt));
		row = await boxRow();
		ok('6.4 the row is no longer marked', !!row && !row.held, JSON.stringify(row));
		await scenarioMenu('Grandchild');
		ok('6.5 Grandchild follows Base\'s set again', names(await shown()) === '10,22');

		ok('no page errors', errors.length === 0, errors.join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

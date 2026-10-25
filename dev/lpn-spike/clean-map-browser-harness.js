// MAP, CLEAN MAP, AND THE OVERRIDE MARKERS' OWN SWITCH (Task 805), in a real Chromium. Run with:
//   node dev/lpn-spike/clean-map-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-15 (R-396): *"It would be good to be able to hide the amber override indicators from
// the map. Maybe a Map, Clean map button is a good idea after all with zoom buttons, error messenger,
// ambers, and satellite button hiding."*
//
// Opens fixtures/fotobi-override-audit.epp in a scenario with overrides, so amber rings are drawn.
//   C1  the Map menu has a Clean map row, unchecked; every control in the list is shown first (each
//       one forced on where the page had no reason to show it), and the rings are drawn;
//   C2  checking it hides every listed control with display:none (not opacity), takes every ring
//       class off the drawing, and leaves the toolbar and the selection help (its own checkbox,
//       Tom 2026-10-24) alone; the Mode line, the messenger and an ordinary status are hidden, and
//       a status that says a run gave no answer (not-converged, a diagnostic) stays shown;
//   C3  only lpn_cleanmap=on is written, and the project text is byte-identical to before;
//   C4  a reload keeps it clean; the Map menu, opened from the keyboard (Alt+Shift+M), shows the row
//       checked, and Enter on it clears it;
//   C5  cleared, every control is back exactly as it was and the rings return; the key is removed;
//   C6  Settings, Map and page, Page, Show override markers on the map: cleared, the rings go and
//       the zoom buttons stay, lpn_ovrmarks=off is written, the project text is unchanged; checked
//       again, the rings return and the key is removed;
//   C7  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CLEANMAP_LOCKED';
const NAME = 'clean-map-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
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
// The list css/engcalcs.css hides under .lpn-clean-map. Kept in step with that rule by hand: a
// control added there and not here is simply not tested, never falsely passed.
const HIDDEN = ['lpn_zoom_control', 'lpn_map_notice', 'lpn_msglog_btn', 'lpn_mode_hint', 'lpn_status', 'lpn_basemap_teaser', 'lpn_wrong_btn'];
const KEPT = ['lpn_area_hint', 'lpn_scenario_btn', 'lpn_map_status', 'lpn_menu_map'];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	let a = null, page = null;
	try {
		const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'fotobi-override-audit.epp'), 'utf8'));
		d.project = Object.assign({}, d.project, { activeScenario: 's3' });
		d.settings.autoRun = false;
		a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
		const open = async () => {
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
		};
		await a.reload();
		await open();
		const CLEAN = await a.lang('lpn_clean_map');
		const rings = () => page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-override, #lpn_canvas .lpn-override-inh').length);
		const projectText = () => page.evaluate(() => EngCalcs.lpnCleanMap.projectText());
		const store = () => page.evaluate(() => ({ c: localStorage.getItem('lpn_cleanmap'), o: localStorage.getItem('lpn_ovrmarks') }));
		// Computed display, inline display, and whether it takes up any box at all.
		const look = (ids) => page.evaluate((list) => {
			const out = {};
			list.forEach((id) => {
				const e = document.getElementById(id);
				if (!e) { out[id] = null; return; }
				const r = e.getBoundingClientRect();
				out[id] = { display: getComputedStyle(e).display, inline: e.style.display, box: r.width > 0 && r.height > 0, opacity: getComputedStyle(e).opacity };
			});
			return out;
		}, ids);
		const rowLabel = async () => {
			await a.openMenu('map');
			const r = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((e) => e.textContent));
			await a.closeMenu();
			return r.find((t) => t.indexOf(CLEAN) >= 0) || null;
		};

		console.log('--- C1. before ---');
		let label = await rowLabel();
		ok('C1 the Map menu has a "' + CLEAN + '" row', !!label && CLEAN === 'Clean map', JSON.stringify(label));
		ok('C1 ...unchecked', !!label && label.indexOf('✓') < 0, JSON.stringify(label));
		// A standing error, so C2 can show it survives; and every listed control forced on where the
		// page had no reason to show it (the teaser needs a world map, the notice a message).
		await page.evaluate((list) => {
			const st = document.getElementById('lpn_status_text') || document.getElementById('lpn_status');
			st.textContent = 'Harness standing error';
			document.getElementById('lpn_status').style.display = '';
			list.forEach((id) => {
				const e = document.getElementById(id);
				if (e && getComputedStyle(e).display === 'none') {
					e.style.display = 'block';
					if (!e.textContent) { e.textContent = 'x'; }
				}
			});
		}, HIDDEN.concat(['lpn_area_hint']));
		const before = await look(HIDDEN.concat(KEPT));
		HIDDEN.concat(KEPT).forEach((id) => ok('C1 #' + id + ' is shown', before[id] && before[id].display !== 'none' && before[id].box, JSON.stringify(before[id])));
		const ringsBefore = await rings();
		ok('C1 the scenario draws override rings', ringsBefore > 0, String(ringsBefore));
		const proj0 = await projectText();
		const store0 = await store();
		ok('C1 nothing stored for either switch yet', store0.c === null && store0.o === null, JSON.stringify(store0));

		console.log('--- C2. Map, Clean map ---');
		await a.menuClick(label.trim(), 'map');
		await a.settle(400);
		const clean = await look(HIDDEN.concat(KEPT));
		HIDDEN.forEach((id) => ok('C2 #' + id + ' is hidden (display:none, no box)', clean[id] && clean[id].display === 'none' && !clean[id].box, JSON.stringify(clean[id])));
		KEPT.forEach((id) => ok('C2 #' + id + ' is still shown', clean[id] && clean[id].display !== 'none' && clean[id].box, JSON.stringify(clean[id])));
		// A status that says a run gave no answer stays; a progress line or a note does not.
		const statusShown = (text, code, diag) => page.evaluate((a) => {
			EngCalcs.lpnCleanMap.setStatus(a[0], a[1], a[2]);
			const e = document.getElementById('lpn_status'), r = e.getBoundingClientRect();
			return getComputedStyle(e).display !== 'none' && r.width > 0;
		}, [text, code, diag]);
		ok('C2 an ordinary status (a run summary) is hidden', !(await statusShown('Harness note', 'solve-notes', false)));
		ok('C2 "no solution" stays shown', await statusShown('Harness no solution', 'not-converged', false));
		ok('C2 a diagnostic that refuses to solve stays shown', await statusShown('Harness add a reservoir', 'no-source', true));
		ok('C2 no override ring is left on the drawing', (await rings()) === 0, String(await rings()));
		ok('C2 ...and no ring keeps its explaining title', await page.evaluate(() => !Array.from(document.querySelectorAll('#lpn_canvas title')).some((t) => /amber ring|dashed gray ring/.test(t.textContent))));
		ok('C2 the Tab order cannot reach a hidden button', await page.evaluate(() => { const b = document.getElementById('lpn_zoom_in'); b.focus(); return document.activeElement !== b; }));

		console.log('--- C3. stored in the browser only ---');
		const store1 = await store();
		ok('C3 lpn_cleanmap=on is written', store1.c === 'on', JSON.stringify(store1));
		ok('C3 lpn_ovrmarks is untouched', store1.o === null, JSON.stringify(store1));
		const proj1 = await projectText();
		ok('C3 the project text is byte-identical to before', proj1 === proj0, proj1.length + ' vs ' + proj0.length);
		ok('C3 ...and names neither switch', !/clean|ovrmarks/i.test(proj1));

		console.log('--- C4. a reload, and the keyboard ---');
		await a.reload();
		await open();
		ok('C4 after a reload the map is still clean', await page.evaluate(() => document.querySelector('.lpn-map-wrap').classList.contains('lpn-clean-map')));
		const afterReload = await look(HIDDEN);
		HIDDEN.forEach((id) => ok('C4 #' + id + ' is still hidden', afterReload[id] && afterReload[id].display === 'none', JSON.stringify(afterReload[id])));
		ok('C4 ...and no ring is drawn', (await rings()) === 0);
		await page.keyboard.press('Alt+Shift+KeyM');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const kbRow = await page.evaluateHandle((name) => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((e) => e.textContent.indexOf(name) >= 0) || null, CLEAN);
		const kbText = await page.evaluate((r) => r && r.textContent, kbRow);
		ok('C4 Alt+Shift+M opens the Map menu with the row checked', !!kbText && kbText.indexOf('✓') >= 0, JSON.stringify(kbText));
		await page.evaluate((r) => r.focus(), kbRow);
		await page.keyboard.press('Enter');
		await a.settle(500);

		console.log('--- C5. cleared ---');
		const restored = await look(HIDDEN.concat(KEPT));
		// After the reload nothing forced the extras on again, so compare against what THIS page load
		// shows on its own: the always-on controls must be back exactly.
		['lpn_zoom_control', 'lpn_msglog_btn', 'lpn_wrong_btn'].forEach((id) => ok('C5 #' + id + ' is back', restored[id] && restored[id].display === before[id].display && restored[id].box, JSON.stringify(restored[id])));
		ok('C5 the class is gone from the map', await page.evaluate(() => !document.querySelector('.lpn-map-wrap').classList.contains('lpn-clean-map')));
		ok('C5 the rings are back, every one', (await rings()) === ringsBefore, (await rings()) + ' vs ' + ringsBefore);
		ok('C5 lpn_cleanmap is removed', (await store()).c === null, JSON.stringify(await store()));
		label = await rowLabel();
		ok('C5 the row reads unchecked again', !!label && label.indexOf('✓') < 0, JSON.stringify(label));
		// Restored EXACTLY because Clean map never writes an element's own style: it is one class on
		// the map wrapper. Proved in one synchronous step, so no page timer (the teaser's refresh, the
		// notice's expiry) can rewrite an inline value between the two readings.
		const same = await page.evaluate((list) => {
			const t = document.getElementById('lpn_basemap_teaser');
			t.style.display = 'inline-block';
			const read = () => list.map((id) => { const e = document.getElementById(id); return e ? e.getAttribute('style') : null; });
			const b = read();
			EngCalcs.lpnCleanMap.set(true);
			const hidden = getComputedStyle(t).display === 'none';
			const c = read();
			EngCalcs.lpnCleanMap.set(false);
			const r = read();
			return { hidden: hidden, during: JSON.stringify(b) === JSON.stringify(c), after: JSON.stringify(b) === JSON.stringify(r), back: getComputedStyle(t).display !== 'none' };
		}, HIDDEN);
		ok('C5 the teaser hides even with an inline display set', same.hidden, JSON.stringify(same));
		ok('C5 ...and no listed element\'s own style attribute is written, on or off', same.during && same.after, JSON.stringify(same));
		ok('C5 ...so the teaser is back as the page had set it', same.back, JSON.stringify(same));

		console.log('--- C6. Settings, Show override markers on the map ---');
		const OM = await a.lang('lpn_settings_override_marks');
		ok('C6 the row is named "' + OM + '"', OM === 'Show override markers on the map');
		await page.evaluate(() => { if (EngCalcs.lpnOpenSettings) { EngCalcs.lpnOpenSettings(); } });
		const box = await page.evaluate(() => { const c = document.getElementById('lpn_set_ovrmarks'); return c ? { checked: c.checked, label: c.closest('label').textContent, home: c.closest('#lpn_set_page_fields') !== null } : null; });
		ok('C6 the checkbox is in Settings, Map and page, Page, checked', !!box && box.checked && box.home && box.label.indexOf(OM) >= 0, JSON.stringify(box));
		const proj2 = await projectText();
		await page.evaluate(() => { const c = document.getElementById('lpn_set_ovrmarks'); c.checked = false; c.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(300);
		ok('C6 cleared: no ring on the drawing', (await rings()) === 0);
		ok('C6 ...and the zoom buttons stay', (await look(['lpn_zoom_control'])).lpn_zoom_control.display !== 'none');
		ok('C6 ...lpn_ovrmarks=off is written', (await store()).o === 'off', JSON.stringify(await store()));
		ok('C6 ...and the project text is unchanged', (await projectText()) === proj2);
		await page.evaluate(() => { const c = document.getElementById('lpn_set_ovrmarks'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(300);
		ok('C6 checked again: the rings are back', (await rings()) === ringsBefore, String(await rings()));
		ok('C6 ...and the key is removed', (await store()).o === null);

		ok('C7 no page errors', !errors.length && !a.errors.length, (errors[0] || a.errors[0] || '').slice(0, 200));
	} finally {
		if (a) { await a.close().catch(() => {}); }
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

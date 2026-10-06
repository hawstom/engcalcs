// A HELD VALUE MARKED IN THE SETTINGS BOX, AND "HOLD THIS VIEW IN THIS SCENARIO", IN A REAL CHROMIUM
// -- dev/scenario-alternatives.md, "Stage 3c".
// Run with:
//   node dev/lpn-spike/settings-box-held-browser-harness.js
//
// Ida's design: a Settings box row whose value the open scenario holds wears an amber edge, and
// under it "Base: {value}" and Clear override; no per-field checkbox. Declan's: the view is stored
// as centre plus scale (ground metres per CSS pixel), corners shown and never stored, and holding
// it is a deliberate click. Asserted on Net1:
//
//   1. In Base nothing is marked, and there is no Hold button.
//   2. A new scenario inherits everything: nothing marked.
//   3. Friction method picked in the box in the scenario: its row is marked, "Base: Hazen-Williams",
//      and the solve differs from Base's. A text size typed there is marked too, "Base: 14".
//   4. Clear override on the method: mark gone, the box shows Hazen-Williams, the solve matches
//      Base's; the text size stays held. Ctrl+Z puts the override back, one step.
//   5. Back in Base: nothing marked.
//   6. The view rows show centre, scale as 1:N and two corners. Hold stores the view in the
//      scenario as centre plus metres per pixel (never the corners); panning writes nothing;
//      switching scenarios moves the camera to the held view and back to Base's; Clear override
//      releases it, the map goes back to Base's view, and the scenario follows Base's after that.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SETHELD_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '200', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SETHELD_LOCKED: '1' }) });
		if (r.status === 75) { console.error('settings-box-held-browser-harness: NOT RUN -- browser lock held 200 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		const L = async (k) => a.lang(k);
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		const BASE = await L('lpn_scenario_base'), CLEAR = await L('lpn_pane_clear_override'),
			HELD = await L('lpn_settings_held_base'), HW = await L('bpn_method_hw');
		const baseNote = (v) => HELD.replace('{base}', BASE).replace('{value}', v);

		// ---- what a person does and sees ----
		const tab = async (id) => { await page.click('#lpn_pane_tab_' + id); await a.settle(600); };
		const pressure = async (id) => {
			await tab('junctions');
			const v = await page.evaluate((id) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_junctions td.lpn-pane-col-pressure'))
					.filter((t) => t._lpnPaneId === id)[0];
				return td ? td.textContent.trim() : null;
			}, id);
			return parseFloat(v);
		};
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
			let hit = false;
			// A scenario's row carries its override count after its name: "Peak (3)".
			for (const r of rowsH) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label.trim() || t.replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); }
			await a.settle(1000);
			if (!hit) { throw new Error('no scenario menu row ' + label); }
			return hit;
		};
		const newScenario = async (name) => {
			a.answerPromptWith(name);
			if (!await scenarioMenu(await L('lpn_scenario_new'))) { throw new Error('no New scenario row'); }
			await a.settle(1200);
		};
		const openBox = async () => {
			const open = await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return b && b.style.display !== 'none' && b.style.display !== ''; });
			if (!open) { await a.toolbarClick(await L('lpn_tool_settings')); await page.waitForSelector('#lpn_settings_box', { state: 'visible' }); await a.settle(500); }
		};
		// Every marked row in the box: which settings it edits, and the note under it.
		const marks = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-held')).map((el) => {
			const n = el.nextElementSibling;
			return { tag: el.getAttribute('data-lpn-setting'), note: n && n.classList.contains('lpn-set-heldnote') ? n.textContent.trim() : null };
		}));
		const notes = () => page.evaluate(() => document.querySelectorAll('#lpn_settings_box .lpn-set-heldnote').length);
		const markOf = async (path) => (await marks()).filter((m) => JSON.parse(m.tag).some((p) => JSON.stringify(p) === JSON.stringify(path)))[0];
		const methodSelect = () => page.evaluateHandle(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
			.filter((s) => Array.from(s.options).some((o) => o.value === 'dw') && Array.from(s.options).some((o) => o.value === 'manning'))[0]);
		const methodValue = async () => (await methodSelect()).asElement().evaluate((s) => s.value);
		const textSizeInput = () => page.evaluateHandle(() => Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]'))
			.filter((el) => el.getAttribute('data-lpn-setting') === '[["settings","textSize"]]')[0].querySelector('input'));
		// A real press on the Clear override under a marked row (Playwright's own click).
		const clearOf = async (path) => {
			const h = await page.evaluateHandle((p) => {
				const el = Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-held'))
					.filter((e) => JSON.parse(e.getAttribute('data-lpn-setting')).some((q) => JSON.stringify(q) === p))[0];
				const n = el && el.nextElementSibling;
				return n ? n.querySelector('.lpn-set-heldclear') : null;
			}, JSON.stringify(path));
			const el = h.asElement();
			if (!el) { return false; }
			await el.scrollIntoViewIfNeeded();
			await el.click();
			await a.settle(1500);
			return true;
		};
		const blurAll = () => page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });

		console.log('--- 1. in Base nothing is marked ---');
		const pBase = await pressure('22');
		ok('Net1 solves in Base: junction 22 has a pressure', isFinite(pBase), pBase);
		await openBox();
		const tagged = await page.evaluate(() => document.querySelectorAll('#lpn_settings_box [data-lpn-setting]').length);
		ok('the box says which setting each row edits (a row per setting, tagged)', tagged >= 60, tagged);
		ok('in Base no row is marked and no note is shown', (await marks()).length === 0 && await notes() === 0);
		ok('in Base there is no Hold this view button', await page.evaluate(() => !document.getElementById('lpn_set_view_hold')));
		// EVERY SETTING THE BOX EDITS CAN BE MARKED THERE: each Settings table row is covered by some
		// tagged row of the box, except the ones the box has no control for. Those are edited in the
		// Settings table (and the contour ones in the Contour box), and are listed here by name so
		// a new box row that forgets its tag fails this line.
		await tab('settings');
		const EXEMPT = new RegExp('^\\["(' + [
			'labelSettings","(decimals|show|priority)","(node|link)","quality:',   // another analysis's ranks: shown when it is chosen
			'settings","contour',                                             // the Contour box
			'project","basemap',                                              // the Map menu and the corner toggle
			'settings","idPrefixes","X"',                                      // Text has no prefix row, by design
			'settings","nodeElevSource"',                                      // the older mirror of New assets: Elevation source
			'settings","defaults","tank',                                      // no box row: the table edits them
			'times","qualityStep"',
			'settings","hydraulics","(checkFreq|maxCheck|statusReport)"',
			'settings","qualityOptions","quality"'
		].join('|') + ')');
		const uncovered = await page.evaluate((ex) => {
			const re = new RegExp(ex);
			const tags = Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]'))
				.map((e) => JSON.parse(e.getAttribute('data-lpn-setting'))).reduce((x, y) => x.concat(y), []);
			return Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).map((t) => t._lpnPaneId)
				.filter((k) => !re.test(k) && !tags.some((t) => t.every((x, i) => String(JSON.parse(k)[i]) === String(x))));
		}, EXEMPT.source);
		ok('every Settings table row the box has a control for is tagged in the box', uncovered.length === 0, JSON.stringify(uncovered));

		console.log('\n--- 2. a new scenario inherits: nothing marked ---');
		await newScenario('Peak');
		await openBox();
		ok('Peak, holding nothing: no row is marked', (await marks()).length === 0, JSON.stringify(await marks()));
		ok('...and the Hold this view button is there', await page.evaluate(() => !!document.getElementById('lpn_set_view_hold')));

		console.log('\n--- 3. a value changed in the box is marked, with Base\'s value ---');
		await (await methodSelect()).asElement().selectOption('manning');
		await a.settle(1500);
		let m = await markOf(['settings', 'method']);
		ok('friction method picked in Peak: its row wears the amber mark', !!m, JSON.stringify(await marks()));
		ok('...and the note under it reads "' + baseNote(HW) + '" with Clear override', m && m.note === baseNote(HW) + ' ' + CLEAR, m && m.note);
		ok('...the amber is the --ec-held token', await page.evaluate(() => {
			const el = document.querySelector('#lpn_settings_box .lpn-set-held');
			const tok = getComputedStyle(document.documentElement).getPropertyValue('--ec-held').trim();
			return !!el && tok !== '' && getComputedStyle(el).boxShadow.indexOf('inset') >= 0;
		}));
		await openBox();
		const ts0 = await (await textSizeInput()).asElement().evaluate((i) => i.value);
		await (await textSizeInput()).asElement().evaluate((i) => { i.value = String(+i.value + 6); i.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(1200);
		const tsm = await markOf(['settings', 'textSize']);
		ok('text size typed in Peak: marked, "' + baseNote(ts0) + '"', tsm && tsm.note === baseNote(ts0) + ' ' + CLEAR, tsm && tsm.note);
		const pPeak = await pressure('22');
		ok('Peak (Manning) solves differently from Base', isFinite(pPeak) && Math.abs(pPeak - pBase) > 0.01, pBase + ' vs ' + pPeak);

		console.log('\n--- 4. Clear override in the box, and its undo ---');
		await openBox();
		ok('pressed Clear override under friction method', await clearOf(['settings', 'method']));
		ok('...its mark is gone', !(await markOf(['settings', 'method'])), JSON.stringify(await marks()));
		ok('...the box shows Base\'s Hazen-Williams', await methodValue() === 'hw', await methodValue());
		ok('...the text size is still held', !!(await markOf(['settings', 'textSize'])));
		const pClear = await pressure('22');
		ok('...and Peak\'s solve matches Base\'s again', Math.abs(pClear - pBase) < 1e-6, pBase + ' vs ' + pClear);
		await blurAll();
		await page.keyboard.press('Control+z');
		await a.settle(1500);
		await openBox();
		ok('Ctrl+Z: the friction method override is back, marked', !!(await markOf(['settings', 'method'])) && await methodValue() === 'manning', await methodValue());
		ok('...and the solve with it', Math.abs(await pressure('22') - pPeak) < 1e-6);
		await openBox();
		ok('...the text size override was not touched by the undo', !!(await markOf(['settings', 'textSize'])));

		console.log('\n--- 5. back in Base: nothing marked ---');
		await scenarioMenu(BASE);
		await openBox();
		ok('Base: no row marked, no note', (await marks()).length === 0 && await notes() === 0, JSON.stringify(await marks()));
		ok('...and the box shows Base\'s own method', await methodValue() === 'hw');

		console.log('\n--- 6. the view, and holding it ---');
		const view = () => page.evaluate(() => {
			const v = (id) => { const e = document.getElementById(id); return e ? (e.value !== undefined && e.tagName === 'INPUT' ? e.value : e.textContent) : null; };
			return { c1: v('lpn_set_view_c1'), c2: v('lpn_set_view_c2'), scale: v('lpn_set_view_scale'), tl: v('lpn_set_view_tl'), br: v('lpn_set_view_br') };
		});
		const typeScale = async (n) => {
			await page.evaluate((n) => { const i = document.getElementById('lpn_set_view_scale'); i.value = '1:' + n; i.dispatchEvent(new Event('change', { bubbles: true })); }, n);
			await a.settle(1200);
		};
		const v0 = await view();
		ok('the view rows show a centre, a scale as 1:N and two corners', v0.c1 && v0.c2 && /^1:\d+$/.test(v0.scale) && /,/.test(v0.tl) && /,/.test(v0.br), JSON.stringify(v0));
		const N0 = +v0.scale.slice(2), NB = Math.round(N0 * 0.8), NP = Math.round(N0 * 1.6), NB2 = Math.round(N0 * 0.6);
		await typeScale(NB);
		ok('a scale typed in Base zooms the map there', (await view()).scale === '1:' + NB, (await view()).scale);
		await scenarioMenu('Peak');
		await openBox();
		ok('entering Peak, which holds no view, moves nothing', (await view()).scale === '1:' + NB, (await view()).scale);
		await typeScale(NP);
		const holdState = await page.evaluate(() => {
			const b = document.getElementById('lpn_set_view_hold');
			if (!b) { return 'absent'; }
			let e = b, hid = [];
			while (e) { if (getComputedStyle(e).display === 'none') { hid.push(e.id || e.className); } e = e.parentElement; }
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			return hid.length ? 'hidden by ' + hid.join(' < ') : 'pressed';
		});
		ok('the Hold this view button is there in Peak, and pressed', holdState === 'pressed', holdState);
		await a.settle(1200);
		const vm = await markOf(['view']);
		ok('Hold this view in this scenario: the view rows are marked, with Clear override', vm && vm.note && vm.note.slice(-CLEAR.length) === CLEAR, vm && vm.note);
		const stored = await page.evaluate(() => {
			// The autosave of the open project: its scenarios' own views (Base's live view is the
			// file's top-level `view`, which is not a scenario's).
			let out = [];
			for (let i = 0; i < localStorage.length; i++) {
				let d = null;
				try { d = JSON.parse(localStorage.getItem(localStorage.key(i)) || 'null'); } catch (e) { d = null; }
				if (d && Array.isArray(d.scenarios)) {
					out = out.concat(d.scenarios.filter((s) => s.name === 'Peak' && s.settings && s.settings.view).map((s) => s.settings.view));
				}
			}
			return out;
		});
		ok('...stored as centre plus metres per pixel, and nothing else', stored.length >= 1 && stored.every((o) => JSON.stringify(Object.keys(o).sort()) === '["cx","cy","mpp"]') &&
			Math.abs(stored[0].mpp / (0.0254 / 96) - NP) < 1, JSON.stringify(stored));
		// Panning (a wheel zoom) writes nothing: the held view stays what was held.
		const box = await page.$('#lpn_canvas');
		const bb = await box.boundingBox();
		await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await page.mouse.wheel(0, -400);
		await a.settle(1500);
		await openBox();
		const afterWheel = await view();
		ok('a wheel zoom in Peak moves the map (the rows follow it)', afterWheel.scale !== '1:' + NP, afterWheel.scale);
		await scenarioMenu(BASE);
		await openBox();
		ok('switching to Base returns to Base\'s view', (await view()).scale === '1:' + NP || (await view()).scale === '1:' + NB, (await view()).scale);
		await typeScale(NB2);
		await scenarioMenu('Peak');
		await openBox();
		ok('switching to Peak moves the camera to the held view, not where the wheel left it', (await view()).scale === '1:' + NP, (await view()).scale);
		await scenarioMenu(BASE);
		await openBox();
		ok('...and back to Base returns to Base\'s view', (await view()).scale === '1:' + NB2, (await view()).scale);
		await scenarioMenu('Peak');
		await openBox();
		ok('in Peak again, at the held view', (await view()).scale === '1:' + NP, (await view()).scale);
		ok('Clear override under the view releases it', await clearOf(['view']));
		ok('...the map goes back to Base\'s view', (await view()).scale === '1:' + NB2, (await view()).scale);
		ok('...and the view rows are no longer marked', !(await markOf(['view'])));
		await scenarioMenu(BASE);
		await openBox();
		const NB3 = Math.round(N0 * 1.2);
		await typeScale(NB3);
		await scenarioMenu('Peak');
		await openBox();
		ok('released, Peak follows Base\'s view again', (await view()).scale === '1:' + NB3, (await view()).scale);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' settings box held-value check(s) FAILED' : '\nSettings box held-value browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

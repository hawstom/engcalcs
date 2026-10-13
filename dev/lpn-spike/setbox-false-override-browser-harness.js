// AN OVERRIDE OF FALSE STAYS FALSE, AND THE SETTINGS BOX KEEPS ITS PLACE, IN A REAL CHROMIUM
// -- Tom's browser pass of feat/bentley-interop, 2026-10-12. Run with:
//   node dev/lpn-spike/setbox-false-override-browser-harness.js
//
// Tom: "When I check a cleared display box to create an override, then clear it because I want the
// override no-display, then I go to another property and check it, all other overrides including
// the recently cleared one get checked... At any moment, all the overrides may revert to checked."
// And: "When I check or clear a labels display checkbox, the addition of the override notice loses
// my place in the settings box (it scrolls it elsewhere)."
//
// The cause: the box's editors write the GLOBAL `settings` / `labelSettings`, which outside a build
// are the project's own, so a value typed in a scenario that equals Base's changed nothing the
// seam could see and was dropped. Asserted on Net1, in a scenario, with real mouse clicks:
//   1. Tick a node label Base leaves cleared: an override of true, marked.
//   2. Clear it again: the override is now false, still marked, and stays cleared.
//   3. Tick a second label: the first stays cleared, both are marked, and the autosave holds
//      false and true.
//   4. Close and reopen the box: still cleared and ticked as left.
//   5. Friction method set back to Base's own in a scenario holding another: an override of Base's
//      value, not a dropped write.
//   6. Every third checkbox in the box, with the box scrolled so it is mid-way down, is ticked and
//      cleared: it stays where it was on screen while notes appear and go.
//   7. Tom's Fig 5 report: in a child scenario made in the Scenario manager, a label it inherits
//      ticked is cleared, and the child gets its own Presentation alternative, named after it.
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
if (process.env.EC_SBFALSE_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SBFALSE_LOCKED: '1' }) });
		if (r.status === 75) { console.error('setbox-false-override-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
	const errors = [];
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = async (k) => a.lang(k);
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
			let hit = false;
			for (const r of rowsH) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label.trim() || t.replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); throw new Error('no scenario menu row ' + label); }
			await a.settle(1000);
		};
		const boxOpen = () => page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && b.style.display !== 'none' && b.style.display !== ''; });
		const openBox = async () => {
			if (!await boxOpen()) { await a.toolbarClick(await L('lpn_tool_settings')); await page.waitForSelector('#lpn_settings_box', { state: 'visible' }); await a.settle(600); }
		};
		// The node label rows: their field key (from the tag), their checkbox state, marked or not.
		const rows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_labels_node_fields [data-lpn-setting]')).map((r) => {
			const p = JSON.parse(r.getAttribute('data-lpn-setting'))[0];
			const cb = r.querySelector('input[type=checkbox]');
			return { key: p[2], checked: !!cb && cb.checked, held: r.classList.contains('lpn-set-held') };
		}));
		const rowOf = async (key) => (await rows()).filter((r) => r.key === key)[0];
		const cbHandle = (key) => page.evaluateHandle((k) => Array.from(document.querySelectorAll('#lpn_labels_node_fields [data-lpn-setting]'))
			.filter((r) => JSON.parse(r.getAttribute('data-lpn-setting'))[0][2] === k)[0].querySelector('input[type=checkbox]'), key);
		// A real mouse click on the checkbox, and where it is on screen before and after.
		const clickBox = async (key) => {
			const el = (await cbHandle(key)).asElement();
			await el.scrollIntoViewIfNeeded();
			await a.settle(200);
			const before = await el.boundingBox();
			await page.mouse.click(before.x + before.width / 2, before.y + before.height / 2);
			await a.settle(1200);
			const after = await (await cbHandle(key)).asElement().boundingBox();
			return { before: before.y, after: after ? after.y : null };
		};
		// The autosave of the open project: the scenario's own node label values.
		const stored = (name) => page.evaluate((n) => {
			let out = null;
			for (let i = 0; i < localStorage.length; i++) {
				let d = null;
				try { d = JSON.parse(localStorage.getItem(localStorage.key(i)) || 'null'); } catch (e) { d = null; }
				if (d && Array.isArray(d.scenarios)) {
					d.scenarios.forEach((s) => {
						if (s.name !== n) { return; }
						let v = s.settings && s.settings.labelSettings && s.settings.labelSettings.node;
						(d.alternatives || []).forEach((al) => {
							if (s.alternatives && s.alternatives.presentation === al.id && al.settings && al.settings.labelSettings) { v = Object.assign({}, al.settings.labelSettings.node || {}, v || {}); }
						});
						out = v || {};
					});
				}
			}
			return out;
		}, name);
		await a.settle(400);
		// New scenario "Fig 5": the New row asks for a name.
		a.answerPromptWith('Fig 5');
		await scenarioMenu(await L('lpn_scenario_new'));
		await a.settle(1200);
		await openBox();
		const r0 = await rows();
		const cleared = r0.filter((r) => !r.checked).map((r) => r.key);
		ok('Net1 leaves at least two node labels cleared in Base', cleared.length >= 2, JSON.stringify(r0));
		const A = cleared[0], B = cleared[1];

		console.log('--- 1. tick a label Base leaves cleared ---');
		const p1 = await clickBox(A);
		let ra = await rowOf(A);
		ok('ticked "' + A + '": it shows ticked and its row is marked', ra.checked && ra.held, JSON.stringify(ra));
		ok('...and the checkbox did not move on screen when its note appeared', Math.abs(p1.after - p1.before) < 1, JSON.stringify(p1));
		ok('...the autosave holds true for it', (await stored('Fig 5') || {})[A] === true, JSON.stringify(await stored('Fig 5')));

		console.log('--- 2. clear it again: an override of false ---');
		const p2 = await clickBox(A);
		ra = await rowOf(A);
		ok('cleared "' + A + '": it shows cleared and stays marked (an override of false)', !ra.checked && ra.held, JSON.stringify(ra));
		ok('...the autosave holds false for it', (await stored('Fig 5') || {})[A] === false, JSON.stringify(await stored('Fig 5')));
		ok('...and the checkbox did not move on screen', Math.abs(p2.after - p2.before) < 1, JSON.stringify(p2));

		console.log('--- 3. tick a second label ---');
		const p3 = await clickBox(B);
		ra = await rowOf(A);
		const rb = await rowOf(B);
		ok('ticked "' + B + '": "' + A + '" stays cleared and marked', !ra.checked && ra.held, JSON.stringify(ra));
		ok('..."' + B + '" shows ticked and marked', rb.checked && rb.held, JSON.stringify(rb));
		const st = await stored('Fig 5') || {};
		ok('...the autosave holds false for "' + A + '" and true for "' + B + '"', st[A] === false && st[B] === true, JSON.stringify(st));
		ok('...and the second checkbox did not move on screen either', Math.abs(p3.after - p3.before) < 1, JSON.stringify(p3));
		// Clearing B's override from its note above-or-below must not move A either.

		console.log('--- 4. close and reopen the box ---');
		await page.keyboard.press('Escape');
		await a.toolbarClick(await L('lpn_tool_settings'));
		await a.settle(600);
		await openBox();
		ra = await rowOf(A);
		ok('reopened: "' + A + '" still cleared and marked, "' + B + '" still ticked', !ra.checked && ra.held && (await rowOf(B)).checked, JSON.stringify(await rows()));

		console.log('--- 5. a value equal to Base\'s, picked in a scenario that holds another ---');
		const methodSel = () => page.evaluateHandle(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
			.filter((s) => Array.from(s.options).some((o) => o.value === 'dw') && Array.from(s.options).some((o) => o.value === 'manning'))[0]);
		await (await methodSel()).asElement().selectOption('dw');
		await a.settle(1200);
		await (await methodSel()).asElement().selectOption('hw');
		await a.settle(1200);
		const methodHeld = await page.evaluate(() => {
			const s = Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]')).filter((e) => e.getAttribute('data-lpn-setting').indexOf('"method"') >= 0)[0];
			const sel = s && s.querySelector('select');
			return { held: !!s && s.classList.contains('lpn-set-held'), value: sel && sel.value };
		});
		ok('Darcy-Weisbach, then Hazen-Williams (Base\'s own) again: the box shows Hazen-Williams, held as an override', methodHeld.value === 'hw' && methodHeld.held, JSON.stringify(methodHeld));
		await scenarioMenu(await L('lpn_scenario_base'));
		await scenarioMenu('Fig 5');
		await openBox();
		const mh2 = await page.evaluate(() => {
			const sel = Array.from(document.querySelectorAll('#lpn_settings_box select')).filter((s) => Array.from(s.options).some((o) => o.value === 'manning'))[0];
			return sel && sel.value;
		});
		ok('...and after leaving Fig 5 and coming back it is still Hazen-Williams', mh2 === 'hw', mh2);
		console.log('--- 6. the box scrolled to each checkbox in turn: ticked and cleared, it stays under the pointer ---');
		// Measured before the fix on Net1: from the node Pressure label down, a tick moved the
		// content by 400 to 1300 px (a link Diameter label at 522 px came back at -106).
		const cbAt = (i) => page.evaluateHandle((i) => Array.from(document.querySelectorAll('#lpn_setbox_content input[type=checkbox]')).filter((c) => c.offsetParent)[i], i);
		const nBoxes = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_content input[type=checkbox]')).filter((c) => c.offsetParent).length);
		const moved = [];
		let tried = 0;
		for (let i = 0; i < nBoxes; i += 3) {
			for (let pass = 0; pass < 2; pass++) {
				const placed = await page.evaluate((i) => {
					const c = Array.from(document.querySelectorAll('#lpn_setbox_content input[type=checkbox]')).filter((x) => x.offsetParent)[i];
					if (!c) { return false; }
					const s = document.getElementById('lpn_setbox_content'), r = c.getBoundingClientRect(), b = s.getBoundingClientRect();
					s.scrollTop += (r.top - b.top) - s.clientHeight / 2;
					return true;
				}, i);
				if (!placed) { break; }
				await a.settle(150);
				const el = (await cbAt(i)).asElement();
				const b0 = await el.boundingBox();
				await page.mouse.click(b0.x + b0.width / 2, b0.y + b0.height / 2);
				await a.settle(900);
				const e1 = (await cbAt(i)).asElement();
				const b1 = e1 ? await e1.boundingBox() : null;
				tried++;
				if (!b1 || Math.abs(b1.y - b0.y) > 2) {
					moved.push(i + ':' + (await page.evaluate((i) => { const c = Array.from(document.querySelectorAll('#lpn_setbox_content input[type=checkbox]')).filter((x) => x.offsetParent)[i]; const r = c && c.closest('div'); return r ? r.textContent.trim().slice(0, 24) : '?'; }, i)) + ' ' + Math.round(b0.y) + '->' + (b1 ? Math.round(b1.y) : 'gone'));
				}
			}
		}
		ok('every third checkbox in the box, ticked and cleared with the box scrolled to it (' + tried + ' clicks): none moves on screen', tried >= 20 && moved.length === 0, JSON.stringify(moved.slice(0, 8)));
		console.log('--- 7. a child scenario: a Presentation setting changed there makes its own alternative ---');
		// Tom, 2026-10-12: "when I changed presentation settings for a child called 'Fig 5: Pipe D, C,
		// and k', it didn't create a scenario [alternative]". The child inherited its parent's ticked
		// label, and clearing it wrote Base's own value (cleared) to the project, which the seam saw
		// as no change at all. Made here as Tom made it: a child of Fig 5 in the Scenario manager.
		await scenarioMenu(await L('lpn_sm_menu'));
		await a.settle(800);
		const smRow = (name) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name + '$') }) }).first();
		await smRow('Fig 5').locator('.lpn-sm-name').click();
		await a.settle(400);
		await page.evaluate(() => document.getElementById('lpn_sm_add').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await a.settle(500);
		await page.keyboard.press('Control+a');
		await page.keyboard.type('Fig 6');
		await page.keyboard.press('Enter');
		await a.settle(600);
		await smRow('Fig 6').locator('.lpn-sm-name').dblclick();
		await a.settle(1200);
		ok('Fig 6, a child of Fig 5, made current with a double-click', (await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent)).indexOf('Fig 6') >= 0);
		await openBox();
		const inherited = await rowOf(B);
		ok('Fig 6 inherits Fig 5\'s ticked "' + B + '" label, unmarked (it holds nothing of its own)', inherited.checked && !inherited.held, JSON.stringify(inherited));
		await clickBox(B);
		const own6 = await rowOf(B);
		ok('cleared in Fig 6: shows cleared, marked as Fig 6\'s override', !own6.checked && own6.held, JSON.stringify(own6));
		const file6 = await page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				let d = null;
				try { d = JSON.parse(localStorage.getItem(localStorage.key(i)) || 'null'); } catch (e) { d = null; }
				if (d && Array.isArray(d.scenarios) && d.scenarios.some((s) => s.name === 'Fig 6')) { return d; }
			}
			return null;
		});
		const s6 = file6 && file6.scenarios.filter((s) => s.name === 'Fig 6')[0];
		const alt6 = s6 && (file6.alternatives || []).filter((x) => x.id === (s6.alternatives || {}).presentation)[0];
		ok('...and Fig 6 now has its own Presentation alternative, named Fig 6, in the file, holding the cleared label',
			!!alt6 && alt6.name === 'Fig 6' && alt6.category === 'presentation' && alt6.settings.labelSettings.node[B] === false, JSON.stringify(alt6 || s6));
		await scenarioMenu('Fig 5');
		await openBox();
		ok('...while Fig 5 keeps its own ticked', (await rowOf(B)).checked);
		ok('no page error', errors.length === 0, JSON.stringify(errors.slice(0, 3)));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' false-override check(s) FAILED' : '\nSettings box false-override browser harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

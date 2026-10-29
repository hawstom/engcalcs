// EVERY DOOR THAT OPENS ONE BOX FROM ANOTHER REACHES A BOX THAT IS DOCKED AND AUTO-HIDDEN (Tom,
// 2026-10-26: in a pipe's Properties the "Pipe types" link did nothing while Libraries was docked
// and unpinned; "a general audit of this gap is needed to ensure that our entire app works
// cohesively with unpinned docked boxes").
//
// Net3 at 1600x1000 with the first-visit docks on (every default box is docked, auto-hidden and open
// but tucked at its edge tab). For each door the target is tucked first, the door is used the way a
// reader uses it, and the box must then be flown out: on screen, with size, with its section.
//   1. Properties > Pipe types and Fittings links open Libraries on that section.
//   2. Menu rows: Settings, Libraries, Find and replace, User manual, Analyze x3, Reports x5.
//   3. The Settings toolbar button and the Find toolbar button; the "?" key.
//   4. A box docked and PINNED is only raised, still on screen; a FLOATING box likewise.
//   5. The Scenario manager (docked and auto-hidden by the test) opens from its menu row.
//
//   node dev/lpn-spike/open-docked-browser-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_OPENDOCKED_BROWSER_LOCKED';
const NAME = 'open-docked-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });

// Visible to a reader: shown, not tucked, with size, and inside the window.
const seen = (a, id) => a.page.evaluate((i) => {
	const b = document.getElementById(i), r = b.getBoundingClientRect(), cs = getComputedStyle(b);
	const inside = r.width > 40 && r.height > 40 && r.left >= -2 && r.top >= -2 &&
		r.right <= window.innerWidth + 2 && r.bottom <= window.innerHeight + 2;
	return {
		shown: b.style.display !== 'none' && b.style.display !== '' && (cs.visibility !== 'hidden' || b.classList.contains('lpn-dock-collapsed')),
		out: b.classList.contains('lpn-dock-out'), tucked: b.classList.contains('lpn-dock-collapsed'),
		docked: b.classList.contains('lpn-docked'), inside,
		r: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]
	};
}, id);
const reader = (v, docked) => v.shown && v.inside && (!docked || v.out) && !v.tucked && !(docked && !v.docked);
// Press on bare map: tucks every flown-out box.
async function tuckAll(a) { await a.page.mouse.click(700, 800); await a.settle(500); }
async function corner(a, id, act) {
	// A tucked box has no buttons to press: point at its tab, as a reader does.
	const tab = await a.page.$('.lpn-dock-tab[aria-controls="' + id + '"]');
	if (tab && await tab.isVisible()) { await tab.hover(); await a.settle(700); }
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="' + act + '"]');
	await a.settle(400);
}
async function clickPipe(a) {
	const at = await a.page.evaluate(() => {
		const ls = Array.from(document.querySelectorAll('#lpn_canvas .lpn-link-hit')).filter((e) => { const r = e.getBoundingClientRect(); return Math.max(r.width, r.height) > 12; });
		for (const e of ls) {
			const p = e.getAttribute('points').trim().split(/[\s,]+/).map(Number), m = e.getScreenCTM();
			const x = (p[0] + p[2]) / 2, y = (p[1] + p[3]) / 2;
			const sx = m.a * x + m.c * y + m.e, sy = m.b * x + m.d * y + m.f;
			if (sx > 60 && sx < 1000 && sy > 150 && sy < 900 && (() => { const t = document.elementFromPoint(sx, sy); return t === e || (!!t && t.classList.contains('lpn-link-pipe')); })()) { return { x: sx, y: sy }; }
		}
		return null;
	});
	if (!at) { return false; }
	await a.page.mouse.click(at.x, at.y);
	await a.settle(700);
	return true;
}
async function visit(Session, browser, label, init) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport: { width: 1600, height: 1000 } });
	await a.context.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
	if (init) { await a.context.addInitScript(init); }
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await noConsent(a);
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	return a;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await visit(Session, browser, 'a', () => { try { localStorage.setItem('lpn_scnbasic', 'off'); } catch (e) {} });
		const L = (k) => a.lang(k).then((s) => s.trim());
		const state = await seen(a, 'lpn_library_box');
		ok('start: Libraries is docked, open and tucked', state.docked && state.shown && !state.out, JSON.stringify(state));

		// A door is: a name, the box it must show, how to get the box tucked again, how to use it.
		async function door(name, id, fire, section, floating) {
			await tuckAll(a);
			const before = await seen(a, id);
			await fire();
			await a.settle(700);
			const v = await seen(a, id);
			ok(name + ': ' + id + ' is visible, on screen and flown out', floating ? (v.shown && v.inside) : reader(v, true), JSON.stringify({ before: before.out, v }));
			if (section) {
				const sec = await section();
				ok(name + ': ...on the right section', sec === true, String(sec));
			}
			await a.page.keyboard.press('Escape');
			await tuckAll(a);
		}

		console.log('\n--- 1. Properties links into Libraries ---');
		ok('a pipe is selected (Properties opens)', await clickPipe(a));
		for (const [key, sec] of [['lpn_library_pipetypes', 'pipetypes'], ['lpn_library_fittings', 'fittings']]) {
			const label = await L(key);
			await clickPipe(a);
			// Libraries tucked, Properties flown out: use the link as a reader does.
			const tuckedLib = await a.page.evaluate(() => !document.getElementById('lpn_library_box').classList.contains('lpn-dock-out'));
			ok('before "' + label + '": Libraries is tucked', tuckedLib);
			const clicked = await a.page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_popup button.lpn-pane-goto')).find((x) => x.textContent.trim() === t);
				if (!b) { return false; }
				b.click();
				return true;
			}, label);
			ok('the "' + label + '" link is in Properties', clicked);
			await a.settle(700);
			const v = await seen(a, 'lpn_library_box');
			ok('"' + label + '" flies Libraries out, on screen', reader(v, true), JSON.stringify(v));
			const cur = await a.page.evaluate((s) => !!document.querySelector('#lpn_libbox_link_' + s + '[aria-current="true"]'), sec);
			ok('...on the ' + sec + ' section', cur);
			await tuckAll(a);
		}

		console.log('\n--- 2. menus ---');
		const settingsV = async () => (await seen(a, 'lpn_settings_box'));
		await door('Water > Settings', 'lpn_settings_box', async () => { await a.menuClick(await L('lpn_tool_settings'), 'project'); });
		await door('Water > Libraries', 'lpn_library_box', async () => { await a.menuClick(await L('lpn_library_menu'), 'project'); });
		await door('Edit > Find and replace', 'lpn_find_popup', async () => { await a.menuClick(await L('lpn_find_menu'), 'edit'); });
		await door('Help > User manual', 'lpn_hotkeys_popup', async () => { await a.menuClick(await L('lpn_help_manual'), 'help'); }, null, true);
		const analyze = await L('lpn_analyze_menu');
		for (const [k, id] of [['lpn_ff_menu', 'lpn_ff_box'], ['lpn_crit_menu', 'lpn_crit_box'], ['lpn_ds_menu', 'lpn_ds_box']]) {
			await door('Water > Analyze > ' + k, id, async () => { await a.menuClickSub(analyze, await L(k), 'project'); });
		}
		const reports = await L('lpn_reports_menu');
		for (const [k, id] of [['lpn_energy_menu', 'lpn_energy_box'], ['lpn_scncmp_title', 'lpn_scncmp_box'],
			['lpn_reports_status', 'lpn_status_box'], ['lpn_reports_calib', 'lpn_calib_box'], ['lpn_reports_full', 'lpn_full_box']]) {
			await door('Water > Reports > ' + k, id, async () => { await a.menuClickSub(reports, await L(k), 'project'); });
		}

		console.log('\n--- 3. toolbar buttons and the keyboard ---');
		await door('toolbar Settings', 'lpn_settings_box', async () => { await a.toolbarClick(await L('lpn_tool_settings')); });
		await door('toolbar Find', 'lpn_find_popup', async () => { await a.toolbarClick(await L('lpn_find_menu')); });
		await door('"?" key', 'lpn_hotkeys_popup', async () => { await a.page.mouse.move(700, 800); await a.page.keyboard.press('?'); }, null, true);

		console.log('\n--- 4. docked and pinned, and floating ---');
		await tuckAll(a);
		await corner(a, 'lpn_library_box', 'autohide');
		let v = await seen(a, 'lpn_library_box');
		ok('Libraries pinned: shown in its column', v.docked && v.shown && v.inside, JSON.stringify(v));
		await clickPipe(a);
		await a.page.evaluate((t) => Array.from(document.querySelectorAll('#lpn_popup button.lpn-pane-goto')).find((x) => x.textContent.trim() === t).click(), await L('lpn_library_pipetypes'));
		await a.settle(500);
		v = await seen(a, 'lpn_library_box');
		ok('pinned: the link leaves it shown and on screen', v.shown && v.inside && v.docked, JSON.stringify(v));
		ok('pinned: and on the Pipe types section', await a.page.evaluate(() => !!document.querySelector('#lpn_libbox_link_pipetypes[aria-current="true"]')));
		await corner(a, 'lpn_library_box', 'float');
		await tuckAll(a);
		await clickPipe(a);
		await a.page.evaluate((t) => Array.from(document.querySelectorAll('#lpn_popup button.lpn-pane-goto')).find((x) => x.textContent.trim() === t).click(), await L('lpn_library_fittings'));
		await a.settle(500);
		v = await seen(a, 'lpn_library_box');
		ok('floating: the link leaves it shown, with its title band on screen (a floating box may overhang)', v.shown && !v.docked && v.r[0] < 1500 && v.r[1] >= 0 && v.r[1] < 900, JSON.stringify(v));
		ok('floating: and on the Fittings section', await a.page.evaluate(() => !!document.querySelector('#lpn_libbox_link_fittings[aria-current="true"]')));

		console.log('\n--- 5. a box the reader docked and unpinned: the Scenario manager ---');
		await a.menuClickSub(await L('lpn_scenario_menu'), await L('lpn_sm_menu'), 'project');
		await a.settle(600);
		await corner(a, 'lpn_sm_box', 'right');
		await corner(a, 'lpn_sm_box', 'autohide');
		await tuckAll(a);
		v = await seen(a, 'lpn_sm_box');
		ok('Scenario manager is docked, open and tucked', v.docked && v.shown && !v.out, JSON.stringify(v));
		await door('Water > Scenarios > Scenario manager', 'lpn_sm_box', async () => {
			await a.menuClickSub(await L('lpn_scenario_menu'), await L('lpn_sm_menu'), 'project');
		});
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (failures ? failures + ' of ' + checks + ' FAILED' : 'all ' + checks + ' passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

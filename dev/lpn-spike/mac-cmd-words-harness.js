// SAY CMD, NOT CTRL, TO A MAC READER (Task 713).
//   node dev/lpn-spike/mac-cmd-words-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Loads Looped-Network.php twice, once with the platform spoofed as a Mac and once as Windows.
// Mac: no "Ctrl" is left in the Notes and Shortcuts boxes or on the table right-click menu's
// accelerators, "Cmd" is there, and the genuine Ctrl+Option chord is untouched. Windows: nothing changes.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MACCMD_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('mac-cmd-words-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

async function probe(browser, Session, platform, tag) {
	const a = await Session.open(browser, 'mac-cmd-' + tag);
	await a.page.addInitScript((p) => {
		Object.defineProperty(navigator, 'platform', { get: () => p });
		Object.defineProperty(navigator, 'userAgentData', { get: () => undefined });
	}, platform);
	await a.goto('Looped-Network.php');
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(800);
	const boxes = await a.page.evaluate(() => ['lpn_notes_popup', 'lpn_hotkeys_popup'].map((id) => {
		const e = document.getElementById(id); return e ? e.textContent : '';
	}).join('\n'));
	// Open the Tables pane on Junctions, then right-click a cell.
	await a.page.evaluate(() => {
		const b = document.getElementById('lpn_pane_btn');
		if (b && b.getAttribute('aria-pressed') !== 'true') { b.click(); }
	});
	await a.settle(300);
	await a.page.evaluate(() => document.getElementById('lpn_pane_tab_junctions').click());
	await a.settle(400);
	const menu = await a.page.evaluate(() => {
		const td = document.querySelector('#lpn_pane_body td, #lpn_pane td');
		if (!td) { return null; }
		const r = td.getBoundingClientRect();
		td.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 2, clientY: r.top + 2 }));
		return Array.from(document.querySelectorAll('.lpn-pane-ctxmenu-accel')).map((s) => s.textContent);
	});
	const terrain = await a.page.evaluate(() => EngCalcs.macWords('One Undo (Ctrl-Z) puts every one of them back.'));
	await a.page.close().catch(() => {});
	return { boxes, menu, terrain };
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
		const mac = await probe(browser, Session, 'MacIntel', 'mac');
		const stripped = mac.boxes.replace(/Ctrl\+Option/g, '');
		ok('Mac: boxes carry Cmd', /Cmd\+C/.test(mac.boxes) && /Cmd\+D/.test(mac.boxes));
		ok('Mac: no Ctrl left in the boxes (Ctrl+Option excepted)', !/Ctrl/.test(stripped), (stripped.match(/.{15}Ctrl.{10}/) || [''])[0]);
		ok('Mac: Ctrl+Option chord kept', /Ctrl\+Option/.test(mac.boxes));
		ok('Mac: right-click menu opened', !!mac.menu && mac.menu.length > 0, JSON.stringify(mac.menu));
		ok('Mac: menu accelerators say Cmd', !!mac.menu && mac.menu.length > 0 && mac.menu.every((t) => /^Cmd\+/.test(t)), JSON.stringify(mac.menu));
		ok('Mac: terrain Undo sentence', mac.terrain === 'One Undo (Cmd-Z) puts every one of them back.', mac.terrain);

		const win = await probe(browser, Session, 'Win32', 'win');
		ok('Windows: boxes still say Ctrl', /Ctrl\+C/.test(win.boxes) && !/Cmd/.test(win.boxes));
		ok('Windows: menu accelerators say Ctrl', !!win.menu && win.menu.length > 0 && win.menu.every((t) => /^Ctrl\+/.test(t)), JSON.stringify(win.menu));
		ok('Windows: terrain sentence unchanged', win.terrain === 'One Undo (Ctrl-Z) puts every one of them back.');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? 'FAILED: ' + fails : 'ALL OK');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

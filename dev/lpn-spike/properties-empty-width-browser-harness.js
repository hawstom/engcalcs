// THE EMPTY PROPERTIES BOX'S MESSAGE SPANS THE BOX (Tom, 2026-11-08: "I am seeing an issue with an empty
// Properties box sometimes after an asset is selected and then Esc."). "Nothing is selected..." wrapped one
// word per line in the property grid's narrow label column. After a pipe, a junction, docked and floating,
// by Escape and by a click on the empty map, the message is at most a few lines and about as wide as the box.
//   node dev/lpn-spike/properties-empty-width-browser-harness.js    (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_PEW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_PEW_LOCKED: '1' }) });
		if (r.status === 75) { console.error('properties-empty-width-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		const L = (k) => a.lang(k);
		const settle = (ms) => a.settle(ms);
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.goto('Looped-Network.php');
		await a.openNet1Plain(await L('lpn_ex_net1_title'));
		await settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const none = await L('lpn_popup_none');
		const tool = async (k) => L('lpn_tool_add_' + k);
		const hit = async (sel) => {
			const b = await (await page.$(sel)).boundingBox();
			await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
			await settle(500);
		};
		const node = async (id) => { await page.keyboard.press('Escape'); return hit('.lpn-node-hit[data-node="' + id + '"]'); };
		const link = async (id) => { await page.keyboard.press('Escape'); return hit('#lpn_canvas .lpn-link-hit[data-link="' + id + '"]'); };
		const emptyClick = async () => {
			const e = await page.evaluate(() => {
				const c = document.getElementById('lpn_canvas').getBoundingClientRect();
				for (let y = c.top + 60; y < c.bottom - 60; y += 25) {
					for (let x = c.left + 60; x < c.right - 60; x += 25) {
						const el = document.elementFromPoint(x, y);
						if (el && (el.id === 'lpn_canvas' || (el.closest('#lpn_canvas') && !/hit|lpn-node|lpn-link|symbol|label|text/.test(String(el.getAttribute('class') || '') + el.tagName)))) { return { x, y }; }
					}
				}
				return null;
			});
			await page.mouse.click(e.x, e.y);
			await settle(600);
		};
		const esc = async () => {
			await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await page.keyboard.press('Escape');
			await settle(600);
		};
		// the message's own box against the box it sits in
		const measure = () => page.evaluate((none) => {
			const f = document.getElementById('lpn_popup_fields'), p = f && f.querySelector('.lpn-popup-none');
			const box = document.getElementById('lpn_popup');
			if (!p || box.style.display === 'none') { return null; }
			const r = p.getBoundingClientRect(), fr = f.getBoundingClientRect();
			const lh = parseFloat(getComputedStyle(p).lineHeight) || (parseFloat(getComputedStyle(p).fontSize) * 1.3);
			return { w: Math.round(r.width), fieldsW: Math.round(fr.width), lines: Math.round(r.height / lh), text: p.textContent === none };
		}, none);
		const check = async (label) => {
			const m = await measure();
			ok(label + ': the message shows', !!m && m.text, JSON.stringify(m));
			if (m) {
				ok(label + ': it spans the box (at least 80% of the fields area)', m.w >= m.fieldsW * 0.8, m.w + ' of ' + m.fieldsW);
				ok(label + ': it takes four lines or fewer', m.lines <= 4, m.lines + ' lines');
			}
		};
		await node('22');
		await page.click('#lpn_popup .lpn-corner-btn[data-dock="right"]');
		await settle(500);

		console.log('--- docked ---');
		await node('21'); await esc(); if (!(await measure())) { await esc(); }
		await check('docked, junction, Escape');
		await link('10'); await esc(); if (!(await measure())) { await esc(); }
		await check('docked, pipe, Escape');
		await link('10'); await emptyClick();
		await check('docked, pipe, empty-map click');
		await node('21'); await emptyClick();
		await check('docked, junction, empty-map click');

		console.log('--- floating ---');
		await node('21');
		await page.click('#lpn_popup .lpn-corner-btn[data-dock="float"]');
		await settle(500);
		await link('10'); await esc();
		const m1 = await measure();
		ok('floating, pipe, Escape: the box closes or shows a message that spans it', m1 === null || (m1.w >= m1.fieldsW * 0.8 && m1.lines <= 4), JSON.stringify(m1));
		await link('10'); await emptyClick();
		const m2 = await measure();
		ok('floating, pipe, empty-map click: the box closes or shows a message that spans it', m2 === null || (m2.w >= m2.fieldsW * 0.8 && m2.lines <= 4), JSON.stringify(m2));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

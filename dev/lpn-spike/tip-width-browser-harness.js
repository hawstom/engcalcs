// A TIP IS WIDE, NOT TALL (Tom, 2026-10-04, on Ida's tip audit). Bootstrap caps a tooltip at
// 200 px, so a long tip became a column taller than half the window. css/engcalcs.css raises the
// cap to 17rem, never wider than the viewport less a gutter. Real headless Chrome, because the
// width is what the browser lays out, not what the stylesheet says.
//
//   node dev/lpn-spike/tip-width-browser-harness.js
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
const path = require('path');
const env = require('../browser-pass/lib/env');
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
// Show the longest tip on the page and measure what the browser drew.
async function measure(page) {
	return page.evaluate(() => {
		const els = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"], [data-bs-original-title], [title]'))
			.filter((e) => (e.getAttribute('data-bs-original-title') || e.getAttribute('title') || '').length > 0);
		els.sort((a, b) => (b.getAttribute('data-bs-original-title') || b.getAttribute('title')).length -
			(a.getAttribute('data-bs-original-title') || a.getAttribute('title')).length);
		const el = els[0];
		const words = (el.getAttribute('data-bs-original-title') || el.getAttribute('title')).split(/\s+/).length;
		const t = window.bootstrap.Tooltip.getOrCreateInstance(el, { trigger: 'manual', animation: false });
		t.show();
		return new Promise((res) => setTimeout(() => {
			const inner = document.querySelector('.tooltip .tooltip-inner');
			const r = inner ? inner.getBoundingClientRect() : null;
			res({ words, w: r ? r.width : -1, h: r ? r.height : -1, vw: window.innerWidth });
		}, 200));
	});
}
async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (e) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		for (const vp of [{ width: 1440, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'phone' }]) {
			const page = await (await browser.newContext({ viewport: { width: vp.width, height: vp.height } })).newPage();
			await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
			await page.waitForSelector('#lpn_menu_project');
			await page.waitForTimeout(300);
			const m = await measure(page);
			ok(vp.name + ': the longest tip (' + m.words + ' words) was drawn', m.w > 0, JSON.stringify(m));
			if (vp.name === 'desktop') {
				ok('desktop: wider than the old 200 px cap', m.w > 250, m.w);
				ok('desktop: no wider than 17rem', m.w <= 272.5, m.w);
				ok('desktop: no taller than half the window (it stood 554 px at the old cap)', m.h < vp.height / 2, m.h);
			} else {
				ok('phone: never wider than the screen less a gutter', m.w <= m.vw - 32 + 0.5, m.w + ' of ' + m.vw);
			}
			await page.close();
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

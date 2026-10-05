// THE TIME-STEP SELECTOR CLEARS ITS ARROW WHEN THE LONGEST STEP IS 9:59 (Tom, 2026-10-05):
// "The Animation controls time step selector has the down arrow in conflict with the time when the
// longest time step is 9:59. Solution, make the minimum length approx. the same as when it's past
// 10:00." Real Chromium, because the width is what the browser lays out. Run with:
//   node dev/lpn-spike/step-select-width-browser-harness.js
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
if (process.env.EC_STEPW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_STEPW_LOCKED: '1' }) });
		if (r.status === 75) { console.error('step-select-width-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
// Put the given labels in the page's own step selector, then measure what the browser drew.
// Clearance = room between the widest label's text and the arrow's left edge (Bootstrap draws the
// arrow in a 16px box at right .5rem; that is what the right padding has to leave free).
function measure(page, labels, zoomFont) {
	return page.evaluate((a) => {
		const sel = document.getElementById('lpn_time_step');
		if (a.fontPx) { sel.style.fontSize = a.fontPx + 'px'; }
		while (sel.firstChild) { sel.removeChild(sel.firstChild); }
		a.labels.forEach((t) => { const o = document.createElement('option'); o.textContent = t; sel.appendChild(o); });
		const cs = getComputedStyle(sel), rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const ctx = document.createElement('canvas').getContext('2d');
		ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
		const textW = Math.max.apply(null, a.labels.map((t) => ctx.measureText(t).width));
		const r = sel.getBoundingClientRect();
		const arrowLeft = r.width - 0.5 * rem - 16;
		const textRight = parseFloat(cs.paddingLeft) + textW + parseFloat(cs.borderLeftWidth);
		const bar = sel.parentElement.getBoundingClientRect();
		return { w: r.width, clearance: arrowLeft - textRight, barRight: bar.right, selRight: r.right, vw: window.innerWidth,
			docOverflow: document.documentElement.scrollWidth > window.innerWidth };
	}, { labels: labels, fontPx: zoomFont });
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
		for (const vp of [{ width: 1440, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'phone' }]) {
			for (const fontPx of [0, 20]) {
				const s = await Session.open(browser, 'A', { viewport: { width: vp.width, height: vp.height } });
				await s.goto('Looped-Network.php');
				await s.settle(1200);
				// The player is not drawn for a steady-state project, so open one with an extended period.
				await s.page.evaluate(() => {
					const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
					(cards.find((c) => /Net1/.test(c.textContent || '')) || cards[0]).click();
				});
				await s.settle(2500);
				const tag = vp.name + (fontPx ? ' at a larger font' : '') + ': ';
				const short = await measure(s.page, ['0:00', '3:00', '9:59'], fontPx);
				const longer = await measure(s.page, ['0:00', '9:59', '10:00'], fontPx);
				console.log('   9:59 case', JSON.stringify(short), '\n   10:00 case', JSON.stringify(longer));
				ok(tag + 'text clears the arrow when the longest step is 9:59', short.clearance >= 1, short.clearance.toFixed(1) + 'px');
				ok(tag + 'text clears the arrow when the longest step is 10:00', longer.clearance >= 1, longer.clearance.toFixed(1) + 'px');
				ok(tag + 'the 9:59 box is no narrower than the 10:00 box less a pixel', short.w >= longer.w - 1,
					short.w.toFixed(1) + ' vs ' + longer.w.toFixed(1));
				if (!fontPx) {
					ok(tag + 'the page does not scroll sideways', !short.docOverflow);
					ok(tag + 'the selector stays inside the viewport', short.selRight <= short.vw, short.selRight + ' of ' + short.vw);
				}
				await s.context.close().catch(() => {});
			}
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\nstep-select-width: ' + fails + ' FAILED' : '\nstep-select-width: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

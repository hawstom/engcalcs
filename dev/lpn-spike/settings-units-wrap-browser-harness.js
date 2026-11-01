// SETTINGS > UNITS: A VALUE TOO LONG FOR ITS COLUMN NEVER RUNS OVER THE NEXT ROW (Tom, round 11).
// The derived Map coordinates value is plain text in a fixed-height row; a long one ("Pie topografico
// de EE. UU.") wrapped to a second line and sat on the Diametro select. Settings' own convention is one
// line, clipped with an ellipsis, the full text in the tip. Real Chromium, ?lang=es and en, a 600 px
// docked-width box and a 390 phone: every row of the Units fields clears the row below it, and the
// derived value is one line, ellipsised, with its text as the tip.
//   node dev/lpn-spike/settings-units-wrap-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SUW_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], { stdio: 'inherit', env: Object.assign({}, process.env, { EC_SUW_LOCKED: '1' }) });
		if (r.status === 75) { console.error('settings-units-wrap-browser-harness: NOT RUN -- browser lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) { checks++; if (!cond) { fails++; } console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const lang of ['es', 'en']) {
			for (const vp of [{ w: 1200, h: 800, box: 600 }, { w: 1200, h: 800, box: 440 }, { w: 1200, h: 800, box: 260 }, { w: 390, h: 844, box: 0 }]) {
				const a = await Session.open(browser, 'A');
				const page = a.page;
				await page.setViewportSize({ width: vp.w, height: vp.h });
				await page.goto(env.pageUrl('Looped-Network.php?lang=' + lang), { waitUntil: 'load' });
				await a.settle(1500);
				await a.openExampleCard(await a.lang('lpn_ex_net2_title'));
				await a.settle(1200);
				await page.evaluate(() => { let e = document.querySelector('.ec-consent-actions'); while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; } if (e) { e.style.display = 'none'; } });
				if (vp.w < 500) { await a.menuClick(await a.lang('lpn_tool_settings'), 'project'); } else { await a.toolbarClick(await a.lang('lpn_tool_settings')); }
				await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
				await a.settle(600);
				const m = await page.evaluate((arg) => {
					const box = document.getElementById('lpn_settings_box');
					if (arg.box) { box.style.width = arg.box + 'px'; }
					const d = document.getElementById('lpn_u_mapcoords');
					// WHAT TOM SAW, BEFORE ANY OVERRIDE: Net2 is in a US survey foot plane, so the page itself writes the
					// value ("Pie topografico de EE. UU." in Spanish). The Map coordinates row must end above the next row.
					const real = d.textContent, mrow = d.closest('.lpn-set-row'), vis = Array.from(document.querySelectorAll('#lpn_set_units_fields .lpn-set-row')).filter((r) => r.offsetParent), nxt = vis[vis.indexOf(mrow) + 1];
					const rg = document.createRange(); rg.selectNodeContents(d);
					// The element is a fixed 21 px tall, so a wrapped value overflows IT and the element's own rect never shows it: measure the text.
					const realGap = nxt ? Math.round((nxt.getBoundingClientRect().top - Math.max(mrow.getBoundingClientRect().bottom, rg.getBoundingClientRect().bottom)) * 10) / 10 : null, realText = real;
					d.textContent = 'Pie topografico de EE. UU. con un nombre muy largo';
					d.title = d.textContent;
					d.scrollIntoView({ block: 'center' });
					const rows = Array.from(document.querySelectorAll('#lpn_set_units_fields .lpn-set-row')).filter((r) => r.offsetParent);
					const bad = [];
					for (let i = 0; i + 1 < rows.length; i++) { const x = rows[i].getBoundingClientRect(), y = rows[i + 1].getBoundingClientRect(); if (x.bottom > y.top + 1) { bad.push(i); } }
					const dr = d.getBoundingClientRect(), cs = getComputedStyle(d);
					const row = d.closest('.lpn-set-row').getBoundingClientRect();
					return { realText, realGap, n: rows.length, bad, h: dr.height, lh: parseFloat(cs.lineHeight), clipped: d.scrollWidth > d.clientWidth, ell: cs.textOverflow, ws: cs.whiteSpace, tip: d.title, inside: dr.bottom <= row.bottom + 1 };
				}, vp);
				const tag = lang + ' ' + vp.w + 'px: ';
				ok(tag + 'the real Map coordinates value is the page\'s own (' + m.realText + ')', lang !== 'es' || /EE\. UU\./.test(m.realText), m.realText);
				ok(tag + 'the Map coordinates row\'s bottom is at or above the next row\'s top', m.realGap !== null && m.realGap >= -1, String(m.realGap));
				ok(tag + 'the Units rows exist', m.n >= 5, m.n);
				ok(tag + 'no Units row overlaps the next', m.bad.length === 0, JSON.stringify(m.bad));
				ok(tag + 'the derived value is one line, ellipsised', m.h <= m.lh + 2 && m.ell === 'ellipsis' && m.ws === 'nowrap' && m.clipped && m.inside, JSON.stringify(m));
				ok(tag + 'the full text is its tip', m.tip.length > 20);
				await a.close && a.close();
			}
		}
		console.log('settings-units-wrap-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
}
main().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });

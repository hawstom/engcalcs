// A box title that is too long for its bar is clipped at the left edge of the first control beside it, never under it
// (Tom, 2026-11-01: truncate, no ellipsis, no tip on cut text, nothing hover-only). Shared style `.lpn-setbox-title`.
// For every box that has a title row, in en, es and de, forced to its minimum width: with the controls hidden, the strip of
// the title bar that lies under the controls holds no text ink (a pixel test, so it sees what is drawn, not what a rectangle says),
// and the title's text-overflow is not ellipsis. A sanity case proves the test can see ink: the same strip with a clip-less title.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BTITLE_LOCKED';
const NAME = 'box-title-clip-browser-harness';
const SHOTS = process.env.EC_SHOTS || '';
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
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const lang of ['en', 'es', 'de']) {
			console.log('--- ' + lang + ' ---');
			const S = await Session.open(browser, NAME + '-' + lang, { viewport: { width: 1280, height: 900 } });
			const P = S.page;
			await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await S.goto('Looped-Network.php?ec_nolog=1&lang=' + lang);
			await S.answerTrainingPanel().catch(() => {});
			await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await S.settle(1500);
			const ids = await P.evaluate(() => Array.from(document.querySelectorAll('.lpn-setbox-title')).map((t) => t.parentElement).filter((b) => b && b.id).map((b) => b.id));
			ok(lang + ': boxes with a title row found', ids.length >= 8, String(ids.length));
			for (const wpx of [1, 230]) for (const id of ids) {
				// Show the box at its minimum width, controls hidden, and report the strip under the controls.
				const g = await P.evaluate(([boxId, wpx]) => {
					const b = document.getElementById(boxId), t = b.querySelector(':scope > .lpn-setbox-title');
					b.style.cssText += ';display:block;visibility:visible;position:fixed;left:20px;top:100px;width:' + wpx + 'px;height:auto;right:auto;transform:none;z-index:99999';
					const ctl = Array.from(b.querySelectorAll(':scope > .lpn-box-corner button, :scope > .lpn-popover-x, :scope > button')).filter((e) => e.getBoundingClientRect().width > 0);
					const tr = t.getBoundingClientRect();
					let left = Infinity;
					ctl.forEach((e) => { const r = e.getBoundingClientRect(); if (r.left < left) { left = r.left; } });
					left = Math.max(left, tr.left);
					ctl.forEach((e) => { e.style.visibility = 'hidden'; });
					const cs = getComputedStyle(t), rg = document.createRange();
					rg.selectNodeContents(t);
					// Where does the text want to reach, versus where the controls begin.
					const textRight = rg.getBoundingClientRect().right;
					return { w: Math.round(tr.width), left: left, right: tr.right, top: tr.top, textRight: textRight, ellipsis: cs.textOverflow === 'ellipsis', n: ctl.length, text: t.textContent.trim().slice(0, 40) };
				}, [id, wpx]);
				if (!isFinite(g.left) || g.right - g.left < 3) { ok(lang + ' ' + id + ' @' + (wpx === 1 ? 'min' : wpx) + ': no control inside the bar to clash with', true, g.n + ' controls, bar ' + g.w + ' px'); continue; }
				const png = await P.screenshot({ path: SHOTS ? path.join(SHOTS, 'strip-' + lang + '-' + id + '.png') : undefined, clip: { x: Math.floor(g.left) + 2, y: Math.floor(g.top) + 2, width: Math.max(1, Math.floor(g.right - g.left) - 4), height: 34 } });
				const ink = await P.evaluate(async (b64) => {
					const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
					const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
					const x = c.getContext('2d'); x.drawImage(img, 0, 0);
					const d = x.getImageData(0, 0, c.width, c.height).data, seen = {};
					let best = 0, r0 = 0, g0 = 0, b0 = 0;
					for (let i = 0; i < d.length; i += 4) { const k = d[i] + ',' + d[i + 1] + ',' + d[i + 2]; seen[k] = (seen[k] || 0) + 1; if (seen[k] > best) { best = seen[k]; r0 = d[i]; g0 = d[i + 1]; b0 = d[i + 2]; } }
					let n = 0;
					for (let i = 0; i < d.length; i += 4) { if (Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) > 60) { n++; } }
					return n;
				}, png.toString('base64'));
				const cut = g.textRight > g.left;
				ok(lang + ' ' + id + ' @' + (wpx === 1 ? 'min' : wpx) + ' (' + g.w + ' px, "' + g.text + '"' + (cut ? ', text reaches the controls' : '') + '): no text ink under the controls, no ellipsis', ink === 0 && !g.ellipsis, ink + ' ink pixels' + (g.ellipsis ? ', ELLIPSIS' : ''));
				if (SHOTS && cut && lang === 'es') { await P.screenshot({ path: path.join(SHOTS, 'boxtitle-' + id + '.png'), clip: { x: 0, y: 90, width: 400, height: 60 } }); }
				await P.evaluate((boxId) => { const b = document.getElementById(boxId); b.style.display = 'none'; b.querySelectorAll('button').forEach((e) => { e.style.visibility = ''; }); }, id);
			}
			ok(lang + ': no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + checks + ' checks, ' + failures + ' failures');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

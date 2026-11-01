// BOX LABEL WRAP (Task 852; Tom, 2026-11-01: cut text needs a way to reveal; wrapping; "label rows two lines max"; no ellipsis; no tip on a cut cell).
// Real Chromium, Settings (Units, Labels and every other row), English and Spanish:
//   1. PC 1366 x 768, Settings at its default width: no name is cut -- every name fits within two lines;
//   2. phone 390 x 844, touch: "Head loss gradient" in Units is fully shown;
//   3. nowhere does a name show an ellipsis or carry a tip that only repeats its words; in English none needs a third line;
//      in Spanish a few of the longest (at most SPANISH_CUT_MAX) still lose a tail after two lines -- they are listed, not hidden;
//   4. a box narrower than the two column floors scrolls its content pane sideways (PC, 300 px).
//   With BOX852_SHOTS=<prefix> it saves screenshots to /home/haws/webdev/worktrees/_panel/www/img/<prefix>-*.png.
//
//   node dev/lpn-spike/box-label-wrap-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'box-label-wrap-browser-harness';
const SPANISH_CUT_MAX = 10;   // Ida's forecast: the longest Spanish names can need 3 or 4 lines at 184 px; measured 7 on 2026-11-01
const SHOTS = process.env.BOX852_SHOTS || '';
const IMG = '/home/haws/webdev/worktrees/_panel/www/img/';
if (process.env.EC_BLW_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_BLW_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// Every visible name cell of Settings: lines used by its text, whether the cell shows all of it, ellipsis, tip.
function names(page) {
	return page.evaluate(() => {
		const box = document.getElementById('lpn_settings_box');
		const cells = new Set();
		box.querySelectorAll('.lpn-set-row > :first-child, .lpn-set-name').forEach((c) => cells.add(c));
		const out = { n: 0, tall: [], cut: [], third: [], ellipsis: [], tipped: [], hgl: [] };
		cells.forEach((c) => {
			if (!c.getClientRects().length) { return; }
			const words = c.textContent.replace(/\s*\?\s*$/, '').replace(/\s+/g, ' ').trim();
			if (!words) { return; }
			out.n++;
			const cs = getComputedStyle(c), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
			const lines = Math.round(c.scrollHeight / lh);
			const cutNow = c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1;
			if (cutNow) { out.cut.push(words.slice(0, 40)); }
			if (c.clientHeight > 2 * lh + 1) { out.tall.push(words.slice(0, 40)); }
			if (lines > 2) { out.third.push(words.slice(0, 40) + ' (' + lines + ')'); }
			if (cs.textOverflow === 'ellipsis') { out.ellipsis.push(words.slice(0, 40)); }
			const tip = [c, c.querySelector('label'), c.querySelector('span')].filter(Boolean).map((x) => (x.getAttribute('data-bs-original-title') || x.title || '').replace(/\s+/g, ' ').trim());
			if (cutNow && tip.indexOf(words) >= 0) { out.tipped.push(words.slice(0, 40)); }
			if (/^Head loss gradient|^Gradiente de p/.test(words)) { out.hgl.push({ words, cut: cutNow, lines, w: Math.round(c.getBoundingClientRect().width) }); }
		});
		return out;
	});
}
async function open(browser, Session, label, viewport, touch, lang) {
	const a = await Session.open(browser, NAME + '-' + label, Object.assign({ viewport }, touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}));
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1200);
	await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
	await a.settle(900);
	return a;
}
async function shot(a, what, id) {
	if (!SHOTS) { return; }
	await a.page.evaluate((i) => { const e = document.getElementById(i); if (e) { e.scrollIntoView(); } }, id);
	await a.settle(300);
	await a.page.screenshot({ path: IMG + SHOTS + '-' + what + '.png' });
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
		for (const lang of [null, 'es']) {
			const L = lang || 'en';
			console.log('\n--- pc ' + L + ' (1366 x 768), default width ---');
			const a = await open(browser, Session, 'pc-' + L, { width: 1366, height: 768 }, false, lang);
			await a.page.evaluate(() => document.getElementById('lpn_set_units_fields').scrollIntoView());
			await a.settle(200);
			const m = await names(a.page);
			console.log('  ' + m.n + ' names; cut: ' + m.cut.length + (m.cut.length ? ' e.g. ' + m.cut.slice(0, 3).join(' | ') : ''));
			ok('pc ' + L + ': names were found', m.n > 40, String(m.n));
			if (lang) { console.log('  still cut after two lines: ' + m.cut.join(' | ')); }
			ok('pc ' + L + ': ' + (lang ? 'at most ' + SPANISH_CUT_MAX + ' names are cut' : 'no Settings name is cut') + ' at the default width', lang ? m.cut.length <= SPANISH_CUT_MAX : m.cut.length === 0, m.cut.slice(0, 4).join(' | '));
			ok('pc ' + L + ': no name cell is taller than two lines', m.tall.length === 0, m.tall.slice(0, 3).join(' | '));
			ok('pc ' + L + ': no ellipsis, no tip that only repeats a cut name', m.ellipsis.length === 0 && m.tipped.length === 0, m.ellipsis.concat(m.tipped).slice(0, 3).join(' | '));
			await shot(a, 'pc-' + L + '-units', 'lpn_set_units_fields');
			await a.page.evaluate(() => { const e = document.getElementById('lpn_labels_link_fields'); if (e) { e.scrollIntoView(); } });
			await a.settle(200);
			await shot(a, 'pc-' + L + '-labels', 'lpn_labels_link_fields');
			// A box narrower than the two column floors scrolls its pane sideways; nothing is clipped without a way to reach it.
			await a.page.evaluate(() => document.getElementById('lpn_settings_box').style.setProperty('width', '300px', 'important'));
			await a.settle(300);
			const nar = await a.page.evaluate(() => { const c = document.getElementById('lpn_setbox_content'); return { sw: c.scrollWidth, cw: c.clientWidth, ox: getComputedStyle(c).overflowX }; });
			ok('pc ' + L + ': at 300 px the pane scrolls sideways rather than clipping a name', nar.sw > nar.cw + 1 && (nar.ox === 'auto' || nar.ox === 'scroll'), JSON.stringify(nar));
			const mn = await names(a.page);
			console.log('  at 300 px ' + mn.third.length + ' names need more than two lines and are clipped after the second');
			ok('pc ' + L + ': at 300 px no ellipsis', mn.ellipsis.length === 0);
			await a.close();
		}
		for (const lang of [null, 'es']) {
			const L = lang || 'en';
			console.log('\n--- phone ' + L + ' (390 x 844) ---');
			const p = await open(browser, Session, 'phone-' + L, { width: 390, height: 844 }, true, lang);
			await p.page.evaluate(() => document.getElementById('lpn_set_units_fields').scrollIntoView());
			await p.settle(300);
			const m = await names(p.page);
			console.log('  ' + m.n + ' names; cut: ' + m.cut.length + (m.cut.length ? ' e.g. ' + m.cut.slice(0, 4).join(' | ') : '') + '; head loss gradient: ' + JSON.stringify(m.hgl));
			ok('phone ' + L + ': the Units "Head loss gradient" name is fully shown', m.hgl.length > 0 && m.hgl.every((h) => !h.cut), JSON.stringify(m.hgl));
			if (lang) { console.log('  still cut after two lines: ' + m.cut.join(' | ')); }
			ok('phone ' + L + ': ' + (lang ? 'at most ' + SPANISH_CUT_MAX + ' names are cut' : 'no name is cut'), lang ? m.cut.length <= SPANISH_CUT_MAX : m.cut.length === 0, m.cut.slice(0, 4).join(' | '));
			ok('phone ' + L + ': no name cell is taller than two lines', m.tall.length === 0, m.tall.slice(0, 3).join(' | '));
			ok('phone ' + L + ': no ellipsis, no tip that only repeats a cut name', m.ellipsis.length === 0 && m.tipped.length === 0);
			await shot(p, 'phone-' + L + '-units', 'lpn_set_units_fields');
			await p.page.evaluate(() => { const e = document.getElementById('lpn_labels_link_fields'); if (e) { e.scrollIntoView(); } });
			await p.settle(300);
			await shot(p, 'phone-' + L + '-labels', 'lpn_labels_link_fields');
			await p.close();
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));

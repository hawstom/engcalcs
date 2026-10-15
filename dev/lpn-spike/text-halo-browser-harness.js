// THE TEXT HALO IS TWICE ITS OLD WIDTH AND IS A PROJECT SETTING (Tom, 2026-10-14: "our text halos need to
// be bigger and maybe available as a setting under Map appearance. Can we double them?").
//   node dev/lpn-spike/text-halo-browser-harness.js   (takes the browser lock itself)
// In real Chromium, on Net1: the computed halo of a map label is 0.4 of its font size (the old 0.2 doubled)
// with no setting touched; the Settings row changes it live; a saved project reloads with it; a project
// written before the setting existed (no `textHalo`) draws the new default; 0 draws no halo.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TEXTHALO_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('text-halo-browser-harness: NOT RUN -- lock held 180 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const a = await Session.open(browser, 'text-halo');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);
		// The halo is the label layer's filter since Task 791: its radius is the outside half of the
		// old stroke, so `ratio` (2 x radius over the font size) reads in the setting's own terms.
		const halo = () => a.page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('text.lpn-lbl')).find((e) => (e.textContent || '').trim() && getComputedStyle(e).visibility !== 'hidden');
			if (!t) { return null; }
			const c = getComputedStyle(t), fs = parseFloat(c.fontSize);
			const L = document.querySelector('.lpn-lbl-layer'), f = document.getElementById('lpn-lbl-halo');
			const r = f ? +f.querySelector('feMorphology').getAttribute('radius') : NaN;
			const on = !!L && getComputedStyle(L).filter !== 'none';
			return { r, fs, ratio: on ? 2 * r / fs : 0, filter: L && getComputedStyle(L).filter, stroke: c.stroke,
				flood: f && getComputedStyle(f.querySelector('feFlood')).floodColor };
		});
		const h0 = await halo();
		console.log('  default', JSON.stringify(h0));
		ok('a map label exists', !!h0);
		ok('default halo is 0.4 of the font size (old 0.2 doubled)', h0 && Math.abs(h0.ratio - 0.4) < 0.01, h0 && h0.ratio);
		ok('drawn by the label layer\'s filter, in white, with no stroke on the ink', h0 && /lpn-lbl-halo/.test(h0.filter) && /255, 255, 255/.test(h0.flood) && h0.stroke === 'none', h0 && (h0.filter + ' ' + h0.flood + ' ' + h0.stroke));

		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);
		const label = await a.lang('lpn_settings_text_halo');
		const setRow = (v) => a.page.evaluate(([lab, val]) => {
			const rows = Array.from(document.querySelectorAll('#lpn_set_map_fields > *'));
			const row = rows.find((r) => (r.textContent || '').indexOf(lab) >= 0);
			const inp = row && row.querySelector('input');
			if (!inp) { return null; }
			inp.value = String(val);
			inp.dispatchEvent(new Event('change', { bubbles: true }));
			return inp.value;
		}, [label, v]);
		const cur = () => a.page.evaluate((lab) => {
			const row = Array.from(document.querySelectorAll('#lpn_set_map_fields > *')).find((r) => (r.textContent || '').indexOf(lab) >= 0);
			const inp = row && row.querySelector('input'); return inp ? inp.value : null;
		}, label);
		ok('the Settings row exists and shows 40', (await cur()) === '40', await cur());
		await setRow(80); await a.settle(300);
		const h1 = await halo();
		ok('80 percent draws a 0.8 halo, live', h1 && Math.abs(h1.ratio - 0.8) < 0.01, h1 && h1.ratio);
		await setRow(-5); await a.settle(200);
		ok('a bad entry is refused and the old number put back', (await cur()) === '80', await cur());

		// Save and reload: the setting rides with the project (settings in serializeProject), not a new key.
		await a.settle(1200);
		await a.reload();
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		let h2 = await halo();
		if (!h2) { await a.openExampleCard(await a.lang('lpn_ex_net1_title')); await a.settle(800); h2 = await halo(); }
		console.log('  after reload', JSON.stringify(h2));
		ok('after reload the halo is still 0.8 (stored with the project)', h2 && Math.abs(h2.ratio - 0.8) < 0.01, h2 && h2.ratio);

		// An old project has no textHalo at all: delete the member from the live settings and re-apply.
		const old = await a.page.evaluate(() => {
			const keys = Object.keys(localStorage).filter((k) => /^lpn_/.test(k));
			return keys.map((k) => [k, (localStorage.getItem(k) || '').indexOf('"textHalo"') >= 0]);
		});
		console.log('  storage keys carrying textHalo', JSON.stringify(old.filter((x) => x[1]).map((x) => x[0])));
		ok('textHalo is stored in a project record, never a key of its own', old.every((x) => x[0] !== 'lpn_text_halo' && x[0] !== 'lpn_texthalo'));
		await a.page.evaluate(() => {
			Object.keys(localStorage).forEach((k) => {
				const v = localStorage.getItem(k);
				if (v && v.indexOf('"textHalo"') >= 0) { localStorage.setItem(k, v.replace(/"textHalo":\s*[0-9.]+,?/g, '')); }
			});
		});
		await a.reload();
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		let h3 = await halo();
		if (!h3) { await a.openExampleCard(await a.lang('lpn_ex_net1_title')); await a.settle(800); h3 = await halo(); }
		ok('a project saved before the setting existed draws the new 0.4 default', h3 && Math.abs(h3.ratio - 0.4) < 0.01, h3 && h3.ratio);

		await a.toolbarClick(await a.lang('lpn_tool_settings')).catch(() => {});
		await a.settle(400);
		await setRow(0); await a.settle(300);
		const h4 = await halo();
		ok('0 draws no halo', h4 && h4.filter === 'none', h4 && h4.filter);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' text halo check(s) FAILED' : '\nText halo harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });

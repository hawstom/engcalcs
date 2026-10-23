// THE RAMP'S DARKEST CLASS STAYS VISIBLE ON A DARK PAPER (Task 811; dev/themes-plan.md), in a real Chromium.
//   node dev/lpn-spike/theme-ramp-casing-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-ramp-casing-browser-harness.js    also saves a picture per theme
//
// WHAT IT PROVES, colouring the links by Velocity and the nodes by Pressure on Net1, in every theme:
//   1. A drawn class or legend swatch that is under 3:1 against the map's paper is cased (`.lpn-ramp-cased`) in a
//      theme that states `--ec-map-casing` (Dark, High contrast's dark palette, Amber, Green, Arcade, Space), and
//      the casing colour itself is at least 3:1 against that paper. Its fill is unchanged (the stop is not lifted).
//   2. The legend's darkest swatch is among them, on every dark paper.
//   3. In every light-paper theme nothing is cased: no class, no filter, no changed border (Light draws what it did).
//   4. Switching theme with the colouring on re-marks the map without a new solve.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_THEME_RAMP_LOCKED';
const NAME = 'theme-ramp-casing-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}


let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const SHOTS = process.env.EC_THEME_SHOTS || '';
if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); }
const DARK = ['dark', 'hc-dark', 'amber', 'green', 'arcade', 'space'];

function readMap() {
	const parse = (x) => { const m = /rgba?\(([^)]+)\)/.exec(x); return m ? m[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(parseFloat) : null; };
	const lum = (q) => { const f = q.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
	const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
	const num = (x) => { const m = /(-?[\d.]+(?:e-?\d+)?)/.exec(x); return m ? parseFloat(m[1]) : 0; };
	const svg = document.getElementById('lpn_canvas'), cs = getComputedStyle(svg);
	const tmp = document.createElement('i'); document.body.appendChild(tmp);
	const rgb = (c) => { tmp.style.color = c; return parse(getComputedStyle(tmp).color); };
	const paper = rgb(cs.getPropertyValue('--ec-map-paper')), casingTok = cs.getPropertyValue('--ec-map-casing').trim();
	const out = { casingTok, casingVsPaper: null, lines: 0, wrong: 0, cased: 0, filterOn: 0, swatches: 0, swWrong: 0, swCased: 0, darkestSwCased: null, darkestSwRatio: null, swBorderVsPaper: null };
	if (casingTok && casingTok !== 'none') { out.casingVsPaper = ratio(rgb(casingTok), paper); }
	svg.querySelectorAll('polyline.lpn-link').forEach((el) => {
		const st = el.style.stroke; if (!st) { return; }
		out.lines++;
		const halo = el.previousElementSibling.previousElementSibling;   // halo, hit, line
		const low = ratio(rgb(st), paper) < 3, has = halo.classList.contains('lpn-ramp-cased'), want = low && out.casingVsPaper !== null;
		if (has !== want) { out.wrong++; }
		if (has) { out.cased++; if (getComputedStyle(halo).stroke !== 'none' && ratio(rgb(getComputedStyle(halo).stroke), paper) >= 3 && num(getComputedStyle(halo).strokeWidth) > num(getComputedStyle(el).strokeWidth)) { out.filterOn++; } }
	});
	out.junctionsWrong = 0; out.junctionsCased = 0;
	svg.querySelectorAll('circle.lpn-node').forEach((el) => {
		if (!el.style.color) { return; }
		const low = ratio(rgb(el.style.color), paper) < 3, has = el.classList.contains('lpn-ramp-cased');
		if (has !== (low && out.casingVsPaper !== null)) { out.junctionsWrong++; }
		if (has) { out.junctionsCased++; }
	});
	const sw = Array.from(document.querySelectorAll('#lpn_color_legend .lpn-color-swatch'));
	out.swatches = sw.length;
	sw.forEach((el) => {
		const low = ratio(parse(getComputedStyle(el).backgroundColor), paper) < 3, has = el.classList.contains('lpn-ramp-cased');
		if (has !== (low && out.casingVsPaper !== null)) { out.swWrong++; }
		if (has) { out.swCased++; }
	});
	// The darkest swatch: least luminous fill in the legend.
	let dk = null;
	sw.forEach((el) => { const l = lum(parse(getComputedStyle(el).backgroundColor)); if (!dk || l < dk.l) { dk = { l, el }; } });
	if (dk) {
		out.darkestSwCased = dk.el.classList.contains('lpn-ramp-cased');
		out.darkestSwRatio = ratio(parse(getComputedStyle(dk.el).backgroundColor), paper);
		out.swBorderVsPaper = ratio(parse(getComputedStyle(dk.el).borderTopColor), paper);
	}
	tmp.remove();
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const s = await Session.open(browser, 'ramp', { colorScheme: 'light' });
		await s.goto('Looped-Network.php');
		await s.page.click('.ec-consent-btn').catch(() => {});
		await s.openExampleCard(await s.lang('lpn_ex_net1_title'));
		await s.settle(1200);
		await s.toolbarClick(await s.lang('lpn_tool_settings'));
		await s.settle(400);
		await s.page.evaluate(() => {
			const n = document.getElementById('lpn_set_color_node'), l = document.getElementById('lpn_set_color_link');
			n.value = 'pressure'; n.dispatchEvent(new Event('change', { bubbles: true }));
			l.value = 'velocity'; l.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await s.settle(500);
		await s.page.keyboard.press('Escape');
		await s.settle(300);
		const themes = (await s.page.evaluate(() => window.ecTheme.list)).filter((t) => t !== 'system');
		for (const t of themes) {
			await s.page.evaluate((x) => window.ecTheme.set(x), t);
			await s.settle(700);
			const r = await s.page.evaluate(readMap);
			const dark = DARK.indexOf(t) >= 0;
			console.log('\n--- ' + t + (dark ? ' (dark paper)' : '') + ' ---');
			ok(t + ': links and legend are drawn', r.lines > 0 && r.swatches > 0, r.lines + ' links, ' + r.swatches + ' swatches');
			if (dark) {
				ok(t + ': a casing is stated and is 3:1 against the paper', r.casingVsPaper !== null && r.casingVsPaper >= 3, String(r.casingVsPaper && r.casingVsPaper.toFixed(2)));
				ok(t + ': the legend\'s darkest swatch is cased (its own fill ' + (r.darkestSwRatio && r.darkestSwRatio.toFixed(2)) + ':1 on the paper)', r.darkestSwCased === true);
				ok(t + ': that swatch\'s outline is 3:1 against the paper', r.swBorderVsPaper >= 3, String(r.swBorderVsPaper && r.swBorderVsPaper.toFixed(2)));
				ok(t + ': every drawn class under 3:1 is cased, and no other (links ' + r.cased + ' cased)', r.wrong === 0 && r.swWrong === 0, 'wrong ' + r.wrong + '/' + r.swWrong);
				ok(t + ': a cased link\'s halo is drawn in the casing, 3:1 on the paper, wider than the pipe', r.filterOn === r.cased && r.cased > 0);
				ok(t + ': junctions agree too (' + r.junctionsCased + ' cased)', r.junctionsWrong === 0);
			} else {
				ok(t + ': nothing is cased on a light paper', r.casingVsPaper === null && r.cased === 0 && r.junctionsCased === 0 && r.swCased === 0 && r.wrong === 0 && r.swWrong === 0, 'casing ' + r.casingTok);
			}
			if (SHOTS) { await s.page.screenshot({ path: path.join(SHOTS, 'ramp-' + t + '.png') }); }
		}
		// Preview (the gallery's pointer) re-marks too.
		await s.page.evaluate(() => window.ecTheme.set('light'));
		await s.settle(500);
		await s.page.evaluate(() => window.ecTheme.preview('arcade'));
		await s.settle(500);
		const p = await s.page.evaluate(readMap);
		ok('previewing Arcade over Light re-marks the map', p.casingVsPaper >= 3 && p.swCased > 0 && p.swWrong === 0);
		await s.page.evaluate(() => window.ecTheme.preview(null));
		await s.settle(500);
		const q = await s.page.evaluate(readMap);
		ok('and putting Light back clears it', q.cased === 0 && q.swCased === 0 && q.junctionsCased === 0);
		await s.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + ' / ' + checks + ' ok' + (fails ? ', ' + fails + ' FAILED' : ''));
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

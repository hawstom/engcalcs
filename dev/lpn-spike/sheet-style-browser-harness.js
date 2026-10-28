// THE STANDARD SPREADSHEET STYLE, AND PULL-DOWNS THAT STAY READABLE IN DARK, IN A REAL BROWSER. Run with:
//   node dev/lpn-spike/sheet-style-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-27: "I love it! Make this a standard style and apply it to Find and Replace, Contour Plot, Fire flow
// analysis, Criticality analysis, and Demand analysis" (Properties' borderless rows; no heading over the Label and Value
// cells); and "The invisibility in Dark mode bug hit again for all selectors ... use global styles". At 1366 x 768:
//   S1  Properties and each of the five boxes: every row stands in the one `lpn-sheet` grid, and none of its
//       text boxes, number boxes or pull-downs has a border of its own (a toggle stays a checkbox);
//   S2  none of them has a heading over the Label and Value cells (no `lpn-ghdr`, no "Label"/"Value"/"Property");
//   S3  the divider is still there for a run of rows, and a double-click on it is harmless;
//   S4  an editable cell and a computed value are told apart (computed is in the muted ink);
//   D1  in every theme the page offers that is dark, the choices of every pull-down in Properties and the five boxes
//       (the "Edit types...", "Edit fittings...", "Edit curves..." ones among them) have an opaque background and
//       ink contrasting at least 3 : 1, and so does the pull-down itself against what it stands on;
//   D2  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHEETSTYLE_LOCKED';
const NAME = 'sheet-style-browser-harness';
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
const { openBox } = require('./dock-boxes.js');
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const BOXES = ['lpn_find_popup', 'lpn_contour_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	const errors = [];
	// What a box's controls look like: borders, rows, headings, divider, ink.
	const inspect = (page, id) => page.evaluate((rootSel) => {
		const root = document.querySelector(rootSel), out = { rows: 0, notSheet: 0, bordered: [], headings: 0, headingText: [], splits: 0, controls: 0 };
		if (!root) { return { missing: true }; }
		Array.from(root.querySelectorAll('.lpn-grow')).forEach((r) => {
			if (r.classList.contains('lpn-gspan-row') || r.classList.contains('lpn-fill-row') || !r.querySelector('.lpn-gname')) { return; }
			if (r.getBoundingClientRect().width === 0 && getComputedStyle(r).display !== 'contents') { return; }
			out.rows++;
			if (!r.closest('.lpn-sheet')) { out.notSheet++; }
		});
		Array.from(root.querySelectorAll('.lpn-grow > input, .lpn-grow > select, .lpn-grow > textarea')).forEach((c) => {
			if (c.type === 'checkbox' || c.type === 'radio' || c.type === 'hidden' || c.getBoundingClientRect().width === 0) { return; }
			out.controls++;
			const cs = getComputedStyle(c);
			if (['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none')) { out.bordered.push(c.id || c.tagName + ':' + (c.type || '')); }
		});
		out.headings = root.querySelectorAll('.lpn-ghdr, .lpn-ghcell').length;
		Array.from(root.querySelectorAll('.lpn-gname')).forEach((n) => { if (/^(Label|Value|Property)$/.test(n.textContent.trim()) && n.closest('.lpn-ghdr')) { out.headingText.push(n.textContent.trim()); } });
		out.splits = Array.from(root.querySelectorAll('.lpn-gsplit')).filter((s) => getComputedStyle(s).display !== 'none').length;
		return out;
	}, '#' + id);
	// Contrast of every option and of the select itself, in the current theme.
	const contrast = (page, rootSel) => page.evaluate((sel) => {
		function rgba(s) { const m = (s.match(/[\d.]+/g) || [0, 0, 0, 0]).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; }
		function lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
		function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
		function under(el) {   // the first opaque paper behind an element
			for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c.a >= 1) { return c; } }
			return rgba(getComputedStyle(document.documentElement).backgroundColor);
		}
		const out = { selects: 0, options: 0, bad: [] };
		Array.from(document.querySelectorAll(sel + ' select')).forEach((s) => {
			if (s.getBoundingClientRect().width === 0) { return; }
			out.selects++;
			const cs = getComputedStyle(s), own = rgba(cs.backgroundColor), paper = own.a >= 1 ? own : under(s), ink = rgba(cs.color);
			if (cr(ink, paper) < 3) { out.bad.push('select ' + (s.id || '') + ' ink ' + cs.color + ' on ' + paper.r + ',' + paper.g + ',' + paper.b); }
			Array.from(s.options).forEach((o) => {
				out.options++;
				const oc = getComputedStyle(o), bg = rgba(oc.backgroundColor), oi = rgba(oc.color);
				if (bg.a < 1 || cr(oi, bg) < 3) { out.bad.push('option "' + o.textContent + '" bg ' + oc.backgroundColor + ' ink ' + oc.color + ' ' + cr(oi, bg).toFixed(1)); }
			});
		});
		return out;
	}, rootSel);
	try {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1366, height: 768 });
		await a.settle(2500);

		async function openPipe() {
			const p = await page.evaluate(() => {
				const el = Array.from(document.querySelectorAll('#lpn_canvas [data-link="10"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
				const r = el.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		}
		const closeBox = (id) => page.evaluate((i) => { const b = document.querySelector('#' + i + ' .lpn-popover-x, #' + i + ' [id$="_close"]'); if (b) { b.click(); } }, id);
		const all = [['lpn_popup', 'Properties']].concat(BOXES.map((b) => [b, b]));

		console.log('\n--- the style (S1-S4) ---');
		await openPipe();
		for (const [id, label] of all) {
			if (id !== 'lpn_popup') { await openBox(a, id); await a.settle(600); }
			const m = await inspect(page, id);
			ok('S1 ' + label + ': ' + m.rows + ' rows, all in the sheet grid; ' + m.controls + ' text boxes and pull-downs, none bordered', !m.missing && m.rows >= 1 && m.notSheet === 0 && m.controls >= 1 && m.bordered.length === 0, JSON.stringify(m.bordered.concat(m.notSheet ? ['notSheet=' + m.notSheet] : [])));
			ok('S2 ' + label + ': no heading over the Label and Value cells', !m.missing && m.headings === 0 && m.headingText.length === 0, JSON.stringify({ n: m.headings, t: m.headingText }));
			if (m.rows >= 2) { ok('S3 ' + label + ': the divider stands in the Label column', m.splits >= 1, String(m.splits)); }
			if (id !== 'lpn_popup') { await closeBox(id); await a.settle(250); }
		}
		// S4 editable and computed differ in ink: a computed value in Properties (a pipe's Flow) is muted, a typed one is not.
		const ink = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields');
			const ed = f ? Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval[type="text"], .lpn-grow > input.lpn-gval[type="number"]')).filter((e) => e.getBoundingClientRect().width > 0)[0] : null;
			const ro = f ? Array.from(f.querySelectorAll('.lpn-grow > span.lpn-gval:not(.lpn-gw-num)')).filter((e) => e.getBoundingClientRect().width > 0)[0] : null;
			return { ed: ed ? getComputedStyle(ed).color : null, ro: ro ? getComputedStyle(ro).color : null };
		});
		ok('S4 Properties: a computed value is drawn in a different (muted) ink from an editable cell', !!ink.ed && (!ink.ro || ink.ro !== ink.ed), JSON.stringify(ink));

		console.log('\n--- Dark and every other theme (D1) ---');
		await openPipe();
		for (const id of BOXES) { await openBox(a, id); await a.settle(400); }
		const themes = await page.evaluate(() => window.ecTheme.list.slice());
		ok('D0 the page offers several themes', themes.length >= 5, themes.join(','));
		let darkSeen = 0;
		for (const th of themes) {
			await page.evaluate((t) => window.ecTheme.preview(t), th);
			await a.settle(250);
			const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
			const dark = /dark/.test(scheme);
			if (dark) { darkSeen++; }
			let n = 0, bad = [];
			for (const sel of ['#lpn_popup'].concat(BOXES.map((b) => '#' + b))) {
				const r = await contrast(page, sel);
				n += r.options; bad = bad.concat(r.bad);
			}
			ok('D1 theme ' + th + (dark ? ' (dark)' : '') + ': ' + n + ' options and their pull-downs read at 3 : 1 or better', n > 0 && bad.length === 0, JSON.stringify(bad.slice(0, 3)));
		}
		ok('D1 the list holds at least one dark theme', darkSeen >= 1, String(darkSeen));
		ok('D2 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

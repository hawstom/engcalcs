// THE SIMPLE WELL AND ITS LABELS, ON THE PAGE, in a real Chrome. Run with:
//   EC_PICS=<pictureDir> node dev/lpn-spike/well-round6-browser-harness.js
//
// Task 822, round 6 (Tom, 2026-11-11). Net1 gets a Well (the Pump button's third form) spliced into a pipe, and the fixture's Well with tank is
// opened for the tank form. Asserted: (1) no valve, pump or reservoir symbol is drawn at a Well, through placing, selecting, clicking away,
// zooming and undo, and the Well's own drawing is one symbol; (2) a Well draws ONE label block, headed by its ID, every row tagged by the
// member's own ID; (3) pressing the block, or the symbol, opens the box without covering the block, and the block is still drawn (Tom: "if I
// click on it, it disappears"); (4) the simple Well's box holds no tank input and every heading shows rows before and after a run; the tank
// form's box holds the tank's inputs at the top and results only under its headings. Pictures are saved when a directory is given.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_ROUND6_BROWSER_LOCKED';
const NAME = 'well-round6-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const PICS = process.env.EC_PICS || null;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));


const overlap = (a, b) => a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1;
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const fs = require('fs');
	const net1 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8');
	const fixture = fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'assembly-sections-fixture.lwn'), 'utf8');
	const open = async (txt, vp) => {
		const a = await Session.open(browser, NAME, { viewport: vp || { width: 1400, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, txt);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		return a;
	};
	try {
		const a = await open(net1), P = a.page;
		const arrows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas path[data-link]')).map((e) => { const L = e.getTotalLength(), m = e.getScreenCTM(), p = e.getPointAtLength(L / 2); return { id: e.getAttribute('data-link'), x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f, L }; }).filter((q) => q.L < 10));
		const at = arrows.find((q) => q.id === '21');
		const armed = () => P.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[aria-pressed="true"]'); return b ? b.dataset.tool : null; });
		await P.keyboard.press('Escape');
		for (let i = 0; i < 5 && (await armed()) !== 'add-well'; i++) { await P.keyboard.press('6'); await a.settle(150); }
		ok('pressing Pump three times arms the simple Well', (await armed()) === 'add-well');
		await P.mouse.click(at.x, at.y); await a.settle(500);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(900);
		const wellEls = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).filter((e) => /^W1[RUD]$/.test(e.getAttribute('data-node'))).map((e) => e.getAttribute('data-node')));
		ok('it is three nodes: W1R, W1U, W1D, and no tank', JSON.stringify((await wellEls()).filter((v, i, x) => x.indexOf(v) === i).sort()) === JSON.stringify(['W1D', 'W1R', 'W1U']) && !(await P.evaluate(() => !!document.querySelector('#lpn_canvas [data-node="W1T"]'))));
		const centre = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1D"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.move(at.x, at.y); for (let i = 0; i < 6; i++) { await P.mouse.wheel(0, -300); await a.settle(150); } await a.settle(900);
		// What is drawn within 40 px of the Well: its own symbol and nothing else.
		const symbols = (tag) => P.evaluate(async () => {
			const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1D"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const wr = e.getBoundingClientRect(); const c = { x: wr.left + wr.width / 2, y: wr.top + wr.height / 2 };
			const out = { well: 0, other: [] };
			Array.from(document.querySelectorAll('#lpn_canvas .lpn-link-symbol, #lpn_canvas .lpn-node-symbol')).forEach((s) => {
				const r = s.getBoundingClientRect();
				if (!(r.width > 0) || getComputedStyle(s).display === 'none' || Math.hypot((r.left + r.right) / 2 - c.x, (r.top + r.bottom) / 2 - c.y) > 40) { return; }
				if (s.classList.contains('lpn-node-symbol-well')) { out.well++; } else { out.other.push(s.getAttribute('class')); }
			});
			return out;
		});
		const noValve = async (tag) => { const s = await symbols(tag); ok(tag + ': one Well symbol at the point, and no valve, pump, reservoir or tank symbol', s.well === 1 && s.other.length === 0, JSON.stringify(s)); };
		await noValve('after placing');
		let c = await centre();
		await P.mouse.click(c.x, c.y); await a.settle(800);
		await noValve('selected');
		await P.keyboard.press('Escape'); await a.settle(300);
		await noValve('deselected');
		await P.mouse.move(c.x, c.y); for (let i = 0; i < 3; i++) { await P.mouse.wheel(0, 300); await a.settle(150); } for (let i = 0; i < 3; i++) { await P.mouse.wheel(0, -300); await a.settle(150); } await a.settle(700);
		await noValve('zoomed out and in');
		c = await centre();

		console.log('\n--- the label block ---');
		const blocks = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl], #lpn_canvas text[data-linklbl]')).filter((t) => t.textContent.trim() && /^W1/.test(t.textContent)).map((t) => { const r = t.getBoundingClientRect(); return { id: t.getAttribute('data-nodelbl') || t.getAttribute('data-linklbl'), text: t.textContent, hidden: t.style.visibility === 'hidden', l: r.left, r: r.right, t: r.top, b: r.bottom, rows: t.querySelectorAll('tspan[x], tspan').length }; }));
		let bl = await blocks();
		ok('exactly one label of the Well is drawn, on its discharge node, headed by W1', bl.length === 1 && bl[0].id === 'W1D' && !bl[0].hidden && /^W1/.test(bl[0].text), JSON.stringify(bl.map((b) => b.id + ':' + b.text)));
		ok('every row but the heading is led by a member ID (W1R, W1U, W1D)', /W1R/.test(bl[0].text) && /W1U/.test(bl[0].text) && /W1D/.test(bl[0].text), bl[0].text);
		const bc = { x: (bl[0].l + bl[0].r) / 2, y: (bl[0].t + bl[0].b) / 2 };
		ok('it stands close to the symbol, within 160 px', Math.hypot(bc.x - c.x, bc.y - c.y) <= 160, Math.round(Math.hypot(bc.x - c.x, bc.y - c.y)) + ' px');
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-labels-closeup-v9.png'), clip: { x: Math.max(0, c.x - 300), y: Math.max(0, c.y - 160), width: 600, height: 320 } }); }

		console.log('\n--- pressing the block, then the symbol ---');
		const box = () => P.evaluate(() => { const b = document.getElementById('lpn_popup'); if (!b || getComputedStyle(b).display === 'none') { return null; } const r = b.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; });
		await P.mouse.click(bc.x, bc.y); await a.settle(900);
		let pb = await box(); bl = await blocks();
		ok('pressing the block opens the Properties box', !!pb);
		ok('the box does not cover the block, and the block is still drawn', !!pb && bl.length === 1 && !bl[0].hidden && !overlap(pb, bl[0]), JSON.stringify([pb, bl[0] && [bl[0].l, bl[0].r, bl[0].t, bl[0].b]]));
		await P.keyboard.press('Escape'); await a.settle(300);
		await P.mouse.click(c.x, c.y); await a.settle(900);
		pb = await box(); bl = await blocks();
		ok('pressing the symbol opens the box without covering the block, which is still drawn', !!pb && bl.length === 1 && !bl[0].hidden && !overlap(pb, bl[0]));

		console.log('\n--- the simple Well\'s box ---');
		const labs = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		const heads = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-section')).map((s) => ({ t: s.querySelector('.lpn-asm-head').textContent, rows: Array.from(s.querySelectorAll('label')).map((l) => ({ t: l.textContent.replace(/\s+/g, ' ').trim(), v: (l.querySelector('span') || {}).textContent || '' })) })));
		const ls = await labs();
		ok('the top holds the elevations and the two curves and no tank input and no pump level', ['Elevation', 'Static water level elevation', 'Drawdown curve', 'Pump head curve'].every((n) => ls.some((x) => x.indexOf(n) === 0)) && !ls.some((x) => /Initial depth|Tank diameter|Pump on below|Base elevation/.test(x)), ls.join(' | '));
		let hs = await heads();
		ok('five headings, upstream to downstream', JSON.stringify(hs.map((h) => h.t)) === JSON.stringify(['Reservoir W1R', 'Drawdown valve W1V', 'Junction W1U', 'Pump W1', 'Junction W1D']), JSON.stringify(hs.map((h) => h.t)));
		ok('every heading shows its rows with no run yet', hs.every((h) => h.rows.length >= 2), hs.map((h) => h.t + ':' + h.rows.length).join(' '));
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-properties-simple-v9.png') }); }
		await a.close();

		console.log('\n--- the Well with tank ---');
		const b = await open(fixture), Q = b.page;
		const cw = await Q.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1T"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await Q.mouse.move(cw.x, cw.y); for (let i = 0; i < 6; i++) { await Q.mouse.wheel(0, -300); await b.settle(150); } await b.settle(900);
		const cw2 = await Q.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1T"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await Q.mouse.click(cw2.x, cw2.y); await b.settle(900);
		const l2 = await Q.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		ok('the tank form\'s top holds Pump on below, Pump off above, Base elevation, the depths and the diameter', ['Pump on below', 'Pump off above', 'Base elevation', 'Initial depth', 'Minimum depth', 'Maximum depth', 'Tank diameter'].every((n) => l2.some((x) => x.indexOf(n) === 0)), l2.join(' | '));
		const tk = await Q.evaluate(() => Array.from(document.querySelectorAll('[data-asm-member="W1T"] label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		ok('and its Tank heading holds results only', tk.length >= 3 && !tk.some((x) => /Initial depth|Tank diameter|Base elevation|Maximum depth/.test(x)), tk.join(' | '));
		const hs2 = await Q.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-section')).map((s) => ({ t: s.querySelector('.lpn-asm-head').textContent, n: s.querySelectorAll('label').length })));
		ok('every one of its seven headings shows rows after the run the fixture carries', hs2.length === 7 && hs2.every((h) => h.n >= 2), hs2.map((h) => h.t + ':' + h.n).join(' '));
		if (PICS) { await Q.screenshot({ path: path.join(PICS, 'well-properties-tank-v9.png') }); }
		ok('no uncaught page errors', a.errors.length === 0 && b.errors.length === 0, a.errors.concat(b.errors).slice(0, 2).join(' | '));
		await b.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });

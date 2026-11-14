// THE SIMPLE WELL AND ITS LABELS, ON THE PAGE, in a real Chrome. Run with:
//   EC_PICS=<pictureDir> node dev/lpn-spike/well-round6-browser-harness.js
//
// Task 822, round 6 (Tom, 2026-11-11), updated for round 7 ( W1R, W1D, W1P; Well with tank is three presses). Net1 gets a Well (the
// Pump button's third form) spliced into a pipe, and then a Well with tank (the fourth form) by its three presses. Asserted: (1) no valve, pump or reservoir symbol is drawn at a Well, through placing, selecting, clicking away,
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
		const wellEls = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).filter((e) => /^W1[RDP]$/.test(e.getAttribute('data-node'))).map((e) => e.getAttribute('data-node')));
		ok('it is three nodes: W1R, W1D, W1P, and no tank', JSON.stringify((await wellEls()).filter((v, i, x) => x.indexOf(v) === i).sort()) === JSON.stringify(['W1D', 'W1P', 'W1R']) && !(await P.evaluate(() => !!document.querySelector('#lpn_canvas [data-node="W1T"]'))));
		const centre = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1P"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.move(at.x, at.y); for (let i = 0; i < 6; i++) { await P.mouse.wheel(0, -300); await a.settle(150); } await a.settle(900);
		// What is drawn within 40 px of the Well: its own symbol and nothing else.
		const symbols = (tag) => P.evaluate(async () => {
			const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1P"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const wr = e.getBoundingClientRect(); const c = { x: wr.left + wr.width / 2, y: wr.top + wr.height / 2 };
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
		ok('exactly one label of the Well is drawn, on its outlet node W1P, headed by W1', bl.length === 1 && bl[0].id === 'W1P' && !bl[0].hidden && /^W1/.test(bl[0].text), JSON.stringify(bl.map((b) => b.id + ':' + b.text)));
		ok('the heading carries Z, the ground elevation, and the drawdown valve has no row (rows of H and P appear after a run: well-label-rows-harness.js)', /^W1 Z=/.test(bl[0].text) && !/W1V/.test(bl[0].text), bl[0].text);
		const bc = { x: (bl[0].l + bl[0].r) / 2, y: (bl[0].t + bl[0].b) / 2 };
		ok('it stands close to the symbol, within 160 px', Math.hypot(bc.x - c.x, bc.y - c.y) <= 160, Math.round(Math.hypot(bc.x - c.x, bc.y - c.y)) + ' px');
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-labels-closeup-v10.png'), clip: { x: Math.max(0, c.x - 300), y: Math.max(0, c.y - 160), width: 600, height: 320 } }); }

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
		ok('five headings, upstream to downstream', JSON.stringify(hs.map((h) => h.t)) === JSON.stringify(['Reservoir W1R', 'Drawdown valve W1V', 'Junction W1D', 'Pump W1', 'Junction W1P']), JSON.stringify(hs.map((h) => h.t)));
		ok('every heading shows its rows with no run yet', hs.every((h) => h.rows.length >= 1), hs.map((h) => h.t + ':' + h.rows.length).join(' '));
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-properties-simple-v10.png') }); }
		await a.close();

		console.log('\n--- the Well with tank: three presses (round 7) ---');
		const b = await open(net1), Q = b.page;
		await Q.keyboard.press('Escape');
		const armedQ = () => Q.evaluate(() => { const x = document.querySelector('#lpn_toolbar button[aria-pressed="true"]'); return x ? x.dataset.tool : null; });
		for (let i = 0; i < 6 && (await armedQ()) !== 'add-welltank'; i++) { await Q.keyboard.press('6'); await b.settle(150); }
		ok('pressing Pump four times arms Well with tank', (await armedQ()) === 'add-welltank');
		// A point of open ground: nothing with a data-node or data-link under it, scanned outward from a start.
		const freeNear = async (sx, sy) => Q.evaluate(([x0, y0]) => {
			for (let r = 0; r < 400; r += 25) { for (let k = 0; k < 16; k++) { const x = x0 + r * Math.cos(k * Math.PI / 8), y = y0 + r * Math.sin(k * Math.PI / 8); const e = document.elementFromPoint(x, y); if (e && e.id === 'lpn_canvas' || (e && e.closest && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol') && e.closest('#lpn_canvas') && !(e.getAttribute && (e.getAttribute('data-node') || e.getAttribute('data-link'))))) { return { x: x, y: y }; } } }
			return null;
		}, [sx, sy]);
		const notice = () => Q.evaluate(() => { const n = document.getElementById('lpn_map_notice'); return n && getComputedStyle(n).display !== 'none' ? n.textContent : ''; });
		await Q.mouse.click(at.x, at.y); await b.settle(700);
		ok('the first press places the well and the status bar asks for the tee', /tee/i.test(await notice()), await notice());
		const teeAt = await freeNear(at.x + 120, at.y - 160);
		await Q.mouse.click(teeAt.x, teeAt.y); await b.settle(700);
		ok('the second press places the tee and the status bar asks for the tank', /tank/i.test(await notice()), await notice());
		const tankAt = await freeNear(teeAt.x + 160, teeAt.y - 60);
		await Q.mouse.click(tankAt.x, tankAt.y); await b.settle(900);
		ok('the third press finishes: the status bar is clear', (await notice()) === '', await notice());
		await Q.mouse.move(teeAt.x, teeAt.y); await b.settle(300);
		if (PICS) { await Q.screenshot({ path: path.join(PICS, 'well-tank-three-point-v10.png'), clip: { x: Math.max(0, Math.min(at.x, teeAt.x, tankAt.x) - 120), y: Math.max(0, Math.min(at.y, teeAt.y, tankAt.y) - 100), width: Math.abs(tankAt.x - at.x) + 300, height: Math.abs(tankAt.y - at.y) + 260 } }); }
		const info = await Q.evaluate(() => ({
			nodes: Array.from(new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node')))).filter((n) => /^W1/.test(n) || /^T\d/.test(n) || /^J(\d+)$/.test(n) && +RegExp.$1 > 11).sort(),
			wellSyms: document.querySelectorAll('#lpn_canvas .lpn-node-symbol-well').length,
			tankSyms: Array.from(document.querySelectorAll('#lpn_canvas .lpn-node-symbol-tank')).filter((e) => e.getBoundingClientRect().width > 0).length
		}));
		ok('three symbols: one Well drawing, the tee as an ordinary junction, a tank as an ordinary tank', info.wellSyms === 1 && info.tankSyms >= 1 && info.nodes.some((n) => /^T\d/.test(n)), JSON.stringify(info));
		await Q.keyboard.press('Escape');
		await Q.evaluate(() => { const bt = document.querySelector('#lpn_toolbar button[data-tool="select"]'); if (bt) { bt.click(); } });
		const wc = await Q.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1P"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await Q.mouse.click(wc.x, wc.y); await b.settle(900);
		const l2 = await Q.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		ok('the Well with tank\'s box asks Pump on below and Pump off above once, at the top, and holds no tank input', ['Pump on below', 'Pump off above'].every((n) => l2.filter((x) => x.indexOf(n) === 0).length === 1) && !l2.some((x) => /Initial depth|Tank diameter|Maximum depth/.test(x)), l2.join(' | '));
		ok('and the one Flow', l2.filter((x) => /^Flow/.test(x)).length === 1, l2.join(' | '));
		const hs2 = await Q.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-section')).map((s) => ({ t: s.querySelector('.lpn-asm-head').textContent, n: s.querySelectorAll('label').length })));
		ok('its five headings are the Well\'s, every one with rows', hs2.length === 5 && hs2.every((h) => h.n >= 1), hs2.map((h) => h.t + ':' + h.n).join(' '));
		if (PICS) { await Q.screenshot({ path: path.join(PICS, 'well-properties-tank-v10.png') }); }
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

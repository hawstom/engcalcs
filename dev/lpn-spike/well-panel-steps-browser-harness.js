// THE PREVIEW PANEL'S STEPS FOR THE WELL, WALKED AS WRITTEN, in a real Chrome. Run with:
//   node dev/lpn-spike/well-panel-steps-browser-harness.js
//
// Task 822, round 7 (Perry's pre-review): File > Open the test project (Net1 with the curves Drawdown and WellPump and Head ticked in the node
// labels); Water > Insert > Well on a pipe; the Well's box; the block is always rows; Explode redraws the labels at once and says so; Well with tank with the
// tee on the well's own point, where the Well wins a press on its symbol.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_PANEL_STEPS_LOCKED';
const NAME = 'well-panel-steps-browser-harness';

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
const FILE = path.join(REPO, 'dev', 'lpn-spike', 'well-test-net1.lwn');

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 } });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await a.reload(); await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		// The panel's steps, as written: File, Open (the test file is Net1 with the curves Drawdown and WellPump, and Head ticked in the node labels).
		await P.setInputFiles('#lpn_project_file', FILE);
		await a.settle(2500);
		const arrows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas path[data-link]')).map((e) => { const L = e.getTotalLength(), m = e.getScreenCTM(), p = e.getPointAtLength(L / 2); return { id: e.getAttribute('data-link'), x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f, L }; }).filter((q) => q.L < 10));
		const at = (id) => arrows.find((q) => q.id === id);
		const notice = () => P.evaluate(() => { const n = document.getElementById('lpn_map_notice'); return n && getComputedStyle(n).display !== 'none' ? n.textContent : ''; });
		const title = () => P.evaluate(() => { const t = document.getElementById('lpn_popup_boxtitle'); return t ? t.textContent.trim() : ''; });
		const wlabels = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => /W\dR|^W\d/.test(t.textContent)).map((t) => ({ text: t.textContent, rows: t.querySelectorAll('tspan').length, hidden: t.style.visibility === 'hidden' })));
		const nodeC = (id) => P.evaluate((i) => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);

		console.log('\n--- Water, Insert, Well on a pipe; the curves; the block ---');
		await a.menuClickSub('Insert', 'Well', 'project');
		await P.mouse.click(at('112').x, at('112').y); await a.settle(700);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
		let c = await nodeC('W1P');
		await P.mouse.click(c.x, c.y); await a.settle(900);
		ok('the Well\'s box opens, titled with the Well', (await title()) === 'Properties: Well W1', await title());
		const setSel = async (idx, text) => { await P.evaluate(([i, t]) => { const s = document.querySelectorAll('#lpn_popup_fields select')[i]; const o = Array.from(s.options).find((x) => x.textContent.indexOf(t) >= 0); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }, [idx, text]); await a.settle(500); };
		await setSel(0, 'Drawdown'); await setSel(1, 'WellPump');
		await P.keyboard.press('Escape'); await a.settle(2000);
		let bl = await wlabels();
		ok('the block shows numbers once both curves are chosen', bl.length === 1 && /Q=/.test(bl[0].text) && !bl[0].hidden, JSON.stringify(bl));
		console.log('\n--- the block is always rows, at every zoom ---');
		c = await nodeC('W1P');
		let everRows = false, folded = [];
		for (let n = 0; n <= 7; n++) {
			bl = await wlabels();
			if (bl.length && !bl[0].hidden) {
				const rowsInText = (bl[0].text.match(/W\dR|W\dD|W\dP/g) || []).length;
				if (rowsInText > 0 && bl[0].rows < 2) { folded.push(n + ':' + bl[0].text); }
				if (bl[0].rows >= 4) { everRows = true; }
			}
			await P.mouse.move(c.x, c.y); await P.mouse.wheel(0, -300); await a.settle(1500); c = await nodeC('W1P');
		}
		ok('whenever member rows are drawn they are rows (never folded into one line)', folded.length === 0, folded.join(' | '));
		ok('zoomed in the block is the heading and the three member rows, as Tom\'s example', everRows);
		bl = await wlabels();
		console.log('        ' + JSON.stringify(bl));

		console.log('\n--- Explode: the block goes at once and the status bar says so ---');
		c = await nodeC('W1P');
		await P.mouse.click(c.x, c.y); await a.settle(900);
		await P.click('#lpn_popup_fields button[data-assembly-explode="1"]'); await a.settle(300);
		ok('the status bar says the Well was separated', /Separated W1 /.test(await notice()), await notice());
		ok('the old block (heading W1 and its rows) is not drawn 0.3 s later', (await wlabels()).filter((l) => /^W1 /.test(l.text)).length === 0, JSON.stringify(await wlabels()));
		await P.keyboard.press('Control+z'); await a.settle(900);
		ok('one Undo brings the Well and its block back', (await wlabels()).some((l) => /^W1 /.test(l.text)));

		console.log('\n--- Well with tank, the tee on the well\'s own point: the Well wins a press on its symbol ---');
		await P.keyboard.press('Escape');
		await a.menuClickSub('Insert', 'Well with tank', 'project');
		await P.mouse.click(700, 900); await a.settle(500);
		ok('the status bar asks for the tee', /tee/i.test(await notice()), await notice());
		await P.mouse.click(700, 900); await a.settle(500);
		ok('then for the tank', /tank/i.test(await notice()), await notice());
		await P.mouse.click(850, 840); await a.settle(700);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
		const ids = await P.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node')))).filter((n) => /^W2/.test(n)));
		ok('a second Well, W2, with its tee and tank beside it', ids.length === 3, ids.join(','));
		const cc = await nodeC('W2P');
		for (const dy of [0, 2, 8]) {
			await P.keyboard.press('Escape'); await P.mouse.click(cc.x, cc.y + dy); await a.settle(800);
			ok('pressing the symbol at centre +' + dy + ' px opens the Well, never the tee', (await title()) === 'Properties: Well W2', await title());
		}
		console.log('\n--- a Well on open ground, before any curve: the block is rows, never one line ---');
		await P.keyboard.press('Escape');
		await a.menuClickSub('Insert', 'Well', 'project');
		const free = await P.evaluate(() => { for (let r = 0; r < 600; r += 30) { for (let k = 0; k < 24; k++) { const x = 1200 + r * Math.cos(k * Math.PI / 12), y = 850 + r * Math.sin(k * Math.PI / 12), e = document.elementFromPoint(x, y); if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol,text') && x > 40 && y > 140 && x < 1360 && y < 940) { return { x: x, y: y }; } } } return null; });
		await P.mouse.click(free.x, free.y); await a.settle(900);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(1800);
		const ebl = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => /^W3/.test(t.textContent)).map((t) => ({ text: t.textContent, rows: t.querySelectorAll('tspan').length })));
		console.log('        ' + JSON.stringify(ebl));
		ok('the new Well\'s block is a heading and its member rows, in rows', ebl.length === 1 && /W3R/.test(ebl[0].text) && ebl[0].rows >= 2, JSON.stringify(ebl));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });

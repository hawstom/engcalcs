// AN ASSEMBLY'S BOX HAS A HEADING PER SUB-ELEMENT, and its right-click menu asks which to graph, in a real Chrome. Run with:
//   EC_PICS=<pictureDir> node dev/lpn-spike/assembly-sections-browser-harness.js
//
// Task 822 (Tom, 2026-11-09). Opens dev/lpn-spike/assembly-sections-fixture.lwn (a Well, a Pump+ and a Valve+, an extended period run set;
// written by `assembly-sections-harness.js --write-fixture`). Asserted: the headings stand in the box in order, bold, clipped and never
// ellipsed, inside the box's width; the rows under each are laid in the box's two tracks; the right-click menu on a Well lists a Time series
// graph row per sub-asset and one opens a bubble for that element; the "Graph which sub-asset?" chooser sits above the chart. A picture of
// the Well's box and the Pump+'s is saved when a directory is given.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ASM_SECTIONS_BROWSER_LOCKED';
const NAME = 'assembly-sections-browser-harness';

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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const fixture = require('fs').readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'assembly-sections-fixture.lwn'), 'utf8');
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 }, serviceWorkers: 'block' });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, fixture);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		const centreOf = (id) => P.evaluate((i) => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"], #lpn_canvas [data-link="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, id);
		const clickAt = async (id) => { const c = await centreOf(id); await P.mouse.click(c.x, c.y); await a.settle(900); return c; };
		const heads = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-head')).map((h) => {
			const r = h.getBoundingClientRect(), f = document.getElementById('lpn_popup_fields').getBoundingClientRect(), c = getComputedStyle(h);
			return { t: h.textContent, w: r.width, left: r.left, right: r.right, fl: f.left, fr: f.right, ws: c.whiteSpace, ov: c.overflow, to: c.textOverflow, fw: c.fontWeight, top: r.top };
		}));

		console.log('\n--- the Well ---');
		await P.keyboard.press('Escape');
		await clickAt('W1T');
		let hs = await heads();
		ok('the Well\'s box shows seven headings', hs.length === 7, hs.map((h) => h.t).join(' | '));
		ok('they stand in order down the box', hs.every((h, i) => i === 0 || h.top > hs[i - 1].top), JSON.stringify(hs.map((h) => Math.round(h.top))));
		ok('each is bold, one line, clipped and never ellipsed, and inside the box', hs.every((h) => +h.fw >= 600 && h.ws === 'nowrap' && h.ov === 'hidden' && h.to === 'clip' && h.left >= h.fl - 1 && h.right <= h.fr + 1), JSON.stringify(hs[0]));
		const rowsOk = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-section > div')).every((d) => /lpn-gprops/.test(d.className) && getComputedStyle(d).display === 'grid'));
		ok('the rows under each heading are laid in the box\'s own grid', rowsOk);
		const noOverflow = await P.evaluate(() => { const f = document.getElementById('lpn_popup_fields'); return f.scrollWidth <= f.clientWidth + 1; });
		ok('nothing runs past the box horizontally', noOverflow);
		const tankInputs = await P.evaluate(() => { const s = document.querySelector('[data-asm-member="W1T"]'); return Array.from(s.querySelectorAll('label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()); });
		ok('the Tank section holds its own inputs and results', ['Initial depth', 'Tank diameter', 'Available volume'].every((n) => tankInputs.some((x) => x.indexOf(n) === 0)), tankInputs.join(' | '));
		const chooser = await P.evaluate(() => { const s = document.getElementById('lpn_pgraph_member'), f = document.getElementById('lpn_pgraph_field'); return s && f ? { val: s.value, below: s.getBoundingClientRect().top < f.getBoundingClientRect().top, n: s.options.length } : null; });
		ok('the graph at the foot has the "Graph which sub-asset?" chooser above its quantity chooser', !!chooser && chooser.n === 7 && chooser.val === 'link:W1' && chooser.below, JSON.stringify(chooser));
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-selected-properties-v6.png') }); }

		console.log('\n--- the right-click menu ---');
		await P.keyboard.press('Escape');
		const wc = await centreOf('W1T');
		await P.mouse.click(wc.x, wc.y, { button: 'right' });
		await a.settle(500);
		const rows = await P.evaluate(() => Array.from(document.querySelectorAll('.lpn-ctx-menu button, .lpn-ctxmenu button, [role="menu"] [role="menuitem"], #lpn_ctx_menu button')).map((b) => b.textContent.trim()));
		const tsRows = rows.filter((r) => /^Time series graph/.test(r));
		ok('right-click on the Well lists a Time series graph row for each sub-asset, upstream to downstream', tsRows.length === 7 && tsRows[3] === 'Time series graph: Pump W1' && tsRows[6] === 'Time series graph: Tank W1T', JSON.stringify(tsRows));
		const clicked = await P.evaluate(() => { const b = Array.from(document.querySelectorAll('.lpn-ctx-menu button, .lpn-ctxmenu button, [role="menu"] [role="menuitem"], #lpn_ctx_menu button')).find((x) => /Pump W1$/.test(x.textContent.trim())); if (b) { b.click(); return true; } return false; });
		await a.settle(900);
		const bubbles = await P.evaluate(() => document.querySelectorAll('.lpn-tsb, .lpn-ts-bubble, [data-tsb]').length);
		ok('choosing the pump\'s row opens a graph bubble', clicked && bubbles >= 1, String(bubbles));
		await P.keyboard.press('Escape');

		console.log('\n--- the Pump+ ---');
		await clickAt('P1U');
		hs = await heads();
		ok('Pump+: Junction P1U, Pump P1, Junction P1D', JSON.stringify(hs.map((h) => h.t)) === JSON.stringify(['Junction P1U', 'Pump P1', 'Junction P1D']), hs.map((h) => h.t).join(' | '));
		const pumpRows = await P.evaluate(() => Array.from(document.querySelectorAll('[data-asm-member="P1"] label, [data-asm-member="P1U"] label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		ok('with the Pump+ in a run, its sections show results (Flow under the Pump, Head under a junction)', pumpRows.some((x) => /^Flow/.test(x)) && pumpRows.some((x) => /^Head/.test(x)), pumpRows.join(' | '));
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'pump-plus-selected-properties-v6.png') }); }
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

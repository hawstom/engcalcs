// A WELL'S LABEL BLOCK IS WHOLE OR NOT DRAWN, NEVER A HEADING ALONE, in a real Chrome. Run with:
//   node dev/lpn-spike/well-block-rows-browser-harness.js
//
// Task 822, round 8 (Tom, 2026-11-14: "We have, from what I can see, two labels, where we need four."). The cause, found in this page: Net1's N23, at the
// window's edge, found no side for its label, and shedNodeLabelsForCrowding() then took the lowest-ranked value from EVERY label overlapping any of its
// 28 candidate sides, a Well's block among them; two rungs took both member rows and left the heading alone, in a view with room all round the Well.
// A Well's block is now shed for its own sake only. Covered, on Net1 (the test project) at 1920 x 1080 with a Well spliced into pipe 22 (the cause's
// case) and into pipe 11 (the densest pipe, whose block honestly stands hidden until the view is zoomed in): at every zoom the block is either all three
// lines (the heading, W1R and W1D) or not drawn at all, and on pipe 22 it is drawn whole at the fit.
// Round 8, Perry: "at the opening view the label is two lines; the W1R line is missing until the first wheel notch." The Well's own hidden members (a
// reservoir, a drawdown node, a pump and a valve drawn as nothing) and its own symbol stood as obstacles on the sides its block is tried on, so none was
// clear for three rows until a notch changed the margins. Covered with no wheel at all: a Well placed on open ground close below-right of Net1 and given both
// curves, and the Wells of a file saved before this round, right after File, Open (its labels do not show Head, so the heading is the whole block).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_BLOCK_ROWS_LOCKED';
const NAME = 'well-block-rows-browser-harness';

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

const FILE = path.join(REPO, 'dev', 'lpn-spike', 'well-test-net1.lwn');
let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function walk(browser, env, pipe, notches) {
	const a = await Session.open(browser, NAME + '-' + pipe, { viewport: { width: 1920, height: 1080 } });
	const P = a.page;
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
	await a.reload(); await a.answerTrainingPanel().catch(() => {});
	await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1000);
	await P.setInputFiles('#lpn_project_file', FILE);
	await a.settle(2000);
	const at = await P.evaluate((id) => { const e = Array.from(document.querySelectorAll('#lpn_canvas path[data-link]')).filter((x) => x.getAttribute('data-link') === id && x.getTotalLength() < 10)[0]; const L = e.getTotalLength(), m = e.getScreenCTM(), p = e.getPointAtLength(L / 2); return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f }; }, pipe);
	await a.menuClickSub('Insert', 'Well', 'project');
	await P.mouse.click(at.x, at.y); await a.settle(700);
	await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(400);
	const nodeC = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
	let c = await nodeC();
	await P.mouse.click(c.x, c.y); await a.settle(900);
	const setSel = async (idx, text) => { await P.evaluate(([i, t]) => { const s = document.querySelectorAll('#lpn_popup_fields select')[i]; const o = Array.from(s.options).find((x) => x.textContent.indexOf(t) >= 0); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }, [idx, text]); await a.settle(500); };
	await setSel(0, 'Drawdown'); await setSel(1, 'WellPump');
	await P.keyboard.press('Escape'); await a.settle(2200);
	const seen = [];
	c = await nodeC();
	for (let n = 0; n <= notches; n++) {
		const lb = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => /^W\d/.test(t.textContent)).map((t) => ({ text: t.textContent, rows: t.querySelectorAll('tspan').length, hidden: t.style.visibility === 'hidden' }))[0]);
		seen.push(lb ? { rows: lb.rows, hidden: lb.hidden, text: lb.text } : null);
		await P.mouse.move(c.x, c.y); await P.mouse.wheel(0, -300); await a.settle(1300); c = await nodeC();
	}
	const errors = a.errors.slice(0, 2);
	await a.close();
	return { seen, errors };
}

// A Well placed on open ground just below and to the right of Net1 (the spot nearest the network), curves chosen, and its label at the opening view: no wheel.
async function openGround(browser) {
	const a = await Session.open(browser, NAME + '-ground', { viewport: { width: 1400, height: 1000 } });
	const P = a.page;
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
	await a.reload(); await a.answerTrainingPanel().catch(() => {});
	await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1000);
	await P.setInputFiles('#lpn_project_file', FILE);
	await a.settle(2200);
	const nodeC = (id) => P.evaluate((i) => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
	const b = await nodeC('32'), d = await nodeC('23');
	await a.menuClickSub('Insert', 'Well', 'project');
	await P.mouse.click(Math.max(d.x, b.x) + 100, b.y + 20); await a.settle(900);
	await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
	const c = await nodeC('W1');
	await P.mouse.click(c.x, c.y); await a.settle(900);
	const setSel = async (idx, text) => { await P.evaluate(([i, t]) => { const s = document.querySelectorAll('#lpn_popup_fields select')[i]; const o = Array.from(s.options).find((x) => x.textContent.indexOf(t) >= 0); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }, [idx, text]); await a.settle(500); };
	await setSel(0, 'Drawdown'); await setSel(1, 'WellPump');
	await P.keyboard.press('Escape'); await a.settle(2500);
	const lb = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => /^W\d/.test(t.textContent)).map((t) => ({ text: t.textContent, rows: t.querySelectorAll('tspan').length, hidden: t.style.visibility === 'hidden' })));
	const errors = a.errors.slice(0, 2);
	await a.close();
	return { lb, errors };
}

// The Wells of a file saved before this round, right after File, Open, no wheel.
async function oldFile(browser) {
	const a = await Session.open(browser, NAME + '-old', { viewport: { width: 1400, height: 1000 } });
	const P = a.page;
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
	await a.reload(); await a.answerTrainingPanel().catch(() => {});
	await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1000);
	await P.setInputFiles('#lpn_project_file', path.join(REPO, 'dev', 'lpn-spike', 'assembly-before-round8.lwn'));
	await a.settle(3000);
	const lb = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => /^W\d/.test(t.textContent)).map((t) => ({ text: t.textContent, rows: t.querySelectorAll('tspan').length, hidden: t.style.visibility === 'hidden' })));
	const errors = a.errors.slice(0, 2);
	await a.close();
	return { lb, errors };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const [pipe, notches] of [['22', 3], ['11', 9]]) {
			console.log('\n--- a Well spliced into pipe ' + pipe + ' ---');
			const r = await walk(browser, env, pipe, notches);
			console.log('        ' + r.seen.map((s, n) => n + ':' + (!s ? 'none' : s.hidden ? 'hidden' : s.rows + ' lines')).join('  '));
			ok('the Well has a label block at every zoom', r.seen.every((s) => !!s));
			ok('at every zoom the block is all three lines (heading, W1R, W1D) or not drawn: never a heading alone', r.seen.every((s) => s && (s.hidden || (s.rows === 3 && /^W1 Z=\S+ Q=\S+ P=/.test(s.text) && /W1R H=/.test(s.text) && /W1D H=/.test(s.text)))), JSON.stringify(r.seen.map((s) => s && s.rows)));
			if (pipe === '22') { ok('on pipe 22 it is drawn whole at the fit, where the old shed left the heading alone', r.seen[0] && !r.seen[0].hidden && r.seen[0].rows === 3, JSON.stringify(r.seen[0])); }
			else { ok('on the densest pipe it is drawn whole once zoomed in', r.seen.some((s) => s && !s.hidden && s.rows === 3), JSON.stringify(r.seen.map((s) => s && s.hidden))); }
			ok('no uncaught page errors', r.errors.length === 0, r.errors.join(' | '));
		}
		console.log('\n--- a Well on open ground next to Net1, at the opening view (no wheel) ---');
		const g = await openGround(browser);
		console.log('        ' + JSON.stringify(g.lb.map((x) => x.rows + ' lines' + (x.hidden ? ' hidden' : ''))));
		ok('the Well\'s block is drawn, all three lines, before any wheel notch', g.lb.length === 1 && !g.lb[0].hidden && g.lb[0].rows === 3 && /W1R H=/.test(g.lb[0].text) && /W1D H=/.test(g.lb[0].text), JSON.stringify(g.lb));
		ok('no uncaught page errors', g.errors.length === 0, g.errors.join(' | '));
		console.log('\n--- the Wells of a file saved before this round, right after File, Open ---');
		const o = await oldFile(browser);
		console.log('        ' + JSON.stringify(o.lb.map((x) => x.text.slice(0, 12) + ' ' + x.rows + ' lines' + (x.hidden ? ' hidden' : ''))));
		// That file's label settings do not tick Head, so W1R and W1D have no number to show: the heading alone is the whole block, and is right.
		ok('both are drawn at the opening view with their Z, Q and P (the file shows no Head, so no member rows are owed)', o.lb.length === 2 && o.lb.every((x) => !x.hidden && /^W\d Z=\S+ Q=\S+ P=\S+$/.test(x.text)), JSON.stringify(o.lb));
		ok('no uncaught page errors', o.errors.length === 0, o.errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });

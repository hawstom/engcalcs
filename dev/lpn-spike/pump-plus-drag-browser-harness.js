// A PUMP+ MOVES, DELETES AND LABELS AS ONE POINT, in a real Chrome. Run with:
//   node dev/lpn-spike/pump-plus-drag-browser-harness.js
//
// Task 822, Perry's review of feat/assembly (2026-11-06): *dragging a Pump+ with Select moves only D1; U1
// stays and the pump stretches.* Asserted with real pointer events: dragging either node moves both and
// they stay coincident, as one undo step; Delete (the key, and the Delete tool) removes the two nodes
// and the pump together, as one undo step; only the upstream node's label is drawn while grouped.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PUMP_PLUS_BROWSER_LOCKED';
const NAME = 'pump-plus-drag-browser-harness';

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
// The page draws each node as a circle in world units; what is read here is where it is drawn.
const circles = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((c) => ({ id: c.getAttribute('data-node'), x: +c.getAttribute('cx'), y: +c.getAttribute('cy') })));
const nLinks = (a) => a.page.evaluate(() => new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).map((e) => e.getAttribute('data-link'))).size);
const labelsShown = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => t.style.visibility !== 'hidden' && t.textContent).map((t) => t.getAttribute('data-nodelbl')));
const together = (cs) => cs.length === 2 && Math.abs(cs[0].x - cs[1].x) < 1e-9 && Math.abs(cs[0].y - cs[1].y) < 1e-9;

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	await a.newProject('us');
	await a.settle(800);
	return a;
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
		const a = await open(browser);
		const P = a.page;
		const box = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
		const at = { x: box.x + 400, y: box.y + 300 };
		const plus = async () => { await P.click('#lpn_toolbar button[data-tool="add-pumpplus"]'); await a.settle(200); };
		const undo = async () => { await P.keyboard.press('Control+z'); await a.settle(300); };

		console.log('\n--- place ---');
		await P.keyboard.press('Escape');
		await plus();
		await P.mouse.click(at.x, at.y); await a.settle(300);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(200);
		let cs = await circles(a);
		ok('a Pump+ is two nodes at one point and a pump', together(cs) && (await nLinks(a)) === 1, JSON.stringify(cs));
		const home = cs[0];
		const shown = await labelsShown(a);
		ok('one node label is drawn for the group: the upstream node\'s', shown.length <= 1 && shown.every((id) => /^U/.test(id)), JSON.stringify(shown));

		console.log('\n--- drag ---');
		const drag = async (from, to) => {
			await P.mouse.move(from.x, from.y); await P.mouse.down();
			await P.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 5 });
			await P.mouse.move(to.x, to.y, { steps: 5 }); await P.mouse.up(); await a.settle(300);
		};
		await drag(at, { x: at.x + 160, y: at.y + 90 });
		cs = await circles(a);
		ok('dragging the Pump+ moves both nodes, still coincident', together(cs) && (Math.abs(cs[0].x - home.x) > 1 || Math.abs(cs[0].y - home.y) > 1), JSON.stringify(cs));
		await undo();
		cs = await circles(a);
		ok('one undo puts both back', together(cs) && Math.abs(cs[0].x - home.x) < 1e-6 && Math.abs(cs[0].y - home.y) < 1e-6, JSON.stringify(cs));
		await drag(at, { x: at.x - 120, y: at.y - 60 });
		await P.keyboard.press('Escape'); await a.settle(150);
		cs = await circles(a);
		ok('and again, the other way', together(cs), JSON.stringify(cs));

		console.log('\n--- Delete ---');
		const now = await P.evaluate(() => { const c = document.querySelector('#lpn_canvas circle.lpn-node[data-node]'); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.click(now.x, now.y); await a.settle(300);
		await P.keyboard.press('Escape');
		await P.mouse.click(now.x, now.y); await a.settle(300);
		await P.keyboard.press('Delete'); await a.settle(300);
		ok('the Delete key removes both nodes and the pump', (await circles(a)).length === 0 && (await nLinks(a)) === 0, (await circles(a)).length + ' nodes, ' + (await nLinks(a)) + ' links');
		await undo();
		cs = await circles(a);
		ok('one undo brings all three back', cs.length === 2 && (await nLinks(a)) === 1, cs.length + ' nodes, ' + (await nLinks(a)) + ' links');
		await P.click('#lpn_toolbar button[data-tool="delete"]'); await a.settle(200);
		await P.mouse.click(now.x, now.y); await a.settle(300);
		ok('the Delete tool on one node removes the whole group', (await circles(a)).length === 0 && (await nLinks(a)) === 0, (await circles(a)).length + ' nodes');
		await P.keyboard.press('Escape');
		await undo();
		ok('and one undo brings it back', (await circles(a)).length === 2 && (await nLinks(a)) === 1);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

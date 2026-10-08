// EVERY INSERTER STAYS ARMED, TEXT INCLUDED; EDIT HAS NO LIBRARIES ROW; REPORTS ROW LABELS, in a real Chrome.
//
//   node dev/lpn-spike/inserter-repeat-browser-harness.js
//
// Tom, 2026-10-07: *"All inserters should be in repeater mode. Text is not."* One tool pick (the
// shortcut digit), then several real clicks on the map: junction, reservoir, tank, pipe, pump,
// valve, customer and Text each place one thing per click and stay armed until Esc or another tool. Also: Edit has no Libraries row (Water still does), and the Reports rows read
// Run, Status changes, Calibration, Full.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_INSERTER_REPEAT_BROWSER_LOCKED';
const NAME = 'inserter-repeat-browser-harness';

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
const count = (a, attr) => a.page.evaluate((s) => new Set(Array.from(document.querySelectorAll('#lpn_canvas [' + s + ']')).map((e) => e.getAttribute(s))).size, attr);
const rowTexts = (a, list) => a.page.$$eval(list + ' button.lpn-menu-row', (els) => els.map((b) => b.textContent.replace(/[▸\s]+$/, '').trim()));

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
		let slot = 0;
		const spot = () => { slot++; return { x: box.x + 120 + (slot % 8) * 110, y: box.y + 100 + Math.floor(slot / 8) * 110 }; };
		const click = async (p) => { await P.mouse.click(p.x, p.y); await a.settle(250); };
		const pick = async (digit) => { await P.keyboard.press('Escape'); await P.keyboard.press(digit); await a.settle(200); };

		console.log('\n--- node tools: one pick, three clicks, three nodes ---');
		for (const [digit, name] of [['2', 'junction'], ['3', 'reservoir'], ['4', 'tank']]) {
			const before = await count(a, 'data-node');
			await pick(digit);
			for (let i = 0; i < 3; i++) { await click(spot()); }
			const after = await count(a, 'data-node');
			ok(name + ': three clicks after one pick place three', after - before === 3, before + ' -> ' + after);
		}
		console.log('\n--- link tools: one pick, chain of clicks, each link made ---');
		const nodes = [];
		await pick('2');
		for (let i = 0; i < 4; i++) { const p = spot(); nodes.push(p); await click(p); }
		for (const [digit, name] of [['5', 'pipe'], ['6', 'pump'], ['7', 'valve']]) {
			const before = await count(a, 'data-link');
			await pick(digit);
			for (const p of nodes) { await click(p); }
			const after = await count(a, 'data-link');
			ok(name + ': four node clicks after one pick draw three links', after - before === 3, before + ' -> ' + after);
		}
		console.log('\n--- junction pipe chain ---');
		{
			const bn = await count(a, 'data-node'), bl = await count(a, 'data-link');
			await pick('0');
			for (let i = 0; i < 4; i++) { await click(spot()); }
			const an = await count(a, 'data-node'), al = await count(a, 'data-link');
			ok('chain: four clicks after one pick place four nodes and three pipes', an - bn === 4 && al - bl === 3, (an - bn) + ' nodes, ' + (al - bl) + ' links');
		}
		console.log('\n--- customer: pick location, pick pipe, repeat ---');
		{
			const before = await count(a, 'data-cust');
			await pick('8');
			// Spread along the pipe: a press near a customer already there opens it and leaves the tool.
			const f = (t) => ({ x: nodes[0].x + (nodes[1].x - nodes[0].x) * t, y: nodes[0].y + (nodes[1].y - nodes[0].y) * t });
			for (const t of [0.25, 0.5, 0.75]) {
				const q = f(t);
				await click({ x: q.x, y: q.y - 40 });
				await click(q);
			}
			const after = await count(a, 'data-cust');
			ok('customer: three location+pipe pairs after one pick place three', after - before === 3, before + ' -> ' + after);
		}
		console.log('\n--- Text repeats like every other inserter ---');
		{
			const nT = () => count(a, 'data-lbl');
			const row = (n) => ({ x: box.x + 150 + n * 140, y: box.y + 700 });
			// 1. key 9: one pick, three clicks, three Texts.
			let before = await nT();
			await pick('9');
			for (let i = 0; i < 3; i++) { await click(row(i)); }
			ok('Text (key 9): three clicks after one pick place three', (await nT()) - before === 3, before + ' -> ' + (await nT()));
			ok('Text (key 9): the tool is still armed', (await P.evaluate(() => document.querySelector('#lpn_toolbar button[aria-pressed=true]') && document.querySelector('#lpn_toolbar button[aria-pressed=true]').getAttribute('aria-label'))) === 'Text');
			// Esc ends the repeat.
			await P.keyboard.press('Escape'); await a.settle(200);
			before = await nT();
			await click({ x: box.x + 150, y: box.y + 800 });
			ok('Esc ends the repeat: the next click places no Text', (await nT()) === before);
			// 2. toolbar: one pick, three clicks, three Texts.
			await P.keyboard.press('Escape');
			await a.toolbarClick('Text'); await a.settle(200);
			for (let i = 0; i < 3; i++) { await click({ x: box.x + 150 + i * 140, y: box.y + 560 }); }
			ok('Text (toolbar): three clicks after one pick place three', (await nT()) - before === 3, before + ' -> ' + (await nT()));
			// 3. another tool ends it.
			await a.toolbarClick('Select'); await a.settle(200);
			before = await nT();
			await click({ x: box.x + 150 + 3 * 140, y: box.y + 560 });
			ok('choosing another tool ends the repeat', (await nT()) === before);
			// 4. editing an existing Text still works.
			await click({ x: box.x + 150, y: box.y + 560 });
			await P.waitForSelector('#lpn_popup_fields textarea', { timeout: 3000 });
			await P.fill('#lpn_popup_fields textarea', 'Edited note');
			await P.keyboard.press('Tab'); await a.settle(300);
			const edited = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-lbl]')).some((t) => (t.textContent || '').indexOf('Edited note') >= 0));
			ok('editing an existing Text still works', edited);
			await P.keyboard.press('Escape'); await a.settle(200);
		}

		console.log('\n--- menus ---');
		await P.keyboard.press('Escape');
		await a.openMenu('edit');
		const edit = await rowTexts(a, '#lpn_menu_list');
		const lib = (await a.lang('lpn_library_menu')).trim();
		ok('Edit has no Libraries row', !edit.some((t) => t.indexOf(lib) === 0), edit.join(' | '));
		await a.closeMenu();
		await a.openMenu('project');
		const water = await rowTexts(a, '#lpn_menu_list');
		ok('Water still has the Libraries row', water.some((t) => t.indexOf(lib) === 0));
		await a.closeMenu();
		await a.openMenu('project');
		await P.evaluate((l) => {
			const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
			r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
		}, await a.lang('lpn_reports_menu'));
		await P.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const reps = await rowTexts(a, '#lpn_menu_list2');
		const want = ['Pump energy', 'Scenario comparison', 'Run', 'Status changes', 'Calibration', 'Full'];
		ok('Reports rows read as specified', JSON.stringify(reps) === JSON.stringify(want), reps.join(' | '));
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

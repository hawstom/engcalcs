// GRAPH BUBBLE QUANTITY CHOOSER (Task 784, Tom 2026-10-12). Real Chromium, Net3 after an EPS run.
//   node dev/lpn-spike/graph-bubble-quantity-harness.js
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BUBBLEQ_BROWSER_LOCKED';
const NAME = 'graph-bubble-quantity-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}


let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'bq1', { viewport: { width: 1500, height: 950 } });
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { delete window.lpnDialogAnswerer; const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		await a.settle(800);
		const LBL = await a.lang('lpn_tsb_menu');
		const QL = await a.lang('lpn_tsb_quantity');
		// the first free asset of the group (on screen, nothing over it, no bubble yet); returns its id
		const openAny = async (group, need) => {
			await a.page.keyboard.press('Escape'); await a.settle(200);
			const pp = await a.page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none'; });
			if (pp) { await a.page.click('#lpn_popup_close'); await a.settle(300); }
			const cands = await a.page.evaluate((g) => {
				const out = [];
				Array.from(document.querySelectorAll('#lpn_canvas [data-' + g + ']')).forEach((el) => {
					const id = el.getAttribute('data-' + g), r = el.getBoundingClientRect();
					if (r.width <= 0 || out.some((o) => o.id === id)) { return; }
					let x = r.left + r.width / 2, y = r.top + r.height / 2;
					if (g === 'link' && el.getTotalLength && el.getScreenCTM) {
						const L = el.getTotalLength(), p = el.getPointAtLength(L / 2), m = el.getScreenCTM();
						x = m.a * p.x + m.c * p.y + m.e; y = m.b * p.x + m.d * p.y + m.f;
					}
					const t = document.elementFromPoint(x, y);
					if (t && t.closest('#lpn_canvas') && !document.querySelector('.lpn-tsb[data-asset="' + id + '"]')) { out.push({ id, x, y }); }
				});
				return out;
			}, group);
			const before = await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).map((x) => x.getAttribute('data-bubble')));
			const have = before.length;
			for (const c of cands) {
				await a.page.mouse.move(c.x, c.y);
				await a.page.mouse.click(c.x, c.y, { button: 'right' });
				await a.settle(400);
				const found = await a.page.evaluate((l) => {
					const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0];
					if (b) { b.click(); } return !!b;
				}, LBL);
				await a.settle(500);
				const now = await a.page.evaluate(() => document.querySelectorAll('.lpn-tsb').length);
				if (found && now === have + 1) {
					const bid2 = (await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).map((x) => x.getAttribute('data-bubble')))).filter((x) => before.indexOf(x) < 0)[0];
					const opts = (await state(bid2)).opts;
					if (!need || opts.indexOf(need) >= 0) { return bid2; }
					await a.page.evaluate((i) => document.querySelector('.lpn-tsb[data-bubble="' + i + '"] .lpn-tsb-close').click(), bid2);
					await a.settle(200);
				}
				await a.page.keyboard.press('Escape');
			}
			return null;
		};
		// series the chart actually plots: the y values of the polyline path, read from the line's d
		const state = (bid) => a.page.evaluate((i) => {
			const b = document.querySelector('.lpn-tsb[data-bubble="' + i + '"]'), q = b.querySelector('.lpn-tsb-q');
			const line = b.querySelector('.lpn-ts-line');
			return { sel: q.value, opts: Array.from(q.options).map((o) => o.value), labels: Array.from(q.options).map((o) => o.textContent),
				aria: q.getAttribute('aria-label'), d: line ? line.getAttribute('points') + '|' + b.querySelector('.lpn-tsb-chart').textContent : null };
		}, bid);
		const stored = () => a.page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				const v = localStorage.getItem(localStorage.key(i));
				if (v && v.indexOf('"bubbles"') >= 0) { const m = v.match(/"bubbles":\[(.*?)\]/); return m ? m[1] : ''; }
			}
			return null;
		});

		// the bottom pane's own controls, reached through the Water menu as a visitor would
		const names = await a.page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, t: EngCalcs.pageConfig.lpn_ts_menu }));
		await a.page.click('#lpn_menu_project');
		await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await a.page.click('#lpn_menu_popup .lpn-menu-row:has-text("' + names.g + '")');
		await a.settle(250);
		await a.page.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_menu_popup2 .lpn-menu-row')).filter((e) => e.textContent.replace('\u25b8', '').trim() === t)[0].click(); }, names.t);
		await a.settle(600);
		const paneQ = async (g, f) => {
			await a.page.selectOption('#lpn_ts_group', g); await a.settle(300);
			await a.page.selectOption('#lpn_ts_quantity', f); await a.settle(300);
		};
		console.log('1. default follows the bottom pane');
		await paneQ('node', 'demandActual');
		const idA = await openAny('node', 'pressure');
		let s1 = await state(idA);
		ok('the chooser is labelled', s1.aria === QL, s1.aria);
		ok('a new bubble opens on the bottom pane quantity (demandActual)', s1.sel === 'demandActual', s1.sel);
		ok('the chooser lists several quantities incl. pressure and head', s1.opts.indexOf('pressure') >= 0 && s1.opts.indexOf('head') >= 0 && s1.opts.length >= 3, s1.opts.join(','));
		await paneQ('node', 'pressure');
		const idB = await openAny('node', 'pressure');
		let s2 = await state(idB);
		ok('with the pane on pressure, the next bubble opens on pressure', s2.sel === 'pressure', s2.sel);
		ok('the first bubble kept its own choice', (await state(idA)).sel === 'demandActual');

		console.log('2. changing the quantity changes the plotted series');
		const before = (await state(idB)).d;
		await a.page.selectOption('.lpn-tsb[data-bubble="' + idB + '"] .lpn-tsb-q', 'head');
		await a.settle(400);
		const after = await state(idB);
		ok('selector now reads head', after.sel === 'head');
		ok('the plotted line is different data', !!before && !!after.d && before !== after.d);
		ok('the other bubble did not change', (await state(idA)).sel === 'demandActual');
		const ttl = await a.page.evaluate((i) => document.querySelector('.lpn-tsb[data-bubble="' + i + '"] .lpn-tsb-chart').textContent, idB);
		ok('the axis title follows (head)', ttl.indexOf(after.labels[after.opts.indexOf('head')]) >= 0, ttl.slice(0, 80));
		ok('the choice is in the saved project', /"f":"head"/.test(await stored()), await stored());

		console.log('3. save and reopen');
		await a.page.reload();
		await a.settle(1500);
		const re = await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).map((b) => b.getAttribute('data-bubble')));
		ok('bubbles are back after reload', re.length === 2, re.join(','));
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		await a.settle(800);
		ok('the second bubble is still on head', (await state(idB)).sel === 'head');
		ok('the first is still on demand', (await state(idA)).sel === 'demandActual');

		console.log('4. a link');
		await paneQ('link', 'velocity');
		const idL = await openAny('link', 'flow');
		const sl = await state(idL);
		ok('a link bubble offers link quantities and opens on the pane choice', sl.opts.indexOf('flow') >= 0 && sl.sel === 'velocity', sl.opts.join(',') + ' / ' + sl.sel);
		await a.page.selectOption('.lpn-tsb[data-bubble="' + idL + '"] .lpn-tsb-q', 'headloss');
		await a.settle(300);
		ok('and can be changed to headloss', (await state(idL)).sel === 'headloss');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

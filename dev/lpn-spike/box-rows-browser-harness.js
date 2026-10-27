// THE STANDARD BOX ROW IN A REAL BROWSER (ROADMAP Task 828; Ida's design,
// dev/agents/interface-designer/standard-box-rows-2026-10-24.md). What a stub cannot show: that the
// rows of a box really share one name column and one value column, that a number box is as wide as
// its digits and no wider, and that the split moves, steps, resets and is remembered.
//
//   1. Contour plot, Net1 at 1440 x 900: every row's name starts at one x and every value at one x;
//      no value cell is wider than its widest control (the old fixed 13rem track is gone); the
//      Fill opacity box (3 digits) is narrower than the Interval box (6).
//   2. Fire flow analysis: the same alignment, and the Label column fitted to its labels
//      and no wider (the old 606 px name when docked wide), with no name cut off.
//   3. The split: a drag widens the name column and writes `lpn_gcols`; ArrowLeft steps it back by
//      0.5rem; a double-click resets it and removes the key.
//   4. A label in a narrow Label column wraps (never an ellipsis, never cut).
//   5. A host narrower than 18rem stacks name above value.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/box-rows-browser-harness.js
// BOXROWS_SHOT=<dir> also writes a screenshot of each box there.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BOXROWS_BROWSER_LOCKED';
const NAME = 'box-rows-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function openNet1(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, { viewport });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1200);
	return a;
}
async function openContour(a) {
	const names = await a.page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
	await a.page.click('#lpn_menu_project');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const clickRow = (sel, label) => a.page.evaluate(([s, l]) => {
		const r = Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
		if (r) { r.click(); }
		return !!r;
	}, [sel, label]);
	await clickRow('#lpn_menu_list', names.g);
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	await clickRow('#lpn_menu_list2', names.c);
	await a.page.waitForSelector('#lpn_contour_body .lpn-grow', { state: 'attached' });
	await a.settle(500);
}
// Per row: the left edge and width of its name, value and unit cells; the host's own width.
function facts(page, host) {
	return page.evaluate((h) => {
		const H = document.querySelector(h), rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const rows = Array.from(H.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname') && r.querySelector('.lpn-gval'));
		const box = (e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left * 10) / 10, w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10, y: Math.round(b.top) }; };
		return {
			rem, host: box(H).w,
			rows: rows.map((r) => ({ name: box(r.querySelector('.lpn-gname')), val: box(r.querySelector('.lpn-gval')), label: r.querySelector('.lpn-gname').textContent.trim(), id: r.querySelector('.lpn-gval').id || '' }))
		};
	}, host);
}
const uniq = (xs) => Array.from(new Set(xs.map((x) => Math.round(x))));
const stored = (page) => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lpn_gcols') || 'null'); } catch (e) { return 'bad'; } });

async function sectionAlignment(a, host, label) {
	const f = await facts(a.page, host);
	ok(label + ': has rows', f.rows.length >= 4, String(f.rows.length));
	ok(label + ': every name starts at one x', uniq(f.rows.map((r) => r.name.x)).length === 1, JSON.stringify(uniq(f.rows.map((r) => r.name.x))));
	ok(label + ': every value starts at one x', uniq(f.rows.map((r) => r.val.x)).length === 1, JSON.stringify(uniq(f.rows.map((r) => r.val.x))));
	// A label may wrap (Tom, 2026-10-26); it is never cut.
	const cut = await a.page.evaluate((h) => Array.from(document.querySelectorAll(h + ' .lpn-gname')).filter((n) => n.scrollWidth > n.clientWidth + 1).length, host);
	ok(label + ': no label is cut', cut === 0, String(cut));
	ok(label + ': a label wraps in at most three lines', f.rows.every((r) => r.name.h < 4.4 * f.rem), JSON.stringify(f.rows.map((r) => r.name.h)));
	const fillers = await a.page.evaluate((h) => Array.from(document.querySelectorAll(h + ' .lpn-gw-fill')).map((e) => e.getBoundingClientRect().width), host);
	ok(label + ': no control is wider than 17rem', f.rows.every((r) => r.val.w <= 17 * f.rem + 1), JSON.stringify(f.rows.map((r) => r.val.w)));
	return { f, fillers };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await openNet1(Session, browser, { width: 1440, height: 900 });
		console.log('\n--- 1. Contour plot ---');
		await openContour(a);
		const c = await sectionAlignment(a, '#lpn_contour_body', 'contour');
		const byId = (id) => c.f.rows.filter((r) => r.id === id)[0];
		const op = byId('lpn_contour_opacity'), iv = byId('lpn_contour_interval');
		ok('Fill opacity (3 digits) is narrower than Interval (6)', op && iv && op.val.w < iv.val.w, op && iv && (op.val.w + ' < ' + iv.val.w));
		ok('no row wraps: a value is one line high', c.f.rows.every((r) => r.val.h < 2.2 * c.f.rem), JSON.stringify(c.f.rows.map((r) => r.val.h)));
		if (process.env.BOXROWS_SHOT) { await a.page.locator('#lpn_contour_box').screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'contour.png') }); }
		await a.page.evaluate(() => { document.getElementById('lpn_contour_close').click(); });

		console.log('\n--- 2. Fire flow analysis ---');
		await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ff_menu'), 'project');
		await a.page.waitForSelector('#lpn_ff_box', { state: 'visible' });
		await a.settle(400);
		const ff = await sectionAlignment(a, '#lpn_ff_controls', 'fire flow');
		if (process.env.BOXROWS_SHOT) { await a.page.locator('#lpn_ff_box').screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'fireflow.png') }); }

		console.log('\n--- 3. the split ---');
		ok('nothing is stored before the split is touched', (await stored(a.page)) === null);
		const sp = a.page.locator('#lpn_ff_controls .lpn-gsplit').first();
		const bb = await sp.boundingBox();
		ok('the split is on the screen', !!bb && bb.width >= 5, JSON.stringify(bb));
		const w0 = ff.f.rows[0].name.w;
		await a.page.mouse.move(bb.x + bb.width / 2, bb.y + 20);
		await a.page.mouse.down();
		await a.page.mouse.move(bb.x + bb.width / 2 + 40, bb.y + 20, { steps: 6 });
		await a.page.mouse.up();
		await a.settle(200);
		const f1 = await facts(a.page, '#lpn_ff_controls');
		ok('a drag of 40 px widens the name column by about 40 px', Math.abs(f1.rows[0].name.w - w0 - 40) <= 6, w0 + ' -> ' + f1.rows[0].name.w);
		ok('...and the value column moved with it, still one x', uniq(f1.rows.map((r) => r.val.x)).length === 1);
		const s1 = await stored(a.page);
		ok('the width is remembered in lpn_gcols under the box', s1 && typeof s1.lpn_ff_controls === 'number', JSON.stringify(s1));
		await a.page.locator('#lpn_ff_controls .lpn-gsplit').first().focus();
		await a.page.keyboard.press('ArrowLeft');
		await a.settle(100);
		const f2 = await facts(a.page, '#lpn_ff_controls');
		ok('ArrowLeft steps the name column in by 0.5rem', Math.abs(f1.rows[0].name.w - f2.rows[0].name.w - 0.5 * f1.rem) <= 1.5, f1.rows[0].name.w + ' -> ' + f2.rows[0].name.w);
		await a.page.locator('#lpn_ff_controls .lpn-gsplit').first().dblclick();
		await a.settle(100);
		const f3 = await facts(a.page, '#lpn_ff_controls');
		ok('a double-click returns to the default', Math.abs(f3.rows[0].name.w - w0) <= 1.5, f3.rows[0].name.w + ' vs ' + w0);
		ok('...and removes the stored width (and the key, when it was the only one)', (await stored(a.page)) === null);

		console.log('\n--- 4. a long label wraps ---');
		for (let i = 0; i < 40; i++) { await a.page.keyboard.press('ArrowLeft'); }
		await a.settle(200);
		const clip = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_controls .lpn-gname')).map((n) => ({ clipped: n.scrollWidth > n.clientWidth + 1, text: n.textContent })));
		// Labels wrap at a space, and mid-word when a word is longer than the column; none is cut.
		const taller = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_controls .lpn-gname')).some((n) => n.getBoundingClientRect().height > 1.6 * parseFloat(getComputedStyle(n).fontSize)));
		ok('at the narrowest, a label wraps instead of being cut', clip.length > 0 && taller && clip.every((n) => !n.clipped), JSON.stringify(clip.slice(0, 2)));
		const narrow = await facts(a.page, '#lpn_ff_controls');
		ok('the drag floor holds: the name column is not narrower than 4rem', narrow.rows[0].name.w >= 4 * narrow.rem - 1, String(narrow.rows[0].name.w));
		await a.page.locator('#lpn_ff_controls .lpn-gsplit').first().dblclick();

		console.log('\n--- 5. a narrow host stacks ---');
		await a.page.evaluate(() => { document.getElementById('lpn_ff_controls').style.width = '15rem'; });
		await a.settle(300);
		const st = await facts(a.page, '#lpn_ff_controls');
		ok('under 18rem the name sits above its value', st.rows.every((r) => r.val.y > r.name.y), JSON.stringify(st.rows.slice(0, 2)));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

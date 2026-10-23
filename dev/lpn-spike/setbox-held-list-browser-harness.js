// SETTINGS BOX: A ROW OF SEVERAL SETTINGS LISTS ITS OVERRIDDEN ONES, EACH CLEARED ON ITS OWN
// Real Chromium, Net1, Base > Peak. Tom, 2026-10-23: "Is it completely unfeasible to show these
// individually? ... a line for dots between the display toggle and the row of columns."
//   node dev/lpn-spike/setbox-held-list-browser-harness.js   (takes the browser lock itself)
// Peak states two settings of the link label Diameter: its decimals (3) and its Before text ("D=").
//   S1  the Diameter row has its group dot, and the line under it lists two items, each with its own dot
//       and "<setting>: clear restores <Base value>, the value in Base."
//   S2  clicking one item's dot clears that one setting only: Peak still states the other, the list
//       shrinks to one item, the row keeps its group dot.
//   S3  the row's group dot clears what is left and the list goes away.
//   S4  a search that shows the row keeps its list; one that hides the row hides it.
//   S5  Base shows no list.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SBHL_LOCKED';
const NAME = 'setbox-held-list-browser-harness';
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
	const errors = [];
	let a = null, page = null;
	try {
		const open = async (active) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			d.scenarios.push({ id: 'peak', name: 'Peak', overrides: {}, settings: { labelSettings: { decimals: { link: { diameter: 3 } }, prefix: { link: { diameter: 'D=' } } } } });
			d.project = Object.assign({}, d.project, { activeScenario: active });
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(([txt]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, [JSON.stringify(d)]);
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await page.setViewportSize({ width: 1500, height: 1000 });
			await a.settle(2500);
			await a.toolbarClick(await a.lang('lpn_tool_settings'));
			await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
			await a.settle(800);
		};
		const ROW = `#lpn_settings_box [data-lpn-setting*='"decimals","link","diameter"']`;
		const state = () => page.evaluate((sel) => {
			const row = document.querySelector(sel);
			const list = row && row.nextElementSibling && row.nextElementSibling.classList.contains('lpn-set-heldlist') ? row.nextElementSibling : null;
			return { rowDot: !!(row && row.querySelector(':scope > .lpn-ovm .lpn-ovm-dot')),
				items: list ? Array.from(list.querySelectorAll('.lpn-set-helditem')).map((i) => ({ text: i.textContent.trim(), tip: i.querySelector('.lpn-ovm-dot').title })) : [],
				hidden: list ? list.style.display === 'none' || list.offsetParent === null : null };
		}, ROW);
		const stored = () => page.evaluate(() => { const p = JSON.parse(localStorage.getItem('lpn_project_hover')); const s = p.scenarios.find((x) => x.id === 'peak'); return JSON.stringify((s.settings || {}).labelSettings || {}); });
		const clickItem = async (n) => {
			await page.evaluate(([sel, n]) => document.querySelector(sel).nextElementSibling.querySelectorAll('.lpn-ovm-dot')[n].click(), [ROW, n]);
			await a.settle(1200);
		};

		console.log('--- S1 ---');
		await open('peak');
		let s = await state();
		ok('S1 the Diameter row has its group dot and a list of two', s.rowDot && s.items.length === 2, JSON.stringify(s));
		ok('S1 every item has its own dot, "Click to clear this override."', s.items.every((i) => i.tip === 'Click to clear this override.'), JSON.stringify(s.items));
		ok('S1 each item says what Clear restores and where from, in Base', s.items.every((i) => /: clear restores .+, the value in Base\.$/.test(i.text)), JSON.stringify(s.items.map((i) => i.text)));

		console.log('--- S2 ---');
		const before = await stored();
		await clickItem(0);
		s = await state();
		const after = await stored();
		ok('S2 one item cleared: the list has one item and the row keeps its dot', s.rowDot && s.items.length === 1, JSON.stringify(s));
		ok('S2 Peak still states one of the two, and the stored settings changed', after !== before && (/D=/.test(after) !== /"diameter":3/.test(after)), before + ' -> ' + after);

		console.log('--- S3 ---');
		await page.evaluate((sel) => document.querySelector(sel).querySelector(':scope > .lpn-ovm .lpn-ovm-dot').click(), ROW);
		await a.settle(1200);
		s = await state();
		ok('S3 the group dot clears the rest: no dot, no list, nothing stored', !s.rowDot && s.items.length === 0 && !/D=|"diameter":3/.test(await stored()), JSON.stringify(s) + ' ' + await stored());

		console.log('--- S4 ---');
		await a.context.close();
		await open('peak');
		await page.fill('#lpn_setbox_filter', 'diameter');
		await a.settle(600);
		s = await state();
		ok('S4 a search showing the row keeps the list', s.items.length === 2 && s.hidden === false, JSON.stringify(s));
		await page.fill('#lpn_setbox_filter', 'zoom');
		await a.settle(600);
		ok('S4 a search not showing the row hides the list', (await state()).hidden !== false);

		console.log('--- S5 ---');
		await a.context.close();
		await open('base');
		s = await state();
		ok('S5 Base shows no list', s.items.length === 0 && !s.rowDot, JSON.stringify(s));
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

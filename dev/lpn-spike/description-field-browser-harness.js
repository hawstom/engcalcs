// **THE PROPERTIES BOX'S DESCRIPTION FIELD** (Roadmap Task 774; Tom, 2026-10-06: *"I added a
// Description to a node in Properties, and it first wouldn't accept a space. Then it wouldn't
// appear. I closed and reopened the project to make it appear."* and *"I edited a Description on a
// node in Properties, exceeding some length limit I didn't know about. My edit wouldn't appear. I
// deleted the Description. That edit wouldn't appear. I edited it in Table. That worked."*). In real
// Chromium, with real key presses:
//   1. a typed space stays in the box and in the stored description;
//   2. a committed edit shows at once in Properties, in the Tables pane and in the project that is
//      saved, with no reopen;
//   3. a long description is stored whole (EPANET's own reader takes a trailing comment to the end
//      of the line), and deleting it afterwards clears it everywhere.
//
//   node dev/lpn-spike/description-field-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DESCFIELD_BROWSER_LOCKED';
const NAME = 'description-field-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		const tabId = await page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('[id^="lpn_pane_tab_"]')).map((e) => e.id);
			return t.filter((i) => /junction/i.test(i))[0] || t.join(',');
		});
		await page.click('#' + tabId);
		await a.settle(800);
		const paneKind = tabId.replace('lpn_pane_tab_', '');

		// open Properties on junction 11 by a click on its symbol
		const at = await page.evaluate(() => {
			const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)'))
				.filter((c) => c.getBoundingClientRect().width > 0);
			const r = ns[0].getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await page.mouse.click(at.x, at.y);
		await a.settle(900);
		const descLabel = await a.lang('lpn_field_desc');
		const nodeId = await page.evaluate(() => { const e = document.querySelector('#lpn_popup input'); return e ? e.value : null; });
		ok('Properties is open on a node', !!nodeId, nodeId);
		const descSel = async () => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((l) => (l.textContent || '').trim().indexOf(t) === 0)[0];
			const i = l && l.querySelector('input');
			if (!i) { return false; }
			i.setAttribute('data-test-desc', '1');
			return true;
		}, descLabel);
		ok('the Description row exists', await descSel());
		const boxValue = () => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((l) => (l.textContent || '').trim().indexOf(t) === 0)[0];
			const i = l && l.querySelector('input');
			return i ? i.value + (i === document.activeElement ? '' : '  [NOT FOCUSED]') : null;
		}, descLabel);
		// what Properties shows after a fresh render, and what the Tables pane shows, and what is saved
		const propsFresh = () => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((l) => (l.textContent || '').trim().indexOf(t) === 0)[0];
			return l ? l.querySelector('input').value : null;
		}, descLabel);
		const tableValue = () => page.evaluate(([kind, id]) => {
			const tds = Array.from(document.querySelectorAll('#lpn_pane_' + kind + ' td.lpn-pane-col-desc'));
			const td = tds.filter((t) => t._lpnPaneId === id)[0];
			if (!td) { return null; }
			const inp = td.querySelector('input');
			return inp ? inp.value : td.textContent;
		}, [paneKind, nodeId]);
		const stored = () => page.evaluate((id) => {
			const s = EngCalcs.lpnSerializeNow ? EngCalcs.lpnSerializeNow() : null;
			if (s) { const n = (s.nodes || []).filter((n) => n.id === id)[0]; return n ? (n.desc || '') : null; }
			const keys = Object.keys(localStorage).filter((k) => /lpn/i.test(k));
			for (const k of keys) {
				const v = localStorage.getItem(k) || '';
				const m = v.indexOf('"id":"' + id + '"');
				if (m < 0) { continue; }
				const seg = v.slice(m, m + 4000), d = /"desc":"((?:[^"\\]|\\.)*)"/.exec(seg.split('},{')[0]);
				return d ? JSON.parse('"' + d[1] + '"') : '';
			}
			return null;
		}, nodeId);

		// ---- 1. a typed space ----
		await page.focus('[data-test-desc]');
		await page.keyboard.type('Corner of Elm', { delay: 20 });
		await a.settle(300);
		ok('typed "Corner of Elm": the box keeps its spaces', (await boxValue()) === 'Corner of Elm', JSON.stringify(await boxValue()));
		await page.keyboard.type(' ', { delay: 20 });
		ok('a trailing typed space stays in the box', (await boxValue()) === 'Corner of Elm ', JSON.stringify(await boxValue()));
		await page.keyboard.type('and Main', { delay: 20 });
		ok('and the next word lands after it', (await boxValue()) === 'Corner of Elm and Main', JSON.stringify(await boxValue()));
		await page.keyboard.press('Tab');
		await a.settle(900);

		// ---- 2. it shows without a reopen ----
		ok('Properties shows it after the commit', (await propsFresh()) === 'Corner of Elm and Main', JSON.stringify(await propsFresh()));
		ok('the Tables pane shows it without a reopen', (await tableValue()) === 'Corner of Elm and Main', JSON.stringify(await tableValue()));
		await a.settle(1200);
		ok('the project that would be saved holds it', (await stored()) === 'Corner of Elm and Main', JSON.stringify(await stored()));

		// ---- 3. a long one, then deleting it ----
		const long = Array.from({ length: 60 }, (_, i) => 'word' + i).join(' ');
		await descSel();
		await page.focus('[data-test-desc]');
		await page.keyboard.press('Control+A');
		await page.keyboard.type(long, { delay: 0 });
		await page.keyboard.press('Tab');
		await a.settle(900);
		ok('a ' + long.length + '-character description reaches Properties whole', (await propsFresh()) === long);
		ok('...the Tables pane whole', (await tableValue()) === long, String((await tableValue() || '').length));
		await a.settle(1200);
		ok('...and the saved project whole', (await stored()) === long, String(((await stored()) || '').length));

		await descSel();
		await page.focus('[data-test-desc]');
		await page.keyboard.press('Control+A');
		await page.keyboard.press('Delete');
		await page.keyboard.press('Tab');
		await a.settle(900);
		ok('deleting it empties Properties', (await propsFresh()) === '', JSON.stringify(await propsFresh()));
		ok('...and the Tables pane', (await tableValue()) === '', JSON.stringify(await tableValue()));
		await a.settle(1200);
		ok('...and the saved project', (await stored()) === '', JSON.stringify(await stored()));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

// CHANGING A UNIT FIRST, RIGHT AFTER OPENING A PROJECT, IN A REAL CHROME (Perry's pass, Task 857).
//
//   node dev/lpn-spike/unit-change-first-browser-harness.js
//
// The page remembers each unit select's PREVIOUS unit to know what a change moves from. A project
// opened with a unit that differs from the page's default (an SI example on a US page) must install
// that memory, or the first change converts from the wrong unit or asks nothing. Open an example,
// change the unit FIRST, and check that the question appears, Cancel puts it back, and Convert moves
// the typed numbers by the right factor.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const NAME = 'unit-change-first-browser-harness';
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_UCF_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const L = {};
		const fresh = async (key) => {
			const a = await Session.open(browser, 'ucf', { viewport: { width: 1500, height: 950 }, extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
			await a.goto('Looped-Network.php?ec_nolog=1');
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			for (const k of ['lpn_units_nondestructive', 'lpn_units_destructive', 'lpn_cancel', 'lpn_ex_net1_title', 'lpn_ex_net1_si_title', 'lpn_field_tank_minvol', 'lpn_result_tank_volume', 'lpn_pane_toggle']) { L[k] = await a.lang(k); }
			await a.openExampleCard(L[key]);
			await a.settle(800);
			return a;
		};
		const press = (a, label) => a.page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return !!b;
		}, label);
		const setSel = (a, name, v) => a.page.evaluate(([n, u]) => { const s = document.getElementById(n); s.value = u; s.dispatchEvent(new Event('change', { bubbles: true })); }, [name, v]);
		const stored = (a, id, prop) => a.page.evaluate(([i, p]) => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const d = JSON.parse(localStorage.getItem('lpn_project_' + ix.openId) || 'null');
			const n = d.nodes.find((x) => String(x.id) === String(i));
			return n && n[p];
		}, [id, prop]);
		const openTank = async (a) => {
			const bb = await (await a.page.$('.lpn-node-hit[data-node="2"]')).boundingBox();
			await a.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
			await a.settle(900);
		};
		const typeMinVol = async (a, v) => {
			const done = await a.page.evaluate((v) => {
				const box = document.getElementById('lpn_popup_fields');
				const labs = Array.from(box.querySelectorAll('label')).filter((l) => /^Minimum volume/.test(l.textContent));
				if (!labs.length) { return false; }
				const row = labs[0].closest('div') || labs[0].parentElement;
				const inp = labs[0].querySelector('input') || (row && row.querySelector('input'));
				if (!inp) { return false; }
				inp.value = String(v); inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
				return true;
			}, v);
			await a.settle(500);
			return done;
		};
		const popupLabels = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		const tankHeads = async (a) => {
			await a.page.click('#lpn_pane_tab_tanks'); await a.settle(600);
			return a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_tanks table th')).map((h) => h.textContent.replace(/­/g, '')));
		};
		const graphText = (a) => a.page.evaluate(() => { const h = document.getElementById('lpn_pgraph_chart'); return h ? h.textContent : ''; });
		const dialogOpen = (a) => a.dialog().then((d) => !!d);

		console.log('\n--- the SI twin on a US page: the FIRST change of a unit asks ---');
		const b = await fresh('lpn_ex_net1_si_title');
		const first = [['lpn_u_length', 'ft']];
		for (const [n, to] of first) {
			const was = await b.page.evaluate((n) => document.getElementById(n).value, n);
			await setSel(b, n, to);
			await b.settle(500);
			ok(n + ' (' + was + ' -> ' + to + ') asks the question as its first change', await dialogOpen(b));
			await press(b, L.lpn_cancel);
			await b.settle(400);
			ok(n + ' Cancel puts it back to ' + was, await b.page.evaluate((n) => document.getElementById(n).value, n) === was);
		}
		// Convert on the first change: the numbers move by the factor from the unit the PROJECT was in.
		const pipeLen = () => b.page.evaluate(() => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const d = JSON.parse(localStorage.getItem('lpn_project_' + ix.openId) || 'null');
			const p = d.links.find((l) => l.type === 'pipe' && typeof l._length === 'number');
			return p && { id: p.id, v: p._length };
		});
		const l0 = await pipeLen();
		await setSel(b, 'lpn_u_length', 'ft');
		await b.settle(500);
		await press(b, L.lpn_units_destructive);
		await b.settle(900);
		const l1 = await pipeLen();
		ok('Length Convert as the first change: ' + l0.v + ' m became ' + (l0.v / 0.3048).toFixed(3) + ' ft', !!l1 && l1.id === l0.id && Math.abs(l1.v - l0.v / 0.3048) < 1e-6 * l0.v, JSON.stringify(l1));
		await b.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

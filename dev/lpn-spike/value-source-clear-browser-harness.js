// CLEARING THE PARENT'S OVERRIDE IN THE JUNCTION TABLE UNDOES THE CHILD'S DASHED RING AT ONCE.
//   node dev/lpn-spike/value-source-clear-browser-harness.js   (takes the browser lock itself)
// Tom, 2026-10-25: "The tip for the dashed gray junction keeps opening after I cleared the parent
// override in the Junction table until I switch scenarios away and back."
// Basic mode off. Base > Peak > Fire; Peak states junction 10's elevation, Fire states nothing, so
// Fire draws junction 10 dashed gray with its tip. Fire stays open; Show scenarios on; the Peak row's
// elevation cell is cleared from the table's right-click menu.
//   (The pointer has hovered the junction first: that arms the tip layer, which is what held the stale text.)
//   C1  before: the circle is dashed gray and carries the tip.
//   C2  after: no dashed class and no tip on the circle, with no scenario switch.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VSCLEAR_LOCKED';
const NAME = 'value-source-clear-browser-harness';
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
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.scenarios.push({ id: 'peak', name: 'Peak', overrides: { 'n:10': { elev: 701 } } }, { id: 'fire', name: 'Fire', parent: 'peak', overrides: {} });
		d.project = Object.assign({}, d.project, { activeScenario: 'fire' });
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(([txt]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, [JSON.stringify(d)]);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1400, height: 900 });
		await a.settle(2500);
		const L = async (k) => a.lang(k);
		const circle = () => page.evaluate(() => {
			const e = document.querySelector('#lpn_canvas .lpn-node[data-node="10"]');
			const t = e && Array.from(e.childNodes).filter((n) => n.nodeName === 'title')[0];
			// What a reader could be shown: the live <title>, or the text the tip layer armed and cached.
			const armed = e ? (e.getAttribute('data-bs-original-title') || e.getAttribute('title') || '') : '';
			return { inh: !!e && e.classList.contains('lpn-override-inh'), tip: (t ? t.textContent : '') || armed };
		});
		// Tom had hovered the junction, which arms the tip layer (it moves the <title> into an attribute).
		const box = await page.evaluate(() => { const r = document.querySelector('#lpn_canvas .lpn-node[data-node="10"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await page.mouse.move(box.x, box.y);
		await a.settle(900);
		const c1 = await circle();
		ok('C1 before: junction 10 is dashed gray with its tip', c1.inh && /inherits/.test(c1.tip), JSON.stringify(c1));
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		await page.mouse.move(5, 5);
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(800);
		const menuPick = (t) => page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim().indexOf(t) === 0)[0];
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!b;
		}, t);
		await page.click('#lpn_pane_junctions td.lpn-pane-col-elev', { button: 'right' });
		await a.settle(300);
		await menuPick(await L('lpn_pane_scn_show'));
		await a.settle(2000);
		// The Peak row of junction 10.
		const cell = await page.evaluateHandle(() => {
			const rows = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody tr'));
			const tr = rows.filter((r) => { const s = r.querySelector('td.lpn-pane-col-scn_name'); const i = r.querySelector('td.lpn-pane-col-id'); return s && s.textContent.trim() === 'Peak' && i && i.textContent.trim() === '10'; })[0];
			return tr && tr.querySelector('td.lpn-pane-col-elev');
		});
		ok('the Peak row of junction 10 is in the table', !!cell.asElement());
		await cell.asElement().click();
		await cell.asElement().click({ button: 'right' });
		await a.settle(300);
		ok('Clear override is offered', await menuPick(await L('lpn_pane_clear_override')));
		await a.settle(100);
		const c2 = await circle();
		ok('C2 at once: no dashed ring and no tip, with no scenario switch', !c2.inh && c2.tip === '', JSON.stringify(c2));
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

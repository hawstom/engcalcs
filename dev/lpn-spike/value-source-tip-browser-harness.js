// THE DASHED GRAY JUNCTION'S TIP IS NOT COVERED BY THE HOVER CARD.
//   node dev/lpn-spike/value-source-tip-browser-harness.js   (takes the browser lock itself)
// Tom, 2026-10-25: "the tip for the dashed gray junction was hard to read because the label-on-hover
// opened over it." Both open at the pointer after the same rest. Base > Peak > Fire; Peak states
// junction 10's elevation, so Fire draws it dashed gray.
//   T1  rest the pointer on junction 10 in Fire: the ring's tip is open and the hover card is not.
//   T2  the same rest on junction 11 (no ring): the hover card opens as before.
//   T3  back on junction 10 after leaving it: still the tip alone.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_VSTIP_LOCKED';
const NAME = 'value-source-tip-browser-harness';
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
		const centre = (id) => page.evaluate((i) => { const r = document.querySelector('#lpn_canvas .lpn-node[data-node="' + i + '"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
		const open = () => page.evaluate(() => ({
			card: Array.from(document.querySelectorAll('.tooltip.lpn-hovercard')).filter((e) => e.classList.contains('show')).length,
			ring: Array.from(document.querySelectorAll('.tooltip')).filter((e) => !e.classList.contains('lpn-hovercard') && e.classList.contains('show') && /dashed gray ring/.test(e.textContent)).length }));
		const rest = async (id) => { const p = await centre(id); await page.mouse.move(p.x + 40, p.y + 40); await a.settle(300); await page.mouse.move(p.x, p.y); await a.settle(1800); return open(); };
		let o = await rest('10');
		ok('T1 junction 10: the ring tip is open and the hover card is not', o.ring === 1 && o.card === 0, JSON.stringify(o));
		o = await rest('11');
		ok('T2 junction 11, no ring: the hover card opens', o.card === 1 && o.ring === 0, JSON.stringify(o));
		o = await rest('10');
		ok('T3 back on junction 10: the tip alone', o.ring === 1 && o.card === 0, JSON.stringify(o));
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

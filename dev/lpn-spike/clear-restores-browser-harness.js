// WHAT CLEAR RESTORES, ONE SENTENCE EVERYWHERE (Tom, 2026-10-24): "Clear restores Yes, the value in Base."
//   node dev/lpn-spike/clear-restores-browser-harness.js   (takes the browser lock itself)
//   C1  Properties, a boolean (Is active): the note under it reads "Clear restores Yes, the value in Base.", no check mark or dash.
//   C2  ...and where the parent holds No, "Clear restores No, the value in Peak."
//   C3  Properties, a number: the sentence carries the value with the row's unit and names the parent scenario.
//   C4  Settings, a row that edits one setting (number, then yes/no): the same sentence under the row.
//   C5  Settings, a row that edits several (Labels): each held item reads "<setting>: clear restores ..., the value in Base."
//   C6  no note anywhere still carries the old "Base scenario:" wording or a check mark.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CLRRES_LOCKED';
const NAME = 'clear-restores-browser-harness';
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

		const open = async (active, mut, w) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			d.scenarios.push({ id: 'peak', name: 'Peak', overrides: { 'n:10': { elev: 701, active: false } }, settings: { textSize: 14, showArrows: false, labelSettings: { decimals: { link: { diameter: 3 } } } } },
				{ id: 'fire', name: 'Fire', parent: 'peak', overrides: { 'n:10': { elev: 702, active: true } }, settings: { textSize: 16 } });
			d.settings = Object.assign({}, d.settings, { textSize: 12, showArrows: true });
			d.project = Object.assign({}, d.project, { activeScenario: active });
			if (mut) { mut(d); }
			if (a) { await a.context.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(([txt]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, [JSON.stringify(d)]);
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await page.setViewportSize({ width: w || 1500, height: 1000 });
			await a.settle(2500);
			return d;
		};
		const openNode = async (id) => {
			const p = await page.evaluate((i) => {
				const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).filter((x) => x.getBoundingClientRect().width > 0)[0];
				const r = e.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, id);
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		};
		// Each overridden row's label and the note under it.
		const rows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ov-note')).map((n) => {
			let p = n.previousElementSibling, label = '';
			while (p && !(p.tagName === 'LABEL' && !p.classList.contains('lpn-ov-note'))) { p = p.previousElementSibling; }
			label = p ? p.textContent.replace(/\s+/g, ' ').trim() : '';
			return { label, note: n.querySelector('.lpn-ov-base').textContent.trim() };
		}));
		const T = async () => page.evaluate(() => EngCalcs.pageConfig);
		const says = (pc, v, parent) => pc.lpn_ovm_restores.replace('{value}', v).replace('{source}', pc.lpn_settings_held_from.replace('{parent}', parent));

		console.log('--- C1/C3. Properties in Peak ---');
		await open('peak');
		await openNode('10');
		let pc = await T();
		let r = await rows();
		console.log('    ' + JSON.stringify(r));
		const act = r.find((x) => /active/i.test(x.label)), elev = r.find((x) => /elev/i.test(x.label));
		ok('C1 Is active: "' + says(pc, pc.lpn_settings_table_yes, 'Base') + '"', !!act && act.note === says(pc, pc.lpn_settings_table_yes, 'Base'), JSON.stringify(act));
		const unit = elev && (/\(([^()]+)\)\s*\??\s*$/.exec(elev.label) || [])[1];
		ok('C3 Elevation keeps its unit and names Base: "Clear restores 710 <unit>, the value in Base."', !!elev && !!unit && elev.note === says(pc, '710 ' + unit, 'Base'), JSON.stringify([elev, unit]));
		ok('C6 no note has a check mark, a dash or the old wording', r.every((x) => !/[✓—]|Base scenario:/.test(x.note)), JSON.stringify(r));

		console.log('--- C2. Properties in Fire (child of Peak) ---');
		await open('fire');
		await openNode('10');
		r = await rows();
		const act2 = r.find((x) => /active/i.test(x.label)), elev2 = r.find((x) => /elev/i.test(x.label));
		ok('C2 Is active in Fire: "Clear restores No, the value in Peak."', !!act2 && act2.note === says(pc, pc.lpn_settings_table_no, 'Peak'), JSON.stringify(act2));
		ok('C3 Elevation in Fire: 701 with its unit, the value in Peak', !!elev2 && elev2.note === says(pc, '701 ' + unit, 'Peak'), JSON.stringify(elev2));

		console.log('--- C4/C5. Settings box in Peak ---');
		await open('peak');
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(900);
		const under = (key) => page.evaluate((k) => {
			const row = document.querySelector("#lpn_settings_box [data-lpn-setting='" + k + "']");
			const l = row && row.nextElementSibling;
			return l && l.classList.contains('lpn-set-heldlist') ? l.textContent.replace(/\s+/g, ' ').trim() : null;
		}, key);
		// Held by typing and ticking in Peak, as a visitor does.
		const ts0 = await page.evaluate(() => document.querySelector("#lpn_settings_box [data-lpn-setting='[[\"settings\",\"textSize\"]]'] input").value);
		await page.evaluate(() => { const i = document.querySelector("#lpn_settings_box [data-lpn-setting='[[\"settings\",\"textSize\"]]'] input"); i.value = String(+i.value + 6); i.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(900);
		const arrow0 = await page.evaluate(() => { const i = document.querySelector("#lpn_settings_box [data-lpn-setting='[[\"settings\",\"showArrows\"]]'] input"); return i.checked; });
		await page.evaluate(() => { const i = document.querySelector("#lpn_settings_box [data-lpn-setting='[[\"settings\",\"showArrows\"]]'] input"); i.click(); });
		await a.settle(900);
		const ts = await under('[["settings","textSize"]]'), arrows = await under('[["settings","showArrows"]]');
		console.log('    ' + JSON.stringify([ts, arrows]));
		ok('C4 Text size (one setting), a number: "Clear restores <Base text size>, the value in Base."', ts === says(pc, ts0, 'Base'), JSON.stringify(ts));
		ok('C4 Show arrows (one setting), a yes/no: "Clear restores <Yes or No as Base has it>, the value in Base."', arrows === says(pc, arrow0 ? pc.lpn_settings_table_yes : pc.lpn_settings_table_no, 'Base'), JSON.stringify(arrows));
		const lab = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-heldlist .lpn-set-helditem')).map((i) => i.textContent.trim()));
		const want = says(pc, '0', 'Base');
		ok('C5 a Labels row item reads "<setting>: clear restores ..., the value in Base."', lab.length >= 1 && lab.every((t) => /^[^:]+: clear restores .+, the value in Base\.$/.test(t)) && lab.some((t) => /^Decimals: /.test(t)), JSON.stringify(lab) + ' ' + want);
		ok('C6 no Settings note has a check mark or the old wording', lab.concat([ts, arrows]).every((t) => !/[✓—]|Base scenario:/.test(t || '')));
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

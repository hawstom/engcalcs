// SHORT LABELS AND "Edit curves…" IN PROPERTIES, IN A REAL BROWSER (Tom, 2026-10-27, tasks 838 and 839).
//   (a) every curve pull-down in Properties (pump head curve, pump efficiency curve, GPV head loss
//       curve) ends with "Edit curves…"; choosing it opens Libraries on its Curves section and puts the
//       pull-down back to what it held, the element's stored reference unchanged; no separate Curves link.
//   (b) the renamed labels stand in Properties on a pipe, a tank, a valve and a junction, each of the
//       renamed ones with a tip that begins with the full name; no label prints a doubled "?".
//
//   node dev/lpn-spike/short-labels-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHORTLABELS_LOCKED';
const NAME = 'short-labels-browser-harness';
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
const L = (page, key) => page.evaluate((k) => EngCalcs.pageConfig[k], key);

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const load = (f) => JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', f), 'utf8'));
	async function start(project) {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(project));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1366, height: 768 });
		await a.settle(2500);
		return a;
	}
	async function openEl(a, kind, id) {
		await a.page.evaluate(() => { const b = document.querySelector('#lpn_popup .lpn-popover-x, #lpn_popup [id$="_close"]'); if (b) { b.click(); } });
		await a.settle(300);
		const p = await a.page.evaluate(([k, i]) => {
			const sel = k === 'link' ? '#lpn_canvas [data-link="' + i + '"]' : '.lpn-node-hit[data-node="' + i + '"]';
			const el = Array.from(document.querySelectorAll(sel)).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [kind, id]);
		if (!p) { return false; }
		await a.page.mouse.click(p.x, p.y);
		await a.settle(900);
		return true;
	}
	// Every row of Properties: its label text (without the ?), and the tip text carried by its help mark.
	const rows = (page) => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => {
		const help = l.querySelector('.ec-help');
		const clone = l.cloneNode(true);
		clone.querySelectorAll('input,select,textarea,button').forEach((e) => e.remove());
		return { text: clone.textContent.replace(/\s+/g, ' ').trim(), tip: help ? (help.title || help.getAttribute('data-bs-original-title') || '') : '' };
	}));
	const find = (rs, start) => rs.filter((r) => r.text.indexOf(start) === 0)[0];

	// ---- (b) labels and tips -------------------------------------------------------------------
	const net1 = load('Net1.lwn');
	net1.settings.quality = Object.assign({}, net1.settings.quality, { mode: 'chemical' });
	let a = await start(net1);
	const want = {
		kmShort: await L(a.page, 'lpn_field_km_short'), bulk: await L(a.page, 'lpn_reaction_bulk_short'), wall: await L(a.page, 'lpn_reaction_wall_short'),
		tankR: await L(a.page, 'lpn_reaction_tank_short'), init: await L(a.page, 'lpn_field_tank_level_short'), min: await L(a.page, 'lpn_field_tank_minlevel_short'),
		max: await L(a.page, 'lpn_field_tank_maxlevel_short'), act: await L(a.page, 'lpn_field_active_short'), cv: await L(a.page, 'lpn_field_cv_short'),
		type: await L(a.page, 'lpn_full_col_type')
	};
	ok('every renamed label key is stated', Object.keys(want).every((k) => !!want[k]), JSON.stringify(want));
	const noDouble = (rs) => rs.every((r) => !/\?\s*\?/.test(r.text));

	console.log('\n--- pipe ---');
	ok('Net1 pipe 10 opens', await openEl(a, 'link', '10'));
	let rs = await rows(a.page);
	let r;
	r = find(rs, 'Minor loss'); ok('the pipe has "Minor loss, k" with a tip that begins with the full name', !!r && /^Minor loss, k\b/.test(r.text) && /^Minor \(local\) loss coefficient, k: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Bulk reaction'); ok('the pipe has "Bulk reaction" with a tip that begins "Bulk reaction coefficient: "', !!r && /^Bulk reaction coefficient: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Wall reaction'); ok('the pipe has "Wall reaction" with a tip that begins "Wall reaction coefficient: "', !!r && /^Wall reaction coefficient: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Active'); ok('the pipe has "Active" (not "Is active?") with its tip, and no doubled question mark', !!r && !!r.tip && noDouble(rs) && !rs.some((x) => /Is active/.test(x.text)), JSON.stringify(r));
	r = find(rs, 'Check valve'); ok('the pipe has "Check valve" (no "(CV)") with its tip', !!r && !/\(CV\)/.test(r.text) && /check valve/i.test(r.tip), JSON.stringify(r));
	ok('no old long label is left in the pipe box', !rs.some((x) => /coefficient/i.test(x.text)), JSON.stringify(rs.map((x) => x.text)));

	console.log('\n--- tank ---');
	ok('Net1 tank 2 opens', await openEl(a, 'node', '2'));
	rs = await rows(a.page);
	r = find(rs, 'Initial depth'); ok('"Initial depth" with its tip', !!r && /^Initial depth: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Minimum depth'); ok('"Minimum depth" with its tip', !!r && /^Minimum depth: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Maximum depth'); ok('"Maximum depth" with its tip', !!r && /^Maximum depth: /.test(r.tip), JSON.stringify(r));
	r = find(rs, 'Reaction'); ok('"Reaction" with a tip that begins "Reaction coefficient: "', !!r && /^Reaction coefficient: /.test(r.tip), JSON.stringify(r));
	ok('the tank box has no "water depth" label', !rs.some((x) => /water depth/i.test(x.text)), JSON.stringify(rs.map((x) => x.text)));

	console.log('\n--- junction ---');
	ok('Net1 junction 11 opens', await openEl(a, 'node', '11'));
	rs = await rows(a.page);
	r = find(rs, 'Active'); ok('the junction has "Active" with its tip, one question mark at most', !!r && !!r.tip && noDouble(rs), JSON.stringify(r));
	await a.close();

	console.log('\n--- valves and curves ---');
	a = await start(load('Valves.lwn'));
	const heldRefs = {};
	for (const [id, vt] of [['PRV1', 'PRV'], ['TCV1', 'TCV'], ['GPV1', 'GPV']]) {
		ok(id + ' opens', await openEl(a, 'link', id));
		rs = await rows(a.page);
		r = find(rs, 'Type'); ok(id + ': the valve type row is "Type" with the valve type tip', !!r && /^Type\b/.test(r.text) && /^Valve type\./.test(r.tip), JSON.stringify(r));
		r = find(rs, 'Minor loss'); 
		if (vt === 'TCV') { ok('TCV: no minor loss row (its loss is its setting)', !r); }
		else { ok(id + ': "Minor loss, k" with the valve tip beginning with the full name', !!r && /^Minor \(local\) loss coefficient, k: the loss through the valve body/.test(r.tip), JSON.stringify(r)); }
		if (vt === 'GPV') {
			const sels = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields select')).map((s) => ({ last: s.options[s.options.length - 1].textContent, value: s.value })));
			const sel = sels.filter((s) => s.last === 'Edit curves…')[0];
			ok('the GPV head loss curve pull-down ends with "Edit curves…"', !!sel, JSON.stringify(sels));
			heldRefs.gpv = sel && sel.value;
			const links = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-pane-goto')).map((b) => b.textContent.trim()));
			ok('and no separate Curves link stands in Properties', links.length === 0, JSON.stringify(links));
			await a.page.evaluate(() => { const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => x.options[x.options.length - 1].textContent === 'Edit curves…')[0]; s.value = s.options[s.options.length - 1].value; s.dispatchEvent(new Event('change', { bubbles: true })); });
			await a.settle(800);
			const after = await a.page.evaluate(() => {
				const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => x.options[x.options.length - 1].textContent === 'Edit curves…')[0];
				const lib = document.getElementById('lpn_library_box'), cur = document.getElementById('lpn_libbox_link_curves');
				return { value: s ? s.value : null, libOpen: !!lib && getComputedStyle(lib).display !== 'none', section: !!cur && cur.getAttribute('aria-current') === 'true' };
			});
			ok('choosing "Edit curves…" opens Libraries on Curves', after.libOpen && after.section, JSON.stringify(after));
			ok('...and the pull-down is back to the curve it held (the reference is unchanged)', after.value === heldRefs.gpv, JSON.stringify({ before: heldRefs.gpv, after: after.value }));
		}
	}
	await a.close();

	console.log('\n--- pump curves (Net1 pump 9) ---');
	a = await start(net1);
	ok('pump 9 opens', await openEl(a, 'link', '9'));
	const pumpSels = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields select')).map((s) => ({ last: s.options[s.options.length - 1].textContent, value: s.value })).filter((s) => s.last === 'Edit curves…'));
	ok('the pump head curve pull-down ends with "Edit curves…"', pumpSels.length >= 1, JSON.stringify(pumpSels));
	const pv = pumpSels[0] && pumpSels[0].value;
	await a.page.evaluate(() => { const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => x.options[x.options.length - 1].textContent === 'Edit curves…')[0]; s.value = s.options[s.options.length - 1].value; s.dispatchEvent(new Event('change', { bubbles: true })); });
	await a.settle(800);
	const pa = await a.page.evaluate(() => {
		const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => x.options[x.options.length - 1].textContent === 'Edit curves…')[0];
		const cur = document.getElementById('lpn_libbox_link_curves');
		return { value: s ? s.value : null, section: !!cur && cur.getAttribute('aria-current') === 'true' };
	});
	ok('choosing it opens Libraries on Curves and the pull-down holds its curve', pa.section && pa.value === pv, JSON.stringify({ before: pv, after: pa }));
	await a.close();

	await browser.close();
	env.stopServer();
	console.log('\n' + (failures ? failures + ' FAILURE(S) of ' + checks : 'All ' + checks + ' short-label checks passed.'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

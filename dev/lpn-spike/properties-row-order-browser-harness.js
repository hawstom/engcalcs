// PROPERTIES ROW ORDER (Tom, 2026-10-29: From and To after ID, Active near the top, results last; Ida's table), real clicks. Run with:
//   node dev/lpn-spike/properties-row-order-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ROWORDER_LOCKED';
const NAME = 'properties-row-order-browser-harness';
const SHOTS = process.env.EC_SHOTS || '';
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
// IDA'S ROW ORDER, one table per type, by LANGUAGE KEY (never by English text: the rows' names are read from EngCalcs.pageConfig).
// 'RESULTS' marks where the solver's rows begin; the chemical the project tracks names its own result rows (project data, not a
// language key), so a row no key names is allowed only below every input. A box shows only the rows that apply (chemical rows
// under a chemical run, results after a run), so the test is: shown rows are in the table's order, the rows a case needs are
// shown, the first rows are the ones Tom named, and no input stands below a result.
const TABLES = {
	junction: ['lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_elev', 'lpn_field_x', 'lpn_field_y', 'lpn_field_emitter', 'lpn_field_base_demand', 'lpn_field_demand_pattern', 'lpn_demand_cats', 'bpn_demand', 'lpn_node_customers', 'lpn_ff_required', 'lpn_quality_initial', 'lpn_source_type', 'lpn_source_quality', 'lpn_source_pattern', 'RESULTS', 'lpn_field_head', 'lpn_result_pressure', 'lpn_result_delivered_demand', 'lpn_result_demand_deficit'],
	reservoir: ['lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_elev', 'lpn_field_x', 'lpn_field_y', 'lpn_field_head', 'lpn_field_head_pattern', 'lpn_quality_initial', 'lpn_source_type', 'lpn_source_quality', 'lpn_source_pattern', 'RESULTS'],
	tank: ['lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_elev', 'lpn_field_tank_base_elev', 'lpn_field_tank_diameter', 'lpn_field_tank_minlevel_short', 'lpn_field_tank_maxlevel_short', 'lpn_field_x', 'lpn_field_y', 'lpn_field_tank_level_short', 'lpn_reaction_tank_short', 'lpn_mixing_model', 'lpn_mixing_fraction', 'lpn_quality_initial', 'lpn_source_type', 'lpn_source_quality', 'lpn_source_pattern', 'RESULTS', 'lpn_field_head', 'lpn_result_pressure', 'lpn_result_depth', 'lpn_result_tank_volume'],
	pipe: ['lpn_field_from', 'lpn_field_to', 'lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_pipetype', 'lpn_field_diameter', 'lpn_field_roughness', 'lpn_field_fittings', 'lpn_field_km_short', 'lpn_field_auto_length', 'lpn_field_length', 'lpn_field_closed', 'lpn_field_cv_short', 'lpn_reaction_bulk_short', 'lpn_reaction_wall_short', 'RESULTS', 'lpn_result_flow', 'lpn_result_velocity', 'lpn_result_headloss', 'lpn_result_gradient', 'lpn_result_status', 'lpn_result_reaction_rate'],
	pump: ['lpn_field_from', 'lpn_field_to', 'lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_pump_curve_source', 'lpn_pump_effic_curve', 'lpn_field_closed', 'lpn_field_pump_speed', 'lpn_field_speed_pattern', 'lpn_energy_price', 'lpn_energy_price_pattern', 'RESULTS', 'lpn_result_flow', 'lpn_field_head', 'lpn_result_status'],
	valve: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', 'lpn_field_active_short', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_diameter', 'lpn_field_km_short', 'lpn_field_valve_setting_pressure', 'lpn_field_valve_setting_drop', 'lpn_field_valve_setting_flow', 'lpn_field_valve_setting_loss', 'lpn_gpv_curve_source', 'lpn_field_closed', 'RESULTS', 'lpn_result_flow', 'lpn_result_velocity', 'lpn_result_headloss', 'lpn_result_status'],
	customer: ['lpn_field_meter_pipe', 'lpn_field_meter_node', 'lpn_field_meter_station', 'lpn_field_meter_offset', 'lpn_field_meter_lumped', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_meter_demand', 'lpn_field_demand_pattern', 'lpn_field_meter_count', 'lpn_field_meter_total', 'RESULTS'],
	text: ['#words', 'lpn_field_active_short', 'lpn_field_desc', 'lpn_field_x', 'lpn_field_y', 'lpn_field_text_size', 'lpn_field_text_bold', 'lpn_field_text_align', 'lpn_field_text_valign', 'lpn_field_text_rotation', 'lpn_field_text_all_zoom', 'RESULTS']
};
const nd = (i) => '[data-node="' + i + '"]';
const lk = (i) => '[data-link="' + i + '"]';
const A = 'lpn_field_active_short';
const CASES = [
	{ type: 'junction', file: 'Net1.lwn', sel: nd('22'), need: [A, 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_elev', 'lpn_field_x', 'lpn_field_y', 'lpn_field_base_demand', 'lpn_ff_required', 'lpn_quality_initial', 'lpn_field_head', 'lpn_result_pressure'], firsts: [A] },
	{ type: 'reservoir', file: 'Net1.lwn', sel: nd('9'), need: [A, 'lpn_field_elev', 'lpn_field_head', 'lpn_field_head_pattern', 'lpn_quality_initial'], firsts: [A] },
	{ type: 'tank', file: 'Valves.lwn', sel: nd('T1'), need: [A, 'lpn_field_elev', 'lpn_field_tank_base_elev', 'lpn_field_tank_diameter', 'lpn_field_tank_minlevel_short', 'lpn_field_tank_maxlevel_short', 'lpn_field_tank_level_short', 'lpn_field_head', 'lpn_result_pressure', 'lpn_result_depth', 'lpn_result_tank_volume'], firsts: [A] },
	{ type: 'pipe', file: 'Net1.lwn', sel: lk('22'), need: ['lpn_field_from', 'lpn_field_to', A, 'lpn_field_pipetype', 'lpn_field_diameter', 'lpn_field_length', 'lpn_field_closed', 'lpn_result_flow', 'lpn_result_velocity', 'lpn_result_headloss', 'lpn_result_status'], firsts: ['lpn_field_from', 'lpn_field_to', A] },
	{ type: 'pump', file: 'Net1.lwn', sel: lk('9'), need: ['lpn_field_from', 'lpn_field_to', A, 'lpn_pump_curve_source', 'lpn_field_closed', 'lpn_field_pump_speed', 'lpn_result_flow', 'lpn_field_head', 'lpn_result_status'], firsts: ['lpn_field_from', 'lpn_field_to', A] },
	{ type: 'valve', file: 'Valves.lwn', sel: lk('PRV1'), need: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', A, 'lpn_field_diameter', 'lpn_field_valve_setting_pressure', 'lpn_field_closed', 'lpn_result_flow', 'lpn_result_status'], firsts: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', A] },
	{ type: 'valve', file: 'Valves.lwn', sel: lk('TCV1'), need: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', A, 'lpn_field_diameter', 'lpn_field_valve_setting_loss', 'lpn_field_closed', 'lpn_result_flow'], firsts: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', A] },
	{ type: 'valve', file: 'Valves.lwn', sel: lk('GPV1'), need: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', 'lpn_gpv_curve_source', 'lpn_field_closed', 'lpn_result_flow'], firsts: ['lpn_full_col_type', 'lpn_field_from', 'lpn_field_to', A] },
	{ type: 'customer', file: 'Valves.lwn', sel: '[data-cust="M1"].lpn-meter', need: ['lpn_field_meter_pipe', 'lpn_field_meter_station', 'lpn_field_meter_offset', 'lpn_field_meter_lumped', 'lpn_field_desc', 'lpn_field_tag', 'lpn_field_meter_demand', 'lpn_field_meter_count', 'lpn_field_meter_total'], firsts: [], mut: (d) => { d.customers = [{ id: 'M1', count: 1, link: 'P1', t: 0.5, x: 130, y: 230 }]; } },
	{ type: 'text', file: 'Net1.lwn', sel: '[data-lbl="X1"]', need: [A, '#words', 'lpn_field_desc', 'lpn_field_text_size', 'lpn_field_text_bold'], firsts: ['#words', A] }
];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, r => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		for (const c of CASES) {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', c.file), 'utf8'));
			if (c.mut) { c.mut(d); }
			await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(d));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const x = document.getElementById('ec-consent'); if (x) { x.remove(); } });
			await page.setViewportSize({ width: 1366, height: 1400 });
			await a.settle(2000);
			const at = await page.evaluate((sel) => {
				const el = Array.from(document.querySelectorAll('#lpn_canvas ' + sel)).filter((e) => e.getBoundingClientRect().width > 0)[0];
				if (!el) { return null; }
				const r = el.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, c.sel);
			if (!at) { ok(c.type + ' ' + c.sel + ': found on the map', false); continue; }
			await page.mouse.click(at.x, at.y);
			await a.settle(900);
			const table = TABLES[c.type];
			const keys = await page.evaluate((tbl) => {
				const pc = EngCalcs.pageConfig;
				return Array.from(document.querySelectorAll('#lpn_popup_fields > .lpn-grow')).map((r) => {
					if (r.classList.contains('lpn-text-words-row')) { return '#words'; }
					const n = r.querySelector('.lpn-gname');
					const t = n ? n.textContent.trim() : '';
					let best = null, bl = 0;
					tbl.forEach((k) => { if (typeof pc[k] === 'string' && pc[k] && t.indexOf(pc[k]) === 0 && pc[k].length > bl) { best = k; bl = pc[k].length; } });
					return best || ('?' + t);
				});
			}, table);
			const label = c.type + ' (' + c.sel + ')';
			const RES = table.indexOf('RESULTS');
			const matched = keys.filter((k) => k.charAt(0) !== '?');
			const unknown = keys.filter((k) => k.charAt(0) === '?');
			const ranks = matched.map((k) => table.indexOf(k));
			ok(label + ': rows come in the table\'s order', ranks.every((r, i) => i === 0 || r >= ranks[i - 1]), JSON.stringify(keys));
			ok(label + ': the rows this case needs are all shown', c.need.every((k) => keys.indexOf(k) >= 0), 'missing: ' + JSON.stringify(c.need.filter((k) => keys.indexOf(k) < 0)));
			ok(label + ': first rows are ' + (c.firsts.length ? c.firsts.join(', ') : '(no rule)'), c.firsts.every((k, i) => keys[i] === k), JSON.stringify(keys.slice(0, 4)));
			const firstResult = keys.findIndex((k) => k.charAt(0) !== '?' && table.indexOf(k) > RES);
			const lastInput = keys.reduce((m, k, i) => (k.charAt(0) === '?' ? (c.type === 'pipe' || c.type === 'pump' || c.type === 'junction' || c.type === 'tank' || c.type === 'reservoir' ? m : i) : (table.indexOf(k) < RES ? i : m)), -1);
			ok(label + ': results are last (no input below the first result)', firstResult < 0 || lastInput < firstResult, 'first result at ' + firstResult + ', last input at ' + lastInput + '; unnamed rows: ' + JSON.stringify(unknown));
			ok(label + ': a row no key names (the tracked chemical\'s results) is below every input', unknown.every((u) => keys.indexOf(u) > (matched.length ? keys.lastIndexOf(matched.filter((k) => table.indexOf(k) < RES).pop() || '') : -1)), JSON.stringify(unknown));
			await page.keyboard.press('Escape');
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed' + (errors.length ? '; page errors: ' + errors.join(' | ') : ''));
	process.exit(failures || errors.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

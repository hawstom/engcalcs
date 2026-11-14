// THE CONTOUR BOX SAYS WHAT IS PLOTTED (ROADMAP Task 858). Tom, 2026-11-09/11: with No color chosen under
// Color nodes by, the box gave no point of reference; the order is his. Holds, in Chromium on Net3:
//   1. the rows are in his order: Show plot, Property to plot, Color scheme, Show node colors, Fill,
//      Fill opacity, Buffer, Contour lines, Interval, Labels.
//   2. with node colors off the Property to plot reads a property (never No color) and the plot is drawn.
//   3. an old project (Color nodes by chosen, no Property to plot stated) opens showing the same plot:
//      the box reads that property and Show node colors is ticked; clearing it leaves the plot alone.
//   4. ticking Show node colors colors the dots; changing the property carries them; the plot follows.
//   5. Tom, 2026-11-13: Property to plot and Color scheme in the box ARE Color nodes by and Color scheme
//      under Settings, Symbology, Node colors. A change in either place reads the same in the other (both
//      directions); with No color the plot keeps its property; each ? tip names the other place.
//      The Tables Settings row "Contour property to plot" is the third door, and behaves the same.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/contour-controls-browser-harness.js
// CONTOUR_SHOT=<dir> also writes a screenshot of each view there.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CONTOUR_CONTROLS_LOCKED';
const NAME = 'contour-controls-browser-harness';

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
async function shot(page, name) {
	if (!process.env.CONTOUR_SHOT) { return; }
	await page.screenshot({ path: path.join(process.env.CONTOUR_SHOT, name + '.png') });
}

async function openNet3(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, viewport ? { viewport } : undefined);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	// The consent banner covers the bottom of a phone screen, cards included.
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	return a;
}
// Water > Graphs > Contour, by the rows' own words.
async function contourFromMenu(a) {
	const names = await a.page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
	await a.page.click('#lpn_menu_project');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const clickRow = (sel, label) => a.page.evaluate(([s, l]) => {
		const r = Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).find((b) => {
			const t = Array.from(b.childNodes).filter((n) => !(n.classList && (n.classList.contains('lpn-menu-arrow') || n.classList.contains('lpn-kbdbadge') || n.classList.contains('lpn-menu-key'))))
				.map((n) => n.textContent).join('').trim();
			return t === l || t.indexOf(l) === 0;
		});
		if (r) { r.click(); }
		return !!r;
	}, [sel, label]);
	ok('Water has a Graphs row', await clickRow('#lpn_menu_list', names.g));
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	ok('Graphs has a Contour row', await clickRow('#lpn_menu_list2', names.c));
	await a.settle(600);
}
function layerFacts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour');
		if (!g) { return null; }
		const img = g.querySelector('image.lpn-contour-fill'), r = img ? img.getBoundingClientRect() : null;
		const labels = Array.from(g.querySelectorAll('text.lpn-contour-label'));
		const lb = labels.map((t) => t.getBoundingClientRect());
		return {
			first: g.parentNode.firstChild === g,
			href: img ? (img.getAttribute('href') || '').slice(0, 22) : '',
			opacity: img ? img.getAttribute('opacity') : null,
			imgW: r ? r.width : 0, imgH: r ? r.height : 0,
			lines: Array.from(g.querySelectorAll('path.lpn-contour-line')).map((p) => +p.getAttribute('data-level')),
			breaks: g.querySelectorAll('path.lpn-contour-break').length,
			labels: labels.map((t) => +t.getAttribute('data-level')),
			fontSize: labels.length ? +labels[0].getAttribute('font-size') : 0,
			labelH: lb.length ? lb.reduce((s, b) => s + Math.min(b.width, b.height), 0) / lb.length : 0
		};
	});
}
async function setBox(a, id, value) {
	await a.page.evaluate(([i, v]) => {
		const e = document.getElementById(i);
		if (e.type === 'checkbox') { e.checked = !!v; } else { e.value = String(v); }
		e.dispatchEvent(new Event('change', { bubbles: true }));
	}, [id, value]);
	await a.settle(300);
}

async function openNet3(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, viewport ? { viewport } : undefined);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	// The consent banner covers the bottom of a phone screen, cards included.
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	return a;
}
// Water > Graphs > Contour, by the rows' own words.
async function contourFromMenu(a) {
	const names = await a.page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
	await a.page.click('#lpn_menu_project');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const clickRow = (sel, label) => a.page.evaluate(([s, l]) => {
		const r = Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).find((b) => {
			const t = Array.from(b.childNodes).filter((n) => !(n.classList && (n.classList.contains('lpn-menu-arrow') || n.classList.contains('lpn-kbdbadge') || n.classList.contains('lpn-menu-key'))))
				.map((n) => n.textContent).join('').trim();
			return t === l || t.indexOf(l) === 0;
		});
		if (r) { r.click(); }
		return !!r;
	}, [sel, label]);
	ok('Water has a Graphs row', await clickRow('#lpn_menu_list', names.g));
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	ok('Graphs has a Contour row', await clickRow('#lpn_menu_list2', names.c));
	await a.settle(600);
}
function facts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour'), img = g && g.querySelector('image.lpn-contour-fill');
		const val = (id) => { const e = document.getElementById(id); return e ? (e.type === 'checkbox' ? e.checked : e.value) : null; };
		const dots = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node-junction'));
		const coloured = dots.filter((c) => c.style.color).length;
		const body = document.getElementById('lpn_contour_body');
		const ctrls = Array.from(body.querySelectorAll('input, select, button')).map((e) => e.id || 'ramp');
		return { fill: !!(img && (img.getAttribute('href') || '').indexOf('data:image/png') === 0), coloured, dots: dots.length,
			field: val('lpn_contour_field'),
			fieldOpts: Array.from((document.getElementById('lpn_contour_field') || { options: [] }).options).map((o) => o.value),
			nodes: val('lpn_contour_node_colors'), ctrls,
			legend: (document.getElementById('lpn_color_legend') || {}).textContent || '' };
	});
}
async function main0(Session, browser) {
	console.log('\n--- 1. the order, and the plot with node colors off ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		// Net3 opens with the nodes colored by pressure; the case under test is the nodes plain.
		await setBox(a, 'lpn_contour_node_colors', false);
		let f = await facts(a.page);
		const want = ['lpn_contour_show', 'lpn_contour_field', 'lpn_contour_node_colors', 'lpn_contour_fill', 'lpn_contour_opacity', 'lpn_contour_buffer', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_labels'];
		const got = f.ctrls.filter((x) => want.indexOf(x) >= 0);
		ok('the rows follow Tom\'s order', JSON.stringify(got) === JSON.stringify(want), got.join(' > '));
		const iRamp = f.ctrls.findIndex((x) => x === 'ramp' || /ramp|scheme/i.test(x));
		ok('Color scheme sits between Property to plot and Show node colors', iRamp > f.ctrls.indexOf('lpn_contour_field') && iRamp < f.ctrls.indexOf('lpn_contour_node_colors'), f.ctrls.join(' '));
		ok('Property to plot reads a property, with no No color choice', !!f.field && f.fieldOpts.indexOf('') < 0, f.field + ' of ' + f.fieldOpts.join(','));
		ok('Show node colors is cleared, the dots are plain, and the plot is still drawn', f.nodes === false && f.fill && f.coloured === 0, JSON.stringify({ n: f.nodes, fill: f.fill, col: f.coloured }));
		ok('the color key shows the plotted property', f.legend.length > 0, f.legend.slice(0, 40));
		await shot(a.page, 'contour-controls-desk');

		console.log('\n--- 2. Show node colors colors the dots; the property carries them ---');
		await setBox(a, 'lpn_contour_node_colors', true);
		f = await facts(a.page);
		ok('ticked: the nodes wear the plot\'s colors and the plot stays', f.coloured > 0 && f.fill && f.nodes === true, JSON.stringify({ col: f.coloured, dots: f.dots }));
		await setBox(a, 'lpn_contour_field', 'head');
		f = await facts(a.page);
		ok('changing Property to plot to head: box, plot and dots all follow', f.field === 'head' && f.nodes === true && f.coloured > 0 && f.fill, f.field);
		await setBox(a, 'lpn_contour_node_colors', false);
		f = await facts(a.page);
		ok('cleared: the dots are plain, the plot of head is unchanged', f.coloured === 0 && f.fill && f.field === 'head', JSON.stringify({ col: f.coloured, field: f.field }));
		await setBox(a, 'lpn_contour_field', 'pressure');
		f = await facts(a.page);
		ok('a property chosen with the nodes plain leaves them plain', f.coloured === 0 && f.nodes === false && f.fill, JSON.stringify({ col: f.coloured }));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
async function main1(Session, browser) {
	console.log('\n--- 3. an old project: Color nodes by chosen, no Property to plot stated ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		// Settings is the one editor an old project had; the plot's own property is never touched.
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(400);
		await a.page.evaluate(() => { const n = document.getElementById('lpn_set_color_node'); n.value = 'head'; n.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(400);
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		await contourFromMenu(a);
		const f = await facts(a.page);
		ok('the box reads the old Color nodes by as its Property to plot', f.field === 'head', f.field);
		ok('Show node colors is ticked, the dots are colored, the plot is drawn', f.nodes === true && f.coloured > 0 && f.fill, JSON.stringify({ n: f.nodes, c: f.coloured, fill: f.fill }));
		await shot(a.page, 'contour-controls-old');
		await setBox(a, 'lpn_contour_node_colors', false);
		const g = await facts(a.page);
		ok('clearing Show node colors keeps the plot of head', g.field === 'head' && g.fill && g.coloured === 0, JSON.stringify({ f: g.field, fill: g.fill, c: g.coloured }));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
async function newScenario(a) {
	a.answerPromptWith('Child');
	const label = await a.lang('lpn_scenario_new');
	await a.page.click('#lpn_scenario_btn');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	for (const r of await a.page.$$('#lpn_menu_list button.lpn-menu-row')) {
		if ((await r.textContent()).trim().replace(/^\u2713\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
	}
	await a.settle(1200);
}
async function main2(Session, browser) {
	console.log('\n--- 5. in a child scenario the Property to plot select keeps what was chosen ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await newScenario(a);
		ok('a child scenario is open', await a.page.evaluate(() => !/Scenario:\s*Base\b/.test(document.body.innerText)), await a.page.evaluate(() => (document.body.innerText.match(/Scenario:[^|\n]*/) || [''])[0]));
		await contourFromMenu(a);
		await setBox(a, 'lpn_contour_node_colors', true);
		await setBox(a, 'lpn_contour_field', 'head');
		const f = await facts(a.page);
		ok('the select shows Head, as the map and the key do', f.field === 'head' && /Head/.test(f.legend), f.field + ' | ' + f.legend.slice(0, 30));
		await a.close();

		console.log('\n--- 6. Settings and the box never disagree while node colors are on ---');
		const b = await openNet3(Session, browser, { width: 1440, height: 900 });
		try {
			await contourFromMenu(b);
			await setBox(b, 'lpn_contour_node_colors', true);
			await setBox(b, 'lpn_contour_field', 'head');
			await b.toolbarClick(await b.lang('lpn_tool_settings'));
			await b.settle(400);
			const setNode = (v) => b.page.evaluate((x) => { const n = document.getElementById('lpn_set_color_node'); n.value = x; n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
			await setNode('pressure');
			await b.settle(500);
			let g = await facts(b.page);
			ok('Settings Node colors = Pressure: the plot property and the key follow', g.field === 'pressure' && /Pressure/.test(g.legend) && g.coloured > 0, g.field + ' | ' + g.legend.slice(0, 30));
			await setNode('');
			await b.settle(500);
			g = await facts(b.page);
			ok('Settings Node colors = No color: only the dots clear, the plot keeps Pressure', g.coloured === 0 && g.field === 'pressure' && g.fill && g.nodes === false, JSON.stringify({ c: g.coloured, f: g.field, fill: g.fill, n: g.nodes }));
			ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		} finally { await b.close(); }
		return;
	} catch (e) { await a.close().catch(() => {}); throw e; }
}
// The two Settings names the tips quote are not sent to the page; the language file is their source.
function enValue(key) {
	const src = require('fs').readFileSync(path.join(REPO, 'lib', 'lang.ec.en.php'), 'utf8');
	const m = src.match(new RegExp("^\\$ec_lang\\['" + key + "'\\]='(.*)';$", 'm'));
	if (!m) { throw new Error('no English value for ' + key); }
	return m[1].replace(/\\'/g, "'");
}
async function main3(Session, browser) {
	console.log('\n--- 7. the box and Settings are one setting, and each tip says so ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		await setBox(a, 'lpn_contour_node_colors', true);
		{
			const bb = await (await a.page.$('.lpn-grow:has(#lpn_contour_field) .ec-help')).boundingBox();
			await a.page.mouse.move(bb.x + 20, bb.y + bb.height / 2, { steps: 5 });
			await a.page.mouse.move(bb.x + 24, bb.y + bb.height / 2, { steps: 5 });
			await a.settle(900);
		}
		await shot(a.page, 'tip-box-property');
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);
		const read = () => a.page.evaluate(() => {
			const q = (id) => { const e = document.getElementById(id); return e ? e.value : null; };
			const ramp = (id) => { const e = document.getElementById(id); return e ? e.title : null; };
			return { boxField: q('lpn_contour_field'), setField: q('lpn_set_color_node'),
				boxRamp: ramp('lpn_set_ramp_node_contour'), setRamp: ramp('lpn_set_ramp_node'),
				legend: (document.getElementById('lpn_color_legend') || {}).textContent || '' };
		});
		const setNode = (v) => a.page.evaluate((x) => { const n = document.getElementById('lpn_set_color_node'); n.value = x; n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
		const pick = (btnId, key) => a.page.evaluate(([b, k]) => {
			document.getElementById(b).click();
			const o = document.querySelector('#' + b.replace('lpn_set_ramp_', 'lpn_set_ramp_list_') + ' [data-ramp="' + k + '"]');
			if (o) { o.click(); }
			return !!o;
		}, [btnId, key]);

		// Property, box to Settings.
		await setBox(a, 'lpn_contour_field', 'head');
		let r = await read();
		ok('box: Property to plot = Head, Settings Color nodes by reads Head', r.boxField === 'head' && r.setField === 'head', JSON.stringify(r));
		// Property, Settings to box.
		await setNode('pressure');
		await a.settle(500);
		r = await read();
		ok('Settings: Color nodes by = Pressure, the box Property to plot reads Pressure', r.boxField === 'pressure' && r.setField === 'pressure', JSON.stringify(r));
		// No color: only the dots clear; the plot keeps its property.
		await setNode('');
		await a.settle(500);
		r = await read();
		ok('Settings No color: Color nodes by reads No color, the box keeps Pressure', r.setField === '' && r.boxField === 'pressure', JSON.stringify(r));
		await setBox(a, 'lpn_contour_field', 'head');
		r = await read();
		ok('with No color a property chosen in the box is the plot\'s only: Settings stays No color', r.setField === '' && r.boxField === 'head', JSON.stringify(r));
		await setBox(a, 'lpn_contour_node_colors', true);
		r = await read();
		ok('Show node colors checked: Color nodes by takes the plot\'s property (Head)', r.setField === 'head' && r.boxField === 'head', JSON.stringify(r));

		// Scheme, both directions.
		ok('box: the Color scheme list offers Viridis', await pick('lpn_set_ramp_node_contour', 'viridis'));
		await a.settle(400);
		r = await read();
		ok('box: Color scheme changed, Settings Color scheme reads the same', !!r.boxRamp && r.boxRamp === r.setRamp, r.boxRamp + ' | ' + r.setRamp);
		const first = r.boxRamp;
		ok('Settings: the Color scheme list offers Gray', await pick('lpn_set_ramp_node', 'gray'));
		await a.settle(400);
		r = await read();
		ok('Settings: Color scheme changed, the box reads the same', !!r.boxRamp && r.boxRamp === r.setRamp && r.boxRamp !== first, r.boxRamp + ' | ' + r.setRamp);

		// The tips name the other place, in the suite's own words.
		const t = await a.page.evaluate(() => {
			const pc = EngCalcs.pageConfig;
			const tipOf = (id) => { const e = document.getElementById(id), row = e && e.closest('.lpn-set-row, .lpn-grow'), l = row && row.querySelector('.ec-help'); return l ? (l.title || l.getAttribute('data-bs-original-title') || '') : ''; };
			return { pc: { field: pc.lpn_contour_field_tip, scheme: pc.lpn_contour_scheme_tip, nodes: pc.lpn_contour_node_colors_tip,
				setField: pc.lpn_settings_color_node_field_tip, setRamp: pc.lpn_settings_color_ramp_node_tip,
				colorNodes: pc.lpn_color_node_field, scheme_l: pc.lpn_settings_color_ramp, graphs: pc.lpn_graphs_menu, contour: pc.lpn_contour_menu,
				plot: pc.lpn_contour_field, water: pc.lpn_menu_project },
				boxField: tipOf('lpn_contour_field'), setField: tipOf('lpn_set_color_node'), setRampTip: tipOf('lpn_set_ramp_node') };
		});
		const P = t.pc, there = enValue('lpn_settings_sec_symbology') + ', ' + enValue('lpn_settings_sym_node_colors'), here = P.water + ', ' + P.graphs + ', ' + P.contour;
		ok('Property to plot tip names Color nodes by in ' + there, P.field.indexOf(P.colorNodes) >= 0 && P.field.indexOf(there) >= 0 && /cleared/.test(P.field) && /keeps/.test(P.field), P.field.slice(0, 80));
		ok('every tip is short (160 characters or fewer)', [P.field, P.scheme, P.nodes, P.setField, P.setRamp].every((x) => x.length <= 160), [P.field, P.scheme, P.nodes, P.setField, P.setRamp].map((x) => x.length).join(','));
		ok('Color scheme tip names Color scheme in ' + there, P.scheme.indexOf(P.scheme_l) >= 0 && P.scheme.indexOf(there) >= 0 && /same setting/.test(P.scheme), P.scheme.slice(0, 80));
		ok('Show node colors tip names Color nodes by in ' + there, P.nodes.indexOf(P.colorNodes) >= 0 && P.nodes.indexOf(there) >= 0);
		ok('Settings Color nodes by tip names Property to plot in ' + here, P.setField.indexOf(P.plot) >= 0 && P.setField.indexOf(here) >= 0 && /keeps/.test(P.setField) && /No color/.test(P.setField), P.setField.slice(0, 80));
		ok('Settings Color scheme tip names Color scheme in ' + here, P.setRamp.indexOf(P.scheme_l) >= 0 && P.setRamp.indexOf(here) >= 0 && /same setting/.test(P.setRamp), P.setRamp.slice(0, 80));
		ok('the tips are on the rows themselves', t.boxField === P.field && t.setField === P.setField && t.setRampTip === P.setRamp, JSON.stringify([t.boxField.length, t.setField.length, t.setRampTip.length]));
		// Pictures of the two tips, for the browser pass (CONTOUR_SHOT).
		await a.page.hover('.lpn-set-row:has(#lpn_set_color_node) .ec-help');
		await a.settle(700);
		await shot(a.page, 'tip-settings-color-nodes-by');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
// The third door: the Tables Settings tab's "Contour property to plot" row.
async function main4(Session, browser) {
	console.log('\n--- 8. the Tables Settings row is the same Property to plot ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		const P = await a.page.evaluate(() => ({ plot: EngCalcs.pageConfig.lpn_settings_row_contour_field, node: EngCalcs.pageConfig.lpn_settings_color_node_field, none: EngCalcs.pageConfig.lpn_color_none }));
		await contourFromMenu(a);   // the plot is shown, so its key is on the page whatever the dots do
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_settings');
		await a.settle(700);
		const row = (label) => a.page.evaluate((l) => {
			const out = [];
			document.querySelectorAll('#lpn_pane_settings tbody tr').forEach((tr) => {
				const o = {}; tr.querySelectorAll('td').forEach((td) => {
					const inp = td.querySelector('select');
					o[td._lpnPaneKey] = inp ? (inp.options[inp.selectedIndex] || { text: '' }).text : td.textContent.trim();
					if (td._lpnPaneKey === 'st_value') { o.id = td._lpnPaneId; o.opts = inp ? Array.from(inp.options).map((x) => x.value) : null; }
				});
				out.push(o);
			});
			return out.filter((o) => o.st_setting === l)[0] || null;
		}, label);
		const typeVal = async (id, v) => {
			await a.page.evaluate(([k, x]) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
				const inp = td.querySelector('select'); inp.value = x; inp.dispatchEvent(new Event('change', { bubbles: true }));
			}, [id, v]);
			await a.settle(1500);
		};
		let r = await row(P.plot), n = await row(P.node);
		ok('an old project (Property to plot never stated, Color nodes by Pressure): the row reads Pressure', r && /pressure/i.test(r.st_value) && n && /pressure/i.test(n.st_value), JSON.stringify([r && r.st_value, n && n.st_value]));
		ok('the row offers the box\'s properties and no "follow" or blank choice', r && r.opts.length >= 5 && r.opts.indexOf('') < 0 && r.opts.indexOf('pressure') >= 0, JSON.stringify(r && r.opts));
		ok('the plot of that old project is still Pressure', await a.page.evaluate(() => /Pressure/.test((document.getElementById('lpn_color_legend') || {}).textContent || '')));
		await typeVal(r.id, 'head');
		r = await row(P.plot); n = await row(P.node);
		ok('Tables: Contour property to plot = Head, the Node color row reads Head too (nodes are colored)', /head/i.test(r.st_value) && /head/i.test(n.st_value), JSON.stringify([r.st_value, n.st_value]));
		ok('...and the key shows Head', await a.page.evaluate(() => /Head/.test((document.getElementById('lpn_color_legend') || {}).textContent || '')));
		await typeVal(n.id, '');
		r = await row(P.plot); n = await row(P.node);
		ok('Tables: Node color = No color clears only the dots; the Contour row keeps Head', n.st_value === P.none && /head/i.test(r.st_value), JSON.stringify([r.st_value, n.st_value]));
		const lg = await a.page.evaluate(() => (document.getElementById('lpn_color_legend') || {}).textContent || '');
		ok('...and the key still shows Head', /Head/.test(lg), lg.slice(0, 60));
		await typeVal(r.id, 'pressure');
		r = await row(P.plot); n = await row(P.node);
		ok('Tables: with No color a property written to the Contour row leaves Node color at No color', n.st_value === P.none && /pressure/i.test(r.st_value), JSON.stringify([r.st_value, n.st_value]));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
// The box follows every door while it is open (Perry, 2026-11-13), and the open Tables pane follows the box.
async function main5(Session, browser) {
	console.log('\n--- 9. an open box follows Settings, the Tables row and Undo; the open Tables pane follows the box ---');
	const boxNow = (a) => a.page.evaluate(() => ({ field: document.getElementById('lpn_contour_field').value, tick: document.getElementById('lpn_contour_node_colors').checked }));
	const setNode = (a, v) => a.page.evaluate((x) => { const n = document.getElementById('lpn_set_color_node'); n.value = x; n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
	// 9a. a child scenario, Settings changes Color nodes by with the box open.
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await newScenario(a);
		await contourFromMenu(a);
		await setBox(a, 'lpn_contour_node_colors', false);
		let f = await boxNow(a);
		ok('child scenario: the box opens with the dots plain', f.tick === false, JSON.stringify(f));
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);
		await setNode(a, 'head');
		await a.settle(900);
		f = await boxNow(a);
		ok('child scenario: Settings Color nodes by = Head: the open box reads Head and ticks Show node colors', f.field === 'head' && f.tick === true, JSON.stringify(f));
		await setNode(a, '');
		await a.settle(900);
		f = await boxNow(a);
		ok('child scenario: Settings No color: the open box clears its tick and keeps Head', f.field === 'head' && f.tick === false, JSON.stringify(f));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }

	// 9b and Undo: Base, the Tables row.
	const b = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		const P = await b.page.evaluate(() => ({ plot: EngCalcs.pageConfig.lpn_settings_row_contour_field, node: EngCalcs.pageConfig.lpn_settings_color_node_field }));
		await contourFromMenu(b);
		await b.toolbarClick(await b.lang('lpn_pane_toggle'));
		await b.settle(500);
		await b.page.click('#lpn_pane_tab_settings');
		await b.settle(700);
		const row = (label) => b.page.evaluate((l) => {
			const out = [];
			document.querySelectorAll('#lpn_pane_settings tbody tr').forEach((tr) => {
				const o = {}; tr.querySelectorAll('td').forEach((td) => {
					const inp = td.querySelector('select');
					o[td._lpnPaneKey] = inp ? (inp.options[inp.selectedIndex] || { text: '' }).text : td.textContent.trim();
					if (td._lpnPaneKey === 'st_value') { o.id = td._lpnPaneId; }
				});
				out.push(o);
			});
			return out.filter((o) => o.st_setting === l)[0] || null;
		}, label);
		const typeVal = async (id, v) => {
			await b.page.evaluate(([k, x]) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
				const inp = td.querySelector('select'); inp.value = x; inp.dispatchEvent(new Event('change', { bubbles: true }));
			}, [id, v]);
			await b.settle(1500);
		};
		let f = await boxNow(b), r = await row(P.plot);
		ok('Base: the box opens on Pressure with Show node colors ticked (Net3)', f.field === 'pressure' && f.tick === true, JSON.stringify(f));
		await typeVal(r.id, 'head');
		f = await boxNow(b);
		ok('Base: Tables Contour property to plot = Head: the open box reads Head, tick kept', f.field === 'head' && f.tick === true, JSON.stringify(f));
		await b.page.mouse.click(5, 5);   // focus off the table, so the key is the page's
		await b.page.keyboard.press('Control+z');
		await b.settle(1200);
		f = await boxNow(b);
		ok('Undo: the open box goes back to Pressure', f.field === 'pressure' && f.tick === true, JSON.stringify(f));
		await b.page.keyboard.press('Control+y');
		await b.settle(1200);
		f = await boxNow(b);
		ok('Redo: the open box reads Head again', f.field === 'head', JSON.stringify(f));
		// The open Tables pane after an edit made in the box.
		await setBox(b, 'lpn_contour_field', 'demand');
		await b.settle(800);
		r = await row(P.plot);
		const n = await row(P.node);
		ok('the open Tables pane follows an edit made in the box (Contour row and Node color row)', /demand/i.test(r.st_value) && /demand/i.test(n.st_value), JSON.stringify([r.st_value, n.st_value]));
		await setBox(b, 'lpn_contour_node_colors', false);
		await b.settle(800);
		const n2 = await row(P.node);
		ok('...and Show node colors cleared shows as No color in the Tables pane', n2.st_value === (await b.page.evaluate(() => EngCalcs.pageConfig.lpn_color_none)), n2.st_value);
		ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
	} finally { await b.close(); }
}
// THE PANEL'S STEPS, WALKED AS WRITTEN (ports.conf row feat-contour-controls). Any change to those steps is walked here first.
async function main6(Session, browser) {
	console.log('\n--- 10. the panel steps, as written, on Net1 ---');
	const a = await Session.open(browser, NAME, { viewport: { width: 1440, height: 900 } });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		const boxNow = () => a.page.evaluate(() => ({ field: document.getElementById('lpn_contour_field').value, tick: document.getElementById('lpn_contour_node_colors').checked,
			dots: Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node-junction')).filter((c) => c.style.color).length }));
		const setNode = (v) => a.page.evaluate((x) => { const n = document.getElementById('lpn_set_color_node'); n.value = x; n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
		// The box's ? is a glyph that opens on a click; a Settings label is a name tip that opens when the pointer rests on it.
		const pointAt = async (scope, labelText, glyph) => {
			const bb = await a.page.evaluate(([sc, t, g]) => {
				const l = Array.from(document.querySelectorAll(sc + ' .ec-help')).find((e) => e.textContent.trim().indexOf(t) === 0);
				const target = l && (g ? l.querySelector('.ec-tip') : l);
				if (!target) { return null; }
				const r = target.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, [scope, labelText, glyph]);
			if (!bb) { return false; }
			await a.page.mouse.move(bb.x - 30, bb.y);
			await a.page.mouse.move(bb.x, bb.y, { steps: 4 });
			if (glyph) { await a.page.mouse.click(bb.x, bb.y); }
			await a.settle(1000);
			return true;
		};
		const tipShown = (first) => a.page.evaluate((t) => Array.from(document.querySelectorAll('.tooltip-inner, .tooltip')).some((e) => e.offsetParent !== null && e.textContent.indexOf(t) >= 0), first);
		const pc = await a.page.evaluate(() => EngCalcs.pageConfig);

		console.log('step 1: open Net1, choose Water, Graphs, Contour');
		await contourFromMenu(a);
		let f = await boxNow();
		ok('step 1: the box is open, Show node colors is cleared, the dots are plain, Property to plot reads Pressure', f.tick === false && f.dots === 0 && f.field === 'pressure', JSON.stringify(f));
		console.log('step 2: click the ? beside Property to plot');
		ok('step 2: there is a ? beside Property to plot to click', await pointAt('#lpn_contour_body', pc.lpn_contour_field, true));
		ok('step 2: its tip opens on the click', await tipShown(pc.lpn_contour_field_tip.slice(0, 30)));
		await shot(a.page, 'steps-2-tip-click');
		await a.page.keyboard.press('Escape');
		console.log('step 3: tick Show node colors, choose Head, open Settings');
		await setBox(a, 'lpn_contour_node_colors', true);
		f = await boxNow();
		ok('step 3: ticked, the dots are colored', f.tick === true && f.dots > 0, JSON.stringify(f));
		await setBox(a, 'lpn_contour_field', 'head');
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);
		const node = () => a.page.evaluate(() => document.getElementById('lpn_set_color_node').value);
		ok('step 3: Settings, Symbology, Node colors: Color nodes by reads Head', await node() === 'head');
		ok('step 3: resting the pointer on Color nodes by in Settings opens its tip', await pointAt('#lpn_settings_box', pc.lpn_color_node_field, false) && await tipShown(pc.lpn_settings_color_node_field_tip.slice(0, 30)));
		await shot(a.page, 'steps-3-settings-tip');
		await a.page.keyboard.press('Escape');
		console.log('step 4: in Settings choose Pressure');
		await setNode('pressure'); await a.settle(700);
		f = await boxNow();
		ok('step 4: the open box reads Pressure', f.field === 'pressure' && f.tick === true, JSON.stringify(f));
		console.log('step 5: in Settings choose No color');
		await setNode(''); await a.settle(700);
		f = await boxNow();
		ok('step 5: the dots go plain, the box clears Show node colors and keeps Pressure', f.dots === 0 && f.tick === false && f.field === 'pressure', JSON.stringify(f));
		console.log('step 6: Tables pane, Settings tab, Contour property to plot');
		await a.page.keyboard.press('Escape');
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await a.page.click('#lpn_pane_tab_settings');
		await a.settle(700);
		const rowId = await a.page.evaluate((l) => {
			let id = null; document.querySelectorAll('#lpn_pane_settings tbody tr').forEach((tr) => { let hit = false, vid = null; tr.querySelectorAll('td').forEach((td) => { if (td._lpnPaneKey === 'st_setting' && td.textContent.trim() === l) { hit = true; } if (td._lpnPaneKey === 'st_value') { vid = td._lpnPaneId; } }); if (hit) { id = vid; } });
			return id;
		}, pc.lpn_settings_row_contour_field);
		ok('step 6: the Settings tab has the row Contour property to plot', !!rowId);
		await a.page.evaluate(([k, x]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
			const inp = td.querySelector('select'); inp.value = x; inp.dispatchEvent(new Event('change', { bubbles: true }));
		}, [rowId, 'head']);
		await a.settle(1500);
		f = await boxNow();
		ok('step 6: choosing Head there, the box reads Head', f.field === 'head', JSON.stringify(f));
		await a.page.mouse.click(5, 5);
		await a.page.keyboard.press('Control+z');
		await a.settle(1200);
		f = await boxNow();
		ok('step 6: Ctrl+Z puts the box back to Pressure', f.field === 'pressure', JSON.stringify(f));
		ok('the box label reads Show contour lines', await a.page.evaluate(() => /Show contour lines/.test(document.getElementById('lpn_contour_lines').closest('.lpn-grow').textContent)));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
async function sectionPhone(Session, browser) {
	console.log('\n--- 4. a 390-wide phone ---');
	const a = await openNet3(Session, browser, { width: 390, height: 844 });
	try {
		await contourFromMenu(a);
		const m = await a.page.evaluate(() => { const b = document.getElementById('lpn_contour_box'), r = b.getBoundingClientRect(); return { w: r.width, l: r.left, rt: r.right, over: b.scrollWidth > b.clientWidth + 1 }; });
		ok('the box fits the phone with nothing wider than it', m.l >= -1 && m.rt <= 391 && !m.over, JSON.stringify(m));
		await shot(a.page, 'contour-controls-phone');
	} finally { await a.close(); }
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
		await main0(Session, browser);
		await main1(Session, browser);
		await main2(Session, browser);
		await main3(Session, browser);
		await main4(Session, browser);
		await main5(Session, browser);
		await main6(Session, browser);
		await sectionPhone(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

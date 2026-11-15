// THE CONTOUR BOX HAS NO PROPERTY, SCHEME OR NODE-COLOR CONTROL OF ITS OWN (ROADMAP Task 858, round 4).
// Tom, 2026-11-14: "remove everything that's redundant with the project settings ... Show plot ... 'Follows
// project Node colors settings.' Remove Property to plot, Color scheme, and Show node colors." Holds, in Chromium:
//   1. the box has Show plot, Fill, Fill opacity, Buffer, Show contour lines, Interval, Labels, in that order,
//      and no Property to plot, Color scheme or Show node colors; the Show plot tip is Tom's sentence.
//   2. the plot follows Color nodes by and Color scheme in Settings, Symbology, Node colors, and the key follows.
//   3. with No color the plot draws nothing, Show plot keeps its tick, and the plot returns on choosing a property.
//   4. a project saved in round 3 (it holds a `contourField`) opens, draws by Color nodes by, and saves without it.
//   5. in a child scenario the plot follows the scenario's Color nodes by; the open box and Tables pane follow Settings.
//   6. a 390-wide phone: the box fits.
// CONTOUR_SHOT=<dir> also writes a picture of each view there.

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
async function setBox(a, id, value) {
	await a.page.evaluate(([i, v]) => {
		const e = document.getElementById(i);
		if (e.type === 'checkbox') { e.checked = !!v; } else { e.value = String(v); }
		e.dispatchEvent(new Event('change', { bubbles: true }));
	}, [id, value]);
	await a.settle(300);
}
// What the page shows: is a plot drawn, how many dots are colored, the key, and the box's controls.
function facts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour'), img = g && g.querySelector('image.lpn-contour-fill');
		const dots = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node-junction'));
		const body = document.getElementById('lpn_contour_body');
		const show = document.getElementById('lpn_contour_show');
		return {
			fill: !!(img && (img.getAttribute('href') || '').indexOf('data:image/png') === 0),
			href: img ? (img.getAttribute('href') || '') : '',
			lines: g ? g.querySelectorAll('path.lpn-contour-line').length : 0,
			coloured: dots.filter((c) => c.style.color).length, dots: dots.length,
			legend: (document.getElementById('lpn_color_legend') || {}).textContent || '',
			ctrls: Array.from(body.querySelectorAll('input, select, button')).map((e) => e.id || 'ramp'),
			text: body.innerText.replace(/\s+/g, ' '),
			show: show ? show.checked : null
		};
	});
}
const setNode = (a, v) => a.page.evaluate((x) => { const n = document.getElementById('lpn_set_color_node'); n.value = x; n.dispatchEvent(new Event('change', { bubbles: true })); }, v);
const pickRamp = (a, key) => a.page.evaluate((k) => {
	document.getElementById('lpn_set_ramp_node').click();
	const o = document.querySelector('#lpn_set_ramp_list_node [data-ramp="' + k + '"]');
	if (o) { o.click(); }
	return !!o;
}, key);
const openSettings = async (a) => { await a.toolbarClick(await a.lang('lpn_tool_settings')); await a.settle(500); };
const noErrors = (a) => ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

async function main0(Session, browser) {
	console.log('\n--- 1. the box holds only what the plot owns; the Show plot tip ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		const f = await facts(a.page);
		const want = ['lpn_contour_show', 'lpn_contour_fill', 'lpn_contour_opacity', 'lpn_contour_buffer', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_labels'];
		// The Ground row (Mapbox DEM) shows only where a token is set; it follows Labels when it does.
		const own = f.ctrls.filter((x) => x !== 'lpn_contour_dem');
		ok('the box holds Show plot, Fill, Fill opacity, Buffer, Show contour lines, Interval, Labels, in that order, then Ground if offered', JSON.stringify(own) === JSON.stringify(want) && f.ctrls.length - own.length <= 1, f.ctrls.join(' > '));
		ok('there is no Property to plot, Color scheme or Show node colors control', ['lpn_contour_field', 'lpn_contour_node_colors', 'lpn_set_ramp_node_contour'].every((id) => f.ctrls.indexOf(id) < 0) && f.ctrls.indexOf('ramp') < 0 && (await a.page.$('#lpn_contour_body .lpn-ramp-btn')) === null);
		ok('...and none of those three names is on the box', !/Property to plot|Color scheme|Show node colors|Color nodes by/.test(f.text), f.text.slice(0, 140));
		ok('Net3 opens colored by pressure and the plot is drawn', f.fill && f.coloured > 0 && /Pressure/.test(f.legend), JSON.stringify({ fill: f.fill, c: f.coloured }));
		const tip = await a.page.evaluate(() => {
			const row = document.getElementById('lpn_contour_show').closest('.lpn-grow'), l = row.querySelector('.ec-help');
			return { want: EngCalcs.pageConfig.lpn_contour_show_tip, title: l ? (l.title || l.getAttribute('data-bs-original-title') || '') : null, tips: row.querySelectorAll('.ec-tip').length };
		});
		ok('the Show plot tip is exactly: Follows project Node colors settings.', tip.want === 'Follows project Node colors settings.' && tip.title === tip.want && tip.tips === 1, JSON.stringify(tip));
		// A picture of the tip, opened the way a visitor opens it: a click on the ?.
		const bb = await (await a.page.$('.lpn-grow:has(#lpn_contour_show) .ec-tip')).boundingBox();
		await a.page.mouse.move(bb.x - 20, bb.y + bb.height / 2);
		await a.page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 4 });
		await a.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await a.settle(800);
		ok('clicking the ? opens that sentence', await a.page.evaluate(() => Array.from(document.querySelectorAll('.tooltip-inner, .tooltip')).some((e) => e.offsetParent !== null && e.textContent.indexOf('Follows project Node colors settings.') >= 0)));
		await shot(a.page, 'show-plot-tip-r4');
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		await shot(a.page, 'contour-box-r4');
		noErrors(a);
	} finally { await a.close(); }
}

async function main1(Session, browser) {
	console.log('\n--- 2. the plot follows Color nodes by and Color scheme in Settings ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		await openSettings(a);
		const f0 = await facts(a.page);
		await setNode(a, 'head'); await a.settle(600);
		let f = await facts(a.page);
		ok('Color nodes by = Head: the plot is redrawn and the key reads Head', f.fill && f.href !== f0.href && /Head/.test(f.legend) && f.coloured > 0, JSON.stringify({ same: f.href === f0.href, legend: f.legend.slice(0, 30) }));
		ok('the box still shows only its own controls', f.ctrls.filter((x) => x !== 'lpn_contour_dem').length === 7, f.ctrls.join(' '));
		const before = f.href;
		ok('Settings offers the Gray scheme', await pickRamp(a, 'gray'));
		await a.settle(500);
		f = await facts(a.page);
		const gray = f.href;
		ok('Color scheme = Gray: the plot is redrawn in the new colors', f.fill && gray !== before);
		ok('Settings offers the Viridis scheme', await pickRamp(a, 'viridis'));
		await a.settle(500);
		f = await facts(a.page);
		ok('Color scheme = Viridis: the plot changes again', f.fill && f.href !== gray && f.href !== before);
		await shot(a.page, 'contour-follows-settings-r4');
		noErrors(a);
	} finally { await a.close(); }
}

async function main2(Session, browser) {
	console.log('\n--- 3. No color: the plot draws nothing and comes back with a property ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		await openSettings(a);
		await setNode(a, ''); await a.settle(700);
		let f = await facts(a.page);
		ok('No color: no fill, no lines, no colored dots, no node key', !f.fill && f.lines === 0 && f.coloured === 0 && !/Pressure|Head/.test(f.legend), JSON.stringify({ fill: f.fill, lines: f.lines, c: f.coloured, key: f.legend.slice(0, 20) }));
		ok('...and Show plot keeps its tick', f.show === true);
		await shot(a.page, 'contour-no-color-r4');
		await setNode(a, 'head'); await a.settle(700);
		f = await facts(a.page);
		ok('choosing Head again brings the plot back, the box unchanged', f.fill && f.lines > 0 && f.show === true && /Head/.test(f.legend), JSON.stringify({ fill: f.fill, lines: f.lines, show: f.show }));
		// Show plot cleared and ticked while No color: the tick is the user's, whatever the property.
		await setNode(a, ''); await a.settle(500);
		await setBox(a, 'lpn_contour_show', false);
		await setBox(a, 'lpn_contour_show', true);
		f = await facts(a.page);
		ok('with No color Show plot can still be cleared and checked, and draws nothing', f.show === true && !f.fill, JSON.stringify({ show: f.show, fill: f.fill }));
		await setNode(a, 'pressure'); await a.settle(600);
		f = await facts(a.page);
		ok('choosing Pressure brings the plot back', f.fill && /Pressure/.test(f.legend));
		noErrors(a);
	} finally { await a.close(); }
}

// A project saved in round 3 holds `contourField` in its settings (and a scenario may hold one).
async function main3(Session, browser) {
	console.log('\n--- 4. a round-3 project, with a retired contourField, still opens ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		const key = await a.page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				try { const d = JSON.parse(localStorage.getItem(k)); if (d && d.settings && Array.isArray(d.nodes) && d.nodes.length > 5) { return k; } } catch (e) { /* not a project */ }
			}
			return null;
		});
		ok('the open project is in storage', !!key, String(key));
		await a.page.evaluate((k) => {
			const d = JSON.parse(localStorage.getItem(k));
			d.settings.contourField = 'head'; d.settings.colorNodeField = 'pressure'; d.settings.contourFill = 'smooth';
			localStorage.setItem(k, JSON.stringify(d));
		}, key);
		await a.page.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2000);
		await contourFromMenu(a);
		const f = await facts(a.page);
		ok('it opens and draws by Color nodes by (Pressure), ignoring the old property', f.fill && /Pressure/.test(f.legend) && f.coloured > 0, JSON.stringify({ fill: f.fill, key: f.legend.slice(0, 20) }));
		await setBox(a, 'lpn_contour_opacity', 40);   // any edit saves the project again
		await a.settle(600);
		const kept = await a.page.evaluate((k) => { const d = JSON.parse(localStorage.getItem(k)); return { has: 'contourField' in d.settings, opacity: d.settings.contourOpacity }; }, key);
		ok('saved again, the old field is gone and the new edit is kept', kept.has === false && kept.opacity === 0.4, JSON.stringify(kept));
		noErrors(a);
	} finally { await a.close(); }
}

async function main4(Session, browser) {
	console.log('\n--- 5. a child scenario; the open box and the Tables pane follow Settings ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await newScenario(a);
		ok('a child scenario is open', await a.page.evaluate(() => !/Scenario:\s*Base\b/.test(document.body.innerText)), await a.page.evaluate(() => (document.body.innerText.match(/Scenario:[^|\n]*/) || [''])[0]));
		await contourFromMenu(a);
		await openSettings(a);
		const f0 = await facts(a.page);
		await setNode(a, 'head'); await a.settle(800);
		let f = await facts(a.page);
		ok('child scenario: Color nodes by = Head redraws the plot and the key', f.fill && f.href !== f0.href && /Head/.test(f.legend), f.legend.slice(0, 30));
		await setNode(a, ''); await a.settle(800);
		f = await facts(a.page);
		ok('child scenario: No color draws nothing, Show plot keeps its tick', !f.fill && f.show === true && f.ctrls.filter((x) => x !== 'lpn_contour_dem').length === 7, JSON.stringify({ fill: f.fill, show: f.show }));
		await setNode(a, 'pressure'); await a.settle(800);
		f = await facts(a.page);
		ok('child scenario: choosing Pressure brings it back', f.fill && /Pressure/.test(f.legend));
		noErrors(a);
	} finally { await a.close(); }
	// The Tables pane Settings tab: its Color nodes by row is the same setting.
	const b = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		const P = await b.page.evaluate(() => ({ node: EngCalcs.pageConfig.lpn_settings_color_node_field, none: EngCalcs.pageConfig.lpn_color_none, plot: EngCalcs.pageConfig.lpn_settings_row_contour_field }));
		await contourFromMenu(b);
		await b.toolbarClick(await b.lang('lpn_pane_toggle'));
		await b.settle(500);
		await b.page.click('#lpn_pane_tab_settings');
		await b.settle(700);
		const rows = () => b.page.evaluate(() => {
			const out = [];
			document.querySelectorAll('#lpn_pane_settings tbody tr').forEach((tr) => {
				const o = {}; tr.querySelectorAll('td').forEach((td) => {
					const inp = td.querySelector('select');
					o[td._lpnPaneKey] = inp ? (inp.options[inp.selectedIndex] || { text: '' }).text : td.textContent.trim();
					if (td._lpnPaneKey === 'st_value') { o.id = td._lpnPaneId; }
				});
				out.push(o);
			});
			return out;
		});
		const typeVal = async (id, v) => {
			await b.page.evaluate(([k, x]) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_settings td.lpn-pane-col-st_value')).filter((t) => t._lpnPaneId === k)[0];
				const inp = td.querySelector('select'); inp.value = x; inp.dispatchEvent(new Event('change', { bubbles: true }));
			}, [id, v]);
			await b.settle(1500);
		};
		let all = await rows(), n = all.filter((o) => o.st_setting === P.node)[0];
		ok('the Tables Settings tab has a Color nodes by row and no Contour property row', !!n && all.every((o) => o.st_setting !== P.plot), JSON.stringify(n && n.st_value));
		const f0 = await facts(b.page);
		await typeVal(n.id, 'head');
		let f = await facts(b.page);
		ok('Tables: Color nodes by = Head redraws the plot', f.fill && f.href !== f0.href && /Head/.test(f.legend), f.legend.slice(0, 30));
		await typeVal(n.id, '');
		f = await facts(b.page);
		ok('Tables: No color draws nothing and keeps Show plot ticked', !f.fill && f.show === true && f.coloured === 0, JSON.stringify({ fill: f.fill, show: f.show }));
		await b.page.mouse.click(5, 5);
		await b.page.keyboard.press('Control+z');
		await b.settle(1200);
		f = await facts(b.page);
		ok('Undo brings the plot of Head back', f.fill && /Head/.test(f.legend), f.legend.slice(0, 30));
		noErrors(b);
	} finally { await b.close(); }
}

async function sectionPhone(Session, browser) {
	console.log('\n--- 6. a 390-wide phone ---');
	const a = await openNet3(Session, browser, { width: 390, height: 844 });
	try {
		await contourFromMenu(a);
		const m = await a.page.evaluate(() => { const b = document.getElementById('lpn_contour_box'), r = b.getBoundingClientRect(); return { w: r.width, l: r.left, rt: r.right, over: b.scrollWidth > b.clientWidth + 1 }; });
		ok('the box fits the phone with nothing wider than it', m.l >= -1 && m.rt <= 391 && !m.over, JSON.stringify(m));
		await shot(a.page, 'contour-controls-phone-r4');
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
		await sectionPhone(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

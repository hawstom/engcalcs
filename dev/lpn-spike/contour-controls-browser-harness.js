// THE CONTOUR BOX HAS NO PROPERTY, SCHEME OR NODE-COLOR CONTROL OF ITS OWN (ROADMAP Task 858, round 4).
// Tom, 2026-11-14: "remove everything that's redundant with the project settings ... Show plot ... 'Follows
// project Node colors settings.' Remove Property to plot, Color scheme, and Show node colors." Holds, in Chromium:
//   1. the box has Show plot, Fill, Fill opacity, Buffer, Show contour lines, Interval, Labels, in that order,
//      and no Property to plot, Color scheme or Show node colors; the Show plot tip is Tom's sentence.
//   2. the plot follows Color nodes by and Color scheme in Settings, Symbology, Node colors, and the key follows.
//   3. with No color the plot draws nothing, Show plot keeps its tick, the box says so in one line (nothing else
//      changes; the Interval box is empty and disabled), and the plot returns on choosing a property.
//   4. in a child scenario the plot follows the scenario's Color nodes by; the Tables pane follows too.
//   5. in a child scenario time steps leave an open pull-down alone (no rebuild); a re-solve that changes the
//      default interval shows in the box.
//   6. a 390-wide phone: the box fits.
//   7. round 5: Show plot has no tip; a standing line "Uses the project "Node colors" settings." heads the
//      box with Node colors a link into Settings at Symbology, Node colors; Show plot changes no other control (Fill,
//      Opacity, Buffer, Lines, Interval, Labels), off draws nothing, on draws them as set; undo, save and reopen, and a
//      child scenario agree.
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
		// Tom, 2026-11-16: "Merge feat/contour-controls after removing the tip from "Show plot"." The standing line says it.
		const tip = await a.page.evaluate(() => {
			const row = document.getElementById('lpn_contour_show').closest('.lpn-grow');
			return { key: 'lpn_contour_show_tip' in EngCalcs.pageConfig, tips: row.querySelectorAll('.ec-tip, .ec-help').length };
		});
		ok('Show plot carries no tip and no ?', !tip.key && tip.tips === 0, JSON.stringify(tip));
		await a.settle(300);
		await shot(a.page, 'contour-box-r5');
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
		await shot(a.page, 'contour-follows-settings-r5');
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
		const note = () => a.page.evaluate(() => {
			const body = document.getElementById('lpn_contour_body'), n = document.getElementById('lpn_contour_none_note'), iv = document.getElementById('lpn_contour_interval');
			return { text: n ? n.textContent : null, second: !!n && body.children[0].id === 'lpn_contour_follows' && body.children[1] === n, want: EngCalcs.pageConfig.lpn_contour_none_note, iv: iv.value, ivOff: iv.disabled, ctrls: body.querySelectorAll('input, select').length };
		});
		let nt = await note();
		ok('No color: a line under the standing one says so, in the sentence the language file gives', nt.second && nt.text === nt.want && !!nt.want, JSON.stringify(nt));
		ok('...the controls stay as they are, and the Interval box is empty and disabled', nt.ctrls === f.ctrls.length && nt.iv === '' && nt.ivOff === true, JSON.stringify(nt));
		await shot(a.page, 'contour-no-color-r5');
		await setNode(a, 'head'); await a.settle(700);
		f = await facts(a.page);
		ok('choosing Head again brings the plot back, the box unchanged', f.fill && f.lines > 0 && f.show === true && /Head/.test(f.legend), JSON.stringify({ fill: f.fill, lines: f.lines, show: f.show }));
		nt = await note();
		ok('the line goes when a property is chosen, and the Interval box has a number again', nt.text === null && nt.iv !== '' && nt.ivOff === false, JSON.stringify(nt));
		// Show plot cleared and ticked while No color: the tick is the user's, whatever the property.
		await setNode(a, ''); await a.settle(500);
		await setBox(a, 'lpn_contour_show', false);
		await setBox(a, 'lpn_contour_show', true);
		f = await facts(a.page);
		ok('with No color Show plot can still be cleared and checked, and draws nothing', f.show === true && !f.fill, JSON.stringify({ show: f.show, fill: f.fill }));
		await setNode(a, 'pressure'); await a.settle(600);
		f = await facts(a.page);
		ok('choosing Pressure brings the plot back', f.fill && /Pressure/.test(f.legend));
		// A picture of the box with the note, Settings put away.
		await setNode(a, ''); await a.settle(500);
		await a.page.evaluate(() => { const x = document.querySelector('#lpn_settings_box .lpn-popover-x'); if (x) { x.click(); } }); await a.settle(500);
		await shot(a.page, 'contour-box-no-color-note-r5');
		noErrors(a);
	} finally { await a.close(); }
}

async function main4(Session, browser) {
	console.log('\n--- 4. a child scenario; the open box and the Tables pane follow Settings ---');
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

// The box is looked at on every time step; it must be rebuilt only when what it shows has changed (a child scenario's view is not `settings`).
async function main5(Session, browser) {
	console.log('\n--- 5. time steps in a child scenario leave an open pull-down alone ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await newScenario(a);
		await contourFromMenu(a);
		const mark = () => a.page.evaluate(() => { document.getElementById('lpn_contour_fill').__mark = 1; const i = document.getElementById('lpn_contour_interval'); i.__mark = 1; i.focus(); return true; });
		const kept = () => a.page.evaluate(() => ({ fill: document.getElementById('lpn_contour_fill').__mark === 1, interval: document.getElementById('lpn_contour_interval').__mark === 1, focus: document.activeElement && document.activeElement.id }));
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'frames', 120000);
		await a.settle(800);
		await mark();
		for (const h of [1, 2, 3, 6]) {
			await a.page.evaluate((s) => EngCalcs.lpnTimeGoTo(s), h * 3600);
			await a.settle(500);
		}
		const k = await kept();
		ok('after four time steps in the child scenario the box was not rebuilt: the same pull-down, the same Interval box, the cursor still in it', k.fill && k.interval && k.focus === 'lpn_contour_interval', JSON.stringify(k));
		noErrors(a);
	} finally { await a.close(); }

	console.log('\n--- 5b. a re-solve that changes the default interval shows in the box ---');
	const b = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(b);
		await openSettings(b);
		await setNode(b, 'demandActual'); await b.settle(800);
		const shown = () => b.page.evaluate(() => {
			const lv = Array.from(document.querySelectorAll('#lpn_canvas path.lpn-contour-line')).map((p) => +p.getAttribute('data-level')).filter((x) => isFinite(x)).sort((x, y) => x - y);
			const gaps = lv.slice(1).map((x, i) => +(x - lv[i]).toFixed(6)).filter((g) => g > 0);
			return { box: parseFloat(document.getElementById('lpn_contour_interval').value), step: gaps.length ? Math.min.apply(null, gaps) : null };
		});
		const s1 = await shown();
		const set = await b.page.evaluate((t) => {
			const rows = Array.from(document.querySelectorAll('label, .lpn-setrow, tr, div')).filter((e) => e.textContent.trim().indexOf(t) === 0 && e.querySelector('input'));
			const box = rows.length ? rows[rows.length - 1].querySelector('input') : null;
			if (!box) { return false; }
			box.value = '40'; box.dispatchEvent(new Event('input', { bubbles: true })); box.dispatchEvent(new Event('change', { bubbles: true })); return true;
		}, await b.lang('bpn_demand_mult'));
		ok('the demand multiplier box is there and was set', set);
		await b.settle(5000);
		const s2 = await shown();
		ok('the plot\'s interval changed with the new range (else this check proves nothing)', s1.step !== null && s2.step !== null && s1.step !== s2.step, JSON.stringify([s1, s2]));
		ok('and the box shows the interval the plot is drawn with, before and after', s1.box === s1.step && s2.box === s2.step, JSON.stringify([s1, s2]));
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
		await shot(a.page, 'contour-controls-phone-r5');
		const w = await a.page.evaluate(() => { const f = document.getElementById('lpn_contour_follows'), r = f.getBoundingClientRect(), b = document.getElementById('lpn_contour_box').getBoundingClientRect(); return { l: r.left, r: r.right, bl: b.left, br: b.right, h: r.height }; });
		ok('the standing line fits inside the box on a phone', w.l >= w.bl - 1 && w.r <= w.br + 1, JSON.stringify(w));
	} finally { await a.close(); }
}

const controlValues = (a) => a.page.evaluate(() => {
	const o = {};
	['lpn_contour_fill', 'lpn_contour_opacity', 'lpn_contour_buffer', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_labels', 'lpn_contour_dem'].forEach((id) => {
		const e = document.getElementById(id);
		if (e) { o[id] = e.type === 'checkbox' ? e.checked : e.value; o[id + ':off'] = e.disabled; }
	});
	return JSON.stringify(o);
});
const stored = (a) => a.page.evaluate(() => {
	const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId, d = JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null');
	return d && d.settings ? { show: d.settings.contourShow, fill: d.settings.contourFill, lines: d.settings.contourLines } : null;
});

async function section7(Session, browser) {
	console.log('\n--- 7. the standing line and its link; Show plot touches nothing else ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		const st = await a.page.evaluate(() => {
			const body = document.getElementById('lpn_contour_body'), f = document.getElementById('lpn_contour_follows'), l = document.getElementById('lpn_contour_follows_link');
			const pc = EngCalcs.pageConfig;
			return { first: body.firstElementChild === f, text: f && f.textContent, want: pc.lpn_contour_follows.replace('{link}', pc.lpn_settings_sym_node_colors), link: l && l.textContent, node: pc.lpn_settings_sym_node_colors, none: !!document.getElementById('lpn_contour_none_note') };
		});
		ok('the box opens with the standing line first, in the language file\'s words, with Node colors as its link', st.first && st.text === st.want && st.link === st.node && !st.none, JSON.stringify(st));
		await shot(a.page, 'contour-box-r5');
		const before = await a.page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && getComputedStyle(b).display !== 'none'; });
		ok('Settings is not open yet', before === false);
		await a.page.click('#lpn_contour_follows_link');
		await a.settle(900);
		const at = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_settings_box'), t = document.getElementById('lpn_set_sub_nodeColors');
			if (!b || !t || getComputedStyle(b).display === 'none') { return null; }
			const rb = b.getBoundingClientRect(), rt = t.getBoundingClientRect();
			const cur = document.querySelector('#lpn_setbox_index .lpn-setbox-current, #lpn_setbox_index [aria-current], #lpn_setbox_index .active');
			return { visible: rt.bottom > rb.top && rt.top < rb.bottom, top: Math.round(rt.top - rb.top), cur: cur ? cur.textContent.trim() : null, nodeColors: EngCalcs.pageConfig.lpn_settings_sym_node_colors };
		});
		ok('the link opens Settings with the Node colors heading in view', !!at && at.visible, JSON.stringify(at));
		ok('...and the index says Node colors', !!at && at.cur === at.nodeColors, JSON.stringify(at));
		await shot(a.page, 'contour-link-settings-r5');
		await a.page.evaluate(() => { const x = document.querySelector('#lpn_settings_box .lpn-popover-x'); if (x) { x.click(); } });
		await a.settle(400);
		// Set every control to something unlike its default, then clear and check Show plot.
		await setBox(a, 'lpn_contour_fill', 'bands');
		await setBox(a, 'lpn_contour_opacity', 35);
		await setBox(a, 'lpn_contour_buffer', 3);
		await setBox(a, 'lpn_contour_interval', 20);
		await setBox(a, 'lpn_contour_labels', false);
		const set = await controlValues(a);
		let f = await facts(a.page);
		ok('with Show plot on, the plot is drawn as set: bands fill and lines', f.show === true && f.fill && f.lines > 0, JSON.stringify({ show: f.show, fill: f.fill, lines: f.lines }));
		await setBox(a, 'lpn_contour_show', false);
		f = await facts(a.page);
		ok('Show plot cleared: nothing is drawn, the node colors stay', !f.fill && f.lines === 0 && f.coloured > 0, JSON.stringify({ fill: f.fill, lines: f.lines, c: f.coloured }));
		ok('...and every other control keeps its value, none greyed or reset', (await controlValues(a)) === set, await controlValues(a));
		ok('...the project keeps the fill and the lines, and says the plot is off', JSON.stringify(await stored(a)) === JSON.stringify({ show: false, fill: 'bands', lines: true }) || (await a.settle(2800), JSON.stringify(await stored(a))) === JSON.stringify({ show: false, fill: 'bands', lines: true }), JSON.stringify(await stored(a)));
		await shot(a.page, 'contour-box-show-off-r5');
		// A control changed while Show plot is off waits for it.
		await setBox(a, 'lpn_contour_buffer', 4);
		f = await facts(a.page);
		ok('a control changed while Show plot is off draws nothing', !f.fill && f.lines === 0);
		await setBox(a, 'lpn_contour_show', true);
		f = await facts(a.page);
		const back = JSON.parse(await controlValues(a));
		ok('Show plot checked: the plot returns as set (bands, buffer 4, labels off)', f.fill && f.lines > 0 && back.lpn_contour_fill === 'bands' && back.lpn_contour_buffer === '4' && back.lpn_contour_labels === false && back.lpn_contour_opacity === '35' && back.lpn_contour_interval === '20', JSON.stringify(back));
		// Undo takes the plot away and brings it back.
		await setBox(a, 'lpn_contour_show', false);
		await a.page.mouse.click(5, 5);
		await a.page.keyboard.press('Control+z');
		await a.settle(1000);
		f = await facts(a.page);
		ok('Undo of Show plot cleared brings the plot back, the other controls as set', f.show === true && f.fill && JSON.parse(await controlValues(a)).lpn_contour_fill === 'bands', JSON.stringify({ show: f.show, fill: f.fill }));
		// Save and reopen with the plot off.
		await setBox(a, 'lpn_contour_show', false);
		await a.settle(2800);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		const sv = await stored(a);
		f = await facts(a.page);
		ok('reopened: the plot is not drawn, and the project holds Show plot clear with Fill Bands', !f.fill && f.lines === 0 && sv && sv.show === false && sv.fill === 'bands', JSON.stringify({ sv, fill: f.fill, lines: f.lines }));
		// Water, Graphs, Contour is the door that turns the plot on; it keeps the other settings.
		await contourFromMenu(a);
		f = await facts(a.page);
		const re = JSON.parse(await controlValues(a));
		ok('Graphs, Contour then turns it on with Fill still Bands and opacity 35', f.show === true && f.fill && re.lpn_contour_fill === 'bands' && re.lpn_contour_opacity === '35', JSON.stringify({ show: f.show, fill: f.fill, re }));
		noErrors(a);
	} finally { await a.close(); }

	console.log('\n--- 7b. a child scenario: Show plot is the scenario\'s own, the others untouched ---');
	const b = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(b);
		await setBox(b, 'lpn_contour_fill', 'bands');
		await newScenario(b);
		await contourFromMenu(b);
		let f = await facts(b.page);
		ok('the child opens with the plot showing, as set in Base', f.show === true && f.fill);
		const set = await controlValues(b);
		await setBox(b, 'lpn_contour_show', false);
		f = await facts(b.page);
		ok('child: Show plot cleared draws nothing and changes no other control', !f.fill && (await controlValues(b)) === set);
		await b.page.click('#lpn_scenario_btn');
		await b.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const base = await b.lang('lpn_scenario_base');
		for (const r of await b.page.$$('#lpn_menu_list button.lpn-menu-row')) { if ((await r.textContent()).trim().replace(/^\u2713\s*/, '').replace(/\s*\(\d+\)$/, '') === base) { await r.click(); break; } }
		await b.settle(1500);
		f = await facts(b.page);
		ok('back in Base the plot is still showing, Bands', f.show === true && f.fill && JSON.parse(await controlValues(b)).lpn_contour_fill === 'bands', JSON.stringify({ show: f.show, fill: f.fill }));
		noErrors(b);
	} finally { await b.close(); }
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
		const only = process.env.CONTOUR_ONLY ? process.env.CONTOUR_ONLY.split(',') : null;
		const run = (k, f) => (!only || only.indexOf(k) >= 0) ? f(Session, browser) : null;
		await run('1', main0);
		await run('2', main1);
		await run('3', main2);
		await run('4', main4);
		await run('5', main5);
		await run('6', sectionPhone);
		await run('7', section7);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

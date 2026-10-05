// Task 748: menu mnemonics and keyboard mode on the Looped Network page. Real key presses against the
// real page: Alt+Shift+{F,E,M,W,H,L} (Ctrl+Option on a Mac) open File, Edit, Map, Water, Help and
// Language with focus on the first enabled row, from inside a text field too; F10 goes to the bar;
// the Latin key badges show only in keyboard mode; pointer-only rows are skipped by the arrow keys;
// no chord reaches a drawing tool; and a right-to-left page opens the same menus.
// Rows (Tom, 2026-10-03): every actionable row carries an automatic letter, unique in its menu, so
// Alt+Shift+W, G, P opens the Profile graph; a Chinese menu falls back to digits; a row's existing
// shortcut (Undo's Ctrl+Z, Cmd+Z on a Mac; a tool's digit) shows right-justified, always; and Help's
// Menus block has exactly two rows, Alt+Shift+letter and F10.
//
// Run with:
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/menu-mnemonic-harness.js

const path = require('path');
const env = require('../browser-pass/lib/env');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const MENUS = [['F', 'lpn_menu_file'], ['E', 'lpn_menu_edit'], ['M', 'lpn_menu_map'],
	['W', 'lpn_menu_project'], ['H', 'lpn_menu_help'], ['L', 'lpn_menu_lang']];

async function suite(page, label, mac) {
	console.log('\n=== ' + label + ' ===');
	const chord = async (letter) => {
		if (mac) { await page.keyboard.press('Control+Alt+' + letter.toLowerCase()); }
		else { await page.keyboard.press('Alt+Shift+' + letter); }
	};
	const shown = () => page.evaluate(() => document.getElementById('lpn_menu_popup').style.display === 'block');
	const expandedId = () => page.evaluate(() => {
		const e = document.querySelector('#lpn_menubar .lpn-menubar-item[aria-expanded="true"]');
		return e ? e.id : '';
	});
	const firstRowFocused = () => page.evaluate(() => {
		const rows = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row:not(:disabled):not([data-pointer-only])'));
		return rows.length > 0 && document.activeElement === rows[0];
	});
	const badgesVisible = () => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-kbdbadge'))
		.filter((b) => b.getClientRects().length > 0).map((b) => b.textContent).join(''));
	const mode = () => page.evaluate((m) => (window.__lpnMode = null, document.getElementById('lpn_mode_hint') ? document.getElementById('lpn_mode_hint').textContent : ''));
	const hint0 = await mode();

	ok('no badge is visible before keyboard mode', (await badgesVisible()) === '');
	for (const [letter, id] of MENUS) {
		await page.keyboard.press('Escape');
		await chord(letter);
		ok(letter + ' opens ' + id, (await shown()) && (await expandedId()) === id, await expandedId());
		ok(letter + ': focus is on the first enabled row', await firstRowFocused());
		ok(letter + ': the badge row is showing', (await badgesVisible()) === 'FEMWHL', await badgesVisible());
		await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
		ok(letter + ': two Escapes leave keyboard mode', (await badgesVisible()) === '' && !(await shown()));
	}
	ok('no chord changed the drawing tool', (await mode()) === hint0, await mode());

	console.log('--- from inside a text field ---');
	await page.evaluate(() => { const i = document.createElement('input'); i.id = 'km_probe'; document.body.appendChild(i); i.focus(); });
	await chord('E');
	ok('chord opens Edit while typing in an input', (await expandedId()) === 'lpn_menu_edit');
	await page.keyboard.press('Escape');
	ok('Escape closes the menu, focus on the Edit button, badges stay', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_edit' && (await badgesVisible()) === 'FEMWHL');
	await page.keyboard.press('Escape');
	ok('second Escape returns focus to the input', (await page.evaluate(() => document.activeElement.id)) === 'km_probe');
	ok('...and ends keyboard mode', (await badgesVisible()) === '');
	await page.evaluate(() => { document.getElementById('km_probe').value = ''; });
	await page.keyboard.type('m');
	ok('typing a plain letter still types', (await page.evaluate(() => document.getElementById('km_probe').value)) === 'm');
	await page.evaluate(() => document.getElementById('km_probe').remove());

	console.log('--- F10 ---');
	await page.evaluate(() => document.activeElement.blur());
	await page.keyboard.press('F10');
	ok('F10 focuses the first menu name', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_file');
	ok('...opens nothing', !(await shown()));
	ok('...and shows the badges', (await badgesVisible()) === 'FEMWHL');
	await page.keyboard.press(await page.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
	ok('Next-arrow walks the bar in keyboard mode', (await page.evaluate(() => document.activeElement.id)) === 'lpn_menu_edit');
	await page.keyboard.press('Escape');
	ok('Escape from the bar ends the mode', (await badgesVisible()) === '');
	ok('...and leaves the menu bar', !(await page.evaluate(() => document.activeElement.classList.contains('lpn-menubar-item'))));

	console.log('--- a click ends keyboard mode ---');
	await chord('F');
	ok('badges up', (await badgesVisible()) === 'FEMWHL');
	await page.mouse.click(700, 500);
	ok('a pointer click removes them', (await badgesVisible()) === '' && !(await shown()));

	console.log('--- no reflow ---');
	const widths = async () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menubar .lpn-menubar-item')).map((b) => b.getBoundingClientRect().width + ':' + b.getBoundingClientRect().left).join(','));
	const w0 = await widths();
	await page.keyboard.press('F10');
	ok('the bar does not move when the badges show', (await widths()) === w0);
	await page.keyboard.press('Escape');

	console.log('--- focus returns to where it was after a row that opens no box ---');
	await page.evaluate(() => { const d = document.createElement('div'); d.id = 'km_cell'; d.tabIndex = 0; d.textContent = 'cell'; document.body.appendChild(d); });
	const onCell = () => page.evaluate(() => document.activeElement.id === 'km_cell');
	await page.focus('#km_cell');
	await chord('E');
	const undoLabel = await page.evaluate(() => EngCalcs.pageConfig.lpn_tool_undo);
	for (let g = 0; g < 40 && (await page.evaluate(() => document.activeElement.textContent.trim())) !== undoLabel; g++) { await page.keyboard.press('ArrowDown'); }
	await page.keyboard.press('Enter');
	await page.waitForTimeout(250);
	ok('Edit > Undo: focus is back on the cell', await onCell(), await page.evaluate(() => document.activeElement.id || document.activeElement.tagName));
	ok('...the menu is closed and keyboard mode over', !(await shown()) && (await badgesVisible()) === '');
	await page.focus('#km_cell');
	await chord('M');
	await page.keyboard.press('Enter');   // first row: Zoom to fit
	await page.waitForTimeout(250);
	ok('Map > Zoom to fit: focus is back on the cell', await onCell(), await page.evaluate(() => document.activeElement.id || document.activeElement.tagName));
	await page.focus('#km_cell');
	await chord('W');
	const setLabel = await page.evaluate(() => EngCalcs.pageConfig.lpn_tool_settings);
	for (let g = 0; g < 40 && (await page.evaluate(() => document.activeElement.textContent.trim())) !== setLabel; g++) { await page.keyboard.press('ArrowDown'); }
	await page.keyboard.press('Enter');
	await page.waitForTimeout(250);
	ok('Water > Settings: focus lands on a field, not the close button', await page.evaluate(() => {
		const a = document.activeElement, b = document.getElementById('lpn_settings_box');
		return !!b && b.contains(a) && a.id !== 'lpn_settings_close' && !a.classList.contains('lpn-popover-x');
	}), await page.evaluate(() => document.activeElement.tagName + '#' + document.activeElement.id));
	await page.keyboard.press('Escape');
	await page.evaluate(() => document.getElementById('km_cell').remove());

	console.log('--- Map > Background image: the pick rows are pointer-only ---');
	await chord('M');
	// The Background image row is the first fly-out row in the Map menu whose fly-out has an Add row.
	const nsub = await page.evaluate(() => document.querySelectorAll('#lpn_menu_list button.lpn-menu-row[aria-haspopup]').length);
	let bd = [];
	for (let i = 0; i < nsub && !bd.length; i++) {
		await page.evaluate((k) => document.querySelectorAll('#lpn_menu_list button.lpn-menu-row[aria-haspopup]')[k].focus(), i);
		await page.keyboard.press(await page.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
		bd = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).map((b) => ({ t: b.textContent.trim(), po: b.hasAttribute('data-pointer-only') })));
		if (!bd.some((r) => r.po)) { bd = []; }
	}
	const pc = await page.evaluate(() => [EngCalcs.pageConfig.lpn_backdrop_position, EngCalcs.pageConfig.lpn_backdrop_scale, EngCalcs.pageConfig.lpn_backdrop_scale_from]);
	ok('Move, Scale by picking and Scale from... are flagged', pc.every((t) => bd.some((r) => r.t === t && r.po)), JSON.stringify(bd));
	ok('Add and the world-file row are not', bd.filter((r) => !r.po).length >= 2);
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');

	console.log('--- pointer-only rows ---');
	const pointerOnly = await page.evaluate(() => null);
	await chord('E');
	const edit = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((b) => ({ t: b.textContent.trim(), po: b.hasAttribute('data-pointer-only'), dis: b.disabled })));
	ok('Edit has pointer-only rows (Vertices, selection shapes)', edit.filter((r) => r.po).length >= 4, JSON.stringify(edit.filter((r) => r.po)));
	ok('...and they stay visible in the list', edit.length > edit.filter((r) => !r.po).length);
	const seen = new Set();
	for (let i = 0; i < edit.length + 2; i++) {
		seen.add(await page.evaluate(() => document.activeElement.hasAttribute('data-pointer-only')));
		await page.keyboard.press('ArrowDown');
	}
	ok('ArrowDown never lands on a pointer-only row', !seen.has(true));
	await page.keyboard.press('End');
	ok('End does not either', !(await page.evaluate(() => document.activeElement.hasAttribute('data-pointer-only'))));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	await chord('W');
	await page.keyboard.press('Enter');   // the Water menu's first row, Insert, opens its fly-out
	const sub = await page.evaluate(() => ({ open: document.getElementById('lpn_menu_popup2').style.display === 'block',
		onPointer: document.activeElement.hasAttribute('data-pointer-only'),
		n: document.querySelectorAll('#lpn_menu_list2 [data-pointer-only]').length }));
	ok('Water > Insert fly-out opened, its asset rows are pointer-only, focus is not on one', sub.open && sub.n >= 8 && !sub.onPointer, JSON.stringify(sub));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
}

// ---- row mnemonics and right-justified shortcuts ----------------------------------------------------
async function rowSuite(page, label, opts) {
	console.log('\n=== rows: ' + label + ' ===');
	const chord = async (letter) => {
		if (opts.mac) { await page.keyboard.press('Control+Alt+' + letter.toLowerCase()); }
		else { await page.keyboard.press('Alt+Shift+' + letter); }
	};
	const listRows = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).map((b) => ({
		t: b.textContent.replace(/[▸\s]+$/, '').trim(), m: b.getAttribute('data-mnemonic') || '',
		po: b.hasAttribute('data-pointer-only'), sub: b.getAttribute('aria-haspopup') === 'menu',
		badge: (() => { const ic = b.querySelector('.lpn-menu-icon'), cs = ic && getComputedStyle(ic, '::after');
			return cs && cs.display !== 'none' && cs.content && cs.content !== 'none' && cs.content !== 'normal' ? ic.getAttribute('data-mnemonic') : ''; })(),
		hk: (() => { const cs = getComputedStyle(b, '::after');
			return cs.content && cs.content !== 'none' && cs.content !== 'normal' ? b.getAttribute('data-hotkey') || '' : ''; })()
	})), sel);
	// A Latin letter or digit is a real key press; another script's letter is the keydown its own
	// layout would send (the test browser's layout is US).
	const pressRowKey = async (ch) => {
		if (/^[a-z0-9]$/.test(ch)) { await page.keyboard.press(ch); return; }
		await page.evaluate((k) => (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })), ch);
	};
	const pc = await page.evaluate(() => EngCalcs.pageConfig);
	const hint0 = await page.evaluate(() => document.getElementById('lpn_mode_hint') ? document.getElementById('lpn_mode_hint').textContent : '');
	await page.evaluate(() => { try { localStorage.removeItem('lpn_pane'); } catch (e) {} });
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape');

	// Every menu: actionable rows have a letter, letters are unique, pointer-only rows have none,
	// and the letters show as badges in keyboard mode.
	for (const L of ['F', 'E', 'M', 'W', 'H']) {
		await chord(L);
		const rs = await listRows('#lpn_menu_list');
		const act = rs.filter((r) => !r.po);
		const ms = act.map((r) => r.m);
		ok(L + ': every keyboard row has a letter', act.length > 0 && ms.every((m) => m !== ''), JSON.stringify(rs));
		ok(L + ': letters are unique in the menu', new Set(ms).size === ms.length, ms.join(''));
		ok(L + ': no pointer-only row has one', rs.filter((r) => r.po).every((r) => r.m === ''));
		ok(L + ': the letters show in keyboard mode', act.every((r) => r.badge !== ''), JSON.stringify(act.map((r) => r.badge)));
		if (opts.digits) {
			// A Han label never yields its own character (an input method types it); it falls back to a
			// digit, then a Latin letter. A Latin word inside the label (Cookie, EPANET) keeps its letter.
			ok(L + ': no mnemonic is a character typed through an input method', ms.every((m) => /^[0-9a-z]$/.test(m)), ms.join(''));
			ok(L + ': an all-Han label gets a digit first', act.filter((r) => /^[\u3400-\u9fff\s]+$/.test(r.t)).slice(0, 10).every((r) => /^[0-9]$/.test(r.m)), ms.join(''));
		}
		await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	}

	// Alt+Shift+W, then the Graphs row's letter, then the Profile row's letter.
	await chord('W');
	const water = await listRows('#lpn_menu_list');
	const g = water.find((r) => r.t === pc.lpn_graphs_menu);
	if (opts.english) { ok('Graphs is G in the Water menu', g && g.m === 'g', JSON.stringify(water.map((r) => r.t + '=' + r.m))); }
	await pressRowKey(g ? g.m : 'g');
	const sub = await page.evaluate(() => document.getElementById('lpn_menu_popup2').style.display === 'block');
	ok('the Graphs letter opens its fly-out', sub);
	const graphs = await listRows('#lpn_menu_list2');
	const p = graphs.find((r) => r.t === pc.lpn_profile_menu);
	if (opts.english) { ok('Profile is P in Graphs', p && p.m === 'p', JSON.stringify(graphs)); }
	ok('...with focus on its first row', await page.evaluate(() => document.getElementById('lpn_menu_list2').contains(document.activeElement)));
	await pressRowKey(p ? p.m : 'p');
	await page.waitForTimeout(250);
	const pane = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lpn_pane') || 'null'); } catch (e) { return null; } });
	ok((opts.english ? 'W, G, P' : 'W, then the two letters') + ' opens the Profile graph', !!pane && pane.open && pane.tab === 'profile', JSON.stringify(pane));
	ok('...and closes the menu', await page.evaluate(() => document.getElementById('lpn_menu_popup').style.display !== 'block'));
	ok('no letter reached a drawing tool', (await page.evaluate(() => document.getElementById('lpn_mode_hint') ? document.getElementById('lpn_mode_hint').textContent : '')) === hint0);
	await page.evaluate(() => document.activeElement && document.activeElement.blur());

	// Shortcuts: Undo's, right-justified and muted, shown on a mouse-opened menu too.
	await page.click('#lpn_menu_edit');
	const edit = await listRows('#lpn_menu_list');
	const undo = edit.find((r) => r.t === pc.lpn_tool_undo);
	ok('Edit > Undo shows ' + (opts.mac ? 'Cmd+Z' : 'Ctrl+Z') + ' with the mouse', undo && undo.hk === (opts.mac ? 'Cmd+Z' : 'Ctrl+Z'), JSON.stringify(undo));
	ok('...and no row letter badge without keyboard mode', edit.every((r) => r.badge === ''));
	// Generated content has no box of its own to measure, so the row is measured with and without it:
	// the label must not move, the row must not grow a line, and the float sits at the inline end.
	const geo = await page.evaluate((lbl) => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((x) => x.textContent.trim() === lbl);
		const cs = getComputedStyle(b, '::after'), tn = b.childNodes[1];
		const rng = document.createRange(); rng.selectNodeContents(tn);
		const t1 = rng.getBoundingClientRect(), h1 = b.getBoundingClientRect().height;
		const hk = b.getAttribute('data-hotkey'); b.removeAttribute('data-hotkey');
		const t0 = rng.getBoundingClientRect(), h0 = b.getBoundingClientRect().height;
		b.setAttribute('data-hotkey', hk);
		return { float: cs.float, labelStill: t0.left === t1.left && t0.top === t1.top, oneLine: h0 === h1,
			color: cs.color, rowColor: getComputedStyle(b).color };
	}, pc.lpn_tool_undo);
	ok('...right-justified (floated to the inline end), on the label\'s line, label unmoved', /inline-end|right/.test(geo.float) && geo.labelStill && geo.oneLine, JSON.stringify(geo));
	ok('...in a muted colour', geo.color !== geo.rowColor, JSON.stringify(geo));
	ok('Select shows its digit 1, Delete the Delete key', (edit.find((r) => r.t === pc.lpn_tool_select) || {}).hk === '1' && (edit.find((r) => r.t === pc.lpn_tool_delete) || {}).hk === 'Delete');
	ok('a row with no shortcut shows none (Find and replace)', (edit.find((r) => r.t === pc.lpn_find_menu) || { hk: 'x' }).hk === '');
	await page.click('#lpn_menu_edit');
	await page.click('#lpn_menu_project');
	await page.hover('#lpn_menu_list button.lpn-menu-row[aria-haspopup]');
	await page.waitForTimeout(150);
	const ins = await listRows('#lpn_menu_list2');
	ok('Water > Insert > Junction shows 2, Text 9', (ins.find((r) => r.t === pc.lpn_tool_add_junction) || {}).hk === '2' && (ins.find((r) => r.t === pc.lpn_tool_add_text) || {}).hk === '9', JSON.stringify(ins.map((r) => r.hk)));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	await page.mouse.click(700, 500);
}

// ---- the four pre-review defects (Perry, 2026-10-03, on f783fe5f) ----------------------------------
async function preReviewSuite(browser, open) {
	console.log('\n=== pre-review fixes ===');
	// An example opened FIRST (a gallery card stops answering clicks once a chord has run).
	const openNet1 = async (pg) => {
		await pg.evaluate(() => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const card = cards.find((c) => ((c.querySelector('.lpn-example-title') || c).textContent || '').trim() === 'EPANET Net1') || cards[0];
			card.click();
		});
		await pg.waitForTimeout(1500);
	};
	const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	// Task 710: the page's question box answers through window.prompt/confirm, which this run scripts.
	await ctx.addInitScript(require('../browser-pass/lib/pickers').NATIVE_DIALOG_SEAM);
	const page = await open(ctx, '');
	await openNet1(page);
	const pc = await page.evaluate(() => EngCalcs.pageConfig);
	const sub2 = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row'))
		.map((b) => ({ t: b.textContent.replace(/[▸\s]+$/, '').trim(), m: b.getAttribute('data-mnemonic') || '' })));
	const key = (k, code) => page.evaluate(([k, code]) => (document.activeElement || document.body).dispatchEvent(
		new KeyboardEvent('keydown', { key: k, code: code, bubbles: true, cancelable: true })), [k, code]);

	// (1) A fixed row's letter does not depend on the project's scenario names.
	const fixedLetters = async () => {
		await page.keyboard.press('Alt+Shift+W');
		// Scenarios, by ITS OWN letter as the menu now assigns it, read off the row rather than
		// typed in here: a row added above it (Water > Change type, 2026-10-05) moves the letter,
		// and what this section tests is the fly-out's rows, not which letter opens it.
		const scnKey = await page.evaluate((label) => {
			const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'))
				.find((x) => x.textContent.replace(/[▸\s]+$/, '').trim().endsWith(label));
			return b ? b.getAttribute('data-mnemonic') : 'c';
		}, pc.lpn_scenario_menu);
		await page.keyboard.press(scnKey);
		const rs = await sub2();
		const want = [pc.lpn_scenario_new, pc.lpn_scenario_rename, pc.lpn_scenario_delete, pc.lpn_scenario_basic];
		const got = want.map((w) => (rs.find((r) => r.t === w || r.t.endsWith(w)) || { m: '?' }).m);
		return { got, rows: rs };
	};
	const before = await fixedLetters();
	await page.evaluate(() => { window.prompt = () => 'Delta'; window.prompt2 = 1; });
	const newM = before.got[0];
	await page.keyboard.press(newM);   // New scenario..., named Delta (takes D first if allowed)
	await page.waitForTimeout(300);
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	const after = await fixedLetters();
	ok('the scenario Delta was created', after.rows.some((r) => /Delta/.test(r.t)), JSON.stringify(after.rows));
	ok('New/Rename/Delete scenario and Basic mode keep their letters when a scenario is added', before.got.join('') === after.got.join('') && !before.got.includes('?'),
		before.got.join('') + ' -> ' + after.got.join(''));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');

	// (3) A Latin key with no row never falls back to the QWERTY position: Dvorak "b" is code KeyN,
	// and N in Edit is Delete network.
	await page.evaluate(() => { window.__confirms = 0; window.confirm = () => { window.__confirms++; return false; }; });
	await page.keyboard.press('Alt+Shift+E');
	const nRow = await page.evaluate(() => !!document.querySelector('#lpn_menu_list button.lpn-menu-row[data-mnemonic="n"]'));
	const hasB = await page.evaluate(() => !!document.querySelector('#lpn_menu_list button.lpn-menu-row[data-mnemonic="b"]'));
	await key('b', 'KeyN');
	ok('Dvorak "b" (code KeyN) in Edit runs nothing', nRow && !hasB && (await page.evaluate(() => window.__confirms)) === 0
		&& (await page.evaluate(() => document.getElementById('lpn_menu_popup').style.display === 'block')), 'n row ' + nRow + ', b row ' + hasB);
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
	// ...while a non-Latin layout still reaches a Latin letter by position: Russian "п" is KeyG.
	await page.keyboard.press('Alt+Shift+W');
	await key('п', 'KeyG');
	ok('Russian-layout "п" (code KeyG) in Water opens Graphs', await page.evaluate(() => document.getElementById('lpn_menu_popup2').style.display === 'block'));
	await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');

	// (2) After W, G, P from a table cell the cell is hidden by the tab switch; focus must not fall
	// to the page body.
	await page.keyboard.press('Alt+Shift+W');
	await page.keyboard.press('t');   // Tables
	await page.waitForTimeout(300);
	const cellOk = await page.evaluate(() => {
		const tabs = document.getElementById('lpn_pane_tabs');
		const c = Array.from(document.querySelectorAll('#lpn_pane .on td, #lpn_pane .on [tabindex="0"], #lpn_pane .on input'))
			.filter((el) => el.getClientRects().length > 0 && !(tabs && tabs.contains(el)))[0];
		if (!c) { return ''; }
		if (!c.hasAttribute('tabindex') && c.tagName === 'TD') { c.tabIndex = 0; }
		c.id = c.id || 'km_tablecell'; c.focus();
		return document.activeElement === c ? c.id : '';
	});
	await page.keyboard.press('Alt+Shift+W'); await page.keyboard.press('g'); await page.keyboard.press('p');
	await page.waitForTimeout(300);
	const fx = await page.evaluate((id) => {
		const a = document.activeElement, c = document.getElementById(id);
		return { body: a === document.body || !a, inPane: !!document.getElementById('lpn_pane') && document.getElementById('lpn_pane').contains(a),
			canvas: a && a.id === 'lpn_canvas', what: a ? a.tagName + '#' + a.id : '' };
	}, cellOk);
	ok('W, G, P from a table cell (' + cellOk + '), which the Profile tab hides: focus is in the pane or on the map, not the body',
		!!cellOk && !fx.body && (fx.inPane || fx.canvas), JSON.stringify(fx));
	await ctx.close();

	// (4) With the Calculate run box up, the first Enter on a keyboard-opened menu row runs the row.
	const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	const p2 = await open(c2, '');
	await openNet1(p2);
	await p2.evaluate(() => window.EngCalcs.lpnTimeRunNow());
	for (let i = 0; i < 60 && (await p2.evaluate(() => { const s = window.EngCalcs.lpnTimeRunBoxState(); return !s.open || s.phase === 'running'; })); i++) { await p2.waitForTimeout(250); }
	const boxUp = await p2.evaluate(() => window.EngCalcs.lpnTimeRunBoxState().open);
	ok('the run box is showing (precondition)', boxUp);
	await p2.keyboard.press('Alt+Shift+E');
	const focused = await p2.evaluate(() => document.activeElement.textContent.trim());
	await p2.keyboard.press('Enter');
	await p2.waitForTimeout(200);
	ok('Enter on Edit > ' + focused + ' runs it: the menu closes, the run box is not what took the key',
		await p2.evaluate(() => document.getElementById('lpn_menu_popup').style.display !== 'block' && window.EngCalcs.lpnTimeRunBoxState().open));
	await c2.close();
}

async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const open = async (ctx, q) => {
			const page = await ctx.newPage();
			await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1' + q), { waitUntil: 'load' });
			await page.waitForSelector('#lpn_menubar .lpn-menubar-item');
			await page.waitForTimeout(400);
			return page;
		};
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const enPage = await open(ctx, '');
		await suite(enPage, 'Windows/Linux, English', false);
		await rowSuite(enPage, 'English', { english: true });
		console.log('\n=== Help > Tables and Hotkeys: the Menus block is two rows ===');
		const help = await enPage.evaluate(() => {
			const tbl = Array.from(document.querySelectorAll('table')).filter((t) => /Alt\+Shift/.test(t.textContent));
			return { n: tbl.length, rows: tbl[0] ? Array.from(tbl[0].querySelectorAll('tr')).map((r) => r.cells[0].textContent) : [] };
		});
		ok('one table mentions Alt+Shift, with exactly two rows: Alt+Shift+letter and F10', help.n === 1 && help.rows.length === 2 && help.rows[0] === 'Alt+Shift+letter' && help.rows[1] === 'F10', JSON.stringify(help));
		await ctx.close();

		const mac = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36' });
		const mp = await open(mac, '');
		await mp.addInitScript(() => {});
		console.log('\n=== Mac: Ctrl+Option, and Alt+Shift does nothing ===');
		const isMac = await mp.evaluate(() => /mac/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform));
		if (isMac) {
			await mp.keyboard.press('Alt+Shift+F');
			ok('Alt+Shift+F is not a chord on a Mac', await mp.evaluate(() => document.getElementById('lpn_menu_popup').style.display !== 'block'));
			await mp.keyboard.press('Control+Alt+f');
			ok('Ctrl+Option+F opens File', await mp.evaluate(() => document.getElementById('lpn_menu_file').getAttribute('aria-expanded') === 'true'));
			await mp.keyboard.press('Escape'); await mp.keyboard.press('Escape');
			await rowSuite(mp, 'Mac', { english: true, mac: true });
		} else {
			console.log('  (platform string is not Mac under this browser; Mac branch not exercised)');
		}
		await mac.close();

		const rtl = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const rp = await open(rtl, '&lang=he');
		ok('the page is dir=rtl', await rp.evaluate(() => getComputedStyle(document.documentElement).direction) === 'rtl');
		await suite(rp, 'right-to-left (he)', false);
		await rowSuite(rp, 'right-to-left (he)', {});
		await rp.keyboard.press('F10');
		const geo = await rp.evaluate(() => {
			const b = document.querySelector('#lpn_menu_file'), g = b.querySelector('.lpn-kbdbadge');
			const br = b.getBoundingClientRect(), gr = g.getBoundingClientRect();
			return { badgeNearLeft: gr.left < br.left + br.width / 2 && gr.right <= window.innerWidth, text: g.textContent };
		});
		ok('in RTL the badge sits at the inline-end (left) corner and reads as a Latin letter', geo.badgeNearLeft && geo.text === 'F', JSON.stringify(geo));
		await rtl.close();

		await preReviewSuite(browser, open);

		const zc = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		await rowSuite(await open(zc, '&lang=zh'), 'Chinese, digits', { digits: true });
		await zc.close();

		const ph = await browser.newContext({ viewport: { width: 390, height: 800 } });
		const pp = await open(ph, '');
		await pp.keyboard.press('F10');
		const phone = await pp.evaluate(() => {
			const bar = document.getElementById('lpn_menubar'), bs = Array.from(document.querySelectorAll('.lpn-kbdbadge')).map((g) => g.getBoundingClientRect());
			return { overflow: document.documentElement.scrollWidth > window.innerWidth, barH: bar.getBoundingClientRect().height, visible: bs.filter((r) => r.width > 0).length };
		});
		ok('phone width: six badges, no horizontal overflow', phone.visible === 6 && !phone.overflow, JSON.stringify(phone));
		await ph.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(`\n${fails === 0 ? 'ALL GREEN' : fails + ' FAILURE(S)'}`);
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((err) => { console.error(err); env.stopServer(); process.exit(1); });

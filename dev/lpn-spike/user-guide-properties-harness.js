// THE GUIDE'S PROPERTIES CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-properties-harness.js   (takes the browser lock itself)
//
// The chapter is the entry for the Properties box. Real Chromium:
//   1. Every interface name the chapter quotes is the language file's own, read from it.
//   2. The entry renders in the Guide with its six terms, and a search finds it.
//   3. The worked example is performed on Net1 as the chapter says: Pipe 10's inputs and results, then
//      Pipes 31 and 113 selected together, Various, the notice, both pipes at 10 in., one Undo.
//   4. The behaviour the chapter states: results follow a link's inputs and sit among a node's, the
//      ID is refused with a space, with a quotation mark, and when in use, a node and a link can share
//      one, the right-click menu rows, and Properties stays open when the scenario changes.
//   5. A page in another language renders the same entry.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, searchFinds, dialogPress, finish } = L;
const NAME = 'user-guide-properties-harness';
U.takeBrowserLock(NAME, 'EC_UGPROP_LOCKED');

const QUOTES = {
	lpn_guide_prop_open_def: ['lpn_tool_select', 'lpn_copy_props_menu', 'lpn_paste_props_menu', 'lpn_tsb_menu'],
	lpn_guide_prop_edit_def: ['lpn_pipetype_detach', 'lpn_settings_auto_run'],
	lpn_guide_prop_multi_def: ['lpn_multi_varies'],
	lpn_guide_prop_example_def: ['lpn_field_desc', 'lpn_field_active', 'lpn_field_diameter', 'lpn_multi_varies']
};
const TERMS = ['lpn_guide_prop_open_term', 'lpn_guide_prop_edit_term', 'lpn_guide_prop_id_term', 'lpn_guide_prop_scn_term',
	'lpn_guide_prop_multi_term', 'lpn_guide_scn_example_term'];

async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes(QUOTES);

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 700);
		const closePopup = async () => { await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }); await settle(400); };
		const popupRows = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => {
			const i = l.querySelector('input,select,textarea');
			// The row as the reader reads it, left to right: label (the unit stands in it), value.
			const n = l.querySelector('.lpn-gname'), v = l.querySelector('.lpn-gval');
			const text = n ? [n.textContent, i ? '' : (v ? v.textContent : '')].join(' ').replace(/\s+/g, ' ').trim() : l.textContent.replace(/\s+/g, ' ').trim();
			return { text: text, input: !!i, value: i ? i.value : null, ph: i ? i.placeholder : null, off: i ? !!(i.disabled || i.readOnly) : null };
		}));
		// The middle of the asset's hit area. A vertical pipe has a bounding box of no width, so the hit
		// polyline is asked for by its class rather than by a positive width.
		const centerOf = (kind, id) => P.evaluate(([k, i]) => {
			const all = Array.from(document.querySelectorAll('#lpn_canvas [data-' + k + '="' + i + '"]'));
			const e = all.filter((x) => x.classList.contains('lpn-link-hit') && (x.getBoundingClientRect().width > 0 || x.getBoundingClientRect().height > 0))[0]
				|| all.filter((x) => x.getBoundingClientRect().width > 0)[0];
			const r = e.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [kind, id]);
		const diam = async (id) => (await U.storedProject(ctx)).links.filter((l) => String(l.id) === id)[0];
		const undo = async () => {
			await P.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await P.mouse.move(700, 600);
			await P.keyboard.press('Control+z');
			await settle(700);
		};

		// ---- 2. the entry renders ---------------------------------------------------------------
		console.log('\n2. The entry renders in the Guide, and a search finds it');
		await openGuide(a);
		const en = await entry(P, 'lpn_popup');
		ok('the Properties entry is in the Guide, with its six terms in order', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)), en && JSON.stringify(en.dts));
		ok('...after the box\'s opening paragraph', !!en && en.text.indexOf(plain(enString('lpn_guide_text_popup')).slice(0, 30)) >= 0);
		ok('a search for "Shift-click" shows the Properties entry', await searchFinds(a, 'lpn_popup', 'Shift-click'));
		await P.keyboard.press('Escape');
		await settle(300);

		// ---- 3. a link's inputs, then its results; a node's results among its inputs --------------
		console.log('\n3. Inputs and results');
		await U.openProperties(ctx, 'link', '10');
		await settle(500);
		let rows = await popupRows();
		const idx = (rows, start) => rows.findIndex((r) => r.text.indexOf(start) === 0);
		const lastInput = idx(rows, await T('lpn_field_active'));
		const flow = idx(rows, await T('lpn_result_flow')), vel = idx(rows, await T('lpn_result_velocity'));
		ok('Pipe 10: Description is the first row and Is active? the last input; the calculated rows follow it', idx(rows, await T('lpn_field_desc')) === 0 && lastInput > 0 && flow > lastInput && vel > flow, JSON.stringify(rows.map((r) => r.text.slice(0, 18))));
		ok('...the calculated rows have no box to type in', rows.slice(lastInput + 1).every((r) => !r.input), JSON.stringify(rows.slice(lastInput + 1).map((r) => r.input)));
		const ex = plain(enString('lpn_guide_prop_example_def'));
		const val = (i) => rows[i].text.replace(/[^0-9.]+$/, '').split(' ').pop();
		const HL = rows[idx(rows, await T('lpn_result_headloss'))].text;
		ok('...Flow 1866.2, Velocity 2.4 and Head loss 19.12, which the chapter quotes with their units', val(flow) === '1866.2' && val(vel) === '2.4' && HL.indexOf('19.12') >= 0
			&& ex.indexOf((await T('lpn_result_flow')) + ' ' + val(flow) + ' gpm') >= 0 && ex.indexOf((await T('lpn_result_velocity')) + ' ' + val(vel) + ' ft/sec') >= 0
			&& ex.indexOf((await T('lpn_result_headloss')) + ' ' + HL.split(' ').pop() + ' ' + (HL.match(/\(([^)]+)\)/) || [])[1]) >= 0, JSON.stringify([rows[flow].text, rows[vel].text, HL]));
		await closePopup();
		await U.openProperties(ctx, 'node', '11');
		await settle(500);
		rows = await popupRows();
		const head = idx(rows, await T('lpn_field_head')), pressure = idx(rows, await T('lpn_result_pressure')), initq = idx(rows, await T('lpn_quality_initial'));
		ok('Junction 11: Head and Pressure are read-only rows that sit before its last inputs', head > 0 && pressure > head && initq > pressure && !rows[head].input && !rows[pressure].input, JSON.stringify(rows.map((r) => r.text.slice(0, 14))));
		ok('...and the last row is an input again, Is active?', rows[rows.length - 1].text.indexOf(await T('lpn_field_active')) === 0 && rows[rows.length - 1].input);

		// ---- 4. the ID ------------------------------------------------------------------------------
		console.log('\n4. The ID');
		const tryId = async (v) => {
			await P.evaluate((val) => { const i = document.querySelector('#lpn_popup_title input'); i.value = val; i.dispatchEvent(new Event('change', { bubbles: true })); }, v);
			await settle(500);
			const d = await a.dialog();
			if (d) { await dialogPress(P, d.buttons[0]); await settle(300); }
			return { dialog: d && d.text, id: await P.evaluate(() => document.querySelector('#lpn_popup_title input').value) };
		};
		let r = await tryId('J 11');
		ok('an ID with a space is refused, with the message, and the old one stays', r.dialog && r.dialog.indexOf(await T('lpn_id_invalid')) >= 0 && r.id === '11', JSON.stringify(r));
		r = await tryId('J"11');
		ok('...so is an ID with a quotation mark', r.dialog && r.dialog.indexOf(await T('lpn_id_invalid')) >= 0 && r.id === '11', JSON.stringify(r));
		r = await tryId('12');
		ok('...and an ID another node has', r.dialog && r.dialog.indexOf(await T('lpn_id_taken')) >= 0 && r.id === '11', JSON.stringify(r));
		r = await tryId('110');
		ok('a node can take an ID that only a link has (Node 110 beside Pipe 110)', !r.dialog && r.id === '110', JSON.stringify(r));
		await undo();
		await closePopup();
		ok('...and Undo returns it to 11', (await U.storedProject(ctx)).nodes.some((n) => String(n.id) === '11'));
		ok('the chapter states these rules', ['space', 'quotation mark', 'another node', 'another link', 'same ID'].every((w) => plain(enString('lpn_guide_prop_id_def')).indexOf(w) >= 0));

		// ---- 5. several assets selected: the worked example ----------------------------------------
		console.log('\n5. Several assets selected');
		const p31 = await centerOf('link', '31'), p113 = await centerOf('link', '113');
		const before31 = (await diam('31')).diameter !== undefined ? (await diam('31')).diameter : (await diam('31'))._diameter;
		// Pipe 113 first: the box opens to the right of the selection, and would cover it from Pipe 31.
		await P.mouse.click(p113.x, p113.y);
		await settle(900);
		await P.keyboard.down('Shift');
		await P.mouse.click(p31.x, p31.y);
		await P.keyboard.up('Shift');
		await settle(1000);
		const m = await P.evaluate(() => ({ title: document.getElementById('lpn_popup_title').innerText.replace(/\s+/g, ' ').trim(),
			sections: Array.from(document.querySelectorAll('#lpn_popup_fields details.lpn-multi-section')).map((d) => ({ head: d.querySelector('summary').textContent, open: d.open })) }));
		const pipes = await T('lpn_tool_add_pipe');
		ok('Shift-click on a second pipe: the title is "' + (await T('lpn_multi_title')).replace('{n}', '2') + '"', m.title === (await T('lpn_multi_title')).replace('{n}', '2'), m.title);
		ok('...with one section, headed Pipes (2), open', m.sections.length === 1 && /\(2\)$/.test(m.sections[0].head) && m.sections[0].open, JSON.stringify(m.sections));
		ok('...and the chapter quotes the title and the heading form', plain(enString('lpn_guide_prop_multi_def')).indexOf((await T('lpn_multi_title')).replace('{n}', '2')) >= 0 && ex.indexOf(m.sections[0].head.trim()) >= 0, m.sections[0] && m.sections[0].head);
		rows = await popupRows();
		const DIA = await T('lpn_field_diameter'), FLOW = await T('lpn_result_flow'), VEL = await T('lpn_result_velocity');
		const dRow = rows.filter((x) => x.text.indexOf(DIA) === 0)[0];
		ok('Diameter shows ' + await T('lpn_multi_varies') + ', because the two pipes differ', !!dRow && dRow.ph === await T('lpn_multi_varies') && dRow.value === '', JSON.stringify(dRow));
		ok('...and no result is listed', rows.every((x) => x.text.indexOf(FLOW) !== 0 && x.text.indexOf(VEL) !== 0), JSON.stringify(rows.map((x) => x.text.slice(0, 12))));
		const a31 = await diam('31'), a113 = await diam('113');
		const d31 = a31._diameter !== undefined ? a31._diameter : a31.diameter, d113 = a113._diameter !== undefined ? a113._diameter : a113.diameter;
		ok('Pipe 31 is 6 in. and Pipe 113 is 8 in., as the chapter says', d31 === 6 && d113 === 8 && ex.indexOf('Pipe 31 is ' + d31 + ' in.') >= 0 && ex.indexOf('Pipe 113 is ' + d113 + ' in.') >= 0, JSON.stringify([d31, d113]));
		await P.evaluate(([ph, dia]) => {
			const lab = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((l) => l.textContent.replace(/\s+/g, ' ').trim().indexOf(dia) === 0)[0];
			const i = lab.querySelector('input');
			i.focus(); i.value = '10'; i.dispatchEvent(new Event('change', { bubbles: true })); i.blur();
		}, [await T('lpn_multi_varies'), DIA]);
		await settle(900);
		const wantNote = (await T('lpn_multi_applied')).replace('{prop}', dRow.text).replace('{n}', '2');
		ok('entering 10 sets both and the notice reads "' + wantNote + '"', (await a.notice()) === wantNote, await a.notice());
		ok('...and the chapter quotes the notice', plain(enString('lpn_guide_prop_multi_def')).indexOf(wantNote.replace(/\.$/, '')) >= 0 && ex.indexOf(wantNote) >= 0);
		const b31 = await diam('31'), b113 = await diam('113');
		ok('...both pipes are 10 in.', (b31._diameter !== undefined ? b31._diameter : b31.diameter) === 10 && (b113._diameter !== undefined ? b113._diameter : b113.diameter) === 10);
		await undo();
		const c31 = await diam('31'), c113 = await diam('113');
		ok('a single Undo restores both diameters', (c31._diameter !== undefined ? c31._diameter : c31.diameter) === 6 && (c113._diameter !== undefined ? c113._diameter : c113.diameter) === 8);
		ok('the pipes\' before value was read from the project, not assumed', before31 === 6);
		await closePopup();
		await P.keyboard.press('Escape'); await settle(300);
		await P.keyboard.press('Escape'); await settle(300);

		// ---- 6. the right-click menu ---------------------------------------------------------------------
		console.log('\n6. The right-click menu, and a scenario switch with Properties open');
		const pl = await centerOf('link', '10');
		await P.mouse.move(pl.x, pl.y);
		await P.mouse.click(pl.x, pl.y, { button: 'right' });
		await settle(600);
		const menu = await P.$$eval('.lpn-pane-ctxmenu button', (es) => es.map((e) => e.textContent.trim()));
		ok('the menu of a link has Copy properties, Paste properties to selection, and Time series graph, in that order',
			JSON.stringify(menu) === JSON.stringify([await T('lpn_copy_props_menu'), await T('lpn_paste_props_menu'), await T('lpn_tsb_menu')]), JSON.stringify(menu));
		await P.keyboard.press('Escape');
		await settle(300);
		await U.openProperties(ctx, 'link', '10');
		const SCN = await T('lpn_scenario_menu'), NEW = await T('lpn_scenario_new'), OK = await T('lpn_dialog_ok');
		await a.menuClickSub(SCN, NEW, 'project');
		await a.waitDialog(3000);
		await dialogPress(P, OK);
		await settle(1500);
		const stay = await P.evaluate(() => ({ open: document.getElementById('lpn_popup').style.display, id: (document.querySelector('#lpn_popup_title input') || {}).value }));
		ok('switching to a new scenario leaves Properties open on Pipe 10', stay.open === 'flex' && stay.id === '10', JSON.stringify(stay));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		// ---- 7. another language ---------------------------------------------------------------------------
		console.log('\n7. A page in another language shows the same entry');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await entry(b.page, 'lpn_popup');
		ok('the Spanish page shows the Properties entry with its six terms', !!es && TERMS.every((k, i) => es.dts[i] === esString(k)), es && JSON.stringify(es.dts.slice(0, 2)));
		ok('no page errors (Spanish)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.context.close().catch(() => {});
	} catch (e) {
		console.error(e && e.stack || e);
		ok('the harness ran to the end', false, String(e && e.message));
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	process.exit(finish(NAME));
}
main();

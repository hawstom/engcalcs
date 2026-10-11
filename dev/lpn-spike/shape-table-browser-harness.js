// THE SHAPE TABLE AND THE SHAPE ICON (ROADMAP Task 779), in a real Chrome, through real key presses.
//
//   node dev/lpn-spike/shape-table-browser-harness.js
//
// Tom, 2026-10-11: *"(1) Icon looks too much like the Vertices icon ... Use an open (almost closed)
// polygon instead, with no vertex markers. (2) I see no Shapes table. I need to be able to paste
// shapes so that I can import and export."* And his use case: *"import shapes from GIS or CAD to
// guide precise placement"* -- so a coordinate must come back out of the table exactly as it went in.
//
// 1. The toolbar's Shape button is one open five-leg stroke and no vertex markers.
// 2. On a grid project, three Shapes pasted into the empty Shapes table (Ctrl+Shift+V, from the
//    real clipboard) are created, listed, drawn, and one Undo takes all three back.
// 3. Ctrl+C on the whole table puts every coordinate on the clipboard character for character,
//    trailing zeros and eight decimals included.
// 4. A paste over the existing rows updates them (a moved point, a description, a polygon closed),
//    one Undo puts all of it back; a paste of new rows adds them and leaves the old ones alone.
// 5. A row whose Points cannot be read refuses the whole paste and changes nothing.
// 6. On a geographic project a latitude and longitude come back character for character.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHAPE_TABLE_BROWSER_LOCKED';
const NAME = 'shape-table-browser-harness';

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

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}

function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const stored = async () => {
		await settle(450);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
		});
	};
	const shapes = async () => ((await stored()) || {}).shapes || [];
	const setClip = (t) => P.evaluate((s) => navigator.clipboard.writeText(s), t);
	const getClip = () => P.evaluate(() => navigator.clipboard.readText());
	// The Shapes tab, by its own button.
	const showTable = async () => {
		const open = await P.evaluate(() => { const p = document.getElementById('lpn_pane'); return !!p && p.offsetParent !== null && getComputedStyle(p).display !== 'none'; });
		if (!open) { await a.toolbarClick(await a.lang('lpn_pane_toggle')); await settle(400); }
		await P.click('#lpn_pane_tab_shapes');
		await settle(400);
	};
	// The table as the user reads it: the heading texts, and each row's cells by column key.
	const table = () => P.evaluate(() => {
		const host = document.getElementById('lpn_pane_shapes');
		const ths = Array.from(host.querySelectorAll('thead th')).map((t) => (t.textContent || '').trim());
		const rows = Array.from(host.querySelectorAll('tbody tr')).map((tr) => {
			const o = {};
			Array.from(tr.children).forEach((td) => {
				if (!td._lpnPaneKey) { return; }
				const i = td.querySelector('input');
				o[td._lpnPaneKey] = i ? (i.type === 'checkbox' ? (i.checked ? '1' : '0') : i.value) : (td.textContent || '').trim();
			});
			return o;
		}).filter((o) => o.id);
		return { ths, rows };
	});
	// A cell's centre, by row ID and column key.
	const cellAt = (id, key) => P.evaluate(([i, k]) => {
		const td = Array.from(document.querySelectorAll('#lpn_pane_shapes tbody td')).find((t) => t._lpnPaneId === i && t._lpnPaneKey === k);
		if (!td) { return null; }
		td.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		const r = td.getBoundingClientRect();
		return { x: r.left + Math.min(12, r.width / 2), y: r.top + r.height / 2 };
	}, [id, key]);
	const clickCell = async (id, key, mods) => {
		const p = await cellAt(id, key);
		if (!p) { throw new Error('no cell ' + id + '/' + key); }
		if (mods) { await P.keyboard.down(mods); }
		await P.mouse.click(p.x, p.y);
		if (mods) { await P.keyboard.up(mods); }
		await settle(150);
	};
	return { P, settle, stored, shapes, setClip, getClip, showTable, table, cellAt, clickCell };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const h = helpers(a), P = h.P;

		console.log('\n--- 1. the Shape icon: an almost-closed polygon, no vertex markers ---');
		{
			await a.newProject('us');
			await a.dismissGallery();
			await h.settle(500);
			const label = await a.lang('lpn_tool_add_shape');
			const ic = await P.evaluate((l) => {
				const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).find((x) => (x.getAttribute('aria-label') || '').trim() === l);
				const svg = b && b.querySelector('svg');
				if (!svg) { return null; }
				const kids = Array.from(svg.children);
				return { tags: kids.map((k) => k.tagName.toLowerCase()), d: kids.map((k) => k.getAttribute('d') || '').join(' | '), visible: b.getBoundingClientRect().width > 0 };
			}, label);
			const vert = await P.evaluate(() => {
				const u = document.querySelector('#lpn_toolbar button[data-icon="vertices"] svg, #lpn_toolbar svg[data-icon="vertices"]');
				return u ? u.innerHTML : null;
			});
			ok('the toolbar has a Shape button with an icon', !!ic && ic.visible, JSON.stringify(ic));
			ok('...drawn as one path and nothing else (no grips, no rectangles)', !!ic && ic.tags.length === 1 && ic.tags[0] === 'path', ic && ic.tags.join());
			const pts = ic ? (ic.d.match(/-?\d+(\.\d+)?/g) || []).map(Number) : [];
			// M x y L x y L x y L x y H x L x y: six points, five legs.
			const legs = ic ? (ic.d.match(/[LHV]/g) || []).length : 0;
			ok('...five legs, an open pentagon', legs === 5, ic && ic.d);
			const first = pts.slice(0, 2), last = pts.slice(-2), gap = Math.hypot(first[0] - last[0], first[1] - last[1]);
			ok('...not closed: a gap between the first point and the last', !/z/i.test(ic ? ic.d : 'z') && gap > 2 && gap < 8, 'gap ' + gap.toFixed(2));
			ok('...on the right side', first[0] > 17 && last[0] > 17, JSON.stringify([first, last]));
			ok('...and not the Vertices icon', !vert || vert.indexOf(ic.d) < 0);
			const shot = await P.locator('#lpn_toolbar').screenshot({ path: path.join(process.env.EC_SHOT_DIR || '/tmp', 'shape-toolbar.png') }).catch(() => null);
			ok('the toolbar renders for a look (' + path.join(process.env.EC_SHOT_DIR || '/tmp', 'shape-toolbar.png') + ')', !!shot);
		}

		console.log('\n--- 2. pasting Shapes into the empty table ---');
		await h.showTable();
		const t0 = await h.table();
		const L = { id: await a.lang('lpn_field_id'), pts: await a.lang('lpn_pane_shape_points'), closed: await a.lang('lpn_pane_shape_closed') };
		ok('the Shapes tab is empty', t0.rows.length === 0);
		// A pair in a grid project's order, X first, as the Points heading states (checked below).
		const pair = (x, y) => x + '/' + y;
		const ptsCell = (list) => list.map((q) => pair(q[0], q[1])).join('|');
		const A1 = [['512345.6700', '3456789.1234'], ['512400.5', '3456789.1234'], ['512400.5', '3456850'], ['512345.6700', '3456850']];
		const B2 = [['512300.12345678', '3456700.98765'], ['512500.000001', '3456900.50']];
		const P3 = [['512350.25', '3456750.75']];
		const tsv = (rows) => rows.map((r) => r.join('\t')).join('\n');
		const rowsIn = [['A1', 'Pond', '0', ptsCell(A1)], ['B2', '', '0', ptsCell(B2)], ['P3', 'Valve box', '0', ptsCell(P3)]];
		{
			// Ctrl+Shift+V on an empty table: every line is a new row.
			await h.setClip(tsv(rowsIn));
			await P.click('#lpn_pane_shapes');
			await P.evaluate(() => { const n = document.querySelector('#lpn_pane_shapes [tabindex], #lpn_pane_shapes .lpn-pane-empty, #lpn_pane_shapes'); if (n && n.focus) { n.focus(); } });
			await P.keyboard.press('Control+Shift+V');
			await h.settle(600);
			let S = await h.shapes();
			if (S.length === 0) {
				// The empty table's note takes a plain Ctrl+V as new rows.
				await P.keyboard.press('Control+V');
				await h.settle(600);
				S = await h.shapes();
			}
			ok('three Shapes are created', S.length === 3, JSON.stringify(S.map((s) => [s.id, s.pts.length, s.closed])) + ' / ' + await a.notice());
			const by = {}; S.forEach((s) => { by[s.id] = s; });
			ok('...under the pasted IDs, with the pasted point counts', !!by.A1 && by.A1.pts.length === 4 && !!by.B2 && by.B2.pts.length === 2 && !!by.P3 && by.P3.pts.length === 1);
			ok('...and the pasted descriptions', !!by.A1 && by.A1.desc === 'Pond' && !!by.P3 && by.P3.desc === 'Valve box' && !!by.B2 && !by.B2.desc);
			const t1 = await h.table();
			ok('the table has ID, Description, Closed and Points columns', t1.ths.length >= 4 &&
				t1.ths[0].indexOf(L.id) === 0 && t1.ths.some((t) => t.indexOf(L.pts + ' (X/Y|X/Y|') === 0) &&
				t1.ths.some((t) => t.indexOf(L.closed) === 0), JSON.stringify(t1.ths));
			ok('the table lists them', t1.rows.map((r) => r.id).sort().join() === 'A1,B2,P3', JSON.stringify(t1.rows.map((r) => r.id)));
			ok('the map draws them: a polyline of four, a polyline of two, and an x', await P.evaluate(() =>
				!!document.querySelector('#lpn_canvas .lpn-shape[data-shape="A1"] polyline') &&
				!!document.querySelector('#lpn_canvas .lpn-shape[data-shape="B2"] polyline') &&
				!!document.querySelector('#lpn_canvas .lpn-shape[data-shape="P3"] .lpn-shape-x')));
			await P.keyboard.press('Escape');
			await P.mouse.click(5, 5).catch(() => {});
			await P.keyboard.press('Control+z'); await h.settle(500);
			ok('one Undo takes all three back', (await h.shapes()).length === 0);
			await P.keyboard.press('Control+y'); await h.settle(500);
			ok('...and Redo brings all three again', (await h.shapes()).length === 3);
		}

		console.log('\n--- 3. Ctrl+C copies every coordinate exactly ---');
		let copied = '';
		{
			await h.showTable();
			const first = (await h.table()).rows[0].id, lastRow = (await h.table()).rows.slice(-1)[0].id;
			await h.clickCell(first, 'id');
			await h.clickCell(lastRow, 'verts', 'Shift');
			await h.setClip('');
			await P.keyboard.press('Control+C'); await h.settle(300);
			copied = await h.getClip();
			const lines = copied.split(/\r?\n/).filter((l) => l);
			const got = {}; lines.forEach((l) => { const c = l.split('\t'); got[c[0]] = c; });
			ok('the clipboard holds the three rows', !!got.A1 && !!got.B2 && !!got.P3, JSON.stringify(copied.slice(0, 300)));
			ok('A1\'s Points come out exactly as pasted (512345.6700 keeps its zeros)', !!got.A1 && got.A1[3] === ptsCell(A1), got.A1 && got.A1[3]);
			ok('B2\'s eight decimals and 3456900.50 come out exactly', !!got.B2 && got.B2[3] === ptsCell(B2), got.B2 && got.B2[3]);
			ok('P3, one point, comes out as one pair', !!got.P3 && got.P3[3] === ptsCell(P3), got.P3 && got.P3[3]);
			ok('the Closed column copies as 0', !!got.A1 && got.A1[2] === '0', got.A1 && got.A1[2]);
		}

		console.log('\n--- 4. a paste over the rows updates them; a paste of new rows adds ---');
		{
			const before = await h.shapes();
			const A1b = A1.map((q) => q.slice()); A1b[2] = ['512410.0000', '3456860.0001'];
			const upd = [['A1', 'Pond edge', '1', ptsCell(A1b)], ['B2', '', '0', ptsCell(B2)], ['P3', 'Valve box 2', '0', ptsCell(P3)]];
			const ids = (await h.table()).rows.map((r) => r.id);
			const order = ids.map((id) => upd.find((u) => u[0] === id));
			await h.setClip(tsv(order));
			await h.clickCell(ids[0], 'id');
			await P.keyboard.press('Control+V'); await h.settle(600);
			const S = await h.shapes(), by = {}; S.forEach((s) => { by[s.id] = s; });
			ok('still three Shapes', S.length === 3, JSON.stringify(S.map((s) => s.id)) + ' / ' + await a.notice());
			ok('A1 is a closed polygon now, with its moved point', !!by.A1 && by.A1.closed === true && by.A1.pts.length === 4, JSON.stringify(by.A1 && [by.A1.closed, by.A1.pts.length]));
			ok('...and the map draws it as a polygon', await P.evaluate(() => !!document.querySelector('#lpn_canvas .lpn-shape[data-shape="A1"] polygon')));
			ok('A1 and P3 carry their new descriptions', by.A1 && by.A1.desc === 'Pond edge' && by.P3 && by.P3.desc === 'Valve box 2');
			const t4 = await h.table(), rA = t4.rows.find((r) => r.id === 'A1');
			ok('the table shows A1\'s moved point exactly as pasted', !!rA && rA.verts === ptsCell(A1b), rA && rA.verts);
			await P.keyboard.press('Control+z'); await h.settle(500);
			const back = await h.shapes(), bb = {}; back.forEach((s) => { bb[s.id] = s; });
			ok('one Undo puts every row back', JSON.stringify(before.map((s) => [s.id, s.desc, s.closed, s.pts])) === JSON.stringify(back.map((s) => [s.id, s.desc, s.closed, s.pts])));
			await P.keyboard.press('Control+y'); await h.settle(500);

			// New rows: Ctrl+Shift+V on a cell adds them at the bottom, and touches nothing above.
			const mid = await h.shapes();
			await h.setClip(tsv([['C4', 'Lot line', '0', ptsCell([['512000', '3456000'], ['512100', '3456000'], ['512100', '3456100']])]]));
			await h.clickCell('A1', 'desc');
			await P.keyboard.press('Control+Shift+V'); await h.settle(600);
			const S4 = await h.shapes();
			ok('Ctrl+Shift+V adds C4', S4.length === 4 && S4.some((s) => s.id === 'C4' && s.pts.length === 3), JSON.stringify(S4.map((s) => s.id)) + ' / ' + await a.notice());
			ok('...and leaves the others exactly as they were', mid.every((s) => JSON.stringify(s) === JSON.stringify(S4.find((x) => x.id === s.id))));
			await P.keyboard.press('Control+z'); await h.settle(500);
			ok('one Undo takes C4 away', (await h.shapes()).length === 3);
		}

		console.log('\n--- 5. a bad Points cell refuses the whole paste ---');
		{
			const before = JSON.stringify(await h.shapes());
			await h.setClip(tsv([['D5', '', '0', ptsCell([['512000', '3456000']])], ['E6', '', '0', 'abc/def']]));
			await h.clickCell('A1', 'id');
			await P.keyboard.press('Control+Shift+V'); await h.settle(600);
			const note = await a.notice();
			ok('no Shape was made', JSON.stringify(await h.shapes()) === before, note);
			ok('...and the notice names row 2', /2/.test(note), note);
			await h.setClip(tsv([['F7', 'no points', '0', '']]));
			await h.clickCell('A1', 'id');
			await P.keyboard.press('Control+Shift+V'); await h.settle(600);
			const note2 = await a.notice();
			ok('a new row with no Points is refused, in its own words', note2.indexOf((await a.lang('lpn_pane_paste_shape_no_points')).replace('{row}', '1')) >= 0, note2);
		}
		ok('no uncaught page errors on the grid project', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		console.log('\n--- 6. a geographic project: latitude and longitude, character for character ---');
		{
			await a.newGeoProject('us');
			await a.dismissGallery();
			await h.settle(600);
			await h.showTable();
			const G = [['-111.9400000', '33.4500000'], ['-111.93', '33.451230'], ['-111.9312345678', '33.4512']];
			const cell = G.map((q) => q[1] + '/' + q[0]).join('|');
			await h.setClip(tsv([['G1', 'Parcel', '1', cell]]));
			await P.click('#lpn_pane_shapes');
			await P.keyboard.press('Control+Shift+V'); await h.settle(600);
			let S = await h.shapes();
			if (!S.length) { await P.keyboard.press('Control+V'); await h.settle(600); S = await h.shapes(); }
			const ths6 = (await h.table()).ths;
			ok('the Points heading reads latitude first', ths6.some((t) => /\(Lat\/Lon\|/.test(t)), JSON.stringify(ths6));
			ok('one closed Shape of three points', S.length === 1 && S[0].closed === true && S[0].pts.length === 3, JSON.stringify(S) + ' / ' + await a.notice());
			ok('...stored in longitude and latitude', S.length === 1 && Math.abs(S[0].pts[0].x + 111.94) < 1e-9 && Math.abs(S[0].pts[0].y - 33.45) < 1e-9, JSON.stringify(S[0] && S[0].pts[0]));
			await h.clickCell('G1', 'verts');
			await h.setClip('');
			await P.keyboard.press('Control+C'); await h.settle(300);
			const c = (await h.getClip()).trim();
			ok('Ctrl+C gives back the Points cell exactly as pasted', c === cell, c);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

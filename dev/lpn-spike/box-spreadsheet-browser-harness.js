// THE BOXES AS A SPREADSHEET, IN A REAL BROWSER (ROADMAP Task 828; Tom, 2026-10-26: "Make it look like a
// spreadsheet, as in EPANET and WaterGEMS"). At 1366 x 768 (and 390 x 844 for the phone), English:
//   - Properties and Find and replace carry a header row of two cells, Label and Value;
//   - a row has no third (unit) cell; a unit stands in its label, in <bdi> ("Diameter (in)");
//   - Auto length is its own row above Length, its toggle in the value column;
//   - the Label column is fitted, narrower than the widest label (a long label wraps);
//   - the divider in the header is dragged, changes the column, is remembered per box in `lpn_gcols`,
//     and is still there after a reload; a double-click on it resets it;
//   - the "Edit types..." and "Edit fittings..." options at the end of the pipe type and fittings list
//     open the Libraries box on that section and put the pull-down back to what it held;
//   - nothing is cut at the right edge, on a PC or on a phone; a phone has no header and no divider.
//
//   node dev/lpn-spike/box-spreadsheet-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHEET_LOCKED';
const NAME = 'box-spreadsheet-browser-harness';
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
const { openBox, dockHidden } = require('./dock-boxes.js');
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
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	async function start(phone) {
		const a = await Session.open(browser, NAME + (phone ? '-phone' : ''), { serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1366, height: 768 });
		await a.settle(2500);
		return a;
	}
	async function openPipe(a) {
		const p = await a.page.evaluate(() => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [data-link="10"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await a.page.mouse.click(p.x, p.y);
		await a.settle(900);
	}
	// Does a pull-down show its selected text whole? (the text's width against the room inside the control)
	const selectShowsText = (page, sel) => page.evaluate((q) => {
		const e = document.querySelector(q);
		if (!e) { return { missing: true }; }
		const cs = getComputedStyle(e), c = document.createElement('canvas').getContext('2d');
		c.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
		const text = e.options[e.selectedIndex].textContent, need = c.measureText(text).width + 22, have = e.getBoundingClientRect().width;
		return { text, need: Math.round(need), have: Math.round(have), ok: need <= have };
	}, sel);
	const headerW = (page, root) => page.evaluate((sel) => {
		// No heading row any more (the standard sheet style): the Label column is the width of its first visible cell.
		const h = Array.from(document.querySelectorAll(sel + ' .lpn-gname')).filter((n) => n.getBoundingClientRect().width > 0)[0];
		return h ? Math.round(h.getBoundingClientRect().width) : null;
	}, root);
	async function drag(page, root, dx) {
		const b = await page.evaluate((sel) => { const s = document.querySelector(sel + ' .lpn-gsplit'); const r = s.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, root);
		await page.mouse.move(b.x, b.y);
		await page.mouse.down();
		await page.mouse.move(b.x + dx / 2, b.y, { steps: 4 });
		await page.mouse.move(b.x + dx, b.y, { steps: 4 });
		await page.mouse.up();
	}
	const stored = (page) => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lpn_gcols') || '{}'); } catch (e) { return {}; } });
	try {
		console.log('\n--- Properties on a PC ---');
		const a = await start(false);
		const page = a.page;
		await openPipe(a);
		const m = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), body = f.parentNode, R = (e) => e.getBoundingClientRect();
			const hdr = body.querySelector('.lpn-ghdr'), cells = hdr ? Array.from(hdr.querySelectorAll('.lpn-ghcell')).map((c) => c.textContent.trim()) : [];
			const rows = Array.from(f.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname'));
			const rowOf = (txt) => rows.filter((r) => r.querySelector('.lpn-gname').textContent.replace(/\s+/g, ' ').trim().indexOf(txt) === 0)[0];
			const dia = rowOf('Diameter'), len = rowOf('Length'), auto = rowOf('Auto length');
			const names = Array.from(body.querySelectorAll('.lpn-gname')).filter((e) => R(e).width > 0);
			const nat = names.map((n) => { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect().width; }).sort((x, y) => x - y);
			const labelCol = R(names[0]).width;
			const controls = Array.from(body.querySelectorAll('input, select, textarea')).filter((e) => R(e).width > 0 && !e.closest('table'));
			const bodyR = R(body);
			return {
				cells, cols: getComputedStyle(body).gridTemplateColumns.split(' ').length, third: rows.filter((r) => r.querySelector('.lpn-gunit')).length,
				diaName: dia ? dia.querySelector('.lpn-gname').textContent.replace(/\s+/g, ' ').trim() : null, diaBdi: dia ? dia.querySelectorAll('.lpn-gname bdi').length : 0,
				lenName: len ? len.querySelector('.lpn-gname').textContent.replace(/\s+/g, ' ').trim() : null,
				autoAbove: !!auto && !!len && R(auto).bottom <= R(len).top + 1, autoBox: auto ? auto.querySelector('input[type=checkbox]') : null,
				autoInValueCol: !!auto && !!dia && Math.abs(R(auto.querySelector('input[type=checkbox]')).left - R(dia.querySelector('.lpn-gval')).left) <= 8,
				labelCol, widest: nat.length ? nat[nat.length - 1] : 0, median: nat.length ? nat[Math.floor(nat.length / 2)] : 0,
				cut: controls.filter((e) => R(e).right > bodyR.right + 1).length, scroll: body.scrollWidth - body.clientWidth
			};
		});
		ok('Properties has no heading over its Label and Value cells (Tom, 2026-10-27: none, as WaterGEMS)', m.cells.length === 0, JSON.stringify(m.cells));
		ok('Properties has no third (unit) cell in any row', m.third === 0, String(m.third));
		ok('a unit stands in its label: "Diameter (in)", the unit in <bdi>', m.diaName === 'Diameter (in)' && m.diaBdi === 1, JSON.stringify({ n: m.diaName, bdi: m.diaBdi }));
		ok('Length carries its unit and has no Auto toggle beside it', /^Length \(ft\)\s*\??$/.test(m.lenName || ''), m.lenName);
		ok('Auto length is its own row above Length', m.autoAbove, '');
		ok('...with its toggle in the value column', m.autoInValueCol, '');
		ok('the Label column is fitted: no wider than the widest label or the 140 px floor (LPN_GFIT_FLOOR), wider than the median', m.labelCol <= Math.max(m.widest, 140) + 14.5 && m.labelCol > m.median, JSON.stringify({ col: m.labelCol, widest: Math.round(m.widest), median: Math.round(m.median) }));
		ok('nothing is cut at the right edge', m.cut === 0 && m.scroll <= 1, JSON.stringify({ cut: m.cut, scroll: m.scroll }));

		const glue = await page.evaluate(() => {
			const out = { names: 0, strayed: [], broken: [] };
			Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-gname')).filter((n) => n.getBoundingClientRect().width > 0).forEach((n) => {
				const tip = n.querySelector('.ec-tip'), t = n.textContent.replace(/\s+/g, ' ').trim();
				out.names++;
				if (tip) {
					const r = document.createRange(); r.selectNodeContents(n);
					const rects = Array.from(r.getClientRects()).filter((x) => x.width > 0), last = Math.max.apply(null, rects.map((x) => x.top)), g = tip.getBoundingClientRect();
					if (Math.abs(g.top - last) > 6) { out.strayed.push(t); }
				}
				n.querySelectorAll('bdi').forEach((b) => { if (Array.from(b.getClientRects()).filter((x) => x.width > 0).length > 1) { out.broken.push(b.textContent); } });
			});
			return out;
		});
		ok('a "?" stays with its label\'s last line and a unit never breaks inside its brackets', glue.strayed.length === 0 && glue.broken.length === 0 && glue.names > 10, JSON.stringify(glue));

		// The divider: drag, remembered per box, kept across a reload, reset by a double-click.
		console.log('\n--- the divider ---');
		const w0 = await headerW(page, '#lpn_popup .lpn-popover-body');
		await drag(page, '#lpn_popup .lpn-popover-body', -40);
		await a.settle(300);
		const w1 = await headerW(page, '#lpn_popup .lpn-popover-body');
		ok('dragging the divider left narrows the Label column', w1 !== null && w1 < w0 - 20, w0 + ' -> ' + w1);
		const s1 = await stored(page);
		ok('...and it is remembered for the Properties box in lpn_gcols', typeof s1.lpn_popup === 'number', JSON.stringify(s1));
		const rowsMoved = await page.evaluate(() => { const n = document.querySelector('#lpn_popup_fields .lpn-grow .lpn-gname'), v = document.querySelector('#lpn_popup_fields .lpn-grow .lpn-gval'); return Math.round(v.getBoundingClientRect().left - n.getBoundingClientRect().left); });
		ok('...and the rows follow it', Math.abs(rowsMoved - (w1 - 0)) <= 14, String(rowsMoved));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		await openPipe(a);
		const w2 = await headerW(page, '#lpn_popup .lpn-popover-body');
		ok('after a reload the Label column is as it was dragged', w2 !== null && Math.abs(w2 - w1) <= 3, w1 + ' vs ' + w2);
		// Find and replace has its own header and its own remembered width.
		await openBox(a, 'lpn_find_popup');
		await a.settle(700);
		const f0 = await headerW(page, '#lpn_find_form');
		ok('Find and replace has no heading row, and has the divider', await page.evaluate(() => !document.querySelector('#lpn_find_form .lpn-ghdr') && !!document.querySelector('#lpn_find_form .lpn-gsplit')));
		await drag(page, '#lpn_find_form', -12);
		await a.settle(300);
		const f1 = await headerW(page, '#lpn_find_form');
		ok('Find: dragging the divider left narrows the Label column', f1 < f0 - 6, f0 + ' -> ' + f1);
		const s2 = await stored(page);
		ok('...remembered per box: Properties and Find each have a width', typeof s2.lpn_popup === 'number' && typeof s2.lpn_find_form === 'number', JSON.stringify(s2));
		await page.evaluate(() => { const s = document.querySelector('#lpn_find_form .lpn-gsplit'); s.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); });
		await a.settle(400);
		const s3 = await stored(page);
		ok('a double-click on the divider forgets the Find width and keeps the Properties one', s3.lpn_find_form === undefined && typeof s3.lpn_popup === 'number', JSON.stringify(s3));
		await page.evaluate(() => { const b = document.querySelector('#lpn_find_popup .lpn-popover-x, #lpn_find_popup [id$="_close"]'); if (b) { b.click(); } });
		await a.settle(300);

		// The Edit types / Edit fittings options.
		console.log('\n--- Edit types and Edit fittings ---');
		await openPipe(a);
		const links = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-pane-goto')).map((b) => b.textContent.trim()));
		ok('the "Pipe types" and "Fittings" links are gone from Properties', links.length === 0, JSON.stringify(links));
		for (const [label, section, what] of [['Edit types…', 'pipetypes', 'pipe type'], ['Edit fittings…', 'fittings', 'fittings list']]) {
			const before = await page.evaluate((lab) => {
				const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => Array.from(x.options).some((o) => o.textContent === lab))[0];
				if (!s) { return null; }
				return { value: s.value, last: s.options[s.options.length - 1].textContent };
			}, label);
			ok('the ' + what + ' pull-down ends with "' + label + '"', !!before && before.last === label, JSON.stringify(before));
			if (!before) { continue; }
			await page.evaluate((lab) => {
				const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => Array.from(x.options).some((o) => o.textContent === lab))[0];
				s.value = Array.from(s.options).filter((o) => o.textContent === lab)[0].value;
				s.dispatchEvent(new Event('change', { bubbles: true }));
			}, label);
			await a.settle(700);
			const after = await page.evaluate(([lab, sec]) => {
				const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => Array.from(x.options).some((o) => o.textContent === lab))[0];
				const lib = document.getElementById('lpn_library_box'), cur = document.getElementById('lpn_libbox_link_' + sec);
				return { value: s ? s.value : null, libOpen: !!lib && getComputedStyle(lib).display !== 'none', section: !!cur && cur.getAttribute('aria-current') === 'true' };
			}, [label, section]);
			ok('choosing "' + label + '" opens the Libraries box on ' + section, after.libOpen && after.section, JSON.stringify(after));
			ok('...and the ' + what + ' pull-down is back to what it held', after.value === before.value, JSON.stringify({ before: before.value, after: after.value }));
			await page.evaluate(() => { const b = document.querySelector('#lpn_library_box .lpn-popover-x, #lpn_library_box [id$="_close"]'); if (b) { b.click(); } });
			await a.settle(300);
		}
		// Libraries docked on the left and auto-hidden: the option flies it out, visibly (Perry saw it stay unseen).
		console.log('\n--- Edit types with Libraries docked left and auto-hidden ---');
		await dockHidden(a, 'lpn_library_box', 'left');
		await openPipe(a);
		for (const [label, section] of [['Edit types…', 'pipetypes'], ['Edit fittings…', 'fittings']]) {
			await page.evaluate((lab) => {
				const s = Array.from(document.querySelectorAll('#lpn_popup_fields select')).filter((x) => Array.from(x.options).some((o) => o.textContent === lab))[0];
				s.value = Array.from(s.options).filter((o) => o.textContent === lab)[0].value;
				s.dispatchEvent(new Event('change', { bubbles: true }));
			}, label);
			await a.settle(900);
			const v = await page.evaluate((sec) => {
				const b = document.getElementById('lpn_library_box'), r = b.getBoundingClientRect(), cs = getComputedStyle(b);
				const at = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 120));
				return { w: Math.round(r.width), h: Math.round(r.height), onScreen: r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight,
					shown: cs.display !== 'none' && cs.visibility !== 'hidden', top: !!at && b.contains(at), section: document.getElementById('lpn_libbox_link_' + sec).getAttribute('aria-current') === 'true' };
			}, section);
			ok('"' + label + '" flies the docked, auto-hidden Libraries box out: on screen, non-zero size, nothing over it, on ' + section,
				v.w > 100 && v.h > 100 && v.onScreen && v.shown && v.top && v.section, JSON.stringify(v));
		}
		await a.close();

		console.log('\n--- the divider keeps the Value column ---');
		const d = await start(false);
		await openPipe(d);
		await drag(d.page, '#lpn_popup .lpn-popover-body', 900);
		await d.settle(300);
		// Properties cells are borderless and fill the value track (box-rows-properties), so an input's right edge now meets the
		// box edge exactly; clipped means past it, not touching it.
		const cap = await d.page.evaluate(() => {
			const body = document.querySelector('#lpn_popup .lpn-popover-body'), R = (e) => e.getBoundingClientRect(), rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			const ins = Array.from(body.querySelectorAll('#lpn_popup_fields input, #lpn_popup_fields select')).filter((e) => R(e).width > 0 && !e.closest('table'));
			const lab = R(Array.from(body.querySelectorAll('.lpn-gname')).filter((n) => R(n).width > 0)[0]), edge = R(body).right;
			return { valueRem: (edge - lab.right) / rem, clipped: ins.filter((e) => R(e).right > edge + 1 || e.scrollWidth > e.clientWidth + 1 && e.tagName === 'SELECT').length, scroll: body.scrollWidth - body.clientWidth };
		});
		ok('dragging the divider far right leaves the Value column the few characters the box itself can be sized to (3 rem; Tom, 2026-10-29), no input clipped', cap.valueRem >= 2.9 && cap.clipped === 0 && cap.scroll <= 8, JSON.stringify(cap));   // a few pixels of spill is what a 3 rem Value column costs
		await d.close();

		console.log('\n--- on a Text there is no heading; labels keep their ? and units whole ---');
		const t = await start(false);
		const txy = await t.page.evaluate(() => { const e = document.querySelector('#lpn_canvas [data-lbl]'); if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		if (txy) {
			await t.page.mouse.click(txy.x, txy.y); await t.settle(900);
			const th = await t.page.evaluate(() => {
				const h = document.querySelector('#lpn_popup .lpn-ghdr'), ta = document.querySelector('#lpn_popup_fields textarea'), R = (e) => e.getBoundingClientRect();
				const first = document.querySelectorAll('#lpn_popup_fields .lpn-grow:not(.lpn-fill-row)')[1];   // Active stands above the words, then the other rows (row order, 2026-10-29)
				return ta && first ? { noHeader: !h, belowWords: R(first).top >= R(ta).bottom - 1 } : null;
			});
			ok('on a Text there is no heading, and the rows stand below the words box', !!th && th.noHeader && th.belowWords, JSON.stringify(th));
		}
		await t.close();

		console.log('\n--- one run, one header; Convert as is on the grid ---');
		const c = await start(false);
		await c.menuClick(await c.lang('lpn_file_convert_as'), 'file').catch(() => {});
		await c.page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 }).catch(() => {});
		await c.settle(700);
		const cv = await c.page.evaluate(() => {
			const b = document.getElementById('lpn_convas_body');
			if (!b) { return null; }
			const runs = Array.from(b.querySelectorAll('.lpn-grid')), R = (e) => e.getBoundingClientRect();
			const rows = (g) => Array.from(g.children).filter((k) => k.classList.contains('lpn-grow')).length;
			return { grid: b.classList.contains('lpn-gridhost'), runs: runs.map((g) => ({ rows: rows(g), hdr: !!g.previousElementSibling && g.previousElementSibling.classList.contains('lpn-ghdr') })),
				unitRows: b.querySelectorAll('#lpn_convas_units_fields .lpn-grow').length, scroll: b.scrollWidth - b.clientWidth };
		});
		ok('Convert as is a box of Label | Value rows: the coordinate system and the units', !!cv && cv.grid && cv.unitRows >= 8, JSON.stringify(cv));
		ok('...a run of two or more rows has a header and a run of one has none', !!cv && cv.runs.every((g) => g.hdr === (g.rows >= 2)), JSON.stringify(cv && cv.runs));
		ok('...and it does not scroll sideways', !!cv && cv.scroll <= 1, String(cv && cv.scroll));
		const cv2 = await c.page.evaluate(() => {
			const b = document.getElementById('lpn_convas_body'), ok = document.getElementById('lpn_convas_ok'), R = (e) => e.getBoundingClientRect(), vh = window.innerHeight;
			return { top: b.scrollTop, okInBody: b.contains(ok), okVisible: R(ok).top >= 0 && R(ok).bottom <= vh, cancelVisible: R(document.getElementById('lpn_convas_cancel')).bottom <= vh,
				firstVisible: R(document.querySelector('#lpn_convas_body .lpn-grow')).top >= R(b).top - 1 };
		});
		ok('Convert as opens at the top, with the georeference choices in view', cv2.top === 0 && cv2.firstVisible, JSON.stringify(cv2));
		ok('...and OK and Cancel are in a footer outside the scrolling body, always in view', !cv2.okInBody && cv2.okVisible && cv2.cancelVisible, JSON.stringify(cv2));
		const rd = await selectShowsText(c.page, '#lpn_convas_round_diameter');
		ok('"No rounding" is whole in its dropdown', rd.ok, JSON.stringify(rd));
		await c.close();
		const f = await start(false);
		await openBox(f, 'lpn_full_box');
		await f.settle(800);
		ok('Full report has one row and no header', await f.page.evaluate(() => document.querySelectorAll('#lpn_full_box .lpn-ghdr').length === 0));
		await openBox(f, 'lpn_calib_box');
		await f.settle(800);
		ok('Calibration has one row and no header', await f.page.evaluate(() => document.querySelectorAll('#lpn_calib_box .lpn-ghdr').length === 0));
		await f.close();

		console.log('\n--- Properties on a phone ---');
		const p = await start(true);
		await openPipe(p);
		const ph = await p.page.evaluate(() => {
			const box = document.getElementById('lpn_popup'), body = box.querySelector('.lpn-popover-body'), R = (e) => e.getBoundingClientRect();
			const hdr = body.querySelector('.lpn-ghdr'), edge = R(box).right;
			const controls = Array.from(body.querySelectorAll('input, select, textarea')).filter((e) => R(e).width > 0);
			const row = Array.from(body.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((r) => r.querySelector('input[type=number]'))[0];
			return {
				hdr: hdr ? getComputedStyle(hdr).display : 'none', scroll: body.scrollWidth - body.clientWidth,
				cut: controls.filter((e) => R(e).right > edge - 1).length,
				above: R(row.querySelector('.lpn-gval')).left >= R(row.querySelector('.lpn-gname')).right - 2
			};
		});
		ok('on a phone the header row is not shown', ph.hdr === 'none', ph.hdr);
		ok('on a phone each label stands beside its value (the PC two columns)', ph.above);
		await p.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await p.settle(300);
		const jp = await p.page.evaluate(() => { const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="11"]')).filter((e) => e.getBoundingClientRect().width > 0)[0]; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await p.page.mouse.click(jp.x, jp.y);
		await p.settle(900);
		// sheet-light: the pattern is a row of its own in Properties (the table is in the Demand categories box).
		await p.page.evaluate(() => { const r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((x) => x.querySelector('.lpn-gname') && /^Demand pattern/.test(x.querySelector('.lpn-gname').textContent.trim()))[0]; if (r) { r.querySelector('select').setAttribute('data-dp', '1'); } });
		const dp = await selectShowsText(p.page, '#lpn_popup_fields select[data-dp]');
		ok('on a phone the demand pattern dropdown shows its text whole', !dp.missing && dp.ok, JSON.stringify(dp));
		ok('on a phone nothing is cut at the right edge', ph.cut === 0 && ph.scroll <= 1, JSON.stringify({ cut: ph.cut, scroll: ph.scroll }));
		await p.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

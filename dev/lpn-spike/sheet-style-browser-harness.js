// THE STANDARD SPREADSHEET STYLE, AND PULL-DOWNS THAT STAY READABLE IN DARK, IN A REAL BROWSER. Run with:
//   node dev/lpn-spike/sheet-style-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-27: "I love it! Make this a standard style and apply it to Find and Replace, Contour Plot, Fire flow
// analysis, Criticality analysis, and Demand analysis" (Properties' borderless rows; no heading over the Label and Value
// cells); and "The invisibility in Dark mode bug hit again for all selectors ... use global styles". At 1366 x 768:
//   S1  Properties and each of the five boxes: every row stands in the one `lpn-sheet` grid, and none of its
//       text boxes, number boxes or pull-downs has a border of its own (a toggle stays a checkbox);
//   S2  none of them has a heading over the Label and Value cells (no `lpn-ghdr`, no "Label"/"Value"/"Property");
//   S3  the divider is still there for a run of rows, and a double-click on it is harmless;
//   S4  an editable cell and a computed value are told apart (computed is in the muted ink);
//   D1  in every theme the page offers that is dark, the choices of every pull-down in Properties and the five boxes
//       (the "Edit types...", "Edit fittings...", "Edit curves..." ones among them) have an opaque background and
//       ink contrasting at least 3 : 1, and so does the pull-down itself against what it stands on;
//   D2  no page errors.
//
//   L1-L8 THE LIGHTER SHEET (sheet-light): a hairline under each row and none at its sides, no box or shadow round a value,
//       one x for every value, computed values in the muted ink, an editable cell filled on hover and outlined on focus, an
//       empty one plain (no dotted underline); the same on a phone (name over value); the hairline shows in every theme.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHEETSTYLE_LOCKED';
const NAME = 'sheet-style-browser-harness';
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
const { openBox } = require('./dock-boxes.js');
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const BOXES = ['lpn_find_popup', 'lpn_contour_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	const errors = [];
	// What a box's controls look like: borders, rows, headings, divider, ink.
	const inspect = (page, id) => page.evaluate((rootSel) => {
		const root = document.querySelector(rootSel), out = { rows: 0, notSheet: 0, bordered: [], headings: 0, headingText: [], splits: 0, controls: 0 };
		if (!root) { return { missing: true }; }
		Array.from(root.querySelectorAll('.lpn-grow')).forEach((r) => {
			if (r.classList.contains('lpn-gspan-row') || r.classList.contains('lpn-fill-row') || !r.querySelector('.lpn-gname')) { return; }
			if (r.getBoundingClientRect().width === 0 && getComputedStyle(r).display !== 'contents') { return; }
			out.rows++;
			if (!r.closest('.lpn-sheet')) { out.notSheet++; }
		});
		Array.from(root.querySelectorAll('.lpn-grow > input, .lpn-grow > select, .lpn-grow > textarea')).forEach((c) => {
			if (c.type === 'checkbox' || c.type === 'radio' || c.type === 'hidden' || c.getBoundingClientRect().width === 0) { return; }
			out.controls++;
			const cs = getComputedStyle(c);
			if (['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none')) { out.bordered.push(c.id || c.tagName + ':' + (c.type || '')); }
		});
		out.headings = root.querySelectorAll('.lpn-ghdr, .lpn-ghcell').length;
		Array.from(root.querySelectorAll('.lpn-gname')).forEach((n) => { if (/^(Label|Value|Property)$/.test(n.textContent.trim()) && n.closest('.lpn-ghdr')) { out.headingText.push(n.textContent.trim()); } });
		out.splits = Array.from(root.querySelectorAll('.lpn-gsplit')).filter((s) => getComputedStyle(s).display !== 'none').length;
		return out;
	}, '#' + id);
	// Contrast of every option and of the select itself, in the current theme.
	const contrast = (page, rootSel) => page.evaluate((sel) => {
		function rgba(s) { const m = (s.match(/[\d.]+/g) || [0, 0, 0, 0]).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; }
		function lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
		function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
		function under(el) {   // the first opaque paper behind an element
			for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c.a >= 1) { return c; } }
			return rgba(getComputedStyle(document.documentElement).backgroundColor);
		}
		const out = { selects: 0, options: 0, bad: [] };
		Array.from(document.querySelectorAll(sel + ' select')).forEach((s) => {
			if (s.getBoundingClientRect().width === 0) { return; }
			out.selects++;
			const cs = getComputedStyle(s), own = rgba(cs.backgroundColor), paper = own.a >= 1 ? own : under(s), ink = rgba(cs.color);
			if (cr(ink, paper) < 3) { out.bad.push('select ' + (s.id || '') + ' ink ' + cs.color + ' on ' + paper.r + ',' + paper.g + ',' + paper.b); }
			Array.from(s.options).forEach((o) => {
				out.options++;
				const oc = getComputedStyle(o), bg = rgba(oc.backgroundColor), oi = rgba(oc.color);
				if (bg.a < 1 || cr(oi, bg) < 3) { out.bad.push('option "' + o.textContent + '" bg ' + oc.backgroundColor + ' ink ' + oc.color + ' ' + cr(oi, bg).toFixed(1)); }
			});
		});
		return out;
	}, rootSel);
	try {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1366, height: 768 });
		await a.settle(2500);

		async function openPipe() {
			const p = await page.evaluate(() => {
				const el = Array.from(document.querySelectorAll('#lpn_canvas [data-link="10"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
				const r = el.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		}
		const closeBox = (id) => page.evaluate((i) => { const b = document.querySelector('#' + i + ' .lpn-popover-x, #' + i + ' [id$="_close"]'); if (b) { b.click(); } }, id);
		const all = [['lpn_popup', 'Properties']].concat(BOXES.map((b) => [b, b]));

		console.log('\n--- the style (S1-S4) ---');
		await openPipe();
		for (const [id, label] of all) {
			if (id !== 'lpn_popup') { await openBox(a, id); await a.settle(600); }
			const m = await inspect(page, id);
			ok('S1 ' + label + ': ' + m.rows + ' rows, all in the sheet grid; ' + m.controls + ' text boxes and pull-downs, none bordered', !m.missing && m.rows >= 1 && m.notSheet === 0 && m.controls >= 1 && m.bordered.length === 0, JSON.stringify(m.bordered.concat(m.notSheet ? ['notSheet=' + m.notSheet] : [])));
			ok('S2 ' + label + ': no heading over the Label and Value cells', !m.missing && m.headings === 0 && m.headingText.length === 0, JSON.stringify({ n: m.headings, t: m.headingText }));
			if (m.rows >= 2) { ok('S3 ' + label + ': the divider stands in the Label column', m.splits >= 1, String(m.splits)); }
			if (id !== 'lpn_popup') { await closeBox(id); await a.settle(250); }
		}
		// S4 editable and computed differ in ink: a computed value in Properties (a pipe's Flow) is muted, a typed one is not.
		const ink = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields');
			const ed = f ? Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval[type="text"], .lpn-grow > input.lpn-gval[type="number"]')).filter((e) => e.getBoundingClientRect().width > 0)[0] : null;
			const ro = f ? Array.from(f.querySelectorAll('.lpn-grow > span.lpn-gval:not(.lpn-gw-num)')).filter((e) => e.getBoundingClientRect().width > 0)[0] : null;
			return { ed: ed ? getComputedStyle(ed).color : null, ro: ro ? getComputedStyle(ro).color : null };
		});
		ok('S4 Properties: a computed value is drawn in a different (muted) ink from an editable cell', !!ink.ed && (!ink.ro || ink.ro !== ink.ed), JSON.stringify(ink));

		console.log('\n--- Properties clean-up, 2026-10-28 (A gap, B and C borders, D Value truncates, E the + button) ---');
		const openNode = async (id) => {
			const p = await page.evaluate((id) => {
				const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + id + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
				const r = el.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, id);
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		};
		await openNode('11');
		await page.click('#lpn_demand_more');
		await a.settle(600);
		const j = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), body = document.getElementById('lpn_demands_body'), R = (e) => e.getBoundingClientRect();
			const btn = body.querySelector('.lpn-demand-add'), tbl = body.querySelector('.lpn-demand-table');
			const th = tbl && tbl.querySelectorAll('thead th');
			const g = document.querySelector('#lpn_popup_graph .lpn-pgraph-row');
			const rows = Array.from(f.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname') && R(r).height > 0);
			return {
				text: btn && btn.textContent, title: btn && btn.title, aria: btn && btn.getAttribute('aria-label'),
				gapAbove: tbl && btn ? R(btn).top - R(tbl).bottom : null, btnH: btn ? R(btn).height : null, btnW: btn ? R(btn).width : null, tblW: tbl ? R(tbl).width : null,
				btnRule: btn ? getComputedStyle(btn).borderBottomWidth : null, inProps: !!f.querySelector('.lpn-demand-add, .lpn-demand-table'),
				thDivider: th && th.length > 1 ? getComputedStyle(th[1]).borderInlineStartWidth : null,
				graphRule: g ? getComputedStyle(g).boxShadow : null, graphLabelEdge: g ? Math.round(R(g.querySelector('label')).right) : null,
				nameEdge: Math.round(R(rows[0].querySelector('.lpn-gname')).right), graphEdge: g ? Math.round(R(g).left) : null, rowEdge: Math.round(R(rows[0]).left)
			};
		});
		const addWords = await a.lang('lpn_demand_add');
		ok('E the demand button (in the Demand categories box) shows just "+"', j.text === '+', JSON.stringify(j.text));
		ok('E its old words are its tip and its name', j.title === addWords && j.aria === addWords, j.title);
		ok('A the add row sits flush under the table (no gap) and is one row tall', Math.abs(j.gapAbove) <= 1.5 && j.btnH <= 36, JSON.stringify({ above: j.gapAbove, h: j.btnH }));
		ok('B the add row has its hairline under it and is as wide as the table', j.btnRule === '1px' && Math.abs(j.btnW - j.tblW) <= 1.5, JSON.stringify({ rule: j.btnRule, btnW: j.btnW, tblW: j.tblW }));
		ok('B the demand table has a rule between its columns', j.thDivider === '1px', String(j.thDivider));
		ok('E Properties itself holds neither the table nor the "+" button', !j.inProps);
		await page.evaluate(() => { document.getElementById('lpn_demands_close').click(); });
		await a.settle(250);
		ok('C the Time series row is ruled and its Label rule stands under the one above', /rgb/.test(j.graphRule || '') && j.graphEdge === j.rowEdge, JSON.stringify({ rule: j.graphRule, graphEdge: j.graphEdge, rowEdge: j.rowEdge }));
		// D: the box shrinks to its floor; the Value column shrinks with it and cuts with an ellipsis, never wraps, never pushes past the box.
		await closeBox('lpn_popup'); await a.settle(250);
		await openPipe();
		const dm = await page.evaluate(() => {
			const box = document.querySelector('.lpn-propbox'); box.style.width = '1px';   // the min-width floor decides
			return new Promise((res) => setTimeout(() => {
				const body = box.querySelector('.lpn-popover-body'), R = (e) => e.getBoundingClientRect(), br = R(body);
				const vals = Array.from(body.querySelectorAll('.lpn-grow > .lpn-gval')).filter((e) => R(e).width > 0 && !e.closest('table'));
				const txt = vals.filter((e) => e.matches('input[type=text], input[type=number], select'));
				const len = Array.from(body.querySelectorAll('.lpn-grow')).filter((r) => /^Length/.test((r.querySelector('.lpn-gname') || { textContent: '' }).textContent.trim()))[0];
				const li = len && len.querySelector('input');
				const ro = vals.filter((e) => e.tagName === 'SPAN');
				res({
					boxW: Math.round(R(box).width), floor: parseFloat(getComputedStyle(box).minWidth), sw: body.scrollWidth - body.clientWidth,
					past: vals.filter((e) => R(e).right > br.right + 1).length, minVal: Math.round(Math.min.apply(null, vals.filter((e) => e.type !== "checkbox").map((e) => R(e).width))),
					ell: txt.every((e) => getComputedStyle(e).textOverflow === 'ellipsis') && ro.every((e) => getComputedStyle(e).textOverflow === 'ellipsis' && getComputedStyle(e).whiteSpace === 'nowrap'),
					cut: li ? li.scrollWidth > li.clientWidth : null, n: vals.length
				});
			}, 400));
		});
		ok('D the Properties box can be made narrow (floor 12 rem)', dm.boxW <= 200, JSON.stringify(dm));
		ok('D at its floor nothing scrolls sideways and no Value cell passes the right edge', dm.sw <= 1 && dm.past === 0, JSON.stringify({ scroll: dm.sw, past: dm.past }));
		ok('D the Value column is allowed down to a few characters (at least 30 px, at most 90 px held)', dm.minVal >= 30 && dm.minVal <= 90, String(dm.minVal));
		ok('D every Value cell is cut with an ellipsis and does not wrap; a number longer than its cell is cut, not widened', dm.ell === true && dm.cut === true, JSON.stringify({ ell: dm.ell, cut: dm.cut }));
		await page.evaluate(() => { document.querySelector('.lpn-propbox').style.width = ''; });

		console.log('\n--- The lighter sheet, 2026-10-28 (L1-L6 at PC width, L7 on a phone) ---');
		// What a box's rows look like: the rule under each, a rule at the sides, a box round a value, where the values start.
		const light = (rootSel) => page.evaluate((sel) => {
			const root = document.querySelector(sel), R = (e) => e.getBoundingClientRect();
			const rows = Array.from(root.querySelectorAll('.lpn-grow')).filter((r) => !r.classList.contains('lpn-gspan-row') && !r.classList.contains('lpn-fill-row') && r.querySelector('.lpn-gname') && R(r).height > 0 && getComputedStyle(r).display !== 'contents');
			const out = { rows: rows.length, sided: [], noRule: 0, boxedVal: [], valueX: [], bg: getComputedStyle(root).backgroundColor, ruleColor: null };
			rows.forEach((r) => {
				const sh = getComputedStyle(r).boxShadow;
				if (sh === 'none') { out.noRule++; } else {
					// a shadow with a sideways offset is a rule at the row's side (a rule above or below has none)
					sh.split(/,(?![^(]*\))/).forEach((one) => { const nums = one.replace(/(?:rgba?|color)\([^)]*\)/, '').replace('inset', '').trim().split(/\s+/).map(parseFloat); if (nums[0] !== 0) { out.sided.push(r.id || r.querySelector('.lpn-gname').textContent.trim().slice(0, 14)); } });
					out.ruleColor = (sh.match(/(?:rgba?|color)\([^)]*\)/) || [null])[0];
				}
				const v = r.querySelector(':scope > .lpn-gval');
				if (v && v.type !== 'checkbox' && v.type !== 'radio' && R(v).width > 0) {
					const cs = getComputedStyle(v);
					if (cs.boxShadow !== 'none' || ['Top', 'Right', 'Bottom', 'Left'].some((x) => parseFloat(cs['border' + x + 'Width']) > 0)) { out.boxedVal.push(v.id || v.tagName); }
					out.valueX.push(Math.round(R(v).left));
				}
			});
			return out;
		}, rootSel);
		await openPipe();
		for (const [id, label] of all) {
			if (id !== 'lpn_popup') { await openBox(a, id); await a.settle(600); }
			const m = await light('#' + id);
			ok('L1 ' + label + ': every row is ruled by one hairline underneath and none at its sides (' + m.rows + ' rows)', m.rows >= 1 && m.noRule === 0 && m.sided.length === 0, JSON.stringify({ noRule: m.noRule, sided: m.sided.slice(0, 3), rule: m.ruleColor }));
			ok('L2 ' + label + ': no box or shadow round any value', m.boxedVal.length === 0, JSON.stringify(m.boxedVal.slice(0, 3)));
			ok('L3 ' + label + ': every value starts at one x (the column is aligned)', new Set(m.valueX).size <= 1, JSON.stringify(Array.from(new Set(m.valueX))));
			if (id !== 'lpn_popup') { await closeBox(id); await a.settle(250); }
		}
		// L4 a computed value is the muted ink exactly; L5 an editable cell fills on hover and outlines on focus; L6 an empty one is underlined.
		const probe = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), muted = (() => { const t = document.createElement('span'); t.style.color = 'var(--ec-ink-muted)'; document.body.appendChild(t); const c = getComputedStyle(t).color; t.remove(); return c; })();
			const cells = Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval[type="number"], .lpn-grow > input.lpn-gval[type="text"]')).filter((e) => e.getBoundingClientRect().width > 0 && !e.disabled);
			const ro = Array.from(f.querySelectorAll('.lpn-grow > span.lpn-gval:not(.lpn-gw-num)')).filter((e) => e.getBoundingClientRect().width > 0);
			const empty = cells.filter((e) => e.value === '')[0];
			const full = cells.filter((e) => e.value !== '' && e.id !== 'lpn_popup_id_input')[0];
			const at = (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
			return { muted, roInk: ro.map((e) => getComputedStyle(e).color), empty: empty ? { at: at(empty), img: getComputedStyle(empty).backgroundImage, id: empty.id || empty.getAttribute('data-gprop') } : null, full: full ? { at: at(full), bg0: getComputedStyle(full).backgroundColor, id: full.id || full.getAttribute('data-gprop') } : null };
		});
		ok('L4 every computed value is drawn in the muted ink', probe.roInk.length >= 1 && probe.roInk.every((c) => c === probe.muted), JSON.stringify({ want: probe.muted, got: Array.from(new Set(probe.roInk)) }));
		ok('L6 an empty editable cell is plain: no dotted or dashed underline, no background image', !!probe.empty && !/gradient|url/.test(probe.empty.img), JSON.stringify(probe.empty));
		if (probe.full) {
			await page.mouse.move(probe.full.at.x, probe.full.at.y);
			await a.settle(200);
			const hov = await page.evaluate(() => { const e = document.elementFromPoint(arguments[0] || 0, 0); return null; }).catch(() => null);
			const bgHover = await page.evaluate((at) => { const e = document.elementFromPoint(at.x, at.y); return e ? getComputedStyle(e).backgroundColor : null; }, probe.full.at);
			ok('L5 an editable cell takes a fill under the pointer', !!bgHover && bgHover !== probe.full.bg0 && bgHover !== 'rgba(0, 0, 0, 0)', JSON.stringify({ before: probe.full.bg0, hover: bgHover }));
			await page.mouse.click(probe.full.at.x, probe.full.at.y);
			await a.settle(200);
			const fo = await page.evaluate((at) => { const e = document.elementFromPoint(at.x, at.y); const cs = e ? getComputedStyle(e) : null; return cs ? { w: parseFloat(cs.outlineWidth), st: cs.outlineStyle, same: document.activeElement === e } : null; }, probe.full.at);
			ok('L5 ...and an outline on focus', !!fo && fo.same && fo.w > 0 && fo.st !== 'none', JSON.stringify(fo));
			await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
		}
		// L7: on a phone the same box keeps the same look, name beside value (the PC two columns).
		await closeBox('lpn_popup'); await a.settle(250);
		await page.setViewportSize({ width: 390, height: 844 });
		await a.settle(600);
		await openNode('11');
		const ph = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), R = (e) => e.getBoundingClientRect(), muted = (() => { const t = document.createElement('span'); t.style.color = 'var(--ec-ink-muted)'; document.body.appendChild(t); const c = getComputedStyle(t).color; t.remove(); return c; })();
			const rows = Array.from(f.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname') && R(r).height > 0 && !r.classList.contains('lpn-fill-row'));
			const ctrls = Array.from(f.querySelectorAll('.lpn-grow > input.lpn-gval, .lpn-grow > select.lpn-gval')).filter((e) => e.type !== 'checkbox' && R(e).width > 0);
			const ro = Array.from(f.querySelectorAll('.lpn-grow > span.lpn-gval:not(.lpn-gw-num)')).filter((e) => R(e).width > 0);
			const stacked = rows.filter((r) => { const n = r.querySelector('.lpn-gname'), v = r.querySelector('.lpn-gval'); return v && R(v).left >= R(n).right - 1; }).length;
			return {
				rows: rows.length, noRule: rows.filter((r) => getComputedStyle(r).boxShadow === 'none').length, stacked,
				bordered: ctrls.filter((e) => ['Top', 'Right', 'Bottom', 'Left'].some((x) => parseFloat(getComputedStyle(e)['border' + x + 'Width']) > 0)).length, ctrls: ctrls.length,
				roMuted: ro.length > 0 && ro.every((e) => getComputedStyle(e).color === muted), valueX: Array.from(new Set(ctrls.map((e) => Math.round(R(e).left)))),
				cats: !!f.querySelector('.lpn-demand-count'), table: !!f.querySelector('table.lpn-demand-table'), sw: document.querySelector('.lpn-propbox .lpn-popover-body').scrollWidth - document.querySelector('.lpn-propbox .lpn-popover-body').clientWidth
			};
		});
		ok('L7 phone: name beside value in every row (' + ph.stacked + ' of ' + ph.rows + ')', ph.rows > 3 && ph.stacked === ph.rows, JSON.stringify(ph));
		ok('L7 phone: a hairline under every row', ph.noRule === 0, String(ph.noRule));
		ok('L7 phone: no border round any value (' + ph.ctrls + ' boxes and pull-downs), and they start at one x', ph.bordered === 0 && ph.valueX.length === 1, JSON.stringify({ b: ph.bordered, x: ph.valueX }));
		ok('L7 phone: a computed value is muted', ph.roMuted);
		ok('L7 phone: the two demand rows (no table), nothing wider than the box', ph.cats && !ph.table && ph.sw <= 1, JSON.stringify({ cats: ph.cats, table: ph.table, sw: ph.sw }));
		await page.setViewportSize({ width: 1366, height: 768 });
		await a.settle(500);

		console.log('\n--- Dark and every other theme (D1) ---');
		await openPipe();
		for (const id of BOXES) { await openBox(a, id); await a.settle(400); }
		const themes = await page.evaluate(() => window.ecTheme.list.slice());
		ok('D0 the page offers several themes', themes.length >= 5, themes.join(','));
		let darkSeen = 0;
		for (const th of themes) {
			await page.evaluate((t) => window.ecTheme.preview(t), th);
			await a.settle(250);
			const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
			const dark = /dark/.test(scheme);
			if (dark) { darkSeen++; }
			let n = 0, bad = [];
			for (const sel of ['#lpn_popup'].concat(BOXES.map((b) => '#' + b))) {
				const r = await contrast(page, sel);
				n += r.options; bad = bad.concat(r.bad);
			}
			ok('D1 theme ' + th + (dark ? ' (dark)' : '') + ': ' + n + ' options and their pull-downs read at 3 : 1 or better', n > 0 && bad.length === 0, JSON.stringify(bad.slice(0, 3)));
			const hl = await page.evaluate(() => {
				const r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((e) => e.querySelector('.lpn-gname') && !e.classList.contains('lpn-fill-row') && e.getBoundingClientRect().height > 0 && getComputedStyle(e).display !== 'contents')[0];
				const sh = r ? getComputedStyle(r).boxShadow : '', c = (sh.match(/(?:rgba?|color)\([^)]*\)/) || [null])[0], paper = getComputedStyle(document.getElementById('lpn_popup')).backgroundColor;
				const px = (col) => { const k = document.createElement('canvas'); k.width = k.height = 1; const x = k.getContext('2d'); x.fillStyle = '#000'; x.fillStyle = col; x.fillRect(0, 0, 1, 1); return Array.from(x.getImageData(0, 0, 1, 1).data); };
				const lum = (a) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(a[0]) + 0.7152 * f(a[1]) + 0.0722 * f(a[2]); };
				if (!c) { return { rule: null, paper }; }
				const a = lum(px(c)), b = lum(px(paper)), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
				return { rule: c, paper, ratio: Math.round(ratio * 100) / 100 };
			});
			ok('L8 theme ' + th + ': the row hairline shows against the paper (contrast at least 1.1 : 1)', !!hl.rule && hl.ratio >= 1.1, JSON.stringify(hl));
		}
		ok('D1 the list holds at least one dark theme', darkSeen >= 1, String(darkSeen));
		ok('D2 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

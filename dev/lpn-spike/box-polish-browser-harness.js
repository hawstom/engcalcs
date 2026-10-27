// THE SETTINGS BOX ON A PHONE, THE OVERRIDE GUTTER, AND THE SPREADSHEET CELL, IN A REAL BROWSER
// (ROADMAP Tasks 835 and 837; Ida's design, dev/agents/interface-designer/settings-phone-and-cells-2026-10-27.md).
//   Phone 390 x 844, touch, Settings open:
//     - no side index: the content pane is >= 360 px wide and does not scroll sideways;
//     - a jump bar, 44-48 px tall, names the current heading; the index is hidden until the bar is tapped;
//     - tapping the bar opens the index over the content (no more than 60% of the box); choosing a row
//       scrolls that heading to the top, closes the list and puts the heading's name on the bar;
//     - scrolling the content by hand changes the bar to the heading now at the top;
//     - Escape closes an open list first and the box on the next press;
//     - the Labels group's headings do not break a word.
//   PC 1400 x 900: no bar, the side index and its divider as before, no sideways scroll.
//   Gutter (Max day on Net1 with scenarios): one cell, 1.1em = 17.6 px; two cells, 2.05em, on EVERY row once a
//     row carries both marks; no empty filler cell is drawn; Properties follows the same rule.
//   Labels grid: the 0.000, Show and Drop columns and boxes are 2.2rem (35.2 px) and show no spinner.
//   Properties cell (PC): the input is the cell (no border or margin, transparent, fills the Value track,
//     starts at the same x as a computed value, 28 px rows, an inset accent outline when focused); a toggle
//     is a checkbox that one click and the Space key both toggle.
//
//   node dev/lpn-spike/box-polish-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BOXPOLISH_LOCKED';
const NAME = 'box-polish-browser-harness';
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
const near = (a, b, t) => Math.abs(a - b) <= (t === undefined ? 1 : t);

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });

	// Net1 with scenarios; `both` gives the child scenario a value of its own for the demand multiplier, so
	// the row has Max day's dot AND the main-break scenario's triangle.
	async function open(opts) {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1-Scenarios.lwn'), 'utf8'));
		d.project.activeScenario = opts.scn || 'base';
		if (opts.both) { d.scenarios.filter((s) => s.id === 's2')[0].demandMultiplier = 3; }
		const phone = !!opts.phone;
		const a = await Session.open(browser, NAME, { viewport: phone ? { width: 390, height: 844 } : { width: 1400, height: 900 },
			hasTouch: phone, isMobile: phone, serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2000);
		return a;
	}
	async function openSettings(a) {
		await a.menuClick('Settings', 'project');
		await a.settle(800);
	}
	const R = (sel) => (`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom, vis: !!(e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden' }; })()`);

	// ---- the phone ------------------------------------------------------------------------------
	console.log('\n--- 1. Settings on a phone: the jump bar (390 x 844, touch) ---');
	{
		const a = await open({ phone: true, scn: 's1' });
		const page = a.page;
		try {
			await openSettings(a);
			const m = await page.evaluate(`(() => {
				const c = document.getElementById('lpn_setbox_content'), idx = document.getElementById('lpn_setbox_index'), j = document.getElementById('lpn_setbox_jump');
				const cur = idx.querySelector('[aria-current="true"]');
				return { cw: c.getBoundingClientRect().width, sw: c.scrollWidth, cl: c.clientWidth, idx: idx.getClientRects().length, jh: j.getBoundingClientRect().height,
					jvis: !!j.getClientRects().length, jt: j.textContent, cur: cur ? cur.textContent : null, exp: j.getAttribute('aria-expanded'),
					div: !!document.getElementById('lpn_setbox_divider').getClientRects().length };
			})()`);
			console.log('  measured: content ' + Math.round(m.cw) + ' px wide, bar ' + Math.round(m.jh) + ' px tall, bar says "' + m.jt + '"');
			ok('phone: the content pane is at least 360 px wide', m.cw >= 360, String(Math.round(m.cw)));
			ok('phone: and does not scroll sideways', m.sw <= m.cl, m.sw + ' / ' + m.cl);
			ok('phone: the side index is not shown until the bar is tapped', m.idx === 0 && !m.div);
			ok('phone: the bar is shown, 44 to 48 px tall', m.jvis && m.jh >= 44 && m.jh <= 48, String(m.jh));
			ok('phone: the bar names the current heading (the index row marked current)', !!m.jt && m.jt === m.cur, '"' + m.jt + '"');
			ok('phone: the bar starts closed', m.exp === 'false');

			// the Labels group's headings
			await page.evaluate(`(() => { const e = document.getElementById('lpn_labels_node_fields'); if (e) { e.scrollIntoView(); } })()`);
			await a.settle(300);
			const hd = await page.evaluate(`(() => {
				const g = document.querySelector('#lpn_labels_node_fields > .lpn-set-colhead .lpn-lblgroup');
				if (!g) { return null; }
				return { w: g.getBoundingClientRect().width, cells: Array.from(g.children).filter((c) => c.textContent.trim()).map((c) => ({ t: c.textContent.trim(), h: c.getBoundingClientRect().height, sw: c.scrollWidth, cw: c.clientWidth })) };
			})()`);
			ok('phone: the Labels headings exist', !!hd);
			if (hd) {
				console.log('  measured: Labels group ' + Math.round(hd.w) + ' px; headings ' + hd.cells.map((c) => c.t + ' ' + Math.round(c.h) + 'px').join(', '));
				ok('phone: the Labels group fits on its row, 226 to 250 px', hd.w >= 220 && hd.w <= 250, String(Math.round(hd.w)));
				ok('phone: no Labels heading but "Use units" is taller than one line, and that one two (it was 4 lines, "Us/e/unit/s")', hd.cells.every((c) => c.t === 'Use units' ? c.h <= 44 : c.h <= 24), hd.cells.map((c) => c.t + ':' + Math.round(c.h)).join(' '));
			}
			await page.evaluate(`document.getElementById('lpn_setbox_content').scrollTop = 0`);
			await a.settle(300);

			// open the list
			await page.tap('#lpn_setbox_jump');
			await a.settle(300);
			const o = await page.evaluate(`(() => {
				const idx = document.getElementById('lpn_setbox_index'), b = document.getElementById('lpn_settings_box'), c = document.getElementById('lpn_setbox_content');
				const ir = idx.getBoundingClientRect(), cr = c.getBoundingClientRect(), br = b.getBoundingClientRect();
				return { vis: idx.getClientRects().length > 0, ih: ir.height, bh: br.height, over: ir.top < cr.bottom && ir.bottom > cr.top, exp: document.getElementById('lpn_setbox_jump').getAttribute('aria-expanded'),
					n: idx.children.length, il: ir.left, ir: ir.right, cl: cr.left, crr: cr.right };
			})()`);
			ok('phone: tapping the bar opens the index', o.vis && o.exp === 'true' && o.n > 10, 'rows ' + o.n);
			ok('phone: the list lies over the content, no taller than 60% of the box', o.over && o.ih <= 0.6 * o.bh + 1, Math.round(o.ih) + ' of ' + Math.round(o.bh));
			ok('phone: the list is as wide as the content', near(o.il, o.cl, 2) && near(o.ir, o.crr, 2), Math.round(o.il) + '-' + Math.round(o.ir) + ' vs ' + Math.round(o.cl) + '-' + Math.round(o.crr));

			// choose a sub-heading row part way down
			const pick = await page.evaluate(`(() => {
				const subs = Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link-sub'));
				const b = subs[Math.floor(subs.length * 0.6)];
				return { t: b.textContent, id: b.getAttribute('data-sub') };
			})()`);
			await page.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')).filter((b) => b.textContent === t)[0].scrollIntoView({ block: 'center' }); }, pick.t);
			await a.settle(200);
			await page.tap('#lpn_setbox_index [data-sub="' + pick.id + '"]');
			await a.settle(500);
			const ch = await page.evaluate((id) => {
				const c = document.getElementById('lpn_setbox_content'), t = document.getElementById(id), head = c.querySelector('.lpn-set-head');
				const idx = document.getElementById('lpn_setbox_index');
				return { top: t.getBoundingClientRect().top - c.getBoundingClientRect().top, head: head.getBoundingClientRect().height,
					closed: idx.getClientRects().length === 0, jt: document.getElementById('lpn_setbox_jump').textContent,
					exp: document.getElementById('lpn_setbox_jump').getAttribute('aria-expanded') };
			}, pick.id);
			ok('phone: choosing "' + pick.t + '" scrolls it to the top, under the sticky heading', ch.top >= -1 && ch.top <= ch.head + 8, Math.round(ch.top) + ' (head ' + Math.round(ch.head) + ')');
			ok('phone: ...and closes the list', ch.closed && ch.exp === 'false');
			ok('phone: ...and the bar says so', ch.jt === pick.t, '"' + ch.jt + '"');

			// scroll by hand to the last section
			const last = await page.evaluate(`(() => { const s = Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link-sec')); const b = s[s.length - 1]; return { t: b.textContent, id: b.getAttribute('data-sec') }; })()`);
			await page.evaluate((id) => { const c = document.getElementById('lpn_setbox_content'), s = document.getElementById(id); c.scrollTop += s.getBoundingClientRect().top - c.getBoundingClientRect().top + 2; }, last.id);
			await a.settle(500);
			const jt = await page.evaluate(`document.getElementById('lpn_setbox_jump').textContent`);
			ok('phone: scrolling by hand to "' + last.t + '" puts it on the bar', jt === last.t, '"' + jt + '"');
			await page.evaluate(`document.getElementById('lpn_setbox_content').scrollTop = 0`);
			await a.settle(500);
			const jt0 = await page.evaluate(`document.getElementById('lpn_setbox_jump').textContent`);
			const first = await page.evaluate(`document.querySelector('#lpn_setbox_index .lpn-setbox-link-sec').textContent`);
			ok('phone: and back at the top it names the first section', jt0 === first, '"' + jt0 + '"');

			// tap outside closes; Escape closes the list before the box
			await page.tap('#lpn_setbox_jump');
			await a.settle(200);
			await page.tap('#lpn_setbox_search, #lpn_setbox_filter');
			await a.settle(200);
			ok('phone: a tap outside the list closes it', await page.evaluate(`document.getElementById('lpn_setbox_index').getClientRects().length === 0`));
			await page.tap('#lpn_setbox_jump');
			await a.settle(200);
			const bb = await page.evaluate(`(() => { const r = document.getElementById('lpn_settings_box').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 60 }; })()`);
			await page.mouse.move(bb.x, bb.y);
			await page.focus('#lpn_setbox_jump');
			await page.keyboard.press('Escape');
			await a.settle(300);
			const e1 = await page.evaluate(`({ list: document.getElementById('lpn_setbox_index').getClientRects().length > 0, box: document.getElementById('lpn_settings_box').style.display })`);
			ok('phone: Escape closes the open list and leaves the box', !e1.list && e1.box === 'flex', JSON.stringify(e1));
			await page.keyboard.press('Escape');
			await a.settle(300);
			ok('phone: the next Escape closes the box', await page.evaluate(`document.getElementById('lpn_settings_box').style.display !== 'flex'`));
			ok('phone: no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		} finally { await a.close(); }
	}

	// ---- the PC ---------------------------------------------------------------------------------
	console.log('\n--- 2. Settings on a PC (1400 x 900) is unchanged, and the Labels grid ---');
	{
		const a = await open({ scn: 's1' });
		const page = a.page;
		try {
			await openSettings(a);
			const m = await page.evaluate(`(() => {
				const c = document.getElementById('lpn_setbox_content'), idx = document.getElementById('lpn_setbox_index');
				return { jump: document.getElementById('lpn_setbox_jump').getClientRects().length, iw: idx.getBoundingClientRect().width, div: document.getElementById('lpn_setbox_divider').getClientRects().length,
					sw: c.scrollWidth, cl: c.clientWidth, cw: c.getBoundingClientRect().width };
			})()`);
			console.log('  measured: index ' + m.iw.toFixed(1) + ' px, content ' + Math.round(m.cw) + ' px');
			ok('PC: no jump bar', m.jump === 0);
			ok('PC: the side index stands at 116 px, with its divider', near(m.iw, 116.2, 1) && m.div > 0, m.iw.toFixed(1));
			ok('PC: no sideways scroll', m.sw <= m.cl);
			await page.evaluate(`document.getElementById('lpn_labels_node_fields').scrollIntoView()`);
			await a.settle(300);
			const g = await page.evaluate(`(() => {
				const out = { head: [], inp: [], sp: [] };
				const hg = document.querySelector('#lpn_labels_node_fields > .lpn-set-colhead .lpn-lblgroup');
				const rows = Array.from(document.querySelectorAll('#lpn_labels_node_fields .lpn-lblgroup')).filter((x) => x.querySelector('input.lpn-digit'));
				const row = rows[0];
				out.head = Array.from(hg.children).map((c) => ({ t: c.textContent.trim(), w: c.getBoundingClientRect().width, h: c.getBoundingClientRect().height }));
				out.inp = Array.from(row.querySelectorAll('input.lpn-digit')).map((i) => ({ w: i.getBoundingClientRect().width, ap: getComputedStyle(i).appearance, mx: i.max }));
				out.group = row.getBoundingClientRect().width;
				return out;
			})()`);
			console.log('  measured: headings ' + g.head.map((c) => (c.t || '-') + ' ' + c.w.toFixed(1)).join(', ') + '; digit boxes ' + g.inp.map((i) => i.w.toFixed(1)).join(', '));
			const by = (t) => g.head.filter((c) => c.t === t)[0];
			ok('Labels: the Show and Drop headings and the 0.000 heading are 35.2 px', ['Show', 'Drop', '0.000'].every((t) => by(t) && near(by(t).w, 35.2, 0.6)), JSON.stringify(['Show', 'Drop', '0.000'].map((t) => by(t) && by(t).w)));
			ok('Labels: the two-digit boxes are 35.2 px and show no spinner', g.inp.length >= 2 && g.inp.every((i) => near(i.w, 35.2, 0.6) && i.ap === 'textfield'), g.inp.map((i) => i.w.toFixed(1) + '/' + i.ap).join(' '));
			ok('Labels: the group is 225 to 227 px wide (was 245)', near(g.group, 225.6, 1.5), g.group.toFixed(1));
			ok('Labels: no heading but "Use units" is taller than one line on a PC', g.head.every((c) => !c.t || c.t === 'Use units' || c.h <= 24), g.head.map((c) => c.t + ':' + Math.round(c.h)).join(' '));
			ok('PC: no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		} finally { await a.close(); }
	}

	// ---- the gutter -----------------------------------------------------------------------------
	async function gutter(opts) {
		const a = await open(opts);
		try {
			await openSettings(a);
			return await a.page.evaluate(`(() => {
				const box = document.getElementById('lpn_settings_box');
				const rows = Array.from(box.querySelectorAll('.lpn-set-row, [data-lpn-setting]')).filter((r) => r.getClientRects().length);
				const pads = Array.from(new Set(rows.map((r) => getComputedStyle(r).paddingInlineStart)));
				const marks = Array.from(box.querySelectorAll('.lpn-ovm'));
				const held = box.querySelector('.lpn-set-held');
				const dot = box.querySelector('.lpn-ovm-dot');
				const ctl = dot ? dot.closest('.lpn-ovm').parentNode.querySelector('input, select') : null;
				return { pads, gut2: box.classList.contains('lpn-ovm-gut2'), marks: marks.length, cells: marks.map((g) => g.children.length),
					none: box.querySelectorAll('.lpn-ovm-none').length, heldPad: held ? getComputedStyle(held).paddingInlineStart : null,
					ovmW: marks[0] ? marks[0].getBoundingClientRect().width : null, dotRight: dot ? dot.getBoundingClientRect().right : null, ctlLeft: ctl ? ctl.getBoundingClientRect().left : null,
					tri: box.querySelectorAll('.lpn-ovm-tri').length, dots: box.querySelectorAll('.lpn-ovm-dot').length };
			})()`);
		} finally { await a.close(); }
	}
	console.log('\n--- 3. The override gutter (Settings, Max day, 1400 x 900) ---');
	{
		const one = await gutter({ scn: 's1' });
		console.log('  measured: padding ' + one.pads.join(', ') + '; marker ' + (one.ovmW && one.ovmW.toFixed(1)) + ' px; cells ' + one.cells.join(','));
		ok('a held row is one cell of gutter, 17.6 px (was 30.4)', one.heldPad === '17.6px', String(one.heldPad));
		ok('every row of the box has that one padding, so every control keeps one x', one.pads.length === 1 && one.pads[0] === '17.6px', one.pads.join(' '));
		ok('the box is not in two-cell mode when no row carries both marks', !one.gut2 && one.tri === 0 && one.dots >= 1);
		ok('the marker is one 15.2 px cell and no empty filler is drawn', one.marks >= 1 && one.cells.every((n) => n === 1) && one.none === 0 && near(one.ovmW, 15.2, 0.5), one.cells.join(','));
		const two = await gutter({ scn: 's1', both: true });
		console.log('  measured, both marks on one row: padding ' + two.pads.join(', ') + '; cells ' + two.cells.join(','));
		ok('a row with both marks widens the gutter to 2.05em, 32.8 px, on EVERY row', two.gut2 && two.pads.length === 1 && two.pads[0] === '32.8px', two.pads.join(' '));
		ok('...and that row draws a dot and a triangle (two cells), no filler', two.tri === 1 && two.dots >= 1 && two.none === 0 && two.cells.indexOf(2) >= 0, 'tri ' + two.tri + ' dots ' + two.dots);
		const base = await gutter({ scn: 'base' });
		ok('Base keeps the one-cell gutter for triangles, and draws no filler', base.pads.length === 1 && base.pads[0] === '17.6px' && base.none === 0 && !base.gut2, base.pads.join(' '));
	}

	// ---- Properties -----------------------------------------------------------------------------
	async function openProps(a, attr, id) {
		const p = await a.page.evaluate(([g, i]) => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [' + g + '="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [attr, id]);
		if (!p) { return false; }
		await a.page.mouse.click(p.x, p.y);
		await a.settle(900);
		return true;
	}
	console.log('\n--- 4. Properties: the gutter, and the input is the cell (junction 11, pipe 10) ---');
	{
		const a = await open({ scn: 's1', both: true });
		const page = a.page;
		try {
			ok('Properties: junction 11 is on the map', await openProps(a, 'data-node', '11'));
			const m = await page.evaluate(`(() => {
				const f = document.getElementById('lpn_popup_fields'), body = f.parentNode;
				const rows = Array.from(f.children).filter((c) => c.nodeName === 'LABEL' && c.querySelector('.lpn-gname'));
				const gw = getComputedStyle(body).getPropertyValue('--lpn-g-gutw').trim();
				const gut = f.querySelector('.lpn-ggut');
				return { gw, gutW: gut ? gut.getBoundingClientRect().width : null, cls: body.className, f: f.className, none: f.querySelectorAll('.lpn-ovm-none').length };
			})()`);
			console.log('  measured: Properties gutter track ' + m.gw + ' = ' + (m.gutW && m.gutW.toFixed(1)) + ' px');
			ok('Properties: no empty filler cell is drawn', m.none === 0);
			ok('Properties: the gutter is one cell, 1.1em, unless a row needs both marks', /1\.1em|2\.05em/.test(m.gw) && ((m.gw === '2.05em') === /lpn-ovm-gut2/.test(m.cls)), m.gw + ' ' + m.cls);
		} finally { await a.close(); }
	}
	{
		const a = await open({});
		const page = a.page;
		try {
			ok('Properties: junction 11 is on the map (Base)', await openProps(a, 'data-node', '11'));
			const c = await page.evaluate(`(() => {
				const f = document.getElementById('lpn_popup_fields'), R = (e) => e.getBoundingClientRect();
				const rows = Array.from(f.children).filter((c) => c.nodeName === 'LABEL' && c.querySelector('.lpn-gname'));
				const ed = rows.map((r) => r.querySelector(':scope > input.lpn-gval:not([type=checkbox]):not([type=radio])')).filter(Boolean);
				const el = f.querySelector('input[data-gprop="elevation"]') || ed[0];
				const row = el.closest('.lpn-grow'), name = row.querySelector('.lpn-gname');
				const cs = getComputedStyle(el), er = R(el), rr = R(row), nr = R(name);
				const ro = rows.map((r) => r.querySelector(':scope > span.lpn-gval')).filter((s) => s && s.getClientRects().length)[0];
				const num = ed.filter((i) => i.type === 'number')[0];
				const res = { border: cs.borderTopWidth + ' ' + cs.borderLeftWidth, margin: cs.margin, bg: cs.backgroundColor, w: er.width, left: er.left, right: er.right, rowRight: rr.right, nameRight: nr.right,
					rowH: rr.height, pad: cs.paddingLeft, align: cs.textAlign, numAlign: num ? getComputedStyle(num).textAlign : null, n: ed.length,
					roLeft: ro ? R(ro).left + parseFloat(getComputedStyle(ro).paddingLeft) : null, inLeft: er.left + parseFloat(cs.paddingLeft),
					rowHs: rows.map((r) => Math.round(R(r).height)), dbg: rows.map((r) => { const n = r.querySelector('.lpn-gname'); return n.textContent.trim().slice(0, 18) + ' w' + Math.round(R(n).width) + ' h' + Math.round(R(r).height); }).join(' ; '), hscroll: document.querySelector('.lpn-propbox .lpn-popover-body').scrollWidth > document.querySelector('.lpn-propbox .lpn-popover-body').clientWidth + 1 };
				el.focus();
				const fs = getComputedStyle(el);
				res.outline = fs.outlineStyle + ' ' + fs.outlineWidth + ' off ' + fs.outlineOffset + ' ' + fs.outlineColor;
				return res;
			})()`);
			console.log('  heights ' + c.dbg);
			console.log('  measured: input ' + c.w.toFixed(1) + ' px, border ' + c.border + ', margin ' + c.margin + ', padding ' + c.pad + ', rows ' + c.rowHs.join(',') + ', focus ' + c.outline);
			ok('cell: no border and no margin, transparent', /^0px 0px$/.test(c.border) && c.margin === '0px' && /rgba\(0, 0, 0, 0\)|transparent/.test(c.bg), c.border + ' / ' + c.margin + ' / ' + c.bg);
			ok('cell: the input fills the Value track (its left edge is the label cell\'s right edge, its right edge the row\'s)', near(c.left, c.nameRight, 1.5) && near(c.right, c.rowRight, 1.5), c.left.toFixed(1) + '-' + c.right.toFixed(1) + ' vs ' + c.nameRight.toFixed(1) + '-' + c.rowRight.toFixed(1));
			ok('cell: padding 4px 6px, left-aligned, numbers included', c.pad === '6px' && c.align !== 'right' && c.numAlign !== 'right', c.pad + ' ' + c.align + ' ' + c.numAlign);
			ok('cell: an editable value and a computed value start at one x', c.roLeft === null || near(c.roLeft, c.inLeft, 1.5), c.roLeft + ' vs ' + c.inLeft);
			ok('cell: a one-line row is 28 px (was 34)', c.rowHs.filter((h) => h <= 30).length >= 3 && c.rowHs.filter((h) => h <= 30).every((h) => h >= 27), c.rowHs.join(','));
			ok('cell: focus draws the inset accent outline (2 px solid, offset -2px)', /^solid 2px off -2px/.test(c.outline), c.outline);
			ok('cell: no sideways scroll in the box', !c.hscroll);
			ok('Properties (Base): no empty filler cell', await page.evaluate(`document.querySelectorAll('#lpn_popup_fields .lpn-ovm-none').length === 0`));
		} finally { await a.close(); }
	}
	{
		const a = await open({});
		const page = a.page;
		try {
			ok('toggle: pipe 10 is on the map', await openProps(a, 'data-link', '10'));
			const t = await page.evaluate(`(() => {
				const f = document.getElementById('lpn_popup_fields');
				const cb = Array.from(f.querySelectorAll('input[type=checkbox].lpn-gval')).filter((c) => c.getClientRects().length)[0];
				if (!cb) { return null; }
				const r = cb.getBoundingClientRect(), row = cb.closest('.lpn-grow');
				cb.setAttribute('data-bp', '1');
				return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, was: cb.checked, rowH: row.getBoundingClientRect().height, left: r.left, nameRight: row.querySelector('.lpn-gname').getBoundingClientRect().right };
			})()`);
			ok('toggle: a Properties row holds a checkbox', !!t);
			if (t) {
				console.log('  measured: checkbox ' + t.w + ' x ' + t.h + ' px in a ' + Math.round(t.rowH) + ' px row, ' + (t.left - t.nameRight).toFixed(1) + ' px from its label cell');
				ok('toggle: it is an 18 px box in a 28 px row, at the start of the cell', near(t.w, 18, 0.5) && near(t.h, 18, 0.5) && t.rowH >= 27 && t.rowH <= 30 && t.left - t.nameRight <= 8, t.w + 'x' + t.h);
				let flips = 0;
				await page.evaluate(`(() => { const cb = document.querySelector('[data-bp]'); window.__flips = 0; cb.addEventListener('change', () => { window.__flips++; }); })()`);
				await page.mouse.click(t.x, t.y);
				await a.settle(500);
				let s = await page.evaluate(`(() => { const cb = Array.from(document.querySelectorAll('#lpn_popup_fields input[type=checkbox].lpn-gval')).filter((c) => c.getClientRects().length)[0]; return { now: cb.checked, flips: window.__flips }; })()`);
				ok('toggle: one click on the box toggles it once', s.now === !t.was && s.flips === 1, JSON.stringify(s));
				// the box may have been rebuilt by the edit; find it again
				const again = await page.evaluate(`(() => { const cb = Array.from(document.querySelectorAll('#lpn_popup_fields input[type=checkbox].lpn-gval')).filter((c) => c.getClientRects().length)[0]; cb.focus(); window.__flips2 = 0; cb.addEventListener('change', () => { window.__flips2++; }); return { checked: cb.checked, focus: document.activeElement === cb }; })()`);
				await page.keyboard.press('Space');
				await a.settle(500);
				s = await page.evaluate(`(() => { const cb = Array.from(document.querySelectorAll('#lpn_popup_fields input[type=checkbox].lpn-gval')).filter((c) => c.getClientRects().length)[0]; return { checked: cb.checked, flips: window.__flips2 }; })()`);
				ok('toggle: Space on the focused box toggles it', again.focus && s.checked === !again.checked, JSON.stringify([again, s]));
			}
			ok('toggle: no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		} finally { await a.close(); }
	}

	await browser.close();
	env.stopServer();
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

// THE PROPERTIES BOX ON THE STANDARD ROW GRID, IN A REAL BROWSER (ROADMAP Task 828; Ida's design,
// dev/agents/interface-designer/standard-box-rows-2026-10-24.md; Tom 2026-10-25: "Properties did not
// get any attention"). For every element type the box offers (a junction, a reservoir, a tank, a
// pipe, a pump, each of the six valves, a customer and a Text), each in Base and in a second
// scenario, at 1366 x 768, the whole box is audited by dev/lpn-spike/box-grid-audit.js:
//   - EVERY visible control, not only the rows, stands in the value column (+-2 px): the ID line, a
//     Text's words, the buttons, the Time series pull-down;
//   - every name at one x; no name ellipsised; no name wrapped; like number boxes one width;
//   - X, Y and Elevation are one width; Description and Tag are one width;
//   - nothing is left off the grid, the override marker sits in its gutter cell, the gutter is nothing
//     in Base with no marker, no name carries its unit in brackets, a pipe's number boxes are as wide
//     as their digits (Minor loss 5 < Diameter 6 < Roughness 7 < Length 8).
//   BOXROWS_SHOT=<dir> also writes a screenshot of each box there, as after-<type>.png.
//
//   node dev/lpn-spike/properties-rows-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PROPROWS_LOCKED';
const NAME = 'properties-rows-browser-harness';
const { auditBox, auditPhone } = require('./box-grid-audit.js');
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
const uniq = (xs) => Array.from(new Set(xs.map((x) => Math.round(x))));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	async function one(scn, file, name, attr, id, phone) {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', file), 'utf8'));
		if (scn) {
			d.scenarios.push({ id: 'f4', name: 'Fig 4', overrides: {} });
			d.project = Object.assign({}, d.project, { activeScenario: 'f4' });
			d.alternatives = [{ id: 'a4', category: 'physical', name: 'Fig 4', parent: null, values: {} }];
		}
		if (file === 'Net1.lwn') { d.customers = [{ id: 'M1', count: 1, link: '121', t: 0.4, x: 3, y: 0, demand: 2 }]; }
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1366, height: 768 });
		await a.settle(2500);
		const p = await page.evaluate(([g, i]) => {
			let el = Array.from(document.querySelectorAll(g === 'data-cust' ? '.lpn-meter' : '#lpn_canvas [' + g + '="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el && g === 'data-lbl') { el = document.querySelector('#lpn_canvas text[data-lbl="X2"]'); }
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [attr, id]);
		const tag = (scn ? 'scenario' : 'Base') + ' ' + name + ': ';
		ok(tag + 'the element is on the map', !!p);
		if (!p) { await a.close(); return; }
		await page.mouse.click(p.x, p.y);
		await a.settle(900);
		const m = await page.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields'), R = (e) => e.getBoundingClientRect();
			const rows = Array.from(f.children).filter((c) => c.nodeName === 'LABEL' && c.querySelector('.lpn-gname'));
			const off = Array.from(f.children).filter((c) => {
				const cs = getComputedStyle(c), k = c.className || '';
				return !(cs.display === 'contents' || cs.display === 'none' || (cs.display === 'grid' && /lpn-grow|lpn-ghdr/.test(k)) || /lpn-gspan/.test(k) || /lpn-ggut/.test(k));
			}).map((c) => c.nodeName + '.' + c.className);
			const first = (sel) => rows.map((r) => r.querySelector(sel)).filter(Boolean);
			const w = (prop) => { const i = f.querySelector('input[data-gprop="' + prop + '"]'); return i ? Math.round(R(i).width) : null; };
			const marks = Array.from(f.querySelectorAll('.lpn-ovm'));
			return {
				open: getComputedStyle(document.getElementById('lpn_popup')).display !== 'none', grid: getComputedStyle(f).display,
				rows: rows.length, names: first('.lpn-gname').map((e) => R(e).left), vals: first('.lpn-gval').map((e) => R(e).left).filter((x) => x > 0),
				off, scroll: f.scrollWidth - f.clientWidth, w: { k: w('k'), diameter: w('diameter'), roughness: w('roughness'), length: w('length') },
				marks: marks.length, marksInGutter: marks.filter((e) => e.closest('.lpn-ggut')).length,
				gutterW: Math.round(R(f.querySelector('.lpn-ggut') || f).width),
				// The unit stands in its label, in <bdi>; no row has a third cell.
				bdi: first('.lpn-gname').filter((e) => e.querySelector('bdi')).length,
				thirdCell: rows.filter((r) => r.querySelector('.lpn-gunit')).length
			};
		});
		if (phone) {
			// A phone (390 px): the name goes above its value, and the box is usable (box-grid-audit.js).
			const ph = await page.evaluate(() => {
				const b = document.querySelector('#lpn_popup .lpn-popover-body'), r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((x) => x.querySelector('.lpn-gname') && x.querySelector('input[type=number]'))[0];
				const n = r.querySelector('.lpn-gname').getBoundingClientRect(), c = r.querySelector('input').getBoundingClientRect();
				return { scroll: b.scrollWidth - b.clientWidth, above: c.top >= n.bottom - 2 };
			});
			ok(tag + 'on a phone a name stands above its value', ph.above, JSON.stringify(ph));
			await auditPhone(page, { root: '#lpn_popup .lpn-popover-body' }, ok, tag + 'the box');
			if (process.env.BOXROWS_SHOT) { await page.locator('#lpn_popup').screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'after-phone-' + (scn ? 'scn-' : '') + name + '.png') }); }
			await a.close();
			return;
		}
		ok(tag + 'the box is a grid with rows', m.open && m.grid === 'grid' && m.rows >= 3, JSON.stringify({ grid: m.grid, rows: m.rows }));
		await auditBox(page, { root: '#lpn_popup .lpn-popover-body' }, ok, tag + 'the box');
		const like = await page.evaluate(() => {
			const w = (sel) => Array.from(document.querySelectorAll('#lpn_popup_fields ' + sel)).filter((e) => e.getBoundingClientRect().width > 0).map((e) => Math.round(e.getBoundingClientRect().width));
			return { coords: w('input.lpn-gw-num[type="number"]').length ? Array.from(document.querySelectorAll('#lpn_popup_fields input.lpn-gw-num[type="number"]')).filter((e) => e.style.getPropertyValue('--d') === '12' && e.getBoundingClientRect().width > 0).map((e) => Math.round(e.getBoundingClientRect().width)) : [],
				text: w('input.lpn-gw-fill[type="text"]') };
		});
		ok(tag + 'X, Y and Elevation are one width', new Set(like.coords).size <= 1, JSON.stringify(like.coords));
		ok(tag + 'Description and Tag are one width', new Set(like.text).size <= 1, JSON.stringify(like.text));
		const dem = await page.evaluate(() => {
			const t = document.querySelector('#lpn_popup_fields table.lpn-demand-table'), g = document.querySelector('#lpn_popup_fields .lpn-gname'), b = document.querySelector('#lpn_popup .lpn-popover-body');
			if (!t) { return null; }
			const cut = Array.from(t.querySelectorAll('input, select, button')).filter((e) => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().right > b.getBoundingClientRect().right + 1).length;
			return { left: Math.round(t.getBoundingClientRect().left), val: Math.round(g.getBoundingClientRect().left), cut };
		});
		if (dem && !phone) {
			ok(tag + 'the demand table is in the grid, from the Label column', Math.abs(dem.left - dem.val) <= 4, JSON.stringify(dem));
			ok(tag + 'no demand control is cut by the box edge', dem.cut === 0, JSON.stringify(dem));
		}
		if (process.env.BOXROWS_SHOT && !scn) { await page.locator('#lpn_popup').screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'after-' + name + '.png') }); }
		ok(tag + 'nothing is left off the grid', m.off.length === 0, JSON.stringify(m.off));
		ok(tag + 'the box does not scroll sideways', m.scroll <= 1, String(m.scroll));
		ok(tag + 'every override marker is in a gutter cell', m.marks === m.marksInGutter, m.marksInGutter + '/' + m.marks);
		if (!scn && m.marks === 0) { ok(tag + 'no marker, no gutter', m.gutterW === 0, String(m.gutterW)); }
		ok(tag + 'no row has a third (unit) cell', m.thirdCell === 0, String(m.thirdCell));
		if (name === 'pipe') {
			ok(tag + 'Minor loss 5 < Diameter 6 < Roughness 7 < Length 8 digits wide', m.w.k < m.w.diameter && m.w.diameter < m.w.roughness && m.w.roughness < m.w.length, JSON.stringify(m.w));
			ok(tag + 'units stand in the labels, in <bdi> (Diameter (in), Length (ft), ...)', m.bdi >= 2, String(m.bdi));
		}
		await a.close();
	}
	try {
		for (const scn of [false, true]) {
			for (const t of [['junction', 'data-node', '11'], ['reservoir', 'data-node', '9'], ['tank', 'data-node', '2'], ['pipe', 'data-link', '10'], ['pump', 'data-link', '9'], ['customer', 'data-cust', 'M1'], ['text', 'data-lbl', 'X2']]) { await one(scn, 'Net1.lwn', ...t); }
			for (const v of ['PBV1', 'PRV1', 'PSV1', 'FCV1', 'TCV1', 'GPV1']) { await one(scn, 'Valves.lwn', 'valve-' + v, 'data-link', v); }
		}
		for (const t of [['pipe', 'data-link', '10'], ['junction', 'data-node', '11'], ['text', 'data-lbl', 'X2'], ['customer', 'data-cust', 'M1']]) { await one(false, 'Net1.lwn', t[0] + '-phone', t[1], t[2], true); }
		await one(true, 'Net1.lwn', 'pipe-phone', 'data-link', '10', true);
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

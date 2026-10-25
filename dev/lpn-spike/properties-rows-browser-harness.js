// THE PROPERTIES BOX ON THE STANDARD ROW GRID, IN A REAL BROWSER (ROADMAP Task 828; Ida's design,
// dev/agents/interface-designer/standard-box-rows-2026-10-24.md). For a junction, a pipe, a pump, a
// valve, a customer and a Text, each in Base and in a second scenario:
//   1. every row's name starts at one x and every value at one x (the grid is #lpn_popup_fields);
//   2. nothing is left off the grid: each child of the box is a row (a display: contents label), a
//      spanning block, or a line break that draws nothing;
//   3. the box never scrolls sideways;
//   4. the override marker sits in the gutter cell of its own row and the gutter is nothing in Base
//      where no marker shows;
//   5. a pipe's number boxes are as wide as their digits: Minor loss (5) < Diameter (6) <
//      Roughness (7) < Length (8);
//   6. a unit has its own column, and no name carries "(unit)" any more.
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
	async function one(scn, file, name, attr, id) {
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
		await page.setViewportSize({ width: 1600, height: 1000 });
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
				return !(cs.display === 'contents' || cs.display === 'none' || /lpn-gspan/.test(k) || /lpn-ggut/.test(k));
			}).map((c) => c.nodeName + '.' + c.className);
			const first = (sel) => rows.map((r) => r.querySelector(sel)).filter(Boolean);
			const w = (prop) => { const i = f.querySelector('input[data-gprop="' + prop + '"]'); return i ? Math.round(R(i).width) : null; };
			const marks = Array.from(f.querySelectorAll('.lpn-ovm'));
			return {
				open: getComputedStyle(document.getElementById('lpn_popup')).display !== 'none', grid: getComputedStyle(f).display,
				rows: rows.length, names: first('.lpn-gname').map((e) => R(e).left), vals: first('.lpn-gval').map((e) => R(e).left).filter((x) => x > 0),
				off, scroll: f.scrollWidth - f.clientWidth, w: { k: w('k'), diameter: w('diameter'), roughness: w('roughness'), length: w('length') },
				marks: marks.length, marksInGutter: marks.filter((e) => e.closest('.lpn-ggut')).length,
				gutterW: Math.round(R(f.querySelector('.lpn-ggut') || f).width), paren: first('.lpn-gname').filter((e) => !e.closest('label').querySelector('input[type=checkbox]')).filter((e) => / \([^)]*\)\s*$/.test(e.textContent.replace(/\?\s*$/, '').trim())).map((e) => e.textContent.trim()),
				units: first('.lpn-gunit').filter((e) => e.textContent.trim()).length
			};
		});
		ok(tag + 'the box is a grid with rows', m.open && m.grid === 'grid' && m.rows >= 3, JSON.stringify({ grid: m.grid, rows: m.rows }));
		ok(tag + 'every name starts at one x', uniq(m.names).length === 1, JSON.stringify(uniq(m.names)));
		ok(tag + 'every value starts at one x', uniq(m.vals).length === 1, JSON.stringify(uniq(m.vals)));
		ok(tag + 'nothing is left off the grid', m.off.length === 0, JSON.stringify(m.off));
		ok(tag + 'the box does not scroll sideways', m.scroll <= 1, String(m.scroll));
		ok(tag + 'every override marker is in a gutter cell', m.marks === m.marksInGutter, m.marksInGutter + '/' + m.marks);
		if (!scn && m.marks === 0) { ok(tag + 'no marker, no gutter', m.gutterW === 0, String(m.gutterW)); }
		ok(tag + 'no name still carries its unit in brackets', m.paren.length === 0, JSON.stringify(m.paren));
		if (name === 'pipe') {
			ok(tag + 'Minor loss 5 < Diameter 6 < Roughness 7 < Length 8 digits wide', m.w.k < m.w.diameter && m.w.diameter < m.w.roughness && m.w.roughness < m.w.length, JSON.stringify(m.w));
			ok(tag + 'units have their own column (diameter, length, ...)', m.units >= 2, String(m.units));
		}
		await a.close();
	}
	try {
		for (const scn of [false, true]) {
			for (const t of [['junction', 'data-node', '11'], ['pipe', 'data-link', '10'], ['pump', 'data-link', '9'], ['customer', 'data-cust', 'M1'], ['text', 'data-lbl', 'X2']]) { await one(scn, 'Net1.lwn', ...t); }
			await one(scn, 'Valves.lwn', 'valve', 'data-link', 'PBV1');
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

// THE CONTOUR BOX SAYS WHAT IS PLOTTED (ROADMAP Task 858). Tom, 2026-11-09/11: with No color chosen under
// Color nodes by, the box gave no point of reference; the order is his. Holds, in Chromium on Net3:
//   1. the rows are in his order: Show plot, Property to plot, Color scheme, Show node colors, Fill,
//      Fill opacity, Buffer, Contour lines, Interval, Labels.
//   2. with node colors off the Property to plot reads a property (never No color) and the plot is drawn.
//   3. an old project (Color nodes by chosen, no Property to plot stated) opens showing the same plot:
//      the box reads that property and Show node colors is ticked; clearing it leaves the plot alone.
//   4. ticking Show node colors colors the dots; changing the property carries them; the plot follows.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/contour-controls-browser-harness.js
// CONTOUR_SHOT=<dir> also writes a screenshot of each view there.
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
function layerFacts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour');
		if (!g) { return null; }
		const img = g.querySelector('image.lpn-contour-fill'), r = img ? img.getBoundingClientRect() : null;
		const labels = Array.from(g.querySelectorAll('text.lpn-contour-label'));
		const lb = labels.map((t) => t.getBoundingClientRect());
		return {
			first: g.parentNode.firstChild === g,
			href: img ? (img.getAttribute('href') || '').slice(0, 22) : '',
			opacity: img ? img.getAttribute('opacity') : null,
			imgW: r ? r.width : 0, imgH: r ? r.height : 0,
			lines: Array.from(g.querySelectorAll('path.lpn-contour-line')).map((p) => +p.getAttribute('data-level')),
			breaks: g.querySelectorAll('path.lpn-contour-break').length,
			labels: labels.map((t) => +t.getAttribute('data-level')),
			fontSize: labels.length ? +labels[0].getAttribute('font-size') : 0,
			labelH: lb.length ? lb.reduce((s, b) => s + Math.min(b.width, b.height), 0) / lb.length : 0
		};
	});
}
async function setBox(a, id, value) {
	await a.page.evaluate(([i, v]) => {
		const e = document.getElementById(i);
		if (e.type === 'checkbox') { e.checked = !!v; } else { e.value = String(v); }
		e.dispatchEvent(new Event('change', { bubbles: true }));
	}, [id, value]);
	await a.settle(300);
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
function facts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour'), img = g && g.querySelector('image.lpn-contour-fill');
		const val = (id) => { const e = document.getElementById(id); return e ? (e.type === 'checkbox' ? e.checked : e.value) : null; };
		const dots = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node-junction'));
		const coloured = dots.filter((c) => c.style.color).length;
		const body = document.getElementById('lpn_contour_body');
		const ctrls = Array.from(body.querySelectorAll('input, select, button')).map((e) => e.id || 'ramp');
		return { fill: !!(img && (img.getAttribute('href') || '').indexOf('data:image/png') === 0), coloured, dots: dots.length,
			field: val('lpn_contour_field'),
			fieldOpts: Array.from((document.getElementById('lpn_contour_field') || { options: [] }).options).map((o) => o.value),
			nodes: val('lpn_contour_node_colors'), ctrls,
			legend: (document.getElementById('lpn_color_legend') || {}).textContent || '' };
	});
}
async function main0(Session, browser) {
	console.log('\n--- 1. the order, and the plot with node colors off ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		await contourFromMenu(a);
		// Net3 opens with the nodes colored by pressure; the case under test is the nodes plain.
		await setBox(a, 'lpn_contour_node_colors', false);
		let f = await facts(a.page);
		const want = ['lpn_contour_show', 'lpn_contour_field', 'lpn_contour_node_colors', 'lpn_contour_fill', 'lpn_contour_opacity', 'lpn_contour_buffer', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_labels'];
		const got = f.ctrls.filter((x) => want.indexOf(x) >= 0);
		ok('the rows follow Tom\'s order', JSON.stringify(got) === JSON.stringify(want), got.join(' > '));
		const iRamp = f.ctrls.findIndex((x) => x === 'ramp' || /ramp|scheme/i.test(x));
		ok('Color scheme sits between Property to plot and Show node colors', iRamp > f.ctrls.indexOf('lpn_contour_field') && iRamp < f.ctrls.indexOf('lpn_contour_node_colors'), f.ctrls.join(' '));
		ok('Property to plot reads a property, with no No color choice', !!f.field && f.fieldOpts.indexOf('') < 0, f.field + ' of ' + f.fieldOpts.join(','));
		ok('Show node colors is cleared, the dots are plain, and the plot is still drawn', f.nodes === false && f.fill && f.coloured === 0, JSON.stringify({ n: f.nodes, fill: f.fill, col: f.coloured }));
		ok('the color key shows the plotted property', f.legend.length > 0, f.legend.slice(0, 40));
		await shot(a.page, 'contour-controls-desk');

		console.log('\n--- 2. Show node colors colors the dots; the property carries them ---');
		await setBox(a, 'lpn_contour_node_colors', true);
		f = await facts(a.page);
		ok('ticked: the nodes wear the plot\'s colors and the plot stays', f.coloured > 0 && f.fill && f.nodes === true, JSON.stringify({ col: f.coloured, dots: f.dots }));
		await setBox(a, 'lpn_contour_field', 'head');
		f = await facts(a.page);
		ok('changing Property to plot to head: box, plot and dots all follow', f.field === 'head' && f.nodes === true && f.coloured > 0 && f.fill, f.field);
		await setBox(a, 'lpn_contour_node_colors', false);
		f = await facts(a.page);
		ok('cleared: the dots are plain, the plot of head is unchanged', f.coloured === 0 && f.fill && f.field === 'head', JSON.stringify({ col: f.coloured, field: f.field }));
		await setBox(a, 'lpn_contour_field', 'pressure');
		f = await facts(a.page);
		ok('a property chosen with the nodes plain leaves them plain', f.coloured === 0 && f.nodes === false && f.fill, JSON.stringify({ col: f.coloured }));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
async function main1(Session, browser) {
	console.log('\n--- 3. an old project: Color nodes by chosen, no Property to plot stated ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		// Settings is the one editor an old project had; the plot's own property is never touched.
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(400);
		await a.page.evaluate(() => { const n = document.getElementById('lpn_set_color_node'); n.value = 'head'; n.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(400);
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		await contourFromMenu(a);
		const f = await facts(a.page);
		ok('the box reads the old Color nodes by as its Property to plot', f.field === 'head', f.field);
		ok('Show node colors is ticked, the dots are colored, the plot is drawn', f.nodes === true && f.coloured > 0 && f.fill, JSON.stringify({ n: f.nodes, c: f.coloured, fill: f.fill }));
		await shot(a.page, 'contour-controls-old');
		await setBox(a, 'lpn_contour_node_colors', false);
		const g = await facts(a.page);
		ok('clearing Show node colors keeps the plot of head', g.field === 'head' && g.fill && g.coloured === 0, JSON.stringify({ f: g.field, fill: g.fill, c: g.coloured }));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}
async function sectionPhone(Session, browser) {
	console.log('\n--- 4. a 390-wide phone ---');
	const a = await openNet3(Session, browser, { width: 390, height: 844 });
	try {
		await contourFromMenu(a);
		const m = await a.page.evaluate(() => { const b = document.getElementById('lpn_contour_box'), r = b.getBoundingClientRect(); return { w: r.width, l: r.left, rt: r.right, over: b.scrollWidth > b.clientWidth + 1 }; });
		ok('the box fits the phone with nothing wider than it', m.l >= -1 && m.rt <= 391 && !m.over, JSON.stringify(m));
		await shot(a.page, 'contour-controls-phone');
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
		await sectionPhone(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

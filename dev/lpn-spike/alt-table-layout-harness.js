// THE ALTERNATIVES PREVIEW TABLE LAYS OUT LIKE A TABLE. Run with:
//   node dev/lpn-spike/alt-table-layout-harness.js [screenshot.png]
//
// Tom, 2026-10-01, browser pass on Scenarios > Alternatives preview: *"Alternatives columns are
// crazy."* Words broke mid-word ("Scen|ario", "Dema|nd", cell "Bas|e") in columns that still held
// unused padding. Cause: `.lpn-ff-table th, td { overflow-wrap: anywhere }` lets the browser shrink
// every column's minimum width to one character, so auto layout shares the width evenly and breaks
// words to fit it. Layout is real geometry, so this runs in Chromium (a stub cannot see it).
//
// It asserts, at the real width and again in a box narrower than the table:
//   1. no word of any heading or cell is split across lines;
//   2. each column is no wider than its widest word (headings) or widest cell, plus padding;
//   3. a table that cannot fit scrolls inside its box rather than squeezing.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock', LOCK_ENV = 'EC_ALT_LAYOUT_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('alt-table-layout-harness: NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// Runs in the page. A word split by overflow-wrap has client rects on two lines. A column's slack is
// its width less the widest single word of any heading in it or the whole text of any body cell
// (body cells here are one phrase and are not meant to wrap), plus that cell's padding.
function measureInPage() {
	const table = document.querySelector('#lpn_alt_report table');
	const wrap = table.parentNode;
	const out = { split: [], cols: [], wrapW: wrap.clientWidth, tableW: table.getBoundingClientRect().width,
		scrolls: wrap.scrollWidth > wrap.clientWidth + 1 };
	// The group row naming the calculation options spans columns, so it is left out of the per-column measure.
	const rows = Array.from(table.rows).filter((tr) => !tr.querySelector('.lpn-alt-group'));
	rows.forEach((tr) => Array.from(tr.cells).forEach((c) => {
		const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
		let n;
		while ((n = walker.nextNode())) {
			const re = /\S+/g; let m;
			while ((m = re.exec(n.nodeValue))) {
				const r = document.createRange();
				r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
				const tops = new Set(Array.from(r.getClientRects()).filter(q => q.width > 0).map(q => Math.round(q.top)));
				if (tops.size > 1) { out.split.push(m[0] + ' (' + tr.parentNode.tagName + ' col ' + c.cellIndex + ')'); }
			}
		}
	}));
	for (let i = 0; i < rows[0].cells.length; i++) {
		let widest = 0, colW = 0;
		const name = rows[0].cells[i].textContent.trim();
		rows.forEach((tr) => {
			const c = tr.cells[i], cs = getComputedStyle(c), isHead = tr.parentNode.tagName === 'THEAD';
			colW = Math.max(colW, c.getBoundingClientRect().width);
			const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
			const probe = document.createElement('span');
			probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + cs.font;
			c.appendChild(probe);
			const text = c.firstChild && c.firstChild.nodeType === 3 ? c.firstChild.nodeValue.trim() : c.textContent.trim();
			const pieces = isHead ? text.split(/\s+/) : [text];
			let w = 0;
			pieces.forEach((p) => { probe.textContent = p; w = Math.max(w, probe.getBoundingClientRect().width); });
			probe.remove();
			// A scenario's calculation option is a box it is typed into (Task 755): the box is the content.
			const box = !isHead && c.querySelector('input');
			if (box) { w = box.getBoundingClientRect().width; }
			widest = Math.max(widest, w + pad);
		});
		out.cols.push({ name, colW, widest, slack: colW - widest });
	}
	return out;
}

async function main() {
	const shot = process.argv[2];
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('alt-table-layout-harness: no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		await a.goto('Looped-Network.php');
		// Basic mode off is the browser's own setting (setScenarioBasicMode); set it as the menu does.
		await a.page.evaluate(() => { try { localStorage.setItem('lpn_scnbasic', 'off'); } catch (e) {} });
		await a.reload();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) c.remove(); });

		// A scenario with one changed demand: Peak Hour, junction 10's base demand.
		a._promptAnswer = 'Peak Hour';
		await a.page.click('#lpn_scenario_btn');
		await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_scenario_new'));
		await a.settle(400);
		await a.toolbarClick('Bottom panel');
		await a.settle(300);
		await a.page.click('#lpn_pane_tab_junctions');
		await a.settle(300);
		const inp = await a.page.$('#lpn_pane_junctions tbody tr:first-child td.lpn-pane-col-demand input');
		await inp.click();
		await a.page.keyboard.press('Control+A');
		await a.page.keyboard.type('123');
		await a.page.keyboard.press('Enter');
		await a.settle(400);

		await a.page.click('#lpn_scenario_btn');
		await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await a._clickRow('#lpn_menu_list', await a.lang('lpn_alt_title'));
		await a.settle(500);
		await a.page.waitForSelector('#lpn_alt_report table', { state: 'visible' });

		const text = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_alt_report tbody tr')).map(r => r.textContent));
		ok('the Peak Hour row shows a Peak Hour demand alternative (the edit landed)',
			text.some(t => /Peak Hour/.test(t) && /Peak Hour \(1\)/.test(t)), JSON.stringify(text));

		const check = (label, m) => {
			ok(label + ': no word is split across lines', m.split.length === 0, JSON.stringify(m.split));
			m.cols.forEach((c) => ok(label + ': column "' + c.name + '" has at most 3 px of slack',
				c.slack <= 3, `${c.colW.toFixed(1)} px wide, widest content ${c.widest.toFixed(1)} px`));
		};
		const wide = await a.page.evaluate(measureInPage);
		check('in the box as it opens', wide);
		ok('...and the table needs no scrolling at that width', !wide.scrolls, `${wide.tableW.toFixed(0)} in ${wide.wrapW}`);
		if (shot) { await a.page.locator('#lpn_alt_box').screenshot({ path: shot }); }

		// TOM, 2026-10-04: "The box needs to be wider (like 1500 px) on PC." Opened fresh at each
		// window size: about 1500 px on a 1920 window, and 94% of the window (not wider) on a phone.
		const openedWidth = async (w, h) => {
			await a.page.evaluate(() => { document.getElementById('lpn_alt_close').click(); });
			await a.page.setViewportSize({ width: w, height: h });
			await a.settle(300);
			await a.page.click('#lpn_scenario_btn');
			await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await a._clickRow('#lpn_menu_list', await a.lang('lpn_alt_title'));
			await a.settle(500);
			return a.page.evaluate(() => document.getElementById('lpn_alt_box').getBoundingClientRect().width);
		};
		const pcW = await openedWidth(1920, 1080);
		ok('at 1920x1080 the box is about 1500 px wide', pcW >= 1450 && pcW <= 1510, pcW.toFixed(0));
		const phW = await openedWidth(390, 800);
		ok('at 390 px the box fits the window with a gutter', phW <= 390 && phW >= 390 * 0.9, phW.toFixed(0));
		await openedWidth(1280, 800);

		// Narrower than the table: it must scroll, not squeeze.
		await a.page.evaluate(() => { const b = document.getElementById('lpn_alt_box'); b.style.width = '420px'; });
		await a.settle(300);
		const narrow = await a.page.evaluate(measureInPage);
		check('in a 420 px box', narrow);
		ok('...the table scrolls sideways inside its box', narrow.scrolls, `${narrow.tableW.toFixed(0)} in ${narrow.wrapW}`);
		if (shot) { await a.page.locator('#lpn_alt_box').screenshot({ path: shot.replace(/\.png$/, '') + '-narrow.png' }); }

		// The option boxes (Task 755) retired with the Settings table (Q7); a scenario's own run time
		// is typed there now: dev/lpn-spike/settings-table-browser-harness.js.
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

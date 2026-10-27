// THE SETTINGS LABELS ROWS NEVER WRAP, AND NO COLUMN IS CUT OFF (Tom, 2026-10-25, phone and PC).
// Real Chromium, Settings > Labels, on a 390 x 844 phone and on a 1366 x 768 PC, in Base and with a
// scenario override on a label row (the override mark adds a control to the row):
//   1. every labels row (node, link, Text) keeps its six controls (the group Bef. to Drop) in one horizontal band (text inside a cell may wrap;
//      the group sitting beside or below the name is settings-labels-wrap-browser-harness.js);
//   2. the Show and Drop columns are fully visible or reachable by scrolling the content pane
//      sideways, and no ancestor between them and the pane clips them;
//   3. a two-digit Drop value is not clipped, and the default PC box fits the table with its override column;
//   3b. no name is cut off (scrollWidth <= clientWidth), in English and in German and Russian;
//
//   node dev/lpn-spike/settings-labels-rows-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'settings-labels-rows-browser-harness';
if (process.env.EC_SLR_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_SLR_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const LISTS = ['lpn_labels_node_fields', 'lpn_labels_link_fields', 'lpn_labels_customer_fields'];

async function measure(page) {
	return page.evaluate((lists) => {
		const c = document.getElementById('lpn_setbox_content');
		const out = { rows: 0, wrapped: [], clipped: [], pane: c.clientWidth, scroll: c.scrollWidth, cols: null, index: null };
		const ix = document.querySelector('.lpn-setbox-index');
		out.listW = Math.max.apply(null, lists.map((id) => { const e = document.getElementById(id); return e ? Math.max.apply(null, Array.from(e.children).filter((r) => r.querySelector(':scope > .lpn-lblgroup')).map((r) => Math.round(r.querySelector(':scope > .lpn-lblgroup').getBoundingClientRect().right - r.getBoundingClientRect().left))) : 0; }));
		out.wide = Array.from(c.querySelectorAll('*')).filter((e) => e.offsetParent && e.getBoundingClientRect().right > c.getBoundingClientRect().left + c.clientWidth + 5).slice(0, 3).map((e) => e.tagName + '#' + e.id + '.' + String(e.className).slice(0, 20));
		out.dbg = Array.from(document.getElementById(lists[0]).children).slice(0, 3).map((r) => Math.round(r.getBoundingClientRect().width) + ':' + Array.from(r.children).map((k) => Math.round(k.getBoundingClientRect().width)).join(','));
		out.cut = [];
		lists.forEach((id) => {
			const e = document.getElementById(id);
			if (e) { e.querySelectorAll('label').forEach((l) => { if (l.offsetParent && (l.scrollWidth > l.clientWidth + 1 || getComputedStyle(l).textOverflow === 'ellipsis' && l.scrollWidth > l.clientWidth)) { out.cut.push(l.textContent.trim().slice(0, 30)); } }); }
		});
		// A two-digit Drop value: typed into the Drop box of a row that has one, then read back unclipped.
		out.dropClip = [];
		const dropRow = Array.from(document.getElementById(lists[0]).children).filter((r) => { const g = r.querySelector(':scope > .lpn-lblgroup'); return g && g.children.length === 6 && g.children[5].tagName === 'INPUT'; })[0];
		if (dropRow) {
			const inp = dropRow.querySelector('.lpn-lblgroup').children[5], was = inp.value;
			inp.value = '88';
			if (inp.scrollWidth > inp.clientWidth + 1) { out.dropClip.push(inp.scrollWidth + '>' + inp.clientWidth); }
			inp.value = was;
		} else { out.dropClip.push('no Drop box found'); }
		out.index = ix ? Math.round(ix.getBoundingClientRect().width) : null;
		lists.forEach((id) => {
			const box = document.getElementById(id);
			if (!box) { return; }
			Array.from(box.children).forEach((row, ri) => {
				if (!row.offsetParent || !row.querySelector(':scope > .lpn-lblgroup')) { return; }
				out.rows++;
				const kids = Array.from(row.children).filter((k) => k.getClientRects().length);
				const tops = kids.map((k) => Math.round(k.getBoundingClientRect().top));
				const tall = Math.max.apply(null, kids.map((k) => k.getBoundingClientRect().height));
				const rowH = row.getBoundingClientRect().height;
				const nameEl = row.querySelector('.lpn-set-name > span') || row.querySelector('.lpn-set-name') || row.children[0];
				const rg = document.createRange(); rg.selectNodeContents(nameEl);
				const lines = new Set(Array.from(rg.getClientRects()).map((q) => Math.round(q.top / 4))).size;
				// Tom's definition (2026-10-25): a row's controls must not reflow onto a second line; text inside a cell
				// (a name, a heading) may wrap, mid-word included. So only the controls are compared: every box and tick of
				// the row sits in one horizontal band.
				const heads = ri === 0;
				const ys = Array.from((row.querySelector(':scope > .lpn-lblgroup') || row).children).map((k) => k.matches('input') ? k : k.querySelector('input')).filter((k) => k && k.offsetParent)
					.map((k) => { const q = k.getBoundingClientRect(); return q.top + q.height / 2; });
				if (!heads && ys.length > 1 && Math.max.apply(null, ys) - Math.min.apply(null, ys) > 8) {
					out.wrapped.push(id + ':' + (nameEl.textContent || '').trim().slice(0, 20) + ' controls span ' + Math.round(Math.max.apply(null, ys) - Math.min.apply(null, ys)) + ' px');
				}
			});
		});
		// Reachability of the last column: scroll the pane fully right, then every row's last cell must be
		// inside the pane, and no ancestor below the pane may clip.
		const cr = c.getBoundingClientRect();
		lists.forEach((id) => {
			const box = document.getElementById(id);
			if (!box) { return; }
			Array.from(box.children).forEach((row) => {
				if (!row.offsetParent || !row.querySelector(':scope > .lpn-lblgroup')) { return; }
				const last = row.querySelector(':scope > .lpn-lblgroup'); last.scrollIntoView({ inline: 'end', block: 'nearest' }); const r = last.getBoundingClientRect();
				if (r.right > cr.right + 1 || r.left < cr.left - 1) { out.clipped.push(id + ' last cell right ' + Math.round(r.right) + ' > pane ' + Math.round(cr.right)); }
				for (let e = last.parentElement; e && e !== c; e = e.parentElement) {
					const o = getComputedStyle(e);
					if ((o.overflowX === 'hidden' || o.overflowX === 'clip') && e.scrollWidth > e.clientWidth + 1) { out.clipped.push(id + ' clipped by ' + e.tagName + '.' + e.className); }
				}
			});
		});
		c.scrollLeft = 0;
		const head = document.getElementById(lists[0]).children[0];
		out.cols = Array.from(head.querySelector('.lpn-lblgroup').children).map((x) => Math.round(x.getBoundingClientRect().width));
		return out;
	}, LISTS);
}

async function run(browser, Session, label, viewport, touch, lang) {
	const a = await Session.open(browser, NAME + '-' + label, Object.assign({ viewport }, touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}));
	const page = a.page;
	try {
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.settle(900);
		console.log('\n--- ' + label + ', Base ---');
		let m = await measure(page);
		console.log('  rows ' + m.rows + ', pane ' + m.pane + '/' + m.scroll + ', head widths ' + m.cols.join(',') + ', index ' + m.index);
		ok(label + ': labels rows were found', m.rows > 10, String(m.rows));
		ok(label + ': every row of controls stays on one line (no control reflows onto a second line)', m.wrapped.length === 0, m.wrapped.slice(0, 3).join(' | '));
		ok(label + ': a two-digit Drop value is not clipped', m.dropClip.length === 0, m.dropClip.join(' | '));
		ok(label + ': no name is cut off (no ellipsis)', m.cut.length === 0, m.cut.slice(0, 3).join(' | '));
		ok(label + ': Show and Drop reachable, never clipped', m.clipped.length === 0, m.clipped.slice(0, 3).join(' | '));
		console.log('  widest list ' + m.listW + ' px, pane ' + m.pane + ' px, past the pane: ' + m.wide.join('; '));
		if (!touch && !lang) { ok(label + ': the docked-width default fits the labels table without a sideways scroll', m.listW + 8 <= m.pane, m.listW + ' (+8 indent) vs ' + m.pane); }
		// A scenario override on a label row.
		await page.keyboard.press('Escape');
		await a.settle(300);
		await page.evaluate(() => { const x = document.querySelector('#lpn_settings_box .lpn-popover-x'); if (x) { x.click(); } });
		await a.settle(400);
		a.answerPromptWith('Fig 5');
		await require('./manager-door.js').ensure(page, await a.lang('lpn_scenario_new'));
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const rowsH = await page.$$('#lpn_menu_list button.lpn-menu-row');
		for (const r of rowsH) { if ((await r.textContent()).trim().indexOf(await a.lang('lpn_scenario_new')) === 0) { await r.click(); break; } }
		await a.settle(1200);
		const open = await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && b.offsetParent !== null; });
		if (!open) { await a.menuClick(await a.lang('lpn_tool_settings'), 'project'); await a.settle(900); }
		const cb = await page.evaluateHandle(() => document.querySelector('#lpn_labels_node_fields [data-lpn-setting] input[type=checkbox]'));
		await cb.asElement().evaluate((e) => { e.scrollIntoView({ block: 'center' }); e.click(); });
		await a.settle(1200);
		const held = await page.evaluate(() => document.querySelectorAll('#lpn_labels_node_fields .lpn-set-held, #lpn_labels_node_fields [class*="ovr"]').length);
		console.log('\n--- ' + label + ', with an override (held rows ' + held + ') ---');
		m = await measure(page);
		ok(label + ' override: no labels row wraps', m.wrapped.length === 0, m.wrapped.slice(0, 3).join(' | '));
		if (!touch && !lang) { ok(label + ' override: the default box fits the labels table WITH the override column, no sideways scroll', m.listW + 8 <= m.pane, m.listW + ' (+8 indent) vs ' + m.pane); }
		ok(label + ' override: Show and Drop reachable, never clipped', m.clipped.length === 0, m.clipped.slice(0, 3).join(' | '));
	} finally { await a.close(); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		await run(browser, Session, 'phone', { width: 390, height: 844 }, true);
		await run(browser, Session, 'pc', { width: 1366, height: 768 }, false);
		await run(browser, Session, 'phone-de', { width: 390, height: 844 }, true, 'de');
		await run(browser, Session, 'pc-ru', { width: 1366, height: 768 }, false, 'ru');
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));

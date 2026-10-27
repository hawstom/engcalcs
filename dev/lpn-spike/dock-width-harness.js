// A DOCKED BOX KEEPS ITS OWN OPTIMAL WIDTH, MEASURED FROM ITS OWN CONTENT (Tom, 2026-10-24: the
// first-visit docks "made them all a uniform width"; then, of a pass that gave every report box the
// same 832 px: "a single 'wide' width applied without discretion ... not the individualized
// optimization I requested"). And the Settings label columns line up whether or not a row has a
// Decimals, Show or Drop box (Tom, same day: "several link and customer label rows' columns are
// misaligned, possibly related to whether or not they have a Decimals input").
//
//   1. Settings' Node, Link and Customer label rows: every column starts and ends at the same x on
//      every row, the heading row included, and every Settings row grid holds its second column at
//      one x. Water age chosen as the quality parameter, so its rows are drawn too.
//   2. Each box's width (LPN_DOCK_OPTIMAL_REM, read off the page) is checked against its content,
//      measured here (box-natural-width.js) on Net3 after a run and after each analysis has run:
//      within a step of the measurement, or at the 20 rem floor or the 52 rem cap when the
//      measurement is past it. Two boxes may share a width only for one of those reasons. The table
//      is printed, so a changed number has its evidence beside it.
//   3. The first-visit docks fly out at those widths; Settings' rows are not cut off at its width.
//   4. A box the visitor docks by its own button docks at the width it had floating (Tom, 2026-10-24:
//      "I think that your undocked width should dock"), saved as the docked width; a stored width is theirs.
//
//   node dev/lpn-spike/dock-width-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKW_BROWSER_LOCKED';
const NAME = 'dock-width-harness';

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
const { openBox } = require('./dock-boxes.js');
const { naturalWidth } = require('./box-natural-width.js');

const FLOOR = 320, CAP = 832, STEP = 8, SLACK = 16;
// The Manual is prose; its reading column is held to 32-40 rem instead of a measurement.
const PROSE = { lpn_hotkeys_popup: '#lpn_guide_content' };
// The fourteen first-visit docks, and the side each is on.
const FIRST = ['lpn_energy_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_calib_box', 'lpn_full_box',
	'lpn_settings_box', 'lpn_popup', 'lpn_find_popup', 'lpn_library_box', 'lpn_contour_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];
const LEFT = ['lpn_energy_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_calib_box', 'lpn_full_box'];
// Tom's three narrower-than-measured boxes (2026-10-24): each lets its content reflow, never cuts it.
// `hide` leaves the results table out of the measurement (it wraps its headings and, for Fire flow,
// scrolls inside its own container); what is left must not scroll sideways at the width given.
const REFLOW = { lpn_ff_box: { hide: '.lpn-ff-tablewrap', max: 35 }, lpn_crit_box: { hide: '.lpn-ff-tablewrap', max: 33 }, lpn_contour_box: { hide: null, max: 20 } };
const ANALYSES = ['lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];

const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
const widthOf = (a, id) => a.page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().width), id);
const measure = (a, id, hide) => a.page.evaluate(`(${naturalWidth.toString()})(${JSON.stringify({ id, hide })})`);
const closeBox = (a, id) => a.page.evaluate((i) => {
	const b = document.getElementById(i), x = b && b.querySelector('.lpn-popover-x');
	if (x) { x.click(); } else if (b) { b.style.display = 'none'; }
}, id);

async function visit(Session, browser, label, defaults, seed, dockList) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport: { width: 1600, height: 1000 } });
	await a.context.addInitScript((v) => { window.EC_DEFAULT_DOCKS = v; }, defaults);
	if (dockList) { await a.context.addInitScript((l) => { window.EC_DEFAULT_DOCK_LIST = l; }, dockList); }
	if (seed) { await a.context.addInitScript((kv) => { try { if (localStorage.getItem(kv[0]) === null) { localStorage.setItem(kv[0], kv[1]); } } catch (e) { /* none */ } }, seed); }
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await noConsent(a);
	await a.settle(1500);
	// First-view docks arrive when the first project opens (feat/first-view), not over the gallery.
	if (defaults) { await a.openExampleCard(await a.lang('lpn_ex_net3_title')); await a.settle(2500); }
	return a;
}
async function openSettings(a) {
	await a.toolbarClick(await a.lang('lpn_tool_settings'));
	await a.page.waitForSelector('#lpn_settings_box', { state: 'visible' });
	await a.settle(400);
}
// Anything in Settings' content pane that is cut off: a control past its right edge, or text wider
// than the box that holds it.
const clipped = (a) => a.page.evaluate(() => {
	const pane = document.querySelector('#lpn_settings_box .lpn-setbox-content'), pr = pane.getBoundingClientRect(), bad = [];
	Array.from(pane.querySelectorAll('input, select, button, label, .lpn-set-row > *')).forEach((e) => {
		const r = e.getBoundingClientRect();
		if (!(r.width > 0) || !(r.height > 0)) { return; }
		if (r.right > pr.right + 1) { bad.push('past right: ' + (e.textContent || e.className || e.tagName).trim().slice(0, 24)); }
		if (e.tagName === 'LABEL' && e.scrollWidth > e.clientWidth + 1) { bad.push('cut: ' + e.textContent.trim().slice(0, 24)); }
	});
	return bad;
});
// Every label-row column's left and right edge, on every row of each group: the spread of each
// edge down the group, and a row that sits off the others.
const labelColumns = (a) => a.page.evaluate(() => ['lpn_labels_node_fields', 'lpn_labels_link_fields', 'lpn_labels_customer_fields'].map((gid) => {
	// The heading and the field rows: the name (or the heading's lead) and ONE group of six columns (Before,
	// After, Use units, Decimals, Show, Drop). A whole-list row under them (the customer label-width limit) is not a column row.
	const g = document.getElementById(gid), rows = g ? Array.from(g.children).filter((r) => r.getBoundingClientRect().height > 0 && r.children.length === 2 && r.children[1].className === 'lpn-lblgroup') : [];
	const cols = [];
	for (let c = 0; c < 6; c++) {
		const ls = [], rs = [];
		rows.forEach((r) => {
			const e = r.children[1].children[c];
			if (!e) { return; }
			const b = e.getBoundingClientRect();
			ls.push([b.left, (r.textContent || '').trim().slice(0, 20) || '(heading)']);
			rs.push(b.right);
		});
		const lmin = Math.min.apply(null, ls.map((x) => x[0])), lmax = Math.max.apply(null, ls.map((x) => x[0]));
		const odd = ls.find((x) => Math.abs(x[0] - lmin) <= 0.5);
		cols.push({ c: c + 2, n: ls.length, lspread: lmax - lmin, rspread: Math.max.apply(null, rs) - Math.min.apply(null, rs), odd: odd && odd[1] });
	}
	return { gid, rows: rows.length, cols };
}));
// Each Settings section's two-column rows: the second column's left edge, spread down the section.
const rowGrids = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_content .lpn-set-secbody')).map((sec) => {
	const xs = Array.from(sec.querySelectorAll('.lpn-set-row')).filter((r) => r.getBoundingClientRect().height > 0 && getComputedStyle(r).display === 'grid' && r.children[1])
		.map((r) => r.children[1].getBoundingClientRect().left - r.getBoundingClientRect().left);   // relative to the row: a custom property's body is indented 12 px on purpose (.lpn-cp-body)
	return { sec: (sec.closest('.lpn-set-sec') || sec).id, n: xs.length, spread: xs.length ? Math.max.apply(null, xs) - Math.min.apply(null, xs) : 0 };
}).filter((s) => s.n > 1));

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
		console.log('\n--- 1. the label columns line up on every row ---');
		const s = await visit(Session, browser, 'columns', true);
		// Settings starts pinned open on a PC (Tom, 2026-10-26): nothing to fly out.
		await s.settle(500);
		// Water age as the quality parameter, so every row it adds is drawn and measured.
		await s.page.evaluate(() => {
			const sel = Array.from(document.querySelectorAll('#lpn_set_quality_fields select')).find((x) => Array.from(x.options).some((o) => o.value === 'age'));
			if (sel) { sel.value = 'age'; sel.dispatchEvent(new Event('change', { bubbles: true })); }
		});
		await s.settle(500);
		for (const g of await labelColumns(s)) {
			ok(g.gid + ' has its heading and field rows', g.rows > 3, g.rows + ' rows');
			g.cols.forEach((c) => ok(g.gid + ' column ' + c.c + ' starts and ends at one x on all ' + c.n + ' rows',
				c.n === g.rows && c.lspread <= 0.5 && c.rspread <= 0.5,
				'left edges spread ' + c.lspread.toFixed(1) + ' px, right ' + c.rspread.toFixed(1) + ' px' + (c.lspread > 0.5 ? '; leftmost: ' + c.odd : '')));
		}
		const grids = await rowGrids(s);
		ok('Settings sections with two-column rows were found', grids.length >= 5, grids.length + ' sections');
		grids.forEach((g) => ok(g.sec + ': the second column starts at one x on all ' + g.n + ' rows', g.spread <= 1, g.spread.toFixed(1) + ' px'));
		ok('no uncaught page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
		await s.close();

		console.log('\n--- 2. each box\'s width is measured from its own content ---');
		const m = await visit(Session, browser, 'measure', false);
		const table = await m.page.evaluate(() => EngCalcs.lpnDockOptimalRem());
		await m.openExampleCard(await m.lang('lpn_ex_net3_title'));
		await m.settle(800);
		await m.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await m.waitFor(() => m.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net3 EPS frames', 120000);
		await m.settle(600);
		const nat = {}, reflow = {};
		const keep = (id, r, how) => { if (r && r.natural !== null && (!nat[id] || r.natural > nat[id].natural)) { nat[id] = Object.assign({ how }, r); } };
		// Properties: a junction (its demand table) and a pipe, the wider of the two.
		for (const k of ['junction', 'pipe']) {
			const xy = await m.page.evaluate((kind) => {
				const els = kind === 'junction' ? Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node-junction'))
					: Array.from(document.querySelectorAll('#lpn_canvas polyline.lpn-link-pipe')).sort((x, y) => y.getTotalLength() - x.getTotalLength());
				for (const e of els) {
					let p;
					if (kind === 'junction') { const r = e.getBoundingClientRect(); p = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
					else { p = e.getPointAtLength(e.getTotalLength() / 2).matrixTransform(e.getScreenCTM()); }
					const hit = document.elementFromPoint(p.x, p.y);
					if (hit && hit.closest('#lpn_canvas') && (kind === 'junction' ? hit.tagName === 'circle' : hit.classList.contains('lpn-link-pipe'))) { return [p.x, p.y]; }
				}
				return null;
			}, k);
			if (!xy) { ok('a ' + k + ' to open Properties on', false); continue; }
			await m.page.mouse.click(xy[0], xy[1]);
			await m.settle(700);
			keep('lpn_popup', await measure(m, 'lpn_popup'), k);
			await m.page.keyboard.press('Escape');
			await m.settle(300);
		}
		for (const id of Object.keys(table)) {
			if (id === 'lpn_popup') { continue; }
			if (id === 'lpn_settings_box') { await openSettings(m); } else { await openBox(m, id); }
			await m.settle(600);
			if (PROSE[id]) {
				nat[id] = { prose: await m.page.evaluate((a) => {
					const b = document.getElementById(a[0]), saved = b.getAttribute('style') || '';
					b.style.setProperty('width', a[2] + 'px', 'important');
					const w = document.querySelector(a[1]).getBoundingClientRect().width;
					b.setAttribute('style', saved);
					return Math.round(w);
				}, [id, PROSE[id], Math.round(table[id] * 16)]) };
			} else {
				keep(id, await measure(m, id), 'open');
				if (ANALYSES.includes(id)) {
					await m.page.evaluate((i) => { const b = Array.from(document.querySelectorAll('#' + i + ' button')).find((x) => x.textContent.trim() === 'Run'); if (b) { b.click(); } }, id);
					await m.settle(500);
					await m.waitFor(() => m.page.evaluate((i) => { const b = Array.from(document.querySelectorAll('#' + i + ' button')).find((x) => x.textContent.trim() === 'Stop'); return !!b && b.disabled; }, id), id + ' run', 120000);
					await m.settle(600);
					keep(id, await measure(m, id), 'after its run');
					if (REFLOW[id]) {
						const rf = await measure(m, id, REFLOW[id].hide);
						// What the results table does at the width the box docks at.
						const t = await m.page.evaluate((a) => {
							const b = document.getElementById(a[0]), saved = b.getAttribute('style') || '';
							b.style.setProperty('width', a[1] + 'px', 'important');
							const w = b.querySelector('.lpn-ff-tablewrap'), th = Array.from(b.querySelectorAll('.lpn-ff-table th')).filter((x) => x.getBoundingClientRect().height > 30).length;
							const r = { scrolls: !!w && w.scrollWidth > w.clientWidth + 1, tableW: w ? w.scrollWidth : 0, paneW: w ? w.clientWidth : 0, wrappedHeadings: th };
							b.setAttribute('style', saved);
							return r;
						}, [id, Math.round(table[id] * 16)]);
						reflow[id] = Object.assign({ rf }, t);
					}
				}
			}
			await closeBox(m, id);
			await m.settle(300);
		}
		const reason = {}, justified = {};
		console.log('\n  box                 measured  docked  reason / what sets it');
		for (const id of Object.keys(table)) {
			const want = Math.round(table[id] * 16), n = nat[id];
			if (!n) { ok(id + ' was measured', false); continue; }
			if (REFLOW[id]) { reason[id] = 'reflow'; justified[id] = true; console.log('  ' + id.padEnd(20) + String(n.natural).padStart(8) + '  ' + String(want).padStart(6) + '  Tom: narrower; content reflows (below)'); continue; }
			if (n.prose !== undefined) {
				reason[id] = 'prose';
				console.log('  ' + id.padEnd(20) + '   prose  ' + String(want).padStart(6) + '  reading column ' + n.prose + ' px');
				justified[id] = n.prose >= 32 * 16 && n.prose <= 40 * 16;
				ok(id + ' reads at 32-40 rem', justified[id], n.prose + ' px');
				continue;
			}
			const r = n.natural >= CAP ? 'cap' : n.natural <= FLOOR ? 'floor' : 'measured';
			reason[id] = r;
			console.log('  ' + id.padEnd(20) + String(n.natural).padStart(8) + '  ' + String(want).padStart(6) + '  ' +
				(r === 'measured' ? '' : r + '; ') + '(' + n.how + ') ' + n.why.join(', '));
			if (r === 'cap') { justified[id] = want === CAP; ok(id + ' measures past the cap, so it docks at ' + CAP, justified[id], want + ' px'); }
			else if (r === 'floor') { justified[id] = want === FLOOR; ok(id + ' measures under the floor, so it docks at ' + FLOOR, justified[id], want + ' px'); }
			else {
				justified[id] = want >= n.natural - STEP && want <= n.natural + SLACK + (id === 'lpn_settings_box' ? 128 : 0);   // Settings also holds room for the override column (Tom, 2026-10-25)
				ok(id + ' docks at its measured width, ' + n.natural + ' px', justified[id],
					'LPN_DOCK_OPTIMAL_REM says ' + table[id] + ' rem = ' + want + ' px; the measurement says ' + (Math.ceil(n.natural / 8) / 2) + ' rem');
			}
		}
		console.log('\n  reflow boxes (Tom 2026-10-24): what is left out of the measurement, and what the results table does at the docked width');
		Object.keys(REFLOW).forEach((id) => {
			const want = Math.round(table[id] * 16), n = nat[id], r = reflow[id];
			if (id === 'lpn_contour_box') {
				ok(id + ' docks at the ' + FLOOR + ' px floor (Tom: narrower)', want === FLOOR, want + ' px; its controls first stop scrolling sideways at ' + (n && n.firstClean) + ' px');
				ok(id + ' does not scroll sideways at ' + want + ' px', !!n && n.firstClean !== null && n.firstClean <= want, 'first clean at ' + (n && n.firstClean));
				return;
			}
			ok(id + ' docks at no more than ' + REFLOW[id].max + ' rem', table[id] <= REFLOW[id].max, table[id] + ' rem');
			ok(id + ' controls and verdict do not scroll or wrap at ' + want + ' px (results table left out)', !!r && r.rf.natural !== null && r.rf.natural <= want, 'they need ' + (r && r.rf.natural) + ' px');
			console.log('       results table at ' + want + ' px: ' + (r.scrolls ? 'scrolls sideways inside its own container (' + r.tableW + ' px in ' + r.paneW + ')' : 'fits, no scroll') + '; ' + r.wrappedHeadings + ' headings wrap onto 2+ lines');
		});
		const byW = {};
		Object.keys(table).forEach((id) => { const w = Math.round(table[id] * 16); (byW[w] = byW[w] || []).push(id); });
		Object.keys(byW).forEach((w) => {
			const ids = byW[w];
			if (ids.length < 2) { return; }
			// Shared only where each box's own reason holds: two measurements that happen to agree, or
			// two boxes past the cap. A width given to a box its content does not ask for is the defect.
			ok(ids.length + ' boxes share ' + w + ' px, each for its own measured reason', ids.every((i) => justified[i]),
				ids.map((i) => i + ' (' + reason[i] + (justified[i] ? '' : ', NOT its own') + ')').join(', '));
		});
		ok('no uncaught page errors', m.errors.length === 0, m.errors.slice(0, 2).join(' | '));
		await m.close();

		console.log('\n--- 3. the first-visit docks fly out at those widths ---');
		// The first-view layout is five boxes now (feat/first-view); the fourteen are docked by a list of the harness's own.
		const a = await visit(Session, browser, 'first', true, null, FIRST.map((id) => ({ id, side: LEFT.includes(id) ? 'left' : 'right' })));
		const seen = {};
		for (const id of FIRST) {
			const side = LEFT.includes(id) ? 'left' : 'right', want = Math.round(table[id] * 16);
			await a.page.click('#lpn_dock_strip_' + side + ' .lpn-dock-tab[aria-controls="' + id + '"]');
			await a.settle(500);
			const w = await widthOf(a, id);
			seen[w] = true;
			ok(id + ' flies out at ' + want + ' px', Math.abs(w - want) <= 1, w + ' px');
			await a.page.keyboard.press('Escape');
			await a.settle(400);
		}
		ok('the fourteen are not one width', Object.keys(seen).length >= 10, Object.keys(seen).join(', '));
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_settings_box"]');
		await a.settle(500);
		await a.page.click('#lpn_settings_box .lpn-setbox-link');
		await a.settle(500);
		const bad = await clipped(a);
		ok('Settings at its width: no label is cut off and no control runs past the pane', bad.length === 0, bad.slice(0, 4).join(' | '));
		const nums = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_labels_node_fields input.lpn-digit')).map((i) => i.getBoundingClientRect().width));
		ok('Decimals, Show and Drop boxes are 90% of their old 2.6 rem', nums.length >= 10 && nums.every((x) => Math.abs(x - 2.34 * 16) <= 0.5),
			nums.length + ' boxes; widths ' + Array.from(new Set(nums.map((x) => x.toFixed(1)))).join(','));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 4. a box the visitor docks keeps the width it had floating; a stored width is theirs ---');
		const b = await visit(Session, browser, 'user', false);
		for (const id of ['lpn_settings_box', 'lpn_library_box', 'lpn_contour_box', 'lpn_find_popup', 'lpn_energy_box', 'lpn_crit_box', 'lpn_hotkeys_popup']) {
			if (id === 'lpn_settings_box') { await openSettings(b); } else { await openBox(b, id); }
			const had = await widthOf(b, id);
			await b.page.click('#' + id + ' .lpn-corner-btn[data-dock="left"]', { timeout: 4000 });
			await b.settle(400);
			const w = await widthOf(b, id);
			ok(id + ' floated at ' + had + ' px docks at ' + Math.max(FLOOR, had) + ' px', Math.abs(w - Math.max(FLOOR, had)) <= 1, w + ' px');
			await b.page.click('#' + id + ' .lpn-corner-btn[data-dock="float"]', { timeout: 4000 });
			await b.page.evaluate((i) => { document.getElementById(i).style.display = 'none'; }, id);
			await b.settle(300);
		}
		// A width of the visitor's own, then docked: kept, and saved as the docked width (it survives a reload).
		await openBox(b, 'lpn_library_box');
		await b.page.evaluate(() => { document.getElementById('lpn_library_box').style.setProperty('width', '470px', 'important'); });
		await b.page.click('#lpn_library_box .lpn-corner-btn[data-dock="right"]', { timeout: 4000 });
		await b.settle(400);
		await b.page.evaluate(() => { document.getElementById('lpn_library_box').style.removeProperty('width'); });
		ok('a floating 470 px Libraries docks at 470 px', Math.abs(await widthOf(b, 'lpn_library_box') - 470) <= 1, await widthOf(b, 'lpn_library_box') + ' px');
		await b.page.reload();
		await b.settle(1500);
		const kept = await b.page.evaluate(() => { const r = document.getElementById('lpn_library_box').getBoundingClientRect(); return r.width ? Math.round(r.width) : null; });
		await b.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_library_box"]').catch(() => {});
		await b.settle(500);
		ok('and the 470 px is the docked width after a reload', Math.abs(await widthOf(b, 'lpn_library_box') - 470) <= 1, await widthOf(b, 'lpn_library_box') + ' px');
		ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();
		const c = await visit(Session, browser, 'stored', true, ['lpn_setbox', JSON.stringify({ left: 300, top: 200, w: null, h: null, open: true, dock: 'right', autohide: true, dockW: 420 })]);
		await c.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_settings_box"]');
		await c.settle(500);
		const w = await widthOf(c, 'lpn_settings_box');
		ok('a stored dock width of 420 px is kept', Math.abs(w - 420) <= 1, w + ' px');
		await c.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

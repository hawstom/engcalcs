// BOX TEXT WRAPS AS NEEDED AND IS NEVER CUT (Tasks 852 and 825; Tom, 2026-11-01: "I would rather that they kept wrapping as needed";
// "We should be addressing the wrapping already"; no ellipsis anywhere in the box style, titles included).
// Real Chromium, English and Spanish, Net1:
//   1. Settings, PC 1366 x 768 and phone 390 x 844 touch: no name is cut (a name takes as many lines as it needs);
//      "Head loss gradient" in Units is fully shown; a box narrower than the two column floors scrolls its pane sideways;
//   2. every box that carries labels (Settings, Properties, Scenario manager, Demand categories), on a PC floating and docked and on
//      a phone floating and docked (273 px): no label or name is cut with no way to reveal it, no element draws an ellipsis,
//      and no title ends in one (a title too long for its bar is clipped, never an ellipsis);
//   3. the Demand categories table has exactly its columns, and no border runs inside its last (unlabeled delete) column.
//   The earlier build's two-line cap on a Settings name is gone: cut is 0 in Spanish too.
//   With BOX852_SHOTS=<prefix> it saves screenshots to /home/haws/webdev/worktrees/_panel/www/img/<prefix>-*.png.
//
//   node dev/lpn-spike/box-label-wrap-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'box-label-wrap-browser-harness';
const SHOTS = process.env.BOX852_SHOTS || '';
const IMG = '/home/haws/webdev/worktrees/_panel/www/img/';
if (process.env.EC_BLW_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_BLW_LOCKED: '1' }) });
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
const { openBox } = require('./dock-boxes.js');

// Every visible name cell of Settings: whether the cell shows all of it, an ellipsis, a tip that only repeats it.
function names(page) {
	return page.evaluate(() => {
		const box = document.getElementById('lpn_settings_box');
		const cells = new Set();
		box.querySelectorAll('.lpn-set-row > :first-child, .lpn-set-name').forEach((c) => cells.add(c));
		const out = { n: 0, cut: [], ellipsis: [], tipped: [], hgl: [] };
		cells.forEach((c) => {
			if (!c.getClientRects().length) { return; }
			const words = c.textContent.replace(/\s*\?\s*$/, '').replace(/\s+/g, ' ').trim();
			if (!words) { return; }
			out.n++;
			const cs = getComputedStyle(c);
			const cutNow = c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1;
			if (cutNow) { out.cut.push(words.slice(0, 40)); }
			if (cs.textOverflow === 'ellipsis') { out.ellipsis.push(words.slice(0, 40)); }
			const tip = [c, c.querySelector('label'), c.querySelector('span')].filter(Boolean).map((x) => (x.getAttribute('data-bs-original-title') || x.title || '').replace(/\s+/g, ' ').trim());
			if (tip.indexOf(words) >= 0) { out.tipped.push(words.slice(0, 40)); }
			if (/^Head loss gradient|^Gradiente de p/.test(words)) { out.hgl.push({ words, cut: cutNow, w: Math.round(c.getBoundingClientRect().width) }); }
		});
		return out;
	});
}

// Any box: text clipped with no way to reveal it, ellipses (computed and typed), and the Demand categories table's columns.
function audit(id) {
	const box = document.getElementById(id);
	if (!box) { return null; }
	const own = (e) => Array.from(e.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
	const out = { w: Math.round(box.getBoundingClientRect().width), cut: [], ellipsis: [], title: '', table: null };
	const seen = new Set();
	const all = Array.from(box.querySelectorAll('*'));
	all.forEach((e) => {
		const r = e.getBoundingClientRect();
		if (!(r.width > 2) || !(r.height > 2) || getComputedStyle(e).visibility === 'hidden') { return; }
		const cs = getComputedStyle(e);
		if (cs.textOverflow === 'ellipsis') { out.ellipsis.push((e.className || e.tagName).toString().slice(0, 40)); }
		if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName) || e.closest('.lpn-setbox-title')) { return; }   // a value is the visitor's to scroll; a title may clip (never with an ellipsis)
		const t = own(e);
		if (!t) { return; }
		let why = null;
		if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && e.scrollWidth > e.clientWidth + 1) { why = 'self-x'; }
		if (!why && (cs.overflowY === 'hidden' || cs.overflowY === 'clip') && e.scrollHeight > e.clientHeight + 1) { why = 'self-y'; }
		if (!why) {
			const range = document.createRange(); range.selectNodeContents(e);
			const tr = range.getBoundingClientRect();
			for (let p = e.parentElement; p && p !== box.parentElement; p = p.parentElement) {
				const pc = getComputedStyle(p), pr = p.getBoundingClientRect();
				if (pc.overflowX !== 'visible') {
					if ((pc.overflowX === 'hidden' || pc.overflowX === 'clip') && tr.right > pr.right + 1 && tr.left < pr.right) { why = 'ancestor'; }
					break;
				}
			}
		}
		if (!why || seen.has(t + why)) { return; }
		seen.add(t + why);
		out.cut.push(t.slice(0, 40) + ' [' + e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 20) + ' ' + why + ']');
	});
	const title = box.querySelector('.lpn-setbox-title');
	out.title = title ? title.textContent.trim() : '';
	if (/…|\.\.\.$/.test(out.title)) { out.ellipsis.push('title text "' + out.title + '"'); }
	const table = box.querySelector('.lpn-demand-table');
	if (table && id === 'lpn_demands_box') {
		const rows = Array.from(table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr'));
		const counts = rows.map((tr) => tr.children.length);
		const heads = table.querySelectorAll(':scope > thead > tr > th').length;
		const lastBorders = [];
		rows.forEach((tr) => {
			const c = tr.lastElementChild;
			[c].concat(Array.from(c.querySelectorAll('*'))).forEach((x) => {
				const s = getComputedStyle(x);
				if (parseFloat(s.borderLeftWidth) > 0 || parseFloat(s.borderRightWidth) > 0) { lastBorders.push(x.tagName); }
			});
			const prev = tr.children[tr.children.length - 2];
			if (prev && parseFloat(getComputedStyle(prev).borderRightWidth) > 0) { lastBorders.push('prev ' + prev.tagName); }
		});
		out.table = { heads, counts, lastBorders, tableW: Math.round(table.getBoundingClientRect().width), bodyW: Math.round(document.getElementById('lpn_demands_body').clientWidth) };
	}
	return out;
}

async function openNet(browser, Session, label, viewport, touch, lang, docks) {
	const a = await Session.open(browser, NAME + '-' + label, Object.assign({ viewport }, touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}));
	await a.context.addInitScript((d) => { window.EC_DEFAULT_DOCKS = d; }, !!docks);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1500);
	return a;
}
async function closeBoxes(a) {
	await a.page.evaluate(() => { document.querySelectorAll('.lpn-popover').forEach((b) => { const x = b.querySelector('.lpn-popover-x'); if (x && b.getBoundingClientRect().width > 0 && !b.classList.contains('lpn-dock-collapsed')) { x.click(); } }); });
	await a.settle(200);
}
async function shot(a, what, id) {
	if (!SHOTS) { return; }
	if (id) { await a.page.evaluate((i) => { const e = document.getElementById(i); if (e) { e.scrollIntoView(); } }, id); }
	await a.settle(300);
	await a.page.screenshot({ path: IMG + SHOTS + '-' + what + '.png' });
}
async function openSettings(a) {
	await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
	await a.settle(900);
}
const BOXES = ['lpn_settings_box', 'lpn_popup', 'lpn_sm_box', 'lpn_demands_box'];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const views = [['pc', { width: 1366, height: 768 }, false, false], ['pc-dock', { width: 1366, height: 768 }, false, true], ['phone', { width: 390, height: 844 }, true, false], ['phone-dock', { width: 390, height: 844 }, true, true]];
	try {
		for (const lang of [null, 'es']) {
			const L = lang || 'en';
			for (const [view, vp, touch, docks] of views) {
				console.log('\n--- ' + view + ' ' + L + ' (' + vp.width + ' x ' + vp.height + ') ---');
				const a = await openNet(browser, Session, view + '-' + L, vp, touch, lang, docks);
				const tag = view + ' ' + L + ': ';
				if (view === 'pc' || view === 'phone') {
					// Settings, name by name.
					await openSettings(a);
					await a.page.evaluate(() => document.getElementById('lpn_set_units_fields').scrollIntoView());
					await a.settle(250);
					const m = await names(a.page);
					console.log('  Settings: ' + m.n + ' names; cut: ' + m.cut.length + (m.cut.length ? ' e.g. ' + m.cut.slice(0, 3).join(' | ') : ''));
					ok(tag + 'Settings names were found', m.n > 40, String(m.n));
					ok(tag + 'no Settings name is cut', m.cut.length === 0, m.cut.slice(0, 4).join(' | '));
					ok(tag + 'the Units "Head loss gradient" name is fully shown', m.hgl.length > 0 && m.hgl.every((h) => !h.cut), JSON.stringify(m.hgl));
					ok(tag + 'Settings: no ellipsis, no tip that only repeats a name', m.ellipsis.length === 0 && m.tipped.length === 0, m.ellipsis.concat(m.tipped).slice(0, 3).join(' | '));
					await shot(a, view + '-' + L + '-settings-units', 'lpn_set_units_fields');
					await a.page.evaluate(() => { const e = document.getElementById('lpn_labels_link_fields'); if (e) { e.scrollIntoView(); } });
					await shot(a, view + '-' + L + '-settings-labels', 'lpn_labels_link_fields');
					if (view === 'pc') {
						// A box narrower than the two column floors scrolls its pane sideways; no name is clipped.
						await a.page.evaluate(() => document.getElementById('lpn_settings_box').style.setProperty('width', '300px', 'important'));
						await a.settle(300);
						const nar = await a.page.evaluate(() => { const c = document.getElementById('lpn_setbox_content'); return { sw: c.scrollWidth, cw: c.clientWidth, ox: getComputedStyle(c).overflowX }; });
						ok(tag + 'at 300 px the pane scrolls sideways rather than clipping a name', nar.sw > nar.cw + 1 && (nar.ox === 'auto' || nar.ox === 'scroll'), JSON.stringify(nar));
						const mn = await names(a.page);
						ok(tag + 'at 300 px no name is cut and no ellipsis', mn.cut.length === 0 && mn.ellipsis.length === 0, mn.cut.slice(0, 3).join(' | '));
					}
					await closeBoxes(a);
				}
				// Every labelled box, as it opens at this view's own width.
				for (const id of BOXES) {
					try {
						await closeBoxes(a);
						if (id === 'lpn_settings_box') { await openSettings(a); } else { await openBox(a, id); }
						await a.settle(600);
						const r = await a.page.evaluate(audit, id);
						const short = id.replace(/^lpn_|_box$/g, '');
						if (!r) { ok(tag + short + ' opened', false); continue; }
						console.log('  ' + short + ' ' + r.w + ' px; cut: ' + r.cut.length + (r.cut.length ? ' ' + r.cut.slice(0, 4).join(' | ') : '') + '; title "' + r.title + '"');
						ok(tag + short + ': no label or name is cut', r.cut.length === 0, r.cut.slice(0, 4).join(' | '));
						ok(tag + short + ': no ellipsis anywhere in the box, its title included', r.ellipsis.length === 0, r.ellipsis.slice(0, 3).join(' | '));
						if (r.table) {
							const t = r.table;
							ok(tag + 'Demand categories: exactly its columns (' + t.heads + ' headings, every row the same)', t.heads === 4 && t.counts.every((c) => c === t.heads), JSON.stringify(t.counts));
							ok(tag + 'Demand categories: no border inside the last column', t.lastBorders.length === 0, t.lastBorders.join(','));
							ok(tag + 'Demand categories: the table fits its box', t.tableW <= t.bodyW + 1, t.tableW + ' vs ' + t.bodyW);
						}
						if (view === 'phone-dock' && id === 'lpn_popup') { await shot(a, 'phone-dock-' + L + '-properties'); }
						if (view === 'pc-dock' && id === 'lpn_demands_box') { await shot(a, 'pc-dock-' + L + '-demand-categories'); }
						if (view === 'pc' && id === 'lpn_demands_box') { await shot(a, 'pc-' + L + '-demand-categories'); }
						if (id === 'lpn_sm_box' && (view === 'phone-dock' || view === 'pc')) { await shot(a, view + '-' + L + '-scenario-manager'); }
					} catch (e) { ok(tag + id + ' opened', false, String(e.message || e).split('\n')[0].slice(0, 100)); }
				}
				await a.close();
			}
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));

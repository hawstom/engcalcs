// SETTINGS FIT (Tom, 2026-10-27): the box is no wider than its content needs; a label row's name line sits tight on
// its own inputs with the larger gap above it; on a phone the jump bar IS the section heading.
// Real Chromium, Settings > Symbology > Node/Link/Customer labels:
//   1. PC (1600 px): Settings opens at 618 px (<= 625), no label row clipped, no sideways scroll, English and German;
//   2. in every state where a row's inputs wrap under its name (a narrowed PC box, a phone) the gap above the name line
//      is larger than the gap between that line and its own inputs; swept over widths so the wrap threshold is exact;
//   3. at 390 px exactly one visible element names the current section (the jump bar; the in-content section heading
//      is hidden), it follows the scroll, and it still jumps; on PC the section heading is shown and the bar is not.
//
//   node dev/lpn-spike/settings-fit-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'settings-fit-browser-harness';
if (process.env.EC_SFIT_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_SFIT_LOCKED: '1' }) });
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

// Gaps of every field row in the three lists: B = name line bottom to its own inputs, A = this row's inputs to the
// next row's name line. A row whose inputs sit beside the name (one line) is counted separately.
function gaps(page) {
	return page.evaluate((lists) => {
		const out = { wrapped: 0, oneLine: 0, bad: [], minA: 1e9, maxB: -1e9 };
		lists.forEach((id) => {
			const list = document.getElementById(id);
			if (!list) { return; }
			const rows = Array.from(list.children).filter((r) => r.offsetParent && r.querySelector(':scope > .lpn-lblgroup') && r.querySelector(':scope > label'));
			rows.forEach((r, i) => {
				const l = r.querySelector(':scope > label').getBoundingClientRect(), g = r.querySelector(':scope > .lpn-lblgroup').getBoundingClientRect();
				if (g.top < l.bottom - 1) { out.oneLine++; return; }
				out.wrapped++;
				const B = Math.round(g.top - l.bottom), nx = rows[i + 1];
				out.maxB = Math.max(out.maxB, B);
				if (!nx) { return; }
				const A = Math.round(nx.querySelector(':scope > label').getBoundingClientRect().top - g.bottom);
				out.minA = Math.min(out.minA, A);
				if (!(A > B)) { out.bad.push(id.replace('lpn_labels_', '') + ':' + r.querySelector('label').textContent.trim().slice(0, 14) + ' A' + A + ' B' + B); }
			});
		});
		return out;
	}, LISTS);
}
function clip(page) {
	return page.evaluate((lists) => {
		const c = document.getElementById('lpn_setbox_content'), cr = c.getBoundingClientRect(), bad = [];
		if (c.scrollWidth > c.clientWidth + 1) { bad.push('pane scrolls sideways ' + c.scrollWidth + '>' + c.clientWidth); }
		lists.forEach((id) => {
			const list = document.getElementById(id);
			if (!list) { return; }
			list.querySelectorAll('label').forEach((l) => { if (l.offsetParent && l.scrollWidth > l.clientWidth + 1) { bad.push('name cut: ' + l.textContent.trim().slice(0, 20)); } });
			list.querySelectorAll(':scope > div .lpn-lblgroup').forEach((g) => {
				const r = g.getBoundingClientRect();
				if (g.offsetParent && (r.right > cr.right + 1 || r.left < cr.left - 1)) { bad.push(id + ' group right ' + Math.round(r.right) + ' > pane ' + Math.round(cr.right)); }
			});
		});
		return bad;
	}, LISTS);
}

async function open(browser, Session, label, viewport, touch, lang) {
	const a = await Session.open(browser, NAME + '-' + label, Object.assign({ viewport }, touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}));
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : ''));
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1200);
	await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
	await a.settle(900);
	await a.page.evaluate(() => document.getElementById('lpn_labels_node_fields').scrollIntoView());
	return a;
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
		for (const lang of [null, 'de']) {
			const lab = lang ? 'pc-' + lang : 'pc';
			console.log('\n--- ' + lab + ' (1600 x 900): width ---');
			const a = await open(browser, Session, lab, { width: 1600, height: 900 }, false, lang);
			const w = await a.page.evaluate(() => Math.round(document.getElementById('lpn_settings_box').getBoundingClientRect().width));
			console.log('  Settings opens at ' + w + ' px (was 672)');
			ok(lab + ': Settings opens no wider than 625 px', w <= 625, w + ' px');
			ok(lab + ': Settings is not narrower than the 618 px Tom measured', w >= 610, w + ' px');
			const bad = await clip(a.page);
			ok(lab + ': no label row clipped, no sideways scroll', bad.length === 0, bad.slice(0, 3).join(' | '));
			if (!lang) {
				const g0 = await gaps(a.page);
				console.log('  at the default width: ' + g0.oneLine + ' one-line rows, ' + g0.wrapped + ' wrapped');
				const heads = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-head')).filter((e) => e.offsetParent).length);
				const jump = await a.page.evaluate(() => { const j = document.getElementById('lpn_setbox_jump'); return !!j && j.offsetParent !== null; });
				ok('pc: the section heading is shown and the jump bar is not', heads >= 1 && !jump, heads + ' headings, bar ' + jump);
				// Sweep the box narrower: wherever a row wraps, A > B; the threshold must not leave a wrapped row without its gap.
				let sweepBad = [], wrappedSeen = 0, sample = '';
				for (let bw = 600; bw >= 320; bw -= 5) {
					await a.page.evaluate((x) => document.getElementById('lpn_settings_box').style.setProperty('width', x + 'px', 'important'), bw);
					await a.settle(60);
					const g = await gaps(a.page);
					wrappedSeen += g.wrapped;
					if (g.wrapped && !sample) { sample = 'first wraps at box ' + bw + ' px: gap above the name line ' + g.minA + ' px, gap to its own inputs ' + g.maxB + ' px'; }
					sweepBad = sweepBad.concat(g.bad.map((x) => bw + ' px: ' + x));
				}
				console.log('  ' + sample);
				ok('pc narrowed 600 to 320 px: some rows wrap (the sweep reaches the wrapped state)', wrappedSeen > 0, String(wrappedSeen));
				ok('pc narrowed 600 to 320 px: the gap above each name line is larger than the gap to its own inputs', sweepBad.length === 0, sweepBad.slice(0, 3).join(' | '));
			}
			await a.close();
		}
		console.log('\n--- phone (390 x 844) ---');
		const p = await open(browser, Session, 'phone', { width: 390, height: 844 }, true, null);
		const g = await gaps(p.page);
		console.log('  wrapped rows ' + g.wrapped + ', gap above the name line (A) min ' + g.minA + ' px, gap name line to inputs (B) max ' + g.maxB + ' px');
		ok('phone: rows were found wrapped', g.wrapped > 10, String(g.wrapped));
		ok('phone: gap above each name line is larger than the gap to its own inputs', g.bad.length === 0, g.bad.slice(0, 3).join(' | '));
		const named = () => p.page.evaluate(() => {
			const box = document.getElementById('lpn_settings_box');
			const heads = Array.from(box.querySelectorAll('.lpn-set-head')).filter((e) => e.getClientRects().length);
			const j = document.getElementById('lpn_setbox_jump'), t = j && j.querySelector('.lpn-setbox-jump-text');
			const cur = document.querySelector('#lpn_setbox_index [aria-current]');
			return { heads: heads.length, bar: j && j.getClientRects().length ? t.textContent.trim() : null, cur: cur ? cur.textContent.trim() : null,
				weight: j ? getComputedStyle(j).fontWeight : null, size: j ? getComputedStyle(j).fontSize : null };
		});
		let n = await named();
		console.log('  bar says "' + n.bar + '", ' + n.heads + ' in-content section headings visible, bar weight ' + n.weight + ' size ' + n.size);
		ok('phone: the in-content section heading is hidden and the bar names the current place', n.heads === 0 && !!n.bar && n.bar === n.cur, JSON.stringify(n));
		ok('phone: the bar reads as a heading (bold, at least the section heading size)', Number(n.weight) >= 700 && parseFloat(n.size) >= 18, n.weight + ' ' + n.size);
		const sub = await p.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-sub')).filter((e) => e.getClientRects().length).length);
		ok('phone: sub-headings such as "Node labels" are still shown', sub > 0, String(sub));
		// Scroll: the bar follows. Jump to the bottom of the pane, then back.
		const before = n.bar;
		await p.page.evaluate(() => { const c = document.getElementById('lpn_setbox_content'); c.scrollTop = c.scrollHeight; });
		await p.settle(500);
		n = await named();
		ok('phone: the bar follows the scroll', !!n.bar && n.bar !== before && n.bar === n.cur, before + ' -> ' + n.bar);
		ok('phone: still exactly one visible element names the place after scrolling', n.heads === 0 && n.bar !== null);
		// Jump: open the list and choose a section.
		await p.page.click('#lpn_setbox_jump');
		await p.settle(300);
		const items = await p.page.$$('#lpn_setbox_index .lpn-setbox-link-sec');
		ok('phone: the bar opens the list of sections', items.length > 3, String(items.length));
		const pick = items[1];
		const pickText = (await pick.textContent()).trim();
		await pick.click();
		await p.settle(700);
		n = await named();
		const listOpen = await p.page.evaluate(() => document.getElementById('lpn_setbox_panes').classList.contains('lpn-jump-open'));
		ok('phone: choosing a section jumps there and names it in the bar', n.bar === pickText && !listOpen, '"' + pickText + '" -> "' + n.bar + '", list open ' + listOpen);
		await p.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));

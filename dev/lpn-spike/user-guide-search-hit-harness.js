// THE USER MANUAL'S SEARCH SHOWS THE HIT (Tom's browser pass, 2026-10-29: searching "Net1").
//   node dev/lpn-spike/user-guide-search-hit-harness.js
// (takes the browser lock itself; never wrap it in that lock).
//   1. Searching "Net1" marks every hit in the shown text (<mark class="lpn-guide-hit">).
//   2. Clicking a chapter's result scrolls the content pane so its first marked hit is on screen.
//   3. A heading that holds the term ("Example on Net1") is an indented row under its own chapter,
//      ranked ahead of chapters with body hits only; clicking it scrolls to that heading.
//   4. Typing is never kept waiting: each keystroke of N, e, t, 1 returns in well under 150 ms and
//      the result list is right at once; the marks follow in the background, the whole set in time.
//   5. A heading that is its chapter's first hit gets no row (the chapter row opens there already).
//   6. A term with markup in it is never parsed as HTML; clearing the search removes every mark.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDESEARCHHIT_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-search-hit-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// Is the element inside the content pane's visible window?
const VISIBLE = `(el) => { const c = document.getElementById('lpn_guide_content').getBoundingClientRect(), r = el.getBoundingClientRect();
	return r.height > 0 && r.top >= c.top - 1 && r.bottom <= c.bottom + 1; }`;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'gsearchhit');
		await a.goto('Looped-Network.php');
		const page = a.page;
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.keyboard.press('Control+k');
		await a.settle(400);
		await page.fill('#lpn_guide_search', 'Net1');
		await a.settle(300);

		console.log('\n0. Typing N, e, t, 1 is not kept waiting');
		await page.fill('#lpn_guide_search', '');
		await a.settle(200);
		await page.focus('#lpn_guide_search');
		for (const ch of 'Net1') {
			const ms = await page.evaluate(() => performance.now());
			await page.keyboard.type(ch);
			const took = await page.evaluate((t) => performance.now() - t, ms);
			ok('key "' + ch + '" handled in under 150 ms', took < 150, Math.round(took) + ' ms');
			await page.waitForTimeout(80);
		}
		const t1 = await page.evaluate(() => { const i = document.getElementById('lpn_guide_search'); const t = performance.now();
			i.value = 'Net'; i.dispatchEvent(new Event('input')); i.value = 'Net1'; i.dispatchEvent(new Event('input'));
			return { ms: Math.round(performance.now() - t), rows: document.querySelectorAll('#lpn_guide_nav a[data-guide-link]').length }; });
		ok('the result list for Net1 is built within 150 ms', t1.ms < 150 && t1.rows > 3, JSON.stringify(t1));
		const t2 = await page.evaluate(() => { const i = document.getElementById('lpn_guide_search'); const t = performance.now();
			i.value = 'n'; i.dispatchEvent(new Event('input')); return Math.round(performance.now() - t); });
		ok('even a one-letter term returns within 150 ms', t2 < 150, t2 + ' ms');
		await page.evaluate(() => { const i = document.getElementById('lpn_guide_search'); i.value = 'Net1'; i.dispatchEvent(new Event('input')); });
		await a.settle(300);

		console.log('\n1. Every hit is marked');
		const marks = await page.evaluate(() => {
			const ms = Array.from(document.querySelectorAll('#lpn_guide_content mark.lpn-guide-hit'));
			return { n: ms.length, texts: Array.from(new Set(ms.map(m => m.textContent.toLowerCase()))),
				bg: ms.length ? getComputedStyle(ms[0]).backgroundColor : '' };
		});
		ok('hits are marked, each exactly the term', marks.n > 3 && marks.texts.length === 1 && marks.texts[0] === 'net1', JSON.stringify(marks));
		ok('the mark has a visible fill', !!marks.bg && marks.bg !== 'rgba(0, 0, 0, 0)', marks.bg);

		console.log('\n2. A chapter result opens on its first hit');
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_nav a[data-guide-link]'))
			.map(x => ({ key: x.getAttribute('data-guide-link'), text: x.firstChild.textContent.trim(),
				level: +x.parentNode.getAttribute('data-level') })));
		const chapters = rows.filter(r => !/^hit-/.test(r.key));
		let tested = 0;
		for (const r of chapters.slice(0, 6)) {
			await page.evaluate((k) => { document.getElementById('lpn_guide_content').scrollTop = 0; }, r.key);
			await page.click('#lpn_guide_nav a[data-guide-link="' + r.key + '"]');
			await a.settle(200);
			const st = await page.evaluate(`(() => { const vis = ${VISIBLE};
				const el = document.querySelector('#lpn_guide_content [data-guide-key="${r.key}"]');
				const first = el && el.querySelector('mark.lpn-guide-hit');
				const cur = document.querySelector('#lpn_guide_content mark.lpn-guide-hit-current');
				return { has: !!first, vis: !!first && vis(first), cur: !!cur && cur === first }; })()`);
			if (st.has) {
				tested++;
				ok('"' + r.text + '": its first hit is on screen and marked current', st.vis && st.cur, JSON.stringify(st));
			}
		}
		ok('at least two chapters with a hit were opened', tested >= 2, String(tested));
		const boxes = chapters.find(r => /^boxes$/i.test(r.text));
		ok('Boxes is a result', !!boxes, JSON.stringify(chapters.map(r => r.text)));

		console.log('\n3. "Example on Net1" is a row under its own chapter');
		const hitRows = rows.filter(r => /^hit-/.test(r.key));
		const ex = hitRows.find(r => /^Example on Net1/.test(r.text));
		ok('a heading row "Example on Net1" exists', !!ex, JSON.stringify(hitRows.length));
		console.log('       "Example on Net1" rows: ' + hitRows.filter(r => /^Example on Net1/.test(r.text)).length);
		const boxesAt = rows.findIndex(r => /^boxes$/i.test(r.text));
		const under = []; for (let j = boxesAt + 1; j < rows.length && rows[j].level === 1 && /^hit-/.test(rows[j].key); j++) { under.push(rows[j].text); }
		ok('under Boxes no two heading rows have identical text', under.length > 3 && new Set(under).size === under.length, under.length + ' rows; e.g. ' + under[0]);
		// No heading row duplicates its chapter's first hit: the chapter row already opens there.
		const dupFirst = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_content .lpn-guide-section')).filter(s => s.style.display !== 'none').map(sec => {
			const mk = sec.querySelector('mark.lpn-guide-hit');
			let h = mk; while (h && h !== sec && !(h.getAttribute && h.getAttribute('data-guide-hit'))) { h = h.parentNode; }
			return h && h !== sec ? sec.getAttribute('data-guide-section') : null; }).filter(Boolean));
		ok('no chapter keeps a heading row for its own first hit', dupFirst.length === 0, JSON.stringify(dupFirst));
		ok('every heading row is indented and sits under a chapter row', hitRows.length > 0 && hitRows.every(r => {
			const i = rows.indexOf(r); let j = i - 1; while (j >= 0 && rows[j].level !== 0) { j--; }
			return r.level === 1 && j >= 0 && !/^hit-/.test(rows[j].key);
		}));
		ok('a chapter with a heading hit ranks first', rows[0] && /^boxes$/i.test(rows[0].text) && rows[1] && rows[1].key.startsWith('hit-'), rows[0] && rows[0].text);
		if (ex) {
			await page.evaluate(() => { document.getElementById('lpn_guide_content').scrollTop = 0; });
			await page.click('#lpn_guide_nav a[data-guide-link="' + ex.key + '"]');
			await a.settle(200);
			const st = await page.evaluate(`(() => { const vis = ${VISIBLE}; const el = document.querySelector('#lpn_guide_content [data-guide-hit="${ex.key}"]');
				return { text: el ? el.textContent.trim().slice(0, 30) : null, vis: !!el && vis(el) }; })()`);
			ok('clicking it brings that heading into view', st.vis && /^Example on Net1/.test(st.text || ''), JSON.stringify(st));
		}

		console.log('\n6. Markup in the term is inert; clearing removes the marks');
		await page.fill('#lpn_guide_search', '<b>x');
		await a.settle(300);
		const inj = await page.evaluate(() => ({ b: document.querySelectorAll('#lpn_guide_content b[data-x], #lpn_guide_content mark b').length,
			marks: document.querySelectorAll('#lpn_guide_content mark.lpn-guide-hit').length }));
		ok('an HTML-looking term makes no element', inj.b === 0, JSON.stringify(inj));
		await page.fill('#lpn_guide_search', 'Net1');
		await a.settle(300);
		const before = await page.evaluate(() => document.querySelectorAll('#lpn_guide_content mark.lpn-guide-hit').length);
		await page.fill('#lpn_guide_search', '');
		await a.settle(300);
		const after = await page.evaluate(() => document.querySelectorAll('#lpn_guide_content mark').length);
		ok('clearing the search removes every mark', before > 0 && after === 0, before + ' -> ' + after);
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-search-hit-harness: ${fails} FAILURE(S)` : '\nuser-guide-search-hit-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();

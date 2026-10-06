// ONE STYLE OF TIP (Tom, 2026-10-06, testing feat/tip-door: "Two styles of tips: make them one").
// Any element with a `title` that Bootstrap does not own gets the BROWSER'S native tooltip, a
// visibly different box that never opens on touch. js/Calculators.lib.js now arms every `[title]`
// the first time a pointer reaches it or focus lands in it (EngCalcs.wireTipDelegation()).
// Real headless Chromium:
//   1. Looped-Network.php with Net3 open and the Tables pane showing, and an ordinary calculator
//      page with the calculators menu open: collect every VISIBLE element whose `title` is
//      non-empty. FAIL if any of them cannot be armed (a pointer arrival leaves its title
//      non-empty, or no Bootstrap tooltip exists on it).
//   2. One representative of each kind (tag + class) is really hovered and must show the styled
//      `.tooltip` with its own text, with the attribute blanked (no native box to double it).
//   3. A title written again after arming reaches the reader (the setTipText trap), and a title
//      removed takes its tip away.
//   4. Nothing is wired up front (lazy), so opening the Tables pane on Net3 costs nothing extra;
//      its open time is printed for comparison.
//
//   node dev/lpn-spike/tip-one-style-browser-harness.js        (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TIPONE_BROWSER_LOCKED';
const NAME = 'tip-one-style-browser-harness';

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

// Runs in the page. Visible elements with a non-empty title that the delegation would arm.
function collectTitled() {
	const out = [];
	document.querySelectorAll('[title]').forEach((el) => {
		const t = el.getAttribute('title');
		if (!t) { return; }
		const tag = el.tagName.toLowerCase();
		if (tag === 'iframe' || tag === 'html' || tag === 'body' || el.closest('svg') || el.hasAttribute('data-ec-native-title')) { return; }
		const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
		if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') { return; }
		out.push(el);
	});
	return out;
}

async function collect(a, label) {
	const page = a.page;
	console.log('\n--- ' + label + ' ---');
	const summary = await page.evaluate((src) => {
		const collect = new Function('return (' + src + ')')();
		const els = collect();
		const kinds = {};
		els.forEach((el) => {
			const k = el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.trim().replace(/\s+/g, '.') : '');
			(kinds[k] = kinds[k] || []).push(el);
		});
		els.forEach((el) => { el.__tipWant = el.getAttribute('title'); });
		window.__tipKinds = kinds;
		return { total: els.length, kinds: Object.keys(kinds).map((k) => [k, kinds[k].length]) };
	}, collectTitled.toString());
	console.log('   ' + summary.total + ' visible titled elements in ' + summary.kinds.length + ' kinds');
	summary.kinds.forEach((k) => console.log('     ' + String(k[1]).padStart(5) + '  ' + k[0]));
	ok(label + ': there are titled elements to check (a harness that finds none proves nothing)', summary.total > 3, String(summary.total));
}

async function armCheck(a, label) {
	const page = a.page;
	// 1. Every one can be armed by a pointer arrival: title blanked, Bootstrap tooltip present.
	const unarmed = await page.evaluate(() => {
		const bad = [];
		Object.keys(window.__tipKinds).forEach((k) => {
			window.__tipKinds[k].forEach((el) => {
				const want = el.__tipWant;
				el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
				const armed = !!(window.bootstrap && bootstrap.Tooltip.getInstance(el));
				const blank = !el.getAttribute('title');
				const cached = el.getAttribute('data-bs-original-title') === want;
				if (!(armed && blank && cached)) { bad.push(k + ' | ' + want.slice(0, 40) + ' | armed=' + armed + ' blank=' + blank + ' cached=' + cached); }
				el.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse' }));
			});
		});
		return bad;
	});
	ok(label + ': no visible titled element is left on the browser\'s native tooltip', unarmed.length === 0, unarmed.slice(0, 4).join(' ;; '));
}

// 2. Really hover one of each kind and read the tooltip drawn.
async function hoverKinds(a, label, only) {
	const page = a.page;
	const kinds = await page.evaluate(() => Object.keys(window.__tipKinds));
	let shown = 0, tried = 0, bad = [];
	for (const k of kinds) {
		if (only && !only(k)) { continue; }
		const pos = await page.evaluate((key) => {
			const list = window.__tipKinds[key];
			for (let i = 0; i < list.length; i++) {
				const el = list[i];
				el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
				const r = el.getBoundingClientRect();
				const x = r.left + r.width / 2, y = r.top + r.height / 2;
				const top = document.elementFromPoint(x, y);
				if (top && (top === el || el.contains(top))) {
					return { x: x, y: y, text: el.__tipWant || '' };
				}
			}
			return null;
		}, k);
		if (!pos) { continue; }
		tried++;
		await page.mouse.move(2, 2);
		await a.settle(150);
		await page.mouse.move(pos.x, pos.y);
		await a.settle(750);
		const got = await page.evaluate(() => {
			const t = document.querySelector('.tooltip.show .tooltip-inner');
			return t ? t.textContent : null;
		});
		if (got !== null && got.replace(/\s+/g, ' ').trim() === pos.text.replace(/\\n\\n|\n\n/g, ' ').replace(/\s+/g, ' ').trim()) { shown++; }
		else { bad.push(k + ' wanted "' + pos.text.slice(0, 40) + '" got ' + JSON.stringify(got && got.slice(0, 40))); }
		await page.mouse.move(2, 2);
		await a.settle(250);
	}
	ok(label + ': one of each kind, really hovered, shows the styled tooltip with its own text (' + shown + '/' + tried + ')', tried >= 2 && bad.length === 0, bad.slice(0, 3).join(' ;; '));
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
		// ---- Looped Network, Net3, Tables pane open ----
		const a = await Session.open(browser, NAME + ':lpn', { viewport: { width: 1500, height: 950 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1500);
		const t0 = Date.now();
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await page.click('#lpn_pane_tab_junctions');
		await page.waitForSelector('#lpn_pane table tbody tr, #lpn_pane [role="row"]', { timeout: 20000 }).catch(() => {});
		const opened = Date.now() - t0;
		await a.settle(1500);
		const cells = await page.evaluate(() => ({
			titled: document.querySelectorAll('#lpn_pane [title]').length,
			armed: document.querySelectorAll('#lpn_pane [data-bs-original-title]').length,
			rows: document.querySelectorAll('#lpn_pane tr').length
		}));
		console.log('   Tables pane opened in ' + opened + ' ms (click to first rows); ' + JSON.stringify(cells));
		ok('Tables pane on Net3 has rows', cells.rows > 50, JSON.stringify(cells));
		ok('the delegation is installed', await page.evaluate(() => EngCalcs._tipDelegated === true));
		await collect(a, 'Looped Network, Net3, Tables pane');
		await hoverKinds(a, 'Looped Network', null);
		await armCheck(a, 'Looped Network, Net3, Tables pane');

		// 3. A title written again after arming reaches the reader; a cleared one takes its tip away.
		const rewrite = await page.evaluate(async () => {
			const el = document.querySelector('#lpn_pane_close') || document.querySelector('button[title], button[data-bs-original-title]');
			if (!el) { return { none: true }; }
			el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
			el.title = 'Rewritten text';
			await new Promise((r) => setTimeout(r, 50));
			const afterWrite = { attr: el.getAttribute('title'), cache: el.getAttribute('data-bs-original-title') };
			el.title = '';
			await new Promise((r) => setTimeout(r, 50));
			return { afterWrite: afterWrite, cacheAfterRemove: el.getAttribute('data-bs-original-title') };
		});
		ok('a title written after arming is moved into the tooltip cache and blanked', !!rewrite.afterWrite && rewrite.afterWrite.cache === 'Rewritten text' && !rewrite.afterWrite.attr, JSON.stringify(rewrite));
		ok('a title cleared (written empty) after arming empties the cache (no stale tip)', rewrite.cacheAfterRemove === '', JSON.stringify(rewrite));
		ok('no uncaught page errors (Looped Network)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		// ---- An ordinary calculator page ----
		const b = await Session.open(browser, NAME + ':calc', { viewport: { width: 1400, height: 900 } });
		await b.goto('Manning-Pipe-Flow.php?ec_nolog=1');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.settle(300);
		await b.page.click('#dropdown-calc').catch(() => {});
		await b.settle(400);
		await collect(b, 'a calculator page, calculators menu open');
		await hoverKinds(b, 'calculator page', (k) => /dropdown-item|ec-fg-x|^a\./.test(k));
		await armCheck(b, 'a calculator page, calculators menu open');
		ok('no uncaught page errors (calculator)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

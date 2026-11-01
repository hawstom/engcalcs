// A BOX OPENS WITH NO LABEL OR VALUE CUT OFF AT ITS OWN WIDTH (Task 825; Tom, 2026-10-24: Settings cut
// "Head loss gradient" with no way to reveal it). Every dockable box, opened on Net1 and on Net3, floating
// and docked, at a PC window (1366x768) and a phone (390x844, touch): its width, and every element that
// holds text and is clipped (overflow hidden or clip, content wider than the element) with no scrollbar
// to reveal it. A scroll container (overflow auto or scroll) is a way to reveal and is listed apart.
//
// NOT NAMED *harness*, so run_harnesses.sh does not pick it up: it FAILS today (Settings at every width; the
// Scenario manager and Properties on a phone; 2026-11-01). Rename it to *-harness.js when Task 852
// (truncation) has decided which cut labels are by design and which must be fixed or must reveal.
//
//   node dev/lpn-spike/box-cut-label-probe.js         prints the table; fails on any cut LABEL
//   EC_SHOTS=<dir> node ...                              also saves box825-<net>-<view>-<mode>-<box>.png there
//   EC_CUT_REPORT=1 node ...                             prints the cut text but never fails
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BCUT_LOCKED';
const NAME = 'box-cut-label-probe';
const SHOTS = process.env.EC_SHOTS || '';
const REPORT_ONLY = !!process.env.EC_CUT_REPORT;
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
const { OPENERS, openBox } = require('./dock-boxes.js');
const IDS = process.env.EC_BOXES ? process.env.EC_BOXES.split(',') : Object.keys(OPENERS);   // EC_BOXES=lpn_settings_box,... and EC_NETS=net1 narrow a run
const NETS = process.env.EC_NETS ? process.env.EC_NETS.split(',') : ['net1', 'net3'];

// Runs in the page. Text-bearing elements of the box that are clipped, split into cut (no way to reveal)
// and scrolls (inside a scroll container). An element counts when it has its own text and either its
// content is wider than itself under overflow hidden/clip, or it sticks out of a hidden/clip ancestor.
function probe(id) {
	const box = document.getElementById(id);
	if (!box) { return null; }
	const br = box.getBoundingClientRect(), cut = [], scrolls = [];
	const own = (e) => Array.from(e.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
	const seen = new Set();
	Array.from(box.querySelectorAll('*')).forEach((e) => {
		const t = own(e) || (e.tagName === 'INPUT' && e.type !== 'checkbox' && e.type !== 'radio' ? String(e.value || '').trim() : '') || (e.tagName === 'SELECT' && e.selectedOptions[0] ? e.selectedOptions[0].textContent.trim() : '');
		if (!t) { return; }
		const r = e.getBoundingClientRect();
		if (!(r.width > 2) || !(r.height > 2)) { return; }   // the Manual's 1 px search anchors are hidden on purpose
		const cs = getComputedStyle(e);
		if (cs.visibility === 'hidden') { return; }
		let why = null;
		const ownClip = cs.overflowX === 'hidden' || cs.overflowX === 'clip';
		if (ownClip && e.scrollWidth > e.clientWidth + 1) { why = 'self'; }
		if (!why && e.tagName !== 'INPUT' && e.tagName !== 'SELECT') {
			// Text wider than the element that holds it, with that element not clipping: the clip is an ancestor's.
			const range = document.createRange(); range.selectNodeContents(e);
			const tr = range.getBoundingClientRect();
			for (let p = e.parentElement; p && p !== box.parentElement; p = p.parentElement) {
				const pc = getComputedStyle(p), pr = p.getBoundingClientRect();
				const clips = pc.overflowX !== 'visible';
				if (clips && tr.right > pr.right + 1 && tr.left < pr.right) {
					why = (pc.overflowX === 'auto' || pc.overflowX === 'scroll') ? 'scroll' : 'ancestor';
					break;
				}
				if (clips) { break; }
			}
		}
		if (!why) { return; }
		const key = t + '|' + why;
		if (seen.has(key)) { return; }
		seen.add(key);
		const item = { t: t.slice(0, 40), tag: e.tagName.toLowerCase(), cls: String(e.className || '').slice(0, 30), label: e.tagName === 'LABEL' || e.tagName === 'TH' || /label|lpn-set-name|name/.test(String(e.className)) || (e.tagName !== 'INPUT' && e.tagName !== 'SELECT' && e.tagName !== 'TEXTAREA' && !/^[-+\d.,\s]+$/.test(t) && !e.closest('pre, td')), why };
		(why === 'scroll' ? scrolls : cut).push(item);
	});
	return { w: Math.round(br.width), left: Math.round(br.left), vw: innerWidth, sw: document.documentElement.scrollWidth, cut, scrolls, docked: box.classList.contains('lpn-docked') };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const rows = [];
	// Floating: no first-view docks, each box opens at its floating width. Docked: EC_DEFAULT_DOCKS, each box
	// flies out of its tab at its docked width (a pane tab pops out as the box).
	const PC = { viewport: { width: 1366, height: 768 } }, PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
	const views = [['pc', 'float', PC, false], ['pc', 'dock', PC, true], ['phone', 'float', PHONE, false], ['phone', 'dock', PHONE, true]];
	try {
		for (const net of NETS) {
			for (const [vname, mode, vopts, docks] of views) {
				const S = await Session.open(browser, NAME + '-' + net + '-' + vname + '-' + mode, vopts);
				await S.context.addInitScript((d) => { window.EC_DEFAULT_DOCKS = d; }, docks);
				await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
				await S.goto('Looped-Network.php?ec_nolog=1');
				await S.answerTrainingPanel().catch(() => {});
				await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				await S.settle(1200);
				await S.openExampleCard(await S.lang('lpn_ex_' + net + '_title'));
				await S.settle(2000);
				// A box is measured as the run leaves it; an analysis's results table (after its own run) is not covered.
				for (const id of IDS) {
					let r = null, err = '';
					try {
						await S.page.evaluate(() => { document.querySelectorAll('.lpn-popover').forEach((b) => { const x = b.querySelector('.lpn-popover-x'); if (x && b.getBoundingClientRect().width > 0 && !b.classList.contains('lpn-dock-collapsed')) { x.click(); } }); });
						await S.settle(200);
						await openBox(S, id);
						await S.settle(500);
						r = await S.page.evaluate(probe, id);
						if (r && r.docked !== docks) { r.note = 'opened ' + (r.docked ? 'docked' : 'floating'); }
						if (SHOTS && r) { await S.page.screenshot({ path: path.join(SHOTS, ['box825', net, vname, mode, id.replace(/^lpn_/, '')].join('-') + '.png') }); }
					} catch (e) { err = String(e.message || e).split('\n')[0].slice(0, 80); }
					rows.push({ net, vname, mode, id, r, err });
				}
				await S.close();
			}
		}
	} finally { await browser.close(); env.stopServer(); }

	if (process.env.EC_CUT_JSON) { fs.writeFileSync(process.env.EC_CUT_JSON, JSON.stringify(rows, null, 1)); }   // every cut text in full
	console.log('\nnet   view  mode   box                width  cut labels / values (no way to reveal) | scrolls inside');
	for (const x of rows) {
		const cutS = x.r ? x.r.cut.map((c) => (c.label ? 'LABEL ' : 'value ') + '"' + c.t + '"').join(', ') : '';
		const scS = x.r ? x.r.scrolls.map((c) => '"' + c.t + '"').slice(0, 3).join(', ') : '';
		console.log([x.net.padEnd(5), x.vname.padEnd(5), x.mode.padEnd(6), x.id.replace(/^lpn_/, '').padEnd(18), (x.r ? String(x.r.w).padStart(5) : '  n/a') + (x.r && x.r.note ? ' [' + x.r.note + ']' : ''), x.err ? 'ERR ' + x.err : (cutS || '-') + ' | ' + (scS || '-') + (x.r && x.r.sw > x.r.vw + 1 ? '  PAGE SCROLLS SIDEWAYS ' + x.r.sw : '')].join(' '));
	}
	console.log('');
	rows.forEach((x) => {
		if (x.err) { ok(x.net + ' ' + x.vname + ' ' + x.mode + ' ' + x.id + ' opened', false, x.err); return; }
		const bad = x.r ? x.r.cut.filter((c) => c.label) : [];
		const pass = !bad.length || REPORT_ONLY;
		if (!pass || bad.length) { ok(x.net + ' ' + x.vname + ' ' + x.mode + ' ' + x.id + ' has no cut label at its own width', pass, bad.map((c) => '"' + c.t + '"').join(', ')); }
	});
	ok('every box opened in every view (' + rows.length + ' cases)', rows.every((x) => x.r));
	console.log('\n' + (failures ? 'FAILED' : 'passed') + ': ' + (checks - failures) + '/' + checks + ' checks');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

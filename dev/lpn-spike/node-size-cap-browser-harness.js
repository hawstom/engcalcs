// THE INITIAL NODE SYMBOL CAP IS 0.25 x THE MEDIAN PIPE (Tom, 2026-10-11, Tweaks: "Initial default:
// Prevent nodes from scaling larger than 0.25 times 50%-ile pipe. (Inexact science). Leave examples
// as they are for now."). Real headless Chromium, the real Open/import control:
//
//   1. A dense network (64 junctions on a 20 m grid, one 1 km feeder) imported from an .inp: the
//      junction's ground diameter is <= 0.25 x the median pipe length (here 5 m). Under the old
//      0.5 x 20th-percentile rule it is 7.8 m at the opening view, so this fails without the fix.
//   2. Net1 and Net3 (shipped examples, stored without the pair): they still draw under the old
//      rule, 0.5 x the 20th-percentile pipe, to the digit.
//   3. A junctions-only .inp (no pipe): the symbol is uncapped, exactly symbolSize / scale.
//
// The ground diameter is read from the page the way a person sees it: two junctions' on-screen
// centres give the view scale, and a junction circle's on-screen width over that scale is its size
// on the ground. Pipe length is the straight distance between its end nodes, which is how the cap
// itself measures it (pLinkLengthWorld).
//
//   node dev/lpn-spike/node-size-cap-browser-harness.js     (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_NODESIZECAP_BROWSER_LOCKED';
const NAME = 'node-size-cap-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s. Re-run alone.'); process.exit(1); }
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
const JUNCTION_R = 0.704;
function percentile(arr, pct) {
	const a = arr.filter((d) => d > 0).sort((x, y) => x - y);
	return a.length ? a[Math.floor((pct / 100) * (a.length - 1))] : 0;
}

async function openLpn(Session, browser, name) {
	const a = await Session.open(browser, NAME + ':' + name);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	return a;
}
// The junction's size on the ground, as drawn right now, and the scale it was drawn at.
function probe(page) {
	return page.evaluate((JR) => {
		const svg = document.querySelector('svg.lpn-svg, #lpn_svg, svg');
		const sym = parseFloat(document.querySelector('[style*="--lpn-sym"]').style.getPropertyValue('--lpn-sym'));
		const hits = Array.from(document.querySelectorAll('.lpn-node-junction, .lpn-node.lpn-node-junction'));
		const centre = (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; };
		return { sym, ground: 2 * JR * sym, count: hits.length, svg: !!svg };
	}, JUNCTION_R);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error(NAME + ': playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		// ---- 1. the dense network, imported ----
		console.log('\n--- 1. dense network from an .inp ---');
		const a = await openLpn(Session, browser, 'dense');
		const inp = fs.readFileSync(path.join(__dirname, 'reference', 'dense-short-pipes.inp'));
		await a.page.setInputFiles('#lpn_inp_file', { name: 'dense-short-pipes.inp', mimeType: 'text/plain', buffer: inp });
		await a.settle(2500);
		const p1 = await probe(a.page);
		console.log('  ground diameter ' + p1.ground.toFixed(3) + ' m, junctions drawn ' + p1.count);
		ok('the dense network is on the map', p1.count >= 64, String(p1.count));
		ok('junction ground diameter <= 0.25 x the median pipe (20 m -> 5 m)', p1.ground <= 0.25 * 20 + 1e-6, p1.ground.toFixed(4));
		await a.close && a.close();

		// ---- 2. shipped examples keep the old rule ----
		console.log('\n--- 2. shipped examples unchanged ---');
		for (const ex of [['Net1', 'lpn_ex_net1_title'], ['Net2-Branford-CT', 'lpn_ex_net2_title']]) {
			const b = await openLpn(Session, browser, ex[0]);
			await b.openExampleCard(await b.lang(ex[1]));
			await b.settle(1800);
			const p = await probe(b.page);
			const f = JSON.parse(fs.readFileSync(path.join(REPO, ex[0] === 'Net1' ? 'dev/water-network-examples' : 'examples', ex[0] + '.lwn'), 'utf8'));
			const byId = {}; f.nodes.forEach((n) => { byId[n.id] = n; });
			const lens = f.links.map((l) => Math.hypot(byId[l.to].x - byId[l.from].x, byId[l.to].y - byId[l.from].y));
			const oldCap = 0.5 * percentile(lens, 20);
			const newCap = 0.25 * percentile(lens, 50);
			const stored = f.settings.symbolCapMultiple === undefined && f.settings.symbolCapPercentile === undefined;
			ok(ex[0] + ': the shipped file states no cap pair (it relies on the default)', stored);
			ok(ex[0] + ': the cap in force is the old 0.5 x 20th-percentile pipe, not the new one',
				Math.abs(oldCap - newCap) > 1e-6 * oldCap, 'old ' + oldCap.toFixed(3) + ' new ' + newCap.toFixed(3));
			ok(ex[0] + ': drawn ground diameter does not exceed the old cap', p.ground <= oldCap + 1e-6, p.ground.toFixed(4) + ' <= ' + oldCap.toFixed(4));
			// Zoomed far out the cap is the whole story: --lpn-sym = capLen / (2 JUNCTION_R).
			for (let i = 0; i < 40; i++) { await b.page.mouse.wheel(0, 300); await b.page.waitForTimeout(30); }
			await b.settle(600);
			const far = await probe(b.page);
			ok(ex[0] + ': zoomed far out, the junction is exactly 0.5 x the 20th-percentile pipe', Math.abs(far.ground - oldCap) <= 1e-4 * oldCap,
				far.ground.toFixed(4) + ' vs ' + oldCap.toFixed(4));
		}

		// ---- 3. no pipes: uncapped ----
		console.log('\n--- 3. a project with no pipes ---');
		const c = await openLpn(Session, browser, 'nopipes');
		const bare = '[JUNCTIONS]\n A 10 0\n B 10 0\n C 10 0\n\n[COORDINATES]\n A 0 0\n B 100 0\n C 0 100\n\n[OPTIONS]\n Units LPS\n Headloss H-W\n\n[END]\n';
		await c.page.setInputFiles('#lpn_inp_file', { name: 'bare.inp', mimeType: 'text/plain', buffer: Buffer.from(bare) });
		await c.settle(2000);
		const p3 = await probe(c.page);
		// View scale from two junctions 100 m apart; an uncapped dot is exactly 7 px across.
		const px = await c.page.evaluate(() => {
			const r = (id) => { const e = document.querySelector('.lpn-node-hit[data-node="' + id + '"]').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2]; };
			const A = r('A'), B = r('B');
			return Math.hypot(B[0] - A[0], B[1] - A[1]);
		});
		const s = px / 100;
		ok('no pipes: no cap, the dot is exactly 7 px (symbolSize / scale on the ground)', Math.abs(p3.ground * s - 7) < 0.01, (p3.ground * s).toFixed(4) + ' px');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

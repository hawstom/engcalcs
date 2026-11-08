// NODE LABELS ON NOVATO IN A REAL CHROMIUM, at the wheel's own notches, round N163 (ROADMAP Task 812,
// Tom, 2026-11-06). Run with:
//   node dev/lpn-spike/label-open-side-browser-harness.js
//   OPEN_SIDE_REF=<git ref>   also lays out that ref's js/looped-network.js and js/lpn-collide.js
//   OPEN_SIDE_SHOTS=<dir> OPEN_SIDE_TAG=<suffix>   saves a picture of notches 12, 13, 14 and 16
//       (OPEN_SIDE_REFTAG=<suffix> also pictures the ref's)
//   OPEN_SIDE_NOTCHES=0,1,...   the notches (default 0 to 16)
//
// Node fields ID, Qb, Z, H, P; the project opened as Tom opens it, Zoom to fit, N163 put in the middle of
// the map, then wheel notches over it. Tom, 2026-11-06: the one-line style should continue on inward, and
// one line is "only very slightly less desirable than multi-line, if at all", so a label that shows all its
// values in a stack and would show them all on one line takes the line (a tie goes to the line).
// ASSERTED: N163 shows all five fields at notches 11 to 16 (a stack or a line) and as one line at 16;
// N161, N164 and N166 are one line at 14; over all notches no fewer node values than REF (the node
// labels may differ by a few: a label hidden for crossing a leader at one notch is shown at another).
// NOT ASSERTED, and printed: N163's own form at 11 to 15. There it is a full stack with every side of
// every one-line candidate blocked by another label (OPEN_SIDE_WHY=1 with a temporary print in
// js/lpn-collide.js shows the sides). Printed for every notch: node labels, values, the forms of
// N161, N163, N164, N166 and N265, and the layout time.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_OPEN_SIDE_BROWSER_LOCKED';
const NAME = 'label-open-side-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
		stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
	});
	if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
	if (r.status === 75) { console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s.'); process.exit(1); }
	process.exit(r.status === null ? 1 : r.status);
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const FILE = 'dev/water-network-examples/Net3-Novato-CA-World.lwn';
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOTCHES = (process.env.OPEN_SIDE_NOTCHES || '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16').split(',').map(Number);
const SHOT_NOTCHES = [12, 13, 14, 16];
const NAMED = ['161', '163', '164', '166', '265'];

async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}

async function layOut(Session, browser, ref, shots) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: { width: 1920, height: 1000 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		let body = ref ? execFileSync('git', ['-C', REPO, 'show', ref + ':js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 }) : await resp.text();
		if (file === 'looped-network.js' && body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const proj = JSON.parse(fs.readFileSync(path.join(REPO, FILE), 'utf8'));
		proj.settings = Object.assign({}, proj.settings, { labelMaxWidth: null });
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(proj));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [NODE_FIELDS, LINK_FIELDS]);
		await a.settle(2000);
		await a.page.evaluate(() => { window.__lpnForm.fit(); window.__lpnForm.centerOn('163'); }); await a.settle(2000);
		const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await a.page.mouse.move(mid.x, mid.y);
		const rows = [];
		let at = 0;
		for (const k of NOTCHES) {
			await wheel(a.page, k - at); at = k;
			await a.settle(1500);
			const v = await a.page.evaluate(() => window.__lpnForm.read(1.5, 3));
			const forms = await a.page.evaluate((ids) => window.__lpnForm.nodeForms(ids), NAMED);
			if (process.env.OPEN_SIDE_WHY) { console.log('WHY ' + k + ': ' + JSON.stringify(await a.page.evaluate(() => { window.__lpnWhy = []; window.__lpnForm.content(); const w = window.__lpnWhy; window.__lpnWhy = null; return [JSON.stringify(window.__lpnForm.inlineTrial())].concat(w); }), null, 1)); }
			const ms = await a.page.evaluate(() => window.__lpnForm.timeContent(3));
			rows.push({ k: k, nodes: v.nodes, values: Object.keys(v.node).reduce((t, id) => t + v.node[id].n, 0), forms: forms, ms: ms, v: v });
			if (shots && SHOT_NOTCHES.indexOf(k) >= 0) {
				fs.mkdirSync(shots.dir, { recursive: true });
				await a.page.screenshot({ path: path.join(shots.dir, 'n163-' + String(k).padStart(2, '0') + '-' + shots.tag + '.png') });
				const r = await a.page.evaluate(() => { const c = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: c.left, y: c.top, width: c.width, height: c.height }; });
				void r;
			}
		}
		return { rows: rows, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const shots = process.env.OPEN_SIDE_SHOTS ? { dir: process.env.OPEN_SIDE_SHOTS, tag: process.env.OPEN_SIDE_TAG || 'x' } : null;
	const ref = process.env.OPEN_SIDE_REF || '';
	try {
		const on = await layOut(Session, browser, '', shots);
		const base = ref ? await layOut(Session, browser, ref, shots && process.env.OPEN_SIDE_REFTAG ? { dir: shots.dir, tag: process.env.OPEN_SIDE_REFTAG } : null) : null;
		ok('no page errors', !on.errors.length, (on.errors[0] || '').slice(0, 200));
		let tn = 0, tv = 0, bn = 0, bv = 0;
		on.rows.forEach((r, i) => {
			const b = base && base.rows[i];
			tn += r.nodes; tv += r.values;
			if (b) { bn += b.nodes; bv += b.values; }
			console.log(`        ${String(r.k).padStart(2)} in: nodes ${b ? b.nodes + ' -> ' : ''}${r.nodes}, values ${b ? b.values + ' -> ' : ''}${r.values}, ${r.ms} ms${b ? ' (was ' + b.ms + ')' : ''}; ` +
				NAMED.map((id) => `N${id} ${b ? b.forms[id] + ' -> ' : ''}${r.forms[id]}`).join('; '));
		});
		console.log(`        all notches: node labels ${base ? bn + ' -> ' : ''}${tn}, node values ${base ? bv + ' -> ' : ''}${tv}`);
		[11, 12, 13, 14, 15, 16].forEach((k) => {
			const r = on.rows.find((x) => x.k === k);
			if (r) { ok(k + ' notches: N163 shows all five fields', /idehp$/.test(r.forms['163']), r.forms['163']); }
		});
		const r16 = on.rows.find((x) => x.k === 16), r14 = on.rows.find((x) => x.k === 14);
		if (r16) { ok('16 notches: N163 shows all five fields on one line', r16.forms['163'] === 'line idehp', r16.forms['163']); }
		if (r14) { ok('14 notches: N161, N164 and N166 show all five fields on one line', ['161', '164', '166'].every((id) => r14.forms[id] === 'line idehp'), ['161', '164', '166'].map((id) => r14.forms[id]).join(' / ')); }
		if (base) { ok('over all notches, no fewer node values than ' + ref, tv >= bv, `${bn} -> ${tn} labels, ${bv} -> ${tv} values`); }
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

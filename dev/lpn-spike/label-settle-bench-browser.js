// THE LABEL PASS'S COST AND ITS SPOTS, MASTER AGAINST THIS BRANCH, IN A REAL CHROMIUM (ROADMAP Task 812, round 6).
// Both trees are open at once and take the same wheel notch in turn, so machine load cancels; each notch is
// timed by the page's own ?debug=perf "labelSettle" line (a fresh settle, caches as a wheel leaves them), the
// number a reader waits for. Run with:
//   node dev/lpn-spike/label-settle-bench-browser.js
//   SETTLE_ONLY=novato,n600,net3  SETTLE_RUNS=2  SETTLE_SHOTS=<dir> SETTLE_TAG=r6  SETTLE_OUT=<json>
// Also prints what the branch shows against master per pipe label: hidden where master shows, and moved to
// a leader without gaining a field. SETTLE_JSON=<file> writes the per-notch states.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SETTLE_BENCH_LOCKED';
const NAME = 'label-settle-bench-browser';
if (process.env[LOCK_ENV] !== '1') {
	const r = spawnSync('flock', ['-E', '75', '-w', '600', LOCK_FILE, process.execPath, __filename], { stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
	process.exit(r.status === null ? 1 : (r.status === 75 ? 1 : r.status));
}
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOVATO = 'dev/water-network-examples/Net3-Novato-CA-World.lwn', NET3 = 'dev/water-network-examples/Net3.lwn', N600 = 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn';
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const SCENES = [
	{ key: 'novato', file: NOVATO, view: { width: 1920, height: 1000 }, around: '163', notches: range(0, 16), named: ['180', '181', '185', '203', '205'] },
	{ key: 'net3', file: NET3, view: { width: 390, height: 844 }, around: null, notches: range(0, 12), named: [] },
	{ key: 'n600', file: N600, view: { width: 1920, height: 1000 }, around: null, notches: range(0, 9), named: [] }
];
const SHOTN = { novato: [5, 9], n600: [9], net3: [0] };

async function open(Session, browser, sc, tree) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.view });
	const lines = [];
	a.page.on('console', (m) => { const t = m.text(); if (t.indexOf('labelSettle') >= 0) { lines.push(t); } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		const ref = tree === 'master' ? (process.env.SETTLE_BASE || 'master') : process.env.SETTLE_REF;
		let body = ref ? execFileSync('git', ['-C', REPO, 'show', ref + ':js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 }) : await resp.text();
		if (tree !== 'master' && process.env.SETTLE_MUT) { JSON.parse(process.env.SETTLE_MUT).forEach((m) => { if (body.indexOf(m[0]) < 0) { return; } body = body.split(m[0]).join(m[1]); }); }
		if (file === 'looped-network.js' && body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	await a.goto('Looped-Network.php?ec_nolog=1&debug=perf');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	const proj = JSON.parse(fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
	proj.settings = Object.assign({}, proj.settings, { labelMaxWidth: null });
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(proj));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 120000 });
	await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [NODE_FIELDS, LINK_FIELDS]);
	await a.settle(2000);
	return { a, lines, tree };
}
async function notch(h, sc, k) {
	h.lines.length = 0;
	await h.a.page.evaluate(([n, around]) => { if (n === 0) { window.__lpnForm.fitNotch(0, around); } else { window.__lpnForm.zoomStep(around); } }, [k, sc.around]);
	// the settle is scheduled 120 ms after the view change; wait for its line, then until no more come (they are summed)
	for (let i = 0; i < 200 && !h.lines.length; i++) { await h.a.page.waitForTimeout(100); }
	let n = -1;
	while (n !== h.lines.length) { n = h.lines.length; await h.a.page.waitForTimeout(700); }
	const ms = h.lines.reduce((t, l) => t + parseFloat((l.match(/labelSettle ([\d.]+)ms/) || [0, 0])[1]), 0);
	if (process.env.SETTLE_DUMP && +process.env.SETTLE_DUMP === k) { h.lines.forEach((l) => console.log('LINE ' + h.tree + ' ' + k + ' ' + l)); }
	if (process.env.SETTLE_EVAL && h.tree !== 'master') { console.log('EVAL ' + k + ' ' + JSON.stringify(await h.a.page.evaluate(process.env.SETTLE_EVAL))); }
	const states = await h.a.page.evaluate(() => window.__lpnForm.pipeStates());
	const strikes = await h.a.page.evaluate(() => window.__lpnForm.leaderStrikes().length);
	return { ms, states, strikes };
}
const med = (xs) => { const s = xs.filter((x) => x === x).sort((p, q) => p - q); return s.length ? s[s.length >> 1] : NaN; };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const RUNS = +(process.env.SETTLE_RUNS || 2), only = process.env.SETTLE_ONLY ? process.env.SETTLE_ONLY.split(',') : null;
	const all = {}; let exit = 0;
	try {
		for (const sc of SCENES.filter((q) => !only || only.indexOf(q.key) >= 0)) {
			const res = { master: {}, branch: {} }, ms = { master: {}, branch: {} };
			for (let run = 0; run < RUNS; run++) {
				const hm = await open(Session, browser, sc, 'master'), hb = await open(Session, browser, sc, 'branch');
				const order = run % 2 ? ['branch', 'master'] : ['master', 'branch'];
				for (const k of sc.notches) {
					for (const t of order) {
						const h = t === 'master' ? hm : hb, r = await notch(h, sc, k);
						(ms[t][k] = ms[t][k] || []).push(r.ms);
						if (run === 0) { res[t][k] = r; }
					}
					if (process.env.SETTLE_SHOTS && run === 0 && (SHOTN[sc.key] || []).indexOf(k) >= 0) {
						fs.mkdirSync(process.env.SETTLE_SHOTS, { recursive: true });
						for (const t of order) {
							await (t === 'master' ? hm : hb).a.page.screenshot({ path: path.join(process.env.SETTLE_SHOTS, `${sc.key}-notch${k}-${t}-${process.env.SETTLE_TAG || 'x'}.png`) });
						}
					}
				}
				await hm.a.close(); await hb.a.close();
			}
			let tm = 0, tb = 0, hidden = [], noGain = [], dLead = 0, vm = 0, vb = 0, st = [0, 0];
			for (const k of sc.notches) {
				const m = med(ms.master[k]), b = med(ms.branch[k]); tm += m; tb += b;
				const S = res.master[k].states, B = res.branch[k].states; st[0] += res.master[k].strikes; st[1] += res.branch[k].strikes;
				const h = [], ng = [];
				Object.keys(S).forEach((id) => {
					const sm = S[id], sb = B[id]; if (!sb) { return; }
					vm += sm.values; vb += sb.values;
					if (sm.shown && !sb.shown) { h.push('L' + id + (process.env.SETTLE_WHY ? '[' + sb.why + ']' : '')); }
					if (sb.shown && sb.leader && !sm.leader && sm.shown && sb.values <= sm.values) { ng.push('L' + id); }
				});
				hidden.push([k, h]); noGain.push([k, ng]);
				console.log(`  ${sc.key} ${String(k).padStart(2)}: settle master ${m.toFixed(0)} branch ${b.toFixed(0)} ms (${((b / m - 1) * 100).toFixed(0)}%); runs m ${ms.master[k].map((x) => x.toFixed(0))} b ${ms.branch[k].map((x) => x.toFixed(0))}; hidden-vs-master ${h.length}${h.length ? ' ' + h.slice(0, 12).join(',') : ''}; leader-no-gain ${ng.length}${ng.length ? ' ' + ng.slice(0, 12).join(',') : ''}; strikes ${res.master[k].strikes}->${res.branch[k].strikes}`);
			}
			const nh = hidden.reduce((t, x) => t + x[1].length, 0), nn = noGain.reduce((t, x) => t + x[1].length, 0);
			console.log(`TOTAL ${sc.key}: settle master ${tm.toFixed(0)} branch ${tb.toFixed(0)} ms (${((tb / tm - 1) * 100).toFixed(1)}%); pipe fields ${vm} -> ${vb}; hidden-vs-master ${nh}; leader-no-gain ${nn}; strikes ${st[0]}->${st[1]}`);
			all[sc.key] = { res, ms, hidden, noGain };
		}
	} finally { await browser.close(); env.stopServer(); }
	if (process.env.SETTLE_JSON) { fs.writeFileSync(process.env.SETTLE_JSON, JSON.stringify(all)); }
	process.exit(exit);
}
main().catch((e) => { console.error(e); process.exit(1); });

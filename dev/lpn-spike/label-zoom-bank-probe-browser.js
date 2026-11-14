// DOES THE ZOOM BANK HOLD ON THIS BRANCH, WHAT IT COSTS, AND DOES A LABEL JUMP WITHOUT IT (ROADMAP Task 812, round 7).
// Zoom to fit, in N wheel notches, back out N: the page's own ?debug=perf line says "bank hit" or "bank miss", and a
// signature of every drawn label (text, position, visibility) is compared between the first visit and the return,
// then with the bank switched off for a third lap. Run with:
//   node dev/lpn-spike/label-zoom-bank-probe-browser.js      (ZB_ONLY=novato,n600  ZB_N=8)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ZOOM_BANK_LOCKED';
const NAME = 'label-zoom-bank-probe-browser';
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

const sig = () => window.__lpnForm.pipeStates && (function () {
	const out = []; document.querySelectorAll('#lpn_canvas text').forEach((t) => { if (!t.textContent || !t.checkVisibility({ visibilityProperty: true, opacityProperty: true })) { return; } const b = t.getBoundingClientRect(); out.push(t.textContent + '@' + Math.round(b.x) + ',' + Math.round(b.y)); });
	return out.sort().join('|');
})();
async function step(h, dir, around) {
	h.lines.length = 0;
	await h.a.page.evaluate(([d, around]) => { if (d > 0) { window.__lpnForm.zoomStep(around); } else { window.__lpnForm.zoomOutStep(around); } }, [dir, around]);
	for (let i = 0; i < 200 && !h.lines.length; i++) { await h.a.page.waitForTimeout(100); }
	let n = -1; while (n !== h.lines.length) { n = h.lines.length; await h.a.page.waitForTimeout(700); }
	const ms = h.lines.reduce((t, l) => t + parseFloat((l.match(/labelSettle ([\d.]+)ms/) || [0, 0])[1]), 0);
	const all = h.all.join(' ');
	const hit = /bank hit/.test(all), s = await h.a.page.evaluate(sig);
	h.all.length = 0;
	return { ms, hit, s };
}
SCENES.forEach((q) => { if (!q.around) { q.around = q.key === 'net3' ? '184' : '261'; } });
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const N = +(process.env.ZB_N || 8), only = process.env.ZB_ONLY ? process.env.ZB_ONLY.split(',') : null;
	try {
		for (const sc of SCENES.filter((q) => !only || only.indexOf(q.key) >= 0)) {
			const h = await open(Session, browser, sc, 'branch');
			h.all = []; h.a.page.on('console', (m) => { h.all.push(m.text()); });
			await h.a.page.evaluate((around) => window.__lpnForm.fitNotch(0, around), sc.around);
			await h.a.page.waitForTimeout(3000); h.all.length = 0;
			const first = [], back = [], off = [];
			for (let i = 0; i < N; i++) { first.push(await step(h, 1, sc.around)); }
			for (let i = 0; i < N; i++) { back.push(await step(h, -1, sc.around)); }
			// back[i] is the view at notch N-1-i; first[N-2-i] is the same view (first visit); the last back is notch 0
			let same = 0, diff = [], hits = 0, msB = 0, msF = 0;
			back.forEach((b, i) => { const j = N - 2 - i; hits += b.hit ? 1 : 0; msB += b.ms; if (j >= 0) { msF += first[j].ms; if (b.s === first[j].s) { same++; } else { diff.push(j + 1); } } });
			console.log(`${sc.key}: out ${N} in ${N}: return hits ${hits}/${N}; return ${msB.toFixed(0)} ms vs first visit ${first.reduce((t, x) => t + x.ms, 0).toFixed(0)} ms; same drawing as first visit ${same}/${N - 1}${diff.length ? ' differs at notch ' + diff.join(',') : ''}`);
			console.log('  bank: ' + JSON.stringify(await h.a.page.evaluate(() => window.__lpnForm.bankStats())));
			await h.a.page.evaluate(() => window.__lpnForm.bankSwitch(false));
			for (let i = 0; i < N; i++) { off.push(await step(h, 1, sc.around)); }
			// off[i] is notch N+... wait: back ended at notch 0; off visits notches 1..N again
			let same2 = 0, diff2 = [], msO = 0;
			off.forEach((o, i) => { msO += o.ms; if (o.s === first[i].s) { same2++; } else { diff2.push(i + 1); } });
			console.log(`  bank off, third lap in: ${msO.toFixed(0)} ms; same drawing as first visit ${same2}/${N}${diff2.length ? ' differs at notch ' + diff2.join(',') : ''}`);
			await h.a.close();
		}
	} finally { await browser.close(); env.stopServer(); }
}
main().catch((e) => { console.error(e); process.exit(1); });

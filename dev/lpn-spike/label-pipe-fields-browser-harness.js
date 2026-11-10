// PIPE LABELS PREFER ALL THEIR FIELDS ON A LEADER TO SOME ALONG THE PIPE, IN A REAL CHROMIUM (ROADMAP Task
// 812, round 5; Tom, 2026-11-09: *"It's bad that pipe leaders are so eager to get along the pipes that they
// shed properties when there is convenient open space to show everything on a leader."*). Run with:
//   node dev/lpn-spike/label-pipe-fields-browser-harness.js
//   PIPE_FIELDS_SHOTS=<dir> PIPE_FIELDS_TAG=<suffix>   saves the pictures Tom is shown
//   PIPE_FIELDS_MASTER=1   also lays the views out with master's js (the pictures' "before"), printed only
// Every view is laid out twice from the same files, the rule on and the rule off (LPN_LEVEL_FULL_FIRST),
// at one fixed scale each: Novato at wheel notches about N163 (1920 x 1000 and a 390 x 844 phone), the
// 600-junction network at notch 9, Net3 on the phone. Link fields ID, Q, V; node fields ID, Qb, Z, H, P.
// ASSERTED: no view shows fewer pipe fields with the rule than without it; over all views more; no more
// pipe labels hidden; no more labels shed; no more drawn leaders through another label; the time of the
// label pass at most doubles (the price of the rule, Tom: a large gain per percent of pass time).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PIPE_FIELDS_BROWSER_LOCKED';
const NAME = 'label-pipe-fields-browser-harness';

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
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOVATO = 'dev/water-network-examples/Net3-Novato-CA-World.lwn', NET3 = 'dev/water-network-examples/Net3.lwn', N600 = 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn';
const SHOTS = process.env.PIPE_FIELDS_SHOTS ? { dir: process.env.PIPE_FIELDS_SHOTS, tag: process.env.PIPE_FIELDS_TAG || 'x' } : null;
// notches to take, and where to take the pictures (a clip of the window about a named pipe's middle, or the whole window)
const SCENES = [
	{ key: 'novato-desktop', file: NOVATO, view: { width: 1920, height: 1000 }, around: '163', notches: (process.env.PIPE_FIELDS_NOTCHES || '4,6,8,9,10,11,12,13,14,16').split(',').map(Number), named: ['180', '233', '185', '181'], shots: [9, 12, 14] },
	{ key: 'novato-phone', file: NOVATO, view: { width: 390, height: 844 }, around: '163', notches: [6, 9, 12], named: [], shots: [] },
	{ key: 'n600-desktop', file: N600, view: { width: 1920, height: 1000 }, around: null, notches: [3, 6, 9], named: [], shots: [9] },
	{ key: 'net3-phone', file: NET3, view: { width: 390, height: 844 }, around: null, notches: [0, 3, 6], named: [], shots: [6] }
];

async function layOut(Session, browser, sc, mode) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.view });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		let body = mode === 'master' ? execFileSync('git', ['-C', REPO, 'show', 'master:js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 }) : await resp.text();
		if (file === 'looped-network.js') {
			if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
			if (mode === 'on' && process.env.PIPE_FIELDS_MUT) { JSON.parse(process.env.PIPE_FIELDS_MUT).forEach((m) => { if (body.indexOf(m[0]) < 0) { throw new Error('no ' + m[0]); } body = body.split(m[0]).join(m[1]); }); }
			if (mode === 'off') { body = body.replace('var LPN_LEVEL_FULL_FIRST = true', 'var LPN_LEVEL_FULL_FIRST = false'); }
		}
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
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
		const rows = [];
		for (const k of sc.notches) {
			await a.page.evaluate(([n, around]) => { window.__lpnForm.fitNotch(n, around); window.__lpnForm.content(); }, [k, sc.around]);
			await a.settle(1500);
			const pf = await a.page.evaluate(() => window.__lpnForm.pipeFields());
			const strikes = await a.page.evaluate(() => window.__lpnForm.leaderStrikes().length);
			const named = sc.named.length ? await a.page.evaluate((ids) => window.__lpnForm.named(ids), sc.named) : {};
			const ms = await a.page.evaluate(() => window.__lpnForm.timeContent(3));
			rows.push({ k: k, pf: pf, strikes: strikes, named: named, ms: ms });
			if (SHOTS && sc.shots.indexOf(k) >= 0 && mode !== 'off') {
				fs.mkdirSync(SHOTS.dir, { recursive: true });
				await a.page.screenshot({ path: path.join(SHOTS.dir, sc.key + '-notch' + k + '-' + (mode === 'master' ? 'master' : 'branch') + '-' + SHOTS.tag + '.png') });
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
	const sum = (rows, f) => rows.reduce((t, r) => t + f(r), 0);
	const tot = { on: { rows: 0, shed: 0, hidden: 0, strikes: 0, ms: 0, shown: 0, leaders: 0, asked: 0 }, off: { rows: 0, shed: 0, hidden: 0, strikes: 0, ms: 0, shown: 0, leaders: 0, asked: 0 }, master: { rows: 0, shed: 0, hidden: 0, strikes: 0, ms: 0, shown: 0, leaders: 0, asked: 0 } };
	function add(t, rows) { tot[t].rows += sum(rows, (r) => r.pf.rows); tot[t].shed += sum(rows, (r) => r.pf.shed); tot[t].hidden += sum(rows, (r) => r.pf.hidden); tot[t].strikes += sum(rows, (r) => r.strikes); tot[t].ms += sum(rows, (r) => r.ms); tot[t].shown += sum(rows, (r) => r.pf.shown); tot[t].leaders += sum(rows, (r) => r.pf.leaders); tot[t].asked += sum(rows, (r) => r.pf.asked); }
	try {
		for (const sc of SCENES.filter((q) => !process.env.PIPE_FIELDS_ONLY || process.env.PIPE_FIELDS_ONLY.split(',').indexOf(q.key) >= 0)) {
			const on = await layOut(Session, browser, sc, 'on'), off = await layOut(Session, browser, sc, 'off');
			const mas = process.env.PIPE_FIELDS_MASTER ? await layOut(Session, browser, sc, 'master') : null;
			ok(sc.key + ': no page errors', !on.errors.length && !off.errors.length, (on.errors[0] || off.errors[0] || '').slice(0, 200));
			add('on', on.rows); add('off', off.rows); if (mas) { add('master', mas.rows); }
			on.rows.forEach((r, i) => {
				const b = off.rows[i], m = mas && mas.rows[i];
				console.log(`        ${sc.key} ${String(r.k).padStart(2)}: fields shown ${m ? m.pf.rows + ' (master) ' : ''}${b.pf.rows} -> ${r.pf.rows} of ${r.pf.asked}, shed ${b.pf.shed} -> ${r.pf.shed}, hidden ${b.pf.hidden} -> ${r.pf.hidden}, leaders ${b.pf.leaders} -> ${r.pf.leaders}, strikes ${b.strikes} -> ${r.strikes}, ${b.ms} -> ${r.ms} ms` +
					sc.named.map((id) => { const n = r.named[id], nb = b.named[id]; const f = (x) => !x ? '?' : (x.shown ? (x.level ? 'level ' : 'along ') + x.values + (x.leader ? ' ldr' : '') : 'hid'); return `; L${id} ${f(nb)} -> ${f(n)}`; }).join(''));
				ok(sc.key + ' ' + r.k + ': pipe fields shown not fewer', r.pf.rows >= b.pf.rows, `${b.pf.rows} -> ${r.pf.rows}`);
				ok(sc.key + ' ' + r.k + ': no more pipe labels hidden', r.pf.hidden <= b.pf.hidden, `${b.pf.hidden} -> ${r.pf.hidden}`);
				ok(sc.key + ' ' + r.k + ': no more leaders through a label', r.strikes <= b.strikes, `${b.strikes} -> ${r.strikes}`);
			});
		}
		console.log(`        TOTAL pipe fields shown ${process.env.PIPE_FIELDS_MASTER ? tot.master.rows + ' (master) ' : ''}${tot.off.rows} -> ${tot.on.rows}; shed ${tot.off.shed} -> ${tot.on.shed}; hidden ${tot.off.hidden} -> ${tot.on.hidden}; leaders ${tot.off.leaders} -> ${tot.on.leaders}; strikes ${tot.off.strikes} -> ${tot.on.strikes}; pass ${tot.off.ms} -> ${tot.on.ms} ms`);
		ok('over all views, more pipe fields shown', tot.on.rows > tot.off.rows, `${tot.off.rows} -> ${tot.on.rows}`);
		ok('over all views, fewer pipe labels shed', tot.on.shed < tot.off.shed, `${tot.off.shed} -> ${tot.on.shed}`);
		ok('the label pass costs at most double the time', tot.on.ms <= 2 * tot.off.ms, `${tot.off.ms} -> ${tot.on.ms} ms`);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

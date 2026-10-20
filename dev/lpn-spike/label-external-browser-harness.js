// A DROPPED LABEL GOES OUT TO THE FREE GROUND, ON A LEADER (Task 539; Tom, 2026-10-20), in a real
// Chromium, at real wheel notches, read off the drawing. Run with:
//   node dev/lpn-spike/label-external-browser-harness.js
//   LABEL_EXT_REFS=master   lays out that ref's js/looped-network.js and js/lpn-collide.js and prints
//       its counts beside ours (default: master; the ref must share this tree's PHP, so merge it first).
//       'leader' is always laid out too: this file with the external stage cut out, which is
//       feat/label-leader's placement on today's master.
//   LABEL_EXT_SHOTS=<dir>   saves Tom's Net1 view and a Net3 view as PNGs
//   LABEL_EXT_SCENES=net1tom,net1,net3,novato   (default: net1tom,net3)
//
// Tom, 2026-10-20: *"we are inching forward, but we have still not found a way to approximate human
// artistic arrangement of leaders, and this makes us drop things that don't need to be dropped at
// network edges."* His hand arrangement of Net1 puts nearly every label out in the open ground
// round the network on a straight leader, no two leaders crossing. Collide.placeExternalLabels()
// does that for every label the interior passes dropped.
//
// Asserted, on this branch:
//   * Net1 at Tom's view (his screenshots' scale, pipe 11 about 90 px): no label of a node or pipe
//     on screen is hidden -- there is open ground round Net1 for every one of them;
//   * no leader drawn to an external label crosses any other leader drawn, in any view;
//   * no view shows fewer labels than the reference refs;
//   * every leader belongs to a drawn label and is no longer than 220 px (as
//     label-leader-bound-browser-harness.js holds);
//   * the content pass at the last view of each scene is within BUDGET_FRAC of the first ref's
//     (median of five), plus BUDGET_MS for timer noise.
// Printed, for each mode: labels shown, labels hidden in view, leaders, leader crossings (all
// pairs drawn), external labels, and the content pass's time.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_EXTERNAL_LOCKED';
const NAME = 'label-external-browser-harness';

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

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const CUT = 'placeExternalDroppedLabels(obs, nodeLabels, nodePlaced, labels, placed, holders, fs);';
const TOL_PX = 1.5, AMBIG_PX = 3, LEN_MAX_PX = 220;
// The pass-time budget: the external stage may add this fraction of the reference's content pass.
const BUDGET_FRAC = 0.15, BUDGET_MS = 6;
const NET3_NODE = ['id', 'pressure', 'demand', 'elev'], NET3_LINK = ['id', 'flow', 'velocity'];
const SCENES = [
	// Tom's screenshots of 2026-10-20: Net1, node ID, Qb, Z, P and pipe ID, Q, V, pipe 11 about 90 px.
	{ key: 'net1tom', name: "Net1 at Tom's view", cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'],
		link: ['id', 'flow', 'velocity'], outToPipe: { id: '11', px: 90 }, notches: [0], viewport: { width: 1100, height: 750 }, noneHidden: true, shot: 'labels-margin-net1.png' },
	{ key: 'net1', name: 'Net1 (gallery, US), wheeled out', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'],
		link: ['flow'], step: true, notches: [-4, -14] },
	{ key: 'net3', name: 'Net3 (gallery, gpm)', cardKey: 'lpn_ex_net3_title', node: NET3_NODE, link: NET3_LINK, notches: [6, 9], shot: 'labels-margin-net3.png', shotAt: 6 },
	{ key: 'novato', name: 'Net3 on the world map near Novato', file: 'dev/water-network-examples/Net3-Novato-CA-World.lwn', fit: true, noMax: true,
		node: NET3_NODE, link: NET3_LINK, notches: [0, 3] }
].filter((sc) => (process.env.LABEL_EXT_SCENES || 'net1tom,net3').split(',').indexOf(sc.key) >= 0);

async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}
function refSource(ref, file) {
	return execFileSync('git', ['-C', REPO, 'show', ref + ':js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 });
}
function cross(p, q) {
	function c(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
	const d1 = c(p.a.x, p.a.y, p.b.x, p.b.y, q.a.x, q.a.y), d2 = c(p.a.x, p.a.y, p.b.x, p.b.y, q.b.x, q.b.y),
		d3 = c(q.a.x, q.a.y, q.b.x, q.b.y, p.a.x, p.a.y), d4 = c(q.a.x, q.a.y, q.b.x, q.b.y, p.b.x, p.b.y);
	return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

async function layOut(Session, browser, sc, ref, shots) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.viewport || { width: 1920, height: 1000 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	if (process.env.LABEL_EXT_INIT && !ref) { await a.page.addInitScript(process.env.LABEL_EXT_INIT); }
	let hooked = 0;
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		let body = (ref && ref !== 'leader') ? refSource(ref, file) : await resp.text();
		if (ref === 'leader' && file === 'looped-network.js') {
			if (body.split(CUT).length !== 2) { throw new Error('the external stage call is not in looped-network.js exactly once'); }
			body = body.replace(CUT, '');
		} else if (!ref && file === 'looped-network.js') {
			body = body.replace(CUT, 'var __t0 = performance.now(); ' + CUT + ' window.__extMs = (window.__extMs || 0) + performance.now() - __t0; window.__extN = (window.__extN || 0) + 1;');
		}
		if (file === 'looped-network.js' && body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); hooked++; }
		await route.fulfill({ response: resp, body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1' + (process.env.LABEL_EXT_DEBUG && !ref ? '&debug=perf' : ''));
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		if (sc.cardKey) {
			await a.openExampleCard(await a.lang(sc.cardKey));
		} else {
			const raw = JSON.parse(fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
			if (sc.noMax) { raw.settings = Object.assign({}, raw.settings, { labelMaxWidth: null }); }
			await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(raw));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		}
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [sc.node, sc.link]);
		await a.settle(2000);
		if (sc.fit) { await a.page.evaluate(() => window.__lpnForm.fit()); await a.settle(2000); }
		const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await a.page.mouse.move(mid.x, mid.y);
		if (sc.outToPipe) {
			const len = await a.page.evaluate((id) => window.__lpnForm.pipePx(id), sc.outToPipe.id);
			const out = Math.round(Math.log(len / sc.outToPipe.px) / Math.log(1.1));
			for (let i = 0; i < Math.abs(out); i++) { await wheel(a.page, out > 0 ? -1 : 1); await a.settle(500); }
			await a.settle(1500);
		}
		const views = [];
		let at = 0;
		for (const k of sc.notches) {
			if (sc.step) {
				for (let i = 0; i < Math.abs(k - at); i++) { await wheel(a.page, k > at ? 1 : -1); await a.settle(900); }
			} else { await wheel(a.page, k - at); }
			at = k;
			await a.settle(1500);
			const v = await a.page.evaluate(([tol, amb]) => window.__lpnForm.read(tol, amb), [TOL_PX, AMBIG_PX]);
			if (process.env.LABEL_EXT_PROBE && !ref) {
				const pr = JSON.stringify(await a.page.evaluate((src) => window.__lpnForm.ev(src), process.env.LABEL_EXT_PROBE));
				if (process.env.LABEL_EXT_PROBE_OUT) { fs.writeFileSync(process.env.LABEL_EXT_PROBE_OUT + '-' + k + '.json', pr); } else { console.log('        probe: ' + pr); }
			}
			const ls = await a.page.evaluate(() => window.__lpnForm.leaders());
			const hidden = v.sig.split('\n').filter((x) => / hidden$/.test(x)).map((x) => x.split(' ')[0]);
			let crossings = 0, extCross = 0;
			const live = ls.filter((l) => !l.orphan);
			for (let i = 0; i < live.length; i++) {
				for (let j = i + 1; j < live.length; j++) {
					if (cross(live[i], live[j])) { crossings++; if (live[i].ext || live[j].ext) { extCross++; } }
				}
			}
			views.push({ notch: k, labels: v.labels, nodes: v.nodes, pipes: v.pipes, values: v.values, N1: v.N1.length, hidden,
				leaders: live.length, crossings, extCross, ext: live.filter((l) => l.ext).length,
				long: ls.filter((l) => l.orphan || l.len > LEN_MAX_PX).map((l) => l.key + ' ' + l.len.toFixed(0) + (l.orphan ? ' orphan' : '')) });
			if (shots && sc.shot && (sc.shotAt === undefined || sc.shotAt === k)) {
				fs.mkdirSync(shots, { recursive: true });
				const clip = await a.page.evaluate(() => window.__lpnForm.ev(`(function () {
					var c = svg.getBoundingClientRect(), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
					document.querySelectorAll('#lpn_canvas text, #lpn_canvas circle, #lpn_canvas line, #lpn_canvas path, #lpn_canvas rect').forEach(function (e) {
						if (!e.checkVisibility({ visibilityProperty: true, opacityProperty: true })) { return; }
						var r = e.getBoundingClientRect();
						if (!r.width && !r.height) { return; }
						if (r.right < c.left || r.left > c.right || r.bottom < c.top || r.top > c.bottom) { return; }
						if (r.width > c.width * 0.9 || r.height > c.height * 0.9) { return; }
						x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
					});
					x0 = Math.max(c.left, x0 - 12); y0 = Math.max(c.top, y0 - 12); x1 = Math.min(c.right, x1 + 12); y1 = Math.min(c.bottom, y1 + 12);
					return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
				})()`));
				const name = ref ? sc.shot.replace('.png', '-' + ref.replace(/[^A-Za-z0-9]+/g, '-') + '.png') : sc.shot;
				await a.page.screenshot({ path: path.join(shots, name), clip: sc.key === 'net1tom' ? clip : undefined });
			}
		}
		await a.page.evaluate(() => { window.__extMs = 0; window.__extN = 0; });
		const ms = await a.page.evaluate(() => window.__lpnForm.timeContent(5));
		const ext = await a.page.evaluate(() => window.__extN ? +(window.__extMs / window.__extN).toFixed(1) : 0);
		return { views, ms, ext, hooked, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
}

function row(v) {
	return `labels ${v.labels} (nodes ${v.nodes}, pipes ${v.pipes}), values ${v.values}, hidden in view ${v.hidden.length}, ` +
		`leaders ${v.leaders} (external ${v.ext}), leader crossings ${v.crossings} (with an external one ${v.extCross}), overlaps ${v.N1}`;
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
	const shots = process.env.LABEL_EXT_SHOTS || '';
	const refs = ['leader'].concat((process.env.LABEL_EXT_REFS || 'master').split(',').filter(Boolean));
	try {
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const on = await layOut(Session, browser, sc, null, shots);
			ok(sc.name + ': the hook reached the page, and no page errors', on.hooked >= 1 && !on.errors.length, (on.errors[0] || '').slice(0, 200));
			const others = [];
			for (const ref of refs) { others.push({ ref, r: await layOut(Session, browser, sc, ref, process.env.LABEL_EXT_REF_SHOTS ? shots : '') }); }
			on.views.forEach((v, i) => {
				const at = sc.name + ', ' + v.notch + ' notches';
				console.log('        ' + 'this branch'.padEnd(18) + row(v));
				others.forEach((o) => console.log('        ' + o.ref.padEnd(18) + row(o.r.views[i])));
				others.forEach((o) => {
					const lost = v.hidden.filter((h) => o.r.views[i].hidden.indexOf(h) < 0);
					if (lost.length) { console.log('        hidden here, shown by ' + o.ref + ': ' + lost.join(' ')); }
				});
				ok(at + ': no leader to an external label crosses another leader', v.extCross === 0, String(v.extCross));
				ok(at + ': every leader on a drawn label, none over ' + LEN_MAX_PX + ' px', v.long.length === 0, v.long.slice(0, 4).join('; '));
				others.forEach((o) => ok(at + ': no fewer labels than ' + o.ref, v.labels >= o.r.views[i].labels, v.labels + ' vs ' + o.r.views[i].labels));
				if (sc.noneHidden) { ok(at + ': no node or pipe label on screen is hidden', v.hidden.length === 0, v.hidden.join(' ')); }
				if (v.ext === 0 && v.hidden.length) { console.log('        (no external label placed in this view)'); }
			});
			const ref0 = others[0] && others[0].r;
			console.log('        content pass: this branch ' + on.ms + ' ms (external stage ' + on.ext + ' ms)' + others.map((o) => ', ' + o.ref + ' ' + o.r.ms + ' ms').join(''));
			if (ref0) {
				const budget = Math.round(ref0.ms * (1 + BUDGET_FRAC) + BUDGET_MS);
				ok(sc.name + ': content pass within ' + Math.round(BUDGET_FRAC * 100) + '% (+' + BUDGET_MS + ' ms) of ' + others[0].ref, on.ms <= budget, on.ms + ' ms vs budget ' + budget + ' ms');
			}
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });

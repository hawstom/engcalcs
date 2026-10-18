// LEVEL PIPE LABELS, ON THE PATH TOM TAKES: THE GALLERY, THE WHEEL, A REAL CHROMIUM (ROADMAP Task
// 812). Run with:
//   node dev/lpn-spike/pipe-label-level-wheel-browser-harness.js
//
// pipe-label-level-browser-harness.js checks the level rung's never-rules at set scales, reached by
// applyView() and a direct refreshLabelText(). Tom's pass (2026-10-17) saw no level label at all, so
// this one follows his hands instead: a 1920 x 1000 window, the gallery card for Net3 in gpm
// (lpn_ex_net3_title) opened from the front door, node fields ID, P, Qb, Z and link fields ID, Q, V along the pipe, then
// real wheel notches over the middle of the map (each one is wheelZoom()'s 1.1), so the labels are
// laid out by the zoom path's own settle and the per-notch bank, not by a harness call. The same
// is done to the 600-junction generated network (plain-downtown-n600-seed71.lwn), Zoom to fit
// first. Counted off the DOM: a pipe label is SHOWN when its <text> passes checkVisibility() and has
// text; LEVEL when the pass set it level beside its pipe and the text carries no rotation.
//
// Each scene is opened twice, as shipped and with placeLevelPipeLabels()'s call cut out on the way
// to the browser (the reference: what master draws). It asserts, at NOTCHES wheel notches in:
//   * level pipe labels are on screen, at least LEVEL_MIN of them, and the reference has none;
//   * at least SHORT_MIN of them belong to a pipe too short for its label along it (Tom,
//     2026-10-17: short pipes should also try the level spot);
//   * pipe labels shown rise, node labels shown do not fall;
//   * wheeling out two notches and back in two (the bank's revisit) shows the same level labels.
// On master the first two fail: it has no level rung, so no label is ever level beside its pipe.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PIPE_LEVEL_WHEEL_LOCKED';
const NAME = 'pipe-label-level-wheel-browser-harness';

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

const CALL = "\t\tperfDebugAccum('  cl:level', function () {\n\t\t\tplaceLevelPipeLabels(obs, nodeObs, nodeLabels, nodePlaced, labels, placed, holders, fs);\n\t\t});\n";
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
// The handles: set the label fields the way a Labels checkbox does (its change handler is
// saveToStorage() then requestLabelRefresh()), Zoom to fit, and the count, read off the drawing.
const HOOK = '\twindow.__lpnWheel = {\n' +
	'\t\tfields: function (nodeF, linkF) {\n' +
	'\t\t\tObject.keys(labelSettings.node).concat(nodeF).forEach(function (k) { labelSettings.node[k] = nodeF.indexOf(k) >= 0; });\n' +
	'\t\t\tObject.keys(labelSettings.link).concat(linkF).forEach(function (k) { labelSettings.link[k] = linkF.indexOf(k) >= 0; });\n' +
	'\t\t\tsettings.alignPipeLabels = true;\n' +
	'\t\t\tsaveToStorage(); requestLabelRefresh();\n' +
	'\t\t},\n' +
	'\t\tsolved: function () { return !!lastSolveResult; },\n' +
	'\t\tfit: function () { zoomExtent(); },\n' +
	'\t\tcount: function () {\n' +
	'\t\t\tvar W = svg.clientWidth, H = svg.clientHeight, t = { s: state.s, asked: 0, shown: 0, level: [], short: [], rotatedLevel: 0, nodes: 0 };\n' +
	'\t\t\tfunction inView(p) { var x = p.x * state.s + state.tx, y = p.y * state.s + state.ty; return x >= 0 && x <= W && y >= 0 && y <= H; }\n' +
	'\t\t\tfunction shown(e) { return !!e.text.textContent && e.text.checkVisibility({ visibilityProperty: true, opacityProperty: true }); }\n' +
	'\t\t\tdoc.links.forEach(function (l) {\n' +
	'\t\t\t\tvar e = linkEls[l.id]; if (!e || e.empty || !e.text || !inView(linkLabelMid(l))) { return; }\n' +
	'\t\t\t\tt.asked++; if (!shown(e)) { return; } t.shown++;\n' +
	'\t\t\t\tif (!e.levelBeside) { return; }\n' +
	'\t\t\t\tvar m = /rotate\\(([-0-9.e]+)/.exec(e.text.getAttribute("transform") || "");\n' +
	'\t\t\t\tif (m && Math.abs(+m[1]) > 1e-6) { t.rotatedLevel++; return; }\n' +
	'\t\t\t\tt.level.push(l.id); if (linkLabelTooShort(l, e)) { t.short.push(l.id); }\n' +
	'\t\t\t});\n' +
	'\t\t\tdoc.nodes.forEach(function (n) { var e = nodeEls[n.id]; if (e && !e.empty && e.text && inView(nodeAt(n)) && shown(e)) { t.nodes++; } });\n' +
	'\t\t\treturn t;\n' +
	'\t\t}\n' +
	'\t};\n';

const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOTCHES = 6, LEVEL_MIN = 15, SHORT_MIN = 5;
const SCENES = [
	{ name: 'Net3 (gallery, gpm)', cardKey: 'lpn_ex_net3_title' },
	{ name: '600-junction downtown', file: 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', fit: true }
];

async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}

async function layOut(Session, browser, sc, levelOn) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: { width: 1920, height: 1000 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0, hooked = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (!levelOn && body.split(CALL).length === 2) { body = body.replace(CALL, ''); rewritten++; }
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); hooked++; }
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		if (sc.cardKey) {
			await a.openExampleCard(await a.lang(sc.cardKey));
		} else {
			await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); },
				fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		}
		await a.page.waitForFunction(() => window.__lpnWheel && window.__lpnWheel.solved(), null, { timeout: 30000 });
		await a.page.evaluate(([n, l]) => window.__lpnWheel.fields(n, l), [NODE_FIELDS, LINK_FIELDS]);
		await a.settle(2000);
		if (sc.fit) { await a.page.evaluate(() => window.__lpnWheel.fit()); await a.settle(2000); }
		const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await a.page.mouse.move(mid.x, mid.y);
		const views = {};
		views.open = await a.page.evaluate(() => window.__lpnWheel.count());
		await wheel(a.page, NOTCHES);
		await a.settle(1500);
		views.in = await a.page.evaluate(() => window.__lpnWheel.count());
		await wheel(a.page, -2); await a.settle(1200);
		await wheel(a.page, 2); await a.settle(1500);
		views.back = await a.page.evaluate(() => window.__lpnWheel.count());
		return { views, rewritten, hooked, errors: a.errors.slice() };
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
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const src = fs.readFileSync(path.join(REPO, 'js', 'looped-network.js'), 'utf8');
		ok('the level call is where the reference run expects it', src.split(CALL).length === 2);
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const on = await layOut(Session, browser, sc, true);
			const off = await layOut(Session, browser, sc, false);
			ok('the hook reached the page both times, and the reference run was served without the level pass',
				on.hooked >= 1 && off.hooked >= 1 && off.rewritten >= 1 && on.rewritten === 0);
			ok('no page errors', !on.errors.length && !off.errors.length, (on.errors.concat(off.errors)[0] || '').slice(0, 200));
			const A = on.views.in, B = off.views.in;
			['open', 'in', 'back'].forEach((k) => {
				const x = on.views[k], y = off.views[k];
				console.log(`        ${k === 'open' ? 'as opened' : k === 'in' ? NOTCHES + ' notches in' : 'out 2, in 2'}: pipe labels shown ${y.shown} -> ${x.shown} of ${x.asked} (${x.level.length} level, ${x.short.length} of them on a short pipe); node labels ${y.nodes} -> ${x.nodes}`);
			});
			ok(sc.name + ', ' + NOTCHES + ' notches in: at least ' + LEVEL_MIN + ' pipe labels drawn level beside their pipes', A.level.length >= LEVEL_MIN, String(A.level.length));
			ok(sc.name + ': the reference (master\'s placement) draws none', B.level.length === 0, String(B.level.length));
			ok(sc.name + ': at least ' + SHORT_MIN + ' of them are on a pipe too short for its label along it', A.short.length >= SHORT_MIN, A.short.length + (A.short.length ? ': ' + A.short.slice(0, 5).join(' ') : ''));
			ok(sc.name + ': a level label is drawn level, never turned along its pipe', A.rotatedLevel === 0 && on.views.back.rotatedLevel === 0, String(A.rotatedLevel));
			ok(sc.name + ': more pipe labels shown than the reference, and no fewer node labels', A.shown > B.shown && A.nodes >= B.nodes, `${B.shown} -> ${A.shown}, nodes ${B.nodes} -> ${A.nodes}`);
			ok(sc.name + ': out two notches and back in two shows the same level labels',
				on.views.back.level.join(',') === A.level.join(','), on.views.back.level.length + ' vs ' + A.level.length);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });

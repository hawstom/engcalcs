// THE GRAB SHAPE OF A LABEL COVERS ALL OF ITS DRAWN TEXT, in a real Chromium. Run with:
//   node dev/lpn-spike/label-hit-box-browser-harness.js
//   LABEL_HIT_REPO=/path/to/other/checkout node dev/lpn-spike/label-hit-box-browser-harness.js
//
// Tom, 2026-10-21, on link 233 of Net3: "It's not a delay. It's a failure over about half the label...
// It was a multi-line label on a leader." The mouse is swept over a grid across every drawn row of
// every node and link label (Net3, default labels plus extra fields so labels are multi-line, and
// with labels dragged away from their elements so each is on a leader), asking
// document.elementFromPoint what answers. A point inside a drawn row must be answered by THAT
// label's own grab path (class lpn-lbl-hit, same data-nodelbl/data-linklbl) and carry the pointer
// cursor. 100% coverage is required. LABEL_HIT_PNG=<file.png> saves link 233 with its grab shape shaded red.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(process.env.LABEL_HIT_REPO || path.join(__dirname, '..', '..'));
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_HIT_BOX_LOCKED';
const NAME = 'label-hit-box-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
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
const SCENES = [
	{ name: 'Net3 default labels', node: null, link: null },
	{ name: 'Net3 multi-line labels', node: ['id', 'pressure', 'demand', 'elev'], link: ['id', 'flow', 'velocity'] },
	{ name: 'Net3 multi-line labels, link 233 and N151 dragged onto leaders', node: ['id', 'pressure', 'demand', 'elev'], link: ['id', 'flow', 'velocity'], drag: [['L', '233', 90, -70], ['N', '151', -80, 60]] }
];

// Runs in the page. For every drawn label: sweep a grid over each drawn row, record what answers.
const SWEEP = function () {
	const out = [];
	const step = 3;
	// Only ground the visitor can reach: inside the canvas, and not under a toolbar or panel.
	const cv = document.getElementById('lpn_canvas').getBoundingClientRect();
	const svgEl = document.getElementById('lpn_canvas');
	function owner(t) { return t.getAttribute('data-nodelbl') != null ? 'n' + t.getAttribute('data-nodelbl') : (t.getAttribute('data-linklbl') != null ? 'l' + t.getAttribute('data-linklbl') : (t.getAttribute('data-lbl') != null ? 't' + t.getAttribute('data-lbl') : null)); }
	function oneLabel(key, h) {
		const t = h && h.text;
		if (!t || !t.textContent || !t.checkVisibility({ visibilityProperty: true })) { return; }
		const rows = [];
		for (const c of t.childNodes) {
			if (c.nodeType === 1 && c.getAttribute('x') != null) { rows.push([c]); } else if (c.nodeType === 1 && rows.length) { rows[rows.length - 1].push(c); }
		}
		if (!rows.length) { rows.push([t]); }
		let total = 0, hit = 0, cur = 0;
		const miss = [], rects = [];
		const leader = !!(h.leader && h.leader.style.display !== 'none' && h.leader.style.visibility !== 'hidden' && h.leader.getAttribute('x1') != null);
		// Sample the glyphs AS DRAWN, character by character, in the text's own frame and mapped to the
		// screen, so a label turned along its pipe is swept on its slanted footprint and not on the
		// bounding box round it. Three points per character: its left quarter, middle, right quarter,
		// at mid-height of the line.
		const svgRoot = svgEl;
		rows.forEach((parts) => {
			const pts = [];
			parts.forEach((p) => {
				let n = 0;
				try { n = p.getNumberOfChars(); } catch (e) { n = 0; }
				const m = p.getScreenCTM();
				if (!m) { return; }
				for (let i = 0; i < n; i++) {
					const ex = p.getExtentOfChar(i);
					if (!(ex.width > 0)) { continue; }
					for (const fx of [0.25, 0.5, 0.75]) {
						for (const fy of [0.35, 0.7]) {
							const q = svgRoot.createSVGPoint(); q.x = ex.x + ex.width * fx; q.y = ex.y + ex.height * fy;
							const sp = q.matrixTransform(m);
							pts.push([sp.x, sp.y]);
						}
					}
				}
			});
			if (pts.length) { rects.push([Math.min.apply(null, pts.map((q) => q[0])), Math.min.apply(null, pts.map((q) => q[1])), Math.max.apply(null, pts.map((q) => q[0])), Math.max.apply(null, pts.map((q) => q[1]))]); }
			pts.forEach((pt) => {
				const x = pt[0], y = pt[1];
				if (x < cv.left + 2 || x > cv.right - 2 || y < cv.top + 2 || y > cv.bottom - 2) { return; }
				const probe = document.elementFromPoint(x, y);
				if (!probe || !svgEl.contains(probe)) { return; }
				total++;
				const good = probe.classList && probe.classList.contains('lpn-lbl-hit') && owner(probe) === key;
				const pointer = getComputedStyle(probe).cursor;
				if (good) { hit++; }
				if (good && /pointer|grab|move/.test(pointer)) { cur++; } else if (miss.length < 400) { miss.push([Math.round(x), Math.round(y), (probe.tagName + '.' + (probe.getAttribute('class') || '')).slice(0, 40)]); }
			});
		});
		const grab = h.text.lpnHit && h.text.lpnHit.getBoundingClientRect();
		const turned = !!t.getAttribute('transform');
		out.push({ key, turned, rows: rows.length, total, hit, cur, leader, miss, rects, grab: grab ? [grab.left, grab.top, grab.right, grab.bottom] : null, text: t.textContent.slice(0, 40) });
	}
	return { out, oneLabel };
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		let sceneNo = 0;
		for (const sc of SCENES) {
			sceneNo++;
			console.log('=== ' + sc.name + ' (' + REPO + ') ===');
			const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: { width: 1920, height: 1000 } });
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.page.route(/\/js\/looped-network\.js/, async (route) => {
				const resp = await route.fetch();
				let body = await resp.text();
				if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
				await route.fulfill({ response: resp, body });
			});
			try {
				await a.goto('Looped-Network.php?ec_nolog=1');
				await a.answerTrainingPanel().catch(() => {});
				await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
				await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
				if (sc.node) { await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [sc.node, sc.link]); }
				await a.settle(2000);
				let at = 0, multiLead = 0;
				for (const k of [6, 9, 12]) {
					await a.page.mouse.move(960, 500);
					for (let i = 0; i < k - at; i++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(40); }
					at = k;
					await a.settle(1500);
					if (k === 9) {
						for (const d of (sc.drag || [])) {
							const r = await a.page.evaluate(([kk, id]) => window.__lpnForm.ev(`(function () { var h = ${kk === 'L' ? 'linkEls' : 'nodeEls'}['${id}']; var b = h.text.getBoundingClientRect(); return b.width ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null; })()`), [d[0], d[1]]);
							if (!r) { continue; }
							await a.page.mouse.move(r.x, r.y); await a.page.mouse.down();
							await a.page.mouse.move(r.x + d[2] / 2, r.y + d[3] / 2, { steps: 5 });
							await a.page.mouse.move(r.x + d[2], r.y + d[3], { steps: 5 });
							await a.page.mouse.up(); await a.settle(800);
							await a.page.mouse.move(5, 5);
						}
						await a.settle(1000);
					}
					const src = '(function () { var S = (' + SWEEP.toString() + ')(); doc.nodes.forEach(function (n) { S.oneLabel("n" + n.id, nodeEls[n.id]); }); doc.links.forEach(function (l) { S.oneLabel("l" + l.id, linkEls[l.id]); }); return S.out; })()';
					const res = await a.page.evaluate((x) => window.__lpnForm.ev(x), src);
					const tag = sc.name + ', ' + k + ' notches';
					const total = res.reduce((s, r) => s + r.total, 0), hit = res.reduce((s, r) => s + r.hit, 0), cur = res.reduce((s, r) => s + r.cur, 0);
					const multi = res.filter((r) => r.rows > 1), lead = res.filter((r) => r.leader), ml = res.filter((r) => r.rows > 1 && r.leader);
					console.log('    ' + tag + ': labels ' + res.length + ', multi-line ' + multi.length + ', on a leader ' + lead.length + ', both ' + ml.length + '; points ' + total + ', grabbed ' + hit + ', pointer ' + cur);
					ok(tag + ': labels were swept (not vacuous)', res.length >= 10 && total > 300, res.length + ' labels, ' + total + ' points');
					const bad = res.filter((r) => r.cur < r.total);
					// And no more than the words: an upright label's grab shape may not reach more than one
					// character-width beyond the glyphs sampled (the box is wider than the glyphs on purpose).
					const wide = res.filter((r) => !r.turned && r.grab && r.rects.length && (r.grab[2] - r.grab[0]) > (Math.max.apply(null, r.rects.map((q) => q[2])) - Math.min.apply(null, r.rects.map((q) => q[0]))) + 22);
					wide.slice(0, 4).forEach((r) => console.log('      WIDE ' + r.key + ' grab ' + JSON.stringify(r.grab.map(Math.round)) + ' words ' + JSON.stringify(r.rects.map((q) => q.map(Math.round)))));
					ok(tag + ': no upright label is grabbed over ground wider than its words', wide.length === 0, wide.length + ' labels');
					bad.slice(0, 8).forEach((r) => console.log('      ' + r.key + ' rows ' + r.rows + (r.leader ? ' LEADER' : '') + ' ' + r.cur + '/' + r.total + ' "' + r.text.replace(/\n/g, '|') + '" text ' + JSON.stringify((r.rects[0] || []).map(Math.round)) + ' grab ' + JSON.stringify((r.grab || []).map(Math.round)) + ' miss x ' + (r.miss.length ? Math.min.apply(null, r.miss.map((m) => m[0])) + '..' + Math.max.apply(null, r.miss.map((m) => m[0])) : '')));
					ok(tag + ': every point of every drawn label row is grabbed, with the pointer cursor (' + cur + '/' + total + ')', cur === total, bad.length + ' labels short');
					const l233 = res.find((r) => r.key === 'l233');
					if (l233) { console.log('    link 233: ' + l233.cur + '/' + l233.total + ', rows ' + l233.rows + (l233.leader ? ', on a leader' : '')); }
					if (k === 12 && sc.drag) { ok(sc.name + ': a multi-line label on a leader exists at some zoom (not vacuous)', multiLead + ml.length >= 1, String(multiLead + ml.length)); }
					multiLead += ml.length;
				}
				if (process.env.LABEL_HIT_PNG && sceneNo === 1) {
					await a.page.evaluate(`window.__lpnForm.ev("(function(){ var s=document.createElementNS('http://www.w3.org/2000/svg','style'); s.textContent='.lpn-lbl-hit{fill:rgba(255,0,0,.35)!important;stroke:red!important;stroke-width:1px!important;vector-effect:non-scaling-stroke}'; document.head.appendChild(s); return 1; })()")`);
					const r = await a.page.evaluate(`window.__lpnForm.ev("(function(){ var b = linkEls['233'].text.getBoundingClientRect(); return {x:b.left,y:b.top,w:b.width,h:b.height}; })()")`);
					const pad = 110;
					await a.page.screenshot({ path: process.env.LABEL_HIT_PNG, clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.w + 2 * pad, height: r.h + 2 * pad } });
				}
			} finally {
				await a.close();
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

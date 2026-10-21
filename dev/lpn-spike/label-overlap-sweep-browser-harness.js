// NO TWO DRAWN LABELS OVERPRINT, AT ANY ZOOM (Tom, 2026-10-20: labels drawn on top of each other are
// "unreleasable"; goal 2 of dev/label-placement-goals.md). Sweeps Net1 (Tom's fields) and Net3 across
// wheel notches from fully out to fully in in the real page and compares the boxes the browser DREW
// (every visible label text's getBBox, as one box per label, and user Text objects such as Source and
// Tank), not the planner's model of them. Any pair of label ROWS that intersect by more than 0.75 px fails (a Text object against another Text is
// crowdedTexts()'s, which judges the glyph ink, so that pair is not counted here).
//   node dev/lpn-spike/label-overlap-sweep-browser-harness.js
//   LABEL_SWEEP_REF=leader|master|<ref>  lays out that ref's js/looped-network.js and lpn-collide.js
//       instead ('leader' = this file with the external stage cut out); prints, never asserts.
//   LABEL_SWEEP_SHOT=<png> LABEL_SWEEP_NOTCH=<n>  saves a screenshot of Net1 at that notch.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_SWEEP_LOCKED';
const NAME = 'label-overlap-sweep-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s; re-run alone.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
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
const TOL_PX = 0.75;
const NET3_NODE = ['id', 'pressure', 'demand', 'elev'], NET3_LINK = ['id', 'flow', 'velocity'];
const SCENES = [
	{ key: 'net1', name: 'Net1 1100x750', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['id', 'flow', 'velocity'], from: -16, to: 4, viewport: { width: 1100, height: 750 } },
	{ key: 'net1', name: 'Net1 1920x1000', cardKey: 'lpn_ex_net1_title', node: ['id', 'demand', 'elev', 'pressure'], link: ['id', 'flow', 'velocity'], from: -16, to: 4, viewport: { width: 1920, height: 1000 } },
	{ key: 'net3', name: 'Net3 1100x750', cardKey: 'lpn_ex_net3_title', node: NET3_NODE, link: NET3_LINK, from: -6, to: 10, viewport: { width: 1100, height: 750 } },
	{ key: 'net3', name: 'Net3 1920x1000', cardKey: 'lpn_ex_net3_title', node: NET3_NODE, link: NET3_LINK, from: -2, to: 10, viewport: { width: 1920, height: 1000 } }
];

// Every drawn label text as boxes in screen pixels: one box per ROW of text (the staircase of a
// stacked label, as drawn), rotated as drawn. Two labels overprint when any two rows intersect.
const PROBE = `(function () {
	var s = state.s, boxes = [], c = svg.getBoundingClientRect();
	function vis(t) { return !!t && !!t.textContent && t.checkVisibility({ visibilityProperty: true, opacityProperty: true }); }
	function add(key, t) {
		var m, a = 0, ox = 0, oy = 0, rad, r, rows = [], cur = null, i, ch, b;
		if (!vis(t)) { return; }
		r = t.getBoundingClientRect();
		if (r.right < c.left || r.left > c.right || r.bottom < c.top || r.top > c.bottom) { return; }
		m = /rotate\\(([-0-9.e]+)[ ,]+([-0-9.e]+)[ ,]+([-0-9.e]+)\\)/.exec(t.getAttribute('transform') || '');
		if (m) { a = +m[1]; ox = +m[2]; oy = +m[3]; }
		rad = a * Math.PI / 180;
		for (i = 0; i < t.childNodes.length; i++) {
			ch = t.childNodes[i];
			if (ch.nodeType !== 1) { continue; }
			try { b = ch.getBBox(); } catch (e) { continue; }
			if (!(b.width > 0)) { continue; }
			if (ch.getAttribute('x') != null || !cur) { cur = { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }; rows.push(cur); }
			else { cur.x0 = Math.min(cur.x0, b.x); cur.y0 = Math.min(cur.y0, b.y); cur.x1 = Math.max(cur.x1, b.x + b.width); cur.y1 = Math.max(cur.y1, b.y + b.height); }
		}
		if (!rows.length) { try { b = t.getBBox(); } catch (e) { return; } if (b.width > 0) { rows.push({ x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }); } }
		rows.forEach(function (q) {
			var cx = (q.x0 + q.x1) / 2, cy = (q.y0 + q.y1) / 2, dx = cx - ox, dy = cy - oy;
			if (a) { cx = ox + dx * Math.cos(rad) - dy * Math.sin(rad); cy = oy + dx * Math.sin(rad) + dy * Math.cos(rad); }
			boxes.push({ key: key, cx: cx * s + state.tx, cy: cy * s + state.ty, w: (q.x1 - q.x0) * s, h: (q.y1 - q.y0) * s, a: rad });
		});
	}
	doc.nodes.forEach(function (n) { var h = nodeEls[n.id]; if (h && !h.empty) { add('n' + n.id, h.text); } });
	doc.links.forEach(function (l) { var h = linkEls[l.id]; if (h && !h.empty) { add('l' + l.id, h.text); (h.repeats || []).forEach(function (r, i) { add('l' + l.id + '.' + (i + 1), r.text); }); } });
	doc.labels.forEach(function (lb) { var te = labelEls[lb.id]; if (te) { add('t' + lb.id, te.text); } });
	return boxes;
})()`;

function depth(p, q) {
	function proj(b, ax) {
		const c = b.cx * ax[0] + b.cy * ax[1], e = Math.abs(b.w / 2 * (Math.cos(b.a) * ax[0] + Math.sin(b.a) * ax[1])) +
			Math.abs(b.h / 2 * (-Math.sin(b.a) * ax[0] + Math.cos(b.a) * ax[1]));
		return [c - e, c + e];
	}
	let d = Infinity;
	[p, q].forEach((b) => [[Math.cos(b.a), Math.sin(b.a)], [-Math.sin(b.a), Math.cos(b.a)]].forEach((ax) => {
		const u = proj(p, ax), w = proj(q, ax); d = Math.min(d, Math.min(u[1], w[1]) - Math.max(u[0], w[0]));
	}));
	return d;
}
function overlaps(boxes) {
	const out = [], seen = {};
	for (let i = 0; i < boxes.length; i++) {
		for (let j = i + 1; j < boxes.length; j++) {
			if (boxes[i].key.split('.')[0] === boxes[j].key.split('.')[0] || (boxes[i].key[0] === 't' && boxes[j].key[0] === 't')) { continue; }
			const d = depth(boxes[i], boxes[j]);
			const k = boxes[i].key + '~' + boxes[j].key;
			if (d > TOL_PX && !seen[k]) { seen[k] = 1; out.push(k + ' ' + d.toFixed(1)); }
		}
	}
	return out;
}
function refSource(ref, file) {
	return execFileSync('git', ['-C', REPO, 'show', ref + ':js/' + file], { encoding: 'utf8', maxBuffer: 64 << 20 });
}
async function wheel(page, n) {
	const step = n > 0 ? -100 : 100;
	for (let i = 0; i < Math.abs(n); i++) { await page.mouse.wheel(0, step); await page.waitForTimeout(40); }
}

async function sweep(Session, browser, sc, ref) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.viewport });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const resp = await route.fetch();
		const file = /lpn-collide\.js/.test(route.request().url()) ? 'lpn-collide.js' : 'looped-network.js';
		let body = (ref && ref !== 'leader') ? refSource(ref, file) : await resp.text();
		if (ref === 'leader' && file === 'looped-network.js') { body = body.replace(CUT, ''); }
		if (file === 'looped-network.js' && body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang(sc.cardKey));
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 90000 });
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [sc.node, sc.link]);
		await a.settle(2000);
		const mid = await a.page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await a.page.mouse.move(mid.x, mid.y);
		// Half-notch steps (a factor of 1.1^0.5 each), so a zoom between two wheel clicks is swept too.
		const rows = [];
		await a.page.evaluate(([x, y, n]) => window.__lpnForm.ev('(function(){ var r = svg.getBoundingClientRect(); for (var i = 0; i < ' + (-n) + '; i++) { wheelZoom(r.left + r.width / 2, r.top + r.height / 2, 1 / Math.sqrt(1.1)); } })()'), [mid.x, mid.y, sc.from * 2]);
		for (let k = sc.from; k <= sc.to + 0.01; k += 0.5) {
			if (k > sc.from) { await a.page.evaluate(() => window.__lpnForm.ev('(function(){ var r = svg.getBoundingClientRect(); wheelZoom(r.left + r.width / 2, r.top + r.height / 2, Math.sqrt(1.1)); })()')); }
			await a.settle(1000);
			const boxes = await a.page.evaluate((src) => window.__lpnForm.ev(src), PROBE);
			if (process.env.LABEL_SWEEP_PROBE && k === +process.env.LABEL_SWEEP_NOTCH && sc.name === process.env.LABEL_SWEEP_SCENE) { console.log('        probe: ' + JSON.stringify(await a.page.evaluate((src) => window.__lpnForm.ev(src), process.env.LABEL_SWEEP_PROBE))); }
			rows.push({ notch: k.toFixed(1), shown: new Set(boxes.map((b) => b.key.split('.')[0])).size, over: overlaps(boxes) });
			if (process.env.LABEL_SWEEP_SHOT && sc.key === 'net1' && k === +process.env.LABEL_SWEEP_NOTCH && /1100/.test(sc.name)) { await a.page.screenshot({ path: process.env.LABEL_SWEEP_SHOT }); }
		}
		return { rows, errors: a.errors.slice() };
	} finally { await a.close(); }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const ref = process.env.LABEL_SWEEP_REF || '';
	try {
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + (ref ? ' (' + ref + ')' : '') + ' ===');
			const r = await sweep(Session, browser, sc, ref);
			r.rows.forEach((w) => {
				if (w.over.length || process.env.LABEL_SWEEP_ALL) { console.log('        notch ' + String(w.notch).padStart(5) + ': ' + w.shown + ' labels drawn, ' + w.over.length + ' overlapping pairs' + (w.over.length ? ': ' + w.over.slice(0, 6).join(' ') : '')); }
				if (!ref && w.over.length) { ok(sc.name + ', notch ' + w.notch + ': no two drawn label rows intersect', false, w.over.slice(0, 6).join(' ')); }
			});
			if (!ref) { ok(sc.name + ', ' + r.rows.length + ' zoom levels: no two drawn label rows intersect', r.rows.every((w) => !w.over.length)); ok(sc.name + ': no page errors', !r.errors.length, (r.errors[0] || '').slice(0, 200)); }
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });

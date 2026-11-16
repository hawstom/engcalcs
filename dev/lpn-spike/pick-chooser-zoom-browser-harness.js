// **THE PICK CHOOSER ON NET3, WHERE THE SCREEN DECIDES** (Tom, 2026-11-16: "I can't predict when I
// will or won't get a chooser"; "a list of more than about 4 to 5 elements is not helpful"). The box
// opens only where the symbol pressed visibly overlaps another under the pickbox, lists no pipe that is a visible line (a pipe whose two end symbols are drawn on top of each other is a point),
// and has at most six rows. Real Chromium, the Net3 example:
//   L. the Lake: a click where the reservoir's symbol overlaps the pump's glyph opens a box listing
//      the reservoir and the pump (no pipe); a click on the reservoir clear of the pump, and on the
//      pump clear of the reservoir, selects that one with no box;
//   A. desktop, a mouse, a click on EVERY node's centre at the opening view and 4, 8, 12 and 20 notches
//      out (the network drawn 120 px wide): the number of boxes and the largest row count are PRINTED,
//      and the checks are that every click without a box selects the node it is on, that every box
//      lists two to six rows with no pipe, and that the opening view opens only the few where a tank
//      or pump glyph lies over a junction;
//   B. phone, 390 x 844 touch, 8 notches out: the same with a finger.
// The cases built by hand are in pick-chooser-browser-harness.js.
//
//   node dev/lpn-spike/pick-chooser-zoom-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-chooser-zoom-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKZOOM_LOCKED';
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net3 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8');
	const errors = [];
	const open = async (S) => {
		S.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net3);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(3000);
	};
	// Every node centre on screen, and how wide the network is drawn.
	const centres = (S) => S.page.evaluate(() => {
		const out = [];
		let l = Infinity, r = -Infinity;
		document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node], #lpn_canvas .lpn-node[data-node]').forEach((e) => {
			const b = e.getBoundingClientRect();
			if (!(b.width > 0)) { return; }
			const x = b.left + b.width / 2, y = b.top + b.height / 2;
			l = Math.min(l, x); r = Math.max(r, x);
			const top = document.elementsFromPoint(x, y)[0];
			if (top && top.closest && top.closest('#lpn_canvas') && x > 0 && y > 0 && x < innerWidth && y < innerHeight) { out.push({ id: e.dataset.node, x, y }); }
		});
		return { pts: out, width: r - l };
	});
	const readAndReset = (S) => S.page.evaluate(() => {
		const sel = Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link ? 'l' + e.dataset.link : 'x')).sort().join(',');
		const rows = Array.from(document.querySelectorAll('.lpn-pick-chooser button')).map((b) => b.textContent.trim());
		document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove());
		const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); }
		return { sel, box: rows.length > 0, rows };
	});
	const sweep = async (S, touch) => {
		const { pts, width } = await centres(S);
		const cdp = touch ? await S.page.context().newCDPSession(S.page) : null;
		const press = async (p) => {
			if (touch) {
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
				await sleep(35);
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				await sleep(60);
			} else { await S.page.mouse.move(p.x, p.y); await S.page.mouse.click(p.x, p.y); await sleep(40); }
		};
		const res = [];
		for (const p of pts) { await press(p); res.push(Object.assign({ id: p.id }, await readAndReset(S))); }
		const boxes = res.filter((r) => r.box);
		const quiet = res.filter((r) => !r.box);
		return { n: pts.length, width: Math.round(width), boxes: boxes.length,
			shortBoxes: boxes.filter((r) => r.rows.length < 2).length,
			maxRows: boxes.reduce((m, r) => Math.max(m, r.rows.length), 0), pipeRows: boxes.filter((r) => r.rows.some((x) => /^Pipe /.test(x)) && r.rows.filter((x) => !/^Pipe /.test(x)).length < 2).length,   // a buried pipe is never why a box opens
			// A tap that selects a neighbour is wrong only when that neighbour is more than 3 px from the node tapped
			// (two dots 2 px apart cannot be told apart by a finger's centre pixel).
			quietWrong: quiet.filter((r) => { if (r.sel === 'n' + r.id) { return false; } const me = pts.find((p) => p.id === r.id), other = pts.find((p) => 'n' + p.id === r.sel); return !(me && other && Math.hypot(me.x - other.x, me.y - other.y) <= 3); }).length,
			sample: boxes.slice(0, 3).map((r) => r.id + ': ' + r.rows.join(' / ')) };
	};
	const zoomOut = async (S, notches) => {
		const c = await S.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await S.page.mouse.move(c.x, c.y);
		for (let i = 0; i < notches; i++) { await S.page.mouse.wheel(0, 120); await sleep(30); }
		await S.settle(900);
	};
	try {
		console.log('\nL. The Lake: the reservoir overlaps the pump');
		const D = await Session.open(browser, NAME + '-d', { viewport: { width: 1400, height: 900 } });
		await open(D);
		const rowsNow = () => D.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		// A link wears its mark on its halo, which sits just before its grab band (the one with data-link).
		const selNow = () => D.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => { if (e.dataset.node) { return 'n' + e.dataset.node; } const h = e.dataset.link !== undefined ? e : e.nextElementSibling; return h && h.dataset.link !== undefined ? 'l' + h.dataset.link : 'x'; }).sort().join(','));
		const lake = await D.page.evaluate(() => {
			const r = (s) => { const e = Array.from(document.querySelectorAll(s)).find((x) => x.getBoundingClientRect().width > 0); return e && e.getBoundingClientRect(); };
			const a = r('#lpn_canvas circle.lpn-node[data-node="Lake"]'), g = r('#lpn_canvas path.lpn-link-symbol-hit[data-link="10"]');
			return { a: a && [a.left, a.top, a.right, a.bottom], g: g && [g.left, g.top, g.right, g.bottom] };
		});
		ok('the Lake reservoir and the pump glyph are drawn', !!lake.a && !!lake.g, JSON.stringify(lake));
		const overlap = { x: (Math.max(lake.a[0], lake.g[0]) + Math.min(lake.a[2], lake.g[2])) / 2, y: (Math.max(lake.a[1], lake.g[1]) + Math.min(lake.a[3], lake.g[3])) / 2 };
		await D.page.mouse.move(overlap.x, overlap.y); await D.page.mouse.click(overlap.x, overlap.y); await D.settle(450);
		const lakeRows = await rowsNow();
		ok('a click where the reservoir overlaps the pump opens the box', lakeRows.length >= 2, JSON.stringify(lakeRows));
		ok('...listing the reservoir and the pump, and no pipe', lakeRows.some((r) => /Lake/.test(r)) && lakeRows.some((r) => /Pump 10/.test(r)) && !lakeRows.some((r) => /^Pipe /.test(r)), JSON.stringify(lakeRows));
		ok('...selecting nothing until a row is chosen', (await selNow()) === '', await selNow());
		const pumpRow = (await D.page.$$('.lpn-pick-chooser button'))[lakeRows.findIndex((r) => /Pump 10/.test(r))];
		await pumpRow.click(); await D.settle(450);
		ok('...and choosing Pump 10 selects the pump, which that click could not reach before', (await selNow()) === 'l10', await selNow());
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		// Clear of the other: left of the glyph on the reservoir, right of the reservoir on the glyph.
		const onlyLake = { x: lake.a[0] + 5, y: overlap.y };
		const onlyPump = await D.page.evaluate((a) => {
			// The pump's own ink farthest from the reservoir that is still the pump to the browser's hit test.
			for (let x = a.g[2]; x > a.g[0]; x -= 0.5) {
				for (const y of [a.y, a.y - 2, a.y + 2, a.y - 4, a.y + 4]) {
					const top = document.elementsFromPoint(x, y)[0];
					if (top && top.dataset && top.dataset.link === '10') { return { x, y }; }
				}
			}
			return null;
		}, { g: lake.g, y: overlap.y });
		ok('(the pump\'s far end is more than the 6 px pickbox from the reservoir\'s drawn edge)', !!onlyPump && onlyPump.x - lake.a[2] > 6.5, JSON.stringify([onlyPump, lake.a[2]]));
		await D.page.mouse.click(700, 120); await D.settle(300);
		await D.page.mouse.move(onlyLake.x, onlyLake.y); await D.page.mouse.click(onlyLake.x, onlyLake.y); await D.settle(450);
		ok('a click on the reservoir clear of the pump selects the reservoir with no box', (await rowsNow()).length === 0 && (await selNow()) === 'nLake', JSON.stringify([await rowsNow(), await selNow(), onlyLake]));
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await D.page.mouse.move(onlyPump.x, onlyPump.y); await D.page.mouse.click(onlyPump.x, onlyPump.y); await D.settle(450);
		const farRows = await rowsNow();
		ok('a click on the pump more than the pickbox from the reservoir does not offer the reservoir', !farRows.some((r) => /Lake/.test(r)) && (farRows.length ? farRows.some((r) => /Pump 10/.test(r)) : (await selNow()) === 'l10'), JSON.stringify([farRows, await selNow(), onlyPump]));

		console.log('\nA. Desktop, a mouse, Net3, a click on every node centre');
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await D.page.mouse.click(700, 120); await D.settle(300);
		for (const [label, notches] of [['the opening view', 0], ['4 notches out', 4], ['8 notches out', 4], ['12 notches out', 4], ['20 notches out', 8]]) {
			await zoomOut(D, notches);
			const r = await sweep(D, false);
			console.log('  NUMBERS ' + label + ': ' + JSON.stringify(r));
			ok(label + ' (network ' + r.width + ' px wide): ' + r.n + ' node-centre clicks open ' + r.boxes + ' boxes, at most ' + r.maxRows + ' rows', r.n >= 90, JSON.stringify(r));
			ok('...every box lists two to six rows, and a pipe only beside two symbols it is buried under', r.shortBoxes === 0 && r.maxRows <= 6 && r.pipeRows === 0, JSON.stringify(r));
			ok('...and every click without a box selects the node it is on', r.quietWrong === 0, JSON.stringify(r));
			if (notches === 0) { ok('...at the opening view only the places where two symbols are drawn touching open one (measured 4 of 97; at most 6)', r.boxes <= 6, JSON.stringify(r)); }
		}
		await D.page.close();

		console.log('\nB. Phone, 390 x 844, a finger, Net3, 8 notches out');
		const T = await Session.open(browser, NAME + '-p', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(T);
		await zoomOut(T, 8);
		const r = await sweep(T, true);
		console.log('  NUMBERS phone 8 notches out: ' + JSON.stringify(r));
		ok('8 notches out (network ' + r.width + ' px wide): ' + r.n + ' node-centre taps open ' + r.boxes + ' boxes', r.n >= 50, JSON.stringify(r));
		ok('...every box lists two to six rows, and a pipe only beside two symbols it is buried under', r.shortBoxes === 0 && r.maxRows <= 6 && r.pipeRows === 0, JSON.stringify(r));
		ok('...and every tap without a box selects the node it is on', r.quietWrong === 0, JSON.stringify(r));
		await T.page.close();
		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

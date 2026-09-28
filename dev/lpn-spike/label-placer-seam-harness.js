// THE LABEL PLACER SEAM: ?placer=<name> hands every data label on the real map to a contract placer,
// and without it nothing changes. Run with:
//   node dev/lpn-spike/label-placer-seam-harness.js
//
// The label rebuild (dev/label-placement-rules.md) has two clean-room builders write placers to the
// bench's contract, a pure function of one view (dev/lpn-spike/label-bench/README.md). This is the
// proof that such a function really drives the page Tom compares them on:
//
//   0. js/lpn-placer-trivial.js, the browser copy, answers exactly what the bench's own
//      placers/trivial.js answers on every bench scene. (node only)
//   1. APP_ENV=development, ?placer=trivial, EPA Net1 in a real Chromium: every data label's <text>
//      stands where the bench's trivial placer, run HERE on the scene the page built, says -- its
//      anchor within 1 px and its drawn box within 1.5 px; no leader is drawn; nothing is placed
//      while a pan is held, and a layout follows its release (rule T1).
//   1b. R15: with the placer slowed, no frame shows a data label at a scale no layout was made for,
//      nor a newly opened project's labels before their first layout; a small pan never hides them.
//   2. The same page WITHOUT the parameter draws every label, leader and grab shape exactly as the
//      tree before the seam did: attribute for attribute, against `git merge-base HEAD master`
//      exported to a temp directory (LABEL_SEAM_BASE=<ref> overrides). Once this branch is merged
//      that base IS this tree, and the section says so and is skipped rather than comparing a tree
//      with itself.
//   3. Production (no APP_ENV): ?placer=trivial is ignored -- no placer script in the HTML, none
//      registered, and the labels exactly as without the parameter.
//
// **RUN IT DIRECTLY -- DO NOT PREFIX IT WITH `flock`.** It locks /tmp/engcalcs-browser.lock itself
// by re-executing under flock, like label-drag-fit-harness.js; an outer flock would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const { execFileSync, execSync, spawn, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_PLACER_SEAM_LOCKED';
const NAME = 'label-placer-seam-harness';

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// ---- 0. the browser copy of the trivial placer is the bench's -----------------------------------
function sectionNodeCopy() {
	console.log('\n--- 0. js/lpn-placer-trivial.js answers what the bench\'s trivial placer answers ---');
	const bench = require(path.join(REPO, 'dev/lpn-spike/label-bench/placers/trivial.js'));
	const mine = require(path.join(REPO, 'js/lpn-placer-trivial.js'));
	const dir = path.join(REPO, 'dev/lpn-spike/label-bench/scenes');
	let views = 0, differ = [];
	fs.readdirSync(dir).filter((f) => /\.json$/.test(f)).forEach((f) => {
		JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).steps.forEach((scene) => {
			views++;
			if (JSON.stringify(bench.place(scene)) !== JSON.stringify(mine.place(scene))) { differ.push(scene.id); }
		});
	});
	ok('same layout on every bench scene', views > 0 && !differ.length, views + ' views' + (differ.length ? '; differ: ' + differ.join(', ') : ''));
	ok('it is a contract module for node (place is a function)', typeof mine.place === 'function');
}

// ---- 0b. every js/lpn-placer-<name>.js answers to ?placer=<name> --------------------------------
// **THE BENCH CANNOT SEE THIS**: it require()s a placer file directly, so a file that exports
// itself for node but never lands in EngCalcs.lpnPlacers scores well and does NOTHING on the page.
// Round 2's builders C and D both shipped exactly that (2026-09-28, caught only in real Chrome).
// Each file is run as the browser would run it -- a plain script, no `module` -- and must register.
function sectionRegistration() {
	console.log('\n--- 0b. every js/lpn-placer-<name>.js registers as EngCalcs.lpnPlacers[<name>] ---');
	const vm = require('vm');
	fs.readdirSync(path.join(REPO, 'js')).filter((f) => /^lpn-placer-[a-z0-9]+\.js$/.test(f)).forEach((f) => {
		const name = f.replace(/^lpn-placer-|\.js$/g, '');
		const box = {};
		box.window = box;
		let err = null;
		try { vm.runInNewContext(fs.readFileSync(path.join(REPO, 'js', f), 'utf8'), box, { filename: f }); }
		catch (e) { err = e.message; }
		const mod = box.EngCalcs && box.EngCalcs.lpnPlacers && box.EngCalcs.lpnPlacers[name];
		ok(f + ' registers as lpnPlacers.' + name, !err && !!mod && (typeof mod.place === 'function' || typeof mod.create === 'function'),
			err ? 'threw: ' + err : (mod ? '' : 'not in EngCalcs.lpnPlacers, so ?placer=' + name + ' silently shows today\'s labels'));
	});
}

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
	process.env[LOCK_ENV] = '1';
}

// ---- helpers ------------------------------------------------------------------------------------

// Every data label, leader and grab shape on the map, attribute for attribute, in DOM order.
function labelSnapshot(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g');
		const attrs = (e) => { const a = {}; for (const at of e.attributes) { a[at.name] = at.value; } return a; };
		const els = Array.from(document.querySelectorAll('#lpn_canvas text.lpn-lbl, #lpn_canvas line.lpn-leader, #lpn_canvas path.lpn-lbl-hit'))
			.map((e) => ({ tag: e.tagName, a: attrs(e), t: e.textContent,
				kids: Array.from(e.children).map((c) => [attrs(c), c.textContent]) }));
		return { world: g && g.getAttribute('transform'), els: els };
	});
}
function firstDifference(a, b) {
	if (a.world !== b.world) { return 'view ' + a.world + ' vs ' + b.world; }
	if (a.els.length !== b.els.length) { return a.els.length + ' elements vs ' + b.els.length; }
	for (let i = 0; i < a.els.length; i++) {
		const x = JSON.stringify(a.els[i]), y = JSON.stringify(b.els[i]);
		if (x !== y) { return 'element ' + i + ': ' + x.slice(0, 220) + '\n        vs ' + y.slice(0, 220); }
	}
	return null;
}
async function openNet1(a, url) {
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.page.goto(url, { waitUntil: 'load' });
	await a.settle(400);
	await a.answerTrainingPanel().catch(() => {});
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1500);
}

// A php -S of our own over an exported tree, for the base. The same three rules env.js keeps: an
// OS-assigned port, a docroot with an `engcalcs` symlink, and proof the server is serving that tree.
function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.on('error', reject);
		srv.listen(0, '127.0.0.1', () => { const p = srv.address().port; srv.close(() => resolve(p)); });
	});
}
async function serveTree(tree, envVars) {
	const docroot = fs.mkdtempSync(path.join(os.tmpdir(), 'engcalcs-seam-base-root-'));
	fs.symlinkSync(tree, path.join(docroot, 'engcalcs'), 'dir');
	const port = await freePort(), origin = 'http://127.0.0.1:' + port;
	const proc = spawn('php', ['-d', 'pcre.jit=0', '-d', 'display_errors=0', '-S', '127.0.0.1:' + port, '-t', docroot],
		{ cwd: docroot, stdio: ['ignore', 'ignore', 'ignore'], env: Object.assign({}, process.env, envVars) });
	const probe = fs.readFileSync(path.join(tree, 'js/lpn-geom.js'), 'utf8');
	for (let i = 0; i < 100; i++) {
		try {
			const r = await fetch(origin + '/engcalcs/js/lpn-geom.js');
			if (r.status === 200 && (await r.text()) === probe) {
				return { origin, stop: () => { try { proc.kill(); } catch (e) { /* gone */ } fs.rmSync(docroot, { recursive: true, force: true }); } };
			}
		} catch (e) { /* not up yet */ }
		await new Promise((r) => setTimeout(r, 150));
	}
	try { proc.kill(); } catch (e) { /* gone */ }
	throw new Error('the base server on ' + origin + ' never served ' + tree);
}

// A placer that states every shape the contract allows, so the drawing of each is proved: a
// right-aligned stack on a straight leader, the one standard hook, a turned single-row label with
// rows dropped, a hidden label, and a node label laid out as one line. Source text, so the very
// same function runs in the page and here.
const EVERY_SHAPE_SRC = `function (scene) {
	var out = {}, H = scene.text.rowHeightPx;
	scene.labels.forEach(function (req, i) {
		var a = req.anchor, all = req.rows.map(function (r, k) { return k; });
		var wMax = Math.max.apply(null, req.rows.map(function (r) { return r.w; }));
		var hSum = req.rows.reduce(function (s, r) { return s + r.h; }, 0);
		switch (i % 5) {
		case 0:
			out[req.id] = { shown: true, rows: all, layout: 'stack', align: 'right',
				x: a.x - 40 - wMax, y: a.y + 20, leader: [[a.x, a.y], [a.x - 40, a.y + 20 + H / 2]] };
			break;
		case 1:
			out[req.id] = { shown: true, rows: all, layout: 'stack', align: 'left', x: a.x + 30, y: a.y - 30 - H / 2,
				leader: [[a.x, a.y], [a.x + 20, a.y - 30], [a.x + 30, a.y - 30]] };
			break;
		case 2:
			out[req.id] = { shown: true, rows: [0], layout: 'stack', align: 'center', angle: 30,
				x: a.x + 5, y: a.y + 5, leader: null };
			break;
		case 3:
			out[req.id] = { shown: false };
			break;
		default:
			out[req.id] = { shown: true, rows: all, layout: 'line', align: 'left', x: a.x + 8, y: a.y - 8 - H, leader: null };
		}
	});
	return { labels: out };
}`;

async function sectionEveryShape(a, scene0) {
	const page = a.page;
	await page.evaluate((src) => { EngCalcs.lpnPlacers.trivial.place = new Function('return ' + src)(); }, EVERY_SHAPE_SRC);
	const before = await page.evaluate(() => EngCalcs.lpnPlacerLast.step);
	// A wheel notch over the middle of the canvas: a zoom, then the settle that lays it out.
	const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
	await page.mouse.move(c.x, c.y);
	await page.mouse.wheel(0, -120);
	await a.settle(800);
	const last = await page.evaluate(() => ({ scene: EngCalcs.lpnPlacerLast.scene, step: EngCalcs.lpnPlacerLast.step }));
	ok('a zoom is laid out once it settles', last.step === before + 1, 'step ' + before + ' -> ' + last.step);
	const scene = last.scene, want = new Function('return ' + EVERY_SHAPE_SRC)()(scene).labels;
	const drawn = await page.evaluate((ids) => {
		const g = document.querySelector('#lpn_canvas g');
		const m = /translate\(([-0-9.e]+),([-0-9.e]+)\) scale\(([-0-9.e]+)\)/.exec(g.getAttribute('transform'));
		const tx = +m[1], ty = +m[2], s = +m[3], V = (x, y) => [+x * s + tx, +y * s + ty];
		const out = {};
		ids.forEach((id) => {
			const sel = id.charAt(0) === 'n' ? 'text[data-nodelbl="' + id.slice(2) + '"]' : 'text.lpn-lbl[data-linklbl="' + id.slice(2) + '"]:not([data-repeat])';
			const t = document.querySelector('#lpn_canvas ' + sel);
			const lines = [];
			for (let e = t.previousElementSibling; e && e.tagName === 'line'; e = e.previousElementSibling) { lines.unshift(e); }
			// The hook is cloned in right after the leader, so both stand just before the text.
			const shown = lines.filter((e) => getComputedStyle(e).display !== 'none')
				.map((e) => [V(e.getAttribute('x1'), e.getAttribute('y1')), V(e.getAttribute('x2'), e.getAttribute('y2'))]);
			out[id] = { vis: getComputedStyle(t).visibility, anchor: t.getAttribute('text-anchor'),
				transform: t.getAttribute('transform') || '', rows: Array.from(t.children).filter((k) => k.getAttribute('x') !== null).length,
				tspans: t.children.length, legs: shown };
		});
		return out;
	}, Object.keys(want));
	const bad = { leader: [], hook: [], align: [], angle: [], rows: [], hidden: [] };
	const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) <= 1;
	Object.keys(want).forEach((id) => {
		const w = want[id], d = drawn[id];
		if (!w.shown) { if (d.vis !== 'hidden') { bad.hidden.push(id); } return; }
		if (d.vis === 'hidden') { bad.hidden.push(id); return; }
		const L = w.leader;
		if (!L) { if (d.legs.length) { bad.leader.push(id); } }
		else if (L.length === 2) {
			if (d.legs.length !== 1 || !near(d.legs[0][0], L[0]) || !near(d.legs[0][1], L[1])) { bad.leader.push(id); }
		} else if (d.legs.length !== 2 || !near(d.legs[0][0], L[0]) || !near(d.legs[0][1], L[1])
			|| !near(d.legs[1][0], L[1]) || !near(d.legs[1][1], L[2])) { bad.hook.push(id + ' ' + JSON.stringify(d.legs)); }
		const anchorWant = w.align === 'right' ? 'end' : (w.align === 'center' ? 'middle' : 'start');
		if (d.anchor !== anchorWant) { bad.align.push(id + ' ' + d.anchor); }
		if (!!w.angle !== /rotate\(30 /.test(d.transform)) { bad.angle.push(id + ' ' + d.transform); }
		if (d.rows !== (w.layout === 'line' ? 1 : w.rows.length)) { bad.rows.push(id + ' ' + d.rows); }
	});
	const n = (k) => Object.keys(want).filter((id) => { const w = want[id]; return k(w); }).length;
	ok('straight leaders drawn from and to the stated points, within 1 px', !bad.leader.length, bad.leader.slice(0, 4).join(', ') || n((w) => w.leader && w.leader.length === 2) + ' leaders');
	ok('the standard hook drawn as its two legs, within 1 px', !bad.hook.length, bad.hook.slice(0, 2).join(', ') || n((w) => w.leader && w.leader.length === 3) + ' hooks');
	ok('right, centre and left alignment reach the text', !bad.align.length, bad.align.slice(0, 4).join(', '));
	ok('a turned label is turned, and only it', !bad.angle.length, bad.angle.slice(0, 3).join(', '));
	ok('dropped rows are not drawn; a node label can be one line', !bad.rows.length, bad.rows.slice(0, 4).join(', '));
	ok('a label stated hidden is hidden, and no other is', !bad.hidden.length, bad.hidden.slice(0, 4).join(', ') || n((w) => !w.shown) + ' hidden');
}

// ---- 1. the trivial placer drives the real page -------------------------------------------------
async function sectionPlacer(Session, browser, env) {
	console.log('\n--- 1. ?placer=trivial on Net1 (development): every label where the placer says ---');
	const trivial = require(path.join(REPO, 'dev/lpn-spike/label-bench/placers/trivial.js'));
	const a = await Session.open(browser, 'placer');
	try {
		await openNet1(a, env.pageUrl('Looped-Network.php?ec_nolog=1&placer=trivial'));
		const page = a.page;
		const live = await page.evaluate(() => ({
			name: EngCalcs.lpnPlacerName || null,
			last: EngCalcs.lpnPlacerLast ? { scene: EngCalcs.lpnPlacerLast.scene, step: EngCalcs.lpnPlacerLast.step, ms: EngCalcs.lpnPlacerLast.ms } : null
		}));
		ok('the page registered and named the placer', live.name === 'trivial', String(live.name));
		ok('the placer laid the map out', !!(live.last && live.last.scene), live.last ? 'layout ' + live.last.step + ', ' + live.last.ms.toFixed(2) + ' ms' : 'none');
		if (!live.last || !live.last.scene) { return; }
		const scene = live.last.scene;
		ok('the scene asks for labels', scene.labels.length > 10, scene.labels.length + ' labels requested');
		ok('rows are measured in the real font, not the stub\'s 6 px advance',
			scene.labels.some((r) => r.rows.some((w) => w.text.length > 1 && Math.abs(w.w - w.text.length * 6 * scene.text.sizePx / 11) > 0.5)));
		const want = trivial.place(scene).labels;
		const drawn = await page.evaluate((ids) => {
			const g = document.querySelector('#lpn_canvas g');
			const m = /translate\(([-0-9.e]+),([-0-9.e]+)\) scale\(([-0-9.e]+)\)/.exec(g.getAttribute('transform'));
			const tx = +m[1], ty = +m[2], s = +m[3], cv = document.getElementById('lpn_canvas'), r = cv.getBoundingClientRect();
			// The view's origin is the canvas's CONTENT box: inside its border, which is where
			// state.tx/ty are measured from.
			const c = { left: r.left + (cv.clientLeft || 0), top: r.top + (cv.clientTop || 0) };
			const out = {};
			ids.forEach((id) => {
				const sel = id.charAt(0) === 'n' ? 'text[data-nodelbl="' + id.slice(2) + '"]' : 'text.lpn-lbl[data-linklbl="' + id.slice(2) + '"]:not([data-repeat])';
				const t = document.querySelector('#lpn_canvas ' + sel);
				if (!t) { out[id] = null; return; }
				const b = t.getBoundingClientRect(), fs = parseFloat(t.style.fontSize);
				const holderLeader = t.previousElementSibling && t.previousElementSibling.tagName === 'line' ? t.previousElementSibling : null;
				out[id] = { x: +t.getAttribute('x') * s + tx, base: +t.getAttribute('y') * s + ty, fsPx: fs * s,
					anchor: t.getAttribute('text-anchor'), vis: getComputedStyle(t).visibility,
					rows: Array.from(t.children).filter((k) => k.getAttribute('x') !== null).length,
					box: { l: b.left - c.left, t: b.top - c.top, r: b.right - c.left, b: b.bottom - c.top },
					leader: holderLeader ? getComputedStyle(holderLeader).display : 'none' };
			});
			return out;
		}, Object.keys(want));
		let worstAnchor = 0, worstBox = 0, worstBoxAt = '', missing = [], hidden = [], leaders = [], rowsOff = [], worstId = '';
		Object.keys(want).forEach((id) => {
			const w = want[id], d = drawn[id];
			if (!d) { missing.push(id); return; }
			if (d.vis === 'hidden') { hidden.push(id); return; }
			if (d.leader !== 'none') { leaders.push(id); }
			const req = scene.labels.find((r) => r.id === id);
			const nRows = w.layout === 'line' ? 1 : w.rows.length;
			if (d.rows !== nRows) { rowsOff.push(id + ' ' + d.rows + '/' + nRows); }
			const dA = Math.max(Math.abs(d.x - w.x), Math.abs(d.base - (w.y + 0.85 * d.fsPx)));
			if (dA > worstAnchor) { worstAnchor = dA; worstId = id; }
			// The drawn ink lies inside the block the placer stated: left edge on x, top inside the
			// first row's pitch, right edge within the stated width.
			const H = w.layout === 'line' ? req.rows[0].h : req.rows.reduce((s, r) => s + r.h, 0);
			const W = w.layout === 'line'
				? req.rows.reduce((s, r) => s + r.w, 0) + (req.rows.length - 1) * scene.text.separatorW
				: Math.max.apply(null, req.rows.map((r) => r.w));
			const dB = Math.max(Math.abs(d.box.l - w.x), Math.max(0, w.y - d.box.t), Math.max(0, d.box.b - (w.y + H)),
				Math.max(0, d.box.r - (w.x + W)));
			if (dB > worstBox) { worstBoxAt = id + ' ' + JSON.stringify({ box: d.box, x: w.x, y: w.y, W: W, H: H }); }
			worstBox = Math.max(worstBox, dB);
		});
		ok('every requested label is drawn', !missing.length && !hidden.length, (missing.concat(hidden)).slice(0, 5).join(', ') || Object.keys(want).length + ' drawn');
		ok('every label\'s anchor is where the placer put it, within 1 px', worstAnchor <= 1, 'worst ' + worstAnchor.toFixed(3) + ' px' + (worstId ? ' (' + worstId + ')' : ''));
		ok('every label\'s drawn box lies in the block the placer stated, within 1.5 px', worstBox <= 1.5, 'worst ' + worstBox.toFixed(3) + ' px' + (worstBox > 1.5 ? ' ' + worstBoxAt : ''));
		ok('every label shows every row, in its stated shape', !rowsOff.length, rowsOff.slice(0, 4).join(', '));
		ok('no leader is drawn (the trivial placer states none)', !leaders.length, leaders.slice(0, 5).join(', '));
		ok('hand-placed labels are passed in', scene.labels.some((r) => r.hand), scene.labels.filter((r) => r.hand).map((r) => r.id).join(', '));

		await sectionEveryShape(a, scene);

		// T1: a pan held in the hand places nothing; its release is followed by a layout.
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		const step0 = await page.evaluate(() => EngCalcs.lpnPlacerLast.step);
		// An empty spot to grab: the canvas corner, away from Net1's drawing.
		const from = { x: c.x + 30, y: c.y + c.h - 40 };
		await page.mouse.move(from.x, from.y);
		await page.mouse.down();
		for (let k = 1; k <= 10; k++) { await page.mouse.move(from.x + 12 * k, from.y - 4 * k); await page.waitForTimeout(40); }
		await page.waitForTimeout(600);
		const stepHeld = await page.evaluate(() => EngCalcs.lpnPlacerLast.step);
		await page.mouse.up();
		await a.settle(700);
		const stepAfter = await page.evaluate(() => EngCalcs.lpnPlacerLast.step);
		ok('no layout while the pan is held (T1)', stepHeld === step0, 'step ' + step0 + ' -> ' + stepHeld);
		ok('one layout once it settles', stepAfter === step0 + 1, 'step ' + stepHeld + ' -> ' + stepAfter);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
	} finally {
		await a.close();
	}
}

// ---- 1b. R15: no label is shown at a view no layout was made for --------------------------------
// Tom, 2026-09-28: "when jumping into an untested (unfamiliar) view, hide the labels immediately
// while you calculate positions instead of showing them in unconfirmed positions". The trivial
// placer is slowed to SLOW_MS a layout so any frame drawn while one is pending is caught. A frame
// recorder notes, on every animation frame: the map's scale, the scale of the last layout, and how
// many node and link data labels are visible. Placer D's first layout of a project took ~0.5 s,
// and until it came every label of the new project stood in one row across the lower screen
// (2026-09-28, headless Chrome on 8133: 69 of Novato's labels at y = 792) -- which is what he saw.
const SLOW_MS = 300;
async function installRecorder(page, slowMs) {
	await page.evaluate((ms) => {
		const P = EngCalcs.lpnPlacers.trivial;
		if (!P.__slowed) {
			const fast = P.place;
			P.place = function (scene, o) { const t = performance.now(); while (performance.now() - t < ms) { /* busy */ } return fast.call(this, scene, o); };
			P.__slowed = true;
		}
		window.__r15 = [];
		const g = () => document.querySelector('#lpn_canvas g');
		function frame() {
			const m = /scale\(([-0-9.e]+)\)/.exec((g() && g().getAttribute('transform')) || '');
			let vis = 0;
			document.querySelectorAll('#lpn_canvas text[data-nodelbl], #lpn_canvas text.lpn-lbl[data-linklbl]').forEach((t) => {
				if (t.textContent && getComputedStyle(t).visibility !== 'hidden') { vis++; }
			});
			const L = EngCalcs.lpnPlacerLast;
			window.__r15.push({ t: performance.now(), s: m ? +m[1] : null, laid: L && L.scene ? L.scene.view.s : null,
				set: L && L.scene ? L.scene.set : null, step: L ? L.step : null, vis: vis, pending: !!EngCalcs.lpnPlacerPending });
			window.__r15id = requestAnimationFrame(frame);
		}
		frame();
	}, slowMs);
}
async function takeRecord(page) {
	return page.evaluate(() => { cancelAnimationFrame(window.__r15id); const r = window.__r15; window.__r15 = []; return r; });
}
async function sectionPending(Session, browser, env) {
	console.log('\n--- 1b. R15: labels hidden while a layout for an unfamiliar view is pending ---');
	const a = await Session.open(browser, 'pending');
	try {
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1&placer=trivial'), { waitUntil: 'load' });
		await a.settle(400);
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		// (a) Opening a project: no label of it is shown before its first layout.
		await installRecorder(page, SLOW_MS);
		const before = await page.evaluate(() => EngCalcs.lpnPlacerLast ? EngCalcs.lpnPlacerLast.scene.set : null);
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		let rec = await takeRecord(page);
		const opened = rec.filter((f) => f.set !== before && f.set !== null);
		const early = rec.filter((f) => f.vis > 0 && (f.set === before || f.set === null));
		ok('opening a project shows none of its labels before its first layout', opened.length > 0 && !early.length,
			early.length ? early.length + ' frame(s), first with ' + early[0].vis + ' labels' : rec.length + ' frames, ' + opened.length + ' after the layout');
		ok('and shows them once it is laid out', opened.length > 0 && opened[opened.length - 1].vis > 10, opened.length ? opened[opened.length - 1].vis + ' labels' : 'no layout');
		// (b) A zoom: from the first frame at a new scale until the layout for it, nothing is shown.
		const c = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
		await installRecorder(page, SLOW_MS);
		await page.mouse.move(c.x + c.w / 2, c.y + c.h / 2);
		await page.mouse.wheel(0, -120);
		await a.settle(1200);
		rec = await takeRecord(page);
		const stale = rec.filter((f) => f.vis > 0 && f.laid && f.s && Math.abs(f.s / f.laid - 1) > 0.005);
		const zoomed = rec.filter((f) => f.laid && f.s && Math.abs(f.s / rec[0].s - 1) > 0.005);
		ok('a zoom hides every data label until the layout for the new scale', zoomed.length > 0 && !stale.length,
			stale.length ? stale.length + ' frame(s) showed labels at an unlaid scale, e.g. ' + JSON.stringify(stale[0]) : zoomed.length + ' frames at the new scale');
		ok('and shows them again once laid out', rec.length > 0 && rec[rec.length - 1].vis > 10 && !rec[rec.length - 1].pending,
			JSON.stringify(rec[rec.length - 1]));
		// (c) An ordinary pan at the same scale never blanks them and never enters the pending state.
		const vis0 = rec[rec.length - 1].vis;
		await installRecorder(page, SLOW_MS);
		const from = { x: c.x + 30, y: c.y + c.h - 40 };
		await page.mouse.move(from.x, from.y);
		await page.mouse.down();
		for (let k = 1; k <= 10; k++) { await page.mouse.move(from.x + 8 * k, from.y - 3 * k); await page.waitForTimeout(30); }
		await page.mouse.up();
		await a.settle(1000);
		rec = await takeRecord(page);
		const blank = rec.filter((f) => f.vis < vis0 - 2 || f.pending);
		ok('a small pan never hides the labels (R15 is not a blink on every move)', rec.length > 5 && !blank.length,
			blank.length ? blank.length + ' frame(s), e.g. ' + JSON.stringify(blank[0]) : rec.length + ' frames, ' + vis0 + ' labels throughout');
		// (d) R10: the hide is one class on the labels layer, so it costs a pan or zoom nothing.
		const cls = await page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-placer-pending').length);
		ok('the pending state is one class on the labels layer, cleared once laid out', cls === 0, cls + ' element(s) still carry it');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 1).join(' | '));
	} finally {
		await a.close();
	}
}

// ---- 2. no parameter: the page as the base tree drew it -----------------------------------------
async function sectionUnchanged(Session, browser, env) {
	console.log('\n--- 2. no parameter: every label exactly as the base tree drew it ---');
	let base = process.env.LABEL_SEAM_BASE || '';
	try {
		base = execFileSync('git', ['rev-parse', base || 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim();
		if (!process.env.LABEL_SEAM_BASE) {
			base = execFileSync('git', ['merge-base', 'HEAD', 'master'], { cwd: REPO, encoding: 'utf8' }).trim();
		}
	} catch (e) { base = ''; }
	const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim();
	if (!base || base === head) {
		console.log('  ..   SKIPPED: the base is this commit (' + head.slice(0, 8) + '), so there is no earlier tree to compare with. Set LABEL_SEAM_BASE=<ref> to name one.');
		return;
	}
	const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'engcalcs-seam-base-'));
	let srv = null;
	try {
		execSync('git archive ' + base + ' -- ":(glob)*.php" lib js css icons examples | tar -x -C ' + JSON.stringify(tree), { cwd: REPO, stdio: ['ignore', 'ignore', 'inherit'] });
		srv = await serveTree(tree, { APP_ENV: 'development' });
		const a = await Session.open(browser, 'base'), b = await Session.open(browser, 'ours');
		try {
			await openNet1(a, srv.origin + '/engcalcs/Looped-Network.php?ec_nolog=1');
			await openNet1(b, env.pageUrl('Looped-Network.php?ec_nolog=1'));
			const x = await labelSnapshot(a.page), y = await labelSnapshot(b.page);
			const diff = firstDifference(x, y);
			ok('labels, leaders and grab shapes identical to ' + base.slice(0, 8), !diff && y.els.length > 20, diff || y.els.length + ' elements');
			const reg = await b.page.evaluate(() => ({ name: EngCalcs.lpnPlacerName, last: !!EngCalcs.lpnPlacerLast }));
			ok('no placer is named or has run', !reg.name && !reg.last);
			ok('no uncaught page errors', a.errors.length === 0 && b.errors.length === 0, a.errors.concat(b.errors).slice(0, 1).join(' | '));
		} finally {
			await a.close();
			await b.close();
		}
	} finally {
		if (srv) { srv.stop(); }
		fs.rmSync(tree, { recursive: true, force: true });
	}
}

// ---- 3. production ignores the parameter --------------------------------------------------------
async function sectionProduction(Session, browser, env) {
	console.log('\n--- 3. production (no APP_ENV): ?placer=trivial is ignored ---');
	const html = await (await fetch(env.pageUrl('Looped-Network.php?ec_nolog=1&placer=trivial'))).text();
	ok('no placer script in the page', !/lpn-placer-|lpn-label-scene/.test(html));
	const a = await Session.open(browser, 'prod-param'), b = await Session.open(browser, 'prod-plain');
	try {
		await openNet1(a, env.pageUrl('Looped-Network.php?ec_nolog=1&placer=trivial'));
		await openNet1(b, env.pageUrl('Looped-Network.php?ec_nolog=1'));
		const reg = await a.page.evaluate(() => ({ name: EngCalcs.lpnPlacerName, placers: !!EngCalcs.lpnPlacers, last: !!EngCalcs.lpnPlacerLast }));
		ok('no placer is registered or has run', !reg.name && !reg.placers && !reg.last, JSON.stringify(reg));
		const diff = firstDifference(await labelSnapshot(a.page), await labelSnapshot(b.page));
		ok('labels identical with and without the parameter', !diff, diff || '');
		ok('no uncaught page errors', a.errors.length === 0 && b.errors.length === 0, a.errors.concat(b.errors).slice(0, 1).join(' | '));
	} finally {
		await a.close();
		await b.close();
	}
}

async function devRefusals(env) {
	// On a development host a name outside [a-z0-9-], or one naming no file, emits nothing.
	for (const bad of ['..%2Fx', 'Trivial', 'no-such-placer']) {
		const html = await (await fetch(env.pageUrl('Looped-Network.php?ec_nolog=1&placer=' + bad))).text();
		ok('development: ?placer=' + bad + ' loads nothing', !/lpn-placer-|lpn-label-scene/.test(html));
	}
	const good = await (await fetch(env.pageUrl('Looped-Network.php?ec_nolog=1&placer=trivial'))).text();
	ok('development: ?placer=trivial loads the scene builder and the placer', /js\/lpn-label-scene\.js/.test(good) && /js\/lpn-placer-trivial\.js/.test(good));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const savedEnv = process.env.APP_ENV;
	try {
		process.env.APP_ENV = 'development';
		await env.startServer();
		await devRefusals(env);
		await sectionPlacer(Session, browser, env);
		await sectionPending(Session, browser, env);
		await sectionUnchanged(Session, browser, env);
		env.stopServer();
		delete process.env.APP_ENV;
		await env.startServer();
		await sectionProduction(Session, browser, env);
	} finally {
		if (savedEnv === undefined) { delete process.env.APP_ENV; } else { process.env.APP_ENV = savedEnv; }
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

if (process.env[LOCK_ENV] === '1') {
	sectionNodeCopy();
	sectionRegistration();
	main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
}
